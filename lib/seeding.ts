import { db } from "./firebase";
import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";

type TeamDoc = {
  id: string;
  name?: string;
  seed?: number;
};

const MATCHUPS: Array<[number, number]> = [
  [1, 16],
  [8, 9],
  [5, 12],
  [4, 13],
  [6, 11],
  [3, 14],
  [7, 10],
  [2, 15],
];

// Parses "R1G12" -> { round: 1, game: 12 }
function parseGameId(id: string) {
  const m = /^R(\d+)G(\d+)$/.exec(id);
  if (!m) return { round: 0, game: 0 };
  return { round: Number(m[1]), game: Number(m[2]) };
}

export async function generateRound1FromSeeds(tournamentId: string) {
  // 1) Load teams
  const teamsSnap = await getDocs(
    collection(db, "tournaments", tournamentId, "teams")
  );

  const teams: TeamDoc[] = teamsSnap.docs.map((d) => {
    const data = d.data() as any;
    return {
      id: d.id,
      name: data.name,
      seed: typeof data.seed === "number" ? data.seed : undefined,
    };
  });

  if (teams.length !== 32) {
    throw new Error(`You have ${teams.length}/32 teams. Add all 32 first.`);
  }

  const seeded = teams.filter((t) => typeof t.seed === "number");
  if (seeded.length !== 32) {
    throw new Error(`All 32 teams must have a numeric seed (1–32).`);
  }

  // 2) Validate seeds: unique + range
  const seeds = seeded.map((t) => t.seed as number);
  const seedSet = new Set(seeds);

  if (seedSet.size !== 32) {
    throw new Error(`Duplicate seeds detected. Every seed must be unique.`);
  }

  const min = Math.min(...seeds);
  const max = Math.max(...seeds);

  if (min < 1 || max > 32) {
    throw new Error(`Seeds must be in the range 1–32 (you have ${min}..${max}).`);
  }

  // 3) Split into LEFT (1–16) and RIGHT (17–32) halves
  const left = new Map<number, string>();  // regionSeed -> teamId
  const right = new Map<number, string>(); // regionSeed -> teamId (seed-16)

  for (const t of seeded) {
    const s = t.seed as number;
    if (s <= 16) left.set(s, t.id);
    else right.set(s - 16, t.id);
  }

  if (left.size !== 16 || right.size !== 16) {
    throw new Error(
      `Expected 16 seeds on each side.\n` +
        `Left has ${left.size} (seeds 1–16).\n` +
        `Right has ${right.size} (seeds 17–32).`
    );
  }

  // 4) Load games so we can clear later rounds cleanly
  const gamesSnap = await getDocs(
    collection(db, "tournaments", tournamentId, "games")
  );

  const batch = writeBatch(db);

  // Clear rounds 2–5 (and also clear winners everywhere)
  for (const g of gamesSnap.docs) {
    const id = g.id;
    const { round } = parseGameId(id);

    // Always clear winner
    const baseUpdate: any = {
      winnerId: null,
      updatedAt: serverTimestamp(),
    };

    // Clear future rounds completely
    if (round >= 2) {
      baseUpdate.teamAId = null;
      baseUpdate.teamBId = null;
      baseUpdate.seedA = null;
      baseUpdate.seedB = null;
    }

    batch.set(
      doc(db, "tournaments", tournamentId, "games", id),
      baseUpdate,
      { merge: true }
    );
  }

  // 5) Fill Round 1: R1G1..R1G8 = LEFT, R1G9..R1G16 = RIGHT
  for (let i = 0; i < MATCHUPS.length; i++) {
    const [aSeed, bSeed] = MATCHUPS[i];

    // LEFT
    {
      const gameNum = i + 1; // 1..8
      const gameId = `R1G${gameNum}`;
      const teamAId = left.get(aSeed)!;
      const teamBId = left.get(bSeed)!;

      batch.set(
        doc(db, "tournaments", tournamentId, "games", gameId),
        {
          teamAId,
          teamBId,
          seedA: aSeed, // region seed (1..16)
          seedB: bSeed,
          winnerId: null,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }

    // RIGHT
    {
      const gameNum = i + 9; // 9..16
      const gameId = `R1G${gameNum}`;
      const teamAId = right.get(aSeed)!;
      const teamBId = right.get(bSeed)!;

      batch.set(
        doc(db, "tournaments", tournamentId, "games", gameId),
        {
          teamAId,
          teamBId,
          seedA: aSeed, // region seed (1..16)
          seedB: bSeed,
          winnerId: null,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }
  }

  await batch.commit();

  return {
    ok: true,
    message:
      "Round 1 generated from seeds. Left=1–16, Right=17–32 (shown as 1–16).",
  };
}
// Created by Charles Richards ASU CS 2028