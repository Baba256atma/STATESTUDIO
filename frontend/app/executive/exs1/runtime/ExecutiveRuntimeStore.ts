/**
 * Sprint 4 — Executive Runtime Store.
 * Single source of truth for Executive Cockpit experiences.
 * UI is a consumer + event publisher. No AI / backend / drivers.
 */

import type { Exs1ObjectId, Exs1Selection } from "../exs1Types";
import { EXS1_CONTEXT } from "../mock/exs1Mock";
import {
  INITIAL_DATA_HISTORY,
  INITIAL_DATA_MAPPINGS,
  INITIAL_DATA_SOURCES,
  createDataSource,
  toDataJournalEntry,
  toDataTimelinePack,
  type DataCatalogSection,
  type DataFilter,
  type DataHistoryEvent,
  type DataJournalEntry,
  type DataSourceCategory,
  type DataTimelinePack,
  type ExecutiveDataMapping,
  type ExecutiveDataSource,
  type MappingStatus,
  type WizardStep,
} from "../data/ExecutiveDataConfig";
import {
  INITIAL_DECISIONS,
  createDecisionFromScenarios,
  createManualDecision,
  toDecisionTimelinePack,
  toJournalEntry,
  type DecisionJournalEntry,
  type DecisionStatus,
  type DecisionTimelinePack,
  type ExecutiveDecision,
} from "../decision/ExecutiveDecisionConfig";
import {
  INITIAL_EXECUTION_PLAN,
  toExecutionJournalEntry,
  toExecutionTimelinePack,
  type ExecutionFilter,
  type ExecutionJournalEntry,
  type ExecutionPlan,
  type ExecutionRunStatus,
  type ExecutionTask,
  type ExecutionTimelinePack,
  type TaskStatus,
} from "../execution/ExecutionConfig";
import {
  INITIAL_EXECUTIVE_HEALTH,
  INITIAL_MONITORING_ALERTS,
  INITIAL_MONITORING_KPIS,
  INITIAL_MONITORING_SUMMARY,
  INITIAL_OBJECT_HEALTH,
  createMonitoringSnapshot,
  toMonitoringJournalEntry,
  toMonitoringTimelinePack,
  type ExecutiveHealthState,
  type MonitoringAlert,
  type MonitoringFilter,
  type MonitoringJournalEntry,
  type MonitoringKpi,
  type MonitoringObjectHealth,
  type MonitoringSnapshotRecord,
  type MonitoringTimelinePack,
} from "../monitoring/ExecutiveMonitoringConfig";
import {
  EXECUTIVE_MODE_TRANSITION_MS,
  type ExecutiveModeTransitionState,
} from "../mode/ExecutiveModeConfig";
import {
  INITIAL_SCENARIOS,
  createCombinedScenario,
  createMockScenario,
  type ExecutiveScenario,
  type ScenarioRankSort,
} from "../scenario/ScenarioConfig";
import type {
  ExecutiveAdvisorTab,
  ExecutiveFloatingPanelKind,
  ExecutiveModeId,
  ExecutiveNavId,
  ExecutiveThemeMode,
  ExecutiveTimelineLens,
} from "../shell/executiveCockpitTypes";
import { cockpit } from "../shell/executiveCockpitTheme";
import {
  RUNTIME_EVENT_LOG_LIMIT,
  createRuntimeEvent,
  type ExecutiveRuntimeEvent,
  type ExecutiveRuntimeEventType,
} from "./ExecutiveRuntimeEvents";

export type ExecutiveRuntimeModeSlice = {
  activeMode: ExecutiveModeId;
  previousMode: ExecutiveModeId | null;
  transitionState: ExecutiveModeTransitionState;
};

export type ExecutiveRuntimeTimelineSlice = {
  lens: ExecutiveTimelineLens;
  /** Mock position 0–100; Replay updates Runtime only. */
  position: number;
};

export type ExecutiveRuntimePackSlice = {
  selectedPackId: string | null;
  packHighlighted: boolean;
};

export type ExecutiveRuntimeSelectionSlice = {
  selection: Exs1Selection;
  selectedObjectId: Exs1ObjectId | null;
};

export type ExecutiveRuntimeExplorerSlice = {
  nav: ExecutiveNavId;
  width: number;
  visible: boolean;
};

export type ExecutiveRuntimeShellSlice = {
  theme: ExecutiveThemeMode;
  advisorTab: ExecutiveAdvisorTab;
  floatingKind: ExecutiveFloatingPanelKind;
  timelineHighlighted: boolean;
};

export type ExecutiveRuntimeScenarioSlice = {
  scenarios: ExecutiveScenario[];
  currentScenarioId: string | null;
  favoriteId: string | null;
  compareIds: string[];
  rankSort: ScenarioRankSort;
  explorerCollapsed: boolean;
  explorerWidth: number;
  showComparison: boolean;
  showRanking: boolean;
};

