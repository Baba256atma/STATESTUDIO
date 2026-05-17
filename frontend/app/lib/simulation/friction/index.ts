/**
 * D7:3:3 — Organizational decision friction intelligence (public surface).
 */

export type {
  DecisionFrictionStateLabel,
  DecisionFrictionSignal,
  DecisionLatencyRecord,
  ExecutionResistanceBottleneck,
  OrganizationalDragRecord,
  OrganizationalDecisionFrictionState,
  ExecutiveDecisionFrictionSemantics,
  OrganizationalDecisionFrictionSnapshot,
  DecisionFrictionPanelContract,
  DecisionFrictionPanelSignalRow,
  DecisionFrictionPanelBottleneckRow,
  SimulationDecisionFrictionContext,
  EvaluateDecisionFrictionInput,
  EvaluateDecisionFrictionResult,
} from "./decisionFrictionTypes.ts";

export type { FrictionGuardCode, FrictionGuardResult } from "./decisionFrictionGuards.ts";
export {
  DEFAULT_MAX_FRICTION_SIGNALS,
  PROHIBITED_FRICTION_TEXT,
  buildFrictionContentFingerprint,
  containsProhibitedFrictionText,
  guardEvaluateDecisionFriction,
} from "./decisionFrictionGuards.ts";

export { logDecisionFrictionDev } from "./decisionFrictionDevLog.ts";
export type { DecisionFrictionDevChannel } from "./decisionFrictionDevLog.ts";

export {
  deriveDecisionFrictionSignals,
  calculateStrategicResistanceScore,
  calculateExecutionLatencyScore,
  calculateOrganizationalDragLevel,
  identifyFrictionHotspots,
  identifyResistanceZones,
  classifyDecisionFrictionLabel,
} from "./executionResistanceModel.ts";

export { analyzeDecisionLatency } from "./decisionLatencyAnalysis.ts";

export {
  detectExecutionResistanceBottlenecks,
  analyzeOrganizationalDrag,
} from "./organizationalDragIntelligence.ts";

export { buildExecutiveDecisionFrictionSemantics } from "./executiveDecisionFrictionSemantics.ts";

export {
  evaluateDecisionFriction,
  buildDecisionFrictionPanelContract,
  freezeOrganizationalDecisionFrictionSnapshot,
} from "./organizationalDecisionFrictionEngine.ts";
