"use client";

import type { ExecutiveScenario } from "./ScenarioConfig";
import { ScenarioBadge } from "./ScenarioBadge";
import { cockpit } from "../shell/executiveCockpitTheme";

type Props = {
  readonly scenario: ExecutiveScenario;
  readonly selected: boolean;
  readonly onSelect: () => void;
};

/**
 * CombinedScenarioCard — UI-only hybrid scenario presentation.
 */
export function CombinedScenarioCard({
  scenario,
  selected,
  onSelect,
}: Props) {
  if (!scenario.combinedFrom?.length) return null;

  return (
    <button
      type="button"
      data-testid={`combined-scenario-card-${scenario.id}`}
      onClick={onSelect}
      style={{
        width: "100%",
        textAlign: "left",
        padding: "0.6rem 0.7rem",
        borderRadius: "0.5rem",
        border: selected
          ? `1px solid ${scenario.color}`
          : `1px dashed ${scenario.color}`,
        background: `linear-gradient(135deg, ${scenario.color}18, ${cockpit.panelSoft})`,
        color: cockpit.text,
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "border-color 250ms ease, background 250ms ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
        <ScenarioBadge label="Combined" color={scenario.color} selected />
        <strong style={{ fontSize: "0.82rem" }}>{scenario.name}</strong>
      </div>
      <p
        style={{
          margin: "0.35rem 0 0",
          fontSize: "0.72rem",
          color: cockpit.muted,
          lineHeight: 1.4,
        }}
      >
        {scenario.description}
      </p>
    </button>
  );
}
