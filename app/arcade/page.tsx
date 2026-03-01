// // this is the first version of this game so we will see

// "use client";

// import { useState } from "react";
// import Link from "next/link";

// export default function ArcadePage() {
//   const [started, setStarted] = useState(false);

//   return (
//     <main className="wrap">
//       <div className="stage">
//         <div className="bgSpotlights" aria-hidden="true" />
//         <div className="bgVignette" aria-hidden="true" />

//         <header className="hero">
//           <div className="topbar">
//             <div>
//               <div className="title">🎮 Arcade</div>
//               <div className="subtitle">Basketball mini-games coming soon.</div>
//             </div>

//             <Link className="btn" href="/">
//               ← Home
//             </Link>
//           </div>

//           {!started ? (
//             <section className="card">
//               <div className="cardTitle">Before you start…</div>
//               <div className="cardBody">
//                 <b>Created by Charlie Richards</b>
//                 <div style={{ marginTop: 10, opacity: 0.8 }}>
//                   Press start to enter the arcade. We’ll build the first mini-game next.
//                 </div>
//               </div>

//               <div className="actions">
//                 <button className="startBtn" onClick={() => setStarted(true)}>
//                   Start →
//                 </button>
//               </div>
//             </section>
//           ) : (
//             <section className="card">
//               <div className="cardTitle">Arcade Lobby</div>
//               <div className="cardBody">
//                 First game (Free Throw Meter) is next. This page is ready for it.
//               </div>
//             </section>
//           )}
//         </header>
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
//           max-width: 980px;
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
//             radial-gradient(820px 520px at 78% 18%, rgba(242,194,48,0.10), rgba(255,255,255,0) 58%),
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
//         .topbar {
//           display: flex;
//           justify-content: space-between;
//           gap: 12px;
//           flex-wrap: wrap;
//           align-items: flex-end;
//         }
//         .title {
//           font-size: 24px;
//           font-weight: 900;
//           letter-spacing: 0.2px;
//         }
//         .subtitle {
//           margin-top: 6px;
//           opacity: 0.75;
//           font-size: 13px;
//           line-height: 18px;
//         }
//         .btn {
//           border-radius: 12px;
//           padding: 10px 14px;
//           border: 1px solid rgba(255, 255, 255, 0.28);
//           text-decoration: none;
//           color: #fff;
//           background: rgba(0, 0, 0, 0.22);
//           font-weight: 800;
//         }
//         .card {
//           margin-top: 16px;
//           border-radius: 18px;
//           border: 1px solid rgba(242, 194, 48, 0.35);
//           background: rgba(242, 194, 48, 0.07);
//           box-shadow: 0 14px 35px rgba(0, 0, 0, 0.30);
//           padding: 16px;
//         }
//         .cardTitle {
//           font-weight: 900;
//           letter-spacing: 0.2px;
//           margin-bottom: 10px;
//         }
//         .cardBody {
//           opacity: 0.9;
//           line-height: 20px;
//         }
//         .actions {
//           margin-top: 14px;
//           display: flex;
//           gap: 10px;
//           flex-wrap: wrap;
//         }
//         .startBtn {
//           border-radius: 12px;
//           padding: 11px 14px;
//           border: 1px solid rgba(242, 194, 48, 0.60);
//           background: rgba(242, 194, 48, 0.14);
//           color: #fff;
//           font-weight: 800;
//           cursor: pointer;
//         }
//         .startBtn:hover {
//           transform: translateY(-1px);
//         }
//       `}</style>
//     </main>
//   );
// }


// improving to have a better structure for the arcade and to be ready for the first game (free throw meter) coming next. The lobby will have a place for each mini-game and we can add them as we build them out. This is just the starting point!

// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import Link from "next/link";

// type ShotResult = "SWISH" | "MAKE" | "MISS";

// function clamp01(x: number) {
//   return Math.max(0, Math.min(1, x));
// }

// export default function ArcadePage() {
//   const [started, setStarted] = useState(false);

//   // Game state
//   const [score, setScore] = useState(0);
//   const [streak, setStreak] = useState(0);
//   const [bestStreak, setBestStreak] = useState(0);

//   const [message, setMessage] = useState<string>("Hold to shoot.");
//   const [lastResult, setLastResult] = useState<ShotResult | null>(null);

//   // Meter values
//   const [aim, setAim] = useState(0.5); // 0..1 moving left/right
//   const [power, setPower] = useState(0); // 0..1 charging
//   const [charging, setCharging] = useState(false);

//   // Animation refs
//   const aimDirRef = useRef(1); // +1 or -1
//   const rafRef = useRef<number | null>(null);
//   const lastTsRef = useRef<number | null>(null);

//   // Make it feel consistent across devices
//   const AIM_SPEED = 0.75; // per second (how fast the aim marker moves)
//   const POWER_SPEED = 0.55; // per second (how fast power fills)

//   // “Perfect” target zones (tweak anytime)
//   const perfectCenter = 0.5;
//   const perfectHalfWidth = 0.06; // swish zone width
//   const makeHalfWidth = 0.15; // make zone width

//   // Power target (we want medium-high power)
//   const powerTarget = 0.72;
//   const powerSwishHalfWidth = 0.08;
//   const powerMakeHalfWidth = 0.18;

//   const aimDelta = useMemo(() => Math.abs(aim - perfectCenter), [aim]);
//   const powerDelta = useMemo(() => Math.abs(power - powerTarget), [power]);

//   // Main animation loop (aim always moves; power increases only while charging)
//   useEffect(() => {
//     if (!started) return;

//     const loop = (ts: number) => {
//       if (lastTsRef.current == null) lastTsRef.current = ts;
//       const dt = Math.min(0.05, (ts - lastTsRef.current) / 1000); // seconds, clamp
//       lastTsRef.current = ts;

//       // Aim ping-pong
//       setAim((prev) => {
//         let next = prev + aimDirRef.current * AIM_SPEED * dt;
//         if (next >= 1) {
//           next = 1;
//           aimDirRef.current = -1;
//         } else if (next <= 0) {
//           next = 0;
//           aimDirRef.current = 1;
//         }
//         return next;
//       });

//       // Power charge
//       if (charging) {
//         setPower((prev) => clamp01(prev + POWER_SPEED * dt));
//       }

//       rafRef.current = requestAnimationFrame(loop);
//     };

//     rafRef.current = requestAnimationFrame(loop);
//     return () => {
//       if (rafRef.current) cancelAnimationFrame(rafRef.current);
//       rafRef.current = null;
//       lastTsRef.current = null;
//     };
//   }, [started, charging]);

//   function resetGame() {
//     setScore(0);
//     setStreak(0);
//     setBestStreak(0);
//     setMessage("Hold to shoot.");
//     setLastResult(null);
//     setAim(0.5);
//     setPower(0);
//     setCharging(false);
//   }

//   function startCharge() {
//     if (!started) return;
//     if (charging) return;
//     setLastResult(null);
//     setMessage("Charging...");
//     setPower(0); // reset power each shot
//     setCharging(true);
//   }

//   function releaseShot() {
//     if (!started) return;
//     if (!charging) return;

//     setCharging(false);

//     // Grade aim
//     const aimIsSwish = aimDelta <= perfectHalfWidth;
//     const aimIsMake = aimDelta <= makeHalfWidth;

//     // Grade power
//     const powIsSwish = powerDelta <= powerSwishHalfWidth;
//     const powIsMake = powerDelta <= powerMakeHalfWidth;

//     let result: ShotResult = "MISS";

//     if (aimIsSwish && powIsSwish) {
//       result = "SWISH";
//     } else if (aimIsMake && powIsMake) {
//       result = "MAKE";
//     } else {
//       result = "MISS";
//     }

//     setLastResult(result);

//     if (result === "SWISH") {
//       setScore((s) => s + 3);
//       setStreak((st) => {
//         const next = st + 1;
//         setBestStreak((b) => Math.max(b, next));
//         return next;
//       });
//       setMessage("SWISH! +3");
//     } else if (result === "MAKE") {
//       setScore((s) => s + 2);
//       setStreak((st) => {
//         const next = st + 1;
//         setBestStreak((b) => Math.max(b, next));
//         return next;
//       });
//       setMessage("Bucket! +2");
//     } else {
//       setStreak(0);
//       setMessage("Miss. Try again.");
//     }

//     // Slightly soften the next shot start state
//     setPower(0);
//   }

//   // Touch + mouse support (prevents accidental scroll / text select)
//   function onPress(e: any) {
//     e.preventDefault?.();
//     startCharge();
//   }

//   function onRelease(e: any) {
//     e.preventDefault?.();
//     releaseShot();
//   }

//   return (
//     <main className="wrap">
//       <div className="stage">
//         <div className="bgSpotlights" aria-hidden="true" />
//         <div className="bgVignette" aria-hidden="true" />

//         <header className="hero">
//           <div className="topbar">
//             <div>
//               <div className="title">🎮 Arcade</div>
//               <div className="subtitle">Free Throw Meter (v1)</div>
//             </div>

//             <div className="topActions">
//               <Link className="btn" href="/">
//                 ← Home
//               </Link>
//               <button className="btnGhost" onClick={resetGame} disabled={!started}>
//                 Reset
//               </button>
//             </div>
//           </div>

//           {!started ? (
//             <section className="card">
//               <div className="cardTitle">Before you start…</div>
//               <div className="cardBody">
//                 <b>Created by Charlie Richards</b>
//                 <div style={{ marginTop: 10, opacity: 0.8 }}>
//                   Hold to charge power, release to shoot. Try to land in the green zones.
//                 </div>
//               </div>

//               <div className="actions">
//                 <button className="startBtn" onClick={() => setStarted(true)}>
//                   Start →
//                 </button>
//               </div>
//             </section>
//           ) : (
//             <>
//               <section className="hud">
//                 <div className="hudItem">
//                   <div className="hudLabel">Score</div>
//                   <div className="hudValue">{score}</div>
//                 </div>
//                 <div className="hudItem">
//                   <div className="hudLabel">Streak</div>
//                   <div className="hudValue">{streak}</div>
//                 </div>
//                 <div className="hudItem">
//                   <div className="hudLabel">Best</div>
//                   <div className="hudValue">{bestStreak}</div>
//                 </div>
//               </section>

//               <section className="gameCard">
//                 <div className="msgRow">
//                   <div className="msg">{message}</div>
//                   {lastResult ? (
//                     <div
//                       className={
//                         lastResult === "SWISH"
//                           ? "badge badgeSwish"
//                           : lastResult === "MAKE"
//                           ? "badge badgeMake"
//                           : "badge badgeMiss"
//                       }
//                     >
//                       {lastResult}
//                     </div>
//                   ) : null}
//                 </div>

//                 {/* Aim meter */}
//                 <div className="meterBlock">
//                   <div className="meterLabel">Aim</div>
//                   <div className="meter">
//                     {/* Make zone */}
//                     <div className="zoneMake" style={zoneStyle(0.5, makeHalfWidth)} />
//                     {/* Swish zone */}
//                     <div className="zoneSwish" style={zoneStyle(0.5, perfectHalfWidth)} />
//                     {/* Cursor */}
//                     <div className="cursor" style={{ left: `${aim * 100}%` }} />
//                   </div>
//                   <div className="meterHint">Try to release when the marker is centered.</div>
//                 </div>

//                 {/* Power meter */}
//                 <div className="meterBlock">
//                   <div className="meterLabel">Power</div>
//                   <div className="meter">
//                     <div className="zoneMake" style={zoneStyle(powerTarget, powerMakeHalfWidth)} />
//                     <div className="zoneSwish" style={zoneStyle(powerTarget, powerSwishHalfWidth)} />
//                     <div className="fill" style={{ width: `${power * 100}%` }} />
//                   </div>
//                   <div className="meterHint">Hold to charge. Release to shoot.</div>
//                 </div>

//                 {/* Big action button */}
//                 <div className="shootArea">
//                   <button
//                     className={charging ? "shootBtn shootBtnDown" : "shootBtn"}
//                     onMouseDown={onPress}
//                     onMouseUp={onRelease}
//                     onMouseLeave={charging ? onRelease : undefined}
//                     onTouchStart={onPress}
//                     onTouchEnd={onRelease}
//                   >
//                     {charging ? "Release to Shoot" : "Hold to Charge"}
//                   </button>
//                 </div>
//               </section>

//               <div className="footerNote">
//                 Tip: SWISH = tighter aim + tighter power → +3 points
//               </div>
//             </>
//           )}
//         </header>
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
//           max-width: 980px;
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
//             radial-gradient(820px 520px at 78% 18%, rgba(242,194,48,0.10), rgba(255,255,255,0) 58%),
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

//         .topbar {
//           display: flex;
//           justify-content: space-between;
//           gap: 12px;
//           flex-wrap: wrap;
//           align-items: flex-end;
//         }
//         .title {
//           font-size: 24px;
//           font-weight: 900;
//           letter-spacing: 0.2px;
//         }
//         .subtitle {
//           margin-top: 6px;
//           opacity: 0.75;
//           font-size: 13px;
//           line-height: 18px;
//         }
//         .topActions {
//           display: flex;
//           gap: 10px;
//           flex-wrap: wrap;
//           align-items: center;
//         }
//         .btn {
//           border-radius: 12px;
//           padding: 10px 14px;
//           border: 1px solid rgba(255, 255, 255, 0.28);
//           text-decoration: none;
//           color: #fff;
//           background: rgba(0, 0, 0, 0.22);
//           font-weight: 800;
//         }
//         .btnGhost {
//           border-radius: 12px;
//           padding: 10px 14px;
//           border: 1px solid rgba(255, 255, 255, 0.20);
//           background: rgba(0, 0, 0, 0.18);
//           color: rgba(255, 255, 255, 0.92);
//           font-weight: 800;
//           cursor: pointer;
//         }
//         .btnGhost:disabled {
//           opacity: 0.55;
//           cursor: default;
//         }

//         .card {
//           margin-top: 16px;
//           border-radius: 18px;
//           border: 1px solid rgba(242, 194, 48, 0.35);
//           background: rgba(242, 194, 48, 0.07);
//           box-shadow: 0 14px 35px rgba(0, 0, 0, 0.30);
//           padding: 16px;
//         }
//         .cardTitle {
//           font-weight: 900;
//           letter-spacing: 0.2px;
//           margin-bottom: 10px;
//         }
//         .cardBody {
//           opacity: 0.9;
//           line-height: 20px;
//         }
//         .actions {
//           margin-top: 14px;
//           display: flex;
//           gap: 10px;
//           flex-wrap: wrap;
//         }
//         .startBtn {
//           border-radius: 12px;
//           padding: 11px 14px;
//           border: 1px solid rgba(242, 194, 48, 0.60);
//           background: rgba(242, 194, 48, 0.14);
//           color: #fff;
//           font-weight: 800;
//           cursor: pointer;
//         }
//         .startBtn:hover {
//           transform: translateY(-1px);
//         }

//         .hud {
//           margin-top: 16px;
//           display: grid;
//           grid-template-columns: repeat(3, 1fr);
//           gap: 10px;
//         }
//         .hudItem {
//           border-radius: 16px;
//           border: 1px solid rgba(255,255,255,0.10);
//           background: rgba(255,255,255,0.04);
//           box-shadow: 0 14px 35px rgba(0,0,0,0.25);
//           padding: 12px;
//         }
//         .hudLabel {
//           opacity: 0.7;
//           font-size: 12px;
//           letter-spacing: 0.2px;
//         }
//         .hudValue {
//           margin-top: 6px;
//           font-size: 20px;
//           font-weight: 900;
//           letter-spacing: 0.2px;
//         }

//         .gameCard {
//           margin-top: 12px;
//           border-radius: 18px;
//           border: 1px solid rgba(120,180,255,0.28);
//           background: rgba(120,180,255,0.07);
//           box-shadow: 0 14px 35px rgba(0,0,0,0.30);
//           padding: 16px;
//         }

//         .msgRow {
//           display: flex;
//           justify-content: space-between;
//           gap: 10px;
//           flex-wrap: wrap;
//           align-items: center;
//           margin-bottom: 12px;
//         }
//         .msg {
//           font-weight: 900;
//           letter-spacing: 0.2px;
//         }
//         .badge {
//           padding: 6px 10px;
//           border-radius: 999px;
//           font-weight: 900;
//           letter-spacing: 0.3px;
//           font-size: 12px;
//           border: 1px solid rgba(255,255,255,0.18);
//           background: rgba(0,0,0,0.18);
//           white-space: nowrap;
//         }
//         .badgeSwish {
//           border-color: rgba(120,255,170,0.35);
//           background: rgba(120,255,170,0.10);
//         }
//         .badgeMake {
//           border-color: rgba(242,194,48,0.35);
//           background: rgba(242,194,48,0.12);
//         }
//         .badgeMiss {
//           border-color: rgba(255,120,120,0.35);
//           background: rgba(255,120,120,0.10);
//         }

//         .meterBlock {
//           margin-top: 12px;
//         }
//         .meterLabel {
//           font-weight: 900;
//           letter-spacing: 0.2px;
//           margin-bottom: 8px;
//         }
//         .meter {
//           position: relative;
//           height: 18px;
//           border-radius: 999px;
//           border: 1px solid rgba(255,255,255,0.14);
//           background: rgba(0,0,0,0.22);
//           overflow: hidden;
//         }
//         .zoneMake {
//           position: absolute;
//           top: 0;
//           height: 100%;
//           border-radius: 999px;
//           background: rgba(242, 194, 48, 0.12);
//           border: 1px solid rgba(242, 194, 48, 0.25);
//         }
//         .zoneSwish {
//           position: absolute;
//           top: 0;
//           height: 100%;
//           border-radius: 999px;
//           background: rgba(120, 255, 170, 0.14);
//           border: 1px solid rgba(120, 255, 170, 0.28);
//         }
//         .cursor {
//           position: absolute;
//           top: -3px;
//           width: 10px;
//           height: 24px;
//           border-radius: 999px;
//           background: rgba(255,255,255,0.92);
//           transform: translateX(-50%);
//           box-shadow: 0 0 18px rgba(255,255,255,0.25);
//         }
//         .fill {
//           position: absolute;
//           left: 0;
//           top: 0;
//           height: 100%;
//           border-radius: 999px;
//           background: rgba(120, 180, 255, 0.25);
//         }
//         .meterHint {
//           margin-top: 6px;
//           opacity: 0.75;
//           font-size: 12px;
//           line-height: 16px;
//         }

//         .shootArea {
//           margin-top: 16px;
//           display: grid;
//           place-items: center;
//         }
//         .shootBtn {
//           width: min(520px, 100%);
//           border-radius: 16px;
//           padding: 14px 16px;
//           border: 1px solid rgba(255,255,255,0.20);
//           background: rgba(0,0,0,0.22);
//           color: #fff;
//           font-weight: 900;
//           letter-spacing: 0.2px;
//           cursor: pointer;
//           user-select: none;
//           touch-action: none;
//           transition: transform 120ms ease, background 120ms ease;
//         }
//         .shootBtn:hover {
//           transform: translateY(-1px);
//         }
//         .shootBtnDown {
//           transform: translateY(1px) scale(0.99);
//           background: rgba(0,0,0,0.30);
//         }

//         .footerNote {
//           margin-top: 12px;
//           text-align: center;
//           opacity: 0.65;
//           font-size: 12px;
//         }

//         @media (max-width: 720px) {
//           .hud {
//             grid-template-columns: 1fr 1fr 1fr;
//           }
//         }
//       `}</style>
//     </main>
//   );
// }

// function zoneStyle(center: number, halfWidth: number) {
//   const left = clamp01(center - halfWidth);
//   const right = clamp01(center + halfWidth);
//   return {
//     left: `${left * 100}%`,
//     width: `${(right - left) * 100}%`,
//   } as const;
// }




// adding graphics


// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import Link from "next/link";
// import {
//   collection,
//   doc,
//   getDoc,
//   limit,
//   onSnapshot,
//   orderBy,
//   query,
//   serverTimestamp,
//   setDoc,
// } from "firebase/firestore";
// import { onAuthStateChanged, type User } from "firebase/auth";

// import { db, auth } from "@/lib/firebase";
// import { TOURNAMENT_ID } from "@/lib/tournament";

// type Phase = "splash" | "menu" | "game";

// type ShotResult = "SWISH" | "MAKE" | "MISS";

// type ModeId = "free_throw" | "corner_three" | "moving_rim" | "timed_pop";

// type Mode = {
//   id: ModeId;
//   name: string;
//   description: string;
//   pointsMake: number;
//   pointsSwish: number;
//   durationSec?: number; // timed mode
//   movingRim?: boolean;
//   hoopX: number; // normalized (0..1) in canvas
//   hoopY: number; // normalized (0..1)
// };

// type CharacterConfig = {
//   skin: string;
//   hairColor: string;
//   jersey: string;
//   shoes: string;
//   number: string;

//   hairStyle: "short" | "fade" | "curly";
//   headband: boolean;
//   sleeve: boolean;
//   jerseyPattern: "solid" | "stripe" | "diagonal";
// };

// type LeaderRow = {
//   uid: string;
//   name: string;
//   score: number;
//   mode: ModeId;
//   updatedAt?: any;
// };

// const DEFAULT_CHAR: CharacterConfig = {
//   skin: "#D9A074",
//   hairColor: "#2B1B0F",
//   jersey: "#1f6db3",
//   shoes: "#f2c230",
//   number: "13",
//   hairStyle: "fade",
//   headband: false,
//   sleeve: true,
//   jerseyPattern: "stripe",
// };

// const MODES: Mode[] = [
//   {
//     id: "free_throw",
//     name: "Free Throws",
//     description: "Classic line shots. Build streaks and tighten the window.",
//     pointsMake: 2,
//     pointsSwish: 3,
//     hoopX: 0.78,
//     hoopY: 0.33,
//   },
//   {
//     id: "corner_three",
//     name: "Corner 3",
//     description: "Harder angle, more points.",
//     pointsMake: 3,
//     pointsSwish: 4,
//     hoopX: 0.84,
//     hoopY: 0.32,
//   },
//   {
//     id: "moving_rim",
//     name: "Moving Rim",
//     description: "Rim slides left/right. Timing matters.",
//     pointsMake: 3,
//     pointsSwish: 5,
//     movingRim: true,
//     hoopX: 0.78,
//     hoopY: 0.33,
//   },
//   {
//     id: "timed_pop",
//     name: "Pop-A-Shot (30s)",
//     description: "Score as much as possible in 30 seconds.",
//     pointsMake: 2,
//     pointsSwish: 3,
//     durationSec: 30,
//     movingRim: true,
//     hoopX: 0.78,
//     hoopY: 0.33,
//   },
// ];

// function clamp01(x: number) {
//   return Math.max(0, Math.min(1, x));
// }
// function clamp(x: number, lo: number, hi: number) {
//   return Math.max(lo, Math.min(hi, x));
// }

// function loadJSON<T>(key: string, fallback: T): T {
//   try {
//     const raw = localStorage.getItem(key);
//     if (!raw) return fallback;
//     return JSON.parse(raw) as T;
//   } catch {
//     return fallback;
//   }
// }
// function saveJSON(key: string, v: any) {
//   try {
//     localStorage.setItem(key, JSON.stringify(v));
//   } catch {}
// }

// function useAudio(soundOn: boolean) {
//   const ctxRef = useRef<AudioContext | null>(null);

//   function ensure() {
//     if (!soundOn) return null;
//     if (!ctxRef.current) {
//       try {
//         ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
//       } catch {
//         return null;
//       }
//     }
//     return ctxRef.current;
//   }

//   function tone(freq: number, durMs: number, type: OscillatorType, gain = 0.08) {
//     const ctx = ensure();
//     if (!ctx) return;
//     const t0 = ctx.currentTime;

//     const osc = ctx.createOscillator();
//     const g = ctx.createGain();

//     osc.type = type;
//     osc.frequency.setValueAtTime(freq, t0);

//     g.gain.setValueAtTime(0.0001, t0);
//     g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02);
//     g.gain.exponentialRampToValueAtTime(0.0001, t0 + durMs / 1000);

//     osc.connect(g);
//     g.connect(ctx.destination);

//     osc.start(t0);
//     osc.stop(t0 + durMs / 1000 + 0.02);
//   }

//   function swish() {
//     const ctx = ensure();
//     if (!ctx) return;
//     const t0 = ctx.currentTime;

//     const osc = ctx.createOscillator();
//     const g = ctx.createGain();

//     osc.type = "sine";
//     osc.frequency.setValueAtTime(880, t0);
//     osc.frequency.exponentialRampToValueAtTime(440, t0 + 0.16);

//     g.gain.setValueAtTime(0.0001, t0);
//     g.gain.exponentialRampToValueAtTime(0.09, t0 + 0.02);
//     g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.18);

//     osc.connect(g);
//     g.connect(ctx.destination);

//     osc.start(t0);
//     osc.stop(t0 + 0.2);
//   }

//   function make() {
//     tone(660, 90, "triangle", 0.07);
//     setTimeout(() => tone(880, 110, "triangle", 0.07), 90);
//   }

//   function miss() {
//     tone(140, 160, "sine", 0.09);
//   }

//   return { swish, make, miss, tone };
// }

// /**
//  * Simple 2D physics:
//  * - Ball starts near player hand
//  * - v0 determined by power (and mode)
//  * - angle determined by power + a small lift curve
//  * - aim shifts x-velocity / initial x offset
//  * - gravity pulls down
//  * - detect rim entry (circle / segment check)
//  */
// type BallState = {
//   active: boolean;
//   x: number;
//   y: number;
//   vx: number;
//   vy: number;
//   t: number;
//   result: ShotResult | null;
// };

// export default function ArcadePage() {
//   const [phase, setPhase] = useState<Phase>("splash");
//   const [splashGone, setSplashGone] = useState(false);

//   const [user, setUser] = useState<User | null>(null);

//   const [modeId, setModeId] = useState<ModeId>("free_throw");
//   const mode = useMemo(() => MODES.find((m) => m.id === modeId)!, [modeId]);

//   const [char, setChar] = useState<CharacterConfig>(() =>
//     loadJSON<CharacterConfig>("arcade_char_v2", DEFAULT_CHAR)
//   );

//   const [soundOn, setSoundOn] = useState<boolean>(() => {
//     const v = loadJSON<{ soundOn: boolean }>("arcade_settings_v2", { soundOn: true });
//     return !!v.soundOn;
//   });

//   const audio = useAudio(soundOn);

//   // Leaderboard
//   const [leaders, setLeaders] = useState<LeaderRow[]>([]);
//   const [lbMsg, setLbMsg] = useState("");

//   // Game state
//   const [score, setScore] = useState(0);
//   const [bestScoreLocal, setBestScoreLocal] = useState<number>(() =>
//     Number(localStorage.getItem("arcade_bestscore_v2") || "0") || 0
//   );
//   const [streak, setStreak] = useState(0);
//   const [bestStreak, setBestStreak] = useState(0);
//   const [message, setMessage] = useState("Hold to charge. Release to shoot.");
//   const [lastResult, setLastResult] = useState<ShotResult | null>(null);

