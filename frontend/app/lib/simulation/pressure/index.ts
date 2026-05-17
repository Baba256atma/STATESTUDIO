/**
 * D7:2:3 — Enterprise dependency pressure intelligence (public surface).
 */

export type {
  DependencyPressureType,
  DependencyPressureSignal,
  RegionPressureAccumulation,
  FragilityHotspot,
  PressurePropagationRecord,
  EnterprisePressureState,
  ExecutivePressureSemantics,
  EnterprisePressureSnapshot,
  PressurePanelContract,
  PressurePanelSignalRow,
  PressurePanelHotspotRow,
  RegionPressureMetrics,
  SimulationPressureContext,
  EvaluateDependencyPressureInput,
  EvaluateDependencyPressureResult,
} from "./dependencyPressureTypes.ts";

export type { PressureGuardCode, PressureGuardResult } from "./pressureGuards.ts";
export {
  DEFAULT_MAX_PRESSURE_SIGNALS,
  DEFAULT_MAX_PRESSURE_PROPAGATION_DEPTH,
  DEFAULT_MAX_SYSTEMIC_PRESSURE_SCORE,
  buildPressureContentFingerprint,
  detectPressureCycle,
  guardEvaluateDependencyPressure,
} from "./pressureGuards.ts";

export { logPressureDev } from "./pressureDevLog.ts";
export type { PressureDevChannel } from "./pressureDevLog.ts";

export {
  derivePressureSignalsFromDependencies,
  applySimulationEventPressureAdjustments,
  accumulateRegionalPressure,
} from "./pressureAccumulationModel.ts";

export { analyzePressurePropagation } from "./pressurePropagationAnalysis.ts";

export {
  detectSaturationRegions,
  detectFragilityHotspots,
} from "./saturationDetection.ts";

export {
  calculateSystemicPressureScore,
  calculateCascadeRiskScore,
  classifyPressureStability,
} from "./systemicPressureModel.ts";

export { buildExecutivePressureSemantics } from "./executivePressureSemantics.ts";

export {
  evaluateDependencyPressure,
  buildPressurePanelContract,
  freezeEnterprisePressureSnapshot,
} from "./enterpriseDependencyPressureEngine.ts";
