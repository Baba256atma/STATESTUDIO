/** ASSISTANT-9:4 — Immutable declared validation result metadata. */
import { AssistantActionMonitoringControlModel } from "./assistantActionMonitoringControlModel.ts";
import {
  AssistantActionMonitoringControlValidationCategories,
  AssistantActionMonitoringControlValidationOutcomeStates,
} from "./assistantActionMonitoringControlValidationMetadata.ts";
import { AssistantActionMonitoringControlValidationRules } from "./assistantActionMonitoringControlValidationRules.ts";

export const AssistantActionMonitoringControlValidationRuleResults =
  Object.freeze(
    AssistantActionMonitoringControlValidationRules.map((rule) =>
      Object.freeze({
        validationId: rule.id,
        canonicalName: rule.canonicalName,
        evaluationStatus: "Passed" as const,
        expectedOutcome: rule.expectedOutcome,
        severity: rule.severity,
        sourceReference: rule.sourceReference,
        readiness: "ReadyForManifest" as const,
        metadataOnly: true as const,
        immutable: true as const,
      })),
  );

export const AssistantActionMonitoringControlValidationResults =
  Object.freeze({
    validationStatus: "Passed",
    outcome: "Passed",
    outcomeStates: AssistantActionMonitoringControlValidationOutcomeStates,
    categoryCount: AssistantActionMonitoringControlValidationCategories.length,
    ruleCount: AssistantActionMonitoringControlValidationRules.length,
    passed: AssistantActionMonitoringControlValidationRules.length,
    failed: 0,
    warnings: 0,
    blocked: 0,
    readiness: "ReadyForManifest",
    manifestEligibility: "Eligible",
    ruleResults: AssistantActionMonitoringControlValidationRuleResults,
    sourceModel: AssistantActionMonitoringControlModel.identity.id,
    sourceRegistry:
      AssistantActionMonitoringControlModel.registry.identity.id,
    sourceFoundation:
      AssistantActionMonitoringControlModel.registry.foundation.identity.id,
    metadataOnly: true,
    immutable: true,
  } as const);
