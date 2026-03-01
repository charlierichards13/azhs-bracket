/* admin side for the player props page. im thinking i will allow admin 
to control which props are active, and the order they appear in. then on the client side, users can make picks on the active props. 
*/



"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";
import { isAdmin } from "@/lib/admin";
import { TOURNAMENT_ID } from "@/lib/tournament";

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
    if (snap?.exists() && dataSaysAdmin(snap.data())) return { allowed: true, source: p.label };
    if (snap?.exists() && snap.data() && Object.keys(snap.data()).length === 0)
      return { allowed: true, source: `${p.label} (exists)` };
  }

  // 3) Optional Email-based doc ids
  if (u.email) {
    const email = u.email.toLowerCase();
    const emailPaths: Array<{ path: DocPath; label: string }> = [
      { path: ["admins", email], label: "admins/{email}" },
      { path: ["tournaments", TOURNAMENT_ID, "admins", email], label: "tournaments/{id}/admins/{email}" },
    ];

    for (const p of emailPaths) {
      const snap = await safeGetDoc(p.path);
      if (snap?.exists() && dataSaysAdmin(snap.data())) return { allowed: true, source: p.label };
      if (snap?.exists() && snap.data() && Object.keys(snap.data()).length === 0)
        return { allowed: true, source: `${p.label} (exists)` };
    }
  }

  return {
    allowed: false,
    source: "no admin match",
    note:
      "If admin in Firestore, confirm the doc path matches what your rules expect, and sign out/in after changes.",
  };
}

type PlayerPropDoc = {
  playerName?: string;
  teamName?: string;
  statKey?: string;
  line?: number;
  active?: boolean;
  order?: number;
  notes?: string;
  createdAt?: any;
  updatedAt?: any;
};

type PlayerProp = PlayerPropDoc & { id: string };

const STAT_OPTIONS: Array<{ key: string; label: string }> = [
  { key: "points", label: "Points" },
  { key: "assists", label: "Assists" },
  { key: "rebounds", label: "Rebounds" },
  { key: "threes", label: "3PT Made" },
  { key: "steals", label: "Steals" },
  { key: "blocks", label: "Blocks" },
  { key: "pra", label: "P+R+A" },
];

