import { confidenceLevelFromScore } from "../../confidence/confidenceNarratives.ts";
import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import { evaluateExecutiveTrustArtifacts } from "./executiveTrustEvaluator.ts";
import { buildReliabilityTrendSummary, reliabilityStateRank } from "./reliabilityTrend.ts";
import { analyzeRuntimeConsistency } from "./runtimeConsistencyAnalyzer.ts";
import { classifyTrustRisks, trustRiskSeverityRank } from "./trustRiskClassifier.ts";
import type {
  ExecutiveReliabilityAggregationInput,
  ExecutiveReliabilitySnapshot,
  ExecutiveReliabilitySummary,
  ExecutiveTrustEvaluation,
  ReliabilityState,
  RuntimeStateCheck,
  TrustRiskClassification,
} from "./executiveReliabilityTypes.ts";

function clampScore(score: number): number {
  if (!Number.isFinite(score)) return 0;
  return Number(Math.min(1, Math.max(0, score)).toFixed(2));
}

function worstReliabilityState(states: readonly ReliabilityState[]): ReliabilityState {
  if (states.length === 0) return "degraded";
  return states.reduce((worst, state) =>
    reliabilityStateRank(state) < reliabilityStateRank(worst) ? state : worst, states[0]);
}

function stateFromReadiness(input: ExecutiveReliabilityAggregationInput): ReliabilityState {
  const readiness = input.readinessRegistry;
  if (!readiness) return "degraded";
  if (readiness.runtimeHealth.status === "critical") return "unstable";
  if (readiness.runtimeHealth.status === "degraded") return "degraded";
  if (readiness.runtimeHealth.status === "warning") return "recovering";
  if (readiness.platform.aggregateState === "blocked" || readiness.features.aggregateState === "blocked") return "unstable";
  if (readiness.platform.aggregateState === "not_ready" || readiness.features.aggregateState === "not_ready") return "degraded";
  if (readiness.platform.aggregateState === "in_progress" || readiness.features.aggregateState === "in_progress") return "recovering";
  return "stable";
}

function runtimeCheckState(input: ExecutiveReliabilityAggregationInput): RuntimeStateCheck[] {
  const checks = [...(input.validationResults ?? [])];
  if (input.panelContractValid === false) {
    checks.push({
      checkId: "panel_contract",
      label: "Panel contract",
      state: "unstable",
      confidence: 0.2,
      reason: "Panel contract validation is failing.",
    });
  }
  if (input.sceneSynchronized === false) {
    checks.push({
      checkId: "scene_synchronization",
      label: "Scene synchronization",
      state: "degraded",
      confidence: 0.45,
      reason: "Scene synchronization validation is not clean.",
    });
  }
  return checks;
}

function aggregateTrustScore(params: {
  evaluations: readonly ExecutiveTrustEvaluation[];
  checks: readonly RuntimeStateCheck[];
  risks: readonly TrustRiskClassification[];
  readinessState: ReliabilityState;
  confidenceSignals: readonly { confidenceScore: number }[];
}): number {
  const evalScore = params.evaluations.length
    ? params.evaluations.reduce((sum, item) => sum + item.trustScore, 0) / params.evaluations.length
    : 0.55;
  const checkScore = params.checks.length
    ? params.checks.reduce((sum, item) => sum + item.confidence, 0) / params.checks.length
    : 0.72;
  const signalScore = params.confidenceSignals.length
    ? params.confidenceSignals.reduce((sum, item) => sum + item.confidenceScore, 0) / params.confidenceSignals.length
    : 0.72;
  const readinessPenalty =
    params.readinessState === "unstable" ? 0.18 : params.readinessState === "degraded" ? 0.1 : 0;
  const criticalPenalty = params.risks.some((risk) => risk.severity === "critical") ? 0.18 : 0;
  const warningPenalty = params.risks.filter((risk) => risk.severity === "warning").length * 0.03;
  return clampScore(evalScore * 0.5 + checkScore * 0.25 + signalScore * 0.25 - readinessPenalty - criticalPenalty - warningPenalty);
}

