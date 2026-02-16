// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { onAuthStateChanged, type User } from "firebase/auth";
// import {
//   doc,
//   getDoc,
//   serverTimestamp,
//   setDoc,
//   updateDoc,
// } from "firebase/firestore";

// import { auth, db } from "../../lib/firebase";
// import { listGames, type Game } from "../../lib/games";
// import { listTeams, type Team } from "../../lib/teams";

// const TOURNAMENT_ID = "azhs-2026";

// type PicksMap = Record<string, string>; // gameId -> picked teamId

// type EntryDoc = {
//   userId: string;
//   displayName: string;
//   locked: boolean;
//   picks: PicksMap;
//   createdAt?: any;
//   updatedAt?: any;
//   lockedAt?: any;
// };

// function sortGames(a: Game, b: Game) {
//   if (a.round !== b.round) return a.round - b.round;
//   return a.game - b.game;
// }

// function incomingMap(games: Game[]) {
//   // nextGameId + nextSlot tells us what feeds into a future game
//   // incoming[nextGameId].A = feederGameId
//   // incoming[nextGameId].B = feederGameId
//   const incoming: Record<string, { A?: string; B?: string }> = {};
//   for (const g of games) {
//     if (!g.nextGameId || !g.nextSlot) continue;
//     incoming[g.nextGameId] ||= {};
//     incoming[g.nextGameId]![g.nextSlot as "A" | "B"] = g.id;
//   }
//   return incoming;
// }

// function computeSlotTeamId(
//   game: Game,
//   slot: "A" | "B",
//   picks: PicksMap,
//   incoming: Record<string, { A?: string; B?: string }>
// ) {
//   // If the game already has teams set (Round 1), use them.
//   const direct = slot === "A" ? game.teamAId : game.teamBId;
//   if (direct) return direct;

//   // Otherwise, the slot comes from the winner pick of the feeder game.
//   const feederId = incoming[game.id]?.[slot];
//   if (!feederId) return null;

//   return picks[feederId] ?? null;
// }

// function sanitizePicks(games: Game[], picksIn: PicksMap) {
//   // If earlier picks change, downstream picks that are no longer possible should be cleared.
//   const gamesSorted = [...games].sort(sortGames);
//   const inc = incomingMap(gamesSorted);

//   const picks: PicksMap = { ...picksIn };

//   for (const g of gamesSorted) {
//     const a = computeSlotTeamId(g, "A", picks, inc);
//     const b = computeSlotTeamId(g, "B", picks, inc);

//     const valid = new Set<string>();
//     if (a) valid.add(a);
//     if (b) valid.add(b);

//     const cur = picks[g.id];
//     if (cur && !valid.has(cur)) {
//       delete picks[g.id];
//     }
//   }

//   return picks;
// }

// function labelForTeam(teamId: string | null, teamMap: Map<string, Team>) {
//   if (!teamId) return "TBD";
//   const t = teamMap.get(teamId);
//   if (!t) return teamId;
//   const seed = typeof t.seed === "number" ? t.seed : undefined;
//   return seed ? `${seed} · ${t.name}` : t.name;
// }

// export default function MyBracketPage() {
//   const [user, setUser] = useState<User | null>(null);

//   const [games, setGames] = useState<Game[]>([]);
//   const [teams, setTeams] = useState<Team[]>([]);

//   const [picks, setPicks] = useState<PicksMap>({});
//   const [locked, setLocked] = useState(false);

//   const [activeRound, setActiveRound] = useState<1 | 2 | 3 | 4 | 5>(1);

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [msg, setMsg] = useState<string>("");

//   // Auth
//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (u) => setUser(u));
//     return () => unsub();
//   }, []);

//   // Load games/teams + entry doc
//   useEffect(() => {
//     async function run() {
//       setLoading(true);
//       setMsg("");
//       try {
//         const [g, t] = await Promise.all([listGames(), listTeams()]);
//         const sortedGames = [...g].sort(sortGames);
//         setGames(sortedGames);
//         setTeams(t);

//         if (!user) {
//           // still show bracket structure, but no entry doc
//           setPicks({});
//           setLocked(false);
//           return;
//         }

//         const ref = doc(db, "tournaments", TOURNAMENT_ID, "entries", user.uid);
//         const snap = await getDoc(ref);

//         if (snap.exists()) {
//           const data = snap.data() as Partial<EntryDoc>;
//           const loadedPicks = (data.picks ?? {}) as PicksMap;
//           const cleaned = sanitizePicks(sortedGames, loadedPicks);
//           setPicks(cleaned);
//           setLocked(!!data.locked);
//         } else {
//           setPicks({});
//           setLocked(false);
//         }
//       } catch (e) {
//         console.error(e);
//         setMsg("Error loading bracket data. Check console.");
//       } finally {
//         setLoading(false);
//       }
//     }

//     run();
//   }, [user]);

//   const teamMap = useMemo(() => {
//     const m = new Map<string, Team>();
//     for (const t of teams) m.set(t.id, t);
//     return m;
//   }, [teams]);

//   const inc = useMemo(() => incomingMap(games), [games]);

//   const totalGames = useMemo(() => games.length, [games]);
//   const pickedCount = useMemo(() => Object.keys(picks).length, [picks]);

//   const gamesThisRound = useMemo(() => {
//     return games.filter((g) => g.round === activeRound);
//   }, [games, activeRound]);

//   function setPick(gameId: string, teamId: string) {
//     if (locked) return;
//     const next = sanitizePicks(games, { ...picks, [gameId]: teamId });
//     setPicks(next);
//   }

//   function clearPick(gameId: string) {
//     if (locked) return;
//     const next = { ...picks };
//     delete next[gameId];
//     setPicks(sanitizePicks(games, next));
//   }

//   async function saveDraft() {
//     if (!user) {
//       setMsg("You must be signed in to save.");
//       return;
//     }
//     if (locked) {
//       setMsg("This bracket is locked.");
//       return;
//     }

//     setSaving(true);
//     setMsg("");
//     try {
//       const cleaned = sanitizePicks(games, picks);

//       const ref = doc(db, "tournaments", TOURNAMENT_ID, "entries", user.uid);

//       await setDoc(
//         ref,
//         {
//           userId: user.uid,
//           displayName: user.displayName || user.email || "Unknown",
//           locked: false,
//           picks: cleaned,
//           updatedAt: serverTimestamp(),
//           createdAt: serverTimestamp(),
//         } satisfies EntryDoc,
//         { merge: true }
//       );

//       setPicks(cleaned);
//       setMsg("Saved draft.");
//     } catch (e) {
//       console.error(e);
//       setMsg("Save failed. Check console.");
//     } finally {
//       setSaving(false);
//     }
//   }

//   async function submitBracket() {
//     if (!user) {
//       setMsg("You must be signed in to submit.");
//       return;
//     }
//     if (locked) {
//       setMsg("This bracket is already locked.");
//       return;
//     }

//     // Lightweight confirm without a popup library
//     const ok = window.confirm(
//       "Submit and lock your bracket? You won't be able to edit after this."
//     );
//     if (!ok) return;

//     setSaving(true);
//     setMsg("");
//     try {
//       const cleaned = sanitizePicks(games, picks);

//       const ref = doc(db, "tournaments", TOURNAMENT_ID, "entries", user.uid);

//       // Ensure doc exists, then lock
//       await setDoc(
//         ref,
//         {
//           userId: user.uid,
//           displayName: user.displayName || user.email || "Unknown",
//           locked: false,
//           picks: cleaned,
//           updatedAt: serverTimestamp(),
//           createdAt: serverTimestamp(),
//         } satisfies EntryDoc,
//         { merge: true }
//       );

//       await updateDoc(ref, {
//         locked: true,
//         lockedAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//         picks: cleaned,
//       });

//       setPicks(cleaned);
//       setLocked(true);
//       setMsg("Submitted! Bracket is now locked.");
//     } catch (e) {
//       console.error(e);
//       setMsg("Submit failed. Check console.");
//     } finally {
//       setSaving(false);
//     }
//   }

//   if (loading) {
//     return (
//       <main style={{ padding: 24, fontFamily: "system-ui" }}>
//         <h1 style={{ fontSize: 44, margin: 0 }}>My Bracket</h1>
//         <p style={{ opacity: 0.8 }}>Loading bracket data…</p>
//         <div
//           style={{
//             marginTop: 16,
//             border: "1px solid #222",
//             borderRadius: 14,
//             padding: 18,
//             background: "rgba(0,0,0,0.25)",
//           }}
//         >
//           Loading bracket data…
//         </div>
//       </main>
//     );
//   }

//   return (
//     <main style={{ padding: 24, fontFamily: "system-ui" }}>
//       <div
//         style={{
//           display: "flex",
//           alignItems: "flex-start",
//           justifyContent: "space-between",
//           gap: 16,
//         }}
//       >
//         <div>
//           <h1 style={{ fontSize: 44, margin: 0 }}>My Bracket</h1>
//           <p style={{ opacity: 0.8, marginTop: 8, marginBottom: 8 }}>
//             Pick winners. Later rounds auto-fill based on your earlier picks.
//           </p>
//           <div style={{ opacity: 0.75, marginTop: 4 }}>
//             Progress: {pickedCount}/{totalGames}
//           </div>
//           {locked ? (
//             <div style={{ marginTop: 10, color: "#7CFF7C" }}>
//               ✅ Locked (editing disabled)
//             </div>
//           ) : null}
//         </div>

//         <div style={{ textAlign: "right" }}>
//           <div style={{ opacity: 0.75, marginBottom: 10 }}>
//             Signed in as <b>{user?.displayName || user?.email || "Guest"}</b>
//           </div>
//           <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
//             <button
//               onClick={saveDraft}
//               disabled={saving || !user || locked}
//               style={{
//                 padding: "10px 14px",
//                 borderRadius: 12,
//                 border: "1px solid #1f7a3a",
//                 background: "rgba(0,0,0,0.25)",
//                 color: "#7CFF7C",
//                 cursor: saving || !user || locked ? "not-allowed" : "pointer",
//                 minWidth: 120,
//               }}
//             >
//               {saving ? "Saving…" : "Save Draft"}
//             </button>

//             <button
//               onClick={submitBracket}
//               disabled={saving || !user || locked}
//               style={{
//                 padding: "10px 14px",
//                 borderRadius: 12,
//                 border: "1px solid #2b5cff",
//                 background: "rgba(0,0,0,0.25)",
//                 color: "#cfe0ff",
//                 cursor: saving || !user || locked ? "not-allowed" : "pointer",
//                 minWidth: 160,
//               }}
//             >
//               {locked ? "Submitted (locked)" : "Submit Bracket (locks)"}
//             </button>
//           </div>
//         </div>
//       </div>

//       {msg ? (
//         <div style={{ marginTop: 14, color: msg.includes("fail") ? "#ff8b8b" : "#b7ffb7" }}>
//           {msg}
//         </div>
//       ) : null}

//       <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
//         {([1, 2, 3, 4, 5] as const).map((r) => (
//           <button
//             key={r}
//             onClick={() => setActiveRound(r)}
//             style={{
//               padding: "10px 14px",
//               borderRadius: 12,
//               border: "1px solid #333",
//               background: activeRound === r ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.25)",
//               color: "#fff",
//               cursor: "pointer",
//               minWidth: 92,
//             }}
//           >
//             Round {r}
//           </button>
//         ))}
//       </div>

//       <div
//         style={{
//           marginTop: 16,
//           border: "1px solid #222",
//           borderRadius: 14,
//           padding: 16,
//           background: "rgba(0,0,0,0.25)",
//         }}
//       >
//         <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 14 }}>
//           Round {activeRound} Games ({gamesThisRound.length})
//         </div>

//         {gamesThisRound.map((g) => {
//           const aId = computeSlotTeamId(g, "A", picks, inc);
//           const bId = computeSlotTeamId(g, "B", picks, inc);
//           const pick = picks[g.id] || null;

//           const aLabel = labelForTeam(aId, teamMap);
//           const bLabel = labelForTeam(bId, teamMap);

//           const pickLabel = pick ? labelForTeam(pick, teamMap) : "—";

//           return (
//             <div
//               key={g.id}
//               style={{
//                 border: "1px solid #2b2b2b",
//                 borderRadius: 14,
//                 padding: 14,
//                 marginBottom: 14,
//                 background: "rgba(0,0,0,0.25)",
//               }}
//             >
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   gap: 12,
//                 }}
//               >
//                 <div style={{ fontSize: 22, fontWeight: 800 }}>{g.id}</div>
//                 <div style={{ opacity: 0.8 }}>
//                   Pick: <b>{pickLabel}</b>
//                 </div>
//               </div>

//               <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
//                 <button
//                   disabled={locked || !aId}
//                   onClick={() => aId && setPick(g.id, aId)}
//                   style={{
//                     textAlign: "left",
//                     padding: "12px 14px",
//                     borderRadius: 12,
//                     border:
//                       pick === aId
//                         ? "1px solid rgba(43,92,255,0.8)"
//                         : "1px solid #2f2f2f",
//                     background:
//                       pick === aId
//                         ? "rgba(43,92,255,0.14)"
//                         : "rgba(0,0,0,0.18)",
//                     color: "#fff",
//                     cursor: locked || !aId ? "not-allowed" : "pointer",
//                     fontWeight: 700,
//                   }}
//                 >
//                   {aLabel}
//                 </button>

//                 <button
//                   disabled={locked || !bId}
//                   onClick={() => bId && setPick(g.id, bId)}
//                   style={{
//                     textAlign: "left",
//                     padding: "12px 14px",
//                     borderRadius: 12,
//                     border:
//                       pick === bId
//                         ? "1px solid rgba(43,92,255,0.8)"
//                         : "1px solid #2f2f2f",
//                     background:
//                       pick === bId
//                         ? "rgba(43,92,255,0.14)"
//                         : "rgba(0,0,0,0.18)",
//                     color: "#fff",
//                     cursor: locked || !bId ? "not-allowed" : "pointer",
//                     fontWeight: 700,
//                   }}
//                 >
//                   {bLabel}
//                 </button>
//               </div>

