/**
 * APP-6:10 — Decision Assistant Integration engine.
 * Pure adapter layer over APP-6:9 Dashboard Integration.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import {
  getDecisionAssistantRegistry,
  getRegisteredDecisionAssistantModel,
  registerDecisionAssistantModel,
  resetDecisionAssistantRegistryForTests,
} from "./decisionAssistantRegistry.ts";
import {
  buildDecisionExplanation as buildDecisionExplanationRecord,
  buildDecisionExplanationText,
} from "./decisionAssistantExplanation.ts";
import { fetchAssistantDashboardModel } from "./decisionAssistantAdapter.ts";
import {
  buildDecisionAssistantModelForInput,
  resetDecisionAssistantModelSequenceForTests,
} from "./decisionAssistantViewModel.ts";
import {
  DECISION_ASSISTANT_BINDINGS,
  DECISION_ASSISTANT_FUTURE_CONSUMERS,
  DECISION_ASSISTANT_INTEGRATION_CONTRACT_VERSION,
  DECISION_ASSISTANT_INTEGRATION_ENGINE_FORBIDDEN_PATTERNS,
  DECISION_ASSISTANT_INTEGRATION_FORBIDDEN_PATTERNS,
  DECISION_ASSISTANT_INTEGRATION_TAGS,
  DECISION_ASSISTANT_MANDATORY_MODEL_FIELDS,
  assistantFailure,
  assistantSuccess,
  type DecisionAssistantContractSurface,
  type DecisionAssistantExplanation,
  type DecisionAssistantIntegrationInput,
  type DecisionAssistantIntegrationResponse,
  type DecisionAssistantIntegrationState,
  type DecisionAssistantModel,
} from "./decisionAssistantTypes.ts";
import {
  validateDecisionAssistant,
  validateDecisionAssistantInput,
  validateDecisionAssistantModel,
  validateEngineCompatibilityForAssistant,
} from "./decisionAssistantValidation.ts";
import { DECISION_DASHBOARD_INTEGRATION_SELF_MANIFEST } from "./decisionDashboardEngine.ts";

export const DECISION_ASSISTANT_INTEGRATION_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...DECISION_ASSISTANT_INTEGRATION_FORBIDDEN_PATTERNS,
  ...DECISION_ASSISTANT_INTEGRATION_ENGINE_FORBIDDEN_PATTERNS,
] as const);

export const DECISION_ASSISTANT_INTEGRATION_SELF_MANIFEST = Object.freeze({
  stageId: "APP-6/10",
  title: "Decision Assistant Integration",
  goal: "Canonical assistant adapter layer over APP-6:9 Dashboard Integration.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...DECISION_DASHBOARD_INTEGRATION_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/decision-timeline/decisionAssistantTypes.ts",
    "frontend/app/lib/decision-timeline/decisionAssistantAdapter.ts",
    "frontend/app/lib/decision-timeline/decisionAssistantExplanation.ts",
    "frontend/app/lib/decision-timeline/decisionAssistantViewModel.ts",
    "frontend/app/lib/decision-timeline/decisionAssistantValidation.ts",
    "frontend/app/lib/decision-timeline/decisionAssistantRegistry.ts",
    "frontend/app/lib/decision-timeline/decisionAssistantEngine.ts",
    "frontend/app/lib/decision-timeline/decisionAssistantRunner.ts",
    "frontend/app/lib/decision-timeline/decisionAssistantEngine.test.ts",
    "docs/app-6-10-decision-assistant-integration-report.md",
  ]),
  forbiddenPatterns: DECISION_ASSISTANT_INTEGRATION_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze([
    "APP-6/1",
    "APP-6/2",
    "APP-6/3",
    "APP-6/4",
    "APP-6/5",
    "APP-6/6",
    "APP-6/7",
    "APP-6/8",
    "APP-6/9",
  ]),
  runtimePath: "library-only" as const,
  tags: DECISION_ASSISTANT_INTEGRATION_TAGS,
} satisfies StageManifest);

export const DECISION_ASSISTANT_INTEGRATION_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  adapterOnly: true,
  noBusinessLogic: true,
  noLlm: true,
  noRecommendations: true,
  dashboardOrchestrationOnly: true,
  noLifecycleDerivation: true,
  noHistoryRebuild: true,
  noPersistence: true,
  noReact: true,
} as const);

let integrationInitialized = false;
let integrationTimestamp = "2026-01-01T00:00:00.000Z";

export function initializeDecisionAssistantIntegration(
  timestamp: string = integrationTimestamp
): DecisionAssistantIntegrationState {
  integrationInitialized = true;
  integrationTimestamp = timestamp;
  return getDecisionAssistantIntegrationState(timestamp);
}

export function isDecisionAssistantIntegrationInitialized(): boolean {
  return integrationInitialized;
}

export function getDecisionAssistantIntegrationState(
  timestamp: string = integrationTimestamp
): DecisionAssistantIntegrationState {
  const registry = getDecisionAssistantRegistry();
  return Object.freeze({
    integrationId: "decision-assistant-integration",
    contractVersion: DECISION_ASSISTANT_INTEGRATION_CONTRACT_VERSION,
    initialized: integrationInitialized,
    registeredModelCount: registry.registeredModelCount,
    timestamp,
    readOnly: true as const,
  });
}

export function resetDecisionAssistantIntegrationForTests(): void {
  integrationInitialized = false;
  integrationTimestamp = "2026-01-01T00:00:00.000Z";
  resetDecisionAssistantRegistryForTests();
  resetDecisionAssistantModelSequenceForTests();
}

export function buildDecisionAssistantModel(
  input: DecisionAssistantIntegrationInput
): DecisionAssistantIntegrationResponse {
  if (!isDecisionAssistantIntegrationInitialized()) {
    return assistantFailure("Decision Assistant Integration is not initialized.");
  }

  const engineValidation = validateEngineCompatibilityForAssistant();
  if (!engineValidation.valid) {
    return assistantFailure(engineValidation.issues[0]?.message ?? "Assistant engine compatibility failed.");
  }

  const inputValidation = validateDecisionAssistantInput(input);
  if (!inputValidation.valid) {
    return assistantFailure(inputValidation.issues[0]?.message ?? "Assistant input validation failed.");
  }

  const model = buildDecisionAssistantModelForInput(input, integrationTimestamp);
  if (!model) {
    return assistantFailure("Unable to build decision assistant model from dashboard outputs.");
  }

  const modelValidation = validateDecisionAssistantModel(model);
  if (!modelValidation.valid) {
    return assistantFailure(modelValidation.issues[0]?.message ?? "Assistant model validation failed.");
  }

  return registerDecisionAssistantModel(model);
}

export function buildDecisionExplanation(
  input: DecisionAssistantIntegrationInput
): DecisionAssistantIntegrationResponse {
  const modelResult = buildDecisionAssistantModel(input);
  if (!modelResult.success || !modelResult.data) {
    return modelResult;
  }

  const dashboardResponse = fetchAssistantDashboardModel(input);
  if (!dashboardResponse.success || !dashboardResponse.data) {
    return assistantFailure(dashboardResponse.reason);
  }

  const explanation = buildDecisionExplanationRecord(input, dashboardResponse.data, integrationTimestamp);
  return assistantSuccess(
    "Decision explanation built.",
    Object.freeze({
      ...modelResult.data,
      decisionExplanation: explanation.text,
      readOnly: true as const,
    })
  );
}

export function buildDecisionAssistantSummary(
  input: DecisionAssistantIntegrationInput
): DecisionAssistantIntegrationResponse {
  const modelResult = buildDecisionAssistantModel(input);
  if (!modelResult.success || !modelResult.data) {
    return modelResult;
  }

  return assistantSuccess(
    "Decision assistant summary built.",
    Object.freeze({
      ...modelResult.data,
      dashboardSummary: modelResult.data.dashboardSummary,
      readOnly: true as const,
    })
  );
}

export function getDecisionAssistantModel(modelId: string): DecisionAssistantModel | null {
  return getRegisteredDecisionAssistantModel(modelId);
}

export function getDecisionAssistantContract(): DecisionAssistantContractSurface {
  return Object.freeze({
    contractVersion: DECISION_ASSISTANT_INTEGRATION_CONTRACT_VERSION,
    mandatoryFields: DECISION_ASSISTANT_MANDATORY_MODEL_FIELDS,
    supportedBindings: DECISION_ASSISTANT_BINDINGS,
    futureConsumers: DECISION_ASSISTANT_FUTURE_CONSUMERS,
    readOnly: true as const,
  });
}

export { validateDecisionAssistant, buildDecisionExplanationText };
export { runDecisionAssistantIntegration } from "./decisionAssistantRunner.ts";

export const DECISION_ASSISTANT_INTEGRATION_VERSION = DECISION_ASSISTANT_INTEGRATION_CONTRACT_VERSION;
export const DECISION_ASSISTANT_INTEGRATION_OWNER = "decision-assistant-integration";

export const DecisionAssistantIntegration = Object.freeze({
  initializeDecisionAssistantIntegration,
  isDecisionAssistantIntegrationInitialized,
  getDecisionAssistantIntegrationState,
  buildDecisionAssistantModel,
  buildDecisionExplanation,
  buildDecisionAssistantSummary,
  validateDecisionAssistant,
  getDecisionAssistantModel,
  getDecisionAssistantContract,
  version: DECISION_ASSISTANT_INTEGRATION_CONTRACT_VERSION,
  tags: DECISION_ASSISTANT_INTEGRATION_TAGS,
});

export { DECISION_ASSISTANT_INTEGRATION_TAGS, DECISION_ASSISTANT_FUTURE_CONSUMERS };

export type { DecisionAssistantExplanation };
