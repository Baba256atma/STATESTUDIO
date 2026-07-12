export type ExecutiveResourceValidationStatus = "PASS" | "WARN" | "FAIL";

export type ExecutiveResourceValidationSeverity =
  | "Information"
  | "Warning"
  | "Error"
  | "Critical";

export type ExecutiveResourceValidationCategory =
  | "Resource"
  | "Category"
  | "Type"
  | "Owner"
  | "Allocation"
  | "Capacity"
  | "Utilization"
  | "Availability"
  | "Constraint"
  | "Lifecycle"
  | "Classification"
  | "Registry"
  | "Model"
  | "Platform"
  | "PublicAPI";

export type ExecutiveResourceValidationMetadata = Readonly<{
  readonly validationNamespace: "nexora.bus.executive-resource.validation";
  readonly validationVersion: "1.0.0";
  readonly validationDescription: string;
  readonly validationDependencies: readonly string[];
  readonly validationConsumers: readonly string[];
  readonly validationStatus: ExecutiveResourceValidationStatus;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourcePlatformValidation = Readonly<{
  readonly platformId: "BUS-31";
  readonly platformName: "Executive Resource Intelligence Platform";
  readonly platformNamespace: "nexora.bus.executive-resource";
  readonly platformVersion: "1.0.0";
  readonly platformStatus: "Published";
  readonly validationVersion: "1.0.0";
  readonly validationStatus: ExecutiveResourceValidationStatus;
  readonly validationMetadata: ExecutiveResourceValidationMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceValidationRule = Readonly<{
  readonly ruleId: `executive-resource-validation-rule-${string}`;
  readonly ruleCode: `BUS31V-${string}`;
  readonly ruleName: string;
  readonly description: string;
  readonly severity: ExecutiveResourceValidationSeverity;
  readonly category: ExecutiveResourceValidationCategory;
  readonly metadata: Readonly<{
    readonly createdBy: "BUS-31:4";
    readonly metadataOnly: true;
    readonly immutable: true;
  }>;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceValidationGroup = Readonly<{
  readonly groupId: `executive-resource-validation-group-${string}`;
  readonly groupName: string;
  readonly description: string;
  readonly rules: readonly ExecutiveResourceValidationRule[];
  readonly metadata: Readonly<{
    readonly createdBy: "BUS-31:4";
    readonly metadataOnly: true;
    readonly immutable: true;
  }>;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceValidationSummary = Readonly<{
  readonly ruleCount: number;
  readonly groupCount: number;
  readonly platformStatus: "Published";
  readonly compatibilityStatus: "Compatible";
  readonly metadata: Readonly<{
    readonly createdBy: "BUS-31:4";
    readonly metadataOnly: true;
    readonly immutable: true;
  }>;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceValidationCompatibility = Readonly<{
  readonly supportedPlatformVersion: "1.0.0";
  readonly supportedRegistryVersion: "1.0.0";
  readonly supportedModelVersion: "1.0.0";
  readonly compatibilityStatus: "Compatible";
  readonly metadata: Readonly<{
    readonly createdBy: "BUS-31:4";
    readonly metadataOnly: true;
    readonly immutable: true;
  }>;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceValidationResult = Readonly<{
  readonly validationId: "executive-resource-validation";
  readonly validationVersion: "1.0.0";
  readonly validationStatus: ExecutiveResourceValidationStatus;
  readonly summary: ExecutiveResourceValidationSummary;
  readonly metadata: ExecutiveResourceValidationMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceValidationBundle = Readonly<{
  readonly platform: ExecutiveResourcePlatformValidation;
  readonly rules: readonly ExecutiveResourceValidationRule[];
  readonly groups: readonly ExecutiveResourceValidationGroup[];
  readonly summary: ExecutiveResourceValidationSummary;
  readonly compatibility: ExecutiveResourceValidationCompatibility;
  readonly validation: ExecutiveResourceValidationResult;
  readonly metadata: ExecutiveResourceValidationMetadata;
  readonly publicApis: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;
