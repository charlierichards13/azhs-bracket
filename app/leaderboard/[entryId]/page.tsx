// //Gonna use this file to allow viewing of other people's brackets and the leaderboard. Will also have a link to the admin page for easy access


// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import { useParams } from "next/navigation";
// import { doc, getDoc, collection, getDocs } from "firebase/firestore";
// import { db } from "../../../lib/firebase";
// import { listGames, Game } from "../../../lib/games";

// const TOURNAMENT_ID = "azhs-2026";

// const POINTS_BY_ROUND: Record<number, number> = {
//   1: 1,
//   2: 2,
//   3: 4,
//   4: 8,
//   5: 16,
// };

// type EntryDoc = {
//   userId?: string;
//   displayName?: string;
//   locked?: boolean;
//   picks?: Record<string, string>; // { R1G1: "teamId", ... }
//   createdAt?: any;
//   updatedAt?: any;
// };

// type Team = {
//   id: string;
//   name: string;
//   seed?: number | null;
// };

// function fmtTime(ts: any) {
//   try {
//     if (!ts) return "";
//     if (typeof ts?.toDate === "function") return ts.toDate().toLocaleString();
//     return String(ts);
//   } catch {
//     return "";
//   }
// }

// export default function EntryBracketPage() {
//   const params = useParams<{ entryId: string }>();
//   const entryId = params?.entryId;

//   const [loading, setLoading] = useState(true);
//   const [msg, setMsg] = useState("");

//   const [entry, setEntry] = useState<(EntryDoc & { id: string }) | null>(null);
//   const [games, setGames] = useState<Game[]>([]);
//   const [teams, setTeams] = useState<Team[]>([]);

//   useEffect(() => {
//     async function run() {
//       setLoading(true);
//       setMsg("");
//       try {
//         if (!entryId) {
//           setMsg("Missing entry id.");
//           return;
//         }

//         const [gamesList] = await Promise.all([listGames()]);
//         setGames(gamesList);

//         const entryRef = doc(db, `tournaments/${TOURNAMENT_ID}/entries/${entryId}`);
//         const entrySnap = await getDoc(entryRef);

//         if (!entrySnap.exists()) {
//           setMsg("That entry was not found.");
//           setEntry(null);
//           return;
//         }

//         setEntry({ id: entrySnap.id, ...(entrySnap.data() as EntryDoc) });

//         // Load teams so we can show names instead of raw ids
//         const teamsSnap = await getDocs(
//           collection(db, `tournaments/${TOURNAMENT_ID}/teams`)
//         );
//         const t = teamsSnap.docs.map((d) => {
//           const data: any = d.data();
//           return {
//             id: d.id,
//             name: data?.name ?? d.id,
//             seed: typeof data?.seed === "number" ? data.seed : null,
//           };
//         });
//         t.sort((a, b) => (a.seed ?? 999) - (b.seed ?? 999) || a.name.localeCompare(b.name));
//         setTeams(t);
//       } catch (e) {
//         console.error(e);
//         setMsg("Error loading bracket view. Check console/rules.");
//       } finally {
//         setLoading(false);
//       }
//     }
//     run();
//   }, [entryId]);

//   const teamMap = useMemo(() => {
//     const m = new Map<string, Team>();
//     for (const t of teams) m.set(t.id, t);
//     return m;
//   }, [teams]);

//   const decidedGames = useMemo(() => games.filter((g) => !!g.winnerId), [games]);

//   const scoreSummary = useMemo(() => {
//     const picks = entry?.picks || {};
//     let score = 0;
//     let correct = 0;

//     for (const g of decidedGames) {
//       const pick = picks[g.id];
//       if (pick && g.winnerId && pick === g.winnerId) {
//         correct += 1;
//         score += POINTS_BY_ROUND[g.round] ?? 1;
//       }
//     }

//     return {
//       score,
//       correct,
//       decided: decidedGames.length,
//       pickedCount: Object.keys(picks).length,
//     };
//   }, [entry, decidedGames]);

//   const gamesByRound = useMemo(() => {
//     const by: Record<number, Game[]> = {};
//     for (const g of games) {
//       by[g.round] = by[g.round] || [];
//       by[g.round].push(g);
//     }
//     for (const r of Object.keys(by)) {
//       by[Number(r)].sort((a, b) => a.game - b.game);
//     }
//     return by;
//   }, [games]);

