/** ASSISTANT-9:4 — Immutable validation report metadata. */
import { AssistantActionMonitoringControlModel } from "./assistantActionMonitoringControlModel.ts";
import {
  AssistantActionMonitoringControlValidationCategories,
  AssistantActionMonitoringControlValidationIdentity,
} from "./assistantActionMonitoringControlValidationMetadata.ts";
import { AssistantActionMonitoringControlValidationResults } from "./assistantActionMonitoringControlValidationResults.ts";
import { AssistantActionMonitoringControlValidationRules } from "./assistantActionMonitoringControlValidationRules.ts";

export const AssistantActionMonitoringControlValidationReport =
  Object.freeze({
    identity: AssistantActionMonitoringControlValidationIdentity,
    summary: Object.freeze({
      validationStatus:
        AssistantActionMonitoringControlValidationResults.validationStatus,
      readiness: AssistantActionMonitoringControlValidationResults.readiness,
      manifestEligibility:
        AssistantActionMonitoringControlValidationResults
          .manifestEligibility,
      outcome: AssistantActionMonitoringControlValidationResults.outcome,
    }),
    ruleInventory: AssistantActionMonitoringControlValidationRules,
    categoryInventory: AssistantActionMonitoringControlValidationCategories,
    coverageSummary: Object.freeze({
      categoryCount:
        AssistantActionMonitoringControlValidationCategories.length,
      ruleCount: AssistantActionMonitoringControlValidationRules.length,
      validatedModelKinds:
        AssistantActionMonitoringControlModel.statistics.domainModelCount,
      validatedRelationshipKinds:
        AssistantActionMonitoringControlModel.statistics.relationshipCount,
      validatedStateKinds:
        AssistantActionMonitoringControlModel.statistics.stateModelCount,
    }),
    readinessDeclaration: "ReadyForManifest",
    manifestCompatibility: Object.freeze({
      manifestCompatible: true,
      modelCompatible: true,
      registryCompatible: true,
      foundationCompatible: true,
    }),
    metadataOnly: true,
    immutable: true,
  } as const);
