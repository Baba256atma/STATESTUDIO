import type { ScheduleMilestoneDescriptor } from "./schedulingModelTypes.ts";

const metadata = Object.freeze({
  platformId: "OPS-6:1",
  platformVersion: "1.0.0",
  compatibilityVersion: "1.0.0",
  sourceDependencies: Object.freeze(["OPS-6:1", "OPS-6:2"]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const ScheduleMilestoneModel = Object.freeze([
  Object.freeze({
    id: "schedule-milestone-delivery",
    name: "Delivery Milestone",
    description: "Milestone metadata for delivery checkpoints and stage completions.",
    milestoneTypes: Object.freeze(["Checkpoint", "Stage Gate", "Release"]),
    milestoneTimingMetadata: Object.freeze([
      "completion-window",
      "approval-dependency",
      "readiness-threshold",
    ]),
    metadata,
  }),
  Object.freeze({
    id: "schedule-milestone-executive",
    name: "Executive Milestone",
    description: "Milestone metadata for executive review and decision checkpoints.",
    milestoneTypes: Object.freeze(["Review", "Decision", "Governance"]),
    milestoneTimingMetadata: Object.freeze([
      "review-window",
      "decision-cadence",
      "governance-boundary",
    ]),
    metadata,
  }),
] as const satisfies readonly ScheduleMilestoneDescriptor[]);
