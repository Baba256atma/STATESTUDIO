import assert from "node:assert/strict";
import test from "node:test";

import {
  DEFAULT_DOMAIN_STATUS,
  createDomainRegistry,
  registerDomain,
  validateDomainFoundation,
  type DomainPackage,
} from "./domainFoundationIndex.ts";
import {
  createDomainVocabularyRegistry,
  registerDomainVocabulary,
  type DomainVocabularyPackage,
} from "./domainVocabularyIndex.ts";
import { DomainVocabularyPlatformFreeze } from "./domainVocabularyPlatformFreezeIndex.ts";
import {
  createDomainOntologyRegistry,
  registerDomainOntology,
  type DomainOntologyPackage,
} from "./domainOntologyIndex.ts";
import { DomainOntologyPlatformFreeze } from "./domainOntologyPlatformFreezeIndex.ts";
import {
  createDomainKpiRegistry,
  registerDomainKpiPackage,
  type DomainKpiPackage,
} from "./domainKpiIndex.ts";
import { DomainKpiPlatformFreeze } from "./domainKpiPlatformFreezeIndex.ts";
import {
  DEFAULT_DOMAIN_REGULATION_STATUS,
  DomainRegulationFoundation,
  buildDomainRegulationManifest,
  createDomainRegulationRegistry,
  freezeDomainRegulationRegistry,
  getDomainRegulationPackage,
  hasDomainRegulationPackage,
  listDomainRegulationPackages,
  listRegulationPackagesByDomain,
  registerDomainRegulationPackage,
  unregisterDomainRegulationPackage,
  validateDomainRegulationFoundation,
  validateDomainRegulationPackage,
  validateDomainRegulationRegistry,
  type DomainRegulationPackage,
} from "./domainRegulationIndex.ts";

function domainPackage(domainId = "domain.regulation-placeholder"): DomainPackage {
  return Object.freeze({
    contractVersion: "DOM-1",
    manifest: Object.freeze({
      domainId,
      name: "Regulation Placeholder",
      version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
      metadata: Object.freeze({
        displayName: "Regulation Placeholder Domain",
        description: "Neutral placeholder domain metadata for regulation infrastructure.",
        category: "other",
        tags: Object.freeze(["regulation-placeholder"]),
      }),
      capabilities: Object.freeze([
        Object.freeze({
          id: "regulation-metadata",
          name: "Regulation Metadata",
          description: "Supports regulation metadata package registration.",
          enabled: true,
        }),
      ]),
      dependencies: Object.freeze([]),
      status: DEFAULT_DOMAIN_STATUS,
    }),
  });
}

function vocabularyPackage(domainId = "domain.regulation-placeholder"): DomainVocabularyPackage {
  return Object.freeze({
    contractVersion: "DOM-2:1",
    vocabularyId: "vocabulary.regulation-placeholder.core",
    domainId,
    name: "Regulation Placeholder Vocabulary",
    description: "Neutral placeholder vocabulary metadata for regulation compatibility.",
    version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
    status: "active",
    terms: Object.freeze([
      Object.freeze({
        termId: "term.regulation-placeholder.primary",
        label: "Regulation Placeholder Term",
        definition: Object.freeze({
          text: "Neutral placeholder term definition.",
          language: "en",
        }),
        synonyms: Object.freeze([]),
        scope: "domain",
        status: "active",
      }),
    ]),
  });
}

function ontologyPackage(domainId = "domain.regulation-placeholder"): DomainOntologyPackage {
  return Object.freeze({
    contractVersion: "DOM-3:1",
    ontologyId: "ontology.regulation-placeholder.core",
    domainId,
    name: "Regulation Placeholder Ontology",
    description: "Neutral placeholder ontology metadata for regulation compatibility.",
    version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
    scope: "domain",
    status: "active",
    entityTypes: Object.freeze([
      Object.freeze({
        entityTypeId: "entity.regulation-placeholder.source",
        label: "Regulation Placeholder Source",
        description: "Neutral source entity metadata.",
        scope: "domain",
        status: "active",
      }),
      Object.freeze({
        entityTypeId: "entity.regulation-placeholder.target",
        label: "Regulation Placeholder Target",
        description: "Neutral target entity metadata.",
        scope: "domain",
        status: "active",
      }),
    ]),
    relationshipTypes: Object.freeze([
      Object.freeze({
        relationshipTypeId: "relationship.regulation-placeholder.link",
        label: "Regulation Placeholder Link",
        description: "Neutral relationship metadata.",
        sourceEntityTypeId: "entity.regulation-placeholder.source",
        targetEntityTypeId: "entity.regulation-placeholder.target",
        scope: "domain",
        status: "active",
      }),
    ]),
    attributes: Object.freeze([
      Object.freeze({
        attributeId: "attribute.regulation-placeholder.value",
        ownerEntityTypeId: "entity.regulation-placeholder.source",
        label: "Regulation Placeholder Value",
        description: "Neutral attribute metadata.",
        valueType: "string",
        required: false,
        scope: "domain",
        status: "active",
      }),
    ]),
    constraints: Object.freeze([]),
  });
}

