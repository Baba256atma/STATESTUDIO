/** ASSISTANT-9:4 — Public Validation surface for Manifest consumers. */
import {
  AssistantActionMonitoringControlValidationCategories,
  AssistantActionMonitoringControlValidationIdentity,
  AssistantActionMonitoringControlValidationStructuralMetadata,
} from "./assistantActionMonitoringControlValidationMetadata.ts";
import { AssistantActionMonitoringControlValidationPlatform } from "./assistantActionMonitoringControlValidationPlatform.ts";
import { AssistantActionMonitoringControlValidationReport } from "./assistantActionMonitoringControlValidationReport.ts";
import { AssistantActionMonitoringControlValidationResults } from "./assistantActionMonitoringControlValidationResults.ts";
import { AssistantActionMonitoringControlValidationRules } from "./assistantActionMonitoringControlValidationRules.ts";

export const AssistantActionMonitoringControlValidationPublic =
  Object.freeze({
    identity: AssistantActionMonitoringControlValidationIdentity,
    metadata: AssistantActionMonitoringControlValidationStructuralMetadata,
    categories: AssistantActionMonitoringControlValidationCategories,
    rules: AssistantActionMonitoringControlValidationRules,
    results: AssistantActionMonitoringControlValidationResults,
    platform: AssistantActionMonitoringControlValidationPlatform,
    report: AssistantActionMonitoringControlValidationReport,
    publicApiSurface: Object.freeze([
      "AssistantActionMonitoringControlValidation",
    ]),
    consumer:
      "ASSISTANT-9:5 Executive Action Monitoring & Control Manifest",
    runtimeExports: false,
    services: false,
    factories: false,
    executableValidationEngine: false,
    metadataOnly: true,
    immutable: true,
  } as const);
