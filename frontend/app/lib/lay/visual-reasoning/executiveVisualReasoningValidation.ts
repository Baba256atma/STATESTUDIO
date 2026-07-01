import type {
  ExecutiveCauseEffectMap,
  ExecutiveDecisionMap,
  ExecutivePlanMap,
  ExecutiveTradeoffMap,
  ExecutiveVisualEdge,
  ExecutiveVisualMap,
  ExecutiveVisualNode,
  ExecutiveVisualReasoningResult,
  ExecutiveVisualReasoningValidationIssue,
  ExecutiveVisualReasoningValidationResult,
} from "./executiveVisualReasoningTypes.ts";

type ValidatedMap = ExecutiveVisualMap | ExecutiveCauseEffectMap | ExecutiveDecisionMap | ExecutiveTradeoffMap | ExecutivePlanMap;

function issue(code: string, field: string, message: string): ExecutiveVisualReasoningValidationIssue {
  return Object.freeze({ code, field, message, severity: "error" as const });
}

function result(issues: readonly ExecutiveVisualReasoningValidationIssue[]): ExecutiveVisualReasoningValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze([...issues]) });
}

function isSorted(values: readonly string[]): boolean {
  return values.every((value, index) => index === 0 || values[index - 1].localeCompare(value) <= 0);
}

function hasInvalidNode(nodes: readonly ExecutiveVisualNode[]): boolean {
  return nodes.some((node) => !node.id.trim() || !node.label.trim() || !node.sourceReference.trim() || !node.explanation.trim());
}

function hasInvalidEdge(edges: readonly ExecutiveVisualEdge[]): boolean {
  return edges.some((edge) => !edge.id.trim() || !edge.from.trim() || !edge.to.trim() || !edge.sourceReference.trim() || !edge.explanation.trim());
}

function hasDanglingEdge(map: ValidatedMap): boolean {
  const nodeIds = new Set(map.nodes.map((node) => node.id));
  return map.edges.some((edge) => !nodeIds.has(edge.from) || !nodeIds.has(edge.to));
}

export function validateExecutiveVisualReasoning(candidate: ExecutiveVisualReasoningResult): ExecutiveVisualReasoningValidationResult {
  const issues: ExecutiveVisualReasoningValidationIssue[] = [];
  const maps = [candidate.executiveMap, candidate.causeEffectMap, candidate.decisionMap, candidate.tradeoffMap, candidate.planMap] as const;

  if (!candidate.session.sessionId.trim() || candidate.session.phase !== "LAY-7") {
    issues.push(issue("invalid_session", "session", "Visual reasoning session is invalid."));
  }
  if (
    candidate.session.reasoningSessionId !== candidate.input.reasoning.session.sessionId ||
    candidate.session.judgmentSessionId !== candidate.input.judgment.session.sessionId ||
    candidate.session.planningSessionId !== candidate.input.planning.session.sessionId ||
    candidate.session.coachingSessionId !== candidate.input.coaching.session.sessionId ||
    candidate.session.thoughtPartnerSessionId !== candidate.input.thoughtPartner.session.sessionId
  ) {
    issues.push(issue("invalid_traceability", "session", "Visual reasoning must trace to LAY-2, LAY-3, LAY-4, LAY-5, and LAY-6."));
  }
  if (
    !candidate.input.reasoning.validation.valid ||
    !candidate.input.judgment.validation.valid ||
    !candidate.input.planning.validation.valid ||
    !candidate.input.coaching.validation.valid ||
    !candidate.input.thoughtPartner.validation.valid
  ) {
    issues.push(issue("invalid_inputs", "input", "Visual reasoning requires valid upstream layer inputs."));
  }
  if (maps.some((map) => hasInvalidNode(map.nodes))) {
    issues.push(issue("invalid_node", "nodes", "Every visual node must be complete and traceable."));
  }
  if (maps.some((map) => hasInvalidEdge(map.edges))) {
    issues.push(issue("invalid_edge", "edges", "Every visual edge must be complete and traceable."));
  }
  if (maps.some((map) => hasDanglingEdge(map))) {
    issues.push(issue("dangling_edge", "edges", "Visual maps cannot contain dangling edges."));
  }
  if (
    maps.some((map) => !isSorted(map.nodes.map((node) => node.id)) || !isSorted(map.edges.map((edge) => edge.id)))
  ) {
    issues.push(issue("non_deterministic_order", "ordering", "Visual maps must use deterministic node and edge ordering."));
  }
  if (
    candidate.visualExplanation.mapReasons.length !== maps.length ||
    candidate.visualExplanation.nodeReasons.length !== maps.reduce((total, map) => total + map.nodes.length, 0) ||
    candidate.visualExplanation.edgeReasons.length !== maps.reduce((total, map) => total + map.edges.length, 0) ||
    candidate.visualExplanation.traceReferences.length < 5
  ) {
    issues.push(issue("invalid_explanation", "visualExplanation", "Visual explanation must cover maps, nodes, edges, and upstream traces."));
  }

  return result(issues);
}
