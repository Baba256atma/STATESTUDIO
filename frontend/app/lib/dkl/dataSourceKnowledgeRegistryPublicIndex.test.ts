import assert from "node:assert/strict";
import test from "node:test";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import * as publicIndexApi from "./dataSourceKnowledgeRegistryPublicIndex.ts";
import {
  DataSourceKnowledgeRegistryPlatform,
  DataSourceKnowledgeRegistryPublicApiRegistry,
  DataSourceKnowledgeRegistryPublicIndexId,
  DataSourceKnowledgeRegistryPublicIndexName,
  DataSourceKnowledgeRegistryPublicIndexNamespace,
  DataSourceKnowledgeRegistryPublicIndexReadiness,
  DataSourceKnowledgeRegistryPublicIndexReleaseStatus,
  DataSourceKnowledgeRegistryPublicIndexVersion,
  DataSourceKnowledgeRegistryPublicPlatform,
  getDataSourceKnowledgeRegistryPublicApiById,
  getDataSourceKnowledgeRegistryPublicApisBySection,
  getDataSourceKnowledgeRegistryPublicIndexSummary,
} from "./dataSourceKnowledgeRegistryPublicIndex.ts";

// Canonical originating references imported directly (permitted in tests only,
// as DKL maintenance/testing) to verify reference-identity preservation.
import { DataSourceKnowledgeRegistryFoundation } from "./dataSourceKnowledgeRegistryFoundation.ts";
import { DataSourceKnowledgeRegistryPlatform as Dkl22RegistryPlatform } from "./dataSourceKnowledgeRegistryPlatform.ts";
import { DataSourceRegistryModelPlatform } from "./dataSourceRegistryModelPlatform.ts";
import { DataSourceKnowledgeValidationPlatform } from "./dataSourceKnowledgeValidationRunner.ts";
import { DataSourceKnowledgeRegistryManifestPlatform } from "./dataSourceKnowledgeRegistryManifestPlatform.ts";
import { DataSourceKnowledgeRegistryPlatform as Dkl26CompletePlatform } from "./dataSourceKnowledgeRegistryPlatformIndex.ts";
import { DataSourceKnowledgeCertificationPlatform } from "./dataSourceKnowledgeCertificationPlatform.ts";
import { DataSourceKnowledgeFreezePlatform } from "./dataSourceKnowledgeFreezePlatform.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const isDeeplyFrozen = (value: unknown): boolean => {
  if (value === null || typeof value !== "object") {
    return true;
  }
  if (!Object.isFrozen(value)) {
    return false;
  }
  for (const nested of Object.values(value as Record<string, unknown>)) {
    if (!isDeeplyFrozen(nested)) {
      return false;
    }
  }
  return true;
};

const EXPECTED_EXPORTS = [
  "DataSourceKnowledgeRegistryPublicPlatform",
  "DataSourceKnowledgeRegistryPlatform",
  "DataSourceKnowledgeRegistryPublicApiRegistry",
  "DataSourceKnowledgeRegistryPublicIndexId",
  "DataSourceKnowledgeRegistryPublicIndexVersion",
  "DataSourceKnowledgeRegistryPublicIndexName",
  "DataSourceKnowledgeRegistryPublicIndexNamespace",
  "DataSourceKnowledgeRegistryPublicIndexReleaseStatus",
  "DataSourceKnowledgeRegistryPublicIndexReadiness",
  "getDataSourceKnowledgeRegistryPublicApiById",
  "getDataSourceKnowledgeRegistryPublicApisBySection",
  "getDataSourceKnowledgeRegistryPublicIndexSummary",
];

const EXPECTED_SECTION_ORDER = [
  "foundation",
  "registry",
  "model",
  "validation",
  "manifest",
  "platform",
  "certification",
  "freeze",
  "publicIndex",
];

test("1. exactly two DKL-2:9 files exist", () => {
  assert.equal(existsSync(join(HERE, "dataSourceKnowledgeRegistryPublicIndex.ts")), true);
  assert.equal(existsSync(join(HERE, "dataSourceKnowledgeRegistryPublicIndex.test.ts")), true);
  assert.equal(existsSync(join(HERE, "dataSourceKnowledgeRegistryPublicIndexTypes.ts")), false);
});

