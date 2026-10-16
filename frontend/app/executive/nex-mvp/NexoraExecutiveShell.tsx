"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import {
  createInitialNexoraExecutiveShellApplicationState,
  getNexoraExecutiveShellIdentity,
  nexoraExecutiveShellIdentity,
  nexoraExecutiveShellVersion,
} from "@/app/lib/nex-mvp/nexoraExecutiveShell";
import {
  NEXORA_MVP_DEFAULT_PRESENTATION_STATE,
  getNexoraMVPWorkspaceRegistry,
  type NexoraMVPPresentationState,
  type NexoraMVPWorkspaceKind,
} from "@/app/lib/nex-mvp/nexoraMVPApplicationFoundation";
import {
  applyNexoraMVPFlowDomainAction,
  beginNexoraMVPFlowPendingAction,
  classifyNexoraMVPFlowDomainAction,
  containNexoraMVPFlowDomainForManagerWorkspace,
  createEmptyNexoraMVPFlowDomainState,
  createInitialNexoraMVPFlowDomainState,
  deriveNexoraMVPExecutiveFlowContext,
  isNexoraMVPProductFixtureDecisionId,
  deriveNexoraMVPExecutiveWorkflowPresentation,
  failNexoraMVPFlowPendingAction,
  overlayNexoraMVPPresentationStatus,
  projectNexoraMVPCatalogDecisionStatusesFromFlowDomain,
  projectNexoraMVPFlowDecisionsFromCanonicalRuntime,
  projectNexoraMVPFlowExecutionsFromCanonicalRuntime,
  resolveNexoraMVPFlowPresentationActions,
} from "@/app/lib/nex-mvp/nexoraMVPExecutiveFlow";
import type { NexoraMVPIntelligenceAction } from "@/app/lib/nex-mvp/nexoraMVPExecutiveIntelligence";
import { projectNexoraExecutiveDataStatus } from "@/app/lib/nex-mvp/nexoraMVPExecutiveDataStatus";
import { nexoraManagerMvpReleaseBaselineIdentity } from "@/app/lib/nex-mvp/nexoraManagerMvpReleaseBaseline";
import type { NexoraMVPDataRealityDatasetScenario } from "@/app/lib/nex-mvp/nexoraMVPDataRealityStageBridge";
import {
  getCsvRealDataImportVersion,
  listCsvRealDataImports,
  releaseWorkspaceCsvAuthority,
  subscribeCsvRealDataImports,
  type CsvCommittedImport,
} from "@/app/lib/data-reality/csvRealDataImportStore";
import {
  bindCsvRealDataImportDurabilityPersistence,
  getCsvDurabilityHealth,
  persistCsvRealDataImportDurabilityBrowser,
  recoverCsvRealDataImportDurabilityBrowser,
  subscribeCsvDurabilityHealth,
} from "@/app/lib/data-reality/csvRealDataImportDurability";
import { ensureCsvMvpDemoBootstrap } from "@/app/lib/data-reality/csvRealDataMvpDemoBootstrap";
import { isDemoProfileId, MANUFACTURING_DEMO_PROFILE_ID, PROJECT_DEMO_PROFILE_ID } from "@/app/lib/demo-profile/demoProfileContract";
import { ensureManufacturingDemoPackage } from "@/app/lib/demo-profile/manufacturingDemoPackage";
import { ensureProjectDemoPackage } from "@/app/lib/demo-profile/projectDemoPackage";
import { resetActiveDemo, subscribeDemoReset } from "@/app/lib/demo-profile/demoProfileReset";
import { retireAllDemoProfileImports } from "@/app/lib/demo-profile/demoProfilePackageTransition";
import {
  readStoredDemoProfile,
  subscribeDemoProfile,
} from "@/app/lib/demo-profile/demoProfileStore";
import {
  acceptNewManagerPersistenceWorkspaceId,
  readLiveExecutiveDataWorkspaceId,
  resolveLiveExecutiveDataWorkspace,
} from "@/app/lib/workspace/managerWorkspaceIdentity";
import { isRealManagerWorkspaceId } from "@/app/lib/workspace/liveManagerDataWorkspaceGuard";
import { DEMO_WORKSPACE_ID } from "@/app/lib/workspace/workspaceRegistryContract";
import { hostedManagerRegistryRecovery, type NexoraDeploymentMode } from "@/app/lib/auth/nexoraDeploymentMode";
import { loadHostedManagerSnapshot } from "@/app/lib/workspace-auth/hostedManagerDataClient";
import { loadHostedOperations, saveHostedOperations } from "@/app/lib/workspace-auth/hostedOperationalClient";
import { setHostedManagerDataPhase } from "@/app/lib/workspace-auth/hostedManagerDataPhase";
import { isCustomerHostedWorkspaceId } from "@/app/lib/workspace-auth/hostedWorkspaceId";
import type { NexoraAuthProviderId } from "@/app/lib/auth/nexoraAuthProviders";
import { ANONYMOUS_NEXORA_SESSION, type NexoraClientSessionProjection } from "@/app/lib/auth/nexoraPrincipal";
import { recoverWorkspaceRegistryFromStorage, subscribeWorkspaceRegistry } from "@/app/lib/workspace/workspaceRegistryStore";
import type {
  CsvSemanticClarification,
  CsvSemanticClarificationResult,
} from "@/app/lib/data-reality/csvSemanticUnderstanding";
import { answerCsvSemanticInquiry } from "@/app/lib/data-reality/csvSemanticUnderstanding";
import {
  answerAdvisorDataInquiry,
  applyAdvisorDataSemanticClarification,
  classifyAdvisorDataConversation,
  emptyAdvisorDataDialogue,
  type AdvisorDataInquiryDiagnostics,
} from "@/app/lib/manager-object/nexoraAdvisorDataInquiry";
import type { ExecutiveSourceAdvisorContext } from "@/app/lib/data-reality/executiveSourceIntelligence";
import type { NexoraLiveCommittedObservation } from "@/app/lib/data-reality/liveDataConnectorFoundation";
import type { NexoraProactiveAdvisorBrief } from "@/app/lib/data-reality/proactiveAdvisorDelivery";
import {
  alignPresentationViewModelToStageKpiTruth,
  getDataRealityAwareStageObjectBindingFromExperience,
  resolveNexoraMVPDataRealityAwareStageExperience,
} from "@/app/lib/nex-mvp/nexoraMVPDataRealityAwareStageExperience";
import { resolveNexoraMVPDataRealityAwareAdvisorExperience } from "@/app/lib/nex-mvp/nexoraMVPDataRealityAwareAdvisorExperience";
import { resolveNexoraMVPDataRealityAwareFocusAttentionExperience } from "@/app/lib/nex-mvp/nexoraMVPDataRealityAwareFocusAttentionExperience";
import {
  applyDataRealityAwareSceneChoreographyToStagePresentation,
  resolveNexoraMVPDataRealityAwareSceneChoreography,
} from "@/app/lib/nex-mvp/nexoraMVPDataRealityAwareSceneChoreography";
import {
  applyDataRealityAwareConnectionsContextToStagePresentation,
  resolveNexoraMVPDataRealityAwareConnectionsContext,
} from "@/app/lib/nex-mvp/nexoraMVPDataRealityAwareConnectionsContext";
import { applyDataRealityObjectVisualStateToStagePresentationWithRetention } from "@/app/lib/nex-mvp/nexoraMVPDataRealityObjectVisualState";
import { applyDataRealityFocusSceneChoreographyToStagePresentation } from "@/app/lib/nex-mvp/nexoraMVPDataRealityFocusSceneChoreography";
import { applyDataRealityConnectionsContextVisualStateToStagePresentation } from "@/app/lib/nex-mvp/nexoraMVPDataRealityConnectionsContextVisualState";
import { applyDataRealityExecutiveReadabilityToStagePresentation } from "@/app/lib/nex-mvp/nexoraMVPDataRealityExecutiveReadability";
import { applyExecutiveFocusVisualGrammarToStagePresentation } from "@/app/lib/nex-mvp/nexoraMVPExecutiveFocusVisualGrammar";
import { applyExecutiveNetworkTopologyToStagePresentation } from "@/app/lib/nex-mvp/nexoraMVPExecutiveNetworkTopology";
import { applyExecutivePresentationPlaneToStagePresentation } from "@/app/lib/nex-mvp/nexoraMVPExecutivePresentationPlane";
import { applyExecutiveStageFixedCameraToStagePresentation } from "@/app/lib/nex-mvp/nexoraMVPExecutiveStage2DFixedCamera";
import { applyExecutiveStage2DTopologyPlaneToStagePresentation } from "@/app/lib/nex-mvp/nexoraMVPExecutiveStage2DTopologyPlane";
import { applyExecutiveStage2DTopologyRecompositionToStagePresentation } from "@/app/lib/nex-mvp/nexoraMVPExecutiveStage2DTopologyRecomposition";
import { applyExecutiveStageObjectLabelTerritoryToStagePresentation } from "@/app/lib/nex-mvp/nexoraMVPExecutiveStageObjectLabelTerritory";
import { applyNexoraMVPExecutiveCollectionIntegrity } from "@/app/lib/nex-mvp/nexoraMVPExecutiveCollectionIntegrity";
import {
  buildNexoraMVPAdvisorContextBridge,
  buildNexoraMVPTimelineContextBridge,
  buildNexoraMVPExecutiveChangeSnapshot,
  createEmptyNexoraMVPObjectInteractionCatalog,
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  jumpNexoraMVPObjectInteractionNavigationTrail,
  mapNexoraMVPInteractionStateToApplicationSubjects,
  openNexoraMVPExecutiveChangeCollection,
  openNexoraMVPExecutiveQueueCollection,
  resetNexoraMVPObjectInteractionOverview,
  resolveNexoraMVPInteractionSubject,
  acknowledgeNexoraMVPExecutiveChanges,
  beginNexoraMVPDailyPreparation,
  beginNexoraMVPMeetingPreparation,
  selectNexoraMVPInteractionSubject,
  stepBackNexoraMVPObjectInteraction,
  stepForwardNexoraMVPObjectInteraction,
  executeNexoraMVPNextBestAction,
  type NexoraMVPObjectInteractionState,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction";
import {
  ensureExecutiveChangeBaseline,
  EXECUTIVE_CHANGE_PRODUCTIVITY_CATEGORY,
} from "@/app/lib/spatial-presentation/executiveStageChangeIntelligence";
import {
  applyNexoraMVPConversationalCommand,
} from "@/app/lib/nex-mvp/nexoraMVPConversationalRuntimeBridge";
import type { NexoraConversationalCommand } from "@/app/lib/conversational-control/conversationalCommand";
import type { NexoraConversationalWorkspaceActionPayload } from "@/app/lib/conversational-control/conversationalIntent";
import { executeNexoraConversationalExperience } from "@/app/lib/conversational-control/conversationalExperienceOrchestrator";
import { completeNexoraLlmManagerPresentation } from "@/app/lib/conversational-control/nexoraLlmManagerPresentation";
import { readHostedLlmWorkspaceId } from "@/app/lib/workspace-auth/hostedActiveWorkspace";
import type { HostedWorkspaceProjection } from "@/app/lib/workspace-auth/hostedWorkspaceRecord";
import {
  ECA_EXECUTIVE_ACTION_PLAN_IDENTITY,
  planEcaExecutiveConversationAction,
  type EcaConversationActionPlan,
} from "@/app/lib/nexora-conversation/ecaExecutiveIntentActionPlan";
import {
  ECA_EXECUTIVE_INITIATIVE_IDENTITY,
  judgeEcaExecutiveInitiative,
  type EcaExecutiveInitiativeJudgment,
} from "@/app/lib/nexora-conversation/ecaExecutiveInitiativeJudgment";
import {
  ECA_EXECUTIVE_INFORMATION_NEED_IDENTITY,
  judgeEcaExecutiveInformationNeed,
  type EcaExecutiveInformationNeedJudgment,
} from "@/app/lib/nexora-conversation/ecaExecutiveInformationNeed";
import {
  ECA_EXECUTIVE_ANSWER_INTAKE_IDENTITY,
  judgeEcaExecutiveAnswerIntake,
  type EcaExecutiveAnswerIntakeJudgment,
} from "@/app/lib/nexora-conversation/ecaExecutiveAnswerIntake";
import {
  ECA_EXECUTIVE_DIALOGUE_STRATEGY_IDENTITY,
  judgeEcaExecutiveDialogueStrategy,
  type EcaExecutiveDialogueStrategy,
} from "@/app/lib/nexora-conversation/ecaExecutiveDialogueStrategy";
import {
  ECA_EXECUTIVE_RECOMMENDATION_IDENTITY,
  judgeEcaExecutiveRecommendation,
  type EcaExecutiveRecommendationJudgment,
} from "@/app/lib/nexora-conversation/ecaExecutiveRecommendation";
import {
  ECA_EXECUTIVE_COMMITMENT_IDENTITY,
  judgeEcaExecutiveCommitment,
  type EcaExecutiveCommitmentJudgment,
} from "@/app/lib/nexora-conversation/ecaExecutiveCommitment";
import {
  ECA_EXECUTIVE_EXECUTION_READINESS_IDENTITY,
  judgeEcaExecutiveExecutionReadiness,
  type EcaExecutiveExecutionReadinessJudgment,
} from "@/app/lib/nexora-conversation/ecaExecutiveExecutionReadiness";
import {
  ECA_LIVE_EXECUTION_IDENTITY,
  judgeEcaLiveExecution,
  type EcaLiveExecutionJudgment,
} from "@/app/lib/nexora-conversation/ecaLiveExecution";
import {
  ECA_OUTCOME_DIALOGUE_IDENTITY,
  judgeEcaExecutiveOutcome,
  type EcaExecutiveOutcomeJudgment,
} from "@/app/lib/nexora-conversation/ecaExecutiveOutcome";
import {
  ECA_LEARNING_CLOSURE_IDENTITY,
  judgeEcaExecutiveLearningClosure,
  type EcaExecutiveLearningClosureJudgment,
} from "@/app/lib/nexora-conversation/ecaExecutiveLearningClosure";
import type { EcaWorkingConversationContext } from "@/app/lib/nexora-conversation/ecaWorkingConversationContext";
import {
  NEXORA_FINAL3_NATURAL_REFERENCE_IDENTITY,
} from "@/app/lib/conversational-control/conversationalSubjectRegistry";
import { NEXORA_FINAL3_EXECUTIVE_EXPLAIN_IDENTITY } from "@/app/lib/manager-object/managerObjectExplainEngine";
import { nexoraMvpFinal61NluIdentity } from "@/app/lib/manager-object/nexoraMvpFinal61NaturalLanguageUnderstanding";
import { nexoraMvpFinal62ContinuityIdentity } from "@/app/lib/manager-object/nexoraMvpFinal62ConversationContinuity";
import { nexoraMvpFinal63ClarificationIdentity } from "@/app/lib/manager-object/nexoraMvpFinal63SmartClarification";
import { nexoraMvpFinal64CommunicationIdentity } from "@/app/lib/manager-object/nexoraMvpFinal64TrustedCommunication";
import { nexoraMvpFinal65GuidanceIdentity } from "@/app/lib/manager-object/nexoraMvpFinal65Guidance";
import { nexoraMvpFinal66TypeCIdentity } from "@/app/lib/manager-object/nexoraMvpFinal66TypeCCertification";
import { nexoraNca1Identity } from "@/app/lib/manager-object/nexoraNca1ConversationArchitecture";
import { nexoraNca2Identity } from "@/app/lib/manager-object/nexoraNca2ConversationState";
import { nexoraNca3Identity } from "@/app/lib/manager-object/nexoraNca3QuestionIntelligence";
import { nexoraNca4Identity } from "@/app/lib/manager-object/nexoraNca4AdvisoryIntelligence";
import { nexoraNca5Identity } from "@/app/lib/manager-object/nexoraNca5InitiativeIntelligence";
import { nexoraNca6Identity } from "@/app/lib/manager-object/nexoraNca6CommunicationIntelligence";
import { nexoraNca7Identity } from "@/app/lib/manager-object/nexoraNca7EndToEndOrchestration";
import {
  csvSemanticClarificationTopicId,
  beginNcaCsvSemanticClarification,
  endNcaCsvSemanticClarification,
  NCA_CSV_SEMANTIC_PURPOSE,
  resolveNcaCsvSemanticReply,
} from "@/app/lib/manager-object/nexoraNcaCsvSemanticClarification";
import {
  applyEntranceCenterSubject,
  createNexoraEntranceSession,
  isNexoraEntranceRestrained,
  projectNexoraEntranceCatalog,
  stabilizeEntranceCatalog,
  writeStoredEntranceIdentity,
  readStoredEntranceIdentity,
} from "@/app/lib/nexora-entrance/nexoraEntranceExperience";
import type { NexoraEntranceSession } from "@/app/lib/nexora-entrance/nexoraEntranceTypes";
import {
  beginNexoraGuidedEntranceIntroduction,
  composeNexoraGuidedEntranceIntroMessage,
  guidedEntranceOf,
  stageEducationOf,
  acknowledgeNexoraStageEducationInteraction,
  withActiveNexoraGuidedEntrance,
} from "@/app/lib/nexora-entrance/nexoraGuidedEntranceExperience";
import { conversationContinuityOf } from "@/app/lib/nexora-entrance/nexoraEntranceConversationContinuity";
import {
  acknowledgeNexoraObjectEducationInteraction,
  objectEducationOf,
} from "@/app/lib/nexora-entrance/nexoraObjectEducationExperience";
import { conversationEducationOf } from "@/app/lib/nexora-entrance/nexoraConversationEducationExperience";
import {
  resetNexoraExperienceAwareStageOverview,
  resolveExecutiveExperienceContext,
  resolveExperienceAwareAdvisorSubject,
} from "@/app/lib/nexora-entrance/nexoraExecutiveExperienceContext";
import { attentionEducationOf } from "@/app/lib/nexora-entrance/nexoraAttentionEducationExperience";
import { dataEducationOf } from "@/app/lib/nexora-entrance/nexoraDataEducationExperience";
import { visualEducationOf } from "@/app/lib/nexora-entrance/nexoraVisualEducationExperience";
import { decisionLoopEducationOf } from "@/app/lib/nexora-entrance/nexoraDecisionLoopEducationExperience";
import { trustReviewOf } from "@/app/lib/nexora-entrance/nexoraTrustReviewExperience";
import { personalDemoHandoffOf } from "@/app/lib/nexora-entrance/nexoraPersonalDemoHandoffExperience";
import {
  applyNexoraGuidedAttentionRuntime,
  emptyNexoraGuidedAttentionRuntime,
  type NexoraGuidedAttentionTarget,
} from "@/app/lib/director/nexoraGuidedAttentionPresentation";
import {
  emptyNexoraVisualViewRuntime,
  type NexoraVisualViewRuntime,
} from "@/app/lib/director/nexoraVisualIntelligence";
import type {
  NexoraConversationalAdvisorGrounding,
  NexoraConversationalExperienceTrace,
  NexoraConversationalMessage,
} from "@/app/lib/conversational-control/conversationalExperience";
import { createEmptyNexoraExecutiveContextSnapshot, freezeExecutiveContextSnapshot } from "@/app/lib/conversational-control/executiveContextSnapshot";
import type { NexoraExecutiveContextSnapshot } from "@/app/lib/conversational-control/executiveContextSnapshot";
import { toNexoraConversationContextSnapshot } from "@/app/lib/conversational-control/executiveContextProjection";
import { syncNexoraExecutiveContextFromRuntimeState } from "@/app/lib/nex-mvp/nexoraMVPExecutiveContextAwareness";
import { projectManagerObjectConversationalSubjects } from "@/app/lib/manager-object/managerObjectCatalog";
import {
  activateManagerObjectFromClick,
  createEmptyManagerObjectSession,
  type ManagerObjectSession,
} from "@/app/lib/manager-object/managerObjectActive";
import { createEmptyNexoraExecutiveScenarioSession } from "@/app/lib/conversational-control/executiveScenarioResolver";
import type { NexoraExecutiveScenarioSession } from "@/app/lib/conversational-control/executiveScenarioResolver";
import { createEmptyNexoraExecutiveDecisionSession } from "@/app/lib/conversational-control/executiveDecisionAuthority";
import type { NexoraExecutiveDecisionSession } from "@/app/lib/conversational-control/executiveDecisionAuthority";
import {
  createNexoraCanonicalDecisionRuntime,
  hydrateNexoraCanonicalDecisionRuntimeRecords,
  NEXORA_CANONICAL_DECISION_RUNTIME_SESSION_KEY,
  serializeNexoraCanonicalDecisionRuntimeState,
} from "@/app/lib/conversational-control/executiveDecisionRuntimeAdapter";
import type { NexoraCanonicalDecisionRuntime } from "@/app/lib/conversational-control/executiveDecisionRuntimeAdapter";
import {
  createNexoraCanonicalExecutionRuntime,
  hydrateNexoraCanonicalExecutionRuntimeRecords,
  NEXORA_CANONICAL_EXECUTION_RUNTIME_SESSION_KEY,
  serializeNexoraCanonicalExecutionRuntimeState,
} from "@/app/lib/conversational-control/executiveExecutionRuntimeAdapter";
import type {
  NexoraCanonicalExecution,
  NexoraCanonicalExecutionRuntimeAdapter,
} from "@/app/lib/conversational-control/executiveExecutionRuntimeAdapter";
import { bootstrapCanonicalDecisionsFromFlowFixtures } from "@/app/lib/conversational-control/executiveDecisionStatusProjection";
import { createInitialNexoraMVPFlowDecisionRecords } from "@/app/lib/nex-mvp/nexoraMVPExecutiveFlowFixtures";
import type { ExecutiveQueueCategory } from "@/app/lib/spatial-presentation/executiveStageProductivityContract";
import {
  applyNexoraMVPPresentationDensity,
  applyNexoraMVPPresentationStateChange,
  completeNexoraMVPOperationPresentation,
  nexoraMVPAcceptedVisualPresentationChanged,
  deriveNexoraMVPPresentationViewModel,
  type NexoraMVPPresentationAvailableAction,
} from "@/app/lib/nex-mvp/nexoraMVPPresentationState";
import {
  applyNexoraMVPWorkspaceChangeToInteraction,
  deriveNexoraMVPSceneEnvironmentVisualState,
  deriveNexoraMVPWorkspacePresentation,
} from "@/app/lib/nex-mvp/nexoraMVPWorkspacePresentation";
import { ExecutiveContextBar } from "../exs1/shell/ExecutiveContextBar";
import { NexoraManagerWorkspaceControl } from "./NexoraManagerWorkspaceControl";
import { ExecutiveEmptyState } from "../exs1/shell/ExecutiveEmptyState";
import { ExecutiveExplorerDrawer } from "../exs1/shell/ExecutiveExplorerDrawer";
import { ExecutiveFloatingPanel } from "../exs1/shell/ExecutiveFloatingPanel";
import { ExecutiveLeftNav } from "../exs1/shell/ExecutiveLeftNav";
import { ExecutiveStageFrame } from "../exs1/shell/ExecutiveStageFrame";
import { ExecutiveStatusBar } from "../exs1/shell/ExecutiveStatusBar";
import { ExecutiveTimelineDock } from "../exs1/shell/ExecutiveTimelineDock";
import { cockpit } from "../exs1/shell/executiveCockpitTheme";
import {
  applyResolvedUiThemeToDocument,
  getSystemPrefersDark,
  persistThemeMode,
  readStoredThemeMode,
  resolveThemeMode,
} from "@/app/lib/ui/nexoraUiTheme";
import { bindMediaQueryListener } from "@/app/lib/dom/domListenerLifecycle";
import {
  explorerTitle,
  navToExplorer,
  type ExecutiveAdvisorTab,
  type ExecutiveFloatingPanelKind,
  type ExecutiveNavId,
  type ExecutiveThemeMode,
  type ExecutiveTimelineLens,
} from "../exs1/shell/executiveCockpitTypes";
import { NexoraAdvisorInsightRegion } from "./NexoraAdvisorInsightRegion";
import { NexoraExecutiveFlowContextIndicator } from "./flow/NexoraExecutiveFlowContextIndicator";
import { NexoraFlowFloatingContent } from "./flow/NexoraFlowFloatingContent";
import { NexoraFlowJournalExplorer } from "./flow/NexoraFlowJournalExplorer";
import { NexoraStageMount } from "./NexoraStageMount";
import { hostNmiLiveManagementIntelligence } from "@/app/lib/nmi/nmiLivePipeline";
import { projectStageProdLiveFoundation, stageProdRequestedVisualRemainsValid } from "@/app/lib/stage-prod/stageProdPublicIndex";
import {
  presentationByParticipantId,
  mapCapturedObservationsForTheatre,
  projectNexoraDecisionTheatreFoundation,
  type NexoraDecisionTheatreComparisonAuthority,
} from "@/app/lib/decision-theatre/nexoraDecisionTheatrePublicIndex.ts";
import {
  deriveNexoraDecisionTheatreDataObjectId,
  projectCsvImportAsDecisionTheatreDataObject,
} from "@/app/lib/decision-theatre/nexoraDecisionTheatreDataObjectProjection.ts";
import {
  projectNexoraDecisionTheatreDataObjectsToStage,
} from "@/app/lib/decision-theatre/nexoraDecisionTheatreDataObjectStageProjection.ts";
import { answerNexoraDecisionTheatreDataObjectInquiry } from "@/app/lib/decision-theatre/nexoraDecisionTheatreDataObjectAdvisor.ts";
import { analyzeCsvSourceRemovalImpact } from "@/app/lib/data-reality/csvSourceRemovalImpact.ts";
import { answerCsvSourceRemovalInquiry } from "@/app/lib/data-reality/csvSourceRemovalAdvisor.ts";
import { listCapturedObservations } from "@/app/lib/executive-intelligence/nexoraLiveOutcomeObservationCapture.ts";
import { NexoraWorkspaceDialMount } from "./NexoraWorkspaceDialMount";
import { NexoraExecutiveDataExplorer } from "./data/NexoraExecutiveDataExplorer";
import { NexoraStageDataControl } from "./stage/NexoraStageDataControl";
import { NexoraAutomaticMonitoringCoordinator } from "./data/NexoraAutomaticMonitoringCoordinator";
import { NexoraExecutiveQueueOverlay } from "./stage/NexoraExecutiveQueueOverlay";
import { NexoraManagementLevelContextNav } from "./stage/NexoraManagementLevelContextNav";
import { composeNmiStageProjection } from "@/app/lib/nmi/nmiStageProjectionCompose.ts";
import { composeNmiLiveManagementLevels } from "@/app/lib/nmi/nmiLiveManagementLevelsCompose.ts";
import {
  NexoraDetailWorkspaceBoundary,
  NexoraWorkspaceRegionBoundary,
} from "./scene-org/NexoraWorkspaceRegionBoundary";
import { createSceneOrgCanonicalReference } from "@/app/lib/scene-org/sceneOrgRegionContract";
import { emptySceneOrgDetailReference } from "@/app/lib/scene-org/sceneOrgDetailWorkspaceContract";
import { listSupportedGroundedLearningForSubject } from "@/app/lib/executive-intelligence/nexoraGroundedLearningIntelligence";
import {
  collectLiveHistoricalObservations,
  historicalActivityEntry,
  historicalLensRange,
  historicalPresentationNavigationSubject,
  historicalPresentationRisk,
  readCanonicalHistoricalPresentation,
  selectTimelineCapturesForManagerWorkspace,
  selectTimelineRecordsForManagerWorkspace,
} from "@/app/lib/historical-truth/historicalTruthPresentation";
import {
  getLiveDataConnectionVersion,
  subscribeLiveDataConnections,
} from "@/app/lib/data-reality/liveDataConnectionStore";
import {
  createSceneOrgSavedScene,
  resolveSceneOrgSavedSceneCaptureId,
  resolveSceneOrgSavedScene,
  type SceneOrgSavedScene,
} from "@/app/lib/scene-org/sceneOrgWorkspacePlacementContract";
import {
  loadSceneOrgSavedScenes,
  persistSceneOrgSavedScenes,
  SCENE_ORG_SAVED_SCENE_DURABILITY_VERSION,
  SCENE_ORG_SAVED_SCENE_DURABILITY_BOUNDARY,
} from "@/app/lib/scene-org/sceneOrgSavedSceneDurability";
import {
  assessSceneOrgSavedSceneOpen,
  listSceneOrgSavedScenesForManagerWorkspace,
  resolveSceneOrgSavedSceneAccess,
  type SceneOrgSavedSceneAccessResolution,
} from "@/app/lib/scene-org/sceneOrgSavedSceneCollectionAccess";
import {
  applySceneOrgSavedSceneCollectionMutation,
  type SceneOrgSavedSceneCollectionMutation,
  type SceneOrgSavedSceneMutationResult,
} from "@/app/lib/scene-org/sceneOrgSavedSceneCollectionMutation";
import { NexoraSavedSceneCollectionAccess } from "./NexoraSavedSceneCollectionAccess";
import {
  createSceneOrgRightPanelChromeState,
  updateSceneOrgRightPanelChrome,
} from "@/app/lib/scene-org/sceneOrgRightContextContract";
import {
  activateSceneOrgRightPackageTab,
  closeSceneOrgRightPackageTab,
  createEmptySceneOrgRightPackageTabSession,
  openSceneOrgRightPackageTab,
  syncSceneOrgRightSelectedObjectTab,
} from "@/app/lib/scene-org/sceneOrgRightPackageTabContract";

const DEFAULT_CONTEXT = Object.freeze({
  company: "Nexora",
  model: "Executive Model",
  pack: "Overview",
  liveStatus: "Local",
});

function applyInteractionToApplication(
  previous: ReturnType<typeof createInitialNexoraExecutiveShellApplicationState>,
  interaction: NexoraMVPObjectInteractionState,
) {
  const subjects = mapNexoraMVPInteractionStateToApplicationSubjects(interaction);
  return Object.freeze({
    ...previous,
    presentationState: interaction.presentationState,
    workspace: interaction.workspace,
    environmentIntent: interaction.environmentIntent,
    selectedSubject: subjects.selectedSubject,
    focusedSubject: subjects.focusedSubject,
    activeSurface: "stage" as const,
  });
}

/**
 * NEX-MVP:2 shell + NEX-MVP:8 executive flow integration.
 * Visible Executive Decision Environment composition root.
 *
 * P2:3 / P2:4 / P2:5 are sibling consumers of one shared P2:2 Runtime Reality
 * State. P2:6 converts P2:5 into Stage choreography; P2:7 reveals canonical
 * connections/context around the P2:6 anchor. Interaction remains independent
 * of business truth.
 */
export function NexoraExecutiveShell({
  datasetScenario = "baseline",
  entranceRequested = false,
  resetEntrance = false,
  deploymentMode = "local",
  session = ANONYMOUS_NEXORA_SESSION,
  authProvider = "none",
  authError = null,
  hostedWorkspaces = [],
  hostedWorkspaceStatus = "ready",
}: {
  readonly datasetScenario?: NexoraMVPDataRealityDatasetScenario;
  readonly entranceRequested?: boolean;
  readonly resetEntrance?: boolean;
  readonly deploymentMode?: NexoraDeploymentMode;
  readonly session?: NexoraClientSessionProjection;
  readonly authProvider?: NexoraAuthProviderId;
  readonly authError?: string | null;
  readonly hostedWorkspaces?: readonly HostedWorkspaceProjection[];
  readonly hostedWorkspaceStatus?: "ready" | "unavailable";
}) {
  const shellIdentity = getNexoraExecutiveShellIdentity();
  const [application, setApplication] = useState(
    createInitialNexoraExecutiveShellApplicationState,
  );
  const [entranceSession, setEntranceSession] = useState<NexoraEntranceSession>(
    () => {
      const stored = entranceRequested
        ? readStoredEntranceIdentity()
        : null;
      const created = createNexoraEntranceSession({
        workspaceResolution: entranceRequested
          ? stored && !resetEntrance
            ? "returning-sufficient"
            : "first-time"
          : "existing-workspace",
        identity: stored,
        educationalReentry: Boolean(resetEntrance && entranceRequested),
      });
      return entranceRequested && created.workspaceResolution === "first-time"
        ? withActiveNexoraGuidedEntrance(created)
        : created;
    },
  );
  const [interaction, setInteraction] = useState(() => {
    const initial = createInitialNexoraMVPObjectInteractionState({
      workspace: application.workspace,
      presentationState: application.presentationState,
      environmentIntent: application.environmentIntent,
    });
    return isNexoraEntranceRestrained(entranceSession)
      ? applyEntranceCenterSubject(initial, entranceSession)
      : initial;
  });
  const [activeCsvImport, setActiveCsvImport] =
    useState<CsvCommittedImport | null>(null);
  const csvImportStoreVersion = useSyncExternalStore(
    subscribeCsvRealDataImports,
    getCsvRealDataImportVersion,
    () => 0,
  );
  const liveDataStoreVersion = useSyncExternalStore(
    subscribeLiveDataConnections,
    getLiveDataConnectionVersion,
    () => 0,
  );
  const csvDurability = useSyncExternalStore(
    subscribeCsvDurabilityHealth,
    getCsvDurabilityHealth,
    () => "idle" as const,
  );
  const [csvHydrated, setCsvHydrated] = useState(false);
  const dataWorkspaceId = useSyncExternalStore(
    subscribeWorkspaceRegistry,
    readLiveExecutiveDataWorkspaceId,
    () => DEMO_WORKSPACE_ID,
  );
  const storedDemoProfile = useSyncExternalStore(
    subscribeDemoProfile,
    readStoredDemoProfile,
    () => null,
  );
  const managerWorkspaceProjectionReady = useSyncExternalStore(
    subscribeWorkspaceRegistry,
    () => true,
    () => false,
  );
  const modernDemoActive =
    isDemoProfileId(storedDemoProfile) && dataWorkspaceId === DEMO_WORKSPACE_ID;
  const permitProductFixtures =
    managerWorkspaceProjectionReady &&
    !isRealManagerWorkspaceId(dataWorkspaceId) &&
    !modernDemoActive;
  const dataWorkspaceIdRef = useRef(dataWorkspaceId);
  dataWorkspaceIdRef.current = dataWorkspaceId;
  useLayoutEffect(() => {
    if (hostedManagerRegistryRecovery(deploymentMode) === "contain") return;
    recoverWorkspaceRegistryFromStorage();
  }, [deploymentMode]);
  useEffect(() => {
    setActiveCsvImport((current) => current && current.workspaceId !== dataWorkspaceId ? null : current);
  }, [dataWorkspaceId]);
  useEffect(() => {
    if (hostedManagerRegistryRecovery(deploymentMode) === "contain") {
      let cancelled = false;
      if (isCustomerHostedWorkspaceId(dataWorkspaceId)) {
        setHostedManagerDataPhase("loading");
        releaseWorkspaceCsvAuthority(dataWorkspaceId);
        void loadHostedManagerSnapshot(dataWorkspaceId).then((phase) => {
          if (cancelled || dataWorkspaceIdRef.current !== dataWorkspaceId) return;
          setHostedManagerDataPhase(phase);
          setCsvHydrated(true);
        }).catch(() => {
          if (cancelled || dataWorkspaceIdRef.current !== dataWorkspaceId) return;
          releaseWorkspaceCsvAuthority(dataWorkspaceId);
          setHostedManagerDataPhase("error");
          setCsvHydrated(true);
        });
        return () => {
          cancelled = true;
        };
      }
      setHostedManagerDataPhase("idle");
      const binding = resolveLiveExecutiveDataWorkspace();
      const storedProfile = readStoredDemoProfile();
      const modernProfile = isDemoProfileId(storedProfile) && dataWorkspaceId === DEMO_WORKSPACE_ID;
      if (
        modernProfile &&
        binding.workspaceId === dataWorkspaceId &&
        acceptNewManagerPersistenceWorkspaceId(binding.workspaceId)
      ) {
        if (storedProfile === PROJECT_DEMO_PROFILE_ID) {
          ensureProjectDemoPackage({ workspaceId: binding.workspaceId });
        } else if (storedProfile === MANUFACTURING_DEMO_PROFILE_ID) {
          ensureManufacturingDemoPackage({ workspaceId: binding.workspaceId });
        }
      } else if (
        binding.demoBootstrapPermitted &&
        binding.workspaceId === dataWorkspaceId &&
        acceptNewManagerPersistenceWorkspaceId(binding.workspaceId)
      ) {
        retireAllDemoProfileImports(binding.workspaceId);
        ensureCsvMvpDemoBootstrap({ workspaceId: binding.workspaceId });
      }
      setCsvHydrated(true);
      return;
    }
    if (hostedManagerRegistryRecovery(deploymentMode) !== "contain") {
      recoverWorkspaceRegistryFromStorage();
    }
    let cancelled = false;
    let unbind: (() => void) | null = null;
    void (async () => {
      await recoverCsvRealDataImportDurabilityBrowser();
      if (cancelled) return;
      const binding = resolveLiveExecutiveDataWorkspace();
      if (isRealManagerWorkspaceId(binding.workspaceId)) {
        await persistCsvRealDataImportDurabilityBrowser();
        if (cancelled) return;
        setCsvHydrated(true);
        unbind = bindCsvRealDataImportDurabilityPersistence();
        return;
      }
      const storedProfile = readStoredDemoProfile();
      const modernProfile =
        isDemoProfileId(storedProfile) && dataWorkspaceId === DEMO_WORKSPACE_ID;
      if (
        modernProfile &&
        binding.workspaceId === dataWorkspaceId &&
        acceptNewManagerPersistenceWorkspaceId(binding.workspaceId)
      ) {
        if (storedProfile === PROJECT_DEMO_PROFILE_ID) {
          ensureProjectDemoPackage({ workspaceId: binding.workspaceId });
        } else if (storedProfile === MANUFACTURING_DEMO_PROFILE_ID) {
          ensureManufacturingDemoPackage({ workspaceId: binding.workspaceId });
        }
      } else if (
        binding.demoBootstrapPermitted &&
        binding.workspaceId === dataWorkspaceId &&
        acceptNewManagerPersistenceWorkspaceId(binding.workspaceId)
      ) {
        retireAllDemoProfileImports(binding.workspaceId);
        ensureCsvMvpDemoBootstrap({ workspaceId: binding.workspaceId });
      }
      await persistCsvRealDataImportDurabilityBrowser();
      if (cancelled) return;
      setCsvHydrated(true);
      unbind = bindCsvRealDataImportDurabilityPersistence();
    })();
    return () => {
      cancelled = true;
      unbind?.();
    };
  }, [dataWorkspaceId, storedDemoProfile, deploymentMode]);
  const committedCsvImports = useMemo(
    () => listCsvRealDataImports(dataWorkspaceId),
    [csvImportStoreVersion, dataWorkspaceId],
  );
  const csvDataObjects = useMemo(
    () => committedCsvImports.map(projectCsvImportAsDecisionTheatreDataObject),
    [committedCsvImports],
  );
  const [activeLiveObservation, setActiveLiveObservation] =
    useState<NexoraLiveCommittedObservation | null>(null);
  const [sourceAdvisorContext, setSourceAdvisorContext] =
    useState<ExecutiveSourceAdvisorContext | null>(null);
  const activeCsvDataset = activeCsvImport?.prepared.handoff?.dataset;
  const activeSourceDataset = activeLiveObservation?.handoff.dataset ?? activeCsvDataset;

  const experienceContext = resolveExecutiveExperienceContext(entranceSession);

  const dataRealityExperience = useMemo(() => {
    const restrained = isNexoraEntranceRestrained(entranceSession);
    const result = resolveNexoraMVPDataRealityAwareStageExperience({
      datasetScenario,
      ...(activeSourceDataset ? { dataset: activeSourceDataset } : {}),
      ...(permitProductFixtures
        ? {}
        : {
            baseCatalog: createEmptyNexoraMVPObjectInteractionCatalog(),
            suppressUnownedDemoDataset: true,
          }),
      focusedObjectId: interaction.focusedSubject?.id,
      selectedObjectId: interaction.selectedSubject?.id,
      selectedObjectIds: interaction.selectedSubject
        ? [interaction.selectedSubject.id]
        : undefined,
      currentWorkspace: interaction.workspace,
      presentationState: interaction.presentationState,
      requestedIntent: "investigate",
      ...(restrained
        ? {
            baseCatalog: projectNexoraEntranceCatalog(entranceSession),
          }
        : {}),
    });
    if (!restrained) return result;
    return Object.freeze({
      ...result,
      catalog: stabilizeEntranceCatalog(result.catalog),
    });
  }, [
    datasetScenario,
    activeSourceDataset,
    interaction.focusedSubject?.id,
    interaction.selectedSubject,
    interaction.workspace,
    interaction.presentationState,
    entranceSession,
    permitProductFixtures,
  ]);

  const dataRealityAdvisorExperience = useMemo(
    () =>
      resolveNexoraMVPDataRealityAwareAdvisorExperience({
        runtimeState: dataRealityExperience.runtimeState,
        focusedObjectId: interaction.focusedSubject?.id,
        selectedObjectId: interaction.selectedSubject?.id,
        presentationState: interaction.presentationState,
        workspace: interaction.workspace,
      }),
    [
      dataRealityExperience.runtimeState,
      interaction.focusedSubject?.id,
      interaction.selectedSubject?.id,
      interaction.presentationState,
      interaction.workspace,
    ],
  );

  const dataRealityFocusAttentionExperience = useMemo(
    () =>
      resolveNexoraMVPDataRealityAwareFocusAttentionExperience({
        runtimeState: dataRealityExperience.runtimeState,
        focusedObjectId: interaction.focusedSubject?.id,
        selectedObjectId: interaction.selectedSubject?.id,
        presentationState: interaction.presentationState,
        workspace: interaction.workspace,
        mode: interaction.mode,
      }),
    [
      dataRealityExperience.runtimeState,
      interaction.focusedSubject?.id,
      interaction.selectedSubject?.id,
      interaction.presentationState,
      interaction.workspace,
      interaction.mode,
    ],
  );

  const dataRealitySceneChoreography = useMemo(() => {
    const stageObjects = dataRealityExperience.catalog.objects.map((entry) =>
      Object.freeze({ objectId: entry.id }),
    );
    const relationships = dataRealityExperience.catalog.relationships.map(
      (entry) =>
        Object.freeze({
          id: entry.id,
          sourceId: entry.sourceId,
          targetId: entry.targetId,
        }),
    );
    return resolveNexoraMVPDataRealityAwareSceneChoreography({
      focusAttention: dataRealityFocusAttentionExperience.focusAttention,
      stageObjects,
      relationships,
      presentationState: interaction.presentationState,
      workspace: interaction.workspace,
      mode: interaction.mode,
    });
  }, [
    dataRealityExperience.catalog,
    dataRealityFocusAttentionExperience.focusAttention,
    interaction.presentationState,
    interaction.workspace,
    interaction.mode,
  ]);

  const dataRealityConnectionsContext = useMemo(() => {
    const relationships = dataRealityExperience.catalog.relationships.map(
      (entry) =>
        Object.freeze({
          id: entry.id,
          sourceId: entry.sourceId,
          targetId: entry.targetId,
        }),
    );
    const contextLinks = dataRealityExperience.catalog.contextLinks.map(
      (entry) =>
        Object.freeze({
          id: entry.id,
          objectId: entry.objectId,
          contextId: entry.contextId,
          relation: entry.relation,
        }),
    );
    const contextSubjects = dataRealityExperience.catalog.contextSubjects.map(
      (entry) =>
        Object.freeze({
          id: entry.id,
          kind: entry.kind,
          label: entry.label,
        }),
    );
    return resolveNexoraMVPDataRealityAwareConnectionsContext({
      choreography: dataRealitySceneChoreography.choreography,
      relationships,
      contextLinks,
      contextSubjects,
      presentationState: interaction.presentationState,
      workspace: interaction.workspace,
      mode: interaction.mode,
    });
  }, [
    dataRealityExperience.catalog,
    dataRealitySceneChoreography.choreography,
    interaction.presentationState,
    interaction.workspace,
    interaction.mode,
  ]);

  const [flowDomain, setFlowDomain] = useState(() =>
    permitProductFixtures
      ? createInitialNexoraMVPFlowDomainState()
      : createEmptyNexoraMVPFlowDomainState(),
  );
  const [theme, setThemeState] = useState<ExecutiveThemeMode>("night");
  const [prefersDark, setPrefersDark] = useState(false);

  useLayoutEffect(() => {
    const stored = readStoredThemeMode();
    const dark = getSystemPrefersDark();
    setThemeState(stored);
    setPrefersDark(dark);
    applyResolvedUiThemeToDocument(resolveThemeMode(stored, dark));
  }, []);

  useEffect(() => {
    if (theme !== "auto") return undefined;
    return bindMediaQueryListener(
      "(prefers-color-scheme: dark)",
      (event) => {
        setPrefersDark(event.matches);
        applyResolvedUiThemeToDocument(resolveThemeMode("auto", event.matches));
      },
      {
        component: "NexoraExecutiveShell",
        elementId: "prefers-color-scheme: dark",
        eventType: "change",
      },
    );
  }, [theme]);

  const setTheme = useCallback((next: ExecutiveThemeMode) => {
    setThemeState(next);
    persistThemeMode(next);
    applyResolvedUiThemeToDocument(
      resolveThemeMode(next, getSystemPrefersDark()),
    );
  }, []);

  const resolvedUiTheme = resolveThemeMode(theme, prefersDark);
  const [activeNav, setActiveNav] = useState<ExecutiveNavId>("Home");
  const [nmiPanelOpen, setNmiPanelOpen] = useState(false);
  const [detailLaunchReference, setDetailLaunchReference] =
    useState<ReturnType<typeof createSceneOrgCanonicalReference> | null>(null);
  const [rightPanelChrome, setRightPanelChrome] = useState(
    createSceneOrgRightPanelChromeState,
  );
  const [savedScenes, setSavedScenes] = useState<readonly SceneOrgSavedScene[]>(
    Object.freeze([]),
  );
  const savedScenesRef = useRef(savedScenes);
  savedScenesRef.current = savedScenes;
  const managerSavedScenes = useMemo(
    () => listSceneOrgSavedScenesForManagerWorkspace(savedScenes, dataWorkspaceId),
    [savedScenes, dataWorkspaceId],
  );
  const [savedSceneHydration, setSavedSceneHydration] = useState<Readonly<{
    status: "pending" | "loaded" | "empty" | "unavailable" | "invalid" | "incompatible";
    rejectedRecords: number;
  }>>({ status: "pending", rejectedRecords: 0 });
  const [hostedOperationalPhase, setHostedOperationalPhase] = useState<"idle" | "ready" | "error">("idle");
  const hostedOperationalApplyRef = useRef(false);
  useEffect(() => {
    if (deploymentMode === "hosted") return;
    const loaded = loadSceneOrgSavedScenes();
    savedScenesRef.current = loaded.scenes;
    setSavedScenes(loaded.scenes);
    setSavedSceneHydration({
      status: loaded.status,
      rejectedRecords: loaded.rejectedRecords,
    });
    if (loaded.status === "invalid" || loaded.status === "incompatible" || loaded.rejectedRecords > 0) {
      console.info(
        `Saved Scene durability rejected ${loaded.rejectedRecords} record(s): ${loaded.status}.`,
      );
    }
  }, [deploymentMode]);
  const [activeSavedSceneId, setActiveSavedSceneId] = useState<string | null>(null);
  const [savedSceneAccessResolution, setSavedSceneAccessResolution] =
    useState<SceneOrgSavedSceneAccessResolution | null>(null);
  const [savedSceneMutation, setSavedSceneMutation] =
    useState<SceneOrgSavedSceneMutationResult | null>(null);
  const [savedSceneRestoration, setSavedSceneRestoration] = useState<Readonly<{
    sceneId: string;
    status:
      | "resolved-current-canonical-subject"
      | "no-canonical-reference"
      | "canonical-subject-missing";
    requestedCanonicalId: string | null;
    restoredCanonicalId: string | null;
    requestedPresentationDepth: NexoraMVPPresentationState;
    resolvedPresentationDepth: NexoraMVPPresentationState;
    truthSource: "current-canonical-authorities";
  }> | null>(null);
  const [explorerWidth, setExplorerWidth] = useState(300);
  const [advisorTab, setAdvisorTab] = useState<ExecutiveAdvisorTab>("Assist");
  const [packageTabSession, setPackageTabSession] = useState(
    createEmptySceneOrgRightPackageTabSession,
  );
  const selectAdvisorTab = useCallback((nextTab: ExecutiveAdvisorTab) => {
    setAdvisorTab(nextTab);
    setPackageTabSession((session) =>
      activateSceneOrgRightPackageTab(
        session,
        nextTab === "Insight" ? "details" : "advisor",
      ),
    );
  }, []);
  const [timelineLens, setTimelineLens] =
    useState<ExecutiveTimelineLens>("week");
  const [selectedPackId, setSelectedPackId] = useState<string | null>(null);
  const [selectedJournalId, setSelectedJournalId] = useState<string | null>(
    null,
  );
  const [floatingKind, setFloatingKind] =
    useState<ExecutiveFloatingPanelKind>(null);
  const [selectedDataObjectId, setSelectedDataObjectId] = useState<string | null>(null);
  const [stagedDataObjectIds, setStagedDataObjectIds] = useState<readonly string[]>(Object.freeze([]));
  const [csvRemovalReviewSourceId, setCsvRemovalReviewSourceId] = useState<string | null>(null);
  const [dataRailSelectedSourceId, setDataRailSelectedSourceId] = useState<string | null>(null);

  // CC:5/CC:7 — short-lived conversational session + structured executive context.
  const [conversationalMessages, setConversationalMessages] = useState<
    readonly NexoraConversationalMessage[]
  >(Object.freeze([]));
  const guidedIntroSeededRef = useRef(false);
  useEffect(() => {
    if (guidedIntroSeededRef.current) return;
    const guided = guidedEntranceOf(entranceSession);
    if (guided.state !== "READY" || guided.introductionSeeded) return;
    guidedIntroSeededRef.current = true;
    const begun = beginNexoraGuidedEntranceIntroduction(
      entranceSession,
      interaction,
    );
    setEntranceSession(begun.session);
    setConversationalMessages(
      Object.freeze([
        composeNexoraGuidedEntranceIntroMessage({ seed: "nex-ent1-intro" }),
      ]),
    );
  }, [entranceSession, interaction]);
  const [executiveContext, setExecutiveContext] =
    useState<NexoraExecutiveContextSnapshot>(() =>
      createEmptyNexoraExecutiveContextSnapshot({
        currentWorkspaceId: "overview",
        managerWorkspaceId: readLiveExecutiveDataWorkspaceId(),
      }),
    );
  useEffect(() => {
    setExecutiveContext((current) =>
      current.managerWorkspaceId === dataWorkspaceId
        ? current
        : freezeExecutiveContextSnapshot({
            ...current,
            managerWorkspaceId: dataWorkspaceId,
          }),
    );
  }, [dataWorkspaceId]);
  const [scenarioSession, setScenarioSession] =
    useState<NexoraExecutiveScenarioSession>(() =>
      createEmptyNexoraExecutiveScenarioSession(),
    );
  const [decisionSession, setDecisionSession] =
    useState<NexoraExecutiveDecisionSession>(() =>
      createEmptyNexoraExecutiveDecisionSession(),
    );
  /** CC:10R / CC:10R.1 — one canonical Decision Runtime; flow fixtures bootstrap only. */
  const decisionRuntimeRef = useRef<NexoraCanonicalDecisionRuntime | null>(null);
  if (decisionRuntimeRef.current == null) {
    decisionRuntimeRef.current = createNexoraCanonicalDecisionRuntime({
      authorityId: "nexora.executive-shell.decision-runtime",
      initialDecisions: permitProductFixtures
        ? bootstrapCanonicalDecisionsFromFlowFixtures(
            createInitialNexoraMVPFlowDecisionRecords(),
          )
        : [],
    });
  }
  const decisionRuntime = decisionRuntimeRef.current;
  const executionRuntimeRef =
    useRef<NexoraCanonicalExecutionRuntimeAdapter | null>(null);
  if (executionRuntimeRef.current == null) {
    executionRuntimeRef.current = createNexoraCanonicalExecutionRuntime({
      decisionRuntime: decisionRuntime.adapter,
      authorityId: "nexora.executive-shell.execution-runtime",
    });
  }
  const executionRuntime = executionRuntimeRef.current;
  useEffect(() => {
    return subscribeDemoReset((result) => {
      if (result.status !== "reset") return;
      setActiveCsvImport(null);
      setActiveLiveObservation(null);
      setSourceAdvisorContext(null);
      setScenarioSession(createEmptyNexoraExecutiveScenarioSession());
      setDecisionSession(createEmptyNexoraExecutiveDecisionSession());
      setExecutiveContext(
        createEmptyNexoraExecutiveContextSnapshot({
          currentWorkspaceId: "overview",
          managerWorkspaceId: DEMO_WORKSPACE_ID,
        }),
      );
      setConversationalMessages(
        Object.freeze([
          composeNexoraGuidedEntranceIntroMessage({ seed: "nex-ent1-intro" }),
        ]),
      );
      setInteraction(
        createInitialNexoraMVPObjectInteractionState({
          workspace: application.workspace,
          presentationState: application.presentationState,
          environmentIntent: application.environmentIntent,
        }),
      );
      setFlowDomain(
        containNexoraMVPFlowDomainForManagerWorkspace(createEmptyNexoraMVPFlowDomainState(), {
          workspaceId: DEMO_WORKSPACE_ID,
          decisions: decisionRuntime.adapter.listDecisions(),
          executions: executionRuntime.listExecutions(),
        }),
      );
    });
  }, [application.environmentIntent, application.presentationState, application.workspace, decisionRuntime, executionRuntime]);
  useEffect(() => {
    if (deploymentMode === "hosted" && !isCustomerHostedWorkspaceId(dataWorkspaceId)) {
      hostedOperationalApplyRef.current = true;
      decisionRuntime.hydrateDecisions([]);
      executionRuntime.hydrateExecutions([]);
      const emptyScenes = Object.freeze([]);
      savedScenesRef.current = emptyScenes;
      setSavedScenes(emptyScenes);
      setSavedSceneHydration({ status: "empty", rejectedRecords: 0 });
      hostedOperationalApplyRef.current = false;
      return;
    }
    const hosted = deploymentMode === "hosted" && isCustomerHostedWorkspaceId(dataWorkspaceId);
    if (hosted) {
      let cancelled = false;
      hostedOperationalApplyRef.current = true;
      const project = () => {
        setFlowDomain((current) =>
          containNexoraMVPFlowDomainForManagerWorkspace(
            projectNexoraMVPFlowDecisionsFromCanonicalRuntime(
              createEmptyNexoraMVPFlowDomainState(),
              decisionRuntime.adapter,
            ),
            {
              workspaceId: dataWorkspaceId,
              decisions: decisionRuntime.adapter.listDecisions(),
              executions: executionRuntime.listExecutions(),
            },
          ),
        );
        setDecisionRevision((revision) => revision + 1);
      };
      void loadHostedOperations(dataWorkspaceId).then((snapshot) => {
        if (cancelled || dataWorkspaceIdRef.current !== dataWorkspaceId) return;
        decisionRuntime.hydrateDecisions(snapshot.decisions);
        executionRuntime.hydrateExecutions(snapshot.executions);
        const scenes = Object.freeze([...snapshot.scenes]);
        savedScenesRef.current = scenes;
        setSavedScenes(scenes);
        setSavedSceneHydration({
          status: snapshot.scenes.length > 0 ? "loaded" : "empty",
          rejectedRecords: 0,
        });
        setHostedOperationalPhase("ready");
        hostedOperationalApplyRef.current = false;
        project();
      }).catch(() => {
        if (cancelled || dataWorkspaceIdRef.current !== dataWorkspaceId) return;
        setHostedOperationalPhase("error");
        setSavedSceneHydration({ status: "unavailable", rejectedRecords: 0 });
        hostedOperationalApplyRef.current = false;
      });
      return () => {
        cancelled = true;
      };
    }
    const fixtures = bootstrapCanonicalDecisionsFromFlowFixtures(
      createInitialNexoraMVPFlowDecisionRecords(),
    );
    const fallback = permitProductFixtures ? fixtures : [];
    let hydrated = fallback;
    try {
      hydrated = hydrateNexoraCanonicalDecisionRuntimeRecords(
        window.sessionStorage.getItem(
          NEXORA_CANONICAL_DECISION_RUNTIME_SESSION_KEY,
        ),
        fallback,
      );
    } catch {
      // Browser storage may be unavailable; the canonical Runtime remains valid.
    }
    if (!permitProductFixtures) {
      hydrated = hydrated.filter(
        (record) => !isNexoraMVPProductFixtureDecisionId(record.decisionId),
      );
    }
    decisionRuntime.hydrateDecisions(hydrated);

    const syncDecisionProjection = () => {
      setFlowDomain((current) => {
        const projected = projectNexoraMVPFlowDecisionsFromCanonicalRuntime(
          permitProductFixtures ? current : createEmptyNexoraMVPFlowDomainState(),
          decisionRuntime.adapter,
        );
        return permitProductFixtures
          ? projected
          : containNexoraMVPFlowDomainForManagerWorkspace(projected, {
              workspaceId: dataWorkspaceId,
              decisions: decisionRuntime.adapter.listDecisions(),
              executions: executionRuntime.listExecutions(),
            });
      });
      setDecisionRevision((revision) => revision + 1);
      try {
        window.sessionStorage.setItem(
          NEXORA_CANONICAL_DECISION_RUNTIME_SESSION_KEY,
          serializeNexoraCanonicalDecisionRuntimeState(
            decisionRuntime.getState(),
          ),
        );
      } catch {
        // Persistence availability does not change Decision semantics.
      }
    };

    syncDecisionProjection();
    return decisionRuntime.subscribe(syncDecisionProjection);
  }, [dataWorkspaceId, decisionRuntime, deploymentMode, executionRuntime, permitProductFixtures]);
  useEffect(() => {
    if (deploymentMode === "hosted" && !isCustomerHostedWorkspaceId(dataWorkspaceId)) return;
    const hosted = deploymentMode === "hosted" && isCustomerHostedWorkspaceId(dataWorkspaceId);
    if (hosted) {
      const persist = () => {
        if (hostedOperationalApplyRef.current || dataWorkspaceIdRef.current !== dataWorkspaceId) return;
        const decisions = decisionRuntime.adapter.listDecisions().filter(
          (record) => record.workspaceId === dataWorkspaceId,
        );
        const executions = executionRuntime.listExecutions().filter(
          (record) => record.workspaceId === dataWorkspaceId,
        );
        void saveHostedOperations(dataWorkspaceId, { decisions, executions }).then(() => {
          if (dataWorkspaceIdRef.current === dataWorkspaceId) setHostedOperationalPhase("ready");
        }).catch(() => {
          if (dataWorkspaceIdRef.current === dataWorkspaceId) setHostedOperationalPhase("error");
        });
      };
      const unsubscribeDecision = decisionRuntime.subscribe(() => {
        setFlowDomain((current) =>
          containNexoraMVPFlowDomainForManagerWorkspace(
            projectNexoraMVPFlowDecisionsFromCanonicalRuntime(current, decisionRuntime.adapter),
            {
              workspaceId: dataWorkspaceId,
              decisions: decisionRuntime.adapter.listDecisions(),
              executions: executionRuntime.listExecutions(),
            },
          ),
        );
        setDecisionRevision((revision) => revision + 1);
        persist();
      });
      const unsubscribeExecution = executionRuntime.subscribe(() => {
        setFlowDomain((current) =>
          containNexoraMVPFlowDomainForManagerWorkspace(
            projectNexoraMVPFlowExecutionsFromCanonicalRuntime(current, executionRuntime),
            {
              workspaceId: dataWorkspaceId,
              decisions: decisionRuntime.adapter.listDecisions(),
              executions: executionRuntime.listExecutions(),
            },
          ),
        );
        setExecutionRevision((revision) => revision + 1);
        persist();
      });
      return () => {
        unsubscribeDecision();
        unsubscribeExecution();
      };
    }
    let hydrated: readonly NexoraCanonicalExecution[] = Object.freeze([]);
    try {
      hydrated = hydrateNexoraCanonicalExecutionRuntimeRecords(
        window.sessionStorage.getItem(
          NEXORA_CANONICAL_EXECUTION_RUNTIME_SESSION_KEY,
        ),
        [],
      );
    } catch {
      // Browser storage may be unavailable; the canonical Runtime remains valid.
    }
    executionRuntime.hydrateExecutions(hydrated);

    const persistExecutionProjection = () => {
      setFlowDomain((current) => {
        const projected = projectNexoraMVPFlowExecutionsFromCanonicalRuntime(
          current,
          executionRuntime,
        );
        return permitProductFixtures
          ? projected
          : containNexoraMVPFlowDomainForManagerWorkspace(projected, {
              workspaceId: dataWorkspaceId,
              decisions: decisionRuntime.adapter.listDecisions(),
              executions: executionRuntime.listExecutions(),
            });
      });
      setExecutionRevision((revision) => revision + 1);
      try {
        window.sessionStorage.setItem(
          NEXORA_CANONICAL_EXECUTION_RUNTIME_SESSION_KEY,
          serializeNexoraCanonicalExecutionRuntimeState(
            executionRuntime.getState(),
          ),
        );
      } catch {
        // Persistence availability does not change Execution semantics.
      }
    };

    persistExecutionProjection();
    return executionRuntime.subscribe(persistExecutionProjection);
  }, [dataWorkspaceId, decisionRuntime, deploymentMode, executionRuntime, permitProductFixtures]);
  const executiveContextRef = useRef(executiveContext);
  executiveContextRef.current = executiveContext;
  const [conversationalProcessing, setConversationalProcessing] =
    useState(false);
  const conversationalProcessingRef = useRef(false);
  const [conversationalLastTrace, setConversationalLastTrace] =
    useState<NexoraConversationalExperienceTrace | null>(null);
  const [ecaActionPlan, setEcaActionPlan] =
    useState<EcaConversationActionPlan | null>(null);
  const [ecaInitiativeJudgment, setEcaInitiativeJudgment] =
    useState<EcaExecutiveInitiativeJudgment | null>(null);
  const [ecaInformationNeedJudgment, setEcaInformationNeedJudgment] =
    useState<EcaExecutiveInformationNeedJudgment | null>(null);
  const [ecaAnswerIntakeJudgment, setEcaAnswerIntakeJudgment] =
    useState<EcaExecutiveAnswerIntakeJudgment | null>(null);
  const [ecaDialogueStrategy, setEcaDialogueStrategy] =
    useState<EcaExecutiveDialogueStrategy | null>(null);
  const [ecaRecommendationJudgment, setEcaRecommendationJudgment] =
    useState<EcaExecutiveRecommendationJudgment | null>(null);
  const [ecaCommitmentJudgment, setEcaCommitmentJudgment] =
    useState<EcaExecutiveCommitmentJudgment | null>(null);
  const [ecaExecutionReadinessJudgment, setEcaExecutionReadinessJudgment] =
    useState<EcaExecutiveExecutionReadinessJudgment | null>(null);
  const [ecaLiveExecutionJudgment, setEcaLiveExecutionJudgment] =
    useState<EcaLiveExecutionJudgment | null>(null);
  const [ecaOutcomeJudgment, setEcaOutcomeJudgment] =
    useState<EcaExecutiveOutcomeJudgment | null>(null);
  const [ecaLearningClosureJudgment, setEcaLearningClosureJudgment] =
    useState<EcaExecutiveLearningClosureJudgment | null>(null);
  const [dataAdvDiagnostics, setDataAdvDiagnostics] =
    useState<AdvisorDataInquiryDiagnostics | null>(null);
  const ecaWorkingContextRef = useRef<EcaWorkingConversationContext | null>(null);
  const conversationalAdvisorGroundingRef =
    useRef<NexoraConversationalAdvisorGrounding | null>(null);
  const onConversationalAdvisorGroundingChange = useCallback(
    (grounding: NexoraConversationalAdvisorGrounding) => {
      conversationalAdvisorGroundingRef.current = grounding;
    },
    [],
  );
  const lastConversationalCommandIdRef = useRef<string | null>(null);
  const lastManagerUtteranceRef = useRef<string | null>(null);
  const entranceSessionRef = useRef(entranceSession);
  entranceSessionRef.current = entranceSession;
  const stageEducationAckLockRef = useRef(false);
  if (stageEducationOf(entranceSession).state === "INACTIVE") {
    stageEducationAckLockRef.current = false;
  }
  const objectEducationAckLockRef = useRef<string | null>(null);
  if (objectEducationOf(entranceSession).state === "NOT_STARTED") {
    objectEducationAckLockRef.current = null;
  }
  const conversationalMessageSeqRef = useRef(0);
  const [guidedAttention, setGuidedAttention] = useState(emptyNexoraGuidedAttentionRuntime);
  const guidedAttentionRef = useRef(guidedAttention);
  guidedAttentionRef.current = guidedAttention;
  const [visualView, setVisualView] = useState<NexoraVisualViewRuntime>(emptyNexoraVisualViewRuntime);
  const visualViewRef = useRef(visualView);
  visualViewRef.current = visualView;
  const [visualizationRoute, setVisualizationRoute] = useState<
    import("@/app/lib/stage-prod/stageProdExecutiveVisualizationRoute").StageProdExecutiveVisualizationRoute | null
  >(null);
  const canStepBackRef = useRef(false);
  useEffect(() => {
    const presentation = guidedAttention.presentation;
    if (presentation == null) return;
    const remaining = Math.max(0, presentation.expiresAtMs - Date.now());
    const timer = window.setTimeout(() => {
      setGuidedAttention((current) =>
        applyNexoraGuidedAttentionRuntime({
          previous: current,
          nowMs: Date.now(),
        }),
      );
    }, remaining);
    return () => window.clearTimeout(timer);
    // Expiry is keyed by the current cue identity, not the presentation object.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guidedAttention.presentation?.requestId, guidedAttention.presentation?.expiresAtMs]);
  const [investigationLevel, setInvestigationLevel] = useState<
    "glance" | "understand" | "investigate"
  >("glance");
  const [comparisonLevel, setComparisonLevel] = useState<
    "choice" | "compare" | "decide"
  >("choice");
  const [investigationDismissedId, setInvestigationDismissedId] = useState<string | null>(
    null,
  );
  const selectedObject = interaction.focusedSubject ?? interaction.selectedSubject;
  useEffect(() => {
    if (selectedObject == null) return;
    setPackageTabSession((session) =>
      syncSceneOrgRightSelectedObjectTab(session, {
        package: "investigation",
        canonicalId: selectedObject.id,
        label: selectedObject.label,
      }),
    );
  }, [selectedObject?.id, selectedObject?.label]);
  const [comparisonAuthority, setComparisonAuthority] =
    useState<NexoraDecisionTheatreComparisonAuthority | null>(null);
  const [decisionReviewOpen, setDecisionReviewOpen] = useState(false);
  const [proposedCandidateId, setProposedCandidateId] = useState<string | null>(null);
  const [decisionRevision, setDecisionRevision] = useState(0);
  const [executionRevision, setExecutionRevision] = useState(0);
  const [managerObjectSession, setManagerObjectSession] =
    useState<ManagerObjectSession>(() => createEmptyManagerObjectSession());
  const managerObjectSessionRef = useRef(managerObjectSession);
  managerObjectSessionRef.current = managerObjectSession;
  const csvSemanticResolverRef = useRef<((utterance: string) => CsvSemanticClarificationResult) | null>(null);
  const csvSemanticConversationFieldRef = useRef<string | null>(null);
  const advisorDataDialogueRef = useRef(emptyAdvisorDataDialogue);

  const explorerKind = navToExplorer(activeNav);
  const detailWorkspaceOpen = activeNav === "Data";
  const selectedDataObjectSourceId =
    csvDataObjects.find((entry) => entry.id === selectedDataObjectId)?.sourceId ??
    null;
  const detailSourceId =
    dataRailSelectedSourceId ??
    selectedDataObjectSourceId ??
    activeCsvImport?.sourceContextId ??
    activeLiveObservation?.sourceContextId ??
    null;
  const detailWorkspaceTarget = useMemo(() => {
    if (detailLaunchReference) return detailLaunchReference;
    if (detailSourceId == null) return emptySceneOrgDetailReference();
    return createSceneOrgCanonicalReference({
      canonicalId: detailSourceId,
      kind: "data-source",
      owner: "RDI source authority",
    });
  }, [detailLaunchReference, detailSourceId]);
  const detailConfigurationAvailable = useMemo(
    () =>
      detailSourceId != null &&
      committedCsvImports.some(
        (source) => source.sourceContextId === detailSourceId,
      ),
    [committedCsvImports, detailSourceId],
  );
  const workspaceRegistry = getNexoraMVPWorkspaceRegistry();
  const workspaceLabel =
    workspaceRegistry.find((entry) => entry.kind === application.workspace)
      ?.label ?? application.workspace;

  const stageCatalog = useMemo(
    () =>
      projectNexoraMVPCatalogDecisionStatusesFromFlowDomain(
        dataRealityExperience.catalog,
        flowDomain,
      ),
    [dataRealityExperience.catalog, flowDomain],
  );

  const theatreProjection = useMemo(
    () => {
      void decisionRevision;
      void executionRevision;
      const relatedExecutions = executionRuntime.listExecutions().filter((item) =>
        permitProductFixtures || item.workspaceId === dataWorkspaceId,
      );
      return projectNexoraDecisionTheatreFoundation({
        stageState: interaction,
        catalog: stageCatalog,
        investigationLevel,
        comparisonLevel,
        ncaActiveComparison: managerObjectSession.ncaConversationState?.activeComparison
          ? Object.freeze({
              candidateIds: managerObjectSession.ncaConversationState.activeComparison.candidateIds,
              candidateKind: managerObjectSession.ncaConversationState.activeComparison.candidateKind,
              criterion: managerObjectSession.ncaConversationState.activeComparison.criterion,
            })
          : null,
        comparisonAuthority,
        decisionReviewOpen,
        proposedCandidateId,
        authoritativeDecisions: Object.freeze(
          decisionRuntime.adapter.listDecisions()
            .filter((item) => item.status === "Approved")
            .filter((item) => permitProductFixtures || item.workspaceId === dataWorkspaceId)
            .map((item) =>
              Object.freeze({
                decisionId: item.decisionId,
                title: item.title,
                status: item.status,
                scenarioId: item.scenarioId ?? null,
                committedBy: item.committedBy ?? null,
              }),
            ),
        ),
        pendingDecisionConfirmation: Boolean(decisionSession.pendingConfirmation),
        authoritativeExecutions: Object.freeze(
          relatedExecutions.map((item) =>
            Object.freeze({
              executionId: item.executionId,
              decisionId: item.decisionId,
              title: item.title,
              status: item.status,
              ownerIds: item.ownerIds,
              blockers: item.blockers,
              risks: item.risks,
              milestones: item.milestones,
              progress: item.progress,
            }),
          ),
        ),
        executionRuntimeAvailable: true,
        executionStarted: relatedExecutions.some(
          (item) =>
            item.status === "in-progress" ||
            item.status === "blocked" ||
            item.status === "at-risk" ||
            item.status === "completed",
        ),
        authoritativeOutcomeObservations: mapCapturedObservationsForTheatre({
          captured: listCapturedObservations(),
          executions: relatedExecutions,
        }),
      });
    },
    [
      interaction,
      stageCatalog,
      investigationLevel,
      comparisonLevel,
      managerObjectSession,
      comparisonAuthority,
      decisionReviewOpen,
      proposedCandidateId,
      decisionRuntime,
      decisionSession,
      decisionRevision,
      executionRuntime,
      executionRevision,
      dataWorkspaceId,
      permitProductFixtures,
    ],
  );
  const theatreIconicObjects = theatreProjection.iconicObjects;
  const visualPresentations = useMemo(
    () => presentationByParticipantId(theatreProjection.visualGrammar),
    [theatreProjection],
  );

  const stageInteraction = useMemo(() => {
    const base = deriveNexoraMVPStageInteractionPresentation(
      interaction,
      stageCatalog,
      experienceContext === "GUIDED_ENTRANCE"
        ? { overviewOccupancy: "current-catalog" }
        : undefined,
    );
    const withWorkspace = deriveNexoraMVPWorkspacePresentation(
      base,
      interaction.workspace,
    );
    const withDensity = applyNexoraMVPPresentationDensity(
      withWorkspace,
      interaction.presentationState,
    );
    const withChoreography =
      applyDataRealityAwareSceneChoreographyToStagePresentation(
        withDensity,
        dataRealitySceneChoreography.choreography,
      );
    const withConnections =
      applyDataRealityAwareConnectionsContextToStagePresentation(
        withChoreography,
        dataRealityConnectionsContext.connectionsContext,
      );
    const withObjectVisual =
      applyDataRealityObjectVisualStateToStagePresentationWithRetention(
        withConnections,
        dataRealitySceneChoreography.choreography.attentionRetention
          .objectIds,
      );
    const withFocus =
      applyDataRealityFocusSceneChoreographyToStagePresentation(
        withObjectVisual,
        dataRealitySceneChoreography.choreography,
      );
    const withConnectionVisual =
      applyDataRealityConnectionsContextVisualStateToStagePresentation(
        withFocus,
        dataRealityConnectionsContext.connectionsContext,
      );
    const withReadability =
      applyDataRealityExecutiveReadabilityToStagePresentation(
        withConnectionVisual,
      );
    // SP:4.1C grammar → SP:4.3 network (overview) → SP:4.2 plane
    // → STAGE-2D:2 flatten → STAGE-2D:3 click-to-center (focus) → STAGE-2D:1 camera.
    const withGrammar = applyExecutiveFocusVisualGrammarToStagePresentation(
      withReadability,
      { presentationDepth: interaction.presentationState },
    );
    const withNetwork =
      applyExecutiveNetworkTopologyToStagePresentation(withGrammar);
    const withPlane =
      applyExecutivePresentationPlaneToStagePresentation(withNetwork);
    const withTopologyPlane =
      applyExecutiveStage2DTopologyPlaneToStagePresentation(withPlane);
    const withRecomposition =
      applyExecutiveStage2DTopologyRecompositionToStagePresentation(
        withTopologyPlane,
      );
    // UX:5-FIX1 — collection peers are a distinct no-anchor topology mode.
    // Reassert membership and hard XY separation after every upstream writer.
    const withCollectionIntegrity =
      applyNexoraMVPExecutiveCollectionIntegrity(withRecomposition);
    const withLabels =
      applyExecutiveStageObjectLabelTerritoryToStagePresentation(
        withCollectionIntegrity,
        { presentationLevel: interaction.presentationState },
      );
    return applyExecutiveStageFixedCameraToStagePresentation(withLabels);
  }, [
    interaction,
    stageCatalog,
    experienceContext,
    dataRealitySceneChoreography.choreography,
    dataRealityConnectionsContext.connectionsContext,
  ]);
  canStepBackRef.current = stageInteraction.canStepBack === true;

  const nmiLive = useMemo(
    () =>
      hostNmiLiveManagementIntelligence({
        catalog: dataRealityExperience.catalog,
        queueEntries: stageInteraction.queueEntries ?? [],
        focusedSubjectId:
          stageInteraction.focusedSubjectId ?? stageInteraction.selectedSubjectId ?? null,
      }),
    [
      dataRealityExperience.catalog,
      stageInteraction.queueEntries,
      stageInteraction.focusedSubjectId,
      stageInteraction.selectedSubjectId,
    ],
  );
  const nmiLiveRef = useRef(nmiLive);
  nmiLiveRef.current = nmiLive;

  const managementLevels = useMemo(
    () =>
      composeNmiLiveManagementLevels({
        map: nmiLive.map,
        selectedCanonicalId:
          stageInteraction.focusedSubjectId ??
          stageInteraction.selectedSubjectId ??
          null,
      }),
    [
      nmiLive.map,
      stageInteraction.focusedSubjectId,
      stageInteraction.selectedSubjectId,
    ],
  );
  const managementLevelSpatial = managementLevels.spatial;

  const dataObjectStage = useMemo(
    () => projectNexoraDecisionTheatreDataObjectsToStage({
      dataObjects: csvDataObjects,
      visibleDataObjectIds: stagedDataObjectIds,
      selectedDataObjectId,
      businessFocusId: interaction.focusedSubject?.id ?? null,
      stageObjects: stageInteraction.scene.objects,
      sceneIntentKind: theatreProjection.sceneIntent.intentKind,
    }),
    [
      csvDataObjects,
      interaction.focusedSubject?.id,
      selectedDataObjectId,
      stagedDataObjectIds,
      stageInteraction.scene.objects,
      theatreProjection.sceneIntent.intentKind,
    ],
  );

  // NPA-T: establish change baseline only after hydration. Derive must not write
  // or consult the process-global store during SSR (Queue <li> mismatch).
  useEffect(() => {
    const snapshot = buildNexoraMVPExecutiveChangeSnapshot(
      dataRealityExperience.catalog,
      { workspace: interaction.workspace },
    );
    ensureExecutiveChangeBaseline({ currentSnapshot: snapshot });
  }, [dataRealityExperience.catalog, interaction.workspace]);

  const environmentVisual = useMemo(
    () =>
      deriveNexoraMVPSceneEnvironmentVisualState(
        interaction.environmentIntent,
        { uiTheme: resolvedUiTheme },
      ),
    [interaction.environmentIntent, resolvedUiTheme],
  );

  const focusedSubject =
    interaction.focusedSubject ?? interaction.selectedSubject;
  const educationalCenterSubject = useMemo(() => {
    if (experienceContext !== "GUIDED_ENTRANCE") return null;
    const id = entranceSession.centerSubjectId;
    const object =
      dataRealityExperience.catalog.objects.find((entry) => entry.id === id) ??
      dataRealityExperience.catalog.objects[0];
    if (object == null) return null;
    return Object.freeze({
      id: object.id,
      kind: "object" as const,
      label: object.label,
    });
  }, [
    dataRealityExperience.catalog.objects,
    entranceSession.centerSubjectId,
    experienceContext,
  ]);
  const advisorFocusedSubject = resolveExperienceAwareAdvisorSubject({
    experience: experienceContext,
    focused: interaction.focusedSubject,
    selected: interaction.selectedSubject,
    educationalCenter: educationalCenterSubject,
  });

  const presentationViewModel = useMemo(() => {
    const base = deriveNexoraMVPPresentationViewModel({
      presentationState: interaction.presentationState,
      workspace: interaction.workspace,
      environmentIntent: interaction.environmentIntent,
      subjectId: focusedSubject?.id ?? null,
      subjectKind: focusedSubject?.kind ?? null,
      subjectLabel: focusedSubject?.label ?? null,
    });
    const availableActions = resolveNexoraMVPFlowPresentationActions(
      base.availableActions,
      flowDomain,
      focusedSubject?.id ?? null,
    );
    const resolved = Object.freeze({
      ...base,
      essentialStatus: overlayNexoraMVPPresentationStatus(
        base.essentialStatus,
        flowDomain,
        focusedSubject?.id ?? null,
      ),
      availableActions,
    });
    const activeBinding =
      dataRealityExperience.usesActiveDataSource && focusedSubject != null
        ? getDataRealityAwareStageObjectBindingFromExperience(
            dataRealityExperience,
            focusedSubject.id,
          )
        : undefined;
    return alignPresentationViewModelToStageKpiTruth(
      resolved,
      activeBinding,
    );
  }, [dataRealityExperience, focusedSubject, flowDomain, interaction]);

  const advisorBridge = useMemo(
    () =>
      buildNexoraMVPAdvisorContextBridge(interaction, stageInteraction),
    [interaction, stageInteraction],
  );

  const liveStageFoundation = useMemo(
    () =>
      projectStageProdLiveFoundation({
        theatre: theatreProjection,
        nmi: nmiLive,
        focusedCanonicalObjectId:
          interaction.focusedSubject?.id ??
          interaction.selectedSubject?.id ??
          null,
        conversationalReferentId:
          advisorBridge.advisorSubjectId ??
          advisorBridge.focusedSubject?.id ??
          null,
      }),
    [advisorBridge, interaction, nmiLive, theatreProjection],
  );

  const timelineBridge = useMemo(
    () => buildNexoraMVPTimelineContextBridge(interaction),
    [interaction],
  );

  const flowContext = useMemo(
    () =>
      deriveNexoraMVPExecutiveFlowContext({
        workspace: interaction.workspace,
        presentationState: interaction.presentationState,
        focusedSubject: interaction.focusedSubject,
        selectedSubject: interaction.selectedSubject,
      }),
    [interaction],
  );
  const workflowPresentation = useMemo(() => {
    const focusedId = interaction.focusedSubject?.id ?? null;
    const binding = dataRealityAdvisorExperience.advisorBinding;
    const evidenceSubject =
      focusedId == null
        ? undefined
        : binding.prioritizedSubjects.find(
            (subject) => subject.objectId === focusedId,
          );
    const briefCompleteness =
      stageInteraction.decisionBrief?.completeness ?? "unavailable";
    const evidenceReadiness =
      evidenceSubject != null
        ? evidenceSubject.isUnresolved ||
          !evidenceSubject.hasData ||
          evidenceSubject.evidenceIds.length === 0
          ? ("limited" as const)
          : ("supported" as const)
        : briefCompleteness === "sufficient"
          ? ("supported" as const)
          : briefCompleteness === "partial"
            ? ("limited" as const)
            : ("unknown" as const);
    return deriveNexoraMVPExecutiveWorkflowPresentation({
      context: flowContext,
      flowState: flowDomain,
      evidenceReadiness,
      attentionSubjectId:
        binding.recommendations.recommendedFocus?.subjectId ?? null,
      // EI:6 / APP-4 are not wired to a validated live outcome in /executive.
      outcomeAvailable: false,
      learningAvailable: false,
    });
  }, [
    dataRealityAdvisorExperience.advisorBinding,
    flowContext,
    flowDomain,
    interaction.focusedSubject?.id,
    stageInteraction.decisionBrief?.completeness,
  ]);

  const canonicalHistorySubjectId =
    flowContext.sourceObject?.id ??
    (interaction.focusedSubject?.id?.startsWith("obj-")
      ? interaction.focusedSubject.id
      : interaction.selectedSubject?.id?.startsWith("obj-")
        ? interaction.selectedSubject.id
        : null);
  const managerHistory = useMemo(() => {
    void decisionRevision;
    void executionRevision;
    void csvImportStoreVersion;
    void liveDataStoreVersion;
    const snapshot =
      dataRealityExperience.runtimeState.sourceReality.certifiedAdvisorResult.dataRealitySnapshot;
    const observations = collectLiveHistoricalObservations({
      snapshotKpis: snapshot.kpis,
      datasetId: snapshot.datasetId,
      managerWorkspaceId: dataWorkspaceId,
    });
    if (canonicalHistorySubjectId == null) {
      return readCanonicalHistoricalPresentation({
        subjectId: "",
        decisions: [],
        executions: [],
        observations: [],
        outcomeCaptures: [],
        learnings: [],
      });
    }
    const range = historicalLensRange(timelineLens, new Date().toISOString()) ?? undefined;
    const decisions = decisionRuntime.adapter.listDecisions();
    const executions = executionRuntime.listExecutions();
    return readCanonicalHistoricalPresentation({
      subjectId: canonicalHistorySubjectId,
      subjectLabel: flowContext.sourceObject?.label ?? interaction.focusedSubject?.label ?? null,
      decisions: selectTimelineRecordsForManagerWorkspace(decisions, dataWorkspaceId),
      executions: selectTimelineRecordsForManagerWorkspace(executions, dataWorkspaceId),
      observations,
      outcomeCaptures: selectTimelineCapturesForManagerWorkspace(
        listCapturedObservations(),
        decisions,
        executions,
        dataWorkspaceId,
      ),
      learnings: selectTimelineRecordsForManagerWorkspace(
        listSupportedGroundedLearningForSubject({
          workspaceId: dataWorkspaceId,
          subjectId: canonicalHistorySubjectId,
        }),
        dataWorkspaceId,
      ),
      range,
    });
  }, [
    canonicalHistorySubjectId,
    csvImportStoreVersion,
    dataRealityExperience.runtimeState,
    decisionRevision,
    decisionRuntime,
    executionRevision,
    executionRuntime,
    flowContext.sourceObject?.label,
    interaction.focusedSubject?.label,
    liveDataStoreVersion,
    timelineLens,
    dataWorkspaceId,
  ]);
  const timelinePacks = managerHistory.timeline.map((item) =>
    Object.freeze({
      id: item.projectionKey,
      title: item.title,
      risk: historicalPresentationRisk(item.tone),
      timeLabel: item.timeLabel,
      placeable: item.placeable,
      sourceId: item.sourceId,
      factType: item.factType,
      projectionKey: item.projectionKey,
      group: item.group,
    }),
  );
  const activityEntries = managerHistory.activity.map((item) => historicalActivityEntry(item));

  const dataStatus = useMemo(
    () =>
      projectNexoraExecutiveDataStatus({
        usesActiveDataSource: dataRealityExperience.usesActiveDataSource,
        datasetSource: activeSourceDataset?.source ?? null,
        liveObservationActive: activeLiveObservation != null,
        csvImportActive: activeCsvImport != null,
        hasUnresolvedReality:
          dataRealityExperience.runtimeState.attention.hasUnresolvedReality,
      }),
    [
      activeCsvImport,
      activeLiveObservation,
      activeSourceDataset?.source,
      dataRealityExperience.runtimeState.attention.hasUnresolvedReality,
      dataRealityExperience.usesActiveDataSource,
    ],
  );

  const context = useMemo(
    () => ({
      company: DEFAULT_CONTEXT.company,
      model: DEFAULT_CONTEXT.model,
      pack: workspaceLabel,
      lens: timelineLens,
      theme,
      liveStatus: dataStatus.label,
      liveStatusKind: dataStatus.kind,
    }),
    [dataStatus, theme, timelineLens, workspaceLabel],
  );

  const syncExecutiveContextFromRuntime = useCallback(
    (
      nextState: typeof interaction,
      syncSource: "runtime" | "navigation" | "workspace-transition",
    ) => {
      const subjects = projectManagerObjectConversationalSubjects(
        dataRealityExperience.catalog,
      );
      const updated = syncNexoraExecutiveContextFromRuntimeState({
        previousContext: executiveContextRef.current,
        nextState,
        syncSource,
        executiveSubjects: subjects,
        catalog: dataRealityExperience.catalog,
      });
      setExecutiveContext(updated.nextContext);
    },
    [dataRealityExperience.catalog],
  );

  const onWorkspaceChange = useCallback(
    (workspace: NexoraMVPWorkspaceKind) => {
      setInteraction((current) => {
        const next = applyNexoraMVPWorkspaceChangeToInteraction(
          current,
          workspace,
        );
        const subjects = mapNexoraMVPInteractionStateToApplicationSubjects(next);
        setApplication((previous) =>
          Object.freeze({
            ...previous,
            workspace: next.workspace,
            presentationState: next.presentationState,
            environmentIntent: next.environmentIntent,
            selectedSubject: subjects.selectedSubject,
            focusedSubject: subjects.focusedSubject,
            activeSurface: "stage" as const,
          }),
        );
        syncExecutiveContextFromRuntime(next, "workspace-transition");
        return next;
      });
    },
    [syncExecutiveContextFromRuntime],
  );

  const onOverview = useCallback(() => {
    const session = entranceSessionRef.current;
    const experience = resolveExecutiveExperienceContext(session);
    setInteraction((previous) => {
      const reset = resetNexoraExperienceAwareStageOverview({
        state: previous,
        session,
      });
      const next = completeNexoraMVPOperationPresentation(reset, true);
      setApplication((app) => applyInteractionToApplication(app, next));
      // Overview is presentation reset — preserve executive structure (CC:7).
      syncExecutiveContextFromRuntime(next, "runtime");
      setInvestigationDismissedId(
        experience === "GUIDED_ENTRANCE"
          ? (previous.focusedSubject?.id ??
              previous.selectedSubject?.id ??
              session.centerSubjectId)
          : null,
      );
      setInvestigationLevel("glance");
      return next;
    });
  }, [syncExecutiveContextFromRuntime]);

  const onStepBack = useCallback(() => {
    setInteraction((previous) => {
      const next = stepBackNexoraMVPObjectInteraction(previous);
      setApplication((app) => applyInteractionToApplication(app, next));
      syncExecutiveContextFromRuntime(next, "navigation");
      return next;
    });
  }, [syncExecutiveContextFromRuntime]);

  const onStepForward = useCallback(() => {
    setInteraction((previous) => {
      const next = stepForwardNexoraMVPObjectInteraction(previous);
      setApplication((app) => applyInteractionToApplication(app, next));
      syncExecutiveContextFromRuntime(next, "navigation");
      return next;
    });
  }, [syncExecutiveContextFromRuntime]);

  const onNavigateTrailIndex = useCallback(
    (index: number) => {
      setInteraction((previous) => {
        const next = jumpNexoraMVPObjectInteractionNavigationTrail(
          previous,
          index,
        );
        setApplication((app) => applyInteractionToApplication(app, next));
        syncExecutiveContextFromRuntime(next, "navigation");
        return next;
      });
    },
    [syncExecutiveContextFromRuntime],
  );

  const onSelectSubject = useCallback(
    (subjectId: string | null) => {
      setSelectedDataObjectId(null);
      setInteraction((previous) => {
        const selected = selectNexoraMVPInteractionSubject(
          previous,
          subjectId,
          dataRealityExperience.catalog,
        );
        const next = completeNexoraMVPOperationPresentation(
          selected,
          selected !== previous,
        );
        setApplication((app) => applyInteractionToApplication(app, next));
        syncExecutiveContextFromRuntime(next, "runtime");
        setManagerObjectSession((session) =>
          activateManagerObjectFromClick(session, next.focusedSubject?.id ?? subjectId),
        );
        setInvestigationDismissedId(null);
        setInvestigationLevel("glance");
        const nextFocal = next.focusedSubject?.id ?? subjectId;
        const currentView = visualViewRef.current.view;
        if (
          currentView != null &&
          !stageProdRequestedVisualRemainsValid({
            view: currentView,
            focalSubjectId: nextFocal,
          })
        ) {
          setVisualView(emptyNexoraVisualViewRuntime());
          setVisualizationRoute(null);
        }
        const ack = acknowledgeNexoraStageEducationInteraction({
          session: entranceSessionRef.current,
          runtimeState: next,
          subjectId,
        });
        if (ack && !stageEducationAckLockRef.current) {
          stageEducationAckLockRef.current = true;
          setEntranceSession(ack.session);
          conversationalMessageSeqRef.current += 1;
          setConversationalMessages((messages) =>
            Object.freeze([
              ...messages,
              Object.freeze({
                id: `nex-ent2-${conversationalMessageSeqRef.current}-nexora`,
                role: "nexora" as const,
                text: ack.response,
                status: "applied" as const,
                suggestedActions: ack.suggestedActions,
              }),
            ]).slice(-20),
          );
        }
        const objectAck = acknowledgeNexoraObjectEducationInteraction({
          session: entranceSessionRef.current,
          runtimeState: next,
          subjectId,
        });
        if (
          objectAck &&
          objectEducationAckLockRef.current !== subjectId
        ) {
          objectEducationAckLockRef.current = subjectId;
          setEntranceSession(objectAck.session);
          conversationalMessageSeqRef.current += 1;
          setConversationalMessages((messages) =>
            Object.freeze([
              ...messages,
              Object.freeze({
                id: `nex-ent3-${conversationalMessageSeqRef.current}-nexora`,
                role: "nexora" as const,
                text: objectAck.response,
                status: "applied" as const,
                suggestedActions: objectAck.suggestedActions,
              }),
            ]).slice(-20),
          );
        }
        return next;
      });
    },
    [dataRealityExperience.catalog, syncExecutiveContextFromRuntime],
  );

  /**
   * CC:4 debug event — not the production experience path.
   * Production CC:5 uses executeNexoraConversationalExperience → applyNexoraMVPConversationalCommand.
   */
  const lastDebugCc4CommandIdRef = useRef<string | null>(null);
  const onDispatchConversationalCommand = useCallback(
    (command: NexoraConversationalCommand | null) => {
      setInteraction((previous) => {
        const applied = applyNexoraMVPConversationalCommand({
          command,
          state: previous,
          lastAppliedCommandId: lastDebugCc4CommandIdRef.current,
        });
        if (applied.result.status !== "applied") {
          return previous;
        }
        lastDebugCc4CommandIdRef.current = command?.commandId ?? null;
        setApplication((app) =>
          applyInteractionToApplication(app, applied.nextState),
        );
        return applied.nextState;
      });
    },
    [],
  );

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ command?: NexoraConversationalCommand | null }>)
        .detail;
      onDispatchConversationalCommand(detail?.command ?? null);
    };
    window.addEventListener("nexora-cc4-dispatch", handler);
    return () => window.removeEventListener("nexora-cc4-dispatch", handler);
  }, [onDispatchConversationalCommand]);

  /** CC:5 — canonical experience submission (CC:1→2→3→4). */
  const interactionRef = useRef(interaction);
  interactionRef.current = interaction;

  const applyWorkspacePresentationAction = useCallback(
    async (
      action: NexoraConversationalWorkspaceActionPayload,
      resolvedTargetId: string | null,
    ): Promise<string | null> => {
      const current = interactionRef.current;
      const currentSubjectId =
        resolvedTargetId ??
        current.focusedSubject?.id ??
        current.selectedSubject?.id ??
        null;
      const sceneLabel = action.sceneName
        ? action.sceneName.replace(/\b\w/g, (letter) => letter.toUpperCase())
        : null;

      switch (action.action) {
        case "OPEN_DETAIL": {
          if (currentSubjectId) {
            const subject = resolveNexoraMVPInteractionSubject(
              currentSubjectId,
              dataRealityExperience.catalog,
            );
            setDetailLaunchReference(
              createSceneOrgCanonicalReference({
                canonicalId: currentSubjectId,
                kind:
                  subject?.kind === "decision"
                    ? "decision"
                    : subject?.kind === "execution"
                      ? "execution"
                      : "object",
                owner: "canonical MO/Object catalog",
              }),
            );
          }
          setActiveNav("Data");
          return "Opened Detail Workspace for the current canonical context.";
        }
        case "CLOSE_DETAIL":
          setActiveNav("Home");
          return "Closed Detail Workspace.";
        case "SHOW_RIGHT_DETAILS":
          selectAdvisorTab("Insight");
          setRightPanelChrome((chrome) =>
            chrome.collapsed
              ? updateSceneOrgRightPanelChrome(chrome, {
                  kind: "TOGGLE_COLLAPSE",
                })
              : chrome,
          );
          return "Showing contextual details.";
        case "OPEN_ADVISOR":
          selectAdvisorTab("Assist");
          setRightPanelChrome((chrome) =>
            chrome.collapsed
              ? updateSceneOrgRightPanelChrome(chrome, {
                  kind: "TOGGLE_COLLAPSE",
                })
              : chrome,
          );
          return "Opened Advisor.";
        case "COLLAPSE_RIGHT":
          setRightPanelChrome((chrome) =>
            chrome.collapsed
              ? chrome
              : updateSceneOrgRightPanelChrome(chrome, {
                  kind: "TOGGLE_COLLAPSE",
                }),
          );
          return "Collapsed the right panel.";
        case "SHOW_ACTIVITY":
          setActiveNav("Journal");
          return "Showing recent recorded activity.";
        case "SAVE_SCENE": {
          if (!sceneLabel) return "Name the scene you want to save.";
          const savedSceneSubjectId = resolveSceneOrgSavedSceneCaptureId({
            focusedSubjectId: current.focusedSubject?.id ?? null,
            selectedSubjectId: current.selectedSubject?.id ?? null,
            resolvedReferentId: resolvedTargetId,
          });
          const savedSceneSubject = savedSceneSubjectId
            ? resolveNexoraMVPInteractionSubject(
                savedSceneSubjectId,
                dataRealityExperience.catalog,
              )
            : null;
          const references = savedSceneSubjectId
            ? Object.freeze([
                createSceneOrgCanonicalReference({
                  canonicalId: savedSceneSubjectId,
                  kind:
                    savedSceneSubject?.kind === "decision"
                      ? "decision"
                      : savedSceneSubject?.kind === "execution"
                        ? "execution"
                        : "object",
                  owner: "canonical MO/Object catalog",
                }),
              ])
            : Object.freeze([]);
          const sceneOwnerId = readLiveExecutiveDataWorkspaceId();
          const requestedSceneId = `scene-${action.sceneName
            ?.toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "")}`;
          const occupied = savedScenesRef.current.find(
            (candidate) => candidate.sceneId === requestedSceneId,
          );
          const sceneId =
            occupied && occupied.managerWorkspaceId !== sceneOwnerId
              ? `${requestedSceneId}-${sceneOwnerId}`
              : requestedSceneId;
          const scene = createSceneOrgSavedScene({
            sceneId,
            name: sceneLabel,
            kind: "SAVED",
            sceneIntentType: "manager-view",
            managerWorkspaceId: sceneOwnerId,
            canonicalReferences: references,
            layout: {
              presentationDepth: current.presentationState,
              leftRegion: "management",
              rightRegion: rightPanelChrome.collapsed
                ? "collapsed"
                : "contextual",
              detailWorkspace: activeNav === "Data" ? "open" : "closed",
            },
          });
          const nextScenes = Object.freeze([
            ...savedScenesRef.current.filter(
              (candidate) => candidate.sceneId !== sceneId,
            ),
            scene,
          ]);
          if (!(deploymentMode === "hosted" && isCustomerHostedWorkspaceId(sceneOwnerId))) {
            const persistence = persistSceneOrgSavedScenes(nextScenes);
            if (!persistence.persisted) {
              return `I couldn't durably save ${sceneLabel}; the previous Saved Scenes are unchanged.`;
            }
            savedScenesRef.current = nextScenes;
            setSavedScenes(nextScenes);
            setActiveSavedSceneId(sceneId);
            return `Saved ${sceneLabel} as view and canonical reference metadata.`;
          }
          try {
            await saveHostedOperations(sceneOwnerId, {
              scenes: nextScenes.filter((candidate) => candidate.managerWorkspaceId === sceneOwnerId),
            });
          } catch {
            return `I couldn't durably save ${sceneLabel}; the previous Saved Scenes are unchanged.`;
          }
          savedScenesRef.current = nextScenes;
          setSavedScenes(nextScenes);
          setActiveSavedSceneId(sceneId);
          setHostedOperationalPhase("ready");
          return `Saved ${sceneLabel} as view and canonical reference metadata.`;
        }
        case "SHOW_SAVED_SCENES": {
          const names = listSceneOrgSavedScenesForManagerWorkspace(
            savedScenesRef.current,
            readLiveExecutiveDataWorkspaceId(),
          ).map((scene) => scene.name);
          if (names.length === 0) return "You don't have any saved scenes yet.";
          return `Saved scenes: ${names.join(", ")}.`;
        }
        case "OPEN_SCENE": {
          const sceneOwnerId = readLiveExecutiveDataWorkspaceId();
          const ownedScenes = listSceneOrgSavedScenesForManagerWorkspace(
            savedScenesRef.current,
            sceneOwnerId,
          );
          const access = resolveSceneOrgSavedSceneAccess(ownedScenes, {
            sceneId: action.sceneId,
            phrase: action.sceneName,
            hydrationStatus: savedSceneHydration.status,
          });
          setSavedSceneAccessResolution(access);
          if (access.status === "pending") {
            return "Saved scenes are still loading.";
          }
          if (access.status === "ambiguous") {
            return `Which saved scene did you mean: ${access.candidates
              .map((candidate) => candidate.name)
              .join(" or ")}?`;
          }
          const scene = access.scene;
          if (!scene) {
            const assessment = assessSceneOrgSavedSceneOpen(
              savedScenesRef.current,
              action.sceneId,
              sceneOwnerId,
            );
            if (assessment.status === "mismatch") {
              return `${assessment.scene?.name ?? "That saved scene"} belongs to another Manager Workspace.`;
            }
            if (assessment.status === "unassigned") {
              return `${assessment.scene?.name ?? "That saved scene"} has no Manager Workspace owner.`;
            }
            return `I couldn't find ${sceneLabel ?? "that saved scene"}.`;
          }
          const resolved = resolveSceneOrgSavedScene(scene, (reference) =>
            resolveNexoraMVPInteractionSubject(
              reference.canonicalId,
              dataRealityExperience.catalog,
            ),
          );
          const liveSubject = resolved.live.find(
            (entry) => entry.content != null,
          )?.content;
          setInteraction((previous) => {
            const selected = liveSubject
              ? selectNexoraMVPInteractionSubject(
                  previous,
                  liveSubject.id,
                  dataRealityExperience.catalog,
                )
              : resetNexoraMVPObjectInteractionOverview(previous);
            const next = applyNexoraMVPPresentationStateChange(
              selected,
              liveSubject
                ? scene.layout.presentationDepth
                : NEXORA_MVP_DEFAULT_PRESENTATION_STATE,
            );
            setApplication((app) => applyInteractionToApplication(app, next));
            syncExecutiveContextFromRuntime(next, "runtime");
            setManagerObjectSession((session) =>
              activateManagerObjectFromClick(
                session,
                next.focusedSubject?.id ?? null,
              ),
            );
            setSavedSceneRestoration(
              Object.freeze({
                sceneId: scene.sceneId,
                status: resolved.status,
                requestedCanonicalId:
                  scene.canonicalReferences[0]?.canonicalId ?? null,
                restoredCanonicalId: resolved.restoredCanonicalId,
                requestedPresentationDepth: scene.layout.presentationDepth,
                resolvedPresentationDepth: next.presentationState,
                truthSource: "current-canonical-authorities" as const,
              }),
            );
            return next;
          });
          setRightPanelChrome((chrome) =>
            Object.freeze({
              ...chrome,
              collapsed: scene.layout.rightRegion === "collapsed",
            }),
          );
          setActiveNav(
            scene.layout.detailWorkspace === "open" ? "Data" : "Home",
          );
          setActiveSavedSceneId(scene.sceneId);
          return resolved.status === "canonical-subject-missing"
            ? `Opened ${scene.name} in Overview because its saved subject is no longer available.`
            : `Opened ${scene.name} using current live canonical content.`;
        }
        case "MAKE_DEFAULT_SCENE": {
          const sceneOwnerId = readLiveExecutiveDataWorkspaceId();
          const activeScene = savedScenesRef.current.find(
            (scene) => scene.sceneId === activeSavedSceneId,
          );
          if (!activeScene || activeScene.managerWorkspaceId !== sceneOwnerId) {
            return "Save or open a scene before making it the default.";
          }
          const nextScenes = Object.freeze(
            savedScenesRef.current.map((scene) =>
              scene.managerWorkspaceId !== sceneOwnerId
                ? scene
                : createSceneOrgSavedScene({
                    ...scene,
                    kind:
                      scene.sceneId === activeSavedSceneId
                        ? "DEFAULT_MANAGER"
                        : "SAVED",
                  }),
            ),
          );
          if (deploymentMode === "hosted" && isCustomerHostedWorkspaceId(sceneOwnerId)) {
            try {
              await saveHostedOperations(sceneOwnerId, {
                scenes: nextScenes.filter((scene) => scene.managerWorkspaceId === sceneOwnerId),
              });
            } catch {
              return "I couldn't durably change the default Scene; the previous Saved Scenes are unchanged.";
            }
            savedScenesRef.current = nextScenes;
            setSavedScenes(nextScenes);
            setHostedOperationalPhase("ready");
            return "Made the current saved scene the default view.";
          }
          const persistence = persistSceneOrgSavedScenes(nextScenes);
          if (!persistence.persisted) {
            return "I couldn't durably change the default Scene; the previous Saved Scenes are unchanged.";
          }
          savedScenesRef.current = nextScenes;
          setSavedScenes(nextScenes);
          return "Made the current saved scene the default view.";
        }
      }
    },
    [
      activeNav,
      activeSavedSceneId,
      dataRealityExperience.catalog,
      rightPanelChrome.collapsed,
      deploymentMode,
      savedSceneHydration.status,
      selectAdvisorTab,
      syncExecutiveContextFromRuntime,
    ],
  );

  const onSubmitConversationalUtterance = useCallback(
    async (utterance: string) => {
      const trimmed = utterance.trim();
      if (!trimmed || conversationalProcessingRef.current) return;
      conversationalProcessingRef.current = true;
      setConversationalProcessing(true);
      conversationalMessageSeqRef.current += 1;
      const seed = `cc5-${conversationalMessageSeqRef.current}`;
      const managerMessage: NexoraConversationalMessage = Object.freeze({
        id: `${seed}-manager`,
        role: "manager",
        text: trimmed,
      });
      setConversationalMessages((messages) =>
        Object.freeze([...messages, managerMessage]).slice(-20),
      );
      try {
        const semanticReply = resolveNcaCsvSemanticReply(managerObjectSessionRef.current, trimmed);
        const dataKind = classifyAdvisorDataConversation(trimmed);
        const contentOwnsPendingEscape = [
          "field-coverage",
          "field-values",
          "analytical-capability",
          "evidence-relevance",
          "bounded-interpretation",
          "inventory",
          "csv-availability",
          "explain-all-csv",
          "object-provenance",
          "specific-source",
        ].includes(dataKind ?? "");
        if (semanticReply && csvSemanticResolverRef.current && !contentOwnsPendingEscape) {
          const semanticResult = csvSemanticResolverRef.current(trimmed);
          csvSemanticResolverRef.current = null;
          setManagerObjectSession(semanticReply.nextSession);
          managerObjectSessionRef.current = semanticReply.nextSession;
          setConversationalMessages((messages) => Object.freeze([...messages, Object.freeze({
            id: `${seed}-nexora`,
            role: "nexora" as const,
            text: semanticResult.acknowledgement,
            status: semanticResult.resolved ? "applied" as const : "no-op" as const,
          })]).slice(-20));
          lastManagerUtteranceRef.current = trimmed;
          return;
        }
        if (semanticReply && !csvSemanticResolverRef.current && !contentOwnsPendingEscape) {
          const closed = endNcaCsvSemanticClarification(managerObjectSessionRef.current);
          setManagerObjectSession(closed);
          managerObjectSessionRef.current = closed;
          setConversationalMessages((messages) => Object.freeze([...messages, Object.freeze({
            id: `${seed}-nexora`,
            role: "nexora" as const,
            text: "That clarification is no longer open.",
            status: "no-op" as const,
          })]).slice(-20));
          lastManagerUtteranceRef.current = trimmed;
          return;
        }
        const selectedDataObject = selectedDataObjectId
          ? csvDataObjects.find((entry) => entry.id === selectedDataObjectId) ?? null
          : null;
        const selectedDataSource = selectedDataObject
          ? committedCsvImports.find((entry) => entry.sourceContextId === selectedDataObject.sourceId) ?? null
          : null;
        if (selectedDataObject && selectedDataSource) {
          const removalAnswer = answerCsvSourceRemovalInquiry({
            impact: analyzeCsvSourceRemovalImpact({
              source: selectedDataSource,
              peers: committedCsvImports,
              activeSourceContextId: activeCsvImport?.sourceContextId ?? null,
            }),
            utterance: trimmed,
          });
          if (removalAnswer) {
            if (removalAnswer.intent === "request-review") {
              setCsvRemovalReviewSourceId(selectedDataSource.sourceContextId);
              setActiveNav("Data");
            }
            if (removalAnswer.intent === "cancel-review") {
              setCsvRemovalReviewSourceId(null);
            }
            setConversationalMessages((messages) => Object.freeze([...messages, Object.freeze({
              id: `${seed}-nexora`,
              role: "nexora" as const,
              text: removalAnswer.text,
              status: "no-op" as const,
            })]).slice(-20));
            lastManagerUtteranceRef.current = trimmed;
            return;
          }
          const dataObjectAnswer = answerNexoraDecisionTheatreDataObjectInquiry({
            dataObject: selectedDataObject,
            review: selectedDataSource.prepared.mapping,
            utterance: trimmed,
          });
          const libraryOwns = [
            "inventory",
            "csv-availability",
            "source-inventory",
            "concept-data",
            "concept-data-source",
            "explain-all-csv",
            "pending-inventory",
            "capability-csv",
            "existing-data-bridge",
            "field-coverage",
            "field-values",
            "analytical-capability",
            "evidence-relevance",
            "bounded-interpretation",
            "specific-source",
          ].includes(classifyAdvisorDataConversation(trimmed) ?? "");
          if (dataObjectAnswer && !libraryOwns) {
            setConversationalMessages((messages) => Object.freeze([...messages, Object.freeze({
              id: `${seed}-nexora`,
              role: "nexora" as const,
              text: dataObjectAnswer,
              status: "no-op" as const,
            })]).slice(-20));
            lastManagerUtteranceRef.current = trimmed;
            return;
          }
        }
        // DATA-ADV and CSV field Q&A are owned by CC:5 (same as isolated).
        // A live-only early return skipped NCA / continuity / executive writes
        // and let an older Scenario referent outrank a newer explicit Problem.
        // LLM-MVP:2 keeps this deterministic CSV semantic return. It does not
        // open a second LLM participant or context authority. Grounding stays on CC:5.
        if (activeCsvImport) {
          const libraryClass = classifyAdvisorDataConversation(trimmed);
          const deicticFollowUp =
            /\b(?:it|that|this)\b/i.test(trimmed) &&
            !/\b(?:csv|file|source|data|field|column)\b/i.test(trimmed);
          if (!libraryClass && !deicticFollowUp) {
            const semanticAnswer = answerCsvSemanticInquiry({
              review: activeCsvImport.prepared.mapping,
              fileName: activeCsvImport.prepared.fileName,
              utterance: trimmed,
              priorFieldId: csvSemanticConversationFieldRef.current,
            });
            if (semanticAnswer) {
              csvSemanticConversationFieldRef.current = semanticAnswer.fieldId;
              setConversationalMessages((messages) => Object.freeze([...messages, Object.freeze({
                id: `${seed}-nexora`,
                role: "nexora" as const,
                text: semanticAnswer.text,
                status: "no-op" as const,
              })]).slice(-20));
              lastManagerUtteranceRef.current = trimmed;
              return;
            }
          }
        }
        // Let the restrained sending state paint before deterministic CC work.
        await new Promise<void>((resolve) => setTimeout(resolve, 80));
        const previous = interactionRef.current;
        const subjects = projectManagerObjectConversationalSubjects(
          dataRealityExperience.catalog,
        );
        const turnNow = new Date().toISOString();
        const historicalSnapshot =
          dataRealityExperience.runtimeState.sourceReality.certifiedAdvisorResult.dataRealitySnapshot;
        const historicalObservations = collectLiveHistoricalObservations({
          snapshotKpis: historicalSnapshot.kpis,
          datasetId: historicalSnapshot.datasetId,
          managerWorkspaceId: dataWorkspaceIdRef.current,
        });

        const result = executeNexoraConversationalExperience({
          utterance: trimmed,
          executiveContext: executiveContextRef.current,
          conversationContext: toNexoraConversationContextSnapshot(
            executiveContextRef.current,
          ),
          activeStageContext: Object.freeze({
            focusedSubjectId: previous.focusedSubject?.id ?? null,
            selectedSubjectId: previous.selectedSubject?.id ?? null,
          }),
          allowActiveStageContext: false,
          executiveSubjects: subjects,
          runtimeState: previous,
          catalog: dataRealityExperience.catalog,
          lastAppliedCommandId: lastConversationalCommandIdRef.current,
          messageIdSeed: seed,
          scenarioSession,
          decisionSession,
          decisionRuntime: decisionRuntime.adapter,
          executionRuntime,
          decisionCommittedAt: turnNow,
          historicalAnchorIso: turnNow,
          historicalRead: ({ subjectId, subjectLabel, range }) => {
            const decisions = decisionRuntime.adapter.listDecisions();
            const executions = executionRuntime.listExecutions();
            const managerWorkspaceId = dataWorkspaceIdRef.current;
            return readCanonicalHistoricalPresentation({
              subjectId,
              subjectLabel,
              decisions: selectTimelineRecordsForManagerWorkspace(decisions, managerWorkspaceId),
              executions: selectTimelineRecordsForManagerWorkspace(executions, managerWorkspaceId),
              observations: historicalObservations,
              outcomeCaptures: selectTimelineCapturesForManagerWorkspace(
                listCapturedObservations(),
                decisions,
                executions,
                managerWorkspaceId,
              ),
              learnings: selectTimelineRecordsForManagerWorkspace(
                listSupportedGroundedLearningForSubject({
                  workspaceId: managerWorkspaceId,
                  subjectId,
                }),
                managerWorkspaceId,
              ),
              range,
            });
          },
          advisorGrounding: conversationalAdvisorGroundingRef.current,
          savedScenes: savedScenesRef.current,
          savedSceneHydrationStatus: savedSceneHydration.status,
          pendingTurnExpectation:
            executiveContextRef.current.pendingTurnExpectation,
          previousUtterance: lastManagerUtteranceRef.current,
          previousManagerObjectSession: managerObjectSessionRef.current,
          previousEntranceSession: entranceSession,
          previousGuidedAttention: guidedAttentionRef.current,
          previousVisualView: visualViewRef.current,
          mountedGuidedAttentionTargets: Object.freeze([
            "DATA_ENTRY",
            "STAGE",
            ...(canStepBackRef.current ? (["BACK_CONTROL"] as const) : []),
          ]) as readonly NexoraGuidedAttentionTarget[],
          attentionNowMs: Date.now(),
          reducedMotion:
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches,
          theatreDecisionReviewOpen: decisionReviewOpen,
          theatreProposedCandidateId: proposedCandidateId,
          nmiAdvisorBundle: nmiLiveRef.current.advisorBundle,
        });
        const presented = await completeNexoraLlmManagerPresentation(result, {
          deploymentMode,
          principal: session.authenticated && session.userId ? { userId: session.userId } : null,
          workspaceId: deploymentMode === "hosted" ? readHostedLlmWorkspaceId() : null,
        });

        const workspaceCommand = result.commandResult?.command;
        const workspaceResponse =
          result.runtimeResult?.status === "applied" &&
          workspaceCommand?.kind === "workspace-presentation" &&
          workspaceCommand.workspaceAction
            ? await applyWorkspacePresentationAction(
                workspaceCommand.workspaceAction,
                workspaceCommand.primaryTargetId,
              )
            : null;

        lastManagerUtteranceRef.current = trimmed;
        setConversationalMessages((msgs) =>
          Object.freeze([
            ...msgs,
            workspaceResponse
              ? Object.freeze({
                  ...presented.nexoraMessage,
                  text: workspaceResponse,
                  status: "applied" as const,
                })
              // LLM-MVP:FINAL: nexoraMessage.text is governed M via CC and/or server completion.
              : presented.nexoraMessage,
          ]).slice(-20),
        );
        setExecutiveContext(result.nextExecutiveContext);
        if (result.nextEntranceSession) {
          setEntranceSession(result.nextEntranceSession);
          writeStoredEntranceIdentity(result.nextEntranceSession.identity);
        }
        if (result.guidedAttention) {
          setGuidedAttention(result.guidedAttention);
        }
        const previousVisualView = visualViewRef.current;
        if (result.visualView) {
          setVisualView(result.visualView);
        }
        setVisualizationRoute(result.visualizationRoute ?? null);
        const acceptedVisualPresentation = nexoraMVPAcceptedVisualPresentationChanged(
          previousVisualView,
          result.visualView,
        );
        const completeOperationIfVisual = (
          state: typeof previous,
        ) => completeNexoraMVPOperationPresentation(state, acceptedVisualPresentation);
        if (result.nextScenarioSession) {
          setScenarioSession(result.nextScenarioSession);
        }
        if (result.nextDecisionSession) {
          setDecisionSession(result.nextDecisionSession);
        }
        // CC:10R.1 — Stage/flowDomain Decision projection from canonical Runtime.
        // Status changes do not steal Stage focus (interaction only updates when shouldCommitRuntime).
        setFlowDomain((current) => {
          const projected = projectNexoraMVPFlowExecutionsFromCanonicalRuntime(
            projectNexoraMVPFlowDecisionsFromCanonicalRuntime(
              permitProductFixtures ? current : createEmptyNexoraMVPFlowDomainState(),
              decisionRuntime.adapter,
            ),
            executionRuntime,
          );
          return permitProductFixtures
            ? projected
            : containNexoraMVPFlowDomainForManagerWorkspace(projected, {
                workspaceId: dataWorkspaceId,
                decisions: decisionRuntime.adapter.listDecisions(),
                executions: executionRuntime.listExecutions(),
              });
        });
        setDecisionRevision((value) => value + 1);
        setExecutionRevision((value) => value + 1);
        setConversationalLastTrace(result.trace);
        setEcaActionPlan(result.ecaActionPlan ?? null);
        setEcaInitiativeJudgment(result.ecaInitiativeJudgment ?? null);
        setEcaInformationNeedJudgment(result.ecaInformationNeedJudgment ?? null);
        setEcaAnswerIntakeJudgment(result.ecaAnswerIntakeJudgment ?? null);
        setEcaDialogueStrategy(result.ecaDialogueStrategy ?? null);
        setEcaRecommendationJudgment(result.ecaRecommendationJudgment ?? null);
        setEcaCommitmentJudgment(result.ecaCommitmentJudgment ?? null);
        setEcaExecutionReadinessJudgment(result.ecaExecutionReadinessJudgment ?? null);
        setEcaLiveExecutionJudgment(result.ecaLiveExecutionJudgment ?? null);
        setEcaOutcomeJudgment(result.ecaOutcomeJudgment ?? null);
        const dataInquiryAfter = answerAdvisorDataInquiry({
          workspaceId: dataWorkspaceIdRef.current,
          utterance: trimmed,
          dialogue: result.managerObjectTurn.session.advisorDataDialogue ?? advisorDataDialogueRef.current,
          focusedObjectLabel: previous.focusedSubject?.label ?? null,
          conversationContinuity: result.managerObjectTurn.session.conversationContinuity ?? null,
        });
        setDataAdvDiagnostics(dataInquiryAfter?.diagnostics ?? null);
        if (result.managerObjectTurn.session.advisorDataDialogue) {
          advisorDataDialogueRef.current = result.managerObjectTurn.session.advisorDataDialogue;
        }
        setEcaLearningClosureJudgment(result.ecaLearningClosureJudgment ?? null);
        ecaWorkingContextRef.current = result.ecaWorkingContext ?? null;
        setManagerObjectSession(result.managerObjectTurn.session);
        if (dataInquiryAfter?.clarification) {
          const need = dataInquiryAfter.clarification;
          csvSemanticResolverRef.current = (nextUtterance) => applyAdvisorDataSemanticClarification(
            dataWorkspaceIdRef.current,
            need.sourceContextId,
            need.fieldId,
            nextUtterance,
          );
          if (result.managerObjectTurn.session.ncaConversationState?.pendingQuestion?.purpose !== "csv-semantic-clarification") {
            const nextSession = beginNcaCsvSemanticClarification(
              result.managerObjectTurn.session,
              need,
            );
            setManagerObjectSession(nextSession);
            managerObjectSessionRef.current = nextSession;
          }
        }
        if (
          result.ncaPost4Comparison &&
          result.ncaPost4Comparison.candidateSet.candidateIds.length >= 2
        ) {
          setComparisonAuthority(
            Object.freeze({
              preferredCandidateId: result.ncaPost4Comparison.preferredCandidateId,
              statement: result.ncaPost4Comparison.response,
              source: "NCA-POST:4",
              evidenceState: result.ncaPost4Comparison.evidenceState,
            }),
          );
        } else if (!result.managerObjectTurn.session.ncaConversationState?.activeComparison) {
          setComparisonAuthority(null);
          setComparisonLevel("choice");
        }

        const activeComparison =
          result.managerObjectTurn.session.ncaConversationState
            ?.activeComparison;
        const comparisonRequiresStageReferentRelease =
          activeComparison != null &&
          activeComparison.candidateIds.length >= 2;

        if (comparisonRequiresStageReferentRelease) {
          const comparisonState = completeOperationIfVisual(
            resetNexoraMVPObjectInteractionOverview(result.nextRuntimeState),
          );
          setInteraction(comparisonState);
          setApplication((app) =>
            applyInteractionToApplication(app, comparisonState),
          );
        } else if (result.shouldCommitRuntime && workspaceResponse == null) {
          lastConversationalCommandIdRef.current =
            result.commandResult?.command?.commandId ??
            lastConversationalCommandIdRef.current;
          const education = stageEducationOf(result.nextEntranceSession);
          const reducedMotion =
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          if (
            education.focusDemonstrated &&
            education.state === "AWAITING_FOCUS" &&
            !reducedMotion
          ) {
            const overview = completeOperationIfVisual(
              Object.freeze({
                ...result.nextRuntimeState,
                mode: "overview" as const,
                focusedSubject: null,
                selectedSubject: null,
              }),
            );
            setInteraction(overview);
            setApplication((app) => applyInteractionToApplication(app, overview));
            requestAnimationFrame(() => {
              const next = completeOperationIfVisual(result.nextRuntimeState);
              setInteraction(next);
              setApplication((app) => applyInteractionToApplication(app, next));
            });
          } else {
            const next = completeOperationIfVisual(result.nextRuntimeState);
            setInteraction(next);
            setApplication((app) => applyInteractionToApplication(app, next));
          }
        } else if (acceptedVisualPresentation) {
          setInteraction((current) => {
            const next = completeNexoraMVPOperationPresentation(current, true);
            setApplication((app) => applyInteractionToApplication(app, next));
            return next;
          });
        }
      } catch {
        const failedMessage: NexoraConversationalMessage = Object.freeze({
          id: `${seed}-nexora`,
          role: "nexora",
          text: "Nexora couldn’t complete that request. Please try again.",
          status: "failed",
        });
        setConversationalMessages((messages) =>
          Object.freeze([...messages, failedMessage]).slice(-20),
        );
      } finally {
        conversationalProcessingRef.current = false;
        setConversationalProcessing(false);
      }
    },
    [
      dataRealityExperience.catalog,
      scenarioSession,
      decisionSession,
      decisionRuntime,
      executionRuntime,
      entranceSession,
      decisionReviewOpen,
      proposedCandidateId,
      activeCsvImport,
      committedCsvImports,
      csvDataObjects,
      selectedDataObjectId,
      applyWorkspacePresentationAction,
      dataWorkspaceId,
      permitProductFixtures,
    ],
  );

  const onSelectQueueCategory = useCallback(
    (category: ExecutiveQueueCategory | "changes-since-visit") => {
      setInteraction((previous) => {
        const next =
          category === EXECUTIVE_CHANGE_PRODUCTIVITY_CATEGORY
            ? openNexoraMVPExecutiveChangeCollection(previous)
            : openNexoraMVPExecutiveQueueCollection(previous, category);
        setApplication((app) => applyInteractionToApplication(app, next));
        return next;
      });
    },
    [],
  );

  const onBeginDailyPreparation = useCallback(() => {
    setInteraction((previous) => {
      const next = beginNexoraMVPDailyPreparation(previous);
      setApplication((app) => applyInteractionToApplication(app, next));
      return next;
    });
  }, []);

  const onBeginMeetingPreparation = useCallback(() => {
    setInteraction((previous) => {
      const next = beginNexoraMVPMeetingPreparation(previous, {
        kind: "topic",
        label: "Operations",
        keywords: Object.freeze(["capacity", "delivery", "operations", "inventory"]),
        semanticObjectIds: Object.freeze(["obj-capacity", "obj-delivery"]),
      });
      setApplication((app) => applyInteractionToApplication(app, next));
      return next;
    });
  }, []);

  const onExecuteNextBestAction = useCallback(
    (actionId: string) => {
      setInteraction((previous) => {
        const presentation = deriveNexoraMVPStageInteractionPresentation(previous);
        const nba = presentation.nextBestAction;
        const action =
          nba?.recommendedAction?.id === actionId
            ? nba.recommendedAction
            : nba?.alternativeActions.find((entry) => entry.id === actionId);
        if (action == null) return previous;
        const intent = executeNexoraMVPNextBestAction(action);
        let next = previous;
        if (intent.type === "select-subject") {
          next = selectNexoraMVPInteractionSubject(previous, intent.subjectId);
        } else if (intent.type === "open-collection") {
          next =
            intent.category === EXECUTIVE_CHANGE_PRODUCTIVITY_CATEGORY
              ? openNexoraMVPExecutiveChangeCollection(previous)
              : openNexoraMVPExecutiveQueueCollection(
                  previous,
                  intent.category,
                );
        } else if (intent.type === "acknowledge-changes") {
          next = acknowledgeNexoraMVPExecutiveChanges(previous);
        } else {
          // unavailable — recompute by returning previous (NBA refreshes on next derive)
          return previous;
        }
        setApplication((app) => applyInteractionToApplication(app, next));
        return next;
      });
    },
    [],
  );

  const onSelectBriefOption = useCallback((objectId: string) => {
    setInteraction((previous) => {
      const next = selectNexoraMVPInteractionSubject(previous, objectId);
      setApplication((app) => applyInteractionToApplication(app, next));
      return next;
    });
  }, []);

  const onPresentationStateChange = useCallback(
    (presentationState: NexoraMVPPresentationState) => {
      setInteraction((current) => {
        const next = applyNexoraMVPPresentationStateChange(
          current,
          presentationState,
        );
        const subjects =
          mapNexoraMVPInteractionStateToApplicationSubjects(next);
        setApplication((previous) =>
          Object.freeze({
            ...previous,
            presentationState: next.presentationState,
            workspace: next.workspace,
            environmentIntent: next.environmentIntent,
            selectedSubject: subjects.selectedSubject,
            focusedSubject: subjects.focusedSubject,
            activeSurface: "stage" as const,
          }),
        );
        return next;
      });
    },
    [],
  );

  const applyFlowAction = useCallback(
    (action: NexoraMVPPresentationAvailableAction) => {
      const focusedId =
        interaction.focusedSubject?.id ??
        interaction.selectedSubject?.id ??
        null;
      const request = classifyNexoraMVPFlowDomainAction(action, focusedId);
      if (request == null) return false;

      if (
        flowDomain.pendingActionId != null &&
        flowDomain.pendingActionId !== action.id
      ) {
        setFlowDomain(
          failNexoraMVPFlowPendingAction(
            flowDomain,
            "Another executive action is already pending.",
          ),
        );
        return false;
      }
      const pending = beginNexoraMVPFlowPendingAction(flowDomain, action.id);
      const result = applyNexoraMVPFlowDomainAction(pending, request, {
        decisionRuntime: decisionRuntime.adapter,
        executionRuntime,
        occurredAt: new Date().toISOString(),
        managerWorkspaceId: readLiveExecutiveDataWorkspaceId(),
      });
      if (!result.ok) {
        setFlowDomain(
          failNexoraMVPFlowPendingAction(result.state, result.message),
        );
        return false;
      }
      const managerId = readLiveExecutiveDataWorkspaceId();
      setFlowDomain(
        isRealManagerWorkspaceId(managerId)
          ? containNexoraMVPFlowDomainForManagerWorkspace(result.state, {
              workspaceId: managerId,
              decisions: decisionRuntime.adapter.listDecisions(),
              executions: executionRuntime.listExecutions(),
            })
          : result.state,
      );
      return true;
    },
    [
      interaction.focusedSubject?.id,
      interaction.selectedSubject?.id,
      decisionRuntime,
      executionRuntime,
      flowDomain,
    ],
  );

  const onPresentationAction = useCallback(
    (action: NexoraMVPPresentationAvailableAction) => {
      if (!action.available) return;
      let accepted = false;
      if (action.kind === "select-subject" && action.targetSubjectId) {
        onSelectSubject(action.targetSubjectId);
        return;
      }
      if (action.kind === "open-panel" && action.panelKind) {
        const panelMap = {
          decision: "decision-wizard",
          scenario: "scenario-wizard",
          object: "properties",
          data: "data-wizard",
        } as const;
        setFloatingKind(panelMap[action.panelKind]);
        accepted = true;
      }
      if (action.kind === "acknowledge") {
        selectAdvisorTab("Assist");
        accepted = true;
      }
      if (action.kind === "review") {
        accepted = applyFlowAction(action);
      }
      if (accepted) onPresentationStateChange("minimum");
    },
    [applyFlowAction, onPresentationStateChange, onSelectSubject],
  );

  const onIntelligenceAction = useCallback(
    (action: NexoraMVPIntelligenceAction) => {
      if (!action.available) return;
      if (action.kind === "select-subject" && action.targetSubjectId) {
        onSelectSubject(action.targetSubjectId);
        return;
      }
      if (action.kind === "change-workspace" && action.workspace) {
        onWorkspaceChange(action.workspace);
        return;
      }
      if (action.kind === "change-presentation" && action.presentationState) {
        onPresentationStateChange(action.presentationState);
        return;
      }
      if (action.kind === "open-panel" && action.panelKind) {
        const panelMap = {
          decision: "decision-wizard",
          scenario: "scenario-wizard",
          object: "properties",
          data: "data-wizard",
        } as const;
        setFloatingKind(panelMap[action.panelKind]);
      }
    },
    [onPresentationStateChange, onSelectSubject, onWorkspaceChange],
  );

  const onNavSelect = useCallback(
    (nav: ExecutiveNavId) => {
      if (nav === "Data") {
        setDetailLaunchReference(null);
      }
      setActiveNav(nav);
      if (nav === "Home") {
        onOverview();
      }
    },
    [onOverview],
  );

  const onOpenInvestigationInRight = useCallback(
    (input: { readonly canonicalId: string; readonly label: string }) => {
      setPackageTabSession((session) =>
        openSceneOrgRightPackageTab(session, {
          package: "investigation",
          canonicalId: input.canonicalId,
          label: input.label,
        }),
      );
      setRightPanelChrome((chrome) =>
        chrome.collapsed
          ? updateSceneOrgRightPanelChrome(chrome, { kind: "TOGGLE_COLLAPSE" })
          : chrome,
      );
    },
    [],
  );

  const onExplorerClose = useCallback(() => {
    setActiveNav("Home");
  }, []);

  const onCsvImportCommitted = useCallback((committed: CsvCommittedImport) => {
    setActiveCsvImport(committed);
    setActiveLiveObservation(null);
    setSourceAdvisorContext(null);
    selectAdvisorTab("Assist");
  }, []);

  const onLiveObservationActivated = useCallback((observation: NexoraLiveCommittedObservation) => {
    setActiveLiveObservation(observation);
    setActiveCsvImport(null);
    setSourceAdvisorContext(null);
    selectAdvisorTab("Assist");
  }, []);

  const onViewSourceOnStage = useCallback((stageObjectId: string) => {
    onSelectSubject(stageObjectId);
    setActiveNav("Home");
  }, [onSelectSubject]);

  const onShowDataObjectOnStage = useCallback((dataObjectId: string) => {
    setStagedDataObjectIds((current) =>
      current.includes(dataObjectId)
        ? current
        : Object.freeze([...current, dataObjectId]),
    );
    setSelectedDataObjectId(dataObjectId);
    setActiveNav("Home");
  }, []);

  const onSelectStageDataObject = useCallback((dataObjectId: string) => {
    setSelectedDataObjectId(dataObjectId);
  }, []);

  const onRemoveDataObjectFromStage = useCallback((dataObjectId: string) => {
    setStagedDataObjectIds((current) => Object.freeze(current.filter((id) => id !== dataObjectId)));
    setSelectedDataObjectId((current) => current === dataObjectId ? null : current);
  }, []);

  const onCsvSourceRemoved = useCallback((sourceContextId: string) => {
    const dataObjectId = deriveNexoraDecisionTheatreDataObjectId(dataWorkspaceId, sourceContextId);
    setStagedDataObjectIds((current) => Object.freeze(current.filter((id) => id !== dataObjectId)));
    setSelectedDataObjectId((current) => current === dataObjectId ? null : current);
    setActiveCsvImport((current) => current?.sourceContextId === sourceContextId ? null : current);
    setCsvRemovalReviewSourceId((current) => current === sourceContextId ? null : current);
    setDataRailSelectedSourceId((current) => current === sourceContextId ? null : current);
    if (managerObjectSessionRef.current.ncaConversationState?.activeTopic?.id === csvSemanticClarificationTopicId(sourceContextId)) {
      csvSemanticResolverRef.current = null;
    }
    const nextSession = endNcaCsvSemanticClarification(managerObjectSessionRef.current, sourceContextId);
    managerObjectSessionRef.current = nextSession;
    setManagerObjectSession(nextSession);
  }, [dataWorkspaceId]);

  const onSourceAdvisorContext = useCallback((context: ExecutiveSourceAdvisorContext) => {
    setSourceAdvisorContext(context);
    selectAdvisorTab("Assist");
    setActiveNav("Home");
    const focusId = context.affectedStageObjectIds[0];
    if (focusId) onSelectSubject(focusId);
  }, [onSelectSubject]);

  const onCsvSemanticClarificationRequest = useCallback((
    need: CsvSemanticClarification,
    resolve: (utterance: string) => CsvSemanticClarificationResult,
  ) => {
    csvSemanticResolverRef.current = resolve;
    const nextSession = beginNcaCsvSemanticClarification(managerObjectSessionRef.current, need);
    managerObjectSessionRef.current = nextSession;
    setManagerObjectSession(nextSession);
    setConversationalMessages((messages) => {
      const last = messages[messages.length - 1];
      if (last?.role === "nexora" && last.text === need.question && last.status === "confirmation-required") {
        return messages;
      }
      conversationalMessageSeqRef.current += 1;
      return Object.freeze([...messages, Object.freeze({
        id: `data-ux3-${conversationalMessageSeqRef.current}-nexora`,
        role: "nexora" as const,
        text: need.question,
        status: "confirmation-required" as const,
      })]).slice(-20);
    });
    selectAdvisorTab("Assist");
  }, []);

  const onCsvSemanticClarificationCancel = useCallback((sourceContextId: string) => {
    if (managerObjectSessionRef.current.ncaConversationState?.activeTopic?.id === csvSemanticClarificationTopicId(sourceContextId)) {
      csvSemanticResolverRef.current = null;
    }
    const nextSession = endNcaCsvSemanticClarification(managerObjectSessionRef.current, sourceContextId);
    managerObjectSessionRef.current = nextSession;
    setManagerObjectSession(nextSession);
  }, []);

  const onProactiveInvestigate = useCallback((brief: NexoraProactiveAdvisorBrief) => {
    setSourceAdvisorContext(brief.advisorContext);
    selectAdvisorTab("Assist");
  }, []);

  const onFloatingClose = useCallback(() => {
    setFloatingKind(null);
  }, []);

  const onSelectTimelinePack = useCallback(
    (packId: string) => {
      setSelectedPackId(packId);
      const item = managerHistory.timeline.find((entry) => entry.projectionKey === packId);
      const subjectId = item ? historicalPresentationNavigationSubject(item) : null;
      if (subjectId) onSelectSubject(subjectId);
    },
    [managerHistory.timeline, onSelectSubject],
  );

  const onSelectJournalEntry = useCallback(
    (entryId: string, subjectId: string) => {
      setSelectedJournalId(entryId);
      const item = managerHistory.activity.find((entry) => entry.projectionKey === entryId);
      const canonicalSubjectId = item
        ? historicalPresentationNavigationSubject(item)
        : subjectId.startsWith("obj-")
          ? subjectId
          : null;
      if (canonicalSubjectId) onSelectSubject(canonicalSubjectId);
    },
    [managerHistory.activity, onSelectSubject],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (floatingKind != null) {
        setFloatingKind(null);
        return;
      }
      // STAGE-2D:4 / STAGE-PROD:1/6 — Escape clears focus + collection/prep → Overview.
      if (explorerKind != null) {
        setActiveNav("Home");
        return;
      }
      if (
        interaction.mode !== "overview" ||
        interaction.collectionContext != null ||
        interaction.preparationContext != null
      ) {
        onOverview();
        return;
      }
    };
    globalThis.addEventListener("keydown", onKeyDown);
    return () => globalThis.removeEventListener("keydown", onKeyDown);
  }, [
    explorerKind,
    floatingKind,
    interaction.mode,
    interaction.collectionContext,
    interaction.preparationContext,
    onOverview,
  ]);

  const dataDetailContent = (
    <NexoraExecutiveDataExplorer
      workspaceId={dataWorkspaceId}
      activeImport={activeCsvImport}
      activeLiveObservation={activeLiveObservation}
      onImportCommitted={onCsvImportCommitted}
      onLiveObservationActivated={onLiveObservationActivated}
      onViewOnStage={onViewSourceOnStage}
      onShowDataObjectOnStage={onShowDataObjectOnStage}
      onAdvisorContext={onSourceAdvisorContext}
      onDataObjectSelection={setSelectedDataObjectId}
      selectedDataObjectId={selectedDataObjectId}
      onSemanticClarificationRequest={onCsvSemanticClarificationRequest}
      onSemanticClarificationCancel={onCsvSemanticClarificationCancel}
      awaitingClarificationFieldId={
        managerObjectSession.ncaConversationState?.pendingQuestion?.purpose === NCA_CSV_SEMANTIC_PURPOSE
          && managerObjectSession.ncaConversationState.pendingQuestion.valid
          ? managerObjectSession.ncaConversationState.pendingQuestion.relatedSubjectId
          : null
      }
      onSourceRemoved={onCsvSourceRemoved}
      onDismissRemovalReview={() => setCsvRemovalReviewSourceId(null)}
      removalReviewSourceId={csvRemovalReviewSourceId}
      selectedSourceId={dataRailSelectedSourceId}
      onSelectSource={(sourceId) => {
        setDataRailSelectedSourceId(sourceId);
        if (sourceId) setDetailLaunchReference(null);
      }}
    />
  );

  const managementExplorerKind = detailWorkspaceOpen ? null : explorerKind;
  const explorerContent =
    explorerKind === "journal" ? (
      <NexoraFlowJournalExplorer
        entries={activityEntries}
        selectedId={selectedJournalId}
        onSelect={onSelectJournalEntry}
        emptyLabel={
          managerHistory.chronological.length === 0 &&
          managerHistory.unplaced.length === 0 &&
          managerHistory.outsidePeriodCount > 0
            ? "No supported history in this period"
            : "No supported history yet"
        }
        historySubjectId={canonicalHistorySubjectId}
        historySource="canonical-projection"
      />
    ) : (
      <div
        data-testid="nexora-explorer-content"
        style={{ padding: "0.85rem" }}
      >
        <ExecutiveEmptyState
          title={
            explorerKind
              ? explorerTitle(explorerKind)
              : "Explorer"
          }
          body="Explorer content mounts in this drawer. Left navigation switches mode without creating separate permanent sidebars."
          actionHint="Select a destination from Left Nav"
          testId="nexora-explorer-empty"
        />
      </div>
    );

  const floatingTitle =
    floatingKind === "scenario-wizard"
      ? "Scenario Comparison"
      : floatingKind === "decision-wizard"
        ? "Decision Review"
        : floatingKind === "properties"
          ? "Execution Details"
          : "Executive Overlay";

  const commitHostedOrLocalSceneMutation = useCallback((
    mutation: SceneOrgSavedSceneCollectionMutation,
  ): SceneOrgSavedSceneMutationResult | Promise<SceneOrgSavedSceneMutationResult> => {
    const managerWorkspaceId = readLiveExecutiveDataWorkspaceId();
    const accept = (result: SceneOrgSavedSceneMutationResult) => {
      setSavedSceneMutation(result);
      if (result.status === "renamed" || result.status === "deleted") {
        savedScenesRef.current = result.scenes;
        setSavedScenes(result.scenes);
        if (result.status === "deleted" && activeSavedSceneId === mutation.sceneId) {
          setActiveSavedSceneId(null);
        }
      }
      return result;
    };
    if (!(deploymentMode === "hosted" && isCustomerHostedWorkspaceId(managerWorkspaceId))) {
      return accept(applySceneOrgSavedSceneCollectionMutation({
        scenes: savedScenesRef.current,
        mutation,
        managerWorkspaceId,
      }));
    }
    const captured: { scenes: readonly SceneOrgSavedScene[] | null } = { scenes: null };
    const probed = applySceneOrgSavedSceneCollectionMutation({
      scenes: savedScenesRef.current,
      mutation,
      managerWorkspaceId,
      persist: (next) => {
        captured.scenes = next;
        return { persisted: false, reason: "write-failed" };
      },
    });
    if (probed.status !== "persistence-failed" || captured.scenes == null) return accept(probed);
    const nextScenes = captured.scenes;
    return saveHostedOperations(managerWorkspaceId, {
      scenes: nextScenes.filter((scene) => scene.managerWorkspaceId === managerWorkspaceId),
    }).then(() => {
      setHostedOperationalPhase("ready");
      return accept({
        ...probed,
        status: mutation.kind === "rename" ? "renamed" : "deleted",
        scenes: nextScenes,
      });
    }).catch(() => {
      setHostedOperationalPhase("error");
      return accept({
        ...probed,
        status: "persistence-failed",
        scenes: savedScenesRef.current,
      });
    });
  }, [activeSavedSceneId, deploymentMode]);
  const hostedDecisionIds = decisionRuntime.adapter.listDecisions()
    .filter((record) => record.workspaceId === dataWorkspaceId)
    .map((record) => record.decisionId)
    .join(",");
  const hostedExecutionIds = executionRuntime.listExecutions()
    .filter((record) => record.workspaceId === dataWorkspaceId)
    .map((record) => record.executionId)
    .join(",");
  const hostedDefaultSceneId = managerSavedScenes.find((scene) => scene.kind === "DEFAULT_MANAGER")?.sceneId ?? "none";
  return (
    <div
      data-testid="nexora-executive-shell"
      data-hosted-operational-phase={hostedOperationalPhase}
      data-hosted-decision-ids={hostedDecisionIds || "none"}
      data-hosted-execution-ids={hostedExecutionIds || "none"}
      data-hosted-default-scene-id={hostedDefaultSceneId}
      data-hosted-decision-revision={String(decisionRevision)}
      data-hosted-execution-revision={String(executionRevision)}
      data-csv-hydrated={csvHydrated ? "true" : "false"}
      data-csv-durability={csvDurability}
      data-data-rail-open={detailWorkspaceOpen ? "true" : "false"}
      data-detail-workspace-open={detailWorkspaceOpen ? "true" : "false"}
      data-right-panel-collapsed={rightPanelChrome.collapsed ? "true" : "false"}
      data-nmi-panel-open={nmiPanelOpen ? "true" : "false"}
      data-saved-scene-count={String(managerSavedScenes.length)}
      data-saved-scene-ids={
        managerSavedScenes.map((scene) => scene.sceneId).join(",") || "none"
      }
      data-saved-scene-names={
        managerSavedScenes.map((scene) => scene.name).join("|") || "none"
      }
      data-saved-scene-references={
        managerSavedScenes
          .map((scene) => scene.canonicalReferences[0]?.canonicalId ?? "none")
          .join(",") || "none"
      }
      data-saved-scene-views={
        managerSavedScenes.map((scene) => scene.layout.presentationDepth).join(",") ||
        "none"
      }
      data-saved-scene-layouts={
        managerSavedScenes
          .map(
            (scene) =>
              `${scene.layout.rightRegion}/${scene.layout.detailWorkspace}`,
          )
          .join(",") || "none"
      }
      data-active-saved-scene={activeSavedSceneId ?? "none"}
      data-saved-scene-durability-classification={
        SCENE_ORG_SAVED_SCENE_DURABILITY_BOUNDARY.classification
      }
      data-saved-scene-durability-target={
        SCENE_ORG_SAVED_SCENE_DURABILITY_BOUNDARY.target
      }
      data-saved-scene-durability-scope={
        SCENE_ORG_SAVED_SCENE_DURABILITY_BOUNDARY.scope
      }
      data-saved-scene-schema-version={String(
        SCENE_ORG_SAVED_SCENE_DURABILITY_VERSION,
      )}
      data-saved-scene-hydration-status={savedSceneHydration.status}
      data-saved-scene-rejected-records={String(
        savedSceneHydration.rejectedRecords,
      )}
      data-saved-scene-restoration-status={
        savedSceneRestoration?.status ?? "none"
      }
      data-saved-scene-requested-subject={
        savedSceneRestoration?.requestedCanonicalId ?? "none"
      }
      data-saved-scene-restored-subject={
        savedSceneRestoration?.restoredCanonicalId ?? "none"
      }
      data-saved-scene-requested-depth={
        savedSceneRestoration?.requestedPresentationDepth ?? "none"
      }
      data-saved-scene-resolved-depth={
        savedSceneRestoration?.resolvedPresentationDepth ?? "none"
      }
      data-saved-scene-truth-source={
        savedSceneRestoration?.truthSource ?? "none"
      }
      data-saved-scene-resolution-status={
        savedSceneAccessResolution?.status ?? "none"
      }
      data-saved-scene-resolution-source={
        savedSceneAccessResolution?.source ?? "none"
      }
      data-saved-scene-resolution-match={
        savedSceneAccessResolution?.scene?.sceneId ?? "none"
      }
      data-saved-scene-mutation-status={savedSceneMutation?.status ?? "none"}
      data-saved-scene-mutation-kind={savedSceneMutation?.kind ?? "none"}
      data-saved-scene-mutation-id={savedSceneMutation?.sceneId ?? "none"}
      data-default-saved-scene={
        managerSavedScenes.find((scene) => scene.kind === "DEFAULT_MANAGER")?.sceneId ??
        "none"
      }
      data-selected-data-object-id={selectedDataObjectId ?? "none"}
      data-staged-data-object-ids={dataObjectStage.diagnostics.dataObjectIds.join(",") || "none"}
      data-staged-data-object-count={String(dataObjectStage.participants.length)}
      data-data-object-business-focus={interaction.focusedSubject?.id ?? "none"}
      data-data-object-projection-authority={dataObjectStage.identity}
      data-csv-removal-review-source={csvRemovalReviewSourceId ?? "none"}
      data-csv-semantic-awaiting-field={
        managerObjectSession.ncaConversationState?.pendingQuestion?.purpose === NCA_CSV_SEMANTIC_PURPOSE
          && managerObjectSession.ncaConversationState.pendingQuestion.valid
          ? managerObjectSession.ncaConversationState.pendingQuestion.relatedSubjectId ?? "none"
          : "none"
      }
      data-nexora-conversation-authority="executeNexoraConversationalExperience"
      data-nexora-final3-reference={NEXORA_FINAL3_NATURAL_REFERENCE_IDENTITY}
      data-nexora-final3-explain={NEXORA_FINAL3_EXECUTIVE_EXPLAIN_IDENTITY}
      data-nex-exp1="entrance-identity"
      data-nex-exp1-engine="NEX-EXP:1/NexoraEntranceManagerIdentityExperience"
      data-nex-exp1-mode={entranceSession.workspaceResolution}
      data-nex-exp1-state={entranceSession.state}
      data-nex-exp1-sufficiency={entranceSession.identity.sufficiency}
      data-nex-exp1-center={entranceSession.centerSubjectId ?? "none"}
      data-nex-exp1-object-count={String(dataRealityExperience.catalog.objects.length)}
      data-executive-experience-context={experienceContext}
      data-nex-ent1="entrance-introduction"
      data-nex-ent1-engine="NEX-ENT:1/NexoraEntranceAndIntroduction"
      data-nex-ent1-state={guidedEntranceOf(entranceSession).state}
      data-nex-ent1-introduced={
        guidedEntranceOf(entranceSession).introduced ? "true" : "false"
      }
      data-nex-ent1-seeded={
        guidedEntranceOf(entranceSession).introductionSeeded ? "true" : "false"
      }
      data-nex-ent2="stage-education"
      data-nex-ent2-engine="NEX-ENT:2/StageWorkspaceEducation"
      data-nex-ent2-state={stageEducationOf(entranceSession).state}
      data-nex-ent2-focus={
        stageEducationOf(entranceSession).focusDemonstrated ? "true" : "false"
      }
      data-nex-ent2-interacted={
        stageEducationOf(entranceSession).managerInteracted ? "true" : "false"
      }
      data-nex-ent3="object-education"
      data-nex-ent3-engine="NEX-ENT:3/ObjectLanguageEducation"
      data-nex-ent3-state={objectEducationOf(entranceSession).state}
      data-nex-ent3-object={
        objectEducationOf(entranceSession).currentObjectId ?? "none"
      }
      data-nex-conv="conversation-kernel"
      data-nex-conv-engine="NEX-CONV:1/ConversationKernel"
      data-nex-conv-subject={
        conversationContinuityOf(entranceSession).working.lastDecision?.subjectId ??
        "none"
      }
      data-nex-conv-purpose={
        conversationContinuityOf(entranceSession).working.lastDecision?.purpose ??
        "none"
      }
      data-nex-conv-move={
        conversationContinuityOf(entranceSession).working.lastDecision?.move ?? "none"
      }
      data-nex-conv-coverage={
        conversationContinuityOf(entranceSession).working.lastDecision?.progression ??
        "none"
      }
      data-nex-conv-reason={
        conversationContinuityOf(entranceSession).working.lastDecision?.reason ??
        "none"
      }
      data-nex-conv2="conversation-thread"
      data-nex-conv2-engine="NEX-CONV:2/ConversationThreadIntelligence"
      data-nex-conv2-objective={
        conversationContinuityOf(entranceSession).working.conversationThread
          ?.objective ?? "none"
      }
      data-nex-conv2-subject={
        conversationContinuityOf(entranceSession).working.conversationThread
          ?.primarySubject ?? "none"
      }
      data-nex-conv2-status={
        conversationContinuityOf(entranceSession).working.conversationThread
          ?.status ?? "none"
      }
      data-nex-conv2-covered={
        conversationContinuityOf(entranceSession).working.conversationThread
          ?.coveredPurposes.map((item) => item.purpose)
          .join(",") || "none"
      }
      data-nex-conv2-turn={
        conversationContinuityOf(entranceSession).working.lastThreadDecision
          ?.turnMove ?? "none"
      }
      data-nex-conv2-move={
        conversationContinuityOf(entranceSession).working.lastThreadDecision
          ?.resolvedMove ?? "none"
      }
      data-nex-conv2-reason={
        conversationContinuityOf(entranceSession).working.lastThreadDecision
          ?.reason ?? "none"
      }
      data-nex-conv-action={
        conversationContinuityOf(entranceSession).working.lastActionResult
          ?.requestedCapability ?? "none"
      }
      data-nex-conv-action-result={
        conversationContinuityOf(entranceSession).working.lastActionResult?.status ??
        "none"
      }
      data-nex-conv-action-from={
        conversationContinuityOf(entranceSession).working.lastActionResult
          ?.previousSubjectId ?? "none"
      }
      data-nex-conv-action-to={
        conversationContinuityOf(entranceSession).working.lastActionResult
          ?.resultingSubjectId ?? "none"
      }
      data-nex-conv-parity={(() => {
        const actionResult =
          conversationContinuityOf(entranceSession).working.lastActionResult;
        if (actionResult == null) return "none";
        const conversationSubject =
          conversationContinuityOf(entranceSession).working.conversationThread
            ?.primarySubject ?? null;
        const lessonSubject = objectEducationOf(entranceSession).currentObjectId ?? null;
        if (
          actionResult.status === "SUCCEEDED" &&
          actionResult.resultingSubjectId === conversationSubject &&
          actionResult.resultingSubjectId === lessonSubject
        ) {
          return "PASS";
        }
        return actionResult.status === "SUCCEEDED" ? "MISMATCH" : "none";
      })()}
      data-canonical-approved-decision-count={String(
        decisionRuntime.adapter.listDecisions().filter((item) => item.status === "Approved").length,
      )}
      data-canonical-execution-count={String(executionRuntime.listExecutions().length)}
      data-eca-2="executive-intent-action-plan"
      data-eca-2-engine={ECA_EXECUTIVE_ACTION_PLAN_IDENTITY}
      data-eca-2-intent={ecaActionPlan?.intent ?? "none"}
      data-advisor-data-route={dataAdvDiagnostics?.advisorDataRoute ?? "none"}
      data-data-conversation-intent={dataAdvDiagnostics?.dataConversationIntent ?? "none"}
      data-data-library-query-detected={dataAdvDiagnostics?.dataLibraryQueryDetected ? "true" : "false"}
      data-data-concept-query-detected={dataAdvDiagnostics?.dataConceptQueryDetected ? "true" : "false"}
      data-data-source-query-detected={dataAdvDiagnostics?.dataSourceQueryDetected ? "true" : "false"}
      data-specific-source-reference={dataAdvDiagnostics?.specificSourceReference ?? "none"}
      data-data-library-source-count={String(dataAdvDiagnostics?.dataLibrarySourceCount ?? 0)}
      data-active-source-count={String(dataAdvDiagnostics?.activeSourceCount ?? 0)}
      data-pending-source-count={String(dataAdvDiagnostics?.pendingSourceCount ?? 0)}
      data-historical-source-count={String(dataAdvDiagnostics?.historicalSourceCount ?? 0)}
      data-resolved-source-ids={dataAdvDiagnostics?.resolvedSourceIds.join("|") || "none"}
      data-resolved-source-names={dataAdvDiagnostics?.resolvedSourceNames.join("|") || "none"}
      data-source-status={dataAdvDiagnostics?.sourceStatus.join("|") || "none"}
      data-semantic-trust-summary={dataAdvDiagnostics?.semanticTrustSummary ?? "none"}
      data-data-adv-projection-consumed={dataAdvDiagnostics?.dataAdvProjectionConsumed ? "true" : "false"}
      data-data-reality-consumed={dataAdvDiagnostics?.dataRealityConsumed ? "true" : "false"}
      data-provenance-consumed={dataAdvDiagnostics?.provenanceConsumed ? "true" : "false"}
      data-generic-entity-fallback-used={dataAdvDiagnostics?.genericEntityFallbackUsed ? "true" : "false"}
      data-outcome-clarification-used={dataAdvDiagnostics?.outcomeClarificationUsed ? "true" : "false"}
      data-stage-fallback-used={dataAdvDiagnostics?.stageFallbackUsed ? "true" : "false"}
      data-product-fallback-used={dataAdvDiagnostics?.productFallbackUsed ? "true" : "false"}
      data-eca-2-next-action={ecaActionPlan?.nextAction ?? "none"}
      data-eca-2-authority={ecaActionPlan?.authorityTarget ?? "none"}
      data-eca-3="executive-initiative-judgment"
      data-eca-3-engine={ECA_EXECUTIVE_INITIATIVE_IDENTITY}
      data-eca-3-intervene={ecaInitiativeJudgment?.shouldIntervene ? "true" : "false"}
      data-eca-3-reason={ecaInitiativeJudgment?.reason ?? "none"}
      data-eca-3-strength={ecaInitiativeJudgment?.strength ?? "none"}
      data-eca-3-suppression={ecaInitiativeJudgment?.suppressionReason ?? "none"}
      data-eca-3-writes={ecaInitiativeJudgment?.boundaries.mutatesBusinessState ? "true" : "false"}
      data-eca-4="executive-information-need"
      data-eca-4-engine={ECA_EXECUTIVE_INFORMATION_NEED_IDENTITY}
      data-eca-4-action={ecaInformationNeedJudgment?.acquisitionAction ?? "none"}
      data-eca-4-ask={ecaInformationNeedJudgment?.shouldAsk ? "true" : "false"}
      data-eca-4-type={ecaInformationNeedJudgment?.primaryNeed?.informationType ?? "none"}
      data-eca-4-status={ecaInformationNeedJudgment?.primaryNeed?.currentStatus ?? "none"}
      data-eca-4-necessity={ecaInformationNeedJudgment?.primaryNeed?.necessity ?? "none"}
      data-eca-4-source={ecaInformationNeedJudgment?.primaryNeed?.sourceCandidates[0]?.source ?? "none"}
      data-eca-4-writes={ecaInformationNeedJudgment?.boundaries.mutatesBusinessState ? "true" : "false"}
      data-eca-4-clarify-engine={ecaInformationNeedJudgment?.boundaries.createsSecondClarificationEngine ? "true" : "false"}
      data-eca-4-subject={ecaInformationNeedJudgment?.primaryNeed?.subject?.label ?? "none"}
      data-eca-4-consumed={ecaInformationNeedJudgment?.advisorConsumedInformationNeed ? "true" : "false"}
      data-eca-5="executive-answer-intake"
      data-eca-5-engine={ECA_EXECUTIVE_ANSWER_INTAKE_IDENTITY}
      data-eca-5-bound={ecaAnswerIntakeJudgment?.bound ? "true" : "false"}
      data-eca-5-type={ecaAnswerIntakeJudgment?.answerType ?? "none"}
      data-eca-5-complete={ecaAnswerIntakeJudgment?.completeness ?? "none"}
      data-eca-5-confidence={ecaAnswerIntakeJudgment?.confidence ?? "none"}
      data-eca-5-conflict={ecaAnswerIntakeJudgment?.conflict ?? "none"}
      data-eca-5-action={ecaAnswerIntakeJudgment?.intakeAction ?? "none"}
      data-eca-5-need={ecaAnswerIntakeJudgment?.needSatisfaction ?? "none"}
      data-eca-5-writes={ecaAnswerIntakeJudgment?.boundaries.mutatesBusinessState ? "true" : "false"}
      data-eca-5-stale-yes={ecaAnswerIntakeJudgment?.staleConfirmation ? "true" : "false"}
      data-eca-6="executive-dialogue-strategy"
      data-eca-6-engine={ECA_EXECUTIVE_DIALOGUE_STRATEGY_IDENTITY}
      data-eca-6-objective={ecaDialogueStrategy?.objectiveType ?? "none"}
      data-eca-6-lifecycle={ecaDialogueStrategy?.lifecycle ?? "none"}
      data-eca-6-relation={ecaDialogueStrategy?.relationshipToCurrentTurn ?? "none"}
      data-eca-6-milestone={ecaDialogueStrategy?.recommendedMilestone ?? "none"}
      data-eca-6-current-milestone={ecaDialogueStrategy?.currentMilestone ?? "none"}
      data-eca-6-return={ecaDialogueStrategy?.returnToObjective ? "true" : "false"}
      data-eca-6-writes={ecaDialogueStrategy?.boundaries.mutatesBusinessState ? "true" : "false"}
      data-eca-6-second-store={ecaDialogueStrategy?.boundaries.createsSecondObjectiveStore ? "true" : "false"}
      data-eca-7="executive-recommendation-readiness"
      data-eca-7-engine={ECA_EXECUTIVE_RECOMMENDATION_IDENTITY}
      data-eca-7-requested={ecaRecommendationJudgment?.recommendationRequested ? "true" : "false"}
      data-eca-7-readiness={ecaRecommendationJudgment?.readiness ?? "none"}
      data-eca-7-decision-readiness={ecaRecommendationJudgment?.decisionReadiness ?? "none"}
      data-eca-7-type={ecaRecommendationJudgment?.recommendationType ?? "none"}
      data-eca-7-strength={ecaRecommendationJudgment?.strength ?? "none"}
      data-eca-7-option={ecaRecommendationJudgment?.recommendedOption?.label ?? "none"}
      data-eca-7-writes={ecaRecommendationJudgment?.boundaries.mutatesBusinessState ? "true" : "false"}
      data-eca-7-decision-engine={ecaRecommendationJudgment?.boundaries.createsSecondDecisionEngine ? "true" : "false"}
      data-eca-8="executive-commitment-dialogue"
      data-eca-8-engine={ECA_EXECUTIVE_COMMITMENT_IDENTITY}
      data-eca-8-state={ecaCommitmentJudgment?.commitmentState ?? "none"}
      data-eca-8-target-resolution={ecaCommitmentJudgment?.targetResolution ?? "none"}
      data-eca-8-challenge={ecaCommitmentJudgment?.preDecisionChallenge ?? "none"}
      data-eca-8-confirmation={ecaCommitmentJudgment?.confirmationRequired ? "true" : "false"}
      data-eca-8-handoff={ecaCommitmentJudgment?.canonicalHandoffAllowed ? "true" : "false"}
      data-eca-8-writes={ecaCommitmentJudgment?.boundaries.mutatesBusinessState ? "true" : "false"}
      data-eca-8-second-writer={ecaCommitmentJudgment?.boundaries.createsSecondDecisionWriter ? "true" : "false"}
      data-eca-8-starts-execution={ecaCommitmentJudgment?.boundaries.startsExecution ? "true" : "false"}
      data-eca-9="executive-execution-readiness"
      data-eca-9-engine={ECA_EXECUTIVE_EXECUTION_READINESS_IDENTITY}
      data-eca-9-state={ecaExecutionReadinessJudgment?.postDecisionState ?? "none"}
      data-eca-9-readiness={ecaExecutionReadinessJudgment?.readiness ?? "none"}
      data-eca-9-intent={ecaExecutionReadinessJudgment?.managerIntent ?? "none"}
      data-eca-9-gap={ecaExecutionReadinessJudgment?.primaryGap ?? "none"}
      data-eca-9-create={ecaExecutionReadinessJudgment?.canonicalCreateAllowed ? "true" : "false"}
      data-eca-9-start={ecaExecutionReadinessJudgment?.canonicalStartAllowed ? "true" : "false"}
      data-eca-9-writes={ecaExecutionReadinessJudgment?.boundaries.mutatesBusinessState ? "true" : "false"}
      data-eca-9-second-writer={ecaExecutionReadinessJudgment?.boundaries.createsSecondExecutionWriter ? "true" : "false"}
      data-eca-9-starts-execution={ecaExecutionReadinessJudgment?.boundaries.startsExecution ? "true" : "false"}
      data-eca-10="live-execution-dialogue"
      data-eca-10-engine={ECA_LIVE_EXECUTION_IDENTITY}
      data-eca-10-live={ecaLiveExecutionJudgment?.liveState ?? "none"}
      data-eca-10-track={ecaLiveExecutionJudgment?.trackStatus ?? "none"}
      data-eca-10-deviation={ecaLiveExecutionJudgment?.deviation ?? "none"}
      data-eca-10-intent={ecaLiveExecutionJudgment?.managerIntent ?? "none"}
      data-eca-10-attention={ecaLiveExecutionJudgment?.primaryAttentionItem ?? "none"}
      data-eca-10-writes={ecaLiveExecutionJudgment?.boundaries.mutatesBusinessState ? "true" : "false"}
      data-eca-10-second-writer={ecaLiveExecutionJudgment?.boundaries.createsSecondExecutionWriter ? "true" : "false"}
      data-eca-10-monitor={ecaLiveExecutionJudgment?.boundaries.createsMonitoringDaemon ? "true" : "false"}
      data-eca-10-initiative={ecaLiveExecutionJudgment?.boundaries.createsSecondInitiativeEngine ? "true" : "false"}
      data-eca-11="outcome-dialogue"
      data-eca-11-engine={ECA_OUTCOME_DIALOGUE_IDENTITY}
      data-eca-11-state={ecaOutcomeJudgment?.observationState ?? "none"}
      data-eca-11-intent={ecaOutcomeJudgment?.managerIntent ?? "none"}
      data-eca-11-baseline={ecaOutcomeJudgment?.baselineComparison ?? "none"}
      data-eca-11-target={ecaOutcomeJudgment?.targetComparison ?? "none"}
      data-eca-11-overall={ecaOutcomeJudgment?.overallInterpretation ?? "none"}
      data-eca-11-attribution={ecaOutcomeJudgment?.attribution ?? "none"}
      data-eca-11-writes={ecaOutcomeJudgment?.boundaries.mutatesBusinessState ? "true" : "false"}
      data-eca-11-learning={ecaOutcomeJudgment?.boundaries.writesLearning ? "true" : "false"}
      data-eca-11-second-writer={ecaOutcomeJudgment?.boundaries.createsSecondOutcomeWriter ? "true" : "false"}
      data-eca-12="learning-reassessment-closure"
      data-eca-12-engine={ECA_LEARNING_CLOSURE_IDENTITY}
      data-eca-12-learning={ecaLearningClosureJudgment?.learningState ?? "none"}
      data-eca-12-closure={ecaLearningClosureJudgment?.closureState ?? "none"}
      data-eca-12-reassess={ecaLearningClosureJudgment?.reassessmentWarranted ? "true" : "false"}
      data-eca-12-writes={ecaLearningClosureJudgment?.boundaries.mutatesBusinessState ? "true" : "false"}
      data-eca-12-app4={ecaLearningClosureJudgment?.boundaries.writesApp4 ? "true" : "false"}
      data-eca-12-second-engine={ecaLearningClosureJudgment?.boundaries.createsSecondLearningEngine ? "true" : "false"}
      data-eca-12-objective-store={ecaLearningClosureJudgment?.boundaries.createsSecondObjectiveStore ? "true" : "false"}
      data-nex-ent4="conversation-education"
      data-nex-ent4-engine="NEX-ENT:4/AdvisorGuidedConversation"
      data-nex-ent4-state={conversationEducationOf(entranceSession).state}
      data-nex-ent5="attention-education"
      data-nex-ent5-engine="NEX-ENT:5/GuidedAttentionEducation"
      data-nex-ent5-state={attentionEducationOf(entranceSession).state}
      data-nex-ent6="data-education"
      data-nex-ent6-engine="NEX-ENT:6/DataEvidenceEducation"
      data-nex-ent6-state={dataEducationOf(entranceSession).state}
      data-nex-ent6-example={
        dataEducationOf(entranceSession).examplePath ? "true" : "false"
      }
      data-nex-ent7="visual-education"
      data-nex-ent7-engine="NEX-ENT:7/VisualIntelligenceEducation"
      data-nex-ent7-state={visualEducationOf(entranceSession).state}
      data-nex-ent8="decision-loop-education"
      data-nex-ent8-engine="NEX-ENT:8/DecisionLoopEducation"
      data-nex-ent8-state={decisionLoopEducationOf(entranceSession).state}
      data-nex-ent9="trust-review"
      data-nex-ent9-engine="NEX-ENT:9/TrustReview"
      data-nex-ent9-state={trustReviewOf(entranceSession).state}
      data-nex-ent10="personal-demo-handoff"
      data-nex-ent10-engine="NEX-ENT:10/PersonalDemoHandoff"
      data-nex-ent10-state={personalDemoHandoffOf(entranceSession).state}
      data-visual-view={visualView.view ? "present" : "none"}
      data-visual-purpose={visualView.view?.purpose ?? "none"}
      data-visual-representation={visualView.view?.representation ?? "none"}
      data-cei2-subject={visualizationRoute?.subjectId ?? "none"}
      data-cei2-nexo-family={visualizationRoute?.nexoFamily ?? "none"}
      data-cei2-recipe-family={visualizationRoute?.recipeFamily ?? "none"}
      data-cei2-route-status={visualizationRoute?.stageProjection.status ?? "none"}
      data-cei2-observation-count={String(visualizationRoute?.observationIds.length ?? 0)}
      data-cei2-dir-vi={visualView.view?.representation ?? "none"}
      data-guided-attention-target={guidedAttention.presentation?.target ?? "none"}
      data-guided-attention-availability={
        guidedAttention.presentation?.availability ?? "none"
      }
      data-guided-attention-cue={guidedAttention.presentation?.cue ?? "none"}
      data-guided-attention-active={
        guidedAttention.presentation?.cue ? "true" : "false"
      }
      data-nex-exp2="goal-discovery"
      data-nex-exp2-engine="NEX-EXP:2/GoalDiscoveryGoalObjectEmergence"
      data-nex-exp2-state={entranceSession.goalDiscovery?.state ?? "none"}
      data-nex-exp2-sufficiency={
        entranceSession.goalDiscovery?.context.sufficiency ?? "none"
      }
      data-nex-exp2-goal={
        entranceSession.goalDiscovery?.object?.displayName ?? "none"
      }
      data-nex-exp2-confirmed={
        entranceSession.goalDiscovery?.context.managerConfirmed
          ? "true"
          : "false"
      }
      data-nex-exp3="reality-discovery"
      data-nex-exp3-engine="NEX-EXP:3/CurrentRealityExecutiveContextDiscovery"
      data-nex-exp3-state={entranceSession.realityDiscovery?.state ?? "none"}
      data-nex-exp3-sufficiency={
        entranceSession.realityDiscovery?.context.sufficiency ?? "none"
      }
      data-nex-exp3-gap={
        entranceSession.realityDiscovery?.context.gap?.status ?? "none"
      }
      data-nex-exp3-object-count={String(
        entranceSession.realityDiscovery?.objects.length ?? 0,
      )}
      data-nex-exp4="issue-discovery"
      data-nex-exp4-engine="NEX-EXP:4/ProblemRiskOpportunityDiscovery"
      data-nex-exp4-state={entranceSession.issueDiscovery?.state ?? "none"}
      data-nex-exp4-object-count={String(
        entranceSession.issueDiscovery?.objects.length ?? 0,
      )}
      data-nex-exp4-kinds={
        entranceSession.issueDiscovery?.objects
          .map((entry) => entry.kind)
          .join(",") || "none"
      }
      data-nex-exp5="scenario-discovery"
      data-nex-exp5-engine="NEX-EXP:5/ScenarioOptionDiscovery"
      data-nex-exp5-state={entranceSession.scenarioDiscovery?.state ?? "none"}
      data-nex-exp5-object-count={String(
        entranceSession.scenarioDiscovery?.scenarios.length ?? 0,
      )}
      data-nex-exp6="scenario-comparison"
      data-nex-exp6-engine="NEX-EXP:6/ScenarioComparisonTradeoffRecommendation"
      data-nex-exp6-state={entranceSession.scenarioComparison?.state ?? "none"}
      data-nex-exp6-recommendation={
        entranceSession.scenarioComparison?.recommendation?.recommendationStatus ??
        "none"
      }
      data-nex-exp6-recommended-id={
        entranceSession.scenarioComparison?.recommendation?.recommendedScenarioId ??
        "none"
      }
      data-nex-exp6-commits-decision="false"
      data-nex-exp7="decision-commitment"
      data-nex-exp7-engine="NEX-EXP:7/ManagerDecisionCommitmentExperience"
      data-nex-exp7-state={entranceSession.decisionExperience?.state ?? "none"}
      data-nex-exp7-committed={
        entranceSession.decisionExperience?.canonicalRecord?.status === "Approved"
          ? "true"
          : "false"
      }
      data-nex-exp7-starts-execution="false"
      data-nex-exp8="execution-planning"
      data-nex-exp8-engine="NEX-EXP:8/ExecutionPlanningCommitmentToAction"
      data-nex-exp8-state={entranceSession.executionPlanning?.state ?? "none"}
      data-nex-exp8-readiness={
        entranceSession.executionPlanning?.plan?.readiness ?? "none"
      }
      data-nex-exp8-runtime={
        entranceSession.executionPlanning?.canonicalStatus ?? "none"
      }
      data-nex-exp8-started={
        entranceSession.executionPlanning?.canonicalStatus === "in-progress"
          ? "true"
          : "false"
      }
      data-nex-exp9="outcome-monitoring"
      data-nex-exp9-engine="NEX-EXP:9/OutcomeMonitoringGoalImpactExperience"
      data-nex-exp9-state={entranceSession.outcomeMonitoring?.state ?? "none"}
      data-nex-exp9-impact={
        entranceSession.outcomeMonitoring?.context?.goalImpact.state ?? "none"
      }
      data-nex-exp9-starts-learning="false"
      data-nex-exp10="learning-reassessment"
      data-nex-exp10-engine="NEX-EXP:10/LearningReassessmentNextExecutiveCycle"
      data-nex-exp10-state={
        entranceSession.learningReassessment?.state ?? "none"
      }
      data-nex-exp10-route={
        entranceSession.learningReassessment?.cycle?.reassessmentRoute ?? "none"
      }
      data-nex-exp10-commits-decision="false"
      data-nex-e2e1="full-executive-experience"
      data-nex-e2e1-engine="NEX-E2E:1/FullExecutiveExperienceEndToEndCertification"
      data-nex-e2e1-creates-exp11="false"
      data-nex-mvp-final="real-manager-mvp"
      data-nex-mvp-final-engine="NEX-MVP-FINAL:1/RealManagerMvpCertification"
      data-nex-mvp-final61="natural-language-understanding"
      data-nex-mvp-final61-engine={nexoraMvpFinal61NluIdentity}
      data-nex-mvp-final62="conversation-context-continuity"
      data-nex-mvp-final62-engine={nexoraMvpFinal62ContinuityIdentity}
      data-nex-mvp-final63="smart-clarification-correction"
      data-nex-mvp-final63-engine={nexoraMvpFinal63ClarificationIdentity}
      data-nex-mvp-final64="trusted-executive-communication"
      data-nex-mvp-final64-engine={nexoraMvpFinal64CommunicationIdentity}
      data-nex-mvp-final65="guidance-self-knowledge"
      data-nex-mvp-final65-engine={nexoraMvpFinal65GuidanceIdentity}
      data-nex-mvp-final66="type-c-manager-conversation"
      data-nex-mvp-final66-engine={nexoraMvpFinal66TypeCIdentity}
      data-nca1="manager-conversation-architecture"
      data-nca1-engine={nexoraNca1Identity}
      data-nca2="conversational-context-dialogue-state"
      data-nca2-engine={nexoraNca2Identity}
      data-nca2-move={conversationalLastTrace?.nca2Move ?? ""}
      data-nca2-topic={conversationalLastTrace?.nca2Topic ?? ""}
      data-nca2-subject={conversationalLastTrace?.nca2Subject ?? ""}
      data-nca2-pending={conversationalLastTrace?.nca2Pending ?? ""}
      data-nca2-thread={conversationalLastTrace?.nca2ThreadState ?? ""}
      data-nca3="clarification-information-gap-executive-question"
      data-nca3-engine={nexoraNca3Identity}
      data-nca3-mode={conversationalLastTrace?.nca3Mode ?? ""}
      data-nca3-ask={conversationalLastTrace?.nca3ShouldAsk === true ? "true" : "false"}
      data-nca3-sufficiency={conversationalLastTrace?.nca3Sufficiency ?? ""}
      data-nca3-gap={conversationalLastTrace?.nca3Gap ?? ""}
      data-nca4="executive-advisory-reasoning-recommendation-dialogue"
      data-nca4-engine={nexoraNca4Identity}
      data-nca4-move={conversationalLastTrace?.nca4Move ?? ""}
      data-nca4-status={conversationalLastTrace?.nca4Status ?? ""}
      data-nca4-option={conversationalLastTrace?.nca4Option ?? ""}
      data-nca4-strength={conversationalLastTrace?.nca4Strength ?? ""}
      data-nca4-confidence={conversationalLastTrace?.nca4Confidence ?? ""}
      data-nca4-advise={conversationalLastTrace?.nca4Advise === true ? "true" : "false"}
      data-nca5="proactive-executive-advisor-conversational-initiative"
      data-nca5-engine={nexoraNca5Identity}
      data-nca5-initiate={conversationalLastTrace?.nca5Initiate === true ? "true" : "false"}
      data-nca5-behavior={conversationalLastTrace?.nca5Behavior ?? ""}
      data-nca5-priority={conversationalLastTrace?.nca5Priority ?? ""}
      data-nca5-interrupt={conversationalLastTrace?.nca5Interrupt === true ? "true" : "false"}
      data-nca5-subject={conversationalLastTrace?.nca5Subject ?? ""}
      data-nca6="manager-model-communication-adaptation-trust"
      data-nca6-engine={nexoraNca6Identity}
      data-nca6-depth={conversationalLastTrace?.nca6Depth ?? ""}
      data-nca6-framing={conversationalLastTrace?.nca6Framing ?? ""}
      data-nca6-structure={conversationalLastTrace?.nca6Structure ?? ""}
      data-nca6-familiarity={conversationalLastTrace?.nca6Familiarity ?? ""}
      data-nca6-role={conversationalLastTrace?.nca6Role ?? ""}
      data-nca7="end-to-end-conversation-orchestration-final"
      data-nca7-engine={nexoraNca7Identity}
      data-nca7-owner={conversationalLastTrace?.nca7Owner ?? ""}
      data-nca7-rank={conversationalLastTrace?.nca7Rank ?? ""}
      data-nca7-ask={conversationalLastTrace?.nca7Ask === true ? "true" : "false"}
      data-nca7-advise={conversationalLastTrace?.nca7Advise === true ? "true" : "false"}
      data-nca7-initiate={conversationalLastTrace?.nca7Initiate === true ? "true" : "false"}
      data-nca-need={conversationalLastTrace?.ncaNeed ?? ""}
      data-nxa1-role={conversationalLastTrace?.nxaRole ?? ""}
      data-nxa1-need={conversationalLastTrace?.nxaNeed ?? ""}
      data-nxa1-referent={conversationalLastTrace?.nxaReferent ?? ""}
      data-nxa1-navigation={conversationalLastTrace?.nxaNavigationAllowed ? "true" : "false"}
      data-nxa2-behavior={conversationalLastTrace?.nxa2Behavior ?? ""}
      data-nxa2-value={conversationalLastTrace?.nxa2Valuable ? "true" : "false"}
      data-nxa2-gap={conversationalLastTrace?.nxa2QuestionGap ?? ""}
      data-nxa3-goal={conversationalLastTrace?.nxa3Goal ?? ""}
      data-nxa3-focus={conversationalLastTrace?.nxa3Focus ?? ""}
      data-nxa3-causal={conversationalLastTrace?.nxa3CausalStatus ?? ""}
      data-nxa3-recommendation={conversationalLastTrace?.nxa3RecommendationStatus ?? ""}
      data-nxa3-decision={conversationalLastTrace?.nxa3DecisionState ?? ""}
      data-nxa3-execution={conversationalLastTrace?.nxa3ExecutionState ?? ""}
      data-nxa3-outcome={conversationalLastTrace?.nxa3OutcomeState ?? ""}
      data-nxa3-change={conversationalLastTrace?.nxa3ChangeKind ?? ""}
      data-nxa4-disposition={conversationalLastTrace?.nxa4Disposition ?? ""}
      data-nxa4-intensity={conversationalLastTrace?.nxa4Intensity ?? ""}
      data-nxa4-materiality={conversationalLastTrace?.nxa4Materiality ?? ""}
      data-nxa4-evidence={conversationalLastTrace?.nxa4Evidence ?? ""}
      data-nxa4-novelty={conversationalLastTrace?.nxa4Novelty ?? ""}
      data-nxa5-judgment={conversationalLastTrace?.nxa5JudgmentType ?? ""}
      data-nxa5-preferred={conversationalLastTrace?.nxa5Preferred ?? ""}
      data-nxa5-recommendation={conversationalLastTrace?.nxa5RecommendationType ?? ""}
      data-nxa5-strength={conversationalLastTrace?.nxa5Strength ?? ""}
      data-nxa5-readiness={conversationalLastTrace?.nxa5Readiness ?? ""}
      data-nca-behavior={conversationalLastTrace?.ncaBehavior ?? ""}
      data-nca-sufficient={
        conversationalLastTrace?.ncaSufficient === true ? "true" : "false"
      }
      data-nca-capability={conversationalLastTrace?.ncaCapability ?? ""}
      data-nlu-raw={conversationalLastTrace ? conversationalLastTrace.utterance : ""}
      data-nlu-communicative-intent={
        conversationalLastTrace?.nluCommunicativeIntent ?? ""
      }
      data-nlu-operation={conversationalLastTrace?.nluRequestedOperation ?? ""}
      data-nlu-subject={conversationalLastTrace?.nluSubject ?? ""}
      data-nlu-question-type={conversationalLastTrace?.nluQuestionType ?? ""}
      data-nlu-confidence={conversationalLastTrace?.nluConfidence ?? ""}
      data-nlu-ambiguity={
        conversationalLastTrace?.nluAmbiguity === true ? "true" : "false"
      }
      data-nlu-authority={conversationalLastTrace?.nluAuthority ?? ""}
      data-continuity-provenance={
        conversationalLastTrace?.continuityProvenance ?? ""
      }
      data-continuity-move={conversationalLastTrace?.continuityMove ?? ""}
      data-continuity-subject={conversationalLastTrace?.continuitySubject ?? ""}
      data-continuity-confidence={
        conversationalLastTrace?.continuityConfidence ?? ""
      }
      data-continuity-ambiguity={
        conversationalLastTrace?.continuityAmbiguity === true ? "true" : "false"
      }
      data-continuity-active={
        conversationalLastTrace?.continuityActiveSubject ?? ""
      }
      data-continuity-investigation={
        conversationalLastTrace?.continuityInvestigation ?? ""
      }
      data-continuity-previous={
        conversationalLastTrace?.continuityPreviousSubject ?? ""
      }
      data-clarification-required={
        conversationalLastTrace?.clarificationRequired === true ? "true" : "false"
      }
      data-clarification-action={conversationalLastTrace?.clarificationAction ?? ""}
      data-clarification-reason={conversationalLastTrace?.clarificationReason ?? ""}
      data-clarification-question={
        conversationalLastTrace?.clarificationQuestion ?? ""
      }
      data-clarification-candidates={
        String(conversationalLastTrace?.clarificationCandidates ?? 0)
      }
      data-clarification-consequence={
        conversationalLastTrace?.clarificationConsequence ?? ""
      }
      data-clarification-pending={
        managerObjectSession.pendingClarification ? "true" : "false"
      }
      data-clarification-resumed={
        conversationalLastTrace?.resumedOperation ?? ""
      }
      data-correction-detected={
        conversationalLastTrace?.correctionDetected === true ? "true" : "false"
      }
      data-correction-scope={conversationalLastTrace?.correctionScope ?? ""}
      data-correction-before={conversationalLastTrace?.correctionBefore ?? ""}
      data-correction-after={conversationalLastTrace?.correctionAfter ?? ""}
      data-communication-depth={conversationalLastTrace?.communicationDepth ?? ""}
      data-communication-claim-count={
        String(conversationalLastTrace?.communicationClaimCount ?? 0)
      }
      data-communication-challenge={
        conversationalLastTrace?.communicationChallenge === true ? "true" : "false"
      }
      data-communication-recommendation={
        conversationalLastTrace?.communicationRecommendation === true ? "true" : "false"
      }
      data-communication-uncertainty={
        conversationalLastTrace?.communicationUncertaintyPreserved === true
          ? "true"
          : "false"
      }
      data-communication-causal-validated={
        conversationalLastTrace?.communicationCausalValidated === true ? "true" : "false"
      }
      data-communication-decision-wording={
        conversationalLastTrace?.communicationDecisionWording ?? ""
      }
      data-communication-execution-wording={
        conversationalLastTrace?.communicationExecutionWording ?? ""
      }
      data-guidance-intent={conversationalLastTrace?.guidanceIntent ?? ""}
      data-guidance-action={conversationalLastTrace?.guidanceAction ?? ""}
      data-guidance-capability={conversationalLastTrace?.guidanceCapability ?? ""}
      data-guidance-availability={conversationalLastTrace?.guidanceAvailability ?? ""}
      data-guidance-prerequisite={conversationalLastTrace?.guidancePrerequisite ?? ""}
      data-guidance-selected={conversationalLastTrace?.guidanceSelected ?? ""}
      data-guidance-reason={conversationalLastTrace?.guidanceReason ?? ""}
      data-guidance-proactive={
        conversationalLastTrace?.guidanceProactiveEligible === true ? "true" : "false"
      }
      data-guidance-suppressed={
        conversationalLastTrace?.guidanceProactiveSuppressed ?? ""
      }
      data-guidance-authority={conversationalLastTrace?.guidanceAuthority ?? ""}
      data-nex-mvp-final-new-engine="false"
      data-nex-mvp="8"
      data-shell-identity={shellIdentity.id}
      data-shell-version={shellIdentity.version}
      data-mvp-baseline={nexoraManagerMvpReleaseBaselineIdentity}
      data-data-status-kind={dataStatus.kind}
      data-flow-identity="NEX-MVP:8/NexoraExecutiveFlowIntegration"
      data-nexora-dataset={datasetScenario}
      data-rdi2-active-import={activeCsvImport?.importId ?? "none"}
      data-rdi2-dataset-id={activeCsvDataset?.id ?? "none"}
      data-data-ux3-semantic-authority="RDI:2/NexoraCsvRealDataVerticalSlice"
      data-data-ux3-pending-field={
        managerObjectSession.ncaConversationState?.pendingQuestion?.purpose === "csv-semantic-clarification"
          ? managerObjectSession.ncaConversationState.pendingQuestion.relatedSubjectId ?? "none"
          : "none"
      }
      data-data-ux3-pending-source={
        managerObjectSession.ncaConversationState?.pendingQuestion?.purpose === "csv-semantic-clarification"
          ? managerObjectSession.ncaConversationState.activeTopic?.id ?? "none"
          : "none"
      }
      data-data-reality-stage-binding={
        dataRealityExperience.stageBinding.identity.identity
      }
      data-data-reality-runtime-state={
        dataRealityExperience.runtimeState.identity.identity
      }
      data-data-reality-advisor-binding={
        dataRealityAdvisorExperience.advisorBinding.identity.identity
      }
      data-data-reality-focus-attention={
        dataRealityFocusAttentionExperience.focusAttention.identity.identity
      }
      data-data-reality-scene-choreography={
        dataRealitySceneChoreography.choreography.identity.identity
      }
      data-data-reality-connections-context={
        dataRealityConnectionsContext.connectionsContext.identity.identity
      }
      data-primary-focus={
        dataRealityFocusAttentionExperience.focusAttention.primaryFocus ??
        "none"
      }
      data-recommended-focus={
        dataRealityFocusAttentionExperience.focusAttention.recommendedFocus ??
        "none"
      }
      data-choreography-anchor={
        dataRealitySceneChoreography.choreography.anchorObjectId ?? "none"
      }
      data-revealed-connection-count={String(
        dataRealityConnectionsContext.connectionsContext.relationshipSummary
          .revealedConnectionCount,
      )}
      data-competing-attention={
        dataRealityFocusAttentionExperience.focusAttention.sceneAttention
          .hasCompetingAttention
          ? "true"
          : "false"
      }
      data-active-workspace={application.workspace}
      data-presentation-state={application.presentationState}
      data-active-surface={application.activeSurface}
      data-environment-intent={application.environmentIntent}
      data-selected-subject={application.selectedSubject?.id ?? "none"}
      data-focused-subject={application.focusedSubject?.id ?? "none"}
      data-stage-scene-id={`${interaction.workspace}:${stageInteraction.presentationMode ?? interaction.mode}`}
      data-stage-scene-mode={stageInteraction.presentationMode ?? interaction.mode}
      data-stage-visible-actor-count={String(
        stageInteraction.scene.objects.filter(
          (entry) => (entry.spatialRole ?? "hidden") !== "hidden" && entry.disclosureState !== "hidden",
        ).length,
      )}
      data-stage-visible-actor-ids={
        stageInteraction.scene.objects
          .filter(
            (entry) => (entry.spatialRole ?? "hidden") !== "hidden" && entry.disclosureState !== "hidden",
          )
          .map((entry) => entry.id)
          .join("|") || "none"
      }
      data-stage-visible-actor-names={
        stageInteraction.scene.objects
          .filter(
            (entry) => (entry.spatialRole ?? "hidden") !== "hidden" && entry.disclosureState !== "hidden",
          )
          .map((entry) => entry.label)
          .join("|") || "none"
      }
      data-stage-focused-object-id={application.focusedSubject?.id ?? "none"}
      data-stage-selected-object-id={application.selectedSubject?.id ?? "none"}
      data-stage-presentation-source="stage-presentation"
      data-eca1-stage-awareness-consumed={
        (ecaWorkingContextRef.current?.stageContext.visible.length ?? 0) > 0 ? "true" : "false"
      }
      data-advisor-stage-query-detected={
        /on (?:the )?stage|what can i see|visible objects/i.test(
          lastManagerUtteranceRef.current ?? "",
        )
          ? "true"
          : "false"
      }
      data-interaction-mode={interaction.mode}
      data-timeline-workspace={timelineBridge.activeWorkspace}
      data-flow-chain={flowContext.chain.summaryLine}
      data-workflow-phase={workflowPresentation.phase}
      data-workflow-readiness={workflowPresentation.readiness}
      data-workflow-next-subject={
        workflowPresentation.nextAvailableSubject?.id ?? "none"
      }
      data-workflow-outcome={workflowPresentation.outcomeAvailability}
      data-workflow-learning={workflowPresentation.learningAvailability}
      data-theme-mode={theme}
      data-resolved-ui-theme={resolvedUiTheme}
      data-ux1="simplify-executive-page"
      data-mo1="interaction"
      data-mo1-active-object-id={managerObjectSession.activeObjectId ?? "none"}
      data-mo1-activation={managerObjectSession.activationSource}
      data-mo2="explain-engine"
      data-mo2-engine="MO:2/GenericExplainEngine"
      data-nexora-mo2-explain-identity={NEXORA_FINAL3_EXECUTIVE_EXPLAIN_IDENTITY}
      data-mo2-subject={managerObjectSession.activeObjectId ?? "none"}
      data-mo2-summary={conversationalLastTrace?.explanationSummary ?? ""}
      data-mo2-epistemic={conversationalLastTrace?.explanationEpistemic ?? ""}
      data-mo2-intent={conversationalLastTrace?.managerObjectIntent ?? ""}
      data-mo2-focus={conversationalLastTrace?.explanationFocus ?? ""}
      data-mo3="exploration"
      data-mo3-engine="MO:3/ObjectGuidedExecutiveExploration"
      data-mo3-state={conversationalLastTrace?.explorationState ?? ""}
      data-mo3-recommended={conversationalLastTrace?.recommendedPathLabel ?? ""}
      data-mo3-recommended-kind={conversationalLastTrace?.recommendedPathKind ?? ""}
      data-mo3-recommended-target={conversationalLastTrace?.recommendedPathTarget ?? ""}
      data-mo4="goal-navigation"
      data-mo4-engine="MO:4/GoalDirectedExecutiveNavigation"
      data-mo4-goal={conversationalLastTrace?.goalTitle ?? ""}
      data-mo4-source={conversationalLastTrace?.goalSource ?? ""}
      data-mo4-confirmed={
        conversationalLastTrace?.goalConfirmed === true ? "true" : "false"
      }
      data-mo4-direction={conversationalLastTrace?.navigationDirection ?? ""}
      data-mo4-target={conversationalLastTrace?.navigationPathTarget ?? ""}
      data-mo4-progress={conversationalLastTrace?.goalProgress ?? ""}
      data-mo5="journey"
      data-mo5-engine="MO:5/ExecutiveJourneyProgressIntelligence"
      data-mo5-phase={conversationalLastTrace?.journeyPhase ?? ""}
      data-mo5-state={conversationalLastTrace?.journeyState ?? ""}
      data-mo5-blocker={conversationalLastTrace?.journeyBlocker ?? ""}
      data-mo5-health={conversationalLastTrace?.journeyHealth ?? ""}
      data-mo6="attention"
      data-mo6-engine="MO:6/ExecutiveAttentionInterventionIntelligence"
      data-mo6-state={conversationalLastTrace?.attentionState ?? ""}
      data-mo6-primary={conversationalLastTrace?.attentionPrimary ?? ""}
      data-mo6-intervention={conversationalLastTrace?.attentionIntervention ?? ""}
      data-mo6-do-not-disturb={
        conversationalLastTrace?.attentionDoNotDisturb === true ? "true" : "false"
      }
      data-mo6-steals-focus="false"
      data-mo-int1="experience-integration"
      data-mo-int1-engine="MO-INT:1/ManagerObjectExecutiveExperienceIntegration"
      data-mo-int1-lane={conversationalLastTrace?.experienceLane ?? ""}
      data-mo-int1-context={conversationalLastTrace?.experienceCompactContext ?? ""}
      data-mo-int1-next={conversationalLastTrace?.experienceNextStep ?? ""}
      data-mo6-signal={
        conversationalLastTrace?.attentionIntervention === "DECISION_REQUIRED" ||
        conversationalLastTrace?.attentionIntervention === "ACTION_REQUIRED"
          ? "intervention-required"
          : conversationalLastTrace?.attentionDoNotDisturb === true
            ? "safe-to-continue"
            : conversationalLastTrace?.attentionState === "WATCH"
              ? "watch"
              : conversationalLastTrace?.attentionPrimary
                ? "primary-attention"
                : conversationalLastTrace?.attentionState === "ATTENTION" ||
                    conversationalLastTrace?.attentionState === "URGENT"
                  ? "attention"
                  : ""
      }
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        background: cockpit.bg,
        color: cockpit.text,
        fontFamily:
          'var(--font-geist-sans), "IBM Plex Sans", "Segoe UI", system-ui, sans-serif',
        overflow: "hidden",
      }}
    >
      <NexoraAutomaticMonitoringCoordinator
        workspaceId={dataWorkspaceId}
        activeSourceContextId={activeLiveObservation?.sourceContextId ?? activeCsvImport?.sourceContextId ?? null}
        onActiveObservation={onLiveObservationActivated}
      />
      {hostedOperationalPhase === "error" ? (
        <p role="status" data-testid="hosted-operational-failure">
          Decision, Execution, and Saved Scene changes were not saved.
        </p>
      ) : null}
      <ExecutiveContextBar
        context={context}
        onThemeChange={setTheme}
        compact
        onHelp={() => setFloatingKind("wizard")}
        managerWorkspace={
          <NexoraManagerWorkspaceControl
            deploymentMode={deploymentMode}
            session={session}
            authProvider={authProvider}
            authError={authError}
            hostedWorkspaces={hostedWorkspaces}
            hostedWorkspaceStatus={hostedWorkspaceStatus}
          />
        }
      />

      <div
        data-testid="nexora-executive-main-region"
        style={{
          flex: "1 1 auto",
          display: "flex",
          minHeight: 0,
          position: "relative",
        }}
      >
        <NexoraWorkspaceRegionBoundary
          region="left-management"
          canonicalTargetId={interaction.focusedSubject?.id}
        >
          <ExecutiveLeftNav
            active={activeNav}
            onSelect={onNavSelect}
            compact
            nmiOpen={nmiPanelOpen}
            onToggleNmi={() => setNmiPanelOpen((open) => !open)}
          />

          <NexoraExecutiveQueueOverlay
            placement="left-management"
            visible={nmiPanelOpen}
            entries={stageInteraction.queueEntries ?? []}
            collectionHeaderLabel={stageInteraction.collectionHeader?.label ?? null}
            projectionAnchorId={
              stageInteraction.focusedSubjectId ??
              stageInteraction.selectedSubjectId ??
              null
            }
            mapNodes={nmiLive.overlayMapNodes}
            onSelectCanonicalId={(canonicalId) => {
              const projection = composeNmiStageProjection({
                projectionId: `nmi8:live:${canonicalId}`,
                selectedCanonicalId: canonicalId,
                source: "MANAGEMENT_MAP",
                map: nmiLive.map,
              });
              onSelectSubject(projection.projectionAnchorId);
            }}
            onSelectCategory={onSelectQueueCategory}
          />

          <ExecutiveExplorerDrawer
            kind={managementExplorerKind}
            title={explorerKind === "journal" ? "Activity" : undefined}
            width={explorerWidth}
            onWidthChange={setExplorerWidth}
            onClose={onExplorerClose}
            presentation="explorer"
          >
            {explorerContent}
          </ExecutiveExplorerDrawer>
        </NexoraWorkspaceRegionBoundary>

        <NexoraWorkspaceRegionBoundary
          region="center-stage"
          canonicalTargetId={interaction.focusedSubject?.id}
        >
          <div
            data-testid="executive-stage-column"
            data-mvp-stage-column="true"
            style={{
              flex: "1 1 78%",
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
              minHeight: 0,
              transition: `flex-basis ${cockpit.drawerMs} ease`,
            }}
          >
            <NexoraExecutiveFlowContextIndicator
              chain={flowContext.chain}
              workflow={workflowPresentation}
              onSelectLink={onSelectSubject}
            />
            <div
              data-testid="nexora-cc4-runtime-bridge"
              data-cc4="runtime-control-bridge"
              data-cc4-entry="nexora-cc4-dispatch"
              hidden
              aria-hidden="true"
            />
            <ExecutiveStageFrame
              guidedAttentionCue={
                guidedAttention.presentation?.target === "STAGE"
                  ? guidedAttention.presentation.cue
                  : null
              }
              stageControls={
                <><NexoraSavedSceneCollectionAccess
                  scenes={managerSavedScenes}
                  activeSceneId={activeSavedSceneId}
                  onOpenScene={(scene) => {
                    applyWorkspacePresentationAction(
                      {
                        action: "OPEN_SCENE",
                        sceneName: scene.name,
                        sceneId: scene.sceneId,
                        useCurrentReferent: false,
                      },
                      null,
                    );
                  }}
                  onRenameScene={(sceneId, name) =>
                    commitHostedOrLocalSceneMutation({ kind: "rename", sceneId, name })
                  }
                  onDeleteScene={(sceneId) =>
                    commitHostedOrLocalSceneMutation({ kind: "delete", sceneId })
                  }
                /><NexoraStageDataControl open={detailWorkspaceOpen} attention={false} guidedAttentionCue={
                  guidedAttention.presentation?.target === "DATA_ENTRY"
                    ? guidedAttention.presentation.cue
                    : null
                } onToggle={() => setActiveNav(explorerKind === "data" ? "Home" : "Data")} /><NexoraWorkspaceDialMount
                  activeWorkspace={application.workspace}
                  onWorkspaceChange={onWorkspaceChange}
                /></>
              }
            >
              <NexoraManagementLevelContextNav
                composition={managementLevelSpatial}
                selectedCanonicalId={
                  stageInteraction.focusedSubjectId ??
                  stageInteraction.selectedSubjectId ??
                  null
                }
                onSelectSubject={onSelectSubject}
              />
              <NexoraStageMount
                liveFoundation={liveStageFoundation}
              workspaceLabel={workspaceLabel}
              interaction={stageInteraction}
              managementLevelSpatial={managementLevelSpatial}
              environment={environmentVisual}
              presentationViewModel={presentationViewModel}
              advisorBridge={advisorBridge}
              stageSurfaceActive={!detailWorkspaceOpen}
              onSelectSubject={onSelectSubject}
              onStepBack={onStepBack}
              onStepForward={onStepForward}
              onNavigateTrailIndex={onNavigateTrailIndex}
              onOverview={onOverview}
              onPresentationStateChange={onPresentationStateChange}
              onPresentationAction={onPresentationAction}
              iconicObjects={theatreIconicObjects}
              visualPresentations={visualPresentations}
              visualGrammarVersion={theatreProjection.visualGrammar.grammarVersion}
              visualClaimCount={theatreProjection.visualGrammar.claims.length}
              warRoomAtmosphere={theatreProjection.warRoomAtmosphere}
              dataObjectStage={dataObjectStage}
              onSelectDataObject={onSelectStageDataObject}
              onRemoveDataObjectFromStage={onRemoveDataObjectFromStage}
              onOpenDataRail={() => setActiveNav("Data")}
              onAskDataObject={onSubmitConversationalUtterance}
              backGuidedAttentionCue={
                guidedAttention.presentation?.target === "BACK_CONTROL"
                  ? guidedAttention.presentation.cue
                  : null
              }
              sceneIntentKind={theatreProjection.sceneIntent.intentKind}
              sceneScriptId={theatreProjection.sceneScript.scriptId}
              theatreComposition={theatreProjection}
              requestedVisual={visualView.view}
              onDismissVisual={() => {
                setVisualView(emptyNexoraVisualViewRuntime());
                setVisualizationRoute(null);
              }}
              objectInvestigation={theatreProjection.objectInvestigation}
              investigationVisible={
                theatreProjection.objectInvestigation != null &&
                theatreProjection.objectInvestigation.objectId !== investigationDismissedId
              }
              onInvestigationLevelChange={setInvestigationLevel}
              onCloseInvestigation={() => {
                setInvestigationDismissedId(
                  theatreProjection.objectInvestigation?.objectId ?? null,
                );
              }}
              onAskInvestigationQuestion={onSubmitConversationalUtterance}
              onOpenInvestigationInRight={onOpenInvestigationInRight}
              decisionComparison={theatreProjection.decisionComparison}
              onComparisonLevelChange={setComparisonLevel}
              onReviewDecision={() => {
                setProposedCandidateId(
                  theatreProjection.decisionComparison?.activeCandidateId ??
                    interaction.focusedSubject?.id ??
                    null,
                );
                setDecisionReviewOpen(true);
              }}
              decisionCommitment={theatreProjection.decisionCommitment}
              onCancelDecisionReview={() => setDecisionReviewOpen(false)}
              onChangeDecisionCandidate={(candidateId) => {
                setProposedCandidateId(candidateId);
                setDecisionReviewOpen(true);
                onSelectSubject(candidateId);
              }}
              onCommitDecision={() => {
                const label = theatreProjection.decisionCommitment?.candidateLabel;
                if (label) void onSubmitConversationalUtterance(`Approve ${label}`);
              }}
              executionReadiness={theatreProjection.executionReadiness}
              liveExecution={theatreProjection.liveExecution}
              outcomeObservation={theatreProjection.outcomeObservation}
              learningReassessment={theatreProjection.learningReassessment}
              onRequestStartExecution={() => {
                void onSubmitConversationalUtterance("Start it.");
              }}
              onShowDecisionHistory={() => {
                void onSubmitConversationalUtterance("compare the alternatives again");
              }}
              />
            </ExecutiveStageFrame>

            <ExecutiveTimelineDock
              lens={timelineLens}
              packs={timelinePacks}
              selectedPackId={selectedPackId}
              onSelectLens={setTimelineLens}
              onSelectPack={onSelectTimelinePack}
              defaultCollapsed
              emptyLabel="No supported history yet"
              periodNote={
                managerHistory.chronological.length === 0 &&
                (managerHistory.unplaced.length > 0 || managerHistory.outsidePeriodCount > 0)
                  ? "No supported history in this period"
                  : null
              }
              historySubjectId={canonicalHistorySubjectId}
              historySource="canonical-projection"
              chronologicalCount={managerHistory.chronological.length}
              unplacedCount={managerHistory.unplaced.length}
            />
          </div>
        </NexoraWorkspaceRegionBoundary>

        <NexoraWorkspaceRegionBoundary
          region="right-context"
          canonicalTargetId={interaction.focusedSubject?.id}
          referentId={advisorBridge.advisorSubjectId}
        >
          <NexoraAdvisorInsightRegion
            tab={advisorTab}
            onTabChange={selectAdvisorTab}
            panelChrome={rightPanelChrome}
            onPanelChromeChange={setRightPanelChrome}
            packageTabSession={packageTabSession}
            onSelectPackageTab={(tabId) =>
              setPackageTabSession((session) =>
                activateSceneOrgRightPackageTab(session, tabId),
              )
            }
            onClosePackageTab={(tabId) =>
              setPackageTabSession((session) =>
                closeSceneOrgRightPackageTab(session, tabId),
              )
            }
            theatreComposition={theatreProjection}
            investigationLevel={investigationLevel}
            onInvestigationLevelChange={setInvestigationLevel}
            onAskObjectCard={onSubmitConversationalUtterance}
            learningWorkspaceId={dataWorkspaceId}
            productFixturesPermitted={permitProductFixtures}
            advisorBridge={advisorBridge}
            presentationViewModel={presentationViewModel}
            focusedSubject={advisorFocusedSubject}
            selectedSubject={interaction.selectedSubject}
            experienceContext={experienceContext}
            onIntelligenceAction={onIntelligenceAction}
            onExecuteNextBestAction={onExecuteNextBestAction}
            onSelectBriefOption={onSelectBriefOption}
            advisorRealityBinding={dataRealityAdvisorExperience.advisorBinding}
            validatedDataSource={dataRealityExperience.usesActiveDataSource}
            sourceIntelligenceContext={sourceAdvisorContext}
            onReturnToDataSource={() => setActiveNav("Data")}
            onProactiveInvestigate={onProactiveInvestigate}
            onProactiveViewOnStage={onViewSourceOnStage}
            conversationalMessages={conversationalMessages}
            conversationalProcessing={conversationalProcessing}
            conversationalContextLabel={
              conversationalLastTrace?.experienceCompactContext ||
              interaction.focusedSubject?.label ||
              interaction.selectedSubject?.label ||
              null
            }
            conversationalLastTrace={conversationalLastTrace}
            onSubmitConversationalUtterance={onSubmitConversationalUtterance}
            onConversationalAdvisorGroundingChange={
              onConversationalAdvisorGroundingChange
            }
            onBeginDailyPreparation={onBeginDailyPreparation}
            onBeginMeetingPreparation={onBeginMeetingPreparation}
            flowDecisions={flowDomain.decisions}
            flowExecutions={flowDomain.executions}
            decisionRuntime={decisionRuntime.adapter}
          />
        </NexoraWorkspaceRegionBoundary>

        <NexoraDetailWorkspaceBoundary
          target={detailWorkspaceTarget}
          open={detailWorkspaceOpen}
          connectionsAvailable
          configurationAvailable={detailConfigurationAvailable}
          onClose={onExplorerClose}
        >
          {dataDetailContent}
        </NexoraDetailWorkspaceBoundary>
      </div>

      <ExecutiveStatusBar
        connected={false}
        autoSave={true}
        syncLabel="Local"
        version={`Nexora · ${nexoraExecutiveShellVersion}`}
        notificationCount={0}
        onHelp={() => setFloatingKind("wizard")}
        managerHidden
      />

      <div
        data-testid="nexora-floating-panel-host"
        data-open={floatingKind != null ? "true" : "false"}
      >
        <ExecutiveFloatingPanel
          kind={floatingKind}
          title={floatingTitle}
          onClose={onFloatingClose}
        >
          {floatingKind != null ? (
            <NexoraFlowFloatingContent
              kind={floatingKind}
              flowContext={flowContext}
              flowState={flowDomain}
              actions={presentationViewModel.availableActions}
              actionMessage={flowDomain.lastActionMessage}
              actionError={flowDomain.lastError}
              pendingActionId={flowDomain.pendingActionId}
              onAction={onPresentationAction}
              onSelectSubject={onSelectSubject}
            />
          ) : (
            <div
              data-testid="nexora-floating-panel-content"
              style={{ padding: "1rem" }}
            >
              <ExecutiveEmptyState
                title="Floating Panel"
                body="Scenario, Decision, Object, and Data overlays mount through this host without leaving the Executive Environment."
                actionHint={nexoraExecutiveShellIdentity}
              />
            </div>
          )}
        </ExecutiveFloatingPanel>
      </div>
    </div>
  );
}
