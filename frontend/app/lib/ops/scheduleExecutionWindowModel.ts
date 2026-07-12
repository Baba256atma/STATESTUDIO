import type { ScheduleExecutionWindowDescriptor } from "./schedulingModelTypes.ts";

const metadata = Object.freeze({
  platformId: "OPS-6:1",
  platformVersion: "1.0.0",
  compatibilityVersion: "1.0.0",
  sourceDependencies: Object.freeze(["OPS-6:1", "OPS-6:2"]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const ScheduleExecutionWindowModel = Object.freeze([
  Object.freeze({
    id: "schedule-window-standard",
    name: "Standard Execution Window",
    description: "Execution window metadata for standard delivery periods.",
    windowTypes: Object.freeze(["Planned", "Committed", "Buffered"]),
    timingMetadata: Object.freeze([
      "window-boundary",
      "window-flexibility",
      "window-readiness",
    ]),
    metadata,
  }),
  Object.freeze({
    id: "schedule-window-constrained",
    name: "Constrained Execution Window",
    description: "Execution window metadata for dependency-constrained work periods.",
    windowTypes: Object.freeze(["Fixed", "Conditional", "Restricted"]),
    timingMetadata: Object.freeze([
      "dependency-gates",
      "resource-alignment",
      "calendar-exceptions",
    ]),
    metadata,
  }),
] as const satisfies readonly ScheduleExecutionWindowDescriptor[]);
