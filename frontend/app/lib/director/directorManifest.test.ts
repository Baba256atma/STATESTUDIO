import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicManifest from "./directorManifest.ts";
import {
  DirectorManifest, DirectorManifestId, DirectorManifestNamespace,
  DirectorManifestReadinessStatus, DirectorManifestStatus,
  DirectorManifestVersion,
} from "./directorManifest.ts";

const FILES = Object.freeze([
  "directorManifestTypes.ts", "directorManifestInventory.ts",
  "directorManifestCompatibility.ts", "directorManifestReadiness.ts",
  "directorManifestMetadata.ts", "directorManifest.ts",
  "directorManifestExports.ts", "directorManifest.test.ts",
]);

describe("DIRECTOR-1:5 Director Manifest", () => {
  it("has canonical manifest identity and readiness", () => {
    assert.equal(DirectorManifestId, "DIRECTOR-1:5/DirectorManifest");
    assert.equal(DirectorManifestVersion, "1.0.0");
    assert.equal(DirectorManifestNamespace, "nexora.director.manifest");
    assert.equal(DirectorManifestStatus, "Manifest");
    assert.equal(DirectorManifestReadinessStatus, "ReadyForPlatform");
  });

  it("adds exactly eight Manifest files and eight public exports", () => {
    const present = readdirSync(import.meta.dirname);
    assert.ok(FILES.every((file) => present.includes(file)));
    assert.deepEqual(Object.keys(PublicManifest).sort(), [...DirectorManifest.publicExports].sort());
  });

  it("derives consistent canonical inventories", () => {
    const { inventories, inventoryTotals } = DirectorManifest;
    assert.deepEqual(inventories.map(({ name }) => name), ["Foundation", "Registry", "Model", "Validation"]);
    assert.ok(inventories.every(({ derived }) => derived));
    assert.equal(inventoryTotals.totalInventoryEntries, inventories.reduce((sum, item) => sum + item.entryCount, 0));
    assert.equal(inventoryTotals.totalMetadataCollections, inventories.reduce((sum, item) => sum + item.collectionCount, 0));
    assert.equal(inventoryTotals.totalExportedCollections, inventories.length);
  });

  it("publishes deterministic compatibility and readiness metadata", () => {
    assert.equal(DirectorManifest.compatibility.length, 6);
    assert.equal(DirectorManifest.readiness.length, 5);
    assert.ok(DirectorManifest.compatibility.every((entry, index) => entry.deterministicOrder === index + 1 && entry.compatible));
    assert.ok(DirectorManifest.readiness.every((entry, index) => entry.deterministicOrder === index + 1 && entry.ready));
  });

  it("obeys the canonical inventory and dependency rules", () => {
    const { canonicalInventoryRule, dependency } = DirectorManifest.metadata;
    assert.equal(dependency.validationOnly, true);
    assert.equal(dependency.directFoundationImport, false);
    assert.equal(dependency.directRegistryImport, false);
    assert.equal(dependency.directModelImport, false);
    assert.equal(canonicalInventoryRule.derivedOnly, true);
    assert.equal(canonicalInventoryRule.hardcodesInventoryTotals, false);
    assert.equal(canonicalInventoryRule.manuallyCountsUpstreamObjects, false);
  });

  it("imports no prohibited upstream or external modules", () => {
    for (const file of FILES.filter((name) => !name.endsWith(".test.ts"))) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      assert.doesNotMatch(source, /from ["']\.\/director(?:Foundation|Registry|Model)/);
      assert.doesNotMatch(source, /from ["'](?:react|three|@react|babylon|eve)/i);
    }
  });

  it("is deeply immutable and runtime-free", () => {
    assert.ok(Object.isFrozen(DirectorManifest));
    assert.ok(Object.isFrozen(DirectorManifest.metadata));
    assert.ok(Object.isFrozen(DirectorManifest.inventories));
    assert.ok(Object.isFrozen(DirectorManifest.inventoryTotals));
    assert.equal(DirectorManifest.services, false);
    assert.equal(DirectorManifest.factories, false);
    assert.equal(DirectorManifest.execution, false);
    assert.equal(DirectorManifest.orchestration, false);
  });
});
