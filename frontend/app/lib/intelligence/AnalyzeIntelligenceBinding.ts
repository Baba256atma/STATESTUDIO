import { buildAnalyzeIntelligenceProfile } from "./AnalyzeIntelligenceProfile.ts";
import { buildExecutiveIntelligenceSnapshot } from "./ExecutiveIntelligenceAdapter.ts";
import {
  ANALYZE_BINDING_DIAGNOSTICS,
  ANALYZE_INTELLIGENCE_BINDING_VERSION,
  EMPTY_ANALYZE_INTELLIGENCE_BINDING_RESULT,
  type AnalyzeIntelligenceBindingBuildInput,
  type AnalyzeIntelligenceBindingResult,
  type AnalyzeIntelligenceBindingView,
} from "./analyzeIntelligenceBindingContract.ts";
import type { AnalyzeIntelligenceProfile } from "./analyzeIntelligenceProfileContract.ts";
import type { ExecutiveIntelligenceSnapshot } from "./executiveIntelligenceSnapshotContract.ts";
import type { ExecutiveObjectIntelligenceProfile } from "../object-intelligence/executiveObjectIntelligenceSummaryContract.ts";

let latestAnalyzeIntelligenceBindingResult: AnalyzeIntelligenceBindingResult =
  EMPTY_ANALYZE_INTELLIGENCE_BINDING_RESULT;

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function collectBindingInput(input: AnalyzeIntelligenceBindingBuildInput) {
  return Object.freeze({
    sceneJson: input.sceneJson,
    objects: input.objects ?? input.sceneObjects,
    relationships: input.relationships,
    kpis: input.kpis,
    risks: input.risks,
    sceneObjects: input.sceneObjects,
    dataSourceObjects: input.dataSourceObjects,
    dataSourceKpis: input.dataSourceKpis,
    historicalSnapshots: input.historicalSnapshots,
    selectedObjectId: input.selectedObjectId ?? input.objectId,
  });
}

function adapterLayerCount(snapshot: ExecutiveIntelligenceSnapshot): number {
  return [
    snapshot.objectIntelligence.objectCount > 0,
    snapshot.relationshipIntelligence.relationshipCount > 0,
    snapshot.kpiIntelligence.kpiCount > 0,
    snapshot.riskIntelligence.profiles.length > 0,
    snapshot.scenarioIntelligence.scenarioCount > 0,
  ].filter(Boolean).length;
}

function objectProfileFromSnapshot(
  snapshot: ExecutiveIntelligenceSnapshot,
  objectId: string
): ExecutiveObjectIntelligenceProfile | undefined {
  return snapshot.objectIntelligence.profiles.find((entry) => entry.objectId === objectId);
}

function trendLabelFor(
  objectProfile: ExecutiveObjectIntelligenceProfile | undefined,
  profile: AnalyzeIntelligenceProfile
): string {
  const direction = objectProfile?.trend?.trendDirection;
  if (direction === "Improving") return "Improving";
  if (direction === "Declining") return "Declining";
  if (direction === "Volatile") return "Volatile";
  if (direction === "Stable") return "Stable";
  if (profile.trend.improvingCount > profile.trend.decliningCount) return "Improving";
  if (profile.trend.decliningCount > profile.trend.improvingCount) return "Declining";
  if (profile.trend.volatileCount > 0) return "Volatile";
  return "Stable";
}

