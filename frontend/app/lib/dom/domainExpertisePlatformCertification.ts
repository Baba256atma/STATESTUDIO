import { buildDomainFoundationManifest, validateDomainFoundation } from "./domainFoundationIndex.ts";
import { DomainVocabularyPlatformFreeze } from "./domainVocabularyPlatformFreezeIndex.ts";
import { DomainOntologyPlatformFreeze } from "./domainOntologyPlatformFreezeIndex.ts";
import { DomainKpiPlatformFreeze } from "./domainKpiPlatformFreezeIndex.ts";
import { DomainRegulationCertificationLayer } from "./domainRegulationCertificationIndex.ts";
import { DomainReasoningPlatformFreeze } from "./domainReasoningPlatformFreezeIndex.ts";
import { DomainRecommendationPlatformFreeze } from "./domainRecommendationPlatformFreezeIndex.ts";
import { isDomainExpertisePlatformCompatibilityMatrixValid } from "./domainExpertisePlatformCompatibility.ts";
import {
  DOMAIN_EXPERTISE_EXTENSION_POLICY,
  DOMAIN_EXPERTISE_PLATFORM_REGISTRY,
  DOMAIN_EXPERTISE_PUBLIC_API_REGISTRY,
} from "./domainExpertisePlatformFreezeRegistry.ts";
import {
  buildDomainExpertisePlatformManifest,
  isDomainExpertisePlatformManifestValid,
} from "./domainExpertisePlatformManifest.ts";
import type {
  DomainExpertisePlatformCertificationDiagnostic,
  DomainExpertisePlatformCertificationGate,
  DomainExpertisePlatformCertificationResult,
} from "./domainExpertisePlatformFreezeTypes.ts";

function gate(gateId: string, description: string, passed: boolean): DomainExpertisePlatformCertificationGate {
  return Object.freeze({ gateId, description, passed });
}

function diagnosticFromGate(gateResult: DomainExpertisePlatformCertificationGate): DomainExpertisePlatformCertificationDiagnostic {
  return Object.freeze({
    code: gateResult.passed ? "certification_gate_passed" : "certification_gate_failed",
    message: gateResult.description,
    gateId: gateResult.gateId,
    severity: gateResult.passed ? "info" : "error",
  });
}

function isPlatformRegistryValid(): boolean {
  const platformIds = DOMAIN_EXPERTISE_PLATFORM_REGISTRY.map((entry) => entry.platformId);
  return (
    DOMAIN_EXPERTISE_PLATFORM_REGISTRY.length === 7 &&
    new Set(platformIds).size === platformIds.length &&
    DOMAIN_EXPERTISE_PLATFORM_REGISTRY.every((entry) => entry.metadataOnly && entry.runtimeDependency === false)
  );
}

function isPublicApiRegistryValid(): boolean {
  const apiKeys = DOMAIN_EXPERTISE_PUBLIC_API_REGISTRY.map((entry) => `${entry.sourcePlatform}:${entry.apiName}`);
  return (
    DOMAIN_EXPERTISE_PUBLIC_API_REGISTRY.length > 0 &&
    new Set(apiKeys).size === apiKeys.length &&
    DOMAIN_EXPERTISE_PUBLIC_API_REGISTRY.every((entry) => entry.stable && entry.metadataOnly)
  );
}

function isExtensionPolicyValid(): boolean {
  return (
    DOMAIN_EXPERTISE_EXTENSION_POLICY.allowsNewDomainPlatforms &&
    !DOMAIN_EXPERTISE_EXTENSION_POLICY.allowsDomainFunctionality &&
    !DOMAIN_EXPERTISE_EXTENSION_POLICY.allowsReasoning &&
    !DOMAIN_EXPERTISE_EXTENSION_POLICY.allowsRecommendations &&
    !DOMAIN_EXPERTISE_EXTENSION_POLICY.allowsRuntimeExecution &&
    !DOMAIN_EXPERTISE_EXTENSION_POLICY.allowsInference &&
    !DOMAIN_EXPERTISE_EXTENSION_POLICY.allowsAiLogic &&
    !DOMAIN_EXPERTISE_EXTENSION_POLICY.allowsUiBehavior &&
    !DOMAIN_EXPERTISE_EXTENSION_POLICY.allowsPersistence &&
    !DOMAIN_EXPERTISE_EXTENSION_POLICY.allowsNetworking &&
    !DOMAIN_EXPERTISE_EXTENSION_POLICY.allowsDatabaseAccess
  );
}

export function runDomainExpertisePlatformCertification(): DomainExpertisePlatformCertificationResult {
  const manifest = buildDomainExpertisePlatformManifest();
  const secondManifest = buildDomainExpertisePlatformManifest();
  const gates: readonly DomainExpertisePlatformCertificationGate[] = Object.freeze([
    gate("dom-1-platform-freeze-pass", "DOM-1 Domain Foundation public validation passes.", validateDomainFoundation().valid && buildDomainFoundationManifest().metadataOnly),
    gate("dom-2-platform-freeze-pass", "DOM-2 Vocabulary Platform freeze passes.", DomainVocabularyPlatformFreeze.runDomainVocabularyPlatformFreeze().status === "PASS"),
    gate("dom-3-platform-freeze-pass", "DOM-3 Ontology Platform freeze passes.", DomainOntologyPlatformFreeze.runDomainOntologyPlatformFreeze().status === "PASS"),
    gate("dom-4-platform-freeze-pass", "DOM-4 KPI Platform freeze passes.", DomainKpiPlatformFreeze.runDomainKpiPlatformFreeze().status === "PASS"),
    gate("dom-5-platform-freeze-pass", "DOM-5 Regulation Platform certification regression passes.", DomainRegulationCertificationLayer.runDomainRegulationRegression().failed === 0),
    gate("dom-6-platform-freeze-pass", "DOM-6 Reasoning Contract Platform freeze passes.", DomainReasoningPlatformFreeze.runDomainReasoningPlatformFreeze().status === "PASS"),
    gate("dom-7-platform-freeze-pass", "DOM-7 Recommendation Contract Platform freeze passes.", DomainRecommendationPlatformFreeze.runDomainRecommendationPlatformFreeze().status === "PASS"),
    gate("manifest-valid", "DOM-8 platform manifest is valid.", isDomainExpertisePlatformManifestValid(manifest)),
    gate("platform-registry-valid", "DOM platform registry is complete and immutable metadata.", isPlatformRegistryValid()),
    gate("compatibility-matrix-valid", "DOM platform compatibility matrix is complete.", isDomainExpertisePlatformCompatibilityMatrixValid(manifest.compatibilityMatrix)),
    gate("public-api-registry-valid", "DOM public API registry is stable and complete.", isPublicApiRegistryValid()),
    gate("extension-policy-valid", "DOM extension policy preserves metadata-only boundaries.", isExtensionPolicyValid()),
    gate("deterministic-reproducibility", "DOM-8 manifest generation is deterministic.", manifest.fingerprint === secondManifest.fingerprint),
    gate(
      "metadata-only-boundary",
      "DOM-8 introduces no runtime domain functionality.",
      manifest.metadataOnly &&
        !manifest.platformIdentity.runtimeBehavior &&
        !manifest.platformIdentity.domainFunctionality &&
        manifest.platformRegistry.every((entry) => entry.metadataOnly && !entry.runtimeDependency)
    ),
  ]);
  const status = gates.every((entry) => entry.passed) ? "PASS" : "FAIL";

  return Object.freeze({
    status,
    gates,
    diagnostics: Object.freeze(gates.map(diagnosticFromGate)),
    manifest,
  });
}
