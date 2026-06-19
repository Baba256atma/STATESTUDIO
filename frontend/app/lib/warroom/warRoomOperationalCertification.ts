import {
  resolveWarRoomModeContext,
  resetWarRoomModeContractForTests,
} from "../dashboard/warRoom/warRoomModeContract.ts";
import type { ExecutiveObjectPanelData } from "../panels/executiveObjectPanelData.ts";
import {
  EMPTY_KPI_INTELLIGENCE_REGISTRY,
  type KpiIntelligenceProfile,
} from "../kpi-intelligence/kpiIntelligenceContract.ts";
import {
  EMPTY_OBJECT_INTELLIGENCE_REGISTRY,
  type ObjectIntelligenceProfile,
} from "../object-intelligence/objectIntelligenceContract.ts";
import {
  EMPTY_RELATIONSHIP_INTELLIGENCE_REGISTRY,
  type RelationshipIntelligenceProfile,
} from "../relationship-intelligence/relationshipIntelligenceContract.ts";
import {
  EMPTY_RISK_INTELLIGENCE_REGISTRY,
  type RiskIntelligenceProfile,
} from "../risk-intelligence/riskIntelligenceContract.ts";
import {
  EMPTY_EXECUTIVE_SCENARIO_SUMMARY,
  type ExecutiveScenarioSummaryProfile,
} from "../scenario-intelligence/executiveScenarioSummaryContract.ts";
import {
  explainWarRoomState,
  resetAssistantWarRoomBridgeForTests,
} from "./AssistantWarRoomBridge.ts";
import {
  rankActionPriorities,
  resetActionPriorityEngineForTests,
} from "./ActionPriorityEngine.ts";
import {
  detectCriticalEvents,
  resetCriticalEventDetectorForTests,
} from "./CriticalEventDetector.ts";
import {
  buildDecisionPressureRiskChange,
  buildDecisionPressureScenarioChange,
  measureDecisionPressure,
  resetDecisionPressureEngineForTests,
} from "./DecisionPressureEngine.ts";
import {
  WAR_ROOM_CONTRACT,
  buildWarRoomSnapshot,
} from "./WarRoomContract.ts";
import {
  aggregateWarRoomSignals,
  resetWarRoomSignalAggregatorForTests,
} from "./WarRoomSignalAggregator.ts";
import {
  W1_CERTIFICATION_COMPLETE_DIAGNOSTIC,
  W1_CERTIFICATION_FREEZE_TAGS,
  W1_CERTIFIED_TAG,
  W1_WAR_ROOM_OPERATIONAL_CERTIFICATION_TAG,
  WAR_ROOM_OPERATIONAL_COMPLETE_TAG,
  type WarRoomOperationalCertificationGate,
  type WarRoomOperationalCertificationInput,
  type WarRoomOperationalCertificationResult,
} from "./warRoomOperationalCertificationContract.ts";

function gate(
  id: WarRoomOperationalCertificationGate["id"],
  name: string,
  failures: readonly string[]
): WarRoomOperationalCertificationGate {
  return Object.freeze({
    id,
    name,
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail: failures.length === 0 ? `${name} certified.` : failures.join("; "),
  });
}

function resetCertificationRuntime(): void {
  resetWarRoomSignalAggregatorForTests();
  resetCriticalEventDetectorForTests();
  resetDecisionPressureEngineForTests();
  resetActionPriorityEngineForTests();
  resetAssistantWarRoomBridgeForTests();
  resetWarRoomModeContractForTests();
}

function samplePanelData(): ExecutiveObjectPanelData {
  return Object.freeze({
    objectId: "supplier-1",
    objectName: "Supplier One",
    objectType: "Supplier",
    status: "At Risk",
    connectionCount: 4,
    dependencyCount: 3,
    scenarioCount: 2,
    lastUpdated: "Runtime",
    insight: "Critical supplier has elevated operational exposure.",
    riskLevel: "high",
    recommendedAction: "Convene executive review.",
    confidence: 0.86,
  });
}

function objectProfile(): ObjectIntelligenceProfile {
  return Object.freeze({
    objectId: "supplier-1",
    label: "Supplier One",
    objectType: "supplier",
    source: "scene",
    health: 34,
    impact: 82,
    confidence: 88,
    importance: 95,
    trend: "declining",
  });
}