//   function teamName(teamId: string | null | undefined) {
//     if (!teamId) return "TBD";
//     return teamMap.get(teamId)?.name ?? teamId;
//   }

//   if (loading) {
//     return (
//       <main style={{ padding: 24, fontFamily: "system-ui", color: "#fff" }}>
//         <h1 style={{ margin: 0 }}>Bracket</h1>
//         <p style={{ opacity: 0.75 }}>Loading…</p>
//       </main>
//     );
//   }

//   return (
//     <main style={{ padding: 24, fontFamily: "system-ui", color: "#fff" }}>
//       <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
//         <h1 style={{ margin: 0 }}>
//           Bracket — {entry?.displayName || entry?.id || "Unknown"}
//         </h1>

//         <Link href="/leaderboard" style={{ opacity: 0.85, color: "#fff" }}>
//           ← Back to Leaderboard
//         </Link>
//       </div>

//       <p style={{ opacity: 0.75, marginTop: 8 }}>
//         Score: <b>{scoreSummary.score}</b> &nbsp;|&nbsp; Correct:{" "}
//         <b>
//           {scoreSummary.correct}/{scoreSummary.decided}
//         </b>
//         &nbsp;|&nbsp; Picks made: <b>{scoreSummary.pickedCount}/31</b>
//       </p>

//       <p style={{ opacity: 0.65, marginTop: 6 }}>
//         Last updated: {fmtTime(entry?.updatedAt || entry?.createdAt)}
//       </p>

//       {msg ? <div style={{ marginTop: 12, color: "#ffb4b4" }}>{msg}</div> : null}

//       <div
//         style={{
//           marginTop: 16,
//           border: "1px solid #222",
//           borderRadius: 14,
//           background: "rgba(0,0,0,0.25)",
//           overflow: "hidden",
//         }}
//       >
//         <div style={{ padding: 14, borderBottom: "1px solid #1d1d1d", opacity: 0.8 }}>
//           Picks (by game)
//         </div>

//         <div style={{ padding: 14 }}>
//           {[1, 2, 3, 4, 5].map((round) => {
//             const list = gamesByRound[round] || [];
//             if (list.length === 0) return null;

//             return (
//               <div key={round} style={{ marginBottom: 18 }}>
//                 <div style={{ fontWeight: 800, marginBottom: 8, opacity: 0.9 }}>
//                   Round {round}
//                 </div>

//                 <div style={{ display: "grid", gap: 8 }}>
//                   {list.map((g) => {
//                     const pick = entry?.picks?.[g.id] ?? null;
//                     const isCorrect = !!pick && !!g.winnerId && pick === g.winnerId;
//                     const isWrong = !!pick && !!g.winnerId && pick !== g.winnerId;

//                     return (
//                       <div
//                         key={g.id}
//                         style={{
//                           borderRadius: 12,
//                           border: "1px solid rgba(255,255,255,0.10)",
//                           background: "rgba(0,0,0,0.22)",
//                           padding: 12,
//                           display: "grid",
//                           gridTemplateColumns: "90px 1fr",
//                           gap: 10,
//                         }}
//                       >
//                         <div style={{ opacity: 0.8, fontWeight: 700 }}>{g.id}</div>

//                         <div style={{ display: "grid", gap: 6 }}>
//                           <div style={{ opacity: 0.85 }}>
//                             Matchup:{" "}
//                             <b>
//                               {teamName(g.teamAId)} vs {teamName(g.teamBId)}
//                             </b>
//                           </div>

//                           <div
//                             style={{
//                               opacity: 0.95,
//                               fontWeight: 750,
//                               padding: "6px 10px",
//                               borderRadius: 10,
//                               border: isCorrect
//                                 ? "1px solid rgba(120,255,170,0.35)"
//                                 : isWrong
//                                 ? "1px solid rgba(255,120,120,0.35)"
//                                 : "1px solid rgba(255,255,255,0.12)",
//                               background: isCorrect
//                                 ? "rgba(120,255,170,0.08)"
//                                 : isWrong
//                                 ? "rgba(255,120,120,0.08)"
//                                 : "rgba(255,255,255,0.04)",
//                             }}
//                           >
//                             Pick: {pick ? teamName(pick) : "—"}
//                             {g.winnerId ? (
//                               <span style={{ opacity: 0.75, fontWeight: 600 }}>
//                                 {" "}
//                                 (Winner: {teamName(g.winnerId)})
//                               </span>
//                             ) : (
//                               <span style={{ opacity: 0.65, fontWeight: 600 }}>
//                                 {" "}
//                                 (Winner: TBD)
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </main>
//   );
// }

