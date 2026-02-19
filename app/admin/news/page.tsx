"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged, type User } from "firebase/auth";

import { auth, db } from "@/lib/firebase";
import { TOURNAMENT_ID } from "@/lib/tournament";
import { isAdmin } from "@/lib/admin";

type NewsDoc = {
  title?: string;
  body?: string;
  imageUrl?: string; // <-- Firestore-only (no uploads)
  published?: boolean;
  createdAt?: any;
  updatedAt?: any;
};

export default function AdminNewsPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [allowed, setAllowed] = useState<boolean | null>(null);

  const [items, setItems] = useState<Array<{ id: string; data: NewsDoc }>>([]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [published, setPublished] = useState(true);

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const colRef = useMemo(
    () => collection(db, "tournaments", TOURNAMENT_ID, "news"),
    []
  );

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setAllowed(null);
      setMsg("");

      if (!u) {
        setAllowed(false);
        return;
      }

      try {
        const ok = await isAdmin(u.uid);
        setAllowed(!!ok);
      } catch {
        setAllowed(false);
      }
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    if (!allowed) return;

    const qref = query(colRef, orderBy("createdAt", "desc"), limit(50));
    const unsub = onSnapshot(
      qref,
      (snap) => {
        setItems(snap.docs.map((d) => ({ id: d.id, data: d.data() as NewsDoc })));
      },
      (err) => console.error(err)
    );

    return () => unsub();
  }, [allowed, colRef]);

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setBody("");
    setImageUrl("");
    setPublished(true);
  }

  function startEdit(id: string, data: NewsDoc) {
    setEditingId(id);
    setTitle(data.title || "");
    setBody(data.body || "");
    setImageUrl(data.imageUrl || "");
    setPublished(data.published !== false);
    setMsg("");
  }

  function normalizeImageUrl(v: string) {
    const s = (v || "").trim();
    if (!s) return "";
    // Allow relative URLs like /news/photo.jpg, and full URLs.
    return s;
  }

  async function handleSave() {
    setBusy(true);
    setMsg("");
    try {
      const t = title.trim();
      const b = body.trim();
      const img = normalizeImageUrl(imageUrl);

      if (!t && !b && !img) {
        setMsg("Add at least a title, body, or image URL.");
        return;
      }

      if (!editingId) {
        const base: NewsDoc = {
          title: t,
          body: b,
          imageUrl: img || undefined,
          published,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        await addDoc(colRef, base);
        setMsg("✅ News post created.");
        resetForm();
      } else {
        const docRef = doc(db, "tournaments", TOURNAMENT_ID, "news", editingId);

        const patch: Partial<NewsDoc> = {
          title: t,
          body: b,
          imageUrl: img || undefined,
          published,
          updatedAt: serverTimestamp(),
        };

        await updateDoc(docRef, patch as any);
        setMsg("✅ News post updated.");
        resetForm();
      }
    } catch (e) {
      console.error(e);
      setMsg("Error saving. Check Firestore rules + console.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    const ok = window.confirm("Delete this post?");
    if (!ok) return;

    setBusy(true);
    setMsg("");
    try {
      await deleteDoc(doc(db, "tournaments", TOURNAMENT_ID, "news", id));
      setMsg("🗑️ Deleted.");
      if (editingId === id) resetForm();
    } catch (e) {
      console.error(e);
      setMsg("Error deleting. Check rules + console.");
    } finally {
      setBusy(false);
    }
  }

  if (!user) {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui" }}>
        <h1>Admin News</h1>
        <p>Please sign in first.</p>
        <button onClick={() => router.push("/admin")} style={btnStyle()}>
          ← Back to Admin
        </button>
      </main>
    );
  }

  if (allowed === null) {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui" }}>
        <h1>Admin News</h1>
        <p>Checking permissions…</p>
      </main>
    );
  }

  if (!allowed) {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui" }}>
        <h1>Admin News</h1>
        <p>
          <b>Access denied</b> (not an admin).
        </p>
        <button onClick={() => router.push("/")} style={btnStyle()}>
          ← Home
        </button>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui", maxWidth: 980 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0 }}>Admin News ✅</h1>
          <div style={{ marginTop: 6, opacity: 0.75, fontSize: 13 }}>
            Posts publish to <code>/news</code>. Images use <code>imageUrl</code> (no uploads).
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={() => router.push("/admin")} style={btnStyle()}>
            ← Back to Admin
          </button>
          <button
            onClick={() => router.push("/news")}
            style={btnStyle({
              border: "1px solid rgba(43,92,255,0.35)",
              background: "rgba(43,92,255,0.08)",
            })}
          >
            View News →
          </button>
        </div>
      </div>

      <div
        style={{
          marginTop: 16,
          border: "1px solid rgba(0,0,0,0.10)",
          borderRadius: 14,
          padding: 14,
          background: "rgba(0,0,0,0.03)",
        }}
      >
        <div style={{ fontWeight: 900, marginBottom: 10 }}>
          {editingId ? "✏️ Edit Post" : "➕ New Post"}
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            style={inputStyle()}
          />

          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Body text (supports line breaks)"
            rows={6}
            style={inputStyle({ minHeight: 120 })}
          />

          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder='Image URL (example: /news/photo.jpg  or  https://...)'
            style={inputStyle()}
          />

          {imageUrl.trim() ? (
            <div style={{ marginTop: 6 }}>
              <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 6 }}>Preview:</div>
              <img
                src={imageUrl.trim()}
                alt="preview"
                style={{
                  width: "100%",
                  maxWidth: 520,
                  borderRadius: 12,
                  border: "1px solid rgba(0,0,0,0.10)",
                }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          ) : null}

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
              />
              Published (shows on /news)
            </label>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={handleSave} disabled={busy} style={btnStyle({ opacity: busy ? 0.6 : 1 })}>
              {busy ? "Working..." : editingId ? "Save Changes" : "Create Post"}
            </button>

            <button onClick={resetForm} disabled={busy} style={btnStyle({ opacity: busy ? 0.6 : 1 })}>
              Clear
            </button>
          </div>

          {msg ? <div style={{ opacity: 0.85 }}>{msg}</div> : null}
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <div style={{ fontWeight: 900, marginBottom: 10 }}>Posts</div>

        {items.length === 0 ? (
          <div style={{ opacity: 0.75 }}>No posts yet.</div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {items.map(({ id, data }) => (
              <div
                key={id}
                style={{
                  border: "1px solid rgba(0,0,0,0.10)",
                  borderRadius: 14,
                  padding: 12,
                  background: "rgba(0,0,0,0.02)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontWeight: 900 }}>
                      {data.title || "(untitled)"}{" "}
                      <span style={{ fontWeight: 700, opacity: 0.75 }}>
                        — {data.published ? "PUBLISHED" : "DRAFT"}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, opacity: 0.8, marginTop: 6 }}>
                      {data.body ? `${data.body.slice(0, 140)}${data.body.length > 140 ? "…" : ""}` : ""}
                    </div>
                    {data.imageUrl ? (
                      <div style={{ marginTop: 10 }}>
                        <img
                          src={data.imageUrl}
                          alt="news"
                          style={{
                            width: "100%",
                            maxWidth: 520,
                            borderRadius: 12,
                            border: "1px solid rgba(0,0,0,0.10)",
                          }}
                        />
                      </div>
                    ) : null}
                  </div>

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                    <button onClick={() => startEdit(id, data)} disabled={busy} style={btnStyle({ opacity: busy ? 0.6 : 1 })}>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(id)}
                      disabled={busy}
                      style={btnStyle({
                        opacity: busy ? 0.6 : 1,
                        border: "1px solid rgba(194,59,59,0.35)",
                        background: "rgba(194,59,59,0.08)",
                      })}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function btnStyle(extra?: React.CSSProperties): React.CSSProperties {
  return {
    padding: "10px 14px",
    width: "fit-content",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.2)",
    background: "rgba(0,0,0,0.06)",
    cursor: "pointer",
    fontWeight: 800,
    ...extra,
  };
}

function inputStyle(extra?: React.CSSProperties): React.CSSProperties {
  return {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.15)",
    outline: "none",
    ...extra,
  };
}
