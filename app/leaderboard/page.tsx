// this will be the leaderboard page... remind me to get code for creds

// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { listGames, Game } from "../../lib/games";

// // ✅ Adjust this import ONLY if your firebase file name/path differs.
// // Most setups already have something like this:
// import { db } from "../../lib/firebase";

// import { collection, getDocs } from "firebase/firestore";

// const TOURNAMENT_ID = "azhs-2026";

// // March-Madness style scoring (change if you want)
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

// function fmtTime(ts: any) {
//   try {
//     if (!ts) return "";
//     if (typeof ts?.toDate === "function") return ts.toDate().toLocaleString();
//     return String(ts);
//   } catch {
//     return "";
//   }
// }

// export default function LeaderboardPage() {
//   const [games, setGames] = useState<Game[]>([]);
//   const [entries, setEntries] = useState<
//     (EntryDoc & { id: string })[]
//   >([]);
//   const [loading, setLoading] = useState(true);
//   const [msg, setMsg] = useState("");

//   useEffect(() => {
//     async function run() {
//       setLoading(true);
//       setMsg("");
//       try {
//         const [g] = await Promise.all([listGames()]);
//         setGames(g);

//         const snap = await getDocs(
//           collection(db, `tournaments/${TOURNAMENT_ID}/entries`)
//         );

//         const all = snap.docs.map((d) => ({
//           id: d.id,
//           ...(d.data() as EntryDoc),
//         }));

//         // Leaderboard usually only shows locked (submitted) brackets
//         const lockedOnly = all.filter((e) => e.locked === true);

//         setEntries(lockedOnly);
//       } catch (e) {
//         console.error(e);
//         setMsg("Error loading leaderboard. Check console/rules.");
//       } finally {
//         setLoading(false);
//       }
//     }
//     run();
//   }, []);

//   const gameById = useMemo(() => {
//     const m = new Map<string, Game>();
//     for (const g of games) m.set(g.id, g);
//     return m;
//   }, [games]);

//   const decidedGames = useMemo(() => {
//     return games.filter((g) => !!g.winnerId);
//   }, [games]);

//   const rows = useMemo(() => {
//     const out = entries.map((e) => {
//       const picks = e.picks || {};
//       let score = 0;
//       let correct = 0;

//       for (const g of decidedGames) {
//         const pick = picks[g.id];
//         if (pick && g.winnerId && pick === g.winnerId) {
//           correct += 1;
//           score += POINTS_BY_ROUND[g.round] ?? 1;
//         }
//       }

//       const pickedCount = Object.keys(picks).length;

//       return {
//         id: e.id,
//         displayName: e.displayName || e.id,
//         score,
//         correct,
//         decided: decidedGames.length,
//         pickedCount,
//         updatedAt: e.updatedAt,
//         createdAt: e.createdAt,
//       };
//     });

//     // Sort: highest score first, then most correct, then earliest submit/update
//     out.sort((a, b) => {
//       if (b.score !== a.score) return b.score - a.score;
//       if (b.correct !== a.correct) return b.correct - a.correct;

//       const at = a.updatedAt?.seconds ?? a.createdAt?.seconds ?? 0;
//       const bt = b.updatedAt?.seconds ?? b.createdAt?.seconds ?? 0;
//       return at - bt;
//     });

//     return out;
//   }, [entries, decidedGames]);

//   if (loading) {
//     return (
//       <main style={{ padding: 24, fontFamily: "system-ui" }}>
//         <h1 style={{ margin: 0 }}>Leaderboard</h1>
//         <p style={{ opacity: 0.75 }}>Loading…</p>
//       </main>
//     );
//   }

//   return (
//     <main style={{ padding: 24, fontFamily: "system-ui" }}>
//       <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
//         <h1 style={{ margin: 0 }}>Leaderboard</h1>
//         <span style={{ opacity: 0.7 }}>
//           (updates automatically as admin sets winners)
//         </span>
//       </div>

//       <p style={{ opacity: 0.75, marginTop: 8 }}>
//         Scoring: R1=1, R2=2, R3=4, R4=8, Final=16 points per correct pick.
//       </p>