// Read-only view of a specific entry's bracket (from Leaderboard -> View)

// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import Link from "next/link";
// import { useParams } from "next/navigation";
// import { doc, getDoc, collection, getDocs } from "firebase/firestore";
// import { db } from "../../../lib/firebase";
// import { listGames, type Game, roundGameCount } from "../../../lib/games";

// const TOURNAMENT_ID = "azhs-2026";

// const POINTS_BY_ROUND: Record<number, number> = {
//   1: 1,
//   2: 2,
//   3: 4,
//   4: 8,
//   5: 16,
// };

// type EntryDoc = {
//   userId?: string;
//   displayName?: string;
//   locked?: boolean;
//   picks?: Record<string, string>; // { R1G1: "teamId", ... }
//   createdAt?: any;
//   updatedAt?: any;
// };

// type Team = {
//   id: string;
//   name: string;
//   seed?: number | null;
//   logoUrl?: string | null;
//   logoPath?: string | null;
// };

// /**
//  * Bracket layout constants (match MyBracket / Live Bracket)
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

// function fmtTime(ts: any) {
//   try {
//     if (!ts) return "";
//     if (typeof ts?.toDate === "function") return ts.toDate().toLocaleString();
//     return String(ts);
//   } catch {
//     return "";
//   }
// }

// function sortGames(a: Game, b: Game) {
//   if (a.round !== b.round) return a.round - b.round;
//   return a.game - b.game;
// }

// function slugToLocalLogo(teamId: string) {
//   return `/logos/${teamId}.png`;
// }
// function slugToLocalLogoUpper(teamId: string) {
//   return `/logos/${teamId}.PNG`;
// }

// function incomingMap(games: Game[]) {
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
//   picks: Record<string, string>,
//   incoming: Record<string, { A?: string; B?: string }>
// ) {
//   const direct = slot === "A" ? game.teamAId : game.teamBId;
//   if (direct) return direct;

//   const feederId = incoming[game.id]?.[slot];
//   if (!feederId) return null;

//   return picks[feederId] ?? null;
// }

// function sanitizePicks(games: Game[], picksIn: Record<string, string>) {
//   const gamesSorted = [...games].sort(sortGames);
//   const inc = incomingMap(gamesSorted);

//   const picks: Record<string, string> = { ...picksIn };

//   for (const g of gamesSorted) {
//     const a = computeSlotTeamId(g, "A", picks, inc);
//     const b = computeSlotTeamId(g, "B", picks, inc);

//     const valid = new Set<string>();
//     if (a) valid.add(a);
//     if (b) valid.add(b);

//     const cur = picks[g.id];
//     if (cur && !valid.has(cur)) delete picks[g.id];
//   }

//   return picks;
// }

// /** Bracket geometry helpers */
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
//   if (round === 5) return 4;
//   if (isLeft) return round - 1;
//   return 9 - round;
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

// function TeamRowView({
//   teamId,
//   teamMap,
//   selected,
//   status, // "correct" | "wrong" | "picked" | "none"
// }: {
//   teamId: string | null;
//   teamMap: Map<string, Team>;
//   selected: boolean;
//   status: "correct" | "wrong" | "picked" | "none";
// }) {
//   const t = teamId ? teamMap.get(teamId) : null;

//   const name = teamId ? (t?.name ?? teamId) : "TBD";
//   const seed = teamId && typeof t?.seed === "number" ? t.seed : null;

//   const src =
//     teamId ? (t?.logoUrl || t?.logoPath || slugToLocalLogo(teamId)) : "";

//   const border =
//     selected && status === "correct"
//       ? "1px solid rgba(120,255,170,0.55)"
//       : selected && status === "wrong"
//       ? "1px solid rgba(255,120,120,0.55)"
//       : selected && status === "picked"
//       ? "1px solid rgba(43,92,255,0.75)"
//       : "1px solid transparent";

