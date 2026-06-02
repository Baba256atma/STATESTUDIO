/**
 * E2:99 — Executive Advisor runtime: autonomous strategic co-reasoning synthesis.
 */

import {
  logE299AdvisorInitialized,
  logE299OpportunityDetected,
  logE299RecommendationGenerated,
  logE299RiskDetected,
  logE299StrategicQuestionGenerated,
} from "./executiveAdvisorDiagnostics.ts";
import {
  buildAdvisorEvidence,
  detectAdvisorObservations,
  derivePreferenceSignals,
  detectTradeOffs,
  generateStrategicQuestions,
} from "./strategicCoReasoningEngine.ts";
import type {
  BuildExecutiveAdvisorInput,
  ExecutiveAdvisorCopilotContext,
  ExecutiveAdvisorHudModel,
  ExecutiveAdvisorReasoningChain,
  ExecutiveAdvisorRecommendation,
  ExecutiveAdvisorScenarioEvaluation,
  ExecutiveAdvisorState,
  ExecutiveAdvisorStrategicBrief,
  ExecutiveAdvisorTimelineWarning,
} from "./executiveAdvisorTypes.ts";

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, Number(value.toFixed(3))));
}

function buildRecommendations(
  input: BuildExecutiveAdvisorInput,
  observations: ReturnType<typeof detectAdvisorObservations>,
  evidence: ReturnType<typeof buildAdvisorEvidence>
): ExecutiveAdvisorRecommendation[] {
  const recommendations: ExecutiveAdvisorRecommendation[] = [];
  const evidenceIds = evidence.map((entry) => entry.id);

  if (input.decisionRecommendation?.recommendedScenarioId) {
    recommendations.push({
      id: "rec_strategic_scenario",
      title: "Pursue recommended strategic scenario",
      action: input.decisionRecommendation.nextAction,
      reasoning: input.decisionRecommendation.reasoning,
      impactScore: clamp01(input.decisionRecommendation.confidence + 0.12),
      confidence: clamp01(input.decisionRecommendation.confidence),
      urgency: 0.7,
      feasibility: 0.68,
      rank: 1,
      status: "proposed",
      evidenceIds,
    });
  }

  const topRisk = observations.find((entry) => entry.kind === "risk");
  if (topRisk) {
    recommendations.push({
      id: "rec_contain_risk",
      title: "Contain emerging operational risk",
      action: "Focus war room on risk mode and inspect highest-risk propagation paths.",
      reasoning: topRisk.summary,
      impactScore: 0.82,
      confidence: topRisk.confidence,
      urgency: topRisk.urgency,
      feasibility: 0.74,
      rank: recommendations.length + 1,
      status: "proposed",
      evidenceIds: evidenceIds.slice(0, 3),
    });
  }

  const topOpportunity = observations.find((entry) => entry.kind === "opportunity");
  if (topOpportunity) {
    recommendations.push({
      id: "rec_capture_opportunity",
      title: "Evaluate rising opportunity path",
      action: `Compare ${topOpportunity.title} against current baseline in scenario mode.`,
      reasoning: topOpportunity.summary,
      impactScore: 0.76,
      confidence: topOpportunity.confidence,
      urgency: topOpportunity.urgency,
      feasibility: 0.7,
      rank: recommendations.length + 1,
      status: "proposed",
      evidenceIds: evidenceIds.slice(0, 2),
    });
  }

  input.warRoom?.recommendations.slice(0, 2).forEach((entry, index) => {
    recommendations.push({
      id: `rec_warroom_${index}`,
      title: entry.title,
      action: entry.reasoning,
      reasoning: entry.reasoning,
      impactScore: clamp01(entry.impactScore),
      confidence: clamp01(entry.confidence),
      urgency: clamp01(entry.urgency),
      feasibility: 0.66,
      rank: recommendations.length + 1,
      status: "proposed",
      evidenceIds,
    });
  });

  return recommendations
    .sort(
      (left, right) =>
        right.impactScore * 0.35 +
        right.urgency * 0.3 +
        right.confidence * 0.2 +
        right.feasibility * 0.15 -
        (left.impactScore * 0.35 + left.urgency * 0.3 + left.confidence * 0.2 + left.feasibility * 0.15)
    )
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}

