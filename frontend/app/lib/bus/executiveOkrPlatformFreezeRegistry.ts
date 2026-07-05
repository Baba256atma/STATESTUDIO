import { getExecutiveKpiPlatformFreezeState, listExecutiveKpiPlatformPhases, listExecutiveKpiPlatformPublicApis } from "./executiveKpiPlatformFreezeIndex.ts";
import { getExecutiveOkrPlatformCompatibilityMatrix } from "./executiveOkrPlatformCompatibility.ts";
import { EXECUTIVE_OKR_ALIGNMENT_REGISTRY } from "./executiveOkrAlignmentPlatform.ts";
import { EXECUTIVE_OKR_DEFINITION_REGISTRY } from "./executiveOkrDefinitionPlatform.ts";
import { EXECUTIVE_OKR_PLATFORM_REGISTRY } from "./executiveOkrPlatform.ts";
import type {
  ExecutiveOkrPlatformConsumerEntry,
  ExecutiveOkrPlatformDependencyEntry,
  ExecutiveOkrPlatformExtensionPolicy,
  ExecutiveOkrPlatformFreezeMetadata,
  ExecutiveOkrPlatformIdentity,
  ExecutiveOkrPlatformPhaseEntry,
  ExecutiveOkrPlatformPhaseId,
  ExecutiveOkrPlatformPublicApiEntry,
  ExecutiveOkrPlatformRelease,
} from "./executiveOkrPlatformFreezeTypes.ts";

