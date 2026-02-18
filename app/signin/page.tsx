"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import {
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
} from "firebase/auth";

function safeStorageGet(key: string) {
  try {
    return typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
  } catch {
    return null;
  }
}
function safeStorageSet(key: string, val: string) {
  try {
    if (typeof window !== "undefined") window.localStorage.setItem(key, val);
  } catch {}
}

const EMAIL_KEY = "azhs_emailForSignIn";
const TOURNAMENT_URL = "https://azroadtoopen.com"; // keep as your canonical domain

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const [finishing, setFinishing] = useState(false);

  const hrefNow = useMemo(() => (typeof window !== "undefined" ? window.location.href : ""), []);

  useEffect(() => {
    // If user opened the sign-in email link, complete sign-in
    async function maybeFinish() {
      if (typeof window === "undefined") return;
      const url = window.location.href;

      if (!isSignInWithEmailLink(auth, url)) return;

      setFinishing(true);
      setStatus("");

      try {
        let storedEmail = safeStorageGet(EMAIL_KEY);
        if (!storedEmail) {
          storedEmail = window.prompt("Confirm your email to finish sign-in:") || "";
        }
        if (!storedEmail) {
          setStatus("Email required to finish sign-in.");
          return;
        }

        await signInWithEmailLink(auth, storedEmail, url);
        safeStorageSet(EMAIL_KEY, ""); // clear
        setStatus("✅ Signed in! Redirecting…");
        window.location.href = "/"; // back home
      } catch (e: any) {
        setStatus(`Sign-in failed: ${e?.message ?? String(e)}`);
      } finally {
        setFinishing(false);
      }
    }

    maybeFinish();
  }, []);

  async function sendLink() {
    setStatus("");
    if (!email.trim()) {
      setStatus("Please enter your email.");
      return;
    }

    setSending(true);
    try {
      // This URL is where the email link will send the user back to:
      // Keep it on your domain and point it to this same page.
      const actionCodeSettings = {
        url: `${TOURNAMENT_URL}/signin`,
        handleCodeInApp: true,
      };

      await sendSignInLinkToEmail(auth, email.trim(), actionCodeSettings);
      safeStorageSet(EMAIL_KEY, email.trim());
      setStatus("✅ Email sent! Open it and tap the sign-in link to finish.");
    } catch (e: any) {
      setStatus(`Could not send email link: ${e?.message ?? String(e)}`);
    } finally {
      setSending(false);
    }
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui", color: "#fff" }}>
      <div
        style={{
          maxWidth: 620,
          margin: "0 auto",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 16,
          background: "rgba(0,0,0,0.35)",
          padding: 18,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <h1 style={{ margin: 0, fontSize: 28 }}>Sign in</h1>
          <Link href="/" style={{ color: "#fff", textDecoration: "underline", opacity: 0.9 }}>
            ← Back
          </Link>
        </div>

        <p style={{ opacity: 0.8, marginTop: 8 }}>
          This method works inside Instagram/Snapchat browsers.
          We’ll email you a secure sign-in link.
        </p>

        <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            inputMode="email"
            autoComplete="email"
            style={{
              padding: "12px 12px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.18)",
              background: "rgba(0,0,0,0.25)",
              color: "#fff",
              outline: "none",
              fontWeight: 650,
            }}
            disabled={sending || finishing}
          />

          <button
            onClick={sendLink}
            disabled={sending || finishing}
            style={{
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid rgba(120,180,255,0.45)",
              background: "rgba(120,180,255,0.12)",
              color: "#fff",
              fontWeight: 800,
              cursor: sending || finishing ? "not-allowed" : "pointer",
            }}
          >
            {sending ? "Sending…" : "Email me a sign-in link"}
          </button>
        </div>

        {status ? (
          <div style={{ marginTop: 12, opacity: 0.9, lineHeight: "18px" }}>{status}</div>
        ) : null}

        <div style={{ marginTop: 14, opacity: 0.65, fontSize: 12, lineHeight: "18px" }}>
          Tip: after tapping the email link, if it opens in a browser that isn’t signed in,
          just paste the link into the same browser where you started.
        </div>
      </div>
    </main>
  );
}
