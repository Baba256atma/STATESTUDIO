/**
 * DS-7:3 — Workspace scenario assumptions and simulation engine.
 * Deterministic simulation on isolated scenario copies — read-only workspace intelligence.
 *
 * OWNERSHIP RULE
 * DS-7:3 owns Scenario Assumptions, Scenario Overrides, and Simulation Results ONLY.
 * DS-7:3 MUST NOT modify objects, KPIs, OKRs, risks, relationships, or workspace stores.
 */

import { getWorkspaceKpis } from "../kpi/workspaceKpiContract.ts";
import { getWorkspaceKpiHealthProfiles } from "../kpi/workspaceKpiHealthEngine.ts";
import { getWorkspaceObjective } from "../okr/workspaceOkrContract.ts";
import { getWorkspaceOkrHealthProfiles } from "../okr/workspaceOkrHealthEngine.ts";
import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import { getObjectIntelligenceProfiles } from "../workspace/workspaceObjectIntelligenceContract.ts";
import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import { getDetectedWorkspaceRisks } from "../risk/workspaceRiskDetectionEngine.ts";
import { getWorkspaceRiskSeverityProfiles } from "../risk/workspaceRiskSeverityEngine.ts";
import { getWorkspaceScenario, type WorkspaceScenario } from "./workspaceScenarioContract.ts";
import { getWorkspaceScenarioInsight } from "./workspaceScenarioInsightEngine.ts";

export const WORKSPACE_SCENARIO_SIMULATION_ENGINE_VERSION = "DS-7:3" as const;

export const WORKSPACE_SCENARIO_SIMULATION_ENGINE_TAGS = Object.freeze([
  "[DS73_SCENARIO_SIMULATION]",
  "[SCENARIO_ASSUMPTIONS_READY]",
  "[SCENARIO_SIMULATION_READY]",
  "[DETERMINISTIC_SIMULATION]",
  "[DS74_READY]",
  "[DS_7_3_COMPLETE]",
] as const);

export const NEXORA_SCENARIO_SIMULATION_LOG_PREFIX = "[NexoraScenarioSimulation]" as const;

export const WORKSPACE_SCENARIO_SIMULATION_ENGINE_SOURCE = "ds-7:3-simulation" as const;

export const WORKSPACE_SCENARIO_SIMULATION_STORAGE_KEY =
  "nexora.workspaceScenarioSimulations.v1" as const;

export const WORKSPACE_SCENARIO_SIMULATION_READ_APIS = Object.freeze([
  "getWorkspaceScenario",
  "getWorkspaceScenarioInsight",
  "getObjectIntelligenceProfiles",
  "getWorkspaceKpiHealthProfiles",
  "getWorkspaceKpis",
  "getWorkspaceOkrHealthProfiles",
  "getWorkspaceObjective",
  "getWorkspaceRiskSeverityProfiles",
  "getDetectedWorkspaceRisks",
] as const);

export type WorkspaceScenarioAssumptionType =
  | "percentage"
  | "fixed_value"
  | "boolean"
  | "time_delay"
  | "multiplier"
  | "custom";

export type WorkspaceScenarioAssumptionTargetKind =
  | "general"
  | "kpi"
  | "okr"
  | "risk"
  | "object";

export type WorkspaceScenarioAssumption = Readonly<{
  assumptionId: string;
  label: string;
  targetKind: WorkspaceScenarioAssumptionTargetKind;
  targetId: string | null;
  assumptionType: WorkspaceScenarioAssumptionType;
  value: string | number | boolean;
  unit: string | null;
}>;

export type WorkspaceScenarioOverrideTargetKind =
  | "scenario"
  | "kpi"
  | "okr"
  | "risk"
  | "object";

export type WorkspaceScenarioOverride = Readonly<{
  overrideId: string;
  field: string;
  value: string | number | boolean;
  targetKind: WorkspaceScenarioOverrideTargetKind;
  targetId: string;
}>;

export type WorkspaceScenarioSimulationStatus = "pending" | "completed" | "failed";

export type WorkspaceScenarioPredictedChange = Readonly<{
  id: string;
  label: string;
  baselineValue: number;
  predictedValue: number;
  changePercent: number;
  changeReason: string;
}>;

