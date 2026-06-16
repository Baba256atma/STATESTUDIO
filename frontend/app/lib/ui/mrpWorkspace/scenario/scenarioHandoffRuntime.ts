/**
 * MRP:4E:5 — Controlled Scenario → War Room handoff runtime.
 *
 * Prepares ScenarioCommitPackage for War Room — no execution or automatic War Room open.
 */

import {
  getScenarioWorkspaceState,
  publishScenarioWorkspaceState,
} from "./scenarioWorkspaceStateRuntime.ts";
import {
  MRP_SCENARIO_HANDOFF_TAG,
  SCENARIO_HANDOFF_CONTEXT,
  SCENARIO_HANDOFF_QUESTION,
  type ScenarioCommitPackage,
  type ScenarioHandoffInput,
  type ScenarioHandoffSurface,
} from "./scenarioHandoffContract.ts";
import type { GeneratedScenarioId } from "./scenarioGenerationContract.ts";
import {
  buildScenarioCommitPackage,
  buildScenarioCommitPackageSignature,
  findGeneratedScenarioById,
} from "./scenarioHandoffResolver.ts";
import { guardScenarioHandoffBoundary } from "./scenarioBoundaryRuntime.ts";
import { intakeScenarioCommitPackage } from "../warRoom/warRoomScenarioIntakeRuntime.ts";

const loggedHandoffKeys = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logHandoffOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedHandoffKeys.has(key)) return;
  loggedHandoffKeys.add(key);
  globalThis.console?.debug?.(MRP_SCENARIO_HANDOFF_TAG, detail);
}

export type ScenarioHandoffResult = Readonly<{
  ok: boolean;
  reason?: string;
  commitPackage?: ScenarioCommitPackage;
}>;

export function buildScenarioHandoffSurface(input: {
  activeScenarioId: GeneratedScenarioId | null;
  selectedScenarioId: GeneratedScenarioId | null;
  pendingCommitPackage: ScenarioCommitPackage | null;
}): ScenarioHandoffSurface {
  return Object.freeze({
    question: SCENARIO_HANDOFF_QUESTION,
    activeScenarioId: input.activeScenarioId,
    selectedScenarioId: input.selectedScenarioId,
    pendingCommitPackage: input.pendingCommitPackage,
    handoffReady: input.pendingCommitPackage !== null,
    dashboardContext: SCENARIO_HANDOFF_CONTEXT,
    preparesOnly: true,
  });
}

export function guardScenarioCommitPackageExecution(
  source?: string | null
): ReturnType<typeof guardScenarioHandoffBoundary> {
  return guardScenarioHandoffBoundary({
    action: "execute_commit_package",
    source: source ?? null,
  });
}

export function commitScenarioToWarRoom(input: ScenarioHandoffInput): ScenarioHandoffResult {
  const boundary = guardScenarioHandoffBoundary({
    action: "handoff_to_war_room",
    source: "commit_to_action",
  });
  if (!boundary.allowed) {
    return Object.freeze({
      ok: false,
      reason: boundary.reason,
    });
  }

  const state = getScenarioWorkspaceState();
  const scenario = findGeneratedScenarioById(state.generatedScenarios, input.scenarioId);
  if (!scenario) {
    return Object.freeze({
      ok: false,
      reason: "Generated scenario not found for handoff.",
    });
  }

  const selectedObjectId =
    input.selectedObjectId ?? state.workspaceContext.selectedObjectId ?? null;
  const commitPackage = buildScenarioCommitPackage(scenario, {
    scenarioId: input.scenarioId,
    selectedObjectId,
    createdAt: input.createdAt ?? new Date().toISOString(),
  });
  const signature = buildScenarioCommitPackageSignature(commitPackage);

  const intake = intakeScenarioCommitPackage(commitPackage, "commit_to_action");
  if (!intake.ok) {
    return Object.freeze({
      ok: false,
      reason: intake.reason ?? "War Room scenario intake failed.",
    });
  }

  const publishResult = publishScenarioWorkspaceState({
    phase: state.phase === "loading" ? "ready" : state.phase,
    activeScenarioId: input.scenarioId,
    selectedScenarioId: input.scenarioId,
    pendingCommitPackage: commitPackage,
    handoffReady: true,
    scenarioSummary: Object.freeze({
      headline: `Active scenario: ${scenario.title}`,
      detail: `${MRP_SCENARIO_HANDOFF_TAG} ${SCENARIO_HANDOFF_QUESTION} ${scenario.title} prepared for War Room — no execution from Scenario workspace.`,
    }),
  });

  logHandoffOnce(signature, {
    action: "scenario_handoff_committed",
    changed: publishResult.changed,
    revision: publishResult.revision,
    scenarioId: commitPackage.scenarioId,
    selectedObjectId: commitPackage.selectedObjectId,
    dashboardContext: SCENARIO_HANDOFF_CONTEXT,
    warRoomAutoOpen: false,
    executionFromScenario: false,
  });

  return Object.freeze({
    ok: true,
    commitPackage,
  });
}

export function selectScenarioForHandoff(scenarioId: GeneratedScenarioId): void {
  const state = getScenarioWorkspaceState();
  if (!findGeneratedScenarioById(state.generatedScenarios, scenarioId)) return;
  publishScenarioWorkspaceState({
    selectedScenarioId: scenarioId,
  });
}

export function traceScenarioHandoffOnce(mountKey?: string | null): void {
  logHandoffOnce(`trace:${mountKey ?? "default"}`, {
    action: "scenario_handoff_active",
    question: SCENARIO_HANDOFF_QUESTION,
    dashboardContext: SCENARIO_HANDOFF_CONTEXT,
    mountKey: mountKey ?? null,
  });
}

export function resetScenarioHandoffRuntimeForTests(): void {
  loggedHandoffKeys.clear();
}
