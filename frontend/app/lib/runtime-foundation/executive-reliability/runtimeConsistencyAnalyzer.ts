import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import type {
  ExecutiveTrustArtifact,
  RuntimeConsistencyAnalysis,
  RuntimeConsistencyIssue,
  TrustRiskSeverity,
} from "./executiveReliabilityTypes.ts";

const STALE_INTELLIGENCE_MS = 10 * 60 * 1000;

function normalizedText(value: string | null | undefined): string {
  return String(value ?? "").trim().toLowerCase();
}

function polarity(value: string): "positive" | "negative" | "neutral" {
  const text = normalizedText(value);
  if (/\b(not ready|avoid|decline|worse|critical|blocked|unstable|high risk|no go)\b/.test(text)) return "negative";
  if (/\b(ready|proceed|improve|stable|low risk|go|healthy|recommended)\b/.test(text)) return "positive";
  return "neutral";
}

function issue(params: {
  type: RuntimeConsistencyIssue["issueType"];
  ids: readonly string[];
  explanation: string;
  severity: TrustRiskSeverity;
  action: string;
}): RuntimeConsistencyIssue {
  return {
    issueId: stableSignature(["d10-consistency-issue", params.type, params.ids, params.explanation]).slice(0, 56),
    issueType: params.type,
    sourceArtifactIds: Object.freeze([...params.ids].sort()),
    explanation: params.explanation,
    severity: params.severity,
    recommendedNextAction: params.action,
  };
}

export function analyzeRuntimeConsistency(
  artifacts: readonly ExecutiveTrustArtifact[],
  now: number
): RuntimeConsistencyAnalysis {
  const ordered = [...artifacts].sort((a, b) => a.artifactId.localeCompare(b.artifactId));
  const issues: RuntimeConsistencyIssue[] = [];

  for (let i = 0; i < ordered.length; i += 1) {
    const left = ordered[i];
    const leftConclusion = polarity(left.conclusion);
    const leftRecommendation = polarity(left.recommendation ?? "");
    if (now - left.generatedAt > STALE_INTELLIGENCE_MS) {
      issues.push(issue({
        type: "stale_intelligence",
        ids: [left.artifactId],
        explanation: `${left.title} is older than the executive trust freshness window.`,
        severity: "caution",
        action: "Refresh the underlying intelligence before relying on this result.",
      }));
    }
    if (left.validationState === "invalid" || left.contractValid === false) {
      issues.push(issue({
        type: "invalid_state_propagation",
        ids: [left.artifactId],
        explanation: `${left.title} has invalid validation or contract state.`,
        severity: "critical",
        action: "Block executive reliance until the invalid state is corrected.",
      }));
    }
    if (left.executionChainComplete === false) {
      issues.push(issue({
        type: "incomplete_execution_chain",
        ids: [left.artifactId],
        explanation: `${left.title} did not complete its execution chain.`,
        severity: "warning",
        action: "Complete the missing execution step before presenting this result.",
      }));
    }

    for (let j = i + 1; j < ordered.length; j += 1) {
      const right = ordered[j];
      const rightConclusion = polarity(right.conclusion);
      const rightRecommendation = polarity(right.recommendation ?? "");
      if (leftConclusion !== "neutral" && rightConclusion !== "neutral" && leftConclusion !== rightConclusion) {
        issues.push(issue({
          type: "conflicting_conclusions",
          ids: [left.artifactId, right.artifactId],
          explanation: `${left.title} and ${right.title} point to different executive conclusions.`,
          severity: "warning",
          action: "Reconcile the conclusion mismatch before executive review.",
        }));
      }
      if (
        leftRecommendation !== "neutral" &&
        rightRecommendation !== "neutral" &&
        leftRecommendation !== rightRecommendation
      ) {
        issues.push(issue({
          type: "contradictory_recommendations",
          ids: [left.artifactId, right.artifactId],
          explanation: `${left.title} and ${right.title} recommend incompatible actions.`,
          severity: "warning",
          action: "Resolve recommendation conflict before acting on either result.",
        }));
      }
      if (Math.abs(left.confidenceScore - right.confidenceScore) >= 0.36) {
        issues.push(issue({
          type: "mismatched_confidence",
          ids: [left.artifactId, right.artifactId],
          explanation: `${left.title} and ${right.title} have materially different confidence levels.`,
          severity: "caution",
          action: "Review evidence quality behind the lower-confidence output.",
        }));
      }
    }
  }

  const unique = Array.from(new Map(issues.map((item) => [item.issueId, item])).values());
  const signature = stableSignature([
    "d10-runtime-consistency-analysis",
    unique.map((item) => [item.issueType, item.sourceArtifactIds, item.severity]),
  ]);

  return {
    consistent: unique.length === 0,
    issues: Object.freeze(unique),
    generatedAt: now,
    signature,
  };
}

