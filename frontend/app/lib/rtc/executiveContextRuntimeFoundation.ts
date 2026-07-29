/**
 * RTC-1:1 — Executive Context Runtime Foundation.
 *
 * Immutable architectural foundation for the Executive Context Runtime.
 * Single source of truth contracts for Stage, Journal, Timeline, and Advisor.
 * Local metadata contracts only. No UI. No React. No Next.js. Ready for Registry.
 *
 * Ownership: owned exclusively by RTC-1:1.
 *
 * Public exports:
 *   ExecutiveContextRuntimeFoundationId
 *   ExecutiveContextRuntimeFoundationVersion
 *   ExecutiveContextRuntimeFoundationName
 *   ExecutiveContextRuntimeFoundationNamespace
 *   ExecutiveContextRuntimeFoundationStatus
 *   ExecutiveContextRuntimeFoundationReadiness
 *   ExecutiveContextRuntimeFoundation
 *   getExecutiveContextRuntimeFoundationSummary()
 */

import {
  ExecutiveContextRuntimeContractNames,
  ExecutiveContextRuntimeContracts,
  ExecutiveContextRuntimeSectionNames,
  ExecutiveContextRuntimeSections,
} from "./executiveContextRuntimeContracts.ts";
import {
  ExecutiveContextRuntimeEventNames,
  ExecutiveContextRuntimeEvents,
} from "./executiveContextRuntimeEvents.ts";
import {
  ExecutiveContextIdentityFormat,
  ExecutiveContextRuntimeFoundationId,
  ExecutiveContextRuntimeFoundationName,
  ExecutiveContextRuntimeFoundationNamespace,
  ExecutiveContextRuntimeFoundationNextPhase,
  ExecutiveContextRuntimeFoundationReadiness,
  ExecutiveContextRuntimeFoundationStatus,
  ExecutiveContextRuntimeFoundationVersion,
  ExecutiveContextRuntimeIdentity,
} from "./executiveContextRuntimeIdentity.ts";
import {
  EXECUTIVE_CONTEXT_LIFECYCLE_STATES,
  ExecutiveContextRuntimeLifecycle,
} from "./executiveContextRuntimeLifecycle.ts";
import {
  ExecutiveContextActivationSources,
  ExecutiveContextRuntimeBoundaries,
  ExecutiveContextRuntimeConsumers,
  ExecutiveContextRuntimeFoundationConstants,
  ExecutiveContextRuntimeGuarantees,
  ExecutiveContextRuntimeMetadata,
  ExecutiveContextRuntimeOwnership,
  ExecutiveContextRuntimePrinciples,
  ExecutiveContextRuntimeResponsibilities,
  ExecutiveContextSnapshotPhilosophy,
} from "./executiveContextRuntimeMetadata.ts";
import type { ExecutiveContextRuntimeFoundationSummary } from "./executiveContextRuntimeTypes.ts";

export {
  ExecutiveContextRuntimeFoundationId,
  ExecutiveContextRuntimeFoundationName,
  ExecutiveContextRuntimeFoundationNamespace,
  ExecutiveContextRuntimeFoundationReadiness,
  ExecutiveContextRuntimeFoundationStatus,
  ExecutiveContextRuntimeFoundationVersion,
};

/**
 * Canonical immutable Executive Context Runtime Foundation aggregate.
 * Metadata only — no execution, rendering, or business intelligence.
 */
