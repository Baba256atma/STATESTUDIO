import type { DecisionPolicyRule } from "./decisionPolicyTypes";

export function buildDecisionPolicyRules(): DecisionPolicyRule[] {
  return [
    {
      id: "policy_evidence_vs_impact",
      label: "Evidence quality should match downstream impact",
      category: "evidence_quality",
      summary: "High-impact decisions need stronger evidence before stronger action.",
      severity: "high",
    },
    {
      id: "policy_calibration_guardrail",
      label: "Weak calibration should trigger caution",
      category: "calibration",
      summary: "Overconfident recommendation classes should not move directly toward stronger action.",
      severity: "medium",
    },
    {
      id: "policy_team_alignment",
      label: "Low team alignment should increase review",
      category: "team_alignment",
      summary: "Cross-role disagreement should push the decision toward comparison or review.",
      severity: "high",
    },
    {
      id: "policy_org_memory",
      label: "Organization memory warnings should shape posture",
      category: "org_memory",
      summary: "Cross-project underperformance should make the current posture more cautious.",
      severity: "medium",
    },
    {
      id: "policy_environment",
      label: "Environment safety flags constrain execution",
      category: "environment",
      summary: "Safe-mode or blocked environments restrict stronger actions.",
      severity: "high",
    },
    {
      id: "policy_confidence_quality",
      label: "Confidence must be supported by evidence",
      category: "confidence",
      summary: "Low-confidence or low-evidence decisions should not look permissive.",
      severity: "medium",
    },
  ];
}
