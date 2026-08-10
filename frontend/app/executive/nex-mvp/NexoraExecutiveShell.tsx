"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
  resolveNexoraMVPFlowPresentationActions,
  resolveNexoraMVPTimelinePackSubjectId,
} from "@/app/lib/nex-mvp/nexoraMVPExecutiveFlow";
import type { NexoraMVPIntelligenceAction } from "@/app/lib/nex-mvp/nexoraMVPExecutiveIntelligence";
import {
  buildNexoraMVPAdvisorContextBridge,
  buildNexoraMVPTimelineContextBridge,
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  mapNexoraMVPInteractionStateToApplicationSubjects,
  resetNexoraMVPObjectInteractionOverview,
  selectNexoraMVPInteractionSubject,
  stepBackNexoraMVPObjectInteraction,
  type NexoraMVPObjectInteractionState,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction";
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
 */
export function NexoraExecutiveShell() {
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

  const explorerKind = navToExplorer(activeNav);
  const workspaceRegistry = getNexoraMVPWorkspaceRegistry();
  const workspaceLabel =
    workspaceRegistry.find((entry) => entry.kind === application.workspace)
      ?.label ?? application.workspace;

  const stageInteraction = useMemo(() => {
    const base = deriveNexoraMVPStageInteractionPresentation(interaction);
    const withWorkspace = deriveNexoraMVPWorkspacePresentation(
      base,
      interaction.workspace,
    );
    return applyNexoraMVPPresentationDensity(
      withWorkspace,
      interaction.presentationState,
    );
  }, [interaction]);

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
    return Object.freeze({
      ...base,
      essentialStatus: overlayNexoraMVPPresentationStatus(
        base.essentialStatus,
        flowDomain,
        focusedSubject?.id ?? null,
      ),
      availableActions,
    });
  }, [focusedSubject, flowDomain, interaction]);

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

  const onWorkspaceChange = useCallback((workspace: NexoraMVPWorkspaceKind) => {
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
      return next;
    });
  }, []);

  const onOverview = useCallback(() => {
    setInteraction((previous) => {
      const next = resetNexoraMVPObjectInteractionOverview(previous);
      setApplication((app) => applyInteractionToApplication(app, next));
      return next;
    });
  }, []);

  const onStepBack = useCallback(() => {
    setInteraction((previous) => {
      const next = stepBackNexoraMVPObjectInteraction(previous);
      setApplication((app) => applyInteractionToApplication(app, next));
      return next;
    });
  }, []);

  const onSelectSubject = useCallback((subjectId: string | null) => {
    setInteraction((previous) => {
      const next = selectNexoraMVPInteractionSubject(previous, subjectId);
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
        const result = applyNexoraMVPFlowDomainAction(pending, request);
        if (!result.ok) {
          return failNexoraMVPFlowPendingAction(result.state, result.message);
        }
        return result.state;
      });
      return true;
    },
    [interaction.focusedSubject?.id, interaction.selectedSubject?.id],
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
      if (interaction.mode !== "overview") {
        onStepBack();
        return;
      }
      if (explorerKind != null) {
        setActiveNav("Home");
      }
    };
    globalThis.addEventListener("keydown", onKeyDown);
    return () => globalThis.removeEventListener("keydown", onKeyDown);
  }, [explorerKind, floatingKind, interaction.mode, onStepBack]);

  const explorerContent =
    explorerKind === "journal" ? (
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
          title={explorerKind ? explorerTitle(explorerKind) : "Explorer"}
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
              onStepBack={onStepBack}
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
