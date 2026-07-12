export type ExecutiveOrganizationValidationStatus = "PASS" | "WARN" | "FAIL";

export type ExecutiveOrganizationValidationSeverity =
  | "Information"
  | "Warning"
  | "Error"
  | "Critical";

export type ExecutiveOrganizationValidationCategory =
  | "Organization"
  | "OrganizationUnit"
  | "Role"
  | "Position"
  | "Reporting"
  | "Ownership"
  | "Responsibility"
  | "Hierarchy"
  | "Model"
  | "Registry"
  | "Platform";

export type ExecutiveOrganizationValidationMetadata = Readonly<{
  readonly validationNamespace: "nexora.bus.executive-organization.validation";
  readonly validationVersion: "1.0.0";
  readonly validationDescription: string;
  readonly validationDependencies: readonly string[];
  readonly validationConsumers: readonly string[];
  readonly validationStatus: ExecutiveOrganizationValidationStatus;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveOrganizationPlatformValidation = Readonly<{
  readonly platformId: "BUS-30";
  readonly platformVersion: "1.0.0";
  readonly platformNamespace: "nexora.bus.executive-organization";
  readonly platformStatus: "Published";
  readonly validationVersion: "1.0.0";
  readonly validationStatus: ExecutiveOrganizationValidationStatus;
  readonly validationMetadata: ExecutiveOrganizationValidationMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveOrganizationValidationRule = Readonly<{
  readonly ruleId: `executive-organization-validation-rule-${string}`;
  readonly ruleCode: `BUS30V-${string}`;
  readonly ruleName: string;
  readonly description: string;
  readonly severity: ExecutiveOrganizationValidationSeverity;
  readonly category: ExecutiveOrganizationValidationCategory;
  readonly metadata: Readonly<{
    readonly createdBy: "BUS-30:4";
    readonly metadataOnly: true;
    readonly immutable: true;
  }>;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveOrganizationValidationGroup = Readonly<{
  readonly groupId: `executive-organization-validation-group-${string}`;
  readonly groupName: string;
  readonly description: string;
  readonly rules: readonly ExecutiveOrganizationValidationRule[];
  readonly metadata: Readonly<{
    readonly createdBy: "BUS-30:4";
    readonly metadataOnly: true;
    readonly immutable: true;
  }>;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveOrganizationValidationSummary = Readonly<{
  readonly ruleCount: number;
  readonly groupCount: number;
  readonly platformStatus: "Published";
  readonly compatibilityStatus: "Compatible";
  readonly metadata: Readonly<{
    readonly createdBy: "BUS-30:4";
    readonly metadataOnly: true;
    readonly immutable: true;
  }>;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveOrganizationValidationCompatibility = Readonly<{
  readonly supportedPlatformVersion: "1.0.0";
  readonly supportedRegistryVersion: "1.0.0";
  readonly supportedModelVersion: "1.0.0";
  readonly compatibilityStatus: "Compatible";
  readonly metadata: Readonly<{
    readonly createdBy: "BUS-30:4";
    readonly metadataOnly: true;
    readonly immutable: true;
  }>;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveOrganizationValidationResult = Readonly<{
  readonly validationId: "executive-organization-validation";
  readonly validationVersion: "1.0.0";
  readonly validationStatus: ExecutiveOrganizationValidationStatus;
  readonly summary: ExecutiveOrganizationValidationSummary;
  readonly metadata: ExecutiveOrganizationValidationMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveOrganizationValidationBundle = Readonly<{
  readonly platform: ExecutiveOrganizationPlatformValidation;
  readonly rules: readonly ExecutiveOrganizationValidationRule[];
  readonly groups: readonly ExecutiveOrganizationValidationGroup[];
  readonly summary: ExecutiveOrganizationValidationSummary;
  readonly compatibility: ExecutiveOrganizationValidationCompatibility;
  readonly validation: ExecutiveOrganizationValidationResult;
  readonly metadata: ExecutiveOrganizationValidationMetadata;
  readonly publicApis: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;
