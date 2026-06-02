/** D9:3:1–D9:3:10 — Enterprise temporal cognition through unified time intelligence runtime. */

export type {
  EnterpriseTemporalCognitionInput,
  EnterpriseTemporalCognitionResult,
  EnterpriseTemporalSnapshot,
  OperationalChronologyFrame,
  OrganizationalEvolutionEvent,
  OrganizationalTimelineEvent,
  StrategicTimelineSequence,
  TemporalCognitionSignal,
  TemporalCognitionStoreState,
  TemporalSequenceType,
  TimelineCategory,
  TimelineState,
} from "./temporalCognitionTypes";

export {
  TEMPORAL_COGNITION_MAX_EVENTS,
  TEMPORAL_COGNITION_MAX_SEQUENCES,
  TEMPORAL_COGNITION_MAX_SNAPSHOTS,
  TEMPORAL_COGNITION_MIN_EVAL_INTERVAL_MS,
  beginTemporalCognitionEvaluation,
  endTemporalCognitionEvaluation,
  resetTemporalCognitionGuards,
  shouldEvaluateTemporalCognition,
  shouldRetainTimelineSequence,
  validateTimelineSequence,
} from "./temporalCognitionGuards";

export {
  createTemporalCognitionStore,
  getTemporalCognitionStore,
  resetTemporalCognitionStores,
} from "./temporalCognitionStore";

export { evaluateEnterpriseTemporalCognition } from "./temporalCognitionEngine";
export { integrateTemporalCognitionWithCognition } from "./integrateTemporalCognitionWithCognition";

export {
  selectEnterpriseTemporalSnapshots,
  selectLatestEnterpriseTemporalSnapshot,
  selectOperationalChronologyFrames,
  selectOrganizationalEvolutionEvents,
  selectOrganizationalTimelineEvents,
  selectStrategicTimelineSequences,
  selectTemporalCognitionSignals,
  selectTemporalCognitionSignature,
} from "./temporalCognitionSelectors";

export type {
  CausalConfidenceLevel,
  CausalDependencySnapshot,
  CausalDependencyStoreState,
  DependencyCategory,
  DependencyPropagationSignal,
  DependencyStrength,
  OperationalCausalChain,
  OperationalCausalDependencyInput,
  OperationalCausalDependencyResult,
  OrganizationalImpactChain,
  PropagationType,
  StrategicCauseEffectSequence,
  TemporalDependencyLink,
} from "./causalDependencyTypes";

export {
  CAUSAL_DEPENDENCY_MAX_CHAINS,
  CAUSAL_DEPENDENCY_MIN_EVAL_INTERVAL_MS,
  beginCausalDependencyEvaluation,
  endCausalDependencyEvaluation,
  resetCausalDependencyGuards,
  shouldEvaluateCausalDependencies,
  shouldRetainCausalChain,
  validateCausalChain,
} from "./causalDependencyGuards";

export {
  createCausalDependencyStore,
  getCausalDependencyStore,
  resetCausalDependencyStores,
} from "./causalDependencyStore";

export { evaluateOperationalCausalDependencies } from "./causalDependencyEngine";
export { integrateCausalDependencyWithCognition } from "./integrateCausalDependencyWithCognition";

export {
  selectCausalDependencySignature,
  selectCausalDependencySnapshots,
  selectDependencyPropagationSignals,
  selectLatestCausalDependencySnapshot,
  selectOperationalCausalChains,
  selectOrganizationalImpactChains,
  selectStrategicCauseEffectSequences,
  selectTemporalDependencyLinks,
} from "./causalDependencySelectors";

export type {
  EnterpriseReplayFrame,
  HistoricalScenarioReconstruction,
  OperationalReplayCognitionInput,
  OperationalReplayCognitionResult,
  OperationalReplaySequence,
  OperationalReplayStoreState,
  OrganizationalReplaySnapshot,
  ReplayCategory,
  ReplayConfidenceLevel,
  ReplayProgressionState,
  StrategicReplayEvent,
} from "./operationalReplayTypes";

export {
  OPERATIONAL_REPLAY_MAX_SEQUENCES,
  OPERATIONAL_REPLAY_MIN_EVAL_INTERVAL_MS,
  beginOperationalReplayEvaluation,
  endOperationalReplayEvaluation,
  resetOperationalReplayGuards,
  shouldEvaluateOperationalReplay,
  shouldRetainReplaySequence,
  validateReplaySequence,
} from "./operationalReplayGuards";

