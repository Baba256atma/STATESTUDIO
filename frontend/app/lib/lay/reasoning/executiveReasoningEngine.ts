export type {
  ExecutiveAlternative,
  ExecutiveAssumption,
  ExecutiveConstraint,
  ExecutiveDependency,
  ExecutiveExplanation,
  ExecutiveReasoningChain,
  ExecutiveReasoningInput,
  ExecutiveReasoningNode,
  ExecutiveReasoningObject,
  ExecutiveReasoningRelationship,
  ExecutiveReasoningResult,
  ExecutiveReasoningSession,
  ExecutiveReasoningValidationIssue,
  ExecutiveReasoningValidationResult,
  ExecutiveTradeoff,
} from "./executiveReasoningTypes.ts";
export { EXECUTIVE_REASONING_CAPABILITY_REGISTRY, listExecutiveReasoningCapabilities } from "./executiveReasoningRegistry.ts";
export { EXECUTIVE_REASONING_CONTRACTS } from "./executiveReasoningContracts.ts";
export { normalizeExecutiveReasoningContext } from "./executiveReasoningContext.ts";
export { analyzeExecutiveReasoningComponents } from "./executiveReasoningAnalyzer.ts";
export { buildExecutiveReasoningChain } from "./executiveReasoningChains.ts";
export { buildExecutiveReasoningExplanation } from "./executiveReasoningExplanation.ts";
export { validateExecutiveReasoning } from "./executiveReasoningValidation.ts";

import { analyzeExecutiveReasoningComponents } from "./executiveReasoningAnalyzer.ts";
import { buildExecutiveReasoningChain } from "./executiveReasoningChains.ts";
import { normalizeExecutiveReasoningContext } from "./executiveReasoningContext.ts";
import { buildExecutiveReasoningExplanation } from "./executiveReasoningExplanation.ts";
import { validateExecutiveReasoning } from "./executiveReasoningValidation.ts";
import type { ExecutiveReasoningInput, ExecutiveReasoningResult } from "./executiveReasoningTypes.ts";

export function analyzeExecutiveReasoning(input: ExecutiveReasoningInput): ExecutiveReasoningResult {
  const session = normalizeExecutiveReasoningContext(input);
  const components = analyzeExecutiveReasoningComponents(session);
  const chain = buildExecutiveReasoningChain(session, components);
  const explanation = buildExecutiveReasoningExplanation(session, chain);
  const withoutValidation = Object.freeze({
    session,
    components,
    chain,
    explanation,
    validation: Object.freeze({ valid: true, issues: Object.freeze([]) }),
  });
  const validation = validateExecutiveReasoning(withoutValidation);

  return Object.freeze({
    session,
    components,
    chain,
    explanation,
    validation,
  });
}

export const ExecutiveReasoningEngine = Object.freeze({
  analyzeExecutiveReasoning,
  buildExecutiveReasoningChain,
  buildExecutiveReasoningExplanation,
  validateExecutiveReasoning,
});
