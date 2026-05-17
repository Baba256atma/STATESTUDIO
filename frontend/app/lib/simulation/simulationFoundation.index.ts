/**
 * D7:1:1 — Reality Simulation Core foundation (public surface).
 * Import from this module for substrate APIs; does not replace scenario/propagation engines.
 */

export type {
  SimulationRuntimeState,
  SimulationTimestamp,
  SimulationBranchId,
  SimulationOperationalMetrics,
  SimulationRuntimeConfig,
  SimulationRuntimeMeta,
} from "./simulationTypes.ts";

export type {
  SimulationEventType,
  SimulationEvent,
  SimulationEventPayloadStateChange,
  SimulationEventPayloadRiskIncrease,
} from "./simulationEventTypes.ts";

export type {
  SimulationStateSnapshot,
  CreateSimulationSnapshotInput,
} from "./simulationStateSnapshot.ts";

export {
  buildSimulationSnapshotFingerprint,
  createSimulationStateSnapshot,
  cloneObjectStates,
} from "./simulationStateSnapshot.ts";

export {
  createSimulationTimestamp,
  advanceSimulationTick,
  compareSimulationTicks,
  isSimulationTickBefore,
} from "./simulationClock.ts";

export {
  DEFAULT_MAX_SIMULATION_TICKS,
  DEFAULT_MAX_QUEUED_EVENTS,
  validateRuntimeTransition,
  assertMaxTicks,
  guardDuplicateEvent,
  guardStaleSimulation,
  validateSimulationSnapshot,
  guardEventQueueCapacity,
} from "./simulationGuards.ts";
export type { SimulationGuardCode, SimulationGuardResult } from "./simulationGuards.ts";

export {
  selectSimulationRuntimeMeta,
  selectLatestSimulationSnapshot,
  selectSimulationSnapshotAtTick,
  selectPendingSimulationEvents,
  selectProcessedSimulationEventIds,
  selectSimulationObjectState,
  selectReplayOrderedSnapshots,
} from "./simulationSelectors.ts";

export type { SimulationRuntime, SimulationCycleResult } from "./simulationRuntime.ts";

export {
  createSimulationRuntime,
  prepareSimulationRuntime,
  startSimulationRuntime,
  pauseSimulationRuntime,
  completeSimulationRuntime,
  failSimulationRuntime,
  enqueueSimulationEvent,
  advanceSimulationCycle,
  buildSimulationReplayTimeline,
} from "./simulationRuntime.ts";

/* D7:1:2 — Operational state evolution */
export type {
  OperationalSimulationState,
  OperationalStateMetadata,
  SimulatedObjectState,
} from "./operationalStateTypes.ts";
export { OPERATIONAL_STATE_LABELS, createInitialSimulatedObjectState } from "./operationalStateTypes.ts";

export type {
  SimulationTransitionReason,
  SimulationStateTransition,
  AppliedOperationalTransition,
  OperationalTransitionRejection,
} from "./simulationTransitions.ts";

export type { PropagationEvolutionSignal } from "./propagationEvolutionSignals.ts";
export {
  propagationSignalsFromOverlay,
  mergePropagationPressureByObject,
} from "./propagationEvolutionSignals.ts";

export {
  OPERATIONAL_ESCALATION_LADDER,
  isDirectTransitionAllowed,
  targetStateFromPressure,
} from "./operationalStateTransitionRules.ts";

export type {
  OperationalEvolutionInput,
  OperationalEvolutionResult,
} from "./operationalStateEvolutionEngine.ts";

export {
  evolveOperationalState,
  operationalEvolutionFingerprint,
  simulatedStatesToSnapshotObjectStates,
  snapshotObjectStatesToSimulatedStates,
} from "./operationalStateEvolutionEngine.ts";

