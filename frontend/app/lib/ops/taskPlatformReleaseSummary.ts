import { TaskIntelligenceIdentity } from "./taskIntelligenceIndex.ts";
import {
  TaskPlatformPhaseRegistry,
  buildTaskPlatformManifest,
} from "./taskPlatformManifestIndex.ts";
import { getTaskValidationStatus } from "./taskValidationIndex.ts";
import { ExecutiveTaskIntelligencePlatformPublicRegistry } from "./taskPlatformPublicRegistry.ts";
import type { TaskPlatformReleaseSummaryDescriptor } from "./taskPlatformIndexTypes.ts";

const manifestStatus =
  buildTaskPlatformManifest().releaseReadinessMetadata.readinessState === "Ready"
    ? "PASS"
    : "FAIL";

export const ExecutiveTaskIntelligencePlatformReleaseSummary = Object.freeze({
  platformId: TaskIntelligenceIdentity.platformId,
  platformVersion: TaskIntelligenceIdentity.platformVersion,
  phaseCount: TaskPlatformPhaseRegistry.length,
  validationStatus: getTaskValidationStatus(),
  manifestStatus,
  publicApiStatus: ExecutiveTaskIntelligencePlatformPublicRegistry.publicApiStatus,
  releaseReadiness:
    getTaskValidationStatus() === "PASS" && manifestStatus === "PASS"
      ? "Ready"
      : "Blocked",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies TaskPlatformReleaseSummaryDescriptor);
