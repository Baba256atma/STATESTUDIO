"use client";

import React from "react";

import {
  OPERATIONAL_OBJECT_CONTEXT_FIELD_LABELS,
  type OperationalObjectContext,
} from "../../../../lib/ui/mrpWorkspace/operational/operationalObjectContextContract.ts";
import {
  operationalObjectContextStripStyle,
  operationalObjectContextValueStyle,
  operationalSectionLabelStyle,
  operationalVisualSpacing,
} from "../../../../lib/ui/mrpWorkspace/operational/operationalVisualContract.ts";

export type OperationalObjectContextPanelProps = Readonly<{
  objectContext: OperationalObjectContext;
  phase: "loading" | "ready" | "empty";
}>;

type ObjectContextFieldKey = keyof typeof OPERATIONAL_OBJECT_CONTEXT_FIELD_LABELS;

const FIELD_KEYS = Object.freeze([
  "selectedObject",
  "objectOperationalStatus",
  "objectActivityLevel",
  "objectAttentionPriority",
] as const satisfies readonly ObjectContextFieldKey[]);

export function OperationalObjectContextPanel(
  props: OperationalObjectContextPanelProps
): React.ReactElement {
  const muted = props.phase !== "ready" || !props.objectContext.hasSelection;

  return (
    <section
      data-nx="operational-object-context"
      data-operational-object-selected={props.objectContext.hasSelection ? "true" : "false"}
      aria-label="Selected object operational context"
      style={operationalObjectContextStripStyle(muted)}
    >
      {FIELD_KEYS.map((fieldKey) => (
        <div
          key={fieldKey}
          data-operational-object-field={fieldKey}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: operationalVisualSpacing.fieldGap,
            minWidth: 0,
          }}
        >
          <div style={operationalSectionLabelStyle()}>
            {OPERATIONAL_OBJECT_CONTEXT_FIELD_LABELS[fieldKey]}
          </div>
          <div style={operationalObjectContextValueStyle(muted)}>
            {props.objectContext[fieldKey]}
          </div>
        </div>
      ))}
    </section>
  );
}

export default OperationalObjectContextPanel;
