export type {
  CognitionState,
  ConvergenceCategory,
  ConvergenceStrength,
  CrossDomainAwarenessTopology,
  CognitiveSingularityStoreState,
  CognitiveSingularitySummary,
  EnterpriseCognitiveSingularityInput,
  EnterpriseCognitiveSingularityResult,
  EnterpriseCognitiveSingularitySnapshot,
  IntelligenceConvergenceObservation,
  StrategicIntelligenceConvergenceSignal,
  UnifiedCognitionField,
} from "./cognitiveSingularityTypes";

export type {
  AwarenessDomain,
  AwarenessFragmentationIndicator,
  AwarenessState,
  AwarenessSynchronizationObservation,
  AwarenessSynchronizationStoreState,
  CrossDomainAwarenessSignal,
  EnterpriseAwarenessSynchronizationInput,
  EnterpriseAwarenessSynchronizationResult,
  EnterpriseAwarenessSynchronizationSnapshot,
  StrategicAwarenessAlignment,
  SynchronizationStrength,
  SynchronizationSummary,
  UnifiedOperationalCognitionField,
} from "./awarenessSynchronizationTypes";

export type {
  AlignmentStrength,
  EnterprisePurposeAlignmentSignal,
  IntentCategory,
  IntentState,
  OrganizationalIntentTopology,
  PurposeAlignmentObservation,
  StrategicDirectionField,
  StrategicIntentStoreState,
  StrategicIntentSummary,
  UnifiedStrategicIntentInput,
  UnifiedStrategicIntentResult,
  UnifiedStrategicIntentSnapshot,
} from "./strategicIntentTypes";

export type {
  ConsistencyLevel,
  EnterpriseStrategicIdentityInput,
  EnterpriseStrategicIdentityResult,
  EnterpriseStrategicIdentitySnapshot,
  IdentityAlignmentObservation,
  IdentityCategory,
  IdentityState,
  OrganizationalDriftIndicator,
  OrganizationalSelfConsistencySignal,
  StrategicIdentityField,
  StrategicIdentityStoreState,
  StrategicIdentitySummary,
} from "./strategicIdentityTypes";

export type {
  CommitmentCategory,
  CommitmentStrength,
  CrossSystemCommitmentField,
  DirectionalCommitmentSignal,
  EnterpriseCommitmentObservation,
  EnterpriseStrategicWillSnapshot,
  StrategicWillFragmentationIndicator,
  StrategicWillStoreState,
  StrategicWillSummary,
  UnifiedStrategicWillInput,
  UnifiedStrategicWillResult,
  WillState,
} from "./strategicWillTypes";

export type {
  CoherenceCategory,
  CoherenceState,
  CoherenceStrength,
  CrossRuntimeMisalignmentIndicator,
  EnterpriseCoherenceField,
  StrategicCoherenceObservation,
  StrategicCoherenceStoreState,
  TotalSystemAlignmentSignal,
  TotalSystemAlignmentSummary,
  UnifiedStrategicCoherenceInput,
  UnifiedStrategicCoherenceResult,
  UnifiedStrategicCoherenceSnapshot,
} from "./strategicCoherenceTypes";

export type {
  BalanceStrength,
  CognitiveBalanceSignal,
  EnterpriseStrategicEquilibriumSnapshot,
  EquilibriumCategory,
  EquilibriumState,
  EquilibriumStabilityField,
  EnterpriseStrategicEquilibriumInput,
  EnterpriseStrategicEquilibriumResult,
  StrategicEquilibriumStoreState,
  StrategicEquilibriumSummary,
  StrategicImbalanceIndicator,
  TotalSystemBalanceObservation,
} from "./strategicEquilibriumTypes";

export type {
  CrossSystemResonanceSignal,
  EnterpriseStrategicResonanceSnapshot,
  HarmonicAlignmentField,
  ResonanceAmplificationIndicator,
  ResonanceCategory,
  ResonanceState,
  ResonanceStrength,
  StrategicReinforcementObservation,
  StrategicResonanceStoreState,
  StrategicResonanceSummary,
  UnifiedStrategicResonanceInput,
  UnifiedStrategicResonanceResult,
} from "./strategicResonanceTypes";

