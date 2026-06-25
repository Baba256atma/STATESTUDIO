/**
 * DS-7:4 — Workspace scenario comparison and decision analysis engine.
 * Read-only comparison of completed scenario simulations — no simulation, mutation, or recommendations.
 *
 * OWNERSHIP RULE
 * DS-7:4 owns Scenario Comparison and Decision Analysis ONLY.
 * DS-7:4 MUST NOT simulate, modify workspace/scenarios/KPIs/OKRs/risks, or execute decisions.
 */

import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import { getWorkspaceScenario } from "./workspaceScenarioContract.ts";
import {
  getLatestWorkspaceScenarioSimulation,
  getWorkspaceScenarioSimulation,
  type WorkspaceScenarioPredictedChange,
  type WorkspaceScenarioSimulation,
} from "./workspaceScenarioSimulationEngine.ts";

export const WORKSPACE_SCENARIO_COMPARISON_ENGINE_VERSION = "DS-7:4" as const;

export const WORKSPACE_SCENARIO_COMPARISON_ENGINE_TAGS = Object.freeze([
  "[DS74_SCENARIO_COMPARISON]",
  "[DECISION_ANALYSIS_READY]",
  "[BUSINESS_TRADEOFF_READY]",
  "[EXECUTIVE_QUESTIONS_READY]",
  "[DS75_READY]",
  "[DS_7_4_COMPLETE]",
] as const);

export const NEXORA_SCENARIO_COMPARISON_LOG_PREFIX = "[NexoraScenarioComparison]" as const;

export const WORKSPACE_SCENARIO_COMPARISON_ENGINE_SOURCE = "ds-7:4-comparison" as const;

export const WORKSPACE_SCENARIO_COMPARISON_STORAGE_KEY =
  "nexora.workspaceScenarioComparisons.v1" as const;

export const WORKSPACE_SCENARIO_COMPARISON_READ_APIS = Object.freeze([
  "getWorkspaceScenario",
  "getWorkspaceScenarioSimulation",
  "getLatestWorkspaceScenarioSimulation",
] as const);

export type WorkspaceScenarioDifferenceKind = "object" | "kpi" | "okr" | "risk";

export type WorkspaceScenarioDifference = Readonly<{
  id: string;
  label: string;
  kind: WorkspaceScenarioDifferenceKind;
  scenarioAChangePercent: number;
  scenarioBChangePercent: number;
  deltaPercent: number;
  strongerScenarioId: string | null;
  observation: string;
}>;

export type WorkspaceScenarioBusinessTradeoff = Readonly<{
  tradeoffId: string;
  benefit: string;
  cost: string;
  favoredScenarioId: string | null;
  observation: string;
}>;

export type WorkspaceScenarioComparison = Readonly<{
  contractVersion: typeof WORKSPACE_SCENARIO_COMPARISON_ENGINE_VERSION;
  comparisonId: string;
  workspaceId: WorkspaceId;
  scenarioAId: string;
  scenarioBId: string;
  simulationAId: string;
  simulationBId: string;
  comparisonSummary: string;
  objectDifferences: readonly WorkspaceScenarioDifference[];
  kpiDifferences: readonly WorkspaceScenarioDifference[];
  okrDifferences: readonly WorkspaceScenarioDifference[];
  riskDifferences: readonly WorkspaceScenarioDifference[];
  businessTradeoffs: readonly WorkspaceScenarioBusinessTradeoff[];
  decisionObservations: readonly string[];
  executiveQuestions: readonly string[];
  generatedAt: string;
  source: typeof WORKSPACE_SCENARIO_COMPARISON_ENGINE_SOURCE;
}>;

export type WorkspaceScenarioComparisonMap = Readonly<Record<string, WorkspaceScenarioComparison>>;

export type WorkspaceScenarioComparisonStore = Readonly<
  Record<WorkspaceId, WorkspaceScenarioComparisonMap>
>;

export type GenerateWorkspaceScenarioComparisonInput = Readonly<{
  workspaceId: WorkspaceId;
  scenarioAId: string;
  scenarioBId: string;
  simulationAId?: string;
  simulationBId?: string;
}>;

export type GenerateWorkspaceScenarioComparisonResult = Readonly<{
  success: boolean;
  workspaceId: WorkspaceId | null;
  scenarioAId: string | null;
  scenarioBId: string | null;
  comparison: WorkspaceScenarioComparison | null;
  reason: string;
  message: string;
}>;

