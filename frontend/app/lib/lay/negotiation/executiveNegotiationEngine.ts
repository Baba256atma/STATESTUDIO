export type {
  ExecutiveConcessionCandidate,
  ExecutiveConflictZone,
  ExecutiveInterestAnalysis,
  ExecutiveLeveragePoint,
  ExecutiveNegotiationContext,
  ExecutiveNegotiationExplanation,
  ExecutiveNegotiationInput,
  ExecutiveNegotiationPath,
  ExecutiveNegotiationResult,
  ExecutiveNegotiationSession,
  ExecutiveNegotiationValidationIssue,
  ExecutiveNegotiationValidationResult,
  ExecutiveStakeholderPosition,
} from "./executiveNegotiationTypes.ts";
export { EXECUTIVE_NEGOTIATION_CAPABILITY_REGISTRY, listExecutiveNegotiationCapabilities } from "./executiveNegotiationRegistry.ts";
export { EXECUTIVE_NEGOTIATION_CONTRACTS } from "./executiveNegotiationContracts.ts";
export { normalizeExecutiveNegotiationContext } from "./executiveNegotiationContext.ts";
export { mapExecutiveStakeholderPositions } from "./executiveStakeholderPositionMapper.ts";
export { analyzeExecutiveInterests } from "./executiveInterestAnalyzer.ts";
export { analyzeExecutiveLeverage } from "./executiveLeverageAnalyzer.ts";
export { mapExecutiveConcessions } from "./executiveConcessionMapper.ts";
export { detectExecutiveConflictZones } from "./executiveConflictZoneDetector.ts";
export { buildExecutiveNegotiationPaths } from "./executiveNegotiationPathBuilder.ts";
export { buildExecutiveNegotiationExplanation } from "./executiveNegotiationExplanation.ts";
export { validateExecutiveNegotiation } from "./executiveNegotiationValidation.ts";

import { mapExecutiveConcessions } from "./executiveConcessionMapper.ts";
import { detectExecutiveConflictZones } from "./executiveConflictZoneDetector.ts";
import { analyzeExecutiveInterests } from "./executiveInterestAnalyzer.ts";
import { analyzeExecutiveLeverage } from "./executiveLeverageAnalyzer.ts";
import { normalizeExecutiveNegotiationContext } from "./executiveNegotiationContext.ts";
import { buildExecutiveNegotiationExplanation } from "./executiveNegotiationExplanation.ts";
import { buildExecutiveNegotiationPaths } from "./executiveNegotiationPathBuilder.ts";
import { validateExecutiveNegotiation } from "./executiveNegotiationValidation.ts";
import { mapExecutiveStakeholderPositions } from "./executiveStakeholderPositionMapper.ts";
import type { ExecutiveNegotiationInput, ExecutiveNegotiationResult } from "./executiveNegotiationTypes.ts";

export function buildExecutiveNegotiation(input: ExecutiveNegotiationInput): ExecutiveNegotiationResult {
  const context = normalizeExecutiveNegotiationContext(input);
  const stakeholderPositions = mapExecutiveStakeholderPositions(input, context);
  const interests = analyzeExecutiveInterests(stakeholderPositions);
  const leveragePoints = analyzeExecutiveLeverage(input, context);
  const concessionCandidates = mapExecutiveConcessions(leveragePoints, context);
  const conflictZones = detectExecutiveConflictZones(stakeholderPositions);
  const negotiationPaths = buildExecutiveNegotiationPaths(leveragePoints, concessionCandidates, conflictZones);
  const explanation = buildExecutiveNegotiationExplanation(context.session, stakeholderPositions, interests, leveragePoints, concessionCandidates, conflictZones, negotiationPaths);
  const withoutValidation = Object.freeze({
    session: context.session,
    input,
    context,
    stakeholderPositions,
    interests,
    leveragePoints,
    concessionCandidates,
    conflictZones,
    negotiationPaths,
    explanation,
    validation: Object.freeze({ valid: true, issues: Object.freeze([]) }),
  });
  const validation = validateExecutiveNegotiation(withoutValidation);

  return Object.freeze({ ...withoutValidation, validation });
}

export const ExecutiveNegotiationEngine = Object.freeze({
  buildExecutiveNegotiation,
  mapExecutiveStakeholderPositions,
  analyzeExecutiveInterests,
  analyzeExecutiveLeverage,
  mapExecutiveConcessions,
  detectExecutiveConflictZones,
  buildExecutiveNegotiationPaths,
  buildExecutiveNegotiationExplanation,
  validateExecutiveNegotiation,
});
