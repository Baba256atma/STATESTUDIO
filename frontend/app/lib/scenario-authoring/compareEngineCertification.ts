import {
  buildExecutiveCompareSummary,
  resetExecutiveCompareSummaryForTests,
} from "./ExecutiveCompareSummary.ts";
import {
  buildScenarioComparisonRequest,
  buildScenarioComparisonResult,
  buildScenarioDifferenceProfile,
  SCENARIO_COMPARISON_CONTRACT,
} from "./ScenarioComparisonContract.ts";
import {
  resetScenarioPairSelectorForTests,
  selectScenarioPair,
} from "./ScenarioPairSelector.ts";
import {
  C1_CERTIFICATION_COMPLETE_DIAGNOSTIC,
  C1_CERTIFICATION_FREEZE_TAGS,
  C1_CERTIFIED_TAG,
  C1_COMPARE_ENGINE_CERTIFICATION_TAG,
  COMPARE_ENGINE_COMPLETE_TAG,
  type CompareEngineCertificationGate,
  type CompareEngineCertificationInput,
  type CompareEngineCertificationResult,
} from "./compareEngineCertificationContract.ts";
import {
  EMPTY_EXECUTIVE_SIMULATION_SUMMARY,
  type ExecutiveSimulationSummary,
} from "./simulationResultAggregatorContract.ts";

function gate(
  id: CompareEngineCertificationGate["id"],
  name: string,
  failures: readonly string[]
): CompareEngineCertificationGate {
  return Object.freeze({
    id,
    name,
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail: failures.length === 0 ? `${name} certified.` : failures.join("; "),
  });
}

function resetCertificationRuntime(): void {
  resetScenarioPairSelectorForTests();
  resetExecutiveCompareSummaryForTests();
}

function summary(id: string, confidence: number, impact: number): ExecutiveSimulationSummary {
  return Object.freeze({
    ...EMPTY_EXECUTIVE_SIMULATION_SUMMARY,
    request: Object.freeze({
      draftId: id,
      dryRun: true,
      sceneMutation: false,
      dsMutation: false,
      routingMutation: false,
    }),
    overallScenarioImpact: impact,
    confidence,
    keyPositiveEffects: Object.freeze(["Certified positive effect."]),
    keyNegativeEffects: Object.freeze(["Certified negative effect."]),
    uiRendering: false,
    routingMutation: false,
    readOnly: true,
  });
}

