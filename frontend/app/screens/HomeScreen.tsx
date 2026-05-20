"use client";

import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { chatToBackendLifecycle } from "../lib/api/chatApi";
import {
  getChatLifecycleErrorMessage,
  isAbortLikeError,
  mapNexoraTargetPanelToRightPanelView,
  runNexoraChatPromptPipeline,
  type ChatRequestLifecycleStatus,
} from "../lib/chat/chatRequestLifecycle";
import { buildFailureResponse } from "../lib/chat/nexoraChatPromptSystem";
import {
  evaluateChatPipelineStability,
  isMeaningfulPanel,
} from "../lib/chat/chatPipelineStability";
import { evaluateSelectedObjectGuard } from "../lib/chat/selectedObjectGuard";
import { resolveExplicitSelectedObject } from "../lib/selection/explicitSelectedObjectContract";
import { getLocalChatResponse, userSafeChatMessage } from "../lib/chat/localChatFallback";
import type { KPIState } from "../lib/api";
import { analyzeFull } from "../lib/api/analyzeApi";
import { postStrategicAnalysisText } from "../lib/api/client";
import { SceneCanvas } from "../components/SceneCanvas";
import SourceControlPanel from "../components/panels/SourceControlPanel";
import type { HUDTabKey } from "../components/HUDShell";
import { diffSnapshots } from "../lib/decision/decisionDiff";
import type { DecisionSnapshot } from "../lib/decision/decisionTypes";
import {
  buildPanelMergeTraceFromEnrichment,
  logDecisionAssistantTelemetryOnce,
  mergeAssistantPanelEnrichment,
  runDecisionAssistant,
  type DecisionAssistantPanelMergeTrace,
} from "../lib/decision";
import { useSetViewMode } from "../components/SceneContext";
import { clamp } from "../lib/sizeCommands";
import { getRecentEvents } from "../lib/api/events";
import { delay } from "../lib/delay";
import type { SceneJson, SceneLoop, LoopType } from "../lib/sceneTypes";
import { buildSceneReactionFromIntent, type SceneIntent } from "../lib/scene/sceneIntent";
import { appendSnapshot, loadSnapshots } from "../lib/decision/decisionStore";
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
import { useNexoraUiTheme } from "../lib/ui/nexoraUiTheme";
import { StrategicAlertOverlay } from "../components/StrategicAlertOverlay";
import { ExecutiveSceneOperationalStrip } from "../components/executive/ExecutiveSceneOperationalStrip";
import { executiveStageFrameStyle } from "../components/executive/executiveProductSurfaceStyles";
import { TypeCDevInspector } from "../components/dev/TypeCDevInspector";
import { TypeCAdaptiveGuidancePanel } from "../components/typec/TypeCAdaptiveGuidancePanel";
import { TypeCAIPanel } from "../components/typec/TypeCAIPanel";
import { TypeCConnectionSuggestionPanel } from "../components/typec/TypeCConnectionSuggestionPanel";
import { TypeCAlertPanel } from "../components/typec/TypeCAlertPanel";
import { TypeCDecisionPanel } from "../components/typec/TypeCDecisionPanel";
import { TypeCExecutionPanel } from "../components/typec/TypeCExecutionPanel";
import { TypeCExecutiveSummaryCard } from "../components/typec/TypeCExecutiveSummaryCard";
import { TypeCMemoryPanel } from "../components/typec/TypeCMemoryPanel";
import { TypeCMultiAgentPanel } from "../components/typec/TypeCMultiAgentPanel";
import { TypeCSandboxPanel } from "../components/typec/TypeCSandboxPanel";
import { TypeCScenarioComparePanel } from "../components/typec/TypeCScenarioComparePanel";
import { TypeCScenarioDraftPanel } from "../components/typec/TypeCScenarioDraftPanel";
import { TypeCWarRoomPanel } from "../components/typec/TypeCWarRoomPanel";
import { D3StatusHud } from "../components/operational/D3StatusHud.tsx";
import {
  defaultOperationalAlertRules,
  deriveOperationalMonitoringSnapshot,
  deriveOperationalPropagationPreview,
  deriveOperationalRiskImpactMap,
  detectOperationalChanges,
  evaluateOperationalAlerts,
  logD3OperationalDiagnosticsDeduped,
  runD3DevTimed,
  toMonitoringSnapshotInput,
  type OperationalMonitoringSnapshot,
  type OperationalPipelineStatusBrief,
} from "../lib/operational/index.ts";
import {
  buildExecutiveMetaCognitionSnapshot,
  logMetaCognitionDiagnostics,
} from "../lib/meta-cognition";
import { nx, sceneOverlayCardStyle, sceneVignetteLayerStyle, sceneWorkingBadgeStyle, softCardStyle } from "../components/ui/nexoraTheme";
import {
  INITIAL_NEXORA_UI_STATE,
  resolveInteraction,
  type InteractionIntent,
  type NexoraUIState,
} from "../lib/interaction/interactionController";
import { useEmotionalFxEngine } from "../lib/fx/useEmotionalFxEngine";
import { useStrategicRadar } from "../lib/strategy/useStrategicRadar";
import { computeRiskLevel } from "../lib/risk/riskEscalationEngine";
import { appendRiskEvent } from "../lib/risk/riskEventStore";
import { routeChatInput } from "../lib/decision/decisionRouter";
import { buildCanonicalRecommendation } from "../lib/decision/recommendation/buildCanonicalRecommendation";
import { buildExecutiveObjectPanelData } from "../lib/panels/executiveObjectPanelData";
import {
  normalizePanelReason,
  normalizePanelSource,
  type PanelReason,
  type PanelSource,
} from "../lib/panels/panelAuthorityTypes";
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
import { buildActiveModeContext, getProductMode } from "../lib/modes/productModesContract";
import { appendDecisionActionTrace } from "../lib/governance/appendDecisionActionTrace";
import {
  buildEnvironmentConfig,
  isFeatureEnabled,
  resolveNexoraEnvironment,
} from "../lib/ops/environmentDeploymentContract";
import { runAutonomousScenarioExploration } from "../lib/exploration/autonomousScenarioExplorer";
import { createInitialMemoryState, deriveVisualPatch, updateMemory } from "../lib/memory/decisionMemory";
import { getNexoraMode } from "../lib/typec/nexoraTypeCMode";
import { detectTypeCIntent } from "../lib/typec/typeCIntent";
import { addTypeCObjectToScene } from "../lib/typec/typeCObjectActions";
import { buildTypeCObjectDraft } from "../lib/typec/typeCObjectDraft";
import { ensureTypeCCoreObject } from "../lib/typec/typeCSceneBootstrap";
import { addTypeCSystemModelToScene } from "../lib/typec/typeCSystemModeling";
import type { TypeCScenarioState } from "../lib/typec/typeCScenarioTypes";
import type { TypeCPipelineEvent } from "../lib/typec/typeCPipelineTracker";
import type { TypeCDecisionReadinessSnapshot } from "../lib/typec/typeCDecisionReadiness";
import type { TypeCDecisionDraft } from "../lib/typec/typeCDecisionDraft";
import type { TypeCExecutiveSummary } from "../lib/typec/typeCExecutiveSummary";
import { buildTypeCExecutiveSummary as buildTypeCExecutiveSummaryFromState } from "../lib/typec/buildTypeCExecutiveSummary";
import {
  buildTypeCAIInsightRequest,
} from "../lib/typec/typeCAIAdapter";
import type { TypeCAIInsightResponse } from "../lib/typec/typeCAIContracts";
import type { TypeCAIExecutiveInsight } from "../lib/typec/aiTypeCExecutiveInsight";
import {
  buildTypeCMultiAgentRequest,
} from "../lib/typec/typeCMultiAgentAdapter";
import type { TypeCMultiAgentInsight } from "../lib/typec/typeCMultiAgentContracts";
import {
  buildTypeCSandboxRequest,
} from "../lib/typec/typeCSandboxAdapter";
import type { TypeCSandboxResult } from "../lib/typec/typeCSandboxContracts";
import {
  buildTypeCConnectionSuggestions,
  type TypeCConnectionSuggestion,
} from "../lib/typec/typeCConnectionSuggestions";
import type { TypeCScenarioDraft } from "../lib/typec/typeCScenarioDrafts";
import type { TypeCExecutionState } from "../lib/typec/typeCExecutionState";
import type { TypeCAlert } from "../lib/typec/typeCAlerts";
import {
  createEmptyTypeCMemoryState,
  deriveTypeCLearningSignals,
  type TypeCMemoryState,
} from "../lib/typec/typeCMemory";
import { buildTypeCAdaptiveGuidance } from "../lib/typec/typeCAdaptiveGuidance";
import type { TypeCScenarioSimulation } from "../lib/typec/typeCScenarioSimulation";
import type { TypeCScenarioComparison } from "../lib/typec/typeCScenarioComparison";
import type { TypeCDecisionRecommendation } from "../lib/typec/typeCDecisionRecommendation";
import {
  buildTypeCExecutiveActions,
  type TypeCExecutiveAction,
} from "../lib/typec/typeCExecutiveActions";
import { resolveTypeCActionPanel } from "../lib/typec/routeTypeCExecutiveAction";
import {
  TYPE_C_ORCHESTRATION_EXTRACTION_PLAN,
  type TypeCApplySceneUpdateRef,
  type TypeCExecutiveInsightContextRef,
  type TypeCOrchestrationRefs,
  type TypeCOrchestrationState,
  type TypeCOpenSimPanelForTypeCRef,
} from "./hooks/typec/useTypeCOrchestration.types.ts";
import { useTypeCOrchestration } from "./hooks/typec/useTypeCOrchestration.ts";
import type { SceneApplyControllerRefs } from "./hooks/scene/useSceneApplyController.types.ts";
import { useSceneApplyController } from "./hooks/scene/useSceneApplyController.ts";
import {
  useRightPanelController,
  useRightPanelControllerBridgeWiring,
  emitRightPanelDiagnosticDev,
} from "./hooks/right-panel/useRightPanelController.ts";
import { normalizeRawAuthorityPanelView } from "./hooks/right-panel/rightPanelAuthorityRoute.ts";
import {
  RIGHT_PANEL_CONTROLLER_EXTRACTION_PLAN,
  type RequestPanelAuthorityOpenFn,
  type RightPanelBridgeRefs,
} from "./hooks/right-panel/useRightPanelController.types.ts";
import {
  CHAT_PIPELINE_CONTROLLER_EXTRACTION_PLAN,
  type ChatPipelineBridgeCallbacks,
  type ChatPipelineSendTextDeps,
  type EmitChatPipelineDiagnosticFn,
} from "./hooks/chat/useChatPipelineController.types.ts";
import { buildChatEffectSignature, normalizeChatInputForDedup } from "./hooks/chat/chatPipelineSendTextHelpers.ts";
import { useChatPipelineController } from "./hooks/chat";
import type { MemoryStateV1 } from "../lib/memory/memoryTypes";
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
  buildFirstMeaningfulState,
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
  shouldAcceptIncomingSceneReplacement,
  shouldAcceptMeaningfulArrayReplacement,
  shouldAcceptMeaningfulRecordReplacement,
  type FirstMeaningfulState,
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
  type SubmitManualTextIngestionResult,
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
import {
  applyFragilityScenePayload,
  buildFragilityScenePayloadSignature,
} from "../lib/scene/applyFragilityScenePayload";
import {
  buildSelectionSignature,
  selectionGuardSourceFromReaction,
  traceNexoraSelectionGuard,
} from "../lib/selection/selectionSignature";
import {
  resolveDomainExperience,
  type NexoraResolvedDomainExperience,
} from "../lib/domain/domainExperienceRegistry";
import type { AddObjectMenuItem } from "../lib/domain/domainAddObjectAdapter.ts";
import { applyDomainCatalogSelectionToScene } from "../lib/domain/domainCatalogSelection.ts";
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
  reactionHasExplicitHighlightIntent,
  type UnifiedSceneReaction,
} from "../lib/scene/unifiedReaction";
import { buildSceneSemanticSignature } from "../lib/scene/sceneSemanticSignature";
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
import { RETAIL_FRAGILITY_DEMO_SCRIPT, type DemoScriptStep } from "../lib/demo/demoScript";
import { useCustomerDemoMode } from "../lib/demo/useCustomerDemoMode";
import { useNarrativeSceneBinding, useNarrativeSceneBindingDebug } from "../lib/demo/useNarrativeSceneBinding";
import type { FocusOwnershipState } from "../lib/focus/focusOwnershipTypes";
import { resolveFocusOwnership } from "../lib/focus/resolveFocusOwnership";
import { runDecisionExecution } from "../lib/executive/decisionExecutionClient";
import type { DecisionExecutionPayload, DecisionExecutionResult } from "../lib/executive/decisionExecutionTypes";
import { DecisionComparePanel } from "../components/executive/DecisionComparePanel";
import { TeamDecisionPanel } from "../components/executive/TeamDecisionPanel";
import { AutonomousDecisionCouncilPanel } from "../components/executive/AutonomousDecisionCouncilPanel";
import { OrgMemoryPanel } from "../components/executive/OrgMemoryPanel";
import { DecisionPolicyPanel } from "../components/executive/DecisionPolicyPanel";
import { DecisionGovernancePanel } from "../components/executive/DecisionGovernancePanel";
import { ExecutiveApprovalPanel } from "../components/executive/ExecutiveApprovalPanel";
import { StrategicLearningPanel } from "../components/executive/StrategicLearningPanel";
import { MetaDecisionPanel } from "../components/executive/MetaDecisionPanel";
import { CognitiveStylePanel } from "../components/executive/CognitiveStylePanel";
import { CollaborationIntelligencePanel } from "../components/executive/CollaborationIntelligencePanel";
import { DecisionOutcomeFeedbackPanel } from "../components/executive/DecisionOutcomeFeedbackPanel";
import { DecisionPatternIntelligencePanel } from "../components/executive/DecisionPatternIntelligencePanel";
import { DecisionMemoryPanel } from "../components/executive/DecisionMemoryPanel";
import { ScenarioBranchingTreePanel } from "../components/executive/ScenarioBranchingTreePanel";
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
import { DecisionConfidenceCalibrationPanel } from "../components/executive/DecisionConfidenceCalibrationPanel";
import { DecisionLifecyclePanel } from "../components/executive/DecisionLifecyclePanel";
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
import { StrategicCommandFull } from "../components/executive/StrategicCommandFull";
import { RightPanelHost } from "../components/right-panel/RightPanelHost";
import { ChatPipelineQAPanel } from "../components/debug/ChatPipelineQAPanel";
import { PrimaryDecisionStrip } from "../components/right-panel/PrimaryDecisionStrip";
import { DEFAULT_LEFT_COMMANDS, LeftCommandAssistant } from "../components/assistant/LeftCommandAssistant";
import type {
  RightPanelState,
  RightPanelView,
  CenterExecutionSurface,
  CanonicalRightPanelView,
} from "../lib/ui/right-panel/rightPanelTypes";
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
  buildPanelContractSignature,
  buildPanelSharedDataSignature,
  EMPTY_PANEL_SHARED_DATA,
  validatePanelSharedDataWithDiagnostics,
  type PanelSharedDataValidationResult,
} from "../lib/panels/panelDataContract";
import {
  createClosedRightPanelState,
  mapLegacyTabToRightPanelView,
  resolveChatPipelinePanelOpen,
  resolveRightPanelInspectorHostId,
  resolveRightPanelLegacyTabForView,
} from "../lib/ui/right-panel/rightPanelRouter";
import { applySceneFromChat } from "../lib/scene/sceneApplyContract";
import { resolvePanelDecision } from "../lib/ui/right-panel/panelController";
import type {
  PanelOpenSource,
  PanelRequestIntent,
} from "../lib/ui/right-panel/panelControllerTypes";
import { emitDebugEvent } from "../lib/debug/debugEmit";
import { registerPanelSelfDebugLink } from "../lib/debug/debugCorrelationBridge";
import { getRecentDebugEvents } from "../lib/debug/debugEventStore";
import { traceSceneWrite } from "../lib/debug/sceneWriteTrace";
import { emitGuardRailAlerts, runGuardChecks } from "../lib/debug/debugGuardRails";
import { useInvestorDemo, INVESTOR_DEMO_MAX_STEP } from "../components/demo/InvestorDemoContext";
import { registerNexoraActionDispatch } from "../lib/actions/actionDispatchRegistry";
import type { ActionRouterContext, CanonicalNexoraAction } from "../lib/actions/actionTypes";
import { resolveActionRoute } from "../lib/actions/actionRouter";
import {
  normalizeCompareOptions,
  normalizeOpenCenterTimeline,
  normalizeOpenComponentPanel,
  normalizeOpenRightPanelEventDetail,
  normalizeRunSimulation,
} from "../lib/actions/actionNormalizer";
import {
  mapRightPanelViewToCenterComponentId,
  type ComponentPanelActionName,
  type OpenComponentPanelContext,
} from "../lib/componentPanel/componentPanelFromAction";
import { resolveIntentToPanel } from "../lib/routing/intentResolver";
import { expectedFamilyForIntent, type NexoraIntent, type PanelFamily } from "../lib/routing/intentPanelRegistry";
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
  "input",
] as const;

function isAnalyzeLikeUserText(text: string): boolean {
  const t = text.trim().toLowerCase();
  if (t.startsWith("explain ")) return false;
  return (
    t.includes("analyze") ||
    t.includes("analyse") ||
    t.includes("risk") ||
    t.includes("what should we do") ||
    t.includes("decision")
  );
}

type LegacyRightPanelTab = (typeof LEGACY_RIGHT_PANEL_TABS)[number];
type CenterComponentType =
  | "compare"
  | "timeline"
  | "confidence_calibration"
  | "pattern_intelligence"
  | "strategic_learning"
  | "decision_strategic"
  | "decision_lens"
  | "collaboration_intelligence"
  | "outcome_feedback"
  | "decision_memory"
  | "decision_lifecycle"
  | "scenario_tree"
  | "analysis"
  | "strategic_command_full"
  | "team_decision"
  | "decision_council"
  | "org_memory"
  | "decision_policy"
  | "executive_approval"
  | "decision_governance"
  | null;

const LARGE_CENTER_WORKSPACE_COMPONENTS = new Set<Exclude<CenterComponentType, null>>([
  "strategic_command_full",
  "team_decision",
  "decision_council",
  "org_memory",
  "decision_policy",
  "executive_approval",
  "decision_governance",
  "confidence_calibration",
  "pattern_intelligence",
  "strategic_learning",
  "decision_strategic",
  "decision_lens",
  "collaboration_intelligence",
  "outcome_feedback",
  "decision_memory",
  "decision_lifecycle",
  "scenario_tree",
]);

function isLargeCenterWorkspaceComponent(c: CenterComponentType): boolean {
  return c != null && LARGE_CENTER_WORKSPACE_COMPONENTS.has(c);
}

const NEXORA_PIPELINE_USER_FAILURE = "System couldn't complete analysis. Please try again.";

function nexoraPipelineUserFacingMessage(err: unknown): string {
  if (getNexoraProductMode() === "pilot") return NEXORA_PIPELINE_USER_FAILURE;
  if (err instanceof NexoraError) return err.safeMessage;
  return NEXORA_PIPELINE_USER_FAILURE;
}

function countSceneObjects(scene: any): number {
  return Array.isArray(scene?.scene?.objects) ? scene.scene.objects.length : 0;
}

function sceneObjectIds(scene: any): string[] {
  return Array.isArray(scene?.scene?.objects)
    ? scene.scene.objects.map((obj: any) => String(obj?.id ?? obj?.name ?? "unknown"))
    : [];
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

type RightPanelOpenRequestDetail = {
  view?: RightPanelView | string | null;
  tab?: string | null;
  leftNav?: string | null;
  section?: string | null;
  source?: string | null;
  contextId?: string | null;
  family?: "EXE" | "SCN" | "SIM" | "RSK";
  reason?: string | null;
  forceOpen?: boolean;
};

type GuidedPromptSource =
  | "domain_prompt_guide"
  | "assistant_prompt_chip"
  | "guided_prompt";

type GettingStartedState = "empty" | "objects_no_selection" | "ready_with_selection";
type EntryFlowState = "idle" | "describing_system" | "objects_created" | "ready_for_analysis";

function resolveGettingStartedState(input: {
  sceneJson: SceneJson | null;
  selectedObjectId: string | null;
}): GettingStartedState {
  const objects = Array.isArray(input.sceneJson?.scene?.objects) ? input.sceneJson.scene.objects : [];
  if (objects.length === 0) return "empty";
  if (!input.selectedObjectId) return "objects_no_selection";
  return "ready_with_selection";
}

function hasRenderableSceneObjects(scene: SceneJson | null): boolean {
  return Array.isArray(scene?.scene?.objects) && scene.scene.objects.length > 0;
}

function buildStarterSceneFromText(_text: string): SceneJson {
  return {
    state_vector: {},
    scene: {
      objects: [
        { id: "delivery", label: "Delivery", type: "node" } as any,
        { id: "inventory", label: "Inventory", type: "node" } as any,
        { id: "supplier", label: "Supplier", type: "node" } as any,
      ],
    },
    object_selection: {
      highlighted_objects: ["delivery"],
      highlighted_ids: ["delivery"],
    } as any,
  } as SceneJson;
}

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

const BACKEND_BASE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_BACKEND_URL) || "http://127.0.0.1:8000";
const NEXORA_PANEL_DEPRECATION_DEBUG = true;

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
 *
 * O1 Optimization Rules:
 * - extract only one orchestration zone per prompt
 * - preserve public contracts
 * - do not rewrite routing
 * - do not mutate sceneJson directly
 * - do not add render-time debug emissions
 * - keep logs dev-only and deduped
 * - prefer hooks over large inline orchestration blocks
 *
 * See `HomeScreenOptimizationInventory.md` for extraction ownership and bug-tracking checklist.
 */
