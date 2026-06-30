import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  BUSINESS_VOCABULARY_CATEGORY_KEYS,
  BUSINESS_VOCABULARY_CONTRACT_VERSION,
  BUSINESS_VOCABULARY_DOMAIN_KEYS,
  BUSINESS_VOCABULARY_FUTURE_PHASE_KEYS,
  BUSINESS_VOCABULARY_LANGUAGE_KEYS,
  BUSINESS_VOCABULARY_MUST_NOT_OWN,
  BUSINESS_VOCABULARY_PRINCIPLES,
  BUSINESS_VOCABULARY_PUBLIC_API_REGISTRY,
} from "./businessVocabularyCatalog.ts";
import {
  BUSINESS_VOCABULARY_PUBLIC_API_RULES,
  BUSINESS_VOCABULARY_SELF_MANIFEST,
  BusinessVocabularyContract,
  getBusinessVocabularyManifest,
  resolveCanonicalNameExample,
  resolveVocabularyAcronymExample,
  resolveVocabularyAliasExample,
  resolveVocabularyTermExample,
  validateBusinessVocabulary,
} from "./businessVocabularyContracts.ts";
import {
  BusinessVocabulary,
  buildBusinessVocabulary,
  getBusinessVocabulary,
  isBusinessVocabularyInitialized,
  registerBusinessAcronym,
  registerBusinessAlias,
  registerBusinessTerm,
  resetBusinessVocabularyForTests,
} from "./businessVocabulary.ts";
import {
  hasDuplicateAliases,
  hasDuplicateCanonicalNames,
  hasDuplicateVocabularyIds,
  validateCanonicalNameFormat,
  validateLanguageCodeFormat,
  validateOntologyEntityReference,
  validateVocabularyTermRegistration,
  validateVocabularyVersionFormat,
} from "./businessVocabularyValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

test.beforeEach(() => {
  resetBusinessVocabularyForTests();
});

test("exports KNL/3 vocabulary contract vocabulary", () => {
  assert.equal(BUSINESS_VOCABULARY_CONTRACT_VERSION, "KNL/3");
  assert.equal(BUSINESS_VOCABULARY_CATEGORY_KEYS.length, 8);
  assert.equal(BUSINESS_VOCABULARY_DOMAIN_KEYS.length, 6);
  assert.equal(BUSINESS_VOCABULARY_LANGUAGE_KEYS.length, 4);
});

test("initializes business vocabulary with KNL/1 and KNL/2 dependencies", () => {
  assert.equal(isBusinessVocabularyInitialized(), false);
  const init = buildBusinessVocabulary(FIXED_TIME);
  assert.equal(init.success, true);
  assert.equal(isBusinessVocabularyInitialized(), true);
  assert.equal(init.data?.foundationDependency, "KNL/1");
  assert.equal(init.data?.ontologyDependency, "KNL/2");
  assert.equal(init.data?.contractVersion, "KNL/3");
});

test("seeds vocabulary catalog with categories domains languages and sources", () => {
  buildBusinessVocabulary(FIXED_TIME);
  const vocabulary = getBusinessVocabulary(FIXED_TIME);
  assert.equal(vocabulary.registry.categories.length, BUSINESS_VOCABULARY_CATEGORY_KEYS.length);
  assert.equal(vocabulary.registry.domains.length, BUSINESS_VOCABULARY_DOMAIN_KEYS.length);
  assert.equal(vocabulary.registry.languages.length, BUSINESS_VOCABULARY_LANGUAGE_KEYS.length);
  assert.equal(vocabulary.registry.sources.length, 4);
  assert.equal(vocabulary.registry.tags.length, 1);
});

test("registers business term alias and acronym", () => {
  buildBusinessVocabulary(FIXED_TIME);
  const term = registerBusinessTerm(
    Object.freeze({
      termId: "vocabulary-term-test-001",
      canonicalName: "strategic_goal",
      displayName: "Strategic Goal",
      preferredLabel: "Strategic Goal",
      businessDefinition: "A measurable strategic objective.",
      description: "Test vocabulary term.",
      categoryKey: "strategy",
      domainKey: "strategy",
      languageCode: "en",
      status: "active",
      sourceKey: "ontology",
      ontologyEntityId: "business-relationship-type-supports",
      tags: Object.freeze(["strategy"]),
    }),
    FIXED_TIME
  );
  assert.equal(term.success, true);
  const alias = registerBusinessAlias(
    Object.freeze({
      aliasId: "vocabulary-alias-test-001",
      termId: "vocabulary-term-test-001",
      alias: "Strategic Objective",
      languageCode: "en",
    }),
    FIXED_TIME
  );
  assert.equal(alias.success, true);
  const acronym = registerBusinessAcronym(
    Object.freeze({
      acronymId: "vocabulary-acronym-test-001",
      termId: "vocabulary-term-test-001",
      acronym: "SG",
      expandedForm: "Strategic Goal",
    }),
    FIXED_TIME
  );
  assert.equal(acronym.success, true);
  const updated = getBusinessVocabulary(FIXED_TIME).registry.terms.find(
    (entry) => entry.termId === "vocabulary-term-test-001"
  );
  assert.equal(updated?.aliases.includes("Strategic Objective"), true);
  assert.equal(updated?.acronyms.includes("SG"), true);
});

