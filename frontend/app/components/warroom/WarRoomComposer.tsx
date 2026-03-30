"use client";

import React from "react";

import { inputStyle, nx, sectionTitleStyle, softCardStyle } from "../ui/nexoraTheme";
import { WAR_ROOM_ACTION_TEMPLATES } from "../../lib/warroom/warRoomActionTemplates";
import type { WarRoomActionKind, WarRoomDraftState, WarRoomOutputMode } from "../../lib/warroom/warRoomTypes";

type WarRoomComposerProps = {
  draft: WarRoomDraftState;
  selectedObjectLabel: string | null;
  onSelectedObjectChange: (nextId: string | null) => void;
  onActionKindChange: (nextKind: WarRoomActionKind | null) => void;
  onOutputModeChange: (nextMode: WarRoomOutputMode) => void;
  onTargetsChange: (targetIds: string[]) => void;
  onLabelChange: (nextValue: string) => void;
  onDescriptionChange: (nextValue: string) => void;
  onParameterChange: (key: string, value: unknown) => void;
};

function parseTargetIds(raw: string): string[] {
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function WarRoomComposer(props: WarRoomComposerProps) {
  const targetValue = props.draft.targetObjectIds.join(", ");
  const intensity = Number(props.draft.parameters?.intensity ?? 0.6);
  const timeHorizon = String(props.draft.parameters?.time_horizon ?? "");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={sectionTitleStyle}>Strategic Source</div>
      <div style={{ ...softCardStyle, padding: 10 }}>
        <div style={{ color: nx.text, fontSize: 12, fontWeight: 600 }}>
          {props.selectedObjectLabel ?? "No source selected"}
        </div>
        <input
          value={props.draft.selectedObjectId ?? ""}
          onChange={(event) => props.onSelectedObjectChange(event.target.value || null)}
          placeholder="Select an object in the scene or enter an object id"
          style={{ ...inputStyle, width: "100%" }}
        />
        <div style={{ color: nx.lowMuted, fontSize: 11 }}>
          The selected scene object pre-fills this field. Running remains explicit.
        </div>
      </div>

      <div style={sectionTitleStyle}>Action</div>
      <div style={{ ...softCardStyle, padding: 10, gap: 8 }}>
        <select
          value={props.draft.actionKind ?? ""}
          onChange={(event) => props.onActionKindChange((event.target.value || null) as WarRoomActionKind | null)}
          style={{ ...inputStyle, width: "100%" }}
        >
          <option value="">Choose strategic action</option>
          {WAR_ROOM_ACTION_TEMPLATES.map((template) => (
            <option key={template.id} value={template.kind}>
              {template.label}
            </option>
          ))}
        </select>
        <input
          value={props.draft.label}
          onChange={(event) => props.onLabelChange(event.target.value)}
          placeholder="Action label"
          style={{ ...inputStyle, width: "100%" }}
        />
        <textarea
          value={props.draft.description}
          onChange={(event) => props.onDescriptionChange(event.target.value)}
          placeholder="Optional strategic note"
          rows={3}
          style={{ ...inputStyle, width: "100%", resize: "vertical" }}
        />
      </div>

      <div style={sectionTitleStyle}>Requested Output</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
        {(["propagation", "decision_path", "mixed"] as WarRoomOutputMode[]).map((mode) => {
          const active = props.draft.outputMode === mode;
          return (
            <button
              key={mode}
              type="button"
              onClick={() => props.onOutputModeChange(mode)}
              style={{
                borderRadius: 10,
                border: `1px solid ${active ? nx.borderStrong : nx.border}`,
                background: active ? "rgba(59,130,246,0.16)" : "rgba(2,6,23,0.42)",
                color: active ? "#dbeafe" : nx.text,
                fontSize: 12,
                fontWeight: 600,
                padding: "10px 8px",
                cursor: "pointer",
              }}
            >
              {mode === "decision_path" ? "Decision Path" : mode === "mixed" ? "Mixed" : "Propagation"}
            </button>
          );
        })}
      </div>

      <div style={sectionTitleStyle}>Targets And Parameters</div>
      <div style={{ ...softCardStyle, padding: 10, gap: 8 }}>
        <input
          value={targetValue}
          onChange={(event) => props.onTargetsChange(parseTargetIds(event.target.value))}
          placeholder="Optional target ids, comma separated"
          style={{ ...inputStyle, width: "100%" }}
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 6, color: nx.muted, fontSize: 11 }}>
            Intensity
            <input
              type="number"
              min={0}
              max={1}
              step={0.05}
              value={Number.isFinite(intensity) ? intensity : 0.6}
              onChange={(event) => props.onParameterChange("intensity", Number(event.target.value))}
              style={{ ...inputStyle, width: "100%" }}
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6, color: nx.muted, fontSize: 11 }}>
            Time Horizon
            <input
              value={timeHorizon}
              onChange={(event) => props.onParameterChange("time_horizon", event.target.value)}
              placeholder="near_term"
              style={{ ...inputStyle, width: "100%" }}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