export {
  createOperationalReplayStore,
  getOperationalReplayStore,
  resetOperationalReplayStores,
} from "./operationalReplayStore";

export { evaluateOperationalReplayCognition } from "./operationalReplayEngine";
export { integrateOperationalReplayWithCognition } from "./integrateOperationalReplayWithCognition";

export {
  selectEnterpriseReplayFrames,
  selectHistoricalScenarioReconstructions,
  selectLatestOrganizationalReplaySnapshot,
  selectOperationalReplaySequences,
  selectOperationalReplaySignature,
  selectOrganizationalReplaySnapshots,
  selectStrategicReplayEvents,
} from "./operationalReplaySelectors";

export type {
  EnterpriseTrajectorySignal,
  OperationalDriftForecast,
  OrganizationalFutureDirection,
  StrategicEvolutionTrend,
  TemporalDriftProjection,
  TemporalDriftProjectionInput,
  TemporalDriftProjectionResult,
  TemporalDriftProjectionStoreState,
  TemporalDriftSnapshot,
  TrajectoryConfidenceLevel,
  TrajectoryDirection,
  TrendStrength,
  ProjectionCategory,
} from "./temporalDriftProjectionTypes";

export {
  TEMPORAL_DRIFT_MAX_PROJECTIONS,
  TEMPORAL_DRIFT_MIN_EVAL_INTERVAL_MS,
  beginTemporalDriftEvaluation,
  endTemporalDriftEvaluation,
  resetTemporalDriftProjectionGuards,
  shouldEvaluateTemporalDrift,
  shouldRetainDriftProjection,
  validateDriftProjection,
} from "./temporalDriftProjectionGuards";

export {
  createTemporalDriftProjectionStore,
  getTemporalDriftProjectionStore,
  resetTemporalDriftProjectionStores,
} from "./temporalDriftProjectionStore";

export { evaluateTemporalDriftProjection } from "./temporalDriftProjectionEngine";
export { integrateTemporalDriftProjectionWithCognition } from "./integrateTemporalDriftProjectionWithCognition";

export {
  selectEnterpriseTrajectorySignals,
  selectLatestTemporalDriftSnapshot,
  selectOperationalDriftForecasts,
  selectOrganizationalFutureDirections,
  selectStrategicEvolutionTrends,
  selectTemporalDriftProjectionSignature,
  selectTemporalDriftProjections,
  selectTemporalDriftSnapshots,
} from "./temporalDriftProjectionSelectors";

export type {
  AlternativeEvolutionTrajectory,
  BranchCategory,
  BranchState,
  DivergenceStrength,
  EnterpriseDivergencePath,
  MultiTimelineDivergenceInput,
  MultiTimelineDivergenceResult,
  MultiTimelineSnapshot,
  MultiTimelineStoreState,
  OrganizationalTimelineBranch,
  StrategicBranchingSequence,
  TemporalDivergenceSignal,
} from "./multiTimelineTypes";

export {
  MULTI_TIMELINE_MAX_DIVERGENCE,
  MULTI_TIMELINE_MIN_EVAL_INTERVAL_MS,
  beginMultiTimelineEvaluation,
  endMultiTimelineEvaluation,
  resetMultiTimelineGuards,
  shouldEvaluateMultiTimelineDivergence,
  shouldRetainDivergencePath,
  validateDivergencePath,
} from "./multiTimelineGuards";

export {
  createMultiTimelineStore,
  getMultiTimelineStore,
  resetMultiTimelineStores,
} from "./multiTimelineStore";

export { evaluateMultiTimelineDivergence } from "./multiTimelineEngine";
export { integrateMultiTimelineWithCognition } from "./integrateMultiTimelineWithCognition";

export {
  selectAlternativeEvolutionTrajectories,
  selectEnterpriseDivergencePaths,
  selectLatestMultiTimelineSnapshot,
  selectMultiTimelineSignature,
  selectMultiTimelineSnapshots,
  selectOrganizationalTimelineBranches,
  selectStrategicBranchingSequences,
  selectTemporalDivergenceSignals,
} from "./multiTimelineSelectors";

export type {
  AlignmentState,
  ConvergenceCategory,
  ConvergenceConfidenceLevel,
  ConvergenceStrength,
  EnterpriseConvergenceSignal,
  OperationalSynchronizationSequence,
  OrganizationalAlignmentTrajectory,
  StabilityConvergencePattern,
  StrategicAlignmentSnapshot,
  TemporalConvergenceInput,
  TemporalConvergenceResult,
  TemporalConvergenceStoreState,
} from "./temporalConvergenceTypes";

