
// // I hope I will get a good job one day and be able to look back on this code without dying inside


// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { collection, onSnapshot } from "firebase/firestore";
// import { db } from "../../lib/firebase";
// import { TOURNAMENT_ID } from "../../lib/tournament";
// import { roundGameCount } from "../../lib/games";

// /**
//  * ✅ Key fix:
//  * - Keep UNIT as the “bracket math” slot height (spacing between team lines)
//  * - Make the actual team rows (ROW_H) smaller so padding + gap fits inside CARD_H
//  */
// const UNIT = 46;       // spacing unit used by bracket positioning
// const ROW_H = 36;      // actual visible row height inside the card
// const ROW_GAP = 4;     // gap between the two rows
// const PAD = 8;         // card padding

// const CARD_W = 320;
// const CARD_H = UNIT * 2; // must stay 2*UNIT so cards align with bracket math
// const COL_W = 380;
// const TOP_PAD = 90;

// const SIDE_TEAMS = 16;
// const CANVAS_H = TOP_PAD + SIDE_TEAMS * UNIT + 80;
// const CANVAS_W = 40 + COL_W * 9;

// type Team = {
//   id: string;
//   name: string;
//   seed?: number | null;
//   logoUrl?: string | null;   // supports remote URL if you add it later
//   logoPath?: string | null;  // supports your firestore field if you used logoPath
// };

// type Game = {
//   id: string; // e.g. R1G1
//   round: number; // 1..5
//   game: number; // 1..16 (varies by round)
//   teamAId: string | null;
//   teamBId: string | null;
//   winnerId: string | null;   // ✅ canonical winner field we will use in UI
//   nextGameId: string | null; // e.g. R2G1
//   nextSlot: "A" | "B" | null;
// };

// function slugToLocalLogo(teamId: string) {
//   return `/logos/${teamId}.png`;
// }

// // If Firestore doc is missing round/game fields, infer them from id (R#G#)
// function parseRoundGameFromId(id: string): { round: number; game: number } | null {
//   const m = /^R(\d+)G(\d+)$/i.exec(id);
//   if (!m) return null;
//   return { round: Number(m[1]), game: Number(m[2]) };
// }

// function normalizeTeam(id: string, data: any): Team {
//   return {
//     id,
//     name: data?.name ?? id,
//     seed: typeof data?.seed === "number" ? data.seed : null,
//     logoUrl: data?.logoUrl ?? null,
//     logoPath: data?.logoPath ?? null,
//   };
// }

// function normalizeGame(id: string, data: any): Game {
//   const parsed = parseRoundGameFromId(id);
//   const round = typeof data?.round === "number" ? data.round : (parsed?.round ?? 0);
//   const game = typeof data?.game === "number" ? data.game : (parsed?.game ?? 0);

//   // ✅ Support both fields to avoid "null winner" issues:
//   const winnerId =
//     data?.winnerId ??
//     data?.winnerTeamId ??
//     null;

//   return {
//     id,
//     round,
//     game,
//     teamAId: data?.teamAId ?? null,
//     teamBId: data?.teamBId ?? null,
//     winnerId,
//     nextGameId: data?.nextGameId ?? null,
//     nextSlot: data?.nextSlot ?? null,
//   };
// }

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
//     const y = TOP_PAD + (SIDE_TEAMS * UNIT) / 2 - UNIT; // centered
//     return { x, y };
//   }

//   const { isLeft, localGame } = getSideInfo(g.round, g.game);
//   const col = colIndexFor(g.round, isLeft);
//   const x = xForCol(col);
//   const y = topFor(g.round, localGame);
//   return { x, y };
// }

// function TeamRow({
//   teamId,
//   teamMap,
//   isWinner,
// }: {
//   teamId: string | null;
//   teamMap: Map<string, Team>;
//   isWinner: boolean;
// }) {
//   const t = teamId ? teamMap.get(teamId) : null;
//   const name = teamId ? (t?.name ?? teamId) : "TBD";

//   // If you later add logoUrl/logoPath in Firestore, this supports it.
//   // Otherwise we fall back to /public/logos/<teamId>.png
//   const src =
//     teamId
//       ? (t?.logoUrl || t?.logoPath || slugToLocalLogo(teamId))
//       : "";

//   return (
//     <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         gap: 10,
//         height: ROW_H,
//         padding: "0 8px",
//         borderRadius: 10,
//         background: isWinner ? "rgba(255,255,255,0.10)" : "transparent",
//         border: isWinner
//           ? "1px solid rgba(255,255,255,0.25)"
//           : "1px solid transparent",
//         boxSizing: "border-box",
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

//               // If URL failed, try local fallback once
//               if (!img.dataset.triedFallback && (t?.logoUrl || t?.logoPath)) {
//                 img.dataset.triedFallback = "1";
//                 img.src = slugToLocalLogo(teamId);
//                 return;
//               }

//               img.style.display = "none";
//             }}
//           />
//         ) : null}
//       </div>

//       <span
//         style={{
//           opacity: teamId ? 1 : 0.65,
//           fontSize: 14,
//           fontWeight: isWinner ? 700 : 500,
//           letterSpacing: 0.2,
//           lineHeight: "16px",
//         }}
//       >
//         {name}
//       </span>
//     </div>
//   );
// }

// function GameCard({
//   game,
//   teamMap,
// }: {
//   game: Game;
//   teamMap: Map<string, Team>;
// }) {
//   return (
//     <div
//       style={{
//         width: CARD_W,
//         height: CARD_H,
//         border: "1px solid #343434",
//         borderRadius: 14,
//         padding: PAD,
//         background: "rgba(0,0,0,0.35)",
//         boxSizing: "border-box",
//         position: "relative",
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         gap: ROW_GAP,
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

//       <TeamRow
//         teamId={game.teamAId}
//         teamMap={teamMap}
//         isWinner={!!game.winnerId && game.winnerId === game.teamAId}
//       />
//       <TeamRow
//         teamId={game.teamBId}
//         teamMap={teamMap}
//         isWinner={!!game.winnerId && game.winnerId === game.teamBId}
//       />
//     </div>
//   );
// }

// export default function BracketPage() {
//   const [games, setGames] = useState<Game[]>([]);
//   const [teams, setTeams] = useState<Team[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [msg, setMsg] = useState("");

//   // ✅ REALTIME: subscribe to teams + games
//   useEffect(() => {
//     setLoading(true);
//     setMsg("");

//     let gotGames = false;
//     let gotTeams = false;

//     const maybeDone = () => {
//       if (gotGames && gotTeams) setLoading(false);
//     };

//     const teamsCol = collection(db, "tournaments", TOURNAMENT_ID, "teams");
//     const gamesCol = collection(db, "tournaments", TOURNAMENT_ID, "games");

//     const unsubTeams = onSnapshot(
//       teamsCol,
//       (snap) => {
//         const rows = snap.docs.map((d) => normalizeTeam(d.id, d.data()));
//         rows.sort((a, b) => (a.seed ?? 999) - (b.seed ?? 999) || a.name.localeCompare(b.name));
//         setTeams(rows);
//         gotTeams = true;
//         maybeDone();
//       },
//       (err) => {
//         console.error(err);
//         setMsg("Error loading teams (realtime). Check console.");
//         gotTeams = true;
//         maybeDone();
//       }
//     );

//     const unsubGames = onSnapshot(
//       gamesCol,
//       (snap) => {
//         const rows = snap.docs.map((d) => normalizeGame(d.id, d.data()));
//         rows.sort((a, b) => (a.round - b.round) || (a.game - b.game));
//         setGames(rows);
//         gotGames = true;
//         maybeDone();
//       },
//       (err) => {
//         console.error(err);
//         setMsg("Error loading games (realtime). Check console.");
//         gotGames = true;
//         maybeDone();
//       }
//     );

//     return () => {
//       unsubTeams();
//       unsubGames();
//     };
//   }, []);

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

//   if (loading) {
//     return (
//       <main style={{ padding: 24, fontFamily: "system-ui", color: "#fff" }}>
//         <h1>AZHS Bracket</h1>
//         <p>Loading…</p>
//       </main>
//     );
//   }

//   return (
//     <main style={{ padding: 24, fontFamily: "system-ui", color: "#fff" }}>
//       <h1>AZHS Bracket</h1>
//       <p style={{ opacity: 0.75 }}>
//         March-Madness style layout (scroll if needed). Teams show as TBD until
//         seeds are assigned.
//       </p>
//       {msg && <div style={{ marginTop: 10 }}>{msg}</div>}

