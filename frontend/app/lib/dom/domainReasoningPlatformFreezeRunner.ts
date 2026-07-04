import {
  runDomainReasoningCertification,
  runDomainReasoningRegression,
} from "./domainReasoningCertificationIndex.ts";
import { isDomainReasoningCompatibilityMatrixValid } from "./domainReasoningPlatformCompatibility.ts";
import {
  buildDomainReasoningPlatformFreezeManifest,
  isDomainReasoningPlatformFreezeManifestValid,
} from "./domainReasoningPlatformFreezeManifest.ts";
import { DOMAIN_REASONING_PUBLIC_API_REGISTRY } from "./domainReasoningPlatformFreezeRegistry.ts";
import {
  createDomainReasoningRegistry,
  registerDomainReasoningPackage,
  type DomainReasoningPackage,
} from "./domainReasoningIndex.ts";
import type { DomainReasoningFreezeResult } from "./domainReasoningPlatformFreezeTypes.ts";

let freezeState: DomainReasoningFreezeResult | null = null;

function check(checkId: string, passed: boolean, description: string) {
  return Object.freeze({ checkId, passed, description });
}

function placeholderReasoningPackage(): DomainReasoningPackage {
  return Object.freeze({
    contractVersion: "DOM-6:1",
    reasoningPackageId: "reasoning-package.freeze-runner.core",
    domainId: "domain.reasoning-freeze-runner",
    name: "Reasoning Freeze Runner Fixture",
    description: "Neutral placeholder reasoning metadata for freeze runner certification.",
    version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
    scope: "domain",
    status: "active",
    contracts: Object.freeze([
      Object.freeze({
        contractId: "reasoning-contract.freeze-runner.primary",
        label: "Freeze Runner Reasoning Contract",
        description: "Neutral placeholder reasoning contract metadata.",
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
        evidenceRequirements: Object.freeze([
          Object.freeze({
            evidenceRequirementId: "evidence-requirement.freeze-runner.primary",
            label: "Freeze Runner Evidence Requirement",
            description: "Neutral evidence requirement metadata.",
            required: true,
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
          traceInputIds: Object.freeze(["input.freeze-runner.primary"]),
          traceOutputIds: Object.freeze(["output.freeze-runner.primary"]),
          traceEvidenceRequirementIds: Object.freeze(["evidence-requirement.freeze-runner.primary"]),
          traceAssumptionIds: Object.freeze(["assumption.freeze-runner.primary"]),
        }),
      }),
    ]),
  });
}

function certificationRegistry() {
  return registerDomainReasoningPackage(createDomainReasoningRegistry(), placeholderReasoningPackage()).registry;
}

function isPublicApiRegistryValid(): boolean {
  const apiNames = DOMAIN_REASONING_PUBLIC_API_REGISTRY.map((entry) => entry.apiName);
  return (
    apiNames.length > 0 &&
    new Set(apiNames).size === apiNames.length &&
    DOMAIN_REASONING_PUBLIC_API_REGISTRY.every((entry) => entry.stable && entry.metadataOnly)
  );
}

export function runDomainReasoningPlatformFreeze(): DomainReasoningFreezeResult {
  const manifest = buildDomainReasoningPlatformFreezeManifest();
  const certification = runDomainReasoningCertification(certificationRegistry());
  const regression = runDomainReasoningRegression();
  const checks = Object.freeze([
    check("dom-6-3-certification-pass", certification.status === "PASS", "DOM-6:3 certification must pass."),
    check("dom-6-regression-pass", regression.failed === 0, "DOM-6 regression metadata must pass."),
    check("manifest-valid", isDomainReasoningPlatformFreezeManifestValid(manifest), "Freeze manifest must be valid."),
    check(
      "compatibility-matrix-valid",
      isDomainReasoningCompatibilityMatrixValid(manifest.compatibilityMatrix),
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

export function getDomainReasoningPlatformFreezeState(): DomainReasoningFreezeResult {
  if (!freezeState) {
    return runDomainReasoningPlatformFreeze();
  }
  return freezeState;
}
