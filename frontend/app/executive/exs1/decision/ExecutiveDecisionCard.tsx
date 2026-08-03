"use client";

import type { ExecutiveDecision } from "./ExecutiveDecisionConfig";
import { ExecutiveDecisionBadge } from "./ExecutiveDecisionBadge";
import { cockpit } from "../shell/executiveCockpitTheme";

type Props = {
  readonly decision: ExecutiveDecision;
  readonly selected: boolean;
  readonly onSelect: () => void;
};

/**
 * ExecutiveDecisionCard — mock decision metrics card.
 */
export function ExecutiveDecisionCard({
  decision,
  selected,
  onSelect,
}: Props) {
  const accent = decision.locked ? "#12B76A" : "#1570EF";

  return (
    <button
      type="button"
      data-testid={`executive-decision-card-${decision.id}`}
      data-selected={selected ? "true" : "false"}
      data-status={decision.status}
      onClick={onSelect}
      style={{
        width: "100%",
        textAlign: "left",
        padding: "0.65rem 0.7rem",
        borderRadius: "0.5rem",
        border: selected ? `1px solid ${accent}` : `1px solid ${cockpit.border}`,
        background: selected ? `${accent}14` : cockpit.panelSoft,
        boxShadow: selected ? `0 0 18px ${accent}22` : "none",
        color: cockpit.text,
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "border-color 250ms ease, background 250ms ease, box-shadow 250ms ease",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.4rem",
        }}
      >
        <strong style={{ fontSize: "0.84rem" }}>{decision.name}</strong>
        <div style={{ display: "flex", gap: "0.25rem" }}>
          <ExecutiveDecisionBadge status={decision.status} compact />
          {decision.locked ? (
            <ExecutiveDecisionBadge locked compact />
          ) : null}
        </div>
      </div>
      <dl
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.25rem 0.55rem",
          margin: "0.5rem 0 0",
          fontSize: "0.68rem",
        }}
      >
        <Row label="Confidence" value={`${decision.confidence}%`} />
        <Row label="Risk" value={decision.risk} />
        <Row label="Owner" value={decision.owner} />
        <Row label="Created" value={decision.createdDate} />
        <Row label="Source" value={decision.scenarioSourceLabel} />
        <Row label="Status" value={decision.status} />
      </dl>
    </button>
  );
}

function Row({
  label,
  value,
}: {
  readonly label: string;
  readonly value: string;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: "0.3rem" }}>
      <dt style={{ margin: 0, color: cockpit.lowMuted }}>{label}</dt>
      <dd style={{ margin: 0, color: cockpit.textSoft, fontWeight: 550 }}>{value}</dd>
    </div>
  );
}
