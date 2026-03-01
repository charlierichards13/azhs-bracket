// // this is a wip page for people to predict props on various players


// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import {
//   GoogleAuthProvider,
//   onAuthStateChanged,
//   signInWithPopup,
//   signOut,
//   type User,
// } from "firebase/auth";
// import { collection, doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
// import { auth, db } from "@/lib/firebase";
// import { TOURNAMENT_ID } from "@/lib/tournament";

// type PlayerPropDoc = {
//   playerName?: string;
//   teamName?: string;
//   statKey?: string; // "points" | "assists" | "rebounds" | ...
//   line?: number; // e.g., 22.5
//   active?: boolean;
//   order?: number;
//   notes?: string;
//   updatedAt?: any;
//   createdAt?: any;
// };

// type PlayerProp = PlayerPropDoc & { id: string };

// type PickDoc = {
//   choice?: "over" | "under";
//   propId?: string;
//   updatedAt?: any;
//   createdAt?: any;
// };

// function statLabel(statKey?: string) {
//   switch (statKey) {
//     case "points":
//       return "Points";
//     case "assists":
//       return "Assists";
//     case "rebounds":
//       return "Rebounds";
//     case "threes":
//       return "3PT Made";
//     case "steals":
//       return "Steals";
//     case "blocks":
//       return "Blocks";
//     case "pra":
//       return "P+R+A";
//     default:
//       return statKey || "Stat";
//   }
// }

// export default function PlayerPropsPage() {
//   const [user, setUser] = useState<User | null>(null);
//   const [checkingAuth, setCheckingAuth] = useState(true);

//   const [props, setProps] = useState<PlayerProp[]>([]);
//   const [picks, setPicks] = useState<Record<string, "over" | "under">>({});

//   const [status, setStatus] = useState("");

//   // Auth
//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (u) => {
//       setUser(u);
//       setCheckingAuth(false);
//     });
//     return () => unsub();
//   }, []);

//   // Subscribe to props (public)
//   useEffect(() => {
//     const ref = collection(db, "tournaments", TOURNAMENT_ID, "playerProps");
//     const unsub = onSnapshot(
//       ref,
//       (snap) => {
//         const rows: PlayerProp[] = snap.docs.map((d) => ({
//           id: d.id,
//           ...(d.data() as PlayerPropDoc),
//         }));
//         setProps(rows);
//       },
//       (err) => {
//         console.error(err);
//         setStatus("Could not load props right now.");
//       }
//     );

//     return () => unsub();
//   }, []);

//   // Subscribe to current user's picks
//   useEffect(() => {
//     if (!user) {
//       setPicks({});
//       return;
//     }

//     const ref = collection(
//       db,
//       "tournaments",
//       TOURNAMENT_ID,
//       "playerPropPicks",
//       user.uid,
//       "picks"
//     );

//     const unsub = onSnapshot(
//       ref,
//       (snap) => {
//         const m: Record<string, "over" | "under"> = {};
//         snap.docs.forEach((d) => {
//           const data = d.data() as PickDoc;
//           if (data.choice === "over" || data.choice === "under") {
//             m[d.id] = data.choice;
//           }
//         });
//         setPicks(m);
//       },
//       (err) => {
//         console.error(err);
//         setStatus("Could not load your picks.");
//       }
//     );

//     return () => unsub();
//   }, [user]);

//   const activeProps = useMemo(() => {
//     return props
//       .filter((p) => p.active !== false)
//       .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
//   }, [props]);

//   async function doSignIn() {
//     setStatus("");
//     try {
//       await signInWithPopup(auth, new GoogleAuthProvider());
//     } catch (e: any) {
//       setStatus(`Sign-in failed: ${e?.message ?? String(e)}`);
//     }
//   }

//   async function doSignOut() {
//     setStatus("");
//     try {
//       await signOut(auth);
//     } catch (e: any) {
//       setStatus(`Sign-out failed: ${e?.message ?? String(e)}`);
//     }
//   }

//   async function pick(propId: string, choice: "over" | "under") {
//     setStatus("");
//     if (!user) {
//       setStatus("Please sign in to submit a prop pick.");
//       return;
//     }

//     try {
//       const ref = doc(
//         db,
//         "tournaments",
//         TOURNAMENT_ID,
//         "playerPropPicks",
//         user.uid,
//         "picks",
//         propId
//       );

//       await setDoc(
//         ref,
//         {
//           propId,
//           choice,
//           updatedAt: serverTimestamp(),
//           createdAt: serverTimestamp(),
//         } satisfies PickDoc,
//         { merge: true }
//       );

//       setStatus("✅ Saved.");
//     } catch (e) {
//       console.error(e);
//       setStatus("Could not save your pick (check rules / permissions).");
//     }
//   }

//   return (
//     <main style={{ padding: 22, maxWidth: 960, margin: "0 auto", fontFamily: "system-ui" }}>
//       <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
//         <div>
//           <h1 style={{ margin: 0 }}>📊 Player Props</h1>
//           <div style={{ marginTop: 6, opacity: 0.8 }}>
//             Try your hand at predicting player props for the finals! These are separate from the main bracket and scored independently, so feel free to participate even if you’re not confident in your bracket picks.
//           </div>
//         </div>

//         <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
//           <Link href="/" style={{ textDecoration: "none", opacity: 0.9 }}>
//             ← Home
//           </Link>

//           {checkingAuth ? (
//             <span style={{ opacity: 0.75 }}>Checking auth…</span>
//           ) : user ? (
//             <>
//               <span style={{ opacity: 0.9 }}>
//                 Signed in as <b>{user.displayName || user.email || "User"}</b>
//               </span>
//               <button onClick={doSignOut} style={btn()}>
//                 Sign out
//               </button>
//             </>
//           ) : (
//             <button onClick={doSignIn} style={btn(true)}>
//               Sign in with Google
//             </button>
//           )}
//         </div>
//       </div>

//       {status ? (
//         <div style={{ marginTop: 12, padding: 10, border: "1px solid rgba(0,0,0,0.10)", borderRadius: 12 }}>
//           {status}
//         </div>
//       ) : null}

