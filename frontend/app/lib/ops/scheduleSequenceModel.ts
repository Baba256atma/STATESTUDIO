import type { ScheduleSequenceDescriptor } from "./schedulingModelTypes.ts";

const metadata = Object.freeze({
  platformId: "OPS-6:1",
  platformVersion: "1.0.0",
  compatibilityVersion: "1.0.0",
  sourceDependencies: Object.freeze(["OPS-6:1", "OPS-6:2"]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const ScheduleSequenceModel = Object.freeze([
  Object.freeze({
    id: "schedule-sequence-linear",
    name: "Linear Sequence",
    description: "Sequencing metadata for linear schedule progressions.",
    sequenceTypes: Object.freeze(["Ordered", "Progressive", "Stage-Based"]),
    sequenceOrderingMetadata: Object.freeze([
      "sequence-order",
      "handoff-rules",
      "checkpoint-pacing",
    ]),
    metadata,
  }),
  Object.freeze({
    id: "schedule-sequence-parallel",
    name: "Parallel Sequence",
    description: "Sequencing metadata for parallel and coordinated schedule progressions.",
    sequenceTypes: Object.freeze(["Parallel", "Coordinated", "Merged"]),
    sequenceOrderingMetadata: Object.freeze([
      "coordination-window",
      "sync-points",
      "completion-threshold",
    ]),
    metadata,
  }),
] as const satisfies readonly ScheduleSequenceDescriptor[]);
