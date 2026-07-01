export type {
  ExecutiveAudienceFrame,
  ExecutiveBriefing,
  ExecutiveCommunicationAudience,
  ExecutiveCommunicationContext,
  ExecutiveCommunicationInput,
  ExecutiveCommunicationResult,
  ExecutiveCommunicationSession,
  ExecutiveCommunicationValidationIssue,
  ExecutiveCommunicationValidationResult,
  ExecutivePlanCommunication,
  ExecutiveRiskCommunication,
  ExecutiveSummary,
} from "./executiveCommunicationTypes.ts";
export { EXECUTIVE_COMMUNICATION_CAPABILITY_REGISTRY, listExecutiveCommunicationCapabilities } from "./executiveCommunicationRegistry.ts";
export { EXECUTIVE_COMMUNICATION_CONTRACTS } from "./executiveCommunicationContracts.ts";
export { EXECUTIVE_COMMUNICATION_AUDIENCES, normalizeExecutiveCommunicationContext } from "./executiveCommunicationContext.ts";
export { buildExecutiveAudienceFrame } from "./executiveAudienceFramer.ts";
export { buildExecutiveBriefing } from "./executiveBriefingBuilder.ts";
export { buildExecutiveSummary } from "./executiveSummaryBuilder.ts";
export { buildExecutiveRiskCommunication } from "./executiveRiskCommunicator.ts";
export { buildExecutivePlanCommunication } from "./executivePlanCommunicator.ts";
export { validateExecutiveCommunication } from "./executiveCommunicationValidation.ts";

import { buildExecutiveAudienceFrame } from "./executiveAudienceFramer.ts";
import { buildExecutiveBriefing } from "./executiveBriefingBuilder.ts";
import { normalizeExecutiveCommunicationContext } from "./executiveCommunicationContext.ts";
import { validateExecutiveCommunication } from "./executiveCommunicationValidation.ts";
import { buildExecutivePlanCommunication } from "./executivePlanCommunicator.ts";
import { buildExecutiveRiskCommunication } from "./executiveRiskCommunicator.ts";
import { buildExecutiveSummary } from "./executiveSummaryBuilder.ts";
import type { ExecutiveCommunicationInput, ExecutiveCommunicationResult } from "./executiveCommunicationTypes.ts";

export function buildExecutiveCommunication(input: ExecutiveCommunicationInput): ExecutiveCommunicationResult {
  const context = normalizeExecutiveCommunicationContext(input);
  const audienceFrames = buildExecutiveAudienceFrame(context);
  const briefing = buildExecutiveBriefing(input, context);
  const summary = buildExecutiveSummary(input, context);
  const riskCommunication = buildExecutiveRiskCommunication(input, context);
  const planCommunication = buildExecutivePlanCommunication(input, context);
  const withoutValidation = Object.freeze({
    session: context.session,
    input,
    context,
    audienceFrames,
    briefing,
    summary,
    riskCommunication,
    planCommunication,
    validation: Object.freeze({ valid: true, issues: Object.freeze([]) }),
  });
  const validation = validateExecutiveCommunication(withoutValidation);

  return Object.freeze({
    session: context.session,
    input,
    context,
    audienceFrames,
    briefing,
    summary,
    riskCommunication,
    planCommunication,
    validation,
  });
}

export const ExecutiveCommunicationEngine = Object.freeze({
  buildExecutiveCommunication,
  buildExecutiveBriefing,
  buildExecutiveSummary,
  buildExecutiveAudienceFrame,
  buildExecutiveRiskCommunication,
  buildExecutivePlanCommunication,
  validateExecutiveCommunication,
});
