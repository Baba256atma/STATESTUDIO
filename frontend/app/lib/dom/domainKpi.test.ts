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
  validateDomainVocabularyFoundation,
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
  DEFAULT_DOMAIN_KPI_STATUS,
  DomainKpiFoundation,
  buildDomainKpiManifest,
  createDomainKpiRegistry,
  freezeDomainKpiRegistry,
  getDomainKpiPackage,
  hasDomainKpiPackage,
  listDomainKpiPackages,
  listKpiPackagesByDomain,
  registerDomainKpiPackage,
  unregisterDomainKpiPackage,
  validateDomainKpiFoundation,
  validateDomainKpiPackage,
  validateDomainKpiRegistry,
  type DomainKpiPackage,
} from "./domainKpiIndex.ts";

function domainPackage(domainId = "domain.kpi-placeholder"): DomainPackage {
  return Object.freeze({
    contractVersion: "DOM-1",
    manifest: Object.freeze({
      domainId,
      name: "KPI Placeholder",
      version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
      metadata: Object.freeze({
        displayName: "KPI Placeholder Domain",
        description: "Neutral placeholder domain metadata for KPI infrastructure.",
        category: "other",
        tags: Object.freeze(["kpi-placeholder"]),
      }),
      capabilities: Object.freeze([
        Object.freeze({
          id: "kpi-metadata",
          name: "KPI Metadata",
          description: "Supports KPI contract metadata package registration.",
          enabled: true,
        }),
      ]),
      dependencies: Object.freeze([]),
      status: DEFAULT_DOMAIN_STATUS,
    }),
  });
}

function vocabularyPackage(domainId = "domain.kpi-placeholder"): DomainVocabularyPackage {
  return Object.freeze({
    contractVersion: "DOM-2:1",
    vocabularyId: "vocabulary.kpi-placeholder.core",
    domainId,
    name: "KPI Placeholder Vocabulary",
    description: "Neutral placeholder vocabulary metadata for KPI compatibility.",
    version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
    status: "active",
    terms: Object.freeze([]),
  });
}

function ontologyPackage(domainId = "domain.kpi-placeholder"): DomainOntologyPackage {
  return Object.freeze({
    contractVersion: "DOM-3:1",
    ontologyId: "ontology.kpi-placeholder.core",
    domainId,
    name: "KPI Placeholder Ontology",
    description: "Neutral placeholder ontology metadata for KPI compatibility.",
    version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
    scope: "domain",
    status: "active",
    entityTypes: Object.freeze([
      Object.freeze({
        entityTypeId: "entity.kpi-placeholder.source",
        label: "KPI Placeholder Source",
        description: "Neutral source entity metadata.",
        scope: "domain",
        status: "active",
      }),
    ]),
    relationshipTypes: Object.freeze([]),
    attributes: Object.freeze([
      Object.freeze({
        attributeId: "attribute.kpi-placeholder.value",
        ownerEntityTypeId: "entity.kpi-placeholder.source",
        label: "KPI Placeholder Value",
        description: "Neutral attribute metadata.",
        valueType: "number",
        required: false,
        scope: "domain",
        status: "active",
      }),
    ]),
    constraints: Object.freeze([]),
  });
}