//   const bg =
//     selected && status === "correct"
//       ? "rgba(120,255,170,0.10)"
//       : selected && status === "wrong"
//       ? "rgba(255,120,120,0.10)"
//       : selected && status === "picked"
//       ? "rgba(43,92,255,0.16)"
//       : "rgba(0,0,0,0.0)";

//   return (
//     <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         gap: 10,
//         height: ROW_H,
//         padding: "0 8px",
//         borderRadius: 10,
//         background: bg,
//         border,
//         boxSizing: "border-box",
//         width: "100%",
//         color: "#fff",
//         opacity: teamId ? 1 : 0.65,
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

//               if (!img.dataset.triedPng && (t?.logoUrl || t?.logoPath)) {
//                 img.dataset.triedPng = "1";
//                 img.src = slugToLocalLogo(teamId);
//                 return;
//               }

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
//     </div>
//   );
// }

// function GameCardView({
//   game,
//   teamMap,
//   picks,
//   activeRound,
//   aId,
//   bId,
// }: {
//   game: Game;
//   teamMap: Map<string, Team>;
//   picks: Record<string, string>;
//   activeRound: 1 | 2 | 3 | 4 | 5;
//   aId: string | null;
//   bId: string | null;
// }) {
//   const pick = picks[game.id] ?? null;
//   const focused = game.round === activeRound;

//   const decided = !!game.winnerId;
//   const statusForPick: "correct" | "wrong" | "picked" | "none" =
//     pick && decided
//       ? pick === game.winnerId
//         ? "correct"
//         : "wrong"
//       : pick
//       ? "picked"
//       : "none";

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
//           display: "flex",
//           alignItems: "center",
//           gap: 8,
//         }}
//       >
//         <span>{game.id}</span>
//         {decided ? (
//           <span style={{ opacity: 0.9 }}>
//             {statusForPick === "correct" ? "✅" : statusForPick === "wrong" ? "❌" : "🏁"}
//           </span>
//         ) : null}
//       </div>

//       <TeamRowView
//         teamId={aId}
//         teamMap={teamMap}
//         selected={!!pick && pick === aId}
//         status={pick === aId ? statusForPick : "none"}
//       />
//       <TeamRowView
//         teamId={bId}
//         teamMap={teamMap}
//         selected={!!pick && pick === bId}
//         status={pick === bId ? statusForPick : "none"}
//       />
//     </div>
//   );
// }

// export default function EntryBracketPage() {
//   const params = useParams<{ entryId: string }>();
//   const entryId = params?.entryId;

//   const [loading, setLoading] = useState(true);
//   const [msg, setMsg] = useState("");

//   const [entry, setEntry] = useState<(EntryDoc & { id: string }) | null>(null);
//   const [games, setGames] = useState<Game[]>([]);
//   const [teams, setTeams] = useState<Team[]>([]);

//   const [activeRound, setActiveRound] = useState<1 | 2 | 3 | 4 | 5>(1);
//   const [roundSide, setRoundSide] = useState<"left" | "right">("left");

//   const scrollRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     async function run() {
//       setLoading(true);
//       setMsg("");
//       try {
//         if (!entryId) {
//           setMsg("Missing entry id.");
//           return;
//         }

//         const [gamesList, teamsSnap, entrySnap] = await Promise.all([
//           listGames(),
//           getDocs(collection(db, `tournaments/${TOURNAMENT_ID}/teams`)),
//           getDoc(doc(db, `tournaments/${TOURNAMENT_ID}/entries/${entryId}`)),
//         ]);

//         const sortedGames = [...gamesList].sort(sortGames);
//         setGames(sortedGames);

//         const t = teamsSnap.docs
//           .map((d) => {
//             const data: any = d.data();
//             return {
//               id: d.id,
//               name: data?.name ?? d.id,
//               seed: typeof data?.seed === "number" ? data.seed : null,
//               logoUrl: data?.logoUrl ?? null,
//               logoPath: data?.logoPath ?? null,
//             } as Team;
//           })
//           .sort(
//             (a, b) =>
//               (a.seed ?? 999) - (b.seed ?? 999) ||
//               a.name.localeCompare(b.name)
//           );
//         setTeams(t);