export const EXECUTIVE_OKR_PLATFORM_FREEZE_METADATA: ExecutiveOkrPlatformFreezeMetadata = Object.freeze({
  platformId: "BUS-OKR",
  phaseId: "BUS-16",
  version: "1.0.0",
  state: "Certified Frozen Released",
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_OKR_PLATFORM_IDENTITY: ExecutiveOkrPlatformIdentity = Object.freeze({
  platformId: "BUS-OKR",
  platformName: "Executive OKR Platform",
  version: "1.0.0",
  certificationPhaseId: "BUS-16",
  state: "Certified Frozen Released",
  metadataOnly: true,
  immutable: true,
});

const KPI_PHASES = listExecutiveKpiPlatformPhases();

export const EXECUTIVE_OKR_PLATFORM_PHASES: readonly ExecutiveOkrPlatformPhaseEntry[] = Object.freeze([
  ...KPI_PHASES.map((phase) =>
    Object.freeze({
      phaseId: phase.phaseId as ExecutiveOkrPlatformPhaseId,
      phaseName: phase.phaseName,
      order: phase.order,
      status: phase.status,
      metadataOnly: true,
      immutable: true,
    })
  ),
  Object.freeze({
    phaseId: "BUS-13",
    phaseName: "Executive OKR Platform Foundation",
    order: 13,
    status: "Frozen",
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    phaseId: "BUS-14",
    phaseName: "Executive OKR Definition Platform",
    order: 14,
    status: "Frozen",
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    phaseId: "BUS-15",
    phaseName: "Executive OKR Alignment Platform",
    order: 15,
    status: "Frozen",
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    phaseId: "BUS-16",
    phaseName: "Executive OKR Platform Certification & Freeze",
    order: 16,
    status: "Released",
    metadataOnly: true,
    immutable: true,
  }),
] as const);

export const EXECUTIVE_OKR_PLATFORM_EXTENSION_POLICY: ExecutiveOkrPlatformExtensionPolicy = Object.freeze({
  policyId: "executive-okr-platform-freeze-extension-policy",
  allowsFutureBusPhases: true,
  requiresPublicApiConsumption: true,
  allowsOkrExecution: false,
  allowsRuntimeExecution: false,
  allowsPersistence: false,
  allowsNetwork: false,
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_OKR_PLATFORM_RELEASE_METADATA: ExecutiveOkrPlatformRelease = Object.freeze({
  releaseId: "executive-okr-platform-freeze",
  releaseName: "Executive OKR Platform Certification & Freeze",
  releaseVersion: "BUS-16",
  certificationTimestamp: "deterministic-certification-metadata",
  certificationStatus: "Certified",
  freezeStatus: "Frozen",
  releaseStatus: "Released",
  metadataOnly: true,
  immutable: true,
});

const BUS_16_PUBLIC_APIS = Object.freeze([
  "ExecutiveOkrPlatformFreeze",
  "buildExecutiveOkrPlatformFreezeManifest",
  "runExecutiveOkrPlatformCertification",
  "runExecutiveOkrPlatformRegression",
  "runExecutiveOkrPlatformFreeze",
  "getExecutiveOkrPlatformFreezeState",
  "listExecutiveOkrPlatformPhases",
  "listExecutiveOkrPlatformPublicApis",
  "getExecutiveOkrPlatformCompatibilityMatrix",
  "getExecutiveOkrPlatformExtensionPolicy",
] as const);

type PublicApiSource = string | Readonly<{ readonly apiName: string }>;

function publicApiName(api: PublicApiSource): string {
  return typeof api === "string" ? api : api.apiName;
}

function apiEntries(phaseId: ExecutiveOkrPlatformPhaseId, publicApis: readonly PublicApiSource[]): readonly ExecutiveOkrPlatformPublicApiEntry[] {
  return Object.freeze(publicApis.map((api) => Object.freeze({ apiName: publicApiName(api), phaseId, stable: true, metadataOnly: true })));
}

export function listExecutiveOkrPlatformPhases(): readonly ExecutiveOkrPlatformPhaseEntry[] {
  return EXECUTIVE_OKR_PLATFORM_PHASES;
}

export function listExecutiveOkrPlatformPublicApis(): readonly ExecutiveOkrPlatformPublicApiEntry[] {
  return Object.freeze([
    ...listExecutiveKpiPlatformPublicApis().map((api) =>
      Object.freeze({
        apiName: api.apiName,
        phaseId: api.phaseId as ExecutiveOkrPlatformPhaseId,
        stable: api.stable,
        metadataOnly: true,
      })
    ),
    ...apiEntries("BUS-13", EXECUTIVE_OKR_PLATFORM_REGISTRY.publicApis),
    ...apiEntries("BUS-14", EXECUTIVE_OKR_DEFINITION_REGISTRY.publicApis),
    ...apiEntries("BUS-15", EXECUTIVE_OKR_ALIGNMENT_REGISTRY.publicApis),
    ...apiEntries("BUS-16", BUS_16_PUBLIC_APIS),
  ]);
}

export function listExecutiveOkrPlatformDependencies(): readonly ExecutiveOkrPlatformDependencyEntry[] {
  return Object.freeze([
    ...EXECUTIVE_OKR_PLATFORM_REGISTRY.dependencies.map((dependency) =>
      Object.freeze({
        dependencyId: dependency.dependencyId,
        sourcePhaseId: "BUS-13" as const,
        required: dependency.compatible,
        metadataOnly: true,
        immutable: true,
      })
    ),
    Object.freeze({ dependencyId: "BUS-13", sourcePhaseId: "BUS-14", required: true, metadataOnly: true, immutable: true }),
    Object.freeze({ dependencyId: "BUS-12", sourcePhaseId: "BUS-14", required: true, metadataOnly: true, immutable: true }),
    Object.freeze({ dependencyId: "BUS-13", sourcePhaseId: "BUS-15", required: true, metadataOnly: true, immutable: true }),
    Object.freeze({ dependencyId: "BUS-14", sourcePhaseId: "BUS-15", required: true, metadataOnly: true, immutable: true }),
    Object.freeze({ dependencyId: "BUS-12", sourcePhaseId: "BUS-15", required: true, metadataOnly: true, immutable: true }),
  ]);
}

export function listExecutiveOkrPlatformConsumers(): readonly ExecutiveOkrPlatformConsumerEntry[] {
  return Object.freeze(
    EXECUTIVE_OKR_PLATFORM_REGISTRY.consumers.map((consumer) =>
      Object.freeze({
        consumerId: consumer.consumerId,
        consumerName: consumer.name,
        scope: "metadata-only",
        metadataOnly: true,
        immutable: true,
      })
    )
  );
}

export function getExecutiveOkrPlatformExtensionPolicy(): ExecutiveOkrPlatformExtensionPolicy {
  return EXECUTIVE_OKR_PLATFORM_EXTENSION_POLICY;
}

export const EXECUTIVE_OKR_PLATFORM_COMPATIBILITY = getExecutiveOkrPlatformCompatibilityMatrix();
