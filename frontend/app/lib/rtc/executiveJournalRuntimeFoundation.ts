/**
 * RTC-2:1 — Executive Journal Runtime Foundation.
 *
 * Immutable architectural foundation for the Executive Journal Runtime.
 * Append-only evidence pipeline contracts for intent, decision, commitment,
 * risk, outcome, and governance. Local metadata contracts only.
 * No UI. No React. No Next.js. Ready for Registry.
 *
 * Ownership: owned exclusively by RTC-2:1.
 *
 * Public exports:
 *   ExecutiveJournalRuntimeFoundationId
 *   ExecutiveJournalRuntimeFoundationVersion
 *   ExecutiveJournalRuntimeFoundationName
 *   ExecutiveJournalRuntimeFoundationNamespace
 *   ExecutiveJournalRuntimeFoundationStatus
 *   ExecutiveJournalRuntimeFoundationReadiness
 *   ExecutiveJournalRuntimeFoundation
 *   getExecutiveJournalRuntimeFoundationSummary()
 */

import {
  ExecutiveJournalRuntimeContractNames,
  ExecutiveJournalRuntimeContracts,
  ExecutiveJournalRuntimeSectionNames,
  ExecutiveJournalRuntimeSections,
} from "./executiveJournalRuntimeContracts.ts";
import {
  ExecutiveJournalRuntimeEventNames,
  ExecutiveJournalRuntimeEvents,
} from "./executiveJournalRuntimeEvents.ts";
import {
  ExecutiveJournalIdentityFormat,
  ExecutiveJournalRuntimeFoundationId,
  ExecutiveJournalRuntimeFoundationName,
  ExecutiveJournalRuntimeFoundationNamespace,
  ExecutiveJournalRuntimeFoundationNextPhase,
  ExecutiveJournalRuntimeFoundationReadiness,
  ExecutiveJournalRuntimeFoundationStatus,
  ExecutiveJournalRuntimeFoundationVersion,
  ExecutiveJournalRuntimeIdentity,
} from "./executiveJournalRuntimeIdentity.ts";
import {
  EXECUTIVE_JOURNAL_LIFECYCLE_STATES,
  ExecutiveJournalRuntimeLifecycle,
} from "./executiveJournalRuntimeLifecycle.ts";
import {
  ExecutiveJournalCaptureSources,
  ExecutiveJournalEventFamilies,
  ExecutiveJournalEvidencePhilosophy,
  ExecutiveJournalFoundationDecisions,
  ExecutiveJournalInformationClasses,
  ExecutiveJournalOpenIssues,
  ExecutiveJournalRuntimeBoundaries,
  ExecutiveJournalRuntimeConsumers,
  ExecutiveJournalRuntimeFoundationConstants,
  ExecutiveJournalRuntimeGuarantees,
  ExecutiveJournalRuntimeMetadata,
  ExecutiveJournalRuntimeOwnership,
  ExecutiveJournalRuntimePrinciples,
  ExecutiveJournalRuntimeResponsibilities,
} from "./executiveJournalRuntimeMetadata.ts";
import type { ExecutiveJournalRuntimeFoundationSummary } from "./executiveJournalRuntimeTypes.ts";

export {
  ExecutiveJournalRuntimeFoundationId,
  ExecutiveJournalRuntimeFoundationName,
  ExecutiveJournalRuntimeFoundationNamespace,
  ExecutiveJournalRuntimeFoundationReadiness,
  ExecutiveJournalRuntimeFoundationStatus,
  ExecutiveJournalRuntimeFoundationVersion,
};

/**
 * Canonical immutable Executive Journal Runtime Foundation aggregate.
 * Metadata only — no execution, capture, disclosure, or AI authority.
 */
