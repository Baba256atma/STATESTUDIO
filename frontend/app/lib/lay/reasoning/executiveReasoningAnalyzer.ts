import type {
  ExecutiveAlternative,
  ExecutiveDependency,
  ExecutiveReasoningComponents,
  ExecutiveReasoningRelationship,
  ExecutiveReasoningSession,
  ExecutiveTradeoff,
} from "./executiveReasoningTypes.ts";

function relationshipEvidence(entry: ExecutiveReasoningRelationship): readonly string[] {
  return Object.freeze([entry.id, entry.evidence].filter((value) => value.trim().length > 0));
}

function buildDependency(entry: ExecutiveReasoningRelationship): ExecutiveDependency {
  return Object.freeze({
    id: `dependency:${entry.fromId}:${entry.toId}`,
    sourceId: entry.fromId,
    targetId: entry.toId,
    path: Object.freeze([entry.fromId, entry.toId]),
    evidenceReferences: relationshipEvidence(entry),
  });
}

function buildTradeoff(entry: ExecutiveReasoningRelationship): ExecutiveTradeoff {
  return Object.freeze({
    id: `tradeoff:${entry.fromId}:${entry.toId}`,
    left: entry.fromId,
    right: entry.toId,
    tension: entry.evidence,
    evidenceReferences: relationshipEvidence(entry),
  });
}

function buildAlternatives(
  causalLinks: readonly ExecutiveReasoningRelationship[],
  dependencies: readonly ExecutiveDependency[]
): readonly ExecutiveAlternative[] {
  const alternatives = [
    ...causalLinks.map((link) =>
      Object.freeze({
        id: `alternative:causal:${link.id}`,
        pathLabel: `Trace cause ${link.fromId} before effect ${link.toId}`,
        basedOnNodeIds: Object.freeze([link.id]),
        explanation: `Alternative reasoning path follows the causal link from ${link.fromId} to ${link.toId}.`,
      })
    ),
    ...dependencies.map((dependency) =>
      Object.freeze({
        id: `alternative:dependency:${dependency.id}`,
        pathLabel: `Trace dependency ${dependency.sourceId} before ${dependency.targetId}`,
        basedOnNodeIds: Object.freeze([dependency.id]),
        explanation: `Alternative reasoning path follows dependency ${dependency.sourceId} to ${dependency.targetId}.`,
      })
    ),
  ];

  return Object.freeze(alternatives.sort((left, right) => left.id.localeCompare(right.id)));
}

export function analyzeExecutiveReasoningComponents(session: ExecutiveReasoningSession): ExecutiveReasoningComponents {
  const relationships = session.input.relationships;
  const causalLinks = Object.freeze(relationships.filter((relationship) => relationship.kind === "causes"));
  const dependencies = Object.freeze(
    relationships
      .filter((relationship) => relationship.kind === "dependsOn")
      .map(buildDependency)
      .sort((left, right) => left.id.localeCompare(right.id))
  );
  const tradeoffs = Object.freeze(
    relationships
      .filter((relationship) => relationship.kind === "tradesOffWith")
      .map(buildTradeoff)
      .sort((left, right) => left.id.localeCompare(right.id))
  );

  return Object.freeze({
    causalLinks,
    dependencies,
    assumptions: session.input.assumptions,
    constraints: session.input.constraints,
    tradeoffs,
    alternatives: buildAlternatives(causalLinks, dependencies),
  });
}
