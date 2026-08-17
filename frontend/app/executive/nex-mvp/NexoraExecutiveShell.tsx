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
import type {
  NexoraConversationalExperienceTrace,
  NexoraConversationalMessage,
} from "@/app/lib/conversational-control/conversationalExperience";
import { createEmptyNexoraExecutiveContextSnapshot } from "@/app/lib/conversational-control/executiveContextSnapshot";
import type { NexoraExecutiveContextSnapshot } from "@/app/lib/conversational-control/executiveContextSnapshot";
import { toNexoraConversationContextSnapshot } from "@/app/lib/conversational-control/executiveContextProjection";
import { syncNexoraExecutiveContextFromRuntimeState } from "@/app/lib/nex-mvp/nexoraMVPExecutiveContextAwareness";
import { projectNexoraConversationalSubjectsFromCatalog } from "@/app/lib/conversational-control/conversationalSubjectRegistry";
import { createEmptyNexoraExecutiveScenarioSession } from "@/app/lib/conversational-control/executiveScenarioResolver";
import type { NexoraExecutiveScenarioSession } from "@/app/lib/conversational-control/executiveScenarioResolver";
import { createEmptyNexoraExecutiveDecisionSession } from "@/app/lib/conversational-control/executiveDecisionAuthority";
import type { NexoraExecutiveDecisionSession } from "@/app/lib/conversational-control/executiveDecisionAuthority";
import { createNexoraCanonicalDecisionRuntime } from "@/app/lib/conversational-control/executiveDecisionRuntimeAdapter";
import type { NexoraCanonicalDecisionRuntime } from "@/app/lib/conversational-control/executiveDecisionRuntimeAdapter";
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
}: {
  readonly datasetScenario?: NexoraMVPDataRealityDatasetScenario;
}) {
  const shellIdentity = getNexoraExecutiveShellIdentity();
  const [application, setApplication] = useState(
    createInitialNexoraExecutiveShellApplicationState,
  );
  const [interaction, setInteraction] = useState(() =>
    createInitialNexoraMVPObjectInteractionState({
      workspace: application.workspace,
      presentationState: application.presentationState,
      environmentIntent: application.environmentIntent,
    }),
  );
  const [activeCsvImport, setActiveCsvImport] =
    useState<CsvCommittedImport | null>(null);
  const [activeLiveObservation, setActiveLiveObservation] =
    useState<NexoraLiveCommittedObservation | null>(null);
  const [sourceAdvisorContext, setSourceAdvisorContext] =
    useState<ExecutiveSourceAdvisorContext | null>(null);
  const activeCsvDataset = activeCsvImport?.prepared.handoff?.dataset;
  const activeSourceDataset = activeLiveObservation?.handoff.dataset ?? activeCsvDataset;

  const dataRealityExperience = useMemo(
    () =>
      resolveNexoraMVPDataRealityAwareStageExperience({
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
      }),
    [
      datasetScenario,
      activeSourceDataset,
      interaction.focusedSubject?.id,
      interaction.selectedSubject,
      interaction.workspace,
      interaction.presentationState,
    ],
  );

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
  const executiveContextRef = useRef(executiveContext);
  executiveContextRef.current = executiveContext;
  const [conversationalProcessing, setConversationalProcessing] =
    useState(false);
  const [conversationalLastTrace, setConversationalLastTrace] =
    useState<NexoraConversationalExperienceTrace | null>(null);
  const lastConversationalCommandIdRef = useRef<string | null>(null);
  const conversationalMessageSeqRef = useRef(0);

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
    const withLabels =
      applyExecutiveStageObjectLabelTerritoryToStagePresentation(
        withRecomposition,
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

  const timelinePacks = useMemo(
    () => mapNexoraMVPTimelinePacks(flowDomain),
    [flowDomain],
  );

  const journalEntries = useMemo(
    () => mapNexoraMVPJournalEntries(flowDomain),
    [flowDomain],
  );

  const context = useMemo(
    () => ({
      company: DEFAULT_CONTEXT.company,
      model: DEFAULT_CONTEXT.model,
      pack: workspaceLabel,
      lens: timelineLens,
      theme,
      liveStatus: DEFAULT_CONTEXT.liveStatus,
    }),
    [theme, timelineLens, workspaceLabel],
  );

  const syncExecutiveContextFromRuntime = useCallback(
    (
      nextState: typeof interaction,
      syncSource: "runtime" | "navigation" | "workspace-transition",
    ) => {
      const subjects = projectNexoraConversationalSubjectsFromCatalog({
        objects: dataRealityExperience.catalog.objects,
        contextSubjects: dataRealityExperience.catalog.contextSubjects,
      });
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
    (utterance: string) => {
      if (conversationalProcessing) return;
      setConversationalProcessing(true);
      try {
        conversationalMessageSeqRef.current += 1;
        const seed = `cc5-${conversationalMessageSeqRef.current}`;
        const previous = interactionRef.current;
        const subjects = projectNexoraConversationalSubjectsFromCatalog({
          objects: dataRealityExperience.catalog.objects,
          contextSubjects: dataRealityExperience.catalog.contextSubjects,
        });

        const result = executeNexoraConversationalExperience({
          utterance,
          executiveContext,
          conversationContext: toNexoraConversationContextSnapshot(
            executiveContext,
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
          decisionCommittedAt: "2026-08-15T00:00:00.000Z",
        });

        setConversationalMessages((msgs) =>
          Object.freeze([
            ...msgs,
            result.managerMessage,
            result.nexoraMessage,
          ]).slice(-20),
        );
        setExecutiveContext(result.nextExecutiveContext);
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
        setConversationalLastTrace(result.trace);

        if (result.shouldCommitRuntime) {
          lastConversationalCommandIdRef.current =
            result.commandResult?.command?.commandId ??
            lastConversationalCommandIdRef.current;
          setInteraction(result.nextRuntimeState);
          setApplication((app) =>
            applyInteractionToApplication(app, result.nextRuntimeState),
          );
        }
      } finally {
        setConversationalProcessing(false);
      }
    },
    [
      executiveContext,
      conversationalProcessing,
      dataRealityExperience.catalog,
      scenarioSession,
      decisionSession,
      decisionRuntime,
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
          occurredAt: "2026-08-15T12:00:00.000Z",
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
      data-nex-mvp="8"
      data-shell-identity={shellIdentity.id}
      data-shell-version={shellIdentity.version}
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
      data-theme-mode={theme}
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
      <ExecutiveContextBar context={context} onThemeChange={setTheme} />

      <div
        data-testid="nexora-executive-main-region"
        style={{
          flex: "1 1 auto",
          display: "flex",
          minHeight: 0,
        }}
      >
        <ExecutiveLeftNav active={activeNav} onSelect={onNavSelect} />

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
            flex: "1 1 70%",
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            minHeight: 0,
            transition: `flex-basis ${cockpit.drawerMs} ease`,
          }}
        >
          <NexoraExecutiveFlowContextIndicator
            chain={flowContext.chain}
            onSelectLink={onSelectSubject}
          />
          <div
            data-testid="nexora-cc4-runtime-bridge"
            data-cc4="runtime-control-bridge"
            data-cc4-entry="nexora-cc4-dispatch"
            hidden
            aria-hidden="true"
          />
          <div
            data-testid="nexora-preparation-triggers"
            data-stage-prod="6"
            style={{
              display: "flex",
              gap: "0.35rem",
              padding: "0.2rem 0.75rem 0.35rem",
              alignItems: "center",
            }}
          >
            <button
              type="button"
              data-testid="nexora-prepare-daily"
              onClick={onBeginDailyPreparation}
              style={{
                border: `1px solid ${cockpit.border}`,
                background: "transparent",
                color: cockpit.muted,
                fontSize: "0.58rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "0.2rem 0.45rem",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Daily Prep
            </button>
            <button
              type="button"
              data-testid="nexora-prepare-meeting"
              onClick={onBeginMeetingPreparation}
              style={{
                border: `1px solid ${cockpit.border}`,
                background: "transparent",
                color: cockpit.muted,
                fontSize: "0.58rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "0.2rem 0.45rem",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Meeting Prep
            </button>
          </div>
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
            />
          </ExecutiveStageFrame>

          <ExecutiveTimelineDock
            lens={timelineLens}
            packs={timelinePacks}
            selectedPackId={selectedPackId}
            onSelectLens={setTimelineLens}
            onSelectPack={onSelectTimelinePack}
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
          sourceIntelligenceContext={sourceAdvisorContext}
          onProactiveInvestigate={onProactiveInvestigate}
          onProactiveViewOnStage={onViewSourceOnStage}
          conversationalMessages={conversationalMessages}
          conversationalProcessing={conversationalProcessing}
          conversationalContextLabel={
            interaction.focusedSubject?.label ??
            interaction.selectedSubject?.label ??
            null
          }
          conversationalLastTrace={conversationalLastTrace}
          onSubmitConversationalUtterance={onSubmitConversationalUtterance}
        />
      </div>

      <ExecutiveStatusBar
        connected={false}
        autoSave={true}
        syncLabel="Local"
        version={`NEX-MVP · ${nexoraExecutiveShellVersion}`}
        notificationCount={0}
        onHelp={() => setFloatingKind("wizard")}
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