//       <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
//         {activeProps.length === 0 ? (
//           <div style={{ opacity: 0.8, padding: 14, border: "1px solid rgba(0,0,0,0.10)", borderRadius: 14 }}>
//             No props posted yet. Check back soon.
//           </div>
//         ) : (
//           activeProps.map((p) => {
//             const chosen = picks[p.id];
//             const title = `${p.playerName || "Player"}${p.teamName ? ` (${p.teamName})` : ""}`;
//             const lineText =
//               typeof p.line === "number" ? p.line.toString() : p.line ? String(p.line) : "—";

//             return (
//               <div
//                 key={p.id}
//                 style={{
//                   border: "1px solid rgba(0,0,0,0.10)",
//                   borderRadius: 16,
//                   padding: 14,
//                   background: "rgba(0,0,0,0.02)",
//                 }}
//               >
//                 <div style={{ fontWeight: 900, fontSize: 16 }}>{title}</div>
//                 <div style={{ marginTop: 6, opacity: 0.85 }}>
//                   <b>{statLabel(p.statKey)}</b> O/U <b>{lineText}</b>
//                 </div>
//                 {p.notes ? <div style={{ marginTop: 6, opacity: 0.75, fontSize: 13 }}>{p.notes}</div> : null}

//                 <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
//                   <button
//                     onClick={() => pick(p.id, "over")}
//                     style={pickBtn(chosen === "over")}
//                   >
//                     Over
//                   </button>
//                   <button
//                     onClick={() => pick(p.id, "under")}
//                     style={pickBtn(chosen === "under")}
//                   >
//                     Under
//                   </button>

//                   {chosen ? (
//                     <div style={{ alignSelf: "center", opacity: 0.8, fontSize: 13 }}>
//                       Your pick: <b>{chosen.toUpperCase()}</b>
//                     </div>
//                   ) : (
//                     <div style={{ alignSelf: "center", opacity: 0.7, fontSize: 13 }}>
//                       No pick yet
//                     </div>
//                   )}
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>

//       <div style={{ marginTop: 18, opacity: 0.7, fontSize: 12, lineHeight: "18px" }}>
//         Note: This competition is separate from the bracket challenge. We do not condone/encourage gambling and are not allowing cash prizes on this website. Charlie Richards and Greyson Beckett assume no responsibility for any bets placed based on the content of this page. This is just for fun and bragging rights!
//       </div>
//     </main>
//   );
// }

// function btn(primary = false): React.CSSProperties {
//   return {
//     padding: "10px 14px",
//     borderRadius: 12,
//     border: primary ? "1px solid rgba(43,92,255,0.35)" : "1px solid rgba(0,0,0,0.18)",
//     background: primary ? "rgba(43,92,255,0.08)" : "rgba(0,0,0,0.06)",
//     cursor: "pointer",
//     fontWeight: 800,
//   };
// }

// function pickBtn(active: boolean): React.CSSProperties {
//   return {
//     padding: "10px 14px",
//     borderRadius: 12,
//     border: active ? "1px solid rgba(31,122,58,0.45)" : "1px solid rgba(0,0,0,0.18)",
//     background: active ? "rgba(31,122,58,0.12)" : "rgba(0,0,0,0.06)",
//     cursor: "pointer",
//     fontWeight: 900,
//   };
// }



// upgraded UI, adding leaderboard, and more info about the props on the main page (instead of a separate page) --- IGNORE ---

// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import {
//   GoogleAuthProvider,
//   onAuthStateChanged,
//   signInWithPopup,
//   signOut,
//   type User,
// } from "firebase/auth";
// import {
//   collection,
//   doc,
//   onSnapshot,
//   serverTimestamp,
//   setDoc,
//   updateDoc,
// } from "firebase/firestore";
// import { auth, db } from "@/lib/firebase";
// import { TOURNAMENT_ID } from "@/lib/tournament";

// type PlayerPropDoc = {
//   playerName?: string;
//   teamName?: string;
//   statKey?: string; // "points" | "assists" | "rebounds" | ...
//   line?: number; // e.g., 22.5
//   active?: boolean;
//   order?: number;
//   notes?: string;
//   updatedAt?: any;
//   createdAt?: any;
// };

// type PlayerProp = PlayerPropDoc & { id: string };

// type PickDoc = {
//   choice?: "over" | "under";
//   propId?: string;
//   updatedAt?: any;
//   createdAt?: any;
// };

// // Public leaderboard doc (one per user)
// type PropsLeaderboardDoc = {
//   userId?: string;
//   displayName?: string;
//   picks?: Record<string, "over" | "under">;
//   updatedAt?: any;
//   createdAt?: any;
// };

// function statLabel(statKey?: string) {
//   switch (statKey) {
//     case "points":
//       return "Points";
//     case "assists":
//       return "Assists";
//     case "rebounds":
//       return "Rebounds";
//     case "threes":
//       return "3PT Made";
//     case "steals":
//       return "Steals";
//     case "blocks":
//       return "Blocks";
//     case "pra":
//       return "P+R+A";
//     default:
//       return statKey || "Stat";
//   }
// }

// function statEmoji(statKey?: string) {
//   switch (statKey) {
//     case "points":
//       return "🏀";
//     case "assists":
//       return "🤝";
//     case "rebounds":
//       return "🧱";
//     case "threes":
//       return "🎯";
//     case "steals":
//       return "🕵️";
//     case "blocks":
//       return "🚫";
//     case "pra":
//       return "📦";
//     default:
//       return "📊";
//   }
// }

// function fmtPct(n: number) {
//   if (!Number.isFinite(n)) return "0%";
//   return `${Math.round(n)}%`;
// }

// export default function PlayerPropsPage() {
//   const [user, setUser] = useState<User | null>(null);
//   const [checkingAuth, setCheckingAuth] = useState(true);

//   const [props, setProps] = useState<PlayerProp[]>([]);
//   const [picks, setPicks] = useState<Record<string, "over" | "under">>({});

//   // leaderboard docs (for community lean)
//   const [lbUsers, setLbUsers] = useState<(PropsLeaderboardDoc & { id: string })[]>([]);
//   const [status, setStatus] = useState("");

//   // UI controls
//   const [search, setSearch] = useState("");
//   const [statFilter, setStatFilter] = useState<string>("all");
//   const [showUnpickedOnly, setShowUnpickedOnly] = useState(false);

//   // Auth
//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (u) => {
//       setUser(u);
//       setCheckingAuth(false);
//     });
//     return () => unsub();
//   }, []);

