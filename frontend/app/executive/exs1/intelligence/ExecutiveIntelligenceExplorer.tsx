"use client";

import { cockpit } from "../shell/executiveCockpitTheme";
import { ExecutiveAttentionPanel } from "./ExecutiveAttentionPanel";
import { ExecutiveInbox } from "./ExecutiveInbox";
import { ExecutiveSignalDetails } from "./ExecutiveSignalDetails";
import { ExecutiveSignalHistory } from "./ExecutiveSignalHistory";
import type { IntelligenceSection } from "./ExecutiveSignalTypes";
import { useRuntimeIntelligence } from "./hooks/useRuntimeIntelligence";

const SECTIONS: readonly IntelligenceSection[] = [
  "Signals",
  "Attention",
  "Recommendations",
  "History",
];

/**
 * Intelligence Explorer — Signals, Attention, Recommendations, History.
 */
export function ExecutiveIntelligenceExplorer() {
  const { section, setSection, recommendation } = useRuntimeIntelligence();

  return (
    <div
      data-testid="executive-intelligence-explorer"
      style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}
    >
      <div>
        <p
          style={{
            margin: 0,
            fontSize: cockpit.type.status.size,
            letterSpacing: cockpit.type.status.tracking,
            textTransform: "uppercase",
            color: cockpit.lowMuted,
          }}
        >
          Executive Intelligence
        </p>
        <p
          style={{
            margin: "0.3rem 0 0",
            fontSize: "0.74rem",
            color: cockpit.textSoft,
          }}
        >
          Runtime signals enriched with metadata before Advisor speaks.
        </p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
        {SECTIONS.map((item) => (
          <button
            key={item}
            type="button"
            data-testid={`intelligence-section-${item.toLowerCase()}`}
            onClick={() => setSection(item)}
            style={{
              padding: "0.3rem 0.5rem",
              borderRadius: cockpit.radius.sm,
              border:
                section === item
                  ? `1px solid ${cockpit.accent}`
                  : `1px solid ${cockpit.border}`,
              background: section === item ? cockpit.accentSoft : "transparent",
              color: section === item ? cockpit.accent : cockpit.muted,
              fontSize: "0.62rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {item}
          </button>
        ))}
      </div>

      {section === "Signals" ? (
        <>
          <ExecutiveInbox />
          <ExecutiveSignalDetails />
        </>
      ) : null}
      {section === "Attention" ? <ExecutiveAttentionPanel /> : null}
      {section === "Recommendations" ? (
        <section
          data-testid="executive-recommendation-panel"
          style={{
            padding: "0.65rem 0.7rem",
            borderRadius: cockpit.radius.md,
            border: `1px solid ${cockpit.border}`,
            background: cockpit.panelSoft,
            fontSize: "0.76rem",
            color: cockpit.textSoft,
            display: "flex",
            flexDirection: "column",
            gap: "0.35rem",
          }}
        >
          <strong style={{ color: cockpit.accent }}>
            {recommendation.type} · {recommendation.severity}
          </strong>
          <div>Why · {recommendation.why}</div>
          <div>Impact · {recommendation.impact}</div>
          <div>Next Step · {recommendation.nextStep}</div>
          <div>
            Pack · {recommendation.packTitle} · Workspace ·{" "}
            {recommendation.suggestedWorkspace}
          </div>
          <div>
            Decision · {recommendation.relatedDecisionName ?? "—"}
          </div>
        </section>
      ) : null}
      {section === "History" ? <ExecutiveSignalHistory /> : null}
    </div>
  );
}
