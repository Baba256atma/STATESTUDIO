/**
 * SVIE:1:1 — Scene Visual Intelligence Engine foundation contract.
 *
 * Read-only scene visual metadata layer. Never mutates business, dashboard,
 * routing, assistant, or scene object state.
 */

import type { SceneObject } from "../../sceneTypes.ts";

export const SVIE_RUNTIME_FOUNDATION_TAG = "[SVIE:1:1_RUNTIME_FOUNDATION]" as const;

export const SVIE_RUNTIME_FOUNDATION_VERSION = "1.1.0" as const;

export const SVIE_RUNTIME_READY_LOG = "[SVIE][RuntimeReady]" as const;

export const SVIE_RUNTIME_BRAKE_LOG = "[SVIE][Brake]" as const;

export type SvieHealthLevel = "healthy" | "warning" | "critical" | "opportunity";

export type SvieObjectState = Readonly<{
  objectId: string;
  healthLevel: SvieHealthLevel;
  visualPriority: number;
}>;

export type SvieRuntimeSnapshot = Readonly<{
  objects: readonly SvieObjectState[];
  generatedAt: number;
}>;

export type SvieSceneMetricsInput = Readonly<{
  volatility?: number;
  intensity?: number;
}>;

export type SvieRuntimeBuildInput = Readonly<{
  sceneJson?: unknown;
  metrics?: SvieSceneMetricsInput | null;
  selectedObjectId?: string | null;
}>;

export type SvieForbiddenWriteDomain = "dashboard" | "route" | "workspace";

export type SvieWriteGuardAttempt = Readonly<{
  domain: SvieForbiddenWriteDomain;
  action?: string | null;
  source?: string | null;
}>;

export type SvieWriteGuardResult = Readonly<{
  allowed: false;
  domain: SvieForbiddenWriteDomain;
  reason: string;
}>;

export const SVIE_VISUAL_PRIORITY_BY_HEALTH: Readonly<Record<SvieHealthLevel, number>> =
  Object.freeze({
    critical: 100,
    warning: 75,
    opportunity: 50,
    healthy: 25,
  });

export const DEFAULT_SVIE_RUNTIME_SNAPSHOT: SvieRuntimeSnapshot = Object.freeze({
  objects: Object.freeze([]),
  generatedAt: 0,
});

export type SvieSceneObjectReader = (sceneJson: unknown) => readonly SceneObject[];
