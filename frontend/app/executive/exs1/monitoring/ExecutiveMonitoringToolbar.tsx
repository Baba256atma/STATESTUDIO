"use client";

import { useExecutiveMonitoring } from "./hooks/useExecutiveMonitoring";
import { cockpit } from "../shell/executiveCockpitTheme";

type Props = {
  readonly onNotes: () => void;
};

/**
 * ExecutiveMonitoringToolbar — Snapshot / Refresh / Compare / Export / Notes.
 */
export function ExecutiveMonitoringToolbar({ onNotes }: Props) {
  const { createSnapshot, refresh, compareOpen, setCompareOpen } =
    useExecutiveMonitoring();

  return (
    <div
      data-testid="executive-monitoring-toolbar"
      style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}
    >
      <Action
        testId="monitoring-create-snapshot"
        label="Create Snapshot"
        color="#039855"
        onClick={createSnapshot}
      />
      <Action
        testId="monitoring-refresh"
        label="Refresh"
        color="#1570EF"
        onClick={refresh}
      />
      <Action
        testId="monitoring-compare"
        label="Compare"
        color="#FDB022"
        onClick={() => setCompareOpen(!compareOpen)}
      />
      <Action
        testId="monitoring-export"
        label="Export"
        color={cockpit.accent}
        onClick={() => {}}
      />
      <Action
        testId="monitoring-notes"
        label="Notes"
        color="#98A2B3"
        onClick={onNotes}
      />
    </div>
  );
}

function Action({
  testId,
  label,
  color,
  onClick,
}: {
  readonly testId: string;
  readonly label: string;
  readonly color: string;
  readonly onClick: () => void;
}) {
  return (
    <button
      type="button"
      data-testid={testId}
      onClick={onClick}
      style={{
        padding: "0.35rem 0.55rem",
        borderRadius: "0.35rem",
        border: `1px solid ${color}`,
        background: `${color}22`,
        color,
        fontSize: "0.66rem",
        fontWeight: 550,
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "background 250ms ease",
      }}
    >
      {label}
    </button>
  );
}
