/**
 * DS:3:5 — Object Trend Intelligence Engine contract.
 *
 * Read-only trend profile generation from historical snapshots, source
 * updates, and object health history.
 */

export const OBJECT_TREND_ENGINE_DIAGNOSTIC = "[OBJECT_TREND_ENGINE]" as const;

export const OBJECT_TREND_UPDATED_DIAGNOSTIC = "[OBJECT_TREND_UPDATED]" as const;

export const OBJECT_TREND_ENGINE_VERSION = "3.5.0" as const;

export type ObjectTrendDirection = "Improving" | "Stable" | "Declining" | "Volatile";

export type ObjectTrendSnapshot = Readonly<{
  objectId: string;
  timestamp?: string | number | null;
  healthScore?: number | null;
  confidenceScore?: number | null;
  impactScore?: number | null;
}>;

export type ObjectTrendSourceUpdate = Readonly<{
  objectId: string;
  timestamp?: string | number | null;
  updateType?: string | null;
  healthScore?: number | null;
  signal?: "positive" | "neutral" | "negative" | "volatile" | null;
}>;

export type ObjectHealthHistoryPoint = Readonly<{
  objectId: string;
  timestamp?: string | number | null;
  healthScore: number;
}>;

export type ObjectTrendProfile = Readonly<{
  objectId: string;
  trendDirection: ObjectTrendDirection;
  trendStrength: number;
  trendEvidence: readonly number[];
  trendReasoning: readonly string[];
}>;

export type ObjectTrendRegistry = Readonly<{
  version: typeof OBJECT_TREND_ENGINE_VERSION;
  profiles: readonly ObjectTrendProfile[];
  trendByObjectId: Readonly<Record<string, ObjectTrendProfile>>;
  objectCount: number;
  sceneMutation: false;
  simulation: false;
  diagnostics: readonly [
    typeof OBJECT_TREND_ENGINE_DIAGNOSTIC,
    typeof OBJECT_TREND_UPDATED_DIAGNOSTIC,
  ];
}>;

export type ObjectTrendBuildInput = Readonly<{
  sceneJson?: unknown;
  sceneObjects?: readonly unknown[];
  dataSourceObjects?: readonly unknown[];
  historicalSnapshots?: readonly ObjectTrendSnapshot[];
  sourceUpdates?: readonly ObjectTrendSourceUpdate[];
  objectHealthHistory?: readonly ObjectHealthHistoryPoint[];
}>;

export const OBJECT_TREND_DIAGNOSTICS = Object.freeze([
  OBJECT_TREND_ENGINE_DIAGNOSTIC,
  OBJECT_TREND_UPDATED_DIAGNOSTIC,
] as const);

export const EMPTY_OBJECT_TREND_REGISTRY: ObjectTrendRegistry = Object.freeze({
  version: OBJECT_TREND_ENGINE_VERSION,
  profiles: Object.freeze([]),
  trendByObjectId: Object.freeze({}),
  objectCount: 0,
  sceneMutation: false,
  simulation: false,
  diagnostics: OBJECT_TREND_DIAGNOSTICS,
});
