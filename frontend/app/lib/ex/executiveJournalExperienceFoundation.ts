/**
 * EX-2:1 — Executive Journal Experience Foundation.
 *
 * Canonical immutable aggregate establishing identity, boundaries,
 * lifecycle, evidence references, decisions, open issues, and
 * ReadyForRegistry readiness for EX-2:2 Registry.
 *
 * Metadata-only. Side-effect free. No UI, routes, providers, RTC runtime
 * integration, production behavior, deployment, or later EX-2 phases.
 *
 * Ownership: owned exclusively by EX-2:1.
 *
 * Public exports:
 *   ExecutiveJournalExperienceFoundationId
 *   ExecutiveJournalExperienceFoundationNamespace
 *   ExecutiveJournalExperienceFoundationStatus
 *   ExecutiveJournalExperienceFoundationReadiness
 *   ExecutiveJournalExperienceFoundation
 *   getExecutiveJournalExperienceFoundationSummary()
 */

import {
  ExecutiveJournalExperienceBoundaries,
  ExecutiveJournalExperienceBoundaryIds,
  ExecutiveJournalExperiencePrinciples,
} from "./executiveJournalExperienceBoundaries.ts";
import {
  ExecutiveJournalExperienceArchitectureDecisionIds,
  ExecutiveJournalExperienceAuthorizingDecision,
  ExecutiveJournalExperienceDecisions,
  ExecutiveJournalExperienceEvidenceIds,
  ExecutiveJournalExperienceEvidenceLedger,
} from "./executiveJournalExperienceDecisions.ts";
import {
  ExecutiveJournalExperienceFoundationId,
  ExecutiveJournalExperienceFoundationNamespace,
  ExecutiveJournalExperienceFoundationNextPhase,
  ExecutiveJournalExperienceFoundationPhaseValue,
  ExecutiveJournalExperienceFoundationReadinessValue,
  ExecutiveJournalExperienceFoundationStatusValue,
  ExecutiveJournalExperienceFoundationTitle,
  ExecutiveJournalExperienceIdentity,
} from "./executiveJournalExperienceIdentity.ts";
import {
  ExecutiveJournalExperienceLifecycle,
} from "./executiveJournalExperienceLifecycle.ts";
import {
  ExecutiveJournalExperienceOpenIssueCatalogue,
  ExecutiveJournalExperienceOpenIssueIds,
  ExecutiveJournalExperiencePendingGateIds,
} from "./executiveJournalExperienceOpenIssues.ts";
import type { ExecutiveJournalExperienceFoundationSummary } from "./executiveJournalExperienceTypes.ts";

export {
  ExecutiveJournalExperienceFoundationId,
  ExecutiveJournalExperienceFoundationNamespace,
  ExecutiveJournalExperienceFoundationNextPhase,
  ExecutiveJournalExperienceFoundationPhaseValue as ExecutiveJournalExperienceFoundationPhase,
  ExecutiveJournalExperienceFoundationReadinessValue as ExecutiveJournalExperienceFoundationReadiness,
  ExecutiveJournalExperienceFoundationStatusValue as ExecutiveJournalExperienceFoundationStatus,
  ExecutiveJournalExperienceFoundationTitle,
};

/** Authorization scope for this Foundation implementation. */
export const ExecutiveJournalExperienceFoundationAuthorizationScope =
  Object.freeze({
    formalEx2SequenceAuthorized: true as const,
    ex21MetadataOnlyFoundationAuthorized: true as const,
    ex21ImplementationAuthorized: true as const,
    scope: "MetadataOnlyEx21FoundationOnly" as const,
    authorizingDecisionId: "AD-EX2-08" as const,
    ex22Authorized: false as const,
    routeAuthorized: false as const,
    realRtc2ConsumptionAuthorized: false as const,
    productionAuthorized: false as const,
    productionIntegrationAuthorized: false as const,
    productionPlatformAuthorized: false as const,
    publicIndexAuthorized: false as const,
    deploymentAuthorized: false as const,
  } as const);

/**
 * Canonical immutable EX-2:1 Foundation aggregate.
 */
export const ExecutiveJournalExperienceFoundation = Object.freeze({
  identity: ExecutiveJournalExperienceIdentity,
  lifecycle: ExecutiveJournalExperienceLifecycle,
  boundaries: ExecutiveJournalExperienceBoundaries,
  principles: ExecutiveJournalExperiencePrinciples,
  decisions: ExecutiveJournalExperienceDecisions,
  evidenceLedger: ExecutiveJournalExperienceEvidenceLedger,
  openIssues: ExecutiveJournalExperienceOpenIssueCatalogue,
  pendingGates: ExecutiveJournalExperiencePendingGateIds,
  authorizationScope: ExecutiveJournalExperienceFoundationAuthorizationScope,
  authorizingDecision: ExecutiveJournalExperienceAuthorizingDecision,
  nextPhase: ExecutiveJournalExperienceFoundationNextPhase,
  status: ExecutiveJournalExperienceFoundationStatusValue,
  readiness: ExecutiveJournalExperienceFoundationReadinessValue,
  phase: ExecutiveJournalExperienceFoundationPhaseValue,
  metadataOnly: true as const,
  sideEffectFree: true as const,
  immutable: true as const,
  deterministic: true as const,
  createsEx22: false as const,
  authorizesEx22: false as const,
  createsRoute: false as const,
  createsProvider: false as const,
  createsUi: false as const,
  liveRtc2Integration: false as const,
  productionBehavior: false as const,
  deploymentAuthorized: false as const,
} as const);

/**
 * Deterministic Foundation summary — no private data, fixtures, evidence
 * payloads, actor PII, or sensitive authority evidence.
 */
export function getExecutiveJournalExperienceFoundationSummary():
  ExecutiveJournalExperienceFoundationSummary {
  return Object.freeze({
    identity: ExecutiveJournalExperienceFoundationId,
    namespace: ExecutiveJournalExperienceFoundationNamespace,
    status: ExecutiveJournalExperienceFoundationStatusValue,
    readiness: ExecutiveJournalExperienceFoundationReadinessValue,
    metadataOnly: true as const,
    sideEffectFree: true as const,
    phase: ExecutiveJournalExperienceFoundationPhaseValue,
    nextPhase: ExecutiveJournalExperienceFoundationNextPhase,
    decisionIds: [...ExecutiveJournalExperienceArchitectureDecisionIds],
    evidenceIds: [...ExecutiveJournalExperienceEvidenceIds],
    openIssueIds: [...ExecutiveJournalExperienceOpenIssueIds],
    pendingGateIds: ExecutiveJournalExperiencePendingGateIds,
    productionAuthorized: false as const,
    routeAuthorized: false as const,
    deploymentAuthorized: false as const,
    realRtc2ConsumptionAuthorized: false as const,
    publicIndexAuthorized: false as const,
    ex22Created: false as const,
    ex22Authorized: false as const,
    principleCount: ExecutiveJournalExperiencePrinciples.length,
    boundaryCount: ExecutiveJournalExperienceBoundaryIds.length,
    lifecycleState: "ReadyForRegistry" as const,
    authorizingDecisionId: "AD-EX2-08" as const,
  });
}