const STORAGE_KEY = WORKSPACE_SCENARIO_COMPARISON_STORAGE_KEY;

const REVENUE_LABEL_PATTERN = /revenue|sales|forecast|growth/i;
const RISK_LABEL_PATTERN = /risk|inventory|operational|exposure/i;
const GROWTH_LABEL_PATTERN = /growth|sales|revenue|forecast/i;

let workspaceScenarioComparisonStore: WorkspaceScenarioComparisonStore = {};
let workspaceScenarioComparisonHydrated = false;
let workspaceScenarioComparisonVersion = 0;
let comparisonSequence = 0;

type WorkspaceScenarioComparisonListener = () => void;

const workspaceScenarioComparisonListeners = new Set<WorkspaceScenarioComparisonListener>();

function nowIso(): string {
  return new Date().toISOString();
}

function slugify(value: string): string {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 60) || "comparison"
  );
}

function roundPercent(value: number): number {
  return Math.round(value * 10) / 10;
}

function freezeComparison(comparison: WorkspaceScenarioComparison): WorkspaceScenarioComparison {
  return Object.freeze({ ...comparison });
}

function readStorage(): WorkspaceScenarioComparisonStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return Object.freeze(parsed as WorkspaceScenarioComparisonStore);
  } catch {
    return {};
  }
}

function writeStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaceScenarioComparisonStore));
  } catch {
    // Comparisons remain available in-memory if storage is unavailable.
  }
}

function hydrateWorkspaceScenarioComparisonStore(): void {
  if (workspaceScenarioComparisonHydrated) return;
  workspaceScenarioComparisonHydrated = true;
  workspaceScenarioComparisonStore = readStorage();
}

function notifyWorkspaceScenarioComparisonListeners(): void {
  workspaceScenarioComparisonVersion += 1;
  workspaceScenarioComparisonListeners.forEach((listener) => listener());
}

function commitWorkspaceScenarioComparisonChange(): void {
  writeStorage();
  notifyWorkspaceScenarioComparisonListeners();
}

function emitScenarioComparisonDiagnostic(comparison: WorkspaceScenarioComparison): void {
  if (process.env.NODE_ENV === "production") return;
  const differenceCount =
    comparison.objectDifferences.length +
    comparison.kpiDifferences.length +
    comparison.okrDifferences.length +
    comparison.riskDifferences.length;
  devDiagnosticLog("scenarioComparison", NEXORA_SCENARIO_COMPARISON_LOG_PREFIX, {
    workspaceId: comparison.workspaceId,
    scenarioAId: comparison.scenarioAId,
    scenarioBId: comparison.scenarioBId,
    differenceCount,
    tradeoffCount: comparison.businessTradeoffs.length,
    questionCount: comparison.executiveQuestions.length,
    tags: WORKSPACE_SCENARIO_COMPARISON_ENGINE_TAGS,
    phase: "DS-7:4",
  });
}

function changeMapFromSimulation(
  changes: readonly WorkspaceScenarioPredictedChange[]
): ReadonlyMap<string, WorkspaceScenarioPredictedChange> {
  return new Map(changes.map((change) => [change.id, change] as const));
}

function buildDifference(input: {
  id: string;
  label: string;
  kind: WorkspaceScenarioDifferenceKind;
  scenarioAId: string;
  scenarioBId: string;
  changeA: WorkspaceScenarioPredictedChange | undefined;
  changeB: WorkspaceScenarioPredictedChange | undefined;
}): WorkspaceScenarioDifference | null {
  const scenarioAChangePercent = roundPercent(input.changeA?.changePercent ?? 0);
  const scenarioBChangePercent = roundPercent(input.changeB?.changePercent ?? 0);
  const deltaPercent = roundPercent(scenarioAChangePercent - scenarioBChangePercent);

  if (scenarioAChangePercent === 0 && scenarioBChangePercent === 0) return null;

  const preferLower = input.kind === "risk";
  let strongerScenarioId: string | null = null;
  if (scenarioAChangePercent !== scenarioBChangePercent) {
    if (preferLower) {
      strongerScenarioId =
        scenarioAChangePercent < scenarioBChangePercent ? input.scenarioAId : input.scenarioBId;
    } else {
      strongerScenarioId =
        scenarioAChangePercent > scenarioBChangePercent ? input.scenarioAId : input.scenarioBId;
    }
  }

  const observation =
    strongerScenarioId === input.scenarioAId
      ? `Scenario A shows a ${preferLower ? "lower" : "higher"} projected change for ${input.label}.`
      : strongerScenarioId === input.scenarioBId
        ? `Scenario B shows a ${preferLower ? "lower" : "higher"} projected change for ${input.label}.`
        : `Scenario A and Scenario B project identical changes for ${input.label}.`;

  return Object.freeze({
    id: input.id,
    label: input.label,
    kind: input.kind,
    scenarioAChangePercent,
    scenarioBChangePercent,
    deltaPercent,
    strongerScenarioId,
    observation,
  });
}

