// interactive leaderboard for the Over Under player props, with a link to the main bracket
// this leader board will be separate from the main bracket leaderboard, and will only include players who have made over/under predictions on the featured players in the finals


"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { TOURNAMENT_ID } from "@/lib/tournament";

type PropsLeaderboardDoc = {
  userId?: string;
  displayName?: string;
  picks?: Record<string, "over" | "under">;
  updatedAt?: any;
  createdAt?: any;
};

function fmtTime(ts: any) {
  try {
    if (!ts) return "";
    if (typeof ts?.toDate === "function") return ts.toDate().toLocaleString();
    return String(ts);
  } catch {
    return "";
  }
}

async function copyToClipboard(text: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.left = "-9999px";
  ta.style.top = "-9999px";
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(ta);
  if (!ok) throw new Error("copy failed");
}

export default function PlayerPropsLeaderboardPage() {
  const [items, setItems] = useState<(PropsLeaderboardDoc & { id: string })[]>([]);
  const [msg, setMsg] = useState("");
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const ref = collection(db, "tournaments", TOURNAMENT_ID, "playerPropLeaderboard");
    const unsub = onSnapshot(
      ref,
      (snap) => {
        setItems(
          snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as PropsLeaderboardDoc),
          }))
        );
      },
      (err) => {
        console.error(err);
        setMsg("Error loading props leaderboard. Check rules/console.");
      }
    );

    return () => unsub();
  }, []);

  const rows = useMemo(() => {
    const base = items.map((u) => {
      const picks = u.picks || {};
      const pickCount = Object.keys(picks).length;

      return {
        id: u.id,
        displayName: u.displayName || u.userId || u.id,
        pickCount,
        updatedAt: u.updatedAt,
        createdAt: u.createdAt,
      };
    });

    base.sort((a, b) => {
      if (b.pickCount !== a.pickCount) return b.pickCount - a.pickCount;

      // tie-break: earlier update wins (like bracket leaderboard)
      const at = a.updatedAt?.seconds ?? a.createdAt?.seconds ?? 0;
      const bt = b.updatedAt?.seconds ?? b.createdAt?.seconds ?? 0;
      return at - bt;
    });

    const q = query.trim().toLowerCase();
    if (!q) return base;

    return base.filter((r) => {
      const name = (r.displayName || "").toLowerCase();
      const id = (r.id || "").toLowerCase();
      return name.includes(q) || id.includes(q);
    });
  }, [items, query]);

  async function handleCopyLink(uid: string) {
    try {
      const url = `${window.location.origin}/player-props/leaderboard/${encodeURIComponent(uid)}`;
      await copyToClipboard(url);
      setCopiedId(uid);
      window.setTimeout(() => setCopiedId(null), 1400);
    } catch (e) {
      console.error(e);
      alert("Copy failed. Try again.");
    }
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui", color: "#fff" }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
          <h1 style={{ margin: 0 }}>Player Props Leaderboard</h1>
          <span style={{ opacity: 0.7 }}>(ranked by picks made)</span>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link
            href="/player-props"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.28)",
              background: "rgba(0,0,0,0.28)",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 750,
              letterSpacing: 0.2,
            }}
          >
            ← Player Props
          </Link>

          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.28)",
              background: "rgba(0,0,0,0.28)",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 750,
              letterSpacing: 0.2,
            }}
          >
            ← Home
          </Link>
        </div>
      </div>

      <div
        style={{
          marginTop: 12,
          display: "flex",
          gap: 10,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a friend (name or id)…"
          style={{
            flex: "1 1 360px",
            padding: "10px 12px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.20)",
            background: "rgba(0,0,0,0.25)",
            color: "#fff",
            outline: "none",
            fontWeight: 650,
          }}
        />
        <button
          type="button"
          onClick={() => setQuery("")}
          disabled={!query}
          style={{
            padding: "10px 12px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.22)",
            background: "rgba(255,255,255,0.06)",
            color: "#fff",
            cursor: query ? "pointer" : "not-allowed",
            opacity: query ? 1 : 0.5,
            fontWeight: 750,
          }}
        >
          Clear
        </button>
      </div>

      {msg ? <div style={{ marginTop: 12, color: "#ffb4b4" }}>{msg}</div> : null}

      <div
        style={{
          marginTop: 16,
          border: "1px solid #222",
          borderRadius: 14,
          background: "rgba(0,0,0,0.25)",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: 14, borderBottom: "1px solid #1d1d1d" }}>
          <div style={{ opacity: 0.75 }}>
            Entries: <b>{items.length}</b> &nbsp;|&nbsp; Showing: <b>{rows.length}</b>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 860 }}>
            <thead>
              <tr style={{ textAlign: "left", opacity: 0.8 }}>
                <th style={{ padding: "12px 14px" }}>Rank</th>
                <th style={{ padding: "12px 14px" }}>Name</th>
                <th style={{ padding: "12px 14px" }}>Picks Made</th>
                <th style={{ padding: "12px 14px" }}>Last Updated</th>
                <th style={{ padding: "12px 14px" }}>Picks</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r, idx) => (
                <tr key={r.id} style={{ borderTop: "1px solid #1d1d1d" }}>
                  <td style={{ padding: "12px 14px", opacity: 0.85 }}>{idx + 1}</td>
                  <td style={{ padding: "12px 14px", fontWeight: 650 }}>{r.displayName}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <b>{r.pickCount}</b>
                  </td>
                  <td style={{ padding: "12px 14px", opacity: 0.7 }}>
                    {fmtTime(r.updatedAt || r.createdAt)}
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
                      <Link
                        href={`/player-props/leaderboard/${encodeURIComponent(r.id)}`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "8px 10px",
                          borderRadius: 10,
                          border: "1px solid rgba(255,255,255,0.22)",
                          background: "rgba(255,255,255,0.06)",
                          color: "#fff",
                          textDecoration: "none",
                          fontWeight: 650,
                          fontSize: 13,
                          letterSpacing: 0.2,
                          whiteSpace: "nowrap",
                        }}
                      >
                        View
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleCopyLink(r.id)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "8px 10px",
                          borderRadius: 10,
                          border:
                            copiedId === r.id
                              ? "1px solid rgba(124,255,124,0.65)"
                              : "1px solid rgba(43,92,255,0.55)",
                          background:
                            copiedId === r.id
                              ? "rgba(124,255,124,0.10)"
                              : "rgba(43,92,255,0.12)",
                          color: copiedId === r.id ? "#b7ffb7" : "#cfe0ff",
                          cursor: "pointer",
                          fontWeight: 650,
                          fontSize: 13,
                          letterSpacing: 0.2,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {copiedId === r.id ? "Copied!" : "Copy Link"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: 16, opacity: 0.75 }}>
                    No results. Try a different search.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: 16, opacity: 0.7 }}>
        Tip: Share your picks link and see who’s really locked in.
      </div>
    </main>
  );
}