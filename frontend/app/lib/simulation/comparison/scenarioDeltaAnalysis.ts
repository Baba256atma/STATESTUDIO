/**
 * D7:1:6 — Deterministic scenario delta analysis.
 */

import type { OperationalTimeline } from "../timeline/timelineTypes.ts";
import type { ScenarioDeltaAnalysis } from "./scenarioComparisonTypes.ts";
import type { SimulationPropagationSnapshotState } from "../simulationPropagationTypes.ts";
import { getSnapshotAtTick } from "./scenarioMetricsExtractor.ts";
import { logComparisonDev } from "./comparisonDevLog.ts";

const RISK_STATES = new Set(["strained", "degraded", "critical", "blocked", "uncertain"]);
const RECOVERY_IMPROVEMENT_TO = new Set(["recovering", "stable", "accelerated"]);

function stableJson(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return "";
  }
}

function readOperationalState(value: unknown): string {
  if (!value || typeof value !== "object" || Array.isArray(value)) return "stable";
  const state = (value as Record<string, unknown>).operationalState;
  return typeof state === "string" ? state : "stable";
}

function propagationPaths(state: unknown): string[] {
  const p = state as SimulationPropagationSnapshotState | undefined;
  if (!p?.propagationChains?.length) return [];
  return p.propagationChains
    .map((c) => c.path.traversedObjectIds.join("->"))
    .filter(Boolean)
    .sort();
}

export function analyzeScenarioDelta(input: {
  baseline: OperationalTimeline;
  comparison: OperationalTimeline;
  compareAtTick: number;
}): ScenarioDeltaAnalysis {
  const tick = Math.floor(Number(input.compareAtTick) || 0);
  const baseSnap = getSnapshotAtTick(input.baseline, tick);
  const cmpSnap = getSnapshotAtTick(input.comparison, tick);

  const changedObjects: string[] = [];
  const riskEscalations: string[] = [];
  const recoveryDifferences: string[] = [];
  const majorOperationalChanges: string[] = [];

  const keys = new Set([
    ...Object.keys(baseSnap?.objectStates ?? {}),
    ...Object.keys(cmpSnap?.objectStates ?? {}),
  ]);

  for (const objectId of [...keys].sort()) {
    const left = baseSnap?.objectStates?.[objectId];
    const right = cmpSnap?.objectStates?.[objectId];
    if (stableJson(left) === stableJson(right)) continue;
    changedObjects.push(objectId);

    const baseState = readOperationalState(left);
    const cmpState = readOperationalState(right);
    if (!RISK_STATES.has(baseState) && RISK_STATES.has(cmpState)) {
      riskEscalations.push(objectId);
    }
    if (RECOVERY_IMPROVEMENT_TO.has(cmpState) && RISK_STATES.has(baseState)) {
      recoveryDifferences.push(objectId);
    }
    if (baseState !== cmpState) {
      majorOperationalChanges.push(`${objectId}: ${baseState} → ${cmpState}`);
    }
  }

  const basePaths = propagationPaths(baseSnap?.propagationState);
  const cmpPaths = propagationPaths(cmpSnap?.propagationState);
  const propagationPathChanges = cmpPaths.filter((p) => !basePaths.includes(p));

  const divergenceSeverity = Number(
    Math.min(
      1,
      changedObjects.length * 0.08 +
        riskEscalations.length * 0.12 +
        propagationPathChanges.length * 0.1
    ).toFixed(4)
  );

  logComparisonDev("ComparisonDelta", {
    tick,
    changedObjects: changedObjects.length,
    riskEscalations: riskEscalations.length,
    divergenceSeverity,
  });

  return {
    changedObjects,
    riskEscalations,
    recoveryDifferences,
    majorOperationalChanges,
    propagationPathChanges,
    divergenceSeverity,
  };
}
