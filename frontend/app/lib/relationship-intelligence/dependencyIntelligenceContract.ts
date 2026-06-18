/**
 * DS:4:3 — Dependency Intelligence Engine contract.
 *
 * Read-only dependency profile for connected Nexora objects.
 */

export const DEPENDENCY_ENGINE_DIAGNOSTIC = "[DEPENDENCY_ENGINE]" as const;

export const DEPENDENCY_UPDATED_DIAGNOSTIC = "[DEPENDENCY_UPDATED]" as const;

export const DEPENDENCY_ENGINE_VERSION = "4.3.0" as const;

export type DependencyLevel =
  | "Independent"
  | "Dependent"
  | "Highly Dependent"
  | "Critical Dependency";

export type DependencyFactors = Readonly<{
  dependencyWeight: number;
  directionCriticality: number;
  redundancy: number;
  continuityRisk: number;
}>;

export type DependencyProfile = Readonly<{
  relationshipId: string;
  sourceId: string;
  targetId: string;
  relationshipType: string;
  dependencyScore: number;
  dependencyLevel: DependencyLevel;
  singlePointOfFailure: boolean;
  dependencyFactors: DependencyFactors;
  dependencyReasoning: readonly string[];
}>;

export type DependencyIntelligenceRegistry = Readonly<{
  version: typeof DEPENDENCY_ENGINE_VERSION;
  profiles: readonly DependencyProfile[];
  dependencyByRelationshipId: Readonly<Record<string, DependencyProfile>>;
  relationshipCount: number;
  sceneMutation: false;
  objectMutation: false;
  routingMutation: false;
  diagnostics: readonly [
    typeof DEPENDENCY_ENGINE_DIAGNOSTIC,
    typeof DEPENDENCY_UPDATED_DIAGNOSTIC,
  ];
}>;

export type DependencyIntelligenceBuildInput = Readonly<{
  sceneJson?: unknown;
  relationships?: readonly unknown[];
  objects?: readonly unknown[];
}>;

export const DEPENDENCY_DIAGNOSTICS = Object.freeze([
  DEPENDENCY_ENGINE_DIAGNOSTIC,
  DEPENDENCY_UPDATED_DIAGNOSTIC,
] as const);

export const EMPTY_DEPENDENCY_INTELLIGENCE_REGISTRY: DependencyIntelligenceRegistry =
  Object.freeze({
    version: DEPENDENCY_ENGINE_VERSION,
    profiles: Object.freeze([]),
    dependencyByRelationshipId: Object.freeze({}),
    relationshipCount: 0,
    sceneMutation: false,
    objectMutation: false,
    routingMutation: false,
    diagnostics: DEPENDENCY_DIAGNOSTICS,
  });
