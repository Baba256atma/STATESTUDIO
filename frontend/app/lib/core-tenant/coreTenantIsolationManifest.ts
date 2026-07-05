import { CORE_TENANT_ISOLATION } from "./coreTenantIsolation.ts";
import type { TenantIsolationManifest } from "./coreTenantIsolationTypes.ts";

function fingerprint(parts: readonly string[]): string {
  const source = parts.join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `core-ten-4-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function buildExecutiveTenantIsolationManifest(): TenantIsolationManifest {
  const isolation = CORE_TENANT_ISOLATION;

  return Object.freeze({
    platformId: "CORE-TEN-4",
    platformName: "Executive Tenant Isolation Contract",
    platformVersion: "1.0.0",
    platformNamespace: "nexora.core.tenant.isolation",
    compatibility: isolation.metadata.compatibility,
    snapshot: isolation.snapshot,
    deterministicFingerprint: fingerprint([
      isolation.identityReference.tenantId,
      isolation.registryReference.metadata.registryId,
      isolation.contextReference.contextId,
      isolation.boundary.boundaryId,
      ...isolation.domains,
      ...isolation.rules.map((rule) => `${rule.ruleId}:${rule.domain}:${rule.scope}`),
      ...isolation.guarantees.map((guarantee) => `${guarantee.guaranteeId}:${guarantee.domain}:${guarantee.guaranteeType}`),
      ...isolation.risks.map((risk) => `${risk.riskId}:${risk.domain}:${risk.riskLevel}`),
    ]),
    metadataOnly: true,
    immutable: true,
  });
}

