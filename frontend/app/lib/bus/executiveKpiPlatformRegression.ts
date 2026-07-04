import { listExecutiveKpiPlatformPublicApis } from "./executiveKpiPlatformFreezeRegistry.ts";
import type { ExecutiveKpiPlatformPhaseEntry, ExecutiveKpiPlatformRegressionEntry, ExecutiveKpiPlatformRegressionResult } from "./executiveKpiPlatformFreezeTypes.ts";

export function runExecutiveKpiPlatformRegression(): ExecutiveKpiPlatformRegressionResult {
  const publicApis = listExecutiveKpiPlatformPublicApis();
  const phaseIds: readonly ExecutiveKpiPlatformPhaseEntry["phaseId"][] = Object.freeze([
    "BUS-1",
    "BUS-2",
    "BUS-3",
    "BUS-4",
    "BUS-5",
    "BUS-6",
    "BUS-7",
    "BUS-8",
    "BUS-9",
    "BUS-10",
    "BUS-11",
  ] as const);
  const entries: readonly ExecutiveKpiPlatformRegressionEntry[] = Object.freeze(
    phaseIds.map((phaseId) => {
      const coveredPublicApis = Object.freeze(publicApis.filter((api) => api.phaseId === phaseId).map((api) => api.apiName));
      return Object.freeze({
        regressionId: `${phaseId.toLowerCase()}-metadata-regression`,
        phaseId,
        coveredPublicApis,
        status: coveredPublicApis.length > 0 ? "PASS" : "FAIL",
        metadataOnly: true,
      });
    })
  );
  const passedEntries = entries.filter((entry) => entry.status === "PASS").length;
  const failedEntries = entries.length - passedEntries;

  return Object.freeze({
    status: failedEntries === 0 ? "PASS" : "FAIL",
    entries,
    totalEntries: entries.length,
    passedEntries,
    failedEntries,
    metadataOnly: true,
  });
}