//   // Meter values
//   const [aim, setAim] = useState(0.5); // 0..1
//   const [power, setPower] = useState(0);
//   const [charging, setCharging] = useState(false);

//   // Timed mode
//   const [timeLeft, setTimeLeft] = useState<number | null>(null);

//   // Canvas
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);
//   const rafRef = useRef<number | null>(null);
//   const lastTsRef = useRef<number | null>(null);

//   // Player anim
//   const [armPose, setArmPose] = useState<"idle" | "ready" | "shoot">("idle");
//   const [netPulse, setNetPulse] = useState<"none" | "make" | "swish" | "miss">("none");

//   // Physics state in a ref for stable updates
//   const ballRef = useRef<BallState>({
//     active: false,
//     x: 0,
//     y: 0,
//     vx: 0,
//     vy: 0,
//     t: 0,
//     result: null,
//   });

//   // Moving rim
//   const rimPhaseRef = useRef(0);

//   // Difficulty ramp
//   const difficultyMult = useMemo(() => clamp(1 - streak * 0.03, 0.55, 1), [streak]);

//   // Meter tuning
//   const AIM_SPEED = 0.8;
//   const POWER_SPEED = 0.62;
//   const powerTarget = 0.72;

//   const aimSwishHalfWidth = 0.06 * difficultyMult;
//   const aimMakeHalfWidth = 0.15 * difficultyMult;
//   const powSwishHalfWidth = 0.08 * difficultyMult;
//   const powMakeHalfWidth = 0.18 * difficultyMult;

//   const aimDelta = Math.abs(aim - 0.5);
//   const powerDelta = Math.abs(power - powerTarget);

//   // Boot splash
//   useEffect(() => {
//     const t1 = setTimeout(() => setSplashGone(true), 1600);
//     const t2 = setTimeout(() => setPhase("menu"), 2200);
//     return () => {
//       clearTimeout(t1);
//       clearTimeout(t2);
//     };
//   }, []);

//   // Auth
//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (u) => setUser(u));
//     return () => unsub();
//   }, []);

//   // Save settings
//   useEffect(() => {
//     if (phase === "splash") return;
//     saveJSON("arcade_char_v2", char);
//   }, [char, phase]);

//   useEffect(() => {
//     saveJSON("arcade_settings_v2", { soundOn });
//   }, [soundOn]);

//   // Leaderboard subscription (top 15 for selected mode)
//   useEffect(() => {
//     const col = collection(db, "tournaments", TOURNAMENT_ID, "arcadeLeaderboard");
//     const qref = query(col, orderBy("score", "desc"), limit(15));
//     const unsub = onSnapshot(
//       qref,
//       (snap) => {
//         const rows = snap.docs
//           .map((d) => d.data() as any)
//           .filter((r) => r && typeof r.score === "number" && typeof r.uid === "string")
//           .filter((r) => r.mode === modeId || !r.mode) // backwards compatible if old docs exist
//           .map((r) => ({
//             uid: r.uid,
//             name: r.name || "Player",
//             score: r.score,
//             mode: (r.mode || "free_throw") as ModeId,
//             updatedAt: r.updatedAt,
//           }));
//         setLeaders(rows);
//       },
//       (err) => console.error(err)
//     );
//     return () => unsub();
//   }, [modeId]);

//   function resetRun() {
//     setScore(0);
//     setStreak(0);
//     setBestStreak(0);
//     setAim(0.5);
//     setPower(0);
//     setCharging(false);
//     setMessage("Hold to charge. Release to shoot.");
//     setLastResult(null);
//     setArmPose("idle");
//     setNetPulse("none");

//     ballRef.current = { active: false, x: 0, y: 0, vx: 0, vy: 0, t: 0, result: null };

//     if (mode.durationSec) setTimeLeft(mode.durationSec);
//     else setTimeLeft(null);
//   }

//   function startGame() {
//     resetRun();
//     setPhase("game");
//   }

//   function backToMenu() {
//     stopLoop();
//     setPhase("menu");
//   }

//   // Timed countdown
//   useEffect(() => {
//     if (phase !== "game") return;
//     if (!mode.durationSec) return;
//     if (timeLeft == null) return;

//     if (timeLeft <= 0) {
//       setMessage("Time! Submit your score.");
//       setCharging(false);
//       return;
//     }

//     const t = setTimeout(() => setTimeLeft((s) => (s == null ? s : s - 1)), 1000);
//     return () => clearTimeout(t);
//   }, [phase, timeLeft, mode.durationSec]);

//   // Main loop
//   function stopLoop() {
//     if (rafRef.current) cancelAnimationFrame(rafRef.current);
//     rafRef.current = null;
//     lastTsRef.current = null;
//   }

//   useEffect(() => {
//     if (phase !== "game") return;

//     const loop = (ts: number) => {
//       if (lastTsRef.current == null) lastTsRef.current = ts;
//       const dt = Math.min(0.05, (ts - lastTsRef.current) / 1000);
//       lastTsRef.current = ts;

//       // update meters
//       setAim((prev) => {
//         // ping-pong
//         const dir = (Math.sin(ts / 550) > 0 ? 1 : -1) * 1; // smooth-ish
//         let next = prev + dir * AIM_SPEED * dt;
//         next = clamp01(next);
//         return next;
//       });

//       if (charging) {
//         setPower((prev) => clamp01(prev + POWER_SPEED * dt));
//       }

//       // moving rim phase
//       rimPhaseRef.current += dt * (mode.movingRim ? (1.2 + (1 - difficultyMult) * 2.2) : 0);

//       // physics update
//       const b = ballRef.current;
//       if (b.active) {
//         b.t += dt;
//         b.vy += 1200 * dt; // gravity px/s^2 (down)
//         b.x += b.vx * dt;
//         b.y += b.vy * dt;

//         // resolve hits
//         const outcome = evaluateBall(b);
//         if (outcome) {
//           b.active = false;
//           b.result = outcome;
//           handleResult(outcome);
//         }

//         // ground / timeout
//         if (b.y > 520 || b.t > 1.6) {
//           if (b.active) {
//             b.active = false;
//             b.result = "MISS";
//             handleResult("MISS");
//           }
//         }
//       }

//       draw();
//       rafRef.current = requestAnimationFrame(loop);
//     };

//     rafRef.current = requestAnimationFrame(loop);
//     return () => stopLoop();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [phase, charging, modeId, difficultyMult, soundOn]);

//   // Canvas geometry
//   function canvasGeom() {
//     const canvas = canvasRef.current;
//     if (!canvas) return null;

//     const w = canvas.width;
//     const h = canvas.height;

//     // Rim center (px)
//     const baseX = mode.hoopX * w;
//     const baseY = mode.hoopY * h;

//     // moving rim offset
//     const amp = mode.movingRim ? 60 : 0;
//     const dx = amp ? Math.sin(rimPhaseRef.current) * amp : 0;

//     const rimX = baseX + dx;
//     const rimY = baseY;

//     // Rim sizes
//     const rimR = 18; // collision radius (center-ish)
//     const swishR = 12; // tighter swish center radius

//     // start (hand) position
//     const handX = 0.26 * w;
//     const handY = 0.70 * h;

//     return { w, h, rimX, rimY, rimR, swishR, handX, handY };
//   }

//   function evaluateBall(b: BallState): ShotResult | null {
//     const g = canvasGeom();
//     if (!g) return null;

//     // If the ball passes near rim area while moving downward, count
//     // (simple “crossing” check)
//     const dx = b.x - g.rimX;
//     const dy = b.y - g.rimY;
//     const dist = Math.sqrt(dx * dx + dy * dy);

//     // only when descending
//     if (b.vy <= 0) return null;

//     if (dist <= g.swishR) return "SWISH";
//     if (dist <= g.rimR) return "MAKE";

//     return null;
//   }

//   function handleResult(r: ShotResult) {
//     setLastResult(r);

//     if (r === "SWISH") {
//       setScore((s) => {
//         const next = s + mode.pointsSwish;
//         const best = Math.max(bestScoreLocal, next);
//         setBestScoreLocal(best);
//         localStorage.setItem("arcade_bestscore_v2", String(best));
//         return next;
//       });
//       setStreak((st) => {
//         const next = st + 1;
//         setBestStreak((b) => Math.max(b, next));
//         return next;
//       });
//       setMessage(`SWISH! +${mode.pointsSwish}`);
//       setNetPulse("swish");
//       audio.swish();
//     } else if (r === "MAKE") {
//       setScore((s) => {
//         const next = s + mode.pointsMake;
//         const best = Math.max(bestScoreLocal, next);
//         setBestScoreLocal(best);
//         localStorage.setItem("arcade_bestscore_v2", String(best));
//         return next;
//       });
//       setStreak((st) => {
//         const next = st + 1;
//         setBestStreak((b) => Math.max(b, next));
//         return next;
//       });
//       setMessage(`Bucket! +${mode.pointsMake}`);
//       setNetPulse("make");
//       audio.make();
//     } else {
//       setStreak(0);
//       setMessage("Miss. Try again.");
//       setNetPulse("miss");
//       audio.miss();
//     }

//     setArmPose("idle");
//     setCharging(false);
//     setPower(0);

//     setTimeout(() => setNetPulse("none"), 500);
//   }

//   function startCharge() {
//     if (phase !== "game") return;
//     if (mode.durationSec && (timeLeft ?? 0) <= 0) return;
//     if (ballRef.current.active) return;

//     setLastResult(null);
//     setMessage("Charging...");
//     setPower(0);
//     setCharging(true);
//     setArmPose("ready");

//     // unlock audio on first user interaction
//     audio.tone(220, 30, "sine", 0.0001);
//   }

//   function releaseShot() {
//     if (phase !== "game") return;
//     if (!charging) return;
//     if (ballRef.current.active) return;

//     setCharging(false);
//     setArmPose("shoot");

//     const g = canvasGeom();
//     if (!g) return;

//     // Timing grades (aim + power)
//     const aimIsSwish = aimDelta <= aimSwishHalfWidth;
//     const aimIsMake = aimDelta <= aimMakeHalfWidth;
//     const powIsSwish = powerDelta <= powSwishHalfWidth;
//     const powIsMake = powerDelta <= powMakeHalfWidth;

//     // Build physics shot from values
//     // - power controls speed
//     // - aim controls sideways bias and slight angle tweak
//     // - if you’re off-window, we bias trajectory away from rim
//     const baseSpeed =
//       mode.id === "corner_three"
//         ? 980
//         : mode.id === "moving_rim"
//         ? 930
//         : 900;

//     const speed = baseSpeed + power * 420;

//     // Angle: lift based on power, plus small tweak
//     // (negative vy is up)
//     const lift = 0.55 + power * 0.25; // 0.55..0.80
//     const angleUp = lift; // used as ratio of vy to speed

//     // aim: -0.5..+0.5
//     const aimSigned = aim - 0.5;

//     // Off-window bias: the farther from target, the more sideways drift
//     const aimPenalty = clamp(aimDelta / 0.5, 0, 1);
//     const powPenalty = clamp(powerDelta / 0.8, 0, 1);
//     const penalty = clamp((aimPenalty + powPenalty) * 0.65, 0, 1);

//     // Target rim direction
//     const tx = g.rimX - g.handX;
//     const ty = g.rimY - g.handY;

//     // desired direction baseline (toward rim)
//     const dirX = tx;
//     const dirY = ty;

//     // normalize
//     const len = Math.sqrt(dirX * dirX + dirY * dirY) || 1;

//     // base toward rim velocity
//     let vx = (dirX / len) * speed;
//     let vy = (dirY / len) * speed;

//     // ensure upward arc by forcing a strong upward component
//     // (vy is positive down in our simulation, so we want negative)
//     vy = -Math.abs(speed * angleUp);

//     // add aim sideways: aimSigned influences vx
//     vx += aimSigned * 620;

//     // penalty pushes shot off to side or short/long slightly
//     vx += aimSigned * 520 * penalty;
//     vy += (powerDelta - 0.05) * 420 * penalty; // if power off, slightly short/long

//     // If within make window, lightly "assist" toward rim center
//     const assist = aimIsMake && powIsMake ? 0.18 : aimIsSwish && powIsSwish ? 0.28 : 0;
//     vx = vx * (1 - assist) + (tx / len) * speed * assist;

//     // start ball
//     ballRef.current = {
//       active: true,
//       x: g.handX,
//       y: g.handY,
//       vx,
//       vy,
//       t: 0,
//       result: null,
//     };

//     // Visual message
//     setMessage("Shot!");
//   }

//   function onPress(e: any) {
//     e.preventDefault?.();
//     startCharge();
//   }
//   function onRelease(e: any) {
//     e.preventDefault?.();
//     releaseShot();
//   }

//   function draw() {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     // ensure crisp
//     const dpr = window.devicePixelRatio || 1;
//     const cssW = 860;
//     const cssH = 520;
//     if (canvas.width !== Math.floor(cssW * dpr) || canvas.height !== Math.floor(cssH * dpr)) {
//       canvas.width = Math.floor(cssW * dpr);
//       canvas.height = Math.floor(cssH * dpr);
//       canvas.style.width = `${cssW}px`;
//       canvas.style.height = `${cssH}px`;
//       ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
//     }

//     const g = canvasGeom();
//     if (!g) return;

//     // bg
//     ctx.clearRect(0, 0, g.w, g.h);

//     // court background
//     ctx.fillStyle = "rgba(0,0,0,0.12)";
//     ctx.fillRect(0, 0, 860, 520);

//     // subtle spotlight
//     const grd = ctx.createRadialGradient(660, 120, 20, 660, 120, 420);
//     grd.addColorStop(0, "rgba(255,255,255,0.08)");
//     grd.addColorStop(1, "rgba(255,255,255,0)");
//     ctx.fillStyle = grd;
//     ctx.fillRect(0, 0, 860, 520);

//     // backboard
//     ctx.fillStyle = "rgba(255,255,255,0.08)";
//     ctx.strokeStyle = "rgba(255,255,255,0.12)";
//     roundRect(ctx, g.rimX - 90, g.rimY - 90, 170, 90, 14, true, true);

//     // inner box
//     ctx.strokeStyle = "rgba(242,194,48,0.75)";
//     ctx.lineWidth = 3;
//     roundRect(ctx, g.rimX - 40, g.rimY - 72, 80, 46, 10, false, true);
//     ctx.lineWidth = 1;

//     // rim
//     ctx.strokeStyle = "rgba(242,194,48,0.95)";
//     ctx.lineWidth = 5;
//     ellipse(ctx, g.rimX, g.rimY, 34, 10);
//     ctx.lineWidth = 1;

//     // net
//     const netBoost =
//       netPulse === "swish" ? 1.25 : netPulse === "make" ? 1.15 : netPulse === "miss" ? 0.95 : 1;
//     ctx.save();
//     ctx.translate(g.rimX, g.rimY);
//     ctx.scale(1, netBoost);
//     ctx.strokeStyle = "rgba(255,255,255,0.20)";
//     ctx.beginPath();
//     for (let i = -18; i <= 18; i += 9) {
//       ctx.moveTo(i, 6);
//       ctx.lineTo(i * 0.6, 44);
//     }
//     ctx.stroke();
//     ctx.restore();

//     // player silhouette spot
//     ctx.fillStyle = "rgba(255,255,255,0.05)";
//     ctx.beginPath();
//     ctx.ellipse(g.handX, g.handY + 84, 90, 18, 0, 0, Math.PI * 2);
//     ctx.fill();

//     // ball (if active)
//     const b = ballRef.current;
//     if (b.active) {
//       drawBall(ctx, b.x, b.y);
//     } else {
//       // resting ball by hand if charging or idle
//       if (phase === "game") {
//         drawBall(ctx, g.handX, g.handY);
//       }
//     }
//   }

//   async function submitScore() {
//     setLbMsg("");
//     if (!user) {
//       setLbMsg("Sign in to submit your score.");
//       return;
//     }

//     try {
//       const ref = doc(db, "tournaments", TOURNAMENT_ID, "arcadeLeaderboard", user.uid);
//       const snap = await getDoc(ref);
//       const prev = snap.exists() ? (snap.data() as any).score : 0;

//       // only allow improve
//       if (score <= (prev || 0)) {
//         setLbMsg(`Your saved score is already ${prev || 0}. Beat it to update.`);
//         return;
//       }

//       await setDoc(
//         ref,
//         {
//           uid: user.uid,
//           name: user.displayName || user.email || "Player",
//           score,
//           mode: modeId,
//           updatedAt: serverTimestamp(),
//         },
//         { merge: true }
//       );

//       setLbMsg("✅ Score submitted!");
//     } catch (e) {
//       console.error(e);
//       setLbMsg("Error submitting. Check Firestore rules.");
//     }
//   }

//   return (
//     <main className="wrap">
//       <div className="stage">
//         <div className="bgSpotlights" aria-hidden="true" />
//         <div className="bgVignette" aria-hidden="true" />

//         {phase === "splash" ? (
//           <div className={splashGone ? "splash splashOut" : "splash"}>
//             <div className="splashInner">
//               <div className="splashLine1">Developed by</div>
//               <div className="splashLine2">Charlie Richards</div>
//               <div className="splashLine3">AZ Road to Open Arcade</div>
//             </div>
//           </div>
//         ) : null}

//         <header className="hero">
//           <div className="topbar">
//             <div>
//               <div className="title">🎮 Arcade</div>
//               <div className="subtitle">
//                 Modes, character customization, physics shots, and leaderboard
//               </div>
//             </div>

//             <div className="topActions">
//               <Link className="btn" href="/">
//                 ← Home
//               </Link>
//               <button className="btnGhost" onClick={() => setSoundOn((v) => !v)}>
//                 🔊 {soundOn ? "ON" : "OFF"}
//               </button>

//               {phase === "game" ? (
//                 <>
//                   <button className="btnGhost" onClick={resetRun}>
//                     Reset
//                   </button>
//                   <button className="btnGhost" onClick={backToMenu}>
//                     Menu
//                   </button>
//                 </>
//               ) : null}
//             </div>
//           </div>

//           {phase === "menu" ? (
//             <div className="menuGrid">
//               <section className="card">
//                 <div className="cardTitle">Choose Mode</div>
//                 <div className="modeGrid">
//                   {MODES.map((m) => (
//                     <button
//                       key={m.id}
//                       className={m.id === modeId ? "modeBtn modeBtnOn" : "modeBtn"}
//                       onClick={() => setModeId(m.id)}
//                     >
//                       <div className="modeName">{m.name}</div>
//                       <div className="modeDesc">{m.description}</div>
//                       <div className="modePts">
//                         Make: <b>+{m.pointsMake}</b> • Swish: <b>+{m.pointsSwish}</b>
//                         {m.durationSec ? <> • Time: <b>{m.durationSec}s</b></> : null}
//                       </div>
//                     </button>
//                   ))}
//                 </div>

//                 <div className="menuActions">
//                   <button className="startBtn" onClick={startGame}>
//                     Start {mode.name} →
//                   </button>
//                   <div className="menuNote">
//                     Tip: windows tighten with streak; moving rim speeds up with streak.
//                   </div>
//                 </div>
//               </section>

//               <section className="card cardAlt">
//                 <div className="cardTitle">Customize Player</div>

//                 <div className="customGrid">
//                   <label className="lab">
//                     Skin
//                     <input
//                       className="inp"
//                       type="color"
//                       value={char.skin}
//                       onChange={(e) => setChar((c) => ({ ...c, skin: e.target.value }))}
//                     />
//                   </label>

//                   <label className="lab">
//                     Hair color
//                     <input
//                       className="inp"
//                       type="color"
//                       value={char.hairColor}
//                       onChange={(e) => setChar((c) => ({ ...c, hairColor: e.target.value }))}
//                     />
//                   </label>

//                   <label className="lab">
//                     Jersey color
//                     <input
//                       className="inp"
//                       type="color"
//                       value={char.jersey}
//                       onChange={(e) => setChar((c) => ({ ...c, jersey: e.target.value }))}
//                     />
//                   </label>

//                   <label className="lab">
//                     Shoes
//                     <input
//                       className="inp"
//                       type="color"
//                       value={char.shoes}
//                       onChange={(e) => setChar((c) => ({ ...c, shoes: e.target.value }))}
//                     />
//                   </label>

//                   <label className="lab">
//                     Number
//                     <input
//                       className="inpText"
//                       value={char.number}
//                       onChange={(e) =>
//                         setChar((c) => ({
//                           ...c,
//                           number: e.target.value.replace(/[^\d]/g, "").slice(0, 2),
//                         }))
//                       }
//                       placeholder="00"
//                     />
//                   </label>

//                   <label className="lab">
//                     Hair style
//                     <select
//                       className="inpSelect"
//                       value={char.hairStyle}
//                       onChange={(e) =>
//                         setChar((c) => ({ ...c, hairStyle: e.target.value as any }))
//                       }
//                     >
//                       <option value="short">Short</option>
//                       <option value="fade">Fade</option>
//                       <option value="curly">Curly</option>
//                     </select>
//                   </label>

//                   <label className="lab">
//                     Headband
//                     <button
//                       className={char.headband ? "pill pillOn" : "pill"}
//                       onClick={() => setChar((c) => ({ ...c, headband: !c.headband }))}
//                       type="button"
//                     >
//                       {char.headband ? "ON" : "OFF"}
//                     </button>
//                   </label>

//                   <label className="lab">
//                     Sleeve
//                     <button
//                       className={char.sleeve ? "pill pillOn" : "pill"}
//                       onClick={() => setChar((c) => ({ ...c, sleeve: !c.sleeve }))}
//                       type="button"
//                     >
//                       {char.sleeve ? "ON" : "OFF"}
//                     </button>
//                   </label>

//                   <label className="lab">
//                     Jersey pattern
//                     <select
//                       className="inpSelect"
//                       value={char.jerseyPattern}
//                       onChange={(e) =>
//                         setChar((c) => ({ ...c, jerseyPattern: e.target.value as any }))
//                       }
//                     >
//                       <option value="solid">Solid</option>
//                       <option value="stripe">Stripe</option>
//                       <option value="diagonal">Diagonal</option>
//                     </select>
//                   </label>
//                 </div>

//                 <div className="previewRow">
//                   <div className="previewBox">
//                     <PlayerAvatar char={char} />
//                   </div>
//                   <div className="previewInfo">
//                     <div className="metaLine">
//                       <b>Local best:</b> {bestScoreLocal}
//                     </div>
//                     <div className="metaLine">
//                       <b>Leaderboard:</b> top 15 per mode
//                     </div>
//                     <div className="metaLine">
//                       <b>Scoring:</b> depends on mode
//                     </div>
//                   </div>
//                 </div>
//               </section>

//               <section className="card cardWide">
//                 <div className="cardTitle">Leaderboard (Top 15 • {mode.name})</div>
//                 <div className="lb">
//                   {leaders.length === 0 ? (
//                     <div className="muted">No scores yet.</div>
//                   ) : (
//                     leaders.map((r, idx) => (
//                       <div className="lbRow" key={r.uid}>
//                         <div className="lbRank">#{idx + 1}</div>
//                         <div className="lbName">{r.name}</div>
//                         <div className="lbScore">{r.score}</div>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               </section>
//             </div>
//           ) : null}

//           {phase === "game" ? (
//             <>
//               <section className="hud">
//                 <div className="hudItem">
//                   <div className="hudLabel">Mode</div>
//                   <div className="hudValue">{mode.name}</div>
//                 </div>
//                 <div className="hudItem">
//                   <div className="hudLabel">Score</div>
//                   <div className="hudValue">{score}</div>
//                 </div>
//                 <div className="hudItem">
//                   <div className="hudLabel">Streak</div>
//                   <div className="hudValue">{streak}</div>
//                 </div>
//                 <div className="hudItem">
//                   <div className="hudLabel">Difficulty</div>
//                   <div className="hudValue">{Math.round(difficultyMult * 100)}%</div>
//                 </div>
//               </section>

//               {mode.durationSec ? (
//                 <div className="timerBar">
//                   <div className="timerTitle">⏱ Time left</div>
//                   <div className="timerValue">{timeLeft ?? mode.durationSec}s</div>
//                 </div>
//               ) : null}

//               <section className="gameCard">
//                 <div className="msgRow">
//                   <div className="msg">{message}</div>
//                   <div className="rightChips">
//                     {lastResult ? (
//                       <div
//                         className={
//                           lastResult === "SWISH"
//                             ? "badge badgeSwish"
//                             : lastResult === "MAKE"
//                             ? "badge badgeMake"
//                             : "badge badgeMiss"
//                         }
//                       >
//                         {lastResult}
//                       </div>
//                     ) : null}
//                   </div>
//                 </div>

//                 <div className="court">
//                   <div className="courtLeft">
//                     <PlayerAvatar char={char} armPose={armPose} />
//                     <div className="shootHint">Hold to charge • Release to shoot</div>
//                   </div>

//                   <div className="courtRight">
//                     <canvas ref={canvasRef} className="cv" />
//                   </div>
//                 </div>

//                 {/* Aim meter */}
//                 <div className="meterBlock">
//                   <div className="meterLabel">Aim</div>
//                   <div className="meter">
//                     <div className="zoneMake" style={zoneStyle(0.5, aimMakeHalfWidth)} />
//                     <div className="zoneSwish" style={zoneStyle(0.5, aimSwishHalfWidth)} />
//                     <div className="cursor" style={{ left: `${aim * 100}%` }} />
//                   </div>
//                   <div className="meterHint">Try to release when it hits center green.</div>
//                 </div>

//                 {/* Power meter */}
//                 <div className="meterBlock">
//                   <div className="meterLabel">Power</div>
//                   <div className="meter">
//                     <div className="zoneMake" style={zoneStyle(powerTarget, powMakeHalfWidth)} />
//                     <div className="zoneSwish" style={zoneStyle(powerTarget, powSwishHalfWidth)} />
//                     <div className="fill" style={{ width: `${power * 100}%` }} />
//                   </div>
//                   <div className="meterHint">Hold to fill. Release to shoot.</div>
//                 </div>

//                 <div className="shootArea">
//                   <button
//                     className={charging ? "shootBtn shootBtnDown" : "shootBtn"}
//                     onMouseDown={onPress}
//                     onMouseUp={onRelease}
//                     onMouseLeave={charging ? onRelease : undefined}
//                     onTouchStart={onPress}
//                     onTouchEnd={onRelease}
//                     disabled={mode.durationSec ? (timeLeft ?? 0) <= 0 : false}
//                   >
//                     {mode.durationSec && (timeLeft ?? 0) <= 0
//                       ? "Time Over"
//                       : charging
//                       ? "Release to Shoot"
//                       : "Hold to Charge"}
//                   </button>
//                 </div>

//                 <div className="submitRow">
//                   <button className="submitBtn" onClick={submitScore}>
//                     Submit Score to Leaderboard
//                   </button>
//                   <div className="muted">
//                     {user ? `Signed in as ${user.displayName || user.email}` : "Not signed in"}
//                   </div>
//                   {lbMsg ? <div className="lbMsg">{lbMsg}</div> : null}
//                 </div>
//               </section>
//             </>
//           ) : null}
//         </header>
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
//             radial-gradient(820px 520px at 78% 18%, rgba(242,194,48,0.10), rgba(255,255,255,0) 58%),
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

