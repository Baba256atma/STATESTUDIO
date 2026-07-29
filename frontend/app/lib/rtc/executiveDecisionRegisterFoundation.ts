/**
 * RTC-3:1 — Executive Decision Register Foundation.
 *
 * Immutable architectural foundation for the Executive Decision Register.
 * Metadata-only decision lifecycle, authority, confirmation, privacy, AI,
 * evidence, projection, and telemetry contracts. No UI. No React. No Next.js.
 * No RTC-2 import. Ready for Registry.
 *
 * Ownership: owned exclusively by RTC-3:1.
 */

import {
  ExecutiveDecisionRegisterAiMay,
  ExecutiveDecisionRegisterAiMustNot,
  ExecutiveDecisionRegisterAppendOnlyRules,
  ExecutiveDecisionRegisterAuthorityNonSubstitutes,
  ExecutiveDecisionRegisterContractNames,
  ExecutiveDecisionRegisterContracts,
  ExecutiveDecisionRegisterDecisionDescriptorFieldNames,
  ExecutiveDecisionRegisterDecisionDescriptorFields,
  ExecutiveDecisionRegisterPrivateReflectionPromotionRequirements,
  ExecutiveDecisionRegisterProjectionNames,
  ExecutiveDecisionRegisterTelemetryAllowed,
  ExecutiveDecisionRegisterTelemetryForbidden,
} from "./executiveDecisionRegisterContracts.ts";
import {
  ExecutiveDecisionRegisterEventNames,
  ExecutiveDecisionRegisterEvents,
  isCanonicalDecisionRegisterEventName,
} from "./executiveDecisionRegisterEvents.ts";
import {
  ExecutiveDecisionRegisterApprovedIdentities,
  ExecutiveDecisionRegisterFoundationAliases,
  ExecutiveDecisionRegisterFoundationId,
  ExecutiveDecisionRegisterFoundationName,
  ExecutiveDecisionRegisterFoundationNamespace,
  ExecutiveDecisionRegisterFoundationNextPhase,
  ExecutiveDecisionRegisterFoundationReadiness,
  ExecutiveDecisionRegisterFoundationStatus,
  ExecutiveDecisionRegisterFoundationVersion,
  ExecutiveDecisionRegisterIdentity,
  ExecutiveDecisionRegisterIdentityFormat,
  isApprovedDecisionRegisterIdentity,
  isWellFormedDecisionRegisterIdentity,
} from "./executiveDecisionRegisterIdentity.ts";
import {
  EXECUTIVE_DECISION_REGISTER_LIFECYCLE_STATES,
  ExecutiveDecisionRegisterConsequentialStates,
  ExecutiveDecisionRegisterLifecycle,
  isCanonicalDecisionRegisterLifecycleState,
} from "./executiveDecisionRegisterLifecycle.ts";
import {
  ExecutiveDecisionRegisterBoundaries,
  ExecutiveDecisionRegisterFoundationDecisions,
  ExecutiveDecisionRegisterMetadata,
  ExecutiveDecisionRegisterOpenIssues,
  ExecutiveDecisionRegisterOwnership,
  ExecutiveDecisionRegisterPrinciples,
  ExecutiveDecisionRegisterProhibitedSurfaces,
} from "./executiveDecisionRegisterMetadata.ts";
import type { ExecutiveDecisionRegisterFoundationSummary } from "./executiveDecisionRegisterTypes.ts";

export {
  ExecutiveDecisionRegisterApprovedIdentities,
  ExecutiveDecisionRegisterFoundationAliases,
  ExecutiveDecisionRegisterFoundationId,
  ExecutiveDecisionRegisterFoundationName,
  ExecutiveDecisionRegisterFoundationNamespace,
  ExecutiveDecisionRegisterFoundationNextPhase,
  ExecutiveDecisionRegisterFoundationReadiness,
  ExecutiveDecisionRegisterFoundationStatus,
  ExecutiveDecisionRegisterFoundationVersion,
  isApprovedDecisionRegisterIdentity,
  isWellFormedDecisionRegisterIdentity,
};

export {
  ExecutiveDecisionRegisterConsequentialStates,
  isCanonicalDecisionRegisterLifecycleState,
  isCanonicalDecisionRegisterEventName,
};

/**
 * Canonical immutable Executive Decision Register Foundation aggregate.
 * Metadata only — no execution, persistence, confirmation, or AI authority.
 */
