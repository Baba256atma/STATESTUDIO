/**
 * D7:3:7 — Organizational alignment drift intelligence (public surface).
 */

export type {
  OrganizationalAlignmentSignalState,
  OrganizationalAlignmentSignal,
  DriftAccumulationRecord,
  AlignmentFragmentationBottleneck,
  CrossDomainAlignmentRecord,
  OrganizationalAlignmentDriftState,
  ExecutiveAlignmentSemantics,
  OrganizationalAlignmentSnapshot,
  AlignmentPanelContract,
  AlignmentPanelSignalRow,
  AlignmentPanelBottleneckRow,
  SimulationAlignmentContext,
  EvaluateOrganizationalAlignmentInput,
  EvaluateOrganizationalAlignmentResult,
} from "./alignmentDriftTypes.ts";

export type { AlignmentGuardCode, AlignmentGuardResult } from "./alignmentGuards.ts";
export {
  DEFAULT_MAX_ALIGNMENT_SIGNALS,
  PROHIBITED_ALIGNMENT_TEXT,
  buildAlignmentContentFingerprint,
  containsProhibitedAlignmentText,
  guardEvaluateOrganizationalAlignment,
} from "./alignmentGuards.ts";

export { logAlignmentDev } from "./alignmentDevLog.ts";
export type { AlignmentDevChannel } from "./alignmentDevLog.ts";

export {
  deriveOrganizationalAlignmentSignals,
  calculateEnterpriseAlignmentScore,
  calculateAlignmentDriftScore,
  calculateStrategicCoherenceLevel,
  identifyAlignmentDriftZones,
  identifyCoherenceRecoveryZones,
  classifyAlignmentDriftLabel,
} from "./strategicCoherenceModel.ts";

export {
  analyzeDriftAccumulation,
  detectAlignmentFragmentationBottlenecks,
} from "./driftAccumulationAnalysis.ts";

export { analyzeCrossDomainAlignment } from "./crossDomainAlignmentIntelligence.ts";

export { buildExecutiveAlignmentSemantics } from "./executiveAlignmentSemantics.ts";

export {
  evaluateOrganizationalAlignment,
  buildAlignmentPanelContract,
  freezeOrganizationalAlignmentSnapshot,
} from "./organizationalAlignmentDriftEngine.ts";
