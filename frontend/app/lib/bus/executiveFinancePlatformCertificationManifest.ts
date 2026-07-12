import type { ExecutiveFinancePlatformCertificationManifest } from "./executiveFinancePlatformCertificationTypes.ts";

export function buildExecutiveFinancePlatformCertificationManifest(
  certified: boolean,
): ExecutiveFinancePlatformCertificationManifest {
  return Object.freeze({
    certifiedPhases: Object.freeze([
      "BUS-28:1",
      "BUS-28:2",
      "BUS-28:3",
      "BUS-28:4",
      "BUS-28:5",
      "BUS-28:6",
    ] as const),
    certificationTimestampMetadata: "logical-sequence-bus-28-7",
    certificationVersion: "1.0.0",
    certificationState: certified ? "Certified" : "NotCertified",
    readinessForFreeze: certified ? "Ready" : "NotReady",
    metadataOnly: true,
    immutable: true,
  });
}
