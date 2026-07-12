import type { ScheduleConstraintDescriptor } from "./schedulingModelTypes.ts";

const metadata = Object.freeze({
  platformId: "OPS-6:1",
  platformVersion: "1.0.0",
  compatibilityVersion: "1.0.0",
  sourceDependencies: Object.freeze(["OPS-6:1", "OPS-6:2"]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const ScheduleConstraintModel = Object.freeze([
  Object.freeze({
    id: "schedule-constraint-calendar",
    name: "Calendar Constraint",
    description: "Constraint metadata for calendar-driven scheduling boundaries.",
    constraintTypes: Object.freeze(["Working Period", "Holiday", "Blackout"]),
    constraintMetadata: Object.freeze([
      "calendar-boundary",
      "exception-policy",
      "regional-override",
    ]),
    metadata,
  }),
  Object.freeze({
    id: "schedule-constraint-execution",
    name: "Execution Constraint",
    description: "Constraint metadata for execution readiness and dependency-driven boundaries.",
    constraintTypes: Object.freeze(["Dependency Gate", "Resource Gate", "Approval Gate"]),
    constraintMetadata: Object.freeze([
      "entry-criteria",
      "timing-buffer",
      "constraint-priority",
    ]),
    metadata,
  }),
] as const satisfies readonly ScheduleConstraintDescriptor[]);
