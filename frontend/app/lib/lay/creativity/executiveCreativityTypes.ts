import type { ExecutiveCoachingResult } from "../coaching/executiveCoachingEngine.ts";
import type { ExecutiveCommunicationResult } from "../communication/executiveCommunicationEngine.ts";
import type { ExecutiveJudgmentResult } from "../judgment/executiveJudgmentEngine.ts";
import type { ExecutiveNegotiationResult } from "../negotiation/executiveNegotiationEngine.ts";
import type { ExecutivePlanningResult } from "../planning/executivePlanningEngine.ts";
import type { ExecutiveReasoningResult } from "../reasoning/executiveReasoningEngine.ts";
import type { ExecutiveThoughtPartnerResult } from "../thought-partner/executiveThoughtPartnerEngine.ts";
import type { ExecutiveVisualReasoningResult } from "../visual-reasoning/executiveVisualReasoningEngine.ts";

export type ExecutiveCreativityCapabilityId =
  | "situationReframing"
  | "alternativeGeneration"
  | "opportunityDiscovery"
  | "constraintReframing"
  | "strategicAngleGeneration"
  | "innovationPathGeneration"
  | "creativityExplanation";

export type ExecutiveCreativityInput = Readonly<{
  sessionId: string;
  reasoning: ExecutiveReasoningResult;
  judgment: ExecutiveJudgmentResult;
  planning: ExecutivePlanningResult;
  coaching: ExecutiveCoachingResult;
  thoughtPartner: ExecutiveThoughtPartnerResult;
  visualReasoning: ExecutiveVisualReasoningResult;
  communication: ExecutiveCommunicationResult;
  negotiation: ExecutiveNegotiationResult;
}>;

export type ExecutiveCreativitySession = Readonly<{
  sessionId: string;
  phase: "LAY-10";
  reasoningSessionId: string;
  judgmentSessionId: string;
  planningSessionId: string;
  coachingSessionId: string;
  thoughtPartnerSessionId: string;
  visualReasoningSessionId: string;
  communicationSessionId: string;
  negotiationSessionId: string;
}>;

export type ExecutiveCreativityContext = Readonly<{
  session: ExecutiveCreativitySession;
  assumptionIds: readonly string[];
  constraintIds: readonly string[];
  tensionIds: readonly string[];
  blindSpotIds: readonly string[];
  riskIds: readonly string[];
  opportunityIds: readonly string[];
  conflictZoneIds: readonly string[];
  weakAlternativeIds: readonly string[];
  traceReferences: readonly string[];
}>;

export type ExecutiveReframe = Readonly<{
  reframeId: string;
  sourceType: "assumption" | "constraint" | "tension" | "blindSpot" | "risk" | "opportunity" | "conflict" | "alternative";
  sourceReference: string;
  reframe: string;
  explanation: string;
}>;

export type ExecutiveCreativeAlternative = Readonly<{
  alternativeId: string;
  sourceReference: string;
  alternative: string;
  selectionState: "not-selected";
  explanation: string;
}>;

export type ExecutiveOpportunityIdea = Readonly<{
  opportunityIdeaId: string;
  sourceReference: string;
  idea: string;
  domainSpecific: false;
  explanation: string;
}>;

export type ExecutiveConstraintReframe = Readonly<{
  constraintReframeId: string;
  constraintId: string;
  designInput: string;
  blockerState: "reframed-as-input";
  explanation: string;
}>;

export type ExecutiveStrategicAngle = Readonly<{
  angleId: string;
  sourceReference: string;
  angle: string;
  explanation: string;
}>;

export type ExecutiveInnovationPath = Readonly<{
  pathId: string;
  openingReframe: string;
  creativeAlternative: string;
  opportunityReference: string;
  constraintInput: string;
  conceptualOnly: true;
  sourceReferences: readonly string[];
  explanation: string;
}>;

export type ExecutiveCreativityExplanation = Readonly<{
  explanationId: string;
  reframeReasons: readonly string[];
  alternativeReasons: readonly string[];
  opportunityReasons: readonly string[];
  constraintReasons: readonly string[];
  angleReasons: readonly string[];
  pathReasons: readonly string[];
  traceReferences: readonly string[];
  narrative: string;
}>;

export type ExecutiveCreativityValidationIssue = Readonly<{
  code: string;
  field: string;
  message: string;
  severity: "error";
}>;

export type ExecutiveCreativityValidationResult = Readonly<{
  valid: boolean;
  issues: readonly ExecutiveCreativityValidationIssue[];
}>;

export type ExecutiveCreativityResult = Readonly<{
  session: ExecutiveCreativitySession;
  input: ExecutiveCreativityInput;
  context: ExecutiveCreativityContext;
  reframes: readonly ExecutiveReframe[];
  alternatives: readonly ExecutiveCreativeAlternative[];
  opportunities: readonly ExecutiveOpportunityIdea[];
  constraintReframes: readonly ExecutiveConstraintReframe[];
  strategicAngles: readonly ExecutiveStrategicAngle[];
  innovationPaths: readonly ExecutiveInnovationPath[];
  explanation: ExecutiveCreativityExplanation;
  validation: ExecutiveCreativityValidationResult;
}>;
