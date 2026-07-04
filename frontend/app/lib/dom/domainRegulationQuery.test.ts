import assert from "node:assert/strict";
import test from "node:test";

import { validateDomainFoundation } from "./domainFoundationIndex.ts";
import { DomainVocabularyPlatformFreeze } from "./domainVocabularyPlatformFreezeIndex.ts";
import { DomainOntologyPlatformFreeze } from "./domainOntologyPlatformFreezeIndex.ts";
import { DomainKpiPlatformFreeze } from "./domainKpiPlatformFreezeIndex.ts";
import {
  createDomainRegulationRegistry,
  registerDomainRegulationPackage,
  validateDomainRegulationFoundation,
  type DomainRegulationPackage,
  type DomainRegulationRegistry,
} from "./domainRegulationIndex.ts";
import {
  DomainRegulationQueryLayer,
  buildDomainRegulationReferenceLookup,
  buildDomainRegulationSnapshot,
  compareDomainRegulationSnapshots,
  diffDomainRegulationSnapshots,
  findControlsByObligation,
  findDomainControl,
  findDomainEvidence,
  findDomainObligation,
  findDomainRegulation,
  findEvidenceByControl,
  findObligationsByRegulation,
  findRegulationPackageContainingRegulation,
  findRegulationPackagesByDomain,
  findRegulationPackagesByJurisdictionScope,
  findRegulationPackagesByScope,
  findRegulationPackagesByStatus,
  findRegulationsByDomain,
  findRegulationsReferencingKpi,
  findRegulationsReferencingOntologyAttribute,
  findRegulationsReferencingOntologyEntity,
  findRegulationsReferencingVocabularyTerm,
  queryDomainRegulationPackages,
  sortDomainRegulationPackages,
  validateDomainRegulationSnapshot,
} from "./domainRegulationQueryIndex.ts";

function regulationPackage(options: {
  packageId?: string;
  domainId?: string;
  name?: string;
  description?: string;
  scope?: DomainRegulationPackage["scope"];
  jurisdictionScope?: DomainRegulationPackage["jurisdictionScope"];
  status?: DomainRegulationPackage["status"];
  regulationId?: string;
  obligationId?: string;
  controlId?: string;
  evidenceId?: string;
} = {}): DomainRegulationPackage {
  const packageId = options.packageId ?? "regulation-package.query.primary";
  const domainId = options.domainId ?? "domain.regulation-query";
  const regulationId = options.regulationId ?? "regulation.query.primary";
  const obligationId = options.obligationId ?? "obligation.query.primary";
  const controlId = options.controlId ?? "control.query.primary";
  const evidenceId = options.evidenceId ?? "evidence.query.primary";

  return Object.freeze({
    contractVersion: "DOM-5:1",
    regulationPackageId: packageId,
    domainId,
    name: options.name ?? "Query Regulation Package",
    description: options.description ?? "Neutral placeholder regulation metadata for query tests.",
    version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
    scope: options.scope ?? "domain",
    jurisdictionScope: options.jurisdictionScope ?? "unspecified",
    status: options.status ?? "draft",
    regulations: Object.freeze([
      Object.freeze({
        regulationId,
        label: "Query Regulation",
        description: "Neutral placeholder regulation metadata.",
        reference: Object.freeze({
          domainId,
          vocabularyId: "vocabulary.regulation-query.core",
          termId: "term.regulation-query.primary",
          ontologyId: "ontology.regulation-query.core",
          entityTypeId: "entity.regulation-query.source",
          relationshipTypeId: "relationship.regulation-query.link",
          attributeId: "attribute.regulation-query.value",
          kpiPackageId: "kpi-package.regulation-query.core",
          kpiId: "kpi.regulation-query.primary",
        }),
        scope: options.scope ?? "domain",
        jurisdictionScope: options.jurisdictionScope ?? "unspecified",
        status: options.status ?? "draft",
      }),
    ]),
    obligations: Object.freeze([
      Object.freeze({
        obligationId,
        regulationId,
        label: "Query Obligation",
        description: "Neutral placeholder obligation metadata.",
        controlIds: Object.freeze([controlId]),
        scope: options.scope ?? "domain",
        status: options.status ?? "draft",
      }),
    ]),
    controls: Object.freeze([
      Object.freeze({
        controlId,
        label: "Query Control",
        description: "Neutral placeholder control metadata.",
        evidenceIds: Object.freeze([evidenceId]),
        scope: options.scope ?? "domain",
        status: options.status ?? "draft",
      }),
    ]),
    evidence: Object.freeze([
      Object.freeze({
        evidenceId,
        label: "Query Evidence",
        description: "Neutral placeholder evidence metadata.",
        sourceDescription: "Neutral placeholder source metadata.",
        scope: options.scope ?? "domain",
        status: options.status ?? "draft",
      }),
    ]),
  });
}

