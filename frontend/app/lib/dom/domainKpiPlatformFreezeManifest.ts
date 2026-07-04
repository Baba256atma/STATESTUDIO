import {
  runDomainKpiCertification,
  runDomainKpiRegression,
} from "./domainKpiCertificationIndex.ts";
import { getDomainKpiPlatformCompatibilityMatrix } from "./domainKpiPlatformCompatibility.ts";
import {
  createDomainKpiRegistry,
  registerDomainKpiPackage,
  type DomainKpiPackage,
} from "./domainKpiIndex.ts";
import {
  DOMAIN_KPI_EXTENSION_POLICY,
  DOMAIN_KPI_PHASE_REGISTRY,
  DOMAIN_KPI_PLATFORM_IDENTITY,
  DOMAIN_KPI_PUBLIC_API_REGISTRY,
  DOMAIN_KPI_RELEASE_METADATA,
} from "./domainKpiPlatformFreezeRegistry.ts";
import type { DomainKpiPlatformFreezeManifest } from "./domainKpiPlatformFreezeTypes.ts";

function stableHash(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function placeholderKpiPackage(): DomainKpiPackage {
  return Object.freeze({
    contractVersion: "DOM-4:1",
    kpiPackageId: "kpi-package.freeze.core",
    domainId: "domain.kpi-freeze",
    name: "KPI Freeze Fixture",
    description: "Neutral placeholder KPI metadata for platform freeze certification.",
    version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
    scope: "domain",
    status: "active",
    kpis: Object.freeze([
      Object.freeze({
        kpiId: "kpi.freeze.primary",
        label: "Freeze KPI",
        description: "Neutral placeholder KPI definition metadata.",
        intent: Object.freeze({
          label: "Freeze Intent",
          description: "Neutral measurement intent metadata.",
          direction: "neutral",
        }),
        unit: Object.freeze({
          unitType: "count",
          unitLabel: "items",
          precision: 0,
        }),
        aggregation: Object.freeze({
          aggregationType: "sum",
          window: "monthly",
          description: "Neutral aggregation metadata.",
        }),
        reference: Object.freeze({
          vocabularyId: "vocabulary.freeze.core",
          ontologyId: "ontology.freeze.core",
          entityTypeId: "entity.freeze.source",
          attributeId: "attribute.freeze.value",
        }),
        scope: "domain",
        status: "active",
      }),
    ]),
  });
}

function certificationRegistry() {
  return registerDomainKpiPackage(createDomainKpiRegistry(), placeholderKpiPackage()).registry;
}

function freezeFingerprint(manifest: Omit<DomainKpiPlatformFreezeManifest, "fingerprint">): string {
  return stableHash(
    [
      manifest.platformIdentity.platformId,
      manifest.platformIdentity.version,
      manifest.phaseRegistry.map((entry) => `${entry.phaseId}:${entry.status}:${entry.order}`).join(","),
      manifest.publicApiRegistry.map((entry) => `${entry.phaseId}:${entry.apiName}`).join(","),
      manifest.compatibilityMatrix.map((entry) => `${entry.targetLayer}:${entry.compatibility}`).join(","),
      manifest.extensionPolicy.policy,
      manifest.releaseMetadata.releaseVersion,
      manifest.certificationStatus,
      manifest.regressionStatus,
      manifest.immutable,
      manifest.deterministic,
      manifest.metadataOnly,
    ].join("||")
  );
}

export function buildDomainKpiPlatformFreezeManifest(): DomainKpiPlatformFreezeManifest {
  const certification = runDomainKpiCertification(certificationRegistry());
  const regression = runDomainKpiRegression();
  const base = Object.freeze({
    platformIdentity: DOMAIN_KPI_PLATFORM_IDENTITY,
    phaseRegistry: DOMAIN_KPI_PHASE_REGISTRY,
    publicApiRegistry: DOMAIN_KPI_PUBLIC_API_REGISTRY,
    compatibilityMatrix: getDomainKpiPlatformCompatibilityMatrix(),
    extensionPolicy: DOMAIN_KPI_EXTENSION_POLICY,
    releaseMetadata: DOMAIN_KPI_RELEASE_METADATA,
    certificationStatus: certification.status,
    regressionStatus: regression.failed === 0 ? ("PASS" as const) : ("FAIL" as const),
    immutable: true as const,
    deterministic: true as const,
    metadataOnly: true as const,
  });

  return Object.freeze({
    ...base,
    fingerprint: freezeFingerprint(base),
  });
}

export function isDomainKpiPlatformFreezeManifestValid(manifest: DomainKpiPlatformFreezeManifest): boolean {
  const expected = freezeFingerprint({
    platformIdentity: manifest.platformIdentity,
    phaseRegistry: manifest.phaseRegistry,
    publicApiRegistry: manifest.publicApiRegistry,
    compatibilityMatrix: manifest.compatibilityMatrix,
    extensionPolicy: manifest.extensionPolicy,
    releaseMetadata: manifest.releaseMetadata,
    certificationStatus: manifest.certificationStatus,
    regressionStatus: manifest.regressionStatus,
    immutable: manifest.immutable,
    deterministic: manifest.deterministic,
    metadataOnly: manifest.metadataOnly,
  });

  return (
    manifest.platformIdentity.version === "DOM-4:4" &&
    manifest.phaseRegistry.length === 4 &&
    manifest.publicApiRegistry.length > 0 &&
    manifest.compatibilityMatrix.length === 12 &&
    manifest.certificationStatus === "PASS" &&
    manifest.regressionStatus === "PASS" &&
    manifest.extensionPolicy.allowsKpiCalculationEngine === false &&
    manifest.extensionPolicy.allowsRuntimeMetricEvaluation === false &&
    manifest.extensionPolicy.allowsRuntimeInference === false &&
    manifest.extensionPolicy.allowsSemanticMatching === false &&
    manifest.immutable === true &&
    manifest.deterministic === true &&
    manifest.metadataOnly === true &&
    manifest.fingerprint === expected
  );
}
