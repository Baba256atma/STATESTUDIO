import type { ExecutiveCoachingResult } from "../coaching/executiveCoachingEngine.ts";
import type { ExecutiveJudgmentResult } from "../judgment/executiveJudgmentEngine.ts";
import type { ExecutivePlanningResult } from "../planning/executivePlanningEngine.ts";
import type { ExecutiveReasoningResult } from "../reasoning/executiveReasoningEngine.ts";
import type { ExecutiveThoughtPartnerResult } from "../thought-partner/executiveThoughtPartnerEngine.ts";

export type ExecutiveVisualReasoningCapabilityId =
  | "executiveMapGeneration"
  | "causeEffectMapping"
  | "decisionMapping"
  | "tradeoffMapping"
  | "planMapping"
  | "tensionMapping"
  | "visualExplanation";

export type ExecutiveVisualSourceLayer = "LAY-2" | "LAY-3" | "LAY-4" | "LAY-5" | "LAY-6" | "LAY-7";

export type ExecutiveVisualNodeCategory =
  | "reasoning"
  | "cause"
  | "effect"
  | "alternative"
  | "priority"
  | "confidence"
  | "rationale"
  | "tradeoff"
  | "constraint"
  | "risk"
  | "opportunity"
  | "goal"
  | "milestone"
  | "phase"
  | "dependency"
  | "blindSpot"
  | "counterpoint"
  | "tension";

export type ExecutiveVisualEdgeRelationship =
  | "causes"
  | "dependsOn"
  | "tradesOffWith"
  | "supports"
  | "questions"
  | "challenges"
  | "sequences"
  | "mapsTo"
  | "balances";

export type ExecutiveVisualReasoningInput = Readonly<{
  sessionId: string;
  reasoning: ExecutiveReasoningResult;
  judgment: ExecutiveJudgmentResult;
  planning: ExecutivePlanningResult;
  coaching: ExecutiveCoachingResult;
  thoughtPartner: ExecutiveThoughtPartnerResult;
}>;

export type ExecutiveVisualReasoningSession = Readonly<{
  sessionId: string;
  phase: "LAY-7";
  reasoningSessionId: string;
  judgmentSessionId: string;
  planningSessionId: string;
  coachingSessionId: string;
  thoughtPartnerSessionId: string;
}>;

export type ExecutiveVisualReasoningContext = Readonly<{
  session: ExecutiveVisualReasoningSession;
  reasoningNodeIds: readonly string[];
  priorityIds: readonly string[];
  confidenceLevel: string;
  goalIds: readonly string[];
  milestoneIds: readonly string[];
  blindSpotIds: readonly string[];
  counterpointIds: readonly string[];
  alternativeViewpointIds: readonly string[];
  tensionIds: readonly string[];
  traceReferences: readonly string[];
}>;

export type ExecutiveVisualNode = Readonly<{
  id: string;
  label: string;
  category: ExecutiveVisualNodeCategory;
  sourceLayer: ExecutiveVisualSourceLayer;
  sourceReference: string;
  importance: "low" | "medium" | "high";
  explanation: string;
}>;

export type ExecutiveVisualEdge = Readonly<{
  id: string;
  from: string;
  to: string;
  relationshipType: ExecutiveVisualEdgeRelationship;
  sourceReference: string;
  explanation: string;
}>;

export type ExecutiveVisualMap = Readonly<{
  mapId: string;
  mapType: "executive";
  nodes: readonly ExecutiveVisualNode[];
  edges: readonly ExecutiveVisualEdge[];
}>;

export type ExecutiveCauseEffectMap = Readonly<{
  mapId: string;
  mapType: "cause-effect";
  nodes: readonly ExecutiveVisualNode[];
  edges: readonly ExecutiveVisualEdge[];
}>;

export type ExecutiveDecisionMap = Readonly<{
  mapId: string;
  mapType: "decision";
  nodes: readonly ExecutiveVisualNode[];
  edges: readonly ExecutiveVisualEdge[];
}>;

export type ExecutiveTradeoffMap = Readonly<{
  mapId: string;
  mapType: "tradeoff";
  nodes: readonly ExecutiveVisualNode[];
  edges: readonly ExecutiveVisualEdge[];
}>;

export type ExecutivePlanMap = Readonly<{
  mapId: string;
  mapType: "plan";
  nodes: readonly ExecutiveVisualNode[];
  edges: readonly ExecutiveVisualEdge[];
}>;

export type ExecutiveVisualExplanation = Readonly<{
  explanationId: string;
  mapReasons: readonly string[];
  nodeReasons: readonly string[];
  edgeReasons: readonly string[];
  traceReferences: readonly string[];
  narrative: string;
}>;

export type ExecutiveVisualReasoningValidationIssue = Readonly<{
  code: string;
  field: string;
  message: string;
  severity: "error";
}>;

export type ExecutiveVisualReasoningValidationResult = Readonly<{
  valid: boolean;
  issues: readonly ExecutiveVisualReasoningValidationIssue[];
}>;

export type ExecutiveVisualReasoningResult = Readonly<{
  session: ExecutiveVisualReasoningSession;
  input: ExecutiveVisualReasoningInput;
  context: ExecutiveVisualReasoningContext;
  executiveMap: ExecutiveVisualMap;
  causeEffectMap: ExecutiveCauseEffectMap;
  decisionMap: ExecutiveDecisionMap;
  tradeoffMap: ExecutiveTradeoffMap;
  planMap: ExecutivePlanMap;
  visualExplanation: ExecutiveVisualExplanation;
  validation: ExecutiveVisualReasoningValidationResult;
}>;
