/**
 * D7:3:5 — Organizational trust stability intelligence (public surface).
 */

export type {
  OrganizationalTrustStateLabel,
  OrganizationalTrustSignal,
  CoordinationTrustRecord,
  TrustStabilityBottleneck,
  CrossDomainTrustRecord,
  OrganizationalTrustState,
  ExecutiveTrustSemantics,
  OrganizationalTrustSnapshot,
  TrustPanelContract,
  TrustPanelSignalRow,
  TrustPanelBottleneckRow,
  SimulationTrustContext,
  EvaluateOrganizationalTrustInput,
  EvaluateOrganizationalTrustResult,
} from "./trustStabilityTypes.ts";

export type { TrustGuardCode, TrustGuardResult } from "./trustGuards.ts";
export {
  DEFAULT_MAX_TRUST_SIGNALS,
  PROHIBITED_TRUST_TEXT,
  buildTrustContentFingerprint,
  containsProhibitedTrustText,
  guardEvaluateOrganizationalTrust,
} from "./trustGuards.ts";

export { logTrustDev } from "./trustDevLog.ts";
export type { TrustDevChannel } from "./trustDevLog.ts";

export {
  deriveOrganizationalTrustSignals,
  calculateOrganizationalTrustScore,
  calculateTrustDegradationScore,
  calculateTrustRecoveryMomentum,
  identifyTrustFragilityZones,
  identifyTrustRecoveryZones,
  classifyTrustStabilityLabel,
} from "./trustDegradationRecoveryModel.ts";

export {
  analyzeCoordinationTrust,
  detectTrustStabilityBottlenecks,
} from "./coordinationTrustAnalysis.ts";

export { analyzeCrossDomainTrustStability } from "./crossDomainTrustStability.ts";

export { buildExecutiveTrustSemantics } from "./executiveTrustSemantics.ts";

export {
  evaluateOrganizationalTrust,
  buildTrustPanelContract,
  freezeOrganizationalTrustSnapshot,
} from "./organizationalTrustStabilityEngine.ts";
