"use client";

import React from "react";

import {
  SCENARIO_WORKSPACE_CONTEXT_FIELD_LABELS,
  type ScenarioWorkspaceContext,
} from "../../../../lib/ui/mrpWorkspace/scenario/scenarioWorkspaceContextContract.ts";
import {
  scenarioSectionLabelStyle,
  scenarioVisualSpacing,
  scenarioWorkspaceContextStripStyle,
  scenarioWorkspaceContextValueStyle,
} from "../../../../lib/ui/mrpWorkspace/scenario/scenarioVisualContract.ts";

export type ScenarioWorkspaceContextPanelProps = Readonly<{
  workspaceContext: ScenarioWorkspaceContext;
  phase: "loading" | "ready" | "empty";
}>;

type ContextFieldKey = keyof typeof SCENARIO_WORKSPACE_CONTEXT_FIELD_LABELS;

const FIELD_KEYS = Object.freeze([
  "selectedObject",
  "explorationScope",
  "comparisonMode",
  "projectionHorizon",
] as const satisfies readonly ContextFieldKey[]);

export function ScenarioWorkspaceContextPanel(
  props: ScenarioWorkspaceContextPanelProps
): React.ReactElement {
  const muted = props.phase !== "ready" || !props.workspaceContext.hasSelection;

  return (
    <section
      data-nx="scenario-workspace-context"
      data-scenario-object-selected={props.workspaceContext.hasSelection ? "true" : "false"}
      aria-label="Scenario workspace context"
      style={scenarioWorkspaceContextStripStyle(muted)}
    >
      {FIELD_KEYS.map((fieldKey) => (
        <div
          key={fieldKey}
          data-scenario-context-field={fieldKey}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: scenarioVisualSpacing.fieldGap,
            minWidth: 0,
          }}
        >
          <div style={scenarioSectionLabelStyle()}>
            {SCENARIO_WORKSPACE_CONTEXT_FIELD_LABELS[fieldKey]}
          </div>
          <div style={scenarioWorkspaceContextValueStyle(muted)}>
            {props.workspaceContext[fieldKey]}
          </div>
        </div>
      ))}
    </section>
  );
}

export default ScenarioWorkspaceContextPanel;