function buildBindingView(
  objectId: string,
  objectName: string,
  profile: AnalyzeIntelligenceProfile,
  objectProfile: ExecutiveObjectIntelligenceProfile | undefined,
  snapshot: ExecutiveIntelligenceSnapshot
): AnalyzeIntelligenceBindingView {
  const objectRiskProfile = snapshot.riskIntelligence.profiles.find(
    (entry) => entry.nodeId === objectId && entry.nodeKind === "object"
  );

  const healthScore = clampScore(objectProfile?.health?.healthScore ?? profile.health.score);
  const impactScore = clampScore(objectProfile?.impact?.impactScore ?? profile.impact.score);
  const importanceScore = clampScore(
    objectProfile?.importance?.importanceScore ?? profile.importance.score
  );
  const riskScore = clampScore(objectRiskProfile?.riskScore ?? profile.risk.score);

  const trendSummary = objectProfile?.trend
    ? `Object ${objectId} trend ${objectProfile.trend.trendDirection} with strength ${objectProfile.trend.trendStrength}.`
    : profile.trend.summary;
  const trendLabel = trendLabelFor(objectProfile, profile);

  return Object.freeze({
    objectId,
    objectName,
    healthScore,
    impactScore,
    trendLabel,
    trendSummary,
    importanceScore,
    riskScore,
    scenarioSummary: profile.scenarioSummary.summary,
    intelligenceSummary: [`Analyze binding for ${objectName}.`, profile.analyzeSummary].join(" "),
    bindingStatus: "bound",
    bindingReady: true,
  });
}

export function resolveAnalyzeIntelligenceBinding(
  input: AnalyzeIntelligenceBindingBuildInput
): AnalyzeIntelligenceBindingResult {
  const objectId = input.objectId?.trim() || input.selectedObjectId?.trim() || null;
  if (!objectId) {
    latestAnalyzeIntelligenceBindingResult = EMPTY_ANALYZE_INTELLIGENCE_BINDING_RESULT;
    return latestAnalyzeIntelligenceBindingResult;
  }

  const objectName = input.objectName?.trim() || objectId;
  const bindingInput = collectBindingInput({ ...input, objectId });
  const snapshot = buildExecutiveIntelligenceSnapshot(bindingInput);
  const layerCount = adapterLayerCount(snapshot);

  const profile =
    input.profile ??
    buildAnalyzeIntelligenceProfile({
      ...bindingInput,
      snapshot,
    });

  if (profile.profileId === "analyze-intelligence:none" || layerCount === 0) {
    const result = Object.freeze({
      version: ANALYZE_INTELLIGENCE_BINDING_VERSION,
      objectId,
      objectName,
      view: null,
      profile: null,
      adapterLayerCount: layerCount,
      bindingStatus: "missing_intelligence" as const,
      readOnly: true as const,
      sceneMutation: false as const,
      objectMutation: false as const,
      routingMutation: false as const,
      mrpMutation: false as const,
      simulationActive: false as const,
      diagnostics: ANALYZE_BINDING_DIAGNOSTICS,
    });
    latestAnalyzeIntelligenceBindingResult = result;
    return result;
  }

  const objectProfile = objectProfileFromSnapshot(snapshot, objectId);
  const view = buildBindingView(objectId, objectName, profile, objectProfile, snapshot);

  const result = Object.freeze({
    version: ANALYZE_INTELLIGENCE_BINDING_VERSION,
    objectId,
    objectName,
    view,
    profile,
    adapterLayerCount: layerCount,
    bindingStatus: "bound" as const,
    readOnly: true as const,
    sceneMutation: false as const,
    objectMutation: false as const,
    routingMutation: false as const,
    mrpMutation: false as const,
    simulationActive: false as const,
    diagnostics: ANALYZE_BINDING_DIAGNOSTICS,
  });

  latestAnalyzeIntelligenceBindingResult = result;
  return result;
}

export function getAnalyzeIntelligenceBindingResult(): AnalyzeIntelligenceBindingResult {
  return latestAnalyzeIntelligenceBindingResult;
}

export function resetAnalyzeIntelligenceBindingForTests(): void {
  latestAnalyzeIntelligenceBindingResult = EMPTY_ANALYZE_INTELLIGENCE_BINDING_RESULT;
}

export const AnalyzeIntelligenceBinding = Object.freeze({
  resolveAnalyzeIntelligenceBinding,
  getAnalyzeIntelligenceBindingResult,
  resetAnalyzeIntelligenceBindingForTests,
});