//       <div
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
//           {positionedGames.map(({ game, x, y }) => (
//             <div key={game.id} style={{ position: "absolute", left: x, top: y }}>
//               <GameCard game={game} teamMap={teamMap} />
//             </div>
//           ))}

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


// // AZ High School Bracket - Created by Charles Richards 2026
// // ASU Computer Science (Cybersecurity) BS 2028




// I hope I will get a good job one day and be able to look back on this code without dying inside

// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { collection, onSnapshot } from "firebase/firestore";
// import { db } from "../../lib/firebase";
// import { TOURNAMENT_ID } from "../../lib/tournament";
// import { roundGameCount } from "../../lib/games";

// /**
//  * ✅ Key fix:
//  * - Keep UNIT as the “bracket math” slot height (spacing between team lines)
//  * - Make the actual team rows (ROW_H) smaller so padding + gap fits inside CARD_H
//  */
// const UNIT = 46; // spacing unit used by bracket positioning
// const ROW_H = 36; // actual visible row height inside the card
// const ROW_GAP = 4; // gap between the two rows
// const PAD = 8; // card padding

// const CARD_W = 320;
// const CARD_H = UNIT * 2; // must stay 2*UNIT so cards align with bracket math
// const COL_W = 380;
// const TOP_PAD = 90;

// const SIDE_TEAMS = 16;
// const CANVAS_H = TOP_PAD + SIDE_TEAMS * UNIT + 80;
// const CANVAS_W = 40 + COL_W * 9;

// type Team = {
//   id: string;
//   name: string;
//   seed?: number | null;
//   logoUrl?: string | null; // supports remote URL if you add it later
//   logoPath?: string | null; // supports your firestore field if you used logoPath
// };

// type Game = {
//   id: string; // e.g. R1G1
//   round: number; // 1..5
//   game: number; // 1..16 (varies by round)
//   teamAId: string | null;
//   teamBId: string | null;
//   winnerId: string | null; // ✅ canonical winner field we will use in UI
//   nextGameId: string | null; // e.g. R2G1
//   nextSlot: "A" | "B" | null;
// };

// function slugToLocalLogo(teamId: string) {
//   return `/logos/${teamId}.png`;
// }

// // If Firestore doc is missing round/game fields, infer them from id (R#G#)
// function parseRoundGameFromId(id: string): { round: number; game: number } | null {
//   const m = /^R(\d+)G(\d+)$/i.exec(id);
//   if (!m) return null;
//   return { round: Number(m[1]), game: Number(m[2]) };
// }

// function normalizeTeam(id: string, data: any): Team {
//   return {
//     id,
//     name: data?.name ?? id,
//     seed: typeof data?.seed === "number" ? data.seed : null,
//     logoUrl: data?.logoUrl ?? null,
//     logoPath: data?.logoPath ?? null,
//   };
// }

// function normalizeGame(id: string, data: any): Game {
//   const parsed = parseRoundGameFromId(id);
//   const round = typeof data?.round === "number" ? data.round : parsed?.round ?? 0;
//   const game = typeof data?.game === "number" ? data.game : parsed?.game ?? 0;

//   // ✅ Support both fields to avoid "null winner" issues:
//   const winnerId = data?.winnerId ?? data?.winnerTeamId ?? null;

//   return {
//     id,
//     round,
//     game,
//     teamAId: data?.teamAId ?? null,
//     teamBId: data?.teamBId ?? null,
//     winnerId,
//     nextGameId: data?.nextGameId ?? null,
//     nextSlot: data?.nextSlot ?? null,
//   };
// }

// function getSideInfo(round: number, game: number) {
//   const total = roundGameCount(round);
//   const half = total / 2;
//   const isLeft = game <= half;
//   const localGame = isLeft ? game : game - half;
//   return { isLeft, localGame, half };
// }

// function topFor(round: number, localGame: number) {
//   const topIndex = Math.pow(2, round) * localGame - (Math.pow(2, round - 1) + 1);
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
//     const y = TOP_PAD + (SIDE_TEAMS * UNIT) / 2 - UNIT; // centered
//     return { x, y };
//   }

//   const { isLeft, localGame } = getSideInfo(g.round, g.game);
//   const col = colIndexFor(g.round, isLeft);
//   const x = xForCol(col);
//   const y = topFor(g.round, localGame);
//   return { x, y };
// }

// function TeamRow({
//   teamId,
//   teamMap,
//   isWinner,
// }: {
//   teamId: string | null;
//   teamMap: Map<string, Team>;
//   isWinner: boolean;
// }) {
//   const t = teamId ? teamMap.get(teamId) : null;
//   const name = teamId ? (t?.name ?? teamId) : "TBD";

//   // If you later add logoUrl/logoPath in Firestore, this supports it.
//   // Otherwise we fall back to /public/logos/<teamId>.png
//   const src = teamId ? t?.logoUrl || t?.logoPath || slugToLocalLogo(teamId) : "";

//   return (
//     <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         gap: 10,
//         height: ROW_H,
//         padding: "0 8px",
//         borderRadius: 10,
//         background: isWinner ? "rgba(255,255,255,0.10)" : "transparent",
//         border: isWinner ? "1px solid rgba(255,255,255,0.25)" : "1px solid transparent",
//         boxSizing: "border-box",
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

//               // If URL failed, try local fallback once
//               if (!img.dataset.triedFallback && (t?.logoUrl || t?.logoPath)) {
//                 img.dataset.triedFallback = "1";
//                 img.src = slugToLocalLogo(teamId);
//                 return;
//               }

//               img.style.display = "none";
//             }}
//           />
//         ) : null}
//       </div>

//       <span
//         style={{
//           opacity: teamId ? 1 : 0.65,
//           fontSize: 14,
//           fontWeight: isWinner ? 700 : 500,
//           letterSpacing: 0.2,
//           lineHeight: "16px",
//         }}
//       >
//         {name}
//       </span>
//     </div>
//   );
// }

// function GameCard({ game, teamMap }: { game: Game; teamMap: Map<string, Team> }) {
//   return (
//     <div
//       style={{
//         width: CARD_W,
//         height: CARD_H,
//         border: "1px solid #343434",
//         borderRadius: 14,
//         padding: PAD,
//         background: "rgba(0,0,0,0.35)",
//         boxSizing: "border-box",
//         position: "relative",
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         gap: ROW_GAP,
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

//       <TeamRow
//         teamId={game.teamAId}
//         teamMap={teamMap}
//         isWinner={!!game.winnerId && game.winnerId === game.teamAId}
//       />
//       <TeamRow
//         teamId={game.teamBId}
//         teamMap={teamMap}
//         isWinner={!!game.winnerId && game.winnerId === game.teamBId}
//       />
//     </div>
//   );
// }

// export default function BracketPage() {
//   const [games, setGames] = useState<Game[]>([]);
//   const [teams, setTeams] = useState<Team[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [msg, setMsg] = useState("");

//   // ✅ REALTIME: subscribe to teams + games
//   useEffect(() => {
//     setLoading(true);
//     setMsg("");

//     let gotGames = false;
//     let gotTeams = false;

//     const maybeDone = () => {
//       if (gotGames && gotTeams) setLoading(false);
//     };

//     const teamsCol = collection(db, "tournaments", TOURNAMENT_ID, "teams");
//     const gamesCol = collection(db, "tournaments", TOURNAMENT_ID, "games");

//     const unsubTeams = onSnapshot(
//       teamsCol,
//       (snap) => {
//         const rows = snap.docs.map((d) => normalizeTeam(d.id, d.data()));
//         rows.sort(
//           (a, b) => (a.seed ?? 999) - (b.seed ?? 999) || a.name.localeCompare(b.name)
//         );
//         setTeams(rows);
//         gotTeams = true;
//         maybeDone();
//       },
//       (err) => {
//         console.error(err);
//         setMsg("Error loading teams (realtime). Check console.");
//         gotTeams = true;
//         maybeDone();
//       }
//     );

//     const unsubGames = onSnapshot(
//       gamesCol,
//       (snap) => {
//         const rows = snap.docs.map((d) => normalizeGame(d.id, d.data()));
//         rows.sort((a, b) => a.round - b.round || a.game - b.game);
//         setGames(rows);
//         gotGames = true;
//         maybeDone();
//       },
//       (err) => {
//         console.error(err);
//         setMsg("Error loading games (realtime). Check console.");
//         gotGames = true;
//         maybeDone();
//       }
//     );

//     return () => {
//       unsubTeams();
//       unsubGames();
//     };
//   }, []);

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

//       const fromSide = g.round === 5 ? false : getSideInfo(g.round, g.game).isLeft;
//       const toSide = to.round === 5 ? null : getSideInfo(to.round, to.game).isLeft;

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