//               <div style={{ marginTop: 12 }}>
//                 <button
//                   onClick={() => clearPick(g.id)}
//                   disabled={locked}
//                   style={{
//                     padding: "10px 12px",
//                     borderRadius: 12,
//                     border: "1px solid #5a2323",
//                     background: "rgba(0,0,0,0.25)",
//                     color: "#ffb3b3",
//                     cursor: locked ? "not-allowed" : "pointer",
//                   }}
//                 >
//                   Clear pick
//                 </button>
//                 <span style={{ marginLeft: 10, opacity: 0.75 }}>
//                   (later rounds auto-fill based on your earlier picks)
//                 </span>
//               </div>
//             </div>
//           );
//         })}

//         <div style={{ opacity: 0.7, marginTop: 10 }}>
//           Note: entries are stored at{" "}
//           <b>tournaments/{TOURNAMENT_ID}/entries/&lt;your-uid&gt;</b>. Once locked,
//           edits should be blocked by rules.
//         </div>
//       </div>
//     </main>
//   );
// }
// //end of MyBracketPage component


// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import { onAuthStateChanged, type User } from "firebase/auth";
// import {
//   doc,
//   getDoc,
//   serverTimestamp,
//   setDoc,
//   updateDoc,
// } from "firebase/firestore";

// import { auth, db } from "../../lib/firebase";
// import { listGames, type Game, roundGameCount } from "../../lib/games";
// import { listTeams, type Team } from "../../lib/teams";

// const TOURNAMENT_ID = "azhs-2026";

// /**
//  * Bracket layout constants (mirrors /bracket page)
//  * ✅ UNIT stays as the bracket positioning unit
//  * ✅ Cards are height = 2*UNIT for alignment with connector math
//  */
// const UNIT = 46;
// const ROW_H = 36;
// const ROW_GAP = 4;
// const PAD = 8;

// const CARD_W = 320;
// const CARD_H = UNIT * 2;
// const COL_W = 380;
// const TOP_PAD = 90;

// const SIDE_TEAMS = 16;
// const CANVAS_H = TOP_PAD + SIDE_TEAMS * UNIT + 80;
// const CANVAS_W = 40 + COL_W * 9;

// type PicksMap = Record<string, string>; // gameId -> picked teamId

// type EntryDoc = {
//   userId: string;
//   displayName: string;
//   locked: boolean;
//   picks: PicksMap;
//   createdAt?: any;
//   updatedAt?: any;
//   lockedAt?: any;
// };

// // Optional logo fields (won’t break if your Team type doesn’t include them)
// type TeamX = Team & {
//   logoUrl?: string | null;
//   logoPath?: string | null;
// };

// function slugToLocalLogo(teamId: string) {
//   return `/logos/${teamId}.png`;
// }
// function slugToLocalLogoUpper(teamId: string) {
//   return `/logos/${teamId}.PNG`;
// }

// function sortGames(a: Game, b: Game) {
//   if (a.round !== b.round) return a.round - b.round;
//   return a.game - b.game;
// }

// function fmtDisplayName(u: User | null) {
//   if (!u) return "Guest";
//   return u.displayName || u.email || "Unknown";
// }

// function incomingMap(games: Game[]) {
//   // nextGameId + nextSlot tells us what feeds into a future game
//   // incoming[nextGameId].A = feederGameId
//   // incoming[nextGameId].B = feederGameId
//   const incoming: Record<string, { A?: string; B?: string }> = {};
//   for (const g of games) {
//     if (!g.nextGameId || !g.nextSlot) continue;
//     incoming[g.nextGameId] ||= {};
//     incoming[g.nextGameId]![g.nextSlot as "A" | "B"] = g.id;
//   }
//   return incoming;
// }

// function computeSlotTeamId(
//   game: Game,
//   slot: "A" | "B",
//   picks: PicksMap,
//   incoming: Record<string, { A?: string; B?: string }>
// ) {
//   // If the game already has teams set (Round 1), use them.
//   const direct = slot === "A" ? game.teamAId : game.teamBId;
//   if (direct) return direct;

//   // Otherwise, the slot comes from the winner pick of the feeder game.
//   const feederId = incoming[game.id]?.[slot];
//   if (!feederId) return null;

//   return picks[feederId] ?? null;
// }

// function sanitizePicks(games: Game[], picksIn: PicksMap) {
//   // If earlier picks change, downstream picks that are no longer possible should be cleared.
//   const gamesSorted = [...games].sort(sortGames);
//   const inc = incomingMap(gamesSorted);

//   const picks: PicksMap = { ...picksIn };

//   for (const g of gamesSorted) {
//     const a = computeSlotTeamId(g, "A", picks, inc);
//     const b = computeSlotTeamId(g, "B", picks, inc);

//     const valid = new Set<string>();
//     if (a) valid.add(a);
//     if (b) valid.add(b);

//     const cur = picks[g.id];
//     if (cur && !valid.has(cur)) {
//       delete picks[g.id];
//     }
//   }

//   return picks;
// }

// function labelForTeam(teamId: string | null, teamMap: Map<string, TeamX>) {
//   if (!teamId) return "TBD";
//   const t = teamMap.get(teamId);
//   if (!t) return teamId;

//   const seed = typeof (t as any)?.seed === "number" ? (t as any).seed : null;
//   return seed ? `${seed} · ${t.name}` : t.name;
// }

// /** Bracket geometry helpers (mirrors /bracket page) */
// function getSideInfo(round: number, game: number) {
//   const total = roundGameCount(round);
//   const half = total / 2;
//   const isLeft = game <= half;
//   const localGame = isLeft ? game : game - half;
//   return { isLeft, localGame, half };
// }

// function topFor(round: number, localGame: number) {
//   const topIndex =
//     Math.pow(2, round) * localGame - (Math.pow(2, round - 1) + 1);
//   return TOP_PAD + topIndex * UNIT;
// }

// function colIndexFor(round: number, isLeft: boolean) {
//   if (round === 5) return 4; // final column
//   if (isLeft) return round - 1; // left: 0..3
//   return 9 - round; // right: 8..5
// }

// function xForCol(colIndex: number) {
//   const left = 20 + colIndex * COL_W;
//   return left + Math.floor((COL_W - CARD_W) / 2);
// }

// function posForGame(g: Game) {
//   if (g.round === 5) {
//     const col = 4;
//     const x = xForCol(col);
//     const y = TOP_PAD + (SIDE_TEAMS * UNIT) / 2 - UNIT;
//     return { x, y };
//   }

//   const { isLeft, localGame } = getSideInfo(g.round, g.game);
//   const col = colIndexFor(g.round, isLeft);
//   const x = xForCol(col);
//   const y = topFor(g.round, localGame);
//   return { x, y };
// }

// function TeamRowButton({
//   teamId,
//   teamMap,
//   selected,
//   disabled,
//   onClick,
// }: {
//   teamId: string | null;
//   teamMap: Map<string, TeamX>;
//   selected: boolean;
//   disabled: boolean;
//   onClick: () => void;
// }) {
//   const t = teamId ? teamMap.get(teamId) : null;

//   const name = teamId ? (t?.name ?? teamId) : "TBD";
//   const seed =
//     teamId && typeof (t as any)?.seed === "number" ? (t as any).seed : null;

//   // Supports: Team.logoUrl / Team.logoPath if you ever add them
//   const src =
//     teamId ? (t?.logoUrl || t?.logoPath || slugToLocalLogo(teamId)) : "";

//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       disabled={disabled}
//       style={{
//         display: "flex",
//         alignItems: "center",
//         gap: 10,
//         height: ROW_H,
//         padding: "0 8px",
//         borderRadius: 10,
//         background: selected
//           ? "rgba(43,92,255,0.16)"
//           : "rgba(0,0,0,0.0)",
//         border: selected
//           ? "1px solid rgba(43,92,255,0.75)"
//           : "1px solid transparent",
//         boxSizing: "border-box",
//         cursor: disabled ? "not-allowed" : "pointer",
//         opacity: disabled ? 0.55 : 1,
//         textAlign: "left",
//         width: "100%",
//         color: "#fff",
//       }}
//     >
//       <div
//         style={{
//           width: 26,
//           height: 26,
//           borderRadius: 7,
//           background: "#2a2a2a",
//           overflow: "hidden",
//           flex: "0 0 auto",
//           display: "grid",
//           placeItems: "center",
//         }}
//       >
//         {teamId ? (
//           <img
//             src={src}
//             alt=""
//             width={26}
//             height={26}
//             style={{ width: "100%", height: "100%", objectFit: "contain" }}
//             onError={(e) => {
//               const img = e.currentTarget as HTMLImageElement;

//               // If remote/field-based failed, try local .png once
//               if (!img.dataset.triedPng && (t?.logoUrl || t?.logoPath)) {
//                 img.dataset.triedPng = "1";
//                 img.src = slugToLocalLogo(teamId);
//                 return;
//               }

//               // If .png failed, try .PNG once (case-sensitive on Vercel)
//               if (!img.dataset.triedUpper) {
//                 img.dataset.triedUpper = "1";
//                 img.src = slugToLocalLogoUpper(teamId);
//                 return;
//               }

//               img.style.display = "none";
//             }}
//           />
//         ) : null}
//       </div>

//       <span
//         style={{
//           fontSize: 14,
//           fontWeight: selected ? 800 : 650,
//           letterSpacing: 0.2,
//           lineHeight: "16px",
//           opacity: teamId ? 1 : 0.65,
//         }}
//       >
//         {seed ? (
//           <>
//             <span style={{ opacity: 0.85 }}>{seed}</span>
//             <span style={{ opacity: 0.6 }}> · </span>
//           </>
//         ) : null}
//         {name}
//       </span>
//     </button>
//   );
// }

// function GameCard({
//   game,
//   teamMap,
//   picks,
//   locked,
//   activeRound,
//   aId,
//   bId,
//   onPick,
//   onClear,
// }: {
//   game: Game;
//   teamMap: Map<string, TeamX>;
//   picks: PicksMap;
//   locked: boolean;
//   activeRound: 1 | 2 | 3 | 4 | 5;
//   aId: string | null;
//   bId: string | null;
//   onPick: (teamId: string) => void;
//   onClear: () => void;
// }) {
//   const pick = picks[game.id] ?? null;
//   const focused = game.round === activeRound;

//   return (
//     <div
//       style={{
//         width: CARD_W,
//         height: CARD_H,
//         border: focused ? "1px solid rgba(255,255,255,0.22)" : "1px solid #343434",
//         borderRadius: 14,
//         padding: PAD,
//         background: "rgba(0,0,0,0.35)",
//         boxSizing: "border-box",
//         position: "relative",
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         gap: ROW_GAP,
//         boxShadow: focused ? "0 0 0 1px rgba(255,255,255,0.06) inset" : "none",
//       }}
//     >
//       <div
//         style={{
//           position: "absolute",
//           top: 8,
//           right: 10,
//           fontSize: 12,
//           opacity: 0.7,
//           letterSpacing: 0.5,
//         }}
//       >
//         {game.id}
//       </div>

//       {pick && !locked ? (
//         <button
//           type="button"
//           onClick={onClear}
//           style={{
//             position: "absolute",
//             top: 8,
//             left: 10,
//             fontSize: 12,
//             opacity: 0.8,
//             color: "#ffb3b3",
//             background: "transparent",
//             border: "1px solid rgba(255,179,179,0.25)",
//             padding: "4px 8px",
//             borderRadius: 999,
//             cursor: "pointer",
//           }}
//           title="Clear pick"
//         >
//           Clear
//         </button>
//       ) : null}

//       <TeamRowButton
//         teamId={aId}
//         teamMap={teamMap}
//         selected={!!pick && pick === aId}
//         disabled={locked || !aId}
//         onClick={() => aId && onPick(aId)}
//       />
//       <TeamRowButton
//         teamId={bId}
//         teamMap={teamMap}
//         selected={!!pick && pick === bId}
//         disabled={locked || !bId}
//         onClick={() => bId && onPick(bId)}
//       />
//     </div>
//   );
// }

// export default function MyBracketPage() {
//   const [user, setUser] = useState<User | null>(null);

//   const [games, setGames] = useState<Game[]>([]);
//   const [teams, setTeams] = useState<TeamX[]>([]);

//   const [picks, setPicks] = useState<PicksMap>({});
//   const [locked, setLocked] = useState(false);

//   const [activeRound, setActiveRound] = useState<1 | 2 | 3 | 4 | 5>(1);

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [msg, setMsg] = useState<string>("");

//   const scrollRef = useRef<HTMLDivElement | null>(null);

//   // Auth
//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (u) => setUser(u));
//     return () => unsub();
//   }, []);

//   // Load games/teams + entry doc
//   useEffect(() => {
//     async function run() {
//       setLoading(true);
//       setMsg("");
//       try {
//         const [g, t] = await Promise.all([listGames(), listTeams()]);
//         const sortedGames = [...g].sort(sortGames);
//         setGames(sortedGames);
//         setTeams(t as TeamX[]);

//         if (!user) {
//           // still show bracket structure, but no entry doc
//           setPicks({});
//           setLocked(false);
//           return;
//         }

//         const ref = doc(db, "tournaments", TOURNAMENT_ID, "entries", user.uid);
//         const snap = await getDoc(ref);

//         if (snap.exists()) {
//           const data = snap.data() as Partial<EntryDoc>;
//           const loadedPicks = (data.picks ?? {}) as PicksMap;
//           const cleaned = sanitizePicks(sortedGames, loadedPicks);
//           setPicks(cleaned);
//           setLocked(!!data.locked);
//         } else {
//           setPicks({});
//           setLocked(false);
//         }
//       } catch (e) {
//         console.error(e);
//         setMsg("Error loading bracket data. Check console.");
//       } finally {
//         setLoading(false);
//       }
//     }

