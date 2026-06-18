/**
 * INT:3 — Assistant Intelligence Adapter contract.
 *
 * Read-only adapter between Assistant surfaces and certified DS-3 through DS-7
 * intelligence plus template-driven explanation engines.
 */

import type { ExecutiveIntelligenceSnapshot } from "../intelligence/executiveIntelligenceSnapshotContract.ts";
import { EMPTY_EXECUTIVE_INTELLIGENCE_SNAPSHOT } from "../intelligence/executiveIntelligenceSnapshotContract.ts";
import type { KpiExplanationRegistry } from "./kpiExplanationEngineContract.ts";
import { EMPTY_KPI_EXPLANATION_REGISTRY } from "./kpiExplanationEngineContract.ts";
import type { ObjectExplanationRegistry } from "./objectExplanationEngineContract.ts";
import { EMPTY_OBJECT_EXPLANATION_REGISTRY } from "./objectExplanationEngineContract.ts";
import type { RelationshipExplanationRegistry } from "./relationshipExplanationEngineContract.ts";
import { EMPTY_RELATIONSHIP_EXPLANATION_REGISTRY } from "./relationshipExplanationEngineContract.ts";
import type { RiskExplanationRegistry } from "./riskExplanationEngineContract.ts";
import { EMPTY_RISK_EXPLANATION_REGISTRY } from "./riskExplanationEngineContract.ts";
import type { ScenarioExplanationRegistry } from "./scenarioExplanationEngineContract.ts";
import { EMPTY_SCENARIO_EXPLANATION_REGISTRY } from "./scenarioExplanationEngineContract.ts";

export const ASSISTANT_INTELLIGENCE_ADAPTER_DIAGNOSTIC =
  "[ASSISTANT_INTELLIGENCE_ADAPTER]" as const;

export const ASSISTANT_INTELLIGENCE_ADAPTER_READY_DIAGNOSTIC =
  "[ASSISTANT_INTELLIGENCE_ADAPTER_READY]" as const;

export const INT3_ADAPTER_COMPLETE_TAG = "[INT3_ADAPTER_COMPLETE]" as const;

export const ASSISTANT_INTELLIGENCE_ADAPTER_VERSION = "3.1.0" as const;

export type AssistantIntelligenceSnapshot = Readonly<{
  version: typeof ASSISTANT_INTELLIGENCE_ADAPTER_VERSION;
  executiveSummary: string;
  snapshot: ExecutiveIntelligenceSnapshot;
  objectExplanations: ObjectExplanationRegistry;
  relationshipExplanations: RelationshipExplanationRegistry;
  kpiExplanations: KpiExplanationRegistry;
  riskExplanations: RiskExplanationRegistry;
  scenarioExplanations: ScenarioExplanationRegistry;
  explanationCount: number;
  readOnly: true;
  simulationActive: false;
  sceneMutation: false;
  objectMutation: false;
  mrpMutation: false;
  routingMutation: false;
  topologyMutation: false;
  legacyRouterUsage: false;
  diagnostics: readonly [
    typeof ASSISTANT_INTELLIGENCE_ADAPTER_DIAGNOSTIC,
    typeof ASSISTANT_INTELLIGENCE_ADAPTER_READY_DIAGNOSTIC,
  ];
}>;

export type AssistantIntelligenceAdapterRegistry = AssistantIntelligenceSnapshot;

export type AssistantIntelligenceAdapterBuildInput = Readonly<{
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
  snapshot?: ExecutiveIntelligenceSnapshot;
  objectExplanations?: ObjectExplanationRegistry;
  relationshipExplanations?: RelationshipExplanationRegistry;
  kpiExplanations?: KpiExplanationRegistry;
  riskExplanations?: RiskExplanationRegistry;
  scenarioExplanations?: ScenarioExplanationRegistry;
}>;

export const ASSISTANT_INTELLIGENCE_ADAPTER_DIAGNOSTICS = Object.freeze([
  ASSISTANT_INTELLIGENCE_ADAPTER_DIAGNOSTIC,
  ASSISTANT_INTELLIGENCE_ADAPTER_READY_DIAGNOSTIC,
] as const);

export const EMPTY_ASSISTANT_INTELLIGENCE_ADAPTER_REGISTRY: AssistantIntelligenceAdapterRegistry =
  Object.freeze({
    version: ASSISTANT_INTELLIGENCE_ADAPTER_VERSION,
    executiveSummary: "No assistant intelligence is available.",
    snapshot: EMPTY_EXECUTIVE_INTELLIGENCE_SNAPSHOT,
    objectExplanations: EMPTY_OBJECT_EXPLANATION_REGISTRY,
    relationshipExplanations: EMPTY_RELATIONSHIP_EXPLANATION_REGISTRY,
    kpiExplanations: EMPTY_KPI_EXPLANATION_REGISTRY,
    riskExplanations: EMPTY_RISK_EXPLANATION_REGISTRY,
    scenarioExplanations: EMPTY_SCENARIO_EXPLANATION_REGISTRY,
    explanationCount: 0,
    readOnly: true,
    simulationActive: false,
    sceneMutation: false,
    objectMutation: false,
    mrpMutation: false,
    routingMutation: false,
    topologyMutation: false,
    legacyRouterUsage: false,
    diagnostics: ASSISTANT_INTELLIGENCE_ADAPTER_DIAGNOSTICS,
  });