test("prevents duplicate term ids canonical names and aliases", () => {
  buildBusinessVocabulary(FIXED_TIME);
  const input = Object.freeze({
    termId: "vocabulary-term-dup-001",
    canonicalName: "revenue_kpi",
    displayName: "Revenue KPI",
    preferredLabel: "Revenue KPI",
    businessDefinition: "Revenue performance indicator.",
    description: "First term.",
    categoryKey: "performance" as const,
    domainKey: "finance" as const,
    languageCode: "en",
    status: "active" as const,
    sourceKey: "platform" as const,
    ontologyEntityId: "business-relationship-type-measures",
  });
  assert.equal(registerBusinessTerm(input, FIXED_TIME).success, true);
  const duplicateId = registerBusinessTerm(input, FIXED_TIME);
  assert.equal(duplicateId.success, false);
  const duplicateName = registerBusinessTerm(
    Object.freeze({ ...input, termId: "vocabulary-term-dup-002" }),
    FIXED_TIME
  );
  assert.equal(duplicateName.success, false);
  assert.match(duplicateName.reason, /Canonical name already registered/);

  registerBusinessAlias(
    Object.freeze({
      aliasId: "vocabulary-alias-dup-001",
      termId: "vocabulary-term-dup-001",
      alias: "Revenue Indicator",
      languageCode: "en",
    }),
    FIXED_TIME
  );
  const duplicateAlias = registerBusinessAlias(
    Object.freeze({
      aliasId: "vocabulary-alias-dup-002",
      termId: "vocabulary-term-dup-001",
      alias: "Revenue Indicator",
      languageCode: "en",
    }),
    FIXED_TIME
  );
  assert.equal(duplicateAlias.success, false);
});

test("validates ontology references language codes and canonical names", () => {
  buildBusinessVocabulary(FIXED_TIME);
  assert.equal(validateLanguageCodeFormat("en").valid, true);
  assert.equal(validateLanguageCodeFormat("en-US").valid, true);
  assert.equal(validateLanguageCodeFormat("invalid").valid, false);
  assert.equal(validateCanonicalNameFormat("strategic_goal").valid, true);
  assert.equal(validateCanonicalNameFormat("Invalid-Name").valid, false);
  assert.equal(validateVocabularyVersionFormat("KNL/3").valid, true);
  assert.equal(hasDuplicateVocabularyIds(["a", "b", "a"]), true);
  assert.equal(hasDuplicateCanonicalNames(["Goal", "goal"]), true);
  assert.equal(hasDuplicateAliases(["Alias", "alias"]), true);
  assert.equal(validateOntologyEntityReference("business-relationship-type-owns").valid, true);
  assert.equal(validateOntologyEntityReference("nonexistent-entity").valid, false);
});

test("rejects term with invalid ontology reference", () => {
  buildBusinessVocabulary(FIXED_TIME);
  assert.equal(
    validateVocabularyTermRegistration(
      Object.freeze({
        termId: "vocabulary-term-invalid",
        canonicalName: "invalid_ref",
        displayName: "Invalid",
        preferredLabel: "Invalid",
        businessDefinition: "Invalid reference test.",
        description: "Invalid ontology reference.",
        categoryKey: "core",
        domainKey: "business",
        languageCode: "en",
        status: "draft",
        sourceKey: "ontology",
        ontologyEntityId: "nonexistent-ontology-entity",
      })
    ).valid,
    false
  );
});

test("resolves immutable vocabulary contract examples", () => {
  assert.equal(Object.isFrozen(resolveVocabularyTermExample(FIXED_TIME)), true);
  assert.equal(Object.isFrozen(resolveVocabularyAliasExample(FIXED_TIME)), true);
  assert.equal(Object.isFrozen(resolveVocabularyAcronymExample(FIXED_TIME)), true);
  assert.equal(Object.isFrozen(resolveCanonicalNameExample()), true);
  assert.equal(resolveVocabularyTermExample(FIXED_TIME).version, "KNL/3");
});

