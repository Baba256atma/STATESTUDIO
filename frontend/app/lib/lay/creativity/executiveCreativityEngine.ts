export type {
  ExecutiveConstraintReframe,
  ExecutiveCreativeAlternative,
  ExecutiveCreativityContext,
  ExecutiveCreativityExplanation,
  ExecutiveCreativityInput,
  ExecutiveCreativityResult,
  ExecutiveCreativitySession,
  ExecutiveCreativityValidationIssue,
  ExecutiveCreativityValidationResult,
  ExecutiveInnovationPath,
  ExecutiveOpportunityIdea,
  ExecutiveReframe,
  ExecutiveStrategicAngle,
} from "./executiveCreativityTypes.ts";
export { EXECUTIVE_CREATIVITY_CAPABILITY_REGISTRY, listExecutiveCreativityCapabilities } from "./executiveCreativityRegistry.ts";
export { EXECUTIVE_CREATIVITY_CONTRACTS } from "./executiveCreativityContracts.ts";
export { normalizeExecutiveCreativityContext } from "./executiveCreativityContext.ts";
export { buildExecutiveReframes } from "./executiveReframeBuilder.ts";
export { generateExecutiveAlternatives } from "./executiveAlternativeGenerator.ts";
export { discoverExecutiveOpportunities } from "./executiveOpportunityDiscoverer.ts";
export { reframeExecutiveConstraints } from "./executiveConstraintReframer.ts";
export { buildExecutiveStrategicAngles } from "./executiveStrategicAngleBuilder.ts";
export { buildExecutiveInnovationPaths } from "./executiveInnovationPathBuilder.ts";
export { buildExecutiveCreativityExplanation } from "./executiveCreativityExplanation.ts";
export { validateExecutiveCreativity } from "./executiveCreativityValidation.ts";

import { generateExecutiveAlternatives } from "./executiveAlternativeGenerator.ts";
import { buildExecutiveCreativityExplanation } from "./executiveCreativityExplanation.ts";
import { normalizeExecutiveCreativityContext } from "./executiveCreativityContext.ts";
import { validateExecutiveCreativity } from "./executiveCreativityValidation.ts";
import { reframeExecutiveConstraints } from "./executiveConstraintReframer.ts";
import { buildExecutiveInnovationPaths } from "./executiveInnovationPathBuilder.ts";
import { discoverExecutiveOpportunities } from "./executiveOpportunityDiscoverer.ts";
import { buildExecutiveReframes } from "./executiveReframeBuilder.ts";
import { buildExecutiveStrategicAngles } from "./executiveStrategicAngleBuilder.ts";
import type { ExecutiveCreativityInput, ExecutiveCreativityResult } from "./executiveCreativityTypes.ts";

export function buildExecutiveCreativity(input: ExecutiveCreativityInput): ExecutiveCreativityResult {
  const context = normalizeExecutiveCreativityContext(input);
  const reframes = buildExecutiveReframes(context);
  const alternatives = generateExecutiveAlternatives(reframes);
  const opportunities = discoverExecutiveOpportunities(context);
  const constraintReframes = reframeExecutiveConstraints(context);
  const strategicAngles = buildExecutiveStrategicAngles(alternatives, opportunities);
  const innovationPaths = buildExecutiveInnovationPaths(reframes, alternatives, opportunities, constraintReframes);
  const explanation = buildExecutiveCreativityExplanation(context.session, reframes, alternatives, opportunities, constraintReframes, strategicAngles, innovationPaths);
  const withoutValidation = Object.freeze({
    session: context.session,
    input,
    context,
    reframes,
    alternatives,
    opportunities,
    constraintReframes,
    strategicAngles,
    innovationPaths,
    explanation,
    validation: Object.freeze({ valid: true, issues: Object.freeze([]) }),
  });
  const validation = validateExecutiveCreativity(withoutValidation);

  return Object.freeze({ ...withoutValidation, validation });
}

export const ExecutiveCreativityEngine = Object.freeze({
  buildExecutiveCreativity,
  buildExecutiveReframes,
  generateExecutiveAlternatives,
  discoverExecutiveOpportunities,
  reframeExecutiveConstraints,
  buildExecutiveStrategicAngles,
  buildExecutiveInnovationPaths,
  buildExecutiveCreativityExplanation,
  validateExecutiveCreativity,
});
