// games.ts - functions for managing tournament games in Firestore
// AZ High School Bracket - Created by Charles Richards 2026
// ASU Computer Science (Cybersecurity) BS 2028

// games.ts - functions for managing tournament games in Firestore
// lib/games.ts - functions for managing tournament games in Firestore
import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import { TOURNAMENT_ID } from "./tournament";

export type Game = {
  id: string; // e.g. R1G1
  round: number; // 1..5
  game: number; // 1..16 (varies by round)

  teamAId: string | null;
  teamBId: string | null;

  // ✅ canonical winner field
  winnerId: string | null;

  // (optional legacy support)
  winnerTeamId?: string | null;

  nextGameId: string | null; // e.g. R2G1
  nextSlot: "A" | "B" | null; // which slot in next game
};

export function gameId(round: number, game: number) {
  return `R${round}G${game}`;
}

export function roundGameCount(round: number) {
  // R1 16, R2 8, R3 4, R4 2, R5 1
  return [0, 16, 8, 4, 2, 1][round] ?? 0;
}

function parseGameId(id: string): { round: number; game: number } | null {
  const m = /^R(\d+)G(\d+)$/i.exec(id);
  if (!m) return null;
  return { round: Number(m[1]), game: Number(m[2]) };
}

export async function createEmptyBracketGames() {
  const batch = writeBatch(db);

  for (let r = 1; r <= 5; r++) {
    const count = roundGameCount(r);

    for (let g = 1; g <= count; g++) {
      const id = gameId(r, g);

      let nextGameIdVal: string | null = null;
      let nextSlotVal: "A" | "B" | null = null;

      if (r < 5) {
        const nextG = Math.ceil(g / 2);
        nextGameIdVal = gameId(r + 1, nextG);
        nextSlotVal = g % 2 === 1 ? "A" : "B";
      }

      const ref = doc(db, "tournaments", TOURNAMENT_ID, "games", id);
      batch.set(
        ref,
        {
          round: r,
          game: g,
          teamAId: null,
          teamBId: null,
          winnerId: null,
          winnerTeamId: null, // legacy (safe to keep during transition)
          nextGameId: nextGameIdVal,
          nextSlot: nextSlotVal,
          updatedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );
    }
  }

  await batch.commit();
}

export async function listGames(): Promise<Game[]> {
  const snap = await getDocs(
    collection(db, "tournaments", TOURNAMENT_ID, "games")
  );

  const games = snap.docs.map((d) => {
    const data = d.data() as any;

    // ✅ normalize winner (supports old docs that used winnerTeamId)
    const winnerId = (data.winnerId ?? data.winnerTeamId ?? null) as
      | string
      | null;

    return {
      id: d.id,
      round: data.round,
      game: data.game,
      teamAId: data.teamAId ?? null,
      teamBId: data.teamBId ?? null,
      winnerId,
      winnerTeamId: data.winnerTeamId ?? null,
      nextGameId: data.nextGameId ?? null,
      nextSlot: data.nextSlot ?? null,
    } as Game;
  });

  games.sort((a, b) => a.round - b.round || a.game - b.game);
  return games;
}

/**
 * ✅ Admin helper: set winner AND advance it to next game slot, clearing downstream.
 * This keeps bracket consistent when you change earlier winners.
 */
export async function setWinnerAndAdvance(game: Game, winnerTeamId: string | null) {
  const gRef = doc(db, "tournaments", TOURNAMENT_ID, "games", game.id);

  // 1) update this game
  await setDoc(
    gRef,
    {
      winnerId: winnerTeamId,
      winnerTeamId: winnerTeamId, // legacy mirror (optional)
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  // 2) no next game if final
  if (game.round >= 5) return;

  const nextRound = game.round + 1;
  const nextGameNum = Math.ceil(game.game / 2);
  const slotField = game.game % 2 === 1 ? "teamAId" : "teamBId";
  const nextId = gameId(nextRound, nextGameNum);
  const nextRef = doc(db, "tournaments", TOURNAMENT_ID, "games", nextId);

  // write participant, clear next winner
  await setDoc(
    nextRef,
    {
      [slotField]: winnerTeamId ?? null,
      winnerId: null,
      winnerTeamId: null,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  // 3) clear everything downstream from next game
  await clearPropagationFrom(nextRound, nextGameNum);
}

async function clearPropagationFrom(round: number, gameNum: number) {
  if (round >= 5) return;

  const nextRound = round + 1;
  const nextGameNum = Math.ceil(gameNum / 2);
  const slotField = gameNum % 2 === 1 ? "teamAId" : "teamBId";

  const nextId = gameId(nextRound, nextGameNum);
  const nextRef = doc(db, "tournaments", TOURNAMENT_ID, "games", nextId);

  await setDoc(
    nextRef,
    {
      [slotField]: null,
      winnerId: null,
      winnerTeamId: null,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  await clearPropagationFrom(nextRound, nextGameNum);
}

// AZ High School Bracket - Created by Charles Richards 2026
// ASU Computer Science (Cybersecurity) BS 2028


// AZ High School Bracket - Created by Charles Richards 2026
// ASU Computer Science (Cybersecurity) BS 2028
