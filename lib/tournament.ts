import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "./firebase";

// We'll keep this simple: a single tournament with a known ID.
// Later you can support multiple years/tournaments if you want.
export const TOURNAMENT_ID = "azhs-2026";

export async function createTournament(adminUid: string) {
  await setDoc(
    doc(db, "tournaments", TOURNAMENT_ID),
    {
      name: "AZHS Bracket",
      seasonYear: 2026,
      status: "setup", // setup -> live -> completed
      createdBy: adminUid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
// AZ High School Bracket - Created by Charles Richards 2026
// ASU Computer Science (Cybersecurity) BS 2028