import type {
  ExecutiveAssumption,
  ExecutiveConstraint,
  ExecutiveReasoningInput,
  ExecutiveReasoningObject,
  ExecutiveReasoningRelationship,
  ExecutiveReasoningSession,
} from "./executiveReasoningTypes.ts";

function sortById<T extends Readonly<{ id: string }>>(entries: readonly T[]): readonly T[] {
  return Object.freeze([...entries].sort((left, right) => left.id.localeCompare(right.id)));
}

function normalizeObject(entry: ExecutiveReasoningObject): ExecutiveReasoningObject {
  return Object.freeze({
    id: entry.id.trim(),
    label: entry.label.trim(),
    description: entry.description.trim(),
    attributes: Object.freeze({ ...entry.attributes }),
  });
}

function normalizeRelationship(entry: ExecutiveReasoningRelationship): ExecutiveReasoningRelationship {
  return Object.freeze({
    id: entry.id.trim(),
    fromId: entry.fromId.trim(),
    toId: entry.toId.trim(),
    kind: entry.kind,
    evidence: entry.evidence.trim(),
  });
}

function normalizeAssumption(entry: ExecutiveAssumption): ExecutiveAssumption {
  return Object.freeze({
    id: entry.id.trim(),
    statement: entry.statement.trim(),
    appliesTo: Object.freeze([...entry.appliesTo].map((id) => id.trim()).sort()),
    impact: entry.impact.trim(),
  });
}

function normalizeConstraint(entry: ExecutiveConstraint): ExecutiveConstraint {
  return Object.freeze({
    id: entry.id.trim(),
    statement: entry.statement.trim(),
    appliesTo: Object.freeze([...entry.appliesTo].map((id) => id.trim()).sort()),
    consequence: entry.consequence.trim(),
  });
}

export function normalizeExecutiveReasoningContext(input: ExecutiveReasoningInput): ExecutiveReasoningSession {
  const normalizedInput: ExecutiveReasoningInput = Object.freeze({
    sessionId: input.sessionId.trim(),
    situation: input.situation.trim(),
    objects: sortById(input.objects.map(normalizeObject)),
    relationships: sortById(input.relationships.map(normalizeRelationship)),
    assumptions: sortById(input.assumptions.map(normalizeAssumption)),
    constraints: sortById(input.constraints.map(normalizeConstraint)),
  });

  return Object.freeze({
    sessionId: normalizedInput.sessionId,
    phase: "LAY-2",
    input: normalizedInput,
  });
}
