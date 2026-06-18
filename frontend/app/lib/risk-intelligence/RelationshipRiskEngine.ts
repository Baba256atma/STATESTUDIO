import { calculateDependencyProfile } from "../relationship-intelligence/DependencyIntelligenceEngine.ts";
import { calculateRelationshipInfluenceProfile } from "../relationship-intelligence/RelationshipInfluenceEngine.ts";
import { calculateRelationshipRiskExposureProfile } from "../relationship-intelligence/RelationshipRiskExposureEngine.ts";
import { calculateRelationshipStrengthProfile } from "../relationship-intelligence/RelationshipStrengthEngine.ts";
import type { DependencyProfile } from "../relationship-intelligence/dependencyIntelligenceContract.ts";
import type { RelationshipInfluenceProfile } from "../relationship-intelligence/relationshipInfluenceContract.ts";
import type { RelationshipRiskExposureProfile } from "../relationship-intelligence/relationshipRiskExposureContract.ts";
import type { RelationshipStrengthProfile } from "../relationship-intelligence/relationshipStrengthContract.ts";
import {
  EMPTY_RELATIONSHIP_RISK_REGISTRY,
  RELATIONSHIP_RISK_INTELLIGENCE_DIAGNOSTICS,
  RELATIONSHIP_RISK_INTELLIGENCE_ENGINE_VERSION,
  type RelationshipRiskBuildInput,
  type RelationshipRiskFactors,
  type RelationshipRiskProfile,
  type RelationshipRiskRegistry,
} from "./relationshipRiskProfileContract.ts";

type ObjectRecord = Readonly<Record<string, unknown>>;

let latestRelationshipRiskRegistry: RelationshipRiskRegistry = EMPTY_RELATIONSHIP_RISK_REGISTRY;

function asRecord(value: unknown): ObjectRecord | null {
  return value && typeof value === "object" ? (value as ObjectRecord) : null;
}

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function readSceneRelationships(sceneJson: unknown): readonly unknown[] {
  const relationships = (sceneJson as { scene?: { relationships?: unknown[] } } | null)?.scene
    ?.relationships;
  return Array.isArray(relationships) ? relationships : [];
}

function readSceneObjects(sceneJson: unknown): readonly unknown[] {
  const objects = (sceneJson as { scene?: { objects?: unknown[] } } | null)?.scene?.objects;
  return Array.isArray(objects) ? objects : [];
}

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function buildObjectMap(objects: readonly unknown[]): Readonly<Record<string, ObjectRecord>> {
  return Object.freeze(
    objects.reduce<Record<string, ObjectRecord>>((registry, raw) => {
      const record = asRecord(raw);
      const id = record ? readString(record.id) || readString(record.objectId) || readString(record.name) : "";
      if (record && id) registry[id] = record;
      return registry;
    }, {})
  );
}

function detectSinglePointOfFailure(
  dependency: DependencyProfile,
  riskExposure: RelationshipRiskExposureProfile,
  strength: RelationshipStrengthProfile
): boolean {
  if (dependency.singlePointOfFailure) return true;
  return (
    dependency.dependencyScore >= 75 &&
    dependency.dependencyFactors.redundancy < 35 &&
    riskExposure.riskExposureScore >= 65 &&
    strength.strengthScore >= 60
  );
}

function detectCriticalDependency(dependency: DependencyProfile): boolean {
  return dependency.dependencyLevel === "Critical Dependency" || dependency.dependencyScore >= 85;
}

function buildRiskReasoning(
  relationshipRiskScore: number,
  singlePointOfFailure: boolean,
  criticalDependency: boolean,
  factors: RelationshipRiskFactors
): readonly string[] {
  return Object.freeze([
    `Relationship risk score is ${relationshipRiskScore}.`,
    singlePointOfFailure
      ? "Single point of failure detected."
      : "No single point of failure detected.",
    criticalDependency
      ? "Critical dependency detected."
      : "No critical dependency detected.",
    `Dependency ${factors.dependencyScore}, influence ${factors.influenceScore}, risk exposure ${factors.riskExposureScore}, strength ${factors.strengthScore}.`,
  ]);
}