export const ExecutiveDecisionRegisterFoundation = Object.freeze({
  identity: ExecutiveDecisionRegisterIdentity,
  identityFormat: ExecutiveDecisionRegisterIdentityFormat,
  aliases: ExecutiveDecisionRegisterFoundationAliases,
  approvedIdentities: ExecutiveDecisionRegisterApprovedIdentities,
  isApprovedIdentity: isApprovedDecisionRegisterIdentity,
  isWellFormedIdentity: isWellFormedDecisionRegisterIdentity,
  lifecycle: ExecutiveDecisionRegisterLifecycle,
  lifecycleStates: EXECUTIVE_DECISION_REGISTER_LIFECYCLE_STATES,
  consequentialStates: ExecutiveDecisionRegisterConsequentialStates,
  isCanonicalLifecycleState: isCanonicalDecisionRegisterLifecycleState,
  isCanonicalEventName: isCanonicalDecisionRegisterEventName,
  contracts: ExecutiveDecisionRegisterContracts,
  contractNames: ExecutiveDecisionRegisterContractNames,
  decisionDescriptorFields: ExecutiveDecisionRegisterDecisionDescriptorFields,
  decisionDescriptorFieldNames:
    ExecutiveDecisionRegisterDecisionDescriptorFieldNames,
  events: ExecutiveDecisionRegisterEvents,
  eventNames: ExecutiveDecisionRegisterEventNames,
  principles: ExecutiveDecisionRegisterPrinciples,
  foundationDecisions: ExecutiveDecisionRegisterFoundationDecisions,
  openIssues: ExecutiveDecisionRegisterOpenIssues,
  ownership: ExecutiveDecisionRegisterOwnership,
  boundaries: ExecutiveDecisionRegisterBoundaries,
  prohibitedSurfaces: ExecutiveDecisionRegisterProhibitedSurfaces,
  appendOnlyRules: ExecutiveDecisionRegisterAppendOnlyRules,
  authorityNonSubstitutes: ExecutiveDecisionRegisterAuthorityNonSubstitutes,
  aiMay: ExecutiveDecisionRegisterAiMay,
  aiMustNot: ExecutiveDecisionRegisterAiMustNot,
  projectionNames: ExecutiveDecisionRegisterProjectionNames,
  privateReflectionPromotionRequirements:
    ExecutiveDecisionRegisterPrivateReflectionPromotionRequirements,
  telemetryAllowed: ExecutiveDecisionRegisterTelemetryAllowed,
  telemetryForbidden: ExecutiveDecisionRegisterTelemetryForbidden,
  metadata: ExecutiveDecisionRegisterMetadata,
  status: ExecutiveDecisionRegisterFoundationStatus,
  readiness: ExecutiveDecisionRegisterFoundationReadiness,
  nextPhase: ExecutiveDecisionRegisterFoundationNextPhase,
  inventory: Object.freeze({
    contractCount: ExecutiveDecisionRegisterContracts.length,
    eventCount: ExecutiveDecisionRegisterEvents.length,
    lifecycleStateCount: ExecutiveDecisionRegisterLifecycle.stateCount,
    principleCount: ExecutiveDecisionRegisterPrinciples.length,
    decisionCount: ExecutiveDecisionRegisterFoundationDecisions.length,
    openIssueCount: ExecutiveDecisionRegisterOpenIssues.length,
    projectionCount: ExecutiveDecisionRegisterProjectionNames.length,
  }),
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
  rootRuntimePackage: true as const,
  appendOnly: true as const,
  correctionsDoNotErase: true as const,
  proposedIsNonAuthoritative: true as const,
  confirmedRequiresHumanAndAuthority: true as const,
  aiOutputNonAuthoritative: true as const,
  importsRtc2: false as const,
  importsRtc1: false as const,
  importsApp8: false as const,
  executesTransitions: false as const,
  runtimeStateMachine: false as const,
  dispatchesEvents: false as const,
  persistsEvents: false as const,
  uiBehavior: false as const,
  reactBehavior: false as const,
  nextJsBehavior: false as const,
  aiAuthorityBehavior: false as const,
  historyRewriteBehavior: false as const,
  registryPhase: false as const,
} as const);

export function getExecutiveDecisionRegisterFoundationSummary():
  ExecutiveDecisionRegisterFoundationSummary {
  return Object.freeze({
    foundationId: ExecutiveDecisionRegisterFoundationId,
    version: ExecutiveDecisionRegisterFoundationVersion,
    name: ExecutiveDecisionRegisterFoundationName,
    namespace: ExecutiveDecisionRegisterFoundationNamespace,
    status: ExecutiveDecisionRegisterFoundationStatus,
    readiness: ExecutiveDecisionRegisterFoundationReadiness,
    contractCount: ExecutiveDecisionRegisterContracts.length,
    eventCount: ExecutiveDecisionRegisterEvents.length,
    lifecycleStateCount: ExecutiveDecisionRegisterLifecycle.stateCount,
    decisionCount: ExecutiveDecisionRegisterFoundationDecisions.length,
    openIssueCount: ExecutiveDecisionRegisterOpenIssues.length,
    nextPhase: ExecutiveDecisionRegisterFoundationNextPhase,
    importsRtc2: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

export const getExecutiveDecisionRegisterFoundation = () =>
  ExecutiveDecisionRegisterFoundation;
