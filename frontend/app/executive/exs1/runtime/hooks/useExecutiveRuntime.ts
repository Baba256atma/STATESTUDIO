"use client";

import { useCallback, useMemo } from "react";
import { filterSources } from "../../data/ExecutiveDataConfig";
import { getExecutiveModeConfig } from "../../mode/ExecutiveModeConfig";
import { sortScenarios } from "../../scenario/ScenarioConfig";
import { createExecutiveRuntimeStoreDecisionAdapter } from "@/app/lib/conversational-control/executiveDecisionRuntimeAdapter";
import {
  useExecutiveRuntimeState,
  useExecutiveRuntimeStoreApi,
} from "../ExecutiveRuntimeProvider";

/**
 * Full Runtime access — state snapshot + actions + event log.
 */
export function useExecutiveRuntime() {
  const store = useExecutiveRuntimeStoreApi();
  const state = useExecutiveRuntimeState((s) => s);
  return {
    state,
    actions: store.actions,
    events: state.events,
    emit: store.emit,
    getEventLog: store.getEventLog,
  };
}

export function useRuntimeMode() {
  const store = useExecutiveRuntimeStoreApi();
  const mode = useExecutiveRuntimeState((s) => s.mode);
  return {
    activeMode: mode.activeMode,
    previousMode: mode.previousMode,
    transitionState: mode.transitionState,
    config: getExecutiveModeConfig(mode.activeMode),
    setActiveMode: store.actions.setActiveMode,
  };
}

export function useRuntimeTimeline() {
  const store = useExecutiveRuntimeStoreApi();
  const timeline = useExecutiveRuntimeState((s) => s.timeline);
  const timelineHighlighted = useExecutiveRuntimeState(
    (s) => s.shell.timelineHighlighted,
  );
  return {
    lens: timeline.lens,
    position: timeline.position,
    timelineHighlighted,
    selectLens: store.actions.selectLens,
    setTimelinePosition: store.actions.setTimelinePosition,
  };
}

export function useRuntimePack() {
  const store = useExecutiveRuntimeStoreApi();
  const pack = useExecutiveRuntimeState((s) => s.pack);
  return {
    selectedPackId: pack.selectedPackId,
    packHighlighted: pack.packHighlighted,
    selectPack: store.actions.selectPack,
  };
}

export function useRuntimeSelection() {
  const store = useExecutiveRuntimeStoreApi();
  const selection = useExecutiveRuntimeState((s) => s.selection);
  return {
    selection: selection.selection,
    selectedObjectId: selection.selectedObjectId,
    selectObject: store.actions.selectObject,
  };
}

export function useRuntimeExplorer() {
  const store = useExecutiveRuntimeStoreApi();
  const explorer = useExecutiveRuntimeState((s) => s.explorer);
  return {
    nav: explorer.nav,
    width: explorer.width,
    visible: explorer.visible,
    setNav: store.actions.setNav,
    setExplorerWidth: store.actions.setExplorerWidth,
    closeExplorer: store.actions.closeExplorer,
  };
}

export function useRuntimeShell() {
  const store = useExecutiveRuntimeStoreApi();
  const shell = useExecutiveRuntimeState((s) => s.shell);
  return {
    theme: shell.theme,
    advisorTab: shell.advisorTab,
    floatingKind: shell.floatingKind,
    setTheme: store.actions.setTheme,
    setAdvisorTab: store.actions.setAdvisorTab,
    setFloatingKind: store.actions.setFloatingKind,
  };
}

export function useRuntimeScenario() {
  const store = useExecutiveRuntimeStoreApi();
  const scenario = useExecutiveRuntimeState((s) => s.scenario);
  const a = store.actions;

  const rankedScenarios = useMemo(
    () => sortScenarios(scenario.scenarios, scenario.rankSort),
    [scenario.scenarios, scenario.rankSort],
  );

  const currentScenario = useMemo(
    () =>
      scenario.scenarios.find((s) => s.id === scenario.currentScenarioId) ??
      null,
    [scenario.scenarios, scenario.currentScenarioId],
  );

  const activeObjectIds = useMemo(() => {
    if (scenario.compareIds.length >= 2) {
      const ids = new Set<string>();
      for (const id of scenario.compareIds) {
        const item = scenario.scenarios.find((s) => s.id === id);
        item?.objectIds.forEach((oid) => ids.add(oid));
      }
      return Array.from(ids);
    }
    return currentScenario?.objectIds ?? [];
  }, [scenario.compareIds, scenario.scenarios, currentScenario]);

  return {
    scenarios: scenario.scenarios,
    currentScenarioId: scenario.currentScenarioId,
    favoriteId: scenario.favoriteId,
    compareIds: scenario.compareIds,
    rankSort: scenario.rankSort,
    rankedScenarios,
    explorerCollapsed: scenario.explorerCollapsed,
    explorerWidth: scenario.explorerWidth,
    showComparison: scenario.showComparison,
    showRanking: scenario.showRanking,
    activeObjectIds,
    currentScenario,
    setCurrentScenario: a.setCurrentScenario,
    toggleCompare: a.toggleCompare,
    clearCompare: a.clearCompare,
    setFavorite: a.setFavorite,
    setRankSort: a.setRankSort,
    setExplorerCollapsed: a.setScenarioExplorerCollapsed,
    setExplorerWidth: a.setScenarioExplorerWidth,
    setShowComparison: a.setShowComparison,
    setShowRanking: a.setShowRanking,
    addScenario: a.addScenario,
    renameScenario: a.renameScenario,
    removeScenario: a.removeScenario,
    combineScenarios: a.combineScenarios,
  };
}