export default function AdminPlayerPropsPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [allowSource, setAllowSource] = useState("");
  const [permNote, setPermNote] = useState("");

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const [props, setProps] = useState<PlayerProp[]>([]);
  const sortedProps = useMemo(
    () => props.slice().sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999)),
    [props]
  );

  // form state
  const [selectedId, setSelectedId] = useState<string>("");
  const [playerName, setPlayerName] = useState("");
  const [teamName, setTeamName] = useState("");
  const [statKey, setStatKey] = useState("points");
  const [line, setLine] = useState<string>("22.5");
  const [order, setOrder] = useState<string>("1");
  const [active, setActive] = useState(true);
  const [notes, setNotes] = useState("");

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

      if (!u) {
        setAllowed(false);
        return;
      }

      await refreshPermissions(u);
    });

    return () => unsub();
  }, []);

  // subscribe props once admin is allowed
  useEffect(() => {
    if (!allowed) return;

    const ref = collection(db, "tournaments", TOURNAMENT_ID, "playerProps");
    const unsub = onSnapshot(
      ref,
      (snap) => {
        const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as PlayerPropDoc) }));
        setProps(rows);
      },
      (err) => {
        console.error(err);
        setMsg("Could not load player props.");
      }
    );

    return () => unsub();
  }, [allowed]);

  function clearForm() {
    setSelectedId("");
    setPlayerName("");
    setTeamName("");
    setStatKey("points");
    setLine("22.5");
    setOrder("1");
    setActive(true);
    setNotes("");
  }

  function loadIntoForm(p: PlayerProp) {
    setSelectedId(p.id);
    setPlayerName(p.playerName ?? "");
    setTeamName(p.teamName ?? "");
    setStatKey(p.statKey ?? "points");
    setLine(typeof p.line === "number" ? String(p.line) : p.line ? String(p.line) : "");
    setOrder(typeof p.order === "number" ? String(p.order) : p.order ? String(p.order) : "1");
    setActive(p.active !== false);
    setNotes(p.notes ?? "");
  }

  async function addProp() {
    setBusy(true);
    setMsg("");
    try {
      const lineNum = Number(line);
      const orderNum = Number(order);

      if (!playerName.trim()) {
        setMsg("Player name is required.");
        return;
      }
      if (!Number.isFinite(lineNum)) {
        setMsg("Line must be a valid number (e.g., 22.5).");
        return;
      }

      const ref = collection(db, "tournaments", TOURNAMENT_ID, "playerProps");
      await addDoc(ref, {
        playerName: playerName.trim(),
        teamName: teamName.trim() || undefined,
        statKey,
        line: lineNum,
        order: Number.isFinite(orderNum) ? orderNum : 999,
        active,
        notes: notes.trim() || undefined,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      } satisfies PlayerPropDoc);

      setMsg("✅ Prop added.");
      clearForm();
    } catch (e) {
      console.error(e);
      setMsg("Error adding prop (check Firestore rules).");
    } finally {
      setBusy(false);
    }
  }

  async function updateProp() {
    if (!selectedId) {
      setMsg("Select a prop from the list to update.");
      return;
    }

    setBusy(true);
    setMsg("");
    try {
      const lineNum = Number(line);
      const orderNum = Number(order);

      if (!playerName.trim()) {
        setMsg("Player name is required.");
        return;
      }
      if (!Number.isFinite(lineNum)) {
        setMsg("Line must be a valid number (e.g., 22.5).");
        return;
      }

      const ref = doc(db, "tournaments", TOURNAMENT_ID, "playerProps", selectedId);
      await updateDoc(ref, {
        playerName: playerName.trim(),
        teamName: teamName.trim() || null,
        statKey,
        line: lineNum,
        order: Number.isFinite(orderNum) ? orderNum : 999,
        active,
        notes: notes.trim() || null,
        updatedAt: serverTimestamp(),
      });

      setMsg("✅ Prop updated.");
    } catch (e) {
      console.error(e);
      setMsg("Error updating prop (check Firestore rules).");
    } finally {
      setBusy(false);
    }
  }

  async function deleteProp() {
    if (!selectedId) {
      setMsg("Select a prop from the list to delete.");
      return;
    }

    const ok = window.confirm("Delete this prop? This cannot be undone.");
    if (!ok) return;

    setBusy(true);
    setMsg("");
    try {
      const ref = doc(db, "tournaments", TOURNAMENT_ID, "playerProps", selectedId);
      await deleteDoc(ref);
      setMsg("🗑️ Prop deleted.");
      clearForm();
    } catch (e) {
      console.error(e);
      setMsg("Error deleting prop (check Firestore rules).");
    } finally {
      setBusy(false);
    }
  }

  const buttonStyle: CSSProperties = {
    padding: "10px 14px",
    width: "fit-content",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.2)",
    background: "rgba(0,0,0,0.06)",
    cursor: "pointer",
    fontWeight: 800,
  };

  if (!user) {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui" }}>
        <h1>Admin Player Props</h1>
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
        <h1>Admin Player Props</h1>
        <p>Checking permissions…</p>
      </main>
    );
  }

  if (!allowed) {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui" }}>
        <h1>Admin Player Props</h1>
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
            <div style={{ marginTop: 10, fontSize: 13, opacity: 0.9 }}>{permNote}</div>
          ) : null}
        </div>

        <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="/admin" style={{ alignSelf: "center", opacity: 0.85 }}>
            ← Back to Admin
          </Link>

          <button onClick={() => refreshPermissions(user)} style={buttonStyle}>
            Refresh permissions
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0 }}>Admin Player Props ✅</h1>
          <p style={{ marginTop: 8 }}>
            Add / edit over-under lines for players (stored at{" "}
            <code>tournaments/{TOURNAMENT_ID}/playerProps</code>)
          </p>
          <div style={{ fontSize: 13, opacity: 0.8 }}>
            Admin check source: <code>{allowSource}</code>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <Link href="/admin" style={{ alignSelf: "center", opacity: 0.85 }}>
            ← Back to Admin
          </Link>
          <button onClick={() => refreshPermissions(user)} style={buttonStyle}>
            Refresh permissions
          </button>
        </div>
      </div>

      {msg ? (
        <div style={{ marginTop: 12, padding: 10, border: "1px solid rgba(0,0,0,0.10)", borderRadius: 12 }}>
          {msg}
        </div>
      ) : null}

      <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {/* Form */}
        <div style={{ border: "1px solid rgba(0,0,0,0.10)", borderRadius: 14, padding: 14 }}>
          <div style={{ fontWeight: 900, marginBottom: 10 }}>
            {selectedId ? "✏️ Edit Prop" : "➕ Add New Prop"}
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            <label>
              <div style={{ fontSize: 12, opacity: 0.8 }}>Player name</div>
              <input
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="e.g., Koa Peat"
                style={inp()}
              />
            </label>

            <label>
              <div style={{ fontSize: 12, opacity: 0.8 }}>Team (optional)</div>
              <input
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g., Perry"
                style={inp()}
              />
            </label>

            <label>
              <div style={{ fontSize: 12, opacity: 0.8 }}>Stat</div>
              <select value={statKey} onChange={(e) => setStatKey(e.target.value)} style={inp()}>
                {STAT_OPTIONS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <div style={{ fontSize: 12, opacity: 0.8 }}>Line (number)</div>
              <input
                value={line}
                onChange={(e) => setLine(e.target.value)}
                placeholder="e.g., 22.5"
                style={inp()}
              />
            </label>

            <label>
              <div style={{ fontSize: 12, opacity: 0.8 }}>Display order</div>
              <input
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                placeholder="e.g., 1"
                style={inp()}
              />
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />
              <span style={{ fontWeight: 800 }}>Active</span>
            </label>

            <label>
              <div style={{ fontSize: 12, opacity: 0.8 }}>Notes (optional)</div>
              <input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Semifinals special"
                style={inp()}
              />
            </label>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 6 }}>
              <button onClick={addProp} disabled={busy} style={{ ...buttonStyle, opacity: busy ? 0.6 : 1 }}>
                {busy ? "Working..." : "Add Prop"}
              </button>

              <button
                onClick={updateProp}
                disabled={busy || !selectedId}
                style={{ ...buttonStyle, opacity: busy || !selectedId ? 0.6 : 1 }}
              >
                {busy ? "Working..." : "Update Selected"}
              </button>

              <button
                onClick={deleteProp}
                disabled={busy || !selectedId}
                style={{
                  ...buttonStyle,
                  opacity: busy || !selectedId ? 0.6 : 1,
                  border: "1px solid rgba(194,59,59,0.35)",
                  background: "rgba(194,59,59,0.08)",
                }}
              >
                Delete
              </button>

              <button onClick={clearForm} disabled={busy} style={{ ...buttonStyle, opacity: busy ? 0.6 : 1 }}>
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* List */}
        <div style={{ border: "1px solid rgba(0,0,0,0.10)", borderRadius: 14, padding: 14 }}>
          <div style={{ fontWeight: 900, marginBottom: 10 }}>📋 Current Props</div>

          <div style={{ display: "grid", gap: 10 }}>
            {sortedProps.length === 0 ? (
              <div style={{ opacity: 0.8 }}>No props yet.</div>
            ) : (
              sortedProps.map((p) => (
                <button
                  key={p.id}
                  onClick={() => loadIntoForm(p)}
                  style={{
                    textAlign: "left",
                    padding: 12,
                    borderRadius: 12,
                    border: selectedId === p.id ? "1px solid rgba(43,92,255,0.35)" : "1px solid rgba(0,0,0,0.10)",
                    background: selectedId === p.id ? "rgba(43,92,255,0.06)" : "rgba(0,0,0,0.03)",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontWeight: 900 }}>
                    {(p.playerName || "Player") + (p.teamName ? ` (${p.teamName})` : "")}
                    {p.active === false ? <span style={{ marginLeft: 8, opacity: 0.7 }}>(inactive)</span> : null}
                  </div>
                  <div style={{ marginTop: 6, opacity: 0.85, fontSize: 13 }}>
                    <b>{p.statKey || "stat"}</b> O/U <b>{typeof p.line === "number" ? p.line : "—"}</b> · order{" "}
                    <b>{p.order ?? "—"}</b>
                  </div>
                  {p.notes ? <div style={{ marginTop: 6, opacity: 0.75, fontSize: 12 }}>{p.notes}</div> : null}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function inp(): CSSProperties {
  return {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.18)",
    background: "rgba(0,0,0,0.04)",
    outline: "none",
    marginTop: 6,
  };
}
