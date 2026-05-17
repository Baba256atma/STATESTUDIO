/**
 * D7:2:8 — Systemic risk gravity governance guard rails.
 */

import type { SystemicRiskGravityZone } from "./systemicRiskGravityTypes.ts";
import { logGravityDev } from "./gravityDevLog.ts";

export type GravityGuardCode =
  | "empty_equilibrium_context"
  | "too_many_gravity_zones"
  | "invalid_gravity_region"
  | "duplicate_gravity_build"
  | "runaway_convergence_escalation"
  | "unstable_gravity_loop"
  | "false_collapse_amplification"
  | "corrupted_gravity_state";

export type GravityGuardResult =
  | { ok: true }
  | { ok: false; code: GravityGuardCode; message: string };

export const DEFAULT_MAX_GRAVITY_ZONES = 48;
export const DEFAULT_MAX_CONVERGENCE_RECORDS = 96;
export const DEFAULT_MAX_COLLAPSE_PRESSURE = 0.98;

function reject(code: GravityGuardCode, message: string): GravityGuardResult {
  const result = { ok: false as const, code, message };
  logGravityDev("GravityGuard", { code, message });
  return result;
}

export function buildGravityContentFingerprint(input: {
  topologyFingerprint: string;
  equilibriumFingerprint?: string;
  fragilityFingerprint?: string;
  pressureFingerprint?: string;
  momentumFingerprint?: string;
  tick: number;
  regionMetricKeys: readonly string[];
}): string {
  return JSON.stringify({
    topology: input.topologyFingerprint,
    equilibrium: input.equilibriumFingerprint ?? null,
    fragility: input.fragilityFingerprint ?? null,
    pressure: input.pressureFingerprint ?? null,
    momentum: input.momentumFingerprint ?? null,
    tick: input.tick,
    metrics: [...input.regionMetricKeys].sort(),
  });
}

export function detectGravityZoneOverlap(zones: readonly SystemicRiskGravityZone[]): string[] | null {
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

export function detectUnstableGravityLoop(
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

export function guardEvaluateSystemicRiskGravity(input: {
  topologyId: string;
  topologyRegionIds: readonly string[];
  zones: readonly SystemicRiskGravityZone[];
  convergenceRecordCount: number;
  priorGravityFingerprints?: readonly string[];
  pendingFingerprint?: string;
  systemicCollapsePressure?: number;
  gravityConvergenceScore?: number;
}): GravityGuardResult {
  if (!input.topologyId) {
    return reject("empty_equilibrium_context", "Topology context is required to evaluate systemic risk gravity");
  }

  const regionSet = new Set(input.topologyRegionIds);

  if (input.zones.length > DEFAULT_MAX_GRAVITY_ZONES) {
    return reject(
      "too_many_gravity_zones",
      `Gravity zone count ${input.zones.length} exceeds max ${DEFAULT_MAX_GRAVITY_ZONES}`
    );
  }

  for (const zone of input.zones) {
    for (const regionId of zone.affectedRegionIds) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_gravity_region",
          `Gravity zone ${zone.zoneId} references unknown region ${regionId}`
        );
      }
    }
    if (
      zone.averageGravityScore < 0 ||
      zone.averageGravityScore > 1 ||
      !Number.isFinite(zone.averageGravityScore)
    ) {
      return reject("corrupted_gravity_state", `Gravity zone ${zone.zoneId} has invalid scores`);
    }
  }

  const overlap = detectGravityZoneOverlap(input.zones);
  if (overlap) {
    return reject(
      "unstable_gravity_loop",
      `Region ${overlap[0]} appears in multiple gravity zones`
    );
  }

  if (input.convergenceRecordCount > DEFAULT_MAX_CONVERGENCE_RECORDS) {
    return reject(
      "unstable_gravity_loop",
      "Risk convergence record count exceeds safe threshold"
    );
  }

  const collapse = input.systemicCollapsePressure ?? 0;
  const convergence = input.gravityConvergenceScore ?? 0;
  if (collapse > DEFAULT_MAX_COLLAPSE_PRESSURE && convergence > DEFAULT_MAX_COLLAPSE_PRESSURE) {
    return reject(
      "runaway_convergence_escalation",
      "Systemic collapse pressure and convergence score exceed safe governance threshold"
    );
  }

  if (collapse > DEFAULT_MAX_COLLAPSE_PRESSURE && input.zones.length === 0) {
    return reject(
      "false_collapse_amplification",
      "Collapse pressure exceeds maximum without identifiable gravity zones"
    );
  }

  const pending = String(input.pendingFingerprint ?? "").trim();
  if (pending && (input.priorGravityFingerprints ?? []).includes(pending)) {
    return reject("duplicate_gravity_build", "Identical gravity evaluation was already executed");
  }

  return { ok: true };
}
