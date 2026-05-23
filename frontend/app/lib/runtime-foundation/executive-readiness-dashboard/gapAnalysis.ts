import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import type {
  ExecutiveReadinessDashboardInput,
  ExecutiveReadinessGap,
  ReadinessGapSeverity,
} from "./executiveReadinessDashboardTypes.ts";

function gap(
  description: string,
  severity: ReadinessGapSeverity,
  rationale: string,
  recommendedNextAction: string
): ExecutiveReadinessGap {
  return {
    gapId: stableSignature(["d10-readiness-gap", description, severity, rationale]).slice(0, 56),
    description,
    severity,
    rationale,
    recommendedNextAction,
  };
}

export function analyzeExecutiveReadinessGaps(
  input: ExecutiveReadinessDashboardInput
): readonly ExecutiveReadinessGap[] {
  const gaps: ExecutiveReadinessGap[] = [];
  const registry = input.readinessRegistry;

  if (!registry) {
    gaps.push(gap(
      "Readiness registry is unavailable.",
      "critical",
      "Dashboard cannot verify platform or feature readiness evidence.",
      "Generate the D10 readiness registry before executive review."
    ));
  } else {
    for (const dimension of Object.values(registry.platform.dimensions)) {
      if (dimension.state === "blocked" || dimension.state === "not_ready") {
        gaps.push(gap(
          `${dimension.label} is ${dimension.state.replace("_", " ")}.`,
          dimension.state === "blocked" ? "critical" : "major",
          dimension.blockers[0] ?? "Readiness evidence is incomplete.",
          "Resolve or validate this readiness dimension."
        ));
      }
    }
    for (const feature of Object.values(registry.features.features)) {
      if (feature.readinessState === "blocked" || feature.readinessState === "not_ready") {
        gaps.push(gap(
          `${feature.label} readiness is ${feature.readinessState.replace("_", " ")}.`,
          feature.readinessState === "blocked" ? "critical" : "major",
          feature.blockers[0] ?? "Feature readiness evidence is incomplete.",
          "Complete feature validation before broader launch assessment."
        ));
      }
    }
  }

  for (const item of input.readinessSnapshot?.blocked ?? []) {
    gaps.push(gap("Blocked readiness item remains unresolved.", "critical", item, "Resolve blocked readiness before executive launch."));
  }
  for (const risk of input.reliabilitySnapshot?.risks ?? []) {
    gaps.push(gap(
      "Runtime trust concern requires attention.",
      risk.severity === "critical" ? "critical" : risk.severity === "warning" ? "major" : "moderate",
      risk.reason,
      risk.recommendedNextAction
    ));
  }
  for (const item of input.interactionSnapshot?.classifications ?? []) {
    gaps.push(gap(
      "Interaction stability concern requires attention.",
      item.severity === "critical" ? "critical" : item.severity === "warning" ? "major" : "moderate",
      item.explanation,
      item.suggestedResolution
    ));
  }

  return Object.freeze(Array.from(new Map(gaps.map((item) => [item.gapId, item])).values()).slice(0, 16));
}

