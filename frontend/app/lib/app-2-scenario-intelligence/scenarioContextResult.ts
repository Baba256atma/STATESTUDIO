/**
 * APP-2:3 — Scenario Context Engine result types.
 * Canonical immutable business context — no UI or rendering artifacts.
 */

import type {
  ScenarioDecisionJournalReference,
  ScenarioExecutiveTimeReference,
  ScenarioIdentity,
  ScenarioIntelligenceScenarioId,
  ScenarioIntelligenceWorkspaceId,
  ScenarioKpiReference,
  ScenarioMetadataRecord,
  ScenarioObjectReference,
  ScenarioRelationshipReference,
  ScenarioRiskReference,
  ScenarioTimelineReference,
  ScenarioWorkspaceReference,
} from "./scenarioIntelligenceTypes.ts";
import type { ScenarioStateResult } from "./scenarioStateResult.ts";
import type { ScenarioContextDiagnostic } from "./scenarioContextDiagnostics.ts";

export const SCENARIO_CONTEXT_ENGINE_VERSION = "APP-2/3" as const;

export type ScenarioDataSourceReference = Readonly<{
  dataSourceId: string;
  label: string;
  readOnly: true;
}>;

export type ScenarioSimulationReference = Readonly<{
  simulationId: string;
  label: string;
  status: string;
  readOnly: true;
}>;

export type ScenarioCompareReference = Readonly<{
  compareId: string;
  baselineScenarioId: string;
  candidateScenarioId: string;
  readOnly: true;
}>;

export type ScenarioContext = Readonly<{
  scenarioId: ScenarioIntelligenceScenarioId;
  workspaceId: ScenarioIntelligenceWorkspaceId;
  identity: ScenarioIdentity | null;
  workspace: ScenarioWorkspaceReference | null;
  state: ScenarioStateResult | null;
  executiveTimeReference: ScenarioExecutiveTimeReference | null;
  timelineReference: ScenarioTimelineReference | null;
  objects: readonly ScenarioObjectReference[];
  relationships: readonly ScenarioRelationshipReference[];
  kpis: readonly ScenarioKpiReference[];
  risks: readonly ScenarioRiskReference[];
  decisionReferences: readonly ScenarioDecisionJournalReference[];
  simulationReferences: readonly ScenarioSimulationReference[];
  compareReferences: readonly ScenarioCompareReference[];
  dataSources: readonly ScenarioDataSourceReference[];
  metadata: ScenarioMetadataRecord | null;
  diagnostics: readonly ScenarioContextDiagnostic[];
  generatedAt: string;
  readOnly: true;
  engineVersion: typeof SCENARIO_CONTEXT_ENGINE_VERSION;
}>;

export type ScenarioContextReferencesInput = Readonly<{
  executiveTime?: ScenarioExecutiveTimeReference | null;
  timeline?: ScenarioTimelineReference | null;
  workspace?: ScenarioWorkspaceReference | null;
  objects?: readonly ScenarioObjectReference[];
  relationships?: readonly ScenarioRelationshipReference[];
  kpis?: readonly ScenarioKpiReference[];
  risks?: readonly ScenarioRiskReference[];
  decisionReferences?: readonly ScenarioDecisionJournalReference[];
  simulationReferences?: readonly ScenarioSimulationReference[];
  compareReferences?: readonly ScenarioCompareReference[];
  dataSources?: readonly ScenarioDataSourceReference[];
}>;

export type ScenarioContextBuildInput = Readonly<{
  scenarioId: ScenarioIntelligenceScenarioId;
  workspaceId: ScenarioIntelligenceWorkspaceId;
  generatedAt: string;
  identity: ScenarioIdentity | null;
  metadata: ScenarioMetadataRecord | null;
  state: ScenarioStateResult | null;
  references: ScenarioContextReferencesInput | null;
}>;

export function createScenarioContext(
  input: Omit<ScenarioContext, "readOnly" | "engineVersion">
): ScenarioContext {
  return Object.freeze({
    ...input,
    readOnly: true as const,
    engineVersion: SCENARIO_CONTEXT_ENGINE_VERSION,
  });
}
