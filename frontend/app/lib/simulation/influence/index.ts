/**
 * D7:3:4 — Stakeholder influence propagation intelligence (public surface).
 */

export type {
  StakeholderInfluenceStateLabel,
  StakeholderInfluenceSignal,
  InfluencePropagationRecord,
  InfluenceBottleneck,
  StakeholderInfluenceState,
  ExecutiveInfluenceSemantics,
  StakeholderInfluenceSnapshot,
  InfluencePanelContract,
  InfluencePanelSignalRow,
  InfluencePanelBottleneckRow,
  SimulationInfluenceContext,
  EvaluateStakeholderInfluenceInput,
  EvaluateStakeholderInfluenceResult,
} from "./stakeholderInfluenceTypes.ts";

export type { InfluenceGuardCode, InfluenceGuardResult } from "./influenceGuards.ts";
export {
  DEFAULT_MAX_INFLUENCE_SIGNALS,
  PROHIBITED_INFLUENCE_TEXT,
  buildInfluenceContentFingerprint,
  containsProhibitedInfluenceText,
  guardEvaluateStakeholderInfluence,
} from "./influenceGuards.ts";

export { logInfluenceDev } from "./influenceDevLog.ts";
export type { InfluenceDevChannel } from "./influenceDevLog.ts";

export {
  deriveStakeholderInfluenceSignals,
  calculateOrganizationalAlignmentLevel,
  calculateInfluencePropagationScore,
  calculateResistanceConcentrationScore,
  identifyInfluenceHotspots,
  identifyInfluenceResistanceZones,
  identifyInfluenceAlignmentZones,
  classifyInfluenceStabilityLabel,
} from "./alignmentResistancePropagationModel.ts";

export { detectInfluenceBottlenecks } from "./influenceBottleneckAnalysis.ts";

export { analyzeCrossDomainInfluencePropagation } from "./crossDomainInfluenceIntelligence.ts";

export { buildExecutiveInfluenceSemantics } from "./executiveInfluenceSemantics.ts";

export {
  evaluateStakeholderInfluence,
  buildInfluencePanelContract,
  freezeStakeholderInfluenceSnapshot,
} from "./stakeholderInfluencePropagationEngine.ts";