export type WorkspaceScenarioSimulation = Readonly<{
  contractVersion: typeof WORKSPACE_SCENARIO_SIMULATION_ENGINE_VERSION;
  simulationId: string;
  workspaceId: WorkspaceId;
  scenarioId: string;
  assumptions: readonly WorkspaceScenarioAssumption[];
  overrides: readonly WorkspaceScenarioOverride[];
  simulationStatus: WorkspaceScenarioSimulationStatus;
  predictedObjectChanges: readonly WorkspaceScenarioPredictedChange[];
  predictedKpiChanges: readonly WorkspaceScenarioPredictedChange[];
  predictedOkrChanges: readonly WorkspaceScenarioPredictedChange[];
  predictedRiskChanges: readonly WorkspaceScenarioPredictedChange[];
  simulationSummary: string;
  executiveQuestions: readonly string[];
  simulatedAt: string;
  source: typeof WORKSPACE_SCENARIO_SIMULATION_ENGINE_SOURCE;
}>;

export type WorkspaceScenarioSimulationMap = Readonly<Record<string, WorkspaceScenarioSimulation>>;

export type WorkspaceScenarioSimulationStore = Readonly<
  Record<WorkspaceId, Record<string, WorkspaceScenarioSimulationMap>>
>;

export type CreateWorkspaceScenarioAssumptionInput = Readonly<{
  label: string;
  targetKind?: WorkspaceScenarioAssumptionTargetKind;
  targetId?: string | null;
  assumptionType: WorkspaceScenarioAssumptionType;
  value: string | number | boolean;
  unit?: string | null;
}>;

export type CreateWorkspaceScenarioOverrideInput = Readonly<{
  field: string;
  value: string | number | boolean;
  targetKind: WorkspaceScenarioOverrideTargetKind;
  targetId: string;
}>;

export type RunWorkspaceScenarioSimulationInput = Readonly<{
  workspaceId: WorkspaceId;
  scenarioId: string;
  assumptions: readonly WorkspaceScenarioAssumption[];
  overrides?: readonly WorkspaceScenarioOverride[];
}>;

export type RunWorkspaceScenarioSimulationResult = Readonly<{
  success: boolean;
  workspaceId: WorkspaceId | null;
  scenarioId: string | null;
  simulation: WorkspaceScenarioSimulation | null;
  reason: string;
  message: string;
}>;

const STORAGE_KEY = WORKSPACE_SCENARIO_SIMULATION_STORAGE_KEY;

const ASSUMPTION_TYPES = new Set<WorkspaceScenarioAssumptionType>([
  "percentage",
  "fixed_value",
  "boolean",
  "time_delay",
  "multiplier",
  "custom",
]);

const ASSUMPTION_TARGET_HINTS: Readonly<Record<string, readonly string[]>> = Object.freeze({
  demand: Object.freeze(["forecast", "inventory", "revenue"]),
  marketing: Object.freeze(["sales", "growth", "revenue"]),
  revenue: Object.freeze(["revenue", "sales"]),
  inventory: Object.freeze(["inventory", "warehouse", "supply"]),
  hiring: Object.freeze(["operations", "cost", "sales"]),
  supplier: Object.freeze(["supply", "inventory", "warehouse"]),
  forecast: Object.freeze(["forecast"]),
});

const DETERMINISTIC_MATCH_WEIGHTS: Readonly<
  Record<string, Readonly<Record<string, number>>>
> = Object.freeze({
  demand: Object.freeze({
    forecast: 0.4,
    inventory: 0.6,
  }),
  marketing: Object.freeze({
    sales: 0.6,
    revenue: 0.5,
    growth: 0.4,
  }),
  inventory: Object.freeze({
    inventory: 1.0,
    warehouse: 0.8,
  }),
  revenue: Object.freeze({
    revenue: 1.0,
    sales: 0.7,
  }),
});

let workspaceScenarioSimulationStore: WorkspaceScenarioSimulationStore = {};
let workspaceScenarioSimulationHydrated = false;
let workspaceScenarioSimulationVersion = 0;
let assumptionSequence = 0;
let overrideSequence = 0;
let simulationSequence = 0;

type WorkspaceScenarioSimulationListener = () => void;

const workspaceScenarioSimulationListeners = new Set<WorkspaceScenarioSimulationListener>();

function nowIso(): string {
  return new Date().toISOString();
}

function tokenize(value: string): readonly string[] {
  return Object.freeze(
    value
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length >= 3)
  );
}

