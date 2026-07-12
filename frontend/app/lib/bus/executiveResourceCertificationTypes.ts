export type ExecutiveResourceCertificationStatus = "PASS" | "WARN" | "FAIL";

export type ExecutiveResourceCertificationSeverity =
  | "Information"
  | "Warning"
  | "Error"
  | "Critical";

export type ExecutiveResourcePlatformCertification = Readonly<{
  readonly certificationId: "executive-resource-certification";
  readonly certificationVersion: "1.0.0";
  readonly platformId: "BUS-31";
  readonly platformVersion: "1.0.0";
  readonly certificationStatus: ExecutiveResourceCertificationStatus;
  readonly certificationDate: "2026-07-06";
  readonly certificationLevel: "Platform";
  readonly certificationMetadata: Readonly<{
    readonly certificationNamespace: "nexora.bus.executive-resource.certification";
    readonly certificationDescription: string;
    readonly certificationDependencies: readonly string[];
    readonly certificationConsumers: readonly string[];
    readonly metadataOnly: true;
    readonly immutable: true;
  }>;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceCertificationGate = Readonly<{
  readonly gateId: `executive-resource-certification-gate-${string}`;
  readonly gateCode: `BUS31C-${string}`;
  readonly gateName: string;
  readonly description: string;
  readonly status: ExecutiveResourceCertificationStatus;
  readonly severity: ExecutiveResourceCertificationSeverity;
  readonly metadata: Readonly<{
    readonly createdBy: "BUS-31:7";
    readonly metadataOnly: true;
    readonly immutable: true;
  }>;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceCertificationSummary = Readonly<{
  readonly gateCount: number;
  readonly passedGateCount: number;
  readonly failedGateCount: number;
  readonly platformStatus: "Published";
  readonly certificationStatus: ExecutiveResourceCertificationStatus;
  readonly metadata: Readonly<{
    readonly createdBy: "BUS-31:7";
    readonly metadataOnly: true;
    readonly immutable: true;
  }>;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceCertificationCompatibility = Readonly<{
  readonly supportedPlatformVersion: "1.0.0";
  readonly certificationVersion: "1.0.0";
  readonly compatibilityStatus: "Compatible";
  readonly metadata: Readonly<{
    readonly createdBy: "BUS-31:7";
    readonly metadataOnly: true;
    readonly immutable: true;
  }>;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceCertificationPolicy = Readonly<{
  readonly policyId: "executive-resource-certification-policy";
  readonly policyVersion: "1.0.0";
  readonly policyName: "Executive Resource Platform Certification Policy";
  readonly policyDescription: string;
  readonly requirements: readonly string[];
  readonly metadata: Readonly<{
    readonly createdBy: "BUS-31:7";
    readonly metadataOnly: true;
    readonly immutable: true;
  }>;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceCertificationMetadata = Readonly<{
  readonly certificationNamespace: "nexora.bus.executive-resource.certification";
  readonly certificationVersion: "1.0.0";
  readonly certificationStatus: ExecutiveResourceCertificationStatus;
  readonly certificationDescription: string;
  readonly certificationDependencies: readonly string[];
  readonly certificationConsumers: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceCertificationBundle = Readonly<{
  readonly platform: ExecutiveResourcePlatformCertification;
  readonly gates: readonly ExecutiveResourceCertificationGate[];
  readonly summary: ExecutiveResourceCertificationSummary;
  readonly compatibility: ExecutiveResourceCertificationCompatibility;
  readonly policy: ExecutiveResourceCertificationPolicy;
  readonly metadata: ExecutiveResourceCertificationMetadata;
  readonly publicApis: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;
