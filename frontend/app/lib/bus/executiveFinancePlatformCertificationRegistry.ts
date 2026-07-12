import type {
  ExecutiveFinancePlatformCertificationEntry,
  ExecutiveFinancePlatformCertificationRegistry,
  ExecutiveFinancePlatformCertificationSummary,
} from "./executiveFinancePlatformCertificationTypes.ts";

export function buildExecutiveFinancePlatformCertificationRegistry(
  entries: readonly ExecutiveFinancePlatformCertificationEntry[],
): ExecutiveFinancePlatformCertificationRegistry {
  return Object.freeze({
    registryId: "executive-finance-platform-certification-registry",
    version: "1.0.0",
    entries: Object.freeze([...entries]),
    metadataOnly: true,
    immutable: true,
  });
}

export function buildExecutiveFinancePlatformCertificationSummary(
  entries: readonly ExecutiveFinancePlatformCertificationEntry[],
): ExecutiveFinancePlatformCertificationSummary {
  const passed = entries.filter((entry) => entry.status === "Passed").length;
  const warnings = entries.filter((entry) => entry.status === "Warning").length;
  const failed = entries.filter((entry) => entry.status === "Failed").length;

  return Object.freeze({
    totalChecks: entries.length,
    passed,
    warnings,
    failed,
    readiness: failed === 0 ? "Ready" : "NotReady",
    certificationVersion: "1.0.0",
    platformVersion: "1.0.0",
    metadataOnly: true,
    immutable: true,
  });
}
