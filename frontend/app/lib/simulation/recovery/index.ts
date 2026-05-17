/**
 * D7:2:5 — Organizational recovery capacity intelligence (public surface).
 */

export type {
  RecoveryCapacityLevel,
  RecoveryCapacityZone,
  RegionRecoveryProfile,
  RecoveryBottleneck,
  RecoveryPropagationRecord,
  OrganizationalRecoveryState,
  ExecutiveRecoverySemantics,
  OrganizationalRecoverySnapshot,
  RecoveryPanelContract,
  RecoveryPanelZoneRow,
  RecoveryPanelBottleneckRow,
  RegionRecoveryMetrics,
  SimulationRecoveryContext,
  EvaluateRecoveryCapacityInput,
  EvaluateRecoveryCapacityResult,
} from "./recoveryCapacityTypes.ts";

export type { RecoveryGuardCode, RecoveryGuardResult } from "./recoveryGuards.ts";
export {
  DEFAULT_MAX_RECOVERY_ZONES,
  DEFAULT_MAX_RECOVERY_PROPAGATION_RECORDS,
  DEFAULT_MAX_RESILIENCE_SCORE,
  buildRecoveryContentFingerprint,
  detectRecoveryZoneOverlap,
  detectRecursiveRecoveryPropagation,
  guardEvaluateRecoveryCapacity,
} from "./recoveryGuards.ts";

export { logRecoveryDev } from "./recoveryDevLog.ts";
export type { RecoveryDevChannel } from "./recoveryDevLog.ts";

export { buildRegionalRecoveryProfiles } from "./regionalRecoveryCapacityModel.ts";

export { clusterRecoveryCapacityZones } from "./recoveryZoneClustering.ts";

export {
  calculateResilienceScore,
  calculateStabilizationPotential,
  calculateRecoveryThroughputScore,
  classifyResilienceLabel,
} from "./resilienceModeling.ts";

export { detectRecoveryBottlenecks } from "./recoveryBottleneckAnalysis.ts";

export { analyzeRecoveryPropagation } from "./recoveryPropagationIntelligence.ts";

export { buildExecutiveRecoverySemantics } from "./executiveRecoverySemantics.ts";

export {
  evaluateRecoveryCapacity,
  buildRecoveryPanelContract,
  freezeOrganizationalRecoverySnapshot,
} from "./organizationalRecoveryCapacityEngine.ts";