export const ExecutiveJournalRuntimeFoundation = Object.freeze({
  identity: ExecutiveJournalRuntimeIdentity,
  journalIdentityFormat: ExecutiveJournalIdentityFormat,
  lifecycle: ExecutiveJournalRuntimeLifecycle,
  lifecycleStates: EXECUTIVE_JOURNAL_LIFECYCLE_STATES,
  sections: ExecutiveJournalRuntimeSections,
  sectionNames: ExecutiveJournalRuntimeSectionNames,
  contracts: ExecutiveJournalRuntimeContracts,
  contractNames: ExecutiveJournalRuntimeContractNames,
  events: ExecutiveJournalRuntimeEvents,
  eventNames: ExecutiveJournalRuntimeEventNames,
  principles: ExecutiveJournalRuntimePrinciples,
  responsibilities: ExecutiveJournalRuntimeResponsibilities,
  guarantees: ExecutiveJournalRuntimeGuarantees,
  consumers: ExecutiveJournalRuntimeConsumers,
  captureSources: ExecutiveJournalCaptureSources,
  eventFamilies: ExecutiveJournalEventFamilies,
  informationClasses: ExecutiveJournalInformationClasses,
  foundationDecisions: ExecutiveJournalFoundationDecisions,
  openIssues: ExecutiveJournalOpenIssues,
  ownership: ExecutiveJournalRuntimeOwnership,
  boundaries: ExecutiveJournalRuntimeBoundaries,
  evidencePhilosophy: ExecutiveJournalEvidencePhilosophy,
  metadata: ExecutiveJournalRuntimeMetadata,
  constants: ExecutiveJournalRuntimeFoundationConstants,
  status: ExecutiveJournalRuntimeFoundationStatus,
  readiness: ExecutiveJournalRuntimeFoundationReadiness,
  nextPhase: ExecutiveJournalRuntimeFoundationNextPhase,
  inventory: Object.freeze({
    sectionCount: ExecutiveJournalRuntimeSections.length,
    contractCount: ExecutiveJournalRuntimeContracts.length,
    eventCount: ExecutiveJournalRuntimeEvents.length,
    lifecycleStateCount: ExecutiveJournalRuntimeLifecycle.stateCount,
    consumerCount: ExecutiveJournalRuntimeConsumers.length,
    responsibilityCount: ExecutiveJournalRuntimeResponsibilities.length,
    guaranteeCount: ExecutiveJournalRuntimeGuarantees.length,
    principleCount: ExecutiveJournalRuntimePrinciples.length,
    captureSourceCount: ExecutiveJournalCaptureSources.length,
    eventFamilyCount: ExecutiveJournalEventFamilies.length,
    informationClassCount: ExecutiveJournalInformationClasses.length,
    decisionCount: ExecutiveJournalFoundationDecisions.length,
    openIssueCount: ExecutiveJournalOpenIssues.length,
  }),
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
  rootRuntimePackage: true as const,
  appendOnly: true as const,
  correctionsDoNotErase: true as const,
  privateReflectionSeparateClass: true as const,
  executesTransitions: false as const,
  runtimeStateMachine: false as const,
  dispatchesEvents: false as const,
  uiBehavior: false as const,
  renderingBehavior: false as const,
  animationBehavior: false as const,
  reactBehavior: false as const,
  nextJsBehavior: false as const,
  businessLogicBehavior: false as const,
  aiAuthorityBehavior: false as const,
  autonomousCommitmentBehavior: false as const,
  historyRewriteBehavior: false as const,
  covertCaptureBehavior: false as const,
  registryPhase: false as const,
  modelPhase: false as const,
  validationPhase: false as const,
  manifestPhase: false as const,
  platformPhase: false as const,
} as const);

/** Deterministic frozen Executive Journal Runtime Foundation summary. */
export function getExecutiveJournalRuntimeFoundationSummary():
  ExecutiveJournalRuntimeFoundationSummary {
  return Object.freeze({
    foundationId: ExecutiveJournalRuntimeFoundationId,
    version: ExecutiveJournalRuntimeFoundationVersion,
    name: ExecutiveJournalRuntimeFoundationName,
    namespace: ExecutiveJournalRuntimeFoundationNamespace,
    status: ExecutiveJournalRuntimeFoundationStatus,
    readiness: ExecutiveJournalRuntimeFoundationReadiness,
    sectionCount: ExecutiveJournalRuntimeSections.length,
    contractCount: ExecutiveJournalRuntimeContracts.length,
    eventCount: ExecutiveJournalRuntimeEvents.length,
    lifecycleStateCount: ExecutiveJournalRuntimeLifecycle.stateCount,
    consumerCount: ExecutiveJournalRuntimeConsumers.length,
    responsibilityCount: ExecutiveJournalRuntimeResponsibilities.length,
    guaranteeCount: ExecutiveJournalRuntimeGuarantees.length,
    nextPhase: ExecutiveJournalRuntimeFoundationNextPhase,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

export const getExecutiveJournalRuntimeFoundation = () =>
  ExecutiveJournalRuntimeFoundation;