//     run();
//   }, [user]);

//   const teamMap = useMemo(() => {
//     const m = new Map<string, TeamX>();
//     for (const t of teams) m.set(t.id, t);
//     return m;
//   }, [teams]);

//   const gameMap = useMemo(() => {
//     const m = new Map<string, Game>();
//     for (const g of games) m.set(g.id, g);
//     return m;
//   }, [games]);

//   const inc = useMemo(() => incomingMap(games), [games]);

//   const totalGames = useMemo(() => games.length, [games]);
//   const pickedCount = useMemo(() => Object.keys(picks).length, [picks]);

//   function setPick(gameId: string, teamId: string) {
//     if (locked) return;
//     const next = sanitizePicks(games, { ...picks, [gameId]: teamId });
//     setPicks(next);
//   }

//   function clearPick(gameId: string) {
//     if (locked) return;
//     const next = { ...picks };
//     delete next[gameId];
//     setPicks(sanitizePicks(games, next));
//   }

//   async function saveDraft() {
//     if (!user) {
//       setMsg("You must be signed in to save.");
//       return;
//     }
//     if (locked) {
//       setMsg("This bracket is locked.");
//       return;
//     }

//     setSaving(true);
//     setMsg("");
//     try {
//       const cleaned = sanitizePicks(games, picks);
//       const ref = doc(db, "tournaments", TOURNAMENT_ID, "entries", user.uid);

//       await setDoc(
//         ref,
//         {
//           userId: user.uid,
//           displayName: user.displayName || user.email || "Unknown",
//           locked: false,
//           picks: cleaned,
//           updatedAt: serverTimestamp(),
//           createdAt: serverTimestamp(),
//         } satisfies EntryDoc,
//         { merge: true }
//       );

//       setPicks(cleaned);
//       setMsg("Saved draft.");
//     } catch (e) {
//       console.error(e);
//       setMsg("Save failed. Check console.");
//     } finally {
//       setSaving(false);
//     }
//   }

//   async function submitBracket() {
//     if (!user) {
//       setMsg("You must be signed in to submit.");
//       return;
//     }
//     if (locked) {
//       setMsg("This bracket is already locked.");
//       return;
//     }

//     const ok = window.confirm(
//       "Submit and lock your bracket? You won't be able to edit after this."
//     );
//     if (!ok) return;

//     setSaving(true);
//     setMsg("");
//     try {
//       const cleaned = sanitizePicks(games, picks);
//       const ref = doc(db, "tournaments", TOURNAMENT_ID, "entries", user.uid);

//       // Ensure doc exists, then lock
//       await setDoc(
//         ref,
//         {
//           userId: user.uid,
//           displayName: user.displayName || user.email || "Unknown",
//           locked: false,
//           picks: cleaned,
//           updatedAt: serverTimestamp(),
//           createdAt: serverTimestamp(),
//         } satisfies EntryDoc,
//         { merge: true }
//       );

//       await updateDoc(ref, {
//         locked: true,
//         lockedAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//         picks: cleaned,
//       });

//       setPicks(cleaned);
//       setLocked(true);
//       setMsg("Submitted! Bracket is now locked.");
//     } catch (e) {
//       console.error(e);
//       setMsg("Submit failed. Check console.");
//     } finally {
//       setSaving(false);
//     }
//   }

//   const positionedGames = useMemo(() => {
//     return games.map((g) => ({ game: g, ...posForGame(g) }));
//   }, [games]);

//   const connectorPaths = useMemo(() => {
//     const paths: string[] = [];

//     for (const g of games) {
//       if (!g.nextGameId) continue;

//       const to = gameMap.get(g.nextGameId);
//       if (!to) continue;

//       const fromPos = posForGame(g);
//       const toPos = posForGame(to);

//       const fromSide =
//         g.round === 5 ? false : getSideInfo(g.round, g.game).isLeft;
//       const toSide =
//         to.round === 5 ? null : getSideInfo(to.round, to.game).isLeft;

//       const fromX = fromPos.x + (fromSide ? CARD_W : 0);
//       const fromY = fromPos.y + UNIT;

//       let toX = toPos.x;
//       let toY = toPos.y + UNIT;

//       if (to.round <= 4 && toSide === false) {
//         toX = toPos.x + CARD_W;
//       }

//       if (to.round === 5) {
//         toX = toPos.x + (fromSide ? 0 : CARD_W);
//       }

//       const midX = (fromX + toX) / 2;
//       const d = `M ${fromX} ${fromY} L ${midX} ${fromY} L ${midX} ${toY} L ${toX} ${toY}`;
//       paths.push(d);
//     }

//     return paths;
//   }, [games, gameMap]);

//   function focusRound(r: 1 | 2 | 3 | 4 | 5) {
//     setActiveRound(r);

//     // Light “helpful” scroll: move toward the middle columns.
//     // (Not perfect, but keeps UX nice without complicated logic.)
//     const el = scrollRef.current;
//     if (!el) return;

//     const targetCol = r === 5 ? 4 : r - 1;
//     const targetX = xForCol(targetCol);
//     el.scrollTo({ left: Math.max(0, targetX - 120), behavior: "smooth" });
//   }

//   if (loading) {
//     return (
//       <main style={{ padding: 24, fontFamily: "system-ui", color: "#fff" }}>
//         <h1 style={{ fontSize: 44, margin: 0 }}>My Bracket</h1>
//         <p style={{ opacity: 0.8 }}>Loading bracket data…</p>
//         <div
//           style={{
//             marginTop: 16,
//             border: "1px solid #222",
//             borderRadius: 14,
//             padding: 18,
//             background: "rgba(0,0,0,0.25)",
//           }}
//         >
//           Loading bracket data…
//         </div>
//       </main>
//     );
//   }

//   return (
//     <main style={{ padding: 24, fontFamily: "system-ui", color: "#fff" }}>
//       <div
//         style={{
//           display: "flex",
//           alignItems: "flex-start",
//           justifyContent: "space-between",
//           gap: 16,
//           flexWrap: "wrap",
//         }}
//       >
//         <div>
//           <h1 style={{ fontSize: 44, margin: 0 }}>My Bracket</h1>
//           <p style={{ opacity: 0.8, marginTop: 8, marginBottom: 8 }}>
//             Click a team to pick the winner. Later rounds auto-fill based on your earlier picks.
//           </p>
//           <div style={{ opacity: 0.75, marginTop: 4 }}>
//             Progress: {pickedCount}/{totalGames}
//           </div>
//           {locked ? (
//             <div style={{ marginTop: 10, color: "#7CFF7C" }}>
//               ✅ Locked (editing disabled)
//             </div>
//           ) : (
//             <div style={{ marginTop: 10, opacity: 0.75 }}>
//               Picks are <b>final</b> once you submit (you can’t edit after locking).
//             </div>
//           )}
//           {!user ? (
//             <div style={{ marginTop: 10, opacity: 0.75 }}>
//               Tip: You can play around with picks, but you must sign in to save/submit.
//             </div>
//           ) : null}
//         </div>

//         <div style={{ textAlign: "right" }}>
//           <div style={{ opacity: 0.75, marginBottom: 10 }}>
//             Signed in as <b>{fmtDisplayName(user)}</b>
//           </div>
//           <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
//             <button
//               onClick={saveDraft}
//               disabled={saving || !user || locked}
//               style={{
//                 padding: "10px 14px",
//                 borderRadius: 12,
//                 border: "1px solid #1f7a3a",
//                 background: "rgba(0,0,0,0.25)",
//                 color: "#7CFF7C",
//                 cursor: saving || !user || locked ? "not-allowed" : "pointer",
//                 minWidth: 120,
//               }}
//             >
//               {saving ? "Saving…" : "Save Draft"}
//             </button>

//             <button
//               onClick={submitBracket}
//               disabled={saving || !user || locked}
//               style={{
//                 padding: "10px 14px",
//                 borderRadius: 12,
//                 border: "1px solid #2b5cff",
//                 background: "rgba(0,0,0,0.25)",
//                 color: "#cfe0ff",
//                 cursor: saving || !user || locked ? "not-allowed" : "pointer",
//                 minWidth: 170,
//               }}
//             >
//               {locked ? "Submitted (locked)" : "Submit Bracket (locks)"}
//             </button>
//           </div>
//         </div>
//       </div>

//       {msg ? (
//         <div
//           style={{
//             marginTop: 14,
//             color: msg.toLowerCase().includes("fail") ? "#ff8b8b" : "#b7ffb7",
//           }}
//         >
//           {msg}
//         </div>
//       ) : null}

//       {/* Round focus buttons */}
//       <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
//         {([1, 2, 3, 4, 5] as const).map((r) => (
//           <button
//             key={r}
//             onClick={() => focusRound(r)}
//             style={{
//               padding: "10px 14px",
//               borderRadius: 12,
//               border: "1px solid #333",
//               background:
//                 activeRound === r ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.25)",
//               color: "#fff",
//               cursor: "pointer",
//               minWidth: 92,
//             }}
//           >
//             Round {r}
//           </button>
//         ))}
//       </div>

//       {/* Bracket canvas */}
//       <div
//         ref={scrollRef}
//         style={{
//           marginTop: 16,
//           overflow: "auto",
//           maxHeight: "78vh",
//           border: "1px solid #222",
//           borderRadius: 14,
//           padding: 12,
//           background: "rgba(0,0,0,0.25)",
//         }}
//       >
//         <div style={{ position: "relative", width: CANVAS_W, height: CANVAS_H }}>
//           {/* Column labels */}
//           {[
//             { col: 0, text: "R1" },
//             { col: 1, text: "R2" },
//             { col: 2, text: "R3" },
//             { col: 3, text: "R4" },
//             { col: 4, text: "Final" },
//             { col: 5, text: "R4" },
//             { col: 6, text: "R3" },
//             { col: 7, text: "R2" },
//             { col: 8, text: "R1" },
//           ].map((c) => (
//             <div
//               key={c.col}
//               style={{
//                 position: "absolute",
//                 top: 10,
//                 left: xForCol(c.col),
//                 width: CARD_W,
//                 fontSize: 12,
//                 opacity: 0.75,
//                 textAlign: "center",
//                 letterSpacing: 1,
//               }}
//             >
//               {c.text}
//             </div>
//           ))}

//           {/* Connectors */}
//           <svg
//             width={CANVAS_W}
//             height={CANVAS_H}
//             style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
//           >
//             {connectorPaths.map((d, i) => (
//               <path key={i} d={d} fill="none" stroke="#444" strokeWidth={2} />
//             ))}
//           </svg>

//           {/* Cards */}
//           {positionedGames.map(({ game, x, y }) => {
//             const aId = computeSlotTeamId(game, "A", picks, inc);
//             const bId = computeSlotTeamId(game, "B", picks, inc);

//             return (
//               <div key={game.id} style={{ position: "absolute", left: x, top: y }}>
//                 <GameCard
//                   game={game}
//                   teamMap={teamMap}
//                   picks={picks}
//                   locked={locked}
//                   activeRound={activeRound}
//                   aId={aId}
//                   bId={bId}
//                   onPick={(teamId) => setPick(game.id, teamId)}
//                   onClear={() => clearPick(game.id)}
//                 />
//               </div>
//             );
//           })}

//           {/* Champion label */}
//           <div
//             style={{
//               position: "absolute",
//               bottom: 10,
//               left: xForCol(4),
//               width: CARD_W,
//               textAlign: "center",
//               fontSize: 12,
//               opacity: 0.7,
//               letterSpacing: 2,
//             }}
//           >
//             CHAMPION
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }
// // end of MyBracketPage component



// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import { onAuthStateChanged, type User } from "firebase/auth";
// import {
//   doc,
//   getDoc,
//   serverTimestamp,
//   setDoc,
//   updateDoc,
// } from "firebase/firestore";

// import { auth, db } from "../../lib/firebase";
// import { listGames, type Game, roundGameCount } from "../../lib/games";
// import { listTeams, type Team } from "../../lib/teams";

// const TOURNAMENT_ID = "azhs-2026";

// /**
//  * Bracket layout constants (mirrors /bracket page)
//  */
// const UNIT = 46;
// const ROW_H = 36;
// const ROW_GAP = 4;
// const PAD = 8;

// const CARD_W = 320;
// const CARD_H = UNIT * 2;
// const COL_W = 380;
// const TOP_PAD = 90;

// const SIDE_TEAMS = 16;
// const CANVAS_H = TOP_PAD + SIDE_TEAMS * UNIT + 80;
// const CANVAS_W = 40 + COL_W * 9;

// type PicksMap = Record<string, string>; // gameId -> picked teamId

// type EntryDoc = {
//   userId: string;
//   displayName: string;
//   locked: boolean;
//   picks: PicksMap;
//   createdAt?: any;
//   updatedAt?: any;
//   lockedAt?: any;
// };

// // Optional logo fields (won’t break if your Team type doesn’t include them)
// type TeamX = Team & {
//   logoUrl?: string | null;
//   logoPath?: string | null;
// };

// function slugToLocalLogo(teamId: string) {
//   return `/logos/${teamId}.png`;
// }
// function slugToLocalLogoUpper(teamId: string) {
//   return `/logos/${teamId}.PNG`;
// }

// function sortGames(a: Game, b: Game) {
//   if (a.round !== b.round) return a.round - b.round;
//   return a.game - b.game;
// }

// function fmtDisplayName(u: User | null) {
//   if (!u) return "Guest";
//   return u.displayName || u.email || "Unknown";
// }

// function incomingMap(games: Game[]) {
//   // nextGameId + nextSlot tells us what feeds into a future game
//   // incoming[nextGameId].A = feederGameId
//   // incoming[nextGameId].B = feederGameId
//   const incoming: Record<string, { A?: string; B?: string }> = {};
//   for (const g of games) {
//     if (!g.nextGameId || !g.nextSlot) continue;
//     incoming[g.nextGameId] ||= {};
//     incoming[g.nextGameId]![g.nextSlot as "A" | "B"] = g.id;
//   }
//   return incoming;
// }

