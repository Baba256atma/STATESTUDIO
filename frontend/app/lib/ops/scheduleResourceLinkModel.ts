import { ExecutiveResourceIntelligencePublicIndexId } from "./executiveResourceIntelligencePublicIndex.ts";
import type { ScheduleLinkDescriptor } from "./schedulingModelTypes.ts";

const metadata = Object.freeze({
  platformId: "OPS-6:1",
  platformVersion: "1.0.0",
  compatibilityVersion: "1.0.0",
  sourceDependencies: Object.freeze(["OPS-5:9", "OPS-6:1", "OPS-6:2"]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const ScheduleResourceLinkModel = Object.freeze({
  id: "schedule-link-resource",
  name: "Schedule Resource Link",
  description: "Metadata linking schedules to resource intelligence surfaces.",
  linkedEntities: Object.freeze([
    "resource-availability-windows",
    "resource-capacity-bands",
  ]),
  compatibilityMetadata: Object.freeze([
    ExecutiveResourceIntelligencePublicIndexId,
    "resource-window-alignment",
    "resource-readiness-support",
  ]),
  metadata,
} as const satisfies ScheduleLinkDescriptor);
