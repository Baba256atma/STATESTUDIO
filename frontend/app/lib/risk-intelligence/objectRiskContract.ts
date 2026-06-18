/**
 * DS:6:2 — Object Risk Intelligence Engine contract.
 *
 * Read-only object risk profiles derived from object intelligence signals.
 */

import type {
  ObjectHealthHistoryPoint,
  ObjectTrendDirection,
  ObjectTrendSnapshot,
  ObjectTrendSourceUpdate,
} from "../object-intelligence/objectTrendContract.ts";

export const OBJECT_RISK_ENGINE_DIAGNOSTIC = "[OBJECT_RISK_ENGINE]" as const;

export const OBJECT_RISK_UPDATED_DIAGNOSTIC = "[OBJECT_RISK_UPDATED]" as const;

export const OBJECT_RISK_ENGINE_VERSION = "6.2.0" as const;

export type ObjectRiskLevel = "Low" | "Medium" | "High" | "Critical";

export type ObjectRiskFactors = Readonly<{
  healthScore: number;
  trendDirection: ObjectTrendDirection;
  trendStrength: number;
  impactScore: number;
  importanceScore: number;
}>;

export type ObjectRiskProfile = Readonly<{
  objectId: string;
  riskScore: number;
  riskLevel: ObjectRiskLevel;
  riskFactors: ObjectRiskFactors;
  riskReasoning: readonly string[];
}>;

export type ObjectRiskRegistry = Readonly<{
  version: typeof OBJECT_RISK_ENGINE_VERSION;
  profiles: readonly ObjectRiskProfile[];
  riskByObjectId: Readonly<Record<string, ObjectRiskProfile>>;
  objectCount: number;
  sceneMutation: false;
  simulation: false;
  diagnostics: readonly [
    typeof OBJECT_RISK_ENGINE_DIAGNOSTIC,
    typeof OBJECT_RISK_UPDATED_DIAGNOSTIC,
  ];
}>;

export type ObjectRiskBuildInput = Readonly<{
  sceneJson?: unknown;
  sceneObjects?: readonly unknown[];
  dataSourceObjects?: readonly unknown[];
  historicalSnapshots?: readonly ObjectTrendSnapshot[];
  sourceUpdates?: readonly ObjectTrendSourceUpdate[];
  objectHealthHistory?: readonly ObjectHealthHistoryPoint[];
}>;

export const OBJECT_RISK_DIAGNOSTICS = Object.freeze([
  OBJECT_RISK_ENGINE_DIAGNOSTIC,
  OBJECT_RISK_UPDATED_DIAGNOSTIC,
] as const);

export const EMPTY_OBJECT_RISK_REGISTRY: ObjectRiskRegistry = Object.freeze({
  version: OBJECT_RISK_ENGINE_VERSION,
  profiles: Object.freeze([]),
  riskByObjectId: Object.freeze({}),
  objectCount: 0,
  sceneMutation: false,
  simulation: false,
  diagnostics: OBJECT_RISK_DIAGNOSTICS,
});
