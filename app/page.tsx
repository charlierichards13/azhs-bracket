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


"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setChecking(false);
    });
    return () => unsub();
  }, []);

  async function doGoogleSignIn() {
    setStatus("");
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (e: any) {
      setStatus(`Sign-in failed: ${e.message ?? String(e)}`);
    }
  }

  async function doSignOut() {
    setStatus("");
    await signOut(auth);
  }

  return (
    <main style={{ padding: 24, color: "#fff" }}>
      {/* ✅ Visible homepage title + description */}
      <h1 style={{ margin: 0 }}>
        2026 AIA Boys Basketball Open State Championship
      </h1>

      <p style={{ opacity: 0.85, marginTop: 10, maxWidth: 900, lineHeight: 1.5 }}>
        Predict the matchups between the top 32 teams in Arizona high school basketball,
        and who will take home the trophy in Arizona Veterans Memorial Coliseum on March 7th!
        Fill out your bracket and compete against others to see who can have the most accurate bracket.
      </p>

      <div style={{ marginTop: 18, opacity: 0.9 }}>
        {checking ? (
          <p>Checking sign-in…</p>
        ) : user ? (
          <>
            <div style={{ marginTop: 8 }}>
              Signed in as <b>{user.displayName ?? user.email}</b>
            </div>
            <div style={{ opacity: 0.75, marginTop: 4 }}>
              {user.email}
            </div>

            <div style={{ marginTop: 16, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/my-bracket" style={linkBtn()}>
                My Bracket
              </Link>
              <Link href="/bracket" style={linkBtn()}>
                Live Bracket
              </Link>
              <Link href="/leaderboard" style={linkBtn()}>
                Leaderboard
              </Link>

              <button onClick={doSignOut} style={btn()}>
                Sign out
              </button>
            </div>
          </>
        ) : (
          <>
            <p style={{ marginTop: 10 }}>
              Sign in to create and submit your bracket. Once submitted, it locks.
            </p>
            <button onClick={doGoogleSignIn} style={btn()}>
              Sign in with Google
            </button>
          </>
        )}

        {status && (
          <p style={{ marginTop: 12, color: "#b7ffb7" }}>
            {status}
          </p>
        )}
      </div>
    </main>
  );
}

function btn(): React.CSSProperties {
  return {
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.10)",
    color: "#fff",
    cursor: "pointer",
  };
}

function linkBtn(): React.CSSProperties {
  return {
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    textDecoration: "none",
    display: "inline-block",
    fontWeight: 600,
  };
}
