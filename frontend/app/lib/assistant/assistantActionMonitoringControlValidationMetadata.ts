/** ASSISTANT-9:4 — Validation identity, types, categories, and helpers. */
import { AssistantActionMonitoringControlModel } from "./assistantActionMonitoringControlModel.ts";

export type AssistantActionMonitoringControlValidationSeverity =
  | "Critical"
  | "Error"
  | "Warning"
  | "Information";

export type AssistantActionMonitoringControlValidationOutcome =
  | "NotValidated"
  | "Passed"
  | "PassedWithWarnings"
  | "Failed"
  | "Blocked";

export interface AssistantActionMonitoringControlValidationCategoryMetadata {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly expectedRuleCount: number;
  readonly order: number;
  readonly version: "1.0.0";
  readonly status: "Canonical";
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantActionMonitoringControlValidationRuleMetadata {
  readonly id: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly validationCategory: string;
  readonly targetComponent: string;
  readonly severity: AssistantActionMonitoringControlValidationSeverity;
  readonly expectedOutcome: "Passed";
  readonly ruleVersion: "1.0.0";
  readonly status: "Declared";
  readonly sourceReference: string;
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export const AssistantActionMonitoringControlValidationIdentity =
  Object.freeze({
    id: "ASSISTANT-9:4/ExecutiveActionMonitoringControlValidation",
    name: "Assistant Executive Action Monitoring & Control Validation",
    phaseId: "ASSISTANT-9:4",
    namespace:
      "nexora.assistant.executive-action-monitoring-control.validation",
    version: "1.0.0",
    status: "Validation",
    stage: "ReadyForManifest",
    readiness: "ReadyForManifest",
    canonical: true,
    mutable: false,
    sourceModel: "ASSISTANT-9:3/ExecutiveActionMonitoringControlModel",
    ownership: "Nexora Assistant",
    metadataOnly: true,
    immutable: true,
  } as const);

export const AssistantActionMonitoringControlValidationRequirements =
  Object.freeze([
    "Immutable",
    "Deterministic",
    "Canonical",
    "Metadata-only",
    "Registry-derived",
    "Model-derived",
    "Versioned",
    "Manifest-ready",
  ] as const);

const categoryDeclarations = Object.freeze([
  ["Foundation Validation", 4],
  ["Registry Validation", 5],
  ["Model Validation", 6],
  ["Identity Validation", 4],
  ["Relationship Validation", 5],
  ["Lifecycle Validation", 4],
  ["Capability Validation", 4],
  ["Policy Validation", 3],
  ["Metadata Validation", 3],
  ["Architecture Validation", 4],
] as const);

export const AssistantActionMonitoringControlValidationCategories:
readonly AssistantActionMonitoringControlValidationCategoryMetadata[] =
  Object.freeze(
    categoryDeclarations.map(([name, expectedRuleCount], index) =>
      Object.freeze({
        id: `ASSISTANT-9:4/Category/${String(index + 1).padStart(2, "0")}`,
        name,
        description:
          `Canonical validation category for ${name} metadata integrity.`,
        expectedRuleCount,
        order: index + 1,
        version: "1.0.0",
        status: "Canonical",
        executable: false,
        metadataOnly: true,
        immutable: true,
      })),
  );

export const AssistantActionMonitoringControlValidationOutcomeStates =
  Object.freeze([
    "NotValidated",
    "Passed",
    "PassedWithWarnings",
    "Failed",
    "Blocked",
  ] as const);

export const AssistantActionMonitoringControlValidationStructuralMetadata =
  Object.freeze({
    identity: AssistantActionMonitoringControlValidationIdentity,
    namespace: AssistantActionMonitoringControlValidationIdentity.namespace,
    version: AssistantActionMonitoringControlValidationIdentity.version,
    ownership: "Nexora Assistant",
    readiness: AssistantActionMonitoringControlValidationIdentity.readiness,
    sourceModel: AssistantActionMonitoringControlModel.identity,
    sourceRegistry: AssistantActionMonitoringControlModel.registry.identity,
    sourceFoundation:
      AssistantActionMonitoringControlModel.registry.foundation.identity,
    requirements: AssistantActionMonitoringControlValidationRequirements,
    outcomeStates: AssistantActionMonitoringControlValidationOutcomeStates,
    categories: AssistantActionMonitoringControlValidationCategories,
    metadataOnly: true,
    immutable: true,
  } as const);

export const registerMonitoringValidationRules = (
  category: string,
  names: readonly string[],
  startOrder: number,
  targetComponent: string,
  sourceReference: string,
  severity: AssistantActionMonitoringControlValidationSeverity = "Error",
): readonly AssistantActionMonitoringControlValidationRuleMetadata[] =>
  Object.freeze(
    names.map((canonicalName, index) => Object.freeze({
      id: `ASSISTANT-9:4/Rule/${
        String(startOrder + index).padStart(2, "0")
      }`,
      canonicalName,
      description:
        `Canonical ${category} validation rule requiring ${canonicalName}.`,
      validationCategory: category,
      targetComponent,
      severity,
      expectedOutcome: "Passed",
      ruleVersion: "1.0.0",
      status: "Declared",
      sourceReference,
      order: startOrder + index,
      executable: false,
      metadataOnly: true,
      immutable: true,
    })),
  );
