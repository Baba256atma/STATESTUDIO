/**
 * NEA-7:6 — Intake Orchestration Platform Summary.
 *
 * Immutable summary helpers for Platform consumers.
 * Counts are derived exclusively from canonical Manifest and Platform collections.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-7:6.
 */

import { IntakeOrchestrationManifestId } from "./intakeOrchestrationManifest.ts";
import { IntakeOrchestrationPlatformMetadata } from "./intakeOrchestrationPlatformMetadata.ts";
import { IntakeOrchestrationPlatformNamespaceObject } from "./intakeOrchestrationPlatformNamespace.ts";
import {
  IntakeOrchestrationPlatformBoundaries,
  IntakeOrchestrationPlatformOwnership,
} from "./intakeOrchestrationPlatformOwnership.ts";
import { IntakeOrchestrationPlatformReadinessDeclaration } from "./intakeOrchestrationPlatformReadiness.ts";
import type { IntakeOrchestrationPlatformSummary } from "./intakeOrchestrationPlatformTypes.ts";

/** Platform identity constants used by summary composition. */
export const INTAKE_ORCHESTRATION_PLATFORM_SUMMARY_IDENTITY = Object.freeze({
  platformId: "NEA-7:6/IntakeOrchestrationPlatform" as const,
  name: "Intake Orchestration Platform" as const,
  version: "1.0.0" as const,
  namespace: "nexora.nea.intake-orchestration.platform" as const,
  publicExportCount: 8 as const,
  sectionCount: 9 as const,
});

/**
 * Build deterministic frozen Platform summary.
 * Derived exclusively from canonical Platform and Manifest collections.
 */
export function buildIntakeOrchestrationPlatformSummary(): IntakeOrchestrationPlatformSummary {
  const identity = INTAKE_ORCHESTRATION_PLATFORM_SUMMARY_IDENTITY;
  const meta = IntakeOrchestrationPlatformMetadata;
  const ns = IntakeOrchestrationPlatformNamespaceObject;
  return Object.freeze({
    platformId: identity.platformId,
    version: identity.version,
    name: identity.name,
    namespace: identity.namespace,
    layer: "NEA" as const,
    phase: "NEA-7:6" as const,
    status: "Platform" as const,
    readiness: IntakeOrchestrationPlatformReadinessDeclaration.readiness,
    architectureVersion: meta.architectureVersion,
    compositionMode: meta.compositionMode,
    runtimeBehavior: meta.runtimeBehavior,
    manifestId: IntakeOrchestrationManifestId,
    composedPhaseCount: ns.composedPhaseCount,
    namespaceSectionCount: ns.sectionCount,
    phaseReferenceCount: meta.phaseReferenceCount,
    inventoryEntryCount: meta.inventoryEntryCount,
    totalArchitectureCount: meta.totalArchitectureCount,
    ownershipCount: IntakeOrchestrationPlatformOwnership.ownsCount,
    nonOwnershipCount: IntakeOrchestrationPlatformOwnership.doesNotOwnCount,
    prohibitedSurfaceCount:
      IntakeOrchestrationPlatformBoundaries.prohibitedSurfaceCount,
    publicExportCount: identity.publicExportCount,
    sectionCount: identity.sectionCount,
    nextPhase: IntakeOrchestrationPlatformReadinessDeclaration.nextPhase,
    architectureStatus:
      IntakeOrchestrationPlatformReadinessDeclaration.architectureStatus,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

/** Frozen summary catalog for composition consumers. */
export const IntakeOrchestrationPlatformSummaryCatalog = Object.freeze({
  catalogId: "NEA-7:6/PlatformSummaryCatalog",
  sourcePhase: "NEA-7:6" as const,
  architectureSummary: Object.freeze({
    architectureStatus:
      IntakeOrchestrationPlatformReadinessDeclaration.architectureStatus,
    architectureVersion: IntakeOrchestrationPlatformMetadata.architectureVersion,
    compositionMode: IntakeOrchestrationPlatformMetadata.compositionMode,
    runtimeBehavior: IntakeOrchestrationPlatformMetadata.runtimeBehavior,
  }),
  namespaceSummary: Object.freeze({
    sectionCount: IntakeOrchestrationPlatformNamespaceObject.sectionCount,
    composedPhaseCount:
      IntakeOrchestrationPlatformNamespaceObject.composedPhaseCount,
    sectionOrder: IntakeOrchestrationPlatformNamespaceObject.sectionOrder,
  }),
  inventorySummary: Object.freeze({
    phaseReferenceCount:
      IntakeOrchestrationPlatformMetadata.phaseReferenceCount,
    inventoryEntryCount:
      IntakeOrchestrationPlatformMetadata.inventoryEntryCount,
    totalArchitectureCount:
      IntakeOrchestrationPlatformMetadata.totalArchitectureCount,
  }),
  dependencySummary: Object.freeze({
    dependencyChain: IntakeOrchestrationPlatformMetadata.dependencyChain,
    upstreamManifestId:
      IntakeOrchestrationPlatformMetadata.upstreamManifestId,
  }),
  consumerSummary: Object.freeze({
    consumerEntryPoint: IntakeOrchestrationPlatformMetadata.consumerEntryPoint,
    consumerReady: IntakeOrchestrationPlatformReadinessDeclaration.consumerReady,
    readiness: IntakeOrchestrationPlatformReadinessDeclaration.readiness,
  }),
  buildSummary: buildIntakeOrchestrationPlatformSummary,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
