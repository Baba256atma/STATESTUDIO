"use client";

import type React from "react";
import { useMemo, useState } from "react";

import type { TypeCConnectionSuggestion } from "../../lib/typec/typeCConnectionSuggestions.ts";

export type TypeCConnectionSuggestionPanelProps = {
  suggestions: TypeCConnectionSuggestion[] | null;
  onCancel: () => void;
  onApplySelected: (suggestions: TypeCConnectionSuggestion[]) => void;
};

const panelStyle = {
  position: "fixed",
  left: 16,
  bottom: 18,
  zIndex: 44,
  width: 340,
  maxWidth: "calc(100vw - 32px)",
  padding: 14,
  borderRadius: 12,
  border: "1px solid rgba(250, 204, 21, 0.22)",
  background: "linear-gradient(180deg, rgba(15, 23, 42, 0.9), rgba(2, 6, 23, 0.86))",
  boxShadow: "0 18px 48px rgba(0, 0, 0, 0.3)",
  color: "rgba(241, 245, 249, 0.94)",
  backdropFilter: "blur(14px)",
} as const;

const titleStyle = {
  margin: 0,
  fontSize: 14,
  lineHeight: 1.25,
  fontWeight: 750,
  letterSpacing: 0,
} as const;

const textStyle = {
  margin: "6px 0 0",
  color: "rgba(203, 213, 225, 0.88)",
  fontSize: 12,
  lineHeight: 1.4,
} as const;

const rowStyle = {
  display: "grid",
  gridTemplateColumns: "18px 1fr",
  gap: 8,
  marginTop: 10,
  paddingTop: 9,
  borderTop: "1px solid rgba(148, 163, 184, 0.14)",
} as const;

const buttonStyle = {
  borderRadius: 8,
  border: "1px solid rgba(148, 163, 184, 0.22)",
  background: "rgba(15, 23, 42, 0.5)",
  color: "rgba(226, 232, 240, 0.9)",
  cursor: "pointer",
  fontSize: 11,
  fontWeight: 700,
  padding: "6px 9px",
} as const;

function formatConfidence(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function TypeCConnectionSuggestionPanel({
  suggestions,
  onCancel,
  onApplySelected,
}: TypeCConnectionSuggestionPanelProps): React.ReactElement | null {
  const initial = useMemo(
    () => new Set((suggestions ?? []).filter((suggestion) => suggestion.selected).map((suggestion) => suggestion.id)),
    [suggestions]
  );
  const [selectedIds, setSelectedIds] = useState(initial);

  if (!suggestions?.length) return null;

  const selectedSuggestions = suggestions.map((suggestion) => ({
    ...suggestion,
    selected: selectedIds.has(suggestion.id),
  }));

  return (
    <aside data-nx="typec-connection-suggestion-panel" aria-label="Type-C connection suggestions" style={panelStyle}>
      <h2 style={titleStyle}>Suggested Connections</h2>
      <p style={textStyle}>Review analyst-style connection suggestions before committing them.</p>

      {selectedSuggestions.map((suggestion) => (
        <label key={suggestion.id} style={rowStyle}>
          <input
            type="checkbox"
            checked={Boolean(suggestion.selected)}
            onChange={(event) => {
              setSelectedIds((prev) => {
                const next = new Set(prev);
                if (event.target.checked) next.add(suggestion.id);
                else next.delete(suggestion.id);
                return next;
              });
            }}
          />
          <span>
            <span style={{ display: "block", fontSize: 12, fontWeight: 750 }}>
              {suggestion.sourceObjectId} → {suggestion.targetObjectId}
            </span>
            <span style={textStyle}>{suggestion.reason}</span>
            <span style={{ ...textStyle, display: "block", color: "rgba(250, 204, 21, 0.78)" }}>
              {suggestion.type} · {formatConfidence(suggestion.confidence)}
            </span>
          </span>
        </label>
      ))}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
        <button type="button" onClick={onCancel} style={buttonStyle}>
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onApplySelected(selectedSuggestions.filter((suggestion) => suggestion.selected))}
          style={buttonStyle}
        >
          Apply Selected
        </button>
      </div>
    </aside>
  );
}

export default TypeCConnectionSuggestionPanel;
