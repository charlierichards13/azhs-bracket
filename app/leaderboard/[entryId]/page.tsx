//Gonna use this file to allow viewing of other people's brackets and the leaderboard. Will also have a link to the admin page for easy access


"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { listGames, Game } from "../../../lib/games";

const TOURNAMENT_ID = "azhs-2026";

const POINTS_BY_ROUND: Record<number, number> = {
  1: 1,
  2: 2,
  3: 4,
  4: 8,
  5: 16,
};

type EntryDoc = {
  userId?: string;
  displayName?: string;
  locked?: boolean;
  picks?: Record<string, string>; // { R1G1: "teamId", ... }
  createdAt?: any;
  updatedAt?: any;
};

type Team = {
  id: string;
  name: string;
  seed?: number | null;
};

function fmtTime(ts: any) {
  try {
    if (!ts) return "";
    if (typeof ts?.toDate === "function") return ts.toDate().toLocaleString();
    return String(ts);
  } catch {
    return "";
  }
}

export default function EntryBracketPage() {
  const params = useParams<{ entryId: string }>();
  const entryId = params?.entryId;

  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const [entry, setEntry] = useState<(EntryDoc & { id: string }) | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    async function run() {
      setLoading(true);
      setMsg("");
      try {
        if (!entryId) {
          setMsg("Missing entry id.");
          return;
        }

        const [gamesList] = await Promise.all([listGames()]);
        setGames(gamesList);

        const entryRef = doc(db, `tournaments/${TOURNAMENT_ID}/entries/${entryId}`);
        const entrySnap = await getDoc(entryRef);

        if (!entrySnap.exists()) {
          setMsg("That entry was not found.");
          setEntry(null);
          return;
        }

        setEntry({ id: entrySnap.id, ...(entrySnap.data() as EntryDoc) });

        // Load teams so we can show names instead of raw ids
        const teamsSnap = await getDocs(
          collection(db, `tournaments/${TOURNAMENT_ID}/teams`)
        );
        const t = teamsSnap.docs.map((d) => {
          const data: any = d.data();
          return {
            id: d.id,
            name: data?.name ?? d.id,
            seed: typeof data?.seed === "number" ? data.seed : null,
          };
        });
        t.sort((a, b) => (a.seed ?? 999) - (b.seed ?? 999) || a.name.localeCompare(b.name));
        setTeams(t);
      } catch (e) {
        console.error(e);
        setMsg("Error loading bracket view. Check console/rules.");
      } finally {
        setLoading(false);
      }
    }
    run();
  }, [entryId]);

  const teamMap = useMemo(() => {
    const m = new Map<string, Team>();
    for (const t of teams) m.set(t.id, t);
    return m;
  }, [teams]);

  const decidedGames = useMemo(() => games.filter((g) => !!g.winnerId), [games]);

  const scoreSummary = useMemo(() => {
    const picks = entry?.picks || {};
    let score = 0;
    let correct = 0;

    for (const g of decidedGames) {
      const pick = picks[g.id];
      if (pick && g.winnerId && pick === g.winnerId) {
        correct += 1;
        score += POINTS_BY_ROUND[g.round] ?? 1;
      }
    }

    return {
      score,
      correct,
      decided: decidedGames.length,
      pickedCount: Object.keys(picks).length,
    };
  }, [entry, decidedGames]);

  const gamesByRound = useMemo(() => {
    const by: Record<number, Game[]> = {};
    for (const g of games) {
      by[g.round] = by[g.round] || [];
      by[g.round].push(g);
    }
    for (const r of Object.keys(by)) {
      by[Number(r)].sort((a, b) => a.game - b.game);
    }
    return by;
  }, [games]);

  function teamName(teamId: string | null | undefined) {
    if (!teamId) return "TBD";
    return teamMap.get(teamId)?.name ?? teamId;
  }

  if (loading) {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui", color: "#fff" }}>
        <h1 style={{ margin: 0 }}>Bracket</h1>
        <p style={{ opacity: 0.75 }}>Loading…</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui", color: "#fff" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
        <h1 style={{ margin: 0 }}>
          Bracket — {entry?.displayName || entry?.id || "Unknown"}
        </h1>

        <Link href="/leaderboard" style={{ opacity: 0.85, color: "#fff" }}>
          ← Back to Leaderboard
        </Link>
      </div>

      <p style={{ opacity: 0.75, marginTop: 8 }}>
        Score: <b>{scoreSummary.score}</b> &nbsp;|&nbsp; Correct:{" "}
        <b>
          {scoreSummary.correct}/{scoreSummary.decided}
        </b>
        &nbsp;|&nbsp; Picks made: <b>{scoreSummary.pickedCount}/31</b>
      </p>

      <p style={{ opacity: 0.65, marginTop: 6 }}>
        Last updated: {fmtTime(entry?.updatedAt || entry?.createdAt)}
      </p>

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
          Picks (by game)
        </div>

        <div style={{ padding: 14 }}>
          {[1, 2, 3, 4, 5].map((round) => {
            const list = gamesByRound[round] || [];
            if (list.length === 0) return null;

            return (
              <div key={round} style={{ marginBottom: 18 }}>
                <div style={{ fontWeight: 800, marginBottom: 8, opacity: 0.9 }}>
                  Round {round}
                </div>

                <div style={{ display: "grid", gap: 8 }}>
                  {list.map((g) => {
                    const pick = entry?.picks?.[g.id] ?? null;
                    const isCorrect = !!pick && !!g.winnerId && pick === g.winnerId;
                    const isWrong = !!pick && !!g.winnerId && pick !== g.winnerId;

                    return (
                      <div
                        key={g.id}
                        style={{
                          borderRadius: 12,
                          border: "1px solid rgba(255,255,255,0.10)",
                          background: "rgba(0,0,0,0.22)",
                          padding: 12,
                          display: "grid",
                          gridTemplateColumns: "90px 1fr",
                          gap: 10,
                        }}
                      >
                        <div style={{ opacity: 0.8, fontWeight: 700 }}>{g.id}</div>

                        <div style={{ display: "grid", gap: 6 }}>
                          <div style={{ opacity: 0.85 }}>
                            Matchup:{" "}
                            <b>
                              {teamName(g.teamAId)} vs {teamName(g.teamBId)}
                            </b>
                          </div>

                          <div
                            style={{
                              opacity: 0.95,
                              fontWeight: 750,
                              padding: "6px 10px",
                              borderRadius: 10,
                              border: isCorrect
                                ? "1px solid rgba(120,255,170,0.35)"
                                : isWrong
                                ? "1px solid rgba(255,120,120,0.35)"
                                : "1px solid rgba(255,255,255,0.12)",
                              background: isCorrect
                                ? "rgba(120,255,170,0.08)"
                                : isWrong
                                ? "rgba(255,120,120,0.08)"
                                : "rgba(255,255,255,0.04)",
                            }}
                          >
                            Pick: {pick ? teamName(pick) : "—"}
                            {g.winnerId ? (
                              <span style={{ opacity: 0.75, fontWeight: 600 }}>
                                {" "}
                                (Winner: {teamName(g.winnerId)})
                              </span>
                            ) : (
                              <span style={{ opacity: 0.65, fontWeight: 600 }}>
                                {" "}
                                (Winner: TBD)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}