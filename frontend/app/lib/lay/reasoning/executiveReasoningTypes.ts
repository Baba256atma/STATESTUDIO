export type ExecutiveReasoningCapabilityId =
  | "causalReasoning"
  | "dependencyReasoning"
  | "assumptionReasoning"
  | "constraintReasoning"
  | "tradeoffReasoning"
  | "alternativeReasoning"
  | "explanationGeneration";

export type ExecutiveReasoningRelationshipKind = "causes" | "dependsOn" | "constrains" | "tradesOffWith" | "influences";

export type ExecutiveReasoningObject = Readonly<{
  id: string;
  label: string;
  description: string;
  attributes: Readonly<Record<string, string | number | boolean | null>>;
}>;

export type ExecutiveReasoningRelationship = Readonly<{
  id: string;
  fromId: string;
  toId: string;
  kind: ExecutiveReasoningRelationshipKind;
  evidence: string;
}>;

export type ExecutiveAssumption = Readonly<{
  id: string;
  statement: string;
  appliesTo: readonly string[];
  impact: string;
}>;

export type ExecutiveConstraint = Readonly<{
  id: string;
  statement: string;
  appliesTo: readonly string[];
  consequence: string;
}>;

export type ExecutiveTradeoff = Readonly<{
  id: string;
  left: string;
  right: string;
  tension: string;
  evidenceReferences: readonly string[];
}>;

export type ExecutiveDependency = Readonly<{
  id: string;
  sourceId: string;
  targetId: string;
  path: readonly string[];
  evidenceReferences: readonly string[];
}>;

export type ExecutiveAlternative = Readonly<{
  id: string;
  pathLabel: string;
  basedOnNodeIds: readonly string[];
  explanation: string;
}>;

export type ExecutiveReasoningInput = Readonly<{
  sessionId: string;
  situation: string;
  objects: readonly ExecutiveReasoningObject[];
  relationships: readonly ExecutiveReasoningRelationship[];
  assumptions: readonly ExecutiveAssumption[];
  constraints: readonly ExecutiveConstraint[];
}>;

export type ExecutiveReasoningSession = Readonly<{
  sessionId: string;
  phase: "LAY-2";
  input: ExecutiveReasoningInput;
}>;

export type ExecutiveReasoningNode = Readonly<{
  id: string;
  parentId: string | null;
  step: string;
  evidenceReference: string;
  explanation: string;
}>;

export type ExecutiveReasoningChain = Readonly<{
  chainId: string;
  nodes: readonly ExecutiveReasoningNode[];
}>;

export type ExecutiveExplanation = Readonly<{
  explanationId: string;
  why: readonly string[];
  because: readonly string[];
  therefore: readonly string[];
  narrative: string;
}>;

export type ExecutiveReasoningComponents = Readonly<{
  causalLinks: readonly ExecutiveReasoningRelationship[];
  dependencies: readonly ExecutiveDependency[];
  assumptions: readonly ExecutiveAssumption[];
  constraints: readonly ExecutiveConstraint[];
  tradeoffs: readonly ExecutiveTradeoff[];
  alternatives: readonly ExecutiveAlternative[];
}>;

export type ExecutiveReasoningResult = Readonly<{
  session: ExecutiveReasoningSession;
  components: ExecutiveReasoningComponents;
  chain: ExecutiveReasoningChain;
  explanation: ExecutiveExplanation;
  validation: ExecutiveReasoningValidationResult;
}>;

export type ExecutiveReasoningValidationIssue = Readonly<{
  code: string;
  field: string;
  message: string;
  severity: "error";
}>;

export type ExecutiveReasoningValidationResult = Readonly<{
  valid: boolean;
  issues: readonly ExecutiveReasoningValidationIssue[];
}>;
