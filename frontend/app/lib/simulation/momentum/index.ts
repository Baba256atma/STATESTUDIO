/**
 * D7:2:6 — Enterprise operational momentum intelligence (public surface).
 */

export type {
  MomentumDirection,
  OperationalMomentumSignal,
  RegionMomentumProfile,
  MomentumPropagationRecord,
  EnterpriseMomentumState,
  ExecutiveMomentumSemantics,
  EnterpriseMomentumSnapshot,
  MomentumPanelContract,
  MomentumPanelSignalRow,
  RegionMomentumMetrics,
  SimulationMomentumContext,
  EvaluateOperationalMomentumInput,
  EvaluateOperationalMomentumResult,
} from "./operationalMomentumTypes.ts";

export type { MomentumGuardCode, MomentumGuardResult } from "./momentumGuards.ts";
export {
  DEFAULT_MAX_MOMENTUM_SIGNALS,
  DEFAULT_MAX_MOMENTUM_PROPAGATION_RECORDS,
  DEFAULT_MAX_ORGANIZATIONAL_MOMENTUM_SCORE,
  buildMomentumContentFingerprint,
  detectUnstableMomentumLoop,
  guardEvaluateOperationalMomentum,
} from "./momentumGuards.ts";

export { logMomentumDev } from "./momentumDevLog.ts";
export type { MomentumDevChannel } from "./momentumDevLog.ts";

export {
  buildRegionalMomentumProfiles,
  deriveMomentumSignalsFromProfiles,
} from "./regionalMomentumModel.ts";

export {
  identifyAccelerationZones,
  identifyDegradationZones,
  identifyStagnationZones,
  calculateRecoveryMomentumScore,
  calculateOrganizationalMomentumScore,
  classifyMomentumTrendLabel,
} from "./accelerationDegradationModel.ts";

export { calculateOrganizationalInertiaScore } from "./organizationalInertiaAnalysis.ts";

export { analyzeMomentumPropagation } from "./momentumPropagationIntelligence.ts";

export { buildExecutiveMomentumSemantics } from "./executiveMomentumSemantics.ts";

export {
  evaluateOperationalMomentum,
  buildMomentumPanelContract,
  freezeEnterpriseMomentumSnapshot,
} from "./enterpriseOperationalMomentumEngine.ts";
