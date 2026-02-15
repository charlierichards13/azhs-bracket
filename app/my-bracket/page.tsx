"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { auth, db } from "../../lib/firebase";
import { listGames, type Game } from "../../lib/games";
import { listTeams, type Team } from "../../lib/teams";

const TOURNAMENT_ID = "azhs-2026";

type PicksMap = Record<string, string>; // gameId -> picked teamId

type EntryDoc = {
  userId: string;
  displayName: string;
  locked: boolean;
  picks: PicksMap;
  createdAt?: any;
  updatedAt?: any;
  lockedAt?: any;
};

function sortGames(a: Game, b: Game) {
  if (a.round !== b.round) return a.round - b.round;
  return a.game - b.game;
}

function incomingMap(games: Game[]) {
  // nextGameId + nextSlot tells us what feeds into a future game
  // incoming[nextGameId].A = feederGameId
  // incoming[nextGameId].B = feederGameId
  const incoming: Record<string, { A?: string; B?: string }> = {};
  for (const g of games) {
    if (!g.nextGameId || !g.nextSlot) continue;
    incoming[g.nextGameId] ||= {};
    incoming[g.nextGameId]![g.nextSlot as "A" | "B"] = g.id;
  }
  return incoming;
}

function computeSlotTeamId(
  game: Game,
  slot: "A" | "B",
  picks: PicksMap,
  incoming: Record<string, { A?: string; B?: string }>
) {
  // If the game already has teams set (Round 1), use them.
  const direct = slot === "A" ? game.teamAId : game.teamBId;
  if (direct) return direct;

  // Otherwise, the slot comes from the winner pick of the feeder game.
  const feederId = incoming[game.id]?.[slot];
  if (!feederId) return null;

  return picks[feederId] ?? null;
}

function sanitizePicks(games: Game[], picksIn: PicksMap) {
  // If earlier picks change, downstream picks that are no longer possible should be cleared.
  const gamesSorted = [...games].sort(sortGames);
  const inc = incomingMap(gamesSorted);

  const picks: PicksMap = { ...picksIn };

  for (const g of gamesSorted) {
    const a = computeSlotTeamId(g, "A", picks, inc);
    const b = computeSlotTeamId(g, "B", picks, inc);

    const valid = new Set<string>();
    if (a) valid.add(a);
    if (b) valid.add(b);

    const cur = picks[g.id];
    if (cur && !valid.has(cur)) {
      delete picks[g.id];
    }
  }

  return picks;
}

function labelForTeam(teamId: string | null, teamMap: Map<string, Team>) {
  if (!teamId) return "TBD";
  const t = teamMap.get(teamId);
  if (!t) return teamId;
  const seed = typeof t.seed === "number" ? t.seed : undefined;
  return seed ? `${seed} · ${t.name}` : t.name;
}

