/**
 * D7:2:5 — Recovery capacity governance guard rails.
 */

import type { RecoveryCapacityZone } from "./recoveryCapacityTypes.ts";
import { logRecoveryDev } from "./recoveryDevLog.ts";

export type RecoveryGuardCode =
  | "empty_fragility_context"
  | "too_many_recovery_zones"
  | "invalid_zone_region"
  | "duplicate_recovery_build"
  | "false_resilience_amplification"
  | "unstable_recovery_loop"
  | "recursive_recovery_propagation"
  | "corrupted_recovery_state";

export type RecoveryGuardResult =
  | { ok: true }
  | { ok: false; code: RecoveryGuardCode; message: string };

export const DEFAULT_MAX_RECOVERY_ZONES = 48;
export const DEFAULT_MAX_RECOVERY_PROPAGATION_RECORDS = 96;
export const DEFAULT_MAX_RESILIENCE_SCORE = 0.98;

function reject(code: RecoveryGuardCode, message: string): RecoveryGuardResult {
  const result = { ok: false as const, code, message };
  logRecoveryDev("RecoveryGuard", { code, message });
  return result;
}

export function buildRecoveryContentFingerprint(input: {
  topologyFingerprint: string;
  fragilityFingerprint?: string;
  pressureFingerprint?: string;
  flowFingerprint?: string;
  tick: number;
  regionMetricKeys: readonly string[];
}): string {
  return JSON.stringify({
    topology: input.topologyFingerprint,
    fragility: input.fragilityFingerprint ?? null,
    pressure: input.pressureFingerprint ?? null,
    flow: input.flowFingerprint ?? null,
    tick: input.tick,
    metrics: [...input.regionMetricKeys].sort(),
  });
}

export function detectRecoveryZoneOverlap(zones: readonly RecoveryCapacityZone[]): string[] | null {
  const regionToZone = new Map<string, string>();
  for (const zone of zones) {
    for (const regionId of zone.affectedRegionIds) {
      if (regionToZone.has(regionId)) {
        return [regionId, regionToZone.get(regionId)!, zone.zoneId];
      }
      regionToZone.set(regionId, zone.zoneId);
    }
  }
  return null;
}

export function detectRecursiveRecoveryPropagation(
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

export function guardEvaluateRecoveryCapacity(input: {
  topologyId: string;
  topologyRegionIds: readonly string[];
  zones: readonly RecoveryCapacityZone[];
  propagationRecordCount: number;
  priorRecoveryFingerprints?: readonly string[];
  pendingFingerprint?: string;
  resilienceScore?: number;
  stabilizationPotential?: number;
}): RecoveryGuardResult {
  if (!input.topologyId) {
    return reject("empty_fragility_context", "Topology context is required to evaluate recovery capacity");
  }

  const regionSet = new Set(input.topologyRegionIds);

  if (input.zones.length > DEFAULT_MAX_RECOVERY_ZONES) {
    return reject(
      "too_many_recovery_zones",
      `Recovery zone count ${input.zones.length} exceeds max ${DEFAULT_MAX_RECOVERY_ZONES}`
    );
  }

  for (const zone of input.zones) {
    for (const regionId of zone.affectedRegionIds) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_zone_region",
          `Recovery zone ${zone.zoneId} references unknown region ${regionId}`
        );
      }
    }
    if (
      zone.averageRecoveryScore < 0 ||
      zone.averageRecoveryScore > 1 ||
      !Number.isFinite(zone.averageRecoveryScore)
    ) {
      return reject("corrupted_recovery_state", `Recovery zone ${zone.zoneId} has invalid scores`);
    }
  }

  const overlap = detectRecoveryZoneOverlap(input.zones);
  if (overlap) {
    return reject(
      "unstable_recovery_loop",
      `Region ${overlap[0]} appears in multiple recovery capacity zones`
    );
  }

  if (input.propagationRecordCount > DEFAULT_MAX_RECOVERY_PROPAGATION_RECORDS) {
    return reject(
      "recursive_recovery_propagation",
      `Recovery propagation record count exceeds safe threshold`
    );
  }

  const resilience = input.resilienceScore ?? 0;
  const stabilization = input.stabilizationPotential ?? 0;
  if (resilience > DEFAULT_MAX_RESILIENCE_SCORE && stabilization > DEFAULT_MAX_RESILIENCE_SCORE) {
    return reject(
      "false_resilience_amplification",
      "Resilience and stabilization scores exceed safe governance threshold together"
    );
  }

  const pending = String(input.pendingFingerprint ?? "").trim();
  if (pending && (input.priorRecoveryFingerprints ?? []).includes(pending)) {
    return reject("duplicate_recovery_build", "Identical recovery evaluation was already executed");
  }

  return { ok: true };
}