function queryRegistry(): DomainRegulationRegistry {
  const first = registerDomainRegulationPackage(createDomainRegulationRegistry(), regulationPackage());
  return registerDomainRegulationPackage(
    first.registry,
    regulationPackage({
      packageId: "regulation-package.query.secondary",
      domainId: "domain.regulation-query.secondary",
      name: "Secondary Query Regulation Package",
      scope: "module",
      jurisdictionScope: "global",
      status: "active",
      regulationId: "regulation.query.secondary",
      obligationId: "obligation.query.secondary",
      controlId: "control.query.secondary",
      evidenceId: "evidence.query.secondary",
    })
  ).registry;
}

test("queries regulation packages by domain", () => {
  const results = queryDomainRegulationPackages(queryRegistry(), {
    filter: Object.freeze({ domainId: "domain.regulation-query" }),
  });

  assert.equal(results.length, 1);
  assert.equal(results[0].package.regulationPackageId, "regulation-package.query.primary");
});

test("queries regulation packages by scope", () => {
  assert.equal(findRegulationPackagesByScope(queryRegistry(), "module").length, 1);
});

test("queries regulation packages by status", () => {
  assert.equal(findRegulationPackagesByStatus(queryRegistry(), "active").length, 1);
});

test("queries regulation packages by jurisdiction scope", () => {
  assert.equal(findRegulationPackagesByJurisdictionScope(queryRegistry(), "global").length, 1);
});

test("sorts by regulation package id", () => {
  const sorted = sortDomainRegulationPackages(queryRegistry().packages, "regulationPackageId", "desc");

  assert.deepEqual(sorted.map((entry) => entry.package.regulationPackageId), [
    "regulation-package.query.secondary",
    "regulation-package.query.primary",
  ]);
});

test("sorts by domain id", () => {
  const sorted = sortDomainRegulationPackages(queryRegistry().packages, "domainId");

  assert.equal(sorted[0].package.domainId, "domain.regulation-query");
});

test("sorts by registration order", () => {
  const sorted = sortDomainRegulationPackages(queryRegistry().packages, "registrationOrder");

  assert.deepEqual(sorted.map((entry) => entry.registrationOrder), [0, 1]);
});

test("finds package containing regulation", () => {
  const found = findRegulationPackageContainingRegulation(queryRegistry(), "regulation.query.secondary");

  assert.equal(found?.package.regulationPackageId, "regulation-package.query.secondary");
});

test("finds regulation by id", () => {
  const found = findDomainRegulation(queryRegistry(), "regulation.query.primary");

  assert.equal(found.found, true);
  assert.equal(found.regulation?.label, "Query Regulation");
});

test("finds obligation by id", () => {
  assert.equal(findDomainObligation(queryRegistry(), "obligation.query.primary").found, true);
});

test("finds control by id", () => {
  assert.equal(findDomainControl(queryRegistry(), "control.query.primary").found, true);
});

test("finds evidence by id", () => {
  assert.equal(findDomainEvidence(queryRegistry(), "evidence.query.primary").found, true);
});

test("finds regulations by domain", () => {
  assert.equal(findRegulationsByDomain(queryRegistry(), "domain.regulation-query").length, 1);
});

test("finds obligations by regulation", () => {
  assert.equal(findObligationsByRegulation(queryRegistry(), "regulation.query.primary").length, 1);
});

test("finds controls by obligation", () => {
  assert.equal(findControlsByObligation(queryRegistry(), "obligation.query.primary").length, 1);
});

test("finds evidence by control", () => {
  assert.equal(findEvidenceByControl(queryRegistry(), "control.query.primary").length, 1);
});

test("inspects references by vocabulary term", () => {
  assert.equal(findRegulationsReferencingVocabularyTerm(queryRegistry(), "term.regulation-query.primary").length, 2);
});

