/**
 * NPA-T NMI:4 — manager-readable Decision Roadmap projection.
 * Derived from canonical roadmap state. Does not implement Queue or Stage UI.
 */

import {
  NMI_ROADMAP_STAGES,
  type NmiDecisionRoadmap,
  type NmiDecisionRoadmapProjection,
  type NmiRoadmapStage,
  type NmiRoadmapStageStatus,
} from "./nmiDecisionRoadmapContract.ts";

const LABELS: Readonly<Record<NmiRoadmapStage, string>> = Object.freeze({
  CONTEXT: "Context",
  GOAL: "Goal",
  OPERATION: "Operations",
  KPI_DATA: "KPI & Data",
  ISSUE: "Problem / Risk",
  ANALYSIS: "Analysis",
  SCENARIO: "Scenarios",
  COMPARISON: "Comparison",
  DECISION: "Decision",
  EXECUTION: "Execution",
  OUTCOME: "Outcome",
  LEARNING_REASSESSMENT: "Learning",
});

function mark(status: NmiRoadmapStageStatus): string {
  switch (status) {
    case "PRESENT":
      return "✓";
    case "PARTIAL":
      return "~";
    case "UNRESOLVED":
      return "?";
    case "MISSING":
      return "?";
    case "NOT_REACHED":
      return "○";
    case "NOT_APPLICABLE":
      return "–";
    default:
      return "○";
  }
}

function statusPhrase(status: NmiRoadmapStageStatus): string {
  switch (status) {
    case "NOT_REACHED":
      return "Not reached";
    case "MISSING":
      return "Missing";
    case "UNRESOLVED":
      return "Unresolved";
    case "NOT_APPLICABLE":
      return "Not applicable";
    case "PARTIAL":
      return "Partial";
    default:
      return "Present";
  }
}

export function projectNmiDecisionRoadmap(roadmap: NmiDecisionRoadmap): NmiDecisionRoadmapProjection {
  const lines: string[] = [
    `${roadmap.contextKind} roadmap ${roadmap.roadmapId}`,
    `Anchor ${roadmap.anchorRef.id}`,
    `Position ${roadmap.currentPosition.primary}${roadmap.currentPosition.secondary ? ` / ${roadmap.currentPosition.secondary}` : ""}`,
  ];
  for (const stage of NMI_ROADMAP_STAGES) {
    const view = roadmap.stages.find((item) => item.stage === stage);
    if (!view) continue;
    lines.push(`${LABELS[stage]}`);
    if (view.elements.length === 0) {
      lines.push(`${mark(view.status)} ${statusPhrase(view.status)}`);
      continue;
    }
    for (const element of view.elements) {
      const label = element.title ?? element.elementId;
      const causal =
        element.knowledgeKind === "ANALYTICAL_RELATIONSHIP"
          ? " [analytical; not confirmed cause]"
          : element.knowledgeKind === "SUPPORTED_CAUSAL_RELATIONSHIP"
            ? " [supported causal]"
            : "";
      lines.push(`${mark(view.status)} ${label}${causal}`);
    }
    if (view.status === "UNRESOLVED" || view.status === "PARTIAL") {
      lines.push(`${mark(view.status)} ${statusPhrase(view.status)}`);
    }
  }
  return Object.freeze({
    roadmapId: roadmap.roadmapId,
    lines: Object.freeze(lines),
    mutatesQueue: false,
    mutatesStage: false,
  });
}
