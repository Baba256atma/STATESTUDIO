import { buildDecisionConfidenceModel } from "../decision/confidence/buildDecisionConfidenceModel";
import { buildComparePanelModel } from "../decision/recommendation/buildComparePanelModel";
import { buildDecisionPatternIntelligence } from "../decision/patterns/buildDecisionPatternIntelligence";
import { buildStrategicLearningState } from "../decision/learning/buildStrategicLearningState";
import { buildMetaDecisionState } from "../decision/meta/buildMetaDecisionState";
import { buildRolePerspective } from "./buildRolePerspective";
import { buildTeamDecisionAlignment } from "./buildTeamDecisionAlignment";
import { buildTeamDecisionNextMove } from "./buildTeamDecisionNextMove";
import type { TeamDecisionRole, TeamDecisionState } from "./teamDecisionTypes";

type BuildTeamDecisionStateInput = {
  responseData?: any | null;
  canonicalRecommendation?: any | null;
  decisionResult?: any | null;
  memoryEntries?: any[];
};

const ROLES: TeamDecisionRole[] = ["executive", "analyst", "operator", "investor"];

function text(value: unknown, fallback = "") {
  const normalized = String(value ?? "").replace(/\s+/g, " ").trim();
  return normalized || fallback;
}

export function buildTeamDecisionState(input: BuildTeamDecisionStateInput): TeamDecisionState {
  const responseData = input.responseData ?? null;
  const confidenceModel = buildDecisionConfidenceModel({
    canonicalRecommendation: input.canonicalRecommendation ?? null,
    responseData,
    decisionResult: input.decisionResult ?? null,
  });
  let compareModel: ReturnType<typeof buildComparePanelModel> | null = null;
  try {
    compareModel = buildComparePanelModel({
      canonicalRecommendation: input.canonicalRecommendation ?? null,
      decisionResult: input.decisionResult ?? null,
      strategicAdvice: responseData?.strategic_advice ?? null,
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
    reasoning: responseData?.ai_reasoning ?? null,
    simulation: responseData?.decision_simulation ?? null,
    comparison: responseData?.decision_comparison ?? responseData?.comparison ?? null,
    canonicalRecommendation: input.canonicalRecommendation ?? null,
    calibration: null,
    responseData,
    memoryEntries: input.memoryEntries ?? [],
  });

  const rolePerspectives = ROLES.map((role) =>
    buildRolePerspective({
      role,
      canonicalRecommendation: input.canonicalRecommendation ?? null,
      executiveSummary: responseData?.executive_summary_surface ?? null,
      confidenceModel,
      compareModel,
      simulation: responseData?.decision_simulation ?? null,
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
      responseData?.executive_summary_surface?.what_to_do ?? "No shared recommendation is available yet."
    ),
    shared_summary: text(
      input.canonicalRecommendation?.reasoning?.why,
      responseData?.executive_summary_surface?.why_it_matters ??
        responseData?.analysis_summary ??
        "The team needs stronger decision context before a fuller review is possible."
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
