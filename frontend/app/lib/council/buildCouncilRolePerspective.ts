import type { CouncilRole, CouncilRolePerspective } from "./councilTypes";

type RolePerspectiveInput = {
  role: CouncilRole;
  recommendationAction: string;
  recommendationWhy: string;
  impactSummary: string;
  riskSummary: string;
  tradeoffSummary: string;
  confidenceLabel: string;
  calibrationLabel: string;
  metaStrategy: string;
  policyPosture: string;
  governanceMode: string;
  approvalStatus: string;
  teamSignal: string;
  collaborationSignal: string;
  orgSignal: string;
  learningSignal: string;
  patternSignal: string;
  targetSummary: string;
};

function dedupe(items: Array<string | null | undefined>, limit = 3): string[] {
  return Array.from(
    new Set(
      items
        .map((item) => String(item ?? "").replace(/\s+/g, " ").trim())
        .filter(Boolean)
    )
  ).slice(0, limit);
}

function prettify(value: string) {
  return value.replace(/_/g, " ");
}

export function buildCouncilRolePerspective(
  input: RolePerspectiveInput
): CouncilRolePerspective {
  const confidenceNote = `Confidence is ${input.confidenceLabel}, calibration is ${prettify(input.calibrationLabel)}.`;

  switch (input.role) {
    case "strategist":
      return {
        role: input.role,
        headline: input.impactSummary || input.recommendationWhy || "Preserve strategic position while moving decisively.",
        priorities: dedupe([
          input.recommendationAction,
          input.impactSummary,
          input.learningSignal,
          input.metaStrategy !== "unknown" ? `Use a ${prettify(input.metaStrategy)} posture.` : null,
        ]),
        concerns: dedupe([
          input.tradeoffSummary,
          input.orgSignal,
          input.policyPosture !== "permissive" ? `Policy posture is ${prettify(input.policyPosture)}.` : null,
        ]),
        proposed_action:
          input.metaStrategy === "compare_first"
            ? "Compare the current path against one strategically cleaner alternative."
            : input.metaStrategy === "simulation_first"
              ? "Pressure-test the recommendation through simulation before stronger action."
              : input.recommendationAction || "Refine the strategic move before committing.",
        confidence_note: confidenceNote,
      };
    case "risk_officer":
      return {
        role: input.role,
        headline: input.riskSummary || "Protect downside and avoid hidden fragility.",
        priorities: dedupe([
          input.riskSummary,
          input.patternSignal,
          input.orgSignal,
          input.governanceMode !== "simulation_allowed" ? `Respect ${prettify(input.governanceMode)} controls.` : null,
        ]),
        concerns: dedupe([
          input.collaborationSignal,
          input.calibrationLabel === "overconfident" ? "Confidence may be overstated for this class of decision." : null,
          input.approvalStatus === "pending_review" ? "Stronger action remains gated by approval." : null,
        ]),
        proposed_action:
          input.governanceMode === "blocked" || input.policyPosture === "restricted"
            ? "Remain in preview mode until risk signals improve."
            : "Use simulation or compare-first review before direct apply.",
        confidence_note: confidenceNote,
      };
    case "operator":
      return {
        role: input.role,
        headline: input.targetSummary || "Execution feasibility should shape the next move.",
        priorities: dedupe([
          input.targetSummary,
          input.metaStrategy === "simulation_first" ? "Validate operational impact before execution." : null,
          input.teamSignal,
        ]),
        concerns: dedupe([
          input.tradeoffSummary,
          input.governanceMode === "preview_only" ? "Current controls limit execution to preview." : null,
          input.collaborationSignal,
        ]),
        proposed_action:
          input.governanceMode === "preview_only" || input.policyPosture === "simulation_first"
            ? "Run a safe preview or simulation before operational escalation."
            : "Sequence execution around the most exposed dependency first.",
        confidence_note: confidenceNote,
      };
    case "financial_reviewer":
      return {
        role: input.role,
        headline: input.orgSignal || "Protect resilience and avoid asymmetric downside.",
        priorities: dedupe([
          input.tradeoffSummary,
          input.learningSignal,
          input.impactSummary,
        ]),
        concerns: dedupe([
          input.riskSummary,
          input.policyPosture === "approval_gated" ? "Financial downside warrants approval before stronger action." : null,
          input.calibrationLabel === "underconfident" ? "Upside may be understated relative to recent evidence." : null,
        ]),
        proposed_action:
          input.metaStrategy === "compare_first"
            ? "Compare the current path against a lower-risk capital posture."
            : "Prefer the option that protects resilience before short-term efficiency.",
        confidence_note: confidenceNote,
      };
    case "skeptic":
    default:
      return {
        role: input.role,
        headline: input.collaborationSignal || "Challenge the weakest assumption before proceeding.",
        priorities: dedupe([
          input.patternSignal,
          input.calibrationLabel !== "well_calibrated" ? `Calibration is ${prettify(input.calibrationLabel)}.` : null,
          input.collaborationSignal,
        ]),
        concerns: dedupe([
          input.policyPosture !== "permissive" ? `Policy posture remains ${prettify(input.policyPosture)}.` : null,
          input.approvalStatus === "pending_review" ? "Approval remains unresolved." : null,
          input.teamSignal,
        ]),
        proposed_action:
          input.metaStrategy === "evidence_first" || input.confidenceLabel === "low"
            ? "Gather stronger evidence before any stronger commitment."
            : "Challenge one key assumption and re-check the recommendation against it.",
        confidence_note: confidenceNote,
      };
  }
}
