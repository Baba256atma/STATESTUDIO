import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import type { CompletionTrendPoint, CompletionTrendSummary } from "./mvpCompletionTypes.ts";

function trend(values: readonly number[]): "improving" | "declining" | "flat" {
  if (values.length < 2) return "flat";
  const delta = values[values.length - 1]! - values[0]!;
  if (delta > 0.03) return "improving";
  if (delta < -0.03) return "declining";
  return "flat";
}

export function buildCompletionTrendSummary(previous: readonly CompletionTrendPoint[], current: CompletionTrendPoint): CompletionTrendSummary {
  const points = [...previous, current].slice(-8);
  return {
    readinessImprovement: trend(points.map((point) => point.readinessScore)),
    trustImprovement: trend(points.map((point) => point.trustScore)),
    validationImprovement: trend(points.map((point) => point.validationScore)),
    stabilityImprovement: trend(points.map((point) => point.stabilityScore)),
    completionProgression: trend(points.map((point) => point.completionScore)),
    points: Object.freeze(points),
    signature: stableSignature(["d10-completion-trend", points]),
  };
}