//         /* Splash */
//         .splash {
//           position: absolute;
//           inset: 0;
//           z-index: 50;
//           display: grid;
//           place-items: center;
//           background: rgba(0,0,0,0.75);
//           backdrop-filter: blur(10px);
//           animation: splashIn 600ms ease forwards;
//         }
//         .splashOut {
//           animation: splashOut 650ms ease forwards;
//         }
//         .splashInner {
//           text-align: center;
//           padding: 18px;
//           border-radius: 18px;
//           border: 1px solid rgba(255,255,255,0.14);
//           background: rgba(255,255,255,0.04);
//           box-shadow: 0 20px 60px rgba(0,0,0,0.45);
//           min-width: min(520px, 92%);
//         }
//         .splashLine1 {
//           opacity: 0.85;
//           letter-spacing: 0.25px;
//           font-weight: 800;
//         }
//         .splashLine2 {
//           margin-top: 6px;
//           font-size: 26px;
//           font-weight: 950;
//           letter-spacing: 0.35px;
//         }
//         .splashLine3 {
//           margin-top: 10px;
//           opacity: 0.7;
//           font-size: 13px;
//         }
//         @keyframes splashIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         @keyframes splashOut {
//           from { opacity: 1; }
//           to { opacity: 0; pointer-events: none; }
//         }

//         .topbar {
//           display: flex;
//           justify-content: space-between;
//           gap: 12px;
//           flex-wrap: wrap;
//           align-items: flex-end;
//         }
//         .title {
//           font-size: 24px;
//           font-weight: 900;
//           letter-spacing: 0.2px;
//         }
//         .subtitle {
//           margin-top: 6px;
//           opacity: 0.75;
//           font-size: 13px;
//           line-height: 18px;
//         }
//         .topActions {
//           display: flex;
//           gap: 10px;
//           flex-wrap: wrap;
//           align-items: center;
//         }
//         .btn {
//           border-radius: 12px;
//           padding: 10px 14px;
//           border: 1px solid rgba(255, 255, 255, 0.28);
//           text-decoration: none;
//           color: #fff;
//           background: rgba(0, 0, 0, 0.22);
//           font-weight: 800;
//         }
//         .btnGhost {
//           border-radius: 12px;
//           padding: 10px 14px;
//           border: 1px solid rgba(255, 255, 255, 0.20);
//           background: rgba(0, 0, 0, 0.18);
//           color: rgba(255, 255, 255, 0.92);
//           font-weight: 800;
//           cursor: pointer;
//         }

//         /* Menu layout */
//         .menuGrid {
//           margin-top: 16px;
//           display: grid;
//           grid-template-columns: 1.1fr 0.9fr;
//           gap: 12px;
//         }
//         .cardWide {
//           grid-column: 1 / -1;
//         }

//         .card {
//           border-radius: 18px;
//           border: 1px solid rgba(242, 194, 48, 0.35);
//           background: rgba(242, 194, 48, 0.07);
//           box-shadow: 0 14px 35px rgba(0, 0, 0, 0.30);
//           padding: 16px;
//         }
//         .cardAlt {
//           border-color: rgba(120,180,255,0.28);
//           background: rgba(120,180,255,0.07);
//         }
//         .cardTitle {
//           font-weight: 950;
//           letter-spacing: 0.2px;
//           margin-bottom: 10px;
//         }

//         .modeGrid {
//           display: grid;
//           gap: 10px;
//         }
//         .modeBtn {
//           text-align: left;
//           border-radius: 14px;
//           border: 1px solid rgba(255,255,255,0.12);
//           background: rgba(0,0,0,0.18);
//           padding: 12px;
//           cursor: pointer;
//           color: #fff;
//         }
//         .modeBtnOn {
//           border-color: rgba(242,194,48,0.45);
//           background: rgba(242,194,48,0.10);
//         }
//         .modeName {
//           font-weight: 950;
//           letter-spacing: 0.2px;
//         }
//         .modeDesc {
//           margin-top: 6px;
//           opacity: 0.82;
//           font-size: 13px;
//           line-height: 18px;
//         }
//         .modePts {
//           margin-top: 8px;
//           opacity: 0.75;
//           font-size: 12px;
//         }

//         .menuActions {
//           margin-top: 14px;
//           display: grid;
//           gap: 10px;
//         }
//         .startBtn {
//           border-radius: 12px;
//           padding: 12px 14px;
//           border: 1px solid rgba(242, 194, 48, 0.60);
//           background: rgba(242, 194, 48, 0.14);
//           color: #fff;
//           font-weight: 950;
//           cursor: pointer;
//         }
//         .menuNote {
//           opacity: 0.75;
//           font-size: 12px;
//           line-height: 16px;
//         }

//         .customGrid {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 10px;
//         }
//         .lab {
//           display: grid;
//           gap: 6px;
//           font-weight: 850;
//           font-size: 12px;
//           opacity: 0.9;
//         }
//         .inp {
//           width: 100%;
//           height: 38px;
//           border-radius: 12px;
//           border: 1px solid rgba(255,255,255,0.18);
//           background: rgba(0,0,0,0.20);
//           padding: 4px 8px;
//         }
//         .inpText, .inpSelect {
//           width: 100%;
//           height: 38px;
//           border-radius: 12px;
//           border: 1px solid rgba(255,255,255,0.18);
//           background: rgba(0,0,0,0.20);
//           padding: 0 10px;
//           color: #fff;
//           font-weight: 900;
//           outline: none;
//         }
//         .pill {
//           padding: 8px 10px;
//           border-radius: 12px;
//           font-weight: 950;
//           letter-spacing: 0.2px;
//           font-size: 12px;
//           border: 1px solid rgba(255,255,255,0.16);
//           background: rgba(0,0,0,0.18);
//           color: #fff;
//           cursor: pointer;
//         }
//         .pillOn {
//           border-color: rgba(120,255,170,0.35);
//           background: rgba(120,255,170,0.10);
//         }

//         .previewRow {
//           margin-top: 12px;
//           display: grid;
//           grid-template-columns: 220px 1fr;
//           gap: 12px;
//           align-items: center;
//         }
//         .previewBox {
//           border-radius: 16px;
//           border: 1px solid rgba(255,255,255,0.12);
//           background: rgba(0,0,0,0.18);
//           padding: 10px;
//           display: grid;
//           place-items: center;
//         }
//         .previewInfo {
//           border-radius: 16px;
//           border: 1px solid rgba(255,255,255,0.10);
//           background: rgba(255,255,255,0.03);
//           padding: 12px;
//           opacity: 0.9;
//         }
//         .metaLine {
//           margin-top: 8px;
//         }
//         .metaLine:first-child {
//           margin-top: 0;
//         }

//         /* Leaderboard list */
//         .lb {
//           display: grid;
//           gap: 8px;
//         }
//         .lbRow {
//           display: grid;
//           grid-template-columns: 60px 1fr 90px;
//           gap: 10px;
//           align-items: center;
//           border-radius: 12px;
//           border: 1px solid rgba(255,255,255,0.10);
//           background: rgba(0,0,0,0.16);
//           padding: 10px;
//         }
//         .lbRank { opacity: 0.8; font-weight: 900; }
//         .lbName { font-weight: 900; }
//         .lbScore { text-align: right; font-weight: 950; }

//         /* Game */
//         .hud {
//           margin-top: 16px;
//           display: grid;
//           grid-template-columns: repeat(4, 1fr);
//           gap: 10px;
//         }
//         .hudItem {
//           border-radius: 16px;
//           border: 1px solid rgba(255,255,255,0.10);
//           background: rgba(255,255,255,0.04);
//           box-shadow: 0 14px 35px rgba(0,0,0,0.25);
//           padding: 12px;
//         }
//         .hudLabel {
//           opacity: 0.7;
//           font-size: 12px;
//           letter-spacing: 0.2px;
//         }
//         .hudValue {
//           margin-top: 6px;
//           font-size: 18px;
//           font-weight: 950;
//           letter-spacing: 0.2px;
//         }

//         .timerBar {
//           margin-top: 12px;
//           border-radius: 16px;
//           border: 1px solid rgba(242,194,48,0.30);
//           background: rgba(242,194,48,0.07);
//           padding: 10px 12px;
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           gap: 12px;
//         }
//         .timerTitle { font-weight: 950; }
//         .timerValue { font-weight: 950; }

//         .gameCard {
//           margin-top: 12px;
//           border-radius: 18px;
//           border: 1px solid rgba(120,180,255,0.28);
//           background: rgba(120,180,255,0.07);
//           box-shadow: 0 14px 35px rgba(0,0,0,0.30);
//           padding: 16px;
//         }

//         .msgRow {
//           display: flex;
//           justify-content: space-between;
//           gap: 10px;
//           flex-wrap: wrap;
//           align-items: center;
//           margin-bottom: 12px;
//         }
//         .msg { font-weight: 950; }
//         .rightChips { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }

//         .badge {
//           padding: 6px 10px;
//           border-radius: 999px;
//           font-weight: 950;
//           letter-spacing: 0.3px;
//           font-size: 12px;
//           border: 1px solid rgba(255,255,255,0.18);
//           background: rgba(0,0,0,0.18);
//           white-space: nowrap;
//         }
//         .badgeSwish {
//           border-color: rgba(120,255,170,0.35);
//           background: rgba(120,255,170,0.10);
//         }
//         .badgeMake {
//           border-color: rgba(242,194,48,0.35);
//           background: rgba(242,194,48,0.12);
//         }
//         .badgeMiss {
//           border-color: rgba(255,120,120,0.35);
//           background: rgba(255,120,120,0.10);
//         }

//         .court {
//           display: grid;
//           grid-template-columns: 260px 1fr;
//           gap: 12px;
//           align-items: start;
//         }
//         .courtLeft {
//           border-radius: 16px;
//           border: 1px solid rgba(255,255,255,0.10);
//           background: rgba(0,0,0,0.16);
//           padding: 10px;
//         }
//         .shootHint {
//           margin-top: 8px;
//           opacity: 0.75;
//           font-size: 12px;
//         }
//         .courtRight {
//           border-radius: 16px;
//           border: 1px solid rgba(255,255,255,0.10);
//           background: rgba(0,0,0,0.12);
//           padding: 10px;
//           overflow: hidden;
//         }
//         .cv {
//           width: 860px;
//           height: 520px;
//           max-width: 100%;
//           display: block;
//           border-radius: 14px;
//         }

//         .meterBlock { margin-top: 12px; }
//         .meterLabel { font-weight: 950; margin-bottom: 8px; }
//         .meter {
//           position: relative;
//           height: 18px;
//           border-radius: 999px;
//           border: 1px solid rgba(255,255,255,0.14);
//           background: rgba(0,0,0,0.22);
//           overflow: hidden;
//         }
//         .zoneMake {
//           position: absolute;
//           top: 0;
//           height: 100%;
//           border-radius: 999px;
//           background: rgba(242, 194, 48, 0.12);
//           border: 1px solid rgba(242, 194, 48, 0.25);
//         }
//         .zoneSwish {
//           position: absolute;
//           top: 0;
//           height: 100%;
//           border-radius: 999px;
//           background: rgba(120, 255, 170, 0.14);
//           border: 1px solid rgba(120, 255, 170, 0.28);
//         }
//         .cursor {
//           position: absolute;
//           top: -3px;
//           width: 10px;
//           height: 24px;
//           border-radius: 999px;
//           background: rgba(255,255,255,0.92);
//           transform: translateX(-50%);
//           box-shadow: 0 0 18px rgba(255,255,255,0.25);
//         }
//         .fill {
//           position: absolute;
//           left: 0;
//           top: 0;
//           height: 100%;
//           border-radius: 999px;
//           background: rgba(120, 180, 255, 0.25);
//         }
//         .meterHint {
//           margin-top: 6px;
//           opacity: 0.75;
//           font-size: 12px;
//           line-height: 16px;
//         }

//         .shootArea {
//           margin-top: 16px;
//           display: grid;
//           place-items: center;
//         }
//         .shootBtn {
//           width: min(640px, 100%);
//           border-radius: 16px;
//           padding: 14px 16px;
//           border: 1px solid rgba(255,255,255,0.20);
//           background: rgba(0,0,0,0.22);
//           color: #fff;
//           font-weight: 950;
//           letter-spacing: 0.2px;
//           cursor: pointer;
//           user-select: none;
//           touch-action: none;
//           transition: transform 120ms ease, background 120ms ease;
//         }
//         .shootBtn:hover { transform: translateY(-1px); }
//         .shootBtnDown { transform: translateY(1px) scale(0.99); background: rgba(0,0,0,0.30); }
//         .shootBtn:disabled { opacity: 0.55; cursor: default; transform: none; }

//         .submitRow {
//           margin-top: 14px;
//           display: grid;
//           gap: 8px;
//           justify-items: start;
//         }
//         .submitBtn {
//           border-radius: 12px;
//           padding: 12px 14px;
//           border: 1px solid rgba(242, 194, 48, 0.60);
//           background: rgba(242, 194, 48, 0.14);
//           color: #fff;
//           font-weight: 950;
//           cursor: pointer;
//         }
//         .muted { opacity: 0.75; }
//         .lbMsg { opacity: 0.9; }

//         @media (max-width: 980px) {
//           .menuGrid { grid-template-columns: 1fr; }
//           .previewRow { grid-template-columns: 1fr; }
//           .court { grid-template-columns: 1fr; }
//         }
//       `}</style>
//     </main>
//   );
// }

// /* ---------- Drawing helpers ---------- */

// function roundRect(
//   ctx: CanvasRenderingContext2D,
//   x: number,
//   y: number,
//   w: number,
//   h: number,
//   r: number,
//   fill: boolean,
//   stroke: boolean
// ) {
//   const rr = Math.min(r, w / 2, h / 2);
//   ctx.beginPath();
//   ctx.moveTo(x + rr, y);
//   ctx.arcTo(x + w, y, x + w, y + h, rr);
//   ctx.arcTo(x + w, y + h, x, y + h, rr);
//   ctx.arcTo(x, y + h, x, y, rr);
//   ctx.arcTo(x, y, x + w, y, rr);
//   ctx.closePath();
//   if (fill) ctx.fill();
//   if (stroke) ctx.stroke();
// }

// function ellipse(ctx: CanvasRenderingContext2D, cx: number, cy: number, rx: number, ry: number) {
//   ctx.beginPath();
//   ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
//   ctx.stroke();
// }

// function drawBall(ctx: CanvasRenderingContext2D, x: number, y: number) {
//   ctx.save();
//   ctx.translate(x, y);
//   ctx.fillStyle = "#e67e22";
//   ctx.strokeStyle = "rgba(0,0,0,0.45)";
//   ctx.lineWidth = 2;
//   ctx.beginPath();
//   ctx.arc(0, 0, 10, 0, Math.PI * 2);
//   ctx.fill();
//   ctx.stroke();

//   ctx.beginPath();
//   ctx.moveTo(0, -10);
//   ctx.lineTo(0, 10);
//   ctx.moveTo(-10, 0);
//   ctx.lineTo(10, 0);
//   ctx.stroke();
//   ctx.restore();
// }

// /* ---------- Character SVG ---------- */

// function PlayerAvatar({
//   char,
//   armPose = "idle",
// }: {
//   char: CharacterConfig;
//   armPose?: "idle" | "ready" | "shoot";
// }) {
//   const armRot =
//     armPose === "idle" ? -10 : armPose === "ready" ? -26 : -58;

//   return (
//     <svg width="240" height="260" viewBox="0 0 240 260" aria-hidden="true">
//       <ellipse cx="120" cy="248" rx="82" ry="10" fill="rgba(0,0,0,0.35)" />

//       {/* legs */}
//       <rect x="94" y="150" width="22" height="70" rx="10" fill="rgba(255,255,255,0.10)" />
//       <rect x="126" y="150" width="22" height="70" rx="10" fill="rgba(255,255,255,0.10)" />

//       {/* shoes */}
//       <rect x="84" y="218" width="44" height="12" rx="7" fill={char.shoes} opacity="0.75" />
//       <rect x="122" y="218" width="44" height="12" rx="7" fill={char.shoes} opacity="0.75" />

//       {/* jersey */}
//       <rect x="78" y="92" width="84" height="70" rx="20" fill={char.jersey} opacity="0.92" />
//       {/* pattern */}
//       {char.jerseyPattern === "stripe" ? (
//         <>
//           <rect x="78" y="118" width="84" height="10" fill="rgba(255,255,255,0.16)" />
//           <rect x="78" y="132" width="84" height="6" fill="rgba(0,0,0,0.16)" />
//         </>
//       ) : char.jerseyPattern === "diagonal" ? (
//         <path
//           d="M78 150 L162 104 L162 120 L78 166 Z"
//           fill="rgba(255,255,255,0.16)"
//         />
//       ) : null}

//       {/* number */}
//       <text
//         x="120"
//         y="134"
//         textAnchor="middle"
//         fontSize="22"
//         fontWeight="900"
//         fill="rgba(255,255,255,0.92)"
//       >
//         {char.number || "00"}
//       </text>

//       {/* head */}
//       <circle cx="120" cy="60" r="26" fill={char.skin} />

//       {/* hair styles */}
//       {char.hairStyle === "short" ? (
//         <path
//           d="M94 60c2-20 18-28 40-24 12 2 22 12 24 24-8-8-16-10-24-10-12 0-22 6-40 10z"
//           fill={char.hairColor}
//         />
//       ) : char.hairStyle === "fade" ? (
//         <path
//           d="M96 62c4-18 18-26 38-24 16 2 24 12 26 24-10-6-16-8-26-8-14 0-24 4-38 8z"
//           fill={char.hairColor}
//           opacity="0.92"
//         />
//       ) : (
//         <>
//           <path
//             d="M92 62c2-22 18-32 44-28 18 3 28 14 30 28-10-10-18-12-30-12-14 0-26 6-44 12z"
//             fill={char.hairColor}
//           />
//           <circle cx="100" cy="44" r="4" fill={char.hairColor} opacity="0.9" />
//           <circle cx="112" cy="40" r="4" fill={char.hairColor} opacity="0.9" />
//           <circle cx="126" cy="40" r="4" fill={char.hairColor} opacity="0.9" />
//           <circle cx="140" cy="44" r="4" fill={char.hairColor} opacity="0.9" />
//         </>
//       )}

//       {/* headband */}
//       {char.headband ? (
//         <rect x="95" y="52" width="50" height="10" rx="6" fill="rgba(255,255,255,0.22)" />
//       ) : null}

//       {/* arms (left static) */}
//       <rect x="58" y="104" width="20" height="56" rx="10" fill={char.skin} opacity="0.92" />

//       {/* right arm animated (rotate around shoulder) */}
//       <g transform={`translate(162 112) rotate(${armRot}) translate(-162 -112)`}>
//         <rect x="162" y="104" width="20" height="56" rx="10" fill={char.skin} opacity="0.92" />
//         {/* sleeve */}
//         {char.sleeve ? (
//           <rect x="162" y="104" width="20" height="18" rx="9" fill="rgba(255,255,255,0.14)" />
//         ) : null}
//       </g>

//       {/* sleeve on left arm */}
//       {char.sleeve ? (
//         <rect x="58" y="104" width="20" height="18" rx="9" fill="rgba(255,255,255,0.14)" />
//       ) : null}
//     </svg>
//   );
// }

// function zoneStyle(center: number, halfWidth: number) {
//   const left = clamp01(center - halfWidth);
//   const right = clamp01(center + halfWidth);
//   return { left: `${left * 100}%`, width: `${(right - left) * 100}%` } as const;
// }


// // created by Charles Richards (github.com/charlierichards13) - 2024
// // ASU Computer Science 2028 Undergrad  




// // adding graphics (retro pixel world + aim prediction + real collisions)

// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import Link from "next/link";
// import {
//   collection,
//   doc,
//   getDoc,
//   limit,
//   onSnapshot,
//   orderBy,
//   query,
//   serverTimestamp,
//   setDoc,
// } from "firebase/firestore";
// import { onAuthStateChanged, type User } from "firebase/auth";

// import { db, auth } from "@/lib/firebase";
// import { TOURNAMENT_ID } from "@/lib/tournament";

// type Phase = "splash" | "menu" | "game";

// type ShotResult = "SWISH" | "MAKE" | "MISS";

// type ModeId = "free_throw" | "corner_three" | "moving_rim" | "timed_pop";

// type Mode = {
//   id: ModeId;
//   name: string;
//   description: string;
//   pointsMake: number;
//   pointsSwish: number;
//   durationSec?: number;
//   movingRim?: boolean;
//   hoopX: number; // normalized (0..1) in WORLD
//   hoopY: number; // normalized (0..1) in WORLD
// };

// type CharacterConfig = {
//   skin: string;
//   hairColor: string;
//   jersey: string;
//   shoes: string;
//   number: string;

//   hairStyle: "short" | "fade" | "curly";
//   headband: boolean;
//   sleeve: boolean;
//   jerseyPattern: "solid" | "stripe" | "diagonal";
// };

// type LeaderRow = {
//   uid: string;
//   name: string;
//   score: number;
//   mode: ModeId;
//   updatedAt?: any;
// };

// const DEFAULT_CHAR: CharacterConfig = {
//   skin: "#D9A074",
//   hairColor: "#2B1B0F",
//   jersey: "#1f6db3",
//   shoes: "#f2c230",
//   number: "13",
//   hairStyle: "fade",
//   headband: false,
//   sleeve: true,
//   jerseyPattern: "stripe",
// };

// const MODES: Mode[] = [
//   {
//     id: "free_throw",
//     name: "Free Throws",
//     description: "Classic line shots. Build streaks and tighten the window.",
//     pointsMake: 2,
//     pointsSwish: 3,
//     hoopX: 0.78,
//     hoopY: 0.33,
//   },
//   {
//     id: "corner_three",
//     name: "Corner 3",
//     description: "Harder angle, more points.",
//     pointsMake: 3,
//     pointsSwish: 4,
//     hoopX: 0.84,
//     hoopY: 0.32,
//   },
//   {
//     id: "moving_rim",
//     name: "Moving Rim",
//     description: "Rim slides left/right. Timing matters.",
//     pointsMake: 3,
//     pointsSwish: 5,
//     movingRim: true,
//     hoopX: 0.78,
//     hoopY: 0.33,
//   },
//   {
//     id: "timed_pop",
//     name: "Pop-A-Shot (30s)",
//     description: "Score as much as possible in 30 seconds.",
//     pointsMake: 2,
//     pointsSwish: 3,
//     durationSec: 30,
//     movingRim: true,
//     hoopX: 0.78,
//     hoopY: 0.33,
//   },
// ];

// function clamp01(x: number) {
//   return Math.max(0, Math.min(1, x));
// }
// function clamp(x: number, lo: number, hi: number) {
//   return Math.max(lo, Math.min(hi, x));
// }

// function loadJSON<T>(key: string, fallback: T): T {
//   try {
//     const raw = localStorage.getItem(key);
//     if (!raw) return fallback;
//     return JSON.parse(raw) as T;
//   } catch {
//     return fallback;
//   }
// }
// function saveJSON(key: string, v: any) {
//   try {
//     localStorage.setItem(key, JSON.stringify(v));
//   } catch {}
// }

// function useAudio(soundOn: boolean) {
//   const ctxRef = useRef<AudioContext | null>(null);

//   function ensure() {
//     if (!soundOn) return null;
//     if (!ctxRef.current) {
//       try {
//         ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
//       } catch {
//         return null;
//       }
//     }
//     return ctxRef.current;
//   }

//   function tone(freq: number, durMs: number, type: OscillatorType, gain = 0.08) {
//     const ctx = ensure();
//     if (!ctx) return;
//     const t0 = ctx.currentTime;

//     const osc = ctx.createOscillator();
//     const g = ctx.createGain();

//     osc.type = type;
//     osc.frequency.setValueAtTime(freq, t0);

//     g.gain.setValueAtTime(0.0001, t0);
//     g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02);
//     g.gain.exponentialRampToValueAtTime(0.0001, t0 + durMs / 1000);

//     osc.connect(g);
//     g.connect(ctx.destination);

//     osc.start(t0);
//     osc.stop(t0 + durMs / 1000 + 0.02);
//   }

//   function swish() {
//     const ctx = ensure();
//     if (!ctx) return;
//     const t0 = ctx.currentTime;

//     const osc = ctx.createOscillator();
//     const g = ctx.createGain();

//     osc.type = "sine";
//     osc.frequency.setValueAtTime(880, t0);
//     osc.frequency.exponentialRampToValueAtTime(440, t0 + 0.16);

//     g.gain.setValueAtTime(0.0001, t0);
//     g.gain.exponentialRampToValueAtTime(0.09, t0 + 0.02);
//     g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.18);

//     osc.connect(g);
//     g.connect(ctx.destination);

//     osc.start(t0);
//     osc.stop(t0 + 0.2);
//   }

//   function make() {
//     tone(660, 90, "triangle", 0.07);
//     setTimeout(() => tone(880, 110, "triangle", 0.07), 90);
//   }

//   function miss() {
//     tone(140, 160, "sine", 0.09);
//   }

//   return { swish, make, miss, tone };
// }

// /**
//  * =========================
//  * Retro world canvas setup
//  * =========================
//  * We render to a low-res “WORLD” buffer (pixel art), then scale up crisp.
//  * Turning off smoothing keeps it sharp (nearest-neighbor style). :contentReference[oaicite:2]{index=2}
//  */
// const WORLD_W = 320;
// const WORLD_H = 180;
// const SCALE = 3; // CSS scale factor
// const CSS_W = WORLD_W * SCALE;
// const CSS_H = WORLD_H * SCALE;

// // Physics tuning (world units)
// const BALL_R = 4;
// const GRAVITY = 430; // world px/s^2
// const FLOOR_Y = 166; // court floor line (world y)
// const WALL_PAD = 2;

// // restitution
// const E_RIM = 0.55;
// const E_BOARD = 0.42;
// const E_FLOOR = 0.28;
// const E_WALL = 0.30;

// // friction / damping
// const FLOOR_FRICTION = 0.86; // tangential damping on floor bounce
// const AIR_DRAG = 0.998; // tiny damping per tick

// type BallState = {
//   active: boolean;
//   x: number;
//   y: number;
//   vx: number;
//   vy: number;
//   t: number;

//   prevX: number;
//   prevY: number;

//   touchedRim: boolean;
//   touchedBoard: boolean;

//   result: ShotResult | null;
// };

// type Geom = {
//   rimX: number;
//   rimY: number;

//   // rim posts (2 circles)
//   rimLeftX: number;
//   rimRightX: number;
//   rimPostY: number;
//   rimPostR: number;

//   // scoring window (inside ring)
//   scoreHalfW: number;
//   scoreY: number;

//   // backboard AABB
//   boardX: number;
//   boardY: number;
//   boardW: number;
//   boardH: number;

