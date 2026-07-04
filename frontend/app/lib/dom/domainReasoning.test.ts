import assert from "node:assert/strict";
import test from "node:test";

import {
  createDomainRegistry,
  registerDomain,
  validateDomainFoundation,
  type DomainPackage,
  type DomainRegistry,
} from "./domainFoundationIndex.ts";
import {
  createDomainVocabularyRegistry,
  registerDomainVocabulary,
  validateDomainVocabularyFoundation,
  type DomainVocabularyPackage,
  type DomainVocabularyRegistry,
} from "./domainVocabularyIndex.ts";
import {
  createDomainOntologyRegistry,
  registerDomainOntology,
  validateDomainOntologyFoundation,
  type DomainOntologyPackage,
  type DomainOntologyRegistry,
} from "./domainOntologyIndex.ts";
import {
  createDomainKpiRegistry,
  registerDomainKpiPackage,
  validateDomainKpiFoundation,
  type DomainKpiPackage,
  type DomainKpiRegistry,
} from "./domainKpiIndex.ts";
import {
  createDomainRegulationRegistry,
  registerDomainRegulationPackage,
  validateDomainRegulationFoundation,
  type DomainRegulationPackage,
  type DomainRegulationRegistry,
} from "./domainRegulationIndex.ts";
import { DomainRegulationCertificationLayer } from "./domainRegulationCertificationIndex.ts";
import {
  DOMAIN_REASONING_PUBLIC_APIS,
  DomainReasoningFoundation,
  buildDomainReasoningManifest,
  createDomainReasoningRegistry,
  freezeDomainReasoningRegistry,
  getDomainReasoningPackage,
  hasDomainReasoningPackage,
  listDomainReasoningPackages,
  listReasoningPackagesByDomain,
  registerDomainReasoningPackage,
  unregisterDomainReasoningPackage,
  validateDomainReasoningPackage,
  validateDomainReasoningRegistry,
  type DomainReasoningPackage,
} from "./domainReasoningIndex.ts";

const DOMAIN_ID = "domain.reasoning-test";

function domainPackage(): DomainPackage {
  return Object.freeze({
    contractVersion: "DOM-1",
    manifest: Object.freeze({
      domainId: DOMAIN_ID,
      name: "Reasoning Test Domain",
      version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
      metadata: Object.freeze({
        displayName: "Reasoning Test Domain",
        description: "Neutral domain metadata for reasoning contract tests.",
        category: "other",
        tags: Object.freeze(["reasoning"]),
      }),
      capabilities: Object.freeze([]),
      dependencies: Object.freeze([]),
      status: "active",
    }),
  });
}

function vocabularyPackage(): DomainVocabularyPackage {
  return Object.freeze({
    contractVersion: "DOM-2:1",
    vocabularyId: "vocabulary.reasoning-test.core",
    domainId: DOMAIN_ID,
    name: "Reasoning Test Vocabulary",
    description: "Neutral vocabulary metadata.",
    version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
    status: "active",
    terms: Object.freeze([
      Object.freeze({
        termId: "term.reasoning-test.input",
        label: "Input",
        definition: Object.freeze({ text: "Neutral input term.", language: "en" }),
        synonyms: Object.freeze([]),
        scope: "domain",
        status: "active",
      }),
    ]),
  });
}

function ontologyPackage(): DomainOntologyPackage {
  return Object.freeze({
    contractVersion: "DOM-3:1",
    ontologyId: "ontology.reasoning-test.core",
    domainId: DOMAIN_ID,
    vocabularyId: "vocabulary.reasoning-test.core",
    name: "Reasoning Test Ontology",
    description: "Neutral ontology metadata.",
    version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
    scope: "domain",
    status: "active",
    entityTypes: Object.freeze([
      Object.freeze({
        entityTypeId: "entity.reasoning-test.source",
        label: "Source",
        description: "Neutral source entity.",
        scope: "domain",
        status: "active",
      }),
    ]),
    relationshipTypes: Object.freeze([]),
    attributes: Object.freeze([
      Object.freeze({
        attributeId: "attribute.reasoning-test.value",
        ownerEntityTypeId: "entity.reasoning-test.source",
        label: "Value",
        description: "Neutral value attribute.",
        valueType: "string",
        required: true,
        scope: "domain",
        status: "active",
      }),
    ]),
    constraints: Object.freeze([]),
  });
}