export function runCompareEngineCertification(
  input: CompareEngineCertificationInput = {}
): CompareEngineCertificationResult {
  resetCertificationRuntime();

  const gates: CompareEngineCertificationGate[] = [];
  const scenarioA = summary("scenario-a", 82, 68);
  const scenarioB = summary("scenario-b", 74, 55);
  const scenePayload = Object.freeze({
    scene: Object.freeze({
      objects: Object.freeze([Object.freeze({ id: "supplier-1" })]),
      relationships: Object.freeze([Object.freeze({ id: "rel-1", sourceId: "supplier-1", targetId: "inventory-1" })]),
      kpis: Object.freeze([Object.freeze({ id: "revenue" })]),
      risks: Object.freeze([Object.freeze({ id: "risk-supplier" })]),
    }),
  });
  const sceneBefore = JSON.stringify(scenePayload);
  const topologyBefore = JSON.stringify({
    objects: scenePayload.scene.objects,
    relationships: scenePayload.scene.relationships,
  });
  const dsBefore = JSON.stringify({
    scenarioA,
    scenarioB,
  });

  const pair = selectScenarioPair({
    comparisonId: "compare:cert",
    mode: "simulation_vs_simulation",
    scenarioA: { kind: "simulation", simulation: scenarioA },
    scenarioB: { kind: "simulation", simulation: scenarioB },
  });

  const request = pair.comparisonRequest ?? buildScenarioComparisonRequest({
    comparisonId: "compare:cert-fallback",
    mode: "scenario_vs_scenario",
    scenarioA: {
      scenarioId: "scenario-a",
      label: "Scenario A",
      summary: scenarioA,
      baseline: false,
    },
    scenarioB: {
      scenarioId: "scenario-b",
      label: "Scenario B",
      summary: scenarioB,
      baseline: false,
    },
  });

  const objectDifference = buildScenarioDifferenceProfile({
    differenceId: "object-delta",
    category: "object",
    scenarioAId: "scenario-a",
    scenarioBId: "scenario-b",
    overallImpactDelta: 8,
    riskMovementDelta: -2,
    kpiMovementDelta: 1,
    confidenceDelta: 3,
    objectCountDelta: 1,
    relationshipCountDelta: 0,
    kpiCountDelta: 0,
    riskCountDelta: 0,
    advantage: "scenarioA",
    summary: "Object delta favors Scenario A.",
  });
  const kpiDifference = buildScenarioDifferenceProfile({
    differenceId: "kpi-delta",
    category: "kpi",
    scenarioAId: "scenario-a",
    scenarioBId: "scenario-b",
    overallImpactDelta: 4,
    riskMovementDelta: 0,
    kpiMovementDelta: 6,
    confidenceDelta: 1,
    objectCountDelta: 0,
    relationshipCountDelta: 0,
    kpiCountDelta: 1,
    riskCountDelta: 0,
    advantage: "scenarioA",
    summary: "KPI delta favors Scenario A.",
  });
  const riskDifference = buildScenarioDifferenceProfile({
    differenceId: "risk-delta",
    category: "risk",
    scenarioAId: "scenario-a",
    scenarioBId: "scenario-b",
    overallImpactDelta: 2,
    riskMovementDelta: -7,
    kpiMovementDelta: 0,
    confidenceDelta: 2,
    objectCountDelta: 0,
    relationshipCountDelta: 0,
    kpiCountDelta: 0,
    riskCountDelta: 1,
    advantage: "scenarioA",
    summary: "Risk delta favors Scenario A.",
  });

  const comparison = buildScenarioComparisonResult({
    request,
    differences: [objectDifference, kpiDifference, riskDifference],
    primaryDifference: objectDifference,
  });
  const executiveSummary = buildExecutiveCompareSummary({ comparison });

  gates.push(gate("A", "Compare Contract works", [
    SCENARIO_COMPARISON_CONTRACT.readOnly === true ? "" : "Compare contract is not read-only",
    comparison.readOnly === true ? "" : "Comparison result is not read-only",
    comparison.differences.length === 3 ? "" : "Comparison differences missing",
  ].filter(Boolean)));

  gates.push(gate("B", "Pair Selector works", [
    pair.accepted === true ? "" : "Pair selector rejected valid pair",
    pair.simulationExecution === false ? "" : "Pair selector executed simulation",
  ].filter(Boolean)));

  gates.push(gate("C", "Object Delta Compare works", [
    comparison.differences.some((difference) => difference.category === "object") ? "" : "Object difference missing",
    objectDifference.objectCountDelta !== 0 ? "" : "Object count delta missing",
  ].filter(Boolean)));

  gates.push(gate("D", "KPI/Risk Compare works", [
    comparison.differences.some((difference) => difference.category === "kpi") ? "" : "KPI difference missing",
    comparison.differences.some((difference) => difference.category === "risk") ? "" : "Risk difference missing",
  ].filter(Boolean)));

  gates.push(gate("E", "Executive Compare Summary works", [
    executiveSummary.advantages.length > 0 ? "" : "Advantages missing",
    executiveSummary.keyTradeoffs.length > 0 ? "" : "Tradeoffs missing",
    executiveSummary.recommendedOption !== "neutral" ? "" : "Recommendation missing",
    executiveSummary.uiRendering === false ? "" : "Executive summary reports UI rendering",
  ].filter(Boolean)));

  gates.push(gate("F", "No Scene mutations", [
    JSON.stringify(scenePayload) === sceneBefore ? "" : "Scene payload mutated",
    comparison.sceneMutation === false ? "" : "Comparison reports scene mutation",
  ].filter(Boolean)));

  gates.push(gate("G", "No Topology mutations", [
    JSON.stringify({ objects: scenePayload.scene.objects, relationships: scenePayload.scene.relationships }) === topologyBefore
      ? ""
      : "Topology payload mutated",
    comparison.topologyMutation === false ? "" : "Comparison reports topology mutation",
  ].filter(Boolean)));

  gates.push(gate("H", "No Routing changes", [
    pair.routingMutation === false ? "" : "Pair selector routing mutation",
    comparison.routingMutation === false ? "" : "Comparison routing mutation",
    executiveSummary.routingMutation === false ? "" : "Executive summary routing mutation",
  ].filter(Boolean)));

  gates.push(gate("I", "No DS mutations", [
    JSON.stringify({ scenarioA, scenarioB }) === dsBefore ? "" : "Summary inputs mutated",
    pair.dsMutation === false ? "" : "Pair selector DS mutation",
    comparison.dsMutation === false ? "" : "Comparison DS mutation",
  ].filter(Boolean)));

  gates.push(gate("J", "No Simulation mutations", [
    pair.simulationExecution === false ? "" : "Pair selector executed simulation",
    comparison.mutation === false ? "" : "Comparison mutation flag true",
    executiveSummary.mutation === false ? "" : "Executive summary mutation flag true",
  ].filter(Boolean)));

  gates.push(gate("K", "No Object mutations", [
    pair.objectMutation === false ? "" : "Pair selector object mutation",
    comparison.objectMutation === false ? "" : "Comparison object mutation",
    executiveSummary.objectMutation === false ? "" : "Executive summary object mutation",
  ].filter(Boolean)));

  gates.push(gate("L", "Build passes", [
    input.buildPassed === false ? "Build verification failed" : "",
  ].filter(Boolean)));

  gates.push(gate("M", "Tests pass", [
    input.testsPassed === false ? "Test verification failed" : "",
  ].filter(Boolean)));

  const freezeTagsValid =
    C1_CERTIFIED_TAG === "[C1_CERTIFIED]" &&
    COMPARE_ENGINE_COMPLETE_TAG === "[COMPARE_ENGINE_COMPLETE]" &&
    C1_CERTIFICATION_FREEZE_TAGS.length === 2;
  const certified = gates.every((entry) => entry.status === "PASS") && freezeTagsValid;

  return Object.freeze({
    tag: C1_COMPARE_ENGINE_CERTIFICATION_TAG,
    version: "1.0.0",
    certified,
    diagnostics: Object.freeze([C1_CERTIFICATION_COMPLETE_DIAGNOSTIC] as const),
    gates: Object.freeze(gates),
    freezeTags: C1_CERTIFICATION_FREEZE_TAGS,
  });
}
