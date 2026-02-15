import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { TOURNAMENT_ID } from "./tournament";
// lol prob come back to this later...
export type Team = {
  id: string;                 // stable id (slug)
  name: string;               // display name
  seed?: number | null;       // 1..32 later
  logoUrl?: string | null;    // optional external URL
  createdAt?: any;
  updatedAt?: any;
};

export async function listTeams(): Promise<Team[]> {
  const q = query(
    collection(db, "tournaments", TOURNAMENT_ID, "teams"),
    orderBy("name", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
}

export async function upsertTeam(team: Team) {
  await setDoc(
    doc(db, "tournaments", TOURNAMENT_ID, "teams", team.id),
    {
      name: team.name,
      seed: team.seed ?? null,
      logoUrl: team.logoUrl ?? null,
      updatedAt: serverTimestamp(),
      // NOTE: we intentionally do NOT overwrite createdAt on updates
      // If you want createdAt, we can add it later with a "create only" flow.
    },
    { merge: true }
  );
}

// AZ High School Bracket - Created by Charles Richards 2026
// ASU Computer Science (Cybersecurity) BS 2028