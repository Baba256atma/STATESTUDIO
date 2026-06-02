/**
 * E2:99 — Strategic Co-Reasoning Engine: observation, questioning, trade-offs.
 */

import type {
  BuildExecutiveAdvisorInput,
  ExecutiveAdvisorEvidence,
  ExecutiveAdvisorObservation,
  ExecutiveAdvisorQuestion,
  ExecutiveAdvisorTradeOff,
} from "./executiveAdvisorTypes.ts";

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, Number(value.toFixed(3))));
}

export function buildAdvisorEvidence(input: BuildExecutiveAdvisorInput): ExecutiveAdvisorEvidence[] {
  const evidence: ExecutiveAdvisorEvidence[] = [];
  const twin = input.cognitiveTwin;
  if (twin?.active) {
    evidence.push({
      id: "evidence_twin_pulse",
      label: "Cognitive Twin Pulse",
      detail: `Enterprise pulse ${Math.round(twin.scores.enterprisePulseScore * 100)} with ${twin.riskEvolution} risk evolution.`,
      source: "twin",
    });
    twin.driftSignals.slice(0, 3).forEach((signal, index) => {
      evidence.push({
        id: `evidence_twin_drift_${index}`,
        label: signal.title,
        detail: signal.summary,
        source: "twin",
      });
    });
  }
  input.warRoom?.alerts.slice(0, 3).forEach((alert, index) => {
    evidence.push({
      id: `evidence_warroom_alert_${index}`,
      label: alert.title,
      detail: alert.message,
      source: "war_room",
    });
  });
  if (input.activeSimulation) {
    evidence.push({
      id: "evidence_simulation",
      label: "Active Simulation",
      detail: input.activeSimulation.summary,
      source: "simulation",
    });
  }
  (input.timelineEvents ?? [])
    .filter((event) => event.status === "active")
    .slice(0, 2)
    .forEach((event) => {
      evidence.push({
        id: `evidence_timeline_${event.id}`,
        label: event.title,
        detail: event.summary ?? event.title,
        source: "timeline",
      });
    });
  (input.memoryState?.entries ?? []).slice(0, 2).forEach((entry, index) => {
    evidence.push({
      id: `evidence_memory_${index}`,
      label: entry.decisionSummary,
      detail: `${entry.riskLevel} risk · ${entry.outcome}`,
      source: "memory",
    });
  });
  return evidence;
}

export function detectAdvisorObservations(input: BuildExecutiveAdvisorInput): ExecutiveAdvisorObservation[] {
  const observations: ExecutiveAdvisorObservation[] = [];
  const twin = input.cognitiveTwin;

  twin?.futureBranches
    .filter((branch) => branch.overallScore >= 0.65 && branch.riskEvolution !== "growing")
    .slice(0, 2)
    .forEach((branch) => {
      observations.push({
        id: `opp_${branch.scenarioId}`,
        kind: "opportunity",
        title: `Opportunity rising in ${branch.title}`,
        summary: `${branch.title} shows favorable confidence with manageable risk evolution.`,
        urgency: 0.58,
        confidence: branch.confidence === "high" ? 0.82 : 0.64,
        relatedObjectIds: [],
        relatedScenarioId: branch.scenarioId,
      });
    });

  if (twin?.riskEvolution === "growing" || input.activeSimulation?.riskLevel === "high") {
    observations.push({
      id: "risk_growing_operational",
      kind: "risk",
      title: "Growing operational risk detected",
      summary:
        input.activeSimulation?.summary ??
        "Risk propagation across the twin is intensifying and requires executive review.",
      urgency: 0.86,
      confidence: 0.78,
      relatedObjectIds: input.activeSimulation?.affectedObjectIds ?? twin?.livingObjectIds ?? [],
      relatedScenarioId: input.activeSimulation?.scenarioId ?? null,
    });
  }

  twin?.driftSignals.forEach((signal, index) => {
    observations.push({
      id: `drift_${signal.kind}_${index}`,
      kind: signal.kind === "strategic" ? "misalignment" : "drift",
      title: signal.title,
      summary: signal.summary,
      urgency: clamp01(signal.score + 0.2),
      confidence: 0.68,
      relatedObjectIds: [],
      relatedScenarioId: null,
    });
  });

  if (
    input.decisionRecommendation?.recommendedScenarioId &&
    input.scenarioComparison?.highestRiskScenarioId &&
    input.decisionRecommendation.recommendedScenarioId !== input.scenarioComparison.highestRiskScenarioId
  ) {
    const risky = input.scenarioComparison.rows.find(
      (row) => row.scenarioId === input.scenarioComparison?.highestRiskScenarioId
    );
    if (risky?.riskLevel === "high") {
      observations.push({
        id: "misalignment_strategy_risk",
        kind: "misalignment",
        title: "Strategy conflicts with highest-risk scenario exposure",
        summary: `Recommended direction may diverge from ${risky.title}, which carries elevated propagation risk.`,
        urgency: 0.72,
        confidence: 0.7,
        relatedObjectIds: [],
        relatedScenarioId: risky.scenarioId,
      });
    }
  }

  if ((input.alerts ?? []).some((alert) => !alert.acknowledged && alert.level === "critical")) {
    observations.push({
      id: "blindspot_unacked_critical",
      kind: "blind_spot",
      title: "Critical alerts remain unacknowledged",
      summary: "Executive attention has not yet closed critical operational alerts.",
      urgency: 0.9,
      confidence: 0.84,
      relatedObjectIds: (input.alerts ?? []).flatMap((alert) => alert.relatedObjectIds),
      relatedScenarioId: null,
    });
  }

  if (twin && twin.scores.enterprisePulseScore >= 0.62 && twin.scores.enterpriseStabilityScore < 0.5) {
    observations.push({
      id: "early_signal_instability",
      kind: "early_signal",
      title: "Early instability signal before escalation",
      summary: "Pulse is elevated while stability is falling — a weak signal that may precede broader disruption.",
      urgency: 0.64,
      confidence: 0.61,
      relatedObjectIds: twin.livingObjectIds,
      relatedScenarioId: null,
    });
  }

  return observations.sort((left, right) => right.urgency * right.confidence - left.urgency * left.confidence);
}

