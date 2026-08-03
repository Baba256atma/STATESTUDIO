"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Exs1ObjectId, Exs1Selection } from "../exs1Types";
import {
  EXS1_CONNECTIONS,
  EXS1_CONTEXT,
  EXS1_OBJECTS,
  EXS1_PACKS,
  EXS1_WELCOME,
} from "../mock/exs1Mock";
import {
  ExecutiveDataExplorer,
  ExecutiveDataJournalEntry,
  ExecutiveDataOverlay,
  ExecutiveDataProvider,
  ExecutiveDataWizard,
  mapDataPacksToTimeline,
  useExecutiveData,
} from "../data";
import {
  ExecutiveDecisionExperienceLayer,
  ExecutiveDecisionJournalEntry,
  ExecutiveDecisionProvider,
  ExecutiveDecisionWizard,
  mapDecisionPacksToTimeline,
  useExecutiveDecision,
} from "../decision";
import {
  ExecutionAssignOwnerPanel,
  ExecutionChangeStatusPanel,
  ExecutionJournalEntry,
  ExecutionNewTaskPanel,
  ExecutionNotesPanel,
  ExecutiveExecutionExperienceLayer,
  ExecutiveExecutionProvider,
  mapExecutionPacksToTimeline,
  useExecutiveExecution,
} from "../execution";
import {
  ExecutiveMonitoringExperienceLayer,
  ExecutiveMonitoringJournalEntry,
  ExecutiveMonitoringNotesPanel,
  ExecutiveMonitoringProvider,
  mapMonitoringPacksToTimeline,
  useExecutiveMonitoring,
} from "../monitoring";
import {
  ExecutiveModeOverlay,
  ExecutiveModeProvider,
  useExecutiveMode,
} from "../mode";
import { useScenarioImpact } from "../impact/hooks/useScenarioImpact";
import {
  ScenarioExperienceLayer,
  ScenarioFloatingWizard,
  ScenarioSelectionManager,
  useScenarioExperience,
} from "../scenario";
import {
  ExecutiveCockpitShell,
  ExecutiveEmptyState,
  cockpit,
  navToExplorer,
  type ExecutiveAdvisorTab,
  type ExecutiveFloatingPanelKind,
  type ExecutiveNavId,
  type ExecutiveThemeMode,
  type ExecutiveTimelineLens,
} from "../shell";
import type { ExecutiveAdvisorContent } from "../shell/ExecutiveAdvisorPanel";
import { Exs1Stage } from "./Exs1Stage";

/** Reuse shell geometry tokens — keep explorerWidth a finite number. */
const DEFAULT_EXPLORER_WIDTH = cockpit.drawerDefault;
const MIN_EXPLORER_WIDTH = cockpit.drawerMin;
const MAX_EXPLORER_WIDTH = cockpit.drawerMax;

function clampExplorerWidth(value: number): number {
  if (!Number.isFinite(value)) {
    return DEFAULT_EXPLORER_WIDTH;
  }
  return Math.min(
    MAX_EXPLORER_WIDTH,
    Math.max(MIN_EXPLORER_WIDTH, value),
  );
}

function conversationBody(selection: Exs1Selection): string {
  if (selection.kind === "welcome") {
    return EXS1_WELCOME.body;
  }
  if (selection.kind === "object") {
    const object = EXS1_OBJECTS.find((o) => o.id === selection.objectId);
    return object?.summary ?? EXS1_WELCOME.body;
  }
  if (selection.kind === "pack") {
    const pack = EXS1_PACKS.find((p) => p.id === selection.packId);
    return pack?.story ?? EXS1_WELCOME.body;
  }
  if (selection.kind === "timeline") {
    return `Lens set to ${selection.lens}. Stage composition stays until you select a Pack. Timeline is independent of Executive Mode and Scenario selection.`;
  }
  return EXS1_WELCOME.body;
}

/**
 * Inner host — Mode + Scenario + Decision + Execution + Monitoring orchestration.
 */
