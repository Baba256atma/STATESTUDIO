import { getExecutiveKpiBusinessImpactPlatform } from "./executiveKpiBusinessImpactPlatform.ts";
import { getExecutiveKpiDefinitionPlatform } from "./executiveKpiDefinitionPlatform.ts";
import { getExecutiveKpiGovernancePlatform } from "./executiveKpiGovernancePlatform.ts";
import { getExecutiveKpiInsightPlatform } from "./executiveKpiInsightPlatform.ts";
import { getExecutiveKpiIntegrationPlatform } from "./executiveKpiIntegrationPlatform.ts";
import { getExecutiveKpiPlatform } from "./executiveKpiPlatform.ts";
import { getExecutiveKpiReportingPlatform } from "./executiveKpiReportingPlatform.ts";
import { getExecutiveKpiScorecardPlatform } from "./executiveKpiScorecardPlatform.ts";
import { getExecutiveKpiSourceMappingPlatform } from "./executiveKpiSourceMappingPlatform.ts";
import { getExecutiveKpiStrategicAlignmentPlatform } from "./executiveKpiStrategicAlignmentPlatform.ts";
import { getExecutiveKpiTargetPlatform } from "./executiveKpiTargetPlatform.ts";
import type {
  ExecutiveKpiPlatformExtensionPolicy,
  ExecutiveKpiPlatformIdentity,
  ExecutiveKpiPlatformPhaseEntry,
  ExecutiveKpiPlatformPublicApiEntry,
  ExecutiveKpiPlatformReleaseMetadata,
} from "./executiveKpiPlatformFreezeTypes.ts";

