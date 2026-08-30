"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  createInitialNexoraExecutiveShellApplicationState,
  getNexoraExecutiveShellIdentity,
  nexoraExecutiveShellIdentity,
  nexoraExecutiveShellVersion,
} from "@/app/lib/nex-mvp/nexoraExecutiveShell";
import {
  getNexoraMVPWorkspaceRegistry,
  type NexoraMVPPresentationState,
  type NexoraMVPWorkspaceKind,
} from "@/app/lib/nex-mvp/nexoraMVPApplicationFoundation";
import {
  applyNexoraMVPFlowDomainAction,
  beginNexoraMVPFlowPendingAction,
  classifyNexoraMVPFlowDomainAction,
  createInitialNexoraMVPFlowDomainState,
  deriveNexoraMVPExecutiveFlowContext,
  deriveNexoraMVPExecutiveWorkflowPresentation,
  failNexoraMVPFlowPendingAction,
  mapNexoraMVPJournalEntries,
  mapNexoraMVPTimelinePacks,
  overlayNexoraMVPPresentationStatus,
  projectNexoraMVPCatalogDecisionStatusesFromFlowDomain,
  projectNexoraMVPFlowDecisionsFromCanonicalRuntime,
  resolveNexoraMVPFlowPresentationActions,
  resolveNexoraMVPTimelinePackSubjectId,
} from "@/app/lib/nex-mvp/nexoraMVPExecutiveFlow";
import type { NexoraMVPIntelligenceAction } from "@/app/lib/nex-mvp/nexoraMVPExecutiveIntelligence";
import { projectNexoraExecutiveDataStatus } from "@/app/lib/nex-mvp/nexoraMVPExecutiveDataStatus";
import { nexoraManagerMvpReleaseBaselineIdentity } from "@/app/lib/nex-mvp/nexoraManagerMvpReleaseBaseline";
import type { NexoraMVPDataRealityDatasetScenario } from "@/app/lib/nex-mvp/nexoraMVPDataRealityStageBridge";
import type { CsvCommittedImport } from "@/app/lib/data-reality/csvRealDataImportStore";
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
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  jumpNexoraMVPObjectInteractionNavigationTrail,
  mapNexoraMVPInteractionStateToApplicationSubjects,
  openNexoraMVPExecutiveChangeCollection,
  openNexoraMVPExecutiveQueueCollection,
  acknowledgeNexoraMVPExecutiveChanges,
  beginNexoraMVPDailyPreparation,
  beginNexoraMVPMeetingPreparation,
  resetNexoraMVPObjectInteractionOverview,
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
import { executeNexoraConversationalExperience } from "@/app/lib/conversational-control/conversationalExperienceOrchestrator";
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
  applyEntranceCenterSubject,
  createNexoraEntranceSession,
  isNexoraEntranceRestrained,
  projectNexoraEntranceCatalog,
  stabilizeEntranceCatalog,
  writeStoredEntranceIdentity,
  clearStoredEntranceIdentity,
  readStoredEntranceIdentity,
} from "@/app/lib/nexora-entrance/nexoraEntranceExperience";
import type { NexoraEntranceSession } from "@/app/lib/nexora-entrance/nexoraEntranceTypes";
import type {
  NexoraConversationalAdvisorGrounding,
  NexoraConversationalExperienceTrace,
  NexoraConversationalMessage,
} from "@/app/lib/conversational-control/conversationalExperience";
import { createEmptyNexoraExecutiveContextSnapshot } from "@/app/lib/conversational-control/executiveContextSnapshot";
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
import { createNexoraCanonicalDecisionRuntime } from "@/app/lib/conversational-control/executiveDecisionRuntimeAdapter";
import type { NexoraCanonicalDecisionRuntime } from "@/app/lib/conversational-control/executiveDecisionRuntimeAdapter";
import { createNexoraCanonicalExecutionRuntime } from "@/app/lib/conversational-control/executiveExecutionRuntimeAdapter";
import type { NexoraExecutionRuntimeAdapter } from "@/app/lib/conversational-control/executiveExecutionRuntimeAdapter";
import { bootstrapCanonicalDecisionsFromFlowFixtures } from "@/app/lib/conversational-control/executiveDecisionStatusProjection";
import { createInitialNexoraMVPFlowDecisionRecords } from "@/app/lib/nex-mvp/nexoraMVPExecutiveFlowFixtures";
import type { ExecutiveQueueCategory } from "@/app/lib/spatial-presentation/executiveStageProductivityContract";
import {
  applyNexoraMVPPresentationDensity,
  applyNexoraMVPPresentationStateChange,
  deriveNexoraMVPPresentationViewModel,
  type NexoraMVPPresentationAvailableAction,
} from "@/app/lib/nex-mvp/nexoraMVPPresentationState";
import {
  applyNexoraMVPWorkspaceChangeToInteraction,
  deriveNexoraMVPSceneEnvironmentVisualState,
  deriveNexoraMVPWorkspacePresentation,
} from "@/app/lib/nex-mvp/nexoraMVPWorkspacePresentation";
import { ExecutiveContextBar } from "../exs1/shell/ExecutiveContextBar";
import { ExecutiveEmptyState } from "../exs1/shell/ExecutiveEmptyState";
import { ExecutiveExplorerDrawer } from "../exs1/shell/ExecutiveExplorerDrawer";
import { ExecutiveFloatingPanel } from "../exs1/shell/ExecutiveFloatingPanel";
import { ExecutiveLeftNav } from "../exs1/shell/ExecutiveLeftNav";
import { ExecutiveStageFrame } from "../exs1/shell/ExecutiveStageFrame";
import { ExecutiveStatusBar } from "../exs1/shell/ExecutiveStatusBar";
import { ExecutiveTimelineDock } from "../exs1/shell/ExecutiveTimelineDock";
import { cockpit } from "../exs1/shell/executiveCockpitTheme";
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
import {
  presentationByParticipantId,
  mapCapturedObservationsForTheatre,
  projectNexoraDecisionTheatreFoundation,
  type NexoraDecisionTheatreComparisonAuthority,
} from "@/app/lib/decision-theatre/nexoraDecisionTheatrePublicIndex.ts";
import { listCapturedObservations } from "@/app/lib/executive-intelligence/nexoraLiveOutcomeObservationCapture.ts";
import { NexoraWorkspaceDialMount } from "./NexoraWorkspaceDialMount";
import { NexoraExecutiveDataExplorer } from "./data/NexoraExecutiveDataExplorer";
import { NexoraAutomaticMonitoringCoordinator } from "./data/NexoraAutomaticMonitoringCoordinator";

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
}: {
  readonly datasetScenario?: NexoraMVPDataRealityDatasetScenario;
  readonly entranceRequested?: boolean;
  readonly resetEntrance?: boolean;
}) {
  const shellIdentity = getNexoraExecutiveShellIdentity();
  const [application, setApplication] = useState(
    createInitialNexoraExecutiveShellApplicationState,
  );
  const [entranceSession, setEntranceSession] = useState<NexoraEntranceSession>(
    () => {
      if (resetEntrance) clearStoredEntranceIdentity();
      const stored =
        entranceRequested && !resetEntrance
          ? readStoredEntranceIdentity()
          : null;
      return createNexoraEntranceSession({
        workspaceResolution: entranceRequested
          ? stored
            ? "returning-sufficient"
            : "first-time"
          : "existing-workspace",
        identity: stored,
      });
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
  const [activeLiveObservation, setActiveLiveObservation] =
    useState<NexoraLiveCommittedObservation | null>(null);
  const [sourceAdvisorContext, setSourceAdvisorContext] =
    useState<ExecutiveSourceAdvisorContext | null>(null);
  const activeCsvDataset = activeCsvImport?.prepared.handoff?.dataset;
  const activeSourceDataset = activeLiveObservation?.handoff.dataset ?? activeCsvDataset;

  const dataRealityExperience = useMemo(() => {
    const restrained = isNexoraEntranceRestrained(entranceSession);
    const result = resolveNexoraMVPDataRealityAwareStageExperience({
      datasetScenario,
      ...(activeSourceDataset ? { dataset: activeSourceDataset } : {}),
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

  const [flowDomain, setFlowDomain] = useState(
    createInitialNexoraMVPFlowDomainState,
  );
  const [theme, setTheme] = useState<ExecutiveThemeMode>("night");
  const [activeNav, setActiveNav] = useState<ExecutiveNavId>("Home");
  const [explorerWidth, setExplorerWidth] = useState(300);
  const [advisorTab, setAdvisorTab] = useState<ExecutiveAdvisorTab>("Assist");
  const [timelineLens, setTimelineLens] =
    useState<ExecutiveTimelineLens>("week");
  const [selectedPackId, setSelectedPackId] = useState<string | null>(null);
  const [selectedJournalId, setSelectedJournalId] = useState<string | null>(
    null,
  );
  const [floatingKind, setFloatingKind] =
    useState<ExecutiveFloatingPanelKind>(null);

  // CC:5/CC:7 — short-lived conversational session + structured executive context.
  const [conversationalMessages, setConversationalMessages] = useState<
    readonly NexoraConversationalMessage[]
  >(Object.freeze([]));
  const [executiveContext, setExecutiveContext] =
    useState<NexoraExecutiveContextSnapshot>(() =>
      createEmptyNexoraExecutiveContextSnapshot({
        currentWorkspaceId: "overview",
      }),
    );
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
      initialDecisions: bootstrapCanonicalDecisionsFromFlowFixtures(
        createInitialNexoraMVPFlowDecisionRecords(),
      ),
    });
  }
  const decisionRuntime = decisionRuntimeRef.current;
  const executionRuntimeRef = useRef<NexoraExecutionRuntimeAdapter | null>(null);
  if (executionRuntimeRef.current == null) {
    executionRuntimeRef.current = createNexoraCanonicalExecutionRuntime({
      decisionRuntime: decisionRuntime.adapter,
      authorityId: "nexora.executive-shell.execution-runtime",
    });
  }
  const executionRuntime = executionRuntimeRef.current;
  const executiveContextRef = useRef(executiveContext);
  executiveContextRef.current = executiveContext;
  const [conversationalProcessing, setConversationalProcessing] =
    useState(false);
  const conversationalProcessingRef = useRef(false);
  const [conversationalLastTrace, setConversationalLastTrace] =
    useState<NexoraConversationalExperienceTrace | null>(null);
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
  const conversationalMessageSeqRef = useRef(0);
  const [investigationLevel, setInvestigationLevel] = useState<
    "glance" | "understand" | "investigate"
  >("glance");
  const [comparisonLevel, setComparisonLevel] = useState<
    "choice" | "compare" | "decide"
  >("choice");
  const [investigationDismissedId, setInvestigationDismissedId] = useState<string | null>(
    null,
  );
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

  const explorerKind = navToExplorer(activeNav);
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
      const relatedExecutions = executionRuntime.listExecutions();
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
    dataRealitySceneChoreography.choreography,
    dataRealityConnectionsContext.connectionsContext,
  ]);

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
      ),
    [interaction.environmentIntent],
  );

  const focusedSubject =
    interaction.focusedSubject ?? interaction.selectedSubject;

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

  const timelinePacks = useMemo(
    () => mapNexoraMVPTimelinePacks(flowDomain),
    [flowDomain],
  );

  const journalEntries = useMemo(
    () => mapNexoraMVPJournalEntries(flowDomain),
    [flowDomain],
  );

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
    setInteraction((previous) => {
      const next = resetNexoraMVPObjectInteractionOverview(previous);
      setApplication((app) => applyInteractionToApplication(app, next));
      // Overview is presentation reset — preserve executive structure (CC:7).
      syncExecutiveContextFromRuntime(next, "runtime");
      setInvestigationDismissedId(null);
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
      setInteraction((previous) => {
        const next = selectNexoraMVPInteractionSubject(previous, subjectId);
        setApplication((app) => applyInteractionToApplication(app, next));
        syncExecutiveContextFromRuntime(next, "runtime");
        setManagerObjectSession((previous) =>
          activateManagerObjectFromClick(previous, next.focusedSubject?.id ?? subjectId),
        );
        setInvestigationDismissedId(null);
        setInvestigationLevel("glance");
        return next;
      });
    },
    [syncExecutiveContextFromRuntime],
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
        // Let the restrained sending state paint before deterministic CC work.
        await new Promise<void>((resolve) => setTimeout(resolve, 80));
        const previous = interactionRef.current;
        const subjects = projectManagerObjectConversationalSubjects(
          dataRealityExperience.catalog,
        );

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
          decisionCommittedAt: new Date().toISOString(),
          advisorGrounding: conversationalAdvisorGroundingRef.current,
          pendingTurnExpectation:
            executiveContextRef.current.pendingTurnExpectation,
          previousUtterance: lastManagerUtteranceRef.current,
          previousManagerObjectSession: managerObjectSessionRef.current,
          previousEntranceSession: entranceSession,
          theatreDecisionReviewOpen: decisionReviewOpen,
          theatreProposedCandidateId: proposedCandidateId,
        });

        lastManagerUtteranceRef.current = trimmed;
        setConversationalMessages((msgs) =>
          Object.freeze([...msgs, result.nexoraMessage]).slice(-20),
        );
        setExecutiveContext(result.nextExecutiveContext);
        if (result.nextEntranceSession) {
          setEntranceSession(result.nextEntranceSession);
          writeStoredEntranceIdentity(result.nextEntranceSession.identity);
        }
        if (result.nextScenarioSession) {
          setScenarioSession(result.nextScenarioSession);
        }
        if (result.nextDecisionSession) {
          setDecisionSession(result.nextDecisionSession);
        }
        // CC:10R.1 — Stage/flowDomain Decision projection from canonical Runtime.
        // Status changes do not steal Stage focus (interaction only updates when shouldCommitRuntime).
        setFlowDomain((current) =>
          projectNexoraMVPFlowDecisionsFromCanonicalRuntime(
            current,
            decisionRuntime.adapter,
          ),
        );
        setDecisionRevision((value) => value + 1);
        setExecutionRevision((value) => value + 1);
        setConversationalLastTrace(result.trace);
        setManagerObjectSession(result.managerObjectTurn.session);
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

        if (result.shouldCommitRuntime) {
          lastConversationalCommandIdRef.current =
            result.commandResult?.command?.commandId ??
            lastConversationalCommandIdRef.current;
          setInteraction(result.nextRuntimeState);
          setApplication((app) =>
            applyInteractionToApplication(app, result.nextRuntimeState),
          );
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

      setFlowDomain((current) => {
        if (
          current.pendingActionId != null &&
          current.pendingActionId !== action.id
        ) {
          return failNexoraMVPFlowPendingAction(
            current,
            "Another executive action is already pending.",
          );
        }
        const pending = beginNexoraMVPFlowPendingAction(current, action.id);
        const result = applyNexoraMVPFlowDomainAction(pending, request, {
          decisionRuntime: decisionRuntime.adapter,
          occurredAt: new Date().toISOString(),
        });
        if (!result.ok) {
          return failNexoraMVPFlowPendingAction(result.state, result.message);
        }
        return result.state;
      });
      return true;
    },
    [
      interaction.focusedSubject?.id,
      interaction.selectedSubject?.id,
      decisionRuntime,
    ],
  );

  const onPresentationAction = useCallback(
    (action: NexoraMVPPresentationAvailableAction) => {
      if (!action.available) return;
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
        return;
      }
      if (action.kind === "acknowledge") {
        setAdvisorTab("Assist");
        return;
      }
      if (action.kind === "review") {
        applyFlowAction(action);
      }
    },
    [applyFlowAction, onSelectSubject],
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
      setActiveNav(nav);
      if (nav === "Home") {
        onOverview();
      }
    },
    [onOverview],
  );

  const onExplorerClose = useCallback(() => {
    setActiveNav("Home");
  }, []);

  const onCsvImportCommitted = useCallback((committed: CsvCommittedImport) => {
    setActiveCsvImport(committed);
    setActiveLiveObservation(null);
    setSourceAdvisorContext(null);
    setAdvisorTab("Assist");
  }, []);

  const onLiveObservationActivated = useCallback((observation: NexoraLiveCommittedObservation) => {
    setActiveLiveObservation(observation);
    setActiveCsvImport(null);
    setSourceAdvisorContext(null);
    setAdvisorTab("Assist");
  }, []);

  const onViewSourceOnStage = useCallback((stageObjectId: string) => {
    onSelectSubject(stageObjectId);
    setActiveNav("Home");
  }, [onSelectSubject]);

  const onSourceAdvisorContext = useCallback((context: ExecutiveSourceAdvisorContext) => {
    setSourceAdvisorContext(context);
    setAdvisorTab("Assist");
  }, []);

  const onProactiveInvestigate = useCallback((brief: NexoraProactiveAdvisorBrief) => {
    setSourceAdvisorContext(brief.advisorContext);
    setAdvisorTab("Assist");
  }, []);

  const onFloatingClose = useCallback(() => {
    setFloatingKind(null);
  }, []);

  const onSelectTimelinePack = useCallback(
    (packId: string) => {
      setSelectedPackId(packId);
      const subjectId = resolveNexoraMVPTimelinePackSubjectId(
        flowDomain,
        packId,
      );
      if (subjectId) {
        onSelectSubject(subjectId);
      }
    },
    [flowDomain, onSelectSubject],
  );

  const onSelectJournalEntry = useCallback(
    (entryId: string, subjectId: string) => {
      setSelectedJournalId(entryId);
      const pack = flowDomain.journalPacks.find((item) => item.id === entryId);
      if (pack) {
        setSelectedPackId(pack.timelineEventId);
      }
      onSelectSubject(subjectId);
    },
    [flowDomain.journalPacks, onSelectSubject],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (floatingKind != null) {
        setFloatingKind(null);
        return;
      }
      // STAGE-2D:4 / STAGE-PROD:1/6 — Escape clears focus + collection/prep → Overview.
      if (
        interaction.mode !== "overview" ||
        interaction.collectionContext != null ||
        interaction.preparationContext != null
      ) {
        onOverview();
        return;
      }
      if (explorerKind != null) {
        setActiveNav("Home");
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

  const explorerContent =
    explorerKind === "data" ? (
      <NexoraExecutiveDataExplorer
        workspaceId={interaction.workspace}
        activeImport={activeCsvImport}
        activeLiveObservation={activeLiveObservation}
        onImportCommitted={onCsvImportCommitted}
        onLiveObservationActivated={onLiveObservationActivated}
        onViewOnStage={onViewSourceOnStage}
        onAdvisorContext={onSourceAdvisorContext}
      />
    ) : explorerKind === "journal" ? (
      <NexoraFlowJournalExplorer
        entries={journalEntries}
        selectedId={selectedJournalId}
        onSelect={onSelectJournalEntry}
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

  return (
    <div
      data-testid="nexora-executive-shell"
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
        workspaceId={interaction.workspace}
        activeSourceContextId={activeLiveObservation?.sourceContextId ?? activeCsvImport?.sourceContextId ?? null}
        onActiveObservation={onLiveObservationActivated}
      />
      <ExecutiveContextBar
        context={context}
        onThemeChange={setTheme}
        compact
        onHelp={() => setFloatingKind("wizard")}
      />

      <div
        data-testid="nexora-executive-main-region"
        style={{
          flex: "1 1 auto",
          display: "flex",
          minHeight: 0,
        }}
      >
        <ExecutiveLeftNav active={activeNav} onSelect={onNavSelect} compact />

        <ExecutiveExplorerDrawer
          kind={explorerKind}
          title={explorerKind === "data" ? "Data Explorer" : undefined}
          width={explorerWidth}
          onWidthChange={setExplorerWidth}
          onClose={onExplorerClose}
        >
          {explorerContent}
        </ExecutiveExplorerDrawer>

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
            stageControls={
              <NexoraWorkspaceDialMount
                activeWorkspace={application.workspace}
                onWorkspaceChange={onWorkspaceChange}
              />
            }
          >
            <NexoraStageMount
              workspaceLabel={workspaceLabel}
              interaction={stageInteraction}
              environment={environmentVisual}
              presentationViewModel={presentationViewModel}
              advisorBridge={advisorBridge}
              onSelectSubject={onSelectSubject}
              onSelectQueueCategory={onSelectQueueCategory}
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
              sceneIntentKind={theatreProjection.sceneIntent.intentKind}
              sceneScriptId={theatreProjection.sceneScript.scriptId}
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
          />
        </div>

        <NexoraAdvisorInsightRegion
          tab={advisorTab}
          onTabChange={setAdvisorTab}
          advisorBridge={advisorBridge}
          presentationViewModel={presentationViewModel}
          focusedSubject={interaction.focusedSubject}
          selectedSubject={interaction.selectedSubject}
          onIntelligenceAction={onIntelligenceAction}
          onExecuteNextBestAction={onExecuteNextBestAction}
          onSelectBriefOption={onSelectBriefOption}
          advisorRealityBinding={dataRealityAdvisorExperience.advisorBinding}
          validatedDataSource={dataRealityExperience.usesActiveDataSource}
          sourceIntelligenceContext={sourceAdvisorContext}
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
