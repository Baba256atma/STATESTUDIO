import {
  DomainFoundation,
  buildDomainFoundationManifest,
  createDomainRegistry,
  registerDomain,
  validateDomainFoundation,
  type DomainPackage,
} from "./domainFoundationIndex.ts";
import {
  DomainVocabularyFoundation,
  createDomainVocabularyRegistry,
  freezeDomainVocabularyRegistry,
  registerDomainVocabulary,
  validateDomainVocabularyFoundation,
  validateDomainVocabularyRegistry,
  type DomainVocabularyPackage,
  type DomainVocabularyRegistry,
} from "./domainVocabularyIndex.ts";
import {
  DomainVocabularyQueryLayer,
  buildDomainVocabularySnapshot,
  diffDomainVocabularySnapshots,
  findDomainTerm,
  queryDomainVocabularies,
  resolveDomainSynonym,
  validateDomainVocabularySnapshot,
} from "./domainVocabularyQueryIndex.ts";
import {
  buildDomainVocabularyExportBundle,
  compareDomainVocabularyExportBundles,
  validateDomainVocabularyExportBundle,
} from "./domainVocabularyExport.ts";
import {
  DOMAIN_VOCABULARY_EXPORT_CONTRACT_VERSION,
  type DomainVocabularyCertificationGate,
  type DomainVocabularyCertificationResult,
} from "./domainVocabularyExportTypes.ts";

function gate(gateId: string, description: string, passed: boolean): DomainVocabularyCertificationGate {
  return Object.freeze({ gateId, description, passed });
}

function placeholderDomain(): DomainPackage {
  return Object.freeze({
    contractVersion: "DOM-1",
    manifest: Object.freeze({
      domainId: "domain.placeholder",
      name: "Placeholder",
      version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
      metadata: Object.freeze({
        displayName: "Placeholder Domain",
        description: "Neutral placeholder domain metadata for certification.",
        category: "other",
        tags: Object.freeze(["placeholder"]),
      }),
      capabilities: Object.freeze([
        Object.freeze({
          id: "metadata-certification",
          name: "Metadata Certification",
          description: "Supports deterministic metadata certification fixtures.",
          enabled: true,
        }),
      ]),
      dependencies: Object.freeze([]),
      status: "active",
    }),
  });
}

function placeholderVocabulary(suffix: string, definition = "Neutral placeholder definition."): DomainVocabularyPackage {
  return Object.freeze({
    contractVersion: "DOM-2:1",
    vocabularyId: `vocabulary.placeholder.${suffix}`,
    domainId: "domain.placeholder",
    name: `Placeholder ${suffix} Vocabulary`,
    description: "Neutral placeholder vocabulary metadata for certification.",
    version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
    status: "active",
    terms: Object.freeze([
      Object.freeze({
        termId: `term.placeholder.${suffix}`,
        label: `Placeholder ${suffix}`,
        definition: Object.freeze({ text: definition, language: "en" }),
        synonyms: Object.freeze([
          Object.freeze({ label: `Placeholder ${suffix} Alias`, normalizedLabel: `placeholder ${suffix} alias` }),
        ]),
        scope: "domain",
        status: "active",
      }),
    ]),
  });
}

function certificationFixtureRegistry(): DomainVocabularyRegistry {
  const domainRegistry = registerDomain(createDomainRegistry(), placeholderDomain()).registry;
  const registered = registerDomainVocabulary(
    createDomainVocabularyRegistry(),
    placeholderVocabulary("canonical"),
    domainRegistry
  );
  return registered.registry;
}

function hasQueryCapability(): boolean {
  return (
    typeof DomainVocabularyQueryLayer.queryDomainVocabularies === "function" &&
    typeof DomainVocabularyQueryLayer.findVocabulariesByDomain === "function" &&
    typeof DomainVocabularyQueryLayer.sortDomainVocabularies === "function"
  );
}

function hasLookupCapability(): boolean {
  return (
    typeof DomainVocabularyQueryLayer.findDomainTerm === "function" &&
    typeof DomainVocabularyQueryLayer.findTermsByDomain === "function" &&
    typeof DomainVocabularyQueryLayer.findTermsByScope === "function" &&
    typeof DomainVocabularyQueryLayer.findTermsByStatus === "function"
  );
}

function hasFoundationCompatibility(): boolean {
  return (
    typeof DomainFoundation.createDomainRegistry === "function" &&
    typeof DomainVocabularyFoundation.createDomainVocabularyRegistry === "function" &&
    validateDomainFoundation().valid &&
    buildDomainFoundationManifest().metadataOnly === true
  );
}

