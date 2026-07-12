export type ExecutiveOrganizationCertificationStatus = "PASS" | "WARN" | "FAIL";

export type ExecutiveOrganizationCertificationSeverity =
  | "Information"
  | "Warning"
  | "Error"
  | "Critical";

export type ExecutiveOrganizationPlatformCertification = Readonly<{
  readonly certificationId: "executive-organization-certification";
  readonly certificationVersion: "1.0.0";
  readonly platformId: "BUS-30";
  readonly platformVersion: "1.0.0";
  readonly certificationStatus: ExecutiveOrganizationCertificationStatus;
  readonly certificationDate: "2026-07-06";
  readonly certificationLevel: "Platform";
  readonly certificationMetadata: Readonly<{
    readonly certificationNamespace: "nexora.bus.executive-organization.certification";
    readonly certificationDescription: string;
    readonly certificationDependencies: readonly string[];
    readonly certificationConsumers: readonly string[];
    readonly metadataOnly: true;
    readonly immutable: true;
  }>;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveOrganizationCertificationGate = Readonly<{
  readonly gateId: `executive-organization-certification-gate-${string}`;
  readonly gateCode: `BUS30C-${string}`;
  readonly gateName: string;
  readonly description: string;
  readonly status: ExecutiveOrganizationCertificationStatus;
  readonly severity: ExecutiveOrganizationCertificationSeverity;
  readonly metadata: Readonly<{
    readonly createdBy: "BUS-30:7";
    readonly metadataOnly: true;
    readonly immutable: true;
  }>;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveOrganizationCertificationSummary = Readonly<{
  readonly gateCount: number;
  readonly passedGateCount: number;
  readonly failedGateCount: number;
  readonly platformStatus: "Published";
  readonly certificationStatus: ExecutiveOrganizationCertificationStatus;
  readonly metadata: Readonly<{
    readonly createdBy: "BUS-30:7";
    readonly metadataOnly: true;
    readonly immutable: true;
  }>;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveOrganizationCertificationCompatibility = Readonly<{
  readonly supportedPlatformVersion: "1.0.0";
  readonly certificationVersion: "1.0.0";
  readonly compatibilityStatus: "Compatible";
  readonly metadata: Readonly<{
    readonly createdBy: "BUS-30:7";
    readonly metadataOnly: true;
    readonly immutable: true;
  }>;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveOrganizationCertificationPolicy = Readonly<{
  readonly policyId: "executive-organization-certification-policy";
  readonly policyVersion: "1.0.0";
  readonly policyName: "Executive Organization Platform Certification Policy";
  readonly policyDescription: string;
  readonly requirements: readonly string[];
  readonly metadata: Readonly<{
    readonly createdBy: "BUS-30:7";
    readonly metadataOnly: true;
    readonly immutable: true;
  }>;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveOrganizationCertificationMetadata = Readonly<{
  readonly certificationNamespace: "nexora.bus.executive-organization.certification";
  readonly certificationVersion: "1.0.0";
  readonly certificationStatus: ExecutiveOrganizationCertificationStatus;
  readonly certificationDescription: string;
  readonly certificationDependencies: readonly string[];
  readonly certificationConsumers: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveOrganizationCertificationBundle = Readonly<{
  readonly platform: ExecutiveOrganizationPlatformCertification;
  readonly gates: readonly ExecutiveOrganizationCertificationGate[];
  readonly summary: ExecutiveOrganizationCertificationSummary;
  readonly compatibility: ExecutiveOrganizationCertificationCompatibility;
  readonly policy: ExecutiveOrganizationCertificationPolicy;
  readonly metadata: ExecutiveOrganizationCertificationMetadata;
  readonly publicApis: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;
