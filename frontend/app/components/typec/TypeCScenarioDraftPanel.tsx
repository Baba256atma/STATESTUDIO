"use client";

import type React from "react";
import { useMemo, useState } from "react";

import type { TypeCScenarioDraft } from "../../lib/typec/typeCScenarioDrafts.ts";

export type TypeCScenarioDraftPanelProps = {
  drafts: TypeCScenarioDraft[] | null;
  onCancel: () => void;
  onOpenWarRoom: (draft: TypeCScenarioDraft) => void;
  onCompare?: (drafts: TypeCScenarioDraft[]) => void;
};

const panelStyle = {
  position: "fixed",
  left: 16,
  bottom: 18,
  zIndex: 45,
  width: 360,
  maxWidth: "calc(100vw - 32px)",
  padding: 14,
  borderRadius: 12,
  border: "1px solid rgba(125, 211, 252, 0.22)",
  background: "linear-gradient(180deg, rgba(15, 23, 42, 0.92), rgba(2, 6, 23, 0.88))",
  boxShadow: "0 18px 48px rgba(0, 0, 0, 0.32)",
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

export function TypeCScenarioDraftPanel({
  drafts,
  onCancel,
  onOpenWarRoom,
  onCompare,
}: TypeCScenarioDraftPanelProps): React.ReactElement | null {
  const initialDraftId = useMemo(() => drafts?.[0]?.id ?? null, [drafts]);
  const [selectedDraftId, setSelectedDraftId] = useState(initialDraftId);

  if (!drafts?.length) return null;

  const selectedDraft = drafts.find((draft) => draft.id === selectedDraftId) ?? drafts[0];

  return (
    <aside data-nx="typec-scenario-draft-panel" aria-label="Type-C scenario drafts" style={panelStyle}>
      <h2 style={titleStyle}>Scenario Drafts</h2>
      <p style={textStyle}>Possible futures from the confirmed graph. Review before opening War Room.</p>

      {drafts.map((draft) => (
        <label key={draft.id} style={rowStyle}>
          <input
            type="radio"
            name="typec-scenario-draft"
            checked={selectedDraft.id === draft.id}
            onChange={() => setSelectedDraftId(draft.id)}
          />
          <span>
            <span style={{ display: "block", fontSize: 12, fontWeight: 750 }}>{draft.title}</span>
            <span style={textStyle}>{draft.description}</span>
            <span style={{ ...textStyle, display: "block", color: "rgba(125, 211, 252, 0.78)" }}>
              {formatConfidence(draft.confidence)} · {draft.relatedObjectIds.join(", ")}
            </span>
          </span>
        </label>
      ))}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
        <button type="button" onClick={onCancel} style={buttonStyle}>
          Cancel
        </button>
        {drafts.length > 1 && onCompare ? (
          <button type="button" onClick={() => onCompare(drafts)} style={buttonStyle}>
            Compare
          </button>
        ) : null}
        <button type="button" onClick={() => onOpenWarRoom(selectedDraft)} style={buttonStyle}>
          Open in War Room
        </button>
      </div>
    </aside>
  );
}

export default TypeCScenarioDraftPanel;