function kpiPackage(overrides: Partial<DomainKpiPackage> = {}): DomainKpiPackage {
  return Object.freeze({
    contractVersion: "DOM-4:1",
    kpiPackageId: "kpi-package.placeholder.core",
    domainId: "domain.kpi-placeholder",
    name: "Placeholder KPI Package",
    description: "Neutral placeholder KPI contract metadata.",
    version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
    scope: "domain",
    status: DEFAULT_DOMAIN_KPI_STATUS,
    kpis: Object.freeze([
      Object.freeze({
        kpiId: "kpi.placeholder.primary",
        label: "Placeholder KPI",
        description: "Neutral placeholder KPI metadata.",
        intent: Object.freeze({
          label: "Placeholder Measurement Intent",
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
        reference: Object.freeze({
          vocabularyId: "vocabulary.kpi-placeholder.core",
          ontologyId: "ontology.kpi-placeholder.core",
          entityTypeId: "entity.kpi-placeholder.source",
          attributeId: "attribute.kpi-placeholder.value",
        }),
        scope: "domain",
        status: "draft",
      }),
    ]),
    ...overrides,
  });
}

function registeredDomainRegistry(domainId = "domain.kpi-placeholder") {
  return registerDomain(createDomainRegistry(), domainPackage(domainId)).registry;
}

function registeredVocabularyRegistry(domainId = "domain.kpi-placeholder") {
  const domainRegistry = registeredDomainRegistry(domainId);
  return registerDomainVocabulary(createDomainVocabularyRegistry(), vocabularyPackage(domainId), domainRegistry).registry;
}

function registeredOntologyRegistry(domainId = "domain.kpi-placeholder") {
  const domainRegistry = registeredDomainRegistry(domainId);
  return registerDomainOntology(createDomainOntologyRegistry(), ontologyPackage(domainId), domainRegistry).registry;
}

test("creates KPI registry", () => {
  const registry = createDomainKpiRegistry();

  assert.equal(registry.contractVersion, "DOM-4:1");
  assert.equal(registry.frozen, false);
  assert.equal(registry.packages.length, 0);
  assert.equal(Object.isFrozen(registry), true);
});

test("registers KPI package", () => {
  const result = registerDomainKpiPackage(
    createDomainKpiRegistry(),
    kpiPackage(),
    registeredDomainRegistry(),
    registeredVocabularyRegistry(),
    registeredOntologyRegistry()
  );

  assert.equal(result.success, true);
  assert.equal(result.kpiPackage?.package.kpiPackageId, "kpi-package.placeholder.core");
  assert.equal(result.registry.packages.length, 1);
});

test("rejects duplicate KPI package ids", () => {
  const first = registerDomainKpiPackage(createDomainKpiRegistry(), kpiPackage());
  const duplicate = registerDomainKpiPackage(first.registry, kpiPackage({ name: "Duplicate Package" }));

  assert.equal(duplicate.success, false);
  assert.equal(duplicate.validation.issues.some((issue) => issue.code === "duplicate_kpi_package_id"), true);
});

test("rejects duplicate KPI ids", () => {
  const validation = validateDomainKpiPackage(
    kpiPackage({
      kpis: Object.freeze([
        kpiPackage().kpis[0],
        Object.freeze({
          ...kpiPackage().kpis[0],
          label: "Duplicate Placeholder KPI",
        }),
      ]),
    })
  );

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((issue) => issue.code === "duplicate_kpi_id"), true);
});

test("looks up and lists KPI packages", () => {
  const registered = registerDomainKpiPackage(createDomainKpiRegistry(), kpiPackage());

  assert.equal(getDomainKpiPackage(registered.registry, "kpi-package.placeholder.core")?.package.name, "Placeholder KPI Package");
  assert.equal(listDomainKpiPackages(registered.registry).length, 1);
  assert.equal(hasDomainKpiPackage(registered.registry, "kpi-package.placeholder.core"), true);
});

test("lists KPI packages by domain", () => {
  const registered = registerDomainKpiPackage(createDomainKpiRegistry(), kpiPackage());
  const byDomain = listKpiPackagesByDomain(registered.registry, "domain.kpi-placeholder");

  assert.equal(byDomain.length, 1);
  assert.equal(byDomain[0].package.domainId, "domain.kpi-placeholder");
});

test("unregisters KPI package", () => {
  const registered = registerDomainKpiPackage(createDomainKpiRegistry(), kpiPackage());
  const removed = unregisterDomainKpiPackage(registered.registry, "kpi-package.placeholder.core");

  assert.equal(removed.success, true);
  assert.equal(removed.registry.packages.length, 0);
});

test("freezes KPI registry and blocks mutation", () => {
  const registered = registerDomainKpiPackage(createDomainKpiRegistry(), kpiPackage());
  const frozen = freezeDomainKpiRegistry(registered.registry);
  const blocked = registerDomainKpiPackage(
    frozen,
    kpiPackage({ kpiPackageId: "kpi-package.placeholder.secondary", name: "Secondary KPI Package" })
  );

  assert.equal(frozen.frozen, true);
  assert.equal(blocked.success, false);
  assert.equal(blocked.validation.issues.some((issue) => issue.code === "registry_frozen"), true);
});

test("builds KPI manifest", () => {
  const manifest = buildDomainKpiManifest();

  assert.equal(manifest.contractVersion, "DOM-4:1");
  assert.equal(manifest.version, "DOM-4:1");
  assert.equal(manifest.metadataOnly, true);
  assert.equal(manifest.runtimeBehavior, false);
  assert.equal(manifest.readyFor, "DOM-4:2 Domain KPI Query Layer");
});

test("validates KPI registry", () => {
  const registered = registerDomainKpiPackage(createDomainKpiRegistry(), kpiPackage());

  assert.equal(validateDomainKpiFoundation().valid, true);
  assert.equal(validateDomainKpiRegistry(registered.registry).valid, true);
});

test("validates unit, aggregation, and direction metadata", () => {
  const validation = validateDomainKpiPackage(
    kpiPackage({
      kpis: Object.freeze([
        Object.freeze({
          ...kpiPackage().kpis[0],
          intent: Object.freeze({ ...kpiPackage().kpis[0].intent, direction: "unsupported" as never }),
          unit: Object.freeze({ ...kpiPackage().kpis[0].unit, precision: -1 }),
          aggregation: Object.freeze({ ...kpiPackage().kpis[0].aggregation, aggregationType: "unsupported" as never }),
        }),
      ]),
    })
  );

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((issue) => issue.code === "invalid_kpi_direction"), true);
  assert.equal(validation.issues.some((issue) => issue.code === "invalid_unit_precision"), true);
  assert.equal(validation.issues.some((issue) => issue.code === "invalid_aggregation_type"), true);
});

