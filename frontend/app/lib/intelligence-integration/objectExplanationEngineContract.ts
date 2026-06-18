/**
 * INT:3 — Object Explanation Engine contract.
 *
 * Template-driven read-only executive object explanations from certified
 * DS-3 object intelligence. No AI generation, mutations, or routing changes.
 */

import type { ExecutiveObjectIntelligenceSummary } from "../object-intelligence/executiveObjectIntelligenceSummaryContract.ts";
import { EMPTY_EXECUTIVE_OBJECT_INTELLIGENCE_SUMMARY } from "../object-intelligence/executiveObjectIntelligenceSummaryContract.ts";

export const OBJECT_EXPLANATION_ENGINE_DIAGNOSTIC = "[OBJECT_EXPLANATION_ENGINE]" as const;

export const OBJECT_EXPLANATION_READY_DIAGNOSTIC = "[OBJECT_EXPLANATION_READY]" as const;

export const INT3_OBJECT_EXPLANATION_COMPLETE_TAG = "[INT3_OBJECT_EXPLANATION_COMPLETE]" as const;

export const OBJECT_EXPLANATION_ENGINE_VERSION = "3.2.0" as const;

export type ExecutiveObjectExplanation = Readonly<{
  objectId: string;
  label: string;
  healthExplanation: string;
  impactExplanation: string;
  trendExplanation: string;
  importanceExplanation: string;
  riskExplanation: string;
  confidenceExplanation: string;
  executiveSummary: string;
}>;

export type ObjectExplanationRegistry = Readonly<{
  version: typeof OBJECT_EXPLANATION_ENGINE_VERSION;
  explanationCount: number;
  explanations: readonly ExecutiveObjectExplanation[];
  executiveSummary: string;
  objectIntelligence: ExecutiveObjectIntelligenceSummary;
  explanationReady: true;
  readOnly: true;
  sceneMutation: false;
  objectMutation: false;
  mrpMutation: false;
  routingMutation: false;
  topologyMutation: false;
  legacyRouterUsage: false;
  diagnostics: readonly [
    typeof OBJECT_EXPLANATION_ENGINE_DIAGNOSTIC,
    typeof OBJECT_EXPLANATION_READY_DIAGNOSTIC,
  ];
}>;

export type ObjectExplanationEngineBuildInput = Readonly<{
  sceneJson?: unknown;
  sceneObjects?: readonly unknown[];
  dataSourceObjects?: readonly unknown[];
  historicalSnapshots?: readonly import("../object-intelligence/objectTrendContract.ts").ObjectTrendSnapshot[];
  sourceUpdates?: readonly import("../object-intelligence/objectTrendContract.ts").ObjectTrendSourceUpdate[];
  objectHealthHistory?: readonly import("../object-intelligence/objectTrendContract.ts").ObjectHealthHistoryPoint[];
  selectedObjectId?: string | null;
  objectIntelligence?: ExecutiveObjectIntelligenceSummary;
}>;

export const OBJECT_EXPLANATION_ENGINE_DIAGNOSTICS = Object.freeze([
  OBJECT_EXPLANATION_ENGINE_DIAGNOSTIC,
  OBJECT_EXPLANATION_READY_DIAGNOSTIC,
] as const);

export const EMPTY_OBJECT_EXPLANATION_REGISTRY: ObjectExplanationRegistry = Object.freeze({
  version: OBJECT_EXPLANATION_ENGINE_VERSION,
  explanationCount: 0,
  explanations: Object.freeze([]),
  executiveSummary: "No object explanations are available.",
  objectIntelligence: EMPTY_EXECUTIVE_OBJECT_INTELLIGENCE_SUMMARY,
  explanationReady: true,
  readOnly: true,
  sceneMutation: false,
  objectMutation: false,
  mrpMutation: false,
  routingMutation: false,
  topologyMutation: false,
  legacyRouterUsage: false,
  diagnostics: OBJECT_EXPLANATION_ENGINE_DIAGNOSTICS,
});