//   if (loading) {
//     return (
//       <main style={{ padding: 24, fontFamily: "system-ui", color: "#fff" }}>
//         {/* ✅ UPDATED (as requested): title + logo + description */}
//         <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
//           <img
//             src="/brand/bv.png"
//             alt="Beckett Visuals"
//             width={56}
//             height={56}
//             style={{
//               width: 56,
//               height: 56,
//               borderRadius: 12,
//               objectFit: "contain",
//               background: "rgba(255,255,255,0.06)",
//               border: "1px solid rgba(255,255,255,0.10)",
//               padding: 6,
//             }}
//             onError={(e) => {
//               (e.currentTarget as HTMLImageElement).style.display = "none";
//             }}
//           />

//           <div>
//             <h1 style={{ margin: 0 }}>2026 AIA Boys Basketball Open State Championship</h1>
//             <p style={{ margin: "6px 0 0", opacity: 0.75 }}>
//               Here is the current live matchups. Be sure to follow{" "}
//               <a
//                 href="https://www.instagram.com/beckettvisuals/"
//                 target="_blank"
//                 rel="noreferrer"
//                 style={{ color: "#fff", textDecoration: "underline" }}
//               >
//                 @beckettvisuals
//               </a>{" "}
//               on instagram
//             </p>
//           </div>
//         </div>

//         <p style={{ marginTop: 14 }}>Loading…</p>
//       </main>
//     );
//   }

//   return (
//     <main style={{ padding: 24, fontFamily: "system-ui", color: "#fff" }}>
//       {/* ✅ UPDATED (as requested): title + logo + description */}
//       <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
//         <img
//           src="/brand/bv.png"
//           alt="Beckett Visuals"
//           width={56}
//           height={56}
//           style={{
//             width: 56,
//             height: 56,
//             borderRadius: 12,
//             objectFit: "contain",
//             background: "rgba(255,255,255,0.06)",
//             border: "1px solid rgba(255,255,255,0.10)",
//             padding: 6,
//           }}
//           onError={(e) => {
//             (e.currentTarget as HTMLImageElement).style.display = "none";
//           }}
//         />

//         <div>
//           <h1 style={{ margin: 0 }}>2026 AIA Boys Basketball Open State Championship</h1>
//           <p style={{ margin: "6px 0 0", opacity: 0.75 }}>
//             Here is the current live matchups. Be sure to follow{" "}
//             <a
//               href="https://www.instagram.com/beckettvisuals/"
//               target="_blank"
//               rel="noreferrer"
//               style={{ color: "#fff", textDecoration: "underline" }}
//             >
//               @beckettvisuals
//             </a>{" "}
//             on instagram
//           </p>
//         </div>
//       </div>

//       {/* (kept exactly the same below) */}
//       {msg && <div style={{ marginTop: 10 }}>{msg}</div>}

//       <div
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
//           {positionedGames.map(({ game, x, y }) => (
//             <div key={game.id} style={{ position: "absolute", left: x, top: y }}>
//               <GameCard game={game} teamMap={teamMap} />
//             </div>
//           ))}

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

// // AZ High School Bracket - Created by Charles Richards 2026
// // ASU Computer Science (Cybersecurity) BS 2028



// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { collection, onSnapshot } from "firebase/firestore";
// import { db } from "../../lib/firebase";
// import { TOURNAMENT_ID } from "../../lib/tournament";
// import { roundGameCount } from "../../lib/games";

// /**
//  * ✅ Key fix:
//  * - Keep UNIT as the “bracket math” slot height (spacing between team lines)
//  * - Make the actual team rows (ROW_H) smaller so padding + gap fits inside CARD_H
//  */
// const UNIT = 46; // spacing unit used by bracket positioning
// const ROW_H = 36; // actual visible row height inside the card
// const ROW_GAP = 4; // gap between the two rows
// const PAD = 8; // card padding

// const CARD_W = 320;
// const CARD_H = UNIT * 2; // must stay 2*UNIT so cards align with bracket math
// const COL_W = 380;
// const TOP_PAD = 90;

// const SIDE_TEAMS = 16;
// const CANVAS_H = TOP_PAD + SIDE_TEAMS * UNIT + 80;
// const CANVAS_W = 40 + COL_W * 9;

// type Team = {
//   id: string;
//   name: string;
//   seed?: number | null;
//   logoUrl?: string | null; // supports remote URL if you add it later
//   logoPath?: string | null; // supports your firestore field if you used logoPath
// };

// type Game = {
//   id: string; // e.g. R1G1
//   round: number; // 1..5
//   game: number; // 1..16 (varies by round)
//   teamAId: string | null;
//   teamBId: string | null;
//   winnerId: string | null; // ✅ canonical winner field we will use in UI
//   nextGameId: string | null; // e.g. R2G1
//   nextSlot: "A" | "B" | null;
// };

// function slugToLocalLogo(teamId: string) {
//   return `/logos/${teamId}.png`;
// }

// // If Firestore doc is missing round/game fields, infer them from id (R#G#)
// function parseRoundGameFromId(id: string): { round: number; game: number } | null {
//   const m = /^R(\d+)G(\d+)$/i.exec(id);
//   if (!m) return null;
//   return { round: Number(m[1]), game: Number(m[2]) };
// }

// function normalizeTeam(id: string, data: any): Team {
//   return {
//     id,
//     name: data?.name ?? id,
//     seed: typeof data?.seed === "number" ? data.seed : null,
//     logoUrl: data?.logoUrl ?? null,
//     logoPath: data?.logoPath ?? null,
//   };
// }

// function normalizeGame(id: string, data: any): Game {
//   const parsed = parseRoundGameFromId(id);
//   const round = typeof data?.round === "number" ? data.round : parsed?.round ?? 0;
//   const game = typeof data?.game === "number" ? data.game : parsed?.game ?? 0;

//   // ✅ Support both fields to avoid "null winner" issues:
//   const winnerId = data?.winnerId ?? data?.winnerTeamId ?? null;

//   return {
//     id,
//     round,
//     game,
//     teamAId: data?.teamAId ?? null,
//     teamBId: data?.teamBId ?? null,
//     winnerId,
//     nextGameId: data?.nextGameId ?? null,
//     nextSlot: data?.nextSlot ?? null,
//   };
// }

// function getSideInfo(round: number, game: number) {
//   const total = roundGameCount(round);
//   const half = total / 2;
//   const isLeft = game <= half;
//   const localGame = isLeft ? game : game - half;
//   return { isLeft, localGame, half };
// }

// function topFor(round: number, localGame: number) {
//   const topIndex = Math.pow(2, round) * localGame - (Math.pow(2, round - 1) + 1);
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
//     const y = TOP_PAD + (SIDE_TEAMS * UNIT) / 2 - UNIT; // centered
//     return { x, y };
//   }

//   const { isLeft, localGame } = getSideInfo(g.round, g.game);
//   const col = colIndexFor(g.round, isLeft);
//   const x = xForCol(col);
//   const y = topFor(g.round, localGame);
//   return { x, y };
// }

// function TeamRow({
//   teamId,
//   teamMap,
//   isWinner,
// }: {
//   teamId: string | null;
//   teamMap: Map<string, Team>;
//   isWinner: boolean;
// }) {
//   const t = teamId ? teamMap.get(teamId) : null;
//   const name = teamId ? (t?.name ?? teamId) : "TBD";

//   // If you later add logoUrl/logoPath in Firestore, this supports it.
//   // Otherwise we fall back to /public/logos/<teamId>.png
//   const src = teamId ? t?.logoUrl || t?.logoPath || slugToLocalLogo(teamId) : "";

//   return (
//     <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         gap: 10,
//         height: ROW_H,
//         padding: "0 8px",
//         borderRadius: 10,
//         background: isWinner ? "rgba(255,255,255,0.10)" : "transparent",
//         border: isWinner ? "1px solid rgba(255,255,255,0.25)" : "1px solid transparent",
//         boxSizing: "border-box",
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

//               // If URL failed, try local fallback once
//               if (!img.dataset.triedFallback && (t?.logoUrl || t?.logoPath)) {
//                 img.dataset.triedFallback = "1";
//                 img.src = slugToLocalLogo(teamId);
//                 return;
//               }

//               img.style.display = "none";
//             }}
//           />
//         ) : null}
//       </div>

//       <span
//         style={{
//           opacity: teamId ? 1 : 0.65,
//           fontSize: 14,
//           fontWeight: isWinner ? 700 : 500,
//           letterSpacing: 0.2,
//           lineHeight: "16px",
//         }}
//       >
//         {name}
//       </span>
//     </div>
//   );
// }

