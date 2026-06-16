/**
 * MRP:4C:1 / 4C:2 / 4C:3 / 4C:5 — Risk workspace runtime state contract.
 */

import { DEFAULT_RISK_OBJECT_CONTEXT, type RiskObjectContext } from "./riskObjectContextContract.ts";
import {
  DEFAULT_RISK_SCENE_COVERAGE,
  type RiskSceneCoverage,
} from "./riskSceneAwarenessContract.ts";
import type { RiskTopRiskRow } from "./riskVisualSurfaceContract.ts";
import { DEFAULT_RISK_WORKSPACE_METRICS } from "./riskWorkspaceMetricsContract.ts";

export const RISK_STATE_TAG = "[RISK_STATE]" as const;
export const RISK_RUNTIME_TAG = "[RISK_RUNTIME]" as const;

export const RISK_WORKSPACE_STATE_VERSION = "4C.6.0";

export type RiskWorkspaceStatePhase = "loading" | "ready" | "empty";

export type RiskFieldSnapshot = Readonly<{
  headline: string;
  detail: string;
}>;

export type RiskWorkspaceState = Readonly<{
  phase: RiskWorkspaceStatePhase;
  selectedObjectId: string | null;
  riskCount: number;
  elevatedRiskCount: number;
  criticalRiskCount: number;
  dominantRiskCategory: string;
  lastUpdatedAt: number;
  topRiskRows: readonly RiskTopRiskRow[];
  sceneCoverage: RiskSceneCoverage;
  sceneAwarenessReadOnly: true;
  objectContext: RiskObjectContext;
  riskSummary: RiskFieldSnapshot;
  topRisks: RiskFieldSnapshot;
  riskDrivers: RiskFieldSnapshot;
  recommendedMonitoring: RiskFieldSnapshot;
  revision: number;
  signature: string;
}>;

export type RiskWorkspaceStatePublishResult = Readonly<{
  changed: boolean;
  state: RiskWorkspaceState;
  revision: number;
  guarded: boolean;
  guardReason?: string;
}>;

export const RISK_LOADING_HEADLINE = "Loading…";
export const RISK_LOADING_DETAIL = "Retrieving risk workspace runtime state.";

export const RISK_EMPTY_HEADLINE = "No data available";
export const RISK_EMPTY_DETAIL = "Risk workspace runtime returned an empty state.";

export const DEFAULT_RISK_SUMMARY: RiskFieldSnapshot = Object.freeze({
  headline: "No risk summary signal",
  detail: "Runtime connected — risk summary intelligence not wired in MRP:4C:2.",
});

export const DEFAULT_TOP_RISKS: RiskFieldSnapshot = Object.freeze({
  headline: "No top risks signal",
  detail: "Runtime connected — top risks intelligence not wired in MRP:4C:2.",
});

export const DEFAULT_RISK_DRIVERS: RiskFieldSnapshot = Object.freeze({
  headline: "No risk drivers signal",
  detail: "Runtime connected — risk drivers intelligence not wired in MRP:4C:2.",
});

export const DEFAULT_RECOMMENDED_MONITORING: RiskFieldSnapshot = Object.freeze({
  headline: "No monitoring recommendations",
  detail: "Runtime connected — monitoring intelligence not wired in MRP:4C:2.",
});

export const DEFAULT_RISK_READY_STATE: RiskWorkspaceState = Object.freeze({
  phase: "ready",
  ...DEFAULT_RISK_WORKSPACE_METRICS,
  topRiskRows: Object.freeze([]),
  sceneCoverage: DEFAULT_RISK_SCENE_COVERAGE,
  sceneAwarenessReadOnly: true,
  objectContext: DEFAULT_RISK_OBJECT_CONTEXT,
  riskSummary: DEFAULT_RISK_SUMMARY,
  topRisks: DEFAULT_TOP_RISKS,
  riskDrivers: DEFAULT_RISK_DRIVERS,
  recommendedMonitoring: DEFAULT_RECOMMENDED_MONITORING,
  revision: 0,
  signature: "risk:ready:defaults",
});
