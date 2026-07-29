import { buildDecisionConfidenceModel } from "../decision/confidence/buildDecisionConfidenceModel";
import { buildComparePanelModel } from "../decision/recommendation/buildComparePanelModel";
import { buildDecisionPatternIntelligence } from "../decision/patterns/buildDecisionPatternIntelligence";
import { buildStrategicLearningState } from "../decision/learning/buildStrategicLearningState";
import { buildMetaDecisionState } from "../decision/meta/buildMetaDecisionState";
import { buildRolePerspective } from "./buildRolePerspective";
import { buildTeamDecisionAlignment } from "./buildTeamDecisionAlignment";
import { buildTeamDecisionNextMove } from "./buildTeamDecisionNextMove";
import type { TeamDecisionRole, TeamDecisionState } from "./teamDecisionTypes";

import type { DecisionMemoryEntry } from "../decision/memory/decisionMemoryTypes";
import type { CanonicalRecommendation } from "../decision/recommendation/recommendationTypes";
import type { DecisionExecutionResult } from "../executive/decisionExecutionTypes";

type BuildTeamDecisionStateInput = {
  responseData?: Record<string, unknown> | null;
  canonicalRecommendation?: CanonicalRecommendation | null;
  decisionResult?: DecisionExecutionResult | Record<string, unknown> | null;
  memoryEntries?: DecisionMemoryEntry[];
};

const ROLES: TeamDecisionRole[] = ["executive", "analyst", "operator", "investor"];

function text(value: unknown, fallback = "") {
  const normalized = String(value ?? "").replace(/\s+/g, " ").trim();
  return normalized || fallback;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

export function buildTeamDecisionState(input: BuildTeamDecisionStateInput): TeamDecisionState {
  const responseData = asRecord(input.responseData);
  const executiveSummary = asRecord(responseData?.executive_summary_surface);
  const confidenceModel = buildDecisionConfidenceModel({
    canonicalRecommendation: input.canonicalRecommendation ?? null,
    responseData,
      decisionResult: input.decisionResult ?? null,
  });
  let compareModel: ReturnType<typeof buildComparePanelModel> | null = null;
  try {
    compareModel = buildComparePanelModel({
      canonicalRecommendation: input.canonicalRecommendation ?? null,
      decisionResult: (input.decisionResult as DecisionExecutionResult | null) ?? null,
      strategicAdvice: asRecord(responseData?.strategic_advice),
      responseData,
    });
  } catch (error) {
    compareModel = null;
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Nexora] buildComparePanelModel failed in buildTeamDecisionState", error);
    }
  }
  const patternIntelligence = buildDecisionPatternIntelligence({
    memoryEntries: input.memoryEntries ?? [],
    canonicalRecommendation: input.canonicalRecommendation ?? null,
  });
  const strategicLearning = buildStrategicLearningState({
    memoryEntries: input.memoryEntries ?? [],
    canonicalRecommendation: input.canonicalRecommendation ?? null,
  });
  const metaDecision = buildMetaDecisionState({
    reasoning: asRecord(responseData?.ai_reasoning),
    simulation: asRecord(responseData?.decision_simulation),
    comparison: asRecord(responseData?.decision_comparison) ?? asRecord(responseData?.comparison),
    canonicalRecommendation: input.canonicalRecommendation ?? null,
    calibration: null,
    responseData,
    memoryEntries: input.memoryEntries ?? [],
  });

  const rolePerspectives = ROLES.map((role) =>
    buildRolePerspective({
      role,
      canonicalRecommendation: input.canonicalRecommendation ?? null,
      executiveSummary,
      confidenceModel,
      compareModel,
      simulation: asRecord(responseData?.decision_simulation),
      patternIntelligence,
      strategicLearning,
      metaDecision,
    })
  );
  const alignment = buildTeamDecisionAlignment({
    perspectives: rolePerspectives,
    confidenceModel,
    metaDecision,
  });

  return {
    decision_id: text(input.canonicalRecommendation?.id, `team_decision_${Date.now().toString(36)}`),
    generated_at: Date.now(),
    shared_recommendation: text(
      input.canonicalRecommendation?.primary?.action,
      typeof executiveSummary?.what_to_do === "string"
        ? executiveSummary.what_to_do
        : "No shared recommendation is available yet."
    ),
    shared_summary: text(
      input.canonicalRecommendation?.reasoning?.why,
      typeof executiveSummary?.why_it_matters === "string"
        ? executiveSummary.why_it_matters
        : typeof responseData?.analysis_summary === "string"
          ? responseData.analysis_summary
          : "The team needs stronger decision context before a fuller review is possible."
    ),
    role_perspectives: rolePerspectives,
    alignment,
    team_next_move: buildTeamDecisionNextMove({
      alignment,
      perspectives: rolePerspectives,
      metaDecision,
      compareModel,
      confidenceModel,
    }),
    escalation_needed:
      alignment.alignment_level === "low" ||
      metaDecision.action_posture === "recommend_more_evidence" ||
      confidenceModel.level === "low",
  };
}
