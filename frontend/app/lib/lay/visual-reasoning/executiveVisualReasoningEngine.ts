export type {
  ExecutiveCauseEffectMap,
  ExecutiveDecisionMap,
  ExecutivePlanMap,
  ExecutiveTradeoffMap,
  ExecutiveVisualEdge,
  ExecutiveVisualExplanation,
  ExecutiveVisualMap,
  ExecutiveVisualNode,
  ExecutiveVisualReasoningContext,
  ExecutiveVisualReasoningInput,
  ExecutiveVisualReasoningResult,
  ExecutiveVisualReasoningSession,
  ExecutiveVisualReasoningValidationIssue,
  ExecutiveVisualReasoningValidationResult,
} from "./executiveVisualReasoningTypes.ts";
export { EXECUTIVE_VISUAL_REASONING_CAPABILITY_REGISTRY, listExecutiveVisualReasoningCapabilities } from "./executiveVisualReasoningRegistry.ts";
export { EXECUTIVE_VISUAL_REASONING_CONTRACTS } from "./executiveVisualReasoningContracts.ts";
export { normalizeExecutiveVisualReasoningContext } from "./executiveVisualReasoningContext.ts";
export { buildExecutiveVisualMap } from "./executiveMapBuilder.ts";
export { buildExecutiveCauseEffectMap } from "./executiveCauseEffectMapBuilder.ts";
export { buildExecutiveDecisionMap } from "./executiveDecisionMapBuilder.ts";
export { buildExecutiveTradeoffMap } from "./executiveTradeoffMapBuilder.ts";
export { buildExecutivePlanMap } from "./executivePlanMapBuilder.ts";
export { buildExecutiveVisualExplanation } from "./executiveVisualExplanation.ts";
export { validateExecutiveVisualReasoning } from "./executiveVisualReasoningValidation.ts";

import { buildExecutiveCauseEffectMap } from "./executiveCauseEffectMapBuilder.ts";
import { buildExecutiveDecisionMap } from "./executiveDecisionMapBuilder.ts";
import { buildExecutiveVisualMap } from "./executiveMapBuilder.ts";
import { buildExecutivePlanMap } from "./executivePlanMapBuilder.ts";
import { buildExecutiveTradeoffMap } from "./executiveTradeoffMapBuilder.ts";
import { buildExecutiveVisualExplanation } from "./executiveVisualExplanation.ts";
import { normalizeExecutiveVisualReasoningContext } from "./executiveVisualReasoningContext.ts";
import { validateExecutiveVisualReasoning } from "./executiveVisualReasoningValidation.ts";
import type { ExecutiveVisualReasoningInput, ExecutiveVisualReasoningResult } from "./executiveVisualReasoningTypes.ts";

export function buildExecutiveVisualReasoning(input: ExecutiveVisualReasoningInput): ExecutiveVisualReasoningResult {
  const context = normalizeExecutiveVisualReasoningContext(input);
  const executiveMap = buildExecutiveVisualMap(input, context);
  const causeEffectMap = buildExecutiveCauseEffectMap(input);
  const decisionMap = buildExecutiveDecisionMap(input);
  const tradeoffMap = buildExecutiveTradeoffMap(input);
  const planMap = buildExecutivePlanMap(input);
  const visualExplanation = buildExecutiveVisualExplanation(context.session, executiveMap, causeEffectMap, decisionMap, tradeoffMap, planMap);
  const withoutValidation = Object.freeze({
    session: context.session,
    input,
    context,
    executiveMap,
    causeEffectMap,
    decisionMap,
    tradeoffMap,
    planMap,
    visualExplanation,
    validation: Object.freeze({ valid: true, issues: Object.freeze([]) }),
  });
  const validation = validateExecutiveVisualReasoning(withoutValidation);

  return Object.freeze({
    session: context.session,
    input,
    context,
    executiveMap,
    causeEffectMap,
    decisionMap,
    tradeoffMap,
    planMap,
    visualExplanation,
    validation,
  });
}

export const ExecutiveVisualReasoningEngine = Object.freeze({
  buildExecutiveVisualReasoning,
  buildExecutiveVisualMap,
  buildExecutiveCauseEffectMap,
  buildExecutiveDecisionMap,
  buildExecutiveTradeoffMap,
  buildExecutivePlanMap,
  buildExecutiveVisualExplanation,
  validateExecutiveVisualReasoning,
});
