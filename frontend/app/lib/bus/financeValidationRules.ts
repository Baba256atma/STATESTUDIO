import type {
  FinanceValidatedComponent,
  FinanceValidationEntry,
  FinanceValidationSeverity,
  FinanceValidationStatus,
  FinanceValidationType,
} from "./financeValidationTypes.ts";

export type FinanceValidationRule = Readonly<{
  readonly id: FinanceValidationEntry["id"];
  readonly name: string;
  readonly description: string;
  readonly severity: FinanceValidationSeverity;
  readonly validatedComponent: FinanceValidatedComponent;
  readonly validationType: FinanceValidationType;
}>;

export function createFinanceValidationEntry(
  rule: FinanceValidationRule,
  status: FinanceValidationStatus,
): FinanceValidationEntry {
  return Object.freeze({
    id: rule.id,
    name: rule.name,
    description: rule.description,
    severity: rule.severity,
    status,
    validatedComponent: rule.validatedComponent,
    validationType: rule.validationType,
    metadataOnly: true,
    immutable: true,
  });
}

export const FINANCE_VALIDATION_RULES: readonly FinanceValidationRule[] = Object.freeze([
  Object.freeze({
    id: "finance-validation-contracts",
    name: "Finance Contracts Exist",
    description: "Verifies finance contracts, identity, metadata, enums, and public APIs are published.",
    severity: "Error",
    validatedComponent: "FinanceContracts",
    validationType: "ContractValidation",
  }),
  Object.freeze({
    id: "finance-validation-registry",
    name: "Finance Registry Integrity",
    description: "Verifies object, category, API registry, and registry manifest integrity.",
    severity: "Error",
    validatedComponent: "FinanceRegistry",
    validationType: "RegistryValidation",
  }),
  Object.freeze({
    id: "finance-validation-model",
    name: "Finance Model Integrity",
    description: "Verifies model, relationship, ownership, aggregation, and dependency registries exist.",
    severity: "Error",
    validatedComponent: "FinanceModel",
    validationType: "ModelValidation",
  }),
  Object.freeze({
    id: "finance-validation-dependencies",
    name: "Finance Dependency Boundaries",
    description: "Verifies public API consumption only and registry-model compatibility.",
    severity: "Error",
    validatedComponent: "FinanceModel",
    validationType: "DependencyValidation",
  }),
  Object.freeze({
    id: "finance-validation-structure",
    name: "Finance Structural Guarantees",
    description: "Verifies immutable metadata, readonly structures, deterministic outputs, and unique identifiers.",
    severity: "Error",
    validatedComponent: "FinanceValidation",
    validationType: "StructuralValidation",
  }),
  Object.freeze({
    id: "finance-validation-public-api",
    name: "Finance Public APIs",
    description: "Verifies finance platform, registry, model, and validation public APIs are exported.",
    severity: "Error",
    validatedComponent: "ExecutiveFinanceValidationFoundation",
    validationType: "PublicApiValidation",
  }),
] as const);