//       {msg && (
//         <div style={{ marginTop: 12, color: "#ffb4b4" }}>
//           {msg}
//         </div>
//       )}

//       <div
//         style={{
//           marginTop: 16,
//           border: "1px solid #222",
//           borderRadius: 14,
//           background: "rgba(0,0,0,0.25)",
//           overflow: "hidden",
//         }}
//       >
//         <div style={{ padding: 14, borderBottom: "1px solid #1d1d1d" }}>
//           <div style={{ opacity: 0.75 }}>
//             Locked entries: <b>{rows.length}</b> &nbsp;|&nbsp; Games decided:{" "}
//             <b>{decidedGames.length}</b>/31
//           </div>
//         </div>

//         <div style={{ overflowX: "auto" }}>
//           <table
//             style={{
//               width: "100%",
//               borderCollapse: "collapse",
//               minWidth: 760,
//             }}
//           >
//             <thead>
//               <tr style={{ textAlign: "left", opacity: 0.8 }}>
//                 <th style={{ padding: "12px 14px" }}>Rank</th>
//                 <th style={{ padding: "12px 14px" }}>Name</th>
//                 <th style={{ padding: "12px 14px" }}>Score</th>
//                 <th style={{ padding: "12px 14px" }}>Correct</th>
//                 <th style={{ padding: "12px 14px" }}>Picks Made</th>
//                 <th style={{ padding: "12px 14px" }}>Last Updated</th>
//               </tr>
//             </thead>

//             <tbody>
//               {rows.map((r, idx) => (
//                 <tr
//                   key={r.id}
//                   style={{
//                     borderTop: "1px solid #1d1d1d",
//                   }}
//                 >
//                   <td style={{ padding: "12px 14px", opacity: 0.85 }}>
//                     {idx + 1}
//                   </td>
//                   <td style={{ padding: "12px 14px", fontWeight: 650 }}>
//                     {r.displayName}
//                   </td>
//                   <td style={{ padding: "12px 14px" }}>
//                     <b>{r.score}</b>
//                   </td>
//                   <td style={{ padding: "12px 14px", opacity: 0.85 }}>
//                     {r.correct}/{r.decided}
//                   </td>
//                   <td style={{ padding: "12px 14px", opacity: 0.85 }}>
//                     {r.pickedCount}/31
//                   </td>
//                   <td style={{ padding: "12px 14px", opacity: 0.7 }}>
//                     {fmtTime(r.updatedAt || r.createdAt)}
//                   </td>
//                 </tr>
//               ))}

//               {rows.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={6}
//                     style={{ padding: 16, opacity: 0.75 }}
//                   >
//                     No locked entries yet. Have people submit their bracket.
//                   </td>
//                 </tr>
//               ) : null}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <div style={{ marginTop: 16, opacity: 0.7 }}>
//         Tip: Once you start setting real winners in <b>/admin/bracket</b>, scores
//         will move immediately.
//       </div>
//     </main>
//   );
// }
// //end of LeaderboardPage component


// this will be the leaderboard page... remind me to get code for creds

// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import { listGames, Game } from "../../lib/games";

// // ✅ Adjust this import ONLY if your firebase file name/path differs.
// // Most setups already have something like this:
// import { db } from "../../lib/firebase";

// import { collection, getDocs } from "firebase/firestore";

// const TOURNAMENT_ID = "azhs-2026";

// // March-Madness style scoring (change if you want)
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

// function fmtTime(ts: any) {
//   try {
//     if (!ts) return "";
//     if (typeof ts?.toDate === "function") return ts.toDate().toLocaleString();
//     return String(ts);
//   } catch {
//     return "";
//   }
// }

// export default function LeaderboardPage() {
//   const [games, setGames] = useState<Game[]>([]);
//   const [entries, setEntries] = useState<(EntryDoc & { id: string })[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [msg, setMsg] = useState("");

//   useEffect(() => {
//     async function run() {
//       setLoading(true);
//       setMsg("");
//       try {
//         const [g] = await Promise.all([listGames()]);
//         setGames(g);

//         const snap = await getDocs(
//           collection(db, `tournaments/${TOURNAMENT_ID}/entries`)
//         );

//         const all = snap.docs.map((d) => ({
//           id: d.id,
//           ...(d.data() as EntryDoc),
//         }));