//         if (!entrySnap.exists()) {
//           setMsg("That entry was not found.");
//           setEntry(null);
//           return;
//         }

//         setEntry({ id: entrySnap.id, ...(entrySnap.data() as EntryDoc) });
//       } catch (e) {
//         console.error(e);
//         setMsg("Error loading bracket view. Check console/rules.");
//       } finally {
//         setLoading(false);
//       }
//     }

//     run();
//   }, [entryId]);

//   const teamMap = useMemo(() => {
//     const m = new Map<string, Team>();
//     for (const t of teams) m.set(t.id, t);
//     return m;
//   }, [teams]);

//   const gameMap = useMemo(() => {
//     const m = new Map<string, Game>();
//     for (const g of games) m.set(g.id, g);
//     return m;
//   }, [games]);

//   const decidedGames = useMemo(() => games.filter((g) => !!g.winnerId), [games]);

//   const picks = useMemo(() => {
//     const raw = entry?.picks || {};
//     return sanitizePicks(games, raw);
//   }, [entry, games]);

//   const inc = useMemo(() => incomingMap(games), [games]);

//   const scoreSummary = useMemo(() => {
//     let score = 0;
//     let correct = 0;

//     for (const g of decidedGames) {
//       const pick = picks[g.id];
//       if (pick && g.winnerId && pick === g.winnerId) {
//         correct += 1;
//         score += POINTS_BY_ROUND[g.round] ?? 1;
//       }
//     }

//     return {
//       score,
//       correct,
//       decided: decidedGames.length,
//       pickedCount: Object.keys(picks).length,
//     };
//   }, [picks, decidedGames]);

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

//     if (r === 5) {
//       const targetX = xForCol(4);
//       el.scrollTo({ left: Math.max(0, targetX - 120), behavior: "smooth" });
//       return;
//     }

//     const col = side === "left" ? r - 1 : 9 - r;
//     const targetX = xForCol(col);
//     el.scrollTo({ left: Math.max(0, targetX - 120), behavior: "smooth" });
//   }

//   function focusRound(r: 1 | 2 | 3 | 4 | 5) {
//     if (r === 5) {
//       setActiveRound(5);
//       scrollToRound(5, "left");
//       return;
//     }

//     if (activeRound !== r) {
//       setActiveRound(r);
//       setRoundSide("left");
//       scrollToRound(r, "left");
//       return;
//     }

//     const nextSide = roundSide === "left" ? "right" : "left";
//     setRoundSide(nextSide);
//     scrollToRound(r, nextSide);
//   }

//   if (loading) {
//     return (
//       <main style={{ padding: 24, fontFamily: "system-ui", color: "#fff" }}>
//         <h1 style={{ margin: 0 }}>Bracket</h1>
//         <p style={{ opacity: 0.75 }}>Loading…</p>
//       </main>
//     );
//   }

//   return (
//     <main style={{ padding: 24, fontFamily: "system-ui", color: "#fff" }}>
//       <div
//         style={{
//           display: "flex",
//           alignItems: "baseline",
//           justifyContent: "space-between",
//           gap: 12,
//           flexWrap: "wrap",
//         }}
//       >
//         <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
//           <h1 style={{ margin: 0 }}>
//             Bracket — {entry?.displayName || entry?.id || "Unknown"}
//           </h1>

//           <Link href="/leaderboard" style={{ opacity: 0.85, color: "#fff" }}>
//             ← Back to Leaderboard
//           </Link>
//         </div>

//         <div style={{ opacity: 0.75 }}>
//           {entry?.locked ? "✅ Locked" : "Draft"}{" "}
//           <span style={{ opacity: 0.6 }}>·</span>{" "}
//           Last updated: {fmtTime(entry?.updatedAt || entry?.createdAt)}
//         </div>
//       </div>

//       <p style={{ opacity: 0.75, marginTop: 10 }}>
//         Score: <b>{scoreSummary.score}</b> &nbsp;|&nbsp; Correct:{" "}
//         <b>
//           {scoreSummary.correct}/{scoreSummary.decided}
//         </b>{" "}
//         &nbsp;|&nbsp; Picks made: <b>{scoreSummary.pickedCount}/31</b>
//       </p>

