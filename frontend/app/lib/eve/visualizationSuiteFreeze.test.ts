import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as FreezeExports from "./visualizationSuiteFreeze.ts";
import {
  VisualizationSuiteFreezeIdentityMetadata,
  VisualizationSuiteFreezeInventoryMetadata,
  VisualizationSuiteFreezeMetadata,
  VisualizationSuiteFreezePlatform,
  VisualizationSuiteFreezeReadinessMetadata,
  getVisualizationSuiteFreezeCount,
  getVisualizationSuiteFreezeReleaseMetadata,
  getVisualizationSuiteFreezeSummary,
} from "./visualizationSuiteFreeze.ts";

const files = Object.freeze([
  "visualizationSuiteFreeze.test.ts", "visualizationSuiteFreeze.ts",
  "visualizationSuiteFreezeBaselines.ts",
  "visualizationSuiteFreezeCompatibility.ts",
  "visualizationSuiteFreezeExtensions.ts", "visualizationSuiteFreezeLocks.ts",
  "visualizationSuiteFreezeRegistry.ts", "visualizationSuiteFreezeTypes.ts",
]);
const sources = files.filter((name) => !name.endsWith(".test.ts"))
  .map((name) => readFileSync(new URL(name, import.meta.url), "utf8"));

describe("EVE-9:8 Visualization Suite Freeze", () => {
  it("creates exactly eight Freeze files and eight public exports", () => {
    const actual = readdirSync(import.meta.dirname).filter((name) =>
      files.includes(name));
    assert.deepEqual(actual.sort(), [...files].sort());
    assert.deepEqual(Object.keys(FreezeExports).sort(), [
      "VisualizationSuiteFreezeIdentityMetadata",
      "VisualizationSuiteFreezeInventoryMetadata",
      "VisualizationSuiteFreezeMetadata", "VisualizationSuiteFreezePlatform",
      "VisualizationSuiteFreezeReadinessMetadata",
      "getVisualizationSuiteFreezeCount",
      "getVisualizationSuiteFreezeReleaseMetadata",
      "getVisualizationSuiteFreezeSummary",
    ].sort());
  });

  it("publishes canonical frozen identity, lock, and readiness", () => {
    assert.equal(VisualizationSuiteFreezeIdentityMetadata.id,
      "EVE-9:8/VisualizationSuiteFreeze");
    assert.equal(VisualizationSuiteFreezeIdentityMetadata.namespace,
      "nexora.eve.visualization-suite.freeze");
    assert.equal(VisualizationSuiteFreezeIdentityMetadata.status, "Frozen");
    assert.equal(VisualizationSuiteFreezeReadinessMetadata.readiness,
      "ReadyForPublicIndex");
    assert.equal(VisualizationSuiteFreezeMetadata.lockId,
      "EVE-9-VISUALIZATION-SUITE-LOCKED");
  });

  it("publishes twelve immutable architectural locks", () => {
    const locks = VisualizationSuiteFreezePlatform.locks;
    assert.equal(locks.length, 12);
    assert.ok(locks.every((lock, index) => Object.isFrozen(lock)
      && lock.status === "Locked" && !lock.runtimeLocking
      && lock.lockIdentifier === "EVE-9-VISUALIZATION-SUITE-LOCKED"
      && lock.deterministicOrder === index + 1));
  });

  it("publishes eight immutable baselines, compatibility, and extensions", () => {
    const { baselines, compatibility, extensions } =
      VisualizationSuiteFreezePlatform;
    assert.equal(baselines.length, 8);
    assert.equal(compatibility.length, 8);
    assert.equal(extensions.length, 8);
    for (const collection of [baselines, compatibility, extensions]) {
      assert.ok(Object.isFrozen(collection));
      assert.ok(collection.every((entry, index) => Object.isFrozen(entry)
        && entry.preservedByReference && entry.metadataOnly && entry.immutable
        && entry.deterministicOrder === index + 1));
    }
  });

  it("publishes the canonical seven-phase frozen registry", () => {
    const { registry, certification } = VisualizationSuiteFreezePlatform;
    assert.equal(registry.length, 7);
    assert.deepEqual(registry.map(({ phase }) => phase), [
      "Foundation", "Registry", "Model", "Validation", "Manifest", "Platform",
      "Certification",
    ]);
    assert.ok(registry.every((entry, index) => Object.isFrozen(entry)
      && entry.certificationReference === certification.metadata.id
      && entry.preservedByReference && entry.deterministicOrder === index + 1));
  });

  it("preserves every Certification collection by canonical reference", () => {
    const { certification, inventory } = VisualizationSuiteFreezePlatform;
    assert.equal(inventory.certificationInventory, certification.inventory);
    assert.equal(inventory.certificationCriteria, certification.criteria);
    assert.equal(inventory.certificationGates, certification.gates);
    assert.equal(inventory.certificationCompatibility,
      certification.compatibility);
    assert.equal(inventory.certificationMetadata, certification.metadata);
    assert.equal(inventory.certificationReadiness, certification.readiness);
  });

  it("derives all Freeze inventory counts dynamically", () => {
    const inventory = VisualizationSuiteFreezeInventoryMetadata;
    assert.equal(inventory.counts.lockCount, inventory.locks.length);
    assert.equal(inventory.counts.baselineCount, inventory.baselines.length);
    assert.equal(inventory.counts.registryEntryCount, inventory.registry.length);
    assert.equal(inventory.counts.compatibilityCount,
      inventory.compatibility.length);
    assert.equal(inventory.counts.extensionCount, inventory.extensions.length);
    assert.equal(inventory.counts.publicSurfaceCount,
      inventory.publicFreezeSurface.length);
    assert.equal(getVisualizationSuiteFreezeCount(), inventory.locks.length);
    assert.equal(inventory.hardcodedAggregateTotals, false);
    assert.equal(inventory.reconstructsUpstreamCollections, false);
  });

  it("uses Certification as its only upstream phase dependency", () => {
    assert.equal(VisualizationSuiteFreezeMetadata.dependency
      .visualizationSuiteCertificationOnly, true);
    const combined = sources.join("\n");
    assert.doesNotMatch(combined, /from ["']\.\/visualizationSuitePlatform/);
    assert.doesNotMatch(combined, /from ["']\.\/visualizationSuiteManifest/);
    assert.doesNotMatch(combined, /from ["']\.\/visualizationSuiteValidation/);
    assert.doesNotMatch(combined, /from ["']\.\/visualizationSuiteModel/);
    assert.doesNotMatch(combined, /from ["']\.\/visualizationSuiteRegistry/);
    assert.doesNotMatch(combined, /from ["']\.\/visualizationSuiteFoundation/);
    assert.doesNotMatch(combined, /PublicIndex\.ts["']/);
    assert.doesNotMatch(combined, /from ["']\.\.\//);
  });

  it("contains no freezing, visualization, or prohibited runtime", () => {
    const metadata = VisualizationSuiteFreezeMetadata;
    assert.ok(Object.isFrozen(VisualizationSuiteFreezePlatform));
    assert.equal(metadata.freezeEngine, false);
    assert.equal(metadata.runtimeLocking, false);
    assert.equal(metadata.runtimeFreezeManagement, false);
    assert.equal(metadata.certificationExecution, false);
    assert.equal(metadata.validationExecution, false);
    assert.equal(metadata.rendering, false);
    assert.equal(metadata.visualizationExecution, false);
    assert.equal(metadata.orchestration, false);
    assert.equal(metadata.networking, false);
    assert.equal(metadata.persistence, false);
    assert.equal(metadata.services, false);
    assert.equal(metadata.factories, false);
  });

  it("provides stable summary and release metadata", () => {
    assert.equal(getVisualizationSuiteFreezeSummary().status, "Frozen");
    const release = getVisualizationSuiteFreezeReleaseMetadata();
    assert.equal(release.status, "Frozen");
    assert.equal(release.readiness, "ReadyForPublicIndex");
    assert.equal(release.lockId, "EVE-9-VISUALIZATION-SUITE-LOCKED");
    assert.equal(release.certificationReference,
      "EVE-9:7/VisualizationSuiteCertification");
  });
});
