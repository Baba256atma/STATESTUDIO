"use client";

import React from "react";

import {
  WAR_ROOM_WORKSPACE_CONTEXT_FIELD_LABELS,
  type WarRoomWorkspaceContext,
} from "../../../../lib/ui/mrpWorkspace/warRoom/warRoomWorkspaceContextContract.ts";
import {
  warRoomSectionLabelStyle,
  warRoomVisualSpacing,
  warRoomWorkspaceContextStripStyle,
  warRoomWorkspaceContextValueStyle,
} from "../../../../lib/ui/mrpWorkspace/warRoom/warRoomVisualContract.ts";

export type WarRoomWorkspaceContextPanelProps = Readonly<{
  workspaceContext: WarRoomWorkspaceContext;
  phase: "loading" | "ready" | "empty";
}>;

type ContextFieldKey = keyof typeof WAR_ROOM_WORKSPACE_CONTEXT_FIELD_LABELS;

const FIELD_KEYS = Object.freeze([
  "selectedObject",
  "strategyFocus",
  "activeDecision",
  "commitmentStatus",
] as const satisfies readonly ContextFieldKey[]);

export function WarRoomWorkspaceContextPanel(
  props: WarRoomWorkspaceContextPanelProps
): React.ReactElement {
  const muted = props.phase !== "ready" || !props.workspaceContext.hasSelection;

  return (
    <section
      data-nx="war-room-workspace-context"
      data-war-room-object-selected={props.workspaceContext.hasSelection ? "true" : "false"}
      aria-label="War Room workspace context"
      style={warRoomWorkspaceContextStripStyle(muted)}
    >
      {FIELD_KEYS.map((fieldKey) => (
        <div
          key={fieldKey}
          data-war-room-context-field={fieldKey}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: warRoomVisualSpacing.fieldGap,
            minWidth: 0,
          }}
        >
          <div style={warRoomSectionLabelStyle()}>
            {WAR_ROOM_WORKSPACE_CONTEXT_FIELD_LABELS[fieldKey]}
          </div>
          <div style={warRoomWorkspaceContextValueStyle(muted)}>
            {props.workspaceContext[fieldKey]}
          </div>
        </div>
      ))}
    </section>
  );
}

export default WarRoomWorkspaceContextPanel;
