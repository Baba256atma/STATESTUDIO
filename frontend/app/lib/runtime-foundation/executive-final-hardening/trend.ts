import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import type { HardeningTrendPoint, HardeningTrendSummary } from "./finalHardeningTypes.ts";

function dir(values: readonly number[], inverse = false): "improving" | "declining" | "flat" {
  if (values.length < 2) return "flat";
  const delta = values[values.length - 1]! - values[0]!;
  const adjusted = inverse ? -delta : delta;
  if (adjusted > 0.03) return "improving";
  if (adjusted < -0.03) return "declining";
  return "flat";
}

export function buildHardeningTrendSummary(previous: readonly HardeningTrendPoint[], current: HardeningTrendPoint): HardeningTrendSummary {
  const points = [...previous, current].slice(-8);
  return {
    stabilityImprovements: dir(points.map((point) => point.stabilityScore)),
    readinessImprovements: dir(points.map((point) => point.readinessScore)),
    trustImprovements: dir(points.map((point) => point.trustScore)),
    validationImprovements: dir(points.map((point) => point.validationScore)),
    issueReduction: dir(points.map((point) => point.issueCount), true),
    points: Object.freeze(points),
    signature: stableSignature(["d10-hardening-trend", points]),
  };
}
