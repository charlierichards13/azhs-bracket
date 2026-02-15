// i have to add hella imports here so reminder to come back

"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { isAdmin } from "../../lib/admin";
import { createTournament, TOURNAMENT_ID } from "../../lib/tournament";
import { createEmptyBracketGames } from "../../lib/games";

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string>("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) {
        setAllowed(false);
        return;
      }
      setAllowed(await isAdmin(u.uid));
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

  if (!user) {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui" }}>
        <h1>Admin</h1>
        <p>Please sign in first.</p>
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
        <p>Access denied (not an admin).</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>Admin ✅</h1>
      <p>Welcome, {user.displayName}.</p>

      <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
        <button
          onClick={handleCreateTournament}
          disabled={busy}
          style={{ padding: "10px 14px", width: "fit-content" }}
        >
          {busy ? "Working..." : "Create Tournament"}
        </button>

        <button
          onClick={handleGenerateBracketGames}
          disabled={busy}
          style={{ padding: "10px 14px", width: "fit-content" }}
        >
          {busy ? "Working..." : "Generate Bracket Games (31 docs)"}
        </button>

        <a href="/admin/teams" style={{ width: "fit-content" }}>
          Go to Teams →
        </a>

        {msg && <div style={{ marginTop: 8, opacity: 0.85 }}>{msg}</div>}
      </div>
    </main>
  );
}


// AZ High School Bracket - Created by Charles Richards 2026
// ASU Computer Science (Cybersecurity) BS 2028