function slugify(value: string): string {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 60) || "assumption"
  );
}

function freezeSimulation(simulation: WorkspaceScenarioSimulation): WorkspaceScenarioSimulation {
  return Object.freeze({ ...simulation });
}

function readStorage(): WorkspaceScenarioSimulationStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return Object.freeze(parsed as WorkspaceScenarioSimulationStore);
  } catch {
    return {};
  }
}

function writeStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaceScenarioSimulationStore));
  } catch {
    // Simulations remain available in-memory if storage is unavailable.
  }
}

function hydrateWorkspaceScenarioSimulationStore(): void {
  if (workspaceScenarioSimulationHydrated) return;
  workspaceScenarioSimulationHydrated = true;
  workspaceScenarioSimulationStore = readStorage();
}

function notifyWorkspaceScenarioSimulationListeners(): void {
  workspaceScenarioSimulationVersion += 1;
  workspaceScenarioSimulationListeners.forEach((listener) => listener());
}

function commitWorkspaceScenarioSimulationChange(): void {
  writeStorage();
  notifyWorkspaceScenarioSimulationListeners();
}

function emitScenarioSimulationDiagnostic(simulation: WorkspaceScenarioSimulation): void {
  if (process.env.NODE_ENV === "production") return;
  devDiagnosticLog("scenarioSimulation", NEXORA_SCENARIO_SIMULATION_LOG_PREFIX, {
    workspaceId: simulation.workspaceId,
    scenarioId: simulation.scenarioId,
    assumptionCount: simulation.assumptions.length,
    objectChanges: simulation.predictedObjectChanges.length,
    kpiChanges: simulation.predictedKpiChanges.length,
    riskChanges: simulation.predictedRiskChanges.length,
    simulationStatus: simulation.simulationStatus,
    tags: WORKSPACE_SCENARIO_SIMULATION_ENGINE_TAGS,
    phase: "DS-7:3",
  });
}

function resolveAssumptionMatchWeight(assumptionLabel: string, targetLabel: string): number {
  const assumptionKey = slugify(assumptionLabel);
  const targetKey = tokenize(targetLabel).join("_");

  const explicitWeights = DETERMINISTIC_MATCH_WEIGHTS[assumptionKey];
  if (explicitWeights) {
    for (const [hint, weight] of Object.entries(explicitWeights)) {
      if (targetKey.includes(hint) || targetLabel.toLowerCase().includes(hint)) {
        return weight;
      }
    }
  }

  const assumptionTokens = tokenize(assumptionLabel);
  const targetTokens = new Set(tokenize(targetLabel));
  for (const token of assumptionTokens) {
    if (targetTokens.has(token)) return 1;
    const hints = ASSUMPTION_TARGET_HINTS[token] ?? [];
    for (const hint of hints) {
      if (targetLabel.toLowerCase().includes(hint)) return 0.5;
    }
  }
  return 0;
}

function parseAssumptionDeltaPercent(assumption: WorkspaceScenarioAssumption): number {
  switch (assumption.assumptionType) {
    case "percentage":
      return typeof assumption.value === "number" ? assumption.value : Number(assumption.value);
    case "multiplier":
      return typeof assumption.value === "number"
        ? (assumption.value - 1) * 100
        : (Number(assumption.value) - 1) * 100;
    case "fixed_value":
      return typeof assumption.value === "number" ? assumption.value : Number(assumption.value);
    case "time_delay":
      return typeof assumption.value === "number"
        ? assumption.value * 0.05
        : Number(assumption.value) * 0.05;
    case "boolean":
      if (assumption.value === false || assumption.value === "freeze") return 0;
      return assumption.value === true ? 5 : 0;
    default:
      return 2;
  }
}

function roundPercent(value: number): number {
  return Math.round(value * 10) / 10;
}

function roundMetric(value: number): number {
  return Math.round(value * 100) / 100;
}

function applyTemporaryScenarioOverrides(
  scenario: WorkspaceScenario,
  overrides: readonly WorkspaceScenarioOverride[]
): WorkspaceScenario {
  let copy = { ...scenario };
  for (const override of overrides) {
    if (override.targetKind !== "scenario" || override.targetId !== scenario.scenarioId) continue;
    if (override.field === "name" && typeof override.value === "string") {
      copy = { ...copy, name: override.value };
    }
    if (override.field === "description" && typeof override.value === "string") {
      copy = { ...copy, description: override.value };
    }
    if (override.field === "status" && typeof override.value === "string") {
      copy = { ...copy, status: override.value as WorkspaceScenario["status"] };
    }
  }
  return Object.freeze(copy);
}

