"use client";

import { useState, type CSSProperties } from "react";
import { useExecutiveDecision } from "./hooks/useExecutiveDecision";
import { cockpit } from "../shell/executiveCockpitTheme";

type Props = {
  readonly onClose: () => void;
};

/**
 * Manual decision create flow for ExecutiveFloatingPanel.
 */
export function ExecutiveDecisionWizard({ onClose }: Props) {
  const { createManual } = useExecutiveDecision();
  const [name, setName] = useState("Manual Executive Decision");

  return (
    <div
      data-testid="executive-decision-wizard"
      style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
    >
      <label style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
        <span
          style={{
            fontSize: "0.62rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: cockpit.lowMuted,
          }}
        >
          Decision Name
        </span>
        <input
          data-testid="decision-wizard-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />
      </label>
      <button
        type="button"
        data-testid="decision-wizard-create"
        onClick={() => {
          createManual(name);
          onClose();
        }}
        style={{
          padding: "0.55rem 0.8rem",
          borderRadius: "0.4rem",
          border: "1px solid #1570EF",
          background: "rgba(21,112,239,0.18)",
          color: cockpit.text,
          fontWeight: 550,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        Create Decision
      </button>
    </div>
  );
}

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "0.45rem 0.55rem",
  borderRadius: "0.35rem",
  border: `1px solid ${cockpit.border}`,
  background: cockpit.charcoal,
  color: cockpit.text,
  fontFamily: "inherit",
  fontSize: "0.84rem",
};