// function computeSlotTeamId(
//   game: Game,
//   slot: "A" | "B",
//   picks: PicksMap,
//   incoming: Record<string, { A?: string; B?: string }>
// ) {
//   // If the game already has teams set (Round 1), use them.
//   const direct = slot === "A" ? game.teamAId : game.teamBId;
//   if (direct) return direct;

//   // Otherwise, the slot comes from the winner pick of the feeder game.
//   const feederId = incoming[game.id]?.[slot];
//   if (!feederId) return null;

//   return picks[feederId] ?? null;
// }

// function sanitizePicks(games: Game[], picksIn: PicksMap) {
//   // If earlier picks change, downstream picks that are no longer possible should be cleared.
//   const gamesSorted = [...games].sort(sortGames);
//   const inc = incomingMap(gamesSorted);

//   const picks: PicksMap = { ...picksIn };

//   for (const g of gamesSorted) {
//     const a = computeSlotTeamId(g, "A", picks, inc);
//     const b = computeSlotTeamId(g, "B", picks, inc);

//     const valid = new Set<string>();
//     if (a) valid.add(a);
//     if (b) valid.add(b);

//     const cur = picks[g.id];
//     if (cur && !valid.has(cur)) {
//       delete picks[g.id];
//     }
//   }

//   return picks;
// }

// /** Bracket geometry helpers (mirrors /bracket page) */
// function getSideInfo(round: number, game: number) {
//   const total = roundGameCount(round);
//   const half = total / 2;
//   const isLeft = game <= half;
//   const localGame = isLeft ? game : game - half;
//   return { isLeft, localGame, half };
// }

// function topFor(round: number, localGame: number) {
//   const topIndex =
//     Math.pow(2, round) * localGame - (Math.pow(2, round - 1) + 1);
//   return TOP_PAD + topIndex * UNIT;
// }

// function colIndexFor(round: number, isLeft: boolean) {
//   if (round === 5) return 4; // final column
//   if (isLeft) return round - 1; // left: 0..3
//   return 9 - round; // right: 8..5
// }

// function xForCol(colIndex: number) {
//   const left = 20 + colIndex * COL_W;
//   return left + Math.floor((COL_W - CARD_W) / 2);
// }

// function posForGame(g: Game) {
//   if (g.round === 5) {
//     const col = 4;
//     const x = xForCol(col);
//     const y = TOP_PAD + (SIDE_TEAMS * UNIT) / 2 - UNIT;
//     return { x, y };
//   }

//   const { isLeft, localGame } = getSideInfo(g.round, g.game);
//   const col = colIndexFor(g.round, isLeft);
//   const x = xForCol(col);
//   const y = topFor(g.round, localGame);
//   return { x, y };
// }

// function TeamRowButton({
//   teamId,
//   teamMap,
//   selected,
//   disabled,
//   onClick,
// }: {
//   teamId: string | null;
//   teamMap: Map<string, TeamX>;
//   selected: boolean;
//   disabled: boolean;
//   onClick: () => void;
// }) {
//   const t = teamId ? teamMap.get(teamId) : null;

//   const name = teamId ? (t?.name ?? teamId) : "TBD";
//   const seed =
//     teamId && typeof (t as any)?.seed === "number" ? (t as any).seed : null;

//   // Supports: Team.logoUrl / Team.logoPath if you ever add them
//   const src =
//     teamId ? (t?.logoUrl || t?.logoPath || slugToLocalLogo(teamId)) : "";

//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       disabled={disabled}
//       style={{
//         display: "flex",
//         alignItems: "center",
//         gap: 10,
//         height: ROW_H,
//         padding: "0 8px",
//         borderRadius: 10,
//         background: selected
//           ? "rgba(43,92,255,0.16)"
//           : "rgba(0,0,0,0.0)",
//         border: selected
//           ? "1px solid rgba(43,92,255,0.75)"
//           : "1px solid transparent",
//         boxSizing: "border-box",
//         cursor: disabled ? "not-allowed" : "pointer",
//         opacity: disabled ? 0.55 : 1,
//         textAlign: "left",
//         width: "100%",
//         color: "#fff",
//       }}
//     >
//       <div
//         style={{
//           width: 26,
//           height: 26,
//           borderRadius: 7,
//           background: "#2a2a2a",
//           overflow: "hidden",
//           flex: "0 0 auto",
//           display: "grid",
//           placeItems: "center",
//         }}
//       >
//         {teamId ? (
//           <img
//             src={src}
//             alt=""
//             width={26}
//             height={26}
//             style={{ width: "100%", height: "100%", objectFit: "contain" }}
//             onError={(e) => {
//               const img = e.currentTarget as HTMLImageElement;

//               // If remote/field-based failed, try local .png once
//               if (!img.dataset.triedPng && (t?.logoUrl || t?.logoPath)) {
//                 img.dataset.triedPng = "1";
//                 img.src = slugToLocalLogo(teamId);
//                 return;
//               }

//               // If .png failed, try .PNG once (case-sensitive on Vercel)
//               if (!img.dataset.triedUpper) {
//                 img.dataset.triedUpper = "1";
//                 img.src = slugToLocalLogoUpper(teamId);
//                 return;
//               }

//               img.style.display = "none";
//             }}
//           />
//         ) : null}
//       </div>

//       <span
//         style={{
//           fontSize: 14,
//           fontWeight: selected ? 800 : 650,
//           letterSpacing: 0.2,
//           lineHeight: "16px",
//           opacity: teamId ? 1 : 0.65,
//         }}
//       >
//         {seed ? (
//           <>
//             <span style={{ opacity: 0.85 }}>{seed}</span>
//             <span style={{ opacity: 0.6 }}> · </span>
//           </>
//         ) : null}
//         {name}
//       </span>
//     </button>
//   );
// }

// function GameCard({
//   game,
//   teamMap,
//   picks,
//   locked,
//   activeRound,
//   aId,
//   bId,
//   onTogglePick,
// }: {
//   game: Game;
//   teamMap: Map<string, TeamX>;
//   picks: PicksMap;
//   locked: boolean;
//   activeRound: 1 | 2 | 3 | 4 | 5;
//   aId: string | null;
//   bId: string | null;
//   onTogglePick: (teamId: string) => void;
// }) {
//   const pick = picks[game.id] ?? null;
//   const focused = game.round === activeRound;

//   return (
//     <div
//       style={{
//         width: CARD_W,
//         height: CARD_H,
//         border: focused
//           ? "1px solid rgba(255,255,255,0.22)"
//           : "1px solid #343434",
//         borderRadius: 14,
//         padding: PAD,
//         background: "rgba(0,0,0,0.35)",
//         boxSizing: "border-box",
//         position: "relative",
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         gap: ROW_GAP,
//         boxShadow: focused ? "0 0 0 1px rgba(255,255,255,0.06) inset" : "none",
//       }}
//     >
//       <div
//         style={{
//           position: "absolute",
//           top: 8,
//           right: 10,
//           fontSize: 12,
//           opacity: 0.7,
//           letterSpacing: 0.5,
//         }}
//       >
//         {game.id}
//       </div>

//       <TeamRowButton
//         teamId={aId}
//         teamMap={teamMap}
//         selected={!!pick && pick === aId}
//         disabled={locked || !aId}
//         onClick={() => aId && onTogglePick(aId)}
//       />
//       <TeamRowButton
//         teamId={bId}
//         teamMap={teamMap}
//         selected={!!pick && pick === bId}
//         disabled={locked || !bId}
//         onClick={() => bId && onTogglePick(bId)}
//       />
//     </div>
//   );
// }

// export default function MyBracketPage() {
//   const [user, setUser] = useState<User | null>(null);

//   const [games, setGames] = useState<Game[]>([]);
//   const [teams, setTeams] = useState<TeamX[]>([]);

//   const [picks, setPicks] = useState<PicksMap>({});
//   const [locked, setLocked] = useState(false);

//   const [activeRound, setActiveRound] = useState<1 | 2 | 3 | 4 | 5>(1);

//   // Round focus side toggle for rounds with left/right
//   const [roundSide, setRoundSide] = useState<"left" | "right">("left");

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [msg, setMsg] = useState<string>("");

//   const scrollRef = useRef<HTMLDivElement | null>(null);

//   // Auth
//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (u) => setUser(u));
//     return () => unsub();
//   }, []);

//   // Load games/teams + entry doc
//   useEffect(() => {
//     async function run() {
//       setLoading(true);
//       setMsg("");
//       try {
//         const [g, t] = await Promise.all([listGames(), listTeams()]);
//         const sortedGames = [...g].sort(sortGames);
//         setGames(sortedGames);
//         setTeams(t as TeamX[]);

//         if (!user) {
//           setPicks({});
//           setLocked(false);
//           return;
//         }

//         const ref = doc(db, "tournaments", TOURNAMENT_ID, "entries", user.uid);
//         const snap = await getDoc(ref);

//         if (snap.exists()) {
//           const data = snap.data() as Partial<EntryDoc>;
//           const loadedPicks = (data.picks ?? {}) as PicksMap;
//           const cleaned = sanitizePicks(sortedGames, loadedPicks);
//           setPicks(cleaned);
//           setLocked(!!data.locked);
//         } else {
//           setPicks({});
//           setLocked(false);
//         }
//       } catch (e) {
//         console.error(e);
//         setMsg("Error loading bracket data. Check console.");
//       } finally {
//         setLoading(false);
//       }
//     }

//     run();
//   }, [user]);

//   const teamMap = useMemo(() => {
//     const m = new Map<string, TeamX>();
//     for (const t of teams) m.set(t.id, t);
//     return m;
//   }, [teams]);

//   const gameMap = useMemo(() => {
//     const m = new Map<string, Game>();
//     for (const g of games) m.set(g.id, g);
//     return m;
//   }, [games]);

//   const inc = useMemo(() => incomingMap(games), [games]);

//   const totalGames = useMemo(() => games.length, [games]);
//   const pickedCount = useMemo(() => Object.keys(picks).length, [picks]);

//   function setPick(gameId: string, teamId: string) {
//     if (locked) return;
//     const next = sanitizePicks(games, { ...picks, [gameId]: teamId });
//     setPicks(next);
//   }

//   function clearPick(gameId: string) {
//     if (locked) return;
//     const next = { ...picks };
//     delete next[gameId];
//     setPicks(sanitizePicks(games, next));
//   }

//   function togglePick(gameId: string, teamId: string) {
//     if (locked) return;

//     const cur = picks[gameId];
//     if (cur && cur === teamId) {
//       // Clicking the selected team again => unselect
//       clearPick(gameId);
//       return;
//     }
//     setPick(gameId, teamId);
//   }

//   async function saveDraft() {
//     if (!user) {
//       setMsg("You must be signed in to save.");
//       return;
//     }
//     if (locked) {
//       setMsg("This bracket is locked.");
//       return;
//     }

//     setSaving(true);
//     setMsg("");
//     try {
//       const cleaned = sanitizePicks(games, picks);
//       const ref = doc(db, "tournaments", TOURNAMENT_ID, "entries", user.uid);

//       await setDoc(
//         ref,
//         {
//           userId: user.uid,
//           displayName: user.displayName || user.email || "Unknown",
//           locked: false,
//           picks: cleaned,
//           updatedAt: serverTimestamp(),
//           createdAt: serverTimestamp(),
//         } satisfies EntryDoc,
//         { merge: true }
//       );

//       setPicks(cleaned);
//       setMsg("Saved draft.");
//     } catch (e) {
//       console.error(e);
//       setMsg("Save failed. Check console.");
//     } finally {
//       setSaving(false);
//     }
//   }

//   async function submitBracket() {
//     if (!user) {
//       setMsg("You must be signed in to submit.");
//       return;
//     }
//     if (locked) {
//       setMsg("This bracket is already locked.");
//       return;
//     }

//     const ok = window.confirm(
//       "Submit and lock your bracket? You won't be able to edit after this."
//     );
//     if (!ok) return;

//     setSaving(true);
//     setMsg("");
//     try {
//       const cleaned = sanitizePicks(games, picks);
//       const ref = doc(db, "tournaments", TOURNAMENT_ID, "entries", user.uid);

//       await setDoc(
//         ref,
//         {
//           userId: user.uid,
//           displayName: user.displayName || user.email || "Unknown",
//           locked: false,
//           picks: cleaned,
//           updatedAt: serverTimestamp(),
//           createdAt: serverTimestamp(),
//         } satisfies EntryDoc,
//         { merge: true }
//       );

//       await updateDoc(ref, {
//         locked: true,
//         lockedAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//         picks: cleaned,
//       });

//       setPicks(cleaned);
//       setLocked(true);
//       setMsg("Submitted! Bracket is now locked.");
//     } catch (e) {
//       console.error(e);
//       setMsg("Submit failed. Check console.");
//     } finally {
//       setSaving(false);
//     }
//   }

//   const positionedGames = useMemo(() => {
//     return games.map((g) => ({ game: g, ...posForGame(g) }));
//   }, [games]);

//   const connectorPaths = useMemo(() => {
//     const paths: string[] = [];

//     for (const g of games) {
//       if (!g.nextGameId) continue;

//       const to = gameMap.get(g.nextGameId);
//       if (!to) continue;

//       const fromPos = posForGame(g);
//       const toPos = posForGame(to);

//       const fromSide =
//         g.round === 5 ? false : getSideInfo(g.round, g.game).isLeft;
//       const toSide =
//         to.round === 5 ? null : getSideInfo(to.round, to.game).isLeft;

//       const fromX = fromPos.x + (fromSide ? CARD_W : 0);
//       const fromY = fromPos.y + UNIT;

//       let toX = toPos.x;
//       let toY = toPos.y + UNIT;