//       {msg ? <div style={{ marginTop: 12, color: "#ffb4b4" }}>{msg}</div> : null}

//       {/* Round focus buttons (click same round again toggles LEFT/RIGHT for rounds 1-4) */}
//       <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
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

//       {/* Bracket canvas (read-only) */}
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
//                 <GameCardView
//                   game={game}
//                   teamMap={teamMap}
//                   picks={picks}
//                   activeRound={activeRound}
//                   aId={aId}
//                   bId={bId}
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




"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { listGames, type Game, roundGameCount } from "../../../lib/games";

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

  // ✅ NEW: tie-breaker prediction for championship game final score
  // (store from My Bracket page)
  tiebreaker?: {
    a?: number | null; // Team A score
    b?: number | null; // Team B score
  };

  createdAt?: any;
  updatedAt?: any;
};

type Team = {
  id: string;
  name: string;
  seed?: number | null;
  logoUrl?: string | null;
  logoPath?: string | null;
};

/**
 * Bracket layout constants (match MyBracket / Live Bracket)
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

function fmtTime(ts: any) {
  try {
    if (!ts) return "";
    if (typeof ts?.toDate === "function") return ts.toDate().toLocaleString();
    return String(ts);
  } catch {
    return "";
  }
}

function sortGames(a: Game, b: Game) {
  if (a.round !== b.round) return a.round - b.round;
  return a.game - b.game;
}

function slugToLocalLogo(teamId: string) {
  return `/logos/${teamId}.png`;
}
function slugToLocalLogoUpper(teamId: string) {
  return `/logos/${teamId}.PNG`;
}

function incomingMap(games: Game[]) {
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
  picks: Record<string, string>,
  incoming: Record<string, { A?: string; B?: string }>
) {
  const direct = slot === "A" ? game.teamAId : game.teamBId;
  if (direct) return direct;

  const feederId = incoming[game.id]?.[slot];
  if (!feederId) return null;

  return picks[feederId] ?? null;
}

function sanitizePicks(games: Game[], picksIn: Record<string, string>) {
  const gamesSorted = [...games].sort(sortGames);
  const inc = incomingMap(gamesSorted);

  const picks: Record<string, string> = { ...picksIn };

  for (const g of gamesSorted) {
    const a = computeSlotTeamId(g, "A", picks, inc);
    const b = computeSlotTeamId(g, "B", picks, inc);

    const valid = new Set<string>();
    if (a) valid.add(a);
    if (b) valid.add(b);

    const cur = picks[g.id];
    if (cur && !valid.has(cur)) delete picks[g.id];
  }

  return picks;
}

/** Bracket geometry helpers */
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
  if (round === 5) return 4;
  if (isLeft) return round - 1;
  return 9 - round;
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

function TeamRowView({
  teamId,
  teamMap,
  selected,
  status, // "correct" | "wrong" | "picked" | "none"
}: {
  teamId: string | null;
  teamMap: Map<string, Team>;
  selected: boolean;
  status: "correct" | "wrong" | "picked" | "none";
}) {
  const t = teamId ? teamMap.get(teamId) : null;

  const name = teamId ? (t?.name ?? teamId) : "TBD";
  const seed = teamId && typeof t?.seed === "number" ? t.seed : null;

  const src = teamId ? t?.logoUrl || t?.logoPath || slugToLocalLogo(teamId) : "";

  const border =
    selected && status === "correct"
      ? "1px solid rgba(120,255,170,0.55)"
      : selected && status === "wrong"
      ? "1px solid rgba(255,120,120,0.55)"
      : selected && status === "picked"
      ? "1px solid rgba(43,92,255,0.75)"
      : "1px solid transparent";

  const bg =
    selected && status === "correct"
      ? "rgba(120,255,170,0.10)"
      : selected && status === "wrong"
      ? "rgba(255,120,120,0.10)"
      : selected && status === "picked"
      ? "rgba(43,92,255,0.16)"
      : "rgba(0,0,0,0.0)";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        height: ROW_H,
        padding: "0 8px",
        borderRadius: 10,
        background: bg,
        border,
        boxSizing: "border-box",
        width: "100%",
        color: "#fff",
        opacity: teamId ? 1 : 0.65,
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

              if (!img.dataset.triedPng && (t?.logoUrl || t?.logoPath)) {
                img.dataset.triedPng = "1";
                img.src = slugToLocalLogo(teamId);
                return;
              }

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
    </div>
  );
}

