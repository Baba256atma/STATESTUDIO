"use client";

import { useState, type CSSProperties } from "react";
import { useExecutiveMonitoring } from "./hooks/useExecutiveMonitoring";
import { cockpit } from "../shell/executiveCockpitTheme";

type Props = {
  readonly onClose: () => void;
};

/**
 * Monitoring notes editor for ExecutiveFloatingPanel.
 */
export function ExecutiveMonitoringNotesPanel({ onClose }: Props) {
  const { notes, setNotes } = useExecutiveMonitoring();
  const [draft, setDraft] = useState(notes);

  return (
    <div data-testid="monitoring-notes-panel" style={stack}>
      <label style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
        <span style={labelStyle}>Executive Notes</span>
        <textarea
          data-testid="monitoring-notes-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={5}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </label>
      <button
        type="button"
        data-testid="monitoring-notes-save"
        onClick={() => {
          setNotes(draft);
          onClose();
        }}
        style={primaryBtn}
      >
        Save Notes
      </button>
    </div>
  );
}

const stack: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
};

const labelStyle: CSSProperties = {
  fontSize: "0.62rem",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: cockpit.lowMuted,
};

const inputStyle: CSSProperties = {
  padding: "0.5rem 0.6rem",
  borderRadius: "0.4rem",
  border: `1px solid ${cockpit.border}`,
  background: cockpit.panelSoft,
  color: cockpit.text,
  fontFamily: "inherit",
  fontSize: "0.84rem",
};

const primaryBtn: CSSProperties = {
  padding: "0.55rem 0.8rem",
  borderRadius: "0.4rem",
  border: "1px solid #039855",
  background: "rgba(3,152,85,0.18)",
  color: cockpit.text,
  fontWeight: 550,
  cursor: "pointer",
  fontFamily: "inherit",
};
