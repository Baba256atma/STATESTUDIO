/**
 * EX-2:2 — Executive Journal Experience Registry Lifecycle.
 *
 * Ordered Declared → Populated → Sealed lifecycle and ReadyForModel rules.
 * Metadata only — transitions are declared, not executed as a runtime
 * state machine. EX-2:3 is not authorized or completed here.
 *
 * Ownership: owned exclusively by EX-2:2.
 */

import type { ExecutiveJournalExperienceRegistryLifecycleState } from "./executiveJournalExperienceRegistryTypes.ts";
import {
  ExecutiveJournalExperienceRegistryId,
  ExecutiveJournalExperienceRegistryNextPhase,
} from "./executiveJournalExperienceRegistryIdentity.ts";

export const ExecutiveJournalExperienceRegistryLifecycleStates = Object.freeze([
  "Declared",
  "Populated",
  "Sealed",
] as const satisfies readonly ExecutiveJournalExperienceRegistryLifecycleState[]);

const TRANSITIONS = Object.freeze({
  Declared: Object.freeze([
    "Populated",
  ]) as readonly ExecutiveJournalExperienceRegistryLifecycleState[],
  Populated: Object.freeze([
    "Sealed",
  ]) as readonly ExecutiveJournalExperienceRegistryLifecycleState[],
  Sealed: Object.freeze(
    [] as const,
  ) as readonly ExecutiveJournalExperienceRegistryLifecycleState[],
} as const);

export const assertExecutiveJournalExperienceRegistryLifecycleState = (
  value: string,
): ExecutiveJournalExperienceRegistryLifecycleState => {
  if (
    !(
      ExecutiveJournalExperienceRegistryLifecycleStates as readonly string[]
    ).includes(value)
  ) {
    throw new Error(
      `Unknown EX-2:2 Registry lifecycle state fails closed: ${JSON.stringify(value)}`,
    );
  }
  return value as ExecutiveJournalExperienceRegistryLifecycleState;
};

export const assertExecutiveJournalExperienceRegistryLifecycleTransition = (
  from: string,
  to: string,
): {
  readonly from: ExecutiveJournalExperienceRegistryLifecycleState;
  readonly to: ExecutiveJournalExperienceRegistryLifecycleState;
} => {
  const source = assertExecutiveJournalExperienceRegistryLifecycleState(from);
  const target = assertExecutiveJournalExperienceRegistryLifecycleState(to);
  const allowed = TRANSITIONS[source];
  if (!allowed.includes(target)) {
    throw new Error(
      `Illegal EX-2:2 Registry lifecycle transition fails closed: ${JSON.stringify(from)} -> ${JSON.stringify(to)}`,
    );
  }
  return { from: source, to: target };
};

export const isCanonicalExecutiveJournalExperienceRegistryLifecycleState = (
  value: unknown,
): value is ExecutiveJournalExperienceRegistryLifecycleState =>
  typeof value === "string"
  && (
    ExecutiveJournalExperienceRegistryLifecycleStates as readonly string[]
  ).includes(value);

/**
 * Per-state semantics — metadata only; not a runtime state machine.
 * Declared: empty registration process.
 * Populated: exactly one valid Foundation entry.
 * Sealed: immutable closed-world Registry built from canonical Populated state.
 */
export const ExecutiveJournalExperienceRegistryLifecycleStateSemantics =
  Object.freeze({
    Declared: Object.freeze({
      state: "Declared" as const,
      registrationProcess: "empty" as const,
      entryCount: 0 as const,
      acceptsRegistration: true as const,
      immutable: false as const,
    }),
    Populated: Object.freeze({
      state: "Populated" as const,
      requiresExactlyOneValidFoundationEntry: true as const,
      entryCount: 1 as const,
      acceptsRegistration: true as const,
      immutable: false as const,
    }),
    Sealed: Object.freeze({
      state: "Sealed" as const,
      requiresCanonicalPopulatedState: true as const,
      entryCount: 1 as const,
      acceptsRegistration: false as const,
      immutable: true as const,
      closedWorld: true as const,
    }),
  } as const);

/**
 * ReadyForModel requirements — sealed metadata Registry only.
 * Production gates and EX-2:3 authorization are intentionally excluded.
 */
export const ExecutiveJournalExperienceReadyForModelRequirements =
  Object.freeze({
    requiresCanonicalIdentity: true as const,
    requiredIdentity: ExecutiveJournalExperienceRegistryId,
    requiresSealedCanonicalRegistry: true as const,
    requiresExactlyOneFoundationEntry: true as const,
    requiresCanonicalPopulatedThenSealed: true as const,
    requiresAdEx209Authority: true as const,
    authorizingDecisionId: "AD-EX2-09" as const,
    requiresNextPhaseDeclaredAsMetadataOnly: true as const,
    nextPhaseMetadata: ExecutiveJournalExperienceRegistryNextPhase,
    requiresProductionGatesToPass: false as const,
    doesNotMeanEx23AuthorizedOrCreated: true as const,
    doesNotMeanModelFilesExist: true as const,
    doesNotMeanUiOrPlatformExists: true as const,
    doesNotMeanRtc2IntegrationActive: true as const,
    doesNotMeanProductionOrDeploymentReady: true as const,
    doesNotMeanRouteAvailable: true as const,
  } as const);

/**
 * Canonical immutable Registry lifecycle declaration.
 */
export const ExecutiveJournalExperienceRegistryLifecycle = Object.freeze({
  lifecycleId: "EX-2:2/ExecutiveJournalExperienceRegistryLifecycle" as const,
  sourcePhase: "EX-2:2" as const,
  states: ExecutiveJournalExperienceRegistryLifecycleStates,
  stateCount: ExecutiveJournalExperienceRegistryLifecycleStates.length,
  transitions: TRANSITIONS,
  stateSemantics: ExecutiveJournalExperienceRegistryLifecycleStateSemantics,
  currentState: "Sealed" as const,
  readiness: "ReadyForModel" as const,
  acceptsFurtherRegistration: false as const,
  readyForModelRequirements:
    ExecutiveJournalExperienceReadyForModelRequirements,
  executesTransitions: false as const,
  runtimeStateMachine: false as const,
  laterPhasesAuthorized: false as const,
  laterPhasesCompleted: false as const,
  ex23Authorized: false as const,
  ex23Created: false as const,
  assertState: assertExecutiveJournalExperienceRegistryLifecycleState,
  assertTransition: assertExecutiveJournalExperienceRegistryLifecycleTransition,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
  sideEffectFree: true as const,
} as const);
