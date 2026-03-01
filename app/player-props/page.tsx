// this is a wip page for people to predict props on various players


"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { collection, doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { TOURNAMENT_ID } from "@/lib/tournament";

type PlayerPropDoc = {
  playerName?: string;
  teamName?: string;
  statKey?: string; // "points" | "assists" | "rebounds" | ...
  line?: number; // e.g., 22.5
  active?: boolean;
  order?: number;
  notes?: string;
  updatedAt?: any;
  createdAt?: any;
};

type PlayerProp = PlayerPropDoc & { id: string };

type PickDoc = {
  choice?: "over" | "under";
  propId?: string;
  updatedAt?: any;
  createdAt?: any;
};

function statLabel(statKey?: string) {
  switch (statKey) {
    case "points":
      return "Points";
    case "assists":
      return "Assists";
    case "rebounds":
      return "Rebounds";
    case "threes":
      return "3PT Made";
    case "steals":
      return "Steals";
    case "blocks":
      return "Blocks";
    case "pra":
      return "P+R+A";
    default:
      return statKey || "Stat";
  }
}

export default function PlayerPropsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [props, setProps] = useState<PlayerProp[]>([]);
  const [picks, setPicks] = useState<Record<string, "over" | "under">>({});

  const [status, setStatus] = useState("");

  // Auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setCheckingAuth(false);
    });
    return () => unsub();
  }, []);

  // Subscribe to props (public)
  useEffect(() => {
    const ref = collection(db, "tournaments", TOURNAMENT_ID, "playerProps");
    const unsub = onSnapshot(
      ref,
      (snap) => {
        const rows: PlayerProp[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as PlayerPropDoc),
        }));
        setProps(rows);
      },
      (err) => {
        console.error(err);
        setStatus("Could not load props right now.");
      }
    );

    return () => unsub();
  }, []);

  // Subscribe to current user's picks
  useEffect(() => {
    if (!user) {
      setPicks({});
      return;
    }

    const ref = collection(
      db,
      "tournaments",
      TOURNAMENT_ID,
      "playerPropPicks",
      user.uid,
      "picks"
    );

    const unsub = onSnapshot(
      ref,
      (snap) => {
        const m: Record<string, "over" | "under"> = {};
        snap.docs.forEach((d) => {
          const data = d.data() as PickDoc;
          if (data.choice === "over" || data.choice === "under") {
            m[d.id] = data.choice;
          }
        });
        setPicks(m);
      },
      (err) => {
        console.error(err);
        setStatus("Could not load your picks.");
      }
    );

    return () => unsub();
  }, [user]);

  const activeProps = useMemo(() => {
    return props
      .filter((p) => p.active !== false)
      .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
  }, [props]);

  async function doSignIn() {
    setStatus("");
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (e: any) {
      setStatus(`Sign-in failed: ${e?.message ?? String(e)}`);
    }
  }

  async function doSignOut() {
    setStatus("");
    try {
      await signOut(auth);
    } catch (e: any) {
      setStatus(`Sign-out failed: ${e?.message ?? String(e)}`);
    }
  }

  async function pick(propId: string, choice: "over" | "under") {
    setStatus("");
    if (!user) {
      setStatus("Please sign in to submit a prop pick.");
      return;
    }

    try {
      const ref = doc(
        db,
        "tournaments",
        TOURNAMENT_ID,
        "playerPropPicks",
        user.uid,
        "picks",
        propId
      );

      await setDoc(
        ref,
        {
          propId,
          choice,
          updatedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
        } satisfies PickDoc,
        { merge: true }
      );

      setStatus("✅ Saved.");
    } catch (e) {
      console.error(e);
      setStatus("Could not save your pick (check rules / permissions).");
    }
  }

  return (
    <main style={{ padding: 22, maxWidth: 960, margin: "0 auto", fontFamily: "system-ui" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0 }}>📊 Player Props</h1>
          <div style={{ marginTop: 6, opacity: 0.8 }}>
            Try your hand at predicting player props for the finals! These are separate from the main bracket and scored independently, so feel free to participate even if you’re not confident in your bracket picks.
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <Link href="/" style={{ textDecoration: "none", opacity: 0.9 }}>
            ← Home
          </Link>

          {checkingAuth ? (
            <span style={{ opacity: 0.75 }}>Checking auth…</span>
          ) : user ? (
            <>
              <span style={{ opacity: 0.9 }}>
                Signed in as <b>{user.displayName || user.email || "User"}</b>
              </span>
              <button onClick={doSignOut} style={btn()}>
                Sign out
              </button>
            </>
          ) : (
            <button onClick={doSignIn} style={btn(true)}>
              Sign in with Google
            </button>
          )}
        </div>
      </div>

      {status ? (
        <div style={{ marginTop: 12, padding: 10, border: "1px solid rgba(0,0,0,0.10)", borderRadius: 12 }}>
          {status}
        </div>
      ) : null}

      <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
        {activeProps.length === 0 ? (
          <div style={{ opacity: 0.8, padding: 14, border: "1px solid rgba(0,0,0,0.10)", borderRadius: 14 }}>
            No props posted yet. Check back soon.
          </div>
        ) : (
          activeProps.map((p) => {
            const chosen = picks[p.id];
            const title = `${p.playerName || "Player"}${p.teamName ? ` (${p.teamName})` : ""}`;
            const lineText =
              typeof p.line === "number" ? p.line.toString() : p.line ? String(p.line) : "—";

            return (
              <div
                key={p.id}
                style={{
                  border: "1px solid rgba(0,0,0,0.10)",
                  borderRadius: 16,
                  padding: 14,
                  background: "rgba(0,0,0,0.02)",
                }}
              >
                <div style={{ fontWeight: 900, fontSize: 16 }}>{title}</div>
                <div style={{ marginTop: 6, opacity: 0.85 }}>
                  <b>{statLabel(p.statKey)}</b> O/U <b>{lineText}</b>
                </div>
                {p.notes ? <div style={{ marginTop: 6, opacity: 0.75, fontSize: 13 }}>{p.notes}</div> : null}

                <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button
                    onClick={() => pick(p.id, "over")}
                    style={pickBtn(chosen === "over")}
                  >
                    Over
                  </button>
                  <button
                    onClick={() => pick(p.id, "under")}
                    style={pickBtn(chosen === "under")}
                  >
                    Under
                  </button>

                  {chosen ? (
                    <div style={{ alignSelf: "center", opacity: 0.8, fontSize: 13 }}>
                      Your pick: <b>{chosen.toUpperCase()}</b>
                    </div>
                  ) : (
                    <div style={{ alignSelf: "center", opacity: 0.7, fontSize: 13 }}>
                      No pick yet
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div style={{ marginTop: 18, opacity: 0.7, fontSize: 12, lineHeight: "18px" }}>
        Note: This competition is separate from the bracket challenge. We do not condone/encourage gambling and are not allowing cash prizes on this website. Charlie Richards and Greyson Beckett assume no responsibility for any bets placed based on the content of this page. This is just for fun and bragging rights!
      </div>
    </main>
  );
}

function btn(primary = false): React.CSSProperties {
  return {
    padding: "10px 14px",
    borderRadius: 12,
    border: primary ? "1px solid rgba(43,92,255,0.35)" : "1px solid rgba(0,0,0,0.18)",
    background: primary ? "rgba(43,92,255,0.08)" : "rgba(0,0,0,0.06)",
    cursor: "pointer",
    fontWeight: 800,
  };
}

function pickBtn(active: boolean): React.CSSProperties {
  return {
    padding: "10px 14px",
    borderRadius: 12,
    border: active ? "1px solid rgba(31,122,58,0.45)" : "1px solid rgba(0,0,0,0.18)",
    background: active ? "rgba(31,122,58,0.12)" : "rgba(0,0,0,0.06)",
    cursor: "pointer",
    fontWeight: 900,
  };
}