export default function MyBracketPage() {
  const [user, setUser] = useState<User | null>(null);

  const [games, setGames] = useState<Game[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  const [picks, setPicks] = useState<PicksMap>({});
  const [locked, setLocked] = useState(false);

  const [activeRound, setActiveRound] = useState<1 | 2 | 3 | 4 | 5>(1);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string>("");

  // Auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  // Load games/teams + entry doc
  useEffect(() => {
    async function run() {
      setLoading(true);
      setMsg("");
      try {
        const [g, t] = await Promise.all([listGames(), listTeams()]);
        const sortedGames = [...g].sort(sortGames);
        setGames(sortedGames);
        setTeams(t);

        if (!user) {
          // still show bracket structure, but no entry doc
          setPicks({});
          setLocked(false);
          return;
        }

        const ref = doc(db, "tournaments", TOURNAMENT_ID, "entries", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data() as Partial<EntryDoc>;
          const loadedPicks = (data.picks ?? {}) as PicksMap;
          const cleaned = sanitizePicks(sortedGames, loadedPicks);
          setPicks(cleaned);
          setLocked(!!data.locked);
        } else {
          setPicks({});
          setLocked(false);
        }
      } catch (e) {
        console.error(e);
        setMsg("Error loading bracket data. Check console.");
      } finally {
        setLoading(false);
      }
    }

    run();
  }, [user]);

  const teamMap = useMemo(() => {
    const m = new Map<string, Team>();
    for (const t of teams) m.set(t.id, t);
    return m;
  }, [teams]);

  const inc = useMemo(() => incomingMap(games), [games]);

  const totalGames = useMemo(() => games.length, [games]);
  const pickedCount = useMemo(() => Object.keys(picks).length, [picks]);

  const gamesThisRound = useMemo(() => {
    return games.filter((g) => g.round === activeRound);
  }, [games, activeRound]);

  function setPick(gameId: string, teamId: string) {
    if (locked) return;
    const next = sanitizePicks(games, { ...picks, [gameId]: teamId });
    setPicks(next);
  }

  function clearPick(gameId: string) {
    if (locked) return;
    const next = { ...picks };
    delete next[gameId];
    setPicks(sanitizePicks(games, next));
  }

  async function saveDraft() {
    if (!user) {
      setMsg("You must be signed in to save.");
      return;
    }
    if (locked) {
      setMsg("This bracket is locked.");
      return;
    }

    setSaving(true);
    setMsg("");
    try {
      const cleaned = sanitizePicks(games, picks);

      const ref = doc(db, "tournaments", TOURNAMENT_ID, "entries", user.uid);

      await setDoc(
        ref,
        {
          userId: user.uid,
          displayName: user.displayName || user.email || "Unknown",
          locked: false,
          picks: cleaned,
          updatedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
        } satisfies EntryDoc,
        { merge: true }
      );

      setPicks(cleaned);
      setMsg("Saved draft.");
    } catch (e) {
      console.error(e);
      setMsg("Save failed. Check console.");
    } finally {
      setSaving(false);
    }
  }

  async function submitBracket() {
    if (!user) {
      setMsg("You must be signed in to submit.");
      return;
    }
    if (locked) {
      setMsg("This bracket is already locked.");
      return;
    }

    // Lightweight confirm without a popup library
    const ok = window.confirm(
      "Submit and lock your bracket? You won't be able to edit after this."
    );
    if (!ok) return;

    setSaving(true);
    setMsg("");
    try {
      const cleaned = sanitizePicks(games, picks);

      const ref = doc(db, "tournaments", TOURNAMENT_ID, "entries", user.uid);

      // Ensure doc exists, then lock
      await setDoc(
        ref,
        {
          userId: user.uid,
          displayName: user.displayName || user.email || "Unknown",
          locked: false,
          picks: cleaned,
          updatedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
        } satisfies EntryDoc,
        { merge: true }
      );

      await updateDoc(ref, {
        locked: true,
        lockedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        picks: cleaned,
      });

      setPicks(cleaned);
      setLocked(true);
      setMsg("Submitted! Bracket is now locked.");
    } catch (e) {
      console.error(e);
      setMsg("Submit failed. Check console.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui" }}>
        <h1 style={{ fontSize: 44, margin: 0 }}>My Bracket</h1>
        <p style={{ opacity: 0.8 }}>Loading bracket data…</p>
        <div
          style={{
            marginTop: 16,
            border: "1px solid #222",
            borderRadius: 14,
            padding: 18,
            background: "rgba(0,0,0,0.25)",
          }}
        >
          Loading bracket data…
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div>
          <h1 style={{ fontSize: 44, margin: 0 }}>My Bracket</h1>
          <p style={{ opacity: 0.8, marginTop: 8, marginBottom: 8 }}>
            Pick winners. Later rounds auto-fill based on your earlier picks.
          </p>
          <div style={{ opacity: 0.75, marginTop: 4 }}>
            Progress: {pickedCount}/{totalGames}
          </div>
          {locked ? (
            <div style={{ marginTop: 10, color: "#7CFF7C" }}>
              ✅ Locked (editing disabled)
            </div>
          ) : null}
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ opacity: 0.75, marginBottom: 10 }}>
            Signed in as <b>{user?.displayName || user?.email || "Guest"}</b>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button
              onClick={saveDraft}
              disabled={saving || !user || locked}
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                border: "1px solid #1f7a3a",
                background: "rgba(0,0,0,0.25)",
                color: "#7CFF7C",
                cursor: saving || !user || locked ? "not-allowed" : "pointer",
                minWidth: 120,
              }}
            >
              {saving ? "Saving…" : "Save Draft"}
            </button>

            <button
              onClick={submitBracket}
              disabled={saving || !user || locked}
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                border: "1px solid #2b5cff",
                background: "rgba(0,0,0,0.25)",
                color: "#cfe0ff",
                cursor: saving || !user || locked ? "not-allowed" : "pointer",
                minWidth: 160,
              }}
            >
              {locked ? "Submitted (locked)" : "Submit Bracket (locks)"}
            </button>
          </div>
        </div>
      </div>

      {msg ? (
        <div style={{ marginTop: 14, color: msg.includes("fail") ? "#ff8b8b" : "#b7ffb7" }}>
          {msg}
        </div>
      ) : null}

      <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
        {([1, 2, 3, 4, 5] as const).map((r) => (
          <button
            key={r}
            onClick={() => setActiveRound(r)}
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid #333",
              background: activeRound === r ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.25)",
              color: "#fff",
              cursor: "pointer",
              minWidth: 92,
            }}
          >
            Round {r}
          </button>
        ))}
      </div>

      <div
        style={{
          marginTop: 16,
          border: "1px solid #222",
          borderRadius: 14,
          padding: 16,
          background: "rgba(0,0,0,0.25)",
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 14 }}>
          Round {activeRound} Games ({gamesThisRound.length})
        </div>

        {gamesThisRound.map((g) => {
          const aId = computeSlotTeamId(g, "A", picks, inc);
          const bId = computeSlotTeamId(g, "B", picks, inc);
          const pick = picks[g.id] || null;

          const aLabel = labelForTeam(aId, teamMap);
          const bLabel = labelForTeam(bId, teamMap);

          const pickLabel = pick ? labelForTeam(pick, teamMap) : "—";

          return (
            <div
              key={g.id}
              style={{
                border: "1px solid #2b2b2b",
                borderRadius: 14,
                padding: 14,
                marginBottom: 14,
                background: "rgba(0,0,0,0.25)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div style={{ fontSize: 22, fontWeight: 800 }}>{g.id}</div>
                <div style={{ opacity: 0.8 }}>
                  Pick: <b>{pickLabel}</b>
                </div>
              </div>

              <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
                <button
                  disabled={locked || !aId}
                  onClick={() => aId && setPick(g.id, aId)}
                  style={{
                    textAlign: "left",
                    padding: "12px 14px",
                    borderRadius: 12,
                    border:
                      pick === aId
                        ? "1px solid rgba(43,92,255,0.8)"
                        : "1px solid #2f2f2f",
                    background:
                      pick === aId
                        ? "rgba(43,92,255,0.14)"
                        : "rgba(0,0,0,0.18)",
                    color: "#fff",
                    cursor: locked || !aId ? "not-allowed" : "pointer",
                    fontWeight: 700,
                  }}
                >
                  {aLabel}
                </button>

                <button
                  disabled={locked || !bId}
                  onClick={() => bId && setPick(g.id, bId)}
                  style={{
                    textAlign: "left",
                    padding: "12px 14px",
                    borderRadius: 12,
                    border:
                      pick === bId
                        ? "1px solid rgba(43,92,255,0.8)"
                        : "1px solid #2f2f2f",
                    background:
                      pick === bId
                        ? "rgba(43,92,255,0.14)"
                        : "rgba(0,0,0,0.18)",
                    color: "#fff",
                    cursor: locked || !bId ? "not-allowed" : "pointer",
                    fontWeight: 700,
                  }}
                >
                  {bLabel}
                </button>
              </div>

              <div style={{ marginTop: 12 }}>
                <button
                  onClick={() => clearPick(g.id)}
                  disabled={locked}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 12,
                    border: "1px solid #5a2323",
                    background: "rgba(0,0,0,0.25)",
                    color: "#ffb3b3",
                    cursor: locked ? "not-allowed" : "pointer",
                  }}
                >
                  Clear pick
                </button>
                <span style={{ marginLeft: 10, opacity: 0.75 }}>
                  (later rounds auto-fill based on your earlier picks)
                </span>
              </div>
            </div>
          );
        })}

        <div style={{ opacity: 0.7, marginTop: 10 }}>
          Note: entries are stored at{" "}
          <b>tournaments/{TOURNAMENT_ID}/entries/&lt;your-uid&gt;</b>. Once locked,
          edits should be blocked by rules.
        </div>
      </div>
    </main>
  );
}
//end of MyBracketPage component