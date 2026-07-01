import type { ExecutiveCoachingResult } from "../coaching/executiveCoachingEngine.ts";
import type { ExecutiveCommunicationResult } from "../communication/executiveCommunicationEngine.ts";
import type { ExecutiveJudgmentResult } from "../judgment/executiveJudgmentEngine.ts";
import type { ExecutivePlanningResult } from "../planning/executivePlanningEngine.ts";
import type { ExecutiveReasoningResult } from "../reasoning/executiveReasoningEngine.ts";
import type { ExecutiveThoughtPartnerResult } from "../thought-partner/executiveThoughtPartnerEngine.ts";
import type { ExecutiveVisualReasoningResult } from "../visual-reasoning/executiveVisualReasoningEngine.ts";

export type ExecutiveNegotiationCapabilityId =
  | "stakeholderPositionMapping"
  | "interestAnalysis"
  | "leverageAnalysis"
  | "concessionMapping"
  | "conflictZoneDetection"
  | "negotiationPathGeneration"
  | "negotiationExplanation";

export type ExecutiveNegotiationInput = Readonly<{
  sessionId: string;
  reasoning: ExecutiveReasoningResult;
  judgment: ExecutiveJudgmentResult;
  planning: ExecutivePlanningResult;
  coaching: ExecutiveCoachingResult;
  thoughtPartner: ExecutiveThoughtPartnerResult;
  visualReasoning: ExecutiveVisualReasoningResult;
  communication: ExecutiveCommunicationResult;
}>;

export type ExecutiveNegotiationSession = Readonly<{
  sessionId: string;
  phase: "LAY-9";
  reasoningSessionId: string;
  judgmentSessionId: string;
  planningSessionId: string;
  coachingSessionId: string;
  thoughtPartnerSessionId: string;
  visualReasoningSessionId: string;
  communicationSessionId: string;
}>;

export type ExecutiveNegotiationContext = Readonly<{
  session: ExecutiveNegotiationSession;
  stakeholderIds: readonly string[];
  priorityIds: readonly string[];
  riskIds: readonly string[];
  opportunityIds: readonly string[];
  constraintIds: readonly string[];
  goalIds: readonly string[];
  audienceFrameIds: readonly string[];
  counterpointIds: readonly string[];
  traceReferences: readonly string[];
}>;

export type ExecutiveStakeholderPosition = Readonly<{
  stakeholderId: string;
  stakeholderLabel: string;
  statedPosition: string;
  sourceReference: string;
  explanation: string;
}>;

export type ExecutiveInterestAnalysis = Readonly<{
  interestId: string;
  stakeholderId: string;
  underlyingInterest: string;
  contrastedPosition: string;
  sourceReference: string;
  explanation: string;
}>;

export type ExecutiveLeveragePoint = Readonly<{
  leverageId: string;
  leverageType: "reasoning" | "risk" | "opportunity" | "constraint" | "confidence" | "plan" | "communication";
  sourceReference: string;
  leverageStatement: string;
  explanation: string;
}>;

export type ExecutiveConcessionCandidate = Readonly<{
  concessionId: string;
  candidate: string;
  boundary: string;
  sourceReference: string;
  explanation: string;
}>;

export type ExecutiveConflictZone = Readonly<{
  conflictZoneId: string;
  leftPositionId: string;
  rightPositionId: string;
  conflictStatement: string;
  sourceReferences: readonly string[];
  explanation: string;
}>;

export type ExecutiveNegotiationPath = Readonly<{
  pathId: string;
  openingFrame: string;
  leverageReference: string;
  concessionReference: string;
  conflictReference: string;
  possibleNextQuestion: string;
  sourceReferences: readonly string[];
  explanation: string;
}>;

export type ExecutiveNegotiationExplanation = Readonly<{
  explanationId: string;
  positionReasons: readonly string[];
  interestReasons: readonly string[];
  leverageReasons: readonly string[];
  concessionReasons: readonly string[];
  conflictReasons: readonly string[];
  pathReasons: readonly string[];
  traceReferences: readonly string[];
  narrative: string;
}>;

export type ExecutiveNegotiationValidationIssue = Readonly<{
  code: string;
  field: string;
  message: string;
  severity: "error";
}>;

export type ExecutiveNegotiationValidationResult = Readonly<{
  valid: boolean;
  issues: readonly ExecutiveNegotiationValidationIssue[];
}>;

export type ExecutiveNegotiationResult = Readonly<{
  session: ExecutiveNegotiationSession;
  input: ExecutiveNegotiationInput;
  context: ExecutiveNegotiationContext;
  stakeholderPositions: readonly ExecutiveStakeholderPosition[];
  interests: readonly ExecutiveInterestAnalysis[];
  leveragePoints: readonly ExecutiveLeveragePoint[];
  concessionCandidates: readonly ExecutiveConcessionCandidate[];
  conflictZones: readonly ExecutiveConflictZone[];
  negotiationPaths: readonly ExecutiveNegotiationPath[];
  explanation: ExecutiveNegotiationExplanation;
  validation: ExecutiveNegotiationValidationResult;
}>;