test("2. Public Index module has exactly 12 runtime exports", () => {
  const exportNames = Object.keys(publicIndexApi).sort();
  assert.equal(exportNames.length, 12);
  assert.deepEqual(exportNames, [...EXPECTED_EXPORTS].sort());
});

test("3. public namespace contains exactly nine sections", () => {
  assert.equal(Object.keys(DataSourceKnowledgeRegistryPublicPlatform).length, 9);
});

test("4. namespace section order is exact", () => {
  assert.deepEqual(Object.keys(DataSourceKnowledgeRegistryPublicPlatform), EXPECTED_SECTION_ORDER);
});

test("5. every section references its canonical originating phase object", () => {
  const ns = DataSourceKnowledgeRegistryPublicPlatform;
  assert.equal(ns.foundation, DataSourceKnowledgeRegistryFoundation);
  assert.equal(ns.registry, Dkl22RegistryPlatform);
  assert.equal(ns.model, DataSourceRegistryModelPlatform);
  assert.equal(ns.validation, DataSourceKnowledgeValidationPlatform);
  assert.equal(ns.manifest, DataSourceKnowledgeRegistryManifestPlatform);
  assert.equal(ns.platform, Dkl26CompletePlatform);
  assert.equal(ns.certification, DataSourceKnowledgeCertificationPlatform);
  assert.equal(ns.freeze, DataSourceKnowledgeFreezePlatform);
  assert.ok(ns.publicIndex);
});

test("6. Public Index reaches every phase only through the Freeze platform", () => {
  const freeze = DataSourceKnowledgeFreezePlatform;
  assert.equal(DataSourceKnowledgeRegistryPublicPlatform.platform, freeze.certifiedPlatform);
  assert.equal(DataSourceKnowledgeRegistryPublicPlatform.certification, freeze.certification);
  assert.equal(DataSourceKnowledgeRegistryPublicPlatform.foundation, freeze.certifiedPlatform.foundation);
  assert.equal(DataSourceKnowledgeRegistryPublicPlatform.registry, freeze.certifiedPlatform.registry);
  assert.equal(DataSourceKnowledgeRegistryPublicPlatform.manifest, freeze.certifiedPlatform.manifest);
});

test("7. exactly one canonical top-level DataSourceKnowledgeRegistryPlatform is exported", () => {
  const platformNamedExports = Object.keys(publicIndexApi).filter(
    (name) => name === "DataSourceKnowledgeRegistryPlatform",
  );
  assert.equal(platformNamedExports.length, 1);
});

test("8. exported complete platform is the DKL-2:6 aggregate reference", () => {
  assert.equal(DataSourceKnowledgeRegistryPlatform, Dkl26CompletePlatform);
  assert.equal(DataSourceKnowledgeRegistryPlatform, DataSourceKnowledgeRegistryPublicPlatform.platform);
});

test("9. DKL-2:2 registry platform is available only through the registry section", () => {
  assert.equal(DataSourceKnowledgeRegistryPublicPlatform.registry, Dkl22RegistryPlatform);
  assert.notEqual(DataSourceKnowledgeRegistryPlatform as object, Dkl22RegistryPlatform as object);
});

test("10. no duplicate ambiguous platform export exists", () => {
  assert.notEqual(Dkl22RegistryPlatform as object, Dkl26CompletePlatform as object);
  const values = Object.values(publicIndexApi);
  const matchingDkl22 = values.filter((v) => v === (Dkl22RegistryPlatform as unknown));
  assert.equal(matchingDkl22.length, 0);
});

test("11. Public API Registry ids are globally unique", () => {
  const ids = DataSourceKnowledgeRegistryPublicApiRegistry.map((e) => e.apiId);
  assert.equal(new Set(ids).size, ids.length);
});

test("12. Public API Registry names and ownership are valid", () => {
  for (const entry of DataSourceKnowledgeRegistryPublicApiRegistry) {
    assert.ok(entry.apiName.length > 0);
    assert.match(entry.ownerPhase, /^DKL-2:[1-9]$/);
    assert.ok(EXPECTED_SECTION_ORDER.includes(entry.namespaceSection));
    assert.match(entry.sourceModule, /\.ts$/);
    assert.ok(entry.description.length > 0);
  }
});

test("13, 14, 15. every registered API is StableAndFrozen / Released / Public", () => {
  for (const entry of DataSourceKnowledgeRegistryPublicApiRegistry) {
    assert.equal(entry.stability, "StableAndFrozen");
    assert.equal(entry.releaseStatus, "Released");
    assert.equal(entry.visibility, "Public");
  }
});

