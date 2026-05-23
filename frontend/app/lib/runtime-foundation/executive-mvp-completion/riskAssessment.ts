import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import type { ExecutiveMVPCompletionInput, PublishRisk, PublishRiskSeverity } from "./mvpCompletionTypes.ts";

function risk(rationale: string, severity: PublishRiskSeverity, impact: string, recommendedAction: string): PublishRisk {
  return {
    riskId: stableSignature(["d10-publish-risk", rationale, severity]).slice(0, 56),
    rationale,
    severity,
    impact,
    recommendedAction,
    signature: stableSignature(["d10-publish-risk", rationale, severity, impact, recommendedAction]),
  };
}

export function assessPublishRisks(input: ExecutiveMVPCompletionInput): readonly PublishRisk[] {
  const risks: PublishRisk[] = [];
  for (const blocker of input.launchGate?.blockers ?? []) {
    risks.push(risk(blocker.rationale, blocker.severity === "launch_blocker" ? "critical" : "warning", blocker.affectedCapability, blocker.recommendedResolution));
  }
  for (const hardeningRisk of input.finalHardening?.riskInventory ?? []) {
    risks.push(risk(hardeningRisk.description, hardeningRisk.severity, hardeningRisk.impact, hardeningRisk.recommendedMitigation));
  }
  if (!input.validationSuite?.summary.validationPassed) risks.push(risk("Validation has not passed.", "critical", "Publication confidence is blocked.", "Resolve validation failures."));
  if ((input.dashboard?.runtimeTrust ?? "critical") !== "healthy") risks.push(risk("Trust posture is not healthy.", "warning", "Executives may question recommendations.", "Review trust concerns before publication."));
  if ((input.dashboard?.interactionStability ?? "critical") !== "healthy") risks.push(risk("Stability posture is not healthy.", "warning", "Executive workflows may be less predictable.", "Review stability findings before publication."));
  if (!input.finalHardening?.summary.isProductionCandidate) risks.push(risk("Final hardening has not classified Nexora as a production candidate.", "warning", "Publication should wait for hardening clearance.", "Complete final hardening review."));
  const byId = new Map<string, PublishRisk>();
  for (const item of risks) byId.set(item.riskId, item);
  return Object.freeze(Array.from(byId.values()));
}
