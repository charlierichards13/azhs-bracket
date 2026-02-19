"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { TOURNAMENT_ID } from "@/lib/tournament";

type NewsDoc = {
  title?: string;
  body?: string;
  imageUrl?: string;
  published?: boolean;
  createdAt?: any; // Firestore Timestamp
};

function tsToDateMaybe(v: any): Date | null {
  try {
    if (!v) return null;
    if (v instanceof Date) return v;
    if (typeof v?.toDate === "function") return v.toDate();
    return null;
  } catch {
    return null;
  }
}

function formatPhoenix(d: Date) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Phoenix",
      dateStyle: "medium",
      timeStyle: "short",
    }).format(d);
  } catch {
    return d.toLocaleString();
  }
}

export default function NewsPage() {
  const [items, setItems] = useState<Array<{ id: string; data: NewsDoc }>>([]);

  const colRef = useMemo(
    () => collection(db, "tournaments", TOURNAMENT_ID, "news"),
    []
  );

  useEffect(() => {
    const qref = query(colRef, orderBy("createdAt", "desc"), limit(50));
    const unsub = onSnapshot(
      qref,
      (snap) => {
        const all = snap.docs.map((d) => ({ id: d.id, data: d.data() as NewsDoc }));
        // ✅ Only show published posts to normal users
        setItems(all.filter((x) => x.data.published !== false));
      },
      (err) => console.error(err)
    );

    return () => unsub();
  }, [colRef]);

  return (
    <main style={{ padding: 28, color: "#fff", display: "flex", justifyContent: "center" }}>
      <div
        style={{
          width: "100%",
          maxWidth: 980,
          borderRadius: 18,
          border: "1px solid rgba(255,255,255,0.10)",
          background: "rgba(0,0,0,0.35)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
          padding: 18,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 26, letterSpacing: 0.2 }}>📰 News</h1>
            <div style={{ opacity: 0.75, marginTop: 6 }}>
              Tournament updates, results, and announcements.
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <Link
              href="/"
              style={{
                borderRadius: 12,
                padding: "10px 14px",
                border: "1px solid rgba(255,255,255,0.28)",
                textDecoration: "none",
                color: "#fff",
                fontWeight: 800,
                background: "rgba(0,0,0,0.22)",
              }}
            >
              ← Home
            </Link>
          </div>
        </div>

        <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
          {items.length === 0 ? (
            <div
              style={{
                opacity: 0.75,
                padding: 14,
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              No news posts yet.
            </div>
          ) : (
            items.map(({ id, data }) => {
              const dt = tsToDateMaybe(data.createdAt);

              return (
                <article
                  key={id}
                  style={{
                    borderRadius: 16,
                    border: "1px solid rgba(255,255,255,0.10)",
                    background: "rgba(255,255,255,0.04)",
                    padding: 14,
                    boxShadow: "0 14px 35px rgba(0,0,0,0.30)",
                  }}
                >
                  <div style={{ fontWeight: 900, fontSize: 18 }}>
                    {data.title || "Update"}
                  </div>

                  {dt ? (
                    <div style={{ marginTop: 4, opacity: 0.65, fontSize: 12 }}>
                      {formatPhoenix(dt)} (Phoenix)
                    </div>
                  ) : null}

                  {data.imageUrl ? (
                    <img
                      src={data.imageUrl}
                      alt={data.title || "news image"}
                      style={{
                        width: "100%",
                        maxWidth: 860,
                        marginTop: 12,
                        borderRadius: 14,
                        border: "1px solid rgba(255,255,255,0.10)",
                        display: "block",
                      }}
                      onError={(e) => {
                        // hide broken image URLs
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : null}

                  {data.body ? (
                    <div
                      style={{
                        marginTop: 12,
                        opacity: 0.86,
                        lineHeight: "22px",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {data.body}
                    </div>
                  ) : null}
                </article>
              );
            })
          )}
        </div>

        <div style={{ marginTop: 16, textAlign: "center", opacity: 0.55, fontSize: 12 }}>
          Unofficial. Not affiliated with AIA.
        </div>
      </div>
    </main>
  );
}