//   // hand position
//   handX: number;
//   handY: number;

//   // moving rim offset
//   dx: number;
// };

// function reflect(vx: number, vy: number, nx: number, ny: number, e: number) {
//   // reflect across normal with coefficient of restitution
//   // v' = v - (1+e)*(v·n)*n
//   const dot = vx * nx + vy * ny;
//   const k = (1 + e) * dot;
//   return { vx: vx - k * nx, vy: vy - k * ny };
// }

// function circleResolve(
//   b: BallState,
//   cx: number,
//   cy: number,
//   cr: number,
//   e: number,
//   mark: "rim" | "board" | null = null
// ) {
//   const dx = b.x - cx;
//   const dy = b.y - cy;
//   const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;
//   const minD = BALL_R + cr;

//   if (dist >= minD) return false;

//   // push out
//   const nx = dx / dist;
//   const ny = dy / dist;

//   b.x = cx + nx * minD;
//   b.y = cy + ny * minD;

//   // reflect velocity if moving into surface
//   const into = b.vx * nx + b.vy * ny;
//   if (into < 0) {
//     const r = reflect(b.vx, b.vy, nx, ny, e);
//     b.vx = r.vx;
//     b.vy = r.vy;

//     // little tangential damping to stop infinite pinball
//     b.vx *= 0.96;
//     b.vy *= 0.98;
//   }

//   if (mark === "rim") b.touchedRim = true;
//   if (mark === "board") b.touchedBoard = true;
//   return true;
// }

// function aabbResolve(b: BallState, rx: number, ry: number, rw: number, rh: number, e: number) {
//   // circle vs AABB (simple resolve by closest point)
//   const closestX = clamp(b.x, rx, rx + rw);
//   const closestY = clamp(b.y, ry, ry + rh);

//   const dx = b.x - closestX;
//   const dy = b.y - closestY;
//   const dist2 = dx * dx + dy * dy;

//   if (dist2 > BALL_R * BALL_R) return false;

//   const dist = Math.sqrt(dist2) || 0.0001;
//   const nx = dx / dist;
//   const ny = dy / dist;

//   // push out
//   b.x = closestX + nx * (BALL_R + 0.01);
//   b.y = closestY + ny * (BALL_R + 0.01);

//   // reflect if moving into wall
//   const into = b.vx * nx + b.vy * ny;
//   if (into < 0) {
//     const r = reflect(b.vx, b.vy, nx, ny, e);
//     b.vx = r.vx;
//     b.vy = r.vy;
//     b.vx *= 0.98;
//     b.vy *= 0.98;
//   }

//   b.touchedBoard = true;
//   return true;
// }

// function floorResolve(b: BallState) {
//   if (b.y + BALL_R < FLOOR_Y) return false;
//   b.y = FLOOR_Y - BALL_R;

//   if (b.vy > 0) {
//     b.vy = -b.vy * E_FLOOR;
//     b.vx = b.vx * FLOOR_FRICTION;
//   }

//   // if it’s basically stopped, freeze
//   if (Math.abs(b.vy) < 18 && Math.abs(b.vx) < 10) {
//     b.vy = 0;
//     b.vx = 0;
//   }
//   return true;
// }

// function wallResolve(b: BallState) {
//   let hit = false;

//   if (b.x - BALL_R < WALL_PAD) {
//     b.x = WALL_PAD + BALL_R;
//     if (b.vx < 0) b.vx = -b.vx * E_WALL;
//     hit = true;
//   }
//   if (b.x + BALL_R > WORLD_W - WALL_PAD) {
//     b.x = WORLD_W - WALL_PAD - BALL_R;
//     if (b.vx > 0) b.vx = -b.vx * E_WALL;
//     hit = true;
//   }
//   if (b.y - BALL_R < WALL_PAD) {
//     b.y = WALL_PAD + BALL_R;
//     if (b.vy < 0) b.vy = -b.vy * E_WALL;
//     hit = true;
//   }

//   return hit;
// }

// function computeGeom(mode: Mode, rimPhase: number, difficultyMult: number): Geom {
//   const baseX = mode.hoopX * WORLD_W;
//   const baseY = mode.hoopY * WORLD_H;

//   const amp = mode.movingRim ? 22 : 0;
//   const dx = amp ? Math.sin(rimPhase) * amp * (1.0 + (1 - difficultyMult) * 0.35) : 0;

//   const rimX = baseX + dx;
//   const rimY = baseY;

//   // rim posts (collision points)
//   const rimSpan = 22; // half distance between posts
//   const rimPostR = 3.2;

//   const rimLeftX = rimX - rimSpan;
//   const rimRightX = rimX + rimSpan;
//   const rimPostY = rimY + 2;

//   // scoring window (inside ring)
//   const scoreHalfW = 13;
//   const scoreY = rimY + 2;

//   // backboard (aabb)
//   const boardW = 78;
//   const boardH = 34;
//   const boardX = rimX - 44;
//   const boardY = rimY - 36;

//   // hand (player)
//   const handX = 0.22 * WORLD_W;
//   const handY = 0.72 * WORLD_H;

//   return {
//     rimX,
//     rimY,
//     rimLeftX,
//     rimRightX,
//     rimPostY,
//     rimPostR,
//     scoreHalfW,
//     scoreY,
//     boardX,
//     boardY,
//     boardW,
//     boardH,
//     handX,
//     handY,
//     dx,
//   };
// }

// function checkScore(b: BallState, g: Geom): ShotResult | null {
//   // score if ball crosses the rim plane downward between posts
//   const crossedDown = b.prevY < g.scoreY && b.y >= g.scoreY && b.vy > 0;
//   if (!crossedDown) return null;

//   const insideX = Math.abs(b.x - g.rimX) <= g.scoreHalfW;
//   if (!insideX) return null;

//   // swish only if you didn't touch rim/board before crossing
//   if (!b.touchedRim && !b.touchedBoard) return "SWISH";
//   return "MAKE";
// }

// function simulateTrajectory(
//   init: { x: number; y: number; vx: number; vy: number },
//   mode: Mode,
//   rimPhase: number,
//   difficultyMult: number
// ) {
//   const g = computeGeom(mode, rimPhase, difficultyMult);

//   // local “ball” copy
//   const b: BallState = {
//     active: true,
//     x: init.x,
//     y: init.y,
//     vx: init.vx,
//     vy: init.vy,
//     t: 0,
//     prevX: init.x,
//     prevY: init.y,
//     touchedRim: false,
//     touchedBoard: false,
//     result: null,
//   };

//   const pts: Array<{ x: number; y: number }> = [];
//   const dt = 1 / 60;

//   for (let i = 0; i < 120; i++) {
//     b.prevX = b.x;
//     b.prevY = b.y;

//     // integrate
//     b.vy += GRAVITY * dt;
//     b.x += b.vx * dt;
//     b.y += b.vy * dt;

//     // drag
//     b.vx *= AIR_DRAG;
//     b.vy *= AIR_DRAG;

//     // collisions
//     aabbResolve(b, g.boardX, g.boardY, g.boardW, g.boardH, E_BOARD);
//     circleResolve(b, g.rimLeftX, g.rimPostY, g.rimPostR, E_RIM, "rim");
//     circleResolve(b, g.rimRightX, g.rimPostY, g.rimPostR, E_RIM, "rim");
//     wallResolve(b);
//     floorResolve(b);

//     pts.push({ x: b.x, y: b.y });

//     // stop if it would “end”
//     if (b.y > FLOOR_Y + 8) break;

//     // stop if scored (we still want a few dots after)
//     const scored = checkScore(b, g);
//     if (scored) {
//       // add a couple more points so the path shows it passing through
//       for (let k = 0; k < 6; k++) {
//         b.prevX = b.x;
//         b.prevY = b.y;
//         b.vy += GRAVITY * dt;
//         b.x += b.vx * dt;
//         b.y += b.vy * dt;
//         pts.push({ x: b.x, y: b.y });
//       }
//       break;
//     }
//   }

//   return pts;
// }

// export default function ArcadePage() {
//   const [phase, setPhase] = useState<Phase>("splash");
//   const [splashGone, setSplashGone] = useState(false);

//   const [user, setUser] = useState<User | null>(null);

//   const [modeId, setModeId] = useState<ModeId>("free_throw");
//   const mode = useMemo(() => MODES.find((m) => m.id === modeId)!, [modeId]);

//   const [char, setChar] = useState<CharacterConfig>(() =>
//     loadJSON<CharacterConfig>("arcade_char_v3", DEFAULT_CHAR)
//   );

//   const [soundOn, setSoundOn] = useState<boolean>(() => {
//     const v = loadJSON<{ soundOn: boolean }>("arcade_settings_v3", { soundOn: true });
//     return !!v.soundOn;
//   });

//   const audio = useAudio(soundOn);

//   // Leaderboard
//   const [leaders, setLeaders] = useState<LeaderRow[]>([]);
//   const [lbMsg, setLbMsg] = useState("");

//   // Game state
//   const [score, setScore] = useState(0);
//   const [bestScoreLocal, setBestScoreLocal] = useState<number>(() =>
//     Number(localStorage.getItem("arcade_bestscore_v3") || "0") || 0
//   );
//   const [streak, setStreak] = useState(0);
//   const [bestStreak, setBestStreak] = useState(0);
//   const [message, setMessage] = useState("Hold to charge. Release to shoot.");
//   const [lastResult, setLastResult] = useState<ShotResult | null>(null);

//   // Meter values
//   const [aim, setAim] = useState(0.5); // 0..1
//   const [power, setPower] = useState(0);
//   const [charging, setCharging] = useState(false);

//   // Timed mode
//   const [timeLeft, setTimeLeft] = useState<number | null>(null);

//   // Canvas
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);
//   const offscreenRef = useRef<HTMLCanvasElement | null>(null);

//   const rafRef = useRef<number | null>(null);
//   const lastTsRef = useRef<number | null>(null);

//   // Player anim
//   const [armPose, setArmPose] = useState<"idle" | "ready" | "shoot">("idle");
//   const [netPulse, setNetPulse] = useState<"none" | "make" | "swish" | "miss">("none");

//   // Physics state in a ref for stable updates
//   const ballRef = useRef<BallState>({
//     active: false,
//     x: 0,
//     y: 0,
//     vx: 0,
//     vy: 0,
//     t: 0,
//     prevX: 0,
//     prevY: 0,
//     touchedRim: false,
//     touchedBoard: false,
//     result: null,
//   });

//   // Moving rim
//   const rimPhaseRef = useRef(0);

//   // Difficulty ramp
//   const difficultyMult = useMemo(() => clamp(1 - streak * 0.03, 0.55, 1), [streak]);

//   // Meter tuning
//   const AIM_SPEED = 0.9;
//   const POWER_SPEED = 0.65;
//   const powerTarget = 0.72;

//   const aimSwishHalfWidth = 0.06 * difficultyMult;
//   const aimMakeHalfWidth = 0.15 * difficultyMult;
//   const powSwishHalfWidth = 0.08 * difficultyMult;
//   const powMakeHalfWidth = 0.18 * difficultyMult;

//   const aimDelta = Math.abs(aim - 0.5);
//   const powerDelta = Math.abs(power - powerTarget);

//   // Boot splash (full page)
//   useEffect(() => {
//     const t1 = setTimeout(() => setSplashGone(true), 1600);
//     const t2 = setTimeout(() => setPhase("menu"), 2200);
//     return () => {
//       clearTimeout(t1);
//       clearTimeout(t2);
//     };
//   }, []);

//   // Auth
//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (u) => setUser(u));
//     return () => unsub();
//   }, []);

//   // Save settings
//   useEffect(() => {
//     if (phase === "splash") return;
//     saveJSON("arcade_char_v3", char);
//   }, [char, phase]);

//   useEffect(() => {
//     saveJSON("arcade_settings_v3", { soundOn });
//   }, [soundOn]);

//   // Leaderboard subscription (top 15 for selected mode)
//   useEffect(() => {
//     const col = collection(db, "tournaments", TOURNAMENT_ID, "arcadeLeaderboard");
//     const qref = query(col, orderBy("score", "desc"), limit(15));
//     const unsub = onSnapshot(
//       qref,
//       (snap) => {
//         const rows = snap.docs
//           .map((d) => d.data() as any)
//           .filter((r) => r && typeof r.score === "number" && typeof r.uid === "string")
//           .filter((r) => r.mode === modeId || !r.mode)
//           .map((r) => ({
//             uid: r.uid,
//             name: r.name || "Player",
//             score: r.score,
//             mode: (r.mode || "free_throw") as ModeId,
//             updatedAt: r.updatedAt,
//           }));
//         setLeaders(rows);
//       },
//       (err) => console.error(err)
//     );
//     return () => unsub();
//   }, [modeId]);

//   function resetRun() {
//     setScore(0);
//     setStreak(0);
//     setBestStreak(0);
//     setAim(0.5);
//     setPower(0);
//     setCharging(false);
//     setMessage("Hold to charge. Release to shoot.");
//     setLastResult(null);
//     setArmPose("idle");
//     setNetPulse("none");

//     ballRef.current = {
//       active: false,
//       x: 0,
//       y: 0,
//       vx: 0,
//       vy: 0,
//       t: 0,
//       prevX: 0,
//       prevY: 0,
//       touchedRim: false,
//       touchedBoard: false,
//       result: null,
//     };

//     if (mode.durationSec) setTimeLeft(mode.durationSec);
//     else setTimeLeft(null);
//   }

//   function startGame() {
//     resetRun();
//     setPhase("game");
//   }

//   function backToMenu() {
//     stopLoop();
//     setPhase("menu");
//   }

//   // Timed countdown
//   useEffect(() => {
//     if (phase !== "game") return;
//     if (!mode.durationSec) return;
//     if (timeLeft == null) return;

//     if (timeLeft <= 0) {
//       setMessage("Time! Submit your score.");
//       setCharging(false);
//       return;
//     }

//     const t = setTimeout(() => setTimeLeft((s) => (s == null ? s : s - 1)), 1000);
//     return () => clearTimeout(t);
//   }, [phase, timeLeft, mode.durationSec]);

//   function stopLoop() {
//     if (rafRef.current) cancelAnimationFrame(rafRef.current);
//     rafRef.current = null;
//     lastTsRef.current = null;
//   }

//   // Main loop
//   useEffect(() => {
//     if (phase !== "game") return;

//     const loop = (ts: number) => {
//       if (lastTsRef.current == null) lastTsRef.current = ts;
//       const dt = Math.min(0.05, (ts - lastTsRef.current) / 1000);
//       lastTsRef.current = ts;

//       // meters (aim ping-pong)
//       setAim((prev) => {
//         const dir = Math.sin(ts / 520) > 0 ? 1 : -1;
//         return clamp01(prev + dir * AIM_SPEED * dt);
//       });
//       if (charging) setPower((prev) => clamp01(prev + POWER_SPEED * dt));

//       // moving rim
//       rimPhaseRef.current += dt * (mode.movingRim ? (1.2 + (1 - difficultyMult) * 2.2) : 0);

//       // physics
//       const b = ballRef.current;

//       if (b.active) {
//         b.t += dt;

//         b.prevX = b.x;
//         b.prevY = b.y;

//         b.vy += GRAVITY * dt;
//         b.x += b.vx * dt;
//         b.y += b.vy * dt;

//         b.vx *= AIR_DRAG;
//         b.vy *= AIR_DRAG;

//         const g = computeGeom(mode, rimPhaseRef.current, difficultyMult);

//         // collisions
//         aabbResolve(b, g.boardX, g.boardY, g.boardW, g.boardH, E_BOARD);
//         circleResolve(b, g.rimLeftX, g.rimPostY, g.rimPostR, E_RIM, "rim");
//         circleResolve(b, g.rimRightX, g.rimPostY, g.rimPostR, E_RIM, "rim");
//         wallResolve(b);
//         floorResolve(b);

//         // score check
//         const scored = checkScore(b, g);
//         if (scored) {
//           b.active = false;
//           b.result = scored;
//           handleResult(scored);
//         }

//         // timeout
//         if (b.t > 2.4) {
//           if (b.active) {
//             b.active = false;
//             b.result = "MISS";
//             handleResult("MISS");
//           }
//         }
//       }

//       draw();
//       rafRef.current = requestAnimationFrame(loop);
//     };

//     rafRef.current = requestAnimationFrame(loop);
//     return () => stopLoop();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [phase, charging, modeId, difficultyMult, soundOn, aim, power]);

//   function handleResult(r: ShotResult) {
//     setLastResult(r);

//     if (r === "SWISH") {
//       setScore((s) => {
//         const next = s + mode.pointsSwish;
//         const best = Math.max(bestScoreLocal, next);
//         setBestScoreLocal(best);
//         localStorage.setItem("arcade_bestscore_v3", String(best));
//         return next;
//       });
//       setStreak((st) => {
//         const next = st + 1;
//         setBestStreak((b) => Math.max(b, next));
//         return next;
//       });
//       setMessage(`SWISH! +${mode.pointsSwish}`);
//       setNetPulse("swish");
//       audio.swish();
//     } else if (r === "MAKE") {
//       setScore((s) => {
//         const next = s + mode.pointsMake;
//         const best = Math.max(bestScoreLocal, next);
//         setBestScoreLocal(best);
//         localStorage.setItem("arcade_bestscore_v3", String(best));
//         return next;
//       });
//       setStreak((st) => {
//         const next = st + 1;
//         setBestStreak((b) => Math.max(b, next));
//         return next;
//       });
//       setMessage(`Bucket! +${mode.pointsMake}`);
//       setNetPulse("make");
//       audio.make();
//     } else {
//       setStreak(0);
//       setMessage("Miss. Try again.");
//       setNetPulse("miss");
//       audio.miss();
//     }

//     setArmPose("idle");
//     setCharging(false);
//     setPower(0);

//     setTimeout(() => setNetPulse("none"), 520);
//   }

//   function startCharge() {
//     if (phase !== "game") return;
//     if (mode.durationSec && (timeLeft ?? 0) <= 0) return;
//     if (ballRef.current.active) return;

//     setLastResult(null);
//     setMessage("Charging...");
//     setPower(0);
//     setCharging(true);
//     setArmPose("ready");

//     // unlock audio on first user interaction
//     audio.tone(220, 30, "sine", 0.0001);
//   }

//   function computeShotVelocity() {
//     const g = computeGeom(mode, rimPhaseRef.current, difficultyMult);

//     // timing grades
//     const aimIsSwish = aimDelta <= aimSwishHalfWidth;
//     const aimIsMake = aimDelta <= aimMakeHalfWidth;
//     const powIsSwish = powerDelta <= powSwishHalfWidth;
//     const powIsMake = powerDelta <= powMakeHalfWidth;

//     // base shot speed in WORLD units
//     const baseSpeed =
//       mode.id === "corner_three"
//         ? 320
//         : mode.id === "moving_rim"
//         ? 305
//         : 300;

//     const speed = baseSpeed + power * 150;

//     // “upward arc”
//     const lift = 0.62 + power * 0.22;

//     // aim: -0.5..+0.5
//     const aimSigned = aim - 0.5;

//     const aimPenalty = clamp(aimDelta / 0.5, 0, 1);
//     const powPenalty = clamp(powerDelta / 0.8, 0, 1);
//     const penalty = clamp((aimPenalty + powPenalty) * 0.65, 0, 1);

//     // target
//     const tx = g.rimX - g.handX;
//     const ty = g.rimY - g.handY;

//     const len = Math.sqrt(tx * tx + ty * ty) || 1;

//     // base toward rim velocity
//     let vx = (tx / len) * speed;
//     let vy = (ty / len) * speed;

//     // force upward arc (negative vy is up in world? Actually y+ is down, so up = negative)
//     vy = -Math.abs(speed * lift);

//     // aim shifts sideways
//     vx += aimSigned * 190;

//     // penalty pushes off
//     vx += aimSigned * 160 * penalty;
//     vy += (powerDelta - 0.05) * 120 * penalty;

//     // assist
//     const assist = aimIsMake && powIsMake ? 0.16 : aimIsSwish && powIsSwish ? 0.24 : 0;
//     vx = vx * (1 - assist) + (tx / len) * speed * assist;

//     return { g, vx, vy };
//   }

//   function releaseShot() {
//     if (phase !== "game") return;
//     if (!charging) return;
//     if (ballRef.current.active) return;

//     setCharging(false);
//     setArmPose("shoot");

//     const { g, vx, vy } = computeShotVelocity();

//     ballRef.current = {
//       active: true,
//       x: g.handX,
//       y: g.handY,
//       vx,
//       vy,
//       t: 0,
//       prevX: g.handX,
//       prevY: g.handY,
//       touchedRim: false,
//       touchedBoard: false,
//       result: null,
//     };

//     setMessage("Shot!");
//   }

//   function onPress(e: any) {
//     e.preventDefault?.();
//     startCharge();
//   }
//   function onRelease(e: any) {
//     e.preventDefault?.();
//     releaseShot();
//   }

//   function ensureCanvases() {
//     const canvas = canvasRef.current;
//     if (!canvas) return null;

//     const dpr = window.devicePixelRatio || 1;

//     // main canvas sized for crisp scale
//     if (
//       canvas.width !== Math.floor(CSS_W * dpr) ||
//       canvas.height !== Math.floor(CSS_H * dpr)
//     ) {
//       canvas.width = Math.floor(CSS_W * dpr);
//       canvas.height = Math.floor(CSS_H * dpr);
//       canvas.style.width = `${CSS_W}px`;
//       canvas.style.height = `${CSS_H}px`;
//     }

//     const ctx = canvas.getContext("2d");
//     if (!ctx) return null;

//     // offscreen world buffer
//     if (!offscreenRef.current) {
//       const off = document.createElement("canvas");
//       off.width = WORLD_W;
//       off.height = WORLD_H;
//       offscreenRef.current = off;
//     }

//     const off = offscreenRef.current!;
//     const offCtx = off.getContext("2d");
//     if (!offCtx) return null;

//     // pixel style
//     ctx.imageSmoothingEnabled = false;
//     offCtx.imageSmoothingEnabled = false;

//     // reset transform
//     ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

//     return { ctx, offCtx, off };
//   }

//   function draw() {
//     const pack = ensureCanvases();
//     if (!pack) return;

//     const { ctx, offCtx, off } = pack;

//     // clear world buffer
//     offCtx.clearRect(0, 0, WORLD_W, WORLD_H);

//     // geom
//     const g = computeGeom(mode, rimPhaseRef.current, difficultyMult);

//     // draw world
//     drawRetroWorld(offCtx, g, netPulse, score, streak, mode.name);

//     // prediction (while charging, and no ball active)
//     if (!ballRef.current.active && phase === "game") {
//       const { g: gg, vx, vy } = computeShotVelocity();
//       // show prediction stronger when charging
//       const pts = simulateTrajectory({ x: gg.handX, y: gg.handY, vx, vy }, mode, rimPhaseRef.current, difficultyMult);
//       drawPrediction(offCtx, pts, charging);
//     }

//     // ball
//     const b = ballRef.current;
//     if (phase === "game") {
//       if (b.active) drawBallPixel(offCtx, b.x, b.y);
//       else drawBallPixel(offCtx, g.handX, g.handY);
//     }

//     // scale world to main
//     ctx.clearRect(0, 0, CSS_W, CSS_H);
//     ctx.drawImage(off, 0, 0, CSS_W, CSS_H);
//   }

//   async function submitScore() {
//     setLbMsg("");
//     if (!user) {
//       setLbMsg("Sign in to submit your score.");
//       return;
//     }

//     try {
//       const ref = doc(db, "tournaments", TOURNAMENT_ID, "arcadeLeaderboard", user.uid);
//       const snap = await getDoc(ref);
//       const prev = snap.exists() ? (snap.data() as any).score : 0;

//       if (score <= (prev || 0)) {
//         setLbMsg(`Your saved score is already ${prev || 0}. Beat it to update.`);
//         return;
//       }

//       await setDoc(
//         ref,
//         {
//           uid: user.uid,
//           name: user.displayName || user.email || "Player",
//           score,
//           mode: modeId,
//           updatedAt: serverTimestamp(),
//         },
//         { merge: true }
//       );

//       setLbMsg("✅ Score submitted!");
//     } catch (e) {
//       console.error(e);
//       setLbMsg("Error submitting. Check Firestore rules.");
//     }
//   }

//   return (
//     <main className={phase === "splash" ? "wrap wrapSplash" : "wrap"}>
//       <div className={phase === "splash" ? "stage stageFull" : "stage"}>
//         <div className="bgSpotlights" aria-hidden="true" />
//         <div className="bgVignette" aria-hidden="true" />

//         {phase === "splash" ? (
//           <div className={splashGone ? "splash splashOut" : "splash"}>
//             <div className="splashInner">
//               <div className="splashLine1">Developed by</div>
//               <div className="splashLine2">Charlie Richards</div>
//               <div className="splashLine3">AZ Road to Open Arcade</div>
//               <div className="splashLine4">Loading…</div>
//             </div>
//           </div>
//         ) : null}

//         <header className="hero">
//           <div className="topbar">
//             <div>
//               <div className="title">🎮 Arcade</div>
//               <div className="subtitle">
//                 Retro world, trajectory preview, collisions, and leaderboard
//               </div>
//             </div>

//             <div className="topActions">
//               <Link className="btn" href="/">
//                 ← Home
//               </Link>
//               <button className="btnGhost" onClick={() => setSoundOn((v) => !v)}>
//                 🔊 {soundOn ? "ON" : "OFF"}
//               </button>

//               {phase === "game" ? (
//                 <>
//                   <button className="btnGhost" onClick={resetRun}>
//                     Reset
//                   </button>
//                   <button className="btnGhost" onClick={backToMenu}>
//                     Menu
//                   </button>
//                 </>
//               ) : null}
//             </div>
//           </div>

//           {phase === "menu" ? (
//             <div className="menuGrid">
//               <section className="card">
//                 <div className="cardTitle">Choose Mode</div>
//                 <div className="modeGrid">
//                   {MODES.map((m) => (
//                     <button
//                       key={m.id}
//                       className={m.id === modeId ? "modeBtn modeBtnOn" : "modeBtn"}
//                       onClick={() => setModeId(m.id)}
//                     >
//                       <div className="modeName">{m.name}</div>
//                       <div className="modeDesc">{m.description}</div>
//                       <div className="modePts">
//                         Make: <b>+{m.pointsMake}</b> • Swish: <b>+{m.pointsSwish}</b>
//                         {m.durationSec ? (
//                           <>
//                             {" "}
//                             • Time: <b>{m.durationSec}s</b>
//                           </>
//                         ) : null}
//                       </div>
//                     </button>
//                   ))}
//                 </div>

//                 <div className="menuActions">
//                   <button className="startBtn" onClick={startGame}>
//                     Start {mode.name} →
//                   </button>
//                   <div className="menuNote">
//                     Tip: trajectory preview shows where the shot will go if you release now.
//                   </div>
//                 </div>
//               </section>

//               <section className="card cardAlt">
//                 <div className="cardTitle">Customize Player</div>