test("builds immutable business vocabulary manifest", () => {
  buildBusinessVocabulary(FIXED_TIME);
  const manifest = getBusinessVocabularyManifest(FIXED_TIME);
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.contractVersion, "KNL/3");
  assert.equal(manifest.foundationDependency, "KNL/1");
  assert.equal(manifest.ontologyDependency, "KNL/2");
  assert.equal(manifest.publicApis.length, BUSINESS_VOCABULARY_PUBLIC_API_REGISTRY.length);
});

test("validates business vocabulary certification report", () => {
  const report = validateBusinessVocabulary(FIXED_TIME);
  assert.equal(report.valid, true, report.issues.map((entry) => entry.message).join("; "));
  assert.equal(report.foundationValid, true);
  assert.equal(report.ontologyValid, true);
  assert.equal(report.vocabularyInitialized, true);
  assert.equal(report.registryValid, true);
});

test("validates KNL/3 stage manifest and architecture boundaries", () => {
  assert.equal(validateStageManifest(BUSINESS_VOCABULARY_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/knowledge/businessVocabulary.ts",
    allowedFiles: BUSINESS_VOCABULARY_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: BUSINESS_VOCABULARY_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("enforces public API and boundary rules", () => {
  assert.equal(BUSINESS_VOCABULARY_PUBLIC_API_RULES.metadataOnly, true);
  assert.equal(BUSINESS_VOCABULARY_PUBLIC_API_RULES.noNlp, true);
  assert.equal(BUSINESS_VOCABULARY_PUBLIC_API_RULES.noTranslation, true);
  assert.equal(BUSINESS_VOCABULARY_MUST_NOT_OWN.includes("nlp"), true);
  assert.equal(BUSINESS_VOCABULARY_MUST_NOT_OWN.includes("translation_engine"), true);
  assert.equal(BUSINESS_VOCABULARY_PRINCIPLES.includes("knl_3_consumes_knl_1_and_knl_2_only"), true);
});

test("exports business vocabulary contract bundle", () => {
  assert.equal(BusinessVocabularyContract.version, "KNL/3");
  assert.equal(typeof BusinessVocabularyContract.validateBusinessVocabulary, "function");
  assert.equal(typeof BusinessVocabularyContract.getBusinessVocabularyManifest, "function");
});

test("BusinessVocabulary namespace exposes public APIs only", () => {
  assert.equal(typeof BusinessVocabulary.registerBusinessTerm, "function");
  assert.equal(typeof BusinessVocabulary.registerBusinessAlias, "function");
  assert.equal(typeof BusinessVocabulary.registerBusinessAcronym, "function");
  assert.equal(typeof BusinessVocabulary.getBusinessVocabulary, "function");
  assert.equal(typeof BusinessVocabulary.validateBusinessVocabulary, "function");
  assert.equal(typeof BusinessVocabulary.getBusinessVocabularyManifest, "function");
  assert.equal(BusinessVocabulary.version, "KNL/3");
});

test("public API registry includes required vocabulary exports", () => {
  assert.ok(BUSINESS_VOCABULARY_PUBLIC_API_REGISTRY.includes("registerBusinessTerm"));
  assert.ok(BUSINESS_VOCABULARY_PUBLIC_API_REGISTRY.includes("registerBusinessAlias"));
  assert.ok(BUSINESS_VOCABULARY_PUBLIC_API_REGISTRY.includes("registerBusinessAcronym"));
  assert.ok(BUSINESS_VOCABULARY_PUBLIC_API_REGISTRY.includes("getBusinessVocabulary"));
  assert.ok(BUSINESS_VOCABULARY_PUBLIC_API_REGISTRY.includes("validateBusinessVocabulary"));
  assert.ok(BUSINESS_VOCABULARY_PUBLIC_API_REGISTRY.includes("getBusinessVocabularyManifest"));
});

test("future phase registry reserves knowledge graph without implementation", () => {
  assert.equal(BUSINESS_VOCABULARY_FUTURE_PHASE_KEYS.includes("knowledge_graph"), true);
  assert.equal(BUSINESS_VOCABULARY_FUTURE_PHASE_KEYS.includes("knowledge_retrieval"), true);
});

test("getBusinessVocabulary returns registry and state", () => {
  buildBusinessVocabulary(FIXED_TIME);
  const vocabulary = getBusinessVocabulary(FIXED_TIME);
  assert.equal(vocabulary.state.initialized, true);
  assert.equal(vocabulary.registry.snapshot.vocabularyVersion, "KNL/3");
});

test("rejects acronym registration for unknown term", () => {
  buildBusinessVocabulary(FIXED_TIME);
  const result = registerBusinessAcronym(
    Object.freeze({
      acronymId: "vocabulary-acronym-orphan",
      termId: "unknown-term",
      acronym: "XX",
      expandedForm: "Unknown",
    }),
    FIXED_TIME
  );
  assert.equal(result.success, false);
  assert.match(result.reason, /not found/);
});
