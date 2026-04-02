

// final version of home page after tourney concluded
// app created by charles richards 2026 ASU cs student


"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";

const TOURNAMENT_START_ISO = "2026-02-18T19:00:00-07:00";
const SEMIFINALS_ISO = "2026-03-04T20:00:00-07:00";
const FINALS_ISO = "2026-03-07T20:00:00-07:00";
const GAME_BLOCK_DURATION_HOURS = 2;

function isInAppBrowser() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return (
    /Snapchat/i.test(ua) ||
    /Instagram/i.test(ua) ||
    /FBAN|FBAV/i.test(ua) ||
    /TikTok/i.test(ua)
  );
}

function isIOS() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return /iPhone|iPad|iPod/i.test(ua);
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const [status, setStatus] = useState("");

  const tournamentStart = useMemo(() => new Date(TOURNAMENT_START_ISO), []);
  const semifinals = useMemo(() => new Date(SEMIFINALS_ISO), []);
  const finals = useMemo(() => new Date(FINALS_ISO), []);

  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(0);

  const [inApp, setInApp] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setInApp(isInAppBrowser());
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setChecking(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    setMounted(true);
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const nowMs = mounted ? now : Date.now();
  const durMs = GAME_BLOCK_DURATION_HOURS * 60 * 60 * 1000;

  const tournamentStartPhoenixText = useMemo(
    () => (mounted ? formatPhoenix(tournamentStart) : "Loading…"),
    [mounted, tournamentStart]
  );

  const semifinalsPhoenixText = useMemo(
    () => (mounted ? formatPhoenix(semifinals) : "Loading…"),
    [mounted, semifinals]
  );

  const finalsPhoenixText = useMemo(
    () => (mounted ? formatPhoenix(finals) : "Loading…"),
    [mounted, finals]
  );

  const semiStartMs = semifinals.getTime();
  const semiEndMs = semiStartMs + durMs;
  const semiLive = nowMs >= semiStartMs && nowMs < semiEndMs;
  const semiDone = nowMs >= semiEndMs;

  const semiDiffMs = semiStartMs - nowMs;
  const semiSafeMs = Math.max(0, semiDiffMs);
  const semiCd = formatCountdown(semiSafeMs);

  const semiClockText = mounted
    ? `${semiCd.days}d ${semiCd.hours}h ${semiCd.minutes}m ${semiCd.seconds}s`
    : "Loading countdown…";

  const semifinalsBadge = semiLive
    ? ({ type: "live", text: "LIVE" } as const)
    : semiDone
      ? ({ type: "done", text: "DONE" } as const)
      : null;

  const semifinalsLines = semiDone
    ? [`Semifinals (Phoenix): ${semifinalsPhoenixText}`, "Semifinals are complete."]
    : semiLive
      ? [
          "Semifinals are LIVE right now.",
          `Started (Phoenix): ${formatPhoenix(semifinals)}`,
          `Approx. end (Phoenix): ${formatPhoenix(new Date(semiEndMs))}`,
        ]
      : [`Semifinals (Phoenix): ${semifinalsPhoenixText}`, semiClockText];

  const finalsStartMs = finals.getTime();
  const finalsEndMs = finalsStartMs + durMs;
  const finalsLive = nowMs >= finalsStartMs && nowMs < finalsEndMs;
  const finalsDone = nowMs >= finalsEndMs;

  const finalsDiffMs = finalsStartMs - nowMs;
  const finalsSafeMs = Math.max(0, finalsDiffMs);
  const finalsCd = formatCountdown(finalsSafeMs);

  const finalsClockText = mounted
    ? `${finalsCd.days}d ${finalsCd.hours}h ${finalsCd.minutes}m ${finalsCd.seconds}s`
    : "Loading countdown…";

  const finalsBadge = finalsLive
    ? ({ type: "live", text: "LIVE" } as const)
    : finalsDone
      ? ({ type: "done", text: "COMPLETE" } as const)
      : null;

  const finalsLines = finalsDone
    ? [`Finals (Phoenix): ${finalsPhoenixText}`, "Sunnyslope wins the championship! Congrats to all the teams on an amazing season. Thanks for playing!"]
    : finalsLive
      ? [
          "Finals are LIVE right now.",
          `Started (Phoenix): ${formatPhoenix(finals)}`,
          `Approx. end (Phoenix): ${formatPhoenix(new Date(finalsEndMs))}`,
        ]
      : [`Finals (Phoenix): ${finalsPhoenixText}`, finalsClockText];

  async function doGoogleSignIn() {
    setStatus("");
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (e: any) {
      setStatus(`Sign-in failed: ${e?.message ?? String(e)}`);
    }
  }

  async function doSignOut() {
    setStatus("");
    try {
      await signOut(auth);
    } catch (e: any) {
      setStatus(`Sign-out failed: ${e?.message ?? String(e)}`);
    }
  }

  async function copyLink() {
    try {
      const url =
        typeof window !== "undefined" ? window.location.href : "https://azroadtoopen.com";
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setStatus("Link copied! Paste it into Safari/Chrome.");
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setStatus("Could not copy link here. Try selecting the URL and copying manually.");
    }
  }

  const inAppHelpText = useMemo(() => {
    if (!inApp) return null;
    const ios = isIOS();
    return ios
      ? `You're in an in-app browser (Snap/IG). Sign-in is disabled here. Tap “Open in Browser”. If it doesn’t open with one tap, press-and-hold the button/link and choose “Open in Safari”, or use the Share icon → “Open in Safari”.`
      : `You're in an in-app browser (Snap/IG). Sign-in is disabled here. Tap “Open in Browser”. If it doesn’t open with one tap, press-and-hold the button/link and choose “Open in browser” (Chrome).`;
  }, [inApp]);

  const tournamentStarted = nowMs >= tournamentStart.getTime();

  return (
    <main className="wrap">
      <div className="stage">
        <div className="bgSpotlights" aria-hidden="true" />
        <div className="bgVignette" aria-hidden="true" />

        <header className="hero">
          <div className="topRow">
            <div className="brand">
              <img
                className="brandLogo"
                src="/brand/azroadtoopen.png"
                alt="AZ Road to Open"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />

              <div className="brandText">
                <div className="title">AZ Road to Open Tournament Competition</div>

                <div className="aiaStripe" aria-hidden="true" />

                <div className="subtitle">
                  Predict the matchups between the top teams in Arizona high school basketball,
                  and who will take home the trophy. Fill out your bracket and compete against
                  others to see who can have the most accurate bracket.
                </div>
              </div>
            </div>

            <div className="ballCol">
              <SpinningBasketball />
            </div>
          </div>

          {inApp ? (
            <section className="inAppBanner">
              <div className="inAppTitle">⚠️ In-app browser detected</div>
              <div className="inAppText">{inAppHelpText}</div>

              <div className="inAppActions">
                <a
                  className="hbtn hbtnBlue"
                  href="https://azroadtoopen.com"
                  target="_blank"
                  rel="noreferrer"
                  title="Open in a full browser"
                >
                  Open in Browser
                </a>

                <button className="hbtn hbtnGhost" onClick={copyLink}>
                  {copied ? "Copied!" : "Copy Link"}
                </button>
              </div>
            </section>
          ) : null}

          <section className="panel">
            {checking ? (
              <div className="muted">Loading…</div>
            ) : user ? (
              <>
                <div className="signedIn">
                  <div className="muted">Signed in as</div>
                  <div className="who">{user.displayName ?? user.email ?? "User"}</div>
                  {user.email ? <div className="muted">{user.email}</div> : null}
                </div>

                <div className="btnRow">
                  <Link className="hbtn hbtnBlue" href="/my-bracket">
                    My Bracket
                  </Link>

                  <Link className="hbtn hbtnGold" href="/bracket">
                    Live Bracket
                  </Link>

                  <Link className="hbtn hbtnRed" href="/leaderboard">
                    Leaderboard
                  </Link>

                  <button className="hbtn hbtnGhost" onClick={doSignOut}>
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="signedOut">
                  <div className="muted">
                    Sign in to create and submit your bracket. Once submitted, it locks.
                  </div>
                </div>

                <div className="btnRow">
                  {inApp ? null : (
                    <button className="hbtn hbtnBlue" onClick={doGoogleSignIn}>
                      Sign in with Google
                    </button>
                  )}

                  <Link className="hbtn hbtnGold" href="/bracket">
                    View Live Bracket
                  </Link>

                  <Link className="hbtn hbtnRed" href="/leaderboard">
                    View Leaderboard
                  </Link>
                </div>

                {inApp ? (
                  <div className="muted" style={{ marginTop: 10, fontSize: 13, lineHeight: "18px" }}>
                    Sign-in is disabled inside this browser to avoid errors. Please use{" "}
                    <b>Open in Browser</b>.
                  </div>
                ) : null}
              </>
            )}

            {status ? <div className="status">{status}</div> : null}
          </section>

          <section className="shoutoutRow">
            <div className="shoutoutCard">
              <div className="shoutoutLeft">
                <div className="shoutoutTitle">🏆 Community Shoutout</div>
                <div className="shoutoutSub">
                  Huge shoutout to <b>Ronan O&apos;Brien</b>, <b>Luke Nigro</b>, and{" "}
                  <b>Dejuan Davis Criner</b> for their elite picking so far. Thank you to everyone
                  who participated and made this competition fun. Got an idea for a future sports,
                  web, or app project?{" "}
                  <a
                    className="inlineLink"
                    href="https://www.instagram.com/charlie.richards13/?hl=en"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Hit me up on Instagram
                  </a>
                  .
                </div>
              </div>

              <div className="shoutoutRight">
                <a
                  className="hbtn hbtnBlue"
                  href="https://www.instagram.com/charlie.richards13/?hl=en"
                  target="_blank"
                  rel="noreferrer"
                >
                  DM Me on IG
                </a>
              </div>
            </div>
          </section>

          <section className="arcadeRow">
            <div className="arcadeCard">
              <div className="arcadeLeft">
                <div className="arcadeTitle">🎮 Arcade</div>
                <div className="arcadeSub">
                  Arcade games are getting upgraded for the next release.
                </div>
              </div>

              <div className="arcadeRight">
                <button className="hbtn hbtnDisabled" disabled title="Coming soon">
                  Coming Soon
                </button>
              </div>
            </div>
          </section>

          <section className="propsRow">
            <div className="propsCard">
              <div className="propsLeft">
                <div className="propsTitle">📊 Player Props (Over/Under)</div>
                <div className="propsSub">
                  Make over/under predictions on featured players in the finals. Points, rebounds,
                  assists, and more! Player props are optional and scored separately from the main
                  bracket.
                </div>
              </div>

              <div className="propsRight">
                <Link className="hbtn hbtnBlue" href="/player-props">
                  Go to Player Props →
                </Link>
              </div>
            </div>
          </section>

          <div className="cardsRow">
            <InfoCard
              title="Semifinals Countdown"
              icon="🕒"
              accent="green"
              badge={semifinalsBadge}
              lines={semifinalsLines}
            />

            <InfoCard
              title="Finals Countdown"
              icon="🏆"
              accent="green"
              badge={finalsBadge}
              lines={finalsLines}
            />
          </div>

          <div className="cardsRow2">
            <InfoCard
              title="Scoring"
              icon="🏀"
              accent="blue"
              lines={[
                "Round 1 = 1 point per correct pick",
                "Round 2 = 2 points",
                "Round 3 = 4 points",
                "Round 4 = 8 points",
                "Final = 16 points",
              ]}
            />

            <InfoCard
              title="News"
              icon="📰"
              accent="blue"
              lines={["Updates, photos, announcements, and important changes will be posted here."]}
              action={
                <Link className="hbtn hbtnBlue" href="/news">
                  News
                </Link>
              }
            />
          </div>

          <section className="howToPlay">
            <div className="howTitle">How to play</div>
            <ol className="howList">
              <li>
                Go to <b>My Bracket</b> and pick winners (later rounds auto-fill).
              </li>

              <li>
                {tournamentStarted ? (
                  <>
                    Brackets are locked (tournament started on <b>{tournamentStartPhoenixText}</b>).
                  </>
                ) : (
                  <>
                    Hit <b>Submit Bracket</b> to lock your picks before tip-off:{" "}
                    <b>{tournamentStartPhoenixText}</b>.
                  </>
                )}
              </li>

              <li>
                Semifinals tip-off: <b>{semifinalsPhoenixText}</b>. Finals tip-off:{" "}
                <b>{finalsPhoenixText}</b>.
              </li>

              <li>
                Watch <b>Live Bracket</b> + <b>Leaderboard</b> update as winners are set.
              </li>
            </ol>
          </section>
        </header>

        <footer className="disclaimer">
          Unofficial bracket competition. Not affiliated with AIA. Please{" "}
          <a
            className="footerLink"
            href="https://www.instagram.com/charlie.richards13/?hl=en"
            target="_blank"
            rel="noreferrer"
          >
            DM @charlie.richards13
          </a>{" "}
          on IG to report any bugs or issues, or to reach out about future projects. Good luck and
          have fun!
        </footer>
      </div>

      <style jsx>{`
        .wrap {
          padding: 28px 18px 110px;
          color: #fff;
          display: flex;
          justify-content: center;
        }

        .stage {
          width: 100%;
          max-width: 1120px;
          position: relative;
          border-radius: 22px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.35);
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.55);
        }

        .bgSpotlights {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(900px 520px at 18% 10%, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0) 60%),
            radial-gradient(820px 520px at 78% 18%, rgba(120, 255, 170, 0.1), rgba(255, 255, 255, 0) 58%),
            radial-gradient(980px 620px at 50% 0%, rgba(100, 170, 255, 0.1), rgba(255, 255, 255, 0) 62%),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.04), rgba(0, 0, 0, 0.35));
          pointer-events: none;
        }

        .bgVignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(1200px 700px at 50% 10%, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.65));
          pointer-events: none;
        }

        .hero {
          position: relative;
          padding: 22px;
        }

        .topRow {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 18px;
          align-items: start;
        }

        .brand {
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }

        .brandLogo {
          width: 120px;
          height: auto;
          filter: drop-shadow(0 12px 22px rgba(0, 0, 0, 0.45));
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 6px;
        }

        .brandText .title {
          font-size: 22px;
          font-weight: 780;
          letter-spacing: 0.2px;
          margin-bottom: 10px;
        }

        .aiaStripe {
          height: 10px;
          width: min(520px, 100%);
          border-radius: 999px;
          margin-bottom: 12px;
          opacity: 0.95;
          background: linear-gradient(
            90deg,
            #1f6db3 0%,
            #1f6db3 62%,
            #f2c230 62%,
            #f2c230 78%,
            #d6463a 78%,
            #d6463a 100%
          );
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .brandText .subtitle {
          font-size: 16px;
          line-height: 24px;
          color: rgba(255, 255, 255, 0.8);
          max-width: 860px;
        }

        .ballCol {
          display: flex;
          justify-content: flex-end;
          padding-top: 6px;
        }

        .inAppBanner {
          margin-top: 14px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 18px;
          background: rgba(0, 0, 0, 0.3);
          padding: 14px 16px;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
        }

        .inAppTitle {
          font-weight: 900;
          letter-spacing: 0.2px;
          margin-bottom: 6px;
        }

        .inAppText {
          opacity: 0.82;
          font-size: 13px;
          line-height: 18px;
        }

        .inAppActions {
          margin-top: 10px;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .panel {
          margin-top: 16px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.04);
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.35);
          padding: 18px;
        }

        .shoutoutRow {
          margin-top: 14px;
        }

        .shoutoutCard {
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: linear-gradient(
            135deg,
            rgba(214, 70, 58, 0.12),
            rgba(242, 194, 48, 0.1),
            rgba(31, 109, 179, 0.12)
          );
          box-shadow: 0 14px 35px rgba(0, 0, 0, 0.3);
          padding: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .shoutoutTitle {
          font-weight: 900;
          letter-spacing: 0.2px;
          font-size: 16px;
        }

        .shoutoutSub {
          margin-top: 6px;
          opacity: 0.88;
          font-size: 13px;
          line-height: 19px;
          max-width: 820px;
        }

        .shoutoutRight {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .inlineLink {
          color: #9fc9ff;
          text-decoration: none;
          font-weight: 700;
        }

        .inlineLink:hover {
          text-decoration: underline;
        }

        .cardsRow {
          margin-top: 16px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .cardsRow2 {
          margin-top: 12px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .arcadeRow {
          margin-top: 14px;
        }

        .arcadeCard {
          border-radius: 18px;
          border: 1px solid rgba(242, 194, 48, 0.35);
          background: rgba(242, 194, 48, 0.07);
          box-shadow: 0 14px 35px rgba(0, 0, 0, 0.3);
          padding: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .arcadeTitle {
          font-weight: 900;
          letter-spacing: 0.2px;
          font-size: 16px;
        }

        .arcadeSub {
          margin-top: 6px;
          opacity: 0.8;
          font-size: 13px;
          line-height: 18px;
          max-width: 760px;
        }

        .arcadeRight {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .propsRow {
          margin-top: 12px;
        }

        .propsCard {
          border-radius: 18px;
          border: 1px solid rgba(120, 180, 255, 0.35);
          background: rgba(120, 180, 255, 0.07);
          box-shadow: 0 14px 35px rgba(0, 0, 0, 0.3);
          padding: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .propsTitle {
          font-weight: 900;
          letter-spacing: 0.2px;
          font-size: 16px;
        }

        .propsSub {
          margin-top: 6px;
          opacity: 0.8;
          font-size: 13px;
          line-height: 18px;
          max-width: 760px;
        }

        .propsRight {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .muted {
          color: rgba(255, 255, 255, 0.72);
        }

        .who {
          font-size: 18px;
          font-weight: 780;
          margin: 2px 0 2px;
        }

        .btnRow {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;
          margin-top: 14px;
        }

        :global(.hbtn) {
          border-radius: 12px;
          padding: 11px 14px;
          border: 1px solid rgba(255, 255, 255, 0.28);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 720;
          cursor: pointer;
          user-select: none;
          transition: transform 120ms ease, background 120ms ease, border 120ms ease;
          color: #fff;
        }

        :global(.hbtnBlue) {
          background: rgba(31, 109, 179, 0.18);
          border-color: rgba(31, 109, 179, 0.6);
        }

        :global(.hbtnGold) {
          background: rgba(242, 194, 48, 0.14);
          border-color: rgba(242, 194, 48, 0.6);
        }

        :global(.hbtnRed) {
          background: rgba(214, 70, 58, 0.16);
          border-color: rgba(214, 70, 58, 0.6);
        }

        :global(.hbtnGhost) {
          background: rgba(0, 0, 0, 0.22);
          color: rgba(255, 255, 255, 0.92);
          border-color: rgba(255, 255, 255, 0.28);
        }

        :global(.hbtnDisabled) {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.22);
          color: rgba(255, 255, 255, 0.7);
          cursor: not-allowed;
          opacity: 0.75;
          transform: none !important;
        }

        :global(.hbtn:hover) {
          transform: translateY(-1px);
        }

        :global(.hbtnDisabled:hover) {
          transform: none;
        }

        .status {
          margin-top: 12px;
          color: rgba(183, 255, 183, 0.95);
          font-size: 13px;
          line-height: 18px;
        }

        .howToPlay {
          margin-top: 14px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 18px;
          background: rgba(0, 0, 0, 0.18);
          padding: 14px 16px;
        }

        .howTitle {
          font-weight: 800;
          letter-spacing: 0.2px;
          margin-bottom: 8px;
          color: rgba(255, 255, 255, 0.92);
        }

        .howList {
          margin: 0;
          padding-left: 18px;
          color: rgba(255, 255, 255, 0.72);
          line-height: 20px;
          font-size: 13px;
        }

        .howList li {
          margin: 6px 0;
        }

        .disclaimer {
          margin-top: 14px;
          padding: 12px 16px 18px;
          text-align: center;
          font-size: 12px;
          line-height: 18px;
          color: rgba(255, 255, 255, 0.55);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .footerLink {
          color: rgba(170, 210, 255, 0.95);
          text-decoration: none;
          font-weight: 700;
        }

        .footerLink:hover {
          text-decoration: underline;
        }

        @media (max-width: 920px) {
          .topRow {
            grid-template-columns: 1fr;
          }

          .ballCol {
            justify-content: flex-start;
          }

          .cardsRow {
            grid-template-columns: 1fr;
          }

          .cardsRow2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}

function InfoCard({
  title,
  icon,
  lines,
  accent,
  badge,
  action,
}: {
  title: string;
  icon: string;
  lines: string[];
  accent: "green" | "blue";
  badge?: { type: "live" | "done"; text: string } | null;
  action?: ReactNode;
}) {
  const accentBorder =
    accent === "green" ? "rgba(120,255,170,0.30)" : "rgba(120,180,255,0.30)";
  const accentBg =
    accent === "green" ? "rgba(120,255,170,0.07)" : "rgba(120,180,255,0.07)";

  return (
    <div className="icard">
      <div className="ihead">
        <div className="ititle">
          <span className="icon">{icon}</span> {title}
        </div>

        {badge?.type === "live" ? (
          <div className="pillLive" title="Games are live">
            <span className="dot" /> {badge.text}
          </div>
        ) : badge?.type === "done" ? (
          <div className="pillDone" title="Complete">
            {badge.text}
          </div>
        ) : null}
      </div>

      <div className="ibody">
        {lines.map((l, idx) => (
          <div key={idx} className="iline">
            {l}
          </div>
        ))}

        {action ? <div className="iaction">{action}</div> : null}
      </div>

      <style jsx>{`
        .icard {
          border: 1px solid ${accentBorder};
          background: ${accentBg};
          border-radius: 18px;
          padding: 14px;
          box-shadow: 0 14px 35px rgba(0, 0, 0, 0.3);
        }

        .ihead {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          gap: 10px;
        }

        .ititle {
          font-weight: 780;
          letter-spacing: 0.2px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .ibody {
          color: rgba(255, 255, 255, 0.8);
          line-height: 20px;
          font-size: 14px;
        }

        .iline {
          margin-top: 6px;
        }

        .iline:first-child {
          margin-top: 0;
        }

        .iaction {
          margin-top: 12px;
          display: flex;
          justify-content: flex-start;
        }

        .pillLive {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          border-radius: 999px;
          border: 1px solid rgba(255, 120, 120, 0.45);
          background: rgba(255, 90, 90, 0.1);
          color: rgba(255, 230, 230, 0.95);
          font-weight: 900;
          letter-spacing: 0.4px;
          font-size: 12px;
          white-space: nowrap;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: rgba(255, 90, 90, 0.95);
          box-shadow: 0 0 14px rgba(255, 90, 90, 0.75);
          animation: pulse 1.1s ease-in-out infinite;
        }

        .pillDone {
          padding: 6px 10px;
          border-radius: 999px;
          border: 1px solid rgba(180, 210, 255, 0.35);
          background: rgba(120, 180, 255, 0.1);
          color: rgba(220, 235, 255, 0.95);
          font-weight: 900;
          letter-spacing: 0.4px;
          font-size: 12px;
          white-space: nowrap;
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.35);
            opacity: 0.75;
          }
        }
      `}</style>
    </div>
  );
}

function SpinningBasketball() {
  return (
    <div className="ballWrap" aria-hidden="true">
      <div className="ball">
        <svg viewBox="0 0 100 100" className="ballSvg">
          <defs>
            <radialGradient id="g" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffb36b" stopOpacity="1" />
              <stop offset="55%" stopColor="#e67e22" stopOpacity="1" />
              <stop offset="100%" stopColor="#b85a14" stopOpacity="1" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="48" fill="url(#g)" />
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="rgba(0,0,0,0.35)"
            strokeWidth="2"
          />
          <path d="M50 2 v96" stroke="rgba(0,0,0,0.55)" strokeWidth="3" />
          <path d="M2 50 h96" stroke="rgba(0,0,0,0.55)" strokeWidth="3" />
          <path
            d="M18 10 C40 30, 40 70, 18 90"
            fill="none"
            stroke="rgba(0,0,0,0.55)"
            strokeWidth="3"
          />
          <path
            d="M82 10 C60 30, 60 70, 82 90"
            fill="none"
            stroke="rgba(0,0,0,0.55)"
            strokeWidth="3"
          />
        </svg>
      </div>

      <style jsx>{`
        .ballWrap {
          width: 120px;
          height: 120px;
          display: grid;
          place-items: center;
          filter: drop-shadow(0 14px 24px rgba(0, 0, 0, 0.45));
        }

        .ball {
          width: 106px;
          height: 106px;
          border-radius: 999px;
          animation: spin 2.8s linear infinite, floaty 3.2s ease-in-out infinite;
          transform-origin: 50% 50%;
        }

        .ballSvg {
          width: 100%;
          height: 100%;
          border-radius: 999px;
          display: block;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes floaty {
          0%,
          100% {
            translate: 0 0;
          }
          50% {
            translate: 0 -6px;
          }
        }
      `}</style>
    </div>
  );
}

function formatCountdown(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

function formatPhoenix(d: Date) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Phoenix",
      dateStyle: "full",
      timeStyle: "short",
    }).format(d);
  } catch {
    return d.toLocaleString();
  }
}

// Charles Richards ASU 2028
// Completed AZ HS Bracket Project
