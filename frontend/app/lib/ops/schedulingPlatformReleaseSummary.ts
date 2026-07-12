import { SchedulingIntelligenceIdentity } from "./schedulingIntelligenceIndex.ts";
import {
  SchedulingPlatformPhaseRegistry,
  buildSchedulingPlatformManifest,
} from "./schedulingPlatformManifestIndex.ts";
import { getSchedulingValidationStatus } from "./schedulingValidationIndex.ts";
import { ExecutiveSchedulingPlatformPublicRegistry } from "./schedulingPlatformPublicRegistry.ts";
import type { SchedulingPlatformReleaseSummaryDescriptor } from "./schedulingPlatformIndexTypes.ts";

const manifest = buildSchedulingPlatformManifest();
const manifestStatus =
  manifest.releaseReadinessMetadata.readinessState === "Ready" ? "PASS" : "FAIL";

export const ExecutiveSchedulingPlatformReleaseSummary = Object.freeze({
  platformId: SchedulingIntelligenceIdentity.platformId,
  platformVersion: SchedulingIntelligenceIdentity.platformVersion,
  phaseCount: SchedulingPlatformPhaseRegistry.length,
  validationStatus: getSchedulingValidationStatus(),
  manifestStatus,
  publicApiStatus: ExecutiveSchedulingPlatformPublicRegistry.publicApiStatus,
  taskCompatibilityStatus: manifest.taskCompatibilitySummary.compatibilityStatus,
  workflowCompatibilityStatus:
    manifest.workflowCompatibilitySummary.compatibilityStatus,
  projectCompatibilityStatus: manifest.projectCompatibilitySummary.compatibilityStatus,
  resourceCompatibilityStatus:
    manifest.resourceCompatibilitySummary.compatibilityStatus,
  releaseReadiness:
    getSchedulingValidationStatus() === "PASS" &&
    manifestStatus === "PASS" &&
    manifest.taskCompatibilitySummary.compatibilityStatus === "PASS" &&
    manifest.workflowCompatibilitySummary.compatibilityStatus === "PASS" &&
    manifest.projectCompatibilitySummary.compatibilityStatus === "PASS" &&
    manifest.resourceCompatibilitySummary.compatibilityStatus === "PASS"
      ? "Ready"
      : "Blocked",
  certificationState: "Pending",
  architectureCompleteness: "Complete",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies SchedulingPlatformReleaseSummaryDescriptor);