export const ExecutiveContextRuntimeFoundation = Object.freeze({
  identity: ExecutiveContextRuntimeIdentity,
  contextIdentityFormat: ExecutiveContextIdentityFormat,
  lifecycle: ExecutiveContextRuntimeLifecycle,
  lifecycleStates: EXECUTIVE_CONTEXT_LIFECYCLE_STATES,
  sections: ExecutiveContextRuntimeSections,
  sectionNames: ExecutiveContextRuntimeSectionNames,
  contracts: ExecutiveContextRuntimeContracts,
  contractNames: ExecutiveContextRuntimeContractNames,
  events: ExecutiveContextRuntimeEvents,
  eventNames: ExecutiveContextRuntimeEventNames,
  principles: ExecutiveContextRuntimePrinciples,
  responsibilities: ExecutiveContextRuntimeResponsibilities,
  guarantees: ExecutiveContextRuntimeGuarantees,
  consumers: ExecutiveContextRuntimeConsumers,
  activationSources: ExecutiveContextActivationSources,
  ownership: ExecutiveContextRuntimeOwnership,
  boundaries: ExecutiveContextRuntimeBoundaries,
  snapshotPhilosophy: ExecutiveContextSnapshotPhilosophy,
  metadata: ExecutiveContextRuntimeMetadata,
  constants: ExecutiveContextRuntimeFoundationConstants,
  status: ExecutiveContextRuntimeFoundationStatus,
  readiness: ExecutiveContextRuntimeFoundationReadiness,
  nextPhase: ExecutiveContextRuntimeFoundationNextPhase,
  inventory: Object.freeze({
    sectionCount: ExecutiveContextRuntimeSections.length,
    contractCount: ExecutiveContextRuntimeContracts.length,
    eventCount: ExecutiveContextRuntimeEvents.length,
    lifecycleStateCount: ExecutiveContextRuntimeLifecycle.stateCount,
    consumerCount: ExecutiveContextRuntimeConsumers.length,
    responsibilityCount: ExecutiveContextRuntimeResponsibilities.length,
    guaranteeCount: ExecutiveContextRuntimeGuarantees.length,
    principleCount: ExecutiveContextRuntimePrinciples.length,
    activationSourceCount: ExecutiveContextActivationSources.length,
  }),
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
  rootRuntimePackage: true as const,
  singleActiveContext: true as const,
  contextIdentityImmutable: true as const,
  executesTransitions: false as const,
  runtimeStateMachine: false as const,
  dispatchesEvents: false as const,
  uiBehavior: false as const,
  renderingBehavior: false as const,
  animationBehavior: false as const,
  reactBehavior: false as const,
  nextJsBehavior: false as const,
  businessLogicBehavior: false as const,
  aiReasoningBehavior: false as const,
  kpiCalculationBehavior: false as const,
  packOpenBehavior: false as const,
  directorControlBehavior: false as const,
  workspaceLogicBehavior: false as const,
  registryPhase: false as const,
  modelPhase: false as const,
  validationPhase: false as const,
  manifestPhase: false as const,
  platformPhase: false as const,
} as const);

/** Deterministic frozen Executive Context Runtime Foundation summary. */
export function getExecutiveContextRuntimeFoundationSummary():
  ExecutiveContextRuntimeFoundationSummary {
  return Object.freeze({
    foundationId: ExecutiveContextRuntimeFoundationId,
    version: ExecutiveContextRuntimeFoundationVersion,
    name: ExecutiveContextRuntimeFoundationName,
    namespace: ExecutiveContextRuntimeFoundationNamespace,
    status: ExecutiveContextRuntimeFoundationStatus,
    readiness: ExecutiveContextRuntimeFoundationReadiness,
    sectionCount: ExecutiveContextRuntimeSections.length,
    contractCount: ExecutiveContextRuntimeContracts.length,
    eventCount: ExecutiveContextRuntimeEvents.length,
    lifecycleStateCount: ExecutiveContextRuntimeLifecycle.stateCount,
    consumerCount: ExecutiveContextRuntimeConsumers.length,
    responsibilityCount: ExecutiveContextRuntimeResponsibilities.length,
    guaranteeCount: ExecutiveContextRuntimeGuarantees.length,
    nextPhase: ExecutiveContextRuntimeFoundationNextPhase,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

export const getExecutiveContextRuntimeFoundation = () =>
  ExecutiveContextRuntimeFoundation;
