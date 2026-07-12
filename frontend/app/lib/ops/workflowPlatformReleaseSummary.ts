import { WorkflowIntelligenceIdentity } from "./workflowIntelligenceIndex.ts";
import {
  WorkflowPlatformPhaseRegistry,
  buildWorkflowPlatformManifest,
} from "./workflowPlatformManifestIndex.ts";
import { getWorkflowValidationStatus } from "./workflowValidationIndex.ts";
import { ExecutiveWorkflowIntelligencePlatformPublicRegistry } from "./workflowPlatformPublicRegistry.ts";
import type { WorkflowPlatformReleaseSummaryDescriptor } from "./workflowPlatformIndexTypes.ts";

const manifest = buildWorkflowPlatformManifest();

const manifestStatus =
  manifest.releaseReadinessMetadata.readinessState === "Ready"
    ? "PASS"
    : "FAIL";

const taskCompatibilityStatus = manifest.taskCompatibilitySummary.ops2DependencyRepresented
  && manifest.taskCompatibilitySummary.taskCompatibilityReferenceCount > 0
  && manifest.taskCompatibilitySummary.requiredTaskCompatibilityCount > 0
    ? "PASS"
    : "FAIL";

export const ExecutiveWorkflowIntelligencePlatformReleaseSummary = Object.freeze({
  platformId: WorkflowIntelligenceIdentity.platformId,
  platformVersion: WorkflowIntelligenceIdentity.platformVersion,
  phaseCount: WorkflowPlatformPhaseRegistry.length,
  validationStatus: getWorkflowValidationStatus(),
  manifestStatus,
  taskCompatibilityStatus,
  publicApiStatus: ExecutiveWorkflowIntelligencePlatformPublicRegistry.publicApiStatus,
  releaseReadiness:
    getWorkflowValidationStatus() === "PASS" &&
    manifestStatus === "PASS" &&
    taskCompatibilityStatus === "PASS"
      ? "Ready"
      : "Blocked",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies WorkflowPlatformReleaseSummaryDescriptor);
