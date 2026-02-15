import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function isAdmin(uid: string): Promise<boolean> {
  try {
    const snap = await getDoc(doc(db, "admins", uid));
    return snap.exists();
  } catch (err) {
    console.error("isAdmin() failed:", err);
    return false;
  }
}
