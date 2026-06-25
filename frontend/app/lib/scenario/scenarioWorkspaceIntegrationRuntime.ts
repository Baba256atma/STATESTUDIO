/**
 * DS-7:5 — Scenario workspace integration runtime.
 * Read-only presentation of DS-7 scenario intelligence into existing Nexora workspace UI.
 */

import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import { getActiveWorkspaceId } from "../workspace/workspaceRegistryStore.ts";
import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import {
  getWorkspaceScenario,
  getWorkspaceScenarios,
  type WorkspaceScenario,
  type WorkspaceScenarioStatus,
} from "./workspaceScenarioContract.ts";
import { getLatestWorkspaceScenarioComparison } from "./workspaceScenarioComparisonEngine.ts";
import {
  getLatestWorkspaceScenarioSimulation,
  getWorkspaceScenarioSimulations,
  type WorkspaceScenarioSimulation,
} from "./workspaceScenarioSimulationEngine.ts";
import {
  getWorkspaceScenarioInsight,
  getWorkspaceScenarioInsights,
  type WorkspaceScenarioInsight,
} from "./workspaceScenarioInsightEngine.ts";

export const WORKSPACE_SCENARIO_WORKSPACE_INTEGRATION_VERSION = "DS-7:5" as const;

export const WORKSPACE_SCENARIO_WORKSPACE_INTEGRATION_TAGS = Object.freeze([
  "[DS75_SCENARIO_WORKSPACE_INTEGRATION]",
  "[SCENARIO_VISIBLE_IN_WORKSPACE]",
  "[EXECUTIVE_SUMMARY_EXTENDED]",
  "[OBJECT_PANEL_EXTENDED]",
  "[NO_NEW_UI_CREATED]",
  "[DS76_READY]",
  "[DS_7_5_COMPLETE]",
] as const);

export const WORKSPACE_SCENARIO_PANEL_TAGS = Object.freeze([
  "[DS75_SCENARIO_PANEL]",
  "[SCENARIO_VISIBLE_IN_OBJECT_PANEL]",
  "[OBJECT_PANEL_EXTENDED]",
  "[NO_NEW_PANEL_CREATED]",
  "[DS76_READY]",
  "[DS_7_5_COMPLETE]",
] as const);

export const NEXORA_SCENARIO_WORKSPACE_LOG_PREFIX = "[NexoraScenarioWorkspace]" as const;

export const NEXORA_SCENARIO_PANEL_LOG_PREFIX = "[NexoraScenarioWorkspace]" as const;

export type WorkspaceScenarioTimelineIntegrationStatus = "reserved";

export type WorkspaceScenarioWorkspaceSummary = Readonly<{
  contractVersion: typeof WORKSPACE_SCENARIO_WORKSPACE_INTEGRATION_VERSION;
  workspaceId: WorkspaceId;
  totalScenarios: number;
  activeCount: number;
  draftCount: number;
  archivedCount: number;
  activeScenarioId: string | null;
  activeScenarioName: string | null;
  latestInsightSummary: string | null;
  latestSimulationScenarioName: string | null;
  latestSimulationStatus: string | null;
  latestComparisonSummary: string | null;
  timelineStatus: WorkspaceScenarioTimelineIntegrationStatus;
  generatedAt: string;
}>;

export type ObjectScenarioSummaryItem = Readonly<{
  scenarioId: string;
  scenarioName: string;
  scenarioStatus: WorkspaceScenarioStatus;
  insightSummary: string | null;
  simulationStatus: string | null;
  comparisonSummary: string | null;
}>;

export type ObjectScenarioSummaryState = Readonly<{
  items: readonly ObjectScenarioSummaryItem[];
  emptyMessage: string | null;
  relatedScenarioCount: number;
  latestSimulationLabel: string | null;
  latestComparisonLabel: string | null;
  timelineStatus: WorkspaceScenarioTimelineIntegrationStatus;
  visible: boolean;
}>;

export type ObjectScenarioSummaryInput = Readonly<{
  workspaceId?: string | null;
  objectId?: string | null;
}>;

