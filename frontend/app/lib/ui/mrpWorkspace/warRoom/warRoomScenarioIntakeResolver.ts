/**
 * MRP:4F:3 — Validate and map ScenarioCommitPackage into War Room commitment surfaces.
 */

import type { GeneratedScenarioId } from "../scenario/scenarioGenerationContract.ts";
import type { ScenarioCommitPackage } from "../scenario/scenarioHandoffContract.ts";
import {
  WAR_ROOM_SCENARIO_INTAKE_TAG,
  type ScenarioCommitPackageValidation,
} from "./warRoomScenarioIntakeContract.ts";
import type { WarRoomFieldSnapshot } from "./warRoomWorkspaceStateContract.ts";
import type { WarRoomStatus } from "./warRoomStateContract.ts";

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isValidScenarioId(value: unknown): value is GeneratedScenarioId {
  return value === "best_case" || value === "expected_case" || value === "worst_case";
}

function isValidTimestamp(value: string): boolean {
  if (!value) return false;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed);
}

export function validateScenarioCommitPackage(
  commitPackage: ScenarioCommitPackage
): ScenarioCommitPackageValidation {
  const errors: string[] = [];

  if (!isValidScenarioId(commitPackage.scenarioId)) {
    errors.push("scenarioId must be a generated scenario id.");
  }
  if (!normalizeText(commitPackage.title)) {
    errors.push("title is required.");
  }
  if (!normalizeText(commitPackage.probability)) {
    errors.push("probability is required.");
  }
  if (!normalizeText(commitPackage.impact)) {
    errors.push("impact is required.");
  }
  if (!normalizeText(commitPackage.confidence)) {
    errors.push("confidence is required.");
  }
  if (
    commitPackage.selectedObjectId !== null &&
    !normalizeText(commitPackage.selectedObjectId)
  ) {
    errors.push("selectedObjectId must be null or a non-empty string.");
  }
  if (!isValidTimestamp(normalizeText(commitPackage.createdAt))) {
    errors.push("createdAt must be a valid timestamp.");
  }

  return Object.freeze({
    valid: errors.length === 0,
    errors: Object.freeze(errors),
  });
}

export function buildActiveDecisionIdFromPackage(
  commitPackage: ScenarioCommitPackage
): string {
  const objectSegment = commitPackage.selectedObjectId?.trim() || "objectless";
  return `decision:${objectSegment}:${commitPackage.scenarioId}`;
}

export function buildWarRoomIntakeActionPlanIds(
  commitPackage: ScenarioCommitPackage
): readonly string[] {
  const objectSegment = commitPackage.selectedObjectId?.trim() || commitPackage.scenarioId;
  return Object.freeze([`plan:${objectSegment}:handoff`]);
}

export function buildWarRoomIntakeWatchListIds(
  commitPackage: ScenarioCommitPackage
): readonly string[] {
  const objectSegment = commitPackage.selectedObjectId?.trim() || commitPackage.scenarioId;
  return Object.freeze([`watch:${objectSegment}:handoff`]);
}

export function resolveWarRoomIntakeStatus(): WarRoomStatus {
  return "review";
}

export function buildWarRoomIntakeStrategySummarySnapshot(
  commitPackage: ScenarioCommitPackage
): WarRoomFieldSnapshot {
  return Object.freeze({
    headline: `Prepared strategy: ${commitPackage.title}`,
    detail: `${WAR_ROOM_SCENARIO_INTAKE_TAG} Handoff intake — ${commitPackage.title} (${commitPackage.probability} · ${commitPackage.impact} · ${commitPackage.confidence}) — commitment only, no scenario regeneration or future simulation.`,
  });
}

export function buildWarRoomIntakeActiveDecisionSnapshot(
  commitPackage: ScenarioCommitPackage,
  activeDecisionId: string
): WarRoomFieldSnapshot {
  return Object.freeze({
    headline: activeDecisionId,
    detail: `${WAR_ROOM_SCENARIO_INTAKE_TAG} Active decision created from scenario ${commitPackage.scenarioId} handoff — War Room owns commitment, Scenario owns forecasting.`,
  });
}

export function buildWarRoomIntakeStatePatch(commitPackage: ScenarioCommitPackage): Readonly<{
  activeDecisionId: string;
  activeScenarioId: GeneratedScenarioId;
  selectedStrategy: string;
  actionPlanIds: readonly string[];
  watchListIds: readonly string[];
  status: WarRoomStatus;
}> {
  return Object.freeze({
    activeDecisionId: buildActiveDecisionIdFromPackage(commitPackage),
    activeScenarioId: commitPackage.scenarioId,
    selectedStrategy: commitPackage.title,
    actionPlanIds: buildWarRoomIntakeActionPlanIds(commitPackage),
    watchListIds: buildWarRoomIntakeWatchListIds(commitPackage),
    status: resolveWarRoomIntakeStatus(),
  });
}
