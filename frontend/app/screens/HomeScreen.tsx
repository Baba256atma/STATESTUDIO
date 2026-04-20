"use client";

import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { createPortal } from "react-dom";
// Removed unused R3F/Three imports
import { chatToBackend } from "../lib/api/chatApi";
import {
  DEFAULT_CHAT_REQUEST_TIMEOUT_MS,
  getChatLifecycleErrorMessage,
  isAbortLikeError,
  type ChatRequestLifecycleStatus,
} from "../lib/chat/chatRequestLifecycle";
import type { KPIState } from "../lib/api";
import { analyzeFull } from "../lib/api/analyzeApi";
import { postStrategicAnalysisText } from "../lib/api/client";
// Removed unused SceneRenderer import
import { SceneCanvas } from "../components/SceneCanvas";
import type { HUDTabKey } from "../components/HUDShell";
import { diffSnapshots } from "../lib/decision/decisionDiff";
import type { DecisionSnapshot } from "../lib/decision/decisionTypes";
import { useSetViewMode } from "../components/SceneContext";
import { clamp, parseSizeCommand, parseSelectedSizeCommand } from "../lib/sizeCommands";
import {
  useOverrides,
  useSetOverride,
  useClearAllOverrides,
  usePruneOverridesTo,
  useSelectedId,
} from "../components/SceneContext";
import { getRecentEvents } from "../lib/api/events";
import { delay } from "../lib/delay";
import type { SceneJson, SceneLoop, SceneObject, LoopType } from "../lib/sceneTypes";
import {
  appendSnapshot,
  clearSnapshots,
  loadSnapshots,
} from "../lib/decision/decisionStore";
import { normalizeLoops } from "../lib/loops/loopContract";
import { resolveLoopPlaceholders } from "../lib/loops/loopResolver";
import { makeLoopFromTemplate } from "../lib/loops/loopTemplates";
import { setCompanyId } from "../lib/apiBase";
import { useCompanyConfig } from "../hooks/useCompanyConfig";
import { useActiveLoopId, useFocusActions, useFocusMode, usePinnedId } from "../lib/focus/focusStore";
import { applyDecisionActions } from "../lib/decision/applyDecisionActions";
import {
  createEmptyProjectState,
  DEFAULT_PROJECT_ID,
  DEFAULT_WORKSPACE_ID,
  inferProjectMetaFromScene,
  type WorkspaceProjectState,
} from "../lib/workspace/workspaceModel";
import {
  loadWorkspaceSnapshot,
  saveProjectSnapshot,
  saveWorkspaceSnapshot,
} from "../lib/workspace/workspacePersistence";
import { applyScannerResultToWorkspace, type ScannerResult } from "../lib/workspace/scannerContract";
import { scanSystemToScannerResult, type ScannerInput } from "../lib/scanner/systemFragilityScanner";
import {
  applyExternalIntegrationToWorkspace,
  type ExternalIntegrationResult,
} from "../lib/integration/externalIntegrationContract";
import { composeResolvedObjectDetails, type ResolvedObjectDetails } from "../lib/scene/composeResolvedObjectDetails";
import { resolveSceneObjectById } from "../lib/scene/resolveSceneObjectById";
import type { UICommand } from "../lib/ui/uiCommands";
import { RestorePreviewModal } from "../components/RestorePreviewModal";
import { useNexoraUiTheme } from "../lib/ui/nexoraUiTheme";
import { StrategicAlertOverlay } from "../components/StrategicAlertOverlay";
import { nx, sceneOverlayCardStyle, sceneVignetteLayerStyle, sceneWorkingBadgeStyle } from "../components/ui/nexoraTheme";
import { useEmotionalFxEngine } from "../lib/fx/useEmotionalFxEngine";
import { useStrategicRadar } from "../lib/strategy/useStrategicRadar";
import { computeRiskLevel } from "../lib/risk/riskEscalationEngine";
import { appendRiskEvent } from "../lib/risk/riskEventStore";
import { routeChatInput } from "../lib/decision/decisionRouter";
import {
  buildSimulationResult,
  createSimulationInputFromPrompt,
} from "../lib/decision/simulationContract";
import {
  buildReplaySequence,
  compareScenarioSnapshots,
  createScenarioSnapshot,
} from "../lib/decision/scenarioComparisonReplayContract";
import { buildExecutiveInsightFromSimulation } from "../lib/decision/executiveExplainabilityContract";
import { buildCanonicalRecommendation } from "../lib/decision/recommendation/buildCanonicalRecommendation";
import type { CanonicalRecommendation } from "../lib/decision/recommendation/recommendationTypes";
import { buildDecisionMemoryEntry } from "../lib/decision/memory/buildDecisionMemoryEntry";
import type { DecisionMemoryEntry } from "../lib/decision/memory/decisionMemoryTypes";
import {
  appendDecisionMemoryEntry,
  loadDecisionMemoryEntries,
} from "../lib/decision/memory/decisionMemoryStore";
import { buildObservedOutcomeAssessment } from "../lib/decision/outcome/buildObservedOutcomeAssessment";
import { buildDecisionOutcomeFeedback } from "../lib/decision/outcome/buildDecisionOutcomeFeedback";
import { buildDecisionFeedbackSignal } from "../lib/decision/outcome/buildDecisionFeedbackSignal";
import { applyDecisionFeedbackToMemory } from "../lib/decision/outcome/applyDecisionFeedbackToMemory";
import {
  buildStrategyAwareExecutiveNotes,
  buildStrategyKpiContext,
} from "../lib/strategy/strategyKpiContract";
import { buildDecisionCockpitState } from "../lib/cockpit/decisionCockpitContract";
import { buildActiveModeContext, getProductMode, type ActiveModeContext } from "../lib/modes/productModesContract";
import { buildReasoningOutput, createReasoningInput } from "../lib/reasoning/aiReasoningContract";
import { orchestrateMultiAgentDecision } from "../lib/reasoning/multiAgentDecisionEngineContract";
import {
  appendAuditEvents,
  appendTrustProvenance,
  buildProjectGovernanceContext,
  createAuditEvent,
  createTrustProvenance,
} from "../lib/governance/governanceTrustAuditContract";
import { appendDecisionActionTrace } from "../lib/governance/appendDecisionActionTrace";
import {
  buildEnvironmentConfig,
  isFeatureEnabled,
  resolveNexoraEnvironment,
  type EnvironmentConfig,
} from "../lib/ops/environmentDeploymentContract";
import { buildPlatformAssemblyState } from "../lib/platform/platformAssemblyContract";
import { runAutonomousScenarioExploration } from "../lib/exploration/autonomousScenarioExplorer";
import { createInitialMemoryState, deriveVisualPatch, updateMemory } from "../lib/memory/decisionMemory";
import type { MemoryStateV1 } from "../lib/memory/memoryTypes";
import type { RiskAlert, StrategicState, EmotionalFx, ScenePatch, SceneObjectPatch } from "../lib/contracts";
import {
  Msg,
  ScenePrefs,
  BackupV1,
  HISTORY_KEY,
  SESSION_KEY,
  PREFS_KEY,
  AUTO_BACKUP_KEY,
  MEMORY_KEY,
  defaultPrefs,
  makeMsg,
  normalizeMessages,
  appendMessages,
  normalizeSceneJson,
  saveProject,
  loadProject,
  loadHistory,
  pushHistory,
  saveBackup,
  loadBackup,
  stableStringify,
} from "./homeScreenUtils";
import {
  canonDecisionMissingSceneBlob,
  evaluateBackupRestoreScene,
  evaluateDomainDemoScene,
  evaluateHistoryUndoScene,
  evaluateProductFlowForcedScene,
  evaluateSnapshotRestoreScene,
  evaluateTimelineForceScene,
  evaluateUnifiedReactionSceneReplacement,
  evaluateWorkspaceHydrateScene,
  isSceneCanonReplaceDecision,
  sceneJsonFromCanonDecision,
} from "./homeScreenSceneApply";
import { parseDecisionSnapshotKey, pickDecisionSnapshotFromList } from "./homeScreenSnapshots";
import {
  asRecord,
  buildUnifiedReactionFromChatResponse,
  buildUnifiedReactionFromFragilityRun,
  buildSceneObjectIdSet,
  extractSceneObjectIds,
  getHighlightedObjectIdsFromSelection,
  getSceneScopedObjectSelection,
  hasMeaningfulObjectPanelContext,
  hasMeaningfulSceneMutation,
  hasMeaningfulSelectionForVisibleState,
  hasRenderableResponseForVisibleState,
  hasRenderableSceneForVisibleState,
  normalizeKpiStateFromUnknown,
  readCanonicalRecommendation,
  readPanelFamilyContractDiagnostics,
  readPanelFamilySliceDiagnostics,
  readSceneJsonActiveLoop,
  readSceneJsonMetaString,
  sceneJsonFromUnknown,
  shouldAcceptIncomingSceneReplacement,
  shouldAcceptMeaningfulArrayReplacement,
  shouldAcceptMeaningfulRecordReplacement,
} from "./homeScreenResponseReaders";
import {
  RETAIL_DEMO_ID,
  applyRetailDemoChatPayloadEnhancement,
  buildUnifiedReactionFromRetailTriggerConfig,
  detectRetailTriggerConfig,
  isRetailDemoScene,
  isRetailScenePayload,
  mapDemoVisualModeToReactionMode,
  resolveRetailDemoPulseObjectIdsForPrompt,
} from "./homeScreenRetailDemo";
import {
  logPanelClose,
  logPanelContinuityPreserved,
  logPanelDecision,
  logPanelGuidedPromptWarn,
  logPanelOpen,
  logPanelRejected,
  panelFamilyDataFromExecutionPayloads,
  resolvePreferredPanelFamilyFromIntent,
} from "./homeScreenPanelHelpers";
import {
  mergeNextObjectSelectionFromUnifiedReaction,
  pickAcceptedChatSceneReplacement,
  reactionModeHintFromIntent,
} from "./homeScreenChatApplyPrep";
import {
  getPanelActionFallbackMessage,
  isAutomaticRightPanelSource,
  isExecutiveActionTarget,
  toPanelOpenSource,
  type ExecutiveActionIntent,
  type ExecutiveActionTarget,
} from "./homeScreenShellGuards";
import {
  buildBackupRestorePreviewContents,
  buildPersistedProjectSnapshot,
  buildScreenBackupV1,
  buildWorkspaceProjectStateFromLoadedProject,
  buildWorkspaceStateForProjectImport,
  composeImportWarningAssistantText,
  messageImportUnknownError,
  pickWorkspaceProjectForHydrate,
  prepareProjectImportFromFileText,
  prepareUndoHistoryPop,
  prepareWorkspaceProjectExportJson,
  readSessionIdForPersistence,
  resolveHudTabAfterBackupRestore,
  withPersistedProjectSavedAt,
} from "./homeScreenPersistenceApply";
import {
  prefetchIngestionConnectorCatalogDev,
  submitManualTextIngestion,
  type HomeScreenLastIngestion,
} from "./homeScreenIngestionDev";
import {
  dispatchMultiSourceAssessmentComplete,
  normalizeDevMultiSourcePayload,
  submitMultiSourceIngestionDev,
  traceProductionMultiSourceEntry,
  traceScheduledAssessmentTriggered,
  type DevMultiSourceIngestionEventDetail,
  type UnifiedMultiSourceRunOutcome,
} from "./homeScreenMultiSourceIngestionDev";
import type {
  MultiSourceIngestionRequest,
  MultiSourceIngestionResponse,
} from "../lib/api/ingestionApi";
import {
  isScheduledAssessmentDue,
  loadScheduledAssessments,
  toMultiSourceRequest,
  updateScheduledAssessment,
  type ScheduledAssessmentDefinition,
} from "../lib/scheduled/scheduledAssessmentStorage";
import {
  buildIngestionFragilityBridgeSignature,
  buildMultiSourceBridgeSignature,
  runIngestionThroughFragilitySceneBridge,
  runMultiSourceThroughFragilitySceneBridge,
} from "./homeScreenIngestionSceneBridge";
import {
  alignFragilityHighlightIdsForClarity,
  buildB5ClaritySignature,
  buildClarityCaptionsByObjectId,
  buildPipelineInsightLine,
} from "./nexoraClarityPolish";
import {
  adjustDecisionToneForTrust,
  buildNexoraDecisionLayerSignature,
  deriveNexoraDecisionLayer,
} from "./nexoraDecisionLayer";
import {
  buildPipelineStatusSignature,
  countMappedObjectsFromFragilityScan,
  createInitialPipelineStatusUi,
  normalizeFragilityLevelForUi,
  shouldSkipPipelineStatusCommit,
  type NexoraPipelineStatusUi,
} from "./nexoraPipelineStatus";
import type { NexoraAuditRecord } from "../lib/audit/nexoraAuditContract.ts";
import { serializeAudit } from "../lib/audit/nexoraAuditContract.ts";
import type { NexoraExportBundle } from "../lib/audit/nexoraExportContract.ts";
import {
  buildNexoraExportBundle,
  exportBundleStableSignature,
  serializeExportBundle,
} from "../lib/audit/nexoraExportContract.ts";
import { parseNexoraImportBundle } from "../lib/audit/nexoraImportContract.ts";
import {
  NEXORA_REPLAY_APPLY_EVENT,
  buildReplayApplySignature,
  dispatchNexoraReplayApply,
  filterReplaySnapshotIdsForScene,
  type NexoraReplayApplyEventDetail,
} from "../lib/audit/nexoraReplayApply.ts";
import { appendNexoraRunHistory, clearNexoraRunHistory, loadNexoraRunHistory } from "../lib/audit/nexoraRunHistory.ts";
import { buildNexoraAuditRecord, buildNexoraAuditSignature } from "./nexoraAuditBuilder.ts";
import type { NexoraReplaySnapshot } from "./nexoraReplaySnapshot.ts";
import { buildNexoraReplaySnapshot } from "./nexoraReplaySnapshot.ts";
import {
  buildNexoraTrustValidationSignature,
  evaluateNexoraTrustValidation,
  type NexoraTrustValidationInput,
} from "./nexoraTrustValidation";
import { driversEnrichmentSignature, enrichFragilityDriversForDomain } from "../lib/domain/domainDriverEnrichment.ts";
import { runDomainPackQAAndLogDev } from "../lib/domain/nexoraDomainPackQA.ts";
import {
  getB13TrustEvidenceBiasMerged,
  runDomainPackRolloutAndLogDev,
  toSafeLocaleDomainIdForRollout,
} from "../lib/domain/nexoraDomainPackRollout.ts";
import { buildCurrentDomainRuntimeState, getEffectiveDomainLabel } from "../lib/domain/nexoraDomainRolloutView.ts";
import { emitDomainUsageLoggedDevOnce, logDomainUsage } from "../lib/domain/nexoraDomainUsage.ts";
import { resolveNexoraLocaleDomainId } from "../lib/domain/nexoraDomainPackRegistry.ts";
import {
  buildHomescreenExecutionApplyTracePayload,
  buildNexoraUiReadableStateForApply,
  createNexoraUiAdaptersForExecutionApply,
} from "./homeScreenExecutionApply";
import { applyFragilityScenePayload } from "../lib/scene/applyFragilityScenePayload";
import {
  resolveDomainExperience,
  type NexoraResolvedDomainExperience,
} from "../lib/domain/domainExperienceRegistry";
import { buildDemoStrategicAnalysisPrompt, resolveDomainDemo } from "../lib/demo/domainDemoRegistry";
import { executeNexoraAction } from "../lib/execution/actionExecutionLayer";
import type { FragilityScanResponse } from "../types/fragilityScanner";
import { isLaunchDomain } from "../lib/product/mvpShippingPlan";
import { resolveNexoraIntentRoute } from "../lib/router/intentRouter";
import { resolveUnifiedReactionPolicy } from "../lib/reactions/reactionPolicy";
import { applyNexoraUiState } from "../lib/uiState/uiStateApplicationLayer";
import { resolveRetailHighlightedObjectIds } from "../lib/domains/retail/resolveRetailPrimaryObject";
import { traceHighlightFlow } from "../lib/debug/highlightDebugTrace";
import {
  hasForcedSceneUpdate,
  normalizeUnifiedSceneReaction,
  type UnifiedSceneReaction,
} from "../lib/scene/unifiedReaction";
import {
  buildPanelFocusReaction,
  normalizeReactionForScene,
  tuneUnifiedReactionForFragilityLevel,
} from "../lib/scene/reactionNormalizer";
import { useWarRoomState } from "../lib/warroom/useWarRoomState";
import type { WarRoomOverlayDetail, WarRoomOverlaySummary } from "../lib/warroom/warRoomTypes";
import { RetailDemoOverlay } from "../components/demo/RetailDemoOverlay";
import { normalizeStrategicCouncilResult } from "../lib/council/strategicCouncilClient";
import { useDecisionImpact } from "../lib/impact/useDecisionImpact";
import { useDemoFlowController } from "../lib/demo/DemoFlowController";
import {
  isLatestDemoFlowSequence,
  nextDemoFlowSequence,
  shouldApplyExecutionResultImmediately,
  traceDemoFlowEvent,
} from "../lib/demo/demoFlowOrchestrator";
import { RETAIL_FRAGILITY_DEMO_SCRIPT, type DemoScriptStep, type DemoVisualMode } from "../lib/demo/demoScript";
import { useCustomerDemoMode } from "../lib/demo/useCustomerDemoMode";
import { useNarrativeSceneBinding, useNarrativeSceneBindingDebug } from "../lib/demo/useNarrativeSceneBinding";
import type { FocusOwnershipState } from "../lib/focus/focusOwnershipTypes";
import { resolveFocusOwnership } from "../lib/focus/resolveFocusOwnership";
import { runDecisionExecution } from "../lib/executive/decisionExecutionClient";
import type { DecisionExecutionPayload, DecisionExecutionResult } from "../lib/executive/decisionExecutionTypes";
import { DecisionComparePanel } from "../components/executive/DecisionComparePanel";
import type { NexoraB18CompareResolved } from "../lib/scenario/nexoraScenarioBuilder.ts";
import {
  appendScenarioMemory,
  emitScenarioMemoryAppendedDev,
  installNexoraExecutionOutcomeBridge,
  loadScenarioMemory,
  resolveNexoraB18WithMemory,
} from "../lib/scenario/nexoraScenarioMemory.ts";
import {
  evaluateExecutionOutcome,
  NEXORA_EXECUTION_OUTCOME_RECORDED,
  normalizeOutcomeFragilityInput,
  type NexoraExecutionOutcome,
} from "../lib/execution/nexoraExecutionOutcome.ts";
import {
  emitExecutionOutcomeRecordedDev,
  loadExecutionOutcomeForRun,
  loadExecutionOutcomes,
  saveExecutionOutcome,
} from "../lib/execution/nexoraExecutionStore.ts";
import { NEXORA_WORKFLOW_DEBUG_UPDATED } from "../lib/session/nexoraWorkflowClosure.ts";
import { buildAdaptiveBiasDevLogKey, emitAdaptiveBiasReadyDev } from "../lib/quality/nexoraAdaptiveBias.ts";
import {
  BIAS_GOVERNANCE_CONFIG_CHANGED_EVENT,
  buildBiasGovernanceLogKey,
  buildNexoraBiasLayerContext,
  emitBiasGovernanceReadyDev,
  saveNexoraBiasGovernanceFull,
  type NexoraBiasLayerContext,
} from "../lib/quality/nexoraBiasGovernance.ts";
import { DEFAULT_NEXORA_BIAS_GOVERNANCE } from "../lib/quality/nexoraBiasGovernanceContract.ts";
import { useNexoraOperatorMode } from "../lib/product/nexoraOperatorModeContext";
import { getNexoraProductMode } from "../lib/product/nexoraProductMode.ts";
import {
  buildDecisionQualityInputSignature,
  emitDecisionQualityReadyDev,
  evaluateDecisionQuality,
  type NexoraDecisionQualityReport,
} from "../lib/quality/nexoraDecisionQuality.ts";
import { DecisionTimelinePanel } from "../components/executive/DecisionTimelinePanel";
import { buildPreviewDecisionExecutionResult } from "../lib/execution/buildPreviewDecisionExecutionResult";
import type { DecisionAutomationResult } from "../lib/execution/decisionAutomationTypes";
import type { DecisionExecutionIntent } from "../lib/execution/decisionExecutionIntent";
import { safeExecuteDecision } from "../lib/execution/decisionExecutionSafety";
import { normalizeBackendSimulation } from "../lib/simulation/normalizeBackendSimulation";
import {
  enforceSafeDefaults,
  sanitizeDecisionPayload,
  validateDecisionPayload,
  type ValidationResult,
} from "../lib/ops/aiPipelineGuard";
import { recoverFromFailure } from "../lib/ops/aiFailureRecovery";
import { logDecisionTrace, type DecisionTraceEvent } from "../lib/ops/aiTraceLogger";
import { guardHeavyComputation } from "../lib/ops/performanceGuard";
import { RightPanelHost } from "../components/right-panel/RightPanelHost";
import type { RightPanelState, RightPanelView } from "../lib/ui/right-panel/rightPanelTypes";
import type { PanelSharedData } from "../lib/panels/panelDataResolverTypes";
import type { NexoraB8PanelContext } from "../lib/panels/panelDataContract";
import { buildPanelResolvedData } from "../lib/panels/buildPanelResolvedData.ts";
import { nexoraB8PanelContextFromHudRef } from "../lib/panels/nexoraPanelMeaning";
import { normalizeCanonicalAdvicePanelData } from "../lib/panels/adviceAdapter";
import { buildCanonicalPanelData } from "../lib/panels/panelDataAdapter";
import {
  normalizeCanonicalTimelinePanelData,
  normalizeCanonicalWarRoomPanelData,
} from "../lib/panels/panelSliceNormalizer";
import {
  validatePanelSharedDataWithDiagnostics,
  type PanelSharedDataValidationResult,
} from "../lib/panels/panelDataContract";
import {
  createClosedRightPanelState,
  mapLegacyTabToRightPanelView,
  resolveRightPanelInspectorHostId,
  resolveRightPanelLegacyTabForView,
} from "../lib/ui/right-panel/rightPanelRouter";
import { resolvePanelDecision } from "../lib/ui/right-panel/panelController";
import type {
  PanelOpenSource,
  PanelRequestIntent,
} from "../lib/ui/right-panel/panelControllerTypes";
import { emitDebugEvent } from "../lib/debug/debugEmit";
import { registerPanelSelfDebugLink } from "../lib/debug/debugCorrelationBridge";
import { getRecentDebugEvents } from "../lib/debug/debugEventStore";
import { emitGuardRailAlerts, runGuardChecks } from "../lib/debug/debugGuardRails";
import { useInvestorDemo, INVESTOR_DEMO_MAX_STEP } from "../components/demo/InvestorDemoContext";
import { registerNexoraActionDispatch } from "../lib/actions/actionDispatchRegistry";
import type { ActionRouterContext, CanonicalNexoraAction } from "../lib/actions/actionTypes";
import { resolveActionRoute } from "../lib/actions/actionRouter";
import {
  normalizeCompareOptions,
  normalizeOpenCenterTimeline,
  normalizeOpenPanelCta,
  normalizeOpenRightPanelEventDetail,
  normalizeRunSimulation,
  normalizeFocusObject,
} from "../lib/actions/actionNormalizer";
import {
  traceActionRouterContinuity,
  traceActionRouterExecuted,
  traceActionRouterNormalized,
  traceActionRouterReceived,
  traceActionRouterRejected,
  traceActionRouterResolved,
} from "../lib/actions/actionTrace";
import { InvestorDemoOverlay } from "../components/demo/InvestorDemoOverlay";
import { hasRenderableScenario, resolveInvestorDemoFocusObjectId } from "../lib/demo/investorDemoHelpers";
import {
  buildScenarioExplanationFromDecisionAnalysis,
  pickDecisionAnalysisFromResponse,
} from "../lib/panels/buildScenarioExplanationFromDecisionAnalysis";
import { NexoraError } from "../lib/system/nexoraErrors";
import {
  buildRunbookSurfaceHints,
  logRunbookStepChangedIfDev,
  resolveRunbookStep,
  type NexoraRunbookStepId,
} from "../lib/pilot/nexoraRunbook";
import { explainPipelineHudFailure } from "../lib/pilot/nexoraFailureGuide";
import { NEXORA_PILOT_SCENARIOS } from "../lib/pilot/nexoraPilotScenarios";
import { useNexoraRunbookGuidanceOptional } from "../lib/pilot/nexoraRunbookGuidanceContext";
import { NexoraRunbookPanel } from "../components/pilot/NexoraRunbookPanel";
import { logNexoraMetric } from "../lib/metrics/nexoraMetrics";
import {
  loadNexoraFeedback,
  NEXORA_FEEDBACK_CHANGED_EVENT,
  saveNexoraFeedback,
  type NexoraFeedbackType,
} from "../lib/feedback/nexoraFeedback.ts";
import {
  buildDomainAwareOperatorInsightHint,
  buildDomainAwareOperatorInsightLine,
  emitDomainOperatorInsightReadyDevOnce,
  normalizeOperatorInsightDomain,
} from "../lib/review/nexoraOperatorInsightDomain.ts";
import {
  buildNexoraPilotSynthesis,
  buildNexoraPilotSynthesisInputSignature,
  collectNexoraPilotSynthesisInputFromBrowser,
  type NexoraPilotSynthesis,
} from "../lib/review/nexoraPilotSynthesis.ts";

type FullRegistrarProps = {
  selectedIdRefLocal: React.MutableRefObject<string | null>;
  overridesRefLocal: React.MutableRefObject<Record<string, any>>;
  setOverrideRefLocal: React.MutableRefObject<(id: string, patch: any) => void>;
  onSelectedChange: (id: string | null) => void;
  bumpOverridesVersion: React.Dispatch<React.SetStateAction<number>>;
  clearAllOverridesRef: React.MutableRefObject<() => void>;
  pruneOverridesRef: React.MutableRefObject<(ids: string[]) => void>;
};

// Legacy shell/inspector tab ids are kept only for compatibility boundaries.
const LEGACY_RIGHT_PANEL_TABS = [
  "chat",
  "object",
  "loops",
  "kpi",
  "decisions",
  "scene",
  "montecarlo",
  "timeline",
  "conflict",
  "explanation",
  "object_focus",
  "memory_insights",
  "risk_flow",
  "replay",
  "strategic_advice",
  "opponent_moves",
  "strategic_patterns",
  "executive_dashboard",
  "simulate",
  "compare",
  "decision_policy",
  "executive_approval",
  "decision_council",
  "decision_governance",
  "decision_timeline",
  "confidence_calibration",
  "outcome_feedback",
  "pattern_intelligence",
  "collaboration_intelligence",
  "scenario_tree",
  "strategic_command",
  "decision_lifecycle",
  "strategic_learning",
  "meta_decision",
  "cognitive_style",
  "team_decision",
  "org_memory",
  "war_room",
  "collaboration",
  "workspace",
] as const;

type LegacyRightPanelTab = (typeof LEGACY_RIGHT_PANEL_TABS)[number];
type CenterComponentType = "compare" | "timeline" | "analysis" | null;

const NEXORA_PIPELINE_USER_FAILURE = "System couldn't complete analysis. Please try again.";

function nexoraPipelineUserFacingMessage(err: unknown): string {
  if (getNexoraProductMode() === "pilot") return NEXORA_PIPELINE_USER_FAILURE;
  if (err instanceof NexoraError) return err.safeMessage;
  return NEXORA_PIPELINE_USER_FAILURE;
}

const INSPECTOR_REPORT_TABS = [
  "timeline",
  "conflict",
  "object_focus",
  "memory_insights",
  "risk_flow",
  "replay",
  "strategic_advice",
  "opponent_moves",
  "strategic_patterns",
  "executive_dashboard",
  "war_room",
  "collaboration",
  "workspace",
] as const;

type InspectorReportTab = (typeof INSPECTOR_REPORT_TABS)[number];

type InspectorSectionChangedDetail = {
  section?: string;
  eventTab?: LegacyRightPanelTab | null;
  source?: string | null;
};

type RightPanelOpenRequestDetail = {
  view?: RightPanelView | string | null;
  tab?: string | null;
  leftNav?: string | null;
  section?: string | null;
  source?: string | null;
  contextId?: string | null;
};

type GuidedPromptSource =
  | "domain_prompt_guide"
  | "assistant_prompt_chip"
  | "guided_prompt";

type SendTextOptions = {
  source?: "user" | "demo";
  guidedPrompt?: {
    prompt: string;
    resolvedPanel: RightPanelView;
    contextId?: string | null;
  };
};

type PanelFamilyAuditState = {
  seq: number;
  prompt: string;
  expectedFamily: RightPanelView;
  source: "chat" | "demo" | "user";
  contractRenderable?: boolean;
  contractSalvaged?: boolean;
};

type ExplicitPanelIntentState = {
  view: RightPanelView;
  source: string;
  clickedTab?: string | null;
  clickedNav?: string | null;
  timestamp: number;
};

type ClickIntentLockState = {
  view: RightPanelView;
  contextId: string | null;
  source: string;
  clickedKey: string | null;
  timestamp: number;
};

const CLICK_INTENT_LOCK_TTL_MS = 4000;

function logCtaTraceResolution(
  action: string,
  originView: RightPanelView | null,
  resolvedTarget: string,
  fallbackMessage?: string | null
): void {
  if (process.env.NODE_ENV !== "production") {
    console.log("[NEXORA][CTA_TRACE_RESOLUTION]", {
      action,
      originView: originView ?? null,
      resolvedTarget,
      isExecutiveTarget: isExecutiveActionTarget(resolvedTarget),
      fallbackMessage: fallbackMessage ?? null,
    });
  }
}

function logCtaTraceConsumer(
  action: string,
  originView: RightPanelView | null,
  resolvedTarget: string,
  consumer: "openDecisionExecutionPanel" | "openRightPanel"
): void {
  if (process.env.NODE_ENV !== "production") {
    console.log("[NEXORA][CTA_TRACE_CONSUMER]", {
      action,
      originView: originView ?? null,
      resolvedTarget,
      consumer,
    });
  }
}

function isInspectorReportTab(tab: LegacyRightPanelTab | null | undefined): tab is InspectorReportTab {
  return typeof tab === "string" && INSPECTOR_REPORT_TABS.includes(tab as InspectorReportTab);
}

function isLegacyRightPanelTab(tab: string | null | undefined): tab is LegacyRightPanelTab {
  return typeof tab === "string" && LEGACY_RIGHT_PANEL_TABS.includes(tab as LegacyRightPanelTab);
}

function shallowEqualRecord(
  left: Record<string, unknown> | null | undefined,
  right: Record<string, unknown> | null | undefined
) {
  if (left === right) return true;
  if (!left || !right) return false;
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  if (leftKeys.length !== rightKeys.length) return false;
  return leftKeys.every((key) => Object.is(left[key], right[key]));
}

function useShallowStableObject<T extends Record<string, unknown> | null>(value: T): T {
  const ref = React.useRef<T>(value);
  if (value && ref.current && shallowEqualRecord(ref.current, value)) {
    return ref.current;
  }
  ref.current = value;
  return value;
}

function FullRegistrar({
  selectedIdRefLocal,
  overridesRefLocal,
  setOverrideRefLocal,
  onSelectedChange,
  bumpOverridesVersion,
  clearAllOverridesRef,
  pruneOverridesRef,
}: FullRegistrarProps) {
  const selectedId = useSelectedId();
  const overrides = useOverrides();
  const setOverride = useSetOverride();
  const clearAll = useClearAllOverrides();
  const pruneTo = usePruneOverridesTo();

  const prevSelectedIdRef = useRef<string | null>(null);
  const lastOverridesKeyRef = useRef<string>("");

  useEffect(() => {
    if (prevSelectedIdRef.current === selectedId) return;
    prevSelectedIdRef.current = selectedId;
    onSelectedChange(selectedId);
    selectedIdRefLocal.current = selectedId;
  }, [selectedId, onSelectedChange, selectedIdRefLocal]);

  useEffect(() => {
    const obj = overrides && typeof overrides === "object" ? (overrides as any) : {};
    const ids = Object.keys(obj).sort();
    const nextKey = ids.map((id) => `${id}:${stableStringify(obj[id])}`).join("|");

    if (lastOverridesKeyRef.current === nextKey) return;

    lastOverridesKeyRef.current = nextKey;
    overridesRefLocal.current = overrides;
    if (typeof bumpOverridesVersion === "function") {
      bumpOverridesVersion((v) => v + 1);
    }
  }, [overrides, stableStringify, overridesRefLocal, bumpOverridesVersion]);

  useEffect(() => {
    setOverrideRefLocal.current = (id: string, patch: any) => setOverride(id, patch);
  }, [setOverride, setOverrideRefLocal]);

  useEffect(() => {
    clearAllOverridesRef.current = clearAll;
  }, [clearAll, clearAllOverridesRef]);

  useEffect(() => {
    pruneOverridesRef.current = pruneTo;
  }, [pruneTo, pruneOverridesRef]);

  return null;
}
const BACKEND_BASE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_BACKEND_URL) || "http://127.0.0.1:8000";

type BackendChatResponse = {
  ok?: boolean;
  reply?: string;
  active_mode?: string;
  source?: string | null;
  scene_json?: unknown;
  actions?: unknown;
  analysis_summary?: string | null;
  error?: { message?: string } | null;
  [key: string]: any;
};

// Module-scoped guards: survive StrictMode remounts and skip identical B2/B5/B7 traces before logging.
let __lastB2SceneReactionSig: string | null = null;
let __lastB5ClaritySig: string | null = null;
let __lastB7DecisionSig: string | null = null;

function shouldEmitStableNexoraTrace(kind: "b2" | "b5" | "b7", signature: string): boolean {
  if (kind === "b2") {
    if (__lastB2SceneReactionSig === signature) return false;
    __lastB2SceneReactionSig = signature;
    return true;
  }
  if (kind === "b5") {
    if (__lastB5ClaritySig === signature) return false;
    __lastB5ClaritySig = signature;
    return true;
  }
  if (__lastB7DecisionSig === signature) return false;
  __lastB7DecisionSig = signature;
  return true;
}

function loadPrefsFromStorage(): ScenePrefs | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PREFS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      !parsed ||
      !(
        (parsed.theme === "day" || parsed.theme === "night" || parsed.theme === "stars") &&
        typeof parsed.starDensity === "number" &&
        typeof parsed.showGrid === "boolean" &&
        typeof parsed.showAxes === "boolean" &&
        (parsed.orbitMode === "auto" || parsed.orbitMode === "manual")
      )
    ) {
      return null;
    }
    const globalScale =
      typeof parsed.globalScale === "number" && Number.isFinite(parsed.globalScale)
        ? clamp(parsed.globalScale, 0.2, 2)
        : defaultPrefs.globalScale;
    const overridePolicy =
      parsed.overridePolicy === "keep" || parsed.overridePolicy === "clear" ? parsed.overridePolicy : "match";
    const shadowsEnabled =
      typeof parsed.shadowsEnabled === "boolean" ? parsed.shadowsEnabled : defaultPrefs.shadowsEnabled;
    const motionIntensity =
      parsed.motionIntensity === "low" || parsed.motionIntensity === "normal"
        ? parsed.motionIntensity
        : defaultPrefs.motionIntensity;
    return { ...(parsed as ScenePrefs), globalScale, overridePolicy, shadowsEnabled, motionIntensity };
  } catch {
    return null;
  }
}



/**
 * Nexora primary screen — orchestration shell.
 *
 * Delegates stable prep/read/apply shaping to screen-adjacent modules (`homeScreenResponseReaders`,
 * `homeScreenRetailDemo`, `homeScreenSceneApply`, `homeScreenPanelHelpers`, `homeScreenPersistenceApply`,
 * `homeScreenChatApplyPrep`, `homeScreenExecutionApply`, `homeScreenShellGuards`) and to lib contracts (`applyNexoraUiState`, panel controller,
 * action router). This component owns React state/refs/effects, timing-sensitive setter order, and wiring.
 *
 * Intentionally remains large for: backup restore apply sequencing, payload slice extractors used only here,
 * and inspector ↔ legacy tab ref coordination.
 */
type HomeScreenProps = {
  domainExperience?: NexoraResolvedDomainExperience;
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ domainExperience }) => {
  const isPilotProductMode = useMemo(() => getNexoraProductMode() === "pilot", []);
  const { nexoraMode } = useNexoraOperatorMode();
  const { resolvedTheme } = useNexoraUiTheme();
  const console = React.useMemo(
    () =>
      ({
        log: () => {},
        warn: () => {},
        error: () => {},
        debug: () => {},
      }) as Pick<Console, "log" | "warn" | "error" | "debug">,
    []
  );
  const activeDomainExperience = useMemo(
    () => domainExperience ?? resolveDomainExperience("general"),
    [domainExperience]
  );
  const { activeProfile } = useCustomerDemoMode(activeDomainExperience.experience.domainId);
  const activeDomainDemo = useMemo(
    () => resolveDomainDemo(activeDomainExperience.experience.domainId),
    [activeDomainExperience]
  );
  /** B.40 — pilot-safe one-line domain / generic fallback (no QA tables). */
  const pilotRuntimeDomainLine = useMemo(() => {
    if (!isPilotProductMode) return null;
    const rt = buildCurrentDomainRuntimeState(activeDomainExperience.experience.domainId);
    if (rt.fallbackActive && rt.effectiveDomainId === "generic") {
      return "Using generic domain behavior.";
    }
    return `Domain: ${getEffectiveDomainLabel(rt.effectiveDomainId)}`;
  }, [isPilotProductMode, activeDomainExperience.experience.domainId]);
  const investorDemo = useInvestorDemo();
  const [activeCompanyId, setActiveCompanyIdState] = useState<string>(
    process.env.NEXT_PUBLIC_COMPANY_ID || "default"
  );
  const { config, loading: configLoading, error: configError, refresh } = useCompanyConfig(activeCompanyId);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [memory, setMemory] = useState<MemoryStateV1>(() => createInitialMemoryState());
  const [decisionMemoryEntries, setDecisionMemoryEntries] = useState<DecisionMemoryEntry[]>([]);
  const messagesRef = useRef<Msg[]>([]);
  const decisionMemorySignatureRef = useRef<string>("");
  const isSendingRef = useRef(false);
  const previousRightPanelViewRef = useRef<RightPanelView | null>(null);
  const lastRightPanelChangeSourceRef = useRef<string | null>(null);
  const [sceneJson, setSceneJson] = useState<SceneJson | null>(null);
  const [loading, setLoading] = useState(false);
  const [chatRequestStatus, setChatRequestStatus] = useState<ChatRequestLifecycleStatus>("idle");
  const [activeMode, setActiveMode] = useState<string>(activeDomainExperience.experience.preferredProductMode);
  const [activeTemplateId, setActiveTemplateId] = useState<string>("quality_protection");
  const [autoBackupEnabled, setAutoBackupEnabled] = useState<boolean>(
    process.env.NODE_ENV !== "production"
  );
  const [restorePreview, setRestorePreview] = useState<null | { backup: BackupV1; lines: string[] }>(null);
  const [alert, setAlert] = useState<{ level: any; score: number; reasons: string[] } | null>(null);
  const dismissAlert = useCallback(() => setAlert(null), []);
  const chatRequestSeqRef = useRef(0);
  const activePanelFamilyAuditRef = useRef<PanelFamilyAuditState | null>(null);
  const lastPanelFamilyAuditKeyRef = useRef<string | null>(null);
  const lastAuditRefTraceSignatureRef = useRef<string | null>(null);
  const pendingPanelFamilyAuditClearTimeoutRef = useRef<number | null>(null);
  const lastClearedPanelFamilyAuditRef = useRef<
    | (PanelFamilyAuditState & {
        clearedAt: number;
        clearReason: string;
      })
    | null
  >(null);
  const lastDirectPanelOpenSignatureRef = useRef<string | null>(null);
  const lastLegacyTabLoopBlockedSignatureRef = useRef<string | null>(null);
  // preferredRightPanelLegacyTabRef stores explicit user tab intent only, never derived legacy mappings.
  const preferredRightPanelLegacyTabRef = useRef<string | null>(
    activeDomainExperience.experience.preferredRightPanelTab ?? null
  );
  const lastExplicitPanelIntentRef = useRef<ExplicitPanelIntentState | null>(null);
  const clickIntentLockRef = useRef<ClickIntentLockState | null>(null);
  const lastLegacySyncBlockKeyRef = useRef<string | null>(null);
  const lastUnifiedReactionSignatureRef = useRef<string | null>(null);
  /** Dedup refs retained for in-session introspection; module guards block repeat emits before logger calls. */
  const lastB2SceneReactionLogRef = useRef<string | null>(null);
  const lastB5ClaritySigRef = useRef<string | null>(null);
  const lastB7DecisionSigRef = useRef<string | null>(null);
  const lastB12TrustSigRef = useRef<string | null>(null);
  const lastB13FrontSigRef = useRef<string | null>(null);
  /** B.12 — merge_meta + counts while multi-source → scanner bridge is in flight (for trust eval in listener). */
  const pendingTrustMultiSourceContextRef = useRef<{
    mergeMeta: Record<string, unknown>;
    sourceCount: number;
    successfulSourceCount: number;
    mergedSignalCount: number;
    bundleWarnings: string[];
  } | null>(null);
  /** Late-bound: `commitPipelineStatus` is declared later; fragility listener uses this ref to avoid TDZ. */
  const commitPipelineStatusRef = useRef<((next: NexoraPipelineStatusUi) => void) | null>(null);
  /** Late-bound: merge B.7 fields into pipeline HUD without resetting ingestion counts. */
  const mergePipelineStatusRef = useRef<((partial: Partial<NexoraPipelineStatusUi>) => void) | null>(null);
  /** B.8 — latest fragility + B.7 fields for HUD CTAs (simulate / compare payloads). */
  const pipelineB7ActionContextRef = useRef<{
    posture: string | null;
    tradeoff: string | null;
    nextMove: string | null;
    objectIds: string[];
    drivers: Array<{ id: string; label: string; score?: number }>;
    fragilityLevel: string;
    summary: string;
  } | null>(null);
  const lastB8DecisionActionAtRef = useRef<Record<string, number>>({});
  /** B.9 — decision context attached to panel data when opening simulate/compare/advice from HUD. */
  const [nexoraB8PanelContext, setNexoraB8PanelContext] = useState<NexoraB8PanelContext | null>(null);
  /** B.14 / B.18 — declared early so panel resolver merge can read stable refs before pipeline state hooks. */
  const lastAuditRecordRef = useRef<NexoraAuditRecord | null>(null);
  const nexoraPanelB18TrustRef = useRef<{
    confidenceTier: NexoraPipelineStatusUi["confidenceTier"];
    trustSummaryLine: string | null;
    fragilityLevel: NexoraPipelineStatusUi["fragilityLevel"];
  } | null>(null);
  const [panelResolverB18Epoch, setPanelResolverB18Epoch] = useState(0);
  const [executionOutcomeHudEpoch, setExecutionOutcomeHudEpoch] = useState(0);
  /** B.21 — quality layer; signature ref prevents recompute / HUD churn loops. */
  const [decisionQualityReport, setDecisionQualityReport] = useState<NexoraDecisionQualityReport | null>(null);
  /** B.23 — raw + governed bias; signature-gated with B.21. */
  const [biasLayerContext, setBiasLayerContext] = useState<NexoraBiasLayerContext | null>(null);
  const [biasGovernanceConfigEpoch, setBiasGovernanceConfigEpoch] = useState(0);
  useEffect(() => {
    if (!isPilotProductMode) return;
    saveNexoraBiasGovernanceFull(DEFAULT_NEXORA_BIAS_GOVERNANCE);
    setBiasGovernanceConfigEpoch((n) => n + 1);
  }, [isPilotProductMode]);
  useEffect(() => {
    if (typeof window === "undefined" || !isPilotProductMode) return;
    const w = window as unknown as Record<string, unknown>;
    delete w.__NEXORA_DEBUG__;
    delete w.__NEXORA_LAST_AUDIT__;
    delete w.__NEXORA_LAST_INGESTION__;
    delete w.__NEXORA_LAST_MULTI_SOURCE_INGESTION__;
    delete w.__NEXORA_INGESTION_DEV__;
  }, [isPilotProductMode]);
  const lastBiasLayerApplyKeyRef = useRef<string | null>(null);
  const lastDecisionQualitySigRef = useRef<string | null>(null);
  const lastDecisionQualityReportRef = useRef<NexoraDecisionQualityReport | null>(null);
  const lastExecutionOutcomeRef = useRef<NexoraExecutionOutcome | null>(null);
  const lastNexoraTrustEvaluationInputRef = useRef<NexoraTrustValidationInput | null>(null);
  /** B20-FIX-1 — dedupe per-run outcome lookup logs. */
  const lastB20Fix1OutcomeLookupSigRef = useRef<string | null>(null);
  const lastNarrativeOverrideSignatureRef = useRef<string | null>(null);
  const decisionFlowSeqRef = useRef(0);
  const demoFlowPauseRef = useRef<() => void>(() => {});
  const activeChatRequestRef = useRef<{
    seq: number;
    controller: AbortController;
    timeoutId: number;
    timedOut: boolean;
  } | null>(null);
  /** Dev self-debug: correlates panel/scene events with the active chat turn (cleared when the turn ends). */
  const activeChatDebugCorrelationRef = useRef<string | null>(null);
  const [rightPanelState, setRightPanelState] = useState<RightPanelState>(() => ({
    ...createClosedRightPanelState(),
    view: mapLegacyTabToRightPanelView(activeDomainExperience.experience.preferredRightPanelTab) ?? null,
  }));
  const [centerComponent, setCenterComponent] = useState<CenterComponentType>(null);
  const [centerComponentVisible, setCenterComponentVisible] = useState(false);
  const centerComponentCloseTimerRef = useRef<number | null>(null);
  /** B.27 — after pilot demo ingestion, open compare once pipeline reaches ready. */
  const openCompareAfterPipelineReadyRef = useRef(false);
  /** B.28 — pilot metrics edge detection. */
  const prevPipelineStatusForMetricRef = useRef<NexoraPipelineStatusUi["status"] | null>(null);
  const prevCompareOpenForMetricRef = useRef(false);
  const lastDecisionRunIdForMetricRef = useRef<string | null>(null);
  const [objectSelection, setObjectSelection] = useState<any | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [selectedObjectIdState, setSelectedObjectIdState] = useState<string | null>(null);
  const inspectorOpen = rightPanelState.isOpen;
  const highlightedObjectIds = useMemo(() => {
    const selectedHighlights = getHighlightedObjectIdsFromSelection(objectSelection);
    if (selectedHighlights.length > 0) return selectedHighlights;
    const sceneSelection = asRecord(sceneJson)?.object_selection;
    const sceneHighlights = getHighlightedObjectIdsFromSelection(sceneSelection);
    if (sceneHighlights.length > 0) return sceneHighlights;
    return [] as string[];
  }, [objectSelection, sceneJson]);
  const traceLegacySyncBlocked = useCallback(
    (source: string, attemptedView: RightPanelView | null, reason: string) => {
      if (process.env.NODE_ENV === "production") return;
      const key = JSON.stringify({
        source,
        current: rightPanelState.view ?? null,
        attempted: attemptedView ?? null,
        contextId: rightPanelState.contextId ?? null,
        selectedObjectId: selectedObjectIdState ?? null,
        highlightedCount: highlightedObjectIds.length,
        reason,
      });
      if (lastLegacySyncBlockKeyRef.current === key) return;
      lastLegacySyncBlockKeyRef.current = key;
      console.warn("[LegacySyncBlocked]", {
        source,
        attempted: attemptedView ?? null,
        current: rightPanelState.view ?? null,
        reason,
      });
    },
    [
      highlightedObjectIds.length,
      rightPanelState.contextId,
      rightPanelState.view,
      selectedObjectIdState,
    ]
  );
  const lastStableRightPanelTabRef = useRef<LegacyRightPanelTab | null>(null);
  const mappedRightPanelTab = useMemo(() => {
    const mapped = resolveRightPanelLegacyTabForView(
      rightPanelState.view,
      preferredRightPanelLegacyTabRef.current
    );
    if (isLegacyRightPanelTab(mapped)) {
      return mapped;
    }
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Home][LEGACY_TAB_SYNC_STOPPED]", {
        currentView: rightPanelState.view ?? null,
        mappedLegacyTab: mapped ?? null,
        reason: "Panel view could not be converted into a valid legacy tab.",
      });
    }
    return null;
  }, [rightPanelState.view]);
  const traceViewSync = useCallback(
    (
      label:
        | "[Nexora][ViewSync] homescreen_state"
        | "[Nexora][ViewSync] desync_detected"
        | "[Nexora][ViewSync] desync_fixed",
      detail: {
        activeTab: string | null;
        currentRightPanelView: RightPanelView | null;
        renderedView: RightPanelView | null;
        legacyTab: string | null;
        source: string;
        reason: string;
      }
    ) => {
      return;
    },
    []
  );
  useEffect(() => {
    if (mappedRightPanelTab) {
      lastStableRightPanelTabRef.current = mappedRightPanelTab;
    }
  }, [mappedRightPanelTab]);
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const preferredLegacyTab = preferredRightPanelLegacyTabRef.current;
    if (!mappedRightPanelTab || !preferredLegacyTab || mappedRightPanelTab === preferredLegacyTab) {
      return;
    }
    const signature = [
      rightPanelState.view ?? "null",
      mappedRightPanelTab,
      preferredLegacyTab,
    ].join("|");
    if (lastLegacyTabLoopBlockedSignatureRef.current === signature) {
      return;
    }
    lastLegacyTabLoopBlockedSignatureRef.current = signature;
    console.log("[Nexora][LegacyTabLoopBlocked]", {
      currentView: rightPanelState.view ?? null,
      mappedRightPanelTab: mappedRightPanelTab ?? null,
      preferredLegacyTab: preferredLegacyTab ?? null,
    });
  }, [mappedRightPanelTab, rightPanelState.view]);
  const rightPanelTab = mappedRightPanelTab ?? lastStableRightPanelTabRef.current;
  const activeInspectorReportTab = useMemo(() => {
    const tab = resolveRightPanelLegacyTabForView(
      rightPanelState.view,
      preferredRightPanelLegacyTabRef.current
    );
    if (isLegacyRightPanelTab(tab) && isInspectorReportTab(tab)) {
      return tab;
    }
    if (tab && process.env.NODE_ENV !== "production") {
      console.warn("[Home][INSPECTOR_TAB_SYNC_STOPPED]", {
        currentView: rightPanelState.view ?? null,
        mappedLegacyTab: tab,
        reason: "Mapped inspector tab is not part of the inspector-report contract.",
      });
    }
    return null;
  }, [rightPanelState.view]);
  useEffect(() => {
    traceViewSync("[Nexora][ViewSync] homescreen_state", {
      activeTab: rightPanelTab ?? null,
      currentRightPanelView: rightPanelState.view ?? null,
      renderedView: rightPanelState.view ?? null,
      legacyTab: preferredRightPanelLegacyTabRef.current ?? null,
      source: "HomeScreen.rightPanelState",
      reason: "homescreen_canonical_state",
    });
    const expectedTab = resolveRightPanelLegacyTabForView(
      rightPanelState.view,
      preferredRightPanelLegacyTabRef.current
    );
    if (rightPanelState.view && expectedTab && expectedTab !== rightPanelTab) {
      traceViewSync("[Nexora][ViewSync] desync_detected", {
        activeTab: rightPanelTab ?? null,
        currentRightPanelView: rightPanelState.view ?? null,
        renderedView: rightPanelState.view ?? null,
        legacyTab: preferredRightPanelLegacyTabRef.current ?? null,
        source: "HomeScreen.rightPanelState",
        reason: "legacy_tab_mismatch_for_current_view",
      });
      return;
    }
    traceViewSync("[Nexora][ViewSync] desync_fixed", {
      activeTab: rightPanelTab ?? null,
      currentRightPanelView: rightPanelState.view ?? null,
      renderedView: rightPanelState.view ?? null,
      legacyTab: preferredRightPanelLegacyTabRef.current ?? null,
      source: "HomeScreen.rightPanelState",
      reason: "legacy_tab_and_view_aligned",
    });
  }, [rightPanelState.view, rightPanelTab, traceViewSync]);
  const traceRightPanelStateMutation = useCallback(
    (
      source: string,
      previousView: RightPanelView,
      nextView: RightPanelView,
      contextId: string | null = null
    ) => {
      return;
    },
    []
  );
  const traceRightPanelPathAudit = useCallback(
    (
      source: string,
      nextView: RightPanelView | null,
      classification:
        | "explicit_user_action"
        | "default_sync"
        | "fallback"
        | "adapter_reopen"
        | "legacy_sync"
        | "direct_state_write"
    ) => {
      return;
    },
    []
  );
  const [isClientMounted, setIsClientMounted] = useState(false);
  const [inspectorPortalHost, setInspectorPortalHost] = useState<HTMLElement | null>(null);
  const tracePanelFamilyAudit = useCallback(
    (
      label:
        | "[Nexora][PanelFamilyAudit] expected_family"
        | "[Nexora][PanelFamilyAudit] raw_payload_presence"
        | "[Nexora][PanelFamilyAudit] canonical_presence"
        | "[Nexora][PanelFamilyAudit] contract_result",
      detail: Record<string, unknown>
    ) => {
      return;
    },
    []
  );
  const traceAuditRef = useCallback(
    (
      event:
        | "set"
        | "update"
        | "read"
        | "clear"
        | "stale_overwrite_blocked"
        | "early_clear_detected",
      detail: {
        source: string;
        seq: number | null;
        prompt: string | null;
        expectedFamily: RightPanelView | null;
        contractRenderable: boolean;
        contractSalvaged: boolean;
        reason: string;
      }
    ) => {
      return;
    },
    []
  );
  const tracePanelFlowRuntime = useCallback(
    (
      stage:
        | "prompt_submitted"
        | "expected_family"
        | "contract_result"
        | "requested_view"
        | "actual_view_changed",
      detail: {
        requestedView?: RightPanelView | null;
        actualView?: RightPanelView | null;
        dashboardOverride?: boolean;
      } = {}
    ) => {
      return;
    },
    []
  );
  const traceFocusFlashAudit = useCallback(
    (
      label:
        | "[Nexora][FocusFlashAudit] focus_entered"
        | "[Nexora][FocusFlashAudit] focus_skipped"
        | "[Nexora][FocusFlashAudit] dashboard_followed_focus",
      detail: {
        nextView?: RightPanelView | null;
      } = {}
    ) => {
      return;
    },
    []
  );
  const traceSemanticDominance = useCallback(
    (
      label:
        | "[Nexora][SemanticDominance] forced_family_kept"
        | "[Nexora][SemanticDominance] fallback_blocked",
      detail: {
        nextView?: RightPanelView | null;
        source?: string | null;
      } = {}
    ) => {
      return;
    },
    []
  );
  const tracePanelOverrideAudit = useCallback(
    (
      label:
        | "[Nexora][PanelOverrideAudit] openRightPanel_called"
        | "[Nexora][PanelOverrideAudit] dashboard_override_applied"
        | "[Nexora][PanelOverrideAudit] dashboard_override_blocked"
        | "[Nexora][PanelOverrideAudit] right_panel_state_changed",
      detail: Record<string, unknown>
    ) => {
      return;
    },
    []
  );
  const traceSimHijackAudit = useCallback(
    (
      label:
        | "[Nexora][SimHijackAudit] simulate_requested"
        | "[Nexora][SimHijackAudit] simulate_applied"
        | "[Nexora][SimHijackAudit] simulate_blocked"
        | "[Nexora][SimHijackAudit] state_before_simulate",
      detail: {
        source: string;
        previousView?: RightPanelView | null;
        nextView?: RightPanelView | null;
        clickedSource?: string | null;
        clickedTab?: string | null;
        clickedNav?: string | null;
        explicitUserActionRequestedSimulate: boolean;
        automaticFallback: boolean;
      }
    ) => {
      return;
    },
    []
  );
  const traceClickState = useCallback(
    (
      label:
        | "[Nexora][ClickState] intent_received"
        | "[Nexora][ClickState] state_applied"
        | "[Nexora][ClickState] no_op_blocked"
        | "[Nexora][ClickState] late_override_blocked"
        | "[Nexora][ClickState] invalid_target_blocked"
        | "[Nexora][ClickState] lock_cleared",
      detail: {
        source: string;
        clickedKey?: string | null;
        requestedView?: RightPanelView | string | null;
        previousView?: RightPanelView | null;
        nextView?: RightPanelView | null;
        previousContextId?: string | null;
        nextContextId?: string | null;
        reason?: string | null;
        explicitUserIntent: boolean;
      }
    ) => {
      return;
    },
    []
  );
  const traceDirectPanelOpen = useCallback(
    (detail: {
      source: string;
      requestedView: RightPanelView | null;
      appliedView: RightPanelView | null;
    }) => {
      if (process.env.NODE_ENV === "production") return;
      const signature = [
        detail.source,
        detail.requestedView ?? "null",
        detail.appliedView ?? "null",
      ].join("|");
      if (lastDirectPanelOpenSignatureRef.current === signature) {
        return;
      }
      lastDirectPanelOpenSignatureRef.current = signature;
      logPanelOpen({
        requestedView: detail.requestedView ?? null,
        appliedView: detail.appliedView ?? null,
        source: detail.source,
        via: "direct_trace",
      });
    },
    []
  );
  const traceRenderAudit = useCallback(
    (
      label:
        | "[Nexora][RenderAudit] state_write"
        | "[Nexora][RenderAudit] no_op_write",
      detail: {
        file: string;
        function: string;
        currentView: RightPanelView | null;
        nextView: RightPanelView | null;
        renderCount?: number;
        reason: string;
        panelKey?: string | null;
        dataShape?: string | null;
        dependencyHint?: string | null;
      }
    ) => {
      return;
    },
    []
  );
  const debugPanelLockState = useCallback(
    (_label: string, _extra?: Record<string, unknown>) => {
      return;
    },
    []
  );
  const clearClickIntentLock = useCallback(
    (
      reason: string,
      detail?: {
        source?: string;
        nextView?: RightPanelView | null;
        nextContextId?: string | null;
      }
    ) => {
      const lock = clickIntentLockRef.current;
      if (!lock) {
        return;
      }
      debugPanelLockState("click_lock_cleared", {
        reason,
        source: detail?.source ?? lock.source,
        nextView: detail?.nextView ?? null,
        nextContextId: detail?.nextContextId ?? null,
      });
      clickIntentLockRef.current = null;
      traceClickState("[Nexora][ClickState] lock_cleared", {
        source: detail?.source ?? lock.source,
        clickedKey: lock.clickedKey,
        requestedView: lock.view,
        previousView: rightPanelState.view ?? null,
        nextView: detail?.nextView ?? null,
        previousContextId: rightPanelState.contextId ?? null,
        nextContextId: detail?.nextContextId ?? null,
        reason,
        explicitUserIntent: true,
      });
    },
    [debugPanelLockState, rightPanelState.contextId, rightPanelState.view, traceClickState]
  );
  const applyPanelControllerRequest = useCallback(
    (request: PanelRequestIntent & { source: PanelOpenSource; rawSource?: string | null }) => {
      const nextContextId = request.contextId ?? null;
      const now = Date.now();
      const correlationId = `panel-${now}-${Math.random().toString(36).slice(2, 7)}`;
      if (request.source === "cta" && request.requestedView) {
        emitDebugEvent({
          type: "cta_clicked",
          layer: "intent",
          source: "HomeScreen",
          status: "info",
          message: `CTA requested ${request.requestedView}`,
          metadata: {
            view: request.requestedView,
            rawSource: request.rawSource ?? null,
          },
          correlationId,
        });
      }
      const chatDbgCorrelation = activeChatDebugCorrelationRef.current;
      emitDebugEvent({
        type: "panel_requested",
        layer: "panel",
        source: "HomeScreen",
        status: "info",
        message: request.close ? "Panel close request" : "Panel open request",
        metadata: {
          requestedView: request.requestedView ?? null,
          source: request.source,
          rawSource: request.rawSource ?? null,
          close: Boolean(request.close),
          panelCorrelationId: correlationId,
          ...(chatDbgCorrelation ? { chatCorrelationId: chatDbgCorrelation } : {}),
        },
        correlationId,
      });
      const decision = resolvePanelDecision(request, {
        currentPanelState: rightPanelState,
        explicitPanelIntent: lastExplicitPanelIntentRef.current,
        clickIntentLock: clickIntentLockRef.current,
        hasMeaningfulObjectContext: hasMeaningfulObjectPanelContext({
          contextId: rightPanelState.contextId ?? nextContextId,
          selectedObjectId: selectedObjectIdState,
          highlightedObjectIds,
        }),
        now,
      });
      const resolvedView = decision.resolvedView;
      const rawSource = request.rawSource ?? request.source;
      const isAutomatic = isAutomaticRightPanelSource(rawSource);

      emitDebugEvent({
        type: "panel_resolved",
        layer: "router",
        source: "HomeScreen",
        status:
          decision.kind === "block" ? "blocked" : decision.kind === "open" ? "ok" : "info",
        message: `${decision.kind}: ${decision.reason}`,
        metadata: {
          decisionKind: decision.kind,
          reason: decision.reason,
          resolvedView: resolvedView ?? null,
          nextView: decision.nextState?.view ?? null,
          requestedView: request.requestedView ?? null,
          panelCorrelationId: correlationId,
          ...(chatDbgCorrelation ? { chatCorrelationId: chatDbgCorrelation } : {}),
        },
        correlationId,
      });

      registerPanelSelfDebugLink({
        panelCorrelationId: correlationId,
        chatCorrelationId: chatDbgCorrelation,
        requestedView: request.requestedView ?? null,
        rawSource: request.rawSource ?? request.source ?? null,
        ts: now,
      });

      emitGuardRailAlerts(
        runGuardChecks(
          {
            trigger: "panel_resolve",
            correlationId: chatDbgCorrelation ?? null,
            panel: {
              decisionKind: decision.kind,
              requestedView: request.requestedView ?? null,
              resolvedView: resolvedView ?? null,
            },
          },
          getRecentDebugEvents()
        )
      );

      logPanelDecision({
        requestedView: request.requestedView,
        source: request.source,
        rawSource,
        contextId: request.contextId ?? null,
        currentView: rightPanelState?.view ?? null,
        decision: decision.kind,
        reason: decision.reason,
        nextView: decision.nextState?.view ?? null,
      });

      const logBlocked = (reason: string, extra?: Record<string, unknown>) => {
        logPanelRejected({
          view: request.requestedView,
          resolvedView: resolvedView ?? null,
          source: rawSource,
          contextId: nextContextId,
          reason,
          ...extra,
        });
      };

      const lock = clickIntentLockRef.current;
      if (lock && now - lock.timestamp > CLICK_INTENT_LOCK_TTL_MS) {
        clearClickIntentLock("stale_timeout", {
          source: rawSource,
          nextView: resolvedView,
          nextContextId,
        });
      }

      if (decision.kind === "block" && decision.reason === "resolve_safe_view_failed") {
        traceClickState("[Nexora][ClickState] invalid_target_blocked", {
          source: rawSource,
          requestedView: request.requestedView,
          previousView: rightPanelState.view ?? null,
          nextView: null,
          previousContextId: rightPanelState.contextId ?? null,
          nextContextId,
          reason: decision.reason,
          explicitUserIntent: !isAutomatic,
        });
        logBlocked(decision.reason);
        return;
      }

      if (decision.kind === "block" && decision.reason === "meaningful_object_panel_preserved") {
        traceLegacySyncBlocked(rawSource, resolvedView, decision.reason);
        logBlocked(decision.reason);
        logPanelContinuityPreserved({
          reason: decision.reason,
          currentView: rightPanelState.view ?? null,
          requestedView: request.requestedView ?? null,
          rawSource,
        });
        return decision;
      }

      if (decision.kind === "block" && decision.reason === "click_intent_lock_preserved") {
        traceClickState("[Nexora][ClickState] late_override_blocked", {
          source: rawSource,
          clickedKey: lock?.clickedKey,
          requestedView: lock?.view ?? request.requestedView,
          previousView: rightPanelState.view ?? null,
          nextView: resolvedView,
          previousContextId: rightPanelState.contextId ?? null,
          nextContextId,
          reason: decision.reason,
          explicitUserIntent: false,
        });
        debugPanelLockState("late_override_blocked", {
          source: rawSource,
          requestedView: lock?.view ?? request.requestedView,
          nextView: resolvedView,
          nextContextId,
          reason: decision.reason,
        });
        logBlocked(decision.reason);
        return decision;
      }

      if (decision.kind === "preserve" && decision.reason === "same_view_same_context") {
        traceClickState("[Nexora][ClickState] no_op_blocked", {
          source: rawSource,
          requestedView: request.requestedView,
          previousView: rightPanelState.view ?? null,
          nextView: resolvedView,
          previousContextId: rightPanelState.contextId ?? null,
          nextContextId,
          reason: decision.reason,
          explicitUserIntent: !isAutomatic,
        });
        logBlocked(decision.reason);
        return decision;
      }

      if (decision.kind === "close") {
        return decision;
      }

      if (!isAutomatic) {
        clickIntentLockRef.current = {
          view: resolvedView,
          contextId: nextContextId,
          source: rawSource,
          clickedKey: nextContextId ?? resolvedView,
          timestamp: now,
        };
        lastExplicitPanelIntentRef.current = {
          view: resolvedView,
          source: rawSource,
          clickedTab: request.clickedTab ?? null,
          clickedNav: request.clickedNav ?? null,
          timestamp: now,
        };
        traceClickState("[Nexora][ClickState] intent_received", {
          source: rawSource,
          clickedKey: nextContextId ?? resolvedView,
          requestedView: request.requestedView,
          previousView: rightPanelState.view ?? null,
          nextView: resolvedView,
          previousContextId: rightPanelState.contextId ?? null,
          nextContextId,
          reason: decision.reason,
          explicitUserIntent: true,
        });
      }

      if (decision.kind !== "open") {
        logBlocked(decision.reason, { decision: decision.kind });
        return decision;
      }

      if (!decision.nextState?.view) {
        logPanelRejected({
          reason: "open_decision_missing_next_state_view",
          resolvedView: resolvedView ?? null,
          rawSource,
          decisionKind: decision.kind,
        });
        logBlocked("open_missing_next_state_view");
        return decision;
      }
      if (resolvedView) {
        logPanelOpen({
          view: resolvedView,
          source: rawSource,
          contextId: nextContextId,
        });
      }
      traceDirectPanelOpen({
        source: rawSource,
        requestedView: request.requestedView,
        appliedView: resolvedView,
      });
      traceRightPanelPathAudit(
        rawSource,
        resolvedView,
        isAutomatic ? "adapter_reopen" : "explicit_user_action"
      );
      lastRightPanelChangeSourceRef.current = rawSource;
      traceRightPanelStateMutation(
        rawSource,
        rightPanelState.view ?? null,
        resolvedView,
        nextContextId
      );
      traceClickState("[Nexora][ClickState] state_applied", {
        source: rawSource,
        clickedKey: nextContextId ?? resolvedView,
        requestedView: request.requestedView,
        previousView: rightPanelState.view ?? null,
        nextView: resolvedView,
        previousContextId: rightPanelState.contextId ?? null,
        nextContextId,
        reason: decision.reason,
        explicitUserIntent: !isAutomatic,
      });
      setRightPanelState((prev) => {
        const next = decision.nextState;
        if (
          prev.view === next.view &&
          prev.contextId === next.contextId &&
          prev.isOpen === next.isOpen
        ) {
          return prev; // prevent unnecessary re-render loop
        }
        return next;
      });
      return decision;
    },
    [
      clearClickIntentLock,
      debugPanelLockState,
      highlightedObjectIds,
      rightPanelState.contextId,
      rightPanelState.view,
      selectedObjectIdState,
      traceClickState,
      traceDirectPanelOpen,
      traceLegacySyncBlocked,
      traceRightPanelPathAudit,
      traceRightPanelStateMutation,
    ]
  );
  const requestRightPanelOpen = useCallback(
    (detail: {
      view: RightPanelView;
      source: string;
      rawSource?: string | null;
      contextId?: string | null;
      clickedTab?: string | null;
      clickedNav?: string | null;
      legacyTab?: string | null;
      leftNav?: string | null;
      section?: string | null;
      preserveIfSameContext?: boolean;
      allowAutoOverride?: boolean;
    }) => {
      applyPanelControllerRequest({
        requestedView: detail.view,
        source: toPanelOpenSource(detail.source),
        rawSource: detail.rawSource ?? detail.source,
        contextId: detail.contextId ?? null,
        clickedTab: detail.clickedTab ?? null,
        clickedNav: detail.clickedNav ?? null,
        legacyTab: detail.legacyTab ?? null,
        leftNav: detail.leftNav ?? null,
        section: detail.section ?? null,
        preserveIfSameContext: detail.preserveIfSameContext,
        allowAutoOverride: detail.allowAutoOverride,
      });
    },
    [applyPanelControllerRequest]
  );
  const closeRightPanel = useCallback(() => {
    emitDebugEvent({
      type: "panel_reset_detected",
      layer: "panel",
      source: "HomeScreen",
      status: "info",
      message: "Right panel close invoked",
      metadata: { previousView: rightPanelState.view ?? null, rawSource: "closeRightPanel" },
    });
    const decision = applyPanelControllerRequest(
      {
        requestedView: null,
        source: "unknown",
        rawSource: "closeRightPanel",
        close: true,
      }
    );
    clearClickIntentLock("panel_closed", {
      source: "closeRightPanel",
      nextView: null,
      nextContextId: null,
    });
    logPanelClose({
      previousView: rightPanelState.view ?? null,
    });
    traceRightPanelPathAudit("closeRightPanel", null, "direct_state_write");
    lastRightPanelChangeSourceRef.current = "closeRightPanel";
    traceRightPanelStateMutation(
      "closeRightPanel",
      rightPanelState.view ?? null,
      null,
      rightPanelState.contextId ?? null
    );
    if (decision) {
      setRightPanelState((prev) => {
        const next = decision.nextState;
        if (
          prev.view === next.view &&
          prev.contextId === next.contextId &&
          prev.isOpen === next.isOpen
        ) {
          return prev;
        }
        return next;
      });
    }
  }, [applyPanelControllerRequest, clearClickIntentLock, rightPanelState, traceRightPanelPathAudit, traceRightPanelStateMutation]);
  const openCenterComponent = useCallback((component: Exclude<CenterComponentType, null>) => {
    if (centerComponentCloseTimerRef.current != null) {
      window.clearTimeout(centerComponentCloseTimerRef.current);
      centerComponentCloseTimerRef.current = null;
    }
    setCenterComponent(component);
  }, []);

  const dispatchCanonicalAction = useCallback(
    (action: CanonicalNexoraAction) => {
      traceActionRouterReceived(action);
      traceActionRouterNormalized(action);
      const ctx: ActionRouterContext = {
        currentView: rightPanelState.view,
        currentContextId: rightPanelState.contextId ?? null,
      };
      const result = resolveActionRoute(action, ctx);
      if (result.status === "rejected") {
        traceActionRouterRejected(action, result);
        return;
      }
      traceActionRouterResolved(action, result);
      if (result.continuityHint === "preserved_strong_panel" || result.continuityHint === "same_view_subnav") {
        traceActionRouterContinuity(action, result.continuityHint, {
          panelView: result.panelRequest?.view ?? null,
          contextId: result.panelRequest?.contextId ?? null,
        });
      }
      if (result.execution === "start_investor_demo") {
        investorDemo.startDemo();
        traceActionRouterExecuted(action, { execution: result.execution, outcome: "demo_started" });
        return;
      }
      if (result.execution === "open_center_compare") {
        openCenterComponent("compare");
        traceActionRouterExecuted(action, { execution: result.execution, outcome: "center_compare_opened" });
        return;
      }
      if (result.execution === "open_center_timeline") {
        openCenterComponent("timeline");
        traceActionRouterExecuted(action, { execution: result.execution, outcome: "center_timeline_opened" });
        return;
      }
      if (result.execution === "open_right_panel" && result.panelRequest) {
        if (!result.panelRequest.view) {
          logPanelRejected({
            reason: "action_router_panel_request_missing_view",
            actionId: action.actionId,
            intentKind: action.intent.kind,
          });
          return;
        }
        requestRightPanelOpen(result.panelRequest);
        traceActionRouterExecuted(action, {
          execution: result.execution,
          outcome: "right_panel_opened",
          extra: {
            view: result.panelRequest.view ?? null,
            contextId: result.panelRequest.contextId ?? null,
            source: result.panelRequest.source,
          },
        });
      }
    },
    [
      investorDemo.startDemo,
      openCenterComponent,
      requestRightPanelOpen,
      rightPanelState.contextId,
      rightPanelState.view,
    ]
  );

  useEffect(() => {
    registerNexoraActionDispatch(dispatchCanonicalAction);
    return () => registerNexoraActionDispatch(null);
  }, [dispatchCanonicalAction]);

  const runPilotDemoScenario = useCallback(() => {
    const scenario = NEXORA_PILOT_SCENARIOS.find((s) => s.id === "finance_margin_pressure");
    if (!scenario || scenario.input.type !== "text") return;
    if (typeof window === "undefined") return;
    openCompareAfterPipelineReadyRef.current = true;
    window.dispatchEvent(
      new CustomEvent("nexora:run-business-text-ingestion", {
        detail: { text: scenario.input.payload, source: "pilot_demo_b25", openCompareAfter: true },
      })
    );
  }, []);

  const traceB8DecisionAction = useCallback((kind: string) => {
    if (process.env.NODE_ENV === "production") return;
    const now = Date.now();
    if (now - (lastB8DecisionActionAtRef.current[kind] ?? 0) < 450) return;
    lastB8DecisionActionAtRef.current[kind] = now;
    globalThis.console?.log?.("[Nexora][B8] decision_action_triggered", { kind });
  }, []);

  const dispatchPipelineHudB7Simulate = useCallback(() => {
    const ctx = pipelineB7ActionContextRef.current;
    setNexoraB8PanelContext(ctx ? nexoraB8PanelContextFromHudRef(ctx) : null);
    traceB8DecisionAction("simulate");
    dispatchCanonicalAction(
      normalizeRunSimulation({
        rawSource: "pipeline_hud:b8:simulate",
        source: "scanner",
        surface: "panel_cta",
        payload: ctx
          ? {
              nexora_b7: {
                posture: ctx.posture,
                tradeoff: ctx.tradeoff,
                nextMove: ctx.nextMove,
                objectIds: ctx.objectIds,
                drivers: ctx.drivers,
                fragilityLevel: ctx.fragilityLevel,
                summary: ctx.summary.slice(0, 280),
              },
            }
          : null,
      })
    );
  }, [dispatchCanonicalAction, traceB8DecisionAction]);

  const dispatchPipelineHudB7Compare = useCallback(() => {
    const ctx = pipelineB7ActionContextRef.current;
    setNexoraB8PanelContext(ctx ? nexoraB8PanelContextFromHudRef(ctx) : null);
    traceB8DecisionAction("compare");
    dispatchCanonicalAction(
      normalizeCompareOptions({
        rawSource: "pipeline_hud:b8:compare",
        source: "scanner",
        surface: "center_overlay",
        payload: ctx
          ? {
              nexora_b7: {
                posture: ctx.posture,
                objectIds: ctx.objectIds,
                drivers: ctx.drivers,
                fragilityLevel: ctx.fragilityLevel,
                summary: ctx.summary.slice(0, 280),
              },
            }
          : null,
      })
    );
  }, [dispatchCanonicalAction, traceB8DecisionAction]);

  const dispatchPipelineHudB7WhyThis = useCallback(() => {
    const ctx = pipelineB7ActionContextRef.current;
    setNexoraB8PanelContext(ctx ? nexoraB8PanelContextFromHudRef(ctx) : null);
    traceB8DecisionAction("why_this");
    dispatchCanonicalAction(
      normalizeOpenPanelCta({
        view: "advice",
        rawSource: "pipeline_hud:b8:why_this",
        source: "scanner",
        surface: "panel_cta",
      })
    );
  }, [dispatchCanonicalAction, traceB8DecisionAction]);

  const closeCenterComponent = useCallback(() => {
    setCenterComponentVisible(false);
    if (centerComponentCloseTimerRef.current != null) {
      window.clearTimeout(centerComponentCloseTimerRef.current);
    }
    centerComponentCloseTimerRef.current = window.setTimeout(() => {
      setCenterComponent(null);
      centerComponentCloseTimerRef.current = null;
    }, 170);
  }, []);
  const toggleRightPanel = useCallback(
    (view: RightPanelView, contextId: string | null = null) => {
      if (!view) {
        return;
      }
      dispatchCanonicalAction(
        normalizeOpenPanelCta({
          view,
          contextId,
          rawSource: "toggleRightPanel",
          source: "system",
          surface: "legacy_shell",
        })
      );
    },
    [dispatchCanonicalAction]
  );
  const toggleInspector = useCallback(() => {
    traceRightPanelPathAudit("toggleInspector", rightPanelState.view ?? null, "direct_state_write");
    if (rightPanelState.isOpen) {
      closeRightPanel();
      return;
    }
    const v = rightPanelState.view;
    if (!v) {
      return;
    }
    dispatchCanonicalAction(
      normalizeOpenPanelCta({
        view: v,
        contextId: rightPanelState.contextId ?? null,
        rawSource: "toggleInspector",
        source: "system",
        surface: "legacy_shell",
      })
    );
  }, [closeRightPanel, dispatchCanonicalAction, rightPanelState.contextId, rightPanelState.isOpen, rightPanelState.view, traceRightPanelPathAudit]);

  useEffect(() => {
    if (!centerComponent) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeCenterComponent();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [centerComponent, closeCenterComponent]);
  useEffect(() => {
    if (!centerComponent) {
      setCenterComponentVisible(false);
      return;
    }
    const raf = window.requestAnimationFrame(() => {
      setCenterComponentVisible(true);
    });
    return () => window.cancelAnimationFrame(raf);
  }, [centerComponent]);
  useEffect(() => {
    return () => {
      if (centerComponentCloseTimerRef.current != null) {
        window.clearTimeout(centerComponentCloseTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const onOpenRightPanel = (
      event: Event
    ) => {
      const detail = (event as CustomEvent<RightPanelOpenRequestDetail>).detail;
      const requestedView =
        typeof detail?.view === "string" && detail.view.trim().length > 0
          ? (detail.view.trim() as RightPanelView)
          : null;
      if (!requestedView && !detail?.tab && !detail?.leftNav && !detail?.section) {
        return;
      }
      dispatchCanonicalAction(normalizeOpenRightPanelEventDetail(detail));
    };

    window.addEventListener("nexora:open-right-panel", onOpenRightPanel as EventListener);
    return () => window.removeEventListener("nexora:open-right-panel", onOpenRightPanel as EventListener);
  }, [dispatchCanonicalAction]);

  useEffect(() => {
    if (!rightPanelTab) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[Home][RIGHT_PANEL_TAB_EVENT_SKIPPED]", {
          currentView: rightPanelState.view ?? null,
          reason: "No valid legacy tab mapping was available for the current panel view.",
        });
      }
      return;
    }
    // Legacy tab sync is metadata-only. The concrete panel identity remains rightPanelState.view.
    window.dispatchEvent(
      new CustomEvent("nexora:right-panel-tab-changed", {
        detail: { tab: rightPanelTab, view: rightPanelState.view ?? null },
      })
    );
  }, [rightPanelState.view, rightPanelTab]);

  useEffect(() => {
    return;
  }, [rightPanelState]);
  useEffect(() => {
    return;
  }, [rightPanelState.view]);
  useEffect(() => {
    return;
  }, [requestRightPanelOpen, rightPanelState.view]);
  useEffect(() => {
    return;
  }, [requestRightPanelOpen, rightPanelState.view]);
  useEffect(() => {
    return;
  }, [rightPanelState.view]);
  useEffect(() => {
    setIsClientMounted(true);
  }, []);

  useEffect(() => {
    try {
      const storedCompanyId = window.localStorage.getItem("nexora.company_id");
      if (storedCompanyId && storedCompanyId !== activeCompanyId) {
        setActiveCompanyIdState(storedCompanyId);
      }

      const rawAutoBackup = window.localStorage.getItem(AUTO_BACKUP_KEY);
      if (rawAutoBackup === "true") {
        setAutoBackupEnabled(true);
      } else if (rawAutoBackup === "false") {
        setAutoBackupEnabled(false);
      }
    } catch {
      // ignore hydration sync errors
    }
  }, [activeCompanyId]);
  const [sourceLabel, setSourceLabel] = useState<string | null>(null);
  const [lastActions, setLastActions] = useState<any[]>([]);
  const [replaying, setReplaying] = useState(false);
  const [replayError, setReplayError] = useState<string | null>(null);
  const [healthInfo, setHealthInfo] = useState<string | null>(null);
  const [lastAnalysisSummary, setLastAnalysisSummary] = useState<string | null>(null);
  const [sceneWarn, setSceneWarn] = useState<string | null>(null);
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [memoryInsights, setMemoryInsights] = useState<any | null>(null);
  const [riskPropagation, setRiskPropagation] = useState<any | null>(null);
  const [strategicAdvice, setStrategicAdvice] = useState<any | null>(null);
  useEffect(() => {
    // Disabled legacy sync — controlled by explicit user actions only
    setProductModeId(activeDomainExperience.experience.preferredWorkspaceModeId);
  }, [
    activeDomainExperience,
  ]);
  const [strategyKpi, setStrategyKpi] = useState<any | null>(null);
  const [decisionCockpit, setDecisionCockpit] = useState<any | null>(null);
  const [productModeId, setProductModeId] = useState<string>(
    activeDomainExperience.experience.preferredWorkspaceModeId
  );
  const [productModeContext, setProductModeContext] = useState<any | null>(null);
  const [aiReasoning, setAiReasoning] = useState<any | null>(null);
  const [platformAssembly, setPlatformAssembly] = useState<any | null>(null);
  const [autonomousExploration, setAutonomousExploration] = useState<any | null>(null);
  const [opponentModel, setOpponentModel] = useState<any | null>(null);
  const [strategicPatterns, setStrategicPatterns] = useState<any | null>(null);
  const [responseData, setResponseData] = useState<any | null>(null);
  const [decisionResult, setDecisionResult] = useState<DecisionExecutionResult | null>(null);
  const [decisionExecutionLoading, setDecisionExecutionLoading] = useState(false);
  const [decisionUiState, setDecisionUiState] = useState<{
    status: "idle" | "loading" | "ready" | "error";
    mode: "simulate" | "compare" | "dashboard" | null;
    data: DecisionExecutionResult | null;
    error: string | null;
  }>({
    status: "idle",
    mode: "dashboard",
    data: null,
    error: null,
  });
  const activeExecutiveView =
    rightPanelState.view === "simulate" ||
    rightPanelState.view === "compare" ||
    rightPanelState.view === "dashboard"
      ? rightPanelState.view
      : null;
  const handleOpenDashboard = useCallback(() => {
    dispatchCanonicalAction(
      normalizeOpenPanelCta({
        view: "dashboard",
        rawSource: "handleOpenDashboard",
        source: "system",
        surface: "legacy_shell",
      })
    );
  }, [dispatchCanonicalAction]);
  const handleOpenObject = useCallback(
    (objectId?: string | null) => {
      const id = objectId != null ? String(objectId).trim() : "";
      if (id) {
        dispatchCanonicalAction(
          normalizeFocusObject({
            objectId: id,
            source: "panel_cta",
            surface: "sub_panel",
            rawSource: "handleOpenObject",
          })
        );
      } else {
        dispatchCanonicalAction(
          normalizeOpenPanelCta({
            view: "object",
            contextId: null,
            rawSource: "handleOpenObject:panel_only",
            source: "panel_cta",
            surface: "sub_panel",
          })
        );
      }
    },
    [dispatchCanonicalAction]
  );
  const handleCloseRightPanel = useCallback(() => {
    closeRightPanel();
  }, [closeRightPanel]);
  const [noSceneUpdate, setNoSceneUpdate] = useState(false);
  const [focusPinned, setFocusPinned] = useState(false);
  const [focusMode, setFocusMode] = useState<"all" | "selected">("all");
  const [focusOwnership, setFocusOwnership] = useState<FocusOwnershipState>({
    source: "none",
    objectId: null,
    isPersistent: false,
    reason: null,
  });
  const focusModeStore = useFocusMode();
  const pinnedId = usePinnedId();
  const activeLoopIdStore = useActiveLoopId();
  const focusActions = useFocusActions() as any;
  const applyFocusModeToStore = useCallback(
    (nextMode: "all" | "selected" | "pinned") => {
      if (typeof focusActions?.setFocusMode === "function") {
        focusActions.setFocusMode(nextMode);
      }
    },
    [focusActions]
  );
  const applyPinToStore = useCallback(
    (nextPinned: boolean, id: string | null) => {
      if (nextPinned && id && typeof focusActions?.pin === "function") {
        focusActions.pin(id);
        return;
      }
      if (typeof focusActions?.unpin === "function") {
        focusActions.unpin();
      }
    },
    [focusActions]
  );
  const setPinnedSafe = useCallback(
    (nextPinned: boolean, id: string | null) => {
      setFocusPinned(nextPinned);
      applyPinToStore(nextPinned, id);
    },
    [applyPinToStore]
  );
  const setFocusPinnedFromPanels = useCallback(
    (fn: (v: boolean) => boolean) => {
      setFocusPinned((prev) => {
        const next = fn(prev);
        applyPinToStore(next, focusedId ?? null);
        return next;
      });
    },
    [applyPinToStore, focusedId]
  );
  const [showAxes, setShowAxes] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [showCameraHelper, setShowCameraHelper] = useState(false);
  const [objectProfiles, setObjectProfiles] = useState<
    Record<
      string,
      {
        id: string;
        label: string;
        summary: string;
        tags: string[];
        one_liner?: string;
        synonyms?: string[];
        domain_hints?: Record<string, string[]>;
        ux?: { shape?: string; base_color?: string };
      }
    >
  >({});
  const [objectUxById, setObjectUxById] = useState<Record<string, { opacity?: number; scale?: number }>>({});
  const [selectedObjectInfo, setSelectedObjectInfo] = useState<ResolvedObjectDetails | null>(null);
  const [selectionLocked, setSelectionLocked] = useState(false);
  const claimFocusOwnership = useCallback((next: FocusOwnershipState) => {
    setFocusOwnership(next);
    if (process.env.NODE_ENV !== "production") {
      console.log("[Nexora][FocusOwnership] resolved", next);
    }
  }, []);
  const clearFocusOwnership = useCallback((reason?: string | null) => {
    setFocusOwnership({
      source: "none",
      objectId: null,
      isPersistent: false,
      reason: reason ?? null,
    });
    if (process.env.NODE_ENV !== "production") {
      console.log("[Nexora][FocusOwnership] cleared stale demo focus", { reason: reason ?? null });
    }
  }, []);
  const warRoom = useWarRoomState({
    selectedObjectId: selectedObjectIdState,
    sceneJson,
    responseData,
  });
  const handleDragStart = useCallback(() => {}, []);
  const handleDragEnd = useCallback(() => {}, []);
  const [prefs, setPrefs] = useState<ScenePrefs>(() => loadPrefsFromStorage() ?? defaultPrefs);

  useEffect(() => {
    const onPatch = (ev: Event) => {
      const detail = (ev as CustomEvent<Partial<ScenePrefs>>).detail;
      if (!detail || typeof detail !== "object") return;
      setPrefs((prev) => ({ ...prev, ...detail }));
    };
    window.addEventListener("nexora:scene-prefs-patch", onPatch as EventListener);
    return () => window.removeEventListener("nexora:scene-prefs-patch", onPatch as EventListener);
  }, []);

  const [isOrbiting, setIsOrbiting] = useState(false);
  const [cameraLockedByUser, setCameraLockedByUser] = useState(false);
  const [episodeId, setEpisodeId] = useState<string | null>(null);
  const [simRunning, setSimRunning] = useState(false);
  const [simSpeed, setSimSpeed] = useState(1);
  const [simLastError, setSimLastError] = useState<string | null>(null);
  const [kpi, setKpi] = useState<KPIState | null>(null);
  // --- Monte Carlo (HUD panel) ---
  const [mcLoading, setMcLoading] = useState(false);
  const [mcError, setMcError] = useState<string | null>(null);
  const [mcReport, setMcReport] = useState<any | null>(null);
  const [mcResult, setMcResult] = useState<any | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" && chatRequestStatus !== "idle") {
      console.debug("[Nexora][ChatLifecycle]", chatRequestStatus);
    }
  }, [chatRequestStatus]);

  useEffect(() => {
    if (rightPanelState.isOpen && rightPanelState.view === "war_room") {
      warRoom.openWarRoom();
    }
  }, [rightPanelState.isOpen, rightPanelState.view, warRoom.openWarRoom]);

  useEffect(() => {
    // Inspector PANEL is disabled; keep rail only. Do not auto-open.
  }, [selectedObjectIdState]);
  useEffect(() => {
    const fire = () => window.dispatchEvent(new Event("resize"));
    fire();
    requestAnimationFrame(fire);
  }, [inspectorOpen]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>(DEFAULT_WORKSPACE_ID);
  const [activeProjectId, setActiveProjectId] = useState<string>(DEFAULT_PROJECT_ID);
  const [workspaceProjects, setWorkspaceProjects] = useState<Record<string, WorkspaceProjectState>>({
    [DEFAULT_PROJECT_ID]: createEmptyProjectState(DEFAULT_PROJECT_ID, "Default Project"),
  });
  const [workspaceHydrated, setWorkspaceHydrated] = useState(false);
  const didAutoLoadDomainDemoRef = useRef(false);
  const environmentConfig = useMemo(() => {
    const env = resolveNexoraEnvironment({
      requested:
        (typeof process !== "undefined" && process.env.NEXT_PUBLIC_NEXORA_ENV) ||
        (typeof process !== "undefined" ? process.env.NODE_ENV : ""),
      mode_id: productModeId,
      node_env: typeof process !== "undefined" ? process.env.NODE_ENV : "",
    });
    return buildEnvironmentConfig({
      environment: env,
      mode_id: productModeId,
      company_id: activeCompanyId,
      node_env: typeof process !== "undefined" ? process.env.NODE_ENV : "",
    });
  }, [activeCompanyId, productModeId]);
  const emitDecisionTrace = useCallback(
    (event: Omit<DecisionTraceEvent, "timestamp">) => {
      if (!isFeatureEnabled(environmentConfig, "enable_trace_logging")) return;
      logDecisionTrace({
        ...event,
        timestamp: Date.now(),
      });
    },
    [environmentConfig]
  );
  const normalizeDecisionPayload = useCallback(
    (payload: unknown): {
      payload: any | null;
      validation: ValidationResult;
      recoveryActions: string[];
    } => {
      if (!payload || typeof payload !== "object") {
        const recovered = recoverFromFailure({
          payload: {},
          prompt:
            [...(messagesRef.current ?? [])]
              .reverse()
              .find((message) => message?.role === "user" && String(message?.text ?? "").trim())
              ?.text ?? null,
        });
        return {
          payload: enforceSafeDefaults(sanitizeDecisionPayload(recovered.recoveredPayload)),
          validation: {
            isValid: false,
            missing: ["canonical_recommendation", "decision_simulation", "executive_insight"],
            warnings: ["Decision payload is empty."],
          },
          recoveryActions: recovered.recoveryActions,
        };
      }

      const sanitized = guardHeavyComputation("sanitize_decision_payload", () =>
        sanitizeDecisionPayload(payload as Record<string, unknown>)
      );
      const defaultsApplied = enforceSafeDefaults(sanitized);
      const validation = validateDecisionPayload(defaultsApplied);

      if (!validation.isValid && isFeatureEnabled(environmentConfig, "strict_validation")) {
        const recovered = recoverFromFailure({
          payload: defaultsApplied,
          prompt:
            [...(messagesRef.current ?? [])]
              .reverse()
              .find((message) => message?.role === "user" && String(message?.text ?? "").trim())
              ?.text ?? null,
        });
        return {
          payload: enforceSafeDefaults(sanitizeDecisionPayload(recovered.recoveredPayload)),
          validation,
          recoveryActions: recovered.recoveryActions,
        };
      }

      return {
        payload: defaultsApplied,
        validation,
        recoveryActions: [],
      };
    },
    [environmentConfig]
  );
  const applyGuardedResponsePayload = useCallback(
    (
      nextPayload: unknown,
      stage: DecisionTraceEvent["stage"],
      summary: string,
      confidence?: number | null
    ) => {
      const normalized = normalizeDecisionPayload(nextPayload);
      emitDecisionTrace({
        stage,
        projectId: activeProjectId,
        confidence: confidence ?? null,
        summary,
        metadata: {
          validation_missing: normalized.validation.missing,
          validation_warnings: normalized.validation.warnings,
          recovery_actions: normalized.recoveryActions,
          payload_valid: normalized.validation.isValid,
        },
      });
      setResponseData(normalized.payload);
      return normalized.payload;
    },
    [activeProjectId, emitDecisionTrace, normalizeDecisionPayload]
  );
  const guardedResponseData = useMemo<any | null>(
    () => normalizeDecisionPayload(responseData).payload,
    [normalizeDecisionPayload, responseData]
  );
  const [visibleUiState, setVisibleUiState] = useState<{
    sceneJson: SceneJson | null;
    responseData: any | null;
    objectSelection: any | null;
    selectedObjectId: string | null;
    focusedId: string | null;
    conflicts: any[];
    memoryInsights: any | null;
    riskPropagation: any | null;
    strategicAdvice: any | null;
    decisionCockpit: any | null;
    opponentModel: any | null;
    strategicPatterns: any | null;
  }>({
    sceneJson: null,
    responseData: null,
    objectSelection: null,
    selectedObjectId: null,
    focusedId: null,
    conflicts: [],
    memoryInsights: null,
    riskPropagation: null,
    strategicAdvice: null,
    decisionCockpit: null,
    opponentModel: null,
    strategicPatterns: null,
  });
  useEffect(() => {
    const submitActive = loading || chatRequestStatus === "submitting";
    setVisibleUiState((prev) => {
      const nextSceneJson = hasRenderableSceneForVisibleState(sceneJson)
        ? sceneJson
        : submitActive
        ? prev.sceneJson
        : sceneJson;
      const nextResponseData = hasRenderableResponseForVisibleState(guardedResponseData)
        ? guardedResponseData
        : submitActive
        ? prev.responseData
        : guardedResponseData;
      const nextObjectSelection = hasMeaningfulSelectionForVisibleState(objectSelection)
        ? objectSelection
        : submitActive
        ? prev.objectSelection
        : !hasMeaningfulSelectionForVisibleState(prev.objectSelection) &&
            !hasMeaningfulSelectionForVisibleState(objectSelection)
        ? prev.objectSelection
        : objectSelection;
      const nextSelectedObjectId =
        typeof selectedObjectIdState === "string" && selectedObjectIdState.trim().length > 0
          ? selectedObjectIdState
          : submitActive
          ? prev.selectedObjectId
          : selectedObjectIdState ?? null;
      const nextFocusedId =
        typeof focusedId === "string" && focusedId.trim().length > 0
          ? focusedId
          : submitActive
          ? prev.focusedId
          : focusedId ?? null;
      const rawConflicts = Array.isArray(conflicts) ? conflicts : [];
      const nextConflicts =
        rawConflicts.length > 0
          ? conflicts
          : submitActive
          ? prev.conflicts
          : prev.conflicts.length === 0
          ? prev.conflicts
          : rawConflicts;
      const nextMemoryInsights =
        asRecord(memoryInsights) ? memoryInsights : submitActive ? prev.memoryInsights : memoryInsights;
      const nextRiskPropagation =
        asRecord(riskPropagation) ? riskPropagation : submitActive ? prev.riskPropagation : riskPropagation;
      const nextStrategicAdvice =
        asRecord(strategicAdvice) ? strategicAdvice : submitActive ? prev.strategicAdvice : strategicAdvice;
      const nextDecisionCockpit =
        asRecord(decisionCockpit) ? decisionCockpit : submitActive ? prev.decisionCockpit : decisionCockpit;
      const nextOpponentModel =
        asRecord(opponentModel) ? opponentModel : submitActive ? prev.opponentModel : opponentModel;
      const nextStrategicPatterns =
        asRecord(strategicPatterns) ? strategicPatterns : submitActive ? prev.strategicPatterns : strategicPatterns;

      const nextState = {
        sceneJson: nextSceneJson,
        responseData: nextResponseData,
        objectSelection: nextObjectSelection,
        selectedObjectId: nextSelectedObjectId,
        focusedId: nextFocusedId,
        conflicts: nextConflicts,
        memoryInsights: nextMemoryInsights,
        riskPropagation: nextRiskPropagation,
        strategicAdvice: nextStrategicAdvice,
        decisionCockpit: nextDecisionCockpit,
        opponentModel: nextOpponentModel,
        strategicPatterns: nextStrategicPatterns,
      };

      const unchanged =
        prev.sceneJson === nextState.sceneJson &&
        prev.responseData === nextState.responseData &&
        prev.objectSelection === nextState.objectSelection &&
        prev.selectedObjectId === nextState.selectedObjectId &&
        prev.focusedId === nextState.focusedId &&
        prev.conflicts === nextState.conflicts &&
        prev.memoryInsights === nextState.memoryInsights &&
        prev.riskPropagation === nextState.riskPropagation &&
        prev.strategicAdvice === nextState.strategicAdvice &&
        prev.decisionCockpit === nextState.decisionCockpit &&
        prev.opponentModel === nextState.opponentModel &&
        prev.strategicPatterns === nextState.strategicPatterns;

      if (process.env.NODE_ENV !== "production") {
        if (unchanged && submitActive) {
          console.log("[Nexora][ChatSubmit][PreserveVisibleState]", {
            hasResponseData: Boolean(prev.responseData),
            hasSceneJson: Boolean(prev.sceneJson),
            hasPanelData: Boolean(prev.responseData ?? prev.strategicAdvice ?? prev.riskPropagation),
            selectedObjectId: prev.selectedObjectId ?? null,
            panelView: rightPanelState.view ?? null,
            preserved: true,
          });
        } else if (!unchanged) {
          console.log("[Nexora][ChatSubmit][CommitNewVisibleState]", {
            hasResponseData: Boolean(nextState.responseData),
            hasSceneJson: Boolean(nextState.sceneJson),
            hasPanelData: Boolean(nextState.responseData ?? nextState.strategicAdvice ?? nextState.riskPropagation),
            selectedObjectId: nextState.selectedObjectId ?? null,
            panelView: rightPanelState.view ?? null,
            preserved: false,
          });
        } else if (!hasRenderableResponseForVisibleState(guardedResponseData) && !hasRenderableSceneForVisibleState(sceneJson)) {
          console.log("[Nexora][ChatSubmit][RejectedTransientState]", {
            hasResponseData: Boolean(guardedResponseData),
            hasSceneJson: Boolean(sceneJson),
            hasPanelData: Boolean(strategicAdvice ?? riskPropagation),
            selectedObjectId: selectedObjectIdState ?? null,
            panelView: rightPanelState.view ?? null,
          });
        }
      }

      return unchanged ? prev : nextState;
    });
  }, [
    chatRequestStatus,
    conflicts,
    decisionCockpit,
    focusedId,
    guardedResponseData,
    loading,
    memoryInsights,
    objectSelection,
    opponentModel,
    rightPanelState.view,
    riskPropagation,
    sceneJson,
    selectedObjectIdState,
    strategicAdvice,
    strategicPatterns,
  ]);
  const visibleSceneJson = visibleUiState.sceneJson;
  const visibleResponseData = visibleUiState.responseData;
  const visibleObjectSelection = visibleUiState.objectSelection;
  const visibleSelectedObjectId = visibleUiState.selectedObjectId;
  const visibleFocusedId = visibleUiState.focusedId;
  const visibleConflicts = visibleUiState.conflicts;
  const visibleMemoryInsights = visibleUiState.memoryInsights;
  const visibleRiskPropagation = visibleUiState.riskPropagation;
  const visibleStrategicAdvice = visibleUiState.strategicAdvice;
  const visibleDecisionCockpit = visibleUiState.decisionCockpit;
  const visibleOpponentModel = visibleUiState.opponentModel;
  const visibleStrategicPatterns = visibleUiState.strategicPatterns;
  useEffect(() => {
    if (!guardedResponseData) return;
    emitDecisionTrace({
      stage: "pipeline_complete",
      projectId: activeProjectId,
      confidence:
        typeof guardedResponseData?.canonical_recommendation?.confidence?.score === "number"
          ? guardedResponseData.canonical_recommendation.confidence.score
          : typeof guardedResponseData?.decision_confidence === "number"
            ? guardedResponseData.decision_confidence
            : null,
      summary: "Decision pipeline completed with a usable payload.",
      metadata: {
        safe_mode: Boolean(guardedResponseData?.safe_mode),
        has_recommendation: Boolean(guardedResponseData?.canonical_recommendation),
        has_simulation: Boolean(guardedResponseData?.decision_simulation),
        has_executive_summary: Boolean(guardedResponseData?.executive_summary_surface),
      },
    });
  }, [activeProjectId, emitDecisionTrace, guardedResponseData]);
  const projectHydratingRef = useRef<boolean>(false);
  const autonomousExploreSignatureRef = useRef<Record<string, string>>({});
  const buildExplorationSceneSignature = useCallback((nextScene: SceneJson | null): string => {
    const objects = Array.isArray(nextScene?.scene?.objects) ? nextScene.scene.objects : [];
    if (!objects.length) return "";
    const relations = Array.isArray(nextScene?.scene?.relations) ? nextScene.scene.relations : [];
    const loops = Array.isArray(nextScene?.scene?.loops) ? nextScene.scene.loops : [];
    const objectIds = objects
      .map((obj: any) => String(obj?.id ?? obj?.label ?? "").trim())
      .filter(Boolean)
      .sort();
    return JSON.stringify({
      object_ids: objectIds,
      relation_count: relations.length,
      loop_count: loops.length,
    });
  }, []);
  const projectId = activeProjectId;

  useEffect(() => {
    const nextEntries = loadDecisionMemoryEntries(activeWorkspaceId, activeProjectId);
    setDecisionMemoryEntries(nextEntries);
    decisionMemorySignatureRef.current = "";
  }, [activeWorkspaceId, activeProjectId]);

  useEffect(() => {
    const prompt =
      [...(messagesRef.current ?? [])]
        .reverse()
        .find((message) => message?.role === "user" && String(message?.text ?? "").trim())?.text ?? null;
    const entry = buildDecisionMemoryEntry({
      responseData,
      prompt,
      workspaceId: activeWorkspaceId,
      projectId: activeProjectId,
    });
    if (!entry) return;

    const signature = [
      entry.title,
      entry.recommendation_action ?? "",
      entry.impact_summary ?? "",
      entry.compare_summary ?? "",
      entry.snapshot_ref?.scenario_id ?? "",
    ].join("|");

    if (decisionMemorySignatureRef.current === signature) return;
    decisionMemorySignatureRef.current = signature;

    setDecisionMemoryEntries((current) =>
      appendDecisionMemoryEntry({
        workspaceId: activeWorkspaceId,
        projectId: activeProjectId,
        entry,
        existing: current,
      })
    );
  }, [responseData, activeWorkspaceId, activeProjectId]);
  // =====================
  // LOOPS ENGINE (7.1)
  // Source of truth: loops + activeLoopId + selectedLoopId
  // Derived: effectiveActiveLoopId, visibleLoops
  // =====================
  const [loops, setLoops] = useState<SceneLoop[]>([]);
  const [showLoops, setShowLoops] = useState(true);
  const [showLoopLabels, setShowLoopLabels] = useState(false);
  const extractConflicts = useCallback((payload: any): any[] => {
    if (Array.isArray(payload?.conflicts)) return payload.conflicts;
    if (Array.isArray(payload?.scene_json?.scene?.conflicts)) return payload.scene_json.scene.conflicts;
    if (Array.isArray(payload?.scene?.conflicts)) return payload.scene.conflicts;
    return [];
  }, []);
  const extractObjectSelection = useCallback((payload: any): any | null => {
    if (payload?.object_selection && typeof payload.object_selection === "object") return payload.object_selection;
    if (payload?.context?.object_selection && typeof payload.context.object_selection === "object") return payload.context.object_selection;
    if (payload?.scene_json?.object_selection && typeof payload.scene_json.object_selection === "object") return payload.scene_json.object_selection;
    return null;
  }, []);
  const extractMemoryV2 = useCallback((payload: any): any | null => {
    if (payload?.memory_v2 && typeof payload.memory_v2 === "object") return payload.memory_v2;
    if (payload?.context?.memory_v2 && typeof payload.context.memory_v2 === "object") return payload.context.memory_v2;
    if (payload?.scene_json?.memory_v2 && typeof payload.scene_json.memory_v2 === "object") return payload.scene_json.memory_v2;
    return null;
  }, []);
  const extractRiskPropagation = useCallback((payload: any): any | null => {
    if (payload?.risk_propagation && typeof payload.risk_propagation === "object") return payload.risk_propagation;
    if (payload?.context?.risk_propagation && typeof payload.context.risk_propagation === "object") return payload.context.risk_propagation;
    if (payload?.scene_json?.risk_propagation && typeof payload.scene_json.risk_propagation === "object") return payload.scene_json.risk_propagation;
    if (payload?.scene_json?.scene?.risk_propagation && typeof payload.scene_json.scene.risk_propagation === "object") return payload.scene_json.scene.risk_propagation;
    return null;
  }, []);
  const extractStrategicAdvice = useCallback((payload: any): any | null => {
    if (payload?.strategic_advice && typeof payload.strategic_advice === "object") return payload.strategic_advice;
    if (payload?.context?.strategic_advice && typeof payload.context.strategic_advice === "object") return payload.context.strategic_advice;
    if (payload?.scene_json?.strategic_advice && typeof payload.scene_json.strategic_advice === "object") return payload.scene_json.strategic_advice;
    if (payload?.scene_json?.scene?.strategic_advice && typeof payload.scene_json.scene.strategic_advice === "object") return payload.scene_json.scene.strategic_advice;
    return null;
  }, []);
  const extractStrategyKpi = useCallback((payload: any): any | null => {
    if (payload?.strategy_kpi && typeof payload.strategy_kpi === "object") return payload.strategy_kpi;
    if (payload?.context?.strategy_kpi && typeof payload.context.strategy_kpi === "object") return payload.context.strategy_kpi;
    if (payload?.prompt_feedback?.strategy_kpi && typeof payload.prompt_feedback.strategy_kpi === "object") {
      return payload.prompt_feedback.strategy_kpi;
    }
    if (payload?.scene_json?.strategy_kpi && typeof payload.scene_json.strategy_kpi === "object") return payload.scene_json.strategy_kpi;
    return null;
  }, []);
  const extractDecisionCockpit = useCallback((payload: any): any | null => {
    if (payload?.decision_cockpit && typeof payload.decision_cockpit === "object") return payload.decision_cockpit;
    if (payload?.context?.decision_cockpit && typeof payload.context.decision_cockpit === "object") {
      return payload.context.decision_cockpit;
    }
    if (payload?.prompt_feedback?.decision_cockpit && typeof payload.prompt_feedback.decision_cockpit === "object") {
      return payload.prompt_feedback.decision_cockpit;
    }
    if (payload?.scene_json?.decision_cockpit && typeof payload.scene_json.decision_cockpit === "object") {
      return payload.scene_json.decision_cockpit;
    }
    return null;
  }, []);
  const extractProductModeContext = useCallback((payload: any): any | null => {
    if (payload?.product_mode && typeof payload.product_mode === "object") return payload.product_mode;
    if (payload?.context?.product_mode && typeof payload.context.product_mode === "object") return payload.context.product_mode;
    if (payload?.decision_cockpit?.mode && typeof payload.decision_cockpit.mode === "object") return payload.decision_cockpit.mode;
    return null;
  }, []);
  const extractAiReasoning = useCallback((payload: any): any | null => {
    if (payload?.ai_reasoning && typeof payload.ai_reasoning === "object") return payload.ai_reasoning;
    if (payload?.context?.ai_reasoning && typeof payload.context.ai_reasoning === "object") return payload.context.ai_reasoning;
    if (payload?.prompt_feedback?.reasoning && typeof payload.prompt_feedback.reasoning === "object") {
      return payload.prompt_feedback.reasoning;
    }
    return null;
  }, []);
  const extractPlatformAssembly = useCallback((payload: any): any | null => {
    if (payload?.platform_assembly && typeof payload.platform_assembly === "object") return payload.platform_assembly;
    if (payload?.context?.platform_assembly && typeof payload.context.platform_assembly === "object") {
      return payload.context.platform_assembly;
    }
    if (payload?.prompt_feedback?.platform_assembly && typeof payload.prompt_feedback.platform_assembly === "object") {
      return payload.prompt_feedback.platform_assembly;
    }
    return null;
  }, []);
  const extractAutonomousExploration = useCallback((payload: any): any | null => {
    if (payload?.autonomous_exploration && typeof payload.autonomous_exploration === "object") {
      return payload.autonomous_exploration;
    }
    if (payload?.context?.autonomous_exploration && typeof payload.context.autonomous_exploration === "object") {
      return payload.context.autonomous_exploration;
    }
    if (
      payload?.prompt_feedback?.autonomous_exploration &&
      typeof payload.prompt_feedback.autonomous_exploration === "object"
    ) {
      return payload.prompt_feedback.autonomous_exploration;
    }
    return null;
  }, []);
  const extractOpponentModel = useCallback((payload: any): any | null => {
    if (payload?.opponent_model && typeof payload.opponent_model === "object") return payload.opponent_model;
    if (payload?.context?.opponent_model && typeof payload.context.opponent_model === "object") return payload.context.opponent_model;
    if (payload?.scene_json?.opponent_model && typeof payload.scene_json.opponent_model === "object") return payload.scene_json.opponent_model;
    if (payload?.scene_json?.scene?.opponent_model && typeof payload.scene_json.scene.opponent_model === "object") return payload.scene_json.scene.opponent_model;
    return null;
  }, []);
  const extractStrategicPatterns = useCallback((payload: any): any | null => {
    if (payload?.strategic_patterns && typeof payload.strategic_patterns === "object") return payload.strategic_patterns;
    if (payload?.context?.strategic_patterns && typeof payload.context.strategic_patterns === "object") return payload.context.strategic_patterns;
    if (payload?.scene_json?.strategic_patterns && typeof payload.scene_json.strategic_patterns === "object") return payload.scene_json.strategic_patterns;
    if (payload?.scene_json?.scene?.strategic_patterns && typeof payload.scene_json.scene.strategic_patterns === "object") return payload.scene_json.scene.strategic_patterns;
    return null;
  }, []);
  const ensureBackendUserId = useCallback((): string => {
    let userId: string | null = readSessionIdForPersistence();
    if (!userId && process.env.NODE_ENV !== "production") {
      const newUserId = `dev-${Math.random().toString(36).slice(2, 10)}`;
      userId = newUserId;
      try {
        window.localStorage.setItem(SESSION_KEY, newUserId);
      } catch {
        // ignore
      }
    }
    return userId ?? `anon-${Math.random().toString(36).slice(2, 10)}`;
  }, []);
  const buildChatRequestPayload = useCallback(
    (text: string): Record<string, any> => {
      const payload: Record<string, any> = {
        text,
        user_id: ensureBackendUserId(),
        mode: activeMode,
        episode_id: episodeId,
      };
      if (focusMode === "selected" && focusedId) {
        payload.allowed_objects = [String(focusedId)];
      }
      return payload;
    },
    [activeMode, ensureBackendUserId, episodeId, focusMode, focusedId]
  );
  const deriveProductFlowViewModel = useCallback(
    (payload: BackendChatResponse, fallbackScene: SceneJson | null) => {
      const sceneInner = asRecord(asRecord(payload.scene_json)?.["scene"]);
      const nextSceneJson: SceneJson | null =
        payload.scene_json != null && typeof payload.scene_json === "object" && !Array.isArray(payload.scene_json)
          ? normalizeSceneJson(payload.scene_json)
          : fallbackScene;
      const nextKpi = sceneInner?.["kpi"] ?? null;
      const baseLoops = normalizeLoops(sceneInner?.["loops"]);
      const sceneObjects =
        nextSceneJson && Array.isArray(nextSceneJson.scene?.objects) ? nextSceneJson.scene.objects : [];
      const nextLoops = resolveLoopPlaceholders(baseLoops, sceneObjects);
      const nextActiveLoop = readSceneJsonActiveLoop(payload.scene_json) || null;
      const suggestionsRaw = sceneInner?.["loops_suggestions"];
      return {
        nextSceneJson,
        nextKpi,
        nextLoops,
        nextActiveLoop,
        nextLoopSuggestions: Array.isArray(suggestionsRaw)
          ? (suggestionsRaw as string[]).filter((s): s is string => typeof s === "string")
          : [],
        nextConflicts: extractConflicts(payload),
        nextObjectSelection: extractObjectSelection(payload),
        nextMemoryInsights: extractMemoryV2(payload),
        nextRiskPropagation: extractRiskPropagation(payload),
        nextStrategicAdvice: extractStrategicAdvice(payload),
        nextStrategyKpi: extractStrategyKpi(payload),
        nextDecisionCockpit: extractDecisionCockpit(payload),
        nextProductModeContext: extractProductModeContext(payload),
        nextAiReasoning: extractAiReasoning(payload),
        nextPlatformAssembly: extractPlatformAssembly(payload),
        nextAutonomousExploration: extractAutonomousExploration(payload),
        nextOpponentModel: extractOpponentModel(payload),
        nextStrategicPatterns: extractStrategicPatterns(payload),
      };
    },
    [
      extractAiReasoning,
      extractAutonomousExploration,
      extractConflicts,
      extractDecisionCockpit,
      extractMemoryV2,
      extractObjectSelection,
      extractOpponentModel,
      extractPlatformAssembly,
      extractProductModeContext,
      extractRiskPropagation,
      extractStrategicAdvice,
      extractStrategicPatterns,
      extractStrategyKpi,
    ]
  );
  const applyActions = useCallback(
    (actions: any[] | undefined | null) => {
      const list = Array.isArray(actions) ? actions : [];
      setLastActions(list);
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.debug("[actions]", list.length);
      }
      if (!list.length) return;

      const applyObjectPatch = (id: string, patch: Record<string, any>) => {
        if (!id || typeof id !== "string") return;
        const safePatch: Record<string, any> = {};
        if (patch.color && typeof patch.color === "string") safePatch.color = patch.color;
        if (typeof patch.visible === "boolean") safePatch.visible = patch.visible;
        if (Array.isArray(patch.position) && patch.position.length === 3) {
          const nums = patch.position.map((n: any) => Number(n));
          if (nums.every((n) => Number.isFinite(n))) safePatch.position = [nums[0], nums[1], nums[2]];
        }
        if (Number.isFinite(patch.scale)) safePatch.scale = clamp(Number(patch.scale), 0.2, 2.0);
        if (Number.isFinite(patch.intensity)) {
          const intensity = clamp(Number(patch.intensity), 0, 1);
          safePatch.scale = 0.5 + intensity;
        }
        if (Object.keys(safePatch).length > 0) {
          setOverrideRef.current?.(id, safePatch);
        }
      };

      list.forEach((action) => {
        try {
          if (!action || typeof action !== "object") return;
          // Replay wrapper (backend stores: { object: "obj_123", type:"applyObject", value: {...} })
          if (action.type === "applyObject") {
            const objUpdate = action.value ?? action.object ?? null;
            const id = action.object ?? objUpdate?.id ?? objUpdate?.target_id ?? objUpdate?.targetId;
            if (id) applyObjectPatch(String(id), objUpdate ?? {});
            return;
          }
          // Backend scene_actions object updates
          if (
            action.id &&
            (action.color || action.position || action.visible !== undefined || action.scale !== undefined || action.intensity !== undefined)
          ) {
            applyObjectPatch(String(action.id), action);
            return;
          }
          // Legacy
          const target = action?.object ?? action?.target_id ?? action?.targetId;
          if (!target) return;
          const type = (action?.type || action?.verb || "").toLowerCase();
          if (type === "setcolor" && action.color) {
            applyObjectPatch(String(target), { color: action.color });
          } else if (type === "hide") {
            applyObjectPatch(String(target), { visible: false });
          } else if (type === "reveal") {
            applyObjectPatch(String(target), { visible: true });
          } else if (type === "setposition" && Array.isArray(action.position) && action.position.length === 3) {
            applyObjectPatch(String(target), { position: action.position });
          } else if (type === "setintensity") {
            applyObjectPatch(String(target), { intensity: action.intensity });
          } else if (type === "pulse") {
            const intensity = clamp(Number(action.intensity ?? 0.4), 0, 1);
            applyObjectPatch(String(target), { scale: 1 + intensity * 0.4 });
          } else if (type === "highlight") {
            const color = typeof action.color === "string" ? action.color : "#ffd166";
            applyObjectPatch(String(target), { color, scale: 1.1 });
          }
        } catch {
          // skip malformed action
        }
      });
    },
    []
  );
  const applyProductFlowViewModel = useCallback(
    (
      payload: BackendChatResponse,
      viewModel: ReturnType<typeof deriveProductFlowViewModel>,
      options?: {
        applyActionsToScene?: boolean;
        syncSceneState?: boolean;
        applyVisualState?: boolean;
      }
    ) => {
      const shouldApplyVisualState = options?.applyVisualState !== false;
      if (process.env.NODE_ENV !== "production") {
        console.log("[Nexora][HomeScreen][PanelStateTransition]", {
          phase: "apply_product_flow_view_model",
          panelView: rightPanelState.view ?? null,
          hasVisiblePanelState: Boolean(
            visibleResponseData ?? visibleStrategicAdvice ?? visibleDecisionCockpit ?? visibleRiskPropagation
          ),
          hasVisibleSceneState: Boolean(visibleSceneJson),
        });
      }
      const shouldAcceptKpi = shouldAcceptMeaningfulRecordReplacement(viewModel.nextKpi, kpi);
      const shouldAcceptConflicts = shouldAcceptMeaningfulArrayReplacement(viewModel.nextConflicts, conflicts);
      const shouldAcceptObjectSelection = shouldApplyVisualState
        ? hasMeaningfulSelectionForVisibleState(viewModel.nextObjectSelection) ||
          !hasMeaningfulSelectionForVisibleState(visibleObjectSelection)
        : false;
      const shouldAcceptRiskPropagation = shouldApplyVisualState
        ? shouldAcceptMeaningfulRecordReplacement(viewModel.nextRiskPropagation, visibleRiskPropagation)
        : false;
      const shouldAcceptMemoryInsights = shouldAcceptMeaningfulRecordReplacement(viewModel.nextMemoryInsights, visibleMemoryInsights);
      const shouldAcceptStrategicAdvice = shouldAcceptMeaningfulRecordReplacement(viewModel.nextStrategicAdvice, visibleStrategicAdvice);
      const shouldAcceptStrategyKpi = shouldAcceptMeaningfulRecordReplacement(viewModel.nextStrategyKpi, strategyKpi);
      const shouldAcceptDecisionCockpit = shouldAcceptMeaningfulRecordReplacement(viewModel.nextDecisionCockpit, visibleDecisionCockpit);
      const shouldAcceptProductModeContext = shouldAcceptMeaningfulRecordReplacement(
        viewModel.nextProductModeContext,
        productModeContext
      );
      const shouldAcceptAiReasoning = shouldAcceptMeaningfulRecordReplacement(viewModel.nextAiReasoning, aiReasoning);
      const shouldAcceptPlatformAssembly = shouldAcceptMeaningfulRecordReplacement(
        viewModel.nextPlatformAssembly,
        platformAssembly
      );
      const shouldAcceptAutonomousExploration = shouldAcceptMeaningfulRecordReplacement(
        viewModel.nextAutonomousExploration,
        autonomousExploration
      );
      const shouldAcceptOpponentModel = shouldAcceptMeaningfulRecordReplacement(
        viewModel.nextOpponentModel,
        visibleOpponentModel
      );
      const shouldAcceptStrategicPatterns = shouldAcceptMeaningfulRecordReplacement(
        viewModel.nextStrategicPatterns,
        visibleStrategicPatterns
      );
      const shouldAcceptLoops = shouldApplyVisualState
        ? shouldAcceptMeaningfulArrayReplacement(viewModel.nextLoops, loops)
        : false;

      if (process.env.NODE_ENV !== "production") {
        console.log("[Nexora][HomeScreen][MeaningfulReplacementAccepted]", {
          panelView: rightPanelState.view ?? null,
          accepted: {
            kpi: shouldAcceptKpi,
            conflicts: shouldAcceptConflicts,
            objectSelection: shouldAcceptObjectSelection,
            riskPropagation: shouldAcceptRiskPropagation,
            memoryInsights: shouldAcceptMemoryInsights,
            strategicAdvice: shouldAcceptStrategicAdvice,
            decisionCockpit: shouldAcceptDecisionCockpit,
            loops: shouldAcceptLoops,
          },
        });
        if (
          !shouldAcceptConflicts ||
          (shouldApplyVisualState && (!shouldAcceptObjectSelection || !shouldAcceptRiskPropagation || !shouldAcceptLoops)) ||
          !shouldAcceptMemoryInsights ||
          !shouldAcceptStrategicAdvice ||
          !shouldAcceptDecisionCockpit
        ) {
          console.warn("[Nexora][HomeScreen][DestructiveResetBlocked]", {
            panelView: rightPanelState.view ?? null,
            blocked: {
              conflicts: !shouldAcceptConflicts,
              objectSelection: shouldApplyVisualState ? !shouldAcceptObjectSelection : false,
              riskPropagation: shouldApplyVisualState ? !shouldAcceptRiskPropagation : false,
              memoryInsights: !shouldAcceptMemoryInsights,
              strategicAdvice: !shouldAcceptStrategicAdvice,
              decisionCockpit: !shouldAcceptDecisionCockpit,
              loops: shouldApplyVisualState ? !shouldAcceptLoops : false,
            },
          });
        }
      }

      setKpi((prev: KPIState | null) => (shouldAcceptKpi ? viewModel.nextKpi : prev));
      setConflicts((prev: typeof conflicts) => (shouldAcceptConflicts ? viewModel.nextConflicts : prev));
      if (shouldApplyVisualState) {
        setObjectSelection((prev: typeof objectSelection) =>
          shouldAcceptObjectSelection ? viewModel.nextObjectSelection : prev
        );
        setRiskPropagation((prev: typeof riskPropagation) =>
          shouldAcceptRiskPropagation ? viewModel.nextRiskPropagation : prev
        );
      }
      setMemoryInsights((prev: typeof memoryInsights) =>
        shouldAcceptMemoryInsights ? viewModel.nextMemoryInsights : prev
      );
      setStrategicAdvice((prev: typeof strategicAdvice) =>
        shouldAcceptStrategicAdvice ? viewModel.nextStrategicAdvice : prev
      );
      setStrategyKpi((prev: typeof strategyKpi) => (shouldAcceptStrategyKpi ? viewModel.nextStrategyKpi : prev));
      setDecisionCockpit((prev: typeof decisionCockpit) =>
        shouldAcceptDecisionCockpit ? viewModel.nextDecisionCockpit : prev
      );
      setProductModeContext((prev: typeof productModeContext) =>
        shouldAcceptProductModeContext ? viewModel.nextProductModeContext : prev
      );
      if (viewModel.nextProductModeContext?.mode_id) {
        setProductModeId(String(viewModel.nextProductModeContext.mode_id));
      }
      setAiReasoning((prev: typeof aiReasoning) => (shouldAcceptAiReasoning ? viewModel.nextAiReasoning : prev));
      setPlatformAssembly((prev: typeof platformAssembly) =>
        shouldAcceptPlatformAssembly ? viewModel.nextPlatformAssembly : prev
      );
      setAutonomousExploration((prev: typeof autonomousExploration) =>
        shouldAcceptAutonomousExploration ? viewModel.nextAutonomousExploration : prev
      );
      setOpponentModel((prev: typeof opponentModel) => (shouldAcceptOpponentModel ? viewModel.nextOpponentModel : prev));
      setStrategicPatterns((prev: typeof strategicPatterns) =>
        shouldAcceptStrategicPatterns ? viewModel.nextStrategicPatterns : prev
      );
      if (shouldApplyVisualState) {
        setLoops((prev: SceneLoop[]) => (shouldAcceptLoops ? viewModel.nextLoops : prev));
        if (shouldAcceptLoops || viewModel.nextActiveLoop != null) {
          setActiveLoopId(viewModel.nextActiveLoop ?? null);
        }
        setLoopSuggestions((prev: string[]) =>
          shouldAcceptMeaningfulArrayReplacement(viewModel.nextLoopSuggestions, prev)
            ? viewModel.nextLoopSuggestions
            : prev
        );
      }
      if (options?.syncSceneState !== false && viewModel.nextSceneJson && hasForcedSceneUpdate(payload, viewModel.nextSceneJson)) {
        const sceneDecision = evaluateProductFlowForcedScene(viewModel.nextSceneJson, payload);
        if (isSceneCanonReplaceDecision(sceneDecision)) {
          if (process.env.NODE_ENV !== "production") {
            console.log("[Nexora][HomeScreen][SceneStateTransition]", {
              phase: "scene_replacement_committed",
              panelView: rightPanelState.view ?? null,
              hasPreviousScene: Boolean(visibleSceneJson),
              contractDecision: sceneDecision.kind,
            });
          }
          setSceneJson(sceneDecision.scene);
          setNoSceneUpdate(false);
        } else {
          if (process.env.NODE_ENV !== "production") {
            console.log("[Nexora][HomeScreen][SceneStateTransition]", {
              phase: "scene_replacement_contract_rejected",
              panelView: rightPanelState.view ?? null,
              contractReason: sceneDecision.reason,
            });
          }
          setNoSceneUpdate(true);
        }
      } else if (options?.syncSceneState !== false) {
        if (process.env.NODE_ENV !== "production") {
          console.log("[Nexora][HomeScreen][SceneStateTransition]", {
            phase: "scene_replacement_deferred",
            panelView: rightPanelState.view ?? null,
            hasPreviousScene: Boolean(visibleSceneJson),
            hasNextScene: Boolean(viewModel.nextSceneJson),
          });
        }
        setNoSceneUpdate(true);
      }
      setSourceLabel((payload as any)?.source ?? null);
      setLastAnalysisSummary((payload as any)?.analysis_summary ?? null);
      if (options?.applyActionsToScene !== false) {
        try {
          applyActions((payload as any)?.actions);
          setSceneWarn(null);
        } catch {
          setSceneWarn("⚠️ Could not apply scene actions (dev).");
        }
      } else {
        setSceneWarn(null);
      }
    },
    [
      aiReasoning,
      applyActions,
      autonomousExploration,
      conflicts,
      kpi,
      loops,
      platformAssembly,
      productModeContext,
      rightPanelState.view,
      strategyKpi,
      visibleDecisionCockpit,
      visibleMemoryInsights,
      visibleObjectSelection,
      visibleOpponentModel,
      visibleResponseData,
      visibleRiskPropagation,
      visibleSceneJson,
      visibleStrategicAdvice,
      visibleStrategicPatterns,
    ]
  );
  const instanceLabelMap = useMemo(() => {
    const list = Array.isArray(config?.instances) ? config?.instances : [];
    const map: Record<string, string> = {};
    list.forEach((inst: any) => {
      if (inst && typeof inst.id === "string" && typeof inst.label === "string") {
        map[inst.id] = inst.label;
      }
    });
    return map;
  }, [config]);
  const typeLabelMap = useMemo(() => {
    const types = config?.types && typeof config.types === "object" ? config.types : {};
    const map: Record<string, string> = {};
    Object.entries(types).forEach(([key, entry]) => {
      if (entry && typeof (entry as any).label === "string") {
        map[key] = (entry as any).label;
      }
    });
    return map;
  }, [config]);
  const resolveSceneObjectLabel = useCallback(
    (id: string | null | undefined) => {
      if (!id) return null;
      return resolveSceneObjectById(visibleSceneJson, id)?.label ?? null;
    },
    [visibleSceneJson]
  );
  const resolveObjectLabel = useCallback(
    (id: string) => resolveSceneObjectLabel(id) ?? objectProfiles[id]?.label ?? instanceLabelMap[id] ?? id,
    [instanceLabelMap, objectProfiles, resolveSceneObjectLabel]
  );
  const resolveTypeLabel = useCallback(
    (id: string) => typeLabelMap[id] ?? id,
    [typeLabelMap]
  );
  const highlightedObjectIdSet = useMemo(() => {
    const ids = Array.isArray(visibleObjectSelection?.highlighted_objects)
      ? visibleObjectSelection.highlighted_objects
      : [];
    return new Set((ids as any[]).filter((x) => typeof x === "string") as string[]);
  }, [visibleObjectSelection]);
  const riskSourceObjectIdSet = useMemo(() => {
    const ids = Array.isArray(visibleRiskPropagation?.sources) ? visibleRiskPropagation.sources : [];
    return new Set((ids as any[]).filter((x) => typeof x === "string") as string[]);
  }, [visibleRiskPropagation]);
  const getUxForObject = useCallback(
    (id: string) => {
      const sceneObjects = Array.isArray(visibleSceneJson?.scene?.objects) ? visibleSceneJson.scene.objects : [];
      const sceneObject = sceneObjects.find((entry: any) => String(entry?.id ?? entry?.name ?? "") === id) ?? null;
      const profileUx = objectProfiles[id]?.ux;
      const localUx = objectUxById[id];
      if (!profileUx && !localUx && !sceneObject?.scanner_highlighted && !sceneObject?.scanner_focus) return null;
      const merged: any = { ...(profileUx ?? {}), ...(localUx ?? {}) };
      if (highlightedObjectIdSet.has(id)) {
        const baseScale = typeof merged.scale === "number" ? merged.scale : 1;
        merged.scale = clamp(baseScale + 0.25, 0.2, 2.0);
      }
      if (riskSourceObjectIdSet.has(id)) {
        const baseScale = typeof merged.scale === "number" ? merged.scale : 1;
        merged.scale = clamp(baseScale + 0.15, 0.2, 2.0);
      }
      if (sceneObject?.scanner_highlighted) {
        const scannerEmphasis = Number(sceneObject?.scanner_emphasis ?? sceneObject?.emphasis ?? 0.75);
        const baseScale = typeof merged.scale === "number" ? merged.scale : 1;
        merged.scale = clamp(baseScale + 0.18 + Math.min(0.18, scannerEmphasis * 0.18), 0.2, 2.0);
        merged.opacity = Math.max(0.92, typeof merged.opacity === "number" ? merged.opacity : 0.9);
      }
      if (sceneObject?.scanner_focus) {
        const baseScale = typeof merged.scale === "number" ? merged.scale : 1;
        merged.scale = clamp(baseScale + 0.14, 0.2, 2.0);
        merged.opacity = 1;
      }
      return merged;
    },
    [highlightedObjectIdSet, objectProfiles, objectUxById, riskSourceObjectIdSet, visibleSceneJson]
  );
  const resolveSelectedObjectDetails = useCallback(
    (id: string | null) => {
      if (!id) return null;
      const details = composeResolvedObjectDetails({
        objectId: id,
        scene: visibleSceneJson,
        cachedProfile: objectProfiles[id] ?? null,
        ux: getUxForObject(id),
        override: overridesRef.current[id],
        fallbackLabel: objectProfiles[id]?.label ?? instanceLabelMap[id] ?? id,
      });
      if (process.env.NODE_ENV !== "production") {
        console.debug(
          details.resolved ? "[Nexora][ObjectResolver] resolved" : "[Nexora][ObjectResolver] target outside current scene",
          { objectId: id, label: details.label }
        );
      }
      return details;
    },
    [getUxForObject, instanceLabelMap, objectProfiles, visibleSceneJson]
  );
  const updateSelectedObjectInfo = useCallback(
    (id: string | null) => {
      setSelectedObjectInfo(resolveSelectedObjectDetails(id));
    },
    [resolveSelectedObjectDetails]
  );
  const tracePostSuccessContextDecision = useCallback(
    (
      label:
        | "[Nexora][ContextGuardBlocked]"
        | "[Nexora][PostSuccessContextAccepted]"
        | "[Nexora][PostSuccessContextPreserved]",
      detail: {
        currentTargetId?: string | null;
        nextTargetId?: string | null;
        source: "demoFlow" | "narrative" | "objectResolver" | "chatSuccess" | "focus";
        targetInScene: boolean;
        preserved?: boolean;
      }
    ) => {
      if (process.env.NODE_ENV === "production") return;
      console.log(label, {
        currentView: rightPanelState.view ?? null,
        currentTargetId: detail.currentTargetId ?? null,
        nextTargetId: detail.nextTargetId ?? null,
        targetInScene: detail.targetInScene,
        source: detail.source,
        preserved: detail.preserved === true,
      });
      if (label === "[Nexora][ContextGuardBlocked]" || label === "[Nexora][PostSuccessContextPreserved]") {
        emitDebugEvent({
          type: "post_success_invalidation",
          layer: "post_success",
          source: "HomeScreen",
          status: "warn",
          message: label,
          metadata: {
            currentView: rightPanelState.view ?? null,
            currentTargetId: detail.currentTargetId ?? null,
            nextTargetId: detail.nextTargetId ?? null,
            targetInScene: detail.targetInScene,
            source: detail.source,
            preserved: detail.preserved === true,
          },
        });
      }
    },
    [rightPanelState.view]
  );
  const syncFocusedObjectFromResponse = useCallback(
    (payload: BackendChatResponse, options?: { allowFocusMutation?: boolean }) => {
      const allowFocusMutation = options?.allowFocusMutation === true;
      const ctxInfo = (payload as any)?.context?.object_info;
      if (ctxInfo && typeof ctxInfo === "object" && ctxInfo.id) {
        const resolvedTargetId = String(ctxInfo.id);
        const resolvedDetails = resolveSelectedObjectDetails(resolvedTargetId);
        setSelectedObjectInfo((prev) => {
          if (!resolvedDetails) return prev;
          return {
            ...resolvedDetails,
            label:
              typeof ctxInfo.label === "string" && ctxInfo.label.trim().length > 0 ? ctxInfo.label : resolvedDetails.label,
            title:
              typeof ctxInfo.label === "string" && ctxInfo.label.trim().length > 0 ? ctxInfo.label : resolvedDetails.title,
            summary:
              typeof ctxInfo.summary === "string" && ctxInfo.summary.trim().length > 0
                ? ctxInfo.summary
                : resolvedDetails.summary,
            tags: Array.isArray(ctxInfo.tags) ? ctxInfo.tags : resolvedDetails.tags,
          };
        });
        if (allowFocusMutation && !focusPinned) {
          if (!resolvedDetails) {
            tracePostSuccessContextDecision("[Nexora][ContextGuardBlocked]", {
              currentTargetId: selectedObjectIdState ?? focusedId ?? null,
              nextTargetId: resolvedTargetId,
              source: "chatSuccess",
              targetInScene: false,
              preserved: Boolean(selectedObjectIdState ?? focusedId),
            });
            return;
          }
          tracePostSuccessContextDecision("[Nexora][PostSuccessContextAccepted]", {
            currentTargetId: selectedObjectIdState ?? focusedId ?? null,
            nextTargetId: resolvedTargetId,
            source: "chatSuccess",
            targetInScene: true,
            preserved: false,
          });
          setFocusedId(resolvedTargetId);
          setFocusMode("selected");
          claimFocusOwnership({
            source: "backend_intelligence",
            objectId: resolvedTargetId,
            isPersistent: false,
            reason: "Backend context returned a focus object.",
          });
        }
      }

      const ctxAllowed = (payload as any)?.context?.allowed_objects;
      if (
        allowFocusMutation &&
        !focusPinned &&
        focusMode === "all" &&
        Array.isArray(ctxAllowed) &&
        ctxAllowed.length > 0
      ) {
        const first = ctxAllowed[0] as string;
        const resolvedAllowed = resolveSelectedObjectDetails(first);
        if (!resolvedAllowed) {
          tracePostSuccessContextDecision("[Nexora][ContextGuardBlocked]", {
            currentTargetId: selectedObjectIdState ?? focusedId ?? null,
            nextTargetId: first,
            source: "chatSuccess",
            targetInScene: false,
            preserved: Boolean(selectedObjectIdState ?? focusedId),
          });
          return;
        }
        tracePostSuccessContextDecision("[Nexora][PostSuccessContextAccepted]", {
          currentTargetId: selectedObjectIdState ?? focusedId ?? null,
          nextTargetId: first,
          source: "chatSuccess",
          targetInScene: true,
          preserved: false,
        });
        setFocusedId(first);
        setFocusMode("selected");
        updateSelectedObjectInfo(first);
        claimFocusOwnership({
          source: "backend_intelligence",
          objectId: first,
          isPersistent: false,
          reason: "Backend allowed objects promoted a primary focus.",
        });
        if (process.env.NODE_ENV !== "production") {
          setSceneWarn("Auto focus by text");
        }
      }
    },
    [
      claimFocusOwnership,
      focusMode,
      focusPinned,
      focusedId,
      resolveSelectedObjectDetails,
      selectedObjectIdState,
      setFocusMode,
      setFocusedId,
      tracePostSuccessContextDecision,
      updateSelectedObjectInfo,
    ]
  );
  const applyUnifiedSceneReaction = useCallback(
    (
      reaction: UnifiedSceneReaction,
      options?: {
        sceneReplacement?: SceneJson | null;
        allowSceneReplacement?: boolean;
      }
    ) => {
      const sceneForOverrides = options?.sceneReplacement ?? sceneJson;
      const normalizedReaction = normalizeReactionForScene(reaction, sceneForOverrides);
      const sceneChatCorrelation = activeChatDebugCorrelationRef.current;
      const sceneChatMeta =
        sceneChatCorrelation ? { chatCorrelationId: sceneChatCorrelation } : {};
      if (normalizedReaction.sceneJson && options?.allowSceneReplacement !== true) {
        emitDebugEvent({
          type: "scene_overwrite_blocked",
          layer: "scene",
          source: "HomeScreen",
          status: "warn",
          message: "Scene replacement payload blocked (not allowed for this apply path)",
          metadata: {
            reactionSource: reaction.source ?? null,
            hasSceneReplacementOption: Boolean(options?.sceneReplacement),
            ...sceneChatMeta,
          },
          correlationId: sceneChatCorrelation ?? undefined,
        });
        emitGuardRailAlerts(
          runGuardChecks(
            {
              trigger: "scene_update",
              correlationId: sceneChatCorrelation ?? null,
              scene: { overwriteBlocked: true, sceneJsonWhileDisallowed: true },
            },
            getRecentDebugEvents()
          )
        );
      }
      const nextHighlighted = normalizedReaction.highlightedObjectIds.map((x) => String(x));
      const nextRiskSources = Array.isArray(normalizedReaction.riskSources)
        ? normalizedReaction.riskSources.map((x) => String(x))
        : [];
      const nextRiskTargets = Array.isArray(normalizedReaction.riskTargets)
        ? normalizedReaction.riskTargets.map((x) => String(x))
        : [];

      const sceneObjects = Array.isArray(sceneForOverrides?.scene?.objects) ? sceneForOverrides.scene.objects : [];
      const allSceneObjectIds = sceneObjects
        .map((obj: unknown, idx: number) => {
          const o = asRecord(obj);
          return String(o?.id ?? o?.name ?? `obj_${idx}`);
        })
        .filter(Boolean);
      const effectiveHighlighted = nextHighlighted;
      const effectivePrimaryId = normalizedReaction.primaryObjectId ?? effectiveHighlighted[0] ?? null;
      const effectiveRelatedIds = Array.isArray(normalizedReaction.relatedObjectIds)
        ? normalizedReaction.relatedObjectIds.filter((id) => id !== effectivePrimaryId)
        : effectiveHighlighted.filter((id) => id !== effectivePrimaryId);
      const reactionScalePrimary = typeof normalizedReaction.primaryScale === "number" ? normalizedReaction.primaryScale : 1.1;
      const reactionScaleSecondary =
        typeof normalizedReaction.secondaryScale === "number" ? normalizedReaction.secondaryScale : 1.035;
      const reactionScaleUnrelated =
        typeof normalizedReaction.unrelatedScale === "number" ? normalizedReaction.unrelatedScale : 0.992;
      const reactionOpacityUnrelated =
        typeof normalizedReaction.unrelatedOpacity === "number" ? normalizedReaction.unrelatedOpacity : 0.56;

      const primaryHighlightedId = effectivePrimaryId;
      const shouldDimUnrelated =
        normalizedReaction.dimUnrelatedObjects === true && effectiveHighlighted.length > 0;
      const hasMeaningfulReaction =
        effectiveHighlighted.length > 0 ||
        nextRiskSources.length > 0 ||
        nextRiskTargets.length > 0 ||
        shouldDimUnrelated;
      const reactionSignature = JSON.stringify({
        sceneObjectCount: allSceneObjectIds.length,
        highlighted: effectiveHighlighted,
        riskSources: nextRiskSources,
        riskTargets: nextRiskTargets,
        primary: effectivePrimaryId,
        dim: shouldDimUnrelated,
      });

      if (process.env.NODE_ENV !== "production") {
        console.log("[UNIFIED PIPELINE]", {
          incoming: reaction.highlightedObjectIds,
          resolved: effectiveHighlighted,
        });
      }
      if (!hasMeaningfulReaction) {
        if (process.env.NODE_ENV !== "production") {
          console.debug("[Nexora][ReactionSkipped]", {
            reason: "empty_reaction",
            highlightedCount: effectiveHighlighted.length,
            riskSourceCount: nextRiskSources.length,
            riskTargetCount: nextRiskTargets.length,
          });
        }
        emitDebugEvent({
          type: "debug_warning",
          layer: "scene",
          source: "HomeScreen",
          status: "warn",
          message: "Unified reaction skipped (empty)",
          metadata: { code: "reaction_empty", reactionSource: reaction.source ?? null, ...sceneChatMeta },
          correlationId: sceneChatCorrelation ?? undefined,
        });
        return;
      }
      if (lastUnifiedReactionSignatureRef.current === reactionSignature) {
        if (process.env.NODE_ENV !== "production") {
          console.debug("[Nexora][ReactionSkipped]", {
            reason: "duplicate_reaction",
            primaryObjectId: effectivePrimaryId,
            highlightedCount: effectiveHighlighted.length,
            riskSourceCount: nextRiskSources.length,
            riskTargetCount: nextRiskTargets.length,
          });
        }
        emitDebugEvent({
          type: "debug_warning",
          layer: "scene",
          source: "HomeScreen",
          status: "info",
          message: "Unified reaction skipped (duplicate signature)",
          metadata: { code: "reaction_duplicate", primaryObjectId: effectivePrimaryId ?? null, ...sceneChatMeta },
          correlationId: sceneChatCorrelation ?? undefined,
        });
        return;
      }
      lastUnifiedReactionSignatureRef.current = reactionSignature;
      emitDebugEvent({
        type: "scene_update_requested",
        layer: "scene",
        source: "HomeScreen",
        status: "info",
        message: "Applying unified scene reaction",
        metadata: {
          reactionSource: reaction.source ?? null,
          primaryObjectId: effectivePrimaryId ?? null,
          highlightedCount: effectiveHighlighted.length,
          ...sceneChatMeta,
        },
        correlationId: sceneChatCorrelation ?? undefined,
      });
      if (
        process.env.NODE_ENV !== "production" &&
        shouldDimUnrelated &&
        (!primaryHighlightedId || effectiveHighlighted.length === 0)
      ) {
        console.warn(
          "[Nexora][UnifiedReaction] Dimming is active but no valid highlighted object was resolved."
        );
      }

      setObjectSelection({
        highlighted_objects: effectiveHighlighted,
        dim_unrelated_objects: shouldDimUnrelated,
      } as any);

      setRiskPropagation({
        sources: nextRiskSources,
        targets: nextRiskTargets,
      } as any);

      if (allSceneObjectIds.length > 0) {
        pruneOverridesRef.current?.(allSceneObjectIds);
        if (effectiveHighlighted.length === 0) {
          for (const objectId of allSceneObjectIds) {
            setOverrideRef.current?.(objectId, {
              opacity: 1,
              scale: 1,
            });
          }
        } else {
          for (const objectId of allSceneObjectIds) {
            if (objectId === effectivePrimaryId) {
              setOverrideRef.current?.(objectId, {
                opacity: 1,
                scale: reactionScalePrimary,
              });
            } else if (effectiveRelatedIds.includes(objectId)) {
              setOverrideRef.current?.(objectId, {
                opacity: 0.88,
                scale: reactionScaleSecondary,
              });
            } else if (shouldDimUnrelated) {
              setOverrideRef.current?.(objectId, {
                opacity: reactionOpacityUnrelated,
                scale: reactionScaleUnrelated,
              });
            } else {
              setOverrideRef.current?.(objectId, {
                opacity: 1,
                scale: 1,
              });
            }
          }
        }
      }

      if (Array.isArray(normalizedReaction.loopSuggestions)) {
        setLoopSuggestions(normalizedReaction.loopSuggestions as any);
      }

      if (normalizedReaction.activeLoopId !== undefined) {
        setActiveLoopId(normalizedReaction.activeLoopId ?? null);
      }

      if (options?.allowSceneReplacement && options?.sceneReplacement) {
        const sceneDecision = evaluateUnifiedReactionSceneReplacement(options.sceneReplacement);
        if (isSceneCanonReplaceDecision(sceneDecision)) {
          setSceneJson(sceneDecision.scene);
          setNoSceneUpdate(false);
        } else if (process.env.NODE_ENV !== "production") {
          console.warn("[Nexora][HomeScreen][UnsafeSceneBlocked]", {
            reason: "scene_replacement_not_renderable",
            reactionSource: reaction.source ?? null,
            contractReason: sceneDecision.reason,
          });
        }
      }

      if (Array.isArray(normalizedReaction.actions) && normalizedReaction.actions.length > 0) {
        try {
          applyActions(normalizedReaction.actions);
          setSceneWarn(null);
        } catch {
          setSceneWarn("⚠️ Could not apply unified scene actions (dev).");
        }
      }

      if (primaryHighlightedId) {
        updateSelectedObjectInfo(primaryHighlightedId);
        setSelectedObjectIdState(primaryHighlightedId);
      }

      if (normalizedReaction.allowFocusMutation) {
        const focusSyncPayload: BackendChatResponse = {
          context: {
            object_info:
              primaryHighlightedId
                ? { id: primaryHighlightedId, label: primaryHighlightedId }
                : null,
            allowed_objects: effectiveHighlighted,
          },
        };
        syncFocusedObjectFromResponse(focusSyncPayload, { allowFocusMutation: true });
      }

      emitDebugEvent({
        type: "scene_update_applied",
        layer: "scene",
        source: "HomeScreen",
        status: "ok",
        message: "Unified scene reaction applied",
        metadata: {
          primaryObjectId: primaryHighlightedId ?? null,
          highlightedCount: effectiveHighlighted.length,
          allowSceneReplacement: options?.allowSceneReplacement === true,
          ...sceneChatMeta,
        },
        correlationId: sceneChatCorrelation ?? undefined,
      });
      emitGuardRailAlerts(
        runGuardChecks(
          { trigger: "scene_update", correlationId: sceneChatCorrelation ?? null },
          getRecentDebugEvents()
        )
      );
    },
    [
      applyActions,
      sceneJson,
      setSelectedObjectIdState,
      syncFocusedObjectFromResponse,
      updateSelectedObjectInfo,
    ]
  );
  const applyDemoStepFallbackReaction = useCallback(
    (step: DemoScriptStep) => {
      const sceneObjectIds = extractSceneObjectIds(sceneJson);
      if (!sceneObjectIds.length) return;

      const sourceHighlightIds =
        Array.isArray(step.scene_action?.highlight_ids) && step.scene_action.highlight_ids.length > 0
          ? step.scene_action.highlight_ids
          : step.expected_focus_objects;
      const resolvedHighlights = resolveRetailHighlightedObjectIds(sourceHighlightIds, sceneObjectIds);
      const sourceFocusId = step.scene_action?.focus_id ?? step.fallback_focus_object_id ?? null;
      const resolvedPrimary = sourceFocusId
        ? resolveRetailHighlightedObjectIds([sourceFocusId], sceneObjectIds)[0] ?? null
        : null;
      const orderedHighlights = resolvedPrimary
        ? [resolvedPrimary, ...resolvedHighlights.filter((id) => id !== resolvedPrimary)]
        : resolvedHighlights;
      const primaryObjectId = orderedHighlights[0] ?? null;
      const riskSources =
        step.visual_mode === "shock" || step.visual_mode === "propagation" || step.visual_mode === "fragility"
          ? primaryObjectId
            ? [primaryObjectId]
            : []
          : [];
      const riskTargets =
        step.visual_mode === "propagation" || step.visual_mode === "fragility"
          ? orderedHighlights.slice(1, 4)
          : [];

      const reaction = resolveUnifiedReactionPolicy({
        source: "system",
        reason: step.narration_text,
        highlightedObjectIds: orderedHighlights,
        riskSources,
        riskTargets,
        reactionModeHint: mapDemoVisualModeToReactionMode(step.visual_mode),
        allowFocusMutation: primaryObjectId !== null,
        sceneJson: null,
      });

      const softenedReaction =
        step.visual_mode === "balanced"
          ? {
              ...reaction,
              dimUnrelatedObjects: false,
              primaryScale: 1.06,
              secondaryScale: 1.02,
              unrelatedScale: 1,
              unrelatedOpacity: 1,
            }
          : step.visual_mode === "outcome"
          ? {
              ...reaction,
              dimUnrelatedObjects: false,
              primaryScale: 1.08,
              secondaryScale: 1.03,
              unrelatedScale: 1,
              unrelatedOpacity: 0.94,
            }
          : reaction;

      applyUnifiedSceneReaction(softenedReaction, { allowSceneReplacement: false });
    },
    [applyUnifiedSceneReaction, sceneJson]
  );
  const applyExecutionResultToUi = useCallback(
    (executionResult: Awaited<ReturnType<typeof executeNexoraAction>>) => {
      const applyResult = applyNexoraUiState({
        result: executionResult,
        currentState: buildNexoraUiReadableStateForApply({
          rightPanelTab,
          activeInspectorReportTab,
          inspectorOpen,
          sceneJson,
          selectedObjectId: selectedObjectIdState,
          focusedId,
          focusMode,
          focusPinned,
          messages,
          memory,
          responseData,
        }),
        adapters: createNexoraUiAdaptersForExecutionApply({
          preferredRightPanelLegacyTabRef,
          rightPanelIsOpen: rightPanelState.isOpen,
          handleCloseRightPanel,
          setSceneJson,
          setSceneWarn,
          setNoSceneUpdate,
          setLastActions,
          setFocusedId,
          setSelectedObjectIdState,
          setFocusMode,
          setFocusPinned,
          applyFocusModeToStore,
          applyPinToStore,
          setMessages,
          setResponseData,
          setLastAnalysisSummary,
          setSourceLabel,
          setObjectSelection,
          setMemoryInsights,
          setRiskPropagation,
          setStrategicAdvice,
          setStrategyKpi,
          setDecisionCockpit,
          setProductModeContext,
          setAiReasoning,
          setPlatformAssembly,
          setAutonomousExploration,
          setOpponentModel,
          setStrategicPatterns,
          setConflictsNormalized: (value) => setConflicts(Array.isArray(value) ? value : []),
          setSelectedObjectInfo,
          updateSelectedObjectInfo,
          setObjectProfiles,
          setObjectUxById,
          setAlert,
          setReplayError,
          setHealthInfo,
          setKpi,
          setLoops,
          setActiveLoopId,
          setLoopSuggestions,
          setProductModeId,
          applyUnifiedSceneReaction,
          applyProductFlowViewModel,
        }),
      });

      traceHighlightFlow(
        "homescreen_after_apply",
        buildHomescreenExecutionApplyTracePayload({
          executionResult,
          rightPanelTab,
          activeInspectorReportTab,
          selectedObjectId: selectedObjectIdState,
          focusedId,
          focusMode,
          focusPinned,
          applyResult,
        })
      );

      return applyResult;
    },
    [
      activeInspectorReportTab,
      applyFocusModeToStore,
      applyPinToStore,
      applyProductFlowViewModel,
      applyUnifiedSceneReaction,
      focusMode,
      focusPinned,
      focusedId,
      inspectorOpen,
      handleCloseRightPanel,
      memory,
      messages,
      rightPanelState.contextId,
      rightPanelState.isOpen,
      rightPanelState.view,
      responseData,
      rightPanelTab,
      sceneJson,
      selectedObjectIdState,
      updateSelectedObjectInfo,
    ]
  );
  const applyRetailTriggerEnhancement = useCallback(
    (rawPayload: unknown, userText: string, fallbackScene: SceneJson | null) => {
      const payloadRecord =
        typeof rawPayload === "object" && rawPayload !== null ? (rawPayload as Record<string, unknown>) : null;
      const nestedDomain =
        payloadRecord?.scene_json && typeof payloadRecord.scene_json === "object"
          ? String(
              (
                (payloadRecord.scene_json as Record<string, unknown>).meta as
                  | Record<string, unknown>
                  | undefined
              )?.domain ?? ""
            ).trim()
          : "";
      const fromScene = String(fallbackScene?.meta?.domain ?? "").trim();
      const modeContext = buildActiveModeContext({
        modeId: productModeId,
        projectDomain: fromScene || nestedDomain || undefined,
      });
      return applyRetailDemoChatPayloadEnhancement(rawPayload, userText, fallbackScene, {
        modeContext,
        reasoningHints: {
          workspaceId: activeWorkspaceId,
          selectedObjectId: selectedObjectIdState,
          memoryState: memory,
          environmentConfig,
        },
        domainLabel: activeDomainExperience.experience.label,
        executiveFramingStyle: activeDomainExperience.experience.executiveFramingStyle,
      }) as BackendChatResponse;
    },
    [
      activeDomainExperience.experience.executiveFramingStyle,
      activeDomainExperience.experience.label,
      activeWorkspaceId,
      environmentConfig,
      memory,
      productModeId,
      selectedObjectIdState,
    ]
  );
  const [activeLoopId, setActiveLoopId] = useState<string | null>(null);
  const [selectedLoopId, setSelectedLoopId] = useState<string | null>(null);
  const [loopSuggestions, setLoopSuggestions] = useState<string[]>([]);
  const isDev = process.env.NODE_ENV !== "production";
  const [snapshots, setSnapshots] = useState<DecisionSnapshot[]>([]);
  const [compareAId, setCompareAId] = useState<string | null>(null);
  const [compareBId, setCompareBId] = useState<string | null>(null);
  const [diffState, setDiffState] = useState<ReturnType<typeof diffSnapshots> | null>(null);
  const [activeSidePanel, setActiveSidePanel] = useState<HUDTabKey>("decisions");
  // --- panelContent block is moved below ---
  const handleApplySnapshot = useCallback(
    (snapshotKey: string) => {
      const key = String(snapshotKey || "").trim();
      if (!key) return;

      const { id, ts } = parseDecisionSnapshotKey(key);

      // 1) Try in-memory first (fast)
      let snap: DecisionSnapshot | null = pickDecisionSnapshotFromList(
        Array.isArray(snapshots) ? snapshots : [],
        id,
        ts
      );

      // 2) If not found, try persisted snapshots
      if (!snap) {
        const persisted = loadSnapshots(projectId);
        snap = pickDecisionSnapshotFromList(persisted, id, ts);
        // Keep in-memory state in sync if we found one
        if (snap) {
          setSnapshots(persisted);
        }
      }

      if (!snap) {
        if (process.env.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.warn("[decision] snapshot not found", { snapshotKey: key, id, ts });
        }
        return;
      }

      // Restore scene first, then loops/selection, then panel (avoids panel/scene desync).
      const rawScene = snap.sceneJson;
      const sceneDecision = evaluateSnapshotRestoreScene(rawScene);
      if (isSceneCanonReplaceDecision(sceneDecision)) {
        setSceneJson(sceneDecision.scene);
        setNoSceneUpdate(false);
      } else if (rawScene != null && process.env.NODE_ENV !== "production") {
        console.warn("[Nexora][HomeScreen][SceneShapeRejected]", {
          reason: "snapshot_scene_not_renderable",
          snapshotId: snap.id,
          contractReason: sceneDecision.kind === "reject" ? sceneDecision.reason : "",
        });
      }

      setLoops(Array.isArray(snap.loops) ? snap.loops : []);
      setActiveLoopId(snap.activeLoopId ?? null);
      setSelectedLoopId(snap.activeLoopId ?? null);

      const sel = typeof snap.selectedObjectId === "string" && snap.selectedObjectId.trim() ? snap.selectedObjectId.trim() : null;
      if (sel) {
        selectedSetterRef.current(sel);
        setSelectedObjectIdState(sel);
      } else {
        selectedSetterRef.current(null);
        setSelectedObjectIdState(null);
      }

      queueMicrotask(() => {
        if (snap.rightPanelOpen && snap.rightPanelView) {
          dispatchCanonicalAction(
            normalizeOpenPanelCta({
              view: snap.rightPanelView as Exclude<RightPanelView, null>,
              contextId: null,
              rawSource: "snapshot_restore",
              source: "system",
              surface: "legacy_shell",
            })
          );
        } else {
          closeRightPanel();
        }
      });

      // eslint-disable-next-line no-console
      console.log("[Nexora][SnapshotLoaded]", {
        id: snap.id,
        timestamp: snap.timestamp,
        hasScene: Boolean(rawScene),
        panelView: snap.rightPanelView ?? null,
      });

      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.debug("[decision] applied snapshot", snap.id, snap.timestamp);
      }
    },
    [closeRightPanel, dispatchCanonicalAction, snapshots, projectId]
  );

  useEffect(() => {
    if (snapshots.length === 0) return;
    if (!compareAId) {
      const aDefault = snapshots[Math.max(0, snapshots.length - 2)] ?? snapshots[0];
      setCompareAId(aDefault ? `${aDefault.id}:${aDefault.timestamp}` : null);
    }
    if (!compareBId && snapshots.length > 1) {
      const bDefault = snapshots[snapshots.length - 1];
      setCompareBId(bDefault ? `${bDefault.id}:${bDefault.timestamp}` : null);
    }
  }, [snapshots, compareAId, compareBId]);

  useEffect(() => {
    const parseKey = (k: string) => {
      const parts = k.split(":");
      if (parts.length === 2) {
        const id = parts[0];
        const ts = Number(parts[1]);
        return { id, ts: Number.isFinite(ts) ? ts : null };
      }
      return { id: k, ts: null as number | null };
    };

    const snapA = compareAId
      ? (() => {
          const { id, ts } = parseKey(compareAId);
          return snapshots.find((s) => (ts !== null ? s.id === id && s.timestamp === ts : s.id === id)) ?? null;
        })()
      : null;

    const snapB = compareBId
      ? (() => {
          const { id, ts } = parseKey(compareBId);
          return snapshots.find((s) => (ts !== null ? s.id === id && s.timestamp === ts : s.id === id)) ?? null;
        })()
      : null;

    if (snapA && snapB) {
      setDiffState(diffSnapshots(snapA, snapB));
    } else {
      setDiffState(null);
    }
  }, [snapshots, compareAId, compareBId]);
  const lastSnapshotRef = useRef<string | null>(null);
  const saveDecisionSnapshotNow = useCallback(() => {
    const hasLoops = Array.isArray(loops) && loops.length > 0;
    const hasScene = Boolean(sceneJson && typeof sceneJson === "object");
    if (!hasLoops && !hasScene) return;
    try {
      let sceneClone: unknown = null;
      if (sceneJson) {
        try {
          sceneClone =
            typeof structuredClone === "function"
              ? structuredClone(sceneJson)
              : JSON.parse(JSON.stringify(sceneJson));
        } catch {
          sceneClone = null;
        }
      }
      const snapshot: DecisionSnapshot = {
        id: `ds_${Date.now()}`,
        timestamp: Date.now(),
        projectId,
        loops: Array.isArray(loops) ? loops : [],
        activeLoopId: activeLoopId ?? null,
        sceneJson: sceneClone,
        selectedObjectId: selectedObjectIdState ?? null,
        rightPanelView: rightPanelState.view ?? null,
        rightPanelOpen: Boolean(rightPanelState.isOpen),
      };
      const next = appendSnapshot(projectId, snapshot);
      setSnapshots(next);
      lastSnapshotRef.current = JSON.stringify({
        loops: snapshot.loops,
        activeLoopId: snapshot.activeLoopId,
        scene: Boolean(sceneClone),
        panel: snapshot.rightPanelView,
      });
      // eslint-disable-next-line no-console
      console.log("[Nexora][SnapshotSaved]", {
        id: snapshot.id,
        loops: snapshot.loops.length,
        hasScene: Boolean(sceneClone),
        panelView: snapshot.rightPanelView,
        panelOpen: snapshot.rightPanelOpen,
      });
    } catch {
      // ignore persistence errors
    }
  }, [activeLoopId, loops, projectId, sceneJson, rightPanelState.isOpen, rightPanelState.view, selectedObjectIdState]);
  const effectiveActiveLoopId = selectedLoopId ?? activeLoopId;
  const selectLoop = useCallback((id: string | null) => {
    setSelectedLoopId(id);
    if (id) setActiveLoopId(id);
  }, []);
  const lastAutoAssistantId = useRef<string | null>(null);
  const selectedObjectInfoRef = useRef<typeof selectedObjectInfo>(null);
  const pendingVisualPatchesRef = useRef<null | { memory: MemoryStateV1; targets: string[] }>(null);
  const selectedSetterRef = useRef<(id: string | null) => void>(() => {});
  const handleSelectedChangeRef = useRef<(id: string | null) => void>(() => {});
  const selectedIdRef = useRef<string | null>(null);
  const overridesRef = useRef<Record<string, any>>({});
  const setOverrideRef = useRef<(id: string, patch: any) => void>(() => {});
  const setViewMode = useSetViewMode();
  const buildActiveProjectState = useCallback(
    (projectIdForState: string): WorkspaceProjectState => {
      const inferred = inferProjectMetaFromScene(sceneJson);
      const nextId = projectIdForState || inferred.projectId || DEFAULT_PROJECT_ID;
      return {
        id: nextId,
        name: inferred.name || nextId,
        domain: inferred.domain,
        semanticObjectMeta: objectProfiles ?? {},
        chat: {
          messages: normalizeMessages(messages),
          activeMode,
          episodeId,
        },
        scene: {
          sceneJson,
          selectedObjectId: selectedObjectIdState ?? null,
          focusedId: focusedId ?? null,
          focusMode,
          focusPinned,
          loops: Array.isArray(loops) ? loops : [],
          activeLoopId: activeLoopId ?? null,
          selectedLoopId: selectedLoopId ?? null,
          objectUxById: objectUxById ?? {},
          overrides: overridesRef.current ?? {},
        },
        intelligence: {
          kpi,
          conflicts: Array.isArray(conflicts) ? conflicts : [],
          objectSelection,
          memoryInsights,
          riskPropagation,
          strategicAdvice,
          decisionResult,
          strategyKpi,
          decisionCockpit,
          productModeContext,
          aiReasoning,
          platformAssembly,
          autonomousExploration,
          opponentModel,
          strategicPatterns,
          responseData,
          sourceLabel,
          lastAnalysisSummary,
        },
      };
    },
    [
      activeMode,
      activeLoopId,
      conflicts,
      episodeId,
      focusedId,
      focusMode,
      focusPinned,
      kpi,
      lastAnalysisSummary,
      loops,
      memoryInsights,
      messages,
      objectProfiles,
      objectSelection,
      objectUxById,
      opponentModel,
      responseData,
      riskPropagation,
      sceneJson,
      selectedLoopId,
      selectedObjectIdState,
      sourceLabel,
      strategicAdvice,
      strategyKpi,
      decisionCockpit,
      productModeContext,
      aiReasoning,
      platformAssembly,
      autonomousExploration,
      strategicPatterns,
    ]
  );

  const applyWorkspaceProjectState = useCallback(
    (project: WorkspaceProjectState) => {
      projectHydratingRef.current = true;
      try {
        setActiveMode(project?.chat?.activeMode ?? "business");
        setEpisodeId(project?.chat?.episodeId ?? null);
        setMessages(normalizeMessages(project?.chat?.messages ?? []));

        const sceneDecision = project?.scene?.sceneJson
          ? evaluateWorkspaceHydrateScene(project.scene.sceneJson)
          : canonDecisionMissingSceneBlob();
        setSceneJson(sceneJsonFromCanonDecision(sceneDecision));
        setSelectedObjectIdState(project?.scene?.selectedObjectId ?? null);
        setFocusedId(project?.scene?.focusedId ?? null);
        setFocusMode(project?.scene?.focusMode ?? "all");
        setPinnedSafe(!!project?.scene?.focusPinned, project?.scene?.focusedId ?? null);
        setLoops(Array.isArray(project?.scene?.loops) ? project.scene.loops : []);
        setActiveLoopId(project?.scene?.activeLoopId ?? null);
        setSelectedLoopId(project?.scene?.selectedLoopId ?? null);
        setObjectUxById(project?.scene?.objectUxById ?? {});

        clearAllOverridesRef.current?.();
        const nextOverrides = project?.scene?.overrides ?? {};
        Object.entries(nextOverrides).forEach(([id, patch]) => {
          setOverrideRef.current?.(id, patch);
        });

        setKpi(project?.intelligence?.kpi ?? null);
        setConflicts(Array.isArray(project?.intelligence?.conflicts) ? project.intelligence.conflicts : []);
        setObjectSelection(project?.intelligence?.objectSelection ?? null);
        setMemoryInsights(project?.intelligence?.memoryInsights ?? null);
        setRiskPropagation(project?.intelligence?.riskPropagation ?? null);
        setStrategicAdvice(project?.intelligence?.strategicAdvice ?? null);
        setStrategyKpi(project?.intelligence?.strategyKpi ?? null);
        setDecisionCockpit(project?.intelligence?.decisionCockpit ?? null);
        setProductModeContext(project?.intelligence?.productModeContext ?? null);
        setProductModeId(String(project?.intelligence?.productModeContext?.mode_id ?? "manager"));
        setAiReasoning(project?.intelligence?.aiReasoning ?? null);
        setPlatformAssembly(project?.intelligence?.platformAssembly ?? null);
        setAutonomousExploration(project?.intelligence?.autonomousExploration ?? null);
        setOpponentModel(project?.intelligence?.opponentModel ?? null);
        setStrategicPatterns(project?.intelligence?.strategicPatterns ?? null);
        applyGuardedResponsePayload(
          project?.intelligence?.responseData ?? null,
          "feedback",
          "Project intelligence payload restored."
        );
        setSourceLabel(project?.intelligence?.sourceLabel ?? null);
        setLastAnalysisSummary(project?.intelligence?.lastAnalysisSummary ?? null);

        const selectedId = project?.scene?.selectedObjectId ?? null;
        selectedSetterRef.current?.(selectedId);
      } finally {
        window.setTimeout(() => {
          projectHydratingRef.current = false;
        }, 0);
      }
    },
    [setFocusedId, setFocusMode, setPinnedSafe]
  );

  const activateProject = useCallback(
    (nextProjectIdRaw: string) => {
      const nextProjectId = String(nextProjectIdRaw || "").trim().toLowerCase() || DEFAULT_PROJECT_ID;
      if (nextProjectId === activeProjectId) return;

      setWorkspaceProjects((prev) => {
        const currentState = buildActiveProjectState(activeProjectId);
        const withCurrent = { ...prev, [activeProjectId]: currentState };
        const nextProject = withCurrent[nextProjectId] ?? createEmptyProjectState(nextProjectId, nextProjectId);
        window.setTimeout(() => applyWorkspaceProjectState(nextProject), 0);
        return { ...withCurrent, [nextProjectId]: nextProject };
      });
      setActiveProjectId(nextProjectId);
    },
    [activeProjectId, applyWorkspaceProjectState, buildActiveProjectState]
  );

  useEffect(() => {
    const onActivateProject = (event: Event) => {
      const detail = (event as CustomEvent<{ projectId?: string }>).detail;
      const id = String(detail?.projectId ?? "").trim();
      if (!id) return;
      activateProject(id);
    };
    window.addEventListener("nexora:activate-project", onActivateProject as EventListener);
    return () =>
      window.removeEventListener("nexora:activate-project", onActivateProject as EventListener);
  }, [activateProject]);

  useEffect(() => {
    const next = buildActiveModeContext({
      modeId: productModeId,
      projectDomain: readSceneJsonMetaString(sceneJson, "domain") || undefined,
      workspaceId: activeWorkspaceId,
      projectId: activeProjectId,
    });
    setProductModeContext(next);
  }, [productModeId, sceneJson, activeWorkspaceId, activeProjectId]);

  useEffect(() => {
    const onSetProductMode = (event: Event) => {
      const detail = (event as CustomEvent<{ modeId?: string }>).detail;
      const candidate = String(detail?.modeId ?? "").trim().toLowerCase();
      if (!candidate) return;
      setProductModeId(getProductMode(candidate).id);
    };
    window.addEventListener("nexora:set-product-mode", onSetProductMode as EventListener);
    return () =>
      window.removeEventListener("nexora:set-product-mode", onSetProductMode as EventListener);
  }, []);

  useEffect(() => {
    const onScannerResult = (event: Event) => {
      const detail = (event as CustomEvent<{ result?: ScannerResult }>).detail;
      const result = detail?.result;
      if (!result) return;

      const currentActive = buildActiveProjectState(activeProjectId);
      const currentWorkspace = {
        id: activeWorkspaceId,
        activeProjectId,
        projects: {
          ...workspaceProjects,
          [activeProjectId]: currentActive,
        },
      };
      const applied = applyScannerResultToWorkspace(currentWorkspace, result);

      setActiveWorkspaceId(applied.workspace.id || DEFAULT_WORKSPACE_ID);
      setWorkspaceProjects(applied.workspace.projects);
      setActiveProjectId(applied.activeProjectId);
      applyWorkspaceProjectState(applied.project);

      const msg = applied.created
        ? `Scanner created project: ${applied.project.name}.`
        : `Scanner enriched project: ${applied.project.name}.`;
      const warn = applied.warnings.length ? ` Warnings: ${applied.warnings.join(" ")}` : "";
      setMessages((m) => appendMessages(m, [makeMsg("assistant", `${msg}${warn}`)]));
    };

    window.addEventListener("nexora:scanner-result", onScannerResult as EventListener);
    return () =>
      window.removeEventListener("nexora:scanner-result", onScannerResult as EventListener);
  }, [
    activeProjectId,
    activeWorkspaceId,
    applyWorkspaceProjectState,
    buildActiveProjectState,
    workspaceProjects,
  ]);

  useEffect(() => {
    const onScannerSource = (event: Event) => {
      if (!isFeatureEnabled(environmentConfig, "scanner_create") && !isFeatureEnabled(environmentConfig, "scanner_enrich")) {
        setMessages((m) =>
          appendMessages(m, [makeMsg("assistant", "Scanner source ingestion is disabled in this environment.")])
        );
        return;
      }
      const detail = (event as CustomEvent<{ input?: ScannerInput }>).detail;
      const input = detail?.input;
      if (!input || typeof input !== "object") return;
      const result = scanSystemToScannerResult(input);

      const currentActive = buildActiveProjectState(activeProjectId);
      const currentWorkspace = {
        id: activeWorkspaceId,
        activeProjectId,
        projects: {
          ...workspaceProjects,
          [activeProjectId]: currentActive,
        },
      };
      const applied = applyScannerResultToWorkspace(currentWorkspace, result);

      setActiveWorkspaceId(applied.workspace.id || DEFAULT_WORKSPACE_ID);
      setWorkspaceProjects(applied.workspace.projects);
      setActiveProjectId(applied.activeProjectId);
      applyWorkspaceProjectState(applied.project);

      const msg = applied.created
        ? `Scanner generated project: ${applied.project.name}.`
        : `Scanner enriched project: ${applied.project.name}.`;
      const warn = applied.warnings.length ? ` Warnings: ${applied.warnings.join(" ")}` : "";
      setMessages((m) => appendMessages(m, [makeMsg("assistant", `${msg}${warn}`)]));
    };

    window.addEventListener("nexora:scanner-source", onScannerSource as EventListener);
    return () => window.removeEventListener("nexora:scanner-source", onScannerSource as EventListener);
  }, [
    activeProjectId,
    activeWorkspaceId,
    applyWorkspaceProjectState,
    buildActiveProjectState,
    environmentConfig,
    workspaceProjects,
  ]);

  useEffect(() => {
    const onExternalIntegrationResult = (event: Event) => {
      if (
        !isFeatureEnabled(environmentConfig, "enterprise_integrations") ||
        !environmentConfig.integration_policy.allow_external_integrations
      ) {
        setMessages((m) =>
          appendMessages(m, [makeMsg("assistant", "External integrations are disabled in this environment.")])
        );
        return;
      }
      const detail = (event as CustomEvent<{ result?: ExternalIntegrationResult }>).detail;
      const result = detail?.result;
      if (!result || typeof result !== "object") return;

      const currentActive = buildActiveProjectState(activeProjectId);
      const currentWorkspace = {
        id: activeWorkspaceId,
        activeProjectId,
        projects: {
          ...workspaceProjects,
          [activeProjectId]: currentActive,
        },
      };
      const applied = applyExternalIntegrationToWorkspace(currentWorkspace, result);

      setActiveWorkspaceId(applied.workspace.id || DEFAULT_WORKSPACE_ID);
      setWorkspaceProjects(applied.workspace.projects);
      setActiveProjectId(applied.activeProjectId);
      applyWorkspaceProjectState(applied.project);

      const modeLabel = String(result.mode ?? "enrich");
      const sourceLabel = String(result.source?.label ?? result.source?.id ?? "external source");
      const warn = applied.warnings.length ? ` Warnings: ${applied.warnings.join(" ")}` : "";
      const mappingStatus = String(applied.integration.mapping?.status ?? "mapped");
      setMessages((m) =>
        appendMessages(
          m,
          [
            makeMsg(
              "assistant",
              `External integration (${modeLabel}) applied from ${sourceLabel}. Mapping status: ${mappingStatus}.${warn}`
            ),
          ]
        )
      );
    };

    window.addEventListener("nexora:external-integration-result", onExternalIntegrationResult as EventListener);
    return () =>
      window.removeEventListener("nexora:external-integration-result", onExternalIntegrationResult as EventListener);
  }, [
    activeProjectId,
    activeWorkspaceId,
    applyWorkspaceProjectState,
    buildActiveProjectState,
    environmentConfig,
    workspaceProjects,
  ]);
  const pickSceneLabel = useCallback(
    (id: string) => {
      return resolveSceneObjectLabel(id) ?? id;
    },
    [resolveSceneObjectLabel]
  );
  const postAssistantHint = useCallback(
    (id: string, info?: { label?: string; summary?: string; one_liner?: string }) => {
      if (lastAutoAssistantId.current === id) return;
      lastAutoAssistantId.current = id;
      const label = info?.label ?? pickSceneLabel(id);
      const summary = info?.summary ?? "";
      const oneLiner = info?.one_liner ?? "";
      const line =
        summary && summary.trim().length > 0
          ? `${label} — ${summary}`
          : oneLiner && oneLiner.trim().length > 0
          ? `${label} — ${oneLiner}`
          : `Selected: ${label}.`;
      setMessages((m) => appendMessages(m, [makeMsg("assistant", `${line} What would you like to adjust?`)]));
    },
    [pickSceneLabel]
  );
  const tempHighlightRef = useRef<Record<string, { prevScale?: number }>>({});
  const selectFlashTimersRef = useRef<Record<string, number>>({});
  const flashSelectHighlight = useCallback((id: string) => {
    if (!id || !setOverrideRef.current) return;
    const prev = overridesRef.current[id] ?? {};
    const prevScale = typeof prev.scale === "number" ? prev.scale : undefined;
    const prevColor = typeof prev.color === "string" ? prev.color : undefined;
    const nextScale = Math.min(2, (prevScale ?? 1) * 1.05);
    const patch: { scale: number; color?: string } = { scale: nextScale };
    if (prevColor) patch.color = "#ffd166";

    const existingTimer = selectFlashTimersRef.current[id];
    if (existingTimer) window.clearTimeout(existingTimer);

    setOverrideRef.current(id, patch);
    selectFlashTimersRef.current[id] = window.setTimeout(() => {
      const restore: { scale: number; color?: string } = {
        scale: typeof prevScale === "number" ? prevScale : 1,
      };
      if (prevColor) restore.color = prevColor;
      setOverrideRef.current?.(id, restore);
      delete selectFlashTimersRef.current[id];
    }, 160);
  }, []);

  const handleSelectedChange = useCallback(
    (id: string | null) => {
      // Prevent infinite loops: ignore repeated updates for the same selection.
      // IMPORTANT: compare against state, not the mutable ref (some callers update the ref before calling us).
      if (id && selectedObjectIdState === id) {
        return;
      }
      if (selectionLocked && selectedObjectIdState) {
        if (!id || selectedObjectIdState !== id) return;
      }
      if (!id) {
        setSelectedObjectIdState(null);
        setSelectedObjectInfo(null);
        clearFocusOwnership("Selection cleared.");
        return;
      }

      // Selection should not force camera focus mode; keep object anchored under pointer.
      setSelectedObjectIdState(id);
      claimFocusOwnership({
        source: "user_click",
        objectId: id,
        isPersistent: true,
        reason: "Scene object selected by user.",
      });
      flashSelectHighlight(id);
      if (id) {
        setViewMode("input");
      }

      // Pin = lock focus. When pinned, clicking other objects does NOT change focusedId.
      if (focusPinned) {
        applyPinToStore(true, id);
      }
      if (focusPinned || focusMode !== "all") {
        setFocusedId((prev) => {
          if (focusPinned && prev) return prev;
          return id;
        });
      }
      const nextInfo = resolveSelectedObjectDetails(id);
      setSelectedObjectInfo(nextInfo);
      postAssistantHint(id, nextInfo ?? undefined);
    },
    [
      focusPinned,
      focusMode,
      flashSelectHighlight,
      applyPinToStore,
      clearFocusOwnership,
      postAssistantHint,
      resolveSelectedObjectDetails,
      selectionLocked,
      claimFocusOwnership,
      updateSelectedObjectInfo,
      setFocusedId,
      setViewMode,
      selectedObjectIdState,
    ]
  );
  useEffect(() => {
    const onSetFocusObject = (event: Event) => {
      const detail = (event as CustomEvent<{ id?: string }>).detail;
      const id = typeof detail?.id === "string" ? detail.id.trim() : "";
      if (!id) return;
      const resolved = resolveSelectedObjectDetails(id);
      if (!resolved) {
        tracePostSuccessContextDecision("[Nexora][ContextGuardBlocked]", {
          currentTargetId: selectedObjectIdState ?? focusedId ?? null,
          nextTargetId: id,
          source: "objectResolver",
          targetInScene: false,
          preserved: Boolean(selectedObjectIdState ?? focusedId),
        });
        return;
      }
      tracePostSuccessContextDecision("[Nexora][PostSuccessContextAccepted]", {
        currentTargetId: selectedObjectIdState ?? focusedId ?? null,
        nextTargetId: id,
        source: "objectResolver",
        targetInScene: true,
        preserved: false,
      });
      claimFocusOwnership({
        source: "executive_recommendation",
        objectId: id,
        isPersistent: true,
        reason: "Focus requested by command, panel, or recommendation.",
      });
      applyUnifiedSceneReaction(
        buildPanelFocusReaction({
          objectId: id,
          reason: "Focus requested by command, panel, or recommendation.",
        }),
        { allowSceneReplacement: false }
      );
      setViewMode("input");
    };
    window.addEventListener("nexora:set-focus-object", onSetFocusObject as EventListener);
    return () => window.removeEventListener("nexora:set-focus-object", onSetFocusObject as EventListener);
  }, [
    applyUnifiedSceneReaction,
    claimFocusOwnership,
    focusedId,
    resolveSelectedObjectDetails,
    selectedObjectIdState,
    setViewMode,
    tracePostSuccessContextDecision,
  ]);
  useEffect(() => {
    const onApplyFragilityScan = (event: Event) => {
      const detail = (event as CustomEvent<{ result?: FragilityScanResponse | null; bridge?: string }>).detail;
      const result = detail?.result;
      if (!result?.ok) return;
      const domainId = activeDomainExperience.experience.domainId;
      const rawDriversEarly = result.drivers ?? [];
      const enrichedDriversEarly = enrichFragilityDriversForDomain(rawDriversEarly, domainId);
      const sceneBridge = applyFragilityScenePayload(sceneJson, result.scene_payload, { domainId });
      const highlightIds = Array.from(
        new Set([
          ...sceneBridge.matchedObjectIds,
          ...sceneBridge.highlights.map((highlight) => String(highlight.target)),
          ...sceneBridge.suggestedFocusIds,
          ...((Array.isArray(result.suggested_objects) ? result.suggested_objects : [])
            .map((value) => String(value))
            .filter(Boolean)),
        ])
      );

      const sceneObjects = Array.isArray(sceneJson?.scene?.objects) ? sceneJson.scene.objects : [];
      const sceneObjectIds = sceneObjects
        .map((obj: unknown, idx: number) => {
          const o = asRecord(obj);
          return String(o?.id ?? o?.name ?? `obj_${idx}`);
        })
        .filter(Boolean);

      const calibrationCorpus = [
        result.summary,
        ...enrichedDriversEarly.flatMap((d) =>
          [d.label, d.dimension, d.evidence_text].filter(
            (x): x is string => typeof x === "string" && Boolean(String(x).trim())
          )
        ),
      ].join(" ");

      const sceneObjectsCal = sceneObjects.map((obj: unknown) => {
        const o = asRecord(obj);
        return {
          id: String(o?.id ?? ""),
          name: typeof o?.name === "string" ? o.name : undefined,
          label: typeof o?.label === "string" ? o.label : undefined,
          tags: Array.isArray(o?.tags) ? (o.tags as unknown[]).map(String) : undefined,
        };
      });

      const alignedHighlightIds = alignFragilityHighlightIdsForClarity({
        sceneObjectIds,
        highlightIds,
        matchedObjectIds: sceneBridge.matchedObjectIds,
        suggestedFocusIds: sceneBridge.suggestedFocusIds,
        reasonsByObject: result.scene_payload?.reasons_by_object,
        domainId,
        calibrationCorpus,
        sceneObjects: sceneObjectsCal,
      });

      const riskSourcesAligned = sceneBridge.matchedObjectIds.filter((id) => alignedHighlightIds.includes(id));

      const rawDrivers = rawDriversEarly;
      const enrichedDrivers = enrichedDriversEarly;
      const fragilityScanForState = { ...result, drivers: enrichedDrivers };

      setResponseData((prev: Record<string, unknown> | null) =>
        normalizeDecisionPayload({
          ...(prev ?? {}),
          fragility_scan: fragilityScanForState,
          fragility: {
            score: result.fragility_score,
            level: result.fragility_level,
            summary: result.summary,
            drivers: Object.fromEntries(enrichedDrivers.map((driver) => [driver.id, driver.score])),
            overlay_summary: sceneBridge.overlaySummary,
          },
        }).payload
      );

      const baseFragilityReaction = buildUnifiedReactionFromFragilityRun({
        highlightedObjectIds: alignedHighlightIds,
        riskSources: riskSourcesAligned.length > 0 ? riskSourcesAligned : sceneBridge.matchedObjectIds,
        riskTargets: alignedHighlightIds,
        reason: result.summary,
        activeLoopId: null,
        loopSuggestions: [],
        actions: [],
      });
      const sceneScopedFragilityReaction = normalizeReactionForScene(baseFragilityReaction, sceneJson);
      const unifiedFragilityReaction = tuneUnifiedReactionForFragilityLevel(
        sceneScopedFragilityReaction,
        result.fragility_level
      );

      applyUnifiedSceneReaction(unifiedFragilityReaction, {
        sceneReplacement: null,
        allowSceneReplacement: false,
      });

      const captions = buildClarityCaptionsByObjectId({
        objectIds: alignedHighlightIds,
        payload: result.scene_payload,
        drivers: enrichedDrivers,
        domainId,
      });
      const insightLine = buildPipelineInsightLine(result.summary, enrichedDrivers, result.fragility_level, domainId);
      const decisionLayer = deriveNexoraDecisionLayer({
        domainId,
        fragilityLevel: result.fragility_level,
        drivers: enrichedDrivers,
        highlightObjectIds: alignedHighlightIds,
        summary: result.summary,
      });

      const multiCtx = pendingTrustMultiSourceContextRef.current;
      const sourceCount = multiCtx?.sourceCount ?? 1;
      const successfulSourceCount = multiCtx?.successfulSourceCount ?? 1;
      const mergedSignalCount =
        multiCtx?.mergedSignalCount ??
        (typeof result.debug?.signal_count === "number"
          ? result.debug.signal_count
          : Math.max((result.drivers ?? []).length, 0));
      const mergeMetaRecord = multiCtx?.mergeMeta;
      let sourceWeightsParsed: Record<string, number> | null = null;
      const sw0 = mergeMetaRecord?.source_weights;
      if (sw0 && typeof sw0 === "object" && !Array.isArray(sw0)) {
        const o: Record<string, number> = {};
        for (const [k, v] of Object.entries(sw0 as Record<string, unknown>)) {
          if (typeof v === "number" && Number.isFinite(v)) o[k] = v;
        }
        if (Object.keys(o).length > 0) sourceWeightsParsed = o;
      }

      const trustInput: NexoraTrustValidationInput = {
        pipelineStatus: "ready",
        fragilityLevel: normalizeFragilityLevelForUi(result.fragility_level),
        mergedSignalCount,
        sourceCount,
        successfulSourceCount,
        mergeWarnings: multiCtx?.bundleWarnings,
        drivers: enrichedDrivers,
        hasSummary: Boolean(result.summary?.trim()),
        sourceWeights: sourceWeightsParsed,
        domainId,
        executionOutcomeFeedback: loadExecutionOutcomeForRun(lastAuditRecordRef.current?.runId)?.outcomeLabel ?? null,
      };
      if (process.env.NODE_ENV !== "production") {
        const currentRunId = lastAuditRecordRef.current?.runId ?? null;
        const outcomeForRun = loadExecutionOutcomeForRun(currentRunId);
        const sig = `${currentRunId ?? "none"}|${outcomeForRun ? 1 : 0}`;
        if (sig !== lastB20Fix1OutcomeLookupSigRef.current) {
          lastB20Fix1OutcomeLookupSigRef.current = sig;
          globalThis.console?.debug?.("[Nexora][B20-FIX-1] outcome_lookup_resolved", {
            runId: currentRunId,
            hasOutcome: Boolean(outcomeForRun),
          });
        }
      }
      lastNexoraTrustEvaluationInputRef.current = trustInput;
      const trust = evaluateNexoraTrustValidation(trustInput);

      const decisionTone = adjustDecisionToneForTrust(
        decisionLayer.decisionTone,
        trust.confidenceTier,
        result.fragility_level,
        domainId
      );

      if (process.env.NODE_ENV !== "production") {
        const b13Bias = getB13TrustEvidenceBiasMerged(domainId, mergedSignalCount, successfulSourceCount);
        const b13DriverSig = driversEnrichmentSignature(rawDrivers, enrichedDrivers);
        const b13Applied = b13Bias !== 0 || b13DriverSig.split("::")[0] !== b13DriverSig.split("::")[1];
        if (b13Applied) {
          const b13Sig = `${domainId}:${b13Bias.toFixed(3)}:${b13DriverSig}`;
          if (b13Sig !== lastB13FrontSigRef.current) {
            lastB13FrontSigRef.current = b13Sig;
            globalThis.console?.debug?.("[Nexora][B13] domain_applied", {
              domainId,
              trustBias: b13Bias,
              driversTouched: b13DriverSig.split("::")[0] !== b13DriverSig.split("::")[1],
            });
          }
        }
        const tSig = buildNexoraTrustValidationSignature(trust);
        if (tSig !== lastB12TrustSigRef.current) {
          lastB12TrustSigRef.current = tSig;
          globalThis.console?.debug?.("[Nexora][B12] trust_validation_ready", {
            tier: trust.confidenceTier,
            score: trust.confidenceScore,
            warnings: trust.validationWarnings.length,
          });
        }
      }

      const trustPatch: Pick<
        NexoraPipelineStatusUi,
        "confidenceScore" | "confidenceTier" | "validationWarnings" | "trustSummaryLine"
      > = {
        confidenceScore: trust.confidenceScore,
        confidenceTier: trust.confidenceTier,
        validationWarnings: [...trust.validationWarnings],
        trustSummaryLine: trust.trustSummaryLine,
      };

      pipelineB7ActionContextRef.current = {
        posture: decisionLayer.posture,
        tradeoff: decisionLayer.tradeoff,
        nextMove: decisionLayer.recommendedAction,
        objectIds: [...alignedHighlightIds],
        drivers: enrichedDrivers.slice(0, 8).map((d) => ({
          id: String(d.id ?? ""),
          label: String(d.label ?? ""),
          score: typeof d.score === "number" ? d.score : undefined,
        })),
        fragilityLevel: result.fragility_level,
        summary: String(result.summary ?? ""),
      };
      const alignedSet = new Set(alignedHighlightIds);

      if (alignedHighlightIds.length > 0 && sceneObjectIds.length > 0) {
        for (const objectId of sceneObjectIds) {
          if (!alignedSet.has(objectId)) {
            setOverrideRef.current?.(objectId, { caption: "", showCaption: false });
          }
        }
        for (const objectId of alignedHighlightIds) {
          const cap = captions[objectId];
          if (cap) {
            setOverrideRef.current?.(objectId, { caption: cap, showCaption: true });
          }
        }
      }

      if (detail?.bridge !== "phase_b2") {
        commitPipelineStatusRef.current?.({
          ...createInitialPipelineStatusUi(),
          status: "ready",
          source: "scanner",
          signalsCount: typeof result.debug?.signal_count === "number" ? result.debug.signal_count : 0,
          mappedObjectsCount: countMappedObjectsFromFragilityScan(result),
          fragilityLevel: normalizeFragilityLevelForUi(result.fragility_level),
          summary: result.summary?.trim() ? result.summary.trim().slice(0, 160) : null,
          insightLine,
          decisionPosture: decisionLayer.posture,
          decisionTradeoff: decisionLayer.tradeoff,
          decisionNextMove: decisionLayer.recommendedAction,
          decisionTone,
          updatedAt: Date.now(),
          errorMessage: null,
          lastBridgeSource: "fragility_scan",
          ...trustPatch,
        });
      } else {
        mergePipelineStatusRef.current?.({
          decisionPosture: decisionLayer.posture,
          decisionTradeoff: decisionLayer.tradeoff,
          decisionNextMove: decisionLayer.recommendedAction,
          decisionTone,
          ...trustPatch,
        });
      }

      if (process.env.NODE_ENV !== "production") {
        const b5Sig = buildB5ClaritySignature({
          alignedHighlightIds,
          captions,
          insightLine,
        });
        if (
          alignedHighlightIds.length > 0 &&
          b5Sig !== lastB5ClaritySigRef.current &&
          shouldEmitStableNexoraTrace("b5", b5Sig)
        ) {
          lastB5ClaritySigRef.current = b5Sig;
          globalThis.console?.log?.("[Nexora][B5] clarity_applied", {
            highlights: alignedHighlightIds.length,
            hasInsight: Boolean(insightLine),
          });
        }
        const b7Sig = buildNexoraDecisionLayerSignature(decisionLayer);
        if (b7Sig !== lastB7DecisionSigRef.current && shouldEmitStableNexoraTrace("b7", b7Sig)) {
          lastB7DecisionSigRef.current = b7Sig;
          globalThis.console?.log?.("[Nexora][B7] decision_layer_ready", {
            tone: decisionTone,
            posture: decisionLayer.posture,
          });
        }
      }

      if (process.env.NODE_ENV !== "production" && detail?.bridge === "phase_b2") {
        const sceneLogKey = `${result.fragility_level}:${[...alignedHighlightIds].map(String).sort().join(",")}`;
        if (sceneLogKey !== lastB2SceneReactionLogRef.current && shouldEmitStableNexoraTrace("b2", sceneLogKey)) {
          lastB2SceneReactionLogRef.current = sceneLogKey;
          globalThis.console?.log?.("[Nexora][B2] scene_reaction_applied", {
            level: result.fragility_level,
            highlights: alignedHighlightIds.length,
          });
        }
      }
    };

    window.addEventListener("nexora:apply-fragility-scan", onApplyFragilityScan as EventListener);
    return () =>
      window.removeEventListener("nexora:apply-fragility-scan", onApplyFragilityScan as EventListener);
  }, [activeDomainExperience.experience.domainId, applyUnifiedSceneReaction, normalizeDecisionPayload, sceneJson]);
  const isRestoringRef = useRef(false);
  const [overridesVersion, setOverridesVersion] = useState(0);
  const autoBackupTimerRef = useRef<number | null>(null);
  const clearAllOverridesRef = useRef<() => void>(() => {});
  const pruneOverridesRef = useRef<(ids: string[]) => void>(() => {});
  const handleCompanyChange = useCallback((next: string) => {
    setCompanyId(next);
    setActiveCompanyIdState(next);
  }, []);
  const toggleSelectionLock = useCallback(() => {
    setSelectionLocked((v) => !v);
  }, []);
  const handleObjectHoverStart = useCallback((id: string) => {
    if (!id) return;
    if (tempHighlightRef.current[id]) return;
    const prevScale = overridesRef.current[id]?.scale;
    tempHighlightRef.current[id] = { prevScale };
    const baseScale = typeof prevScale === "number" ? prevScale : 1;
    const nextScale = Math.min(2, baseScale * 1.08);
    setOverrideRef.current?.(id, { scale: nextScale });
  }, []);
  const handleObjectHoverEnd = useCallback((id: string) => {
    if (!id) return;
    const prev = tempHighlightRef.current[id];
    if (!prev) return;
    const restoreScale = typeof prev.prevScale === "number" ? prev.prevScale : 1;
    setOverrideRef.current?.(id, { scale: restoreScale });
    delete tempHighlightRef.current[id];
  }, []);
  const preset = config?.scene_preset ?? null;
  const camPos =
    sceneJson?.scene?.camera?.pos ?? ([0, 3, 8] as [number, number, number]);

  // =====================
  // Nexora MVP Graph (backend mapping → DecisionGraph3D)
  // Source: scene_json.scene.nexora_mvp (added by backend/main.py)
  // We keep this strictly additive and non-breaking.
  // =====================
  const nexoraMvp = sceneJson?.scene?.["nexora_mvp"] ?? null;

  // Map Nexora MVP objects to the existing SceneCanvas object ids.
  // Goal: make reactions happen on your real cubes/objects (professional), not a separate overlay.
  const mapNexoraIdToSceneId = useCallback((id: string) => {
    const key = String(id || "").trim();
    if (!key) return null;
    // Backend mapping emits: obj_time, obj_inventory, obj_quality
    // Your existing business baseline objects typically include: obj_inventory, obj_delivery, obj_risk_zone
    if (key === "obj_inventory") return "obj_inventory";
    if (key === "obj_time") return "obj_delivery"; // time pressure visualized on delivery object
    if (key === "obj_quality") return "obj_risk_zone"; // quality risk visualized on risk zone (MVP)
    return key;
  }, []);

  const nexoraGraphObjects = useMemo(() => {
    const mvpRec = asRecord(nexoraMvp);
    const list: unknown[] = Array.isArray(mvpRec?.["objects"]) ? (mvpRec["objects"] as unknown[]) : [];
    return list
      .map((o: any) => {
        const id = String(o?.id ?? "").trim();
        if (!id) return null;
        const label = typeof o?.label === "string" && o.label.trim().length ? o.label : id;
        // Backend mapping uses `pos`; accept `position` (array or {x,y,z}) too for safety.
        const p = Array.isArray(o?.pos)
          ? o.pos
          : Array.isArray(o?.position)
          ? o.position
          : o?.position && typeof o.position === "object"
          ? [o.position.x, o.position.y, o.position.z]
          : [0, 0, 0];
        const pos: [number, number, number] = [Number(p[0] ?? 0), Number(p[1] ?? 0), Number(p[2] ?? 0)];
        const intensity = clamp(Number(o?.intensity ?? 0), 0, 1);
        const state = (o?.state === "stable" || o?.state === "warning" || o?.state === "critical") ? o.state : "stable";
        const opacity = Number.isFinite(o?.opacity) ? clamp(Number(o.opacity), 0, 1) : undefined;
        const visible = typeof o?.visible === "boolean" ? o.visible : true;
        return { id, label, pos, intensity, state, opacity, visible };
      })
      .filter(Boolean) as any[];
  }, [nexoraMvp]);

  const nexoraGraphLoops = useMemo(() => {
    const mvpRec = asRecord(nexoraMvp);
    const list: unknown[] = Array.isArray(mvpRec?.["loops"]) ? (mvpRec["loops"] as unknown[]) : [];
    return list
      .map((l: any) => {
        const id = String(l?.id ?? "").trim();
        if (!id) return null;
        const label = typeof l?.label === "string" ? l.label : undefined;
        const path = Array.isArray(l?.path) ? l.path.map((x: any) => String(x)) : [];
        if (path.length < 2) return null;
        const intensity = clamp(Number(l?.intensity ?? 0), 0, 1);
        const pulseSpeed = Number.isFinite(l?.pulseSpeed) ? Number(l.pulseSpeed) : undefined;
        const active = typeof l?.active === "boolean" ? l.active : true;
        return { id, label, path, intensity, pulseSpeed, active };
      })
      .filter(Boolean) as any[];
  }, [nexoraMvp]);
  const applyOverridePatch = useCallback(
    (id: string, patch: { scale?: number; opacity?: number }) => {
      setOverrideRef.current?.(id, patch);
    },
    []
  );

  useEmotionalFxEngine({
    sceneReady: !!sceneJson,
    mapNexoraIdToSceneId,
    nexoraMvp,
    effectiveActiveLoopId,
    loops,
    kpi,
    setOverride: applyOverridePatch,
  });

  // Derived: which loops are currently visible based on focus + showLoops
  const visibleLoops = useMemo(() => {
    if (!showLoops) return [];
    if (!Array.isArray(loops)) return [];
    const effectiveFocusId = focusMode === "selected" && focusedId ? focusedId : null;
    if (!effectiveFocusId) return loops;
    return loops.filter(
      (loop) =>
        loop &&
        Array.isArray((loop as any).edges) &&
        (loop as any).edges.some((edge: any) => edge && (edge.from === effectiveFocusId || edge.to === effectiveFocusId))
    );
  }, [loops, focusMode, focusedId, showLoops]);
  const strategicState = useStrategicRadar({
    loops,
    kpi,
    memory,
    activeLoopId: effectiveActiveLoopId,
  });
  const lastRiskLevelRef = useRef<string | null>(null);
  const riskResult = useMemo(() => {
    return computeRiskLevel({
      strategicState,
      loops: visibleLoops,
      kpis: kpi ? [kpi] : [],
    });
  }, [strategicState, visibleLoops, kpi]);

  const rankRiskLevel = useCallback((l: string | null) => {
    if (l === "critical") return 3;
    if (l === "high") return 2;
    if (l === "medium") return 1;
    return 0;
  }, []);

  // Persist risk events only when risk level escalates.
  useEffect(() => {
    const prev = lastRiskLevelRef.current;
    if (
      riskResult.level !== prev &&
      rankRiskLevel(riskResult.level) > rankRiskLevel(prev)
    ) {
      appendRiskEvent({ ts: Date.now(), ...riskResult });
    }
    lastRiskLevelRef.current = riskResult.level;
  }, [riskResult, rankRiskLevel]);

  // UI alert state (only show for high/critical and prefer stronger signals)
  useEffect(() => {
    setAlert((prev) => {
      if (riskResult.level !== "high" && riskResult.level !== "critical") {
        return null;
      }
      if (!prev) return riskResult;
      const prevRank = rankRiskLevel(prev.level);
      const nextRank = rankRiskLevel(riskResult.level);
      if (nextRank > prevRank) return riskResult;
      if (nextRank === prevRank && riskResult.score > prev.score + 5) return riskResult;
      return prev;
    });
  }, [riskResult, rankRiskLevel]);
  const starCount = Math.round(800 + (6000 - 800) * Math.max(0, Math.min(1, prefs.starDensity)));
  const backgroundMode = prefs.theme;
  const cameraMode = prefs.orbitMode === "manual" ? "fixed" : "orbit";
  const starCountControl = Math.round(Math.max(0, Math.min(2000, prefs.starDensity * 2000)));
  const setBackgroundMode = useCallback((mode: "day" | "night" | "stars") => {
    setPrefs((prev) => ({ ...prev, theme: mode }));
  }, [setPrefs]);
  const setCameraMode = useCallback((mode: "orbit" | "fixed") => {
    const next = mode === "fixed" ? "manual" : "auto";
    setPrefs((prev) => ({ ...prev, orbitMode: next }));
  }, [setPrefs]);
  const setStarCount = useCallback((value: number) => {
    const next = clamp(Number(value) / 2000, 0, 1);
    setPrefs((prev) => ({ ...prev, starDensity: next }));
  }, [setPrefs]);
  const lastCompanyRef = useRef<string | null>(null);
  useEffect(() => {
    const cid = config?.company_id || null;
    if (!cid) return;
    if (lastCompanyRef.current === cid) return;
    lastCompanyRef.current = cid;
    if (!preset) return;
    if (preset.backgroundMode) setBackgroundMode(preset.backgroundMode);
    if (typeof preset.starCount === "number") setStarCount(preset.starCount);
    if (preset.cameraMode) setCameraMode(preset.cameraMode);
    if (typeof preset.showAxes === "boolean") setShowAxes(preset.showAxes);
    if (typeof preset.showGrid === "boolean") setShowGrid(preset.showGrid);
    if (typeof preset.showCameraHelper === "boolean") setShowCameraHelper(preset.showCameraHelper);
  }, [
    config?.company_id,
    preset?.backgroundMode,
    preset?.starCount,
    preset?.cameraMode,
    preset?.showAxes,
    preset?.showGrid,
    preset?.showCameraHelper,
  ]);
  const updateObjectUx = useCallback(
    (id: string, patch: { opacity?: number; scale?: number }) => {
      if (!id) return;
      setObjectUxById((prev) => ({
        ...prev,
        [id]: { ...(prev[id] ?? {}), ...patch },
      }));
      setSelectedObjectInfo((prev) => {
        if (!prev || prev.id !== id) return prev;
        return { ...prev, ...patch };
      });
    },
    []
  );

  const applyUICommands = useCallback(
    (commands: UICommand[]) => {
      if (!Array.isArray(commands)) return;
      for (const cmd of commands) {
        if (!cmd || typeof cmd !== "object") continue;
        if (cmd.type === "select") {
          const id = cmd.id ?? null;
          selectedSetterRef.current?.(id);
          // Use the real selection policy handler to keep all derived UI state consistent.
          handleSelectedChange(id);
          continue;
        }
        if (cmd.type === "pin") {
          if (typeof cmd.id === "string") focusActions?.pin?.(cmd.id);
          continue;
        }
        if (cmd.type === "unpin") {
          focusActions?.unpin?.();
          continue;
        }
        if (cmd.type === "setObjectUx") {
          if (typeof cmd.id === "string" && cmd.patch && typeof cmd.patch === "object") {
            updateObjectUx(cmd.id, cmd.patch);
          }
          continue;
        }
        if (cmd.type === "toast") {
          if (typeof cmd.message === "string" && cmd.message.trim()) {
            setMessages((m) => appendMessages(m, [makeMsg("assistant", cmd.message)]));
          }
          continue;
        }
      }
    },
    [focusActions, handleSelectedChange, updateObjectUx]
  );

  const runMonteCarloOnce = useCallback(async () => {
    if (mcLoading) return;
    if (!episodeId) {
      setMcError("No episode_id yet. Send one chat message first to create an episode.");
      return;
    }

    setMcLoading(true);
    setMcError(null);

    try {
      const res = await fetch(`${BACKEND_BASE}/montecarlo/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ episode_id: episodeId, n: 200, sigma: 0.08, seed: 7 }),
      });

      const j = await res.json().catch(() => null);
      const data = (j && typeof j === "object" ? ((j as any).data ?? j) : null) as any;

      if (!res.ok || !data || data?.ok === false || data?.error || data?.detail?.error) {
        const msg =
          data?.detail?.error?.message ||
          data?.error?.message ||
          (typeof data?.detail === "string" ? data.detail : null) ||
          `Monte Carlo failed (HTTP ${res.status})`;
        setMcError(String(msg));
        return;
      }

      setMcResult(data?.result ?? null);
      setMcReport(data?.manager_report ?? null);
    } catch (e: any) {
      setMcError(e?.message ?? "Monte Carlo request failed");
    } finally {
      setMcLoading(false);
    }
  }, [episodeId, mcLoading]);

  const simulateStep = useCallback(async () => {
    if (loading) return;
    // Focus requirement
    if (focusMode === "selected") {
      const focusCandidate = focusedId;
      if (!focusCandidate) {
        setMessages((m) => appendMessages(m, [makeMsg("assistant", "No focused object. Click an object first.")]));
        setLastActions([]);
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    setSimLastError(null);
    try {
      const payload = buildChatRequestPayload("__tick__");
      const raw = await chatToBackend(payload);
      const data = raw as BackendChatResponse;
      applyGuardedResponsePayload(data, "feedback", "Simulation tick payload updated.");
      if (!data || (data as any).ok === false || (data as any).error) {
        setSimLastError(((data as any)?.error?.message as string | undefined) ?? "Simulation tick failed");
        setLoading(false);
        return;
      }
      const viewModel = deriveProductFlowViewModel(data, sceneJson);
      const nextActions = Array.isArray(data.actions) ? (data.actions as any[]) : [];
      setLastActions(nextActions);
      applyProductFlowViewModel(data, viewModel, { applyActionsToScene: true, syncSceneState: false });
      if (typeof data.reply === "string" && data.reply.trim().length > 0) {
        setMessages((m) => appendMessages(m, [makeMsg("assistant", data.reply ?? "")]));
      }
    } catch (err: any) {
      setSimLastError(err?.message ?? "Simulation tick failed");
    } finally {
      setLoading(false);
    }
  }, [
    activeMode,
    applyProductFlowViewModel,
    buildChatRequestPayload,
    deriveProductFlowViewModel,
    focusMode,
    focusedId,
    loading,
    sceneJson,
  ]);

  useEffect(() => {
    if (!simRunning) return;
    const intervalMs = Math.max(200, 1200 / Math.max(0.1, simSpeed));
    const id = window.setInterval(() => {
      simulateStep();
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [simRunning, simSpeed, simulateStep]);

  const handleAddInventoryInstance = useCallback(() => {
    const createdId = `obj_inventory_${Date.now()}`;
    setSceneJson((prev) => {
      if (!prev) return prev;
      const next = { ...prev, scene: { ...prev.scene } };
      const objs = Array.isArray(next.scene.objects) ? [...next.scene.objects] : [];
      const idx = objs.filter((o: any) => (o.type === "type_inventory" || o.id?.startsWith("obj_inventory"))).length + 1;
      const ux = getUxForObject(createdId) ?? { shape: "cube", base_color: "#3498db" };
      objs.push({
        id: createdId,
        type: "box",
        color: ux.base_color,
        scale: 1,
        emphasis: 0,
        position: [objs.length * 1.6, 0, 0],
      });
      next.scene.objects = objs;
      return next;
    });
    selectedSetterRef.current(createdId);
    setFocusedId((prev) => prev ?? createdId);
    setFocusMode("selected");
  }, [getUxForObject, setFocusedId, setFocusMode]);

  const handleAddLoopFromTemplate = useCallback(
    (type: LoopType) => {
      const loop = makeLoopFromTemplate(type);
      setLoops((prev) => {
        const next = Array.isArray(prev) ? [...prev] : [];
        next.push(loop);
        return next;
      });
      selectLoop(loop.id);
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.debug("[templates] added loop", loop.type, loop.id);
      }
    },
    [selectLoop]
  );
  const toggleFocusMode = useCallback(() => {
    setFocusMode((m) => {
      const next = m === "all" ? "selected" : "all";
      applyFocusModeToStore(next);
      if (next === "all" && !focusPinned) {
        setFocusedId(null);
      }
      return next;
    });
  }, [applyFocusModeToStore, focusPinned, setFocusedId]);

  useEffect(() => {
    handleSelectedChangeRef.current = handleSelectedChange;
  }, [handleSelectedChange]);

  useEffect(() => {
    const workspace = loadWorkspaceSnapshot();
    if (workspace?.projects && typeof workspace.projects === "object") {
      const workspaceId = String(workspace.id || DEFAULT_WORKSPACE_ID);
      const nextActiveProjectId = String(workspace.activeProjectId || DEFAULT_PROJECT_ID);
      setActiveWorkspaceId(workspaceId);
      setWorkspaceProjects(workspace.projects);
      setActiveProjectId(nextActiveProjectId);
      const restored = pickWorkspaceProjectForHydrate(
        workspace.projects,
        nextActiveProjectId,
        DEFAULT_PROJECT_ID
      );
      if (restored) {
        applyWorkspaceProjectState(restored);
      }
    }

    const loaded = loadProject();
    if (loaded) {
      const loadedState = buildWorkspaceProjectStateFromLoadedProject(loaded, DEFAULT_PROJECT_ID);
      setActiveProjectId(loadedState.id);
      setWorkspaceProjects((prev) => ({ ...prev, [loadedState.id]: loadedState }));
      applyWorkspaceProjectState(loadedState);
      if (loaded.sessionId) {
        try {
          window.localStorage.setItem(SESSION_KEY, loaded.sessionId);
        } catch {
          // ignore
        }
      }
    }
    try {
      const storedPrefs = loadPrefsFromStorage();
      if (storedPrefs) {
        setPrefs(storedPrefs);
      }
      const memRaw = window.localStorage.getItem(MEMORY_KEY);
      if (memRaw) {
        const parsedMem = JSON.parse(memRaw);
        if (parsedMem?.version === "1") {
          setMemory(parsedMem as MemoryStateV1);
        }
      }
      const autoRaw = window.localStorage.getItem(AUTO_BACKUP_KEY);
      if (autoRaw === "true") setAutoBackupEnabled(true);
      else if (autoRaw === "false") setAutoBackupEnabled(false);
    } catch {
      // ignore
    }
    // Health check is handled via the HUD ping button; avoid extra imports here.
    setWorkspaceHydrated(true);
  }, [applyWorkspaceProjectState]);

  useEffect(() => {
    if (isRestoringRef.current) return;
    try {
      window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    } catch {
      // ignore
    }
  }, [prefs]);

  useEffect(() => {
    if (isRestoringRef.current || projectHydratingRef.current) return;
    const next = buildActiveProjectState(activeProjectId);
    setWorkspaceProjects((prev) => ({ ...prev, [activeProjectId]: next }));
  }, [
    activeProjectId,
    buildActiveProjectState,
    sceneJson,
    messages,
    activeMode,
    episodeId,
    selectedObjectIdState,
    focusedId,
    focusMode,
    focusPinned,
    loops,
    activeLoopId,
    selectedLoopId,
    objectUxById,
    conflicts,
    objectSelection,
    memoryInsights,
    riskPropagation,
    strategicAdvice,
    strategyKpi,
    decisionCockpit,
    productModeContext,
    aiReasoning,
    platformAssembly,
    autonomousExploration,
    opponentModel,
    strategicPatterns,
    responseData,
    kpi,
    sourceLabel,
    lastAnalysisSummary,
  ]);

  useEffect(() => {
    if (projectHydratingRef.current) return;
    if (!isFeatureEnabled(environmentConfig, "autonomous_exploration")) return;
    const sceneSignature = buildExplorationSceneSignature(sceneJson);
    if (!sceneSignature) return;
    const currentProjectId = activeProjectId || DEFAULT_PROJECT_ID;
    if (autonomousExploreSignatureRef.current[currentProjectId] === sceneSignature) return;

    if (String((autonomousExploration as any)?.scene_signature ?? "") === sceneSignature) {
      autonomousExploreSignatureRef.current[currentProjectId] = sceneSignature;
      return;
    }

    const result = runAutonomousScenarioExploration({
      projectId: currentProjectId,
      sceneJson,
      semanticObjectMeta: objectProfiles,
      modeContext: productModeContext,
      strategyContext: {
        at_risk_kpis: Array.isArray((strategyKpi as any)?.summary?.at_risk_kpis)
          ? (strategyKpi as any).summary.at_risk_kpis
          : [],
        threatened_objectives: Array.isArray((strategyKpi as any)?.summary?.threatened_objectives)
          ? (strategyKpi as any).summary.threatened_objectives
          : [],
      },
      maxScenarios: environmentConfig.runtime_safety.max_scenarios_per_run,
      timeBudgetMs: environmentConfig.runtime_safety.max_exploration_time_ms,
      importanceThreshold: 0.42,
    });
    autonomousExploreSignatureRef.current[currentProjectId] = sceneSignature;
    if (!result) return;

    const explorationPayload = {
      ...result,
      source: "autonomous_scenario_explorer",
      scene_signature: sceneSignature,
    };
    setAutonomousExploration(explorationPayload);
    setMemoryInsights((prev: any) => {
      const base = prev && typeof prev === "object" ? prev : {};
      const prevSig = String(base?.autonomous_exploration?.scene_signature ?? "");
      if (prevSig === sceneSignature) return base;
      return {
        ...base,
        autonomous_exploration: {
          scene_signature: sceneSignature,
          generated_at: explorationPayload.generated_at,
          summary: explorationPayload.summary,
          top_mitigation_ideas: explorationPayload.summary?.top_mitigation_ideas ?? [],
        },
      };
    });
    setResponseData((prev: any) => {
      if (!prev || typeof prev !== "object") return prev;
      const prevSig =
        String(prev?.autonomous_exploration?.scene_signature ?? "") ||
        String(prev?.context?.autonomous_exploration?.scene_signature ?? "");
      if (prevSig === sceneSignature) return prev;
      const prevContext = prev?.context && typeof prev.context === "object" ? prev.context : {};
      return normalizeDecisionPayload({
        ...prev,
        autonomous_exploration: explorationPayload,
        context: {
          ...prevContext,
          autonomous_exploration: explorationPayload,
        },
      }).payload;
    });
    emitDecisionTrace({
      stage: "feedback",
      projectId: activeProjectId,
      confidence: null,
      summary: "Autonomous exploration payload updated.",
      metadata: {
        scene_signature: sceneSignature,
      },
    });
  }, [
    activeProjectId,
    autonomousExploration,
    buildExplorationSceneSignature,
    emitDecisionTrace,
    environmentConfig,
    normalizeDecisionPayload,
    objectProfiles,
    productModeContext,
    sceneJson,
    strategyKpi,
  ]);

  useEffect(() => {
    saveWorkspaceSnapshot({
      id: activeWorkspaceId,
      activeProjectId,
      projects: workspaceProjects,
    });
    const activeProject = workspaceProjects[activeProjectId];
    if (activeProject) {
      saveProjectSnapshot(activeProject);
    }
  }, [activeWorkspaceId, activeProjectId, workspaceProjects]);

  useEffect(() => {
    try {
      window.localStorage.setItem(AUTO_BACKUP_KEY, String(autoBackupEnabled));
    } catch {
      // ignore
    }
  }, [autoBackupEnabled]);

  useEffect(() => {
    if (prefs.orbitMode === "auto") setCameraLockedByUser(false);
  }, [prefs.orbitMode]);

  useEffect(() => {
    let cancelled = false;
    fetch(`${BACKEND_BASE}/objects`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const list: any[] = Array.isArray(data?.objects)
          ? data.objects
          : Array.isArray(data)
          ? data
          : [];
        const map: Record<
          string,
          {
            id: string;
            label: string;
            summary: string;
            tags: string[];
            one_liner?: string;
            synonyms?: string[];
            domain_hints?: Record<string, string[]>;
            ux?: { shape?: string; base_color?: string };
          }
        > = {};
        list.forEach((entry) => {
          if (!entry || typeof entry !== "object") return;
          const id = entry.id;
          if (!id || typeof id !== "string") return;
          map[id] = {
            id,
            label: entry.label ?? id,
            summary: entry.summary ?? "",
            tags: Array.isArray(entry.tags) ? entry.tags : [],
            one_liner: typeof entry.one_liner === "string" ? entry.one_liner : undefined,
            synonyms: Array.isArray(entry.synonyms) ? entry.synonyms : undefined,
            domain_hints:
              typeof entry.domain_hints === "object" && entry.domain_hints
                ? (entry.domain_hints as Record<string, string[]>)
                : undefined,
            ux: typeof entry.ux === "object" && entry.ux ? entry.ux : undefined,
          };
        });
        setObjectProfiles(map);
      })
      .catch(() => {
        // ignore fetch errors; scene-based object resolution still works
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const id = selectedIdRef.current;
    if (id) {
      updateSelectedObjectInfo(id);
    }
  }, [sceneJson, updateSelectedObjectInfo]);

  useEffect(() => {
    const baseLoops = normalizeLoops(sceneJson?.scene?.loops ?? []);
    const objs = Array.isArray(sceneJson?.scene?.objects) ? sceneJson.scene.objects : [];
    const resolvedLoops = resolveLoopPlaceholders(baseLoops, objs);
    if (process.env.NODE_ENV !== "production") {
      // Dev visibility: how many loops survive placeholder resolution
      console.debug("[loops] resolved", { before: baseLoops.length, after: resolvedLoops.length });
    }
    setLoops(resolvedLoops);

    const nextActive = sceneJson?.scene?.active_loop ?? null;
    setActiveLoopId(nextActive ?? null);

    const nextSuggestions = sceneJson?.scene?.loops_suggestions;
    if (Array.isArray(nextSuggestions)) setLoopSuggestions(nextSuggestions);
  }, [sceneJson]);

  useEffect(() => {
    if (isRestoringRef.current) return;
    if (!Array.isArray(loops) || loops.length === 0) return;

    let signature = "";
    try {
      signature = JSON.stringify({ loops, activeLoopId: activeLoopId ?? null });
    } catch {
      signature = "";
    }

    if (signature && signature === lastSnapshotRef.current) return;

    const timer = window.setTimeout(() => {
      try {
        const snapshot: DecisionSnapshot = {
          id: `ds_${Date.now()}`,
          timestamp: Date.now(),
          projectId,
          loops,
          activeLoopId: activeLoopId ?? null,
        };
        const next = appendSnapshot(projectId, snapshot);
        setSnapshots(next);
        lastSnapshotRef.current = signature;
        if (process.env.NODE_ENV !== "production") {
          console.debug("[decision] saved snapshot", snapshot.id);
        }
      } catch {
        // ignore persistence errors
      }
    }, 800);

    return () => window.clearTimeout(timer);
  }, [loops, activeLoopId, projectId]);

  useEffect(() => {
    const onSaveDecisionSnapshot = () => {
      saveDecisionSnapshotNow();
    };
    window.addEventListener("nexora:save-decision-snapshot", onSaveDecisionSnapshot as EventListener);
    return () => window.removeEventListener("nexora:save-decision-snapshot", onSaveDecisionSnapshot as EventListener);
  }, [saveDecisionSnapshotNow]);

  useEffect(() => {
    selectedObjectInfoRef.current = selectedObjectInfo;
  }, [selectedObjectInfo]);

  const emitChatResult = useCallback((reply: string, ok: boolean, requestId?: string) => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
      new CustomEvent("nexora:chat-result", {
        detail: { reply, ok, requestId },
      })
    );
  }, []);

  const pulseObjectByText = useCallback((text: string) => {
    const t = String(text || "").toLowerCase();
    const isRetailDemo = readSceneJsonMetaString(sceneJson, "demo_id").toLowerCase() === RETAIL_DEMO_ID;

    const pulseTargets = (ids: string[]) => {
      if (!Array.isArray(ids) || !ids.length) return;
      const focusId = ids[0];
      selectedSetterRef.current(focusId);
      setFocusedId(focusId);
      setFocusMode("selected");
      setViewMode("input");
      ids.forEach((id, idx) => {
        const prevScale = overridesRef.current[id]?.scale;
        const nextScale = clamp(typeof prevScale === "number" ? prevScale + 0.14 : 1.14, 0.2, 2);
        setOverrideRef.current?.(id, { scale: nextScale, opacity: 1 });
        window.setTimeout(() => {
          const restoreScale = typeof prevScale === "number" ? prevScale : 1;
          setOverrideRef.current?.(id, { scale: restoreScale });
        }, 520 + idx * 40);
      });
    };

    if (isRetailDemo) {
      const pulseIds = resolveRetailDemoPulseObjectIdsForPrompt(text);
      if (pulseIds?.length) {
        pulseTargets(pulseIds);
        return;
      }
    }

    const map: Array<{ test: RegExp; ids: string[] }> = [
      { test: /\binventory\b|\bstock\b/, ids: ["obj_inventory"] },
      { test: /\bsupplier\b/, ids: ["obj_supplier"] },
      { test: /\bdelivery\b|\bdisruption\b|\bdelay\b/, ids: ["obj_delivery"] },
      { test: /\bdemand\b|\bspike\b/, ids: ["obj_demand"] },
      { test: /\bprice\b|\bincrease\b/, ids: ["obj_price"] },
    ];
    const hit = map.find((m) => m.test.test(t));
    if (!hit) return;
    pulseTargets(hit.ids);
  }, [sceneJson, setFocusedId, setFocusMode, setViewMode]);

  useEffect(() => {
    const loaded = loadSnapshots(projectId);
    setSnapshots(loaded);
    if (loaded.length) {
      const last = loaded[loaded.length - 1];
      try {
        lastSnapshotRef.current = JSON.stringify({
          loops: last.loops,
          activeLoopId: last.activeLoopId ?? null,
        });
      } catch {
        lastSnapshotRef.current = null;
      }
    } else {
      lastSnapshotRef.current = null;
    }
  }, [projectId]);

  const isLatestChatRequest = useCallback((seq: number) => {
    return chatRequestSeqRef.current === seq;
  }, []);

  const finalizeChatRequest = useCallback(
    (seq: number, status: ChatRequestLifecycleStatus, options?: { clearInput?: boolean }) => {
      if (activePanelFamilyAuditRef.current?.seq === seq) {
        const auditToClear = activePanelFamilyAuditRef.current;
        if (pendingPanelFamilyAuditClearTimeoutRef.current !== null) {
          window.clearTimeout(pendingPanelFamilyAuditClearTimeoutRef.current);
        }
        pendingPanelFamilyAuditClearTimeoutRef.current = window.setTimeout(() => {
          const currentAudit = activePanelFamilyAuditRef.current;
          if (!currentAudit || currentAudit.seq !== seq) {
            pendingPanelFamilyAuditClearTimeoutRef.current = null;
            return;
          }
          activePanelFamilyAuditRef.current = null;
          lastPanelFamilyAuditKeyRef.current = null;
          lastClearedPanelFamilyAuditRef.current = {
            ...currentAudit,
            clearedAt: Date.now(),
            clearReason: `finalize_request:${status}`,
          };
          traceAuditRef("clear", {
            source: currentAudit.source,
            seq: currentAudit.seq,
            prompt: currentAudit.prompt,
            expectedFamily: currentAudit.expectedFamily ?? null,
            contractRenderable: currentAudit.contractRenderable === true,
            contractSalvaged: currentAudit.contractSalvaged === true,
            reason: `finalize_request:${status}`,
          });
          pendingPanelFamilyAuditClearTimeoutRef.current = null;
        }, 0);
      }
      if (activeChatRequestRef.current?.seq === seq) {
        window.clearTimeout(activeChatRequestRef.current.timeoutId);
        activeChatRequestRef.current = null;
      }
      if (!isLatestChatRequest(seq)) return;
      if (process.env.NODE_ENV !== "production") {
        console.log("[Nexora][HomeScreen][LoadingState]", {
          phase: "finalize_request",
          status,
          panelView: rightPanelState.view ?? null,
          hasVisiblePanelState: Boolean(
            visibleResponseData ?? visibleStrategicAdvice ?? visibleDecisionCockpit ?? visibleRiskPropagation
          ),
          hasVisibleSceneState: Boolean(visibleSceneJson),
          hasVisibleSelection: Boolean(visibleSelectedObjectId ?? visibleFocusedId ?? visibleObjectSelection),
        });
      }
      setChatRequestStatus(status);
      setLoading(false);
      isSendingRef.current = false;
      if (options?.clearInput) {
        setInput("");
      }
    },
    [
      isLatestChatRequest,
      traceAuditRef,
      rightPanelState.view,
      visibleDecisionCockpit,
      visibleFocusedId,
      visibleObjectSelection,
      visibleResponseData,
      visibleRiskPropagation,
      visibleSceneJson,
      visibleSelectedObjectId,
      visibleStrategicAdvice,
    ]
  );

  const sendText = useCallback(async (textRaw: string, requestId?: string, options?: SendTextOptions) => {
    const text = textRaw.trim();
    if (!text) return;
    if (options?.source !== "demo") {
      demoFlowPauseRef.current();
    }
    if (activeChatRequestRef.current) {
      window.clearTimeout(activeChatRequestRef.current.timeoutId);
      activeChatRequestRef.current.controller.abort();
    }
    const requestSeq = nextDemoFlowSequence(chatRequestSeqRef);
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      const active = activeChatRequestRef.current;
      if (!active || active.seq !== requestSeq) return;
      active.timedOut = true;
      controller.abort();
    }, DEFAULT_CHAT_REQUEST_TIMEOUT_MS);
    activeChatRequestRef.current = {
      seq: requestSeq,
      controller,
      timeoutId,
      timedOut: false,
    };
    const chatCorrelationId = `chat-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    activeChatDebugCorrelationRef.current = chatCorrelationId;
    emitDebugEvent({
      type: "chat_submitted",
      layer: "chat",
      source: "HomeScreen",
      status: "info",
      message: "Chat message submitted",
      metadata: {
        textLength: text.length,
        source: options?.source ?? "user",
        requestId: requestId ?? null,
        requestSeq,
        mode: activeMode,
        domain: activeDomainExperience.experience.domainId,
      },
      correlationId: chatCorrelationId,
    });
    const finishLocalChatDebug = (path: string, extra?: Record<string, unknown>) => {
      emitDebugEvent({
        type: "chat_local_shortcut",
        layer: "chat",
        source: "HomeScreen",
        status: "info",
        message: `Local chat path: ${path}`,
        metadata: {
          path,
          requestSeq,
          skippedMainPipeline: true,
          skippedBackend: true,
          ...extra,
        },
        correlationId: chatCorrelationId,
      });
      emitDebugEvent({
        type: "chat_response_completed",
        layer: "chat",
        source: "HomeScreen",
        status: "ok",
        message: "Chat turn finished (local handler)",
        metadata: { path, requestSeq, localShortcut: true, ...extra },
        correlationId: chatCorrelationId,
      });
      emitGuardRailAlerts(
        runGuardChecks(
          { trigger: "chat_response", chat: { chatCorrelationId }, correlationId: chatCorrelationId },
          getRecentDebugEvents()
        )
      );
      if (activeChatDebugCorrelationRef.current === chatCorrelationId) {
        activeChatDebugCorrelationRef.current = null;
      }
    };
    traceDemoFlowEvent({
      phase: "started",
      source: options?.source ?? "chat",
      seq: requestSeq,
      requestId,
      detail: { textLength: text.length },
    });
    isSendingRef.current = true;
    setChatRequestStatus("submitting");
    if (process.env.NODE_ENV !== "production") {
      console.log("[Nexora][HomeScreen][ChatSubmit]", {
        phase: "submit_start",
        panelView: rightPanelState.view ?? null,
        hasVisiblePanelState: Boolean(
          visibleResponseData ?? visibleStrategicAdvice ?? visibleDecisionCockpit ?? visibleRiskPropagation
        ),
        hasVisibleSceneState: Boolean(visibleSceneJson),
        selectedObjectId: visibleSelectedObjectId ?? null,
        focusedId: visibleFocusedId ?? null,
      });
    }
    pulseObjectByText(text);
    let lifecycleStatus: ChatRequestLifecycleStatus = "submitting";
    let shouldClearInput = false;

    if (/\bfocus\b/i.test(text)) {
      const candidateId = selectedIdRef.current ?? selectedObjectIdState ?? null;
      const cmds: UICommand[] = [];
      if (candidateId) cmds.push({ type: "select", id: candidateId });
      cmds.push({ type: "toast", message: "Focus applied" });
      applyUICommands(cmds);
    }

    // Handle selected-object size commands first (no backend call)
    try {
      const hasSelectedKeyword = /\bselected\b/i.test(text);
      const selectedId = selectedIdRef.current;
      if (hasSelectedKeyword) {
        if (!selectedId) {
          const reply = "⚠️ No object selected. Click an object first.";
          const userMsg = makeMsg("user", text);
          const assistantMsg = makeMsg("assistant", reply);
          const nextMessages = appendMessages(messagesRef.current, [userMsg, assistantMsg]);
          setMessages(nextMessages);
          emitChatResult(reply, true, requestId);
          setNoSceneUpdate(false);
          setSourceLabel(null);
          const snapshot = buildPersistedProjectSnapshot({
            activeMode,
            sceneJson,
            messages: nextMessages,
          });
          saveProject(snapshot);
          pushHistory(snapshot);
          lifecycleStatus = "success";
          shouldClearInput = true;
          finishLocalChatDebug("selected_size_no_selection");
          return;
        }

        const cur = overridesRef.current[selectedId]?.scale ?? 1;
        const sel = parseSelectedSizeCommand(text, cur);
        if (sel.handled) {
          const userMsg = makeMsg("user", text);
          const assistantMsg = makeMsg("assistant", sel.reply);
          const nextMessages = appendMessages(messagesRef.current, [userMsg, assistantMsg]);
          setMessages(nextMessages);
          emitChatResult(sel.reply, true, requestId);
          // apply override
          setOverrideRef.current(selectedId, { scale: sel.nextScale });
          setNoSceneUpdate(false);
          setSourceLabel(null);
          const snapshot = buildPersistedProjectSnapshot({
            activeMode,
            sceneJson,
            messages: nextMessages,
          });
          saveProject(snapshot);
          pushHistory(snapshot);
          lifecycleStatus = "success";
          shouldClearInput = true;
          finishLocalChatDebug("selected_size_command");
          return;
        }
      }
    } catch (err) {
      // fall through to normal flow on any error
    }

    // Global size commands handled next
    const sizeResult = parseSizeCommand(text, prefs.globalScale);
    if (sizeResult.handled) {
      const userMsg = makeMsg("user", text);
      const assistantMsg = makeMsg("assistant", sizeResult.reply);
      const nextMessages = appendMessages(messagesRef.current, [userMsg, assistantMsg]);
      setMessages(nextMessages);
      emitChatResult(sizeResult.reply, true, requestId);
      setPrefs((prev) => ({ ...prev, globalScale: sizeResult.nextScale }));
      setNoSceneUpdate(false);
      setSourceLabel(null);
      const snapshot = buildPersistedProjectSnapshot({
        activeMode,
        sceneJson,
        messages: nextMessages,
      });
      saveProject(snapshot);
      pushHistory(snapshot);
      lifecycleStatus = "success";
      shouldClearInput = true;
      finishLocalChatDebug("global_size_command");
      return;
    }

    // Decision router (deterministic, local)
    // IMPORTANT: Only handle locally when there are actual deterministic actions to apply.
    // Otherwise, fall through to the backend so the chat remains useful.
    const focusedObjectId: string | undefined =
      focusModeStore === "pinned" ? (pinnedId ?? undefined) : (focusedId ?? undefined);

    const availableSceneObjectIds = Array.isArray(sceneJson?.scene?.objects)
      ? sceneJson.scene.objects
          .map((obj: SceneObject, idx: number) => String(obj?.id ?? obj?.name ?? `${obj?.type ?? "obj"}:${idx}`))
          .filter(Boolean)
      : [];

    const intentRoute = resolveNexoraIntentRoute({
      text,
      activeMode,
      activeDomain: activeDomainExperience.experience.domainId,
      currentRightPanelTab: rightPanelState.view,
      selectedObjectId: selectedObjectIdState,
      availableSceneObjectIds,
      sceneJson,
      objectProfiles: objectProfiles as Record<string, unknown>,
      productModeContext: productModeContext as Record<string, unknown> | null,
    });

      if (process.env.NODE_ENV !== "production") {
        console.log("[Nexora][IntentRouter]", intentRoute);
      }

      const { requestedView, expectedFamily } = resolvePreferredPanelFamilyFromIntent(
        intentRoute.preferredPanel,
        "action_intent"
      );
      if (requestedView === null && options?.guidedPrompt) {
        logPanelGuidedPromptWarn({
          phase: "skipped_empty_view",
          rawView: intentRoute.preferredPanel ?? null,
          source: options?.source ?? "user",
          prompt: options.guidedPrompt.prompt ?? text,
        });
      }
      if (pendingPanelFamilyAuditClearTimeoutRef.current !== null) {
        window.clearTimeout(pendingPanelFamilyAuditClearTimeoutRef.current);
        pendingPanelFamilyAuditClearTimeoutRef.current = null;
      }
      activePanelFamilyAuditRef.current = {
        seq: requestSeq,
        prompt: text,
        expectedFamily,
        source: options?.source ?? "user",
      };
      traceAuditRef("set", {
        source: options?.source ?? "user",
        seq: requestSeq,
        prompt: text,
        expectedFamily: expectedFamily ?? null,
        contractRenderable: false,
        contractSalvaged: false,
        reason: "chat_submit_expected_family",
      });
      tracePanelFlowRuntime("prompt_submitted");
      tracePanelFamilyAudit("[Nexora][PanelFamilyAudit] expected_family", {
        expectedFamily: expectedFamily ?? null,
        intent: intentRoute.intent,
        preferredPanel: intentRoute.preferredPanel ?? null,
      });
      tracePanelFlowRuntime("expected_family", {
        requestedView: expectedFamily ?? null,
      });

    emitDebugEvent({
      type: "chat_intent_detected",
      layer: "intent",
      source: "HomeScreen",
      status: "info",
      message: `Intent ${intentRoute.intent}`,
      metadata: {
        intent: intentRoute.intent,
        target: intentRoute.target ?? null,
        preferredPanel: intentRoute.preferredPanel ?? null,
        expectedFamily: expectedFamily ?? null,
        shouldCallBackend: intentRoute.shouldCallBackend,
        shouldRunScanner: intentRoute.shouldRunScanner,
        shouldRunSimulation: intentRoute.shouldRunSimulation,
        shouldGenerateAdvice: intentRoute.shouldGenerateAdvice,
        shouldAffectPanels: intentRoute.shouldAffectPanels,
        shouldAffectScene: intentRoute.shouldAffectScene,
        sceneMutation: intentRoute.sceneMutation,
        primaryObjectId: intentRoute.primaryObjectId ?? null,
        requestSeq,
      },
      correlationId: chatCorrelationId,
    });

    if (intentRoute.intent === "chat_general" && !intentRoute.primaryObjectId) {
    setNoSceneUpdate(false);
    setSourceLabel(null);
  }

    const shouldShowLoading =
      intentRoute.shouldCallBackend ||
      intentRoute.shouldRunScanner ||
      intentRoute.shouldRunSimulation ||
      intentRoute.shouldGenerateAdvice;

    if (shouldShowLoading) {
      if (process.env.NODE_ENV !== "production") {
        console.log("[Nexora][HomeScreen][LoadingState]", {
          phase: "loading_started",
          panelView: rightPanelState.view ?? null,
          hasVisiblePanelState: Boolean(
            visibleResponseData ?? visibleStrategicAdvice ?? visibleDecisionCockpit ?? visibleRiskPropagation
          ),
          hasVisibleSceneState: Boolean(visibleSceneJson),
          hasVisibleSelection: Boolean(visibleSelectedObjectId ?? visibleFocusedId ?? visibleObjectSelection),
        });
      }
      setLoading(true);
      setNoSceneUpdate(false);
      setSourceLabel(null);
      setCameraLockedByUser(false);
    }

    try {
      emitDebugEvent({
        type: "chat_request_started",
        layer: "chat",
        source: "HomeScreen",
        status: "info",
        message: "Chat execution pipeline started",
        metadata: {
          requestSeq,
          shouldShowLoading,
          shouldCallBackend: intentRoute.shouldCallBackend,
        },
        correlationId: chatCorrelationId,
      });
      const executionResult = await executeNexoraAction({
      userText: text,
      route: intentRoute,
      activeMode,
      activeDomain: activeDomainExperience.experience.domainId,
      currentScene: sceneJson,
      currentRightPanelTab: rightPanelState.view,
      selectedObjectId: selectedObjectIdState,
      objectProfiles,
      productModeContext,
      memoryState: memory,
      environmentConfig,
      handlers: {
        runBackendChat: async (nextText: string) => {
          const payload = buildChatRequestPayload(nextText);

          if (process.env.NODE_ENV !== "production") {
            console.debug("chat payload", payload);
          }

          const raw = await chatToBackend(payload, { signal: controller.signal });
          if (process.env.NODE_ENV !== "production") {
            console.debug("chat response", raw);
          }
          return raw;
        },
        runLocalDecisionRouter: (nextText: string) =>
          routeChatInput(nextText, {
            focusedObjectId,
            activeLoopId: activeLoopIdStore ?? undefined,
            focusMode: focusModeStore,
            pinnedLabel: selectedObjectInfo?.label ?? undefined,
          }),
      },
    });

    if (!isLatestChatRequest(requestSeq)) {
      traceDemoFlowEvent({
        phase: "stale_ignored",
        source: options?.source ?? "chat",
        seq: requestSeq,
        requestId,
      });
      lifecycleStatus = "stale_ignored";
      return;
    }

    if (process.env.NODE_ENV !== "production") {
      console.log("[Nexora][ActionExecution]", executionResult);
    }

    const routerResult = executionResult.localDecisionPayload;
    const hasLocalActions = Array.isArray(routerResult?.actions) && routerResult.actions.length > 0;
    const hasBackendPayload = Boolean(executionResult.backendPayload);
    const rawFamilyDiag = readPanelFamilySliceDiagnostics(
      activePanelFamilyAuditRef.current?.expectedFamily ?? null,
      panelFamilyDataFromExecutionPayloads(
        executionResult.backendPayload,
        executionResult.localDecisionPayload
      )
    );
    tracePanelFamilyAudit("[Nexora][PanelFamilyAudit] raw_payload_presence", {
      rawFamilyPresent: rawFamilyDiag.familyPresent,
      rawPayloadShape: rawFamilyDiag.payloadShape,
    });
    traceDemoFlowEvent({
      phase: "response_received",
      source: options?.source ?? "chat",
      seq: requestSeq,
      requestId,
      detail: {
        hasLocalActions,
        hasBackendPayload,
        allowSceneMutation: executionResult.allowSceneMutation,
      },
    });

    emitDebugEvent({
      type: "chat_action_extracted",
      layer: "intent",
      source: "HomeScreen",
      status: executionResult.ok ? "ok" : "warn",
      message: executionResult.executionSummary ?? "execution",
      metadata: {
        ok: executionResult.ok,
        executedSteps: executionResult.executedSteps,
        hasLocalActions,
        hasBackendPayload,
        shouldOpenPanel: executionResult.shouldOpenPanel,
        shouldUpdateInspector: executionResult.shouldUpdateInspector,
        preferredPanel: executionResult.preferredPanel ?? null,
        appliedSceneMutation: executionResult.appliedSceneMutation,
        allowSceneMutation: executionResult.allowSceneMutation,
        hasUnifiedReaction: Boolean(executionResult.unifiedReaction),
        hasSceneReplacement: Boolean(executionResult.sceneReplacement),
        hasScenePatch: Boolean(executionResult.scenePatch),
        errorCount: Array.isArray(executionResult.errors) ? executionResult.errors.length : 0,
        warningCount: Array.isArray(executionResult.warnings) ? executionResult.warnings.length : 0,
        requestSeq,
      },
      correlationId: chatCorrelationId,
    });

    if (executionResult.shouldOpenPanel || executionResult.preferredPanel) {
      emitDebugEvent({
        type: "chat_panel_request",
        layer: "chat",
        source: "HomeScreen",
        status: "info",
        message: "Chat result requests panel / inspector update",
        metadata: {
          shouldOpenPanel: executionResult.shouldOpenPanel,
          preferredPanel: executionResult.preferredPanel ?? null,
          preferredInspectorTab: executionResult.preferredInspectorTab ?? null,
          requestSeq,
        },
        correlationId: chatCorrelationId,
      });
    }

    const hasChatSceneRequest =
      executionResult.appliedSceneMutation !== "none" ||
      Boolean(executionResult.unifiedReaction) ||
      Boolean(executionResult.sceneReplacement) ||
      Boolean(executionResult.scenePatch);
    if (hasChatSceneRequest) {
      emitDebugEvent({
        type: "chat_scene_request",
        layer: "chat",
        source: "HomeScreen",
        status: "info",
        message: "Chat result includes scene mutation / reaction",
        metadata: {
          appliedSceneMutation: executionResult.appliedSceneMutation,
          hasUnifiedReaction: Boolean(executionResult.unifiedReaction),
          hasSceneReplacement: Boolean(executionResult.sceneReplacement),
          requestSeq,
        },
        correlationId: chatCorrelationId,
      });
    }

    if (
      shouldApplyExecutionResultImmediately({
        hasLocalActions,
        hasBackendPayload,
      })
    ) {
      applyExecutionResultToUi(executionResult);
      traceDemoFlowEvent({
        phase: "commit_applied",
        source: options?.source ?? "chat",
        seq: requestSeq,
        requestId,
        detail: { mode: hasLocalActions ? "local_actions" : "fallback_reply" },
      });
    }

    if (hasLocalActions) {
      const userMsg = makeMsg("user", text);
      const assistantMsg = makeMsg("assistant", routerResult.assistantReply);
      const routedMessages = appendMessages(messagesRef.current, [userMsg, assistantMsg]);
      setMessages(routedMessages);
      emitChatResult(routerResult.assistantReply, true, requestId);

      applyDecisionActions(routerResult.actions, {
        setOverride: setOverrideRef.current,
        updateObjectUx,
      });

      // Update memory (pure) and persist. Any visual side-effects must be scheduled
      // AFTER React finishes the current update to avoid cross-component updates during render.
      setMemory((prev) => {
        const next = updateMemory(prev, {
          now: Date.now(),
          focusedObjectId,
          activeLoopId: activeLoopIdStore ?? undefined,
          actions: routerResult.actions,
          text,
          mode: activeMode,
        });

        try {
          window.localStorage.setItem(MEMORY_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }

        const targets = routerResult.actions
          .map((a: any) => (a && typeof (a as any).target === "string" ? (a as any).target : null))
          .filter((t: string | null): t is string => !!t);

        // Defer visual patches; applying overrides touches SceneStateProvider.
        pendingVisualPatchesRef.current = { memory: next, targets };

        return next;
      });

      // Apply derived visual patches on the next tick to avoid React warning:
      // "Cannot update a component while rendering a different component".
      window.setTimeout(() => {
        const pending = pendingVisualPatchesRef.current;
        if (!pending) return;
        pendingVisualPatchesRef.current = null;

        for (const targetId of pending.targets) {
          const patch = deriveVisualPatch(pending.memory, targetId);
          if (patch && (patch.scale !== undefined || patch.opacity !== undefined)) {
            setOverrideRef.current?.(targetId, patch);
          }
        }
      }, 0);

      lifecycleStatus = "success";
      shouldClearInput = true;
      return;
    }

    if (!executionResult.backendPayload) {
      const userMsg = makeMsg("user", text);
      const fallbackReply =
        executionResult.chatReply ??
        executionResult.errors[0] ??
        executionResult.warnings[0] ??
        intentRoute.explanation;
      const assistantMsg = makeMsg("assistant", fallbackReply);
      const routedMessages = appendMessages(messagesRef.current, [userMsg, assistantMsg]);
      setMessages(routedMessages);
      emitChatResult(fallbackReply, executionResult.ok, requestId);
      setLastActions([]);
      lifecycleStatus = executionResult.ok ? "success" : "error";
      shouldClearInput = executionResult.ok;
      if (executionResult.ok && !hasLocalActions) {
        emitDebugEvent({
          type: "chat_noop_result",
          layer: "chat",
          source: "HomeScreen",
          status: "info",
          message: "No backend payload and no local actions (fallback reply only)",
          metadata: {
            requestSeq,
            hadPanelIntent: Boolean(executionResult.shouldOpenPanel || executionResult.preferredPanel),
            hadSceneIntent: hasChatSceneRequest,
          },
          correlationId: chatCorrelationId,
        });
      }
      return;
    }

    // No deterministic actions to apply locally → use backend for assistant reply.
      const raw = executionResult.backendPayload;
      const data = applyRetailTriggerEnhancement(raw, text, sceneJson) as BackendChatResponse;
      if (typeof data?.episode_id === "string" && data.episode_id.trim()) {
        setEpisodeId(data.episode_id);
      }
      if (!data || (data as any).ok === false || (data as any).error) {
        const msg =
          ((data as any)?.error?.message as string | undefined) ??
          "Request failed; no changes applied.";
        setMessages((m) => appendMessages(m, [makeMsg("assistant", msg)]));
        emitChatResult(msg, false, requestId);
        setLastActions([]);
        lifecycleStatus = "error";
        emitDebugEvent({
          type: "chat_error",
          layer: "chat",
          source: "HomeScreen",
          status: "error",
          message: msg,
          metadata: { requestSeq, reason: "backend_response_error" },
          correlationId: chatCorrelationId,
        });
        return;
      }
      const userBackendMsg = makeMsg("user", text);
      const baseMessages = appendMessages(messagesRef.current, [userBackendMsg]);
      setMessages(baseMessages);
      const nextActiveMode: string =
        typeof (data as any)?.active_mode === "string" && (data as any).active_mode.trim().length
          ? (data as any).active_mode
          : activeMode;
      setActiveMode(nextActiveMode);
      const viewModel = deriveProductFlowViewModel(data, sceneJson);
      const shouldApplySceneMutation = hasMeaningfulSceneMutation(data, sceneJson);
      const incomingSceneJson = data.scene_json ? normalizeSceneJson(data.scene_json) : null;
      const viewModelSceneJson = viewModel?.nextSceneJson ? normalizeSceneJson(viewModel.nextSceneJson) : null;
      const shouldReplaceIncomingSceneFromChat = shouldAcceptIncomingSceneReplacement(
        data,
        sceneJson,
        incomingSceneJson
      );
      const shouldReplaceViewModelSceneFromChat = shouldAcceptIncomingSceneReplacement(
        data,
        sceneJson,
        viewModelSceneJson
      );

      const acceptedSceneForChatReplacement = pickAcceptedChatSceneReplacement({
        allowSceneMutation: executionResult.allowSceneMutation,
        viewModelSceneJson,
        incomingSceneJson,
        shouldReplaceViewModelSceneFromChat,
        shouldReplaceIncomingSceneFromChat,
      });

      if (acceptedSceneForChatReplacement) {
        try {
          const policy = prefs.overridePolicy ?? "match";
          if (policy === "clear") {
            clearAllOverridesRef.current?.();
          } else if (policy === "match") {
            const objsForPolicy: SceneObject[] = Array.isArray(acceptedSceneForChatReplacement?.scene?.objects)
              ? acceptedSceneForChatReplacement.scene.objects
              : [];
            const validIds = objsForPolicy.map((o: any, idx: number) => o.id ?? o.name ?? `${o.type ?? "obj"}:${idx}`);
            pruneOverridesRef.current?.(validIds);
          }
        } catch (e) {
          // ignore policy errors
        }
      } else if (incomingSceneJson || viewModelSceneJson) {
        setNoSceneUpdate(true);
      }
      const assistantReply =
        typeof data.reply === "string" && data.reply.trim().length > 0
          ? data.reply
          : executionResult.chatReply ??
            intentRoute.explanation ??
            "I understood the request, but the response came back without a readable reply.";
      const assistantMsg = makeMsg("assistant", assistantReply);
      const finalMessages = appendMessages(baseMessages, [assistantMsg]);
      setMessages(finalMessages);
      emitChatResult(assistantMsg.text, true, requestId);
      const nextActions = Array.isArray((data as any)?.actions) ? ((data as any).actions as any[]) : [];
      setLastActions(nextActions);
      const shouldApplySceneEffectsFromChat =
        executionResult.allowSceneMutation && executionResult.appliedSceneMutation !== "none";
      const retailChatTrigger = detectRetailTriggerConfig(text);
      const unifiedChatReaction =
        retailChatTrigger &&
        isRetailScenePayload(data, acceptedSceneForChatReplacement ?? sceneJson) &&
        isRetailDemoScene(acceptedSceneForChatReplacement ?? sceneJson)
          ? buildUnifiedReactionFromRetailTriggerConfig(
              retailChatTrigger,
              acceptedSceneForChatReplacement ?? sceneJson
            )
          : buildUnifiedReactionFromChatResponse(data, {
              acceptedSceneForChatReplacement,
              allowSceneEffects: shouldApplySceneEffectsFromChat,
              fallbackHighlightedObjectIds: executionResult.highlightedObjectIds,
              fallbackPrimaryObjectId: executionResult.focusedObjectId ?? intentRoute.primaryObjectId ?? null,
              reactionModeHint: reactionModeHintFromIntent(intentRoute.intent),
            });
      const nextObjectSelectionFromReaction = mergeNextObjectSelectionFromUnifiedReaction(
        unifiedChatReaction,
        viewModel.nextObjectSelection
      );
      const enrichedExecutionResult = {
        ...executionResult,
        chatReply: assistantMsg.text,
        backendPayload: data,
        highlightedObjectIds:
          Array.isArray(unifiedChatReaction?.highlightedObjectIds) && unifiedChatReaction.highlightedObjectIds.length > 0
            ? unifiedChatReaction.highlightedObjectIds
            : executionResult.highlightedObjectIds,
        focusedObjectId:
          (Array.isArray(unifiedChatReaction?.highlightedObjectIds) ? unifiedChatReaction.highlightedObjectIds[0] : null) ??
          executionResult.focusedObjectId ??
          null,
        unifiedReaction: executionResult.allowSceneMutation ? unifiedChatReaction : null,
        sceneReplacement: acceptedSceneForChatReplacement,
        panelUpdates: {
          preferredPanel: executionResult.preferredPanel,
          preferredInspectorTab: executionResult.preferredInspectorTab,
          viewModel,
          objectSelection: nextObjectSelectionFromReaction,
          memoryInsights: viewModel.nextMemoryInsights,
          riskPropagation: viewModel.nextRiskPropagation,
          strategicAdvice: viewModel.nextStrategicAdvice,
          strategyKpi: viewModel.nextStrategyKpi,
          decisionCockpit: viewModel.nextDecisionCockpit,
          productModeContext: viewModel.nextProductModeContext,
          productModeId: viewModel.nextProductModeContext?.mode_id ?? null,
          aiReasoning: viewModel.nextAiReasoning,
          platformAssembly: viewModel.nextPlatformAssembly,
          autonomousExploration: viewModel.nextAutonomousExploration,
          opponentModel: viewModel.nextOpponentModel,
          strategicPatterns: viewModel.nextStrategicPatterns,
          conflicts: viewModel.nextConflicts,
          kpi: viewModel.nextKpi,
          loops: viewModel.nextLoops,
          activeLoopId: viewModel.nextActiveLoop ?? null,
          loopSuggestions: viewModel.nextLoopSuggestions,
        },
      };
      traceDemoFlowEvent({
        phase: "canonical_result_ready",
        source: options?.source ?? "chat",
        seq: requestSeq,
        requestId,
        detail: {
          highlightedObjectCount: Array.isArray(unifiedChatReaction?.highlightedObjectIds)
            ? unifiedChatReaction.highlightedObjectIds.length
            : 0,
          hasPanelViewModel: Boolean(viewModel),
        },
      });
      applyExecutionResultToUi(enrichedExecutionResult);
      traceDemoFlowEvent({
        phase: "commit_applied",
        source: options?.source ?? "chat",
        seq: requestSeq,
        requestId,
        detail: { mode: "backend_canonical" },
      });
      if (
        (incomingSceneJson || viewModelSceneJson) &&
        shouldApplySceneMutation &&
        !acceptedSceneForChatReplacement &&
        process.env.NODE_ENV !== "production" &&
        !isPilotProductMode
      ) {
        setSceneWarn("⚠️ Rejected incompatible fallback scene replacement.");
      }

      const snapshot = buildPersistedProjectSnapshot({
        activeMode: nextActiveMode,
        sceneJson: acceptedSceneForChatReplacement ?? sceneJson,
        messages: finalMessages,
      });
      saveProject(snapshot);
      pushHistory(snapshot);

      try {
        const replay = await analyzeFull({ episodeId, text });
        if (isLatestChatRequest(requestSeq) && replay?.episode_id) setEpisodeId(replay.episode_id);
      } catch {
        // ignore replay errors to keep chat responsive
      }
      lifecycleStatus = "success";
      shouldClearInput = true;
    } catch (e: any) {
      if (!isLatestChatRequest(requestSeq)) {
        traceDemoFlowEvent({
          phase: "stale_ignored",
          source: options?.source ?? "chat",
          seq: requestSeq,
          requestId,
        });
        lifecycleStatus = "stale_ignored";
        return;
      }
      const timedOut = activeChatRequestRef.current?.seq === requestSeq && activeChatRequestRef.current.timedOut === true;
      lifecycleStatus = isAbortLikeError(e) ? "aborted" : "error";
      const msg = isPilotProductMode ? NEXORA_PIPELINE_USER_FAILURE : getChatLifecycleErrorMessage(e, timedOut);
      if (!isAbortLikeError(e) || timedOut) {
        setMessages((m) => appendMessages(m, [makeMsg("assistant", msg)]));
        emitChatResult(msg, false, requestId);
        emitDebugEvent({
          type: "chat_error",
          layer: "chat",
          source: "HomeScreen",
          status: "error",
          message: msg,
          metadata: { requestSeq, timedOut, reason: "chat_pipeline_exception" },
          correlationId: chatCorrelationId,
        });
      }
    } finally {
      if (activeChatDebugCorrelationRef.current === chatCorrelationId) {
        emitDebugEvent({
          type: "chat_response_completed",
          layer: "chat",
          source: "HomeScreen",
          status:
            lifecycleStatus === "error"
              ? "error"
              : lifecycleStatus === "aborted" || lifecycleStatus === "stale_ignored"
                ? "warn"
                : "ok",
          message: `Chat pipeline finalized: ${lifecycleStatus}`,
          metadata: {
            lifecycleStatus,
            requestSeq,
            clearInput: shouldClearInput,
          },
          correlationId: chatCorrelationId,
        });
        emitGuardRailAlerts(
          runGuardChecks(
            { trigger: "chat_response", chat: { chatCorrelationId }, correlationId: chatCorrelationId },
            getRecentDebugEvents()
          )
        );
        activeChatDebugCorrelationRef.current = null;
      }
      finalizeChatRequest(requestSeq, lifecycleStatus, { clearInput: shouldClearInput });
    }
  }, [
    activeMode,
    activeDomainExperience,
    episodeId,
    focusMode,
    focusModeStore,
    focusedId,
    focusPinned,
    pinnedId,
    activeLoopIdStore,
    loading,
    objectProfiles,
    prefs.globalScale,
    prefs.overridePolicy,
    productModeContext,
    rightPanelTab,
    selectedObjectIdState,
    applyExecutionResultToUi,
    applyProductFlowViewModel,
    applyUICommands,
    buildChatRequestPayload,
    deriveProductFlowViewModel,
    sceneJson,
    emitChatResult,
    applyRetailTriggerEnhancement,
    applyUnifiedSceneReaction,
    pulseObjectByText,
    updateSelectedObjectInfo,
    updateObjectUx,
    finalizeChatRequest,
    isLatestChatRequest,
    isPilotProductMode,
  ]);
  const runRetailDemoStep = useCallback(
    async (step: DemoScriptStep) => {
      applyDemoStepFallbackReaction(step);
      if (step.chat_input) {
        await sendText(step.chat_input, `demo:${step.step_id}:${Date.now()}`, { source: "demo" });
      }
      if (step.visual_mode === "balanced" || step.visual_mode === "outcome") {
        applyDemoStepFallbackReaction(step);
      }
    },
    [applyDemoStepFallbackReaction, sendText]
  );
  const retailDemoFlow = useDemoFlowController({
    script: RETAIL_FRAGILITY_DEMO_SCRIPT,
    enabled: true,
    onRunStep: runRetailDemoStep,
  });
  const narrativeSceneBinding = useNarrativeSceneBinding({
    step: retailDemoFlow.currentStep,
    sceneJson,
  });
  useNarrativeSceneBindingDebug(narrativeSceneBinding);
  useEffect(() => {
    demoFlowPauseRef.current = retailDemoFlow.notifyManualInteraction;
  }, [retailDemoFlow.notifyManualInteraction]);

  const submitGuidedPrompt = useCallback(
    (text: string, requestId?: string, source: GuidedPromptSource = "guided_prompt") => {
      const trimmedText = text.trim();
      if (!trimmedText) return;

      logPanelGuidedPromptWarn({
        phase: "blind_submit",
        source,
        prompt: trimmedText,
        currentView: rightPanelState.view ?? null,
        path: "normal_chat_dispatch",
        notes: "Guided prompt currently routes through sendText without dedicated panel priming.",
      });

      void sendText(trimmedText, requestId, { source: "user" });
    },
    [rightPanelState.view, sendText]
  );

  useEffect(() => {
    const onSubmitChat = (event: Event) => {
      const detail = (event as CustomEvent<{
        text?: string;
        requestId?: string;
        source?: "user" | "guided_prompt";
      }>).detail;
      const text = typeof detail?.text === "string" ? detail.text : "";
      const requestId = typeof detail?.requestId === "string" ? detail.requestId : undefined;
      if (!text.trim()) return;
      if (detail?.source === "guided_prompt") {
        submitGuidedPrompt(text, requestId, "assistant_prompt_chip");
        return;
      }
      void sendText(text, requestId);
    };
    window.addEventListener("nexora:submit-chat", onSubmitChat as EventListener);
    return () => window.removeEventListener("nexora:submit-chat", onSubmitChat as EventListener);
  }, [sendText, submitGuidedPrompt]);

  const send = useCallback(() => {
    void sendText(input);
  }, [input, sendText]);

  const handleUndo = useCallback(() => {
    const history = loadHistory();
    const popped = prepareUndoHistoryPop(history);
    if (!popped) return;
    const { nextHistory, target: prev } = popped;

    setActiveMode(prev.activeMode ?? "business");
    const undoSceneDecision = prev.sceneJson ? evaluateHistoryUndoScene(prev.sceneJson) : canonDecisionMissingSceneBlob();
    setSceneJson(sceneJsonFromCanonDecision(undoSceneDecision));
    setMessages(normalizeMessages(prev.messages));
    try {
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
      if (prev.sessionId) window.localStorage.setItem(SESSION_KEY, prev.sessionId);
    } catch {
      // ignore
    }
    saveProject(withPersistedProjectSavedAt(prev));
  }, []);

  const handleExport = useCallback(() => {
    const currentProject =
      workspaceProjects[activeProjectId] ?? buildActiveProjectState(activeProjectId);
    const { json, filename, mimeType } = prepareWorkspaceProjectExportJson(currentProject);
    const blob = new Blob([json], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, [activeProjectId, buildActiveProjectState, workspaceProjects]);

  const handleImport = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = typeof reader.result === "string" ? reader.result : "";
        const currentWorkspace = buildWorkspaceStateForProjectImport({
          workspaceId: activeWorkspaceId,
          activeProjectId,
          workspaceProjects,
          activeProjectSnapshot: buildActiveProjectState(activeProjectId),
        });
        const prepared = prepareProjectImportFromFileText(text, currentWorkspace, {
          activate: true,
          collision: "rename",
        });
        if (!prepared.ok) {
          throw new Error(prepared.errorMessage);
        }
        const { importResult, parseWarnings } = prepared;

        setActiveWorkspaceId(importResult.workspace.id || DEFAULT_WORKSPACE_ID);
        setWorkspaceProjects(importResult.workspace.projects);
        setActiveProjectId(importResult.activeProjectId);
        applyWorkspaceProjectState(importResult.project);
        const note = composeImportWarningAssistantText(parseWarnings, importResult.warnings);
        if (note) {
          setMessages((m) => appendMessages(m, [makeMsg("assistant", note)]));
        }
      } catch (err: unknown) {
        setMessages((m) => appendMessages(m, [makeMsg("assistant", messageImportUnknownError(err))]));
      }
    };
    reader.readAsText(file);
  }, [
    activeProjectId,
    activeWorkspaceId,
    applyWorkspaceProjectState,
    buildActiveProjectState,
    workspaceProjects,
  ]);

  const buildBackup = useCallback((): BackupV1 => {
    return buildScreenBackupV1({
      activeCompanyId,
      activeMode,
      activeTemplateId,
      hudTab: activeSidePanel,
      prefs,
      sceneJson,
      messages,
      loops,
      activeLoopId,
      selectedLoopId,
      focusedId,
      focusMode,
      focusPinned,
      selectedObjectId: selectedObjectIdState,
      overrides: overridesRef.current ?? {},
      objectUxById: objectUxById ?? {},
    });
  }, [
    activeCompanyId,
    activeMode,
    activeTemplateId,
    activeSidePanel,
    prefs,
    sceneJson,
    messages,
    loops,
    activeLoopId,
    selectedLoopId,
    focusedId,
    focusMode,
    focusPinned,
    selectedObjectIdState,
    objectUxById,
  ]);

  const handleSaveBackup = useCallback(() => {
    const backup = buildBackup();
    saveBackup(backup);
    setMessages((m) => appendMessages(m, [makeMsg("assistant", "✅ Backup saved (local).")]));
  }, [buildBackup]);

  const applyBackupRestore = useCallback((b: BackupV1) => {
    isRestoringRef.current = true;

    try {
      if (b.sessionId) {
        try { window.localStorage.setItem(SESSION_KEY, b.sessionId); } catch {}
      }

      // company
      setActiveCompanyIdState(b.activeCompanyId ?? "default");
      setCompanyId(b.activeCompanyId ?? "default");

      // core state
      setActiveMode(b.activeMode ?? "business");
      setActiveTemplateId(b.activeTemplateId ?? "quality_protection");
      setActiveSidePanel(resolveHudTabAfterBackupRestore(b.hudTab));
      setPrefs(b.prefs ?? defaultPrefs);

      // scene + chat
      const backupSceneDecision = b.sceneJson ? evaluateBackupRestoreScene(b.sceneJson) : canonDecisionMissingSceneBlob();
      setSceneJson(sceneJsonFromCanonDecision(backupSceneDecision));
      setMessages(normalizeMessages(b.messages));

      // loops
      setLoops(Array.isArray(b.loops) ? b.loops : []);
      setActiveLoopId(b.activeLoopId ?? null);
      setSelectedLoopId(b.selectedLoopId ?? null);

      // focus/selection
      setFocusedId(b.focusedId ?? null);
      setFocusMode(b.focusMode ?? "all");
      setPinnedSafe(!!b.focusPinned, b.focusedId ?? null);

      setSelectedObjectIdState(b.selectedObjectId ?? null);
      if (b.selectedObjectId) selectedSetterRef.current?.(b.selectedObjectId);
      else selectedSetterRef.current?.(null);

      // overrides refs + ux
      overridesRef.current = b.overrides ?? {};
      setObjectUxById(b.objectUxById ?? {});

      if (b.selectedObjectId) {
        window.setTimeout(() => updateSelectedObjectInfo(b.selectedObjectId), 0);
      }

      setMessages((m) => appendMessages(m, [makeMsg("assistant", "✅ Backup restored.")]));
    } finally {
      window.setTimeout(() => { isRestoringRef.current = false; }, 0);
    }
  }, [setPinnedSafe, updateSelectedObjectInfo]);

  const handleRestoreBackup = useCallback(() => {
    const b = loadBackup();
    if (!b) {
      setMessages((m) => appendMessages(m, [makeMsg("assistant", "⚠️ No backup found.")]));
      return;
    }
    setRestorePreview(
      buildBackupRestorePreviewContents({
        backup: b,
        activeCompanyId,
        activeMode,
        activeTemplateId,
        hudTab: activeSidePanel,
        loops,
        activeLoopId,
        selectedLoopId,
        focusedId,
        focusMode,
        focusPinned,
        selectedObjectId: selectedObjectIdState,
        messagesLen: messages.length,
        overridesKeysCount: Object.keys(overridesRef.current ?? {}).length,
      })
    );
  }, [
    activeCompanyId,
    activeMode,
    activeTemplateId,
    activeSidePanel,
    loops,
    activeLoopId,
    selectedLoopId,
    focusedId,
    focusMode,
    focusPinned,
    selectedObjectIdState,
    messages.length,
  ]);

  useEffect(() => {
    if (isRestoringRef.current) return;
    if (!autoBackupEnabled) return;
    if (autoBackupTimerRef.current) {
      window.clearTimeout(autoBackupTimerRef.current);
    }
    autoBackupTimerRef.current = window.setTimeout(() => {
      if (isRestoringRef.current) return;
      if (!autoBackupEnabled) return;
      const backup = buildBackup();
      saveBackup(backup);
    }, 1500);
    return () => {
      if (autoBackupTimerRef.current) {
        window.clearTimeout(autoBackupTimerRef.current);
        autoBackupTimerRef.current = null;
      }
    };
  }, [autoBackupEnabled, buildBackup, overridesVersion]);


  const handlePrefsChange = useCallback((next: ScenePrefs) => {
    setPrefs(next);
  }, []);

  const clearFocus = useCallback(() => {
    applyPinToStore(false, null);
    setFocusedId(null);
    selectedSetterRef.current(null);
    setSelectedObjectIdState(null);
    setSelectedObjectInfo(null);
    clearFocusOwnership("Focus cleared explicitly.");
  }, [applyPinToStore, clearFocusOwnership, setFocusedId]);
  const handleAskAboutSelected = useCallback(() => {
    const id = selectedIdRef.current;
    if (!id) return;
    setFocusedId(id);
    updateSelectedObjectInfo(id);
    setFocusMode("selected");
    sendText("tell me about the selected object");
  }, [sendText, updateSelectedObjectInfo]);

  const askAboutSelectedAndSend = useCallback(() => {
    const id = selectedIdRef.current;
    if (!id) return;
    setFocusedId(id);
    updateSelectedObjectInfo(id);
    setFocusMode("selected");
    const q = "Tell me about the selected object.";
    setInput(q);
    setTimeout(() => {
      send();
    }, 0);
  }, [send, updateSelectedObjectInfo]);

  const handleFocusFromLoop = useCallback(
    (id: string) => {
      if (!id) return;
      const resolved = resolveSelectedObjectDetails(id);
      if (!resolved) {
        tracePostSuccessContextDecision("[Nexora][ContextGuardBlocked]", {
          currentTargetId: selectedObjectIdState ?? focusedId ?? null,
          nextTargetId: id,
          source: "focus",
          targetInScene: false,
          preserved: Boolean(selectedObjectIdState ?? focusedId),
        });
        return;
      }
      tracePostSuccessContextDecision("[Nexora][PostSuccessContextAccepted]", {
        currentTargetId: selectedObjectIdState ?? focusedId ?? null,
        nextTargetId: id,
        source: "focus",
        targetInScene: true,
        preserved: false,
      });
      selectedSetterRef.current(id);
      setFocusedId(id);
      claimFocusOwnership({
        source: "war_room_action",
        objectId: id,
        isPersistent: true,
        reason: "War Room or loop analysis requested focus.",
      });
      setFocusMode("selected");
      setViewMode("input");
    },
    [
      claimFocusOwnership,
      focusedId,
      resolveSelectedObjectDetails,
      selectedObjectIdState,
      setFocusMode,
      setViewMode,
      tracePostSuccessContextDecision,
    ]
  );


  const handleReplayEvents = useCallback(async () => {
    if (process.env.NODE_ENV === "production") return;
    setReplayError(null);
    setReplaying(true);
    let userId: string | null = readSessionIdForPersistence();
    if (!userId) {
      try {
        userId = window.localStorage.getItem("dev_replay_user_id");
        if (!userId) {
          userId = `dev-${Math.random().toString(36).slice(2, 10)}`;
          window.localStorage.setItem("dev_replay_user_id", userId);
        }
      } catch {
        userId = "dev-anon";
      }
    }
    try {
      const events = await getRecentEvents(userId, 10);
      for (const evt of events) {
        applyActions(evt.actions);
        setMessages((m) => appendMessages(m, [makeMsg("assistant", `(Replayed) ${evt.reply}`)]));
        await delay(250);
      }
    } catch (e: any) {
      setReplayError("Replay failed");
    } finally {
      setReplaying(false);
    }
  }, [applyActions, setMessages]);

 
  const hudPanels = null as any;

  const handleSceneUpdateFromTimeline = useCallback((payload: any) => {
    applyGuardedResponsePayload(payload ?? null, "feedback", "Timeline payload applied.");
    const nextScene = payload?.scene_json;
    const sceneDecision = evaluateTimelineForceScene(nextScene, payload);
    if (isSceneCanonReplaceDecision(sceneDecision)) {
      setSceneJson(sceneDecision.scene);
      setNoSceneUpdate(false);
    } else if (nextScene != null && typeof nextScene === "object" && !Array.isArray(nextScene)) {
      setNoSceneUpdate(true);
      const timelineReaction = buildUnifiedReactionFromChatResponse(payload, {
        acceptedSceneForChatReplacement: null,
        allowSceneEffects: true,
        fallbackHighlightedObjectIds: Array.isArray(payload?.object_selection?.highlighted_objects)
          ? payload.object_selection.highlighted_objects.map(String)
          : [],
        fallbackPrimaryObjectId:
          Array.isArray(payload?.object_selection?.highlighted_objects) && payload.object_selection.highlighted_objects.length > 0
            ? String(payload.object_selection.highlighted_objects[0])
            : null,
        reactionModeHint: "propagation",
      });
      applyUnifiedSceneReaction(timelineReaction, { allowSceneReplacement: false });
    }

    const nextFragility =
      payload?.fragility ??
      payload?.context?.fragility ??
      payload?.scene_json?.scene?.fragility ??
      null;

    const nextKpi =
      payload?.kpi ??
      payload?.context?.kpi ??
      payload?.scene_json?.scene?.kpi ??
      null;

    if (nextKpi) setKpi(nextKpi as any);
    setConflicts(extractConflicts(payload));
    setObjectSelection(extractObjectSelection(payload));
    setMemoryInsights(extractMemoryV2(payload));
    setRiskPropagation(extractRiskPropagation(payload));
    setStrategicAdvice(extractStrategicAdvice(payload));
    setStrategyKpi(extractStrategyKpi(payload));
    setDecisionCockpit(extractDecisionCockpit(payload));
    const nextProductModeContextC = extractProductModeContext(payload);
    setProductModeContext(nextProductModeContextC);
    if (nextProductModeContextC?.mode_id) setProductModeId(String(nextProductModeContextC.mode_id));
    setAiReasoning(extractAiReasoning(payload));
    setPlatformAssembly(extractPlatformAssembly(payload));
    setAutonomousExploration(extractAutonomousExploration(payload));
    setOpponentModel(extractOpponentModel(payload));
    setStrategicPatterns(extractStrategicPatterns(payload));
    if (nextFragility) {
      // optional: if HomeScreen stores fragility separately, update it
    }
  }, [
    applyUnifiedSceneReaction,
    extractConflicts,
    extractMemoryV2,
    extractObjectSelection,
    extractRiskPropagation,
    extractStrategicAdvice,
    extractStrategyKpi,
    extractDecisionCockpit,
    extractProductModeContext,
    extractAiReasoning,
    extractPlatformAssembly,
    extractAutonomousExploration,
    extractOpponentModel,
    extractStrategicPatterns,
  ]);

  const loadDomainDemoScenario = useCallback(async (requestedDomainId?: string | null) => {
    const requested = String(requestedDomainId ?? activeDomainExperience.experience.domainId ?? "")
      .trim()
      .toLowerCase();
    const demoDefinition = resolveDomainDemo(requestedDomainId ?? activeDomainExperience.experience.domainId);
    const basePayload = demoDefinition.analysis as Record<string, unknown>;
    let mergedPayload: Record<string, unknown> = { ...basePayload };
    let nextScene = normalizeSceneJson(demoDefinition.scene);
    const sceneObjects = Array.isArray(nextScene.scene?.objects) ? nextScene.scene.objects : [];
    if (sceneObjects.length === 0) {
      // eslint-disable-next-line no-console
      console.warn("[Nexora][DemoLoad] skipped — scene_json has no objects", { requestedDomainId: requested });
      return;
    }
    const sceneDomain = readSceneJsonMetaString(nextScene, "domain").trim().toLowerCase();
    if (sceneDomain && sceneDomain !== requested) {
      // eslint-disable-next-line no-console
      console.warn("[Nexora][DemoLoad] domain mismatch — scene not applied", { sceneDomain, requested });
      return;
    }
    const prevMetaRecord = asRecord(nextScene.meta) ?? {};
    nextScene = {
      ...nextScene,
      meta: { ...prevMetaRecord, domain: sceneDomain || requested, force_scene_update: true },
    };
    const nextLoops = normalizeLoops(nextScene.scene?.loops);
    const nextActiveLoop = readSceneJsonActiveLoop(nextScene) || null;
    const nextLoopSuggestions = Array.isArray(nextScene.scene?.loops_suggestions)
      ? (nextScene.scene.loops_suggestions as string[]).filter((s): s is string => typeof s === "string")
      : [];
    const inferred = inferProjectMetaFromScene(nextScene);
    const nextProjectId = inferred.projectId || DEFAULT_PROJECT_ID;
    const demoModeContext = buildActiveModeContext({
      modeId: activeDomainExperience.experience.preferredWorkspaceModeId,
      projectDomain: inferred.domain ?? activeDomainExperience.experience.domainId,
      workspaceId: activeWorkspaceId,
      projectId: nextProjectId,
    });
    setProductModeId(activeDomainExperience.experience.preferredWorkspaceModeId);
    setProductModeContext(demoModeContext);
    setActiveProjectId(nextProjectId);
    setWorkspaceProjects((prev) => ({
      ...prev,
      [nextProjectId]: prev[nextProjectId] ?? createEmptyProjectState(nextProjectId, inferred.name || nextProjectId),
    }));
    const promptText = buildDemoStrategicAnalysisPrompt(demoDefinition, activeDomainExperience);
    try {
      const out = await postStrategicAnalysisText({ text: promptText });
      if (out.ok && out.decision_analysis && typeof out.decision_analysis === "object") {
        const decisionAnalysis = JSON.parse(JSON.stringify(out.decision_analysis)) as Record<string, unknown>;
        mergedPayload = { ...mergedPayload, decision_analysis: decisionAnalysis };
        nextScene = { ...nextScene, decision_analysis: decisionAnalysis };
        if (process.env.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.log("[Nexora][DecisionAnalysis][ScenarioLoad][Attached]", {
            strategies: Array.isArray(decisionAnalysis.strategies) ? decisionAnalysis.strategies.length : 0,
          });
        }
      }
    } catch {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.warn("[Nexora][DecisionAnalysis][ScenarioLoad][Attached] request_failed");
      }
    }
    applyGuardedResponsePayload(mergedPayload, "feedback", "Domain demo payload loaded.");
    const demoSceneDecision = evaluateDomainDemoScene(nextScene);
    const demoScene = sceneJsonFromCanonDecision(demoSceneDecision);
    if (demoScene) {
      setSceneJson(demoScene);
    }
    clearAllOverridesRef.current?.();
    setLoops(nextLoops);
    setActiveLoopId(nextActiveLoop);
    setSelectedLoopId(null);
    setLoopSuggestions(nextLoopSuggestions);
    const mergedRec = asRecord(mergedPayload);
    const kpiCandidate =
      mergedRec?.["kpi"] ??
      asRecord(mergedRec?.["context"])?.["kpi"] ??
      asRecord(asRecord(mergedRec?.["scene_json"])?.["scene"])?.["kpi"] ??
      nextScene.scene?.kpi ??
      null;
    setKpi(normalizeKpiStateFromUnknown(kpiCandidate));
    setConflicts(extractConflicts(mergedPayload));
    setObjectSelection(extractObjectSelection(mergedPayload));
    setRiskPropagation(extractRiskPropagation(mergedPayload));
    setStrategicAdvice(extractStrategicAdvice(mergedPayload));
    setStrategyKpi(extractStrategyKpi(mergedPayload));
    setDecisionCockpit(extractDecisionCockpit(mergedPayload));
    const nextProductModeContextD = extractProductModeContext(mergedPayload);
    setProductModeContext(nextProductModeContextD);
    if (nextProductModeContextD?.mode_id) setProductModeId(String(nextProductModeContextD.mode_id));
    setAiReasoning(extractAiReasoning(mergedPayload));
    setPlatformAssembly(extractPlatformAssembly(mergedPayload));
    setAutonomousExploration(extractAutonomousExploration(mergedPayload));
    setOpponentModel(extractOpponentModel(mergedPayload));
    setStrategicPatterns(extractStrategicPatterns(mergedPayload));
    setCameraLockedByUser(false);
    setIsOrbiting(false);
    setFocusMode("all");
    setFocusedId(null);
    selectedSetterRef.current(null);
    setSelectedObjectIdState(null);
    setSelectedObjectInfo(null);
    clearFocusOwnership("Demo profile framing does not own hard focus.");
    setNoSceneUpdate(false);
    setSourceLabel("demo");
    setLastAnalysisSummary(
      activeProfile?.hero_summary
        ? `${activeProfile.hero_summary} Loaded demo scenario: ${demoDefinition.label}`
        : `Loaded demo scenario: ${demoDefinition.label}`
    );
    setMessages((m) =>
      appendMessages(m, [
        makeMsg(
          "assistant",
          demoDefinition.starterText
        ),
      ])
    );
  }, [
    activeDomainExperience,
    activeProfile?.hero_summary,
    applyGuardedResponsePayload,
    clearFocusOwnership,
    extractConflicts,
    extractObjectSelection,
    extractRiskPropagation,
    extractStrategicAdvice,
    extractStrategyKpi,
    extractDecisionCockpit,
    extractProductModeContext,
    extractAiReasoning,
    extractPlatformAssembly,
    extractAutonomousExploration,
    extractOpponentModel,
    extractStrategicPatterns,
    activeWorkspaceId,
    setFocusMode,
    setFocusedId,
  ]);

  useEffect(() => {
    const onLoadDemo = (event: Event) => {
      const detail = (event as CustomEvent<{ domainId?: string | null }>).detail;
      void loadDomainDemoScenario(detail?.domainId ?? activeDomainExperience.experience.domainId);
    };
    window.addEventListener("nexora:load-demo-scenario", onLoadDemo as EventListener);
    return () => window.removeEventListener("nexora:load-demo-scenario", onLoadDemo as EventListener);
  }, [activeDomainExperience, loadDomainDemoScenario]);

  useEffect(() => {
    const currentSceneDomainId = readSceneJsonMetaString(sceneJson, "domain").toLowerCase();
    if (!workspaceHydrated || didAutoLoadDomainDemoRef.current) return;
    if (sceneJson && currentSceneDomainId === activeDomainExperience.experience.domainId) return;
    didAutoLoadDomainDemoRef.current = true;
    void loadDomainDemoScenario(activeDomainExperience.experience.domainId);
  }, [activeDomainExperience, loadDomainDemoScenario, sceneJson, workspaceHydrated]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("nexora:inspector-context", {
        detail: {
          sceneJson,
          responseData,
          rightPanelView: rightPanelState.view ?? null,
          messages,
          kpi,
          activeMode,
          activeLoopId,
          focusedId,
          focusMode,
          focusPinned,
          selectedObjectId: selectedObjectIdState,
          selectedObjectInfo,
          objectSelection,
          riskPropagation,
          conflicts,
          strategicAdvice,
          strategyKpi,
          decisionCockpit,
          productModeContext,
          aiReasoning,
          platformAssembly,
          autonomousExploration,
          domainExperience: {
            domainId: activeDomainExperience.experience.domainId,
            label: activeDomainExperience.experience.label,
            description: activeDomainExperience.experience.description,
            domainPackId: activeDomainExperience.experience.activeDomainPackId,
            defaultDemoId: activeDomainExperience.experience.defaultDemoId,
            defaultProductMode: activeDomainExperience.experience.preferredProductMode,
            preferredWorkspaceModeId: activeDomainExperience.experience.preferredWorkspaceModeId,
            preferredCockpitLayoutMode: activeDomainExperience.experience.preferredCockpitLayoutMode,
            preferredRightPanelTab: activeDomainExperience.experience.preferredRightPanelTab,
            promptExamples: activeDomainExperience.experience.promptExamples,
            helperTitle: activeDomainExperience.experience.helperTitle,
            helperBody: activeDomainExperience.experience.helperBody,
            promptGuideTitle: activeDomainExperience.experience.promptGuideTitle,
            promptGuideBody: activeDomainExperience.experience.promptGuideBody,
            panelIds: activeDomainExperience.experience.preferredPanels,
            visibleNavGroups: activeDomainExperience.experience.visibleNavGroups,
            visibleSections: activeDomainExperience.experience.visibleSections,
            adviceFramingHints: activeDomainExperience.experience.adviceFramingHints,
            executiveFramingStyle: activeDomainExperience.experience.executiveFramingStyle,
            sharedCoreEngineId: activeDomainExperience.sharedCore.id,
            demoScenarioTitle: activeDomainExperience.experience.demoScenarioTitle,
            demoBusinessContext: activeDomainExperience.experience.demoBusinessContext,
            demoDecisionQuestion: activeDomainExperience.experience.demoDecisionQuestion,
          },
          sharedCoreEngine: activeDomainExperience.sharedCore,
          sourceLabel: sourceLabel ?? null,
          demoPresentation: {
            loadDone: Boolean(sceneJson),
            askedDone: messages.some(
              (m) =>
                m.role === "user" && typeof m.text === "string" && String(m.text).trim().length > 0
            ),
            insightOpen: Boolean(rightPanelState.isOpen && rightPanelState.view),
            guidedPromptsVisible:
              Boolean(sceneJson) &&
              readSceneJsonMetaString(sceneJson, "demo_id").toLowerCase() ===
                String(activeDomainDemo.id).toLowerCase() &&
              !messages.some(
                (m) =>
                  m.role === "user" && typeof m.text === "string" && String(m.text).trim().length > 0
              ),
          },
        },
      })
    );
  }, [
    activeDomainDemo.id,
    activeDomainExperience,
    sceneJson,
    responseData,
    rightPanelState.view,
    rightPanelState.isOpen,
    sourceLabel,
    messages,
    kpi,
    activeMode,
    activeLoopId,
    focusedId,
    focusMode,
    focusPinned,
    selectedObjectIdState,
    selectedObjectInfo,
    objectSelection,
    riskPropagation,
    conflicts,
    strategicAdvice,
    decisionResult,
    strategyKpi,
    decisionCockpit,
    productModeContext,
    aiReasoning,
    platformAssembly,
    autonomousExploration,
  ]);
  const selectedObjectLabelForWarRoom = useMemo(() => {
    const draftSourceId = warRoom.session.draft.selectedObjectId;
    if (draftSourceId && selectedObjectInfo?.id === draftSourceId && selectedObjectInfo.label) {
      return selectedObjectInfo.label;
    }
    if (draftSourceId) {
      return resolveObjectLabel(draftSourceId) ?? draftSourceId;
    }
    return selectedObjectInfo?.label ?? null;
  }, [resolveObjectLabel, selectedObjectInfo, warRoom.session.draft.selectedObjectId]);
  const strategicCouncil = useMemo(
    () =>
      normalizeStrategicCouncilResult(
        asRecord(visibleResponseData)?.["strategic_council"] ?? visibleSceneJson?.["strategic_council"] ?? null
      ),
    [visibleResponseData, visibleSceneJson]
  );
  const { impact: decisionImpact } = useDecisionImpact({
    propagation: visibleRiskPropagation ?? null,
    decisionPath: warRoom.scenarioTrigger?.payload && typeof warRoom.scenarioTrigger.payload === "object"
      ? ((warRoom.scenarioTrigger.payload as any).decisionPath ?? null)
      : null,
    strategicAdvice: visibleStrategicAdvice ?? null,
    strategicCouncil: strategicCouncil ?? null,
    scenarioAction: warRoom.scenarioTrigger ?? null,
    sceneJson: visibleSceneJson,
    source: "home_screen",
  });
  const decisionExecutionScenario = useMemo(
    () => ({
      active_mode: activeMode,
      scene_label:
        readSceneJsonMetaString(visibleSceneJson, "label") ||
        readSceneJsonMetaString(visibleSceneJson, "demo_title") ||
        "Nexora Scene",
      demo_profile_id: activeProfile?.id ?? null,
      selected_object_id: visibleSelectedObjectId ?? null,
      focused_object_id: visibleFocusedId ?? null,
      scenario_trigger: warRoom.scenarioTrigger ?? null,
    }),
    [activeMode, activeProfile?.id, visibleFocusedId, visibleSceneJson, visibleSelectedObjectId, warRoom.scenarioTrigger]
  );
  const decisionOverrideIdsRef = useRef<string[]>([]);
  const narrativeOverrideIdsRef = useRef<string[]>([]);
  const sceneFocusIdSet = useMemo(() => {
    const sceneObjects = Array.isArray(visibleSceneJson?.scene?.objects) ? visibleSceneJson.scene.objects : [];
    return new Set(sceneObjects.map((item) => String(item?.id ?? "").trim()).filter(Boolean));
  }, [visibleSceneJson]);
  const currentSceneTargetId = useMemo(() => {
    if (typeof selectedObjectIdState === "string" && sceneFocusIdSet.has(selectedObjectIdState)) {
      return selectedObjectIdState;
    }
    if (typeof focusedId === "string" && sceneFocusIdSet.has(focusedId)) {
      return focusedId;
    }
    return null;
  }, [focusedId, sceneFocusIdSet, selectedObjectIdState]);
  const resolvedFocusOwnership = useMemo(() => {
    const candidates: FocusOwnershipState[] = [];
    if (focusOwnership.source !== "none") {
      const objectId =
        focusOwnership.source === "backend_intelligence" || focusOwnership.source === "scanner_primary"
          ? Array.isArray(visibleObjectSelection?.highlighted_objects) &&
            focusOwnership.objectId &&
            visibleObjectSelection.highlighted_objects.map(String).includes(focusOwnership.objectId)
            ? focusOwnership.objectId
            : null
          : focusOwnership.objectId;
      candidates.push({
        ...focusOwnership,
        objectId,
      });
    }
    if (narrativeSceneBinding.isActive && narrativeSceneBinding.focusId) {
      candidates.push({
        source: "narrative_step",
        objectId: narrativeSceneBinding.focusId,
        isPersistent: false,
        reason: `Narrative step ${narrativeSceneBinding.stepId ?? "active"} requested focus.`,
      });
    }
    return resolveFocusOwnership(candidates, sceneFocusIdSet);
  }, [
    focusOwnership,
    narrativeSceneBinding.focusId,
    narrativeSceneBinding.isActive,
    narrativeSceneBinding.stepId,
    sceneFocusIdSet,
    visibleObjectSelection,
  ]);
  const narrativeObjectSelection = useMemo(
    () => getSceneScopedObjectSelection(narrativeSceneBinding.objectSelection, sceneFocusIdSet),
    [narrativeSceneBinding.objectSelection, sceneFocusIdSet]
  );
  const effectiveObjectSelection = useMemo(() => {
    if (narrativeSceneBinding.isActive && narrativeObjectSelection) {
      return narrativeObjectSelection;
    }
    return visibleObjectSelection ?? null;
  }, [narrativeObjectSelection, narrativeSceneBinding.isActive, visibleObjectSelection]);
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.log("[Nexora][FocusOwnership] resolved", resolvedFocusOwnership);
    }
    const nextTargetId =
      typeof resolvedFocusOwnership.objectId === "string" && resolvedFocusOwnership.objectId.trim().length > 0
        ? resolvedFocusOwnership.objectId
        : null;
    const nextTargetInScene = nextTargetId ? sceneFocusIdSet.has(nextTargetId) : false;
    if (resolvedFocusOwnership.source === "none") {
      const shouldClearStaleFocus =
        focusOwnership.source !== "none" || !!activeProfile || narrativeOverrideIdsRef.current.length > 0;
      if (shouldClearStaleFocus && currentSceneTargetId) {
        tracePostSuccessContextDecision("[Nexora][PostSuccessContextPreserved]", {
          currentTargetId: currentSceneTargetId,
          nextTargetId: null,
          source: "focus",
          targetInScene: true,
          preserved: true,
        });
        return;
      }
      if (shouldClearStaleFocus && (focusedId || selectedObjectIdState)) {
        setFocusedId(null);
        selectedSetterRef.current(null);
        setSelectedObjectIdState(null);
        setSelectedObjectInfo(null);
        clearFocusOwnership("No valid focus owner remains.");
        if (process.env.NODE_ENV !== "production" && activeProfile?.initial_focus_object_ids?.length) {
          console.log("[Nexora][FocusOwnership] demo hint ignored for hard focus", {
            profile: activeProfile.id,
            hintIds: activeProfile.initial_focus_object_ids,
          });
        }
      }
      return;
    }
    if (nextTargetId && !nextTargetInScene) {
      tracePostSuccessContextDecision("[Nexora][ContextGuardBlocked]", {
        currentTargetId: currentSceneTargetId,
        nextTargetId,
        source: resolvedFocusOwnership.source === "narrative_step" ? "narrative" : "focus",
        targetInScene: false,
        preserved: Boolean(currentSceneTargetId),
      });
      return;
    }
    if (
      resolvedFocusOwnership.source === "narrative_step" &&
      currentSceneTargetId &&
      nextTargetId &&
      currentSceneTargetId !== nextTargetId &&
      focusOwnership.source === "none"
    ) {
      tracePostSuccessContextDecision("[Nexora][PostSuccessContextPreserved]", {
        currentTargetId: currentSceneTargetId,
        nextTargetId,
        source: "narrative",
        targetInScene: true,
        preserved: true,
      });
      return;
    }
    if (nextTargetId && focusedId !== nextTargetId) {
      tracePostSuccessContextDecision("[Nexora][PostSuccessContextAccepted]", {
        currentTargetId: currentSceneTargetId,
        nextTargetId,
        source: resolvedFocusOwnership.source === "narrative_step" ? "narrative" : "focus",
        targetInScene: true,
        preserved: false,
      });
      setFocusedId(nextTargetId);
    }
    if (nextTargetId && selectedObjectIdState !== nextTargetId) {
      selectedSetterRef.current(nextTargetId);
      setSelectedObjectIdState(nextTargetId);
      window.setTimeout(() => {
        updateSelectedObjectInfo(nextTargetId);
      }, 0);
    }
  }, [
    activeProfile,
    clearFocusOwnership,
    currentSceneTargetId,
    focusOwnership.source,
    focusedId,
    resolvedFocusOwnership,
    sceneFocusIdSet,
    selectedObjectIdState,
    setFocusedId,
    tracePostSuccessContextDecision,
    updateSelectedObjectInfo,
  ]);
  useEffect(() => {
    const nextSignature = JSON.stringify({
      active: narrativeSceneBinding.isActive,
      focusId: narrativeSceneBinding.focusId ?? null,
      highlightIds: narrativeSceneBinding.highlightIds,
      dimIds: narrativeSceneBinding.dimIds,
    });
    if (lastNarrativeOverrideSignatureRef.current === nextSignature) {
      return;
    }
    lastNarrativeOverrideSignatureRef.current = nextSignature;
    const previousIds = narrativeOverrideIdsRef.current;
    previousIds.forEach((id) => {
      setOverrideRef.current?.(id, { scale: 1, opacity: 1 });
    });

    if (!narrativeSceneBinding.isActive) {
      narrativeOverrideIdsRef.current = [];
      return;
    }

    const nextIds = Array.from(new Set([...narrativeSceneBinding.highlightIds, ...narrativeSceneBinding.dimIds]));
    narrativeSceneBinding.highlightIds.forEach((id, index) => {
      setOverrideRef.current?.(id, {
        scale: index === 0 ? 1.08 : 1.05,
        opacity: 1,
      });
    });
    narrativeSceneBinding.dimIds.forEach((id) => {
      setOverrideRef.current?.(id, {
        scale: 0.99,
        opacity: 0.58,
      });
    });
    narrativeOverrideIdsRef.current = nextIds;
  }, [
    narrativeSceneBinding.dimIds,
    narrativeSceneBinding.highlightIds,
    narrativeSceneBinding.isActive,
  ]);
  const buildDecisionPayload = useCallback((): DecisionExecutionPayload => {
    const selectedObjects = Array.from(
      new Set([selectedObjectIdState, focusedId].filter((value): value is string => typeof value === "string" && value.trim().length > 0))
    );

    return {
      selected_objects: selectedObjects,
      context: normalizeMessages(messagesRef.current ?? []).map((message) => ({
        role: message.role,
        text: message.text,
      })),
      scenario: decisionExecutionScenario ?? null,
    };
  }, [decisionExecutionScenario, focusedId, selectedObjectIdState]);
  const runSafeDecisionExecution = useCallback(
    async (
      endpoint: string,
      payload: DecisionExecutionPayload,
      intent: DecisionExecutionIntent | null
    ) =>
      safeExecuteDecision(intent, {
        endpoint,
        payload,
        responseData: guardedResponseData,
        timeoutMs: Math.min(
          Math.max(environmentConfig.runtime_safety.max_exploration_time_ms, 600),
          2500
        ),
        safeExecutionOnly: isFeatureEnabled(environmentConfig, "safe_execution_only"),
        executor: (endpoint, payload) => {
          if (endpoint !== "/decision/simulate" && endpoint !== "/decision/compare") {
            return Promise.reject(new Error(`Unsupported decision execution endpoint: ${endpoint}`));
          }
          return runDecisionExecution(endpoint, payload);
        },
      }),
    [environmentConfig, guardedResponseData]
  );

  const hasDecisionExecutionContext = useCallback(
    (payload: DecisionExecutionPayload) =>
      Boolean(guardedResponseData ?? sceneJson) ||
      Boolean(payload.scenario) ||
      (Array.isArray(payload.selected_objects) && payload.selected_objects.length > 0) ||
      (Array.isArray(payload.context) && payload.context.length > 0),
    [guardedResponseData, sceneJson]
  );

  const openDecisionExecutionPanel = useCallback(
    async (
      mode: "simulate" | "compare",
      originView: RightPanelView | null = null
    ) => {
      if (decisionExecutionLoading) {
        return;
      }

      const payload = buildDecisionPayload();
      const requestedOriginView = originView ?? rightPanelState.view ?? null;
      const targetView: ExecutiveActionTarget = mode;
      const action: ExecutiveActionIntent =
        mode === "compare" ? "compare_options" : "run_simulation";
      const endpoint = mode === "compare" ? "/decision/compare" : "/decision/simulate";
      const contextAvailable = hasDecisionExecutionContext(payload);
      const decisionRequestSeq = nextDemoFlowSequence(decisionFlowSeqRef);
      const fallbackMessage = getPanelActionFallbackMessage(action);
      const executionIntent: DecisionExecutionIntent = {
        id: `intent:${mode}:current`,
        action: mode === "compare" ? "Compare current decision" : "Simulate current decision",
        source: mode === "compare" ? "compare" : "recommendation",
        target_ids: Array.isArray(payload.selected_objects) ? payload.selected_objects : [],
        simulation_ready: true,
        compare_ready: true,
        safe_mode: true,
      };

      const applyExecutionOutcome = (
        result: DecisionExecutionResult,
        status: "ready" | "error",
        errorMessage: string | null,
        summary: string,
        executionMode: "real" | "preview" | "fallback"
      ) => {
        const normalizedSimulation =
          normalizeBackendSimulation((result as { decision_simulation?: unknown } | null)?.decision_simulation ?? null) ??
          normalizeBackendSimulation(result?.simulation_result ?? null);

        setDecisionResult(result);
        setResponseData((current: any) =>
          normalizeDecisionPayload(
            {
              ...appendDecisionActionTrace({
                payload: current,
                workspaceId: activeWorkspaceId,
                projectId: activeProjectId,
                mode,
                summary,
                confidence:
                  mode === "compare"
                    ? typeof result?.comparison?.[0]?.score === "number"
                      ? result.comparison[0].score
                      : null
                    : typeof result?.simulation_result?.impact_score === "number"
                      ? result.simulation_result.impact_score
                      : null,
                targetIds: Array.isArray(result?.simulation_result?.affected_objects)
                  ? result.simulation_result.affected_objects
                  : [],
              }),
              decision_result: result,
              decision_simulation: normalizedSimulation ?? current?.decision_simulation ?? null,
            }
          ).payload
        );
        setDecisionUiState({
          status,
          mode,
          data: result,
          error: errorMessage,
        });
        emitDecisionTrace({
          stage: "simulation",
          projectId: activeProjectId,
          confidence:
            mode === "compare"
              ? typeof result?.comparison?.[0]?.score === "number"
                ? result.comparison[0].score
                : null
              : typeof result?.simulation_result?.impact_score === "number"
                ? result.simulation_result.impact_score
                : null,
          summary,
          metadata: {
            endpoint,
            execution_mode: executionMode,
            mode,
          },
        });
        if (isLatestDemoFlowSequence(decisionFlowSeqRef, decisionRequestSeq)) {
          lastExplicitPanelIntentRef.current = {
            view: targetView,
            source: "openDecisionExecutionPanel",
            clickedTab: targetView,
            clickedNav: "strategy_group",
            timestamp: Date.now(),
          };
          dispatchCanonicalAction(
            normalizeOpenPanelCta({
              view: targetView,
              contextId: null,
              clickedTab: targetView,
              clickedNav: "strategy_group",
              rawSource: "openDecisionExecutionPanel",
              source: "panel_cta",
              surface: "decision_flow",
            })
          );
          globalThis.console.log("[NEXORA_DECISION_PANEL_OPEN]", {
            mode,
            targetView,
          });
        }
      };

      const buildPreviewResult = (): DecisionExecutionResult => {
        const previewResult = buildPreviewDecisionExecutionResult({
          intent: executionIntent,
          responseData: guardedResponseData,
        });
        if (mode === "compare") {
          return {
            ...previewResult,
            comparison: [
              { option: "Option A", score: 0.68 },
              { option: "Option B", score: 0.59 },
            ],
            comparison_result: {
              best_option_id: "option_a",
              comparison_summary: "Preview comparison is active until backend compare is available.",
              options: [
                { id: "option_a", label: "Option A", score: 0.68 },
                { id: "option_b", label: "Option B", score: 0.59 },
              ],
            },
          };
        }
        return previewResult;
      };

      traceDemoFlowEvent({
        phase: "started",
        source: mode === "compare" ? "decision_compare" : "decision_simulate",
        seq: decisionRequestSeq,
        detail: {
          requestedView: targetView,
          originView: requestedOriginView,
          contextAvailable,
        },
      });
      setDecisionExecutionLoading(true);
      setDecisionUiState((current) => ({
        status: "loading",
        mode,
        data: current.data,
        error: null,
      }));
      globalThis.console.log("[NEXORA_DECISION_EXECUTION]", {
        mode,
        status: "loading",
        hasData: false,
      });

      try {
        if (!contextAvailable) {
          const previewResult = buildPreviewResult();
          applyExecutionOutcome(
            previewResult,
            "ready",
            fallbackMessage,
            mode === "compare"
              ? "Comparison context is unavailable. Showing preview result."
              : "Simulation context is unavailable. Showing preview result.",
            "preview"
          );
          globalThis.console.log("[NEXORA_DECISION_EXECUTION]", {
            mode,
            status: "ready",
            hasData: true,
          });
          return;
        }

        const execution = await runSafeDecisionExecution(endpoint, payload, executionIntent);
        const result = execution.result;
        if (!result) {
          throw new Error(execution.error ?? `${mode} execution did not return a result.`);
        }
        if (!isLatestDemoFlowSequence(decisionFlowSeqRef, decisionRequestSeq)) {
          traceDemoFlowEvent({
            phase: "stale_ignored",
            source: mode === "compare" ? "decision_compare" : "decision_simulate",
            seq: decisionRequestSeq,
          });
          return;
        }

        applyExecutionOutcome(
          result,
          "ready",
          execution.mode === "preview" ? execution.error ?? null : null,
          mode === "compare"
            ? execution.mode === "real"
              ? "Comparison executed successfully."
              : execution.error ?? "Comparison fell back to preview mode."
            : execution.mode === "real"
              ? "Simulation executed successfully."
              : execution.error ?? "Simulation fell back to preview mode.",
          execution.mode === "failed" ? "fallback" : execution.mode
        );
        globalThis.console.log("[NEXORA_DECISION_EXECUTION]", {
          mode,
          status: "ready",
          hasData: true,
        });
      } catch (error) {
        if (!isLatestDemoFlowSequence(decisionFlowSeqRef, decisionRequestSeq)) {
          traceDemoFlowEvent({
            phase: "stale_ignored",
            source: mode === "compare" ? "decision_compare" : "decision_simulate",
            seq: decisionRequestSeq,
          });
          return;
        }
        console.error("[Nexora][DecisionExecution] request failed", { endpoint, error });
        const previewResult = buildPreviewResult();
        applyExecutionOutcome(
          previewResult,
          "ready",
          mode === "compare"
            ? "Comparison is not available yet. Showing preview result."
            : "Simulation is not available yet. Showing preview result.",
          mode === "compare"
            ? "Compare backend failed. Preview comparison opened."
            : "Simulation backend failed. Preview simulation opened.",
          "fallback"
        );
        globalThis.console.log("[NEXORA_DECISION_EXECUTION]", {
          mode,
          status: "error",
          hasData: true,
        });
      } finally {
        if (isLatestDemoFlowSequence(decisionFlowSeqRef, decisionRequestSeq)) {
          setDecisionExecutionLoading(false);
        }
      }
    },
    [
      activeProjectId,
      activeWorkspaceId,
      buildDecisionPayload,
      decisionExecutionLoading,
      emitDecisionTrace,
      dispatchCanonicalAction,
      guardedResponseData,
      hasDecisionExecutionContext,
      normalizeDecisionPayload,
      rightPanelState.view,
      runSafeDecisionExecution,
    ]
  );

  const runDemoScenario = useCallback(async () => {
    await loadDomainDemoScenario(activeDomainExperience.experience.domainId);
    await sendText("inventory shortage is delaying delivery", `demo:investor-flow:${Date.now()}`, {
      source: "demo",
    });
  }, [
    activeDomainExperience.experience.domainId,
    loadDomainDemoScenario,
    sendText,
  ]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    type DemoWindow = Window & {
      runDemoScenario?: () => Promise<void>;
    };

    const target = window as DemoWindow;
    target.runDemoScenario = runDemoScenario;

    const onRunDemoScenario = () => {
      void runDemoScenario();
    };

    window.addEventListener("nexora:run-demo-scenario", onRunDemoScenario as EventListener);
    return () => {
      if (target.runDemoScenario === runDemoScenario) {
        delete target.runDemoScenario;
      }
      window.removeEventListener("nexora:run-demo-scenario", onRunDemoScenario as EventListener);
    };
  }, [runDemoScenario]);

  const handleOpenDecisionPolicyPanel = useCallback(
    (contextId: string | null = null) => {
      dispatchCanonicalAction(
        normalizeOpenPanelCta({
          view: "decision_policy",
          contextId,
          rawSource: "handleOpenDecisionPolicyPanel",
          source: "system",
          surface: "sub_panel",
        })
      );
    },
    [dispatchCanonicalAction]
  );

  const handleOpenDecisionGovernancePanel = useCallback(
    (contextId: string | null = null) => {
      dispatchCanonicalAction(
        normalizeOpenPanelCta({
          view: "decision_governance",
          contextId,
          rawSource: "handleOpenDecisionGovernancePanel",
          source: "system",
          surface: "sub_panel",
        })
      );
    },
    [dispatchCanonicalAction]
  );

  const handleOpenExecutiveApprovalPanel = useCallback(
    (contextId: string | null = null) => {
      dispatchCanonicalAction(
        normalizeOpenPanelCta({
          view: "executive_approval",
          contextId,
          rawSource: "handleOpenExecutiveApprovalPanel",
          source: "system",
          surface: "sub_panel",
        })
      );
    },
    [dispatchCanonicalAction]
  );

  const handleOpenTimelinePanel = useCallback(
    (contextId: string | null = null) => {
      dispatchCanonicalAction(
        normalizeOpenPanelCta({
          view: "timeline",
          contextId,
          rawSource: "handleOpenTimelinePanel",
          source: "system",
          surface: "sub_panel",
        })
      );
    },
    [dispatchCanonicalAction]
  );

  const handlePreviewDecision = useCallback(
    (intent: DecisionExecutionIntent | null): DecisionAutomationResult => {
      if (!intent?.target_ids?.length) {
        return {
          status: "partial",
          mode: "preview",
          summary: "No targets are available to preview yet.",
        };
      }

      const previewResult = buildPreviewDecisionExecutionResult({
        intent,
        responseData: guardedResponseData,
      });
      setDecisionResult(previewResult);
      setResponseData((current: any) =>
        normalizeDecisionPayload(
          appendDecisionActionTrace({
            payload: current,
            workspaceId: activeWorkspaceId,
            projectId: activeProjectId,
            mode: "preview",
            summary: `Preview applied to ${intent.target_ids.length} ${intent.target_ids.length === 1 ? "target" : "targets"}.`,
            confidence: intent.confidence ?? null,
            targetIds: intent.target_ids,
          })
        ).payload
      );
      emitDecisionTrace({
        stage: "execution",
        projectId: activeProjectId,
        confidence: intent.confidence ?? null,
        summary: `Preview applied to ${intent.target_ids.length} ${intent.target_ids.length === 1 ? "target" : "targets"}.`,
        metadata: {
          mode: "preview",
          target_count: intent.target_ids.length,
        },
      });

      return {
        status: "success",
        mode: "preview",
        summary: `Preview applied to ${intent.target_ids.length} ${intent.target_ids.length === 1 ? "target" : "targets"}.`,
        affected_target_ids: intent.target_ids,
        next_view: rightPanelState.view ?? null,
      };
    },
    [activeProjectId, activeWorkspaceId, emitDecisionTrace, guardedResponseData, normalizeDecisionPayload, rightPanelState.view]
  );

  const handleApplyDecisionSafe = useCallback(
    (intent: DecisionExecutionIntent | null): DecisionAutomationResult => {
      if (!intent?.target_ids?.length) {
        return {
          status: "partial",
          mode: "apply",
          summary: "No affected targets are available for safe mode yet.",
        };
      }

      const previewResult = buildPreviewDecisionExecutionResult({
        intent,
        responseData: guardedResponseData,
      });
      setDecisionResult(previewResult);
      setResponseData((current: any) =>
        normalizeDecisionPayload(
          appendDecisionActionTrace({
            payload: current,
            workspaceId: activeWorkspaceId,
            projectId: activeProjectId,
            mode: "apply",
            summary: `Safe mode is active across ${intent.target_ids.length} ${intent.target_ids.length === 1 ? "target" : "targets"}.`,
            confidence: intent.confidence ?? null,
            targetIds: intent.target_ids,
          })
        ).payload
      );
      emitDecisionTrace({
        stage: "execution",
        projectId: activeProjectId,
        confidence: intent.confidence ?? null,
        summary: `Safe mode applied across ${intent.target_ids.length} ${intent.target_ids.length === 1 ? "target" : "targets"}.`,
        metadata: {
          mode: "apply",
          target_count: intent.target_ids.length,
        },
      });

      return {
        status: "success",
        mode: "apply",
        summary: `Safe mode is active across ${intent.target_ids.length} ${intent.target_ids.length === 1 ? "target" : "targets"}.`,
        affected_target_ids: intent.target_ids,
        next_view: rightPanelState.view ?? null,
      };
    },
    [activeProjectId, activeWorkspaceId, emitDecisionTrace, guardedResponseData, normalizeDecisionPayload, rightPanelState.view]
  );

  const handleSaveDecisionScenario = useCallback(
    (intent: DecisionExecutionIntent | null): DecisionAutomationResult => {
      if (!guardedResponseData) {
        return {
          status: "partial",
          mode: "save",
          summary: "No decision context is available to save yet.",
        };
      }

      const prompt =
        [...(messagesRef.current ?? [])]
          .reverse()
          .find((message) => message?.role === "user" && String(message?.text ?? "").trim())?.text ?? null;
      const payload =
        intent && guardedResponseData?.canonical_recommendation
          ? {
              ...guardedResponseData,
              canonical_recommendation: {
                ...guardedResponseData.canonical_recommendation,
                primary: {
                  ...guardedResponseData.canonical_recommendation.primary,
                  action: intent.action,
                  target_ids: intent.target_ids,
                  impact_summary:
                    intent.impact_summary ??
                    guardedResponseData.canonical_recommendation.primary?.impact_summary,
                },
              },
            }
          : guardedResponseData;

      const entry = buildDecisionMemoryEntry({
        responseData: payload,
        prompt,
        workspaceId: activeWorkspaceId,
        projectId: activeProjectId,
      });

      if (!entry) {
        return {
          status: "partial",
          mode: "save",
          summary: "There is not enough decision context to save this scenario yet.",
        };
      }

      const observedAssessment = buildObservedOutcomeAssessment({
        canonicalRecommendation: payload?.canonical_recommendation ?? null,
        responseData: payload,
        decisionResult,
        memoryEntries: decisionMemoryEntries,
      });
      const outcomeFeedback = buildDecisionOutcomeFeedback({
        canonicalRecommendation: payload?.canonical_recommendation ?? null,
        observedAssessment,
        memoryEntry: decisionMemoryEntries[0] ?? null,
        responseData: payload,
      });
      const calibrationResult = buildDecisionFeedbackSignal({
        canonicalRecommendation: payload?.canonical_recommendation ?? null,
        outcomeFeedback,
        priorAdjustedScore: decisionMemoryEntries[0]?.calibration_result?.adjusted_confidence_score ?? null,
      });
      const enrichedEntry = applyDecisionFeedbackToMemory({
        entry,
        outcomeFeedback,
        calibrationResult,
      });

      setDecisionMemoryEntries((current) =>
        appendDecisionMemoryEntry({
          workspaceId: activeWorkspaceId,
          projectId: activeProjectId,
          entry: enrichedEntry,
          existing: current,
        })
      );
      setResponseData((current: any) =>
        normalizeDecisionPayload(
          appendDecisionActionTrace({
            payload: current,
            workspaceId: activeWorkspaceId,
            projectId: activeProjectId,
            mode: "save",
            summary: "Scenario saved to decision memory.",
            confidence:
              typeof intent?.confidence === "number"
                ? intent.confidence
                : null,
            targetIds: Array.isArray(entry.target_ids)
              ? entry.target_ids
              : [],
          })
        ).payload
      );
      emitDecisionTrace({
        stage: "feedback",
        projectId: activeProjectId,
        confidence:
          typeof intent?.confidence === "number"
            ? intent.confidence
            : null,
        summary: "Scenario saved to decision memory.",
        metadata: {
          mode: "save",
          target_count: entry.target_ids?.length ?? 0,
        },
      });

      return {
        status: "success",
        mode: "save",
        summary: "Scenario saved to decision memory.",
        affected_target_ids: entry.target_ids ?? [],
        next_view: "memory",
      };
    },
    [activeProjectId, activeWorkspaceId, decisionMemoryEntries, decisionResult, emitDecisionTrace, guardedResponseData, normalizeDecisionPayload]
  );

  useEffect(() => {
    const previousIds = decisionOverrideIdsRef.current;
    previousIds.forEach((id) => {
      setOverrideRef.current?.(id, { scale: 1, opacity: 1 });
    });

    if (!decisionResult) {
      decisionOverrideIdsRef.current = [];
      return;
    }

    const highlightIds = Array.from(
      new Set([
        ...(Array.isArray(decisionResult.scene_actions?.highlight) ? decisionResult.scene_actions.highlight : []),
        ...(Array.isArray(decisionResult.simulation_result?.affected_objects) ? decisionResult.simulation_result.affected_objects : []),
      ])
    );
    const dimIds = Array.from(new Set(Array.isArray(decisionResult.scene_actions?.dim) ? decisionResult.scene_actions.dim : []));

    highlightIds.forEach((id, index) => {
      setOverrideRef.current?.(id, {
        scale: index === 0 ? 1.06 : 1.03,
        opacity: 1,
      });
    });
    dimIds.forEach((id) => {
      if (highlightIds.includes(id)) return;
      setOverrideRef.current?.(id, {
        scale: 0.99,
        opacity: 0.56,
      });
    });

    decisionOverrideIdsRef.current = Array.from(new Set([...highlightIds, ...dimIds]));
  }, [decisionResult]);
  const handleWarRoomOverlayChange = useCallback(
    (summary: WarRoomOverlaySummary | null, detail?: WarRoomOverlayDetail | null) => {
      warRoom.applyOverlaySummary(summary, detail ?? null);
    },
    [warRoom.applyOverlaySummary]
  );
  const panelDataValidation = useMemo<PanelSharedDataValidationResult>(
    () => {
      const DEBUG_PANEL_TRACE = process.env.NODE_ENV !== "production";
      const guardedResponseRecord =
        visibleResponseData && typeof visibleResponseData === "object" && !Array.isArray(visibleResponseData)
          ? visibleResponseData
          : null;
      const scannerPanelData = buildCanonicalPanelData(visibleResponseData ?? null);
      const promptAdviceFeedback =
        visibleResponseData?.prompt_feedback?.advice_feedback &&
        typeof visibleResponseData.prompt_feedback.advice_feedback === "object"
          ? visibleResponseData.prompt_feedback.advice_feedback
          : null;
      const canonicalRecommendationSource =
        visibleResponseData?.canonical_recommendation &&
        typeof visibleResponseData.canonical_recommendation === "object"
          ? visibleResponseData.canonical_recommendation
          : null;
      const sourceAdvice =
        visibleStrategicAdvice ??
        visibleResponseData?.strategic_advice ??
        promptAdviceFeedback ??
        canonicalRecommendationSource ??
        null;
      const sourceDashboard = visibleResponseData?.executive_summary_surface ?? null;
      const decisionAdviceSlice = decisionResult?.advice_slice ?? null;
      const decisionTimelineSlice = decisionResult?.timeline_slice ?? null;
      const decisionWarRoomSlice = decisionResult?.war_room_slice ?? null;
      const decisionSimulation =
        normalizeBackendSimulation(visibleResponseData?.decision_simulation ?? null) ??
        normalizeBackendSimulation(decisionResult?.simulation_result ?? null) ??
        null;
      // --- Normalize simulation for contract ---
      const mappedSimulation = decisionSimulation
        ? {
            summary: decisionSimulation.summary ?? null,
            impacted_nodes: Array.isArray(decisionSimulation.impacted_nodes)
              ? decisionSimulation.impacted_nodes
              : [],
            propagation: Array.isArray(decisionSimulation.propagation)
              ? decisionSimulation.propagation.map((edge) => ({
                  source: String(edge?.source ?? ""),
                  target: String(edge?.target ?? ""),
                  weight: typeof edge?.weight === "number" ? edge.weight : 0,
                }))
              : [],
            risk_delta:
              typeof decisionSimulation.risk_delta === "number"
                ? decisionSimulation.risk_delta
                : null,
          }
        : null;
      const simulationTimelineSource =
        visibleResponseData?.decision_simulation?.timeline &&
        typeof visibleResponseData.decision_simulation.timeline === "object"
          ? visibleResponseData.decision_simulation.timeline
          : null;
      const replayTimelineSource =
        visibleResponseData?.decision_replay?.timeline &&
        typeof visibleResponseData.decision_replay.timeline === "object"
          ? visibleResponseData.decision_replay.timeline
          : null;
      const timelineFromSimulation = simulationTimelineSource
        ? {
            steps: Array.isArray((simulationTimelineSource as any).steps)
              ? (simulationTimelineSource as any).steps
              : [],
            summary:
              typeof (simulationTimelineSource as any).summary === "string"
                ? (simulationTimelineSource as any).summary
                : null,
          }
        : replayTimelineSource
          ? {
              steps: Array.isArray((replayTimelineSource as any).steps)
                ? (replayTimelineSource as any).steps
                : Array.isArray((replayTimelineSource as any).timeline)
                  ? (replayTimelineSource as any).timeline
                  : [],
              summary:
                typeof (replayTimelineSource as any).summary === "string"
                  ? (replayTimelineSource as any).summary
                  : null,
            }
          : decisionSimulation
          ? {
              steps: decisionSimulation.propagation,
              summary: decisionSimulation.summary ?? null,
            }
          : null;
      const fallbackAdvice = sourceAdvice
        ? normalizeCanonicalAdvicePanelData(sourceAdvice, {
            defaultTitle: "Advice",
            fallbackSummary:
              sourceAdvice.summary ??
              promptAdviceFeedback?.summary ??
              canonicalRecommendationSource?.reasoning?.why ??
              sourceDashboard?.what_to_do ??
              null,
            fallbackRecommendedActions: Array.isArray(sourceAdvice.recommended_actions)
              ? sourceAdvice.recommended_actions
              : Array.isArray(promptAdviceFeedback?.recommended_actions)
                ? promptAdviceFeedback.recommended_actions
                : canonicalRecommendationSource?.primary?.action
                  ? [
                      {
                        action: canonicalRecommendationSource.primary.action,
                        impact_summary: canonicalRecommendationSource.primary.impact_summary ?? null,
                        tradeoff: canonicalRecommendationSource.reasoning?.tradeoffs?.[0] ?? null,
                      },
                    ]
                  : [],
            fallbackConfidence: sourceAdvice.confidence ?? canonicalRecommendationSource?.confidence ?? null,
            fallbackWhy:
              sourceAdvice.why ??
              promptAdviceFeedback?.why ??
              canonicalRecommendationSource?.reasoning?.why ??
              null,
            fallbackRecommendation:
              sourceAdvice.recommendation ??
              sourceAdvice.primary_recommendation?.action ??
              canonicalRecommendationSource?.primary?.action ??
              null,
            fallbackPrimaryRecommendation:
              sourceAdvice.primary_recommendation ??
              (canonicalRecommendationSource?.primary?.action
                ? { action: canonicalRecommendationSource.primary.action }
                : null),
            fallbackRiskSummary:
              sourceAdvice.risk_summary ??
              canonicalRecommendationSource?.reasoning?.risk_summary ??
              null,
            fallbackRecommendations: Array.isArray(sourceAdvice.recommendations)
              ? sourceAdvice.recommendations
              : [],
            fallbackRelatedObjectIds: Array.isArray(sourceAdvice.related_object_ids)
              ? sourceAdvice.related_object_ids
              : [],
            fallbackSupportingDriverLabels: Array.isArray(sourceAdvice.supporting_driver_labels)
              ? sourceAdvice.supporting_driver_labels
              : [],
          })
        : null;
      const mappedAdvice =
        decisionAdviceSlice
          ? normalizeCanonicalAdvicePanelData(decisionAdviceSlice, {
              defaultTitle: "Decision Advice",
              fallbackWhy:
                typeof decisionResult?.recommendation?.reason === "string" ? decisionResult.recommendation.reason : null,
              fallbackRiskSummary:
                typeof decisionResult?.recommendation?.expected_outcome === "string"
                  ? decisionResult.recommendation.expected_outcome
                  : null,
            })
          : scannerPanelData.advice ?? fallbackAdvice;
      const mappedDashboard = sourceDashboard
        ? {
            summary: sourceDashboard.summary ?? null,
            happened: sourceDashboard.happened ?? null,
            why_it_matters: sourceDashboard.why_it_matters ?? null,
            what_to_do: sourceDashboard.what_to_do ?? null,
          }
        : null;
      const mappedCompare =
        visibleResponseData?.decision_comparison ??
        visibleResponseData?.comparison ??
        decisionResult?.comparison ??
        null;
      const mappedReplay = visibleResponseData?.decision_replay ?? null;
      const fallbackWarRoom =
        fallbackAdvice ||
        mappedSimulation ||
        mappedCompare ||
        sourceDashboard ||
        strategicCouncil ||
        canonicalRecommendationSource
          ? {
              summary:
                sourceDashboard?.summary ??
                mappedAdvice?.summary ??
                decisionSimulation?.summary ??
                null,
              recommendation:
                mappedAdvice?.recommendation ??
                canonicalRecommendationSource?.primary?.action ??
                null,
              simulation_summary: mappedSimulation?.summary ?? null,
              compare_summary:
                typeof mappedCompare?.summary === "string"
                  ? mappedCompare.summary
                  : null,
              executive_summary: sourceDashboard?.summary ?? null,
              advice_summary: fallbackAdvice?.summary ?? null,
              strategic_advice: fallbackAdvice,
              canonical_recommendation: canonicalRecommendationSource ?? null,
              decision_simulation: mappedSimulation,
              decision_comparison: mappedCompare,
              decision_cockpit: visibleDecisionCockpit ?? visibleResponseData?.decision_cockpit ?? null,
              executive_summary_surface: mappedDashboard,
              strategic_council: strategicCouncil ?? null,
            }
          : null;
      const mappedWarRoom =
        decisionWarRoomSlice
          ? (() => {
              const normalizedWarRoom = normalizeCanonicalWarRoomPanelData(decisionWarRoomSlice, {
                fallbackSummary:
                  typeof decisionResult?.recommendation?.reason === "string"
                    ? decisionResult.recommendation.reason
                    : mappedAdvice?.summary ?? null,
                fallbackRecommendation:
                  typeof mappedAdvice?.recommendation === "string" ? mappedAdvice.recommendation : null,
                fallbackExecutiveSummary:
                  typeof decisionResult?.recommendation?.expected_outcome === "string"
                    ? decisionResult.recommendation.expected_outcome
                    : null,
                fallbackAdviceSummary: mappedAdvice?.summary ?? null,
                fallbackCompareSummary:
                  typeof decisionResult?.comparison_result?.comparison_summary === "string"
                    ? decisionResult.comparison_result.comparison_summary
                    : null,
                fallbackRelatedObjectIds: Array.isArray(decisionResult?.simulation_result?.affected_objects)
                  ? decisionResult.simulation_result.affected_objects.map(String)
                  : [],
              });
              if (!normalizedWarRoom) return null;
              return {
                ...normalizedWarRoom,
                strategic_advice: mappedAdvice,
                decision_comparison:
                  decisionResult?.comparison_result && typeof decisionResult.comparison_result === "object"
                    ? decisionResult.comparison_result
                    : null,
                executive_summary_surface: {
                  summary:
                    typeof decisionResult?.recommendation?.reason === "string"
                      ? decisionResult.recommendation.reason
                      : mappedAdvice?.summary ?? null,
                  happened:
                    typeof decisionResult?.comparison_result?.comparison_summary === "string"
                      ? decisionResult.comparison_result.comparison_summary
                      : null,
                  why_it_matters:
                    typeof decisionWarRoomSlice.posture === "string" ? decisionWarRoomSlice.posture : null,
                  what_to_do:
                    typeof mappedAdvice?.recommendation === "string" ? mappedAdvice.recommendation : null,
                },
              };
            })()
          : scannerPanelData.warRoom ??
        visibleResponseData?.multi_agent_decision ??
        warRoom.intelligence ??
        fallbackWarRoom ??
        null;
      const mappedTimeline =
        decisionTimelineSlice
          ? normalizeCanonicalTimelinePanelData(decisionTimelineSlice, {
              fallbackHeadline: "Decision Timeline",
              fallbackSummary:
                typeof decisionResult?.recommendation?.expected_outcome === "string"
                  ? decisionResult.recommendation.expected_outcome
                  : null,
              fallbackRelatedObjectIds: Array.isArray(decisionResult?.simulation_result?.affected_objects)
                ? decisionResult.simulation_result.affected_objects.map(String)
                : [],
            })
          : scannerPanelData.timeline ??
        timelineFromSimulation ??
        visibleResponseData?.timeline_impact ??
        null;
      const nextPanelDataInput = {
        ...(guardedResponseRecord ?? {}),
        raw: visibleResponseData ?? visibleSceneJson ?? null,
        responseData: visibleResponseData ?? null,
        sceneJson: visibleSceneJson ?? null,
        scene_json: visibleSceneJson ?? null,
        dashboard: mappedDashboard,
        advice: mappedAdvice,
        strategicAdvice: mappedAdvice,
        promptFeedback: visibleResponseData?.prompt_feedback ?? null,
        prompt_feedback: visibleResponseData?.prompt_feedback ?? null,
        decisionCockpit: visibleDecisionCockpit ?? visibleResponseData?.decision_cockpit ?? null,
        decision_cockpit: visibleDecisionCockpit ?? visibleResponseData?.decision_cockpit ?? null,
        executiveSummary: mappedDashboard,
        simulation: mappedSimulation,
        decision_simulation: visibleResponseData?.decision_simulation ?? decisionResult?.simulation_result ?? null,
        decisionSimulation: visibleResponseData?.decision_simulation ?? decisionResult?.simulation_result ?? null,
        timeline: mappedTimeline,
        risk: visibleRiskPropagation ?? visibleResponseData?.risk_propagation ?? null,
        memory: visibleMemoryInsights ?? visibleResponseData?.decision_memory ?? null,
        replay: mappedReplay,
        canonicalRecommendation: visibleResponseData?.canonical_recommendation ?? null,
        canonical_recommendation: visibleResponseData?.canonical_recommendation ?? null,
        decisionResult: decisionResult ?? null,
        decision_result: decisionResult ?? null,
        warRoom: mappedWarRoom,
        war_room: mappedWarRoom,
        compare: mappedCompare,
        governance: visibleResponseData?.decision_governance ?? null,
        approval: visibleResponseData?.approval_workflow ?? null,
        policy: visibleResponseData?.decision_policy ?? null,
        // --- Normalize strategicCouncil for contract ---
        strategicCouncil: strategicCouncil
          ? {
              summary:
                typeof (strategicCouncil as any).summary === "string"
                  ? (strategicCouncil as any).summary
                  : typeof (strategicCouncil as any).rationale === "string"
                  ? (strategicCouncil as any).rationale
                  : null,
              recommendation:
                typeof (strategicCouncil as any).recommendation === "string"
                  ? (strategicCouncil as any).recommendation
                  : typeof (strategicCouncil as any).final_recommendation === "string"
                  ? (strategicCouncil as any).final_recommendation
                  : null,
            }
          : null,
        strategicLearning: null,
        orgMemory: null,
        strategicCommand: null,
        memoryEntries: decisionMemoryEntries,
        nexoraB8PanelContext,
      };
      const activeFamilyAudit = activePanelFamilyAuditRef.current;
      const panelContract = validatePanelSharedDataWithDiagnostics(nextPanelDataInput);
      const nextPanelData = panelContract.data;
      const familyContractDiag = readPanelFamilyContractDiagnostics(
        activeFamilyAudit?.expectedFamily ?? null,
        nextPanelDataInput as Record<string, unknown>,
        nextPanelData as Record<string, unknown>
      );
      tracePanelFamilyAudit("[Nexora][PanelFamilyAudit] canonical_presence", {
        canonicalFamilyPresent: familyContractDiag.canonical.familyPresent,
        canonicalPayloadShape: familyContractDiag.canonical.payloadShape,
      });
      const contractRenderable = familyContractDiag.contractRenderable;
      const contractSalvaged = Boolean(activeFamilyAudit && familyContractDiag.payloadsLikelySalvaged);
      if (activeFamilyAudit && activePanelFamilyAuditRef.current?.seq === activeFamilyAudit.seq) {
        activePanelFamilyAuditRef.current = {
          ...activePanelFamilyAuditRef.current,
          contractRenderable,
          contractSalvaged,
        };
        traceAuditRef("update", {
          source: activePanelFamilyAuditRef.current.source,
          seq: activePanelFamilyAuditRef.current.seq,
          prompt: activePanelFamilyAuditRef.current.prompt,
          expectedFamily: activePanelFamilyAuditRef.current.expectedFamily ?? null,
          contractRenderable,
          contractSalvaged,
          reason: "contract_validation_result",
        });
      } else if (activeFamilyAudit) {
        traceAuditRef("stale_overwrite_blocked", {
          source: activeFamilyAudit.source,
          seq: activeFamilyAudit.seq,
          prompt: activeFamilyAudit.prompt,
          expectedFamily: activeFamilyAudit.expectedFamily ?? null,
          contractRenderable,
          contractSalvaged,
          reason: "contract_validation_seq_mismatch",
        });
      }
      tracePanelFamilyAudit("[Nexora][PanelFamilyAudit] contract_result", {
        salvaged: contractSalvaged,
        renderable: contractRenderable,
        validatedPayloadShape: familyContractDiag.validated.payloadShape,
      });
      tracePanelFlowRuntime("contract_result", {
        requestedView: activeFamilyAudit?.expectedFamily ?? null,
        dashboardOverride:
          rightPanelState.view === "dashboard" &&
          Boolean(activeFamilyAudit?.expectedFamily) &&
          activeFamilyAudit?.expectedFamily !== "dashboard" &&
          contractRenderable,
      });
      if (DEBUG_PANEL_TRACE) {
        console.log("[Nexora][Trace][HomeScreenRaw]", {
          hasResponseData: Boolean(visibleResponseData),
          hasSceneJson: Boolean(visibleSceneJson),
          hasStrategicAdvice: Boolean(visibleStrategicAdvice),
          hasDecisionCockpit: Boolean(visibleDecisionCockpit),
          hasDecisionResult: Boolean(decisionResult),
          hasRiskPropagation: Boolean(visibleRiskPropagation),
          hasConflicts: Array.isArray(visibleConflicts) ? visibleConflicts.length : 0,
          hasWarRoomIntelligence: Boolean(warRoom.intelligence),
          hasMemoryEntries: Array.isArray(decisionMemoryEntries) ? decisionMemoryEntries.length : 0,
          currentRightPanelView: rightPanelState.view ?? null,
        });
        console.log("[Nexora][Trace][HomeScreenPanelData]", {
          hasDashboard: Boolean(
            mappedDashboard ??
              visibleDecisionCockpit ??
              visibleResponseData?.executive_summary_surface ??
              visibleResponseData?.decision_cockpit
          ),
          hasAdvice: Boolean(mappedAdvice ?? visibleStrategicAdvice ?? visibleResponseData?.strategic_advice),
          hasTimeline: Boolean(mappedTimeline ?? decisionTimelineSlice ?? visibleResponseData?.timeline_impact),
          hasSimulation: Boolean(mappedSimulation ?? visibleResponseData?.decision_simulation ?? decisionResult?.simulation_result),
          hasRisk: Boolean(visibleRiskPropagation ?? visibleResponseData?.risk_propagation),
          hasFragility: Boolean(
            scannerPanelData.fragility ??
              visibleResponseData?.fragility ??
              visibleResponseData?.fragility_scan ??
              visibleSceneJson?.scene?.fragility
          ),
          hasConflict: Boolean(
            visibleResponseData?.conflict ??
              visibleResponseData?.conflicts ??
              visibleResponseData?.multi_agent_decision?.conflicts
          ),
          hasWarRoom: Boolean(mappedWarRoom ?? strategicCouncil ?? warRoom.intelligence),
        });
        console.log("[Nexora][CanonicalPanelData]", {
          source: scannerPanelData.advice || scannerPanelData.timeline || scannerPanelData.warRoom ? "scanner_truth" : "fallback",
          hasAdvice: Boolean(nextPanelData.advice ?? nextPanelData.strategicAdvice),
          hasTimeline: Boolean(nextPanelData.timeline ?? nextPanelData.simulation),
          hasWarRoom: Boolean(nextPanelData.warRoom),
        });
      }

      return panelContract;
    },
    [
      visibleResponseData,
      visibleSceneJson,
      visibleStrategicAdvice,
      visibleDecisionCockpit,
      visibleRiskPropagation,
      visibleMemoryInsights,
      visibleConflicts,
      decisionResult,
      warRoom.intelligence,
      strategicCouncil,
      decisionMemoryEntries,
      rightPanelState.view,
      traceAuditRef,
      nexoraB8PanelContext,
    ]
  );
  const panelData = panelDataValidation.data;
  const stablePanelData = useShallowStableObject(panelData);

  const panelDataForResolver = useMemo<PanelSharedData>(() => {
    void panelResolverB18Epoch;
    return {
      ...stablePanelData,
      nexoraAuditRecord: lastAuditRecordRef.current,
      nexoraPipelineTrust: nexoraPanelB18TrustRef.current,
      nexoraBiasLayerContext: biasLayerContext,
      nexoraOperatorMode: nexoraMode,
    } as PanelSharedData;
  }, [stablePanelData, panelResolverB18Epoch, biasLayerContext, nexoraMode]);

  const centerCompareNexoraB18 = useMemo(() => {
    if (centerComponent !== "compare") return null;
    const resolved = buildPanelResolvedData("compare", panelDataForResolver);
    const raw = resolved.data;
    const rec = raw && typeof raw === "object" && !Array.isArray(raw) ? (raw as Record<string, unknown>) : null;
    return (rec?.nexoraB18Compare as NexoraB18CompareResolved | undefined) ?? null;
  }, [centerComponent, panelDataForResolver]);

  const lastHomePanelContractDebugSigRef = useRef<string | null>(null);
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (!panelDataValidation.contractFailed) return;
    const sig = panelDataValidation.contractDebugSignature;
    if (lastHomePanelContractDebugSigRef.current === sig) return;
    lastHomePanelContractDebugSigRef.current = sig;
    const detail = panelDataValidation.contractFailureDetail;
    if (!detail) return;
    emitDebugEvent({
      type: "contract_validation_failed",
      layer: "contract",
      source: "panelDataContract",
      status: "warn",
      message: `PanelSharedData validation failed (${detail.issueCount} issues); salvaged`,
      metadata: {
        issueCount: detail.issueCount,
        issuePaths: detail.issuePaths,
        rejectedSlices: detail.rejectedSlices,
      },
    });
    emitGuardRailAlerts(runGuardChecks({ trigger: "contract_check" }, getRecentDebugEvents()));
  }, [panelDataValidation.contractFailed, panelDataValidation.contractDebugSignature]);

  const previousPanelDataRef = useRef<PanelSharedData | null>(null);
  const previousResponseDataRef = useRef<typeof visibleResponseData | null>(null);
  const previousSceneJsonRef = useRef<typeof visibleSceneJson | null>(null);
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const panelDataRefChanged = previousPanelDataRef.current !== stablePanelData;
    const responseDataRefChanged = previousResponseDataRef.current !== visibleResponseData;
    const sceneJsonRefChanged = previousSceneJsonRef.current !== visibleSceneJson;
    if (!panelDataRefChanged && !responseDataRefChanged && !sceneJsonRefChanged) {
      return;
    }
    console.log("[NEXORA][DATA_STABILITY]", {
      panelDataRefChanged,
      responseDataRefChanged,
      sceneJsonRefChanged,
    });
    previousPanelDataRef.current = stablePanelData;
    previousResponseDataRef.current = visibleResponseData;
    previousSceneJsonRef.current = visibleSceneJson;
  }, [stablePanelData, visibleResponseData, visibleSceneJson]);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.log("[Nexora][PanelDataDebug]", {
        hasSimulation: Boolean(stablePanelData.simulation),
        timeline: stablePanelData.timeline ?? null,
        advice: stablePanelData.advice ?? stablePanelData.strategicAdvice ?? null,
        dashboard: stablePanelData.dashboard ?? stablePanelData.executiveSummary ?? null,
      });
    }
  }, [stablePanelData]);

  const panelFamilyAuditSnapshot = activePanelFamilyAuditRef.current;
  const panelFamilyAuditReadSig = useMemo(() => {
    if (panelFamilyAuditSnapshot) {
      return [
        "read",
        panelFamilyAuditSnapshot.source,
        panelFamilyAuditSnapshot.seq ?? "null",
        panelFamilyAuditSnapshot.prompt ?? "",
        panelFamilyAuditSnapshot.expectedFamily ?? "null",
        panelFamilyAuditSnapshot.contractRenderable ? "1" : "0",
        panelFamilyAuditSnapshot.contractSalvaged ? "1" : "0",
      ].join("|");
    }
    const lastClearedAudit = lastClearedPanelFamilyAuditRef.current;
    if (
      lastClearedAudit &&
      Date.now() - lastClearedAudit.clearedAt < 2000 &&
      rightPanelState.view !== null
    ) {
      return [
        "early_clear_detected",
        lastClearedAudit.source,
        lastClearedAudit.seq ?? "null",
        lastClearedAudit.prompt ?? "",
        lastClearedAudit.expectedFamily ?? "null",
        lastClearedAudit.contractRenderable ? "1" : "0",
        lastClearedAudit.contractSalvaged ? "1" : "0",
      ].join("|");
    }
    return null;
  }, [panelFamilyAuditSnapshot, rightPanelState.view]);
  const lastPanelFamilyAuditReadSigRef = useRef<string | null>(null);
  useEffect(() => {
    if (!panelFamilyAuditReadSig) return;
    if (panelFamilyAuditReadSig === lastPanelFamilyAuditReadSigRef.current) return;
    lastPanelFamilyAuditReadSigRef.current = panelFamilyAuditReadSig;
    if (panelFamilyAuditSnapshot) {
      traceAuditRef("read", {
        source: panelFamilyAuditSnapshot.source,
        seq: panelFamilyAuditSnapshot.seq,
        prompt: panelFamilyAuditSnapshot.prompt,
        expectedFamily: panelFamilyAuditSnapshot.expectedFamily ?? null,
        contractRenderable: panelFamilyAuditSnapshot.contractRenderable === true,
        contractSalvaged: panelFamilyAuditSnapshot.contractSalvaged === true,
        reason: "build_host_debug_props",
      });
      return;
    }
    const lastClearedAudit = lastClearedPanelFamilyAuditRef.current;
    if (!lastClearedAudit) return;
    traceAuditRef("early_clear_detected", {
      source: lastClearedAudit.source,
      seq: lastClearedAudit.seq,
      prompt: lastClearedAudit.prompt,
      expectedFamily: lastClearedAudit.expectedFamily ?? null,
      contractRenderable: lastClearedAudit.contractRenderable === true,
      contractSalvaged: lastClearedAudit.contractSalvaged === true,
      reason: lastClearedAudit.clearReason,
    });
  }, [panelFamilyAuditReadSig, panelFamilyAuditSnapshot, traceAuditRef]);

  const panelFamilyAuditDebug = useShallowStableObject(
    panelFamilyAuditSnapshot
      ? {
          prompt: panelFamilyAuditSnapshot.prompt,
          expectedFamily: panelFamilyAuditSnapshot.expectedFamily,
          source: panelFamilyAuditSnapshot.source,
          contractRenderable: panelFamilyAuditSnapshot.contractRenderable === true,
          contractSalvaged: panelFamilyAuditSnapshot.contractSalvaged === true,
        }
      : null
  );

  const panelContent = (
    <RightPanelHost
      rightPanelState={rightPanelState}
      panelData={panelDataForResolver}
      backendBase={BACKEND_BASE}
      episodeId={episodeId}
      sceneJson={visibleSceneJson ?? undefined}
      responseData={visibleResponseData ?? undefined}
      activeMode={activeMode}
      conflicts={visibleConflicts ?? undefined}
      objectSelection={visibleObjectSelection ?? undefined}
      memoryInsights={visibleMemoryInsights ?? undefined}
      decisionMemoryEntries={decisionMemoryEntries}
      riskPropagation={visibleRiskPropagation ?? undefined}
      strategicAdvice={visibleStrategicAdvice ?? undefined}
      strategicCouncil={strategicCouncil ?? undefined}
      decisionImpact={decisionImpact ?? undefined}
      decisionCockpit={visibleDecisionCockpit ?? undefined}
      opponentModel={visibleOpponentModel ?? undefined}
      strategicPatterns={visibleStrategicPatterns ?? undefined}
      selectedObjectId={visibleSelectedObjectId ?? null}
      selectedObjectLabel={selectedObjectLabelForWarRoom}
      focusedId={visibleFocusedId ?? null}
      resolveObjectLabel={resolveSceneObjectLabel}
      demoProfile={activeProfile ?? undefined}
      decisionResult={decisionResult ?? undefined}
      decisionLoading={decisionExecutionLoading}
      decisionStatus={decisionUiState.status}
      decisionError={decisionUiState.error}
      activeExecutiveView={activeExecutiveView}
      guidedPromptDebug={null}
      panelFamilyAuditDebug={panelFamilyAuditDebug}
      warRoom={warRoom}
      onSceneUpdateFromTimeline={handleSceneUpdateFromTimeline}
      onSimulateDecision={() =>
        dispatchCanonicalAction(normalizeRunSimulation({ rawSource: "RightPanelHost:simulate" }))
      }
      onCompareOptions={() =>
        dispatchCanonicalAction(normalizeCompareOptions({ rawSource: "RightPanelHost:compare" }))
      }
      onOpenWarRoom={() =>
        dispatchCanonicalAction(normalizeOpenPanelCta({ view: "war_room", rawSource: "RightPanelHost:war_room" }))
      }
      onOpenRiskFlow={() =>
        dispatchCanonicalAction(normalizeOpenPanelCta({ view: "risk", rawSource: "RightPanelHost:risk" }))
      }
      onOpenWhyThis={() =>
        dispatchCanonicalAction(normalizeOpenPanelCta({ view: "advice", rawSource: "RightPanelHost:advice" }))
      }
      onOpenStrategicCommand={() =>
        dispatchCanonicalAction(
          normalizeOpenPanelCta({ view: "strategic_command", rawSource: "RightPanelHost:strategic_command" })
        )
      }
      onOpenTimeline={() =>
        dispatchCanonicalAction(normalizeOpenCenterTimeline({ rawSource: "RightPanelHost:timeline" }))
      }
      onOpenMemory={() =>
        dispatchCanonicalAction(normalizeOpenPanelCta({ view: "memory", rawSource: "RightPanelHost:memory" }))
      }
      onOpenDecisionLifecycle={() =>
        dispatchCanonicalAction(normalizeOpenPanelCta({ view: "decision_lifecycle", rawSource: "RightPanelHost:decision_lifecycle" }))
      }
      onOpenStrategicLearning={() =>
        dispatchCanonicalAction(normalizeOpenPanelCta({ view: "strategic_learning", rawSource: "RightPanelHost:strategic_learning" }))
      }
      onOpenMetaDecision={() =>
        dispatchCanonicalAction(normalizeOpenPanelCta({ view: "meta_decision", rawSource: "RightPanelHost:meta_decision" }))
      }
      onOpenCognitiveStyle={() =>
        dispatchCanonicalAction(normalizeOpenPanelCta({ view: "cognitive_style", rawSource: "RightPanelHost:cognitive_style" }))
      }
      onOpenTeamDecision={() =>
        dispatchCanonicalAction(normalizeOpenPanelCta({ view: "team_decision", rawSource: "RightPanelHost:team_decision" }))
      }
      onOpenCollaborationIntelligence={() =>
        dispatchCanonicalAction(
          normalizeOpenPanelCta({ view: "collaboration_intelligence", rawSource: "RightPanelHost:collaboration_intelligence" })
        )
      }
      onOpenDecisionCouncil={() =>
        dispatchCanonicalAction(normalizeOpenPanelCta({ view: "decision_council", rawSource: "RightPanelHost:decision_council" }))
      }
      onOpenOrgMemory={() =>
        dispatchCanonicalAction(normalizeOpenPanelCta({ view: "org_memory", rawSource: "RightPanelHost:org_memory" }))
      }
      onOpenDecisionPolicy={handleOpenDecisionPolicyPanel}
      onOpenDecisionGovernance={handleOpenDecisionGovernancePanel}
      onOpenExecutiveApproval={handleOpenExecutiveApprovalPanel}
      onOpenDecisionTimeline={() =>
        dispatchCanonicalAction(normalizeOpenPanelCta({ view: "decision_timeline", rawSource: "RightPanelHost:decision_timeline" }))
      }
      onOpenConfidenceCalibration={() =>
        dispatchCanonicalAction(
          normalizeOpenPanelCta({ view: "confidence_calibration", rawSource: "RightPanelHost:confidence_calibration" })
        )
      }
      onOpenOutcomeFeedback={() =>
        dispatchCanonicalAction(normalizeOpenPanelCta({ view: "outcome_feedback", rawSource: "RightPanelHost:outcome_feedback" }))
      }
      onOpenPatternIntelligence={() =>
        dispatchCanonicalAction(
          normalizeOpenPanelCta({ view: "pattern_intelligence", rawSource: "RightPanelHost:pattern_intelligence" })
        )
      }
      onOpenScenarioTree={() =>
        dispatchCanonicalAction(normalizeOpenPanelCta({ view: "scenario_tree", rawSource: "RightPanelHost:scenario_tree" }))
      }
      onOpenDashboard={handleOpenDashboard}
      onPreviewDecision={handlePreviewDecision}
      onSaveScenario={handleSaveDecisionScenario}
      onApplyDecisionSafe={handleApplyDecisionSafe}
      onOpenObject={handleOpenObject}
      onCloseWarRoom={() => {
        warRoom.closeWarRoom();
        if (selectedObjectIdState) {
          handleOpenObject(selectedObjectIdState);
          return;
        }
        handleOpenDashboard();
      }}
      onOpenCenterComponent={openCenterComponent}
    />
  );
  const activeInspectorHostId = useMemo(
    () =>
      resolveRightPanelInspectorHostId(
        rightPanelState.view,
        rightPanelTab ?? preferredRightPanelLegacyTabRef.current
      ),
    [rightPanelState.view, rightPanelTab]
  );

  useEffect(() => {
    if (!isClientMounted) {
      setInspectorPortalHost(null);
      return;
    }

    if (!activeInspectorHostId) {
      if (process.env.NODE_ENV !== "production") {
        console.log("[Nexora][RightPanelHost]", {
          stage: "host_cleared_no_target",
          view: rightPanelState.view ?? null,
          activeInspectorHostId: null,
        });
      }
      setInspectorPortalHost(null);
      return;
    }

    const host = document.getElementById(activeInspectorHostId);
    if (host instanceof HTMLElement) {
      if (process.env.NODE_ENV !== "production") {
        console.log("[Nexora][RightPanelHost]", {
          stage: "host_resolved",
          view: rightPanelState.view ?? null,
          activeInspectorHostId,
        });
      }
      setInspectorPortalHost(host);
      return;
    }

    // Preserve previous host during transient shell-section churn.
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Nexora][RightPanelHost]", {
        stage: "host_missing_preserve_previous",
        view: rightPanelState.view ?? null,
        activeInspectorHostId,
      });
    }
  }, [activeInspectorHostId, isClientMounted, rightPanelState.view]);

  const timelineInspectorNode =
    isClientMounted && inspectorPortalHost && panelContent
      ? createPortal(panelContent, inspectorPortalHost)
      : null;
  const alertOverlayNode = alert ? (
    <StrategicAlertOverlay
      level={alert.level as any}
      score={alert.score}
      reasons={alert.reasons}
      onDismiss={dismissAlert}
    />
  ) : null;

  const isDomainDemoActive =
    readSceneJsonMetaString(visibleSceneJson, "demo_id").toLowerCase() ===
    String(activeDomainDemo.id).toLowerCase();
  const hasUserPrompt = messages.some(
    (m) => m.role === "user" && typeof m.text === "string" && m.text.trim().length > 0
  );
  const showDomainPromptGuide = !!visibleSceneJson && isDomainDemoActive && !hasUserPrompt;
  const domainPromptSuggestions = activeDomainExperience.experience.promptExamples;
  const launchDomainActive = isLaunchDomain(activeDomainExperience.experience.domainId);
  const isRetailStoryScene =
    !!visibleSceneJson &&
    (readSceneJsonMetaString(visibleSceneJson, "demo_id").toLowerCase() === RETAIL_DEMO_ID ||
      activeDomainExperience.experience.domainId === "retail");
  const retailDemoAccent = useMemo(() => {
    if (!isRetailStoryScene || !retailDemoFlow.currentStep) return null;
    const mode = retailDemoFlow.currentStep.visual_mode;
    if (mode === "shock") {
      return { label: "Shock", tint: "rgba(248,113,113,0.3)", glow: "rgba(248,113,113,0.16)" };
    }
    if (mode === "propagation") {
      return { label: "Propagation", tint: "rgba(251,191,36,0.26)", glow: "rgba(251,191,36,0.14)" };
    }
    if (mode === "fragility") {
      return { label: "Fragility", tint: "rgba(244,63,94,0.3)", glow: "rgba(244,63,94,0.16)" };
    }
    if (mode === "decision") {
      return { label: "Decision", tint: "rgba(96,165,250,0.28)", glow: "rgba(96,165,250,0.14)" };
    }
    if (mode === "outcome") {
      return { label: "Outcome", tint: "rgba(74,222,128,0.26)", glow: "rgba(74,222,128,0.12)" };
    }
    return { label: "Normal State", tint: "rgba(148,163,184,0.22)", glow: "rgba(148,163,184,0.1)" };
  }, [isRetailStoryScene, retailDemoFlow.currentStep]);
  const traceSceneObjectIds = useMemo(
    () =>
      Array.isArray(visibleSceneJson?.scene?.objects)
        ? (visibleSceneJson.scene.objects as any[])
            .map((obj: any, idx: number) => String(obj?.id ?? obj?.name ?? `${obj?.type ?? "obj"}:${idx}`))
            .slice(0, 12)
        : [],
    [visibleSceneJson]
  );
  useEffect(() => {
    traceHighlightFlow("homescreen_before_scene", {
      highlightedObjectIds: Array.isArray(effectiveObjectSelection?.highlighted_objects)
        ? effectiveObjectSelection.highlighted_objects.map(String)
        : [],
      dimUnrelatedObjects: effectiveObjectSelection?.dim_unrelated_objects === true,
      focusedId: focusedId ?? null,
      selectedObjectId: selectedObjectIdState ?? null,
      focusMode,
      focusPinned,
      rightPanelTab,
      hasSceneJson: !!visibleSceneJson,
      sceneObjectIds: traceSceneObjectIds,
    });
  }, [
    focusMode,
    focusPinned,
    focusedId,
    effectiveObjectSelection,
    rightPanelTab,
    visibleSceneJson,
    selectedObjectIdState,
    traceSceneObjectIds,
  ]);
  const domainPanelEmphasisLabels = useMemo(
    () =>
      activeDomainExperience.experience.preferredPanels
        .slice(0, 4)
        .map((panelId) =>
          String(panelId)
            .replace(/_panel$/i, "")
            .replace(/_/g, " ")
            .replace(/\b\w/g, (match) => match.toUpperCase())
        ),
    [activeDomainExperience]
  );

  const decisionAnalysisSelectorResponseSignature = useMemo(() => {
    const rd = visibleResponseData && typeof visibleResponseData === "object" ? (visibleResponseData as Record<string, unknown>) : null;
    return JSON.stringify({
      hasData: Boolean(rd),
      keys: rd ? Object.keys(rd).sort().slice(0, 24) : [],
      summary: typeof rd?.analysis_summary === "string" ? rd.analysis_summary : null,
      hasDecisionAnalysis: Boolean(rd && typeof rd.decision_analysis === "object" && rd.decision_analysis),
    });
  }, [visibleResponseData]);

  const decisionAnalysisSelectorSceneSignature = useMemo(() => {
    const sj = visibleSceneJson && typeof visibleSceneJson === "object" ? (visibleSceneJson as Record<string, unknown>) : null;
    const scene = sj?.scene && typeof sj.scene === "object" ? (sj.scene as Record<string, unknown>) : null;
    return JSON.stringify({
      hasData: Boolean(sj),
      keys: sj ? Object.keys(sj).sort().slice(0, 24) : [],
      hasDecisionAnalysis: Boolean(sj && typeof sj.decision_analysis === "object" && sj.decision_analysis),
      hasNestedDecisionAnalysis: Boolean(scene && typeof scene.decision_analysis === "object" && scene.decision_analysis),
    });
  }, [visibleSceneJson]);

  const decisionAnalysisForInvestorDemo = useMemo(
    () => pickDecisionAnalysisFromResponse(visibleResponseData, visibleSceneJson),
    [decisionAnalysisSelectorResponseSignature, decisionAnalysisSelectorSceneSignature]
  );
  const investorDemoExplanationBlock = useMemo(
    () =>
      buildScenarioExplanationFromDecisionAnalysis(
        decisionAnalysisForInvestorDemo,
        visibleSceneJson,
        visibleResponseData
      ),
    [decisionAnalysisForInvestorDemo, visibleResponseData, visibleSceneJson]
  );
  const investorDemoHasScenario = useMemo(() => hasRenderableScenario(visibleSceneJson), [visibleSceneJson]);
  const investorDemoHasAnalysis = decisionAnalysisForInvestorDemo != null;

  useEffect(() => {
    if (!investorDemo.demo.active) return;
    const step = investorDemo.demo.step;
    if (step < 1 || !investorDemoHasAnalysis) return;
    dispatchCanonicalAction(
      normalizeOpenPanelCta({
        view: "explanation",
        contextId: null,
        legacyTab: "explanation",
        section: "explanation",
        rawSource: "investor_demo:auto_explanation",
        source: "demo",
        surface: "guided_flow",
      })
    );
  }, [investorDemo.demo.active, investorDemo.demo.step, investorDemoHasAnalysis, dispatchCanonicalAction]);

  useEffect(() => {
    if (!investorDemo.demo.active) return;
    if (investorDemo.demo.step < 1 || !investorDemoHasAnalysis) return;
    const primaryId =
      resolveInvestorDemoFocusObjectId(visibleResponseData, visibleSceneJson) ??
      extractSceneObjectIds(visibleSceneJson)[0] ??
      null;
    if (!primaryId) return;
    setObjectSelection((prev: any) => ({
      ...(prev && typeof prev === "object" ? prev : {}),
      highlighted_objects: [primaryId],
    }));
    setFocusedId(primaryId);
    setSelectedObjectIdState(primaryId);
    setFocusMode("selected");
    updateSelectedObjectInfo(primaryId);
    claimFocusOwnership({
      source: "narrative_step",
      objectId: primaryId,
      isPersistent: false,
      reason: "Investor demo guided highlight.",
    });
    setResponseData((prev: any) => {
      if (!prev || typeof prev !== "object") return prev;
      const baseSel = prev.object_selection && typeof prev.object_selection === "object" ? prev.object_selection : {};
      return {
        ...prev,
        object_selection: {
          ...baseSel,
          highlighted_objects: [primaryId],
        },
      };
    });
  }, [
    claimFocusOwnership,
    investorDemo.demo.active,
    investorDemo.demo.step,
    investorDemoHasAnalysis,
    setFocusMode,
    updateSelectedObjectInfo,
    visibleResponseData,
    visibleSceneJson,
  ]);

  useEffect(() => {
    if (!investorDemo.demo.active) return;
    const step = investorDemo.demo.step;
    if (step < 1 || step > 5) return;
    const keys = ["", "problem", "cause", "impact", "recommendation", "trust"] as const;
    const key = keys[step];
    if (!key) return;
    const t = window.setTimeout(() => {
      document.querySelector(`[data-investor-demo-section="${key}"]`)?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 160);
    return () => window.clearTimeout(t);
  }, [investorDemo.demo.active, investorDemo.demo.step]);

  const investorDemoOverlayModel = useMemo(() => {
    const b = investorDemoExplanationBlock;
    const trim = (s: string, n: number) => {
      const t = String(s ?? "").trim();
      if (t.length <= n) return t;
      return `${t.slice(0, Math.max(1, n - 1)).trimEnd()}…`;
    };
    const step = investorDemo.demo.step;
    const fallback = (line: string, empty: string) => (String(line ?? "").trim() ? trim(line, 320) : empty);
    if (step === 0) {
      return {
        title: "Investor demo",
        description:
          investorDemoHasAnalysis && investorDemoHasScenario
            ? "Press Next to walk through this scenario with live decision data."
            : "Walk the story on whatever is loaded now — run Analyze and load a scenario for richer panels. You can still advance each step.",
      };
    }
    if (step === 1) {
      return {
        title: "Problem",
        description: `This is where the system is under pressure.\n\n${fallback(
          b.problem,
          "No problem summary yet — continue or run Analyze for live copy."
        )}`,
      };
    }
    if (step === 2) {
      return {
        title: "Cause",
        description: `The issue is driven by these underlying signals.\n\n${fallback(
          b.cause,
          "No cause line yet — continue or run Analyze for live copy."
        )}`,
      };
    }
    if (step === 3) {
      return {
        title: "Impact",
        description: `If not addressed, this will affect system performance.\n\n${fallback(
          b.impact,
          "No impact line yet — continue or run Analyze for live copy."
        )}`,
      };
    }
    if (step === 4) {
      return {
        title: "Decision",
        description: `Nexora recommends this action to stabilize the system.\n\n${fallback(
          b.recommendation,
          "No recommendation yet — continue or run Analyze for live copy."
        )}`,
      };
    }
    const trust = b.trust;
    const trustSnippet = trust
      ? [trust.whyThisBullets[0], trust.evidence[0], trust.confidence.summaryLine].filter(Boolean).join(" ")
      : "";
    return {
      title: "Trust",
      description: `This decision is backed by simulation and strategy comparison.\n\n${
        trustSnippet.trim()
          ? trim(trustSnippet, 360)
          : "Trust details will populate after decision analysis. You can still finish the tour."
      }`,
    };
  }, [
    investorDemo.demo.step,
    investorDemoExplanationBlock,
    investorDemoHasAnalysis,
    investorDemoHasScenario,
  ]);

  const isDevIngestion = process.env.NODE_ENV !== "production" && getNexoraProductMode() !== "pilot";
  const [lastTextIngestionResult, setLastTextIngestionResult] = useState<HomeScreenLastIngestion>(null);
  const lastTextIngestionResultRef = useRef<HomeScreenLastIngestion>(null);
  /** Dedupes `[Nexora][IngestionDebug] global_updated` when the exposed snapshot is unchanged. */
  const lastNexoraIngestionGlobalExposeSigRef = useRef<string | null>(null);
  const [lastMultiSourceIngestion, setLastMultiSourceIngestion] = useState<MultiSourceIngestionResponse | null>(null);
  const lastMultiSourceIngestionRef = useRef<MultiSourceIngestionResponse | null>(null);
  const lastIngestionFragilityBridgeSigRef = useRef<string | null>(null);
  const lastMultiSourceBridgeSigRef = useRef<string | null>(null);
  const lastPipelineStatusSigRef = useRef<string | null>(null);
  const [pipelineStatusUi, setPipelineStatusUi] = useState<NexoraPipelineStatusUi>(() => createInitialPipelineStatusUi());
  const lastAuditSignatureRef = useRef<string | null>(null);
  const [auditHudEpoch, setAuditHudEpoch] = useState(0);
  const lastReplaySnapshotRef = useRef<NexoraReplaySnapshot | null>(null);
  const lastReplayApplySignatureRef = useRef<string | null>(null);
  /** B.41 — dedupe domain usage rows: runId|requested|resolved|effective */
  const lastB41DomainUsageSigRef = useRef<string | null>(null);
  const lastExportBundleRef = useRef<NexoraExportBundle | null>(null);
  const lastB15BundleSigRef = useRef<string | null>(null);
  /** B.19 — append scenario memory at most once per audit signature (no write loops). */
  const lastB19ScenarioMemoryAppendSigRef = useRef<string | null>(null);
  const [runHistoryEpoch, setRunHistoryEpoch] = useState(0);
  const recentRunsForHud = useMemo(() => loadNexoraRunHistory().slice(0, 5), [runHistoryEpoch]);
  const [importBundleOpen, setImportBundleOpen] = useState(false);
  const [importBundleDraft, setImportBundleDraft] = useState("");
  const [importBundleError, setImportBundleError] = useState<string | null>(null);
  const [importBundleHint, setImportBundleHint] = useState<string | null>(null);
  const lastB17ImportBundleSigRef = useRef<string | null>(null);

  const commitPipelineStatus = useCallback((next: NexoraPipelineStatusUi) => {
    if (shouldSkipPipelineStatusCommit(next, lastPipelineStatusSigRef.current)) return;
    if (!next.decisionPosture) {
      pipelineB7ActionContextRef.current = null;
      setNexoraB8PanelContext(null);
    }
    lastPipelineStatusSigRef.current = buildPipelineStatusSignature(next);
    setPipelineStatusUi(next);
  }, []);

  const mergePipelineStatus = useCallback((partial: Partial<NexoraPipelineStatusUi>) => {
    setPipelineStatusUi((prev) => {
      const next: NexoraPipelineStatusUi = { ...prev, ...partial };
      if (shouldSkipPipelineStatusCommit(next, lastPipelineStatusSigRef.current)) return prev;
      if (!next.decisionPosture) {
        pipelineB7ActionContextRef.current = null;
        if (typeof queueMicrotask === "function") {
          queueMicrotask(() => setNexoraB8PanelContext(null));
        } else {
          setTimeout(() => setNexoraB8PanelContext(null), 0);
        }
      }
      lastPipelineStatusSigRef.current = buildPipelineStatusSignature(next);
      return next;
    });
  }, []);

  commitPipelineStatusRef.current = commitPipelineStatus;
  mergePipelineStatusRef.current = mergePipelineStatus;

  const runbookStepId = useMemo((): NexoraRunbookStepId => {
    const audit = lastAuditRecordRef.current;
    const runId = audit?.runId ?? null;
    const hasRecordedOutcome = runId ? Boolean(loadExecutionOutcomeForRun(runId)) : false;
    const hasB7Decision =
      pipelineStatusUi.status === "ready" &&
      Boolean(
        pipelineStatusUi.decisionPosture ||
          pipelineStatusUi.decisionTradeoff ||
          pipelineStatusUi.decisionNextMove
      );
    return resolveRunbookStep({
      pipelineStatus: pipelineStatusUi.status,
      centerCompareOpen: centerComponent === "compare",
      rightPanelCompareOpen: rightPanelState.view === "compare" || rightPanelTab === "compare",
      hasB7Decision,
      hasRecordedOutcome,
    });
  }, [
    pipelineStatusUi.status,
    pipelineStatusUi.decisionPosture,
    pipelineStatusUi.decisionTradeoff,
    pipelineStatusUi.decisionNextMove,
    centerComponent,
    rightPanelState.view,
    rightPanelTab,
    auditHudEpoch,
    executionOutcomeHudEpoch,
  ]);

  const runbookSurfaceHints = useMemo(() => buildRunbookSurfaceHints(runbookStepId), [runbookStepId]);

  const [pipelineFeedbackKeys, setPipelineFeedbackKeys] = useState<Set<string>>(new Set());

  const refreshPipelineFeedbackSelection = useCallback(() => {
    const rid = lastAuditRecordRef.current?.runId;
    if (!rid || pipelineStatusUi.status !== "ready") {
      setPipelineFeedbackKeys(new Set());
      return;
    }
    setPipelineFeedbackKeys(
      new Set(loadNexoraFeedback().filter((r) => r.runId === rid).map((r) => `${r.runId}|${r.type}`))
    );
  }, [pipelineStatusUi.status]);

  useEffect(() => {
    refreshPipelineFeedbackSelection();
  }, [auditHudEpoch, refreshPipelineFeedbackSelection]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.addEventListener(NEXORA_FEEDBACK_CHANGED_EVENT, refreshPipelineFeedbackSelection);
    return () => window.removeEventListener(NEXORA_FEEDBACK_CHANGED_EVENT, refreshPipelineFeedbackSelection);
  }, [refreshPipelineFeedbackSelection]);

  const recordPipelineFeedback = useCallback((runId: string, type: NexoraFeedbackType) => {
    const id = runId.trim();
    if (!id) return;
    let note: string | undefined;
    if (type === "not_helpful" || type === "confusing" || type === "incorrect") {
      const raw = typeof window !== "undefined" ? window.prompt("Optional: what felt wrong?") : null;
      if (raw === null) return;
      note = raw.trim() ? raw.trim().slice(0, 500) : undefined;
    }
    saveNexoraFeedback({ runId: id, type, timestamp: Date.now(), note });
    setPipelineFeedbackKeys((prev) => new Set(prev).add(`${id}|${type}`));
  }, []);

  const pilotOperatorSynthSigRef = useRef<string | null>(null);
  const pilotOperatorSynthRef = useRef<NexoraPilotSynthesis | null>(null);
  const [pilotOperatorInsightText, setPilotOperatorInsightText] = useState<string | null>(null);
  const [pilotInsightInputTick, setPilotInsightInputTick] = useState(0);

  useEffect(() => {
    if (!isPilotProductMode || typeof window === "undefined") return;
    const bump = () => setPilotInsightInputTick((n) => n + 1);
    window.addEventListener(NEXORA_FEEDBACK_CHANGED_EVENT, bump);
    return () => window.removeEventListener(NEXORA_FEEDBACK_CHANGED_EVENT, bump);
  }, [isPilotProductMode]);

  useEffect(() => {
    if (!isPilotProductMode) {
      pilotOperatorSynthSigRef.current = null;
      pilotOperatorSynthRef.current = null;
      setPilotOperatorInsightText(null);
      return;
    }
    if (pipelineStatusUi.status !== "ready") {
      setPilotOperatorInsightText(null);
      return;
    }
    if (!lastAuditRecordRef.current?.runId) {
      setPilotOperatorInsightText(null);
      return;
    }
    const domainId = activeDomainExperience.experience.domainId;
    const input = collectNexoraPilotSynthesisInputFromBrowser(null, domainId);
    const sig = buildNexoraPilotSynthesisInputSignature(input, domainId);
    let synth = pilotOperatorSynthRef.current;
    if (!synth || pilotOperatorSynthSigRef.current !== sig) {
      synth = buildNexoraPilotSynthesis(input, domainId);
      pilotOperatorSynthRef.current = synth;
      pilotOperatorSynthSigRef.current = sig;
    }
    const base = buildDomainAwareOperatorInsightLine({ synthesis: synth, domainId });
    const hint = buildDomainAwareOperatorInsightHint({ synthesis: synth, domainId });
    const line = hint ? `${base} ${hint}` : base;
    setPilotOperatorInsightText((prev) => (prev === line ? prev : line));
    emitDomainOperatorInsightReadyDevOnce({
      signature: sig,
      domain: normalizeOperatorInsightDomain(domainId),
      line,
    });
  }, [
    isPilotProductMode,
    pipelineStatusUi.status,
    auditHudEpoch,
    executionOutcomeHudEpoch,
    pilotInsightInputTick,
    activeDomainExperience.experience.domainId,
  ]);

  const lastEmittedRunbookStepRef = useRef<string | null>(null);
  const runbookGuidanceCtx = useNexoraRunbookGuidanceOptional();
  useEffect(() => {
    const setHints = runbookGuidanceCtx?.setHints;
    if (!setHints) return;
    const next = buildRunbookSurfaceHints(runbookStepId);
    setHints((prev) => {
      if (
        prev.commandBar === next.commandBar &&
        prev.comparePanel === next.comparePanel &&
        prev.pipelineAfterAnalysis === next.pipelineAfterAnalysis &&
        prev.pipelineAfterDecision === next.pipelineAfterDecision &&
        prev.pipelineAfterOutcome === next.pipelineAfterOutcome
      ) {
        return prev;
      }
      return next;
    });
  }, [runbookStepId, runbookGuidanceCtx]);

  useEffect(() => {
    const prev = lastEmittedRunbookStepRef.current;
    if (prev === runbookStepId) return;
    if (prev != null) {
      logRunbookStepChangedIfDev(prev, runbookStepId);
    }
    lastEmittedRunbookStepRef.current = runbookStepId;
  }, [runbookStepId]);

  useEffect(() => {
    if (pipelineStatusUi.status !== "ready") return;
    if (!openCompareAfterPipelineReadyRef.current) return;
    openCompareAfterPipelineReadyRef.current = false;
    dispatchCanonicalAction(
      normalizeCompareOptions({
        source: "panel_cta",
        surface: "center_overlay",
        rawSource: "HomeScreen:pilot_demo_open_compare",
      })
    );
  }, [pipelineStatusUi.status, dispatchCanonicalAction]);

  useEffect(() => {
    return installNexoraExecutionOutcomeBridge();
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === "production" || typeof window === "undefined" || isPilotProductMode) return;
    const w = window as Window & { __NEXORA_DEBUG__?: Record<string, unknown> };
    const next: Record<string, unknown> = {
      ...(w.__NEXORA_DEBUG__ ?? {}),
      lastPipelineStatus: pipelineStatusUi,
      /** B.49 — correlates B.20 outcomes + B.32 feedback to the active audit run in dev tools. */
      lastAuditRunId: lastAuditRecordRef.current?.runId ?? null,
      activePilotDomainId: activeDomainExperience.experience.domainId,
    };
    if (pipelineStatusUi.status === "error" && pipelineStatusUi.errorMessage) {
      next.lastError = pipelineStatusUi.errorMessage;
    }
    if (decisionQualityReport) {
      next.lastDecisionQualityReview = {
        qualityTier: decisionQualityReport.qualityTier,
        trend: decisionQualityReport.trend,
        summary: decisionQualityReport.summary,
      };
    } else {
      next.lastDecisionQualityReview = null;
    }
    w.__NEXORA_DEBUG__ = next;
    window.dispatchEvent(new CustomEvent(NEXORA_WORKFLOW_DEBUG_UPDATED));
  }, [
    pipelineStatusUi,
    decisionQualityReport,
    isPilotProductMode,
    activeDomainExperience.experience.domainId,
    auditHudEpoch,
  ]);

  /** B.49 — in pilot dev/prod builds, still mirror pipeline + run id for console / extensions (no QA pack side-effects). */
  useEffect(() => {
    if (process.env.NODE_ENV === "production" || typeof window === "undefined" || !isPilotProductMode) return;
    const w = window as Window & { __NEXORA_DEBUG__?: Record<string, unknown> };
    w.__NEXORA_DEBUG__ = {
      ...(w.__NEXORA_DEBUG__ ?? {}),
      lastPipelineStatus: pipelineStatusUi,
      lastAuditRunId: lastAuditRecordRef.current?.runId ?? null,
    };
    window.dispatchEvent(new CustomEvent(NEXORA_WORKFLOW_DEBUG_UPDATED));
  }, [pipelineStatusUi, auditHudEpoch, isPilotProductMode]);

  useEffect(() => {
    if (process.env.NODE_ENV === "production" || typeof window === "undefined" || isPilotProductMode) return;
    const w = window as Window & { __NEXORA_DEBUG__?: Record<string, unknown> };
    const domainPackQA = runDomainPackQAAndLogDev();
    const domainPackRollout = runDomainPackRolloutAndLogDev();
    w.__NEXORA_DEBUG__ = { ...(w.__NEXORA_DEBUG__ ?? {}), domainPackQA, domainPackRollout };
  }, [isPilotProductMode, activeDomainExperience.experience.domainId]);

  const onRecordExecutionOutcome = useCallback(() => {
    if (typeof window === "undefined") return;
    const audit = lastAuditRecordRef.current;
    if (!audit?.runId || pipelineStatusUi.status !== "ready") return;
    const raw = window.prompt("What happened? Enter fragility: low, medium, high, or critical");
    if (raw == null) return;
    const actualTier = normalizeOutcomeFragilityInput(raw.trim());
    if (!actualTier) {
      window.alert("Invalid fragility. Use: low, medium, high, or critical.");
      return;
    }
    const expectedRaw = pipelineStatusUi.fragilityLevel ?? audit.scanner.fragilityLevel ?? "medium";
    const expected = normalizeOutcomeFragilityInput(String(expectedRaw)) ?? "medium";
    const { score, label } = evaluateExecutionOutcome(expected, actualTier);
    const outcome: NexoraExecutionOutcome = {
      runId: audit.runId,
      expectedFragilityLevel: expected,
      actualFragilityLevel: actualTier,
      outcomeScore: score,
      outcomeLabel: label,
      recordedAt: Date.now(),
    };
    saveExecutionOutcome(outcome);
    logNexoraMetric("outcome_recorded", { runId: audit.runId, mode: nexoraMode });
    lastExecutionOutcomeRef.current = outcome;
    window.dispatchEvent(new CustomEvent(NEXORA_EXECUTION_OUTCOME_RECORDED, { detail: outcome }));
    emitExecutionOutcomeRecordedDev(outcome);
    const base = lastNexoraTrustEvaluationInputRef.current;
    if (base) {
      const trust = evaluateNexoraTrustValidation({
        ...base,
        executionOutcomeFeedback: outcome.outcomeLabel,
      });
      mergePipelineStatus({
        confidenceScore: trust.confidenceScore,
        confidenceTier: trust.confidenceTier,
        validationWarnings: [...trust.validationWarnings],
        trustSummaryLine: trust.trustSummaryLine,
      });
    }
    setPanelResolverB18Epoch((n) => n + 1);
    setExecutionOutcomeHudEpoch((n) => n + 1);
  }, [mergePipelineStatus, pipelineStatusUi.fragilityLevel, pipelineStatusUi.status, nexoraMode]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onReplayApply = (ev: Event) => {
      const custom = ev as CustomEvent<NexoraReplayApplyEventDetail>;
      const detail = custom.detail;
      if (!detail?.payload?.snapshot) return;
      const { payload, force } = detail;
      const sig = buildReplayApplySignature(payload);
      if (!force && lastReplayApplySignatureRef.current === sig) {
        return;
      }
      lastReplayApplySignatureRef.current = sig;

      const sceneIdSet = buildSceneObjectIdSet(sceneJson);
      const { focusInScene, highlightsInScene } = filterReplaySnapshotIdsForScene(payload.snapshot, sceneIdSet);
      const snap = payload.snapshot;

      if (focusInScene) {
        setFocusedId(focusInScene);
      }

      const selected =
        focusInScene ?? (highlightsInScene.length > 0 ? highlightsInScene[0] ?? null : null);
      setSelectedObjectIdState(selected);

      const reason =
        typeof snap.trust.summary === "string" && snap.trust.summary.trim()
          ? snap.trust.summary.trim().slice(0, 200)
          : "Restored run highlights";

      if (highlightsInScene.length > 0) {
        const base = buildUnifiedReactionFromFragilityRun({
          highlightedObjectIds: highlightsInScene,
          riskSources: [],
          riskTargets: highlightsInScene,
          reason,
          activeLoopId: null,
          loopSuggestions: [],
          actions: [],
        });
        const scoped = normalizeReactionForScene(base, sceneJson);
        const tuned = tuneUnifiedReactionForFragilityLevel(scoped, snap.scene.fragilityLevel);
        applyUnifiedSceneReaction(tuned, { allowSceneReplacement: false });
      } else if (focusInScene) {
        const panel = buildPanelFocusReaction({ objectId: focusInScene, reason });
        const scoped = normalizeReactionForScene(panel, sceneJson);
        const tuned = tuneUnifiedReactionForFragilityLevel(scoped, snap.scene.fragilityLevel);
        applyUnifiedSceneReaction(tuned, { allowSceneReplacement: false });
      }

      mergePipelineStatus({
        fragilityLevel: normalizeFragilityLevelForUi(snap.scene.fragilityLevel),
        confidenceTier: snap.trust.confidenceTier ?? null,
        trustSummaryLine: snap.trust.summary?.trim() ? snap.trust.summary.trim().slice(0, 200) : null,
        decisionPosture: snap.decision?.posture ?? null,
        decisionTradeoff: snap.decision?.tradeoff ?? null,
        decisionNextMove: snap.decision?.nextMove ?? null,
        multiSourceSourceCount: snap.sources.total,
        multiSourceSuccessfulCount: snap.sources.successful,
        replayRestoredRunId: snap.runId,
        updatedAt: Date.now(),
      });

      logNexoraMetric("replay_used", { runId: snap.runId, mode: nexoraMode });

      const requestedRaw = activeDomainExperience.experience.domainId;
      const resolved = resolveNexoraLocaleDomainId(requestedRaw);
      const effective = toSafeLocaleDomainIdForRollout(requestedRaw);
      const reqNorm =
        typeof requestedRaw === "string" && requestedRaw.trim() ? requestedRaw.trim() : null;
      const rid = snap.runId?.trim();
      if (rid) {
        const usageSig = `${rid}|${reqNorm ?? ""}|${resolved}|${effective}`;
        if (usageSig !== lastB41DomainUsageSigRef.current) {
          lastB41DomainUsageSigRef.current = usageSig;
          logDomainUsage({
            domainRequested: reqNorm,
            domainResolved: resolved,
            domainEffective: effective,
            timestamp: Date.now(),
          });
          emitDomainUsageLoggedDevOnce(rid);
        }
      }

      if (process.env.NODE_ENV !== "production") {
        globalThis.console?.debug?.("[Nexora][B16] replay_applied", {
          runId: snap.runId,
          source: payload.source,
          focus: focusInScene,
          highlights: highlightsInScene.length,
        });
      }
    };
    window.addEventListener(NEXORA_REPLAY_APPLY_EVENT, onReplayApply as EventListener);
    return () => window.removeEventListener(NEXORA_REPLAY_APPLY_EVENT, onReplayApply as EventListener);
  }, [
    sceneJson,
    setFocusedId,
    setSelectedObjectIdState,
    applyUnifiedSceneReaction,
    mergePipelineStatus,
    nexoraMode,
    activeDomainExperience.experience.domainId,
  ]);

  useEffect(() => {
    lastTextIngestionResultRef.current = lastTextIngestionResult;
  }, [lastTextIngestionResult]);

  useEffect(() => {
    lastMultiSourceIngestionRef.current = lastMultiSourceIngestion;
  }, [lastMultiSourceIngestion]);

  /** B.14 — build compact audit when pipeline reaches ready; dedupe by full record signature. */
  useEffect(() => {
    if (pipelineStatusUi.status !== "ready") {
      lastAuditRecordRef.current = null;
      nexoraPanelB18TrustRef.current = null;
      setPanelResolverB18Epoch((n) => n + 1);
      lastAuditSignatureRef.current = null;
      lastReplaySnapshotRef.current = null;
      lastExportBundleRef.current = null;
      lastB15BundleSigRef.current = null;
      lastB19ScenarioMemoryAppendSigRef.current = null;
      lastNexoraTrustEvaluationInputRef.current = null;
      lastB20Fix1OutcomeLookupSigRef.current = null;
      if (typeof window !== "undefined" && process.env.NODE_ENV !== "production" && !isPilotProductMode) {
        delete (window as Window & { __NEXORA_LAST_AUDIT__?: NexoraAuditRecord }).__NEXORA_LAST_AUDIT__;
      }
      return;
    }
    const ctx = pipelineB7ActionContextRef.current;
    const record = buildNexoraAuditRecord({
      multiSourceResult: lastMultiSourceIngestion,
      pipelineStatus: pipelineStatusUi,
      decisionContext: ctx
        ? {
            posture: ctx.posture,
            tradeoff: ctx.tradeoff,
            nextMove: ctx.nextMove,
            driverLabels: ctx.drivers.map((d) => d.label),
          }
        : null,
      domain: activeDomainExperience.experience.domainId,
    });
    const sig = buildNexoraAuditSignature(record);
    const auditChanged = sig !== lastAuditSignatureRef.current;
    if (auditChanged) {
      lastAuditSignatureRef.current = sig;
    }
    lastAuditRecordRef.current = record;
    nexoraPanelB18TrustRef.current = {
      confidenceTier: pipelineStatusUi.confidenceTier,
      trustSummaryLine: pipelineStatusUi.trustSummaryLine,
      fragilityLevel: pipelineStatusUi.fragilityLevel,
    };
    setPanelResolverB18Epoch((n) => n + 1);

    const replaySnapshot = buildNexoraReplaySnapshot({
      audit: record,
      pipelineStatus: pipelineStatusUi,
      focusedObjectId: selectedObjectIdState?.trim() || focusedId?.trim() || null,
      highlightedObjectIds: pipelineB7ActionContextRef.current?.objectIds ?? [],
    });
    lastReplaySnapshotRef.current = replaySnapshot;
    const exportBundle = buildNexoraExportBundle({ record, replaySnapshot });
    lastExportBundleRef.current = exportBundle;
    const b15Sig = exportBundleStableSignature(exportBundle);
    const exportSnapshotChanged = b15Sig !== lastB15BundleSigRef.current;
    if (exportSnapshotChanged) {
      lastB15BundleSigRef.current = b15Sig;
      if (process.env.NODE_ENV !== "production") {
        globalThis.console?.debug?.("[Nexora][B15] export_bundle_ready", { runId: record.runId });
      }
    }

    if (auditChanged || exportSnapshotChanged) {
      setAuditHudEpoch((n) => n + 1);
    }
    if (auditChanged && typeof window !== "undefined" && process.env.NODE_ENV !== "production" && !isPilotProductMode) {
      (window as Window & { __NEXORA_LAST_AUDIT__?: NexoraAuditRecord }).__NEXORA_LAST_AUDIT__ = record;
    }
    if (auditChanged && process.env.NODE_ENV !== "production") {
      globalThis.console?.debug?.("[Nexora][B14] audit_record_built", { runId: record.runId });
    }

    if (auditChanged && record.runId?.trim()) {
      const requestedRaw = activeDomainExperience.experience.domainId;
      const resolved = resolveNexoraLocaleDomainId(requestedRaw);
      const effective = toSafeLocaleDomainIdForRollout(requestedRaw);
      const reqNorm =
        typeof requestedRaw === "string" && requestedRaw.trim() ? requestedRaw.trim() : null;
      const usageSig = `${record.runId.trim()}|${reqNorm ?? ""}|${resolved}|${effective}`;
      if (usageSig !== lastB41DomainUsageSigRef.current) {
        lastB41DomainUsageSigRef.current = usageSig;
        logDomainUsage({
          domainRequested: reqNorm,
          domainResolved: resolved,
          domainEffective: effective,
          timestamp: Date.now(),
        });
        emitDomainUsageLoggedDevOnce(record.runId.trim());
      }
    }

    if (typeof window !== "undefined" && lastB19ScenarioMemoryAppendSigRef.current !== sig) {
      lastB19ScenarioMemoryAppendSigRef.current = sig;
      const memory = loadScenarioMemory();
      const outcomesForBias = loadExecutionOutcomes();
      const qualityForBias = evaluateDecisionQuality({ outcomes: outcomesForBias, memory });
      const biasCtxAppend = buildNexoraBiasLayerContext({
        quality: qualityForBias,
        memory,
        outcomes: outcomesForBias,
        operatorMode: nexoraMode,
      });
      const trustInput = {
        confidenceTier: pipelineStatusUi.confidenceTier ?? record.trust.confidenceTier ?? undefined,
        summary: pipelineStatusUi.trustSummaryLine ?? record.trust.summary ?? null,
      };
      const decision = ctx
        ? {
            posture: ctx.posture?.trim() || undefined,
            tradeoff: ctx.tradeoff?.trim() || undefined,
            nextMove: ctx.nextMove?.trim() || undefined,
          }
        : record.decision ?? undefined;
      const resolved = resolveNexoraB18WithMemory({
        audit: record,
        trust: trustInput,
        decision,
        memory,
        adaptiveBias: biasCtxAppend.governedBiasForPick,
        biasGovernance: biasCtxAppend.governance,
        adaptiveBiasStrengthBand: biasCtxAppend.biasStrengthBand,
        nexoraOperatorMode: nexoraMode,
      });
      appendScenarioMemory({
        runId: record.runId,
        fragilityLevel: pipelineStatusUi.fragilityLevel ?? record.scanner.fragilityLevel,
        confidenceTier: pipelineStatusUi.confidenceTier ?? record.trust.confidenceTier,
        decisionPosture: ctx?.posture?.trim() || record.decision?.posture,
        decisionTradeoff: ctx?.tradeoff?.trim() || record.decision?.tradeoff,
        decisionNextMove: ctx?.nextMove?.trim() || record.decision?.nextMove,
        recommendedOptionId: resolved.recommendedOptionId ?? undefined,
        timestamp: Date.now(),
      });
      emitScenarioMemoryAppendedDev(record.runId);
      setPanelResolverB18Epoch((n) => n + 1);
    }
  }, [
    pipelineStatusUi,
    lastMultiSourceIngestion,
    activeDomainExperience.experience.domainId,
    selectedObjectIdState,
    focusedId,
    nexoraMode,
    isPilotProductMode,
  ]);

  /** B.28 — pipeline + compare + decision funnel metrics (localStorage). */
  useEffect(() => {
    const st = pipelineStatusUi.status;
    const prev = prevPipelineStatusForMetricRef.current;
    if (prev != null) {
      if (st === "ready" && prev !== "ready") {
        logNexoraMetric("analysis_completed", {
          runId: lastAuditRecordRef.current?.runId,
          mode: nexoraMode,
        });
      }
      if (st === "error" && prev !== "error") {
        logNexoraMetric("error_occurred", {
          runId: lastAuditRecordRef.current?.runId,
          mode: nexoraMode,
        });
      }
    }
    if (st !== "ready") {
      lastDecisionRunIdForMetricRef.current = null;
    }
    prevPipelineStatusForMetricRef.current = st;
  }, [pipelineStatusUi.status, nexoraMode, auditHudEpoch]);

  useEffect(() => {
    const open =
      centerComponent === "compare" ||
      rightPanelState.view === "compare" ||
      rightPanelTab === "compare";
    if (open && !prevCompareOpenForMetricRef.current) {
      logNexoraMetric("compare_opened", {
        runId: lastAuditRecordRef.current?.runId,
        mode: nexoraMode,
      });
    }
    prevCompareOpenForMetricRef.current = open;
  }, [centerComponent, rightPanelState.view, rightPanelTab, nexoraMode, auditHudEpoch]);

  useEffect(() => {
    if (pipelineStatusUi.status !== "ready" || !pipelineStatusUi.decisionPosture) return;
    const rid = lastAuditRecordRef.current?.runId;
    if (!rid) return;
    if (lastDecisionRunIdForMetricRef.current === rid) return;
    lastDecisionRunIdForMetricRef.current = rid;
    logNexoraMetric("decision_made", { runId: rid, mode: nexoraMode });
  }, [pipelineStatusUi.status, pipelineStatusUi.decisionPosture, auditHudEpoch, nexoraMode]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onCfg = () => setBiasGovernanceConfigEpoch((n) => n + 1);
    window.addEventListener(BIAS_GOVERNANCE_CONFIG_CHANGED_EVENT, onCfg);
    return () => window.removeEventListener(BIAS_GOVERNANCE_CONFIG_CHANGED_EVENT, onCfg);
  }, []);

  /** B.21 + B.23 — quality + governed bias layer (signature-guarded). */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (pipelineStatusUi.status !== "ready") {
      lastDecisionQualitySigRef.current = null;
      lastDecisionQualityReportRef.current = null;
      lastBiasLayerApplyKeyRef.current = null;
      setDecisionQualityReport(null);
      setBiasLayerContext(null);
      return;
    }
    const outcomes = loadExecutionOutcomes();
    const memoryRows = loadScenarioMemory();
    const sig = buildDecisionQualityInputSignature(outcomes, memoryRows);
    const applyKey = `${sig}|${biasGovernanceConfigEpoch}|${nexoraMode}`;
    if (applyKey === lastBiasLayerApplyKeyRef.current) {
      return;
    }
    lastBiasLayerApplyKeyRef.current = applyKey;
    lastDecisionQualitySigRef.current = sig;
    const report = evaluateDecisionQuality({ outcomes, memory: memoryRows });
    const biasCtx = buildNexoraBiasLayerContext({
      quality: report,
      memory: memoryRows,
      outcomes,
      operatorMode: nexoraMode,
    });
    lastDecisionQualityReportRef.current = report;
    setDecisionQualityReport(report);
    setBiasLayerContext(biasCtx);
    emitDecisionQualityReadyDev(sig);
    emitAdaptiveBiasReadyDev(buildAdaptiveBiasDevLogKey(sig, biasCtx.rawBias));
    emitBiasGovernanceReadyDev(
      buildBiasGovernanceLogKey(biasCtx.config, sig, biasCtx.rawBias, biasCtx.governance, nexoraMode)
    );
  }, [pipelineStatusUi.status, auditHudEpoch, executionOutcomeHudEpoch, biasGovernanceConfigEpoch, nexoraMode]);

  /** Client-only dev global: mirrors last successful text ingestion only (single write path). */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (process.env.NODE_ENV === "production" || isPilotProductMode) return;

    type WinIngestion = Window & { __NEXORA_LAST_INGESTION__?: HomeScreenLastIngestion };
    const w = window as WinIngestion;

    const clearGlobal = (reason: string) => {
      if (w.__NEXORA_LAST_INGESTION__ !== undefined) {
        delete w.__NEXORA_LAST_INGESTION__;
        globalThis.console?.debug?.("[Nexora][IngestionDebug] global_cleared_or_unchanged", { reason });
      }
      lastNexoraIngestionGlobalExposeSigRef.current = null;
    };

    if (lastTextIngestionResult === null) {
      clearGlobal("no_successful_ingestion");
      return;
    }

    if (!lastTextIngestionResult.ok) {
      clearGlobal("ingestion_response_not_ok");
      return;
    }

    w.__NEXORA_LAST_INGESTION__ = lastTextIngestionResult;
    const sig = [
      lastTextIngestionResult.bundle.created_at,
      lastTextIngestionResult.bundle.source.id,
      lastTextIngestionResult.bundle.signals.length,
    ].join("|");
    if (lastNexoraIngestionGlobalExposeSigRef.current !== sig) {
      lastNexoraIngestionGlobalExposeSigRef.current = sig;
      globalThis.console?.debug?.("[Nexora][IngestionDebug] global_updated", {
        ok: true,
        signalCount: lastTextIngestionResult.bundle.signals.length,
        sourceId: lastTextIngestionResult.bundle.source.id,
      });
    }
  }, [lastTextIngestionResult, isPilotProductMode]);

  useEffect(() => {
    if (!isDevIngestion || typeof window === "undefined") return;
    (
      window as Window & {
        __NEXORA_LAST_MULTI_SOURCE_INGESTION__?: MultiSourceIngestionResponse | null;
      }
    ).__NEXORA_LAST_MULTI_SOURCE_INGESTION__ = lastMultiSourceIngestion;
  }, [isDevIngestion, lastMultiSourceIngestion]);

  const runBusinessTextIngestionPipeline = useCallback(
    async (text: string, sourceLabel: string) => {
      const t = text.trim();
      if (!t) return;
      const bridgeSource = sourceLabel.trim() || "ingestion";
      const res = await submitManualTextIngestion({
        text: t,
        title: "manual_text",
        source_label: bridgeSource,
        domain: activeDomainExperience.experience.domainId,
      });
      if (res === "skipped_in_flight") return;
      logNexoraMetric("input_submitted", { mode: nexoraMode });
      if (!res) {
        setLastTextIngestionResult(null);
        commitPipelineStatus({
          ...createInitialPipelineStatusUi(),
          status: "error",
          source: "ingestion",
          signalsCount: 0,
          mappedObjectsCount: 0,
          fragilityLevel: null,
          summary: null,
          insightLine: null,
          updatedAt: Date.now(),
          errorMessage: NEXORA_PIPELINE_USER_FAILURE,
          lastBridgeSource: bridgeSource,
        });
        return;
      }
      if (!res.ok) {
        setLastTextIngestionResult(null);
        if (process.env.NODE_ENV !== "production") {
          const errMsg =
            Array.isArray(res.errors) && res.errors.length > 0
              ? res.errors.map(String).join("; ").slice(0, 200)
              : "Ingestion did not complete.";
          globalThis.console?.debug?.("[Nexora][B26] pipeline_ingestion_errors", { errMsg });
        }
        commitPipelineStatus({
          ...createInitialPipelineStatusUi(),
          status: "error",
          source: "ingestion",
          signalsCount: res.bundle?.signals?.length ?? 0,
          mappedObjectsCount: 0,
          fragilityLevel: null,
          summary: res.bundle?.summary?.trim() ? res.bundle.summary.trim().slice(0, 160) : null,
          insightLine: null,
          updatedAt: Date.now(),
          errorMessage: NEXORA_PIPELINE_USER_FAILURE,
          lastBridgeSource: bridgeSource,
        });
        return;
      }

      setLastTextIngestionResult(res);

      const bridgeSig = buildIngestionFragilityBridgeSignature(res, activeDomainExperience.experience.domainId);
      if (lastIngestionFragilityBridgeSigRef.current === bridgeSig) {
        return;
      }
      lastIngestionFragilityBridgeSigRef.current = bridgeSig;

      const summaryShort = res.bundle.summary?.trim() ? res.bundle.summary.trim().slice(0, 160) : null;
      pendingTrustMultiSourceContextRef.current = null;
      commitPipelineStatus({
        ...createInitialPipelineStatusUi(),
        status: "processing",
        source: "ingestion",
        signalsCount: res.bundle.signals.length,
        mappedObjectsCount: 0,
        fragilityLevel: null,
        summary: summaryShort,
        insightLine: null,
        updatedAt: Date.now(),
        errorMessage: null,
        lastBridgeSource: bridgeSource,
      });

      try {
        const scan = await runIngestionThroughFragilitySceneBridge({
          ingestion: res,
          domain: activeDomainExperience.experience.domainId,
          workspaceId: activeWorkspaceId,
          userId: ensureBackendUserId(),
          sourceLabel,
          bridgeSignature: bridgeSig,
        });
        if (scan?.ok) {
          mergePipelineStatus({
            status: "ready",
            source: "ingestion",
            signalsCount: res.bundle.signals.length,
            mappedObjectsCount: countMappedObjectsFromFragilityScan(scan),
            fragilityLevel: normalizeFragilityLevelForUi(scan.fragility_level),
            summary: scan.summary?.trim() ? scan.summary.trim().slice(0, 160) : summaryShort,
            insightLine: buildPipelineInsightLine(
              scan.summary,
              scan.drivers,
              scan.fragility_level,
              activeDomainExperience.experience.domainId
            ),
            updatedAt: Date.now(),
            errorMessage: null,
            lastBridgeSource: bridgeSource,
          });
        } else {
          lastIngestionFragilityBridgeSigRef.current = null;
          setLastTextIngestionResult(null);
          commitPipelineStatus({
            ...createInitialPipelineStatusUi(),
            status: "error",
            source: "ingestion",
            signalsCount: res.bundle.signals.length,
            mappedObjectsCount: 0,
            fragilityLevel: null,
            summary: summaryShort,
            insightLine: null,
            updatedAt: Date.now(),
            errorMessage: NEXORA_PIPELINE_USER_FAILURE,
            lastBridgeSource: bridgeSource,
          });
        }
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          globalThis.console?.warn?.("[Nexora][B2] fragility_bridge_failed", err);
        }
        lastIngestionFragilityBridgeSigRef.current = null;
        setLastTextIngestionResult(null);
        commitPipelineStatus({
          ...createInitialPipelineStatusUi(),
          status: "error",
          source: "ingestion",
          signalsCount: res.bundle.signals.length,
          mappedObjectsCount: 0,
          fragilityLevel: null,
          summary: summaryShort,
          insightLine: null,
          updatedAt: Date.now(),
          errorMessage: nexoraPipelineUserFacingMessage(err),
          lastBridgeSource: bridgeSource,
        });
      }
    },
    [
      activeDomainExperience.experience.domainId,
      activeWorkspaceId,
      commitPipelineStatus,
      mergePipelineStatus,
      ensureBackendUserId,
      nexoraMode,
    ]
  );

  const runMultiSourceFragilityPipeline = useCallback(
    async (
      multiRes: MultiSourceIngestionResponse,
      domainOverride?: string | null,
      options?: { bridgeTag?: "multi_source" | "scheduled" }
    ) => {
      const bridgeTag = options?.bridgeTag ?? "multi_source";
      const meta = multiRes.bundle.merge_meta ?? {};
      const srcCount = Number(meta.source_count ?? multiRes.bundle.sources.length);
      const succCount = Number(meta.successful_source_count ?? 0);
      const mergedCount = Number(meta.merged_signal_count ?? multiRes.bundle.signals.length);

      if (!multiRes.ok) {
        if (process.env.NODE_ENV !== "production" && multiRes.errors.length > 0) {
          globalThis.console?.debug?.("[Nexora][B26] pipeline_multi_source_errors", {
            errors: multiRes.errors.map(String).join("; ").slice(0, 200),
          });
        }
        commitPipelineStatus({
          ...createInitialPipelineStatusUi(),
          status: "error",
          source: "ingestion",
          signalsCount: mergedCount,
          mappedObjectsCount: 0,
          fragilityLevel: null,
          summary: multiRes.bundle.summary?.trim() ? multiRes.bundle.summary.trim().slice(0, 160) : null,
          insightLine: null,
          updatedAt: Date.now(),
          errorMessage: NEXORA_PIPELINE_USER_FAILURE,
          lastBridgeSource: bridgeTag,
          multiSourceSourceCount: srcCount,
          multiSourceSuccessfulCount: succCount,
          multiSourceMergedSignalCount: mergedCount,
        });
        return;
      }

      const domain =
        typeof domainOverride === "string" && domainOverride.trim()
          ? domainOverride.trim()
          : activeDomainExperience.experience.domainId;

      const bridgeSig = buildMultiSourceBridgeSignature(multiRes, domain);
      if (lastMultiSourceBridgeSigRef.current === bridgeSig) {
        return;
      }
      lastMultiSourceBridgeSigRef.current = bridgeSig;

      const summaryShort = multiRes.bundle.summary?.trim() ? multiRes.bundle.summary.trim().slice(0, 160) : null;
      pendingTrustMultiSourceContextRef.current = {
        mergeMeta: { ...(meta as Record<string, unknown>) },
        sourceCount: srcCount,
        successfulSourceCount: succCount,
        mergedSignalCount: mergedCount,
        bundleWarnings: [...(multiRes.bundle.warnings ?? [])].map(String),
      };
      commitPipelineStatus({
        ...createInitialPipelineStatusUi(),
        status: "processing",
        source: "ingestion",
        signalsCount: mergedCount,
        mappedObjectsCount: 0,
        fragilityLevel: null,
        summary: summaryShort,
        insightLine: null,
        updatedAt: Date.now(),
        errorMessage: null,
        lastBridgeSource: bridgeTag,
        multiSourceSourceCount: srcCount,
        multiSourceSuccessfulCount: succCount,
        multiSourceMergedSignalCount: mergedCount,
      });

      try {
        const scan = await runMultiSourceThroughFragilitySceneBridge({
          multi: multiRes,
          domain,
          workspaceId: activeWorkspaceId,
          userId: ensureBackendUserId(),
          bridgeSignature: bridgeSig,
        });
        if (scan?.ok) {
          mergePipelineStatus({
            status: "ready",
            source: "ingestion",
            signalsCount: mergedCount,
            mappedObjectsCount: countMappedObjectsFromFragilityScan(scan),
            fragilityLevel: normalizeFragilityLevelForUi(scan.fragility_level),
            summary: scan.summary?.trim() ? scan.summary.trim().slice(0, 160) : summaryShort,
            insightLine: buildPipelineInsightLine(
              scan.summary,
              scan.drivers,
              scan.fragility_level,
              activeDomainExperience.experience.domainId
            ),
            updatedAt: Date.now(),
            errorMessage: null,
            lastBridgeSource: bridgeTag,
            multiSourceSourceCount: srcCount,
            multiSourceSuccessfulCount: succCount,
            multiSourceMergedSignalCount: mergedCount,
          });
        } else {
          lastMultiSourceBridgeSigRef.current = null;
          setLastMultiSourceIngestion(null);
          commitPipelineStatus({
            ...createInitialPipelineStatusUi(),
            status: "error",
            source: "ingestion",
            signalsCount: mergedCount,
            mappedObjectsCount: 0,
            fragilityLevel: null,
            summary: summaryShort,
            insightLine: null,
            updatedAt: Date.now(),
            errorMessage: NEXORA_PIPELINE_USER_FAILURE,
            lastBridgeSource: bridgeTag,
            multiSourceSourceCount: srcCount,
            multiSourceSuccessfulCount: succCount,
            multiSourceMergedSignalCount: mergedCount,
          });
        }
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          globalThis.console?.warn?.("[Nexora][MultiSource] fragility_bridge_failed", err);
        }
        lastMultiSourceBridgeSigRef.current = null;
        setLastMultiSourceIngestion(null);
        commitPipelineStatus({
          ...createInitialPipelineStatusUi(),
          status: "error",
          source: "ingestion",
          signalsCount: mergedCount,
          mappedObjectsCount: 0,
          fragilityLevel: null,
          summary: summaryShort,
          insightLine: null,
          updatedAt: Date.now(),
          errorMessage: nexoraPipelineUserFacingMessage(err),
          lastBridgeSource: bridgeTag,
          multiSourceSourceCount: srcCount,
          multiSourceSuccessfulCount: succCount,
          multiSourceMergedSignalCount: mergedCount,
        });
      } finally {
        pendingTrustMultiSourceContextRef.current = null;
      }
    },
    [
      activeDomainExperience.experience.domainId,
      activeWorkspaceId,
      commitPipelineStatus,
      mergePipelineStatus,
      ensureBackendUserId,
    ]
  );

  const scheduledAssessmentInFlightRef = useRef<string | null>(null);

  const runUnifiedMultiSourceAssessment = useCallback(
    async (
      payload: MultiSourceIngestionRequest,
      entry: "product" | "dev" | "scheduled",
      meta?: { scheduledDefinitionId?: string; scheduledDefinitionName?: string }
    ): Promise<UnifiedMultiSourceRunOutcome> => {
      if (entry === "product") {
        traceProductionMultiSourceEntry(payload);
      }
      if (entry === "scheduled" && meta?.scheduledDefinitionId) {
        traceScheduledAssessmentTriggered(meta.scheduledDefinitionId, meta.scheduledDefinitionName ?? "");
      }
      try {
        const res = await submitMultiSourceIngestionDev(payload);
        if (res === "skipped_in_flight") {
          dispatchMultiSourceAssessmentComplete(false, entry);
          return { kind: "skipped" };
        }
        if (res) setLastMultiSourceIngestion(res);
        if (!res) {
          dispatchMultiSourceAssessmentComplete(false, entry);
          return { kind: "failed" };
        }
        logNexoraMetric("input_submitted", { mode: nexoraMode });
        const bridgeTag = entry === "scheduled" ? "scheduled" : "multi_source";
        await runMultiSourceFragilityPipeline(res, payload.domain ?? null, { bridgeTag });
        dispatchMultiSourceAssessmentComplete(res.ok, entry);
        return { kind: "ran", responseOk: res.ok };
      } catch {
        dispatchMultiSourceAssessmentComplete(false, entry);
        return { kind: "failed" };
      }
    },
    [runMultiSourceFragilityPipeline, nexoraMode]
  );

  const SCHEDULE_TICK_MS = 60_000;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const tick = () => {
      const defs = loadScheduledAssessments().filter((d) => d.enabled);
      const now = Date.now();
      for (const def of defs) {
        if (!isScheduledAssessmentDue(def, now)) continue;
        if (scheduledAssessmentInFlightRef.current !== null) continue;
        scheduledAssessmentInFlightRef.current = def.id;
        void (async () => {
          try {
            const req = toMultiSourceRequest(def);
            const outcome = await runUnifiedMultiSourceAssessment(req, "scheduled", {
              scheduledDefinitionId: def.id,
              scheduledDefinitionName: def.name,
            });
            let lastStatus: ScheduledAssessmentDefinition["lastStatus"] = "ok";
            if (outcome.kind === "skipped") lastStatus = "skipped";
            else if (outcome.kind === "failed") lastStatus = "error";
            else if (!outcome.responseOk) lastStatus = "error";
            else lastStatus = "ok";
            updateScheduledAssessment(def.id, { lastRunAt: Date.now(), lastStatus });
          } finally {
            if (scheduledAssessmentInFlightRef.current === def.id) {
              scheduledAssessmentInFlightRef.current = null;
            }
            window.dispatchEvent(new CustomEvent("nexora:scheduled-assessments-changed"));
          }
        })();
        break;
      }
    };

    const id = window.setInterval(tick, SCHEDULE_TICK_MS);
    return () => {
      window.clearInterval(id);
    };
  }, [runUnifiedMultiSourceAssessment]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onRunBusinessTextIngestion = (event: Event) => {
      const detail = (event as CustomEvent<{ text?: string; source?: string; openCompareAfter?: boolean }>).detail;
      if (detail?.openCompareAfter === true) {
        openCompareAfterPipelineReadyRef.current = true;
      }
      const rawText = typeof detail?.text === "string" ? detail.text : "";
      const source =
        typeof detail?.source === "string" && detail.source.trim() ? detail.source.trim() : "business_text";
      void runBusinessTextIngestionPipeline(rawText, source);
    };

    const onLegacyDevIngest = (event: Event) => {
      const detail = (event as CustomEvent<{ text?: string }>).detail;
      const rawText = typeof detail?.text === "string" ? detail.text : "";
      void runBusinessTextIngestionPipeline(rawText, "nexora:dev-run-text-ingestion");
    };

    const onDevMultiSourceIngestion = (event: Event) => {
      const detail = (event as CustomEvent<DevMultiSourceIngestionEventDetail>).detail;
      const payload = normalizeDevMultiSourcePayload(detail);
      if (!payload) {
        if (process.env.NODE_ENV !== "production") {
          globalThis.console?.warn?.("[Nexora][MultiSource] dev_event_ignored", { reason: "invalid_detail" });
        }
        return;
      }
      void runUnifiedMultiSourceAssessment(payload, "dev");
    };

    const onProductMultiSourceAssessment = (event: Event) => {
      const detail = (event as CustomEvent<DevMultiSourceIngestionEventDetail>).detail;
      const payload = normalizeDevMultiSourcePayload(detail);
      if (!payload) {
        dispatchMultiSourceAssessmentComplete(false, "product");
        return;
      }
      void runUnifiedMultiSourceAssessment(payload, "product");
    };

    window.addEventListener("nexora:run-business-text-ingestion", onRunBusinessTextIngestion as EventListener);
    window.addEventListener("nexora:dev-run-text-ingestion", onLegacyDevIngest as EventListener);
    window.addEventListener("nexora:dev-run-multi-source-ingestion", onDevMultiSourceIngestion as EventListener);
    window.addEventListener("nexora:run-multi-source-assessment", onProductMultiSourceAssessment as EventListener);

    return () => {
      window.removeEventListener("nexora:run-business-text-ingestion", onRunBusinessTextIngestion as EventListener);
      window.removeEventListener("nexora:dev-run-text-ingestion", onLegacyDevIngest as EventListener);
      window.removeEventListener("nexora:dev-run-multi-source-ingestion", onDevMultiSourceIngestion as EventListener);
      window.removeEventListener("nexora:run-multi-source-assessment", onProductMultiSourceAssessment as EventListener);
    };
  }, [runBusinessTextIngestionPipeline, runUnifiedMultiSourceAssessment]);

  useEffect(() => {
    if (!isDevIngestion || typeof window === "undefined") return;
    void prefetchIngestionConnectorCatalogDev();

    const w = window as Window & {
      __NEXORA_INGESTION_DEV__?: {
        run: (text: string) => Promise<void>;
        getLast: () => HomeScreenLastIngestion;
        runMultiSource: (payload: MultiSourceIngestionRequest) => Promise<void>;
        getLastMultiSource: () => MultiSourceIngestionResponse | null;
      };
    };
    w.__NEXORA_INGESTION_DEV__ = {
      run: async (text: string) => {
        await runBusinessTextIngestionPipeline(text, "window.__NEXORA_INGESTION_DEV__");
      },
      getLast: () => lastTextIngestionResultRef.current,
      runMultiSource: async (payload) => {
        await runUnifiedMultiSourceAssessment(payload, "dev");
      },
      getLastMultiSource: () => lastMultiSourceIngestionRef.current,
    };

    return () => {
      delete w.__NEXORA_INGESTION_DEV__;
    };
  }, [isDevIngestion, runBusinessTextIngestionPipeline, runUnifiedMultiSourceAssessment]);

  const investorDemoCanGoNext =
    investorDemo.demo.active && investorDemo.demo.step <= INVESTOR_DEMO_MAX_STEP;
  const investorDemoOverlayNode = investorDemo.demo.active ? (
    <InvestorDemoOverlay
      title={investorDemoOverlayModel.title}
      description={investorDemoOverlayModel.description}
      step={investorDemo.demo.step}
      maxStep={INVESTOR_DEMO_MAX_STEP}
      canGoNext={investorDemoCanGoNext}
      onNext={investorDemo.nextStep}
      onBack={investorDemo.backStep}
      onExit={investorDemo.exitDemo}
      showBack={investorDemo.demo.step > 0}
    />
  ) : null;

  const pipelineStatusFragilityColor =
    pipelineStatusUi.fragilityLevel === "critical" || pipelineStatusUi.fragilityLevel === "high"
      ? nx.risk
      : pipelineStatusUi.fragilityLevel === "medium"
        ? nx.warning
        : pipelineStatusUi.fragilityLevel === "low"
          ? nx.accentMuted
          : nx.muted;

  const showPipelineStatusHud =
    pipelineStatusUi.status === "processing" ||
    pipelineStatusUi.status === "ready" ||
    pipelineStatusUi.status === "error";

  const sceneNode = (
    <div style={{ position: "relative", width: "100%", height: "100%", background: "transparent", zIndex: 0 }}>
      {/* Three.js (Canvas always mounted for stable hooks) */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: centerComponent ? "min(40%, 420px)" : 0,
          zIndex: 0,
          transition: "bottom 180ms ease",
        }}
      >
        <SceneCanvas
          prefs={prefs}
          resolvedUiTheme={resolvedTheme}
          motionCalm={prefs.motionIntensity === "low"}
          camPos={camPos}
          starCount={starCount}
          isDraggingHUD={false}
          hudDockSide={inspectorOpen ? "right" : undefined}
          storyAccent={retailDemoAccent}
          showAxes={showAxes}
          showGrid={showGrid}
          showCameraHelper={showCameraHelper}
          focusPinned={focusPinned}
          focusMode={focusMode}
          focusedId={visibleFocusedId}
          effectiveActiveLoopId={effectiveActiveLoopId}
          cameraLockedByUser={cameraLockedByUser}
          isOrbiting={isOrbiting}
          sceneJson={visibleSceneJson}
          propagationPayload={visibleResponseData}
          scenarioTrigger={warRoom.scenarioTrigger}
          onScenarioOverlayChange={handleWarRoomOverlayChange}
          objectSelection={effectiveObjectSelection}
          getUxForObject={getUxForObject}
          objectUxById={objectUxById}
          loops={visibleLoops}
          showLoops={showLoops}
          showLoopLabels={showLoopLabels}
          selectedSetterRef={selectedSetterRef}
          selectedIdRef={selectedIdRef}
          overridesRef={overridesRef}
          setOverrideRef={setOverrideRef}
          clearAllOverridesRef={clearAllOverridesRef}
          pruneOverridesRef={pruneOverridesRef}
          onPointerMissed={() => {
            if (process.env.NODE_ENV !== "production") {
              console.log("[Nexora][SceneInteraction] empty click ignored", {
                action: "soft_deselect_without_camera_reset",
              });
            }
            setViewMode("hidden");
          }}
          onOrbitStart={() => {
            setIsOrbiting(true);
            if (prefs.orbitMode === "manual") setCameraLockedByUser(true);
          }}
          onOrbitEnd={() => setIsOrbiting(false)}
          onSelectedChange={handleSelectedChange}
        />
      </div>

      {showPipelineStatusHud ? (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            zIndex: 6,
            maxWidth: 320,
            pointerEvents: "none",
            borderRadius: 12,
            border: `1px solid ${nx.borderSoft}`,
            background: "color-mix(in srgb, var(--nx-bg-deep) 82%, transparent)",
            backdropFilter: "blur(10px)",
            boxShadow: nx.headerShadow,
            padding: "10px 12px",
            transition: "opacity 220ms ease, transform 220ms ease",
            opacity: pipelineStatusUi.status === "processing" ? 0.92 : 1,
          }}
        >
          <div style={{ color: nx.lowMuted, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Nexora pipeline
            {pipelineStatusUi.replayRestoredRunId ? (
              <span
                style={{
                  marginLeft: 8,
                  color: nx.accentInk,
                  fontWeight: 800,
                  letterSpacing: "0.06em",
                  textTransform: "none",
                }}
              >
                · Restored run
              </span>
            ) : null}
          </div>
          <div style={{ color: nx.text, fontSize: 12, fontWeight: 700, marginTop: 4, lineHeight: 1.35 }}>
            Status:{" "}
            <span style={{ color: pipelineStatusUi.status === "error" ? nx.risk : nx.accentInk }}>
              {pipelineStatusUi.status === "processing"
                ? "Processing"
                : pipelineStatusUi.status === "error"
                  ? "Error"
                  : "Ready"}
            </span>
          </div>
          {!isPilotProductMode ? (
            <>
              <div style={{ color: nx.muted, fontSize: 10, marginTop: 6, lineHeight: 1.4 }}>
                Mode:{" "}
                <strong style={{ color: nx.text }}>{nexoraMode === "pure" ? "Pure" : "Adaptive"}</strong>
              </div>
              <div style={{ color: nx.lowMuted, fontSize: 9, marginTop: 2, lineHeight: 1.35 }}>
                {nexoraMode === "pure"
                  ? "Baseline analysis (no historical bias)"
                  : "Using past outcomes to guide decisions"}
              </div>
            </>
          ) : null}
          <div style={{ color: nx.muted, fontSize: 11, marginTop: 6, lineHeight: 1.45, display: "flex", flexDirection: "column", gap: 2 }}>
            <span>
              Signals: <strong style={{ color: nx.text }}>{pipelineStatusUi.signalsCount}</strong>
              {" · "}
              Objects: <strong style={{ color: nx.text }}>{pipelineStatusUi.mappedObjectsCount}</strong>
            </span>
            {pipelineStatusUi.multiSourceSourceCount != null ? (
              <span>
                Multi-source:{" "}
                <strong style={{ color: nx.text }}>
                  {pipelineStatusUi.multiSourceSuccessfulCount ?? 0}/{pipelineStatusUi.multiSourceSourceCount}
                </strong>{" "}
                sources · merged{" "}
                <strong style={{ color: nx.text }}>{pipelineStatusUi.multiSourceMergedSignalCount ?? 0}</strong>
              </span>
            ) : null}
            <span>
              Fragility:{" "}
              <strong style={{ color: pipelineStatusFragilityColor }}>
                {pipelineStatusUi.fragilityLevel
                  ? pipelineStatusUi.fragilityLevel.charAt(0).toUpperCase() + pipelineStatusUi.fragilityLevel.slice(1)
                  : pipelineStatusUi.status === "processing"
                    ? "…"
                    : "—"}
              </strong>
            </span>
            {pipelineStatusUi.insightLine ? (
              <span
                style={{
                  color: nx.accentInk,
                  fontSize: 10,
                  fontWeight: 600,
                  lineHeight: 1.35,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={pipelineStatusUi.insightLine}
              >
                {pipelineStatusUi.insightLine}
              </span>
            ) : null}
            {pipelineStatusUi.status === "ready" && runbookSurfaceHints.pipelineAfterAnalysis ? (
              <span style={{ color: nx.lowMuted, fontSize: 9, lineHeight: 1.35, marginTop: 4, display: "block" }}>
                {runbookSurfaceHints.pipelineAfterAnalysis}
              </span>
            ) : null}
            {pipelineStatusUi.status === "ready" &&
            (pipelineStatusUi.confidenceTier ||
              (pipelineStatusUi.replayRestoredRunId && pipelineStatusUi.trustSummaryLine)) ? (
              <div style={{ marginTop: 4, paddingTop: 4, borderTop: `1px solid ${nx.borderSoft}` }}>
                <span style={{ color: nx.lowMuted, fontSize: 8, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Trust
                </span>
                <div style={{ color: nx.text, fontSize: 10, fontWeight: 700, marginTop: 2 }}>
                  Confidence:{" "}
                  <span style={{ color: nx.accentInk }}>
                    {pipelineStatusUi.confidenceTier
                      ? pipelineStatusUi.confidenceTier.charAt(0).toUpperCase() +
                        pipelineStatusUi.confidenceTier.slice(1)
                      : "—"}
                  </span>
                </div>
                {pipelineStatusUi.trustSummaryLine ? (
                  <span style={{ color: nx.muted, fontSize: 9, lineHeight: 1.35, marginTop: 2, display: "block" }}>
                    {pipelineStatusUi.trustSummaryLine}
                  </span>
                ) : null}
                {pipelineStatusUi.validationWarnings.length > 0 ? (
                  <span style={{ color: nx.warning, fontSize: 9, lineHeight: 1.35, marginTop: 2, display: "block" }}>
                    {pipelineStatusUi.validationWarnings[0]}
                  </span>
                ) : null}
              </div>
            ) : null}
            {pipelineStatusUi.status === "ready" && decisionQualityReport ? (
              <div style={{ marginTop: 4, paddingTop: 4, borderTop: `1px solid ${nx.borderSoft}` }}>
                <span
                  style={{
                    color: nx.lowMuted,
                    fontSize: 8,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Decision quality
                </span>
                <div style={{ color: nx.text, fontSize: 10, fontWeight: 700, marginTop: 2 }}>
                  Quality:{" "}
                  <span style={{ color: nx.accentInk }}>
                    {decisionQualityReport.qualityTier.charAt(0).toUpperCase() +
                      decisionQualityReport.qualityTier.slice(1)}
                  </span>
                  {" · "}
                  Trend:{" "}
                  <span style={{ color: nx.accentInk }}>
                    {decisionQualityReport.trend.charAt(0).toUpperCase() + decisionQualityReport.trend.slice(1)}
                  </span>
                </div>
                {decisionQualityReport.bestPosture ? (
                  <div style={{ color: nx.muted, fontSize: 9, marginTop: 2, lineHeight: 1.35 }}>
                    Best posture:{" "}
                    <strong style={{ color: nx.text }}>{decisionQualityReport.bestPosture}</strong>
                    {decisionQualityReport.weakestPosture ? (
                      <span style={{ color: nx.lowMuted }}>
                        {" "}
                        · Weakest: <strong style={{ color: nx.text }}>{decisionQualityReport.weakestPosture}</strong>
                      </span>
                    ) : null}
                  </div>
                ) : null}
                <span style={{ color: nx.muted, fontSize: 9, lineHeight: 1.35, marginTop: 2, display: "block" }}>
                  {decisionQualityReport.summary.length > 220
                    ? `${decisionQualityReport.summary.slice(0, 220)}…`
                    : decisionQualityReport.summary}
                </span>
              </div>
            ) : null}
            {pipelineStatusUi.status === "ready" && lastAuditRecordRef.current
              ? (() => {
                  void auditHudEpoch;
                  void executionOutcomeHudEpoch;
                  const audit = lastAuditRecordRef.current!;
                  const ex = loadExecutionOutcomeForRun(audit.runId);
                  const drivers = audit.scanner.drivers ?? [];
                  const d1 = drivers[0];
                  const d2 = drivers[1];
                  const conf = audit.trust.confidenceTier
                    ? audit.trust.confidenceTier.charAt(0).toUpperCase() + audit.trust.confidenceTier.slice(1)
                    : "—";
                  const used = `${audit.merge.successfulSourceCount}/${audit.merge.sourceCount}`;
                  return (
                    <div
                      style={{
                        marginTop: 6,
                        paddingTop: 6,
                        borderTop: `1px solid ${nx.borderSoft}`,
                        pointerEvents: "auto",
                      }}
                    >
                      <span
                        style={{
                          color: nx.lowMuted,
                          fontSize: 8,
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                        }}
                      >
                        Why this result?
                      </span>
                      <div style={{ color: nx.muted, fontSize: 9, lineHeight: 1.4, marginTop: 4 }}>
                        {d1 ? (
                          <span style={{ display: "block" }}>
                            <strong style={{ color: nx.text }}>1.</strong> {d1}
                          </span>
                        ) : (
                          <span style={{ display: "block", color: nx.lowMuted }}>Top drivers: —</span>
                        )}
                        {d2 ? (
                          <span style={{ display: "block", marginTop: 2 }}>
                            <strong style={{ color: nx.text }}>2.</strong> {d2}
                          </span>
                        ) : null}
                        <span style={{ display: "block", marginTop: 4 }}>
                          Confidence: <strong style={{ color: nx.text }}>{conf}</strong>
                          {audit.trust.summary ? (
                            <span style={{ color: nx.lowMuted }}> · {audit.trust.summary.slice(0, 72)}</span>
                          ) : null}
                        </span>
                        <span style={{ display: "block", marginTop: 2 }}>
                          Sources: <strong style={{ color: nx.text }}>{used}</strong> used
                        </span>
                      </div>
                      <div style={{ marginTop: 8 }} role="region" aria-label="Was this helpful">
                        <span
                          style={{
                            color: nx.lowMuted,
                            fontSize: 8,
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                          }}
                        >
                          Was this helpful?
                        </span>
                        <div
                          role="group"
                          aria-label="Feedback"
                          style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 5, alignItems: "center" }}
                        >
                          <button
                            type="button"
                            className="nx-pipeline-hud-cta"
                            disabled={pipelineFeedbackKeys.has(`${audit.runId}|helpful`)}
                            onClick={(e) => {
                              e.stopPropagation();
                              recordPipelineFeedback(audit.runId, "helpful");
                            }}
                            style={{
                              cursor: pipelineFeedbackKeys.has(`${audit.runId}|helpful`) ? "default" : "pointer",
                              fontSize: 9,
                              fontWeight: 700,
                              padding: "3px 8px",
                              borderRadius: 6,
                              border: `1px solid ${nx.borderSoft}`,
                              background: "color-mix(in srgb, var(--nx-bg-deep) 70%, transparent)",
                              color: nx.accentInk,
                              opacity: pipelineFeedbackKeys.has(`${audit.runId}|helpful`) ? 0.55 : 1,
                            }}
                          >
                            👍 Yes
                          </button>
                          <button
                            type="button"
                            className="nx-pipeline-hud-cta"
                            disabled={pipelineFeedbackKeys.has(`${audit.runId}|not_helpful`)}
                            onClick={(e) => {
                              e.stopPropagation();
                              recordPipelineFeedback(audit.runId, "not_helpful");
                            }}
                            style={{
                              cursor: pipelineFeedbackKeys.has(`${audit.runId}|not_helpful`) ? "default" : "pointer",
                              fontSize: 9,
                              fontWeight: 700,
                              padding: "3px 8px",
                              borderRadius: 6,
                              border: `1px solid ${nx.borderSoft}`,
                              background: "color-mix(in srgb, var(--nx-bg-deep) 70%, transparent)",
                              color: nx.textSoft,
                              opacity: pipelineFeedbackKeys.has(`${audit.runId}|not_helpful`) ? 0.55 : 1,
                            }}
                          >
                            👎 No
                          </button>
                          <button
                            type="button"
                            className="nx-pipeline-hud-cta"
                            disabled={pipelineFeedbackKeys.has(`${audit.runId}|confusing`)}
                            onClick={(e) => {
                              e.stopPropagation();
                              recordPipelineFeedback(audit.runId, "confusing");
                            }}
                            style={{
                              cursor: pipelineFeedbackKeys.has(`${audit.runId}|confusing`) ? "default" : "pointer",
                              fontSize: 9,
                              fontWeight: 700,
                              padding: "3px 8px",
                              borderRadius: 6,
                              border: `1px solid ${nx.borderSoft}`,
                              background: "color-mix(in srgb, var(--nx-bg-deep) 70%, transparent)",
                              color: nx.warning,
                              opacity: pipelineFeedbackKeys.has(`${audit.runId}|confusing`) ? 0.55 : 1,
                            }}
                          >
                            ⚠️ Confusing
                          </button>
                        </div>
                      </div>
                      {ex ? (
                        <div style={{ marginTop: 6, color: "#bae6fd", fontSize: 10, fontWeight: 700 }}>
                          Outcome:{" "}
                          {ex.outcomeLabel === "better" ? "Better" : ex.outcomeLabel === "worse" ? "Worse" : "Same"}
                        </div>
                      ) : null}
                      {ex && runbookSurfaceHints.pipelineAfterOutcome ? (
                        <div style={{ marginTop: 4, color: nx.lowMuted, fontSize: 9, lineHeight: 1.35 }}>
                          {runbookSurfaceHints.pipelineAfterOutcome}
                        </div>
                      ) : null}
                      {isPilotProductMode && pilotOperatorInsightText ? (
                        <span
                          style={{
                            color: nx.lowMuted,
                            fontSize: 9,
                            lineHeight: 1.45,
                            marginTop: 6,
                            display: "block",
                          }}
                        >
                          {pilotOperatorInsightText}
                        </span>
                      ) : null}
                      {isPilotProductMode && pilotRuntimeDomainLine ? (
                        <span
                          style={{
                            color: nx.lowMuted,
                            fontSize: 9,
                            lineHeight: 1.45,
                            marginTop: 4,
                            display: "block",
                          }}
                        >
                          {pilotRuntimeDomainLine}
                        </span>
                      ) : null}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6, alignItems: "center" }}>
                        <button
                          type="button"
                          className="nx-pipeline-hud-cta"
                          onClick={(e) => {
                            e.stopPropagation();
                            void navigator.clipboard?.writeText(serializeAudit(audit)).catch(() => {});
                          }}
                          style={{
                            cursor: "pointer",
                            fontSize: 9,
                            fontWeight: 700,
                            padding: "3px 8px",
                            borderRadius: 6,
                            border: `1px solid ${nx.borderSoft}`,
                            background: "color-mix(in srgb, var(--nx-bg-deep) 70%, transparent)",
                            color: nx.accentInk,
                          }}
                        >
                          Copy audit JSON
                        </button>
                        <button
                          type="button"
                          className="nx-pipeline-hud-cta"
                          onClick={(e) => {
                            e.stopPropagation();
                            const b = lastExportBundleRef.current;
                            if (!b) return;
                            void navigator.clipboard?.writeText(serializeExportBundle(b)).catch(() => {});
                          }}
                          style={{
                            cursor: "pointer",
                            fontSize: 9,
                            fontWeight: 700,
                            padding: "3px 8px",
                            borderRadius: 6,
                            border: `1px solid ${nx.borderSoft}`,
                            background: "color-mix(in srgb, var(--nx-bg-deep) 70%, transparent)",
                            color: nx.accentInk,
                          }}
                        >
                          Export bundle
                        </button>
                        <button
                          type="button"
                          className="nx-pipeline-hud-cta"
                          onClick={(e) => {
                            e.stopPropagation();
                            const snap = lastReplaySnapshotRef.current;
                            if (!snap) return;
                            appendNexoraRunHistory({
                              savedAt: Date.now(),
                              record: audit,
                              replaySnapshot: snap,
                            });
                            setRunHistoryEpoch((n) => n + 1);
                          }}
                          style={{
                            cursor: "pointer",
                            fontSize: 9,
                            fontWeight: 700,
                            padding: "3px 8px",
                            borderRadius: 6,
                            border: `1px solid ${nx.borderSoft}`,
                            background: "color-mix(in srgb, var(--nx-bg-deep) 70%, transparent)",
                            color: nx.muted,
                          }}
                        >
                          Save run
                        </button>
                        <button
                          type="button"
                          className="nx-pipeline-hud-cta"
                          onClick={(e) => {
                            e.stopPropagation();
                            setImportBundleOpen((open) => {
                              const next = !open;
                              if (next) {
                                setImportBundleError(null);
                                setImportBundleHint(null);
                              }
                              return next;
                            });
                          }}
                          style={{
                            cursor: "pointer",
                            fontSize: 9,
                            fontWeight: 700,
                            padding: "3px 8px",
                            borderRadius: 6,
                            border: `1px solid ${nx.borderSoft}`,
                            background: "color-mix(in srgb, var(--nx-bg-deep) 70%, transparent)",
                            color: nx.accentInk,
                          }}
                        >
                          Import bundle
                        </button>
                        <button
                          type="button"
                          className="nx-pipeline-hud-cta"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRecordExecutionOutcome();
                          }}
                          style={{
                            cursor: "pointer",
                            fontSize: 9,
                            fontWeight: 700,
                            padding: "3px 8px",
                            borderRadius: 6,
                            border: `1px solid ${nx.borderSoft}`,
                            background: "color-mix(in srgb, var(--nx-bg-deep) 70%, transparent)",
                            color: nx.accentInk,
                          }}
                        >
                          Record outcome
                        </button>
                      </div>
                      {importBundleOpen ? (
                        <div
                          style={{
                            marginTop: 8,
                            paddingTop: 8,
                            borderTop: `1px solid ${nx.borderSoft}`,
                            display: "flex",
                            flexDirection: "column",
                            gap: 6,
                          }}
                        >
                          <span
                            style={{
                              color: nx.lowMuted,
                              fontSize: 8,
                              fontWeight: 700,
                              letterSpacing: "0.06em",
                              textTransform: "uppercase",
                            }}
                          >
                            Paste export JSON
                          </span>
                          <textarea
                            value={importBundleDraft}
                            onChange={(ev) => setImportBundleDraft(ev.target.value)}
                            onClick={(ev) => ev.stopPropagation()}
                            rows={5}
                            spellCheck={false}
                            placeholder='{"version":"1",...}'
                            style={{
                              width: "100%",
                              maxWidth: 280,
                              resize: "vertical",
                              fontSize: 9,
                              fontFamily: "ui-monospace, monospace",
                              padding: 6,
                              borderRadius: 6,
                              border: `1px solid ${nx.borderSoft}`,
                              background: "color-mix(in srgb, var(--nx-bg-deep) 88%, transparent)",
                              color: nx.text,
                              boxSizing: "border-box",
                            }}
                          />
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                            <button
                              type="button"
                              className="nx-pipeline-hud-cta"
                              onClick={(e) => {
                                e.stopPropagation();
                                setImportBundleError(null);
                                setImportBundleHint(null);
                                const result = parseNexoraImportBundle(importBundleDraft);
                                if (!result.ok || !result.bundle) {
                                  setImportBundleError(result.error ?? "Import failed.");
                                  return;
                                }
                                const bundle = result.bundle;
                                const sig = exportBundleStableSignature(bundle);
                                if (lastB17ImportBundleSigRef.current === sig) {
                                  setImportBundleHint("Already applied this bundle.");
                                  return;
                                }
                                lastB17ImportBundleSigRef.current = sig;
                                if (bundle.replaySnapshot) {
                                  dispatchNexoraReplayApply({
                                    snapshot: bundle.replaySnapshot,
                                    source: "imported_bundle",
                                  });
                                  appendNexoraRunHistory({
                                    savedAt: Date.now(),
                                    record: bundle.record,
                                    replaySnapshot: bundle.replaySnapshot,
                                  });
                                  setRunHistoryEpoch((n) => n + 1);
                                  if (process.env.NODE_ENV !== "production") {
                                    globalThis.console?.debug?.("[Nexora][B17] import_bundle_applied", {
                                      runId: bundle.record.runId,
                                      replay: true,
                                    });
                                  }
                                } else {
                                  setImportBundleHint("Bundle imported without replay snapshot.");
                                }
                              }}
                              style={{
                                cursor: "pointer",
                                fontSize: 9,
                                fontWeight: 700,
                                padding: "3px 8px",
                                borderRadius: 6,
                                border: `1px solid ${nx.borderSoft}`,
                                background: "color-mix(in srgb, var(--nx-bg-deep) 70%, transparent)",
                                color: nx.accentInk,
                              }}
                            >
                              Apply import
                            </button>
                            <button
                              type="button"
                              className="nx-pipeline-hud-cta"
                              onClick={(e) => {
                                e.stopPropagation();
                                setImportBundleOpen(false);
                                setImportBundleError(null);
                                setImportBundleHint(null);
                              }}
                              style={{
                                cursor: "pointer",
                                fontSize: 9,
                                fontWeight: 700,
                                padding: "3px 8px",
                                borderRadius: 6,
                                border: `1px solid ${nx.borderSoft}`,
                                color: nx.lowMuted,
                              }}
                            >
                              Close
                            </button>
                          </div>
                          {importBundleError ? (
                            <span style={{ color: nx.risk, fontSize: 9, lineHeight: 1.35 }}>{importBundleError}</span>
                          ) : null}
                          {importBundleHint ? (
                            <span style={{ color: nx.muted, fontSize: 9, lineHeight: 1.35 }}>{importBundleHint}</span>
                          ) : null}
                        </div>
                      ) : null}
                      {recentRunsForHud.length > 0 ? (
                        <div style={{ marginTop: 8 }}>
                          <span
                            style={{
                              color: nx.lowMuted,
                              fontSize: 8,
                              fontWeight: 700,
                              letterSpacing: "0.06em",
                              textTransform: "uppercase",
                            }}
                          >
                            Recent runs
                          </span>
                          {recentRunsForHud.map((h) => (
                            <div
                              key={h.record.runId + h.savedAt}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 6,
                                marginTop: 4,
                              }}
                            >
                              <span
                                style={{
                                  color: nx.muted,
                                  fontSize: 9,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  maxWidth: 160,
                                }}
                                title={h.record.runId}
                              >
                                {h.record.runId.length > 22 ? `${h.record.runId.slice(0, 22)}…` : h.record.runId}
                              </span>
                              <button
                                type="button"
                                className="nx-pipeline-hud-cta"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  dispatchNexoraReplayApply({
                                    snapshot: h.replaySnapshot,
                                    source: "recent_runs",
                                  });
                                }}
                                style={{
                                  cursor: "pointer",
                                  fontSize: 8,
                                  fontWeight: 700,
                                  padding: "2px 6px",
                                  borderRadius: 6,
                                  border: `1px solid ${nx.borderSoft}`,
                                  background: "color-mix(in srgb, var(--nx-bg-deep) 70%, transparent)",
                                  color: nx.accentInk,
                                  flexShrink: 0,
                                }}
                              >
                                Restore
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            className="nx-pipeline-hud-cta"
                            onClick={(e) => {
                              e.stopPropagation();
                              clearNexoraRunHistory();
                              setRunHistoryEpoch((n) => n + 1);
                            }}
                            style={{
                              cursor: "pointer",
                              fontSize: 8,
                              fontWeight: 700,
                              marginTop: 6,
                              padding: "2px 6px",
                              borderRadius: 6,
                              border: `1px solid ${nx.borderSoft}`,
                              color: nx.lowMuted,
                            }}
                          >
                            Clear history
                          </button>
                        </div>
                      ) : null}
                    </div>
                  );
                })()
              : null}
            {pipelineStatusUi.status === "ready" && pipelineStatusUi.decisionPosture ? (
              <div style={{ pointerEvents: "auto", marginTop: 6, paddingTop: 6, borderTop: `1px solid ${nx.borderSoft}` }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <span style={{ color: nx.lowMuted, fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    Decision
                  </span>
                  <span style={{ color: nx.text, fontSize: 10, fontWeight: 700, lineHeight: 1.3 }}>
                    Posture: {pipelineStatusUi.decisionPosture}
                  </span>
                  {pipelineStatusUi.decisionTradeoff ? (
                    <span style={{ color: nx.muted, fontSize: 9, lineHeight: 1.35 }}>Tradeoff: {pipelineStatusUi.decisionTradeoff}</span>
                  ) : null}
                  {pipelineStatusUi.decisionNextMove ? (
                    <span style={{ color: nx.accentInk, fontSize: 9, fontWeight: 600, lineHeight: 1.35 }}>
                      Next: {pipelineStatusUi.decisionNextMove}
                    </span>
                  ) : null}
                  {runbookSurfaceHints.pipelineAfterDecision ? (
                    <span style={{ color: nx.lowMuted, fontSize: 9, lineHeight: 1.35, marginTop: 4 }}>
                      {runbookSurfaceHints.pipelineAfterDecision}
                    </span>
                  ) : null}
                </div>
                <div
                  role="group"
                  aria-label="Decision actions"
                  style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6, alignItems: "center" }}
                >
                  <button
                    type="button"
                    className="nx-pipeline-hud-cta"
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatchPipelineHudB7Simulate();
                    }}
                    style={{
                      cursor: "pointer",
                      fontSize: 9,
                      fontWeight: 700,
                      padding: "3px 8px",
                      borderRadius: 6,
                      border: `1px solid ${nx.borderSoft}`,
                      background: "color-mix(in srgb, var(--nx-bg-deep) 70%, transparent)",
                      color: nx.accentInk,
                    }}
                  >
                    Simulate
                  </button>
                  <button
                    type="button"
                    className="nx-pipeline-hud-cta"
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatchPipelineHudB7Compare();
                    }}
                    style={{
                      cursor: "pointer",
                      fontSize: 9,
                      fontWeight: 700,
                      padding: "3px 8px",
                      borderRadius: 6,
                      border: `1px solid ${nx.borderSoft}`,
                      background: "color-mix(in srgb, var(--nx-bg-deep) 70%, transparent)",
                      color: nx.accentInk,
                    }}
                  >
                    Compare
                  </button>
                  <button
                    type="button"
                    className="nx-pipeline-hud-cta"
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatchPipelineHudB7WhyThis();
                    }}
                    style={{
                      cursor: "pointer",
                      fontSize: 9,
                      fontWeight: 700,
                      padding: "3px 8px",
                      borderRadius: 6,
                      border: `1px solid ${nx.borderSoft}`,
                      background: "color-mix(in srgb, var(--nx-bg-deep) 70%, transparent)",
                      color: nx.muted,
                    }}
                  >
                    Why this?
                  </button>
                </div>
              </div>
            ) : null}
            {pipelineStatusUi.summary ? (
              <span style={{ color: nx.lowMuted, fontSize: 10, marginTop: 2, maxHeight: 36, overflow: "hidden" }}>
                {pipelineStatusUi.summary}
              </span>
            ) : null}
            {pipelineStatusUi.status === "error" && pipelineStatusUi.errorMessage ? (
              <span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ color: nx.risk, fontSize: 10 }}>
                  {isPilotProductMode ? NEXORA_PIPELINE_USER_FAILURE : pipelineStatusUi.errorMessage}
                </span>
                {(() => {
                  const guide = explainPipelineHudFailure({
                    status: pipelineStatusUi.status,
                    source: pipelineStatusUi.source,
                    errorMessage: isPilotProductMode ? NEXORA_PIPELINE_USER_FAILURE : pipelineStatusUi.errorMessage,
                  });
                  return guide ? (
                    <span style={{ color: nx.muted, fontSize: 9, lineHeight: 1.35 }}>{guide}</span>
                  ) : null;
                })()}
              </span>
            ) : null}
            {pipelineStatusUi.lastBridgeSource ? (
              <span style={{ color: nx.lowMuted, fontSize: 9, marginTop: 4 }}>
                Source:{" "}
                {pipelineStatusUi.lastBridgeSource === "command_bar"
                  ? "Command bar"
                  : pipelineStatusUi.lastBridgeSource.replace(/_/g, " ")}
                {pipelineStatusUi.updatedAt ? ` · ${new Date(pipelineStatusUi.updatedAt).toLocaleTimeString()}` : null}
              </span>
            ) : null}
          </div>
        </div>
      ) : null}

      <div aria-hidden style={sceneVignetteLayerStyle} />

      <NexoraRunbookPanel currentStepId={runbookStepId} onRunDemo={runPilotDemoScenario} />

      <RetailDemoOverlay
        visible={isRetailStoryScene}
        script={RETAIL_FRAGILITY_DEMO_SCRIPT}
        currentStepIndex={retailDemoFlow.currentStepIndex}
        autoplay={retailDemoFlow.autoplay}
        running={retailDemoFlow.running || chatRequestStatus === "submitting"}
        narrationText={retailDemoFlow.currentStep?.narration_text ?? null}
        stepTitle={retailDemoFlow.currentStep?.title ?? null}
        canStepBackward={retailDemoFlow.canStepBackward}
        canStepForward={retailDemoFlow.canStepForward}
        onStart={retailDemoFlow.start}
        onRestart={retailDemoFlow.restart}
        onPause={retailDemoFlow.pause}
        onStepBackward={retailDemoFlow.stepBackward}
        onStepForward={retailDemoFlow.currentStepIndex < 0 ? retailDemoFlow.restart : retailDemoFlow.stepForward}
      />

      {!visibleSceneJson && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--nx-muted)",
            fontSize: 14,
            pointerEvents: "auto",
            background: "var(--nx-overlay-backdrop)",
          }}
        >
          <div
            style={{
              ...sceneOverlayCardStyle,
              textAlign: "left",
              lineHeight: 1.5,
            }}
          >
            <div style={{ color: nx.lowMuted, fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Getting started
            </div>
            <div style={{ color: nx.text, fontSize: 18, fontWeight: 800, marginTop: 6 }}>
              {activeDomainExperience.experience.helperTitle}
            </div>
            <div style={{ color: nx.muted, fontSize: 13, marginTop: 10, lineHeight: 1.55 }}>
              {activeDomainExperience.experience.helperBody}
            </div>
            <div style={{ color: nx.lowMuted, fontSize: 12, marginTop: 10, lineHeight: 1.5 }}>
              One decision engine: this workspace sets the starter scenario, prompts, and which executive panels surface first.
            </div>
            {!launchDomainActive ? (
              <div style={{ color: nx.warning, fontSize: 12, marginTop: 10, lineHeight: 1.45 }}>
                You are in a preview workspace. The launch experience highlights Business, DevOps, and Finance — the
                underlying engine is unchanged.
              </div>
            ) : null}
            <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                `1. Load the ${activeDomainExperience.experience.label.toLowerCase()} demo`,
                "2. Enter a pressure prompt",
                "3. Read the executive brief",
              ].map((step) => (
                <div
                  key={step}
                  style={{
                    height: 28,
                    padding: "0 10px",
                    borderRadius: 999,
                    border: "1px solid rgba(148,163,184,0.18)",
                    background: "rgba(2,6,23,0.45)",
                    color: "#cbd5e1",
                    display: "inline-flex",
                    alignItems: "center",
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  {step}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10, color: "#94a3b8", fontSize: 11 }}>
              {`Panel emphasis: ${domainPanelEmphasisLabels.join(", ") || "Executive Dashboard"}`}
            </div>
            <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("nexora:load-demo-scenario", {
                      detail: {
                        demo: activeDomainExperience.experience.defaultDemoId,
                        domainId: activeDomainExperience.experience.domainId,
                      },
                    })
                  )
                }
                style={{
                  height: 30,
                  padding: "0 10px",
                  borderRadius: 999,
                  border: "1px solid rgba(96,165,250,0.35)",
                  background: "rgba(59,130,246,0.16)",
                  color: "#dbeafe",
                  display: "inline-flex",
                  alignItems: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {`Start ${activeDomainExperience.experience.label} Demo`}
              </button>
              <div style={{ color: "#64748b", fontSize: 11 }}>
                {`Use a prompt like ${activeDomainExperience.experience.promptExamples.slice(0, 3).join(", ")} to see the full decision story.`}
              </div>
            </div>
          </div>
        </div>
      )}

      {showDomainPromptGuide ? (
        <div
          style={{
            position: "absolute",
            left: 16,
            top: 16,
            zIndex: 12,
            ...sceneOverlayCardStyle,
            maxWidth: 560,
            padding: 14,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
            <span
              style={{
                fontSize: 9,
                fontWeight: 800,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#93c5fd",
                padding: "2px 7px",
                borderRadius: 8,
                border: "1px solid rgba(96,165,250,0.28)",
                background: "rgba(59,130,246,0.1)",
              }}
            >
              Demo mode
            </span>
            <span style={{ fontSize: 10, fontWeight: 600, color: nx.muted }}>Prompts ready</span>
          </div>
          {(activeDomainExperience.experience.demoScenarioTitle ||
            activeDomainExperience.experience.demoBusinessContext ||
            activeDomainExperience.experience.demoDecisionQuestion) && (
            <div
              style={{
                marginBottom: 10,
                padding: 10,
                borderRadius: 10,
                border: "1px solid rgba(148,163,184,0.15)",
                background: "rgba(2,6,23,0.35)",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              {activeDomainExperience.experience.demoScenarioTitle ? (
                <div style={{ color: nx.text, fontSize: 13, fontWeight: 800, lineHeight: 1.3 }}>
                  {activeDomainExperience.experience.demoScenarioTitle}
                </div>
              ) : null}
              {activeDomainExperience.experience.demoBusinessContext ? (
                <div style={{ color: "#cbd5e1", fontSize: 11, lineHeight: 1.45 }}>
                  <span style={{ color: "#94a3b8" }}>Context · </span>
                  {activeDomainExperience.experience.demoBusinessContext}
                </div>
              ) : null}
              {activeDomainExperience.experience.demoDecisionQuestion ? (
                <div style={{ color: "#cbd5e1", fontSize: 11, lineHeight: 1.45 }}>
                  <span style={{ color: "#94a3b8" }}>Decision focus · </span>
                  {activeDomainExperience.experience.demoDecisionQuestion}
                </div>
              ) : null}
            </div>
          )}
          <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Suggested flow
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6, marginBottom: 10 }}>
            {(["Load scenario", "Ask the system", "Inspect the recommendation"] as const).map((label, idx) => {
              const active = idx === 1;
              return (
                <div
                  key={label}
                  style={{
                    flex: "1 1 120px",
                    minWidth: 0,
                    padding: "6px 8px",
                    borderRadius: 10,
                    border: active ? "1px solid rgba(96,165,250,0.4)" : "1px solid rgba(148,163,184,0.15)",
                    background: active ? "rgba(59,130,246,0.14)" : "rgba(2,6,23,0.35)",
                    fontSize: 10,
                    fontWeight: active ? 700 : 600,
                    color: active ? nx.text : nx.muted,
                    lineHeight: 1.35,
                  }}
                >
                  <span style={{ color: active ? "#93c5fd" : nx.lowMuted, marginRight: 4 }}>{idx + 1}.</span>
                  {label}
                </div>
              );
            })}
          </div>
          <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Guided prompts
          </div>
          <div style={{ color: nx.text, fontSize: 14, fontWeight: 800, marginTop: 4 }}>
            {activeDomainExperience.experience.promptGuideTitle}
          </div>
          <div style={{ color: nx.muted, fontSize: 12, marginTop: 6, lineHeight: 1.5 }}>
            {activeDomainExperience.experience.promptGuideBody}
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10, rowGap: 8 }}>
            {domainPromptSuggestions.map((prompt) => (
              <button
                key={prompt}
                type="button"
                disabled={loading}
                onClick={() => submitGuidedPrompt(prompt, undefined, "domain_prompt_guide")}
                style={{
                  minHeight: 30,
                  padding: "6px 12px",
                  borderRadius: 999,
                  border: "1px solid rgba(148,163,184,0.2)",
                  background: "rgba(59,130,246,0.12)",
                  color: "#dbeafe",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontSize: 11,
                  fontWeight: 600,
                  lineHeight: 1.35,
                  opacity: loading ? 0.65 : 1,
                  textAlign: "left",
                }}
              >
                {prompt}
              </button>
            ))}
          </div>
          <div style={{ color: nx.lowMuted, fontSize: 11, marginTop: 8, lineHeight: 1.45 }}>
            {launchDomainActive
              ? "Watch the network respond, then open the executive brief for impact, rationale, and recommended moves."
              : "Run the guided demo, then review the brief to see how this industry lens reads the same engine."}
          </div>
        </div>
      ) : null}

      {centerComponent ? (
        <div
          id="nexora-secondary-workspace"
          style={{
            position: "absolute",
            zIndex: 11,
            left: 0,
            right: 0,
            bottom: 0,
            height: centerComponentVisible ? "min(40%, 420px)" : 0,
            maxHeight: 420,
            minHeight: centerComponentVisible ? 220 : 0,
            borderTop: `1px solid ${nx.border}`,
            borderTopLeftRadius: 14,
            borderTopRightRadius: 14,
            background: nx.workspacePanelBg,
            backdropFilter: "blur(8px)",
            boxShadow: nx.workspaceShadow,
            overflow: "hidden",
            pointerEvents: "auto",
            transition: "height 180ms ease, min-height 180ms ease, opacity 180ms ease",
            opacity: centerComponentVisible ? 1 : 0,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                flexShrink: 0,
                padding: "14px 18px 12px",
                borderBottom: `1px solid ${nx.dividerStrong}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
                <div style={{ color: nx.text, fontSize: 15, fontWeight: 800, letterSpacing: "-0.01em" }}>
                  {centerComponent === "compare"
                    ? "Option Comparison"
                    : centerComponent === "timeline"
                    ? "Decision Timeline"
                    : "Deep Analysis"}
                </div>
                <div style={{ color: nx.lowMuted, fontSize: 11, lineHeight: 1.4 }}>
                  Deep analysis workspace. Scene remains visible for context.
                </div>
              </div>
              <button
                type="button"
                onClick={closeCenterComponent}
                style={{
                  height: 28,
                  padding: "0 10px",
                  borderRadius: 8,
                  border: `1px solid ${nx.workspaceCloseBorder}`,
                  background: nx.workspaceCloseBg,
                  color: nx.muted,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Close
              </button>
            </div>
            <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Primary analysis
              </div>
              {centerComponent === "compare" ? (
                <DecisionComparePanel
                  responseData={visibleResponseData ?? undefined}
                  strategicAdvice={visibleStrategicAdvice ?? visibleSceneJson?.["strategic_advice"] ?? null}
                  canonicalRecommendation={readCanonicalRecommendation(visibleResponseData, visibleSceneJson)}
                  decisionResult={decisionResult ?? undefined}
                  nexoraB8PanelContext={nexoraB8PanelContext}
                  nexoraB18Compare={centerCompareNexoraB18}
                  decisionLoading={decisionExecutionLoading}
                  decisionStatus={decisionUiState.status}
                  decisionError={decisionUiState.error}
                  memoryEntries={decisionMemoryEntries}
                  onApplyRecommended={() =>
                    dispatchCanonicalAction(
                      normalizeRunSimulation({
                        source: "panel_cta",
                        surface: "center_overlay",
                        rawSource: "DecisionComparePanel:applyRecommended",
                      })
                    )
                  }
                  onSimulateDeeper={() =>
                    dispatchCanonicalAction(
                      normalizeRunSimulation({
                        source: "panel_cta",
                        surface: "center_overlay",
                        rawSource: "DecisionComparePanel:simulateDeeper",
                      })
                    )
                  }
                  onViewRiskFlow={() =>
                    dispatchCanonicalAction(
                      normalizeOpenPanelCta({
                        view: "risk",
                        rawSource: "DecisionComparePanel:risk",
                      })
                    )
                  }
                  onViewScenarioTree={() =>
                    dispatchCanonicalAction(
                      normalizeOpenPanelCta({
                        view: "scenario_tree",
                        rawSource: "DecisionComparePanel:scenario_tree",
                      })
                    )
                  }
                  onOpenDecisionTimeline={() =>
                    dispatchCanonicalAction(
                      normalizeOpenCenterTimeline({
                        source: "panel_cta",
                        surface: "center_overlay",
                        rawSource: "DecisionComparePanel:decision_timeline",
                      })
                    )
                  }
                  onPreviewDecision={handlePreviewDecision}
                  onSaveScenario={handleSaveDecisionScenario}
                  onApplyDecisionSafe={handleApplyDecisionSafe}
                  onOpenDecisionPolicy={handleOpenDecisionPolicyPanel}
                  onOpenExecutiveApproval={handleOpenExecutiveApprovalPanel}
                  resolveObjectLabel={resolveSceneObjectLabel}
                />
              ) : null}
              {centerComponent === "timeline" ? (
                <DecisionTimelinePanel
                  responseData={(stablePanelData.timeline ?? visibleResponseData ?? visibleSceneJson) as any}
                  strategicAdvice={(stablePanelData.advice ?? stablePanelData.strategicAdvice ?? visibleStrategicAdvice) as any}
                  canonicalRecommendation={readCanonicalRecommendation(visibleResponseData, visibleSceneJson)}
                  decisionResult={decisionResult ?? undefined}
                  decisionLoading={decisionExecutionLoading}
                  decisionStatus={decisionUiState.status}
                  decisionError={decisionUiState.error}
                  resolveObjectLabel={resolveSceneObjectLabel}
                  onCompareOptions={() =>
                    dispatchCanonicalAction(
                      normalizeCompareOptions({
                        source: "panel_cta",
                        surface: "center_overlay",
                        rawSource: "DecisionTimelinePanel:compare",
                      })
                    )
                  }
                  onSimulateDecision={() =>
                    dispatchCanonicalAction(
                      normalizeRunSimulation({
                        source: "panel_cta",
                        surface: "center_overlay",
                        rawSource: "DecisionTimelinePanel:simulate",
                      })
                    )
                  }
                  onReturnToWarRoom={() =>
                    dispatchCanonicalAction(
                      normalizeOpenPanelCta({
                        view: "war_room",
                        rawSource: "DecisionTimelinePanel:war_room",
                      })
                    )
                  }
                />
              ) : null}
              {!investorDemo.demo.active ? (
                <>
                  <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 4 }}>
                    Explore next
                  </div>
                  <div
                    style={{
                      borderRadius: 12,
                      border: "1px solid rgba(148,163,184,0.14)",
                      background: "rgba(2,6,23,0.34)",
                      padding: "10px 12px",
                      color: nx.muted,
                      fontSize: 12,
                      lineHeight: 1.5,
                    }}
                  >
                    Use the right rail for summary and quick pivots. Open deep views here when you need detailed comparison, timeline, or extended analysis.
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {/* Small loading badge */}
      {loading ? (
        <div
          style={{
            position: "absolute",
            right: 16,
            bottom: 16,
            pointerEvents: "none",
            zIndex: 12,
            ...sceneWorkingBadgeStyle,
          }}
        >
          Analyzing…
        </div>
      ) : null}
    </div>
  );

  // --- Render ---
  return (
    <div
      id="nexora-home"
      style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}
    >
      {sceneNode}
      {timelineInspectorNode}
      {alertOverlayNode}
      {investorDemoOverlayNode}
    </div>
  );
};

export default HomeScreen;
