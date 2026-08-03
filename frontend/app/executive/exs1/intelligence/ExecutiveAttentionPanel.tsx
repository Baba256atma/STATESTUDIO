"use client";

import { cockpit } from "../shell/executiveCockpitTheme";
import { useRuntimeIntelligence } from "./hooks/useRuntimeIntelligence";

export function ExecutiveAttentionPanel() {
  const { signals, attentionObjectIds, recommendation } =
    useRuntimeIntelligence();
  const attention = signals.filter(
    (s) =>
      s.unread &&
      s.lifecycle !== "Resolved" &&
      s.lifecycle !== "Archived",
  );

  return (
    <section
      data-testid="executive-attention-panel"
      style={{
        padding: "0.65rem 0.7rem",
        borderRadius: cockpit.radius.md,
        border: `1px solid ${cockpit.border}`,
        background: cockpit.panelSoft,
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "0.58rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: cockpit.lowMuted,
        }}
      >
        Executive Attention
      </p>
      <p
        style={{
          margin: "0.35rem 0 0",
          fontSize: "0.78rem",
          color: cockpit.textSoft,
        }}
      >
        {attention.length} signal{attention.length === 1 ? "" : "s"} deserve
        attention · Objects {attentionObjectIds.join(", ") || "—"}
      </p>
      <p
        style={{
          margin: "0.35rem 0 0",
          fontSize: "0.72rem",
          color: cockpit.accent,
        }}
      >
        {recommendation.type} · {recommendation.nextStep}
      </p>
    </section>
  );
}
