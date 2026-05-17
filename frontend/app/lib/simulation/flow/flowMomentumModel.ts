/**
 * D7:2:2 — Organizational momentum modeling (explainable, deterministic).
 */

import type {
  OperationalBottleneck,
  OrganizationalFlowState,
  RegionFlowPressure,
} from "./flowDynamicsTypes.ts";
import { logFlowDev } from "./flowDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function calculateFlowPressureScore(
  regionPressures: readonly RegionFlowPressure[]
): number {
  if (regionPressures.length === 0) return 0.2;
  const avg = regionPressures.reduce((sum, p) => sum + p.congestionScore, 0) / regionPressures.length;
  return clamp01(avg);
}

export function calculateOperationalMomentum(input: {
  flows: readonly { intensity: number; throughput?: number }[];
  bottlenecks: readonly OperationalBottleneck[];
  flowPressureScore: number;
}): { operationalMomentum: number; momentumLabel: OrganizationalFlowState["momentumLabel"] } {
  const avgThroughput =
    input.flows.length === 0
      ? 0.5
      : input.flows.reduce((sum, f) => sum + (f.throughput ?? 0.55), 0) / input.flows.length;

  const bottleneckPenalty = clamp01(input.bottlenecks.length * 0.12);
  const criticalPenalty = clamp01(
    input.bottlenecks.filter((b) => b.severity === "critical").length * 0.2
  );

  const operationalMomentum = clamp01(
    avgThroughput * 0.45 + (1 - input.flowPressureScore) * 0.35 - bottleneckPenalty - criticalPenalty
  );

  let momentumLabel: OrganizationalFlowState["momentumLabel"] = "healthy";
  if (operationalMomentum < 0.4 || input.flowPressureScore > 0.7) {
    momentumLabel = "unstable";
  } else if (operationalMomentum < 0.6 || input.flowPressureScore > 0.5) {
    momentumLabel = "strained";
  }

  logFlowDev("FlowPressure", {
    operationalMomentum,
    momentumLabel,
    flowPressureScore: input.flowPressureScore,
  });

  return { operationalMomentum, momentumLabel };
}