const EMPTY_WORKSPACE_SCENARIO_SUMMARY: WorkspaceScenarioWorkspaceSummary = Object.freeze({
  contractVersion: WORKSPACE_SCENARIO_WORKSPACE_INTEGRATION_VERSION,
  workspaceId: "",
  totalScenarios: 0,
  activeCount: 0,
  draftCount: 0,
  archivedCount: 0,
  activeScenarioId: null,
  activeScenarioName: null,
  latestInsightSummary: null,
  latestSimulationScenarioName: null,
  latestSimulationStatus: null,
  latestComparisonSummary: null,
  timelineStatus: "reserved",
  generatedAt: "",
});

const EMPTY_OBJECT_SCENARIO_SUMMARY: ObjectScenarioSummaryState = Object.freeze({
  items: Object.freeze([]),
  emptyMessage: null,
  relatedScenarioCount: 0,
  latestSimulationLabel: null,
  latestComparisonLabel: null,
  timelineStatus: "reserved",
  visible: false,
});

function nowIso(): string {
  return new Date().toISOString();
}

function normalizeWorkspaceId(workspaceId?: WorkspaceId | null): string {
  return String(workspaceId ?? getActiveWorkspaceId() ?? "").trim();
}

function normalizeId(value: unknown): string {
  return String(value ?? "").trim();
}

function incrementStatusCount(
  counts: { activeCount: number; draftCount: number; archivedCount: number },
  status: WorkspaceScenarioStatus
): void {
  switch (status) {
    case "active":
      counts.activeCount += 1;
      break;
    case "archived":
      counts.archivedCount += 1;
      break;
    default:
      counts.draftCount += 1;
  }
}

function resolveActiveScenario(scenarios: readonly WorkspaceScenario[]): WorkspaceScenario | null {
  const active = scenarios.filter((scenario) => scenario.status === "active");
  if (active.length === 0) return null;
  return [...active].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))[0] ?? null;
}

function resolveLatestSimulation(input: {
  workspaceId: WorkspaceId;
  scenarios: readonly WorkspaceScenario[];
}): { scenario: WorkspaceScenario; simulation: WorkspaceScenarioSimulation } | null {
  let latest: { scenario: WorkspaceScenario; simulation: WorkspaceScenarioSimulation } | null = null;

  for (const scenario of input.scenarios) {
    const simulations = getWorkspaceScenarioSimulations(input.workspaceId, scenario.scenarioId);
    const simulation = [...simulations].sort((left, right) =>
      right.simulatedAt.localeCompare(left.simulatedAt)
    )[0];
    if (!simulation) continue;
    if (
      !latest ||
      simulation.simulatedAt.localeCompare(latest.simulation.simulatedAt) > 0
    ) {
      latest = Object.freeze({ scenario, simulation });
    }
  }

  return latest;
}

function resolveLatestComparisonSummary(workspaceId: WorkspaceId): string | null {
  const scenarios = getWorkspaceScenarios(workspaceId);
  let latestSummary: string | null = null;
  let latestGeneratedAt = "";

  for (let index = 0; index < scenarios.length; index += 1) {
    for (let otherIndex = index + 1; otherIndex < scenarios.length; otherIndex += 1) {
      const comparison = getLatestWorkspaceScenarioComparison(
        workspaceId,
        scenarios[index]!.scenarioId,
        scenarios[otherIndex]!.scenarioId
      );
      if (!comparison) continue;
      if (comparison.generatedAt.localeCompare(latestGeneratedAt) > 0) {
        latestGeneratedAt = comparison.generatedAt;
        latestSummary = comparison.comparisonSummary;
      }
    }
  }

  return latestSummary;
}

function insightReferencesObject(insight: WorkspaceScenarioInsight, objectId: string): boolean {
  const objectIds = new Set([
    ...insight.affectedObjects.map((item) => item.id),
    ...insight.attentionObjects.map((item) => item.id),
  ]);
  return objectIds.has(objectId);
}

function formatSimulationStatusLabel(
  simulation: WorkspaceScenarioSimulation | null
): string | null {
  if (!simulation) return null;
  return simulation.simulationStatus === "completed" ? "Completed" : simulation.simulationStatus;
}

