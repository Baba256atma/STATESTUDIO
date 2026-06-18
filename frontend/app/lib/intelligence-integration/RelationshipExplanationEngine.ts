import { buildExecutiveRelationshipSummary } from "../relationship-intelligence/ExecutiveRelationshipSummary.ts";
import {
  EMPTY_RELATIONSHIP_EXPLANATION_REGISTRY,
  RELATIONSHIP_EXPLANATION_ENGINE_DIAGNOSTICS,
  RELATIONSHIP_EXPLANATION_ENGINE_VERSION,
  type ExecutiveRelationshipExplanation,
  type RelationshipExplanationEngineBuildInput,
  type RelationshipExplanationRegistry,
} from "./relationshipExplanationEngineContract.ts";
import type { ExecutiveRelationshipSummaryProfile } from "../relationship-intelligence/executiveRelationshipSummaryContract.ts";

let latestRelationshipExplanationRegistry: RelationshipExplanationRegistry =
  EMPTY_RELATIONSHIP_EXPLANATION_REGISTRY;

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function resolveObjectLabels(input: RelationshipExplanationEngineBuildInput): Readonly<Record<string, string>> {
  const labels: Record<string, string> = {};
  const objects =
    input.objects ??
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
  profile: ExecutiveRelationshipSummaryProfile,
  labels: Readonly<Record<string, string>>
): string {
  const source = profile.sourceId ? labels[profile.sourceId] ?? profile.sourceId : "source";
  const target = profile.targetId ? labels[profile.targetId] ?? profile.targetId : "target";
  return `${source} → ${target}`;
}

function dependencyExplanation(profile: ExecutiveRelationshipSummaryProfile, label: string): string {
  const dependency = profile.dependency;
  if (!dependency) return `${label}: relationship dependency intelligence is not available.`;
  const reasoning = dependency.dependencyReasoning[0];
  return reasoning
    ? `${label} dependency is ${dependency.dependencyLevel} with score ${dependency.dependencyScore}. ${reasoning}`
    : `${label} dependency is ${dependency.dependencyLevel} with score ${dependency.dependencyScore}.`;
}

function influenceExplanation(profile: ExecutiveRelationshipSummaryProfile, label: string): string {
  const influence = profile.influence;
  const intelligenceInfluence = profile.intelligence?.influence;
  if (!influence && intelligenceInfluence == null) {
    return `${label}: relationship influence intelligence is not available.`;
  }
  if (influence) {
    const reasoning = influence.influenceReasoning[0];
    return reasoning
      ? `${label} influence is ${influence.influenceLevel} with score ${influence.influenceScore}. ${reasoning}`
      : `${label} influence is ${influence.influenceLevel} with score ${influence.influenceScore}.`;
  }
  return `${label} influence score is ${intelligenceInfluence} from relationship intelligence.`;
}

function strengthExplanation(profile: ExecutiveRelationshipSummaryProfile, label: string): string {
  const strength = profile.strength;
  if (!strength) return `${label}: relationship strength intelligence is not available.`;
  const reasoning = strength.strengthReasoning[0];
  return reasoning
    ? `${label} strength is ${strength.strengthLevel} with score ${strength.strengthScore}. ${reasoning}`
    : `${label} strength is ${strength.strengthLevel} with score ${strength.strengthScore}.`;
}

function riskExposureExplanation(profile: ExecutiveRelationshipSummaryProfile, label: string): string {
  const riskExposure = profile.riskExposure;
  if (!riskExposure) return `${label}: relationship risk exposure intelligence is not available.`;
  const reasoning = riskExposure.riskExposureReasoning[0];
  const riskTypes =
    riskExposure.riskTypes.length > 0 ? ` Risk types: ${riskExposure.riskTypes.join(", ")}.` : "";
  return reasoning
    ? `${label} risk exposure is ${riskExposure.riskExposureLevel} with score ${riskExposure.riskExposureScore}.${riskTypes} ${reasoning}`
    : `${label} risk exposure is ${riskExposure.riskExposureLevel} with score ${riskExposure.riskExposureScore}.${riskTypes}`;
}

