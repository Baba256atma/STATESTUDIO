/**
 * NPA-T VAI:1 — consume existing authorities. No parallel store.
 */

export const VAI_AUTHORITY_BOUNDARY = Object.freeze({
  objects: "MO:1",
  dataReality: "Data Reality / RDI",
  semantics: "DATA-ADV / DATA-UX:3 / manager confirmation",
  evidence: "CC:8",
  kpi: "existing KPI observation owners",
  scenario: "CC:9",
  decision: "CC:10",
  execution: "CC:11",
  advisor: "NXA / NCA / ECA presentation",
  stage: "Director / Stage interaction",
  businessContext: "BCA",
  vaiOwns: "read-only Variable contract and resolver",
  parallelObjectStore: false as const,
  parallelDataReality: false as const,
  parallelSemanticAuthority: false as const,
  parallelEvidenceAuthority: false as const,
  parallelKpiAuthority: false as const,
  parallelScenarioAuthority: false as const,
  parallelDecisionAuthority: false as const,
  parallelStage: false as const,
  parallelAdvisorMemory: false as const,
});

export function verifyVaiAuthorityBoundary(): { readonly ok: true } {
  if (VAI_AUTHORITY_BOUNDARY.parallelObjectStore) throw new Error("VAI:1 must not create a parallel Object store");
  if (VAI_AUTHORITY_BOUNDARY.parallelDataReality) throw new Error("VAI:1 must not create a parallel Data Reality");
  if (VAI_AUTHORITY_BOUNDARY.parallelSemanticAuthority) throw new Error("VAI:1 must not create a parallel semantic authority");
  if (VAI_AUTHORITY_BOUNDARY.parallelEvidenceAuthority) throw new Error("VAI:1 must not create a parallel Evidence authority");
  if (VAI_AUTHORITY_BOUNDARY.parallelKpiAuthority) throw new Error("VAI:1 must not create a parallel KPI authority");
  if (VAI_AUTHORITY_BOUNDARY.parallelScenarioAuthority) throw new Error("VAI:1 must not create a parallel Scenario authority");
  if (VAI_AUTHORITY_BOUNDARY.parallelDecisionAuthority) throw new Error("VAI:1 must not create a parallel Decision authority");
  if (VAI_AUTHORITY_BOUNDARY.parallelStage) throw new Error("VAI:1 must not create a parallel Stage");
  if (VAI_AUTHORITY_BOUNDARY.parallelAdvisorMemory) throw new Error("VAI:1 must not create parallel Advisor memory");
  return Object.freeze({ ok: true as const });
}