function buildConcerns(risks: readonly TrustRiskClassification[]): string[] {
  if (risks.length === 0) return ["No material executive trust concern is currently detected."];
  return risks.slice(0, 5).map((risk) => risk.reason);
}

function buildNextActions(risks: readonly TrustRiskClassification[], state: ReliabilityState): string[] {
  if (risks.length > 0) {
    return Array.from(new Set(risks.slice(0, 4).map((risk) => risk.recommendedNextAction)));
  }
  if (state === "recovering") return ["Repeat validation before executive reliance."];
  return ["Keep trust evidence current before executive exposure."];
}

function summarizeReliability(params: {
  state: ReliabilityState;
  trustScore: number;
  risks: readonly TrustRiskClassification[];
  issueCount: number;
}): ExecutiveReliabilitySummary {
  return {
    reliabilityState: params.state,
    platformBehavingNormally: params.state === "stable" || (params.state === "recovering" && params.risks.length === 0),
    trustScore: params.trustScore,
    confidenceLevel: confidenceLevelFromScore(params.trustScore),
    highestTrustRisk: params.risks[0] ?? null,
    riskCount: params.risks.length,
    issueCount: params.issueCount,
  };
}

export function buildExecutiveReliabilitySnapshot(
  input: ExecutiveReliabilityAggregationInput
): ExecutiveReliabilitySnapshot {
  const organizationId = input.organizationId?.trim() || input.readinessRegistry?.organizationId || "nexora-default";
  const now = input.now ?? Date.now();
  const artifacts = input.artifacts ?? [];
  const evaluations = evaluateExecutiveTrustArtifacts(artifacts, now);
  const consistency = analyzeRuntimeConsistency(artifacts, now);
  const checks = runtimeCheckState(input);
  const initialRisks = classifyTrustRisks({
    evaluations,
    consistencyIssues: consistency.issues,
    runtimeChecks: checks,
    panelContractValid: input.panelContractValid,
    sceneSynchronized: input.sceneSynchronized,
  });
  const readinessState = stateFromReadiness(input);
  const state = worstReliabilityState([
    readinessState,
    ...evaluations.map((item) => item.reliabilityState),
    ...checks.map((item) => item.state),
    ...(consistency.issues.some((issue) => issue.severity === "critical") ? ["unstable" as const] : []),
  ]);
  const trustScore = aggregateTrustScore({
    evaluations,
    checks,
    risks: initialRisks,
    readinessState,
    confidenceSignals: input.confidenceSignals ?? [],
  });
  const risks = Object.freeze([...initialRisks].sort(
    (a, b) => trustRiskSeverityRank(b.severity) - trustRiskSeverityRank(a.severity) || a.source.localeCompare(b.source)
  ));
  const summary = summarizeReliability({
    state,
    trustScore,
    risks,
    issueCount: consistency.issues.length,
  });
  const canTrustResult = summary.trustScore >= 0.72 && state === "stable" && !risks.some((risk) => risk.severity === "critical");
  const answer = canTrustResult
    ? "Yes. Current executive-facing results are reliable enough for bounded trust."
    : "Not fully. Reliability concerns should be reviewed before executive reliance.";
  const trend = buildReliabilityTrendSummary({
    current: {
      generatedAt: now,
      trustScore,
      reliabilityState: state,
      confidenceLevel: summary.confidenceLevel,
    },
    previousSnapshots: input.previousSnapshots,
  });
  const signature = stableSignature([
    "d10-executive-reliability-snapshot",
    organizationId,
    trustScore,
    state,
    consistency.signature,
    risks.map((risk) => [risk.severity, risk.source, risk.reason]),
  ]);

  return {
    snapshotId: stableSignature(["d10-executive-reliability-snapshot", organizationId]).slice(0, 56),
    organizationId,
    generatedAt: now,
    answer,
    canTrustResult,
    platformBehavingNormally: summary.platformBehavingNormally,
    concerns: Object.freeze(buildConcerns(risks)),
    highestTrustRisk: risks[0] ?? null,
    shouldHappenNext: Object.freeze(buildNextActions(risks, state)),
    summary,
    evaluations,
    consistency,
    risks,
    trend,
    signature,
  };
}