//       if (to.round <= 4 && toSide === false) {
//         toX = toPos.x + CARD_W;
//       }

//       if (to.round === 5) {
//         toX = toPos.x + (fromSide ? 0 : CARD_W);
//       }

//       const midX = (fromX + toX) / 2;
//       const d = `M ${fromX} ${fromY} L ${midX} ${fromY} L ${midX} ${toY} L ${toX} ${toY}`;
//       paths.push(d);
//     }

//     return paths;
//   }, [games, gameMap]);

//   function scrollToRound(r: 1 | 2 | 3 | 4 | 5, side: "left" | "right") {
//     const el = scrollRef.current;
//     if (!el) return;

//     // Round 5 is centered
//     if (r === 5) {
//       const targetX = xForCol(4);
//       el.scrollTo({ left: Math.max(0, targetX - 120), behavior: "smooth" });
//       return;
//     }

//     // Left/right columns
//     const col = side === "left" ? r - 1 : 9 - r;
//     const targetX = xForCol(col);
//     el.scrollTo({ left: Math.max(0, targetX - 120), behavior: "smooth" });
//   }

//   function focusRound(r: 1 | 2 | 3 | 4 | 5) {
//     // Round 5 has no left/right
//     if (r === 5) {
//       setActiveRound(5);
//       scrollToRound(5, "left");
//       return;
//     }

//     if (activeRound !== r) {
//       // Switching rounds: default to LEFT first
//       setActiveRound(r);
//       setRoundSide("left");
//       scrollToRound(r, "left");
//       return;
//     }

//     // Same round clicked again: toggle left/right
//     const nextSide = roundSide === "left" ? "right" : "left";
//     setRoundSide(nextSide);
//     scrollToRound(r, nextSide);
//   }

//   if (loading) {
//     return (
//       <main style={{ padding: 24, fontFamily: "system-ui", color: "#fff" }}>
//         <h1 style={{ fontSize: 44, margin: 0 }}>My Bracket</h1>
//         <p style={{ opacity: 0.8 }}>Loading bracket data…</p>
//         <div
//           style={{
//             marginTop: 16,
//             border: "1px solid #222",
//             borderRadius: 14,
//             padding: 18,
//             background: "rgba(0,0,0,0.25)",
//           }}
//         >
//           Loading bracket data…
//         </div>
//       </main>
//     );
//   }

//   return (
//     <main style={{ padding: 24, fontFamily: "system-ui", color: "#fff" }}>
//       <div
//         style={{
//           display: "flex",
//           alignItems: "flex-start",
//           justifyContent: "space-between",
//           gap: 16,
//           flexWrap: "wrap",
//         }}
//       >
//         <div>
//           <h1 style={{ fontSize: 44, margin: 0 }}>My Bracket</h1>
//           <p style={{ opacity: 0.8, marginTop: 8, marginBottom: 8 }}>
//             Click a team to pick the winner. Later rounds auto-fill based on your earlier picks.
//           </p>
//           <div style={{ opacity: 0.75, marginTop: 4 }}>
//             Progress: {pickedCount}/{totalGames}
//           </div>
//           {locked ? (
//             <div style={{ marginTop: 10, color: "#7CFF7C" }}>
//               ✅ Locked (editing disabled)
//             </div>
//           ) : (
//             <div style={{ marginTop: 10, opacity: 0.75 }}>
//               Picks are <b>final</b> once you submit (you can’t edit after locking).
//             </div>
//           )}
//           {!user ? (
//             <div style={{ marginTop: 10, opacity: 0.75 }}>
//               Tip: You can play around with picks, but you must sign in to save/submit.
//             </div>
//           ) : null}
//         </div>

//         <div style={{ textAlign: "right" }}>
//           <div style={{ opacity: 0.75, marginBottom: 10 }}>
//             Signed in as <b>{fmtDisplayName(user)}</b>
//           </div>
//           <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
//             <button
//               onClick={saveDraft}
//               disabled={saving || !user || locked}
//               style={{
//                 padding: "10px 14px",
//                 borderRadius: 12,
//                 border: "1px solid #1f7a3a",
//                 background: "rgba(0,0,0,0.25)",
//                 color: "#7CFF7C",
//                 cursor: saving || !user || locked ? "not-allowed" : "pointer",
//                 minWidth: 120,
//               }}
//             >
//               {saving ? "Saving…" : "Save Draft"}
//             </button>

//             <button
//               onClick={submitBracket}
//               disabled={saving || !user || locked}
//               style={{
//                 padding: "10px 14px",
//                 borderRadius: 12,
//                 border: "1px solid #2b5cff",
//                 background: "rgba(0,0,0,0.25)",
//                 color: "#cfe0ff",
//                 cursor: saving || !user || locked ? "not-allowed" : "pointer",
//                 minWidth: 170,
//               }}
//             >
//               {locked ? "Submitted (locked)" : "Submit Bracket (locks)"}
//             </button>
//           </div>
//         </div>
//       </div>

//       {msg ? (
//         <div
//           style={{
//             marginTop: 14,
//             color: msg.toLowerCase().includes("fail") ? "#ff8b8b" : "#b7ffb7",
//           }}
//         >
//           {msg}
//         </div>
//       ) : null}

//       {/* Round focus buttons (click same round again toggles LEFT/RIGHT for rounds 1-4) */}
//       <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
//         {([1, 2, 3, 4, 5] as const).map((r) => {
//           const showSide =
//             r !== 5 && activeRound === r ? ` (${roundSide.toUpperCase()})` : "";
//           return (
//             <button
//               key={r}
//               onClick={() => focusRound(r)}
//               style={{
//                 padding: "10px 14px",
//                 borderRadius: 12,
//                 border: "1px solid #333",
//                 background:
//                   activeRound === r
//                     ? "rgba(255,255,255,0.08)"
//                     : "rgba(0,0,0,0.25)",
//                 color: "#fff",
//                 cursor: "pointer",
//                 minWidth: 110,
//               }}
//               title={
//                 r === 5
//                   ? "Jump to Final"
//                   : "Click once for LEFT side, click again for RIGHT side"
//               }
//             >
//               Round {r}
//               {showSide}
//             </button>
//           );
//         })}
//       </div>

//       {/* Bracket canvas */}
//       <div
//         ref={scrollRef}
//         style={{
//           marginTop: 16,
//           overflow: "auto",
//           maxHeight: "78vh",
//           border: "1px solid #222",
//           borderRadius: 14,
//           padding: 12,
//           background: "rgba(0,0,0,0.25)",
//         }}
//       >
//         <div style={{ position: "relative", width: CANVAS_W, height: CANVAS_H }}>
//           {/* Column labels */}
//           {[
//             { col: 0, text: "R1" },
//             { col: 1, text: "R2" },
//             { col: 2, text: "R3" },
//             { col: 3, text: "R4" },
//             { col: 4, text: "Final" },
//             { col: 5, text: "R4" },
//             { col: 6, text: "R3" },
//             { col: 7, text: "R2" },
//             { col: 8, text: "R1" },
//           ].map((c) => (
//             <div
//               key={c.col}
//               style={{
//                 position: "absolute",
//                 top: 10,
//                 left: xForCol(c.col),
//                 width: CARD_W,
//                 fontSize: 12,
//                 opacity: 0.75,
//                 textAlign: "center",
//                 letterSpacing: 1,
//               }}
//             >
//               {c.text}
//             </div>
//           ))}

//           {/* Connectors */}
//           <svg
//             width={CANVAS_W}
//             height={CANVAS_H}
//             style={{
//               position: "absolute",
//               top: 0,
//               left: 0,
//               pointerEvents: "none",
//             }}
//           >
//             {connectorPaths.map((d, i) => (
//               <path key={i} d={d} fill="none" stroke="#444" strokeWidth={2} />
//             ))}
//           </svg>

//           {/* Cards */}
//           {positionedGames.map(({ game, x, y }) => {
//             const aId = computeSlotTeamId(game, "A", picks, inc);
//             const bId = computeSlotTeamId(game, "B", picks, inc);

//             return (
//               <div key={game.id} style={{ position: "absolute", left: x, top: y }}>
//                 <GameCard
//                   game={game}
//                   teamMap={teamMap}
//                   picks={picks}
//                   locked={locked}
//                   activeRound={activeRound}
//                   aId={aId}
//                   bId={bId}
//                   onTogglePick={(teamId) => togglePick(game.id, teamId)}
//                 />
//               </div>
//             );
//           })}

//           {/* Champion label */}
//           <div
//             style={{
//               position: "absolute",
//               bottom: 10,
//               left: xForCol(4),
//               width: CARD_W,
//               textAlign: "center",
//               fontSize: 12,
//               opacity: 0.7,
//               letterSpacing: 2,
//             }}
//           >
//             CHAMPION
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }
// // end of MyBracketPage component




// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import { useRouter } from "next/navigation";
// import { onAuthStateChanged, type User } from "firebase/auth";
// import {
//   doc,
//   getDoc,
//   serverTimestamp,
//   setDoc,
//   updateDoc,
// } from "firebase/firestore";

// import { auth, db } from "../../lib/firebase";
// import { listGames, type Game, roundGameCount } from "../../lib/games";
// import { listTeams, type Team } from "../../lib/teams";

// const TOURNAMENT_ID = "azhs-2026";

// /**
//  * Bracket layout constants (mirrors /bracket page)
//  */
// const UNIT = 46;
// const ROW_H = 36;
// const ROW_GAP = 4;
// const PAD = 8;

// const CARD_W = 320;
// const CARD_H = UNIT * 2;
// const COL_W = 380;
// const TOP_PAD = 90;

// const SIDE_TEAMS = 16;
// const CANVAS_H = TOP_PAD + SIDE_TEAMS * UNIT + 80;
// const CANVAS_W = 40 + COL_W * 9;

// type PicksMap = Record<string, string>; // gameId -> picked teamId

// type EntryDoc = {
//   userId: string;
//   displayName: string;
//   locked: boolean;
//   picks: PicksMap;
//   createdAt?: any;
//   updatedAt?: any;
//   lockedAt?: any;
// };

// // Optional logo fields (won’t break if your Team type doesn’t include them)
// type TeamX = Team & {
//   logoUrl?: string | null;
//   logoPath?: string | null;
// };

// function slugToLocalLogo(teamId: string) {
//   return `/logos/${teamId}.png`;
// }
// function slugToLocalLogoUpper(teamId: string) {
//   return `/logos/${teamId}.PNG`;
// }

// function sortGames(a: Game, b: Game) {
//   if (a.round !== b.round) return a.round - b.round;
//   return a.game - b.game;
// }

// function fmtDisplayName(u: User | null) {
//   if (!u) return "Guest";
//   return u.displayName || u.email || "Unknown";
// }

// function incomingMap(games: Game[]) {
//   // nextGameId + nextSlot tells us what feeds into a future game
//   // incoming[nextGameId].A = feederGameId
//   // incoming[nextGameId].B = feederGameId
//   const incoming: Record<string, { A?: string; B?: string }> = {};
//   for (const g of games) {
//     if (!g.nextGameId || !g.nextSlot) continue;
//     incoming[g.nextGameId] ||= {};
//     incoming[g.nextGameId]![g.nextSlot as "A" | "B"] = g.id;
//   }
//   return incoming;
// }

// function computeSlotTeamId(
//   game: Game,
//   slot: "A" | "B",
//   picks: PicksMap,
//   incoming: Record<string, { A?: string; B?: string }>
// ) {
//   // If the game already has teams set (Round 1), use them.
//   const direct = slot === "A" ? game.teamAId : game.teamBId;
//   if (direct) return direct;

//   // Otherwise, the slot comes from the winner pick of the feeder game.
//   const feederId = incoming[game.id]?.[slot];
//   if (!feederId) return null;

//   return picks[feederId] ?? null;
// }

// function sanitizePicks(games: Game[], picksIn: PicksMap) {
//   // If earlier picks change, downstream picks that are no longer possible should be cleared.
//   const gamesSorted = [...games].sort(sortGames);
//   const inc = incomingMap(gamesSorted);

//   const picks: PicksMap = { ...picksIn };

//   for (const g of gamesSorted) {
//     const a = computeSlotTeamId(g, "A", picks, inc);
//     const b = computeSlotTeamId(g, "B", picks, inc);

//     const valid = new Set<string>();
//     if (a) valid.add(a);
//     if (b) valid.add(b);

//     const cur = picks[g.id];
//     if (cur && !valid.has(cur)) {
//       delete picks[g.id];
//     }
//   }

//   return picks;
// }

// /** Bracket geometry helpers (mirrors /bracket page) */
// function getSideInfo(round: number, game: number) {
//   const total = roundGameCount(round);
//   const half = total / 2;
//   const isLeft = game <= half;
//   const localGame = isLeft ? game : game - half;
//   return { isLeft, localGame, half };
// }

// function topFor(round: number, localGame: number) {
//   const topIndex =
//     Math.pow(2, round) * localGame - (Math.pow(2, round - 1) + 1);
//   return TOP_PAD + topIndex * UNIT;
// }

// function colIndexFor(round: number, isLeft: boolean) {
//   if (round === 5) return 4; // final column
//   if (isLeft) return round - 1; // left: 0..3
//   return 9 - round; // right: 8..5
// }

// function xForCol(colIndex: number) {
//   const left = 20 + colIndex * COL_W;
//   return left + Math.floor((COL_W - CARD_W) / 2);
// }

// function posForGame(g: Game) {
//   if (g.round === 5) {
//     const col = 4;
//     const x = xForCol(col);
//     const y = TOP_PAD + (SIDE_TEAMS * UNIT) / 2 - UNIT;
//     return { x, y };
//   }

//   const { isLeft, localGame } = getSideInfo(g.round, g.game);
//   const col = colIndexFor(g.round, isLeft);
//   const x = xForCol(col);
//   const y = topFor(g.round, localGame);
//   return { x, y };
// }

