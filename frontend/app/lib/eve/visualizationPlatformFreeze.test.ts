import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as FreezeExports from "./visualizationPlatformFreeze.ts";
import {
  VisualizationPlatformFreezeIdentityMetadata,
  VisualizationPlatformFreezeInventoryMetadata,
  VisualizationPlatformFreezeMetadata,
  VisualizationPlatformFreezePlatform,
  VisualizationPlatformFreezeReadinessMetadata,
  getVisualizationPlatformFreezeCount,
  getVisualizationPlatformFreezeReleaseMetadata,
  getVisualizationPlatformFreezeSummary,
} from "./visualizationPlatformFreeze.ts";

const files = Object.freeze([
  "visualizationPlatformFreeze.test.ts", "visualizationPlatformFreeze.ts",
  "visualizationPlatformFreezeBaselines.ts",
  "visualizationPlatformFreezeCompatibility.ts",
  "visualizationPlatformFreezeExtensions.ts",
  "visualizationPlatformFreezeLocks.ts",
  "visualizationPlatformFreezeRegistry.ts",
  "visualizationPlatformFreezeTypes.ts",
]);
const sources = files.filter((name) => !name.endsWith(".test.ts"))
  .map((name) => readFileSync(new URL(name, import.meta.url), "utf8"));

describe("EVE-8:8 Visualization Platform Freeze", () => {
  it("creates exactly eight Freeze files and eight public exports", () => {
    const actual = readdirSync(import.meta.dirname).filter((name) =>
      files.includes(name));
    assert.deepEqual(actual.sort(), [...files].sort());
    assert.deepEqual(Object.keys(FreezeExports).sort(), [
      "VisualizationPlatformFreezeIdentityMetadata",
      "VisualizationPlatformFreezeInventoryMetadata",
      "VisualizationPlatformFreezeMetadata",
      "VisualizationPlatformFreezePlatform",
      "VisualizationPlatformFreezeReadinessMetadata",
      "getVisualizationPlatformFreezeCount",
      "getVisualizationPlatformFreezeReleaseMetadata",
      "getVisualizationPlatformFreezeSummary",
    ].sort());
  });

  it("publishes canonical frozen identity, lock, and readiness", () => {
    assert.equal(VisualizationPlatformFreezeIdentityMetadata.id,
      "EVE-8:8/VisualizationPlatformFreeze");
    assert.equal(VisualizationPlatformFreezeIdentityMetadata.namespace,
      "nexora.eve.visualization-platform.freeze");
    assert.equal(VisualizationPlatformFreezeIdentityMetadata.status, "Frozen");
    assert.equal(VisualizationPlatformFreezeReadinessMetadata.readiness,
      "ReadyForPublicIndex");
    assert.equal(VisualizationPlatformFreezeMetadata.lockId,
      "EVE-8-VISUALIZATION-PLATFORM-LOCKED");
  });

  it("publishes twelve immutable architectural locks", () => {
    const locks = VisualizationPlatformFreezePlatform.locks;
    assert.equal(locks.length, 12);
    assert.ok(locks.every((lock, index) => Object.isFrozen(lock)
      && lock.status === "Locked" && !lock.runtimeLocking
      && lock.lockIdentifier === "EVE-8-VISUALIZATION-PLATFORM-LOCKED"
      && lock.deterministicOrder === index + 1));
  });

  it("publishes eight immutable baselines, compatibility, and extensions", () => {
    const { baselines, compatibility, extensions } =
      VisualizationPlatformFreezePlatform;
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
    const { registry, certification } = VisualizationPlatformFreezePlatform;
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
    const { certification, inventory } = VisualizationPlatformFreezePlatform;
    assert.equal(inventory.certificationInventory, certification.inventory);
    assert.equal(inventory.certificationCriteria, certification.criteria);
    assert.equal(inventory.certificationGates, certification.gates);
    assert.equal(inventory.certificationCompatibility,
      certification.compatibility);
    assert.equal(inventory.certificationMetadata, certification.metadata);
    assert.equal(inventory.certificationReadiness, certification.readiness);
  });

  it("derives all Freeze inventory counts dynamically", () => {
    const inventory = VisualizationPlatformFreezeInventoryMetadata;
    assert.equal(inventory.counts.lockCount, inventory.locks.length);
    assert.equal(inventory.counts.baselineCount, inventory.baselines.length);
    assert.equal(inventory.counts.registryEntryCount, inventory.registry.length);
    assert.equal(inventory.counts.compatibilityCount,
      inventory.compatibility.length);
    assert.equal(inventory.counts.extensionCount, inventory.extensions.length);
    assert.equal(inventory.counts.publicSurfaceCount,
      inventory.publicFreezeSurface.length);
    assert.equal(getVisualizationPlatformFreezeCount(), inventory.locks.length);
    assert.equal(inventory.hardcodedAggregateTotals, false);
    assert.equal(inventory.reconstructsUpstreamCollections, false);
  });

  it("uses Certification as its only upstream phase dependency", () => {
    assert.equal(VisualizationPlatformFreezeMetadata.dependency
      .visualizationPlatformCertificationOnly, true);
    const combined = sources.join("\n");
    assert.doesNotMatch(combined,
      /from ["']\.\/visualizationPlatformPlatform/);
    assert.doesNotMatch(combined,
      /from ["']\.\/visualizationPlatformManifest/);
    assert.doesNotMatch(combined,
      /from ["']\.\/visualizationPlatformValidation/);
    assert.doesNotMatch(combined,
      /from ["']\.\/visualizationPlatformModel/);
    assert.doesNotMatch(combined,
      /from ["']\.\/visualizationPlatformRegistry/);
    assert.doesNotMatch(combined,
      /from ["']\.\/visualizationPlatformFoundation/);
    assert.doesNotMatch(combined,
      /from ["']\.\/(?:visualization(?!Platform)|graph|timeline|dashboard|animationEffects)/);
    assert.doesNotMatch(combined, /from ["']\.\.\//);
  });

  it("contains no freezing, visualization, or prohibited runtime", () => {
    const metadata = VisualizationPlatformFreezeMetadata;
    assert.ok(Object.isFrozen(VisualizationPlatformFreezePlatform));
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
    const combined = sources.join("\n");
    assert.doesNotMatch(combined,
      /from ["'](?:react|next|three|babylon|pixi|d3|chart\.js|zod)/i);
    assert.doesNotMatch(combined,
      /\b(?:fetch|XMLHttpRequest|WebSocket|document|window)\s*[.(]/);
  });

  it("provides stable summary and release metadata", () => {
    assert.equal(getVisualizationPlatformFreezeSummary().status, "Frozen");
    const release = getVisualizationPlatformFreezeReleaseMetadata();
    assert.equal(release.status, "Frozen");
    assert.equal(release.readiness, "ReadyForPublicIndex");
    assert.equal(release.lockId, "EVE-8-VISUALIZATION-PLATFORM-LOCKED");
    assert.equal(release.certificationReference,
      "EVE-8:7/VisualizationPlatformCertification");
  });
});