export function calculateRelationshipRiskProfileFromIntelligence(
  dependency: DependencyProfile,
  influence: RelationshipInfluenceProfile,
  riskExposure: RelationshipRiskExposureProfile,
  strength: RelationshipStrengthProfile
): RelationshipRiskProfile {
  const couplingAmplifier =
    dependency.dependencyScore >= 65 ? strength.strengthScore * 0.15 : strength.strengthScore * 0.08;
  const relationshipRiskScore = clampScore(
    dependency.dependencyScore * 0.35 +
      riskExposure.riskExposureScore * 0.3 +
      influence.influenceScore * 0.2 +
      couplingAmplifier
  );
  const riskFactors: RelationshipRiskFactors = Object.freeze({
    dependencyScore: dependency.dependencyScore,
    influenceScore: influence.influenceScore,
    riskExposureScore: riskExposure.riskExposureScore,
    strengthScore: strength.strengthScore,
  });
  const singlePointOfFailure = detectSinglePointOfFailure(dependency, riskExposure, strength);
  const criticalDependency = detectCriticalDependency(dependency);

  return Object.freeze({
    relationshipId: dependency.relationshipId,
    sourceId: dependency.sourceId,
    targetId: dependency.targetId,
    relationshipType: dependency.relationshipType,
    relationshipRiskScore,
    singlePointOfFailure,
    criticalDependency,
    riskFactors,
    riskReasoning: buildRiskReasoning(
      relationshipRiskScore,
      singlePointOfFailure,
      criticalDependency,
      riskFactors
    ),
  });
}

export function calculateRelationshipRiskProfile(
  raw: unknown,
  index = 0,
  objectById: Readonly<Record<string, ObjectRecord>> = Object.freeze({})
): RelationshipRiskProfile | null {
  const dependency = calculateDependencyProfile(raw, index, objectById);
  const influence = calculateRelationshipInfluenceProfile(raw, index, objectById);
  const riskExposure = calculateRelationshipRiskExposureProfile(raw, index, objectById);
  const strength = calculateRelationshipStrengthProfile(raw, index, objectById);
  if (!dependency || !influence || !riskExposure || !strength) return null;

  return calculateRelationshipRiskProfileFromIntelligence(
    dependency,
    influence,
    riskExposure,
    strength
  );
}

function dedupeProfiles(profiles: readonly RelationshipRiskProfile[]): readonly RelationshipRiskProfile[] {
  const byId = new Map<string, RelationshipRiskProfile>();
  for (const profile of profiles) {
    if (!byId.has(profile.relationshipId)) byId.set(profile.relationshipId, profile);
  }
  return Object.freeze([...byId.values()]);
}

export function buildRelationshipRiskRegistry(
  input: RelationshipRiskBuildInput = {}
): RelationshipRiskRegistry {
  const relationships = input.relationships ?? readSceneRelationships(input.sceneJson);
  const objects = input.objects ?? readSceneObjects(input.sceneJson);
  const objectById = buildObjectMap(objects);
  const profiles = dedupeProfiles(
    relationships
      .map((relationship, index) => calculateRelationshipRiskProfile(relationship, index, objectById))
      .filter((profile): profile is RelationshipRiskProfile => profile != null)
  );
  const riskByRelationshipId = Object.freeze(
    profiles.reduce<Record<string, RelationshipRiskProfile>>((registry, profile) => {
      registry[profile.relationshipId] = profile;
      return registry;
    }, {})
  );

  latestRelationshipRiskRegistry = Object.freeze({
    version: RELATIONSHIP_RISK_INTELLIGENCE_ENGINE_VERSION,
    profiles,
    riskByRelationshipId,
    relationshipCount: profiles.length,
    sceneMutation: false,
    objectMutation: false,
    routingMutation: false,
    simulation: false,
    diagnostics: RELATIONSHIP_RISK_INTELLIGENCE_DIAGNOSTICS,
  });

  return latestRelationshipRiskRegistry;
}

export function getRelationshipRiskRegistry(): RelationshipRiskRegistry {
  return latestRelationshipRiskRegistry;
}

export function resetRelationshipRiskEngineForTests(): void {
  latestRelationshipRiskRegistry = EMPTY_RELATIONSHIP_RISK_REGISTRY;
}

export const RelationshipRiskEngine = Object.freeze({
  calculateRelationshipRiskProfile,
  calculateRelationshipRiskProfileFromIntelligence,
  buildRelationshipRiskRegistry,
  getRelationshipRiskRegistry,
});
