"use client";

import { cockpit } from "../shell/executiveCockpitTheme";
import { ExecutivePriorityBadge } from "./ExecutivePriorityBadge";
import type { ExecutiveSignal } from "./ExecutiveSignalTypes";

type Props = {
  readonly signal: ExecutiveSignal;
  readonly selected?: boolean;
  readonly onSelect?: () => void;
};

export function ExecutiveSignalCard({ signal, selected, onSelect }: Props) {
  return (
    <button
      type="button"
      data-testid={`executive-signal-card-${signal.signalId}`}
      data-type={signal.type}
      data-lifecycle={signal.lifecycle}
      onClick={onSelect}
      style={{
        textAlign: "left",
        width: "100%",
        padding: "0.55rem 0.65rem",
        borderRadius: cockpit.radius.md,
        border: selected
          ? `1px solid ${cockpit.accent}`
          : `1px solid ${cockpit.border}`,
        background: selected ? cockpit.accentSoft : cockpit.panelSoft,
        color: cockpit.text,
        cursor: "pointer",
        fontFamily: "inherit",
        opacity: signal.lifecycle === "Resolved" ? 0.65 : 1,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "0.4rem",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: "0.55rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: cockpit.accent,
          }}
        >
          {signal.type}
          {signal.unread ? " · New" : ""}
        </span>
        <ExecutivePriorityBadge severity={signal.severity} />
      </div>
      <div
        style={{
          marginTop: "0.3rem",
          fontSize: "0.76rem",
          fontWeight: 550,
          lineHeight: 1.4,
        }}
      >
        {signal.summary}
      </div>
      <div
        style={{
          marginTop: "0.2rem",
          fontSize: "0.66rem",
          color: cockpit.muted,
        }}
      >
        {signal.relatedPackTitle} · {signal.suggestedWorkspace}
      </div>
    </button>
  );
}
