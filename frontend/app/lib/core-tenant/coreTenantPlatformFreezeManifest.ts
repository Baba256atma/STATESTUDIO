import { buildExecutiveTenantPlatformCertificationManifest, runExecutiveTenantPlatformCertification } from "./coreTenantPlatformCertificationIndex.ts";
import {
  CORE_TENANT_PLATFORM_COMPATIBILITY_MATRIX,
  CORE_TENANT_PLATFORM_EXTENSION_POLICY,
} from "./coreTenantPlatformCompatibility.ts";
import {
  CORE_TENANT_PLATFORM_DEPENDENCY_REGISTRY,
  CORE_TENANT_PLATFORM_PHASE_REGISTRY,
  CORE_TENANT_PLATFORM_PUBLIC_API_REGISTRY,
} from "./coreTenantPlatformFreezeRegistry.ts";
import type {
  TenantPlatformCertificationReference,
  TenantPlatformFreezeManifest,
  TenantPlatformFreezeState,
  TenantPlatformRegressionSummary,
  TenantPlatformRelease,
} from "./coreTenantPlatformFreezeTypes.ts";

function fingerprint(parts: readonly string[]): string {
  const source = parts.join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `core-ten-8-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function buildExecutiveTenantPlatformFreezeManifest(): TenantPlatformFreezeManifest {
  const certification = runExecutiveTenantPlatformCertification();
  const certificationManifest = buildExecutiveTenantPlatformCertificationManifest();

  const certificationReference: TenantPlatformCertificationReference = Object.freeze({
    certificationPhaseId: "CORE-TEN-7",
    certificationStatus: "PASS",
    certifiedContracts: Object.freeze([
      "CORE-TEN-1",
      "CORE-TEN-2",
      "CORE-TEN-3",
      "CORE-TEN-4",
      "CORE-TEN-5",
      "CORE-TEN-6",
      "CORE-TEN-7",
    ] as const),
    metadataOnly: true,
    immutable: true,
  });

  const regressionSummary: TenantPlatformRegressionSummary = Object.freeze({
    regressionId: "core-tenant-platform-regression-summary",
    validatedPhases: certificationReference.certifiedContracts,
    status: certification.status,
    metadataOnly: true,
    immutable: true,
  });

  const freezeState: TenantPlatformFreezeState = Object.freeze({
    phaseId: "CORE-TEN-8",
    platformId: "CORE-TEN",
    platformName: "Executive Tenant Platform",
    status: certification.status,
    freezeState: "FROZEN",
    releaseState: "RELEASED",
    metadataOnly: true,
    immutable: true,
  });

  const release: TenantPlatformRelease = Object.freeze({
    releaseId: "core-tenant-platform-freeze",
    releaseVersion: "1.0.0",
    releaseState: "CERTIFIED_FROZEN_RELEASED",
    metadataOnly: true,
    immutable: true,
  });

  return Object.freeze({
    platformId: "CORE-TEN-8",
    platformName: "Executive Tenant Platform Freeze",
    platformVersion: "1.0.0",
    platformNamespace: "nexora.core.tenant.freeze",
    certificationReference,
    compatibilityMatrix: CORE_TENANT_PLATFORM_COMPATIBILITY_MATRIX,
    publicApiRegistry: CORE_TENANT_PLATFORM_PUBLIC_API_REGISTRY,
    phaseRegistry: CORE_TENANT_PLATFORM_PHASE_REGISTRY,
    dependencyRegistry: CORE_TENANT_PLATFORM_DEPENDENCY_REGISTRY,
    extensionPolicy: CORE_TENANT_PLATFORM_EXTENSION_POLICY,
    regressionSummary,
    freezeState,
    release,
    deterministicFingerprint: fingerprint([
      certificationManifest.deterministicFingerprint,
      ...CORE_TENANT_PLATFORM_PHASE_REGISTRY,
      ...CORE_TENANT_PLATFORM_DEPENDENCY_REGISTRY,
      ...CORE_TENANT_PLATFORM_PUBLIC_API_REGISTRY,
      ...CORE_TENANT_PLATFORM_COMPATIBILITY_MATRIX.map((entry) => `${entry.platformId}:${entry.compatible}`),
      CORE_TENANT_PLATFORM_EXTENSION_POLICY.policyId,
      regressionSummary.status,
      freezeState.releaseState,
      release.releaseState,
    ]),
    metadataOnly: true,
    immutable: true,
  });
}

