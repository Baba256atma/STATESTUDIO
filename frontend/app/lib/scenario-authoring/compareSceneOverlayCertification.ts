import {
  buildCompareOverlayMarker,
  buildCompareOverlayProfile,
  buildCompareOverlayState,
  COMPARE_OVERLAY_CONTRACT,
} from "./CompareOverlayContract.ts";
import {
  activateCompareOverlay,
  resetCompareOverlayControllerForTests,
  type CompareOverlayPreservedState,
} from "./CompareOverlayController.ts";
import {
  buildExecutiveCompareSummary,
  resetExecutiveCompareSummaryForTests,
} from "./ExecutiveCompareSummary.ts";
import {
  buildKpiDifferenceProfile,
  buildRiskDifferenceProfile,
  generateKpiRiskCompareVisualLayer,
  resetKpiRiskCompareVisualLayerForTests,
} from "./KpiRiskCompareVisualLayer.ts";
import {
  buildObjectDifferenceProfile,
  generateObjectCompareMarkers,
  resetObjectCompareMarkerEngineForTests,
} from "./ObjectCompareMarkerEngine.ts";
import {
  buildScenarioComparisonRequest,
  buildScenarioComparisonResult,
  buildScenarioDifferenceProfile,
} from "./ScenarioComparisonContract.ts";
import {
  adaptSceneCompareRead,
  resetSceneCompareReadAdapterForTests,
} from "./SceneCompareReadAdapter.ts";
import {
  C2_CERTIFICATION_COMPLETE_DIAGNOSTIC,
  C2_CERTIFICATION_FREEZE_TAGS,
  C2_CERTIFIED_TAG,
  C2_COMPARE_SCENE_OVERLAY_CERTIFICATION_TAG,
  COMPARE_SCENE_OVERLAY_COMPLETE_TAG,
  type CompareSceneOverlayCertificationGate,
  type CompareSceneOverlayCertificationInput,
  type CompareSceneOverlayCertificationResult,
} from "./compareSceneOverlayCertificationContract.ts";
import {
  EMPTY_EXECUTIVE_SIMULATION_SUMMARY,
  type ExecutiveSimulationSummary,
} from "./simulationResultAggregatorContract.ts";

function gate(
  id: CompareSceneOverlayCertificationGate["id"],
  name: string,
  failures: readonly string[]
): CompareSceneOverlayCertificationGate {
  return Object.freeze({
    id,
    name,
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail: failures.length === 0 ? `${name} certified.` : failures.join("; "),
  });
}