function buildEntityDifferences(input: {
  kind: WorkspaceScenarioDifferenceKind;
  scenarioAId: string;
  scenarioBId: string;
  changesA: readonly WorkspaceScenarioPredictedChange[];
  changesB: readonly WorkspaceScenarioPredictedChange[];
}): readonly WorkspaceScenarioDifference[] {
  const mapA = changeMapFromSimulation(input.changesA);
  const mapB = changeMapFromSimulation(input.changesB);
  const ids = Object.freeze([...new Set([...mapA.keys(), ...mapB.keys()])]);

  return Object.freeze(
    ids
      .map((id) => {
        const changeA = mapA.get(id);
        const changeB = mapB.get(id);
        return buildDifference({
          id,
          label: changeA?.label ?? changeB?.label ?? id,
          kind: input.kind,
          scenarioAId: input.scenarioAId,
          scenarioBId: input.scenarioBId,
          changeA,
          changeB,
        });
      })
      .filter((difference): difference is WorkspaceScenarioDifference => difference !== null)
      .sort((left, right) => Math.abs(right.deltaPercent) - Math.abs(left.deltaPercent))
  );
}

function sumMatchingChangePercent(
  differences: readonly WorkspaceScenarioDifference[],
  pattern: RegExp
): number {
  return roundPercent(
    differences
      .filter((difference) => pattern.test(difference.label))
      .reduce((total, difference) => total + difference.deltaPercent, 0)
  );
}

export function buildWorkspaceScenarioDecisionObservations(input: {
  scenarioAId: string;
  scenarioBId: string;
  kpiDifferences: readonly WorkspaceScenarioDifference[];
  okrDifferences: readonly WorkspaceScenarioDifference[];
  riskDifferences: readonly WorkspaceScenarioDifference[];
}): readonly string[] {
  const observations: string[] = [];

  const revenueDelta = sumMatchingChangePercent(input.kpiDifferences, REVENUE_LABEL_PATTERN);
  if (revenueDelta > 0) {
    observations.push("Scenario A improves revenue KPIs.");
  } else if (revenueDelta < 0) {
    observations.push("Scenario B improves revenue KPIs.");
  }

  const riskDelta = sumMatchingChangePercent(input.riskDifferences, RISK_LABEL_PATTERN);
  if (riskDelta > 0) {
    observations.push("Scenario A increases operational risks.");
  } else if (riskDelta < 0) {
    observations.push("Scenario B reduces operational risks.");
  }

  const growthDelta = sumMatchingChangePercent(input.okrDifferences, GROWTH_LABEL_PATTERN);
  if (growthDelta > 0) {
    observations.push("Scenario A better supports strategic growth objectives.");
  } else if (growthDelta < 0) {
    observations.push("Scenario B delays strategic growth relative to Scenario A.");
  }

  const inventoryRisk = input.riskDifferences.find((difference) =>
    /inventory/i.test(difference.label)
  );
  if (inventoryRisk && inventoryRisk.deltaPercent > 0) {
    observations.push("Scenario A increases inventory exposure.");
  } else if (inventoryRisk && inventoryRisk.deltaPercent < 0) {
    observations.push("Scenario B lowers inventory exposure relative to Scenario A.");
  }

  if (observations.length === 0) {
    observations.push("Both scenarios project comparable business outcomes across measured dimensions.");
  }

  return Object.freeze(observations);
}

