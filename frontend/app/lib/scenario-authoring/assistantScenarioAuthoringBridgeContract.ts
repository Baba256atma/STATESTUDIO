/**
 * S:1 — Assistant Scenario Authoring Bridge contract.
 *
 * Read-only draft assistance for Assistant surfaces. No simulation execution,
 * DS intelligence mutation, routing, or topology changes.
 */

import type { ScenarioAuthoringType, ScenarioDraft } from "./scenarioAuthoringContract.ts";
import { SCENARIO_AUTHORING_CONTRACT } from "./scenarioAuthoringContract.ts";
import type { ExecutiveScenarioSummary } from "../scenario-intelligence/executiveScenarioSummaryContract.ts";
import { EMPTY_EXECUTIVE_SCENARIO_SUMMARY } from "../scenario-intelligence/executiveScenarioSummaryContract.ts";

export const ASSISTANT_SCENARIO_AUTHORING_DIAGNOSTIC = "[ASSISTANT_SCENARIO_AUTHORING]" as const;

export const ASSISTANT_SCENARIO_AUTHORING_READY_DIAGNOSTIC =
  "[ASSISTANT_SCENARIO_AUTHORING_READY]" as const;

export const S1_ASSISTANT_BRIDGE_COMPLETE_TAG = "[S1_ASSISTANT_BRIDGE_COMPLETE]" as const;

export const ASSISTANT_SCENARIO_AUTHORING_BRIDGE_VERSION = "1.0.0" as const;

export type AssistantScenarioFieldExplanation = Readonly<{
  field: string;
  label: string;
  explanation: string;
}>;

export type AssistantScenarioStructureSuggestion = Readonly<{
  scenarioType: ScenarioAuthoringType;
  label: string;
  suggestion: string;
}>;

export type AssistantScenarioMissingInput = Readonly<{
  field: string;
  label: string;
  reason: string;
}>;

export type AssistantScenarioAuthoringAssistance = Readonly<{
  version: typeof ASSISTANT_SCENARIO_AUTHORING_BRIDGE_VERSION;
  draftGuidance: string;
  fieldExplanations: readonly AssistantScenarioFieldExplanation[];
  structureSuggestions: readonly AssistantScenarioStructureSuggestion[];
  missingInputs: readonly AssistantScenarioMissingInput[];
  scenarioIntelligence: ExecutiveScenarioSummary;
  assistanceReady: true;
  draftAssistanceOnly: true;
  readOnly: true;
  simulationActive: false;
  sceneMutation: false;
  objectMutation: false;
  mrpMutation: false;
  routingMutation: false;
  topologyMutation: false;
  legacyRouterUsage: false;
  diagnostics: readonly [
    typeof ASSISTANT_SCENARIO_AUTHORING_DIAGNOSTIC,
    typeof ASSISTANT_SCENARIO_AUTHORING_READY_DIAGNOSTIC,
  ];
}>;

export type AssistantScenarioAuthoringBridgeBuildInput = Readonly<{
  sceneJson?: unknown;
  objects?: readonly unknown[];
  relationships?: readonly unknown[];
  kpis?: readonly unknown[];
  risks?: readonly unknown[];
  sceneObjects?: readonly unknown[];
  dataSourceObjects?: readonly unknown[];
  dataSourceKpis?: readonly unknown[];
  historicalSnapshots?: readonly import("../kpi-intelligence/kpiTrendContract.ts").KpiHistoricalSnapshot[];
  selectedObjectId?: string | null;
  draft?: ScenarioDraft | null;
  partialDraft?: Readonly<{
    name?: string;
    scenarioType?: ScenarioAuthoringType;
    summary?: string;
    description?: string;
    assumptions?: readonly string[];
    focusObjectIds?: readonly string[];
  }>;
  scenarioIntelligence?: ExecutiveScenarioSummary;
}>;

export const ASSISTANT_SCENARIO_AUTHORING_DIAGNOSTICS = Object.freeze([
  ASSISTANT_SCENARIO_AUTHORING_DIAGNOSTIC,
  ASSISTANT_SCENARIO_AUTHORING_READY_DIAGNOSTIC,
] as const);

export const EMPTY_ASSISTANT_SCENARIO_AUTHORING_ASSISTANCE: AssistantScenarioAuthoringAssistance =
  Object.freeze({
    version: ASSISTANT_SCENARIO_AUTHORING_BRIDGE_VERSION,
    draftGuidance: "No scenario draft assistance is available.",
    fieldExplanations: Object.freeze([]),
    structureSuggestions: Object.freeze([]),
    missingInputs: Object.freeze([]),
    scenarioIntelligence: EMPTY_EXECUTIVE_SCENARIO_SUMMARY,
    assistanceReady: true,
    draftAssistanceOnly: true,
    readOnly: true,
    simulationActive: false,
    sceneMutation: false,
    objectMutation: false,
    mrpMutation: false,
    routingMutation: false,
    topologyMutation: false,
    legacyRouterUsage: false,
    diagnostics: ASSISTANT_SCENARIO_AUTHORING_DIAGNOSTICS,
  });

export const ASSISTANT_SCENARIO_AUTHORING_CONTRACT = SCENARIO_AUTHORING_CONTRACT;
