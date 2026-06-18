/**
 * INT:1:3 — Analyze Intelligence Binding contract.
 *
 * Read-only binding between selected object context and Analyze intelligence.
 */

import type { AnalyzeIntelligenceProfile } from "./analyzeIntelligenceProfileContract.ts";

export const ANALYZE_BINDING_DIAGNOSTIC = "[ANALYZE_BINDING]" as const;

export const ANALYZE_BINDING_READY_DIAGNOSTIC = "[ANALYZE_BINDING_READY]" as const;

export const INT1_ANALYZE_BINDING_COMPLETE_TAG = "[INT1_ANALYZE_BINDING_COMPLETE]" as const;

export const ANALYZE_INTELLIGENCE_BINDING_VERSION = "1.3.0" as const;

export type AnalyzeIntelligenceBindingStatus = "bound" | "missing_object" | "missing_intelligence";

export type AnalyzeIntelligenceBindingView = Readonly<{
  objectId: string;
  objectName: string;
  healthScore: number;
  impactScore: number;
  trendLabel: string;
  trendSummary: string;
  importanceScore: number;
  riskScore: number;
  scenarioSummary: string;
  intelligenceSummary: string;
  bindingStatus: "bound";
  bindingReady: true;
}>;

export type AnalyzeIntelligenceBindingResult = Readonly<{
  version: typeof ANALYZE_INTELLIGENCE_BINDING_VERSION;
  objectId: string | null;
  objectName: string | null;
  view: AnalyzeIntelligenceBindingView | null;
  profile: AnalyzeIntelligenceProfile | null;
  adapterLayerCount: number;
  bindingStatus: AnalyzeIntelligenceBindingStatus;
  readOnly: true;
  sceneMutation: false;
  objectMutation: false;
  routingMutation: false;
  mrpMutation: false;
  simulationActive: false;
  diagnostics: readonly [
    typeof ANALYZE_BINDING_DIAGNOSTIC,
    typeof ANALYZE_BINDING_READY_DIAGNOSTIC,
  ];
}>;

export type AnalyzeIntelligenceBindingBuildInput = Readonly<{
  objectId: string | null;
  objectName?: string | null;
  selectedObjectId?: string | null;
  sceneJson?: unknown;
  objects?: readonly unknown[];
  relationships?: readonly unknown[];
  kpis?: readonly unknown[];
  risks?: readonly unknown[];
  sceneObjects?: readonly unknown[];
  dataSourceObjects?: readonly unknown[];
  dataSourceKpis?: readonly unknown[];
  historicalSnapshots?: readonly import("../kpi-intelligence/kpiTrendContract.ts").KpiHistoricalSnapshot[];
  profile?: AnalyzeIntelligenceProfile;
}>;

export const ANALYZE_BINDING_DIAGNOSTICS = Object.freeze([
  ANALYZE_BINDING_DIAGNOSTIC,
  ANALYZE_BINDING_READY_DIAGNOSTIC,
] as const);

export const EMPTY_ANALYZE_INTELLIGENCE_BINDING_RESULT: AnalyzeIntelligenceBindingResult =
  Object.freeze({
    version: ANALYZE_INTELLIGENCE_BINDING_VERSION,
    objectId: null,
    objectName: null,
    view: null,
    profile: null,
    adapterLayerCount: 0,
    bindingStatus: "missing_object",
    readOnly: true,
    sceneMutation: false,
    objectMutation: false,
    routingMutation: false,
    mrpMutation: false,
    simulationActive: false,
    diagnostics: ANALYZE_BINDING_DIAGNOSTICS,
  });
