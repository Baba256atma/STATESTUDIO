import { ExecutiveTaskIntelligencePublicIndexId } from "./executiveTaskIntelligencePublicIndex.ts";
import type { ScheduleLinkDescriptor } from "./schedulingModelTypes.ts";

const metadata = Object.freeze({
  platformId: "OPS-6:1",
  platformVersion: "1.0.0",
  compatibilityVersion: "1.0.0",
  sourceDependencies: Object.freeze(["OPS-2:9", "OPS-6:1", "OPS-6:2"]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const ScheduleTaskLinkModel = Object.freeze({
  id: "schedule-link-task",
  name: "Schedule Task Link",
  description: "Metadata linking schedules to task intelligence surfaces.",
  linkedEntities: Object.freeze([
    "task-readiness-windows",
    "task-dependency-timing",
  ]),
  compatibilityMetadata: Object.freeze([
    ExecutiveTaskIntelligencePublicIndexId,
    "task-window-alignment",
    "task-priority-support",
  ]),
  metadata,
} as const satisfies ScheduleLinkDescriptor);
