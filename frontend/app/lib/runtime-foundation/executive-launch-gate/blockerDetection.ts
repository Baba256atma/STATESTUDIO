import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import type {
  ExecutiveLaunchGateInput,
  LaunchBlockingItem,
  LaunchBlockerSeverity,
} from "./executiveLaunchGateTypes.ts";

function blocker(
  description: string,
  severity: LaunchBlockerSeverity,
  affectedCapability: string,
  rationale: string,
  recommendedResolution: string
): LaunchBlockingItem {
  return {
    blockerId: stableSignature(["d10-launch-blocker", description, affectedCapability, severity]).slice(0, 56),
    description,
    severity,
    affectedCapability,
    rationale,
    recommendedResolution,
  };
}

export function detectLaunchBlockers(input: ExecutiveLaunchGateInput): readonly LaunchBlockingItem[] {
  const blockers: LaunchBlockingItem[] = [];

  if (!input.dashboard) {
    blockers.push(blocker(
      "Executive readiness dashboard is missing.",
      "launch_blocker",
      "executive_readiness",
      "Launch decision cannot be explained without the executive dashboard aggregation.",
      "Generate D10 executive readiness dashboard before launch governance review."
    ));
  }
  if (!input.validationSuite) {
    blockers.push(blocker(
      "Executive validation suite has not run.",
      "critical",
      "validation",
      "Validation evidence is required before demo, pilot, or release candidate decisions.",
      "Run D10 executive validation suite."
    ));
  } else if (input.validationSuite.state === "failed" || input.validationSuite.summary.validationPassed === false) {
    blockers.push(blocker(
      "Executive validation suite reported failures.",
      "launch_blocker",
      "validation",
      input.validationSuite.summary.highestRisk?.description ?? "Validation failures remain unresolved.",
      "Resolve failed validation scenarios before launch."
    ));
  } else if (input.validationSuite.advisory === "validation_incomplete") {
    blockers.push(blocker(
      "Executive validation coverage is incomplete.",
      "critical",
      "validation",
      "Not all required validation scenarios executed.",
      "Complete all executive validation scenarios before launch decision."
    ));
  }

  for (const gap of input.dashboard?.gaps ?? []) {
    if (gap.severity === "critical") {
      blockers.push(blocker(
        gap.description,
        "launch_blocker",
        "readiness",
        gap.rationale,
        gap.recommendedNextAction
      ));
    }
  }
  for (const risk of input.reliabilitySnapshot?.risks ?? []) {
    if (risk.severity === "critical") {
      blockers.push(blocker(
        "Critical runtime trust violation remains unresolved.",
        "launch_blocker",
        "runtime_trust",
        risk.reason,
        risk.recommendedNextAction
      ));
    }
  }
  for (const classification of input.interactionSnapshot?.classifications ?? []) {
    if (classification.severity === "critical") {
      blockers.push(blocker(
        "Critical interaction stability violation remains unresolved.",
        "launch_blocker",
        "interaction_stability",
        classification.explanation,
        classification.suggestedResolution
      ));
    }
  }
  if (input.readinessSnapshot?.blocked.length) {
    for (const item of input.readinessSnapshot.blocked) {
      blockers.push(blocker(
        "Readiness blocker remains unresolved.",
        "launch_blocker",
        "readiness",
        item,
        "Resolve blocked readiness item before launch recommendation."
      ));
    }
  }

  return Object.freeze(Array.from(new Map(blockers.map((item) => [item.blockerId, item])).values()));
}