function buildReasoningChains(
  observations: ReturnType<typeof detectAdvisorObservations>,
  recommendations: ExecutiveAdvisorRecommendation[],
  evidence: ReturnType<typeof buildAdvisorEvidence>
): ExecutiveAdvisorReasoningChain[] {
  const top = observations[0];
  if (!top) return [];
  const evidenceIds = evidence.slice(0, 3).map((entry) => entry.id);
  return [
    {
      chainId: "chain_primary",
      topic: top.title,
      steps: [
        {
          stepId: "observe",
          label: "Observe",
          conclusion: top.summary,
          confidence: top.confidence,
          evidenceIds,
        },
        {
          stepId: "assess",
          label: "Assess",
          conclusion: `Urgency ${Math.round(top.urgency * 100)} with ${top.kind} classification.`,
          confidence: clamp01(top.confidence * 0.9),
          evidenceIds,
        },
        {
          stepId: "recommend",
          label: "Recommend",
          conclusion: recommendations[0]?.action ?? "Maintain observation and prepare decision review.",
          confidence: recommendations[0]?.confidence ?? 0.55,
          evidenceIds: recommendations[0]?.evidenceIds ?? evidenceIds,
        },
      ],
      overallConfidence: clamp01(
        (top.confidence + (recommendations[0]?.confidence ?? 0.5)) / 2
      ),
    },
  ];
}

function buildScenarioEvaluations(input: BuildExecutiveAdvisorInput): ExecutiveAdvisorScenarioEvaluation[] {
  const branches = input.cognitiveTwin?.futureBranches ?? [];
  if (branches.length > 0) {
    return [...branches]
      .sort((left, right) => right.overallScore - left.overallScore)
      .map((branch, index) => ({
        scenarioId: branch.scenarioId,
        title: branch.title,
        rank: index + 1,
        warningLevel:
          branch.riskEvolution === "growing"
            ? ("critical" as const)
            : branch.riskEvolution === "stable"
              ? ("watch" as const)
              : ("none" as const),
        summary: `${branch.title} confidence ${branch.confidence} with ${branch.riskEvolution} risk evolution.`,
        confidence: branch.confidence === "high" ? 0.82 : branch.confidence === "medium" ? 0.62 : 0.42,
      }));
  }

  return (input.scenarioComparison?.rows ?? []).map((row, index) => ({
    scenarioId: row.scenarioId,
    title: row.title,
    rank: index + 1,
    warningLevel: row.riskLevel === "high" ? ("elevated" as const) : row.riskLevel === "medium" ? ("watch" as const) : ("none" as const),
    summary: row.tradeoff,
    confidence: row.confidence,
  }));
}

function buildTimelineWarnings(input: BuildExecutiveAdvisorInput): ExecutiveAdvisorTimelineWarning[] {
  return (input.timelineEvents ?? [])
    .filter((event) => event.severity === "critical" || event.severity === "warning" || event.markerType === "risk")
    .slice(0, 5)
    .map((event, index) => ({
      id: `timeline_warning_${event.id}`,
      title: event.title,
      summary: event.summary ?? event.narrativeSummary ?? event.title,
      severity: event.severity === "critical" ? ("critical" as const) : ("warning" as const),
      stepIndex: event.tick ?? index,
      relatedObjectIds: event.relatedObjectIds ?? [],
    }));
}