// function GameCard({ game, teamMap }: { game: Game; teamMap: Map<string, Team> }) {
//   return (
//     <div
//       style={{
//         width: CARD_W,
//         height: CARD_H,
//         border: "1px solid #343434",
//         borderRadius: 14,
//         padding: PAD,
//         background: "rgba(0,0,0,0.35)",
//         boxSizing: "border-box",
//         position: "relative",
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         gap: ROW_GAP,
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

//       <TeamRow
//         teamId={game.teamAId}
//         teamMap={teamMap}
//         isWinner={!!game.winnerId && game.winnerId === game.teamAId}
//       />
//       <TeamRow
//         teamId={game.teamBId}
//         teamMap={teamMap}
//         isWinner={!!game.winnerId && game.winnerId === game.teamBId}
//       />
//     </div>
//   );
// }

// function Header() {
//   const linkStyle: React.CSSProperties = {
//     color: "#fff",
//     textDecoration: "underline",
//     textUnderlineOffset: 3,
//   };

//   return (
//     <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
//       <img
//         src="/brand/bv.png"
//         alt="Beckett Visuals"
//         width={56}
//         height={56}
//         style={{
//           width: 56,
//           height: 56,
//           borderRadius: 14,
//           objectFit: "contain",
//           background: "rgba(255,255,255,0.06)",
//           border: "1px solid rgba(255,255,255,0.10)",
//           padding: 6,
//           boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
//         }}
//         onError={(e) => {
//           (e.currentTarget as HTMLImageElement).style.display = "none";
//         }}
//       />

//       <div style={{ minWidth: 0 }}>
//         <h1
//           style={{
//             margin: 0,
//             fontSize: 30,
//             fontWeight: 900,
//             letterSpacing: -0.5,
//             lineHeight: "34px",
//             // "cool" pop: gradient text + glow
//             background: "linear-gradient(90deg, #ffffff, rgba(255,255,255,0.75))",
//             WebkitBackgroundClip: "text",
//             WebkitTextFillColor: "transparent",
//             textShadow: "0 6px 18px rgba(255,255,255,0.10)",
//           }}
//         >
//           2026 Arizona Boys Basketball Open State Championship - AZ Road to Open Competition
//         </h1>

