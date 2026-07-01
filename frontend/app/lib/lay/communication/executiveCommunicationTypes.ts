import type { ExecutiveCoachingResult } from "../coaching/executiveCoachingEngine.ts";
import type { ExecutiveJudgmentResult } from "../judgment/executiveJudgmentEngine.ts";
import type { ExecutivePlanningResult } from "../planning/executivePlanningEngine.ts";
import type { ExecutiveReasoningResult } from "../reasoning/executiveReasoningEngine.ts";
import type { ExecutiveThoughtPartnerResult } from "../thought-partner/executiveThoughtPartnerEngine.ts";
import type { ExecutiveVisualReasoningResult } from "../visual-reasoning/executiveVisualReasoningEngine.ts";

export type ExecutiveCommunicationCapabilityId =
  | "briefingGeneration"
  | "summaryGeneration"
  | "situationExplanation"
  | "rationaleCommunication"
  | "riskCommunication"
  | "planCommunication"
  | "audienceFraming";

export type ExecutiveCommunicationAudience =
  | "CEO"
  | "board"
  | "operationsLeader"
  | "financeLeader"
  | "riskComplianceLeader"
  | "teamLead";

export type ExecutiveCommunicationInput = Readonly<{
  sessionId: string;
  reasoning: ExecutiveReasoningResult;
  judgment: ExecutiveJudgmentResult;
  planning: ExecutivePlanningResult;
  coaching: ExecutiveCoachingResult;
  thoughtPartner: ExecutiveThoughtPartnerResult;
  visualReasoning: ExecutiveVisualReasoningResult;
}>;

export type ExecutiveCommunicationSession = Readonly<{
  sessionId: string;
  phase: "LAY-8";
  reasoningSessionId: string;
  judgmentSessionId: string;
  planningSessionId: string;
  coachingSessionId: string;
  thoughtPartnerSessionId: string;
  visualReasoningSessionId: string;
}>;

export type ExecutiveCommunicationContext = Readonly<{
  session: ExecutiveCommunicationSession;
  audienceIds: readonly ExecutiveCommunicationAudience[];
  reasoningTraceIds: readonly string[];
  priorityIds: readonly string[];
  riskIds: readonly string[];
  opportunityIds: readonly string[];
  goalIds: readonly string[];
  blindSpotIds: readonly string[];
  counterpointIds: readonly string[];
  visualMapIds: readonly string[];
  traceReferences: readonly string[];
}>;

export type ExecutiveAudienceFrame = Readonly<{
  audience: ExecutiveCommunicationAudience;
  frameId: string;
  focus: string;
  emphasis: readonly string[];
  sourceReferences: readonly string[];
  explanation: string;
}>;

export type ExecutiveBriefing = Readonly<{
  briefingId: string;
  title: string;
  situation: string;
  judgmentRationale: string;
  planOverview: string;
  risks: readonly string[];
  sourceReferences: readonly string[];
  explanation: string;
}>;

export type ExecutiveSummary = Readonly<{
  summaryId: string;
  headline: string;
  keyPoints: readonly string[];
  rationalePoints: readonly string[];
  traceReferences: readonly string[];
  explanation: string;
}>;

export type ExecutiveRiskCommunication = Readonly<{
  riskCommunicationId: string;
  riskStatements: readonly string[];
  opportunityBalance: readonly string[];
  blindSpotNotes: readonly string[];
  sourceReferences: readonly string[];
  explanation: string;
}>;

export type ExecutivePlanCommunication = Readonly<{
  planCommunicationId: string;
  goalMessages: readonly string[];
  milestoneMessages: readonly string[];
  dependencyMessages: readonly string[];
  sourceReferences: readonly string[];
  explanation: string;
}>;

export type ExecutiveCommunicationValidationIssue = Readonly<{
  code: string;
  field: string;
  message: string;
  severity: "error";
}>;

export type ExecutiveCommunicationValidationResult = Readonly<{
  valid: boolean;
  issues: readonly ExecutiveCommunicationValidationIssue[];
}>;

export type ExecutiveCommunicationResult = Readonly<{
  session: ExecutiveCommunicationSession;
  input: ExecutiveCommunicationInput;
  context: ExecutiveCommunicationContext;
  audienceFrames: readonly ExecutiveAudienceFrame[];
  briefing: ExecutiveBriefing;
  summary: ExecutiveSummary;
  riskCommunication: ExecutiveRiskCommunication;
  planCommunication: ExecutivePlanCommunication;
  validation: ExecutiveCommunicationValidationResult;
}>;
