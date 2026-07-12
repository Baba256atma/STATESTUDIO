import type { ScheduleTimelineDescriptor } from "./schedulingModelTypes.ts";

const metadata = Object.freeze({
  platformId: "OPS-6:1",
  platformVersion: "1.0.0",
  compatibilityVersion: "1.0.0",
  sourceDependencies: Object.freeze(["OPS-6:1", "OPS-6:2"]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const ScheduleTimelineModel = Object.freeze([
  Object.freeze({
    id: "schedule-timeline-executive",
    name: "Executive Timeline",
    description: "Timeline metadata for executive-level schedule sequencing.",
    timelineTypes: Object.freeze(["Strategic", "Operational", "Review"]),
    sequenceMetadata: Object.freeze([
      "timeline-order",
      "timeline-gates",
      "timeline-handoffs",
    ]),
    metadata,
  }),
  Object.freeze({
    id: "schedule-timeline-delivery",
    name: "Delivery Timeline",
    description: "Timeline metadata for delivery-oriented schedule sequencing.",
    timelineTypes: Object.freeze(["Project", "Workflow", "Task"]),
    sequenceMetadata: Object.freeze([
      "dependency-ordering",
      "milestone-alignment",
      "execution-bands",
    ]),
    metadata,
  }),
] as const satisfies readonly ScheduleTimelineDescriptor[]);