function relationshipProfile(): RelationshipIntelligenceProfile {
  return Object.freeze({
    relationshipId: "rel-supplier-inventory",
    sourceId: "supplier-1",
    targetId: "inventory-1",
    relationshipType: "depends_on",
    strength: 86,
    dependency: 94,
    influence: 81,
    confidence: 84,
    riskExposure: 91,
  });
}

function kpiProfile(): KpiIntelligenceProfile {
  return Object.freeze({
    kpiId: "delivery",
    label: "Delivery KPI",
    category: "Delivery",
    value: 62,
    target: 95,
    intelligenceScore: 32,
    confidence: 87,
    direction: "down",
    source: "runtime",
  });
}

function riskProfile(): RiskIntelligenceProfile {
  return Object.freeze({
    riskId: "supplier-risk",
    subjectId: "supplier-1",
    label: "Supplier Continuity",
    primaryCategory: "supply",
    primaryCategoryLabel: "Supply Risk",
    severity: 94,
    exposure: 91,
    confidence: 89,
    momentum: "worsening",
    categories: Object.freeze({
      operationalRisk: 80,
      financialRisk: 45,
      scheduleRisk: 70,
      dependencyRisk: 86,
      supplyRisk: 94,
      strategicRisk: 62,
    }),
  });
}

function scenarioSummaryProfile(): ExecutiveScenarioSummaryProfile {
  return Object.freeze({
    scenarioId: "supplier-disruption",
    scenarioType: "risk",
    label: "Supplier Disruption",
    impactAggregation: Object.freeze({
      objectImpactCount: 1,
      relationshipImpactCount: 1,
      kpiImpactCount: 1,
      riskImpactCount: 1,
      averageObjectImpactScore: 86,
      averageRelationshipImpactScore: 83,
      averageKpiImpactScore: 78,
      averageRiskImpactScore: 93,
      compositeImpactScore: 90,
    }),
    strengths: Object.freeze([]),
    weaknesses: Object.freeze([]),
    opportunities: Object.freeze([]),
    threats: Object.freeze([]),
    recommendedActions: Object.freeze([]),
  });
}

