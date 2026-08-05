"use client";

import { useEffect, useRef, useState } from "react";
import type { ExecutiveAdvisorContext } from "./ExecutiveAdvisorTypes";
import type { ConversationRuntimeFacts } from "../conversation/ExecutiveConversationSession";
import { cockpit } from "../shell/executiveCockpitTheme";

type Props = {
  readonly context: ExecutiveAdvisorContext;
  readonly facts: ConversationRuntimeFacts;
  readonly iconOnly?: boolean;
  readonly accent?: string;
};

type Row = { readonly label: string; readonly value: string; readonly testId?: string };

/**
 * Sprint 6.6 — Read-only Runtime context popover (⚙).
 */
export function ExecutiveContextPopover({
  context,
  facts,
  iconOnly = false,
  accent = cockpit.accent,
}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const signalCount =
    facts.warningSignalCount + facts.criticalSignalCount;

  const rows: readonly Row[] = [
    { label: "Runtime", value: "Connected" },
    {
      label: "Mode",
      value: context.mode,
      testId: "executive-advisor-conversation-mode",
    },
    {
      label: "Pack",
      value: context.packTitle,
      testId: "executive-advisor-pack-perspective",
    },
    {
      label: "Timeline",
      value: `${context.timelineLens} · ${context.timelinePosition}`,
    },
    { label: "Scenario", value: context.scenarioName ?? "—" },
    {
      label: "Decision",
      value: context.decisionName
        ? `${context.decisionName} (${context.decisionStatus ?? "n/a"})`
        : "—",
    },
    {
      label: "Simulation",
      value: facts.simulationSummary ?? (facts.simulationCompleted ? "Completed" : "Idle"),
    },
    {
      label: "Monitoring",
      value: context.monitoringHealth,
    },
    {
      label: "Signals",
      value: String(signalCount),
      testId: "executive-advisor-signal-count",
    },
    {
      label: "Metadata",
      value: "Loaded",
    },
  ];

  return (
    <div ref={rootRef} style={{ position: "relative" }}>
      <button
        type="button"
        data-testid="executive-advisor-context-button"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="Context"
        onClick={() => setOpen((v) => !v)}
        style={footerBtn(open, accent)}
      >
        {iconOnly ? "⚙" : "⚙ Context"}
      </button>
      {open ? (
        <div
          role="dialog"
          aria-label="Executive Context"
          data-testid="executive-advisor-context-popover"
          style={popoverStyle}
        >
          {rows.map((row) => (
            <div
              key={row.label}
              style={{
                display: "grid",
                gridTemplateColumns: "5.5rem 1fr",
                gap: "0.35rem",
                padding: "0.18rem 0",
              }}
            >
              <span style={labelStyle}>{row.label}</span>
              <span data-testid={row.testId} style={valueStyle}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function footerBtn(active: boolean, accent: string) {
  return {
    padding: "0.32rem 0.5rem",
    borderRadius: cockpit.radius.sm,
    border: active ? `1px solid ${accent}66` : `1px solid transparent`,
    background: active ? `${accent}14` : "transparent",
    color: active ? accent : cockpit.muted,
    fontSize: "0.62rem",
    letterSpacing: "0.04em",
    cursor: "pointer",
    fontFamily: "inherit",
  } as const;
}

const popoverStyle = {
  position: "absolute" as const,
  left: 0,
  bottom: "calc(100% + 0.4rem)",
  width: "min(17.5rem, 78vw)",
  zIndex: 30,
  padding: "0.7rem 0.75rem",
  borderRadius: cockpit.radius.md,
  border: `1px solid ${cockpit.border}`,
  background: cockpit.panel,
  boxShadow: cockpit.elevation.floating,
  animation: "exs-pop-in 160ms ease",
};

const labelStyle = {
  color: cockpit.lowMuted,
  fontSize: "0.55rem",
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
};

const valueStyle = {
  color: cockpit.textSoft,
  fontSize: "0.72rem",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap" as const,
};