test("validates domain reference compatibility", () => {
  const validation = validateDomainKpiPackage(kpiPackage(), createDomainRegistry());

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((issue) => issue.code === "missing_domain_reference"), true);
});

test("validates optional vocabulary compatibility", () => {
  const validation = validateDomainKpiPackage(
    kpiPackage({
      kpis: Object.freeze([
        Object.freeze({
          ...kpiPackage().kpis[0],
          reference: Object.freeze({ vocabularyId: "vocabulary.missing" }),
        }),
      ]),
    }),
    registeredDomainRegistry(),
    registeredVocabularyRegistry()
  );

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((issue) => issue.code === "missing_vocabulary_reference"), true);
});

test("validates optional ontology compatibility", () => {
  const validation = validateDomainKpiPackage(
    kpiPackage({
      kpis: Object.freeze([
        Object.freeze({
          ...kpiPackage().kpis[0],
          reference: Object.freeze({ ontologyId: "ontology.missing" }),
        }),
      ]),
    }),
    registeredDomainRegistry(),
    undefined,
    registeredOntologyRegistry()
  );

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((issue) => issue.code === "missing_ontology_reference"), true);
});

test("exports public KPI APIs", () => {
  assert.equal(typeof DomainKpiFoundation.createDomainKpiRegistry, "function");
  assert.equal(typeof DomainKpiFoundation.registerDomainKpiPackage, "function");
  assert.equal(typeof DomainKpiFoundation.buildDomainKpiManifest, "function");
  assert.equal(typeof DomainKpiFoundation.validateDomainKpiRegistry, "function");
  assert.equal(Object.isFrozen(DomainKpiFoundation), true);
});

test("keeps DOM-1 compatibility", () => {
  assert.equal(validateDomainFoundation().valid, true);
});

test("keeps DOM-2 compatibility", () => {
  assert.equal(validateDomainVocabularyFoundation().valid, true);
  assert.equal(DomainVocabularyPlatformFreeze.runDomainVocabularyPlatformFreeze().status, "PASS");
});

test("keeps DOM-3 compatibility", () => {
  assert.equal(DomainOntologyPlatformFreeze.runDomainOntologyPlatformFreeze().status, "PASS");
});