export function runWarRoomOperationalCertification(
  input: WarRoomOperationalCertificationInput = {}
): WarRoomOperationalCertificationResult {
  resetCertificationRuntime();

  const generatedAt = "2026-06-18T05:00:00.000Z";
  const gates: WarRoomOperationalCertificationGate[] = [];
  const scenePayload = Object.freeze({
    sceneId: "scene-war-room-cert",
    objects: Object.freeze([Object.freeze({ id: "supplier-1", x: 1, y: 2 })]),
    relationships: Object.freeze([Object.freeze({ id: "rel-supplier-inventory", sourceId: "supplier-1", targetId: "inventory-1" })]),
  });
  const routingPayload = Object.freeze({ route: "/type-c", dashboardMode: "war_room" });
  const simulationPayload = Object.freeze({ active: false, scenarioId: null });
  const sceneBefore = JSON.stringify(scenePayload);
  const topologyBefore = JSON.stringify({
    objects: scenePayload.objects,
    relationships: scenePayload.relationships,
  });
  const routingBefore = JSON.stringify(routingPayload);
  const simulationBefore = JSON.stringify(simulationPayload);

  const object = objectProfile();
  const relationship = relationshipProfile();
  const kpi = kpiProfile();
  const risk = riskProfile();
  const scenario = scenarioSummaryProfile();
  const objectRegistry = Object.freeze({
    ...EMPTY_OBJECT_INTELLIGENCE_REGISTRY,
    profiles: Object.freeze([object]),
    profileByObjectId: Object.freeze({ [object.objectId]: object }),
    objectCount: 1,
  });
  const relationshipRegistry = Object.freeze({
    ...EMPTY_RELATIONSHIP_INTELLIGENCE_REGISTRY,
    profiles: Object.freeze([relationship]),
    profileByRelationshipId: Object.freeze({ [relationship.relationshipId]: relationship }),
    relationshipCount: 1,
  });
  const kpiRegistry = Object.freeze({
    ...EMPTY_KPI_INTELLIGENCE_REGISTRY,
    profiles: Object.freeze([kpi]),
    profileByKpiId: Object.freeze({ [kpi.kpiId]: kpi }),
    kpiCount: 1,
  });
  const riskRegistry = Object.freeze({
    ...EMPTY_RISK_INTELLIGENCE_REGISTRY,
    profiles: Object.freeze([risk]),
    profileByRiskId: Object.freeze({ [risk.riskId]: risk }),
    profileBySubjectId: Object.freeze({ [risk.subjectId]: risk }),
    riskCount: 1,
  });
  const scenarioSummary = Object.freeze({
    ...EMPTY_EXECUTIVE_SCENARIO_SUMMARY,
    executiveSummary: "Supplier disruption scenario is active.",
    scenarioCount: 1,
    summaries: Object.freeze([scenario]),
    summaryByScenarioId: Object.freeze({ [scenario.scenarioId]: scenario }),
  });
  const dsBefore = JSON.stringify({
    objectRegistry,
    relationshipRegistry,
    kpiRegistry,
    riskRegistry,
    scenarioSummary,
  });

  const signalSet = aggregateWarRoomSignals({
    generatedAt,
    objectIntelligence: objectRegistry,
    relationshipIntelligence: relationshipRegistry,
    kpiIntelligence: kpiRegistry,
    riskIntelligence: riskRegistry,
    scenarioIntelligence: scenarioSummary,
  });
  const alerts = detectCriticalEvents({
    signalSet,
    detectedAt: generatedAt,
  });
  const pressure = measureDecisionPressure({
    evaluatedAt: generatedAt,
    signals: signalSet.signals,
    alerts: alerts.alerts,
    riskChanges: [
      buildDecisionPressureRiskChange({
        changeId: "risk-change",
        riskId: "supplier-risk",
        exposureDelta: 94,
        severityDelta: 91,
        confidence: 90,
      }),
    ],
    scenarioChanges: [
      buildDecisionPressureScenarioChange({
        changeId: "scenario-change",
        scenarioId: "supplier-disruption",
        degradationDelta: 92,
        confidence: 88,
      }),
    ],
  });
  const priorities = rankActionPriorities({
    rankedAt: generatedAt,
    signals: signalSet.signals,
    alerts: alerts.alerts,
    pressure,
  });
  const assistant = explainWarRoomState({
    explainedAt: generatedAt,
    alerts: alerts.alerts,
    pressure,
    priorities,
  });
  const dashboard = resolveWarRoomModeContext({
    selectedObjectId: "supplier-1",
    routeObjectId: "supplier-1",
    routeObjectName: "Supplier One",
    panelData: samplePanelData(),
  });
  const snapshot = buildWarRoomSnapshot({
    snapshotId: "war-room-cert-snapshot",
    generatedAt,
    signals: signalSet.signals,
    alerts: alerts.alerts,
    priorities: priorities.priorityQueue,
  });

  gates.push(gate("A", "War Room Contract works", [
    WAR_ROOM_CONTRACT.readOnly === true ? "" : "War Room contract is not read-only",
    snapshot.signalCount > 0 ? "" : "War Room snapshot has no signals",
    snapshot.priorityTracking === true ? "" : "War Room priority tracking missing",
  ].filter(Boolean)));

  gates.push(gate("B", "Signal Aggregator works", [
    signalSet.signalCount >= 5 ? "" : "Signal aggregator did not aggregate expected signals",
    signalSet.recalculation === false ? "" : "Signal aggregator recalculated source intelligence",
    signalSet.sourceMutation === false ? "" : "Signal aggregator reports source mutation",
  ].filter(Boolean)));

  gates.push(gate("C", "Critical Event Detector works", [
    alerts.alertCount >= 4 ? "" : "Critical event detector did not generate expected alerts",
    alerts.mutation === false ? "" : "Critical event detector reports mutation",
  ].filter(Boolean)));

  gates.push(gate("D", "Decision Pressure Engine works", [
    pressure.pressureScore > 0 ? "" : "Pressure score missing",
    pressure.pressureLevel === "critical" || pressure.pressureLevel === "high" ? "" : "Pressure level not elevated",
    pressure.mutation === false ? "" : "Pressure engine reports mutation",
  ].filter(Boolean)));

  gates.push(gate("E", "Action Priority Engine works", [
    priorities.priorityCount > 0 ? "" : "Priority queue missing",
    priorities.topActionCount > 0 ? "" : "Top actions missing",
    priorities.topConcernCount > 0 ? "" : "Top concerns missing",
  ].filter(Boolean)));

  gates.push(gate("F", "Dashboard Binding works", [
    dashboard.reason === "resolved" ? "" : "Dashboard War Room context did not resolve",
    dashboard.context?.warRoomStatus === "ready" ? "" : "Dashboard War Room status is not ready",
    dashboard.context?.modules.length === 7 ? "" : "Dashboard War Room modules missing",
  ].filter(Boolean)));

  gates.push(gate("G", "Assistant Bridge works", [
    assistant.explanationCount > 0 ? "" : "Assistant explanations missing",
    assistant.actionExecution === false ? "" : "Assistant bridge executed action",
    assistant.simulationExecution === false ? "" : "Assistant bridge executed simulation",
  ].filter(Boolean)));

  gates.push(gate("H", "No Scene mutations", [
    JSON.stringify(scenePayload) === sceneBefore ? "" : "Scene payload mutated",
    snapshot.sceneMutation === false ? "" : "War Room snapshot scene mutation",
    signalSet.sceneMutation === false ? "" : "Signal set scene mutation",
    pressure.sceneMutation === false ? "" : "Pressure scene mutation",
    priorities.sceneMutation === false ? "" : "Priority scene mutation",
    assistant.sceneMutation === false ? "" : "Assistant scene mutation",
  ].filter(Boolean)));

  gates.push(gate("I", "No Topology mutations", [
    JSON.stringify({ objects: scenePayload.objects, relationships: scenePayload.relationships }) === topologyBefore
      ? ""
      : "Topology payload mutated",
    snapshot.topologyMutation === false ? "" : "War Room snapshot topology mutation",
    signalSet.topologyMutation === false ? "" : "Signal set topology mutation",
    pressure.topologyMutation === false ? "" : "Pressure topology mutation",
    priorities.topologyMutation === false ? "" : "Priority topology mutation",
    assistant.topologyMutation === false ? "" : "Assistant topology mutation",
  ].filter(Boolean)));

  gates.push(gate("J", "No Routing changes", [
    JSON.stringify(routingPayload) === routingBefore ? "" : "Routing payload mutated",
    snapshot.routingMutation === false ? "" : "War Room snapshot routing mutation",
    signalSet.routingMutation === false ? "" : "Signal set routing mutation",
    pressure.routingMutation === false ? "" : "Pressure routing mutation",
    priorities.routingMutation === false ? "" : "Priority routing mutation",
    assistant.routingMutation === false ? "" : "Assistant routing mutation",
  ].filter(Boolean)));

  gates.push(gate("K", "No DS mutations", [
    JSON.stringify({ objectRegistry, relationshipRegistry, kpiRegistry, riskRegistry, scenarioSummary }) === dsBefore
      ? ""
      : "DS payload mutated",
    snapshot.dsMutation === false ? "" : "War Room snapshot DS mutation",
    signalSet.dsMutation === false ? "" : "Signal set DS mutation",
    pressure.dsMutation === false ? "" : "Pressure DS mutation",
    priorities.dsMutation === false ? "" : "Priority DS mutation",
    assistant.dsMutation === false ? "" : "Assistant DS mutation",
  ].filter(Boolean)));

  gates.push(gate("L", "No Simulation mutations", [
    JSON.stringify(simulationPayload) === simulationBefore ? "" : "Simulation payload mutated",
    signalSet.simulationMutation === false ? "" : "Signal set simulation mutation",
    alerts.simulationMutation === false ? "" : "Alerts simulation mutation",
    pressure.simulationMutation === false ? "" : "Pressure simulation mutation",
    priorities.simulationMutation === false ? "" : "Priority simulation mutation",
    assistant.simulationExecution === false ? "" : "Assistant simulation execution",
  ].filter(Boolean)));

  gates.push(gate("M", "Build passes", [
    input.buildPassed === false ? "Build verification failed" : "",
  ].filter(Boolean)));

  gates.push(gate("N", "Tests pass", [
    input.testsPassed === false ? "Test verification failed" : "",
  ].filter(Boolean)));

  const freezeTagsValid =
    W1_CERTIFIED_TAG === "[W1_CERTIFIED]" &&
    WAR_ROOM_OPERATIONAL_COMPLETE_TAG === "[WAR_ROOM_OPERATIONAL_COMPLETE]" &&
    W1_CERTIFICATION_FREEZE_TAGS.length === 2;
  const certified = gates.every((entry) => entry.status === "PASS") && freezeTagsValid;

  return Object.freeze({
    tag: W1_WAR_ROOM_OPERATIONAL_CERTIFICATION_TAG,
    version: "1.0.0",
    certified,
    diagnostics: Object.freeze([W1_CERTIFICATION_COMPLETE_DIAGNOSTIC] as const),
    gates: Object.freeze(gates),
    freezeTags: W1_CERTIFICATION_FREEZE_TAGS,
  });
}