function buildPredictedChange(input: {
  id: string;
  label: string;
  baselineValue: number;
  changePercent: number;
  changeReason: string;
}): WorkspaceScenarioPredictedChange {
  const predictedValue = roundMetric(input.baselineValue * (1 + input.changePercent / 100));
  return Object.freeze({
    id: input.id,
    label: input.label,
    baselineValue: roundMetric(input.baselineValue),
    predictedValue,
    changePercent: roundPercent(input.changePercent),
    changeReason: input.changeReason,
  });
}

function computeEntityChangePercent(input: {
  assumptions: readonly WorkspaceScenarioAssumption[];
  targetLabel: string;
  targetKind: WorkspaceScenarioAssumptionTargetKind;
  targetId: string;
}): { changePercent: number; reasons: string[] } {
  let changePercent = 0;
  const reasons: string[] = [];

  for (const assumption of input.assumptions) {
    if (
      assumption.targetKind !== "general" &&
      assumption.targetKind !== input.targetKind &&
      assumption.targetId &&
      assumption.targetId !== input.targetId
    ) {
      continue;
    }
    if (assumption.targetId && assumption.targetId !== input.targetId) continue;

    const weight = resolveAssumptionMatchWeight(assumption.label, input.targetLabel);
    if (weight <= 0) continue;

    const delta = parseAssumptionDeltaPercent(assumption) * weight;
    if (delta === 0) continue;
    changePercent += delta;
    reasons.push(`${assumption.label} ${assumption.assumptionType} applied`);
  }

  return { changePercent: roundPercent(changePercent), reasons };
}

export function createWorkspaceScenarioAssumption(
  input: CreateWorkspaceScenarioAssumptionInput
): WorkspaceScenarioAssumption | null {
  const label = input.label.trim();
  if (!label || !ASSUMPTION_TYPES.has(input.assumptionType)) return null;

  assumptionSequence += 1;
  return Object.freeze({
    assumptionId: `assumption_${slugify(label)}_${assumptionSequence}`,
    label,
    targetKind: input.targetKind ?? "general",
    targetId: input.targetId?.trim() || null,
    assumptionType: input.assumptionType,
    value: input.value,
    unit: input.unit?.trim() || null,
  });
}

export function createWorkspaceScenarioOverride(
  input: CreateWorkspaceScenarioOverrideInput
): WorkspaceScenarioOverride | null {
  const field = input.field.trim();
  const targetId = input.targetId.trim();
  if (!field || !targetId) return null;

  overrideSequence += 1;
  return Object.freeze({
    overrideId: `override_${slugify(field)}_${overrideSequence}`,
    field,
    value: input.value,
    targetKind: input.targetKind,
    targetId,
  });
}

export function buildWorkspaceScenarioSimulationSummary(input: {
  predictedKpiChanges: readonly WorkspaceScenarioPredictedChange[];
  predictedOkrChanges: readonly WorkspaceScenarioPredictedChange[];
  predictedRiskChanges: readonly WorkspaceScenarioPredictedChange[];
}): string {
  const topKpi = [...input.predictedKpiChanges].sort(
    (left, right) => Math.abs(right.changePercent) - Math.abs(left.changePercent)
  )[0];
  const topRisk = [...input.predictedRiskChanges].sort(
    (left, right) => right.changePercent - left.changePercent
  )[0];
  const topOkr = [...input.predictedOkrChanges].sort(
    (left, right) => right.changePercent - left.changePercent
  )[0];

  const parts = [
    topKpi && topKpi.changePercent > 0
      ? `${topKpi.label} increases under the scenario assumptions`
      : null,
    topRisk && topRisk.changePercent > 0
      ? `${topRisk.label.toLowerCase()} exposure also increases`
      : null,
    topOkr && topOkr.changePercent > 0
      ? `${topOkr.label} progress is projected to shift`
      : null,
  ].filter(Boolean) as string[];

  if (parts.length === 0) {
    return "Scenario assumptions produce no material projected changes against current intelligence.";
  }

  if (parts.length === 1) {
    return `${parts[0]}.`;
  }

  return `${parts[0]}, but ${parts.slice(1).join(" and ")}.`;
}