function GameCardView({
  game,
  teamMap,
  picks,
  activeRound,
  aId,
  bId,
}: {
  game: Game;
  teamMap: Map<string, Team>;
  picks: Record<string, string>;
  activeRound: 1 | 2 | 3 | 4 | 5;
  aId: string | null;
  bId: string | null;
}) {
  const pick = picks[game.id] ?? null;
  const focused = game.round === activeRound;

  const decided = !!game.winnerId;
  const statusForPick: "correct" | "wrong" | "picked" | "none" =
    pick && decided ? (pick === game.winnerId ? "correct" : "wrong") : pick ? "picked" : "none";

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
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span>{game.id}</span>
        {decided ? (
          <span style={{ opacity: 0.9 }}>
            {statusForPick === "correct" ? "✅" : statusForPick === "wrong" ? "❌" : "🏁"}
          </span>
        ) : null}
      </div>

      <TeamRowView
        teamId={aId}
        teamMap={teamMap}
        selected={!!pick && pick === aId}
        status={pick === aId ? statusForPick : "none"}
      />
      <TeamRowView
        teamId={bId}
        teamMap={teamMap}
        selected={!!pick && pick === bId}
        status={pick === bId ? statusForPick : "none"}
      />
    </div>
  );
}

function scoreLabel(n: any) {
  return typeof n === "number" && Number.isFinite(n) ? String(n) : "—";
}