//         <div
//           style={{
//             marginTop: 10,
//             display: "inline-flex",
//             alignItems: "center",
//             gap: 10,
//             padding: "10px 12px",
//             borderRadius: 14,
//             border: "1px solid rgba(255,255,255,0.10)",
//             background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(0,0,0,0.10))",
//             boxShadow: "0 16px 60px rgba(0,0,0,0.35)",
//           }}
//         >
//           <div
//             style={{
//               width: 3,
//               height: 34,
//               borderRadius: 999,
//               background: "rgba(255,255,255,0.35)",
//               flex: "0 0 auto",
//             }}
//           />
//           <p style={{ margin: 0, opacity: 0.9, lineHeight: "18px", fontSize: 14 }}>
//             Here is the current live matchups. Be sure to follow{" "}
//             <a
//               href="https://www.instagram.com/beckettvisuals/"
//               target="_blank"
//               rel="noreferrer"
//               style={linkStyle}
//             >
//               @beckettvisuals
//             </a>{" "}
//             on instagram for updates and{" "}
//             <a
//               href="https://www.instagram.com/charlie.richards13/"
//               target="_blank"
//               rel="noreferrer"
//               style={linkStyle}
//             >
//               @charlie.richards13
//             </a>{" "}
//             for software development inquiries
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function BracketPage() {
//   const [games, setGames] = useState<Game[]>([]);
//   const [teams, setTeams] = useState<Team[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [msg, setMsg] = useState("");

//   // ✅ REALTIME: subscribe to teams + games
//   useEffect(() => {
//     setLoading(true);
//     setMsg("");

//     let gotGames = false;
//     let gotTeams = false;

//     const maybeDone = () => {
//       if (gotGames && gotTeams) setLoading(false);
//     };

//     const teamsCol = collection(db, "tournaments", TOURNAMENT_ID, "teams");
//     const gamesCol = collection(db, "tournaments", TOURNAMENT_ID, "games");

//     const unsubTeams = onSnapshot(
//       teamsCol,
//       (snap) => {
//         const rows = snap.docs.map((d) => normalizeTeam(d.id, d.data()));
//         rows.sort(
//           (a, b) => (a.seed ?? 999) - (b.seed ?? 999) || a.name.localeCompare(b.name)
//         );
//         setTeams(rows);
//         gotTeams = true;
//         maybeDone();
//       },
//       (err) => {
//         console.error(err);
//         setMsg("Error loading teams (realtime). Check console.");
//         gotTeams = true;
//         maybeDone();
//       }
//     );

//     const unsubGames = onSnapshot(
//       gamesCol,
//       (snap) => {
//         const rows = snap.docs.map((d) => normalizeGame(d.id, d.data()));
//         rows.sort((a, b) => a.round - b.round || a.game - b.game);
//         setGames(rows);
//         gotGames = true;
//         maybeDone();
//       },
//       (err) => {
//         console.error(err);
//         setMsg("Error loading games (realtime). Check console.");
//         gotGames = true;
//         maybeDone();
//       }
//     );

//     return () => {
//       unsubTeams();
//       unsubGames();
//     };
//   }, []);

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

//       const fromSide = g.round === 5 ? false : getSideInfo(g.round, g.game).isLeft;
//       const toSide = to.round === 5 ? null : getSideInfo(to.round, to.game).isLeft;

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

//   if (loading) {
//     return (
//       <main style={{ padding: 24, fontFamily: "system-ui", color: "#fff" }}>
//         <Header />
//         <p style={{ marginTop: 14, opacity: 0.85 }}>Loading…</p>
//       </main>
//     );
//   }

//   return (
//     <main style={{ padding: 24, fontFamily: "system-ui", color: "#fff" }}>
//       <Header />

//       {msg && <div style={{ marginTop: 10 }}>{msg}</div>}

//       <div
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
//           {positionedGames.map(({ game, x, y }) => (
//             <div key={game.id} style={{ position: "absolute", left: x, top: y }}>
//               <GameCard game={game} teamMap={teamMap} />
//             </div>
//           ))}

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

// // AZ High School Bracket - Created by Charles Richards 2026
// // ASU Computer Science (Cybersecurity) BS 2028


// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useRouter } from "next/navigation";
// import { collection, onSnapshot } from "firebase/firestore";
// import { db } from "../../lib/firebase";
// import { TOURNAMENT_ID } from "../../lib/tournament";
// import { roundGameCount } from "../../lib/games";

// /**
//  * ✅ Key fix:
//  * - Keep UNIT as the “bracket math” slot height (spacing between team lines)
//  * - Make the actual team rows (ROW_H) smaller so padding + gap fits inside CARD_H
//  */
// const UNIT = 46; // spacing unit used by bracket positioning
// const ROW_H = 36; // actual visible row height inside the card
// const ROW_GAP = 4; // gap between the two rows
// const PAD = 8; // card padding

// const CARD_W = 320;
// const CARD_H = UNIT * 2; // must stay 2*UNIT so cards align with bracket math
// const COL_W = 380;
// const TOP_PAD = 90;

// const SIDE_TEAMS = 16;
// const CANVAS_H = TOP_PAD + SIDE_TEAMS * UNIT + 80;
// const CANVAS_W = 40 + COL_W * 9;

// type Team = {
//   id: string;
//   name: string;
//   seed?: number | null;
//   logoUrl?: string | null; // supports remote URL if you add it later
//   logoPath?: string | null; // supports your firestore field if you used logoPath
// };

// type Game = {
//   id: string; // e.g. R1G1
//   round: number; // 1..5
//   game: number; // 1..16 (varies by round)
//   teamAId: string | null;
//   teamBId: string | null;
//   winnerId: string | null; // ✅ canonical winner field we will use in UI
//   nextGameId: string | null; // e.g. R2G1
//   nextSlot: "A" | "B" | null;
// };

// function slugToLocalLogo(teamId: string) {
//   return `/logos/${teamId}.png`;
// }

// // If Firestore doc is missing round/game fields, infer them from id (R#G#)
// function parseRoundGameFromId(id: string): { round: number; game: number } | null {
//   const m = /^R(\d+)G(\d+)$/i.exec(id);
//   if (!m) return null;
//   return { round: Number(m[1]), game: Number(m[2]) };
// }

// function normalizeTeam(id: string, data: any): Team {
//   return {
//     id,
//     name: data?.name ?? id,
//     seed: typeof data?.seed === "number" ? data.seed : null,
//     logoUrl: data?.logoUrl ?? null,
//     logoPath: data?.logoPath ?? null,
//   };
// }

// function normalizeGame(id: string, data: any): Game {
//   const parsed = parseRoundGameFromId(id);
//   const round = typeof data?.round === "number" ? data.round : parsed?.round ?? 0;
//   const game = typeof data?.game === "number" ? data.game : parsed?.game ?? 0;

//   // ✅ Support both fields to avoid "null winner" issues:
//   const winnerId = data?.winnerId ?? data?.winnerTeamId ?? null;

//   return {
//     id,
//     round,
//     game,
//     teamAId: data?.teamAId ?? null,
//     teamBId: data?.teamBId ?? null,
//     winnerId,
//     nextGameId: data?.nextGameId ?? null,
//     nextSlot: data?.nextSlot ?? null,
//   };
// }

// function getSideInfo(round: number, game: number) {
//   const total = roundGameCount(round);
//   const half = total / 2;
//   const isLeft = game <= half;
//   const localGame = isLeft ? game : game - half;
//   return { isLeft, localGame, half };
// }

// function topFor(round: number, localGame: number) {
//   const topIndex = Math.pow(2, round) * localGame - (Math.pow(2, round - 1) + 1);
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
//     const y = TOP_PAD + (SIDE_TEAMS * UNIT) / 2 - UNIT; // centered
//     return { x, y };
//   }

//   const { isLeft, localGame } = getSideInfo(g.round, g.game);
//   const col = colIndexFor(g.round, isLeft);
//   const x = xForCol(col);
//   const y = topFor(g.round, localGame);
//   return { x, y };
// }

// function TeamRow({
//   teamId,
//   teamMap,
//   isWinner,
// }: {
//   teamId: string | null;
//   teamMap: Map<string, Team>;
//   isWinner: boolean;
// }) {
//   const t = teamId ? teamMap.get(teamId) : null;
//   const name = teamId ? (t?.name ?? teamId) : "TBD";

//   // If you later add logoUrl/logoPath in Firestore, this supports it.
//   // Otherwise we fall back to /public/logos/<teamId>.png
//   const src = teamId ? t?.logoUrl || t?.logoPath || slugToLocalLogo(teamId) : "";

//   return (
//     <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         gap: 10,
//         height: ROW_H,
//         padding: "0 8px",
//         borderRadius: 10,
//         background: isWinner ? "rgba(255,255,255,0.10)" : "transparent",
//         border: isWinner ? "1px solid rgba(255,255,255,0.25)" : "1px solid transparent",
//         boxSizing: "border-box",
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

//               // If URL failed, try local fallback once
//               if (!img.dataset.triedFallback && (t?.logoUrl || t?.logoPath)) {
//                 img.dataset.triedFallback = "1";
//                 img.src = slugToLocalLogo(teamId);
//                 return;
//               }

//               img.style.display = "none";
//             }}
//           />
//         ) : null}
//       </div>

//       <span
//         style={{
//           opacity: teamId ? 1 : 0.65,
//           fontSize: 14,
//           fontWeight: isWinner ? 700 : 500,
//           letterSpacing: 0.2,
//           lineHeight: "16px",
//         }}
//       >
//         {name}
//       </span>
//     </div>
//   );
// }

// function GameCard({ game, teamMap }: { game: Game; teamMap: Map<string, Team> }) {
//   return (
//     <div
//       style={{
//         width: CARD_W,
//         height: CARD_H,
//         border: "1px solid #343434",
//         borderRadius: 14,
//         padding: PAD,
//         background: "rgba(0,0,0,0.35)",
//         boxSizing: "border-box",
//         position: "relative",
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         gap: ROW_GAP,
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

//       <TeamRow
//         teamId={game.teamAId}
//         teamMap={teamMap}
//         isWinner={!!game.winnerId && game.winnerId === game.teamAId}
//       />
//       <TeamRow
//         teamId={game.teamBId}
//         teamMap={teamMap}
//         isWinner={!!game.winnerId && game.winnerId === game.teamBId}
//       />
//     </div>
//   );
// }

// function Header() {
//   const linkStyle: React.CSSProperties = {
//     color: "#fff",
//     textDecoration: "underline",
//     textUnderlineOffset: 3,
//   };

//   return (
//     <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
//       <img
//         src="/brand/bv.png"
//         alt="Beckett Visuals"
//         width={56}
//         height={56}
//         style={{
//           width: 56,
//           height: 56,
//           borderRadius: 14,
//           objectFit: "contain",
//           background: "rgba(255,255,255,0.06)",
//           border: "1px solid rgba(255,255,255,0.10)",
//           padding: 6,
//           boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
//         }}
//         onError={(e) => {
//           (e.currentTarget as HTMLImageElement).style.display = "none";
//         }}
//       />

//       <div style={{ minWidth: 0 }}>
//         <h1
//           style={{
//             margin: 0,
//             fontSize: 30,
//             fontWeight: 900,
//             letterSpacing: -0.5,
//             lineHeight: "34px",
//             // "cool" pop: gradient text + glow
//             background: "linear-gradient(90deg, #ffffff, rgba(255,255,255,0.75))",
//             WebkitBackgroundClip: "text",
//             WebkitTextFillColor: "transparent",
//             textShadow: "0 6px 18px rgba(255,255,255,0.10)",
//           }}
//         >
//           2026 Arizona Boys Basketball Open State Championship - AZ Road to Open Competition
//         </h1>

//         <div
//           style={{
//             marginTop: 10,
//             display: "inline-flex",
//             alignItems: "center",
//             gap: 10,
//             padding: "10px 12px",
//             borderRadius: 14,
//             border: "1px solid rgba(255,255,255,0.10)",
//             background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(0,0,0,0.10))",
//             boxShadow: "0 16px 60px rgba(0,0,0,0.35)",
//           }}
//         >
//           <div
//             style={{
//               width: 3,
//               height: 34,
//               borderRadius: 999,
//               background: "rgba(255,255,255,0.35)",
//               flex: "0 0 auto",
//             }}
//           />
//           <p style={{ margin: 0, opacity: 0.9, lineHeight: "18px", fontSize: 14 }}>
//             Here is the current live matchups. Be sure to follow{" "}
//             <a
//               href="https://www.instagram.com/beckettvisuals/"
//               target="_blank"
//               rel="noreferrer"
//               style={linkStyle}
//             >
//               @beckettvisuals
//             </a>{" "}
//             on instagram for updates and{" "}
//             <a
//               href="https://www.instagram.com/charlie.richards13/"
//               target="_blank"
//               rel="noreferrer"
//               style={linkStyle}
//             >
//               @charlie.richards13
//             </a>{" "}
//             for software development inquiries
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// function HomeButton({ onClick }: { onClick: () => void }) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       style={{
//         padding: "10px 12px",
//         borderRadius: 12,
//         border: "1px solid rgba(255,255,255,0.35)",
//         background: "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(0,0,0,0.35))",
//         color: "#fff",
//         cursor: "pointer",
//         fontWeight: 800,
//         letterSpacing: 0.3,
//         display: "inline-flex",
//         alignItems: "center",
//         gap: 8,
//         boxShadow: "0 8px 20px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.08) inset",
//         height: 42,
//         whiteSpace: "nowrap",
//       }}
//       title="Back to Home"
//     >
//       <span style={{ opacity: 0.9, fontSize: 16 }}>←</span>
//       Home
//     </button>
//   );
// }

// export default function BracketPage() {
//   const router = useRouter();

//   const [games, setGames] = useState<Game[]>([]);
//   const [teams, setTeams] = useState<Team[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [msg, setMsg] = useState("");

//   // ✅ REALTIME: subscribe to teams + games
//   useEffect(() => {
//     setLoading(true);
//     setMsg("");

//     let gotGames = false;
//     let gotTeams = false;

//     const maybeDone = () => {
//       if (gotGames && gotTeams) setLoading(false);
//     };

//     const teamsCol = collection(db, "tournaments", TOURNAMENT_ID, "teams");
//     const gamesCol = collection(db, "tournaments", TOURNAMENT_ID, "games");

//     const unsubTeams = onSnapshot(
//       teamsCol,
//       (snap) => {
//         const rows = snap.docs.map((d) => normalizeTeam(d.id, d.data()));
//         rows.sort(
//           (a, b) => (a.seed ?? 999) - (b.seed ?? 999) || a.name.localeCompare(b.name)
//         );
//         setTeams(rows);
//         gotTeams = true;
//         maybeDone();
//       },
//       (err) => {
//         console.error(err);
//         setMsg("Error loading teams (realtime). Check console.");
//         gotTeams = true;
//         maybeDone();
//       }
//     );

//     const unsubGames = onSnapshot(
//       gamesCol,
//       (snap) => {
//         const rows = snap.docs.map((d) => normalizeGame(d.id, d.data()));
//         rows.sort((a, b) => a.round - b.round || a.game - b.game);
//         setGames(rows);
//         gotGames = true;
//         maybeDone();
//       },
//       (err) => {
//         console.error(err);
//         setMsg("Error loading games (realtime). Check console.");
//         gotGames = true;
//         maybeDone();
//       }
//     );

//     return () => {
//       unsubTeams();
//       unsubGames();
//     };
//   }, []);

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

//       const fromSide = g.round === 5 ? false : getSideInfo(g.round, g.game).isLeft;
//       const toSide = to.round === 5 ? null : getSideInfo(to.round, to.game).isLeft;

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

//   if (loading) {
//     return (
//       <main style={{ padding: 24, fontFamily: "system-ui", color: "#fff" }}>
//         {/* ✅ HOME BUTTON + HEADER */}
//         <div style={{ display: "flex", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
//           <HomeButton onClick={() => router.push("/")} />
//           <div style={{ flex: 1, minWidth: 0 }}>
//             <Header />
//           </div>
//         </div>

//         <p style={{ marginTop: 14, opacity: 0.85 }}>Loading…</p>
//       </main>
//     );
//   }

//   return (
//     <main style={{ padding: 24, fontFamily: "system-ui", color: "#fff" }}>
//       {/* ✅ HOME BUTTON + HEADER */}
//       <div style={{ display: "flex", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
//         <HomeButton onClick={() => router.push("/")} />
//         <div style={{ flex: 1, minWidth: 0 }}>
//           <Header />
//         </div>
//       </div>

//       {msg && <div style={{ marginTop: 10 }}>{msg}</div>}

//       <div
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
//           {positionedGames.map(({ game, x, y }) => (
//             <div key={game.id} style={{ position: "absolute", left: x, top: y }}>
//               <GameCard game={game} teamMap={teamMap} />
//             </div>
//           ))}

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

// // AZ High School Bracket - Created by Charles Richards 2026
// // ASU Computer Science (Cybersecurity) BS 2028



// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useRouter } from "next/navigation";
// import { collection, onSnapshot } from "firebase/firestore";
// import { db } from "../../lib/firebase";
// import { TOURNAMENT_ID } from "../../lib/tournament";
// import { roundGameCount } from "../../lib/games";

// /**
//  * ✅ Key fix:
//  * - Keep UNIT as the “bracket math” slot height (spacing between team lines)
//  * - Make the actual team rows (ROW_H) smaller so padding + gap fits inside CARD_H
//  */
// const UNIT = 46; // spacing unit used by bracket positioning
// const ROW_H = 36; // actual visible row height inside the card
// const ROW_GAP = 4; // gap between the two rows
// const PAD = 8; // card padding

// const CARD_W = 320;
// const CARD_H = UNIT * 2; // must stay 2*UNIT so cards align with bracket math
// const COL_W = 380;
// const TOP_PAD = 90;

// const SIDE_TEAMS = 16;
// const CANVAS_H = TOP_PAD + SIDE_TEAMS * UNIT + 80;
// const CANVAS_W = 40 + COL_W * 9;

// type Team = {
//   id: string;
//   name: string;
//   seed?: number | null;
//   logoUrl?: string | null; // supports remote URL if you add it later
//   logoPath?: string | null; // supports your firestore field if you used logoPath
// };

// type Game = {
//   id: string; // e.g. R1G1
//   round: number; // 1..5
//   game: number; // 1..16 (varies by round)
//   teamAId: string | null;
//   teamBId: string | null;
//   winnerId: string | null; // ✅ canonical winner field we will use in UI
//   nextGameId: string | null; // e.g. R2G1
//   nextSlot: "A" | "B" | null;
// };

// function slugToLocalLogo(teamId: string) {
//   return `/logos/${teamId}.png`;
// }

// // If Firestore doc is missing round/game fields, infer them from id (R#G#)
// function parseRoundGameFromId(id: string): { round: number; game: number } | null {
//   const m = /^R(\d+)G(\d+)$/i.exec(id);
//   if (!m) return null;
//   return { round: Number(m[1]), game: Number(m[2]) };
// }

// function normalizeTeam(id: string, data: any): Team {
//   return {
//     id,
//     name: data?.name ?? id,
//     seed: typeof data?.seed === "number" ? data.seed : null,
//     logoUrl: data?.logoUrl ?? null,
//     logoPath: data?.logoPath ?? null,
//   };
// }

// function normalizeGame(id: string, data: any): Game {
//   const parsed = parseRoundGameFromId(id);
//   const round = typeof data?.round === "number" ? data.round : parsed?.round ?? 0;
//   const game = typeof data?.game === "number" ? data.game : parsed?.game ?? 0;

//   // ✅ Support both fields to avoid "null winner" issues:
//   const winnerId = data?.winnerId ?? data?.winnerTeamId ?? null;

//   return {
//     id,
//     round,
//     game,
//     teamAId: data?.teamAId ?? null,
//     teamBId: data?.teamBId ?? null,
//     winnerId,
//     nextGameId: data?.nextGameId ?? null,
//     nextSlot: data?.nextSlot ?? null,
//   };
// }

// function getSideInfo(round: number, game: number) {
//   const total = roundGameCount(round);
//   const half = total / 2;
//   const isLeft = game <= half;
//   const localGame = isLeft ? game : game - half;
//   return { isLeft, localGame, half };
// }

// function topFor(round: number, localGame: number) {
//   const topIndex = Math.pow(2, round) * localGame - (Math.pow(2, round - 1) + 1);
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
//     const y = TOP_PAD + (SIDE_TEAMS * UNIT) / 2 - UNIT; // centered
//     return { x, y };
//   }

//   const { isLeft, localGame } = getSideInfo(g.round, g.game);
//   const col = colIndexFor(g.round, isLeft);
//   const x = xForCol(col);
//   const y = topFor(g.round, localGame);
//   return { x, y };
// }

// function TeamRow({
//   teamId,
//   teamMap,
//   isWinner,
// }: {
//   teamId: string | null;
//   teamMap: Map<string, Team>;
//   isWinner: boolean;
// }) {
//   const t = teamId ? teamMap.get(teamId) : null;
//   const name = teamId ? (t?.name ?? teamId) : "TBD";

//   // If you later add logoUrl/logoPath in Firestore, this supports it.
//   // Otherwise we fall back to /public/logos/<teamId>.png
//   const src = teamId ? t?.logoUrl || t?.logoPath || slugToLocalLogo(teamId) : "";

//   return (
//     <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         gap: 10,
//         height: ROW_H,
//         padding: "0 8px",
//         borderRadius: 10,
//         background: isWinner ? "rgba(255,255,255,0.10)" : "transparent",
//         border: isWinner ? "1px solid rgba(255,255,255,0.25)" : "1px solid transparent",
//         boxSizing: "border-box",
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

//               // If URL failed, try local fallback once
//               if (!img.dataset.triedFallback && (t?.logoUrl || t?.logoPath)) {
//                 img.dataset.triedFallback = "1";
//                 img.src = slugToLocalLogo(teamId);
//                 return;
//               }

//               img.style.display = "none";
//             }}
//           />
//         ) : null}
//       </div>

//       <span
//         style={{
//           opacity: teamId ? 1 : 0.65,
//           fontSize: 14,
//           fontWeight: isWinner ? 700 : 500,
//           letterSpacing: 0.2,
//           lineHeight: "16px",
//         }}
//       >
//         {name}
//       </span>
//     </div>
//   );
// }

// function GameCard({ game, teamMap }: { game: Game; teamMap: Map<string, Team> }) {
//   return (
//     <div
//       style={{
//         width: CARD_W,
//         height: CARD_H,
//         border: "1px solid #343434",
//         borderRadius: 14,
//         padding: PAD,
//         background: "rgba(0,0,0,0.35)",
//         boxSizing: "border-box",
//         position: "relative",
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         gap: ROW_GAP,
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

//       <TeamRow
//         teamId={game.teamAId}
//         teamMap={teamMap}
//         isWinner={!!game.winnerId && game.winnerId === game.teamAId}
//       />
//       <TeamRow
//         teamId={game.teamBId}
//         teamMap={teamMap}
//         isWinner={!!game.winnerId && game.winnerId === game.teamBId}
//       />
//     </div>
//   );
// }

// function Header() {
//   const linkStyle: React.CSSProperties = {
//     color: "#fff",
//     textDecoration: "underline",
//     textUnderlineOffset: 3,
//   };

//   return (
//     <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
//       <img
//         src="/brand/bv.png"
//         alt="Beckett Visuals"
//         width={56}
//         height={56}
//         style={{
//           width: 56,
//           height: 56,
//           borderRadius: 14,
//           objectFit: "contain",
//           background: "rgba(255,255,255,0.06)",
//           border: "1px solid rgba(255,255,255,0.10)",
//           padding: 6,
//           boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
//         }}
//         onError={(e) => {
//           (e.currentTarget as HTMLImageElement).style.display = "none";
//         }}
//       />

//       <div style={{ minWidth: 0 }}>
//         <h1
//           style={{
//             margin: 0,
//             fontSize: 30,
//             fontWeight: 900,
//             letterSpacing: -0.5,
//             lineHeight: "34px",
//             // "cool" pop: gradient text + glow
//             background: "linear-gradient(90deg, #ffffff, rgba(255,255,255,0.75))",
//             WebkitBackgroundClip: "text",
//             WebkitTextFillColor: "transparent",
//             textShadow: "0 6px 18px rgba(255,255,255,0.10)",
//           }}
//         >
//           2026 Arizona Boys Basketball Open State Championship - AZ Road to Open Competition
//         </h1>

//         <div
//           style={{
//             marginTop: 10,
//             display: "inline-flex",
//             alignItems: "center",
//             gap: 10,
//             padding: "10px 12px",
//             borderRadius: 14,
//             border: "1px solid rgba(255,255,255,0.10)",
//             background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(0,0,0,0.10))",
//             boxShadow: "0 16px 60px rgba(0,0,0,0.35)",
//           }}
//         >
//           <div
//             style={{
//               width: 3,
//               height: 34,
//               borderRadius: 999,
//               background: "rgba(255,255,255,0.35)",
//               flex: "0 0 auto",
//             }}
//           />
//           <p style={{ margin: 0, opacity: 0.9, lineHeight: "18px", fontSize: 14 }}>
//             Here is the current live matchups. Be sure to follow{" "}
//             <a
//               href="https://www.instagram.com/beckettvisuals/"
//               target="_blank"
//               rel="noreferrer"
//               style={linkStyle}
//             >
//               @beckettvisuals
//             </a>{" "}
//             on instagram for updates and{" "}
//             <a
//               href="https://www.instagram.com/charlie.richards13/"
//               target="_blank"
//               rel="noreferrer"
//               style={linkStyle}
//             >
//               @charlie.richards13
//             </a>{" "}
//             for software development inquiries
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// function HomeButton({ onClick }: { onClick: () => void }) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       style={{
//         padding: "10px 12px",
//         borderRadius: 12,
//         border: "1px solid rgba(255,255,255,0.35)",
//         background: "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(0,0,0,0.35))",
//         color: "#fff",
//         cursor: "pointer",
//         fontWeight: 800,
//         letterSpacing: 0.3,
//         display: "inline-flex",
//         alignItems: "center",
//         gap: 8,
//         boxShadow: "0 8px 20px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.08) inset",
//         height: 42,
//         whiteSpace: "nowrap",
//       }}
//       title="Back to Home"
//     >
//       <span style={{ opacity: 0.9, fontSize: 16 }}>←</span>
//       Home
//     </button>
//   );
// }

// export default function BracketPage() {
//   const router = useRouter();

//   const [games, setGames] = useState<Game[]>([]);
//   const [teams, setTeams] = useState<Team[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [msg, setMsg] = useState("");

//   // ✅ REALTIME: subscribe to teams + games
//   useEffect(() => {
//     setLoading(true);
//     setMsg("");

//     let gotGames = false;
//     let gotTeams = false;

//     const maybeDone = () => {
//       if (gotGames && gotTeams) setLoading(false);
//     };

//     const teamsCol = collection(db, "tournaments", TOURNAMENT_ID, "teams");
//     const gamesCol = collection(db, "tournaments", TOURNAMENT_ID, "games");

//     const unsubTeams = onSnapshot(
//       teamsCol,
//       (snap) => {
//         const rows = snap.docs.map((d) => normalizeTeam(d.id, d.data()));
//         rows.sort(
//           (a, b) => (a.seed ?? 999) - (b.seed ?? 999) || a.name.localeCompare(b.name)
//         );
//         setTeams(rows);
//         gotTeams = true;
//         maybeDone();
//       },
//       (err) => {
//         console.error(err);
//         setMsg("Error loading teams (realtime). Check console.");
//         gotTeams = true;
//         maybeDone();
//       }
//     );

//     const unsubGames = onSnapshot(
//       gamesCol,
//       (snap) => {
//         const rows = snap.docs.map((d) => normalizeGame(d.id, d.data()));
//         rows.sort((a, b) => a.round - b.round || a.game - b.game);
//         setGames(rows);
//         gotGames = true;
//         maybeDone();
//       },
//       (err) => {
//         console.error(err);
//         setMsg("Error loading games (realtime). Check console.");
//         gotGames = true;
//         maybeDone();
//       }
//     );

//     return () => {
//       unsubTeams();
//       unsubGames();
//     };
//   }, []);

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

//       const fromSide = g.round === 5 ? false : getSideInfo(g.round, g.game).isLeft;
//       const toSide = to.round === 5 ? null : getSideInfo(to.round, to.game).isLeft;

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

//   if (loading) {
//     return (
//       <main style={{ padding: 24, fontFamily: "system-ui", color: "#fff" }}>
//         {/* ✅ HEADER, then HOME BUTTON on the other side under the lettering */}
//         <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//           <Header />
//           <div style={{ display: "flex", justifyContent: "flex-end" }}>
//             <HomeButton onClick={() => router.push("/")} />
//           </div>
//         </div>

//         <p style={{ marginTop: 14, opacity: 0.85 }}>Loading…</p>
//       </main>
//     );
//   }

//   return (
//     <main style={{ padding: 24, fontFamily: "system-ui", color: "#fff" }}>
//       {/* ✅ HEADER, then HOME BUTTON on the other side under the lettering */}
//       <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//         <Header />
//         <div style={{ display: "flex", justifyContent: "flex-end" }}>
//           <HomeButton onClick={() => router.push("/")} />
//         </div>
//       </div>

//       {msg && <div style={{ marginTop: 10 }}>{msg}</div>}

//       <div
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
//           {positionedGames.map(({ game, x, y }) => (
//             <div key={game.id} style={{ position: "absolute", left: x, top: y }}>
//               <GameCard game={game} teamMap={teamMap} />
//             </div>
//           ))}

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

// // AZ High School Bracket - Created by Charles Richards 2026
// // ASU Computer Science (Cybersecurity) BS 2028



"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { TOURNAMENT_ID } from "../../lib/tournament";
import { roundGameCount } from "../../lib/games";

/**
 * ✅ Key fix:
 * - Keep UNIT as the “bracket math” slot height (spacing between team lines)
 * - Make the actual team rows (ROW_H) smaller so padding + gap fits inside CARD_H
 */
const UNIT = 46; // spacing unit used by bracket positioning
const ROW_H = 36; // actual visible row height inside the card
const ROW_GAP = 4; // gap between the two rows
const PAD = 8; // card padding

const CARD_W = 320;
const CARD_H = UNIT * 2; // must stay 2*UNIT so cards align with bracket math
const COL_W = 380;
const TOP_PAD = 90;

const SIDE_TEAMS = 16;
const CANVAS_H = TOP_PAD + SIDE_TEAMS * UNIT + 80;
const CANVAS_W = 40 + COL_W * 9;

type Team = {
  id: string;
  name: string;
  seed?: number | null;
  logoUrl?: string | null; // supports remote URL if you add it later
  logoPath?: string | null; // supports your firestore field if you used logoPath
};

type Game = {
  id: string; // e.g. R1G1
  round: number; // 1..5
  game: number; // 1..16 (varies by round)
  teamAId: string | null;
  teamBId: string | null;
  winnerId: string | null; // ✅ canonical winner field we will use in UI
  nextGameId: string | null; // e.g. R2G1
  nextSlot: "A" | "B" | null;
};

function slugToLocalLogo(teamId: string) {
  return `/logos/${teamId}.png`;
}
function slugToLocalLogoUpper(teamId: string) {
  return `/logos/${teamId}.PNG`;
}

// If Firestore doc is missing round/game fields, infer them from id (R#G#)
function parseRoundGameFromId(id: string): { round: number; game: number } | null {
  const m = /^R(\d+)G(\d+)$/i.exec(id);
  if (!m) return null;
  return { round: Number(m[1]), game: Number(m[2]) };
}

function normalizeTeam(id: string, data: any): Team {
  return {
    id,
    name: data?.name ?? id,
    seed: typeof data?.seed === "number" ? data.seed : null,
    logoUrl: data?.logoUrl ?? null,
    logoPath: data?.logoPath ?? null,
  };
}

function normalizeGame(id: string, data: any): Game {
  const parsed = parseRoundGameFromId(id);
  const round = typeof data?.round === "number" ? data.round : parsed?.round ?? 0;
  const game = typeof data?.game === "number" ? data.game : parsed?.game ?? 0;

  // ✅ Support both fields to avoid "null winner" issues:
  const winnerId = data?.winnerId ?? data?.winnerTeamId ?? null;

  return {
    id,
    round,
    game,
    teamAId: data?.teamAId ?? null,
    teamBId: data?.teamBId ?? null,
    winnerId,
    nextGameId: data?.nextGameId ?? null,
    nextSlot: data?.nextSlot ?? null,
  };
}

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
    const y = TOP_PAD + (SIDE_TEAMS * UNIT) / 2 - UNIT; // centered
    return { x, y };
  }

  const { isLeft, localGame } = getSideInfo(g.round, g.game);
  const col = colIndexFor(g.round, isLeft);
  const x = xForCol(col);
  const y = topFor(g.round, localGame);
  return { x, y };
}

