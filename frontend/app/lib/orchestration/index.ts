/* D7:5:10 — Unified executive strategic intelligence orchestration */
export type {
  UnifiedOrchestrationStateLabel,
  UnifiedExecutiveOrchestrationSignal,
  CrossIntelligenceSynchronizationRecord,
  OrchestrationStabilityRecord,
  UnifiedExecutiveCognitionRecord,
  UnifiedExecutiveOrchestrationState,
  UnifiedExecutiveOrchestrationSemantics,
  UnifiedExecutiveOrchestrationSnapshot,
  UnifiedOrchestrationPanelContract,
  UnifiedOrchestrationPanelRow,
  SimulationUnifiedOrchestrationContext,
  EvaluateUnifiedExecutiveOrchestrationInput,
  EvaluateUnifiedExecutiveOrchestrationResult,
} from "./unifiedExecutiveOrchestrationTypes.ts";

export type {
  UnifiedExecutiveOrchestrationGuardCode,
  UnifiedExecutiveOrchestrationGuardResult,
} from "./orchestrationGuards.ts";
export {
  DEFAULT_MAX_ORCHESTRATION_SIGNALS,
  ORCHESTRATION_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_ORCHESTRATION_DISCLAIMER,
  buildOrchestrationContentFingerprint,
  guardEvaluateUnifiedExecutiveOrchestration,
  guardOrchestrationExecutiveSemantics,
} from "./orchestrationGuards.ts";

export { logUnifiedExecutiveOrchestrationDev } from "./orchestrationDevLog.ts";
export type { UnifiedExecutiveOrchestrationDevChannel } from "./orchestrationDevLog.ts";

export {
  deriveUnifiedExecutiveOrchestrationSignals,
  analyzeCrossIntelligenceSynchronization,
  calculateOrchestrationCoherenceScore,
  calculateCrossSystemSynchronizationScore,
  calculateOrchestrationInstabilityScore,
  identifySynchronizedIntelligenceZones,
  identifyOrchestrationFragilityZones,
  classifyExecutiveOrchestrationLabel,
} from "./crossIntelligenceSynchronizationModel.ts";

export { analyzeOrchestrationStability } from "./orchestrationStabilityAnalysis.ts";
export { analyzeUnifiedExecutiveCognition } from "./unifiedExecutiveCognitionIntelligence.ts";
export { buildUnifiedExecutiveOrchestrationSemantics } from "./unifiedExecutiveOrchestrationSemantics.ts";

export {
  evaluateUnifiedExecutiveOrchestration,
  buildUnifiedOrchestrationPanelContract,
  freezeUnifiedExecutiveOrchestrationSnapshot,
} from "./unifiedExecutiveStrategicOrchestrationEngine.ts";