export function buildWorkspaceScenarioBusinessTradeoffs(input: {
  scenarioAId: string;
  scenarioBId: string;
  kpiDifferences: readonly WorkspaceScenarioDifference[];
  okrDifferences: readonly WorkspaceScenarioDifference[];
  riskDifferences: readonly WorkspaceScenarioDifference[];
}): readonly WorkspaceScenarioBusinessTradeoff[] {
  const tradeoffs: WorkspaceScenarioBusinessTradeoff[] = [];
  let tradeoffSequence = 0;

  const growthDelta = sumMatchingChangePercent(
    [...input.kpiDifferences, ...input.okrDifferences],
    GROWTH_LABEL_PATTERN
  );
  const riskDelta = sumMatchingChangePercent(input.riskDifferences, RISK_LABEL_PATTERN);

  if (growthDelta !== 0 || riskDelta !== 0) {
    tradeoffSequence += 1;
    tradeoffs.push(
      Object.freeze({
        tradeoffId: `tradeoff_growth_risk_${tradeoffSequence}`,
        benefit: growthDelta >= 0 ? "Higher growth" : "Lower operational exposure",
        cost: growthDelta >= 0 ? "Higher operational risk" : "Lower growth",
        favoredScenarioId: growthDelta >= 0 ? input.scenarioAId : input.scenarioBId,
        observation:
          growthDelta >= 0
            ? "Scenario A favors higher growth with higher inventory risk."
            : "Scenario B favors lower growth with lower operational exposure.",
      })
    );
  }

  const inventoryRisk = input.riskDifferences.find((difference) =>
    /inventory/i.test(difference.label)
  );
  const salesGrowth = input.okrDifferences.find((difference) => /sales|growth/i.test(difference.label));

  if (inventoryRisk && salesGrowth && inventoryRisk.deltaPercent !== 0) {
    tradeoffSequence += 1;
    tradeoffs.push(
      Object.freeze({
        tradeoffId: `tradeoff_inventory_sales_${tradeoffSequence}`,
        benefit: inventoryRisk.deltaPercent < 0 ? "Lower inventory" : "Higher sales growth",
        cost: inventoryRisk.deltaPercent < 0 ? "Lower sales growth" : "Higher inventory exposure",
        favoredScenarioId:
          inventoryRisk.deltaPercent < 0 ? input.scenarioBId : input.scenarioAId,
        observation:
          inventoryRisk.deltaPercent > 0
            ? "Higher demand in Scenario A increases inventory exposure alongside growth."
            : "Scenario B trades lower inventory pressure for reduced growth momentum.",
      })
    );
  }

  const revenueKpi = input.kpiDifferences.find((difference) =>
    REVENUE_LABEL_PATTERN.test(difference.label)
  );
  if (revenueKpi && Math.abs(revenueKpi.deltaPercent) >= 1) {
    tradeoffSequence += 1;
    tradeoffs.push(
      Object.freeze({
        tradeoffId: `tradeoff_revenue_cost_${tradeoffSequence}`,
        benefit: "Higher customer satisfaction",
        cost: "Higher operating cost",
        favoredScenarioId:
          revenueKpi.deltaPercent > 0 ? input.scenarioAId : input.scenarioBId,
        observation:
          revenueKpi.deltaPercent > 0
            ? "Scenario A projects stronger revenue KPI movement with associated operating pressure."
            : "Scenario B projects moderated revenue KPI movement with lower operating pressure.",
      })
    );
  }

  if (tradeoffs.length === 0) {
    tradeoffs.push(
      Object.freeze({
        tradeoffId: "tradeoff_balanced_outcomes",
        benefit: "Balanced projected outcomes",
        cost: "Limited differentiation between scenarios",
        favoredScenarioId: null,
        observation: "Neither scenario shows a dominant tradeoff across projected dimensions.",
      })
    );
  }

  return Object.freeze(tradeoffs);
}