export function useRuntimeDecision() {
  const store = useExecutiveRuntimeStoreApi();
  const decision = useExecutiveRuntimeState((s) => s.decision);
  const a = store.actions;
  const adapter = useMemo(
    () => createExecutiveRuntimeStoreDecisionAdapter(store),
    [store],
  );
  const currentDecision = useMemo(
    () =>
      decision.decisions.find((d) => d.id === decision.currentDecisionId) ??
      null,
    [decision.decisions, decision.currentDecisionId],
  );

  const approve = useCallback(
    (id: string) => {
      const target =
        decision.decisions.find((d) => d.id === id) ?? currentDecision;
      adapter.transitionDecision({
        decisionId: id,
        action: "approve",
        title: target?.name ?? "Decision",
      });
    },
    [adapter, currentDecision, decision.decisions],
  );

  const reject = useCallback(
    (id: string) => {
      const target =
        decision.decisions.find((d) => d.id === id) ?? currentDecision;
      adapter.transitionDecision({
        decisionId: id,
        action: "reject",
        title: target?.name ?? "Decision",
      });
    },
    [adapter, currentDecision, decision.decisions],
  );

  const returnForAnalysis = useCallback(
    (id: string) => {
      const target =
        decision.decisions.find((d) => d.id === id) ?? currentDecision;
      adapter.transitionDecision({
        decisionId: id,
        action: "reconsider",
        title: target?.name ?? "Decision",
      });
    },
    [adapter, currentDecision, decision.decisions],
  );

  const archive = useCallback(
    (id: string) => {
      const target =
        decision.decisions.find((d) => d.id === id) ?? currentDecision;
      adapter.transitionDecision({
        decisionId: id,
        action: "archive",
        title: target?.name ?? "Decision",
      });
    },
    [adapter, currentDecision, decision.decisions],
  );

  const setStatus = useCallback(
    (
      id: string,
      status:
        | "Draft"
        | "Under Review"
        | "Approved"
        | "Rejected"
        | "Archived",
    ) => {
      const target =
        decision.decisions.find((d) => d.id === id) ?? currentDecision;
      const action =
        status === "Approved"
          ? ("approve" as const)
          : status === "Rejected"
            ? ("reject" as const)
            : status === "Archived"
              ? ("archive" as const)
              : status === "Under Review"
                ? ("reconsider" as const)
                : ("create" as const);
      adapter.transitionDecision({
        decisionId: id,
        action,
        title: target?.name ?? "Decision",
      });
    },
    [adapter, currentDecision, decision.decisions],
  );

  return {
    decisions: decision.decisions,
    currentDecisionId: decision.currentDecisionId,
    currentDecision,
    journalEntries: decision.journalEntries,
    decisionPacks: decision.decisionPacks,
    previewOpen: decision.previewOpen,
    panelCollapsed: decision.panelCollapsed,
    panelWidth: decision.panelWidth,
    decisionRuntime: adapter,
    setCurrentDecision: a.setCurrentDecision,
    setPreviewOpen: a.setDecisionPreviewOpen,
    setPanelCollapsed: a.setDecisionPanelCollapsed,
    setPanelWidth: a.setDecisionPanelWidth,
    setStatus,
    approve,
    reject,
    returnForAnalysis,
    duplicate: a.duplicateDecision,
    combineFromScenarios: a.combineDecisionsFromScenarios,
    createFromScenario: a.createDecisionFromScenario,
    createManual: a.createManualDecision,
    archive,
  };
}

