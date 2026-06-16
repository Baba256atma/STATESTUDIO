"use client";

import React from "react";

import {
  EXECUTIVE_SUMMARY_OBJECT_CONTEXT_FIELD_LABELS,
  type ExecutiveSummaryObjectContext,
} from "../../../../lib/ui/mrpWorkspace/executiveSummary/executiveSummaryObjectContextContract.ts";
import {
  executiveSummaryObjectContextStripStyle,
  executiveSummaryObjectContextValueStyle,
  executiveSummarySectionLabelStyle,
  executiveSummaryVisualSpacing,
} from "../../../../lib/ui/mrpWorkspace/executiveSummary/executiveSummaryVisualContract.ts";

export type ExecutiveSummaryObjectContextPanelProps = Readonly<{
  objectContext: ExecutiveSummaryObjectContext;
  phase: "loading" | "ready" | "empty";
}>;

type ObjectContextFieldKey = keyof typeof EXECUTIVE_SUMMARY_OBJECT_CONTEXT_FIELD_LABELS;

const FIELD_KEYS = Object.freeze([
  "selectedObject",
  "objectStatus",
  "objectPriority",
  "objectAttentionLevel",
] as const satisfies readonly ObjectContextFieldKey[]);

export function ExecutiveSummaryObjectContextPanel(
  props: ExecutiveSummaryObjectContextPanelProps
): React.ReactElement {
  const muted = props.phase !== "ready" || !props.objectContext.hasSelection;

  return (
    <section
      data-nx="executive-summary-object-context"
      data-executive-summary-object-selected={props.objectContext.hasSelection ? "true" : "false"}
      aria-label="Selected object context"
      style={executiveSummaryObjectContextStripStyle(muted)}
    >
      {FIELD_KEYS.map((fieldKey) => (
        <div
          key={fieldKey}
          data-executive-summary-object-field={fieldKey}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: executiveSummaryVisualSpacing.fieldGap,
            minWidth: 0,
          }}
        >
          <div style={executiveSummarySectionLabelStyle()}>
            {EXECUTIVE_SUMMARY_OBJECT_CONTEXT_FIELD_LABELS[fieldKey]}
          </div>
          <div style={executiveSummaryObjectContextValueStyle(muted)}>
            {props.objectContext[fieldKey]}
          </div>
        </div>
      ))}
    </section>
  );
}

export default ExecutiveSummaryObjectContextPanel;
