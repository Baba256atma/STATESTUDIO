import type { ExecutiveJudgmentResult } from "../judgment/executiveJudgmentEngine.ts";
import type { ExecutivePlanningResult } from "../planning/executivePlanningEngine.ts";
import type { ExecutiveReasoningResult } from "../reasoning/executiveReasoningEngine.ts";

export type ExecutiveCoachingCapabilityId =
  | "clarifyingQuestions"
  | "assumptionChallenges"
  | "blindSpotDetection"
  | "reflectionPrompts"
  | "decisionQualityPrompts"
  | "planReviewPrompts"
  | "coachingExplanation";

export type ExecutiveCoachingInput = Readonly<{
  sessionId: string;
  reasoning: ExecutiveReasoningResult;
  judgment: ExecutiveJudgmentResult;
  planning: ExecutivePlanningResult;
}>;

export type ExecutiveCoachingSession = Readonly<{
  sessionId: string;
  phase: "LAY-5";
  reasoningSessionId: string;
  judgmentSessionId: string;
  planningSessionId: string;
}>;

export type ExecutiveCoachingContext = Readonly<{
  session: ExecutiveCoachingSession;
  assumptionIds: readonly string[];
  constraintIds: readonly string[];
  priorityIds: readonly string[];
  confidenceLevel: string;
  goalIds: readonly string[];
  milestoneIds: readonly string[];
  dependencyIds: readonly string[];
  traceReferences: readonly string[];
}>;

export type ExecutiveCoachingQuestion = Readonly<{
  questionId: string;
  prompt: string;
  sourceType: "assumption" | "constraint" | "evidence" | "goal" | "dependency";
  sourceId: string;
  coachingIntent: string;
}>;

export type ExecutiveAssumptionChallenge = Readonly<{
  challengeId: string;
  challengedAssumptionId: string;
  reasonForChallenge: string;
  relatedEvidence: string;
  relatedRisk: string;
  coachingIntent: string;
}>;

export type ExecutiveBlindSpot = Readonly<{
  blindSpotId: string;
  category: "stakeholder" | "risk" | "confidence" | "priority" | "constraint" | "dependency";
  sourceId: string;
  description: string;
  traceReference: string;
}>;

export type ExecutiveReflectionPrompt = Readonly<{
  promptId: string;
  prompt: string;
  sourceId: string;
  traceReference: string;
}>;

export type ExecutiveDecisionQualityPrompt = Readonly<{
  promptId: string;
  prompt: string;
  sourceId: string;
  traceReference: string;
}>;

export type ExecutivePlanReviewPrompt = Readonly<{
  promptId: string;
  prompt: string;
  sourceId: string;
  traceReference: string;
}>;

export type ExecutiveCoachingExplanation = Readonly<{
  explanationId: string;
  questionReasons: readonly string[];
  challengeReasons: readonly string[];
  blindSpotReasons: readonly string[];
  traceReferences: readonly string[];
  narrative: string;
}>;

export type ExecutiveCoachingValidationIssue = Readonly<{
  code: string;
  field: string;
  message: string;
  severity: "error";
}>;

export type ExecutiveCoachingValidationResult = Readonly<{
  valid: boolean;
  issues: readonly ExecutiveCoachingValidationIssue[];
}>;

export type ExecutiveCoachingResult = Readonly<{
  session: ExecutiveCoachingSession;
  input: ExecutiveCoachingInput;
  context: ExecutiveCoachingContext;
  questions: readonly ExecutiveCoachingQuestion[];
  challenges: readonly ExecutiveAssumptionChallenge[];
  blindSpots: readonly ExecutiveBlindSpot[];
  reflectionPrompts: readonly ExecutiveReflectionPrompt[];
  decisionQualityPrompts: readonly ExecutiveDecisionQualityPrompt[];
  planReviewPrompts: readonly ExecutivePlanReviewPrompt[];
  explanation: ExecutiveCoachingExplanation;
  validation: ExecutiveCoachingValidationResult;
}>;