//                 <div className="customGrid">
//                   <label className="lab">
//                     Skin
//                     <input
//                       className="inp"
//                       type="color"
//                       value={char.skin}
//                       onChange={(e) => setChar((c) => ({ ...c, skin: e.target.value }))}
//                     />
//                   </label>

//                   <label className="lab">
//                     Hair color
//                     <input
//                       className="inp"
//                       type="color"
//                       value={char.hairColor}
//                       onChange={(e) => setChar((c) => ({ ...c, hairColor: e.target.value }))}
//                     />
//                   </label>

//                   <label className="lab">
//                     Jersey color
//                     <input
//                       className="inp"
//                       type="color"
//                       value={char.jersey}
//                       onChange={(e) => setChar((c) => ({ ...c, jersey: e.target.value }))}
//                     />
//                   </label>

//                   <label className="lab">
//                     Shoes
//                     <input
//                       className="inp"
//                       type="color"
//                       value={char.shoes}
//                       onChange={(e) => setChar((c) => ({ ...c, shoes: e.target.value }))}
//                     />
//                   </label>

//                   <label className="lab">
//                     Number
//                     <input
//                       className="inpText"
//                       value={char.number}
//                       onChange={(e) =>
//                         setChar((c) => ({
//                           ...c,
//                           number: e.target.value.replace(/[^\d]/g, "").slice(0, 2),
//                         }))
//                       }
//                       placeholder="00"
//                     />
//                   </label>

//                   <label className="lab">
//                     Hair style
//                     <select
//                       className="inpSelect"
//                       value={char.hairStyle}
//                       onChange={(e) => setChar((c) => ({ ...c, hairStyle: e.target.value as any }))}
//                     >
//                       <option value="short">Short</option>
//                       <option value="fade">Fade</option>
//                       <option value="curly">Curly</option>
//                     </select>
//                   </label>

//                   <label className="lab">
//                     Headband
//                     <button
//                       className={char.headband ? "pill pillOn" : "pill"}
//                       onClick={() => setChar((c) => ({ ...c, headband: !c.headband }))}
//                       type="button"
//                     >
//                       {char.headband ? "ON" : "OFF"}
//                     </button>
//                   </label>

//                   <label className="lab">
//                     Sleeve
//                     <button
//                       className={char.sleeve ? "pill pillOn" : "pill"}
//                       onClick={() => setChar((c) => ({ ...c, sleeve: !c.sleeve }))}
//                       type="button"
//                     >
//                       {char.sleeve ? "ON" : "OFF"}
//                     </button>
//                   </label>

//                   <label className="lab">
//                     Jersey pattern
//                     <select
//                       className="inpSelect"
//                       value={char.jerseyPattern}
//                       onChange={(e) =>
//                         setChar((c) => ({ ...c, jerseyPattern: e.target.value as any }))
//                       }
//                     >
//                       <option value="solid">Solid</option>
//                       <option value="stripe">Stripe</option>
//                       <option value="diagonal">Diagonal</option>
//                     </select>
//                   </label>
//                 </div>

//                 <div className="previewRow">
//                   <div className="previewBox">
//                     <PlayerAvatar char={char} />
//                   </div>
//                   <div className="previewInfo">
//                     <div className="metaLine">
//                       <b>Local best:</b> {bestScoreLocal}
//                     </div>
//                     <div className="metaLine">
//                       <b>Leaderboard:</b> top 15 per mode
//                     </div>
//                     <div className="metaLine">
//                       <b>New:</b> rim/board collisions + trajectory preview
//                     </div>
//                   </div>
//                 </div>
//               </section>

//               <section className="card cardWide">
//                 <div className="cardTitle">Leaderboard (Top 15 • {mode.name})</div>
//                 <div className="lb">
//                   {leaders.length === 0 ? (
//                     <div className="muted">No scores yet.</div>
//                   ) : (
//                     leaders.map((r, idx) => (
//                       <div className="lbRow" key={r.uid}>
//                         <div className="lbRank">#{idx + 1}</div>
//                         <div className="lbName">{r.name}</div>
//                         <div className="lbScore">{r.score}</div>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               </section>
//             </div>
//           ) : null}

//           {phase === "game" ? (
//             <>
//               <section className="hud">
//                 <div className="hudItem">
//                   <div className="hudLabel">Mode</div>
//                   <div className="hudValue">{mode.name}</div>
//                 </div>
//                 <div className="hudItem">
//                   <div className="hudLabel">Score</div>
//                   <div className="hudValue">{score}</div>
//                 </div>
//                 <div className="hudItem">
//                   <div className="hudLabel">Streak</div>
//                   <div className="hudValue">{streak}</div>
//                 </div>
//                 <div className="hudItem">
//                   <div className="hudLabel">Difficulty</div>
//                   <div className="hudValue">{Math.round(difficultyMult * 100)}%</div>
//                 </div>
//               </section>

//               {mode.durationSec ? (
//                 <div className="timerBar">
//                   <div className="timerTitle">⏱ Time left</div>
//                   <div className="timerValue">{timeLeft ?? mode.durationSec}s</div>
//                 </div>
//               ) : null}

//               <section className="gameCard">
//                 <div className="msgRow">
//                   <div className="msg">{message}</div>
//                   <div className="rightChips">
//                     {lastResult ? (
//                       <div
//                         className={
//                           lastResult === "SWISH"
//                             ? "badge badgeSwish"
//                             : lastResult === "MAKE"
//                             ? "badge badgeMake"
//                             : "badge badgeMiss"
//                         }
//                       >
//                         {lastResult}
//                       </div>
//                     ) : null}
//                   </div>
//                 </div>

//                 <div className="court">
//                   <div className="courtLeft">
//                     <PlayerAvatar char={char} armPose={armPose} />
//                     <div className="shootHint">
//                       Hold to charge • Release to shoot
//                       <div className="shootHint2">Trajectory preview updates live.</div>
//                     </div>
//                   </div>

//                   <div className="courtRight">
//                     <canvas ref={canvasRef} className="cv" />
//                   </div>
//                 </div>

//                 {/* Aim meter */}
//                 <div className="meterBlock">
//                   <div className="meterLabel">Aim</div>
//                   <div className="meter">
//                     <div className="zoneMake" style={zoneStyle(0.5, aimMakeHalfWidth)} />
//                     <div className="zoneSwish" style={zoneStyle(0.5, aimSwishHalfWidth)} />
//                     <div className="cursor" style={{ left: `${aim * 100}%` }} />
//                   </div>
//                   <div className="meterHint">Release near the center green for swish.</div>
//                 </div>

//                 {/* Power meter */}
//                 <div className="meterBlock">
//                   <div className="meterLabel">Power</div>
//                   <div className="meter">
//                     <div className="zoneMake" style={zoneStyle(powerTarget, powMakeHalfWidth)} />
//                     <div className="zoneSwish" style={zoneStyle(powerTarget, powSwishHalfWidth)} />
//                     <div className="fill" style={{ width: `${power * 100}%` }} />
//                   </div>
//                   <div className="meterHint">Hold to fill. Release to shoot.</div>
//                 </div>

//                 <div className="shootArea">
//                   <button
//                     className={charging ? "shootBtn shootBtnDown" : "shootBtn"}
//                     onMouseDown={onPress}
//                     onMouseUp={onRelease}
//                     onMouseLeave={charging ? onRelease : undefined}
//                     onTouchStart={onPress}
//                     onTouchEnd={onRelease}
//                     disabled={mode.durationSec ? (timeLeft ?? 0) <= 0 : false}
//                   >
//                     {mode.durationSec && (timeLeft ?? 0) <= 0
//                       ? "Time Over"
//                       : charging
//                       ? "Release to Shoot"
//                       : "Hold to Charge"}
//                   </button>
//                 </div>

//                 <div className="submitRow">
//                   <button className="submitBtn" onClick={submitScore}>
//                     Submit Score to Leaderboard
//                   </button>
//                   <div className="muted">
//                     {user ? `Signed in as ${user.displayName || user.email}` : "Not signed in"}
//                   </div>
//                   {lbMsg ? <div className="lbMsg">{lbMsg}</div> : null}
//                 </div>
//               </section>
//             </>
//           ) : null}
//         </header>
//       </div>

//       <style jsx>{`
//         .wrap {
//           padding: 28px 18px 110px;
//           color: #fff;
//           display: flex;
//           justify-content: center;
//           min-height: 100vh;
//         }
//         .wrapSplash {
//           padding: 0;
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
//         .stageFull {
//           max-width: none;
//           border-radius: 0;
//           min-height: 100vh;
//         }
//         .bgSpotlights {
//           position: absolute;
//           inset: 0;
//           background:
//             radial-gradient(900px 520px at 18% 10%, rgba(255,255,255,0.10), rgba(255,255,255,0) 60%),
//             radial-gradient(820px 520px at 78% 18%, rgba(242,194,48,0.10), rgba(255,255,255,0) 58%),
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

//         /* Splash full page */
//         .splash {
//           position: fixed;
//           inset: 0;
//           z-index: 9999;
//           display: grid;
//           place-items: center;
//           background: rgba(0,0,0,0.86);
//           backdrop-filter: blur(10px);
//           animation: splashIn 600ms ease forwards;
//         }
//         .splashOut {
//           animation: splashOut 650ms ease forwards;
//         }
//         .splashInner {
//           text-align: center;
//           padding: 18px;
//           border-radius: 18px;
//           border: 1px solid rgba(255,255,255,0.14);
//           background: rgba(255,255,255,0.04);
//           box-shadow: 0 20px 60px rgba(0,0,0,0.45);
//           min-width: min(520px, 92%);
//         }
//         .splashLine1 {
//           opacity: 0.85;
//           letter-spacing: 0.25px;
//           font-weight: 800;
//         }
//         .splashLine2 {
//           margin-top: 6px;
//           font-size: 26px;
//           font-weight: 950;
//           letter-spacing: 0.35px;
//         }
//         .splashLine3 {
//           margin-top: 10px;
//           opacity: 0.7;
//           font-size: 13px;
//         }
//         .splashLine4 {
//           margin-top: 14px;
//           opacity: 0.85;
//           font-size: 12px;
//           letter-spacing: 0.35px;
//         }
//         @keyframes splashIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         @keyframes splashOut {
//           from { opacity: 1; }
//           to { opacity: 0; pointer-events: none; }
//         }

//         .topbar {
//           display: flex;
//           justify-content: space-between;
//           gap: 12px;
//           flex-wrap: wrap;
//           align-items: flex-end;
//         }
//         .title {
//           font-size: 24px;
//           font-weight: 900;
//           letter-spacing: 0.2px;
//         }
//         .subtitle {
//           margin-top: 6px;
//           opacity: 0.75;
//           font-size: 13px;
//           line-height: 18px;
//         }
//         .topActions {
//           display: flex;
//           gap: 10px;
//           flex-wrap: wrap;
//           align-items: center;
//         }
//         .btn {
//           border-radius: 12px;
//           padding: 10px 14px;
//           border: 1px solid rgba(255, 255, 255, 0.28);
//           text-decoration: none;
//           color: #fff;
//           background: rgba(0, 0, 0, 0.22);
//           font-weight: 800;
//         }
//         .btnGhost {
//           border-radius: 12px;
//           padding: 10px 14px;
//           border: 1px solid rgba(255, 255, 255, 0.20);
//           background: rgba(0, 0, 0, 0.18);
//           color: rgba(255, 255, 255, 0.92);
//           font-weight: 800;
//           cursor: pointer;
//         }

//         /* Menu layout */
//         .menuGrid {
//           margin-top: 16px;
//           display: grid;
//           grid-template-columns: 1.1fr 0.9fr;
//           gap: 12px;
//         }
//         .cardWide { grid-column: 1 / -1; }

//         .card {
//           border-radius: 18px;
//           border: 1px solid rgba(242, 194, 48, 0.35);
//           background: rgba(242, 194, 48, 0.07);
//           box-shadow: 0 14px 35px rgba(0, 0, 0, 0.30);
//           padding: 16px;
//         }
//         .cardAlt {
//           border-color: rgba(120,180,255,0.28);
//           background: rgba(120,180,255,0.07);
//         }
//         .cardTitle {
//           font-weight: 950;
//           letter-spacing: 0.2px;
//           margin-bottom: 10px;
//         }

//         .modeGrid { display: grid; gap: 10px; }
//         .modeBtn {
//           text-align: left;
//           border-radius: 14px;
//           border: 1px solid rgba(255,255,255,0.12);
//           background: rgba(0,0,0,0.18);
//           padding: 12px;
//           cursor: pointer;
//           color: #fff;
//         }
//         .modeBtnOn {
//           border-color: rgba(242,194,48,0.45);
//           background: rgba(242,194,48,0.10);
//         }
//         .modeName { font-weight: 950; letter-spacing: 0.2px; }
//         .modeDesc {
//           margin-top: 6px;
//           opacity: 0.82;
//           font-size: 13px;
//           line-height: 18px;
//         }
//         .modePts { margin-top: 8px; opacity: 0.75; font-size: 12px; }

//         .menuActions { margin-top: 14px; display: grid; gap: 10px; }
//         .startBtn {
//           border-radius: 12px;
//           padding: 12px 14px;
//           border: 1px solid rgba(242, 194, 48, 0.60);
//           background: rgba(242, 194, 48, 0.14);
//           color: #fff;
//           font-weight: 950;
//           cursor: pointer;
//         }
//         .menuNote { opacity: 0.75; font-size: 12px; line-height: 16px; }

//         .customGrid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
//         .lab { display: grid; gap: 6px; font-weight: 850; font-size: 12px; opacity: 0.9; }
//         .inp {
//           width: 100%;
//           height: 38px;
//           border-radius: 12px;
//           border: 1px solid rgba(255,255,255,0.18);
//           background: rgba(0,0,0,0.20);
//           padding: 4px 8px;
//         }
//         .inpText, .inpSelect {
//           width: 100%;
//           height: 38px;
//           border-radius: 12px;
//           border: 1px solid rgba(255,255,255,0.18);
//           background: rgba(0,0,0,0.20);
//           padding: 0 10px;
//           color: #fff;
//           font-weight: 900;
//           outline: none;
//         }
//         .pill {
//           padding: 8px 10px;
//           border-radius: 12px;
//           font-weight: 950;
//           letter-spacing: 0.2px;
//           font-size: 12px;
//           border: 1px solid rgba(255,255,255,0.16);
//           background: rgba(0,0,0,0.18);
//           color: #fff;
//           cursor: pointer;
//         }
//         .pillOn { border-color: rgba(120,255,170,0.35); background: rgba(120,255,170,0.10); }

//         .previewRow {
//           margin-top: 12px;
//           display: grid;
//           grid-template-columns: 220px 1fr;
//           gap: 12px;
//           align-items: center;
//         }
//         .previewBox {
//           border-radius: 16px;
//           border: 1px solid rgba(255,255,255,0.12);
//           background: rgba(0,0,0,0.18);
//           padding: 10px;
//           display: grid;
//           place-items: center;
//         }
//         .previewInfo {
//           border-radius: 16px;
//           border: 1px solid rgba(255,255,255,0.10);
//           background: rgba(255,255,255,0.03);
//           padding: 12px;
//           opacity: 0.9;
//         }
//         .metaLine { margin-top: 8px; }
//         .metaLine:first-child { margin-top: 0; }

//         /* Leaderboard list */
//         .lb { display: grid; gap: 8px; }
//         .lbRow {
//           display: grid;
//           grid-template-columns: 60px 1fr 90px;
//           gap: 10px;
//           align-items: center;
//           border-radius: 12px;
//           border: 1px solid rgba(255,255,255,0.10);
//           background: rgba(0,0,0,0.16);
//           padding: 10px;
//         }
//         .lbRank { opacity: 0.8; font-weight: 900; }
//         .lbName { font-weight: 900; }
//         .lbScore { text-align: right; font-weight: 950; }

//         /* Game */
//         .hud {
//           margin-top: 16px;
//           display: grid;
//           grid-template-columns: repeat(4, 1fr);
//           gap: 10px;
//         }
//         .hudItem {
//           border-radius: 16px;
//           border: 1px solid rgba(255,255,255,0.10);
//           background: rgba(255,255,255,0.04);
//           box-shadow: 0 14px 35px rgba(0,0,0,0.25);
//           padding: 12px;
//         }
//         .hudLabel { opacity: 0.7; font-size: 12px; letter-spacing: 0.2px; }
//         .hudValue { margin-top: 6px; font-size: 18px; font-weight: 950; letter-spacing: 0.2px; }

//         .timerBar {
//           margin-top: 12px;
//           border-radius: 16px;
//           border: 1px solid rgba(242,194,48,0.30);
//           background: rgba(242,194,48,0.07);
//           padding: 10px 12px;
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           gap: 12px;
//         }
//         .timerTitle { font-weight: 950; }
//         .timerValue { font-weight: 950; }

//         .gameCard {
//           margin-top: 12px;
//           border-radius: 18px;
//           border: 1px solid rgba(120,180,255,0.28);
//           background: rgba(120,180,255,0.07);
//           box-shadow: 0 14px 35px rgba(0,0,0,0.30);
//           padding: 16px;
//         }

//         .msgRow {
//           display: flex;
//           justify-content: space-between;
//           gap: 10px;
//           flex-wrap: wrap;
//           align-items: center;
//           margin-bottom: 12px;
//         }
//         .msg { font-weight: 950; }
//         .rightChips { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }

//         .badge {
//           padding: 6px 10px;
//           border-radius: 999px;
//           font-weight: 950;
//           letter-spacing: 0.3px;
//           font-size: 12px;
//           border: 1px solid rgba(255,255,255,0.18);
//           background: rgba(0,0,0,0.18);
//           white-space: nowrap;
//         }
//         .badgeSwish { border-color: rgba(120,255,170,0.35); background: rgba(120,255,170,0.10); }
//         .badgeMake { border-color: rgba(242,194,48,0.35); background: rgba(242,194,48,0.12); }
//         .badgeMiss { border-color: rgba(255,120,120,0.35); background: rgba(255,120,120,0.10); }

//         .court {
//           display: grid;
//           grid-template-columns: 260px 1fr;
//           gap: 12px;
//           align-items: start;
//         }
//         .courtLeft {
//           border-radius: 16px;
//           border: 1px solid rgba(255,255,255,0.10);
//           background: rgba(0,0,0,0.16);
//           padding: 10px;
//         }
//         .shootHint { margin-top: 8px; opacity: 0.75; font-size: 12px; }
//         .shootHint2 { margin-top: 4px; opacity: 0.7; font-size: 11px; }
//         .courtRight {
//           border-radius: 16px;
//           border: 1px solid rgba(255,255,255,0.10);
//           background: rgba(0,0,0,0.12);
//           padding: 10px;
//           overflow: hidden;
//         }
//         .cv {
//           width: ${CSS_W}px;
//           height: ${CSS_H}px;
//           max-width: 100%;
//           display: block;
//           border-radius: 14px;
//         }

//         .meterBlock { margin-top: 12px; }
//         .meterLabel { font-weight: 950; margin-bottom: 8px; }
//         .meter {
//           position: relative;
//           height: 18px;
//           border-radius: 999px;
//           border: 1px solid rgba(255,255,255,0.14);
//           background: rgba(0,0,0,0.22);
//           overflow: hidden;
//         }
//         .zoneMake {
//           position: absolute;
//           top: 0;
//           height: 100%;
//           border-radius: 999px;
//           background: rgba(242, 194, 48, 0.12);
//           border: 1px solid rgba(242, 194, 48, 0.25);
//         }
//         .zoneSwish {
//           position: absolute;
//           top: 0;
//           height: 100%;
//           border-radius: 999px;
//           background: rgba(120, 255, 170, 0.14);
//           border: 1px solid rgba(120, 255, 170, 0.28);
//         }
//         .cursor {
//           position: absolute;
//           top: -3px;
//           width: 10px;
//           height: 24px;
//           border-radius: 999px;
//           background: rgba(255,255,255,0.92);
//           transform: translateX(-50%);
//           box-shadow: 0 0 18px rgba(255,255,255,0.25);
//         }
//         .fill {
//           position: absolute;
//           left: 0;
//           top: 0;
//           height: 100%;
//           border-radius: 999px;
//           background: rgba(120, 180, 255, 0.25);
//         }
//         .meterHint { margin-top: 6px; opacity: 0.75; font-size: 12px; line-height: 16px; }

//         .shootArea { margin-top: 16px; display: grid; place-items: center; }
//         .shootBtn {
//           width: min(640px, 100%);
//           border-radius: 16px;
//           padding: 14px 16px;
//           border: 1px solid rgba(255,255,255,0.20);
//           background: rgba(0,0,0,0.22);
//           color: #fff;
//           font-weight: 950;
//           letter-spacing: 0.2px;
//           cursor: pointer;
//           user-select: none;
//           touch-action: none;
//           transition: transform 120ms ease, background 120ms ease;
//         }
//         .shootBtn:hover { transform: translateY(-1px); }
//         .shootBtnDown { transform: translateY(1px) scale(0.99); background: rgba(0,0,0,0.30); }
//         .shootBtn:disabled { opacity: 0.55; cursor: default; transform: none; }

//         .submitRow { margin-top: 14px; display: grid; gap: 8px; justify-items: start; }
//         .submitBtn {
//           border-radius: 12px;
//           padding: 12px 14px;
//           border: 1px solid rgba(242, 194, 48, 0.60);
//           background: rgba(242, 194, 48, 0.14);
//           color: #fff;
//           font-weight: 950;
//           cursor: pointer;
//         }
//         .muted { opacity: 0.75; }
//         .lbMsg { opacity: 0.9; }

//         @media (max-width: 980px) {
//           .menuGrid { grid-template-columns: 1fr; }
//           .previewRow { grid-template-columns: 1fr; }
//           .court { grid-template-columns: 1fr; }
//           .cv { width: 100%; height: auto; }
//         }
//       `}</style>
//     </main>
//   );
// }

// /* ======================
//    Retro drawing helpers
//    ====================== */

// function drawRetroWorld(
//   ctx: CanvasRenderingContext2D,
//   g: Geom,
//   netPulse: "none" | "make" | "swish" | "miss",
//   score: number,
//   streak: number,
//   modeName: string
// ) {
//   // background walls
//   ctx.fillStyle = "#2b5e67";
//   ctx.fillRect(0, 0, WORLD_W, WORLD_H);

//   // top scoreboard strip
//   ctx.fillStyle = "#2a2a2a";
//   ctx.fillRect(0, 0, WORLD_W, 20);
//   ctx.fillStyle = "#111";
//   ctx.fillRect(0, 20, WORLD_W, 6);

//   // scoreboard text (tiny monospace)
//   ctx.fillStyle = "#d8ffd8";
//   ctx.font = "10px monospace";
//   ctx.textBaseline = "middle";
//   ctx.fillText("HOME", 22, 10);
//   ctx.fillText("QTR", 140, 10);
//   ctx.fillText("VIS", 250, 10);

//   ctx.fillStyle = "#ffffff";
//   ctx.fillText("0", 70, 10);
//   ctx.fillText("1", 170, 10);
//   ctx.fillText("0", 290, 10);

//   // side exits (like arcade)
//   ctx.fillStyle = "#0e2a2f";
//   ctx.fillRect(0, 38, 26, 30);
//   ctx.fillRect(WORLD_W - 26, 38, 26, 30);
//   ctx.fillStyle = "#b8f3ff";
//   ctx.font = "9px monospace";
//   ctx.fillText("EXIT", 4, 34);
//   ctx.fillText("EXIT", WORLD_W - 24, 34);

//   // stands
//   ctx.fillStyle = "#1f3b40";
//   ctx.fillRect(0, 26, WORLD_W, 28);
//   // crowd dots
//   for (let i = 0; i < 90; i++) {
//     const x = (i * 17 + 13) % WORLD_W;
//     const y = 28 + ((i * 7) % 22);
//     ctx.fillStyle = i % 3 === 0 ? "#f2c230" : i % 3 === 1 ? "#c7e6ff" : "#ffd1dc";
//     ctx.fillRect(x, y, 1, 1);
//   }

//   // court base
//   ctx.fillStyle = "#cfd37a";
//   ctx.fillRect(0, 54, WORLD_W, WORLD_H - 54);

//   // key paint
//   ctx.fillStyle = "#d8dc8a";
//   ctx.fillRect(88, 74, 92, 70);

//   // lines (pixel style)
//   ctx.strokeStyle = "rgba(255,255,255,0.55)";
//   ctx.lineWidth = 1;

//   // arc
//   ctx.beginPath();
//   ctx.ellipse(146, 128, 55, 18, 0, 0, Math.PI * 2);
//   ctx.stroke();

//   // lane lines
//   ctx.beginPath();
//   ctx.moveTo(88, 74);
//   ctx.lineTo(88, 144);
//   ctx.moveTo(180, 74);
//   ctx.lineTo(180, 144);
//   ctx.stroke();

//   // hoop / board
//   // board
//   ctx.fillStyle = "rgba(255,255,255,0.15)";
//   ctx.fillRect(g.boardX, g.boardY, g.boardW, g.boardH);

//   // inner box
//   ctx.strokeStyle = "rgba(242,194,48,0.95)";
//   ctx.strokeRect(g.rimX - 14, g.rimY - 18, 28, 18);

//   // rim (line between posts)
//   ctx.strokeStyle = "rgba(242,194,48,0.95)";
//   ctx.beginPath();
//   ctx.moveTo(g.rimLeftX, g.rimPostY);
//   ctx.lineTo(g.rimRightX, g.rimPostY);
//   ctx.stroke();

//   // posts
//   ctx.fillStyle = "rgba(242,194,48,0.95)";
//   ctx.fillRect(g.rimLeftX - 1, g.rimPostY - 1, 2, 2);
//   ctx.fillRect(g.rimRightX - 1, g.rimPostY - 1, 2, 2);

//   // net pulse
//   const pulse =
//     netPulse === "swish" ? 1.4 : netPulse === "make" ? 1.2 : netPulse === "miss" ? 0.9 : 1.0;

//   ctx.strokeStyle = "rgba(255,255,255,0.55)";
//   ctx.beginPath();
//   for (let i = -10; i <= 10; i += 5) {
//     ctx.moveTo(g.rimX + i, g.rimPostY + 2);
//     ctx.lineTo(g.rimX + i * 0.6, g.rimPostY + 20 * pulse);
//   }
//   ctx.stroke();

//   // floor line
//   ctx.strokeStyle = "rgba(0,0,0,0.15)";
//   ctx.beginPath();
//   ctx.moveTo(0, FLOOR_Y);
//   ctx.lineTo(WORLD_W, FLOOR_Y);
//   ctx.stroke();

//   // bottom HUD in-world
//   ctx.fillStyle = "rgba(0,0,0,0.32)";
//   ctx.fillRect(0, WORLD_H - 16, WORLD_W, 16);
//   ctx.fillStyle = "#ffffff";
//   ctx.font = "10px monospace";
//   ctx.fillText(`MODE:${modeName}`, 6, WORLD_H - 8);
//   ctx.fillText(`S:${score}`, 170, WORLD_H - 8);
//   ctx.fillText(`ST:${streak}`, 240, WORLD_H - 8);
// }

