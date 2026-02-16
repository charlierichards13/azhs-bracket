// import { doc, getDoc } from "firebase/firestore";
// import { db } from "./firebase";

// export async function isAdmin(uid: string): Promise<boolean> {
//   try {
//     const snap = await getDoc(doc(db, "admins", uid));
//     return snap.exists();
//   } catch (err) {
//     console.error("isAdmin() failed:", err);
//     return false;
//   }
// }


import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { TOURNAMENT_ID } from "./tournament";

// Allow passing email for setups that store admin docs keyed by email
export async function isAdmin(uid: string, email?: string | null): Promise<boolean> {
  const emailKey = (email || "").trim().toLowerCase();

  // Try multiple common locations / id schemes
  const paths: Array<[string, ...string[]]> = [
    ["admins", uid], // your original
    ["tournaments", TOURNAMENT_ID, "admins", uid], // tournament-scoped admins
  ];

  // Some people store admin docs by email instead of uid
  if (emailKey) {
    paths.push(["admins", emailKey]);
    paths.push(["tournaments", TOURNAMENT_ID, "admins", emailKey]);
  }

  // Optional: some people keep admin flag on a user doc
  paths.push(["users", uid]);

  for (const p of paths) {
    try {
      const snap = await getDoc(doc(db, ...p));

      if (!snap.exists()) continue;

      // If doc exists, treat it as admin for admin collections:
      if (p[0] === "admins") return true;
      if (p[0] === "tournaments" && p[2] === "admins") return true;

      // For users/{uid}, require a field (so random user docs don't grant admin)
      const data: any = snap.data();
      if (p[0] === "users" && data?.isAdmin === true) return true;
    } catch (err) {
      // IMPORTANT:
      // If rules deny reading admin docs, you will land here and return false.
      // Check the browser console for "permission-denied" to confirm.
      console.error("isAdmin() check failed on path:", p.join("/"), err);
      // keep trying other paths rather than immediately failing
    }
  }

  return false;
}
