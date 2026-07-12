import { ExecutiveFinancePlatformFreezeRegistry } from "./executiveFinancePlatformFreezeRegistry.ts";
import { ExecutiveFinancePlatformCompatibility } from "./executiveFinancePlatformCompatibility.ts";
import { ExecutiveFinancePlatformRegression } from "./executiveFinancePlatformRegression.ts";
import { getExecutiveFinancePlatformCertification } from "./executiveFinancePlatformCertificationIndex.ts";
import type { ExecutiveFinancePlatformFreezeManifest as ExecutiveFinancePlatformFreezeManifestContract } from "./executiveFinancePlatformFreezeTypes.ts";

export function getExecutiveFinancePlatformFreezeManifest(): ExecutiveFinancePlatformFreezeManifestContract {
  const certification = getExecutiveFinancePlatformCertification();
  const certificationReadiness: "Ready" = "Ready";

  return Object.freeze({
    platformIdentity: Object.freeze({
      platformId: "BUS-28",
      platformName: "Executive Finance Platform",
      platformCode: "EXEC_FIN",
      platformVersion: "1.0.0",
      metadataOnly: true,
      immutable: true,
    }),
    releaseIdentity: Object.freeze({
      releaseVersion: "1.0.0",
      freezeVersion: "1.0.0",
      releaseStage: "Release",
      releaseStatus: "Frozen",
      metadataOnly: true,
      immutable: true,
    }),
    certifiedPhases: Object.freeze([
      "BUS-28:1",
      "BUS-28:2",
      "BUS-28:3",
      "BUS-28:4",
      "BUS-28:5",
      "BUS-28:6",
      "BUS-28:7",
    ] as const),
    frozenPhases: Object.freeze([
      "BUS-28:1",
      "BUS-28:2",
      "BUS-28:3",
      "BUS-28:4",
      "BUS-28:5",
      "BUS-28:6",
      "BUS-28:7",
      "BUS-28:8",
    ] as const),
    publicApiRegistry: ExecutiveFinancePlatformFreezeRegistry.exportedApis,
    dependencyRegistry: Object.freeze(ExecutiveFinancePlatformFreezeRegistry.consumedPhases),
    compatibilitySummary: Object.freeze({
      compatibilityCount: ExecutiveFinancePlatformCompatibility.entries.length,
      status: "Compatible",
      metadataOnly: true,
      immutable: true,
    }),
    certificationSummary: Object.freeze({
      totalChecks: certification.summary.totalChecks,
      passed: certification.summary.passed,
      failed: certification.summary.failed,
      readiness: certificationReadiness,
      metadataOnly: true,
      immutable: true,
    }),
    regressionSummary: ExecutiveFinancePlatformRegression,
    extensionPolicy: Object.freeze({
      policyId: "executive-finance-platform-freeze-extension-policy",
      publicApiStability: "stable",
      backwardCompatibility: "required",
      privateMutationAllowed: false,
      metadataOnly: true,
      immutable: true,
    }),
    freezeReadiness: "Ready",
    releaseReadiness: "Ready",
    metadataOnly: true,
    immutable: true,
  });
}
