"use client";

import React from "react";

import {
  TIMELINE_RECENT_EVENTS_COLUMN_LABELS,
  type TimelineRecentEventRow,
} from "../../../../lib/ui/mrpWorkspace/timeline/timelineVisualSurfaceContract.ts";
import {
  timelineEventsCategoryCellStyle,
  timelineEventsCellStyle,
  timelineEventsEmptyStyle,
  timelineEventsHeaderCellStyle,
  timelineEventsHeaderRowStyle,
  timelineEventsListStyle,
  timelineEventsRowStyle,
  timelineSectionLabelStyle,
} from "../../../../lib/ui/mrpWorkspace/timeline/timelineVisualContract.ts";

export type TimelineRecentEventsListProps = Readonly<{
  rows: readonly TimelineRecentEventRow[];
  emptyMessage: string | null;
  phase: "loading" | "ready" | "empty";
}>;

type ColumnKey = keyof typeof TIMELINE_RECENT_EVENTS_COLUMN_LABELS;

const COLUMN_KEYS = Object.freeze([
  "time",
  "event",
  "category",
] as const satisfies readonly ColumnKey[]);

const GRID_COLUMNS = "minmax(0, 0.7fr) minmax(0, 1.5fr) minmax(0, 0.8fr)";

export function TimelineRecentEventsList(
  props: TimelineRecentEventsListProps
): React.ReactElement {
  const loading = props.phase === "loading";
  const showEmpty = !loading && props.rows.length === 0;

  return (
    <section
      data-nx="timeline-recent-events-list"
      data-timeline-visual-section="recent_events"
      aria-label="Recent events"
      style={timelineEventsListStyle()}
    >
      <div style={timelineSectionLabelStyle()}>Recent Events</div>

      <div style={timelineEventsHeaderRowStyle(GRID_COLUMNS)} aria-hidden="true">
        {COLUMN_KEYS.map((columnKey) => (
          <div key={columnKey} style={timelineEventsHeaderCellStyle()}>
            {TIMELINE_RECENT_EVENTS_COLUMN_LABELS[columnKey]}
          </div>
        ))}
      </div>

      {loading ? (
        <p style={timelineEventsEmptyStyle()}>Loading…</p>
      ) : showEmpty ? (
        <p style={timelineEventsEmptyStyle()}>{props.emptyMessage ?? "No recent events."}</p>
      ) : (
        props.rows.map((row, index) => (
          <div
            key={`${row.time}:${row.event}:${index}`}
            data-timeline-recent-event-row={index}
            style={{
              ...timelineEventsRowStyle(GRID_COLUMNS),
              borderBottom:
                index === props.rows.length - 1 ? "none" : timelineEventsRowStyle(GRID_COLUMNS).borderBottom,
            }}
          >
            <div style={timelineEventsCellStyle()}>{row.time}</div>
            <div style={timelineEventsCellStyle()}>{row.event}</div>
            <div style={timelineEventsCategoryCellStyle(row.category)}>{row.category}</div>
          </div>
        ))
      )}
    </section>
  );
}

export default TimelineRecentEventsList;