function TeamRow({
  teamId,
  teamMap,
  isWinner,
}: {
  teamId: string | null;
  teamMap: Map<string, Team>;
  isWinner: boolean;
}) {
  const t = teamId ? teamMap.get(teamId) : null;
  const name = teamId ? (t?.name ?? teamId) : "TBD";

  // Supports Firestore logoUrl/logoPath OR local /public/logos/<teamId>.png
  const src = teamId ? t?.logoUrl || t?.logoPath || slugToLocalLogo(teamId) : "";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        height: ROW_H,
        padding: "0 8px",
        borderRadius: 10,
        background: isWinner ? "rgba(255,255,255,0.10)" : "transparent",
        border: isWinner ? "1px solid rgba(255,255,255,0.25)" : "1px solid transparent",
        boxSizing: "border-box",
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

              // 1) If remote/field-based fails, try local .png
              if (!img.dataset.triedPng && (t?.logoUrl || t?.logoPath)) {
                img.dataset.triedPng = "1";
                img.src = slugToLocalLogo(teamId);
                return;
              }

              // 2) If .png fails (or initial was .png), try .PNG (case-sensitive on Vercel)
              if (!img.dataset.triedUpper) {
                img.dataset.triedUpper = "1";
                img.src = slugToLocalLogoUpper(teamId);
                return;
              }

              // 3) Give up
              img.style.display = "none";
            }}
          />
        ) : null}
      </div>

      <span
        style={{
          opacity: teamId ? 1 : 0.65,
          fontSize: 14,
          fontWeight: isWinner ? 700 : 500,
          letterSpacing: 0.2,
          lineHeight: "16px",
        }}
      >
        {name}
      </span>
    </div>
  );
}