function Exs1CockpitInner() {
  const { activeMode, config } = useExecutiveMode();
  const {
    isActive: scenarioActive,
    currentScenario,
    rankedScenarios,
    compareIds,
  } = useScenarioExperience();
  const { isActive: impactActive, primaryStory, multiImpact } =
    useScenarioImpact();
  const {
    isActive: decisionActive,
    currentDecision,
    decisionPacks,
    journalEntries: decisionJournalEntries,
  } = useExecutiveDecision();
  const {
    isActive: executionActive,
    plan: executionPlan,
    overallProgress,
    blockedTasks,
    tasks,
    notes,
    executionPacks,
    journalEntries: executionJournalEntries,
  } = useExecutiveExecution();
  const {
    isActive: monitoringActive,
    executiveHealth,
    kpis,
    alerts,
    attentionObjects,
    summary: monitoringSummary,
    notes: monitoringNotes,
    healthAccent,
    monitoringPacks,
    journalEntries: monitoringJournalEntries,
  } = useExecutiveMonitoring();
  const {
    isActive: dataActive,
    setExperienceActive: setDataExperienceActive,
    sources: dataSources,
    mappings: dataMappings,
    selectedSource,
    connectedCount,
    warningCount,
    dataPacks,
    journalEntries: dataJournalEntries,
  } = useExecutiveData();

  const [theme, setTheme] = useState<ExecutiveThemeMode>("night");
  const [nav, setNav] = useState<ExecutiveNavId>("Home");
  const [explorerWidth, setExplorerWidth] = useState<number>(
    DEFAULT_EXPLORER_WIDTH,
  );
  const [advisorTab, setAdvisorTab] = useState<ExecutiveAdvisorTab>("Assist");
  const [floatingKind, setFloatingKind] =
    useState<ExecutiveFloatingPanelKind>(null);
  const [selection, setSelection] = useState<Exs1Selection>({
    kind: "welcome",
  });
  const [selectedObjectId, setSelectedObjectId] =
    useState<Exs1ObjectId | null>(null);
  const [selectedPackId, setSelectedPackId] = useState<string | null>(
    "production-delay",
  );
  const [timelineLens, setTimelineLens] = useState<ExecutiveTimelineLens>(
    EXS1_CONTEXT.lens,
  );
  const [packHighlighted, setPackHighlighted] = useState(true);
  const [timelineHighlighted, setTimelineHighlighted] = useState(false);

  const explorerKind = navToExplorer(nav);
  const conversation = conversationBody(selection);

  useEffect(() => {
    setDataExperienceActive(explorerKind === "data");
  }, [explorerKind, setDataExperienceActive]);

  const timelinePacks = useMemo(
    () => [
      ...EXS1_PACKS.map((pack) => ({
        id: pack.id,
        title: pack.title,
        risk: pack.risk,
      })),
      ...mapDecisionPacksToTimeline(decisionPacks),
      ...mapExecutionPacksToTimeline(executionPacks),
      ...mapMonitoringPacksToTimeline(monitoringPacks),
      ...mapDataPacksToTimeline(dataPacks),
    ],
    [decisionPacks, executionPacks, monitoringPacks, dataPacks],
  );

  const context = useMemo(() => {
    const basePack = selectedPackId
      ? (EXS1_PACKS.find((p) => p.id === selectedPackId)?.title ??
        decisionPacks.find((p) => p.id === selectedPackId)?.title ??
        executionPacks.find((p) => p.id === selectedPackId)?.title ??
        monitoringPacks.find((p) => p.id === selectedPackId)?.title ??
        dataPacks.find((p) => p.id === selectedPackId)?.title ??
        EXS1_CONTEXT.pack)
      : EXS1_CONTEXT.pack;
    return {
      company: EXS1_CONTEXT.company,
      model: EXS1_CONTEXT.model,
      pack: basePack,
      lens: timelineLens,
      theme,
      liveStatus: EXS1_CONTEXT.dataStatus,
    };
  }, [
    selectedPackId,
    timelineLens,
    theme,
    decisionPacks,
    executionPacks,
    monitoringPacks,
    dataPacks,
  ]);

  const assist: ExecutiveAdvisorContent = useMemo(() => {
    if (dataActive) {
      const createSuggestion = dataMappings.find(
        (m) => m.status === "Create Object",
      );
      return {
        title: "Connection Summary",
        body: conversation,
        guidance: createSuggestion
          ? `${createSuggestion.sourceColumn} detected. Create Executive Object?`
          : "Review mappings, then Validate when ready.",
        accent: warningCount ? "#FDB022" : cockpit.accent,
        packPerspective: `${EXS1_CONTEXT.pack} · Data Catalog`,
        suggestionCards: [
          `Connection Summary · ${connectedCount} connected · ${warningCount} warning`,
          `Detected Data · ${selectedSource?.name ?? dataSources[0]?.name ?? "No source"}`,
          `Mapping Suggestions · ${dataMappings.filter((m) => m.status !== "Mapped").length} need review`,
          `Potential Objects · ${createSuggestion?.sourceColumn ?? "Region"}`,
          `Recommended Next Step · ${createSuggestion ? "Create or Ignore suggested objects" : "Add Data Source"}`,
        ],
        quickActions: [
          "Add Source",
          "Refresh",
          "Disconnect",
          "Export Mapping",
          "Validate",
        ],
      };
    }
    if (monitoringActive) {
      const alertTitles = alerts.map((a) => a.title).join(", ");
      const next =
        attentionObjects[0]?.alert ??
        alerts.find((a) => a.severity === "Critical")?.title ??
        "Review Inventory path";
      return {
        title: "Monitoring Summary",
        body: conversation,
        guidance: `Suggested Next Action · ${next}.`,
        accent: healthAccent,
        packPerspective: `${EXS1_CONTEXT.pack} · Monitoring`,
        suggestionCards: [
          `Monitoring Summary · ${monitoringSummary}`,
          `Observed Results · Revenue ${kpis[0]?.actual ?? "—"} vs ${kpis[0]?.expected ?? "—"}`,
          `Executive Alerts · ${alertTitles || "None"}`,
          `Recommended Attention · ${attentionObjects.map((o) => o.objectId).join(", ") || "None"}`,
          `Suggested Next Action · ${next}`,
          `Executive Notes · ${monitoringNotes}`,
        ],
        quickActions: [
          "Create Snapshot",
          "Refresh",
          "Compare",
          "Export",
          "Notes",
        ],
      };
    }
    if (executionActive) {
      const blockedNames = blockedTasks.map((t) => t.name).join(", ");
      const nextAction =
        blockedTasks[0]?.name ??
        tasks.find((t) => t.status === "In Progress")?.name ??
        "Start Execution";
      return {
        title: "Execution Summary",
        body: conversation,
        guidance: `Next Executive Action · Unblock ${nextAction}.`,
        accent: blockedTasks.length ? "#F04438" : "#12B76A",
        packPerspective: `${EXS1_CONTEXT.pack} · ${executionPlan.name}`,
        suggestionCards: [
          `Execution Summary · ${executionPlan.name} is ${executionPlan.status}`,
          `Current Progress · ${overallProgress}% across ${tasks.length} tasks`,
          `Blocked Tasks · ${blockedNames || "None"}`,
          `Suggested Attention · ${blockedTasks[0]?.name ?? "Keep Purchase Equipment moving"}`,
          `Next Executive Action · ${nextAction}`,
          `Execution Notes · ${notes}`,
        ],
        quickActions: ["Start", "Pause", "Resume", "Complete", "Cancel"],
      };
    }
    if (decisionActive && currentDecision) {
      const statusAccent =
        currentDecision.status === "Approved"
          ? "#12B76A"
          : currentDecision.status === "Rejected"
            ? "#F04438"
            : "#1570EF";
      return {
        title: "Decision Summary",
        body: conversation,
        guidance: currentDecision.nextStep,
        accent: statusAccent,
        packPerspective: `${EXS1_CONTEXT.pack} · ${currentDecision.name}`,
        suggestionCards: [
          `Reason · ${currentDecision.reason}`,
          `Expected Benefits · ${currentDecision.benefits.join(" · ")}`,
          `Known Risks · ${currentDecision.risks.join(" · ")}`,
          `Confidence · ${currentDecision.confidence}%`,
          `Recommended Next Step · ${currentDecision.nextStep}`,
          `Why this Decision? · ${currentDecision.whyThis}`,
          `Why not Scenario B? · ${currentDecision.whyNotAlternatives}`,
          `Expected Executive Impact · ${currentDecision.expectedImpact}`,
        ],
        quickActions: [
          "Approve",
          "Reject",
          "Return for Analysis",
          "Combine",
          "Duplicate",
        ],
      };
    }
    if (impactActive && currentScenario && primaryStory) {
      return {
        title: "Impact Summary",
        body: conversation,
        guidance: primaryStory.questions[0] ?? currentScenario.nextStep,
        accent: currentScenario.color,
        packPerspective: `${EXS1_CONTEXT.pack} · ${primaryStory.title}`,
        suggestionCards: [
          `Impact Summary · ${primaryStory.summary}`,
          ...primaryStory.concerns.map((c) => `Executive Concern · ${c}`),
          ...primaryStory.risks.map((r) => `Possible Risk · ${r}`),
          ...primaryStory.benefits.map((b) => `Potential Benefit · ${b}`),
          ...primaryStory.questions.map((q) => `Suggested Question · ${q}`),
        ],
        quickActions: [
          "Review Chain",
          "Open Impact Story",
          multiImpact ? "Compare Paths" : "Watch Propagation",
        ],
      };
    }
    if (scenarioActive && currentScenario) {
      return {
        title: `${currentScenario.name} Summary`,
        body: conversation,
        guidance: currentScenario.nextStep,
        accent: currentScenario.color,
        packPerspective: `${EXS1_CONTEXT.pack} · ${currentScenario.description}`,
        suggestionCards: [
          ...currentScenario.advantages.map((a) => `Advantage · ${a}`),
          ...currentScenario.weaknesses.map((w) => `Weakness · ${w}`),
          ...currentScenario.questions.map((q) => `Question · ${q}`),
        ],
        quickActions: [
          "Mark Selected",
          "Open Comparison",
          "Suggested Next Step",
        ],
      };
    }
    return {
      title: config.advisor.title,
      body: conversation,
      guidance: config.advisor.guidance,
      suggestionCards: config.advisor.suggestionCards,
      quickActions: config.advisor.quickActions,
      accent: config.accent,
      packPerspective: `${EXS1_CONTEXT.pack} · ${config.advisor.packPerspective}`,
    };
  }, [
    dataActive,
    dataSources,
    dataMappings,
    selectedSource,
    connectedCount,
    warningCount,
    monitoringActive,
    monitoringSummary,
    monitoringNotes,
    executiveHealth,
    kpis,
    alerts,
    attentionObjects,
    healthAccent,
    executionActive,
    executionPlan,
    overallProgress,
    blockedTasks,
    tasks,
    notes,
    decisionActive,
    currentDecision,
    impactActive,
    primaryStory,
    multiImpact,
    scenarioActive,
    currentScenario,
    conversation,
    config,
  ]);

  const insight: ExecutiveAdvisorContent = useMemo(() => {
    if (dataActive) {
      return {
        title: "Data Catalog",
        body: [
          `Source Summary · ${dataSources.length} sources in catalog.`,
          `Connection Health · ${connectedCount} connected · ${warningCount} warning.`,
          `Mapping Overview · ${dataMappings.filter((m) => m.status === "Mapped").length} mapped · ${dataMappings.filter((m) => m.status === "Create Object").length} create-object.`,
          `Executive Notes · Connect data before Runtime integration.`,
        ].join(" "),
        guidance:
          "Insight surfaces Data Catalog, Source Summary, Connection Health, Mapping Overview, and Notes — mock only.",
        accent: cockpit.accent,
        packPerspective: `${EXS1_CONTEXT.pack} · Data Notes`,
        suggestionCards: [
          `Data Catalog · ${dataSources.map((s) => s.name).slice(0, 3).join(", ")}`,
          `Source Summary · Selected ${selectedSource?.name ?? "none"}`,
          `Connection Health · ${warningCount ? "Attention required" : "Stable"}`,
          `Mapping Overview · ${dataMappings.length} rows`,
          "Executive Notes · No Runtime drivers in this phase",
        ],
      };
    }
    if (monitoringActive) {
      return {
        title: "Executive Health",
        body: [
          `Executive Health · ${executiveHealth}.`,
          `KPI Dashboard · ${kpis.map((k) => `${k.name} ${k.actual}/${k.expected}`).join(" · ")}.`,
          `Alert Center · ${alerts.length} alerts (${alerts.filter((a) => a.severity === "Critical").length} critical).`,
          `Trend Summary · ${monitoringSummary}`,
          `Executive Notes · ${monitoringNotes}`,
        ].join(" "),
        guidance:
          "Insight surfaces Executive Health, KPI Dashboard, Alert Center, Trends, and Notes — mock only.",
        accent: healthAccent,
        packPerspective: `${EXS1_CONTEXT.pack} · Monitoring Notes`,
        suggestionCards: [
          `Executive Health · ${executiveHealth}`,
          `KPI Dashboard · ${kpis.length} KPIs tracked`,
          `Alert Center · ${alerts.map((a) => a.title).join(", ")}`,
          `Trend Summary · Delivery and Inventory lag expected recovery`,
          `Executive Notes · ${monitoringNotes}`,
        ],
      };
    }
    if (executionActive) {
      const distribution = [
        `Completed ${tasks.filter((t) => t.status === "Completed").length}`,
        `In Progress ${tasks.filter((t) => t.status === "In Progress").length}`,
        `Blocked ${blockedTasks.length}`,
        `Waiting ${tasks.filter((t) => t.status === "Waiting").length}`,
      ].join(" · ");
      return {
        title: "Execution Dashboard",
        body: [
          `Progress Overview · ${overallProgress}% on ${executionPlan.name}.`,
          `Task Distribution · ${distribution}.`,
          `Execution Risks · ${blockedTasks.map((t) => t.name).join(", ") || "No active blockers"}.`,
          `Execution Notes · ${notes}`,
        ].join(" "),
        guidance:
          "Insight surfaces Execution Dashboard, Progress, Risks, and Notes — mock only.",
        accent: blockedTasks.length ? "#F04438" : "#12B76A",
        packPerspective: `${EXS1_CONTEXT.pack} · Execution Notes`,
        suggestionCards: [
          `Progress Overview · ${overallProgress}%`,
          `Task Distribution · ${distribution}`,
          `Execution Risks · ${blockedTasks[0]?.name ?? "Clear path"}`,
          `Execution Notes · Owner ${executionPlan.owner}`,
        ],
      };
    }
    if (decisionActive && currentDecision) {
      return {
        title: "Decision Dashboard",
        body: [
          `Decision Summary · ${currentDecision.name} is ${currentDecision.status}.`,
          `Decision Impact · ${currentDecision.expectedImpact}`,
          `Approval History · Owner ${currentDecision.owner} · Created ${currentDecision.createdDate}.`,
          "Executive Notes · Mock commitment record only — no runtime lock.",
        ].join(" "),
        guidance:
          "Insight surfaces Decision Dashboard, Impact, Approval History, and Executive Notes — mock only.",
        accent:
          currentDecision.status === "Approved" ? "#12B76A" : "#1570EF",
        packPerspective: `${EXS1_CONTEXT.pack} · Decision Notes`,
        suggestionCards: [
          `Decision Summary · ${currentDecision.name} · ${currentDecision.status}`,
          `Decision Impact · Risk ${currentDecision.risk} · Confidence ${currentDecision.confidence}%`,
          `Approval History · ${currentDecision.owner} · ${currentDecision.createdDate}`,
          `Executive Notes · Source ${currentDecision.scenarioSourceLabel}`,
        ],
      };
    }
    if (impactActive && currentScenario && primaryStory) {
      const chainLabels = primaryStory.chain.map((n) => n.label).join(" → ");
      return {
        title: "Impact Chain",
        body: `${chainLabels}. ${multiImpact ? "Parallel impact paths are active for comparison." : "Propagation animates from the root object."}`,
        guidance:
          "Insight surfaces Impact Chain, Impact Matrix, Affected Areas, and Executive Notes — mock only.",
        accent: currentScenario.color,
        packPerspective: `${EXS1_CONTEXT.pack} · Executive Notes`,
        suggestionCards: [
          `Impact Chain · ${chainLabels}`,
          `Impact Matrix · Direction ${primaryStory.estimatedDirection}`,
          `Affected Areas · ${primaryStory.affectedDepartments.join(", ")}`,
          `Executive Notes · Confidence ${primaryStory.confidence}%`,
        ],
      };
    }
    if (scenarioActive && currentScenario) {
      const rankIndex = rankedScenarios.findIndex(
        (s) => s.id === currentScenario.id,
      );
      const compareLabel =
        compareIds.length >= 2
          ? `Comparing ${compareIds.length} scenarios side-by-side.`
          : "Select two scenarios to compare differences.";
      return {
        title: "Scenario Matrix",
        body: [
          `Ranking note: ${currentScenario.name} is #${rankIndex + 1} in the current sort.`,
          compareLabel,
          `Differences mock: ROI ${currentScenario.roi}, Risk ${currentScenario.risk}, Confidence ${currentScenario.confidence}%.`,
        ].join(" "),
        guidance:
          "Insight surfaces Scenario Matrix, Ranking, Notes, and Differences — mock only.",
        accent: currentScenario.color,
        packPerspective: `${EXS1_CONTEXT.pack} · Scenario Notes`,
        suggestionCards: [
          "Scenario Matrix · Cost / Risk / ROI / Time / Confidence",
          `Scenario Ranking · ${currentScenario.name}`,
          `Scenario Notes · ${currentScenario.description}`,
          "Scenario Differences · visual indicators on Stage",
        ],
      };
    }
    return {
      title: config.insight.title,
      body: config.insight.body,
      guidance: config.insight.guidance,
      accent: config.accent,
      packPerspective: `${EXS1_CONTEXT.pack} · ${activeMode} perspective`,
    };
  }, [
    dataActive,
    dataSources,
    dataMappings,
    selectedSource,
    connectedCount,
    warningCount,
    monitoringActive,
    executiveHealth,
    kpis,
    alerts,
    monitoringSummary,
    monitoringNotes,
    healthAccent,
    executionActive,
    executionPlan,
    overallProgress,
    blockedTasks,
    tasks,
    notes,
    decisionActive,
    currentDecision,
    impactActive,
    primaryStory,
    multiImpact,
    scenarioActive,
    currentScenario,
    rankedScenarios,
    compareIds,
    config,
    activeMode,
  ]);

  function handleSelectObject(objectId: Exs1ObjectId) {
    const object = EXS1_OBJECTS.find((o) => o.id === objectId);
    if (!object) return;
    setSelectedObjectId(objectId);
    setSelection({ kind: "object", objectId });
    setPackHighlighted(true);
    setAdvisorTab("Assist");
  }

  function handleSelectPack(packId: string) {
    const pack = EXS1_PACKS.find((p) => p.id === packId);
    if (pack) {
      setSelectedPackId(packId);
      setSelection({ kind: "pack", packId });
      setPackHighlighted(true);
      setTimelineLens(pack.timelineLens as ExecutiveTimelineLens);
      setTimelineHighlighted(true);
      setAdvisorTab("Assist");
      return;
    }
    const decisionPack = decisionPacks.find((p) => p.id === packId);
    const executionPack = executionPacks.find((p) => p.id === packId);
    const monitoringPack = monitoringPacks.find((p) => p.id === packId);
    const dataPack = dataPacks.find((p) => p.id === packId);
    if (!decisionPack && !executionPack && !monitoringPack && !dataPack) return;
    // Decision/Execution/Monitoring/Data Packs grow history only — lens/position stay unchanged.
    setSelectedPackId(packId);
    setSelection({ kind: "pack", packId });
    setPackHighlighted(true);
    setAdvisorTab("Assist");
  }

  function handleSelectLens(lens: ExecutiveTimelineLens) {
    setTimelineLens(lens);
    setSelection({ kind: "timeline", lens });
    setTimelineHighlighted(true);
  }

  const handleExplorerWidthChange = useCallback((width: number) => {
    setExplorerWidth(clampExplorerWidth(width));
  }, []);

  const explorerContent = useMemo(() => {
    if (explorerKind === "objects") {
      return (
        <ul
          style={{
            margin: 0,
            padding: 0,
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: "0.4rem",
          }}
        >
          {EXS1_OBJECTS.map((object) => (
            <li key={object.id}>
              <button
                type="button"
                onClick={() => handleSelectObject(object.id)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "0.5rem 0.6rem",
                  borderRadius: "0.35rem",
                  border: `1px solid ${cockpit.border}`,
                  background: cockpit.panelSoft,
                  color: cockpit.text,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {object.symbol} {object.label}
              </button>
            </li>
          ))}
        </ul>
      );
    }
    if (explorerKind === "model") {
      return (
        <ExecutiveEmptyState
          testId="executive-empty-model"
          title="Active Model"
          body={`${EXS1_CONTEXT.model} remains in focus while you change Executive Mode.`}
          actionHint="Explore objects on Stage to deepen context"
        />
      );
    }
    if (explorerKind === "journal") {
      const hasEntries =
        decisionJournalEntries.length > 0 ||
        executionJournalEntries.length > 0 ||
        monitoringJournalEntries.length > 0 ||
        dataJournalEntries.length > 0;
      if (!hasEntries) {
        return (
          <ExecutiveEmptyState
            testId="executive-empty-journal"
            title="No Journal Yet"
            body="Executive commitments appear here after you Approve a Decision, Start Execution, Create a Monitoring Snapshot, or Add a Data Source."
            actionHint="Open Decision · Execution · Monitoring · or Data"
          />
        );
      }
      return (
        <div
          data-testid="executive-journal-list"
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          {decisionJournalEntries.map((entry) => (
            <ExecutiveDecisionJournalEntry key={entry.id} entry={entry} />
          ))}
          {executionJournalEntries.map((entry) => (
            <ExecutionJournalEntry key={entry.id} entry={entry} />
          ))}
          {monitoringJournalEntries.map((entry) => (
            <ExecutiveMonitoringJournalEntry key={entry.id} entry={entry} />
          ))}
          {dataJournalEntries.map((entry) => (
            <ExecutiveDataJournalEntry key={entry.id} entry={entry} />
          ))}
        </div>
      );
    }
    if (explorerKind === "data") {
      return (
        <ExecutiveDataExplorer
          onAddSource={() => setFloatingKind("data-wizard")}
        />
      );
    }
    if (explorerKind === "search") {
      return (
        <ExecutiveEmptyState
          testId="executive-empty-search"
          title="Search Ready"
          body="Search never interrupts Stage, Timeline, or Advisor. Type when you need to locate an executive asset."
          actionHint="Use Objects or Model for quick navigation"
        />
      );
    }
    return null;
  }, [
    explorerKind,
    decisionJournalEntries,
    executionJournalEntries,
    monitoringJournalEntries,
    dataJournalEntries,
  ]);

  function floatingTitle(kind: ExecutiveFloatingPanelKind): string | undefined {
    switch (kind) {
      case "scenario-wizard":
        return "New Scenario";
      case "decision-wizard":
        return "Manual Executive Decision";
      case "execution-new-task":
        return "New Task";
      case "execution-assign-owner":
        return "Assign Owner";
      case "execution-change-status":
        return "Change Status";
      case "execution-notes":
        return "Execution Notes";
      case "monitoring-notes":
        return "Monitoring Notes";
      case "data-wizard":
        return "Add Data Source";
      default:
        return undefined;
    }
  }

  function floatingContent(kind: ExecutiveFloatingPanelKind) {
    const close = () => setFloatingKind(null);
    switch (kind) {
      case "scenario-wizard":
        return <ScenarioFloatingWizard onClose={close} />;
      case "decision-wizard":
        return <ExecutiveDecisionWizard onClose={close} />;
      case "execution-new-task":
        return <ExecutionNewTaskPanel onClose={close} />;
      case "execution-assign-owner":
        return <ExecutionAssignOwnerPanel onClose={close} />;
      case "execution-change-status":
        return <ExecutionChangeStatusPanel onClose={close} />;
      case "execution-notes":
        return <ExecutionNotesPanel onClose={close} />;
      case "monitoring-notes":
        return <ExecutiveMonitoringNotesPanel onClose={close} />;
      case "data-wizard":
        return <ExecutiveDataWizard onClose={close} />;
      default:
        return undefined;
    }
  }

  return (
    <div
      data-testid="exs1-cockpit"
      data-active-mode={activeMode}
      data-scenario-active={scenarioActive ? "true" : "false"}
      data-impact-active={impactActive ? "true" : "false"}
      data-decision-active={decisionActive ? "true" : "false"}
      data-execution-active={executionActive ? "true" : "false"}
      data-monitoring-active={monitoringActive ? "true" : "false"}
      data-data-active={dataActive ? "true" : "false"}
    >
      <ExecutiveCockpitShell
        context={context}
        onThemeChange={setTheme}
        activeNav={nav}
        onNavSelect={setNav}
        explorerKind={explorerKind}
        explorerWidth={explorerWidth}
        onExplorerWidthChange={handleExplorerWidthChange}
        onExplorerClose={() => setNav("Home")}
        explorerContent={explorerContent}
        stage={
          <>
            <Exs1Stage
              objects={EXS1_OBJECTS}
              connections={EXS1_CONNECTIONS}
              selectedObjectId={selectedObjectId}
              onSelectObject={handleSelectObject}
            />
            <ScenarioExperienceLayer
              onCreateRequest={() => setFloatingKind("scenario-wizard")}
            />
            <ExecutiveDecisionExperienceLayer
              onManualCreateRequest={() => setFloatingKind("decision-wizard")}
            />
            <ExecutiveExecutionExperienceLayer
              onOpenPanel={(kind) => setFloatingKind(kind)}
            />
            <ExecutiveMonitoringExperienceLayer
              onOpenNotes={() => setFloatingKind("monitoring-notes")}
            />
            <ExecutiveDataOverlay />
          </>
        }
        stageOverlay={
          dataActive ||
          monitoringActive ||
          executionActive ||
          decisionActive ||
          scenarioActive ? null : (
            <ExecutiveModeOverlay />
          )
        }
        advisorTab={advisorTab}
        onAdvisorTabChange={setAdvisorTab}
        assist={assist}
        insight={insight}
        timelineLens={timelineLens}
        timelineHighlighted={timelineHighlighted}
        packs={timelinePacks}
        selectedPackId={selectedPackId}
        packHighlighted={packHighlighted}
        onSelectLens={handleSelectLens}
        onSelectPack={handleSelectPack}
        floatingKind={floatingKind}
        floatingTitle={floatingTitle(floatingKind)}
        floatingContent={floatingContent(floatingKind)}
        onFloatingClose={() => setFloatingKind(null)}
        onHelp={() => setFloatingKind("wizard")}
      />
    </div>
  );
}

/**
 * EXS-7 + Sprint 3 host — Monitoring + Executive Data Experience.
 * Pure UI orchestration. No runtime / AI / drivers / workflow engines.
 */
export function Exs1Cockpit() {
  return (
    <ExecutiveModeProvider initialMode="Problem">
      <ScenarioSelectionManager>
        <ExecutiveDecisionProvider>
          <ExecutiveExecutionProvider>
            <ExecutiveMonitoringProvider>
              <ExecutiveDataProvider>
                <Exs1CockpitInner />
              </ExecutiveDataProvider>
            </ExecutiveMonitoringProvider>
          </ExecutiveExecutionProvider>
        </ExecutiveDecisionProvider>
      </ScenarioSelectionManager>
    </ExecutiveModeProvider>
  );
}
