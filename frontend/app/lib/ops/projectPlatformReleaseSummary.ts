import { ProjectExecutionIdentity } from "./projectExecutionIndex.ts";
import {
  ProjectPlatformPhaseRegistry,
  buildProjectPlatformManifest,
} from "./projectPlatformManifestIndex.ts";
import { getProjectValidationStatus } from "./projectValidationIndex.ts";
import { ExecutiveProjectExecutionPlatformPublicRegistry } from "./projectPlatformPublicRegistry.ts";
import type { ProjectPlatformReleaseSummaryDescriptor } from "./projectPlatformIndexTypes.ts";

const manifest = buildProjectPlatformManifest();
const manifestStatus =
  manifest.releaseReadinessMetadata.readinessState === "Ready" ? "PASS" : "FAIL";

export const ExecutiveProjectExecutionPlatformReleaseSummary = Object.freeze({
  platformId: ProjectExecutionIdentity.platformId,
  platformVersion: ProjectExecutionIdentity.platformVersion,
  phaseCount: ProjectPlatformPhaseRegistry.length,
  validationStatus: getProjectValidationStatus(),
  manifestStatus,
  publicApiStatus: ExecutiveProjectExecutionPlatformPublicRegistry.publicApiStatus,
  taskCompatibilityStatus: manifest.taskCompatibilitySummary.compatibilityStatus,
  workflowCompatibilityStatus: manifest.workflowCompatibilitySummary.compatibilityStatus,
  releaseReadiness:
    getProjectValidationStatus() === "PASS" &&
    manifestStatus === "PASS" &&
    manifest.taskCompatibilitySummary.compatibilityStatus === "PASS" &&
    manifest.workflowCompatibilitySummary.compatibilityStatus === "PASS"
      ? "Ready"
      : "Blocked",
  certificationState: "Pending",
  architectureCompleteness: "Complete",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ProjectPlatformReleaseSummaryDescriptor);

