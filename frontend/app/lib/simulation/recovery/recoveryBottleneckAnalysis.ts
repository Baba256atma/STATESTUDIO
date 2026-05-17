/**
 * D7:2:5 — Recovery bottleneck analysis (deterministic).
 */

import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type {
  RecoveryBottleneck,
  RegionRecoveryProfile,
} from "./recoveryCapacityTypes.ts";
import type { RegionRecoveryMetrics } from "./recoveryCapacityTypes.ts";
import { logRecoveryDev } from "./recoveryDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function detectRecoveryBottlenecks(input: {
  topology: OperationalUniverseTopology;
  profiles: readonly RegionRecoveryProfile[];
  regionMetrics?: Readonly<Record<string, RegionRecoveryMetrics>>;
}): readonly RecoveryBottleneck[] {
  const bottlenecks: RecoveryBottleneck[] = [];

  for (const region of input.topology.operationalRegions) {
    const profile = input.profiles.find((p) => p.regionId === region.regionId);
    if (!profile) continue;
    const metrics = input.regionMetrics?.[region.regionId];
    const approvalDelay = clamp01(metrics?.approvalDelay ?? 0.2);
    const load = clamp01(metrics?.operationalLoad ?? 0.35);

    let severity: RecoveryBottleneck["severity"] | null = null;
    let reason = "";

    if (profile.recoveryCapacityScore < 0.32 && profile.resilienceDegradation > 0.55) {
      severity = "critical";
      reason = `${region.label} has critically weak recovery capacity under sustained degradation.`;
    } else if (region.regionId === "executive" && approvalDelay > 0.55) {
      severity = "high";
      reason = "Executive coordination bottlenecks are slowing enterprise-wide stabilization.";
    } else if (profile.recoveryThroughput < 0.35 && load > 0.6) {
      severity = "high";
      reason = `${region.label} faces recovery congestion under operational overload.`;
    } else if (region.regionId === "logistics" && profile.stabilizationEfficiency < 0.4) {
      severity = "moderate";
      reason = "Logistics recovery throughput is constrained despite upstream demand.";
    } else if (profile.recoveryCoordination < 0.4 && profile.adaptiveRecovery < 0.45) {
      severity = "moderate";
      reason = `${region.label} shows limited adaptive recovery coordination.`;
    }

    if (severity) {
      bottlenecks.push(
        Object.freeze({
          bottleneckId: `recovery-bottleneck::${region.regionId}`,
          regionId: region.regionId,
          severity,
          reason,
          contributingRegionIds: Object.freeze([region.regionId]),
        })
      );
    }
  }

  logRecoveryDev("Stabilization", {
    bottleneckCount: bottlenecks.length,
    regions: bottlenecks.map((b) => b.regionId),
  });

  return Object.freeze(bottlenecks.sort((a, b) => a.regionId.localeCompare(b.regionId)));
}
