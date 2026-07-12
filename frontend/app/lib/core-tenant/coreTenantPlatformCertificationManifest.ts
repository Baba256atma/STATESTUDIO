import {
  CORE_TENANT_CERTIFICATION_METADATA,
  runExecutiveTenantPlatformCertification,
} from "./coreTenantPlatformCertification.ts";
import type { TenantCertificationManifest } from "./coreTenantPlatformCertificationTypes.ts";

function fingerprint(parts: readonly string[]): string {
  const source = parts.join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `core-ten-7-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function buildExecutiveTenantPlatformCertificationManifest(): TenantCertificationManifest {
  const certification = runExecutiveTenantPlatformCertification();

  return Object.freeze({
    platformId: "CORE-TEN-7",
    platformName: "Executive Tenant Platform Certification",
    platformVersion: "1.0.0",
    platformNamespace: CORE_TENANT_CERTIFICATION_METADATA.namespace,
    summary: certification.summary,
    dependencies: certification.dependencies,
    release: certification.release,
    snapshot: certification.snapshot,
    deterministicFingerprint: fingerprint([
      CORE_TENANT_CERTIFICATION_METADATA.namespace,
      CORE_TENANT_CERTIFICATION_METADATA.metadataVersion,
      ...certification.dependencies,
      ...certification.gates.map((gate) => `${gate.gateId}:${gate.passed}`),
      certification.summary.status,
      certification.release.releaseId,
    ]),
    metadataOnly: true,
    immutable: true,
  });
}