function kpiPackage(domainId = "domain.regulation-placeholder"): DomainKpiPackage {
  return Object.freeze({
    contractVersion: "DOM-4:1",
    kpiPackageId: "kpi-package.regulation-placeholder.core",
    domainId,
    name: "Regulation Placeholder KPI Package",
    description: "Neutral placeholder KPI metadata for regulation compatibility.",
    version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
    scope: "domain",
    status: "draft",
    kpis: Object.freeze([
      Object.freeze({
        kpiId: "kpi.regulation-placeholder.primary",
        label: "Regulation Placeholder KPI",
        description: "Neutral placeholder KPI metadata.",
        intent: Object.freeze({
          label: "Placeholder Intent",
          description: "Neutral measurement intent metadata.",
          direction: "neutral",
        }),
        unit: Object.freeze({
          unitType: "count",
          unitLabel: "items",
          precision: 0,
        }),
        aggregation: Object.freeze({
          aggregationType: "sum",
          window: "monthly",
          description: "Neutral aggregation metadata.",
        }),
        scope: "domain",
        status: "draft",
      }),
    ]),
  });
}

function regulationPackage(overrides: Partial<DomainRegulationPackage> = {}): DomainRegulationPackage {
  return Object.freeze({
    contractVersion: "DOM-5:1",
    regulationPackageId: "regulation-package.placeholder.core",
    domainId: "domain.regulation-placeholder",
    name: "Placeholder Regulation Package",
    description: "Neutral placeholder regulation contract metadata.",
    version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
    scope: "domain",
    jurisdictionScope: "unspecified",
    status: DEFAULT_DOMAIN_REGULATION_STATUS,
    regulations: Object.freeze([
      Object.freeze({
        regulationId: "regulation.placeholder.primary",
        label: "Placeholder Regulation",
        description: "Neutral placeholder regulation metadata.",
        reference: Object.freeze({
          domainId: "domain.regulation-placeholder",
          vocabularyId: "vocabulary.regulation-placeholder.core",
          termId: "term.regulation-placeholder.primary",
          ontologyId: "ontology.regulation-placeholder.core",
          entityTypeId: "entity.regulation-placeholder.source",
          relationshipTypeId: "relationship.regulation-placeholder.link",
          attributeId: "attribute.regulation-placeholder.value",
          kpiPackageId: "kpi-package.regulation-placeholder.core",
          kpiId: "kpi.regulation-placeholder.primary",
        }),
        scope: "domain",
        jurisdictionScope: "unspecified",
        status: "draft",
      }),
    ]),
    obligations: Object.freeze([
      Object.freeze({
        obligationId: "obligation.placeholder.primary",
        regulationId: "regulation.placeholder.primary",
        label: "Placeholder Obligation",
        description: "Neutral placeholder obligation metadata.",
        controlIds: Object.freeze(["control.placeholder.primary"]),
        scope: "domain",
        status: "draft",
      }),
    ]),
    controls: Object.freeze([
      Object.freeze({
        controlId: "control.placeholder.primary",
        label: "Placeholder Control",
        description: "Neutral placeholder control metadata.",
        evidenceIds: Object.freeze(["evidence.placeholder.primary"]),
        scope: "domain",
        status: "draft",
      }),
    ]),
    evidence: Object.freeze([
      Object.freeze({
        evidenceId: "evidence.placeholder.primary",
        label: "Placeholder Evidence",
        description: "Neutral placeholder evidence metadata.",
        sourceDescription: "Neutral placeholder source metadata.",
        scope: "domain",
        status: "draft",
      }),
    ]),
    ...overrides,
  });
}

function registeredDomainRegistry(domainId = "domain.regulation-placeholder") {
  return registerDomain(createDomainRegistry(), domainPackage(domainId)).registry;
}

function registeredVocabularyRegistry(domainId = "domain.regulation-placeholder") {
  return registerDomainVocabulary(
    createDomainVocabularyRegistry(),
    vocabularyPackage(domainId),
    registeredDomainRegistry(domainId)
  ).registry;
}

