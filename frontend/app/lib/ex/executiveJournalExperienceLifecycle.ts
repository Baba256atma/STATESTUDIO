/**
 * EX-2:1 — Executive Journal Experience Foundation Lifecycle.
 *
 * Ordered Foundation lifecycle and ReadyForRegistry requirements.
 * Metadata-only — transitions are declared, not executed as a runtime
 * state machine. Later phases are not authorized or completed here.
 *
 * Ownership: owned exclusively by EX-2:1.
 */

import type { ExecutiveJournalExperienceFoundationLifecycleState } from "./executiveJournalExperienceTypes.ts";
import {
  ExecutiveJournalExperienceFoundationId,
  ExecutiveJournalExperienceFoundationNextPhase,
} from "./executiveJournalExperienceIdentity.ts";
import { ExecutiveJournalExperienceBoundaryIds } from "./executiveJournalExperienceBoundaries.ts";

export const ExecutiveJournalExperienceFoundationLifecycleStates =
  Object.freeze([
    "Declared",
    "Bounded",
    "EvidenceLinked",
    "ReadyForRegistry",
  ] as const satisfies readonly ExecutiveJournalExperienceFoundationLifecycleState[]);

const TRANSITIONS = Object.freeze({
  Declared: Object.freeze([
    "Bounded",
  ]) as readonly ExecutiveJournalExperienceFoundationLifecycleState[],
  Bounded: Object.freeze([
    "EvidenceLinked",
  ]) as readonly ExecutiveJournalExperienceFoundationLifecycleState[],
  EvidenceLinked: Object.freeze([
    "ReadyForRegistry",
  ]) as readonly ExecutiveJournalExperienceFoundationLifecycleState[],
  ReadyForRegistry: Object.freeze(
    [] as const,
  ) as readonly ExecutiveJournalExperienceFoundationLifecycleState[],
} as const);

export const assertExecutiveJournalExperienceFoundationLifecycleState = (
  value: string,
): ExecutiveJournalExperienceFoundationLifecycleState => {
  if (
    !(
      ExecutiveJournalExperienceFoundationLifecycleStates as readonly string[]
    ).includes(value)
  ) {
    throw new Error(
      `Unknown EX-2:1 Foundation lifecycle state fails closed: ${JSON.stringify(value)}`,
    );
  }
  return value as ExecutiveJournalExperienceFoundationLifecycleState;
};

export const assertExecutiveJournalExperienceFoundationLifecycleTransition = (
  from: string,
  to: string,
): {
  readonly from: ExecutiveJournalExperienceFoundationLifecycleState;
  readonly to: ExecutiveJournalExperienceFoundationLifecycleState;
} => {
  const source = assertExecutiveJournalExperienceFoundationLifecycleState(from);
  const target = assertExecutiveJournalExperienceFoundationLifecycleState(to);
  const allowed = TRANSITIONS[source];
  if (!allowed.includes(target)) {
    throw new Error(
      `Illegal EX-2:1 Foundation lifecycle transition fails closed: ${JSON.stringify(from)} -> ${JSON.stringify(to)}`,
    );
  }
  return { from: source, to: target };
};

/**
 * ReadyForRegistry requirements — metadata Foundation only.
 * Production gates are intentionally excluded.
 */
export const ExecutiveJournalExperienceReadyForRegistryRequirements =
  Object.freeze({
    requiresCanonicalIdentity: true as const,
    requiredIdentity: ExecutiveJournalExperienceFoundationId,
    requiresCompleteBoundaryCatalogue: true as const,
    requiredBoundaryCount: ExecutiveJournalExperienceBoundaryIds.length,
    requiresAdEx208Authority: true as const,
    authorizingDecisionId: "AD-EX2-08" as const,
    requiresEvidenceLedgerIntegrity: true as const,
    requiresOpenIssuesPreserved: true as const,
    requiresNoProhibitedBehavior: true as const,
    requiresNextPhaseDeclaredAsMetadataOnly: true as const,
    nextPhaseMetadata: ExecutiveJournalExperienceFoundationNextPhase,
    requiresProductionGatesToPass: false as const,
    doesNotMeanEx22AuthorizedOrCreated: true as const,
    doesNotMeanRtc2ConsumptionActive: true as const,
    doesNotMeanUiOrRouteAuthorized: true as const,
    doesNotMeanPlatformExists: true as const,
    doesNotMeanProductionOrDeploymentReady: true as const,
  } as const);

/**
 * Canonical immutable Foundation lifecycle declaration.
 */
export const ExecutiveJournalExperienceLifecycle = Object.freeze({
  lifecycleId: "EX-2:1/ExecutiveJournalExperienceLifecycle" as const,
  sourcePhase: "EX-2:1" as const,
  states: ExecutiveJournalExperienceFoundationLifecycleStates,
  stateCount: ExecutiveJournalExperienceFoundationLifecycleStates.length,
  transitions: TRANSITIONS,
  currentState: "ReadyForRegistry" as const,
  readiness: "ReadyForRegistry" as const,
  readyForRegistryRequirements:
    ExecutiveJournalExperienceReadyForRegistryRequirements,
  executesTransitions: false as const,
  runtimeStateMachine: false as const,
  laterPhasesAuthorized: false as const,
  laterPhasesCompleted: false as const,
  ex22Authorized: false as const,
  ex22Created: false as const,
  productionGatesBlockMetadataFoundation: false as const,
  assertState: assertExecutiveJournalExperienceFoundationLifecycleState,
  assertTransition: assertExecutiveJournalExperienceFoundationLifecycleTransition,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
  sideEffectFree: true as const,
} as const);