export function buildWorkspaceScenarioComparisonExecutiveQuestions(input: {
  businessTradeoffs: readonly WorkspaceScenarioBusinessTradeoff[];
  kpiDifferences: readonly WorkspaceScenarioDifference[];
  riskDifferences: readonly WorkspaceScenarioDifference[];
  scenarioAId: string;
}): readonly string[] {
  const topKpi = [...input.kpiDifferences].sort(
    (left, right) => Math.abs(right.deltaPercent) - Math.abs(left.deltaPercent)
  )[0];
  const topRisk = [...input.riskDifferences].sort(
    (left, right) => Math.abs(right.deltaPercent) - Math.abs(left.deltaPercent)
  )[0];
  const primaryTradeoff = input.businessTradeoffs[0];

  const questions = [
    primaryTradeoff
      ? `Which tradeoff is acceptable? (${primaryTradeoff.benefit} vs ${primaryTradeoff.cost})`
      : "Which tradeoff is acceptable?",
    topKpi
      ? `Which KPI matters most? (${topKpi.label}: delta ${topKpi.deltaPercent}%)`
      : "Which KPI matters most?",
    topRisk
      ? `Can additional investment reduce this risk? (${topRisk.label})`
      : "Can additional investment reduce this risk?",
    /inventory/i.test(topRisk?.label ?? "") || /inventory/i.test(primaryTradeoff?.cost ?? "")
      ? "Should additional inventory investment support Scenario A?"
      : "Is growth worth increased operational exposure?",
  ];

  return Object.freeze(questions);
}

export function buildWorkspaceScenarioComparisonSummary(input: {
  scenarioAId: string;
  scenarioBId: string;
  kpiDifferences: readonly WorkspaceScenarioDifference[];
  okrDifferences: readonly WorkspaceScenarioDifference[];
  riskDifferences: readonly WorkspaceScenarioDifference[];
  decisionObservations: readonly string[];
}): string {
  const revenueDiff = input.kpiDifferences.find((difference) =>
    REVENUE_LABEL_PATTERN.test(difference.label)
  );
  const topRisk = [...input.riskDifferences].sort(
    (left, right) => Math.abs(right.deltaPercent) - Math.abs(left.deltaPercent)
  )[0];

  const parts: string[] = [];

  if (revenueDiff && revenueDiff.strongerScenarioId === input.scenarioAId) {
    parts.push("Scenario A projects stronger revenue KPI movement");
  } else if (revenueDiff && revenueDiff.strongerScenarioId === input.scenarioBId) {
    parts.push("Scenario B projects stronger revenue KPI movement");
  }

  if (topRisk && topRisk.strongerScenarioId === input.scenarioBId) {
    parts.push("Scenario B carries lower projected risk");
  } else if (topRisk && topRisk.strongerScenarioId === input.scenarioAId) {
    parts.push("Scenario A carries higher projected risk");
  }

  if (parts.length === 0 && input.decisionObservations.length > 0) {
    return `${input.decisionObservations[0]} ${input.decisionObservations[1] ?? ""}`.trim();
  }

  if (parts.length === 0) {
    return "Both scenarios project comparable outcomes across simulation results.";
  }

  if (parts.length === 1) {
    return `${parts[0]}.`;
  }

  return `${parts[0]}, while ${parts[1].charAt(0).toLowerCase()}${parts[1].slice(1)}.`;
}

export function compareWorkspaceScenarioSimulations(input: {
  workspaceId: WorkspaceId;
  scenarioAId: string;
  scenarioBId: string;
  simulationA: WorkspaceScenarioSimulation;
  simulationB: WorkspaceScenarioSimulation;
}): Omit<WorkspaceScenarioComparison, "comparisonId" | "generatedAt"> {
  const objectDifferences = buildEntityDifferences({
    kind: "object",
    scenarioAId: input.scenarioAId,
    scenarioBId: input.scenarioBId,
    changesA: input.simulationA.predictedObjectChanges,
    changesB: input.simulationB.predictedObjectChanges,
  });
  const kpiDifferences = buildEntityDifferences({
    kind: "kpi",
    scenarioAId: input.scenarioAId,
    scenarioBId: input.scenarioBId,
    changesA: input.simulationA.predictedKpiChanges,
    changesB: input.simulationB.predictedKpiChanges,
  });
  const okrDifferences = buildEntityDifferences({
    kind: "okr",
    scenarioAId: input.scenarioAId,
    scenarioBId: input.scenarioBId,
    changesA: input.simulationA.predictedOkrChanges,
    changesB: input.simulationB.predictedOkrChanges,
  });
  const riskDifferences = buildEntityDifferences({
    kind: "risk",
    scenarioAId: input.scenarioAId,
    scenarioBId: input.scenarioBId,
    changesA: input.simulationA.predictedRiskChanges,
    changesB: input.simulationB.predictedRiskChanges,
  });

  const decisionObservations = buildWorkspaceScenarioDecisionObservations({
    scenarioAId: input.scenarioAId,
    scenarioBId: input.scenarioBId,
    kpiDifferences,
    okrDifferences,
    riskDifferences,
  });

  const businessTradeoffs = buildWorkspaceScenarioBusinessTradeoffs({
    scenarioAId: input.scenarioAId,
    scenarioBId: input.scenarioBId,
    kpiDifferences,
    okrDifferences,
    riskDifferences,
  });

  const executiveQuestions = buildWorkspaceScenarioComparisonExecutiveQuestions({
    businessTradeoffs,
    kpiDifferences,
    riskDifferences,
    scenarioAId: input.scenarioAId,
  });

  const comparisonSummary = buildWorkspaceScenarioComparisonSummary({
    scenarioAId: input.scenarioAId,
    scenarioBId: input.scenarioBId,
    kpiDifferences,
    okrDifferences,
    riskDifferences,
    decisionObservations,
  });

  return Object.freeze({
    contractVersion: WORKSPACE_SCENARIO_COMPARISON_ENGINE_VERSION,
    workspaceId: input.workspaceId,
    scenarioAId: input.scenarioAId,
    scenarioBId: input.scenarioBId,
    simulationAId: input.simulationA.simulationId,
    simulationBId: input.simulationB.simulationId,
    comparisonSummary,
    objectDifferences,
    kpiDifferences,
    okrDifferences,
    riskDifferences,
    businessTradeoffs,
    decisionObservations,
    executiveQuestions,
    source: WORKSPACE_SCENARIO_COMPARISON_ENGINE_SOURCE,
  });
}