function buildForecasts(input: BuildExecutiveAdvisorInput) {
  const twin = input.cognitiveTwin;
  if (!twin?.active) return [];
  return [
    {
      id: "forecast_near",
      title: "Near-term operational posture",
      summary:
        twin.riskEvolution === "growing"
          ? "Risk likely to intensify without intervention within the next decision cycle."
          : "Operational posture likely to remain within current tolerance bands.",
      horizon: "near" as const,
      confidence: clamp01(twin.scores.enterpriseStabilityScore),
    },
    {
      id: "forecast_mid",
      title: "Mid-term strategic alignment",
      summary: twin.awareness.strategic,
      horizon: "mid" as const,
      confidence: clamp01(twin.scores.enterpriseReadinessScore),
    },
  ];
}

function buildBrief(
  input: BuildExecutiveAdvisorInput,
  observations: ReturnType<typeof detectAdvisorObservations>,
  recommendations: ExecutiveAdvisorRecommendation[]
): ExecutiveAdvisorStrategicBrief {
  const top = observations[0];
  const topRec = recommendations[0];
  return {
    headline: top?.title ?? "Executive advisor is monitoring the operational universe.",
    summary: top?.summary ?? input.cognitiveTwin?.awareness.situation ?? "No urgent strategic deviation detected.",
    proactiveInsight: top
      ? top.kind === "opportunity"
        ? `I found a better alternative: ${top.title}.`
        : top.kind === "risk"
          ? `I detected a growing operational risk: ${top.title}.`
          : top.kind === "misalignment"
            ? `This strategy may conflict with your stated objective: ${top.summary}`
            : top.summary
      : null,
    missionGuidance: topRec?.action ?? input.warRoom?.strategic.recommendedAction ?? "Continue monitoring and prepare decision review.",
  };
}

function buildHud(
  brief: ExecutiveAdvisorStrategicBrief,
  observations: ReturnType<typeof detectAdvisorObservations>,
  questions: ReturnType<typeof generateStrategicQuestions>,
  recommendations: ExecutiveAdvisorRecommendation[],
  scenarioEvaluations: ExecutiveAdvisorScenarioEvaluation[],
  overallConfidence: number
): ExecutiveAdvisorHudModel {
  return {
    brief,
    topObservation: observations[0] ?? null,
    topQuestion: questions[0] ?? null,
    topRecommendation: recommendations[0] ?? null,
    feed: observations.slice(0, 6),
    recommendations: recommendations.slice(0, 4),
    questions: questions.slice(0, 3),
    scenarioWarnings: scenarioEvaluations.filter((entry) => entry.warningLevel !== "none").slice(0, 3),
    transparencyHeadline: "Recommendations include evidence-backed reasoning with calibrated confidence.",
    calibratedConfidence: overallConfidence,
  };
}

function buildCopilot(
  input: BuildExecutiveAdvisorInput,
  brief: ExecutiveAdvisorStrategicBrief,
  observations: ReturnType<typeof detectAdvisorObservations>,
  recommendations: ExecutiveAdvisorRecommendation[],
  scenarioEvaluations: ExecutiveAdvisorScenarioEvaluation[]
): ExecutiveAdvisorCopilotContext {
  const top = observations[0];
  return {
    dialogueContext: `Executive focus: ${input.warRoom?.mission.focusMode ?? "operations"} · ${input.domainLabel ?? "Enterprise"}.`,
    situationExplanation: brief.summary,
    consequenceExplanation: top
      ? `If unaddressed, ${top.title.toLowerCase()} may alter readiness and stability across the twin.`
      : "Current posture appears stable under observed signals.",
    simulationInterpretation: input.activeSimulation
      ? `${input.activeSimulation.summary} Risk level: ${input.activeSimulation.riskLevel}.`
      : null,
    twinInterpretation: input.cognitiveTwin?.copilot.explanation ?? null,
  };
}

function buildSignature(input: BuildExecutiveAdvisorInput): string {
  return [
    input.cognitiveTwin?.signature ?? "none",
    input.warRoom?.signature ?? "none",
    input.activeSimulation?.scenarioId ?? "none",
    input.scenarioComparison?.id ?? "none",
    input.decisionRecommendation?.recommendedScenarioId ?? "none",
    input.selectedObjectId ?? "none",
    (input.alerts ?? []).map((alert) => `${alert.id}:${alert.acknowledged}`).join("|") || "none",
  ].join("::");
}

