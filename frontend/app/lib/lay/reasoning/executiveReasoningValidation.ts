import type {
  ExecutiveReasoningChain,
  ExecutiveReasoningInput,
  ExecutiveReasoningResult,
  ExecutiveReasoningValidationIssue,
  ExecutiveReasoningValidationResult,
} from "./executiveReasoningTypes.ts";

function issue(code: string, field: string, message: string): ExecutiveReasoningValidationIssue {
  return Object.freeze({ code, field, message, severity: "error" as const });
}

function result(issues: readonly ExecutiveReasoningValidationIssue[]): ExecutiveReasoningValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze([...issues]) });
}

function hasUniqueValues(values: readonly string[]): boolean {
  return new Set(values).size === values.length;
}

function isSorted(values: readonly string[]): boolean {
  return values.every((value, index) => index === 0 || values[index - 1].localeCompare(value) <= 0);
}

function validateInput(input: ExecutiveReasoningInput): readonly ExecutiveReasoningValidationIssue[] {
  const issues: ExecutiveReasoningValidationIssue[] = [];
  const objectIds = input.objects.map((object) => object.id);
  const relationshipIds = input.relationships.map((relationship) => relationship.id);
  const assumptionIds = input.assumptions.map((assumption) => assumption.id);
  const constraintIds = input.constraints.map((constraint) => constraint.id);
  const knownObjectIds = new Set(objectIds);

  if (!input.sessionId.trim() || !input.situation.trim()) {
    issues.push(issue("invalid_input", "input", "Reasoning input requires session id and situation."));
  }
  if (!hasUniqueValues(objectIds) || !hasUniqueValues(relationshipIds) || !hasUniqueValues(assumptionIds) || !hasUniqueValues(constraintIds)) {
    issues.push(issue("duplicate_ids", "input.ids", "Reasoning input ids must be unique by collection."));
  }
  input.relationships.forEach((relationship) => {
    if (!knownObjectIds.has(relationship.fromId) || !knownObjectIds.has(relationship.toId)) {
      issues.push(issue("invalid_relationship_reference", relationship.id, "Relationship references unknown objects."));
    }
  });
  input.assumptions.forEach((assumption) => {
    if (assumption.appliesTo.some((id) => !knownObjectIds.has(id))) {
      issues.push(issue("invalid_assumption_reference", assumption.id, "Assumption references unknown objects."));
    }
  });
  input.constraints.forEach((constraint) => {
    if (constraint.appliesTo.some((id) => !knownObjectIds.has(id))) {
      issues.push(issue("invalid_constraint_reference", constraint.id, "Constraint references unknown objects."));
    }
  });

  return Object.freeze(issues);
}

function validateChain(chain: ExecutiveReasoningChain): readonly ExecutiveReasoningValidationIssue[] {
  const issues: ExecutiveReasoningValidationIssue[] = [];
  const nodeIds = chain.nodes.map((node) => node.id);
  const seen = new Set<string>();

  if (!chain.chainId.trim() || chain.nodes.length === 0) {
    issues.push(issue("invalid_chain", "chain", "Reasoning chain requires id and nodes."));
  }
  if (!hasUniqueValues(nodeIds)) {
    issues.push(issue("duplicate_chain_nodes", "chain.nodes", "Reasoning chain nodes must be unique."));
  }
  chain.nodes.forEach((node, index) => {
    if (node.parentId && !seen.has(node.parentId)) {
      issues.push(issue("invalid_chain_parent", node.id, "Reasoning chain parent must appear before child."));
    }
    if (node.parentId === node.id) {
      issues.push(issue("chain_cycle", node.id, "Reasoning chain cannot contain self cycles."));
    }
    if (!node.step.trim() || !node.evidenceReference.trim() || !node.explanation.trim()) {
      issues.push(issue("incomplete_chain_node", node.id, "Reasoning node requires step, evidence, and explanation."));
    }
    if (index === 0 && node.parentId !== null) {
      issues.push(issue("invalid_chain_root", node.id, "First reasoning node must be the root."));
    }
    seen.add(node.id);
  });

  return Object.freeze(issues);
}

export function validateExecutiveReasoning(candidate: ExecutiveReasoningResult): ExecutiveReasoningValidationResult {
  const issues: ExecutiveReasoningValidationIssue[] = [];
  const input = candidate.session.input;

  issues.push(...validateInput(input));
  issues.push(...validateChain(candidate.chain));

  if (!isSorted(input.objects.map((object) => object.id)) || !isSorted(input.relationships.map((relationship) => relationship.id))) {
    issues.push(issue("non_deterministic_order", "input", "Normalized objects and relationships must be sorted by id."));
  }
  if (candidate.components.dependencies.some((dependency) => dependency.path.length < 2)) {
    issues.push(issue("invalid_dependency", "components.dependencies", "Dependencies must contain source to target paths."));
  }
  if (
    candidate.explanation.why.length === 0 ||
    candidate.explanation.because.length === 0 ||
    candidate.explanation.therefore.length === 0 ||
    !candidate.explanation.narrative.includes("Why:") ||
    !candidate.explanation.narrative.includes("Because:") ||
    !candidate.explanation.narrative.includes("Therefore:")
  ) {
    issues.push(issue("incomplete_explanation", "explanation", "Explanation must include why, because, and therefore."));
  }

  return result(issues);
}
