export type {
  ExecutiveAlternativeViewpoint,
  ExecutiveCounterpoint,
  ExecutiveDebatePath,
  ExecutivePerspectiveFrame,
  ExecutiveStrategicReflection,
  ExecutiveTensionMap,
  ExecutiveThoughtPartnerContext,
  ExecutiveThoughtPartnerExplanation,
  ExecutiveThoughtPartnerInput,
  ExecutiveThoughtPartnerResult,
  ExecutiveThoughtPartnerSession,
  ExecutiveThoughtPartnerValidationIssue,
  ExecutiveThoughtPartnerValidationResult,
} from "./executiveThoughtPartnerTypes.ts";
export { EXECUTIVE_THOUGHT_PARTNER_CAPABILITY_REGISTRY, listExecutiveThoughtPartnerCapabilities } from "./executiveThoughtPartnerRegistry.ts";
export { EXECUTIVE_THOUGHT_PARTNER_CONTRACTS } from "./executiveThoughtPartnerContracts.ts";
export { normalizeExecutiveThoughtPartnerContext } from "./executiveThoughtPartnerContext.ts";
export { buildExecutivePerspectiveFrames } from "./executivePerspectiveFramer.ts";
export { buildExecutiveCounterpoints } from "./executiveCounterpointBuilder.ts";
export { buildExecutiveAlternativeViewpoints } from "./executiveAlternativeViewpointBuilder.ts";
export { buildExecutiveStrategicReflections, buildExecutiveDebatePaths } from "./executiveReflectionPathBuilder.ts";
export { buildExecutiveTensionMap } from "./executiveTensionMapper.ts";
export { buildExecutiveThoughtPartnerExplanation } from "./executiveThoughtPartnerExplanation.ts";
export { validateExecutiveThoughtPartner } from "./executiveThoughtPartnerValidation.ts";

import { buildExecutiveAlternativeViewpoints } from "./executiveAlternativeViewpointBuilder.ts";
import { buildExecutiveCounterpoints } from "./executiveCounterpointBuilder.ts";
import { buildExecutivePerspectiveFrames } from "./executivePerspectiveFramer.ts";
import { buildExecutiveDebatePaths, buildExecutiveStrategicReflections } from "./executiveReflectionPathBuilder.ts";
import { buildExecutiveTensionMap } from "./executiveTensionMapper.ts";
import { normalizeExecutiveThoughtPartnerContext } from "./executiveThoughtPartnerContext.ts";
import { buildExecutiveThoughtPartnerExplanation } from "./executiveThoughtPartnerExplanation.ts";
import { validateExecutiveThoughtPartner } from "./executiveThoughtPartnerValidation.ts";
import type { ExecutiveThoughtPartnerInput, ExecutiveThoughtPartnerResult } from "./executiveThoughtPartnerTypes.ts";

export function buildExecutiveThoughtPartner(input: ExecutiveThoughtPartnerInput): ExecutiveThoughtPartnerResult {
  const context = normalizeExecutiveThoughtPartnerContext(input);
  const perspectives = buildExecutivePerspectiveFrames(input, context);
  const counterpoints = buildExecutiveCounterpoints(input, context);
  const alternativeViewpoints = buildExecutiveAlternativeViewpoints(input);
  const strategicReflections = buildExecutiveStrategicReflections(input);
  const debatePaths = buildExecutiveDebatePaths(counterpoints);
  const tensionMap = buildExecutiveTensionMap(input);
  const explanation = buildExecutiveThoughtPartnerExplanation(context.session, perspectives, counterpoints, tensionMap);
  const withoutValidation = Object.freeze({
    session: context.session,
    input,
    context,
    perspectives,
    counterpoints,
    alternativeViewpoints,
    strategicReflections,
    debatePaths,
    tensionMap,
    explanation,
    validation: Object.freeze({ valid: true, issues: Object.freeze([]) }),
  });
  const validation = validateExecutiveThoughtPartner(withoutValidation);

  return Object.freeze({
    session: context.session,
    input,
    context,
    perspectives,
    counterpoints,
    alternativeViewpoints,
    strategicReflections,
    debatePaths,
    tensionMap,
    explanation,
    validation,
  });
}

export const ExecutiveThoughtPartnerEngine = Object.freeze({
  buildExecutiveThoughtPartner,
  buildExecutivePerspectiveFrames,
  buildExecutiveCounterpoints,
  buildExecutiveAlternativeViewpoints,
  buildExecutiveTensionMap,
  buildExecutiveThoughtPartnerExplanation,
  validateExecutiveThoughtPartner,
});
