"use client";

import React from "react";
import { nx } from "../ui/nexoraTheme";
import {
  NEXORA_OPERATOR_RUNBOOK,
  NEXORA_RUNBOOK_MICRO_HINTS,
  shouldShowRunbookDemoButton,
  type NexoraRunbookStepId,
} from "../../lib/pilot/nexoraRunbook";

type NexoraRunbookPanelProps = {
  currentStepId: NexoraRunbookStepId;
  onRunDemo?: (() => void) | null;
};

export function NexoraRunbookPanel(props: NexoraRunbookPanelProps) {
  const [collapsed, setCollapsed] = React.useState(false);
  const idx = NEXORA_OPERATOR_RUNBOOK.findIndex((s) => s.id === props.currentStepId);
  const currentIndex = idx >= 0 ? idx + 1 : 1;
  const micro = NEXORA_RUNBOOK_MICRO_HINTS[props.currentStepId] ?? null;
  const showDemo = shouldShowRunbookDemoButton() && typeof props.onRunDemo === "function";

  return (
    <div
      role="complementary"
      aria-label="Operator runbook"
      style={{
        position: "fixed",
        right: 14,
        bottom: 14,
        zIndex: 8,
        width: collapsed ? 44 : 236,
        maxWidth: "min(236px, calc(100vw - 28px))",
        borderRadius: 12,
        border: `1px solid ${nx.borderSoft}`,
        background: "color-mix(in srgb, var(--nx-bg-deep) 88%, transparent)",
        backdropFilter: "blur(10px)",
        boxShadow: nx.headerShadow,
        padding: collapsed ? 8 : "10px 12px 12px",
        pointerEvents: "auto",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: collapsed ? 0 : 6 }}>
        {!collapsed ? (
          <span
            style={{
              color: nx.lowMuted,
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Pilot runbook
          </span>
        ) : null}
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? "Expand runbook" : "Collapse runbook"}
          style={{
            marginLeft: collapsed ? 0 : "auto",
            fontSize: 10,
            fontWeight: 700,
            padding: "2px 6px",
            borderRadius: 6,
            border: `1px solid ${nx.borderSoft}`,
            background: "color-mix(in srgb, var(--nx-bg-deep) 70%, transparent)",
            color: nx.muted,
            cursor: "pointer",
          }}
        >
          {collapsed ? "▶" : "◀"}
        </button>
      </div>
      {collapsed ? null : (
        <>
          <div style={{ color: nx.muted, fontSize: 10, marginBottom: 8 }}>
            Step <strong style={{ color: nx.text }}>{currentIndex}</strong> / {NEXORA_OPERATOR_RUNBOOK.length}
            <span style={{ marginLeft: 8, color: nx.accentInk }}>{micro}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {NEXORA_OPERATOR_RUNBOOK.map((step) => {
              const active = step.id === props.currentStepId;
              return (
                <div
                  key={step.id}
                  style={{
                    borderRadius: 8,
                    padding: "6px 8px",
                    border: active ? `1px solid ${nx.accentMuted}` : `1px solid transparent`,
                    background: active ? "color-mix(in srgb, var(--nx-accent-muted) 12%, transparent)" : "transparent",
                  }}
                >
                  <div style={{ color: active ? nx.text : nx.muted, fontSize: 11, fontWeight: active ? 800 : 600, lineHeight: 1.25 }}>
                    {step.title}
                  </div>
                  <div style={{ color: nx.lowMuted, fontSize: 9, lineHeight: 1.35, marginTop: 2 }}>{step.description}</div>
                </div>
              );
            })}
          </div>
          {showDemo ? (
            <button
              type="button"
              onClick={() => props.onRunDemo?.()}
              style={{
                marginTop: 10,
                width: "100%",
                cursor: "pointer",
                fontSize: 10,
                fontWeight: 700,
                padding: "6px 8px",
                borderRadius: 8,
                border: `1px solid ${nx.borderStrong}`,
                background: nx.consoleBg,
                color: nx.textSoft,
              }}
            >
              Run demo scenario
            </button>
          ) : null}
        </>
      )}
    </div>
  );
}
