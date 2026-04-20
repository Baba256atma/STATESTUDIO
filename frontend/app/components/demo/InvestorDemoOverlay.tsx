"use client";

import React from "react";
import { nx } from "../ui/nexoraTheme";

export type InvestorDemoOverlayProps = {
  title: string;
  description: string;
  step: number;
  maxStep: number;
  canGoNext: boolean;
  onNext: () => void;
  onBack: () => void;
  onExit: () => void;
  showBack: boolean;
};

export function InvestorDemoOverlay(props: InvestorDemoOverlayProps) {
  const { title, description, step, maxStep, canGoNext, onNext, onBack, onExit, showBack } = props;
  const btn: React.CSSProperties = {
    padding: "8px 14px",
    borderRadius: 10,
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    cursor: "pointer",
    border: `1px solid ${nx.border}`,
  };
  return (
    <div
      role="dialog"
      aria-label="Investor demo"
      style={{
        position: "fixed",
        zIndex: 50,
        top: 96,
        right: 460,
        maxWidth: 340,
        padding: 16,
        borderRadius: 14,
        border: `1px solid ${nx.borderStrong}`,
        background: "rgba(15, 18, 28, 0.92)",
        boxShadow: "0 18px 48px rgba(0,0,0,0.45)",
        backdropFilter: "blur(12px)",
        color: nx.text,
        pointerEvents: "auto",
      }}
    >
      <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: nx.accentMuted }}>
        Investor demo · Step {step} / {maxStep}
      </div>
      <div style={{ marginTop: 8, fontSize: 15, fontWeight: 800, lineHeight: 1.3, color: nx.textStrong }}>{title}</div>
      <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.45, color: nx.textSoft, whiteSpace: "pre-wrap" }}>{description}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14, alignItems: "center" }}>
        {showBack ? (
          <button type="button" style={{ ...btn, background: nx.bgControl, color: nx.textSoft }} onClick={onBack}>
            ← Back
          </button>
        ) : null}
        <button
          type="button"
          style={{
            ...btn,
            background: canGoNext ? nx.accentSoft : nx.bgDeep,
            color: canGoNext ? nx.accent : nx.muted,
            opacity: canGoNext ? 1 : 0.65,
          }}
          disabled={!canGoNext}
          onClick={() => {
            if (process.env.NODE_ENV !== "production") {
              console.log("[Nexora][Demo][Next]", { click: true, step, maxStep, canGoNext });
            }
            onNext();
          }}
        >
          {step >= maxStep ? "Finish" : "Next →"}
        </button>
        <button
          type="button"
          style={{ ...btn, background: "transparent", color: nx.lowMuted, marginLeft: "auto" }}
          onClick={onExit}
        >
          Exit demo
        </button>
      </div>
    </div>
  );
}
