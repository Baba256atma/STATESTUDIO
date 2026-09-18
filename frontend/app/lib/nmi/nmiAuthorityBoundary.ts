/**
 * NPA-T NMI:1 — reuse existing authorities. No parallel Nexora.
 */

export const NMI_AUTHORITY_BOUNDARY = Object.freeze({
  businessProjectContext: "BCA:1/BusinessProjectContextFoundation",
  managerRole: "BCA manager/role context + MO:1 interaction",
  managerObject: "MO:1",
  goals: "existing Goal / MO:1 goal kind",
  kpi: "existing KPI observation owners",
  processes: "BCA:4/BusinessProjectProcessContext",
  dataReality: "P0:1/NexoraDataRealityFoundation",
  gateApi: "RDI:1/NexoraRealDataIntegrationFoundation",
  semanticConfirmation: "DATA-ADV / DATA-UX:3 / manager confirmation",
  evidence: "CC:8",
  problems: "MO:1 problem / NPS:1 understanding",
  risks: "MO:1 risk",
  variables: "VAI:1–8",
  scenarios: "CC:9",
  decision: "CC:10",
  execution: "CC:11",
  outcome: "CORE-OUT",
  learning: "CORE-OUT:2 / ECA:12 / DTH:12",
  stage: "Director / Stage interaction",
  theatre: "DTH / DIR:1",
  advisor: "CC:5 / NXA / NCA / ECA presentation",
  nps: "NPS consumes; does not own Scenario/Decision",
  rms: "RMS:1 Ground Truth (simulation; not NMI)",
  queue: "existing executive Queue (unchanged)",
  nmiOwns: "unified management-model contracts, relationship vocabulary, read-model composition, provenance of composition",
  parallelObjectStore: false as const,
  parallelDataReality: false as const,
  parallelGateApi: false as const,
  parallelStage: false as const,
  parallelAdvisor: false as const,
  parallelCausalTruth: false as const,
  parallelScenarioAuthority: false as const,
  parallelDecisionAuthority: false as const,
  parallelExecutionAuthority: false as const,
  parallelSimulationEngine: false as const,
  parallelContextClassifier: false as const,
  nmiGate: false as const,
  startsNmi2: false as const,
  startsRms2: false as const,
});

export function verifyNmiAuthorityBoundary(): { readonly ok: true } {
  if (NMI_AUTHORITY_BOUNDARY.parallelObjectStore) throw new Error("NMI:1 must not create a parallel Object store");
  if (NMI_AUTHORITY_BOUNDARY.parallelDataReality) throw new Error("NMI:1 must not create a parallel Data Reality");
  if (NMI_AUTHORITY_BOUNDARY.parallelGateApi || NMI_AUTHORITY_BOUNDARY.nmiGate) {
    throw new Error("NMI:1 must not create a Gate API");
  }
  if (NMI_AUTHORITY_BOUNDARY.parallelStage) throw new Error("NMI:1 must not create a parallel Stage");
  if (NMI_AUTHORITY_BOUNDARY.parallelAdvisor) throw new Error("NMI:1 must not create a parallel Advisor");
  if (NMI_AUTHORITY_BOUNDARY.parallelCausalTruth) throw new Error("NMI:1 must not create causal truth");
  if (NMI_AUTHORITY_BOUNDARY.parallelScenarioAuthority) throw new Error("NMI:1 must not create a Scenario authority");
  if (NMI_AUTHORITY_BOUNDARY.parallelDecisionAuthority) throw new Error("NMI:1 must not create a Decision authority");
  if (NMI_AUTHORITY_BOUNDARY.parallelExecutionAuthority) throw new Error("NMI:1 must not create an Execution authority");
  if (NMI_AUTHORITY_BOUNDARY.parallelSimulationEngine) throw new Error("NMI:1 must not become a simulation engine");
  if (NMI_AUTHORITY_BOUNDARY.parallelContextClassifier) throw new Error("NMI:1 must reuse BCA context kinds");
  if (NMI_AUTHORITY_BOUNDARY.startsNmi2) throw new Error("NMI:1 must not start NMI:2");
  if (NMI_AUTHORITY_BOUNDARY.startsRms2) throw new Error("NMI:1 must not start RMS:2");
  return Object.freeze({ ok: true as const });
}