// function TeamRowButton({
//   teamId,
//   teamMap,
//   selected,
//   disabled,
//   onClick,
// }: {
//   teamId: string | null;
//   teamMap: Map<string, TeamX>;
//   selected: boolean;
//   disabled: boolean;
//   onClick: () => void;
// }) {
//   const t = teamId ? teamMap.get(teamId) : null;

//   const name = teamId ? (t?.name ?? teamId) : "TBD";
//   const seed =
//     teamId && typeof (t as any)?.seed === "number" ? (t as any).seed : null;

//   // Supports: Team.logoUrl / Team.logoPath if you ever add them
//   const src =
//     teamId ? (t?.logoUrl || t?.logoPath || slugToLocalLogo(teamId)) : "";

//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       disabled={disabled}
//       style={{
//         display: "flex",
//         alignItems: "center",
//         gap: 10,
//         height: ROW_H,
//         padding: "0 8px",
//         borderRadius: 10,
//         background: selected
//           ? "rgba(43,92,255,0.16)"
//           : "rgba(0,0,0,0.0)",
//         border: selected
//           ? "1px solid rgba(43,92,255,0.75)"
//           : "1px solid transparent",
//         boxSizing: "border-box",
//         cursor: disabled ? "not-allowed" : "pointer",
//         opacity: disabled ? 0.55 : 1,
//         textAlign: "left",
//         width: "100%",
//         color: "#fff",
//       }}
//     >
//       <div
//         style={{
//           width: 26,
//           height: 26,
//           borderRadius: 7,
//           background: "#2a2a2a",
//           overflow: "hidden",
//           flex: "0 0 auto",
//           display: "grid",
//           placeItems: "center",
//         }}
//       >
//         {teamId ? (
//           <img
//             src={src}
//             alt=""
//             width={26}
//             height={26}
//             style={{ width: "100%", height: "100%", objectFit: "contain" }}
//             onError={(e) => {
//               const img = e.currentTarget as HTMLImageElement;

//               // If remote/field-based failed, try local .png once
//               if (!img.dataset.triedPng && (t?.logoUrl || t?.logoPath)) {
//                 img.dataset.triedPng = "1";
//                 img.src = slugToLocalLogo(teamId);
//                 return;
//               }

//               // If .png failed, try .PNG once (case-sensitive on Vercel)
//               if (!img.dataset.triedUpper) {
//                 img.dataset.triedUpper = "1";
//                 img.src = slugToLocalLogoUpper(teamId);
//                 return;
//               }

//               img.style.display = "none";
//             }}
//           />
//         ) : null}
//       </div>

//       <span
//         style={{
//           fontSize: 14,
//           fontWeight: selected ? 800 : 650,
//           letterSpacing: 0.2,
//           lineHeight: "16px",
//           opacity: teamId ? 1 : 0.65,
//         }}
//       >
//         {seed ? (
//           <>
//             <span style={{ opacity: 0.85 }}>{seed}</span>
//             <span style={{ opacity: 0.6 }}> · </span>
//           </>
//         ) : null}
//         {name}
//       </span>
//     </button>
//   );
// }

// function GameCard({
//   game,
//   teamMap,
//   picks,
//   locked,
//   activeRound,
//   aId,
//   bId,
//   onTogglePick,
// }: {
//   game: Game;
//   teamMap: Map<string, TeamX>;
//   picks: PicksMap;
//   locked: boolean;
//   activeRound: 1 | 2 | 3 | 4 | 5;
//   aId: string | null;
//   bId: string | null;
//   onTogglePick: (teamId: string) => void;
// }) {
//   const pick = picks[game.id] ?? null;
//   const focused = game.round === activeRound;

//   return (
//     <div
//       style={{
//         width: CARD_W,
//         height: CARD_H,
//         border: focused
//           ? "1px solid rgba(255,255,255,0.22)"
//           : "1px solid #343434",
//         borderRadius: 14,
//         padding: PAD,
//         background: "rgba(0,0,0,0.35)",
//         boxSizing: "border-box",
//         position: "relative",
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         gap: ROW_GAP,
//         boxShadow: focused ? "0 0 0 1px rgba(255,255,255,0.06) inset" : "none",
//       }}
//     >
//       <div
//         style={{
//           position: "absolute",
//           top: 8,
//           right: 10,
//           fontSize: 12,
//           opacity: 0.7,
//           letterSpacing: 0.5,
//         }}
//       >
//         {game.id}
//       </div>

//       <TeamRowButton
//         teamId={aId}
//         teamMap={teamMap}
//         selected={!!pick && pick === aId}
//         disabled={locked || !aId}
//         onClick={() => aId && onTogglePick(aId)}
//       />
//       <TeamRowButton
//         teamId={bId}
//         teamMap={teamMap}
//         selected={!!pick && pick === bId}
//         disabled={locked || !bId}
//         onClick={() => bId && onTogglePick(bId)}
//       />
//     </div>
//   );
// }

// export default function MyBracketPage() {
//   const router = useRouter();

//   const [user, setUser] = useState<User | null>(null);

//   const [games, setGames] = useState<Game[]>([]);
//   const [teams, setTeams] = useState<TeamX[]>([]);

//   const [picks, setPicks] = useState<PicksMap>({});
//   const [locked, setLocked] = useState(false);

//   const [activeRound, setActiveRound] = useState<1 | 2 | 3 | 4 | 5>(1);

//   // Round focus side toggle for rounds with left/right
//   const [roundSide, setRoundSide] = useState<"left" | "right">("left");

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [msg, setMsg] = useState<string>("");

//   const scrollRef = useRef<HTMLDivElement | null>(null);

//   // Auth
//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (u) => setUser(u));
//     return () => unsub();
//   }, []);

//   // Load games/teams + entry doc
//   useEffect(() => {
//     async function run() {
//       setLoading(true);
//       setMsg("");
//       try {
//         const [g, t] = await Promise.all([listGames(), listTeams()]);
//         const sortedGames = [...g].sort(sortGames);
//         setGames(sortedGames);
//         setTeams(t as TeamX[]);

//         if (!user) {
//           setPicks({});
//           setLocked(false);
//           return;
//         }

//         const ref = doc(db, "tournaments", TOURNAMENT_ID, "entries", user.uid);
//         const snap = await getDoc(ref);

//         if (snap.exists()) {
//           const data = snap.data() as Partial<EntryDoc>;
//           const loadedPicks = (data.picks ?? {}) as PicksMap;
//           const cleaned = sanitizePicks(sortedGames, loadedPicks);
//           setPicks(cleaned);
//           setLocked(!!data.locked);
//         } else {
//           setPicks({});
//           setLocked(false);
//         }
//       } catch (e) {
//         console.error(e);
//         setMsg("Error loading bracket data. Check console.");
//       } finally {
//         setLoading(false);
//       }
//     }

//     run();
//   }, [user]);

//   const teamMap = useMemo(() => {
//     const m = new Map<string, TeamX>();
//     for (const t of teams) m.set(t.id, t);
//     return m;
//   }, [teams]);

//   const gameMap = useMemo(() => {
//     const m = new Map<string, Game>();
//     for (const g of games) m.set(g.id, g);
//     return m;
//   }, [games]);

//   const inc = useMemo(() => incomingMap(games), [games]);

//   const totalGames = useMemo(() => games.length, [games]);
//   const pickedCount = useMemo(() => Object.keys(picks).length, [picks]);

//   function setPick(gameId: string, teamId: string) {
//     if (locked) return;
//     const next = sanitizePicks(games, { ...picks, [gameId]: teamId });
//     setPicks(next);
//   }

//   function clearPick(gameId: string) {
//     if (locked) return;
//     const next = { ...picks };
//     delete next[gameId];
//     setPicks(sanitizePicks(games, next));
//   }

//   function togglePick(gameId: string, teamId: string) {
//     if (locked) return;

//     const cur = picks[gameId];
//     if (cur && cur === teamId) {
//       // Clicking the selected team again => unselect
//       clearPick(gameId);
//       return;
//     }
//     setPick(gameId, teamId);
//   }

//   async function saveDraft() {
//     if (!user) {
//       setMsg("You must be signed in to save.");
//       return;
//     }
//     if (locked) {
//       setMsg("This bracket is locked.");
//       return;
//     }

//     setSaving(true);
//     setMsg("");
//     try {
//       const cleaned = sanitizePicks(games, picks);
//       const ref = doc(db, "tournaments", TOURNAMENT_ID, "entries", user.uid);

//       await setDoc(
//         ref,
//         {
//           userId: user.uid,
//           displayName: user.displayName || user.email || "Unknown",
//           locked: false,
//           picks: cleaned,
//           updatedAt: serverTimestamp(),
//           createdAt: serverTimestamp(),
//         } satisfies EntryDoc,
//         { merge: true }
//       );

//       setPicks(cleaned);
//       setMsg("Saved draft.");
//     } catch (e) {
//       console.error(e);
//       setMsg("Save failed. Check console.");
//     } finally {
//       setSaving(false);
//     }
//   }

//   async function submitBracket() {
//     if (!user) {
//       setMsg("You must be signed in to submit.");
//       return;
//     }
//     if (locked) {
//       setMsg("This bracket is already locked.");
//       return;
//     }

//     const ok = window.confirm(
//       "Submit and lock your bracket? You won't be able to edit after this."
//     );
//     if (!ok) return;

//     setSaving(true);
//     setMsg("");
//     try {
//       const cleaned = sanitizePicks(games, picks);
//       const ref = doc(db, "tournaments", TOURNAMENT_ID, "entries", user.uid);

//       await setDoc(
//         ref,
//         {
//           userId: user.uid,
//           displayName: user.displayName || user.email || "Unknown",
//           locked: false,
//           picks: cleaned,
//           updatedAt: serverTimestamp(),
//           createdAt: serverTimestamp(),
//         } satisfies EntryDoc,
//         { merge: true }
//       );

//       await updateDoc(ref, {
//         locked: true,
//         lockedAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//         picks: cleaned,
//       });

//       setPicks(cleaned);
//       setLocked(true);
//       setMsg("Submitted! Bracket is now locked.");
//     } catch (e) {
//       console.error(e);
//       setMsg("Submit failed. Check console.");
//     } finally {
//       setSaving(false);
//     }
//   }

//   const positionedGames = useMemo(() => {
//     return games.map((g) => ({ game: g, ...posForGame(g) }));
//   }, [games]);

//   const connectorPaths = useMemo(() => {
//     const paths: string[] = [];

//     for (const g of games) {
//       if (!g.nextGameId) continue;

//       const to = gameMap.get(g.nextGameId);
//       if (!to) continue;

//       const fromPos = posForGame(g);
//       const toPos = posForGame(to);

//       const fromSide =
//         g.round === 5 ? false : getSideInfo(g.round, g.game).isLeft;
//       const toSide =
//         to.round === 5 ? null : getSideInfo(to.round, to.game).isLeft;

//       const fromX = fromPos.x + (fromSide ? CARD_W : 0);
//       const fromY = fromPos.y + UNIT;

//       let toX = toPos.x;
//       let toY = toPos.y + UNIT;

//       if (to.round <= 4 && toSide === false) {
//         toX = toPos.x + CARD_W;
//       }

//       if (to.round === 5) {
//         toX = toPos.x + (fromSide ? 0 : CARD_W);
//       }

//       const midX = (fromX + toX) / 2;
//       const d = `M ${fromX} ${fromY} L ${midX} ${fromY} L ${midX} ${toY} L ${toX} ${toY}`;
//       paths.push(d);
//     }

//     return paths;
//   }, [games, gameMap]);

//   function scrollToRound(r: 1 | 2 | 3 | 4 | 5, side: "left" | "right") {
//     const el = scrollRef.current;
//     if (!el) return;

//     // Round 5 is centered
//     if (r === 5) {
//       const targetX = xForCol(4);
//       el.scrollTo({ left: Math.max(0, targetX - 120), behavior: "smooth" });
//       return;
//     }

//     // Left/right columns
//     const col = side === "left" ? r - 1 : 9 - r;
//     const targetX = xForCol(col);
//     el.scrollTo({ left: Math.max(0, targetX - 120), behavior: "smooth" });
//   }

//   function focusRound(r: 1 | 2 | 3 | 4 | 5) {
//     // Round 5 has no left/right
//     if (r === 5) {
//       setActiveRound(5);
//       scrollToRound(5, "left");
//       return;
//     }

//     if (activeRound !== r) {
//       // Switching rounds: default to LEFT first
//       setActiveRound(r);
//       setRoundSide("left");
//       scrollToRound(r, "left");
//       return;
//     }

//     // Same round clicked again: toggle left/right
//     const nextSide = roundSide === "left" ? "right" : "left";
//     setRoundSide(nextSide);
//     scrollToRound(r, nextSide);
//   }

//   if (loading) {
//     return (
//       <main style={{ padding: 24, fontFamily: "system-ui", color: "#fff" }}>
//         <h1 style={{ fontSize: 44, margin: 0 }}>My Bracket</h1>
//         <p style={{ opacity: 0.8 }}>Loading bracket data…</p>
//         <div
//           style={{
//             marginTop: 16,
//             border: "1px solid #222",
//             borderRadius: 14,
//             padding: 18,
//             background: "rgba(0,0,0,0.25)",
//           }}
//         >
//           Loading bracket data…
//         </div>
//       </main>
//     );
//   }

//   return (
//     <main style={{ padding: 24, fontFamily: "system-ui", color: "#fff" }}>
//       <div
//         style={{
//           display: "flex",
//           alignItems: "flex-start",
//           justifyContent: "space-between",
//           gap: 16,
//           flexWrap: "wrap",
//         }}
//       >
//         <div>
//           {/* HOME BUTTON + TITLE */}
//           <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//             <button
//               type="button"
//               onClick={() => router.push("/")}
//               style={{
//                 padding: "10px 12px",
//                 borderRadius: 12,
//                 border: "1px solid rgba(255,255,255,0.35)",
//                 background:
//                   "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(0,0,0,0.35))",
//                 color: "#fff",
//                 cursor: "pointer",
//                 fontWeight: 800,
//                 letterSpacing: 0.3,
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 8,
//                 boxShadow:
//                   "0 8px 20px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.08) inset",
//               }}
//               title="Back to Home"
//             >
//               <span style={{ opacity: 0.9, fontSize: 16 }}>←</span>
//               Home
//             </button>