function kpiPackage(): DomainKpiPackage {
  return Object.freeze({
    contractVersion: "DOM-4:1",
    kpiPackageId: "kpi-package.reasoning-test.core",
    domainId: DOMAIN_ID,
    name: "Reasoning Test KPI Package",
    description: "Neutral KPI metadata.",
    version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
    scope: "domain",
    status: "active",
    kpis: Object.freeze([
      Object.freeze({
        kpiId: "kpi.reasoning-test.primary",
        label: "Primary KPI",
        description: "Neutral KPI.",
        intent: Object.freeze({
          label: "Observe",
          description: "Neutral observation intent.",
          direction: "neutral",
        }),
        unit: Object.freeze({ unitType: "count", unitLabel: "items", precision: 0 }),
        aggregation: Object.freeze({ aggregationType: "count", window: "instant", description: "Neutral aggregation." }),
        scope: "domain",
        status: "active",
      }),
    ]),
  });
}

function regulationPackage(): DomainRegulationPackage {
  return Object.freeze({
    contractVersion: "DOM-5:1",
    regulationPackageId: "regulation-package.reasoning-test.core",
    domainId: DOMAIN_ID,
    name: "Reasoning Test Regulation Package",
    description: "Neutral regulation metadata.",
    version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
    scope: "domain",
    jurisdictionScope: "unspecified",
    status: "active",
    regulations: Object.freeze([
      Object.freeze({
        regulationId: "regulation.reasoning-test.primary",
        label: "Primary Regulation",
        description: "Neutral regulation.",
        scope: "domain",
        jurisdictionScope: "unspecified",
        status: "active",
      }),
    ]),
    obligations: Object.freeze([]),
    controls: Object.freeze([]),
    evidence: Object.freeze([]),
  });
}

type FixtureRegistries = Readonly<{
  domainRegistry: DomainRegistry;
  vocabularyRegistry: DomainVocabularyRegistry;
  ontologyRegistry: DomainOntologyRegistry;
  kpiRegistry: DomainKpiRegistry;
  regulationRegistry: DomainRegulationRegistry;
}>;

function fixtureRegistries(): FixtureRegistries {
  const domainRegistry = registerDomain(createDomainRegistry(), domainPackage()).registry;
  const vocabularyRegistry = registerDomainVocabulary(
    createDomainVocabularyRegistry(),
    vocabularyPackage(),
    domainRegistry
  ).registry;
  const ontologyRegistry = registerDomainOntology(
    createDomainOntologyRegistry(),
    ontologyPackage(),
    domainRegistry,
    vocabularyRegistry
  ).registry;
  const kpiRegistry = registerDomainKpiPackage(
    createDomainKpiRegistry(),
    kpiPackage(),
    domainRegistry,
    vocabularyRegistry,
    ontologyRegistry
  ).registry;
  const regulationRegistry = registerDomainRegulationPackage(
    createDomainRegulationRegistry(),
    regulationPackage(),
    domainRegistry,
    vocabularyRegistry,
    ontologyRegistry,
    kpiRegistry
  ).registry;

  return Object.freeze({ domainRegistry, vocabularyRegistry, ontologyRegistry, kpiRegistry, regulationRegistry });
}

