/**
 * EX-3:1 — metadata-only Executive Timeline Experience Foundation aggregate.
 *
 * Establishes identity, mission, capabilities, contracts, lifecycle, and
 * boundaries for the Timeline Experience. Logical dependencies on EX-1 Stage
 * and EX-2 Journal are declared as metadata only — no runtime imports.
 */

import {
  ExecutiveTimelineExperienceFoundationCapabilities,
  ExecutiveTimelineExperienceFoundationContracts,
  ExecutiveTimelineExperienceFoundationMission,
  ExecutiveTimelineExperienceFoundationMissionConcepts,
  ExecutiveTimelineExperienceFoundationNonCapabilities,
} from "./executiveTimelineExperienceFoundationContracts.ts";
import {
  ExecutiveTimelineExperienceFoundationApprovedAliases,
  ExecutiveTimelineExperienceFoundationArchitecturalLayer,
  ExecutiveTimelineExperienceFoundationId,
  ExecutiveTimelineExperienceFoundationIdentity,
  ExecutiveTimelineExperienceFoundationModule,
  ExecutiveTimelineExperienceFoundationNamespace,
  ExecutiveTimelineExperienceFoundationNextPhase,
  ExecutiveTimelineExperienceFoundationPreviousPhase,
  ExecutiveTimelineExperienceFoundationReadiness,
  ExecutiveTimelineExperienceFoundationStatus,
  ExecutiveTimelineExperienceFoundationVersion,
  assertExecutiveTimelineExperienceFoundationIdentity,
  resolveExecutiveTimelineExperienceFoundationIdentity,
} from "./executiveTimelineExperienceFoundationIdentity.ts";
import {
  ExecutiveTimelineExperienceFoundationLifecycle,
  assertExecutiveTimelineExperienceFoundationLifecycleTransition,
  canTransitionExecutiveTimelineExperienceFoundationLifecycle,
  isExecutiveTimelineExperienceFoundationLifecycleState,
} from "./executiveTimelineExperienceFoundationLifecycle.ts";
import {
  ExecutiveTimelineExperienceFoundationDecisions,
  ExecutiveTimelineExperienceFoundationLogicalDependencies,
  ExecutiveTimelineExperienceFoundationMetadata,
  ExecutiveTimelineExperienceFoundationReadinessConditions,
} from "./executiveTimelineExperienceFoundationMetadata.ts";
import {
  ExecutiveTimelineExperienceFoundationAllowedSurfaces,
  ExecutiveTimelineExperienceFoundationBoundaries,
  ExecutiveTimelineExperienceFoundationProhibitedSurfaces,
} from "./executiveTimelineExperienceFoundationBoundaries.ts";
import type { ExecutiveTimelineExperienceFoundationSummary } from "./executiveTimelineExperienceFoundationTypes.ts";

export * from "./executiveTimelineExperienceFoundationTypes.ts";
export * from "./executiveTimelineExperienceFoundationIdentity.ts";
export * from "./executiveTimelineExperienceFoundationLifecycle.ts";
export * from "./executiveTimelineExperienceFoundationContracts.ts";
export * from "./executiveTimelineExperienceFoundationMetadata.ts";
export * from "./executiveTimelineExperienceFoundationBoundaries.ts";

if (
  ExecutiveTimelineExperienceFoundationCapabilities.length !== 8
  || ExecutiveTimelineExperienceFoundationNonCapabilities.length !== 12
  || ExecutiveTimelineExperienceFoundationContracts.length !== 8
  || ExecutiveTimelineExperienceFoundationMissionConcepts.length !== 8
) {
  throw new Error("EX-3:1 Foundation catalogue counts are incomplete.");
}

if (
  ExecutiveTimelineExperienceFoundationLifecycle.currentState
    !== "ReadyForRegistry"
) {
  throw new Error(
    "EX-3:1 Foundation lifecycle must terminate at ReadyForRegistry.",
  );
}

