import assert from "node:assert/strict";
import test from "node:test";

import { validateDomainFoundation } from "./domainFoundationIndex.ts";
import { DomainVocabularyPlatformFreeze } from "./domainVocabularyPlatformFreezeIndex.ts";
import { DomainOntologyPlatformFreeze } from "./domainOntologyPlatformFreezeIndex.ts";
import {
  createDomainKpiRegistry,
  registerDomainKpiPackage,
  validateDomainKpiFoundation,
  type DomainKpiPackage,
} from "./domainKpiIndex.ts";
import {
  DomainKpiQueryLayer,
  buildDomainKpiReferenceLookup,
  buildDomainKpiSnapshot,
  compareDomainKpiSnapshots,
  diffDomainKpiSnapshots,
  findDomainKpi,
  findKpiPackageContainingKpi,
  findKpiPackagesByDomain,
  findKpiPackagesByScope,
  findKpiPackagesByStatus,
  findKpisByAggregationType,
  findKpisByDirection,
  findKpisByDomain,
  findKpisByScope,
  findKpisByStatus,
  findKpisByUnitType,
  findKpisReferencingOntologyAttribute,
  findKpisReferencingOntologyEntity,
  findKpisReferencingOntologyRelationship,
  findKpisReferencingVocabularyTerm,
  queryDomainKpiPackages,
  sortDomainKpiPackages,
  validateDomainKpiSnapshot,
} from "./domainKpiQueryIndex.ts";

function kpiPackage(
  kpiPackageId: string,
  domainId: string,
  label: string,
  overrides: Partial<DomainKpiPackage> = {}
): DomainKpiPackage {
  const token = label.toLowerCase();
  return Object.freeze({
    contractVersion: "DOM-4:1",
    kpiPackageId,
    domainId,
    name: `${label} KPI Package`,
    description: `${label} neutral KPI package metadata.`,
    version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
    scope: "domain",
    status: "active",
    kpis: Object.freeze([
      Object.freeze({
        kpiId: `kpi.${token}.primary`,
        label: `${label} KPI`,
        description: `${label} neutral KPI metadata.`,
        intent: Object.freeze({
          label: `${label} Intent`,
          description: `${label} neutral measurement intent metadata.`,
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
          description: `${label} neutral aggregation metadata.`,
        }),
        reference: Object.freeze({
          vocabularyId: `vocabulary.${token}.core`,
          ontologyId: `relationship.${token}.link`,
          entityTypeId: `entity.${token}.source`,
          attributeId: `attribute.${token}.value`,
        }),
        scope: "domain",
        status: "active",
      }),
    ]),
    ...overrides,
  });
}

function fixtureRegistry() {
  const first = registerDomainKpiPackage(
    createDomainKpiRegistry(),
    kpiPackage("kpi-package.beta.core", "domain.beta", "Beta")
  );
  assert.equal(first.success, true);
  const second = registerDomainKpiPackage(
    first.registry,
    kpiPackage("kpi-package.alpha.core", "domain.alpha", "Alpha")
  );
  assert.equal(second.success, true);
  const third = registerDomainKpiPackage(
    second.registry,
    kpiPackage("kpi-package.alpha.archive", "domain.alpha", "Archive", {
      scope: "module",
      status: "archived",
      kpis: Object.freeze([
        Object.freeze({
          ...kpiPackage("kpi-package.alpha.archive", "domain.alpha", "Archive").kpis[0],
          kpiId: "kpi.archive.primary",
          unit: Object.freeze({ unitType: "percentage", unitLabel: "percent", precision: 2 }),
          aggregation: Object.freeze({
            aggregationType: "average",
            window: "quarterly",
            description: "Archive neutral aggregation metadata.",
          }),
          intent: Object.freeze({
            label: "Archive Intent",
            description: "Archive neutral measurement intent metadata.",
            direction: "increase_is_good",
          }),
          scope: "module",
          status: "deprecated",
        }),
      ]),
    })
  );
  assert.equal(third.success, true);
  return third.registry;
}

