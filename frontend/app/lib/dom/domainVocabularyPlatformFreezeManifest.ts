import {
  runDomainVocabularyCertification,
  runDomainVocabularyRegression,
} from "./domainVocabularyCertificationIndex.ts";
import {
  getDomainVocabularyPlatformCompatibilityMatrix,
} from "./domainVocabularyPlatformCompatibility.ts";
import {
  DOMAIN_VOCABULARY_EXTENSION_POLICY,
  DOMAIN_VOCABULARY_PHASE_REGISTRY,
  DOMAIN_VOCABULARY_PLATFORM_IDENTITY,
  DOMAIN_VOCABULARY_PUBLIC_API_REGISTRY,
  DOMAIN_VOCABULARY_RELEASE_METADATA,
} from "./domainVocabularyPlatformFreezeRegistry.ts";
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
import type { DomainVocabularyPlatformFreezeManifest } from "./domainVocabularyPlatformFreezeTypes.ts";

function stableHash(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function placeholderDomain(): DomainPackage {
  return Object.freeze({
    contractVersion: "DOM-1",
    manifest: Object.freeze({
      domainId: "domain.freeze-placeholder",
      name: "Freeze Placeholder",
      version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
      metadata: Object.freeze({
        displayName: "Freeze Placeholder Domain",
        description: "Neutral placeholder domain metadata for platform freeze certification.",
        category: "other",
        tags: Object.freeze(["freeze-placeholder"]),
      }),
      capabilities: Object.freeze([
        Object.freeze({
          id: "platform-freeze",
          name: "Platform Freeze",
          description: "Supports deterministic platform freeze certification fixtures.",
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
    vocabularyId: "vocabulary.freeze-placeholder.core",
    domainId: "domain.freeze-placeholder",
    name: "Freeze Placeholder Vocabulary",
    description: "Neutral placeholder vocabulary metadata for platform freeze certification.",
    version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
    status: "active",
    terms: Object.freeze([
      Object.freeze({
        termId: "term.freeze-placeholder.core",
        label: "Freeze Placeholder",
        definition: Object.freeze({
          text: "Neutral placeholder definition for platform freeze certification.",
          language: "en",
        }),
        synonyms: Object.freeze([
          Object.freeze({
            label: "Freeze Placeholder Alias",
            normalizedLabel: "freeze placeholder alias",
          }),
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

function freezeFingerprint(manifest: Omit<DomainVocabularyPlatformFreezeManifest, "fingerprint">): string {
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

export function buildDomainVocabularyPlatformFreezeManifest(): DomainVocabularyPlatformFreezeManifest {
  const certification = runDomainVocabularyCertification(certificationRegistry());
  const regression = runDomainVocabularyRegression();
  const base = Object.freeze({
    platformIdentity: DOMAIN_VOCABULARY_PLATFORM_IDENTITY,
    phaseRegistry: DOMAIN_VOCABULARY_PHASE_REGISTRY,
    publicApiRegistry: DOMAIN_VOCABULARY_PUBLIC_API_REGISTRY,
    compatibilityMatrix: getDomainVocabularyPlatformCompatibilityMatrix(),
    extensionPolicy: DOMAIN_VOCABULARY_EXTENSION_POLICY,
    releaseMetadata: DOMAIN_VOCABULARY_RELEASE_METADATA,
    certificationStatus: certification.status,
    regressionStatus: regression.failed === 0 ? "PASS" as const : "FAIL" as const,
    immutable: true as const,
    deterministic: true as const,
    metadataOnly: true as const,
  });

  return Object.freeze({
    ...base,
    fingerprint: freezeFingerprint(base),
  });
}

export function isDomainVocabularyPlatformFreezeManifestValid(
  manifest: DomainVocabularyPlatformFreezeManifest
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
    manifest.platformIdentity.version === "DOM-2:4" &&
    manifest.phaseRegistry.length === 4 &&
    manifest.publicApiRegistry.length > 0 &&
    manifest.compatibilityMatrix.length === 8 &&
    manifest.certificationStatus === "PASS" &&
    manifest.regressionStatus === "PASS" &&
    manifest.immutable === true &&
    manifest.deterministic === true &&
    manifest.metadataOnly === true &&
    manifest.fingerprint === expected
  );
}
