/**
 * D7:2:7 — Equilibrium governance guard rails.
 */

import type { OperationalEquilibriumSignal } from "./equilibriumTypes.ts";
import { logEquilibriumDev } from "./equilibriumDevLog.ts";

export type EquilibriumGuardCode =
  | "empty_momentum_context"
  | "too_many_equilibrium_signals"
  | "invalid_equilibrium_intensity"
  | "invalid_equilibrium_region"
  | "duplicate_equilibrium_build"
  | "runaway_balance_oscillation"
  | "unstable_equilibrium_loop"
  | "false_stability_amplification"
  | "corrupted_equilibrium_state";

export type EquilibriumGuardResult =
  | { ok: true }
  | { ok: false; code: EquilibriumGuardCode; message: string };

export const DEFAULT_MAX_EQUILIBRIUM_SIGNALS = 120;
export const DEFAULT_MAX_DRIFT_RECORDS = 64;
export const DEFAULT_MAX_EQUILIBRIUM_SCORE = 0.98;

function reject(code: EquilibriumGuardCode, message: string): EquilibriumGuardResult {
  const result = { ok: false as const, code, message };
  logEquilibriumDev("EquilibriumGuard", { code, message });
  return result;
}

export function buildEquilibriumContentFingerprint(input: {
  topologyFingerprint: string;
  momentumFingerprint?: string;
  recoveryFingerprint?: string;
  fragilityFingerprint?: string;
  pressureFingerprint?: string;
  tick: number;
  regionMetricKeys: readonly string[];
}): string {
  return JSON.stringify({
    topology: input.topologyFingerprint,
    momentum: input.momentumFingerprint ?? null,
    recovery: input.recoveryFingerprint ?? null,
    fragility: input.fragilityFingerprint ?? null,
    pressure: input.pressureFingerprint ?? null,
    tick: input.tick,
    metrics: [...input.regionMetricKeys].sort(),
  });
}

export function detectUnstableEquilibriumLoop(
  records: readonly { sourceRegionId: string; targetRegionId: string }[]
): string[] | null {
  const adjacency = new Map<string, string[]>();
  for (const record of records) {
    if (record.sourceRegionId === record.targetRegionId) continue;
    const list = adjacency.get(record.sourceRegionId) ?? [];
    list.push(record.targetRegionId);
    adjacency.set(record.sourceRegionId, list);
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
    if (found && found.length >= 4) return found;
  }
  return null;
}

export function guardEvaluateOperationalEquilibrium(input: {
  topologyId: string;
  topologyRegionIds: readonly string[];
  signals: readonly OperationalEquilibriumSignal[];
  driftRecordCount: number;
  priorEquilibriumFingerprints?: readonly string[];
  pendingFingerprint?: string;
  equilibriumScore?: number;
  instabilityDriftScore?: number;
  priorEquilibriumScore?: number;
}): EquilibriumGuardResult {
  if (!input.topologyId) {
    return reject("empty_momentum_context", "Topology context is required to evaluate operational equilibrium");
  }

  const regionSet = new Set(input.topologyRegionIds);

  if (input.signals.length > DEFAULT_MAX_EQUILIBRIUM_SIGNALS) {
    return reject(
      "too_many_equilibrium_signals",
      `Equilibrium signal count ${input.signals.length} exceeds max ${DEFAULT_MAX_EQUILIBRIUM_SIGNALS}`
    );
  }

  for (const signal of input.signals) {
    if (signal.intensity < 0 || signal.intensity > 1) {
      return reject(
        "invalid_equilibrium_intensity",
        `Equilibrium signal ${signal.signalId} intensity must be between 0 and 1`
      );
    }
    for (const regionId of signal.affectedRegionIds) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_equilibrium_region",
          `Equilibrium signal ${signal.signalId} references unknown region ${regionId}`
        );
      }
    }
  }

  if (input.driftRecordCount > DEFAULT_MAX_DRIFT_RECORDS) {
    return reject(
      "unstable_equilibrium_loop",
      "Equilibrium drift record count exceeds safe threshold"
    );
  }

  const score = input.equilibriumScore ?? 0;
  const drift = input.instabilityDriftScore ?? 0;
  const prior = input.priorEquilibriumScore;
  if (
    prior != null &&
    Math.abs(score - prior) > 0.45 &&
    score > DEFAULT_MAX_EQUILIBRIUM_SCORE &&
    drift > 0.85
  ) {
    return reject(
      "runaway_balance_oscillation",
      "Equilibrium score oscillation exceeds safe governance threshold"
    );
  }

  if (score > DEFAULT_MAX_EQUILIBRIUM_SCORE && drift < 0.05) {
    return reject(
      "false_stability_amplification",
      "Equilibrium score exceeds maximum without measurable instability drift"
    );
  }

  const pending = String(input.pendingFingerprint ?? "").trim();
  if (pending && (input.priorEquilibriumFingerprints ?? []).includes(pending)) {
    return reject("duplicate_equilibrium_build", "Identical equilibrium evaluation was already executed");
  }

  return { ok: true };
}
