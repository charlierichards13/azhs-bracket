
// frick me i hope i didnt forget something important in here
//code contains rooms seeds

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  writeBatch,
} from "firebase/firestore";

import { auth, db } from "../../../lib/firebase"; // <- if this import errors, tell me what your lib folder path is

const TOURNAMENT_ID = "azhs-2026"; // <-- change if your tournament doc id is different

type TeamRow = {
  id: string;
  name: string;
  seed: number | null;
};

function slugifyTeamId(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// 32-team bracket seed pairings (classic seeding)
const ROUND1_SEED_PAIRS: Array<[number, number]> = [
  [1, 32],
  [16, 17],
  [8, 25],
  [9, 24],
  [5, 28],
  [12, 21],
  [4, 29],
  [13, 20],
  [6, 27],
  [11, 22],
  [3, 30],
  [14, 19],
  [7, 26],
  [10, 23],
  [2, 31],
  [15, 18],
];

export default function AdminTeamsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [teams, setTeams] = useState<TeamRow[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(false);

  const [name, setName] = useState("");
  const [seed, setSeed] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");

  const teamsColRef = useMemo(
    () => collection(db, "tournaments", TOURNAMENT_ID, "teams"),
    []
  );
  const gamesColRef = useMemo(
    () => collection(db, "tournaments", TOURNAMENT_ID, "games"),
    []
  );

  const seededCount = useMemo(() => {
    return teams.filter(
      (t) =>
        Number.isInteger(t.seed) &&
        t.seed !== null &&
        t.seed >= 1 &&
        t.seed <= 32
    ).length;
  }, [teams]);

  const seedDuplicates = useMemo(() => {
    const seen = new Map<number, string[]>();
    for (const t of teams) {
      if (t.seed && t.seed >= 1 && t.seed <= 32) {
        const arr = seen.get(t.seed) ?? [];
        arr.push(t.name);
        seen.set(t.seed, arr);
      }
    }
    const dups: Array<{ seed: number; names: string[] }> = [];
    for (const [s, names] of seen.entries()) {
      if (names.length > 1) dups.push({ seed: s, names });
    }
    return dups.sort((a, b) => a.seed - b.seed);
  }, [teams]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setCheckingAuth(false);
      setError("");
      setStatus("");

      if (!u) {
        setIsAdmin(false);
        setTeams([]);
        return;
      }

      // admin check: admins/{uid} exists
      const adminRef = doc(db, "admins", u.uid);
      const adminSnap = await getDoc(adminRef);
      setIsAdmin(adminSnap.exists());

      if (adminSnap.exists()) {
        await loadTeams();
      } else {
        setTeams([]);
      }
    });

    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadTeams() {
    setLoadingTeams(true);
    setError("");
    try {
      const snap = await getDocs(teamsColRef);
      const rows: TeamRow[] = snap.docs.map((d) => {
        const data = d.data() as any;
        const seedVal =
          typeof data.seed === "number" && Number.isFinite(data.seed)
            ? data.seed
            : null;
        return {
          id: d.id,
          name: typeof data.name === "string" ? data.name : d.id,
          seed: seedVal,
        };
      });

      // sort: seeded first by seed ascending, then unseeded by name
      rows.sort((a, b) => {
        const as = a.seed ?? 9999;
        const bs = b.seed ?? 9999;
        if (as !== bs) return as - bs;
        return a.name.localeCompare(b.name);
      });

      setTeams(rows);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load teams.");
    } finally {
      setLoadingTeams(false);
    }
  }

  function resetForm() {
    setName("");
    setSeed("");
    setEditingId(null);
  }

  async function handleAddOrUpdate() {
    setError("");
    setStatus("");

    const trimmed = name.trim();
    if (!trimmed) {
      setError("Team name is required.");
      return;
    }

    let seedNum: number | null = null;
    if (seed.trim() !== "") {
      const parsed = Number(seed);
      if (!Number.isInteger(parsed) || parsed < 1 || parsed > 32) {
        setError("Seed must be an integer from 1–32 (or leave blank).");
        return;
      }
      seedNum = parsed;
    }

    const id = editingId ?? slugifyTeamId(trimmed);
    if (!id) {
      setError("Could not create a valid Doc ID from that team name.");
      return;
    }

    try {
      const ref = doc(db, "tournaments", TOURNAMENT_ID, "teams", id);

      const payload: any = {
        name: trimmed,
        seed: seedNum,
        updatedAt: serverTimestamp(),
      };

      // only set createdAt when making a new doc (best-effort)
      if (!editingId) payload.createdAt = serverTimestamp();

      await setDoc(ref, payload, { merge: true });

      setStatus(
        editingId ? `Updated team: ${trimmed}` : `Saved team: ${trimmed}`
      );
      resetForm();
      await loadTeams();
    } catch (e: any) {
      setError(e?.message ?? "Failed to save team.");
    }
  }

  function handleEdit(t: TeamRow) {
    setName(t.name);
    setSeed(t.seed ? String(t.seed) : "");
    setEditingId(t.id);
    setStatus(`Editing: ${t.name}`);
    setError("");
  }

  async function handleDelete(t: TeamRow) {
    setError("");
    setStatus("");

    const ok = window.confirm(
      `Delete "${t.name}"? This removes the team doc. (If it was already in a game, the bracket may show TBD until you regenerate.)`
    );
    if (!ok) return;

    try {
      await deleteDoc(doc(db, "tournaments", TOURNAMENT_ID, "teams", t.id));
      setStatus(`Deleted: ${t.name}`);
      await loadTeams();
    } catch (e: any) {
      setError(e?.message ?? "Failed to delete team.");
    }
  }

  async function generateRound1FromSeeds() {
    setError("");
    setStatus("");

    try {
      // Pull latest teams fresh
      const snap = await getDocs(teamsColRef);
      const teamDocs: TeamRow[] = snap.docs.map((d) => {
        const data = d.data() as any;
        const seedVal =
          typeof data.seed === "number" && Number.isFinite(data.seed)
            ? data.seed
            : null;
        return {
          id: d.id,
          name: typeof data.name === "string" ? data.name : d.id,
          seed: seedVal,
        };
      });

      const seeded = teamDocs.filter(
        (t) => t.seed !== null && Number.isInteger(t.seed) && t.seed >= 1 && t.seed <= 32
      );

      if (seeded.length !== 32) {
        setError(
          `You must have exactly 32 seeded teams to generate Round 1. Currently seeded: ${seeded.length}/32`
        );
        return;
      }

      // Check duplicates
      const seedToTeamId = new Map<number, string>();
      const dupSeeds: number[] = [];
      for (const t of seeded) {
        const s = t.seed as number;
        if (seedToTeamId.has(s)) dupSeeds.push(s);
        seedToTeamId.set(s, t.id);
      }
      if (dupSeeds.length > 0) {
        const uniq = Array.from(new Set(dupSeeds)).sort((a, b) => a - b);
        setError(`Duplicate seeds found: ${uniq.join(", ")}. Fix duplicates first.`);
        return;
      }

      // Optional sanity: ensure every seed 1..32 exists
      for (let s = 1; s <= 32; s++) {
        if (!seedToTeamId.has(s)) {
          setError(`Missing seed ${s}. You must seed every number 1–32.`);
          return;
        }
      }

      // Batch: clear all games first, then set Round 1 matchups
      // NOTE: This will clear winners (and any downstream auto-advanced teams).
      const batch = writeBatch(db);

      // Update tournament status (optional)
      batch.set(
        doc(db, "tournaments", TOURNAMENT_ID),
        { status: "seeded", updatedAt: serverTimestamp() },
        { merge: true }
      );

      const roundSizes: Record<number, number> = { 1: 16, 2: 8, 3: 4, 4: 2, 5: 1 };

      for (let round = 1; round <= 5; round++) {
        for (let g = 1; g <= roundSizes[round]; g++) {
          const id = `R${round}G${g}`;
          batch.set(
            doc(gamesColRef, id),
            {
              teamAId: null,
              teamBId: null,
              winnerId: null,
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );
        }
      }

      // Set Round 1 games
      ROUND1_SEED_PAIRS.forEach(([aSeed, bSeed], i) => {
        const gameId = `R1G${i + 1}`;
        batch.set(
          doc(gamesColRef, gameId),
          {
            teamAId: seedToTeamId.get(aSeed) ?? null,
            teamBId: seedToTeamId.get(bSeed) ?? null,
            winnerId: null,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      });

      await batch.commit();

      setStatus(
        `Round 1 generated from seeds! Wrote matchups to tournaments/${TOURNAMENT_ID}/games (R1G1–R1G16).`
      );

      await loadTeams();
    } catch (e: any) {
      setError(e?.message ?? "Failed to generate Round 1.");
    }
  }

  async function handleSignOut() {
    await signOut(auth);
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="opacity-80">Checking sign-in…</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="text-xl font-semibold">Admin · Teams</div>
        <div className="opacity-80 mt-2">You are signed out.</div>
        <div className="mt-4">
          <Link className="underline" href="/">
            Go to home
          </Link>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="text-xl font-semibold">Admin · Teams</div>
        <div className="opacity-80 mt-2">
          Not authorized (your UID is not in <code>admins/&lt;uid&gt;</code>).
        </div>
        <div className="mt-4 flex gap-3">
          <Link className="underline" href="/">
            Go to home
          </Link>
          <button
            onClick={handleSignOut}
            className="px-3 py-2 rounded border border-white/20 hover:border-white/40"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="text-2xl font-semibold">Admin · Teams</div>
          <div className="opacity-80 mt-1">
            Add your 32 schools here (seeds can be added/edited).{" "}
            <span className="text-white/70">
              Current seeded: {seededCount}/32
            </span>
          </div>

          {seedDuplicates.length > 0 && (
            <div className="mt-3 text-amber-300 text-sm">
              Duplicate seeds detected:{" "}
              {seedDuplicates
                .map((d) => `${d.seed} (${d.names.join(", ")})`)
                .join(" · ")}
            </div>
          )}

          {error && (
            <div className="mt-3 text-red-300 text-sm whitespace-pre-wrap">
              {error}
            </div>
          )}
          {status && (
            <div className="mt-3 text-green-300 text-sm whitespace-pre-wrap">
              {status}
            </div>
          )}
        </div>

        <div className="text-right">
          <div className="opacity-80 text-sm">Signed in as {user.displayName ?? user.email}</div>
          <button
            onClick={handleSignOut}
            className="mt-2 px-4 py-2 rounded border border-white/20 hover:border-white/40"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="mt-6 rounded-xl border border-white/10 p-4 bg-white/5">
        <div className="font-semibold mb-3">Add / Update team</div>

        <div className="flex flex-wrap gap-3 items-center">
          <input
            className="bg-black/40 border border-white/15 rounded px-3 py-2 w-[320px] outline-none focus:border-white/30"
            placeholder="Team / School name (e.g., Desert Vista)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="bg-black/40 border border-white/15 rounded px-3 py-2 w-[140px] outline-none focus:border-white/30"
            placeholder="Seed (1–32)"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
          />

          <button
            onClick={handleAddOrUpdate}
            className="px-4 py-2 rounded border border-white/20 hover:border-white/40"
          >
            {editingId ? "Save changes" : "Add / Update"}
          </button>

          <button
            onClick={loadTeams}
            className="px-4 py-2 rounded border border-white/20 hover:border-white/40"
            disabled={loadingTeams}
          >
            {loadingTeams ? "Refreshing…" : "Refresh"}
          </button>

          {editingId && (
            <button
              onClick={resetForm}
              className="px-4 py-2 rounded border border-white/20 hover:border-white/40"
            >
              Cancel edit
            </button>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-3 items-center">
          <button
            onClick={generateRound1FromSeeds}
            className="px-4 py-2 rounded border border-emerald-400/40 hover:border-emerald-400/80 text-emerald-200"
            disabled={seededCount !== 32 || seedDuplicates.length > 0}
            title={
              seededCount !== 32
                ? `Need exactly 32 seeded teams (currently ${seededCount}/32)`
                : seedDuplicates.length > 0
                ? "Fix duplicate seeds first"
                : "Generate Round 1 matchups"
            }
          >
            Generate Round 1 from Seeds
          </button>

          <Link
            href="/admin"
            className="px-4 py-2 rounded border border-white/20 hover:border-white/40 inline-block"
          >
            ← Back to Admin Home
          </Link>

          {seededCount !== 32 && (
            <div className="text-white/70 text-sm">
              You must have exactly 32 seeded teams to generate Round 1. Currently seeded:{" "}
              {seededCount}/32
            </div>
          )}
        </div>

        <div className="mt-2 text-white/60 text-sm">
          Tip: click <b>Edit</b> to load a team into the form. Click <b>Delete</b> to remove it.
        </div>
      </div>

      {/* Table */}
      <div className="mt-6">
        <div className="font-semibold mb-2">Teams</div>

        <div className="rounded-xl border border-white/10 overflow-hidden">
          <div className="grid grid-cols-[1.5fr_0.6fr_1fr_0.9fr] bg-white/5 px-4 py-3 text-sm font-semibold">
            <div>Name</div>
            <div>Seed</div>
            <div>Doc ID</div>
            <div className="text-right">Actions</div>
          </div>

          {teams.length === 0 ? (
            <div className="px-4 py-4 text-white/70">No teams yet.</div>
          ) : (
            teams.map((t) => (
              <div
                key={t.id}
                className="grid grid-cols-[1.5fr_0.6fr_1fr_0.9fr] px-4 py-3 text-sm border-t border-white/10"
              >
                <div className="truncate">{t.name}</div>
                <div className="text-white/80">{t.seed ?? "—"}</div>
                <div className="text-white/60 truncate">{t.id}</div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit(t)}
                    className="px-3 py-1.5 rounded border border-white/20 hover:border-white/40"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(t)}
                    className="px-3 py-1.5 rounded border border-red-400/40 hover:border-red-400/80 text-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}


// AZ High School Bracket - Created by Charles Richards 2026
// ASU Computer Science (Cybersecurity) BS 2028