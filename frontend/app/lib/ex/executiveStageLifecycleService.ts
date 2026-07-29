/**
 * EX-1:6 — Executive Stage Lifecycle Service.
 *
 * Seven canonical Stage lifecycle states. Transitions are deterministic.
 * Business transition rules belong to later phases.
 *
 * Ownership: owned exclusively by EX-1:6.
 */

/** Canonical Stage lifecycle state name. */
export type ExecutiveStageLifecycleStateName =
  | "Created"
  | "Initializing"
  | "Loading Runtime"
  | "Ready"
  | "Updating"
  | "Suspended"
  | "Disposed";

/** Lifecycle state declaration. */
export interface ExecutiveStageLifecycleStateDeclaration {
  readonly stateId: string;
  readonly stateName: ExecutiveStageLifecycleStateName;
  readonly description: string;
  readonly order: number;
  readonly mutatesBusinessState: false;
  readonly contractsOnly: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const state = (
  stateName: ExecutiveStageLifecycleStateName,
  description: string,
  order: number,
): ExecutiveStageLifecycleStateDeclaration =>
  Object.freeze({
    stateId: `EX-1:6/Lifecycle/${stateName.replace(/\s+/g, "")}`,
    stateName,
    description,
    order,
    mutatesBusinessState: false as const,
    contractsOnly: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly seven canonical Stage lifecycle states. */
export const ExecutiveStageLifecycleStates = Object.freeze([
  state("Created", "Stage identity has been created.", 1),
  state("Initializing", "Stage platform services are initializing.", 2),
  state(
    "Loading Runtime",
    "Stage is attaching and loading Runtime context.",
    3,
  ),
  state("Ready", "Stage is ready for Runtime-driven rendering.", 4),
  state("Updating", "Stage is refreshing from Runtime updates.", 5),
  state("Suspended", "Stage execution is temporarily suspended.", 6),
  state("Disposed", "Stage has been disposed and released.", 7),
] as const);

export const ExecutiveStageLifecycleStateNames = Object.freeze([
  "Created",
  "Initializing",
  "Loading Runtime",
  "Ready",
  "Updating",
  "Suspended",
  "Disposed",
] as const satisfies readonly ExecutiveStageLifecycleStateName[]);

/** Deterministic lifecycle transition edges. */
export const ExecutiveStageLifecycleTransitions = Object.freeze([
  Object.freeze({
    transitionId: "EX-1:6/Transition/01",
    from: "Created",
    to: "Initializing",
  }),
  Object.freeze({
    transitionId: "EX-1:6/Transition/02",
    from: "Initializing",
    to: "Loading Runtime",
  }),
  Object.freeze({
    transitionId: "EX-1:6/Transition/03",
    from: "Loading Runtime",
    to: "Ready",
  }),
  Object.freeze({
    transitionId: "EX-1:6/Transition/04",
    from: "Ready",
    to: "Updating",
  }),
  Object.freeze({
    transitionId: "EX-1:6/Transition/05",
    from: "Updating",
    to: "Ready",
  }),
  Object.freeze({
    transitionId: "EX-1:6/Transition/06",
    from: "Ready",
    to: "Suspended",
  }),
  Object.freeze({
    transitionId: "EX-1:6/Transition/07",
    from: "Suspended",
    to: "Ready",
  }),
  Object.freeze({
    transitionId: "EX-1:6/Transition/08",
    from: "Ready",
    to: "Disposed",
  }),
  Object.freeze({
    transitionId: "EX-1:6/Transition/09",
    from: "Suspended",
    to: "Disposed",
  }),
] as const);

/** Lifecycle service catalogue. */
export const ExecutiveStageLifecycleService = Object.freeze({
  serviceId: "EX-1:6/LifecycleService",
  states: ExecutiveStageLifecycleStates,
  stateNames: ExecutiveStageLifecycleStateNames,
  stateCount: ExecutiveStageLifecycleStates.length,
  transitions: ExecutiveStageLifecycleTransitions,
  transitionCount: ExecutiveStageLifecycleTransitions.length,
  deterministicTransitions: true as const,
  businessTransitionRules: false as const,
  contractsOnly: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
