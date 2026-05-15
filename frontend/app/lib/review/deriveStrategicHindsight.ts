import type { DecisionEvolutionChange } from "./decisionReviewTypes.ts";

export function deriveStrategicHindsight(params: {
  changes: DecisionEvolutionChange[];
}): string[] {
  const hindsight: string[] = [];
  for (const change of params.changes) {
    if (change.type === "confidence_changed" && typeof change.confidenceDrift === "number") {
      if (change.confidenceDrift > 0.08) hindsight.push("Recommendation confidence improved as operating evidence became more consistent.");
      if (change.confidenceDrift < -0.08) hindsight.push("Recommendation confidence weakened as operating evidence became less consistent.");
    }
    if (change.type === "monitoring_changed" && change.currentState === "stable") {
      hindsight.push("Monitoring pressure stabilized after previously elevated operating attention.");
    }
    if (change.type === "fragility_changed" && change.currentState === "reduced") {
      hindsight.push("Propagation exposure decreased across previously unstable dependency corridors.");
    }
    if (change.type === "intervention_changed" && change.currentState === "stronger_intervention") {
      hindsight.push("Strategic intervention focus increased as enterprise fragility evidence strengthened.");
    }
    if (change.type === "recommendation_changed") {
      hindsight.push("Recommendation focus changed as the strategic evidence base evolved.");
    }
  }
  return Array.from(new Set(hindsight)).slice(0, 4);
}

export function deriveLessonsLearned(params: {
  changes: DecisionEvolutionChange[];
}): string[] {
  const lessons: string[] = [];
  if (params.changes.some((change) => change.type === "fragility_changed")) {
    lessons.push("Dependency concentration can amplify downstream fragility.");
  }
  if (params.changes.some((change) => change.type === "monitoring_changed")) {
    lessons.push("Monitoring continuity improves executive awareness of stabilization.");
  }
  if (params.changes.some((change) => change.type === "confidence_changed")) {
    lessons.push("Decision confidence should be reviewed as evidence quality changes.");
  }
  if (params.changes.some((change) => change.type === "recommendation_changed")) {
    lessons.push("Recommendation changes should remain traceable to supporting operating evidence.");
  }
  return lessons.slice(0, 4);
}
