import type { OrgMemorySignal } from "./orgMemoryTypes";

type BuildOrgMemoryGuidanceInput = {
  signals: OrgMemorySignal[];
  currentAction?: string | null;
};

export function buildOrgMemoryGuidance(input: BuildOrgMemoryGuidanceInput): string | null {
  const currentAction = String(input.currentAction ?? "").trim();
  const failure = input.signals.find((signal) => signal.category === "org_failure_pattern" || signal.category === "org_confidence_pattern");
  const success = input.signals.find((signal) => signal.category === "org_success_pattern");
  const gap = input.signals.find((signal) => signal.category === "org_learning_gap");
  const tradeoff = input.signals.find((signal) => signal.category === "org_tradeoff_pattern");

  if (failure) {
    return `Organization memory suggests extra caution for${currentAction ? ` ${currentAction}` : " this recommendation"} because similar cross-project decisions have underperformed or overstated confidence.`;
  }
  if (success) {
    return `Across teams and projects, similar decisions tend to hold up well enough that this recommendation can be treated as organization-backed guidance.`;
  }
  if (tradeoff) {
    return `Organization memory suggests explicitly managing ${tradeoff.label.toLowerCase()} before action so teams do not repeat the same cross-project tension.`;
  }
  if (gap) {
    return `Organization memory remains limited here. Capture more replay-backed outcome evidence before treating this decision family as broadly reliable.`;
  }
  return null;
}