test("inspects references by ontology entity", () => {
  assert.equal(findRegulationsReferencingOntologyEntity(queryRegistry(), "entity.regulation-query.source").length, 2);
});

test("inspects references by ontology attribute", () => {
  assert.equal(findRegulationsReferencingOntologyAttribute(queryRegistry(), "attribute.regulation-query.value").length, 2);
});

test("inspects references by KPI", () => {
  assert.equal(findRegulationsReferencingKpi(queryRegistry(), "kpi.regulation-query.primary").length, 2);
});

test("builds regulation reference lookup", () => {
  const lookup = buildDomainRegulationReferenceLookup(queryRegistry(), "kpi.regulation-query.primary");

  assert.equal(lookup.referenceId, "kpi.regulation-query.primary");
  assert.equal(lookup.matches.length, 2);
});

test("builds regulation snapshot", () => {
  const snapshot = buildDomainRegulationSnapshot(queryRegistry());

  assert.equal(snapshot.packageCount, 2);
  assert.equal(snapshot.entries[0].regulationIds.length, 1);
});

test("validates regulation snapshot", () => {
  assert.equal(validateDomainRegulationSnapshot(buildDomainRegulationSnapshot(queryRegistry())).valid, true);
});

test("compares regulation snapshots", () => {
  const first = buildDomainRegulationSnapshot(queryRegistry());
  const second = buildDomainRegulationSnapshot(queryRegistry());

  assert.equal(compareDomainRegulationSnapshots(first, second), true);
});

test("diffs added regulation packages", () => {
  const left = buildDomainRegulationSnapshot(createDomainRegulationRegistry());
  const right = buildDomainRegulationSnapshot(queryRegistry());
  const diff = diffDomainRegulationSnapshots(left, right);

  assert.equal(diff.equal, false);
  assert.equal(diff.entries.filter((entry) => entry.type === "added").length, 2);
});

test("diffs removed regulation packages", () => {
  const left = buildDomainRegulationSnapshot(queryRegistry());
  const right = buildDomainRegulationSnapshot(createDomainRegulationRegistry());
  const diff = diffDomainRegulationSnapshots(left, right);

  assert.equal(diff.entries.filter((entry) => entry.type === "removed").length, 2);
});

test("diffs modified regulation packages", () => {
  const leftRegistry = registerDomainRegulationPackage(createDomainRegulationRegistry(), regulationPackage()).registry;
  const rightRegistry = registerDomainRegulationPackage(
    createDomainRegulationRegistry(),
    regulationPackage({ description: "Modified neutral placeholder regulation metadata." })
  ).registry;
  const diff = diffDomainRegulationSnapshots(
    buildDomainRegulationSnapshot(leftRegistry),
    buildDomainRegulationSnapshot(rightRegistry)
  );

  assert.equal(diff.entries.some((entry) => entry.type === "modified"), true);
});

test("exports public regulation query APIs", () => {
  assert.equal(typeof DomainRegulationQueryLayer.queryDomainRegulationPackages, "function");
  assert.equal(typeof DomainRegulationQueryLayer.findDomainRegulation, "function");
  assert.equal(typeof DomainRegulationQueryLayer.buildDomainRegulationSnapshot, "function");
  assert.equal(Object.isFrozen(DomainRegulationQueryLayer), true);
});

test("keeps DOM-5:1 regression compatibility", () => {
  const registry = createDomainRegulationRegistry();

  assert.equal(validateDomainRegulationFoundation().valid, true);
  assert.equal(registry.contractVersion, "DOM-5:1");
});

test("keeps DOM-4 compatibility", () => {
  assert.equal(DomainKpiPlatformFreeze.runDomainKpiPlatformFreeze().status, "PASS");
});

test("keeps DOM-3 compatibility", () => {
  assert.equal(DomainOntologyPlatformFreeze.runDomainOntologyPlatformFreeze().status, "PASS");
});

test("keeps DOM-2 compatibility", () => {
  assert.equal(DomainVocabularyPlatformFreeze.runDomainVocabularyPlatformFreeze().status, "PASS");
});

test("keeps DOM-1 compatibility", () => {
  assert.equal(validateDomainFoundation().valid, true);
});

test("finds regulation packages by domain helper", () => {
  assert.equal(findRegulationPackagesByDomain(queryRegistry(), "domain.regulation-query").length, 1);
});