function emitScenarioWorkspaceDiagnostic(summary: WorkspaceScenarioWorkspaceSummary): void {
  if (process.env.NODE_ENV === "production") return;
  devDiagnosticLog("scenarioWorkspace", NEXORA_SCENARIO_WORKSPACE_LOG_PREFIX, {
    workspaceId: summary.workspaceId,
    scenarioCount: summary.totalScenarios,
    activeScenario: summary.activeScenarioName,
    latestSimulation: summary.latestSimulationScenarioName,
    latestComparison: summary.latestComparisonSummary,
    tags: WORKSPACE_SCENARIO_WORKSPACE_INTEGRATION_TAGS,
    phase: "DS-7:5",
  });
}

export function buildWorkspaceScenarioWorkspaceSummary(
  workspaceId: WorkspaceId
): WorkspaceScenarioWorkspaceSummary {
  const trimmedWorkspaceId = normalizeWorkspaceId(workspaceId);
  if (!trimmedWorkspaceId) {
    return EMPTY_WORKSPACE_SCENARIO_SUMMARY;
  }

  const scenarios = getWorkspaceScenarios(trimmedWorkspaceId);
  const counts = { activeCount: 0, draftCount: 0, archivedCount: 0 };
  for (const scenario of scenarios) {
    incrementStatusCount(counts, scenario.status);
  }

  const activeScenario = resolveActiveScenario(scenarios);
  const latestSimulation = resolveLatestSimulation({
    workspaceId: trimmedWorkspaceId,
    scenarios,
  });
  const activeInsight = activeScenario
    ? getWorkspaceScenarioInsight(trimmedWorkspaceId, activeScenario.scenarioId)
    : null;
  const latestInsight = [...getWorkspaceScenarioInsights(trimmedWorkspaceId)].sort((left, right) =>
    right.generatedAt.localeCompare(left.generatedAt)
  )[0] ?? null;

  const summary = Object.freeze({
    contractVersion: WORKSPACE_SCENARIO_WORKSPACE_INTEGRATION_VERSION,
    workspaceId: trimmedWorkspaceId,
    totalScenarios: scenarios.length,
    activeCount: counts.activeCount,
    draftCount: counts.draftCount,
    archivedCount: counts.archivedCount,
    activeScenarioId: activeScenario?.scenarioId ?? null,
    activeScenarioName: activeScenario?.name ?? null,
    latestInsightSummary:
      activeInsight?.executiveSummary ?? latestInsight?.executiveSummary ?? null,
    latestSimulationScenarioName: latestSimulation?.scenario.name ?? null,
    latestSimulationStatus: formatSimulationStatusLabel(latestSimulation?.simulation ?? null),
    latestComparisonSummary: resolveLatestComparisonSummary(trimmedWorkspaceId),
    timelineStatus: "reserved" as const,
    generatedAt: nowIso(),
  });

  if (summary.totalScenarios > 0) {
    emitScenarioWorkspaceDiagnostic(summary);
  }

  return summary;
}

export function getWorkspaceScenarioWorkspaceSummary(
  workspaceId?: WorkspaceId | null
): WorkspaceScenarioWorkspaceSummary {
  return buildWorkspaceScenarioWorkspaceSummary(normalizeWorkspaceId(workspaceId));
}

