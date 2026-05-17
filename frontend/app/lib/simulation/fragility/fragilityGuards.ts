/**
 * D7:2:4 — Fragility concentration governance guard rails.
 */

import type { FragilityConcentrationZone } from "./fragilityConcentrationTypes.ts";
import { logFragilityDev } from "./fragilityDevLog.ts";

export type FragilityGuardCode =
  | "empty_topology"
  | "too_many_fragility_zones"
  | "invalid_zone_region"
  | "duplicate_fragility_build"
  | "runaway_systemic_exposure"
  | "unstable_hotspot_generation"
  | "false_concentration_loop"
  | "corrupted_fragility_state";

export type FragilityGuardResult =
  | { ok: true }
  | { ok: false; code: FragilityGuardCode; message: string };

export const DEFAULT_MAX_FRAGILITY_ZONES = 48;
export const DEFAULT_MAX_CONCENTRATION_HOTSPOTS = 64;
export const DEFAULT_MAX_SYSTEMIC_EXPOSURE_SCORE = 0.98;

function reject(code: FragilityGuardCode, message: string): FragilityGuardResult {
  const result = { ok: false as const, code, message };
  logFragilityDev("FragilityGuard", { code, message });
  return result;
}

export function buildFragilityContentFingerprint(input: {
  topologyFingerprint: string;
  pressureFingerprint?: string;
  flowFingerprint?: string;
  tick: number;
  regionMetricKeys: readonly string[];
}): string {
  return JSON.stringify({
    topology: input.topologyFingerprint,
    pressure: input.pressureFingerprint ?? null,
    flow: input.flowFingerprint ?? null,
    tick: input.tick,
    metrics: [...input.regionMetricKeys].sort(),
  });
}

export function detectFalseConcentrationLoop(zones: readonly FragilityConcentrationZone[]): string[] | null {
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

export function guardMapOperationalFragility(input: {
  topologyId: string;
  topologyRegionIds: readonly string[];
  zones: readonly FragilityConcentrationZone[];
  hotspotCount: number;
  priorFragilityFingerprints?: readonly string[];
  pendingFingerprint?: string;
  systemicExposureScore?: number;
  cascadePotentialScore?: number;
}): FragilityGuardResult {
  if (!input.topologyId) {
    return reject("empty_topology", "Topology is required to map operational fragility");
  }

  const regionSet = new Set(input.topologyRegionIds);

  if (input.zones.length > DEFAULT_MAX_FRAGILITY_ZONES) {
    return reject(
      "too_many_fragility_zones",
      `Fragility zone count ${input.zones.length} exceeds max ${DEFAULT_MAX_FRAGILITY_ZONES}`
    );
  }

  for (const zone of input.zones) {
    for (const regionId of zone.affectedRegionIds) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_zone_region",
          `Fragility zone ${zone.zoneId} references unknown region ${regionId}`
        );
      }
    }
    if (
      zone.averageFragilityScore < 0 ||
      zone.averageFragilityScore > 1 ||
      zone.peakFragilityScore < 0 ||
      zone.peakFragilityScore > 1 ||
      !Number.isFinite(zone.averageFragilityScore)
    ) {
      return reject("corrupted_fragility_state", `Fragility zone ${zone.zoneId} has invalid scores`);
    }
  }

  const overlap = detectFalseConcentrationLoop(input.zones);
  if (overlap) {
    return reject(
      "false_concentration_loop",
      `Region ${overlap[0]} appears in multiple concentration zones`
    );
  }

  if (input.hotspotCount > DEFAULT_MAX_CONCENTRATION_HOTSPOTS) {
    return reject(
      "unstable_hotspot_generation",
      `Hotspot count ${input.hotspotCount} exceeds safe threshold`
    );
  }

  const systemic = input.systemicExposureScore ?? 0;
  const cascade = input.cascadePotentialScore ?? 0;
  if (
    systemic > DEFAULT_MAX_SYSTEMIC_EXPOSURE_SCORE ||
    cascade > DEFAULT_MAX_SYSTEMIC_EXPOSURE_SCORE
  ) {
    return reject(
      "runaway_systemic_exposure",
      "Systemic exposure or cascade potential exceeds safe governance threshold"
    );
  }

  const pending = String(input.pendingFingerprint ?? "").trim();
  if (pending && (input.priorFragilityFingerprints ?? []).includes(pending)) {
    return reject("duplicate_fragility_build", "Identical fragility mapping was already executed");
  }

  return { ok: true };
}