//             <h1 style={{ fontSize: 44, margin: 0 }}>My Bracket</h1>
//           </div>

//           <p style={{ opacity: 0.8, marginTop: 10, marginBottom: 8 }}>
//             Click a team to pick the winner. Later rounds auto-fill based on your earlier picks.
//           </p>
//           <div style={{ opacity: 0.75, marginTop: 4 }}>
//             Progress: {pickedCount}/{totalGames}
//           </div>
//           {locked ? (
//             <div style={{ marginTop: 10, color: "#7CFF7C" }}>
//               ✅ Locked (editing disabled)
//             </div>
//           ) : (
//             <div style={{ marginTop: 10, opacity: 0.75 }}>
//               Picks are <b>final</b> once you submit (you can’t edit after locking).
//             </div>
//           )}
//           {!user ? (
//             <div style={{ marginTop: 10, opacity: 0.75 }}>
//               Tip: You can play around with picks, but you must sign in to save/submit.
//             </div>
//           ) : null}
//         </div>

//         <div style={{ textAlign: "right" }}>
//           <div style={{ opacity: 0.75, marginBottom: 10 }}>
//             Signed in as <b>{fmtDisplayName(user)}</b>
//           </div>
//           <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
//             <button
//               onClick={saveDraft}
//               disabled={saving || !user || locked}
//               style={{
//                 padding: "10px 14px",
//                 borderRadius: 12,
//                 border: "1px solid #1f7a3a",
//                 background: "rgba(0,0,0,0.25)",
//                 color: "#7CFF7C",
//                 cursor: saving || !user || locked ? "not-allowed" : "pointer",
//                 minWidth: 120,
//               }}
//             >
//               {saving ? "Saving…" : "Save Draft"}
//             </button>

//             <button
//               onClick={submitBracket}
//               disabled={saving || !user || locked}
//               style={{
//                 padding: "10px 14px",
//                 borderRadius: 12,
//                 border: "1px solid #2b5cff",
//                 background: "rgba(0,0,0,0.25)",
//                 color: "#cfe0ff",
//                 cursor: saving || !user || locked ? "not-allowed" : "pointer",
//                 minWidth: 170,
//               }}
//             >
//               {locked ? "Submitted (locked)" : "Submit Bracket (locks)"}
//             </button>
//           </div>
//         </div>
//       </div>

//       {msg ? (
//         <div
//           style={{
//             marginTop: 14,
//             color: msg.toLowerCase().includes("fail") ? "#ff8b8b" : "#b7ffb7",
//           }}
//         >
//           {msg}
//         </div>
//       ) : null}

//       {/* Round focus buttons (click same round again toggles LEFT/RIGHT for rounds 1-4) */}
//       <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
//         {([1, 2, 3, 4, 5] as const).map((r) => {
//           const showSide =
//             r !== 5 && activeRound === r ? ` (${roundSide.toUpperCase()})` : "";
//           return (
//             <button
//               key={r}
//               onClick={() => focusRound(r)}
//               style={{
//                 padding: "10px 14px",
//                 borderRadius: 12,
//                 border: "1px solid #333",
//                 background:
//                   activeRound === r
//                     ? "rgba(255,255,255,0.08)"
//                     : "rgba(0,0,0,0.25)",
//                 color: "#fff",
//                 cursor: "pointer",
//                 minWidth: 110,
//               }}
//               title={
//                 r === 5
//                   ? "Jump to Final"
//                   : "Click once for LEFT side, click again for RIGHT side"
//               }
//             >
//               Round {r}
//               {showSide}
//             </button>
//           );
//         })}
//       </div>

//       {/* Bracket canvas */}
//       <div
//         ref={scrollRef}
//         style={{
//           marginTop: 16,
//           overflow: "auto",
//           maxHeight: "78vh",
//           border: "1px solid #222",
//           borderRadius: 14,
//           padding: 12,
//           background: "rgba(0,0,0,0.25)",
//         }}
//       >
//         <div style={{ position: "relative", width: CANVAS_W, height: CANVAS_H }}>
//           {/* Column labels */}
//           {[
//             { col: 0, text: "R1" },
//             { col: 1, text: "R2" },
//             { col: 2, text: "R3" },
//             { col: 3, text: "R4" },
//             { col: 4, text: "Final" },
//             { col: 5, text: "R4" },
//             { col: 6, text: "R3" },
//             { col: 7, text: "R2" },
//             { col: 8, text: "R1" },
//           ].map((c) => (
//             <div
//               key={c.col}
//               style={{
//                 position: "absolute",
//                 top: 10,
//                 left: xForCol(c.col),
//                 width: CARD_W,
//                 fontSize: 12,
//                 opacity: 0.75,
//                 textAlign: "center",
//                 letterSpacing: 1,
//               }}
//             >
//               {c.text}
//             </div>
//           ))}

//           {/* Connectors */}
//           <svg
//             width={CANVAS_W}
//             height={CANVAS_H}
//             style={{
//               position: "absolute",
//               top: 0,
//               left: 0,
//               pointerEvents: "none",
//             }}
//           >
//             {connectorPaths.map((d, i) => (
//               <path key={i} d={d} fill="none" stroke="#444" strokeWidth={2} />
//             ))}
//           </svg>

//           {/* Cards */}
//           {positionedGames.map(({ game, x, y }) => {
//             const aId = computeSlotTeamId(game, "A", picks, inc);
//             const bId = computeSlotTeamId(game, "B", picks, inc);

//             return (
//               <div key={game.id} style={{ position: "absolute", left: x, top: y }}>
//                 <GameCard
//                   game={game}
//                   teamMap={teamMap}
//                   picks={picks}
//                   locked={locked}
//                   activeRound={activeRound}
//                   aId={aId}
//                   bId={bId}
//                   onTogglePick={(teamId) => togglePick(game.id, teamId)}
//                 />
//               </div>
//             );
//           })}

//           {/* Champion label */}
//           <div
//             style={{
//               position: "absolute",
//               bottom: 10,
//               left: xForCol(4),
//               width: CARD_W,
//               textAlign: "center",
//               fontSize: 12,
//               opacity: 0.7,
//               letterSpacing: 2,
//             }}
//           >
//             CHAMPION
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }
// // end of MyBracketPage component






"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";

import { auth, db } from "../../lib/firebase";
import { listGames, type Game, roundGameCount } from "../../lib/games";
import { listTeams, type Team } from "../../lib/teams";

const TOURNAMENT_ID = "azhs-2026";

/**
 * Bracket layout constants (mirrors /bracket page)
 */
const UNIT = 46;
const ROW_H = 36;
const ROW_GAP = 4;
const PAD = 8;

const CARD_W = 320;
const CARD_H = UNIT * 2;
const COL_W = 380;
const TOP_PAD = 90;

const SIDE_TEAMS = 16;
const CANVAS_H = TOP_PAD + SIDE_TEAMS * UNIT + 80;
const CANVAS_W = 40 + COL_W * 9;

type PicksMap = Record<string, string>; // gameId -> picked teamId

type ChampionshipScore = {
  a: number | null;
  b: number | null;
};

type EntryDoc = {
  userId: string;
  displayName: string;
  locked: boolean;
  picks: PicksMap;

  // ✅ NEW: tie-breaker score prediction
  championshipScore?: ChampionshipScore;

  createdAt?: any;
  updatedAt?: any;
  lockedAt?: any;
};

// Optional logo fields (won’t break if your Team type doesn’t include them)
type TeamX = Team & {
  logoUrl?: string | null;
  logoPath?: string | null;
};

function slugToLocalLogo(teamId: string) {
  return `/logos/${teamId}.png`;
}
function slugToLocalLogoUpper(teamId: string) {
  return `/logos/${teamId}.PNG`;
}

function sortGames(a: Game, b: Game) {
  if (a.round !== b.round) return a.round - b.round;
  return a.game - b.game;
}

function fmtDisplayName(u: User | null) {
  if (!u) return "Guest";
  return u.displayName || u.email || "Unknown";
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

/** Bracket geometry helpers (mirrors /bracket page) */
function getSideInfo(round: number, game: number) {
  const total = roundGameCount(round);
  const half = total / 2;
  const isLeft = game <= half;
  const localGame = isLeft ? game : game - half;
  return { isLeft, localGame, half };
}

function topFor(round: number, localGame: number) {
  const topIndex = Math.pow(2, round) * localGame - (Math.pow(2, round - 1) + 1);
  return TOP_PAD + topIndex * UNIT;
}

function colIndexFor(round: number, isLeft: boolean) {
  if (round === 5) return 4; // final column
  if (isLeft) return round - 1; // left: 0..3
  return 9 - round; // right: 8..5
}

function xForCol(colIndex: number) {
  const left = 20 + colIndex * COL_W;
  return left + Math.floor((COL_W - CARD_W) / 2);
}

function posForGame(g: Game) {
  if (g.round === 5) {
    const col = 4;
    const x = xForCol(col);
    const y = TOP_PAD + (SIDE_TEAMS * UNIT) / 2 - UNIT;
    return { x, y };
  }

  const { isLeft, localGame } = getSideInfo(g.round, g.game);
  const col = colIndexFor(g.round, isLeft);
  const x = xForCol(col);
  const y = topFor(g.round, localGame);
  return { x, y };
}

function formatTeamLabel(teamId: string | null, teamMap: Map<string, TeamX>) {
  if (!teamId) return "TBD";
  const t = teamMap.get(teamId);
  if (!t) return teamId;

  const seed = typeof (t as any)?.seed === "number" ? (t as any).seed : null;
  const name = t.name ?? teamId;

  return seed ? `${seed} · ${name}` : name;
}

function parseScoreInput(s: string): number | null {
  const t = s.trim();
  if (!t) return null;
  // whole number only
  const n = Number(t);
  if (!Number.isFinite(n)) return null;
  const int = Math.floor(n);
  if (int !== n) return null;
  if (int < 0) return null;
  // keep it reasonable (prevents accidental 99999)
  if (int > 300) return null;
  return int;
}

function TeamRowButton({
  teamId,
  teamMap,
  selected,
  disabled,
  onClick,
}: {
  teamId: string | null;
  teamMap: Map<string, TeamX>;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  const t = teamId ? teamMap.get(teamId) : null;

  const name = teamId ? (t?.name ?? teamId) : "TBD";
  const seed = teamId && typeof (t as any)?.seed === "number" ? (t as any).seed : null;

  // Supports: Team.logoUrl / Team.logoPath if you ever add them
  const src = teamId ? (t?.logoUrl || t?.logoPath || slugToLocalLogo(teamId)) : "";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        height: ROW_H,
        padding: "0 8px",
        borderRadius: 10,
        background: selected ? "rgba(43,92,255,0.16)" : "rgba(0,0,0,0.0)",
        border: selected ? "1px solid rgba(43,92,255,0.75)" : "1px solid transparent",
        boxSizing: "border-box",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1,
        textAlign: "left",
        width: "100%",
        color: "#fff",
      }}
    >
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: 7,
          background: "#2a2a2a",
          overflow: "hidden",
          flex: "0 0 auto",
          display: "grid",
          placeItems: "center",
        }}
      >
        {teamId ? (
          <img
            src={src}
            alt=""
            width={26}
            height={26}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;

              // If remote/field-based failed, try local .png once
              if (!img.dataset.triedPng && (t?.logoUrl || t?.logoPath)) {
                img.dataset.triedPng = "1";
                img.src = slugToLocalLogo(teamId);
                return;
              }

              // If .png failed, try .PNG once (case-sensitive on Vercel)
              if (!img.dataset.triedUpper) {
                img.dataset.triedUpper = "1";
                img.src = slugToLocalLogoUpper(teamId);
                return;
              }

              img.style.display = "none";
            }}
          />
        ) : null}
      </div>

      <span
        style={{
          fontSize: 14,
          fontWeight: selected ? 800 : 650,
          letterSpacing: 0.2,
          lineHeight: "16px",
          opacity: teamId ? 1 : 0.65,
        }}
      >
        {seed ? (
          <>
            <span style={{ opacity: 0.85 }}>{seed}</span>
            <span style={{ opacity: 0.6 }}> · </span>
          </>
        ) : null}
        {name}
      </span>
    </button>
  );
}

function GameCard({
  game,
  teamMap,
  picks,
  locked,
  activeRound,
  aId,
  bId,
  onTogglePick,
}: {
  game: Game;
  teamMap: Map<string, TeamX>;
  picks: PicksMap;
  locked: boolean;
  activeRound: 1 | 2 | 3 | 4 | 5;
  aId: string | null;
  bId: string | null;
  onTogglePick: (teamId: string) => void;
}) {
  const pick = picks[game.id] ?? null;
  const focused = game.round === activeRound;

  return (
    <div
      style={{
        width: CARD_W,
        height: CARD_H,
        border: focused ? "1px solid rgba(255,255,255,0.22)" : "1px solid #343434",
        borderRadius: 14,
        padding: PAD,
        background: "rgba(0,0,0,0.35)",
        boxSizing: "border-box",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: ROW_GAP,
        boxShadow: focused ? "0 0 0 1px rgba(255,255,255,0.06) inset" : "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 8,
          right: 10,
          fontSize: 12,
          opacity: 0.7,
          letterSpacing: 0.5,
        }}
      >
        {game.id}
      </div>

      <TeamRowButton
        teamId={aId}
        teamMap={teamMap}
        selected={!!pick && pick === aId}
        disabled={locked || !aId}
        onClick={() => aId && onTogglePick(aId)}
      />
      <TeamRowButton
        teamId={bId}
        teamMap={teamMap}
        selected={!!pick && pick === bId}
        disabled={locked || !bId}
        onClick={() => bId && onTogglePick(bId)}
      />
    </div>
  );
}

