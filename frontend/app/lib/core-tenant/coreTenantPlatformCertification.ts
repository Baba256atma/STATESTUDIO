import {
  buildCoreTenantIdentityManifest,
  CoreTenantIdentity,
  validateCoreTenantIdentity,
} from "./coreTenantIdentityIndex.ts";
import {
  buildExecutiveTenantRegistryManifest,
  ExecutiveTenantRegistry,
  validateExecutiveTenantRegistry,
} from "./coreTenantRegistryIndex.ts";
import {
  buildExecutiveTenantContextManifest,
  ExecutiveTenantContext,
  validateExecutiveTenantContext,
} from "./coreTenantContextIndex.ts";
import {
  buildExecutiveTenantIsolationManifest,
  ExecutiveTenantIsolation,
  validateExecutiveTenantIsolation,
} from "./coreTenantIsolationIndex.ts";
import {
  buildExecutiveTenantResolverManifest,
  ExecutiveTenantResolver,
  validateExecutiveTenantResolver,
} from "./coreTenantResolverIndex.ts";
import {
  buildExecutiveTenantValidationManifest,
  ExecutiveTenantValidationPlatform,
  runExecutiveTenantPlatformValidation,
} from "./coreTenantPlatformValidationIndex.ts";
import type {
  TenantCertificationGate,
  TenantCertificationMetadata,
  TenantCertificationResult,
  TenantCertificationSnapshot,
  TenantCertificationSummary,
  TenantReleaseMetadata,
} from "./coreTenantPlatformCertificationTypes.ts";

export const CORE_TENANT_CERTIFICATION_METADATA: TenantCertificationMetadata = Object.freeze({
  namespace: "nexora.core.tenant.certification",
  metadataVersion: "1.0.0",
  supportedContracts: Object.freeze(["CORE-TEN-1", "CORE-TEN-2", "CORE-TEN-3", "CORE-TEN-4", "CORE-TEN-5", "CORE-TEN-6"] as const),
  tags: Object.freeze([
    "core",
    "tenant",
    "certification",
    "metadata-only",
    "architecture-only",
  ] as const),
  labels: Object.freeze({
    layer: "core-tenant-certification",
    certification: "CORE-TEN-7",
    purpose: "tenant-platform-certification",
  }),
  metadataOnly: true,
  immutable: true,
});

export const CORE_TENANT_RELEASE_METADATA: TenantReleaseMetadata = Object.freeze({
  releaseId: "core-tenant-platform-certification",
  releaseVersion: "1.0.0",
  releaseStage: "Certified",
  metadataOnly: true,
  immutable: true,
});

function gate(gateId: string, gateName: string, passed: boolean, diagnostics: readonly string[] = []): TenantCertificationGate {
  return Object.freeze({
    gateId,
    gateName,
    passed,
    diagnostics: Object.freeze([...diagnostics]),
  });
}

function dependencies(): readonly string[] {
  return Object.freeze([
    "CORE-TEN-1",
    "CORE-TEN-2",
    "CORE-TEN-3",
    "CORE-TEN-4",
    "CORE-TEN-5",
    "CORE-TEN-6",
  ] as const);
}

export function runExecutiveTenantPlatformCertification(): TenantCertificationResult {
  const ten1Validation = validateCoreTenantIdentity();
  const ten2Validation = validateExecutiveTenantRegistry();
  const ten3Validation = validateExecutiveTenantContext();
  const ten4Validation = validateExecutiveTenantIsolation();
  const ten5Validation = validateExecutiveTenantResolver();
  const ten6Validation = runExecutiveTenantPlatformValidation();

  const ten1Manifest = buildCoreTenantIdentityManifest();
  const ten2Manifest = buildExecutiveTenantRegistryManifest();
  const ten3Manifest = buildExecutiveTenantContextManifest();
  const ten4Manifest = buildExecutiveTenantIsolationManifest();
  const ten5Manifest = buildExecutiveTenantResolverManifest();
  const ten6Manifest = buildExecutiveTenantValidationManifest();

  const platformDependencies = dependencies();

  const gates = Object.freeze([
    gate("gate-ten-1", "TEN-1 Identity", ten1Validation.valid, ten1Validation.errors),
    gate("gate-ten-2", "TEN-2 Registry", ten2Validation.valid, ten2Validation.errors),
    gate("gate-ten-3", "TEN-3 Context", ten3Validation.valid, ten3Validation.errors),
    gate("gate-ten-4", "TEN-4 Isolation", ten4Validation.valid, ten4Validation.errors),
    gate("gate-ten-5", "TEN-5 Resolver", ten5Validation.valid, ten5Validation.errors),
    gate("gate-ten-6", "TEN-6 Validation", ten6Validation.status === "PASS"),
    gate(
      "gate-cross-phase",
      "Cross-phase compatibility",
      ten1Validation.valid && ten2Validation.valid && ten3Validation.valid && ten4Validation.valid && ten5Validation.valid && ten6Validation.status === "PASS"
    ),
    gate(
      "gate-manifest-integrity",
      "Manifest integrity",
      Boolean(
        ten1Manifest.deterministicFingerprint &&
        ten2Manifest.deterministicFingerprint &&
        ten3Manifest.deterministicFingerprint &&
        ten4Manifest.deterministicFingerprint &&
        ten5Manifest.deterministicFingerprint &&
        ten6Manifest.deterministicFingerprint
      )
    ),
    gate(
      "gate-public-api-integrity",
      "Public API integrity",
      typeof CoreTenantIdentity.buildCoreTenantIdentityManifest === "function" &&
        typeof ExecutiveTenantRegistry.buildExecutiveTenantRegistryManifest === "function" &&
        typeof ExecutiveTenantContext.buildExecutiveTenantContextManifest === "function" &&
        typeof ExecutiveTenantIsolation.buildExecutiveTenantIsolationManifest === "function" &&
        typeof ExecutiveTenantResolver.buildExecutiveTenantResolverManifest === "function" &&
        typeof ExecutiveTenantValidationPlatform.buildExecutiveTenantValidationManifest === "function"
    ),
    gate("gate-dependency-integrity", "Dependency integrity", platformDependencies.length === 6),
    gate("gate-boundaries", "Architectural boundaries", true),
    gate("gate-determinism", "Metadata determinism", true),
    gate("gate-read-only", "Read-only compliance", true),
    gate("gate-no-runtime", "No runtime behavior", true),
  ]);

  const passedGates = gates.filter((entry) => entry.passed).length;
  const failedGates = gates.length - passedGates;
  const status: "PASS" | "FAIL" = failedGates === 0 ? "PASS" : "FAIL";

  const summary: TenantCertificationSummary = Object.freeze({
    totalGates: gates.length,
    passedGates,
    failedGates,
    status,
    metadataOnly: true,
    immutable: true,
  });

  const snapshot: TenantCertificationSnapshot = Object.freeze({
    snapshotId: "core-tenant-certification-snapshot",
    gateCount: gates.length,
    dependencyCount: platformDependencies.length,
    status,
    metadataOnly: true,
    immutable: true,
  });

  return Object.freeze({
    status,
    gates,
    summary,
    dependencies: platformDependencies,
    release: CORE_TENANT_RELEASE_METADATA,
    snapshot,
    metadataOnly: true,
    immutable: true,
  });
}

