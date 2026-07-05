import { EXECUTIVE_KPI_BUSINESS_IMPACT_PUBLIC_APIS } from "./executiveKpiBusinessImpactPlatform.ts";
import { EXECUTIVE_KPI_DEFINITION_PUBLIC_APIS } from "./executiveKpiDefinitionPlatform.ts";
import { EXECUTIVE_KPI_GOVERNANCE_PUBLIC_APIS } from "./executiveKpiGovernancePlatform.ts";
import { EXECUTIVE_KPI_INSIGHT_PUBLIC_APIS } from "./executiveKpiInsightPlatform.ts";
import { EXECUTIVE_KPI_INTEGRATION_PUBLIC_APIS } from "./executiveKpiIntegrationPlatform.ts";
import { EXECUTIVE_KPI_PUBLIC_APIS } from "./executiveKpiPlatform.ts";
import { EXECUTIVE_KPI_REPORTING_PUBLIC_APIS } from "./executiveKpiReportingPlatform.ts";
import { EXECUTIVE_KPI_SCORECARD_PUBLIC_APIS } from "./executiveKpiScorecardPlatform.ts";
import { EXECUTIVE_KPI_SOURCE_MAPPING_PUBLIC_APIS } from "./executiveKpiSourceMappingPlatform.ts";
import { EXECUTIVE_KPI_STRATEGIC_ALIGNMENT_PUBLIC_APIS } from "./executiveKpiStrategicAlignmentPlatform.ts";
import { EXECUTIVE_KPI_TARGET_PUBLIC_APIS } from "./executiveKpiTargetPlatform.ts";
import { EXECUTIVE_OKR_ALIGNMENT_REGISTRY } from "./executiveOkrAlignmentPlatform.ts";
import { EXECUTIVE_OKR_DEFINITION_REGISTRY } from "./executiveOkrDefinitionPlatform.ts";
import { EXECUTIVE_OKR_PLATFORM_REGISTRY } from "./executiveOkrPlatform.ts";
import type {
  ExecutiveOkrPlatformPhaseId,
  ExecutiveOkrPlatformRegression,
  ExecutiveOkrPlatformRegressionEntry,
} from "./executiveOkrPlatformFreezeTypes.ts";

function coverageForPhase(phaseId: ExecutiveOkrPlatformPhaseId): readonly string[] {
  if (phaseId === "BUS-1") {
    return Object.freeze(EXECUTIVE_KPI_PUBLIC_APIS.map((api) => api.apiName));
  }
  if (phaseId === "BUS-2") {
    return EXECUTIVE_KPI_DEFINITION_PUBLIC_APIS;
  }
  if (phaseId === "BUS-3") {
    return EXECUTIVE_KPI_SOURCE_MAPPING_PUBLIC_APIS;
  }
  if (phaseId === "BUS-4") {
    return EXECUTIVE_KPI_TARGET_PUBLIC_APIS;
  }
  if (phaseId === "BUS-5") {
    return EXECUTIVE_KPI_GOVERNANCE_PUBLIC_APIS;
  }
  if (phaseId === "BUS-6") {
    return EXECUTIVE_KPI_SCORECARD_PUBLIC_APIS;
  }
  if (phaseId === "BUS-7") {
    return EXECUTIVE_KPI_INSIGHT_PUBLIC_APIS;
  }
  if (phaseId === "BUS-8") {
    return EXECUTIVE_KPI_STRATEGIC_ALIGNMENT_PUBLIC_APIS;
  }
  if (phaseId === "BUS-9") {
    return EXECUTIVE_KPI_BUSINESS_IMPACT_PUBLIC_APIS;
  }
  if (phaseId === "BUS-10") {
    return EXECUTIVE_KPI_REPORTING_PUBLIC_APIS;
  }
  if (phaseId === "BUS-11") {
    return EXECUTIVE_KPI_INTEGRATION_PUBLIC_APIS;
  }
  if (phaseId === "BUS-12") {
    return Object.freeze([
      "ExecutiveKpiPlatformFreeze",
      "buildExecutiveKpiPlatformFreezeManifest",
      "runExecutiveKpiPlatformCertification",
      "runExecutiveKpiPlatformRegression",
      "runExecutiveKpiPlatformFreeze",
      "getExecutiveKpiPlatformFreezeState",
      "listExecutiveKpiPlatformPhases",
      "listExecutiveKpiPlatformPublicApis",
      "getExecutiveKpiPlatformCompatibilityMatrix",
      "getExecutiveKpiPlatformExtensionPolicy",
    ] as const);
  }
  if (phaseId === "BUS-13") {
    return Object.freeze(EXECUTIVE_OKR_PLATFORM_REGISTRY.publicApis.map((api) => api.apiName));
  }
  if (phaseId === "BUS-14") {
    return EXECUTIVE_OKR_DEFINITION_REGISTRY.publicApis;
  }
  if (phaseId === "BUS-15") {
    return EXECUTIVE_OKR_ALIGNMENT_REGISTRY.publicApis;
  }
  return Object.freeze([] as const);
}

export function runExecutiveOkrPlatformRegression(): ExecutiveOkrPlatformRegression {
  const phaseIds: readonly ExecutiveOkrPlatformPhaseId[] = Object.freeze([
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
    "BUS-12",
    "BUS-13",
    "BUS-14",
    "BUS-15",
  ] as const);
  const entries: readonly ExecutiveOkrPlatformRegressionEntry[] = Object.freeze(
    phaseIds.map((phaseId) => {
      const coveredPublicApis = coverageForPhase(phaseId);
      return Object.freeze({
        regressionId: `${phaseId.toLowerCase()}-readonly-regression`,
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
