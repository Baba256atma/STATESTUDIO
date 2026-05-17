/**
 * D7:2:6 — Operational momentum governance guard rails.
 */

import type { OperationalMomentumSignal } from "./operationalMomentumTypes.ts";
import { logMomentumDev } from "./momentumDevLog.ts";

export type MomentumGuardCode =
  | "empty_recovery_context"
  | "too_many_momentum_signals"
  | "invalid_momentum_intensity"
  | "invalid_momentum_region"
  | "duplicate_momentum_build"
  | "runaway_degradation_escalation"
  | "unstable_momentum_loop"
  | "false_acceleration_amplification"
  | "corrupted_momentum_state";

export type MomentumGuardResult =
  | { ok: true }
  | { ok: false; code: MomentumGuardCode; message: string };

export const DEFAULT_MAX_MOMENTUM_SIGNALS = 120;
export const DEFAULT_MAX_MOMENTUM_PROPAGATION_RECORDS = 96;
export const DEFAULT_MAX_ORGANIZATIONAL_MOMENTUM_SCORE = 0.98;

function reject(code: MomentumGuardCode, message: string): MomentumGuardResult {
  const result = { ok: false as const, code, message };
  logMomentumDev("MomentumGuard", { code, message });
  return result;
}

export function buildMomentumContentFingerprint(input: {
  topologyFingerprint: string;
  recoveryFingerprint?: string;
  fragilityFingerprint?: string;
  pressureFingerprint?: string;
  flowFingerprint?: string;
  tick: number;
  regionMetricKeys: readonly string[];
}): string {
  return JSON.stringify({
    topology: input.topologyFingerprint,
    recovery: input.recoveryFingerprint ?? null,
    fragility: input.fragilityFingerprint ?? null,
    pressure: input.pressureFingerprint ?? null,
    flow: input.flowFingerprint ?? null,
    tick: input.tick,
    metrics: [...input.regionMetricKeys].sort(),
  });
}

export function detectUnstableMomentumLoop(
  records: readonly { originRegionId: string; affectedRegionId: string }[]
): string[] | null {
  const adjacency = new Map<string, string[]>();
  for (const record of records) {
    if (record.originRegionId === record.affectedRegionId) continue;
    const list = adjacency.get(record.originRegionId) ?? [];
    list.push(record.affectedRegionId);
    adjacency.set(record.originRegionId, list);
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

export function guardEvaluateOperationalMomentum(input: {
  topologyId: string;
  topologyRegionIds: readonly string[];
  signals: readonly OperationalMomentumSignal[];
  propagationRecordCount: number;
  priorMomentumFingerprints?: readonly string[];
  pendingFingerprint?: string;
  organizationalMomentumScore?: number;
  degradationZoneCount?: number;
}): MomentumGuardResult {
  if (!input.topologyId) {
    return reject("empty_recovery_context", "Topology context is required to evaluate operational momentum");
  }

  const regionSet = new Set(input.topologyRegionIds);

  if (input.signals.length > DEFAULT_MAX_MOMENTUM_SIGNALS) {
    return reject(
      "too_many_momentum_signals",
      `Momentum signal count ${input.signals.length} exceeds max ${DEFAULT_MAX_MOMENTUM_SIGNALS}`
    );
  }

  for (const signal of input.signals) {
    if (signal.intensity < 0 || signal.intensity > 1) {
      return reject(
        "invalid_momentum_intensity",
        `Momentum signal ${signal.signalId} intensity must be between 0 and 1`
      );
    }
    for (const regionId of signal.affectedRegionIds) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_momentum_region",
          `Momentum signal ${signal.signalId} references unknown region ${regionId}`
        );
      }
    }
  }

  if (input.propagationRecordCount > DEFAULT_MAX_MOMENTUM_PROPAGATION_RECORDS) {
    return reject(
      "unstable_momentum_loop",
      "Momentum propagation record count exceeds safe threshold"
    );
  }

  const score = input.organizationalMomentumScore ?? 0;
  const degradationZones = input.degradationZoneCount ?? 0;
  if (score > DEFAULT_MAX_ORGANIZATIONAL_MOMENTUM_SCORE && degradationZones >= 3) {
    return reject(
      "runaway_degradation_escalation",
      "Organizational momentum and degradation zones exceed safe governance threshold"
    );
  }

  const pending = String(input.pendingFingerprint ?? "").trim();
  if (pending && (input.priorMomentumFingerprints ?? []).includes(pending)) {
    return reject("duplicate_momentum_build", "Identical momentum evaluation was already executed");
  }

  return { ok: true };
}
