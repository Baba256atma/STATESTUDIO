import {
  runDomainRecommendationCertification,
  runDomainRecommendationRegression,
} from "./domainRecommendationCertificationIndex.ts";
import { getDomainRecommendationPlatformCompatibilityMatrix } from "./domainRecommendationPlatformCompatibility.ts";
import {
  createDomainRecommendationRegistry,
  registerDomainRecommendationPackage,
  type DomainRecommendationPackage,
} from "./domainRecommendationIndex.ts";
import {
  DOMAIN_RECOMMENDATION_EXTENSION_POLICY,
  DOMAIN_RECOMMENDATION_PHASE_REGISTRY,
  DOMAIN_RECOMMENDATION_PLATFORM_IDENTITY,
  DOMAIN_RECOMMENDATION_PUBLIC_API_REGISTRY,
  DOMAIN_RECOMMENDATION_RELEASE_METADATA,
} from "./domainRecommendationPlatformFreezeRegistry.ts";
import type { DomainRecommendationPlatformFreezeManifest } from "./domainRecommendationPlatformFreezeTypes.ts";

function stableHash(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function placeholderRecommendationPackage(): DomainRecommendationPackage {
  return Object.freeze({
    contractVersion: "DOM-7:1",
    recommendationPackageId: "recommendation-package.freeze.core",
    domainId: "domain.recommendation-freeze",
    name: "Recommendation Freeze Fixture",
    description: "Neutral placeholder recommendation metadata for platform freeze certification.",
    version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
    scope: "domain",
    status: "active",
    contracts: Object.freeze([
      Object.freeze({
        contractId: "recommendation-contract.freeze.primary",
        label: "Freeze Recommendation Contract",
        description: "Neutral placeholder recommendation contract metadata.",
        scope: "domain",
        status: "active",
        inputs: Object.freeze([
          Object.freeze({
            inputId: "input.freeze.primary",
            label: "Freeze Input",
            description: "Neutral input metadata.",
            required: true,
          }),
        ]),
        outputs: Object.freeze([
          Object.freeze({
            outputId: "output.freeze.primary",
            label: "Freeze Output",
            description: "Neutral output metadata.",
          }),
        ]),
        rationale: Object.freeze({
          required: true,
          rationaleInputs: Object.freeze(["input.freeze.primary"]),
          rationaleAssumptions: Object.freeze(["assumption.freeze.primary"]),
          explanation: "Rationale metadata is structurally required.",
        }),
        constraints: Object.freeze([
          Object.freeze({
            constraintId: "constraint.freeze.primary",
            label: "Freeze Constraint",
            description: "Neutral constraint metadata.",
            required: true,
            severity: "warning",
          }),
        ]),
        assumptions: Object.freeze([
          Object.freeze({
            assumptionId: "assumption.freeze.primary",
            label: "Freeze Assumption",
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
          traceInputIds: Object.freeze(["input.freeze.primary"]),
          traceOutputIds: Object.freeze(["output.freeze.primary"]),
          traceConstraintIds: Object.freeze(["constraint.freeze.primary"]),
          traceAssumptionIds: Object.freeze(["assumption.freeze.primary"]),
        }),
      }),
    ]),
  });
}

function certificationRegistry() {
  return registerDomainRecommendationPackage(createDomainRecommendationRegistry(), placeholderRecommendationPackage()).registry;
}

function freezeFingerprint(manifest: Omit<DomainRecommendationPlatformFreezeManifest, "fingerprint">): string {
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

export function buildDomainRecommendationPlatformFreezeManifest(): DomainRecommendationPlatformFreezeManifest {
  const certification = runDomainRecommendationCertification(certificationRegistry());
  const regression = runDomainRecommendationRegression();
  const base = Object.freeze({
    platformIdentity: DOMAIN_RECOMMENDATION_PLATFORM_IDENTITY,
    phaseRegistry: DOMAIN_RECOMMENDATION_PHASE_REGISTRY,
    publicApiRegistry: DOMAIN_RECOMMENDATION_PUBLIC_API_REGISTRY,
    compatibilityMatrix: getDomainRecommendationPlatformCompatibilityMatrix(),
    extensionPolicy: DOMAIN_RECOMMENDATION_EXTENSION_POLICY,
    releaseMetadata: DOMAIN_RECOMMENDATION_RELEASE_METADATA,
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

export function isDomainRecommendationPlatformFreezeManifestValid(
  manifest: DomainRecommendationPlatformFreezeManifest
): boolean {
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
    manifest.platformIdentity.version === "DOM-7:4" &&
    manifest.platformIdentity.recommendationGeneration === false &&
    manifest.phaseRegistry.length === 4 &&
    manifest.publicApiRegistry.length > 0 &&
    manifest.compatibilityMatrix.length === 12 &&
    manifest.certificationStatus === "PASS" &&
    manifest.regressionStatus === "PASS" &&
    manifest.extensionPolicy.allowsRecommendationEngine === false &&
    manifest.extensionPolicy.allowsExecutiveJudgment === false &&
    manifest.extensionPolicy.allowsReasoningEngine === false &&
    manifest.extensionPolicy.allowsRuntimeInference === false &&
    manifest.extensionPolicy.allowsRuntimeExecution === false &&
    manifest.extensionPolicy.allowsRuntimeStateMutation === false &&
    manifest.immutable === true &&
    manifest.deterministic === true &&
    manifest.metadataOnly === true &&
    manifest.fingerprint === expected
  );
}
