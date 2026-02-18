// use this page to view/fix user entries that are missing picks (ex: 30/31 bug where championship pick is missing)
"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { auth, db } from "../../../lib/firebase";
import { isAdmin } from "../../../lib/admin";
import { TOURNAMENT_ID } from "../../../lib/tournament";
import { listTeams, type Team } from "../../../lib/teams";
import { roundGameCount } from "../../../lib/games";

type DocPath = readonly [string, ...string[]];

type AdminCheckResult = {
  allowed: boolean;
  source: string;
  note?: string;
};

type EntryRow = {
  id: string; // uid/doc id
  displayName?: string;
  locked?: boolean;
  lockedAt?: any;
  createdAt?: any;
  picks?: Record<string, string>;
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
  try {
    const ok = await isAdmin(u.uid);
    if (ok) return { allowed: true, source: "lib/isAdmin(uid)" };
  } catch {
    // continue
  }

  const uidPaths: Array<{ path: DocPath; label: string }> = [
    { path: ["admins", u.uid], label: "admins/{uid}" },
    { path: ["users", u.uid], label: "users/{uid}" },
    { path: ["tournaments", TOURNAMENT_ID, "admins", u.uid], label: "tournaments/{id}/admins/{uid}" },
  ];

  for (const p of uidPaths) {
    const snap = await safeGetDoc(p.path);
    if (snap?.exists() && dataSaysAdmin(snap.data())) return { allowed: true, source: p.label };
    if (snap?.exists() && snap.data() && Object.keys(snap.data()).length === 0) {
      return { allowed: true, source: `${p.label} (exists)` };
    }
  }

  if (u.email) {
    const email = u.email.toLowerCase();
    const emailPaths: Array<{ path: DocPath; label: string }> = [
      { path: ["admins", email], label: "admins/{email}" },
      { path: ["tournaments", TOURNAMENT_ID, "admins", email], label: "tournaments/{id}/admins/{email}" },
      { path: ["adminsByEmail", email], label: "adminsByEmail/{email}" },
    ];

    for (const p of emailPaths) {
      const snap = await safeGetDoc(p.path);
      if (snap?.exists() && dataSaysAdmin(snap.data())) return { allowed: true, source: p.label };
      if (snap?.exists() && snap.data() && Object.keys(snap.data()).length === 0) {
        return { allowed: true, source: `${p.label} (exists)` };
      }
      // adminsByEmail uses enabled:true convention
      if (snap?.exists() && snap.data()?.enabled === true) return { allowed: true, source: p.label };
    }
  }

  return { allowed: false, source: "no admin match" };
}

function buildRequiredPickKeys(): string[] {
  // Assumes your rounds are 1..5 and roundGameCount(r) returns counts like 16,8,4,2,1
  const keys: string[] = [];
  for (let r = 1; r <= 5; r++) {
    const n = roundGameCount(r);
    for (let g = 1; g <= n; g++) {
      keys.push(`R${r}G${g}`);
    }
  }
  return keys;
}

function getSuggestedCandidates(
  key: string,
  picks: Record<string, string | undefined>
): string[] {
  // For RxGy, suggested = winners of previous round games feeding into this game.
  // Game g in round r comes from prev round games: (2g-1) and (2g)
  const m = key.match(/^R(\d+)G(\d+)$/);
  if (!m) return [];
  const r = parseInt(m[1], 10);
  const g = parseInt(m[2], 10);
  if (r <= 1) return [];

  const prev = r - 1;
  const g1 = 2 * g - 1;
  const g2 = 2 * g;

  const a = picks[`R${prev}G${g1}`];
  const b = picks[`R${prev}G${g2}`];

  const out: string[] = [];
  if (a) out.push(a);
  if (b && b !== a) out.push(b);
  return out;
}