export type ExecutiveRuntimeDecisionSlice = {
  decisions: ExecutiveDecision[];
  currentDecisionId: string | null;
  journalEntries: DecisionJournalEntry[];
  decisionPacks: DecisionTimelinePack[];
  previewOpen: boolean;
  panelCollapsed: boolean;
  panelWidth: number;
};

export type ExecutiveRuntimeExecutionSlice = {
  plan: ExecutionPlan;
  selectedTaskId: string | null;
  filter: ExecutionFilter;
  journalEntries: ExecutionJournalEntry[];
  executionPacks: ExecutionTimelinePack[];
  panelCollapsed: boolean;
  panelWidth: number;
  started: boolean;
  notes: string;
};

export type ExecutiveRuntimeMonitoringSlice = {
  executiveHealth: ExecutiveHealthState;
  kpis: MonitoringKpi[];
  alerts: MonitoringAlert[];
  objectHealth: MonitoringObjectHealth[];
  summary: string;
  filter: MonitoringFilter;
  compareOpen: boolean;
  notes: string;
  panelCollapsed: boolean;
  panelWidth: number;
  snapshots: MonitoringSnapshotRecord[];
  journalEntries: MonitoringJournalEntry[];
  monitoringPacks: MonitoringTimelinePack[];
  refreshTick: number;
};

export type ExecutiveRuntimeDataSlice = {
  experienceActive: boolean;
  section: DataCatalogSection;
  sources: ExecutiveDataSource[];
  mappings: ExecutiveDataMapping[];
  history: DataHistoryEvent[];
  selectedSourceId: string | null;
  filter: DataFilter;
  query: string;
  wizardStep: WizardStep;
  wizardCategory: DataSourceCategory;
  wizardName: string;
  journalEntries: DataJournalEntry[];
  dataPacks: DataTimelinePack[];
  refreshTick: number;
};

export type ExecutiveRuntimeState = {
  mode: ExecutiveRuntimeModeSlice;
  timeline: ExecutiveRuntimeTimelineSlice;
  pack: ExecutiveRuntimePackSlice;
  selection: ExecutiveRuntimeSelectionSlice;
  explorer: ExecutiveRuntimeExplorerSlice;
  shell: ExecutiveRuntimeShellSlice;
  scenario: ExecutiveRuntimeScenarioSlice;
  decision: ExecutiveRuntimeDecisionSlice;
  execution: ExecutiveRuntimeExecutionSlice;
  monitoring: ExecutiveRuntimeMonitoringSlice;
  data: ExecutiveRuntimeDataSlice;
  events: ExecutiveRuntimeEvent[];
};

export type CreateExecutiveRuntimeStoreOptions = {
  readonly initialMode?: ExecutiveModeId;
};

export type ExecutiveRuntimeStore = {
  readonly getState: () => ExecutiveRuntimeState;
  readonly subscribe: (listener: () => void) => () => void;
  readonly getEventLog: () => readonly ExecutiveRuntimeEvent[];
  readonly emit: (
    type: ExecutiveRuntimeEventType,
    payload?: unknown,
  ) => void;
  readonly actions: ExecutiveRuntimeActions;
};

export type ExecutiveRuntimeActions = ReturnType<typeof createActions>;

function cloneExecutionPlan(): ExecutionPlan {
  return {
    ...INITIAL_EXECUTION_PLAN,
    tasks: INITIAL_EXECUTION_PLAN.tasks.map((t) => ({
      ...t,
      dependsOn: [...t.dependsOn],
    })),
  };
}

export function createInitialRuntimeState(
  options?: CreateExecutiveRuntimeStoreOptions,
): ExecutiveRuntimeState {
  const initialMode = options?.initialMode ?? "Problem";
  return {
    mode: {
      activeMode: initialMode,
      previousMode: null,
      transitionState: "idle",
    },
    timeline: {
      lens: EXS1_CONTEXT.lens,
      position: 42,
    },
    pack: {
      selectedPackId: "production-delay",
      packHighlighted: true,
    },
    selection: {
      selection: { kind: "welcome" },
      selectedObjectId: null,
    },
    explorer: {
      nav: "Home",
      width: cockpit.drawerDefault,
      visible: false,
    },
    shell: {
      theme: "night",
      advisorTab: "Assist",
      floatingKind: null,
      timelineHighlighted: false,
    },
    scenario: {
      scenarios: [...INITIAL_SCENARIOS],
      currentScenarioId: "scenario-a",
      favoriteId: null,
      compareIds: [],
      rankSort: "balanced",
      explorerCollapsed: false,
      explorerWidth: 300,
      showComparison: false,
      showRanking: false,
    },
    decision: {
      decisions: [...INITIAL_DECISIONS],
      currentDecisionId: "decision-a",
      journalEntries: [],
      decisionPacks: [],
      previewOpen: false,
      panelCollapsed: false,
      panelWidth: 300,
    },
    execution: {
      plan: cloneExecutionPlan(),
      selectedTaskId: "task-install-equipment",
      filter: "All",
      journalEntries: [],
      executionPacks: [],
      panelCollapsed: false,
      panelWidth: 320,
      started: false,
      notes: "Focus blocked install path before training can begin.",
    },
    monitoring: {
      executiveHealth: INITIAL_EXECUTIVE_HEALTH,
      kpis: [...INITIAL_MONITORING_KPIS],
      alerts: [...INITIAL_MONITORING_ALERTS],
      objectHealth: [...INITIAL_OBJECT_HEALTH],
      summary: INITIAL_MONITORING_SUMMARY,
      filter: "All",
      compareOpen: false,
      notes:
        "Watch Inventory Critical path before declaring Capacity Expansion successful.",
      panelCollapsed: false,
      panelWidth: 320,
      snapshots: [],
      journalEntries: [],
      monitoringPacks: [],
      refreshTick: 0,
    },
    data: {
      experienceActive: false,
      section: "Sources",
      sources: [...INITIAL_DATA_SOURCES],
      mappings: [...INITIAL_DATA_MAPPINGS],
      history: [...INITIAL_DATA_HISTORY],
      selectedSourceId: "source-sales-csv",
      filter: "All",
      query: "",
      wizardStep: "type",
      wizardCategory: "CSV",
      wizardName: "new-dataset.csv",
      journalEntries: [],
      dataPacks: [],
      refreshTick: 0,
    },
    events: [],
  };
}