function registeredOntologyRegistry(domainId = "domain.regulation-placeholder") {
  return registerDomainOntology(
    createDomainOntologyRegistry(),
    ontologyPackage(domainId),
    registeredDomainRegistry(domainId),
    registeredVocabularyRegistry(domainId)
  ).registry;
}

function registeredKpiRegistry(domainId = "domain.regulation-placeholder") {
  return registerDomainKpiPackage(
    createDomainKpiRegistry(),
    kpiPackage(domainId),
    registeredDomainRegistry(domainId)
  ).registry;
}

test("creates regulation registry", () => {
  const registry = createDomainRegulationRegistry();

  assert.equal(registry.contractVersion, "DOM-5:1");
  assert.equal(registry.frozen, false);
  assert.equal(registry.packages.length, 0);
  assert.equal(Object.isFrozen(registry), true);
});

test("registers regulation package", () => {
  const result = registerDomainRegulationPackage(
    createDomainRegulationRegistry(),
    regulationPackage(),
    registeredDomainRegistry(),
    registeredVocabularyRegistry(),
    registeredOntologyRegistry(),
    registeredKpiRegistry()
  );

  assert.equal(result.success, true);
  assert.equal(result.regulationPackage?.package.regulationPackageId, "regulation-package.placeholder.core");
  assert.equal(result.registry.packages.length, 1);
});

test("rejects duplicate package ids", () => {
  const first = registerDomainRegulationPackage(createDomainRegulationRegistry(), regulationPackage());
  const duplicate = registerDomainRegulationPackage(first.registry, regulationPackage({ name: "Duplicate Package" }));

  assert.equal(duplicate.success, false);
  assert.equal(duplicate.validation.issues.some((entry) => entry.code === "duplicate_regulation_package_id"), true);
});

test("rejects duplicate regulation ids", () => {
  const validation = validateDomainRegulationPackage(
    regulationPackage({
      regulations: Object.freeze([
        regulationPackage().regulations[0],
        Object.freeze({ ...regulationPackage().regulations[0], label: "Duplicate Regulation" }),
      ]),
    })
  );

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((entry) => entry.code === "duplicate_regulation_id"), true);
});

test("rejects duplicate obligation ids", () => {
  const validation = validateDomainRegulationPackage(
    regulationPackage({
      obligations: Object.freeze([
        regulationPackage().obligations[0],
        Object.freeze({ ...regulationPackage().obligations[0], label: "Duplicate Obligation" }),
      ]),
    })
  );

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((entry) => entry.code === "duplicate_obligation_id"), true);
});

test("rejects duplicate control ids", () => {
  const validation = validateDomainRegulationPackage(
    regulationPackage({
      controls: Object.freeze([
        regulationPackage().controls[0],
        Object.freeze({ ...regulationPackage().controls[0], label: "Duplicate Control" }),
      ]),
    })
  );

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((entry) => entry.code === "duplicate_control_id"), true);
});

test("rejects duplicate evidence ids", () => {
  const validation = validateDomainRegulationPackage(
    regulationPackage({
      evidence: Object.freeze([
        regulationPackage().evidence[0],
        Object.freeze({ ...regulationPackage().evidence[0], label: "Duplicate Evidence" }),
      ]),
    })
  );

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((entry) => entry.code === "duplicate_evidence_id"), true);
});

test("looks up and lists regulation packages", () => {
  const registered = registerDomainRegulationPackage(createDomainRegulationRegistry(), regulationPackage());

  assert.equal(getDomainRegulationPackage(registered.registry, "regulation-package.placeholder.core")?.package.name, "Placeholder Regulation Package");
  assert.equal(listDomainRegulationPackages(registered.registry).length, 1);
  assert.equal(hasDomainRegulationPackage(registered.registry, "regulation-package.placeholder.core"), true);
});

test("lists regulation packages by domain", () => {
  const registered = registerDomainRegulationPackage(createDomainRegulationRegistry(), regulationPackage());
  const byDomain = listRegulationPackagesByDomain(registered.registry, "domain.regulation-placeholder");

  assert.equal(byDomain.length, 1);
  assert.equal(byDomain[0].package.domainId, "domain.regulation-placeholder");
});

test("unregisters regulation package", () => {
  const registered = registerDomainRegulationPackage(createDomainRegulationRegistry(), regulationPackage());
  const removed = unregisterDomainRegulationPackage(registered.registry, "regulation-package.placeholder.core");

  assert.equal(removed.success, true);
  assert.equal(removed.registry.packages.length, 0);
});