export function useRuntimeExecution() {
  const store = useExecutiveRuntimeStoreApi();
  const execution = useExecutiveRuntimeState((s) => s.execution);
  const a = store.actions;
  const selectedTask = useMemo(
    () =>
      execution.plan.tasks.find((t) => t.id === execution.selectedTaskId) ??
      null,
    [execution.plan.tasks, execution.selectedTaskId],
  );
  return {
    plan: execution.plan,
    tasks: execution.plan.tasks,
    selectedTaskId: execution.selectedTaskId,
    selectedTask,
    filter: execution.filter,
    journalEntries: execution.journalEntries,
    executionPacks: execution.executionPacks,
    panelCollapsed: execution.panelCollapsed,
    panelWidth: execution.panelWidth,
    started: execution.started,
    notes: execution.notes,
    setSelectedTask: a.setSelectedTask,
    setFilter: a.setExecutionFilter,
    setPanelCollapsed: a.setExecutionPanelCollapsed,
    setPanelWidth: a.setExecutionPanelWidth,
    startExecution: a.startExecution,
    pauseExecution: a.pauseExecution,
    resumeExecution: a.resumeExecution,
    completeExecution: a.completeExecution,
    cancelExecution: a.cancelExecution,
    setTaskStatus: a.setTaskStatus,
    assignOwner: a.assignTaskOwner,
    addTask: a.addExecutionTask,
    setNotes: a.setExecutionNotes,
  };
}

export function useRuntimeMonitoring() {
  const store = useExecutiveRuntimeStoreApi();
  const monitoring = useExecutiveRuntimeState((s) => s.monitoring);
  const a = store.actions;
  return {
    executiveHealth: monitoring.executiveHealth,
    kpis: monitoring.kpis,
    alerts: monitoring.alerts,
    objectHealth: monitoring.objectHealth,
    summary: monitoring.summary,
    filter: monitoring.filter,
    compareOpen: monitoring.compareOpen,
    notes: monitoring.notes,
    panelCollapsed: monitoring.panelCollapsed,
    panelWidth: monitoring.panelWidth,
    snapshots: monitoring.snapshots,
    journalEntries: monitoring.journalEntries,
    monitoringPacks: monitoring.monitoringPacks,
    setFilter: a.setMonitoringFilter,
    setCompareOpen: a.setMonitoringCompareOpen,
    setNotes: a.setMonitoringNotes,
    setPanelCollapsed: a.setMonitoringPanelCollapsed,
    setPanelWidth: a.setMonitoringPanelWidth,
    createSnapshot: a.createMonitoringSnapshot,
    refresh: a.refreshMonitoring,
  };
}

export function useRuntimeData() {
  const store = useExecutiveRuntimeStoreApi();
  const data = useExecutiveRuntimeState((s) => s.data);
  const a = store.actions;

  const selectedSource = useMemo(
    () => data.sources.find((s) => s.id === data.selectedSourceId) ?? null,
    [data.sources, data.selectedSourceId],
  );

  const visibleSources = useMemo(
    () => filterSources(data.sources, data.filter, data.query),
    [data.sources, data.filter, data.query],
  );

  const selectedMappings = useMemo(
    () =>
      data.mappings.filter((m) =>
        data.selectedSourceId ? m.sourceId === data.selectedSourceId : true,
      ),
    [data.mappings, data.selectedSourceId],
  );

  const connectedCount = data.sources.filter(
    (s) => s.status === "Connected",
  ).length;
  const warningCount = data.sources.filter(
    (s) => s.status === "Warning" || s.health === "Warning",
  ).length;

  return {
    experienceActive: data.experienceActive,
    setExperienceActive: a.setDataExperienceActive,
    section: data.section,
    setSection: a.setDataSection,
    sources: data.sources,
    mappings: data.mappings,
    history: data.history,
    selectedSourceId: data.selectedSourceId,
    selectedSource,
    filter: data.filter,
    query: data.query,
    wizardStep: data.wizardStep,
    wizardCategory: data.wizardCategory,
    wizardName: data.wizardName,
    journalEntries: data.journalEntries,
    dataPacks: data.dataPacks,
    setSelectedSource: a.setSelectedSource,
    setFilter: a.setDataFilter,
    setQuery: a.setDataQuery,
    setWizardStep: a.setWizardStep,
    setWizardCategory: a.setWizardCategory,
    setWizardName: a.setWizardName,
    resetWizard: a.resetWizard,
    finishWizard: a.finishDataWizard,
    updateMappingStatus: a.updateMappingStatus,
    assignMappingObject: a.assignMappingObject,
    refresh: a.refreshData,
    disconnectSelected: a.disconnectSelectedSource,
    isActive: data.experienceActive,
    visibleSources,
    selectedMappings,
    connectedCount,
    warningCount,
  };
}
