/**
 * MRP:4E:5 — Build ScenarioCommitPackage from scenario workspace data.
 */

import type { GeneratedScenario } from "./scenarioGenerationContract.ts";
import {
  type ScenarioCommitPackage,
  type ScenarioHandoffInput,
} from "./scenarioHandoffContract.ts";

export function buildScenarioCommitPackage(
  scenario: GeneratedScenario,
  input: ScenarioHandoffInput
): ScenarioCommitPackage {
  return Object.freeze({
    scenarioId: scenario.id,
    title: scenario.title,
    probability: scenario.probability,
    impact: scenario.impact,
    confidence: scenario.confidence,
    selectedObjectId: input.selectedObjectId?.trim() || null,
    createdAt: input.createdAt ?? new Date(0).toISOString(),
  });
}

export function buildScenarioCommitPackageSignature(
  commitPackage: ScenarioCommitPackage
): string {
  return JSON.stringify(commitPackage);
}

export function findGeneratedScenarioById(
  scenarios: readonly GeneratedScenario[],
  scenarioId: GeneratedScenario["id"]
): GeneratedScenario | null {
  return scenarios.find((row) => row.id === scenarioId) ?? null;
}
