export type {
  ExecutiveAlternativeEvaluation,
  ExecutiveConfidence,
  ExecutiveJudgmentCore,
  ExecutiveJudgmentInput,
  ExecutiveJudgmentResult,
  ExecutiveJudgmentSession,
  ExecutiveJudgmentValidationIssue,
  ExecutiveJudgmentValidationResult,
  ExecutivePriority,
  ExecutiveRationale,
} from "./executiveJudgmentTypes.ts";
export { EXECUTIVE_JUDGMENT_CAPABILITY_REGISTRY, listExecutiveJudgmentCapabilities } from "./executiveJudgmentRegistry.ts";
export { EXECUTIVE_JUDGMENT_CONTRACTS } from "./executiveJudgmentContracts.ts";
export { evaluateExecutiveJudgment } from "./executiveJudgmentEvaluator.ts";
export { evaluateExecutivePriorities } from "./executivePriorityEvaluator.ts";
export { buildExecutiveConfidence } from "./executiveConfidenceBuilder.ts";
export { buildExecutiveRationale } from "./executiveRationaleBuilder.ts";
export { validateExecutiveJudgment } from "./executiveJudgmentValidation.ts";

import { evaluateExecutiveJudgment } from "./executiveJudgmentEvaluator.ts";
import { evaluateExecutivePriorities } from "./executivePriorityEvaluator.ts";
import { buildExecutiveRationale } from "./executiveRationaleBuilder.ts";
import { validateExecutiveJudgment } from "./executiveJudgmentValidation.ts";
import type { ExecutiveJudgmentInput, ExecutiveJudgmentResult } from "./executiveJudgmentTypes.ts";

export function analyzeExecutiveJudgment(input: ExecutiveJudgmentInput): ExecutiveJudgmentResult {
  const session = Object.freeze({
    sessionId: input.sessionId.trim(),
    phase: "LAY-3" as const,
    reasoningSessionId: input.reasoning.session.sessionId,
  });
  const judgment = evaluateExecutiveJudgment(input.reasoning);
  const rationale = buildExecutiveRationale(session.sessionId, input.reasoning, judgment);
  const withoutValidation = Object.freeze({
    session,
    input,
    judgment,
    rationale,
    validation: Object.freeze({ valid: true, issues: Object.freeze([]) }),
  });
  const validation = validateExecutiveJudgment(withoutValidation);

  return Object.freeze({
    session,
    input,
    judgment,
    rationale,
    validation,
  });
}

export const ExecutiveJudgmentEngine = Object.freeze({
  analyzeExecutiveJudgment,
  evaluateExecutivePriorities,
  buildExecutiveRationale,
  validateExecutiveJudgment,
});
