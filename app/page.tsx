// this is first version of code.
// "use client";

// import { useEffect, useState } from "react";
// import {
//   GoogleAuthProvider,
//   onAuthStateChanged,
//   signInWithPopup,
//   signOut,
//   User,
// } from "firebase/auth";
// import { auth } from "../lib/firebase";

// export default function Home() {
//   const [user, setUser] = useState<User | null>(null);
//   const [busy, setBusy] = useState(false);

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (u) => setUser(u));
//     return () => unsub();
//   }, []);

//   async function handleSignIn() {
//     try {
//       setBusy(true);
//       const provider = new GoogleAuthProvider();
//       await signInWithPopup(auth, provider);
//     } finally {
//       setBusy(false);
//     }
//   }

//   async function handleSignOut() {
//     try {
//       setBusy(true);
//       await signOut(auth);
//     } finally {
//       setBusy(false);
//     }
//   }

//   return (
//     <main style={{ padding: 24, fontFamily: "system-ui" }}>
//       <h1>AZHS Bracket</h1>
//       <p style={{ opacity: 0.8 }}>
//         Sign in to create and submit your bracket. Once submitted, it locks.
//       </p>

//       {!user ? (
//         <button
//           onClick={handleSignIn}
//           disabled={busy}
//           style={{
//             padding: "10px 14px",
//             cursor: busy ? "not-allowed" : "pointer",
//           }}
//         >
//           {busy ? "Signing in..." : "Sign in with Google"}
//         </button>
//       ) : (
//         <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
//           <div>
//             Signed in as <b>{user.displayName || "User"}</b>
//             <div style={{ fontSize: 12, opacity: 0.8 }}>{user.email}</div>
//             <div style={{ fontSize: 12, opacity: 0.8 }}>UID: {user.uid}</div>
//           </div>

//           <button
//             onClick={handleSignOut}
//             disabled={busy}
//             style={{ padding: "10px 14px", width: "fit-content" }}
//           >
//             {busy ? "Signing out..." : "Sign out"}
//           </button>
//         </div>
//       )}
//     </main>
//   );
// }


// this is the second version of code.
// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { auth } from "@/lib/firebase";
// import {
//   GoogleAuthProvider,
//   onAuthStateChanged,
//   signInWithPopup,
//   signOut,
//   User,
// } from "firebase/auth";

// export default function HomePage() {
//   const [user, setUser] = useState<User | null>(null);
//   const [checking, setChecking] = useState(true);
//   const [status, setStatus] = useState<string>("");

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (u) => {
//       setUser(u);
//       setChecking(false);
//     });
//     return () => unsub();
//   }, []);

//   async function doGoogleSignIn() {
//     setStatus("");
//     try {
//       await signInWithPopup(auth, new GoogleAuthProvider());
//     } catch (e: any) {
//       setStatus(`Sign-in failed: ${e.message ?? String(e)}`);
//     }
//   }

//   async function doSignOut() {
//     setStatus("");
//     await signOut(auth);
//   }

//   return (
//     <main style={{ padding: 24, color: "#fff" }}>
//       {/* ✅ Visible homepage title + description */}
//       <h1 style={{ margin: 0 }}>
//         2026 AIA Boys Basketball Open State Championship
//       </h1>

//       <p style={{ opacity: 0.85, marginTop: 10, maxWidth: 900, lineHeight: 1.5 }}>
//         Predict the matchups between the top 32 teams in Arizona high school basketball,
//         and who will take home the trophy in Arizona Veterans Memorial Coliseum on March 7th!
//         Fill out your bracket and compete against others to see who can have the most accurate bracket.
//       </p>

//       <div style={{ marginTop: 18, opacity: 0.9 }}>
//         {checking ? (
//           <p>Checking sign-in…</p>
//         ) : user ? (
//           <>
//             <div style={{ marginTop: 8 }}>
//               Signed in as <b>{user.displayName ?? user.email}</b>
//             </div>
//             <div style={{ opacity: 0.75, marginTop: 4 }}>
//               {user.email}
//             </div>

//             <div style={{ marginTop: 16, display: "flex", gap: 12, flexWrap: "wrap" }}>
//               <Link href="/my-bracket" style={linkBtn()}>
//                 My Bracket
//               </Link>
//               <Link href="/bracket" style={linkBtn()}>
//                 Live Bracket
//               </Link>
//               <Link href="/leaderboard" style={linkBtn()}>
//                 Leaderboard
//               </Link>

//               <button onClick={doSignOut} style={btn()}>
//                 Sign out
//               </button>
//             </div>
//           </>
//         ) : (
//           <>
//             <p style={{ marginTop: 10 }}>
//               Sign in to create and submit your bracket. Once submitted, it locks.
//             </p>
//             <button onClick={doGoogleSignIn} style={btn()}>
//               Sign in with Google
//             </button>
//           </>
//         )}

//         {status && (
//           <p style={{ marginTop: 12, color: "#b7ffb7" }}>
//             {status}
//           </p>
//         )}
//       </div>
//     </main>
//   );
// }

// function btn(): React.CSSProperties {
//   return {
//     padding: "10px 14px",
//     borderRadius: 10,
//     border: "1px solid rgba(255,255,255,0.18)",
//     background: "rgba(255,255,255,0.10)",
//     color: "#fff",
//     cursor: "pointer",
//   };
// }

// function linkBtn(): React.CSSProperties {
//   return {
//     padding: "10px 14px",
//     borderRadius: 10,
//     border: "1px solid rgba(255,255,255,0.18)",
//     background: "rgba(255,255,255,0.06)",
//     color: "#fff",
//     textDecoration: "none",
//     display: "inline-block",
//     fontWeight: 600,
//   };
// }

// first time with animations,,, new version coming soon.
// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { auth } from "@/lib/firebase";
// import {
//   GoogleAuthProvider,
//   onAuthStateChanged,
//   signInWithPopup,
//   signOut,
//   User,
// } from "firebase/auth";

// export default function HomePage() {
//   const [user, setUser] = useState<User | null>(null);
//   const [checking, setChecking] = useState(true);
//   const [status, setStatus] = useState("");

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (u) => {
//       setUser(u);
//       setChecking(false);
//     });
//     return () => unsub();
//   }, []);

//   async function doGoogleSignIn() {
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

//   return (
//     <main className="homeWrap">
//       <div className="hero">
//         {/* Top bar */}
//         <div className="topBar">
//           <div className="brand">
//             <img
//               className="brandLogo"
//               src="/brand/aia.png"
//               alt="AIA"
//               onError={(e) => {
//                 // If the logo path is wrong, hide it instead of showing a broken icon
//                 (e.currentTarget as HTMLImageElement).style.display = "none";
//               }}
//             />
//             <div className="brandText">
//               <div className="title">2026 AIA Boys Basketball Open State Championship</div>
//               <div className="subtitle">
//                 Predict the matchups between the top 32 teams in Arizona high school
//                 basketball, and who will take home the trophy in Arizona Veterans Memorial
//                 Coliseum on March 7th! Fill out your bracket and compete against others to
//                 see who can have the most accurate bracket.
//               </div>
//             </div>
//           </div>

//           <div className="ballCol">
//             <SpinningBasketball />
//           </div>
//         </div>

//         {/* Auth + actions */}
//         <div className="panel">
//           {checking ? (
//             <div className="muted">Loading…</div>
//           ) : user ? (
//             <>
//               <div className="signedIn">
//                 <div className="muted">Signed in as</div>
//                 <div className="who">{user.displayName ?? user.email ?? "User"}</div>
//                 {user.email ? <div className="muted">{user.email}</div> : null}
//               </div>

//               <div className="btnRow">
//                 <Link className="btn" href="/my-bracket">
//                   My Bracket
//                 </Link>
//                 <Link className="btn" href="/bracket">
//                   Live Bracket
//                 </Link>
//                 <Link className="btn" href="/leaderboard">
//                   Leaderboard
//                 </Link>

//                 <button className="btnGhost" onClick={doSignOut}>
//                   Sign out
//                 </button>
//               </div>
//             </>
//           ) : (
//             <>
//               <div className="signedOut">
//                 <div className="muted">
//                   Sign in to create and submit your bracket. Once submitted, it locks.
//                 </div>
//               </div>

//               <div className="btnRow">
//                 <button className="btn" onClick={doGoogleSignIn}>
//                   Sign in with Google
//                 </button>

//                 <Link className="btnGhost" href="/bracket">
//                   View Live Bracket
//                 </Link>

//                 <Link className="btnGhost" href="/leaderboard">
//                   View Leaderboard
//                 </Link>
//               </div>
//             </>
//           )}

//           {status ? <div className="status">{status}</div> : null}
//         </div>

//         <div className="hint">
//           Tip: Scores update automatically as the admin sets winners.
//         </div>
//       </div>

//       {/* Styles */}
//       <style jsx>{`
//         .homeWrap {
//           padding: 28px 18px 40px;
//           color: #fff;
//           min-height: calc(100vh - 60px);
//           display: flex;
//           justify-content: center;
//         }
//         .hero {
//           width: 100%;
//           max-width: 1100px;
//         }

//         .topBar {
//           display: grid;
//           grid-template-columns: 1fr auto;
//           gap: 18px;
//           align-items: start;
//         }

//         .brand {
//           display: flex;
//           gap: 14px;
//           align-items: flex-start;
//         }

//         .brandLogo {
//           width: 120px;
//           height: auto;
//           filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.35));
//           border-radius: 10px;
//         }

//         .brandText .title {
//           font-size: 22px;
//           font-weight: 750;
//           letter-spacing: 0.2px;
//           margin-bottom: 10px;
//         }
//         .brandText .subtitle {
//           font-size: 16px;
//           line-height: 24px;
//           color: rgba(255, 255, 255, 0.78);
//           max-width: 820px;
//         }

//         .ballCol {
//           display: flex;
//           justify-content: flex-end;
//           padding-top: 6px;
//         }

//         .panel {
//           margin-top: 22px;
//           border: 1px solid rgba(255, 255, 255, 0.12);
//           border-radius: 18px;
//           background: rgba(255, 255, 255, 0.04);
//           box-shadow: 0 18px 45px rgba(0, 0, 0, 0.35);
//           padding: 18px;
//         }

//         .signedIn,
//         .signedOut {
//           margin-bottom: 14px;
//         }

//         .muted {
//           color: rgba(255, 255, 255, 0.72);
//         }
//         .who {
//           font-size: 18px;
//           font-weight: 750;
//           margin: 2px 0 2px;
//         }

//         .btnRow {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 10px;
//           align-items: center;
//         }

//         .btn,
//         .btnGhost {
//           border-radius: 12px;
//           padding: 11px 14px;
//           border: 1px solid rgba(255, 255, 255, 0.18);
//           text-decoration: none;
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           font-weight: 700;
//           cursor: pointer;
//           user-select: none;
//           transition: transform 120ms ease, background 120ms ease, border 120ms ease;
//         }

//         .btn {
//           background: rgba(255, 255, 255, 0.10);
//           color: #fff;
//         }

//         .btnGhost {
//           background: rgba(0, 0, 0, 0.25);
//           color: rgba(255, 255, 255, 0.92);
//         }

//         .btn:hover,
//         .btnGhost:hover {
//           transform: translateY(-1px);
//           border: 1px solid rgba(255, 255, 255, 0.28);
//           background: rgba(255, 255, 255, 0.12);
//         }

//         .btnGhost:hover {
//           background: rgba(255, 255, 255, 0.07);
//         }

//         .btnGhost:active,
//         .btn:active {
//           transform: translateY(0px);
//         }

//         .status {
//           margin-top: 12px;
//           color: rgba(183, 255, 183, 0.95);
//         }

//         .hint {
//           margin-top: 14px;
//           color: rgba(255, 255, 255, 0.55);
//           font-size: 13px;
//         }

//         @media (max-width: 860px) {
//           .topBar {
//             grid-template-columns: 1fr;
//           }
//           .ballCol {
//             justify-content: flex-start;
//           }
//           .brand {
//             flex-direction: column;
//           }
//           .brandLogo {
//             width: 160px;
//           }
//         }
//       `}</style>
//     </main>
//   );
// }

// function SpinningBasketball() {
//   return (
//     <div className="ballWrap" aria-hidden="true">
//       <div className="ball">
//         {/* simple SVG basketball */}
//         <svg viewBox="0 0 100 100" className="ballSvg">
//           <defs>
//             <radialGradient id="g" cx="30%" cy="30%" r="70%">
//               <stop offset="0%" stopColor="#ffb36b" stopOpacity="1" />
//               <stop offset="55%" stopColor="#e67e22" stopOpacity="1" />
//               <stop offset="100%" stopColor="#b85a14" stopOpacity="1" />
//             </radialGradient>
//           </defs>
//           <circle cx="50" cy="50" r="48" fill="url(#g)" />
//           <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="2" />
//           <path d="M50 2 v96" stroke="rgba(0,0,0,0.55)" strokeWidth="3" />
//           <path d="M2 50 h96" stroke="rgba(0,0,0,0.55)" strokeWidth="3" />
//           <path d="M18 10 C40 30, 40 70, 18 90" fill="none" stroke="rgba(0,0,0,0.55)" strokeWidth="3" />
//           <path d="M82 10 C60 30, 60 70, 82 90" fill="none" stroke="rgba(0,0,0,0.55)" strokeWidth="3" />
//         </svg>
//       </div>

//       <style jsx>{`
//         .ballWrap {
//           width: 120px;
//           height: 120px;
//           display: grid;
//           place-items: center;
//           filter: drop-shadow(0 14px 24px rgba(0, 0, 0, 0.45));
//         }
//         .ball {
//           width: 106px;
//           height: 106px;
//           border-radius: 999px;
//           animation: spin 2.8s linear infinite, floaty 3.2s ease-in-out infinite;
//           transform-origin: 50% 50%;
//         }
//         .ballSvg {
//           width: 100%;
//           height: 100%;
//           border-radius: 999px;
//           display: block;
//         }

//         @keyframes spin {
//           from {
//             transform: rotate(0deg);
//           }
//           to {
//             transform: rotate(360deg);
//           }
//         }
//         @keyframes floaty {
//           0%,
//           100% {
//             translate: 0 0;
//           }
//           50% {
//             translate: 0 -6px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }


// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import { auth } from "@/lib/firebase";
// import {
//   GoogleAuthProvider,
//   onAuthStateChanged,
//   signInWithPopup,
//   signOut,
//   User,
// } from "firebase/auth";

// // Phoenix is UTC-7 year-round (no DST)
// const TIPOFF_ISO = "2026-03-07T19:00:00-07:00"; // March 7, 2026 @ 7:00 PM Phoenix

// export default function HomePage() {
//   const [user, setUser] = useState<User | null>(null);
//   const [checking, setChecking] = useState(true);
//   const [status, setStatus] = useState("");

//   // countdown state
//   const tipoffDate = useMemo(() => new Date(TIPOFF_ISO), []);
//   const [now, setNow] = useState(() => Date.now());

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (u) => {
//       setUser(u);
//       setChecking(false);
//     });
//     return () => unsub();
//   }, []);

//   useEffect(() => {
//     const t = setInterval(() => setNow(Date.now()), 1000);
//     return () => clearInterval(t);
//   }, []);

//   const diffMs = Math.max(0, tipoffDate.getTime() - now);
//   const countdown = formatCountdown(diffMs);

//   const tipoffPhoenixText = useMemo(() => {
//     try {
//       return new Intl.DateTimeFormat("en-US", {
//         timeZone: "America/Phoenix",
//         dateStyle: "full",
//         timeStyle: "short",
//       }).format(tipoffDate);
//     } catch {
//       return tipoffDate.toLocaleString();
//     }
//   }, [tipoffDate]);

//   async function doGoogleSignIn() {
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

//   return (
//     <main className="wrap">
//       <div className="stage">
//         {/* Spotlight background layers */}
//         <div className="bgSpotlights" aria-hidden="true" />
//         <div className="bgVignette" aria-hidden="true" />

//         <header className="hero">
//           <div className="topRow">
//             <div className="brand">
//               <img
//                 className="brandLogo"
//                 src="/brand/aia.png"
//                 alt="AIA"
//                 onError={(e) => {
//                   (e.currentTarget as HTMLImageElement).style.display = "none";
//                 }}
//               />

//               <div className="brandText">
//                 <div className="title">
//                   2026 AIA Boys Basketball Open State Championship
//                 </div>
//                 <div className="subtitle">
//                   Predict the matchups between the top 32 teams in Arizona high
//                   school basketball, and who will take home the trophy in Arizona
//                   Veterans Memorial Coliseum on March 7th! Fill out your bracket
//                   and compete against others to see who can have the most accurate
//                   bracket.
//                 </div>
//               </div>
//             </div>

//             <div className="ballCol">
//               <SpinningBasketball />
//             </div>
//           </div>

//           <div className="cardsRow">
//             <InfoCard
//               title="Tip-off Countdown"
//               icon="⏳"
//               lines={[
//                 `Phoenix time: ${tipoffPhoenixText}`,
//                 diffMs === 0
//                   ? "Tip-off has started!"
//                   : `${countdown.days}d ${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`,
//               ]}
//               accent="green"
//             />

//             <InfoCard
//               title="Scoring"
//               icon="🏀"
//               lines={[
//                 "Round 1 = 1 point per correct pick",
//                 "Round 2 = 2 points",
//                 "Round 3 = 4 points",
//                 "Round 4 = 8 points",
//                 "Final = 16 points",
//               ]}
//               accent="blue"
//             />
//           </div>

//           <section className="panel">
//             {checking ? (
//               <div className="muted">Loading…</div>
//             ) : user ? (
//               <>
//                 <div className="signedIn">
//                   <div className="muted">Signed in as</div>
//                   <div className="who">{user.displayName ?? user.email ?? "User"}</div>
//                   {user.email ? <div className="muted">{user.email}</div> : null}
//                 </div>

//                 <div className="btnRow">
//                   <Link className="btn" href="/my-bracket">
//                     My Bracket
//                   </Link>
//                   <Link className="btn" href="/bracket">
//                     Live Bracket
//                   </Link>
//                   <Link className="btn" href="/leaderboard">
//                     Leaderboard
//                   </Link>

//                   <button className="btnGhost" onClick={doSignOut}>
//                     Sign out
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div className="signedOut">
//                   <div className="muted">
//                     Sign in to create and submit your bracket. Once submitted, it locks.
//                   </div>
//                 </div>

//                 <div className="btnRow">
//                   <button className="btn" onClick={doGoogleSignIn}>
//                     Sign in with Google
//                   </button>

//                   <Link className="btnGhost" href="/bracket">
//                     View Live Bracket
//                   </Link>

//                   <Link className="btnGhost" href="/leaderboard">
//                     View Leaderboard
//                   </Link>
//                 </div>
//               </>
//             )}

//             {status ? <div className="status">{status}</div> : null}
//           </section>

//           <div className="hint">
//             Tip: Scores update automatically as the admin sets winners.
//           </div>
//         </header>
//       </div>

//       <style jsx>{`
//         .wrap {
//           padding: 28px 18px 40px;
//           color: #fff;
//           display: flex;
//           justify-content: center;
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
//           filter: blur(0px);
//           pointer-events: none;
//         }

//         .bgVignette {
//           position: absolute;
//           inset: 0;
//           background: radial-gradient(1200px 700px at 50% 10%, rgba(0,0,0,0), rgba(0,0,0,0.65));
//           pointer-events: none;
//         }

//         .hero {
//           position: relative;
//           padding: 22px;
//         }

//         .topRow {
//           display: grid;
//           grid-template-columns: 1fr auto;
//           gap: 18px;
//           align-items: start;
//         }

//         .brand {
//           display: flex;
//           gap: 14px;
//           align-items: flex-start;
//         }

//         .brandLogo {
//           width: 120px;
//           height: auto;
//           filter: drop-shadow(0 12px 22px rgba(0, 0, 0, 0.45));
//           border-radius: 10px;
//         }

//         .brandText .title {
//           font-size: 22px;
//           font-weight: 780;
//           letter-spacing: 0.2px;
//           margin-bottom: 10px;
//         }

//         .brandText .subtitle {
//           font-size: 16px;
//           line-height: 24px;
//           color: rgba(255, 255, 255, 0.80);
//           max-width: 860px;
//         }

//         .ballCol {
//           display: flex;
//           justify-content: flex-end;
//           padding-top: 6px;
//         }

//         .cardsRow {
//           margin-top: 18px;
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 12px;
//         }

//         .panel {
//           margin-top: 16px;
//           border: 1px solid rgba(255, 255, 255, 0.12);
//           border-radius: 18px;
//           background: rgba(255, 255, 255, 0.04);
//           box-shadow: 0 18px 45px rgba(0, 0, 0, 0.35);
//           padding: 18px;
//         }

//         .muted {
//           color: rgba(255, 255, 255, 0.72);
//         }

//         .who {
//           font-size: 18px;
//           font-weight: 780;
//           margin: 2px 0 2px;
//         }

//         .btnRow {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 10px;
//           align-items: center;
//           margin-top: 14px;
//         }

//         .btn,
//         .btnGhost {
//           border-radius: 12px;
//           padding: 11px 14px;
//           border: 1px solid rgba(255, 255, 255, 0.18);
//           text-decoration: none;
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           font-weight: 720;
//           cursor: pointer;
//           user-select: none;
//           transition: transform 120ms ease, background 120ms ease, border 120ms ease;
//         }

//         .btn {
//           background: rgba(255, 255, 255, 0.10);
//           color: #fff;
//         }

//         .btnGhost {
//           background: rgba(0, 0, 0, 0.25);
//           color: rgba(255, 255, 255, 0.92);
//         }

//         .btn:hover,
//         .btnGhost:hover {
//           transform: translateY(-1px);
//           border: 1px solid rgba(255, 255, 255, 0.28);
//           background: rgba(255, 255, 255, 0.12);
//         }

//         .btnGhost:hover {
//           background: rgba(255, 255, 255, 0.07);
//         }

//         .btnGhost:active,
//         .btn:active {
//           transform: translateY(0px);
//         }

//         .status {
//           margin-top: 12px;
//           color: rgba(183, 255, 183, 0.95);
//         }

//         .hint {
//           margin-top: 14px;
//           color: rgba(255, 255, 255, 0.55);
//           font-size: 13px;
//         }

//         @media (max-width: 920px) {
//           .topRow {
//             grid-template-columns: 1fr;
//           }
//           .ballCol {
//             justify-content: flex-start;
//           }
//           .cardsRow {
//             grid-template-columns: 1fr;
//           }
//           .brand {
//             flex-direction: column;
//           }
//           .brandLogo {
//             width: 160px;
//           }
//         }
//       `}</style>
//     </main>
//   );
// }

// function InfoCard({
//   title,
//   icon,
//   lines,
//   accent,
// }: {
//   title: string;
//   icon: string;
//   lines: string[];
//   accent: "green" | "blue";
// }) {
//   const accentBorder =
//     accent === "green"
//       ? "rgba(120,255,170,0.30)"
//       : "rgba(120,180,255,0.30)";
//   const accentBg =
//     accent === "green"
//       ? "rgba(120,255,170,0.07)"
//       : "rgba(120,180,255,0.07)";

//   return (
//     <div className="icard">
//       <div className="ihead">
//         <div className="ititle">
//           <span className="icon">{icon}</span> {title}
//         </div>
//       </div>
//       <div className="ibody">
//         {lines.map((l, idx) => (
//           <div key={idx} className="iline">
//             {l}
//           </div>
//         ))}
//       </div>

//       <style jsx>{`
//         .icard {
//           border: 1px solid ${accentBorder};
//           background: ${accentBg};
//           border-radius: 18px;
//           padding: 14px;
//           box-shadow: 0 14px 35px rgba(0, 0, 0, 0.30);
//         }
//         .ihead {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 10px;
//         }
//         .ititle {
//           font-weight: 780;
//           letter-spacing: 0.2px;
//         }
//         .icon {
//           margin-right: 6px;
//         }
//         .ibody {
//           color: rgba(255, 255, 255, 0.80);
//           line-height: 20px;
//           font-size: 14px;
//         }
//         .iline {
//           margin-top: 6px;
//         }
//         .iline:first-child {
//           margin-top: 0;
//         }
//       `}</style>
//     </div>
//   );
// }

// function SpinningBasketball() {
//   return (
//     <div className="ballWrap" aria-hidden="true">
//       <div className="ball">
//         <svg viewBox="0 0 100 100" className="ballSvg">
//           <defs>
//             <radialGradient id="g" cx="30%" cy="30%" r="70%">
//               <stop offset="0%" stopColor="#ffb36b" stopOpacity="1" />
//               <stop offset="55%" stopColor="#e67e22" stopOpacity="1" />
//               <stop offset="100%" stopColor="#b85a14" stopOpacity="1" />
//             </radialGradient>
//           </defs>
//           <circle cx="50" cy="50" r="48" fill="url(#g)" />
//           <circle
//             cx="50"
//             cy="50"
//             r="48"
//             fill="none"
//             stroke="rgba(0,0,0,0.35)"
//             strokeWidth="2"
//           />
//           <path d="M50 2 v96" stroke="rgba(0,0,0,0.55)" strokeWidth="3" />
//           <path d="M2 50 h96" stroke="rgba(0,0,0,0.55)" strokeWidth="3" />
//           <path
//             d="M18 10 C40 30, 40 70, 18 90"
//             fill="none"
//             stroke="rgba(0,0,0,0.55)"
//             strokeWidth="3"
//           />
//           <path
//             d="M82 10 C60 30, 60 70, 82 90"
//             fill="none"
//             stroke="rgba(0,0,0,0.55)"
//             strokeWidth="3"
//           />
//         </svg>
//       </div>

//       <style jsx>{`
//         .ballWrap {
//           width: 120px;
//           height: 120px;
//           display: grid;
//           place-items: center;
//           filter: drop-shadow(0 14px 24px rgba(0, 0, 0, 0.45));
//         }
//         .ball {
//           width: 106px;
//           height: 106px;
//           border-radius: 999px;
//           animation: spin 2.8s linear infinite, floaty 3.2s ease-in-out infinite;
//           transform-origin: 50% 50%;
//         }
//         .ballSvg {
//           width: 100%;
//           height: 100%;
//           border-radius: 999px;
//           display: block;
//         }
//         @keyframes spin {
//           from {
//             transform: rotate(0deg);
//           }
//           to {
//             transform: rotate(360deg);
//           }
//         }
//         @keyframes floaty {
//           0%,
//           100% {
//             translate: 0 0;
//           }
//           50% {
//             translate: 0 -6px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }
// // thanks chatgpt for the help you are the real mvp for this one <3
// function formatCountdown(ms: number) {
//   const totalSeconds = Math.floor(ms / 1000);
//   const days = Math.floor(totalSeconds / 86400);
//   const hours = Math.floor((totalSeconds % 86400) / 3600);
//   const minutes = Math.floor((totalSeconds % 3600) / 60);
//   const seconds = totalSeconds % 60;
//   return { days, hours, minutes, seconds };
// }


// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import { auth } from "@/lib/firebase";
// import {
//   GoogleAuthProvider,
//   onAuthStateChanged,
//   signInWithPopup,
//   signOut,
//   User,
// } from "firebase/auth";

// // Phoenix is UTC-7 year-round (no DST)
// const TOURNAMENT_START_ISO = "2026-02-18T19:00:00-07:00"; // Feb 18 @ 7:00 PM Phoenix (first game)
// const CHAMPIONSHIP_ISO = "2026-03-07T19:00:00-07:00"; // March 7 @ 7:00 PM Phoenix (edit if different)

// type Phase = "prestart" | "inprogress" | "complete";

// export default function HomePage() {
//   const [user, setUser] = useState<User | null>(null);
//   const [checking, setChecking] = useState(true);
//   const [status, setStatus] = useState("");

//   const tournamentStart = useMemo(() => new Date(TOURNAMENT_START_ISO), []);
//   const championship = useMemo(() => new Date(CHAMPIONSHIP_ISO), []);
//   const [now, setNow] = useState(() => Date.now());

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (u) => {
//       setUser(u);
//       setChecking(false);
//     });
//     return () => unsub();
//   }, []);

//   useEffect(() => {
//     const t = setInterval(() => setNow(Date.now()), 1000);
//     return () => clearInterval(t);
//   }, []);

//   const phase: Phase =
//     now < tournamentStart.getTime()
//       ? "prestart"
//       : now < championship.getTime()
//       ? "inprogress"
//       : "complete";

//   const targetDate = phase === "prestart" ? tournamentStart : championship;

//   const diffMs = targetDate.getTime() - now;
//   const safeDiffMs = Math.max(0, diffMs);
//   const countdown = formatCountdown(safeDiffMs);

//   const tournamentStartPhoenixText = useMemo(
//     () => formatPhoenix(tournamentStart),
//     [tournamentStart]
//   );
//   const championshipPhoenixText = useMemo(
//     () => formatPhoenix(championship),
//     [championship]
//   );
//   const targetPhoenixText = useMemo(
//     () => formatPhoenix(targetDate),
//     [targetDate]
//   );

//   async function doGoogleSignIn() {
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

//   const countdownTitle =
//     phase === "prestart"
//       ? "Tournament Tip-off Countdown"
//       : phase === "inprogress"
//       ? "Championship Countdown"
//       : "Championship Status";

//   const countdownLines =
//     phase === "prestart"
//       ? [
//           `First game (Phoenix): ${tournamentStartPhoenixText}`,
//           `${countdown.days}d ${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`,
//           `Championship (Phoenix): ${championshipPhoenixText}`,
//         ]
//       : phase === "inprogress"
//       ? [
//           `Championship (Phoenix): ${targetPhoenixText}`,
//           `${countdown.days}d ${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`,
//         ]
//       : [
//           `Championship (Phoenix): ${championshipPhoenixText}`,
//           "Tournament complete.",
//         ];

//   const badge =
//     phase === "inprogress"
//       ? { type: "live" as const, text: "LIVE" }
//       : phase === "complete"
//       ? { type: "done" as const, text: "COMPLETE" }
//       : null;

//   return (
//     <main className="wrap">
//       <div className="stage">
//         <div className="bgSpotlights" aria-hidden="true" />
//         <div className="bgVignette" aria-hidden="true" />

//         <header className="hero">
//           <div className="topRow">
//             <div className="brand">
//               <img
//                 className="brandLogo"
//                 src="/brand/aia.png"
//                 alt="AIA"
//                 onError={(e) => {
//                   (e.currentTarget as HTMLImageElement).style.display = "none";
//                 }}
//               />

//               <div className="brandText">
//                 <div className="title">
//                   2026 AIA Boys Basketball Open State Championship
//                 </div>

//                 {/* AIA-style stripe bar */}
//                 <div className="aiaStripe" aria-hidden="true" />

//                 <div className="subtitle">
//                   Predict the matchups between the top 32 teams in Arizona high
//                   school basketball, and who will take home the trophy in Arizona
//                   Veterans Memorial Coliseum on March 7th! Fill out your bracket
//                   and compete against others to see who can have the most accurate
//                   bracket.
//                 </div>
//               </div>
//             </div>

//             <div className="ballCol">
//               <SpinningBasketball />
//             </div>
//           </div>

//           <div className="cardsRow">
//             <InfoCard
//               title={countdownTitle}
//               icon="⏳"
//               accent="green"
//               badge={badge}
//               lines={countdownLines}
//             />

//             <InfoCard
//               title="Scoring"
//               icon="🏀"
//               accent="blue"
//               lines={[
//                 "Round 1 = 1 point per correct pick",
//                 "Round 2 = 2 points",
//                 "Round 3 = 4 points",
//                 "Round 4 = 8 points",
//                 "Final = 16 points",
//               ]}
//             />
//           </div>

//           <section className="panel">
//             {checking ? (
//               <div className="muted">Loading…</div>
//             ) : user ? (
//               <>
//                 <div className="signedIn">
//                   <div className="muted">Signed in as</div>
//                   <div className="who">{user.displayName ?? user.email ?? "User"}</div>
//                   {user.email ? <div className="muted">{user.email}</div> : null}
//                 </div>

//                 <div className="btnRow">
//                   <Link className="btn" href="/my-bracket">
//                     My Bracket
//                   </Link>
//                   <Link className="btn" href="/bracket">
//                     Live Bracket
//                   </Link>
//                   <Link className="btn" href="/leaderboard">
//                     Leaderboard
//                   </Link>

//                   <button className="btnGhost" onClick={doSignOut}>
//                     Sign out
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div className="signedOut">
//                   <div className="muted">
//                     Sign in to create and submit your bracket. Once submitted, it locks.
//                   </div>
//                 </div>

//                 <div className="btnRow">
//                   <button className="btn" onClick={doGoogleSignIn}>
//                     Sign in with Google
//                   </button>

//                   <Link className="btn" href="/bracket">
//                     View Live Bracket
//                   </Link>

//                   <Link className="btn" href="/leaderboard">
//                     View Leaderboard
//                   </Link>
//                 </div>
//               </>
//             )}

//             {status ? <div className="status">{status}</div> : null}
//           </section>

//           <section className="howToPlay">
//             <div className="howTitle">How to play</div>
//             <ol className="howList">
//               <li>
//                 Go to <b>My Bracket</b> and pick winners (later rounds auto-fill).
//               </li>
//               <li>
//                 Hit <b>Submit Bracket</b> to lock your picks before tip-off:{" "}
//                 <b>{tournamentStartPhoenixText}</b>.
//               </li>
//               <li>
//                 Watch <b>Live Bracket</b> + <b>Leaderboard</b> update as winners are set.
//               </li>
//             </ol>
//           </section>
//         </header>
//       </div>

//       <style jsx>{`
//         .wrap {
//           padding: 28px 18px 40px;
//           color: #fff;
//           display: flex;
//           justify-content: center;
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
//           background: radial-gradient(1200px 700px at 50% 10%, rgba(0,0,0,0), rgba(0,0,0,0.65));
//           pointer-events: none;
//         }

//         .hero {
//           position: relative;
//           padding: 22px;
//         }

//         .topRow {
//           display: grid;
//           grid-template-columns: 1fr auto;
//           gap: 18px;
//           align-items: start;
//         }

//         .brand {
//           display: flex;
//           gap: 14px;
//           align-items: flex-start;
//         }

//         .brandLogo {
//           width: 120px;
//           height: auto;
//           filter: drop-shadow(0 12px 22px rgba(0, 0, 0, 0.45));
//           border-radius: 10px;
//         }

//         .brandText .title {
//           font-size: 22px;
//           font-weight: 780;
//           letter-spacing: 0.2px;
//           margin-bottom: 10px;
//         }

//         .aiaStripe {
//           height: 10px;
//           width: min(520px, 100%);
//           border-radius: 999px;
//           margin-bottom: 12px;
//           opacity: 0.95;
//           background: linear-gradient(
//             90deg,
//             #1f6db3 0%,
//             #1f6db3 62%,
//             #f2c230 62%,
//             #f2c230 78%,
//             #d6463a 78%,
//             #d6463a 100%
//           );
//           box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
//           border: 1px solid rgba(255,255,255,0.10);
//         }

//         .brandText .subtitle {
//           font-size: 16px;
//           line-height: 24px;
//           color: rgba(255, 255, 255, 0.80);
//           max-width: 860px;
//         }

//         .ballCol {
//           display: flex;
//           justify-content: flex-end;
//           padding-top: 6px;
//         }

//         .cardsRow {
//           margin-top: 18px;
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 12px;
//         }

//         .panel {
//           margin-top: 16px;
//           border: 1px solid rgba(255, 255, 255, 0.12);
//           border-radius: 18px;
//           background: rgba(255, 255, 255, 0.04);
//           box-shadow: 0 18px 45px rgba(0, 0, 0, 0.35);
//           padding: 18px;
//         }

//         .muted {
//           color: rgba(255, 255, 255, 0.72);
//         }

//         .who {
//           font-size: 18px;
//           font-weight: 780;
//           margin: 2px 0 2px;
//         }

//         .btnRow {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 10px;
//           align-items: center;
//           margin-top: 14px;
//         }

//         /* All buttons have a visible border */
//         .btn,
//         .btnGhost {
//           border-radius: 12px;
//           padding: 11px 14px;
//           border: 1px solid rgba(255, 255, 255, 0.28);
//           text-decoration: none;
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           font-weight: 720;
//           cursor: pointer;
//           user-select: none;
//           transition: transform 120ms ease, background 120ms ease, border 120ms ease;
//         }

//         .btn {
//           background: rgba(255, 255, 255, 0.10);
//           color: #fff;
//         }

//         .btnGhost {
//           background: rgba(0, 0, 0, 0.22);
//           color: rgba(255, 255, 255, 0.92);
//         }

//         .btn:hover,
//         .btnGhost:hover {
//           transform: translateY(-1px);
//           border: 1px solid rgba(255, 255, 255, 0.40);
//           background: rgba(255, 255, 255, 0.13);
//         }

//         .btnGhost:hover {
//           background: rgba(255, 255, 255, 0.08);
//         }

//         .btnGhost:active,
//         .btn:active {
//           transform: translateY(0px);
//         }

//         .status {
//           margin-top: 12px;
//           color: rgba(183, 255, 183, 0.95);
//         }

//         .howToPlay {
//           margin-top: 14px;
//           border: 1px solid rgba(255, 255, 255, 0.10);
//           border-radius: 18px;
//           background: rgba(0, 0, 0, 0.18);
//           padding: 14px 16px;
//         }

//         .howTitle {
//           font-weight: 800;
//           letter-spacing: 0.2px;
//           margin-bottom: 8px;
//           color: rgba(255, 255, 255, 0.92);
//         }

//         .howList {
//           margin: 0;
//           padding-left: 18px;
//           color: rgba(255, 255, 255, 0.72);
//           line-height: 20px;
//           font-size: 13px;
//         }

//         .howList li {
//           margin: 6px 0;
//         }

//         @media (max-width: 920px) {
//           .topRow {
//             grid-template-columns: 1fr;
//           }
//           .ballCol {
//             justify-content: flex-start;
//           }
//           .cardsRow {
//             grid-template-columns: 1fr;
//           }
//           .brand {
//             flex-direction: column;
//           }
//           .brandLogo {
//             width: 160px;
//           }
//         }
//       `}</style>
//     </main>
//   );
// }

// function InfoCard({
//   title,
//   icon,
//   lines,
//   accent,
//   badge,
// }: {
//   title: string;
//   icon: string;
//   lines: string[];
//   accent: "green" | "blue";
//   badge?: { type: "live" | "done"; text: string } | null;
// }) {
//   const accentBorder =
//     accent === "green"
//       ? "rgba(120,255,170,0.30)"
//       : "rgba(120,180,255,0.30)";
//   const accentBg =
//     accent === "green"
//       ? "rgba(120,255,170,0.07)"
//       : "rgba(120,180,255,0.07)";

//   return (
//     <div className="icard">
//       <div className="ihead">
//         <div className="ititle">
//           <span className="icon">{icon}</span> {title}
//         </div>

//         {badge?.type === "live" ? (
//           <div className="pillLive" title="Tournament has started">
//             <span className="dot" /> {badge.text}
//           </div>
//         ) : badge?.type === "done" ? (
//           <div className="pillDone" title="Tournament complete">
//             {badge.text}
//           </div>
//         ) : null}
//       </div>

//       <div className="ibody">
//         {lines.map((l, idx) => (
//           <div key={idx} className="iline">
//             {l}
//           </div>
//         ))}
//       </div>

//       <style jsx>{`
//         .icard {
//           border: 1px solid ${accentBorder};
//           background: ${accentBg};
//           border-radius: 18px;
//           padding: 14px;
//           box-shadow: 0 14px 35px rgba(0, 0, 0, 0.30);
//         }
//         .ihead {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 10px;
//           gap: 10px;
//         }
//         .ititle {
//           font-weight: 780;
//           letter-spacing: 0.2px;
//           display: flex;
//           align-items: center;
//           gap: 6px;
//         }
//         .ibody {
//           color: rgba(255, 255, 255, 0.80);
//           line-height: 20px;
//           font-size: 14px;
//         }
//         .iline {
//           margin-top: 6px;
//         }
//         .iline:first-child {
//           margin-top: 0;
//         }

//         .pillLive {
//           display: inline-flex;
//           align-items: center;
//           gap: 8px;
//           padding: 6px 10px;
//           border-radius: 999px;
//           border: 1px solid rgba(255, 120, 120, 0.45);
//           background: rgba(255, 90, 90, 0.10);
//           color: rgba(255, 230, 230, 0.95);
//           font-weight: 900;
//           letter-spacing: 0.4px;
//           font-size: 12px;
//           white-space: nowrap;
//         }
//         .dot {
//           width: 8px;
//           height: 8px;
//           border-radius: 999px;
//           background: rgba(255, 90, 90, 0.95);
//           box-shadow: 0 0 14px rgba(255, 90, 90, 0.75);
//           animation: pulse 1.1s ease-in-out infinite;
//         }

//         .pillDone {
//           padding: 6px 10px;
//           border-radius: 999px;
//           border: 1px solid rgba(180, 210, 255, 0.35);
//           background: rgba(120, 180, 255, 0.10);
//           color: rgba(220, 235, 255, 0.95);
//           font-weight: 900;
//           letter-spacing: 0.4px;
//           font-size: 12px;
//           white-space: nowrap;
//         }

//         @keyframes pulse {
//           0%,
//           100% {
//             transform: scale(1);
//             opacity: 1;
//           }
//           50% {
//             transform: scale(1.35);
//             opacity: 0.75;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// function SpinningBasketball() {
//   return (
//     <div className="ballWrap" aria-hidden="true">
//       <div className="ball">
//         <svg viewBox="0 0 100 100" className="ballSvg">
//           <defs>
//             <radialGradient id="g" cx="30%" cy="30%" r="70%">
//               <stop offset="0%" stopColor="#ffb36b" stopOpacity="1" />
//               <stop offset="55%" stopColor="#e67e22" stopOpacity="1" />
//               <stop offset="100%" stopColor="#b85a14" stopOpacity="1" />
//             </radialGradient>
//           </defs>
//           <circle cx="50" cy="50" r="48" fill="url(#g)" />
//           <circle
//             cx="50"
//             cy="50"
//             r="48"
//             fill="none"
//             stroke="rgba(0,0,0,0.35)"
//             strokeWidth="2"
//           />
//           <path d="M50 2 v96" stroke="rgba(0,0,0,0.55)" strokeWidth="3" />
//           <path d="M2 50 h96" stroke="rgba(0,0,0,0.55)" strokeWidth="3" />
//           <path
//             d="M18 10 C40 30, 40 70, 18 90"
//             fill="none"
//             stroke="rgba(0,0,0,0.55)"
//             strokeWidth="3"
//           />
//           <path
//             d="M82 10 C60 30, 60 70, 82 90"
//             fill="none"
//             stroke="rgba(0,0,0,0.55)"
//             strokeWidth="3"
//           />
//         </svg>
//       </div>

//       <style jsx>{`
//         .ballWrap {
//           width: 120px;
//           height: 120px;
//           display: grid;
//           place-items: center;
//           filter: drop-shadow(0 14px 24px rgba(0, 0, 0, 0.45));
//         }
//         .ball {
//           width: 106px;
//           height: 106px;
//           border-radius: 999px;
//           animation: spin 2.8s linear infinite, floaty 3.2s ease-in-out infinite;
//           transform-origin: 50% 50%;
//         }
//         .ballSvg {
//           width: 100%;
//           height: 100%;
//           border-radius: 999px;
//           display: block;
//         }
//         @keyframes spin {
//           from {
//             transform: rotate(0deg);
//           }
//           to {
//             transform: rotate(360deg);
//           }
//         }
//         @keyframes floaty {
//           0%,
//           100% {
//             translate: 0 0;
//           }
//           50% {
//             translate: 0 -6px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// function formatCountdown(ms: number) {
//   const totalSeconds = Math.floor(ms / 1000);
//   const days = Math.floor(totalSeconds / 86400);
//   const hours = Math.floor((totalSeconds % 86400) / 3600);
//   const minutes = Math.floor((totalSeconds % 3600) / 60);
//   const seconds = totalSeconds % 60;
//   return { days, hours, minutes, seconds };
// }

// function formatPhoenix(d: Date) {
//   try {
//     return new Intl.DateTimeFormat("en-US", {
//       timeZone: "America/Phoenix",
//       dateStyle: "full",
//       timeStyle: "short",
//     }).format(d);
//   } catch {
//     return d.toLocaleString();
//   }
// }


// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import { auth } from "@/lib/firebase";
// import {
//   GoogleAuthProvider,
//   onAuthStateChanged,
//   signInWithPopup,
//   signOut,
//   User,
// } from "firebase/auth";

// // Phoenix is UTC-7 year-round (no DST)
// const TOURNAMENT_START_ISO = "2026-02-18T19:00:00-07:00"; // Feb 18 @ 7:00 PM Phoenix (first game)
// const CHAMPIONSHIP_ISO = "2026-03-07T19:00:00-07:00"; // March 7 @ 7:00 PM Phoenix (edit if different)

// type Phase = "prestart" | "inprogress" | "complete";

// export default function HomePage() {
//   const [user, setUser] = useState<User | null>(null);
//   const [checking, setChecking] = useState(true);
//   const [status, setStatus] = useState("");

//   const tournamentStart = useMemo(() => new Date(TOURNAMENT_START_ISO), []);
//   const championship = useMemo(() => new Date(CHAMPIONSHIP_ISO), []);
//   const [now, setNow] = useState(() => Date.now());

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (u) => {
//       setUser(u);
//       setChecking(false);
//     });
//     return () => unsub();
//   }, []);

//   useEffect(() => {
//     const t = setInterval(() => setNow(Date.now()), 1000);
//     return () => clearInterval(t);
//   }, []);

//   const phase: Phase =
//     now < tournamentStart.getTime()
//       ? "prestart"
//       : now < championship.getTime()
//       ? "inprogress"
//       : "complete";

//   const targetDate = phase === "prestart" ? tournamentStart : championship;

//   const diffMs = targetDate.getTime() - now;
//   const safeDiffMs = Math.max(0, diffMs);
//   const countdown = formatCountdown(safeDiffMs);

//   const tournamentStartPhoenixText = useMemo(
//     () => formatPhoenix(tournamentStart),
//     [tournamentStart]
//   );
//   const championshipPhoenixText = useMemo(
//     () => formatPhoenix(championship),
//     [championship]
//   );
//   const targetPhoenixText = useMemo(
//     () => formatPhoenix(targetDate),
//     [targetDate]
//   );

//   async function doGoogleSignIn() {
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

//   const countdownTitle =
//     phase === "prestart"
//       ? "Tournament Tip-off Countdown"
//       : phase === "inprogress"
//       ? "Championship Countdown"
//       : "Championship Status";

//   const countdownLines =
//     phase === "prestart"
//       ? [
//           `First game (Phoenix): ${tournamentStartPhoenixText}`,
//           `${countdown.days}d ${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`,
//           `Championship (Phoenix): ${championshipPhoenixText}`,
//         ]
//       : phase === "inprogress"
//       ? [
//           `Championship (Phoenix): ${targetPhoenixText}`,
//           `${countdown.days}d ${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`,
//         ]
//       : [
//           `Championship (Phoenix): ${championshipPhoenixText}`,
//           "Tournament complete.",
//         ];

//   const badge =
//     phase === "inprogress"
//       ? { type: "live" as const, text: "LIVE" }
//       : phase === "complete"
//       ? { type: "done" as const, text: "COMPLETE" }
//       : null;

//   return (
//     <main className="wrap">
//       <div className="stage">
//         <div className="bgSpotlights" aria-hidden="true" />
//         <div className="bgVignette" aria-hidden="true" />

//         <header className="hero">
//           <div className="topRow">
//             <div className="brand">
//               <img
//                 className="brandLogo"
//                 src="/brand/aia.png"
//                 alt="AIA"
//                 onError={(e) => {
//                   (e.currentTarget as HTMLImageElement).style.display = "none";
//                 }}
//               />

//               <div className="brandText">
//                 <div className="title">
//                   2026 AIA Boys Basketball Open State Championship
//                 </div>

//                 {/* AIA-style stripe bar */}
//                 <div className="aiaStripe" aria-hidden="true" />

//                 <div className="subtitle">
//                   Predict the matchups between the top 32 teams in Arizona high
//                   school basketball, and who will take home the trophy in Arizona
//                   Veterans Memorial Coliseum on March 7th! Fill out your bracket
//                   and compete against others to see who can have the most accurate
//                   bracket.
//                 </div>
//               </div>
//             </div>

//             <div className="ballCol">
//               <SpinningBasketball />
//             </div>
//           </div>

//           <div className="cardsRow">
//             <InfoCard
//               title={countdownTitle}
//               icon="⏳"
//               accent="green"
//               badge={badge}
//               lines={countdownLines}
//             />

//             <InfoCard
//               title="Scoring"
//               icon="🏀"
//               accent="blue"
//               lines={[
//                 "Round 1 = 1 point per correct pick",
//                 "Round 2 = 2 points",
//                 "Round 3 = 4 points",
//                 "Round 4 = 8 points",
//                 "Final = 16 points",
//               ]}
//             />
//           </div>

//           <section className="panel">
//             {checking ? (
//               <div className="muted">Loading…</div>
//             ) : user ? (
//               <>
//                 <div className="signedIn">
//                   <div className="muted">Signed in as</div>
//                   <div className="who">{user.displayName ?? user.email ?? "User"}</div>
//                   {user.email ? <div className="muted">{user.email}</div> : null}
//                 </div>

//                 <div className="btnRow">
//                   <Link className="btn" href="/my-bracket">
//                     My Bracket
//                   </Link>
//                   <Link className="btn" href="/bracket">
//                     Live Bracket
//                   </Link>
//                   <Link className="btn" href="/leaderboard">
//                     Leaderboard
//                   </Link>

//                   <button className="btnGhost" onClick={doSignOut}>
//                     Sign out
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div className="signedOut">
//                   <div className="muted">
//                     Sign in to create and submit your bracket. Once submitted, it locks.
//                   </div>
//                 </div>

//                 <div className="btnRow">
//                   <button className="btn" onClick={doGoogleSignIn}>
//                     Sign in with Google
//                   </button>

//                   <Link className="btn" href="/bracket">
//                     View Live Bracket
//                   </Link>

//                   <Link className="btn" href="/leaderboard">
//                     View Leaderboard
//                   </Link>
//                 </div>
//               </>
//             )}

//             {status ? <div className="status">{status}</div> : null}
//           </section>

//           <section className="howToPlay">
//             <div className="howTitle">How to play</div>
//             <ol className="howList">
//               <li>
//                 Go to <b>My Bracket</b> and pick winners (later rounds auto-fill).
//               </li>
//               <li>
//                 Hit <b>Submit Bracket</b> to lock your picks before tip-off:{" "}
//                 <b>{tournamentStartPhoenixText}</b>.
//               </li>
//               <li>
//                 Watch <b>Live Bracket</b> + <b>Leaderboard</b> update as winners are set.
//               </li>
//             </ol>
//           </section>
//         </header>
//       </div>

//       <style jsx>{`
//         .wrap {
//           padding: 28px 18px 40px;
//           color: #fff;
//           display: flex;
//           justify-content: center;
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
//           background: radial-gradient(1200px 700px at 50% 10%, rgba(0,0,0,0), rgba(0,0,0,0.65));
//           pointer-events: none;
//         }

//         .hero {
//           position: relative;
//           padding: 22px;
//         }

//         .topRow {
//           display: grid;
//           grid-template-columns: 1fr auto;
//           gap: 18px;
//           align-items: start;
//         }

//         .brand {
//           display: flex;
//           gap: 14px;
//           align-items: flex-start;
//         }

//         .brandLogo {
//           width: 120px;
//           height: auto;
//           filter: drop-shadow(0 12px 22px rgba(0, 0, 0, 0.45));
//           border-radius: 10px;
//         }

//         .brandText .title {
//           font-size: 22px;
//           font-weight: 780;
//           letter-spacing: 0.2px;
//           margin-bottom: 10px;
//         }

//         .aiaStripe {
//           height: 10px;
//           width: min(520px, 100%);
//           border-radius: 999px;
//           margin-bottom: 12px;
//           opacity: 0.95;
//           background: linear-gradient(
//             90deg,
//             #1f6db3 0%,
//             #1f6db3 62%,
//             #f2c230 62%,
//             #f2c230 78%,
//             #d6463a 78%,
//             #d6463a 100%
//           );
//           box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
//           border: 1px solid rgba(255,255,255,0.10);
//         }

//         .brandText .subtitle {
//           font-size: 16px;
//           line-height: 24px;
//           color: rgba(255, 255, 255, 0.80);
//           max-width: 860px;
//         }

//         .ballCol {
//           display: flex;
//           justify-content: flex-end;
//           padding-top: 6px;
//         }

//         .cardsRow {
//           margin-top: 18px;
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 12px;
//         }

//         .panel {
//           margin-top: 16px;
//           border: 1px solid rgba(255, 255, 255, 0.12);
//           border-radius: 18px;
//           background: rgba(255, 255, 255, 0.04);
//           box-shadow: 0 18px 45px rgba(0, 0, 0, 0.35);
//           padding: 18px;
//         }

//         .muted {
//           color: rgba(255, 255, 255, 0.72);
//         }

//         .who {
//           font-size: 18px;
//           font-weight: 780;
//           margin: 2px 0 2px;
//         }

//         .btnRow {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 10px;
//           align-items: center;
//           margin-top: 14px;
//         }

//         /* All buttons have a visible border */
//         .btn,
//         .btnGhost {
//           border-radius: 12px;
//           padding: 11px 14px;
//           border: 1px solid rgba(255, 255, 255, 0.28);
//           text-decoration: none;
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           font-weight: 720;
//           cursor: pointer;
//           user-select: none;
//           transition: transform 120ms ease, background 120ms ease, border 120ms ease;
//         }

//         .btn {
//           background: rgba(255, 255, 255, 0.10);
//           color: #fff;
//         }

//         .btnGhost {
//           background: rgba(0, 0, 0, 0.22);
//           color: rgba(255, 255, 255, 0.92);
//         }

//         .btn:hover,
//         .btnGhost:hover {
//           transform: translateY(-1px);
//           border: 1px solid rgba(255, 255, 255, 0.40);
//           background: rgba(255, 255, 255, 0.13);
//         }

//         .btnGhost:hover {
//           background: rgba(255, 255, 255, 0.08);
//         }

//         .btnGhost:active,
//         .btn:active {
//           transform: translateY(0px);
//         }

//         .status {
//           margin-top: 12px;
//           color: rgba(183, 255, 183, 0.95);
//         }

//         .howToPlay {
//           margin-top: 14px;
//           border: 1px solid rgba(255, 255, 255, 0.10);
//           border-radius: 18px;
//           background: rgba(0, 0, 0, 0.18);
//           padding: 14px 16px;
//         }

//         .howTitle {
//           font-weight: 800;
//           letter-spacing: 0.2px;
//           margin-bottom: 8px;
//           color: rgba(255, 255, 255, 0.92);
//         }

//         .howList {
//           margin: 0;
//           padding-left: 18px;
//           color: rgba(255, 255, 255, 0.72);
//           line-height: 20px;
//           font-size: 13px;
//         }

//         .howList li {
//           margin: 6px 0;
//         }

//         @media (max-width: 920px) {
//           .topRow {
//             grid-template-columns: 1fr;
//           }
//           .ballCol {
//             justify-content: flex-start;
//           }
//           .cardsRow {
//             grid-template-columns: 1fr;
//           }
//           .brand {
//             flex-direction: column;
//           }
//           .brandLogo {
//             width: 160px;
//           }
//         }
//       `}</style>
//     </main>
//   );
// }

// function InfoCard({
//   title,
//   icon,
//   lines,
//   accent,
//   badge,
// }: {
//   title: string;
//   icon: string;
//   lines: string[];
//   accent: "green" | "blue";
//   badge?: { type: "live" | "done"; text: string } | null;
// }) {
//   const accentBorder =
//     accent === "green"
//       ? "rgba(120,255,170,0.30)"
//       : "rgba(120,180,255,0.30)";
//   const accentBg =
//     accent === "green"
//       ? "rgba(120,255,170,0.07)"
//       : "rgba(120,180,255,0.07)";

//   return (
//     <div className="icard">
//       <div className="ihead">
//         <div className="ititle">
//           <span className="icon">{icon}</span> {title}
//         </div>

//         {badge?.type === "live" ? (
//           <div className="pillLive" title="Tournament has started">
//             <span className="dot" /> {badge.text}
//           </div>
//         ) : badge?.type === "done" ? (
//           <div className="pillDone" title="Tournament complete">
//             {badge.text}
//           </div>
//         ) : null}
//       </div>

//       <div className="ibody">
//         {lines.map((l, idx) => (
//           <div key={idx} className="iline">
//             {l}
//           </div>
//         ))}
//       </div>

//       <style jsx>{`
//         .icard {
//           border: 1px solid ${accentBorder};
//           background: ${accentBg};
//           border-radius: 18px;
//           padding: 14px;
//           box-shadow: 0 14px 35px rgba(0, 0, 0, 0.30);
//         }
//         .ihead {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 10px;
//           gap: 10px;
//         }
//         .ititle {
//           font-weight: 780;
//           letter-spacing: 0.2px;
//           display: flex;
//           align-items: center;
//           gap: 6px;
//         }
//         .ibody {
//           color: rgba(255, 255, 255, 0.80);
//           line-height: 20px;
//           font-size: 14px;
//         }
//         .iline {
//           margin-top: 6px;
//         }
//         .iline:first-child {
//           margin-top: 0;
//         }

//         .pillLive {
//           display: inline-flex;
//           align-items: center;
//           gap: 8px;
//           padding: 6px 10px;
//           border-radius: 999px;
//           border: 1px solid rgba(255, 120, 120, 0.45);
//           background: rgba(255, 90, 90, 0.10);
//           color: rgba(255, 230, 230, 0.95);
//           font-weight: 900;
//           letter-spacing: 0.4px;
//           font-size: 12px;
//           white-space: nowrap;
//         }
//         .dot {
//           width: 8px;
//           height: 8px;
//           border-radius: 999px;
//           background: rgba(255, 90, 90, 0.95);
//           box-shadow: 0 0 14px rgba(255, 90, 90, 0.75);
//           animation: pulse 1.1s ease-in-out infinite;
//         }

//         .pillDone {
//           padding: 6px 10px;
//           border-radius: 999px;
//           border: 1px solid rgba(180, 210, 255, 0.35);
//           background: rgba(120, 180, 255, 0.10);
//           color: rgba(220, 235, 255, 0.95);
//           font-weight: 900;
//           letter-spacing: 0.4px;
//           font-size: 12px;
//           white-space: nowrap;
//         }

//         @keyframes pulse {
//           0%,
//           100% {
//             transform: scale(1);
//             opacity: 1;
//           }
//           50% {
//             transform: scale(1.35);
//             opacity: 0.75;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// function SpinningBasketball() {
//   return (
//     <div className="ballWrap" aria-hidden="true">
//       <div className="ball">
//         <svg viewBox="0 0 100 100" className="ballSvg">
//           <defs>
//             <radialGradient id="g" cx="30%" cy="30%" r="70%">
//               <stop offset="0%" stopColor="#ffb36b" stopOpacity="1" />
//               <stop offset="55%" stopColor="#e67e22" stopOpacity="1" />
//               <stop offset="100%" stopColor="#b85a14" stopOpacity="1" />
//             </radialGradient>
//           </defs>
//           <circle cx="50" cy="50" r="48" fill="url(#g)" />
//           <circle
//             cx="50"
//             cy="50"
//             r="48"
//             fill="none"
//             stroke="rgba(0,0,0,0.35)"
//             strokeWidth="2"
//           />
//           <path d="M50 2 v96" stroke="rgba(0,0,0,0.55)" strokeWidth="3" />
//           <path d="M2 50 h96" stroke="rgba(0,0,0,0.55)" strokeWidth="3" />
//           <path
//             d="M18 10 C40 30, 40 70, 18 90"
//             fill="none"
//             stroke="rgba(0,0,0,0.55)"
//             strokeWidth="3"
//           />
//           <path
//             d="M82 10 C60 30, 60 70, 82 90"
//             fill="none"
//             stroke="rgba(0,0,0,0.55)"
//             strokeWidth="3"
//           />
//         </svg>
//       </div>

//       <style jsx>{`
//         .ballWrap {
//           width: 120px;
//           height: 120px;
//           display: grid;
//           place-items: center;
//           filter: drop-shadow(0 14px 24px rgba(0, 0, 0, 0.45));
//         }
//         .ball {
//           width: 106px;
//           height: 106px;
//           border-radius: 999px;
//           animation: spin 2.8s linear infinite, floaty 3.2s ease-in-out infinite;
//           transform-origin: 50% 50%;
//         }
//         .ballSvg {
//           width: 100%;
//           height: 100%;
//           border-radius: 999px;
//           display: block;
//         }
//         @keyframes spin {
//           from {
//             transform: rotate(0deg);
//           }
//           to {
//             transform: rotate(360deg);
//           }
//         }
//         @keyframes floaty {
//           0%,
//           100% {
//             translate: 0 0;
//           }
//           50% {
//             translate: 0 -6px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// function formatCountdown(ms: number) {
//   const totalSeconds = Math.floor(ms / 1000);
//   const days = Math.floor(totalSeconds / 86400);
//   const hours = Math.floor((totalSeconds % 86400) / 3600);
//   const minutes = Math.floor((totalSeconds % 3600) / 60);
//   const seconds = totalSeconds % 60;
//   return { days, hours, minutes, seconds };
// }

// function formatPhoenix(d: Date) {
//   try {
//     return new Intl.DateTimeFormat("en-US", {
//       timeZone: "America/Phoenix",
//       dateStyle: "full",
//       timeStyle: "short",
//     }).format(d);
//   } catch {
//     return d.toLocaleString();
//   }
// }


// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import { auth } from "@/lib/firebase";
// import {
//   GoogleAuthProvider,
//   onAuthStateChanged,
//   signInWithPopup,
//   signOut,
//   User,
// } from "firebase/auth";

// // Phoenix is UTC-7 year-round (no DST)
// const TOURNAMENT_START_ISO = "2026-02-18T19:00:00-07:00"; // Feb 18 @ 7:00 PM Phoenix (first game)
// const CHAMPIONSHIP_ISO = "2026-03-07T19:00:00-07:00"; // March 7 @ 7:00 PM Phoenix (edit if different)

// type Phase = "prestart" | "inprogress" | "complete";

// export default function HomePage() {
//   const [user, setUser] = useState<User | null>(null);
//   const [checking, setChecking] = useState(true);
//   const [status, setStatus] = useState("");

//   const tournamentStart = useMemo(() => new Date(TOURNAMENT_START_ISO), []);
//   const championship = useMemo(() => new Date(CHAMPIONSHIP_ISO), []);
//   const [now, setNow] = useState(() => Date.now());

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (u) => {
//       setUser(u);
//       setChecking(false);
//     });
//     return () => unsub();
//   }, []);

//   useEffect(() => {
//     const t = setInterval(() => setNow(Date.now()), 1000);
//     return () => clearInterval(t);
//   }, []);

//   const phase: Phase =
//     now < tournamentStart.getTime()
//       ? "prestart"
//       : now < championship.getTime()
//       ? "inprogress"
//       : "complete";

//   const targetDate = phase === "prestart" ? tournamentStart : championship;

//   const diffMs = targetDate.getTime() - now;
//   const safeDiffMs = Math.max(0, diffMs);
//   const countdown = formatCountdown(safeDiffMs);

//   const tournamentStartPhoenixText = useMemo(
//     () => formatPhoenix(tournamentStart),
//     [tournamentStart]
//   );
//   const championshipPhoenixText = useMemo(
//     () => formatPhoenix(championship),
//     [championship]
//   );
//   const targetPhoenixText = useMemo(() => formatPhoenix(targetDate), [targetDate]);

//   async function doGoogleSignIn() {
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

//   const countdownTitle =
//     phase === "prestart"
//       ? "Tournament Tip-off Countdown"
//       : phase === "inprogress"
//       ? "Championship Countdown"
//       : "Championship Status";

//   // ✅ CHANGED: "First game" -> "Round starts"
//   const countdownLines =
//     phase === "prestart"
//       ? [
//           `Round starts (Phoenix): ${tournamentStartPhoenixText}`,
//           `${countdown.days}d ${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`,
//           `Championship (Phoenix): ${championshipPhoenixText}`,
//         ]
//       : phase === "inprogress"
//       ? [
//           `Championship (Phoenix): ${targetPhoenixText}`,
//           `${countdown.days}d ${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`,
//         ]
//       : [`Championship (Phoenix): ${championshipPhoenixText}`, "Tournament complete."];

//   const badge =
//     phase === "inprogress"
//       ? { type: "live" as const, text: "LIVE" }
//       : phase === "complete"
//       ? { type: "done" as const, text: "COMPLETE" }
//       : null;

//   return (
//     <main className="wrap">
//       <div className="stage">
//         <div className="bgSpotlights" aria-hidden="true" />
//         <div className="bgVignette" aria-hidden="true" />

//         <header className="hero">
//           <div className="topRow">
//             <div className="brand">
//               <img
//                 className="brandLogo"
//                 src="/brand/aia.png"
//                 alt="AIA"
//                 onError={(e) => {
//                   (e.currentTarget as HTMLImageElement).style.display = "none";
//                 }}
//               />

//               <div className="brandText">
//                 <div className="title">2026 AIA Boys Basketball Open State Championship</div>

//                 <div className="aiaStripe" aria-hidden="true" />

//                 <div className="subtitle">
//                   Predict the matchups between the top 32 teams in Arizona high school
//                   basketball, and who will take home the trophy in Arizona Veterans
//                   Memorial Coliseum on March 7th! Fill out your bracket and compete
//                   against others to see who can have the most accurate bracket.
//                 </div>
//               </div>
//             </div>

//             <div className="ballCol">
//               <SpinningBasketball />
//             </div>
//           </div>

//           <div className="cardsRow">
//             <InfoCard
//               title={countdownTitle}
//               icon="⏳"
//               accent="green"
//               badge={badge}
//               lines={countdownLines}
//             />

//             <InfoCard
//               title="Scoring"
//               icon="🏀"
//               accent="blue"
//               lines={[
//                 "Round 1 = 1 point per correct pick",
//                 "Round 2 = 2 points",
//                 "Round 3 = 4 points",
//                 "Round 4 = 8 points",
//                 "Final = 16 points",
//               ]}
//             />
//           </div>

//           <section className="panel">
//             {checking ? (
//               <div className="muted">Loading…</div>
//             ) : user ? (
//               <>
//                 <div className="signedIn">
//                   <div className="muted">Signed in as</div>
//                   <div className="who">{user.displayName ?? user.email ?? "User"}</div>
//                   {user.email ? <div className="muted">{user.email}</div> : null}
//                 </div>

//                 {/* ✅ FIXED: Link buttons now render as real <a> tags inside component */}
//                 <div className="btnRow">
//                   <Link href="/my-bracket" legacyBehavior>
//                     <a className="btn btnBlue">My Bracket</a>
//                   </Link>

//                   <Link href="/bracket" legacyBehavior>
//                     <a className="btn btnGold">Live Bracket</a>
//                   </Link>

//                   <Link href="/leaderboard" legacyBehavior>
//                     <a className="btn btnRed">Leaderboard</a>
//                   </Link>

//                   <button className="btnGhost" onClick={doSignOut}>
//                     Sign out
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div className="signedOut">
//                   <div className="muted">
//                     Sign in to create and submit your bracket. Once submitted, it locks.
//                   </div>
//                 </div>

//                 <div className="btnRow">
//                   <button className="btn btnBlue" onClick={doGoogleSignIn}>
//                     Sign in with Google
//                   </button>

//                   <Link href="/bracket" legacyBehavior>
//                     <a className="btn btnGold">View Live Bracket</a>
//                   </Link>

//                   <Link href="/leaderboard" legacyBehavior>
//                     <a className="btn btnRed">View Leaderboard</a>
//                   </Link>
//                 </div>
//               </>
//             )}

//             {status ? <div className="status">{status}</div> : null}
//           </section>

//           <section className="howToPlay">
//             <div className="howTitle">How to play</div>
//             <ol className="howList">
//               <li>
//                 Go to <b>My Bracket</b> and pick winners (later rounds auto-fill).
//               </li>
//               <li>
//                 Hit <b>Submit Bracket</b> to lock your picks before tip-off:{" "}
//                 <b>{tournamentStartPhoenixText}</b>.
//               </li>
//               <li>
//                 Watch <b>Live Bracket</b> + <b>Leaderboard</b> update as winners are set.
//               </li>
//             </ol>
//           </section>
//         </header>
//       </div>

//       <style jsx>{`
//         .wrap {
//           /* ✅ Extra bottom padding so fixed footer doesn't cover content */
//           padding: 28px 18px 110px;
//           color: #fff;
//           display: flex;
//           justify-content: center;
//         }

//         .stage {
//           width: 100%;
//           max-width: 1120px;
//           position: relative;
//           border-radius: 22px;
//           overflow: hidden;
//           border: 1px solid rgba(255, 255, 255, 0.1);
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
//           background: radial-gradient(1200px 700px at 50% 10%, rgba(0,0,0,0), rgba(0,0,0,0.65));
//           pointer-events: none;
//         }

//         .hero {
//           position: relative;
//           padding: 22px;
//         }

//         .topRow {
//           display: grid;
//           grid-template-columns: 1fr auto;
//           gap: 18px;
//           align-items: start;
//         }

//         .brand {
//           display: flex;
//           gap: 14px;
//           align-items: flex-start;
//         }

//         .brandLogo {
//           width: 120px;
//           height: auto;
//           filter: drop-shadow(0 12px 22px rgba(0, 0, 0, 0.45));
//           border-radius: 10px;
//         }

//         .brandText .title {
//           font-size: 22px;
//           font-weight: 780;
//           letter-spacing: 0.2px;
//           margin-bottom: 10px;
//         }

//         .aiaStripe {
//           height: 10px;
//           width: min(520px, 100%);
//           border-radius: 999px;
//           margin-bottom: 12px;
//           opacity: 0.95;
//           background: linear-gradient(
//             90deg,
//             #1f6db3 0%,
//             #1f6db3 62%,
//             #f2c230 62%,
//             #f2c230 78%,
//             #d6463a 78%,
//             #d6463a 100%
//           );
//           box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
//           border: 1px solid rgba(255,255,255,0.10);
//         }

//         .brandText .subtitle {
//           font-size: 16px;
//           line-height: 24px;
//           color: rgba(255, 255, 255, 0.80);
//           max-width: 860px;
//         }

//         .ballCol {
//           display: flex;
//           justify-content: flex-end;
//           padding-top: 6px;
//         }

//         .cardsRow {
//           margin-top: 18px;
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 12px;
//         }

//         .panel {
//           margin-top: 16px;
//           border: 1px solid rgba(255, 255, 255, 0.12);
//           border-radius: 18px;
//           background: rgba(255, 255, 255, 0.04);
//           box-shadow: 0 18px 45px rgba(0, 0, 0, 0.35);
//           padding: 18px;
//         }

//         .muted {
//           color: rgba(255, 255, 255, 0.72);
//         }

//         .who {
//           font-size: 18px;
//           font-weight: 780;
//           margin: 2px 0 2px;
//         }

//         .btnRow {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 10px;
//           align-items: center;
//           margin-top: 14px;
//         }

//         /* ✅ BASE BUTTON */
//         .btn,
//         .btnGhost {
//           border-radius: 12px;
//           padding: 11px 14px;
//           border: 1px solid rgba(255, 255, 255, 0.28);
//           text-decoration: none;
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           font-weight: 720;
//           cursor: pointer;
//           user-select: none;
//           transition: transform 120ms ease, background 120ms ease, border 120ms ease;
//         }

//         /* ✅ AIA COLOR BUTTONS */
//         .btnBlue {
//           background: rgba(31, 109, 179, 0.18);
//           border-color: rgba(31, 109, 179, 0.60);
//           color: #fff;
//         }
//         .btnGold {
//           background: rgba(242, 194, 48, 0.14);
//           border-color: rgba(242, 194, 48, 0.60);
//           color: #fff;
//         }
//         .btnRed {
//           background: rgba(214, 70, 58, 0.16);
//           border-color: rgba(214, 70, 58, 0.60);
//           color: #fff;
//         }

//         .btnGhost {
//           background: rgba(0, 0, 0, 0.22);
//           color: rgba(255, 255, 255, 0.92);
//           border: 1px solid rgba(255, 255, 255, 0.28);
//         }

//         .btn:hover,
//         .btnGhost:hover {
//           transform: translateY(-1px);
//           border-color: rgba(255, 255, 255, 0.45);
//           background: rgba(255, 255, 255, 0.13);
//         }

//         .btnBlue:hover {
//           background: rgba(31, 109, 179, 0.26);
//           border-color: rgba(31, 109, 179, 0.80);
//         }
//         .btnGold:hover {
//           background: rgba(242, 194, 48, 0.22);
//           border-color: rgba(242, 194, 48, 0.80);
//         }
//         .btnRed:hover {
//           background: rgba(214, 70, 58, 0.24);
//           border-color: rgba(214, 70, 58, 0.80);
//         }
//         .btnGhost:hover {
//           background: rgba(255, 255, 255, 0.08);
//           border-color: rgba(255, 255, 255, 0.40);
//         }

//         .btnGhost:active,
//         .btn:active {
//           transform: translateY(0px);
//         }

//         .status {
//           margin-top: 12px;
//           color: rgba(183, 255, 183, 0.95);
//         }

//         .howToPlay {
//           margin-top: 14px;
//           border: 1px solid rgba(255, 255, 255, 0.10);
//           border-radius: 18px;
//           background: rgba(0, 0, 0, 0.18);
//           padding: 14px 16px;
//         }

//         .howTitle {
//           font-weight: 800;
//           letter-spacing: 0.2px;
//           margin-bottom: 8px;
//           color: rgba(255, 255, 255, 0.92);
//         }

//         .howList {
//           margin: 0;
//           padding-left: 18px;
//           color: rgba(255, 255, 255, 0.72);
//           line-height: 20px;
//           font-size: 13px;
//         }

//         .howList li {
//           margin: 6px 0;
//         }

//         @media (max-width: 920px) {
//           .topRow {
//             grid-template-columns: 1fr;
//           }
//           .ballCol {
//             justify-content: flex-start;
//           }
//           .cardsRow {
//             grid-template-columns: 1fr;
//           }
//           .brand {
//             flex-direction: column;
//           }
//           .brandLogo {
//             width: 160px;
//           }
//         }
//       `}</style>
//     </main>
//   );
// }

// function InfoCard({
//   title,
//   icon,
//   lines,
//   accent,
//   badge,
// }: {
//   title: string;
//   icon: string;
//   lines: string[];
//   accent: "green" | "blue";
//   badge?: { type: "live" | "done"; text: string } | null;
// }) {
//   const accentBorder =
//     accent === "green" ? "rgba(120,255,170,0.30)" : "rgba(120,180,255,0.30)";
//   const accentBg =
//     accent === "green" ? "rgba(120,255,170,0.07)" : "rgba(120,180,255,0.07)";

//   return (
//     <div className="icard">
//       <div className="ihead">
//         <div className="ititle">
//           <span className="icon">{icon}</span> {title}
//         </div>

//         {badge?.type === "live" ? (
//           <div className="pillLive" title="Tournament has started">
//             <span className="dot" /> {badge.text}
//           </div>
//         ) : badge?.type === "done" ? (
//           <div className="pillDone" title="Tournament complete">
//             {badge.text}
//           </div>
//         ) : null}
//       </div>

//       <div className="ibody">
//         {lines.map((l, idx) => (
//           <div key={idx} className="iline">
//             {l}
//           </div>
//         ))}
//       </div>

//       <style jsx>{`
//         .icard {
//           border: 1px solid ${accentBorder};
//           background: ${accentBg};
//           border-radius: 18px;
//           padding: 14px;
//           box-shadow: 0 14px 35px rgba(0, 0, 0, 0.30);
//         }
//         .ihead {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 10px;
//           gap: 10px;
//         }
//         .ititle {
//           font-weight: 780;
//           letter-spacing: 0.2px;
//           display: flex;
//           align-items: center;
//           gap: 6px;
//         }
//         .ibody {
//           color: rgba(255, 255, 255, 0.80);
//           line-height: 20px;
//           font-size: 14px;
//         }
//         .iline {
//           margin-top: 6px;
//         }
//         .iline:first-child {
//           margin-top: 0;
//         }

//         .pillLive {
//           display: inline-flex;
//           align-items: center;
//           gap: 8px;
//           padding: 6px 10px;
//           border-radius: 999px;
//           border: 1px solid rgba(255, 120, 120, 0.45);
//           background: rgba(255, 90, 90, 0.10);
//           color: rgba(255, 230, 230, 0.95);
//           font-weight: 900;
//           letter-spacing: 0.4px;
//           font-size: 12px;
//           white-space: nowrap;
//         }
//         .dot {
//           width: 8px;
//           height: 8px;
//           border-radius: 999px;
//           background: rgba(255, 90, 90, 0.95);
//           box-shadow: 0 0 14px rgba(255, 90, 90, 0.75);
//           animation: pulse 1.1s ease-in-out infinite;
//         }

//         .pillDone {
//           padding: 6px 10px;
//           border-radius: 999px;
//           border: 1px solid rgba(180, 210, 255, 0.35);
//           background: rgba(120, 180, 255, 0.10);
//           color: rgba(220, 235, 255, 0.95);
//           font-weight: 900;
//           letter-spacing: 0.4px;
//           font-size: 12px;
//           white-space: nowrap;
//         }

//         @keyframes pulse {
//           0%,
//           100% {
//             transform: scale(1);
//             opacity: 1;
//           }
//           50% {
//             transform: scale(1.35);
//             opacity: 0.75;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// function SpinningBasketball() {
//   return (
//     <div className="ballWrap" aria-hidden="true">
//       <div className="ball">
//         <svg viewBox="0 0 100 100" className="ballSvg">
//           <defs>
//             <radialGradient id="g" cx="30%" cy="30%" r="70%">
//               <stop offset="0%" stopColor="#ffb36b" stopOpacity="1" />
//               <stop offset="55%" stopColor="#e67e22" stopOpacity="1" />
//               <stop offset="100%" stopColor="#b85a14" stopOpacity="1" />
//             </radialGradient>
//           </defs>
//           <circle cx="50" cy="50" r="48" fill="url(#g)" />
//           <circle
//             cx="50"
//             cy="50"
//             r="48"
//             fill="none"
//             stroke="rgba(0,0,0,0.35)"
//             strokeWidth="2"
//           />
//           <path d="M50 2 v96" stroke="rgba(0,0,0,0.55)" strokeWidth="3" />
//           <path d="M2 50 h96" stroke="rgba(0,0,0,0.55)" strokeWidth="3" />
//           <path
//             d="M18 10 C40 30, 40 70, 18 90"
//             fill="none"
//             stroke="rgba(0,0,0,0.55)"
//             strokeWidth="3"
//           />
//           <path
//             d="M82 10 C60 30, 60 70, 82 90"
//             fill="none"
//             stroke="rgba(0,0,0,0.55)"
//             strokeWidth="3"
//           />
//         </svg>
//       </div>

//       <style jsx>{`
//         .ballWrap {
//           width: 120px;
//           height: 120px;
//           display: grid;
//           place-items: center;
//           filter: drop-shadow(0 14px 24px rgba(0, 0, 0, 0.45));
//         }
//         .ball {
//           width: 106px;
//           height: 106px;
//           border-radius: 999px;
//           animation: spin 2.8s linear infinite, floaty 3.2s ease-in-out infinite;
//           transform-origin: 50% 50%;
//         }
//         .ballSvg {
//           width: 100%;
//           height: 100%;
//           border-radius: 999px;
//           display: block;
//         }
//         @keyframes spin {
//           from {
//             transform: rotate(0deg);
//           }
//           to {
//             transform: rotate(360deg);
//           }
//         }
//         @keyframes floaty {
//           0%,
//           100% {
//             translate: 0 0;
//           }
//           50% {
//             translate: 0 -6px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// function formatCountdown(ms: number) {
//   const totalSeconds = Math.floor(ms / 1000);
//   const days = Math.floor(totalSeconds / 86400);
//   const hours = Math.floor((totalSeconds % 86400) / 3600);
//   const minutes = Math.floor((totalSeconds % 3600) / 60);
//   const seconds = totalSeconds % 60;
//   return { days, hours, minutes, seconds };
// }

// function formatPhoenix(d: Date) {
//   try {
//     return new Intl.DateTimeFormat("en-US", {
//       timeZone: "America/Phoenix",
//       dateStyle: "full",
//       timeStyle: "short",
//     }).format(d);
//   } catch {
//     return d.toLocaleString();
//   }
// }


// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import { auth } from "@/lib/firebase";
// import {
//   GoogleAuthProvider,
//   onAuthStateChanged,
//   signInWithPopup,
//   signOut,
//   User,
// } from "firebase/auth";

// // Phoenix is UTC-7 year-round (no DST)
// const TOURNAMENT_START_ISO = "2026-02-18T19:00:00-07:00"; // Feb 18 @ 7:00 PM Phoenix (first game)
// const CHAMPIONSHIP_ISO = "2026-03-07T19:00:00-07:00"; // March 7 @ 7:00 PM Phoenix (edit if different)

// type Phase = "prestart" | "inprogress" | "complete";

// export default function HomePage() {
//   const [user, setUser] = useState<User | null>(null);
//   const [checking, setChecking] = useState(true);
//   const [status, setStatus] = useState("");

//   const tournamentStart = useMemo(() => new Date(TOURNAMENT_START_ISO), []);
//   const championship = useMemo(() => new Date(CHAMPIONSHIP_ISO), []);
//   const [now, setNow] = useState(() => Date.now());

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (u) => {
//       setUser(u);
//       setChecking(false);
//     });
//     return () => unsub();
//   }, []);

//   useEffect(() => {
//     const t = setInterval(() => setNow(Date.now()), 1000);
//     return () => clearInterval(t);
//   }, []);

//   const phase: Phase =
//     now < tournamentStart.getTime()
//       ? "prestart"
//       : now < championship.getTime()
//       ? "inprogress"
//       : "complete";

//   const targetDate = phase === "prestart" ? tournamentStart : championship;

//   const diffMs = targetDate.getTime() - now;
//   const safeDiffMs = Math.max(0, diffMs);
//   const countdown = formatCountdown(safeDiffMs);

//   const tournamentStartPhoenixText = useMemo(
//     () => formatPhoenix(tournamentStart),
//     [tournamentStart]
//   );
//   const championshipPhoenixText = useMemo(
//     () => formatPhoenix(championship),
//     [championship]
//   );
//   const targetPhoenixText = useMemo(() => formatPhoenix(targetDate), [targetDate]);

//   async function doGoogleSignIn() {
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

//   const countdownTitle =
//     phase === "prestart"
//       ? "Tournament Tip-off Countdown"
//       : phase === "inprogress"
//       ? "Championship Countdown"
//       : "Championship Status";

//   // ✅ "First game" -> "Round starts"
//   const countdownLines =
//     phase === "prestart"
//       ? [
//           `Round starts (Phoenix): ${tournamentStartPhoenixText}`,
//           `${countdown.days}d ${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`,
//           `Championship (Phoenix): ${championshipPhoenixText}`,
//         ]
//       : phase === "inprogress"
//       ? [
//           `Championship (Phoenix): ${targetPhoenixText}`,
//           `${countdown.days}d ${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`,
//         ]
//       : [`Championship (Phoenix): ${championshipPhoenixText}`, "Tournament complete."];

//   const badge =
//     phase === "inprogress"
//       ? { type: "live" as const, text: "LIVE" }
//       : phase === "complete"
//       ? { type: "done" as const, text: "COMPLETE" }
//       : null;

//   return (
//     <main className="wrap">
//       <div className="stage">
//         <div className="bgSpotlights" aria-hidden="true" />
//         <div className="bgVignette" aria-hidden="true" />

//         <header className="hero">
//           <div className="topRow">
//             <div className="brand">
//               <img
//                 className="brandLogo"
//                 src="/brand/aia.png"
//                 alt="AIA"
//                 onError={(e) => {
//                   (e.currentTarget as HTMLImageElement).style.display = "none";
//                 }}
//               />

//               <div className="brandText">
//                 <div className="title">2026 AIA Boys Basketball Open State Championship</div>

//                 <div className="aiaStripe" aria-hidden="true" />

//                 <div className="subtitle">
//                   Predict the matchups between the top 32 teams in Arizona high school
//                   basketball, and who will take home the trophy in Arizona Veterans
//                   Memorial Coliseum on March 7th! Fill out your bracket and compete
//                   against others to see who can have the most accurate bracket.
//                 </div>
//               </div>
//             </div>

//             <div className="ballCol">
//               <SpinningBasketball />
//             </div>
//           </div>

//           <div className="cardsRow">
//             <InfoCard
//               title={countdownTitle}
//               icon="⏳"
//               accent="green"
//               badge={badge}
//               lines={countdownLines}
//             />

//             <InfoCard
//               title="Scoring"
//               icon="🏀"
//               accent="blue"
//               lines={[
//                 "Round 1 = 1 point per correct pick",
//                 "Round 2 = 2 points",
//                 "Round 3 = 4 points",
//                 "Round 4 = 8 points",
//                 "Final = 16 points",
//               ]}
//             />
//           </div>

//           <section className="panel">
//             {checking ? (
//               <div className="muted">Loading…</div>
//             ) : user ? (
//               <>
//                 <div className="signedIn">
//                   <div className="muted">Signed in as</div>
//                   <div className="who">{user.displayName ?? user.email ?? "User"}</div>
//                   {user.email ? <div className="muted">{user.email}</div> : null}
//                 </div>

//                 {/* ✅ FIXED: No legacyBehavior, className is on Link directly */}
//                 <div className="btnRow">
//                   <Link href="/my-bracket" className="btn btnBlue">
//                     My Bracket
//                   </Link>

//                   <Link href="/bracket" className="btn btnGold">
//                     Live Bracket
//                   </Link>

//                   <Link href="/leaderboard" className="btn btnRed">
//                     Leaderboard
//                   </Link>

//                   <button className="btnGhost" onClick={doSignOut}>
//                     Sign out
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div className="signedOut">
//                   <div className="muted">
//                     Sign in to create and submit your bracket. Once submitted, it locks.
//                   </div>
//                 </div>

//                 <div className="btnRow">
//                   <button className="btn btnBlue" onClick={doGoogleSignIn}>
//                     Sign in with Google
//                   </button>

//                   <Link href="/bracket" className="btn btnGold">
//                     View Live Bracket
//                   </Link>

//                   <Link href="/leaderboard" className="btn btnRed">
//                     View Leaderboard
//                   </Link>
//                 </div>
//               </>
//             )}

//             {status ? <div className="status">{status}</div> : null}
//           </section>

//           <section className="howToPlay">
//             <div className="howTitle">How to play</div>
//             <ol className="howList">
//               <li>
//                 Go to <b>My Bracket</b> and pick winners (later rounds auto-fill).
//               </li>
//               <li>
//                 Hit <b>Submit Bracket</b> to lock your picks before tip-off:{" "}
//                 <b>{tournamentStartPhoenixText}</b>.
//               </li>
//               <li>
//                 Watch <b>Live Bracket</b> + <b>Leaderboard</b> update as winners are set.
//               </li>
//             </ol>
//           </section>
//         </header>
//       </div>

//       <style jsx>{`
//         .wrap {
//           /* ✅ Extra bottom padding so fixed footer doesn't cover content */
//           padding: 28px 18px 110px;
//           color: #fff;
//           display: flex;
//           justify-content: center;
//         }

//         .stage {
//           width: 100%;
//           max-width: 1120px;
//           position: relative;
//           border-radius: 22px;
//           overflow: hidden;
//           border: 1px solid rgba(255, 255, 255, 0.1);
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
//           background: radial-gradient(1200px 700px at 50% 10%, rgba(0,0,0,0), rgba(0,0,0,0.65));
//           pointer-events: none;
//         }

//         .hero {
//           position: relative;
//           padding: 22px;
//         }

//         .topRow {
//           display: grid;
//           grid-template-columns: 1fr auto;
//           gap: 18px;
//           align-items: start;
//         }

//         .brand {
//           display: flex;
//           gap: 14px;
//           align-items: flex-start;
//         }

//         .brandLogo {
//           width: 120px;
//           height: auto;
//           filter: drop-shadow(0 12px 22px rgba(0, 0, 0, 0.45));
//           border-radius: 10px;
//         }

//         .brandText .title {
//           font-size: 22px;
//           font-weight: 780;
//           letter-spacing: 0.2px;
//           margin-bottom: 10px;
//         }

//         .aiaStripe {
//           height: 10px;
//           width: min(520px, 100%);
//           border-radius: 999px;
//           margin-bottom: 12px;
//           opacity: 0.95;
//           background: linear-gradient(
//             90deg,
//             #1f6db3 0%,
//             #1f6db3 62%,
//             #f2c230 62%,
//             #f2c230 78%,
//             #d6463a 78%,
//             #d6463a 100%
//           );
//           box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
//           border: 1px solid rgba(255,255,255,0.10);
//         }

//         .brandText .subtitle {
//           font-size: 16px;
//           line-height: 24px;
//           color: rgba(255, 255, 255, 0.80);
//           max-width: 860px;
//         }

//         .ballCol {
//           display: flex;
//           justify-content: flex-end;
//           padding-top: 6px;
//         }

//         .cardsRow {
//           margin-top: 18px;
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 12px;
//         }

//         .panel {
//           margin-top: 16px;
//           border: 1px solid rgba(255, 255, 255, 0.12);
//           border-radius: 18px;
//           background: rgba(255, 255, 255, 0.04);
//           box-shadow: 0 18px 45px rgba(0, 0, 0, 0.35);
//           padding: 18px;
//         }

//         .muted {
//           color: rgba(255, 255, 255, 0.72);
//         }

//         .who {
//           font-size: 18px;
//           font-weight: 780;
//           margin: 2px 0 2px;
//         }

//         .btnRow {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 10px;
//           align-items: center;
//           margin-top: 14px;
//         }

//         /* ✅ BASE BUTTON */
//         .btn,
//         .btnGhost {
//           border-radius: 12px;
//           padding: 11px 14px;
//           border: 1px solid rgba(255, 255, 255, 0.28);
//           text-decoration: none;
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           font-weight: 720;
//           cursor: pointer;
//           user-select: none;
//           transition: transform 120ms ease, background 120ms ease, border 120ms ease;
//         }

//         /* ✅ AIA COLOR BUTTONS */
//         .btnBlue {
//           background: rgba(31, 109, 179, 0.18);
//           border-color: rgba(31, 109, 179, 0.60);
//           color: #fff;
//         }
//         .btnGold {
//           background: rgba(242, 194, 48, 0.14);
//           border-color: rgba(242, 194, 48, 0.60);
//           color: #fff;
//         }
//         .btnRed {
//           background: rgba(214, 70, 58, 0.16);
//           border-color: rgba(214, 70, 58, 0.60);
//           color: #fff;
//         }

//         .btnGhost {
//           background: rgba(0, 0, 0, 0.22);
//           color: rgba(255, 255, 255, 0.92);
//           border: 1px solid rgba(255, 255, 255, 0.28);
//         }

//         .btn:hover,
//         .btnGhost:hover {
//           transform: translateY(-1px);
//           border-color: rgba(255, 255, 255, 0.45);
//           background: rgba(255, 255, 255, 0.13);
//         }

//         .btnBlue:hover {
//           background: rgba(31, 109, 179, 0.26);
//           border-color: rgba(31, 109, 179, 0.80);
//         }
//         .btnGold:hover {
//           background: rgba(242, 194, 48, 0.22);
//           border-color: rgba(242, 194, 48, 0.80);
//         }
//         .btnRed:hover {
//           background: rgba(214, 70, 58, 0.24);
//           border-color: rgba(214, 70, 58, 0.80);
//         }
//         .btnGhost:hover {
//           background: rgba(255, 255, 255, 0.08);
//           border-color: rgba(255, 255, 255, 0.40);
//         }

//         .btnGhost:active,
//         .btn:active {
//           transform: translateY(0px);
//         }

//         .status {
//           margin-top: 12px;
//           color: rgba(183, 255, 183, 0.95);
//         }

//         .howToPlay {
//           margin-top: 14px;
//           border: 1px solid rgba(255, 255, 255, 0.10);
//           border-radius: 18px;
//           background: rgba(0, 0, 0, 0.18);
//           padding: 14px 16px;
//         }

//         .howTitle {
//           font-weight: 800;
//           letter-spacing: 0.2px;
//           margin-bottom: 8px;
//           color: rgba(255, 255, 255, 0.92);
//         }

//         .howList {
//           margin: 0;
//           padding-left: 18px;
//           color: rgba(255, 255, 255, 0.72);
//           line-height: 20px;
//           font-size: 13px;
//         }

//         .howList li {
//           margin: 6px 0;
//         }

//         @media (max-width: 920px) {
//           .topRow {
//             grid-template-columns: 1fr;
//           }
//           .ballCol {
//             justify-content: flex-start;
//           }
//           .cardsRow {
//             grid-template-columns: 1fr;
//           }
//           .brand {
//             flex-direction: column;
//           }
//           .brandLogo {
//             width: 160px;
//           }
//         }
//       `}</style>
//     </main>
//   );
// }

// function InfoCard({
//   title,
//   icon,
//   lines,
//   accent,
//   badge,
// }: {
//   title: string;
//   icon: string;
//   lines: string[];
//   accent: "green" | "blue";
//   badge?: { type: "live" | "done"; text: string } | null;
// }) {
//   const accentBorder =
//     accent === "green" ? "rgba(120,255,170,0.30)" : "rgba(120,180,255,0.30)";
//   const accentBg =
//     accent === "green" ? "rgba(120,255,170,0.07)" : "rgba(120,180,255,0.07)";

//   return (
//     <div className="icard">
//       <div className="ihead">
//         <div className="ititle">
//           <span className="icon">{icon}</span> {title}
//         </div>

//         {badge?.type === "live" ? (
//           <div className="pillLive" title="Tournament has started">
//             <span className="dot" /> {badge.text}
//           </div>
//         ) : badge?.type === "done" ? (
//           <div className="pillDone" title="Tournament complete">
//             {badge.text}
//           </div>
//         ) : null}
//       </div>

//       <div className="ibody">
//         {lines.map((l, idx) => (
//           <div key={idx} className="iline">
//             {l}
//           </div>
//         ))}
//       </div>

//       <style jsx>{`
//         .icard {
//           border: 1px solid ${accentBorder};
//           background: ${accentBg};
//           border-radius: 18px;
//           padding: 14px;
//           box-shadow: 0 14px 35px rgba(0, 0, 0, 0.30);
//         }
//         .ihead {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 10px;
//           gap: 10px;
//         }
//         .ititle {
//           font-weight: 780;
//           letter-spacing: 0.2px;
//           display: flex;
//           align-items: center;
//           gap: 6px;
//         }
//         .ibody {
//           color: rgba(255, 255, 255, 0.80);
//           line-height: 20px;
//           font-size: 14px;
//         }
//         .iline {
//           margin-top: 6px;
//         }
//         .iline:first-child {
//           margin-top: 0;
//         }

//         .pillLive {
//           display: inline-flex;
//           align-items: center;
//           gap: 8px;
//           padding: 6px 10px;
//           border-radius: 999px;
//           border: 1px solid rgba(255, 120, 120, 0.45);
//           background: rgba(255, 90, 90, 0.10);
//           color: rgba(255, 230, 230, 0.95);
//           font-weight: 900;
//           letter-spacing: 0.4px;
//           font-size: 12px;
//           white-space: nowrap;
//         }
//         .dot {
//           width: 8px;
//           height: 8px;
//           border-radius: 999px;
//           background: rgba(255, 90, 90, 0.95);
//           box-shadow: 0 0 14px rgba(255, 90, 90, 0.75);
//           animation: pulse 1.1s ease-in-out infinite;
//         }

//         .pillDone {
//           padding: 6px 10px;
//           border-radius: 999px;
//           border: 1px solid rgba(180, 210, 255, 0.35);
//           background: rgba(120, 180, 255, 0.10);
//           color: rgba(220, 235, 255, 0.95);
//           font-weight: 900;
//           letter-spacing: 0.4px;
//           font-size: 12px;
//           white-space: nowrap;
//         }

//         @keyframes pulse {
//           0%,
//           100% {
//             transform: scale(1);
//             opacity: 1;
//           }
//           50% {
//             transform: scale(1.35);
//             opacity: 0.75;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// function SpinningBasketball() {
//   return (
//     <div className="ballWrap" aria-hidden="true">
//       <div className="ball">
//         <svg viewBox="0 0 100 100" className="ballSvg">
//           <defs>
//             <radialGradient id="g" cx="30%" cy="30%" r="70%">
//               <stop offset="0%" stopColor="#ffb36b" stopOpacity="1" />
//               <stop offset="55%" stopColor="#e67e22" stopOpacity="1" />
//               <stop offset="100%" stopColor="#b85a14" stopOpacity="1" />
//             </radialGradient>
//           </defs>
//           <circle cx="50" cy="50" r="48" fill="url(#g)" />
//           <circle
//             cx="50"
//             cy="50"
//             r="48"
//             fill="none"
//             stroke="rgba(0,0,0,0.35)"
//             strokeWidth="2"
//           />
//           <path d="M50 2 v96" stroke="rgba(0,0,0,0.55)" strokeWidth="3" />
//           <path d="M2 50 h96" stroke="rgba(0,0,0,0.55)" strokeWidth="3" />
//           <path
//             d="M18 10 C40 30, 40 70, 18 90"
//             fill="none"
//             stroke="rgba(0,0,0,0.55)"
//             strokeWidth="3"
//           />
//           <path
//             d="M82 10 C60 30, 60 70, 82 90"
//             fill="none"
//             stroke="rgba(0,0,0,0.55)"
//             strokeWidth="3"
//           />
//         </svg>
//       </div>

//       <style jsx>{`
//         .ballWrap {
//           width: 120px;
//           height: 120px;
//           display: grid;
//           place-items: center;
//           filter: drop-shadow(0 14px 24px rgba(0, 0, 0, 0.45));
//         }
//         .ball {
//           width: 106px;
//           height: 106px;
//           border-radius: 999px;
//           animation: spin 2.8s linear infinite, floaty 3.2s ease-in-out infinite;
//           transform-origin: 50% 50%;
//         }
//         .ballSvg {
//           width: 100%;
//           height: 100%;
//           border-radius: 999px;
//           display: block;
//         }
//         @keyframes spin {
//           from {
//             transform: rotate(0deg);
//           }
//           to {
//             transform: rotate(360deg);
//           }
//         }
//         @keyframes floaty {
//           0%,
//           100% {
//             translate: 0 0;
//           }
//           50% {
//             translate: 0 -6px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// function formatCountdown(ms: number) {
//   const totalSeconds = Math.floor(ms / 1000);
//   const days = Math.floor(totalSeconds / 86400);
//   const hours = Math.floor((totalSeconds % 86400) / 3600);
//   const minutes = Math.floor((totalSeconds % 3600) / 60);
//   const seconds = totalSeconds % 60;
//   return { days, hours, minutes, seconds };
// }

// function formatPhoenix(d: Date) {
//   try {
//     return new Intl.DateTimeFormat("en-US", {
//       timeZone: "America/Phoenix",
//       dateStyle: "full",
//       timeStyle: "short",
//     }).format(d);
//   } catch {
//     return d.toLocaleString();
//   }
// }




// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import { auth } from "@/lib/firebase";
// import {
//   GoogleAuthProvider,
//   onAuthStateChanged,
//   signInWithPopup,
//   signOut,
//   User,
// } from "firebase/auth";

// // Phoenix is UTC-7 year-round (no DST)
// const TOURNAMENT_START_ISO = "2026-02-18T19:00:00-07:00"; // Feb 18 @ 7:00 PM Phoenix (first game)
// const CHAMPIONSHIP_ISO = "2026-03-07T19:00:00-07:00"; // March 7 @ 7:00 PM Phoenix (edit if different)

// type Phase = "prestart" | "inprogress" | "complete";

// export default function HomePage() {
//   const [user, setUser] = useState<User | null>(null);
//   const [checking, setChecking] = useState(true);
//   const [status, setStatus] = useState("");

//   const tournamentStart = useMemo(() => new Date(TOURNAMENT_START_ISO), []);
//   const championship = useMemo(() => new Date(CHAMPIONSHIP_ISO), []);

//   // ✅ Hydration-safe: render a stable "server match" first, then start ticking after mount
//   const [mounted, setMounted] = useState(false);
//   const [now, setNow] = useState(0);

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (u) => {
//       setUser(u);
//       setChecking(false);
//     });
//     return () => unsub();
//   }, []);

//   useEffect(() => {
//     setMounted(true);
//     setNow(Date.now());
//     const t = setInterval(() => setNow(Date.now()), 1000);
//     return () => clearInterval(t);
//   }, []);

//   // ✅ Stable "first paint" time so SSR + first client render match
//   const nowMs = mounted ? now : tournamentStart.getTime();

//   const phase: Phase =
//     nowMs < tournamentStart.getTime()
//       ? "prestart"
//       : nowMs < championship.getTime()
//       ? "inprogress"
//       : "complete";

//   const targetDate = phase === "prestart" ? tournamentStart : championship;

//   const diffMs = targetDate.getTime() - nowMs;
//   const safeDiffMs = Math.max(0, diffMs);
//   const countdown = formatCountdown(safeDiffMs);

//   // ✅ Also hydration-safe: don’t format locale/timezone until mounted
//   const tournamentStartPhoenixText = useMemo(
//     () => (mounted ? formatPhoenix(tournamentStart) : "Loading…"),
//     [mounted, tournamentStart]
//   );
//   const championshipPhoenixText = useMemo(
//     () => (mounted ? formatPhoenix(championship) : "Loading…"),
//     [mounted, championship]
//   );
//   const targetPhoenixText = useMemo(
//     () => (mounted ? formatPhoenix(targetDate) : "Loading…"),
//     [mounted, targetDate]
//   );

//   const countdownTitle =
//     phase === "prestart"
//       ? "Tournament Tip-off Countdown"
//       : phase === "inprogress"
//       ? "Championship Countdown"
//       : "Championship Status";

//   const countdownClockText = mounted
//     ? `${countdown.days}d ${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`
//     : "Loading countdown…";

//   // ✅ CHANGED: "First game" -> "Round starts"
//   const countdownLines =
//     phase === "prestart"
//       ? [
//           `Round starts (Phoenix): ${tournamentStartPhoenixText}`,
//           countdownClockText,
//           `Championship (Phoenix): ${championshipPhoenixText}`,
//         ]
//       : phase === "inprogress"
//       ? [
//           `Championship (Phoenix): ${targetPhoenixText}`,
//           countdownClockText,
//         ]
//       : [`Championship (Phoenix): ${championshipPhoenixText}`, "Tournament complete."];

//   const badge =
//     phase === "inprogress"
//       ? { type: "live" as const, text: "LIVE" }
//       : phase === "complete"
//       ? { type: "done" as const, text: "COMPLETE" }
//       : null;

//   async function doGoogleSignIn() {
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

//   return (
//     <main className="wrap">
//       <div className="stage">
//         <div className="bgSpotlights" aria-hidden="true" />
//         <div className="bgVignette" aria-hidden="true" />

//         <header className="hero">
//           <div className="topRow">
//             <div className="brand">
//               <img
//                 className="brandLogo"
//                 src="/brand/aia.png"
//                 alt="AIA"
//                 onError={(e) => {
//                   (e.currentTarget as HTMLImageElement).style.display = "none";
//                 }}
//               />

//               <div className="brandText">
//                 <div className="title">
//                   2026 AIA Boys Basketball Open State Championship
//                 </div>

//                 <div className="aiaStripe" aria-hidden="true" />

//                 <div className="subtitle">
//                   Predict the matchups between the top 32 teams in Arizona high
//                   school basketball, and who will take home the trophy in Arizona
//                   Veterans Memorial Coliseum on March 7th! Fill out your bracket
//                   and compete against others to see who can have the most accurate
//                   bracket.
//                 </div>
//               </div>
//             </div>

//             <div className="ballCol">
//               <SpinningBasketball />
//             </div>
//           </div>

//           <div className="cardsRow">
//             <InfoCard
//               title={countdownTitle}
//               icon="⏳"
//               accent="green"
//               badge={badge}
//               lines={countdownLines}
//             />

//             <InfoCard
//               title="Scoring"
//               icon="🏀"
//               accent="blue"
//               lines={[
//                 "Round 1 = 1 point per correct pick",
//                 "Round 2 = 2 points",
//                 "Round 3 = 4 points",
//                 "Round 4 = 8 points",
//                 "Final = 16 points",
//               ]}
//             />
//           </div>

//           <section className="panel">
//             {checking ? (
//               <div className="muted">Loading…</div>
//             ) : user ? (
//               <>
//                 <div className="signedIn">
//                   <div className="muted">Signed in as</div>
//                   <div className="who">
//                     {user.displayName ?? user.email ?? "User"}
//                   </div>
//                   {user.email ? <div className="muted">{user.email}</div> : null}
//                 </div>

//                 <div className="btnRow">
//                   <Link className="hbtn hbtnBlue" href="/my-bracket">
//                     My Bracket
//                   </Link>

//                   <Link className="hbtn hbtnGold" href="/bracket">
//                     Live Bracket
//                   </Link>

//                   <Link className="hbtn hbtnRed" href="/leaderboard">
//                     Leaderboard
//                   </Link>

//                   <button className="hbtn hbtnGhost" onClick={doSignOut}>
//                     Sign out
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div className="signedOut">
//                   <div className="muted">
//                     Sign in to create and submit your bracket. Once submitted, it locks.
//                   </div>
//                 </div>

//                 <div className="btnRow">
//                   <button className="hbtn hbtnBlue" onClick={doGoogleSignIn}>
//                     Sign in with Google
//                   </button>

//                   <Link className="hbtn hbtnGold" href="/bracket">
//                     View Live Bracket
//                   </Link>

//                   <Link className="hbtn hbtnRed" href="/leaderboard">
//                     View Leaderboard
//                   </Link>
//                 </div>
//               </>
//             )}

//             {status ? <div className="status">{status}</div> : null}
//           </section>

//           <section className="howToPlay">
//             <div className="howTitle">How to play</div>
//             <ol className="howList">
//               <li>
//                 Go to <b>My Bracket</b> and pick winners (later rounds auto-fill).
//               </li>
//               <li>
//                 Hit <b>Submit Bracket</b> to lock your picks before tip-off:{" "}
//                 <b>{tournamentStartPhoenixText}</b>.
//               </li>
//               <li>
//                 Watch <b>Live Bracket</b> + <b>Leaderboard</b> update as winners are set.
//               </li>
//             </ol>
//           </section>
//         </header>
//       </div>

//       <style jsx>{`
//         .wrap {
//           /* extra bottom padding so fixed footer doesn't cover content */
//           padding: 28px 18px 110px;
//           color: #fff;
//           display: flex;
//           justify-content: center;
//         }

//         .stage {
//           width: 100%;
//           max-width: 1120px;
//           position: relative;
//           border-radius: 22px;
//           overflow: hidden;
//           border: 1px solid rgba(255, 255, 255, 0.1);
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
//           background: radial-gradient(1200px 700px at 50% 10%, rgba(0,0,0,0), rgba(0,0,0,0.65));
//           pointer-events: none;
//         }

//         .hero {
//           position: relative;
//           padding: 22px;
//         }

//         .topRow {
//           display: grid;
//           grid-template-columns: 1fr auto;
//           gap: 18px;
//           align-items: start;
//         }

//         .brand {
//           display: flex;
//           gap: 14px;
//           align-items: flex-start;
//         }

//         .brandLogo {
//           width: 120px;
//           height: auto;
//           filter: drop-shadow(0 12px 22px rgba(0, 0, 0, 0.45));
//           border-radius: 10px;
//         }

//         .brandText .title {
//           font-size: 22px;
//           font-weight: 780;
//           letter-spacing: 0.2px;
//           margin-bottom: 10px;
//         }

//         .aiaStripe {
//           height: 10px;
//           width: min(520px, 100%);
//           border-radius: 999px;
//           margin-bottom: 12px;
//           opacity: 0.95;
//           background: linear-gradient(
//             90deg,
//             #1f6db3 0%,
//             #1f6db3 62%,
//             #f2c230 62%,
//             #f2c230 78%,
//             #d6463a 78%,
//             #d6463a 100%
//           );
//           box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
//           border: 1px solid rgba(255,255,255,0.10);
//         }

//         .brandText .subtitle {
//           font-size: 16px;
//           line-height: 24px;
//           color: rgba(255, 255, 255, 0.80);
//           max-width: 860px;
//         }

//         .ballCol {
//           display: flex;
//           justify-content: flex-end;
//           padding-top: 6px;
//         }

//         .cardsRow {
//           margin-top: 18px;
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 12px;
//         }

//         .panel {
//           margin-top: 16px;
//           border: 1px solid rgba(255, 255, 255, 0.12);
//           border-radius: 18px;
//           background: rgba(255, 255, 255, 0.04);
//           box-shadow: 0 18px 45px rgba(0, 0, 0, 0.35);
//           padding: 18px;
//         }

//         .muted {
//           color: rgba(255, 255, 255, 0.72);
//         }

//         .who {
//           font-size: 18px;
//           font-weight: 780;
//           margin: 2px 0 2px;
//         }

//         .btnRow {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 10px;
//           align-items: center;
//           margin-top: 14px;
//         }

//         /* ✅ Make button classes GLOBAL so Next <Link> anchors get styled */
//         :global(.hbtn) {
//           border-radius: 12px;
//           padding: 11px 14px;
//           border: 1px solid rgba(255, 255, 255, 0.28);
//           text-decoration: none;
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           font-weight: 720;
//           cursor: pointer;
//           user-select: none;
//           transition: transform 120ms ease, background 120ms ease, border 120ms ease;
//           color: #fff;
//         }

//         :global(.hbtnBlue) {
//           background: rgba(31, 109, 179, 0.18);
//           border-color: rgba(31, 109, 179, 0.60);
//         }
//         :global(.hbtnGold) {
//           background: rgba(242, 194, 48, 0.14);
//           border-color: rgba(242, 194, 48, 0.60);
//         }
//         :global(.hbtnRed) {
//           background: rgba(214, 70, 58, 0.16);
//           border-color: rgba(214, 70, 58, 0.60);
//         }

//         :global(.hbtnGhost) {
//           background: rgba(0, 0, 0, 0.22);
//           color: rgba(255, 255, 255, 0.92);
//           border-color: rgba(255, 255, 255, 0.28);
//         }

//         :global(.hbtn:hover) {
//           transform: translateY(-1px);
//         }

//         :global(.hbtnBlue:hover) {
//           background: rgba(31, 109, 179, 0.26);
//           border-color: rgba(31, 109, 179, 0.80);
//         }
//         :global(.hbtnGold:hover) {
//           background: rgba(242, 194, 48, 0.22);
//           border-color: rgba(242, 194, 48, 0.80);
//         }
//         :global(.hbtnRed:hover) {
//           background: rgba(214, 70, 58, 0.24);
//           border-color: rgba(214, 70, 58, 0.80);
//         }
//         :global(.hbtnGhost:hover) {
//           background: rgba(255, 255, 255, 0.08);
//           border-color: rgba(255, 255, 255, 0.40);
//         }

//         :global(.hbtn:active) {
//           transform: translateY(0px);
//         }

//         .status {
//           margin-top: 12px;
//           color: rgba(183, 255, 183, 0.95);
//         }

//         .howToPlay {
//           margin-top: 14px;
//           border: 1px solid rgba(255, 255, 255, 0.10);
//           border-radius: 18px;
//           background: rgba(0, 0, 0, 0.18);
//           padding: 14px 16px;
//         }

//         .howTitle {
//           font-weight: 800;
//           letter-spacing: 0.2px;
//           margin-bottom: 8px;
//           color: rgba(255, 255, 255, 0.92);
//         }

//         .howList {
//           margin: 0;
//           padding-left: 18px;
//           color: rgba(255, 255, 255, 0.72);
//           line-height: 20px;
//           font-size: 13px;
//         }

//         .howList li {
//           margin: 6px 0;
//         }

//         @media (max-width: 920px) {
//           .topRow {
//             grid-template-columns: 1fr;
//           }
//           .ballCol {
//             justify-content: flex-start;
//           }
//           .cardsRow {
//             grid-template-columns: 1fr;
//           }
//           .brand {
//             flex-direction: column;
//           }
//           .brandLogo {
//             width: 160px;
//           }
//         }
//       `}</style>
//     </main>
//   );
// }

// function InfoCard({
//   title,
//   icon,
//   lines,
//   accent,
//   badge,
// }: {
//   title: string;
//   icon: string;
//   lines: string[];
//   accent: "green" | "blue";
//   badge?: { type: "live" | "done"; text: string } | null;
// }) {
//   const accentBorder =
//     accent === "green"
//       ? "rgba(120,255,170,0.30)"
//       : "rgba(120,180,255,0.30)";
//   const accentBg =
//     accent === "green"
//       ? "rgba(120,255,170,0.07)"
//       : "rgba(120,180,255,0.07)";

//   return (
//     <div className="icard">
//       <div className="ihead">
//         <div className="ititle">
//           <span className="icon">{icon}</span> {title}
//         </div>

//         {badge?.type === "live" ? (
//           <div className="pillLive" title="Tournament has started">
//             <span className="dot" /> {badge.text}
//           </div>
//         ) : badge?.type === "done" ? (
//           <div className="pillDone" title="Tournament complete">
//             {badge.text}
//           </div>
//         ) : null}
//       </div>

//       <div className="ibody">
//         {lines.map((l, idx) => (
//           <div key={idx} className="iline">
//             {l}
//           </div>
//         ))}
//       </div>

//       <style jsx>{`
//         .icard {
//           border: 1px solid ${accentBorder};
//           background: ${accentBg};
//           border-radius: 18px;
//           padding: 14px;
//           box-shadow: 0 14px 35px rgba(0, 0, 0, 0.30);
//         }
//         .ihead {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 10px;
//           gap: 10px;
//         }
//         .ititle {
//           font-weight: 780;
//           letter-spacing: 0.2px;
//           display: flex;
//           align-items: center;
//           gap: 6px;
//         }
//         .ibody {
//           color: rgba(255, 255, 255, 0.80);
//           line-height: 20px;
//           font-size: 14px;
//         }
//         .iline {
//           margin-top: 6px;
//         }
//         .iline:first-child {
//           margin-top: 0;
//         }

//         .pillLive {
//           display: inline-flex;
//           align-items: center;
//           gap: 8px;
//           padding: 6px 10px;
//           border-radius: 999px;
//           border: 1px solid rgba(255, 120, 120, 0.45);
//           background: rgba(255, 90, 90, 0.10);
//           color: rgba(255, 230, 230, 0.95);
//           font-weight: 900;
//           letter-spacing: 0.4px;
//           font-size: 12px;
//           white-space: nowrap;
//         }
//         .dot {
//           width: 8px;
//           height: 8px;
//           border-radius: 999px;
//           background: rgba(255, 90, 90, 0.95);
//           box-shadow: 0 0 14px rgba(255, 90, 90, 0.75);
//           animation: pulse 1.1s ease-in-out infinite;
//         }

//         .pillDone {
//           padding: 6px 10px;
//           border-radius: 999px;
//           border: 1px solid rgba(180, 210, 255, 0.35);
//           background: rgba(120, 180, 255, 0.10);
//           color: rgba(220, 235, 255, 0.95);
//           font-weight: 900;
//           letter-spacing: 0.4px;
//           font-size: 12px;
//           white-space: nowrap;
//         }

//         @keyframes pulse {
//           0%,
//           100% {
//             transform: scale(1);
//             opacity: 1;
//           }
//           50% {
//             transform: scale(1.35);
//             opacity: 0.75;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// function SpinningBasketball() {
//   return (
//     <div className="ballWrap" aria-hidden="true">
//       <div className="ball">
//         <svg viewBox="0 0 100 100" className="ballSvg">
//           <defs>
//             <radialGradient id="g" cx="30%" cy="30%" r="70%">
//               <stop offset="0%" stopColor="#ffb36b" stopOpacity="1" />
//               <stop offset="55%" stopColor="#e67e22" stopOpacity="1" />
//               <stop offset="100%" stopColor="#b85a14" stopOpacity="1" />
//             </radialGradient>
//           </defs>
//           <circle cx="50" cy="50" r="48" fill="url(#g)" />
//           <circle
//             cx="50"
//             cy="50"
//             r="48"
//             fill="none"
//             stroke="rgba(0,0,0,0.35)"
//             strokeWidth="2"
//           />
//           <path d="M50 2 v96" stroke="rgba(0,0,0,0.55)" strokeWidth="3" />
//           <path d="M2 50 h96" stroke="rgba(0,0,0,0.55)" strokeWidth="3" />
//           <path
//             d="M18 10 C40 30, 40 70, 18 90"
//             fill="none"
//             stroke="rgba(0,0,0,0.55)"
//             strokeWidth="3"
//           />
//           <path
//             d="M82 10 C60 30, 60 70, 82 90"
//             fill="none"
//             stroke="rgba(0,0,0,0.55)"
//             strokeWidth="3"
//           />
//         </svg>
//       </div>

//       <style jsx>{`
//         .ballWrap {
//           width: 120px;
//           height: 120px;
//           display: grid;
//           place-items: center;
//           filter: drop-shadow(0 14px 24px rgba(0, 0, 0, 0.45));
//         }
//         .ball {
//           width: 106px;
//           height: 106px;
//           border-radius: 999px;
//           animation: spin 2.8s linear infinite, floaty 3.2s ease-in-out infinite;
//           transform-origin: 50% 50%;
//         }
//         .ballSvg {
//           width: 100%;
//           height: 100%;
//           border-radius: 999px;
//           display: block;
//         }
//         @keyframes spin {
//           from {
//             transform: rotate(0deg);
//           }
//           to {
//             transform: rotate(360deg);
//           }
//         }
//         @keyframes floaty {
//           0%,
//           100% {
//             translate: 0 0;
//           }
//           50% {
//             translate: 0 -6px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// function formatCountdown(ms: number) {
//   const totalSeconds = Math.floor(ms / 1000);
//   const days = Math.floor(totalSeconds / 86400);
//   const hours = Math.floor((totalSeconds % 86400) / 3600);
//   const minutes = Math.floor((totalSeconds % 3600) / 60);
//   const seconds = totalSeconds % 60;
//   return { days, hours, minutes, seconds };
// }

// function formatPhoenix(d: Date) {
//   try {
//     return new Intl.DateTimeFormat("en-US", {
//       timeZone: "America/Phoenix",
//       dateStyle: "full",
//       timeStyle: "short",
//     }).format(d);
//   } catch {
//     return d.toLocaleString();
//   }
// }


// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import { auth } from "@/lib/firebase";
// import {
//   GoogleAuthProvider,
//   onAuthStateChanged,
//   signInWithPopup,
//   signOut,
//   User,
// } from "firebase/auth";

// // Phoenix is UTC-7 year-round (no DST)
// const TOURNAMENT_START_ISO = "2026-02-18T19:00:00-07:00"; // Feb 18 @ 7:00 PM Phoenix (first game)
// const CHAMPIONSHIP_ISO = "2026-03-07T19:00:00-07:00"; // March 7 @ 7:00 PM Phoenix (edit if different)

// type Phase = "prestart" | "inprogress" | "complete";

// export default function HomePage() {
//   const [user, setUser] = useState<User | null>(null);
//   const [checking, setChecking] = useState(true);
//   const [status, setStatus] = useState("");

//   const tournamentStart = useMemo(() => new Date(TOURNAMENT_START_ISO), []);
//   const championship = useMemo(() => new Date(CHAMPIONSHIP_ISO), []);

//   // ✅ Hydration-safe: render a stable "server match" first, then start ticking after mount
//   const [mounted, setMounted] = useState(false);
//   const [now, setNow] = useState(0);

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (u) => {
//       setUser(u);
//       setChecking(false);
//     });
//     return () => unsub();
//   }, []);

//   useEffect(() => {
//     setMounted(true);
//     setNow(Date.now());
//     const t = setInterval(() => setNow(Date.now()), 1000);
//     return () => clearInterval(t);
//   }, []);

//   // ✅ Stable "first paint" time so SSR + first client render match
//   const nowMs = mounted ? now : tournamentStart.getTime();

//   const phase: Phase =
//     nowMs < tournamentStart.getTime()
//       ? "prestart"
//       : nowMs < championship.getTime()
//       ? "inprogress"
//       : "complete";

//   const targetDate = phase === "prestart" ? tournamentStart : championship;

//   const diffMs = targetDate.getTime() - nowMs;
//   const safeDiffMs = Math.max(0, diffMs);
//   const countdown = formatCountdown(safeDiffMs);

//   // ✅ Also hydration-safe: don’t format locale/timezone until mounted
//   const tournamentStartPhoenixText = useMemo(
//     () => (mounted ? formatPhoenix(tournamentStart) : "Loading…"),
//     [mounted, tournamentStart]
//   );
//   const championshipPhoenixText = useMemo(
//     () => (mounted ? formatPhoenix(championship) : "Loading…"),
//     [mounted, championship]
//   );
//   const targetPhoenixText = useMemo(
//     () => (mounted ? formatPhoenix(targetDate) : "Loading…"),
//     [mounted, targetDate]
//   );

//   const countdownTitle =
//     phase === "prestart"
//       ? "Tournament Tip-off Countdown"
//       : phase === "inprogress"
//       ? "Championship Countdown"
//       : "Championship Status";

//   const countdownClockText = mounted
//     ? `${countdown.days}d ${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`
//     : "Loading countdown…";

//   // ✅ CHANGED: "First game" -> "Round starts"
//   const countdownLines =
//     phase === "prestart"
//       ? [
//           `Round starts (Phoenix): ${tournamentStartPhoenixText}`,
//           countdownClockText,
//           `Championship (Phoenix): ${championshipPhoenixText}`,
//         ]
//       : phase === "inprogress"
//       ? [
//           `Championship (Phoenix): ${targetPhoenixText}`,
//           countdownClockText,
//         ]
//       : [`Championship (Phoenix): ${championshipPhoenixText}`, "Tournament complete."];

//   const badge =
//     phase === "inprogress"
//       ? { type: "live" as const, text: "LIVE" }
//       : phase === "complete"
//       ? { type: "done" as const, text: "COMPLETE" }
//       : null;

//   async function doGoogleSignIn() {
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

//   return (
//     <main className="wrap">
//       <div className="stage">
//         <div className="bgSpotlights" aria-hidden="true" />
//         <div className="bgVignette" aria-hidden="true" />

//         <header className="hero">
//           <div className="topRow">
//             <div className="brand">
//               <img
//                 className="brandLogo"
//                 src="/brand/aia.png"
//                 alt="AIA"
//                 onError={(e) => {
//                   (e.currentTarget as HTMLImageElement).style.display = "none";
//                 }}
//               />

//               <div className="brandText">
//                 <div className="title">
//                   2026 AIA Boys Basketball Open State Championship
//                 </div>

//                 <div className="aiaStripe" aria-hidden="true" />

//                 <div className="subtitle">
//                   Predict the matchups between the top 32 teams in Arizona high
//                   school basketball, and who will take home the trophy in Arizona
//                   Veterans Memorial Coliseum on March 7th! Fill out your bracket
//                   and compete against others to see who can have the most accurate
//                   bracket.
//                 </div>
//               </div>
//             </div>

//             <div className="ballCol">
//               <SpinningBasketball />
//             </div>
//           </div>

//           <div className="cardsRow">
//             <InfoCard
//               title={countdownTitle}
//               icon="⏳"
//               accent="green"
//               badge={badge}
//               lines={countdownLines}
//             />

//             <InfoCard
//               title="Scoring"
//               icon="🏀"
//               accent="blue"
//               lines={[
//                 "Round 1 = 1 point per correct pick",
//                 "Round 2 = 2 points",
//                 "Round 3 = 4 points",
//                 "Round 4 = 8 points",
//                 "Final = 16 points",
//               ]}
//             />
//           </div>

//           <section className="panel">
//             {checking ? (
//               <div className="muted">Loading…</div>
//             ) : user ? (
//               <>
//                 <div className="signedIn">
//                   <div className="muted">Signed in as</div>
//                   <div className="who">
//                     {user.displayName ?? user.email ?? "User"}
//                   </div>
//                   {user.email ? <div className="muted">{user.email}</div> : null}
//                 </div>

//                 <div className="btnRow">
//                   <Link className="hbtn hbtnBlue" href="/my-bracket">
//                     My Bracket
//                   </Link>

//                   <Link className="hbtn hbtnGold" href="/bracket">
//                     Live Bracket
//                   </Link>

//                   <Link className="hbtn hbtnRed" href="/leaderboard">
//                     Leaderboard
//                   </Link>

//                   <button className="hbtn hbtnGhost" onClick={doSignOut}>
//                     Sign out
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div className="signedOut">
//                   <div className="muted">
//                     Sign in to create and submit your bracket. Once submitted, it locks.
//                   </div>
//                 </div>

//                 <div className="btnRow">
//                   <button className="hbtn hbtnBlue" onClick={doGoogleSignIn}>
//                     Sign in with Google
//                   </button>

//                   <Link className="hbtn hbtnGold" href="/bracket">
//                     View Live Bracket
//                   </Link>

//                   <Link className="hbtn hbtnRed" href="/leaderboard">
//                     View Leaderboard
//                   </Link>
//                 </div>
//               </>
//             )}

//             {status ? <div className="status">{status}</div> : null}
//           </section>

//           <section className="howToPlay">
//             <div className="howTitle">How to play</div>
//             <ol className="howList">
//               <li>
//                 Go to <b>My Bracket</b> and pick winners (later rounds auto-fill).
//               </li>
//               <li>
//                 Hit <b>Submit Bracket</b> to lock your picks before tip-off:{" "}
//                 <b>{tournamentStartPhoenixText}</b>.
//               </li>
//               <li>
//                 Watch <b>Live Bracket</b> + <b>Leaderboard</b> update as winners are set.
//               </li>
//             </ol>
//           </section>
//         </header>

//         {/* Disclaimer (appears at very bottom when scrolling) */}
//         <footer className="disclaimer">
//           Not officially partnered with AIA, and we do not claim rights to the AIA logo.
//         </footer>
//       </div>

//       <style jsx>{`
//         .wrap {
//           /* extra bottom padding so fixed footer doesn't cover content */
//           padding: 28px 18px 110px;
//           color: #fff;
//           display: flex;
//           justify-content: center;
//         }

//         .stage {
//           width: 100%;
//           max-width: 1120px;
//           position: relative;
//           border-radius: 22px;
//           overflow: hidden;
//           border: 1px solid rgba(255, 255, 255, 0.1);
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
//           background: radial-gradient(1200px 700px at 50% 10%, rgba(0,0,0,0), rgba(0,0,0,0.65));
//           pointer-events: none;
//         }

//         .hero {
//           position: relative;
//           padding: 22px;
//         }

//         .topRow {
//           display: grid;
//           grid-template-columns: 1fr auto;
//           gap: 18px;
//           align-items: start;
//         }

//         .brand {
//           display: flex;
//           gap: 14px;
//           align-items: flex-start;
//         }

//         .brandLogo {
//           width: 120px;
//           height: auto;
//           filter: drop-shadow(0 12px 22px rgba(0, 0, 0, 0.45));
//           border-radius: 10px;
//         }

//         .brandText .title {
//           font-size: 22px;
//           font-weight: 780;
//           letter-spacing: 0.2px;
//           margin-bottom: 10px;
//         }

//         .aiaStripe {
//           height: 10px;
//           width: min(520px, 100%);
//           border-radius: 999px;
//           margin-bottom: 12px;
//           opacity: 0.95;
//           background: linear-gradient(
//             90deg,
//             #1f6db3 0%,
//             #1f6db3 62%,
//             #f2c230 62%,
//             #f2c230 78%,
//             #d6463a 78%,
//             #d6463a 100%
//           );
//           box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
//           border: 1px solid rgba(255,255,255,0.10);
//         }

//         .brandText .subtitle {
//           font-size: 16px;
//           line-height: 24px;
//           color: rgba(255, 255, 255, 0.80);
//           max-width: 860px;
//         }

//         .ballCol {
//           display: flex;
//           justify-content: flex-end;
//           padding-top: 6px;
//         }

//         .cardsRow {
//           margin-top: 18px;
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 12px;
//         }

//         .panel {
//           margin-top: 16px;
//           border: 1px solid rgba(255, 255, 255, 0.12);
//           border-radius: 18px;
//           background: rgba(255, 255, 255, 0.04);
//           box-shadow: 0 18px 45px rgba(0, 0, 0, 0.35);
//           padding: 18px;
//         }

//         .muted {
//           color: rgba(255, 255, 255, 0.72);
//         }

//         .who {
//           font-size: 18px;
//           font-weight: 780;
//           margin: 2px 0 2px;
//         }

//         .btnRow {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 10px;
//           align-items: center;
//           margin-top: 14px;
//         }

//         /* ✅ Make button classes GLOBAL so Next <Link> anchors get styled */
//         :global(.hbtn) {
//           border-radius: 12px;
//           padding: 11px 14px;
//           border: 1px solid rgba(255, 255, 255, 0.28);
//           text-decoration: none;
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           font-weight: 720;
//           cursor: pointer;
//           user-select: none;
//           transition: transform 120ms ease, background 120ms ease, border 120ms ease;
//           color: #fff;
//         }

//         :global(.hbtnBlue) {
//           background: rgba(31, 109, 179, 0.18);
//           border-color: rgba(31, 109, 179, 0.60);
//         }
//         :global(.hbtnGold) {
//           background: rgba(242, 194, 48, 0.14);
//           border-color: rgba(242, 194, 48, 0.60);
//         }
//         :global(.hbtnRed) {
//           background: rgba(214, 70, 58, 0.16);
//           border-color: rgba(214, 70, 58, 0.60);
//         }

//         :global(.hbtnGhost) {
//           background: rgba(0, 0, 0, 0.22);
//           color: rgba(255, 255, 255, 0.92);
//           border-color: rgba(255, 255, 255, 0.28);
//         }

//         :global(.hbtn:hover) {
//           transform: translateY(-1px);
//         }

//         :global(.hbtnBlue:hover) {
//           background: rgba(31, 109, 179, 0.26);
//           border-color: rgba(31, 109, 179, 0.80);
//         }
//         :global(.hbtnGold:hover) {
//           background: rgba(242, 194, 48, 0.22);
//           border-color: rgba(242, 194, 48, 0.80);
//         }
//         :global(.hbtnRed:hover) {
//           background: rgba(214, 70, 58, 0.24);
//           border-color: rgba(214, 70, 58, 0.80);
//         }
//         :global(.hbtnGhost:hover) {
//           background: rgba(255, 255, 255, 0.08);
//           border-color: rgba(255, 255, 255, 0.40);
//         }

//         :global(.hbtn:active) {
//           transform: translateY(0px);
//         }

//         .status {
//           margin-top: 12px;
//           color: rgba(183, 255, 183, 0.95);
//         }

//         .howToPlay {
//           margin-top: 14px;
//           border: 1px solid rgba(255, 255, 255, 0.10);
//           border-radius: 18px;
//           background: rgba(0, 0, 0, 0.18);
//           padding: 14px 16px;
//         }

//         .howTitle {
//           font-weight: 800;
//           letter-spacing: 0.2px;
//           margin-bottom: 8px;
//           color: rgba(255, 255, 255, 0.92);
//         }

//         .howList {
//           margin: 0;
//           padding-left: 18px;
//           color: rgba(255, 255, 255, 0.72);
//           line-height: 20px;
//           font-size: 13px;
//         }

//         .howList li {
//           margin: 6px 0;
//         }

//         /* ✅ Added: Disclaimer styling */
//         .disclaimer {
//           margin-top: 14px;
//           padding: 12px 16px 18px;
//           text-align: center;
//           font-size: 12px;
//           line-height: 18px;
//           color: rgba(255, 255, 255, 0.55);
//           border-top: 1px solid rgba(255, 255, 255, 0.10);
//         }

//         @media (max-width: 920px) {
//           .topRow {
//             grid-template-columns: 1fr;
//           }
//           .ballCol {
//             justify-content: flex-start;
//           }
//           .cardsRow {
//             grid-template-columns: 1fr;
//           }
//           .brand {
//             flex-direction: column;
//           }
//           .brandLogo {
//             width: 160px;
//           }
//         }
//       `}</style>
//     </main>
//   );
// }

// function InfoCard({
//   title,
//   icon,
//   lines,
//   accent,
//   badge,
// }: {
//   title: string;
//   icon: string;
//   lines: string[];
//   accent: "green" | "blue";
//   badge?: { type: "live" | "done"; text: string } | null;
// }) {
//   const accentBorder =
//     accent === "green"
//       ? "rgba(120,255,170,0.30)"
//       : "rgba(120,180,255,0.30)";
//   const accentBg =
//     accent === "green"
//       ? "rgba(120,255,170,0.07)"
//       : "rgba(120,180,255,0.07)";

//   return (
//     <div className="icard">
//       <div className="ihead">
//         <div className="ititle">
//           <span className="icon">{icon}</span> {title}
//         </div>

//         {badge?.type === "live" ? (
//           <div className="pillLive" title="Tournament has started">
//             <span className="dot" /> {badge.text}
//           </div>
//         ) : badge?.type === "done" ? (
//           <div className="pillDone" title="Tournament complete">
//             {badge.text}
//           </div>
//         ) : null}
//       </div>

//       <div className="ibody">
//         {lines.map((l, idx) => (
//           <div key={idx} className="iline">
//             {l}
//           </div>
//         ))}
//       </div>

//       <style jsx>{`
//         .icard {
//           border: 1px solid ${accentBorder};
//           background: ${accentBg};
//           border-radius: 18px;
//           padding: 14px;
//           box-shadow: 0 14px 35px rgba(0, 0, 0, 0.30);
//         }
//         .ihead {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 10px;
//           gap: 10px;
//         }
//         .ititle {
//           font-weight: 780;
//           letter-spacing: 0.2px;
//           display: flex;
//           align-items: center;
//           gap: 6px;
//         }
//         .ibody {
//           color: rgba(255, 255, 255, 0.80);
//           line-height: 20px;
//           font-size: 14px;
//         }
//         .iline {
//           margin-top: 6px;
//         }
//         .iline:first-child {
//           margin-top: 0;
//         }

//         .pillLive {
//           display: inline-flex;
//           align-items: center;
//           gap: 8px;
//           padding: 6px 10px;
//           border-radius: 999px;
//           border: 1px solid rgba(255, 120, 120, 0.45);
//           background: rgba(255, 90, 90, 0.10);
//           color: rgba(255, 230, 230, 0.95);
//           font-weight: 900;
//           letter-spacing: 0.4px;
//           font-size: 12px;
//           white-space: nowrap;
//         }
//         .dot {
//           width: 8px;
//           height: 8px;
//           border-radius: 999px;
//           background: rgba(255, 90, 90, 0.95);
//           box-shadow: 0 0 14px rgba(255, 90, 90, 0.75);
//           animation: pulse 1.1s ease-in-out infinite;
//         }

//         .pillDone {
//           padding: 6px 10px;
//           border-radius: 999px;
//           border: 1px solid rgba(180, 210, 255, 0.35);
//           background: rgba(120, 180, 255, 0.10);
//           color: rgba(220, 235, 255, 0.95);
//           font-weight: 900;
//           letter-spacing: 0.4px;
//           font-size: 12px;
//           white-space: nowrap;
//         }

//         @keyframes pulse {
//           0%,
//           100% {
//             transform: scale(1);
//             opacity: 1;
//           }
//           50% {
//             transform: scale(1.35);
//             opacity: 0.75;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// function SpinningBasketball() {
//   return (
//     <div className="ballWrap" aria-hidden="true">
//       <div className="ball">
//         <svg viewBox="0 0 100 100" className="ballSvg">
//           <defs>
//             <radialGradient id="g" cx="30%" cy="30%" r="70%">
//               <stop offset="0%" stopColor="#ffb36b" stopOpacity="1" />
//               <stop offset="55%" stopColor="#e67e22" stopOpacity="1" />
//               <stop offset="100%" stopColor="#b85a14" stopOpacity="1" />
//             </radialGradient>
//           </defs>
//           <circle cx="50" cy="50" r="48" fill="url(#g)" />
//           <circle
//             cx="50"
//             cy="50"
//             r="48"
//             fill="none"
//             stroke="rgba(0,0,0,0.35)"
//             strokeWidth="2"
//           />
//           <path d="M50 2 v96" stroke="rgba(0,0,0,0.55)" strokeWidth="3" />
//           <path d="M2 50 h96" stroke="rgba(0,0,0,0.55)" strokeWidth="3" />
//           <path
//             d="M18 10 C40 30, 40 70, 18 90"
//             fill="none"
//             stroke="rgba(0,0,0,0.55)"
//             strokeWidth="3"
//           />
//           <path
//             d="M82 10 C60 30, 60 70, 82 90"
//             fill="none"
//             stroke="rgba(0,0,0,0.55)"
//             strokeWidth="3"
//           />
//         </svg>
//       </div>

//       <style jsx>{`
//         .ballWrap {
//           width: 120px;
//           height: 120px;
//           display: grid;
//           place-items: center;
//           filter: drop-shadow(0 14px 24px rgba(0, 0, 0, 0.45));
//         }
//         .ball {
//           width: 106px;
//           height: 106px;
//           border-radius: 999px;
//           animation: spin 2.8s linear infinite, floaty 3.2s ease-in-out infinite;
//           transform-origin: 50% 50%;
//         }
//         .ballSvg {
//           width: 100%;
//           height: 100%;
//           border-radius: 999px;
//           display: block;
//         }
//         @keyframes spin {
//           from {
//             transform: rotate(0deg);
//           }
//           to {
//             transform: rotate(360deg);
//           }
//         }
//         @keyframes floaty {
//           0%,
//           100% {
//             translate: 0 0;
//           }
//           50% {
//             translate: 0 -6px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// function formatCountdown(ms: number) {
//   const totalSeconds = Math.floor(ms / 1000);
//   const days = Math.floor(totalSeconds / 86400);
//   const hours = Math.floor((totalSeconds % 86400) / 3600);
//   const minutes = Math.floor((totalSeconds % 3600) / 60);
//   const seconds = totalSeconds % 60;
//   return { days, hours, minutes, seconds };
// }

// function formatPhoenix(d: Date) {
//   try {
//     return new Intl.DateTimeFormat("en-US", {
//       timeZone: "America/Phoenix",
//       dateStyle: "full",
//       timeStyle: "short",
//     }).format(d);
//   } catch {
//     return d.toLocaleString();
//   }
// }





// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import { auth } from "@/lib/firebase";
// import {
//   GoogleAuthProvider,
//   onAuthStateChanged,
//   signInWithPopup,
//   signOut,
//   User,
// } from "firebase/auth";

// // Phoenix is UTC-7 year-round (no DST)
// const TOURNAMENT_START_ISO = "2026-02-18T19:00:00-07:00";
// const CHAMPIONSHIP_ISO = "2026-03-07T19:00:00-07:00";

// type Phase = "prestart" | "inprogress" | "complete";

// export default function HomePage() {
//   const [user, setUser] = useState<User | null>(null);
//   const [checking, setChecking] = useState(true);
//   const [status, setStatus] = useState("");

//   const tournamentStart = useMemo(() => new Date(TOURNAMENT_START_ISO), []);
//   const championship = useMemo(() => new Date(CHAMPIONSHIP_ISO), []);

//   const [mounted, setMounted] = useState(false);
//   const [now, setNow] = useState(0);

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (u) => {
//       setUser(u);
//       setChecking(false);
//     });
//     return () => unsub();
//   }, []);

//   useEffect(() => {
//     setMounted(true);
//     setNow(Date.now());
//     const t = setInterval(() => setNow(Date.now()), 1000);
//     return () => clearInterval(t);
//   }, []);

//   const nowMs = mounted ? now : tournamentStart.getTime();

//   const phase: Phase =
//     nowMs < tournamentStart.getTime()
//       ? "prestart"
//       : nowMs < championship.getTime()
//       ? "inprogress"
//       : "complete";

//   const targetDate = phase === "prestart" ? tournamentStart : championship;

//   const diffMs = targetDate.getTime() - nowMs;
//   const safeDiffMs = Math.max(0, diffMs);
//   const countdown = formatCountdown(safeDiffMs);

//   const tournamentStartPhoenixText = useMemo(
//     () => (mounted ? formatPhoenix(tournamentStart) : "Loading…"),
//     [mounted, tournamentStart]
//   );
//   const championshipPhoenixText = useMemo(
//     () => (mounted ? formatPhoenix(championship) : "Loading…"),
//     [mounted, championship]
//   );
//   const targetPhoenixText = useMemo(
//     () => (mounted ? formatPhoenix(targetDate) : "Loading…"),
//     [mounted, targetDate]
//   );

//   const countdownTitle =
//     phase === "prestart"
//       ? "Tournament Tip-off Countdown"
//       : phase === "inprogress"
//       ? "Championship Countdown"
//       : "Championship Status";

//   const countdownClockText = mounted
//     ? `${countdown.days}d ${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`
//     : "Loading countdown…";

//   const countdownLines =
//     phase === "prestart"
//       ? [
//           `Round starts (Phoenix): ${tournamentStartPhoenixText}`,
//           countdownClockText,
//           `Championship (Phoenix): ${championshipPhoenixText}`,
//         ]
//       : phase === "inprogress"
//       ? [`Championship (Phoenix): ${targetPhoenixText}`, countdownClockText]
//       : [`Championship (Phoenix): ${championshipPhoenixText}`, "Tournament complete."];

//   const badge =
//     phase === "inprogress"
//       ? { type: "live" as const, text: "LIVE" }
//       : phase === "complete"
//       ? { type: "done" as const, text: "COMPLETE" }
//       : null;

//   async function doGoogleSignIn() {
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

//   return (
//     <main className="wrap">
//       <div className="stage">
//         <div className="bgSpotlights" aria-hidden="true" />
//         <div className="bgVignette" aria-hidden="true" />

//         <header className="hero">
//           <div className="topRow">
//             <div className="brand">
//               {/* ✅ CHANGED: Your logo */}
//               <img
//                 className="brandLogo"
//                 src="/brand/azroadtoopen.png"
//                 alt="AZ Road to Open"
//                 onError={(e) => {
//                   (e.currentTarget as HTMLImageElement).style.display = "none";
//                 }}
//               />

//               <div className="brandText">
//                 {/* ✅ CHANGED: Title */}
//                 <div className="title">AZ Road to Open Tournament Competition</div>

//                 <div className="aiaStripe" aria-hidden="true" />

//                 <div className="subtitle">
//                   Predict the matchups between the top teams in Arizona high school basketball,
//                   and who will take home the trophy. Fill out your bracket and compete against
//                   others to see who can have the most accurate bracket.
//                 </div>
//               </div>
//             </div>

//             <div className="ballCol">
//               <SpinningBasketball />
//             </div>
//           </div>

//           {/* ✅ CHANGED: Panel moved ABOVE countdown/scoring */}
//           <section className="panel">
//             {checking ? (
//               <div className="muted">Loading…</div>
//             ) : user ? (
//               <>
//                 <div className="signedIn">
//                   <div className="muted">Signed in as</div>
//                   <div className="who">{user.displayName ?? user.email ?? "User"}</div>
//                   {user.email ? <div className="muted">{user.email}</div> : null}
//                 </div>

//                 <div className="btnRow">
//                   <Link className="hbtn hbtnBlue" href="/my-bracket">
//                     My Bracket
//                   </Link>

//                   <Link className="hbtn hbtnGold" href="/bracket">
//                     Live Bracket
//                   </Link>

//                   <Link className="hbtn hbtnRed" href="/leaderboard">
//                     Leaderboard
//                   </Link>

//                   <button className="hbtn hbtnGhost" onClick={doSignOut}>
//                     Sign out
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div className="signedOut">
//                   <div className="muted">
//                     Sign in to create and submit your bracket. Once submitted, it locks.
//                   </div>
//                 </div>

//                 <div className="btnRow">
//                   <button className="hbtn hbtnBlue" onClick={doGoogleSignIn}>
//                     Sign in with Google
//                   </button>

//                   <Link className="hbtn hbtnGold" href="/bracket">
//                     View Live Bracket
//                   </Link>

//                   <Link className="hbtn hbtnRed" href="/leaderboard">
//                     View Leaderboard
//                   </Link>
//                 </div>
//               </>
//             )}

//             {status ? <div className="status">{status}</div> : null}
//           </section>

//           <div className="cardsRow">
//             <InfoCard
//               title={countdownTitle}
//               icon="⏳"
//               accent="green"
//               badge={badge}
//               lines={countdownLines}
//             />

//             <InfoCard
//               title="Scoring"
//               icon="🏀"
//               accent="blue"
//               lines={[
//                 "Round 1 = 1 point per correct pick",
//                 "Round 2 = 2 points",
//                 "Round 3 = 4 points",
//                 "Round 4 = 8 points",
//                 "Final = 16 points",
//               ]}
//             />
//           </div>

//           <section className="howToPlay">
//             <div className="howTitle">How to play</div>
//             <ol className="howList">
//               <li>
//                 Go to <b>My Bracket</b> and pick winners (later rounds auto-fill).
//               </li>
//               <li>
//                 Hit <b>Submit Bracket</b> to lock your picks before tip-off:{" "}
//                 <b>{tournamentStartPhoenixText}</b>.
//               </li>
//               <li>
//                 Watch <b>Live Bracket</b> + <b>Leaderboard</b> update as winners are set.
//               </li>
//             </ol>
//           </section>
//         </header>

//         <footer className="disclaimer">
//           Unofficial bracket competition. Not affiliated with AIA. Please DM @charlie.richards13 on IG to report any bugs or issues. Good luck and have fun!
//         </footer>
//       </div>

//       <style jsx>{`
//         .wrap {
//           padding: 28px 18px 110px;
//           color: #fff;
//           display: flex;
//           justify-content: center;
//         }

//         .stage {
//           width: 100%;
//           max-width: 1120px;
//           position: relative;
//           border-radius: 22px;
//           overflow: hidden;
//           border: 1px solid rgba(255, 255, 255, 0.1);
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
//           background: radial-gradient(1200px 700px at 50% 10%, rgba(0,0,0,0), rgba(0,0,0,0.65));
//           pointer-events: none;
//         }

//         .hero {
//           position: relative;
//           padding: 22px;
//         }

//         .topRow {
//           display: grid;
//           grid-template-columns: 1fr auto;
//           gap: 18px;
//           align-items: start;
//         }

//         .brand {
//           display: flex;
//           gap: 14px;
//           align-items: flex-start;
//         }

//         .brandLogo {
//           width: 120px;
//           height: auto;
//           filter: drop-shadow(0 12px 22px rgba(0, 0, 0, 0.45));
//           border-radius: 10px;
//           background: rgba(255,255,255,0.06);
//           border: 1px solid rgba(255,255,255,0.10);
//           padding: 6px;
//         }

//         .brandText .title {
//           font-size: 22px;
//           font-weight: 780;
//           letter-spacing: 0.2px;
//           margin-bottom: 10px;
//         }

//         .aiaStripe {
//           height: 10px;
//           width: min(520px, 100%);
//           border-radius: 999px;
//           margin-bottom: 12px;
//           opacity: 0.95;
//           background: linear-gradient(
//             90deg,
//             #1f6db3 0%,
//             #1f6db3 62%,
//             #f2c230 62%,
//             #f2c230 78%,
//             #d6463a 78%,
//             #d6463a 100%
//           );
//           box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
//           border: 1px solid rgba(255,255,255,0.10);
//         }

//         .brandText .subtitle {
//           font-size: 16px;
//           line-height: 24px;
//           color: rgba(255, 255, 255, 0.80);
//           max-width: 860px;
//         }

//         .ballCol {
//           display: flex;
//           justify-content: flex-end;
//           padding-top: 6px;
//         }

//         .cardsRow {
//           margin-top: 16px;
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 12px;
//         }

//         .panel {
//           margin-top: 16px;
//           border: 1px solid rgba(255, 255, 255, 0.12);
//           border-radius: 18px;
//           background: rgba(255, 255, 255, 0.04);
//           box-shadow: 0 18px 45px rgba(0, 0, 0, 0.35);
//           padding: 18px;
//         }

//         .muted {
//           color: rgba(255, 255, 255, 0.72);
//         }

//         .who {
//           font-size: 18px;
//           font-weight: 780;
//           margin: 2px 0 2px;
//         }

//         .btnRow {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 10px;
//           align-items: center;
//           margin-top: 14px;
//         }

//         :global(.hbtn) {
//           border-radius: 12px;
//           padding: 11px 14px;
//           border: 1px solid rgba(255, 255, 255, 0.28);
//           text-decoration: none;
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           font-weight: 720;
//           cursor: pointer;
//           user-select: none;
//           transition: transform 120ms ease, background 120ms ease, border 120ms ease;
//           color: #fff;
//         }

//         :global(.hbtnBlue) {
//           background: rgba(31, 109, 179, 0.18);
//           border-color: rgba(31, 109, 179, 0.60);
//         }
//         :global(.hbtnGold) {
//           background: rgba(242, 194, 48, 0.14);
//           border-color: rgba(242, 194, 48, 0.60);
//         }
//         :global(.hbtnRed) {
//           background: rgba(214, 70, 58, 0.16);
//           border-color: rgba(214, 70, 58, 0.60);
//         }
//         :global(.hbtnGhost) {
//           background: rgba(0, 0, 0, 0.22);
//           color: rgba(255, 255, 255, 0.92);
//           border-color: rgba(255, 255, 255, 0.28);
//         }

//         :global(.hbtn:hover) {
//           transform: translateY(-1px);
//         }

//         .status {
//           margin-top: 12px;
//           color: rgba(183, 255, 183, 0.95);
//         }

//         .howToPlay {
//           margin-top: 14px;
//           border: 1px solid rgba(255, 255, 255, 0.10);
//           border-radius: 18px;
//           background: rgba(0, 0, 0, 0.18);
//           padding: 14px 16px;
//         }

//         .howTitle {
//           font-weight: 800;
//           letter-spacing: 0.2px;
//           margin-bottom: 8px;
//           color: rgba(255, 255, 255, 0.92);
//         }

//         .howList {
//           margin: 0;
//           padding-left: 18px;
//           color: rgba(255, 255, 255, 0.72);
//           line-height: 20px;
//           font-size: 13px;
//         }

//         .howList li {
//           margin: 6px 0;
//         }

//         .disclaimer {
//           margin-top: 14px;
//           padding: 12px 16px 18px;
//           text-align: center;
//           font-size: 12px;
//           line-height: 18px;
//           color: rgba(255, 255, 255, 0.55);
//           border-top: 1px solid rgba(255, 255, 255, 0.10);
//         }

//         @media (max-width: 920px) {
//           .topRow {
//             grid-template-columns: 1fr;
//           }
//           .ballCol {
//             justify-content: flex-start;
//           }
//           .cardsRow {
//             grid-template-columns: 1fr;
//           }
//           .brand {
//             flex-direction: column;
//           }
//           .brandLogo {
//             width: 160px;
//           }
//         }
//       `}</style>
//     </main>
//   );
// }

// function InfoCard({
//   title,
//   icon,
//   lines,
//   accent,
//   badge,
// }: {
//   title: string;
//   icon: string;
//   lines: string[];
//   accent: "green" | "blue";
//   badge?: { type: "live" | "done"; text: string } | null;
// }) {
//   const accentBorder =
//     accent === "green" ? "rgba(120,255,170,0.30)" : "rgba(120,180,255,0.30)";
//   const accentBg =
//     accent === "green" ? "rgba(120,255,170,0.07)" : "rgba(120,180,255,0.07)";

//   return (
//     <div className="icard">
//       <div className="ihead">
//         <div className="ititle">
//           <span className="icon">{icon}</span> {title}
//         </div>

//         {badge?.type === "live" ? (
//           <div className="pillLive" title="Tournament has started">
//             <span className="dot" /> {badge.text}
//           </div>
//         ) : badge?.type === "done" ? (
//           <div className="pillDone" title="Tournament complete">
//             {badge.text}
//           </div>
//         ) : null}
//       </div>

//       <div className="ibody">
//         {lines.map((l, idx) => (
//           <div key={idx} className="iline">
//             {l}
//           </div>
//         ))}
//       </div>

//       <style jsx>{`
//         .icard {
//           border: 1px solid ${accentBorder};
//           background: ${accentBg};
//           border-radius: 18px;
//           padding: 14px;
//           box-shadow: 0 14px 35px rgba(0, 0, 0, 0.30);
//         }
//         .ihead {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 10px;
//           gap: 10px;
//         }
//         .ititle {
//           font-weight: 780;
//           letter-spacing: 0.2px;
//           display: flex;
//           align-items: center;
//           gap: 6px;
//         }
//         .ibody {
//           color: rgba(255, 255, 255, 0.80);
//           line-height: 20px;
//           font-size: 14px;
//         }
//         .iline {
//           margin-top: 6px;
//         }
//         .iline:first-child {
//           margin-top: 0;
//         }

//         .pillLive {
//           display: inline-flex;
//           align-items: center;
//           gap: 8px;
//           padding: 6px 10px;
//           border-radius: 999px;
//           border: 1px solid rgba(255, 120, 120, 0.45);
//           background: rgba(255, 90, 90, 0.10);
//           color: rgba(255, 230, 230, 0.95);
//           font-weight: 900;
//           letter-spacing: 0.4px;
//           font-size: 12px;
//           white-space: nowrap;
//         }
//         .dot {
//           width: 8px;
//           height: 8px;
//           border-radius: 999px;
//           background: rgba(255, 90, 90, 0.95);
//           box-shadow: 0 0 14px rgba(255, 90, 90, 0.75);
//           animation: pulse 1.1s ease-in-out infinite;
//         }

//         .pillDone {
//           padding: 6px 10px;
//           border-radius: 999px;
//           border: 1px solid rgba(180, 210, 255, 0.35);
//           background: rgba(120, 180, 255, 0.10);
//           color: rgba(220, 235, 255, 0.95);
//           font-weight: 900;
//           letter-spacing: 0.4px;
//           font-size: 12px;
//           white-space: nowrap;
//         }

//         @keyframes pulse {
//           0%,
//           100% {
//             transform: scale(1);
//             opacity: 1;
//           }
//           50% {
//             transform: scale(1.35);
//             opacity: 0.75;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// function SpinningBasketball() {
//   return (
//     <div className="ballWrap" aria-hidden="true">
//       <div className="ball">
//         <svg viewBox="0 0 100 100" className="ballSvg">
//           <defs>
//             <radialGradient id="g" cx="30%" cy="30%" r="70%">
//               <stop offset="0%" stopColor="#ffb36b" stopOpacity="1" />
//               <stop offset="55%" stopColor="#e67e22" stopOpacity="1" />
//               <stop offset="100%" stopColor="#b85a14" stopOpacity="1" />
//             </radialGradient>
//           </defs>
//           <circle cx="50" cy="50" r="48" fill="url(#g)" />
//           <circle
//             cx="50"
//             cy="50"
//             r="48"
//             fill="none"
//             stroke="rgba(0,0,0,0.35)"
//             strokeWidth="2"
//           />
//           <path d="M50 2 v96" stroke="rgba(0,0,0,0.55)" strokeWidth="3" />
//           <path d="M2 50 h96" stroke="rgba(0,0,0,0.55)" strokeWidth="3" />
//           <path
//             d="M18 10 C40 30, 40 70, 18 90"
//             fill="none"
//             stroke="rgba(0,0,0,0.55)"
//             strokeWidth="3"
//           />
//           <path
//             d="M82 10 C60 30, 60 70, 82 90"
//             fill="none"
//             stroke="rgba(0,0,0,0.55)"
//             strokeWidth="3"
//           />
//         </svg>
//       </div>

//       <style jsx>{`
//         .ballWrap {
//           width: 120px;
//           height: 120px;
//           display: grid;
//           place-items: center;
//           filter: drop-shadow(0 14px 24px rgba(0, 0, 0, 0.45));
//         }
//         .ball {
//           width: 106px;
//           height: 106px;
//           border-radius: 999px;
//           animation: spin 2.8s linear infinite, floaty 3.2s ease-in-out infinite;
//           transform-origin: 50% 50%;
//         }
//         .ballSvg {
//           width: 100%;
//           height: 100%;
//           border-radius: 999px;
//           display: block;
//         }
//         @keyframes spin {
//           from {
//             transform: rotate(0deg);
//           }
//           to {
//             transform: rotate(360deg);
//           }
//         }
//         @keyframes floaty {
//           0%,
//           100% {
//             translate: 0 0;
//           }
//           50% {
//             translate: 0 -6px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// function formatCountdown(ms: number) {
//   const totalSeconds = Math.floor(ms / 1000);
//   const days = Math.floor(totalSeconds / 86400);
//   const hours = Math.floor((totalSeconds % 86400) / 3600);
//   const minutes = Math.floor((totalSeconds % 3600) / 60);
//   const seconds = totalSeconds % 60;
//   return { days, hours, minutes, seconds };
// }

// function formatPhoenix(d: Date) {
//   try {
//     return new Intl.DateTimeFormat("en-US", {
//       timeZone: "America/Phoenix",
//       dateStyle: "full",
//       timeStyle: "short",
//     }).format(d);
//   } catch {
//     return d.toLocaleString();
//   }
// }







// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import { auth } from "@/lib/firebase";
// import {
//   GoogleAuthProvider,
//   onAuthStateChanged,
//   signInWithPopup,
//   signInWithRedirect,
//   signOut,
//   User,
// } from "firebase/auth";

// // Phoenix is UTC-7 year-round (no DST)
// const TOURNAMENT_START_ISO = "2026-02-18T19:00:00-07:00";
// const CHAMPIONSHIP_ISO = "2026-03-07T19:00:00-07:00";

// type Phase = "prestart" | "inprogress" | "complete";

// function isInAppBrowser() {
//   if (typeof navigator === "undefined") return false;
//   const ua = navigator.userAgent || "";
//   // Common embedded browsers that often break OAuth popups/cookies
//   return (
//     /Snapchat/i.test(ua) ||
//     /Instagram/i.test(ua) ||
//     /FBAN|FBAV/i.test(ua) || // Facebook
//     /TikTok/i.test(ua)
//   );
// }

// function isIOS() {
//   if (typeof navigator === "undefined") return false;
//   const ua = navigator.userAgent || "";
//   return /iPhone|iPad|iPod/i.test(ua);
// }

// export default function HomePage() {
//   const [user, setUser] = useState<User | null>(null);
//   const [checking, setChecking] = useState(true);
//   const [status, setStatus] = useState("");

//   const tournamentStart = useMemo(() => new Date(TOURNAMENT_START_ISO), []);
//   const championship = useMemo(() => new Date(CHAMPIONSHIP_ISO), []);

//   const [mounted, setMounted] = useState(false);
//   const [now, setNow] = useState(0);

//   const [inApp, setInApp] = useState(false);
//   const [copied, setCopied] = useState(false);

//   useEffect(() => {
//     setInApp(isInAppBrowser());
//   }, []);

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (u) => {
//       setUser(u);
//       setChecking(false);
//     });
//     return () => unsub();
//   }, []);

//   useEffect(() => {
//     setMounted(true);
//     setNow(Date.now());
//     const t = setInterval(() => setNow(Date.now()), 1000);
//     return () => clearInterval(t);
//   }, []);

//   const nowMs = mounted ? now : tournamentStart.getTime();

//   const phase: Phase =
//     nowMs < tournamentStart.getTime()
//       ? "prestart"
//       : nowMs < championship.getTime()
//       ? "inprogress"
//       : "complete";

//   const targetDate = phase === "prestart" ? tournamentStart : championship;

//   const diffMs = targetDate.getTime() - nowMs;
//   const safeDiffMs = Math.max(0, diffMs);
//   const countdown = formatCountdown(safeDiffMs);

//   const tournamentStartPhoenixText = useMemo(
//     () => (mounted ? formatPhoenix(tournamentStart) : "Loading…"),
//     [mounted, tournamentStart]
//   );
//   const championshipPhoenixText = useMemo(
//     () => (mounted ? formatPhoenix(championship) : "Loading…"),
//     [mounted, championship]
//   );
//   const targetPhoenixText = useMemo(
//     () => (mounted ? formatPhoenix(targetDate) : "Loading…"),
//     [mounted, targetDate]
//   );

//   const countdownTitle =
//     phase === "prestart"
//       ? "Tournament Tip-off Countdown"
//       : phase === "inprogress"
//       ? "Championship Countdown"
//       : "Championship Status";

//   const countdownClockText = mounted
//     ? `${countdown.days}d ${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`
//     : "Loading countdown…";

//   const countdownLines =
//     phase === "prestart"
//       ? [
//           `Round starts (Phoenix): ${tournamentStartPhoenixText}`,
//           countdownClockText,
//           `Championship (Phoenix): ${championshipPhoenixText}`,
//         ]
//       : phase === "inprogress"
//       ? [`Championship (Phoenix): ${targetPhoenixText}`, countdownClockText]
//       : [`Championship (Phoenix): ${championshipPhoenixText}`, "Tournament complete."];

//   const badge =
//     phase === "inprogress"
//       ? { type: "live" as const, text: "LIVE" }
//       : phase === "complete"
//       ? { type: "done" as const, text: "COMPLETE" }
//       : null;

//   async function doGoogleSignIn() {
//     setStatus("");
//     setCopied(false);

//     try {
//       const provider = new GoogleAuthProvider();

//       // ✅ Key fix: embedded browsers often fail popup. Use redirect there.
//       if (inApp) {
//         await signInWithRedirect(auth, provider);
//         return;
//       }

//       await signInWithPopup(auth, provider);
//     } catch (e: any) {
//       const msg = e?.message ?? String(e);
//       // Give a friendlier hint for in-app cases
//       if (inApp) {
//         setStatus(
//           `Sign-in failed inside this in-app browser. Please tap “Open in Browser” (Safari/Chrome) and try again. (${msg})`
//         );
//       } else {
//         setStatus(`Sign-in failed: ${msg}`);
//       }
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

//   async function copyLink() {
//     try {
//       const url = typeof window !== "undefined" ? window.location.href : "https://azroadtoopen.com";
//       await navigator.clipboard.writeText(url);
//       setCopied(true);
//       setStatus("Link copied! Paste it into Safari/Chrome (or text it to a friend).");
//       setTimeout(() => setCopied(false), 1600);
//     } catch {
//       setStatus("Could not copy link on this device/browser. Try selecting the URL and copying manually.");
//     }
//   }

//   const inAppHelpText = useMemo(() => {
//     if (!inApp) return null;
//     const ios = isIOS();
//     return ios
//       ? `You're viewing this inside an in-app browser. If Google sign-in fails, tap the Share icon and choose “Open in Safari”.`
//       : `You're viewing this inside an in-app browser. If Google sign-in fails, tap the ⋮ menu and choose “Open in browser” (Chrome).`;
//   }, [inApp]);

//   return (
//     <main className="wrap">
//       <div className="stage">
//         <div className="bgSpotlights" aria-hidden="true" />
//         <div className="bgVignette" aria-hidden="true" />

//         <header className="hero">
//           <div className="topRow">
//             <div className="brand">
//               <img
//                 className="brandLogo"
//                 src="/brand/azroadtoopen.png"
//                 alt="AZ Road to Open"
//                 onError={(e) => {
//                   (e.currentTarget as HTMLImageElement).style.display = "none";
//                 }}
//               />

//               <div className="brandText">
//                 <div className="title">AZ Road to Open Tournament Competition</div>

//                 <div className="aiaStripe" aria-hidden="true" />

//                 <div className="subtitle">
//                   Predict the matchups between the top teams in Arizona high school basketball,
//                   and who will take home the trophy. Fill out your bracket and compete against
//                   others to see who can have the most accurate bracket.
//                 </div>
//               </div>
//             </div>

//             <div className="ballCol">
//               <SpinningBasketball />
//             </div>
//           </div>

//           {/* ✅ NEW: In-app browser warning */}
//           {inApp ? (
//             <section className="inAppBanner">
//               <div className="inAppTitle">⚠️ In-app browser detected</div>
//               <div className="inAppText">{inAppHelpText}</div>

//               <div className="inAppActions">
//                 <button className="hbtn hbtnGhost" onClick={copyLink}>
//                   {copied ? "Copied!" : "Copy Link"}
//                 </button>

//                 <a
//                   className="hbtn hbtnGhost"
//                   href="https://azroadtoopen.com"
//                   target="_blank"
//                   rel="noreferrer"
//                   title="Open in a full browser"
//                 >
//                   Open in Browser
//                 </a>
//               </div>
//             </section>
//           ) : null}

//           <section className="panel">
//             {checking ? (
//               <div className="muted">Loading…</div>
//             ) : user ? (
//               <>
//                 <div className="signedIn">
//                   <div className="muted">Signed in as</div>
//                   <div className="who">{user.displayName ?? user.email ?? "User"}</div>
//                   {user.email ? <div className="muted">{user.email}</div> : null}
//                 </div>

//                 <div className="btnRow">
//                   <Link className="hbtn hbtnBlue" href="/my-bracket">
//                     My Bracket
//                   </Link>

//                   <Link className="hbtn hbtnGold" href="/bracket">
//                     Live Bracket
//                   </Link>

//                   <Link className="hbtn hbtnRed" href="/leaderboard">
//                     Leaderboard
//                   </Link>

//                   <button className="hbtn hbtnGhost" onClick={doSignOut}>
//                     Sign out
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div className="signedOut">
//                   <div className="muted">
//                     Sign in to create and submit your bracket. Once submitted, it locks.
//                   </div>
//                 </div>

//                 <div className="btnRow">
//                   <button className="hbtn hbtnBlue" onClick={doGoogleSignIn}>
//                     Sign in with Google
//                   </button>

//                   <Link className="hbtn hbtnGold" href="/bracket">
//                     View Live Bracket
//                   </Link>

//                   <Link className="hbtn hbtnRed" href="/leaderboard">
//                     View Leaderboard
//                   </Link>
//                 </div>
//               </>
//             )}

//             {status ? <div className="status">{status}</div> : null}
//           </section>

//           <div className="cardsRow">
//             <InfoCard
//               title={countdownTitle}
//               icon="⏳"
//               accent="green"
//               badge={badge}
//               lines={countdownLines}
//             />

//             <InfoCard
//               title="Scoring"
//               icon="🏀"
//               accent="blue"
//               lines={[
//                 "Round 1 = 1 point per correct pick",
//                 "Round 2 = 2 points",
//                 "Round 3 = 4 points",
//                 "Round 4 = 8 points",
//                 "Final = 16 points",
//               ]}
//             />
//           </div>

//           <section className="howToPlay">
//             <div className="howTitle">How to play</div>
//             <ol className="howList">
//               <li>
//                 Go to <b>My Bracket</b> and pick winners (later rounds auto-fill).
//               </li>
//               <li>
//                 Hit <b>Submit Bracket</b> to lock your picks before tip-off:{" "}
//                 <b>{tournamentStartPhoenixText}</b>.
//               </li>
//               <li>
//                 Watch <b>Live Bracket</b> + <b>Leaderboard</b> update as winners are set.
//               </li>
//             </ol>
//           </section>
//         </header>

//         <footer className="disclaimer">
//           Unofficial bracket competition. Not affiliated with AIA. Please DM @charlie.richards13 on IG
//           to report any bugs or issues. Good luck and have fun!
//         </footer>
//       </div>

//       <style jsx>{`
//         .wrap {
//           padding: 28px 18px 110px;
//           color: #fff;
//           display: flex;
//           justify-content: center;
//         }

//         .stage {
//           width: 100%;
//           max-width: 1120px;
//           position: relative;
//           border-radius: 22px;
//           overflow: hidden;
//           border: 1px solid rgba(255, 255, 255, 0.1);
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
//           background: radial-gradient(1200px 700px at 50% 10%, rgba(0,0,0,0), rgba(0,0,0,0.65));
//           pointer-events: none;
//         }

//         .hero {
//           position: relative;
//           padding: 22px;
//         }

//         .topRow {
//           display: grid;
//           grid-template-columns: 1fr auto;
//           gap: 18px;
//           align-items: start;
//         }

//         .brand {
//           display: flex;
//           gap: 14px;
//           align-items: flex-start;
//         }

//         .brandLogo {
//           width: 120px;
//           height: auto;
//           filter: drop-shadow(0 12px 22px rgba(0, 0, 0, 0.45));
//           border-radius: 10px;
//           background: rgba(255,255,255,0.06);
//           border: 1px solid rgba(255,255,255,0.10);
//           padding: 6px;
//         }

//         .brandText .title {
//           font-size: 22px;
//           font-weight: 780;
//           letter-spacing: 0.2px;
//           margin-bottom: 10px;
//         }

//         .aiaStripe {
//           height: 10px;
//           width: min(520px, 100%);
//           border-radius: 999px;
//           margin-bottom: 12px;
//           opacity: 0.95;
//           background: linear-gradient(
//             90deg,
//             #1f6db3 0%,
//             #1f6db3 62%,
//             #f2c230 62%,
//             #f2c230 78%,
//             #d6463a 78%,
//             #d6463a 100%
//           );
//           box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
//           border: 1px solid rgba(255,255,255,0.10);
//         }

//         .brandText .subtitle {
//           font-size: 16px;
//           line-height: 24px;
//           color: rgba(255, 255, 255, 0.80);
//           max-width: 860px;
//         }

//         .ballCol {
//           display: flex;
//           justify-content: flex-end;
//           padding-top: 6px;
//         }

//         /* ✅ NEW banner */
//         .inAppBanner {
//           margin-top: 14px;
//           border: 1px solid rgba(255, 255, 255, 0.12);
//           border-radius: 18px;
//           background: rgba(0, 0, 0, 0.30);
//           padding: 14px 16px;
//           box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
//         }
//         .inAppTitle {
//           font-weight: 900;
//           letter-spacing: 0.2px;
//           margin-bottom: 6px;
//         }
//         .inAppText {
//           opacity: 0.82;
//           font-size: 13px;
//           line-height: 18px;
//         }
//         .inAppActions {
//           margin-top: 10px;
//           display: flex;
//           flex-wrap: wrap;
//           gap: 10px;
//         }

//         .cardsRow {
//           margin-top: 16px;
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 12px;
//         }

//         .panel {
//           margin-top: 16px;
//           border: 1px solid rgba(255, 255, 255, 0.12);
//           border-radius: 18px;
//           background: rgba(255, 255, 255, 0.04);
//           box-shadow: 0 18px 45px rgba(0, 0, 0, 0.35);
//           padding: 18px;
//         }

//         .muted {
//           color: rgba(255, 255, 255, 0.72);
//         }

//         .who {
//           font-size: 18px;
//           font-weight: 780;
//           margin: 2px 0 2px;
//         }

//         .btnRow {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 10px;
//           align-items: center;
//           margin-top: 14px;
//         }

//         :global(.hbtn) {
//           border-radius: 12px;
//           padding: 11px 14px;
//           border: 1px solid rgba(255, 255, 255, 0.28);
//           text-decoration: none;
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           font-weight: 720;
//           cursor: pointer;
//           user-select: none;
//           transition: transform 120ms ease, background 120ms ease, border 120ms ease;
//           color: #fff;
//         }

//         :global(.hbtnBlue) {
//           background: rgba(31, 109, 179, 0.18);
//           border-color: rgba(31, 109, 179, 0.60);
//         }
//         :global(.hbtnGold) {
//           background: rgba(242, 194, 48, 0.14);
//           border-color: rgba(242, 194, 48, 0.60);
//         }
//         :global(.hbtnRed) {
//           background: rgba(214, 70, 58, 0.16);
//           border-color: rgba(214, 70, 58, 0.60);
//         }
//         :global(.hbtnGhost) {
//           background: rgba(0, 0, 0, 0.22);
//           color: rgba(255, 255, 255, 0.92);
//           border-color: rgba(255, 255, 255, 0.28);
//         }

//         :global(.hbtn:hover) {
//           transform: translateY(-1px);
//         }

//         .status {
//           margin-top: 12px;
//           color: rgba(183, 255, 183, 0.95);
//           font-size: 13px;
//           line-height: 18px;
//         }

//         .howToPlay {
//           margin-top: 14px;
//           border: 1px solid rgba(255, 255, 255, 0.10);
//           border-radius: 18px;
//           background: rgba(0, 0, 0, 0.18);
//           padding: 14px 16px;
//         }

//         .howTitle {
//           font-weight: 800;
//           letter-spacing: 0.2px;
//           margin-bottom: 8px;
//           color: rgba(255, 255, 255, 0.92);
//         }

//         .howList {
//           margin: 0;
//           padding-left: 18px;
//           color: rgba(255, 255, 255, 0.72);
//           line-height: 20px;
//           font-size: 13px;
//         }

//         .howList li {
//           margin: 6px 0;
//         }

//         .disclaimer {
//           margin-top: 14px;
//           padding: 12px 16px 18px;
//           text-align: center;
//           font-size: 12px;
//           line-height: 18px;
//           color: rgba(255, 255, 255, 0.55);
//           border-top: 1px solid rgba(255, 255, 255, 0.10);
//         }

//         @media (max-width: 920px) {
//           .topRow {
//             grid-template-columns: 1fr;
//           }
//           .ballCol {
//             justify-content: flex-start;
//           }
//           .cardsRow {
//             grid-template-columns: 1fr;
//           }
//           .brand {
//             flex-direction: column;
//           }
//           .brandLogo {
//             width: 160px;
//           }
//         }
//       `}</style>
//     </main>
//   );
// }

// function InfoCard({
//   title,
//   icon,
//   lines,
//   accent,
//   badge,
// }: {
//   title: string;
//   icon: string;
//   lines: string[];
//   accent: "green" | "blue";
//   badge?: { type: "live" | "done"; text: string } | null;
// }) {
//   const accentBorder =
//     accent === "green" ? "rgba(120,255,170,0.30)" : "rgba(120,180,255,0.30)";
//   const accentBg =
//     accent === "green" ? "rgba(120,255,170,0.07)" : "rgba(120,180,255,0.07)";

//   return (
//     <div className="icard">
//       <div className="ihead">
//         <div className="ititle">
//           <span className="icon">{icon}</span> {title}
//         </div>

//         {badge?.type === "live" ? (
//           <div className="pillLive" title="Tournament has started">
//             <span className="dot" /> {badge.text}
//           </div>
//         ) : badge?.type === "done" ? (
//           <div className="pillDone" title="Tournament complete">
//             {badge.text}
//           </div>
//         ) : null}
//       </div>

//       <div className="ibody">
//         {lines.map((l, idx) => (
//           <div key={idx} className="iline">
//             {l}
//           </div>
//         ))}
//       </div>

//       <style jsx>{`
//         .icard {
//           border: 1px solid ${accentBorder};
//           background: ${accentBg};
//           border-radius: 18px;
//           padding: 14px;
//           box-shadow: 0 14px 35px rgba(0, 0, 0, 0.30);
//         }
//         .ihead {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 10px;
//           gap: 10px;
//         }
//         .ititle {
//           font-weight: 780;
//           letter-spacing: 0.2px;
//           display: flex;
//           align-items: center;
//           gap: 6px;
//         }
//         .ibody {
//           color: rgba(255, 255, 255, 0.80);
//           line-height: 20px;
//           font-size: 14px;
//         }
//         .iline {
//           margin-top: 6px;
//         }
//         .iline:first-child {
//           margin-top: 0;
//         }

//         .pillLive {
//           display: inline-flex;
//           align-items: center;
//           gap: 8px;
//           padding: 6px 10px;
//           border-radius: 999px;
//           border: 1px solid rgba(255, 120, 120, 0.45);
//           background: rgba(255, 90, 90, 0.10);
//           color: rgba(255, 230, 230, 0.95);
//           font-weight: 900;
//           letter-spacing: 0.4px;
//           font-size: 12px;
//           white-space: nowrap;
//         }
//         .dot {
//           width: 8px;
//           height: 8px;
//           border-radius: 999px;
//           background: rgba(255, 90, 90, 0.95);
//           box-shadow: 0 0 14px rgba(255, 90, 90, 0.75);
//           animation: pulse 1.1s ease-in-out infinite;
//         }

//         .pillDone {
//           padding: 6px 10px;
//           border-radius: 999px;
//           border: 1px solid rgba(180, 210, 255, 0.35);
//           background: rgba(120, 180, 255, 0.10);
//           color: rgba(220, 235, 255, 0.95);
//           font-weight: 900;
//           letter-spacing: 0.4px;
//           font-size: 12px;
//           white-space: nowrap;
//         }

//         @keyframes pulse {
//           0%,
//           100% {
//             transform: scale(1);
//             opacity: 1;
//           }
//           50% {
//             transform: scale(1.35);
//             opacity: 0.75;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// function SpinningBasketball() {
//   return (
//     <div className="ballWrap" aria-hidden="true">
//       <div className="ball">
//         <svg viewBox="0 0 100 100" className="ballSvg">
//           <defs>
//             <radialGradient id="g" cx="30%" cy="30%" r="70%">
//               <stop offset="0%" stopColor="#ffb36b" stopOpacity="1" />
//               <stop offset="55%" stopColor="#e67e22" stopOpacity="1" />
//               <stop offset="100%" stopColor="#b85a14" stopOpacity="1" />
//             </radialGradient>
//           </defs>
//           <circle cx="50" cy="50" r="48" fill="url(#g)" />
//           <circle
//             cx="50"
//             cy="50"
//             r="48"
//             fill="none"
//             stroke="rgba(0,0,0,0.35)"
//             strokeWidth="2"
//           />
//           <path d="M50 2 v96" stroke="rgba(0,0,0,0.55)" strokeWidth="3" />
//           <path d="M2 50 h96" stroke="rgba(0,0,0,0.55)" strokeWidth="3" />
//           <path
//             d="M18 10 C40 30, 40 70, 18 90"
//             fill="none"
//             stroke="rgba(0,0,0,0.55)"
//             strokeWidth="3"
//           />
//           <path
//             d="M82 10 C60 30, 60 70, 82 90"
//             fill="none"
//             stroke="rgba(0,0,0,0.55)"
//             strokeWidth="3"
//           />
//         </svg>
//       </div>

//       <style jsx>{`
//         .ballWrap {
//           width: 120px;
//           height: 120px;
//           display: grid;
//           place-items: center;
//           filter: drop-shadow(0 14px 24px rgba(0, 0, 0, 0.45));
//         }
//         .ball {
//           width: 106px;
//           height: 106px;
//           border-radius: 999px;
//           animation: spin 2.8s linear infinite, floaty 3.2s ease-in-out infinite;
//           transform-origin: 50% 50%;
//         }
//         .ballSvg {
//           width: 100%;
//           height: 100%;
//           border-radius: 999px;
//           display: block;
//         }
//         @keyframes spin {
//           from {
//             transform: rotate(0deg);
//           }
//           to {
//             transform: rotate(360deg);
//           }
//         }
//         @keyframes floaty {
//           0%,
//           100% {
//             translate: 0 0;
//           }
//           50% {
//             translate: 0 -6px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// function formatCountdown(ms: number) {
//   const totalSeconds = Math.floor(ms / 1000);
//   const days = Math.floor(totalSeconds / 86400);
//   const hours = Math.floor((totalSeconds % 86400) / 3600);
//   const minutes = Math.floor((totalSeconds % 3600) / 60);
//   const seconds = totalSeconds % 60;
//   return { days, hours, minutes, seconds };
// }

// function formatPhoenix(d: Date) {
//   try {
//     return new Intl.DateTimeFormat("en-US", {
//       timeZone: "America/Phoenix",
//       dateStyle: "full",
//       timeStyle: "short",
//     }).format(d);
//   } catch {
//     return d.toLocaleString();
//   }
// }




// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import { auth } from "@/lib/firebase";
// import {
//   GoogleAuthProvider,
//   onAuthStateChanged,
//   signInWithPopup,
//   signOut,
//   User,
// } from "firebase/auth";

// // Phoenix is UTC-7 year-round (no DST)
// const TOURNAMENT_START_ISO = "2026-02-18T19:00:00-07:00";
// const CHAMPIONSHIP_ISO = "2026-03-07T19:00:00-07:00";

// type Phase = "prestart" | "inprogress" | "complete";

// function isInAppBrowser() {
//   if (typeof navigator === "undefined") return false;
//   const ua = navigator.userAgent || "";
//   return (
//     /Snapchat/i.test(ua) ||
//     /Instagram/i.test(ua) ||
//     /FBAN|FBAV/i.test(ua) ||
//     /TikTok/i.test(ua)
//   );
// }

// function isIOS() {
//   if (typeof navigator === "undefined") return false;
//   const ua = navigator.userAgent || "";
//   return /iPhone|iPad|iPod/i.test(ua);
// }

// export default function HomePage() {
//   const [user, setUser] = useState<User | null>(null);
//   const [checking, setChecking] = useState(true);
//   const [status, setStatus] = useState("");

//   const tournamentStart = useMemo(() => new Date(TOURNAMENT_START_ISO), []);
//   const championship = useMemo(() => new Date(CHAMPIONSHIP_ISO), []);

//   const [mounted, setMounted] = useState(false);
//   const [now, setNow] = useState(0);

//   const [inApp, setInApp] = useState(false);
//   const [copied, setCopied] = useState(false);

//   useEffect(() => {
//     setInApp(isInAppBrowser());
//   }, []);

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (u) => {
//       setUser(u);
//       setChecking(false);
//     });
//     return () => unsub();
//   }, []);

//   useEffect(() => {
//     setMounted(true);
//     setNow(Date.now());
//     const t = setInterval(() => setNow(Date.now()), 1000);
//     return () => clearInterval(t);
//   }, []);

//   const nowMs = mounted ? now : tournamentStart.getTime();

//   const phase: Phase =
//     nowMs < tournamentStart.getTime()
//       ? "prestart"
//       : nowMs < championship.getTime()
//       ? "inprogress"
//       : "complete";

//   const targetDate = phase === "prestart" ? tournamentStart : championship;

//   const diffMs = targetDate.getTime() - nowMs;
//   const safeDiffMs = Math.max(0, diffMs);
//   const countdown = formatCountdown(safeDiffMs);

//   const tournamentStartPhoenixText = useMemo(
//     () => (mounted ? formatPhoenix(tournamentStart) : "Loading…"),
//     [mounted, tournamentStart]
//   );
//   const championshipPhoenixText = useMemo(
//     () => (mounted ? formatPhoenix(championship) : "Loading…"),
//     [mounted, championship]
//   );
//   const targetPhoenixText = useMemo(
//     () => (mounted ? formatPhoenix(targetDate) : "Loading…"),
//     [mounted, targetDate]
//   );

//   const countdownTitle =
//     phase === "prestart"
//       ? "Tournament Tip-off Countdown"
//       : phase === "inprogress"
//       ? "Championship Countdown"
//       : "Championship Status";

//   const countdownClockText = mounted
//     ? `${countdown.days}d ${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`
//     : "Loading countdown…";

//   const countdownLines =
//     phase === "prestart"
//       ? [
//           `Round starts (Phoenix): ${tournamentStartPhoenixText}`,
//           countdownClockText,
//           `Championship (Phoenix): ${championshipPhoenixText}`,
//         ]
//       : phase === "inprogress"
//       ? [`Championship (Phoenix): ${targetPhoenixText}`, countdownClockText]
//       : [`Championship (Phoenix): ${championshipPhoenixText}`, "Tournament complete."];

//   const badge =
//     phase === "inprogress"
//       ? { type: "live" as const, text: "LIVE" }
//       : phase === "complete"
//       ? { type: "done" as const, text: "COMPLETE" }
//       : null;

//   async function doGoogleSignIn() {
//     setStatus("");
//     setCopied(false);

//     // ✅ Prevent confusion: don't even try in in-app browsers
//     if (inApp) {
//       setStatus(
//         "Google sign-in is blocked inside Instagram/Snapchat browsers. Use Email Link Sign-in below or open in Safari/Chrome."
//       );
//       return;
//     }

//     try {
//       const provider = new GoogleAuthProvider();
//       await signInWithPopup(auth, provider);
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

//   async function copyLink() {
//     try {
//       const url = typeof window !== "undefined" ? window.location.href : "https://azroadtoopen.com";
//       await navigator.clipboard.writeText(url);
//       setCopied(true);
//       setStatus("Link copied! Paste it into Safari/Chrome (or text it to a friend).");
//       setTimeout(() => setCopied(false), 1600);
//     } catch {
//       setStatus("Could not copy link on this device/browser. Try selecting the URL and copying manually.");
//     }
//   }

//   const inAppHelpText = useMemo(() => {
//     if (!inApp) return null;
//     const ios = isIOS();
//     return ios
//       ? `You're viewing this inside an in-app browser. Google sign-in is blocked here. Tap the Share icon and choose “Open in Safari”, or use Email Link Sign-in.`
//       : `You're viewing this inside an in-app browser. Google sign-in is blocked here. Tap the ⋮ menu and choose “Open in browser” (Chrome), or use Email Link Sign-in.`;
//   }, [inApp]);

//   return (
//     <main className="wrap">
//       <div className="stage">
//         <div className="bgSpotlights" aria-hidden="true" />
//         <div className="bgVignette" aria-hidden="true" />

//         <header className="hero">
//           <div className="topRow">
//             <div className="brand">
//               <img
//                 className="brandLogo"
//                 src="/brand/azroadtoopen.png"
//                 alt="AZ Road to Open"
//                 onError={(e) => {
//                   (e.currentTarget as HTMLImageElement).style.display = "none";
//                 }}
//               />

//               <div className="brandText">
//                 <div className="title">AZ Road to Open Tournament Competition</div>

//                 <div className="aiaStripe" aria-hidden="true" />

//                 <div className="subtitle">
//                   Predict the matchups between the top teams in Arizona high school basketball,
//                   and who will take home the trophy. Fill out your bracket and compete against
//                   others to see who can have the most accurate bracket.
//                 </div>
//               </div>
//             </div>

//             <div className="ballCol">
//               <SpinningBasketball />
//             </div>
//           </div>

//           {inApp ? (
//             <section className="inAppBanner">
//               <div className="inAppTitle">⚠️ In-app browser detected</div>
//               <div className="inAppText">{inAppHelpText}</div>

//               <div className="inAppActions">
//                 <button className="hbtn hbtnGhost" onClick={copyLink}>
//                   {copied ? "Copied!" : "Copy Link"}
//                 </button>

//                 <a
//                   className="hbtn hbtnGhost"
//                   href="https://azroadtoopen.com"
//                   target="_blank"
//                   rel="noreferrer"
//                   title="Open in a full browser"
//                 >
//                   Open in Browser
//                 </a>

//                 <Link className="hbtn hbtnBlue" href="/signin">
//                   Email Link Sign-in
//                 </Link>
//               </div>
//             </section>
//           ) : null}

//           <section className="panel">
//             {checking ? (
//               <div className="muted">Loading…</div>
//             ) : user ? (
//               <>
//                 <div className="signedIn">
//                   <div className="muted">Signed in as</div>
//                   <div className="who">{user.displayName ?? user.email ?? "User"}</div>
//                   {user.email ? <div className="muted">{user.email}</div> : null}
//                 </div>

//                 <div className="btnRow">
//                   <Link className="hbtn hbtnBlue" href="/my-bracket">
//                     My Bracket
//                   </Link>

//                   <Link className="hbtn hbtnGold" href="/bracket">
//                     Live Bracket
//                   </Link>

//                   <Link className="hbtn hbtnRed" href="/leaderboard">
//                     Leaderboard
//                   </Link>

//                   <button className="hbtn hbtnGhost" onClick={doSignOut}>
//                     Sign out
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div className="signedOut">
//                   <div className="muted">
//                     Sign in to create and submit your bracket. Once submitted, it locks.
//                   </div>
//                 </div>

//                 <div className="btnRow">
//                   {/* ✅ Hide Google sign-in inside in-app browsers */}
//                   {!inApp ? (
//                     <button className="hbtn hbtnBlue" onClick={doGoogleSignIn}>
//                       Sign in with Google
//                     </button>
//                   ) : (
//                     <Link className="hbtn hbtnBlue" href="/signin">
//                       Email Link Sign-in
//                     </Link>
//                   )}

//                   <Link className="hbtn hbtnGold" href="/bracket">
//                     View Live Bracket
//                   </Link>

//                   <Link className="hbtn hbtnRed" href="/leaderboard">
//                     View Leaderboard
//                   </Link>
//                 </div>

//                 {/* Small extra helper below buttons */}
//                 {inApp ? (
//                   <div style={{ marginTop: 10, opacity: 0.75, fontSize: 13, lineHeight: "18px" }}>
//                     Google sign-in is blocked inside this browser. Use <b>Email Link Sign-in</b> or open in Safari/Chrome.
//                   </div>
//                 ) : null}
//               </>
//             )}

//             {status ? <div className="status">{status}</div> : null}
//           </section>

//           <div className="cardsRow">
//             <InfoCard
//               title={countdownTitle}
//               icon="⏳"
//               accent="green"
//               badge={badge}
//               lines={countdownLines}
//             />

//             <InfoCard
//               title="Scoring"
//               icon="🏀"
//               accent="blue"
//               lines={[
//                 "Round 1 = 1 point per correct pick",
//                 "Round 2 = 2 points",
//                 "Round 3 = 4 points",
//                 "Round 4 = 8 points",
//                 "Final = 16 points",
//               ]}
//             />
//           </div>

//           <section className="howToPlay">
//             <div className="howTitle">How to play</div>
//             <ol className="howList">
//               <li>
//                 Go to <b>My Bracket</b> and pick winners (later rounds auto-fill).
//               </li>
//               <li>
//                 Hit <b>Submit Bracket</b> to lock your picks before tip-off:{" "}
//                 <b>{tournamentStartPhoenixText}</b>.
//               </li>
//               <li>
//                 Watch <b>Live Bracket</b> + <b>Leaderboard</b> update as winners are set.
//               </li>
//             </ol>
//           </section>
//         </header>

//         <footer className="disclaimer">
//           Unofficial bracket competition. Not affiliated with AIA. Please DM @charlie.richards13 on IG
//           to report any bugs or issues. Good luck and have fun!
//         </footer>
//       </div>

//       <style jsx>{`
//         .wrap {
//           padding: 28px 18px 110px;
//           color: #fff;
//           display: flex;
//           justify-content: center;
//         }

//         .stage {
//           width: 100%;
//           max-width: 1120px;
//           position: relative;
//           border-radius: 22px;
//           overflow: hidden;
//           border: 1px solid rgba(255, 255, 255, 0.1);
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
//           background: radial-gradient(1200px 700px at 50% 10%, rgba(0,0,0,0), rgba(0,0,0,0.65));
//           pointer-events: none;
//         }

//         .hero {
//           position: relative;
//           padding: 22px;
//         }

//         .topRow {
//           display: grid;
//           grid-template-columns: 1fr auto;
//           gap: 18px;
//           align-items: start;
//         }

//         .brand {
//           display: flex;
//           gap: 14px;
//           align-items: flex-start;
//         }

//         .brandLogo {
//           width: 120px;
//           height: auto;
//           filter: drop-shadow(0 12px 22px rgba(0, 0, 0, 0.45));
//           border-radius: 10px;
//           background: rgba(255,255,255,0.06);
//           border: 1px solid rgba(255,255,255,0.10);
//           padding: 6px;
//         }

//         .brandText .title {
//           font-size: 22px;
//           font-weight: 780;
//           letter-spacing: 0.2px;
//           margin-bottom: 10px;
//         }

//         .aiaStripe {
//           height: 10px;
//           width: min(520px, 100%);
//           border-radius: 999px;
//           margin-bottom: 12px;
//           opacity: 0.95;
//           background: linear-gradient(
//             90deg,
//             #1f6db3 0%,
//             #1f6db3 62%,
//             #f2c230 62%,
//             #f2c230 78%,
//             #d6463a 78%,
//             #d6463a 100%
//           );
//           box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
//           border: 1px solid rgba(255,255,255,0.10);
//         }

//         .brandText .subtitle {
//           font-size: 16px;
//           line-height: 24px;
//           color: rgba(255, 255, 255, 0.80);
//           max-width: 860px;
//         }

//         .ballCol {
//           display: flex;
//           justify-content: flex-end;
//           padding-top: 6px;
//         }

//         .inAppBanner {
//           margin-top: 14px;
//           border: 1px solid rgba(255, 255, 255, 0.12);
//           border-radius: 18px;
//           background: rgba(0, 0, 0, 0.30);
//           padding: 14px 16px;
//           box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
//         }
//         .inAppTitle {
//           font-weight: 900;
//           letter-spacing: 0.2px;
//           margin-bottom: 6px;
//         }
//         .inAppText {
//           opacity: 0.82;
//           font-size: 13px;
//           line-height: 18px;
//         }
//         .inAppActions {
//           margin-top: 10px;
//           display: flex;
//           flex-wrap: wrap;
//           gap: 10px;
//         }

//         .cardsRow {
//           margin-top: 16px;
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 12px;
//         }

//         .panel {
//           margin-top: 16px;
//           border: 1px solid rgba(255, 255, 255, 0.12);
//           border-radius: 18px;
//           background: rgba(255, 255, 255, 0.04);
//           box-shadow: 0 18px 45px rgba(0, 0, 0, 0.35);
//           padding: 18px;
//         }

//         .muted {
//           color: rgba(255, 255, 255, 0.72);
//         }

//         .who {
//           font-size: 18px;
//           font-weight: 780;
//           margin: 2px 0 2px;
//         }

//         .btnRow {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 10px;
//           align-items: center;
//           margin-top: 14px;
//         }

//         :global(.hbtn) {
//           border-radius: 12px;
//           padding: 11px 14px;
//           border: 1px solid rgba(255, 255, 255, 0.28);
//           text-decoration: none;
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           font-weight: 720;
//           cursor: pointer;
//           user-select: none;
//           transition: transform 120ms ease, background 120ms ease, border 120ms ease;
//           color: #fff;
//         }

//         :global(.hbtnBlue) {
//           background: rgba(31, 109, 179, 0.18);
//           border-color: rgba(31, 109, 179, 0.60);
//         }
//         :global(.hbtnGold) {
//           background: rgba(242, 194, 48, 0.14);
//           border-color: rgba(242, 194, 48, 0.60);
//         }
//         :global(.hbtnRed) {
//           background: rgba(214, 70, 58, 0.16);
//           border-color: rgba(214, 70, 58, 0.60);
//         }
//         :global(.hbtnGhost) {
//           background: rgba(0, 0, 0, 0.22);
//           color: rgba(255, 255, 255, 0.92);
//           border-color: rgba(255, 255, 255, 0.28);
//         }

//         :global(.hbtn:hover) {
//           transform: translateY(-1px);
//         }

//         .status {
//           margin-top: 12px;
//           color: rgba(183, 255, 183, 0.95);
//           font-size: 13px;
//           line-height: 18px;
//         }

//         .howToPlay {
//           margin-top: 14px;
//           border: 1px solid rgba(255, 255, 255, 0.10);
//           border-radius: 18px;
//           background: rgba(0, 0, 0, 0.18);
//           padding: 14px 16px;
//         }

//         .howTitle {
//           font-weight: 800;
//           letter-spacing: 0.2px;
//           margin-bottom: 8px;
//           color: rgba(255, 255, 255, 0.92);
//         }

//         .howList {
//           margin: 0;
//           padding-left: 18px;
//           color: rgba(255, 255, 255, 0.72);
//           line-height: 20px;
//           font-size: 13px;
//         }

//         .howList li {
//           margin: 6px 0;
//         }

//         .disclaimer {
//           margin-top: 14px;
//           padding: 12px 16px 18px;
//           text-align: center;
//           font-size: 12px;
//           line-height: 18px;
//           color: rgba(255, 255, 255, 0.55);
//           border-top: 1px solid rgba(255, 255, 255, 0.10);
//         }

//         @media (max-width: 920px) {
//           .topRow {
//             grid-template-columns: 1fr;
//           }
//           .ballCol {
//             justify-content: flex-start;
//           }
//           .cardsRow {
//             grid-template-columns: 1fr;
//           }
//           .brand {
//             flex-direction: column;
//           }
//           .brandLogo {
//             width: 160px;
//           }
//         }
//       `}</style>
//     </main>
//   );
// }

// function InfoCard({
//   title,
//   icon,
//   lines,
//   accent,
//   badge,
// }: {
//   title: string;
//   icon: string;
//   lines: string[];
//   accent: "green" | "blue";
//   badge?: { type: "live" | "done"; text: string } | null;
// }) {
//   const accentBorder =
//     accent === "green" ? "rgba(120,255,170,0.30)" : "rgba(120,180,255,0.30)";
//   const accentBg =
//     accent === "green" ? "rgba(120,255,170,0.07)" : "rgba(120,180,255,0.07)";

//   return (
//     <div className="icard">
//       <div className="ihead">
//         <div className="ititle">
//           <span className="icon">{icon}</span> {title}
//         </div>

//         {badge?.type === "live" ? (
//           <div className="pillLive" title="Tournament has started">
//             <span className="dot" /> {badge.text}
//           </div>
//         ) : badge?.type === "done" ? (
//           <div className="pillDone" title="Tournament complete">
//             {badge.text}
//           </div>
//         ) : null}
//       </div>

//       <div className="ibody">
//         {lines.map((l, idx) => (
//           <div key={idx} className="iline">
//             {l}
//           </div>
//         ))}
//       </div>

//       <style jsx>{`
//         .icard {
//           border: 1px solid ${accentBorder};
//           background: ${accentBg};
//           border-radius: 18px;
//           padding: 14px;
//           box-shadow: 0 14px 35px rgba(0, 0, 0, 0.30);
//         }
//         .ihead {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 10px;
//           gap: 10px;
//         }
//         .ititle {
//           font-weight: 780;
//           letter-spacing: 0.2px;
//           display: flex;
//           align-items: center;
//           gap: 6px;
//         }
//         .ibody {
//           color: rgba(255, 255, 255, 0.80);
//           line-height: 20px;
//           font-size: 14px;
//         }
//         .iline {
//           margin-top: 6px;
//         }
//         .iline:first-child {
//           margin-top: 0;
//         }

//         .pillLive {
//           display: inline-flex;
//           align-items: center;
//           gap: 8px;
//           padding: 6px 10px;
//           border-radius: 999px;
//           border: 1px solid rgba(255, 120, 120, 0.45);
//           background: rgba(255, 90, 90, 0.10);
//           color: rgba(255, 230, 230, 0.95);
//           font-weight: 900;
//           letter-spacing: 0.4px;
//           font-size: 12px;
//           white-space: nowrap;
//         }
//         .dot {
//           width: 8px;
//           height: 8px;
//           border-radius: 999px;
//           background: rgba(255, 90, 90, 0.95);
//           box-shadow: 0 0 14px rgba(255, 90, 90, 0.75);
//           animation: pulse 1.1s ease-in-out infinite;
//         }

//         .pillDone {
//           padding: 6px 10px;
//           border-radius: 999px;
//           border: 1px solid rgba(180, 210, 255, 0.35);
//           background: rgba(120, 180, 255, 0.10);
//           color: rgba(220, 235, 255, 0.95);
//           font-weight: 900;
//           letter-spacing: 0.4px;
//           font-size: 12px;
//           white-space: nowrap;
//         }

//         @keyframes pulse {
//           0%,
//           100% {
//             transform: scale(1);
//             opacity: 1;
//           }
//           50% {
//             transform: scale(1.35);
//             opacity: 0.75;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// function SpinningBasketball() {
//   return (
//     <div className="ballWrap" aria-hidden="true">
//       <div className="ball">
//         <svg viewBox="0 0 100 100" className="ballSvg">
//           <defs>
//             <radialGradient id="g" cx="30%" cy="30%" r="70%">
//               <stop offset="0%" stopColor="#ffb36b" stopOpacity="1" />
//               <stop offset="55%" stopColor="#e67e22" stopOpacity="1" />
//               <stop offset="100%" stopColor="#b85a14" stopOpacity="1" />
//             </radialGradient>
//           </defs>
//           <circle cx="50" cy="50" r="48" fill="url(#g)" />
//           <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="2" />
//           <path d="M50 2 v96" stroke="rgba(0,0,0,0.55)" strokeWidth="3" />
//           <path d="M2 50 h96" stroke="rgba(0,0,0,0.55)" strokeWidth="3" />
//           <path d="M18 10 C40 30, 40 70, 18 90" fill="none" stroke="rgba(0,0,0,0.55)" strokeWidth="3" />
//           <path d="M82 10 C60 30, 60 70, 82 90" fill="none" stroke="rgba(0,0,0,0.55)" strokeWidth="3" />
//         </svg>
//       </div>

//       <style jsx>{`
//         .ballWrap {
//           width: 120px;
//           height: 120px;
//           display: grid;
//           place-items: center;
//           filter: drop-shadow(0 14px 24px rgba(0, 0, 0, 0.45));
//         }
//         .ball {
//           width: 106px;
//           height: 106px;
//           border-radius: 999px;
//           animation: spin 2.8s linear infinite, floaty 3.2s ease-in-out infinite;
//           transform-origin: 50% 50%;
//         }
//         .ballSvg {
//           width: 100%;
//           height: 100%;
//           border-radius: 999px;
//           display: block;
//         }
//         @keyframes spin {
//           from {
//             transform: rotate(0deg);
//           }
//           to {
//             transform: rotate(360deg);
//           }
//         }
//         @keyframes floaty {
//           0%,
//           100% {
//             translate: 0 0;
//           }
//           50% {
//             translate: 0 -6px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// function formatCountdown(ms: number) {
//   const totalSeconds = Math.floor(ms / 1000);
//   const days = Math.floor(totalSeconds / 86400);
//   const hours = Math.floor((totalSeconds % 86400) / 3600);
//   const minutes = Math.floor((totalSeconds % 3600) / 60);
//   const seconds = totalSeconds % 60;
//   return { days, hours, minutes, seconds };
// }

// function formatPhoenix(d: Date) {
//   try {
//     return new Intl.DateTimeFormat("en-US", {
//       timeZone: "America/Phoenix",
//       dateStyle: "full",
//       timeStyle: "short",
//     }).format(d);
//   } catch {
//     return d.toLocaleString();
//   }
// }







// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import { auth } from "@/lib/firebase";
// import {
//   GoogleAuthProvider,
//   onAuthStateChanged,
//   signInWithPopup,
//   signOut,
//   User,
// } from "firebase/auth";

// // Phoenix is UTC-7 year-round (no DST)
// const TOURNAMENT_START_ISO = "2026-02-18T19:00:00-07:00";
// const CHAMPIONSHIP_ISO = "2026-03-07T19:00:00-07:00";

// type Phase = "prestart" | "inprogress" | "complete";

// function isInAppBrowser() {
//   if (typeof navigator === "undefined") return false;
//   const ua = navigator.userAgent || "";
//   return (
//     /Snapchat/i.test(ua) ||
//     /Instagram/i.test(ua) ||
//     /FBAN|FBAV/i.test(ua) || // Facebook / Messenger
//     /TikTok/i.test(ua)
//   );
// }

// function isIOS() {
//   if (typeof navigator === "undefined") return false;
//   const ua = navigator.userAgent || "";
//   return /iPhone|iPad|iPod/i.test(ua);
// }

// function isAndroid() {
//   if (typeof navigator === "undefined") return false;
//   const ua = navigator.userAgent || "";
//   return /Android/i.test(ua);
// }

// export default function HomePage() {
//   const [user, setUser] = useState<User | null>(null);
//   const [checking, setChecking] = useState(true);
//   const [status, setStatus] = useState("");

//   const tournamentStart = useMemo(() => new Date(TOURNAMENT_START_ISO), []);
//   const championship = useMemo(() => new Date(CHAMPIONSHIP_ISO), []);

//   const [mounted, setMounted] = useState(false);
//   const [now, setNow] = useState(0);

//   const [inApp, setInApp] = useState(false);
//   const [copied, setCopied] = useState(false);

//   useEffect(() => {
//     setInApp(isInAppBrowser());
//   }, []);

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (u) => {
//       setUser(u);
//       setChecking(false);
//     });
//     return () => unsub();
//   }, []);

//   useEffect(() => {
//     setMounted(true);
//     setNow(Date.now());
//     const t = setInterval(() => setNow(Date.now()), 1000);
//     return () => clearInterval(t);
//   }, []);

//   const nowMs = mounted ? now : tournamentStart.getTime();

//   const phase: Phase =
//     nowMs < tournamentStart.getTime()
//       ? "prestart"
//       : nowMs < championship.getTime()
//       ? "inprogress"
//       : "complete";

//   const targetDate = phase === "prestart" ? tournamentStart : championship;

//   const diffMs = targetDate.getTime() - nowMs;
//   const safeDiffMs = Math.max(0, diffMs);
//   const countdown = formatCountdown(safeDiffMs);

//   const tournamentStartPhoenixText = useMemo(
//     () => (mounted ? formatPhoenix(tournamentStart) : "Loading…"),
//     [mounted, tournamentStart]
//   );
//   const championshipPhoenixText = useMemo(
//     () => (mounted ? formatPhoenix(championship) : "Loading…"),
//     [mounted, championship]
//   );
//   const targetPhoenixText = useMemo(
//     () => (mounted ? formatPhoenix(targetDate) : "Loading…"),
//     [mounted, targetDate]
//   );

//   const countdownTitle =
//     phase === "prestart"
//       ? "Tournament Tip-off Countdown"
//       : phase === "inprogress"
//       ? "Championship Countdown"
//       : "Championship Status";

//   const countdownClockText = mounted
//     ? `${countdown.days}d ${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`
//     : "Loading countdown…";

//   const countdownLines =
//     phase === "prestart"
//       ? [
//           `Round starts (Phoenix): ${tournamentStartPhoenixText}`,
//           countdownClockText,
//           `Championship (Phoenix): ${championshipPhoenixText}`,
//         ]
//       : phase === "inprogress"
//       ? [`Championship (Phoenix): ${targetPhoenixText}`, countdownClockText]
//       : [`Championship (Phoenix): ${championshipPhoenixText}`, "Tournament complete."];

//   const badge =
//     phase === "inprogress"
//       ? { type: "live" as const, text: "LIVE" }
//       : phase === "complete"
//       ? { type: "done" as const, text: "COMPLETE" }
//       : null;

//   async function doGoogleSignIn() {
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

//   async function copyLink() {
//     try {
//       const url =
//         typeof window !== "undefined" ? window.location.href : "https://azroadtoopen.com";
//       await navigator.clipboard.writeText(url);
//       setCopied(true);
//       setStatus("Link copied!");
//       setTimeout(() => setCopied(false), 1600);
//     } catch {
//       setStatus("Could not copy automatically here. Try selecting the URL and copying manually.");
//     }
//   }

//   /**
//    * Best-effort open in default browser:
//    * - Android: intent:// works well (often opens default browser / chooser)
//    * - iOS: cannot reliably force Safari from in-app webviews; we try window.open + _blank
//    */
//   function openInBrowser() {
//     const url = "https://azroadtoopen.com";

//     try {
//       if (typeof window === "undefined") return;

//       if (isAndroid()) {
//         // Open external browser/chooser (works in many Android in-app browsers)
//         const intentUrl = `intent://azroadtoopen.com/#Intent;scheme=https;end`;
//         window.location.href = intentUrl;
//         return;
//       }

//       // iOS + others: best-effort
//       const w = window.open(url, "_blank", "noopener,noreferrer");
//       if (!w) {
//         // Popup blocked—try direct navigation anyway (may stay in in-app browser)
//         window.location.href = url;
//       }
//     } catch {
//       // fallback
//       if (typeof window !== "undefined") window.location.href = url;
//     }
//   }

//   const inAppHelpText = useMemo(() => {
//     if (!inApp) return null;

//     const ios = isIOS();
//     return ios
//       ? `You're in an in-app browser (Snap/IG). Sign-in is disabled here. Tap “Open in Browser”. If it doesn’t open with one tap, press-and-hold the button/link and choose “Open in Safari”, or use the Share icon → “Open in Safari”.`
//       : `You're in an in-app browser. Sign-in is disabled here. Tap “Open in Browser” to continue in your default browser.`;
//   }, [inApp]);

//   return (
//     <main className="wrap">
//       <div className="stage">
//         <div className="bgSpotlights" aria-hidden="true" />
//         <div className="bgVignette" aria-hidden="true" />

//         <header className="hero">
//           <div className="topRow">
//             <div className="brand">
//               <img
//                 className="brandLogo"
//                 src="/brand/azroadtoopen.png"
//                 alt="AZ Road to Open"
//                 onError={(e) => {
//                   (e.currentTarget as HTMLImageElement).style.display = "none";
//                 }}
//               />

//               <div className="brandText">
//                 <div className="title">AZ Road to Open Tournament Competition</div>

//                 <div className="aiaStripe" aria-hidden="true" />

//                 <div className="subtitle">
//                   Predict the matchups between the top teams in Arizona high school basketball, and
//                   who will take home the trophy. Fill out your bracket and compete against others
//                   to see who can have the most accurate bracket.
//                 </div>
//               </div>
//             </div>

//             <div className="ballCol">
//               <SpinningBasketball />
//             </div>
//           </div>

//           {/* ✅ In-app browser: remove ALL sign-in options */}
//           {inApp ? (
//             <section className="inAppBanner">
//               <div className="inAppTitle">⚠️ In-app browser detected</div>
//               <div className="inAppText">{inAppHelpText}</div>

//               <div className="inAppActions">
//                 <button className="hbtn hbtnBlue" onClick={openInBrowser}>
//                   Open in Browser
//                 </button>

//                 <button className="hbtn hbtnGhost" onClick={copyLink}>
//                   {copied ? "Copied!" : "Copy Link"}
//                 </button>

//                 {/* Helpful fallback link (some apps only show “Open in Safari” on long-press) */}
//                 <a
//                   className="hbtn hbtnGhost"
//                   href="https://azroadtoopen.com"
//                   target="_blank"
//                   rel="noreferrer"
//                   title="Tip: if tap doesn’t work, press-and-hold and choose Open in Safari/Browser"
//                 >
//                   (Fallback) Open Link
//                 </a>
//               </div>

//               <div className="inAppSmall">
//                 Sign-in is disabled in this browser to avoid errors. Please open in Safari/Chrome
//                 to submit a bracket.
//               </div>

//               <div className="btnRow" style={{ marginTop: 12 }}>
//                 <Link className="hbtn hbtnGold" href="/bracket">
//                   View Live Bracket
//                 </Link>
//                 <Link className="hbtn hbtnRed" href="/leaderboard">
//                   View Leaderboard
//                 </Link>
//               </div>
//             </section>
//           ) : (
//             <section className="panel">
//               {checking ? (
//                 <div className="muted">Loading…</div>
//               ) : user ? (
//                 <>
//                   <div className="signedIn">
//                     <div className="muted">Signed in as</div>
//                     <div className="who">{user.displayName ?? user.email ?? "User"}</div>
//                     {user.email ? <div className="muted">{user.email}</div> : null}
//                   </div>

//                   <div className="btnRow">
//                     <Link className="hbtn hbtnBlue" href="/my-bracket">
//                       My Bracket
//                     </Link>

//                     <Link className="hbtn hbtnGold" href="/bracket">
//                       Live Bracket
//                     </Link>

//                     <Link className="hbtn hbtnRed" href="/leaderboard">
//                       Leaderboard
//                     </Link>

//                     <button className="hbtn hbtnGhost" onClick={doSignOut}>
//                       Sign out
//                     </button>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <div className="signedOut">
//                     <div className="muted">
//                       Sign in to create and submit your bracket. Once submitted, it locks.
//                     </div>
//                   </div>

//                   <div className="btnRow">
//                     <button className="hbtn hbtnBlue" onClick={doGoogleSignIn}>
//                       Sign in with Google
//                     </button>

//                     <Link className="hbtn hbtnGold" href="/bracket">
//                       View Live Bracket
//                     </Link>

//                     <Link className="hbtn hbtnRed" href="/leaderboard">
//                       View Leaderboard
//                     </Link>
//                   </div>
//                 </>
//               )}

//               {status ? <div className="status">{status}</div> : null}
//             </section>
//           )}

//           <div className="cardsRow">
//             <InfoCard
//               title={countdownTitle}
//               icon="⏳"
//               accent="green"
//               badge={badge}
//               lines={countdownLines}
//             />

//             <InfoCard
//               title="Scoring"
//               icon="🏀"
//               accent="blue"
//               lines={[
//                 "Round 1 = 1 point per correct pick",
//                 "Round 2 = 2 points",
//                 "Round 3 = 4 points",
//                 "Round 4 = 8 points",
//                 "Final = 16 points",
//               ]}
//             />
//           </div>

//           <section className="howToPlay">
//             <div className="howTitle">How to play</div>
//             <ol className="howList">
//               <li>
//                 Go to <b>My Bracket</b> and pick winners (later rounds auto-fill).
//               </li>
//               <li>
//                 Hit <b>Submit Bracket</b> to lock your picks before tip-off:{" "}
//                 <b>{tournamentStartPhoenixText}</b>.
//               </li>
//               <li>
//                 Watch <b>Live Bracket</b> + <b>Leaderboard</b> update as winners are set.
//               </li>
//             </ol>
//           </section>
//         </header>

//         <footer className="disclaimer">
//           Unofficial bracket competition. Not affiliated with AIA. Please DM @charlie.richards13 on
//           IG to report any bugs or issues. Good luck and have fun!
//         </footer>
//       </div>

//       <style jsx>{`
//         .wrap {
//           padding: 28px 18px 110px;
//           color: #fff;
//           display: flex;
//           justify-content: center;
//         }

//         .stage {
//           width: 100%;
//           max-width: 1120px;
//           position: relative;
//           border-radius: 22px;
//           overflow: hidden;
//           border: 1px solid rgba(255, 255, 255, 0.1);
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
//           background: radial-gradient(1200px 700px at 50% 10%, rgba(0,0,0,0), rgba(0,0,0,0.65));
//           pointer-events: none;
//         }

//         .hero {
//           position: relative;
//           padding: 22px;
//         }

//         .topRow {
//           display: grid;
//           grid-template-columns: 1fr auto;
//           gap: 18px;
//           align-items: start;
//         }

//         .brand {
//           display: flex;
//           gap: 14px;
//           align-items: flex-start;
//         }

//         .brandLogo {
//           width: 120px;
//           height: auto;
//           filter: drop-shadow(0 12px 22px rgba(0, 0, 0, 0.45));
//           border-radius: 10px;
//           background: rgba(255,255,255,0.06);
//           border: 1px solid rgba(255,255,255,0.10);
//           padding: 6px;
//         }

//         .brandText .title {
//           font-size: 22px;
//           font-weight: 780;
//           letter-spacing: 0.2px;
//           margin-bottom: 10px;
//         }

//         .aiaStripe {
//           height: 10px;
//           width: min(520px, 100%);
//           border-radius: 999px;
//           margin-bottom: 12px;
//           opacity: 0.95;
//           background: linear-gradient(
//             90deg,
//             #1f6db3 0%,
//             #1f6db3 62%,
//             #f2c230 62%,
//             #f2c230 78%,
//             #d6463a 78%,
//             #d6463a 100%
//           );
//           box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
//           border: 1px solid rgba(255,255,255,0.10);
//         }

//         .brandText .subtitle {
//           font-size: 16px;
//           line-height: 24px;
//           color: rgba(255, 255, 255, 0.80);
//           max-width: 860px;
//         }

//         .ballCol {
//           display: flex;
//           justify-content: flex-end;
//           padding-top: 6px;
//         }

//         .cardsRow {
//           margin-top: 16px;
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 12px;
//         }

//         .panel {
//           margin-top: 16px;
//           border: 1px solid rgba(255, 255, 255, 0.12);
//           border-radius: 18px;
//           background: rgba(255, 255, 255, 0.04);
//           box-shadow: 0 18px 45px rgba(0, 0, 0, 0.35);
//           padding: 18px;
//         }

//         .muted {
//           color: rgba(255, 255, 255, 0.72);
//         }

//         .who {
//           font-size: 18px;
//           font-weight: 780;
//           margin: 2px 0 2px;
//         }

//         .btnRow {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 10px;
//           align-items: center;
//           margin-top: 14px;
//         }

//         /* ✅ In-app banner */
//         .inAppBanner {
//           margin-top: 16px;
//           border: 1px solid rgba(255, 255, 255, 0.12);
//           border-radius: 18px;
//           background: rgba(0, 0, 0, 0.30);
//           padding: 16px;
//           box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
//         }
//         .inAppTitle {
//           font-weight: 900;
//           letter-spacing: 0.2px;
//           margin-bottom: 6px;
//         }
//         .inAppText {
//           opacity: 0.86;
//           font-size: 13px;
//           line-height: 18px;
//         }
//         .inAppActions {
//           margin-top: 12px;
//           display: flex;
//           flex-wrap: wrap;
//           gap: 10px;
//         }
//         .inAppSmall {
//           margin-top: 10px;
//           opacity: 0.72;
//           font-size: 12px;
//           line-height: 16px;
//         }

//         :global(.hbtn) {
//           border-radius: 12px;
//           padding: 11px 14px;
//           border: 1px solid rgba(255, 255, 255, 0.28);
//           text-decoration: none;
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           font-weight: 720;
//           cursor: pointer;
//           user-select: none;
//           transition: transform 120ms ease, background 120ms ease, border 120ms ease;
//           color: #fff;
//           background: transparent;
//         }

//         :global(.hbtnBlue) {
//           background: rgba(31, 109, 179, 0.18);
//           border-color: rgba(31, 109, 179, 0.60);
//         }
//         :global(.hbtnGold) {
//           background: rgba(242, 194, 48, 0.14);
//           border-color: rgba(242, 194, 48, 0.60);
//         }
//         :global(.hbtnRed) {
//           background: rgba(214, 70, 58, 0.16);
//           border-color: rgba(214, 70, 58, 0.60);
//         }
//         :global(.hbtnGhost) {
//           background: rgba(0, 0, 0, 0.22);
//           color: rgba(255, 255, 255, 0.92);
//           border-color: rgba(255, 255, 255, 0.28);
//         }

//         :global(.hbtn:hover) {
//           transform: translateY(-1px);
//         }

//         .status {
//           margin-top: 12px;
//           color: rgba(183, 255, 183, 0.95);
//           font-size: 13px;
//           line-height: 18px;
//         }

//         .howToPlay {
//           margin-top: 14px;
//           border: 1px solid rgba(255, 255, 255, 0.10);
//           border-radius: 18px;
//           background: rgba(0, 0, 0, 0.18);
//           padding: 14px 16px;
//         }

//         .howTitle {
//           font-weight: 800;
//           letter-spacing: 0.2px;
//           margin-bottom: 8px;
//           color: rgba(255, 255, 255, 0.92);
//         }

//         .howList {
//           margin: 0;
//           padding-left: 18px;
//           color: rgba(255, 255, 255, 0.72);
//           line-height: 20px;
//           font-size: 13px;
//         }

//         .howList li {
//           margin: 6px 0;
//         }

//         .disclaimer {
//           margin-top: 14px;
//           padding: 12px 16px 18px;
//           text-align: center;
//           font-size: 12px;
//           line-height: 18px;
//           color: rgba(255, 255, 255, 0.55);
//           border-top: 1px solid rgba(255, 255, 255, 0.10);
//         }

//         @media (max-width: 920px) {
//           .topRow {
//             grid-template-columns: 1fr;
//           }
//           .ballCol {
//             justify-content: flex-start;
//           }
//           .cardsRow {
//             grid-template-columns: 1fr;
//           }
//           .brand {
//             flex-direction: column;
//           }
//           .brandLogo {
//             width: 160px;
//           }
//         }
//       `}</style>
//     </main>
//   );
// }

// function InfoCard({
//   title,
//   icon,
//   lines,
//   accent,
//   badge,
// }: {
//   title: string;
//   icon: string;
//   lines: string[];
//   accent: "green" | "blue";
//   badge?: { type: "live" | "done"; text: string } | null;
// }) {
//   const accentBorder =
//     accent === "green" ? "rgba(120,255,170,0.30)" : "rgba(120,180,255,0.30)";
//   const accentBg =
//     accent === "green" ? "rgba(120,255,170,0.07)" : "rgba(120,180,255,0.07)";

//   return (
//     <div className="icard">
//       <div className="ihead">
//         <div className="ititle">
//           <span className="icon">{icon}</span> {title}
//         </div>

//         {badge?.type === "live" ? (
//           <div className="pillLive" title="Tournament has started">
//             <span className="dot" /> {badge.text}
//           </div>
//         ) : badge?.type === "done" ? (
//           <div className="pillDone" title="Tournament complete">
//             {badge.text}
//           </div>
//         ) : null}
//       </div>

//       <div className="ibody">
//         {lines.map((l, idx) => (
//           <div key={idx} className="iline">
//             {l}
//           </div>
//         ))}
//       </div>

//       <style jsx>{`
//         .icard {
//           border: 1px solid ${accentBorder};
//           background: ${accentBg};
//           border-radius: 18px;
//           padding: 14px;
//           box-shadow: 0 14px 35px rgba(0, 0, 0, 0.30);
//         }
//         .ihead {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 10px;
//           gap: 10px;
//         }
//         .ititle {
//           font-weight: 780;
//           letter-spacing: 0.2px;
//           display: flex;
//           align-items: center;
//           gap: 6px;
//         }
//         .ibody {
//           color: rgba(255, 255, 255, 0.80);
//           line-height: 20px;
//           font-size: 14px;
//         }
//         .iline {
//           margin-top: 6px;
//         }
//         .iline:first-child {
//           margin-top: 0;
//         }

//         .pillLive {
//           display: inline-flex;
//           align-items: center;
//           gap: 8px;
//           padding: 6px 10px;
//           border-radius: 999px;
//           border: 1px solid rgba(255, 120, 120, 0.45);
//           background: rgba(255, 90, 90, 0.10);
//           color: rgba(255, 230, 230, 0.95);
//           font-weight: 900;
//           letter-spacing: 0.4px;
//           font-size: 12px;
//           white-space: nowrap;
//         }
//         .dot {
//           width: 8px;
//           height: 8px;
//           border-radius: 999px;
//           background: rgba(255, 90, 90, 0.95);
//           box-shadow: 0 0 14px rgba(255, 90, 90, 0.75);
//           animation: pulse 1.1s ease-in-out infinite;
//         }

//         .pillDone {
//           padding: 6px 10px;
//           border-radius: 999px;
//           border: 1px solid rgba(180, 210, 255, 0.35);
//           background: rgba(120, 180, 255, 0.10);
//           color: rgba(220, 235, 255, 0.95);
//           font-weight: 900;
//           letter-spacing: 0.4px;
//           font-size: 12px;
//           white-space: nowrap;
//         }

//         @keyframes pulse {
//           0%,
//           100% {
//             transform: scale(1);
//             opacity: 1;
//           }
//           50% {
//             transform: scale(1.35);
//             opacity: 0.75;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// function SpinningBasketball() {
//   return (
//     <div className="ballWrap" aria-hidden="true">
//       <div className="ball">
//         <svg viewBox="0 0 100 100" className="ballSvg">
//           <defs>
//             <radialGradient id="g" cx="30%" cy="30%" r="70%">
//               <stop offset="0%" stopColor="#ffb36b" stopOpacity="1" />
//               <stop offset="55%" stopColor="#e67e22" stopOpacity="1" />
//               <stop offset="100%" stopColor="#b85a14" stopOpacity="1" />
//             </radialGradient>
//           </defs>
//           <circle cx="50" cy="50" r="48" fill="url(#g)" />
//           <circle
//             cx="50"
//             cy="50"
//             r="48"
//             fill="none"
//             stroke="rgba(0,0,0,0.35)"
//             strokeWidth="2"
//           />
//           <path d="M50 2 v96" stroke="rgba(0,0,0,0.55)" strokeWidth="3" />
//           <path d="M2 50 h96" stroke="rgba(0,0,0,0.55)" strokeWidth="3" />
//           <path
//             d="M18 10 C40 30, 40 70, 18 90"
//             fill="none"
//             stroke="rgba(0,0,0,0.55)"
//             strokeWidth="3"
//           />
//           <path
//             d="M82 10 C60 30, 60 70, 82 90"
//             fill="none"
//             stroke="rgba(0,0,0,0.55)"
//             strokeWidth="3"
//           />
//         </svg>
//       </div>

//       <style jsx>{`
//         .ballWrap {
//           width: 120px;
//           height: 120px;
//           display: grid;
//           place-items: center;
//           filter: drop-shadow(0 14px 24px rgba(0, 0, 0, 0.45));
//         }
//         .ball {
//           width: 106px;
//           height: 106px;
//           border-radius: 999px;
//           animation: spin 2.8s linear infinite, floaty 3.2s ease-in-out infinite;
//           transform-origin: 50% 50%;
//         }
//         .ballSvg {
//           width: 100%;
//           height: 100%;
//           border-radius: 999px;
//           display: block;
//         }
//         @keyframes spin {
//           from {
//             transform: rotate(0deg);
//           }
//           to {
//             transform: rotate(360deg);
//           }
//         }
//         @keyframes floaty {
//           0%,
//           100% {
//             translate: 0 0;
//           }
//           50% {
//             translate: 0 -6px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// function formatCountdown(ms: number) {
//   const totalSeconds = Math.floor(ms / 1000);
//   const days = Math.floor(totalSeconds / 86400);
//   const hours = Math.floor((totalSeconds % 86400) / 3600);
//   const minutes = Math.floor((totalSeconds % 3600) / 60);
//   const seconds = totalSeconds % 60;
//   return { days, hours, minutes, seconds };
// }

// function formatPhoenix(d: Date) {
//   try {
//     return new Intl.DateTimeFormat("en-US", {
//       timeZone: "America/Phoenix",
//       dateStyle: "full",
//       timeStyle: "short",
//     }).format(d);
//   } catch {
//     return d.toLocaleString();
//   }
// }





// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import { auth } from "@/lib/firebase";
// import {
//   GoogleAuthProvider,
//   onAuthStateChanged,
//   signInWithPopup,
//   signOut,
//   User,
// } from "firebase/auth";

// // Phoenix is UTC-7 year-round (no DST)
// const TOURNAMENT_START_ISO = "2026-02-18T19:00:00-07:00";
// const CHAMPIONSHIP_ISO = "2026-03-07T19:00:00-07:00";

// type Phase = "prestart" | "inprogress" | "complete";

// function isInAppBrowser() {
//   if (typeof navigator === "undefined") return false;
//   const ua = navigator.userAgent || "";
//   return (
//     /Snapchat/i.test(ua) ||
//     /Instagram/i.test(ua) ||
//     /FBAN|FBAV/i.test(ua) || // Facebook
//     /TikTok/i.test(ua)
//   );
// }

// function isIOS() {
//   if (typeof navigator === "undefined") return false;
//   const ua = navigator.userAgent || "";
//   return /iPhone|iPad|iPod/i.test(ua);
// }

// export default function HomePage() {
//   const [user, setUser] = useState<User | null>(null);
//   const [checking, setChecking] = useState(true);
//   const [status, setStatus] = useState("");

//   const tournamentStart = useMemo(() => new Date(TOURNAMENT_START_ISO), []);
//   const championship = useMemo(() => new Date(CHAMPIONSHIP_ISO), []);

//   const [mounted, setMounted] = useState(false);
//   const [now, setNow] = useState(0);

//   const [inApp, setInApp] = useState(false);
//   const [copied, setCopied] = useState(false);

//   useEffect(() => {
//     setInApp(isInAppBrowser());
//   }, []);

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (u) => {
//       setUser(u);
//       setChecking(false);
//     });
//     return () => unsub();
//   }, []);

//   useEffect(() => {
//     setMounted(true);
//     setNow(Date.now());
//     const t = setInterval(() => setNow(Date.now()), 1000);
//     return () => clearInterval(t);
//   }, []);

//   const nowMs = mounted ? now : tournamentStart.getTime();

//   const phase: Phase =
//     nowMs < tournamentStart.getTime()
//       ? "prestart"
//       : nowMs < championship.getTime()
//       ? "inprogress"
//       : "complete";

//   const targetDate = phase === "prestart" ? tournamentStart : championship;

//   const diffMs = targetDate.getTime() - nowMs;
//   const safeDiffMs = Math.max(0, diffMs);
//   const countdown = formatCountdown(safeDiffMs);

//   const tournamentStartPhoenixText = useMemo(
//     () => (mounted ? formatPhoenix(tournamentStart) : "Loading…"),
//     [mounted, tournamentStart]
//   );
//   const championshipPhoenixText = useMemo(
//     () => (mounted ? formatPhoenix(championship) : "Loading…"),
//     [mounted, championship]
//   );
//   const targetPhoenixText = useMemo(
//     () => (mounted ? formatPhoenix(targetDate) : "Loading…"),
//     [mounted, targetDate]
//   );

//   const countdownTitle =
//     phase === "prestart"
//       ? "Tournament Tip-off Countdown"
//       : phase === "inprogress"
//       ? "Championship Countdown"
//       : "Championship Status";

//   const countdownClockText = mounted
//     ? `${countdown.days}d ${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`
//     : "Loading countdown…";

//   const countdownLines =
//     phase === "prestart"
//       ? [
//           `Round starts (Phoenix): ${tournamentStartPhoenixText}`,
//           countdownClockText,
//           `Championship (Phoenix): ${championshipPhoenixText}`,
//         ]
//       : phase === "inprogress"
//       ? [`Championship (Phoenix): ${targetPhoenixText}`, countdownClockText]
//       : [`Championship (Phoenix): ${championshipPhoenixText}`, "Tournament complete."];

//   const badge =
//     phase === "inprogress"
//       ? { type: "live" as const, text: "LIVE" }
//       : phase === "complete"
//       ? { type: "done" as const, text: "COMPLETE" }
//       : null;

//   async function doGoogleSignIn() {
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

//   async function copyLink() {
//     try {
//       const url =
//         typeof window !== "undefined" ? window.location.href : "https://azroadtoopen.com";
//       await navigator.clipboard.writeText(url);
//       setCopied(true);
//       setStatus("Link copied! Paste it into Safari/Chrome.");
//       setTimeout(() => setCopied(false), 1600);
//     } catch {
//       setStatus("Could not copy link here. Try selecting the URL and copying manually.");
//     }
//   }

//   const inAppHelpText = useMemo(() => {
//     if (!inApp) return null;
//     const ios = isIOS();
//     return ios
//       ? `You're in an in-app browser (Snap/IG). Sign-in is disabled here. Tap “Open in Browser”. If it doesn’t open with one tap, press-and-hold the button/link and choose “Open in Safari”, or use the Share icon → “Open in Safari”.`
//       : `You're in an in-app browser (Snap/IG). Sign-in is disabled here. Tap “Open in Browser”. If it doesn’t open with one tap, press-and-hold the button/link and choose “Open in browser” (Chrome).`;
//   }, [inApp]);

//   return (
//     <main className="wrap">
//       <div className="stage">
//         <div className="bgSpotlights" aria-hidden="true" />
//         <div className="bgVignette" aria-hidden="true" />

//         <header className="hero">
//           <div className="topRow">
//             <div className="brand">
//               <img
//                 className="brandLogo"
//                 src="/brand/azroadtoopen.png"
//                 alt="AZ Road to Open"
//                 onError={(e) => {
//                   (e.currentTarget as HTMLImageElement).style.display = "none";
//                 }}
//               />

//               <div className="brandText">
//                 <div className="title">AZ Road to Open Tournament Competition</div>

//                 <div className="aiaStripe" aria-hidden="true" />

//                 <div className="subtitle">
//                   Predict the matchups between the top teams in Arizona high school basketball,
//                   and who will take home the trophy. Fill out your bracket and compete against
//                   others to see who can have the most accurate bracket.
//                 </div>
//               </div>
//             </div>

//             <div className="ballCol">
//               <SpinningBasketball />
//             </div>
//           </div>

//           {/* ✅ In-app browser warning + ONE open button */}
//           {inApp ? (
//             <section className="inAppBanner">
//               <div className="inAppTitle">⚠️ In-app browser detected</div>
//               <div className="inAppText">{inAppHelpText}</div>

//               <div className="inAppActions">
//                 <a
//                   className="hbtn hbtnBlue"
//                   href="https://azroadtoopen.com"
//                   target="_blank"
//                   rel="noreferrer"
//                   title="Open in a full browser"
//                 >
//                   Open in Browser
//                 </a>

//                 <button className="hbtn hbtnGhost" onClick={copyLink}>
//                   {copied ? "Copied!" : "Copy Link"}
//                 </button>
//               </div>
//             </section>
//           ) : null}

//           <section className="panel">
//             {checking ? (
//               <div className="muted">Loading…</div>
//             ) : user ? (
//               <>
//                 <div className="signedIn">
//                   <div className="muted">Signed in as</div>
//                   <div className="who">{user.displayName ?? user.email ?? "User"}</div>
//                   {user.email ? <div className="muted">{user.email}</div> : null}
//                 </div>

//                 <div className="btnRow">
//                   <Link className="hbtn hbtnBlue" href="/my-bracket">
//                     My Bracket
//                   </Link>

//                   <Link className="hbtn hbtnGold" href="/bracket">
//                     Live Bracket
//                   </Link>

//                   <Link className="hbtn hbtnRed" href="/leaderboard">
//                     Leaderboard
//                   </Link>

//                   <button className="hbtn hbtnGhost" onClick={doSignOut}>
//                     Sign out
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div className="signedOut">
//                   <div className="muted">
//                     Sign in to create and submit your bracket. Once submitted, it locks.
//                   </div>
//                 </div>

//                 <div className="btnRow">
//                   {/* ✅ If in-app: hide sign-in buttons entirely to avoid confusion */}
//                   {inApp ? null : (
//                     <button className="hbtn hbtnBlue" onClick={doGoogleSignIn}>
//                       Sign in with Google
//                     </button>
//                   )}

//                   <Link className="hbtn hbtnGold" href="/bracket">
//                     View Live Bracket
//                   </Link>

//                   <Link className="hbtn hbtnRed" href="/leaderboard">
//                     View Leaderboard
//                   </Link>
//                 </div>

//                 {inApp ? (
//                   <div className="muted" style={{ marginTop: 10, fontSize: 13, lineHeight: "18px" }}>
//                     Sign-in is disabled inside this browser to avoid errors. Please use <b>Open in Browser</b>.
//                   </div>
//                 ) : null}
//               </>
//             )}

//             {status ? <div className="status">{status}</div> : null}
//           </section>

//           <div className="cardsRow">
//             <InfoCard
//               title={countdownTitle}
//               icon="⏳"
//               accent="green"
//               badge={badge}
//               lines={countdownLines}
//             />

//             <InfoCard
//               title="Scoring"
//               icon="🏀"
//               accent="blue"
//               lines={[
//                 "Round 1 = 1 point per correct pick",
//                 "Round 2 = 2 points",
//                 "Round 3 = 4 points",
//                 "Round 4 = 8 points",
//                 "Final = 16 points",
//               ]}
//             />
//           </div>

//           <section className="howToPlay">
//             <div className="howTitle">How to play</div>
//             <ol className="howList">
//               <li>
//                 Go to <b>My Bracket</b> and pick winners (later rounds auto-fill).
//               </li>
//               <li>
//                 Hit <b>Submit Bracket</b> to lock your picks before tip-off:{" "}
//                 <b>{tournamentStartPhoenixText}</b>.
//               </li>
//               <li>
//                 Watch <b>Live Bracket</b> + <b>Leaderboard</b> update as winners are set.
//               </li>
//             </ol>
//           </section>
//         </header>

//         <footer className="disclaimer">
//           Unofficial bracket competition. Not affiliated with AIA. Please DM @charlie.richards13 on IG
//           to report any bugs or issues. Good luck and have fun!
//         </footer>
//       </div>

//       <style jsx>{`
//         .wrap {
//           padding: 28px 18px 110px;
//           color: #fff;
//           display: flex;
//           justify-content: center;
//         }

//         .stage {
//           width: 100%;
//           max-width: 1120px;
//           position: relative;
//           border-radius: 22px;
//           overflow: hidden;
//           border: 1px solid rgba(255, 255, 255, 0.1);
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
//           background: radial-gradient(1200px 700px at 50% 10%, rgba(0,0,0,0), rgba(0,0,0,0.65));
//           pointer-events: none;
//         }

//         .hero {
//           position: relative;
//           padding: 22px;
//         }

//         .topRow {
//           display: grid;
//           grid-template-columns: 1fr auto;
//           gap: 18px;
//           align-items: start;
//         }

//         .brand {
//           display: flex;
//           gap: 14px;
//           align-items: flex-start;
//         }

//         .brandLogo {
//           width: 120px;
//           height: auto;
//           filter: drop-shadow(0 12px 22px rgba(0, 0, 0, 0.45));
//           border-radius: 10px;
//           background: rgba(255,255,255,0.06);
//           border: 1px solid rgba(255,255,255,0.10);
//           padding: 6px;
//         }

//         .brandText .title {
//           font-size: 22px;
//           font-weight: 780;
//           letter-spacing: 0.2px;
//           margin-bottom: 10px;
//         }

//         .aiaStripe {
//           height: 10px;
//           width: min(520px, 100%);
//           border-radius: 999px;
//           margin-bottom: 12px;
//           opacity: 0.95;
//           background: linear-gradient(
//             90deg,
//             #1f6db3 0%,
//             #1f6db3 62%,
//             #f2c230 62%,
//             #f2c230 78%,
//             #d6463a 78%,
//             #d6463a 100%
//           );
//           box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
//           border: 1px solid rgba(255,255,255,0.10);
//         }

//         .brandText .subtitle {
//           font-size: 16px;
//           line-height: 24px;
//           color: rgba(255, 255, 255, 0.80);
//           max-width: 860px;
//         }

//         .ballCol {
//           display: flex;
//           justify-content: flex-end;
//           padding-top: 6px;
//         }

//         .inAppBanner {
//           margin-top: 14px;
//           border: 1px solid rgba(255, 255, 255, 0.12);
//           border-radius: 18px;
//           background: rgba(0, 0, 0, 0.30);
//           padding: 14px 16px;
//           box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
//         }
//         .inAppTitle {
//           font-weight: 900;
//           letter-spacing: 0.2px;
//           margin-bottom: 6px;
//         }
//         .inAppText {
//           opacity: 0.82;
//           font-size: 13px;
//           line-height: 18px;
//         }
//         .inAppActions {
//           margin-top: 10px;
//           display: flex;
//           flex-wrap: wrap;
//           gap: 10px;
//         }

//         .cardsRow {
//           margin-top: 16px;
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 12px;
//         }

//         .panel {
//           margin-top: 16px;
//           border: 1px solid rgba(255, 255, 255, 0.12);
//           border-radius: 18px;
//           background: rgba(255, 255, 255, 0.04);
//           box-shadow: 0 18px 45px rgba(0, 0, 0, 0.35);
//           padding: 18px;
//         }

//         .muted {
//           color: rgba(255, 255, 255, 0.72);
//         }

//         .who {
//           font-size: 18px;
//           font-weight: 780;
//           margin: 2px 0 2px;
//         }

//         .btnRow {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 10px;
//           align-items: center;
//           margin-top: 14px;
//         }

//         :global(.hbtn) {
//           border-radius: 12px;
//           padding: 11px 14px;
//           border: 1px solid rgba(255, 255, 255, 0.28);
//           text-decoration: none;
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           font-weight: 720;
//           cursor: pointer;
//           user-select: none;
//           transition: transform 120ms ease, background 120ms ease, border 120ms ease;
//           color: #fff;
//         }

//         :global(.hbtnBlue) {
//           background: rgba(31, 109, 179, 0.18);
//           border-color: rgba(31, 109, 179, 0.60);
//         }
//         :global(.hbtnGold) {
//           background: rgba(242, 194, 48, 0.14);
//           border-color: rgba(242, 194, 48, 0.60);
//         }
//         :global(.hbtnRed) {
//           background: rgba(214, 70, 58, 0.16);
//           border-color: rgba(214, 70, 58, 0.60);
//         }
//         :global(.hbtnGhost) {
//           background: rgba(0, 0, 0, 0.22);
//           color: rgba(255, 255, 255, 0.92);
//           border-color: rgba(255, 255, 255, 0.28);
//         }

//         :global(.hbtn:hover) {
//           transform: translateY(-1px);
//         }

//         .status {
//           margin-top: 12px;
//           color: rgba(183, 255, 183, 0.95);
//           font-size: 13px;
//           line-height: 18px;
//         }

//         .howToPlay {
//           margin-top: 14px;
//           border: 1px solid rgba(255, 255, 255, 0.10);
//           border-radius: 18px;
//           background: rgba(0, 0, 0, 0.18);
//           padding: 14px 16px;
//         }

//         .howTitle {
//           font-weight: 800;
//           letter-spacing: 0.2px;
//           margin-bottom: 8px;
//           color: rgba(255, 255, 255, 0.92);
//         }

//         .howList {
//           margin: 0;
//           padding-left: 18px;
//           color: rgba(255, 255, 255, 0.72);
//           line-height: 20px;
//           font-size: 13px;
//         }

//         .howList li {
//           margin: 6px 0;
//         }

//         .disclaimer {
//           margin-top: 14px;
//           padding: 12px 16px 18px;
//           text-align: center;
//           font-size: 12px;
//           line-height: 18px;
//           color: rgba(255, 255, 255, 0.55);
//           border-top: 1px solid rgba(255, 255, 255, 0.10);
//         }

//         @media (max-width: 920px) {
//           .topRow {
//             grid-template-columns: 1fr;
//           }
//           .ballCol {
//             justify-content: flex-start;
//           }
//           .cardsRow {
//             grid-template-columns: 1fr;
//           }
//           .brand {
//             flex-direction: column;
//           }
//           .brandLogo {
//             width: 160px;
//           }
//         }
//       `}</style>
//     </main>
//   );
// }

// function InfoCard({
//   title,
//   icon,
//   lines,
//   accent,
//   badge,
// }: {
//   title: string;
//   icon: string;
//   lines: string[];
//   accent: "green" | "blue";
//   badge?: { type: "live" | "done"; text: string } | null;
// }) {
//   const accentBorder =
//     accent === "green" ? "rgba(120,255,170,0.30)" : "rgba(120,180,255,0.30)";
//   const accentBg =
//     accent === "green" ? "rgba(120,255,170,0.07)" : "rgba(120,180,255,0.07)";

//   return (
//     <div className="icard">
//       <div className="ihead">
//         <div className="ititle">
//           <span className="icon">{icon}</span> {title}
//         </div>

//         {badge?.type === "live" ? (
//           <div className="pillLive" title="Tournament has started">
//             <span className="dot" /> {badge.text}
//           </div>
//         ) : badge?.type === "done" ? (
//           <div className="pillDone" title="Tournament complete">
//             {badge.text}
//           </div>
//         ) : null}
//       </div>

//       <div className="ibody">
//         {lines.map((l, idx) => (
//           <div key={idx} className="iline">
//             {l}
//           </div>
//         ))}
//       </div>

//       <style jsx>{`
//         .icard {
//           border: 1px solid ${accentBorder};
//           background: ${accentBg};
//           border-radius: 18px;
//           padding: 14px;
//           box-shadow: 0 14px 35px rgba(0, 0, 0, 0.30);
//         }
//         .ihead {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 10px;
//           gap: 10px;
//         }
//         .ititle {
//           font-weight: 780;
//           letter-spacing: 0.2px;
//           display: flex;
//           align-items: center;
//           gap: 6px;
//         }
//         .ibody {
//           color: rgba(255, 255, 255, 0.80);
//           line-height: 20px;
//           font-size: 14px;
//         }
//         .iline {
//           margin-top: 6px;
//         }
//         .iline:first-child {
//           margin-top: 0;
//         }

//         .pillLive {
//           display: inline-flex;
//           align-items: center;
//           gap: 8px;
//           padding: 6px 10px;
//           border-radius: 999px;
//           border: 1px solid rgba(255, 120, 120, 0.45);
//           background: rgba(255, 90, 90, 0.10);
//           color: rgba(255, 230, 230, 0.95);
//           font-weight: 900;
//           letter-spacing: 0.4px;
//           font-size: 12px;
//           white-space: nowrap;
//         }
//         .dot {
//           width: 8px;
//           height: 8px;
//           border-radius: 999px;
//           background: rgba(255, 90, 90, 0.95);
//           box-shadow: 0 0 14px rgba(255, 90, 90, 0.75);
//           animation: pulse 1.1s ease-in-out infinite;
//         }

//         .pillDone {
//           padding: 6px 10px;
//           border-radius: 999px;
//           border: 1px solid rgba(180, 210, 255, 0.35);
//           background: rgba(120, 180, 255, 0.10);
//           color: rgba(220, 235, 255, 0.95);
//           font-weight: 900;
//           letter-spacing: 0.4px;
//           font-size: 12px;
//           white-space: nowrap;
//         }

//         @keyframes pulse {
//           0%,
//           100% {
//             transform: scale(1);
//             opacity: 1;
//           }
//           50% {
//             transform: scale(1.35);
//             opacity: 0.75;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// function SpinningBasketball() {
//   return (
//     <div className="ballWrap" aria-hidden="true">
//       <div className="ball">
//         <svg viewBox="0 0 100 100" className="ballSvg">
//           <defs>
//             <radialGradient id="g" cx="30%" cy="30%" r="70%">
//               <stop offset="0%" stopColor="#ffb36b" stopOpacity="1" />
//               <stop offset="55%" stopColor="#e67e22" stopOpacity="1" />
//               <stop offset="100%" stopColor="#b85a14" stopOpacity="1" />
//             </radialGradient>
//           </defs>
//           <circle cx="50" cy="50" r="48" fill="url(#g)" />
//           <circle
//             cx="50"
//             cy="50"
//             r="48"
//             fill="none"
//             stroke="rgba(0,0,0,0.35)"
//             strokeWidth="2"
//           />
//           <path d="M50 2 v96" stroke="rgba(0,0,0,0.55)" strokeWidth="3" />
//           <path d="M2 50 h96" stroke="rgba(0,0,0,0.55)" strokeWidth="3" />
//           <path
//             d="M18 10 C40 30, 40 70, 18 90"
//             fill="none"
//             stroke="rgba(0,0,0,0.55)"
//             strokeWidth="3"
//           />
//           <path
//             d="M82 10 C60 30, 60 70, 82 90"
//             fill="none"
//             stroke="rgba(0,0,0,0.55)"
//             strokeWidth="3"
//           />
//         </svg>
//       </div>

//       <style jsx>{`
//         .ballWrap {
//           width: 120px;
//           height: 120px;
//           display: grid;
//           place-items: center;
//           filter: drop-shadow(0 14px 24px rgba(0, 0, 0, 0.45));
//         }
//         .ball {
//           width: 106px;
//           height: 106px;
//           border-radius: 999px;
//           animation: spin 2.8s linear infinite, floaty 3.2s ease-in-out infinite;
//           transform-origin: 50% 50%;
//         }
//         .ballSvg {
//           width: 100%;
//           height: 100%;
//           border-radius: 999px;
//           display: block;
//         }
//         @keyframes spin {
//           from {
//             transform: rotate(0deg);
//           }
//           to {
//             transform: rotate(360deg);
//           }
//         }
//         @keyframes floaty {
//           0%,
//           100% {
//             translate: 0 0;
//           }
//           50% {
//             translate: 0 -6px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// function formatCountdown(ms: number) {
//   const totalSeconds = Math.floor(ms / 1000);
//   const days = Math.floor(totalSeconds / 86400);
//   const hours = Math.floor((totalSeconds % 86400) / 3600);
//   const minutes = Math.floor((totalSeconds % 3600) / 60);
//   const seconds = totalSeconds % 60;
//   return { days, hours, minutes, seconds };
// }

// function formatPhoenix(d: Date) {
//   try {
//     return new Intl.DateTimeFormat("en-US", {
//       timeZone: "America/Phoenix",
//       dateStyle: "full",
//       timeStyle: "short",
//     }).format(d);
//   } catch {
//     return d.toLocaleString();
//   }
// }






// "use client";

// import { useEffect, useMemo, useState } from "react";
// import type { ReactNode } from "react";
// import Link from "next/link";
// import { auth } from "@/lib/firebase";
// import {
//   GoogleAuthProvider,
//   onAuthStateChanged,
//   signInWithPopup,
//   signOut,
//   User,
// } from "firebase/auth";

// // Phoenix is UTC-7 year-round (no DST)
// const TOURNAMENT_START_ISO = "2026-02-18T19:00:00-07:00";
// const NEXT_GAMES_ISO = "2026-02-20T19:00:00-07:00";
// const CHAMPIONSHIP_ISO = "2026-03-07T19:00:00-07:00";

// // How long we consider a “game block” live after its start time.
// // (You can tweak this any time.)
// // How long to stay live for
// const GAME_BLOCK_DURATION_HOURS = 2;

// type GameBlock = {
//   label: string;
//   startISO: string;
// };

// function isInAppBrowser() {
//   if (typeof navigator === "undefined") return false;
//   const ua = navigator.userAgent || "";
//   return (
//     /Snapchat/i.test(ua) ||
//     /Instagram/i.test(ua) ||
//     /FBAN|FBAV/i.test(ua) || // Facebook
//     /TikTok/i.test(ua)
//   );
// }

// function isIOS() {
//   if (typeof navigator === "undefined") return false;
//   const ua = navigator.userAgent || "";
//   return /iPhone|iPad|iPod/i.test(ua);
// }

// export default function HomePage() {
//   const [user, setUser] = useState<User | null>(null);
//   const [checking, setChecking] = useState(true);
//   const [status, setStatus] = useState("");

//   const tournamentStart = useMemo(() => new Date(TOURNAMENT_START_ISO), []);
//   const nextGames = useMemo(() => new Date(NEXT_GAMES_ISO), []);
//   const championship = useMemo(() => new Date(CHAMPIONSHIP_ISO), []);

//   const [mounted, setMounted] = useState(false);
//   const [now, setNow] = useState(0);

//   const [inApp, setInApp] = useState(false);
//   const [copied, setCopied] = useState(false);

//   useEffect(() => {
//     setInApp(isInAppBrowser());
//   }, []);

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (u) => {
//       setUser(u);
//       setChecking(false);
//     });
//     return () => unsub();
//   }, []);

//   useEffect(() => {
//     setMounted(true);
//     setNow(Date.now());
//     const t = setInterval(() => setNow(Date.now()), 1000);
//     return () => clearInterval(t);
//   }, []);

//   const nowMs = mounted ? now : Date.now();

//   // ------------------------------------------------------------
//   // Text helpers
//   // ------------------------------------------------------------
//   const tournamentStartPhoenixText = useMemo(
//     () => (mounted ? formatPhoenix(tournamentStart) : "Loading…"),
//     [mounted, tournamentStart]
//   );

//   const nextGamesPhoenixText = useMemo(
//     () => (mounted ? formatPhoenix(nextGames) : "Loading…"),
//     [mounted, nextGames]
//   );

//   const championshipPhoenixText = useMemo(
//     () => (mounted ? formatPhoenix(championship) : "Loading…"),
//     [mounted, championship]
//   );

//   // ------------------------------------------------------------
//   // Card 1: Championship Countdown (always shown)
//   // ------------------------------------------------------------
//   const champDiffMs = championship.getTime() - nowMs;
//   const champSafeMs = Math.max(0, champDiffMs);
//   const champCountdown = formatCountdown(champSafeMs);

//   const champClockText = mounted
//     ? `${champCountdown.days}d ${champCountdown.hours}h ${champCountdown.minutes}m ${champCountdown.seconds}s`
//     : "Loading countdown…";

//   const championshipPassed = nowMs >= championship.getTime();

//   const championshipLines = championshipPassed
//     ? [`Championship (Phoenix): ${championshipPhoenixText}`, "Tournament complete."]
//     : [`Championship (Phoenix): ${championshipPhoenixText}`, champClockText];

//   const championshipBadge = championshipPassed
//     ? ({ type: "done", text: "COMPLETE" } as const)
//     : null;

//   // ------------------------------------------------------------
//   // Card 2 (new): Next Games Countdown / LIVE based on game blocks
//   // ------------------------------------------------------------
//   const gameBlocks: GameBlock[] = useMemo(
//     () => [
//       { label: "Tournament Tip-off", startISO: TOURNAMENT_START_ISO },
//       { label: "Next Games", startISO: NEXT_GAMES_ISO },
//     ],
//     []
//   );

//   const computedBlocks = useMemo(() => {
//     const durMs = GAME_BLOCK_DURATION_HOURS * 60 * 60 * 1000;
//     return gameBlocks
//       .map((b) => {
//         const start = new Date(b.startISO);
//         const end = new Date(start.getTime() + durMs);
//         return { ...b, start, end };
//       })
//       .sort((a, b) => a.start.getTime() - b.start.getTime());
//   }, [gameBlocks]);

//   const currentBlock = computedBlocks.find(
//     (b) => nowMs >= b.start.getTime() && nowMs < b.end.getTime()
//   );

//   const nextBlock = computedBlocks.find((b) => b.start.getTime() > nowMs);

//   const nextGamesTitle = currentBlock
//     ? "Games Status"
//     : nextBlock?.label === "Next Games"
//     ? "Next Games Countdown"
//     : "Upcoming Games";

//   const nextGamesBadge = currentBlock ? ({ type: "live", text: "LIVE" } as const) : null;

//   const nextGamesLines = (() => {
//     if (currentBlock) {
//       return [
//         "Games are LIVE right now.",
//         `Started (Phoenix): ${formatPhoenix(currentBlock.start)}`,
//         `Approx. end (Phoenix): ${formatPhoenix(currentBlock.end)}`,
//       ];
//     }

//     if (nextBlock) {
//       const diffMs = nextBlock.start.getTime() - nowMs;
//       const safeMs = Math.max(0, diffMs);
//       const cd = formatCountdown(safeMs);

//       const clock = mounted
//         ? `${cd.days}d ${cd.hours}h ${cd.minutes}m ${cd.seconds}s`
//         : "Loading countdown…";

//       if (nextBlock.label === "Next Games") {
//         return [`Next games (Phoenix): ${nextGamesPhoenixText}`, clock];
//       }

//       // fallback for any other blocks you add later
//       return [`${nextBlock.label} (Phoenix): ${formatPhoenix(nextBlock.start)}`, clock];
//     }

//     return ["No upcoming games scheduled."];
//   })();

//   // ------------------------------------------------------------
//   // Auth actions
//   // ------------------------------------------------------------
//   async function doGoogleSignIn() {
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

//   async function copyLink() {
//     try {
//       const url =
//         typeof window !== "undefined" ? window.location.href : "https://azroadtoopen.com";
//       await navigator.clipboard.writeText(url);
//       setCopied(true);
//       setStatus("Link copied! Paste it into Safari/Chrome.");
//       setTimeout(() => setCopied(false), 1600);
//     } catch {
//       setStatus("Could not copy link here. Try selecting the URL and copying manually.");
//     }
//   }

//   const inAppHelpText = useMemo(() => {
//     if (!inApp) return null;
//     const ios = isIOS();
//     return ios
//       ? `You're in an in-app browser (Snap/IG). Sign-in is disabled here. Tap “Open in Browser”. If it doesn’t open with one tap, press-and-hold the button/link and choose “Open in Safari”, or use the Share icon → “Open in Safari”.`
//       : `You're in an in-app browser (Snap/IG). Sign-in is disabled here. Tap “Open in Browser”. If it doesn’t open with one tap, press-and-hold the button/link and choose “Open in browser” (Chrome).`;
//   }, [inApp]);

//   return (
//     <main className="wrap">
//       <div className="stage">
//         <div className="bgSpotlights" aria-hidden="true" />
//         <div className="bgVignette" aria-hidden="true" />

//         <header className="hero">
//           <div className="topRow">
//             <div className="brand">
//               <img
//                 className="brandLogo"
//                 src="/brand/azroadtoopen.png"
//                 alt="AZ Road to Open"
//                 onError={(e) => {
//                   (e.currentTarget as HTMLImageElement).style.display = "none";
//                 }}
//               />

//               <div className="brandText">
//                 <div className="title">AZ Road to Open Tournament Competition</div>

//                 <div className="aiaStripe" aria-hidden="true" />

//                 <div className="subtitle">
//                   Predict the matchups between the top teams in Arizona high school basketball,
//                   and who will take home the trophy. Fill out your bracket and compete against
//                   others to see who can have the most accurate bracket.
//                 </div>
//               </div>
//             </div>

//             <div className="ballCol">
//               <SpinningBasketball />
//             </div>
//           </div>

//           {/* ✅ In-app browser warning + ONE open button */}
//           {inApp ? (
//             <section className="inAppBanner">
//               <div className="inAppTitle">⚠️ In-app browser detected</div>
//               <div className="inAppText">{inAppHelpText}</div>

//               <div className="inAppActions">
//                 <a
//                   className="hbtn hbtnBlue"
//                   href="https://azroadtoopen.com"
//                   target="_blank"
//                   rel="noreferrer"
//                   title="Open in a full browser"
//                 >
//                   Open in Browser
//                 </a>

//                 <button className="hbtn hbtnGhost" onClick={copyLink}>
//                   {copied ? "Copied!" : "Copy Link"}
//                 </button>
//               </div>
//             </section>
//           ) : null}

//           <section className="panel">
//             {checking ? (
//               <div className="muted">Loading…</div>
//             ) : user ? (
//               <>
//                 <div className="signedIn">
//                   <div className="muted">Signed in as</div>
//                   <div className="who">{user.displayName ?? user.email ?? "User"}</div>
//                   {user.email ? <div className="muted">{user.email}</div> : null}
//                 </div>

//                 <div className="btnRow">
//                   <Link className="hbtn hbtnBlue" href="/my-bracket">
//                     My Bracket
//                   </Link>

//                   <Link className="hbtn hbtnGold" href="/bracket">
//                     Live Bracket
//                   </Link>

//                   <Link className="hbtn hbtnRed" href="/leaderboard">
//                     Leaderboard
//                   </Link>

//                   <button className="hbtn hbtnGhost" onClick={doSignOut}>
//                     Sign out
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div className="signedOut">
//                   <div className="muted">
//                     Sign in to create and submit your bracket. Once submitted, it locks.
//                   </div>
//                 </div>

//                 <div className="btnRow">
//                   {/* ✅ If in-app: hide sign-in buttons entirely to avoid confusion */}
//                   {inApp ? null : (
//                     <button className="hbtn hbtnBlue" onClick={doGoogleSignIn}>
//                       Sign in with Google
//                     </button>
//                   )}

//                   <Link className="hbtn hbtnGold" href="/bracket">
//                     View Live Bracket
//                   </Link>

//                   <Link className="hbtn hbtnRed" href="/leaderboard">
//                     View Leaderboard
//                   </Link>
//                 </div>

//                 {inApp ? (
//                   <div className="muted" style={{ marginTop: 10, fontSize: 13, lineHeight: "18px" }}>
//                     Sign-in is disabled inside this browser to avoid errors. Please use{" "}
//                     <b>Open in Browser</b>.
//                   </div>
//                 ) : null}
//               </>
//             )}

//             {status ? <div className="status">{status}</div> : null}
//           </section>

//           {/* Row 1: Championship + Scoring */}
//           <div className="cardsRow">
//             <InfoCard
//               title="Championship Countdown"
//               icon="⏳"
//               accent="green"
//               badge={championshipBadge}
//               lines={championshipLines}
//             />

//             <InfoCard
//               title="Scoring"
//               icon="🏀"
//               accent="blue"
//               lines={[
//                 "Round 1 = 1 point per correct pick",
//                 "Round 2 = 2 points",
//                 "Round 3 = 4 points",
//                 "Round 4 = 8 points",
//                 "Final = 16 points",
//               ]}
//             />
//           </div>

//           {/* Row 2 (new): Next Games + News button box */}
//           <div className="cardsRow2">
//             <InfoCard
//               title={nextGamesTitle}
//               icon="🕒"
//               accent="green"
//               badge={nextGamesBadge}
//               lines={nextGamesLines}
//             />

//             <InfoCard
//               title="News"
//               icon="📰"
//               accent="blue"
//               lines={[
//                 "Updates, photos, announcements, and important changes will be posted here.",
//               ]}
//               action={
//                 <Link className="hbtn hbtnBlue" href="/news">
//                   News
//                 </Link>
//               }
//             />
//           </div>

//           <section className="howToPlay">
//             <div className="howTitle">How to play</div>
//             <ol className="howList">
//               <li>
//                 Go to <b>My Bracket</b> and pick winners (later rounds auto-fill).
//               </li>
//               <li>
//                 Hit <b>Submit Bracket</b> to lock your picks before tip-off:{" "}
//                 <b>{tournamentStartPhoenixText}</b>.
//               </li>
//               <li>
//                 Watch <b>Live Bracket</b> + <b>Leaderboard</b> update as winners are set.
//               </li>
//             </ol>
//           </section>
//         </header>

//         <footer className="disclaimer">
//           Unofficial bracket competition. Not affiliated with AIA. Please DM @charlie.richards13 on IG
//           to report any bugs or issues. Good luck and have fun!
//         </footer>
//       </div>

//       <style jsx>{`
//         .wrap {
//           padding: 28px 18px 110px;
//           color: #fff;
//           display: flex;
//           justify-content: center;
//         }

//         .stage {
//           width: 100%;
//           max-width: 1120px;
//           position: relative;
//           border-radius: 22px;
//           overflow: hidden;
//           border: 1px solid rgba(255, 255, 255, 0.1);
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
//           background: radial-gradient(1200px 700px at 50% 10%, rgba(0,0,0,0), rgba(0,0,0,0.65));
//           pointer-events: none;
//         }

//         .hero {
//           position: relative;
//           padding: 22px;
//         }

//         .topRow {
//           display: grid;
//           grid-template-columns: 1fr auto;
//           gap: 18px;
//           align-items: start;
//         }

//         .brand {
//           display: flex;
//           gap: 14px;
//           align-items: flex-start;
//         }

//         .brandLogo {
//           width: 120px;
//           height: auto;
//           filter: drop-shadow(0 12px 22px rgba(0, 0, 0, 0.45));
//           border-radius: 10px;
//           background: rgba(255,255,255,0.06);
//           border: 1px solid rgba(255,255,255,0.10);
//           padding: 6px;
//         }

//         .brandText .title {
//           font-size: 22px;
//           font-weight: 780;
//           letter-spacing: 0.2px;
//           margin-bottom: 10px;
//         }

//         .aiaStripe {
//           height: 10px;
//           width: min(520px, 100%);
//           border-radius: 999px;
//           margin-bottom: 12px;
//           opacity: 0.95;
//           background: linear-gradient(
//             90deg,
//             #1f6db3 0%,
//             #1f6db3 62%,
//             #f2c230 62%,
//             #f2c230 78%,
//             #d6463a 78%,
//             #d6463a 100%
//           );
//           box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
//           border: 1px solid rgba(255,255,255,0.10);
//         }

//         .brandText .subtitle {
//           font-size: 16px;
//           line-height: 24px;
//           color: rgba(255, 255, 255, 0.80);
//           max-width: 860px;
//         }

//         .ballCol {
//           display: flex;
//           justify-content: flex-end;
//           padding-top: 6px;
//         }

//         .inAppBanner {
//           margin-top: 14px;
//           border: 1px solid rgba(255, 255, 255, 0.12);
//           border-radius: 18px;
//           background: rgba(0, 0, 0, 0.30);
//           padding: 14px 16px;
//           box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
//         }
//         .inAppTitle {
//           font-weight: 900;
//           letter-spacing: 0.2px;
//           margin-bottom: 6px;
//         }
//         .inAppText {
//           opacity: 0.82;
//           font-size: 13px;
//           line-height: 18px;
//         }
//         .inAppActions {
//           margin-top: 10px;
//           display: flex;
//           flex-wrap: wrap;
//           gap: 10px;
//         }

//         .cardsRow {
//           margin-top: 16px;
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 12px;
//         }

//         .cardsRow2 {
//           margin-top: 12px;
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 12px;
//         }

//         .panel {
//           margin-top: 16px;
//           border: 1px solid rgba(255, 255, 255, 0.12);
//           border-radius: 18px;
//           background: rgba(255, 255, 255, 0.04);
//           box-shadow: 0 18px 45px rgba(0, 0, 0, 0.35);
//           padding: 18px;
//         }

//         .muted {
//           color: rgba(255, 255, 255, 0.72);
//         }

//         .who {
//           font-size: 18px;
//           font-weight: 780;
//           margin: 2px 0 2px;
//         }

//         .btnRow {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 10px;
//           align-items: center;
//           margin-top: 14px;
//         }

//         :global(.hbtn) {
//           border-radius: 12px;
//           padding: 11px 14px;
//           border: 1px solid rgba(255, 255, 255, 0.28);
//           text-decoration: none;
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           font-weight: 720;
//           cursor: pointer;
//           user-select: none;
//           transition: transform 120ms ease, background 120ms ease, border 120ms ease;
//           color: #fff;
//         }

//         :global(.hbtnBlue) {
//           background: rgba(31, 109, 179, 0.18);
//           border-color: rgba(31, 109, 179, 0.60);
//         }
//         :global(.hbtnGold) {
//           background: rgba(242, 194, 48, 0.14);
//           border-color: rgba(242, 194, 48, 0.60);
//         }
//         :global(.hbtnRed) {
//           background: rgba(214, 70, 58, 0.16);
//           border-color: rgba(214, 70, 58, 0.60);
//         }
//         :global(.hbtnGhost) {
//           background: rgba(0, 0, 0, 0.22);
//           color: rgba(255, 255, 255, 0.92);
//           border-color: rgba(255, 255, 255, 0.28);
//         }

//         :global(.hbtn:hover) {
//           transform: translateY(-1px);
//         }

//         .status {
//           margin-top: 12px;
//           color: rgba(183, 255, 183, 0.95);
//           font-size: 13px;
//           line-height: 18px;
//         }

//         .howToPlay {
//           margin-top: 14px;
//           border: 1px solid rgba(255, 255, 255, 0.10);
//           border-radius: 18px;
//           background: rgba(0, 0, 0, 0.18);
//           padding: 14px 16px;
//         }

//         .howTitle {
//           font-weight: 800;
//           letter-spacing: 0.2px;
//           margin-bottom: 8px;
//           color: rgba(255, 255, 255, 0.92);
//         }

//         .howList {
//           margin: 0;
//           padding-left: 18px;
//           color: rgba(255, 255, 255, 0.72);
//           line-height: 20px;
//           font-size: 13px;
//         }

//         .howList li {
//           margin: 6px 0;
//         }

//         .disclaimer {
//           margin-top: 14px;
//           padding: 12px 16px 18px;
//           text-align: center;
//           font-size: 12px;
//           line-height: 18px;
//           color: rgba(255, 255, 255, 0.55);
//           border-top: 1px solid rgba(255, 255, 255, 0.10);
//         }

//         @media (max-width: 920px) {
//           .topRow {
//             grid-template-columns: 1fr;
//           }
//           .ballCol {
//             justify-content: flex-start;
//           }
//           .cardsRow {
//             grid-template-columns: 1fr;
//           }
//           .cardsRow2 {
//             grid-template-columns: 1fr;
//           }
//           .brand {
//             flex-direction: column;
//           }
//           .brandLogo {
//             width: 160px;
//           }
//         }
//       `}</style>
//     </main>
//   );
// }

// function InfoCard({
//   title,
//   icon,
//   lines,
//   accent,
//   badge,
//   action,
// }: {
//   title: string;
//   icon: string;
//   lines: string[];
//   accent: "green" | "blue";
//   badge?: { type: "live" | "done"; text: string } | null;
//   action?: ReactNode;
// }) {
//   const accentBorder =
//     accent === "green" ? "rgba(120,255,170,0.30)" : "rgba(120,180,255,0.30)";
//   const accentBg =
//     accent === "green" ? "rgba(120,255,170,0.07)" : "rgba(120,180,255,0.07)";

//   return (
//     <div className="icard">
//       <div className="ihead">
//         <div className="ititle">
//           <span className="icon">{icon}</span> {title}
//         </div>

//         {badge?.type === "live" ? (
//           <div className="pillLive" title="Games are live">
//             <span className="dot" /> {badge.text}
//           </div>
//         ) : badge?.type === "done" ? (
//           <div className="pillDone" title="Tournament complete">
//             {badge.text}
//           </div>
//         ) : null}
//       </div>

//       <div className="ibody">
//         {lines.map((l, idx) => (
//           <div key={idx} className="iline">
//             {l}
//           </div>
//         ))}

//         {action ? <div className="iaction">{action}</div> : null}
//       </div>

//       <style jsx>{`
//         .icard {
//           border: 1px solid ${accentBorder};
//           background: ${accentBg};
//           border-radius: 18px;
//           padding: 14px;
//           box-shadow: 0 14px 35px rgba(0, 0, 0, 0.30);
//         }
//         .ihead {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 10px;
//           gap: 10px;
//         }
//         .ititle {
//           font-weight: 780;
//           letter-spacing: 0.2px;
//           display: flex;
//           align-items: center;
//           gap: 6px;
//         }
//         .ibody {
//           color: rgba(255, 255, 255, 0.80);
//           line-height: 20px;
//           font-size: 14px;
//         }
//         .iline {
//           margin-top: 6px;
//         }
//         .iline:first-child {
//           margin-top: 0;
//         }

//         .iaction {
//           margin-top: 12px;
//           display: flex;
//           justify-content: flex-start;
//         }

//         .pillLive {
//           display: inline-flex;
//           align-items: center;
//           gap: 8px;
//           padding: 6px 10px;
//           border-radius: 999px;
//           border: 1px solid rgba(255, 120, 120, 0.45);
//           background: rgba(255, 90, 90, 0.10);
//           color: rgba(255, 230, 230, 0.95);
//           font-weight: 900;
//           letter-spacing: 0.4px;
//           font-size: 12px;
//           white-space: nowrap;
//         }
//         .dot {
//           width: 8px;
//           height: 8px;
//           border-radius: 999px;
//           background: rgba(255, 90, 90, 0.95);
//           box-shadow: 0 0 14px rgba(255, 90, 90, 0.75);
//           animation: pulse 1.1s ease-in-out infinite;
//         }

//         .pillDone {
//           padding: 6px 10px;
//           border-radius: 999px;
//           border: 1px solid rgba(180, 210, 255, 0.35);
//           background: rgba(120, 180, 255, 0.10);
//           color: rgba(220, 235, 255, 0.95);
//           font-weight: 900;
//           letter-spacing: 0.4px;
//           font-size: 12px;
//           white-space: nowrap;
//         }

//         @keyframes pulse {
//           0%,
//           100% {
//             transform: scale(1);
//             opacity: 1;
//           }
//           50% {
//             transform: scale(1.35);
//             opacity: 0.75;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// function SpinningBasketball() {
//   return (
//     <div className="ballWrap" aria-hidden="true">
//       <div className="ball">
//         <svg viewBox="0 0 100 100" className="ballSvg">
//           <defs>
//             <radialGradient id="g" cx="30%" cy="30%" r="70%">
//               <stop offset="0%" stopColor="#ffb36b" stopOpacity="1" />
//               <stop offset="55%" stopColor="#e67e22" stopOpacity="1" />
//               <stop offset="100%" stopColor="#b85a14" stopOpacity="1" />
//             </radialGradient>
//           </defs>
//           <circle cx="50" cy="50" r="48" fill="url(#g)" />
//           <circle
//             cx="50"
//             cy="50"
//             r="48"
//             fill="none"
//             stroke="rgba(0,0,0,0.35)"
//             strokeWidth="2"
//           />
//           <path d="M50 2 v96" stroke="rgba(0,0,0,0.55)" strokeWidth="3" />
//           <path d="M2 50 h96" stroke="rgba(0,0,0,0.55)" strokeWidth="3" />
//           <path
//             d="M18 10 C40 30, 40 70, 18 90"
//             fill="none"
//             stroke="rgba(0,0,0,0.55)"
//             strokeWidth="3"
//           />
//           <path
//             d="M82 10 C60 30, 60 70, 82 90"
//             fill="none"
//             stroke="rgba(0,0,0,0.55)"
//             strokeWidth="3"
//           />
//         </svg>
//       </div>

//       <style jsx>{`
//         .ballWrap {
//           width: 120px;
//           height: 120px;
//           display: grid;
//           place-items: center;
//           filter: drop-shadow(0 14px 24px rgba(0, 0, 0, 0.45));
//         }
//         .ball {
//           width: 106px;
//           height: 106px;
//           border-radius: 999px;
//           animation: spin 2.8s linear infinite, floaty 3.2s ease-in-out infinite;
//           transform-origin: 50% 50%;
//         }
//         .ballSvg {
//           width: 100%;
//           height: 100%;
//           border-radius: 999px;
//           display: block;
//         }
//         @keyframes spin {
//           from {
//             transform: rotate(0deg);
//           }
//           to {
//             transform: rotate(360deg);
//           }
//         }
//         @keyframes floaty {
//           0%,
//           100% {
//             translate: 0 0;
//           }
//           50% {
//             translate: 0 -6px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// function formatCountdown(ms: number) {
//   const totalSeconds = Math.floor(ms / 1000);
//   const days = Math.floor(totalSeconds / 86400);
//   const hours = Math.floor((totalSeconds % 86400) / 3600);
//   const minutes = Math.floor((totalSeconds % 3600) / 60);
//   const seconds = totalSeconds % 60;
//   return { days, hours, minutes, seconds };
// }

// function formatPhoenix(d: Date) {
//   try {
//     return new Intl.DateTimeFormat("en-US", {
//       timeZone: "America/Phoenix",
//       dateStyle: "full",
//       timeStyle: "short",
//     }).format(d);
//   } catch {
//     return d.toLocaleString();
//   }
// }


// "use client";

// import { useEffect, useMemo, useState } from "react";
// import type { ReactNode } from "react";
// import Link from "next/link";
// import { auth } from "@/lib/firebase";
// import {
//   GoogleAuthProvider,
//   onAuthStateChanged,
//   signInWithPopup,
//   signOut,
//   User,
// } from "firebase/auth";

// // Phoenix is UTC-7 year-round (no DST)
// const TOURNAMENT_START_ISO = "2026-02-18T19:00:00-07:00";
// const NEXT_GAMES_ISO = "2026-02-20T19:00:00-07:00";     // tonight
// const NEXT_GAMES_2_ISO = "2026-02-27T19:00:00-07:00";   // queued next week
// const CHAMPIONSHIP_ISO = "2026-03-07T19:00:00-07:00";

// // How long we consider a “game block” live after its start time.
// // If games start at 7pm and you want LIVE to last until ~11pm, set this to 4.
// const GAME_BLOCK_DURATION_HOURS = 2;

// type GameBlock = {
//   label: string;
//   startISO: string;
// };

// function isInAppBrowser() {
//   if (typeof navigator === "undefined") return false;
//   const ua = navigator.userAgent || "";
//   return (
//     /Snapchat/i.test(ua) ||
//     /Instagram/i.test(ua) ||
//     /FBAN|FBAV/i.test(ua) || // Facebook
//     /TikTok/i.test(ua)
//   );
// }

// function isIOS() {
//   if (typeof navigator === "undefined") return false;
//   const ua = navigator.userAgent || "";
//   return /iPhone|iPad|iPod/i.test(ua);
// }

// export default function HomePage() {
//   const [user, setUser] = useState<User | null>(null);
//   const [checking, setChecking] = useState(true);
//   const [status, setStatus] = useState("");

//   const tournamentStart = useMemo(() => new Date(TOURNAMENT_START_ISO), []);
//   const nextGames = useMemo(() => new Date(NEXT_GAMES_ISO), []);
//   const nextGames2 = useMemo(() => new Date(NEXT_GAMES_2_ISO), []);
//   const championship = useMemo(() => new Date(CHAMPIONSHIP_ISO), []);

//   const [mounted, setMounted] = useState(false);
//   const [now, setNow] = useState(0);

//   const [inApp, setInApp] = useState(false);
//   const [copied, setCopied] = useState(false);

//   useEffect(() => {
//     setInApp(isInAppBrowser());
//   }, []);

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (u) => {
//       setUser(u);
//       setChecking(false);
//     });
//     return () => unsub();
//   }, []);

//   useEffect(() => {
//     setMounted(true);
//     setNow(Date.now());
//     const t = setInterval(() => setNow(Date.now()), 1000);
//     return () => clearInterval(t);
//   }, []);

//   const nowMs = mounted ? now : Date.now();

//   // ------------------------------------------------------------
//   // Text helpers
//   // ------------------------------------------------------------
//   const tournamentStartPhoenixText = useMemo(
//     () => (mounted ? formatPhoenix(tournamentStart) : "Loading…"),
//     [mounted, tournamentStart]
//   );

//   const nextGamesPhoenixText = useMemo(
//     () => (mounted ? formatPhoenix(nextGames) : "Loading…"),
//     [mounted, nextGames]
//   );

//   const nextGames2PhoenixText = useMemo(
//     () => (mounted ? formatPhoenix(nextGames2) : "Loading…"),
//     [mounted, nextGames2]
//   );

//   const championshipPhoenixText = useMemo(
//     () => (mounted ? formatPhoenix(championship) : "Loading…"),
//     [mounted, championship]
//   );

//   // ------------------------------------------------------------
//   // Card 1: Championship Countdown (always shown)
//   // ------------------------------------------------------------
//   const champDiffMs = championship.getTime() - nowMs;
//   const champSafeMs = Math.max(0, champDiffMs);
//   const champCountdown = formatCountdown(champSafeMs);

//   const champClockText = mounted
//     ? `${champCountdown.days}d ${champCountdown.hours}h ${champCountdown.minutes}m ${champCountdown.seconds}s`
//     : "Loading countdown…";

//   const championshipPassed = nowMs >= championship.getTime();

//   const championshipLines = championshipPassed
//     ? [`Championship (Phoenix): ${championshipPhoenixText}`, "Tournament complete."]
//     : [`Championship (Phoenix): ${championshipPhoenixText}`, champClockText];

//   const championshipBadge = championshipPassed
//     ? ({ type: "done", text: "COMPLETE" } as const)
//     : null;

//   // ------------------------------------------------------------
//   // Card 2: Next Games Countdown / LIVE based on game blocks
//   // ------------------------------------------------------------
//   const gameBlocks: GameBlock[] = useMemo(
//     () => [
//       { label: "Tournament Tip-off", startISO: TOURNAMENT_START_ISO },
//       { label: "Games (Feb 20)", startISO: NEXT_GAMES_ISO },
//       { label: "Games (Feb 27)", startISO: NEXT_GAMES_2_ISO },
//     ],
//     []
//   );

//   const computedBlocks = useMemo(() => {
//     const durMs = GAME_BLOCK_DURATION_HOURS * 60 * 60 * 1000;
//     return gameBlocks
//       .map((b) => {
//         const start = new Date(b.startISO);
//         const end = new Date(start.getTime() + durMs);
//         return { ...b, start, end };
//       })
//       .sort((a, b) => a.start.getTime() - b.start.getTime());
//   }, [gameBlocks]);

//   const currentBlock = computedBlocks.find(
//     (b) => nowMs >= b.start.getTime() && nowMs < b.end.getTime()
//   );

//   const nextBlock = computedBlocks.find((b) => b.start.getTime() > nowMs);

//   const nextGamesTitle = currentBlock
//     ? "Games Status"
//     : nextBlock
//     ? "Next Games Countdown"
//     : "Upcoming Games";

//   const nextGamesBadge = currentBlock ? ({ type: "live", text: "LIVE" } as const) : null;

//   const nextGamesLines = (() => {
//     if (currentBlock) {
//       return [
//         "Games are LIVE right now.",
//         `Started (Phoenix): ${formatPhoenix(currentBlock.start)}`,
//         `Approx. end (Phoenix): ${formatPhoenix(currentBlock.end)}`,
//       ];
//     }

//     if (nextBlock) {
//       const diffMs = nextBlock.start.getTime() - nowMs;
//       const safeMs = Math.max(0, diffMs);
//       const cd = formatCountdown(safeMs);

//       const clock = mounted
//         ? `${cd.days}d ${cd.hours}h ${cd.minutes}m ${cd.seconds}s`
//         : "Loading countdown…";

//       // Nice text for your known “next games” dates
//       if (nextBlock.startISO === NEXT_GAMES_ISO) {
//         return [`Next games (Phoenix): ${nextGamesPhoenixText}`, clock];
//       }
//       if (nextBlock.startISO === NEXT_GAMES_2_ISO) {
//         return [`Next games (Phoenix): ${nextGames2PhoenixText}`, clock];
//       }

//       // fallback for any other blocks you add later
//       return [`${nextBlock.label} (Phoenix): ${formatPhoenix(nextBlock.start)}`, clock];
//     }

//     return ["No upcoming games scheduled."];
//   })();

//   // ------------------------------------------------------------
//   // Auth actions
//   // ------------------------------------------------------------
//   async function doGoogleSignIn() {
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

//   async function copyLink() {
//     try {
//       const url =
//         typeof window !== "undefined" ? window.location.href : "https://azroadtoopen.com";
//       await navigator.clipboard.writeText(url);
//       setCopied(true);
//       setStatus("Link copied! Paste it into Safari/Chrome.");
//       setTimeout(() => setCopied(false), 1600);
//     } catch {
//       setStatus("Could not copy link here. Try selecting the URL and copying manually.");
//     }
//   }

//   const inAppHelpText = useMemo(() => {
//     if (!inApp) return null;
//     const ios = isIOS();
//     return ios
//       ? `You're in an in-app browser (Snap/IG). Sign-in is disabled here. Tap “Open in Browser”. If it doesn’t open with one tap, press-and-hold the button/link and choose “Open in Safari”, or use the Share icon → “Open in Safari”.`
//       : `You're in an in-app browser (Snap/IG). Sign-in is disabled here. Tap “Open in Browser”. If it doesn’t open with one tap, press-and-hold the button/link and choose “Open in browser” (Chrome).`;
//   }, [inApp]);

//   return (
//     <main className="wrap">
//       <div className="stage">
//         <div className="bgSpotlights" aria-hidden="true" />
//         <div className="bgVignette" aria-hidden="true" />

//         <header className="hero">
//           <div className="topRow">
//             <div className="brand">
//               <img
//                 className="brandLogo"
//                 src="/brand/azroadtoopen.png"
//                 alt="AZ Road to Open"
//                 onError={(e) => {
//                   (e.currentTarget as HTMLImageElement).style.display = "none";
//                 }}
//               />

//               <div className="brandText">
//                 <div className="title">AZ Road to Open Tournament Competition</div>

//                 <div className="aiaStripe" aria-hidden="true" />

//                 <div className="subtitle">
//                   Predict the matchups between the top teams in Arizona high school basketball,
//                   and who will take home the trophy. Fill out your bracket and compete against
//                   others to see who can have the most accurate bracket.
//                 </div>
//               </div>
//             </div>

//             <div className="ballCol">
//               <SpinningBasketball />
//             </div>
//           </div>

//           {/* ✅ In-app browser warning + ONE open button */}
//           {inApp ? (
//             <section className="inAppBanner">
//               <div className="inAppTitle">⚠️ In-app browser detected</div>
//               <div className="inAppText">{inAppHelpText}</div>

//               <div className="inAppActions">
//                 <a
//                   className="hbtn hbtnBlue"
//                   href="https://azroadtoopen.com"
//                   target="_blank"
//                   rel="noreferrer"
//                   title="Open in a full browser"
//                 >
//                   Open in Browser
//                 </a>

//                 <button className="hbtn hbtnGhost" onClick={copyLink}>
//                   {copied ? "Copied!" : "Copy Link"}
//                 </button>
//               </div>
//             </section>
//           ) : null}

//           <section className="panel">
//             {checking ? (
//               <div className="muted">Loading…</div>
//             ) : user ? (
//               <>
//                 <div className="signedIn">
//                   <div className="muted">Signed in as</div>
//                   <div className="who">{user.displayName ?? user.email ?? "User"}</div>
//                   {user.email ? <div className="muted">{user.email}</div> : null}
//                 </div>

//                 <div className="btnRow">
//                   <Link className="hbtn hbtnBlue" href="/my-bracket">
//                     My Bracket
//                   </Link>

//                   <Link className="hbtn hbtnGold" href="/bracket">
//                     Live Bracket
//                   </Link>

//                   <Link className="hbtn hbtnRed" href="/leaderboard">
//                     Leaderboard
//                   </Link>

//                   <button className="hbtn hbtnGhost" onClick={doSignOut}>
//                     Sign out
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div className="signedOut">
//                   <div className="muted">
//                     Sign in to create and submit your bracket. Once submitted, it locks.
//                   </div>
//                 </div>

//                 <div className="btnRow">
//                   {/* ✅ If in-app: hide sign-in buttons entirely to avoid confusion */}
//                   {inApp ? null : (
//                     <button className="hbtn hbtnBlue" onClick={doGoogleSignIn}>
//                       Sign in with Google
//                     </button>
//                   )}

//                   <Link className="hbtn hbtnGold" href="/bracket">
//                     View Live Bracket
//                   </Link>

//                   <Link className="hbtn hbtnRed" href="/leaderboard">
//                     View Leaderboard
//                   </Link>
//                 </div>

//                 {inApp ? (
//                   <div className="muted" style={{ marginTop: 10, fontSize: 13, lineHeight: "18px" }}>
//                     Sign-in is disabled inside this browser to avoid errors. Please use{" "}
//                     <b>Open in Browser</b>.
//                   </div>
//                 ) : null}
//               </>
//             )}

//             {status ? <div className="status">{status}</div> : null}
//           </section>

//           {/* Row 1: Championship + Scoring */}
//           <div className="cardsRow">
//             <InfoCard
//               title="Championship Countdown"
//               icon="⏳"
//               accent="green"
//               badge={championshipBadge}
//               lines={championshipLines}
//             />

//             <InfoCard
//               title="Scoring"
//               icon="🏀"
//               accent="blue"
//               lines={[
//                 "Round 1 = 1 point per correct pick",
//                 "Round 2 = 2 points",
//                 "Round 3 = 4 points",
//                 "Round 4 = 8 points",
//                 "Final = 16 points",
//               ]}
//             />
//           </div>

//           {/* Row 2: Next Games + News */}
//           <div className="cardsRow2">
//             <InfoCard
//               title={nextGamesTitle}
//               icon="🕒"
//               accent="green"
//               badge={nextGamesBadge}
//               lines={nextGamesLines}
//             />

//             <InfoCard
//               title="News"
//               icon="📰"
//               accent="blue"
//               lines={[
//                 "Updates, photos, announcements, and important changes will be posted here.",
//               ]}
//               action={
//                 <Link className="hbtn hbtnBlue" href="/news">
//                   News
//                 </Link>
//               }
//             />
//           </div>

//           <section className="howToPlay">
//             <div className="howTitle">How to play</div>
//             <ol className="howList">
//               <li>
//                 Go to <b>My Bracket</b> and pick winners (later rounds auto-fill).
//               </li>
//               <li>
//                 Hit <b>Submit Bracket</b> to lock your picks before tip-off:{" "}
//                 <b>{tournamentStartPhoenixText}</b>.
//               </li>
//               <li>
//                 Watch <b>Live Bracket</b> + <b>Leaderboard</b> update as winners are set.
//               </li>
//             </ol>
//           </section>
//         </header>

//         <footer className="disclaimer">
//           Unofficial bracket competition. Not affiliated with AIA. Please DM @charlie.richards13 on IG
//           to report any bugs or issues. Good luck and have fun!
//         </footer>
//       </div>

//       <style jsx>{`
//         .wrap {
//           padding: 28px 18px 110px;
//           color: #fff;
//           display: flex;
//           justify-content: center;
//         }

//         .stage {
//           width: 100%;
//           max-width: 1120px;
//           position: relative;
//           border-radius: 22px;
//           overflow: hidden;
//           border: 1px solid rgba(255, 255, 255, 0.1);
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
//           background: radial-gradient(1200px 700px at 50% 10%, rgba(0,0,0,0), rgba(0,0,0,0.65));
//           pointer-events: none;
//         }

//         .hero {
//           position: relative;
//           padding: 22px;
//         }

//         .topRow {
//           display: grid;
//           grid-template-columns: 1fr auto;
//           gap: 18px;
//           align-items: start;
//         }

//         .brand {
//           display: flex;
//           gap: 14px;
//           align-items: flex-start;
//         }

//         .brandLogo {
//           width: 120px;
//           height: auto;
//           filter: drop-shadow(0 12px 22px rgba(0, 0, 0, 0.45));
//           border-radius: 10px;
//           background: rgba(255,255,255,0.06);
//           border: 1px solid rgba(255,255,255,0.10);
//           padding: 6px;
//         }

//         .brandText .title {
//           font-size: 22px;
//           font-weight: 780;
//           letter-spacing: 0.2px;
//           margin-bottom: 10px;
//         }

//         .aiaStripe {
//           height: 10px;
//           width: min(520px, 100%);
//           border-radius: 999px;
//           margin-bottom: 12px;
//           opacity: 0.95;
//           background: linear-gradient(
//             90deg,
//             #1f6db3 0%,
//             #1f6db3 62%,
//             #f2c230 62%,
//             #f2c230 78%,
//             #d6463a 78%,
//             #d6463a 100%
//           );
//           box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
//           border: 1px solid rgba(255,255,255,0.10);
//         }

//         .brandText .subtitle {
//           font-size: 16px;
//           line-height: 24px;
//           color: rgba(255, 255, 255, 0.80);
//           max-width: 860px;
//         }

//         .ballCol {
//           display: flex;
//           justify-content: flex-end;
//           padding-top: 6px;
//         }

//         .inAppBanner {
//           margin-top: 14px;
//           border: 1px solid rgba(255, 255, 255, 0.12);
//           border-radius: 18px;
//           background: rgba(0, 0, 0, 0.30);
//           padding: 14px 16px;
//           box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
//         }
//         .inAppTitle {
//           font-weight: 900;
//           letter-spacing: 0.2px;
//           margin-bottom: 6px;
//         }
//         .inAppText {
//           opacity: 0.82;
//           font-size: 13px;
//           line-height: 18px;
//         }
//         .inAppActions {
//           margin-top: 10px;
//           display: flex;
//           flex-wrap: wrap;
//           gap: 10px;
//         }

//         .cardsRow {
//           margin-top: 16px;
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 12px;
//         }

//         .cardsRow2 {
//           margin-top: 12px;
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 12px;
//         }

//         .panel {
//           margin-top: 16px;
//           border: 1px solid rgba(255, 255, 255, 0.12);
//           border-radius: 18px;
//           background: rgba(255, 255, 255, 0.04);
//           box-shadow: 0 18px 45px rgba(0, 0, 0, 0.35);
//           padding: 18px;
//         }

//         .muted {
//           color: rgba(255, 255, 255, 0.72);
//         }

//         .who {
//           font-size: 18px;
//           font-weight: 780;
//           margin: 2px 0 2px;
//         }

//         .btnRow {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 10px;
//           align-items: center;
//           margin-top: 14px;
//         }

//         :global(.hbtn) {
//           border-radius: 12px;
//           padding: 11px 14px;
//           border: 1px solid rgba(255, 255, 255, 0.28);
//           text-decoration: none;
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           font-weight: 720;
//           cursor: pointer;
//           user-select: none;
//           transition: transform 120ms ease, background 120ms ease, border 120ms ease;
//           color: #fff;
//         }

//         :global(.hbtnBlue) {
//           background: rgba(31, 109, 179, 0.18);
//           border-color: rgba(31, 109, 179, 0.60);
//         }
//         :global(.hbtnGold) {
//           background: rgba(242, 194, 48, 0.14);
//           border-color: rgba(242, 194, 48, 0.60);
//         }
//         :global(.hbtnRed) {
//           background: rgba(214, 70, 58, 0.16);
//           border-color: rgba(214, 70, 58, 0.60);
//         }
//         :global(.hbtnGhost) {
//           background: rgba(0, 0, 0, 0.22);
//           color: rgba(255, 255, 255, 0.92);
//           border-color: rgba(255, 255, 255, 0.28);
//         }

//         :global(.hbtn:hover) {
//           transform: translateY(-1px);
//         }

//         .status {
//           margin-top: 12px;
//           color: rgba(183, 255, 183, 0.95);
//           font-size: 13px;
//           line-height: 18px;
//         }

//         .howToPlay {
//           margin-top: 14px;
//           border: 1px solid rgba(255, 255, 255, 0.10);
//           border-radius: 18px;
//           background: rgba(0, 0, 0, 0.18);
//           padding: 14px 16px;
//         }

//         .howTitle {
//           font-weight: 800;
//           letter-spacing: 0.2px;
//           margin-bottom: 8px;
//           color: rgba(255, 255, 255, 0.92);
//         }

//         .howList {
//           margin: 0;
//           padding-left: 18px;
//           color: rgba(255, 255, 255, 0.72);
//           line-height: 20px;
//           font-size: 13px;
//         }

//         .howList li {
//           margin: 6px 0;
//         }

//         .disclaimer {
//           margin-top: 14px;
//           padding: 12px 16px 18px;
//           text-align: center;
//           font-size: 12px;
//           line-height: 18px;
//           color: rgba(255, 255, 255, 0.55);
//           border-top: 1px solid rgba(255, 255, 255, 0.10);
//         }

//         @media (max-width: 920px) {
//           .topRow {
//             grid-template-columns: 1fr;
//           }
//           .ballCol {
//             justify-content: flex-start;
//           }
//           .cardsRow {
//             grid-template-columns: 1fr;
//           }
//           .cardsRow2 {
//             grid-template-columns: 1fr;
//           }
//           .brand {
//             flex-direction: column;
//           }
//           .brandLogo {
//             width: 160px;
//           }
//         }
//       `}</style>
//     </main>
//   );
// }

// function InfoCard({
//   title,
//   icon,
//   lines,
//   accent,
//   badge,
//   action,
// }: {
//   title: string;
//   icon: string;
//   lines: string[];
//   accent: "green" | "blue";
//   badge?: { type: "live" | "done"; text: string } | null;
//   action?: ReactNode;
// }) {
//   const accentBorder =
//     accent === "green" ? "rgba(120,255,170,0.30)" : "rgba(120,180,255,0.30)";
//   const accentBg =
//     accent === "green" ? "rgba(120,255,170,0.07)" : "rgba(120,180,255,0.07)";

//   return (
//     <div className="icard">
//       <div className="ihead">
//         <div className="ititle">
//           <span className="icon">{icon}</span> {title}
//         </div>

//         {badge?.type === "live" ? (
//           <div className="pillLive" title="Games are live">
//             <span className="dot" /> {badge.text}
//           </div>
//         ) : badge?.type === "done" ? (
//           <div className="pillDone" title="Tournament complete">
//             {badge.text}
//           </div>
//         ) : null}
//       </div>

//       <div className="ibody">
//         {lines.map((l, idx) => (
//           <div key={idx} className="iline">
//             {l}
//           </div>
//         ))}

//         {action ? <div className="iaction">{action}</div> : null}
//       </div>

//       <style jsx>{`
//         .icard {
//           border: 1px solid ${accentBorder};
//           background: ${accentBg};
//           border-radius: 18px;
//           padding: 14px;
//           box-shadow: 0 14px 35px rgba(0, 0, 0, 0.30);
//         }
//         .ihead {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 10px;
//           gap: 10px;
//         }
//         .ititle {
//           font-weight: 780;
//           letter-spacing: 0.2px;
//           display: flex;
//           align-items: center;
//           gap: 6px;
//         }
//         .ibody {
//           color: rgba(255, 255, 255, 0.80);
//           line-height: 20px;
//           font-size: 14px;
//         }
//         .iline {
//           margin-top: 6px;
//         }
//         .iline:first-child {
//           margin-top: 0;
//         }

//         .iaction {
//           margin-top: 12px;
//           display: flex;
//           justify-content: flex-start;
//         }

//         .pillLive {
//           display: inline-flex;
//           align-items: center;
//           gap: 8px;
//           padding: 6px 10px;
//           border-radius: 999px;
//           border: 1px solid rgba(255, 120, 120, 0.45);
//           background: rgba(255, 90, 90, 0.10);
//           color: rgba(255, 230, 230, 0.95);
//           font-weight: 900;
//           letter-spacing: 0.4px;
//           font-size: 12px;
//           white-space: nowrap;
//         }
//         .dot {
//           width: 8px;
//           height: 8px;
//           border-radius: 999px;
//           background: rgba(255, 90, 90, 0.95);
//           box-shadow: 0 0 14px rgba(255, 90, 90, 0.75);
//           animation: pulse 1.1s ease-in-out infinite;
//         }

//         .pillDone {
//           padding: 6px 10px;
//           border-radius: 999px;
//           border: 1px solid rgba(180, 210, 255, 0.35);
//           background: rgba(120, 180, 255, 0.10);
//           color: rgba(220, 235, 255, 0.95);
//           font-weight: 900;
//           letter-spacing: 0.4px;
//           font-size: 12px;
//           white-space: nowrap;
//         }

//         @keyframes pulse {
//           0%,
//           100% {
//             transform: scale(1);
//             opacity: 1;
//           }
//           50% {
//             transform: scale(1.35);
//             opacity: 0.75;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// function SpinningBasketball() {
//   return (
//     <div className="ballWrap" aria-hidden="true">
//       <div className="ball">
//         <svg viewBox="0 0 100 100" className="ballSvg">
//           <defs>
//             <radialGradient id="g" cx="30%" cy="30%" r="70%">
//               <stop offset="0%" stopColor="#ffb36b" stopOpacity="1" />
//               <stop offset="55%" stopColor="#e67e22" stopOpacity="1" />
//               <stop offset="100%" stopColor="#b85a14" stopOpacity="1" />
//             </radialGradient>
//           </defs>
//           <circle cx="50" cy="50" r="48" fill="url(#g)" />
//           <circle
//             cx="50"
//             cy="50"
//             r="48"
//             fill="none"
//             stroke="rgba(0,0,0,0.35)"
//             strokeWidth="2"
//           />
//           <path d="M50 2 v96" stroke="rgba(0,0,0,0.55)" strokeWidth="3" />
//           <path d="M2 50 h96" stroke="rgba(0,0,0,0.55)" strokeWidth="3" />
//           <path
//             d="M18 10 C40 30, 40 70, 18 90"
//             fill="none"
//             stroke="rgba(0,0,0,0.55)"
//             strokeWidth="3"
//           />
//           <path
//             d="M82 10 C60 30, 60 70, 82 90"
//             fill="none"
//             stroke="rgba(0,0,0,0.55)"
//             strokeWidth="3"
//           />
//         </svg>
//       </div>

//       <style jsx>{`
//         .ballWrap {
//           width: 120px;
//           height: 120px;
//           display: grid;
//           place-items: center;
//           filter: drop-shadow(0 14px 24px rgba(0, 0, 0, 0.45));
//         }
//         .ball {
//           width: 106px;
//           height: 106px;
//           border-radius: 999px;
//           animation: spin 2.8s linear infinite, floaty 3.2s ease-in-out infinite;
//           transform-origin: 50% 50%;
//         }
//         .ballSvg {
//           width: 100%;
//           height: 100%;
//           border-radius: 999px;
//           display: block;
//         }
//         @keyframes spin {
//           from {
//             transform: rotate(0deg);
//           }
//           to {
//             transform: rotate(360deg);
//           }
//         }
//         @keyframes floaty {
//           0%,
//           100% {
//             translate: 0 0;
//           }
//           50% {
//             translate: 0 -6px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// function formatCountdown(ms: number) {
//   const totalSeconds = Math.floor(ms / 1000);
//   const days = Math.floor(totalSeconds / 86400);
//   const hours = Math.floor((totalSeconds % 86400) / 3600);
//   const minutes = Math.floor((totalSeconds % 3600) / 60);
//   const seconds = totalSeconds % 60;
//   return { days, hours, minutes, seconds };
// }

// function formatPhoenix(d: Date) {
//   try {
//     return new Intl.DateTimeFormat("en-US", {
//       timeZone: "America/Phoenix",
//       dateStyle: "full",
//       timeStyle: "short",
//     }).format(d);
//   } catch {
//     return d.toLocaleString();
//   }
// }




// "use client";

// import { useEffect, useMemo, useState } from "react";
// import type { ReactNode } from "react";
// import Link from "next/link";
// import { auth } from "@/lib/firebase";
// import {
//   GoogleAuthProvider,
//   onAuthStateChanged,
//   signInWithPopup,
//   signOut,
//   User,
// } from "firebase/auth";

// // Phoenix is UTC-7 year-round (no DST)
// const TOURNAMENT_START_ISO = "2026-02-18T19:00:00-07:00";
// const NEXT_GAMES_ISO = "2026-02-20T19:00:00-07:00"; // tonight
// const NEXT_GAMES_2_ISO = "2026-02-27T19:00:00-07:00"; // queued next week
// const CHAMPIONSHIP_ISO = "2026-03-07T19:00:00-07:00";

// // How long we consider a “game block” live after its start time.
// // If games start at 7pm and you want LIVE to last until ~11pm, set this to 4.
// const GAME_BLOCK_DURATION_HOURS = 2;

// type GameBlock = {
//   label: string;
//   startISO: string;
// };

// function isInAppBrowser() {
//   if (typeof navigator === "undefined") return false;
//   const ua = navigator.userAgent || "";
//   return (
//     /Snapchat/i.test(ua) ||
//     /Instagram/i.test(ua) ||
//     /FBAN|FBAV/i.test(ua) || // Facebook
//     /TikTok/i.test(ua)
//   );
// }

// function isIOS() {
//   if (typeof navigator === "undefined") return false;
//   const ua = navigator.userAgent || "";
//   return /iPhone|iPad|iPod/i.test(ua);
// }

// export default function HomePage() {
//   const [user, setUser] = useState<User | null>(null);
//   const [checking, setChecking] = useState(true);
//   const [status, setStatus] = useState("");

//   const tournamentStart = useMemo(() => new Date(TOURNAMENT_START_ISO), []);
//   const nextGames = useMemo(() => new Date(NEXT_GAMES_ISO), []);
//   const nextGames2 = useMemo(() => new Date(NEXT_GAMES_2_ISO), []);
//   const championship = useMemo(() => new Date(CHAMPIONSHIP_ISO), []);

//   const [mounted, setMounted] = useState(false);
//   const [now, setNow] = useState(0);

//   const [inApp, setInApp] = useState(false);
//   const [copied, setCopied] = useState(false);

//   useEffect(() => {
//     setInApp(isInAppBrowser());
//   }, []);

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (u) => {
//       setUser(u);
//       setChecking(false);
//     });
//     return () => unsub();
//   }, []);

//   useEffect(() => {
//     setMounted(true);
//     setNow(Date.now());
//     const t = setInterval(() => setNow(Date.now()), 1000);
//     return () => clearInterval(t);
//   }, []);

//   const nowMs = mounted ? now : Date.now();

//   // ------------------------------------------------------------
//   // Text helpers
//   // ------------------------------------------------------------
//   const tournamentStartPhoenixText = useMemo(
//     () => (mounted ? formatPhoenix(tournamentStart) : "Loading…"),
//     [mounted, tournamentStart]
//   );

//   const nextGamesPhoenixText = useMemo(
//     () => (mounted ? formatPhoenix(nextGames) : "Loading…"),
//     [mounted, nextGames]
//   );

//   const nextGames2PhoenixText = useMemo(
//     () => (mounted ? formatPhoenix(nextGames2) : "Loading…"),
//     [mounted, nextGames2]
//   );

//   const championshipPhoenixText = useMemo(
//     () => (mounted ? formatPhoenix(championship) : "Loading…"),
//     [mounted, championship]
//   );

//   // ------------------------------------------------------------
//   // Card 1: Championship Countdown (always shown)
//   // ------------------------------------------------------------
//   const champDiffMs = championship.getTime() - nowMs;
//   const champSafeMs = Math.max(0, champDiffMs);
//   const champCountdown = formatCountdown(champSafeMs);

//   const champClockText = mounted
//     ? `${champCountdown.days}d ${champCountdown.hours}h ${champCountdown.minutes}m ${champCountdown.seconds}s`
//     : "Loading countdown…";

//   const championshipPassed = nowMs >= championship.getTime();

//   const championshipLines = championshipPassed
//     ? [`Championship (Phoenix): ${championshipPhoenixText}`, "Tournament complete."]
//     : [`Championship (Phoenix): ${championshipPhoenixText}`, champClockText];

//   const championshipBadge = championshipPassed
//     ? ({ type: "done", text: "COMPLETE" } as const)
//     : null;

//   // ------------------------------------------------------------
//   // Card 2: Next Games Countdown / LIVE based on game blocks
//   // ------------------------------------------------------------
//   const gameBlocks: GameBlock[] = useMemo(
//     () => [
//       { label: "Tournament Tip-off", startISO: TOURNAMENT_START_ISO },
//       { label: "Games (Feb 20)", startISO: NEXT_GAMES_ISO },
//       { label: "Games (Feb 27)", startISO: NEXT_GAMES_2_ISO },
//     ],
//     []
//   );

//   const computedBlocks = useMemo(() => {
//     const durMs = GAME_BLOCK_DURATION_HOURS * 60 * 60 * 1000;
//     return gameBlocks
//       .map((b) => {
//         const start = new Date(b.startISO);
//         const end = new Date(start.getTime() + durMs);
//         return { ...b, start, end };
//       })
//       .sort((a, b) => a.start.getTime() - b.start.getTime());
//   }, [gameBlocks]);

//   const currentBlock = computedBlocks.find(
//     (b) => nowMs >= b.start.getTime() && nowMs < b.end.getTime()
//   );

//   const nextBlock = computedBlocks.find((b) => b.start.getTime() > nowMs);

//   const nextGamesTitle = currentBlock
//     ? "Games Status"
//     : nextBlock
//     ? "Next Games Countdown"
//     : "Upcoming Games";

//   const nextGamesBadge = currentBlock ? ({ type: "live", text: "LIVE" } as const) : null;

//   const nextGamesLines = (() => {
//     if (currentBlock) {
//       return [
//         "Games are LIVE right now.",
//         `Started (Phoenix): ${formatPhoenix(currentBlock.start)}`,
//         `Approx. end (Phoenix): ${formatPhoenix(currentBlock.end)}`,
//       ];
//     }

//     if (nextBlock) {
//       const diffMs = nextBlock.start.getTime() - nowMs;
//       const safeMs = Math.max(0, diffMs);
//       const cd = formatCountdown(safeMs);

//       const clock = mounted
//         ? `${cd.days}d ${cd.hours}h ${cd.minutes}m ${cd.seconds}s`
//         : "Loading countdown…";

//       if (nextBlock.startISO === NEXT_GAMES_ISO) {
//         return [`Next games (Phoenix): ${nextGamesPhoenixText}`, clock];
//       }
//       if (nextBlock.startISO === NEXT_GAMES_2_ISO) {
//         return [`Next games (Phoenix): ${nextGames2PhoenixText}`, clock];
//       }

//       return [`${nextBlock.label} (Phoenix): ${formatPhoenix(nextBlock.start)}`, clock];
//     }

//     return ["No upcoming games scheduled."];
//   })();

//   // ------------------------------------------------------------
//   // Auth actions
//   // ------------------------------------------------------------
//   async function doGoogleSignIn() {
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

//   async function copyLink() {
//     try {
//       const url =
//         typeof window !== "undefined" ? window.location.href : "https://azroadtoopen.com";
//       await navigator.clipboard.writeText(url);
//       setCopied(true);
//       setStatus("Link copied! Paste it into Safari/Chrome.");
//       setTimeout(() => setCopied(false), 1600);
//     } catch {
//       setStatus("Could not copy link here. Try selecting the URL and copying manually.");
//     }
//   }

//   const inAppHelpText = useMemo(() => {
//     if (!inApp) return null;
//     const ios = isIOS();
//     return ios
//       ? `You're in an in-app browser (Snap/IG). Sign-in is disabled here. Tap “Open in Browser”. If it doesn’t open with one tap, press-and-hold the button/link and choose “Open in Safari”, or use the Share icon → “Open in Safari”.`
//       : `You're in an in-app browser (Snap/IG). Sign-in is disabled here. Tap “Open in Browser”. If it doesn’t open with one tap, press-and-hold the button/link and choose “Open in browser” (Chrome).`;
//   }, [inApp]);

//   return (
//     <main className="wrap">
//       <div className="stage">
//         <div className="bgSpotlights" aria-hidden="true" />
//         <div className="bgVignette" aria-hidden="true" />

//         <header className="hero">
//           <div className="topRow">
//             <div className="brand">
//               <img
//                 className="brandLogo"
//                 src="/brand/azroadtoopen.png"
//                 alt="AZ Road to Open"
//                 onError={(e) => {
//                   (e.currentTarget as HTMLImageElement).style.display = "none";
//                 }}
//               />

//               <div className="brandText">
//                 <div className="title">AZ Road to Open Tournament Competition</div>

//                 <div className="aiaStripe" aria-hidden="true" />

//                 <div className="subtitle">
//                   Predict the matchups between the top teams in Arizona high school basketball,
//                   and who will take home the trophy. Fill out your bracket and compete against
//                   others to see who can have the most accurate bracket.
//                 </div>
//               </div>
//             </div>

//             <div className="ballCol">
//               <SpinningBasketball />
//             </div>
//           </div>

//           {/* ✅ In-app browser warning + ONE open button */}
//           {inApp ? (
//             <section className="inAppBanner">
//               <div className="inAppTitle">⚠️ In-app browser detected</div>
//               <div className="inAppText">{inAppHelpText}</div>

//               <div className="inAppActions">
//                 <a
//                   className="hbtn hbtnBlue"
//                   href="https://azroadtoopen.com"
//                   target="_blank"
//                   rel="noreferrer"
//                   title="Open in a full browser"
//                 >
//                   Open in Browser
//                 </a>

//                 <button className="hbtn hbtnGhost" onClick={copyLink}>
//                   {copied ? "Copied!" : "Copy Link"}
//                 </button>
//               </div>
//             </section>
//           ) : null}

//           <section className="panel">
//             {checking ? (
//               <div className="muted">Loading…</div>
//             ) : user ? (
//               <>
//                 <div className="signedIn">
//                   <div className="muted">Signed in as</div>
//                   <div className="who">{user.displayName ?? user.email ?? "User"}</div>
//                   {user.email ? <div className="muted">{user.email}</div> : null}
//                 </div>

//                 <div className="btnRow">
//                   <Link className="hbtn hbtnBlue" href="/my-bracket">
//                     My Bracket
//                   </Link>

//                   <Link className="hbtn hbtnGold" href="/bracket">
//                     Live Bracket
//                   </Link>

//                   <Link className="hbtn hbtnRed" href="/leaderboard">
//                     Leaderboard
//                   </Link>

//                   <button className="hbtn hbtnGhost" onClick={doSignOut}>
//                     Sign out
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div className="signedOut">
//                   <div className="muted">
//                     Sign in to create and submit your bracket. Once submitted, it locks.
//                   </div>
//                 </div>

//                 <div className="btnRow">
//                   {/* ✅ If in-app: hide sign-in buttons entirely to avoid confusion */}
//                   {inApp ? null : (
//                     <button className="hbtn hbtnBlue" onClick={doGoogleSignIn}>
//                       Sign in with Google
//                     </button>
//                   )}

//                   <Link className="hbtn hbtnGold" href="/bracket">
//                     View Live Bracket
//                   </Link>

//                   <Link className="hbtn hbtnRed" href="/leaderboard">
//                     View Leaderboard
//                   </Link>
//                 </div>

//                 {inApp ? (
//                   <div className="muted" style={{ marginTop: 10, fontSize: 13, lineHeight: "18px" }}>
//                     Sign-in is disabled inside this browser to avoid errors. Please use{" "}
//                     <b>Open in Browser</b>.
//                   </div>
//                 ) : null}
//               </>
//             )}

//             {status ? <div className="status">{status}</div> : null}
//           </section>

//           {/* ✅ NEW: Arcade button row (goes ABOVE Championship + Scoring) */}
//           <section className="arcadeRow">
//             <div className="arcadeCard">
//               <div className="arcadeLeft">
//                 <div className="arcadeTitle">🎮 Arcade</div>
//                 <div className="arcadeSub">
//                   Play basketball mini-games while you wait for the next tip-off.
//                 </div>
//               </div>

//               <div className="arcadeRight">
//                 <Link className="hbtn hbtnGold" href="/arcade">
//                   Go to Arcade →
//                 </Link>
//               </div>
//             </div>
//           </section>

//           {/* Row 1: Championship + Scoring */}
//           <div className="cardsRow">
//             <InfoCard
//               title="Championship Countdown"
//               icon="⏳"
//               accent="green"
//               badge={championshipBadge}
//               lines={championshipLines}
//             />

//             <InfoCard
//               title="Scoring"
//               icon="🏀"
//               accent="blue"
//               lines={[
//                 "Round 1 = 1 point per correct pick",
//                 "Round 2 = 2 points",
//                 "Round 3 = 4 points",
//                 "Round 4 = 8 points",
//                 "Final = 16 points",
//               ]}
//             />
//           </div>

//           {/* Row 2: Next Games + News */}
//           <div className="cardsRow2">
//             <InfoCard
//               title={nextGamesTitle}
//               icon="🕒"
//               accent="green"
//               badge={nextGamesBadge}
//               lines={nextGamesLines}
//             />

//             <InfoCard
//               title="News"
//               icon="📰"
//               accent="blue"
//               lines={[
//                 "Updates, photos, announcements, and important changes will be posted here.",
//               ]}
//               action={
//                 <Link className="hbtn hbtnBlue" href="/news">
//                   News
//                 </Link>
//               }
//             />
//           </div>

//           <section className="howToPlay">
//             <div className="howTitle">How to play</div>
//             <ol className="howList">
//               <li>
//                 Go to <b>My Bracket</b> and pick winners (later rounds auto-fill).
//               </li>
//               <li>
//                 Hit <b>Submit Bracket</b> to lock your picks before tip-off:{" "}
//                 <b>{tournamentStartPhoenixText}</b>.
//               </li>
//               <li>
//                 Watch <b>Live Bracket</b> + <b>Leaderboard</b> update as winners are set.
//               </li>
//             </ol>
//           </section>
//         </header>

//         <footer className="disclaimer">
//           Unofficial bracket competition. Not affiliated with AIA. Please DM @charlie.richards13 on IG
//           to report any bugs or issues. Good luck and have fun!
//         </footer>
//       </div>

//       <style jsx>{`
//         .wrap {
//           padding: 28px 18px 110px;
//           color: #fff;
//           display: flex;
//           justify-content: center;
//         }

//         .stage {
//           width: 100%;
//           max-width: 1120px;
//           position: relative;
//           border-radius: 22px;
//           overflow: hidden;
//           border: 1px solid rgba(255, 255, 255, 0.1);
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
//           background: radial-gradient(1200px 700px at 50% 10%, rgba(0,0,0,0), rgba(0,0,0,0.65));
//           pointer-events: none;
//         }

//         .hero {
//           position: relative;
//           padding: 22px;
//         }

//         .topRow {
//           display: grid;
//           grid-template-columns: 1fr auto;
//           gap: 18px;
//           align-items: start;
//         }

//         .brand {
//           display: flex;
//           gap: 14px;
//           align-items: flex-start;
//         }

//         .brandLogo {
//           width: 120px;
//           height: auto;
//           filter: drop-shadow(0 12px 22px rgba(0, 0, 0, 0.45));
//           border-radius: 10px;
//           background: rgba(255,255,255,0.06);
//           border: 1px solid rgba(255,255,255,0.10);
//           padding: 6px;
//         }

//         .brandText .title {
//           font-size: 22px;
//           font-weight: 780;
//           letter-spacing: 0.2px;
//           margin-bottom: 10px;
//         }

//         .aiaStripe {
//           height: 10px;
//           width: min(520px, 100%);
//           border-radius: 999px;
//           margin-bottom: 12px;
//           opacity: 0.95;
//           background: linear-gradient(
//             90deg,
//             #1f6db3 0%,
//             #1f6db3 62%,
//             #f2c230 62%,
//             #f2c230 78%,
//             #d6463a 78%,
//             #d6463a 100%
//           );
//           box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
//           border: 1px solid rgba(255,255,255,0.10);
//         }

//         .brandText .subtitle {
//           font-size: 16px;
//           line-height: 24px;
//           color: rgba(255, 255, 255, 0.80);
//           max-width: 860px;
//         }

//         .ballCol {
//           display: flex;
//           justify-content: flex-end;
//           padding-top: 6px;
//         }

//         .inAppBanner {
//           margin-top: 14px;
//           border: 1px solid rgba(255, 255, 255, 0.12);
//           border-radius: 18px;
//           background: rgba(0, 0, 0, 0.30);
//           padding: 14px 16px;
//           box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
//         }
//         .inAppTitle {
//           font-weight: 900;
//           letter-spacing: 0.2px;
//           margin-bottom: 6px;
//         }
//         .inAppText {
//           opacity: 0.82;
//           font-size: 13px;
//           line-height: 18px;
//         }
//         .inAppActions {
//           margin-top: 10px;
//           display: flex;
//           flex-wrap: wrap;
//           gap: 10px;
//         }

//         .panel {
//           margin-top: 16px;
//           border: 1px solid rgba(255, 255, 255, 0.12);
//           border-radius: 18px;
//           background: rgba(255, 255, 255, 0.04);
//           box-shadow: 0 18px 45px rgba(0, 0, 0, 0.35);
//           padding: 18px;
//         }

//         .cardsRow {
//           margin-top: 16px;
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 12px;
//         }

//         .cardsRow2 {
//           margin-top: 12px;
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 12px;
//         }

//         /* ✅ NEW Arcade row styles */
//         .arcadeRow {
//           margin-top: 14px;
//         }
//         .arcadeCard {
//           border-radius: 18px;
//           border: 1px solid rgba(242, 194, 48, 0.35);
//           background: rgba(242, 194, 48, 0.07);
//           box-shadow: 0 14px 35px rgba(0, 0, 0, 0.30);
//           padding: 14px;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           gap: 12px;
//           flex-wrap: wrap;
//         }
//         .arcadeTitle {
//           font-weight: 900;
//           letter-spacing: 0.2px;
//           font-size: 16px;
//         }
//         .arcadeSub {
//           margin-top: 6px;
//           opacity: 0.80;
//           font-size: 13px;
//           line-height: 18px;
//           max-width: 760px;
//         }
//         .arcadeRight {
//           display: flex;
//           gap: 10px;
//           align-items: center;
//         }

//         .muted {
//           color: rgba(255, 255, 255, 0.72);
//         }

//         .who {
//           font-size: 18px;
//           font-weight: 780;
//           margin: 2px 0 2px;
//         }

//         .btnRow {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 10px;
//           align-items: center;
//           margin-top: 14px;
//         }

//         :global(.hbtn) {
//           border-radius: 12px;
//           padding: 11px 14px;
//           border: 1px solid rgba(255, 255, 255, 0.28);
//           text-decoration: none;
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           font-weight: 720;
//           cursor: pointer;
//           user-select: none;
//           transition: transform 120ms ease, background 120ms ease, border 120ms ease;
//           color: #fff;
//         }

//         :global(.hbtnBlue) {
//           background: rgba(31, 109, 179, 0.18);
//           border-color: rgba(31, 109, 179, 0.60);
//         }
//         :global(.hbtnGold) {
//           background: rgba(242, 194, 48, 0.14);
//           border-color: rgba(242, 194, 48, 0.60);
//         }
//         :global(.hbtnRed) {
//           background: rgba(214, 70, 58, 0.16);
//           border-color: rgba(214, 70, 58, 0.60);
//         }
//         :global(.hbtnGhost) {
//           background: rgba(0, 0, 0, 0.22);
//           color: rgba(255, 255, 255, 0.92);
//           border-color: rgba(255, 255, 255, 0.28);
//         }

//         :global(.hbtn:hover) {
//           transform: translateY(-1px);
//         }

//         .status {
//           margin-top: 12px;
//           color: rgba(183, 255, 183, 0.95);
//           font-size: 13px;
//           line-height: 18px;
//         }

//         .howToPlay {
//           margin-top: 14px;
//           border: 1px solid rgba(255, 255, 255, 0.10);
//           border-radius: 18px;
//           background: rgba(0, 0, 0, 0.18);
//           padding: 14px 16px;
//         }

//         .howTitle {
//           font-weight: 800;
//           letter-spacing: 0.2px;
//           margin-bottom: 8px;
//           color: rgba(255, 255, 255, 0.92);
//         }

//         .howList {
//           margin: 0;
//           padding-left: 18px;
//           color: rgba(255, 255, 255, 0.72);
//           line-height: 20px;
//           font-size: 13px;
//         }

//         .howList li {
//           margin: 6px 0;
//         }

//         .disclaimer {
//           margin-top: 14px;
//           padding: 12px 16px 18px;
//           text-align: center;
//           font-size: 12px;
//           line-height: 18px;
//           color: rgba(255, 255, 255, 0.55);
//           border-top: 1px solid rgba(255, 255, 255, 0.10);
//         }

//         @media (max-width: 920px) {
//           .topRow {
//             grid-template-columns: 1fr;
//           }
//           .ballCol {
//             justify-content: flex-start;
//           }
//           .cardsRow {
//             grid-template-columns: 1fr;
//           }
//           .cardsRow2 {
//             grid-template-columns: 1fr;
//           }
//         }
//       `}</style>
//     </main>
//   );
// }

// function InfoCard({
//   title,
//   icon,
//   lines,
//   accent,
//   badge,
//   action,
// }: {
//   title: string;
//   icon: string;
//   lines: string[];
//   accent: "green" | "blue";
//   badge?: { type: "live" | "done"; text: string } | null;
//   action?: ReactNode;
// }) {
//   const accentBorder =
//     accent === "green" ? "rgba(120,255,170,0.30)" : "rgba(120,180,255,0.30)";
//   const accentBg =
//     accent === "green" ? "rgba(120,255,170,0.07)" : "rgba(120,180,255,0.07)";

//   return (
//     <div className="icard">
//       <div className="ihead">
//         <div className="ititle">
//           <span className="icon">{icon}</span> {title}
//         </div>

//         {badge?.type === "live" ? (
//           <div className="pillLive" title="Games are live">
//             <span className="dot" /> {badge.text}
//           </div>
//         ) : badge?.type === "done" ? (
//           <div className="pillDone" title="Tournament complete">
//             {badge.text}
//           </div>
//         ) : null}
//       </div>

//       <div className="ibody">
//         {lines.map((l, idx) => (
//           <div key={idx} className="iline">
//             {l}
//           </div>
//         ))}

//         {action ? <div className="iaction">{action}</div> : null}
//       </div>

//       <style jsx>{`
//         .icard {
//           border: 1px solid ${accentBorder};
//           background: ${accentBg};
//           border-radius: 18px;
//           padding: 14px;
//           box-shadow: 0 14px 35px rgba(0, 0, 0, 0.30);
//         }
//         .ihead {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 10px;
//           gap: 10px;
//         }
//         .ititle {
//           font-weight: 780;
//           letter-spacing: 0.2px;
//           display: flex;
//           align-items: center;
//           gap: 6px;
//         }
//         .ibody {
//           color: rgba(255, 255, 255, 0.80);
//           line-height: 20px;
//           font-size: 14px;
//         }
//         .iline {
//           margin-top: 6px;
//         }
//         .iline:first-child {
//           margin-top: 0;
//         }

//         .iaction {
//           margin-top: 12px;
//           display: flex;
//           justify-content: flex-start;
//         }

//         .pillLive {
//           display: inline-flex;
//           align-items: center;
//           gap: 8px;
//           padding: 6px 10px;
//           border-radius: 999px;
//           border: 1px solid rgba(255, 120, 120, 0.45);
//           background: rgba(255, 90, 90, 0.10);
//           color: rgba(255, 230, 230, 0.95);
//           font-weight: 900;
//           letter-spacing: 0.4px;
//           font-size: 12px;
//           white-space: nowrap;
//         }
//         .dot {
//           width: 8px;
//           height: 8px;
//           border-radius: 999px;
//           background: rgba(255, 90, 90, 0.95);
//           box-shadow: 0 0 14px rgba(255, 90, 90, 0.75);
//           animation: pulse 1.1s ease-in-out infinite;
//         }

//         .pillDone {
//           padding: 6px 10px;
//           border-radius: 999px;
//           border: 1px solid rgba(180, 210, 255, 0.35);
//           background: rgba(120, 180, 255, 0.10);
//           color: rgba(220, 235, 255, 0.95);
//           font-weight: 900;
//           letter-spacing: 0.4px;
//           font-size: 12px;
//           white-space: nowrap;
//         }

//         @keyframes pulse {
//           0%,
//           100% {
//             transform: scale(1);
//             opacity: 1;
//           }
//           50% {
//             transform: scale(1.35);
//             opacity: 0.75;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// function SpinningBasketball() {
//   return (
//     <div className="ballWrap" aria-hidden="true">
//       <div className="ball">
//         <svg viewBox="0 0 100 100" className="ballSvg">
//           <defs>
//             <radialGradient id="g" cx="30%" cy="30%" r="70%">
//               <stop offset="0%" stopColor="#ffb36b" stopOpacity="1" />
//               <stop offset="55%" stopColor="#e67e22" stopOpacity="1" />
//               <stop offset="100%" stopColor="#b85a14" stopOpacity="1" />
//             </radialGradient>
//           </defs>
//           <circle cx="50" cy="50" r="48" fill="url(#g)" />
//           <circle
//             cx="50"
//             cy="50"
//             r="48"
//             fill="none"
//             stroke="rgba(0,0,0,0.35)"
//             strokeWidth="2"
//           />
//           <path d="M50 2 v96" stroke="rgba(0,0,0,0.55)" strokeWidth="3" />
//           <path d="M2 50 h96" stroke="rgba(0,0,0,0.55)" strokeWidth="3" />
//           <path
//             d="M18 10 C40 30, 40 70, 18 90"
//             fill="none"
//             stroke="rgba(0,0,0,0.55)"
//             strokeWidth="3"
//           />
//           <path
//             d="M82 10 C60 30, 60 70, 82 90"
//             fill="none"
//             stroke="rgba(0,0,0,0.55)"
//             strokeWidth="3"
//           />
//         </svg>
//       </div>

//       <style jsx>{`
//         .ballWrap {
//           width: 120px;
//           height: 120px;
//           display: grid;
//           place-items: center;
//           filter: drop-shadow(0 14px 24px rgba(0, 0, 0, 0.45));
//         }
//         .ball {
//           width: 106px;
//           height: 106px;
//           border-radius: 999px;
//           animation: spin 2.8s linear infinite, floaty 3.2s ease-in-out infinite;
//           transform-origin: 50% 50%;
//         }
//         .ballSvg {
//           width: 100%;
//           height: 100%;
//           border-radius: 999px;
//           display: block;
//         }
//         @keyframes spin {
//           from {
//             transform: rotate(0deg);
//           }
//           to {
//             transform: rotate(360deg);
//           }
//         }
//         @keyframes floaty {
//           0%,
//           100% {
//             translate: 0 0;
//           }
//           50% {
//             translate: 0 -6px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// function formatCountdown(ms: number) {
//   const totalSeconds = Math.floor(ms / 1000);
//   const days = Math.floor(totalSeconds / 86400);
//   const hours = Math.floor((totalSeconds % 86400) / 3600);
//   const minutes = Math.floor((totalSeconds % 3600) / 60);
//   const seconds = totalSeconds % 60;
//   return { days, hours, minutes, seconds };
// }

// function formatPhoenix(d: Date) {
//   try {
//     return new Intl.DateTimeFormat("en-US", {
//       timeZone: "America/Phoenix",
//       dateStyle: "full",
//       timeStyle: "short",
//     }).format(d);
//   } catch {
//     return d.toLocaleString();
//   }
// }


// "use client";

// import { useEffect, useMemo, useState } from "react";
// import type { ReactNode } from "react";
// import Link from "next/link";
// import { auth } from "@/lib/firebase";
// import {
//   GoogleAuthProvider,
//   onAuthStateChanged,
//   signInWithPopup,
//   signOut,
//   User,
// } from "firebase/auth";

// // Phoenix is UTC-7 year-round (no DST)
// const TOURNAMENT_START_ISO = "2026-02-18T19:00:00-07:00";

// // ✅ NEW: Upcoming rounds
// const SEMIFINALS_ISO = "2026-03-04T20:00:00-07:00"; // Wed Mar 4 @ 8:00pm Phoenix
// const FINALS_ISO = "2026-03-06T20:00:00-07:00"; // Fri Mar 6 @ 8:00pm Phoenix (assumed)

// // How long we consider a “game block” live after its start time.
// const GAME_BLOCK_DURATION_HOURS = 2;

// function isInAppBrowser() {
//   if (typeof navigator === "undefined") return false;
//   const ua = navigator.userAgent || "";
//   return (
//     /Snapchat/i.test(ua) ||
//     /Instagram/i.test(ua) ||
//     /FBAN|FBAV/i.test(ua) || // Facebook
//     /TikTok/i.test(ua)
//   );
// }

// function isIOS() {
//   if (typeof navigator === "undefined") return false;
//   const ua = navigator.userAgent || "";
//   return /iPhone|iPad|iPod/i.test(ua);
// }

// export default function HomePage() {
//   const [user, setUser] = useState<User | null>(null);
//   const [checking, setChecking] = useState(true);
//   const [status, setStatus] = useState("");

//   const tournamentStart = useMemo(() => new Date(TOURNAMENT_START_ISO), []);
//   const semifinals = useMemo(() => new Date(SEMIFINALS_ISO), []);
//   const finals = useMemo(() => new Date(FINALS_ISO), []);

//   const [mounted, setMounted] = useState(false);
//   const [now, setNow] = useState(0);

//   const [inApp, setInApp] = useState(false);
//   const [copied, setCopied] = useState(false);

//   useEffect(() => {
//     setInApp(isInAppBrowser());
//   }, []);

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (u) => {
//       setUser(u);
//       setChecking(false);
//     });
//     return () => unsub();
//   }, []);

//   useEffect(() => {
//     setMounted(true);
//     setNow(Date.now());
//     const t = setInterval(() => setNow(Date.now()), 1000);
//     return () => clearInterval(t);
//   }, []);

//   const nowMs = mounted ? now : Date.now();
//   const durMs = GAME_BLOCK_DURATION_HOURS * 60 * 60 * 1000;

//   // ------------------------------------------------------------
//   // Text helpers
//   // ------------------------------------------------------------
//   const tournamentStartPhoenixText = useMemo(
//     () => (mounted ? formatPhoenix(tournamentStart) : "Loading…"),
//     [mounted, tournamentStart]
//   );

//   const semifinalsPhoenixText = useMemo(
//     () => (mounted ? formatPhoenix(semifinals) : "Loading…"),
//     [mounted, semifinals]
//   );

//   const finalsPhoenixText = useMemo(
//     () => (mounted ? formatPhoenix(finals) : "Loading…"),
//     [mounted, finals]
//   );

//   // ------------------------------------------------------------
//   // Semifinals card
//   // ------------------------------------------------------------
//   const semiStartMs = semifinals.getTime();
//   const semiEndMs = semiStartMs + durMs;
//   const semiLive = nowMs >= semiStartMs && nowMs < semiEndMs;
//   const semiDone = nowMs >= semiEndMs;

//   const semiDiffMs = semiStartMs - nowMs;
//   const semiSafeMs = Math.max(0, semiDiffMs);
//   const semiCd = formatCountdown(semiSafeMs);

//   const semiClockText = mounted
//     ? `${semiCd.days}d ${semiCd.hours}h ${semiCd.minutes}m ${semiCd.seconds}s`
//     : "Loading countdown…";

//   const semifinalsBadge = semiLive
//     ? ({ type: "live", text: "LIVE" } as const)
//     : semiDone
//     ? ({ type: "done", text: "DONE" } as const)
//     : null;

//   const semifinalsLines = semiDone
//     ? [`Semifinals (Phoenix): ${semifinalsPhoenixText}`, "Semifinals are complete."]
//     : semiLive
//     ? [
//         "Semifinals are LIVE right now.",
//         `Started (Phoenix): ${formatPhoenix(semifinals)}`,
//         `Approx. end (Phoenix): ${formatPhoenix(new Date(semiEndMs))}`,
//       ]
//     : [`Semifinals (Phoenix): ${semifinalsPhoenixText}`, semiClockText];

//   // ------------------------------------------------------------
//   // Finals card
//   // ------------------------------------------------------------
//   const finalsStartMs = finals.getTime();
//   const finalsEndMs = finalsStartMs + durMs;
//   const finalsLive = nowMs >= finalsStartMs && nowMs < finalsEndMs;
//   const finalsDone = nowMs >= finalsEndMs;

//   const finalsDiffMs = finalsStartMs - nowMs;
//   const finalsSafeMs = Math.max(0, finalsDiffMs);
//   const finalsCd = formatCountdown(finalsSafeMs);

//   const finalsClockText = mounted
//     ? `${finalsCd.days}d ${finalsCd.hours}h ${finalsCd.minutes}m ${finalsCd.seconds}s`
//     : "Loading countdown…";

//   const finalsBadge = finalsLive
//     ? ({ type: "live", text: "LIVE" } as const)
//     : finalsDone
//     ? ({ type: "done", text: "COMPLETE" } as const)
//     : null;

//   const finalsLines = finalsDone
//     ? [`Finals (Phoenix): ${finalsPhoenixText}`, "Tournament complete."]
//     : finalsLive
//     ? [
//         "Finals are LIVE right now.",
//         `Started (Phoenix): ${formatPhoenix(finals)}`,
//         `Approx. end (Phoenix): ${formatPhoenix(new Date(finalsEndMs))}`,
//       ]
//     : [`Finals (Phoenix): ${finalsPhoenixText}`, finalsClockText];

//   // ------------------------------------------------------------
//   // Auth actions
//   // ------------------------------------------------------------
//   async function doGoogleSignIn() {
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

//   async function copyLink() {
//     try {
//       const url =
//         typeof window !== "undefined" ? window.location.href : "https://azroadtoopen.com";
//       await navigator.clipboard.writeText(url);
//       setCopied(true);
//       setStatus("Link copied! Paste it into Safari/Chrome.");
//       setTimeout(() => setCopied(false), 1600);
//     } catch {
//       setStatus("Could not copy link here. Try selecting the URL and copying manually.");
//     }
//   }

//   const inAppHelpText = useMemo(() => {
//     if (!inApp) return null;
//     const ios = isIOS();
//     return ios
//       ? `You're in an in-app browser (Snap/IG). Sign-in is disabled here. Tap “Open in Browser”. If it doesn’t open with one tap, press-and-hold the button/link and choose “Open in Safari”, or use the Share icon → “Open in Safari”.`
//       : `You're in an in-app browser (Snap/IG). Sign-in is disabled here. Tap “Open in Browser”. If it doesn’t open with one tap, press-and-hold the button/link and choose “Open in browser” (Chrome).`;
//   }, [inApp]);

//   const tournamentStarted = nowMs >= tournamentStart.getTime();

//   return (
//     <main className="wrap">
//       <div className="stage">
//         <div className="bgSpotlights" aria-hidden="true" />
//         <div className="bgVignette" aria-hidden="true" />

//         <header className="hero">
//           <div className="topRow">
//             <div className="brand">
//               <img
//                 className="brandLogo"
//                 src="/brand/azroadtoopen.png"
//                 alt="AZ Road to Open"
//                 onError={(e) => {
//                   (e.currentTarget as HTMLImageElement).style.display = "none";
//                 }}
//               />

//               <div className="brandText">
//                 <div className="title">AZ Road to Open Tournament Competition</div>

//                 <div className="aiaStripe" aria-hidden="true" />

//                 <div className="subtitle">
//                   Predict the matchups between the top teams in Arizona high school basketball,
//                   and who will take home the trophy. Fill out your bracket and compete against
//                   others to see who can have the most accurate bracket.
//                 </div>
//               </div>
//             </div>

//             <div className="ballCol">
//               <SpinningBasketball />
//             </div>
//           </div>

//           {/* ✅ In-app browser warning + ONE open button */}
//           {inApp ? (
//             <section className="inAppBanner">
//               <div className="inAppTitle">⚠️ In-app browser detected</div>
//               <div className="inAppText">{inAppHelpText}</div>

//               <div className="inAppActions">
//                 <a
//                   className="hbtn hbtnBlue"
//                   href="https://azroadtoopen.com"
//                   target="_blank"
//                   rel="noreferrer"
//                   title="Open in a full browser"
//                 >
//                   Open in Browser
//                 </a>

//                 <button className="hbtn hbtnGhost" onClick={copyLink}>
//                   {copied ? "Copied!" : "Copy Link"}
//                 </button>
//               </div>
//             </section>
//           ) : null}

//           <section className="panel">
//             {checking ? (
//               <div className="muted">Loading…</div>
//             ) : user ? (
//               <>
//                 <div className="signedIn">
//                   <div className="muted">Signed in as</div>
//                   <div className="who">{user.displayName ?? user.email ?? "User"}</div>
//                   {user.email ? <div className="muted">{user.email}</div> : null}
//                 </div>

//                 <div className="btnRow">
//                   <Link className="hbtn hbtnBlue" href="/my-bracket">
//                     My Bracket
//                   </Link>

//                   <Link className="hbtn hbtnGold" href="/bracket">
//                     Live Bracket
//                   </Link>

//                   <Link className="hbtn hbtnRed" href="/leaderboard">
//                     Leaderboard
//                   </Link>

//                   <button className="hbtn hbtnGhost" onClick={doSignOut}>
//                     Sign out
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div className="signedOut">
//                   <div className="muted">
//                     Sign in to create and submit your bracket. Once submitted, it locks.
//                   </div>
//                 </div>

//                 <div className="btnRow">
//                   {/* ✅ If in-app: hide sign-in buttons entirely to avoid confusion */}
//                   {inApp ? null : (
//                     <button className="hbtn hbtnBlue" onClick={doGoogleSignIn}>
//                       Sign in with Google
//                     </button>
//                   )}

//                   <Link className="hbtn hbtnGold" href="/bracket">
//                     View Live Bracket
//                   </Link>

//                   <Link className="hbtn hbtnRed" href="/leaderboard">
//                     View Leaderboard
//                   </Link>
//                 </div>

//                 {inApp ? (
//                   <div className="muted" style={{ marginTop: 10, fontSize: 13, lineHeight: "18px" }}>
//                     Sign-in is disabled inside this browser to avoid errors. Please use{" "}
//                     <b>Open in Browser</b>.
//                   </div>
//                 ) : null}
//               </>
//             )}

//             {status ? <div className="status">{status}</div> : null}
//           </section>

//           {/* ✅ Feature row: Arcade (disabled) */}
//           <section className="arcadeRow">
//             <div className="arcadeCard">
//               <div className="arcadeLeft">
//                 <div className="arcadeTitle">🎮 Arcade</div>
//                 <div className="arcadeSub">
//                   Arcade games are getting upgraded for the next release.
//                 </div>
//               </div>

//               <div className="arcadeRight">
//                 {/* ✅ Disabled so nobody can click into /arcade */}
//                 <button className="hbtn hbtnDisabled" disabled title="Coming soon">
//                   Coming Soon
//                 </button>
//               </div>
//             </div>
//           </section>

//           {/* ✅ NEW: Player Props button row */}
//           <section className="propsRow">
//             <div className="propsCard">
//               <div className="propsLeft">
//                 <div className="propsTitle">📊 Player Props (Over/Under)</div>
//                 <div className="propsSub">
//                   Make over/under predictions on featured players in the finals. Points, rebounds, assists, and more! Player props are optional and scored separately from the main bracket.
//                 </div>
//               </div>

//               <div className="propsRight">
//                 <Link className="hbtn hbtnBlue" href="/player-props">
//                   Go to Player Props →
//                 </Link>
//               </div>
//             </div>
//           </section>

//           {/* Row 1: Semis + Finals */}
//           <div className="cardsRow">
//             <InfoCard
//               title="Semifinals Countdown"
//               icon="🕒"
//               accent="green"
//               badge={semifinalsBadge}
//               lines={semifinalsLines}
//             />

//             <InfoCard
//               title="Finals Countdown"
//               icon="🏆"
//               accent="green"
//               badge={finalsBadge}
//               lines={finalsLines}
//             />
//           </div>

//           {/* Row 2: Scoring + News */}
//           <div className="cardsRow2">
//             <InfoCard
//               title="Scoring"
//               icon="🏀"
//               accent="blue"
//               lines={[
//                 "Round 1 = 1 point per correct pick",
//                 "Round 2 = 2 points",
//                 "Round 3 = 4 points",
//                 "Round 4 = 8 points",
//                 "Final = 16 points",
//               ]}
//             />

//             <InfoCard
//               title="News"
//               icon="📰"
//               accent="blue"
//               lines={["Updates, photos, announcements, and important changes will be posted here."]}
//               action={
//                 <Link className="hbtn hbtnBlue" href="/news">
//                   News
//                 </Link>
//               }
//             />
//           </div>

//           <section className="howToPlay">
//             <div className="howTitle">How to play</div>
//             <ol className="howList">
//               <li>
//                 Go to <b>My Bracket</b> and pick winners (later rounds auto-fill).
//               </li>

//               <li>
//                 {tournamentStarted ? (
//                   <>
//                     Brackets are locked (tournament started on <b>{tournamentStartPhoenixText}</b>).
//                   </>
//                 ) : (
//                   <>
//                     Hit <b>Submit Bracket</b> to lock your picks before tip-off:{" "}
//                     <b>{tournamentStartPhoenixText}</b>.
//                   </>
//                 )}
//               </li>

//               <li>
//                 Semifinals tip-off: <b>{semifinalsPhoenixText}</b>. Finals tip-off:{" "}
//                 <b>{finalsPhoenixText}</b>.
//               </li>

//               <li>
//                 Watch <b>Live Bracket</b> + <b>Leaderboard</b> update as winners are set.
//               </li>
//             </ol>
//           </section>
//         </header>

//         <footer className="disclaimer">
//           Unofficial bracket competition. Not affiliated with AIA. Please DM @charlie.richards13 on IG
//           to report any bugs or issues. Good luck and have fun!
//         </footer>
//       </div>

//       <style jsx>{`
//         .wrap {
//           padding: 28px 18px 110px;
//           color: #fff;
//           display: flex;
//           justify-content: center;
//         }

//         .stage {
//           width: 100%;
//           max-width: 1120px;
//           position: relative;
//           border-radius: 22px;
//           overflow: hidden;
//           border: 1px solid rgba(255, 255, 255, 0.1);
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
//           background: radial-gradient(1200px 700px at 50% 10%, rgba(0,0,0,0), rgba(0,0,0,0.65));
//           pointer-events: none;
//         }

//         .hero {
//           position: relative;
//           padding: 22px;
//         }

//         .topRow {
//           display: grid;
//           grid-template-columns: 1fr auto;
//           gap: 18px;
//           align-items: start;
//         }

//         .brand {
//           display: flex;
//           gap: 14px;
//           align-items: flex-start;
//         }

//         .brandLogo {
//           width: 120px;
//           height: auto;
//           filter: drop-shadow(0 12px 22px rgba(0, 0, 0, 0.45));
//           border-radius: 10px;
//           background: rgba(255,255,255,0.06);
//           border: 1px solid rgba(255,255,255,0.10);
//           padding: 6px;
//         }

//         .brandText .title {
//           font-size: 22px;
//           font-weight: 780;
//           letter-spacing: 0.2px;
//           margin-bottom: 10px;
//         }

//         .aiaStripe {
//           height: 10px;
//           width: min(520px, 100%);
//           border-radius: 999px;
//           margin-bottom: 12px;
//           opacity: 0.95;
//           background: linear-gradient(
//             90deg,
//             #1f6db3 0%,
//             #1f6db3 62%,
//             #f2c230 62%,
//             #f2c230 78%,
//             #d6463a 78%,
//             #d6463a 100%
//           );
//           box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
//           border: 1px solid rgba(255,255,255,0.10);
//         }

//         .brandText .subtitle {
//           font-size: 16px;
//           line-height: 24px;
//           color: rgba(255, 255, 255, 0.80);
//           max-width: 860px;
//         }

//         .ballCol {
//           display: flex;
//           justify-content: flex-end;
//           padding-top: 6px;
//         }

//         .inAppBanner {
//           margin-top: 14px;
//           border: 1px solid rgba(255, 255, 255, 0.12);
//           border-radius: 18px;
//           background: rgba(0, 0, 0, 0.30);
//           padding: 14px 16px;
//           box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
//         }
//         .inAppTitle {
//           font-weight: 900;
//           letter-spacing: 0.2px;
//           margin-bottom: 6px;
//         }
//         .inAppText {
//           opacity: 0.82;
//           font-size: 13px;
//           line-height: 18px;
//         }
//         .inAppActions {
//           margin-top: 10px;
//           display: flex;
//           flex-wrap: wrap;
//           gap: 10px;
//         }

//         .panel {
//           margin-top: 16px;
//           border: 1px solid rgba(255, 255, 255, 0.12);
//           border-radius: 18px;
//           background: rgba(255, 255, 255, 0.04);
//           box-shadow: 0 18px 45px rgba(0, 0, 0, 0.35);
//           padding: 18px;
//         }

//         .cardsRow {
//           margin-top: 16px;
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 12px;
//         }

//         .cardsRow2 {
//           margin-top: 12px;
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 12px;
//         }

//         /* Arcade row styles */
//         .arcadeRow {
//           margin-top: 14px;
//         }
//         .arcadeCard {
//           border-radius: 18px;
//           border: 1px solid rgba(242, 194, 48, 0.35);
//           background: rgba(242, 194, 48, 0.07);
//           box-shadow: 0 14px 35px rgba(0, 0, 0, 0.30);
//           padding: 14px;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           gap: 12px;
//           flex-wrap: wrap;
//         }
//         .arcadeTitle {
//           font-weight: 900;
//           letter-spacing: 0.2px;
//           font-size: 16px;
//         }
//         .arcadeSub {
//           margin-top: 6px;
//           opacity: 0.80;
//           font-size: 13px;
//           line-height: 18px;
//           max-width: 760px;
//         }
//         .arcadeRight {
//           display: flex;
//           gap: 10px;
//           align-items: center;
//         }

//         /* ✅ NEW Props row styles */
//         .propsRow {
//           margin-top: 12px;
//         }
//         .propsCard {
//           border-radius: 18px;
//           border: 1px solid rgba(120, 180, 255, 0.35);
//           background: rgba(120, 180, 255, 0.07);
//           box-shadow: 0 14px 35px rgba(0, 0, 0, 0.30);
//           padding: 14px;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           gap: 12px;
//           flex-wrap: wrap;
//         }
//         .propsTitle {
//           font-weight: 900;
//           letter-spacing: 0.2px;
//           font-size: 16px;
//         }
//         .propsSub {
//           margin-top: 6px;
//           opacity: 0.80;
//           font-size: 13px;
//           line-height: 18px;
//           max-width: 760px;
//         }
//         .propsRight {
//           display: flex;
//           gap: 10px;
//           align-items: center;
//         }

//         .muted {
//           color: rgba(255, 255, 255, 0.72);
//         }

//         .who {
//           font-size: 18px;
//           font-weight: 780;
//           margin: 2px 0 2px;
//         }

//         .btnRow {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 10px;
//           align-items: center;
//           margin-top: 14px;
//         }

//         :global(.hbtn) {
//           border-radius: 12px;
//           padding: 11px 14px;
//           border: 1px solid rgba(255, 255, 255, 0.28);
//           text-decoration: none;
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           font-weight: 720;
//           cursor: pointer;
//           user-select: none;
//           transition: transform 120ms ease, background 120ms ease, border 120ms ease;
//           color: #fff;
//         }

//         :global(.hbtnBlue) {
//           background: rgba(31, 109, 179, 0.18);
//           border-color: rgba(31, 109, 179, 0.60);
//         }
//         :global(.hbtnGold) {
//           background: rgba(242, 194, 48, 0.14);
//           border-color: rgba(242, 194, 48, 0.60);
//         }
//         :global(.hbtnRed) {
//           background: rgba(214, 70, 58, 0.16);
//           border-color: rgba(214, 70, 58, 0.60);
//         }
//         :global(.hbtnGhost) {
//           background: rgba(0, 0, 0, 0.22);
//           color: rgba(255, 255, 255, 0.92);
//           border-color: rgba(255, 255, 255, 0.28);
//         }

//         /* ✅ Disabled button style */
//         :global(.hbtnDisabled) {
//           background: rgba(255, 255, 255, 0.08);
//           border-color: rgba(255, 255, 255, 0.22);
//           color: rgba(255, 255, 255, 0.70);
//           cursor: not-allowed;
//           opacity: 0.75;
//           transform: none !important;
//         }

//         :global(.hbtn:hover) {
//           transform: translateY(-1px);
//         }
//         :global(.hbtnDisabled:hover) {
//           transform: none;
//         }

//         .status {
//           margin-top: 12px;
//           color: rgba(183, 255, 183, 0.95);
//           font-size: 13px;
//           line-height: 18px;
//         }

//         .howToPlay {
//           margin-top: 14px;
//           border: 1px solid rgba(255, 255, 255, 0.10);
//           border-radius: 18px;
//           background: rgba(0, 0, 0, 0.18);
//           padding: 14px 16px;
//         }

//         .howTitle {
//           font-weight: 800;
//           letter-spacing: 0.2px;
//           margin-bottom: 8px;
//           color: rgba(255, 255, 255, 0.92);
//         }

//         .howList {
//           margin: 0;
//           padding-left: 18px;
//           color: rgba(255, 255, 255, 0.72);
//           line-height: 20px;
//           font-size: 13px;
//         }

//         .howList li {
//           margin: 6px 0;
//         }

//         .disclaimer {
//           margin-top: 14px;
//           padding: 12px 16px 18px;
//           text-align: center;
//           font-size: 12px;
//           line-height: 18px;
//           color: rgba(255, 255, 255, 0.55);
//           border-top: 1px solid rgba(255, 255, 255, 0.10);
//         }

//         @media (max-width: 920px) {
//           .topRow {
//             grid-template-columns: 1fr;
//           }
//           .ballCol {
//             justify-content: flex-start;
//           }
//           .cardsRow {
//             grid-template-columns: 1fr;
//           }
//           .cardsRow2 {
//             grid-template-columns: 1fr;
//           }
//         }
//       `}</style>
//     </main>
//   );
// }

// function InfoCard({
//   title,
//   icon,
//   lines,
//   accent,
//   badge,
//   action,
// }: {
//   title: string;
//   icon: string;
//   lines: string[];
//   accent: "green" | "blue";
//   badge?: { type: "live" | "done"; text: string } | null;
//   action?: ReactNode;
// }) {
//   const accentBorder =
//     accent === "green" ? "rgba(120,255,170,0.30)" : "rgba(120,180,255,0.30)";
//   const accentBg =
//     accent === "green" ? "rgba(120,255,170,0.07)" : "rgba(120,180,255,0.07)";

//   return (
//     <div className="icard">
//       <div className="ihead">
//         <div className="ititle">
//           <span className="icon">{icon}</span> {title}
//         </div>

//         {badge?.type === "live" ? (
//           <div className="pillLive" title="Games are live">
//             <span className="dot" /> {badge.text}
//           </div>
//         ) : badge?.type === "done" ? (
//           <div className="pillDone" title="Complete">
//             {badge.text}
//           </div>
//         ) : null}
//       </div>

//       <div className="ibody">
//         {lines.map((l, idx) => (
//           <div key={idx} className="iline">
//             {l}
//           </div>
//         ))}

//         {action ? <div className="iaction">{action}</div> : null}
//       </div>

//       <style jsx>{`
//         .icard {
//           border: 1px solid ${accentBorder};
//           background: ${accentBg};
//           border-radius: 18px;
//           padding: 14px;
//           box-shadow: 0 14px 35px rgba(0, 0, 0, 0.30);
//         }
//         .ihead {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 10px;
//           gap: 10px;
//         }
//         .ititle {
//           font-weight: 780;
//           letter-spacing: 0.2px;
//           display: flex;
//           align-items: center;
//           gap: 6px;
//         }
//         .ibody {
//           color: rgba(255, 255, 255, 0.80);
//           line-height: 20px;
//           font-size: 14px;
//         }
//         .iline {
//           margin-top: 6px;
//         }
//         .iline:first-child {
//           margin-top: 0;
//         }

//         .iaction {
//           margin-top: 12px;
//           display: flex;
//           justify-content: flex-start;
//         }

//         .pillLive {
//           display: inline-flex;
//           align-items: center;
//           gap: 8px;
//           padding: 6px 10px;
//           border-radius: 999px;
//           border: 1px solid rgba(255, 120, 120, 0.45);
//           background: rgba(255, 90, 90, 0.10);
//           color: rgba(255, 230, 230, 0.95);
//           font-weight: 900;
//           letter-spacing: 0.4px;
//           font-size: 12px;
//           white-space: nowrap;
//         }
//         .dot {
//           width: 8px;
//           height: 8px;
//           border-radius: 999px;
//           background: rgba(255, 90, 90, 0.95);
//           box-shadow: 0 0 14px rgba(255, 90, 90, 0.75);
//           animation: pulse 1.1s ease-in-out infinite;
//         }

//         .pillDone {
//           padding: 6px 10px;
//           border-radius: 999px;
//           border: 1px solid rgba(180, 210, 255, 0.35);
//           background: rgba(120, 180, 255, 0.10);
//           color: rgba(220, 235, 255, 0.95);
//           font-weight: 900;
//           letter-spacing: 0.4px;
//           font-size: 12px;
//           white-space: nowrap;
//         }

//         @keyframes pulse {
//           0%,
//           100% {
//             transform: scale(1);
//             opacity: 1;
//           }
//           50% {
//             transform: scale(1.35);
//             opacity: 0.75;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// function SpinningBasketball() {
//   return (
//     <div className="ballWrap" aria-hidden="true">
//       <div className="ball">
//         <svg viewBox="0 0 100 100" className="ballSvg">
//           <defs>
//             <radialGradient id="g" cx="30%" cy="30%" r="70%">
//               <stop offset="0%" stopColor="#ffb36b" stopOpacity="1" />
//               <stop offset="55%" stopColor="#e67e22" stopOpacity="1" />
//               <stop offset="100%" stopColor="#b85a14" stopOpacity="1" />
//             </radialGradient>
//           </defs>
//           <circle cx="50" cy="50" r="48" fill="url(#g)" />
//           <circle
//             cx="50"
//             cy="50"
//             r="48"
//             fill="none"
//             stroke="rgba(0,0,0,0.35)"
//             strokeWidth="2"
//           />
//           <path d="M50 2 v96" stroke="rgba(0,0,0,0.55)" strokeWidth="3" />
//           <path d="M2 50 h96" stroke="rgba(0,0,0,0.55)" strokeWidth="3" />
//           <path
//             d="M18 10 C40 30, 40 70, 18 90"
//             fill="none"
//             stroke="rgba(0,0,0,0.55)"
//             strokeWidth="3"
//           />
//           <path
//             d="M82 10 C60 30, 60 70, 82 90"
//             fill="none"
//             stroke="rgba(0,0,0,0.55)"
//             strokeWidth="3"
//           />
//         </svg>
//       </div>

//       <style jsx>{`
//         .ballWrap {
//           width: 120px;
//           height: 120px;
//           display: grid;
//           place-items: center;
//           filter: drop-shadow(0 14px 24px rgba(0, 0, 0, 0.45));
//         }
//         .ball {
//           width: 106px;
//           height: 106px;
//           border-radius: 999px;
//           animation: spin 2.8s linear infinite, floaty 3.2s ease-in-out infinite;
//           transform-origin: 50% 50%;
//         }
//         .ballSvg {
//           width: 100%;
//           height: 100%;
//           border-radius: 999px;
//           display: block;
//         }
//         @keyframes spin {
//           from {
//             transform: rotate(0deg);
//           }
//           to {
//             transform: rotate(360deg);
//           }
//         }
//         @keyframes floaty {
//           0%,
//           100% {
//             translate: 0 0;
//           }
//           50% {
//             translate: 0 -6px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// function formatCountdown(ms: number) {
//   const totalSeconds = Math.floor(ms / 1000);
//   const days = Math.floor(totalSeconds / 86400);
//   const hours = Math.floor((totalSeconds % 86400) / 3600);
//   const minutes = Math.floor((totalSeconds % 3600) / 60);
//   const seconds = totalSeconds % 60;
//   return { days, hours, minutes, seconds };
// }

// function formatPhoenix(d: Date) {
//   try {
//     return new Intl.DateTimeFormat("en-US", {
//       timeZone: "America/Phoenix",
//       dateStyle: "full",
//       timeStyle: "short",
//     }).format(d);
//   } catch {
//     return d.toLocaleString();
//   }
// }




// "use client";

// import { useEffect, useMemo, useState } from "react";
// import type { ReactNode } from "react";
// import Link from "next/link";
// import { auth } from "@/lib/firebase";
// import {
//   GoogleAuthProvider,
//   onAuthStateChanged,
//   signInWithPopup,
//   signOut,
//   User,
// } from "firebase/auth";

// // Phoenix is UTC-7 year-round (no DST)
// const TOURNAMENT_START_ISO = "2026-02-18T19:00:00-07:00";

// // Upcoming rounds
// const SEMIFINALS_ISO = "2026-03-04T20:00:00-07:00"; // Wed Mar 4 @ 8:00pm Phoenix
// const FINALS_ISO = "2026-03-07T20:00:00-07:00"; // Sat Mar 7 @ 8:00pm Phoenix

// // How long we consider a “game block” live after its start time.
// const GAME_BLOCK_DURATION_HOURS = 2;

// function isInAppBrowser() {
//   if (typeof navigator === "undefined") return false;
//   const ua = navigator.userAgent || "";
//   return (
//     /Snapchat/i.test(ua) ||
//     /Instagram/i.test(ua) ||
//     /FBAN|FBAV/i.test(ua) ||
//     /TikTok/i.test(ua)
//   );
// }

// function isIOS() {
//   if (typeof navigator === "undefined") return false;
//   const ua = navigator.userAgent || "";
//   return /iPhone|iPad|iPod/i.test(ua);
// }

// export default function HomePage() {
//   const [user, setUser] = useState<User | null>(null);
//   const [checking, setChecking] = useState(true);
//   const [status, setStatus] = useState("");

//   const tournamentStart = useMemo(() => new Date(TOURNAMENT_START_ISO), []);
//   const semifinals = useMemo(() => new Date(SEMIFINALS_ISO), []);
//   const finals = useMemo(() => new Date(FINALS_ISO), []);

//   const [mounted, setMounted] = useState(false);
//   const [now, setNow] = useState(0);

//   const [inApp, setInApp] = useState(false);
//   const [copied, setCopied] = useState(false);

//   useEffect(() => {
//     setInApp(isInAppBrowser());
//   }, []);

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (u) => {
//       setUser(u);
//       setChecking(false);
//     });
//     return () => unsub();
//   }, []);

//   useEffect(() => {
//     setMounted(true);
//     setNow(Date.now());
//     const t = setInterval(() => setNow(Date.now()), 1000);
//     return () => clearInterval(t);
//   }, []);

//   const nowMs = mounted ? now : Date.now();
//   const durMs = GAME_BLOCK_DURATION_HOURS * 60 * 60 * 1000;

//   const tournamentStartPhoenixText = useMemo(
//     () => (mounted ? formatPhoenix(tournamentStart) : "Loading…"),
//     [mounted, tournamentStart]
//   );

//   const semifinalsPhoenixText = useMemo(
//     () => (mounted ? formatPhoenix(semifinals) : "Loading…"),
//     [mounted, semifinals]
//   );

//   const finalsPhoenixText = useMemo(
//     () => (mounted ? formatPhoenix(finals) : "Loading…"),
//     [mounted, finals]
//   );

//   // Semifinals card
//   const semiStartMs = semifinals.getTime();
//   const semiEndMs = semiStartMs + durMs;
//   const semiLive = nowMs >= semiStartMs && nowMs < semiEndMs;
//   const semiDone = nowMs >= semiEndMs;

//   const semiDiffMs = semiStartMs - nowMs;
//   const semiSafeMs = Math.max(0, semiDiffMs);
//   const semiCd = formatCountdown(semiSafeMs);

//   const semiClockText = mounted
//     ? `${semiCd.days}d ${semiCd.hours}h ${semiCd.minutes}m ${semiCd.seconds}s`
//     : "Loading countdown…";

//   const semifinalsBadge = semiLive
//     ? ({ type: "live", text: "LIVE" } as const)
//     : semiDone
//     ? ({ type: "done", text: "DONE" } as const)
//     : null;

//   const semifinalsLines = semiDone
//     ? [`Semifinals (Phoenix): ${semifinalsPhoenixText}`, "Semifinals are complete."]
//     : semiLive
//     ? [
//         "Semifinals are LIVE right now.",
//         `Started (Phoenix): ${formatPhoenix(semifinals)}`,
//         `Approx. end (Phoenix): ${formatPhoenix(new Date(semiEndMs))}`,
//       ]
//     : [`Semifinals (Phoenix): ${semifinalsPhoenixText}`, semiClockText];

//   // Finals card
//   const finalsStartMs = finals.getTime();
//   const finalsEndMs = finalsStartMs + durMs;
//   const finalsLive = nowMs >= finalsStartMs && nowMs < finalsEndMs;
//   const finalsDone = nowMs >= finalsEndMs;

//   const finalsDiffMs = finalsStartMs - nowMs;
//   const finalsSafeMs = Math.max(0, finalsDiffMs);
//   const finalsCd = formatCountdown(finalsSafeMs);

//   const finalsClockText = mounted
//     ? `${finalsCd.days}d ${finalsCd.hours}h ${finalsCd.minutes}m ${finalsCd.seconds}s`
//     : "Loading countdown…";

//   const finalsBadge = finalsLive
//     ? ({ type: "live", text: "LIVE" } as const)
//     : finalsDone
//     ? ({ type: "done", text: "COMPLETE" } as const)
//     : null;

//   const finalsLines = finalsDone
//     ? [`Finals (Phoenix): ${finalsPhoenixText}`, "Tournament complete."]
//     : finalsLive
//     ? [
//         "Finals are LIVE right now.",
//         `Started (Phoenix): ${formatPhoenix(finals)}`,
//         `Approx. end (Phoenix): ${formatPhoenix(new Date(finalsEndMs))}`,
//       ]
//     : [`Finals (Phoenix): ${finalsPhoenixText}`, finalsClockText];

//   // Auth actions
//   async function doGoogleSignIn() {
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

//   async function copyLink() {
//     try {
//       const url =
//         typeof window !== "undefined" ? window.location.href : "https://azroadtoopen.com";
//       await navigator.clipboard.writeText(url);
//       setCopied(true);
//       setStatus("Link copied! Paste it into Safari/Chrome.");
//       setTimeout(() => setCopied(false), 1600);
//     } catch {
//       setStatus("Could not copy link here. Try selecting the URL and copying manually.");
//     }
//   }

//   const inAppHelpText = useMemo(() => {
//     if (!inApp) return null;
//     const ios = isIOS();
//     return ios
//       ? `You're in an in-app browser (Snap/IG). Sign-in is disabled here. Tap “Open in Browser”. If it doesn’t open with one tap, press-and-hold the button/link and choose “Open in Safari”, or use the Share icon → “Open in Safari”.`
//       : `You're in an in-app browser (Snap/IG). Sign-in is disabled here. Tap “Open in Browser”. If it doesn’t open with one tap, press-and-hold the button/link and choose “Open in browser” (Chrome).`;
//   }, [inApp]);

//   const tournamentStarted = nowMs >= tournamentStart.getTime();

//   return (
//     <main className="wrap">
//       <div className="stage">
//         <div className="bgSpotlights" aria-hidden="true" />
//         <div className="bgVignette" aria-hidden="true" />

//         <header className="hero">
//           <div className="topRow">
//             <div className="brand">
//               <img
//                 className="brandLogo"
//                 src="/brand/azroadtoopen.png"
//                 alt="AZ Road to Open"
//                 onError={(e) => {
//                   (e.currentTarget as HTMLImageElement).style.display = "none";
//                 }}
//               />

//               <div className="brandText">
//                 <div className="title">AZ Road to Open Tournament Competition</div>

//                 <div className="aiaStripe" aria-hidden="true" />

//                 <div className="subtitle">
//                   Predict the matchups between the top teams in Arizona high school basketball,
//                   and who will take home the trophy. Fill out your bracket and compete against
//                   others to see who can have the most accurate bracket.
//                 </div>
//               </div>
//             </div>

//             <div className="ballCol">
//               <SpinningBasketball />
//             </div>
//           </div>

//           {inApp ? (
//             <section className="inAppBanner">
//               <div className="inAppTitle">⚠️ In-app browser detected</div>
//               <div className="inAppText">{inAppHelpText}</div>

//               <div className="inAppActions">
//                 <a
//                   className="hbtn hbtnBlue"
//                   href="https://azroadtoopen.com"
//                   target="_blank"
//                   rel="noreferrer"
//                   title="Open in a full browser"
//                 >
//                   Open in Browser
//                 </a>

//                 <button className="hbtn hbtnGhost" onClick={copyLink}>
//                   {copied ? "Copied!" : "Copy Link"}
//                 </button>
//               </div>
//             </section>
//           ) : null}

//           <section className="panel">
//             {checking ? (
//               <div className="muted">Loading…</div>
//             ) : user ? (
//               <>
//                 <div className="signedIn">
//                   <div className="muted">Signed in as</div>
//                   <div className="who">{user.displayName ?? user.email ?? "User"}</div>
//                   {user.email ? <div className="muted">{user.email}</div> : null}
//                 </div>

//                 <div className="btnRow">
//                   <Link className="hbtn hbtnBlue" href="/my-bracket">
//                     My Bracket
//                   </Link>

//                   <Link className="hbtn hbtnGold" href="/bracket">
//                     Live Bracket
//                   </Link>

//                   <Link className="hbtn hbtnRed" href="/leaderboard">
//                     Leaderboard
//                   </Link>

//                   <button className="hbtn hbtnGhost" onClick={doSignOut}>
//                     Sign out
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div className="signedOut">
//                   <div className="muted">
//                     Sign in to create and submit your bracket. Once submitted, it locks.
//                   </div>
//                 </div>

//                 <div className="btnRow">
//                   {inApp ? null : (
//                     <button className="hbtn hbtnBlue" onClick={doGoogleSignIn}>
//                       Sign in with Google
//                     </button>
//                   )}

//                   <Link className="hbtn hbtnGold" href="/bracket">
//                     View Live Bracket
//                   </Link>

//                   <Link className="hbtn hbtnRed" href="/leaderboard">
//                     View Leaderboard
//                   </Link>
//                 </div>

//                 {inApp ? (
//                   <div className="muted" style={{ marginTop: 10, fontSize: 13, lineHeight: "18px" }}>
//                     Sign-in is disabled inside this browser to avoid errors. Please use{" "}
//                     <b>Open in Browser</b>.
//                   </div>
//                 ) : null}
//               </>
//             )}

//             {status ? <div className="status">{status}</div> : null}
//           </section>

//           <section className="arcadeRow">
//             <div className="arcadeCard">
//               <div className="arcadeLeft">
//                 <div className="arcadeTitle">🎮 Arcade</div>
//                 <div className="arcadeSub">
//                   Arcade games are getting upgraded for the next release.
//                 </div>
//               </div>

//               <div className="arcadeRight">
//                 <button className="hbtn hbtnDisabled" disabled title="Coming soon">
//                   Coming Soon
//                 </button>
//               </div>
//             </div>
//           </section>

//           <section className="propsRow">
//             <div className="propsCard">
//               <div className="propsLeft">
//                 <div className="propsTitle">📊 Player Props (Over/Under)</div>
//                 <div className="propsSub">
//                   Make over/under predictions on featured players in the finals. Points, rebounds,
//                   assists, and more! Player props are optional and scored separately from the main
//                   bracket.
//                 </div>
//               </div>

//               <div className="propsRight">
//                 <Link className="hbtn hbtnBlue" href="/player-props">
//                   Go to Player Props →
//                 </Link>
//               </div>
//             </div>
//           </section>

//           <div className="cardsRow">
//             <InfoCard
//               title="Semifinals Countdown"
//               icon="🕒"
//               accent="green"
//               badge={semifinalsBadge}
//               lines={semifinalsLines}
//             />

//             <InfoCard
//               title="Finals Countdown"
//               icon="🏆"
//               accent="green"
//               badge={finalsBadge}
//               lines={finalsLines}
//             />
//           </div>

//           <div className="cardsRow2">
//             <InfoCard
//               title="Scoring"
//               icon="🏀"
//               accent="blue"
//               lines={[
//                 "Round 1 = 1 point per correct pick",
//                 "Round 2 = 2 points",
//                 "Round 3 = 4 points",
//                 "Round 4 = 8 points",
//                 "Final = 16 points",
//               ]}
//             />

//             <InfoCard
//               title="News"
//               icon="📰"
//               accent="blue"
//               lines={["Updates, photos, announcements, and important changes will be posted here."]}
//               action={
//                 <Link className="hbtn hbtnBlue" href="/news">
//                   News
//                 </Link>
//               }
//             />
//           </div>

//           <section className="howToPlay">
//             <div className="howTitle">How to play</div>
//             <ol className="howList">
//               <li>
//                 Go to <b>My Bracket</b> and pick winners (later rounds auto-fill).
//               </li>

//               <li>
//                 {tournamentStarted ? (
//                   <>
//                     Brackets are locked (tournament started on <b>{tournamentStartPhoenixText}</b>).
//                   </>
//                 ) : (
//                   <>
//                     Hit <b>Submit Bracket</b> to lock your picks before tip-off:{" "}
//                     <b>{tournamentStartPhoenixText}</b>.
//                   </>
//                 )}
//               </li>

//               <li>
//                 Semifinals tip-off: <b>{semifinalsPhoenixText}</b>. Finals tip-off:{" "}
//                 <b>{finalsPhoenixText}</b>.
//               </li>

//               <li>
//                 Watch <b>Live Bracket</b> + <b>Leaderboard</b> update as winners are set.
//               </li>
//             </ol>
//           </section>
//         </header>

//         <footer className="disclaimer">
//           Unofficial bracket competition. Not affiliated with AIA. Please DM @charlie.richards13 on
//           IG to report any bugs or issues. Good luck and have fun!
//         </footer>
//       </div>

//       <style jsx>{`
//         .wrap {
//           padding: 28px 18px 110px;
//           color: #fff;
//           display: flex;
//           justify-content: center;
//         }

//         .stage {
//           width: 100%;
//           max-width: 1120px;
//           position: relative;
//           border-radius: 22px;
//           overflow: hidden;
//           border: 1px solid rgba(255, 255, 255, 0.1);
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
//           background: radial-gradient(1200px 700px at 50% 10%, rgba(0,0,0,0), rgba(0,0,0,0.65));
//           pointer-events: none;
//         }

//         .hero {
//           position: relative;
//           padding: 22px;
//         }

//         .topRow {
//           display: grid;
//           grid-template-columns: 1fr auto;
//           gap: 18px;
//           align-items: start;
//         }

//         .brand {
//           display: flex;
//           gap: 14px;
//           align-items: flex-start;
//         }

//         .brandLogo {
//           width: 120px;
//           height: auto;
//           filter: drop-shadow(0 12px 22px rgba(0, 0, 0, 0.45));
//           border-radius: 10px;
//           background: rgba(255,255,255,0.06);
//           border: 1px solid rgba(255,255,255,0.10);
//           padding: 6px;
//         }

//         .brandText .title {
//           font-size: 22px;
//           font-weight: 780;
//           letter-spacing: 0.2px;
//           margin-bottom: 10px;
//         }

//         .aiaStripe {
//           height: 10px;
//           width: min(520px, 100%);
//           border-radius: 999px;
//           margin-bottom: 12px;
//           opacity: 0.95;
//           background: linear-gradient(
//             90deg,
//             #1f6db3 0%,
//             #1f6db3 62%,
//             #f2c230 62%,
//             #f2c230 78%,
//             #d6463a 78%,
//             #d6463a 100%
//           );
//           box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
//           border: 1px solid rgba(255,255,255,0.10);
//         }

//         .brandText .subtitle {
//           font-size: 16px;
//           line-height: 24px;
//           color: rgba(255, 255, 255, 0.80);
//           max-width: 860px;
//         }

//         .ballCol {
//           display: flex;
//           justify-content: flex-end;
//           padding-top: 6px;
//         }

//         .inAppBanner {
//           margin-top: 14px;
//           border: 1px solid rgba(255, 255, 255, 0.12);
//           border-radius: 18px;
//           background: rgba(0, 0, 0, 0.30);
//           padding: 14px 16px;
//           box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
//         }
//         .inAppTitle {
//           font-weight: 900;
//           letter-spacing: 0.2px;
//           margin-bottom: 6px;
//         }
//         .inAppText {
//           opacity: 0.82;
//           font-size: 13px;
//           line-height: 18px;
//         }
//         .inAppActions {
//           margin-top: 10px;
//           display: flex;
//           flex-wrap: wrap;
//           gap: 10px;
//         }

//         .panel {
//           margin-top: 16px;
//           border: 1px solid rgba(255, 255, 255, 0.12);
//           border-radius: 18px;
//           background: rgba(255, 255, 255, 0.04);
//           box-shadow: 0 18px 45px rgba(0, 0, 0, 0.35);
//           padding: 18px;
//         }

//         .cardsRow {
//           margin-top: 16px;
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 12px;
//         }

//         .cardsRow2 {
//           margin-top: 12px;
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 12px;
//         }

//         .arcadeRow {
//           margin-top: 14px;
//         }
//         .arcadeCard {
//           border-radius: 18px;
//           border: 1px solid rgba(242, 194, 48, 0.35);
//           background: rgba(242, 194, 48, 0.07);
//           box-shadow: 0 14px 35px rgba(0, 0, 0, 0.30);
//           padding: 14px;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           gap: 12px;
//           flex-wrap: wrap;
//         }
//         .arcadeTitle {
//           font-weight: 900;
//           letter-spacing: 0.2px;
//           font-size: 16px;
//         }
//         .arcadeSub {
//           margin-top: 6px;
//           opacity: 0.80;
//           font-size: 13px;
//           line-height: 18px;
//           max-width: 760px;
//         }
//         .arcadeRight {
//           display: flex;
//           gap: 10px;
//           align-items: center;
//         }

//         .propsRow {
//           margin-top: 12px;
//         }
//         .propsCard {
//           border-radius: 18px;
//           border: 1px solid rgba(120, 180, 255, 0.35);
//           background: rgba(120, 180, 255, 0.07);
//           box-shadow: 0 14px 35px rgba(0, 0, 0, 0.30);
//           padding: 14px;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           gap: 12px;
//           flex-wrap: wrap;
//         }
//         .propsTitle {
//           font-weight: 900;
//           letter-spacing: 0.2px;
//           font-size: 16px;
//         }
//         .propsSub {
//           margin-top: 6px;
//           opacity: 0.80;
//           font-size: 13px;
//           line-height: 18px;
//           max-width: 760px;
//         }
//         .propsRight {
//           display: flex;
//           gap: 10px;
//           align-items: center;
//         }

//         .muted {
//           color: rgba(255, 255, 255, 0.72);
//         }

//         .who {
//           font-size: 18px;
//           font-weight: 780;
//           margin: 2px 0 2px;
//         }

//         .btnRow {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 10px;
//           align-items: center;
//           margin-top: 14px;
//         }

//         :global(.hbtn) {
//           border-radius: 12px;
//           padding: 11px 14px;
//           border: 1px solid rgba(255, 255, 255, 0.28);
//           text-decoration: none;
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           font-weight: 720;
//           cursor: pointer;
//           user-select: none;
//           transition: transform 120ms ease, background 120ms ease, border 120ms ease;
//           color: #fff;
//         }

//         :global(.hbtnBlue) {
//           background: rgba(31, 109, 179, 0.18);
//           border-color: rgba(31, 109, 179, 0.60);
//         }
//         :global(.hbtnGold) {
//           background: rgba(242, 194, 48, 0.14);
//           border-color: rgba(242, 194, 48, 0.60);
//         }
//         :global(.hbtnRed) {
//           background: rgba(214, 70, 58, 0.16);
//           border-color: rgba(214, 70, 58, 0.60);
//         }
//         :global(.hbtnGhost) {
//           background: rgba(0, 0, 0, 0.22);
//           color: rgba(255, 255, 255, 0.92);
//           border-color: rgba(255, 255, 255, 0.28);
//         }

//         :global(.hbtnDisabled) {
//           background: rgba(255, 255, 255, 0.08);
//           border-color: rgba(255, 255, 255, 0.22);
//           color: rgba(255, 255, 255, 0.70);
//           cursor: not-allowed;
//           opacity: 0.75;
//           transform: none !important;
//         }

//         :global(.hbtn:hover) {
//           transform: translateY(-1px);
//         }
//         :global(.hbtnDisabled:hover) {
//           transform: none;
//         }

//         .status {
//           margin-top: 12px;
//           color: rgba(183, 255, 183, 0.95);
//           font-size: 13px;
//           line-height: 18px;
//         }

//         .howToPlay {
//           margin-top: 14px;
//           border: 1px solid rgba(255, 255, 255, 0.10);
//           border-radius: 18px;
//           background: rgba(0, 0, 0, 0.18);
//           padding: 14px 16px;
//         }

//         .howTitle {
//           font-weight: 800;
//           letter-spacing: 0.2px;
//           margin-bottom: 8px;
//           color: rgba(255, 255, 255, 0.92);
//         }

//         .howList {
//           margin: 0;
//           padding-left: 18px;
//           color: rgba(255, 255, 255, 0.72);
//           line-height: 20px;
//           font-size: 13px;
//         }

//         .howList li {
//           margin: 6px 0;
//         }

//         .disclaimer {
//           margin-top: 14px;
//           padding: 12px 16px 18px;
//           text-align: center;
//           font-size: 12px;
//           line-height: 18px;
//           color: rgba(255, 255, 255, 0.55);
//           border-top: 1px solid rgba(255, 255, 255, 0.10);
//         }

//         @media (max-width: 920px) {
//           .topRow {
//             grid-template-columns: 1fr;
//           }
//           .ballCol {
//             justify-content: flex-start;
//           }
//           .cardsRow {
//             grid-template-columns: 1fr;
//           }
//           .cardsRow2 {
//             grid-template-columns: 1fr;
//           }
//         }
//       `}</style>
//     </main>
//   );
// }

// function InfoCard({
//   title,
//   icon,
//   lines,
//   accent,
//   badge,
//   action,
// }: {
//   title: string;
//   icon: string;
//   lines: string[];
//   accent: "green" | "blue";
//   badge?: { type: "live" | "done"; text: string } | null;
//   action?: ReactNode;
// }) {
//   const accentBorder =
//     accent === "green" ? "rgba(120,255,170,0.30)" : "rgba(120,180,255,0.30)";
//   const accentBg =
//     accent === "green" ? "rgba(120,255,170,0.07)" : "rgba(120,180,255,0.07)";

//   return (
//     <div className="icard">
//       <div className="ihead">
//         <div className="ititle">
//           <span className="icon">{icon}</span> {title}
//         </div>

//         {badge?.type === "live" ? (
//           <div className="pillLive" title="Games are live">
//             <span className="dot" /> {badge.text}
//           </div>
//         ) : badge?.type === "done" ? (
//           <div className="pillDone" title="Complete">
//             {badge.text}
//           </div>
//         ) : null}
//       </div>

//       <div className="ibody">
//         {lines.map((l, idx) => (
//           <div key={idx} className="iline">
//             {l}
//           </div>
//         ))}

//         {action ? <div className="iaction">{action}</div> : null}
//       </div>

//       <style jsx>{`
//         .icard {
//           border: 1px solid ${accentBorder};
//           background: ${accentBg};
//           border-radius: 18px;
//           padding: 14px;
//           box-shadow: 0 14px 35px rgba(0, 0, 0, 0.30);
//         }
//         .ihead {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 10px;
//           gap: 10px;
//         }
//         .ititle {
//           font-weight: 780;
//           letter-spacing: 0.2px;
//           display: flex;
//           align-items: center;
//           gap: 6px;
//         }
//         .ibody {
//           color: rgba(255, 255, 255, 0.80);
//           line-height: 20px;
//           font-size: 14px;
//         }
//         .iline {
//           margin-top: 6px;
//         }
//         .iline:first-child {
//           margin-top: 0;
//         }

//         .iaction {
//           margin-top: 12px;
//           display: flex;
//           justify-content: flex-start;
//         }

//         .pillLive {
//           display: inline-flex;
//           align-items: center;
//           gap: 8px;
//           padding: 6px 10px;
//           border-radius: 999px;
//           border: 1px solid rgba(255, 120, 120, 0.45);
//           background: rgba(255, 90, 90, 0.10);
//           color: rgba(255, 230, 230, 0.95);
//           font-weight: 900;
//           letter-spacing: 0.4px;
//           font-size: 12px;
//           white-space: nowrap;
//         }
//         .dot {
//           width: 8px;
//           height: 8px;
//           border-radius: 999px;
//           background: rgba(255, 90, 90, 0.95);
//           box-shadow: 0 0 14px rgba(255, 90, 90, 0.75);
//           animation: pulse 1.1s ease-in-out infinite;
//         }

//         .pillDone {
//           padding: 6px 10px;
//           border-radius: 999px;
//           border: 1px solid rgba(180, 210, 255, 0.35);
//           background: rgba(120, 180, 255, 0.10);
//           color: rgba(220, 235, 255, 0.95);
//           font-weight: 900;
//           letter-spacing: 0.4px;
//           font-size: 12px;
//           white-space: nowrap;
//         }

//         @keyframes pulse {
//           0%,
//           100% {
//             transform: scale(1);
//             opacity: 1;
//           }
//           50% {
//             transform: scale(1.35);
//             opacity: 0.75;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// function SpinningBasketball() {
//   return (
//     <div className="ballWrap" aria-hidden="true">
//       <div className="ball">
//         <svg viewBox="0 0 100 100" className="ballSvg">
//           <defs>
//             <radialGradient id="g" cx="30%" cy="30%" r="70%">
//               <stop offset="0%" stopColor="#ffb36b" stopOpacity="1" />
//               <stop offset="55%" stopColor="#e67e22" stopOpacity="1" />
//               <stop offset="100%" stopColor="#b85a14" stopOpacity="1" />
//             </radialGradient>
//           </defs>
//           <circle cx="50" cy="50" r="48" fill="url(#g)" />
//           <circle
//             cx="50"
//             cy="50"
//             r="48"
//             fill="none"
//             stroke="rgba(0,0,0,0.35)"
//             strokeWidth="2"
//           />
//           <path d="M50 2 v96" stroke="rgba(0,0,0,0.55)" strokeWidth="3" />
//           <path d="M2 50 h96" stroke="rgba(0,0,0,0.55)" strokeWidth="3" />
//           <path
//             d="M18 10 C40 30, 40 70, 18 90"
//             fill="none"
//             stroke="rgba(0,0,0,0.55)"
//             strokeWidth="3"
//           />
//           <path
//             d="M82 10 C60 30, 60 70, 82 90"
//             fill="none"
//             stroke="rgba(0,0,0,0.55)"
//             strokeWidth="3"
//           />
//         </svg>
//       </div>

//       <style jsx>{`
//         .ballWrap {
//           width: 120px;
//           height: 120px;
//           display: grid;
//           place-items: center;
//           filter: drop-shadow(0 14px 24px rgba(0, 0, 0, 0.45));
//         }
//         .ball {
//           width: 106px;
//           height: 106px;
//           border-radius: 999px;
//           animation: spin 2.8s linear infinite, floaty 3.2s ease-in-out infinite;
//           transform-origin: 50% 50%;
//         }
//         .ballSvg {
//           width: 100%;
//           height: 100%;
//           border-radius: 999px;
//           display: block;
//         }
//         @keyframes spin {
//           from {
//             transform: rotate(0deg);
//           }
//           to {
//             transform: rotate(360deg);
//           }
//         }
//         @keyframes floaty {
//           0%,
//           100% {
//             translate: 0 0;
//           }
//           50% {
//             translate: 0 -6px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// function formatCountdown(ms: number) {
//   const totalSeconds = Math.floor(ms / 1000);
//   const days = Math.floor(totalSeconds / 86400);
//   const hours = Math.floor((totalSeconds % 86400) / 3600);
//   const minutes = Math.floor((totalSeconds % 3600) / 60);
//   const seconds = totalSeconds % 60;
//   return { days, hours, minutes, seconds };
// }

// function formatPhoenix(d: Date) {
//   try {
//     return new Intl.DateTimeFormat("en-US", {
//       timeZone: "America/Phoenix",
//       dateStyle: "full",
//       timeStyle: "short",
//     }).format(d);
//   } catch {
//     return d.toLocaleString();
//   }
// }


// final version of home page after tourney concluded
// app created by charles richards 2026 ASU cs student


"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";

const TOURNAMENT_START_ISO = "2026-02-18T19:00:00-07:00";
const SEMIFINALS_ISO = "2026-03-04T20:00:00-07:00";
const FINALS_ISO = "2026-03-07T20:00:00-07:00";
const GAME_BLOCK_DURATION_HOURS = 2;

function isInAppBrowser() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return (
    /Snapchat/i.test(ua) ||
    /Instagram/i.test(ua) ||
    /FBAN|FBAV/i.test(ua) ||
    /TikTok/i.test(ua)
  );
}

function isIOS() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return /iPhone|iPad|iPod/i.test(ua);
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const [status, setStatus] = useState("");

  const tournamentStart = useMemo(() => new Date(TOURNAMENT_START_ISO), []);
  const semifinals = useMemo(() => new Date(SEMIFINALS_ISO), []);
  const finals = useMemo(() => new Date(FINALS_ISO), []);

  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(0);

  const [inApp, setInApp] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setInApp(isInAppBrowser());
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setChecking(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    setMounted(true);
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const nowMs = mounted ? now : Date.now();
  const durMs = GAME_BLOCK_DURATION_HOURS * 60 * 60 * 1000;

  const tournamentStartPhoenixText = useMemo(
    () => (mounted ? formatPhoenix(tournamentStart) : "Loading…"),
    [mounted, tournamentStart]
  );

  const semifinalsPhoenixText = useMemo(
    () => (mounted ? formatPhoenix(semifinals) : "Loading…"),
    [mounted, semifinals]
  );

  const finalsPhoenixText = useMemo(
    () => (mounted ? formatPhoenix(finals) : "Loading…"),
    [mounted, finals]
  );

  const semiStartMs = semifinals.getTime();
  const semiEndMs = semiStartMs + durMs;
  const semiLive = nowMs >= semiStartMs && nowMs < semiEndMs;
  const semiDone = nowMs >= semiEndMs;

  const semiDiffMs = semiStartMs - nowMs;
  const semiSafeMs = Math.max(0, semiDiffMs);
  const semiCd = formatCountdown(semiSafeMs);

  const semiClockText = mounted
    ? `${semiCd.days}d ${semiCd.hours}h ${semiCd.minutes}m ${semiCd.seconds}s`
    : "Loading countdown…";

  const semifinalsBadge = semiLive
    ? ({ type: "live", text: "LIVE" } as const)
    : semiDone
      ? ({ type: "done", text: "DONE" } as const)
      : null;

  const semifinalsLines = semiDone
    ? [`Semifinals (Phoenix): ${semifinalsPhoenixText}`, "Semifinals are complete."]
    : semiLive
      ? [
          "Semifinals are LIVE right now.",
          `Started (Phoenix): ${formatPhoenix(semifinals)}`,
          `Approx. end (Phoenix): ${formatPhoenix(new Date(semiEndMs))}`,
        ]
      : [`Semifinals (Phoenix): ${semifinalsPhoenixText}`, semiClockText];

  const finalsStartMs = finals.getTime();
  const finalsEndMs = finalsStartMs + durMs;
  const finalsLive = nowMs >= finalsStartMs && nowMs < finalsEndMs;
  const finalsDone = nowMs >= finalsEndMs;

  const finalsDiffMs = finalsStartMs - nowMs;
  const finalsSafeMs = Math.max(0, finalsDiffMs);
  const finalsCd = formatCountdown(finalsSafeMs);

  const finalsClockText = mounted
    ? `${finalsCd.days}d ${finalsCd.hours}h ${finalsCd.minutes}m ${finalsCd.seconds}s`
    : "Loading countdown…";

  const finalsBadge = finalsLive
    ? ({ type: "live", text: "LIVE" } as const)
    : finalsDone
      ? ({ type: "done", text: "COMPLETE" } as const)
      : null;

  const finalsLines = finalsDone
    ? [`Finals (Phoenix): ${finalsPhoenixText}`, "Sunnyslope wins the championship! Congrats to all the teams on an amazing season. Thanks for playing!"]
    : finalsLive
      ? [
          "Finals are LIVE right now.",
          `Started (Phoenix): ${formatPhoenix(finals)}`,
          `Approx. end (Phoenix): ${formatPhoenix(new Date(finalsEndMs))}`,
        ]
      : [`Finals (Phoenix): ${finalsPhoenixText}`, finalsClockText];

  async function doGoogleSignIn() {
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

  async function copyLink() {
    try {
      const url =
        typeof window !== "undefined" ? window.location.href : "https://azroadtoopen.com";
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setStatus("Link copied! Paste it into Safari/Chrome.");
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setStatus("Could not copy link here. Try selecting the URL and copying manually.");
    }
  }

  const inAppHelpText = useMemo(() => {
    if (!inApp) return null;
    const ios = isIOS();
    return ios
      ? `You're in an in-app browser (Snap/IG). Sign-in is disabled here. Tap “Open in Browser”. If it doesn’t open with one tap, press-and-hold the button/link and choose “Open in Safari”, or use the Share icon → “Open in Safari”.`
      : `You're in an in-app browser (Snap/IG). Sign-in is disabled here. Tap “Open in Browser”. If it doesn’t open with one tap, press-and-hold the button/link and choose “Open in browser” (Chrome).`;
  }, [inApp]);

  const tournamentStarted = nowMs >= tournamentStart.getTime();

  return (
    <main className="wrap">
      <div className="stage">
        <div className="bgSpotlights" aria-hidden="true" />
        <div className="bgVignette" aria-hidden="true" />

        <header className="hero">
          <div className="topRow">
            <div className="brand">
              <img
                className="brandLogo"
                src="/brand/azroadtoopen.png"
                alt="AZ Road to Open"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />

              <div className="brandText">
                <div className="title">AZ Road to Open Tournament Competition</div>

                <div className="aiaStripe" aria-hidden="true" />

                <div className="subtitle">
                  Predict the matchups between the top teams in Arizona high school basketball,
                  and who will take home the trophy. Fill out your bracket and compete against
                  others to see who can have the most accurate bracket.
                </div>
              </div>
            </div>

            <div className="ballCol">
              <SpinningBasketball />
            </div>
          </div>

          {inApp ? (
            <section className="inAppBanner">
              <div className="inAppTitle">⚠️ In-app browser detected</div>
              <div className="inAppText">{inAppHelpText}</div>

              <div className="inAppActions">
                <a
                  className="hbtn hbtnBlue"
                  href="https://azroadtoopen.com"
                  target="_blank"
                  rel="noreferrer"
                  title="Open in a full browser"
                >
                  Open in Browser
                </a>

                <button className="hbtn hbtnGhost" onClick={copyLink}>
                  {copied ? "Copied!" : "Copy Link"}
                </button>
              </div>
            </section>
          ) : null}

          <section className="panel">
            {checking ? (
              <div className="muted">Loading…</div>
            ) : user ? (
              <>
                <div className="signedIn">
                  <div className="muted">Signed in as</div>
                  <div className="who">{user.displayName ?? user.email ?? "User"}</div>
                  {user.email ? <div className="muted">{user.email}</div> : null}
                </div>

                <div className="btnRow">
                  <Link className="hbtn hbtnBlue" href="/my-bracket">
                    My Bracket
                  </Link>

                  <Link className="hbtn hbtnGold" href="/bracket">
                    Live Bracket
                  </Link>

                  <Link className="hbtn hbtnRed" href="/leaderboard">
                    Leaderboard
                  </Link>

                  <button className="hbtn hbtnGhost" onClick={doSignOut}>
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="signedOut">
                  <div className="muted">
                    Sign in to create and submit your bracket. Once submitted, it locks.
                  </div>
                </div>

                <div className="btnRow">
                  {inApp ? null : (
                    <button className="hbtn hbtnBlue" onClick={doGoogleSignIn}>
                      Sign in with Google
                    </button>
                  )}

                  <Link className="hbtn hbtnGold" href="/bracket">
                    View Live Bracket
                  </Link>

                  <Link className="hbtn hbtnRed" href="/leaderboard">
                    View Leaderboard
                  </Link>
                </div>

                {inApp ? (
                  <div className="muted" style={{ marginTop: 10, fontSize: 13, lineHeight: "18px" }}>
                    Sign-in is disabled inside this browser to avoid errors. Please use{" "}
                    <b>Open in Browser</b>.
                  </div>
                ) : null}
              </>
            )}

            {status ? <div className="status">{status}</div> : null}
          </section>

          <section className="shoutoutRow">
            <div className="shoutoutCard">
              <div className="shoutoutLeft">
                <div className="shoutoutTitle">🏆 Community Shoutout</div>
                <div className="shoutoutSub">
                  Huge shoutout to <b>Ronan O&apos;Brien</b>, <b>Luke Nigro</b>, and{" "}
                  <b>Dejuan Davis Criner</b> for their elite picking so far. Thank you to everyone
                  who participated and made this competition fun. Got an idea for a future sports,
                  web, or app project?{" "}
                  <a
                    className="inlineLink"
                    href="https://www.instagram.com/charlie.richards13/?hl=en"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Hit me up on Instagram
                  </a>
                  .
                </div>
              </div>

              <div className="shoutoutRight">
                <a
                  className="hbtn hbtnBlue"
                  href="https://www.instagram.com/charlie.richards13/?hl=en"
                  target="_blank"
                  rel="noreferrer"
                >
                  DM Me on IG
                </a>
              </div>
            </div>
          </section>

          <section className="arcadeRow">
            <div className="arcadeCard">
              <div className="arcadeLeft">
                <div className="arcadeTitle">🎮 Arcade</div>
                <div className="arcadeSub">
                  Arcade games are getting upgraded for the next release.
                </div>
              </div>

              <div className="arcadeRight">
                <button className="hbtn hbtnDisabled" disabled title="Coming soon">
                  Coming Soon
                </button>
              </div>
            </div>
          </section>

          <section className="propsRow">
            <div className="propsCard">
              <div className="propsLeft">
                <div className="propsTitle">📊 Player Props (Over/Under)</div>
                <div className="propsSub">
                  Make over/under predictions on featured players in the finals. Points, rebounds,
                  assists, and more! Player props are optional and scored separately from the main
                  bracket.
                </div>
              </div>

              <div className="propsRight">
                <Link className="hbtn hbtnBlue" href="/player-props">
                  Go to Player Props →
                </Link>
              </div>
            </div>
          </section>

          <div className="cardsRow">
            <InfoCard
              title="Semifinals Countdown"
              icon="🕒"
              accent="green"
              badge={semifinalsBadge}
              lines={semifinalsLines}
            />

            <InfoCard
              title="Finals Countdown"
              icon="🏆"
              accent="green"
              badge={finalsBadge}
              lines={finalsLines}
            />
          </div>

          <div className="cardsRow2">
            <InfoCard
              title="Scoring"
              icon="🏀"
              accent="blue"
              lines={[
                "Round 1 = 1 point per correct pick",
                "Round 2 = 2 points",
                "Round 3 = 4 points",
                "Round 4 = 8 points",
                "Final = 16 points",
              ]}
            />

            <InfoCard
              title="News"
              icon="📰"
              accent="blue"
              lines={["Updates, photos, announcements, and important changes will be posted here."]}
              action={
                <Link className="hbtn hbtnBlue" href="/news">
                  News
                </Link>
              }
            />
          </div>

          <section className="howToPlay">
            <div className="howTitle">How to play</div>
            <ol className="howList">
              <li>
                Go to <b>My Bracket</b> and pick winners (later rounds auto-fill).
              </li>

              <li>
                {tournamentStarted ? (
                  <>
                    Brackets are locked (tournament started on <b>{tournamentStartPhoenixText}</b>).
                  </>
                ) : (
                  <>
                    Hit <b>Submit Bracket</b> to lock your picks before tip-off:{" "}
                    <b>{tournamentStartPhoenixText}</b>.
                  </>
                )}
              </li>

              <li>
                Semifinals tip-off: <b>{semifinalsPhoenixText}</b>. Finals tip-off:{" "}
                <b>{finalsPhoenixText}</b>.
              </li>

              <li>
                Watch <b>Live Bracket</b> + <b>Leaderboard</b> update as winners are set.
              </li>
            </ol>
          </section>
        </header>

        <footer className="disclaimer">
          Unofficial bracket competition. Not affiliated with AIA. Please{" "}
          <a
            className="footerLink"
            href="https://www.instagram.com/charlie.richards13/?hl=en"
            target="_blank"
            rel="noreferrer"
          >
            DM @charlie.richards13
          </a>{" "}
          on IG to report any bugs or issues, or to reach out about future projects. Good luck and
          have fun!
        </footer>
      </div>

      <style jsx>{`
        .wrap {
          padding: 28px 18px 110px;
          color: #fff;
          display: flex;
          justify-content: center;
        }

        .stage {
          width: 100%;
          max-width: 1120px;
          position: relative;
          border-radius: 22px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.35);
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.55);
        }

        .bgSpotlights {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(900px 520px at 18% 10%, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0) 60%),
            radial-gradient(820px 520px at 78% 18%, rgba(120, 255, 170, 0.1), rgba(255, 255, 255, 0) 58%),
            radial-gradient(980px 620px at 50% 0%, rgba(100, 170, 255, 0.1), rgba(255, 255, 255, 0) 62%),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.04), rgba(0, 0, 0, 0.35));
          pointer-events: none;
        }

        .bgVignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(1200px 700px at 50% 10%, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.65));
          pointer-events: none;
        }

        .hero {
          position: relative;
          padding: 22px;
        }

        .topRow {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 18px;
          align-items: start;
        }

        .brand {
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }

        .brandLogo {
          width: 120px;
          height: auto;
          filter: drop-shadow(0 12px 22px rgba(0, 0, 0, 0.45));
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 6px;
        }

        .brandText .title {
          font-size: 22px;
          font-weight: 780;
          letter-spacing: 0.2px;
          margin-bottom: 10px;
        }

        .aiaStripe {
          height: 10px;
          width: min(520px, 100%);
          border-radius: 999px;
          margin-bottom: 12px;
          opacity: 0.95;
          background: linear-gradient(
            90deg,
            #1f6db3 0%,
            #1f6db3 62%,
            #f2c230 62%,
            #f2c230 78%,
            #d6463a 78%,
            #d6463a 100%
          );
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .brandText .subtitle {
          font-size: 16px;
          line-height: 24px;
          color: rgba(255, 255, 255, 0.8);
          max-width: 860px;
        }

        .ballCol {
          display: flex;
          justify-content: flex-end;
          padding-top: 6px;
        }

        .inAppBanner {
          margin-top: 14px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 18px;
          background: rgba(0, 0, 0, 0.3);
          padding: 14px 16px;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
        }

        .inAppTitle {
          font-weight: 900;
          letter-spacing: 0.2px;
          margin-bottom: 6px;
        }

        .inAppText {
          opacity: 0.82;
          font-size: 13px;
          line-height: 18px;
        }

        .inAppActions {
          margin-top: 10px;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .panel {
          margin-top: 16px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.04);
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.35);
          padding: 18px;
        }

        .shoutoutRow {
          margin-top: 14px;
        }

        .shoutoutCard {
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: linear-gradient(
            135deg,
            rgba(214, 70, 58, 0.12),
            rgba(242, 194, 48, 0.1),
            rgba(31, 109, 179, 0.12)
          );
          box-shadow: 0 14px 35px rgba(0, 0, 0, 0.3);
          padding: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .shoutoutTitle {
          font-weight: 900;
          letter-spacing: 0.2px;
          font-size: 16px;
        }

        .shoutoutSub {
          margin-top: 6px;
          opacity: 0.88;
          font-size: 13px;
          line-height: 19px;
          max-width: 820px;
        }

        .shoutoutRight {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .inlineLink {
          color: #9fc9ff;
          text-decoration: none;
          font-weight: 700;
        }

        .inlineLink:hover {
          text-decoration: underline;
        }

        .cardsRow {
          margin-top: 16px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .cardsRow2 {
          margin-top: 12px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .arcadeRow {
          margin-top: 14px;
        }

        .arcadeCard {
          border-radius: 18px;
          border: 1px solid rgba(242, 194, 48, 0.35);
          background: rgba(242, 194, 48, 0.07);
          box-shadow: 0 14px 35px rgba(0, 0, 0, 0.3);
          padding: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .arcadeTitle {
          font-weight: 900;
          letter-spacing: 0.2px;
          font-size: 16px;
        }

        .arcadeSub {
          margin-top: 6px;
          opacity: 0.8;
          font-size: 13px;
          line-height: 18px;
          max-width: 760px;
        }

        .arcadeRight {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .propsRow {
          margin-top: 12px;
        }

        .propsCard {
          border-radius: 18px;
          border: 1px solid rgba(120, 180, 255, 0.35);
          background: rgba(120, 180, 255, 0.07);
          box-shadow: 0 14px 35px rgba(0, 0, 0, 0.3);
          padding: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .propsTitle {
          font-weight: 900;
          letter-spacing: 0.2px;
          font-size: 16px;
        }

        .propsSub {
          margin-top: 6px;
          opacity: 0.8;
          font-size: 13px;
          line-height: 18px;
          max-width: 760px;
        }

        .propsRight {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .muted {
          color: rgba(255, 255, 255, 0.72);
        }

        .who {
          font-size: 18px;
          font-weight: 780;
          margin: 2px 0 2px;
        }

        .btnRow {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;
          margin-top: 14px;
        }

        :global(.hbtn) {
          border-radius: 12px;
          padding: 11px 14px;
          border: 1px solid rgba(255, 255, 255, 0.28);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 720;
          cursor: pointer;
          user-select: none;
          transition: transform 120ms ease, background 120ms ease, border 120ms ease;
          color: #fff;
        }

        :global(.hbtnBlue) {
          background: rgba(31, 109, 179, 0.18);
          border-color: rgba(31, 109, 179, 0.6);
        }

        :global(.hbtnGold) {
          background: rgba(242, 194, 48, 0.14);
          border-color: rgba(242, 194, 48, 0.6);
        }

        :global(.hbtnRed) {
          background: rgba(214, 70, 58, 0.16);
          border-color: rgba(214, 70, 58, 0.6);
        }

        :global(.hbtnGhost) {
          background: rgba(0, 0, 0, 0.22);
          color: rgba(255, 255, 255, 0.92);
          border-color: rgba(255, 255, 255, 0.28);
        }

        :global(.hbtnDisabled) {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.22);
          color: rgba(255, 255, 255, 0.7);
          cursor: not-allowed;
          opacity: 0.75;
          transform: none !important;
        }

        :global(.hbtn:hover) {
          transform: translateY(-1px);
        }

        :global(.hbtnDisabled:hover) {
          transform: none;
        }

        .status {
          margin-top: 12px;
          color: rgba(183, 255, 183, 0.95);
          font-size: 13px;
          line-height: 18px;
        }

        .howToPlay {
          margin-top: 14px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 18px;
          background: rgba(0, 0, 0, 0.18);
          padding: 14px 16px;
        }

        .howTitle {
          font-weight: 800;
          letter-spacing: 0.2px;
          margin-bottom: 8px;
          color: rgba(255, 255, 255, 0.92);
        }

        .howList {
          margin: 0;
          padding-left: 18px;
          color: rgba(255, 255, 255, 0.72);
          line-height: 20px;
          font-size: 13px;
        }

        .howList li {
          margin: 6px 0;
        }

        .disclaimer {
          margin-top: 14px;
          padding: 12px 16px 18px;
          text-align: center;
          font-size: 12px;
          line-height: 18px;
          color: rgba(255, 255, 255, 0.55);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .footerLink {
          color: rgba(170, 210, 255, 0.95);
          text-decoration: none;
          font-weight: 700;
        }

        .footerLink:hover {
          text-decoration: underline;
        }

        @media (max-width: 920px) {
          .topRow {
            grid-template-columns: 1fr;
          }

          .ballCol {
            justify-content: flex-start;
          }

          .cardsRow {
            grid-template-columns: 1fr;
          }

          .cardsRow2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}

function InfoCard({
  title,
  icon,
  lines,
  accent,
  badge,
  action,
}: {
  title: string;
  icon: string;
  lines: string[];
  accent: "green" | "blue";
  badge?: { type: "live" | "done"; text: string } | null;
  action?: ReactNode;
}) {
  const accentBorder =
    accent === "green" ? "rgba(120,255,170,0.30)" : "rgba(120,180,255,0.30)";
  const accentBg =
    accent === "green" ? "rgba(120,255,170,0.07)" : "rgba(120,180,255,0.07)";

  return (
    <div className="icard">
      <div className="ihead">
        <div className="ititle">
          <span className="icon">{icon}</span> {title}
        </div>

        {badge?.type === "live" ? (
          <div className="pillLive" title="Games are live">
            <span className="dot" /> {badge.text}
          </div>
        ) : badge?.type === "done" ? (
          <div className="pillDone" title="Complete">
            {badge.text}
          </div>
        ) : null}
      </div>

      <div className="ibody">
        {lines.map((l, idx) => (
          <div key={idx} className="iline">
            {l}
          </div>
        ))}

        {action ? <div className="iaction">{action}</div> : null}
      </div>

      <style jsx>{`
        .icard {
          border: 1px solid ${accentBorder};
          background: ${accentBg};
          border-radius: 18px;
          padding: 14px;
          box-shadow: 0 14px 35px rgba(0, 0, 0, 0.3);
        }

        .ihead {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          gap: 10px;
        }

        .ititle {
          font-weight: 780;
          letter-spacing: 0.2px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .ibody {
          color: rgba(255, 255, 255, 0.8);
          line-height: 20px;
          font-size: 14px;
        }

        .iline {
          margin-top: 6px;
        }

        .iline:first-child {
          margin-top: 0;
        }

        .iaction {
          margin-top: 12px;
          display: flex;
          justify-content: flex-start;
        }

        .pillLive {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          border-radius: 999px;
          border: 1px solid rgba(255, 120, 120, 0.45);
          background: rgba(255, 90, 90, 0.1);
          color: rgba(255, 230, 230, 0.95);
          font-weight: 900;
          letter-spacing: 0.4px;
          font-size: 12px;
          white-space: nowrap;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: rgba(255, 90, 90, 0.95);
          box-shadow: 0 0 14px rgba(255, 90, 90, 0.75);
          animation: pulse 1.1s ease-in-out infinite;
        }

        .pillDone {
          padding: 6px 10px;
          border-radius: 999px;
          border: 1px solid rgba(180, 210, 255, 0.35);
          background: rgba(120, 180, 255, 0.1);
          color: rgba(220, 235, 255, 0.95);
          font-weight: 900;
          letter-spacing: 0.4px;
          font-size: 12px;
          white-space: nowrap;
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.35);
            opacity: 0.75;
          }
        }
      `}</style>
    </div>
  );
}

function SpinningBasketball() {
  return (
    <div className="ballWrap" aria-hidden="true">
      <div className="ball">
        <svg viewBox="0 0 100 100" className="ballSvg">
          <defs>
            <radialGradient id="g" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffb36b" stopOpacity="1" />
              <stop offset="55%" stopColor="#e67e22" stopOpacity="1" />
              <stop offset="100%" stopColor="#b85a14" stopOpacity="1" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="48" fill="url(#g)" />
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="rgba(0,0,0,0.35)"
            strokeWidth="2"
          />
          <path d="M50 2 v96" stroke="rgba(0,0,0,0.55)" strokeWidth="3" />
          <path d="M2 50 h96" stroke="rgba(0,0,0,0.55)" strokeWidth="3" />
          <path
            d="M18 10 C40 30, 40 70, 18 90"
            fill="none"
            stroke="rgba(0,0,0,0.55)"
            strokeWidth="3"
          />
          <path
            d="M82 10 C60 30, 60 70, 82 90"
            fill="none"
            stroke="rgba(0,0,0,0.55)"
            strokeWidth="3"
          />
        </svg>
      </div>

      <style jsx>{`
        .ballWrap {
          width: 120px;
          height: 120px;
          display: grid;
          place-items: center;
          filter: drop-shadow(0 14px 24px rgba(0, 0, 0, 0.45));
        }

        .ball {
          width: 106px;
          height: 106px;
          border-radius: 999px;
          animation: spin 2.8s linear infinite, floaty 3.2s ease-in-out infinite;
          transform-origin: 50% 50%;
        }

        .ballSvg {
          width: 100%;
          height: 100%;
          border-radius: 999px;
          display: block;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes floaty {
          0%,
          100% {
            translate: 0 0;
          }
          50% {
            translate: 0 -6px;
          }
        }
      `}</style>
    </div>
  );
}

function formatCountdown(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

function formatPhoenix(d: Date) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Phoenix",
      dateStyle: "full",
      timeStyle: "short",
    }).format(d);
  } catch {
    return d.toLocaleString();
  }
}

// Charles Richards ASU 2028
// Completed AZ HS Bracket Project