export default function EntryBracketPage() {
  const params = useParams<{ entryId: string }>();
  const entryId = params?.entryId;

  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const [entry, setEntry] = useState<(EntryDoc & { id: string }) | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  const [activeRound, setActiveRound] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [roundSide, setRoundSide] = useState<"left" | "right">("left");

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function run() {
      setLoading(true);
      setMsg("");
      try {
        if (!entryId) {
          setMsg("Missing entry id.");
          return;
        }

        const [gamesList, teamsSnap, entrySnap] = await Promise.all([
          listGames(),
          getDocs(collection(db, `tournaments/${TOURNAMENT_ID}/teams`)),
          getDoc(doc(db, `tournaments/${TOURNAMENT_ID}/entries/${entryId}`)),
        ]);

        const sortedGames = [...gamesList].sort(sortGames);
        setGames(sortedGames);

        const t = teamsSnap.docs
          .map((d) => {
            const data: any = d.data();
            return {
              id: d.id,
              name: data?.name ?? d.id,
              seed: typeof data?.seed === "number" ? data.seed : null,
              logoUrl: data?.logoUrl ?? null,
              logoPath: data?.logoPath ?? null,
            } as Team;
          })
          .sort((a, b) => (a.seed ?? 999) - (b.seed ?? 999) || a.name.localeCompare(b.name));
        setTeams(t);

        if (!entrySnap.exists()) {
          setMsg("That entry was not found.");
          setEntry(null);
          return;
        }

        setEntry({ id: entrySnap.id, ...(entrySnap.data() as EntryDoc) });
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

  const gameMap = useMemo(() => {
    const m = new Map<string, Game>();
    for (const g of games) m.set(g.id, g);
    return m;
  }, [games]);

  const decidedGames = useMemo(() => games.filter((g) => !!g.winnerId), [games]);

  const picks = useMemo(() => {
    const raw = entry?.picks || {};
    return sanitizePicks(games, raw);
  }, [entry, games]);

  const inc = useMemo(() => incomingMap(games), [games]);

  const scoreSummary = useMemo(() => {
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
  }, [picks, decidedGames]);

  // ✅ NEW: compute championship matchup + show tie-breaker prediction
  const tiebreakerInfo = useMemo(() => {
    const finalGame = games.find((g) => g.round === 5) || null;
    if (!finalGame) {
      return {
        aName: "TBD",
        bName: "TBD",
        aScore: entry?.tiebreaker?.a ?? null,
        bScore: entry?.tiebreaker?.b ?? null,
      };
    }

    const aId = computeSlotTeamId(finalGame, "A", picks, inc);
    const bId = computeSlotTeamId(finalGame, "B", picks, inc);

    const aName = aId ? teamMap.get(aId)?.name ?? aId : "TBD";
    const bName = bId ? teamMap.get(bId)?.name ?? bId : "TBD";

    return {
      aName,
      bName,
      aScore: entry?.tiebreaker?.a ?? null,
      bScore: entry?.tiebreaker?.b ?? null,
    };
  }, [games, picks, inc, teamMap, entry]);

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

    if (r === 5) {
      const targetX = xForCol(4);
      el.scrollTo({ left: Math.max(0, targetX - 120), behavior: "smooth" });
      return;
    }

    const col = side === "left" ? r - 1 : 9 - r;
    const targetX = xForCol(col);
    el.scrollTo({ left: Math.max(0, targetX - 120), behavior: "smooth" });
  }

  function focusRound(r: 1 | 2 | 3 | 4 | 5) {
    if (r === 5) {
      setActiveRound(5);
      scrollToRound(5, "left");
      return;
    }

    if (activeRound !== r) {
      setActiveRound(r);
      setRoundSide("left");
      scrollToRound(r, "left");
      return;
    }

    const nextSide = roundSide === "left" ? "right" : "left";
    setRoundSide(nextSide);
    scrollToRound(r, nextSide);
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
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
          <h1 style={{ margin: 0 }}>
            Bracket — {entry?.displayName || entry?.id || "Unknown"}
          </h1>

          <Link href="/leaderboard" style={{ opacity: 0.85, color: "#fff" }}>
            ← Back to Leaderboard
          </Link>
        </div>

        <div style={{ opacity: 0.75 }}>
          {entry?.locked ? "✅ Locked" : "Draft"} <span style={{ opacity: 0.6 }}>·</span>{" "}
          Last updated: {fmtTime(entry?.updatedAt || entry?.createdAt)}
        </div>
      </div>

      <p style={{ opacity: 0.75, marginTop: 10 }}>
        Score: <b>{scoreSummary.score}</b> &nbsp;|&nbsp; Correct:{" "}
        <b>
          {scoreSummary.correct}/{scoreSummary.decided}
        </b>{" "}
        &nbsp;|&nbsp; Picks made: <b>{scoreSummary.pickedCount}/31</b>
      </p>

      {/* ✅ NEW: Tie-breaker display */}
      <div
        style={{
          marginTop: 10,
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 14,
          background: "rgba(0,0,0,0.22)",
          padding: "10px 12px",
          maxWidth: 980,
        }}
      >
        <div style={{ fontWeight: 900, letterSpacing: 0.2, marginBottom: 4 }}>
          Tie-breaker (Championship score prediction)
        </div>
        <div style={{ opacity: 0.85, lineHeight: "20px" }}>
          <span style={{ fontWeight: 800 }}>{tiebreakerInfo.aName}</span>{" "}
          <span style={{ opacity: 0.7 }}>—</span>{" "}
          <b>{scoreLabel(tiebreakerInfo.aScore)}</b>{" "}
          <span style={{ opacity: 0.55 }}>vs</span>{" "}
          <b>{scoreLabel(tiebreakerInfo.bScore)}</b>{" "}
          <span style={{ opacity: 0.7 }}>—</span>{" "}
          <span style={{ fontWeight: 800 }}>{tiebreakerInfo.bName}</span>
          {typeof tiebreakerInfo.aScore !== "number" || typeof tiebreakerInfo.bScore !== "number" ? (
            <span style={{ marginLeft: 10, opacity: 0.65 }}>
              (not provided)
            </span>
          ) : null}
        </div>
      </div>

      {msg ? <div style={{ marginTop: 12, color: "#ffb4b4" }}>{msg}</div> : null}

      {/* Round focus buttons (click same round again toggles LEFT/RIGHT for rounds 1-4) */}
      <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
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
              title={
                r === 5
                  ? "Jump to Final"
                  : "Click once for LEFT side, click again for RIGHT side"
              }
            >
              Round {r}
              {showSide}
            </button>
          );
        })}
      </div>

      {/* Bracket canvas (read-only) */}
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
                <GameCardView
                  game={game}
                  teamMap={teamMap}
                  picks={picks}
                  activeRound={activeRound}
                  aId={aId}
                  bId={bId}
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
