import {
  runDomainKpiCertification,
  runDomainKpiRegression,
} from "./domainKpiCertificationIndex.ts";
import { isDomainKpiCompatibilityMatrixValid } from "./domainKpiPlatformCompatibility.ts";
import {
  buildDomainKpiPlatformFreezeManifest,
  isDomainKpiPlatformFreezeManifestValid,
} from "./domainKpiPlatformFreezeManifest.ts";
import { DOMAIN_KPI_PUBLIC_API_REGISTRY } from "./domainKpiPlatformFreezeRegistry.ts";
import {
  createDomainKpiRegistry,
  registerDomainKpiPackage,
  type DomainKpiPackage,
} from "./domainKpiIndex.ts";
import type { DomainKpiFreezeResult } from "./domainKpiPlatformFreezeTypes.ts";

let freezeState: DomainKpiFreezeResult | null = null;

function check(checkId: string, passed: boolean, description: string) {
  return Object.freeze({ checkId, passed, description });
}

function placeholderKpiPackage(): DomainKpiPackage {
  return Object.freeze({
    contractVersion: "DOM-4:1",
    kpiPackageId: "kpi-package.freeze-runner.core",
    domainId: "domain.kpi-freeze-runner",
    name: "KPI Freeze Runner Fixture",
    description: "Neutral placeholder KPI metadata for freeze runner certification.",
    version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
    scope: "domain",
    status: "active",
    kpis: Object.freeze([
      Object.freeze({
        kpiId: "kpi.freeze-runner.primary",
        label: "Freeze Runner KPI",
        description: "Neutral placeholder KPI definition metadata.",
        intent: Object.freeze({
          label: "Freeze Runner Intent",
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
          vocabularyId: "vocabulary.freeze-runner.core",
          ontologyId: "ontology.freeze-runner.core",
          entityTypeId: "entity.freeze-runner.source",
          attributeId: "attribute.freeze-runner.value",
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

function isPublicApiRegistryValid(): boolean {
  const apiNames = DOMAIN_KPI_PUBLIC_API_REGISTRY.map((entry) => entry.apiName);
  return (
    apiNames.length > 0 &&
    new Set(apiNames).size === apiNames.length &&
    DOMAIN_KPI_PUBLIC_API_REGISTRY.every((entry) => entry.stable && entry.metadataOnly)
  );
}

export function runDomainKpiPlatformFreeze(): DomainKpiFreezeResult {
  const manifest = buildDomainKpiPlatformFreezeManifest();
  const certification = runDomainKpiCertification(certificationRegistry());
  const regression = runDomainKpiRegression();
  const checks = Object.freeze([
    check("dom-4-3-certification-pass", certification.status === "PASS", "DOM-4:3 certification must pass."),
    check("dom-4-regression-pass", regression.failed === 0, "DOM-4 regression metadata must pass."),
    check("manifest-valid", isDomainKpiPlatformFreezeManifestValid(manifest), "Freeze manifest must be valid."),
    check(
      "compatibility-matrix-valid",
      isDomainKpiCompatibilityMatrixValid(manifest.compatibilityMatrix),
      "Compatibility matrix must include required read-only boundaries."
    ),
    check("public-api-registry-valid", isPublicApiRegistryValid(), "Public API registry must be stable and unique."),
  ]);
  const status = checks.every((entry) => entry.passed) ? "PASS" : "FAIL";

  freezeState = Object.freeze({
    status,
    manifest,
    certificationStatus: certification.status,
    regression,
    checks,
  });

  return freezeState;
}

export function getDomainKpiPlatformFreezeState(): DomainKpiFreezeResult {
  if (!freezeState) {
    return runDomainKpiPlatformFreeze();
  }
  return freezeState;
}