export type {
  EnterpriseCognitiveIntegrationField,
  FinalIntegrationSummary,
  FinalStrategicIntegrationInput,
  FinalStrategicIntegrationResult,
  FinalStrategicIntegrationSnapshot,
  FinalStrategicIntegrationStoreState,
  IntegrationCategory,
  IntegrationState,
  IntegrationStrength,
  RuntimeFragmentationIndicator,
  StrategicIntegrationObservation,
  TotalRuntimeConvergenceSignal,
} from "./finalStrategicIntegrationTypes";

export {
  COGNITIVE_SINGULARITY_MAX_FIELDS,
  COGNITIVE_SINGULARITY_MAX_OBSERVATIONS,
  COGNITIVE_SINGULARITY_MAX_SNAPSHOTS,
  COGNITIVE_SINGULARITY_MAX_SIGNALS,
  COGNITIVE_SINGULARITY_MAX_TOPOLOGIES,
  COGNITIVE_SINGULARITY_MIN_INSTITUTIONAL_SUBSYSTEMS,
  COGNITIVE_SINGULARITY_MIN_UNIFIED_RUNTIMES,
  COGNITIVE_SINGULARITY_MIN_EVAL_INTERVAL_MS,
  beginCognitiveSingularityEvaluation,
  clampCognitiveSingularityConfidence,
  cognitionStateRank,
  convergenceStrengthRank,
  endCognitiveSingularityEvaluation,
  resetCognitiveSingularityGuards,
  shouldEvaluateCognitiveSingularity,
  shouldRetainIntelligenceConvergenceObservation,
  validateIntelligenceConvergenceObservation,
} from "./cognitiveSingularityGuards";

export {
  AWARENESS_SYNC_MAX_ALIGNMENTS,
  AWARENESS_SYNC_MAX_FIELDS,
  AWARENESS_SYNC_MAX_FRAGMENTATION_INDICATORS,
  AWARENESS_SYNC_MAX_OBSERVATIONS,
  AWARENESS_SYNC_MAX_SNAPSHOTS,
  AWARENESS_SYNC_MAX_SIGNALS,
  AWARENESS_SYNC_MIN_INSTITUTIONAL_SUBSYSTEMS,
  AWARENESS_SYNC_MIN_SINGULARITY_OBSERVATIONS,
  AWARENESS_SYNC_MIN_UNIFIED_RUNTIMES,
  AWARENESS_SYNC_MIN_EVAL_INTERVAL_MS,
  awarenessStateRank,
  beginAwarenessSynchronizationEvaluation,
  clampAwarenessSynchronizationConfidence,
  endAwarenessSynchronizationEvaluation,
  resetAwarenessSynchronizationGuards,
  shouldEvaluateAwarenessSynchronization,
  shouldRetainAwarenessSynchronizationObservation,
  synchronizationStrengthRank,
  validateAwarenessSynchronizationObservation,
} from "./awarenessSynchronizationGuards";

export {
  STRATEGIC_INTENT_MAX_FIELDS,
  STRATEGIC_INTENT_MAX_OBSERVATIONS,
  STRATEGIC_INTENT_MAX_SNAPSHOTS,
  STRATEGIC_INTENT_MAX_SIGNALS,
  STRATEGIC_INTENT_MAX_TOPOLOGIES,
  STRATEGIC_INTENT_MIN_AWARENESS_SYNC_OBSERVATIONS,
  STRATEGIC_INTENT_MIN_INSTITUTIONAL_SUBSYSTEMS,
  STRATEGIC_INTENT_MIN_SINGULARITY_OBSERVATIONS,
  STRATEGIC_INTENT_MIN_UNIFIED_RUNTIMES,
  STRATEGIC_INTENT_MIN_EVAL_INTERVAL_MS,
  alignmentStrengthRank,
  beginStrategicIntentEvaluation,
  clampStrategicIntentConfidence,
  endStrategicIntentEvaluation,
  intentStateRank,
  resetStrategicIntentGuards,
  shouldEvaluateStrategicIntent,
  shouldRetainPurposeAlignmentObservation,
  validatePurposeAlignmentObservation,
} from "./strategicIntentGuards";

