/**
 * D7:1:7 — Strategic decision consequence simulation (public surface).
 */

export type {
  StrategicDecisionType,
  StrategicDecisionInput,
  DecisionConsequenceEffect,
  DecisionConsequenceTradeoff,
  ExecutiveDecisionConsequenceNarrative,
  DecisionConsequenceSnapshot,
  WarRoomDecisionSimulationContract,
  SimulateStrategicDecisionInput,
  DecisionSimulationOutcome,
  StrategicDecisionSimulationResult,
} from "./strategicDecisionTypes.ts";

export type { DecisionGuardCode, DecisionGuardResult } from "./decisionGuards.ts";
export { guardStrategicDecisionSimulation, normalizeDecisionIntensity } from "./decisionGuards.ts";

export { logDecisionDev } from "./decisionDevLog.ts";
export type { DecisionDevChannel } from "./decisionDevLog.ts";

export type { ModeledDecisionImpact } from "./decisionEffectModel.ts";
export {
  modelStrategicDecisionImpact,
  extractMetricsRecord,
} from "./decisionEffectModel.ts";

export {
  buildDecisionSimulationEvent,
  buildDecisionPropagationGraph,
  runDecisionPropagation,
} from "./decisionPropagationBridge.ts";

export { analyzeDecisionConsequenceTradeoffs } from "./decisionConsequenceTradeoffs.ts";
export { buildExecutiveDecisionNarrative } from "./executiveDecisionNarratives.ts";

export {
  simulateStrategicDecision,
  buildDecisionSimulationFingerprint,
  buildWarRoomDecisionContract,
  freezeDecisionSimulationOutcome,
} from "./strategicDecisionConsequenceEngine.ts";
