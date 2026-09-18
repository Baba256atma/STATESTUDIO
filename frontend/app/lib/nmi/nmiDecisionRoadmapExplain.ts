/**
 * NPA-T NMI:4 — read-only Decision Roadmap explanation for future Advisor (NMI:7).
 * Does not change conversational behavior.
 */

import type { NmiDecisionRoadmap, NmiDecisionRoadmapExplanation } from "./nmiDecisionRoadmapContract.ts";

function ids(roadmap: NmiDecisionRoadmap, stage: NmiDecisionRoadmap["stages"][number]["stage"]): readonly string[] {
  return Object.freeze(roadmap.stages.find((item) => item.stage === stage)?.elements.map((item) => item.elementId) ?? []);
}

export function explainNmiDecisionRoadmap(roadmap: NmiDecisionRoadmap): NmiDecisionRoadmapExplanation {
  const comparison = roadmap.stages.find((item) => item.stage === "COMPARISON");
  const unknown = Object.freeze(
    roadmap.stages
      .filter((item) => item.status === "MISSING" || item.status === "UNRESOLVED" || item.status === "NOT_REACHED")
      .map((item) => `${item.stage}:${item.status}`),
  );
  const relationshipIds = Object.freeze(
    [...new Set(roadmap.stages.flatMap((item) => item.relationshipIds))].sort(),
  );
  return Object.freeze({
    roadmapId: roadmap.roadmapId,
    about: `Decision roadmap anchored at ${roadmap.anchorRef.kind}:${roadmap.anchorRef.id}`,
    goalIds: ids(roadmap, "GOAL"),
    evidenceIds: ids(roadmap, "KPI_DATA"),
    issueIds: ids(roadmap, "ISSUE"),
    relationshipIds,
    scenarioIds: ids(roadmap, "SCENARIO"),
    comparisonOccurred: comparison?.status === "PRESENT",
    decisionIds: ids(roadmap, "DECISION"),
    executionIds: ids(roadmap, "EXECUTION"),
    outcomeIds: ids(roadmap, "OUTCOME"),
    unknown,
    mutatesAdvisor: false,
  });
}
