export type TenantValidationDependency = Readonly<{
  readonly dependencyId: "CORE-TEN-1" | "CORE-TEN-2" | "CORE-TEN-3" | "CORE-TEN-4" | "CORE-TEN-5";
  readonly dependencyName: string;
  readonly available: boolean;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type TenantValidationGate = Readonly<{
  readonly gateId: string;
  readonly gateName: string;
  readonly passed: boolean;
  readonly diagnostics: readonly string[];
}>;

export type TenantValidationCheck = Readonly<{
  readonly checkId: string;
  readonly description: string;
  readonly passed: boolean;
}>;

export type TenantValidationSummary = Readonly<{
  readonly totalGates: number;
  readonly passedGates: number;
  readonly failedGates: number;
  readonly totalChecks: number;
  readonly passedChecks: number;
  readonly failedChecks: number;
  readonly status: "PASS" | "FAIL";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type TenantValidationMetadata = Readonly<{
  readonly namespace: "nexora.core.tenant.validation";
  readonly metadataVersion: "1.0.0";
  readonly supportedContracts: readonly ["CORE-TEN-1", "CORE-TEN-2", "CORE-TEN-3", "CORE-TEN-4", "CORE-TEN-5"];
  readonly tags: readonly string[];
  readonly labels: Readonly<Record<string, string>>;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type TenantValidationSnapshot = Readonly<{
  readonly snapshotId: "core-tenant-validation-snapshot";
  readonly gateCount: number;
  readonly dependencyCount: number;
  readonly checkCount: number;
  readonly status: "PASS" | "FAIL";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type TenantValidationResult = Readonly<{
  readonly status: "PASS" | "FAIL";
  readonly gates: readonly TenantValidationGate[];
  readonly checks: readonly TenantValidationCheck[];
  readonly summary: TenantValidationSummary;
  readonly dependencies: readonly TenantValidationDependency[];
  readonly snapshot: TenantValidationSnapshot;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type TenantValidationManifest = Readonly<{
  readonly platformId: "CORE-TEN-6";
  readonly platformName: "Executive Tenant Validation Platform";
  readonly platformVersion: "1.0.0";
  readonly platformNamespace: "nexora.core.tenant.validation";
  readonly dependencies: readonly TenantValidationDependency[];
  readonly summary: TenantValidationSummary;
  readonly snapshot: TenantValidationSnapshot;
  readonly deterministicFingerprint: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

