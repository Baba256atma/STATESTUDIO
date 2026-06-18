import { buildExecutiveObjectIntelligenceSummary } from "../object-intelligence/ExecutiveObjectIntelligenceSummary.ts";
import { buildObjectRiskRegistry } from "../risk-intelligence/ObjectRiskEngine.ts";
import {
  EMPTY_OBJECT_EXPLANATION_REGISTRY,
  OBJECT_EXPLANATION_ENGINE_DIAGNOSTICS,
  OBJECT_EXPLANATION_ENGINE_VERSION,
  type ExecutiveObjectExplanation,
  type ObjectExplanationEngineBuildInput,
  type ObjectExplanationRegistry,
} from "./objectExplanationEngineContract.ts";
import type { ExecutiveObjectIntelligenceProfile } from "../object-intelligence/executiveObjectIntelligenceSummaryContract.ts";
import type { ObjectRiskProfile } from "../risk-intelligence/objectRiskContract.ts";

let latestObjectExplanationRegistry: ObjectExplanationRegistry = EMPTY_OBJECT_EXPLANATION_REGISTRY;

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function resolveObjectLabels(input: ObjectExplanationEngineBuildInput): Readonly<Record<string, string>> {
  const labels: Record<string, string> = {};
  const objects =
    input.sceneObjects ??
    (input.sceneJson as { scene?: { objects?: unknown[] } } | null)?.scene?.objects ??
    [];

  if (!Array.isArray(objects)) {
    return Object.freeze(labels);
  }

  objects.forEach((entry, index) => {
    if (!entry || typeof entry !== "object") return;
    const record = entry as Record<string, unknown>;
    const objectId =
      readString(record.objectId) ||
      readString(record.id) ||
      readString(record.name) ||
      `object-${index + 1}`;
    const label = readString(record.label) || readString(record.name) || objectId;
    labels[objectId] = label;
  });

  return Object.freeze(labels);
}

function resolveLabel(
  profile: ExecutiveObjectIntelligenceProfile,
  labels: Readonly<Record<string, string>>
): string {
  return labels[profile.objectId] ?? profile.objectId;
}

function healthExplanation(profile: ExecutiveObjectIntelligenceProfile, label: string): string {
  const health = profile.health;
  if (!health) return `${label}: object health intelligence is not available.`;
  return `${label} health is ${health.healthState} with score ${health.healthScore}.`;
}

function impactExplanation(profile: ExecutiveObjectIntelligenceProfile, label: string): string {
  const impact = profile.impact;
  if (!impact) return `${label}: object impact intelligence is not available.`;
  return `${label} impact is ${impact.impactLevel} with score ${impact.impactScore}.`;
}

function trendExplanation(profile: ExecutiveObjectIntelligenceProfile, label: string): string {
  const trend = profile.trend;
  if (!trend) return `${label}: object trend intelligence is not available.`;
  const reasoning = trend.trendReasoning[0];
  return reasoning
    ? `${label} trend is ${trend.trendDirection} with strength ${trend.trendStrength}. ${reasoning}`
    : `${label} trend is ${trend.trendDirection} with strength ${trend.trendStrength}.`;
}

function importanceExplanation(profile: ExecutiveObjectIntelligenceProfile, label: string): string {
  const importance = profile.importance;
  if (!importance) return `${label}: object importance intelligence is not available.`;
  const reasoning = importance.importanceReasoning[0];
  return reasoning
    ? `${label} importance is ${importance.importanceLevel} with score ${importance.importanceScore}. ${reasoning}`
    : `${label} importance is ${importance.importanceLevel} with score ${importance.importanceScore}.`;
}

function riskExplanation(
  profile: ExecutiveObjectIntelligenceProfile,
  label: string,
  riskProfile: ObjectRiskProfile | undefined
): string {
  if (!riskProfile) {
    const connectedRisks = profile.impact?.impactFactors.connectedRisks ?? 0;
    return connectedRisks > 0
      ? `${label} risk exposure is linked to ${connectedRisks} connected risk signal(s).`
      : `${label}: object risk intelligence is not available.`;
  }
  const reasoning = riskProfile.riskReasoning[0];
  return reasoning
    ? `${label} risk is ${riskProfile.riskLevel} with score ${riskProfile.riskScore}. ${reasoning}`
    : `${label} risk is ${riskProfile.riskLevel} with score ${riskProfile.riskScore}.`;
}