test("freezes regulation registry and blocks mutation", () => {
  const registered = registerDomainRegulationPackage(createDomainRegulationRegistry(), regulationPackage());
  const frozen = freezeDomainRegulationRegistry(registered.registry);
  const blocked = registerDomainRegulationPackage(
    frozen,
    regulationPackage({ regulationPackageId: "regulation-package.placeholder.secondary", name: "Secondary Package" })
  );

  assert.equal(frozen.frozen, true);
  assert.equal(blocked.success, false);
  assert.equal(blocked.validation.issues.some((entry) => entry.code === "registry_frozen"), true);
});

test("builds regulation manifest", () => {
  const manifest = buildDomainRegulationManifest();

  assert.equal(manifest.contractVersion, "DOM-5:1");
  assert.equal(manifest.metadataOnly, true);
  assert.equal(manifest.runtimeBehavior, false);
  assert.equal(manifest.readyFor, "DOM-5:2 Domain Regulation Query Layer");
});

test("validates regulation registry", () => {
  const registered = registerDomainRegulationPackage(createDomainRegulationRegistry(), regulationPackage());

  assert.equal(validateDomainRegulationFoundation().valid, true);
  assert.equal(validateDomainRegulationRegistry(registered.registry).valid, true);
});

test("validates domain reference compatibility", () => {
  const validation = validateDomainRegulationPackage(regulationPackage(), registeredDomainRegistry());
  const missing = validateDomainRegulationPackage(regulationPackage(), registeredDomainRegistry("domain.other"));

  assert.equal(validation.valid, true);
  assert.equal(missing.issues.some((entry) => entry.code === "missing_domain_reference"), true);
});

test("validates optional vocabulary compatibility", () => {
  const valid = validateDomainRegulationPackage(regulationPackage(), undefined, registeredVocabularyRegistry());
  const missing = validateDomainRegulationPackage(regulationPackage(), undefined, createDomainVocabularyRegistry());

  assert.equal(valid.valid, true);
  assert.equal(missing.issues.some((entry) => entry.code === "missing_vocabulary_reference"), true);
});

test("validates optional ontology compatibility", () => {
  const valid = validateDomainRegulationPackage(regulationPackage(), undefined, undefined, registeredOntologyRegistry());
  const missing = validateDomainRegulationPackage(regulationPackage(), undefined, undefined, createDomainOntologyRegistry());

  assert.equal(valid.valid, true);
  assert.equal(missing.issues.some((entry) => entry.code === "missing_ontology_reference"), true);
});

test("validates optional KPI compatibility", () => {
  const valid = validateDomainRegulationPackage(regulationPackage(), undefined, undefined, undefined, registeredKpiRegistry());
  const missing = validateDomainRegulationPackage(regulationPackage(), undefined, undefined, undefined, createDomainKpiRegistry());

  assert.equal(valid.valid, true);
  assert.equal(missing.issues.some((entry) => entry.code === "missing_kpi_reference"), true);
});

test("validates obligation-control integrity", () => {
  const validation = validateDomainRegulationPackage(
    regulationPackage({
      obligations: Object.freeze([
        Object.freeze({
          ...regulationPackage().obligations[0],
          controlIds: Object.freeze(["control.placeholder.missing"]),
        }),
      ]),
    })
  );

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((entry) => entry.code === "missing_obligation_control_reference"), true);
});

test("validates control-evidence integrity", () => {
  const validation = validateDomainRegulationPackage(
    regulationPackage({
      controls: Object.freeze([
        Object.freeze({
          ...regulationPackage().controls[0],
          evidenceIds: Object.freeze(["evidence.placeholder.missing"]),
        }),
      ]),
    })
  );

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((entry) => entry.code === "missing_control_evidence_reference"), true);
});

test("exports public regulation APIs", () => {
  assert.equal(typeof DomainRegulationFoundation.createDomainRegulationRegistry, "function");
  assert.equal(typeof DomainRegulationFoundation.registerDomainRegulationPackage, "function");
  assert.equal(typeof DomainRegulationFoundation.buildDomainRegulationManifest, "function");
  assert.equal(Object.isFrozen(DomainRegulationFoundation), true);
});

test("keeps DOM-1 compatibility", () => {
  assert.equal(validateDomainFoundation().valid, true);
});

test("keeps DOM-2 compatibility", () => {
  assert.equal(DomainVocabularyPlatformFreeze.runDomainVocabularyPlatformFreeze().status, "PASS");
});

test("keeps DOM-3 compatibility", () => {
  assert.equal(DomainOntologyPlatformFreeze.runDomainOntologyPlatformFreeze().status, "PASS");
});

test("keeps DOM-4 compatibility", () => {
  assert.equal(DomainKpiPlatformFreeze.runDomainKpiPlatformFreeze().status, "PASS");
});