//   // Subscribe to props (public)
//   useEffect(() => {
//     const ref = collection(db, "tournaments", TOURNAMENT_ID, "playerProps");
//     const unsub = onSnapshot(
//       ref,
//       (snap) => {
//         const rows: PlayerProp[] = snap.docs.map((d) => ({
//           id: d.id,
//           ...(d.data() as PlayerPropDoc),
//         }));
//         setProps(rows);
//       },
//       (err) => {
//         console.error(err);
//         setStatus("Could not load props right now.");
//       }
//     );

//     return () => unsub();
//   }, []);

//   // Subscribe to current user's private picks
//   useEffect(() => {
//     if (!user) {
//       setPicks({});
//       return;
//     }

//     const ref = collection(
//       db,
//       "tournaments",
//       TOURNAMENT_ID,
//       "playerPropPicks",
//       user.uid,
//       "picks"
//     );

//     const unsub = onSnapshot(
//       ref,
//       (snap) => {
//         const m: Record<string, "over" | "under"> = {};
//         snap.docs.forEach((d) => {
//           const data = d.data() as PickDoc;
//           if (data.choice === "over" || data.choice === "under") {
//             m[d.id] = data.choice;
//           }
//         });
//         setPicks(m);
//       },
//       (err) => {
//         console.error(err);
//         setStatus("Could not load your picks.");
//       }
//     );

//     return () => unsub();
//   }, [user]);

//   // Subscribe to public props leaderboard docs (for community lean)
//   useEffect(() => {
//     const ref = collection(db, "tournaments", TOURNAMENT_ID, "playerPropLeaderboard");
//     const unsub = onSnapshot(
//       ref,
//       (snap) => {
//         const rows = snap.docs.map((d) => ({
//           id: d.id,
//           ...(d.data() as PropsLeaderboardDoc),
//         }));
//         setLbUsers(rows);
//       },
//       (err) => {
//         console.error(err);
//         // Don't block the page if this fails — just hide community bars.
//       }
//     );

//     return () => unsub();
//   }, []);

//   const activeProps = useMemo(() => {
//     return props
//       .filter((p) => p.active !== false)
//       .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
//   }, [props]);

//   const filteredProps = useMemo(() => {
//     const q = search.trim().toLowerCase();
//     return activeProps.filter((p) => {
//       const chosen = picks[p.id];
//       if (showUnpickedOnly && chosen) return false;

//       if (statFilter !== "all" && (p.statKey || "") !== statFilter) return false;

//       if (!q) return true;
//       const hay = `${p.playerName || ""} ${p.teamName || ""} ${p.statKey || ""} ${p.notes || ""}`.toLowerCase();
//       return hay.includes(q);
//     });
//   }, [activeProps, picks, search, showUnpickedOnly, statFilter]);

//   const yourPickCount = useMemo(() => Object.keys(picks).length, [picks]);

//   // Community lean: count over/under across public leaderboard docs
//   const communityCounts = useMemo(() => {
//     const map: Record<string, { over: number; under: number }> = {};
//     for (const u of lbUsers) {
//       const up = u.picks || {};
//       for (const [propId, choice] of Object.entries(up)) {
//         if (choice !== "over" && choice !== "under") continue;
//         map[propId] ||= { over: 0, under: 0 };
//         map[propId]![choice] += 1;
//       }
//     }
//     return map;
//   }, [lbUsers]);

//   async function doSignIn() {
//     setStatus("");
//     try {
//       await signInWithPopup(auth, new GoogleAuthProvider());
//     } catch (e: any) {
//       setStatus(`Sign-in failed: ${e?.message ?? String(e)}`);
//     }
//   }

//   async function doSignOut() {
//     setStatus("");
//     try {
//       await signOut(auth);
//     } catch (e: any) {
//       setStatus(`Sign-out failed: ${e?.message ?? String(e)}`);
//     }
//   }

//   async function pick(propId: string, choice: "over" | "under") {
//     setStatus("");
//     if (!user) {
//       setStatus("Please sign in to submit a prop pick.");
//       return;
//     }

//     try {
//       // 1) Private pick doc (your current system)
//       const ref = doc(
//         db,
//         "tournaments",
//         TOURNAMENT_ID,
//         "playerPropPicks",
//         user.uid,
//         "picks",
//         propId
//       );

//       await setDoc(
//         ref,
//         {
//           propId,
//           choice,
//           updatedAt: serverTimestamp(),
//           createdAt: serverTimestamp(),
//         } satisfies PickDoc,
//         { merge: true }
//       );

//       // 2) Public leaderboard doc (so others can view picks live)
//       const lbRef = doc(db, "tournaments", TOURNAMENT_ID, "playerPropLeaderboard", user.uid);

//       // ensure doc exists + keep displayName
//       await setDoc(
//         lbRef,
//         {
//           userId: user.uid,
//           displayName: user.displayName || user.email || user.uid,
//           updatedAt: serverTimestamp(),
//           createdAt: serverTimestamp(),
//         } satisfies PropsLeaderboardDoc,
//         { merge: true }
//       );

//       // update the specific pick in a map field
//       await updateDoc(lbRef, {
//         [`picks.${propId}`]: choice,
//         updatedAt: serverTimestamp(),
//       } as any);

//       setStatus("✅ Saved.");
//     } catch (e: any) {
//       console.error(e);
//       setStatus(`Could not save your pick (${e?.code ?? "error"}). Check rules.`);
//     }
//   }

//   const statOptions = useMemo(() => {
//     const s = new Set<string>();
//     for (const p of activeProps) if (p.statKey) s.add(p.statKey);
//     return Array.from(s).sort();
//   }, [activeProps]);

//   return (
//     <main className="wrap">
//       <div className="stage">
//         <div className="bgSpotlights" aria-hidden="true" />
//         <div className="bgVignette" aria-hidden="true" />

//         <header className="hero">
//           <div className="top">
//             <div>
//               <div className="kicker">AZ Road to Open</div>
//               <h1 className="h1">📊 Player Props</h1>
//               <div className="sub">
//                 Predict player props (Over/Under) for the semifinals & finals. Separate from the
//                 bracket leaderboard — just for fun + bragging rights.
//               </div>