export const EXECUTIVE_KPI_PLATFORM_IDENTITY: ExecutiveKpiPlatformIdentity = Object.freeze({
  platformId: "BUS",
  platformName: "Executive KPI Platform",
  version: "1.0.0",
  certificationPhaseId: "BUS-12",
  state: "Certified Frozen Released",
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_KPI_PLATFORM_PHASES: readonly ExecutiveKpiPlatformPhaseEntry[] = Object.freeze([
  Object.freeze({ phaseId: "BUS-1", phaseName: "Executive KPI Platform Foundation", order: 1, status: "Frozen", metadataOnly: true, immutable: true }),
  Object.freeze({ phaseId: "BUS-2", phaseName: "Executive KPI Definition Platform", order: 2, status: "Frozen", metadataOnly: true, immutable: true }),
  Object.freeze({ phaseId: "BUS-3", phaseName: "Executive KPI Source Mapping Platform", order: 3, status: "Frozen", metadataOnly: true, immutable: true }),
  Object.freeze({ phaseId: "BUS-4", phaseName: "Executive KPI Target and Threshold Platform", order: 4, status: "Frozen", metadataOnly: true, immutable: true }),
  Object.freeze({ phaseId: "BUS-5", phaseName: "Executive KPI Governance Platform", order: 5, status: "Frozen", metadataOnly: true, immutable: true }),
  Object.freeze({ phaseId: "BUS-6", phaseName: "Executive KPI Scorecard Platform", order: 6, status: "Frozen", metadataOnly: true, immutable: true }),
  Object.freeze({ phaseId: "BUS-7", phaseName: "Executive KPI Insight Metadata Platform", order: 7, status: "Frozen", metadataOnly: true, immutable: true }),
  Object.freeze({ phaseId: "BUS-8", phaseName: "Executive KPI Strategic Alignment Platform", order: 8, status: "Frozen", metadataOnly: true, immutable: true }),
  Object.freeze({ phaseId: "BUS-9", phaseName: "Executive KPI Business Impact Metadata Platform", order: 9, status: "Frozen", metadataOnly: true, immutable: true }),
  Object.freeze({ phaseId: "BUS-10", phaseName: "Executive KPI Reporting Metadata Platform", order: 10, status: "Frozen", metadataOnly: true, immutable: true }),
  Object.freeze({ phaseId: "BUS-11", phaseName: "Executive KPI Integration Platform", order: 11, status: "Frozen", metadataOnly: true, immutable: true }),
  Object.freeze({ phaseId: "BUS-12", phaseName: "Executive KPI Platform Certification & Freeze", order: 12, status: "Released", metadataOnly: true, immutable: true }),
] as const);

export const EXECUTIVE_KPI_PLATFORM_EXTENSION_POLICY: ExecutiveKpiPlatformExtensionPolicy = Object.freeze({
  allowsFutureBusPhases: true,
  requiresPublicApiConsumption: true,
  allowsKpiComputation: false,
  allowsRuntimeExecution: false,
  allowsPersistence: false,
  policyId: "executive-kpi-metadata-extension-policy",
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_KPI_PLATFORM_RELEASE_METADATA: ExecutiveKpiPlatformReleaseMetadata = Object.freeze({
  releaseId: "executive-kpi-platform-freeze",
  releaseName: "Executive KPI Platform Certification & Freeze",
  releaseVersion: "BUS-12",
  releaseDateMetadata: "deterministic-release-metadata",
  certificationStatus: "Certified",
  freezeStatus: "Frozen",
  releaseStatus: "Released",
  metadataOnly: true,
  immutable: true,
});

type PublicApiSource = string | Readonly<{ readonly apiName: string }>;

const BUS_12_PUBLIC_APIS = Object.freeze([
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

function publicApiName(api: PublicApiSource): string {
  return typeof api === "string" ? api : api.apiName;
}

function apiEntries(phaseId: ExecutiveKpiPlatformPhaseEntry["phaseId"], publicApis: readonly PublicApiSource[]): readonly ExecutiveKpiPlatformPublicApiEntry[] {
  return Object.freeze(publicApis.map((api) => Object.freeze({ apiName: publicApiName(api), phaseId, stable: true, metadataOnly: true })));
}

export function listExecutiveKpiPlatformPhases(): readonly ExecutiveKpiPlatformPhaseEntry[] {
  return EXECUTIVE_KPI_PLATFORM_PHASES;
}

export function listExecutiveKpiPlatformPublicApis(): readonly ExecutiveKpiPlatformPublicApiEntry[] {
  const bus1 = getExecutiveKpiPlatform();
  const bus2 = getExecutiveKpiDefinitionPlatform();
  const bus3 = getExecutiveKpiSourceMappingPlatform();
  const bus4 = getExecutiveKpiTargetPlatform();
  const bus5 = getExecutiveKpiGovernancePlatform();
  const bus6 = getExecutiveKpiScorecardPlatform();
  const bus7 = getExecutiveKpiInsightPlatform();
  const bus8 = getExecutiveKpiStrategicAlignmentPlatform();
  const bus9 = getExecutiveKpiBusinessImpactPlatform();
  const bus10 = getExecutiveKpiReportingPlatform();
  const bus11 = getExecutiveKpiIntegrationPlatform();

  return Object.freeze([
    ...apiEntries("BUS-1", bus1.registry.publicApis),
    ...apiEntries("BUS-2", bus2.registry.publicApis),
    ...apiEntries("BUS-3", bus3.registry.publicApis),
    ...apiEntries("BUS-4", bus4.registry.publicApis),
    ...apiEntries("BUS-5", bus5.registry.publicApis),
    ...apiEntries("BUS-6", bus6.registry.publicApis),
    ...apiEntries("BUS-7", bus7.registry.publicApis),
    ...apiEntries("BUS-8", bus8.registry.publicApis),
    ...apiEntries("BUS-9", bus9.registry.publicApis),
    ...apiEntries("BUS-10", bus10.registry.publicApis),
    ...apiEntries("BUS-11", bus11.registry.publicApis),
    ...apiEntries("BUS-12", BUS_12_PUBLIC_APIS),
  ]);
}

export function getExecutiveKpiPlatformExtensionPolicy(): ExecutiveKpiPlatformExtensionPolicy {
  return EXECUTIVE_KPI_PLATFORM_EXTENSION_POLICY;
}