function resolveSimulation(
  workspaceId: WorkspaceId,
  scenarioId: string,
  simulationId?: string
): WorkspaceScenarioSimulation | null {
  if (simulationId?.trim()) {
    return getWorkspaceScenarioSimulation(workspaceId, scenarioId, simulationId);
  }
  return getLatestWorkspaceScenarioSimulation(workspaceId, scenarioId);
}

export function generateWorkspaceScenarioComparison(
  input: GenerateWorkspaceScenarioComparisonInput
): GenerateWorkspaceScenarioComparisonResult {
  hydrateWorkspaceScenarioComparisonStore();
  const trimmedWorkspaceId = input.workspaceId.trim();
  const trimmedScenarioAId = input.scenarioAId.trim();
  const trimmedScenarioBId = input.scenarioBId.trim();

  if (!trimmedWorkspaceId || !trimmedScenarioAId || !trimmedScenarioBId) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId || null,
      scenarioAId: trimmedScenarioAId || null,
      scenarioBId: trimmedScenarioBId || null,
      comparison: null,
      reason: "missing_identifier",
      message: "Provide workspace and scenario identifiers before comparison.",
    });
  }

  if (trimmedScenarioAId === trimmedScenarioBId) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      scenarioAId: trimmedScenarioAId,
      scenarioBId: trimmedScenarioBId,
      comparison: null,
      reason: "identical_scenarios",
      message: "Scenario A and Scenario B must differ for comparison.",
    });
  }

  const scenarioA = getWorkspaceScenario(trimmedWorkspaceId, trimmedScenarioAId);
  const scenarioB = getWorkspaceScenario(trimmedWorkspaceId, trimmedScenarioBId);
  if (!scenarioA || !scenarioB) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      scenarioAId: trimmedScenarioAId,
      scenarioBId: trimmedScenarioBId,
      comparison: null,
      reason: "scenario_not_found",
      message: "Both scenarios must exist before comparison.",
    });
  }

  const simulationA = resolveSimulation(
    trimmedWorkspaceId,
    trimmedScenarioAId,
    input.simulationAId
  );
  const simulationB = resolveSimulation(
    trimmedWorkspaceId,
    trimmedScenarioBId,
    input.simulationBId
  );

  if (!simulationA || simulationA.simulationStatus !== "completed") {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      scenarioAId: trimmedScenarioAId,
      scenarioBId: trimmedScenarioBId,
      comparison: null,
      reason: "simulation_a_missing",
      message: "Scenario A requires a completed simulation before comparison.",
    });
  }

  if (!simulationB || simulationB.simulationStatus !== "completed") {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      scenarioAId: trimmedScenarioAId,
      scenarioBId: trimmedScenarioBId,
      comparison: null,
      reason: "simulation_b_missing",
      message: "Scenario B requires a completed simulation before comparison.",
    });
  }

  comparisonSequence += 1;
  const generatedAt = nowIso();
  const comparisonId = `comparison_${slugify(trimmedScenarioAId)}_${slugify(trimmedScenarioBId)}_${comparisonSequence}`;
  const comparison = freezeComparison(
    Object.freeze({
      ...compareWorkspaceScenarioSimulations({
        workspaceId: trimmedWorkspaceId,
        scenarioAId: trimmedScenarioAId,
        scenarioBId: trimmedScenarioBId,
        simulationA,
        simulationB,
      }),
      comparisonId,
      generatedAt,
    })
  );

  workspaceScenarioComparisonStore = Object.freeze({
    ...workspaceScenarioComparisonStore,
    [trimmedWorkspaceId]: Object.freeze({
      ...workspaceScenarioComparisonStore[trimmedWorkspaceId],
      [comparisonId]: comparison,
    }),
  });
  commitWorkspaceScenarioComparisonChange();
  emitScenarioComparisonDiagnostic(comparison);

  return Object.freeze({
    success: true,
    workspaceId: trimmedWorkspaceId,
    scenarioAId: trimmedScenarioAId,
    scenarioBId: trimmedScenarioBId,
    comparison,
    reason: "compared",
    message: `Scenario comparison generated for "${scenarioA.name}" and "${scenarioB.name}".`,
  });
}