export default function AdminEntriesPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [allowSource, setAllowSource] = useState<string>("");
  const [permNote, setPermNote] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const [teams, setTeams] = useState<Team[]>([]);
  const [entries, setEntries] = useState<EntryRow[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");

  const [draftPicks, setDraftPicks] = useState<Record<string, string>>({});

  const requiredKeys = useMemo(() => buildRequiredPickKeys(), []);
  const requiredCount = requiredKeys.length; // should be 31

  const teamOptions = useMemo(() => {
    // ensure stable sorting (by name if you have it, else by id)
    const copy = [...teams];
    copy.sort((a: any, b: any) => {
      const an = (a.name ?? a.id ?? "").toString().toLowerCase();
      const bn = (b.name ?? b.id ?? "").toString().toLowerCase();
      return an.localeCompare(bn);
    });
    return copy;
  }, [teams]);

  const selectedEntry = useMemo(
    () => entries.find((e) => e.id === selectedId) || null,
    [entries, selectedId]
  );

  const missingKeys = useMemo(() => {
    const p = draftPicks || {};
    return requiredKeys.filter((k) => !p[k] || String(p[k]).trim() === "");
  }, [draftPicks, requiredKeys]);

  const searchLabel = useMemo(() => {
    const e = selectedEntry;
    if (!e) return "";
    return e.displayName ? `${e.displayName} (${e.id})` : e.id;
  }, [selectedEntry]);

  async function refreshPermissions(u: User) {
    setAllowed(null);
    setAllowSource("");
    setPermNote("");
    const res = await checkAdmin(u);
    setAllowed(res.allowed);
    setAllowSource(res.source);
    setPermNote(res.note ?? "");
  }

  async function loadAll() {
    setLoading(true);
    setMsg("");

    try {
      const [t, esnap] = await Promise.all([
        listTeams(),
        getDocs(collection(db, "tournaments", TOURNAMENT_ID, "entries")),
      ]);

      setTeams(t);

      const rows: EntryRow[] = [];
      esnap.forEach((d) => {
        const data = d.data() as any;
        rows.push({
          id: d.id,
          displayName: data.displayName,
          locked: data.locked,
          lockedAt: data.lockedAt,
          createdAt: data.createdAt,
          picks: (data.picks ?? {}) as Record<string, string>,
        });
      });

      // sort: locked first, then missing count desc, then name/id
      rows.sort((a, b) => {
        const am = countMissing(a.picks ?? {}, requiredKeys);
        const bm = countMissing(b.picks ?? {}, requiredKeys);
        if ((a.locked ? 1 : 0) !== (b.locked ? 1 : 0)) return (b.locked ? 1 : 0) - (a.locked ? 1 : 0);
        if (am !== bm) return bm - am;
        const an = (a.displayName ?? a.id).toLowerCase();
        const bn = (b.displayName ?? b.id).toLowerCase();
        return an.localeCompare(bn);
      });

      setEntries(rows);

      if (!selectedId && rows.length > 0) {
        setSelectedId(rows[0].id);
        setDraftPicks({ ...(rows[0].picks ?? {}) });
      }
    } catch (e) {
      console.error(e);
      setMsg("Failed to load entries/teams. Check console + rules.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setMsg("");

      if (!u) {
        setAllowed(false);
        setLoading(false);
        return;
      }

      await refreshPermissions(u);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    if (allowed) {
      void loadAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowed]);

  useEffect(() => {
    // whenever selected entry changes, load picks into draft
    const e = entries.find((x) => x.id === selectedId);
    if (!e) return;
    setDraftPicks({ ...(e.picks ?? {}) });
  }, [selectedId, entries]);

  function setPick(key: string, value: string) {
    setDraftPicks((prev) => ({ ...prev, [key]: value }));
  }

  async function saveEdits() {
    if (!user || !selectedEntry) return;
    setBusy(true);
    setMsg("");

    try {
      const ref = doc(db, "tournaments", TOURNAMENT_ID, "entries", selectedEntry.id);

      // Only update picks + admin audit fields (non-breaking)
      await updateDoc(ref, {
        picks: draftPicks,
        adminEditedAt: serverTimestamp(),
        adminEditedBy: user.uid,
      });

      setMsg("Saved ✅");

      // refresh local row
      setEntries((prev) =>
        prev.map((r) => (r.id === selectedEntry.id ? { ...r, picks: { ...draftPicks } } : r))
      );
    } catch (e: any) {
      console.error(e);
      setMsg(`Save failed: ${e?.message ?? String(e)}`);
    } finally {
      setBusy(false);
      setTimeout(() => setMsg(""), 2500);
    }
  }

  const buttonStyle: React.CSSProperties = {
    padding: "10px 14px",
    width: "fit-content",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.2)",
    background: "rgba(0,0,0,0.06)",
    cursor: "pointer",
    fontWeight: 700,
  };

  const dangerStyle: React.CSSProperties = {
    ...buttonStyle,
    border: "1px solid rgba(220,60,60,0.35)",
    background: "rgba(220,60,60,0.08)",
  };

  const okStyle: React.CSSProperties = {
    ...buttonStyle,
    border: "1px solid rgba(43,92,255,0.35)",
    background: "rgba(43,92,255,0.08)",
  };

  if (!user) {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui" }}>
        <h1>Fix User Entries</h1>
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
        <h1>Fix User Entries</h1>
        <p>Checking permissions…</p>
      </main>
    );
  }

  if (!allowed) {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui" }}>
        <h1>Fix User Entries</h1>
        <p>
          <b>Access denied</b> (not an admin).
        </p>
        <div style={{ marginTop: 10, opacity: 0.85, fontSize: 13 }}>
          Admin check source: <code>{allowSource || "n/a"}</code>
          {permNote ? <div style={{ marginTop: 8 }}>{permNote}</div> : null}
        </div>
        <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={() => router.push("/admin")} style={buttonStyle}>
            ← Admin Home
          </button>
          <button onClick={() => router.push("/")} style={buttonStyle}>
            ← Site Home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Fix User Entries ✅</h1>
          <p style={{ marginTop: 8, opacity: 0.85 }}>
            Select an entry, fill missing picks (keys like <code>R5G1</code>), and save.
          </p>
          <div style={{ fontSize: 13, opacity: 0.75 }}>
            Admin check source: <code>{allowSource}</code> · Required picks: <b>{requiredCount}</b>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={() => router.push("/admin")} style={buttonStyle}>
            ← Admin Home
          </button>
          <button onClick={loadAll} disabled={loading || busy} style={buttonStyle}>
            {loading ? "Loading..." : "Reload"}
          </button>
        </div>
      </div>

      {msg ? (
        <div style={{ marginTop: 10, opacity: 0.9 }}>
          {msg}
        </div>
      ) : null}

      <div
        style={{
          marginTop: 16,
          display: "grid",
          gridTemplateColumns: "360px 1fr",
          gap: 14,
          alignItems: "start",
        }}
      >
        {/* LEFT: Entries list */}
        <section
          style={{
            border: "1px solid rgba(0,0,0,0.12)",
            borderRadius: 14,
            padding: 12,
            background: "rgba(0,0,0,0.03)",
            maxHeight: "72vh",
            overflow: "auto",
          }}
        >
          <div style={{ fontWeight: 800, marginBottom: 10 }}>Entries</div>

          {loading ? (
            <div style={{ opacity: 0.7 }}>Loading…</div>
          ) : entries.length === 0 ? (
            <div style={{ opacity: 0.7 }}>No entries found.</div>
          ) : (
            <div style={{ display: "grid", gap: 8 }}>
              {entries.map((e) => {
                const miss = countMissing(e.picks ?? {}, requiredKeys);
                const isSelected = e.id === selectedId;

                return (
                  <button
                    key={e.id}
                    onClick={() => setSelectedId(e.id)}
                    style={{
                      textAlign: "left",
                      borderRadius: 12,
                      padding: 10,
                      border: isSelected ? "1px solid rgba(43,92,255,0.55)" : "1px solid rgba(0,0,0,0.12)",
                      background: isSelected ? "rgba(43,92,255,0.08)" : "rgba(255,255,255,0.6)",
                      cursor: "pointer",
                    }}
                    title={e.id}
                  >
                    <div style={{ fontWeight: 800, lineHeight: "18px" }}>
                      {e.displayName || "Unknown"}{" "}
                      {e.locked ? <span style={{ opacity: 0.75 }}>· locked</span> : <span style={{ opacity: 0.75 }}>· unlocked</span>}
                    </div>
                    <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>
                      Missing: <b>{miss}</b> / {requiredCount}
                    </div>
                    <div style={{ fontSize: 11, opacity: 0.65, marginTop: 4 }}>
                      {e.id}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* RIGHT: Editor */}
        <section
          style={{
            border: "1px solid rgba(0,0,0,0.12)",
            borderRadius: 14,
            padding: 14,
            background: "rgba(255,255,255,0.6)",
            minHeight: 280,
          }}
        >
          {!selectedEntry ? (
            <div style={{ opacity: 0.7 }}>Select an entry on the left.</div>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontWeight: 900, fontSize: 16 }}>{searchLabel}</div>
                  <div style={{ fontSize: 13, opacity: 0.75, marginTop: 4 }}>
                    Doc: <code>tournaments/{TOURNAMENT_ID}/entries/{selectedEntry.id}</code>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                  <div style={{ fontSize: 13, opacity: 0.75 }}>
                    Missing: <b>{missingKeys.length}</b> / {requiredCount}
                  </div>
                  <button
                    onClick={saveEdits}
                    disabled={busy}
                    style={{ ...okStyle, opacity: busy ? 0.6 : 1 }}
                  >
                    {busy ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </div>

              <div style={{ marginTop: 14, borderTop: "1px solid rgba(0,0,0,0.10)", paddingTop: 14 }}>
                {missingKeys.length === 0 ? (
                  <div style={{ opacity: 0.8 }}>
                    ✅ This entry already has all {requiredCount} picks.
                  </div>
                ) : (
                  <>
                    <div style={{ fontWeight: 800, marginBottom: 10 }}>
                      Missing picks (fill these)
                    </div>

                    <div style={{ display: "grid", gap: 12 }}>
                      {missingKeys.map((key) => {
                        const suggestions = getSuggestedCandidates(key, draftPicks);
                        return (
                          <div
                            key={key}
                            style={{
                              border: "1px solid rgba(0,0,0,0.10)",
                              borderRadius: 12,
                              padding: 12,
                              background: "rgba(0,0,0,0.02)",
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                              <div style={{ fontWeight: 900 }}>
                                {key}
                                <span style={{ fontWeight: 600, opacity: 0.65, marginLeft: 8 }}>
                                  (ex: Championship is usually <code>R5G1</code>)
                                </span>
                              </div>

                              <button
                                onClick={() => {
                                  setDraftPicks((prev) => {
                                    const copy = { ...prev };
                                    delete copy[key];
                                    return copy;
                                  });
                                }}
                                style={{ ...dangerStyle, padding: "8px 10px" }}
                                title="Clear this pick"
                              >
                                Clear
                              </button>
                            </div>

                            {suggestions.length > 0 ? (
                              <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                                <span style={{ fontSize: 12, opacity: 0.75, alignSelf: "center" }}>
                                  Suggested:
                                </span>
                                {suggestions.map((s) => (
                                  <button
                                    key={s}
                                    onClick={() => setPick(key, s)}
                                    style={{
                                      ...okStyle,
                                      padding: "8px 10px",
                                    }}
                                  >
                                    {s}
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <div style={{ marginTop: 10, fontSize: 12, opacity: 0.7 }}>
                                (No suggestions available yet — earlier round picks may also be missing.)
                              </div>
                            )}

                            <div style={{ marginTop: 10 }}>
                              <label style={{ fontSize: 12, opacity: 0.75 }}>
                                Set winner (team slug)
                              </label>
                              <select
                                value={draftPicks[key] ?? ""}
                                onChange={(e) => setPick(key, e.target.value)}
                                style={{
                                  width: "100%",
                                  marginTop: 6,
                                  padding: "10px 10px",
                                  borderRadius: 10,
                                  border: "1px solid rgba(0,0,0,0.18)",
                                  background: "white",
                                  fontWeight: 700,
                                }}
                              >
                                <option value="">Select a team…</option>
                                {teamOptions.map((t: any) => {
                                  const slug = (t.id ?? t.slug ?? "").toString();
                                  const name = (t.name ?? slug).toString();
                                  return (
                                    <option key={slug} value={slug}>
                                      {name} ({slug})
                                    </option>
                                  );
                                })}
                              </select>
                              <div style={{ marginTop: 6, fontSize: 11, opacity: 0.7 }}>
                                Stored value will be the slug (example: <code>sunnyslope-vikings</code>)
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </section>
      </div>

      <div style={{ marginTop: 14, fontSize: 12, opacity: 0.75 }}>
        Tip: For a typical “30/31” bug, the missing key is often <code>R5G1</code> (championship winner).
      </div>
    </main>
  );
}

function countMissing(picks: Record<string, string>, requiredKeys: string[]) {
  let miss = 0;
  for (const k of requiredKeys) {
    const v = picks?.[k];
    if (!v || String(v).trim() === "") miss++;
  }
  return miss;
}

// AZ High School Bracket - Admin tools
// Created by Charles Richards 2026
