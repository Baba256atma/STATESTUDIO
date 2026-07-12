import { ResourceIntelligenceIdentity } from "./resourceIntelligenceIndex.ts";
import {
  ResourcePlatformPhaseRegistry,
  buildResourcePlatformManifest,
} from "./resourcePlatformManifestIndex.ts";
import { getResourceValidationStatus } from "./resourceValidationIndex.ts";
import { ExecutiveResourceIntelligencePlatformPublicRegistry } from "./resourcePlatformPublicRegistry.ts";
import type { ResourcePlatformReleaseSummaryDescriptor } from "./resourcePlatformIndexTypes.ts";

const manifest = buildResourcePlatformManifest();
const manifestStatus =
  manifest.releaseReadinessMetadata.readinessState === "Ready" ? "PASS" : "FAIL";

export const ExecutiveResourceIntelligencePlatformReleaseSummary = Object.freeze({
  platformId: ResourceIntelligenceIdentity.platformId,
  platformVersion: ResourceIntelligenceIdentity.platformVersion,
  phaseCount: ResourcePlatformPhaseRegistry.length,
  validationStatus: getResourceValidationStatus(),
  manifestStatus,
  publicApiStatus: ExecutiveResourceIntelligencePlatformPublicRegistry.publicApiStatus,
  taskCompatibilityStatus: manifest.taskCompatibilitySummary.compatibilityStatus,
  workflowCompatibilityStatus: manifest.workflowCompatibilitySummary.compatibilityStatus,
  projectCompatibilityStatus: manifest.projectCompatibilitySummary.compatibilityStatus,
  releaseReadiness:
    getResourceValidationStatus() === "PASS" &&
    manifestStatus === "PASS" &&
    manifest.taskCompatibilitySummary.compatibilityStatus === "PASS" &&
    manifest.workflowCompatibilitySummary.compatibilityStatus === "PASS" &&
    manifest.projectCompatibilitySummary.compatibilityStatus === "PASS"
      ? "Ready"
      : "Blocked",
  certificationState: "Pending",
  architectureCompleteness: "Complete",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ResourcePlatformReleaseSummaryDescriptor);