export {
  STRATEGIC_IDENTITY_MAX_DRIFT_INDICATORS,
  STRATEGIC_IDENTITY_MAX_FIELDS,
  STRATEGIC_IDENTITY_MAX_OBSERVATIONS,
  STRATEGIC_IDENTITY_MAX_SNAPSHOTS,
  STRATEGIC_IDENTITY_MAX_SIGNALS,
  STRATEGIC_IDENTITY_MIN_INSTITUTIONAL_SUBSYSTEMS,
  STRATEGIC_IDENTITY_MIN_STRATEGIC_INTENT_OBSERVATIONS,
  STRATEGIC_IDENTITY_MIN_UNIFIED_RUNTIMES,
  STRATEGIC_IDENTITY_MIN_EVAL_INTERVAL_MS,
  beginStrategicIdentityEvaluation,
  clampStrategicIdentityConfidence,
  consistencyLevelRank,
  endStrategicIdentityEvaluation,
  identityStateRank,
  resetStrategicIdentityGuards,
  shouldEvaluateStrategicIdentity,
  shouldRetainIdentityAlignmentObservation,
  validateIdentityAlignmentObservation,
} from "./strategicIdentityGuards";

export {
  STRATEGIC_WILL_MAX_FRAGMENTATION_INDICATORS,
  STRATEGIC_WILL_MAX_FIELDS,
  STRATEGIC_WILL_MAX_OBSERVATIONS,
  STRATEGIC_WILL_MAX_SNAPSHOTS,
  STRATEGIC_WILL_MAX_SIGNALS,
  STRATEGIC_WILL_MIN_INSTITUTIONAL_SUBSYSTEMS,
  STRATEGIC_WILL_MIN_STRATEGIC_IDENTITY_OBSERVATIONS,
  STRATEGIC_WILL_MIN_UNIFIED_RUNTIMES,
  STRATEGIC_WILL_MIN_EVAL_INTERVAL_MS,
  beginStrategicWillEvaluation,
  clampStrategicWillConfidence,
  commitmentStrengthRank,
  endStrategicWillEvaluation,
  resetStrategicWillGuards,
  shouldEvaluateStrategicWill,
  shouldRetainEnterpriseCommitmentObservation,
  validateEnterpriseCommitmentObservation,
  willStateRank,
} from "./strategicWillGuards";

export {
  STRATEGIC_COHERENCE_MAX_FIELDS,
  STRATEGIC_COHERENCE_MAX_MISALIGNMENT_INDICATORS,
  STRATEGIC_COHERENCE_MAX_OBSERVATIONS,
  STRATEGIC_COHERENCE_MAX_SNAPSHOTS,
  STRATEGIC_COHERENCE_MAX_SIGNALS,
  STRATEGIC_COHERENCE_MIN_INSTITUTIONAL_SUBSYSTEMS,
  STRATEGIC_COHERENCE_MIN_STRATEGIC_WILL_OBSERVATIONS,
  STRATEGIC_COHERENCE_MIN_UNIFIED_RUNTIMES,
  STRATEGIC_COHERENCE_MIN_EVAL_INTERVAL_MS,
  beginStrategicCoherenceEvaluation,
  clampStrategicCoherenceConfidence,
  coherenceStateRank,
  coherenceStrengthRank,
  endStrategicCoherenceEvaluation,
  resetStrategicCoherenceGuards,
  shouldEvaluateStrategicCoherence,
  shouldRetainStrategicCoherenceObservation,
  validateStrategicCoherenceObservation,
} from "./strategicCoherenceGuards";

export {
  STRATEGIC_EQUILIBRIUM_MAX_FIELDS,
  STRATEGIC_EQUILIBRIUM_MAX_IMBALANCE_INDICATORS,
  STRATEGIC_EQUILIBRIUM_MAX_OBSERVATIONS,
  STRATEGIC_EQUILIBRIUM_MAX_SNAPSHOTS,
  STRATEGIC_EQUILIBRIUM_MAX_SIGNALS,
  STRATEGIC_EQUILIBRIUM_MIN_INSTITUTIONAL_SUBSYSTEMS,
  STRATEGIC_EQUILIBRIUM_MIN_STRATEGIC_COHERENCE_OBSERVATIONS,
  STRATEGIC_EQUILIBRIUM_MIN_UNIFIED_RUNTIMES,
  STRATEGIC_EQUILIBRIUM_MIN_EVAL_INTERVAL_MS,
  balanceStrengthRank,
  beginStrategicEquilibriumEvaluation,
  clampStrategicEquilibriumConfidence,
  endStrategicEquilibriumEvaluation,
  equilibriumStateRank,
  resetStrategicEquilibriumGuards,
  shouldEvaluateStrategicEquilibrium,
  shouldRetainStrategicEquilibriumObservation,
  validateStrategicEquilibriumObservation,
} from "./strategicEquilibriumGuards";

