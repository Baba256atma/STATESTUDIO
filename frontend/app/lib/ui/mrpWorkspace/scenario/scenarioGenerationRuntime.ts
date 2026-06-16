/**
 * MRP:4E:2 — Sync executive scenario generation into workspace state (read-only).
 */

import {
  getScenarioWorkspaceState,
  publishScenarioWorkspaceState,
} from "./scenarioWorkspaceStateRuntime.ts";
import {
  MRP_SCENARIO_GENERATION_TAG,
  SCENARIO_DECISION_QUESTION,
  type GeneratedScenario,
  type ScenarioGenerationDataInput,
  type ScenarioGenerationSurface,
} from "./scenarioGenerationContract.ts";
import {
  buildScenarioGenerationInput,
  buildScenarioGenerationSignature,
  deriveExecutiveScenarios,
} from "./scenarioGenerationResolver.ts";

const loggedSyncKeys = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logGenerationOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedSyncKeys.has(key)) return;
  loggedSyncKeys.add(key);
  globalThis.console?.debug?.(MRP_SCENARIO_GENERATION_TAG, detail);
}

export function buildScenarioGenerationSurface(
  scenarios: readonly GeneratedScenario[]
): ScenarioGenerationSurface {
  return Object.freeze({
    question: SCENARIO_DECISION_QUESTION,
    scenarios: Object.freeze([...scenarios]),
    readOnly: true,
  });
}

export function syncScenarioGeneration(
  input: ScenarioGenerationDataInput
): readonly GeneratedScenario[] {
  const workspaceContext =
    input.workspaceContext ?? getScenarioWorkspaceState().workspaceContext;
  const generationInput = buildScenarioGenerationInput({
    ...input,
    workspaceContext,
  });
  const scenarios = deriveExecutiveScenarios(generationInput);
  const signature = buildScenarioGenerationSignature(generationInput);

  const result = publishScenarioWorkspaceState({
    phase: "ready",
    generatedScenarios: scenarios,
    generationReadOnly: true,
    scenarioSummary: Object.freeze({
      headline: `${scenarios.length} executive futures generated`,
      detail: `${MRP_SCENARIO_GENERATION_TAG} ${SCENARIO_DECISION_QUESTION} Best, Expected, and Worst cases derived from read-only Risk and Timeline workspace data.`,
    }),
    scenarioList: Object.freeze({
      headline: "Scenario cards ready",
      detail: `${scenarios.map((row) => row.title).join(" · ")} — read-only generation, no execution.`,
    }),
  });

  logGenerationOnce(signature, {
    action: "scenario_generation_synced",
    changed: result.changed,
    revision: result.revision,
    scenarioCount: scenarios.length,
    selectedObject: generationInput.selectedObject.selectedObject,
    riskCount: generationInput.risk.riskCount,
    timelineEvents: generationInput.timeline.totalEvents,
  });

  return scenarios;
}

export function traceScenarioGenerationOnce(mountKey?: string | null): void {
  logGenerationOnce(`trace:${mountKey ?? "default"}`, {
    action: "scenario_generation_active",
    question: SCENARIO_DECISION_QUESTION,
    mountKey: mountKey ?? null,
  });
}

export function resetScenarioGenerationRuntimeForTests(): void {
  loggedSyncKeys.clear();
}