type HomeScreenProps = {
  domainExperience?: NexoraResolvedDomainExperience;
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ domainExperience }) => {
  // Shell surface: state + refs → O5 controller composition → derived memos/callbacks/effects → JSX (O5:6).
  const isPilotProductMode = useMemo(() => getNexoraProductMode() === "pilot", []);
  const typeCMode = useMemo(() => getNexoraMode(), []);
  const lastTypeCSignatureRef = useRef<string | null>(null);
  const lastTypeCExecutiveActionPanelRef = useRef<{ signature: string; at: number } | null>(null);
  const typeCPipelineEventsRef = useRef<TypeCPipelineEvent[]>([]);
  const prevD3MonitoringSnapshotRef = useRef<OperationalMonitoringSnapshot | null>(null);
  const lastOperationalChangeLogSigRef = useRef<string | null>(null);
  // O1 Extraction Boundary: Type-C orchestration
  const [typeCScenarioState, setTypeCScenarioState] = useState<TypeCScenarioState>({
    scenarios: [],
    selectedScenarioId: null,
  });
  const [typeCDecisionReadiness, setTypeCDecisionReadiness] =
    useState<TypeCDecisionReadinessSnapshot | null>(null);
  const [typeCDecisionDraft, setTypeCDecisionDraft] =
    useState<TypeCDecisionDraft | null>(null);
  const [typeCCommandExecutiveSummary, setTypeCCommandExecutiveSummary] =
    useState<TypeCExecutiveSummary | null>(null);
  const [typeCAIExecutiveInsight, setTypeCAIExecutiveInsight] =
    useState<TypeCAIExecutiveInsight | null>(null);
  const [typeCAIInsight, setTypeCAIInsight] =
    useState<TypeCAIInsightResponse | null>(null);
  const [typeCAIInsightLoading, setTypeCAIInsightLoading] = useState(false);
  const [typeCAIInsightError, setTypeCAIInsightError] = useState<string | null>(null);
  const [typeCMultiAgentInsight, setTypeCMultiAgentInsight] =
    useState<TypeCMultiAgentInsight | null>(null);
  const [typeCMultiAgentLoading, setTypeCMultiAgentLoading] = useState(false);
  const [typeCMultiAgentError, setTypeCMultiAgentError] = useState<string | null>(null);
  const [typeCSandboxResult, setTypeCSandboxResult] =
    useState<TypeCSandboxResult | null>(null);
  const [typeCSandboxLoading, setTypeCSandboxLoading] = useState(false);
  const [typeCSandboxError, setTypeCSandboxError] = useState<string | null>(null);
  const [connectionSuggestions, setConnectionSuggestions] =
    useState<TypeCConnectionSuggestion[] | null>(null);
  const [scenarioDrafts, setScenarioDrafts] =
    useState<TypeCScenarioDraft[] | null>(null);
  const [activeTypeCScenario, setActiveTypeCScenario] =
    useState<TypeCScenarioDraft | null>(null);
  const [activeSimulation, setActiveSimulation] =
    useState<TypeCScenarioSimulation | null>(null);
  const [scenarioComparison, setScenarioComparison] =
    useState<TypeCScenarioComparison | null>(null);
  const [scenarioComparisonDrafts, setScenarioComparisonDrafts] =
    useState<TypeCScenarioDraft[] | null>(null);
  const [decisionRecommendation, setDecisionRecommendation] =
    useState<TypeCDecisionRecommendation | null>(null);
  const [executionState, setExecutionState] =
    useState<TypeCExecutionState | null>(null);
  const [executionScenario, setExecutionScenario] =
    useState<TypeCScenarioDraft | null>(null);
  const [typeCAlerts, setTypeCAlerts] = useState<TypeCAlert[]>([]);
  const [typeCMemoryState, setTypeCMemoryState] =
    useState<TypeCMemoryState>(() => createEmptyTypeCMemoryState());

  const typeCOrchestrationState = useMemo<TypeCOrchestrationState>(
    () => ({
      scenario: {
        typeCScenarioState,
        typeCDecisionReadiness,
        typeCDecisionDraft,
        typeCCommandExecutiveSummary,
      },
      ai: {
        typeCAIExecutiveInsight,
        typeCAIInsight,
        typeCAIInsightLoading,
        typeCAIInsightError,
      },
      multiAgent: {
        typeCMultiAgentInsight,
        typeCMultiAgentLoading,
        typeCMultiAgentError,
      },
      sandbox: {
        typeCSandboxResult,
        typeCSandboxLoading,
        typeCSandboxError,
      },
      simulation: {
        connectionSuggestions,
        scenarioDrafts,
        activeTypeCScenario,
        activeSimulation,
        scenarioComparison,
        scenarioComparisonDrafts,
        decisionRecommendation,
      },
      execution: {
        executionState,
        executionScenario,
      },
      alertsMemory: {
        typeCAlerts,
        typeCMemoryState,
      },
    }),
    [
      typeCScenarioState,
      typeCDecisionReadiness,
      typeCDecisionDraft,
      typeCCommandExecutiveSummary,
      typeCAIExecutiveInsight,
      typeCAIInsight,
      typeCAIInsightLoading,
      typeCAIInsightError,
      typeCMultiAgentInsight,
      typeCMultiAgentLoading,
      typeCMultiAgentError,
      typeCSandboxResult,
      typeCSandboxLoading,
      typeCSandboxError,
      connectionSuggestions,
      scenarioDrafts,
      activeTypeCScenario,
      activeSimulation,
      scenarioComparison,
      scenarioComparisonDrafts,
      decisionRecommendation,
      executionState,
      executionScenario,
      typeCAlerts,
      typeCMemoryState,
    ]
  );

  const typeCOrchestrationRefs = useMemo<TypeCOrchestrationRefs>(
    () => ({
      lastTypeCSignatureRef,
      lastTypeCExecutiveActionPanelRef,
      typeCPipelineEventsRef,
    }),
    [lastTypeCSignatureRef, lastTypeCExecutiveActionPanelRef, typeCPipelineEventsRef]
  );

  const typeCExecutiveInsightContextRef = useRef<TypeCExecutiveInsightContextRef["current"]>({
    focusedId: null,
    selectedObjectIdState: null,
    typeCExecutiveSummary: null,
  });

  const applyTypeCSceneUpdateRef = useRef<TypeCApplySceneUpdateRef["current"]>(null);
  const openTypeCSimPanelRef = useRef<TypeCOpenSimPanelForTypeCRef["current"]>(null);
  const rightPanelBridgeRefs = useMemo<Partial<RightPanelBridgeRefs>>(
    () => ({ typeCOpenSimPanelRef: openTypeCSimPanelRef }),
    [openTypeCSimPanelRef]
  );

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
  // O5 keep: dev-only mode log (separate from extraction baselines).
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      globalThis.console.log("[Nexora][Mode]", { mode: typeCMode });
    }
  }, [typeCMode]);
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
  const lastRightPanelChangeSourceRef = useRef<string | null>(null);
  /** O3:5 — wired after `requestPanelAuthorityOpen` / `requestPanelAuthorityClose` are defined (same tick as render). */
  const panelAuthorityOpenBridgeRef = useRef<RequestPanelAuthorityOpenFn | null>(null);
  const panelAuthorityCloseBridgeRef = useRef<((reason?: string) => void) | null>(null);
  const validatedPanelCacheRef = useRef<{
    signature: string | null;
    result: PanelSharedDataValidationResult | null;
  }>({
    signature: null,
    result: null,
  });
  const getValidatedPanelSharedDataOnce = useCallback(
    (rawPanelSharedData: unknown, signature: string): PanelSharedDataValidationResult => {
      const cached = validatedPanelCacheRef.current;
      if (process.env.NODE_ENV !== "production") {
        console.debug("[Nexora][PanelValidationSignatureCheck]", {
          previous: cached.signature,
          next: signature,
          same: cached.signature === signature,
        });
      }
      if (cached.signature === signature && cached.result) {
        return cached.result;
      }
      if (process.env.NODE_ENV !== "production") {
        console.debug("[Nexora][PanelValidationActuallyRuns]", {
          signature,
        });
      }
      const result = validatePanelSharedDataWithDiagnostics(rawPanelSharedData);
      validatedPanelCacheRef.current = {
        signature,
        result,
      };
      return result;
    },
    []
  );
  const lastValidatedAnalyzeRunRef = useRef<string | null>(null);
  const latestPanelInputSignatureRef = useRef<string | null>(null);
  const latestRawPanelSharedDataRef = useRef<unknown>(null);
  const analyzeInFlightRef = useRef(false);
  const analyzePreflightArmedRef = useRef(false);
  const lastAnalyzeRequestAtRef = useRef(0);
  const analyzeSelectionLockRef = useRef<{
    objectId: string;
    startedAt: number;
    requestId?: string | null;
  } | null>(null);
  const [sceneJson, setSceneJson] = useState<SceneJson | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [selectedObjectIdState, _setSelectedObjectIdState] = useState<string | null>(null);

  const typeCLearningSignals = useMemo(
    () => deriveTypeCLearningSignals(typeCMemoryState),
    [typeCMemoryState]
  );
  const typeCAdaptiveGuidance = useMemo(
    () =>
      buildTypeCAdaptiveGuidance({
        decision: decisionRecommendation,
        execution: executionState,
        memory: typeCMemoryState,
      }),
    [decisionRecommendation, executionState, typeCMemoryState]
  );
  const typeCAIInsightRequest = useMemo(
    () =>
      buildTypeCAIInsightRequest({
        decisionRecommendation,
        adaptiveGuidance: typeCAdaptiveGuidance,
        memorySummary: typeCLearningSignals,
      }),
    [decisionRecommendation, typeCAdaptiveGuidance, typeCLearningSignals]
  );
  const canGenerateTypeCAIInsight = Boolean(decisionRecommendation || typeCAdaptiveGuidance);
  const typeCMultiAgentRequest = useMemo(
    () =>
      buildTypeCMultiAgentRequest({
        recommendation: decisionRecommendation,
        adaptiveGuidance: typeCAdaptiveGuidance,
        memorySummary: typeCLearningSignals,
      }),
    [decisionRecommendation, typeCAdaptiveGuidance, typeCLearningSignals]
  );
  const canRunTypeCMultiAgent = Boolean(decisionRecommendation || typeCAdaptiveGuidance);
  const typeCSandboxRequest = useMemo(
    () =>
      buildTypeCSandboxRequest({
        sceneJson,
        currentRecommendation: decisionRecommendation,
        activeScenario: activeTypeCScenario,
      }),
    [activeTypeCScenario, decisionRecommendation, sceneJson]
  );
  const canRunTypeCSandbox = Boolean(typeCSandboxRequest);

  // ======================================================
  // O5 Shell Composition: Controllers
  // Hook order: scene apply before Type-C (bridge ref only; no applySceneChangeSafe from Type-C).
  // Right panel + chat hooks stay below after panel state and chatPipelineSendTextDeps (TDZ / hook rules).
  // ======================================================
  // Final shell contract:
  // HomeScreen wires state + controllers + render layout.
  // Orchestration lives in Type-C, Scene, Right Panel, and Chat Pipeline controllers.
  const lastUpstreamSceneApplySigBySourceRef = useRef<Map<string, string>>(new Map());
  const lastSceneResetTraceSigRef = useRef<string | null>(null);
  const lastSceneSemanticApplyRef = useRef<string | null>(null);
  const lastSceneVisualApplySignatureRef = useRef<string | null>(null);
  const sceneApplyControllerRefs = useMemo<Partial<SceneApplyControllerRefs>>(
    () => ({
      lastSceneSemanticSignatureRef: lastSceneSemanticApplyRef,
      lastSceneRenderSignatureRef: lastSceneVisualApplySignatureRef,
    }),
    [lastSceneSemanticApplyRef, lastSceneVisualApplySignatureRef]
  );
  const sceneApplyBridgeRefs = useMemo(
    () => ({
      applyTypeCSceneUpdateRef,
    }),
    [applyTypeCSceneUpdateRef]
  );
  // O2 Extraction Boundary: Scene apply — shell owns `sceneJson` + upstream dedupe; hook owns `applySceneChangeSafe` (see `useSceneApplyController.ts`).
  const sceneApplyController = useSceneApplyController({
    sceneJson,
    setSceneJson,
    selectedObjectId: selectedObjectIdState,
    focusedObjectId: focusedId,
    refs: sceneApplyControllerRefs,
    lastSceneResetTraceSigRef,
    sceneApplyConsoleDebug: console.debug,
    bridgeRefs: sceneApplyBridgeRefs,
  });
  const {
    callbacks: { applySceneChangeSafe, emitSceneApplyDiagnostic },
  } = sceneApplyController;

  // --- Type-C orchestration ---
  const typeCOrchestration = useTypeCOrchestration({
    enabled: typeCMode === "type_c",
    mode: typeCMode,
    typeCMode,
    sceneJson,
    state: typeCOrchestrationState,
    refs: typeCOrchestrationRefs,
    setTypeCScenarioState,
    setTypeCDecisionReadiness,
    setTypeCDecisionDraft,
    setTypeCCommandExecutiveSummary,
    typeCExecutiveInsightContextRef,
    canGenerateTypeCAIInsight,
    canRunTypeCMultiAgent,
    typeCAIInsightRequest,
    typeCMultiAgentRequest,
    typeCSandboxRequest,
    setTypeCAIExecutiveInsight,
    setTypeCAIInsight,
    setTypeCAIInsightLoading,
    setTypeCAIInsightError,
    setTypeCMultiAgentInsight,
    setTypeCMultiAgentLoading,
    setTypeCMultiAgentError,
    setTypeCSandboxResult,
    setTypeCSandboxLoading,
    setTypeCSandboxError,
    applyTypeCSceneUpdateRef,
    openTypeCSimPanelRef,
    setConnectionSuggestions,
    setScenarioDrafts,
    setActiveTypeCScenario,
    setActiveSimulation,
    setScenarioComparison,
    setScenarioComparisonDrafts,
    setDecisionRecommendation,
    setExecutionState,
    setExecutionScenario,
    setTypeCAlerts,
    setTypeCMemoryState,
  });
  const {
    callbacks: {
      trackTypeCPipelineEvent,
      refreshTypeCDecisionReadiness,
      createTypeCDecisionDraft,
      createTypeCExecutiveSummary,
      createTypeCScenarioDraft,
      applyTypeCScenarioStatusIntent,
      enhanceTypeCExecutiveSummary,
      handleEnhanceTypeCExecutiveSummary,
      handleGenerateTypeCAIInsight,
      handleCloseTypeCAIInsight,
      handleRunTypeCMultiAgent,
      handleCloseTypeCMultiAgent,
      handleRunTypeCSandbox,
      handleCloseTypeCSandbox,
      handleReviewTypeCSandboxStrategy,
      handleCompareTypeCSandboxStrategy,
      handlePromoteTypeCSandboxStrategy,
      cancelTypeCConnectionSuggestions,
      cancelTypeCScenarioDrafts,
      applyTypeCConnectionSuggestions,
      openTypeCScenarioDraftWarRoom,
      compareTypeCScenarioDrafts,
      closeTypeCScenarioCompare,
      openBestTypeCScenarioInWarRoom,
      exitTypeCScenarioSimulation,
      handleStartTypeCExecution,
      handlePauseTypeCExecution,
      handleStopTypeCExecution,
      handleAcknowledgeTypeCAlert,
      handleClearTypeCAlerts,
      handleClearTypeCMemory,
    },
  } = typeCOrchestration;

  // O5: dev __NEXORA_DEBUG__ mirror for Type-C read models (one effect; same keys as prior three).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const debugWindow = window as typeof window & {
      __NEXORA_DEBUG__?: Record<string, unknown>;
    };
    debugWindow.__NEXORA_DEBUG__ = debugWindow.__NEXORA_DEBUG__ ?? {};
    debugWindow.__NEXORA_DEBUG__.typeCDecisionReadiness = typeCDecisionReadiness;
    debugWindow.__NEXORA_DEBUG__.typeCDecisionDraft = typeCDecisionDraft;
    debugWindow.__NEXORA_DEBUG__.typeCCommandExecutiveSummary = typeCCommandExecutiveSummary;
  }, [typeCDecisionReadiness, typeCDecisionDraft, typeCCommandExecutiveSummary]);

  const sceneIntentQueueRef = useRef<SceneIntent[]>([]);
  const [sceneIntentEpoch, setSceneIntentEpoch] = useState(0);
  const buildSceneSemanticSigForUpstreamDedupe = useCallback(
    (nextScene: SceneJson | null, source: string): string => {
      const nextObjects = Array.isArray(nextScene?.scene?.objects) ? nextScene.scene.objects : [];
      const objectIds = nextObjects
        .map((obj: unknown, idx: number) => {
          const o = asRecord(obj);
          return String(o?.id ?? o?.name ?? `${o?.type ?? "obj"}:${idx}`);
        })
        .filter(Boolean);
      const nextSelection = asRecord(nextScene)?.object_selection;
      const highlightedIds = getHighlightedObjectIdsFromSelection(nextSelection);
      const shouldDim = (nextSelection as any)?.dim_unrelated_objects === true;
      const dimmedIds = shouldDim ? objectIds.filter((id) => !highlightedIds.includes(id)) : [];
      return buildSceneSemanticSignature({
        objectIds,
        highlightedIds,
        dimmedIds,
        selectedId: null,
        reactionMode: null,
        propagationSource: source,
      });
    },
    []
  );
  const applySceneChangeUpstreamDedup = useCallback(
    (nextScene: SceneJson | null, source: string, options?: { bypassDedupe?: boolean }) => {
      const nextSemanticSig = buildSceneSemanticSigForUpstreamDedupe(nextScene, source);
      const prev = lastUpstreamSceneApplySigBySourceRef.current.get(source) ?? null;
      if (prev === nextSemanticSig) {
        emitSceneApplyDiagnostic("apply_skipped", {
          skippedReason: "upstream_semantic_map",
          source,
          signature: nextSemanticSig,
        });
        return;
      }
      lastUpstreamSceneApplySigBySourceRef.current.set(source, nextSemanticSig);
      applySceneChangeSafe(nextScene, source, options);
    },
    [applySceneChangeSafe, buildSceneSemanticSigForUpstreamDedupe, emitSceneApplyDiagnostic]
  );

  const handleDomainCatalogObjectSelect = useCallback(
    (item: AddObjectMenuItem) => {
      applySceneChangeSafe((prev) => {
        if (!prev) return prev;
        const result = applyDomainCatalogSelectionToScene({
          currentScene: prev,
          item,
        });
        if (!result.success || !result.nextScene) return prev;
        return result.nextScene;
      }, "domain_object_catalog_ui_add");
    },
    [applySceneChangeSafe]
  );

  const setSceneJsonForExecutionApply = useCallback(
    (next: SceneJson | null | ((prev: SceneJson | null) => SceneJson | null)) => {
      if (typeof next === "function") {
        applySceneChangeSafe(next, "chat");
        return;
      }
      applySceneChangeUpstreamDedup(next, "chat");
    },
    [applySceneChangeSafe, applySceneChangeUpstreamDedup]
  );

  // O5 keep: shell-level Type-C core object bootstrap via scene apply (gated on mode).
  useEffect(() => {
    if (typeCMode !== "type_c") return;
    applySceneChangeSafe((prev) => {
      const next = ensureTypeCCoreObject(prev, typeCMode);
      if (next === prev) return prev;
      if (process.env.NODE_ENV !== "production") {
        globalThis.console.log("[Nexora][TypeC][CoreObjectAdded]", {
          objectId: "nexora_core",
        });
      }
      return next;
    }, "type_c_bootstrap", { bypassDedupe: true });
  }, [applySceneChangeSafe, typeCMode]);

  const applyTypeCChatIntent = useCallback(
    (userText: string): boolean => {
      if (typeCMode !== "type_c") return false;

      const intent = detectTypeCIntent(userText);
      if (intent.type === "none") return false;

      const signature =
        intent.type === "model_system"
          ? `model:${intent.labels.join(">")}`
          : intent.type === "create_scenario"
            ? `scenario:${(sceneJson?.scene?.objects ?? []).map((object) => String(object.id ?? "")).join(">")}`
            : intent.type === "select_scenario" ||
                intent.type === "ignore_scenario" ||
                intent.type === "ready_for_decision"
              ? `scenario_status:${intent.type}:${typeCScenarioState.selectedScenarioId ?? "none"}:${typeCScenarioState.scenarios
                  .map((scenario) => `${scenario.id}:${scenario.status}`)
                  .join(">")}`
              : intent.type === "check_decision_readiness"
                ? `decision_readiness:${typeCScenarioState.selectedScenarioId ?? "none"}:${typeCScenarioState.scenarios
                    .map((scenario) => `${scenario.id}:${scenario.status}`)
                    .join(">")}:${sceneJson?.scene?.objects?.length ?? 0}:${sceneJson?.scene?.loops?.length ?? 0}`
                : intent.type === "create_decision_draft"
                  ? `decision_draft:${typeCDecisionReadiness?.id ?? "none"}:${typeCScenarioState.selectedScenarioId ?? "none"}:${typeCScenarioState.scenarios
                      .map((scenario) => `${scenario.id}:${scenario.status}`)
                      .join(">")}:${sceneJson?.scene?.objects?.length ?? 0}:${sceneJson?.scene?.loops?.length ?? 0}`
                  : intent.type === "create_executive_summary"
                    ? `executive_summary:${typeCDecisionReadiness?.id ?? "none"}:${typeCScenarioState.selectedScenarioId ?? "none"}:${typeCScenarioState.scenarios
                        .map((scenario) => `${scenario.id}:${scenario.status}`)
                        .join(">")}:${sceneJson?.scene?.objects?.length ?? 0}:${sceneJson?.scene?.loops?.length ?? 0}`
              : `add:${intent.label}`;
      if (process.env.NODE_ENV !== "production") {
        globalThis.console.log("[Nexora][TypeC][IntentDetected]", intent);
      }
      trackTypeCPipelineEvent({
        step: "intent_detected",
        input: userText,
        intentType: intent.type,
      });

      if (lastTypeCSignatureRef.current === signature) {
        if (process.env.NODE_ENV !== "production") {
          globalThis.console.log("[Nexora][TypeC][Deduped]", { signature });
        }
        trackTypeCPipelineEvent({
          step: "deduped",
          input: userText,
          intentType: intent.type,
          reason: signature,
        });
        return true;
      }

      lastTypeCSignatureRef.current = signature;
      if (intent.type === "create_scenario") {
        createTypeCScenarioDraft();
        return true;
      }
      if (
        intent.type === "select_scenario" ||
        intent.type === "ignore_scenario" ||
        intent.type === "ready_for_decision"
      ) {
        applyTypeCScenarioStatusIntent(intent.type);
        return true;
      }
      if (intent.type === "check_decision_readiness") {
        refreshTypeCDecisionReadiness();
        return true;
      }
      if (intent.type === "create_decision_draft") {
        createTypeCDecisionDraft();
        return true;
      }
      if (intent.type === "create_executive_summary") {
        createTypeCExecutiveSummary();
        return true;
      }

      applySceneChangeSafe((prev) => {
        if (!prev) return prev;

        const sceneWithCore = ensureTypeCCoreObject(prev, typeCMode);
        if (!sceneWithCore) return prev;

        const next =
          intent.type === "model_system"
            ? addTypeCSystemModelToScene(sceneWithCore, intent.labels)
            : addTypeCObjectToScene(sceneWithCore, {
                label: intent.label,
                prompt: userText,
              });

        if (next === sceneWithCore) {
          if (process.env.NODE_ENV !== "production") {
            globalThis.console.log("[Nexora][TypeC][SkippedDuplicate]", {
              intent: intent.type,
              label: intent.type === "add_object" ? intent.label : undefined,
              labels: intent.type === "model_system" ? intent.labels : undefined,
            });
          }
          trackTypeCPipelineEvent({
            step: "skipped",
            input: userText,
            intentType: intent.type,
            objectIds: intent.type === "model_system" ? intent.labels : intent.type === "add_object" ? [intent.label] : undefined,
            reason: "duplicate_or_no_scene_change",
          });
          return prev;
        }

        if (process.env.NODE_ENV !== "production") {
          globalThis.console.log(
            intent.type === "model_system" ? "[Nexora][TypeC][ChatModelSystem]" : "[Nexora][TypeC][ChatAddObject]",
            intent.type === "model_system" ? { labels: intent.labels, reason: intent.reason } : intent.label
          );
        }
        trackTypeCPipelineEvent({
          step: intent.type === "model_system" ? "system_model_added" : "object_added",
          input: userText,
          intentType: intent.type,
          objectIds:
            intent.type === "model_system"
              ? intent.labels
              : intent.type === "add_object"
                ? [intent.label]
                : undefined,
          reason: intent.type === "model_system" ? intent.reason : undefined,
        });
        if (intent.type === "add_object") {
          const newObject = buildTypeCObjectDraft({
            label: intent.label,
            prompt: userText,
          });
          const suggestions = buildTypeCConnectionSuggestions({
            newObject,
            sceneJson: next,
          });
          globalThis.queueMicrotask(() => {
            setConnectionSuggestions(suggestions.length ? suggestions : null);
          });
        }
        return next;
      }, intent.type === "model_system" ? "type_c_chat_model_system" : "type_c_chat_add_object", { bypassDedupe: true });

      return true;
    },
    [
      applySceneChangeSafe,
      applyTypeCScenarioStatusIntent,
      createTypeCScenarioDraft,
      createTypeCDecisionDraft,
      createTypeCExecutiveSummary,
      refreshTypeCDecisionReadiness,
      sceneJson,
      trackTypeCPipelineEvent,
      typeCDecisionDraft,
      typeCDecisionReadiness,
      typeCMode,
      typeCScenarioState,
    ]
  );

  const [loading, setLoading] = useState(false);
  const [hasUserStartedFlow, setHasUserStartedFlow] = useState(false);
  const hasUserStartedFlowRef = useRef(false);
  useEffect(() => {
    hasUserStartedFlowRef.current = hasUserStartedFlow;
  }, [hasUserStartedFlow]);
  const markUserStartedFlow = useCallback((source: string) => {
    if (hasUserStartedFlowRef.current) return;
    hasUserStartedFlowRef.current = true;
    setHasUserStartedFlow(true);
    setCenterOverlay(null);
    setCenterComponent(null);
    setCenterComponentVisible(false);
    console.log("[Nexora][EntryUX][Started]", { source });
  }, []);
  const [entryFlowState, setEntryFlowState] = useState<EntryFlowState>("idle");
  const entryFlowStateRef = useRef<EntryFlowState>("idle");
  useEffect(() => {
    entryFlowStateRef.current = entryFlowState;
  }, [entryFlowState]);
  const [showChatPipelineQA, setShowChatPipelineQA] = useState(false);
  const [chatRequestStatus, setChatRequestStatus] = useState<ChatRequestLifecycleStatus>("idle");
  /** Delayed UI busy (300ms) so fast chat replies never flash "Analyzing…". */
  const [chatDelayedBusy, setChatDelayedBusy] = useState(false);
  useEffect(() => {
    if (process.env.NODE_ENV !== "development" || typeof window === "undefined") return;
    const sync = () => {
      setShowChatPipelineQA(Boolean((window as any).__NEXORA_QA__));
    };
    sync();
    window.addEventListener("nexora:qa-toggle", sync);
    return () => window.removeEventListener("nexora:qa-toggle", sync);
  }, []);
  useEffect(() => {
    if (process.env.NODE_ENV !== "development" || typeof window === "undefined") return;
    (window as any).__NEXORA_SET_QA__ = (enabled: boolean) => {
      (window as any).__NEXORA_QA__ = Boolean(enabled);
      window.dispatchEvent(new Event("nexora:qa-toggle"));
    };
    return () => {
      if ((window as any).__NEXORA_SET_QA__) {
        delete (window as any).__NEXORA_SET_QA__;
      }
    };
  }, []);
  const [activeMode, setActiveMode] = useState<string>(activeDomainExperience.experience.preferredProductMode);
  const [activeTemplateId, setActiveTemplateId] = useState<string>("quality_protection");
  const [autoBackupEnabled, setAutoBackupEnabled] = useState<boolean>(
    process.env.NODE_ENV !== "production"
  );
  const [, setRestorePreview] = useState<null | { backup: BackupV1; lines: string[] }>(null);
  const [alert, setAlert] = useState<{ level: any; score: number; reasons: string[] } | null>(null);
  const dismissAlert = useCallback(() => setAlert(null), []);
  const chatRequestSeqRef = useRef(0);
  const latestChatPipelineRunIdRef = useRef<string | null>(null);
  const lastAppliedChatPipelineSignatureRef = useRef<string | null>(null);
  const chatPipelineDiagnosticRef = useRef<EmitChatPipelineDiagnosticFn | null>(null);
  /** QA:5 — once-only dev architecture-stable marker (no state updates). */
  const homeScreenQa5ArchitectureStableLoggedRef = useRef(false);
  const activePanelFamilyAuditRef = useRef<PanelFamilyAuditState | null>(null);
  const lastPanelFamilyAuditKeyRef = useRef<string | null>(null);
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
  const lastUpstreamUnifiedReactionSigRef = useRef<string | null>(null);
  const lastSelectionSignatureRef = useRef<string | null>(null);
  const lastRiskPropagationSignatureRef = useRef<string | null>(null);
  const lastFragilityScenePayloadSigRef = useRef<string | null>(null);
  const lastPanelAuthorityTraceSigRef = useRef<string | null>(null);
  const lastPanelCallerMigratedSigRef = useRef<string | null>(null);
  const lastPanelAuthorityAuditSigRef = useRef<string | null>(null);
  const lastPanelAuthorityResolvedSigRef = useRef<string | null>(null);
  const lastPanelMetricsSigRef = useRef<string | null>(null);
  const lastUpstreamPanelCommitSigRef = useRef<string | null>(null);
  /** Blocks invariant "re-open" after explicit user close (view may remain set). */
  const panelUserExplicitCloseRef = useRef(false);
  /** Authority instant-open lock: ignore controller state that would close/clear panel within this window. */
  const panelAuthorityLockAtRef = useRef(0);
  /** Drop competing authority intents within one interaction (e.g. object click + inferred routes). */
  const panelAuthorityRapidIntentRef = useRef(0);
  const deprecatedCallSigRef = useRef<string | null>(null);
  const panelMetricsRef = useRef({
    authorityCalls: 0,
    legacyCalls: 0,
  });
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
    delete w.__NEXORA_QA_FIXTURES__;
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
  const chatLoopGuardActiveRef = useRef(false);
  const lastChatDedupRef = useRef<{
    text: string;
    at: number;
  } | null>(null);
  const chatLoopGuardDepthRef = useRef(0);
  const loopGuardInFlightByTextRef = useRef<Map<string, number>>(new Map());
  const lastAppliedPanelEffectRef = useRef<{
    signature: string;
    at: number;
  } | null>(null);
  const lastAppliedSceneEffectRef = useRef<{
    signature: string;
    at: number;
  } | null>(null);
  const writeChatPipelineDebug = useCallback((partial: Record<string, unknown>) => {
    if (process.env.NODE_ENV === "production" || typeof window === "undefined") return;
    const w = window as Window & { __NEXORA_DEBUG__?: Record<string, unknown> };
    const prev = (w.__NEXORA_DEBUG__?.chatPipeline as Record<string, unknown> | undefined) ?? {};
    const {
      loopGuard: partialLoop,
      idempotency: partialIdem,
      selectedObjectGuard: partialSelGuard,
      explicitSelection: partialExplicitSelection,
      analyzeSelectionLock: partialAnalyzeSelectionLock,
      ...restPartial
    } = partial;
    const prevLoop =
      prev.loopGuard !== undefined && typeof prev.loopGuard === "object" && prev.loopGuard !== null
        ? { ...(prev.loopGuard as Record<string, unknown>) }
        : {};
    const mergedLoop =
      partialLoop !== undefined && typeof partialLoop === "object" && partialLoop !== null
        ? { ...prevLoop, ...(partialLoop as Record<string, unknown>) }
        : Object.keys(prevLoop).length > 0
          ? prevLoop
          : undefined;
    const prevIdem =
      prev.idempotency !== undefined && typeof prev.idempotency === "object" && prev.idempotency !== null
        ? { ...(prev.idempotency as Record<string, unknown>) }
        : {};
    const mergedIdem =
      partialIdem !== undefined && typeof partialIdem === "object" && partialIdem !== null
        ? { ...prevIdem, ...(partialIdem as Record<string, unknown>) }
        : Object.keys(prevIdem).length > 0
          ? prevIdem
          : undefined;
    const prevSelGuard =
      prev.selectedObjectGuard !== undefined &&
      typeof prev.selectedObjectGuard === "object" &&
      prev.selectedObjectGuard !== null
        ? { ...(prev.selectedObjectGuard as Record<string, unknown>) }
        : {};
    const mergedSelGuard =
      partialSelGuard !== undefined && typeof partialSelGuard === "object" && partialSelGuard !== null
        ? { ...prevSelGuard, ...(partialSelGuard as Record<string, unknown>) }
        : Object.keys(prevSelGuard).length > 0
          ? prevSelGuard
          : undefined;
    const prevExplicitSelection =
      prev.explicitSelection !== undefined &&
      typeof prev.explicitSelection === "object" &&
      prev.explicitSelection !== null
        ? { ...(prev.explicitSelection as Record<string, unknown>) }
        : {};
    const mergedExplicitSelection =
      partialExplicitSelection !== undefined &&
      typeof partialExplicitSelection === "object" &&
      partialExplicitSelection !== null
        ? { ...prevExplicitSelection, ...(partialExplicitSelection as Record<string, unknown>) }
        : Object.keys(prevExplicitSelection).length > 0
          ? prevExplicitSelection
          : undefined;
    const prevAnalyzeSelectionLock =
      prev.analyzeSelectionLock !== undefined &&
      typeof prev.analyzeSelectionLock === "object" &&
      prev.analyzeSelectionLock !== null
        ? { ...(prev.analyzeSelectionLock as Record<string, unknown>) }
        : {};
    const mergedAnalyzeSelectionLock =
      partialAnalyzeSelectionLock !== undefined &&
      typeof partialAnalyzeSelectionLock === "object" &&
      partialAnalyzeSelectionLock !== null
        ? { ...prevAnalyzeSelectionLock, ...(partialAnalyzeSelectionLock as Record<string, unknown>) }
        : Object.keys(prevAnalyzeSelectionLock).length > 0
          ? prevAnalyzeSelectionLock
          : undefined;
    w.__NEXORA_DEBUG__ = {
      ...(w.__NEXORA_DEBUG__ ?? {}),
      chatPipeline: {
        ...prev,
        ...restPartial,
        ...(mergedLoop !== undefined ? { loopGuard: mergedLoop } : {}),
        ...(mergedIdem !== undefined ? { idempotency: mergedIdem } : {}),
        ...(mergedSelGuard !== undefined ? { selectedObjectGuard: mergedSelGuard } : {}),
        ...(mergedExplicitSelection !== undefined ? { explicitSelection: mergedExplicitSelection } : {}),
        ...(mergedAnalyzeSelectionLock !== undefined ? { analyzeSelectionLock: mergedAnalyzeSelectionLock } : {}),
        updatedAt: Date.now(),
      },
    };
  }, []);
  const getAnalyzeLockedObjectId = useCallback((): string | null => {
    const lock = analyzeSelectionLockRef.current;
    if (!lock) return null;
    if (Date.now() - lock.startedAt > 8000) {
      analyzeSelectionLockRef.current = null;
      writeChatPipelineDebug({
        analyzeSelectionLock: {
          active: false,
          objectId: null,
          lastReason: "expired",
        },
      });
      return null;
    }
    return lock.objectId;
  }, [writeChatPipelineDebug]);
  function isAnalyzeLockActive(): boolean {
    return Boolean(getAnalyzeLockedObjectId());
  }
  // O3 shell: right panel state + write meta (`useRightPanelController` below). Routing stays deduped / anti-flash.
  const [rightPanelState, _setRightPanelState] = useState<RightPanelState>(() => ({
    ...createClosedRightPanelState(),
    view: mapLegacyTabToRightPanelView(activeDomainExperience.experience.preferredRightPanelTab) ?? null,
  }));
  const rightPanelWriteMetaRef = useRef<{
    writer: string;
    source: string | null;
    reason: string | null;
  } | null>(null);
  const stageRightPanelWriteMeta = useCallback(
    (meta: { writer: string; source?: string | null; reason?: string | null }) => {
      rightPanelWriteMetaRef.current = {
        writer: meta.writer,
        source: meta.source ?? null,
        reason: meta.reason ?? null,
      };
    },
    []
  );
  const setRightPanelState = useCallback(
    (action: React.SetStateAction<RightPanelState>) => {
      _setRightPanelState((prev) => {
        const next = typeof action === "function" ? (action as (p: RightPanelState) => RightPanelState)(prev) : action;
        const pendingMeta = rightPanelWriteMetaRef.current;
        const samePanelState =
          prev.view === next.view &&
          prev.isOpen === next.isOpen &&
          (prev.contextId ?? null) === (next.contextId ?? null);
        if (samePanelState) {
          rightPanelWriteMetaRef.current = null;
          return prev;
        }
        globalThis.console?.warn?.("[NEXORA_RIGHT_PANEL_WRITE]", {
          writer: pendingMeta?.writer ?? "HomeScreen.setRightPanelState",
          prevView: prev.view ?? null,
          nextView: next.view ?? null,
          contextId: next.contextId ?? null,
          source: pendingMeta?.source ?? null,
          reason: pendingMeta?.reason ?? null,
        });
        rightPanelWriteMetaRef.current = null;
        if (prev.view && !next.view) {
          return prev;
        }
        return next;
      });
    },
    []
  );
  const getRightPanelSnapshotForController = useCallback(
    () => ({
      view: rightPanelState.view ?? null,
      contextId: rightPanelState.contextId ?? null,
    }),
    [rightPanelState.view, rightPanelState.contextId]
  );
  const PANEL_SOURCE_PRIORITY_VALUE: Record<PanelSource, number> = {
    manual_user_nav: 5,
    explicit_command: 4,
    chat_intent: 3,
    object_click: 2,
    system_fallback: 1,
  };
  const activePanelAuthorityWindowRef = useRef<{
    rank: PanelSource;
    view: string | null;
    contextId: string | null;
    expiresAt: number;
    reason: PanelReason | null;
  }>({
    rank: "system_fallback",
    view: null,
    contextId: null,
    expiresAt: 0,
    reason: null,
  });
  const commitRightPanelStateFromAuthority = useCallback(
    (
      action: React.SetStateAction<RightPanelState>,
      meta: {
        writer: string;
        source?: PanelSource | string | null;
        reason?: PanelReason | string | null;
        allowExecutiveContextChange?: boolean;
      }
    ) => {
      const normalizedSource = normalizePanelSource(meta.source);
      const normalizedReason = normalizePanelReason(meta.reason);
      stageRightPanelWriteMeta({
        writer: meta.writer,
        source: normalizedSource,
        reason: normalizedReason,
      });
      setRightPanelState((prev) => {
        const resolvedNext =
          typeof action === "function"
            ? (action as (p: RightPanelState) => RightPanelState)(prev)
            : action;
        const lockedObjectId = getAnalyzeLockedObjectId();
        if (lockedObjectId) {
          const nextView = resolvedNext.view ?? null;
          const nextContextId = resolvedNext.contextId ?? null;
          const isAllowedView =
            nextView === "object" ||
            nextView === "executive_object" ||
            nextView === "object_focus";
          const sameContext = nextContextId === lockedObjectId;
          const isManual = normalizedSource === "manual_user_nav";
          if (!isManual && (!isAllowedView || !sameContext)) {
            globalThis.console?.warn?.("[Nexora][AnalyzeLock][PanelOverwriteBlocked]", {
              attemptedView: nextView,
              attemptedContextId: nextContextId,
              lockedObjectId,
              source: meta.source,
              reason: meta.reason,
            });
            writeChatPipelineDebug({
              analyzeSelectionLock: {
                active: true,
                objectId: lockedObjectId,
                lastReason: "panel_overwrite_blocked",
              },
            });
            return prev;
          }
        }
        if (entryFlowState !== "ready_for_analysis") {
          const nextView = resolvedNext.view ?? null;
          const allowedDuringEntry =
            nextView === "object" ||
            nextView === "object_focus" ||
            nextView === "workspace" ||
            nextView === "dashboard";
          if (!allowedDuringEntry) {
            globalThis.console?.debug?.("[Nexora][EntryFlow][PanelBlockedDuringEntry]", {
              entryFlowState,
              attemptedView: nextView,
              source: normalizedSource,
              reason: normalizedReason,
            });
            return prev;
          }
        }
        const now = Date.now();
        const activeWindow = activePanelAuthorityWindowRef.current;
        const nextRank = normalizedSource;
        const isActiveWindow = activeWindow.expiresAt > now;
        const nextIsLowerPriority =
          PANEL_SOURCE_PRIORITY_VALUE[nextRank] < PANEL_SOURCE_PRIORITY_VALUE[activeWindow.rank];
        const isExecutiveWindowGuarded =
          isActiveWindow &&
          activeWindow.view === "executive_object" &&
          (nextRank === "object_click" || nextRank === "system_fallback") &&
          ((resolvedNext.view ?? null) !== "executive_object" ||
            (resolvedNext.contextId ?? null) !== (activeWindow.contextId ?? null));
        const isGeneralLowerPriorityBlocked =
          isActiveWindow &&
          nextIsLowerPriority &&
          Boolean(activeWindow.view) &&
          (resolvedNext.view ?? null) !== (activeWindow.view ?? null);
        if (isExecutiveWindowGuarded || isGeneralLowerPriorityBlocked) {
          emitRightPanelDiagnosticDev(
            "panel_open_requested",
            {
              detail: "panel_priority_blocked",
              normalizedView: resolvedNext.view ?? null,
              contextId: resolvedNext.contextId ?? null,
              source: String(normalizedSource),
              reason: String(normalizedReason),
              writer: meta.writer ?? null,
            },
            JSON.stringify({
              k: "panel_priority_blocked",
              nextRank,
              nextView: resolvedNext.view ?? null,
              activeRank: activeWindow.rank,
              activeView: activeWindow.view ?? null,
            })
          );
          return prev;
        }
        const isDashboardOverrideCandidate =
          prev.view === "executive_object" &&
          resolvedNext.view === "dashboard" &&
          (resolvedNext.contextId ?? null) === null;
        if (isDashboardOverrideCandidate) {
          globalThis.console?.warn?.("[Nexora][DashboardOverrideCandidate]", {
            writer: meta.writer ?? null,
            source: meta.source ?? null,
            reason: meta.reason ?? null,
            normalizedSource,
            normalizedReason,
            prevView: prev.view ?? null,
            nextView: resolvedNext.view ?? null,
            prevContextId: prev.contextId ?? null,
            nextContextId: resolvedNext.contextId ?? null,
            activeWindow: activePanelAuthorityWindowRef.current,
            stack: new Error("Dashboard override trace").stack,
          });
        }
        if (
          prev.view === "executive_object" &&
          resolvedNext.view === "dashboard" &&
          (resolvedNext.contextId ?? null) === null &&
          normalizedSource !== "manual_user_nav"
        ) {
          emitRightPanelDiagnosticDev(
            "dashboard_spam_blocked",
            {
              detail: "override_blocked",
              writer: meta.writer ?? null,
              source: String(meta.source ?? normalizedSource),
              reason: String(meta.reason ?? normalizedReason),
              normalizedView: resolvedNext.view ?? null,
              contextId: resolvedNext.contextId ?? null,
            },
            JSON.stringify({
              k: "dashboard_override_blocked",
              prevView: prev.view ?? null,
              nextView: resolvedNext.view ?? null,
            })
          );
          return prev;
        }
        if (
          prev.view === "executive_object" &&
          resolvedNext.view === "executive_object" &&
          (prev.contextId ?? null) &&
          (resolvedNext.contextId ?? null) !== (prev.contextId ?? null) &&
          meta.allowExecutiveContextChange !== true
        ) {
          globalThis.console?.debug?.("[Nexora][ExecutiveContextPreserved]", {
            source: normalizedSource,
            writer: meta.writer,
            previousContextId: prev.contextId ?? null,
            attemptedContextId: resolvedNext.contextId ?? null,
            reason: normalizedReason,
          });
          return {
            ...resolvedNext,
            contextId: prev.contextId ?? null,
          };
        }
        if (nextRank === "manual_user_nav") {
          activePanelAuthorityWindowRef.current = {
            rank: "system_fallback",
            view: null,
            contextId: null,
            expiresAt: 0,
            reason: null,
          };
        } else if (nextRank === "explicit_command") {
          activePanelAuthorityWindowRef.current = {
            rank: nextRank,
            view: resolvedNext.view ?? null,
            contextId: resolvedNext.contextId ?? null,
            expiresAt: now + 1500,
            reason: normalizedReason,
          };
        } else if (nextRank === "chat_intent") {
          activePanelAuthorityWindowRef.current = {
            rank: nextRank,
            view: resolvedNext.view ?? null,
            contextId: resolvedNext.contextId ?? null,
            expiresAt: now + 1000,
            reason: normalizedReason,
          };
        }
        return resolvedNext;
      });
    },
    [entryFlowState, getAnalyzeLockedObjectId, setRightPanelState, stageRightPanelWriteMeta, writeChatPipelineDebug]
  );

  const lastAnalyzeRouteCommitSigRef = useRef<string | null>(null);
  const [centerComponent, setCenterComponent] = useState<CenterComponentType>(null);
  const [centerOverlay, setCenterOverlay] = useState<null | "input">(null);
  const [analysisHandoffBanner, setAnalysisHandoffBanner] = useState<{ highRisk: boolean } | null>(null);
  const analysisBannerTimerRef = useRef<number | null>(null);
  const [centerComponentVisible, setCenterComponentVisible] = useState(false);
  const centerComponentCloseTimerRef = useRef<number | null>(null);
  const lastCenterComponentCommitRef = useRef<{ component: CenterComponentType; visible: boolean }>({
    component: null,
    visible: false,
  });

  const commitCenterComponentState = useCallback(
    (next: { component?: CenterComponentType; visible?: boolean }, source: string) => {
      const current = lastCenterComponentCommitRef.current;
      const nextComponent = next.component === undefined ? current.component : next.component;
      const nextVisible = next.visible === undefined ? current.visible : next.visible;
      if (current.component === nextComponent && current.visible === nextVisible) {
        return;
      }
      lastCenterComponentCommitRef.current = {
        component: nextComponent,
        visible: nextVisible,
      };
      if (next.component !== undefined) {
        setCenterComponent((prev) => (prev === nextComponent ? prev : nextComponent));
      }
      if (next.visible !== undefined) {
        setCenterComponentVisible((prev) => (prev === nextVisible ? prev : nextVisible));
      }
      if (process.env.NODE_ENV !== "production") {
        globalThis.console?.log?.("[Nexora][CenterComponent][commit]", {
          source,
          component: nextComponent,
          visible: nextVisible,
        });
      }
    },
    []
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onOpenInputCenter = () => {
      setCenterOverlay("input");
    };
    window.addEventListener("nexora:open-input-center", onOpenInputCenter as EventListener);
    return () => window.removeEventListener("nexora:open-input-center", onOpenInputCenter as EventListener);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
      new CustomEvent("nexora:input-center-visibility", {
        detail: { open: centerOverlay === "input" },
      })
    );
  }, [centerOverlay]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onAnalysisComplete = (event: Event) => {
      const d = (event as CustomEvent<{ ok?: boolean; source?: string; riskLevel?: string | null }>).detail;
      if (!d?.ok || d.source !== "input_center") return;
      if (analysisBannerTimerRef.current) {
        window.clearTimeout(analysisBannerTimerRef.current);
        analysisBannerTimerRef.current = null;
      }
      const rl = String(d.riskLevel ?? "").toLowerCase();
      const highRisk = /high|critical|severe/.test(rl);
      setAnalysisHandoffBanner({ highRisk });
      analysisBannerTimerRef.current = window.setTimeout(() => {
        analysisBannerTimerRef.current = null;
        setAnalysisHandoffBanner(null);
      }, 2500);
    };
    window.addEventListener("nexora:analysis-complete", onAnalysisComplete as EventListener);
    return () => {
      window.removeEventListener("nexora:analysis-complete", onAnalysisComplete as EventListener);
      if (analysisBannerTimerRef.current) {
        window.clearTimeout(analysisBannerTimerRef.current);
        analysisBannerTimerRef.current = null;
      }
    };
  }, []);

  /** B.27 — after pilot demo ingestion, open compare once pipeline reaches ready. */
  const openCompareAfterPipelineReadyRef = useRef(false);
  /** B.28 — pilot metrics edge detection. */
  const prevPipelineStatusForMetricRef = useRef<NexoraPipelineStatusUi["status"] | null>(null);
  const prevCompareOpenForMetricRef = useRef(false);
  const lastDecisionRunIdForMetricRef = useRef<string | null>(null);
  const [objectSelection, _setObjectSelection] = useState<any | null>(null);
  const setObjectSelection = useCallback(
    (nextOrUpdater: any | null | ((prev: any | null) => any | null)) => {
      _setObjectSelection((prev: any | null) => {
        const next = typeof nextOrUpdater === "function" ? nextOrUpdater(prev) : nextOrUpdater;
        const highlighted = getHighlightedObjectIdsFromSelection(next);
        if (next == null || highlighted.length === 0) {
          return prev;
        }
        const semanticSig = JSON.stringify(next ?? null);
        const allowed = traceSceneWrite({
          source: "selection",
          semanticSig,
          context: { writer: "HomeScreen.setObjectSelection" },
        });
        writeChatPipelineDebug({
          sceneWrite: {
            source: "selection",
            semanticSig,
            blocked: !allowed,
          },
        });
        return allowed ? next : prev;
      });
    },
    [writeChatPipelineDebug]
  );
  const setSelectedObjectIdState = useCallback(
    (nextOrUpdater: string | null | ((prev: string | null) => string | null)) => {
      _setSelectedObjectIdState((prev) => {
        const next = typeof nextOrUpdater === "function" ? nextOrUpdater(prev) : nextOrUpdater;
        if (next == null) {
          return prev;
        }
        const semanticSig = JSON.stringify({ selectedId: next ?? null });
        const allowed = traceSceneWrite({
          source: "selection",
          semanticSig,
          context: { writer: "HomeScreen.setSelectedObjectIdState" },
        });
        writeChatPipelineDebug({
          sceneWrite: {
            source: "selection",
            semanticSig,
            blocked: !allowed,
          },
        });
        return allowed ? next : prev;
      });
    },
    [writeChatPipelineDebug]
  );
  const inspectorOpen = rightPanelState.isOpen;
  const highlightedObjectIds = useMemo(() => {
    const selectedHighlights = getHighlightedObjectIdsFromSelection(objectSelection);
    if (selectedHighlights.length > 0) return selectedHighlights;
    const sceneSelection = asRecord(sceneJson)?.object_selection;
    const sceneHighlights = getHighlightedObjectIdsFromSelection(sceneSelection);
    if (sceneHighlights.length > 0) return sceneHighlights;
    return [] as string[];
  }, [objectSelection, sceneJson]);
  const highlightedObjectIdsSig = useMemo(
    () => [...highlightedObjectIds].sort((a, b) => a.localeCompare(b)).join("|"),
    [highlightedObjectIds]
  );
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
  const [leftCommandPanelOpen, setLeftCommandPanelOpen] = useState(true);
  const [leftCommandPortalHost, setLeftCommandPortalHost] = useState<HTMLElement | null>(null);
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
  // --- Right panel controller ---
  // O3 complete: `useRightPanelController` owns open/close/authority orchestration.
  const rightPanelController = useRightPanelController({
    activePanelId: rightPanelState.view ?? null,
    activePanelView: rightPanelState.view ?? null,
    selectedObjectId: selectedObjectIdState,
    focusedObjectId: focusedId,
    rightPanelIsOpen: rightPanelState.isOpen,
    getRightPanelSnapshot: getRightPanelSnapshotForController,
    panelAuthorityOpenBridgeRef,
    panelAuthorityCloseBridgeRef,
    clearClickIntentLock,
    traceRightPanelPathAudit,
    traceRightPanelStateMutation,
    lastRightPanelChangeSourceRef,
    bridgeRefs: rightPanelBridgeRefs,
  });
  const { closeRightPanel, openRightPanel } = rightPanelController.callbacks;
  const applyPanelControllerRequest = useCallback(
    (request: PanelRequestIntent & { source: PanelOpenSource; rawSource?: string | null }) => {
      const panelRequestDedupeKey = JSON.stringify({
        rv: request.requestedView ?? null,
        cid: request.contextId ?? null,
        src: request.source,
        cls: Boolean(request.close),
        rsrc: request.rawSource ?? null,
        cv: rightPanelState.view ?? null,
        cci: rightPanelState.contextId ?? null,
        co: rightPanelState.isOpen,
      });
      if (rightPanelController.refs.lastPanelRequestSigRef.current === panelRequestDedupeKey) {
        return;
      }

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

      const shouldBlockStaleObjectClickOverride =
        rightPanelState.view === "executive_object" &&
        resolvedView === "object" &&
        rawSource.includes("object_click:interaction_controller") &&
        now < passiveDeselectGuardUntilRef.current;
      const shouldBlockLatePlainObjectClickOverride =
        rightPanelState.view === "executive_object" &&
        resolvedView === "object" &&
        request.source === "object_click" &&
        now < passiveDeselectGuardUntilRef.current;
      if (shouldBlockStaleObjectClickOverride || shouldBlockLatePlainObjectClickOverride) {
        emitRightPanelDiagnosticDev(
          "panel_flash_blocked",
          {
            writer: "HomeScreen.applyPanelControllerRequest",
            prevView: rightPanelState.view ?? null,
            nextView: resolvedView ?? null,
            normalizedView: rightPanelState.view ?? null,
            contextId: nextContextId,
            source: rawSource,
            skippedReason: shouldBlockStaleObjectClickOverride
              ? "stale_object_click_within_analyze_guard_window"
              : "late_plain_object_click_within_analyze_guard_window",
            detail: JSON.stringify({
              guardUntil: passiveDeselectGuardUntilRef.current,
              now,
            }),
            activePanelId: rightPanelState.view ?? null,
          },
          `exec_override_apply:${rawSource}:${String(resolvedView ?? "")}`
        );
        logBlocked("executive_object_stale_object_click_blocked", {
          guardUntil: passiveDeselectGuardUntilRef.current,
        });
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
      const lockedAnalyzeId = getAnalyzeLockedObjectId();
      if (lockedAnalyzeId && decision.nextState) {
        const nextView = decision.nextState.view ?? null;
        const nextCtx = decision.nextState.contextId ?? null;
        const isAllowed =
          (nextView === "object" ||
            nextView === "executive_object" ||
            nextView === "object_focus") &&
          nextCtx === lockedAnalyzeId;
        const isManual = normalizePanelSource(rawSource) === "manual_user_nav";
        if (!isManual && !isAllowed) {
          globalThis.console?.warn?.("[Nexora][AnalyzeLock][ControllerRequestBlocked]", {
            requestedView: nextView,
            requestedContextId: nextCtx,
            lockedObjectId: lockedAnalyzeId,
            source: request.source,
            rawSource,
          });
          return;
        }
      }
      const panelSig = JSON.stringify({
        view: decision.nextState.view ?? null,
        contextId: decision.nextState.contextId ?? null,
      });
      if (lastUpstreamPanelCommitSigRef.current === panelSig) {
        emitRightPanelDiagnosticDev(
          "panel_open_requested",
          {
            detail: "upstream_dedupe_same_sig",
            signature: panelSig,
            activePanelId: rightPanelState.view ?? null,
          },
          `upstream_sig:${panelSig}`
        );
        return;
      }
      if (
        rightPanelState.view === (decision.nextState.view ?? null) &&
        (rightPanelState.contextId ?? null) === (decision.nextState.contextId ?? null) &&
        rightPanelState.isOpen === decision.nextState.isOpen
      ) {
        emitRightPanelDiagnosticDev(
          "panel_open_requested",
          {
            detail: "upstream_dedupe_same_state",
            signature: panelSig,
            normalizedView: decision.nextState.view ?? null,
            contextId: decision.nextState.contextId ?? null,
            activePanelId: rightPanelState.view ?? null,
          },
          `upstream_state:${panelSig}`
        );
        return;
      }
      lastUpstreamPanelCommitSigRef.current = panelSig;
      commitRightPanelStateFromAuthority(
        (prev) => {
          const next = decision.nextState;
          const PANEL_AUTHORITY_LOCK_MS = 120;
          const lockAt = panelAuthorityLockAtRef.current;
          if (lockAt > 0) {
            const lockAge = Date.now() - lockAt;
            if (lockAge >= 0 && lockAge < PANEL_AUTHORITY_LOCK_MS) {
              if (!next.isOpen && prev.view != null) {
                return prev;
              }
              if (next.isOpen && !next.view && prev.view != null) {
                return prev;
              }
            }
          }
          if (NEXORA_PANEL_DEPRECATION_DEBUG) {
            console.warn("[Nexora][PanelDirectStateWrite]", {
              view: next.view ?? null,
              isOpen: next.isOpen,
              source: "applyPanelControllerRequest",
            });
          }
          if (
            prev.view === next.view &&
            prev.contextId === next.contextId &&
            prev.isOpen === next.isOpen
          ) {
            return prev; // prevent unnecessary re-render loop
          }
          rightPanelController.refs.lastPanelRequestSigRef.current = panelRequestDedupeKey;
          return next;
        },
        {
          writer: "HomeScreen.applyPanelControllerRequest",
          source: rawSource,
          reason: decision.reason,
        }
      );
      return decision;
    },
    [
      clearClickIntentLock,
      debugPanelLockState,
      highlightedObjectIds,
      rightPanelState.contextId,
      rightPanelState.isOpen,
      rightPanelState.view,
      selectedObjectIdState,
      traceClickState,
      traceDirectPanelOpen,
      traceLegacySyncBlocked,
      traceRightPanelPathAudit,
      traceRightPanelStateMutation,
      commitRightPanelStateFromAuthority,
      getAnalyzeLockedObjectId,
      rightPanelController.refs,
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
  const logDeprecatedPanelPath = useCallback((tag: string, payload: Record<string, unknown>) => {
    if (!NEXORA_PANEL_DEPRECATION_DEBUG) return;
    const sig = JSON.stringify({ tag, ...payload });
    if (deprecatedCallSigRef.current === sig) return;
    deprecatedCallSigRef.current = sig;
    panelMetricsRef.current.legacyCalls += 1;
    console.warn("[Nexora][PanelDeprecatedPath]", { tag, ...payload });
    const metricsSig = JSON.stringify(panelMetricsRef.current);
    if (metricsSig !== lastPanelMetricsSigRef.current) {
      lastPanelMetricsSigRef.current = metricsSig;
      console.log("[Nexora][PanelMetrics]", panelMetricsRef.current);
    }
  }, []);
  type NexoraPanelAuthoritySource =
    | "left_nav"
    | "manual_user_nav"
    | "sub_button"
    | "tab_click"
    | "chat"
    | "scene"
    | "object_click"
    | "analyze_object"
    | "system"
    | "legacy_event"
    /** Strategic Command center panel — routes must stay in EXE decision layer (see handleStrategicCommandFullRouteView). */
    | "strategic_command"
    /** Compare / timeline / strategic center workbench — context merge + EXE guards in requestPanelAuthorityOpen. */
    | "component_panel"
    /** Executive rail preview CTAs — must not fall back to scene/dashboard. */
    | "exe_preview"
    | "dashboard_preview"
    | "decision_strip";
  type NexoraPanelAuthorityRequest = {
    view: string;
    family?: "EXE" | "SCN" | "SIM" | "RSK";
    source: NexoraPanelAuthoritySource;
    contextId?: string | null;
    reason?: string;
    forceOpen?: boolean;
  };
  const rightPanelRouteLockRef = useRef<{
    view: RightPanelView;
    contextId: string | null;
    reason: string | null;
  }>({ view: null, contextId: null, reason: null });
  const passiveDeselectGuardUntilRef = useRef<number>(0);
  const traceAnalyzeObjectRoute = useCallback(
    (detail: {
      stage:
        | "analyze_success_before_route"
        | "requestPanelAuthorityOpen_called"
        | "after_state_commit";
      requestedView?: string | null;
      resolvedView?: string | null;
      family?: string | null;
      contextId?: string | null;
      rightPanelView?: RightPanelView | null;
    }) => {
      if (process.env.NODE_ENV === "production") return;
      globalThis.console?.debug?.("[Nexora][AnalyzeObjectRouteTrace]", {
        stage: detail.stage,
        requestedView: detail.requestedView ?? null,
        resolvedView: detail.resolvedView ?? null,
        family: detail.family ?? null,
        contextId: detail.contextId ?? null,
        selectedObjectIdState: selectedObjectIdState ?? null,
        focusedId: focusedId ?? null,
        rightPanelView: detail.rightPanelView ?? rightPanelState.view ?? null,
      });
    },
    [focusedId, rightPanelState.view, selectedObjectIdState]
  );
  const requestPanelAuthorityOpen = useCallback(
    (request: NexoraPanelAuthorityRequest) => {
      const requestedRawView = String(request.view ?? "").trim().toLowerCase();
      const hasContextId =
        typeof request.contextId === "string" ? request.contextId.trim().length > 0 : Boolean(request.contextId);
      if (isAnalyzeLockActive() && request.source !== "manual_user_nav") {
        const lockedObjectId = getAnalyzeLockedObjectId();
        if (lockedObjectId && (requestedRawView === "workspace" || !hasContextId)) {
          globalThis.console?.warn?.("[Nexora][AnalyzeLock][WorkspaceBlocked]", {
            request,
            lockedObjectId,
          });
          writeChatPipelineDebug({
            analyzeSelectionLock: {
              active: true,
              objectId: lockedObjectId,
              lastReason: "workspace_or_null_context_blocked",
            },
          });
          return;
        }
      }
      let normalizedRequest: NexoraPanelAuthorityRequest =
        request.source === "object_click" && requestedRawView !== "executive_object"
          ? {
              ...request,
              family: "SCN",
              view: "object",
            }
          : request;

      const mergeCenterPanelContext = (incoming: string | null | undefined): string | null => {
        const inc = typeof incoming === "string" ? incoming.trim() : "";
        if (inc) return inc;
        const rp =
          typeof rightPanelState.contextId === "string" ? rightPanelState.contextId.trim() : "";
        if (rp) return rp;
        const sel =
          typeof selectedObjectIdState === "string" ? selectedObjectIdState.trim() : "";
        if (sel) return sel;
        const fid = typeof focusedId === "string" ? focusedId.trim() : "";
        return fid || null;
      };

      const guardedNoDashboardFallbackSources: NexoraPanelAuthoritySource[] = [
        "component_panel",
        "strategic_command",
        "exe_preview",
        "dashboard_preview",
        "decision_strip",
      ];
      const centerWorkbenchSource = guardedNoDashboardFallbackSources.includes(normalizedRequest.source);

      if (centerWorkbenchSource) {
        const mergedCtx = mergeCenterPanelContext(normalizedRequest.contextId);
        normalizedRequest = {
          ...normalizedRequest,
          contextId: mergedCtx,
        };

        if (process.env.NODE_ENV !== "production") {
          globalThis.console?.debug?.("[Nexora][ComponentPanelRoute]", {
            requestedView: normalizedRequest.view,
            family: normalizedRequest.family ?? null,
            contextId: mergedCtx,
            reason: normalizedRequest.reason ?? null,
            source: normalizedRequest.source,
          });
        }

        let probe = String(normalizedRequest.view ?? "").trim().toLowerCase();

        const remapToExecutiveObject = (blocked: string, tag: string) => {
          if (process.env.NODE_ENV !== "production") {
            globalThis.console?.warn?.("[Nexora][ComponentPanelRouteBlocked]", {
              blocked,
              remappedTo: "executive_object",
              contextId: mergedCtx,
              requestedView: probe,
              source: normalizedRequest.source,
            });
          }
          normalizedRequest = {
            ...normalizedRequest,
            view: "executive_object",
            family: "EXE",
            contextId: mergedCtx,
            reason: `${normalizedRequest.reason ?? "open"}:${tag}`,
          };
          probe = "executive_object";
        };

        if (probe === "dashboard" && normalizedRequest.source !== "manual_user_nav") {
          if (!mergedCtx) {
            if (process.env.NODE_ENV !== "production") {
              globalThis.console?.warn?.("[Nexora][ComponentPanelRouteBlocked]", {
                blocked: "dashboard_without_resolvable_context",
                contextId: null,
                requestedView: "dashboard",
                source: normalizedRequest.source,
              });
            }
            return;
          }
          remapToExecutiveObject("dashboard_from_center_workbench", "center_dashboard_to_exe");
        } else if (probe === "workspace" || probe === "object" || probe === "object_focus") {
          remapToExecutiveObject("scn_from_center_workbench", "center_scn_to_exe");
        }
      }

      const routedIntentMatch = /^intent_route:([^:]+)/.exec(String(normalizedRequest.reason ?? ""));
      const routedIntent = (routedIntentMatch?.[1] ?? null) as NexoraIntent | null;
      if (routedIntent) {
        const intentTarget = resolveIntentToPanel(routedIntent);
        const expectedFamily = expectedFamilyForIntent(routedIntent);
        if (intentTarget.type === "center") {
          globalThis.console?.error?.("[Nexora][InvalidRoutingState]", {
            intent: routedIntent,
            contextId: normalizedRequest.contextId ?? null,
            source: normalizedRequest.source,
            reason: "center_intent_reached_right_panel_authority",
          });
          return;
        }
        if (
          normalizedRequest.source !== "manual_user_nav" &&
          routedIntent !== "unknown_intent" &&
          intentTarget.family !== expectedFamily
        ) {
          globalThis.console?.error?.("[Nexora][CrossFamilyDriftBlocked]", {
            intent: routedIntent,
            targetFamily: intentTarget.family,
            expectedFamily,
            source: normalizedRequest.source,
          });
          return;
        }
      }

      const rawView = String(normalizedRequest.view ?? "").trim().toLowerCase();
      if (!rawView) return;
      lastPanelAuthorityReasonRef.current = normalizedRequest.reason ?? null;

      const rapidNow = Date.now();
      if (rapidNow - panelAuthorityRapidIntentRef.current < 150) {
        return;
      }
      panelAuthorityRapidIntentRef.current = rapidNow;

      panelUserExplicitCloseRef.current = false;
      panelAuthorityLockAtRef.current = Date.now();
      const normalized = normalizeRawAuthorityPanelView(rawView);
      const normalizedView = normalized.view;

      const sourceForRequest: PanelOpenSource =
        normalizedRequest.source === "legacy_event"
          ? "legacy_alias"
          : normalizedRequest.source === "left_nav" || normalizedRequest.source === "manual_user_nav"
            ? "left_nav"
            : normalizedRequest.source === "sub_button" ||
                normalizedRequest.source === "tab_click" ||
                normalizedRequest.source === "strategic_command" ||
                normalizedRequest.source === "component_panel" ||
                normalizedRequest.source === "exe_preview" ||
                normalizedRequest.source === "dashboard_preview" ||
                normalizedRequest.source === "decision_strip"
              ? "cta"
              : normalizedRequest.source === "system" || normalizedRequest.source === "analyze_object"
                ? "action_intent"
                : normalizedRequest.source === "chat"
                  ? "action_intent"
                  : normalizedRequest.source === "object_click"
                    ? "object_click"
                  : normalizedRequest.source === "scene"
                    ? "direct_open"
                    : "unknown";
      const isExplicitUserPanelNavigation =
        normalizedRequest.source === "left_nav" ||
        normalizedRequest.source === "manual_user_nav" ||
        normalizedRequest.source === "tab_click" ||
        normalizedRequest.source === "object_click";
      const isManualOverrideSource =
        normalizedRequest.source === "left_nav" ||
        normalizedRequest.source === "manual_user_nav" ||
        normalizedRequest.source === "object_click" ||
        normalizedRequest.source === "scene" ||
        normalizedRequest.source === "tab_click";
      const rawSource = `panel_authority:${normalizedRequest.source}:${normalizedRequest.reason ?? "open"}`;
      const FAST_SOURCES: NexoraPanelAuthoritySource[] = [
        "left_nav",
        "manual_user_nav",
        "chat",
        "object_click",
        "tab_click",
        "strategic_command",
        "component_panel",
        "exe_preview",
        "dashboard_preview",
        "decision_strip",
      ];
      const shouldForceOpen =
        normalizedRequest.forceOpen === true ||
        FAST_SOURCES.includes(normalizedRequest.source) ||
        [
          "sub_button",
          "system",
          "strategic_command",
          "component_panel",
          "exe_preview",
          "dashboard_preview",
          "decision_strip",
        ].includes(normalizedRequest.source);
      const openIntentSig = JSON.stringify({
        view: normalizedView ?? null,
        contextId: normalizedRequest.contextId ?? null,
      });
      if (normalizedRequest.source === "analyze_object") {
        traceAnalyzeObjectRoute({
          stage: "requestPanelAuthorityOpen_called",
          requestedView: request.view ?? null,
          resolvedView: normalizedView ?? null,
          family: normalizedRequest.family ?? null,
          contextId: normalizedRequest.contextId ?? null,
        });
      }
      if (
        rightPanelController.refs.lastOpenIntentRef.current === openIntentSig &&
        rightPanelState.isOpen === true &&
        rightPanelState.view === normalizedView &&
        (rightPanelState.contextId ?? null) === (normalizedRequest.contextId ?? null)
      ) {
        return;
      }
      rightPanelController.refs.lastOpenIntentRef.current = openIntentSig;

      emitRightPanelDiagnosticDev("panel_open_committed", {
        source: String(normalizedRequest.source),
        requested: request.view ?? null,
        requestedView: request.view ?? null,
        final: normalizedView ?? null,
        normalizedView,
        writer: "HomeScreen.requestPanelAuthorityOpen",
        family: normalizedRequest.family ?? null,
        contextId: normalizedRequest.contextId ?? null,
        reason: normalizedRequest.reason ?? "open",
        signature: openIntentSig,
        activePanelId: rightPanelState.view ?? null,
      });
      const nowForObjectClickGuard = Date.now();
      const shouldBlockLatePlainObjectClickOverride =
        rightPanelState.view === "executive_object" &&
        normalizedView === "object" &&
        normalizedRequest.source === "object_click" &&
        nowForObjectClickGuard < passiveDeselectGuardUntilRef.current;
      if (shouldBlockLatePlainObjectClickOverride) {
        emitRightPanelDiagnosticDev(
          "panel_flash_blocked",
          {
            writer: "requestPanelAuthorityOpen",
            prevView: rightPanelState.view ?? null,
            nextView: normalizedView ?? null,
            normalizedView: rightPanelState.view ?? null,
            skippedReason: "late_plain_object_click_within_analyze_guard_window",
            contextId: normalizedRequest.contextId ?? null,
            source: String(normalizedRequest.source),
            reason: String(normalizedRequest.reason ?? "open"),
            detail: JSON.stringify({
              guardUntil: passiveDeselectGuardUntilRef.current,
              now: nowForObjectClickGuard,
            }),
            activePanelId: rightPanelState.view ?? null,
          },
          `exec_override_req:${openIntentSig}`
        );
        return;
      }

      if (NEXORA_PANEL_DEPRECATION_DEBUG) {
        console.log("[Nexora][PanelInstantOpenRedirectedToController]", {
          source: normalizedRequest.source,
          view: normalizedView,
          contextId: normalizedRequest.contextId ?? null,
        });
      }
      if (process.env.NODE_ENV !== "production") {
        const sig = JSON.stringify({
          s: normalizedRequest.source,
          f: normalizedRequest.family ?? null,
          v: normalizedView,
          c: normalizedRequest.contextId ?? null,
          fo: shouldForceOpen,
          po: rightPanelState?.isOpen ?? null,
        });
        if (sig !== lastPanelAuthorityTraceSigRef.current) {
          lastPanelAuthorityTraceSigRef.current = sig;
          emitRightPanelDiagnosticDev(
            "panel_open_requested",
            {
              detail: "panel_authority_trace",
              source: String(normalizedRequest.source),
              family: normalizedRequest.family ?? null,
              view: normalizedView,
              normalizedView,
              contextId: normalizedRequest.contextId ?? null,
              reason: String(normalizedRequest.reason ?? "open"),
              skippedReason: null,
              activePanelId: rightPanelState.view ?? null,
            },
            sig
          );
        }
        const migratedSig = JSON.stringify({
          source: normalizedRequest.source,
          family: normalizedRequest.family ?? null,
          view: normalizedView,
          reason: normalizedRequest.reason ?? "open",
        });
        if (migratedSig !== lastPanelCallerMigratedSigRef.current) {
          lastPanelCallerMigratedSigRef.current = migratedSig;
          emitRightPanelDiagnosticDev(
            "panel_open_requested",
            {
              detail: "panel_caller_migrated",
              source: String(normalizedRequest.source),
              family: normalizedRequest.family ?? null,
              view: normalizedView,
              normalizedView,
              reason: normalizedRequest.reason ?? "open",
              activePanelId: rightPanelState.view ?? null,
            },
            migratedSig
          );
        }
        const auditPayload = {
          source: normalizedRequest.source,
          family: normalizedRequest.family ?? null,
          requestedView: rawView,
          canonicalView: normalizedView ?? null,
          legacyTab: normalized.legacyTab ?? null,
          contextId: normalizedRequest.contextId ?? null,
          forceOpen: shouldForceOpen,
          previousOpen: rightPanelState?.isOpen ?? null,
          nextExpectedOpen: true,
          reason: normalizedRequest.reason ?? "open",
        };
        const auditSig = JSON.stringify(auditPayload);
        if (auditSig !== lastPanelAuthorityAuditSigRef.current) {
          lastPanelAuthorityAuditSigRef.current = auditSig;
          emitRightPanelDiagnosticDev(
            "panel_open_requested",
            {
              detail: "panel_authority_audit",
              source: String(auditPayload.source),
              family: auditPayload.family ?? null,
              requestedView: auditPayload.requestedView ?? null,
              normalizedView: auditPayload.canonicalView ?? null,
              reason: String(auditPayload.reason ?? "open"),
              skippedReason: null,
              contextId: auditPayload.contextId ?? null,
              activePanelId: rightPanelState.view ?? null,
            },
            auditSig
          );
        }
      }
      requestRightPanelOpen({
        view: normalizedView,
        source: sourceForRequest,
        rawSource,
        contextId: normalizedRequest.contextId ?? null,
        legacyTab: normalized.legacyTab,
        preserveIfSameContext: shouldForceOpen ? false : undefined,
      });
      if (normalizedRequest.source === "chat") {
        const hintText = (() => {
          switch (normalized.view) {
            case "risk":
            case "fragility":
              return "→ Opening Risk Analysis";
            case "advice":
              return "→ Opening Recommendation";
            case "dashboard":
              return "→ Opening Executive Overview";
            case "executive_object":
              return "→ Opening executive insight";
            case "conflict":
              return "→ Opening Conflict Map";
            case "timeline":
              return "→ Opening Timeline";
            case "war_room":
              return "→ Opening War Room";
            default:
              return null;
          }
        })();
        if (typeof window !== "undefined" && hintText) {
          window.dispatchEvent(new CustomEvent("nexora:panel-open-hint", { detail: { text: hintText } }));
        }
      }
      if (NEXORA_PANEL_DEPRECATION_DEBUG) {
        panelMetricsRef.current.authorityCalls += 1;
        const resolvedPayload = {
          source: normalizedRequest.source,
          family: normalizedRequest.family ?? null,
          requestedView: rawView,
          canonicalView: normalizedView,
          contextId: normalizedRequest.contextId ?? null,
          forceOpen: shouldForceOpen,
          isOpen: true,
        };
        const resolvedSig = JSON.stringify(resolvedPayload);
        if (resolvedSig !== lastPanelAuthorityResolvedSigRef.current) {
          lastPanelAuthorityResolvedSigRef.current = resolvedSig;
          console.log("[Nexora][PanelAuthorityResolved]", resolvedPayload);
        }
      }
      // Deprecated bypass removed: visibility guard now relies on canonical controller open path only.
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("nexora:right-panel-authority-opened", {
            detail: {
              family: normalizedRequest.family ?? null,
              view: normalized.view,
              source: normalizedRequest.source,
              contextId: normalizedRequest.contextId ?? null,
              isOpen: true,
            },
          })
        );
      }
    },
    [
      focusedId,
      getAnalyzeLockedObjectId,
      requestRightPanelOpen,
      rightPanelState.contextId,
      rightPanelState.isOpen,
      rightPanelState.view,
      selectedObjectIdState,
      traceAnalyzeObjectRoute,
      writeChatPipelineDebug,
      rightPanelController.refs,
    ]
  );
  panelAuthorityOpenBridgeRef.current = requestPanelAuthorityOpen as unknown as RequestPanelAuthorityOpenFn;
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (rightPanelRouteLockRef.current.view !== "executive_object") return;
    const sig = JSON.stringify({
      view: rightPanelState.view ?? null,
      contextId: rightPanelState.contextId ?? null,
      selectedObjectIdState: selectedObjectIdState ?? null,
      focusedId: focusedId ?? null,
      lockedContextId: rightPanelRouteLockRef.current.contextId,
    });
    if (lastAnalyzeRouteCommitSigRef.current === sig) return;
    lastAnalyzeRouteCommitSigRef.current = sig;
    traceAnalyzeObjectRoute({
      stage: "after_state_commit",
      requestedView: "executive_object",
      resolvedView: rightPanelState.view ?? null,
      family: rightPanelState.view === "executive_object" ? "EXE" : null,
      contextId: rightPanelState.contextId ?? null,
      rightPanelView: rightPanelState.view ?? null,
    });
  }, [focusedId, rightPanelState.contextId, rightPanelState.view, selectedObjectIdState, traceAnalyzeObjectRoute]);
  const openExePanel = useCallback(
    (
      view: string,
      reason: string,
      contextId?: string | null,
      opts?: { source?: NexoraPanelAuthoritySource }
    ) => {
      const src = opts?.source ?? "sub_button";
      requestPanelAuthorityOpen({
        source: src,
        family: "EXE",
        view: String(view ?? ""),
        contextId: contextId ?? null,
        forceOpen: true,
        reason: src === "component_panel" ? `${reason}:strategic_command_action` : reason,
      });
    },
    [requestPanelAuthorityOpen]
  );
  const openScnPanel = useCallback(
    (view: string, contextId: string | null, reason: string) => {
      requestPanelAuthorityOpen({
        source: "sub_button",
        family: "SCN",
        view: String(view ?? ""),
        contextId,
        forceOpen: true,
        reason,
      });
    },
    [requestPanelAuthorityOpen]
  );
  const openSimPanel = useCallback(
    (
      view: string,
      reason: string,
      contextId?: string | null,
      opts?: { source?: NexoraPanelAuthoritySource }
    ) => {
      const src = opts?.source ?? "sub_button";
      requestPanelAuthorityOpen({
        source: src,
        family: "SIM",
        view: String(view ?? ""),
        contextId: contextId ?? null,
        forceOpen: true,
        reason: src === "component_panel" ? `${reason}:strategic_command_action` : reason,
      });
    },
    [requestPanelAuthorityOpen]
  );
  useRightPanelControllerBridgeWiring({ bridgeRefs: rightPanelBridgeRefs, openSimPanel });
  const openRskPanel = useCallback(
    (
      view: string,
      reason: string,
      contextId?: string | null,
      opts?: { source?: NexoraPanelAuthoritySource }
    ) => {
      const src = opts?.source ?? "sub_button";
      requestPanelAuthorityOpen({
        source: src,
        family: "RSK",
        view: String(view ?? ""),
        contextId: contextId ?? null,
        forceOpen: true,
        reason: src === "component_panel" ? `${reason}:strategic_command_action` : reason,
      });
    },
    [requestPanelAuthorityOpen]
  );
  const requestPanelAuthorityClose = useCallback((reason?: string) => {
    panelUserExplicitCloseRef.current = true;
    panelAuthorityLockAtRef.current = 0;
    applyPanelControllerRequest({
      requestedView: null,
      close: true,
      source: "direct_open",
      rawSource: "authority_close",
      contextId: rightPanelState.contextId ?? null,
    });
    if (NEXORA_PANEL_DEPRECATION_DEBUG) {
      console.log("[Nexora][PanelAuthorityClosed]", { reason: reason ?? "unspecified" });
    }
  }, [applyPanelControllerRequest, rightPanelState.contextId]);
  panelAuthorityCloseBridgeRef.current = requestPanelAuthorityClose;

  const openCenterComponent = useCallback((component: Exclude<CenterComponentType, null>) => {
    if (centerComponentCloseTimerRef.current != null) {
      window.clearTimeout(centerComponentCloseTimerRef.current);
      centerComponentCloseTimerRef.current = null;
    }
    commitCenterComponentState({ component, visible: true }, "openCenterComponent");
  }, [commitCenterComponentState]);

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
      if (result.execution === "open_center_strategic_command_full") {
        openCenterComponent("strategic_command_full");
        traceActionRouterExecuted(action, {
          execution: result.execution,
          outcome: "center_strategic_command_full_opened",
        });
        return;
      }
      if (result.execution === "open_center_team_decision") {
        openCenterComponent("team_decision");
        traceActionRouterExecuted(action, { execution: result.execution, outcome: "center_team_decision_opened" });
        return;
      }
      if (result.execution === "open_center_decision_council") {
        openCenterComponent("decision_council");
        traceActionRouterExecuted(action, { execution: result.execution, outcome: "center_decision_council_opened" });
        return;
      }
      if (result.execution === "open_center_org_memory") {
        openCenterComponent("org_memory");
        traceActionRouterExecuted(action, { execution: result.execution, outcome: "center_org_memory_opened" });
        return;
      }
      if (result.execution === "open_center_decision_policy") {
        openCenterComponent("decision_policy");
        traceActionRouterExecuted(action, { execution: result.execution, outcome: "center_decision_policy_opened" });
        return;
      }
      if (result.execution === "open_center_executive_approval") {
        openCenterComponent("executive_approval");
        traceActionRouterExecuted(action, { execution: result.execution, outcome: "center_executive_approval_opened" });
        return;
      }
      if (result.execution === "open_center_decision_governance") {
        openCenterComponent("decision_governance");
        traceActionRouterExecuted(action, {
          execution: result.execution,
          outcome: "center_decision_governance_opened",
        });
        return;
      }
      if (result.execution === "open_center_confidence_calibration") {
        openCenterComponent("confidence_calibration");
        traceActionRouterExecuted(action, {
          execution: result.execution,
          outcome: "center_confidence_calibration_opened",
        });
        return;
      }
      if (result.execution === "open_center_pattern_intelligence") {
        openCenterComponent("pattern_intelligence");
        traceActionRouterExecuted(action, { execution: result.execution, outcome: "center_pattern_intelligence_opened" });
        return;
      }
      if (result.execution === "open_center_strategic_learning") {
        openCenterComponent("strategic_learning");
        traceActionRouterExecuted(action, { execution: result.execution, outcome: "center_strategic_learning_opened" });
        return;
      }
      if (result.execution === "open_center_decision_strategic") {
        openCenterComponent("decision_strategic");
        traceActionRouterExecuted(action, { execution: result.execution, outcome: "center_decision_strategic_opened" });
        return;
      }
      if (result.execution === "open_center_decision_lens") {
        openCenterComponent("decision_lens");
        traceActionRouterExecuted(action, { execution: result.execution, outcome: "center_decision_lens_opened" });
        return;
      }
      if (result.execution === "open_center_collaboration_intelligence") {
        openCenterComponent("collaboration_intelligence");
        traceActionRouterExecuted(action, {
          execution: result.execution,
          outcome: "center_collaboration_intelligence_opened",
        });
        return;
      }
      if (result.execution === "open_center_outcome_feedback") {
        openCenterComponent("outcome_feedback");
        traceActionRouterExecuted(action, { execution: result.execution, outcome: "center_outcome_feedback_opened" });
        return;
      }
      if (result.execution === "open_center_decision_memory") {
        openCenterComponent("decision_memory");
        traceActionRouterExecuted(action, { execution: result.execution, outcome: "center_decision_memory_opened" });
        return;
      }
      if (result.execution === "open_center_decision_lifecycle") {
        openCenterComponent("decision_lifecycle");
        traceActionRouterExecuted(action, { execution: result.execution, outcome: "center_decision_lifecycle_opened" });
        return;
      }
      if (result.execution === "open_center_scenario_tree") {
        openCenterComponent("scenario_tree");
        traceActionRouterExecuted(action, { execution: result.execution, outcome: "center_scenario_tree_opened" });
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
        logDeprecatedPanelPath("dispatch_open_right_panel", {
          source: action.source,
          view: result.panelRequest.view ?? null,
          contextId: result.panelRequest.contextId ?? null,
        });
        requestPanelAuthorityOpen({
          view: result.panelRequest.view,
          family:
            result.panelRequest.view === "dashboard" || result.panelRequest.view === "strategic_command"
              ? "EXE"
              : result.panelRequest.view === "risk" || result.panelRequest.view === "fragility" || result.panelRequest.view === "explanation"
                ? "RSK"
                : result.panelRequest.view === "workspace" || result.panelRequest.view === "object" || result.panelRequest.view === "object_focus"
                  ? "SCN"
                  : "SIM",
          source:
            action.source === "chat"
              ? "chat"
              : action.source === "left_nav"
                ? "left_nav"
                : action.source === "panel_cta"
                  ? "sub_button"
                  : "system",
          contextId: result.panelRequest.contextId ?? null,
          reason: String(result.panelRequest.rawSource ?? "dispatch_canonical_open_panel"),
          forceOpen: true,
        });
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
      logDeprecatedPanelPath,
      openCenterComponent,
      requestPanelAuthorityOpen,
      rightPanelState.contextId,
      rightPanelState.view,
    ]
  );

  const routeIntentToPanel = useCallback(
    (
      intent: NexoraIntent,
      context: OpenComponentPanelContext
    ) => {
      const resolvedContextId = (() => {
        const inc = typeof context.contextId === "string" ? context.contextId.trim() : "";
        if (inc) return inc;
        const rp = typeof rightPanelState.contextId === "string" ? rightPanelState.contextId.trim() : "";
        if (rp) return rp;
        const sel = typeof selectedObjectIdState === "string" ? selectedObjectIdState.trim() : "";
        if (sel) return sel;
        const fid = typeof focusedId === "string" ? focusedId.trim() : "";
        return fid || null;
      })();
      const source = (context.source ?? "component_panel") as NexoraPanelAuthoritySource;
      const resolved = resolveIntentToPanel(intent);
      const expectedFamily = expectedFamilyForIntent(intent);
      const resolvedFamily: PanelFamily = resolved.type === "right" ? resolved.family : expectedFamily;
      const centerOnlyIntents = new Set<NexoraIntent>([
        "open_pattern_intelligence",
        "open_strategic_learning",
        "open_decision_strategic",
        "open_decision_lens",
        "open_team_decision",
        "open_collaboration_intelligence",
        "open_outcome_feedback",
        "open_decision_memory",
        "open_decision_lifecycle",
        "open_scenario_tree",
      ]);

      if (process.env.NODE_ENV !== "production") {
        globalThis.console?.debug?.("[Nexora][IntentResolved]", {
          intent,
          targetType: resolved.type,
          target: resolved.type === "center" ? resolved.component : resolved.view,
          contextId: resolvedContextId,
          source,
        });
        globalThis.console?.debug?.("[Nexora][ButtonIntentMapped]", {
          buttonLabel: context.caller ?? "unknown_button",
          intent,
          targetType: resolved.type,
          target: resolved.type === "center" ? resolved.component : resolved.view,
          source,
          contextId: resolvedContextId,
        });
      }

      if (
        source !== "manual_user_nav" &&
        intent !== "unknown_intent" &&
        resolvedFamily !== expectedFamily
      ) {
        globalThis.console?.error?.("[Nexora][CrossFamilyDriftBlocked]", {
          intent,
          targetFamily: resolvedFamily,
          expectedFamily,
          source,
        });
        globalThis.console?.error?.("[Nexora][ButtonIntentBlocked]", {
          buttonLabel: context.caller ?? "unknown_button",
          intent,
          reason: "cross_family_drift",
          source,
          contextId: resolvedContextId,
        });
        return;
      }

      if (resolved.type === "center") {
        if (process.env.NODE_ENV !== "production") {
          globalThis.console?.debug?.("[Nexora][CenterPanelOpened]", {
            component: resolved.component,
            source: "exe_dashboard",
          });
        }
        dispatchCanonicalAction(
          normalizeOpenComponentPanel({
            component: resolved.component,
            source: "panel_cta",
            surface: "center_overlay",
            rawSource: context.caller
              ? `intent_route:${intent}:${context.caller}`
              : `intent_route:${intent}`,
          })
        );
        return;
      }

      if (!resolved.view) {
        globalThis.console?.error?.("[Nexora][InvalidRoutingState]", {
          intent,
          contextId: resolvedContextId,
          source,
          reason: "missing_resolved_view",
        });
        globalThis.console?.error?.("[Nexora][ButtonIntentBlocked]", {
          buttonLabel: context.caller ?? "unknown_button",
          intent,
          reason: "missing_resolved_view",
          source,
          contextId: resolvedContextId,
        });
        return;
      }
      if (
        centerOnlyIntents.has(intent) &&
        (resolved.view === "timeline" || resolved.view === "dashboard")
      ) {
        globalThis.console?.error?.("[Nexora][InvalidCenterRouting]", { intent });
        globalThis.console?.error?.("[Nexora][ButtonIntentBlocked]", {
          buttonLabel: context.caller ?? "unknown_button",
          intent,
          reason: "invalid_center_routing",
          source,
          contextId: resolvedContextId,
        });
        return;
      }
      if (intent !== "unknown_intent" && !resolvedContextId && resolved.view !== "war_room") {
        globalThis.console?.error?.("[Nexora][InvalidRoutingState]", {
          intent,
          contextId: resolvedContextId,
          source,
          reason: "missing_context_for_known_intent",
        });
        globalThis.console?.error?.("[Nexora][ButtonIntentBlocked]", {
          buttonLabel: context.caller ?? "unknown_button",
          intent,
          reason: "missing_context_for_known_intent",
          source,
          contextId: resolvedContextId,
        });
        return;
      }

      requestPanelAuthorityOpen({
        view: resolved.view,
        family: resolved.family,
        source,
        contextId: resolvedContextId,
        reason: context.reason ?? `intent_route:${intent}`,
        forceOpen: true,
      });
    },
    [
      dispatchCanonicalAction,
      focusedId,
      requestPanelAuthorityOpen,
      rightPanelState.contextId,
      selectedObjectIdState,
    ]
  );

  const openComponentPanelFromAction = useCallback(
    (actionName: ComponentPanelActionName, context: OpenComponentPanelContext) => {
      const intentForAction: Record<ComponentPanelActionName, NexoraIntent> = {
        compare: "open_compare",
        timeline: "open_timeline",
        strategic_command_full: "open_strategic_command",
        team_decision: "open_team_decision",
        decision_council: "open_decision_council",
        org_memory: "open_org_memory",
        decision_policy: "open_decision_policy",
        executive_approval: "open_executive_approval",
        decision_governance: "open_decision_governance",
        confidence_calibration: "open_calibration",
        pattern_intelligence: "open_pattern_intelligence",
        strategic_learning: "open_strategic_learning",
        decision_strategic: "open_decision_strategic",
        decision_lens: "open_decision_lens",
        collaboration_intelligence: "open_collaboration_intelligence",
        outcome_feedback: "open_outcome_feedback",
        decision_memory: "open_decision_memory",
        decision_lifecycle: "open_decision_lifecycle",
        scenario_tree: "open_scenario_tree",
      };
      const intent = intentForAction[actionName] ?? "unknown_intent";
      if (process.env.NODE_ENV !== "production") {
        globalThis.console?.debug?.("[Nexora][LegacyButtonMigrated]", {
          buttonLabel: actionName,
          oldTarget: context.rawTarget ?? actionName,
          newIntent: intent,
          sourceFile: "HomeScreen.tsx",
          contextId: context.contextId ?? null,
        });
        if (intent === "open_scenario_tree") {
          globalThis.console?.debug?.("[Nexora][ButtonIntentMapped]", {
            label: "Open Scenario Tree",
            intent: "open_scenario_tree",
            target: "center",
            contextId: context.contextId ?? null,
          });
        }
      }
      if (intent === "unknown_intent") {
        globalThis.console?.error?.("[Nexora][LegacyButtonUnmapped]", {
          buttonLabel: actionName,
          oldTarget: context.rawTarget ?? actionName,
          sourceFile: "HomeScreen.tsx",
          contextId: context.contextId ?? null,
        });
        return;
      }
      routeIntentToPanel(intent, context);
    },
    [routeIntentToPanel]
  );
  const migrateLegacyButtonToIntent = useCallback(
    (
      buttonLabel: string,
      oldTarget: string,
      newIntent: NexoraIntent,
      sourceFile: string,
      context: OpenComponentPanelContext
    ) => {
      if (process.env.NODE_ENV !== "production") {
        globalThis.console?.debug?.("[Nexora][LegacyButtonMigrated]", {
          buttonLabel,
          oldTarget,
          newIntent,
          sourceFile,
          contextId: context.contextId ?? null,
        });
      }
      routeIntentToPanel(newIntent, context);
    },
    [routeIntentToPanel]
  );

  useEffect(() => {
    registerNexoraActionDispatch(dispatchCanonicalAction);
    return () => registerNexoraActionDispatch(null);
  }, [dispatchCanonicalAction]);

  // O1 Extraction Boundary: Demo / pilot controller
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
    requestPanelAuthorityOpen({
      view: "advice",
      family: "SIM",
      source: "system",
      reason: "pipeline_hud_b8_why_this",
      forceOpen: true,
    });
  }, [requestPanelAuthorityOpen, traceB8DecisionAction]);

  const closeCenterComponent = useCallback(() => {
    commitCenterComponentState({ visible: false }, "closeCenterComponent:start");
    if (centerComponentCloseTimerRef.current != null) {
      window.clearTimeout(centerComponentCloseTimerRef.current);
    }
    centerComponentCloseTimerRef.current = window.setTimeout(() => {
      commitCenterComponentState({ component: null, visible: false }, "closeCenterComponent:timer");
      centerComponentCloseTimerRef.current = null;
    }, 170);
  }, [commitCenterComponentState]);
  const toggleRightPanel = useCallback(
    (view: RightPanelView, contextId: string | null = null) => {
      if (!view) {
        return;
      }
      requestPanelAuthorityOpen({
        view,
        family:
          view === "dashboard" || view === "strategic_command"
            ? "EXE"
            : view === "risk" || view === "fragility" || view === "explanation"
              ? "RSK"
              : view === "workspace" || view === "object" || view === "object_focus"
                ? "SCN"
                : "SIM",
        source: "system",
        contextId,
        reason: "toggle_right_panel",
        forceOpen: true,
      });
    },
    [requestPanelAuthorityOpen]
  );
  const toggleInspector = useCallback(() => {
    traceRightPanelPathAudit("toggleInspector", rightPanelState.view ?? null, "direct_state_write");
    if (rightPanelState.isOpen) {
      requestPanelAuthorityClose("user_toggle_inspector");
      return;
    }
    const v = rightPanelState.view;
    if (!v) {
      return;
    }
    requestPanelAuthorityOpen({
      view: v,
      family:
        v === "dashboard" || v === "strategic_command"
          ? "EXE"
          : v === "risk" || v === "fragility" || v === "explanation"
            ? "RSK"
            : v === "workspace" || v === "object" || v === "object_focus"
              ? "SCN"
              : "SIM",
      source: "system",
      contextId: rightPanelState.contextId ?? null,
      reason: "toggle_inspector_open_existing_view",
      forceOpen: true,
    });
  }, [requestPanelAuthorityClose, requestPanelAuthorityOpen, rightPanelState.contextId, rightPanelState.isOpen, rightPanelState.view, traceRightPanelPathAudit]);

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
      commitCenterComponentState({ visible: false }, "centerComponentEffect:empty");
      return;
    }
    const raf = window.requestAnimationFrame(() => {
      commitCenterComponentState({ visible: true }, "centerComponentEffect:raf");
    });
    return () => window.cancelAnimationFrame(raf);
  }, [centerComponent, commitCenterComponentState]);
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
      if (requestedView) {
        logDeprecatedPanelPath("legacy_event_open", {
          view: detail?.view ?? null,
          source: detail?.source ?? null,
        });
        const rawEventSource = detail?.source;
        const resolvedAuthoritySource: NexoraPanelAuthoritySource =
          rawEventSource === "left_nav" ||
          rawEventSource === "manual_user_nav" ||
          rawEventSource === "sub_button" ||
          rawEventSource === "tab_click" ||
          rawEventSource === "chat" ||
          rawEventSource === "scene" ||
          rawEventSource === "object_click" ||
          rawEventSource === "system" ||
          rawEventSource === "legacy_event"
            ? rawEventSource
            : "legacy_event";
        requestPanelAuthorityOpen({
          view: requestedView,
          family: detail?.family,
          source: resolvedAuthoritySource,
          contextId: detail?.contextId ?? null,
          reason: detail?.reason ?? "nexora_open_right_panel_event",
          forceOpen: detail?.forceOpen === false ? false : true,
        });
        return;
      }
      logDeprecatedPanelPath("legacy_helper_open", {
        helper: "normalizeOpenRightPanelEventDetail",
      });
      dispatchCanonicalAction(normalizeOpenRightPanelEventDetail(detail));
    };

    window.addEventListener("nexora:open-right-panel", onOpenRightPanel as EventListener);
    return () => window.removeEventListener("nexora:open-right-panel", onOpenRightPanel as EventListener);
  }, [dispatchCanonicalAction, logDeprecatedPanelPath, requestPanelAuthorityOpen]);
  useEffect(() => {
    if (rightPanelState.isOpen) return;
    if (rightPanelState.view !== "dashboard") return;
    requestPanelAuthorityOpen({
      view: "dashboard",
      family: "EXE",
      source: "system",
      reason: "initial_executive_open",
      forceOpen: true,
    });
  }, [requestPanelAuthorityOpen, rightPanelState.isOpen, rightPanelState.view]);

  useEffect(() => {
    if (panelUserExplicitCloseRef.current) return;
    if (!rightPanelState.view) return;
    if (rightPanelState.isOpen) return;
    applyPanelControllerRequest({
      requestedView: rightPanelState.view,
      source: "effect_auto",
      rawSource: "panel_visibility_auto_reopen",
      contextId: rightPanelState.contextId ?? null,
      preserveIfSameContext: false,
      allowAutoOverride: true,
    });
  }, [
    applyPanelControllerRequest,
    rightPanelState.contextId,
    rightPanelState.isOpen,
    rightPanelState.view,
  ]);

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
    const onLeftCommandOpenChanged = (event: Event) => {
      const detail = (event as CustomEvent<{ open?: boolean }>).detail;
      const nextOpen = detail?.open;
      if (typeof nextOpen !== "boolean") return;
      setLeftCommandPanelOpen((prev) => {
        if (prev === nextOpen) return prev;
        return nextOpen;
      });
    };
    window.addEventListener("nexora:left-command-open-changed", onLeftCommandOpenChanged as EventListener);
    return () => window.removeEventListener("nexora:left-command-open-changed", onLeftCommandOpenChanged as EventListener);
  }, []);

  useEffect(() => {
    if (!isClientMounted) {
      setLeftCommandPortalHost(null);
      return;
    }
    const el = document.getElementById("nexora-left-command-host");
    setLeftCommandPortalHost(el instanceof HTMLElement ? el : null);
  }, [isClientMounted]);

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
    requestPanelAuthorityOpen({
      view: "dashboard",
      family: "EXE",
      source: "tab_click",
      reason: "manual_user_nav",
      contextId: null,
      forceOpen: true,
    });
  }, [requestPanelAuthorityOpen]);
  const handleStrategicCommandFullRouteView = useCallback(
    (view: CanonicalRightPanelView) => {
      const execContextId =
        typeof rightPanelState.contextId === "string" && rightPanelState.contextId.trim().length > 0
          ? rightPanelState.contextId.trim()
          : typeof selectedObjectIdState === "string" && selectedObjectIdState.trim().length > 0
            ? selectedObjectIdState.trim()
            : typeof focusedId === "string" && focusedId.trim().length > 0
              ? focusedId.trim()
              : null;

      const logRoute = (payload: Record<string, unknown>) => {
        if (process.env.NODE_ENV === "production") return;
        globalThis.console?.debug?.("[Nexora][StrategicCommandRoute]", payload);
      };
      const logBlocked = (payload: Record<string, unknown>) => {
        if (process.env.NODE_ENV === "production") return;
        globalThis.console?.warn?.("[Nexora][StrategicCommandRouteBlocked]", payload);
      };

      const openExe = (resolvedView: CanonicalRightPanelView, reason: string) => {
        logRoute({
          requested: view,
          resolved: resolvedView,
          family: "EXE",
          contextId: execContextId,
          source: "strategic_command",
          reason,
        });
        requestPanelAuthorityOpen({
          view: resolvedView,
          family: "EXE",
          source: "strategic_command",
          reason,
          contextId: execContextId,
          forceOpen: true,
        });
      };

      const familyForPanelView = (v: CanonicalRightPanelView): "EXE" | "RSK" | "SIM" => {
        if (v === "risk" || v === "fragility" || v === "explanation") return "RSK";
        if (
          v === "war_room" ||
          v === "advice" ||
          v === "memory" ||
          v === "replay" ||
          v === "scenario_tree" ||
          v === "pattern_intelligence" ||
          v === "confidence_calibration" ||
          v === "outcome_feedback" ||
          v === "conflict" ||
          v === "collaboration" ||
          v === "patterns" ||
          v === "opponent" ||
          v === "decision_timeline"
        ) {
          return "SIM";
        }
        return "EXE";
      };

      // Center execution surfaces — unchanged (center panel stays open)
      if (view === "simulate") {
        logRoute({ requested: view, path: "center_dispatch", kind: "simulate", contextId: execContextId });
        dispatchCanonicalAction(
          normalizeRunSimulation({
            rawSource: "StrategicCommandFull:onOpenView",
            surface: "center_overlay",
            source: "panel_cta",
          })
        );
        return;
      }
      if (view === "compare") {
        logRoute({ requested: view, path: "center_dispatch", kind: "compare", contextId: execContextId });
        migrateLegacyButtonToIntent(
          "Open Compare",
          "normalizeCompareOptions",
          "open_compare",
          "HomeScreen.tsx",
          {
            destinationSurface: "component_panel",
            source: "strategic_command",
            caller: "StrategicCommandFull:onOpenView:compare",
            contextId: execContextId,
          }
        );
        return;
      }
      if (view === "timeline") {
        logRoute({ requested: view, path: "center_dispatch", kind: "timeline", contextId: execContextId });
        migrateLegacyButtonToIntent(
          "Open Timeline",
          "normalizeOpenCenterTimeline",
          "open_timeline",
          "HomeScreen.tsx",
          {
            destinationSurface: "component_panel",
            source: "strategic_command",
            caller: "StrategicCommandFull:onOpenView:timeline",
            contextId: execContextId,
          }
        );
        return;
      }

      // Executive decision layer: never send Scene/SCN or global dashboard from Strategic Command
      if (view === "dashboard") {
        logBlocked({
          requested: view,
          blocked: "global_dashboard_route",
          remapped: "executive_object",
          contextId: execContextId,
        });
        openExe("executive_object", "strategic_command_full:governance_item_click");
        return;
      }
      if (view === "workspace" || view === "object" || view === "object_focus") {
        logBlocked({
          requested: view,
          blocked: "scn_scene_route",
          remapped: "executive_object",
          contextId: execContextId,
        });
        openExe("executive_object", `strategic_command_full:alignment_item_click:${view}`);
        return;
      }

      if (view === "war_room") {
        logRoute({ requested: view, resolved: "war_room", family: "SIM", contextId: execContextId });
        openSimPanel("war_room", "strategic_command_full_route", execContextId, {
          source: "strategic_command",
        });
        return;
      }
      if (view === "risk") {
        logRoute({ requested: view, resolved: "risk", family: "RSK", contextId: execContextId });
        openRskPanel("risk", "strategic_command_full_route", execContextId, {
          source: "strategic_command",
        });
        return;
      }
      if (view === "fragility") {
        logRoute({ requested: view, resolved: "fragility", family: "RSK", contextId: execContextId });
        openRskPanel("fragility", "strategic_command_full_route", execContextId, {
          source: "strategic_command",
        });
        return;
      }

      const centerOnlyComponent = mapRightPanelViewToCenterComponentId(view);
      if (centerOnlyComponent) {
        const intentByComponent: Record<string, NexoraIntent> = {
          strategic_command_full: "open_strategic_command",
          team_decision: "open_team_decision",
          decision_council: "open_decision_council",
          org_memory: "open_org_memory",
          decision_policy: "open_decision_policy",
          executive_approval: "open_executive_approval",
          decision_governance: "open_decision_governance",
        };
        const intent = intentByComponent[centerOnlyComponent] ?? "unknown_intent";
        logRoute({
          requested: view,
          path: "center_component_dispatch",
          component: centerOnlyComponent,
          intent,
          contextId: execContextId,
        });
        routeIntentToPanel(intent, {
          destinationSurface: "component_panel",
          source: "strategic_command",
          contextId: execContextId,
          caller: `StrategicCommandFull:onOpenView:${view}`,
        });
        return;
      }

      const family = familyForPanelView(view);
      logRoute({
        requested: view,
        resolved: view,
        family,
        contextId: execContextId,
        reason: "strategic_command_full:panel_nav",
      });
      requestPanelAuthorityOpen({
        view,
        family,
        source: "strategic_command",
        reason: `strategic_command_full:routing_hint_click:${view}`,
        contextId: execContextId,
        forceOpen: true,
      });
    },
    [
      dispatchCanonicalAction,
      focusedId,
      migrateLegacyButtonToIntent,
      openRskPanel,
      openSimPanel,
      requestPanelAuthorityOpen,
      routeIntentToPanel,
      rightPanelState.contextId,
      selectedObjectIdState,
    ]
  );
  const handleOpenObject = useCallback(
    (objectId?: string | null) => {
      const id = objectId != null ? String(objectId).trim() : "";
      if (id) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("nexora:objects-panel-select", {
              detail: { objectId: id },
            })
          );
        }
      } else {
        openScnPanel("object", null, "handle_open_object_panel_only");
      }
    },
    [openScnPanel]
  );
  const handleCloseRightPanel = useCallback(() => {
    requestPanelAuthorityClose("user_close_action");
  }, [requestPanelAuthorityClose]);
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
  const visibleSceneObjects = Array.isArray(visibleSceneJson?.scene?.objects)
    ? visibleSceneJson.scene.objects
    : [];
  const lastSceneParityVisibleTraceRef = useRef<string | null>(null);
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (!visibleSceneJson) return;
    const count = visibleSceneObjects.length;
    const ids = visibleSceneObjects.map((o: any) => o?.id ?? "unknown");
    const signature = JSON.stringify({ count, ids });
    if (lastSceneParityVisibleTraceRef.current === signature) return;
    lastSceneParityVisibleTraceRef.current = signature;
    globalThis.console.log("[Nexora][SceneParity][VISIBLE]", {
      count,
      ids,
      hasObjects: count > 0,
    });
  }, [visibleSceneJson, visibleSceneObjects]);
  const lastSceneParityTraceRef = useRef<string | null>(null);
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const trace = {
      sceneJsonCount: countSceneObjects(sceneJson),
      visibleSceneJsonCount: countSceneObjects(visibleSceneJson),
      sceneJsonIds: sceneObjectIds(sceneJson),
      visibleSceneJsonIds: sceneObjectIds(visibleSceneJson),
      rightPanelView: rightPanelState.view,
      rightPanelContextId: rightPanelState.contextId ?? null,
    };
    const sig = JSON.stringify(trace);
    if (lastSceneParityTraceRef.current === sig) return;
    lastSceneParityTraceRef.current = sig;
    globalThis.console.warn("[Nexora][SceneParity][HomeScreen]", trace);
  }, [sceneJson, visibleSceneJson, rightPanelState.view, rightPanelState.contextId]);
  const hasVisibleSceneObjects = visibleSceneObjects.length > 0;
  const normalizedHealth = String(healthInfo ?? "").trim().toLowerCase();
  const isBackendHealthy =
    normalizedHealth.length === 0 ||
    normalizedHealth.includes("healthy") ||
    normalizedHealth.includes("ok") ||
    normalizedHealth.includes("green");
  const isEmptyState = !hasVisibleSceneObjects;
  const isSystemUnhealthy = !isBackendHealthy;
  const allowRealPanelData = hasVisibleSceneObjects && isBackendHealthy;
  const panelGateDebugSig = `${hasVisibleSceneObjects ? 1 : 0}|${isBackendHealthy ? 1 : 0}|${allowRealPanelData ? 1 : 0}`;
  const lastPanelGateDebugSigRef = useRef<string | null>(null);
  if (process.env.NODE_ENV !== "production" && lastPanelGateDebugSigRef.current !== panelGateDebugSig) {
    lastPanelGateDebugSigRef.current = panelGateDebugSig;
    console.debug("[Nexora][PanelGate]", {
      hasObjects: hasVisibleSceneObjects,
      isBackendHealthy,
      allowRealPanelData,
    });
  }
  const allowDecisionPanels = true;
  const firstMeaningfulState: FirstMeaningfulState = useMemo(() => {
    const hasScene = hasVisibleSceneObjects;
    const hasAnalysis = Boolean(
      asRecord(visibleResponseData?.decision_analysis) ??
        visibleResponseData?.canonical_recommendation ??
        visibleResponseData?.decision_cockpit
    );
    const hasSignals = Boolean(
      visibleRiskPropagation?.sources?.length ||
        visibleRiskPropagation?.targets?.length ||
        visibleConflicts?.length ||
        visibleMemoryInsights
    );
    return buildFirstMeaningfulState({
      hasScene,
      hasAnalysis,
      hasSignals,
    });
  }, [hasVisibleSceneObjects, visibleResponseData, visibleRiskPropagation, visibleConflicts, visibleMemoryInsights]);
  /** MVP: Analyze runs only when a scene object is selected (no global “analyze system”). */
  const objectAnalyzeReady = useMemo(() => {
    const hl = getHighlightedObjectIdsFromSelection(visibleObjectSelection);
    return (
      (typeof selectedObjectIdState === "string" && selectedObjectIdState.trim().length > 0) ||
      (typeof focusedId === "string" && focusedId.trim().length > 0) ||
      hl.length > 0
    );
  }, [selectedObjectIdState, focusedId, visibleObjectSelection]);
  useEffect(() => {
    if (entryFlowState === "ready_for_analysis") return;
    const hasObjects = hasRenderableSceneObjects(sceneJson);
    if (!hasObjects) return;
    if (!hasUserStartedFlowRef.current) {
      markUserStartedFlow("scene_hydrated");
    }
    setEntryFlowState((prev) => {
      if (prev === "ready_for_analysis") return prev;
      globalThis.console.log("[Nexora][EntryFlow][PromotedToReady]", {
        from: prev,
        reason: "scene_objects_detected",
        objectCount: Array.isArray(sceneJson?.scene?.objects) ? sceneJson.scene.objects.length : 0,
      });
      return "ready_for_analysis";
    });
  }, [sceneJson, entryFlowState, markUserStartedFlow]);
  const lastEmptyStatePanelEffectSigRef = useRef<string | null>(null);
  useEffect(() => {
    if (entryFlowState !== "objects_created") return;
    const hasObjects = Array.isArray(visibleSceneJson?.scene?.objects) && visibleSceneJson.scene.objects.length > 0;
    const explicitSelection = resolveExplicitSelectedObject({
      selectedObjectIdState,
      objectSelection,
    });
    if (hasObjects && explicitSelection.hasExplicitSelection) {
      setEntryFlowState("ready_for_analysis");
    }
  }, [entryFlowState, objectSelection, selectedObjectIdState, visibleSceneJson]);
  useEffect(() => {
    if (!isEmptyState) {
      lastEmptyStatePanelEffectSigRef.current = null;
      return;
    }
    const isDashboardNoop =
      rightPanelState.view === "dashboard" && (rightPanelState.contextId ?? null) == null;
    if (isDashboardNoop) {
      console.debug("[Nexora][EmptyStateReset][SkippedDashboardNoop]", {
        view: rightPanelState.view,
        contextId: rightPanelState.contextId ?? null,
      });
      return;
    }
    const isAlreadyNeutral =
      (rightPanelState.view === null || rightPanelState.view === "workspace") &&
      (rightPanelState.contextId ?? null) == null;
    if (isAlreadyNeutral) {
      console.debug("[Nexora][EmptyStateReset][SkippedNeutralNoop]", {
        view: rightPanelState.view,
        contextId: rightPanelState.contextId ?? null,
      });
      return;
    }
    if (rightPanelState.view === "workspace") return;
    const panelSig = JSON.stringify({
      view: "workspace",
      contextId: null,
      reason: "no_objects",
    });
    if (lastEmptyStatePanelEffectSigRef.current === panelSig) {
      console.debug("[Nexora][UpstreamDedup][Skipped]", {
        type: "panel",
        signature: panelSig,
      });
      return;
    }
    lastEmptyStatePanelEffectSigRef.current = panelSig;
    if (process.env.NODE_ENV !== "production") {
      const resetTrace = {
        source: "empty_state_reset",
        prevCount: countSceneObjects(sceneJson),
        nextCount: countSceneObjects(visibleSceneJson),
        reason: "no_objects",
      };
      const resetSig = JSON.stringify(resetTrace);
      if (lastSceneResetTraceSigRef.current !== resetSig) {
        lastSceneResetTraceSigRef.current = resetSig;
        globalThis.console.warn("[Nexora][SceneParity][SceneResetCandidate]", resetTrace);
      }
    }
    commitRightPanelStateFromAuthority(
      (prev) => {
        const prevView = prev.view ?? null;
        const nextView = "workspace";
        const nextContextId = null;
        const isAlreadyNeutral =
          (prevView === "workspace" || prevView === "dashboard") && nextView === "workspace" && nextContextId == null;
        if (isAlreadyNeutral || (prevView === nextView && (prev.contextId ?? null) === nextContextId && prev.isOpen)) {
          return prev;
        }
        return {
          ...prev,
          isOpen: true,
          view: nextView,
          contextId: nextContextId,
          timestamp: Date.now(),
        };
      },
      {
        writer: "empty_state_reset",
        source: "system_fallback",
        reason: "no_objects",
      }
    );
  }, [commitRightPanelStateFromAuthority, isEmptyState, rightPanelState.view, sceneJson, visibleSceneJson]);
  useEffect(() => {
    if (!isEmptyState) return;
    const id = requestAnimationFrame(() => {
      const inputEl = document.getElementById("nexora-chat-input") as HTMLInputElement | null;
      inputEl?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [isEmptyState]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
      new CustomEvent("nexora:object-analyze-eligibility", { detail: { ready: objectAnalyzeReady } })
    );
  }, [objectAnalyzeReady]);

  const leftSuggestedCommands = useMemo(
    () =>
      DEFAULT_LEFT_COMMANDS.map((cmd) =>
        cmd.id === "analyze"
          ? {
              ...cmd,
              disabled:
                isEmptyState ||
                !objectAnalyzeReady ||
                entryFlowState === "idle" ||
                entryFlowState === "describing_system",
              hint:
                isEmptyState
                  ? "Describe system first"
                  : entryFlowState === "idle"
                  ? "Start by describing your system"
                  : entryFlowState === "describing_system"
                    ? "Describe your system"
                    : entryFlowState === "objects_created"
                      ? "Select an object"
                      : objectAnalyzeReady
                        ? "Analyze Object"
                        : "Select an object to analyze",
            }
          : cmd
      ),
    [entryFlowState, isEmptyState, objectAnalyzeReady]
  );

  const stableSceneObjectsSignature = useMemo(() => {
    const sceneObjects = Array.isArray(visibleSceneJson?.scene?.objects) ? visibleSceneJson.scene.objects : [];
    const semanticObjects = sceneObjects
      .map((obj: unknown, idx: number) => {
        const o = asRecord(obj);
        const semantic = asRecord(o?.semantic);
        const transform = asRecord(o?.transform);
        const posRaw = Array.isArray(transform?.pos) ? transform?.pos : Array.isArray(o?.position) ? o?.position : null;
        const px = posRaw && posRaw.length > 0 ? Number(posRaw[0] ?? 0) : 0;
        const py = posRaw && posRaw.length > 1 ? Number(posRaw[1] ?? 0) : 0;
        const pz = posRaw && posRaw.length > 2 ? Number(posRaw[2] ?? 0) : 0;
        return {
          id: String(o?.id ?? o?.name ?? `obj_${idx}`),
          severity: String(o?.severity ?? o?.scanner_severity ?? ""),
          state: String(o?.state ?? o?.status ?? ""),
          role: String(o?.role ?? semantic?.role ?? ""),
          label: String(o?.label ?? o?.name ?? ""),
          x: Number.isFinite(px) ? Number(px.toFixed(4)) : 0,
          y: Number.isFinite(py) ? Number(py.toFixed(4)) : 0,
          z: Number.isFinite(pz) ? Number(pz.toFixed(4)) : 0,
        };
      })
      .sort((a, b) => a.id.localeCompare(b.id));
    return JSON.stringify(semanticObjects);
  }, [visibleSceneJson]);
  const lastStableSceneObjectsSignatureRef = useRef<string | null>(null);
  const lastStableSceneJsonRef = useRef<typeof visibleSceneJson | null>(null);
  const stableVisibleSceneJson = useMemo(() => {
    if (!visibleSceneJson) return visibleSceneJson;
    if (
      lastStableSceneObjectsSignatureRef.current === stableSceneObjectsSignature &&
      lastStableSceneJsonRef.current
    ) {
      if (process.env.NODE_ENV !== "production") {
        const resetTrace = {
          source: "visible_scene_fallback",
          prevCount: countSceneObjects(visibleSceneJson),
          nextCount: countSceneObjects(lastStableSceneJsonRef.current),
          reason: "stable_signature_reuse",
        };
        const resetSig = JSON.stringify(resetTrace);
        if (lastSceneResetTraceSigRef.current !== resetSig) {
          lastSceneResetTraceSigRef.current = resetSig;
          globalThis.console.warn("[Nexora][SceneParity][SceneResetCandidate]", resetTrace);
        }
      }
      return lastStableSceneJsonRef.current;
    }
    lastStableSceneObjectsSignatureRef.current = stableSceneObjectsSignature;
    lastStableSceneJsonRef.current = visibleSceneJson;
    return visibleSceneJson;
  }, [stableSceneObjectsSignature, visibleSceneJson]);
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
        if (shouldAcceptObjectSelection) {
          const nextSel = viewModel.nextObjectSelection;
          const nextHighlightedIds = getHighlightedObjectIdsFromSelection(nextSel);
          const currentHighlightedIds = getHighlightedObjectIdsFromSelection(visibleObjectSelection);
          const shouldPreserveSelectionFromWeakScenePayload =
            Boolean(focusedId ?? selectedObjectIdState ?? currentHighlightedIds[0]) &&
            nextHighlightedIds.length === 0;
          if (shouldPreserveSelectionFromWeakScenePayload) {
            if (process.env.NODE_ENV !== "production") {
              console.debug("[Nexora][SelectionGuardSkipped]", {
                reason: "weak_scene_payload_no_clear",
                focusedId: focusedId ?? null,
                selectedObjectId: selectedObjectIdState ?? null,
              });
            }
          } else {
          const nextSig = buildSelectionSignature({
            focusedId: focusedId ?? null,
            highlightedIds: nextHighlightedIds,
            source: "panel",
          });
          const prevSelSig = lastSelectionSignatureRef.current;
          traceNexoraSelectionGuard(nextSig, prevSelSig, "panel");
          if (nextSig !== prevSelSig) {
            lastSelectionSignatureRef.current = nextSig;
            setObjectSelection(nextSel);
          }
          }
        }
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
          applySceneChangeUpstreamDedup(sceneDecision.scene, "product_flow");
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
      applySceneChangeSafe,
      autonomousExploration,
      conflicts,
      focusedId,
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
  const liveExecutiveObjectId = useMemo(() => {
    const focusedFromSelection =
      typeof (visibleObjectSelection as { focusedId?: unknown } | null | undefined)?.focusedId === "string"
        ? String((visibleObjectSelection as { focusedId?: string }).focusedId).trim()
        : "";
    const hl = getHighlightedObjectIdsFromSelection(visibleObjectSelection);
    return (
      String(selectedObjectIdState ?? "").trim() ||
      focusedFromSelection ||
      hl[0] ||
      null
    );
  }, [selectedObjectIdState, visibleObjectSelection]);
  const activeExecutiveObjectId = useMemo(() => {
    return liveExecutiveObjectId || String(rightPanelState.contextId ?? "").trim() || null;
  }, [liveExecutiveObjectId, rightPanelState.contextId]);
  const executiveObjectPanelData = useMemo(() => {
    if (!activeExecutiveObjectId) return null;
    const reco = buildCanonicalRecommendation(visibleResponseData ?? visibleSceneJson ?? null);
    return buildExecutiveObjectPanelData({
      objectId: activeExecutiveObjectId,
      objectName: resolveObjectLabel(activeExecutiveObjectId),
      responseData: visibleResponseData,
      sceneJson: visibleSceneJson,
      riskPropagation: visibleRiskPropagation,
      canonicalRecommendation: reco,
    });
  }, [
    liveExecutiveObjectId,
    visibleResponseData,
    visibleSceneJson,
    visibleRiskPropagation,
    resolveObjectLabel,
  ]);
  const lastExecutiveObjectSyncSigRef = useRef<string | null>(null);
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const sig = JSON.stringify({
      activeExecutiveObjectId: activeExecutiveObjectId ?? null,
      rightPanelView: rightPanelState.view ?? null,
      contextId: rightPanelState.contextId ?? null,
    });
    if (lastExecutiveObjectSyncSigRef.current === sig) return;
    lastExecutiveObjectSyncSigRef.current = sig;
    console.debug("[Nexora][ExecutiveObjectSync]", {
      activeExecutiveObjectId: activeExecutiveObjectId ?? null,
      rightPanelView: rightPanelState.view ?? null,
      contextId: rightPanelState.contextId ?? null,
    });
  }, [activeExecutiveObjectId, rightPanelState.contextId, rightPanelState.view]);
  const lastExecutiveContextSyncSigRef = useRef<string | null>(null);
  useEffect(() => {
    if (rightPanelState.view !== "executive_object") return;
    const lockedExecutiveContextId =
      rightPanelRouteLockRef.current.view === "executive_object" &&
      typeof rightPanelRouteLockRef.current.contextId === "string" &&
      rightPanelRouteLockRef.current.contextId.trim().length > 0
        ? rightPanelRouteLockRef.current.contextId.trim()
        : null;
    const normalizedCurrentContextId =
      typeof rightPanelState.contextId === "string" && rightPanelState.contextId.trim().length > 0
        ? rightPanelState.contextId.trim()
        : null;
    const selectedContextId =
      typeof selectedObjectIdState === "string" && selectedObjectIdState.trim().length > 0
        ? selectedObjectIdState.trim()
        : null;
    const focusedContextId =
      typeof focusedId === "string" && focusedId.trim().length > 0 ? focusedId.trim() : null;
    const nextContextId =
      lockedExecutiveContextId ??
      normalizedCurrentContextId ??
      selectedContextId ??
      focusedContextId ??
      null;
    if (!nextContextId) {
      return;
    }
    if (lockedExecutiveContextId && normalizedCurrentContextId !== lockedExecutiveContextId) {
      globalThis.console?.debug?.("[Nexora][ExecutiveContextPreserved]", {
        source: "route_lock",
        lockedContextId: lockedExecutiveContextId,
        currentContextId: normalizedCurrentContextId,
        selectedObjectId: selectedContextId,
        focusedId: focusedContextId,
      });
    }
    if (normalizedCurrentContextId === nextContextId) {
      return;
    }
    const panelSig = JSON.stringify({
      view: "executive_object",
      contextId: nextContextId,
      reason: "executive_object_context_sync",
    });
    if (lastExecutiveContextSyncSigRef.current === panelSig) {
      console.debug("[Nexora][UpstreamDedup][Skipped]", {
        type: "panel",
        signature: panelSig,
      });
      return;
    }
    lastExecutiveContextSyncSigRef.current = panelSig;
    commitRightPanelStateFromAuthority(
      (prev) => {
        if (prev.view !== "executive_object") return prev;
        return {
          ...prev,
          view: "executive_object",
          contextId: nextContextId,
          isOpen: true,
          timestamp: Date.now(),
        };
      },
      {
        writer: "HomeScreen.executive_object_context_sync",
        source: "effect_auto",
        reason: "executive_object_context_sync",
        allowExecutiveContextChange: true,
      }
    );
  }, [
    rightPanelState.view,
    rightPanelState.contextId,
    selectedObjectIdState,
    focusedId,
    commitRightPanelStateFromAuthority,
  ]);
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
        isIngestionUpdate?: boolean;
      }
    ) => {
      const sceneForOverrides = options?.sceneReplacement ?? sceneJson;
      const normalizedReaction = normalizeReactionForScene(reaction, sceneForOverrides);
      const isAnalyzeSystemReaction = /analyze[_\s-]*system|analyze the current system/i.test(
        `${normalizedReaction.reason ?? ""} ${normalizedReaction.fallbackHighlightText ?? ""}`
      );
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
      const hasExplicitHighlightPayload = reactionHasExplicitHighlightIntent(reaction);
      const nextHighlightedFromNormalize = normalizedReaction.highlightedObjectIds.map((x) => String(x));
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
      const currentHighlightedIds = getHighlightedObjectIdsFromSelection(visibleObjectSelection);
      const hasStableSceneSelection =
        currentHighlightedIds.length > 0 ||
        (typeof focusedId === "string" && focusedId.length > 0) ||
        (typeof selectedObjectIdState === "string" && selectedObjectIdState.length > 0);
      const globalSceneAnalyzeMode = isAnalyzeSystemReaction && !hasStableSceneSelection;
      if (process.env.NODE_ENV !== "production" && isAnalyzeSystemReaction) {
        console.debug("[Nexora][AnalyzeMode]", {
          mode: globalSceneAnalyzeMode ? "global_scene_analysis" : "focused_object_analysis",
          hasSelectedObject: hasStableSceneSelection,
        });
      }
      let effectiveHighlighted = nextHighlightedFromNormalize;
      if (!hasExplicitHighlightPayload && hasStableSceneSelection) {
        if (currentHighlightedIds.length > 0) {
          effectiveHighlighted = currentHighlightedIds;
        } else if (typeof focusedId === "string" && focusedId.length > 0) {
          effectiveHighlighted = [focusedId];
        } else if (typeof selectedObjectIdState === "string" && selectedObjectIdState.length > 0) {
          effectiveHighlighted = [selectedObjectIdState];
        }
      }
      let effectivePrimaryId: string | null = hasExplicitHighlightPayload
        ? normalizedReaction.primaryObjectId ?? effectiveHighlighted[0] ?? null
        : (focusedId ?? selectedObjectIdState ?? effectiveHighlighted[0] ?? null);
      if (globalSceneAnalyzeMode) {
        effectiveHighlighted = [];
        effectivePrimaryId = null;
      }
      const effectiveRelatedIds = effectiveHighlighted.filter((id) => id !== effectivePrimaryId);
      const reactionScalePrimary = typeof normalizedReaction.primaryScale === "number" ? normalizedReaction.primaryScale : 1.1;
      const reactionScaleSecondary =
        typeof normalizedReaction.secondaryScale === "number" ? normalizedReaction.secondaryScale : 1.035;
      const reactionScaleUnrelated =
        typeof normalizedReaction.unrelatedScale === "number" ? normalizedReaction.unrelatedScale : 0.992;
      const reactionOpacityUnrelated =
        typeof normalizedReaction.unrelatedOpacity === "number" ? normalizedReaction.unrelatedOpacity : 0.56;

      const primaryHighlightedId = effectivePrimaryId;
      const shouldDimUnrelated =
        !globalSceneAnalyzeMode &&
        normalizedReaction.dimUnrelatedObjects === true &&
        effectiveHighlighted.length > 0;
      const dimmedIdsForSemanticSig = shouldDimUnrelated
        ? allSceneObjectIds.filter((id) => !effectiveHighlighted.includes(id))
        : [];
      const sceneSemanticSignature = buildSceneSemanticSignature({
        objectIds: allSceneObjectIds,
        highlightedIds: effectiveHighlighted,
        dimmedIds: dimmedIdsForSemanticSig,
        selectedId: selectedObjectIdState ?? null,
        reactionMode: normalizedReaction.reactionMode ?? null,
        propagationSource: normalizedReaction.source ?? null,
      });
      const hasMeaningfulReaction =
        effectiveHighlighted.length > 0 ||
        nextRiskSources.length > 0 ||
        nextRiskTargets.length > 0 ||
        shouldDimUnrelated ||
        (globalSceneAnalyzeMode &&
          isAnalyzeSystemReaction &&
          (nextRiskSources.length > 0 ||
            nextRiskTargets.length > 0 ||
            (Array.isArray(normalizedReaction.loopSuggestions) && normalizedReaction.loopSuggestions.length > 0) ||
            normalizedReaction.activeLoopId != null ||
            (Array.isArray(normalizedReaction.actions) && normalizedReaction.actions.length > 0)));
      const stableSceneObjects = sceneObjects
        .map((obj: unknown, idx: number) => {
          const o = asRecord(obj);
          const semantic = asRecord(o?.semantic);
          return {
            id: String(o?.id ?? o?.name ?? `obj_${idx}`),
            severity: String(o?.severity ?? o?.fragility_level ?? ""),
            state: String(o?.state ?? o?.status ?? ""),
            role: String(o?.role ?? semantic?.role ?? ""),
          };
        })
        .sort((a: { id: string }, b: { id: string }) => a.id.localeCompare(b.id));
      const stableSceneEdges = (Array.isArray((sceneForOverrides as any)?.scene?.edges)
        ? (sceneForOverrides as any).scene.edges
        : []
      )
        .map((edge: unknown, idx: number) => {
          const e = asRecord(edge);
          return {
            id: String(e?.id ?? `${e?.from ?? "src"}:${e?.to ?? "dst"}:${idx}`),
            from: String(e?.from ?? ""),
            to: String(e?.to ?? ""),
            weight:
              typeof e?.weight === "number"
                ? Number(e.weight.toFixed(5))
                : typeof e?.strength === "number"
                  ? Number(e.strength.toFixed(5))
                  : null,
          };
        })
        .sort((a: { id: string }, b: { id: string }) => a.id.localeCompare(b.id));
      const reactionSignature = JSON.stringify({
        pipelineRunId: lastAuditRecordRef.current?.runId ?? null,
        sceneObjectCount: allSceneObjectIds.length,
        selectedId: selectedObjectIdState ?? null,
        focusedId: focusedId ?? null,
        highlighted: effectiveHighlighted,
        riskSources: nextRiskSources,
        riskTargets: nextRiskTargets,
        primary: effectivePrimaryId,
        dim: shouldDimUnrelated,
        analyzeSystem: isAnalyzeSystemReaction,
        globalSceneAnalyze: globalSceneAnalyzeMode,
        sceneObjects: stableSceneObjects,
        sceneEdges: stableSceneEdges,
      });
      const selectedObjectChanged = (selectedObjectIdState ?? null) !== (effectivePrimaryId ?? null);
      const sceneVisualSignature = JSON.stringify({
        highlighted: effectivePrimaryId ?? null,
        objects: stableSceneObjects,
      });
      const shouldSkipVisualApply =
        options?.isIngestionUpdate === true &&
        !selectedObjectChanged &&
        lastSceneVisualApplySignatureRef.current === sceneVisualSignature;

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
      if (lastSceneSemanticApplyRef.current === sceneSemanticSignature) {
        emitSceneApplyDiagnostic("apply_skipped", {
          skippedReason: "unified_reaction_duplicate_semantic",
          signature: sceneSemanticSignature,
          semanticSig: sceneSemanticSignature,
        });
        return;
      }
      lastSceneSemanticApplyRef.current = sceneSemanticSignature;
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
          analyzeMode: globalSceneAnalyzeMode ? "global_scene_analysis" : "focused_object_analysis",
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

      const guardChannel = selectionGuardSourceFromReaction(reaction.source);
      const selectionSig = buildSelectionSignature({
        focusedId: effectivePrimaryId,
        highlightedIds: effectiveHighlighted,
        source: guardChannel,
      });
      const prevSelSig = lastSelectionSignatureRef.current;
      traceNexoraSelectionGuard(selectionSig, prevSelSig, guardChannel);
      if (!globalSceneAnalyzeMode && selectionSig !== prevSelSig) {
        lastSelectionSignatureRef.current = selectionSig;
        setObjectSelection({
          highlighted_objects: effectiveHighlighted,
          dim_unrelated_objects: isAnalyzeSystemReaction ? false : shouldDimUnrelated,
        } as any);
      }

      const riskPropagationSignature = JSON.stringify({
        sources: [...nextRiskSources].sort((a, b) => a.localeCompare(b)),
        targets: [...nextRiskTargets].sort((a, b) => a.localeCompare(b)),
      });
      if (lastRiskPropagationSignatureRef.current !== riskPropagationSignature) {
        lastRiskPropagationSignatureRef.current = riskPropagationSignature;
        setRiskPropagation({
          sources: nextRiskSources,
          targets: nextRiskTargets,
        } as any);
      }

      if (shouldSkipVisualApply) {
        if (process.env.NODE_ENV !== "production") {
          console.debug("[Nexora][ReactionSkipped]", {
            reason: "ingestion_same_scene_visual_signature",
            selectedObjectId: selectedObjectIdState ?? null,
            primaryObjectId: effectivePrimaryId ?? null,
          });
        }
        return;
      }
      lastSceneVisualApplySignatureRef.current = sceneVisualSignature;

      if (!isAnalyzeSystemReaction && allSceneObjectIds.length > 0) {
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
          applySceneChangeUpstreamDedup(sceneDecision.scene, reaction.source ?? "unified_reaction");
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

      if (!isAnalyzeSystemReaction && hasExplicitHighlightPayload && primaryHighlightedId) {
        updateSelectedObjectInfo(primaryHighlightedId);
        if (selectedObjectChanged) {
          setSelectedObjectIdState(primaryHighlightedId);
        }
      }

      if (!isAnalyzeSystemReaction && hasExplicitHighlightPayload && normalizedReaction.allowFocusMutation) {
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
      applySceneChangeUpstreamDedup,
      emitSceneApplyDiagnostic,
      sceneJson,
      selectedObjectIdState,
      setSelectedObjectIdState,
      focusedId,
      syncFocusedObjectFromResponse,
      updateSelectedObjectInfo,
      visibleObjectSelection,
    ]
  );
  const applyUnifiedSceneReactionUpstreamDedup = useCallback(
    (
      reaction: UnifiedSceneReaction,
      options?: {
        sceneReplacement?: SceneJson | null;
        allowSceneReplacement?: boolean;
        isIngestionUpdate?: boolean;
      }
    ) => {
      const reactionSig = JSON.stringify({
        reaction,
        allowSceneReplacement: options?.allowSceneReplacement === true,
        hasSceneReplacement: Boolean(options?.sceneReplacement),
        isIngestionUpdate: options?.isIngestionUpdate === true,
      });
      if (lastUpstreamUnifiedReactionSigRef.current === reactionSig) {
        console.debug("[Nexora][UpstreamDedup][Skipped]", {
          type: "reaction",
          signature: reactionSig,
        });
        return;
      }
      lastUpstreamUnifiedReactionSigRef.current = reactionSig;
      applyUnifiedSceneReaction(reaction, options);
    },
    [applyUnifiedSceneReaction]
  );

  const emitSceneIntent = useCallback((intent: SceneIntent) => {
    sceneIntentQueueRef.current.push(intent);
    setSceneIntentEpoch((n) => n + 1);
  }, []);

  useEffect(() => {
    let guard = 0;
    while (sceneIntentQueueRef.current.length > 0 && guard++ < 32) {
      const intent = sceneIntentQueueRef.current.shift();
      if (!intent) break;
      const reaction = buildSceneReactionFromIntent(intent);
      if (!reaction) continue;
      applyUnifiedSceneReactionUpstreamDedup(reaction, { allowSceneReplacement: false });
    }
  }, [sceneIntentEpoch, applyUnifiedSceneReaction]);

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

      applyUnifiedSceneReactionUpstreamDedup(softenedReaction, { allowSceneReplacement: false });
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
          setSceneJson: setSceneJsonForExecutionApply,
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
      setSceneJsonForExecutionApply,
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
  const lastPanelAuthorityReasonRef = useRef<string | null>(null);
  useEffect(() => {
    const lastReason = lastPanelAuthorityReasonRef.current;
    if (activeSidePanel !== "decisions") return;
    if (lastReason !== "analyze_object_success") return;
    const currentView = rightPanelState.view;
    if (currentView && currentView !== "dashboard") return;
    const lockedContextId =
      rightPanelRouteLockRef.current.view === "executive_object"
        ? rightPanelRouteLockRef.current.contextId
        : null;
    const fallbackContextId =
      typeof rightPanelState.contextId === "string" && rightPanelState.contextId.trim().length > 0
        ? rightPanelState.contextId.trim()
        : null;
    const routeContextId = lockedContextId ?? fallbackContextId ?? null;
    if (!routeContextId) return;
    requestPanelAuthorityOpen({
      view: "executive_object",
      family: "EXE",
      source: "analyze_object",
      reason: "analyze_object_success",
      contextId: routeContextId,
      forceOpen: true,
    });
  }, [
    activeSidePanel,
    requestPanelAuthorityOpen,
    rightPanelState.contextId,
    rightPanelState.view,
  ]);
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
        applySceneChangeUpstreamDedup(sceneDecision.scene, "snapshot", { bypassDedupe: true });
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
          requestPanelAuthorityOpen({
            view: snap.rightPanelView,
            family:
              snap.rightPanelView === "dashboard" || snap.rightPanelView === "strategic_command"
                ? "EXE"
                : snap.rightPanelView === "risk" || snap.rightPanelView === "fragility" || snap.rightPanelView === "explanation"
                  ? "RSK"
                  : snap.rightPanelView === "workspace" || snap.rightPanelView === "object" || snap.rightPanelView === "object_focus"
                    ? "SCN"
                    : "SIM",
            source: "system",
            contextId: null,
            reason: "snapshot_restore",
            forceOpen: true,
          });
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
    [applySceneChangeSafe, closeRightPanel, requestPanelAuthorityOpen, snapshots, projectId]
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
  const selectedObjectInfoRef = useRef<typeof selectedObjectInfo>(null);
  const pendingVisualPatchesRef = useRef<null | { memory: MemoryStateV1; targets: string[] }>(null);
  const selectedSetterRef = useRef<(id: string | null) => void>(() => {});
  const handleSelectedChangeRef = useRef<(id: string | null) => void>(() => {});
  const selectedIdRef = useRef<string | null>(null);
  useEffect(() => {
    const lockedAnalyzeObjectId = getAnalyzeLockedObjectId();
    if (!lockedAnalyzeObjectId) return;
    if (selectedObjectIdState === lockedAnalyzeObjectId) return;
    console.log("[Nexora][AnalyzeSelectionLock][PreventedClear]", {
      objectId: lockedAnalyzeObjectId,
    });
    setSelectedObjectIdState(lockedAnalyzeObjectId);
    selectedSetterRef.current?.(lockedAnalyzeObjectId);
    updateSelectedObjectInfo(lockedAnalyzeObjectId);
    writeChatPipelineDebug({
      analyzeSelectionLock: {
        active: true,
        objectId: lockedAnalyzeObjectId,
        lastReason: "prevented_clear",
      },
    });
  }, [
    getAnalyzeLockedObjectId,
    selectedObjectIdState,
    updateSelectedObjectInfo,
    writeChatPipelineDebug,
  ]);
  const overridesRef = useRef<Record<string, any>>({});
  const setOverrideRef = useRef<(id: string, patch: any) => void>(() => {});
  const setViewMode = useSetViewMode();
  const mapRightPanelViewToInteractionPanel = useCallback(
    (view: RightPanelView | null | undefined): NexoraUIState["rightPanel"] => {
      if (view === "object" || view === "object_focus") return "focus_insight";
      if (view === "risk") return "risk";
      if (view === "fragility") return "fragility";
      if (view === "war_room") return "war_room";
      if (view === "dashboard") return "dashboard";
      return null;
    },
    []
  );
  const mapInteractionPanelToRightPanelView = useCallback((panel: NexoraUIState["rightPanel"]): RightPanelView | null => {
    if (panel === "focus_insight") return "object";
    if (panel === "risk") return "risk";
    if (panel === "fragility") return "fragility";
    if (panel === "war_room") return "war_room";
    if (panel === "dashboard") return "dashboard";
    return null;
  }, []);
  const [interactionUiState, setInteractionUiState] = useState<NexoraUIState>(() => INITIAL_NEXORA_UI_STATE);
  const interactionUiStateRef = useRef<NexoraUIState>(INITIAL_NEXORA_UI_STATE);
  const lastDispatchedInteractionIntentRef = useRef<InteractionIntent | null>(null);
  const lastInteractionControllerSigRef = useRef<string | null>(null);
  const lastStateStableDebugSigRef = useRef<string | null>(null);
  const prevIngestionStatusForChatRef = useRef<NexoraUIState["ingestion"]["status"]>("idle");
  useEffect(() => {
    const st = interactionUiState.ingestion.status;
    const prev = prevIngestionStatusForChatRef.current;
    prevIngestionStatusForChatRef.current = st;
    if (st !== "error") return;
    if (prev === "error") return;
    setMessages((m) => appendMessages(m, [makeMsg("assistant", "System temporarily unavailable")]));
  }, [interactionUiState.ingestion.status]);
  const recordInteractionIntent = useCallback((intent: InteractionIntent) => {
    setInteractionUiState((prev) => {
      const next = resolveInteraction(prev, intent);
      interactionUiStateRef.current = next;
      return next;
    });
  }, []);
  const dispatchInteraction = useCallback(
    (intent: InteractionIntent) => {
      const skipIntentDedupe =
        intent.type === "run_ingestion" ||
        intent.type === "ingestion_success" ||
        intent.type === "ingestion_failed";
      if (!skipIntentDedupe) {
        const last = lastDispatchedInteractionIntentRef.current;
        if (
          last &&
          last.type === intent.type &&
          JSON.stringify(last.payload ?? null) === JSON.stringify(intent.payload ?? null)
        ) {
          return interactionUiStateRef.current;
        }
        lastDispatchedInteractionIntentRef.current = intent;
      }
      const prev = interactionUiStateRef.current;
      const next = resolveInteraction(prev, intent);
      if (next === prev) return prev;
      interactionUiStateRef.current = next;
      setInteractionUiState(next);

      if (next.selectedObjectId !== prev.selectedObjectId) {
        selectedSetterRef.current?.(next.selectedObjectId);
        setSelectedObjectIdState((current) => (current === next.selectedObjectId ? current : next.selectedObjectId));
        setSelectedObjectInfo(next.selectedObjectId ? resolveSelectedObjectDetails(next.selectedObjectId) : null);
      }
      if (next.scene.highlightedObjectId !== prev.scene.highlightedObjectId) {
        setFocusedId((current) => (current === next.scene.highlightedObjectId ? current : next.scene.highlightedObjectId));
      }
      if (next.rightPanel !== prev.rightPanel) {
        const nextView = mapInteractionPanelToRightPanelView(next.rightPanel);
        if (!nextView) {
          requestPanelAuthorityClose("interaction_controller_close");
        } else {
          globalThis.console?.debug?.("[Nexora][RightPanelWriter]", {
            writer: "HomeScreen.dispatchInteraction",
            nextView,
            contextId: next.selectedObjectId ?? null,
            reason: "interaction_controller",
          });
          globalThis.console?.debug?.("[Nexora][RightPanelRouteTrace]", {
            writer: "dispatchInteraction",
            requestedView: nextView ?? null,
            resolvedView: nextView ?? null,
            family: nextView === "risk" || nextView === "fragility" ? "RSK" : nextView === "dashboard" ? "EXE" : "SCN",
            contextId: next.selectedObjectId ?? null,
            reason: "interaction_controller",
            source: intent.source,
            rightPanel: next.rightPanel ?? null,
            normalizedPanelAuthoritySource:
              intent.source === "scene"
                ? "object_click"
                : intent.source === "chat"
                  ? "chat_intent"
                  : intent.source === "left_nav"
                    ? "manual_user_nav"
                    : "explicit_command",
          });
          requestPanelAuthorityOpen({
            source:
              intent.source === "scene"
                ? "object_click"
                : intent.source === "chat"
                  ? "chat"
                  : intent.source === "left_nav"
                    ? "left_nav"
                    : "sub_button",
            family: nextView === "risk" || nextView === "fragility" ? "RSK" : nextView === "dashboard" ? "EXE" : "SCN",
            view: nextView,
            contextId: next.selectedObjectId,
            reason: "interaction_controller",
            forceOpen: true,
          });
        }
      }
      return next;
    },
    [
      activeExecutiveObjectId,
      mapInteractionPanelToRightPanelView,
      requestPanelAuthorityClose,
      requestPanelAuthorityOpen,
      resolveSelectedObjectDetails,
      rightPanelState.view,
    ]
  );
  useEffect(() => {
    const onOpenRightPanel = (event: Event) => {
      const detail = (event as CustomEvent<{ view?: string | null; source?: string | null }>).detail;
      const rawView = String(detail?.view ?? "").trim().toLowerCase();
      const panel =
        rawView === "risk"
          ? "risk"
          : rawView === "fragility"
            ? "fragility"
            : rawView === "war_room"
              ? "war_room"
              : rawView === "dashboard"
                ? "dashboard"
                : rawView === "object" || rawView === "object_focus"
                  ? "focus_insight"
                  : null;
      if (!panel) return;
      const source = detail?.source;
      const mappedSource: InteractionIntent["source"] =
        source === "left_nav"
          ? "left_nav"
          : source === "chat"
            ? "chat"
            : source === "object_click"
              ? "scene"
              : "cta_button";
      if (process.env.NODE_ENV !== "production" && source === "left_nav") {
        console.debug("[Nexora][PanelOpenNoSceneChange]", {
          panel,
          sceneSignature: stableSceneObjectsSignature,
        });
      }
      recordInteractionIntent({
        type: "open_panel",
        source: mappedSource,
        payload: { panel },
      });
    };
    window.addEventListener("nexora:open-right-panel", onOpenRightPanel as EventListener);
    return () => window.removeEventListener("nexora:open-right-panel", onOpenRightPanel as EventListener);
  }, [recordInteractionIntent, stableSceneObjectsSignature]);
  useEffect(() => {
    const onObjectsPanelSelect = (event: Event) => {
      const detail = (event as CustomEvent<{ objectId?: string | null }>).detail;
      const objectId = typeof detail?.objectId === "string" ? detail.objectId.trim() : "";
      if (!objectId) return;
      dispatchInteraction({
        type: "select_object",
        source: "objects_panel",
        payload: { objectId },
      });
    };
    window.addEventListener("nexora:objects-panel-select", onObjectsPanelSelect as EventListener);
    return () => window.removeEventListener("nexora:objects-panel-select", onObjectsPanelSelect as EventListener);
  }, [dispatchInteraction]);
  useEffect(() => {
    setInteractionUiState((prev) => {
      const mappedPanel = mapRightPanelViewToInteractionPanel(rightPanelState.view);
      if (
        prev.selectedObjectId === selectedObjectIdState &&
        prev.scene.highlightedObjectId === focusedId &&
        prev.rightPanel === mappedPanel
      ) {
        return prev;
      }
      const next: NexoraUIState = {
        ...prev,
        selectedObjectId: selectedObjectIdState,
        rightPanel: mappedPanel,
        objectsPanel: {
          ...prev.objectsPanel,
          isOpen: rightPanelState.isOpen,
          mode: selectedObjectIdState ? "details" : "list",
        },
        scene: { highlightedObjectId: focusedId },
      };
      interactionUiStateRef.current = next;
      return next;
    });
  }, [focusedId, mapRightPanelViewToInteractionPanel, rightPanelState.isOpen, rightPanelState.view, selectedObjectIdState]);
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const sig = JSON.stringify({
      selectedObjectId: interactionUiState.selectedObjectId,
      rightPanel: interactionUiState.rightPanel,
      highlightedObjectId: interactionUiState.scene.highlightedObjectId,
      lastIntentSource: interactionUiState.meta.lastIntentSource ?? null,
    });
    if (lastInteractionControllerSigRef.current === sig) return;
    lastInteractionControllerSigRef.current = sig;
    console.log("[Nexora][InteractionControllerState]", interactionUiState);
  }, [interactionUiState]);
  useEffect(() => {
    const stableSig = JSON.stringify({
      selectedObjectId: interactionUiState.selectedObjectId,
      rightPanel: interactionUiState.rightPanel,
      ingestion: interactionUiState.ingestion.status,
    });
    if (lastStateStableDebugSigRef.current !== stableSig) {
      lastStateStableDebugSigRef.current = stableSig;
      globalThis.console?.debug?.("[Nexora][StateStable]", {
        selectedObjectId: interactionUiState.selectedObjectId,
        rightPanel: interactionUiState.rightPanel,
        ingestion: interactionUiState.ingestion.status,
      });
    }
  }, [
    interactionUiState.ingestion.status,
    interactionUiState.rightPanel,
    interactionUiState.selectedObjectId,
  ]);
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const selectedObjectId = interactionUiState.selectedObjectId;
    console.debug("[Nexora][Sync]", {
      selectedObjectId,
      source: interactionUiState.meta.lastIntentSource ?? null,
    });
    if (
      interactionUiState.scene.highlightedObjectId &&
      interactionUiState.scene.highlightedObjectId !== selectedObjectId
    ) {
      console.warn("[Nexora][DriftDetected]");
    }
  }, [
    interactionUiState.meta.lastIntentSource,
    interactionUiState.scene.highlightedObjectId,
    interactionUiState.selectedObjectId,
  ]);
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
        applySceneChangeUpstreamDedup(sceneJsonFromCanonDecision(sceneDecision), "workspace", { bypassDedupe: true });
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
        {
          const nextSel = project?.intelligence?.objectSelection ?? null;
          setObjectSelection(nextSel);
          lastSelectionSignatureRef.current = buildSelectionSignature({
            focusedId: project?.scene?.focusedId ?? null,
            highlightedIds: getHighlightedObjectIdsFromSelection(nextSel),
            source: "system",
          });
        }
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
    [applySceneChangeSafe, setFocusedId, setFocusMode, setPinnedSafe]
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
      if (selectionLocked && selectedObjectIdState) {
        if (!id || selectedObjectIdState !== id) return;
      }
      if (!id) {
        if (Date.now() <= passiveDeselectGuardUntilRef.current) {
          if (process.env.NODE_ENV !== "production") {
            globalThis.console?.debug?.("[Nexora][SelectionGuardSkipped]", {
              reason: "ignore_passive_deselect_after_analyze",
              guardUntil: passiveDeselectGuardUntilRef.current,
              focusedId: focusedId ?? null,
              selectedObjectId: selectedObjectIdState ?? null,
            });
          }
          return;
        }
        const currentHighlights = getHighlightedObjectIdsFromSelection(visibleObjectSelection);
        if (focusedId || selectedObjectIdState || currentHighlights.length > 0) {
          if (process.env.NODE_ENV !== "production") {
            globalThis.console?.debug?.("[Nexora][SelectionGuardSkipped]", {
              reason: "ignore_implicit_scene_clear",
              focusedId: focusedId ?? null,
              selectedObjectId: selectedObjectIdState ?? null,
            });
          }
          return;
        }
        const clearSig = buildSelectionSignature({
          focusedId: null,
          highlightedIds: [],
          source: "scene",
        });
        const prevClearSig = lastSelectionSignatureRef.current;
        traceNexoraSelectionGuard(clearSig, prevClearSig, "scene");
        if (clearSig === prevClearSig) {
          return;
        }
        lastSelectionSignatureRef.current = clearSig;
        dispatchInteraction({
          type: "reset_focus",
          source: "scene",
        });
        clearFocusOwnership("Selection cleared.");
        return;
      }
      markUserStartedFlow("object_click");

      const clickSig = buildSelectionSignature({
        focusedId: id,
        highlightedIds: [id],
        source: "scene",
      });
      const prevClickSig = lastSelectionSignatureRef.current;
      traceNexoraSelectionGuard(clickSig, prevClickSig, "scene");
      if (clickSig === prevClickSig) {
        return;
      }
      lastSelectionSignatureRef.current = clickSig;
      dispatchInteraction({
        type: "select_object",
        source: "scene",
        payload: { objectId: id },
      });
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
          return prev === id ? prev : id;
        });
      }
      const nextInfo = resolveSelectedObjectDetails(id);
      setSelectedObjectInfo(nextInfo);
    },
    [
      focusPinned,
      focusMode,
      flashSelectHighlight,
      applyPinToStore,
      clearFocusOwnership,
      dispatchInteraction,
      resolveSelectedObjectDetails,
      markUserStartedFlow,
      selectionLocked,
      focusedId,
      selectedObjectIdState,
      visibleObjectSelection,
      claimFocusOwnership,
      updateSelectedObjectInfo,
      setFocusedId,
      setViewMode,
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
      dispatchInteraction({
        type: "chat_result",
        source: "chat",
        payload: { objectId: id, panel: "focus_insight" },
      });
      applyUnifiedSceneReactionUpstreamDedup(
        buildPanelFocusReaction({
          objectId: id,
          reason: "Focus requested by command, panel, or recommendation.",
        }),
        { allowSceneReplacement: false }
      );
    };
    window.addEventListener("nexora:set-focus-object", onSetFocusObject as EventListener);
    return () => window.removeEventListener("nexora:set-focus-object", onSetFocusObject as EventListener);
  }, [
    applyUnifiedSceneReaction,
    claimFocusOwnership,
    dispatchInteraction,
    focusedId,
    resolveSelectedObjectDetails,
    selectedObjectIdState,
    tracePostSuccessContextDecision,
  ]);
  useEffect(() => {
    const onApplyFragilityScan = (event: Event) => {
      const detail = (
        event as CustomEvent<{
          result?: FragilityScanResponse | null;
          bridge?: string;
          intakeHandoff?: "input_center" | null;
        }>
      ).detail;
      const result = detail?.result;
      if (!result?.ok) return;
      const intakeHandoff = detail?.intakeHandoff ?? null;
      const domainId = activeDomainExperience.experience.domainId;
      const rawDriversEarly = result.drivers ?? [];
      const enrichedDriversEarly = enrichFragilityDriversForDomain(rawDriversEarly, domainId);
      const sceneObjects = Array.isArray(sceneJson?.scene?.objects) ? sceneJson.scene.objects : [];
      const sceneObjectIds = sceneObjects
        .map((obj: unknown, idx: number) => {
          const o = asRecord(obj);
          return String(o?.id ?? o?.name ?? `obj_${idx}`);
        })
        .filter(Boolean);
      const sceneFingerprint = [...sceneObjectIds].sort((a, b) => a.localeCompare(b)).join("|");
      const fragilityRunKey = `${buildFragilityScenePayloadSignature(result.scene_payload, { sceneFingerprint })}::${String(detail?.bridge ?? "")}::${String(result.summary ?? "").slice(0, 160)}`;
      if (fragilityRunKey === lastFragilityScenePayloadSigRef.current) {
        return;
      }
      lastFragilityScenePayloadSigRef.current = fragilityRunKey;
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
      const sceneScopedFragilityReaction = normalizeReactionForScene(
        baseFragilityReaction,
        sceneJson,
        intakeHandoff === "input_center" ? { maxHighlightedObjectIds: 2 } : undefined
      );
      let unifiedFragilityReaction = tuneUnifiedReactionForFragilityLevel(
        sceneScopedFragilityReaction,
        result.fragility_level
      );
      if (intakeHandoff === "input_center") {
        const topId = riskSourcesAligned[0] ?? alignedHighlightIds[0] ?? null;
        unifiedFragilityReaction = {
          ...unifiedFragilityReaction,
          ...(topId ? { primaryObjectId: topId } : {}),
          dimUnrelatedObjects: true,
          primaryScale: Math.min(
            1.28,
            Math.max(1.06, (unifiedFragilityReaction.primaryScale ?? 1.06) * 1.085)
          ),
          secondaryScale: Math.min(
            1.14,
            Math.max(1.02, (unifiedFragilityReaction.secondaryScale ?? 1.02) * 1.04)
          ),
          unrelatedOpacity: Math.max(
            0.5,
            (unifiedFragilityReaction.unrelatedOpacity ?? 0.62) - 0.08
          ),
        };
      }

      applyUnifiedSceneReactionUpstreamDedup(unifiedFragilityReaction, {
        sceneReplacement: null,
        allowSceneReplacement: false,
        isIngestionUpdate: true,
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
        const b13Bias = getB13TrustEvidenceBiasMerged(mergedSignalCount, successfulSourceCount, domainId);
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
      const raw = await chatToBackendLifecycle(payload);
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
    applySceneChangeSafe((prev) => {
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
    }, "inventory_edit");
    selectedSetterRef.current(createdId);
    setFocusedId((prev) => prev ?? createdId);
    setFocusMode("selected");
  }, [applySceneChangeSafe, getUxForObject, setFocusedId, setFocusMode]);

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

  // O1 Extraction Boundary: Persistence controller
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
      const diag = chatPipelineDiagnosticRef.current;
      if (diag) {
        const ev =
          status === "error" || status === "aborted" ? "request_failed" : "request_completed";
        diag(ev, {
          requestSeq: seq,
          chatRequestStatus: status,
          skippedReason: `finalize_request:${status}`,
          targetPanel: rightPanelState.view ?? null,
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

  const releaseChatSendingLock = useCallback(() => {
    isSendingRef.current = false;
  }, []);
  const chatPipelineShellError = chatRequestStatus === "error" ? "chat_error" : null;
  const chatPipelineRefs = useMemo(
    () => ({
      activeRunIdRef: latestChatPipelineRunIdRef,
      lastAssistantMessageSignatureRef: lastAppliedChatPipelineSignatureRef,
    }),
    [latestChatPipelineRunIdRef, lastAppliedChatPipelineSignatureRef]
  );
  const chatPipelineBridges = useMemo(
    () => ({
      applySceneChangeSafe: ((nextOrUpdater: unknown, source: string, options?: { bypassDedupe?: boolean }) => {
        applySceneChangeSafe(
          nextOrUpdater as SceneJson | null | ((prev: SceneJson | null) => SceneJson | null),
          source,
          options
        );
      }) as NonNullable<ChatPipelineBridgeCallbacks["applySceneChangeSafe"]>,
      applySceneChangeUpstreamDedup: ((nextOrUpdater: unknown, source: string, options?: { bypassDedupe?: boolean }) => {
        applySceneChangeUpstreamDedup(nextOrUpdater as SceneJson | null, source, options);
      }) as NonNullable<ChatPipelineBridgeCallbacks["applySceneChangeUpstreamDedup"]>,
      applyUnifiedSceneReactionUpstreamDedup: ((
        reaction: unknown,
        options: { allowSceneReplacement: boolean; sceneReplacement?: unknown | null }
      ) => {
        applyUnifiedSceneReactionUpstreamDedup(reaction as UnifiedSceneReaction, {
          allowSceneReplacement: options.allowSceneReplacement,
          sceneReplacement: (options.sceneReplacement ?? undefined) as SceneJson | null | undefined,
        });
      }) as NonNullable<ChatPipelineBridgeCallbacks["applyUnifiedSceneReactionUpstreamDedup"]>,
      openRightPanel: openRightPanel
        ? (((view: string, source: string, options?: Record<string, unknown>) => {
            openRightPanel(view, source, options);
          }) as NonNullable<ChatPipelineBridgeCallbacks["openRightPanel"]>)
        : null,
      requestPanelAuthorityOpen: ((req) => {
        requestPanelAuthorityOpen(req as NexoraPanelAuthorityRequest);
      }) as RequestPanelAuthorityOpenFn,
      closeRightPanel: closeRightPanel ?? null,
      applyTypeCChatIntent,
      runTypeCAction: null,
    }),
    [
      applySceneChangeSafe,
      applySceneChangeUpstreamDedup,
      applyUnifiedSceneReactionUpstreamDedup,
      applyTypeCChatIntent,
      closeRightPanel,
      openRightPanel,
      requestPanelAuthorityOpen,
    ]
  );

  const chatPipelineSendTextDeps = useMemo(
    (): ChatPipelineSendTextDeps => ({
      activeChatDebugCorrelationRef,
      activeChatRequestRef,
      activeDomainExperience,
      activeExecutiveObjectId,
      activeLoopIdStore,
      activeMode,
      activePanelFamilyAuditRef,
      activeSidePanel,
      analyzeFull,
      analyzeInFlightRef,
      analyzePreflightArmedRef,
      analyzeSelectionLockRef,
      appendMessages,
      applyDecisionActions,
      applyExecutionResultToUi,
      applyProductFlowViewModel,
      applyRetailTriggerEnhancement,
      applySceneFromChat,
      applyUICommands,
      buildChatEffectSignature,
      buildChatRequestPayload,
      buildFailureResponse,
      buildPersistedProjectSnapshot,
      buildStarterSceneFromText,
      buildUnifiedReactionFromChatResponse,
      buildUnifiedReactionFromRetailTriggerConfig,
      chatLoopGuardActiveRef,
      chatLoopGuardDepthRef,
      chatRequestSeqRef,
      chatToBackendLifecycle,
      clearAllOverridesRef,
      demoFlowPauseRef,
      deriveProductFlowViewModel,
      deriveVisualPatch,
      detectRetailTriggerConfig,
      emitChatResult,
      emitDebugEvent,
      emitGuardRailAlerts,
      entryFlowStateRef,
      environmentConfig,
      episodeId,
      evaluateChatPipelineStability,
      evaluateSelectedObjectGuard,
      executeNexoraAction,
      finalizeChatRequest,
      firstMeaningfulState,
      focusMode,
      focusModeStore,
      focusPinned,
      focusedId,
      getAnalyzeLockedObjectId,
      getChatLifecycleErrorMessage,
      getHighlightedObjectIdsFromSelection,
      getLocalChatResponse,
      getRecentDebugEvents,
      hasMeaningfulSceneMutation,
      isAbortLikeError,
      isAnalyzeLikeUserText,
      isLatestChatRequest,
      isMeaningfulPanel,
      isPilotProductMode,
      isRetailDemoScene,
      isRetailScenePayload,
      isSendingRef,
      lastAppliedChatPipelineSignatureRef,
      lastAppliedPanelEffectRef,
      lastAppliedSceneEffectRef,
      lastChatDedupRef,
      latestChatPipelineRunIdRef,
      loading,
      logPanelGuidedPromptWarn,
      loopGuardInFlightByTextRef,
      makeMsg,
      mapNexoraTargetPanelToRightPanelView,
      markUserStartedFlow,
      memory,
      mergeNextObjectSelectionFromUnifiedReaction,
      messagesRef,
      nextDemoFlowSequence,
      normalizeChatInputForDedup,
      normalizeSceneJson,
      objectProfiles,
      objectSelection,
      overridesRef,
      panelFamilyDataFromExecutionPayloads,
      passiveDeselectGuardUntilRef,
      pendingPanelFamilyAuditClearTimeoutRef,
      pendingVisualPatchesRef,
      pickAcceptedChatSceneReplacement,
      pinnedId,
      prefs,
      productModeContext,
      pruneOverridesRef,
      pulseObjectByText,
      pushHistory,
      reactionModeHintFromIntent,
      readPanelFamilySliceDiagnostics,
      resolveChatPipelinePanelOpen,
      resolveExplicitSelectedObject,
      resolveNexoraIntentRoute,
      resolvePreferredPanelFamilyFromIntent,
      rightPanelRouteLockRef,
      rightPanelState,
      rightPanelTab,
      routeChatInput,
      runGuardChecks,
      runNexoraChatPromptPipeline,
      saveProject,
      sceneJson,
      selectedIdRef,
      selectedObjectIdState,
      selectedObjectInfo,
      setActiveMode,
      setActiveSidePanel,
      setCameraLockedByUser,
      setCenterComponent,
      setCenterComponentVisible,
      setCenterOverlay,
      setChatDelayedBusy,
      setChatRequestStatus,
      setEntryFlowState,
      setEpisodeId,
      setLastActions,
      setLoading,
      setMemory,
      setMessages,
      setNoSceneUpdate,
      setObjectSelection,
      setOverrideRef,
      setPrefs,
      setSceneWarn,
      setSelectedObjectIdState,
      setSourceLabel,
      shouldAcceptIncomingSceneReplacement,
      shouldApplyExecutionResultImmediately,
      traceAnalyzeObjectRoute,
      traceAuditRef,
      traceDemoFlowEvent,
      tracePanelFamilyAudit,
      tracePanelFlowRuntime,
      updateMemory,
      updateObjectUx,
      updateSelectedObjectInfo,
      userSafeChatMessage,
      visibleDecisionCockpit,
      visibleFocusedId,
      visibleObjectSelection,
      visibleResponseData,
      visibleRiskPropagation,
      visibleSceneJson,
      visibleSelectedObjectId,
      visibleStrategicAdvice,
      writeChatPipelineDebug,
    }),
    [
    activeExecutiveObjectId,
    activeMode,
    activeDomainExperience,
    activeSidePanel,
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
    pulseObjectByText,
    updateSelectedObjectInfo,
    updateObjectUx,
    finalizeChatRequest,
    isLatestChatRequest,
    isPilotProductMode,
    objectSelection,
    writeChatPipelineDebug,
    ],
  );

  // --- Chat pipeline controller ---
  // O4 complete: `useChatPipelineController` owns sendText + pipeline; shell owns chat state + deps + bridges.
  const chatPipelineController = useChatPipelineController({
    messages,
    inputValue: input,
    isLoading: loading || chatRequestStatus === "submitting",
    error: chatPipelineShellError,
    lastRunId: latestChatPipelineRunIdRef.current,
    refs: chatPipelineRefs,
    bridges: chatPipelineBridges,
    sendTextDeps: chatPipelineSendTextDeps,
    setMessages,
    setChatRequestStatus,
    setLoading,
    setChatDelayedBusy,
    releaseChatSendingLock,
  });
  const {
    callbacks: { sendText, appendMessage, replaceMessages, clearChatError },
    emitChatPipelineDiagnostic,
  } = chatPipelineController;
  useEffect(() => {
    chatPipelineDiagnosticRef.current = emitChatPipelineDiagnostic;
    return () => {
      chatPipelineDiagnosticRef.current = null;
    };
  }, [emitChatPipelineDiagnostic]);
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (homeScreenQa5ArchitectureStableLoggedRef.current) return;
    homeScreenQa5ArchitectureStableLoggedRef.current = true;
    globalThis.console.info("[Nexora][QA][ArchitectureStable]", {
      hasSceneController: Boolean(sceneApplyController),
      hasRightPanelController: Boolean(rightPanelController),
      hasChatController: Boolean(chatPipelineController),
      hasTypeCController: Boolean(typeCOrchestration),
      qaCompleted: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- QA:5 once-only shell composition marker (ref-guarded)
  }, []);

  const runChatInputForQA = useCallback(
    async (qaInput: string) => {
      const requestId = `qa:${Date.now()}:${Math.random().toString(36).slice(2, 7)}`;
      await sendText(qaInput, requestId, { source: "user" });
      if (typeof window === "undefined") return {};
      const w = window as Window & { __NEXORA_DEBUG__?: Record<string, unknown> };
      return (w.__NEXORA_DEBUG__?.chatPipeline as Record<string, unknown> | undefined) ?? {};
    },
    [sendText]
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    const w = window as Window & {
      __NEXORA_QA_FIXTURES__?: {
        clearExplicitSelection?: () => void;
        restoreExplicitSelection?: () => void;
      };
    };
    w.__NEXORA_QA_FIXTURES__ = {
      ...(w.__NEXORA_QA_FIXTURES__ ?? {}),
      clearExplicitSelection: () => {
        selectedSetterRef.current?.(null);
        setSelectedObjectIdState(null);
        setSelectedObjectInfo(null);
      },
      restoreExplicitSelection: () => {
        // No-op by default; scenarios can set their own object selection explicitly.
      },
    };
  }, [setSelectedObjectIdState, setSelectedObjectInfo]);
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

  useEffect(() => {
    const onRequestObjectAnalyze = () => {
      const explicitSelection = resolveExplicitSelectedObject({
        selectedObjectIdState,
        objectSelection,
      });
      if (!explicitSelection.hasExplicitSelection) {
        console.warn("[Nexora][AnalyzeBlocked][NoExplicitSelection]", {
          selectedObjectIdState,
          focusedId,
        });
        return;
      }
      const now = Date.now();
      if (now - lastAnalyzeRequestAtRef.current < 1500) {
        console.warn("[Nexora][AnalyzeLoopPrevented]", {
          reason: "analyze_debounce",
          deltaMs: now - lastAnalyzeRequestAtRef.current,
        });
        return;
      }
      if (analyzeInFlightRef.current) {
        console.warn("[Nexora][AnalyzeLoopPrevented]", {
          reason: "analyze_already_in_flight",
        });
        return;
      }
      lastAnalyzeRequestAtRef.current = now;
      analyzeInFlightRef.current = true;
      analyzePreflightArmedRef.current = true;
      if (explicitSelection.explicitSelectedObjectId) {
        analyzeSelectionLockRef.current = {
          objectId: explicitSelection.explicitSelectedObjectId,
          startedAt: Date.now(),
          requestId: null,
        };
        console.log("[Nexora][AnalyzeSelectionLock][Armed]", {
          objectId: explicitSelection.explicitSelectedObjectId,
        });
        writeChatPipelineDebug({
          analyzeSelectionLock: {
            active: true,
            objectId: explicitSelection.explicitSelectedObjectId,
            lastReason: "armed",
          },
        });
      }
      console.log("[Nexora][AnalyzeAllowed][ExplicitSelection]", {
        objectId: explicitSelection.explicitSelectedObjectId,
      });
      globalThis.console?.warn?.("[NEXORA_ANALYZE_SENDTEXT_REACHED]", {
        selectedObjectIdState: selectedObjectIdState ?? null,
        focusedId: focusedId ?? null,
        timestamp: Date.now(),
      });
      void sendText("Analyze the current system.", undefined, { source: "user" });
    };
    window.addEventListener("nexora:request-object-analyze", onRequestObjectAnalyze as EventListener);
    return () => window.removeEventListener("nexora:request-object-analyze", onRequestObjectAnalyze as EventListener);
  }, [sendText, selectedObjectIdState, focusedId, objectSelection]);

  useEffect(() => {
    const onExecutiveObjectAction = (
      event: Event
    ) => {
      const detail = (event as CustomEvent<{ action?: string; objectId?: string }>).detail;
      const action = String(detail?.action ?? "").trim();
      const objectIdFromEvent = String(detail?.objectId ?? "").trim();
      const routeContextId =
        objectIdFromEvent ||
        activeExecutiveObjectId ||
        (typeof selectedObjectIdState === "string" && selectedObjectIdState.trim()) ||
        (typeof focusedId === "string" && focusedId.trim()) ||
        null;
      if (!routeContextId) return;
      if (action === "war_room") {
        requestPanelAuthorityOpen({
          view: "war_room",
          family: "SIM",
          source: "sub_button",
          reason: "executive_object_action",
          contextId: routeContextId,
          forceOpen: true,
        });
        return;
      }
      if (action === "compare_options") {
        requestPanelAuthorityOpen({
          view: "compare",
          family: "SIM",
          source: "sub_button",
          reason: "executive_object_action",
          contextId: routeContextId,
          forceOpen: true,
        });
        return;
      }
      if (action === "next_move") {
        requestPanelAuthorityOpen({
          view: "advice",
          family: "SIM",
          source: "sub_button",
          reason: "executive_object_action",
          contextId: routeContextId,
          forceOpen: true,
        });
      }
    };
    window.addEventListener("nexora:executive-object-action", onExecutiveObjectAction as EventListener);
    return () =>
      window.removeEventListener("nexora:executive-object-action", onExecutiveObjectAction as EventListener);
  }, [activeExecutiveObjectId, focusedId, requestPanelAuthorityOpen, selectedObjectIdState]);

  const send = useCallback(() => {
    void sendText(input);
  }, [input, sendText]);

  const requestLeftCommandOpen = useCallback((next: boolean) => {
    window.dispatchEvent(new CustomEvent("nexora:left-command-set-open", { detail: { open: next } }));
  }, []);

  const handleLeftCommandPanelClose = useCallback(() => {
    requestLeftCommandOpen(false);
  }, [requestLeftCommandOpen]);

  const handleLeftCommandPanelOpen = useCallback(() => {
    requestLeftCommandOpen(true);
  }, [requestLeftCommandOpen]);

  const handleLeftCommandRun = useCallback(
    (commandId: string) => {
      switch (commandId) {
        case "analyze": {
          markUserStartedFlow("left_command_analyze");
          if (!objectAnalyzeReady) return;
          const explicitSelection = resolveExplicitSelectedObject({
            selectedObjectIdState,
            objectSelection,
          });
          if (!explicitSelection.hasExplicitSelection) {
            console.warn("[Nexora][AnalyzeBlocked][NoExplicitSelection]", {
              source: "left_command_analyze",
            });
            return;
          }
          const now = Date.now();
          if (now - lastAnalyzeRequestAtRef.current < 1500) {
            console.warn("[Nexora][AnalyzeLoopPrevented]", {
              reason: "analyze_debounce",
              deltaMs: now - lastAnalyzeRequestAtRef.current,
            });
            return;
          }
          if (analyzeInFlightRef.current) {
            console.warn("[Nexora][AnalyzeLoopPrevented]", {
              reason: "analyze_already_in_flight",
            });
            return;
          }
          lastAnalyzeRequestAtRef.current = now;
          analyzeInFlightRef.current = true;
          analyzePreflightArmedRef.current = true;
          if (explicitSelection.explicitSelectedObjectId) {
            analyzeSelectionLockRef.current = {
              objectId: explicitSelection.explicitSelectedObjectId,
              startedAt: Date.now(),
              requestId: null,
            };
            console.log("[Nexora][AnalyzeSelectionLock][Armed]", {
              objectId: explicitSelection.explicitSelectedObjectId,
            });
            writeChatPipelineDebug({
              analyzeSelectionLock: {
                active: true,
                objectId: explicitSelection.explicitSelectedObjectId,
                lastReason: "armed",
              },
            });
          }
          console.log("[Nexora][AnalyzeAllowed][ExplicitSelection]", {
            objectId: explicitSelection.explicitSelectedObjectId,
          });
          const t = input.trim();
          globalThis.console?.warn?.("[NEXORA_ANALYZE_SENDTEXT_REACHED]", {
            selectedObjectIdState: selectedObjectIdState ?? null,
            focusedId: focusedId ?? null,
            timestamp: Date.now(),
          });
          void sendText(t || "Analyze the current system.");
          return;
        }
        case "compare":
          markUserStartedFlow("left_command_compare");
          dispatchCanonicalAction(
            normalizeCompareOptions({ rawSource: "LeftCommandAssistant:compare" })
          );
          return;
        case "why_this":
          requestPanelAuthorityOpen({
            view: "advice",
            family: "SIM",
            source: "chat",
            reason: "chat_command",
            forceOpen: true,
          });
          return;
        case "simulate":
          markUserStartedFlow("left_command_simulate");
          dispatchCanonicalAction(
            normalizeRunSimulation({ rawSource: "LeftCommandAssistant:simulate" })
          );
          return;
        case "risk_flow":
          requestPanelAuthorityOpen({
            view: "risk_flow",
            family: "RSK",
            source: "chat",
            reason: "chat_command",
            forceOpen: true,
          });
          return;
        default:
          break;
      }
    },
    [
      dispatchCanonicalAction,
      focusedId,
      input,
      markUserStartedFlow,
      objectAnalyzeReady,
      objectSelection,
      requestPanelAuthorityOpen,
      selectedObjectIdState,
      sendText,
    ]
  );

  const handleUndo = useCallback(() => {
    const history = loadHistory();
    const popped = prepareUndoHistoryPop(history);
    if (!popped) return;
    const { nextHistory, target: prev } = popped;

    setActiveMode(prev.activeMode ?? "business");
    const undoSceneDecision = prev.sceneJson ? evaluateHistoryUndoScene(prev.sceneJson) : canonDecisionMissingSceneBlob();
    applySceneChangeUpstreamDedup(sceneJsonFromCanonDecision(undoSceneDecision), "undo", { bypassDedupe: true });
    setMessages(normalizeMessages(prev.messages));
    try {
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
      if (prev.sessionId) window.localStorage.setItem(SESSION_KEY, prev.sessionId);
    } catch {
      // ignore
    }
    saveProject(withPersistedProjectSavedAt(prev));
  }, [applySceneChangeSafe]);

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
      applySceneChangeUpstreamDedup(sceneJsonFromCanonDecision(backupSceneDecision), "backup", { bypassDedupe: true });
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
  }, [applySceneChangeSafe, setPinnedSafe, updateSelectedObjectInfo]);

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
      applySceneChangeUpstreamDedup(sceneDecision.scene, "timeline");
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
      applyUnifiedSceneReactionUpstreamDedup(timelineReaction, { allowSceneReplacement: false });
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
    {
      const nextOs = extractObjectSelection(payload);
      const osSig = buildSelectionSignature({
        focusedId: focusedId ?? null,
        highlightedIds: getHighlightedObjectIdsFromSelection(nextOs),
        source: "chat",
      });
      const prevOsSig = lastSelectionSignatureRef.current;
      traceNexoraSelectionGuard(osSig, prevOsSig, "chat");
      if (osSig !== prevOsSig) {
        lastSelectionSignatureRef.current = osSig;
        setObjectSelection(nextOs);
      }
    }
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
    applySceneChangeSafe,
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
    focusedId,
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
      applySceneChangeUpstreamDedup(demoScene, "demo", { bypassDedupe: true });
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
    {
      const nextOs = extractObjectSelection(mergedPayload);
      const osSig = buildSelectionSignature({
        focusedId: null,
        highlightedIds: getHighlightedObjectIdsFromSelection(nextOs),
        source: "system",
      });
      const prevDemoSig = lastSelectionSignatureRef.current;
      traceNexoraSelectionGuard(osSig, prevDemoSig, "system");
      if (osSig !== prevDemoSig) {
        lastSelectionSignatureRef.current = osSig;
        setObjectSelection(nextOs);
      }
    }
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
    applySceneChangeSafe,
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
  const sceneFocusIdSetSig = useMemo(
    () => [...sceneFocusIdSet].sort((a, b) => a.localeCompare(b)).join("|"),
    [sceneFocusIdSet]
  );
  const visibleObjectSelectionHighlightSig = useMemo(
    () =>
      [...new Set(getHighlightedObjectIdsFromSelection(visibleObjectSelection))].sort((a, b) => a.localeCompare(b)).join("|"),
    [visibleObjectSelection]
  );
  const activeProfileInitialFocusIdsSig = useMemo(
    () =>
      JSON.stringify(
        Array.isArray(activeProfile?.initial_focus_object_ids)
          ? [...activeProfile.initial_focus_object_ids].map(String).sort()
          : []
      ),
    [activeProfile?.initial_focus_object_ids]
  );
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
    focusOwnership.source,
    focusOwnership.objectId,
    focusOwnership.isPersistent,
    focusOwnership.reason,
    narrativeSceneBinding.focusId,
    narrativeSceneBinding.isActive,
    narrativeSceneBinding.stepId,
    sceneFocusIdSetSig,
    visibleObjectSelectionHighlightSig,
  ]);
  const narrativeObjectSelection = useMemo(
    () => getSceneScopedObjectSelection(narrativeSceneBinding.objectSelection, sceneFocusIdSet),
    [narrativeSceneBinding.objectSelection, sceneFocusIdSet]
  );
  const effectiveObjectSelection = useMemo(() => {
    const executionOverlayActive =
      executionState?.status === "running" || executionState?.status === "paused";
    if (activeSimulation && (executionOverlayActive || !executionState || executionState.status === "stopped")) {
      const baseSelection =
        narrativeSceneBinding.isActive && narrativeObjectSelection
          ? narrativeObjectSelection
          : visibleObjectSelection ?? null;
      const highlighted = [
        ...getHighlightedObjectIdsFromSelection(baseSelection),
        ...activeSimulation.affectedObjectIds,
      ];
      return {
        ...(baseSelection ?? {}),
        highlighted_objects: [...new Set(highlighted)].filter(Boolean),
        risk_sources: [
          ...new Set(activeSimulation.propagationPaths.map((path) => path.from).filter(Boolean)),
        ],
        risk_targets: [
          ...new Set(activeSimulation.propagationPaths.map((path) => path.to).filter(Boolean)),
        ],
        dim_unrelated_objects: true,
      };
    }
    if (narrativeSceneBinding.isActive && narrativeObjectSelection) {
      return narrativeObjectSelection;
    }
    return visibleObjectSelection ?? null;
  }, [
    activeSimulation,
    executionState,
    narrativeObjectSelection,
    narrativeSceneBinding.isActive,
    visibleObjectSelection,
  ]);
  const effectiveObjectSelectionTraceSig = useMemo(
    () =>
      buildSelectionSignature({
        focusedId: focusedId ?? null,
        highlightedIds: Array.isArray(effectiveObjectSelection?.highlighted_objects)
          ? effectiveObjectSelection.highlighted_objects.map(String)
          : [],
        source: "system",
      }),
    [effectiveObjectSelection, focusedId]
  );
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
    activeProfile != null,
    activeProfile?.id,
    activeProfileInitialFocusIdsSig,
    clearFocusOwnership,
    currentSceneTargetId,
    focusOwnership.source,
    focusedId,
    resolvedFocusOwnership.objectId,
    resolvedFocusOwnership.source,
    sceneFocusIdSetSig,
    selectedObjectIdState,
    setFocusedId,
    tracePostSuccessContextDecision,
    updateSelectedObjectInfo,
  ]);
  const narrativeBindingOverrideSig = useMemo(
    () =>
      JSON.stringify({
        active: narrativeSceneBinding.isActive,
        focusId: narrativeSceneBinding.focusId ?? null,
        h: [...narrativeSceneBinding.highlightIds].map(String).sort().join("|"),
        d: [...narrativeSceneBinding.dimIds].map(String).sort().join("|"),
      }),
    [
      narrativeSceneBinding.dimIds,
      narrativeSceneBinding.highlightIds,
      narrativeSceneBinding.isActive,
      narrativeSceneBinding.focusId,
    ]
  );
  useEffect(() => {
    const nextSignature = narrativeBindingOverrideSig;
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
  }, [narrativeBindingOverrideSig]);
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
          openSimPanel(targetView, "open_decision_execution_panel", null);
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
    (contextId: string | null = null, meta?: { source?: NexoraPanelAuthoritySource }) => {
      void meta;
      openComponentPanelFromAction("decision_policy", {
        destinationSurface: "component_panel",
        source: meta?.source ?? "exe_preview",
        caller: "handle_open_decision_policy",
        contextId: contextId ?? null,
        reason: "open_decision_policy_center",
      });
    },
    [openComponentPanelFromAction]
  );

  const handleOpenDecisionGovernancePanel = useCallback(
    (contextId: string | null = null, meta?: { source?: NexoraPanelAuthoritySource }) => {
      void meta;
      openComponentPanelFromAction("decision_governance", {
        destinationSurface: "component_panel",
        source: meta?.source ?? "exe_preview",
        caller: "handle_open_decision_governance",
        contextId: contextId ?? null,
        reason: "open_decision_governance_center",
      });
    },
    [openComponentPanelFromAction]
  );

  const handleOpenExecutiveApprovalPanel = useCallback(
    (contextId: string | null = null, meta?: { source?: NexoraPanelAuthoritySource }) => {
      void meta;
      openComponentPanelFromAction("executive_approval", {
        destinationSurface: "component_panel",
        source: meta?.source ?? "exe_preview",
        caller: "handle_open_executive_approval",
        contextId: contextId ?? null,
        reason: "open_executive_approval_center",
      });
    },
    [openComponentPanelFromAction]
  );

  const handleOpenTimelinePanel = useCallback(
    (contextId: string | null = null) => {
      migrateLegacyButtonToIntent(
        "Open Timeline",
        "openSimPanel:timeline",
        "open_timeline",
        "HomeScreen.tsx",
        {
        destinationSurface: "component_panel",
        source: "exe_preview",
        caller: "handle_open_timeline",
        contextId,
        }
      );
    },
    [migrateLegacyButtonToIntent]
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

  const decisionResultOverrideSig = useMemo(() => {
    if (!decisionResult) return "";
    const h = [...(decisionResult.scene_actions?.highlight ?? [])].map(String).sort().join("|");
    const d = [...(decisionResult.scene_actions?.dim ?? [])].map(String).sort().join("|");
    const aff = [...(decisionResult.simulation_result?.affected_objects ?? [])].map(String).sort().join("|");
    return JSON.stringify({ h, d, aff });
  }, [decisionResult]);
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
  }, [decisionResultOverrideSig]);
  const handleWarRoomOverlayChange = useCallback(
    (summary: WarRoomOverlaySummary | null, detail?: WarRoomOverlayDetail | null) => {
      warRoom.applyOverlaySummary(summary, detail ?? null);
    },
    [warRoom.applyOverlaySummary]
  );
  const decisionAssistantOutput = useMemo(() => {
    const b7 = pipelineB7ActionContextRef.current;
    const lastUser =
      [...messages]
        .reverse()
        .find((m) => m?.role === "user" && String(m?.text ?? "").trim())
        ?.text?.trim() || undefined;
    const fragSource = asRecord(visibleResponseData?.fragility_scan ?? visibleResponseData?.fragility);
    const riskFromResponse =
      (typeof fragSource?.fragility_level === "string" && fragSource.fragility_level) ||
      (typeof fragSource?.level === "string" && fragSource.level) ||
      undefined;
    const b8 = nexoraB8PanelContext;
    const fragileFromB8 = Array.isArray(b8?.objectIds) && b8.objectIds.length > 0 ? b8.objectIds : undefined;
    const driversFromB8 = Array.isArray(b8?.drivers) ? b8.drivers : [];
    const driverIdsFromB8 = driversFromB8.map((d) => String(d.id ?? "").trim()).filter(Boolean);
    const metricsFromDrivers: Record<string, number> = {};
    driversFromB8.forEach((d) => {
      const id = String(d.id ?? "").trim();
      if (id && typeof d.score === "number") metricsFromDrivers[id] = d.score;
    });
    const riskImpacted =
      visibleRiskPropagation && typeof visibleRiskPropagation === "object" && !Array.isArray(visibleRiskPropagation)
        ? (visibleRiskPropagation as { impacted_nodes?: unknown }).impacted_nodes
        : null;
    const riskIds = Array.isArray(riskImpacted)
      ? riskImpacted.map((x) => String(x ?? "").trim()).filter(Boolean)
      : [];

    return runDecisionAssistant({
      domainId: activeDomainExperience.experience.domainId,
      userIntent: lastUser,
      selectedObjectId: visibleSelectedObjectId ?? selectedObjectIdState ?? undefined,
      activePanel: rightPanelState.view ?? undefined,
      riskLevel: b7?.fragilityLevel ?? (typeof b8?.fragilityLevel === "string" ? b8.fragilityLevel : undefined) ?? riskFromResponse,
      fragileObjectIds: b7?.objectIds?.length
        ? b7.objectIds
        : riskIds.length > 0
          ? riskIds
          : highlightedObjectIds.length > 0
            ? highlightedObjectIds
            : fragileFromB8,
      highlightedDriverIds: b7?.drivers?.length
        ? b7.drivers.map((d) => String(d.id ?? "").trim()).filter(Boolean)
        : driverIdsFromB8.length > 0
          ? driverIdsFromB8
          : undefined,
      systemSummary: b7?.summary?.trim() || (typeof b8?.summary === "string" ? b8.summary.trim() : "") || undefined,
      metrics: Object.keys(metricsFromDrivers).length > 0 ? metricsFromDrivers : undefined,
    });
  }, [
    activeDomainExperience.experience.domainId,
    messages,
    visibleSelectedObjectId,
    selectedObjectIdState,
    rightPanelState.view,
    nexoraB8PanelContext,
    visibleResponseData,
    visibleRiskPropagation,
    highlightedObjectIdsSig,
  ]);
  const decisionAssistantOutputOrchestrationSig = useMemo(() => {
    const o = decisionAssistantOutput;
    return [
      o.context.domainId,
      o.context.riskLevel ?? "",
      o.scenarios[0]?.id ?? "",
      o.recommendation.recommendedScenarioId ?? "",
      o.recommendation.posture ?? "",
      Math.round((Number(o.recommendation.confidence) || 0) * 100) / 100,
      [...o.sceneAction.highlightObjectIds].map(String).sort().join(","),
      [...o.sceneAction.dimObjectIds].map(String).sort().join(","),
      o.sceneAction.focusObjectId ?? "",
      o.sceneAction.overlayTone ?? "",
    ].join("::");
  }, [decisionAssistantOutput]);
  const lastDecisionAssistantSceneSigRef = useRef<string | null>(null);
  const decisionAssistantPanelMergeTraceRef = useRef<DecisionAssistantPanelMergeTrace[]>([]);
  const decisionAssistantSceneTelemetryRef = useRef<{ applied: boolean; skippedReason: string | null }>({
    applied: false,
    skippedReason: null,
  });
  const lastDecisionAssistantTelemetrySignatureRef = useRef<string | null>(null);
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
      const assistantMerged = mergeAssistantPanelEnrichment({
        assistant: decisionAssistantOutput.panelData,
        mappedAdvice,
        mappedCompare,
        mappedTimeline,
        mappedWarRoom,
      });
      decisionAssistantPanelMergeTraceRef.current = buildPanelMergeTraceFromEnrichment({
        mappedAdvice,
        mappedCompare,
        mappedTimeline,
        mappedWarRoom,
        mergedAdvice: assistantMerged.advice,
        mergedCompare: assistantMerged.compare,
        mergedTimeline: assistantMerged.timeline,
        mergedWarRoom: assistantMerged.warRoom,
      });
      const nextPanelDataInput = {
        ...(guardedResponseRecord ?? {}),
        raw: visibleResponseData ?? visibleSceneJson ?? null,
        responseData: visibleResponseData ?? null,
        sceneJson: visibleSceneJson ?? null,
        scene_json: visibleSceneJson ?? null,
        dashboard: mappedDashboard,
        advice: assistantMerged.advice,
        strategicAdvice: assistantMerged.advice,
        promptFeedback: visibleResponseData?.prompt_feedback ?? null,
        prompt_feedback: visibleResponseData?.prompt_feedback ?? null,
        decisionCockpit: visibleDecisionCockpit ?? visibleResponseData?.decision_cockpit ?? null,
        decision_cockpit: visibleDecisionCockpit ?? visibleResponseData?.decision_cockpit ?? null,
        executiveSummary: mappedDashboard,
        simulation: mappedSimulation,
        decision_simulation: visibleResponseData?.decision_simulation ?? decisionResult?.simulation_result ?? null,
        decisionSimulation: visibleResponseData?.decision_simulation ?? decisionResult?.simulation_result ?? null,
        timeline: assistantMerged.timeline,
        risk: visibleRiskPropagation ?? visibleResponseData?.risk_propagation ?? null,
        memory: visibleMemoryInsights ?? visibleResponseData?.decision_memory ?? null,
        replay: mappedReplay,
        canonicalRecommendation: visibleResponseData?.canonical_recommendation ?? null,
        canonical_recommendation: visibleResponseData?.canonical_recommendation ?? null,
        decisionResult: decisionResult ?? null,
        decision_result: decisionResult ?? null,
        warRoom: assistantMerged.warRoom,
        war_room: assistantMerged.warRoom,
        compare: assistantMerged.compare,
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
      const panelInputSignature = buildPanelContractSignature(nextPanelDataInput);
      latestPanelInputSignatureRef.current = panelInputSignature;
      latestRawPanelSharedDataRef.current = nextPanelDataInput;
      const activeFamilyAudit = activePanelFamilyAuditRef.current;
      const cachedPanelValidation = validatedPanelCacheRef.current;
      const shouldDeferPanelValidation =
        interactionUiState.ingestion.status === "loading" || analyzeInFlightRef.current;
      const panelContract = shouldDeferPanelValidation
        ? cachedPanelValidation.result ?? {
            data: EMPTY_PANEL_SHARED_DATA,
            contractFailed: false,
            contractDebugSignature: `deferred:${panelInputSignature}`,
            contractFailureDetail: null,
          }
        : cachedPanelValidation.signature === panelInputSignature && cachedPanelValidation.result
          ? cachedPanelValidation.result
          : getValidatedPanelSharedDataOnce(nextPanelDataInput, panelInputSignature);
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
      stableVisibleSceneJson,
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
      selectedObjectIdState,
      traceAuditRef,
      nexoraB8PanelContext,
      decisionAssistantOutput,
      interactionUiState.ingestion.status,
      getValidatedPanelSharedDataOnce,
    ]
  );
  const panelData = panelDataValidation.data;
  const stablePanelDataBySignatureRef = useRef<PanelSharedData | null>(null);
  const stablePanelDataBySignatureSigRef = useRef<string | null>(null);
  useEffect(() => {
    if (interactionUiState.ingestion.status !== "success") return;
    const panelInputSignature = latestPanelInputSignatureRef.current;
    const rawPanelSharedData = latestRawPanelSharedDataRef.current;
    if (!panelInputSignature || !rawPanelSharedData) return;
    const runId = lastAuditRecordRef.current?.runId ?? panelInputSignature;
    if (lastValidatedAnalyzeRunRef.current === runId) return;
    if (validatedPanelCacheRef.current.signature === panelInputSignature && validatedPanelCacheRef.current.result) {
      lastValidatedAnalyzeRunRef.current = runId;
      return;
    }
    if (process.env.NODE_ENV !== "production") {
      console.debug("[Nexora][AnalyzeSceneApplyOnce]", { runId });
      console.debug("[Nexora][PanelValidationDeferred]", { runId, panelInputSignature });
    }
    const result = getValidatedPanelSharedDataOnce(rawPanelSharedData, panelInputSignature);
    validatedPanelCacheRef.current = {
      signature: panelInputSignature,
      result,
    };
    lastValidatedAnalyzeRunRef.current = runId;
  }, [interactionUiState.ingestion.status, getValidatedPanelSharedDataOnce]);
  const stablePanelData = useMemo(() => {
    const nextSignature = buildPanelSharedDataSignature(panelData);
    if (stablePanelDataBySignatureSigRef.current === nextSignature && stablePanelDataBySignatureRef.current) {
      return stablePanelDataBySignatureRef.current;
    }
    stablePanelDataBySignatureSigRef.current = nextSignature;
    stablePanelDataBySignatureRef.current = panelData;
    return panelData;
  }, [panelData]);
  const decisionAssistantSceneOrchestrationSig = useMemo(
    () =>
      JSON.stringify({
        assistant: decisionAssistantOutputOrchestrationSig,
        decisionScene: decisionResultOverrideSig,
      }),
    [decisionAssistantOutputOrchestrationSig, decisionResultOverrideSig]
  );

  useEffect(() => {
    const backendHighlights = decisionResult?.scene_actions?.highlight;
    const backendOwnsScene = Array.isArray(backendHighlights) && backendHighlights.length > 0;
    if (backendOwnsScene) {
      lastDecisionAssistantSceneSigRef.current = null;
      decisionAssistantSceneTelemetryRef.current = {
        applied: false,
        skippedReason: "backend_scene_authority",
      };
      return;
    }

    const action = decisionAssistantOutput.sceneAction;
    const hasHint =
      (Array.isArray(action.highlightObjectIds) && action.highlightObjectIds.length > 0) ||
      Boolean(action.focusObjectId);
    if (!hasHint) {
      decisionAssistantSceneTelemetryRef.current = {
        applied: false,
        skippedReason: "no_assistant_scene_hints",
      };
      return;
    }

    const hasUserSceneTarget =
      (typeof selectedObjectIdState === "string" && selectedObjectIdState.trim().length > 0) ||
      (typeof focusedId === "string" && focusedId.trim().length > 0) ||
      getHighlightedObjectIdsFromSelection(objectSelection).length > 0;
    if (!hasUserSceneTarget) {
      decisionAssistantSceneTelemetryRef.current = {
        applied: false,
        skippedReason: "global_scene_no_object_target",
      };
      return;
    }

    const sig = JSON.stringify({
      h: action.highlightObjectIds,
      d: action.dimObjectIds,
      f: action.focusObjectId ?? null,
      t: action.overlayTone ?? null,
    });
    if (lastDecisionAssistantSceneSigRef.current === sig) {
      decisionAssistantSceneTelemetryRef.current = {
        applied: false,
        skippedReason: "duplicate_reaction_signature",
      };
      return;
    }
    lastDecisionAssistantSceneSigRef.current = sig;
    decisionAssistantSceneTelemetryRef.current = { applied: true, skippedReason: null };

    emitSceneIntent({ type: "assistant_scene", payload: action });
  }, [decisionAssistantSceneOrchestrationSig, emitSceneIntent, focusedId, objectSelection, selectedObjectIdState]);

  useEffect(() => {
    logDecisionAssistantTelemetryOnce(
      {
        output: decisionAssistantOutput,
        panelMergeTrace: decisionAssistantPanelMergeTraceRef.current,
        sceneApplied: decisionAssistantSceneTelemetryRef.current.applied,
        sceneSkippedReason: decisionAssistantSceneTelemetryRef.current.applied
          ? null
          : decisionAssistantSceneTelemetryRef.current.skippedReason,
      },
      lastDecisionAssistantTelemetrySignatureRef
    );
  }, [decisionAssistantOutputOrchestrationSig, panelDataValidation.contractDebugSignature, decisionResultOverrideSig]);

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
  const handleOpenCenterExecutionSurface = useCallback(
    (component: CenterExecutionSurface) => {
      // Only pass supported surface types to openCenterComponent
      if (component === "workspace" || component === "simulation" || component === "object_inspection") return;
      openCenterComponent(component);
    },
    [openCenterComponent]
  );
  const previousMetaCognitionConfidenceRef = useRef<number | null>(null);
  const executiveMetaCognitionSnapshot = useMemo(() => {
    const canonicalRecommendation = readCanonicalRecommendation(visibleResponseData, stableVisibleSceneJson);
    return buildExecutiveMetaCognitionSnapshot({
      organizationId: activeWorkspaceId ?? activeProjectId ?? null,
      sceneJson: stableVisibleSceneJson ?? visibleSceneJson ?? null,
      responseData: visibleResponseData ?? null,
      strategicAdvice: visibleStrategicAdvice ?? null,
      canonicalRecommendation,
      previousConfidence: previousMetaCognitionConfidenceRef.current,
      timestamp: canonicalRecommendation?.created_at ?? 0,
    });
  }, [
    activeProjectId,
    activeWorkspaceId,
    stableSceneObjectsSignature,
    stableVisibleSceneJson,
    visibleResponseData,
    visibleSceneJson,
    visibleStrategicAdvice,
  ]);
  useEffect(() => {
    previousMetaCognitionConfidenceRef.current = executiveMetaCognitionSnapshot.confidenceEvolution.current;
    logMetaCognitionDiagnostics(executiveMetaCognitionSnapshot);
  }, [executiveMetaCognitionSnapshot]);
  const lastRightPanelHostInputTraceRef = useRef<string | null>(null);
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const trace = {
      count: visibleSceneObjects.length,
      ids: visibleSceneObjects.map((o: any) => o?.id ?? "unknown"),
    };
    const sig = JSON.stringify({ ...trace, hasVisibleSceneObjects });
    if (lastRightPanelHostInputTraceRef.current === sig) return;
    lastRightPanelHostInputTraceRef.current = sig;
    globalThis.console.log("[Nexora][RightPanel][VISIBLE_SOURCE]", trace);
  }, [visibleSceneObjects, hasVisibleSceneObjects]);

  const panelContent = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        height: "100%",
        width: "100%",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {allowDecisionPanels ? <PrimaryDecisionStrip panelData={stablePanelData} isEmptyState={isEmptyState} /> : null}
      <div style={{ flex: 1, minHeight: 0, minWidth: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {allowDecisionPanels ? (
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
      activeExecutiveObjectId={liveExecutiveObjectId}
      selectedObjectLabel={selectedObjectLabelForWarRoom}
      executiveObjectPanelData={executiveObjectPanelData}
      focusedId={visibleFocusedId ?? null}
      resolveObjectLabel={resolveSceneObjectLabel}
      demoProfile={activeProfile ?? undefined}
      decisionResult={decisionResult ?? undefined}
      decisionLoading={decisionExecutionLoading}
      decisionStatus={decisionUiState.status}
      decisionError={decisionUiState.error}
      firstMeaningfulState={firstMeaningfulState}
      allowRealPanelData={allowRealPanelData}
      isSystemUnhealthy={isSystemUnhealthy}
      visibleSceneObjects={visibleSceneObjects}
      hasVisibleSceneObjects={hasVisibleSceneObjects}
      domainCatalogDomainId={activeDomainExperience.experience.domainId}
      onAddDomainObject={handleDomainCatalogObjectSelect}
      activeExecutiveView={activeExecutiveView}
      guidedPromptDebug={null}
      panelFamilyAuditDebug={panelFamilyAuditDebug}
      metaCognition={executiveMetaCognitionSnapshot}
      warRoom={warRoom}
      onSceneUpdateFromTimeline={handleSceneUpdateFromTimeline}
      onSimulateDecision={() =>
        dispatchCanonicalAction(normalizeRunSimulation({ rawSource: "RightPanelHost:simulate" }))
      }
      onCompareOptions={() =>
        migrateLegacyButtonToIntent("Open Compare", "normalizeCompareOptions", "open_compare", "HomeScreen.tsx", {
          destinationSurface: "component_panel",
          source: "exe_preview",
          caller: "RightPanelHost:compare",
        })
      }
      onOpenWarRoom={() =>
        requestPanelAuthorityOpen({
          view: "war_room",
          family: "SIM",
          source: "sub_button",
          reason: "right_panel_host_war_room",
          forceOpen: true,
        })
      }
      onOpenRiskFlow={() =>
        requestPanelAuthorityOpen({
          view: "risk_flow",
          family: "RSK",
          source: "sub_button",
          reason: "right_panel_host_risk_flow",
          forceOpen: true,
        })
      }
      onOpenWhyThis={() =>
        requestPanelAuthorityOpen({
          view: "advice",
          family: "SIM",
          source: "sub_button",
          reason: "right_panel_host_why_this",
          forceOpen: true,
        })
      }
      onOpenStrategicCommand={() =>
        routeIntentToPanel("open_strategic_command", {
          destinationSurface: "component_panel",
          source: "exe_preview",
          caller: "right_panel_host_strategic_command",
        })
      }
      onOpenStrategicCommandFull={() => {
        if (process.env.NODE_ENV !== "production") {
          globalThis.console?.debug?.("[Nexora][StrategicCommand][OpenFull]", {
            source: "exe_preview",
            target: "component_panel",
            contextId: rightPanelState.contextId ?? null,
          });
        }
        routeIntentToPanel("open_strategic_command", {
          destinationSurface: "component_panel",
          source: "exe_preview",
          caller: "sub_button:strategic_command_preview_open_full",
        });
      }}
      onOpenTimeline={() =>
        migrateLegacyButtonToIntent(
          "Open Timeline",
          "normalizeOpenCenterTimeline",
          "open_timeline",
          "HomeScreen.tsx",
          {
            destinationSurface: "component_panel",
            source: "exe_preview",
            caller: "RightPanelHost:timeline",
          }
        )
      }
      onOpenMemory={() =>
        migrateLegacyButtonToIntent("Open Decision Memory", "requestPanelAuthorityOpen:memory", "open_decision_memory", "HomeScreen.tsx", {
          destinationSurface: "component_panel",
          source: "exe_preview",
          caller: "RightPanelHost:memory",
        })
      }
      onOpenDecisionLifecycle={() =>
        migrateLegacyButtonToIntent(
          "Open Lifecycle",
          "requestPanelAuthorityOpen:decision_lifecycle",
          "open_decision_lifecycle",
          "HomeScreen.tsx",
          {
            destinationSurface: "component_panel",
            source: "exe_preview",
            caller: "RightPanelHost:decision_lifecycle",
          }
        )
      }
      onOpenStrategicLearning={() =>
        migrateLegacyButtonToIntent(
          "Open Strategic Learning",
          "requestPanelAuthorityOpen:strategic_learning",
          "open_strategic_learning",
          "HomeScreen.tsx",
          {
            destinationSurface: "component_panel",
            source: "exe_preview",
            caller: "RightPanelHost:strategic_learning",
          }
        )
      }
      onOpenMetaDecision={() =>
        migrateLegacyButtonToIntent("Open Decision Strategic", "requestPanelAuthorityOpen:meta_decision", "open_decision_strategic", "HomeScreen.tsx", {
          destinationSurface: "component_panel",
          source: "exe_preview",
          caller: "RightPanelHost:decision_strategic",
        })
      }
      onOpenCognitiveStyle={() =>
        migrateLegacyButtonToIntent("Open Decision Lens", "requestPanelAuthorityOpen:cognitive_style", "open_decision_lens", "HomeScreen.tsx", {
          destinationSurface: "component_panel",
          source: "exe_preview",
          caller: "RightPanelHost:decision_lens",
        })
      }
      onOpenTeamDecision={() =>
        openComponentPanelFromAction("team_decision", {
          destinationSurface: "component_panel",
          source: "exe_preview",
          caller: "RightPanelHost:team_decision",
          reason: "executive_dashboard_open_team_decision",
        })
      }
      onOpenCollaborationIntelligence={() =>
        migrateLegacyButtonToIntent(
          "Open Collaboration Intelligence",
          "requestPanelAuthorityOpen:collaboration_intelligence",
          "open_collaboration_intelligence",
          "HomeScreen.tsx",
          {
            destinationSurface: "component_panel",
            source: "exe_preview",
            caller: "RightPanelHost:collaboration_intelligence",
          }
        )
      }
      onOpenDecisionCouncil={() =>
        openComponentPanelFromAction("decision_council", {
          destinationSurface: "component_panel",
          source: "exe_preview",
          caller: "RightPanelHost:decision_council",
          reason: "executive_dashboard_open_decision_council",
        })
      }
      onOpenOrgMemory={() =>
        openComponentPanelFromAction("org_memory", {
          destinationSurface: "component_panel",
          source: "exe_preview",
          caller: "RightPanelHost:org_memory",
          reason: "executive_dashboard_open_org_memory",
        })
      }
      onOpenDecisionPolicy={handleOpenDecisionPolicyPanel}
      onOpenDecisionGovernance={handleOpenDecisionGovernancePanel}
      onOpenExecutiveApproval={handleOpenExecutiveApprovalPanel}
      onOpenDecisionTimeline={() =>
        requestPanelAuthorityOpen({
          view: "decision_timeline",
          family: "SIM",
          source: "sub_button",
          reason: "right_panel_host_decision_timeline",
          forceOpen: true,
        })
      }
      onOpenConfidenceCalibration={() =>
        migrateLegacyButtonToIntent(
          "Open Confidence Calibration",
          "requestPanelAuthorityOpen:confidence_calibration",
          "open_calibration",
          "HomeScreen.tsx",
          {
            destinationSurface: "component_panel",
            source: "exe_preview",
            caller: "RightPanelHost:confidence_calibration",
          }
        )
      }
      onOpenOutcomeFeedback={() =>
        migrateLegacyButtonToIntent("Open Outcome Feedback", "requestPanelAuthorityOpen:outcome_feedback", "open_outcome_feedback", "HomeScreen.tsx", {
          destinationSurface: "component_panel",
          source: "exe_preview",
          caller: "RightPanelHost:outcome_feedback",
        })
      }
      onOpenPatternIntelligence={() =>
        migrateLegacyButtonToIntent(
          "Open Pattern Intelligence",
          "requestPanelAuthorityOpen:pattern_intelligence",
          "open_pattern_intelligence",
          "HomeScreen.tsx",
          {
            destinationSurface: "component_panel",
            source: "exe_preview",
            caller: "RightPanelHost:pattern_intelligence",
          }
        )
      }
      onOpenScenarioTree={() =>
        migrateLegacyButtonToIntent(
          "Open Scenario Tree",
          "requestPanelAuthorityOpen:scenario_tree",
          "open_scenario_tree",
          "HomeScreen.tsx",
          {
            destinationSurface: "component_panel",
            source: "exe_preview",
            caller: "RightPanelHost:scenario_tree",
          }
        )
      }
      onOpenDashboard={handleOpenDashboard}
      onOpenPanelView={(view) =>
        requestPanelAuthorityOpen({
          view,
          family:
            view === "dashboard" || view === "strategic_command" ? "EXE" : view === "risk" || view === "fragility" ? "RSK" : "SIM",
          source: "sub_button",
          reason: "right_panel_host_help_footer",
          forceOpen: true,
        })
      }
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
      onOpenCenterComponent={handleOpenCenterExecutionSurface}
        />
        ) : (
          <div
            style={{
              ...softCardStyle,
              margin: 12,
              padding: 12,
              color: nx.muted,
              fontSize: 12,
            }}
          >
            No analysis yet. Start by describing your system.
          </div>
        )}
      </div>
    </div>
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

  const leftCommandMessages = useMemo(
    () =>
      messages.map((m, idx) => ({
        id: String(m.id ?? `msg-${idx}-${m.role}`),
        role: m.role,
        text: typeof m.text === "string" ? m.text : String(m.text ?? ""),
        confidence:
          m.role === "assistant" && typeof m.meta?.confidence === "number"
            ? m.meta.confidence
            : undefined,
        followUp:
          m.role === "assistant" && Array.isArray(m.meta?.followUp)
            ? m.meta.followUp.slice(0, 2)
            : undefined,
      })),
    [messages]
  );

  const leftCommandContextSummary = useMemo(() => {
    const s = (lastAnalysisSummary ?? "").trim();
    const base = s.length > 160 ? `${s.slice(0, 159)}…` : s;
    const reflection = executiveMetaCognitionSnapshot.assistantReflectionLine;
    if (!base) return reflection.length > 220 ? `${reflection.slice(0, 219)}…` : reflection;
    const combined = `${base} Meta-cognition: ${reflection}`;
    return combined.length > 260 ? `${combined.slice(0, 259)}…` : combined;
  }, [executiveMetaCognitionSnapshot, lastAnalysisSummary]);

  const leftCommandPortalNode =
    isClientMounted && leftCommandPortalHost ? (
      createPortal(
        <div
          style={{
            display: leftCommandPanelOpen ? "block" : "none",
            height: "100%",
          }}
        >
          <LeftCommandAssistant
            open={leftCommandPanelOpen}
            messages={leftCommandMessages}
            input={input}
            loading={chatDelayedBusy}
            activeContextSummary={leftCommandContextSummary}
            suggestedCommands={leftSuggestedCommands}
            onInputChange={setInput}
            onSubmit={send}
            onClose={handleLeftCommandPanelClose}
            onOpen={handleLeftCommandPanelOpen}
            onRunCommand={handleLeftCommandRun}
          />
        </div>,
        leftCommandPortalHost
      )
    ) : null;

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
  const chatQAPanelNode =
    process.env.NODE_ENV === "development" && showChatPipelineQA ? (
      <ChatPipelineQAPanel runChatInput={runChatInputForQA} />
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
  const traceSceneObjectIdsSig = useMemo(
    () => [...traceSceneObjectIds].sort((a, b) => a.localeCompare(b)).join("|"),
    [traceSceneObjectIds]
  );
  const gettingStartedExplicitSelection = resolveExplicitSelectedObject({
    selectedObjectIdState,
    objectSelection,
  });
  const gettingStartedState = resolveGettingStartedState({
    sceneJson: visibleSceneJson,
    selectedObjectId: gettingStartedExplicitSelection.explicitSelectedObjectId,
  });
  const hasAnalysisForCompare = Boolean(decisionResult ?? readCanonicalRecommendation(visibleResponseData, visibleSceneJson));
  const selectedObjectLabelForGettingStarted =
    resolveSceneObjectLabel(gettingStartedExplicitSelection.explicitSelectedObjectId) ??
    gettingStartedExplicitSelection.explicitSelectedObjectId;
  const logGettingStartedAction = useCallback(
    (
      action:
        | "load_demo"
        | "describe_system"
        | "open_objects"
        | "highlight_selectable"
        | "ask_assistant"
        | "read_executive_brief"
        | "analyze_object"
        | "view_object"
        | "compare_options"
    ) => {
      console.log("[Nexora][GettingStarted][Action]", {
        action,
        state: gettingStartedState,
      });
    },
    [gettingStartedState]
  );
  const handleGettingStartedLoadDemo = useCallback(() => {
    markUserStartedFlow("load_demo_click");
    logGettingStartedAction("load_demo");
    setEntryFlowState("objects_created");
    window.dispatchEvent(
      new CustomEvent("nexora:load-demo-scenario", {
        detail: {
          demo: activeDomainExperience.experience.defaultDemoId,
          domainId: activeDomainExperience.experience.domainId,
        },
      })
    );
  }, [activeDomainExperience, logGettingStartedAction, markUserStartedFlow]);
  const handleGettingStartedDescribeSystem = useCallback(() => {
    markUserStartedFlow("describe_system_click");
    logGettingStartedAction("describe_system");
    setEntryFlowState("describing_system");
    requestAnimationFrame(() => {
      const inputEl = document.getElementById("nexora-chat-input") as HTMLInputElement | null;
      inputEl?.focus();
    });
  }, [logGettingStartedAction, markUserStartedFlow]);
  const handleGettingStartedReadExecutiveBrief = useCallback(() => {
    markUserStartedFlow("read_executive_brief_click");
    logGettingStartedAction("read_executive_brief");
    handleOpenDashboard();
  }, [handleOpenDashboard, logGettingStartedAction, markUserStartedFlow]);
  const handleGettingStartedOpenObjects = useCallback(() => {
    markUserStartedFlow("open_objects_click");
    logGettingStartedAction("open_objects");
    requestPanelAuthorityOpen({
      view: "object",
      source: "manual_user_nav",
      reason: "getting_started_open_objects",
      contextId: null,
      forceOpen: true,
    });
  }, [logGettingStartedAction, markUserStartedFlow, requestPanelAuthorityOpen]);
  const handleGettingStartedHighlightSelectable = useCallback(() => {
    markUserStartedFlow("highlight_selectable_click");
    logGettingStartedAction("highlight_selectable");
    const objects = Array.isArray(visibleSceneJson?.scene?.objects) ? visibleSceneJson.scene.objects : [];
    const highlighted = objects
      .map((obj: any, idx: number) => String(obj?.id ?? obj?.name ?? `${obj?.type ?? "obj"}:${idx}`))
      .filter(Boolean)
      .slice(0, 12);
    setObjectSelection({
      highlighted_objects: highlighted,
      dim_unrelated_objects: false,
    } as any);
  }, [logGettingStartedAction, markUserStartedFlow, setObjectSelection, visibleSceneJson]);
  const handleGettingStartedAskAssistant = useCallback(() => {
    markUserStartedFlow("ask_assistant_click");
    logGettingStartedAction("ask_assistant");
    setInput("Which object should I analyze first?");
    setCenterOverlay("input");
  }, [logGettingStartedAction, markUserStartedFlow]);
  const handleGettingStartedAnalyzeObject = useCallback(() => {
    markUserStartedFlow("analyze_object_click");
    logGettingStartedAction("analyze_object");
    window.dispatchEvent(new Event("nexora:request-object-analyze"));
  }, [logGettingStartedAction, markUserStartedFlow]);
  const handleGettingStartedViewObject = useCallback(() => {
    markUserStartedFlow("view_object_click");
    logGettingStartedAction("view_object");
    requestPanelAuthorityOpen({
      view: "object",
      source: "manual_user_nav",
      reason: "getting_started_view_object",
      contextId: gettingStartedExplicitSelection.explicitSelectedObjectId ?? null,
      forceOpen: true,
    });
  }, [gettingStartedExplicitSelection.explicitSelectedObjectId, logGettingStartedAction, markUserStartedFlow, requestPanelAuthorityOpen]);
  const handleGettingStartedCompareOptions = useCallback(() => {
    markUserStartedFlow("compare_options_click");
    logGettingStartedAction("compare_options");
    if (!hasAnalysisForCompare) {
      setSceneWarn("Run analysis first to compare options.");
      return;
    }
    requestPanelAuthorityOpen({
      view: "compare",
      family: "SIM",
      source: "manual_user_nav",
      reason: "getting_started_compare_options",
      contextId: gettingStartedExplicitSelection.explicitSelectedObjectId ?? null,
      forceOpen: true,
    });
  }, [
    gettingStartedExplicitSelection.explicitSelectedObjectId,
    hasAnalysisForCompare,
    logGettingStartedAction,
    markUserStartedFlow,
    requestPanelAuthorityOpen,
  ]);
  const shouldShowGettingStarted =
    !hasUserStartedFlow &&
    (entryFlowState === "idle" || entryFlowState === "describing_system") &&
    centerComponent == null;
  const showGettingStartedCenter = false;
  const homescreenBeforeSceneTriggerSig = useMemo(
    () =>
      JSON.stringify({
        sel: effectiveObjectSelectionTraceSig,
        dim: effectiveObjectSelection?.dim_unrelated_objects === true,
        focusMode,
        focusPinned,
        focusedId: focusedId ?? null,
        selectedObjectId: selectedObjectIdState ?? null,
        rightPanelTab,
        hasScene: Boolean(visibleSceneJson),
        sceneSample: traceSceneObjectIdsSig,
      }),
    [
      effectiveObjectSelection?.dim_unrelated_objects,
      effectiveObjectSelectionTraceSig,
      focusMode,
      focusPinned,
      focusedId,
      rightPanelTab,
      selectedObjectIdState,
      traceSceneObjectIdsSig,
      visibleSceneJson,
    ]
  );
  useEffect(() => {
    if (!homescreenBeforeSceneTriggerSig) return;
    if (process.env.NODE_ENV !== "production") {
      console.log("[Nexora][EffectTrigger]", { homescreenBeforeSceneTriggerSig, ran: true });
    }
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
  }, [homescreenBeforeSceneTriggerSig]);
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
    console.log("[Nexora][PanelRouteSkipped]", {
      reason: "data_driven_auto_open_disabled",
      wouldHaveOpened: "explanation",
      source: "investor_demo",
    });
  }, [investorDemo.demo.active, investorDemo.demo.step, investorDemoHasAnalysis]);

  useEffect(() => {
    if (!investorDemo.demo.active) return;
    if (investorDemo.demo.step < 1 || !investorDemoHasAnalysis) return;
    const primaryId =
      resolveInvestorDemoFocusObjectId(visibleResponseData, visibleSceneJson) ??
      extractSceneObjectIds(visibleSceneJson)[0] ??
      null;
    if (!primaryId) return;
    const invDemoSelSig = buildSelectionSignature({
      focusedId: primaryId,
      highlightedIds: [primaryId],
      source: "system",
    });
    const prevInvSig = lastSelectionSignatureRef.current;
    traceNexoraSelectionGuard(invDemoSelSig, prevInvSig, "system");
    if (invDemoSelSig !== prevInvSig) {
      lastSelectionSignatureRef.current = invDemoSelSig;
      setObjectSelection((prev: any) => ({
        ...(prev && typeof prev === "object" ? prev : {}),
        highlighted_objects: [primaryId],
      }));
    }
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
    decisionAnalysisSelectorResponseSignature,
    decisionAnalysisSelectorSceneSignature,
    investorDemo.demo.active,
    investorDemo.demo.step,
    investorDemoHasAnalysis,
    setFocusMode,
    updateSelectedObjectInfo,
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

  const typeCDerivedExecutiveSummary = useMemo(
    () =>
      buildTypeCExecutiveSummaryFromState({
        sceneJson,
        selectedObjectId: selectedObjectIdState,
        focusedObjectId: focusedId,
        fragilitySignals: {
          pipelineStatus: pipelineStatusUi,
          riskPropagation: visibleRiskPropagation,
          responseData: visibleResponseData,
          highlightedObjectIds,
        },
      }),
    [
      focusedId,
      highlightedObjectIds,
      pipelineStatusUi,
      sceneJson,
      selectedObjectIdState,
      visibleResponseData,
      visibleRiskPropagation,
    ]
  );
  const typeCExecutiveSummary = typeCDerivedExecutiveSummary ?? typeCCommandExecutiveSummary;

  typeCExecutiveInsightContextRef.current = {
    focusedId,
    selectedObjectIdState,
    typeCExecutiveSummary,
  };

  const typeCExecutiveActions = useMemo(
    () =>
      typeCExecutiveSummary
        ? buildTypeCExecutiveActions({
            summary: typeCExecutiveSummary,
            aiInsight: typeCAIExecutiveInsight,
            selectedObjectId: selectedObjectIdState,
          })
        : [],
    [selectedObjectIdState, typeCAIExecutiveInsight, typeCExecutiveSummary]
  );

  const handleTypeCExecutiveAction = useCallback(
    (action: TypeCExecutiveAction): void => {
      const resolved = resolveTypeCActionPanel(action);
      if (!resolved) return;

      const contextId = action.targetObjectId ?? selectedObjectIdState ?? focusedId ?? null;
      const signature = `${action.id}:${action.kind}:${resolved.panelId}:${contextId ?? "none"}`;
      const now = Date.now();
      const last = lastTypeCExecutiveActionPanelRef.current;
      if (last?.signature === signature && now - last.at < 600) return;
      lastTypeCExecutiveActionPanelRef.current = { signature, at: now };

      globalThis.console.info("[Nexora][TypeC][ActionToPanel]", {
        actionId: action.id,
        kind: action.kind,
        panelId: resolved.panelId,
        reason: resolved.reason,
      });

      if (resolved.panelId === "object_focus") {
        openScnPanel("object_focus", contextId, "type_c_executive_action_analyze_object");
        return;
      }
      if (resolved.panelId === "risk") {
        openRskPanel("risk", "type_c_executive_action_explain_risk", contextId);
        return;
      }
      if (resolved.panelId === "risk_flow") {
        openRskPanel("risk_flow", "type_c_executive_action_monitor_signal", contextId);
        return;
      }
      if (resolved.panelId === "war_room") {
        openSimPanel("war_room", "type_c_executive_action_open_scenario", contextId);
        return;
      }
      if (resolved.panelId === "compare") {
        openSimPanel("compare", "type_c_executive_action_compare_options", contextId);
      }
    },
    [focusedId, openRskPanel, openScnPanel, openSimPanel, selectedObjectIdState]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const debugWindow = window as typeof window & {
      __NEXORA_DEBUG__?: Record<string, unknown>;
    };
    debugWindow.__NEXORA_DEBUG__ = debugWindow.__NEXORA_DEBUG__ ?? {};
    debugWindow.__NEXORA_DEBUG__.typeCExecutiveSummary = typeCExecutiveSummary;
    debugWindow.__NEXORA_DEBUG__.typeCAIExecutiveInsight = typeCAIExecutiveInsight;
    debugWindow.__NEXORA_DEBUG__.enhanceTypeCExecutiveSummary = enhanceTypeCExecutiveSummary;
  }, [enhanceTypeCExecutiveSummary, typeCAIExecutiveInsight, typeCExecutiveSummary]);

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
        applyUnifiedSceneReactionUpstreamDedup(tuned, { allowSceneReplacement: false });
      } else if (focusInScene) {
        const panel = buildPanelFocusReaction({ objectId: focusInScene, reason });
        const scoped = normalizeReactionForScene(panel, sceneJson);
        const tuned = tuneUnifiedReactionForFragilityLevel(scoped, snap.scene.fragilityLevel);
        applyUnifiedSceneReactionUpstreamDedup(tuned, { allowSceneReplacement: false });
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

  // O1 Extraction Boundary: Ingestion controller
  const runBusinessTextIngestionPipeline = useCallback(
    async (text: string, sourceLabel: string): Promise<boolean> => {
      const t = text.trim();
      if (!t) return false;
      if (interactionUiStateRef.current.ingestion.status === "loading") {
        return false;
      }
      const bridgeSource = sourceLabel.trim() || "ingestion";
      const ingestionInteractionSource: InteractionIntent["source"] =
        sourceLabel === "source_control_panel" || /chat|assistant|hud/i.test(sourceLabel) ? "chat" : "cta_button";
      const ingestionFailureMessage = "System unavailable. Try again later.";

      dispatchInteraction({
        type: "run_ingestion",
        source: ingestionInteractionSource,
      });

      let res: SubmitManualTextIngestionResult;
      try {
        res = await submitManualTextIngestion({
          text: t,
          title: "manual_text",
          source_label: bridgeSource,
          domain: activeDomainExperience.experience.domainId,
        });
      } catch {
        dispatchInteraction({
          type: "ingestion_failed",
          source: ingestionInteractionSource,
          payload: { message: ingestionFailureMessage },
        });
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
        return false;
      }

      if (res === "skipped_in_flight") {
        dispatchInteraction({ type: "ingestion_success", source: ingestionInteractionSource });
        return true;
      }
      logNexoraMetric("input_submitted", { mode: nexoraMode });
      if (!res) {
        dispatchInteraction({
          type: "ingestion_failed",
          source: ingestionInteractionSource,
          payload: { message: ingestionFailureMessage },
        });
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
        return false;
      }
      if (!res.ok) {
        dispatchInteraction({
          type: "ingestion_failed",
          source: ingestionInteractionSource,
          payload: { message: ingestionFailureMessage },
        });
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
        return false;
      }

      setLastTextIngestionResult(res);

      const bridgeSig = buildIngestionFragilityBridgeSignature(res, activeDomainExperience.experience.domainId);
      if (lastIngestionFragilityBridgeSigRef.current === bridgeSig) {
        dispatchInteraction({ type: "ingestion_success", source: ingestionInteractionSource });
        return true;
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
          if (sourceLabel === "source_control_panel" && typeof window !== "undefined") {
            requestPanelAuthorityOpen({
              view: "fragility",
              family: "RSK",
              source: "system",
              forceOpen: true,
              reason: "input_analysis_result",
            });
            window.dispatchEvent(
              new CustomEvent("nexora:analysis-complete", {
                detail: {
                  ok: true,
                  source: "input_center",
                  summary: (scan.summary?.trim() || res.bundle.summary?.trim() || "").slice(0, 240),
                  riskLevel: normalizeFragilityLevelForUi(scan.fragility_level) ?? scan.fragility_level ?? null,
                },
              })
            );
          }
          dispatchInteraction({ type: "ingestion_success", source: ingestionInteractionSource });
          return true;
        }
        lastIngestionFragilityBridgeSigRef.current = null;
        setLastTextIngestionResult(null);
        dispatchInteraction({
          type: "ingestion_failed",
          source: ingestionInteractionSource,
          payload: { message: ingestionFailureMessage },
        });
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
        return false;
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          globalThis.console?.warn?.("[Nexora][B2] fragility_bridge_failed", err);
        }
        lastIngestionFragilityBridgeSigRef.current = null;
        setLastTextIngestionResult(null);
        dispatchInteraction({
          type: "ingestion_failed",
          source: ingestionInteractionSource,
          payload: { message: ingestionFailureMessage },
        });
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
        return false;
      }
    },
    [
      activeDomainExperience.experience.domainId,
      activeWorkspaceId,
      commitPipelineStatus,
      dispatchInteraction,
      mergePipelineStatus,
      ensureBackendUserId,
      nexoraMode,
      requestPanelAuthorityOpen,
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
      const detail = (event as CustomEvent<{ text?: string; source?: string; openCompareAfter?: boolean; openPanel?: string }>).detail;
      if (detail?.openCompareAfter === true) {
        openCompareAfterPipelineReadyRef.current = true;
      }
      const rawText = typeof detail?.text === "string" ? detail.text : "";
      const source =
        typeof detail?.source === "string" && detail.source.trim() ? detail.source.trim() : "business_text";
      const wantsFragilityPanel =
        detail?.openPanel === "fragility" || detail?.openPanel === "fragility_scan" || source === "source_control_panel";
      if (wantsFragilityPanel && source !== "source_control_panel") {
        requestPanelAuthorityOpen({
          view: "fragility",
          family: "RSK",
          source: "system",
          reason: "nexora_run_business_text_ingestion",
          forceOpen: true,
        });
      }
      void (async () => {
        let failed = false;
        try {
          const ok = await runBusinessTextIngestionPipeline(rawText, source);
          failed = !ok;
        } catch {
          failed = true;
        } finally {
          if (typeof window !== "undefined" && source === "source_control_panel") {
            window.dispatchEvent(
              new CustomEvent("nexora:input-pipeline-finished", { detail: { source, failed } })
            );
          }
        }
      })();
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
  }, [runBusinessTextIngestionPipeline, runUnifiedMultiSourceAssessment, requestPanelAuthorityOpen]);

  useEffect(() => {
    if (!isDevIngestion || typeof window === "undefined") return;
    void prefetchIngestionConnectorCatalogDev();
  }, []);

  useEffect(() => {
    if (!isDevIngestion || typeof window === "undefined") return;
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

  const sceneContextOverlayLines = useMemo(() => {
    const rp =
      visibleRiskPropagation && typeof visibleRiskPropagation === "object" && !Array.isArray(visibleRiskPropagation)
        ? (visibleRiskPropagation as Record<string, unknown>)
        : null;
    const impacted = Array.isArray(rp?.impacted_nodes)
      ? (rp.impacted_nodes as unknown[]).map((x) => String(x ?? "").trim()).filter(Boolean).slice(0, 6)
      : [];
    const frag = pipelineStatusUi.fragilityLevel ? String(pipelineStatusUi.fragilityLevel).toUpperCase() : null;
    const hi = highlightedObjectIds.filter(Boolean).slice(0, 3);

    const line1 =
      impacted[0] != null
        ? `Top risk: ${impacted[0]}`
        : frag
          ? `Pressure: ${frag}`
          : hi.length > 0
            ? `Focus: ${hi.join(", ")}`
            : "Top risk: —";

    const line2 =
      impacted.length > 1
        ? `Impact: ${impacted.slice(1, 4).join(", ")}`
        : hi.length > 1
          ? `Objects: ${hi.join(", ")}`
          : "Impact: open Risk flow for paths";

    return { line1, line2 };
  }, [highlightedObjectIdsSig, visibleRiskPropagation, pipelineStatusUi.fragilityLevel]);

  const centerWorkflowContextId = useMemo(() => {
    const rp = typeof rightPanelState.contextId === "string" ? rightPanelState.contextId.trim() : "";
    if (rp) return rp;
    const sel = typeof selectedObjectIdState === "string" ? selectedObjectIdState.trim() : "";
    if (sel) return sel;
    const fid = typeof focusedId === "string" ? focusedId.trim() : "";
    return fid || null;
  }, [focusedId, rightPanelState.contextId, selectedObjectIdState]);

  const stableSceneJsonDuringPanelValidation = stableVisibleSceneJson;
  const lastSceneCanvasInputTraceRef = useRef<string | null>(null);
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const count = countSceneObjects(stableSceneJsonDuringPanelValidation);
    const ids = sceneObjectIds(stableSceneJsonDuringPanelValidation);
    const sig = JSON.stringify({ count, ids });
    if (lastSceneCanvasInputTraceRef.current === sig) return;
    lastSceneCanvasInputTraceRef.current = sig;
    globalThis.console.log("[Nexora][SceneCanvas][INPUT]", {
      count,
      ids,
    });
  }, [stableSceneJsonDuringPanelValidation]);
  const sceneNode = (
    <div className="nx-executive-scene-host" style={{ ...executiveStageFrameStyle, zIndex: 0 }}>
      {centerOverlay === "input" ? (
        <SourceControlPanel mode="center" onClose={() => setCenterOverlay(null)} />
      ) : null}
      {analysisHandoffBanner ? (
        <div
          className="pointer-events-none absolute left-1/2 top-6 z-50 -translate-x-1/2"
          role="status"
          aria-live="polite"
        >
          <div className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-800 shadow-md">
            {analysisHandoffBanner.highRisk ? "High system risk detected" : "System stable with minor risks"}
          </div>
        </div>
      ) : null}
      <div
        style={{
          position: "absolute",
          top: showPipelineStatusHud ? 96 : 12,
          left: 12,
          zIndex: 4,
          pointerEvents: "none",
        }}
      >
        <ExecutiveSceneOperationalStrip
          operationalState={
            pipelineStatusUi.status === "processing"
              ? "Processing"
              : pipelineStatusUi.status === "error"
                ? "Attention required"
                : "Operational"
          }
          primarySignal={sceneContextOverlayLines.line1}
          secondarySignal={sceneContextOverlayLines.line2}
          activeInsight={typeCExecutiveSummary?.headline ?? null}
          objectCount={countSceneObjects(stableSceneJsonDuringPanelValidation)}
          fragilityLabel={pipelineStatusUi.fragilityLevel}
        />
      </div>
      {/* Three.js (Canvas always mounted for stable hooks) */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom:
            centerComponent && !isLargeCenterWorkspaceComponent(centerComponent) ? "min(40%, 420px)" : 0,
          zIndex: 0,
          transition: "bottom 180ms ease",
          contain: "layout size style",
          overflow: "hidden",
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
          sceneJson={stableSceneJsonDuringPanelValidation}
          propagationPayload={visibleResponseData}
          scenarioTrigger={warRoom.scenarioTrigger}
          onScenarioOverlayChange={handleWarRoomOverlayChange}
          objectSelection={effectiveObjectSelection}
          getUxForObject={getUxForObject}
          objectUxById={objectUxById}
          selectedObjectId={interactionUiState.selectedObjectId}
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

      {showGettingStartedCenter ? (
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
              maxWidth: 560,
            }}
          >
            <div style={{ color: nx.lowMuted, fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {gettingStartedState === "empty" ? "Getting started" : gettingStartedState === "objects_no_selection" ? "Select an object to analyze" : "Ready to analyze"}
            </div>
            <div style={{ color: nx.text, fontSize: 18, fontWeight: 800, marginTop: 6 }}>
              {gettingStartedState === "empty"
                ? "Describe your system in one sentence. I will map it and show you what matters."
                : gettingStartedState === "objects_no_selection"
                  ? "Choose one object in the scene or object list first."
                  : `Ready to analyze: ${selectedObjectLabelForGettingStarted ?? "selected object"}`}
            </div>
            {gettingStartedState === "empty" ? (
              <div style={{ color: nx.lowMuted, fontSize: 12, marginTop: 6 }}>
                Example: "Delivery is late due to supplier delays."
              </div>
            ) : null}
            <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              {gettingStartedState === "empty" ? (
                <>
                  <button type="button" onClick={handleGettingStartedLoadDemo} style={{ height: 32, padding: "0 12px", borderRadius: 10, border: "1px solid rgba(96,165,250,0.38)", background: "rgba(59,130,246,0.2)", color: "#dbeafe", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                    Load Business Demo
                  </button>
                  <button type="button" onClick={handleGettingStartedDescribeSystem} style={{ height: 32, padding: "0 12px", borderRadius: 10, border: "1px solid rgba(148,163,184,0.22)", background: "rgba(2,6,23,0.5)", color: "#cbd5e1", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                    Describe System
                  </button>
                  <button type="button" onClick={handleGettingStartedReadExecutiveBrief} style={{ height: 32, padding: "0 12px", borderRadius: 10, border: "1px solid rgba(148,163,184,0.22)", background: "rgba(2,6,23,0.5)", color: "#cbd5e1", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                    Read Executive Brief
                  </button>
                </>
              ) : null}
              {gettingStartedState === "objects_no_selection" ? (
                <>
                  <button type="button" onClick={handleGettingStartedOpenObjects} style={{ height: 32, padding: "0 12px", borderRadius: 10, border: "1px solid rgba(96,165,250,0.38)", background: "rgba(59,130,246,0.2)", color: "#dbeafe", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                    Open Objects
                  </button>
                  <button type="button" onClick={handleGettingStartedHighlightSelectable} style={{ height: 32, padding: "0 12px", borderRadius: 10, border: "1px solid rgba(148,163,184,0.22)", background: "rgba(2,6,23,0.5)", color: "#cbd5e1", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                    Highlight selectable objects
                  </button>
                  <button type="button" onClick={handleGettingStartedAskAssistant} style={{ height: 32, padding: "0 12px", borderRadius: 10, border: "1px solid rgba(148,163,184,0.22)", background: "rgba(2,6,23,0.5)", color: "#cbd5e1", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                    Ask Assistant
                  </button>
                </>
              ) : null}
              {gettingStartedState === "ready_with_selection" ? (
                <>
                  <button
                    type="button"
                    onClick={handleGettingStartedAnalyzeObject}
                    disabled={!objectAnalyzeReady}
                    title={!objectAnalyzeReady ? "Select an object first" : undefined}
                    style={{ height: 32, padding: "0 12px", borderRadius: 10, border: "1px solid rgba(96,165,250,0.38)", background: objectAnalyzeReady ? "rgba(59,130,246,0.2)" : "rgba(71,85,105,0.25)", color: objectAnalyzeReady ? "#dbeafe" : "#94a3b8", fontSize: 12, fontWeight: 700, cursor: objectAnalyzeReady ? "pointer" : "not-allowed", opacity: objectAnalyzeReady ? 1 : 0.7 }}
                  >
                    Analyze Object
                  </button>
                  <button type="button" onClick={handleGettingStartedViewObject} style={{ height: 32, padding: "0 12px", borderRadius: 10, border: "1px solid rgba(148,163,184,0.22)", background: "rgba(2,6,23,0.5)", color: "#cbd5e1", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                    View Object
                  </button>
                  <button
                    type="button"
                    onClick={handleGettingStartedCompareOptions}
                    disabled={!hasAnalysisForCompare}
                    title={!hasAnalysisForCompare ? "Run analysis first to compare options." : undefined}
                    style={{ height: 32, padding: "0 12px", borderRadius: 10, border: "1px solid rgba(148,163,184,0.22)", background: hasAnalysisForCompare ? "rgba(2,6,23,0.5)" : "rgba(71,85,105,0.25)", color: hasAnalysisForCompare ? "#cbd5e1" : "#94a3b8", fontSize: 12, fontWeight: 600, cursor: hasAnalysisForCompare ? "pointer" : "not-allowed", opacity: hasAnalysisForCompare ? 1 : 0.7 }}
                  >
                    Compare Options
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

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
            pointerEvents: "auto",
            background: nx.workspacePanelBg,
            backdropFilter: "blur(8px)",
            boxShadow: nx.workspaceShadow,
            overflow: "hidden",
            transition: "height 180ms ease, min-height 180ms ease, opacity 180ms ease, transform 180ms ease",
            opacity: centerComponentVisible ? 1 : 0,
            ...(isLargeCenterWorkspaceComponent(centerComponent)
              ? {
                  top: "10vh",
                  left: "50%",
                  right: "auto",
                  bottom: "auto",
                  transform: centerComponentVisible ? "translateX(-50%)" : "translateX(-50%) scale(0.98)",
                  width: "min(900px, calc(100% - 32px))",
                  height: centerComponentVisible ? "min(70vh, 880px)" : 0,
                  maxHeight: "min(70vh, 880px)",
                  minHeight: centerComponentVisible ? 240 : 0,
                  borderRadius: 16,
                  border: `1px solid ${nx.border}`,
                }
              : {
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: centerComponentVisible ? "min(40%, 420px)" : 0,
                  maxHeight: 420,
                  minHeight: centerComponentVisible ? 220 : 0,
                  borderTop: `1px solid ${nx.border}`,
                  borderTopLeftRadius: 14,
                  borderTopRightRadius: 14,
                }),
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
                      : centerComponent === "strategic_command_full"
                        ? "Strategic Command"
                        : centerComponent === "team_decision"
                          ? "Team Decision"
                          : centerComponent === "decision_council"
                            ? "Decision Council"
                            : centerComponent === "org_memory"
                              ? "Organization Memory"
                              : centerComponent === "decision_policy"
                                ? "Decision Policy"
                                : centerComponent === "executive_approval"
                                  ? "Executive Approval"
                                  : centerComponent === "decision_governance"
                                    ? "Decision Governance"
                                    : centerComponent === "confidence_calibration"
                                      ? "Confidence Calibration"
                                      : centerComponent === "pattern_intelligence"
                                        ? "Pattern Intelligence"
                                        : centerComponent === "strategic_learning"
                                          ? "Strategic Learning"
                                          : centerComponent === "decision_strategic"
                                            ? "Decision Strategic"
                                            : centerComponent === "decision_lens"
                                              ? "Decision Lens"
                                              : centerComponent === "collaboration_intelligence"
                                                ? "Collaboration Intelligence"
                                                : centerComponent === "outcome_feedback"
                                                  ? "Outcome Feedback"
                                                  : centerComponent === "decision_memory"
                                                    ? "Decision Memory"
                                                    : centerComponent === "decision_lifecycle"
                                                      ? "Decision Lifecycle"
                                                      : centerComponent === "scenario_tree"
                                                        ? "Scenario Tree"
                                    : "Deep Analysis"}
                </div>
                <div style={{ color: nx.lowMuted, fontSize: 11, lineHeight: 1.4 }}>
                  {centerComponent === "strategic_command_full"
                    ? "Insight, actions, and impact — your compact war-room workspace."
                    : isLargeCenterWorkspaceComponent(centerComponent)
                      ? "Full executive workflow. The right rail stays on your current context for summary."
                      : "Deep analysis workspace. Scene remains visible for context."}
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
              {centerComponent === "compare" ||
              centerComponent === "timeline" ||
              centerComponent === "analysis" ? (
                <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Primary analysis
                </div>
              ) : null}
              {centerComponent === "strategic_command_full" ? (
                <StrategicCommandFull
                  workspaceId={visibleResponseData?.workspace_id ?? activeWorkspaceId ?? null}
                  projectId={visibleResponseData?.project_id ?? activeProjectId ?? null}
                  responseData={visibleResponseData ?? visibleSceneJson ?? null}
                  canonicalRecommendation={readCanonicalRecommendation(visibleResponseData, visibleSceneJson)}
                  decisionResult={decisionResult ?? undefined}
                  memoryEntries={decisionMemoryEntries}
                  onOpenView={handleStrategicCommandFullRouteView}
                />
              ) : null}
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
                    openRskPanel("risk_flow", "decision_compare_view_risk_flow", null, {
                      source: "component_panel",
                    })
                  }
                  onViewScenarioTree={() =>
                    openSimPanel("scenario_tree", "decision_compare_view_scenario_tree", null, {
                      source: "component_panel",
                    })
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
                  onOpenDecisionPolicy={() =>
                    handleOpenDecisionPolicyPanel(null, { source: "component_panel" })
                  }
                  onOpenExecutiveApproval={() =>
                    handleOpenExecutiveApprovalPanel(null, { source: "component_panel" })
                  }
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
                  metaCognition={executiveMetaCognitionSnapshot}
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
                    openSimPanel("war_room", "decision_timeline_return_war_room", null, {
                      source: "component_panel",
                    })
                  }
                />
              ) : null}
              {centerComponent === "team_decision" ? (
                <TeamDecisionPanel
                  responseData={visibleResponseData ?? visibleSceneJson ?? null}
                  canonicalRecommendation={readCanonicalRecommendation(visibleResponseData, visibleSceneJson)}
                  decisionResult={decisionResult ?? undefined}
                  memoryEntries={decisionMemoryEntries}
                  onOpenCompare={() =>
                    migrateLegacyButtonToIntent(
                      "Open Compare",
                      "normalizeCompareOptions",
                      "open_compare",
                      "HomeScreen.tsx",
                      {
                        destinationSurface: "component_panel",
                        source: "component_panel",
                        caller: "center_team_decision:compare",
                        contextId: centerWorkflowContextId,
                      }
                    )
                  }
                  onOpenTimeline={() =>
                    migrateLegacyButtonToIntent(
                      "Open Timeline",
                      "normalizeOpenCenterTimeline",
                      "open_timeline",
                      "HomeScreen.tsx",
                      {
                        destinationSurface: "component_panel",
                        source: "component_panel",
                        caller: "center_team_decision:timeline",
                        contextId: centerWorkflowContextId,
                      }
                    )
                  }
                  onOpenWarRoom={() =>
                    openSimPanel("war_room", "center_team_decision_war_room", centerWorkflowContextId, {
                      source: "component_panel",
                    })
                  }
                  onOpenCognitiveStyle={() =>
                    migrateLegacyButtonToIntent(
                      "Open Decision Lens",
                      "requestPanelAuthorityOpen:cognitive_style",
                      "open_decision_lens",
                      "HomeScreen.tsx",
                      {
                        destinationSurface: "component_panel",
                        source: "component_panel",
                        caller: "center_team_decision:cognitive_style",
                        contextId: centerWorkflowContextId,
                      }
                    )
                  }
                  onOpenCollaborationIntelligence={() =>
                    migrateLegacyButtonToIntent(
                      "Open Collaboration Intelligence",
                      "requestPanelAuthorityOpen:collaboration_intelligence",
                      "open_collaboration_intelligence",
                      "HomeScreen.tsx",
                      {
                        destinationSurface: "component_panel",
                        source: "component_panel",
                        caller: "center_team_decision:collaboration_intelligence",
                        contextId: centerWorkflowContextId,
                      }
                    )
                  }
                />
              ) : null}
              {centerComponent === "decision_council" ? (
                <AutonomousDecisionCouncilPanel
                  workspaceId={visibleResponseData?.workspace_id ?? activeWorkspaceId ?? null}
                  projectId={visibleResponseData?.project_id ?? activeProjectId ?? null}
                  responseData={visibleResponseData ?? visibleSceneJson ?? null}
                  canonicalRecommendation={readCanonicalRecommendation(visibleResponseData, visibleSceneJson)}
                  decisionResult={decisionResult ?? undefined}
                  memoryEntries={decisionMemoryEntries}
                  onOpenCompare={() =>
                    migrateLegacyButtonToIntent(
                      "Open Compare",
                      "normalizeCompareOptions",
                      "open_compare",
                      "HomeScreen.tsx",
                      {
                        destinationSurface: "component_panel",
                        source: "component_panel",
                        caller: "center_decision_council:compare",
                        contextId: centerWorkflowContextId,
                      }
                    )
                  }
                  onOpenDecisionGovernance={() =>
                    openComponentPanelFromAction("decision_governance", {
                      destinationSurface: "component_panel",
                      source: "decision_strip",
                      caller: "center_decision_council",
                      contextId: centerWorkflowContextId,
                    })
                  }
                  onOpenExecutiveApproval={() =>
                    openComponentPanelFromAction("executive_approval", {
                      destinationSurface: "component_panel",
                      source: "decision_strip",
                      caller: "center_decision_council",
                      contextId: centerWorkflowContextId,
                    })
                  }
                  onOpenCollaborationIntelligence={() =>
                    migrateLegacyButtonToIntent(
                      "Open Collaboration Intelligence",
                      "requestPanelAuthorityOpen:collaboration_intelligence",
                      "open_collaboration_intelligence",
                      "HomeScreen.tsx",
                      {
                        destinationSurface: "component_panel",
                        source: "component_panel",
                        caller: "center_decision_council:collaboration_intelligence",
                        contextId: centerWorkflowContextId,
                      }
                    )
                  }
                />
              ) : null}
              {centerComponent === "org_memory" ? (
                <OrgMemoryPanel
                  workspaceId={visibleResponseData?.workspace_id ?? activeWorkspaceId ?? null}
                  memoryEntries={decisionMemoryEntries}
                  canonicalRecommendation={readCanonicalRecommendation(visibleResponseData, visibleSceneJson)}
                  onOpenMemory={() =>
                    migrateLegacyButtonToIntent(
                      "Open Decision Memory",
                      "requestPanelAuthorityOpen:memory",
                      "open_decision_memory",
                      "HomeScreen.tsx",
                      {
                        destinationSurface: "component_panel",
                        source: "component_panel",
                        caller: "center_org_memory:memory",
                        contextId: centerWorkflowContextId,
                      }
                    )
                  }
                  onOpenStrategicLearning={() =>
                    migrateLegacyButtonToIntent(
                      "Open Strategic Learning",
                      "requestPanelAuthorityOpen:strategic_learning",
                      "open_strategic_learning",
                      "HomeScreen.tsx",
                      {
                        destinationSurface: "component_panel",
                        source: "component_panel",
                        caller: "center_org_memory:strategic_learning",
                        contextId: centerWorkflowContextId,
                      }
                    )
                  }
                  onOpenTeamDecision={() =>
                    openComponentPanelFromAction("team_decision", {
                      destinationSurface: "component_panel",
                      source: "decision_strip",
                      caller: "center_org_memory",
                      contextId: centerWorkflowContextId,
                    })
                  }
                />
              ) : null}
              {centerComponent === "decision_policy" ? (
                <DecisionPolicyPanel
                  responseData={visibleResponseData ?? visibleSceneJson ?? null}
                  canonicalRecommendation={readCanonicalRecommendation(visibleResponseData, visibleSceneJson)}
                  decisionResult={decisionResult ?? undefined}
                  memoryEntries={decisionMemoryEntries}
                  onOpenDecisionGovernance={() =>
                    openComponentPanelFromAction("decision_governance", {
                      destinationSurface: "component_panel",
                      source: "decision_strip",
                      caller: "center_decision_policy",
                      contextId: centerWorkflowContextId,
                    })
                  }
                  onOpenExecutiveApproval={() =>
                    openComponentPanelFromAction("executive_approval", {
                      destinationSurface: "component_panel",
                      source: "decision_strip",
                      caller: "center_decision_policy",
                      contextId: centerWorkflowContextId,
                    })
                  }
                  onOpenCompare={() =>
                    migrateLegacyButtonToIntent(
                      "Open Compare",
                      "normalizeCompareOptions",
                      "open_compare",
                      "HomeScreen.tsx",
                      {
                        destinationSurface: "component_panel",
                        source: "component_panel",
                        caller: "center_decision_policy:compare",
                        contextId: centerWorkflowContextId,
                      }
                    )
                  }
                  onOpenTimeline={() =>
                    migrateLegacyButtonToIntent(
                      "Open Timeline",
                      "normalizeOpenCenterTimeline",
                      "open_timeline",
                      "HomeScreen.tsx",
                      {
                        destinationSurface: "component_panel",
                        source: "component_panel",
                        caller: "center_decision_policy:timeline",
                        contextId: centerWorkflowContextId,
                      }
                    )
                  }
                />
              ) : null}
              {centerComponent === "executive_approval" ? (
                <ExecutiveApprovalPanel
                  workspaceId={visibleResponseData?.workspace_id ?? activeWorkspaceId ?? null}
                  projectId={visibleResponseData?.project_id ?? activeProjectId ?? null}
                  responseData={visibleResponseData ?? visibleSceneJson ?? null}
                  canonicalRecommendation={readCanonicalRecommendation(visibleResponseData, visibleSceneJson)}
                  decisionResult={decisionResult ?? undefined}
                  memoryEntries={decisionMemoryEntries}
                  onOpenCompare={() =>
                    migrateLegacyButtonToIntent(
                      "Open Compare",
                      "normalizeCompareOptions",
                      "open_compare",
                      "HomeScreen.tsx",
                      {
                        destinationSurface: "component_panel",
                        source: "component_panel",
                        caller: "center_executive_approval:compare",
                        contextId: centerWorkflowContextId,
                      }
                    )
                  }
                  onOpenDecisionGovernance={() =>
                    openComponentPanelFromAction("decision_governance", {
                      destinationSurface: "component_panel",
                      source: "decision_strip",
                      caller: "center_executive_approval",
                      contextId: centerWorkflowContextId,
                    })
                  }
                  onOpenTimeline={() =>
                    migrateLegacyButtonToIntent(
                      "Open Timeline",
                      "normalizeOpenCenterTimeline",
                      "open_timeline",
                      "HomeScreen.tsx",
                      {
                        destinationSurface: "component_panel",
                        source: "component_panel",
                        caller: "center_executive_approval:timeline",
                        contextId: centerWorkflowContextId,
                      }
                    )
                  }
                />
              ) : null}
              {centerComponent === "decision_governance" ? (
                <DecisionGovernancePanel
                  responseData={visibleResponseData ?? visibleSceneJson ?? null}
                  canonicalRecommendation={readCanonicalRecommendation(visibleResponseData, visibleSceneJson)}
                  decisionResult={decisionResult ?? undefined}
                  memoryEntries={decisionMemoryEntries}
                  onOpenCompare={() =>
                    migrateLegacyButtonToIntent(
                      "Open Compare",
                      "normalizeCompareOptions",
                      "open_compare",
                      "HomeScreen.tsx",
                      {
                        destinationSurface: "component_panel",
                        source: "component_panel",
                        caller: "center_decision_governance:compare",
                        contextId: centerWorkflowContextId,
                      }
                    )
                  }
                  onOpenTimeline={() =>
                    migrateLegacyButtonToIntent(
                      "Open Timeline",
                      "normalizeOpenCenterTimeline",
                      "open_timeline",
                      "HomeScreen.tsx",
                      {
                        destinationSurface: "component_panel",
                        source: "component_panel",
                        caller: "center_decision_governance:timeline",
                        contextId: centerWorkflowContextId,
                      }
                    )
                  }
                  onOpenTeamDecision={() =>
                    openComponentPanelFromAction("team_decision", {
                      destinationSurface: "component_panel",
                      source: "decision_strip",
                      caller: "center_decision_governance",
                      contextId: centerWorkflowContextId,
                    })
                  }
                />
              ) : null}
              {centerComponent === "confidence_calibration" ? (
                <DecisionConfidenceCalibrationPanel
                  canonicalRecommendation={readCanonicalRecommendation(visibleResponseData, visibleSceneJson)}
                  responseData={visibleResponseData ?? visibleSceneJson ?? null}
                  decisionResult={decisionResult ?? undefined}
                  memoryEntries={decisionMemoryEntries}
                />
              ) : null}
              {centerComponent === "pattern_intelligence" ? (
                <DecisionPatternIntelligencePanel
                  canonicalRecommendation={readCanonicalRecommendation(visibleResponseData, visibleSceneJson)}
                  memoryEntries={decisionMemoryEntries}
                  onOpenMemory={() =>
                    migrateLegacyButtonToIntent(
                      "Open Decision Memory",
                      "pattern_intelligence:memory",
                      "open_decision_memory",
                      "HomeScreen.tsx",
                      {
                        destinationSurface: "component_panel",
                        source: "component_panel",
                        caller: "center_pattern_intelligence:memory",
                        contextId: centerWorkflowContextId,
                      }
                    )
                  }
                  onOpenCompare={() =>
                    migrateLegacyButtonToIntent(
                      "Open Compare",
                      "pattern_intelligence:compare",
                      "open_compare",
                      "HomeScreen.tsx",
                      {
                        destinationSurface: "component_panel",
                        source: "component_panel",
                        caller: "center_pattern_intelligence:compare",
                        contextId: centerWorkflowContextId,
                      }
                    )
                  }
                  onOpenConfidenceCalibration={() =>
                    migrateLegacyButtonToIntent(
                      "Open Confidence Calibration",
                      "pattern_intelligence:confidence_calibration",
                      "open_calibration",
                      "HomeScreen.tsx",
                      {
                        destinationSurface: "component_panel",
                        source: "component_panel",
                        caller: "center_pattern_intelligence:confidence_calibration",
                        contextId: centerWorkflowContextId,
                      }
                    )
                  }
                />
              ) : null}
              {centerComponent === "strategic_learning" ? (
                <StrategicLearningPanel
                  canonicalRecommendation={readCanonicalRecommendation(visibleResponseData, visibleSceneJson)}
                  memoryEntries={decisionMemoryEntries}
                  onOpenMemory={() =>
                    migrateLegacyButtonToIntent(
                      "Open Decision Memory",
                      "strategic_learning:memory",
                      "open_decision_memory",
                      "HomeScreen.tsx",
                      {
                        destinationSurface: "component_panel",
                        source: "component_panel",
                        caller: "center_strategic_learning:memory",
                        contextId: centerWorkflowContextId,
                      }
                    )
                  }
                  onOpenPatternIntelligence={() =>
                    migrateLegacyButtonToIntent(
                      "Open Pattern Intelligence",
                      "strategic_learning:pattern_intelligence",
                      "open_pattern_intelligence",
                      "HomeScreen.tsx",
                      {
                        destinationSurface: "component_panel",
                        source: "component_panel",
                        caller: "center_strategic_learning:pattern_intelligence",
                        contextId: centerWorkflowContextId,
                      }
                    )
                  }
                  onOpenDecisionLifecycle={() =>
                    migrateLegacyButtonToIntent(
                      "Open Lifecycle",
                      "requestPanelAuthorityOpen:decision_lifecycle",
                      "open_decision_lifecycle",
                      "HomeScreen.tsx",
                      {
                        destinationSurface: "component_panel",
                        source: "component_panel",
                        caller: "center_strategic_learning:decision_lifecycle",
                        contextId: centerWorkflowContextId,
                      }
                    )
                  }
                />
              ) : null}
              {centerComponent === "decision_strategic" ? (
                <MetaDecisionPanel
                  responseData={visibleResponseData ?? visibleSceneJson ?? null}
                  canonicalRecommendation={readCanonicalRecommendation(visibleResponseData, visibleSceneJson)}
                  memoryEntries={decisionMemoryEntries}
                  onOpenCompare={() =>
                    migrateLegacyButtonToIntent(
                      "Open Compare",
                      "meta_decision:compare",
                      "open_compare",
                      "HomeScreen.tsx",
                      {
                        destinationSurface: "component_panel",
                        source: "component_panel",
                        caller: "center_decision_strategic:compare",
                        contextId: centerWorkflowContextId,
                      }
                    )
                  }
                  onOpenTimeline={() =>
                    migrateLegacyButtonToIntent(
                      "Open Timeline",
                      "meta_decision:timeline",
                      "open_timeline",
                      "HomeScreen.tsx",
                      {
                        destinationSurface: "component_panel",
                        source: "component_panel",
                        caller: "center_decision_strategic:timeline",
                        contextId: centerWorkflowContextId,
                      }
                    )
                  }
                  onOpenMemory={() =>
                    migrateLegacyButtonToIntent(
                      "Open Decision Memory",
                      "meta_decision:memory",
                      "open_decision_memory",
                      "HomeScreen.tsx",
                      {
                        destinationSurface: "component_panel",
                        source: "component_panel",
                        caller: "center_decision_strategic:memory",
                        contextId: centerWorkflowContextId,
                      }
                    )
                  }
                />
              ) : null}
              {centerComponent === "decision_lens" ? (
                <CognitiveStylePanel
                  activeMode={activeMode ?? null}
                  rightPanelView={rightPanelState.view ?? null}
                  responseData={visibleResponseData ?? visibleSceneJson ?? null}
                  canonicalRecommendation={readCanonicalRecommendation(visibleResponseData, visibleSceneJson)}
                  decisionResult={decisionResult ?? null}
                  memoryEntries={decisionMemoryEntries}
                  onOpenCompare={() =>
                    migrateLegacyButtonToIntent(
                      "Open Compare",
                      "decision_lens:compare",
                      "open_compare",
                      "HomeScreen.tsx",
                      {
                        destinationSurface: "component_panel",
                        source: "component_panel",
                        caller: "center_decision_lens:compare",
                        contextId: centerWorkflowContextId,
                      }
                    )
                  }
                  onOpenTimeline={() =>
                    migrateLegacyButtonToIntent(
                      "Open Timeline",
                      "decision_lens:timeline",
                      "open_timeline",
                      "HomeScreen.tsx",
                      {
                        destinationSurface: "component_panel",
                        source: "component_panel",
                        caller: "center_decision_lens:timeline",
                        contextId: centerWorkflowContextId,
                      }
                    )
                  }
                  onOpenMemory={() =>
                    migrateLegacyButtonToIntent(
                      "Open Decision Memory",
                      "decision_lens:memory",
                      "open_decision_memory",
                      "HomeScreen.tsx",
                      {
                        destinationSurface: "component_panel",
                        source: "component_panel",
                        caller: "center_decision_lens:memory",
                        contextId: centerWorkflowContextId,
                      }
                    )
                  }
                />
              ) : null}
              {centerComponent === "collaboration_intelligence" ? (
                <CollaborationIntelligencePanel
                  workspaceId={visibleResponseData?.workspace_id ?? activeWorkspaceId ?? null}
                  projectId={visibleResponseData?.project_id ?? activeProjectId ?? null}
                  responseData={visibleResponseData ?? visibleSceneJson ?? null}
                  canonicalRecommendation={readCanonicalRecommendation(visibleResponseData, visibleSceneJson)}
                  decisionResult={decisionResult ?? null}
                  memoryEntries={decisionMemoryEntries}
                  onOpenTeamDecision={() =>
                    openComponentPanelFromAction("team_decision", {
                      destinationSurface: "component_panel",
                      source: "component_panel",
                      caller: "center_collaboration_intelligence:team_decision",
                      contextId: centerWorkflowContextId,
                    })
                  }
                  onOpenDecisionGovernance={() =>
                    openComponentPanelFromAction("decision_governance", {
                      destinationSurface: "component_panel",
                      source: "component_panel",
                      caller: "center_collaboration_intelligence:decision_governance",
                      contextId: centerWorkflowContextId,
                    })
                  }
                  onOpenExecutiveApproval={() =>
                    openComponentPanelFromAction("executive_approval", {
                      destinationSurface: "component_panel",
                      source: "component_panel",
                      caller: "center_collaboration_intelligence:executive_approval",
                      contextId: centerWorkflowContextId,
                    })
                  }
                />
              ) : null}
              {centerComponent === "outcome_feedback" ? (
                <DecisionOutcomeFeedbackPanel
                  responseData={visibleResponseData ?? visibleSceneJson ?? null}
                  canonicalRecommendation={readCanonicalRecommendation(visibleResponseData, visibleSceneJson)}
                  decisionResult={decisionResult ?? null}
                  memoryEntries={decisionMemoryEntries}
                  onOpenDecisionTimeline={() =>
                    migrateLegacyButtonToIntent(
                      "Open Timeline",
                      "outcome_feedback:decision_timeline",
                      "open_timeline",
                      "HomeScreen.tsx",
                      {
                        destinationSurface: "component_panel",
                        source: "component_panel",
                        caller: "center_outcome_feedback:timeline",
                        contextId: centerWorkflowContextId,
                      }
                    )
                  }
                />
              ) : null}
              {centerComponent === "decision_memory" ? (
                <DecisionMemoryPanel
                  entries={decisionMemoryEntries}
                  memoryInsights={visibleMemoryInsights ?? null}
                  responseData={visibleResponseData ?? null}
                  canonicalRecommendation={readCanonicalRecommendation(visibleResponseData, visibleSceneJson)}
                  decisionResult={decisionResult ?? null}
                  resolveObjectLabel={resolveSceneObjectLabel}
                  onOpenTimeline={() =>
                    migrateLegacyButtonToIntent(
                      "Open Timeline",
                      "decision_memory:timeline",
                      "open_timeline",
                      "HomeScreen.tsx",
                      {
                        destinationSurface: "component_panel",
                        source: "component_panel",
                        caller: "center_decision_memory:timeline",
                        contextId: centerWorkflowContextId,
                      }
                    )
                  }
                  onOpenCompare={() =>
                    migrateLegacyButtonToIntent(
                      "Open Compare",
                      "decision_memory:compare",
                      "open_compare",
                      "HomeScreen.tsx",
                      {
                        destinationSurface: "component_panel",
                        source: "component_panel",
                        caller: "center_decision_memory:compare",
                        contextId: centerWorkflowContextId,
                      }
                    )
                  }
                  onOpenWarRoom={() =>
                    openSimPanel("war_room", "center_decision_memory:war_room", centerWorkflowContextId, {
                      source: "component_panel",
                    })
                  }
                  onOpenObject={handleOpenObject}
                />
              ) : null}
              {centerComponent === "decision_lifecycle" ? (
                <DecisionLifecyclePanel
                  responseData={visibleResponseData ?? visibleSceneJson ?? null}
                  canonicalRecommendation={readCanonicalRecommendation(visibleResponseData, visibleSceneJson)}
                  decisionResult={decisionResult ?? undefined}
                  memoryEntries={decisionMemoryEntries}
                  workspaceId={visibleResponseData?.workspace_id ?? activeWorkspaceId ?? null}
                  projectId={visibleResponseData?.project_id ?? activeProjectId ?? null}
                  onOpenDecisionTimeline={() =>
                    migrateLegacyButtonToIntent(
                      "Open Timeline",
                      "decision_lifecycle:timeline",
                      "open_timeline",
                      "HomeScreen.tsx",
                      {
                        destinationSurface: "component_panel",
                        source: "component_panel",
                        caller: "center_decision_lifecycle:timeline",
                        contextId: centerWorkflowContextId,
                      }
                    )
                  }
                  onOpenOutcomeFeedback={() =>
                    migrateLegacyButtonToIntent(
                      "Open Outcome Feedback",
                      "decision_lifecycle:outcome_feedback",
                      "open_outcome_feedback",
                      "HomeScreen.tsx",
                      {
                        destinationSurface: "component_panel",
                        source: "component_panel",
                        caller: "center_decision_lifecycle:outcome_feedback",
                        contextId: centerWorkflowContextId,
                      }
                    )
                  }
                  onOpenCompare={() =>
                    migrateLegacyButtonToIntent(
                      "Open Compare",
                      "decision_lifecycle:compare",
                      "open_compare",
                      "HomeScreen.tsx",
                      {
                        destinationSurface: "component_panel",
                        source: "component_panel",
                        caller: "center_decision_lifecycle:compare",
                        contextId: centerWorkflowContextId,
                      }
                    )
                  }
                />
              ) : null}
              {centerComponent === "scenario_tree" ? (
                <ScenarioBranchingTreePanel
                  responseData={visibleResponseData ?? visibleSceneJson ?? null}
                  canonicalRecommendation={readCanonicalRecommendation(visibleResponseData, visibleSceneJson)}
                  decisionResult={decisionResult ?? null}
                  strategicAdvice={visibleStrategicAdvice ?? visibleSceneJson?.["strategic_advice"] ?? null}
                  memoryEntries={decisionMemoryEntries}
                  resolveObjectLabel={resolveSceneObjectLabel}
                  onOpenCompare={() =>
                    migrateLegacyButtonToIntent(
                      "Open Compare",
                      "scenario_tree:compare",
                      "open_compare",
                      "HomeScreen.tsx",
                      {
                        destinationSurface: "component_panel",
                        source: "component_panel",
                        caller: "center_scenario_tree:compare",
                        contextId: centerWorkflowContextId,
                      }
                    )
                  }
                  onOpenTimeline={() =>
                    migrateLegacyButtonToIntent(
                      "Open Timeline",
                      "scenario_tree:timeline",
                      "open_timeline",
                      "HomeScreen.tsx",
                      {
                        destinationSurface: "component_panel",
                        source: "component_panel",
                        caller: "center_scenario_tree:timeline",
                        contextId: centerWorkflowContextId,
                      }
                    )
                  }
                  onOpenWarRoom={() =>
                    openSimPanel("war_room", "center_scenario_tree:war_room", centerWorkflowContextId, {
                      source: "component_panel",
                    })
                  }
                  onOpenObject={handleOpenObject}
                />
              ) : null}
              {!investorDemo.demo.active && !isLargeCenterWorkspaceComponent(centerComponent) ? (
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

      {/* Small loading badge — only after delayed busy so fast paths never flash */}
      {loading && chatDelayedBusy ? (
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
      {typeCExecutiveSummary ? (
        <TypeCExecutiveSummaryCard
          placement="stage"
          summary={typeCExecutiveSummary}
          aiInsight={typeCAIExecutiveInsight}
          onEnhance={handleEnhanceTypeCExecutiveSummary}
          hasSelectedObject={Boolean(selectedObjectIdState)}
          executiveActions={typeCExecutiveActions}
          onExecutiveAction={handleTypeCExecutiveAction}
          metaCognition={executiveMetaCognitionSnapshot}
        />
      ) : null}
    </div>
  );

  // --- Render ---
  /** D3.14 — read-model: Nexora pipeline HUD + (dev) Type-C pipeline events → `deriveOperationalMonitoringSnapshot`. */
  const d3MonitoringSnapshot = useMemo(() => {
    return runD3DevTimed("deriveOperationalMonitoringSnapshot", () => {
      const pipelineStatus: OperationalPipelineStatusBrief = {
        status: pipelineStatusUi.status,
        source: pipelineStatusUi.source,
        signalsCount: pipelineStatusUi.signalsCount,
        mappedObjectsCount: pipelineStatusUi.mappedObjectsCount,
        fragilityLevel: pipelineStatusUi.fragilityLevel,
        summary: pipelineStatusUi.summary,
        insightLine: pipelineStatusUi.insightLine,
        errorMessage: pipelineStatusUi.errorMessage,
        updatedAt: pipelineStatusUi.updatedAt,
      };
      const pipelineEventsSlice =
        process.env.NODE_ENV !== "production" ? typeCPipelineEventsRef.current.slice() : [];

      return deriveOperationalMonitoringSnapshot(
        toMonitoringSnapshotInput({
          pipelineEvents: pipelineEventsSlice,
          pipelineStatus,
        })
      );
    });
  }, [
    buildPipelineStatusSignature(pipelineStatusUi),
    stableSceneObjectsSignature,
    typeCDecisionReadiness?.id,
    typeCScenarioState,
    typeCAlerts,
    executionState,
    auditHudEpoch,
  ]);

  const d3OperationalPrevProbe =
    prevD3MonitoringSnapshotRef.current == null
      ? "__null__"
      : `${prevD3MonitoringSnapshotRef.current.id}|${prevD3MonitoringSnapshotRef.current.updatedAt}`;

  const d3OperationalChangeSummary = useMemo(
    () =>
      detectOperationalChanges({
        previousSnapshot: prevD3MonitoringSnapshotRef.current,
        currentSnapshot: d3MonitoringSnapshot,
      }),
    [d3MonitoringSnapshot, d3OperationalPrevProbe]
  );

  useLayoutEffect(() => {
    prevD3MonitoringSnapshotRef.current = d3MonitoringSnapshot;
  }, [d3MonitoringSnapshot]);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const s = d3OperationalChangeSummary;
    const sig = `${d3MonitoringSnapshot.updatedAt}|${s.totalChanges}|${s.worseningCount}|${s.improvingCount}|${s.stableCount}`;
    if (lastOperationalChangeLogSigRef.current === sig) return;
    lastOperationalChangeLogSigRef.current = sig;
    globalThis.console.debug("[Nexora][OperationalChange]", {
      totalChanges: s.totalChanges,
      criticalChanges: s.criticalChanges,
      worseningCount: s.worseningCount,
      improvingCount: s.improvingCount,
      stableCount: s.stableCount,
    });
  }, [d3MonitoringSnapshot, d3OperationalChangeSummary]);

  const d3PropagationPreview = useMemo(
    () =>
      runD3DevTimed("deriveOperationalPropagationPreview", () =>
        deriveOperationalPropagationPreview({
          monitoringSnapshot: d3MonitoringSnapshot,
          operationalChangeSummary: d3OperationalChangeSummary,
          sceneJson: stableVisibleSceneJson,
        })
      ),
    [d3MonitoringSnapshot, d3OperationalChangeSummary, stableVisibleSceneJson]
  );

  const d3OperationalRiskImpactMap = useMemo(
    () =>
      runD3DevTimed("deriveOperationalRiskImpactMap", () =>
        deriveOperationalRiskImpactMap({
          monitoringSnapshot: d3MonitoringSnapshot,
          operationalChangeSummary: d3OperationalChangeSummary,
          propagationPreview: d3PropagationPreview,
          sceneJson: stableVisibleSceneJson,
        })
      ),
    [d3MonitoringSnapshot, d3OperationalChangeSummary, d3PropagationPreview, stableVisibleSceneJson]
  );

  const d3OperationalAlerts = useMemo(
    () =>
      runD3DevTimed("evaluateOperationalAlerts", () =>
        evaluateOperationalAlerts({
          monitoringSnapshot: d3MonitoringSnapshot,
          operationalChangeSummary: d3OperationalChangeSummary,
          propagationPreview: d3PropagationPreview,
          operationalRiskImpactMap: d3OperationalRiskImpactMap,
          rules: defaultOperationalAlertRules,
        })
      ),
    [d3MonitoringSnapshot, d3OperationalChangeSummary, d3PropagationPreview, d3OperationalRiskImpactMap]
  );

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    logD3OperationalDiagnosticsDeduped({
      monitoringSnapshot: d3MonitoringSnapshot,
      operationalChangeSummary: d3OperationalChangeSummary,
      propagationPreview: d3PropagationPreview,
      operationalRiskImpactMap: d3OperationalRiskImpactMap,
      alertEvaluation: d3OperationalAlerts,
    });
  }, [d3MonitoringSnapshot, d3OperationalChangeSummary, d3PropagationPreview, d3OperationalRiskImpactMap, d3OperationalAlerts]);

  return (
    <div
      id="nexora-home"
      style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}
    >
      {sceneNode}
      <D3StatusHud
        snapshot={d3MonitoringSnapshot}
        changeSummary={d3OperationalChangeSummary}
        propagationPreview={d3PropagationPreview}
        riskImpactMap={d3OperationalRiskImpactMap}
        alertEvaluation={d3OperationalAlerts}
      />
      {leftCommandPortalNode}
      {timelineInspectorNode}
      {alertOverlayNode}
      {investorDemoOverlayNode}
      {chatQAPanelNode}
      <TypeCScenarioDraftPanel
        key={`typec-scenario-drafts-${scenarioDrafts?.map((draft) => draft.id).join("|") || "empty"}`}
        drafts={scenarioDrafts}
        onCancel={cancelTypeCScenarioDrafts}
        onOpenWarRoom={openTypeCScenarioDraftWarRoom}
        onCompare={compareTypeCScenarioDrafts}
      />
      <TypeCScenarioComparePanel
        comparison={scenarioComparison}
        onClose={closeTypeCScenarioCompare}
        onOpenBest={openBestTypeCScenarioInWarRoom}
      />
      <TypeCDecisionPanel
        recommendation={decisionRecommendation}
        comparison={scenarioComparison}
        onExecute={handleStartTypeCExecution}
      />
      <TypeCAdaptiveGuidancePanel guidance={typeCAdaptiveGuidance} />
      <TypeCAIPanel
        insight={typeCAIInsight}
        loading={typeCAIInsightLoading}
        error={typeCAIInsightError}
        canGenerate={canGenerateTypeCAIInsight}
        onGenerate={handleGenerateTypeCAIInsight}
        onClose={handleCloseTypeCAIInsight}
      />
      <TypeCMultiAgentPanel
        insight={typeCMultiAgentInsight}
        loading={typeCMultiAgentLoading}
        error={typeCMultiAgentError}
        canRun={canRunTypeCMultiAgent}
        onRun={handleRunTypeCMultiAgent}
        onClose={handleCloseTypeCMultiAgent}
      />
      <TypeCSandboxPanel
        result={typeCSandboxResult}
        loading={typeCSandboxLoading}
        error={typeCSandboxError}
        canRun={canRunTypeCSandbox}
        onRun={handleRunTypeCSandbox}
        onClose={handleCloseTypeCSandbox}
        onReview={handleReviewTypeCSandboxStrategy}
        onCompare={handleCompareTypeCSandboxStrategy}
        onPromote={handlePromoteTypeCSandboxStrategy}
      />
      <TypeCExecutionPanel
        executionState={executionState}
        scenario={executionScenario}
        onPause={handlePauseTypeCExecution}
        onStop={handleStopTypeCExecution}
      />
      <TypeCAlertPanel
        alerts={typeCAlerts}
        onAcknowledge={handleAcknowledgeTypeCAlert}
        onClearAll={handleClearTypeCAlerts}
      />
      <TypeCMemoryPanel
        memoryState={typeCMemoryState}
        learningSignals={typeCLearningSignals}
        onClearMemory={handleClearTypeCMemory}
      />
      <TypeCWarRoomPanel
        scenario={activeTypeCScenario}
        simulation={activeSimulation}
        onExit={exitTypeCScenarioSimulation}
      />
      <TypeCConnectionSuggestionPanel
        key={`typec-connection-suggestions-${connectionSuggestions?.map((suggestion) => suggestion.id).join("|") || "empty"}`}
        suggestions={connectionSuggestions}
        onCancel={cancelTypeCConnectionSuggestions}
        onApplySelected={applyTypeCConnectionSuggestions}
      />
      {process.env.NODE_ENV !== "production" ? (
        <TypeCDevInspector
          scenarioState={typeCScenarioState}
          readiness={typeCDecisionReadiness}
          decisionDraft={typeCDecisionDraft}
          executiveSummary={typeCExecutiveSummary}
          aiExecutiveInsight={typeCAIExecutiveInsight}
          multiAgentInsight={typeCMultiAgentInsight}
          pipelineEvents={typeCPipelineEventsRef.current}
        />
      ) : null}
    </div>
  );
};

export default HomeScreen;

// removed NexoraPsychHomeEntry (moved to Domain Selection page)