export const ExecutiveTimelineExperienceFoundationDependencyDeclaration =
  Object.freeze({
    logicalDependencies:
      ExecutiveTimelineExperienceFoundationLogicalDependencies,
    runtimeDependencies: Object.freeze([] as const),
    runtimeImportCount: 0 as const,
    dependsOnExecutiveStage: true as const,
    dependsOnExecutiveJournalExperience: true as const,
    dynamicImports: false as const,
    requireCalls: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

export const ExecutiveTimelineExperienceFoundationSummaryValue = Object.freeze({
  identity: ExecutiveTimelineExperienceFoundationId,
  namespace: ExecutiveTimelineExperienceFoundationNamespace,
  version: ExecutiveTimelineExperienceFoundationVersion,
  architecturalLayer: ExecutiveTimelineExperienceFoundationArchitecturalLayer,
  module: ExecutiveTimelineExperienceFoundationModule,
  status: ExecutiveTimelineExperienceFoundationStatus,
  readiness: ExecutiveTimelineExperienceFoundationReadiness,
  previousPhase: ExecutiveTimelineExperienceFoundationPreviousPhase,
  nextPhase: ExecutiveTimelineExperienceFoundationNextPhase,
  capabilityCount: 8,
  nonCapabilityCount: 12,
  contractCount: 8,
  missionConceptCount: 8,
  lifecycleStateCount: 5,
  logicalDependencyCount: 2,
  metadataOnly: true,
  deterministic: true,
  sideEffectFree: true,
  registryCreated: false,
  registryAuthorized: false,
} as const satisfies ExecutiveTimelineExperienceFoundationSummary);

export const getExecutiveTimelineExperienceFoundationSummary =
  (): ExecutiveTimelineExperienceFoundationSummary =>
    ExecutiveTimelineExperienceFoundationSummaryValue;

export const ExecutiveTimelineExperienceFoundation = Object.freeze({
  identity: ExecutiveTimelineExperienceFoundationIdentity,
  lifecycle: ExecutiveTimelineExperienceFoundationLifecycle,
  mission: ExecutiveTimelineExperienceFoundationMission,
  capabilities: ExecutiveTimelineExperienceFoundationCapabilities,
  nonCapabilities: ExecutiveTimelineExperienceFoundationNonCapabilities,
  contracts: ExecutiveTimelineExperienceFoundationContracts,
  metadata: ExecutiveTimelineExperienceFoundationMetadata,
  boundaries: ExecutiveTimelineExperienceFoundationBoundaries,
  allowedSurfaces: ExecutiveTimelineExperienceFoundationAllowedSurfaces,
  prohibitedSurfaces: ExecutiveTimelineExperienceFoundationProhibitedSurfaces,
  decisions: ExecutiveTimelineExperienceFoundationDecisions,
  readinessConditions:
    ExecutiveTimelineExperienceFoundationReadinessConditions,
  logicalDependencies:
    ExecutiveTimelineExperienceFoundationLogicalDependencies,
  dependencyDeclaration:
    ExecutiveTimelineExperienceFoundationDependencyDeclaration,
  getSummary: getExecutiveTimelineExperienceFoundationSummary,
  status: ExecutiveTimelineExperienceFoundationStatus,
  readiness: ExecutiveTimelineExperienceFoundationReadiness,
  aliases: ExecutiveTimelineExperienceFoundationApprovedAliases,
  metadataOnly: true as const,
  deterministic: true as const,
  immutable: true as const,
  failClosed: true as const,
  sideEffectFree: true as const,
  providerExecution: false as const,
  rtcIntegration: false as const,
  uiRendering: false as const,
  animationImplementation: false as const,
  productionAuthorized: false as const,
  registryCreated: false as const,
  registryAuthorized: false as const,
  ex32Created: false as const,
  ex32Authorized: false as const,
});

export {
  assertExecutiveTimelineExperienceFoundationIdentity,
  assertExecutiveTimelineExperienceFoundationLifecycleTransition,
  canTransitionExecutiveTimelineExperienceFoundationLifecycle,
  isExecutiveTimelineExperienceFoundationLifecycleState,
  resolveExecutiveTimelineExperienceFoundationIdentity,
};
