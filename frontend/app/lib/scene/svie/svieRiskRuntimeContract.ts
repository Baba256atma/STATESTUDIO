/**
 * SVIE:2:1 — Risk intelligence runtime contract.
 *
 * Read-only risk visualization metadata. Never mutates scene, routing,
 * workspace, MRP, or lifecycle state.
 */

export const SVIE_RISK_RUNTIME_TAG = "[SVIE:2:1_RISK_RUNTIME]" as const;

export const SVIE_RISK_RUNTIME_VERSION = "2.1.0" as const;

export const SVIE_RISK_RUNTIME_LOG = "[SVIE][RiskRuntime]" as const;

export type SvieRiskLevel = "low" | "medium" | "high" | "critical";

/** Spec alias: SVIERiskState */
export type SvieRiskState = Readonly<{
  objectId: string;
  riskScore: number;
  riskLevel: SvieRiskLevel;
}>;

/** Spec alias: SVIERiskSnapshot */
export type SvieRiskSnapshot = Readonly<{
  objects: readonly SvieRiskState[];
  generatedAt: number;
}>;

export type SvieRiskRuntimeBuildInput = Readonly<{
  sceneJson?: unknown;
}>;

export type SvieRiskForbiddenWriteDomain = "scene" | "route" | "workspace" | "dashboard";

export type SvieRiskWriteGuardAttempt = Readonly<{
  domain: SvieRiskForbiddenWriteDomain;
  action?: string | null;
  source?: string | null;
}>;

export type SvieRiskWriteGuardResult = Readonly<{
  allowed: false;
  domain: SvieRiskForbiddenWriteDomain;
  reason: string;
}>;

export const SVIE_RISK_LEVEL_THRESHOLDS: Readonly<
  Record<SvieRiskLevel, Readonly<{ min: number; max: number }>>
> = Object.freeze({
  low: Object.freeze({ min: 0, max: 24 }),
  medium: Object.freeze({ min: 25, max: 49 }),
  high: Object.freeze({ min: 50, max: 74 }),
  critical: Object.freeze({ min: 75, max: 100 }),
});

export const DEFAULT_SVIE_RISK_SNAPSHOT: SvieRiskSnapshot = Object.freeze({
  objects: Object.freeze([]),
  generatedAt: 0,
});