function reasoningPackage(
  reasoningPackageId = "reasoning-package.reasoning-test.core",
  contractId = "reasoning-contract.reasoning-test.primary"
): DomainReasoningPackage {
  return Object.freeze({
    contractVersion: "DOM-6:1",
    reasoningPackageId,
    domainId: DOMAIN_ID,
    name: "Reasoning Test Contract Package",
    description: "Neutral reasoning contract metadata.",
    version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
    scope: "domain",
    status: "active",
    contracts: Object.freeze([
      Object.freeze({
        contractId,
        label: "Primary Reasoning Contract",
        description: "Describes neutral reasoning metadata requirements without execution.",
        scope: "domain",
        status: "active",
        inputs: Object.freeze([
          Object.freeze({
            inputId: "input.reasoning-test.primary",
            label: "Primary Input",
            description: "Neutral input metadata.",
            required: true,
            reference: Object.freeze({
              domainId: DOMAIN_ID,
              vocabularyId: "vocabulary.reasoning-test.core",
              termId: "term.reasoning-test.input",
              ontologyId: "ontology.reasoning-test.core",
              entityTypeId: "entity.reasoning-test.source",
              attributeId: "attribute.reasoning-test.value",
            }),
          }),
        ]),
        outputs: Object.freeze([
          Object.freeze({
            outputId: "output.reasoning-test.primary",
            label: "Primary Output",
            description: "Neutral output metadata.",
            reference: Object.freeze({
              domainId: DOMAIN_ID,
              kpiPackageId: "kpi-package.reasoning-test.core",
              kpiId: "kpi.reasoning-test.primary",
            }),
          }),
        ]),
        evidenceRequirements: Object.freeze([
          Object.freeze({
            evidenceRequirementId: "evidence-requirement.reasoning-test.primary",
            label: "Primary Evidence",
            description: "Neutral evidence metadata requirement.",
            required: true,
            reference: Object.freeze({
              domainId: DOMAIN_ID,
              regulationPackageId: "regulation-package.reasoning-test.core",
              regulationId: "regulation.reasoning-test.primary",
            }),
          }),
        ]),
        assumptions: Object.freeze([
          Object.freeze({
            assumptionId: "assumption.reasoning-test.primary",
            label: "Primary Assumption",
            description: "Neutral assumption metadata.",
            required: true,
            uncertaintyImpact: "medium",
          }),
        ]),
        confidence: Object.freeze({
          required: true,
          evidenceCoverageRequired: true,
          assumptionCoverageRequired: true,
          explanation: "Confidence metadata is required for downstream consumers.",
        }),
        uncertainty: Object.freeze({
          required: true,
          sources: Object.freeze(["assumption", "evidence"]),
          explanation: "Uncertainty metadata identifies structural uncertainty sources.",
        }),
        trace: Object.freeze({
          required: true,
          traceInputIds: Object.freeze(["input.reasoning-test.primary"]),
          traceOutputIds: Object.freeze(["output.reasoning-test.primary"]),
          traceEvidenceRequirementIds: Object.freeze(["evidence-requirement.reasoning-test.primary"]),
          traceAssumptionIds: Object.freeze(["assumption.reasoning-test.primary"]),
        }),
      }),
    ]),
  });
}

test("creates reasoning registry", () => {
  const registry = createDomainReasoningRegistry();

  assert.equal(registry.contractVersion, "DOM-6:1");
  assert.equal(registry.packages.length, 0);
  assert.equal(registry.frozen, false);
});

test("registers reasoning package", () => {
  const fixtures = fixtureRegistries();
  const result = registerDomainReasoningPackage(
    createDomainReasoningRegistry(),
    reasoningPackage(),
    fixtures.domainRegistry,
    fixtures.vocabularyRegistry,
    fixtures.ontologyRegistry,
    fixtures.kpiRegistry,
    fixtures.regulationRegistry
  );

  assert.equal(result.success, true);
  assert.equal(result.registry.packages.length, 1);
});

test("rejects duplicate reasoning package ids", () => {
  const first = registerDomainReasoningPackage(createDomainReasoningRegistry(), reasoningPackage()).registry;
  const duplicate = registerDomainReasoningPackage(first, reasoningPackage());

  assert.equal(duplicate.success, false);
  assert.equal(duplicate.validation.issues.some((entry) => entry.code === "duplicate_reasoning_package_id"), true);
});

test("rejects duplicate reasoning contract ids", () => {
  const first = registerDomainReasoningPackage(createDomainReasoningRegistry(), reasoningPackage()).registry;
  const duplicate = registerDomainReasoningPackage(first, reasoningPackage("reasoning-package.reasoning-test.secondary"));

  assert.equal(duplicate.success, false);
  assert.equal(duplicate.validation.issues.some((entry) => entry.code === "duplicate_reasoning_contract_id"), true);
});

test("looks up reasoning package", () => {
  const registry = registerDomainReasoningPackage(createDomainReasoningRegistry(), reasoningPackage()).registry;

  assert.equal(getDomainReasoningPackage(registry, "reasoning-package.reasoning-test.core")?.package.name, "Reasoning Test Contract Package");
  assert.equal(hasDomainReasoningPackage(registry, "reasoning-package.reasoning-test.core"), true);
});

test("lists reasoning packages by domain", () => {
  const registry = registerDomainReasoningPackage(createDomainReasoningRegistry(), reasoningPackage()).registry;

  assert.equal(listDomainReasoningPackages(registry).length, 1);
  assert.equal(listReasoningPackagesByDomain(registry, DOMAIN_ID).length, 1);
});

test("unregisters reasoning package", () => {
  const registry = registerDomainReasoningPackage(createDomainReasoningRegistry(), reasoningPackage()).registry;
  const result = unregisterDomainReasoningPackage(registry, "reasoning-package.reasoning-test.core");

  assert.equal(result.success, true);
  assert.equal(result.registry.packages.length, 0);
});

