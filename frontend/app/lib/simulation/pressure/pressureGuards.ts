/**
 * D7:2:3 — Dependency pressure governance guard rails.
 */

import type { DependencyPressureSignal } from "./dependencyPressureTypes.ts";
import { logPressureDev } from "./pressureDevLog.ts";

export type PressureGuardCode =
  | "empty_topology"
  | "too_many_pressure_signals"
  | "invalid_pressure_intensity"
  | "recursive_pressure_loop"
  | "orphan_pressure_path"
  | "duplicate_pressure_build"
  | "runaway_escalation_chain"
  | "corrupted_pressure_state";

export type PressureGuardResult =
  | { ok: true }
  | { ok: false; code: PressureGuardCode; message: string };

export const DEFAULT_MAX_PRESSURE_SIGNALS = 200;
export const DEFAULT_MAX_PRESSURE_PROPAGATION_DEPTH = 8;
export const DEFAULT_MAX_SYSTEMIC_PRESSURE_SCORE = 0.98;

function reject(code: PressureGuardCode, message: string): PressureGuardResult {
  const result = { ok: false as const, code, message };
  logPressureDev("PressureGuard", { code, message });
  return result;
}

export function buildPressureContentFingerprint(input: {
  topologyFingerprint: string;
  flowFingerprint?: string;
  tick: number;
  regionMetricKeys: readonly string[];
}): string {
  return JSON.stringify({
    topology: input.topologyFingerprint,
    flow: input.flowFingerprint ?? null,
    tick: input.tick,
    metrics: [...input.regionMetricKeys].sort(),
  });
}

export function detectPressureCycle(
  signals: readonly DependencyPressureSignal[]
): string[] | null {
  const adjacency = new Map<string, string[]>();
  for (const signal of signals) {
    if (signal.pressureType === "approval") continue;
    if (signal.sourceRegionId === signal.targetRegionId) continue;
    const list = adjacency.get(signal.sourceRegionId) ?? [];
    list.push(signal.targetRegionId);
    adjacency.set(signal.sourceRegionId, list);
  }

  const visiting = new Set<string>();
  const visited = new Set<string>();
  const stack: string[] = [];

  function dfs(node: string): string[] | null {
    if (visiting.has(node)) {
      const idx = stack.indexOf(node);
      return idx >= 0 ? [...stack.slice(idx), node] : [node, node];
    }
    if (visited.has(node)) return null;
    visiting.add(node);
    stack.push(node);
    for (const next of adjacency.get(node) ?? []) {
      const found = dfs(next);
      if (found) return found;
    }
    stack.pop();
    visiting.delete(node);
    visited.add(node);
    return null;
  }

  for (const node of [...adjacency.keys()].sort()) {
    const found = dfs(node);
    if (found && found.length >= 3) return found;
  }
  return null;
}

export function guardEvaluateDependencyPressure(input: {
  topologyId: string;
  topologyRegionIds: readonly string[];
  signals: readonly DependencyPressureSignal[];
  priorPressureFingerprints?: readonly string[];
  pendingFingerprint?: string;
  systemicPressureScore?: number;
  cascadeRiskScore?: number;
}): PressureGuardResult {
  if (!input.topologyId) {
    return reject("empty_topology", "Topology is required to evaluate dependency pressure");
  }

  const regionSet = new Set(input.topologyRegionIds);

  if (input.signals.length > DEFAULT_MAX_PRESSURE_SIGNALS) {
    return reject(
      "too_many_pressure_signals",
      `Pressure signal count ${input.signals.length} exceeds max ${DEFAULT_MAX_PRESSURE_SIGNALS}`
    );
  }

  for (const signal of input.signals) {
    if (signal.intensity < 0 || signal.intensity > 1) {
      return reject(
        "invalid_pressure_intensity",
        `Pressure signal ${signal.signalId} intensity must be between 0 and 1`
      );
    }
    if (!regionSet.has(signal.sourceRegionId) || !regionSet.has(signal.targetRegionId)) {
      return reject(
        "orphan_pressure_path",
        `Pressure signal ${signal.signalId} references unknown region(s)`
      );
    }
  }

  const cycle = detectPressureCycle(input.signals);
  if (cycle) {
    return reject(
      "recursive_pressure_loop",
      `Recursive pressure loop detected: ${cycle.join(" -> ")}`
    );
  }

  const systemic = input.systemicPressureScore ?? 0;
  const cascade = input.cascadeRiskScore ?? 0;
  if (systemic > DEFAULT_MAX_SYSTEMIC_PRESSURE_SCORE || cascade > DEFAULT_MAX_SYSTEMIC_PRESSURE_SCORE) {
    return reject(
      "runaway_escalation_chain",
      "Systemic or cascade pressure exceeds safe governance threshold"
    );
  }

  const pending = String(input.pendingFingerprint ?? "").trim();
  if (pending && (input.priorPressureFingerprints ?? []).includes(pending)) {
    return reject("duplicate_pressure_build", "Identical pressure evaluation was already executed");
  }

  return { ok: true };
}