// function drawPrediction(ctx: CanvasRenderingContext2D, pts: Array<{ x: number; y: number }>, strong: boolean) {
//   if (pts.length < 2) return;

//   // dotted “ghost” path
//   ctx.save();
//   ctx.globalAlpha = strong ? 0.85 : 0.35;

//   for (let i = 0; i < pts.length; i += 2) {
//     const p = pts[i];
//     // fade out over time
//     const a = 1 - i / pts.length;
//     ctx.globalAlpha = (strong ? 0.75 : 0.28) * a;

//     // tiny pixel dot
//     ctx.fillStyle = strong ? "#b9ffce" : "#c7e6ff";
//     ctx.fillRect(Math.round(p.x), Math.round(p.y), 1, 1);
//   }

//   // “impact” marker (last point)
//   const last = pts[pts.length - 1];
//   ctx.globalAlpha = strong ? 0.9 : 0.5;
//   ctx.strokeStyle = strong ? "rgba(185,255,206,0.9)" : "rgba(199,230,255,0.65)";
//   ctx.strokeRect(Math.round(last.x) - 2, Math.round(last.y) - 2, 5, 5);

//   ctx.restore();
// }

// function drawBallPixel(ctx: CanvasRenderingContext2D, x: number, y: number) {
//   ctx.save();
//   ctx.translate(Math.round(x), Math.round(y));

//   // ball body
//   ctx.fillStyle = "#e67e22";
//   ctx.fillRect(-2, -2, 4, 4);

//   // outline
//   ctx.strokeStyle = "rgba(0,0,0,0.45)";
//   ctx.strokeRect(-2, -2, 4, 4);

//   ctx.restore();
// }

// /* ---------- Character SVG ---------- */

// function PlayerAvatar({
//   char,
//   armPose = "idle",
// }: {
//   char: CharacterConfig;
//   armPose?: "idle" | "ready" | "shoot";
// }) {
//   const armRot = armPose === "idle" ? -10 : armPose === "ready" ? -26 : -58;

//   return (
//     <svg width="240" height="260" viewBox="0 0 240 260" aria-hidden="true">
//       <ellipse cx="120" cy="248" rx="82" ry="10" fill="rgba(0,0,0,0.35)" />

//       {/* legs */}
//       <rect x="94" y="150" width="22" height="70" rx="10" fill="rgba(255,255,255,0.10)" />
//       <rect x="126" y="150" width="22" height="70" rx="10" fill="rgba(255,255,255,0.10)" />

//       {/* shoes */}
//       <rect x="84" y="218" width="44" height="12" rx="7" fill={char.shoes} opacity="0.75" />
//       <rect x="122" y="218" width="44" height="12" rx="7" fill={char.shoes} opacity="0.75" />

//       {/* jersey */}
//       <rect x="78" y="92" width="84" height="70" rx="20" fill={char.jersey} opacity="0.92" />

//       {/* pattern */}
//       {char.jerseyPattern === "stripe" ? (
//         <>
//           <rect x="78" y="118" width="84" height="10" fill="rgba(255,255,255,0.16)" />
//           <rect x="78" y="132" width="84" height="6" fill="rgba(0,0,0,0.16)" />
//         </>
//       ) : char.jerseyPattern === "diagonal" ? (
//         <path d="M78 150 L162 104 L162 120 L78 166 Z" fill="rgba(255,255,255,0.16)" />
//       ) : null}

//       {/* number */}
//       <text
//         x="120"
//         y="134"
//         textAnchor="middle"
//         fontSize="22"
//         fontWeight="900"
//         fill="rgba(255,255,255,0.92)"
//       >
//         {char.number || "00"}
//       </text>

//       {/* head */}
//       <circle cx="120" cy="60" r="26" fill={char.skin} />

//       {/* hair styles */}
//       {char.hairStyle === "short" ? (
//         <path
//           d="M94 60c2-20 18-28 40-24 12 2 22 12 24 24-8-8-16-10-24-10-12 0-22 6-40 10z"
//           fill={char.hairColor}
//         />
//       ) : char.hairStyle === "fade" ? (
//         <path
//           d="M96 62c4-18 18-26 38-24 16 2 24 12 26 24-10-6-16-8-26-8-14 0-24 4-38 8z"
//           fill={char.hairColor}
//           opacity="0.92"
//         />
//       ) : (
//         <>
//           <path
//             d="M92 62c2-22 18-32 44-28 18 3 28 14 30 28-10-10-18-12-30-12-14 0-26 6-44 12z"
//             fill={char.hairColor}
//           />
//           <circle cx="100" cy="44" r="4" fill={char.hairColor} opacity="0.9" />
//           <circle cx="112" cy="40" r="4" fill={char.hairColor} opacity="0.9" />
//           <circle cx="126" cy="40" r="4" fill={char.hairColor} opacity="0.9" />
//           <circle cx="140" cy="44" r="4" fill={char.hairColor} opacity="0.9" />
//         </>
//       )}

//       {/* headband */}
//       {char.headband ? (
//         <rect x="95" y="52" width="50" height="10" rx="6" fill="rgba(255,255,255,0.22)" />
//       ) : null}

//       {/* arms (left static) */}
//       <rect x="58" y="104" width="20" height="56" rx="10" fill={char.skin} opacity="0.92" />

//       {/* right arm animated */}
//       <g transform={`translate(162 112) rotate(${armRot}) translate(-162 -112)`}>
//         <rect x="162" y="104" width="20" height="56" rx="10" fill={char.skin} opacity="0.92" />
//         {char.sleeve ? (
//           <rect x="162" y="104" width="20" height="18" rx="9" fill="rgba(255,255,255,0.14)" />
//         ) : null}
//       </g>

//       {/* sleeve on left arm */}
//       {char.sleeve ? (
//         <rect x="58" y="104" width="20" height="18" rx="9" fill="rgba(255,255,255,0.14)" />
//       ) : null}
//     </svg>
//   );
// }

// function zoneStyle(center: number, halfWidth: number) {
//   const left = clamp01(center - halfWidth);
//   const right = clamp01(center + halfWidth);
//   return { left: `${left * 100}%`, width: `${(right - left) * 100}%` } as const;
// }


// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import Link from "next/link";
// import {
//   collection,
//   doc,
//   getDoc,
//   limit,
//   onSnapshot,
//   orderBy,
//   query,
//   serverTimestamp,
//   setDoc,
// } from "firebase/firestore";
// import { onAuthStateChanged, type User } from "firebase/auth";
// import { db, auth } from "@/lib/firebase";
// import { TOURNAMENT_ID } from "@/lib/tournament";

// type Phase = "splash" | "menu" | "game";
// type ShotResult = "SWISH" | "MAKE" | "MISS";

// type ModeId = "street_run" | "free_throw" | "corner_three";
// type Mode = {
//   id: ModeId;
//   name: string;
//   description: string;
//   pointsMake: number;
//   pointsSwish: number;

//   // 3rd-person settings
//   allowMove: boolean;
//   defenders: number;
//   teammates: number;

//   // clocks
//   quarterSec: number;
//   quarters: number;
//   shotClockSec: number;

//   // hoop in world coords
//   hoopX: number;
//   hoopY: number;
//   hoopZ: number;
// };

// type CharacterConfig = {
//   skin: string;
//   hairColor: string;
//   jersey: string;
//   shoes: string;
//   number: string;
//   hairStyle: "short" | "fade" | "curly";
//   headband: boolean;
//   sleeve: boolean;
//   jerseyPattern: "solid" | "stripe" | "diagonal";
// };

// type LeaderRow = {
//   uid: string;
//   name: string;
//   score: number;
//   mode: ModeId;
//   updatedAt?: any;
// };

// const DEFAULT_CHAR: CharacterConfig = {
//   skin: "#D9A074",
//   hairColor: "#2B1B0F",
//   jersey: "#1f6db3",
//   shoes: "#f2c230",
//   number: "13",
//   hairStyle: "fade",
//   headband: false,
//   sleeve: true,
//   jerseyPattern: "stripe",
// };

// const MODES: Mode[] = [
//   {
//     id: "street_run",
//     name: "Street Run (3rd Person)",
//     description: "Move, juke, pass, shoot over defenders. Shot meter next to player.",
//     pointsMake: 2,
//     pointsSwish: 3,
//     allowMove: true,
//     defenders: 2,
//     teammates: 2,
//     quarterSec: 45,
//     quarters: 4,
//     shotClockSec: 14,
//     hoopX: 0,
//     hoopY: 102,
//     hoopZ: 330,
//   },
//   {
//     id: "free_throw",
//     name: "Free Throws (3rd Person)",
//     description: "Stationary 3rd-person shots with 2K-style meter.",
//     pointsMake: 2,
//     pointsSwish: 3,
//     allowMove: false,
//     defenders: 0,
//     teammates: 0,
//     quarterSec: 45,
//     quarters: 1,
//     shotClockSec: 14,
//     hoopX: 0,
//     hoopY: 102,
//     hoopZ: 330,
//   },
//   {
//     id: "corner_three",
//     name: "Corner 3 (3rd Person)",
//     description: "Harder angle, more points. Meter controls accuracy.",
//     pointsMake: 3,
//     pointsSwish: 4,
//     allowMove: false,
//     defenders: 1,
//     teammates: 0,
//     quarterSec: 45,
//     quarters: 1,
//     shotClockSec: 14,
//     hoopX: 0,
//     hoopY: 102,
//     hoopZ: 330,
//   },
// ];

// function clamp(x: number, lo: number, hi: number) {
//   return Math.max(lo, Math.min(hi, x));
// }
// function clamp01(x: number) {
//   return clamp(x, 0, 1);
// }
// function len2(x: number, z: number) {
//   return Math.sqrt(x * x + z * z);
// }
// function lerp(a: number, b: number, t: number) {
//   return a + (b - a) * t;
// }
// function loadJSON<T>(key: string, fallback: T): T {
//   try {
//     const raw = localStorage.getItem(key);
//     if (!raw) return fallback;
//     return JSON.parse(raw) as T;
//   } catch {
//     return fallback;
//   }
// }
// function saveJSON(key: string, v: any) {
//   try {
//     localStorage.setItem(key, JSON.stringify(v));
//   } catch {}
// }

// /* =========================
//    3rd-person “almost 3D”
//    ========================= */

// const CSS_W = 960;
// const CSS_H = 540;

// // court bounds in WORLD (x,z)
// const COURT_W = 280; // half width-ish
// const COURT_Z_NEAR = -40;
// const COURT_Z_FAR = 360;

// // player + defender body
// const PLAYER_R = 10;
// const DEF_R = 10;

// // ball
// const BALL_R = 4;
// const GRAVITY = 520; // world units / s^2
// const FLOOR_Y = 0;

// // hoop
// const RIM_R = 9;
// const RIM_THICK = 2.4;
// const BACKBOARD_Z_OFF = 10;
// const BACKBOARD_W = 70;
// const BACKBOARD_H = 40;

// // physics bounces
// const E_RIM = 0.48;
// const E_BOARD = 0.35;
// const E_FLOOR = 0.30;
// const AIR_DRAG = 0.997;

// type Vec3 = { x: number; y: number; z: number };

// type Entity = {
//   id: string;
//   kind: "player" | "defender" | "teammate";
//   x: number;
//   z: number;
//   vx: number;
//   vz: number;
//   facing: number; // radians
//   invulnT: number; // for jukes
// };

// type BallState =
//   | {
//       mode: "held";
//       owner: "player" | `tm${number}`;
//       t: number;
//       pos: Vec3;
//       vel: Vec3;
//       lastPos: Vec3;
//       touchedRim: boolean;
//       touchedBoard: boolean;
//     }
//   | {
//       mode: "shot";
//       owner: "player";
//       t: number;
//       pos: Vec3;
//       vel: Vec3;
//       lastPos: Vec3;
//       touchedRim: boolean;
//       touchedBoard: boolean;
//     }
//   | {
//       mode: "pass";
//       owner: "player";
//       target: `tm${number}`;
//       t: number;
//       dur: number;
//       start: Vec3;
//       end: Vec3;
//       pos: Vec3;
//       vel: Vec3;
//       lastPos: Vec3;
//       touchedRim: boolean;
//       touchedBoard: boolean;
//     }
//   | {
//       mode: "loose";
//       t: number;
//       pos: Vec3;
//       vel: Vec3;
//       lastPos: Vec3;
//       touchedRim: boolean;
//       touchedBoard: boolean;
//     };

// type Runtime = {
//   modeId: ModeId;
//   quarter: number;
//   quarterLeft: number;
//   shotClockLeft: number;

//   score: number;
//   streak: number;
//   bestStreak: number;

//   message: string;
//   lastResult: ShotResult | null;

//   // shot meter
//   charging: boolean;
//   meterPhase: number; // advances while charging
//   meterVal: number; // ping-pong 0..1
//   meterTarget: number; // sweet spot (like 2K)
//   meterSpeed: number;

//   // aim assist / difficulty
//   difficultyMult: number;

//   // entities
//   player: Entity;
//   defenders: Entity[];
//   teammates: Entity[];

//   // ball
//   ball: BallState;

//   // camera
//   cam: { x: number; y: number; z: number; yaw: number; f: number };

//   // for HUD throttling
//   hudAccum: number;
// };

// function makeEntity(kind: Entity["kind"], id: string, x: number, z: number): Entity {
//   return {
//     kind,
//     id,
//     x,
//     z,
//     vx: 0,
//     vz: 0,
//     facing: 0,
//     invulnT: 0,
//   };
// }

// function initRuntime(mode: Mode): Runtime {
//   const player = makeEntity("player", "p1", 0, mode.id === "corner_three" ? 60 : 35);

//   const defenders: Entity[] = [];
//   for (let i = 0; i < mode.defenders; i++) {
//     defenders.push(makeEntity("defender", `d${i}`, (i === 0 ? -50 : 50), 170 + i * 25));
//   }

//   const teammates: Entity[] = [];
//   for (let i = 0; i < mode.teammates; i++) {
//     teammates.push(makeEntity("teammate", `tm${i}`, i === 0 ? -70 : 70, 120));
//   }

//   const startBall: BallState = {
//     mode: "held",
//     owner: "player",
//     t: 0,
//     pos: { x: player.x, y: 50, z: player.z },
//     vel: { x: 0, y: 0, z: 0 },
//     lastPos: { x: player.x, y: 50, z: player.z },
//     touchedRim: false,
//     touchedBoard: false,
//   };

//   return {
//     modeId: mode.id,
//     quarter: 1,
//     quarterLeft: mode.quarterSec,
//     shotClockLeft: mode.shotClockSec,

//     score: 0,
//     streak: 0,
//     bestStreak: 0,

//     message: "WASD/Arrows to move • Hold Space to shoot • Q pass • E/F juke",
//     lastResult: null,

//     charging: false,
//     meterPhase: 0,
//     meterVal: 0,
//     meterTarget: 0.72,
//     meterSpeed: 1.65,

//     difficultyMult: 1,

//     player,
//     defenders,
//     teammates,
//     ball: startBall,

//     cam: { x: 0, y: 90, z: -120, yaw: 0, f: 520 },

//     hudAccum: 0,
//   };
// }

// /**
//  * Keyboard handling uses keydown/keyup + event.code for consistent physical keys.
//  * (This is the MDN-recommended approach for game controls.) :contentReference[oaicite:2]{index=2}
//  */
// type Keys = Record<string, boolean>;

// function isDown(keys: Keys, code: string) {
//   return !!keys[code];
// }

// function pingPong01(t: number) {
//   // 0..1..0 repeating
//   const m = t % 2;
//   return m < 1 ? m : 2 - m;
// }

// function hotZoneMult(x: number, z: number) {
//   // simple hot zones: corners + top of key
//   const leftCorner = x < -95 && z > 240;
//   const rightCorner = x > 95 && z > 240;
//   const topKey = Math.abs(x) < 30 && z > 210 && z < 260;
//   if (leftCorner || rightCorner) return 1.25;
//   if (topKey) return 1.15;
//   return 1.0;
// }

// function nearestDefenderDist(player: Entity, defs: Entity[]) {
//   let best = 1e9;
//   for (const d of defs) {
//     const dx = d.x - player.x;
//     const dz = d.z - player.z;
//     best = Math.min(best, Math.sqrt(dx * dx + dz * dz));
//   }
//   return best;
// }

// function circleOverlap(ax: number, az: number, ar: number, bx: number, bz: number, br: number) {
//   const dx = ax - bx;
//   const dz = az - bz;
//   return dx * dx + dz * dz <= (ar + br) * (ar + br);
// }

// /* =========================
//    Rendering: simple perspective
//    ========================= */

// function project(p: Vec3, cam: Runtime["cam"]) {
//   // rotate around Y by -yaw to camera space
//   const dx = p.x - cam.x;
//   const dy = p.y - cam.y;
//   const dz = p.z - cam.z;

//   const cy = Math.cos(-cam.yaw);
//   const sy = Math.sin(-cam.yaw);

//   const cx = dx * cy - dz * sy;
//   const cz = dx * sy + dz * cy;

//   // behind camera
//   if (cz < 8) return null;

//   const sx = (cx / cz) * cam.f + CSS_W / 2;
//   const sy2 = (dy / cz) * cam.f + CSS_H * 0.56;

//   const scale = cam.f / cz;
//   return { x: sx, y: sy2, z: cz, s: scale };
// }

// function drawCourt(ctx: CanvasRenderingContext2D, rt: Runtime, mode: Mode) {
//   const cam = rt.cam;

//   // floor corners (trapezoid in perspective)
//   const corners: Vec3[] = [
//     { x: -COURT_W, y: 0, z: COURT_Z_NEAR },
//     { x: COURT_W, y: 0, z: COURT_Z_NEAR },
//     { x: COURT_W, y: 0, z: COURT_Z_FAR },
//     { x: -COURT_W, y: 0, z: COURT_Z_FAR },
//   ];
//   const pc = corners.map((c) => project(c, cam));
//   if (pc.some((v) => !v)) return;

//   // background
//   ctx.fillStyle = "rgba(0,0,0,0.18)";
//   ctx.fillRect(0, 0, CSS_W, CSS_H);

//   // crowd / arena gradient
//   const g = ctx.createLinearGradient(0, 0, 0, CSS_H);
//   g.addColorStop(0, "rgba(40,60,70,0.95)");
//   g.addColorStop(0.55, "rgba(25,35,40,0.65)");
//   g.addColorStop(1, "rgba(0,0,0,0.25)");
//   ctx.fillStyle = g;
//   ctx.fillRect(0, 0, CSS_W, CSS_H);

//   // floor fill
//   ctx.beginPath();
//   ctx.moveTo(pc[0]!.x, pc[0]!.y);
//   ctx.lineTo(pc[1]!.x, pc[1]!.y);
//   ctx.lineTo(pc[2]!.x, pc[2]!.y);
//   ctx.lineTo(pc[3]!.x, pc[3]!.y);
//   ctx.closePath();
//   ctx.fillStyle = "rgba(210,220,140,0.92)";
//   ctx.fill();

//   // lines
//   ctx.strokeStyle = "rgba(255,255,255,0.35)";
//   ctx.lineWidth = 2;

//   // center lane-ish
//   const laneL = project({ x: -55, y: 0.2, z: 150 }, cam);
//   const laneR = project({ x: 55, y: 0.2, z: 150 }, cam);
//   const laneLF = project({ x: -55, y: 0.2, z: 300 }, cam);
//   const laneRF = project({ x: 55, y: 0.2, z: 300 }, cam);
//   if (laneL && laneR && laneLF && laneRF) {
//     ctx.beginPath();
//     ctx.moveTo(laneL.x, laneL.y);
//     ctx.lineTo(laneR.x, laneR.y);
//     ctx.lineTo(laneRF.x, laneRF.y);
//     ctx.lineTo(laneLF.x, laneLF.y);
//     ctx.closePath();
//     ctx.stroke();
//   }

//   // hoop + board
//   drawHoop(ctx, rt, mode);
// }

// function drawHoop(ctx: CanvasRenderingContext2D, rt: Runtime, mode: Mode) {
//   const cam = rt.cam;

//   // backboard plane at z = hoopZ + BACKBOARD_Z_OFF
//   const bz = mode.hoopZ + BACKBOARD_Z_OFF;
//   const b0 = project({ x: mode.hoopX - BACKBOARD_W / 2, y: mode.hoopY + BACKBOARD_H / 2, z: bz }, cam);
//   const b1 = project({ x: mode.hoopX + BACKBOARD_W / 2, y: mode.hoopY + BACKBOARD_H / 2, z: bz }, cam);
//   const b2 = project({ x: mode.hoopX + BACKBOARD_W / 2, y: mode.hoopY - BACKBOARD_H / 2, z: bz }, cam);
//   const b3 = project({ x: mode.hoopX - BACKBOARD_W / 2, y: mode.hoopY - BACKBOARD_H / 2, z: bz }, cam);

//   if (b0 && b1 && b2 && b3) {
//     ctx.beginPath();
//     ctx.moveTo(b0.x, b0.y);
//     ctx.lineTo(b1.x, b1.y);
//     ctx.lineTo(b2.x, b2.y);
//     ctx.lineTo(b3.x, b3.y);
//     ctx.closePath();
//     ctx.fillStyle = "rgba(255,255,255,0.14)";
//     ctx.fill();

//     ctx.strokeStyle = "rgba(255,255,255,0.25)";
//     ctx.lineWidth = 2;
//     ctx.stroke();
//   }

//   // rim as ellipse-ish line by projecting points around a circle
//   const rimPts: { x: number; y: number }[] = [];
//   for (let i = 0; i < 28; i++) {
//     const a = (i / 28) * Math.PI * 2;
//     const px = mode.hoopX + Math.cos(a) * RIM_R;
//     const pz = mode.hoopZ + Math.sin(a) * (RIM_R * 0.85); // slight squash
//     const p = project({ x: px, y: mode.hoopY, z: pz }, cam);
//     if (p) rimPts.push({ x: p.x, y: p.y });
//   }
//   if (rimPts.length > 10) {
//     ctx.beginPath();
//     ctx.moveTo(rimPts[0].x, rimPts[0].y);
//     for (let i = 1; i < rimPts.length; i++) ctx.lineTo(rimPts[i].x, rimPts[i].y);
//     ctx.closePath();
//     ctx.strokeStyle = "rgba(242,194,48,0.95)";
//     ctx.lineWidth = 3;
//     ctx.stroke();
//   }
// }

// function drawBillboardPlayer(
//   ctx: CanvasRenderingContext2D,
//   rt: Runtime,
//   ent: Entity,
//   char: CharacterConfig,
//   tint: "player" | "defender" | "teammate"
// ) {
//   const cam = rt.cam;

//   // shadow
//   const sh = project({ x: ent.x, y: 0.3, z: ent.z }, cam);
//   if (!sh) return;

//   const scale = sh.s;

//   ctx.save();

//   // shadow ellipse
//   ctx.globalAlpha = 0.35;
//   ctx.fillStyle = "rgba(0,0,0,1)";
//   ctx.beginPath();
//   ctx.ellipse(sh.x, sh.y, 18 * scale, 6 * scale, 0, 0, Math.PI * 2);
//   ctx.fill();

//   // body “capsule” (billboard)
//   ctx.globalAlpha = 1;
//   const bodyH = 62 * scale;
//   const bodyW = 26 * scale;

//   const headR = 12 * scale;
//   const baseY = sh.y - bodyH;

//   // jersey
//   ctx.fillStyle = tint === "player" ? char.jersey : tint === "teammate" ? "rgba(120,180,255,0.8)" : "rgba(255,120,120,0.8)";
//   roundRect2(ctx, sh.x - bodyW / 2, baseY + 14 * scale, bodyW, 34 * scale, 8 * scale);

//   // head
//   ctx.fillStyle = tint === "player" ? char.skin : "rgba(230,230,230,0.75)";
//   ctx.beginPath();
//   ctx.arc(sh.x, baseY + headR, headR, 0, Math.PI * 2);
//   ctx.fill();

//   // hair band / hair blob
//   ctx.fillStyle = tint === "player" ? char.hairColor : "rgba(20,20,20,0.55)";
//   ctx.beginPath();
//   ctx.arc(sh.x, baseY + headR - 2 * scale, headR * 0.95, Math.PI, Math.PI * 2);
//   ctx.fill();

//   // number
//   if (tint === "player") {
//     ctx.fillStyle = "rgba(255,255,255,0.92)";
//     ctx.font = `${Math.max(10, 12 * scale)}px ui-sans-serif`;
//     ctx.textAlign = "center";
//     ctx.textBaseline = "middle";
//     ctx.fillText(char.number || "00", sh.x, baseY + 32 * scale);
//   }

//   // invuln glow
//   if (ent.invulnT > 0.001) {
//     ctx.globalAlpha = 0.18;
//     ctx.strokeStyle = "rgba(120,255,170,1)";
//     ctx.lineWidth = 6 * scale;
//     ctx.beginPath();
//     ctx.arc(sh.x, baseY + 28 * scale, 22 * scale, 0, Math.PI * 2);
//     ctx.stroke();
//   }

//   ctx.restore();
// }

// function drawBall(ctx: CanvasRenderingContext2D, rt: Runtime, pos: Vec3) {
//   const p = project(pos, rt.cam);
//   if (!p) return;

//   ctx.save();
//   ctx.fillStyle = "#e67e22";
//   ctx.strokeStyle = "rgba(0,0,0,0.35)";
//   ctx.lineWidth = 2;

//   const r = BALL_R * p.s * 3.6;
//   ctx.beginPath();
//   ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
//   ctx.fill();
//   ctx.stroke();

//   ctx.restore();
// }

// function drawShotMeter(ctx: CanvasRenderingContext2D, rt: Runtime, player: Entity) {
//   if (!rt.charging) return;

//   const anchor = project({ x: player.x + 16, y: 60, z: player.z }, rt.cam);
//   if (!anchor) return;

//   const h = 90 * anchor.s * 3.2;
//   const w = 12 * anchor.s * 3.2;

//   const x = anchor.x;
//   const y = anchor.y - h / 2;

//   // background
//   ctx.save();
//   ctx.globalAlpha = 0.88;
//   ctx.fillStyle = "rgba(0,0,0,0.35)";
//   roundRect2(ctx, x - w / 2, y, w, h, 8);

//   // target window
//   const target = rt.meterTarget; // 0..1
//   const win = 0.08 * rt.difficultyMult;
//   const t0 = clamp01(target - win);
//   const t1 = clamp01(target + win);

//   ctx.globalAlpha = 0.9;
//   ctx.fillStyle = "rgba(120,255,170,0.28)";
//   ctx.fillRect(x - w / 2 + 2, y + (1 - t1) * h, w - 4, (t1 - t0) * h);

//   // moving fill indicator (needle)
//   const v = rt.meterVal;
//   ctx.globalAlpha = 1;
//   ctx.fillStyle = "rgba(255,255,255,0.92)";
//   ctx.fillRect(x - w / 2 + 2, y + (1 - v) * h - 2, w - 4, 4);

