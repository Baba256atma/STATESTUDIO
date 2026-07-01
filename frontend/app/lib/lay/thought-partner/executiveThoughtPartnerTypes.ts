import type { ExecutiveCoachingResult } from "../coaching/executiveCoachingEngine.ts";
import type { ExecutiveJudgmentResult } from "../judgment/executiveJudgmentEngine.ts";
import type { ExecutivePlanningResult } from "../planning/executivePlanningEngine.ts";
import type { ExecutiveReasoningResult } from "../reasoning/executiveReasoningEngine.ts";

export type ExecutiveThoughtPartnerCapabilityId =
  | "perspectiveFraming"
  | "counterpointGeneration"
  | "alternativeViewpoints"
  | "strategicReflection"
  | "debatePaths"
  | "tensionMapping"
  | "explanationGeneration";

export type ExecutiveThoughtPartnerInput = Readonly<{
  sessionId: string;
  reasoning: ExecutiveReasoningResult;
  judgment: ExecutiveJudgmentResult;
  planning: ExecutivePlanningResult;
  coaching: ExecutiveCoachingResult;
}>;

export type ExecutiveThoughtPartnerSession = Readonly<{
  sessionId: string;
  phase: "LAY-6";
  reasoningSessionId: string;
  judgmentSessionId: string;
  planningSessionId: string;
  coachingSessionId: string;
}>;

export type ExecutiveThoughtPartnerContext = Readonly<{
  session: ExecutiveThoughtPartnerSession;
  assumptionIds: readonly string[];
  constraintIds: readonly string[];
  priorityIds: readonly string[];
  confidenceLevel: string;
  goalIds: readonly string[];
  milestoneIds: readonly string[];
  coachingQuestionIds: readonly string[];
  challengeIds: readonly string[];
  blindSpotIds: readonly string[];
  traceReferences: readonly string[];
}>;

export type ExecutivePerspectiveFrame = Readonly<{
  perspectiveId: string;
  perspectiveName: string;
  basis: string;
  linkedEvidence: readonly string[];
  linkedReferences: readonly string[];
}>;

export type ExecutiveCounterpoint = Readonly<{
  counterpointId: string;
  statement: string;
  reason: string;
  sourceReference: string;
  executiveRelevance: string;
}>;

export type ExecutiveAlternativeViewpoint = Readonly<{
  viewpointId: string;
  viewpoint: string;
  whyItMatters: string;
  supportingSource: string;
  opposingSource: string | null;
  uncertaintyNote: string;
}>;

export type ExecutiveStrategicReflection = Readonly<{
  reflectionId: string;
  prompt: string;
  sourceReference: string;
  traceReference: string;
}>;

export type ExecutiveDebatePath = Readonly<{
  debatePathId: string;
  openingPosition: string;
  counterpoint: string;
  refinementQuestion: string;
  possibleSynthesis: string;
  traceReferences: readonly string[];
}>;

export type ExecutiveTensionMap = Readonly<{
  tensionId: string;
  tensionName: "speed-vs-accuracy" | "cost-vs-quality" | "risk-vs-opportunity" | "short-term-vs-long-term" | "control-vs-flexibility" | "growth-vs-stability";
  leftPole: string;
  rightPole: string;
  sourceReference: string;
  traceReferences: readonly string[];
}>;

export type ExecutiveThoughtPartnerExplanation = Readonly<{
  explanationId: string;
  perspectiveReasons: readonly string[];
  counterpointReasons: readonly string[];
  tensionReasons: readonly string[];
  traceReferences: readonly string[];
  narrative: string;
}>;

export type ExecutiveThoughtPartnerValidationIssue = Readonly<{
  code: string;
  field: string;
  message: string;
  severity: "error";
}>;

export type ExecutiveThoughtPartnerValidationResult = Readonly<{
  valid: boolean;
  issues: readonly ExecutiveThoughtPartnerValidationIssue[];
}>;

export type ExecutiveThoughtPartnerResult = Readonly<{
  session: ExecutiveThoughtPartnerSession;
  input: ExecutiveThoughtPartnerInput;
  context: ExecutiveThoughtPartnerContext;
  perspectives: readonly ExecutivePerspectiveFrame[];
  counterpoints: readonly ExecutiveCounterpoint[];
  alternativeViewpoints: readonly ExecutiveAlternativeViewpoint[];
  strategicReflections: readonly ExecutiveStrategicReflection[];
  debatePaths: readonly ExecutiveDebatePath[];
  tensionMap: readonly ExecutiveTensionMap[];
  explanation: ExecutiveThoughtPartnerExplanation;
  validation: ExecutiveThoughtPartnerValidationResult;
}>;