export function resolveObjectScenarioSummaryState(
  input: ObjectScenarioSummaryInput
): ObjectScenarioSummaryState {
  const workspaceId = normalizeId(input.workspaceId);
  const objectId = normalizeId(input.objectId);

  if (!workspaceId || !objectId) {
    return EMPTY_OBJECT_SCENARIO_SUMMARY;
  }

  const insights = getWorkspaceScenarioInsights(workspaceId).filter((insight) =>
    insightReferencesObject(insight, objectId)
  );

  if (insights.length === 0) {
    return Object.freeze({
      items: Object.freeze([]),
      emptyMessage: "No scenarios linked to this object.",
      relatedScenarioCount: 0,
      latestSimulationLabel: null,
      latestComparisonLabel: null,
      timelineStatus: "reserved",
      visible: true,
    });
  }

  const items: ObjectScenarioSummaryItem[] = [];

  for (const insight of insights) {
    const scenario = getWorkspaceScenario(workspaceId, insight.scenarioId);
    if (!scenario) continue;
    const simulation = getLatestWorkspaceScenarioSimulation(workspaceId, insight.scenarioId);
    const comparisons = getWorkspaceScenarios(workspaceId)
      .filter((candidate) => candidate.scenarioId !== insight.scenarioId)
      .map((candidate) =>
        getLatestWorkspaceScenarioComparison(
          workspaceId,
          insight.scenarioId,
          candidate.scenarioId
        )
      )
      .filter(Boolean)
      .sort((left, right) => right!.generatedAt.localeCompare(left!.generatedAt));
    const latestComparison = comparisons[0] ?? null;

    items.push(
      Object.freeze({
        scenarioId: scenario.scenarioId,
        scenarioName: scenario.name,
        scenarioStatus: scenario.status,
        insightSummary: insight.executiveSummary,
        simulationStatus: formatSimulationStatusLabel(simulation),
        comparisonSummary: latestComparison?.comparisonSummary ?? null,
      })
    );
  }

  const sortedItems = Object.freeze(
    [...items].sort((left, right) => left.scenarioName.localeCompare(right.scenarioName))
  );

  const latestSimulation = resolveLatestSimulation({
    workspaceId,
    scenarios: sortedItems
      .map((item) => getWorkspaceScenario(workspaceId, item.scenarioId))
      .filter(Boolean) as WorkspaceScenario[],
  });

  const latestComparisonLabel =
    sortedItems
      .map((item) => item.comparisonSummary)
      .find((summary) => Boolean(summary)) ?? null;

  return Object.freeze({
    items: sortedItems,
    emptyMessage: null,
    relatedScenarioCount: sortedItems.length,
    latestSimulationLabel: latestSimulation
      ? `${latestSimulation.scenario.name}: ${formatSimulationStatusLabel(latestSimulation.simulation)}`
      : null,
    latestComparisonLabel,
    timelineStatus: "reserved",
    visible: true,
  });
}

export function formatWorkspaceScenarioSummaryPrimary(
  summary: WorkspaceScenarioWorkspaceSummary
): string {
  return `Scenarios: ${summary.totalScenarios}`;
}

export function formatWorkspaceScenarioSummarySecondary(
  summary: WorkspaceScenarioWorkspaceSummary
): string {
  const parts = [
    `Active: ${summary.activeCount}`,
    summary.draftCount > 0 ? `Draft: ${summary.draftCount}` : null,
    summary.latestSimulationScenarioName
      ? `Latest Simulation: ${summary.latestSimulationScenarioName} (${summary.latestSimulationStatus ?? "none"})`
      : "Latest Simulation: none",
    summary.latestComparisonSummary
      ? `Latest Comparison: ${summary.latestComparisonSummary}`
      : "Latest Comparison: none",
    `Timeline: ${summary.timelineStatus}`,
  ].filter(Boolean) as string[];

  return parts.join(" · ");
}

export function formatOperationalWorkspaceScenarioSignals(input: {
  summary: WorkspaceScenarioWorkspaceSummary;
}): string {
  if (input.summary.totalScenarios === 0) {
    return "No workspace scenarios available.";
  }

  const parts = [
    input.summary.activeScenarioName
      ? `Active Scenario: ${input.summary.activeScenarioName}`
      : null,
    input.summary.latestInsightSummary
      ? `Insight: ${input.summary.latestInsightSummary}`
      : null,
    input.summary.latestSimulationScenarioName
      ? `Simulation: ${input.summary.latestSimulationScenarioName}`
      : null,
    input.summary.latestComparisonSummary
      ? `Comparison: ${input.summary.latestComparisonSummary}`
      : null,
  ].filter(Boolean) as string[];

  return parts.length > 0 ? parts.join(" · ") : formatWorkspaceScenarioSummarySecondary(input.summary);
}

export function resetWorkspaceScenarioWorkspaceSummaryCacheForTests(): void {
  // Read-only runtime — no cached state to reset.
}
