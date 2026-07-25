/** ASSISTANT-9:4 — Validation platform summary metadata. */
import { AssistantActionMonitoringControlModel } from "./assistantActionMonitoringControlModel.ts";
import {
  AssistantActionMonitoringControlValidationCategories,
  AssistantActionMonitoringControlValidationIdentity,
  AssistantActionMonitoringControlValidationStructuralMetadata,
} from "./assistantActionMonitoringControlValidationMetadata.ts";
import { AssistantActionMonitoringControlValidationResults } from "./assistantActionMonitoringControlValidationResults.ts";
import { AssistantActionMonitoringControlValidationRules } from "./assistantActionMonitoringControlValidationRules.ts";

const model = AssistantActionMonitoringControlModel;
const foundation = model.registry.foundation;
const registry = model.registry;

export const AssistantActionMonitoringControlValidationPlatform =
  Object.freeze({
    identity: AssistantActionMonitoringControlValidationIdentity,
    totalValidationCategories:
      AssistantActionMonitoringControlValidationCategories.length,
    totalValidationRules:
      AssistantActionMonitoringControlValidationRules.length,
    totalValidatedModelKinds: model.statistics.domainModelCount,
    totalValidatedRelationshipKinds: model.statistics.relationshipCount,
    validationStatus:
      AssistantActionMonitoringControlValidationResults.validationStatus,
    readiness: AssistantActionMonitoringControlValidationResults.readiness,
    validationVersion:
      AssistantActionMonitoringControlValidationIdentity.version,
    sourceModel: model.identity,
    sourceRegistry: registry.identity,
    sourceFoundation: foundation.identity,
    inventoryTotals: Object.freeze({
      validationCategoryCount:
        AssistantActionMonitoringControlValidationCategories.length,
      validationRuleCount:
        AssistantActionMonitoringControlValidationRules.length,
      capabilityCount: foundation.capabilities.length,
      contractCount: foundation.contracts.length,
      modelKindCount: model.statistics.domainModelCount,
      relationshipKindCount: model.statistics.relationshipCount,
      lifecycleStateCount: foundation.lifecycle.length,
      policyCount: foundation.policies.length,
      stateModelCount: model.statistics.stateModelCount,
    }),
    inventories: Object.freeze({
      foundation,
      registry,
      domainModels: model.domainModels,
      relationships: model.relationships,
      stateModels: model.stateModels,
      capabilities: foundation.capabilities,
      contracts: foundation.contracts,
      lifecycle: foundation.lifecycle,
      policies: foundation.policies,
      validationCategories:
        AssistantActionMonitoringControlValidationCategories,
      validationRules: AssistantActionMonitoringControlValidationRules,
      validationResults: AssistantActionMonitoringControlValidationResults,
    }),
    compatibility:
      AssistantActionMonitoringControlValidationStructuralMetadata,
    metadataOnly: true,
    immutable: true,
  } as const);
