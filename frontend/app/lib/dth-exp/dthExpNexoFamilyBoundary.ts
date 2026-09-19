/**
 * NPA-T DTH-EXP:3B — Nexo family definition boundary.
 * Families are visual languages on the shared Scene Recipe System.
 */

export const DTH_EXP_NEXO_FAMILY_BOUNDARY = Object.freeze({
  identity: "NPA-T DTH-EXP:3B/NexoFamilyBoundary" as const,
  recipeEngine: "DTH-EXP:3A/SceneRecipeResolver",
  theatreActors: "DTH-EXP:2",
  theatreFoundation: "DTH-EXP:1",
  director: "DIR:1",
  stage: "NEX-MVP:3 / NEX-MVP:4",
  objects: "MO:1 / NEX-MVP:4",
  evidence: "CC:8",
  vai: "VAI:1–8",
  decision: "CC:10",
  execution: "CC:11",
  outcomeLearning: "CORE-OUT / DTH:11–12",
  bottleneckFamily: false as const,
  bottleneckIsNexoFlowCondition: true as const,
  parallelRecipeEngine: false as const,
  parallelTimelineAuthority: false as const,
  parallelCausalEngine: false as const,
  automaticDirectorSelection: false as const,
  managerChoosesChartType: false as const,
  multiNexoCompositionImplemented: false as const,
  writesDecision: false as const,
  writesExecution: false as const,
  writesOutcome: false as const,
  writesLearning: false as const,
  convertsCorrelationToCause: false as const,
  ranksBubbleCandidates: false as const,
  calculatesKpi: false as const,
  startsDthExp4: false as const,
});

export function verifyDthExpNexoFamilyBoundary(): { readonly ok: true } {
  if (DTH_EXP_NEXO_FAMILY_BOUNDARY.bottleneckFamily) {
    throw new Error("DTH-EXP:3B must not create NexoBottleneck");
  }
  if (DTH_EXP_NEXO_FAMILY_BOUNDARY.parallelRecipeEngine) {
    throw new Error("DTH-EXP:3B must not create a second recipe engine");
  }
  if (DTH_EXP_NEXO_FAMILY_BOUNDARY.parallelTimelineAuthority) {
    throw new Error("DTH-EXP:3B must not create Timeline authority");
  }
  if (DTH_EXP_NEXO_FAMILY_BOUNDARY.parallelCausalEngine) {
    throw new Error("DTH-EXP:3B must not create a causal engine");
  }
  if (DTH_EXP_NEXO_FAMILY_BOUNDARY.automaticDirectorSelection) {
    throw new Error("DTH-EXP:3B must not select Nexo families as Director");
  }
  if (DTH_EXP_NEXO_FAMILY_BOUNDARY.writesExecution) {
    throw new Error("DTH-EXP:3B must not write Execution");
  }
  if (DTH_EXP_NEXO_FAMILY_BOUNDARY.writesOutcome || DTH_EXP_NEXO_FAMILY_BOUNDARY.writesLearning) {
    throw new Error("DTH-EXP:3B must not write Outcome or Learning");
  }
  if (DTH_EXP_NEXO_FAMILY_BOUNDARY.startsDthExp4) {
    throw new Error("DTH-EXP:3B must not start DTH-EXP:4");
  }
  return Object.freeze({ ok: true as const });
}
