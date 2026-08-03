"use client";

import type { ExecutiveScenario } from "./ScenarioConfig";
import { ScenarioBadge } from "./ScenarioBadge";
import { cockpit } from "../shell/executiveCockpitTheme";

type Props = {
  readonly scenario: ExecutiveScenario;
  readonly selected: boolean;
  readonly favorite: boolean;
  readonly comparing: boolean;
  readonly onSelect: () => void;
  readonly onToggleCompare: () => void;
  readonly onFavorite: () => void;
  readonly onRemove: () => void;
};

/**
 * ScenarioCard — mock executive metrics for one scenario.
 */
export function ScenarioCard({
  scenario,
  selected,
  favorite,
  comparing,
  onSelect,
  onToggleCompare,
  onFavorite,
  onRemove,
}: Props) {
  return (
    <article
      data-testid={`scenario-card-${scenario.id}`}
      data-selected={selected ? "true" : "false"}
      data-comparing={comparing ? "true" : "false"}
      style={{
        padding: "0.65rem 0.7rem",
        borderRadius: "0.5rem",
        border: selected
          ? `1px solid ${scenario.color}`
          : comparing
            ? `1px dashed ${scenario.color}`
            : `1px solid ${cockpit.border}`,
        background: selected ? `${scenario.color}14` : cockpit.panelSoft,
        boxShadow: selected ? `0 0 16px ${scenario.color}22` : "none",
        transition: "border-color 250ms ease, background 250ms ease, box-shadow 250ms ease",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "0.4rem",
        }}
      >
        <button
          type="button"
          onClick={onSelect}
          style={{
            flex: 1,
            textAlign: "left",
            border: "none",
            background: "transparent",
            color: cockpit.text,
            cursor: "pointer",
            fontFamily: "inherit",
            padding: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span
              aria-hidden
              style={{
                width: "0.55rem",
                height: "0.55rem",
                borderRadius: "999px",
                background: scenario.color,
              }}
            />
            <strong style={{ fontSize: "0.84rem", fontWeight: 600 }}>
              {scenario.name}
            </strong>
            {selected ? (
              <ScenarioBadge label="Selected" color={scenario.color} selected />
            ) : null}
          </div>
          <p
            style={{
              margin: "0.35rem 0 0",
              fontSize: "0.72rem",
              lineHeight: 1.4,
              color: cockpit.muted,
            }}
          >
            {scenario.description}
          </p>
        </button>
        <button
          type="button"
          data-testid={`scenario-favorite-${scenario.id}`}
          aria-label="Favorite scenario"
          aria-pressed={favorite}
          onClick={onFavorite}
          style={{
            border: "none",
            background: "transparent",
            color: favorite ? "#FDB022" : cockpit.lowMuted,
            cursor: "pointer",
            fontSize: "0.95rem",
            lineHeight: 1,
          }}
        >
          {favorite ? "★" : "☆"}
        </button>
      </div>

      <dl
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.25rem 0.6rem",
          margin: "0.55rem 0 0",
          fontSize: "0.68rem",
        }}
      >
        <Metric label="Cost" value={scenario.cost} />
        <Metric label="Risk" value={scenario.risk} />
        <Metric label="ROI" value={scenario.roi} />
        <Metric label="Confidence" value={`${scenario.confidence}%`} />
        <Metric label="Objects" value={String(scenario.objectCount)} />
        <Metric label="Time" value={scenario.durationLabel} />
      </dl>

      <div
        style={{
          display: "flex",
          gap: "0.35rem",
          marginTop: "0.55rem",
          flexWrap: "wrap",
        }}
      >
        <MiniButton
          testId={`scenario-compare-${scenario.id}`}
          label={comparing ? "Comparing" : "Compare"}
          onClick={onToggleCompare}
          color={scenario.color}
        />
        <MiniButton
          testId={`scenario-remove-${scenario.id}`}
          label="Remove"
          onClick={onRemove}
          color={cockpit.muted}
        />
      </div>
    </article>
  );
}

function Metric({
  label,
  value,
}: {
  readonly label: string;
  readonly value: string;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: "0.3rem" }}>
      <dt style={{ color: cockpit.lowMuted, margin: 0 }}>{label}</dt>
      <dd style={{ color: cockpit.textSoft, margin: 0, fontWeight: 550 }}>{value}</dd>
    </div>
  );
}

function MiniButton({
  testId,
  label,
  onClick,
  color,
}: {
  readonly testId: string;
  readonly label: string;
  readonly onClick: () => void;
  readonly color: string;
}) {
  return (
    <button
      type="button"
      data-testid={testId}
      onClick={onClick}
      style={{
        padding: "0.25rem 0.45rem",
        borderRadius: "999px",
        border: `1px solid ${color}66`,
        background: "transparent",
        color,
        fontSize: "0.6rem",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        cursor: "pointer",
        fontFamily: "inherit",
      }}
    >
      {label}
    </button>
  );
}
