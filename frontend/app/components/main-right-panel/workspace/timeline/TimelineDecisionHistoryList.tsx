"use client";

import React from "react";

import {
  TIMELINE_DECISION_HISTORY_COLUMN_LABELS,
  type TimelineDecisionHistoryRow,
} from "../../../../lib/ui/mrpWorkspace/timeline/timelineVisualSurfaceContract.ts";
import {
  timelineDecisionHistoryListStyle,
  timelineEventsCellStyle,
  timelineEventsEmptyStyle,
  timelineEventsHeaderCellStyle,
  timelineEventsHeaderRowStyle,
  timelineEventsRowStyle,
  timelineSectionLabelStyle,
} from "../../../../lib/ui/mrpWorkspace/timeline/timelineVisualContract.ts";

export type TimelineDecisionHistoryListProps = Readonly<{
  rows: readonly TimelineDecisionHistoryRow[];
  emptyMessage: string | null;
  phase: "loading" | "ready" | "empty";
}>;

type ColumnKey = keyof typeof TIMELINE_DECISION_HISTORY_COLUMN_LABELS;

const COLUMN_KEYS = Object.freeze([
  "decision",
  "date",
  "status",
] as const satisfies readonly ColumnKey[]);

const GRID_COLUMNS = "minmax(0, 1.4fr) minmax(0, 0.8fr) minmax(0, 0.8fr)";

export function TimelineDecisionHistoryList(
  props: TimelineDecisionHistoryListProps
): React.ReactElement {
  const loading = props.phase === "loading";
  const showEmpty = !loading && props.rows.length === 0;

  return (
    <section
      data-nx="timeline-decision-history-list"
      data-timeline-visual-section="decision_history"
      aria-label="Decision history"
      style={timelineDecisionHistoryListStyle()}
    >
      <div style={timelineSectionLabelStyle()}>Decision History</div>

      <div style={timelineEventsHeaderRowStyle(GRID_COLUMNS)} aria-hidden="true">
        {COLUMN_KEYS.map((columnKey) => (
          <div key={columnKey} style={timelineEventsHeaderCellStyle()}>
            {TIMELINE_DECISION_HISTORY_COLUMN_LABELS[columnKey]}
          </div>
        ))}
      </div>

      {loading ? (
        <p style={timelineEventsEmptyStyle()}>Loading…</p>
      ) : showEmpty ? (
        <p style={timelineEventsEmptyStyle()}>{props.emptyMessage ?? "No decision history."}</p>
      ) : (
        props.rows.map((row, index) => (
          <div
            key={`${row.decision}:${row.date}:${index}`}
            data-timeline-decision-history-row={index}
            style={{
              ...timelineEventsRowStyle(GRID_COLUMNS),
              borderBottom:
                index === props.rows.length - 1
                  ? "none"
                  : timelineEventsRowStyle(GRID_COLUMNS).borderBottom,
            }}
          >
            <div style={timelineEventsCellStyle()}>{row.decision}</div>
            <div style={timelineEventsCellStyle()}>{row.date}</div>
            <div style={timelineEventsCellStyle()}>{row.status}</div>
          </div>
        ))
      )}
    </section>
  );
}

export default TimelineDecisionHistoryList;