//   // outline
//   ctx.globalAlpha = 0.55;
//   ctx.strokeStyle = "rgba(255,255,255,0.25)";
//   ctx.strokeRect(x - w / 2, y, w, h);

//   ctx.restore();
// }

// function roundRect2(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
//   const rr = Math.min(r, w / 2, h / 2);
//   ctx.beginPath();
//   ctx.moveTo(x + rr, y);
//   ctx.arcTo(x + w, y, x + w, y + h, rr);
//   ctx.arcTo(x + w, y + h, x, y + h, rr);
//   ctx.arcTo(x, y + h, x, y, rr);
//   ctx.arcTo(x, y, x + w, y, rr);
//   ctx.closePath();
//   ctx.fill();
// }

// /* =========================
//    Gameplay / physics
//    ========================= */

// function resetPossession(rt: Runtime, mode: Mode) {
//   rt.charging = false;
//   rt.meterPhase = 0;
//   rt.meterVal = 0;

//   rt.player.x = 0;
//   rt.player.z = mode.id === "corner_three" ? 60 : 35;
//   rt.player.vx = 0;
//   rt.player.vz = 0;
//   rt.player.invulnT = 0;

//   // defenders back
//   for (let i = 0; i < rt.defenders.length; i++) {
//     rt.defenders[i].x = i === 0 ? -50 : 50;
//     rt.defenders[i].z = 170 + i * 25;
//     rt.defenders[i].vx = 0;
//     rt.defenders[i].vz = 0;
//     rt.defenders[i].invulnT = 0;
//   }

//   // teammates
//   for (let i = 0; i < rt.teammates.length; i++) {
//     rt.teammates[i].x = i === 0 ? -70 : 70;
//     rt.teammates[i].z = 120;
//     rt.teammates[i].vx = 0;
//     rt.teammates[i].vz = 0;
//     rt.teammates[i].invulnT = 0;
//   }

//   rt.ball = {
//     mode: "held",
//     owner: "player",
//     t: 0,
//     pos: { x: rt.player.x, y: 50, z: rt.player.z },
//     vel: { x: 0, y: 0, z: 0 },
//     lastPos: { x: rt.player.x, y: 50, z: rt.player.z },
//     touchedRim: false,
//     touchedBoard: false,
//   };

//   rt.shotClockLeft = mode.shotClockSec;
//   rt.message = "Possession reset.";
//   rt.lastResult = null;
// }

// function updateCamera(rt: Runtime, mode: Mode) {
//   // camera follows behind player and looks toward hoop
//   const p = rt.player;
//   const cam = rt.cam;

//   const lookYaw = Math.atan2(mode.hoopX - p.x, mode.hoopZ - p.z); // yaw toward hoop

//   cam.yaw = lookYaw;
//   cam.x = p.x;
//   cam.y = 95;
//   cam.z = p.z - 150;

//   // focal length
//   cam.f = 560;
// }

// function applyMove(rt: Runtime, mode: Mode, keys: Keys, dt: number) {
//   const p = rt.player;

//   if (!mode.allowMove) {
//     // still let you “shimmy” slightly in stationary modes (feels like 2K)
//     const left = isDown(keys, "ArrowLeft") || isDown(keys, "KeyA");
//     const right = isDown(keys, "ArrowRight") || isDown(keys, "KeyD");
//     const shim = (right ? 1 : 0) - (left ? 1 : 0);
//     p.x = clamp(p.x + shim * 80 * dt, -110, 110);
//     p.z = clamp(p.z, 15, 90);
//     return;
//   }

//   const up = isDown(keys, "ArrowUp") || isDown(keys, "KeyW");
//   const dn = isDown(keys, "ArrowDown") || isDown(keys, "KeyS");
//   const left = isDown(keys, "ArrowLeft") || isDown(keys, "KeyA");
//   const right = isDown(keys, "ArrowRight") || isDown(keys, "KeyD");

//   const mx = (right ? 1 : 0) - (left ? 1 : 0);
//   const mz = (up ? 1 : 0) - (dn ? 1 : 0);

//   let mag = Math.sqrt(mx * mx + mz * mz);
//   let dx = 0;
//   let dz = 0;
//   if (mag > 0.001) {
//     dx = mx / mag;
//     dz = mz / mag;
//   }

//   // base speed
//   const base = 150;
//   const jukeBoost = p.invulnT > 0 ? 1.15 : 1.0;

//   // accel
//   p.vx = lerp(p.vx, dx * base * jukeBoost, clamp01(10 * dt));
//   p.vz = lerp(p.vz, dz * base * jukeBoost, clamp01(10 * dt));

//   // integrate
//   p.x += p.vx * dt;
//   p.z += p.vz * dt;

//   // bounds
//   p.x = clamp(p.x, -COURT_W + 18, COURT_W - 18);
//   p.z = clamp(p.z, 10, COURT_Z_FAR - 25);

//   // facing
//   if (mag > 0.2) p.facing = Math.atan2(p.vx, p.vz);
// }

// function updateAI(rt: Runtime, mode: Mode, dt: number) {
//   // simple defenders: try to stay between player and hoop, with some pursuit
//   const p = rt.player;

//   for (let i = 0; i < rt.defenders.length; i++) {
//     const d = rt.defenders[i];

//     const targetX = lerp(p.x, mode.hoopX, 0.55);
//     const targetZ = lerp(p.z, mode.hoopZ, 0.55) - 38;

//     const dx = targetX - d.x;
//     const dz = targetZ - d.z;
//     const dist = Math.sqrt(dx * dx + dz * dz) || 1;

//     const speed = 120 + (1 - rt.difficultyMult) * 60;
//     d.vx = lerp(d.vx, (dx / dist) * speed, clamp01(6 * dt));
//     d.vz = lerp(d.vz, (dz / dist) * speed, clamp01(6 * dt));

//     d.x += d.vx * dt;
//     d.z += d.vz * dt;

//     // keep on court
//     d.x = clamp(d.x, -COURT_W + 18, COURT_W - 18);
//     d.z = clamp(d.z, 70, COURT_Z_FAR - 30);
//   }

//   // teammates drift into lanes
//   for (let i = 0; i < rt.teammates.length; i++) {
//     const t = rt.teammates[i];
//     const laneX = i === 0 ? -85 : 85;
//     const laneZ = clamp(p.z + 70, 110, 260);

//     const dx = laneX - t.x;
//     const dz = laneZ - t.z;
//     const dist = Math.sqrt(dx * dx + dz * dz) || 1;

//     const speed = 105;
//     t.vx = lerp(t.vx, (dx / dist) * speed, clamp01(4 * dt));
//     t.vz = lerp(t.vz, (dz / dist) * speed, clamp01(4 * dt));

//     t.x += t.vx * dt;
//     t.z += t.vz * dt;

//     t.x = clamp(t.x, -COURT_W + 18, COURT_W - 18);
//     t.z = clamp(t.z, 40, COURT_Z_FAR - 30);
//   }
// }

// function resolveBodyCollisions(rt: Runtime) {
//   // player vs defenders: if close and not invulnerable, steal when ball is held
//   const p = rt.player;

//   for (const d of rt.defenders) {
//     if (circleOverlap(p.x, p.z, PLAYER_R, d.x, d.z, DEF_R)) {
//       // push apart minimally
//       const dx = p.x - d.x;
//       const dz = p.z - d.z;
//       const dist = Math.sqrt(dx * dx + dz * dz) || 1;
//       const nx = dx / dist;
//       const nz = dz / dist;

//       const overlap = PLAYER_R + DEF_R - dist + 0.01;
//       p.x += nx * overlap * 0.65;
//       p.z += nz * overlap * 0.65;
//       d.x -= nx * overlap * 0.35;
//       d.z -= nz * overlap * 0.35;

//       // steal logic
//       const ball = rt.ball;
//       const canSteal = p.invulnT <= 0.0001 && ball.mode === "held" && ball.owner === "player";
//       if (canSteal) {
//         rt.ball = {
//           mode: "loose",
//           t: 0,
//           pos: { x: p.x, y: 40, z: p.z },
//           vel: { x: -nx * 120, y: 220, z: -nz * 120 },
//           lastPos: { x: p.x, y: 40, z: p.z },
//           touchedRim: false,
//           touchedBoard: false,
//         };
//         rt.message = "Stolen! Get space and reset.";
//         rt.streak = 0;
//         rt.lastResult = "MISS";
//       }
//     }
//   }
// }

// function updateJukes(rt: Runtime, dt: number) {
//   if (rt.player.invulnT > 0) {
//     rt.player.invulnT = Math.max(0, rt.player.invulnT - dt);
//   }
//   for (const d of rt.defenders) {
//     if (d.invulnT > 0) d.invulnT = Math.max(0, d.invulnT - dt);
//   }
// }

// function doJuke(rt: Runtime, dir: -1 | 1) {
//   // quick lateral burst + brief invulnerability
//   const p = rt.player;
//   p.invulnT = 0.28;
//   p.vx += dir * 220;
//   rt.message = dir === -1 ? "Juke left!" : "Juke right!";
// }

// function startCharge(rt: Runtime) {
//   if (rt.charging) return;
//   if (rt.ball.mode !== "held" || rt.ball.owner !== "player") return;
//   rt.charging = true;
//   rt.meterPhase = 0;
//   rt.message = "Shooting… release SPACE on the green window!";
// }

// function releaseShot(rt: Runtime, mode: Mode) {
//   if (!rt.charging) return;
//   if (rt.ball.mode !== "held" || rt.ball.owner !== "player") return;

//   rt.charging = false;

//   const p = rt.player;
//   const hoop = { x: mode.hoopX, y: mode.hoopY, z: mode.hoopZ };

//   // meter timing quality
//   const v = rt.meterVal;
//   const err = Math.abs(v - rt.meterTarget);

//   // windows tighten with streak
//   const swishWin = 0.06 * rt.difficultyMult;
//   const makeWin = 0.14 * rt.difficultyMult;

//   // defender contest increases error
//   const defDist = nearestDefenderDist(p, rt.defenders);
//   const contest = clamp01(1 - defDist / 85);

//   // distance affects time-of-flight
//   const dx = hoop.x - p.x;
//   const dz = hoop.z - p.z;
//   const dist = Math.sqrt(dx * dx + dz * dz);

//   const T = clamp(dist / 240, 0.75, 1.2);

//   // release point (hand)
//   const y0 = 54;

//   // base vx/vz to reach rim center
//   let vx = dx / T;
//   let vz = dz / T;

//   // vy to hit hoop height at time T
//   let vy = (hoop.y - y0 - 0.5 * GRAVITY * T * T) / T;

//   // apply error + contest (miss left/right/short/long)
//   const missFactor = clamp01(err / 0.22) * (0.55 + contest * 0.9);

//   // sideways drift based on sign (fake “aim”)
//   const side = p.x >= hoop.x ? 1 : -1;
//   vx += side * 95 * missFactor;

//   // depth drift
//   vz += (Math.random() - 0.5) * 80 * missFactor;

//   // a bit more “flat” if very off
//   vy *= 1 - 0.12 * missFactor;

//   // if good timing, lightly assist
//   const assist = err <= swishWin ? 0.24 : err <= makeWin ? 0.12 : 0;
//   vx = lerp(vx, dx / T, assist);
//   vz = lerp(vz, dz / T, assist);
//   vy = lerp(vy, (hoop.y - y0 - 0.5 * GRAVITY * T * T) / T, assist);

//   rt.ball = {
//     mode: "shot",
//     owner: "player",
//     t: 0,
//     pos: { x: p.x, y: y0, z: p.z },
//     vel: { x: vx, y: vy, z: vz },
//     lastPos: { x: p.x, y: y0, z: p.z },
//     touchedRim: false,
//     touchedBoard: false,
//   };

//   rt.shotClockLeft = mode.shotClockSec;
//   rt.message = "Shot up!";
// }

// function startPass(rt: Runtime, mode: Mode) {
//   if (rt.ball.mode !== "held" || rt.ball.owner !== "player") return;
//   if (rt.teammates.length === 0) return;

//   // pick nearest teammate
//   const p = rt.player;
//   let bestI = 0;
//   let bestD = 1e9;
//   for (let i = 0; i < rt.teammates.length; i++) {
//     const t = rt.teammates[i];
//     const d = len2(t.x - p.x, t.z - p.z);
//     if (d < bestD) {
//       bestD = d;
//       bestI = i;
//     }
//   }

//   const t = rt.teammates[bestI];
//   const start = { x: p.x, y: 54, z: p.z };
//   const end = { x: t.x, y: 54, z: t.z };
//   const dist = len2(end.x - start.x, end.z - start.z);

//   rt.ball = {
//     mode: "pass",
//     owner: "player",
//     target: `tm${bestI}`,
//     t: 0,
//     dur: clamp(dist / 420, 0.28, 0.5),
//     start,
//     end,
//     pos: { ...start },
//     vel: { x: 0, y: 0, z: 0 },
//     lastPos: { ...start },
//     touchedRim: false,
//     touchedBoard: false,
//   };

//   rt.message = `Pass to teammate ${bestI + 1}!`;
//   rt.shotClockLeft = mode.shotClockSec;
// }

// function updateBall(rt: Runtime, mode: Mode, dt: number) {
//   const b = rt.ball;
//   const p = rt.player;

//   if (b.mode === "held") {
//     // dribble-ish offset
//     b.t += dt;
//     const bob = Math.abs(Math.sin(b.t * 9.5)) * 10;

//     const hand: Vec3 = { x: p.x, y: 48 - bob, z: p.z };
//     b.lastPos = { ...b.pos };
//     b.pos = hand;
//     return;
//   }

//   if (b.mode === "pass") {
//     b.t += dt;
//     const t = clamp01(b.t / b.dur);

//     const x = lerp(b.start.x, b.end.x, t);
//     const z = lerp(b.start.z, b.end.z, t);
//     const y = lerp(b.start.y, b.end.y, t) + Math.sin(Math.PI * t) * 38;

//     b.lastPos = { ...b.pos };
//     b.pos = { x, y, z };

//     if (t >= 1) {
//       // caught -> return to player quickly (keeps control simple)
//       rt.ball = {
//         mode: "held",
//         owner: "player",
//         t: 0,
//         pos: { x: p.x, y: 50, z: p.z },
//         vel: { x: 0, y: 0, z: 0 },
//         lastPos: { x: p.x, y: 50, z: p.z },
//         touchedRim: false,
//         touchedBoard: false,
//       };
//       rt.message = "Catch and back!";
//     }
//     return;
//   }

//   // shot / loose physics
//   if (b.mode === "shot" || b.mode === "loose") {
//     b.t += dt;
//     b.lastPos = { ...b.pos };

//     // integrate
//     b.vel.y -= GRAVITY * dt;
//     b.pos.x += b.vel.x * dt;
//     b.pos.y += b.vel.y * dt;
//     b.pos.z += b.vel.z * dt;

//     // air drag
//     b.vel.x *= AIR_DRAG;
//     b.vel.y *= AIR_DRAG;
//     b.vel.z *= AIR_DRAG;

//     // floor
//     if (b.pos.y - BALL_R < FLOOR_Y) {
//       b.pos.y = FLOOR_Y + BALL_R;
//       if (b.vel.y < 0) b.vel.y = -b.vel.y * E_FLOOR;
//       b.vel.x *= 0.86;
//       b.vel.z *= 0.86;
//     }

//     // backboard collision (simple plane at z = hoopZ + BACKBOARD_Z_OFF)
//     const boardZ = mode.hoopZ + BACKBOARD_Z_OFF;
//     const withinBoardX = Math.abs(b.pos.x - mode.hoopX) <= BACKBOARD_W / 2;
//     const withinBoardY = b.pos.y >= mode.hoopY - BACKBOARD_H / 2 && b.pos.y <= mode.hoopY + BACKBOARD_H / 2;

//     // detect crossing plane
//     const wasBehind = b.lastPos.z > boardZ;
//     const isInFront = b.pos.z <= boardZ;
//     if (withinBoardX && withinBoardY && wasBehind && isInFront) {
//       b.pos.z = boardZ + 0.01;
//       b.vel.z = Math.abs(b.vel.z) * E_BOARD;
//       b.touchedBoard = true;
//     }

//     // rim collision approx: collide with a “ring band” in XZ at y ~ hoopY
//     // We approximate the rim as a circle at hoopY with thickness.
//     const dy = b.pos.y - mode.hoopY;
//     if (Math.abs(dy) <= (RIM_THICK + BALL_R) * 2) {
//       const dx = b.pos.x - mode.hoopX;
//       const dz = b.pos.z - mode.hoopZ;
//       const r = Math.sqrt(dx * dx + dz * dz);

//       const rimBandMin = RIM_R - (RIM_THICK + BALL_R);
//       const rimBandMax = RIM_R + (RIM_THICK + BALL_R);

//       if (r >= rimBandMin && r <= rimBandMax) {
//         // push outward from ring center to approximate bounce
//         const nx = dx / (r || 1);
//         const nz = dz / (r || 1);
//         b.pos.x = mode.hoopX + nx * rimBandMax;
//         b.pos.z = mode.hoopZ + nz * rimBandMax;

//         // reflect sideways components a bit
//         b.vel.x += nx * 80 * E_RIM;
//         b.vel.z += nz * 80 * E_RIM;
//         b.vel.y *= 0.92;

//         b.touchedRim = true;
//       }
//     }

//     // scoring check: ball crosses rim plane downward near center
//     const crossedDown = b.lastPos.y > mode.hoopY && b.pos.y <= mode.hoopY && b.vel.y < 0;
//     if (crossedDown) {
//       const dx = b.pos.x - mode.hoopX;
//       const dz = b.pos.z - mode.hoopZ;
//       const r = Math.sqrt(dx * dx + dz * dz);

//       if (r <= RIM_R * 0.85) {
//         const res: ShotResult = !b.touchedRim && !b.touchedBoard ? "SWISH" : "MAKE";
//         onShotResult(rt, mode, res);
//         // freeze ball back to hand
//         rt.ball = {
//           mode: "held",
//           owner: "player",
//           t: 0,
//           pos: { x: p.x, y: 50, z: p.z },
//           vel: { x: 0, y: 0, z: 0 },
//           lastPos: { x: p.x, y: 50, z: p.z },
//           touchedRim: false,
//           touchedBoard: false,
//         };
//         return;
//       }
//     }

//     // end of shot after a while
//     if (b.mode === "shot" && b.t > 2.4) {
//       onShotResult(rt, mode, "MISS");
//       rt.ball = {
//         mode: "held",
//         owner: "player",
//         t: 0,
//         pos: { x: p.x, y: 50, z: p.z },
//         vel: { x: 0, y: 0, z: 0 },
//         lastPos: { x: p.x, y: 50, z: p.z },
//         touchedRim: false,
//         touchedBoard: false,
//       };
//     }
//   }
// }

// /**
//  * Collision logic follows basic circle/box ideas (overlap + response),
//  * same style as MDN collision detection techniques. :contentReference[oaicite:3]{index=3}
//  */
// function onShotResult(rt: Runtime, mode: Mode, res: ShotResult) {
//   rt.lastResult = res;

//   if (res === "MISS") {
//     rt.message = "Miss.";
//     rt.streak = 0;
//     rt.difficultyMult = clamp(1 - rt.streak * 0.03, 0.55, 1);
//     return;
//   }

//   // distance-based 2/3 + hot zone multiplier (Street Run only)
//   let pts = res === "SWISH" ? mode.pointsSwish : mode.pointsMake;

//   if (mode.id === "street_run") {
//     const dx = mode.hoopX - rt.player.x;
//     const dz = mode.hoopZ - rt.player.z;
//     const dist = Math.sqrt(dx * dx + dz * dz);
//     const isThree = dist > 255;
//     pts = isThree ? (res === "SWISH" ? 4 : 3) : pts;

//     const mult = hotZoneMult(rt.player.x, rt.player.z);
//     pts = Math.round(pts * mult);
//   }

//   rt.score += pts;

//   rt.streak += 1;
//   rt.bestStreak = Math.max(rt.bestStreak, rt.streak);
//   rt.difficultyMult = clamp(1 - rt.streak * 0.03, 0.55, 1);

//   rt.message = res === "SWISH" ? `SWISH! +${pts}` : `Bucket! +${pts}`;

//   // reset shot clock on make
//   rt.shotClockLeft = mode.shotClockSec;
// }

// function updateClocks(rt: Runtime, mode: Mode, dt: number) {
//   // shot clock
//   rt.shotClockLeft -= dt;
//   if (rt.shotClockLeft <= 0) {
//     rt.shotClockLeft = 0;
//     rt.message = "Shot clock violation!";
//     rt.streak = 0;
//     rt.lastResult = "MISS";
//     resetPossession(rt, mode);
//   }

//   // quarters
//   rt.quarterLeft -= dt;
//   if (rt.quarterLeft <= 0) {
//     rt.quarterLeft = 0;

//     if (rt.quarter < mode.quarters) {
//       rt.quarter += 1;
//       rt.quarterLeft = mode.quarterSec;
//       rt.shotClockLeft = mode.shotClockSec;
//       rt.message = `Quarter ${rt.quarter}!`;
//     } else {
//       // game over (freeze)
//       rt.message = "Final! Submit your score.";
//     }
//   }
// }

// /* =========================
//    Component
//    ========================= */

// export default function ArcadePage() {
//   const [phase, setPhase] = useState<Phase>("splash");
//   const [splashGone, setSplashGone] = useState(false);

//   const [user, setUser] = useState<User | null>(null);

//   const [modeId, setModeId] = useState<ModeId>("street_run");
//   const mode = useMemo(() => MODES.find((m) => m.id === modeId)!, [modeId]);

//   const [char, setChar] = useState<CharacterConfig>(() =>
//     loadJSON<CharacterConfig>("arcade_char_v4", DEFAULT_CHAR)
//   );

//   const [leaders, setLeaders] = useState<LeaderRow[]>([]);
//   const [lbMsg, setLbMsg] = useState("");

//   // HUD state (throttled updates from runtime)
//   const [score, setScore] = useState(0);
//   const [streak, setStreak] = useState(0);
//   const [quarter, setQuarter] = useState(1);
//   const [quarterLeft, setQuarterLeft] = useState(0);
//   const [shotClockLeft, setShotClockLeft] = useState(0);
//   const [message, setMessage] = useState("");
//   const [lastResult, setLastResult] = useState<ShotResult | null>(null);

//   const canvasRef = useRef<HTMLCanvasElement | null>(null);
//   const rafRef = useRef<number | null>(null);
//   const lastTsRef = useRef<number | null>(null);

//   const keysRef = useRef<Keys>({});
//   const rtRef = useRef<Runtime>(initRuntime(mode));

//   // Splash
//   useEffect(() => {
//     const t1 = setTimeout(() => setSplashGone(true), 1600);
//     const t2 = setTimeout(() => setPhase("menu"), 2200);
//     return () => {
//       clearTimeout(t1);
//       clearTimeout(t2);
//     };
//   }, []);

//   // Auth
//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (u) => setUser(u));
//     return () => unsub();
//   }, []);

//   // Save character
//   useEffect(() => {
//     if (phase === "splash") return;
//     saveJSON("arcade_char_v4", char);
//   }, [char, phase]);

//   // Leaderboard (same path)
//   useEffect(() => {
//     const col = collection(db, "tournaments", TOURNAMENT_ID, "arcadeLeaderboard");
//     const qref = query(col, orderBy("score", "desc"), limit(15));
//     const unsub = onSnapshot(
//       qref,
//       (snap) => {
//         const rows = snap.docs
//           .map((d) => d.data() as any)
//           .filter((r) => r && typeof r.score === "number" && typeof r.uid === "string")
//           .filter((r) => r.mode === modeId || !r.mode)
//           .map((r) => ({
//             uid: r.uid,
//             name: r.name || "Player",
//             score: r.score,
//             mode: (r.mode || "free_throw") as ModeId,
//             updatedAt: r.updatedAt,
//           }));
//         setLeaders(rows);
//       },
//       (err) => console.error(err)
//     );
//     return () => unsub();
//   }, [modeId]);

//   // Keyboard listeners (event.code)
//   useEffect(() => {
//     const onDown = (e: KeyboardEvent) => {
//       // avoid repeats spamming actions
//       if (e.repeat) return;
//       keysRef.current[e.code] = true;

//       if (phase !== "game") return;

//       const rt = rtRef.current;

//       if (e.code === "Space") startCharge(rt);
//       if (e.code === "KeyQ") startPass(rt, mode);
//       if (e.code === "KeyE") doJuke(rt, -1);
//       if (e.code === "KeyF") doJuke(rt, +1);
//       if (e.code === "KeyR") resetPossession(rt, mode);
//     };

//     const onUp = (e: KeyboardEvent) => {
//       keysRef.current[e.code] = false;

//       if (phase !== "game") return;
//       if (e.code === "Space") releaseShot(rtRef.current, mode);
//     };

//     window.addEventListener("keydown", onDown);
//     window.addEventListener("keyup", onUp);
//     return () => {
//       window.removeEventListener("keydown", onDown);
//       window.removeEventListener("keyup", onUp);
//     };
//   }, [phase, mode]);

//   function stopLoop() {
//     if (rafRef.current) cancelAnimationFrame(rafRef.current);
//     rafRef.current = null;
//     lastTsRef.current = null;
//   }

//   function startGame() {
//     rtRef.current = initRuntime(mode);
//     // set initial HUD
//     setScore(0);
//     setStreak(0);
//     setQuarter(1);
//     setQuarterLeft(mode.quarterSec);
//     setShotClockLeft(mode.shotClockSec);
//     setMessage("WASD/Arrows to move • Hold Space to shoot • Q pass • E/F juke");
//     setLastResult(null);

//     setPhase("game");
//   }

//   function backToMenu() {
//     stopLoop();
//     setPhase("menu");
//   }

//   // Main loop (requestAnimationFrame)
//   useEffect(() => {
//     if (phase !== "game") return;

//     const loop = (ts: number) => {
//       if (lastTsRef.current == null) lastTsRef.current = ts;
//       const dt = Math.min(0.05, (ts - lastTsRef.current) / 1000);
//       lastTsRef.current = ts;

//       const rt = rtRef.current;

//       // freeze if final over
//       const finalOver = rt.quarter >= mode.quarters && rt.quarterLeft <= 0;
//       if (!finalOver) {
//         // clocks
//         updateClocks(rt, mode, dt);

//         // movement + ai
//         applyMove(rt, mode, keysRef.current, dt);
//         updateAI(rt, mode, dt);
//         updateJukes(rt, dt);

//         // shot meter (2K style ping-pong)
//         if (rt.charging) {
//           rt.meterPhase += dt * rt.meterSpeed;
//           rt.meterVal = pingPong01(rt.meterPhase);
//         } else {
//           rt.meterVal = 0;
//           rt.meterPhase = 0;
//         }

//         // ball
//         updateBall(rt, mode, dt);

//         // body collisions (steals)
//         resolveBodyCollisions(rt);