//         // Leaderboard usually only shows locked (submitted) brackets
//         const lockedOnly = all.filter((e) => e.locked === true);

//         setEntries(lockedOnly);
//       } catch (e) {
//         console.error(e);
//         setMsg("Error loading leaderboard. Check console/rules.");
//       } finally {
//         setLoading(false);
//       }
//     }
//     run();
//   }, []);

//   const gameById = useMemo(() => {
//     const m = new Map<string, Game>();
//     for (const g of games) m.set(g.id, g);
//     return m;
//   }, [games]);

//   const decidedGames = useMemo(() => {
//     return games.filter((g) => !!g.winnerId);
//   }, [games]);

//   const rows = useMemo(() => {
//     const out = entries.map((e) => {
//       const picks = e.picks || {};
//       let score = 0;
//       let correct = 0;

//       for (const g of decidedGames) {
//         const pick = picks[g.id];
//         if (pick && g.winnerId && pick === g.winnerId) {
//           correct += 1;
//           score += POINTS_BY_ROUND[g.round] ?? 1;
//         }
//       }

//       const pickedCount = Object.keys(picks).length;

//       return {
//         id: e.id,
//         displayName: e.displayName || e.id,
//         score,
//         correct,
//         decided: decidedGames.length,
//         pickedCount,
//         updatedAt: e.updatedAt,
//         createdAt: e.createdAt,
//       };
//     });

//     // Sort: highest score first, then most correct, then earliest submit/update
//     out.sort((a, b) => {
//       if (b.score !== a.score) return b.score - a.score;
//       if (b.correct !== a.correct) return b.correct - a.correct;

//       const at = a.updatedAt?.seconds ?? a.createdAt?.seconds ?? 0;
//       const bt = b.updatedAt?.seconds ?? b.createdAt?.seconds ?? 0;
//       return at - bt;
//     });

//     return out;
//   }, [entries, decidedGames]);

//   if (loading) {
//     return (
//       <main style={{ padding: 24, fontFamily: "system-ui" }}>
//         <h1 style={{ margin: 0 }}>Leaderboard</h1>
//         <p style={{ opacity: 0.75 }}>Loading…</p>
//       </main>
//     );
//   }

//   return (
//     <main style={{ padding: 24, fontFamily: "system-ui" }}>
//       <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
//         <h1 style={{ margin: 0 }}>Leaderboard</h1>
//         <span style={{ opacity: 0.7 }}>
//           (updates automatically as games progress. Click "View" to see how others are picking!)
//         </span>
//       </div>

//       <p style={{ opacity: 0.75, marginTop: 8 }}>
//         Scoring: R1=1, R2=2, R3=4, R4=8, Final=16 points per correct pick.
//       </p>

//       {msg && (
//         <div style={{ marginTop: 12, color: "#ffb4b4" }}>
//           {msg}
//         </div>
//       )}

//       <div
//         style={{
//           marginTop: 16,
//           border: "1px solid #222",
//           borderRadius: 14,
//           background: "rgba(0,0,0,0.25)",
//           overflow: "hidden",
//         }}
//       >
//         <div style={{ padding: 14, borderBottom: "1px solid #1d1d1d" }}>
//           <div style={{ opacity: 0.75 }}>
//             Locked entries: <b>{rows.length}</b> &nbsp;|&nbsp; Games decided:{" "}
//             <b>{decidedGames.length}</b>/31
//           </div>
//         </div>

//         <div style={{ overflowX: "auto" }}>
//           <table
//             style={{
//               width: "100%",
//               borderCollapse: "collapse",
//               minWidth: 860, // slightly wider to fit the new column
//             }}
//           >
//             <thead>
//               <tr style={{ textAlign: "left", opacity: 0.8 }}>
//                 <th style={{ padding: "12px 14px" }}>Rank</th>
//                 <th style={{ padding: "12px 14px" }}>Name</th>
//                 <th style={{ padding: "12px 14px" }}>Score</th>
//                 <th style={{ padding: "12px 14px" }}>Correct</th>
//                 <th style={{ padding: "12px 14px" }}>Picks Made</th>
//                 <th style={{ padding: "12px 14px" }}>Last Updated</th>
//                 <th style={{ padding: "12px 14px" }}>Bracket</th>
//               </tr>
//             </thead>

