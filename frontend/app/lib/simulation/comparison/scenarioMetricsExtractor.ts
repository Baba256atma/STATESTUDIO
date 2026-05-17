/**
 * D7:1:6 — Deterministic metric extraction from timeline snapshots.
 */

import type { OperationalTimeline } from "../timeline/timelineTypes.ts";
import type { SimulationStateSnapshot } from "../simulationStateSnapshot.ts";
import type { SimulationPropagationSnapshotState } from "../simulationPropagationTypes.ts";

export interface ScenarioMetricProfile {
  fragility: number;
  operationalLoad: number;
  confidence: number;
  recoveryPotential: number;
  propagationRisk: number;
}

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

function readOperationalState(value: unknown): string {
  if (!value || typeof value !== "object" || Array.isArray(value)) return "stable";
  const state = (value as Record<string, unknown>).operationalState;
  return typeof state === "string" ? state : "stable";
}

export function getSnapshotAtTick(
  timeline: OperationalTimeline,
  tick: number
): SimulationStateSnapshot | null {
  const target = Math.floor(Number(tick) || 0);
  for (let i = timeline.snapshots.length - 1; i >= 0; i -= 1) {
    const snap = timeline.snapshots[i]!;
    if (snap.timestamp.tick === target) return snap;
    if (snap.timestamp.tick < target) break;
  }
  return null;
}

export function extractScenarioMetricProfile(
  snapshot: SimulationStateSnapshot
): ScenarioMetricProfile {
  const metrics = snapshot.operationalMetrics ?? {};
  const fragility = clamp01(Number(metrics.fragility ?? 0.2));
  const operationalLoad = clamp01(Number(metrics.operationalLoad ?? 0.3));
  const confidence = clamp01(Number(metrics.confidence ?? 0.75));

  const propagation = snapshot.propagationState as SimulationPropagationSnapshotState | undefined;
  const intensities = propagation?.intensityMap
    ? Object.values(propagation.intensityMap).map((v) => Number(v))
    : [];
  const propagationRisk =
    intensities.length > 0
      ? clamp01(intensities.reduce((sum, v) => sum + (Number.isFinite(v) ? v : 0), 0) / intensities.length)
      : 0;

  let recoveryBoost = 0;
  for (const state of Object.values(snapshot.objectStates ?? {})) {
    const op = readOperationalState(state);
    if (op === "recovering" || op === "stable") recoveryBoost += 0.05;
    if (op === "critical" || op === "degraded") recoveryBoost -= 0.08;
  }
  const recoveryPotential = clamp01(1 - fragility * 0.7 + recoveryBoost - propagationRisk * 0.15);

  return {
    fragility,
    operationalLoad,
    confidence,
    recoveryPotential,
    propagationRisk,
  };
}

export function extractTimelineMetricProfile(
  timeline: OperationalTimeline,
  tick: number
): ScenarioMetricProfile {
  const snap = getSnapshotAtTick(timeline, tick);
  if (!snap) {
    return {
      fragility: 0.2,
      operationalLoad: 0.3,
      confidence: 0.75,
      recoveryPotential: 0.5,
      propagationRisk: 0,
    };
  }
  return extractScenarioMetricProfile(snap);
}
