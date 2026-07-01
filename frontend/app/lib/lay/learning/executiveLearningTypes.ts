import type { ExecutiveCoachingResult } from "../coaching/executiveCoachingEngine.ts";
import type { ExecutiveCommunicationResult } from "../communication/executiveCommunicationEngine.ts";
import type { ExecutiveCreativityResult } from "../creativity/executiveCreativityEngine.ts";
import type { ExecutiveJudgmentResult } from "../judgment/executiveJudgmentEngine.ts";
import type { ExecutiveNegotiationResult } from "../negotiation/executiveNegotiationEngine.ts";
import type { ExecutivePlanningResult } from "../planning/executivePlanningEngine.ts";
import type { ExecutiveReasoningResult } from "../reasoning/executiveReasoningEngine.ts";
import type { ExecutiveThoughtPartnerResult } from "../thought-partner/executiveThoughtPartnerEngine.ts";
import type { ExecutiveVisualReasoningResult } from "../visual-reasoning/executiveVisualReasoningEngine.ts";

export type ExecutiveLearningCapabilityId =
  | "patternExtraction"
  | "assumptionPatternDetection"
  | "judgmentReflection"
  | "planReflection"
  | "coachingReflection"
  | "lessonGeneration"
  | "learningExplanation";

export type ExecutiveLearningInput = Readonly<{
  sessionId: string;
  reasoning: ExecutiveReasoningResult;
  judgment: ExecutiveJudgmentResult;
  planning: ExecutivePlanningResult;
  coaching: ExecutiveCoachingResult;
  thoughtPartner: ExecutiveThoughtPartnerResult;
  visualReasoning: ExecutiveVisualReasoningResult;
  communication: ExecutiveCommunicationResult;
  negotiation: ExecutiveNegotiationResult;
  creativity: ExecutiveCreativityResult;
}>;

export type ExecutiveLearningSession = Readonly<{
  sessionId: string;
  phase: "LAY-11";
  reasoningSessionId: string;
  judgmentSessionId: string;
  planningSessionId: string;
  coachingSessionId: string;
  thoughtPartnerSessionId: string;
  visualReasoningSessionId: string;
  communicationSessionId: string;
  negotiationSessionId: string;
  creativitySessionId: string;
}>;

export type ExecutiveLearningContext = Readonly<{
  session: ExecutiveLearningSession;
  assumptionIds: readonly string[];
  constraintIds: readonly string[];
  riskIds: readonly string[];
  tensionIds: readonly string[];
  priorityIds: readonly string[];
  blindSpotIds: readonly string[];
  conflictZoneIds: readonly string[];
  reframeIds: readonly string[];
  traceReferences: readonly string[];
}>;

export type ExecutiveLearningPattern = Readonly<{
  patternId: string;
  patternType: "assumption" | "constraint" | "risk" | "tension" | "priority" | "blindSpot" | "conflict" | "reframe";
  sourceReferences: readonly string[];
  observation: string;
  explanation: string;
}>;

export type ExecutiveAssumptionPattern = Readonly<{
  assumptionPatternId: string;
  assumptionId: string;
  occurrenceCount: number;
  sourceReferences: readonly string[];
  explanation: string;
}>;

export type ExecutiveJudgmentReflection = Readonly<{
  reflectionId: string;
  confidenceLevel: string;
  priorityCount: number;
  riskCount: number;
  opportunityCount: number;
  sourceReferences: readonly string[];
  explanation: string;
}>;

export type ExecutivePlanReflection = Readonly<{
  reflectionId: string;
  goalCount: number;
  milestoneCount: number;
  dependencyCount: number;
  sourceReferences: readonly string[];
  explanation: string;
}>;

export type ExecutiveCoachingReflection = Readonly<{
  reflectionId: string;
  questionCount: number;
  challengeCount: number;
  blindSpotCount: number;
  sourceReferences: readonly string[];
  explanation: string;
}>;

export type ExecutiveReusableLesson = Readonly<{
  lessonId: string;
  lesson: string;
  sourceReferences: readonly string[];
  memoryMutation: false;
  explanation: string;
}>;

export type ExecutiveLearningExplanation = Readonly<{
  explanationId: string;
  patternReasons: readonly string[];
  assumptionReasons: readonly string[];
  reflectionReasons: readonly string[];
  lessonReasons: readonly string[];
  traceReferences: readonly string[];
  narrative: string;
}>;

export type ExecutiveLearningValidationIssue = Readonly<{
  code: string;
  field: string;
  message: string;
  severity: "error";
}>;

export type ExecutiveLearningValidationResult = Readonly<{
  valid: boolean;
  issues: readonly ExecutiveLearningValidationIssue[];
}>;

export type ExecutiveLearningResult = Readonly<{
  session: ExecutiveLearningSession;
  input: ExecutiveLearningInput;
  context: ExecutiveLearningContext;
  patterns: readonly ExecutiveLearningPattern[];
  assumptionPatterns: readonly ExecutiveAssumptionPattern[];
  judgmentReflection: ExecutiveJudgmentReflection;
  planReflection: ExecutivePlanReflection;
  coachingReflection: ExecutiveCoachingReflection;
  lessons: readonly ExecutiveReusableLesson[];
  explanation: ExecutiveLearningExplanation;
  validation: ExecutiveLearningValidationResult;
}>;