/* D7:1:3 — Simulation event propagation */
export type {
  SimulationPropagationType,
  SimulationPropagationEvent,
  SimulationPropagationPath,
  SimulationPropagationChain,
  SimulationPropagationCascadeRecord,
  SimulationPropagationSnapshotState,
  SimulationPropagationRejection,
  SimulationPropagationRejectionCode,
} from "./simulationPropagationTypes.ts";
export { SIMULATION_PROPAGATION_LABELS } from "./simulationPropagationTypes.ts";

export type {
  SimulationPropagationEdge,
  SimulationObjectGraphNode,
  SimulationObjectGraph,
} from "./simulationPropagationGraph.ts";
export {
  buildSimulationObjectGraphFromScene,
  getOutgoingPropagationEdges,
  getIncomingPropagationEdges,
  reconstructPropagationPath,
} from "./simulationPropagationGraph.ts";

export {
  PROPAGATION_ATTENUATION_BY_DEPTH,
  PROPAGATION_MAX_EFFECTIVE_DEPTH,
  applyAttenuation,
  attenuationFactorForDepth,
} from "./simulationPropagationAttenuation.ts";

export type {
  PropagateSimulationEventInput,
  SimulationPropagationResult,
} from "./simulationEventPropagationEngine.ts";

export {
  propagateSimulationEvent,
  propagateSimulationEvents,
  simulationPropagationFingerprint,
  propagationResultToEvolutionSignals,
} from "./simulationEventPropagationEngine.ts";

/* D7:1:4 — Operational timeline evolution */
export * from "./timeline/index.ts";

/* D7:1:5 — Scenario branching timelines */
export * from "./branching/index.ts";

/* D7:1:6 — Executive scenario comparison */
export * from "./comparison/index.ts";

/* D7:1:7 — Strategic decision consequence simulation */
export * from "./decision/index.ts";

/* D7:1:8 — Executive war-room simulation orchestration */
export * from "./warroom/index.ts";

/* D7:1:9 — Executive simulation replay + strategic memory */
export * from "./replay/index.ts";

/* D7:1:10 — Simulation stability + anti-chaos governance */
export * from "./governance/index.ts";

/* D7:2:1 — Operational universe topology */
export * from "./topology/index.ts";

/* D7:2:2 — Organizational flow dynamics */
export * from "./flow/index.ts";

/* D7:2:3 — Enterprise dependency pressure intelligence */
export * from "./pressure/index.ts";

/* D7:2:4 — Operational fragility concentration mapping */
export * from "./fragility/index.ts";

/* D7:2:5 — Organizational recovery capacity intelligence */
export * from "./recovery/index.ts";

/* D7:2:6 — Enterprise operational momentum intelligence */
export * from "./momentum/index.ts";

/* D7:2:7 — Strategic operational equilibrium intelligence */
export * from "./equilibrium/index.ts";

/* D7:2:8 — Enterprise systemic risk gravity intelligence */
export * from "./gravity/index.ts";

/* D7:3:1 — Strategic human actor simulation foundation */
export * from "./actors/index.ts";

/* D7:3:2 — Executive coordination dynamics intelligence */
export * from "./coordination/index.ts";

/* D7:3:3 — Organizational decision friction intelligence */
export * from "./friction/index.ts";

/* D7:3:4 — Stakeholder influence propagation intelligence */
export * from "./influence/index.ts";

/* D7:3:5 — Organizational trust stability intelligence */
export * from "./trust/index.ts";

/* D7:3:6 — Strategic leadership load dynamics intelligence */
export * from "./leadership/index.ts";

/* D7:3:7 — Organizational alignment drift intelligence */
export * from "./alignment/index.ts";

/* D7:3:8 — Enterprise human-system resilience intelligence */
export * from "./resilience/index.ts";

/* D7:4:1 — Predictive future trajectory intelligence foundation */
export * from "./predictive/index.ts";

/* D7:5:1 — Autonomous strategic recommendation intelligence foundation */
export * from "../recommendation/index.ts";

/* D7:5:10 — Unified executive strategic intelligence orchestration */
export * from "../orchestration/index.ts";

/* D7:6:1 — Executive cognitive UX orchestration foundation */
export * from "../cognitive/index.ts";
