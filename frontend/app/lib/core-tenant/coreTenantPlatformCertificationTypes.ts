export type TenantReleaseMetadata = Readonly<{
  readonly releaseId: "core-tenant-platform-certification";
  readonly releaseVersion: "1.0.0";
  readonly releaseStage: "Certified";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type TenantCertificationMetadata = Readonly<{
  readonly namespace: "nexora.core.tenant.certification";
  readonly metadataVersion: "1.0.0";
  readonly supportedContracts: readonly ["CORE-TEN-1", "CORE-TEN-2", "CORE-TEN-3", "CORE-TEN-4", "CORE-TEN-5", "CORE-TEN-6"];
  readonly tags: readonly string[];
  readonly labels: Readonly<Record<string, string>>;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type TenantCertificationGate = Readonly<{
  readonly gateId: string;
  readonly gateName: string;
  readonly passed: boolean;
  readonly diagnostics: readonly string[];
}>;

export type TenantCertificationSummary = Readonly<{
  readonly totalGates: number;
  readonly passedGates: number;
  readonly failedGates: number;
  readonly status: "PASS" | "FAIL";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type TenantCertificationSnapshot = Readonly<{
  readonly snapshotId: "core-tenant-certification-snapshot";
  readonly gateCount: number;
  readonly dependencyCount: number;
  readonly status: "PASS" | "FAIL";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type TenantCertificationResult = Readonly<{
  readonly status: "PASS" | "FAIL";
  readonly gates: readonly TenantCertificationGate[];
  readonly summary: TenantCertificationSummary;
  readonly dependencies: readonly string[];
  readonly release: TenantReleaseMetadata;
  readonly snapshot: TenantCertificationSnapshot;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type TenantCertificationManifest = Readonly<{
  readonly platformId: "CORE-TEN-7";
  readonly platformName: "Executive Tenant Platform Certification";
  readonly platformVersion: "1.0.0";
  readonly platformNamespace: "nexora.core.tenant.certification";
  readonly summary: TenantCertificationSummary;
  readonly dependencies: readonly string[];
  readonly release: TenantReleaseMetadata;
  readonly snapshot: TenantCertificationSnapshot;
  readonly deterministicFingerprint: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