export function getWorkspaceScenarioComparison(
  workspaceId: WorkspaceId,
  comparisonId: string
): WorkspaceScenarioComparison | null {
  hydrateWorkspaceScenarioComparisonStore();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedComparisonId = comparisonId.trim();
  if (!trimmedWorkspaceId || !trimmedComparisonId) return null;
  const match = workspaceScenarioComparisonStore[trimmedWorkspaceId]?.[trimmedComparisonId] ?? null;
  return match ? freezeComparison(match) : null;
}

export function getWorkspaceScenarioComparisons(
  workspaceId: WorkspaceId
): readonly WorkspaceScenarioComparison[] {
  hydrateWorkspaceScenarioComparisonStore();
  const trimmedWorkspaceId = workspaceId.trim();
  if (!trimmedWorkspaceId) return Object.freeze([]);
  return Object.freeze(
    Object.values(workspaceScenarioComparisonStore[trimmedWorkspaceId] ?? {}).map(freezeComparison)
  );
}

export function getLatestWorkspaceScenarioComparison(
  workspaceId: WorkspaceId,
  scenarioAId: string,
  scenarioBId: string
): WorkspaceScenarioComparison | null {
  const comparisons = getWorkspaceScenarioComparisons(workspaceId).filter(
    (comparison) =>
      (comparison.scenarioAId === scenarioAId && comparison.scenarioBId === scenarioBId) ||
      (comparison.scenarioAId === scenarioBId && comparison.scenarioBId === scenarioAId)
  );
  if (comparisons.length === 0) return null;
  return [...comparisons].sort((left, right) =>
    right.generatedAt.localeCompare(left.generatedAt)
  )[0] ?? null;
}

export function subscribeWorkspaceScenarioComparisonRegistry(
  listener: WorkspaceScenarioComparisonListener
): () => void {
  hydrateWorkspaceScenarioComparisonStore();
  workspaceScenarioComparisonListeners.add(listener);
  return () => workspaceScenarioComparisonListeners.delete(listener);
}

export function getWorkspaceScenarioComparisonRegistryVersion(): number {
  hydrateWorkspaceScenarioComparisonStore();
  return workspaceScenarioComparisonVersion;
}

export function resetWorkspaceScenarioComparisonStoreForTests(): void {
  workspaceScenarioComparisonStore = {};
  workspaceScenarioComparisonHydrated = false;
  workspaceScenarioComparisonVersion = 0;
  comparisonSequence = 0;
  workspaceScenarioComparisonListeners.clear();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Test cleanup best effort only.
    }
  }
}

export function resetWorkspaceScenarioComparisonMemoryForTests(): void {
  workspaceScenarioComparisonStore = {};
  workspaceScenarioComparisonHydrated = false;
  workspaceScenarioComparisonVersion = 0;
}

export function resetWorkspaceScenarioComparisonSequencesForTests(): void {
  comparisonSequence = 0;
}