//               <div className="metaRow">
//                 <div className="pill">
//                   Props live: <b>{activeProps.length}</b>
//                 </div>
//                 <div className="pill">
//                   Your picks: <b>{yourPickCount}</b>
//                 </div>
//                 <div className="pill">
//                   Players picking: <b>{lbUsers.length}</b>
//                 </div>
//               </div>
//             </div>

//             <div className="actions">
//               <Link className="btn btnGhost" href="/">
//                 ← Home
//               </Link>

//               <Link className="btn btnBlue" href="/player-props/leaderboard">
//                 Leaderboard →
//               </Link>

//               {checkingAuth ? (
//                 <div className="mutedSmall">Checking auth…</div>
//               ) : user ? (
//                 <>
//                   <div className="who">
//                     Signed in as <b>{user.displayName || user.email || "User"}</b>
//                   </div>
//                   <button className="btn btnGhost" onClick={doSignOut}>
//                     Sign out
//                   </button>
//                 </>
//               ) : (
//                 <button className="btn btnBlue" onClick={doSignIn}>
//                   Sign in with Google
//                 </button>
//               )}
//             </div>
//           </div>

//           {status ? <div className="status">{status}</div> : null}

//           <section className="controls">
//             <input
//               className="input"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search player / team / stat…"
//             />

//             <select className="input" value={statFilter} onChange={(e) => setStatFilter(e.target.value)}>
//               <option value="all">All stats</option>
//               {statOptions.map((s) => (
//                 <option key={s} value={s}>
//                   {statLabel(s)}
//                 </option>
//               ))}
//             </select>

//             <label className="check">
//               <input
//                 type="checkbox"
//                 checked={showUnpickedOnly}
//                 onChange={(e) => setShowUnpickedOnly(e.target.checked)}
//               />
//               <span>Show unpicked only</span>
//             </label>

//             <button className="btn btnGhost" onClick={() => { setSearch(""); setStatFilter("all"); setShowUnpickedOnly(false); }}>
//               Clear
//             </button>
//           </section>

//           <section className="grid">
//             {filteredProps.length === 0 ? (
//               <div className="empty">
//                 No props match your filters yet. Try clearing search or switching stats.
//               </div>
//             ) : (
//               filteredProps.map((p) => {
//                 const chosen = picks[p.id];
//                 const title = `${p.playerName || "Player"}${p.teamName ? ` (${p.teamName})` : ""}`;
//                 const lineText =
//                   typeof p.line === "number" ? p.line.toString() : p.line ? String(p.line) : "—";

//                 const cc = communityCounts[p.id] || { over: 0, under: 0 };
//                 const total = cc.over + cc.under;
//                 const overPct = total > 0 ? (cc.over / total) * 100 : 0;
//                 const underPct = total > 0 ? (cc.under / total) * 100 : 0;

//                 return (
//                   <div key={p.id} className="card">
//                     <div className="cardTop">
//                       <div className="cardTitle">{title}</div>

//                       <div className="miniPills">
//                         <span className="mini">
//                           {statEmoji(p.statKey)} <b>{statLabel(p.statKey)}</b>
//                         </span>
//                         <span className="mini">
//                           O/U <b>{lineText}</b>
//                         </span>
//                       </div>
//                     </div>

//                     {p.notes ? <div className="notes">{p.notes}</div> : null}

//                     <div className="btnRow">
//                       <button
//                         className={`pick ${chosen === "over" ? "pickOn" : ""}`}
//                         onClick={() => pick(p.id, "over")}
//                       >
//                         Over
//                       </button>
//                       <button
//                         className={`pick ${chosen === "under" ? "pickOn" : ""}`}
//                         onClick={() => pick(p.id, "under")}
//                       >
//                         Under
//                       </button>

//                       <div className="yourPick">
//                         {chosen ? (
//                           <>
//                             Your pick: <b>{chosen.toUpperCase()}</b>
//                           </>
//                         ) : (
//                           <span className="mutedSmall">No pick yet</span>
//                         )}
//                       </div>
//                     </div>

//                     {/* Community lean bar (only if at least 1 vote exists) */}
//                     {total > 0 ? (
//                       <div className="lean">
//                         <div className="leanHead">
//                           <span className="mutedSmall">Community lean</span>
//                           <span className="mutedSmall">
//                             Over {fmtPct(overPct)} · Under {fmtPct(underPct)} · Votes {total}
//                           </span>
//                         </div>
//                         <div className="bar">
//                           <div className="barOver" style={{ width: `${overPct}%` }} />
//                           <div className="barUnder" style={{ width: `${underPct}%` }} />
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="lean mutedSmall">No community votes yet.</div>
//                     )}
//                   </div>
//                 );
//               })
//             )}
//           </section>

//           <footer className="disclaimer">
//             Note: This is separate from the bracket challenge. No gambling/cash prizes. Charlie Richards and
//             Greyson Beckett assume no responsibility for any bets placed — this is for fun + bragging rights.
//           </footer>
//         </header>
//       </div>

//       <style jsx>{`
//         .wrap {
//           padding: 26px 18px 110px;
//           display: flex;
//           justify-content: center;
//           color: #fff;
//         }
//         .stage {
//           width: 100%;
//           max-width: 1120px;
//           position: relative;
//           border-radius: 22px;
//           overflow: hidden;
//           border: 1px solid rgba(255, 255, 255, 0.10);
//           background: rgba(0, 0, 0, 0.35);
//           box-shadow: 0 30px 80px rgba(0, 0, 0, 0.55);
//         }
//         .bgSpotlights {
//           position: absolute;
//           inset: 0;
//           background:
//             radial-gradient(900px 520px at 18% 10%, rgba(255,255,255,0.10), rgba(255,255,255,0) 60%),
//             radial-gradient(820px 520px at 78% 18%, rgba(120,255,170,0.10), rgba(255,255,255,0) 58%),
//             radial-gradient(980px 620px at 50% 0%, rgba(100,170,255,0.10), rgba(255,255,255,0) 62%),
//             linear-gradient(to bottom, rgba(255,255,255,0.04), rgba(0,0,0,0.35));
//           pointer-events: none;
//         }
//         .bgVignette {
//           position: absolute;
//           inset: 0;
//           background: radial-gradient(1200px 700px at 50% 10%, rgba(0,0,0,0), rgba(0,0,0,0.70));
//           pointer-events: none;
//         }
//         .hero {
//           position: relative;
//           padding: 22px;
//         }

