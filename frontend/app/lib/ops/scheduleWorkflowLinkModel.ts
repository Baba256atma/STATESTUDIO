import { ExecutiveWorkflowIntelligencePublicIndexId } from "./executiveWorkflowIntelligencePublicIndex.ts";
import type { ScheduleLinkDescriptor } from "./schedulingModelTypes.ts";

const metadata = Object.freeze({
  platformId: "OPS-6:1",
  platformVersion: "1.0.0",
  compatibilityVersion: "1.0.0",
  sourceDependencies: Object.freeze(["OPS-3:9", "OPS-6:1", "OPS-6:2"]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const ScheduleWorkflowLinkModel = Object.freeze({
  id: "schedule-link-workflow",
  name: "Schedule Workflow Link",
  description: "Metadata linking schedules to workflow intelligence surfaces.",
  linkedEntities: Object.freeze([
    "workflow-sequences",
    "workflow-transition-windows",
  ]),
  compatibilityMetadata: Object.freeze([
    ExecutiveWorkflowIntelligencePublicIndexId,
    "workflow-gate-alignment",
    "workflow-readiness-support",
  ]),
  metadata,
} as const satisfies ScheduleLinkDescriptor);
