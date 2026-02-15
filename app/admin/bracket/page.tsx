"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

const TOURNAMENT_ID = "azhs-2026";

type TeamDoc = {
  id: string;
  name: string;
  seed?: number | null;
  logoPath?: string | null; // later
};

type GameDoc = {
  id: string; // e.g. R2G3
  round: number;
  gameNumber: number;

  teamAId: string | null;
  teamBId: string | null;

  // ✅ canonical winner field
  winnerId: string | null;
};

function parseGameId(id: string): { round: number; gameNumber: number } | null {
  const m = /^R(\d+)G(\d+)$/i.exec(id);
  if (!m) return null;
  return { round: Number(m[1]), gameNumber: Number(m[2]) };
}

function gameId(round: number, gameNumber: number) {
  return `R${round}G${gameNumber}`;
}

export default function AdminBracketPage() {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [teams, setTeams] = useState<Map<string, TeamDoc>>(new Map());
  const [games, setGames] = useState<GameDoc[]>([]);

  const [roundTab, setRoundTab] = useState<number>(1);
  const [status, setStatus] = useState<string>("");
  const [busy, setBusy] = useState<string | null>(null);

  // --- auth + admin check ---
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setChecking(false);

      if (!u) {
        setIsAdmin(false);
        return;
      }

      const adminRef = doc(db, "admins", u.uid);
      const snap = await getDoc(adminRef);
      setIsAdmin(snap.exists());
    });

    return () => unsub();
  }, []);

  // --- realtime load teams + games ---
  useEffect(() => {
    if (!isAdmin) return;

    const teamsCol = collection(db, "tournaments", TOURNAMENT_ID, "teams");
    const gamesCol = collection(db, "tournaments", TOURNAMENT_ID, "games");

    const unsubTeams = onSnapshot(teamsCol, (snap) => {
      const map = new Map<string, TeamDoc>();
      snap.docs.forEach((d) => {
        const data = d.data() as any;
        map.set(d.id, {
          id: d.id,
          name: data.name ?? d.id,
          seed: typeof data.seed === "number" ? data.seed : null,
          logoPath: data.logoPath ?? null,
        });
      });
      setTeams(map);
    });

    const unsubGames = onSnapshot(gamesCol, (snap) => {
      const rows: GameDoc[] = [];

      snap.docs.forEach((d) => {
        const parsed = parseGameId(d.id);
        if (!parsed) return;

        const data = d.data() as any;

        // ✅ normalize:
        // - prefer canonical winnerId
        // - fallback to legacy winnerTeamId if needed
        const winnerId = (data.winnerId ?? data.winnerTeamId ?? null) as string | null;

        rows.push({
          id: d.id,
          round: typeof data.round === "number" ? data.round : parsed.round,
          gameNumber: typeof data.game === "number" ? data.game : parsed.gameNumber,
          teamAId: data.teamAId ?? null,
          teamBId: data.teamBId ?? null,
          winnerId,
        });
      });

      rows.sort((a, b) => a.round - b.round || a.gameNumber - b.gameNumber);
      setGames(rows);
    });

    return () => {
      unsubTeams();
      unsubGames();
    };
  }, [isAdmin]);

  async function doGoogleSignIn() {
    setStatus("");
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (e: any) {
      setStatus(`Sign-in failed: ${e.message ?? String(e)}`);
    }
  }

  async function doSignOut() {
    setStatus("");
    await signOut(auth);
  }

  const gamesByRound = useMemo(() => {
    const map = new Map<number, GameDoc[]>();
    for (const g of games) {
      if (!map.has(g.round)) map.set(g.round, []);
      map.get(g.round)!.push(g);
    }
    for (const [r, arr] of map) {
      arr.sort((a, b) => a.gameNumber - b.gameNumber);
      map.set(r, arr);
    }
    return map;
  }, [games]);

  function teamLabel(teamId: string | null) {
    if (!teamId) return { text: "TBD", seed: null };
    const t = teams.get(teamId);
    if (!t) return { text: teamId, seed: null };
    const seed = typeof t.seed === "number" ? t.seed : null;
    const text = seed ? `${seed} · ${t.name}` : t.name;
    return { text, seed };
  }

  // Clears the propagated slot of THIS game in the NEXT rounds (recursive).
  async function clearPropagationFrom(round: number, gameNumber: number) {
    if (round >= 5) return;

    const nextRound = round + 1;
    const nextGameNum = Math.ceil(gameNumber / 2);
    const slotField = gameNumber % 2 === 1 ? "teamAId" : "teamBId";

    const nextId = gameId(nextRound, nextGameNum);
    const nextRef = doc(db, "tournaments", TOURNAMENT_ID, "games", nextId);

    await setDoc(
      nextRef,
      {
        [slotField]: null,

        // ✅ clear both canonical + legacy winner fields
        winnerId: null,
        winnerTeamId: null,

        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    await clearPropagationFrom(nextRound, nextGameNum);
  }

  async function setWinner(g: GameDoc, winnerId: string | null) {
    if (!isAdmin) return;

    setStatus("");
    setBusy(g.id);

    try {
      const gRef = doc(db, "tournaments", TOURNAMENT_ID, "games", g.id);

      // 1) set/clear winner on this game
      await setDoc(
        gRef,
        {
          // ✅ write canonical field
          winnerId: winnerId,

          // ✅ keep legacy field in sync (so any older code still works)
          winnerTeamId: winnerId,

          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      // 2) if not final, write winner into next round slot
      if (g.round < 5) {
        const nextRound = g.round + 1;
        const nextGameNum = Math.ceil(g.gameNumber / 2);
        const slotField = g.gameNumber % 2 === 1 ? "teamAId" : "teamBId";

        const nextId = gameId(nextRound, nextGameNum);
        const nextRef = doc(db, "tournaments", TOURNAMENT_ID, "games", nextId);

        await setDoc(
          nextRef,
          {
            [slotField]: winnerId ?? null,

            // whenever a participant changes, clear the next game's winner
            winnerId: null,
            winnerTeamId: null,

            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );

        // 3) clear downstream from that next game
        await clearPropagationFrom(nextRound, nextGameNum);
      }

      setStatus(
        winnerId
          ? `Winner set for ${g.id} → advanced to next round`
          : `Winner cleared for ${g.id} → downstream cleared`
      );
    } catch (e: any) {
      console.error(e);
      setStatus(`Error: ${e.message ?? String(e)}`);
    } finally {
      setBusy(null);
    }
  }

  // --- UI states ---
  if (checking) {
    return (
      <main style={{ padding: 24, color: "#fff" }}>
        <h1>Admin · Bracket</h1>
        <p>Checking permissions…</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main style={{ padding: 24, color: "#fff" }}>
        <h1>Admin · Bracket</h1>
        <p>You must sign in to continue.</p>
        <button onClick={doGoogleSignIn} style={btn()}>
          Sign in with Google
        </button>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main style={{ padding: 24, color: "#fff" }}>
        <h1>Admin · Bracket</h1>
        <p>Signed in as {user.displayName ?? user.email}</p>
        <p style={{ opacity: 0.8 }}>
          Not an admin for this app. (No admins/{user.uid} doc found.)
        </p>
        <button onClick={doSignOut} style={btn()}>
          Sign out
        </button>
      </main>
    );
  }

  const currentGames = gamesByRound.get(roundTab) ?? [];

  return (
    <main style={{ padding: 24, color: "#fff" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
        <div>
          <h1 style={{ margin: 0 }}>Admin · Bracket</h1>
          <p style={{ marginTop: 6, opacity: 0.85 }}>
            Click a team to set the winner. Winner auto-advances to the next round.
            If you change an earlier winner, downstream gets cleared automatically.
          </p>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ opacity: 0.85 }}>
            Signed in as <b>{user.displayName ?? user.email}</b>
          </div>
          <button onClick={doSignOut} style={{ ...btn(), marginTop: 8 }}>
            Sign out
          </button>
        </div>
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Link href="/admin" style={linkBtn()}>
          ← Back to Admin Home
        </Link>
        <Link href="/admin/teams" style={linkBtn()}>
          Manage Teams
        </Link>
      </div>

      <hr style={{ margin: "16px 0", borderColor: "rgba(255,255,255,0.12)" }} />

      <section style={card()}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[1, 2, 3, 4, 5].map((r) => (
            <button
              key={r}
              onClick={() => setRoundTab(r)}
              style={r === roundTab ? btnActive() : btnSecondary()}
            >
              Round {r}
            </button>
          ))}
        </div>

        {status && <p style={{ marginTop: 12, color: "#b7ffb7" }}>{status}</p>}
      </section>

      <section style={{ marginTop: 18 }}>
        <h2 style={{ marginBottom: 10 }}>
          Round {roundTab} Games ({currentGames.length})
        </h2>

        {currentGames.length === 0 ? (
          <p style={{ opacity: 0.85 }}>
            No games found for this round yet. (If Round 1 is empty, make sure you clicked
            “Generate Round 1 from Seeds” on the Teams page.)
          </p>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {currentGames.map((g) => {
              const a = teamLabel(g.teamAId);
              const b = teamLabel(g.teamBId);

              const aIsWinner = g.winnerId && g.winnerId === g.teamAId;
              const bIsWinner = g.winnerId && g.winnerId === g.teamBId;

              const disableA = !g.teamAId || busy === g.id;
              const disableB = !g.teamBId || busy === g.id;
              const disableClear = busy === g.id;

              return (
                <div key={g.id} style={gameCard()}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <div style={{ fontWeight: 700 }}>{g.id}</div>
                    <div style={{ opacity: 0.7 }}>
                      Winner: {g.winnerId ? teamLabel(g.winnerId).text : "—"}
                    </div>
                  </div>

                  <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                    <button
                      disabled={disableA}
                      onClick={() => setWinner(g, g.teamAId)}
                      style={aIsWinner ? pickBtnWinner() : pickBtn()}
                      title={g.teamAId ? "Set Team A as winner" : "TBD"}
                    >
                      {a.text}
                    </button>

                    <button
                      disabled={disableB}
                      onClick={() => setWinner(g, g.teamBId)}
                      style={bIsWinner ? pickBtnWinner() : pickBtn()}
                      title={g.teamBId ? "Set Team B as winner" : "TBD"}
                    >
                      {b.text}
                    </button>
                  </div>

                  <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
                    <button
                      disabled={disableClear}
                      onClick={() => setWinner(g, null)}
                      style={smallBtnDanger()}
                    >
                      Clear Winner
                    </button>

                    <span style={{ opacity: 0.7, alignSelf: "center" }}>
                      (auto-advances to next round)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

// --- styles (self-contained) ---
function card(): CSSProperties {
  return {
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 14,
    padding: 16,
    background: "rgba(255,255,255,0.03)",
    boxShadow: "0 10px 25px rgba(0,0,0,0.35)",
  };
}

function btn(): CSSProperties {
  return {
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.10)",
    color: "#fff",
    cursor: "pointer",
  };
}

function btnSecondary(): CSSProperties {
  return { ...btn(), background: "rgba(255,255,255,0.06)" };
}

function btnActive(): CSSProperties {
  return {
    ...btn(),
    background: "rgba(255,255,255,0.16)",
    border: "1px solid rgba(255,255,255,0.30)",
    fontWeight: 700,
  };
}

function linkBtn(): CSSProperties {
  return {
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    textDecoration: "none",
    display: "inline-block",
  };
}

function gameCard(): CSSProperties {
  return {
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 14,
    padding: 14,
    background: "rgba(0,0,0,0.30)",
  };
}

function pickBtn(): CSSProperties {
  return {
    textAlign: "left",
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  };
}

function pickBtnWinner(): CSSProperties {
  return {
    ...pickBtn(),
    border: "1px solid rgba(120,255,170,0.45)",
    background: "rgba(120,255,170,0.10)",
  };
}

function smallBtnDanger(): CSSProperties {
  return {
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid rgba(255,90,90,0.45)",
    background: "rgba(255,90,90,0.12)",
    color: "#fff",
    cursor: "pointer",
  };
}

// Created by Charles Richards ASU CS 2028
// Arizona highschool bracket project.

// Created by Charles Richards ASU CS 2028
// Arizona highschool bracket project.

// Created by Charles Richards ASU CS 2028
// Arizona highschool bracket project.