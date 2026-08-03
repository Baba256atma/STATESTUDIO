"use client";

import { useExecutiveData } from "./hooks/useExecutiveData";
import { cockpit } from "../shell/executiveCockpitTheme";

type Props = {
  readonly onAddSource: () => void;
};

export function ExecutiveDataToolbar({ onAddSource }: Props) {
  const { refresh, disconnectSelected } = useExecutiveData();

  return (
    <div
      data-testid="executive-data-toolbar"
      style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}
    >
      <Action testId="data-add-source" label="+ Add Data Source" color="#38bdf8" onClick={onAddSource} />
      <Action testId="data-refresh" label="Refresh" color="#1570EF" onClick={refresh} />
      <Action
        testId="data-disconnect"
        label="Disconnect"
        color="#F04438"
        onClick={disconnectSelected}
      />
      <Action testId="data-export-mapping" label="Export Mapping" color="#98A2B3" onClick={() => {}} />
      <Action testId="data-validate" label="Validate" color="#12B76A" onClick={() => {}} />
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
        borderRadius: cockpit.radius.sm,
        border: `1px solid ${color}`,
        background: `${color}22`,
        color,
        fontSize: "0.64rem",
        fontWeight: 550,
        cursor: "pointer",
        fontFamily: "inherit",
        transition: cockpit.transition,
      }}
    >
      {label}
    </button>
  );
}