//         .top {
//           display: flex;
//           justify-content: space-between;
//           gap: 16px;
//           flex-wrap: wrap;
//           align-items: flex-start;
//         }
//         .kicker {
//           font-size: 12px;
//           letter-spacing: 1px;
//           opacity: 0.75;
//           text-transform: uppercase;
//         }
//         .h1 {
//           margin: 6px 0 0;
//           font-size: 28px;
//           font-weight: 900;
//           letter-spacing: 0.2px;
//         }
//         .sub {
//           margin-top: 8px;
//           opacity: 0.82;
//           max-width: 760px;
//           line-height: 22px;
//         }
//         .metaRow {
//           display: flex;
//           gap: 10px;
//           flex-wrap: wrap;
//           margin-top: 12px;
//         }
//         .pill {
//           border: 1px solid rgba(255,255,255,0.14);
//           background: rgba(255,255,255,0.06);
//           padding: 8px 10px;
//           border-radius: 999px;
//           font-size: 13px;
//           opacity: 0.92;
//         }

//         .actions {
//           display: flex;
//           gap: 10px;
//           flex-wrap: wrap;
//           align-items: center;
//           justify-content: flex-end;
//         }
//         .who {
//           opacity: 0.9;
//           font-size: 13px;
//         }
//         .mutedSmall {
//           opacity: 0.72;
//           font-size: 12px;
//         }

//         .btn {
//           border-radius: 12px;
//           padding: 10px 12px;
//           border: 1px solid rgba(255,255,255,0.24);
//           background: rgba(0,0,0,0.22);
//           color: #fff;
//           text-decoration: none;
//           font-weight: 800;
//           cursor: pointer;
//           transition: transform 120ms ease, background 120ms ease, border 120ms ease;
//         }
//         .btn:hover {
//           transform: translateY(-1px);
//         }
//         .btnBlue {
//           border-color: rgba(43,92,255,0.55);
//           background: rgba(43,92,255,0.16);
//         }
//         .btnGhost {
//           border-color: rgba(255,255,255,0.22);
//           background: rgba(0,0,0,0.22);
//         }

//         .status {
//           margin-top: 14px;
//           padding: 10px 12px;
//           border-radius: 14px;
//           border: 1px solid rgba(255,255,255,0.12);
//           background: rgba(0,0,0,0.25);
//           color: rgba(183,255,183,0.95);
//           font-size: 13px;
//           line-height: 18px;
//         }

//         .controls {
//           margin-top: 14px;
//           display: grid;
//           grid-template-columns: 1fr 220px auto auto;
//           gap: 10px;
//           align-items: center;
//         }
//         .input {
//           width: 100%;
//           padding: 10px 12px;
//           border-radius: 12px;
//           border: 1px solid rgba(255,255,255,0.18);
//           background: rgba(0,0,0,0.25);
//           color: #fff;
//           outline: none;
//           font-weight: 650;
//         }
//         .check {
//           display: inline-flex;
//           gap: 8px;
//           align-items: center;
//           font-size: 13px;
//           opacity: 0.9;
//           user-select: none;
//         }

//         .grid {
//           margin-top: 14px;
//           display: grid;
//           grid-template-columns: repeat(2, minmax(0, 1fr));
//           gap: 12px;
//         }

//         .empty {
//           grid-column: 1 / -1;
//           border: 1px solid rgba(255,255,255,0.12);
//           background: rgba(0,0,0,0.22);
//           border-radius: 16px;
//           padding: 14px;
//           opacity: 0.82;
//         }

//         .card {
//           border-radius: 18px;
//           border: 1px solid rgba(120,180,255,0.26);
//           background: rgba(255,255,255,0.04);
//           box-shadow: 0 14px 35px rgba(0,0,0,0.30);
//           padding: 14px;
//         }
//         .cardTop {
//           display: flex;
//           justify-content: space-between;
//           gap: 10px;
//           flex-wrap: wrap;
//           align-items: baseline;
//         }
//         .cardTitle {
//           font-weight: 950;
//           letter-spacing: 0.2px;
//           font-size: 16px;
//         }
//         .miniPills {
//           display: flex;
//           gap: 8px;
//           flex-wrap: wrap;
//           justify-content: flex-end;
//         }
//         .mini {
//           border: 1px solid rgba(255,255,255,0.14);
//           background: rgba(0,0,0,0.18);
//           padding: 6px 10px;
//           border-radius: 999px;
//           font-size: 12px;
//           opacity: 0.92;
//         }
//         .notes {
//           margin-top: 8px;
//           opacity: 0.78;
//           font-size: 13px;
//           line-height: 18px;
//         }

//         .btnRow {
//           margin-top: 12px;
//           display: flex;
//           gap: 10px;
//           flex-wrap: wrap;
//           align-items: center;
//         }
//         .pick {
//           padding: 10px 14px;
//           border-radius: 12px;
//           border: 1px solid rgba(255,255,255,0.22);
//           background: rgba(0,0,0,0.22);
//           color: #fff;
//           cursor: pointer;
//           font-weight: 950;
//           letter-spacing: 0.2px;
//           transition: transform 120ms ease, border 120ms ease, background 120ms ease;
//           min-width: 92px;
//         }
//         .pick:hover {
//           transform: translateY(-1px);
//         }
//         .pickOn {
//           border-color: rgba(120,255,170,0.55);
//           background: rgba(120,255,170,0.12);
//         }
//         .yourPick {
//           margin-left: auto;
//           font-size: 13px;
//           opacity: 0.9;
//         }

//         .lean {
//           margin-top: 12px;
//         }
//         .leanHead {
//           display: flex;
//           justify-content: space-between;
//           gap: 10px;
//           flex-wrap: wrap;
//           margin-bottom: 6px;
//         }
//         .bar {
//           height: 10px;
//           border-radius: 999px;
//           overflow: hidden;
//           border: 1px solid rgba(255,255,255,0.14);
//           background: rgba(0,0,0,0.20);
//           display: flex;
//         }
//         .barOver {
//           height: 100%;
//           background: rgba(120,255,170,0.70);
//         }
//         .barUnder {
//           height: 100%;
//           background: rgba(255,120,120,0.65);
//         }

//         .disclaimer {
//           margin-top: 16px;
//           padding-top: 12px;
//           border-top: 1px solid rgba(255,255,255,0.10);
//           opacity: 0.65;
//           font-size: 12px;
//           line-height: 18px;
//         }