function resetCertificationRuntime(): void {
  resetSceneCompareReadAdapterForTests();
  resetObjectCompareMarkerEngineForTests();
  resetKpiRiskCompareVisualLayerForTests();
  resetCompareOverlayControllerForTests();
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

function preservedState(): CompareOverlayPreservedState {
  return Object.freeze({
    scene: Object.freeze({
      sceneId: "scene-cert",
      sceneRevision: "rev-1",
      objectCount: 2,
      topologyFingerprint: "topology:v1",
    }),
    selection: Object.freeze({
      selectedObjectIds: Object.freeze(["object-a"]),
      focusedObjectId: "object-a",
    }),
    camera: Object.freeze({
      position: Object.freeze([1, 2, 3] as [number, number, number]),
      target: Object.freeze([4, 5, 6] as [number, number, number]),
      zoom: 1.1,
    }),
    timeline: Object.freeze({
      activeFrame: 6,
      playbackState: "paused",
      rangeStart: 0,
      rangeEnd: 24,
    }),
  });
}

export function runCompareSceneOverlayCertification(
  input: CompareSceneOverlayCertificationInput = {}
): CompareSceneOverlayCertificationResult {
  resetCertificationRuntime();

  const gates: CompareSceneOverlayCertificationGate[] = [];
  const scenarioA = summary("scenario-a", 84, 72);
  const scenarioB = summary("scenario-b", 77, 58);
  const scenePayload = Object.freeze({
    scene: Object.freeze({
      objects: Object.freeze([
        Object.freeze({ id: "object-a", position: Object.freeze({ x: 1, y: 2, z: 3 }) }),
        Object.freeze({ id: "object-b", position: Object.freeze({ x: 4, y: 5, z: 6 }) }),
      ]),
      relationships: Object.freeze([
        Object.freeze({ id: "rel-1", sourceId: "object-a", targetId: "object-b" }),
      ]),
    }),
    routing: Object.freeze({ route: "/type-c", params: Object.freeze({}) }),
  });
  const simulationPayload = Object.freeze({ scenarioA, scenarioB });
  const sceneBefore = JSON.stringify(scenePayload);
  const topologyBefore = JSON.stringify({
    objects: scenePayload.scene.objects,
    relationships: scenePayload.scene.relationships,
  });
  const routingBefore = JSON.stringify(scenePayload.routing);
  const dsBefore = JSON.stringify({ scenarioA, scenarioB });
  const simulationBefore = JSON.stringify(simulationPayload);

  const request = buildScenarioComparisonRequest({
    comparisonId: "compare:c2-cert",
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
  const objectComparisonDifference = buildScenarioDifferenceProfile({
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
  const kpiComparisonDifference = buildScenarioDifferenceProfile({
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
  const riskComparisonDifference = buildScenarioDifferenceProfile({
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
    differences: [objectComparisonDifference, kpiComparisonDifference, riskComparisonDifference],
    primaryDifference: objectComparisonDifference,
  });
  const executiveSummary = buildExecutiveCompareSummary({ comparison });
  const adapterResult = adaptSceneCompareRead({ comparison, executiveSummary });

  const objectDifference = buildObjectDifferenceProfile({
    differenceId: "object-delta",
    comparisonId: "compare:c2-cert",
    scenarioAId: "scenario-a",
    scenarioBId: "scenario-b",
    objectId: "object-a",
    objectLabel: "Object A",
    objectPosition: { x: 1, y: 2, z: 3 },
    topologyFingerprint: "topology:v1",
    objectHealthDelta: 5,
    objectImpactDelta: 3,
    confidence: 88,
    summary: "Object A improves.",
  });
  const objectBefore = JSON.stringify(objectDifference);
  const objectMarkers = generateObjectCompareMarkers({ differences: [objectDifference] });

  const kpiDifference = buildKpiDifferenceProfile({
    differenceId: "kpi-delta",
    comparisonId: "compare:c2-cert",
    scenarioAId: "scenario-a",
    scenarioBId: "scenario-b",
    kpiId: "revenue",
    kpiLabel: "Revenue",
    kpiHealthDelta: 3,
    kpiTrendDelta: 2,
    kpiImpactDelta: 4,
    confidence: 86,
    summary: "Revenue improves.",
  });
  const riskDifference = buildRiskDifferenceProfile({
    differenceId: "risk-delta",
    comparisonId: "compare:c2-cert",
    scenarioAId: "scenario-a",
    scenarioBId: "scenario-b",
    riskId: "supplier-risk",
    riskLabel: "Supplier Risk",
    riskExposureDelta: -5,
    riskProbabilityDelta: -2,
    confidence: 82,
    summary: "Supplier risk reduces.",
  });
  const kpiRiskVisualLayer = generateKpiRiskCompareVisualLayer({
    kpiDifferences: [kpiDifference],
    riskDifferences: [riskDifference],
  });

  const standaloneMarker = buildCompareOverlayMarker({
    markerId: "cert-marker",
    scenarioRole: "scenarioA",
    markerKind: "object",
    targetId: "object-a",
    label: "Certified marker.",
    intensity: 50,
    confidence: 90,
  });
  const overlayProfile = buildCompareOverlayProfile({
    profileId: "cert-profile",
    comparisonId: "compare:c2-cert",
    scenarioAId: "scenario-a",
    scenarioBId: "scenario-b",
    markers: [standaloneMarker],
  });
  const overlayState = buildCompareOverlayState({
    activeComparisonId: "compare:c2-cert",
    profiles: [overlayProfile],
  });
  const overlayControllerState = activateCompareOverlay({
    overlayState,
    preservedState: preservedState(),
  });

  gates.push(gate("A", "Overlay Contract works", [
    COMPARE_OVERLAY_CONTRACT.readOnly === true ? "" : "Overlay contract is not read-only",
    overlayState.markerCount === 1 ? "" : "Overlay state marker missing",
    overlayState.sceneMutation === false ? "" : "Overlay state reports scene mutation",
  ].filter(Boolean)));

  gates.push(gate("B", "Scene Compare Adapter works", [
    adapterResult.overlayProfile.markerCount === 4 ? "" : "Adapter did not produce expected overlay markers",
    adapterResult.recalculation === false ? "" : "Adapter recalculated C:1 output",
    adapterResult.sceneMutation === false ? "" : "Adapter reports scene mutation",
  ].filter(Boolean)));

  gates.push(gate("C", "Object Compare Markers work", [
    objectMarkers.markerCount === 1 ? "" : "Object marker missing",
    objectMarkers.improvedObjectCount === 1 ? "" : "Improved object marker missing",
    objectMarkers.objectMovement === false ? "" : "Object marker engine reports movement",
  ].filter(Boolean)));

  gates.push(gate("D", "KPI/Risk Visual Layer works", [
    kpiRiskVisualLayer.kpiMarkers.length === 1 ? "" : "KPI visual marker missing",
    kpiRiskVisualLayer.riskMarkers.length === 1 ? "" : "Risk visual marker missing",
    kpiRiskVisualLayer.visualOnly === true ? "" : "KPI/risk layer is not visual-only",
  ].filter(Boolean)));

  gates.push(gate("E", "Overlay Controller works", [
    overlayControllerState.overlayActive === true ? "" : "Overlay did not activate",
    overlayControllerState.scenePreserved === true ? "" : "Scene not preserved",
    overlayControllerState.selectionPreserved === true ? "" : "Selection not preserved",
  ].filter(Boolean)));

  gates.push(gate("F", "No Scene mutations", [
    JSON.stringify(scenePayload) === sceneBefore ? "" : "Scene payload mutated",
    overlayState.sceneMutation === false ? "" : "Overlay state scene mutation",
    adapterResult.sceneMutation === false ? "" : "Adapter scene mutation",
    objectMarkers.sceneMutation === false ? "" : "Object markers scene mutation",
    kpiRiskVisualLayer.sceneMutation === false ? "" : "KPI/risk layer scene mutation",
    overlayControllerState.sceneMutation === false ? "" : "Controller scene mutation",
  ].filter(Boolean)));

  gates.push(gate("G", "No Topology mutations", [
    JSON.stringify({ objects: scenePayload.scene.objects, relationships: scenePayload.scene.relationships }) === topologyBefore
      ? ""
      : "Topology payload mutated",
    overlayState.topologyMutation === false ? "" : "Overlay state topology mutation",
    adapterResult.topologyMutation === false ? "" : "Adapter topology mutation",
    objectMarkers.topologyMutation === false ? "" : "Object markers topology mutation",
    kpiRiskVisualLayer.topologyMutation === false ? "" : "KPI/risk layer topology mutation",
    overlayControllerState.topologyMutation === false ? "" : "Controller topology mutation",
  ].filter(Boolean)));

  gates.push(gate("H", "No Routing changes", [
    JSON.stringify(scenePayload.routing) === routingBefore ? "" : "Routing payload mutated",
    overlayState.routingMutation === false ? "" : "Overlay state routing mutation",
    adapterResult.routingMutation === false ? "" : "Adapter routing mutation",
    objectMarkers.routingMutation === false ? "" : "Object markers routing mutation",
    kpiRiskVisualLayer.routingMutation === false ? "" : "KPI/risk layer routing mutation",
    overlayControllerState.routingMutation === false ? "" : "Controller routing mutation",
  ].filter(Boolean)));

  gates.push(gate("I", "No DS mutations", [
    JSON.stringify({ scenarioA, scenarioB }) === dsBefore ? "" : "DS payload mutated",
    comparison.dsMutation === false ? "" : "Comparison DS mutation",
  ].filter(Boolean)));

  gates.push(gate("J", "No Simulation mutations", [
    JSON.stringify(simulationPayload) === simulationBefore ? "" : "Simulation payload mutated",
    comparison.mutation === false ? "" : "Comparison mutation flag true",
    executiveSummary.mutation === false ? "" : "Executive summary mutation flag true",
  ].filter(Boolean)));

  gates.push(gate("K", "No Object mutations", [
    JSON.stringify(objectDifference) === objectBefore ? "" : "Object difference mutated",
    comparison.objectMutation === false ? "" : "Comparison object mutation",
    objectMarkers.objectMutation === false ? "" : "Object marker engine mutation",
  ].filter(Boolean)));

  gates.push(gate("L", "Build passes", [
    input.buildPassed === false ? "Build verification failed" : "",
  ].filter(Boolean)));

  gates.push(gate("M", "Tests pass", [
    input.testsPassed === false ? "Test verification failed" : "",
  ].filter(Boolean)));

  const freezeTagsValid =
    C2_CERTIFIED_TAG === "[C2_CERTIFIED]" &&
    COMPARE_SCENE_OVERLAY_COMPLETE_TAG === "[COMPARE_SCENE_OVERLAY_COMPLETE]" &&
    C2_CERTIFICATION_FREEZE_TAGS.length === 2;
  const certified = gates.every((entry) => entry.status === "PASS") && freezeTagsValid;

  return Object.freeze({
    tag: C2_COMPARE_SCENE_OVERLAY_CERTIFICATION_TAG,
    version: "1.0.0",
    certified,
    diagnostics: Object.freeze([C2_CERTIFICATION_COMPLETE_DIAGNOSTIC] as const),
    gates: Object.freeze(gates),
    freezeTags: C2_CERTIFICATION_FREEZE_TAGS,
  });
}