export function generateStrategicQuestions(
  observations: readonly ExecutiveAdvisorObservation[],
  input: BuildExecutiveAdvisorInput
): ExecutiveAdvisorQuestion[] {
  const questions: ExecutiveAdvisorQuestion[] = [];
  const topRisk = observations.find((entry) => entry.kind === "risk");
  if (topRisk) {
    questions.push({
      id: "q_risk_response",
      kind: "strategic_challenge",
      question: "Should we intervene now before this risk propagates further?",
      rationale: topRisk.summary,
      priority: 0.88,
    });
  }
  const misalignment = observations.find((entry) => entry.kind === "misalignment");
  if (misalignment) {
    questions.push({
      id: "q_misalignment",
      kind: "assumption_check",
      question: "Does the current strategy still match our stated objective under this scenario mix?",
      rationale: misalignment.summary,
      priority: 0.8,
    });
  }
  if (input.cognitiveTwin?.resourceConstraints.some((entry) => entry.bottleneck)) {
    questions.push({
      id: "q_resource_bottleneck",
      kind: "blind_spot",
      question: "Which initiatives should lose resources until capacity constraints are resolved?",
      rationale: "Resource bottlenecks are visible in the cognitive twin but may be underweighted in planning.",
      priority: 0.74,
    });
  }
  if (input.warRoom?.recommendations[0]) {
    questions.push({
      id: "q_recommendation_tradeoff",
      kind: "strategic_challenge",
      question: `Why not pursue ${input.warRoom.recommendations[0].title} immediately?`,
      rationale: input.warRoom.recommendations[0].reasoning,
      priority: 0.7,
    });
  }
  return questions.sort((left, right) => right.priority - left.priority).slice(0, 5);
}

export function detectTradeOffs(input: BuildExecutiveAdvisorInput): ExecutiveAdvisorTradeOff[] {
  const rows = input.scenarioComparison?.rows ?? [];
  if (rows.length < 2) return [];

  return rows.slice(0, 3).map((row) => {
    const gain = row.riskLevel === "low" ? 0.72 : row.riskLevel === "medium" ? 0.58 : 0.38;
    const cost = row.affectedCount >= 3 ? 0.74 : row.affectedCount >= 2 ? 0.56 : 0.34;
    const risk = row.riskLevel === "high" ? 0.82 : row.riskLevel === "medium" ? 0.55 : 0.28;
    return {
      id: `tradeoff_${row.scenarioId}`,
      title: row.title,
      gain,
      cost,
      risk,
      explanation: row.tradeoff,
      preferredOption: row.scenarioId === input.scenarioComparison?.bestOptionId ? row.title : null,
    };
  }).sort((left, right) => right.gain - left.cost - right.risk - (left.gain - left.cost - left.risk));
}

export function derivePreferenceSignals(input: BuildExecutiveAdvisorInput): string[] {
  const signals: string[] = [];
  if ((input.memoryState?.entries ?? []).some((entry) => entry.outcome === "stable")) {
    signals.push("Prefers lower-risk stable outcomes when confidence is sufficient.");
  }
  if ((input.memoryState?.entries ?? []).some((entry) => entry.riskLevel === "high")) {
    signals.push("Has previously operated under high-risk execution conditions.");
  }
  if (input.decisionRecommendation && input.decisionRecommendation.confidence >= 0.7) {
    signals.push("Responds to high-confidence structured scenario recommendations.");
  }
  return signals;
}