//         @media (max-width: 920px) {
//           .controls {
//             grid-template-columns: 1fr;
//           }
//           .grid {
//             grid-template-columns: 1fr;
//           }
//         }
//       `}</style>
//     </main>
//   );
// }


// adding some small ui tweaks, clear choice button
//better more apparent button layout

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
import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
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

// Public leaderboard doc (one per user)
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

function statEmoji(statKey?: string) {
  switch (statKey) {
    case "points":
      return "🏀";
    case "assists":
      return "🤝";
    case "rebounds":
      return "🧱";
    case "threes":
      return "🎯";
    case "steals":
      return "🕵️";
    case "blocks":
      return "🚫";
    case "pra":
      return "📦";
    default:
      return "📊";
  }
}

function fmtPct(n: number) {
  if (!Number.isFinite(n)) return "0%";
  return `${Math.round(n)}%`;
}

export default function PlayerPropsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [props, setProps] = useState<PlayerProp[]>([]);
  const [picks, setPicks] = useState<Record<string, "over" | "under">>({});

  // leaderboard docs (for community lean)
  const [lbUsers, setLbUsers] = useState<(PropsLeaderboardDoc & { id: string })[]>([]);
  const [status, setStatus] = useState("");

  // UI controls
  const [search, setSearch] = useState("");
  const [statFilter, setStatFilter] = useState<string>("all");
  const [showUnpickedOnly, setShowUnpickedOnly] = useState(false);

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

  // Subscribe to current user's private picks
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

  // Subscribe to public props leaderboard docs (for community lean)
  useEffect(() => {
    const ref = collection(db, "tournaments", TOURNAMENT_ID, "playerPropLeaderboard");
    const unsub = onSnapshot(
      ref,
      (snap) => {
        const rows = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as PropsLeaderboardDoc),
        }));
        setLbUsers(rows);
      },
      (err) => {
        console.error(err);
        // Don't block the page if this fails — just hide community bars.
      }
    );

    return () => unsub();
  }, []);

  const activeProps = useMemo(() => {
    return props
      .filter((p) => p.active !== false)
      .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
  }, [props]);

  const filteredProps = useMemo(() => {
    const q = search.trim().toLowerCase();
    return activeProps.filter((p) => {
      const chosen = picks[p.id];
      if (showUnpickedOnly && chosen) return false;

      if (statFilter !== "all" && (p.statKey || "") !== statFilter) return false;

      if (!q) return true;
      const hay = `${p.playerName || ""} ${p.teamName || ""} ${p.statKey || ""} ${
        p.notes || ""
      }`.toLowerCase();
      return hay.includes(q);
    });
  }, [activeProps, picks, search, showUnpickedOnly, statFilter]);

  const yourPickCount = useMemo(() => Object.keys(picks).length, [picks]);

  // Community lean: count over/under across public leaderboard docs
  const communityCounts = useMemo(() => {
    const map: Record<string, { over: number; under: number }> = {};
    for (const u of lbUsers) {
      const up = u.picks || {};
      for (const [propId, choice] of Object.entries(up)) {
        if (choice !== "over" && choice !== "under") continue;
        map[propId] ||= { over: 0, under: 0 };
        map[propId]![choice] += 1;
      }
    }
    return map;
  }, [lbUsers]);

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
      // 1) Private pick doc
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

      // 2) Public leaderboard doc (so others can view picks live)
      const lbRef = doc(
        db,
        "tournaments",
        TOURNAMENT_ID,
        "playerPropLeaderboard",
        user.uid
      );

      // ensure doc exists + keep displayName
      await setDoc(
        lbRef,
        {
          userId: user.uid,
          displayName: user.displayName || user.email || user.uid,
          updatedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
        } satisfies PropsLeaderboardDoc,
        { merge: true }
      );

      // update the specific pick in a map field
      await updateDoc(lbRef, {
        [`picks.${propId}`]: choice,
        updatedAt: serverTimestamp(),
      } as any);

      setStatus("✅ Saved.");
    } catch (e: any) {
      console.error(e);
      setStatus(`Could not save your pick (${e?.code ?? "error"}). Check rules.`);
    }
  }

  // ✅ Clear pick (removes selection from BOTH public + private)
  async function clearPick(propId: string) {
    setStatus("");
    if (!user) {
      setStatus("Please sign in to clear a prop pick.");
      return;
    }

    try {
      // Remove from public leaderboard map so others stop seeing it
      const lbRef = doc(
        db,
        "tournaments",
        TOURNAMENT_ID,
        "playerPropLeaderboard",
        user.uid
      );

      // (If doc doesn't exist for some reason, this will throw; but Clear is disabled without a pick.)
      await updateDoc(lbRef, {
        [`picks.${propId}`]: deleteField(),
        updatedAt: serverTimestamp(),
      } as any);

      // Delete the private pick doc (rules usually allow delete self)
      await deleteDoc(
        doc(
          db,
          "tournaments",
          TOURNAMENT_ID,
          "playerPropPicks",
          user.uid,
          "picks",
          propId
        )
      );

      setStatus("✅ Cleared.");
    } catch (e: any) {
      console.error(e);
      setStatus(`Could not clear your pick (${e?.code ?? "error"}). Check rules.`);
    }
  }

  const statOptions = useMemo(() => {
    const s = new Set<string>();
    for (const p of activeProps) if (p.statKey) s.add(p.statKey);
    return Array.from(s).sort();
  }, [activeProps]);

  return (
    <main className="wrap">
      <div className="stage">
        <div className="bgSpotlights" aria-hidden="true" />
        <div className="bgVignette" aria-hidden="true" />

        <header className="hero">
          <div className="top">
            <div>
              <div className="kicker">AZ Road to Open</div>
              <h1 className="h1">📊 Player Props</h1>
              <div className="sub">
                Predict player props (Over/Under) for the semifinals & finals. Separate from the
                bracket leaderboard — just for fun + bragging rights.
              </div>

              <div className="metaRow">
                <div className="pill">
                  Props live: <b>{activeProps.length}</b>
                </div>
                <div className="pill">
                  Your picks: <b>{yourPickCount}</b>
                </div>
                <div className="pill">
                  Players picking: <b>{lbUsers.length}</b>
                </div>
              </div>
            </div>

            <div className="actions">
              {/* ✅ These are REAL button-styled links (global styles so Next/Link renders correctly) */}
              <div className="navRow">
                <Link className="ppNavBtn ppNavHome" href="/">
                  ← Home
                </Link>

                <Link className="ppNavBtn ppNavLeader" href="/player-props/leaderboard">
                  🏆 Props Leaderboard →
                </Link>
              </div>

              <div className="authRow">
                {checkingAuth ? (
                  <div className="mutedSmall">Checking auth…</div>
                ) : user ? (
                  <>
                    <div className="who">
                      Signed in as <b>{user.displayName || user.email || "User"}</b>
                    </div>
                    <button className="btn btnGhost" onClick={doSignOut}>
                      Sign out
                    </button>
                  </>
                ) : (
                  <button className="btn btnBlue" onClick={doSignIn}>
                    Sign in with Google
                  </button>
                )}
              </div>
            </div>
          </div>

          {status ? <div className="status">{status}</div> : null}

          <section className="controls">
            <input
              className="input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search player / team / stat…"
            />

            <select
              className="input"
              value={statFilter}
              onChange={(e) => setStatFilter(e.target.value)}
            >
              <option value="all">All stats</option>
              {statOptions.map((s) => (
                <option key={s} value={s}>
                  {statLabel(s)}
                </option>
              ))}
            </select>

            <label className="check">
              <input
                type="checkbox"
                checked={showUnpickedOnly}
                onChange={(e) => setShowUnpickedOnly(e.target.checked)}
              />
              <span>Show unpicked only</span>
            </label>

            <button
              className="btn btnGhost"
              onClick={() => {
                setSearch("");
                setStatFilter("all");
                setShowUnpickedOnly(false);
              }}
            >
              Clear Filters
            </button>
          </section>

          <section className="grid">
            {filteredProps.length === 0 ? (
              <div className="empty">
                No props match your filters yet. Try clearing search or switching stats.
              </div>
            ) : (
              filteredProps.map((p) => {
                const chosen = picks[p.id];
                const title = `${p.playerName || "Player"}${p.teamName ? ` (${p.teamName})` : ""}`;
                const lineText =
                  typeof p.line === "number" ? p.line.toString() : p.line ? String(p.line) : "—";

                const cc = communityCounts[p.id] || { over: 0, under: 0 };
                const total = cc.over + cc.under;
                const overPct = total > 0 ? (cc.over / total) * 100 : 0;
                const underPct = total > 0 ? (cc.under / total) * 100 : 0;

                return (
                  <div key={p.id} className="card">
                    <div className="cardTop">
                      <div className="cardTitle">{title}</div>

                      <div className="miniPills">
                        <span className="mini">
                          {statEmoji(p.statKey)} <b>{statLabel(p.statKey)}</b>
                        </span>
                        <span className="mini">
                          O/U <b>{lineText}</b>
                        </span>
                      </div>
                    </div>

                    {p.notes ? <div className="notes">{p.notes}</div> : null}

                    <div className="btnRow">
                      <button
                        className={`pick ${chosen === "over" ? "pickOn" : ""}`}
                        onClick={() => pick(p.id, "over")}
                      >
                        Over
                      </button>
                      <button
                        className={`pick ${chosen === "under" ? "pickOn" : ""}`}
                        onClick={() => pick(p.id, "under")}
                      >
                        Under
                      </button>

                      <button
                        className={`pick pickClear ${chosen ? "" : "pickClearOff"}`}
                        onClick={() => clearPick(p.id)}
                        disabled={!chosen}
                        title={chosen ? "Clear your selection" : "No pick to clear"}
                      >
                        Clear
                      </button>

                      <div className="yourPick">
                        {chosen ? (
                          <>
                            Your pick: <b>{chosen.toUpperCase()}</b>
                          </>
                        ) : (
                          <span className="mutedSmall">No pick yet</span>
                        )}
                      </div>
                    </div>

                    {total > 0 ? (
                      <div className="lean">
                        <div className="leanHead">
                          <span className="mutedSmall">Community lean</span>
                          <span className="mutedSmall">
                            Over {fmtPct(overPct)} · Under {fmtPct(underPct)} · Votes {total}
                          </span>
                        </div>
                        <div className="bar">
                          <div className="barOver" style={{ width: `${overPct}%` }} />
                          <div className="barUnder" style={{ width: `${underPct}%` }} />
                        </div>
                      </div>
                    ) : (
                      <div className="lean mutedSmall">No community votes yet.</div>
                    )}
                  </div>
                );
              })
            )}
          </section>

          <footer className="disclaimer">
            Note: This is separate from the bracket challenge. No gambling/cash prizes. Charlie Richards and
            Greyson Beckett assume no responsibility for any bets placed — this is for fun + bragging rights.
          </footer>
        </header>
      </div>

      <style jsx>{`
        .wrap {
          padding: 26px 18px 110px;
          display: flex;
          justify-content: center;
          color: #fff;
        }
        .stage {
          width: 100%;
          max-width: 1120px;
          position: relative;
          border-radius: 22px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.10);
          background: rgba(0, 0, 0, 0.35);
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.55);
        }
        .bgSpotlights {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(900px 520px at 18% 10%, rgba(255,255,255,0.10), rgba(255,255,255,0) 60%),
            radial-gradient(820px 520px at 78% 18%, rgba(120,255,170,0.10), rgba(255,255,255,0) 58%),
            radial-gradient(980px 620px at 50% 0%, rgba(100,170,255,0.10), rgba(255,255,255,0) 62%),
            linear-gradient(to bottom, rgba(255,255,255,0.04), rgba(0,0,0,0.35));
          pointer-events: none;
        }
        .bgVignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(1200px 700px at 50% 10%, rgba(0,0,0,0), rgba(0,0,0,0.70));
          pointer-events: none;
        }
        .hero {
          position: relative;
          padding: 22px;
        }

        .top {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          align-items: flex-start;
        }
        .kicker {
          font-size: 12px;
          letter-spacing: 1px;
          opacity: 0.75;
          text-transform: uppercase;
        }
        .h1 {
          margin: 6px 0 0;
          font-size: 28px;
          font-weight: 900;
          letter-spacing: 0.2px;
        }
        .sub {
          margin-top: 8px;
          opacity: 0.82;
          max-width: 760px;
          line-height: 22px;
        }
        .metaRow {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 12px;
        }
        .pill {
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.06);
          padding: 8px 10px;
          border-radius: 999px;
          font-size: 13px;
          opacity: 0.92;
        }

        .actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: flex-end;
        }
        .navRow {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }
        .authRow {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          align-items: center;
          justify-content: flex-end;
        }
        .who {
          opacity: 0.9;
          font-size: 13px;
        }
        .mutedSmall {
          opacity: 0.72;
          font-size: 12px;
        }

        /* Buttons inside THIS component */
        .btn {
          border-radius: 12px;
          padding: 12px 16px;
          border: 1px solid rgba(255,255,255,0.24);
          background: rgba(0,0,0,0.22);
          color: #fff;
          text-decoration: none;
          font-weight: 900;
          cursor: pointer;
          transition: transform 120ms ease, background 120ms ease, border 120ms ease;
          font-size: 14px;
          letter-spacing: 0.2px;
        }
        .btn:hover {
          transform: translateY(-1px);
        }
        .btnBlue {
          border-color: rgba(43,92,255,0.55);
          background: rgba(43,92,255,0.16);
        }
        .btnGhost {
          border-color: rgba(255,255,255,0.22);
          background: rgba(0,0,0,0.22);
        }

        /*
          ✅ IMPORTANT:
          Next.js <Link> renders an <a> that doesn't always receive styled-jsx scoping.
          So we style these nav links globally with unique class names.
        */
        :global(a.ppNavBtn) {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 16px;
          border-radius: 12px;
          font-weight: 900;
          font-size: 14px;
          letter-spacing: 0.2px;
          text-decoration: none;
          color: #fff;
          border: 2px solid rgba(255,255,255,0.40); /* visible border */
          background: rgba(0,0,0,0.22);
          box-shadow: 0 10px 24px rgba(0,0,0,0.35);
          transition: transform 120ms ease, background 120ms ease, border 120ms ease;
        }
        :global(a.ppNavBtn:hover) {
          transform: translateY(-1px);
        }

        :global(a.ppNavHome) {
          border-color: rgba(242, 194, 48, 0.95);
          background: rgba(242, 194, 48, 0.18);
          box-shadow:
            0 0 0 2px rgba(242, 194, 48, 0.20),
            0 10px 24px rgba(0,0,0,0.35);
        }

        :global(a.ppNavLeader) {
          border-color: rgba(120, 255, 170, 0.95);
          background: rgba(120, 255, 170, 0.16);
          box-shadow:
            0 0 0 2px rgba(120, 255, 170, 0.18),
            0 10px 24px rgba(0,0,0,0.35);
        }

        .status {
          margin-top: 14px;
          padding: 10px 12px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(0,0,0,0.25);
          color: rgba(183,255,183,0.95);
          font-size: 13px;
          line-height: 18px;
        }

        .controls {
          margin-top: 14px;
          display: grid;
          grid-template-columns: 1fr 220px auto auto;
          gap: 10px;
          align-items: center;
        }
        .input {
          width: 100%;
          padding: 10px 12px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.18);
          background: rgba(0,0,0,0.25);
          color: #fff;
          outline: none;
          font-weight: 650;
        }
        .check {
          display: inline-flex;
          gap: 8px;
          align-items: center;
          font-size: 13px;
          opacity: 0.9;
          user-select: none;
        }

        .grid {
          margin-top: 14px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .empty {
          grid-column: 1 / -1;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(0,0,0,0.22);
          border-radius: 16px;
          padding: 14px;
          opacity: 0.82;
        }

        .card {
          border-radius: 18px;
          border: 1px solid rgba(120,180,255,0.26);
          background: rgba(255,255,255,0.04);
          box-shadow: 0 14px 35px rgba(0,0,0,0.30);
          padding: 14px;
        }
        .cardTop {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          flex-wrap: wrap;
          align-items: baseline;
        }
        .cardTitle {
          font-weight: 950;
          letter-spacing: 0.2px;
          font-size: 16px;
        }
        .miniPills {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }
        .mini {
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(0,0,0,0.18);
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 12px;
          opacity: 0.92;
        }
        .notes {
          margin-top: 8px;
          opacity: 0.78;
          font-size: 13px;
          line-height: 18px;
        }

        .btnRow {
          margin-top: 12px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          align-items: center;
        }
        .pick {
          padding: 10px 14px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.22);
          background: rgba(0,0,0,0.22);
          color: #fff;
          cursor: pointer;
          font-weight: 950;
          letter-spacing: 0.2px;
          transition: transform 120ms ease, border 120ms ease, background 120ms ease;
          min-width: 92px;
        }
        .pick:hover {
          transform: translateY(-1px);
        }
        .pickOn {
          border-color: rgba(120,255,170,0.55);
          background: rgba(120,255,170,0.12);
        }

        .pickClear {
          border-color: rgba(255, 255, 255, 0.22);
          background: rgba(255, 255, 255, 0.06);
          min-width: 84px;
        }
        .pickClearOff {
          opacity: 0.45;
          cursor: not-allowed;
          transform: none !important;
        }

        .yourPick {
          margin-left: auto;
          font-size: 13px;
          opacity: 0.9;
        }

        .lean {
          margin-top: 12px;
        }
        .leanHead {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 6px;
        }
        .bar {
          height: 10px;
          border-radius: 999px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(0,0,0,0.20);
          display: flex;
        }
        .barOver {
          height: 100%;
          background: rgba(120,255,170,0.70);
        }
        .barUnder {
          height: 100%;
          background: rgba(255,120,120,0.65);
        }

        .disclaimer {
          margin-top: 16px;
          padding-top: 12px;
          border-top: 1px solid rgba(255,255,255,0.10);
          opacity: 0.65;
          font-size: 12px;
          line-height: 18px;
        }

        @media (max-width: 920px) {
          .controls {
            grid-template-columns: 1fr;
          }
          .grid {
            grid-template-columns: 1fr;
          }
          .actions {
            align-items: flex-start;
          }
          .navRow,
          .authRow {
            justify-content: flex-start;
          }
        }
      `}</style>
    </main>
  );
}

// Created by Charles Richards ASU CS student — built with Next.js, Firebase, and a lot of 🏀 love. Reach out with questions or feedback!