test("16. unknown API id returns undefined", () => {
  assert.equal(getDataSourceKnowledgeRegistryPublicApiById("DKL-2:9/DOES-NOT-EXIST"), undefined);
  const known = DataSourceKnowledgeRegistryPublicApiRegistry[0];
  assert.equal(getDataSourceKnowledgeRegistryPublicApiById(known.apiId), known);
});

test("17. API lookup by section is deterministic", () => {
  const first = getDataSourceKnowledgeRegistryPublicApisBySection("publicIndex");
  const second = getDataSourceKnowledgeRegistryPublicApisBySection("publicIndex");
  assert.deepEqual(first, second);
  assert.ok(first.length > 0);
  for (const entry of first) {
    assert.equal(entry.namespaceSection, "publicIndex");
  }
  const registryOrder = DataSourceKnowledgeRegistryPublicApiRegistry
    .filter((e) => e.namespaceSection === "publicIndex")
    .map((e) => e.apiId);
  assert.deepEqual(first.map((e) => e.apiId), registryOrder);
});

test("18. unknown section returns an immutable empty collection", () => {
  const result = getDataSourceKnowledgeRegistryPublicApisBySection(
    "nonexistent" as unknown as "foundation",
  );
  assert.equal(result.length, 0);
  assert.equal(Object.isFrozen(result), true);
});

test("19. prior frozen runtime API count is exactly 60", () => {
  assert.equal(getDataSourceKnowledgeRegistryPublicIndexSummary().priorFrozenRuntimeApiCount, 60);
});

test("20. Public Index runtime export count is exactly 12", () => {
  assert.equal(Object.keys(publicIndexApi).length, 12);
  assert.equal(getDataSourceKnowledgeRegistryPublicIndexSummary().publicIndexRuntimeExportCount, 12);
});

test("21, 22, 23. registry 95, model 86, validation 40/40 PASS", () => {
  const summary = getDataSourceKnowledgeRegistryPublicIndexSummary();
  assert.equal(summary.registryEntryCount, 95);
  assert.equal(summary.modelCount, 86);
  assert.equal(summary.validationRuleCount, 40);
  assert.equal(summary.validationPassCount, 40);
});

test("24, 25. certification 14 gates, freeze 12 guarantees", () => {
  const summary = getDataSourceKnowledgeRegistryPublicIndexSummary();
  assert.equal(summary.certificationGateCount, 14);
  assert.equal(summary.freezeGuaranteeCount, 12);
});

test("26, 27. blocking and warning counts are zero", () => {
  const summary = getDataSourceKnowledgeRegistryPublicIndexSummary();
  assert.equal(summary.blockingIssueCount, 0);
  assert.equal(summary.warningCount, 0);
  assert.equal(DataSourceKnowledgeRegistryPublicIndexReadiness.blockingIssueCount, 0);
  assert.equal(DataSourceKnowledgeRegistryPublicIndexReadiness.warningCount, 0);
});

test("28, 29, 30, 31, 32, 33. release/cert/freeze/stability/readiness/nextConsumer", () => {
  const summary = getDataSourceKnowledgeRegistryPublicIndexSummary();
  assert.equal(summary.releaseStatus, "Released");
  assert.equal(summary.certificationStatus, "Certified");
  assert.equal(summary.freezeStatus, "Frozen");
  assert.equal(summary.stability, "StableAndFrozen");
  assert.equal(summary.readiness, "ReadyForConsumers");
  assert.equal(summary.nextConsumer, "DKL-3");
  assert.equal(DataSourceKnowledgeRegistryPublicIndexReleaseStatus, "Released");
});

test("identity primitives are stable and explicit", () => {
  assert.equal(DataSourceKnowledgeRegistryPublicIndexId, "DKL-2:9");
  assert.equal(DataSourceKnowledgeRegistryPublicIndexVersion, "1.0.0");
  assert.equal(DataSourceKnowledgeRegistryPublicIndexName, "Data Source & Knowledge Registry Public Index");
  assert.equal(DataSourceKnowledgeRegistryPublicIndexNamespace, "nexora.dkl.dsk-registry.public");
});

