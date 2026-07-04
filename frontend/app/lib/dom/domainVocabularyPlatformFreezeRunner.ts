import {
  runDomainVocabularyCertification,
  runDomainVocabularyRegression,
} from "./domainVocabularyCertificationIndex.ts";
import {
  isDomainVocabularyCompatibilityMatrixValid,
} from "./domainVocabularyPlatformCompatibility.ts";
import {
  buildDomainVocabularyPlatformFreezeManifest,
  isDomainVocabularyPlatformFreezeManifestValid,
} from "./domainVocabularyPlatformFreezeManifest.ts";
import { DOMAIN_VOCABULARY_PUBLIC_API_REGISTRY } from "./domainVocabularyPlatformFreezeRegistry.ts";
import {
  createDomainRegistry,
  registerDomain,
  type DomainPackage,
} from "./domainFoundationIndex.ts";
import {
  createDomainVocabularyRegistry,
  registerDomainVocabulary,
  type DomainVocabularyPackage,
} from "./domainVocabularyIndex.ts";
import type { DomainVocabularyFreezeResult } from "./domainVocabularyPlatformFreezeTypes.ts";

let freezeState: DomainVocabularyFreezeResult | null = null;

function check(checkId: string, passed: boolean, description: string) {
  return Object.freeze({ checkId, passed, description });
}

function placeholderDomain(): DomainPackage {
  return Object.freeze({
    contractVersion: "DOM-1",
    manifest: Object.freeze({
      domainId: "domain.freeze-runner",
      name: "Freeze Runner",
      version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
      metadata: Object.freeze({
        displayName: "Freeze Runner Domain",
        description: "Neutral placeholder domain metadata for freeze runner certification.",
        category: "other",
        tags: Object.freeze(["freeze-runner"]),
      }),
      capabilities: Object.freeze([
        Object.freeze({
          id: "freeze-runner",
          name: "Freeze Runner",
          description: "Supports deterministic freeze runner certification fixtures.",
          enabled: true,
        }),
      ]),
      dependencies: Object.freeze([]),
      status: "active",
    }),
  });
}

function placeholderVocabulary(): DomainVocabularyPackage {
  return Object.freeze({
    contractVersion: "DOM-2:1",
    vocabularyId: "vocabulary.freeze-runner.core",
    domainId: "domain.freeze-runner",
    name: "Freeze Runner Vocabulary",
    description: "Neutral placeholder vocabulary metadata for freeze runner certification.",
    version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
    status: "active",
    terms: Object.freeze([
      Object.freeze({
        termId: "term.freeze-runner.core",
        label: "Freeze Runner",
        definition: Object.freeze({
          text: "Neutral placeholder definition for freeze runner certification.",
          language: "en",
        }),
        synonyms: Object.freeze([
          Object.freeze({ label: "Freeze Runner Alias", normalizedLabel: "freeze runner alias" }),
        ]),
        scope: "domain",
        status: "active",
      }),
    ]),
  });
}

function certificationRegistry() {
  const domainRegistry = registerDomain(createDomainRegistry(), placeholderDomain()).registry;
  return registerDomainVocabulary(
    createDomainVocabularyRegistry(),
    placeholderVocabulary(),
    domainRegistry
  ).registry;
}

function isPublicApiRegistryValid(): boolean {
  const apiNames = DOMAIN_VOCABULARY_PUBLIC_API_REGISTRY.map((entry) => entry.apiName);
  return (
    apiNames.length > 0 &&
    new Set(apiNames).size === apiNames.length &&
    DOMAIN_VOCABULARY_PUBLIC_API_REGISTRY.every((entry) => entry.stable && entry.metadataOnly)
  );
}

export function runDomainVocabularyPlatformFreeze(): DomainVocabularyFreezeResult {
  const manifest = buildDomainVocabularyPlatformFreezeManifest();
  const certification = runDomainVocabularyCertification(certificationRegistry());
  const regression = runDomainVocabularyRegression();
  const checks = Object.freeze([
    check("dom-2-3-certification-pass", certification.status === "PASS", "DOM-2:3 certification must pass."),
    check("dom-2-regression-pass", regression.failed === 0, "DOM-2 regression metadata must pass."),
    check("manifest-valid", isDomainVocabularyPlatformFreezeManifestValid(manifest), "Freeze manifest must be valid."),
    check("compatibility-matrix-valid", isDomainVocabularyCompatibilityMatrixValid(manifest.compatibilityMatrix), "Compatibility matrix must include required read-only boundaries."),
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

export function getDomainVocabularyPlatformFreezeState(): DomainVocabularyFreezeResult {
  if (!freezeState) {
    return runDomainVocabularyPlatformFreeze();
  }
  return freezeState;
}