test("freezes reasoning registry and blocks mutation", () => {
  const frozen = freezeDomainReasoningRegistry(createDomainReasoningRegistry());
  const result = registerDomainReasoningPackage(frozen, reasoningPackage());

  assert.equal(frozen.frozen, true);
  assert.equal(result.success, false);
  assert.equal(result.validation.issues.some((entry) => entry.code === "registry_frozen"), true);
});

test("builds reasoning manifest", () => {
  const manifest = buildDomainReasoningManifest();

  assert.equal(manifest.contractVersion, "DOM-6:1");
  assert.equal(manifest.metadataOnly, true);
  assert.equal(manifest.runtimeBehavior, false);
  assert.equal(manifest.reasoningEngine, false);
});

test("validates reasoning package", () => {
  const fixtures = fixtureRegistries();
  const validation = validateDomainReasoningPackage(
    reasoningPackage(),
    fixtures.domainRegistry,
    fixtures.vocabularyRegistry,
    fixtures.ontologyRegistry,
    fixtures.kpiRegistry,
    fixtures.regulationRegistry
  );

  assert.equal(validation.valid, true);
});

test("validates reasoning registry consistency", () => {
  const registry = registerDomainReasoningPackage(createDomainReasoningRegistry(), reasoningPackage()).registry;

  assert.equal(validateDomainReasoningRegistry(registry).valid, true);
});

test("detects invalid trace metadata", () => {
  const base = reasoningPackage();
  const contract = base.contracts[0];
  const invalid = Object.freeze({
    ...base,
    contracts: Object.freeze([
      Object.freeze({
        ...contract,
        trace: Object.freeze({
          ...contract.trace,
          traceInputIds: Object.freeze(["input.missing"]),
        }),
      }),
    ]),
  });

  assert.equal(validateDomainReasoningPackage(invalid).issues.some((entry) => entry.code === "missing_trace_input"), true);
});

test("validates domain compatibility", () => {
  const fixtures = fixtureRegistries();

  assert.equal(validateDomainReasoningPackage(reasoningPackage(), fixtures.domainRegistry).valid, true);
});

test("validates vocabulary compatibility", () => {
  const fixtures = fixtureRegistries();

  assert.equal(validateDomainReasoningPackage(reasoningPackage(), undefined, fixtures.vocabularyRegistry).valid, true);
});

test("validates ontology compatibility", () => {
  const fixtures = fixtureRegistries();

  assert.equal(validateDomainReasoningPackage(reasoningPackage(), undefined, undefined, fixtures.ontologyRegistry).valid, true);
});

test("validates KPI compatibility", () => {
  const fixtures = fixtureRegistries();

  assert.equal(validateDomainReasoningPackage(reasoningPackage(), undefined, undefined, undefined, fixtures.kpiRegistry).valid, true);
});

test("validates regulation compatibility", () => {
  const fixtures = fixtureRegistries();

  assert.equal(validateDomainReasoningPackage(reasoningPackage(), undefined, undefined, undefined, undefined, fixtures.regulationRegistry).valid, true);
});

test("exports public reasoning APIs", () => {
  assert.equal(typeof DomainReasoningFoundation.createDomainReasoningRegistry, "function");
  assert.equal(typeof DomainReasoningFoundation.registerDomainReasoningPackage, "function");
  assert.equal(Object.isFrozen(DomainReasoningFoundation), true);
  assert.equal(DOMAIN_REASONING_PUBLIC_APIS.includes("DomainReasoningFoundation"), true);
});

test("keeps DOM-1 compatibility", () => {
  assert.equal(validateDomainFoundation().valid, true);
});

test("keeps DOM-2 compatibility", () => {
  assert.equal(validateDomainVocabularyFoundation().valid, true);
});

test("keeps DOM-3 compatibility", () => {
  assert.equal(validateDomainOntologyFoundation().valid, true);
});

test("keeps DOM-4 compatibility", () => {
  assert.equal(validateDomainKpiFoundation().valid, true);
});

test("keeps DOM-5 compatibility", () => {
  assert.equal(validateDomainRegulationFoundation().valid, true);
  assert.equal(DomainRegulationCertificationLayer.runDomainRegulationRegression().failed, 0);
});

test("does not expose reasoning execution behavior", () => {
  const exportedApis = DOMAIN_REASONING_PUBLIC_APIS.join(" ");

  assert.equal(exportedApis.includes("execute"), false);
  assert.equal(exportedApis.includes("infer"), false);
  assert.equal(exportedApis.includes("score"), false);
  assert.equal(exportedApis.includes("rank"), false);
});