//             <tbody>
//               {rows.map((r, idx) => (
//                 <tr
//                   key={r.id}
//                   style={{
//                     borderTop: "1px solid #1d1d1d",
//                   }}
//                 >
//                   <td style={{ padding: "12px 14px", opacity: 0.85 }}>
//                     {idx + 1}
//                   </td>
//                   <td style={{ padding: "12px 14px", fontWeight: 650 }}>
//                     {r.displayName}
//                   </td>
//                   <td style={{ padding: "12px 14px" }}>
//                     <b>{r.score}</b>
//                   </td>
//                   <td style={{ padding: "12px 14px", opacity: 0.85 }}>
//                     {r.correct}/{r.decided}
//                   </td>
//                   <td style={{ padding: "12px 14px", opacity: 0.85 }}>
//                     {r.pickedCount}/31
//                   </td>
//                   <td style={{ padding: "12px 14px", opacity: 0.7 }}>
//                     {fmtTime(r.updatedAt || r.createdAt)}
//                   </td>

//                   {/* ✅ NEW: View Bracket button */}
//                   <td style={{ padding: "12px 14px" }}>
//                     <Link
//                       href={`/leaderboard/${encodeURIComponent(r.id)}`}
//                       style={{
//                         display: "inline-flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         padding: "8px 10px",
//                         borderRadius: 10,
//                         border: "1px solid rgba(255,255,255,0.22)",
//                         background: "rgba(255,255,255,0.06)",
//                         color: "#fff",
//                         textDecoration: "none",
//                         fontWeight: 650,
//                         fontSize: 13,
//                         letterSpacing: 0.2,
//                       }}
//                     >
//                       View
//                     </Link>
//                   </td>
//                 </tr>
//               ))}

//               {rows.length === 0 ? (
//                 <tr>
//                   <td colSpan={7} style={{ padding: 16, opacity: 0.75 }}>
//                     No locked entries yet. Have people submit their bracket.
//                   </td>
//                 </tr>
//               ) : null}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <div style={{ marginTop: 16, opacity: 0.7 }}>
//         Tip: Try to pick the best lineup to secure the top spot on the leaderboard!
//       </div>
//     </main>
//   );
// }
// //end of LeaderboardPage component





"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { listGames, type Game } from "../../lib/games";

// ✅ Adjust this import ONLY if your firebase file name/path differs.
import { db } from "../../lib/firebase";

import { collection, getDocs } from "firebase/firestore";

const TOURNAMENT_ID = "azhs-2026";

// March-Madness style scoring (change if you want)
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

function fmtTime(ts: any) {
  try {
    if (!ts) return "";
    if (typeof ts?.toDate === "function") return ts.toDate().toLocaleString();
    return String(ts);
  } catch {
    return "";
  }
}