function confidenceExplanation(profile: ExecutiveObjectIntelligenceProfile, label: string): string {
  const confidence = profile.confidence;
  if (!confidence) return `${label}: object confidence intelligence is not available.`;
  return `${label} confidence is ${confidence.confidenceScore}. ${confidence.confidenceExplanation}`;
}

function buildExecutiveSummary(explanation: Omit<ExecutiveObjectExplanation, "executiveSummary">): string {
  return [
    explanation.healthExplanation,
    explanation.impactExplanation,
    explanation.trendExplanation,
    explanation.importanceExplanation,
    explanation.riskExplanation,
    explanation.confidenceExplanation,
  ].join(" ");
}

function buildExplanation(
  profile: ExecutiveObjectIntelligenceProfile,
  label: string,
  riskProfile: ObjectRiskProfile | undefined
): ExecutiveObjectExplanation {
  const partial = Object.freeze({
    objectId: profile.objectId,
    label,
    healthExplanation: healthExplanation(profile, label),
    impactExplanation: impactExplanation(profile, label),
    trendExplanation: trendExplanation(profile, label),
    importanceExplanation: importanceExplanation(profile, label),
    riskExplanation: riskExplanation(profile, label, riskProfile),
    confidenceExplanation: confidenceExplanation(profile, label),
    executiveSummary: "",
  });

  return Object.freeze({
    ...partial,
    executiveSummary: buildExecutiveSummary(partial),
  });
}

function buildRegistrySummary(
  explanations: readonly ExecutiveObjectExplanation[],
  objectIntelligence: ReturnType<typeof buildExecutiveObjectIntelligenceSummary>
): string {
  return [
    "Executive object explanations ready for Assistant surfaces.",
    `${explanations.length} object explanation(s) generated from template-driven DS-3 intelligence.`,
    objectIntelligence.executiveSummary,
  ].join(" ");
}

export function buildObjectExplanationRegistry(
  input: ObjectExplanationEngineBuildInput = {}
): ObjectExplanationRegistry {
  const objectIntelligence =
    input.objectIntelligence ?? buildExecutiveObjectIntelligenceSummary(input);
  const riskRegistry = buildObjectRiskRegistry(input);
  const labels = resolveObjectLabels(input);

  if (objectIntelligence.objectCount === 0 || objectIntelligence.profiles.length === 0) {
    latestObjectExplanationRegistry = EMPTY_OBJECT_EXPLANATION_REGISTRY;
    return latestObjectExplanationRegistry;
  }

  const explanations = Object.freeze(
    objectIntelligence.profiles.map((profile) =>
      buildExplanation(profile, resolveLabel(profile, labels), riskRegistry.riskByObjectId[profile.objectId])
    )
  );

  const registry = Object.freeze({
    version: OBJECT_EXPLANATION_ENGINE_VERSION,
    explanationCount: explanations.length,
    explanations,
    executiveSummary: buildRegistrySummary(explanations, objectIntelligence),
    objectIntelligence,
    explanationReady: true as const,
    readOnly: true as const,
    sceneMutation: false as const,
    objectMutation: false as const,
    mrpMutation: false as const,
    routingMutation: false as const,
    topologyMutation: false as const,
    legacyRouterUsage: false as const,
    diagnostics: OBJECT_EXPLANATION_ENGINE_DIAGNOSTICS,
  });

  latestObjectExplanationRegistry = registry;
  return registry;
}

export function getObjectExplanationRegistry(): ObjectExplanationRegistry {
  return latestObjectExplanationRegistry;
}

export function resetObjectExplanationEngineForTests(): void {
  latestObjectExplanationRegistry = EMPTY_OBJECT_EXPLANATION_REGISTRY;
}

export const ObjectExplanationEngine = Object.freeze({
  buildObjectExplanationRegistry,
  getObjectExplanationRegistry,
  resetObjectExplanationEngineForTests,
});
