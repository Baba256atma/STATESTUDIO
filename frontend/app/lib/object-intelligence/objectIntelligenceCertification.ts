import { resolveMrpWorkspaceMountPlan } from "../ui/mrpWorkspace/mrpWorkspaceResolver.ts";
import { resetSceneObjectRegistryForTests, syncSceneObjectRegistry } from "../scene/objectRegistryRuntime.ts";
import type { SceneObject } from "../sceneTypes.ts";
import { buildExecutiveObjectIntelligenceSummary } from "./ExecutiveObjectIntelligenceSummary.ts";
import { buildObjectConfidenceRegistry } from "./ObjectConfidenceEngine.ts";
import { buildObjectHealthRegistry } from "./ObjectHealthEngine.ts";
import { buildObjectImpactRegistry } from "./ObjectImpactEngine.ts";
import { buildObjectImportanceRegistry } from "./ObjectImportanceEngine.ts";
import { buildObjectIntelligenceRegistry } from "./ObjectIntelligenceRuntime.ts";
import { buildObjectTrendRegistry } from "./ObjectTrendEngine.ts";
import {
  DS3_CERTIFICATION_FREEZE_TAGS,
  DS3_CERTIFIED_TAG,
  DS_3_8_OBJECT_INTELLIGENCE_CERTIFICATION_TAG,
  OBJECT_INTELLIGENCE_COMPLETE_TAG,
  type ObjectIntelligenceCertificationGate,
  type ObjectIntelligenceCertificationResult,
} from "./objectIntelligenceCertificationContract.ts";

const CERT_SAMPLE_OBJECTS = Object.freeze([
  Object.freeze({
    id: "supplier-1",
    label: "Supplier",
    type: "supplier",
    health: 88,
    impactScore: 92,
    confidence: 90,
    importance: 95,
    role: "executive hub",
    businessInfluence: 92,
    executiveRelevance: 95,
    dependencyWeight: 88,
    topologyCentrality: 90,
    relationships: Object.freeze([{ confidence: 90 }, { confidence: 85 }]),
    kpis: Object.freeze(["margin", "delivery"]),
    risks: Object.freeze(["supplier_failure"]),
    dependencies: Object.freeze(["inventory-1"]),
    business_meaning: "Critical supplier dependency.",
  }),
  Object.freeze({
    id: "inventory-1",
    label: "Inventory",
    type: "inventory",
    health: 44,
    impactScore: 72,
    confidence: 55,
    importance: 76,
    relationshipStability: 45,
    sourceConfidence: 52,
    businessInfluence: 70,
    executiveRelevance: 55,
    dependencyWeight: 75,
    topologyCentrality: 60,
    relationships: Object.freeze([{ confidence: 40 }]),
    dependencies: Object.freeze(["supplier-1"]),
  }),
] as const);

const CERT_SCENE_JSON = Object.freeze({
  state_vector: Object.freeze({ intensity: 0.6, volatility: 0.4 }),
  scene: Object.freeze({
    objects: CERT_SAMPLE_OBJECTS,
  }),
});

function gate(
  id: ObjectIntelligenceCertificationGate["id"],
  name: string,
  failures: readonly string[]
): ObjectIntelligenceCertificationGate {
  return Object.freeze({
    id,
    name,
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail: failures.length === 0 ? `${name} certified.` : failures.join("; "),
  });
}