export {
  STRATEGIC_RESONANCE_MAX_AMPLIFICATION_INDICATORS,
  STRATEGIC_RESONANCE_MAX_FIELDS,
  STRATEGIC_RESONANCE_MAX_OBSERVATIONS,
  STRATEGIC_RESONANCE_MAX_SNAPSHOTS,
  STRATEGIC_RESONANCE_MAX_SIGNALS,
  STRATEGIC_RESONANCE_MIN_INSTITUTIONAL_SUBSYSTEMS,
  STRATEGIC_RESONANCE_MIN_STRATEGIC_EQUILIBRIUM_OBSERVATIONS,
  STRATEGIC_RESONANCE_MIN_UNIFIED_RUNTIMES,
  STRATEGIC_RESONANCE_MIN_EVAL_INTERVAL_MS,
  beginStrategicResonanceEvaluation,
  clampStrategicResonanceConfidence,
  endStrategicResonanceEvaluation,
  resonanceStateRank,
  resonanceStrengthRank,
  resetStrategicResonanceGuards,
  shouldEvaluateStrategicResonance,
  shouldRetainStrategicResonanceObservation,
  validateStrategicResonanceObservation,
} from "./strategicResonanceGuards";

export {
  FINAL_STRATEGIC_INTEGRATION_MAX_FIELDS,
  FINAL_STRATEGIC_INTEGRATION_MAX_FRAGMENTATION_INDICATORS,
  FINAL_STRATEGIC_INTEGRATION_MAX_OBSERVATIONS,
  FINAL_STRATEGIC_INTEGRATION_MAX_SNAPSHOTS,
  FINAL_STRATEGIC_INTEGRATION_MAX_SIGNALS,
  FINAL_STRATEGIC_INTEGRATION_MIN_INSTITUTIONAL_SUBSYSTEMS,
  FINAL_STRATEGIC_INTEGRATION_MIN_STRATEGIC_RESONANCE_OBSERVATIONS,
  FINAL_STRATEGIC_INTEGRATION_MIN_UNIFIED_RUNTIMES,
  FINAL_STRATEGIC_INTEGRATION_MIN_EVAL_INTERVAL_MS,
  beginFinalStrategicIntegrationEvaluation,
  clampFinalStrategicIntegrationConfidence,
  endFinalStrategicIntegrationEvaluation,
  integrationStateRank,
  integrationStrengthRank,
  resetFinalStrategicIntegrationGuards,
  shouldEvaluateFinalStrategicIntegration,
  shouldRetainStrategicIntegrationObservation,
  validateStrategicIntegrationObservation,
} from "./finalStrategicIntegrationGuards";

export {
  createCognitiveSingularityStore,
  getCognitiveSingularityStore,
  resetCognitiveSingularityStores,
} from "./cognitiveSingularityStore";

export {
  createAwarenessSynchronizationStore,
  getAwarenessSynchronizationStore,
  resetAwarenessSynchronizationStores,
} from "./awarenessSynchronizationStore";

export {
  createStrategicIntentStore,
  getStrategicIntentStore,
  resetStrategicIntentStores,
} from "./strategicIntentStore";

export {
  createStrategicIdentityStore,
  getStrategicIdentityStore,
  resetStrategicIdentityStores,
} from "./strategicIdentityStore";

export {
  createStrategicWillStore,
  getStrategicWillStore,
  resetStrategicWillStores,
} from "./strategicWillStore";

export {
  createStrategicCoherenceStore,
  getStrategicCoherenceStore,
  resetStrategicCoherenceStores,
} from "./strategicCoherenceStore";

export {
  createStrategicEquilibriumStore,
  getStrategicEquilibriumStore,
  resetStrategicEquilibriumStores,
} from "./strategicEquilibriumStore";

export {
  createStrategicResonanceStore,
  getStrategicResonanceStore,
  resetStrategicResonanceStores,
} from "./strategicResonanceStore";