function whyDependencyCritical(
  profile: ExecutiveRelationshipSummaryProfile,
  label: string
): string | null {
  const dependency = profile.dependency;
  if (!dependency) return null;
  const isCritical =
    dependency.dependencyLevel === "Critical Dependency" ||
    dependency.dependencyScore >= 80 ||
    dependency.singlePointOfFailure;
  if (!isCritical) return null;

  const parts = [
    `Dependency is critical for ${label} with score ${dependency.dependencyScore} (${dependency.dependencyLevel}).`,
    dependency.singlePointOfFailure
      ? "This relationship is flagged as a single point of failure."
      : null,
    dependency.dependencyReasoning[0] ?? null,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(" ") : null;
}

function whyInfluenceStrong(
  profile: ExecutiveRelationshipSummaryProfile,
  label: string
): string | null {
  const influence = profile.influence;
  const score = influence?.influenceScore ?? profile.intelligence?.influence ?? 0;
  const level = influence?.influenceLevel;
  const dependencyInfluence = influence?.influenceFactors.dependencyInfluence ?? 0;
  const businessInfluence = influence?.influenceFactors.businessInfluence ?? 0;
  const isStrong =
    level === "High" ||
    level === "Critical" ||
    score >= 70 ||
    dependencyInfluence >= 80 ||
    businessInfluence >= 75;
  if (!isStrong) return null;

  const parts = [
    `Influence is strong for ${label} with score ${score}${level ? ` (${level})` : ""}.`,
    dependencyInfluence >= 80
      ? `Dependency influence is elevated at ${dependencyInfluence}, amplifying downstream impact.`
      : null,
    influence?.influenceDirection
      ? `Influence direction is ${influence.influenceDirection.replace(/-/g, " ")}.`
      : null,
    influence?.influenceReasoning[0] ?? null,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(" ") : null;
}

function whyExposureHigh(
  profile: ExecutiveRelationshipSummaryProfile,
  label: string
): string | null {
  const riskExposure = profile.riskExposure;
  if (!riskExposure) return null;
  const isHigh =
    riskExposure.riskExposureLevel === "High" ||
    riskExposure.riskExposureLevel === "Critical" ||
    riskExposure.riskExposureScore >= 65;
  if (!isHigh) return null;

  const parts = [
    `Risk exposure is high for ${label} with score ${riskExposure.riskExposureScore} (${riskExposure.riskExposureLevel}).`,
    riskExposure.riskTypes.length > 0
      ? `Primary exposure types: ${riskExposure.riskTypes.join(", ")}.`
      : null,
    riskExposure.riskExposureReasoning[0] ?? null,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(" ") : null;
}

function buildExecutiveSummary(
  explanation: Omit<ExecutiveRelationshipExplanation, "executiveSummary">
): string {
  const contextual = [
    explanation.whyDependencyCritical,
    explanation.whyInfluenceStrong,
    explanation.whyExposureHigh,
  ].filter(Boolean);

  return [
    explanation.dependencyExplanation,
    explanation.influenceExplanation,
    explanation.strengthExplanation,
    explanation.riskExposureExplanation,
    ...contextual,
  ].join(" ");
}

function buildExplanation(
  profile: ExecutiveRelationshipSummaryProfile,
  label: string
): ExecutiveRelationshipExplanation {
  const partial = Object.freeze({
    relationshipId: profile.relationshipId,
    label,
    dependencyExplanation: dependencyExplanation(profile, label),
    influenceExplanation: influenceExplanation(profile, label),
    strengthExplanation: strengthExplanation(profile, label),
    riskExposureExplanation: riskExposureExplanation(profile, label),
    whyDependencyCritical: whyDependencyCritical(profile, label),
    whyInfluenceStrong: whyInfluenceStrong(profile, label),
    whyExposureHigh: whyExposureHigh(profile, label),
    executiveSummary: "",
  });

  return Object.freeze({
    ...partial,
    executiveSummary: buildExecutiveSummary(partial),
  });
}

function buildRegistrySummary(
  explanations: readonly ExecutiveRelationshipExplanation[],
  relationshipIntelligence: ReturnType<typeof buildExecutiveRelationshipSummary>
): string {
  return [
    "Executive relationship explanations ready for Assistant surfaces.",
    `${explanations.length} relationship explanation(s) generated from template-driven DS-4 intelligence.`,
    relationshipIntelligence.executiveSummary,
  ].join(" ");
}

export function buildRelationshipExplanationRegistry(
  input: RelationshipExplanationEngineBuildInput = {}
): RelationshipExplanationRegistry {
  const relationshipIntelligence =
    input.relationshipIntelligence ?? buildExecutiveRelationshipSummary(input);
  const labels = resolveObjectLabels(input);

  if (
    relationshipIntelligence.relationshipCount === 0 ||
    relationshipIntelligence.profiles.length === 0
  ) {
    latestRelationshipExplanationRegistry = EMPTY_RELATIONSHIP_EXPLANATION_REGISTRY;
    return latestRelationshipExplanationRegistry;
  }

  const explanations = Object.freeze(
    relationshipIntelligence.profiles.map((profile) =>
      buildExplanation(profile, resolveLabel(profile, labels))
    )
  );

  const registry = Object.freeze({
    version: RELATIONSHIP_EXPLANATION_ENGINE_VERSION,
    explanationCount: explanations.length,
    explanations,
    executiveSummary: buildRegistrySummary(explanations, relationshipIntelligence),
    relationshipIntelligence,
    explanationReady: true as const,
    readOnly: true as const,
    sceneMutation: false as const,
    objectMutation: false as const,
    mrpMutation: false as const,
    routingMutation: false as const,
    topologyMutation: false as const,
    legacyRouterUsage: false as const,
    diagnostics: RELATIONSHIP_EXPLANATION_ENGINE_DIAGNOSTICS,
  });

  latestRelationshipExplanationRegistry = registry;
  return registry;
}

export function getRelationshipExplanationRegistry(): RelationshipExplanationRegistry {
  return latestRelationshipExplanationRegistry;
}

export function resetRelationshipExplanationEngineForTests(): void {
  latestRelationshipExplanationRegistry = EMPTY_RELATIONSHIP_EXPLANATION_REGISTRY;
}

export const RelationshipExplanationEngine = Object.freeze({
  buildRelationshipExplanationRegistry,
  getRelationshipExplanationRegistry,
  resetRelationshipExplanationEngineForTests,
});