export function buildWorkspaceScenarioExecutiveQuestions(input: {
  assumptions: readonly WorkspaceScenarioAssumption[];
  predictedObjectChanges: readonly WorkspaceScenarioPredictedChange[];
  predictedKpiChanges: readonly WorkspaceScenarioPredictedChange[];
  predictedOkrChanges: readonly WorkspaceScenarioPredictedChange[];
  predictedRiskChanges: readonly WorkspaceScenarioPredictedChange[];
}): readonly string[] {
  const topKpi = [...input.predictedKpiChanges].sort(
    (left, right) => Math.abs(right.changePercent) - Math.abs(left.changePercent)
  )[0];
  const topRisk = [...input.predictedRiskChanges].sort(
    (left, right) => right.changePercent - left.changePercent
  )[0];
  const topObject = [...input.predictedObjectChanges].sort(
    (left, right) => Math.abs(right.changePercent) - Math.abs(left.changePercent)
  )[0];
  const topAssumption = input.assumptions[0];

  return Object.freeze([
    topKpi ? `Which KPI changes most? (${topKpi.label}: ${topKpi.changePercent}%)` : "Which KPI changes most?",
    topRisk
      ? `Which risk increases most? (${topRisk.label}: ${topRisk.changePercent}%)`
      : "Which risk increases most?",
    topObject
      ? `Which object is most affected? (${topObject.label}: ${topObject.changePercent}%)`
      : "Which object is most affected?",
    topAssumption
      ? `Which assumption causes the largest impact? (${topAssumption.label})`
      : "Which assumption causes the largest impact?",
  ]);
}

