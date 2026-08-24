"use client";

import { useCallback, useMemo } from "react";
import type { Exs1ObjectId } from "../exs1Types";
import {
  EXS1_CONNECTIONS,
  EXS1_CONTEXT,
  EXS1_OBJECTS,
  EXS1_PACKS,
} from "../mock/exs1Mock";
import {
  ExecutiveAdvisorProvider,
  useExecutiveAdvisor,
} from "../advisor";
import { ExecutiveConversationProvider } from "../conversation";
import {
  ExecutiveMetadataExplorer,
  ExecutiveMetadataProvider,
} from "../metadata";
import {
  ExecutiveIntelligenceExplorer,
  ExecutiveIntelligenceJournalEntry,
  ExecutiveRuntimeIntelligenceProvider,
  useRuntimeIntelligence,
} from "../intelligence";
import {
  ExecutiveDataJournalEntry,
  ExecutiveDataOverlay,
  ExecutiveDataProvider,
  mapDataPacksToTimeline,
  useExecutiveData,
} from "../data";
import {
  ExecutiveConnectorExplorer,
  ExecutiveConnectorJournalEntry,
  ExecutiveConnectorProvider,
  ExecutivePublishWizard,
  useEnterpriseConnector,
} from "../connectors";
import {
  ExecutiveSimulationExplorer,
  ExecutiveSimulationJournalEntry,
  ExecutiveSimulationOverlay,
  ExecutiveSimulationProvider,
  useExecutiveSimulation,
} from "../simulation";
import {
  ExecutiveBetaProvider,
  ExecutiveBetaSettings,
  useExecutiveBeta,
} from "../beta";
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
  ExecutiveRuntimeProvider,
  useRuntimeExplorer,
  useRuntimePack,
  useRuntimeSelection,
  useRuntimeShell,
  useRuntimeTimeline,
} from "../runtime";
import {
  ExecutiveCockpitShell,
  ExecutiveEmptyState,
  cockpit,
  navToExplorer,
  type ExecutiveFloatingPanelKind,
  type ExecutiveTimelineLens,
} from "../shell";
import { Exs1Stage } from "./Exs1Stage";

/**
 * Inner host — Mode + Scenario + Decision + Execution + Monitoring orchestration.
 */
