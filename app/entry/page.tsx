// The user side of the brackets will be in this mf file...
// Created by Charles Richards ASU CS 2028


"use client";

import React, { useEffect, useMemo, useState } from "react";
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
  onSnapshot,
  serverTimestamp,
  setDoc,
  getDoc,
} from "firebase/firestore";

import { auth, db } from "../../lib/firebase";

const TOURNAMENT_ID = "azhs-2026";

type Team = {
  id: string;
  name: string;
  seed: number | null;
};

type Game = {
  id: string; // e.g. R1G1
  round: number; // 1..5
  game: number; // within-round number
  teamAId: string | null; // filled for round 1 after seeding
  teamBId: string | null;
  nextGameId: string | null; // e.g. R2G1
  nextSlot: "A" | "B" | null; // slot in next game
};

type Picks = Record<string, string>; // gameId -> teamId
type FeedMap = Record<string, { A?: string; B?: string }>; // nextGameId -> feeder gameIds

function buildFeedMap(games: Game[]): FeedMap {
  const feeds: FeedMap = {};
  for (const g of games) {
    if (!g.nextGameId || !g.nextSlot) continue;
    feeds[g.nextGameId] ||= {};
    feeds[g.nextGameId][g.nextSlot] = g.id;
  }
  return feeds;
}

function computeParticipants(
  games: Game[],
  feeds: FeedMap,
  picks: Picks
): Record<string, { A: string | null; B: string | null }> {
  const byRound: Record<number, Game[]> = {};
  for (const g of games) {
    byRound[g.round] ||= [];
    byRound[g.round].push(g);
  }

  for (const r of Object.keys(byRound)) {
    byRound[Number(r)].sort((a, b) => a.game - b.game);
  }

  const participants: Record<string, { A: string | null; B: string | null }> =
    {};

  // Round 1 comes from Firestore
  for (const g of byRound[1] || []) {
    participants[g.id] = { A: g.teamAId ?? null, B: g.teamBId ?? null };
  }

  // Rounds 2..5 come from picks feeding into next games
  for (let r = 2; r <= 5; r++) {
    for (const g of byRound[r] || []) {
      const feeder = feeds[g.id] || {};
      const fromA = feeder.A ? picks[feeder.A] ?? null : null;
      const fromB = feeder.B ? picks[feeder.B] ?? null : null;
      participants[g.id] = { A: fromA, B: fromB };
    }
  }

  return participants;
}

function sanitizePicks(games: Game[], feeds: FeedMap, draft: Picks): Picks {
  const participants = computeParticipants(games, feeds, draft);
  const next: Picks = { ...draft };

  for (const [gameId, teamId] of Object.entries(next)) {
    const p = participants[gameId];
    if (!p) continue;
    if (teamId !== p.A && teamId !== p.B) delete next[gameId];
  }

  return next;
}