test("readiness reports the complete DKL-2:9 status set", () => {
  const r = DataSourceKnowledgeRegistryPublicIndexReadiness;
  assert.equal(r.status, "PublicIndexComplete");
  for (const flag of [
    "Released",
    "Certified",
    "Frozen",
    "StableAndFrozen",
    "MetadataOnly",
    "RuntimeFree",
    "Deterministic",
    "Immutable",
    "OwnershipProtected",
    "PublicSurfaceControlled",
    "ReadyForConsumers",
  ]) {
    assert.ok(r.completion.includes(flag), `missing ${flag}`);
  }
  assert.equal(r.readiness, "ReadyForConsumers");
});

test("34. all public objects are deeply frozen", () => {
  assert.equal(isDeeplyFrozen(DataSourceKnowledgeRegistryPublicPlatform), true);
  assert.equal(isDeeplyFrozen(DataSourceKnowledgeRegistryPublicApiRegistry), true);
  assert.equal(isDeeplyFrozen(DataSourceKnowledgeRegistryPublicIndexReadiness), true);
  assert.equal(isDeeplyFrozen(getDataSourceKnowledgeRegistryPublicIndexSummary()), true);
  assert.equal(isDeeplyFrozen(DataSourceKnowledgeRegistryPublicPlatform.publicIndex), true);
});

test("35. repeated lookup and summary calls are deterministic", () => {
  assert.equal(
    getDataSourceKnowledgeRegistryPublicIndexSummary(),
    getDataSourceKnowledgeRegistryPublicIndexSummary(),
  );
  assert.equal(
    getDataSourceKnowledgeRegistryPublicApiById("DKL-2:9/API-EXPORT-PLATFORM"),
    getDataSourceKnowledgeRegistryPublicApiById("DKL-2:9/API-EXPORT-PLATFORM"),
  );
});

test("36. no forbidden runtime behavior: only lookups are functions", () => {
  const functionExports = Object.entries(publicIndexApi)
    .filter(([, value]) => typeof value === "function")
    .map(([name]) => name);
  assert.deepEqual(functionExports.sort(), [
    "getDataSourceKnowledgeRegistryPublicApiById",
    "getDataSourceKnowledgeRegistryPublicApisBySection",
    "getDataSourceKnowledgeRegistryPublicIndexSummary",
  ]);
});

test("37. full namespace and API registry are metadata-only", () => {
  for (const entry of DataSourceKnowledgeRegistryPublicApiRegistry) {
    for (const value of Object.values(entry)) {
      assert.notEqual(typeof value, "function");
    }
  }
  assert.equal(typeof DataSourceKnowledgeRegistryPublicPlatform.publicIndex, "object");
});

test("38. Public Index summary registeredPublicApiCount equals registry length", () => {
  assert.equal(
    getDataSourceKnowledgeRegistryPublicIndexSummary().registeredPublicApiCount,
    DataSourceKnowledgeRegistryPublicApiRegistry.length,
  );
  assert.equal(getDataSourceKnowledgeRegistryPublicIndexSummary().phaseCount, 9);
  assert.equal(getDataSourceKnowledgeRegistryPublicIndexSummary().namespaceSectionCount, 9);
});

test("39. registry includes the nine sections and the twelve top-level exports", () => {
  const sectionApis = DataSourceKnowledgeRegistryPublicApiRegistry.filter(
    (e) => e.apiKind === "NamespaceSection",
  );
  assert.equal(sectionApis.length, 9);
  assert.deepEqual(
    sectionApis.map((e) => e.apiName),
    EXPECTED_SECTION_ORDER,
  );
  const exportApiNames = DataSourceKnowledgeRegistryPublicApiRegistry
    .filter((e) => e.apiKind !== "NamespaceSection")
    .map((e) => e.apiName)
    .sort();
  assert.deepEqual(exportApiNames, [...EXPECTED_EXPORTS].sort());
});

test("40. DKL-2 is officially released and points to DKL-3", () => {
  assert.equal(DataSourceKnowledgeRegistryPublicIndexReleaseStatus, "Released");
  assert.equal(getDataSourceKnowledgeRegistryPublicIndexSummary().releaseStatus, "Released");
  assert.equal(getDataSourceKnowledgeRegistryPublicIndexSummary().nextConsumer, "DKL-3");
  assert.equal(DataSourceKnowledgeRegistryPublicIndexReadiness.released, true);
});
