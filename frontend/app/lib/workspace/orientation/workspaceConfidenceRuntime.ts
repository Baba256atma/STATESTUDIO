import type {
  ExecutiveOrientationContext,
  WorkspaceConfidenceSignal,
  WorkspaceConfidenceSnapshot,
} from "./executiveOrientationTypes";

function buildSignals(input: ExecutiveOrientationContext): WorkspaceConfidenceSignal[] {
  return [
    {
      id: "operational_data",
      label: "Operational Data Available",
      ready: input.objectCount > 0 || input.pipelineStatus === "ready",
    },
    {
      id: "scenario_engine",
      label: "Scenario Engine Ready",
      ready: input.workspaceReadiness.scenarioReady || input.activeScenarioCount > 0,
    },
    {
      id: "risk_assessment",
      label: "Risk Assessment Active",
      ready:
        input.pipelineStatus === "ready" ||
        input.pipelineStatus === "processing" ||
        input.fragilityLevel != null,
    },
    {
      id: "monitoring",
      label: "Monitoring Online",
      ready: input.workspaceReadiness.hudReady && input.workspaceReadiness.themeReady,
    },
    {
      id: "assistant",
      label: "Executive Assistant Ready",
      ready: input.workspaceReadiness.assistantReady,
    },
    {
      id: "persistence",
      label: "Workspace Persistence Ready",
      ready: input.workspaceReadiness.persistenceReady,
    },
  ];
}

/** E2:48 Part 8 — operational readiness signals for executive confidence. */
export function resolveWorkspaceConfidence(input: ExecutiveOrientationContext): WorkspaceConfidenceSnapshot {
  const signals = buildSignals(input);
  const readyCount = signals.filter((signal) => signal.ready).length;
  const summaryLine =
    readyCount === signals.length
      ? "All executive systems operational"
      : `${readyCount} of ${signals.length} readiness signals active`;

  return { signals, summaryLine };
}
