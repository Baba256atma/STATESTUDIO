import { ExecutiveWorkflowIntelligenceFoundation } from "./workflowIntelligenceIndex.ts";
import {
  WorkflowCapabilityRegistry,
  WorkflowPlatformMetadata,
} from "./workflowMetadataIndex.ts";
import { buildWorkflowModelManifest } from "./workflowModelIndex.ts";
import { getWorkflowValidationSummary } from "./workflowValidationIndex.ts";
import {
  WorkflowPlatformDependencyMap,
  WorkflowPlatformDependencyMapMetadata,
} from "./workflowPlatformDependencyMap.ts";
import type { WorkflowPlatformManifestDescriptor } from "./workflowPlatformManifestTypes.ts";
import {
  WorkflowPlatformPhaseRegistry,
  WorkflowPlatformPhaseRegistryMetadata,
} from "./workflowPlatformPhaseRegistry.ts";
import {
  WorkflowPlatformPublicSurface,
  WorkflowPlatformPublicSurfaceMetadata,
} from "./workflowPlatformPublicSurface.ts";

export const buildWorkflowPlatformManifest = () =>
  Object.freeze({
    platformIdentity: ExecutiveWorkflowIntelligenceFoundation.identity,
    foundation: ExecutiveWorkflowIntelligenceFoundation,
    consumedPhases: Object.freeze(
      WorkflowPlatformPhaseRegistry.map((phase) => phase.phaseId),
    ),
    phaseRegistry: WorkflowPlatformPhaseRegistry,
    phaseRegistryMetadata: WorkflowPlatformPhaseRegistryMetadata,
    dependencyMap: WorkflowPlatformDependencyMap,
    dependencyMapMetadata: WorkflowPlatformDependencyMapMetadata,
    publicApiSurface: WorkflowPlatformPublicSurface,
    publicApiSurfaceMetadata: WorkflowPlatformPublicSurfaceMetadata,
    capabilitySummary: Object.freeze({
      capabilityCount: WorkflowCapabilityRegistry.length,
      capabilityNames: Object.freeze(
        WorkflowCapabilityRegistry.map((capability) => capability.name),
      ),
      metadataOnly: true,
      immutable: true,
    }),
    modelSummary: Object.freeze({
      stageCount: buildWorkflowModelManifest().models.stage.length,
      transitionCount: buildWorkflowModelManifest().models.transition.length,
      readinessCount: buildWorkflowModelManifest().models.readiness.length,
      metadataOnly: true,
      immutable: true,
    }),
    validationSummary: getWorkflowValidationSummary(),
    taskCompatibilitySummary: Object.freeze({
      linkedTaskGroupCount: buildWorkflowModelManifest().models.taskLink.length,
      taskCompatibilityReferenceCount:
        buildWorkflowModelManifest().models.taskLink.reduce(
          (count, entry) => count + entry.taskCompatibilityMetadata.length,
          0,
        ),
      requiredTaskCompatibilityCount:
        buildWorkflowModelManifest().models.readiness.reduce(
          (count, entry) => count + entry.requiredTaskModelCompatibility.length,
          0,
        ),
      ops2DependencyRepresented: WorkflowPlatformDependencyMap.some(
        (entry) => entry.targetPhaseId === "OPS-2:9",
      ),
      metadataOnly: true,
      immutable: true,
    }),
    compatibilityVersion: WorkflowPlatformMetadata.compatibilityVersion,
    releaseReadinessMetadata: Object.freeze({
      readinessState:
        getWorkflowValidationSummary().status === "PASS" ? "Ready" : "Blocked",
      publicApiStable: true,
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    }),
    descriptor: Object.freeze({
      platformId: WorkflowPlatformMetadata.platformId,
      platformName: ExecutiveWorkflowIntelligenceFoundation.identity.platformName,
      platformVersion: ExecutiveWorkflowIntelligenceFoundation.identity.platformVersion,
      compatibilityVersion: WorkflowPlatformMetadata.compatibilityVersion,
      releaseReadiness:
        getWorkflowValidationSummary().status === "PASS" ? "Ready" : "Blocked",
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    } as const satisfies WorkflowPlatformManifestDescriptor),
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
