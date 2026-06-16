"use client";

import React from "react";

import {
  RISK_NO_OBJECT_SELECTED_LABEL,
  RISK_OBJECT_CONTEXT_FIELD_LABELS,
  type RiskObjectContext,
} from "../../../../lib/ui/mrpWorkspace/risk/riskObjectContextContract.ts";
import {
  RISK_LOADING_HEADLINE,
  type RiskWorkspaceStatePhase,
} from "../../../../lib/ui/mrpWorkspace/risk/riskWorkspaceStateContract.ts";
import {
  riskObjectContextEmptyStyle,
  riskObjectContextStripStyle,
  riskObjectContextValueStyle,
  riskSectionLabelStyle,
  riskVisualSpacing,
} from "../../../../lib/ui/mrpWorkspace/risk/riskVisualContract.ts";

export type RiskObjectContextPanelProps = Readonly<{
  objectContext: RiskObjectContext;
  phase: RiskWorkspaceStatePhase;
}>;

type ObjectContextFieldKey = keyof typeof RISK_OBJECT_CONTEXT_FIELD_LABELS;

const FIELD_KEYS = Object.freeze([
  "selectedObject",
  "riskStatus",
  "impact",
  "confidence",
] as const satisfies readonly ObjectContextFieldKey[]);

export function RiskObjectContextPanel(
  props: RiskObjectContextPanelProps
): React.ReactElement {
  const muted = props.phase !== "ready" || !props.objectContext.hasSelection;

  if (props.phase === "loading") {
    return (
      <section
        data-nx="risk-object-context"
        data-risk-object-selected="false"
        aria-label="Selected object risk context"
        style={riskObjectContextStripStyle(true)}
      >
        <p style={riskObjectContextEmptyStyle()}>{RISK_LOADING_HEADLINE}</p>
      </section>
    );
  }

  if (!props.objectContext.hasSelection) {
    return (
      <section
        data-nx="risk-object-context"
        data-risk-object-selected="false"
        aria-label="Selected object risk context"
        style={riskObjectContextStripStyle(true)}
      >
        <p style={riskObjectContextEmptyStyle()}>{RISK_NO_OBJECT_SELECTED_LABEL}</p>
      </section>
    );
  }

  return (
    <section
      data-nx="risk-object-context"
      data-risk-object-selected="true"
      aria-label="Selected object risk context"
      style={riskObjectContextStripStyle(muted)}
    >
      {FIELD_KEYS.map((fieldKey) => (
        <div
          key={fieldKey}
          data-risk-object-field={fieldKey}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: riskVisualSpacing.fieldGap,
            minWidth: 0,
          }}
        >
          <div style={riskSectionLabelStyle()}>
            {RISK_OBJECT_CONTEXT_FIELD_LABELS[fieldKey]}
          </div>
          <div style={riskObjectContextValueStyle(muted)}>
            {props.objectContext[fieldKey]}
          </div>
        </div>
      ))}
    </section>
  );
}

export default RiskObjectContextPanel;
