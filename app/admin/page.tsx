// // i have to add hella imports here so reminder to come back

// "use client";

// import { useEffect, useState } from "react";
// import { onAuthStateChanged, User } from "firebase/auth";
// import { auth } from "../../lib/firebase";
// import { isAdmin } from "../../lib/admin";
// import { createTournament, TOURNAMENT_ID } from "../../lib/tournament";
// import { createEmptyBracketGames } from "../../lib/games";

// export default function AdminPage() {
//   const [user, setUser] = useState<User | null>(null);
//   const [allowed, setAllowed] = useState<boolean | null>(null);
//   const [busy, setBusy] = useState(false);
//   const [msg, setMsg] = useState<string>("");

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, async (u) => {
//       setUser(u);
//       if (!u) {
//         setAllowed(false);
//         return;
//       }
//       setAllowed(await isAdmin(u.uid));
//     });
//     return () => unsub();
//   }, []);

//   async function handleCreateTournament() {
//     if (!user) return;
//     setBusy(true);
//     setMsg("");
//     try {
//       await createTournament(user.uid);
//       setMsg(`Tournament created/updated: tournaments/${TOURNAMENT_ID}`);
//     } catch (e) {
//       console.error(e);
//       setMsg("Error creating tournament. Check console + Firestore rules.");
//     } finally {
//       setBusy(false);
//     }
//   }

//   async function handleGenerateBracketGames() {
//     setBusy(true);
//     setMsg("");
//     try {
//       await createEmptyBracketGames();
//       setMsg("Bracket games created/updated: tournaments/azhs-2026/games (31 docs)");
//     } catch (e) {
//       console.error(e);
//       setMsg("Error generating bracket games. Check console + Firestore rules.");
//     } finally {
//       setBusy(false);
//     }
//   }

//   if (!user) {
//     return (
//       <main style={{ padding: 24, fontFamily: "system-ui" }}>
//         <h1>Admin</h1>
//         <p>Please sign in first.</p>
//       </main>
//     );
//   }

//   if (allowed === null) {
//     return (
//       <main style={{ padding: 24, fontFamily: "system-ui" }}>
//         <h1>Admin</h1>
//         <p>Checking permissions…</p>
//       </main>
//     );
//   }

//   if (!allowed) {
//     return (
//       <main style={{ padding: 24, fontFamily: "system-ui" }}>
//         <h1>Admin</h1>
//         <p>Access denied (not an admin).</p>
//       </main>
//     );
//   }

//   return (
//     <main style={{ padding: 24, fontFamily: "system-ui" }}>
//       <h1>Admin ✅</h1>
//       <p>Welcome, {user.displayName}.</p>

//       <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
//         <button
//           onClick={handleCreateTournament}
//           disabled={busy}
//           style={{ padding: "10px 14px", width: "fit-content" }}
//         >
//           {busy ? "Working..." : "Create Tournament"}
//         </button>

//         <button
//           onClick={handleGenerateBracketGames}
//           disabled={busy}
//           style={{ padding: "10px 14px", width: "fit-content" }}
//         >
//           {busy ? "Working..." : "Generate Bracket Games (31 docs)"}
//         </button>

//         <a href="/admin/teams" style={{ width: "fit-content" }}>
//           Go to Teams →
//         </a>

//         {msg && <div style={{ marginTop: 8, opacity: 0.85 }}>{msg}</div>}
//       </div>
//     </main>
//   );
// }


// // AZ High School Bracket - Created by Charles Richards 2026
// // ASU Computer Science (Cybersecurity) BS 2028




// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { onAuthStateChanged, User } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";

// import { auth, db } from "../../lib/firebase";
// import { isAdmin } from "../../lib/admin";
// import { createTournament, TOURNAMENT_ID } from "../../lib/tournament";
// import { createEmptyBracketGames } from "../../lib/games";

// type AdminCheckResult = {
//   allowed: boolean;
//   source: string; // where the allow came from (debug)
//   note?: string;  // any extra info/errors
// };

// async function safeGetDoc(pathParts: string[]) {
//   try {
//     const ref = doc(db, ...pathParts);
//     const snap = await getDoc(ref);
//     return snap;
//   } catch (e) {
//     // permission denied or missing rules shouldn't crash the page
//     return null;
//   }
// }

// function dataSaysAdmin(data: any): boolean {
//   if (!data) return false;

//   // common patterns people use:
//   if (data.isAdmin === true) return true;
//   if (data.admin === true) return true;
//   if (data.allowed === true) return true;
//   if (data.role === "admin") return true;

//   // roles array patterns:
//   if (Array.isArray(data.roles) && data.roles.includes("admin")) return true;
//   if (Array.isArray(data.claims) && data.claims.includes("admin")) return true;

//   return false;
// }

// async function checkAdmin(u: User): Promise<AdminCheckResult> {
//   // 1) Try your existing helper first
//   try {
//     const ok = await isAdmin(u.uid);
//     if (ok) {
//       return { allowed: true, source: "lib/isAdmin(uid)" };
//     }
//   } catch (e: any) {
//     // keep going with fallbacks
//   }

//   // 2) Fall back to common Firestore locations (UID-based)
//   const uidPaths: Array<{ path: string[]; label: string }> = [
//     { path: ["users", u.uid], label: "users/{uid}" },
//     { path: ["admins", u.uid], label: "admins/{uid}" },
//     { path: ["tournaments", TOURNAMENT_ID, "admins", u.uid], label: "tournaments/{id}/admins/{uid}" },
//   ];

//   for (const p of uidPaths) {
//     const snap = await safeGetDoc(p.path);
//     if (snap?.exists() && dataSaysAdmin(snap.data())) {
//       return { allowed: true, source: p.label };
//     }

//     // Some people just create the doc and treat existence as "admin"
//     if (snap?.exists() && snap.data() && Object.keys(snap.data()).length === 0) {
//       return { allowed: true, source: `${p.label} (exists)` };
//     }
//   }

//   // 3) Optional Email-based doc ids (some setups do this)
//   if (u.email) {
//     const email = u.email.toLowerCase();
//     const emailPaths: Array<{ path: string[]; label: string }> = [
//       { path: ["admins", email], label: "admins/{email}" },
//       { path: ["tournaments", TOURNAMENT_ID, "admins", email], label: "tournaments/{id}/admins/{email}" },
//     ];

//     for (const p of emailPaths) {
//       const snap = await safeGetDoc(p.path);
//       if (snap?.exists() && dataSaysAdmin(snap.data())) {
//         return { allowed: true, source: p.label };
//       }

//       if (snap?.exists() && snap.data() && Object.keys(snap.data()).length === 0) {
//         return { allowed: true, source: `${p.label} (exists)` };
//       }
//     }
//   }

//   return {
//     allowed: false,
//     source: "no admin match",
//     note:
//       "If Beckett is admin in Firestore, confirm the doc path matches (users/admins/tournament admins) and that he signs out/in after rules or claim changes.",
//   };
// }

// export default function AdminPage() {
//   const router = useRouter();

//   const [user, setUser] = useState<User | null>(null);
//   const [allowed, setAllowed] = useState<boolean | null>(null);
//   const [allowSource, setAllowSource] = useState<string>("");
//   const [busy, setBusy] = useState(false);
//   const [msg, setMsg] = useState<string>("");
//   const [permNote, setPermNote] = useState<string>("");

//   async function refreshPermissions(u: User) {
//     setAllowed(null);
//     setAllowSource("");
//     setPermNote("");

//     const res = await checkAdmin(u);
//     setAllowed(res.allowed);
//     setAllowSource(res.source);
//     setPermNote(res.note ?? "");
//   }

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, async (u) => {
//       setUser(u);
//       setMsg("");
//       setPermNote("");
//       setAllowSource("");

//       if (!u) {
//         setAllowed(false);
//         return;
//       }

//       await refreshPermissions(u);
//     });

//     return () => unsub();
//   }, []);

//   async function handleCreateTournament() {
//     if (!user) return;
//     setBusy(true);
//     setMsg("");
//     try {
//       await createTournament(user.uid);
//       setMsg(`Tournament created/updated: tournaments/${TOURNAMENT_ID}`);
//     } catch (e) {
//       console.error(e);
//       setMsg("Error creating tournament. Check console + Firestore rules.");
//     } finally {
//       setBusy(false);
//     }
//   }

//   async function handleGenerateBracketGames() {
//     setBusy(true);
//     setMsg("");
//     try {
//       await createEmptyBracketGames();
//       setMsg("Bracket games created/updated: tournaments/azhs-2026/games (31 docs)");
//     } catch (e) {
//       console.error(e);
//       setMsg("Error generating bracket games. Check console + Firestore rules.");
//     } finally {
//       setBusy(false);
//     }
//   }

//   const buttonStyle: React.CSSProperties = {
//     padding: "10px 14px",
//     width: "fit-content",
//     borderRadius: 12,
//     border: "1px solid rgba(0,0,0,0.2)",
//     background: "rgba(0,0,0,0.06)",
//     cursor: "pointer",
//     fontWeight: 700,
//   };

//   const navButtonStyle: React.CSSProperties = {
//     ...buttonStyle,
//     border: "1px solid rgba(43,92,255,0.35)",
//     background: "rgba(43,92,255,0.08)",
//   };

//   if (!user) {
//     return (
//       <main style={{ padding: 24, fontFamily: "system-ui" }}>
//         <h1>Admin</h1>
//         <p>Please sign in first.</p>
//         <button onClick={() => router.push("/")} style={buttonStyle}>
//           ← Home
//         </button>
//       </main>
//     );
//   }

//   if (allowed === null) {
//     return (
//       <main style={{ padding: 24, fontFamily: "system-ui" }}>
//         <h1>Admin</h1>
//         <p>Checking permissions…</p>
//       </main>
//     );
//   }

//   if (!allowed) {
//     return (
//       <main style={{ padding: 24, fontFamily: "system-ui" }}>
//         <h1>Admin</h1>
//         <p><b>Access denied</b> (not an admin).</p>

//         <div style={{ marginTop: 10, opacity: 0.85 }}>
//           Signed in as: <b>{user.displayName || user.email || user.uid}</b>
//           <div style={{ marginTop: 6, fontSize: 13 }}>
//             UID: <code>{user.uid}</code>
//             {user.email ? (
//               <>
//                 <br />
//                 Email: <code>{user.email}</code>
//               </>
//             ) : null}
//           </div>

//           <div style={{ marginTop: 8, fontSize: 13 }}>
//             Check source: <code>{allowSource || "n/a"}</code>
//           </div>

//           {permNote ? (
//             <div style={{ marginTop: 10, fontSize: 13, opacity: 0.9 }}>
//               {permNote}
//             </div>
//           ) : null}
//         </div>

//         <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
//           <button onClick={() => router.push("/")} style={buttonStyle}>
//             ← Home
//           </button>

//           <button onClick={() => refreshPermissions(user)} style={buttonStyle}>
//             Refresh permissions
//           </button>
//         </div>
//       </main>
//     );
//   }

//   return (
//     <main style={{ padding: 24, fontFamily: "system-ui" }}>
//       <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
//         <div>
//           <h1 style={{ margin: 0 }}>Admin ✅</h1>
//           <p style={{ marginTop: 8 }}>
//             Welcome, <b>{user.displayName || user.email || user.uid}</b>.
//           </p>
//           <div style={{ fontSize: 13, opacity: 0.8 }}>
//             Admin check source: <code>{allowSource}</code>
//           </div>
//         </div>

//         <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
//           <button onClick={() => router.push("/")} style={buttonStyle}>
//             ← Home
//           </button>
//           <button onClick={() => refreshPermissions(user)} style={buttonStyle}>
//             Refresh permissions
//           </button>
//         </div>
//       </div>

//       {/* ✅ Quick nav buttons */}
//       <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
//         <button onClick={() => router.push("/admin/bracket")} style={navButtonStyle}>
//           Admin Bracket →
//         </button>
//         <button onClick={() => router.push("/admin/teams")} style={navButtonStyle}>
//           Admin Teams →
//         </button>

//         {/* fallback links (in case you prefer Link) */}
//         <Link href="/admin/bracket" style={{ alignSelf: "center", opacity: 0.85 }}>
//           /admin/bracket
//         </Link>
//         <Link href="/admin/teams" style={{ alignSelf: "center", opacity: 0.85 }}>
//           /admin/teams
//         </Link>
//       </div>

//       <div style={{ marginTop: 18, display: "grid", gap: 10 }}>
//         <button
//           onClick={handleCreateTournament}
//           disabled={busy}
//           style={{ ...buttonStyle, opacity: busy ? 0.6 : 1 }}
//         >
//           {busy ? "Working..." : "Create Tournament"}
//         </button>

//         <button
//           onClick={handleGenerateBracketGames}
//           disabled={busy}
//           style={{ ...buttonStyle, opacity: busy ? 0.6 : 1 }}
//         >
//           {busy ? "Working..." : "Generate Bracket Games (31 docs)"}
//         </button>

//         {msg && <div style={{ marginTop: 8, opacity: 0.85 }}>{msg}</div>}
//       </div>
//     </main>
//   );
// }

// // AZ High School Bracket - Created by Charles Richards 2026
// // ASU Computer Science (Cybersecurity) BS 2028




// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { onAuthStateChanged, User } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";

// import { auth, db } from "../../lib/firebase";
// import { isAdmin } from "../../lib/admin";
// import { createTournament, TOURNAMENT_ID } from "../../lib/tournament";
// import { createEmptyBracketGames } from "../../lib/games";

// type DocPath = readonly [string, ...string[]];

// type AdminCheckResult = {
//   allowed: boolean;
//   source: string; // where the allow came from (debug)
//   note?: string; // any extra info/errors
// };

// async function safeGetDoc(pathParts: DocPath) {
//   try {
//     const ref = doc(db, ...pathParts);
//     const snap = await getDoc(ref);
//     return snap;
//   } catch {
//     // permission denied or missing rules shouldn't crash the page
//     return null;
//   }
// }

// function dataSaysAdmin(data: any): boolean {
//   if (!data) return false;

//   if (data.isAdmin === true) return true;
//   if (data.admin === true) return true;
//   if (data.allowed === true) return true;
//   if (data.role === "admin") return true;

//   if (Array.isArray(data.roles) && data.roles.includes("admin")) return true;
//   if (Array.isArray(data.claims) && data.claims.includes("admin")) return true;

//   return false;
// }

// async function checkAdmin(u: User): Promise<AdminCheckResult> {
//   // 1) Try your existing helper first
//   try {
//     const ok = await isAdmin(u.uid);
//     if (ok) return { allowed: true, source: "lib/isAdmin(uid)" };
//   } catch (e: any) {
//     // keep going with fallbacks
//   }

//   // 2) Fallback to common admin doc locations (UID)
//   const uidPaths: Array<{ path: DocPath; label: string }> = [
//     { path: ["users", u.uid], label: "users/{uid}" },
//     { path: ["admins", u.uid], label: "admins/{uid}" },
//     {
//       path: ["tournaments", TOURNAMENT_ID, "admins", u.uid],
//       label: "tournaments/{id}/admins/{uid}",
//     },
//   ];

//   for (const p of uidPaths) {
//     const snap = await safeGetDoc(p.path);
//     if (snap?.exists() && dataSaysAdmin(snap.data())) {
//       return { allowed: true, source: p.label };
//     }

//     // Some setups treat "doc exists" as admin
//     if (snap?.exists() && snap.data() && Object.keys(snap.data()).length === 0) {
//       return { allowed: true, source: `${p.label} (exists)` };
//     }
//   }

//   // 3) Optional Email-based doc ids (some setups do this)
//   if (u.email) {
//     const email = u.email.toLowerCase();

//     const emailPaths: Array<{ path: DocPath; label: string }> = [
//       { path: ["admins", email], label: "admins/{email}" },
//       {
//         path: ["tournaments", TOURNAMENT_ID, "admins", email],
//         label: "tournaments/{id}/admins/{email}",
//       },
//     ];

//     for (const p of emailPaths) {
//       const snap = await safeGetDoc(p.path);
//       if (snap?.exists() && dataSaysAdmin(snap.data())) {
//         return { allowed: true, source: p.label };
//       }

//       if (snap?.exists() && snap.data() && Object.keys(snap.data()).length === 0) {
//         return { allowed: true, source: `${p.label} (exists)` };
//       }
//     }
//   }

//   return {
//     allowed: false,
//     source: "no admin match",
//     note:
//       "If Beckett is admin in Firestore, confirm the doc path matches what your rules expect, and that he signs out/in after changes.",
//   };
// }

// export default function AdminPage() {
//   const router = useRouter();

//   const [user, setUser] = useState<User | null>(null);
//   const [allowed, setAllowed] = useState<boolean | null>(null);
//   const [allowSource, setAllowSource] = useState<string>("");
//   const [permNote, setPermNote] = useState<string>("");

//   const [busy, setBusy] = useState(false);
//   const [msg, setMsg] = useState<string>("");

//   async function refreshPermissions(u: User) {
//     setAllowed(null);
//     setAllowSource("");
//     setPermNote("");

//     const res = await checkAdmin(u);
//     setAllowed(res.allowed);
//     setAllowSource(res.source);
//     setPermNote(res.note ?? "");
//   }

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, async (u) => {
//       setUser(u);
//       setMsg("");
//       setAllowSource("");
//       setPermNote("");

//       if (!u) {
//         setAllowed(false);
//         return;
//       }

//       await refreshPermissions(u);
//     });

//     return () => unsub();
//   }, []);

//   async function handleCreateTournament() {
//     if (!user) return;
//     setBusy(true);
//     setMsg("");
//     try {
//       await createTournament(user.uid);
//       setMsg(`Tournament created/updated: tournaments/${TOURNAMENT_ID}`);
//     } catch (e) {
//       console.error(e);
//       setMsg("Error creating tournament. Check console + Firestore rules.");
//     } finally {
//       setBusy(false);
//     }
//   }

//   async function handleGenerateBracketGames() {
//     setBusy(true);
//     setMsg("");
//     try {
//       await createEmptyBracketGames();
//       setMsg("Bracket games created/updated: tournaments/azhs-2026/games (31 docs)");
//     } catch (e) {
//       console.error(e);
//       setMsg("Error generating bracket games. Check console + Firestore rules.");
//     } finally {
//       setBusy(false);
//     }
//   }

//   const buttonStyle: React.CSSProperties = {
//     padding: "10px 14px",
//     width: "fit-content",
//     borderRadius: 12,
//     border: "1px solid rgba(0,0,0,0.2)",
//     background: "rgba(0,0,0,0.06)",
//     cursor: "pointer",
//     fontWeight: 700,
//   };

//   const navButtonStyle: React.CSSProperties = {
//     ...buttonStyle,
//     border: "1px solid rgba(43,92,255,0.35)",
//     background: "rgba(43,92,255,0.08)",
//   };

//   if (!user) {
//     return (
//       <main style={{ padding: 24, fontFamily: "system-ui" }}>
//         <h1>Admin</h1>
//         <p>Please sign in first.</p>
//         <button onClick={() => router.push("/")} style={buttonStyle}>
//           ← Home
//         </button>
//       </main>
//     );
//   }

//   if (allowed === null) {
//     return (
//       <main style={{ padding: 24, fontFamily: "system-ui" }}>
//         <h1>Admin</h1>
//         <p>Checking permissions…</p>
//       </main>
//     );
//   }

//   if (!allowed) {
//     return (
//       <main style={{ padding: 24, fontFamily: "system-ui" }}>
//         <h1>Admin</h1>
//         <p>
//           <b>Access denied</b> (not an admin).
//         </p>

//         <div style={{ marginTop: 10, opacity: 0.85 }}>
//           Signed in as: <b>{user.displayName || user.email || user.uid}</b>
//           <div style={{ marginTop: 6, fontSize: 13 }}>
//             UID: <code>{user.uid}</code>
//             {user.email ? (
//               <>
//                 <br />
//                 Email: <code>{user.email}</code>
//               </>
//             ) : null}
//           </div>

//           <div style={{ marginTop: 8, fontSize: 13 }}>
//             Check source: <code>{allowSource || "n/a"}</code>
//           </div>

//           {permNote ? (
//             <div style={{ marginTop: 10, fontSize: 13, opacity: 0.9 }}>
//               {permNote}
//             </div>
//           ) : null}
//         </div>

//         <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
//           <button onClick={() => router.push("/")} style={buttonStyle}>
//             ← Home
//           </button>

//           <button onClick={() => refreshPermissions(user)} style={buttonStyle}>
//             Refresh permissions
//           </button>
//         </div>
//       </main>
//     );
//   }

//   return (
//     <main style={{ padding: 24, fontFamily: "system-ui" }}>
//       <div
//         style={{
//           display: "flex",
//           alignItems: "baseline",
//           justifyContent: "space-between",
//           gap: 12,
//           flexWrap: "wrap",
//         }}
//       >
//         <div>
//           <h1 style={{ margin: 0 }}>Admin ✅</h1>
//           <p style={{ marginTop: 8 }}>
//             Welcome, <b>{user.displayName || user.email || user.uid}</b>.
//           </p>
//           <div style={{ fontSize: 13, opacity: 0.8 }}>
//             Admin check source: <code>{allowSource}</code>
//           </div>
//         </div>

//         <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
//           <button onClick={() => router.push("/")} style={buttonStyle}>
//             ← Home
//           </button>
//           <button onClick={() => refreshPermissions(user)} style={buttonStyle}>
//             Refresh permissions
//           </button>
//         </div>
//       </div>

//       {/* ✅ Buttons to Admin Bracket + Admin Teams */}
//       <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
//         <button onClick={() => router.push("/admin/bracket")} style={navButtonStyle}>
//           Admin Bracket →
//         </button>
//         <button onClick={() => router.push("/admin/teams")} style={navButtonStyle}>
//           Admin Teams →
//         </button>

//         <Link href="/admin/bracket" style={{ alignSelf: "center", opacity: 0.85 }}>
//           /admin/bracket
//         </Link>
//         <Link href="/admin/teams" style={{ alignSelf: "center", opacity: 0.85 }}>
//           /admin/teams
//         </Link>
//       </div>

//       <div style={{ marginTop: 18, display: "grid", gap: 10 }}>
//         <button
//           onClick={handleCreateTournament}
//           disabled={busy}
//           style={{ ...buttonStyle, opacity: busy ? 0.6 : 1 }}
//         >
//           {busy ? "Working..." : "Create Tournament"}
//         </button>

//         <button
//           onClick={handleGenerateBracketGames}
//           disabled={busy}
//           style={{ ...buttonStyle, opacity: busy ? 0.6 : 1 }}
//         >
//           {busy ? "Working..." : "Generate Bracket Games (31 docs)"}
//         </button>

//         {msg && <div style={{ marginTop: 8, opacity: 0.85 }}>{msg}</div>}
//       </div>
//     </main>
//   );
// }

// // AZ High School Bracket - Created by Charles Richards 2026
// // ASU Computer Science (Cybersecurity) BS 2028



// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { onAuthStateChanged, User } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";

// import { auth, db } from "../../lib/firebase";
// import { isAdmin } from "../../lib/admin";
// import { createTournament, TOURNAMENT_ID } from "../../lib/tournament";
// import { createEmptyBracketGames } from "../../lib/games";

// type DocPath = readonly [string, ...string[]];

// type AdminCheckResult = {
//   allowed: boolean;
//   source: string; // where the allow came from (debug)
//   note?: string; // any extra info/errors
// };

// async function safeGetDoc(pathParts: DocPath) {
//   try {
//     const ref = doc(db, ...pathParts);
//     const snap = await getDoc(ref);
//     return snap;
//   } catch {
//     // permission denied or missing rules shouldn't crash the page
//     return null;
//   }
// }

// function dataSaysAdmin(data: any): boolean {
//   if (!data) return false;

//   if (data.isAdmin === true) return true;
//   if (data.admin === true) return true;
//   if (data.allowed === true) return true;
//   if (data.role === "admin") return true;

//   if (Array.isArray(data.roles) && data.roles.includes("admin")) return true;
//   if (Array.isArray(data.claims) && data.claims.includes("admin")) return true;

//   return false;
// }

// async function checkAdmin(u: User): Promise<AdminCheckResult> {
//   // 1) Try your existing helper first
//   try {
//     const ok = await isAdmin(u.uid);
//     if (ok) return { allowed: true, source: "lib/isAdmin(uid)" };
//   } catch (e: any) {
//     // keep going with fallbacks
//   }

//   // 2) Fallback to common admin doc locations (UID)
//   const uidPaths: Array<{ path: DocPath; label: string }> = [
//     { path: ["users", u.uid], label: "users/{uid}" },
//     { path: ["admins", u.uid], label: "admins/{uid}" },
//     {
//       path: ["tournaments", TOURNAMENT_ID, "admins", u.uid],
//       label: "tournaments/{id}/admins/{uid}",
//     },
//   ];

//   for (const p of uidPaths) {
//     const snap = await safeGetDoc(p.path);
//     if (snap?.exists() && dataSaysAdmin(snap.data())) {
//       return { allowed: true, source: p.label };
//     }

//     // Some setups treat "doc exists" as admin
//     if (snap?.exists() && snap.data() && Object.keys(snap.data()).length === 0) {
//       return { allowed: true, source: `${p.label} (exists)` };
//     }
//   }

//   // 3) Optional Email-based doc ids (some setups do this)
//   if (u.email) {
//     const email = u.email.toLowerCase();

//     const emailPaths: Array<{ path: DocPath; label: string }> = [
//       { path: ["admins", email], label: "admins/{email}" },
//       {
//         path: ["tournaments", TOURNAMENT_ID, "admins", email],
//         label: "tournaments/{id}/admins/{email}",
//       },
//     ];

//     for (const p of emailPaths) {
//       const snap = await safeGetDoc(p.path);
//       if (snap?.exists() && dataSaysAdmin(snap.data())) {
//         return { allowed: true, source: p.label };
//       }

//       if (snap?.exists() && snap.data() && Object.keys(snap.data()).length === 0) {
//         return { allowed: true, source: `${p.label} (exists)` };
//       }
//     }
//   }

//   return {
//     allowed: false,
//     source: "no admin match",
//     note:
//       "If Beckett is admin in Firestore, confirm the doc path matches what your rules expect, and that he signs out/in after changes.",
//   };
// }

// export default function AdminPage() {
//   const router = useRouter();

//   const [user, setUser] = useState<User | null>(null);
//   const [allowed, setAllowed] = useState<boolean | null>(null);
//   const [allowSource, setAllowSource] = useState<string>("");
//   const [permNote, setPermNote] = useState<string>("");

//   const [busy, setBusy] = useState(false);
//   const [msg, setMsg] = useState<string>("");

//   async function refreshPermissions(u: User) {
//     setAllowed(null);
//     setAllowSource("");
//     setPermNote("");

//     const res = await checkAdmin(u);
//     setAllowed(res.allowed);
//     setAllowSource(res.source);
//     setPermNote(res.note ?? "");
//   }

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, async (u) => {
//       setUser(u);
//       setMsg("");
//       setAllowSource("");
//       setPermNote("");

//       if (!u) {
//         setAllowed(false);
//         return;
//       }

//       await refreshPermissions(u);
//     });

//     return () => unsub();
//   }, []);

//   async function handleCreateTournament() {
//     if (!user) return;
//     setBusy(true);
//     setMsg("");
//     try {
//       await createTournament(user.uid);
//       setMsg(`Tournament created/updated: tournaments/${TOURNAMENT_ID}`);
//     } catch (e) {
//       console.error(e);
//       setMsg("Error creating tournament. Check console + Firestore rules.");
//     } finally {
//       setBusy(false);
//     }
//   }

//   async function handleGenerateBracketGames() {
//     setBusy(true);
//     setMsg("");
//     try {
//       await createEmptyBracketGames();
//       setMsg("Bracket games created/updated: tournaments/azhs-2026/games (31 docs)");
//     } catch (e) {
//       console.error(e);
//       setMsg("Error generating bracket games. Check console + Firestore rules.");
//     } finally {
//       setBusy(false);
//     }
//   }

//   const buttonStyle: React.CSSProperties = {
//     padding: "10px 14px",
//     width: "fit-content",
//     borderRadius: 12,
//     border: "1px solid rgba(0,0,0,0.2)",
//     background: "rgba(0,0,0,0.06)",
//     cursor: "pointer",
//     fontWeight: 700,
//   };

//   const navButtonStyle: React.CSSProperties = {
//     ...buttonStyle,
//     border: "1px solid rgba(43,92,255,0.35)",
//     background: "rgba(43,92,255,0.08)",
//   };

//   if (!user) {
//     return (
//       <main style={{ padding: 24, fontFamily: "system-ui" }}>
//         <h1>Admin</h1>
//         <p>Please sign in first.</p>
//         <button onClick={() => router.push("/")} style={buttonStyle}>
//           ← Home
//         </button>
//       </main>
//     );
//   }

//   if (allowed === null) {
//     return (
//       <main style={{ padding: 24, fontFamily: "system-ui" }}>
//         <h1>Admin</h1>
//         <p>Checking permissions…</p>
//       </main>
//     );
//   }

//   if (!allowed) {
//     return (
//       <main style={{ padding: 24, fontFamily: "system-ui" }}>
//         <h1>Admin</h1>
//         <p>
//           <b>Access denied</b> (not an admin).
//         </p>

//         <div style={{ marginTop: 10, opacity: 0.85 }}>
//           Signed in as: <b>{user.displayName || user.email || user.uid}</b>
//           <div style={{ marginTop: 6, fontSize: 13 }}>
//             UID: <code>{user.uid}</code>
//             {user.email ? (
//               <>
//                 <br />
//                 Email: <code>{user.email}</code>
//               </>
//             ) : null}
//           </div>

//           <div style={{ marginTop: 8, fontSize: 13 }}>
//             Check source: <code>{allowSource || "n/a"}</code>
//           </div>

//           {permNote ? (
//             <div style={{ marginTop: 10, fontSize: 13, opacity: 0.9 }}>
//               {permNote}
//             </div>
//           ) : null}
//         </div>

//         <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
//           <button onClick={() => router.push("/")} style={buttonStyle}>
//             ← Home
//           </button>

//           <button onClick={() => refreshPermissions(user)} style={buttonStyle}>
//             Refresh permissions
//           </button>
//         </div>
//       </main>
//     );
//   }

//   return (
//     <main style={{ padding: 24, fontFamily: "system-ui" }}>
//       <div
//         style={{
//           display: "flex",
//           alignItems: "baseline",
//           justifyContent: "space-between",
//           gap: 12,
//           flexWrap: "wrap",
//         }}
//       >
//         <div>
//           <h1 style={{ margin: 0 }}>Admin ✅</h1>
//           <p style={{ marginTop: 8 }}>
//             Welcome, <b>{user.displayName || user.email || user.uid}</b>.
//           </p>
//           <div style={{ fontSize: 13, opacity: 0.8 }}>
//             Admin check source: <code>{allowSource}</code>
//           </div>
//         </div>

//         <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
//           <button onClick={() => router.push("/")} style={buttonStyle}>
//             ← Home
//           </button>
//           <button onClick={() => refreshPermissions(user)} style={buttonStyle}>
//             Refresh permissions
//           </button>
//         </div>
//       </div>

//       {/* ✅ Buttons to Admin tools */}
//       <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
//         <button onClick={() => router.push("/admin/bracket")} style={navButtonStyle}>
//           Admin Bracket →
//         </button>
//         <button onClick={() => router.push("/admin/teams")} style={navButtonStyle}>
//           Admin Teams →
//         </button>

//         {/* ✅ NEW: Fix incomplete entries */}
//         <button onClick={() => router.push("/admin/entries-fix")} style={navButtonStyle}>
//           Fix Entries (31/31) →
//         </button>

//         <Link href="/admin/bracket" style={{ alignSelf: "center", opacity: 0.85 }}>
//           /admin/bracket
//         </Link>
//         <Link href="/admin/teams" style={{ alignSelf: "center", opacity: 0.85 }}>
//           /admin/teams
//         </Link>
//         <Link href="/admin/entries-fix" style={{ alignSelf: "center", opacity: 0.85 }}>
//           /admin/entries-fix
//         </Link>
//       </div>

//       <div style={{ marginTop: 18, display: "grid", gap: 10 }}>
//         <button
//           onClick={handleCreateTournament}
//           disabled={busy}
//           style={{ ...buttonStyle, opacity: busy ? 0.6 : 1 }}
//         >
//           {busy ? "Working..." : "Create Tournament"}
//         </button>

//         <button
//           onClick={handleGenerateBracketGames}
//           disabled={busy}
//           style={{ ...buttonStyle, opacity: busy ? 0.6 : 1 }}
//         >
//           {busy ? "Working..." : "Generate Bracket Games (31 docs)"}
//         </button>

//         {msg && <div style={{ marginTop: 8, opacity: 0.85 }}>{msg}</div>}
//       </div>
//     </main>
//   );
// }

// // AZ High School Bracket - Created by Charles Richards 2026
// // ASU Computer Science (Cybersecurity) BS 2028






"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "../../lib/firebase";
import { isAdmin } from "../../lib/admin";
import { createTournament, TOURNAMENT_ID } from "../../lib/tournament";
import { createEmptyBracketGames } from "../../lib/games";

type DocPath = readonly [string, ...string[]];

type AdminCheckResult = {
  allowed: boolean;
  source: string;
  note?: string;
};

async function safeGetDoc(pathParts: DocPath) {
  try {
    const ref = doc(db, ...pathParts);
    const snap = await getDoc(ref);
    return snap;
  } catch {
    return null;
  }
}

function dataSaysAdmin(data: any): boolean {
  if (!data) return false;

  if (data.isAdmin === true) return true;
  if (data.admin === true) return true;
  if (data.allowed === true) return true;
  if (data.role === "admin") return true;

  if (Array.isArray(data.roles) && data.roles.includes("admin")) return true;
  if (Array.isArray(data.claims) && data.claims.includes("admin")) return true;

  return false;
}

async function checkAdmin(u: User): Promise<AdminCheckResult> {
  // 1) Try your existing helper first
  try {
    const ok = await isAdmin(u.uid);
    if (ok) return { allowed: true, source: "lib/isAdmin(uid)" };
  } catch {
    // keep going
  }

  // 2) Fallback to common admin doc locations (UID)
  const uidPaths: Array<{ path: DocPath; label: string }> = [
    { path: ["users", u.uid], label: "users/{uid}" },
    { path: ["admins", u.uid], label: "admins/{uid}" },
    {
      path: ["tournaments", TOURNAMENT_ID, "admins", u.uid],
      label: "tournaments/{id}/admins/{uid}",
    },
  ];

  for (const p of uidPaths) {
    const snap = await safeGetDoc(p.path);
    if (snap?.exists() && dataSaysAdmin(snap.data())) {
      return { allowed: true, source: p.label };
    }
    if (snap?.exists() && snap.data() && Object.keys(snap.data()).length === 0) {
      return { allowed: true, source: `${p.label} (exists)` };
    }
  }

  // 3) Optional Email-based doc ids (some setups do this)
  if (u.email) {
    const email = u.email.toLowerCase();

    const emailPaths: Array<{ path: DocPath; label: string }> = [
      { path: ["admins", email], label: "admins/{email}" },
      {
        path: ["tournaments", TOURNAMENT_ID, "admins", email],
        label: "tournaments/{id}/admins/{email}",
      },
    ];

    for (const p of emailPaths) {
      const snap = await safeGetDoc(p.path);
      if (snap?.exists() && dataSaysAdmin(snap.data())) {
        return { allowed: true, source: p.label };
      }
      if (snap?.exists() && snap.data() && Object.keys(snap.data()).length === 0) {
        return { allowed: true, source: `${p.label} (exists)` };
      }
    }
  }

  return {
    allowed: false,
    source: "no admin match",
    note:
      "If admin in Firestore, confirm the doc path matches what your rules expect, and sign out/in after changes.",
  };
}

export default function AdminPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [allowSource, setAllowSource] = useState<string>("");
  const [permNote, setPermNote] = useState<string>("");

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string>("");

  async function refreshPermissions(u: User) {
    setAllowed(null);
    setAllowSource("");
    setPermNote("");

    const res = await checkAdmin(u);
    setAllowed(res.allowed);
    setAllowSource(res.source);
    setPermNote(res.note ?? "");
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setMsg("");
      setAllowSource("");
      setPermNote("");

      if (!u) {
        setAllowed(false);
        return;
      }

      await refreshPermissions(u);
    });

    return () => unsub();
  }, []);

  async function handleCreateTournament() {
    if (!user) return;
    setBusy(true);
    setMsg("");
    try {
      await createTournament(user.uid);
      setMsg(`Tournament created/updated: tournaments/${TOURNAMENT_ID}`);
    } catch (e) {
      console.error(e);
      setMsg("Error creating tournament. Check console + Firestore rules.");
    } finally {
      setBusy(false);
    }
  }

  async function handleGenerateBracketGames() {
    setBusy(true);
    setMsg("");
    try {
      await createEmptyBracketGames();
      setMsg("Bracket games created/updated: tournaments/azhs-2026/games (31 docs)");
    } catch (e) {
      console.error(e);
      setMsg("Error generating bracket games. Check console + Firestore rules.");
    } finally {
      setBusy(false);
    }
  }

  const buttonStyle: React.CSSProperties = {
    padding: "10px 14px",
    width: "fit-content",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.2)",
    background: "rgba(0,0,0,0.06)",
    cursor: "pointer",
    fontWeight: 700,
  };

  const navButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    border: "1px solid rgba(43,92,255,0.35)",
    background: "rgba(43,92,255,0.08)",
  };

  if (!user) {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui" }}>
        <h1>Admin</h1>
        <p>Please sign in first.</p>
        <button onClick={() => router.push("/")} style={buttonStyle}>
          ← Home
        </button>
      </main>
    );
  }

  if (allowed === null) {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui" }}>
        <h1>Admin</h1>
        <p>Checking permissions…</p>
      </main>
    );
  }

  if (!allowed) {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui" }}>
        <h1>Admin</h1>
        <p>
          <b>Access denied</b> (not an admin).
        </p>

        <div style={{ marginTop: 10, opacity: 0.85 }}>
          Signed in as: <b>{user.displayName || user.email || user.uid}</b>
          <div style={{ marginTop: 6, fontSize: 13 }}>
            UID: <code>{user.uid}</code>
            {user.email ? (
              <>
                <br />
                Email: <code>{user.email}</code>
              </>
            ) : null}
          </div>

          <div style={{ marginTop: 8, fontSize: 13 }}>
            Check source: <code>{allowSource || "n/a"}</code>
          </div>

          {permNote ? (
            <div style={{ marginTop: 10, fontSize: 13, opacity: 0.9 }}>
              {permNote}
            </div>
          ) : null}
        </div>

        <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={() => router.push("/")} style={buttonStyle}>
            ← Home
          </button>

          <button onClick={() => refreshPermissions(user)} style={buttonStyle}>
            Refresh permissions
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Admin ✅</h1>
          <p style={{ marginTop: 8 }}>
            Welcome, <b>{user.displayName || user.email || user.uid}</b>.
          </p>
          <div style={{ fontSize: 13, opacity: 0.8 }}>
            Admin check source: <code>{allowSource}</code>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={() => router.push("/")} style={buttonStyle}>
            ← Home
          </button>
          <button onClick={() => refreshPermissions(user)} style={buttonStyle}>
            Refresh permissions
          </button>
        </div>
      </div>

      {/* ✅ Buttons to Admin pages */}
      <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button onClick={() => router.push("/admin/bracket")} style={navButtonStyle}>
          Admin Bracket →
        </button>
        <button onClick={() => router.push("/admin/teams")} style={navButtonStyle}>
          Admin Teams →
        </button>

        {/* ✅ NEW */}
        <button onClick={() => router.push("/admin/entries")} style={navButtonStyle}>
          Fix User Entries →
        </button>

        <Link href="/admin/bracket" style={{ alignSelf: "center", opacity: 0.85 }}>
          /admin/bracket
        </Link>
        <Link href="/admin/teams" style={{ alignSelf: "center", opacity: 0.85 }}>
          /admin/teams
        </Link>
        <Link href="/admin/entries" style={{ alignSelf: "center", opacity: 0.85 }}>
          /admin/entries
        </Link>
      </div>

      <div style={{ marginTop: 18, display: "grid", gap: 10 }}>
        <button
          onClick={handleCreateTournament}
          disabled={busy}
          style={{ ...buttonStyle, opacity: busy ? 0.6 : 1 }}
        >
          {busy ? "Working..." : "Create Tournament"}
        </button>

        <button
          onClick={handleGenerateBracketGames}
          disabled={busy}
          style={{ ...buttonStyle, opacity: busy ? 0.6 : 1 }}
        >
          {busy ? "Working..." : "Generate Bracket Games (31 docs)"}
        </button>

        {msg && <div style={{ marginTop: 8, opacity: 0.85 }}>{msg}</div>}
      </div>
    </main>
  );
}

// AZ High School Bracket - Created by Charles Richards 2026
// ASU Computer Science (Cybersecurity) BS 2028
