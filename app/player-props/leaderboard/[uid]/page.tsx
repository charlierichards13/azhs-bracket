// this is the page for viewing the individual person bracket
// indexed by uid

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { doc, onSnapshot, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { TOURNAMENT_ID } from "@/lib/tournament";

type PlayerPropDoc = {
  playerName?: string;
  teamName?: string;
  statKey?: string;
  line?: number;
  active?: boolean;
  order?: number;
  notes?: string;
};

type PlayerProp = PlayerPropDoc & { id: string };

type PropsLeaderboardDoc = {
  userId?: string;
  displayName?: string;
  picks?: Record<string, "over" | "under">;
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

function fmtTime(ts: any) {
  try {
    if (!ts) return "";
    if (typeof ts?.toDate === "function") return ts.toDate().toLocaleString();
    return String(ts);
  } catch {
    return "";
  }
}

export default function PlayerPropsEntryPage() {
  const params = useParams<{ uid: string }>();
  const uid = params?.uid;

  const [msg, setMsg] = useState("");
  const [userRow, setUserRow] = useState<(PropsLeaderboardDoc & { id: string }) | null>(null);
  const [props, setProps] = useState<PlayerProp[]>([]);

  useEffect(() => {
    if (!uid) return;

    const ref = doc(db, "tournaments", TOURNAMENT_ID, "playerPropLeaderboard", uid);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) {
          setUserRow(null);
          setMsg("That user has no public props picks yet.");
          return;
        }
        setMsg("");
        setUserRow({ id: snap.id, ...(snap.data() as PropsLeaderboardDoc) });
      },
      (err) => {
        console.error(err);
        setMsg("Error loading user picks.");
      }
    );

    return () => unsub();
  }, [uid]);

  useEffect(() => {
    const ref = collection(db, "tournaments", TOURNAMENT_ID, "playerProps");
    const unsub = onSnapshot(
      ref,
      (snap) => {
        const rows: PlayerProp[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as PlayerPropDoc),
        }));
        rows.sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
        setProps(rows.filter((p) => p.active !== false));
      },
      (err) => {
        console.error(err);
        setMsg("Error loading props list.");
      }
    );

    return () => unsub();
  }, []);

  const picks = userRow?.picks || {};
  const pickCount = Object.keys(picks).length;

  const rows = useMemo(() => {
    return props.map((p) => ({
      prop: p,
      choice: picks[p.id] ?? null,
    }));
  }, [props, picks]);

  return (
    <main style={{ padding: 24, fontFamily: "system-ui", color: "#fff" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0 }}>
            Player Props — {userRow?.displayName || userRow?.id || "Unknown"}
          </h1>
          <div style={{ marginTop: 8, opacity: 0.75 }}>
            Picks made: <b>{pickCount}</b> &nbsp;|&nbsp; Last updated:{" "}
            {fmtTime(userRow?.updatedAt || userRow?.createdAt)}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="/player-props/leaderboard" style={{ opacity: 0.9, color: "#fff" }}>
            ← Back to Props Leaderboard
          </Link>
          <Link href="/player-props" style={{ opacity: 0.9, color: "#fff" }}>
            ← Player Props
          </Link>
        </div>
      </div>

      {msg ? <div style={{ marginTop: 12, color: "#ffb4b4" }}>{msg}</div> : null}

      <div
        style={{
          marginTop: 16,
          border: "1px solid #222",
          borderRadius: 14,
          background: "rgba(0,0,0,0.25)",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: 14, borderBottom: "1px solid #1d1d1d", opacity: 0.8 }}>
          Live picks (updates automatically)
        </div>

        <div style={{ display: "grid", gap: 10, padding: 14 }}>
          {rows.map(({ prop, choice }) => {
            const title = `${prop.playerName || "Player"}${prop.teamName ? ` (${prop.teamName})` : ""}`;
            const lineText = typeof prop.line === "number" ? String(prop.line) : "—";

            return (
              <div
                key={prop.id}
                style={{
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 14,
                  padding: 12,
                  background: "rgba(255,255,255,0.04)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                  <div style={{ fontWeight: 900 }}>{title}</div>
                  <div style={{ opacity: 0.85, fontSize: 13 }}>
                    <b>{statLabel(prop.statKey)}</b> O/U <b>{lineText}</b>
                  </div>
                </div>

                {prop.notes ? (
                  <div style={{ marginTop: 6, opacity: 0.75, fontSize: 13 }}>{prop.notes}</div>
                ) : null}

                <div style={{ marginTop: 10 }}>
                  {choice ? (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "7px 10px",
                        borderRadius: 999,
                        border:
                          choice === "over"
                            ? "1px solid rgba(120,255,170,0.45)"
                            : "1px solid rgba(255,120,120,0.45)",
                        background:
                          choice === "over"
                            ? "rgba(120,255,170,0.12)"
                            : "rgba(255,120,120,0.10)",
                        fontWeight: 900,
                        letterSpacing: 0.2,
                      }}
                    >
                      {choice === "over" ? "⬆️ OVER" : "⬇️ UNDER"}
                    </span>
                  ) : (
                    <span style={{ opacity: 0.7, fontSize: 13 }}>No pick</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}