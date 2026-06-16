"use client";

import React from "react";

import {
  TIMELINE_NO_OBJECT_SELECTED_LABEL,
  TIMELINE_OBJECT_CONTEXT_FIELD_LABELS,
  type TimelineObjectContext,
} from "../../../../lib/ui/mrpWorkspace/timeline/timelineObjectContextContract.ts";
import {
  TIMELINE_LOADING_HEADLINE,
  type TimelineWorkspaceStatePhase,
} from "../../../../lib/ui/mrpWorkspace/timeline/timelineWorkspaceStateContract.ts";
import {
  timelineObjectContextEmptyStyle,
  timelineObjectContextStripStyle,
  timelineObjectContextValueStyle,
  timelineSectionLabelStyle,
  timelineVisualSpacing,
} from "../../../../lib/ui/mrpWorkspace/timeline/timelineVisualContract.ts";

export type TimelineObjectContextPanelProps = Readonly<{
  objectContext: TimelineObjectContext;
  phase: TimelineWorkspaceStatePhase;
}>;

type ObjectContextFieldKey = keyof typeof TIMELINE_OBJECT_CONTEXT_FIELD_LABELS;

const FIELD_KEYS = Object.freeze([
  "selectedObject",
  "lastActivity",
  "lastChange",
  "recentEventsCount",
] as const satisfies readonly ObjectContextFieldKey[]);

export function TimelineObjectContextPanel(
  props: TimelineObjectContextPanelProps
): React.ReactElement {
  const muted = props.phase !== "ready" || !props.objectContext.hasSelection;

  if (props.phase === "loading") {
    return (
      <section
        data-nx="timeline-object-context"
        data-timeline-object-selected="false"
        aria-label="Selected object timeline context"
        style={timelineObjectContextStripStyle(true)}
      >
        <p style={timelineObjectContextEmptyStyle()}>{TIMELINE_LOADING_HEADLINE}</p>
      </section>
    );
  }

  if (!props.objectContext.hasSelection) {
    return (
      <section
        data-nx="timeline-object-context"
        data-timeline-object-selected="false"
        aria-label="Selected object timeline context"
        style={timelineObjectContextStripStyle(true)}
      >
        <p style={timelineObjectContextEmptyStyle()}>{TIMELINE_NO_OBJECT_SELECTED_LABEL}</p>
      </section>
    );
  }

  return (
    <section
      data-nx="timeline-object-context"
      data-timeline-object-selected="true"
      aria-label="Selected object timeline context"
      style={timelineObjectContextStripStyle(muted)}
    >
      {FIELD_KEYS.map((fieldKey) => (
        <div
          key={fieldKey}
          data-timeline-object-field={fieldKey}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: timelineVisualSpacing.fieldGap,
            minWidth: 0,
          }}
        >
          <div style={timelineSectionLabelStyle()}>
            {TIMELINE_OBJECT_CONTEXT_FIELD_LABELS[fieldKey]}
          </div>
          <div style={timelineObjectContextValueStyle(muted)}>
            {props.objectContext[fieldKey]}
          </div>
        </div>
      ))}
    </section>
  );
}

export default TimelineObjectContextPanel;