//         // difficulty
//         rt.difficultyMult = clamp(1 - rt.streak * 0.03, 0.55, 1);

//         // camera
//         updateCamera(rt, mode);
//       }

//       // draw
//       drawFrame(rt);

//       // HUD throttle
//       rt.hudAccum += dt;
//       if (rt.hudAccum >= 0.08) {
//         rt.hudAccum = 0;

//         setScore(rt.score);
//         setStreak(rt.streak);
//         setQuarter(rt.quarter);
//         setQuarterLeft(Math.max(0, rt.quarterLeft));
//         setShotClockLeft(Math.max(0, rt.shotClockLeft));
//         setMessage(rt.message);
//         setLastResult(rt.lastResult);
//       }

//       rafRef.current = requestAnimationFrame(loop);
//     };

//     rafRef.current = requestAnimationFrame(loop);
//     return () => stopLoop();
//     // requestAnimationFrame is the standard way to sync game rendering to repaint :contentReference[oaicite:4]{index=4}
//   }, [phase, mode]);

//   function drawFrame(rt: Runtime) {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const dpr = window.devicePixelRatio || 1;
//     if (canvas.width !== Math.floor(CSS_W * dpr) || canvas.height !== Math.floor(CSS_H * dpr)) {
//       canvas.width = Math.floor(CSS_W * dpr);
//       canvas.height = Math.floor(CSS_H * dpr);
//       canvas.style.width = `${CSS_W}px`;
//       canvas.style.height = `${CSS_H}px`;
//     }

//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
//     ctx.clearRect(0, 0, CSS_W, CSS_H);

//     // court + hoop
//     drawCourt(ctx, rt, mode);

//     // draw entities sorted by depth
//     const drawables: Array<{ z: number; fn: () => void }> = [];

//     // teammates
//     for (const t of rt.teammates) {
//       const p = project({ x: t.x, y: 0, z: t.z }, rt.cam);
//       if (!p) continue;
//       drawables.push({
//         z: p.z,
//         fn: () => drawBillboardPlayer(ctx, rt, t, char, "teammate"),
//       });
//     }

//     // defenders
//     for (const d of rt.defenders) {
//       const p = project({ x: d.x, y: 0, z: d.z }, rt.cam);
//       if (!p) continue;
//       drawables.push({
//         z: p.z,
//         fn: () => drawBillboardPlayer(ctx, rt, d, char, "defender"),
//       });
//     }

//     // player
//     {
//       const p = project({ x: rt.player.x, y: 0, z: rt.player.z }, rt.cam);
//       if (p) drawables.push({ z: p.z, fn: () => drawBillboardPlayer(ctx, rt, rt.player, char, "player") });
//     }

//     // ball
//     {
//       const bp = rt.ball.pos;
//       const p = project(bp, rt.cam);
//       if (p) drawables.push({ z: p.z, fn: () => drawBall(ctx, rt, bp) });
//     }

//     drawables.sort((a, b) => a.z - b.z);
//     for (const d of drawables) d.fn();

//     // shot meter near player
//     drawShotMeter(ctx, rt, rt.player);

//     // top HUD overlay
//     ctx.save();
//     ctx.fillStyle = "rgba(0,0,0,0.35)";
//     ctx.fillRect(12, 12, 360, 72);
//     ctx.fillStyle = "rgba(255,255,255,0.92)";
//     ctx.font = "14px ui-sans-serif";
//     ctx.fillText(`Q${quarter} • ${Math.ceil(quarterLeft)}s  |  Shot: ${Math.ceil(shotClockLeft)}s`, 24, 38);
//     ctx.fillText(`Score: ${score}  •  Streak: ${streak}`, 24, 62);
//     ctx.restore();
//   }

//   async function submitScore() {
//     setLbMsg("");
//     if (!user) {
//       setLbMsg("Sign in to submit your score.");
//       return;
//     }

//     try {
//       const ref = doc(db, "tournaments", TOURNAMENT_ID, "arcadeLeaderboard", user.uid);
//       const snap = await getDoc(ref);
//       const prev = snap.exists() ? (snap.data() as any).score : 0;

//       if (score <= (prev || 0)) {
//         setLbMsg(`Your saved score is already ${prev || 0}. Beat it to update.`);
//         return;
//       }

//       await setDoc(
//         ref,
//         {
//           uid: user.uid,
//           name: user.displayName || user.email || "Player",
//           score,
//           mode: modeId,
//           updatedAt: serverTimestamp(),
//         },
//         { merge: true }
//       );

//       setLbMsg("✅ Score submitted!");
//     } catch (e) {
//       console.error(e);
//       setLbMsg("Error submitting. Check Firestore rules.");
//     }
//   }

//   return (
//     <main className="wrap">
//       <div className="stage">
//         {phase === "splash" ? (
//           <div className={splashGone ? "splash splashOut" : "splash"}>
//             <div className="splashInner">
//               <div className="splashLine1">Developed by</div>
//               <div className="splashLine2">Charlie Richards</div>
//               <div className="splashLine3">AZ Road to Open Arcade</div>
//               <div className="splashLine4">Loading…</div>
//             </div>
//           </div>
//         ) : null}

//         <header className="hero">
//           <div className="topbar">
//             <div>
//               <div className="title">🏀 Arcade (3rd Person)</div>
//               <div className="subtitle">
//                 Move + defenders + passing + 2K-style shot meter next to player
//               </div>
//             </div>

//             <div className="topActions">
//               <Link className="btn" href="/">
//                 ← Home
//               </Link>
//               {phase === "game" ? (
//                 <button className="btnGhost" onClick={backToMenu}>
//                   Menu
//                 </button>
//               ) : null}
//             </div>
//           </div>

//           {phase === "menu" ? (
//             <div className="menuGrid">
//               <section className="card">
//                 <div className="cardTitle">Choose Mode</div>
//                 <div className="modeGrid">
//                   {MODES.map((m) => (
//                     <button
//                       key={m.id}
//                       className={m.id === modeId ? "modeBtn modeBtnOn" : "modeBtn"}
//                       onClick={() => setModeId(m.id)}
//                     >
//                       <div className="modeName">{m.name}</div>
//                       <div className="modeDesc">{m.description}</div>
//                       <div className="modePts">
//                         Make: <b>+{m.pointsMake}</b> • Swish: <b>+{m.pointsSwish}</b>
//                         {m.defenders ? <> • Def: <b>{m.defenders}</b></> : null}
//                         {m.teammates ? <> • Team: <b>{m.teammates}</b></> : null}
//                       </div>
//                     </button>
//                   ))}
//                 </div>

//                 <div className="menuActions">
//                   <button className="startBtn" onClick={startGame}>
//                     Start {mode.name} →
//                   </button>
//                   <div className="menuNote">
//                     Controls: WASD/Arrows move • Hold Space shoot • Q pass • E/F juke
//                   </div>
//                 </div>
//               </section>

//               <section className="card cardAlt">
//                 <div className="cardTitle">Customize Player</div>

//                 <div className="customGrid">
//                   <label className="lab">
//                     Skin
//                     <input
//                       className="inp"
//                       type="color"
//                       value={char.skin}
//                       onChange={(e) => setChar((c) => ({ ...c, skin: e.target.value }))}
//                     />
//                   </label>

//                   <label className="lab">
//                     Hair color
//                     <input
//                       className="inp"
//                       type="color"
//                       value={char.hairColor}
//                       onChange={(e) => setChar((c) => ({ ...c, hairColor: e.target.value }))}
//                     />
//                   </label>

//                   <label className="lab">
//                     Jersey color
//                     <input
//                       className="inp"
//                       type="color"
//                       value={char.jersey}
//                       onChange={(e) => setChar((c) => ({ ...c, jersey: e.target.value }))}
//                     />
//                   </label>

//                   <label className="lab">
//                     Shoes
//                     <input
//                       className="inp"
//                       type="color"
//                       value={char.shoes}
//                       onChange={(e) => setChar((c) => ({ ...c, shoes: e.target.value }))}
//                     />
//                   </label>

//                   <label className="lab">
//                     Number
//                     <input
//                       className="inpText"
//                       value={char.number}
//                       onChange={(e) =>
//                         setChar((c) => ({
//                           ...c,
//                           number: e.target.value.replace(/[^\d]/g, "").slice(0, 2),
//                         }))
//                       }
//                       placeholder="00"
//                     />
//                   </label>

//                   <label className="lab">
//                     Hair style
//                     <select
//                       className="inpSelect"
//                       value={char.hairStyle}
//                       onChange={(e) => setChar((c) => ({ ...c, hairStyle: e.target.value as any }))}
//                     >
//                       <option value="short">Short</option>
//                       <option value="fade">Fade</option>
//                       <option value="curly">Curly</option>
//                     </select>
//                   </label>

//                   <label className="lab">
//                     Headband
//                     <button
//                       className={char.headband ? "pill pillOn" : "pill"}
//                       onClick={() => setChar((c) => ({ ...c, headband: !c.headband }))}
//                       type="button"
//                     >
//                       {char.headband ? "ON" : "OFF"}
//                     </button>
//                   </label>

//                   <label className="lab">
//                     Sleeve
//                     <button
//                       className={char.sleeve ? "pill pillOn" : "pill"}
//                       onClick={() => setChar((c) => ({ ...c, sleeve: !c.sleeve }))}
//                       type="button"
//                     >
//                       {char.sleeve ? "ON" : "OFF"}
//                     </button>
//                   </label>

//                   <label className="lab">
//                     Jersey pattern
//                     <select
//                       className="inpSelect"
//                       value={char.jerseyPattern}
//                       onChange={(e) =>
//                         setChar((c) => ({ ...c, jerseyPattern: e.target.value as any }))
//                       }
//                     >
//                       <option value="solid">Solid</option>
//                       <option value="stripe">Stripe</option>
//                       <option value="diagonal">Diagonal</option>
//                     </select>
//                   </label>
//                 </div>

//                 <div className="previewRow">
//                   <div className="previewBox">
//                     <PlayerAvatar char={char} />
//                   </div>
//                   <div className="previewInfo">
//                     <div className="metaLine">
//                       <b>Tip:</b> Your release timing matters more when a defender is close.
//                     </div>
//                     <div className="metaLine">
//                       <b>Hot zones:</b> corners & top key boost points.
//                     </div>
//                   </div>
//                 </div>
//               </section>

//               <section className="card cardWide">
//                 <div className="cardTitle">Leaderboard (Top 15 • {mode.name})</div>
//                 <div className="lb">
//                   {leaders.length === 0 ? (
//                     <div className="muted">No scores yet.</div>
//                   ) : (
//                     leaders.map((r, idx) => (
//                       <div className="lbRow" key={r.uid}>
//                         <div className="lbRank">#{idx + 1}</div>
//                         <div className="lbName">{r.name}</div>
//                         <div className="lbScore">{r.score}</div>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               </section>
//             </div>
//           ) : null}

//           {phase === "game" ? (
//             <>
//               <section className="gameCard">
//                 <div className="msgRow">
//                   <div className="msg">{message}</div>
//                   <div className="rightChips">
//                     {lastResult ? (
//                       <div
//                         className={
//                           lastResult === "SWISH"
//                             ? "badge badgeSwish"
//                             : lastResult === "MAKE"
//                             ? "badge badgeMake"
//                             : "badge badgeMiss"
//                         }
//                       >
//                         {lastResult}
//                       </div>
//                     ) : null}
//                   </div>
//                 </div>

//                 <div className="court">
//                   <div className="courtLeft">
//                     <div className="controlsTitle">Controls</div>
//                     <div className="controlsLine">Move: WASD / Arrow Keys</div>
//                     <div className="controlsLine">Shoot: Hold Space, release</div>
//                     <div className="controlsLine">Pass: Q</div>
//                     <div className="controlsLine">Juke: E / F</div>
//                     <div className="controlsLine">Reset: R</div>

//                     <div className="miniInfo">
//                       <div><b>Quarter:</b> {quarter}</div>
//                       <div><b>Q time:</b> {Math.ceil(quarterLeft)}s</div>
//                       <div><b>Shot:</b> {Math.ceil(shotClockLeft)}s</div>
//                       <div><b>Score:</b> {score}</div>
//                       <div><b>Streak:</b> {streak}</div>
//                     </div>
//                   </div>

//                   <div className="courtRight">
//                     <canvas ref={canvasRef} className="cv" />
//                   </div>
//                 </div>

//                 <div className="submitRow">
//                   <button className="submitBtn" onClick={submitScore}>
//                     Submit Score to Leaderboard
//                   </button>
//                   <div className="muted">
//                     {user ? `Signed in as ${user.displayName || user.email}` : "Not signed in"}
//                   </div>
//                   {lbMsg ? <div className="lbMsg">{lbMsg}</div> : null}
//                 </div>
//               </section>
//             </>
//           ) : null}
//         </header>
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
//         .hero {
//           position: relative;
//           padding: 22px;
//         }

//         /* Splash */
//         .splash {
//           position: fixed;
//           inset: 0;
//           z-index: 9999;
//           display: grid;
//           place-items: center;
//           background: rgba(0,0,0,0.86);
//           backdrop-filter: blur(10px);
//           animation: splashIn 600ms ease forwards;
//         }
//         .splashOut {
//           animation: splashOut 650ms ease forwards;
//         }
//         .splashInner {
//           text-align: center;
//           padding: 18px;
//           border-radius: 18px;
//           border: 1px solid rgba(255,255,255,0.14);
//           background: rgba(255,255,255,0.04);
//           box-shadow: 0 20px 60px rgba(0,0,0,0.45);
//           min-width: min(520px, 92%);
//         }
//         .splashLine1 { opacity: 0.85; font-weight: 800; }
//         .splashLine2 { margin-top: 6px; font-size: 26px; font-weight: 950; }
//         .splashLine3 { margin-top: 10px; opacity: 0.7; font-size: 13px; }
//         .splashLine4 { margin-top: 14px; opacity: 0.85; font-size: 12px; letter-spacing: 0.35px; }
//         @keyframes splashIn { from { opacity: 0; } to { opacity: 1; } }
//         @keyframes splashOut { from { opacity: 1; } to { opacity: 0; pointer-events: none; } }

//         .topbar {
//           display: flex;
//           justify-content: space-between;
//           gap: 12px;
//           flex-wrap: wrap;
//           align-items: flex-end;
//         }
//         .title { font-size: 24px; font-weight: 900; }
//         .subtitle { margin-top: 6px; opacity: 0.75; font-size: 13px; line-height: 18px; }
//         .topActions { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }

//         .btn {
//           border-radius: 12px;
//           padding: 10px 14px;
//           border: 1px solid rgba(255, 255, 255, 0.28);
//           text-decoration: none;
//           color: #fff;
//           background: rgba(0, 0, 0, 0.22);
//           font-weight: 800;
//         }
//         .btnGhost {
//           border-radius: 12px;
//           padding: 10px 14px;
//           border: 1px solid rgba(255, 255, 255, 0.20);
//           background: rgba(0, 0, 0, 0.18);
//           color: rgba(255, 255, 255, 0.92);
//           font-weight: 800;
//           cursor: pointer;
//         }

//         .menuGrid {
//           margin-top: 16px;
//           display: grid;
//           grid-template-columns: 1.1fr 0.9fr;
//           gap: 12px;
//         }
//         .cardWide { grid-column: 1 / -1; }

//         .card {
//           border-radius: 18px;
//           border: 1px solid rgba(242, 194, 48, 0.35);
//           background: rgba(242, 194, 48, 0.07);
//           box-shadow: 0 14px 35px rgba(0, 0, 0, 0.30);
//           padding: 16px;
//         }
//         .cardAlt {
//           border-color: rgba(120,180,255,0.28);
//           background: rgba(120,180,255,0.07);
//         }
//         .cardTitle { font-weight: 950; margin-bottom: 10px; }

//         .modeGrid { display: grid; gap: 10px; }
//         .modeBtn {
//           text-align: left;
//           border-radius: 14px;
//           border: 1px solid rgba(255,255,255,0.12);
//           background: rgba(0,0,0,0.18);
//           padding: 12px;
//           cursor: pointer;
//           color: #fff;
//         }
//         .modeBtnOn { border-color: rgba(242,194,48,0.45); background: rgba(242,194,48,0.10); }
//         .modeName { font-weight: 950; }
//         .modeDesc { margin-top: 6px; opacity: 0.82; font-size: 13px; line-height: 18px; }
//         .modePts { margin-top: 8px; opacity: 0.75; font-size: 12px; }

//         .menuActions { margin-top: 14px; display: grid; gap: 10px; }
//         .startBtn {
//           border-radius: 12px;
//           padding: 12px 14px;
//           border: 1px solid rgba(242, 194, 48, 0.60);
//           background: rgba(242, 194, 48, 0.14);
//           color: #fff;
//           font-weight: 950;
//           cursor: pointer;
//         }
//         .menuNote { opacity: 0.75; font-size: 12px; line-height: 16px; }

//         .customGrid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
//         .lab { display: grid; gap: 6px; font-weight: 850; font-size: 12px; opacity: 0.9; }
//         .inp {
//           width: 100%;
//           height: 38px;
//           border-radius: 12px;
//           border: 1px solid rgba(255,255,255,0.18);
//           background: rgba(0,0,0,0.20);
//           padding: 4px 8px;
//         }
//         .inpText, .inpSelect {
//           width: 100%;
//           height: 38px;
//           border-radius: 12px;
//           border: 1px solid rgba(255,255,255,0.18);
//           background: rgba(0,0,0,0.20);
//           padding: 0 10px;
//           color: #fff;
//           font-weight: 900;
//           outline: none;
//         }
//         .pill {
//           padding: 8px 10px;
//           border-radius: 12px;
//           font-weight: 950;
//           font-size: 12px;
//           border: 1px solid rgba(255,255,255,0.16);
//           background: rgba(0,0,0,0.18);
//           color: #fff;
//           cursor: pointer;
//         }
//         .pillOn { border-color: rgba(120,255,170,0.35); background: rgba(120,255,170,0.10); }

//         .previewRow {
//           margin-top: 12px;
//           display: grid;
//           grid-template-columns: 220px 1fr;
//           gap: 12px;
//           align-items: center;
//         }
//         .previewBox {
//           border-radius: 16px;
//           border: 1px solid rgba(255,255,255,0.12);
//           background: rgba(0,0,0,0.18);
//           padding: 10px;
//           display: grid;
//           place-items: center;
//         }
//         .previewInfo {
//           border-radius: 16px;
//           border: 1px solid rgba(255,255,255,0.10);
//           background: rgba(255,255,255,0.03);
//           padding: 12px;
//           opacity: 0.9;
//         }
//         .metaLine { margin-top: 8px; }
//         .metaLine:first-child { margin-top: 0; }

//         .lb { display: grid; gap: 8px; }
//         .lbRow {
//           display: grid;
//           grid-template-columns: 60px 1fr 90px;
//           gap: 10px;
//           align-items: center;
//           border-radius: 12px;
//           border: 1px solid rgba(255,255,255,0.10);
//           background: rgba(0,0,0,0.16);
//           padding: 10px;
//         }
//         .lbRank { opacity: 0.8; font-weight: 900; }
//         .lbName { font-weight: 900; }
//         .lbScore { text-align: right; font-weight: 950; }

//         .gameCard {
//           margin-top: 12px;
//           border-radius: 18px;
//           border: 1px solid rgba(120,180,255,0.28);
//           background: rgba(120,180,255,0.07);
//           box-shadow: 0 14px 35px rgba(0, 0, 0, 0.30);
//           padding: 16px;
//         }

//         .msgRow {
//           display: flex;
//           justify-content: space-between;
//           gap: 10px;
//           flex-wrap: wrap;
//           align-items: center;
//           margin-bottom: 12px;
//         }
//         .msg { font-weight: 950; }
//         .rightChips { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }

//         .badge {
//           padding: 6px 10px;
//           border-radius: 999px;
//           font-weight: 950;
//           font-size: 12px;
//           border: 1px solid rgba(255,255,255,0.18);
//           background: rgba(0,0,0,0.18);
//           white-space: nowrap;
//         }
//         .badgeSwish { border-color: rgba(120,255,170,0.35); background: rgba(120,255,170,0.10); }
//         .badgeMake { border-color: rgba(242,194,48,0.35); background: rgba(242,194,48,0.12); }
//         .badgeMiss { border-color: rgba(255,120,120,0.35); background: rgba(255,120,120,0.10); }

//         .court {
//           display: grid;
//           grid-template-columns: 280px 1fr;
//           gap: 12px;
//           align-items: start;
//         }
//         .courtLeft {
//           border-radius: 16px;
//           border: 1px solid rgba(255,255,255,0.10);
//           background: rgba(0,0,0,0.16);
//           padding: 12px;
//         }
//         .controlsTitle { font-weight: 950; margin-bottom: 8px; }
//         .controlsLine { opacity: 0.82; font-size: 12px; margin-top: 4px; }
//         .miniInfo {
//           margin-top: 12px;
//           border-radius: 12px;
//           border: 1px solid rgba(255,255,255,0.10);
//           background: rgba(255,255,255,0.03);
//           padding: 10px;
//           display: grid;
//           gap: 6px;
//           font-size: 12px;
//           opacity: 0.9;
//         }

//         .courtRight {
//           border-radius: 16px;
//           border: 1px solid rgba(255,255,255,0.10);
//           background: rgba(0,0,0,0.12);
//           padding: 10px;
//           overflow: hidden;
//         }
//         .cv {
//           width: ${CSS_W}px;
//           height: ${CSS_H}px;
//           max-width: 100%;
//           display: block;
//           border-radius: 14px;
//         }

//         .submitRow {
//           margin-top: 14px;
//           display: grid;
//           gap: 8px;
//           justify-items: start;
//         }
//         .submitBtn {
//           border-radius: 12px;
//           padding: 12px 14px;
//           border: 1px solid rgba(242, 194, 48, 0.60);
//           background: rgba(242, 194, 48, 0.14);
//           color: #fff;
//           font-weight: 950;
//           cursor: pointer;
//         }
//         .muted { opacity: 0.75; }
//         .lbMsg { opacity: 0.9; }

//         @media (max-width: 980px) {
//           .menuGrid { grid-template-columns: 1fr; }
//           .previewRow { grid-template-columns: 1fr; }
//           .court { grid-template-columns: 1fr; }
//         }
//       `}</style>
//     </main>
//   );
// }

// /* ---------- Character SVG (hair fixed: shifted up slightly) ---------- */

// function PlayerAvatar({
//   char,
//   armPose = "idle",
// }: {
//   char: CharacterConfig;
//   armPose?: "idle" | "ready" | "shoot";
// }) {
//   const armRot = armPose === "idle" ? -10 : armPose === "ready" ? -26 : -58;

//   return (
//     <svg width="240" height="260" viewBox="0 0 240 260" aria-hidden="true">
//       <ellipse cx="120" cy="248" rx="82" ry="10" fill="rgba(0,0,0,0.35)" />

//       {/* legs */}
//       <rect x="94" y="150" width="22" height="70" rx="10" fill="rgba(255,255,255,0.10)" />
//       <rect x="126" y="150" width="22" height="70" rx="10" fill="rgba(255,255,255,0.10)" />

//       {/* shoes */}
//       <rect x="84" y="218" width="44" height="12" rx="7" fill={char.shoes} opacity="0.75" />
//       <rect x="122" y="218" width="44" height="12" rx="7" fill={char.shoes} opacity="0.75" />

//       {/* jersey */}
//       <rect x="78" y="92" width="84" height="70" rx="20" fill={char.jersey} opacity="0.92" />

//       {/* pattern */}
//       {char.jerseyPattern === "stripe" ? (
//         <>
//           <rect x="78" y="118" width="84" height="10" fill="rgba(255,255,255,0.16)" />
//           <rect x="78" y="132" width="84" height="6" fill="rgba(0,0,0,0.16)" />
//         </>
//       ) : char.jerseyPattern === "diagonal" ? (
//         <path d="M78 150 L162 104 L162 120 L78 166 Z" fill="rgba(255,255,255,0.16)" />
//       ) : null}

//       {/* number */}
//       <text
//         x="120"
//         y="134"
//         textAnchor="middle"
//         fontSize="22"
//         fontWeight="900"
//         fill="rgba(255,255,255,0.92)"
//       >
//         {char.number || "00"}
//       </text>

//       {/* head */}
//       <circle cx="120" cy="60" r="26" fill={char.skin} />

//       {/* hair group shifted up a little */}
//       <g transform="translate(0,-3)">
//         {char.hairStyle === "short" ? (
//           <path
//             d="M94 60c2-20 18-28 40-24 12 2 22 12 24 24-8-8-16-10-24-10-12 0-22 6-40 10z"
//             fill={char.hairColor}
//           />
//         ) : char.hairStyle === "fade" ? (
//           <path
//             d="M96 62c4-18 18-26 38-24 16 2 24 12 26 24-10-6-16-8-26-8-14 0-24 4-38 8z"
//             fill={char.hairColor}
//             opacity="0.92"
//           />
//         ) : (
//           <>
//             <path
//               d="M92 62c2-22 18-32 44-28 18 3 28 14 30 28-10-10-18-12-30-12-14 0-26 6-44 12z"
//               fill={char.hairColor}
//             />
//             <circle cx="100" cy="44" r="4" fill={char.hairColor} opacity="0.9" />
//             <circle cx="112" cy="40" r="4" fill={char.hairColor} opacity="0.9" />
//             <circle cx="126" cy="40" r="4" fill={char.hairColor} opacity="0.9" />
//             <circle cx="140" cy="44" r="4" fill={char.hairColor} opacity="0.9" />
//           </>
//         )}

//         {char.headband ? (
//           <rect x="95" y="52" width="50" height="10" rx="6" fill="rgba(255,255,255,0.22)" />
//         ) : null}
//       </g>

//       {/* arms (left static) */}
//       <rect x="58" y="104" width="20" height="56" rx="10" fill={char.skin} opacity="0.92" />

//       {/* right arm animated */}
//       <g transform={`translate(162 112) rotate(${armRot}) translate(-162 -112)`}>
//         <rect x="162" y="104" width="20" height="56" rx="10" fill={char.skin} opacity="0.92" />
//         {char.sleeve ? (
//           <rect x="162" y="104" width="20" height="18" rx="9" fill="rgba(255,255,255,0.14)" />
//         ) : null}
//       </g>

//       {char.sleeve ? (
//         <rect x="58" y="104" width="20" height="18" rx="9" fill="rgba(255,255,255,0.14)" />
//       ) : null}
//     </svg>
//   );
// }

///********** Arcade Coming Soon Page **********/
/* this is temporary while we upgrade the arcade for the next release. */

import Link from "next/link";

export default function ArcadeComingSoon() {
  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto", fontFamily: "system-ui" }}>
      <h1 style={{ marginTop: 0 }}>🎮 Arcade</h1>
      <p style={{ opacity: 0.85, lineHeight: "22px" }}>
        Coming soon. We’re upgrading the arcade before the next release.
      </p>

      <div style={{ marginTop: 14 }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}