function createActions(api: {
  getState: () => ExecutiveRuntimeState;
  patch: (fn: (state: ExecutiveRuntimeState) => ExecutiveRuntimeState) => void;
  emit: (type: ExecutiveRuntimeEventType, payload?: unknown) => void;
  scheduleModeTransition: (mode: ExecutiveModeId) => void;
}) {
  const { getState, patch, emit, scheduleModeTransition } = api;

  return {
    setActiveMode(mode: ExecutiveModeId) {
      if (getState().mode.activeMode === mode) return;
      scheduleModeTransition(mode);
      emit("ModeChanged", { mode });
    },

    setTheme(theme: ExecutiveThemeMode) {
      patch((s) => ({ ...s, shell: { ...s.shell, theme } }));
      emit("ThemeChanged", { theme });
    },

    setAdvisorTab(advisorTab: ExecutiveAdvisorTab) {
      patch((s) => ({ ...s, shell: { ...s.shell, advisorTab } }));
      emit("AdvisorTabChanged", { advisorTab });
    },

    setFloatingKind(floatingKind: ExecutiveFloatingPanelKind) {
      patch((s) => ({ ...s, shell: { ...s.shell, floatingKind } }));
      emit("FloatingPanelChanged", { floatingKind });
    },

    setNav(nav: ExecutiveNavId) {
      const visible = nav !== "Home";
      patch((s) => ({
        ...s,
        explorer: { ...s.explorer, nav, visible },
        data: {
          ...s.data,
          experienceActive: nav === "Data",
        },
      }));
      emit("ExplorerChanged", { nav, visible });
    },

    setExplorerWidth(width: number) {
      const next = Math.min(
        cockpit.drawerMax,
        Math.max(cockpit.drawerMin, Number.isFinite(width) ? width : cockpit.drawerDefault),
      );
      patch((s) => ({
        ...s,
        explorer: { ...s.explorer, width: next },
      }));
      emit("ExplorerChanged", { width: next });
    },

    closeExplorer() {
      patch((s) => ({
        ...s,
        explorer: { ...s.explorer, nav: "Home", visible: false },
        data: { ...s.data, experienceActive: false },
      }));
      emit("ExplorerChanged", { nav: "Home", visible: false });
    },

    selectObject(objectId: Exs1ObjectId) {
      patch((s) => ({
        ...s,
        selection: {
          selection: { kind: "object", objectId },
          selectedObjectId: objectId,
        },
        pack: { ...s.pack, packHighlighted: true },
        shell: { ...s.shell, advisorTab: "Assist" },
      }));
      emit("ObjectSelected", { objectId });
    },

    selectPack(
      packId: string,
      options?: { readonly timelineLens?: ExecutiveTimelineLens },
    ) {
      patch((s) => ({
        ...s,
        pack: {
          selectedPackId: packId,
          packHighlighted: true,
        },
        selection: {
          ...s.selection,
          selection: { kind: "pack", packId },
        },
        timeline: options?.timelineLens
          ? {
              ...s.timeline,
              lens: options.timelineLens,
            }
          : s.timeline,
        shell: {
          ...s.shell,
          advisorTab: "Assist",
          timelineHighlighted: Boolean(options?.timelineLens),
        },
      }));
      emit("PackSelected", { packId, movedTimeline: Boolean(options?.timelineLens) });
    },

    selectLens(lens: ExecutiveTimelineLens) {
      patch((s) => ({
        ...s,
        timeline: { ...s.timeline, lens },
        selection: {
          ...s.selection,
          selection: { kind: "timeline", lens },
        },
        shell: { ...s.shell, timelineHighlighted: true },
      }));
      emit("TimelineMoved", { lens, position: getState().timeline.position });
    },

    setTimelinePosition(position: number) {
      const next = Math.min(100, Math.max(0, position));
      patch((s) => ({
        ...s,
        timeline: { ...s.timeline, position: next },
      }));
      emit("TimelineMoved", { position: next, lens: getState().timeline.lens });
    },

    // —— Scenario ——
    setCurrentScenario(id: string) {
      patch((s) => ({
        ...s,
        scenario: { ...s.scenario, currentScenarioId: id },
      }));
      emit("ScenarioSelected", { id });
    },
    toggleCompare(id: string) {
      patch((s) => {
        const prev = s.scenario.compareIds;
        const compareIds = prev.includes(id)
          ? prev.filter((x) => x !== id)
          : prev.length >= 2
            ? [prev[1]!, id]
            : [...prev, id];
        return { ...s, scenario: { ...s.scenario, compareIds } };
      });
      emit("ScenarioUpdated", { compare: true });
    },
    clearCompare() {
      patch((s) => ({
        ...s,
        scenario: { ...s.scenario, compareIds: [] },
      }));
      emit("ScenarioUpdated", { compareCleared: true });
    },
    setFavorite(id: string) {
      patch((s) => ({
        ...s,
        scenario: {
          ...s.scenario,
          favoriteId: s.scenario.favoriteId === id ? null : id,
        },
      }));
      emit("ScenarioUpdated", { favoriteId: id });
    },
    setRankSort(rankSort: ScenarioRankSort) {
      patch((s) => ({ ...s, scenario: { ...s.scenario, rankSort } }));
      emit("ScenarioUpdated", { rankSort });
    },
    setScenarioExplorerCollapsed(explorerCollapsed: boolean) {
      patch((s) => ({ ...s, scenario: { ...s.scenario, explorerCollapsed } }));
    },
    setScenarioExplorerWidth(explorerWidth: number) {
      patch((s) => ({ ...s, scenario: { ...s.scenario, explorerWidth } }));
    },
    setShowComparison(showComparison: boolean) {
      patch((s) => ({ ...s, scenario: { ...s.scenario, showComparison } }));
    },
    setShowRanking(showRanking: boolean) {
      patch((s) => ({ ...s, scenario: { ...s.scenario, showRanking } }));
    },
    addScenario(input: {
      name: string;
      description: string;
      color: string;
      cloneFromId?: string | null;
    }) {
      patch((s) => {
        const clone = input.cloneFromId
          ? (s.scenario.scenarios.find((x) => x.id === input.cloneFromId) ??
            null)
          : null;
        const next = createMockScenario({
          name: input.name,
          description: input.description,
          color: input.color,
          cloneFrom: clone,
        });
        return {
          ...s,
          scenario: {
            ...s.scenario,
            scenarios: [...s.scenario.scenarios, next],
            currentScenarioId: next.id,
          },
        };
      });
      emit("ScenarioUpdated", { added: true });
    },
    renameScenario(id: string, name: string) {
      patch((s) => ({
        ...s,
        scenario: {
          ...s.scenario,
          scenarios: s.scenario.scenarios.map((x) =>
            x.id === id ? { ...x, name } : x,
          ),
        },
      }));
      emit("ScenarioUpdated", { renamed: id });
    },
    removeScenario(id: string) {
      patch((s) => {
        const scenarios = s.scenario.scenarios.filter((x) => x.id !== id);
        if (scenarios.length === 0) return s;
        return {
          ...s,
          scenario: {
            ...s.scenario,
            scenarios,
            currentScenarioId:
              s.scenario.currentScenarioId === id
                ? "scenario-a"
                : s.scenario.currentScenarioId,
            favoriteId:
              s.scenario.favoriteId === id ? null : s.scenario.favoriteId,
            compareIds: s.scenario.compareIds.filter((x) => x !== id),
          },
        };
      });
      emit("ScenarioUpdated", { removed: id });
    },
    combineScenarios(aId: string, bId: string) {
      patch((s) => {
        const a = s.scenario.scenarios.find((x) => x.id === aId);
        const b = s.scenario.scenarios.find((x) => x.id === bId);
        if (!a || !b) return s;
        const combined = createCombinedScenario(a, b);
        return {
          ...s,
          scenario: {
            ...s.scenario,
            scenarios: [...s.scenario.scenarios, combined],
            currentScenarioId: combined.id,
            compareIds: [],
          },
        };
      });
      emit("ScenarioUpdated", { combined: true });
    },

    // —— Decision ——
    setCurrentDecision(id: string) {
      patch((s) => ({
        ...s,
        decision: { ...s.decision, currentDecisionId: id },
      }));
      emit("DecisionSelected", { id });
    },
    setDecisionPreviewOpen(previewOpen: boolean) {
      patch((s) => ({ ...s, decision: { ...s.decision, previewOpen } }));
    },
    setDecisionPanelCollapsed(panelCollapsed: boolean) {
      patch((s) => ({ ...s, decision: { ...s.decision, panelCollapsed } }));
    },
    setDecisionPanelWidth(panelWidth: number) {
      patch((s) => ({ ...s, decision: { ...s.decision, panelWidth } }));
    },
    setDecisionStatus(id: string, status: DecisionStatus) {
      patch((s) => ({
        ...s,
        decision: {
          ...s.decision,
          decisions: s.decision.decisions.map((d) =>
            d.id === id
              ? { ...d, status, locked: status === "Approved" }
              : d,
          ),
        },
      }));
      emit("DecisionUpdated", { id, status });
    },
    approveDecision(id: string) {
      patch((s) => {
        const target = s.decision.decisions.find((d) => d.id === id);
        if (!target) return s;
        const approved: ExecutiveDecision = {
          ...target,
          status: "Approved",
          locked: true,
        };
        const journal = toJournalEntry(approved);
        const pack = toDecisionTimelinePack(approved);
        const journalEntries = s.decision.journalEntries.some(
          (e) => e.decisionId === id,
        )
          ? s.decision.journalEntries.map((e) =>
              e.decisionId === id ? { ...journal, id: e.id } : e,
            )
          : [...s.decision.journalEntries, journal];
        const decisionPacks = s.decision.decisionPacks.some(
          (p) => p.decisionId === id,
        )
          ? s.decision.decisionPacks.map((p) =>
              p.decisionId === id ? pack : p,
            )
          : [...s.decision.decisionPacks, pack];
        return {
          ...s,
          decision: {
            ...s.decision,
            currentDecisionId: id,
            decisions: s.decision.decisions.map((d) =>
              d.id === id ? approved : d,
            ),
            journalEntries,
            decisionPacks,
          },
        };
      });
      emit("DecisionApproved", { id });
    },
    rejectDecision(id: string) {
      patch((s) => ({
        ...s,
        decision: {
          ...s.decision,
          decisions: s.decision.decisions.map((d) =>
            d.id === id
              ? { ...d, status: "Rejected" as const, locked: false }
              : d,
          ),
        },
      }));
      emit("DecisionUpdated", { id, status: "Rejected" });
    },
    returnDecisionForAnalysis(id: string) {
      patch((s) => ({
        ...s,
        decision: {
          ...s.decision,
          decisions: s.decision.decisions.map((d) =>
            d.id === id
              ? { ...d, status: "Under Review" as const, locked: false }
              : d,
          ),
        },
      }));
      emit("DecisionUpdated", { id, status: "Under Review" });
    },
    archiveDecision(id: string) {
      patch((s) => ({
        ...s,
        decision: {
          ...s.decision,
          decisions: s.decision.decisions.map((d) =>
            d.id === id
              ? { ...d, status: "Archived" as const, locked: false }
              : d,
          ),
        },
      }));
      emit("DecisionUpdated", { id, status: "Archived" });
    },
    duplicateDecision(id: string) {
      patch((s) => {
        const source = s.decision.decisions.find((d) => d.id === id);
        if (!source) return s;
        const copy: ExecutiveDecision = {
          ...source,
          id: `decision-${Date.now().toString(36)}`,
          name: `${source.name} · Copy`,
          status: "Draft",
          locked: false,
          createdDate: new Date().toISOString().slice(0, 10),
        };
        return {
          ...s,
          decision: {
            ...s.decision,
            decisions: [...s.decision.decisions, copy],
            currentDecisionId: copy.id,
          },
        };
      });
      emit("DecisionUpdated", { duplicated: id });
    },
    createDecisionFromScenario(scenarioId: string, label: string) {
      const next = createDecisionFromScenarios({
        name: `Decision · ${label}`,
        scenarioIds: [scenarioId],
        scenarioLabel: label,
        sourceKind: "single-scenario",
      });
      patch((s) => ({
        ...s,
        decision: {
          ...s.decision,
          decisions: [...s.decision.decisions, next],
          currentDecisionId: next.id,
        },
      }));
      emit("DecisionUpdated", { created: next.id });
    },
    combineDecisionsFromScenarios(
      scenarioIds: readonly string[],
      label: string,
    ) {
      const next = createDecisionFromScenarios({
        name: `Decision · ${label}`,
        scenarioIds,
        scenarioLabel: label,
        sourceKind: "scenario-combination",
      });
      patch((s) => ({
        ...s,
        decision: {
          ...s.decision,
          decisions: [...s.decision.decisions, next],
          currentDecisionId: next.id,
        },
      }));
      emit("DecisionUpdated", { created: next.id });
    },
    createManualDecision(name: string) {
      const next = createManualDecision(name);
      patch((s) => ({
        ...s,
        decision: {
          ...s.decision,
          decisions: [...s.decision.decisions, next],
          currentDecisionId: next.id,
        },
      }));
      emit("DecisionUpdated", { created: next.id });
    },

    // —— Execution ——
    setSelectedTask(id: string | null) {
      patch((s) => ({
        ...s,
        execution: { ...s.execution, selectedTaskId: id },
      }));
      emit("ExecutionUpdated", { selectedTaskId: id });
    },
    setExecutionFilter(filter: ExecutionFilter) {
      patch((s) => ({ ...s, execution: { ...s.execution, filter } }));
    },
    setExecutionPanelCollapsed(panelCollapsed: boolean) {
      patch((s) => ({ ...s, execution: { ...s.execution, panelCollapsed } }));
    },
    setExecutionPanelWidth(panelWidth: number) {
      patch((s) => ({ ...s, execution: { ...s.execution, panelWidth } }));
    },
    setExecutionNotes(notes: string) {
      patch((s) => ({ ...s, execution: { ...s.execution, notes } }));
    },
    setPlanStatus(status: ExecutionRunStatus) {
      patch((s) => ({
        ...s,
        execution: {
          ...s.execution,
          plan: { ...s.execution.plan, status },
        },
      }));
      emit("ExecutionUpdated", { status });
    },
    startExecution() {
      patch((s) => {
        const next: ExecutionPlan = {
          ...s.execution.plan,
          status: "Running",
        };
        const journal = toExecutionJournalEntry(next);
        const pack = toExecutionTimelinePack(next);
        const journalEntries = s.execution.journalEntries.some(
          (e) => e.planId === next.id,
        )
          ? s.execution.journalEntries.map((e) =>
              e.planId === next.id ? { ...journal, id: e.id } : e,
            )
          : [...s.execution.journalEntries, journal];
        const executionPacks = s.execution.executionPacks.some(
          (p) => p.planId === next.id,
        )
          ? s.execution.executionPacks.map((p) =>
              p.planId === next.id ? pack : p,
            )
          : [...s.execution.executionPacks, pack];
        return {
          ...s,
          execution: {
            ...s.execution,
            plan: next,
            started: true,
            journalEntries,
            executionPacks,
          },
        };
      });
      emit("ExecutionStarted", {});
    },
    pauseExecution() {
      patch((s) => ({
        ...s,
        execution: {
          ...s.execution,
          plan: { ...s.execution.plan, status: "Paused" },
        },
      }));
      emit("ExecutionUpdated", { status: "Paused" });
    },
    resumeExecution() {
      patch((s) => ({
        ...s,
        execution: {
          ...s.execution,
          plan: { ...s.execution.plan, status: "Running" },
        },
      }));
      emit("ExecutionUpdated", { status: "Running" });
    },
    completeExecution() {
      patch((s) => ({
        ...s,
        execution: {
          ...s.execution,
          plan: {
            ...s.execution.plan,
            status: "Completed",
            tasks: s.execution.plan.tasks.map((t) =>
              t.status === "Cancelled"
                ? t
                : {
                    ...t,
                    status: "Completed" as const,
                    progress: 100 as const,
                    health: "Completed" as const,
                  },
            ),
          },
        },
      }));
      emit("ExecutionUpdated", { status: "Completed" });
    },
    cancelExecution() {
      patch((s) => ({
        ...s,
        execution: {
          ...s.execution,
          plan: { ...s.execution.plan, status: "Cancelled" },
        },
      }));
      emit("ExecutionUpdated", { status: "Cancelled" });
    },
    setTaskStatus(taskId: string, status: TaskStatus) {
      patch((s) => ({
        ...s,
        execution: {
          ...s.execution,
          plan: {
            ...s.execution.plan,
            tasks: s.execution.plan.tasks.map((t) => {
              if (t.id !== taskId) return t;
              const health =
                status === "Blocked"
                  ? ("Blocked" as const)
                  : status === "Completed"
                    ? ("Completed" as const)
                    : status === "Waiting" || status === "In Progress"
                      ? ("Warning" as const)
                      : ("Healthy" as const);
              const progress =
                status === "Completed"
                  ? (100 as const)
                  : status === "Not Started"
                    ? (0 as const)
                    : t.progress;
              return { ...t, status, health, progress };
            }),
          },
        },
      }));
      emit("ExecutionUpdated", { taskId, status });
    },
    assignTaskOwner(taskId: string, owner: string) {
      patch((s) => ({
        ...s,
        execution: {
          ...s.execution,
          plan: {
            ...s.execution.plan,
            tasks: s.execution.plan.tasks.map((t) =>
              t.id === taskId
                ? { ...t, owner: owner.trim() || t.owner }
                : t,
            ),
          },
        },
      }));
      emit("ExecutionUpdated", { taskId, owner });
    },
    addExecutionTask(name: string, owner: string) {
      patch((s) => {
        const last = s.execution.plan.tasks[s.execution.plan.tasks.length - 1];
        const next: ExecutionTask = {
          id: `task-${Date.now().toString(36)}`,
          name: name.trim() || "New Task",
          owner: owner.trim() || "Operations",
          status: "Not Started",
          progress: 0,
          health: "Healthy",
          dependsOn: last ? [last.id] : [],
        };
        return {
          ...s,
          execution: {
            ...s.execution,
            plan: {
              ...s.execution.plan,
              tasks: [...s.execution.plan.tasks, next],
            },
          },
        };
      });
      emit("ExecutionUpdated", { addedTask: true });
    },

    // —— Monitoring ——
    setMonitoringFilter(filter: MonitoringFilter) {
      patch((s) => ({ ...s, monitoring: { ...s.monitoring, filter } }));
      emit("MonitoringUpdated", { filter });
    },
    setMonitoringCompareOpen(compareOpen: boolean) {
      patch((s) => ({ ...s, monitoring: { ...s.monitoring, compareOpen } }));
    },
    setMonitoringNotes(notes: string) {
      patch((s) => ({ ...s, monitoring: { ...s.monitoring, notes } }));
    },
    setMonitoringPanelCollapsed(panelCollapsed: boolean) {
      patch((s) => ({
        ...s,
        monitoring: { ...s.monitoring, panelCollapsed },
      }));
    },
    setMonitoringPanelWidth(panelWidth: number) {
      patch((s) => ({ ...s, monitoring: { ...s.monitoring, panelWidth } }));
    },
    createMonitoringSnapshot() {
      patch((s) => {
        const snapshot = createMonitoringSnapshot({
          executiveHealth: s.monitoring.executiveHealth,
          summary: s.monitoring.summary,
          alertCount: s.monitoring.alerts.length,
        });
        const journal = toMonitoringJournalEntry(snapshot);
        const pack = toMonitoringTimelinePack(snapshot);
        return {
          ...s,
          monitoring: {
            ...s.monitoring,
            snapshots: [...s.monitoring.snapshots, snapshot],
            journalEntries: [...s.monitoring.journalEntries, journal],
            monitoringPacks: [...s.monitoring.monitoringPacks, pack],
          },
        };
      });
      emit("SnapshotCreated", {});
    },
    refreshMonitoring() {
      patch((s) => ({
        ...s,
        monitoring: {
          ...s.monitoring,
          refreshTick: s.monitoring.refreshTick + 1,
        },
      }));
      emit("MonitoringUpdated", { refresh: true });
    },

    // —— Data ——
    setDataExperienceActive(experienceActive: boolean) {
      patch((s) => ({ ...s, data: { ...s.data, experienceActive } }));
      emit("DataUpdated", { experienceActive });
    },
    setDataSection(section: DataCatalogSection) {
      patch((s) => ({ ...s, data: { ...s.data, section } }));
    },
    setSelectedSource(id: string | null) {
      patch((s) => ({
        ...s,
        data: { ...s.data, selectedSourceId: id },
      }));
      emit("DataSourceSelected", { id });
    },
    setDataFilter(filter: DataFilter) {
      patch((s) => ({ ...s, data: { ...s.data, filter } }));
    },
    setDataQuery(query: string) {
      patch((s) => ({ ...s, data: { ...s.data, query } }));
    },
    setWizardStep(wizardStep: WizardStep) {
      patch((s) => ({ ...s, data: { ...s.data, wizardStep } }));
      emit("DataUpdated", { wizardStep });
    },
    setWizardCategory(wizardCategory: DataSourceCategory) {
      patch((s) => ({ ...s, data: { ...s.data, wizardCategory } }));
    },
    setWizardName(wizardName: string) {
      patch((s) => ({ ...s, data: { ...s.data, wizardName } }));
    },
    resetWizard() {
      patch((s) => ({
        ...s,
        data: {
          ...s.data,
          wizardStep: "type",
          wizardCategory: "CSV",
          wizardName: "new-dataset.csv",
        },
      }));
    },
    finishDataWizard() {
      const { wizardName, wizardCategory } = getState().data;
      const next = createDataSource({
        name: wizardName,
        category: wizardCategory,
      });
      const journal = toDataJournalEntry(next, 1);
      const pack = toDataTimelinePack(next);
      patch((s) => ({
        ...s,
        data: {
          ...s.data,
          sources: [next, ...s.data.sources],
          selectedSourceId: next.id,
          history: [
            {
              id: `hist-${Date.now().toString(36)}`,
              when: "Just now",
              title: "Source Added",
              summary: `${next.name} connected through Data Wizard (mock).`,
            },
            ...s.data.history,
          ],
          journalEntries: [...s.data.journalEntries, journal],
          dataPacks: [...s.data.dataPacks, pack],
          section: "Sources",
          wizardStep: "type",
          wizardCategory: "CSV",
          wizardName: "new-dataset.csv",
        },
      }));
      emit("DataUpdated", { sourceAdded: next.id });
    },
    /**
     * Phase C — Publish an Enterprise Connector source into the Data slice.
     * Emits DataUpdated with a published payload for Runtime Intelligence.
     */
    publishConnectorSource(payload: {
      source: ExecutiveDataSource;
      mappings: readonly ExecutiveDataMapping[];
      rowsImported: number;
      objectsUpdated: readonly string[];
    }) {
      const { source, mappings, rowsImported, objectsUpdated } = payload;
      const journal = {
        ...toDataJournalEntry(source, mappings.length),
        summary: `[Connector] ${source.name} · ${rowsImported} rows · ${objectsUpdated.join(", ") || "objects"} published`,
        mappingsSummary: `${mappings.length} fields mapped`,
      };
      const pack = toDataTimelinePack(source);
      patch((s) => ({
        ...s,
        data: {
          ...s.data,
          sources: [source, ...s.data.sources.filter((x) => x.id !== source.id)],
          mappings: [
            ...mappings,
            ...s.data.mappings.filter((m) => m.sourceId !== source.id),
          ],
          selectedSourceId: source.id,
          history: [
            {
              id: `hist-${Date.now().toString(36)}`,
              when: "Just now",
              title: "Connector Published",
              summary: `${source.name} published · ${rowsImported} rows imported.`,
            },
            ...s.data.history,
          ],
          journalEntries: [...s.data.journalEntries, journal],
          dataPacks: [...s.data.dataPacks.filter((p) => p.sourceId !== source.id), pack],
          section: "Sources",
          experienceActive: true,
        },
      }));
      emit("DataUpdated", {
        published: true,
        sourceId: source.id,
        sourceName: source.name,
        rowsImported,
        objectsUpdated,
        timestamp: Date.now(),
      });
      emit("DataSourceSelected", { id: source.id });
    },
    updateMappingStatus(id: string, status: MappingStatus) {
      patch((s) => ({
        ...s,
        data: {
          ...s.data,
          mappings: s.data.mappings.map((m) =>
            m.id === id ? { ...m, status } : m,
          ),
        },
      }));
      emit("DataUpdated", { mappingId: id, status });
    },
    assignMappingObject(
      id: string,
      objectLabel: string,
      objectId: ExecutiveDataMapping["objectId"],
    ) {
      patch((s) => ({
        ...s,
        data: {
          ...s.data,
          mappings: s.data.mappings.map((m) =>
            m.id === id
              ? {
                  ...m,
                  objectLabel,
                  objectId,
                  status: "Mapped" as const,
                }
              : m,
          ),
        },
      }));
      emit("DataUpdated", { mappingId: id, objectLabel });
    },
    refreshData() {
      patch((s) => ({
        ...s,
        data: { ...s.data, refreshTick: s.data.refreshTick + 1 },
      }));
      emit("DataUpdated", { refresh: true });
    },
    disconnectSelectedSource() {
      const selectedSourceId = getState().data.selectedSourceId;
      if (!selectedSourceId) return;
      patch((s) => ({
        ...s,
        data: {
          ...s.data,
          sources: s.data.sources.map((x) =>
            x.id === selectedSourceId
              ? {
                  ...x,
                  status: "Disconnected",
                  health: "Disconnected",
                  lastSync: "Disconnected",
                }
              : x,
          ),
        },
      }));
      emit("DataUpdated", { disconnected: selectedSourceId });
    },
  };
}

