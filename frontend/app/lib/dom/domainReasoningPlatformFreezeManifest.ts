import {
  runDomainReasoningCertification,
  runDomainReasoningRegression,
} from "./domainReasoningCertificationIndex.ts";
import { getDomainReasoningPlatformCompatibilityMatrix } from "./domainReasoningPlatformCompatibility.ts";
import {
  createDomainReasoningRegistry,
  registerDomainReasoningPackage,
  type DomainReasoningPackage,
} from "./domainReasoningIndex.ts";
import {
  DOMAIN_REASONING_EXTENSION_POLICY,
  DOMAIN_REASONING_PHASE_REGISTRY,
  DOMAIN_REASONING_PLATFORM_IDENTITY,
  DOMAIN_REASONING_PUBLIC_API_REGISTRY,
  DOMAIN_REASONING_RELEASE_METADATA,
} from "./domainReasoningPlatformFreezeRegistry.ts";
import type { DomainReasoningPlatformFreezeManifest } from "./domainReasoningPlatformFreezeTypes.ts";

function stableHash(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function placeholderReasoningPackage(): DomainReasoningPackage {
  return Object.freeze({
    contractVersion: "DOM-6:1",
    reasoningPackageId: "reasoning-package.freeze.core",
    domainId: "domain.reasoning-freeze",
    name: "Reasoning Freeze Fixture",
    description: "Neutral placeholder reasoning metadata for platform freeze certification.",
    version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
    scope: "domain",
    status: "active",
    contracts: Object.freeze([
      Object.freeze({
        contractId: "reasoning-contract.freeze.primary",
        label: "Freeze Reasoning Contract",
        description: "Neutral placeholder reasoning contract metadata.",
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
        evidenceRequirements: Object.freeze([
          Object.freeze({
            evidenceRequirementId: "evidence-requirement.freeze.primary",
            label: "Freeze Evidence Requirement",
            description: "Neutral evidence requirement metadata.",
            required: true,
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
          assumptionCoverageRequired: true,
          explanation: "Confidence metadata is structurally required.",
        }),
        uncertainty: Object.freeze({
          required: true,
          sources: Object.freeze(["assumption", "evidence"]),
          explanation: "Uncertainty metadata is structurally required.",
        }),
        trace: Object.freeze({
          required: true,
          traceInputIds: Object.freeze(["input.freeze.primary"]),
          traceOutputIds: Object.freeze(["output.freeze.primary"]),
          traceEvidenceRequirementIds: Object.freeze(["evidence-requirement.freeze.primary"]),
          traceAssumptionIds: Object.freeze(["assumption.freeze.primary"]),
        }),
      }),
    ]),
  });
}

function certificationRegistry() {
  return registerDomainReasoningPackage(createDomainReasoningRegistry(), placeholderReasoningPackage()).registry;
}

function freezeFingerprint(manifest: Omit<DomainReasoningPlatformFreezeManifest, "fingerprint">): string {
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

export function buildDomainReasoningPlatformFreezeManifest(): DomainReasoningPlatformFreezeManifest {
  const certification = runDomainReasoningCertification(certificationRegistry());
  const regression = runDomainReasoningRegression();
  const base = Object.freeze({
    platformIdentity: DOMAIN_REASONING_PLATFORM_IDENTITY,
    phaseRegistry: DOMAIN_REASONING_PHASE_REGISTRY,
    publicApiRegistry: DOMAIN_REASONING_PUBLIC_API_REGISTRY,
    compatibilityMatrix: getDomainReasoningPlatformCompatibilityMatrix(),
    extensionPolicy: DOMAIN_REASONING_EXTENSION_POLICY,
    releaseMetadata: DOMAIN_REASONING_RELEASE_METADATA,
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

export function isDomainReasoningPlatformFreezeManifestValid(
  manifest: DomainReasoningPlatformFreezeManifest
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
    manifest.platformIdentity.version === "DOM-6:4" &&
    manifest.platformIdentity.reasoningExecution === false &&
    manifest.phaseRegistry.length === 4 &&
    manifest.publicApiRegistry.length > 0 &&
    manifest.compatibilityMatrix.length === 11 &&
    manifest.certificationStatus === "PASS" &&
    manifest.regressionStatus === "PASS" &&
    manifest.extensionPolicy.allowsReasoningEngine === false &&
    manifest.extensionPolicy.allowsExecutiveJudgment === false &&
    manifest.extensionPolicy.allowsRecommendations === false &&
    manifest.extensionPolicy.allowsRuntimeInference === false &&
    manifest.extensionPolicy.allowsRuntimeExecution === false &&
    manifest.extensionPolicy.allowsRuntimeStateMutation === false &&
    manifest.immutable === true &&
    manifest.deterministic === true &&
    manifest.metadataOnly === true &&
    manifest.fingerprint === expected
  );
}
