"use client";

import type { ExecutiveDataMapping } from "./ExecutiveDataConfig";
import { useExecutiveData } from "./hooks/useExecutiveData";
import { cockpit } from "../shell/executiveCockpitTheme";

type Props = {
  readonly mapping: ExecutiveDataMapping;
};

export function ExecutiveMappingRow({ mapping }: Props) {
  const { updateMappingStatus, assignMappingObject } = useExecutiveData();

  return (
    <div
      data-testid={`executive-mapping-row-${mapping.id}`}
      data-status={mapping.status}
      style={{
        padding: "0.55rem 0.6rem",
        borderRadius: cockpit.radius.md,
        border: `1px solid ${cockpit.border}`,
        background: cockpit.panelSoft,
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr auto",
        gap: "0.4rem",
        alignItems: "center",
      }}
    >
      <div>
        <p style={label}>Source Column</p>
        <strong style={{ fontSize: "0.78rem" }}>{mapping.sourceColumn}</strong>
      </div>
      <span aria-hidden style={{ color: cockpit.lowMuted }}>
        ↓
      </span>
      <div>
        <p style={label}>Executive Object</p>
        <strong style={{ fontSize: "0.78rem", color: cockpit.accent }}>
          {mapping.objectLabel}
        </strong>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        <span
          style={{
            fontSize: "0.5rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color:
              mapping.status === "Mapped"
                ? "#12B76A"
                : mapping.status === "Create Object"
                  ? "#FDB022"
                  : cockpit.muted,
          }}
        >
          {mapping.status}
        </span>
        {mapping.status === "Create Object" || mapping.status === "Suggested" ? (
          <div style={{ display: "flex", gap: "0.25rem" }}>
            <Mini
              label="Create"
              onClick={() =>
                assignMappingObject(mapping.id, mapping.objectLabel, null)
              }
            />
            <Mini
              label="Ignore"
              onClick={() => updateMappingStatus(mapping.id, "Ignored")}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Mini({
  label,
  onClick,
}: {
  readonly label: string;
  readonly onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "0.15rem 0.35rem",
        borderRadius: cockpit.radius.pill,
        border: `1px solid ${cockpit.border}`,
        background: "transparent",
        color: cockpit.accent,
        fontSize: "0.52rem",
        cursor: "pointer",
        fontFamily: "inherit",
      }}
    >
      {label}
    </button>
  );
}

const label = {
  margin: 0,
  fontSize: "0.5rem",
  letterSpacing: "0.1em",
  textTransform: "uppercase" as const,
  color: cockpit.lowMuted,
};
