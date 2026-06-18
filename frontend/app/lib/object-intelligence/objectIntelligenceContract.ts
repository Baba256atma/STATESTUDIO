/**
 * DS:3:1 — Object Intelligence foundation contract.
 *
 * Immutable object-level intelligence metadata. No UI, scene mutation, or
 * simulation authority.
 */

export const OBJECT_INTELLIGENCE_RUNTIME_DIAGNOSTIC =
  "[OBJECT_INTELLIGENCE_RUNTIME]" as const;

export const OBJECT_INTELLIGENCE_PROFILE_CREATED_DIAGNOSTIC =
  "[OBJECT_INTELLIGENCE_PROFILE_CREATED]" as const;

export const OBJECT_INTELLIGENCE_RUNTIME_VERSION = "3.1.0" as const;

export type ObjectIntelligenceTrend = "improving" | "stable" | "declining" | "unknown";

export type ObjectIntelligenceSource = "scene" | "data_source";

export type ObjectIntelligenceProfile = Readonly<{
  objectId: string;
  label: string;
  objectType: string;
  source: ObjectIntelligenceSource;
  health: number;
  impact: number;
  confidence: number;
  importance: number;
  trend: ObjectIntelligenceTrend;
}>;

export type ObjectIntelligenceRegistry = Readonly<{
  version: typeof OBJECT_INTELLIGENCE_RUNTIME_VERSION;
  profiles: readonly ObjectIntelligenceProfile[];
  profileByObjectId: Readonly<Record<string, ObjectIntelligenceProfile>>;
  objectCount: number;
  sceneMutation: false;
  simulation: false;
  diagnostics: readonly [
    typeof OBJECT_INTELLIGENCE_RUNTIME_DIAGNOSTIC,
    typeof OBJECT_INTELLIGENCE_PROFILE_CREATED_DIAGNOSTIC,
  ];
}>;

export const OBJECT_INTELLIGENCE_DIAGNOSTICS = Object.freeze([
  OBJECT_INTELLIGENCE_RUNTIME_DIAGNOSTIC,
  OBJECT_INTELLIGENCE_PROFILE_CREATED_DIAGNOSTIC,
] as const);

export type ObjectIntelligenceBuildInput = Readonly<{
  sceneJson?: unknown;
  sceneObjects?: readonly unknown[];
  dataSourceObjects?: readonly unknown[];
}>;

export const EMPTY_OBJECT_INTELLIGENCE_REGISTRY: ObjectIntelligenceRegistry = Object.freeze({
  version: OBJECT_INTELLIGENCE_RUNTIME_VERSION,
  profiles: Object.freeze([]),
  profileByObjectId: Object.freeze({}),
  objectCount: 0,
  sceneMutation: false,
  simulation: false,
  diagnostics: OBJECT_INTELLIGENCE_DIAGNOSTICS,
});