export {
  createFinalStrategicIntegrationStore,
  getFinalStrategicIntegrationStore,
  resetFinalStrategicIntegrationStores,
} from "./finalStrategicIntegrationStore";

export { evaluateEnterpriseCognitiveSingularity } from "./cognitiveSingularityEngine";
export { evaluateEnterpriseAwarenessSynchronization } from "./awarenessSynchronizationEngine";
export { evaluateUnifiedStrategicIntent } from "./strategicIntentEngine";
export { evaluateEnterpriseStrategicIdentity } from "./strategicIdentityEngine";
export { evaluateUnifiedStrategicWill } from "./strategicWillEngine";
export { evaluateUnifiedStrategicCoherence } from "./strategicCoherenceEngine";
export { evaluateEnterpriseStrategicEquilibrium } from "./strategicEquilibriumEngine";
export { evaluateUnifiedStrategicResonance } from "./strategicResonanceEngine";
export { evaluateFinalStrategicIntegration } from "./finalStrategicIntegrationEngine";
export { integrateCognitiveSingularityWithCognition } from "./integrateCognitiveSingularityWithCognition";
export { integrateAwarenessSynchronizationWithCognition } from "./integrateAwarenessSynchronizationWithCognition";
export { integrateStrategicIntentWithCognition } from "./integrateStrategicIntentWithCognition";
export { integrateStrategicIdentityWithCognition } from "./integrateStrategicIdentityWithCognition";
export { integrateStrategicWillWithCognition } from "./integrateStrategicWillWithCognition";
export { integrateStrategicCoherenceWithCognition } from "./integrateStrategicCoherenceWithCognition";
export { integrateStrategicEquilibriumWithCognition } from "./integrateStrategicEquilibriumWithCognition";
export { integrateStrategicResonanceWithCognition } from "./integrateStrategicResonanceWithCognition";
export { integrateFinalStrategicIntegrationWithCognition } from "./integrateFinalStrategicIntegrationWithCognition";

export {
  selectCognitiveSingularitySignature,
  selectCrossDomainAwarenessTopologies,
  selectEnterpriseCognitiveSingularitySnapshots,
  selectIntelligenceConvergenceObservations,
  selectLatestEnterpriseCognitiveSingularitySnapshot,
  selectStrategicIntelligenceConvergenceSignals,
  selectUnifiedCognitionFields,
} from "./cognitiveSingularitySelectors";

export {
  selectAwarenessFragmentationIndicators,
  selectAwarenessSynchronizationObservations,
  selectAwarenessSynchronizationSignature,
  selectCrossDomainAwarenessSignals,
  selectEnterpriseAwarenessSynchronizationSnapshots,
  selectLatestEnterpriseAwarenessSynchronizationSnapshot,
  selectStrategicAwarenessAlignments,
  selectUnifiedOperationalCognitionFields,
} from "./awarenessSynchronizationSelectors";

export {
  selectEnterprisePurposeAlignmentSignals,
  selectLatestUnifiedStrategicIntentSnapshot,
  selectOrganizationalIntentTopologies,
  selectPurposeAlignmentObservations,
  selectStrategicDirectionFields,
  selectStrategicIntentSignature,
  selectUnifiedStrategicIntentSnapshots,
} from "./strategicIntentSelectors";

export {
  selectEnterpriseStrategicIdentitySnapshots,
  selectIdentityAlignmentObservations,
  selectLatestEnterpriseStrategicIdentitySnapshot,
  selectOrganizationalDriftIndicators,
  selectOrganizationalSelfConsistencySignals,
  selectStrategicIdentityFields,
  selectStrategicIdentitySignature,
} from "./strategicIdentitySelectors";

export {
  selectCrossSystemCommitmentFields,
  selectDirectionalCommitmentSignals,
  selectEnterpriseCommitmentObservations,
  selectEnterpriseStrategicWillSnapshots,
  selectLatestEnterpriseStrategicWillSnapshot,
  selectStrategicWillFragmentationIndicators,
  selectStrategicWillSignature,
} from "./strategicWillSelectors";

export {
  selectCrossRuntimeMisalignmentIndicators,
  selectEnterpriseCoherenceFields,
  selectLatestUnifiedStrategicCoherenceSnapshot,
  selectStrategicCoherenceObservations,
  selectStrategicCoherenceSignature,
  selectTotalSystemAlignmentSignals,
  selectUnifiedStrategicCoherenceSnapshots,
} from "./strategicCoherenceSelectors";

