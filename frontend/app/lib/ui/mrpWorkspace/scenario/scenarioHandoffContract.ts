/**
 * MRP:4E:5 — Scenario → War Room handoff contract.
 *
 * Controlled preparation handoff — Scenario may not execute the commit package.
 */

import type { GeneratedScenarioId } from "./scenarioGenerationContract.ts";

export const MRP_SCENARIO_HANDOFF_TAG = "[MRP_SCENARIO_HANDOFF]" as const;

export const SCENARIO_HANDOFF_VERSION = "4E.5.0";

export const SCENARIO_HANDOFF_CONTEXT = "scenario" as const;

export const SCENARIO_HANDOFF_QUESTION = "Which future should we prepare for?" as const;

export type ScenarioCommitPackage = Readonly<{
  scenarioId: GeneratedScenarioId;
  title: string;
  probability: string;
  impact: string;
  confidence: string;
  selectedObjectId: string | null;
  createdAt: string;
}>;

export type ScenarioHandoffSurface = Readonly<{
  question: typeof SCENARIO_HANDOFF_QUESTION;
  activeScenarioId: GeneratedScenarioId | null;
  selectedScenarioId: GeneratedScenarioId | null;
  pendingCommitPackage: ScenarioCommitPackage | null;
  handoffReady: boolean;
  dashboardContext: typeof SCENARIO_HANDOFF_CONTEXT;
  preparesOnly: true;
}>;

export type ScenarioHandoffInput = Readonly<{
  scenarioId: GeneratedScenarioId;
  selectedObjectId: string | null;
  createdAt?: string;
}>;

export const DEFAULT_SCENARIO_HANDOFF_SURFACE: ScenarioHandoffSurface = Object.freeze({
  question: SCENARIO_HANDOFF_QUESTION,
  activeScenarioId: null,
  selectedScenarioId: null,
  pendingCommitPackage: null,
  handoffReady: false,
  dashboardContext: SCENARIO_HANDOFF_CONTEXT,
  preparesOnly: true,
});
