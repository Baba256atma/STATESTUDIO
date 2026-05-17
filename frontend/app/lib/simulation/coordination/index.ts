/**
 * D7:3:2 — Executive coordination dynamics intelligence (public surface).
 */

export type {
  ExecutiveCoordinationStateLabel,
  ExecutiveCoordinationSignal,
  CoordinationBottleneck,
  CrossDomainSynchronizationRecord,
  ExecutiveCoordinationState,
  ExecutiveCoordinationSemantics,
  ExecutiveCoordinationSnapshot,
  CoordinationPanelContract,
  CoordinationPanelSignalRow,
  CoordinationPanelBottleneckRow,
  SimulationCoordinationContext,
  EvaluateExecutiveCoordinationInput,
  EvaluateExecutiveCoordinationResult,
} from "./coordinationDynamicsTypes.ts";

export type { CoordinationGuardCode, CoordinationGuardResult } from "./coordinationGuards.ts";
export {
  DEFAULT_MAX_COORDINATION_SIGNALS,
  PROHIBITED_COORDINATION_TEXT,
  buildCoordinationContentFingerprint,
  containsProhibitedCoordinationText,
  guardEvaluateExecutiveCoordination,
} from "./coordinationGuards.ts";

export { logCoordinationDev } from "./coordinationDevLog.ts";
export type { CoordinationDevChannel } from "./coordinationDevLog.ts";

export {
  deriveExecutiveCoordinationSignals,
  calculateExecutiveAlignmentScore,
  calculateCoordinationFrictionScore,
  calculateOrganizationalSynchronizationScore,
  identifyAlignmentZones,
  identifyFrictionZones,
  classifyCoordinationDynamicsLabel,
} from "./alignmentFrictionModel.ts";

export { detectCoordinationBottlenecks } from "./coordinationBottleneckAnalysis.ts";

export { analyzeCrossDomainSynchronization } from "./crossDomainSynchronization.ts";

export { buildExecutiveCoordinationSemantics } from "./executiveCoordinationSemantics.ts";

export {
  evaluateExecutiveCoordination,
  buildCoordinationPanelContract,
  freezeExecutiveCoordinationSnapshot,
} from "./executiveCoordinationDynamicsEngine.ts";
