"use client";

import React from "react";

import {
  SCENARIO_AUTHORING_UI_FIELD_LABELS,
  type ScenarioAuthoringDraftView,
  type ScenarioAuthoringUiPhase,
} from "../../../../lib/ui/mrpWorkspace/scenario/scenarioAuthoringUiContract.ts";
import {
  scenarioCardStyle,
  scenarioSectionLabelStyle,
  scenarioVisualSpacing,
  scenarioWorkspaceContextStripStyle,
  scenarioWorkspaceContextValueStyle,
} from "../../../../lib/ui/mrpWorkspace/scenario/scenarioVisualContract.ts";
import type { ScenarioWorkspaceCardTone } from "../../../../lib/ui/mrpWorkspace/scenario/scenarioWorkspaceContract.ts";

export type ScenarioAuthoringDraftPanelProps = Readonly<{
  draft: ScenarioAuthoringDraftView;
  phase: ScenarioAuthoringUiPhase;
}>;

function resolveValidationTone(state: ScenarioAuthoringDraftView["validationState"]): ScenarioWorkspaceCardTone {
  if (state === "valid") return "success";
  if (state === "invalid") return "critical";
  return "warning";
}

const FIELD_KEYS = Object.freeze([
  "draftName",
  "draftType",
  "draftSummary",
  "validationState",
] as const satisfies readonly (keyof typeof SCENARIO_AUTHORING_UI_FIELD_LABELS)[]);

function resolveFieldValue(
  draft: ScenarioAuthoringDraftView,
  fieldKey: (typeof FIELD_KEYS)[number]
): string {
  if (fieldKey === "validationState") return draft.validationLabel;
  return draft[fieldKey];
}

export function ScenarioAuthoringDraftPanel(
  props: ScenarioAuthoringDraftPanelProps
): React.ReactElement {
  const muted = props.phase !== "ready" || !props.draft.hasDraft;
  const validationTone = resolveValidationTone(props.draft.validationState);

  return (
    <section
      data-nx="scenario-authoring-draft"
      data-scenario-authoring-ui="true"
      data-scenario-authoring-phase={props.phase}
      data-scenario-authoring-has-draft={props.draft.hasDraft ? "true" : "false"}
      data-scenario-authoring-validation={props.draft.validationState}
      aria-label="Scenario authoring draft"
      style={{
        ...scenarioCardStyle(muted ? "muted" : validationTone),
        display: "flex",
        flexDirection: "column",
        gap: scenarioVisualSpacing.sectionGap,
      }}
    >
      <div style={scenarioSectionLabelStyle()}>Scenario Draft</div>

      <div style={scenarioWorkspaceContextStripStyle(muted)}>
        {FIELD_KEYS.map((fieldKey) => (
          <div
            key={fieldKey}
            data-scenario-authoring-field={fieldKey}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: scenarioVisualSpacing.fieldGap,
              minWidth: 0,
            }}
          >
            <div style={scenarioSectionLabelStyle()}>
              {SCENARIO_AUTHORING_UI_FIELD_LABELS[fieldKey]}
            </div>
            <div
              style={scenarioWorkspaceContextValueStyle(muted && fieldKey !== "validationState")}
              data-scenario-authoring-value={fieldKey}
            >
              {resolveFieldValue(props.draft, fieldKey)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ScenarioAuthoringDraftPanel;