function GameCard({ game, teamMap }: { game: Game; teamMap: Map<string, Team> }) {
  return (
    <div
      style={{
        width: CARD_W,
        height: CARD_H,
        border: "1px solid #343434",
        borderRadius: 14,
        padding: PAD,
        background: "rgba(0,0,0,0.35)",
        boxSizing: "border-box",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: ROW_GAP,
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

      <TeamRow
        teamId={game.teamAId}
        teamMap={teamMap}
        isWinner={!!game.winnerId && game.winnerId === game.teamAId}
      />
      <TeamRow
        teamId={game.teamBId}
        teamMap={teamMap}
        isWinner={!!game.winnerId && game.winnerId === game.teamBId}
      />
    </div>
  );
}

function Header() {
  const linkStyle: React.CSSProperties = {
    color: "#fff",
    textDecoration: "underline",
    textUnderlineOffset: 3,
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <img
        src="/brand/bv.png"
        alt="Beckett Visuals"
        width={56}
        height={56}
        style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          objectFit: "contain",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.10)",
          padding: 6,
          boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
        }}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />

      <div style={{ minWidth: 0 }}>
        <h1
          style={{
            margin: 0,
            fontSize: 30,
            fontWeight: 900,
            letterSpacing: -0.5,
            lineHeight: "34px",
            background: "linear-gradient(90deg, #ffffff, rgba(255,255,255,0.75))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 6px 18px rgba(255,255,255,0.10)",
          }}
        >
          2026 Arizona Boys Basketball Open State Championship - AZ Road to Open Competition
        </h1>

        <div
          style={{
            marginTop: 10,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 12px",
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.10)",
            background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(0,0,0,0.10))",
            boxShadow: "0 16px 60px rgba(0,0,0,0.35)",
          }}
        >
          <div
            style={{
              width: 3,
              height: 34,
              borderRadius: 999,
              background: "rgba(255,255,255,0.35)",
              flex: "0 0 auto",
            }}
          />
          <p style={{ margin: 0, opacity: 0.9, lineHeight: "18px", fontSize: 14 }}>
            Here is the current live matchups. Be sure to follow{" "}
            <a
              href="https://www.instagram.com/beckettvisuals/"
              target="_blank"
              rel="noreferrer"
              style={linkStyle}
            >
              @beckettvisuals
            </a>{" "}
            on instagram for updates and{" "}
            <a
              href="https://www.instagram.com/charlie.richards13/"
              target="_blank"
              rel="noreferrer"
              style={linkStyle}
            >
              @charlie.richards13
            </a>{" "}
            for software development inquiries
          </p>
        </div>
      </div>
    </div>
  );
}

function HomeButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "10px 12px",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.35)",
        background: "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(0,0,0,0.35))",
        color: "#fff",
        cursor: "pointer",
        fontWeight: 800,
        letterSpacing: 0.3,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        boxShadow: "0 8px 20px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.08) inset",
        height: 42,
        whiteSpace: "nowrap",
      }}
      title="Back to Home"
    >
      <span style={{ opacity: 0.9, fontSize: 16 }}>←</span>
      Home
    </button>
  );
}

export default function BracketPage() {
  const router = useRouter();

  const [games, setGames] = useState<Game[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  // ✅ REALTIME: subscribe to teams + games
  useEffect(() => {
    setLoading(true);
    setMsg("");

    let gotGames = false;
    let gotTeams = false;

    const maybeDone = () => {
      if (gotGames && gotTeams) setLoading(false);
    };

    const teamsCol = collection(db, "tournaments", TOURNAMENT_ID, "teams");
    const gamesCol = collection(db, "tournaments", TOURNAMENT_ID, "games");

    const unsubTeams = onSnapshot(
      teamsCol,
      (snap) => {
        const rows = snap.docs.map((d) => normalizeTeam(d.id, d.data()));
        rows.sort(
          (a, b) => (a.seed ?? 999) - (b.seed ?? 999) || a.name.localeCompare(b.name)
        );
        setTeams(rows);
        gotTeams = true;
        maybeDone();
      },
      (err) => {
        console.error(err);
        setMsg("Error loading teams (realtime). Check console.");
        gotTeams = true;
        maybeDone();
      }
    );

    const unsubGames = onSnapshot(
      gamesCol,
      (snap) => {
        const rows = snap.docs.map((d) => normalizeGame(d.id, d.data()));
        rows.sort((a, b) => a.round - b.round || a.game - b.game);
        setGames(rows);
        gotGames = true;
        maybeDone();
      },
      (err) => {
        console.error(err);
        setMsg("Error loading games (realtime). Check console.");
        gotGames = true;
        maybeDone();
      }
    );

    return () => {
      unsubTeams();
      unsubGames();
    };
  }, []);

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

  if (loading) {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui", color: "#fff" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Header />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <HomeButton onClick={() => router.push("/")} />
          </div>
        </div>

        <p style={{ marginTop: 14, opacity: 0.85 }}>Loading…</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui", color: "#fff" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Header />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <HomeButton onClick={() => router.push("/")} />
        </div>
      </div>

      {msg && <div style={{ marginTop: 10 }}>{msg}</div>}

      <div
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
            style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
          >
            {connectorPaths.map((d, i) => (
              <path key={i} d={d} fill="none" stroke="#444" strokeWidth={2} />
            ))}
          </svg>

          {/* Cards */}
          {positionedGames.map(({ game, x, y }) => (
            <div key={game.id} style={{ position: "absolute", left: x, top: y }}>
              <GameCard game={game} teamMap={teamMap} />
            </div>
          ))}

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

// AZ High School Bracket - Created by Charles Richards 2026
// ASU Computer Science (Cybersecurity) BS 2028