function Exs1CockpitInner() {
  const { activeMode } = useExecutiveMode();
  const { isActive: scenarioActive } = useScenarioExperience();
  const { isActive: impactActive } = useScenarioImpact();
  const {
    isActive: decisionActive,
    decisionPacks,
    journalEntries: decisionJournalEntries,
  } = useExecutiveDecision();
  const {
    isActive: executionActive,
    executionPacks,
    journalEntries: executionJournalEntries,
  } = useExecutiveExecution();
  const {
    isActive: monitoringActive,
    monitoringPacks,
    journalEntries: monitoringJournalEntries,
  } = useExecutiveMonitoring();
  const {
    isActive: dataActive,
    dataPacks,
    journalEntries: dataJournalEntries,
  } = useExecutiveData();
  const { journalEntries: intelligenceJournalEntries } =
    useRuntimeIntelligence();
  const { journalEntries: connectorJournalEntries } = useEnterpriseConnector();
  const { journalEntries: simulationJournalEntries } = useExecutiveSimulation();
  const { flags } = useExecutiveBeta();

  const {
    theme,
    setTheme,
    advisorTab,
    setAdvisorTab,
    floatingKind,
    setFloatingKind,
  } = useRuntimeShell();
  const {
    nav,
    setNav,
    width: explorerWidth,
    setExplorerWidth,
    closeExplorer,
  } = useRuntimeExplorer();
  const { selectedObjectId, selectObject } = useRuntimeSelection();
  const { selectedPackId, packHighlighted, selectPack } = useRuntimePack();
  const { lens: timelineLens, timelineHighlighted, selectLens } =
    useRuntimeTimeline();

  const explorerKind = navToExplorer(nav);

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

  const {
    assist,
    insight,
    approveProposal,
    dismissProposal,
    focusReference,
  } = useExecutiveAdvisor();

  function handleSelectObject(objectId: Exs1ObjectId) {
    const object = EXS1_OBJECTS.find((o) => o.id === objectId);
    if (!object) return;
    selectObject(objectId);
  }

  function handleSelectPack(packId: string) {
    const pack = EXS1_PACKS.find((p) => p.id === packId);
    if (pack) {
      selectPack(packId, {
        timelineLens: pack.timelineLens as ExecutiveTimelineLens,
      });
      return;
    }
    const decisionPack = decisionPacks.find((p) => p.id === packId);
    const executionPack = executionPacks.find((p) => p.id === packId);
    const monitoringPack = monitoringPacks.find((p) => p.id === packId);
    const dataPack = dataPacks.find((p) => p.id === packId);
    if (!decisionPack && !executionPack && !monitoringPack && !dataPack) return;
    // Decision/Execution/Monitoring/Data Packs grow history only — lens/position stay unchanged.
    selectPack(packId);
  }

  function handleSelectLens(lens: ExecutiveTimelineLens) {
    selectLens(lens);
  }

  const handleExplorerWidthChange = useCallback(
    (width: number) => {
      setExplorerWidth(width);
    },
    [setExplorerWidth],
  );

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
          title="Executive Model Ready"
          body={`${EXS1_CONTEXT.model} is your active Executive Model. Enrich meaning in Knowledge, or connect a data source to deepen object coverage.`}
          actionHint="Open Knowledge · or Data to connect CSV"
        />
      );
    }
    if (explorerKind === "journal") {
      const hasEntries =
        decisionJournalEntries.length > 0 ||
        executionJournalEntries.length > 0 ||
        monitoringJournalEntries.length > 0 ||
        dataJournalEntries.length > 0 ||
        intelligenceJournalEntries.length > 0 ||
        connectorJournalEntries.length > 0 ||
        simulationJournalEntries.length > 0;
      if (!hasEntries) {
        return (
          <ExecutiveEmptyState
            testId="executive-empty-journal"
            title="Journal Awaits Executive Action"
            body="The Journal records Connector publishes, Simulations, Decisions, Execution starts, and Monitoring snapshots as audit packs."
            actionHint="Complete Connect CSV · Simulation · or Decision Approval"
          />
        );
      }
      return (
        <div
          data-testid="executive-journal-list"
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          {simulationJournalEntries.map((entry) => (
            <ExecutiveSimulationJournalEntry
              key={`simulation:${entry.id}`}
              entry={entry}
            />
          ))}
          {connectorJournalEntries.map((entry) => (
            <ExecutiveConnectorJournalEntry
              key={`connector:${entry.id}`}
              entry={entry}
            />
          ))}
          {intelligenceJournalEntries.map((entry) => (
            <ExecutiveIntelligenceJournalEntry
              key={`intelligence:${entry.id}`}
              entry={entry}
            />
          ))}
          {decisionJournalEntries.map((entry) => (
            <ExecutiveDecisionJournalEntry
              key={`decision:${entry.id}`}
              entry={entry}
            />
          ))}
          {executionJournalEntries.map((entry) => (
            <ExecutionJournalEntry
              key={`execution:${entry.id}`}
              entry={entry}
            />
          ))}
          {monitoringJournalEntries.map((entry) => (
            <ExecutiveMonitoringJournalEntry
              key={`monitoring:${entry.id}`}
              entry={entry}
            />
          ))}
          {dataJournalEntries.map((entry) => (
            <ExecutiveDataJournalEntry
              key={`data:${entry.id}`}
              entry={entry}
            />
          ))}
        </div>
      );
    }
    if (explorerKind === "data") {
      if (!flags.EnableConnectors) {
        return (
          <ExecutiveEmptyState
            testId="executive-empty-connectors-disabled"
            title="Connectors Paused"
            body="Enterprise Connectors are disabled by Beta Feature Flags. Enable Connectors in Settings to continue intake."
            actionHint="Open Settings → Enable Connectors"
          />
        );
      }
      return (
        <ExecutiveConnectorExplorer
          onOpenPublish={() => setFloatingKind("data-wizard")}
        />
      );
    }
    if (explorerKind === "knowledge") {
      return <ExecutiveMetadataExplorer />;
    }
    if (explorerKind === "intelligence") {
      return <ExecutiveIntelligenceExplorer />;
    }
    if (explorerKind === "simulations") {
      if (!flags.EnableSimulation) {
        return (
          <ExecutiveEmptyState
            testId="executive-empty-simulation-disabled"
            title="Simulation Paused"
            body="Scenario Simulation is disabled by Beta Feature Flags. Enable Simulation in Settings to explore Future States."
            actionHint="Open Settings → Enable Simulation"
          />
        );
      }
      return <ExecutiveSimulationExplorer />;
    }
    if (explorerKind === "search") {
      return (
        <ExecutiveEmptyState
          testId="executive-empty-search"
          title="Search Ready"
          body="Locate Connectors, Schemas, Fields, Objects, Signals, or Simulations without interrupting Stage or Timeline."
          actionHint="Use Objects · Knowledge · Intelligence · or Simulations"
        />
      );
    }
    if (explorerKind === "settings") {
      return <ExecutiveBetaSettings />;
    }
    return null;
  }, [
    explorerKind,
    decisionJournalEntries,
    executionJournalEntries,
    monitoringJournalEntries,
    dataJournalEntries,
    intelligenceJournalEntries,
    connectorJournalEntries,
    simulationJournalEntries,
    flags.EnableConnectors,
    flags.EnableSimulation,
    handleSelectObject,
    setFloatingKind,
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
        return "Publish Enterprise Connector";
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
        return <ExecutivePublishWizard onClose={close} />;
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
        onExplorerClose={closeExplorer}
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
            <ExecutiveSimulationOverlay />
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
        onApproveProposal={approveProposal}
        onDismissProposal={dismissProposal}
        onSelectReference={focusReference}
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
 * Runtime tree gated by Beta Feature Flags (no redesign of core modules).
 */
function Exs1CockpitRuntimeTree() {
  const { flags } = useExecutiveBeta();
  return (
    <ExecutiveRuntimeProvider
      initialMode="Problem"
      showInspector={flags.EnableRuntimeInspector}
    >
      <ExecutiveModeProvider>
        <ScenarioSelectionManager>
          <ExecutiveDecisionProvider>
            <ExecutiveExecutionProvider>
              <ExecutiveMonitoringProvider>
                <ExecutiveDataProvider>
                  <ExecutiveMetadataProvider>
                    <ExecutiveConnectorProvider>
                      <ExecutiveSimulationProvider>
                        <ExecutiveRuntimeIntelligenceProvider>
                          <ExecutiveAdvisorProvider>
                            <ExecutiveConversationProvider>
                              <Exs1CockpitInner />
                            </ExecutiveConversationProvider>
                          </ExecutiveAdvisorProvider>
                        </ExecutiveRuntimeIntelligenceProvider>
                      </ExecutiveSimulationProvider>
                    </ExecutiveConnectorProvider>
                  </ExecutiveMetadataProvider>
                </ExecutiveDataProvider>
              </ExecutiveMonitoringProvider>
            </ExecutiveExecutionProvider>
          </ExecutiveDecisionProvider>
        </ScenarioSelectionManager>
      </ExecutiveModeProvider>
    </ExecutiveRuntimeProvider>
  );
}

/**
 * EXS-7 + Phase E host — Beta readiness layer wraps the stable platform.
 */
export function Exs1Cockpit() {
  return (
    <ExecutiveBetaProvider>
      <Exs1CockpitRuntimeTree />
    </ExecutiveBetaProvider>
  );
}
