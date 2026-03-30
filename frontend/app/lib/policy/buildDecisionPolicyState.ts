import { buildDecisionConfidenceModel } from "../decision/confidence/buildDecisionConfidenceModel";
import { buildDecisionConfidenceCalibration } from "../decision/confidence/calibration/buildDecisionConfidenceCalibration";
import { buildDecisionOutcomeAssessment } from "../decision/confidence/calibration/buildDecisionOutcomeAssessment";
import { buildMetaDecisionState } from "../decision/meta/buildMetaDecisionState";
import { buildStrategicLearningState } from "../decision/learning/buildStrategicLearningState";
import { buildTeamDecisionState } from "../team/buildTeamDecisionState";
import { buildOrgMemoryState } from "../org-memory/buildOrgMemoryState";
import { buildDecisionPolicyContext } from "./buildDecisionPolicyContext";
import { buildDecisionPolicyExplanation } from "./buildDecisionPolicyExplanation";
import { buildDecisionPolicyNextSteps } from "./buildDecisionPolicyNextSteps";
import { buildDecisionPolicyRules } from "./buildDecisionPolicyRules";
import type { DecisionPolicyState } from "./decisionPolicyTypes";
import { evaluateDecisionPolicies } from "./evaluateDecisionPolicies";

type BuildDecisionPolicyStateInput = {
  canonicalRecommendation?: any | null;
  decisionExecutionIntent?: any | null;
  decisionResult?: any | null;
  responseData?: any | null;
  memoryEntries?: any[];
};

export function buildDecisionPolicyState(
  input: BuildDecisionPolicyStateInput
): DecisionPolicyState {
  const confidenceModel = buildDecisionConfidenceModel({
    canonicalRecommendation: input.canonicalRecommendation ?? null,
    responseData: input.responseData ?? null,
    decisionResult: input.decisionResult ?? null,
  });
  const calibration = buildDecisionConfidenceCalibration({
    canonicalRecommendation: input.canonicalRecommendation ?? null,
    confidenceModel,
    outcomeAssessment: buildDecisionOutcomeAssessment({
      canonicalRecommendation: input.canonicalRecommendation ?? null,
      responseData: input.responseData ?? null,
      decisionResult: input.decisionResult ?? null,
      memoryEntries: input.memoryEntries ?? [],
    }),
    memoryEntries: input.memoryEntries ?? [],
  });
  const metaDecision = buildMetaDecisionState({
    reasoning: input.responseData?.ai_reasoning ?? null,
    simulation: input.responseData?.decision_simulation ?? null,
    comparison: input.responseData?.decision_comparison ?? input.responseData?.comparison ?? null,
    canonicalRecommendation: input.canonicalRecommendation ?? null,
    calibration,
    responseData: input.responseData ?? null,
    memoryEntries: input.memoryEntries ?? [],
  });
  const teamDecision = buildTeamDecisionState({
    responseData: input.responseData ?? null,
    canonicalRecommendation: input.canonicalRecommendation ?? null,
    decisionResult: input.decisionResult ?? null,
    memoryEntries: input.memoryEntries ?? [],
  });
  const orgMemory = buildOrgMemoryState({
    memoryEntries: input.memoryEntries ?? [],
    canonicalRecommendation: input.canonicalRecommendation ?? null,
  });
  const strategicLearning = buildStrategicLearningState({
    memoryEntries: input.memoryEntries ?? [],
    canonicalRecommendation: input.canonicalRecommendation ?? null,
  });

  const context = buildDecisionPolicyContext({
    canonicalRecommendation: input.canonicalRecommendation ?? null,
    decisionExecutionIntent: input.decisionExecutionIntent ?? null,
    confidenceModel,
    calibration,
    metaDecision,
    teamDecision,
    orgMemory,
    strategicLearning,
    responseData: input.responseData ?? null,
  });
  const rules = buildDecisionPolicyRules();
  const evaluation = evaluateDecisionPolicies({ context, rules });
  return {
    decision_id: context.decision_id,
    posture: evaluation.posture,
    active_rules: evaluation.active_rules,
    evaluations: evaluation.evaluations,
    constraints: evaluation.constraints,
    policy_drivers: evaluation.policy_drivers,
    explanation: buildDecisionPolicyExplanation({
      posture: evaluation.posture,
      context,
      drivers: evaluation.policy_drivers,
    }),
    next_steps: buildDecisionPolicyNextSteps(evaluation.posture),
  };
}
