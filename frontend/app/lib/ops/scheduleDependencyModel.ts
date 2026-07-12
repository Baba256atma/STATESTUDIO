import type { ScheduleDependencyDescriptor } from "./schedulingModelTypes.ts";

const metadata = Object.freeze({
  platformId: "OPS-6:1",
  platformVersion: "1.0.0",
  compatibilityVersion: "1.0.0",
  sourceDependencies: Object.freeze(["OPS-6:1", "OPS-6:2"]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const ScheduleDependencyModel = Object.freeze([
  Object.freeze({
    id: "schedule-dependency-prerequisite",
    name: "Prerequisite Dependency",
    description: "Temporal dependency metadata for prerequisite schedule relationships.",
    dependencyTypes: Object.freeze(["Finish-to-Start", "Start-to-Start", "Gate-to-Start"]),
    dependencyTimingMetadata: Object.freeze([
      "dependency-offset",
      "lag-band",
      "handoff-window",
    ]),
    metadata,
  }),
  Object.freeze({
    id: "schedule-dependency-constraint",
    name: "Constraint Dependency",
    description: "Temporal dependency metadata for constrained and conditional schedule relationships.",
    dependencyTypes: Object.freeze(["Calendar Constraint", "Resource Constraint", "Approval Constraint"]),
    dependencyTimingMetadata: Object.freeze([
      "constraint-window",
      "calendar-boundary",
      "conditional-entry",
    ]),
    metadata,
  }),
] as const satisfies readonly ScheduleDependencyDescriptor[]);
