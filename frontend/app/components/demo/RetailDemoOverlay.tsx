"use client";

import React from "react";
import type { DemoScript } from "../../lib/demo/demoScript";

type RetailDemoOverlayProps = {
  visible: boolean;
  script: DemoScript;
  currentStepIndex: number;
  autoplay: boolean;
  running: boolean;
  narrationText: string | null;
  stepTitle: string | null;
  canStepBackward: boolean;
  canStepForward: boolean;
  onStart: () => void;
  onRestart: () => void;
  onPause: () => void;
  onStepBackward: () => void;
  onStepForward: () => void;
};

export function RetailDemoOverlay(props: RetailDemoOverlayProps) {
  if (!props.visible) return null;

  const stepNumber = props.currentStepIndex >= 0 ? props.currentStepIndex + 1 : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: 16,
        bottom: 16,
        width: "min(420px, calc(100% - 32px))",
        zIndex: 12,
        padding: 14,
        borderRadius: 18,
        border: "1px solid rgba(148,163,184,0.18)",
        background:
          "linear-gradient(180deg, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.84) 100%)",
        boxShadow: "0 18px 48px rgba(2,6,23,0.38)",
        backdropFilter: "blur(14px)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
        <div>
          <div style={{ color: "#f8fafc", fontSize: 15, fontWeight: 800 }}>{props.script.title}</div>
          <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 4 }}>{props.script.subtitle}</div>
        </div>
        <div
          style={{
            padding: "4px 8px",
            borderRadius: 999,
            border: "1px solid rgba(96,165,250,0.28)",
            background: "rgba(59,130,246,0.14)",
            color: "#dbeafe",
            fontSize: 10,
            fontWeight: 700,
            whiteSpace: "nowrap",
          }}
        >
          {stepNumber > 0 ? `Step ${stepNumber}/${props.script.steps.length}` : "Ready"}
        </div>
      </div>

      <div style={{ marginTop: 12, color: "#e2e8f0", fontSize: 16, fontWeight: 700 }}>
        {props.stepTitle ?? "Guided story ready"}
      </div>
      <div style={{ marginTop: 6, color: "#cbd5e1", fontSize: 12, lineHeight: 1.5 }}>
        {props.narrationText ?? "Run the guided story to walk from steady-state operations into fragility and mitigation."}
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={props.autoplay ? props.onPause : props.onStart}
          style={buttonStyle("primary")}
        >
          {props.autoplay ? "Pause" : "Auto Play"}
        </button>
        <button type="button" onClick={props.onRestart} style={buttonStyle("secondary")}>
          Restart
        </button>
        <button
          type="button"
          onClick={props.onStepBackward}
          disabled={!props.canStepBackward || props.running}
          style={buttonStyle("secondary", !props.canStepBackward || props.running)}
        >
          Back
        </button>
        <button
          type="button"
          onClick={props.onStepForward}
          disabled={props.running || (!props.canStepForward && props.currentStepIndex >= 0)}
          style={buttonStyle("secondary", props.running || (!props.canStepForward && props.currentStepIndex >= 0))}
        >
          {props.currentStepIndex < 0 ? "Start" : "Next"}
        </button>
      </div>

      <div style={{ marginTop: 10, color: "#64748b", fontSize: 11 }}>
        {props.running
          ? "Nexora is advancing the current story step."
          : props.autoplay
          ? "Auto-play will continue after each response settles."
          : "Manual control stays active. You can pause, step, or type your own prompt at any time."}
      </div>
    </div>
  );
}

function buttonStyle(kind: "primary" | "secondary", disabled = false): React.CSSProperties {
  return {
    height: 30,
    padding: "0 12px",
    borderRadius: 999,
    border:
      kind === "primary"
        ? "1px solid rgba(56,189,248,0.32)"
        : "1px solid rgba(148,163,184,0.22)",
    background:
      kind === "primary"
        ? "linear-gradient(135deg, rgba(14,165,233,0.2), rgba(59,130,246,0.18))"
        : "rgba(15,23,42,0.68)",
    color: kind === "primary" ? "#e0f2fe" : "#cbd5e1",
    fontSize: 11,
    fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
  };
}
