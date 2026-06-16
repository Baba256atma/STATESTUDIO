"use client";

import React from "react";

import {
  ADVISORY_WORKSPACE_CONTEXT_FIELD_LABELS,
  type AdvisoryWorkspaceContext,
} from "../../../../lib/ui/mrpWorkspace/advisory/advisoryWorkspaceContextContract.ts";
import {
  advisorySectionLabelStyle,
  advisoryVisualSpacing,
  advisoryWorkspaceContextStripStyle,
  advisoryWorkspaceContextValueStyle,
} from "../../../../lib/ui/mrpWorkspace/advisory/advisoryVisualContract.ts";

export type AdvisoryWorkspaceContextPanelProps = Readonly<{
  workspaceContext: AdvisoryWorkspaceContext;
  phase: "loading" | "ready" | "empty";
}>;

type ContextFieldKey = keyof typeof ADVISORY_WORKSPACE_CONTEXT_FIELD_LABELS;

const FIELD_KEYS = Object.freeze([
  "selectedObject",
  "recommendationFocus",
  "confidenceLevel",
  "reviewScope",
] as const satisfies readonly ContextFieldKey[]);

export function AdvisoryWorkspaceContextPanel(
  props: AdvisoryWorkspaceContextPanelProps
): React.ReactElement {
  const muted = props.phase !== "ready" || !props.workspaceContext.hasSelection;

  return (
    <section
      data-nx="advisory-workspace-context"
      data-advisory-object-selected={props.workspaceContext.hasSelection ? "true" : "false"}
      aria-label="Advisory workspace context"
      style={advisoryWorkspaceContextStripStyle(muted)}
    >
      {FIELD_KEYS.map((fieldKey) => (
        <div
          key={fieldKey}
          data-advisory-context-field={fieldKey}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: advisoryVisualSpacing.fieldGap,
            minWidth: 0,
          }}
        >
          <div style={advisorySectionLabelStyle()}>
            {ADVISORY_WORKSPACE_CONTEXT_FIELD_LABELS[fieldKey]}
          </div>
          <div style={advisoryWorkspaceContextValueStyle(muted)}>
            {props.workspaceContext[fieldKey]}
          </div>
        </div>
      ))}
    </section>
  );
}

export default AdvisoryWorkspaceContextPanel;