function exactSynonymResolutionPasses(): boolean {
  const fixture = certificationFixtureRegistry();
  const resolved = resolveDomainSynonym(fixture, " Placeholder canonical Alias ");
  const fuzzyMiss = resolveDomainSynonym(fixture, "Placeholder canonical");

  return (
    resolved.resolved &&
    resolved.term?.termId === "term.placeholder.canonical" &&
    fuzzyMiss.resolved === false
  );
}

function snapshotDiffPasses(): boolean {
  const domainRegistry = registerDomain(createDomainRegistry(), placeholderDomain()).registry;
  const left = registerDomainVocabulary(
    createDomainVocabularyRegistry(),
    placeholderVocabulary("canonical"),
    domainRegistry
  ).registry;
  const right = registerDomainVocabulary(
    createDomainVocabularyRegistry(),
    placeholderVocabulary("canonical", "Modified neutral placeholder definition."),
    domainRegistry
  ).registry;
  const diff = diffDomainVocabularySnapshots(
    buildDomainVocabularySnapshot(left),
    buildDomainVocabularySnapshot(right)
  );

  return diff.entries.some((entry) => entry.type === "modified");
}

export function runDomainVocabularyCertification(
  registry: DomainVocabularyRegistry
): DomainVocabularyCertificationResult {
  const exportBundle = buildDomainVocabularyExportBundle(registry);
  const secondBundle = buildDomainVocabularyExportBundle(registry);
  const exportValidation = validateDomainVocabularyExportBundle(exportBundle);
  const snapshotValidation = validateDomainVocabularySnapshot(exportBundle.vocabularySnapshot);
  const reproducible = compareDomainVocabularyExportBundles(exportBundle, secondBundle).equal;
  const frozenRegistry = freezeDomainVocabularyRegistry(registry);
  const frozenBundle = buildDomainVocabularyExportBundle(frozenRegistry);
  const queryResult = queryDomainVocabularies(registry);
  const firstTermId = registry.vocabularies[0]?.package.terms[0]?.termId ?? "";
  const termLookup = firstTermId ? findDomainTerm(registry, firstTermId) : { found: registry.vocabularies.length === 0 };

  const gates: readonly DomainVocabularyCertificationGate[] = Object.freeze([
    gate("vocabulary-foundation-valid", "Vocabulary foundation validation passes.", validateDomainVocabularyFoundation().valid),
    gate("registry-valid", "Vocabulary registry validation passes.", validateDomainVocabularyRegistry(registry).valid),
    gate("snapshot-valid", "Vocabulary snapshot validation passes.", snapshotValidation.valid),
    gate("export-bundle-valid", "Vocabulary export bundle validation passes.", exportValidation.valid),
    gate("deterministic-reproducibility", "Export bundle generation is deterministically reproducible.", reproducible),
    gate("query-capability-available", "Vocabulary query capability APIs are available and callable.", hasQueryCapability() && Array.isArray(queryResult)),
    gate("term-lookup-capability-available", "Term lookup capability APIs are available and callable.", hasLookupCapability() && termLookup.found === (registry.vocabularies.length > 0)),
    gate("exact-synonym-resolution", "Synonym resolution is exact and deterministic with no fuzzy matching.", exactSynonymResolutionPasses()),
    gate("snapshot-diff-capability", "Snapshot diff capability detects deterministic metadata changes.", snapshotDiffPasses()),
    gate("frozen-registry-readable", "Frozen vocabulary registry can be read and exported.", frozenBundle.metadata.frozen === true && validateDomainVocabularyExportBundle(frozenBundle).valid),
    gate("dom-1-compatibility", "DOM-1 foundation public APIs remain compatible.", hasFoundationCompatibility()),
    gate(
      "metadata-only-boundary",
      "Vocabulary certification remains metadata-only with no runtime behavior.",
      exportBundle.metadata.metadataOnly &&
        !exportBundle.metadata.runtimeBehavior &&
        exportBundle.vocabularyManifest.metadataOnly &&
        !exportBundle.vocabularyManifest.runtimeBehavior
    ),
  ]);

  const passed = gates.every((entry) => entry.passed);

  return Object.freeze({
    contractVersion: DOMAIN_VOCABULARY_EXPORT_CONTRACT_VERSION,
    status: passed ? "PASS" : "FAIL",
    gates,
    exportBundle,
  });
}