export {
  TEMPORAL_CONVERGENCE_MAX_PATTERNS,
  TEMPORAL_CONVERGENCE_MIN_EVAL_INTERVAL_MS,
  beginTemporalConvergenceEvaluation,
  endTemporalConvergenceEvaluation,
  resetTemporalConvergenceGuards,
  shouldEvaluateTemporalConvergence,
  shouldRetainConvergencePattern,
  validateConvergencePattern,
} from "./temporalConvergenceGuards";

export {
  createTemporalConvergenceStore,
  getTemporalConvergenceStore,
  resetTemporalConvergenceStores,
} from "./temporalConvergenceStore";

export { evaluateTemporalConvergenceIntelligence } from "./temporalConvergenceEngine";
export { integrateTemporalConvergenceWithCognition } from "./integrateTemporalConvergenceWithCognition";

export {
  selectEnterpriseConvergenceSignals,
  selectLatestStrategicAlignmentSnapshot,
  selectOperationalSynchronizationSequences,
  selectOrganizationalAlignmentTrajectories,
  selectStabilityConvergencePatterns,
  selectStrategicAlignmentSnapshots,
  selectTemporalConvergenceSignature,
} from "./temporalConvergenceSelectors";

export type {
  CompressionLevel,
  EvolutionDistillationSignal,
  ExecutiveTemporalDigest,
  OrganizationalEvolutionSummary,
  StrategicTemporalCompressionInput,
  StrategicTemporalCompressionResult,
  StrategicTimelineCompression,
  SummaryCategory,
  TemporalAbstractionLayer,
  TemporalCompressionSnapshot,
  TemporalCompressionStoreState,
  TimelineAbstractionState,
} from "./temporalCompressionTypes";

export {
  TEMPORAL_COMPRESSION_MAX_DIGESTS,
  TEMPORAL_COMPRESSION_MIN_EVAL_INTERVAL_MS,
  beginTemporalCompressionEvaluation,
  endTemporalCompressionEvaluation,
  resetTemporalCompressionGuards,
  shouldEvaluateTemporalCompression,
  shouldRetainExecutiveDigest,
  validateExecutiveDigest,
} from "./temporalCompressionGuards";

export {
  createTemporalCompressionStore,
  getTemporalCompressionStore,
  resetTemporalCompressionStores,
} from "./temporalCompressionStore";

export { evaluateStrategicTemporalCompression } from "./temporalCompressionEngine";
export { integrateTemporalCompressionWithCognition } from "./integrateTemporalCompressionWithCognition";

export {
  selectEvolutionDistillationSignals,
  selectExecutiveTemporalDigests,
  selectLatestTemporalCompressionSnapshot,
  selectOrganizationalEvolutionSummaries,
  selectStrategicTimelineCompressions,
  selectTemporalAbstractionLayers,
  selectTemporalCompressionSignature,
  selectTemporalCompressionSnapshots,
} from "./temporalCompressionSelectors";

export type {
  CrossPeriodAwarenessSignal,
  InstitutionalTemporalSyncSnapshot,
  OrganizationalPeriodBridge,
  PeriodAwarenessState,
  PeriodSynchronizationSequence,
  SyncCategory,
  SyncConfidenceLevel,
  SyncStrength,
  TemporalMemorySyncInput,
  TemporalMemorySyncRecord,
  TemporalMemorySyncResult,
  TemporalMemorySyncStoreState,
  TemporalPeriodAlignment,
} from "./temporalMemorySyncTypes";

export {
  TEMPORAL_MEMORY_SYNC_MAX_RECORDS,
  TEMPORAL_MEMORY_SYNC_MIN_EVAL_INTERVAL_MS,
  beginTemporalMemorySyncEvaluation,
  endTemporalMemorySyncEvaluation,
  resetTemporalMemorySyncGuards,
  shouldEvaluateTemporalMemorySync,
  shouldRetainSyncRecord,
  validateSyncRecord,
} from "./temporalMemorySyncGuards";

export {
  createTemporalMemorySyncStore,
  getTemporalMemorySyncStore,
  resetTemporalMemorySyncStores,
} from "./temporalMemorySyncStore";

export { evaluateInstitutionalTemporalMemorySync } from "./temporalMemorySyncEngine";
export { integrateTemporalMemorySyncWithCognition } from "./integrateTemporalMemorySyncWithCognition";