export default function EntryPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [teams, setTeams] = useState<Team[]>([]);
  const [games, setGames] = useState<Game[]>([]);

  const [teamsLoaded, setTeamsLoaded] = useState(false);
  const [gamesLoaded, setGamesLoaded] = useState(false);
  const dataLoading = !(teamsLoaded && gamesLoaded);

  const [loadError, setLoadError] = useState<string>("");

  const [round, setRound] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [picks, setPicks] = useState<Picks>({});
  const [locked, setLocked] = useState(false);
  const [status, setStatus] = useState<string>("");

  // Auth + load existing entry
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setAuthLoading(false);

      if (!u) {
        setPicks({});
        setLocked(false);
        return;
      }

      try {
        const entryRef = doc(db, "tournaments", TOURNAMENT_ID, "entries", u.uid);
        const snap = await getDoc(entryRef);
        if (snap.exists()) {
          const data = snap.data() as any;
          setPicks((data.picks || {}) as Picks);
          setLocked(Boolean(data.locked));
        } else {
          setPicks({});
          setLocked(false);
        }
      } catch (e: any) {
        setStatus(`Failed to load your entry: ${e?.message || String(e)}`);
      }
    });
    return () => unsub();
  }, []);

  // Live load teams + games (NO composite-index queries; sort client-side)
  useEffect(() => {
    setLoadError("");
    setTeamsLoaded(false);
    setGamesLoaded(false);

    const teamsRef = collection(db, "tournaments", TOURNAMENT_ID, "teams");
    const gamesRef = collection(db, "tournaments", TOURNAMENT_ID, "games");

    const unsubTeams = onSnapshot(
      teamsRef,
      (snap) => {
        const list: Team[] = snap.docs.map((d) => {
          const data = d.data() as any;
          return {
            id: d.id,
            name: String(data.name || d.id),
            seed: typeof data.seed === "number" ? data.seed : null,
          };
        });

        // sort by seed if present
        list.sort((a, b) => {
          const as = a.seed ?? 999;
          const bs = b.seed ?? 999;
          return as - bs;
        });

        setTeams(list);
        setTeamsLoaded(true);
      },
      (err) => {
        setLoadError(`Teams listener error: ${err.message}`);
        setTeamsLoaded(true);
      }
    );

    const unsubGames = onSnapshot(
      gamesRef,
      (snap) => {
        const list: Game[] = snap.docs.map((d) => {
          const data = d.data() as any;
          return {
            id: d.id,
            round: Number(data.round),
            game: Number(data.game),
            teamAId: (data.teamAId ?? null) as string | null,
            teamBId: (data.teamBId ?? null) as string | null,
            nextGameId: (data.nextGameId ?? null) as string | null,
            nextSlot: (data.nextSlot ?? null) as "A" | "B" | null,
          };
        });

        // Sort client-side
        list.sort((a, b) => (a.round - b.round) || (a.game - b.game));

        setGames(list);
        setGamesLoaded(true);
      },
      (err) => {
        setLoadError(`Games listener error: ${err.message}`);
        setGamesLoaded(true);
      }
    );

    return () => {
      unsubTeams();
      unsubGames();
    };
  }, []);

  const teamsById = useMemo(() => {
    const m: Record<string, Team> = {};
    for (const t of teams) m[t.id] = t;
    return m;
  }, [teams]);

  const feeds = useMemo(() => buildFeedMap(games), [games]);

  const participants = useMemo(
    () => computeParticipants(games, feeds, picks),
    [games, feeds, picks]
  );

  const gamesThisRound = useMemo(() => {
    return games
      .filter((g) => g.round === round)
      .sort((a, b) => a.game - b.game);
  }, [games, round]);

  const totalGames = games.length; // should be 31
  const pickedCount = Object.keys(picks).length;

  const labelForTeam = (teamId: string | null) => {
    if (!teamId) return "TBD";
    const t = teamsById[teamId];
    if (!t) return "TBD";
    const seed = t.seed ?? "?";
    return `${seed} · ${t.name}`;
  };

  const pickWinner = (gameId: string, teamId: string) => {
    if (locked) return;
    const draft: Picks = { ...picks, [gameId]: teamId };
    setPicks(sanitizePicks(games, feeds, draft));
    setStatus("");
  };

  const clearPick = (gameId: string) => {
    if (locked) return;
    const draft: Picks = { ...picks };
    delete draft[gameId];
    setPicks(sanitizePicks(games, feeds, draft));
    setStatus("");
  };

  const doSignIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const doSignOut = async () => {
    await signOut(auth);
  };

  const saveDraft = async () => {
    if (!user) return;
    setStatus("Saving draft...");
    const entryRef = doc(db, "tournaments", TOURNAMENT_ID, "entries", user.uid);

    await setDoc(
      entryRef,
      {
        userId: user.uid,
        displayName: user.displayName || "Player",
        locked: false,
        picks,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );

    setLocked(false);
    setStatus("Draft saved ✅");
  };

  const submitBracket = async () => {
    if (!user) return;

    if (totalGames !== 31) {
      setStatus(`Expected 31 games, found ${totalGames}. Make sure your admin generated bracket games.`);
      return;
    }

    if (pickedCount !== totalGames) {
      setStatus(
        `Pick winners for all ${totalGames} games before submitting. (${pickedCount}/${totalGames})`
      );
      return;
    }

    setStatus("Submitting (locking)...");
    const entryRef = doc(db, "tournaments", TOURNAMENT_ID, "entries", user.uid);

    await setDoc(
      entryRef,
      {
        userId: user.uid,
        displayName: user.displayName || "Player",
        locked: true,
        picks,
        submittedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );

    setLocked(true);
    setStatus("Submitted + locked ✅");
  };

  return (
    <div style={{ padding: 24, color: "#eaeaea", background: "#0b0b0b", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 34, fontWeight: 900 }}>My Bracket</div>
          <div style={{ opacity: 0.8, marginTop: 6 }}>
            Pick winners. Later rounds auto-fill based on your earlier picks.
          </div>
          <div style={{ opacity: 0.8, marginTop: 6 }}>
            Progress: <b>{pickedCount}/{totalGames}</b> {locked ? " · (LOCKED)" : ""}
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          {authLoading ? (
            <div style={{ opacity: 0.8 }}>Loading...</div>
          ) : user ? (
            <>
              <div style={{ opacity: 0.9, marginBottom: 8 }}>
                Signed in as <b>{user.displayName || "Player"}</b>
              </div>
              <button
                onClick={doSignOut}
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1px solid #333",
                  background: "#151515",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              onClick={doSignIn}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #333",
                background: "#151515",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Sign in with Google
            </button>
          )}
        </div>
      </div>

      <div style={{ marginTop: 14, opacity: 0.9 }}>
        {loadError ? (
          <div style={{ color: "#ffb3b3" }}><b>{loadError}</b></div>
        ) : status ? (
          <div>{status}</div>
        ) : (
          <div>&nbsp;</div>
        )}
      </div>

      <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
        {[1, 2, 3, 4, 5].map((r) => (
          <button
            key={r}
            onClick={() => setRound(r as any)}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #333",
              background: round === r ? "#222" : "#111",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Round {r}
          </button>
        ))}

        <div style={{ flex: 1 }} />

        <button
          onClick={saveDraft}
          disabled={!user || locked}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #2b5",
            background: locked ? "#111" : "#0f1a12",
            color: locked ? "#666" : "#bfffe0",
            cursor: !user || locked ? "not-allowed" : "pointer",
          }}
        >
          Save Draft
        </button>

        <button
          onClick={submitBracket}
          disabled={!user || locked}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #4aa3ff",
            background: locked ? "#111" : "#0e1620",
            color: locked ? "#666" : "#cfe7ff",
            cursor: !user || locked ? "not-allowed" : "pointer",
          }}
        >
          Submit Bracket (locks)
        </button>
      </div>

      <div
        style={{
          marginTop: 16,
          border: "1px solid #222",
          borderRadius: 14,
          padding: 14,
          background: "rgba(255,255,255,0.03)",
        }}
      >
        {dataLoading ? (
          <div style={{ opacity: 0.8 }}>Loading bracket data...</div>
        ) : totalGames === 0 ? (
          <div style={{ opacity: 0.9 }}>
            <b>No games found.</b>
            <div style={{ opacity: 0.8, marginTop: 6 }}>
              Go to Admin and make sure you generated:
              <ul style={{ marginTop: 6 }}>
                <li><b>Generate Round 1 from Seeds</b> (fills teamAId/teamBId for R1G1..R1G16)</li>
                <li><b>Generate Bracket Games (31 docs)</b> (creates R1..R5 structure)</li>
              </ul>
            </div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>
              Round {round} Games ({gamesThisRound.length})
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              {gamesThisRound.map((g) => {
                const p = participants[g.id] || { A: null, B: null };
                const pick = picks[g.id];

                const aEnabled = !!p.A;
                const bEnabled = !!p.B;

                const aSelected = pick && p.A && pick === p.A;
                const bSelected = pick && p.B && pick === p.B;

                return (
                  <div
                    key={g.id}
                    style={{
                      border: "1px solid #2a2a2a",
                      borderRadius: 14,
                      padding: 14,
                      background: "rgba(0,0,0,0.35)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                      <div style={{ fontSize: 18, fontWeight: 900 }}>{g.id}</div>
                      <div style={{ opacity: 0.8 }}>
                        Pick: <b>{pick ? labelForTeam(pick) : "—"}</b>
                      </div>
                    </div>

                    <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
                      <button
                        onClick={() => p.A && pickWinner(g.id, p.A)}
                        disabled={!user || locked || !aEnabled}
                        style={{
                          textAlign: "left",
                          padding: "12px 14px",
                          borderRadius: 12,
                          border: aSelected ? "1px solid #4aa3ff" : "1px solid #333",
                          background: aSelected ? "rgba(74,163,255,0.12)" : "#111",
                          color: aEnabled ? "#fff" : "#666",
                          cursor: !user || locked || !aEnabled ? "not-allowed" : "pointer",
                        }}
                      >
                        {labelForTeam(p.A)}
                      </button>

                      <button
                        onClick={() => p.B && pickWinner(g.id, p.B)}
                        disabled={!user || locked || !bEnabled}
                        style={{
                          textAlign: "left",
                          padding: "12px 14px",
                          borderRadius: 12,
                          border: bSelected ? "1px solid #4aa3ff" : "1px solid #333",
                          background: bSelected ? "rgba(74,163,255,0.12)" : "#111",
                          color: bEnabled ? "#fff" : "#666",
                          cursor: !user || locked || !bEnabled ? "not-allowed" : "pointer",
                        }}
                      >
                        {labelForTeam(p.B)}
                      </button>

                      <div>
                        <button
                          onClick={() => clearPick(g.id)}
                          disabled={!user || locked || !pick}
                          style={{
                            padding: "10px 14px",
                            borderRadius: 10,
                            border: "1px solid #733",
                            background: "#150b0b",
                            color: pick && !locked ? "#ffd2d2" : "#666",
                            cursor: !user || locked || !pick ? "not-allowed" : "pointer",
                          }}
                        >
                          Clear pick
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <div style={{ marginTop: 14, opacity: 0.7, fontSize: 13 }}>
        Entries are stored at <b>tournaments/{TOURNAMENT_ID}/entries/&lt;uid&gt;</b>. Once locked, edits are blocked by rules.
      </div>
    </div>
  );
}


// Greyson give me creds