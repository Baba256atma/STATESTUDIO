/**
 * APP-2:1 — Scenario Intelligence public API contract.
 * Interface-only surface — no intelligence execution or hidden state.
 */

import type {
  ScenarioAnalyzeRequest,
  ScenarioAnalyzeResult,
  ScenarioContextSnapshot,
  ScenarioDiagnostic,
  ScenarioExecutiveReferences,
  ScenarioHealthState,
  ScenarioIdentity,
  ScenarioIntelligenceFutureCompatibility,
  ScenarioIntelligenceIdentity,
  ScenarioIntelligenceInitRequest,
  ScenarioIntelligenceInitResult,
  ScenarioIntelligenceScenarioId,
  ScenarioIntelligenceWorkspaceId,
  ScenarioMetadataRecord,
  ScenarioStatus,
} from "./scenarioIntelligenceTypes.ts";
import {
  SCENARIO_INTELLIGENCE_ARCHITECTURE_VERSION,
  SCENARIO_INTELLIGENCE_CONTRACT_VERSION,
  SCENARIO_INTELLIGENCE_IDENTITY,
} from "./scenarioIntelligenceContract.ts";
import { SCENARIO_DEFAULT_HEALTH_STATE } from "./scenarioIntelligenceStates.ts";

export const SCENARIO_INTELLIGENCE_API_VERSION = "APP-2/1" as const;

export const SCENARIO_INTELLIGENCE_API_OWNER = "app-2-scenario-intelligence-api" as const;

export const SCENARIO_INTELLIGENCE_FUTURE_COMPATIBILITY: ScenarioIntelligenceFutureCompatibility =
  Object.freeze({
    app3Ready: true,
    app4Ready: true,
    layReady: true,
    governanceReady: true,
    memoryReady: true,
    executiveTimeConsumerOnly: true,
    readOnly: true,
  });

export type ScenarioIntelligencePublicApi = Readonly<{
  initializeScenarioIntelligence: (
    request: ScenarioIntelligenceInitRequest
  ) => ScenarioIntelligenceInitResult;
  analyzeScenario: (request: ScenarioAnalyzeRequest) => ScenarioAnalyzeResult;
  getScenarioState: (input: {
    scenarioId: ScenarioIntelligenceScenarioId;
    workspaceId: ScenarioIntelligenceWorkspaceId;
  }) => ScenarioHealthState;
  getScenarioContext: (input: {
    scenarioId: ScenarioIntelligenceScenarioId;
    workspaceId: ScenarioIntelligenceWorkspaceId;
  }) => ScenarioContextSnapshot | null;
  getScenarioMetadata: (input: {
    scenarioId: ScenarioIntelligenceScenarioId;
    workspaceId: ScenarioIntelligenceWorkspaceId;
  }) => ScenarioMetadataRecord | null;
  getScenarioDiagnostics: (input: {
    scenarioId: ScenarioIntelligenceScenarioId;
    workspaceId: ScenarioIntelligenceWorkspaceId;
  }) => readonly ScenarioDiagnostic[];
  getScenarioIdentity: () => ScenarioIntelligenceIdentity;
  getFutureCompatibility: () => ScenarioIntelligenceFutureCompatibility;
}>;

export type ScenarioIntelligenceInternalApi = Readonly<{
  resolveScenarioIdentity: (input: {
    scenarioId: ScenarioIntelligenceScenarioId;
    workspaceId: ScenarioIntelligenceWorkspaceId;
  }) => ScenarioIdentity | null;
  resolveExecutiveReferences: (input: {
    scenarioId: ScenarioIntelligenceScenarioId;
    workspaceId: ScenarioIntelligenceWorkspaceId;
  }) => ScenarioExecutiveReferences | null;
  resolveScenarioStatus: (input: {
    scenarioId: ScenarioIntelligenceScenarioId;
    workspaceId: ScenarioIntelligenceWorkspaceId;
  }) => ScenarioStatus | null;
}>;

export const SCENARIO_INTELLIGENCE_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  noHiddenState: true,
  noSingletonMutation: true,
  noDirectEngineImportsForConsumers: true,
  executiveTimeReadOnly: true,
  timelineReadOnly: true,
  workspaceAware: true,
} as const);

export const ScenarioIntelligencePublicApiDeclaration: ScenarioIntelligencePublicApi = Object.freeze({
  initializeScenarioIntelligence: () => {
    throw new Error("Public API contract only — implementation deferred to APP-2:2.");
  },
  analyzeScenario: () => {
    throw new Error("Public API contract only — intelligence execution deferred.");
  },
  getScenarioState: () => SCENARIO_DEFAULT_HEALTH_STATE,
  getScenarioContext: () => null,
  getScenarioMetadata: () => null,
  getScenarioDiagnostics: () => Object.freeze([]),
  getScenarioIdentity: () => SCENARIO_INTELLIGENCE_IDENTITY,
  getFutureCompatibility: () => SCENARIO_INTELLIGENCE_FUTURE_COMPATIBILITY,
});

export function getScenarioIntelligenceApiVersionMetadata(): Readonly<{
  apiVersion: string;
  contractVersion: string;
  architectureVersion: string;
  owner: typeof SCENARIO_INTELLIGENCE_API_OWNER;
}> {
  return Object.freeze({
    apiVersion: SCENARIO_INTELLIGENCE_API_VERSION,
    contractVersion: SCENARIO_INTELLIGENCE_CONTRACT_VERSION,
    architectureVersion: SCENARIO_INTELLIGENCE_ARCHITECTURE_VERSION,
    owner: SCENARIO_INTELLIGENCE_API_OWNER,
  });
}