export function simulateWorkspaceScenarioModel(input: {
  workspaceId: WorkspaceId;
  scenario: WorkspaceScenario;
  assumptions: readonly WorkspaceScenarioAssumption[];
  overrides: readonly WorkspaceScenarioOverride[];
}): Omit<WorkspaceScenarioSimulation, "simulationId" | "simulatedAt"> {
  const trimmedWorkspaceId = input.workspaceId.trim();
  const temporaryScenario = applyTemporaryScenarioOverrides(input.scenario, input.overrides);
  void temporaryScenario;

  const insight = getWorkspaceScenarioInsight(trimmedWorkspaceId, input.scenario.scenarioId);
  const insightObjectIds = new Set((insight?.affectedObjects ?? []).map((item) => item.id));
  const insightKpiIds = new Set((insight?.relatedKpis ?? []).map((item) => item.id));
  const insightOkrIds = new Set((insight?.relatedOkrs ?? []).map((item) => item.id));
  const insightRiskIds = new Set((insight?.relatedRisks ?? []).map((item) => item.id));

  const kpis = getWorkspaceKpis(trimmedWorkspaceId);
  const kpiNameById = new Map(kpis.map((kpi) => [kpi.kpiId, kpi.name] as const));
  const detectedByRiskId = new Map(
    getDetectedWorkspaceRisks(trimmedWorkspaceId).map((risk) => [risk.riskId, risk.title] as const)
  );

  const predictedKpiChanges = getWorkspaceKpiHealthProfiles(trimmedWorkspaceId)
    .filter(
      (profile) => insightKpiIds.size === 0 || insightKpiIds.has(profile.kpiId)
    )
    .map((profile) => {
      const label = kpiNameById.get(profile.kpiId) ?? profile.kpiId;
      const { changePercent, reasons } = computeEntityChangePercent({
        assumptions: input.assumptions,
        targetLabel: label,
        targetKind: "kpi",
        targetId: profile.kpiId,
      });
      return buildPredictedChange({
        id: profile.kpiId,
        label,
        baselineValue: profile.healthScore,
        changePercent,
        changeReason: reasons.join("; ") || "No matching assumptions",
      });
    })
    .filter((change) => change.changePercent !== 0);

  const predictedOkrChanges = getWorkspaceOkrHealthProfiles(trimmedWorkspaceId)
    .filter(
      (profile) => insightOkrIds.size === 0 || insightOkrIds.has(profile.objectiveId)
    )
    .map((profile) => {
      const objective = getWorkspaceObjective(trimmedWorkspaceId, profile.objectiveId);
      const label = objective?.title ?? profile.objectiveId;
      const { changePercent, reasons } = computeEntityChangePercent({
        assumptions: input.assumptions,
        targetLabel: label,
        targetKind: "okr",
        targetId: profile.objectiveId,
      });
      return buildPredictedChange({
        id: profile.objectiveId,
        label,
        baselineValue: profile.healthScore,
        changePercent,
        changeReason: reasons.join("; ") || "No matching assumptions",
      });
    })
    .filter((change) => change.changePercent !== 0);

  const predictedRiskChanges = getWorkspaceRiskSeverityProfiles(trimmedWorkspaceId)
    .filter((profile) => insightRiskIds.size === 0 || insightRiskIds.has(profile.riskId))
    .map((profile) => {
      const label = detectedByRiskId.get(profile.riskId) ?? profile.riskId;
      const { changePercent, reasons } = computeEntityChangePercent({
        assumptions: input.assumptions,
        targetLabel: label,
        targetKind: "risk",
        targetId: profile.riskId,
      });
      return buildPredictedChange({
        id: profile.riskId,
        label,
        baselineValue: profile.severityScore,
        changePercent,
        changeReason: reasons.join("; ") || "No matching assumptions",
      });
    })
    .filter((change) => change.changePercent !== 0);

  const predictedObjectChanges = getObjectIntelligenceProfiles(trimmedWorkspaceId)
    .filter(
      (profile) => insightObjectIds.size === 0 || insightObjectIds.has(profile.objectId)
    )
    .map((profile) => {
      const baselineValue = profile.relationshipCount + profile.connectedObjectCount;
      const { changePercent, reasons } = computeEntityChangePercent({
        assumptions: input.assumptions,
        targetLabel: profile.objectName,
        targetKind: "object",
        targetId: profile.objectId,
      });
      return buildPredictedChange({
        id: profile.objectId,
        label: profile.objectName,
        baselineValue,
        changePercent,
        changeReason: reasons.join("; ") || "No matching assumptions",
      });
    })
    .filter((change) => change.changePercent !== 0);

  const simulationSummary = buildWorkspaceScenarioSimulationSummary({
    predictedKpiChanges,
    predictedOkrChanges,
    predictedRiskChanges,
  });

  return Object.freeze({
    contractVersion: WORKSPACE_SCENARIO_SIMULATION_ENGINE_VERSION,
    workspaceId: trimmedWorkspaceId,
    scenarioId: input.scenario.scenarioId,
    assumptions: Object.freeze([...input.assumptions]),
    overrides: Object.freeze([...input.overrides]),
    simulationStatus: "completed" as const,
    predictedObjectChanges: Object.freeze(predictedObjectChanges),
    predictedKpiChanges: Object.freeze(predictedKpiChanges),
    predictedOkrChanges: Object.freeze(predictedOkrChanges),
    predictedRiskChanges: Object.freeze(predictedRiskChanges),
    simulationSummary,
    executiveQuestions: buildWorkspaceScenarioExecutiveQuestions({
      assumptions: input.assumptions,
      predictedObjectChanges,
      predictedKpiChanges,
      predictedOkrChanges,
      predictedRiskChanges,
    }),
    source: WORKSPACE_SCENARIO_SIMULATION_ENGINE_SOURCE,
  });
}