export function createExecutiveRuntimeStore(
  options?: CreateExecutiveRuntimeStoreOptions,
): ExecutiveRuntimeStore {
  let state = createInitialRuntimeState(options);
  const listeners = new Set<() => void>();
  let modeTimer: ReturnType<typeof setTimeout> | null = null;
  let modeTimer2: ReturnType<typeof setTimeout> | null = null;
  let modeTimer3: ReturnType<typeof setTimeout> | null = null;

  const getState = () => state;

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  const patch = (fn: (current: ExecutiveRuntimeState) => ExecutiveRuntimeState) => {
    state = fn(state);
    listeners.forEach((listener) => listener());
  };

  const emit = (type: ExecutiveRuntimeEventType, payload?: unknown) => {
    const event = createRuntimeEvent(type, payload);
    state = {
      ...state,
      events: [...state.events, event].slice(-RUNTIME_EVENT_LOG_LIMIT),
    };
    listeners.forEach((listener) => listener());
  };

  const clearModeTimers = () => {
    if (modeTimer) clearTimeout(modeTimer);
    if (modeTimer2) clearTimeout(modeTimer2);
    if (modeTimer3) clearTimeout(modeTimer3);
    modeTimer = null;
    modeTimer2 = null;
    modeTimer3 = null;
  };

  const scheduleModeTransition = (mode: ExecutiveModeId) => {
    const from = state.mode.activeMode;
    clearModeTimers();
    patch((s) => ({
      ...s,
      mode: {
        ...s.mode,
        previousMode: from,
        transitionState: "exiting",
      },
    }));
    modeTimer = setTimeout(() => {
      patch((s) => ({
        ...s,
        mode: {
          activeMode: mode,
          previousMode: from,
          transitionState: "entering",
        },
      }));
      modeTimer2 = setTimeout(() => {
        patch((s) => ({
          ...s,
          mode: { ...s.mode, transitionState: "active" },
        }));
        modeTimer3 = setTimeout(() => {
          patch((s) => ({
            ...s,
            mode: { ...s.mode, transitionState: "idle" },
          }));
        }, 40);
      }, EXECUTIVE_MODE_TRANSITION_MS);
    }, Math.floor(EXECUTIVE_MODE_TRANSITION_MS / 2));
  };

  const actions = createActions({
    getState,
    patch,
    emit,
    scheduleModeTransition,
  });

  return {
    getState,
    subscribe,
    getEventLog: () => state.events,
    emit,
    actions,
  };
}
