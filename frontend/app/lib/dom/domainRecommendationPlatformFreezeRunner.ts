import {
  runDomainRecommendationCertification,
  runDomainRecommendationRegression,
} from "./domainRecommendationCertificationIndex.ts";
import { isDomainRecommendationCompatibilityMatrixValid } from "./domainRecommendationPlatformCompatibility.ts";
import {
  buildDomainRecommendationPlatformFreezeManifest,
  isDomainRecommendationPlatformFreezeManifestValid,
} from "./domainRecommendationPlatformFreezeManifest.ts";
import { DOMAIN_RECOMMENDATION_PUBLIC_API_REGISTRY } from "./domainRecommendationPlatformFreezeRegistry.ts";
import {
  createDomainRecommendationRegistry,
  registerDomainRecommendationPackage,
  type DomainRecommendationPackage,
} from "./domainRecommendationIndex.ts";
import type { DomainRecommendationFreezeResult } from "./domainRecommendationPlatformFreezeTypes.ts";

let freezeState: DomainRecommendationFreezeResult | null = null;

function check(checkId: string, passed: boolean, description: string) {
  return Object.freeze({ checkId, passed, description });
}

function placeholderRecommendationPackage(): DomainRecommendationPackage {
  return Object.freeze({
    contractVersion: "DOM-7:1",
    recommendationPackageId: "recommendation-package.freeze-runner.core",
    domainId: "domain.recommendation-freeze-runner",
    name: "Recommendation Freeze Runner Fixture",
    description: "Neutral placeholder recommendation metadata for freeze runner certification.",
    version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
    scope: "domain",
    status: "active",
    contracts: Object.freeze([
      Object.freeze({
        contractId: "recommendation-contract.freeze-runner.primary",
        label: "Freeze Runner Recommendation Contract",
        description: "Neutral placeholder recommendation contract metadata.",
        scope: "domain",
        status: "active",
        inputs: Object.freeze([
          Object.freeze({
            inputId: "input.freeze-runner.primary",
            label: "Freeze Runner Input",
            description: "Neutral input metadata.",
            required: true,
          }),
        ]),
        outputs: Object.freeze([
          Object.freeze({
            outputId: "output.freeze-runner.primary",
            label: "Freeze Runner Output",
            description: "Neutral output metadata.",
          }),
        ]),
        rationale: Object.freeze({
          required: true,
          rationaleInputs: Object.freeze(["input.freeze-runner.primary"]),
          rationaleAssumptions: Object.freeze(["assumption.freeze-runner.primary"]),
          explanation: "Rationale metadata is structurally required.",
        }),
        constraints: Object.freeze([
          Object.freeze({
            constraintId: "constraint.freeze-runner.primary",
            label: "Freeze Runner Constraint",
            description: "Neutral constraint metadata.",
            required: true,
            severity: "warning",
          }),
        ]),
        assumptions: Object.freeze([
          Object.freeze({
            assumptionId: "assumption.freeze-runner.primary",
            label: "Freeze Runner Assumption",
            description: "Neutral assumption metadata.",
            required: true,
            uncertaintyImpact: "medium",
          }),
        ]),
        confidence: Object.freeze({
          required: true,
          evidenceCoverageRequired: true,
          rationaleCoverageRequired: true,
          explanation: "Confidence metadata is structurally required.",
        }),
        uncertainty: Object.freeze({
          required: true,
          sources: Object.freeze(["assumption", "constraint"]),
          explanation: "Uncertainty metadata is structurally required.",
        }),
        trace: Object.freeze({
          required: true,
          traceInputIds: Object.freeze(["input.freeze-runner.primary"]),
          traceOutputIds: Object.freeze(["output.freeze-runner.primary"]),
          traceConstraintIds: Object.freeze(["constraint.freeze-runner.primary"]),
          traceAssumptionIds: Object.freeze(["assumption.freeze-runner.primary"]),
        }),
      }),
    ]),
  });
}

function certificationRegistry() {
  return registerDomainRecommendationPackage(createDomainRecommendationRegistry(), placeholderRecommendationPackage()).registry;
}

function isPublicApiRegistryValid(): boolean {
  const apiNames = DOMAIN_RECOMMENDATION_PUBLIC_API_REGISTRY.map((entry) => entry.apiName);
  return (
    apiNames.length > 0 &&
    new Set(apiNames).size === apiNames.length &&
    DOMAIN_RECOMMENDATION_PUBLIC_API_REGISTRY.every((entry) => entry.stable && entry.metadataOnly)
  );
}

export function runDomainRecommendationPlatformFreeze(): DomainRecommendationFreezeResult {
  const manifest = buildDomainRecommendationPlatformFreezeManifest();
  const certification = runDomainRecommendationCertification(certificationRegistry());
  const regression = runDomainRecommendationRegression();
  const checks = Object.freeze([
    check("dom-7-3-certification-pass", certification.status === "PASS", "DOM-7:3 certification must pass."),
    check("dom-7-regression-pass", regression.failed === 0, "DOM-7 regression metadata must pass."),
    check("manifest-valid", isDomainRecommendationPlatformFreezeManifestValid(manifest), "Freeze manifest must be valid."),
    check(
      "compatibility-matrix-valid",
      isDomainRecommendationCompatibilityMatrixValid(manifest.compatibilityMatrix),
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

export function getDomainRecommendationPlatformFreezeState(): DomainRecommendationFreezeResult {
  if (!freezeState) {
    return runDomainRecommendationPlatformFreeze();
  }
  return freezeState;
}