export function buildExecutiveAdvisorState(input: BuildExecutiveAdvisorInput): ExecutiveAdvisorState {
  const evidence = buildAdvisorEvidence(input);
  const observations = detectAdvisorObservations(input);
  const questions = generateStrategicQuestions(observations, input);
  const recommendations = buildRecommendations(input, observations, evidence);
  const reasoningChains = buildReasoningChains(observations, recommendations, evidence);
  const scenarioEvaluations = buildScenarioEvaluations(input);
  const tradeOffs = detectTradeOffs(input);
  const timelineWarnings = buildTimelineWarnings(input);
  const forecasts = buildForecasts(input);
  const preferenceSignals = derivePreferenceSignals(input);
  const overallConfidence = clamp01(
    reasoningChains[0]?.overallConfidence ??
      recommendations[0]?.confidence ??
      input.pipelineConfidence ??
      0.55
  );
  const confidenceCeiling = clamp01(Math.min(0.92, overallConfidence + 0.08));
  const brief = buildBrief(input, observations, recommendations);
  const hud = buildHud(brief, observations, questions, recommendations, scenarioEvaluations, overallConfidence);
  const copilot = buildCopilot(input, brief, observations, recommendations, scenarioEvaluations);
  const signature = buildSignature(input);

  const state: ExecutiveAdvisorState = {
    signature,
    active: Boolean(input.cognitiveTwin?.active || input.warRoom?.active),
    observations,
    questions,
    recommendations,
    evidence,
    reasoningChains,
    scenarioEvaluations,
    tradeOffs,
    timelineWarnings,
    forecasts,
    preferenceSignals,
    hud,
    copilot,
    explainability: {
      headline: "Every recommendation is backed by observable twin, war room, and simulation evidence.",
      evidenceCount: evidence.length,
      reasoningStepCount: reasoningChains.reduce((sum, chain) => sum + chain.steps.length, 0),
      confidenceCeiling,
    },
  };

  logE299AdvisorInitialized(signature, {
    observationCount: observations.length,
    recommendationCount: recommendations.length,
    questionCount: questions.length,
  });
  if (observations.some((entry) => entry.kind === "opportunity")) {
    logE299OpportunityDetected(`${signature}:opp`, {
      count: observations.filter((entry) => entry.kind === "opportunity").length,
    });
  }
  if (observations.some((entry) => entry.kind === "risk")) {
    logE299RiskDetected(`${signature}:risk`, {
      count: observations.filter((entry) => entry.kind === "risk").length,
    });
  }
  if (recommendations.length > 0) {
    logE299RecommendationGenerated(`${signature}:rec`, {
      topRecommendation: recommendations[0]?.title ?? null,
    });
  }
  if (questions.length > 0) {
    logE299StrategicQuestionGenerated(`${signature}:q`, {
      topQuestion: questions[0]?.question ?? null,
    });
  }

  return state;
}

export function resolveExecutiveAdvisorCopilotPrompt(state: ExecutiveAdvisorState | null): string | null {
  if (!state?.active) return null;
  return [
    state.copilot.dialogueContext,
    state.copilot.situationExplanation,
    state.hud.brief.proactiveInsight,
    state.copilot.consequenceExplanation,
    state.copilot.simulationInterpretation,
    state.copilot.twinInterpretation,
    state.hud.topRecommendation ? `Recommended action: ${state.hud.topRecommendation.action}` : null,
  ]
    .filter(Boolean)
    .join(" ");
}

export function resolveAdvisorProactivePrompt(state: ExecutiveAdvisorState | null): string | null {
  return state?.hud.brief.proactiveInsight ?? state?.hud.brief.headline ?? null;
}