export default function LeaderboardPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [entries, setEntries] = useState<(EntryDoc & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    async function run() {
      setLoading(true);
      setMsg("");
      try {
        const [g] = await Promise.all([listGames()]);
        setGames(g);

        const snap = await getDocs(
          collection(db, `tournaments/${TOURNAMENT_ID}/entries`)
        );

        const all = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as EntryDoc),
        }));

        // Leaderboard usually only shows locked (submitted) brackets
        const lockedOnly = all.filter((e) => e.locked === true);

        setEntries(lockedOnly);
      } catch (e) {
        console.error(e);
        setMsg("Error loading leaderboard. Check console/rules.");
      } finally {
        setLoading(false);
      }
    }
    run();
  }, []);

  const decidedGames = useMemo(() => {
    return games.filter((g) => !!g.winnerId);
  }, [games]);

  const rows = useMemo(() => {
    const out = entries.map((e) => {
      const picks = e.picks || {};
      let score = 0;
      let correct = 0;

      for (const g of decidedGames) {
        const pick = picks[g.id];
        if (pick && g.winnerId && pick === g.winnerId) {
          correct += 1;
          score += POINTS_BY_ROUND[g.round] ?? 1;
        }
      }

      const pickedCount = Object.keys(picks).length;

      return {
        id: e.id,
        displayName: e.displayName || e.id,
        score,
        correct,
        decided: decidedGames.length,
        pickedCount,
        updatedAt: e.updatedAt,
        createdAt: e.createdAt,
      };
    });

    // Sort: highest score first, then most correct, then earliest submit/update
    out.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.correct !== a.correct) return b.correct - a.correct;

      const at = a.updatedAt?.seconds ?? a.createdAt?.seconds ?? 0;
      const bt = b.updatedAt?.seconds ?? b.createdAt?.seconds ?? 0;
      return at - bt;
    });

    return out;
  }, [entries, decidedGames]);

  if (loading) {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui" }}>
        <h1 style={{ margin: 0 }}>Leaderboard</h1>
        <p style={{ opacity: 0.75 }}>Loading…</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      {/* Header row with Home button */}
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
          <h1 style={{ margin: 0 }}>Leaderboard</h1>
          <span style={{ opacity: 0.7 }}>
            (updates automatically as games progress. Click "View" to see how
            others are picking!)
          </span>
        </div>

        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px 12px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.28)",
            background: "rgba(0,0,0,0.28)",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 750,
            letterSpacing: 0.2,
          }}
        >
          ← Home
        </Link>
      </div>

      <p style={{ opacity: 0.75, marginTop: 10 }}>
        Scoring: R1=1, R2=2, R3=4, R4=8, Final=16 points per correct pick.
      </p>

      {msg && <div style={{ marginTop: 12, color: "#ffb4b4" }}>{msg}</div>}

      <div
        style={{
          marginTop: 16,
          border: "1px solid #222",
          borderRadius: 14,
          background: "rgba(0,0,0,0.25)",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: 14, borderBottom: "1px solid #1d1d1d" }}>
          <div style={{ opacity: 0.75 }}>
            Locked entries: <b>{rows.length}</b> &nbsp;|&nbsp; Games decided:{" "}
            <b>{decidedGames.length}</b>/31
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: 860,
            }}
          >
            <thead>
              <tr style={{ textAlign: "left", opacity: 0.8 }}>
                <th style={{ padding: "12px 14px" }}>Rank</th>
                <th style={{ padding: "12px 14px" }}>Name</th>
                <th style={{ padding: "12px 14px" }}>Score</th>
                <th style={{ padding: "12px 14px" }}>Correct</th>
                <th style={{ padding: "12px 14px" }}>Picks Made</th>
                <th style={{ padding: "12px 14px" }}>Last Updated</th>
                <th style={{ padding: "12px 14px" }}>Bracket</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r, idx) => (
                <tr key={r.id} style={{ borderTop: "1px solid #1d1d1d" }}>
                  <td style={{ padding: "12px 14px", opacity: 0.85 }}>
                    {idx + 1}
                  </td>
                  <td style={{ padding: "12px 14px", fontWeight: 650 }}>
                    {r.displayName}
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <b>{r.score}</b>
                  </td>
                  <td style={{ padding: "12px 14px", opacity: 0.85 }}>
                    {r.correct}/{r.decided}
                  </td>
                  <td style={{ padding: "12px 14px", opacity: 0.85 }}>
                    {r.pickedCount}/31
                  </td>
                  <td style={{ padding: "12px 14px", opacity: 0.7 }}>
                    {fmtTime(r.updatedAt || r.createdAt)}
                  </td>

                  <td style={{ padding: "12px 14px" }}>
                    <Link
                      href={`/leaderboard/${encodeURIComponent(r.id)}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "8px 10px",
                        borderRadius: 10,
                        border: "1px solid rgba(255,255,255,0.22)",
                        background: "rgba(255,255,255,0.06)",
                        color: "#fff",
                        textDecoration: "none",
                        fontWeight: 650,
                        fontSize: 13,
                        letterSpacing: 0.2,
                      }}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}

              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: 16, opacity: 0.75 }}>
                    No locked entries yet. Have people submit their bracket.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: 16, opacity: 0.7 }}>
        Tip: Try to pick the best lineup to secure the top spot on the
        leaderboard!
      </div>
    </main>
  );
}
// end of LeaderboardPage component