test("queries KPI packages by domain", () => {
  assert.deepEqual(findKpiPackagesByDomain(fixtureRegistry(), "domain.alpha").map((entry) => entry.package.kpiPackageId), [
    "kpi-package.alpha.core",
    "kpi-package.alpha.archive",
  ]);
});

test("queries KPI packages by scope", () => {
  assert.deepEqual(findKpiPackagesByScope(fixtureRegistry(), "module").map((entry) => entry.package.kpiPackageId), [
    "kpi-package.alpha.archive",
  ]);
});

test("queries KPI packages by status", () => {
  assert.deepEqual(findKpiPackagesByStatus(fixtureRegistry(), "archived").map((entry) => entry.package.kpiPackageId), [
    "kpi-package.alpha.archive",
  ]);
});

test("sorts by KPI package id", () => {
  assert.deepEqual(sortDomainKpiPackages(fixtureRegistry().packages, "kpiPackageId").map((entry) => entry.package.kpiPackageId), [
    "kpi-package.alpha.archive",
    "kpi-package.alpha.core",
    "kpi-package.beta.core",
  ]);
});

test("sorts by domain id", () => {
  assert.deepEqual(sortDomainKpiPackages(fixtureRegistry().packages, "domainId").map((entry) => entry.package.domainId), [
    "domain.alpha",
    "domain.alpha",
    "domain.beta",
  ]);
});

test("sorts by registration order", () => {
  assert.deepEqual(
    sortDomainKpiPackages(fixtureRegistry().packages, "registrationOrder").map((entry) => entry.package.kpiPackageId),
    ["kpi-package.beta.core", "kpi-package.alpha.core", "kpi-package.alpha.archive"]
  );
});

test("finds package containing KPI", () => {
  assert.equal(findKpiPackageContainingKpi(fixtureRegistry(), "kpi.alpha.primary")?.package.kpiPackageId, "kpi-package.alpha.core");
});

test("finds KPI by id", () => {
  const result = findDomainKpi(fixtureRegistry(), "kpi.beta.primary");

  assert.equal(result.found, true);
  assert.equal(result.kpi?.label, "Beta KPI");
});

test("finds KPIs by domain", () => {
  assert.deepEqual(findKpisByDomain(fixtureRegistry(), "domain.alpha").map((entry) => entry.kpi?.kpiId), [
    "kpi.alpha.primary",
    "kpi.archive.primary",
  ]);
});

test("finds KPIs by scope", () => {
  assert.deepEqual(findKpisByScope(fixtureRegistry(), "module").map((entry) => entry.kpi?.kpiId), ["kpi.archive.primary"]);
});

test("finds KPIs by status", () => {
  assert.deepEqual(findKpisByStatus(fixtureRegistry(), "deprecated").map((entry) => entry.kpi?.kpiId), ["kpi.archive.primary"]);
});

test("finds KPIs by unit type", () => {
  assert.deepEqual(findKpisByUnitType(fixtureRegistry(), "percentage").map((entry) => entry.kpi?.kpiId), ["kpi.archive.primary"]);
});

test("finds KPIs by aggregation type", () => {
  assert.deepEqual(findKpisByAggregationType(fixtureRegistry(), "average").map((entry) => entry.kpi?.kpiId), ["kpi.archive.primary"]);
});

test("finds KPIs by direction", () => {
  assert.deepEqual(findKpisByDirection(fixtureRegistry(), "increase_is_good").map((entry) => entry.kpi?.kpiId), ["kpi.archive.primary"]);
});

test("inspects references by vocabulary term", () => {
  assert.deepEqual(findKpisReferencingVocabularyTerm(fixtureRegistry(), "vocabulary.alpha.core").map((entry) => entry.kpi?.kpiId), [
    "kpi.alpha.primary",
  ]);
});

test("inspects references by ontology entity", () => {
  assert.deepEqual(findKpisReferencingOntologyEntity(fixtureRegistry(), "entity.alpha.source").map((entry) => entry.kpi?.kpiId), [
    "kpi.alpha.primary",
  ]);
});

