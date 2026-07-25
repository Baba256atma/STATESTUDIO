/** ASSISTANT-8:4 — Validation identity, types, and structural metadata. */
import { ExecutiveActionExecutionModel } from "./executiveActionExecutionModel.ts";

export type ExecutionValidationSeverity =
  | "Critical"
  | "Error"
  | "Warning"
  | "Information";

export interface ExecutionValidationCategoryMetadata {
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

export interface ExecutionValidationRuleMetadata {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly severity: ExecutionValidationSeverity;
  readonly validationTarget: "ASSISTANT-8:3/ExecutiveActionExecutionModel";
  readonly expectedResult: "Satisfied";
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutionValidationGateMetadata {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly declaredState: "Passed";
  readonly evidenceRules: readonly string[];
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutionValidationPolicyMetadata {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly order: number;
  readonly version: "1.0.0";
  readonly status: "Canonical";
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export const ExecutiveActionExecutionValidationIdentity = Object.freeze({
  id: "ASSISTANT-8:4/ExecutiveActionExecutionValidation",
  name: "Assistant Executive Action Execution Validation",
  phaseId: "ASSISTANT-8:4",
  namespace: "nexora.assistant.executive-action-execution.validation",
  version: "1.0.0",
  status: "Validation",
  stage: "ReadyForManifest",
  readiness: "ReadyForManifest",
  canonical: true,
  mutable: false,
  sourceModel: "ASSISTANT-8:3/ExecutiveActionExecutionModel",
  ownership: "Nexora Assistant",
  metadataOnly: true,
  immutable: true,
} as const);

export const ExecutionValidationMetadataFields = Object.freeze([
  "canonical id",
  "version",
  "namespace",
  "ownership",
  "readiness",
  "lifecycle",
  "compatibility",
  "release status",
] as const);

export const ExecutionValidationStructuralMetadata = Object.freeze({
  identity: ExecutiveActionExecutionValidationIdentity,
  sourceModel: ExecutiveActionExecutionModel.identity,
  metadataFields: ExecutionValidationMetadataFields,
  responsibilities: Object.freeze([
    "model integrity",
    "execution consistency",
    "relationship correctness",
    "metadata completeness",
    "lifecycle validity",
    "registry compatibility",
    "policy compliance",
    "execution quality",
  ]),
  compatibility: Object.freeze({
    modelCompatible: true,
    registryCompatible: true,
    foundationCompatible: true,
    manifestCompatible: true,
  }),
  metadataOnly: true,
  immutable: true,
} as const);

export const registerValidationRules = (
  category: string,
  names: readonly string[],
  startOrder: number,
  severity: ExecutionValidationSeverity = "Error",
): readonly ExecutionValidationRuleMetadata[] => Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `ASSISTANT-8:4/Rule/${String(startOrder + index).padStart(2, "0")}`,
    name,
    description:
      `Canonical ${category} validation rule requiring ${name}.`,
    category,
    severity,
    validationTarget: "ASSISTANT-8:3/ExecutiveActionExecutionModel",
    expectedResult: "Satisfied",
    order: startOrder + index,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
