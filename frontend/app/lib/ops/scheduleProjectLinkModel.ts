import { ExecutiveProjectExecutionPublicIndexId } from "./executiveProjectExecutionPublicIndex.ts";
import type { ScheduleLinkDescriptor } from "./schedulingModelTypes.ts";

const metadata = Object.freeze({
  platformId: "OPS-6:1",
  platformVersion: "1.0.0",
  compatibilityVersion: "1.0.0",
  sourceDependencies: Object.freeze(["OPS-4:9", "OPS-6:1", "OPS-6:2"]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const ScheduleProjectLinkModel = Object.freeze({
  id: "schedule-link-project",
  name: "Schedule Project Link",
  description: "Metadata linking schedules to project execution surfaces.",
  linkedEntities: Object.freeze([
    "project-milestone-calendars",
    "project-timeline-windows",
  ]),
  compatibilityMetadata: Object.freeze([
    ExecutiveProjectExecutionPublicIndexId,
    "project-readiness-alignment",
    "project-milestone-support",
  ]),
  metadata,
} as const satisfies ScheduleLinkDescriptor);
