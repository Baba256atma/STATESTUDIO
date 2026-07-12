import { SchedulingIntelligencePlatformId } from "./schedulingIntelligenceIndex.ts";
import {
  SchedulingPlatformMetadata,
  SchedulingSupportedDomains,
} from "./schedulingMetadataIndex.ts";
import type { SchedulingModelIdentity } from "./schedulingModelTypes.ts";

const metadata = Object.freeze({
  platformId: SchedulingPlatformMetadata.platformId,
  platformVersion: SchedulingPlatformMetadata.platformVersion,
  compatibilityVersion: SchedulingPlatformMetadata.compatibilityVersion,
  sourceDependencies: Object.freeze([
    "OPS-1:9",
    "OPS-2:9",
    "OPS-3:9",
    "OPS-4:9",
    "OPS-5:9",
    "OPS-6:1",
    "OPS-6:2",
  ]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const ScheduleIdentityModel = Object.freeze({
  scheduleIdPattern: "ops-schedule-{scope}-{descriptor}",
  displayName: "Executive Scheduling Intelligence Model",
  description:
    "Canonical metadata-only scheduling identity and classification model for executive operations.",
  supportedCategories: Object.freeze(
    SchedulingSupportedDomains.map((domain) => domain.name),
  ),
  sourcePlatform: SchedulingIntelligencePlatformId,
  scheduleClassification: Object.freeze([
    "Executive Schedule",
    "Project Schedule",
    "Workflow Schedule",
    "Task Schedule",
    "Resource Schedule",
    "Milestone Schedule",
    "Calendar Schedule",
    "Dependency Schedule",
  ]),
  metadata,
} as const satisfies SchedulingModelIdentity & {
  readonly scheduleClassification: readonly string[];
});
