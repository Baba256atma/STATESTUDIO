"use client";

import React from "react";

export function StrategicAlertOverlay(props: {
  level?: "low" | "medium" | "high" | "critical";
  score?: number;
  reasons?: string[];
  onDismiss?: () => void;
}) {
  const { level = "low", score, reasons, onDismiss } = props;
  const label = String(level || "low").toUpperCase();
  const showReasons = Array.isArray(reasons) ? reasons.slice(0, 2) : [];

  return (
    <div
      style={{
        position: "fixed",
        right: 12,
        top: 12,
        zIndex: 300,
        padding: 10,
        borderRadius: 12,
        border: "1px solid rgba(120,170,255,0.25)",
        background: "rgba(10,14,22,0.72)",
        color: "rgba(255,255,255,0.9)",
        fontSize: 12,
        backdropFilter: "blur(8px)",
        pointerEvents: "auto",
        maxWidth: 280,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        <div style={{ fontWeight: 800 }}>
          ALERT: {label}
          {typeof score === "number" ? ` · ${Math.round(score)}` : ""}
        </div>
        <button
          type="button"
          onClick={onDismiss}
          style={{
            border: "none",
            background: "transparent",
            color: "rgba(255,255,255,0.8)",
            cursor: "pointer",
            fontSize: 12,
            lineHeight: 1,
            padding: 2,
          }}
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
      {showReasons.length ? (
        <div style={{ marginTop: 6, display: "grid", gap: 4, opacity: 0.8 }}>
          {showReasons.map((r, i) => (
            <div key={`${i}-${r}`}>• {r}</div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
