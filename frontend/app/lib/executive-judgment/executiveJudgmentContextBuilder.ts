import { normalizeExecutiveJudgmentContext, type ExecutiveJudgmentContextInput, type NormalizedExecutiveJudgmentContext } from "./executiveJudgmentContextNormalizer.ts";
import { validateExecutiveJudgmentContext } from "./executiveJudgmentContextValidation.ts";

export type ExecutiveJudgmentContextBuildResult = Readonly<{
  context: NormalizedExecutiveJudgmentContext;
  valid: boolean;
  metadataOnly: true;
}>;

export function createExecutiveJudgmentContext(input: ExecutiveJudgmentContextInput = Object.freeze({})): NormalizedExecutiveJudgmentContext {
  return normalizeExecutiveJudgmentContext(input);
}

export function createExecutiveJudgmentContextBuildResult(input: ExecutiveJudgmentContextInput = Object.freeze({})): ExecutiveJudgmentContextBuildResult {
  const context = createExecutiveJudgmentContext(input);
  const validation = validateExecutiveJudgmentContext(context);
  return Object.freeze({ context, valid: validation.valid, metadataOnly: true });
}
