/**
 * NPA-T DTH-EXP:1 — reuse existing authorities. No parallel Theatre system.
 */

export const DTH_EXP_AUTHORITY_BOUNDARY = Object.freeze({
  canonicalObjects: "MO:1 / NEX-MVP:4 catalog",
  stageState: "NEX-MVP:3 / NEX-MVP:4",
  directorIntent: "DIR:1/SemanticPresentationDirectorStageIntentFoundation",
  sceneComposition: "DTH:5 Scene Intent / Scene Script",
  evidence: "CC:8",
  dataReality: "P0:1 / RDI:1",
  advisorContext: "DTH:1 advisorReadable / CC:5",
  relationships: "DTH:1–3 relationship projection / NMI:1 vocabulary",
  variableRoles: "VAI:1–8",
  decision: "CC:10",
  execution: "CC:11",
  outcome: "CORE-OUT / DTH:11",
  learning: "CORE-OUT:2 / DTH:12",
  nmi: "NMI:1–8 composer (consumed, not replaced)",
  nps: "NPS consumes; DTH-EXP does not own Problem/Scenario",
  rms: "RMS:1 Ground Truth (not a Theatre timeline)",
  ecaCc: "ECA / CC conversational pipeline (consumed)",
  dth: "DTH:1–12",
  dthExpOwns: "read-oriented Theatre Scene / Actor / visual-role / relationship / Evidence-attachment projection",
  productInvariant:
    "A manager does not see a chart. A manager sees a management scene in which Objects, visualizations, Evidence, and Advisor are actors in the decision process.",
  consumptionPath: Object.freeze([
    "Manager Context",
    "Director",
    "Scene Composition",
    "Theatre Projection",
  ] as const),
  parallelObjectStore: false as const,
  parallelEvidenceStore: false as const,
  parallelDataReality: false as const,
  parallelStage: false as const,
  parallelDirector: false as const,
  parallelAdvisor: false as const,
  parallelDecisionWriter: false as const,
  parallelExecutionWriter: false as const,
  parallelOutcomeWriter: false as const,
  parallelLearningWriter: false as const,
  parallelVaiRoleAuthority: false as const,
  parallelTimelineAuthority: false as const,
  automaticNexoSelection: false as const,
  nexoFamiliesImplemented: false as const,
  animationEngineImplemented: false as const,
  startsDthExp2: false as const,
});

export function verifyDthExpAuthorityBoundary(): { readonly ok: true } {
  if (DTH_EXP_AUTHORITY_BOUNDARY.parallelObjectStore) {
    throw new Error("DTH-EXP:1 must not create a parallel Object store");
  }
  if (DTH_EXP_AUTHORITY_BOUNDARY.parallelEvidenceStore) {
    throw new Error("DTH-EXP:1 must not create a parallel Evidence store");
  }
  if (DTH_EXP_AUTHORITY_BOUNDARY.parallelDataReality) {
    throw new Error("DTH-EXP:1 must not create a parallel Data Reality");
  }
  if (DTH_EXP_AUTHORITY_BOUNDARY.parallelStage) {
    throw new Error("DTH-EXP:1 must not create a parallel Stage");
  }
  if (DTH_EXP_AUTHORITY_BOUNDARY.parallelDirector) {
    throw new Error("DTH-EXP:1 must not become a second Director");
  }
  if (DTH_EXP_AUTHORITY_BOUNDARY.parallelAdvisor) {
    throw new Error("DTH-EXP:1 must not create a parallel Advisor");
  }
  if (DTH_EXP_AUTHORITY_BOUNDARY.parallelDecisionWriter) {
    throw new Error("DTH-EXP:1 must not write Decision");
  }
  if (DTH_EXP_AUTHORITY_BOUNDARY.parallelExecutionWriter) {
    throw new Error("DTH-EXP:1 must not write Execution");
  }
  if (DTH_EXP_AUTHORITY_BOUNDARY.parallelOutcomeWriter) {
    throw new Error("DTH-EXP:1 must not write Outcome");
  }
  if (DTH_EXP_AUTHORITY_BOUNDARY.parallelLearningWriter) {
    throw new Error("DTH-EXP:1 must not write Learning");
  }
  if (DTH_EXP_AUTHORITY_BOUNDARY.parallelVaiRoleAuthority) {
    throw new Error("DTH-EXP:1 must not redefine VAI roles");
  }
  if (DTH_EXP_AUTHORITY_BOUNDARY.parallelTimelineAuthority) {
    throw new Error("DTH-EXP:1 must not create a Timeline authority");
  }
  if (DTH_EXP_AUTHORITY_BOUNDARY.automaticNexoSelection) {
    throw new Error("DTH-EXP:1 must not select Nexo families");
  }
  if (DTH_EXP_AUTHORITY_BOUNDARY.nexoFamiliesImplemented) {
    throw new Error("DTH-EXP:1 must not implement Nexo scene families");
  }
  if (DTH_EXP_AUTHORITY_BOUNDARY.animationEngineImplemented) {
    throw new Error("DTH-EXP:1 must not implement an animation engine");
  }
  if (DTH_EXP_AUTHORITY_BOUNDARY.startsDthExp2) {
    throw new Error("DTH-EXP:1 must not start DTH-EXP:2");
  }
  return Object.freeze({ ok: true as const });
}
