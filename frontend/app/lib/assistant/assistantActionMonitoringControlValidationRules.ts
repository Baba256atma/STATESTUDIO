/** ASSISTANT-9:4 — Exactly 42 immutable declarative validation rules. */
import { AssistantActionMonitoringControlModel } from "./assistantActionMonitoringControlModel.ts";
import {
  AssistantActionMonitoringControlValidationCategories,
  registerMonitoringValidationRules,
  type AssistantActionMonitoringControlValidationRuleMetadata,
} from "./assistantActionMonitoringControlValidationMetadata.ts";

const model = AssistantActionMonitoringControlModel;
const foundationId = model.registry.foundation.identity.id;
const registryId = model.registry.identity.id;
const modelId = model.identity.id;

const rulesByCategory = Object.freeze([
  [
    [
      "Foundation Identity Integrity",
      "Foundation Contract Completeness",
      "Foundation Capability Completeness",
      "Foundation Boundary Completeness",
    ],
    foundationId,
    foundationId,
    "Critical",
  ],
  [
    [
      "Registry Collection Completeness",
      "Registry Entry Uniqueness",
      "Registry Canonical Structure",
      "Registry Foundation Traceability",
      "Registry Relationship Integrity",
    ],
    registryId,
    registryId,
    "Critical",
  ],
  [
    [
      "Domain Model Completeness",
      "Domain Model Count Integrity",
      "Domain Model Registry References",
      "Domain Model Policy References",
      "Domain Model Immutable Exports",
      "Domain Model Readiness Consistency",
    ],
    modelId,
    modelId,
    "Critical",
  ],
  [
    [
      "Canonical Identity Uniqueness",
      "Foundation Identity Stability",
      "Registry Identity Stability",
      "Model Identity Stability",
    ],
    modelId,
    modelId,
    "Error",
  ],
  [
    [
      "Relationship Count Integrity",
      "Relationship Source Validity",
      "Relationship Target Validity",
      "Relationship Ordering Determinism",
      "Relationship Uniqueness",
    ],
    modelId,
    modelId,
    "Error",
  ],
  [
    [
      "Lifecycle State Completeness",
      "Lifecycle Ordering Determinism",
      "Lifecycle Runtime Transition Absence",
      "Lifecycle Registry Mapping",
    ],
    modelId,
    registryId,
    "Error",
  ],
  [
    [
      "Capability Registry Completeness",
      "Capability Model Consistency",
      "Capability Uniqueness",
      "Capability Foundation Traceability",
    ],
    registryId,
    registryId,
    "Error",
  ],
  [
    [
      "Policy Registry Completeness",
      "Policy Model Consistency",
      "Policy Foundation Traceability",
    ],
    registryId,
    registryId,
    "Error",
  ],
  [
    [
      "Required Metadata Fields",
      "Metadata Ownership And Namespace",
      "Metadata Readiness And Compatibility",
    ],
    modelId,
    modelId,
    "Warning",
  ],
  [
    [
      "Architectural Boundary Completeness",
      "Model Only Dependency Boundary",
      "No Runtime Monitoring Boundary",
      "Manifest Consumer Readiness Boundary",
    ],
    modelId,
    foundationId,
    "Critical",
  ],
] as const);

const categoryOffsets = Object.freeze(
  rulesByCategory.reduce<readonly number[]>((offsets, entry, index) => {
    if (index === 0) {
      return Object.freeze([1]);
    }
    const previous = offsets[index - 1];
    const previousNames = rulesByCategory[index - 1][0];
    return Object.freeze([...offsets, previous + previousNames.length]);
  }, Object.freeze([])),
);

export const AssistantActionMonitoringControlValidationRules:
readonly AssistantActionMonitoringControlValidationRuleMetadata[] =
  Object.freeze(
    rulesByCategory.flatMap((
      [names, targetComponent, sourceReference, severity],
      index,
    ) =>
      registerMonitoringValidationRules(
        AssistantActionMonitoringControlValidationCategories[index].name,
        names,
        categoryOffsets[index],
        targetComponent,
        sourceReference,
        severity,
      )),
  );