export {
  selectCrossPeriodAwarenessSignals,
  selectInstitutionalTemporalSyncSnapshots,
  selectLatestInstitutionalTemporalSyncSnapshot,
  selectOrganizationalPeriodBridges,
  selectPeriodSynchronizationSequences,
  selectTemporalMemorySyncRecords,
  selectTemporalMemorySyncSignature,
  selectTemporalPeriodAlignments,
} from "./temporalMemorySyncSelectors";

export type {
  EnterpriseLongHorizonPattern,
  FieldCategory,
  FieldConfidenceLevel,
  FieldStrength,
  HorizonState,
  InstitutionalContinuityField,
  LongHorizonAwarenessSnapshot,
  LongHorizonContinuitySignal,
  OperationalEraEvolution,
  OrganizationalTimeField,
  StrategicTemporalField,
  StrategicTimeFieldInput,
  StrategicTimeFieldResult,
  TemporalFieldStoreState,
} from "./temporalFieldTypes";

export {
  TEMPORAL_FIELD_MAX_FIELDS,
  TEMPORAL_FIELD_MIN_EVAL_INTERVAL_MS,
  beginTemporalFieldEvaluation,
  endTemporalFieldEvaluation,
  horizonRank,
  resetTemporalFieldGuards,
  shouldEvaluateTemporalField,
  shouldRetainTimeField,
  validateTimeField,
} from "./temporalFieldGuards";

export {
  createTemporalFieldStore,
  getTemporalFieldStore,
  resetTemporalFieldStores,
} from "./temporalFieldStore";

export { evaluateStrategicTimeFieldIntelligence } from "./temporalFieldEngine";
export { integrateTemporalFieldWithCognition } from "./integrateTemporalFieldWithCognition";

export {
  selectEnterpriseLongHorizonPatterns,
  selectInstitutionalContinuityFields,
  selectLatestLongHorizonAwarenessSnapshot,
  selectLongHorizonAwarenessSnapshots,
  selectLongHorizonContinuitySignals,
  selectOperationalEraEvolutions,
  selectOrganizationalTimeFields,
  selectStrategicTemporalFields,
  selectTemporalFieldSignature,
} from "./temporalFieldSelectors";

export type {
  EnterpriseTemporalCognitionPipelineResult,
  EnterpriseTimeIntelligenceSnapshot,
  OrganizationalEvolutionState,
  TemporalCognitionSubsystemState,
  TemporalHealthLevel,
  TemporalLayerResults,
  TemporalRuntimeHealth,
  TemporalRuntimeStatus,
  TemporalSubsystemId,
  UnifiedTemporalAwarenessSummary,
  UnifiedTemporalCognitionInput,
  UnifiedTemporalCognitionResult,
  UnifiedTemporalCognitionState,
  UnifiedTemporalCognitionStoreState,
} from "./unifiedTemporalCognitionTypes";

export {
  UNIFIED_TEMPORAL_COGNITION_MAX_SNAPSHOTS,
  UNIFIED_TEMPORAL_COGNITION_MIN_EVAL_INTERVAL_MS,
  beginUnifiedTemporalCognitionEvaluation,
  endUnifiedTemporalCognitionEvaluation,
  resetUnifiedTemporalCognitionGuards,
  shouldEvaluateUnifiedTemporalCognition,
  shouldRetainUnifiedTemporalSnapshot,
  validateEnterpriseTimeSnapshot,
} from "./unifiedTemporalCognitionGuards";

export {
  createUnifiedTemporalCognitionStore,
  getUnifiedTemporalCognitionStore,
  resetUnifiedTemporalCognitionStores,
} from "./unifiedTemporalCognitionStore";

export { evaluateUnifiedTemporalCognition } from "./unifiedTemporalCognitionEngine";
export {
  integrateEnterpriseTemporalCognitionWithCognition,
} from "./integrateEnterpriseTemporalCognitionWithCognition";

export {
  selectEnterpriseTimeIntelligenceSnapshots,
  selectLatestEnterpriseTimeIntelligenceSnapshot,
  selectOrganizationalEvolutionSummaries as selectUnifiedOrganizationalEvolutionSummaries,
  selectUnifiedTemporalCognitionSignature,
  selectUnifiedTemporalCognitionState,
  selectUnifiedTemporalRuntimeStatus,
} from "./unifiedTemporalCognitionSelectors";