export function runWorkspaceScenarioSimulation(
  input: RunWorkspaceScenarioSimulationInput
): RunWorkspaceScenarioSimulationResult {
  hydrateWorkspaceScenarioSimulationStore();
  const trimmedWorkspaceId = input.workspaceId.trim();
  const trimmedScenarioId = input.scenarioId.trim();

  if (!trimmedWorkspaceId || !trimmedScenarioId) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId || null,
      scenarioId: trimmedScenarioId || null,
      simulation: null,
      reason: "missing_identifier",
      message: "Provide workspace and scenario identifiers before simulation.",
    });
  }

  const scenario = getWorkspaceScenario(trimmedWorkspaceId, trimmedScenarioId);
  if (!scenario) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      scenarioId: trimmedScenarioId,
      simulation: null,
      reason: "scenario_not_found",
      message: "Scenario not found for simulation.",
    });
  }

  if (input.assumptions.length === 0) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      scenarioId: trimmedScenarioId,
      simulation: null,
      reason: "missing_assumptions",
      message: "Provide at least one assumption before simulation.",
    });
  }

  simulationSequence += 1;
  const simulatedAt = nowIso();
  const simulation = freezeSimulation(
    Object.freeze({
      ...simulateWorkspaceScenarioModel({
        workspaceId: trimmedWorkspaceId,
        scenario,
        assumptions: input.assumptions,
        overrides: input.overrides ?? Object.freeze([]),
      }),
      simulationId: `sim_${slugify(trimmedScenarioId)}_${simulationSequence}`,
      simulatedAt,
    })
  );

  const workspaceMap = workspaceScenarioSimulationStore[trimmedWorkspaceId] ?? Object.freeze({});
  const scenarioMap = workspaceMap[trimmedScenarioId] ?? Object.freeze({});
  workspaceScenarioSimulationStore = Object.freeze({
    ...workspaceScenarioSimulationStore,
    [trimmedWorkspaceId]: Object.freeze({
      ...workspaceMap,
      [trimmedScenarioId]: Object.freeze({
        ...scenarioMap,
        [simulation.simulationId]: simulation,
      }),
    }),
  });
  commitWorkspaceScenarioSimulationChange();
  emitScenarioSimulationDiagnostic(simulation);

  return Object.freeze({
    success: true,
    workspaceId: trimmedWorkspaceId,
    scenarioId: trimmedScenarioId,
    simulation,
    reason: "simulated",
    message: `Scenario simulation completed for "${scenario.name}".`,
  });
}

export function getWorkspaceScenarioSimulation(
  workspaceId: WorkspaceId,
  scenarioId: string,
  simulationId: string
): WorkspaceScenarioSimulation | null {
  hydrateWorkspaceScenarioSimulationStore();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedScenarioId = scenarioId.trim();
  const trimmedSimulationId = simulationId.trim();
  if (!trimmedWorkspaceId || !trimmedScenarioId || !trimmedSimulationId) return null;
  const match =
    workspaceScenarioSimulationStore[trimmedWorkspaceId]?.[trimmedScenarioId]?.[
      trimmedSimulationId
    ] ?? null;
  return match ? freezeSimulation(match) : null;
}

export function getWorkspaceScenarioSimulations(
  workspaceId: WorkspaceId,
  scenarioId: string
): readonly WorkspaceScenarioSimulation[] {
  hydrateWorkspaceScenarioSimulationStore();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedScenarioId = scenarioId.trim();
  if (!trimmedWorkspaceId || !trimmedScenarioId) return Object.freeze([]);
  return Object.freeze(
    Object.values(
      workspaceScenarioSimulationStore[trimmedWorkspaceId]?.[trimmedScenarioId] ?? {}
    ).map(freezeSimulation)
  );
}

export function getLatestWorkspaceScenarioSimulation(
  workspaceId: WorkspaceId,
  scenarioId: string
): WorkspaceScenarioSimulation | null {
  const simulations = getWorkspaceScenarioSimulations(workspaceId, scenarioId);
  if (simulations.length === 0) return null;
  return [...simulations].sort((left, right) =>
    right.simulatedAt.localeCompare(left.simulatedAt)
  )[0] ?? null;
}

export function subscribeWorkspaceScenarioSimulationRegistry(
  listener: WorkspaceScenarioSimulationListener
): () => void {
  hydrateWorkspaceScenarioSimulationStore();
  workspaceScenarioSimulationListeners.add(listener);
  return () => workspaceScenarioSimulationListeners.delete(listener);
}

export function getWorkspaceScenarioSimulationRegistryVersion(): number {
  hydrateWorkspaceScenarioSimulationStore();
  return workspaceScenarioSimulationVersion;
}

export function resetWorkspaceScenarioSimulationStoreForTests(): void {
  workspaceScenarioSimulationStore = {};
  workspaceScenarioSimulationHydrated = false;
  workspaceScenarioSimulationVersion = 0;
  assumptionSequence = 0;
  overrideSequence = 0;
  simulationSequence = 0;
  workspaceScenarioSimulationListeners.clear();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Test cleanup best effort only.
    }
  }
}

export function resetWorkspaceScenarioSimulationMemoryForTests(): void {
  workspaceScenarioSimulationStore = {};
  workspaceScenarioSimulationHydrated = false;
  workspaceScenarioSimulationVersion = 0;
}

export function resetWorkspaceScenarioSimulationSequencesForTests(): void {
  assumptionSequence = 0;
  overrideSequence = 0;
  simulationSequence = 0;
}
