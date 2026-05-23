import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import type {
  ExecutiveTrustEvaluation,
  RuntimeConsistencyIssue,
  RuntimeStateCheck,
  TrustRiskClassification,
  TrustRiskSeverity,
} from "./executiveReliabilityTypes.ts";

const SEVERITY_RANK: Record<TrustRiskSeverity, number> = {
  informational: 1,
  caution: 2,
  warning: 3,
  critical: 4,
};

export function trustRiskSeverityRank(severity: TrustRiskSeverity): number {
  return SEVERITY_RANK[severity];
}

function classifyScore(score: number): TrustRiskSeverity {
  if (score < 0.34) return "critical";
  if (score < 0.52) return "warning";
  if (score < 0.72) return "caution";
  return "informational";
}

function risk(source: string, severity: TrustRiskSeverity, reason: string, action: string): TrustRiskClassification {
  return {
    riskId: stableSignature(["d10-trust-risk", source, severity, reason]).slice(0, 56),
    severity,
    source,
    reason,
    recommendedNextAction: action,
  };
}

export function classifyTrustRisks(params: {
  evaluations: readonly ExecutiveTrustEvaluation[];
  consistencyIssues: readonly RuntimeConsistencyIssue[];
  runtimeChecks: readonly RuntimeStateCheck[];
  panelContractValid?: boolean | null;
  sceneSynchronized?: boolean | null;
}): readonly TrustRiskClassification[] {
  const risks: TrustRiskClassification[] = [];

  for (const evaluation of params.evaluations) {
    const severity = classifyScore(evaluation.trustScore);
    if (severity !== "informational") {
      risks.push(risk(
        evaluation.sourceType,
        severity,
        `${evaluation.sourceType} trust score is ${evaluation.trustScore.toFixed(2)}.`,
        "Review supporting factors and warning indicators before executive reliance."
      ));
    }
    for (const warning of evaluation.warningIndicators) {
      risks.push(risk(evaluation.sourceType, severity === "informational" ? "caution" : severity, warning, "Resolve warning before elevating trust."));
    }
  }

  for (const issue of params.consistencyIssues) {
    risks.push(risk(issue.issueType, issue.severity, issue.explanation, issue.recommendedNextAction));
  }

  for (const check of params.runtimeChecks) {
    if (check.state === "unstable" || check.state === "degraded") {
      risks.push(risk(
        check.checkId,
        check.state === "unstable" ? "critical" : "warning",
        check.reason,
        "Stabilize this runtime check before relying on executive output."
      ));
    }
  }

  if (params.panelContractValid === false) {
    risks.push(risk("panel_contract", "critical", "Panel contract validation is failing.", "Correct panel contract data before executive use."));
  }
  if (params.sceneSynchronized === false) {
    risks.push(risk("scene_synchronization", "warning", "Scene state is not synchronized.", "Resynchronize scene state before presenting results."));
  }

  return Object.freeze(
    Array.from(new Map(risks.map((item) => [item.riskId, item])).values())
      .sort((a, b) => trustRiskSeverityRank(b.severity) - trustRiskSeverityRank(a.severity) || a.source.localeCompare(b.source))
      .slice(0, 12)
  );
}

