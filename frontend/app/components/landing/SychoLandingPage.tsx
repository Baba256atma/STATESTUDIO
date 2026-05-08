"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

const SEEN_KEY = "sycho_seen_onboarding";

export default function SychoLandingPage(): React.JSX.Element {
  const [returning, setReturning] = useState(false);

  useEffect(() => {
    try {
      setReturning(window.localStorage.getItem(SEEN_KEY) === "true");
    } catch {
      setReturning(false);
    }
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at 50% 18%, rgba(14, 116, 144, 0.22), transparent 34%), linear-gradient(180deg, #020617 0%, #061225 58%, #020617 100%)",
        color: "#e5edf8",
        fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        overflow: "hidden",
      }}
    >
      <section
        style={{
          width: "min(1080px, calc(100% - 32px))",
          margin: "0 auto",
          minHeight: "100vh",
          display: "grid",
          gridTemplateRows: "1fr auto",
          gap: 32,
          padding: "72px 0 28px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 42,
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ color: "#7dd3fc", fontSize: 12, letterSpacing: 0, textTransform: "uppercase", marginBottom: 14 }}>Sycho Nexora v1</div>
            <h1 style={{ margin: 0, fontSize: "clamp(42px, 8vw, 82px)", lineHeight: 0.95, letterSpacing: 0, maxWidth: 760 }}>
              Explore your inner system
            </h1>
            <p style={{ margin: "22px 0 0", color: "#b8c7d9", fontSize: "clamp(17px, 2.2vw, 21px)", lineHeight: 1.55, maxWidth: 620 }}>
              Ego, Elements, and a living space that reacts to you
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 30 }}>
              <Link
                href="/psych"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 42,
                  padding: "0 18px",
                  borderRadius: 8,
                  background: "linear-gradient(135deg, #facc15, #38bdf8)",
                  color: "#061225",
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                Enter the Space
              </Link>
              <a
                href="#what"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 42,
                  padding: "0 16px",
                  borderRadius: 8,
                  border: "1px solid rgba(148, 163, 184, 0.28)",
                  color: "#dbeafe",
                  textDecoration: "none",
                  background: "rgba(2, 6, 23, 0.35)",
                }}
              >
                What is this?
              </a>
              {returning ? (
                <Link href="/psych" style={{ alignSelf: "center", color: "#93c5fd", fontSize: 13, textDecoration: "none" }}>
                  Skip intro
                </Link>
              ) : null}
            </div>
          </div>

          <div
            aria-label="Sycho preview"
            style={{
              aspectRatio: "1 / 1",
              borderRadius: 12,
              border: "1px solid rgba(125, 211, 252, 0.16)",
              background:
                "radial-gradient(circle at 50% 48%, rgba(250, 204, 21, 0.5) 0 5%, transparent 7%), radial-gradient(circle at 70% 42%, rgba(248, 113, 113, 0.42) 0 4%, transparent 6%), radial-gradient(circle at 28% 60%, rgba(56, 189, 248, 0.4) 0 4%, transparent 6%), radial-gradient(circle at 35% 34%, rgba(224, 242, 254, 0.36) 0 3%, transparent 5%), radial-gradient(circle at 65% 70%, rgba(74, 222, 128, 0.3) 0 4%, transparent 6%), radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.15), transparent 30%), #020617",
              boxShadow: "0 30px 80px rgba(0, 0, 0, 0.42), inset 0 0 80px rgba(14, 165, 233, 0.08)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", inset: "15%", border: "1px solid rgba(250, 204, 21, 0.18)", borderRadius: "50%" }} />
            <div style={{ position: "absolute", inset: "27%", border: "1px solid rgba(125, 211, 252, 0.16)", borderRadius: "50%", transform: "rotate(-18deg)" }} />
            <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(207,232,255,.62) 0 1px, transparent 1.5px)", backgroundSize: "31px 27px", opacity: 0.22 }} />
          </div>
        </div>

        <div id="what" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
          {[
            "Type or click — the system responds",
            "Each element has a voice",
            "The space reflects your state",
            "No personal data stored. No raw text saved.",
          ].map((text) => (
            <div key={text} style={{ borderTop: "1px solid rgba(148, 163, 184, 0.18)", paddingTop: 12, color: "#cbd5e1", fontSize: 14, lineHeight: 1.45 }}>
              {text}
            </div>
          ))}
        </div>

        <footer style={{ display: "flex", justifyContent: "space-between", gap: 16, color: "#64748b", fontSize: 12, flexWrap: "wrap" }}>
          <span>v1</span>
          <a href="mailto:hello@nexora.local" style={{ color: "#93c5fd", textDecoration: "none" }}>contact</a>
        </footer>
      </section>
    </main>
  );
}
