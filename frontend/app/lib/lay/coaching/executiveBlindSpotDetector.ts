import type { ExecutiveBlindSpot, ExecutiveCoachingInput } from "./executiveCoachingTypes.ts";

export function detectExecutiveBlindSpots(input: ExecutiveCoachingInput): readonly ExecutiveBlindSpot[] {
  const blindSpots: ExecutiveBlindSpot[] = [];

  if (!input.reasoning.session.input.objects.some((object) => object.id.toLowerCase().includes("stakeholder"))) {
    blindSpots.push(Object.freeze({
      blindSpotId: "blind-spot:stakeholder:missing",
      category: "stakeholder" as const,
      sourceId: input.reasoning.session.sessionId,
      description: "No stakeholder object is represented in the reasoning context.",
      traceReference: input.reasoning.session.sessionId,
    }));
  }
  if (input.judgment.judgment.risks.length === 0) {
    blindSpots.push(Object.freeze({
      blindSpotId: "blind-spot:risk:missing",
      category: "risk" as const,
      sourceId: input.judgment.session.sessionId,
      description: "Judgment contains no surfaced risk awareness.",
      traceReference: input.judgment.session.sessionId,
    }));
  }
  if (input.judgment.judgment.confidence.level === "high" && input.reasoning.components.assumptions.length > 0) {
    blindSpots.push(Object.freeze({
      blindSpotId: "blind-spot:confidence:assumption-sensitive",
      category: "confidence" as const,
      sourceId: input.judgment.judgment.confidence.level,
      description: "High confidence may be sensitive to untested assumptions.",
      traceReference: input.judgment.session.sessionId,
    }));
  }
  input.judgment.judgment.priorities.forEach((priority) => {
    if (!priority.justification.trim()) {
      blindSpots.push(Object.freeze({
        blindSpotId: `blind-spot:priority:${priority.id}`,
        category: "priority" as const,
        sourceId: priority.id,
        description: "Priority lacks supporting justification.",
        traceReference: priority.id,
      }));
    }
  });
  input.reasoning.components.constraints.forEach((constraint) => {
    if (!constraint.consequence.trim()) {
      blindSpots.push(Object.freeze({
        blindSpotId: `blind-spot:constraint:${constraint.id}`,
        category: "constraint" as const,
        sourceId: constraint.id,
        description: "Constraint lacks a validated consequence.",
        traceReference: constraint.id,
      }));
    }
  });
  input.planning.dependencies.forEach((dependency) => {
    if (dependency.dependencyType === "phase-to-phase") {
      blindSpots.push(Object.freeze({
        blindSpotId: `blind-spot:dependency:${dependency.dependencyId}`,
        category: "dependency" as const,
        sourceId: dependency.dependencyId,
        description: "Phase dependency may be fragile if upstream phase assumptions shift.",
        traceReference: dependency.dependencyId,
      }));
    }
  });

  return Object.freeze(blindSpots.sort((left, right) => left.blindSpotId.localeCompare(right.blindSpotId)));
}