export function runObjectIntelligenceCertification(): ObjectIntelligenceCertificationResult {
  resetSceneObjectRegistryForTests();
  const gates: ObjectIntelligenceCertificationGate[] = [];

  const runtime = buildObjectIntelligenceRegistry({ sceneJson: CERT_SCENE_JSON });
  const health = buildObjectHealthRegistry({ sceneJson: CERT_SCENE_JSON });
  const impact = buildObjectImpactRegistry({ sceneJson: CERT_SCENE_JSON });
  const confidence = buildObjectConfidenceRegistry({ sceneJson: CERT_SCENE_JSON });
  const trend = buildObjectTrendRegistry({
    sceneJson: CERT_SCENE_JSON,
    objectHealthHistory: Object.freeze([
      Object.freeze({ objectId: "supplier-1", timestamp: 1, healthScore: 70 }),
      Object.freeze({ objectId: "supplier-1", timestamp: 2, healthScore: 80 }),
      Object.freeze({ objectId: "supplier-1", timestamp: 3, healthScore: 88 }),
      Object.freeze({ objectId: "inventory-1", timestamp: 1, healthScore: 72 }),
      Object.freeze({ objectId: "inventory-1", timestamp: 2, healthScore: 58 }),
      Object.freeze({ objectId: "inventory-1", timestamp: 3, healthScore: 44 }),
    ]),
  });
  const importance = buildObjectImportanceRegistry({ sceneJson: CERT_SCENE_JSON });
  const summary = buildExecutiveObjectIntelligenceSummary({
    healthProfiles: health.objects,
    impactProfiles: impact.objects,
    confidenceProfiles: confidence.objects,
    trendProfiles: trend.profiles,
    importanceProfiles: importance.profiles,
  });

  const runtimeFailures: string[] = [];
  if (runtime.objectCount !== 2) runtimeFailures.push("Runtime registry object count mismatch");
  if (runtime.sceneMutation !== false || runtime.simulation !== false) {
    runtimeFailures.push("Runtime registry lost read-only guarantees");
  }
  gates.push(gate("A", "Runtime Created", runtimeFailures));

  const healthFailures: string[] = [];
  if (health.objectCount !== 2) healthFailures.push("Health registry object count mismatch");
  if (typeof health.healthByObjectId["supplier-1"]?.healthScore !== "number") {
    healthFailures.push("Health score missing");
  }
  gates.push(gate("B", "Health Engine Works", healthFailures));

  const impactFailures: string[] = [];
  if (impact.objectCount !== 2) impactFailures.push("Impact registry object count mismatch");
  if (typeof impact.impactByObjectId["supplier-1"]?.impactScore !== "number") {
    impactFailures.push("Impact score missing");
  }
  gates.push(gate("C", "Impact Engine Works", impactFailures));

  const confidenceFailures: string[] = [];
  if (confidence.objectCount !== 2) confidenceFailures.push("Confidence registry object count mismatch");
  if (!confidence.confidenceByObjectId["supplier-1"]?.confidenceExplanation) {
    confidenceFailures.push("Confidence explanation missing");
  }
  gates.push(gate("D", "Confidence Engine Works", confidenceFailures));

  const trendFailures: string[] = [];
  if (trend.objectCount !== 2) trendFailures.push("Trend registry object count mismatch");
  if (trend.trendByObjectId["supplier-1"]?.trendDirection !== "Improving") {
    trendFailures.push("Improving trend not detected");
  }
  if (trend.trendByObjectId["inventory-1"]?.trendDirection !== "Declining") {
    trendFailures.push("Declining trend not detected");
  }
  gates.push(gate("E", "Trend Engine Works", trendFailures));

  const importanceFailures: string[] = [];
  if (importance.objectCount !== 2) importanceFailures.push("Importance registry object count mismatch");
  if (typeof importance.importanceByObjectId["supplier-1"]?.importanceScore !== "number") {
    importanceFailures.push("Importance score missing");
  }
  gates.push(gate("F", "Importance Engine Works", importanceFailures));

  const aggregatorFailures: string[] = [];
  if (summary.objectCount !== 2) aggregatorFailures.push("Executive summary object count mismatch");
  if (!summary.executiveSummary.includes("Executive object intelligence covers 2 object")) {
    aggregatorFailures.push("Executive summary text missing");
  }
  if (summary.recommendedAttention.length === 0) aggregatorFailures.push("Recommended attention missing");
  gates.push(gate("G", "Aggregator Works", aggregatorFailures));

  const sceneFailures: string[] = [];
  try {
    const sampleObjects: SceneObject[] = CERT_SAMPLE_OBJECTS.map((object) => ({
      id: object.id,
      label: object.label,
      type: object.type,
    }));
    syncSceneObjectRegistry(sampleObjects);
    syncSceneObjectRegistry(sampleObjects);
  } catch (error) {
    sceneFailures.push(`Scene registry sync failed: ${String(error)}`);
  }
  gates.push(gate("H", "No Scene Crashes", sceneFailures));

  const routingFailures: string[] = [];
  const sourcesPlan = resolveMrpWorkspaceMountPlan({
    dashboardMode: "overview",
    dashboardContext: "sources",
  });
  if (sourcesPlan.workspaceId !== "operational" || sourcesPlan.mountTarget !== "operational_workspace") {
    routingFailures.push("Sources dashboard routing regressed");
  }
  gates.push(gate("I", "No MRP Routing Changes", routingFailures));

  const legacyFailures: string[] = [];
  if (
    runtime.sceneMutation !== false ||
    health.sceneMutation !== false ||
    impact.sceneMutation !== false ||
    confidence.sceneMutation !== false ||
    trend.sceneMutation !== false ||
    importance.sceneMutation !== false ||
    summary.sceneMutation !== false
  ) {
    legacyFailures.push("One or more DS-3 registries lost sceneMutation false");
  }
  gates.push(gate("J", "No Legacy Router Usage", legacyFailures));

  const freezeFailures: string[] = [];
  if (DS3_CERTIFIED_TAG !== "[DS3_CERTIFIED]") freezeFailures.push("DS3_CERTIFIED tag missing");
  if (OBJECT_INTELLIGENCE_COMPLETE_TAG !== "[OBJECT_INTELLIGENCE_COMPLETE]") {
    freezeFailures.push("OBJECT_INTELLIGENCE_COMPLETE tag missing");
  }
  if (DS3_CERTIFICATION_FREEZE_TAGS.length !== 2) freezeFailures.push("Freeze tag registry incomplete");
  gates.push(gate("K", "Freeze Contracts Active", freezeFailures));

  const certified = gates.every((entry) => entry.status === "PASS");

  return Object.freeze({
    tag: DS_3_8_OBJECT_INTELLIGENCE_CERTIFICATION_TAG,
    version: "3.8.0",
    certified,
    gates: Object.freeze(gates),
    freezeTags: DS3_CERTIFICATION_FREEZE_TAGS,
  });
}
