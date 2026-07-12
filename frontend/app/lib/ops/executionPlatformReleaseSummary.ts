import { ExecutionPlatformIdentity } from "./executionIndex.ts";
import { ExecutionPlatformPhaseRegistry, buildExecutionPlatformManifest } from "./executionPlatformManifestIndex.ts";
import { getExecutionValidationStatus } from "./executionValidationIndex.ts";
import { ExecutiveOperationsPlatformPublicRegistry } from "./executionPlatformPublicRegistry.ts";
import type { ExecutionPlatformReleaseSummaryDescriptor } from "./executionPlatformIndexTypes.ts";

const manifestStatus =
  buildExecutionPlatformManifest().releaseReadinessMetadata.readinessState ===
  "Ready"
    ? "PASS"
    : "FAIL";

export const ExecutiveOperationsPlatformReleaseSummary = Object.freeze({
  platformId: ExecutionPlatformIdentity.platformId,
  platformVersion: ExecutionPlatformIdentity.platformVersion,
  phaseCount: ExecutionPlatformPhaseRegistry.length,
  validationStatus: getExecutionValidationStatus(),
  manifestStatus,
  publicApiStatus: ExecutiveOperationsPlatformPublicRegistry.publicApiStatus,
  releaseReadiness:
    getExecutionValidationStatus() === "PASS" && manifestStatus === "PASS"
      ? "Ready"
      : "Blocked",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ExecutionPlatformReleaseSummaryDescriptor);
