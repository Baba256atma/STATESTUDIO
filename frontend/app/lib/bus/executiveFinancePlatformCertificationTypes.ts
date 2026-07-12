export type ExecutiveFinanceCertificationGroup =
  | "Contracts"
  | "Registry"
  | "Model"
  | "Validation"
  | "Manifest"
  | "Platform"
  | "PublicApi"
  | "Architecture";

export type ExecutiveFinanceCertificationSeverity = "Info" | "Warning" | "Error";

export type ExecutiveFinanceCertificationStatus = "Passed" | "Warning" | "Failed";

export type ExecutiveFinanceCertificationComponent =
  | "BUS-28:1"
  | "BUS-28:2"
  | "BUS-28:3"
  | "BUS-28:4"
  | "BUS-28:5"
  | "BUS-28:6"
  | "ExecutiveFinancePlatform";

export type ExecutiveFinancePlatformCertificationEntry = Readonly<{
  readonly id: `finance-certification-${Lowercase<string>}`;
  readonly component: ExecutiveFinanceCertificationComponent;
  readonly certificationGroup: ExecutiveFinanceCertificationGroup;
  readonly description: string;
  readonly severity: ExecutiveFinanceCertificationSeverity;
  readonly status: ExecutiveFinanceCertificationStatus;
  readonly result: "Compliant" | "NonCompliant";
  readonly evidence: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveFinancePlatformCertificationRegistry = Readonly<{
  readonly registryId: "executive-finance-platform-certification-registry";
  readonly version: "1.0.0";
  readonly entries: readonly ExecutiveFinancePlatformCertificationEntry[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveFinancePlatformCertificationSummary = Readonly<{
  readonly totalChecks: number;
  readonly passed: number;
  readonly warnings: number;
  readonly failed: number;
  readonly readiness: "Ready" | "NotReady";
  readonly certificationVersion: "1.0.0";
  readonly platformVersion: "1.0.0";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveFinancePlatformCertificationManifest = Readonly<{
  readonly certifiedPhases: readonly [
    "BUS-28:1",
    "BUS-28:2",
    "BUS-28:3",
    "BUS-28:4",
    "BUS-28:5",
    "BUS-28:6",
  ];
  readonly certificationTimestampMetadata: "logical-sequence-bus-28-7";
  readonly certificationVersion: "1.0.0";
  readonly certificationState: "Certified" | "NotCertified";
  readonly readinessForFreeze: "Ready" | "NotReady";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveFinancePlatformCertificationResult = Readonly<{
  readonly registry: ExecutiveFinancePlatformCertificationRegistry;
  readonly summary: ExecutiveFinancePlatformCertificationSummary;
  readonly manifest: ExecutiveFinancePlatformCertificationManifest;
  readonly certified: boolean;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;
