export type FinanceValidationSeverity = "Info" | "Warning" | "Error";

export type FinanceValidationStatus = "Passed" | "Warning" | "Failed";

export type FinanceValidationType =
  | "ContractValidation"
  | "RegistryValidation"
  | "ModelValidation"
  | "DependencyValidation"
  | "StructuralValidation"
  | "PublicApiValidation";

export type FinanceValidatedComponent =
  | "FinanceContracts"
  | "FinanceRegistry"
  | "FinanceModel"
  | "FinanceValidation"
  | "ExecutiveFinancePlatformFoundation"
  | "ExecutiveFinanceRegistryFoundation"
  | "ExecutiveFinanceModelFoundation"
  | "ExecutiveFinanceValidationFoundation";

export type FinanceValidationEntry = Readonly<{
  readonly id: `finance-validation-${Lowercase<string>}`;
  readonly name: string;
  readonly description: string;
  readonly severity: FinanceValidationSeverity;
  readonly status: FinanceValidationStatus;
  readonly validatedComponent: FinanceValidatedComponent;
  readonly validationType: FinanceValidationType;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type FinanceValidationRegistry = Readonly<{
  readonly registryId: "finance-validation-registry";
  readonly version: "1.0.0";
  readonly validations: readonly FinanceValidationEntry[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type FinanceValidationSummary = Readonly<{
  readonly validationCount: number;
  readonly passedCount: number;
  readonly warningCount: number;
  readonly failedCount: number;
  readonly deterministic: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type FinanceValidationManifest = Readonly<{
  readonly phaseId: "BUS-28:4";
  readonly version: "1.0.0";
  readonly consumedPhases: readonly ["BUS-28:1", "BUS-28:2", "BUS-28:3"];
  readonly validationCount: number;
  readonly passedCount: number;
  readonly warningCount: number;
  readonly failedCount: number;
  readonly publicApiCount: number;
  readonly certificationReadiness: "Ready" | "NotReady";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type FinanceValidationResult = Readonly<{
  readonly registry: FinanceValidationRegistry;
  readonly summary: FinanceValidationSummary;
  readonly valid: boolean;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;
