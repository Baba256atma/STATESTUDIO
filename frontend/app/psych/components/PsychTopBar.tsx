"use client";

import React, { useEffect, useState } from "react";
import type { AccessMode } from "../lib/paywall/psychAccess";

export default function PsychTopBar({ onToggleChat, onReset, accessMode = "free" }: { onToggleChat: () => void; onReset?: () => void; accessMode?: AccessMode }) {
  const [clearFeedback, setClearFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") console.log("[Sycho][SYCHO-B08.5][PrivacyIndicatorMounted]");
  }, []);

  const handleClearSession = () => {
    // ## SYCHO_MEMORY_UI:
    // This button replaces manual localStorage clearing.
    // Must remain even after backend integration for user trust.
    if (!window.confirm("Clear your self mirror session?")) return;
    onReset?.();
    setClearFeedback("Session cleared");
    window.setTimeout(() => setClearFeedback(null), 1800);
    if (process.env.NODE_ENV !== "production") {
      console.log("[Sycho][SYCHO-B08-UX][MemoryClearedByUser]");
    }
  };

  const subtleButtonStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.025)",
    border: "1px solid rgba(125,211,252,0.12)",
    color: "rgba(219,234,254,0.82)",
    padding: "5px 8px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 12,
  };

  return (
    <div data-nx="psych-topbar" style={{ position: "absolute", top: 12, left: 12, right: 12, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, zIndex: 40, pointerEvents: "none" }}>
      <div style={{ color: "#e6eef8", minWidth: 150 }}>
        <div style={{ fontWeight: 800, letterSpacing: 0 }}>Nexora Psych</div>
        <div
          data-nx="psych-memory-indicator"
          title="Your data stays in this browser. Nothing is sent to a server."
          style={{ marginTop: 3, fontSize: 11, color: "rgba(214, 228, 255, 0.66)", pointerEvents: "auto" }}
        >
          Session memory: Local only
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "flex-end", maxWidth: "min(560px, 64vw)", pointerEvents: "auto" }}>
        <span style={{ alignSelf: "center", border: "1px solid rgba(125,211,252,0.13)", borderRadius: 999, color: "rgba(219,234,254,0.78)", fontSize: 11, padding: "4px 7px", background: "rgba(8,47,73,0.28)" }}>
          {accessMode === "pro_preview" ? "Pro Preview" : "Free Mirror"}
        </span>
        {clearFeedback ? <span style={{ alignSelf: "center", color: "rgba(160, 220, 190, 0.9)", fontSize: 11 }}>{clearFeedback}</span> : null}
        <button data-nx="psych-reset-btn" onClick={onReset} style={subtleButtonStyle}>Reset</button>
        <button
          data-nx="psych-clear-memory-btn"
          onClick={handleClearSession}
          onMouseEnter={(event) => {
            event.currentTarget.style.background = "rgba(255,255,255,0.06)";
            event.currentTarget.style.borderColor = "rgba(219,234,254,0.18)";
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.background = subtleButtonStyle.background as string;
            event.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
          }}
          style={subtleButtonStyle}
        >
          Clear Session
        </button>
        <button onClick={() => (window.location.href = "/")} style={subtleButtonStyle}>Back</button>
        <button onClick={onToggleChat} style={{ ...subtleButtonStyle, background: "rgba(14,116,144,0.16)" }}>Chat</button>
      </div>
    </div>
  );
}