test("inspects references by ontology attribute", () => {
  assert.deepEqual(findKpisReferencingOntologyAttribute(fixtureRegistry(), "attribute.alpha.value").map((entry) => entry.kpi?.kpiId), [
    "kpi.alpha.primary",
  ]);
});

test("inspects references by ontology relationship", () => {
  assert.deepEqual(findKpisReferencingOntologyRelationship(fixtureRegistry(), "relationship.alpha.link").map((entry) => entry.kpi?.kpiId), [
    "kpi.alpha.primary",
  ]);
});

test("builds KPI reference lookup", () => {
  const lookup = buildDomainKpiReferenceLookup(fixtureRegistry(), "attribute.alpha.value");

  assert.equal(lookup.referenceId, "attribute.alpha.value");
  assert.deepEqual(lookup.matches.map((entry) => entry.kpi?.kpiId), ["kpi.alpha.primary"]);
});

test("builds KPI snapshot", () => {
  const snapshot = buildDomainKpiSnapshot(fixtureRegistry());

  assert.equal(snapshot.packageCount, 3);
  assert.deepEqual(snapshot.entries.map((entry) => entry.kpiPackageId), [
    "kpi-package.alpha.archive",
    "kpi-package.alpha.core",
    "kpi-package.beta.core",
  ]);
});

test("validates KPI snapshot", () => {
  const validation = validateDomainKpiSnapshot(buildDomainKpiSnapshot(fixtureRegistry()));

  assert.equal(validation.valid, true);
  assert.deepEqual(validation.issues, []);
});

test("compares KPI snapshots", () => {
  assert.equal(compareDomainKpiSnapshots(buildDomainKpiSnapshot(fixtureRegistry()), buildDomainKpiSnapshot(fixtureRegistry())), true);
});

test("diffs added KPI packages", () => {
  const diff = diffDomainKpiSnapshots(buildDomainKpiSnapshot(createDomainKpiRegistry()), buildDomainKpiSnapshot(fixtureRegistry()));

  assert.equal(diff.entries.some((entry) => entry.type === "added"), true);
});

test("diffs removed KPI packages", () => {
  const diff = diffDomainKpiSnapshots(buildDomainKpiSnapshot(fixtureRegistry()), buildDomainKpiSnapshot(createDomainKpiRegistry()));

  assert.equal(diff.entries.some((entry) => entry.type === "removed"), true);
});

test("diffs modified KPI packages", () => {
  const left = registerDomainKpiPackage(
    createDomainKpiRegistry(),
    kpiPackage("kpi-package.alpha.core", "domain.alpha", "Alpha")
  ).registry;
  const right = registerDomainKpiPackage(
    createDomainKpiRegistry(),
    kpiPackage("kpi-package.alpha.core", "domain.alpha", "Alpha", {
      description: "Modified neutral KPI package metadata.",
    })
  ).registry;

  assert.equal(diffDomainKpiSnapshots(buildDomainKpiSnapshot(left), buildDomainKpiSnapshot(right)).entries.some((entry) => entry.type === "modified"), true);
});

test("exports public KPI query APIs", () => {
  assert.equal(typeof DomainKpiQueryLayer.queryDomainKpiPackages, "function");
  assert.equal(typeof DomainKpiQueryLayer.findDomainKpi, "function");
  assert.equal(typeof DomainKpiQueryLayer.buildDomainKpiReferenceLookup, "function");
  assert.equal(typeof DomainKpiQueryLayer.diffDomainKpiSnapshots, "function");
  assert.equal(Object.isFrozen(DomainKpiQueryLayer), true);
});

test("keeps DOM-4:1 regression compatibility", () => {
  const result = queryDomainKpiPackages(fixtureRegistry(), {
    filter: Object.freeze({ domainId: "domain.alpha" }),
    sortKey: "kpiPackageId",
  });

  assert.equal(validateDomainKpiFoundation().valid, true);
  assert.equal(result.length, 2);
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