export default function MyBracketPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  const [games, setGames] = useState<Game[]>([]);
  const [teams, setTeams] = useState<TeamX[]>([]);

  const [picks, setPicks] = useState<PicksMap>({});
  const [locked, setLocked] = useState(false);

  const [activeRound, setActiveRound] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Round focus side toggle for rounds with left/right
  const [roundSide, setRoundSide] = useState<"left" | "right">("left");

  // ✅ NEW: Championship score prediction inputs (as strings so empty is allowed)
  const [champScoreA, setChampScoreA] = useState<string>("");
  const [champScoreB, setChampScoreB] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string>("");

  const scrollRef = useRef<HTMLDivElement | null>(null);

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
        setTeams(t as TeamX[]);

        if (!user) {
          setPicks({});
          setLocked(false);
          setChampScoreA("");
          setChampScoreB("");
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

          // ✅ load tie-breaker
          const a = data.championshipScore?.a;
          const b = data.championshipScore?.b;
          setChampScoreA(typeof a === "number" ? String(a) : "");
          setChampScoreB(typeof b === "number" ? String(b) : "");
        } else {
          setPicks({});
          setLocked(false);
          setChampScoreA("");
          setChampScoreB("");
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
    const m = new Map<string, TeamX>();
    for (const t of teams) m.set(t.id, t);
    return m;
  }, [teams]);

  const gameMap = useMemo(() => {
    const m = new Map<string, Game>();
    for (const g of games) m.set(g.id, g);
    return m;
  }, [games]);

  const inc = useMemo(() => incomingMap(games), [games]);

  const totalGames = useMemo(() => games.length, [games]);
  const pickedCount = useMemo(() => Object.keys(picks).length, [picks]);

  // ✅ find the championship game (round 5)
  const finalGame = useMemo(() => games.find((g) => g.round === 5) ?? null, [games]);

  const finalAId = useMemo(() => {
    if (!finalGame) return null;
    return computeSlotTeamId(finalGame, "A", picks, inc);
  }, [finalGame, picks, inc]);

  const finalBId = useMemo(() => {
    if (!finalGame) return null;
    return computeSlotTeamId(finalGame, "B", picks, inc);
  }, [finalGame, picks, inc]);

  const finalALabel = useMemo(() => formatTeamLabel(finalAId, teamMap), [finalAId, teamMap]);
  const finalBLabel = useMemo(() => formatTeamLabel(finalBId, teamMap), [finalBId, teamMap]);

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

  function togglePick(gameId: string, teamId: string) {
    if (locked) return;

    const cur = picks[gameId];
    if (cur && cur === teamId) {
      // Clicking the selected team again => unselect
      clearPick(gameId);
      return;
    }
    setPick(gameId, teamId);
  }

  function getChampionshipScoreObj(): ChampionshipScore {
    return {
      a: parseScoreInput(champScoreA),
      b: parseScoreInput(champScoreB),
    };
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

      const champ = getChampionshipScoreObj();

      await setDoc(
        ref,
        {
          userId: user.uid,
          displayName: user.displayName || user.email || "Unknown",
          locked: false,
          picks: cleaned,

          // ✅ NEW: save tie-breaker
          championshipScore: champ,

          updatedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
        } satisfies EntryDoc,
        { merge: true }
      );

      setPicks(cleaned);
      setMsg("Saved draft (including tie-breaker score).");
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

    // ✅ Require tie-breaker before submit
    const champ = getChampionshipScoreObj();
    if (champ.a === null || champ.b === null) {
      setMsg(
        "Please enter your predicted Championship Final Score (both teams) before submitting. (Whole numbers only)"
      );
      return;
    }

    const ok = window.confirm(
      "Submit and lock your bracket? You won't be able to edit after this."
    );
    if (!ok) return;

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

          // ✅ NEW: store tie-breaker at submit too
          championshipScore: champ,

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
        championshipScore: champ,
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

  const positionedGames = useMemo(() => {
    return games.map((g) => ({ game: g, ...posForGame(g) }));
  }, [games]);

  const connectorPaths = useMemo(() => {
    const paths: string[] = [];

    for (const g of games) {
      if (!g.nextGameId) continue;

      const to = gameMap.get(g.nextGameId);
      if (!to) continue;

      const fromPos = posForGame(g);
      const toPos = posForGame(to);

      const fromSide = g.round === 5 ? false : getSideInfo(g.round, g.game).isLeft;
      const toSide = to.round === 5 ? null : getSideInfo(to.round, to.game).isLeft;

      const fromX = fromPos.x + (fromSide ? CARD_W : 0);
      const fromY = fromPos.y + UNIT;

      let toX = toPos.x;
      let toY = toPos.y + UNIT;

      if (to.round <= 4 && toSide === false) {
        toX = toPos.x + CARD_W;
      }

      if (to.round === 5) {
        toX = toPos.x + (fromSide ? 0 : CARD_W);
      }

      const midX = (fromX + toX) / 2;
      const d = `M ${fromX} ${fromY} L ${midX} ${fromY} L ${midX} ${toY} L ${toX} ${toY}`;
      paths.push(d);
    }

    return paths;
  }, [games, gameMap]);

  function scrollToRound(r: 1 | 2 | 3 | 4 | 5, side: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;

    // Round 5 is centered
    if (r === 5) {
      const targetX = xForCol(4);
      el.scrollTo({ left: Math.max(0, targetX - 120), behavior: "smooth" });
      return;
    }

    // Left/right columns
    const col = side === "left" ? r - 1 : 9 - r;
    const targetX = xForCol(col);
    el.scrollTo({ left: Math.max(0, targetX - 120), behavior: "smooth" });
  }

  function focusRound(r: 1 | 2 | 3 | 4 | 5) {
    // Round 5 has no left/right
    if (r === 5) {
      setActiveRound(5);
      scrollToRound(5, "left");
      return;
    }

    if (activeRound !== r) {
      // Switching rounds: default to LEFT first
      setActiveRound(r);
      setRoundSide("left");
      scrollToRound(r, "left");
      return;
    }

    // Same round clicked again: toggle left/right
    const nextSide = roundSide === "left" ? "right" : "left";
    setRoundSide(nextSide);
    scrollToRound(r, nextSide);
  }

  if (loading) {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui", color: "#fff" }}>
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

  const champParsed = getChampionshipScoreObj();
  const champValid = champParsed.a !== null && champParsed.b !== null;

  return (
    <main style={{ padding: 24, fontFamily: "system-ui", color: "#fff" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          {/* HOME BUTTON + TITLE */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              type="button"
              onClick={() => router.push("/")}
              style={{
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.35)",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(0,0,0,0.35))",
                color: "#fff",
                cursor: "pointer",
                fontWeight: 800,
                letterSpacing: 0.3,
                display: "flex",
                alignItems: "center",
                gap: 8,
                boxShadow:
                  "0 8px 20px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.08) inset",
              }}
              title="Back to Home"
            >
              <span style={{ opacity: 0.9, fontSize: 16 }}>←</span>
              Home
            </button>

            <h1 style={{ fontSize: 44, margin: 0 }}>My Bracket</h1>
          </div>

          <p style={{ opacity: 0.8, marginTop: 10, marginBottom: 8 }}>
            Click a team to pick the winner. Later rounds auto-fill based on your earlier picks.
          </p>
          <div style={{ opacity: 0.75, marginTop: 4 }}>
            Progress: {pickedCount}/{totalGames}
          </div>
          {locked ? (
            <div style={{ marginTop: 10, color: "#7CFF7C" }}>✅ Locked (editing disabled)</div>
          ) : (
            <div style={{ marginTop: 10, opacity: 0.75 }}>
              Picks are <b>final</b> once you submit (you can’t edit after locking).
            </div>
          )}
          {!user ? (
            <div style={{ marginTop: 10, opacity: 0.75 }}>
              Tip: You can play around with picks, but you must sign in to save/submit.
            </div>
          ) : null}
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ opacity: 0.75, marginBottom: 10 }}>
            Signed in as <b>{fmtDisplayName(user)}</b>
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
                minWidth: 170,
              }}
            >
              {locked ? "Submitted (locked)" : "Submit Bracket (locks)"}
            </button>
          </div>
        </div>
      </div>

      {msg ? (
        <div
          style={{
            marginTop: 14,
            color: msg.toLowerCase().includes("fail") ? "#ff8b8b" : "#b7ffb7",
          }}
        >
          {msg}
        </div>
      ) : null}

      {/* ✅ NEW: Championship Final Score Tie-breaker */}
      <div
        style={{
          marginTop: 16,
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 14,
          padding: 14,
          background: "rgba(0,0,0,0.25)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontWeight: 900, letterSpacing: 0.3, fontSize: 15 }}>
              🏆 Championship Final Score (Tie-breaker)
            </div>
            <div style={{ opacity: 0.75, marginTop: 4, fontSize: 13, lineHeight: "18px" }}>
              If two brackets tie on points, we’ll use your predicted championship score as the tie-breaker.
              Enter <b>whole numbers</b>.
            </div>
          </div>

          <div style={{ opacity: 0.8, fontSize: 12, alignSelf: "center" }}>
            {locked ? "Locked" : champValid ? "✅ Ready" : "⚠️ Needed for Submit"}
          </div>
        </div>

        <div
          style={{
            marginTop: 12,
            display: "grid",
            gridTemplateColumns: "1fr 120px",
            gap: 10,
            alignItems: "center",
            maxWidth: 520,
          }}
        >
          <div style={{ fontWeight: 750, opacity: 0.95 }}>{finalALabel}</div>
          <input
            value={champScoreA}
            onChange={(e) => setChampScoreA(e.target.value)}
            disabled={locked}
            inputMode="numeric"
            placeholder="Score"
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.18)",
              background: locked ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.25)",
              color: "#fff",
              outline: "none",
              fontWeight: 800,
              textAlign: "center",
            }}
          />

          <div style={{ fontWeight: 750, opacity: 0.95 }}>{finalBLabel}</div>
          <input
            value={champScoreB}
            onChange={(e) => setChampScoreB(e.target.value)}
            disabled={locked}
            inputMode="numeric"
            placeholder="Score"
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.18)",
              background: locked ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.25)",
              color: "#fff",
              outline: "none",
              fontWeight: 800,
              textAlign: "center",
            }}
          />
        </div>

        {!locked && !champValid ? (
          <div style={{ marginTop: 10, color: "rgba(255,180,180,0.95)", fontSize: 13 }}>
            Please fill out both scores (0–300, whole numbers) before submitting.
          </div>
        ) : null}
      </div>

      {/* Round focus buttons (click same round again toggles LEFT/RIGHT for rounds 1-4) */}
      <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
        {([1, 2, 3, 4, 5] as const).map((r) => {
          const showSide = r !== 5 && activeRound === r ? ` (${roundSide.toUpperCase()})` : "";
          return (
            <button
              key={r}
              onClick={() => focusRound(r)}
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                border: "1px solid #333",
                background: activeRound === r ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.25)",
                color: "#fff",
                cursor: "pointer",
                minWidth: 110,
              }}
              title={r === 5 ? "Jump to Final" : "Click once for LEFT side, click again for RIGHT side"}
            >
              Round {r}
              {showSide}
            </button>
          );
        })}
      </div>

      {/* Bracket canvas */}
      <div
        ref={scrollRef}
        style={{
          marginTop: 16,
          overflow: "auto",
          maxHeight: "78vh",
          border: "1px solid #222",
          borderRadius: 14,
          padding: 12,
          background: "rgba(0,0,0,0.25)",
        }}
      >
        <div style={{ position: "relative", width: CANVAS_W, height: CANVAS_H }}>
          {/* Column labels */}
          {[
            { col: 0, text: "R1" },
            { col: 1, text: "R2" },
            { col: 2, text: "R3" },
            { col: 3, text: "R4" },
            { col: 4, text: "Final" },
            { col: 5, text: "R4" },
            { col: 6, text: "R3" },
            { col: 7, text: "R2" },
            { col: 8, text: "R1" },
          ].map((c) => (
            <div
              key={c.col}
              style={{
                position: "absolute",
                top: 10,
                left: xForCol(c.col),
                width: CARD_W,
                fontSize: 12,
                opacity: 0.75,
                textAlign: "center",
                letterSpacing: 1,
              }}
            >
              {c.text}
            </div>
          ))}

          {/* Connectors */}
          <svg
            width={CANVAS_W}
            height={CANVAS_H}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              pointerEvents: "none",
            }}
          >
            {connectorPaths.map((d, i) => (
              <path key={i} d={d} fill="none" stroke="#444" strokeWidth={2} />
            ))}
          </svg>

          {/* Cards */}
          {positionedGames.map(({ game, x, y }) => {
            const aId = computeSlotTeamId(game, "A", picks, inc);
            const bId = computeSlotTeamId(game, "B", picks, inc);

            return (
              <div key={game.id} style={{ position: "absolute", left: x, top: y }}>
                <GameCard
                  game={game}
                  teamMap={teamMap}
                  picks={picks}
                  locked={locked}
                  activeRound={activeRound}
                  aId={aId}
                  bId={bId}
                  onTogglePick={(teamId) => togglePick(game.id, teamId)}
                />
              </div>
            );
          })}

          {/* Champion label */}
          <div
            style={{
              position: "absolute",
              bottom: 10,
              left: xForCol(4),
              width: CARD_W,
              textAlign: "center",
              fontSize: 12,
              opacity: 0.7,
              letterSpacing: 2,
            }}
          >
            CHAMPION
          </div>
        </div>
      </div>
    </main>
  );
}
// end of MyBracketPage component