export {
  selectCognitiveBalanceSignals,
  selectEnterpriseStrategicEquilibriumSnapshots,
  selectEquilibriumStabilityFields,
  selectLatestEnterpriseStrategicEquilibriumSnapshot,
  selectStrategicEquilibriumObservations,
  selectStrategicEquilibriumSignature,
  selectStrategicImbalanceIndicators,
} from "./strategicEquilibriumSelectors";

export {
  selectCrossSystemResonanceSignals,
  selectEnterpriseStrategicResonanceSnapshots,
  selectHarmonicAlignmentFields,
  selectLatestEnterpriseStrategicResonanceSnapshot,
  selectResonanceAmplificationIndicators,
  selectStrategicResonanceObservations,
  selectStrategicResonanceSignature,
} from "./strategicResonanceSelectors";

export {
  selectEnterpriseCognitiveIntegrationFields,
  selectFinalStrategicIntegrationSnapshots,
  selectFinalStrategicIntegrationSignature,
  selectLatestFinalStrategicIntegrationSnapshot,
  selectRuntimeFragmentationIndicators,
  selectStrategicIntegrationObservations,
  selectTotalRuntimeConvergenceSignals,
} from "./finalStrategicIntegrationSelectors";

export type {
  CognitiveSingularityHealth,
  CognitiveSingularitySubsystemId,
  CognitiveSingularitySubsystemState,
  EnterpriseStrategicConvergenceSummary,
  FinalEnterpriseIntelligenceSignal,
  FinalStrategicIntelligenceSnapshot,
  IntelligenceLevel,
  UnifiedCognitiveSingularityRuntimeHistoryEntry,
  UnifiedCognitiveSingularityRuntimeInput,
  UnifiedCognitiveSingularityRuntimeResult,
  UnifiedCognitiveSingularityRuntimeState,
  UnifiedCognitiveSingularityRuntimeStatus,
} from "./unifiedCognitiveSingularityRuntimeTypes";

export {
  UNIFIED_COGNITIVE_SINGULARITY_RUNTIME_MAX_INTELLIGENCE_SIGNALS,
  UNIFIED_COGNITIVE_SINGULARITY_RUNTIME_MAX_SNAPSHOTS,
  UNIFIED_COGNITIVE_SINGULARITY_RUNTIME_MIN_ACTIVE_SUBSYSTEMS,
  UNIFIED_COGNITIVE_SINGULARITY_RUNTIME_MIN_EVAL_INTERVAL_MS,
  UNIFIED_COGNITIVE_SINGULARITY_RUNTIME_MIN_FINAL_INTEGRATION_OBSERVATIONS,
  beginUnifiedCognitiveSingularityRuntimeEvaluation,
  clampUnifiedCognitiveSingularityRuntimeConfidence,
  endUnifiedCognitiveSingularityRuntimeEvaluation,
  intelligenceLevelRank,
  resetUnifiedCognitiveSingularityRuntimeGuards,
  runtimeStatusRank,
  shouldEvaluateUnifiedCognitiveSingularityRuntime,
  validateFinalStrategicIntelligenceSnapshot,
} from "./unifiedCognitiveSingularityRuntimeGuards";

export {
  createUnifiedCognitiveSingularityRuntimeStore,
  getUnifiedCognitiveSingularityRuntimeStore,
  resetUnifiedCognitiveSingularityRuntimeStores,
} from "./unifiedCognitiveSingularityRuntimeStore";

export { evaluateUnifiedCognitiveSingularityRuntime } from "./unifiedCognitiveSingularityRuntimeEngine";
export { integrateUnifiedCognitiveSingularityRuntimeWithCognition } from "./integrateUnifiedCognitiveSingularityRuntimeWithCognition";

export {
  selectCognitiveSingularitySubsystemStates,
  selectFinalEnterpriseIntelligenceSignals,
  selectFinalStrategicIntelligenceSnapshots,
  selectLatestFinalStrategicIntelligenceSnapshot,
  selectUnifiedCognitiveSingularityRuntimeHistory,
  selectUnifiedCognitiveSingularityRuntimeSignature,
} from "./unifiedCognitiveSingularityRuntimeSelectors";
