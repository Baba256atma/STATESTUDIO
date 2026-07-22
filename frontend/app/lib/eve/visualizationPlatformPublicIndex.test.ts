import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicExports from "./visualizationPlatformPublicIndex.ts";
import {
  VisualizationPlatformPublicApiRegistry,
  VisualizationPlatformPublicCertificationStatus,
  VisualizationPlatformPublicFoundation,
  VisualizationPlatformPublicFreezeStatus,
  VisualizationPlatformPublicIndexId,
  VisualizationPlatformPublicIndexName,
  VisualizationPlatformPublicIndexNamespace,
  VisualizationPlatformPublicIndexVersion,
  VisualizationPlatformPublicReleaseStatus,
  getVisualizationPlatformPublicApiCount,
  getVisualizationPlatformPublicReleaseMetadata,
  getVisualizationPlatformPublicSummary,
} from "./visualizationPlatformPublicIndex.ts";

describe("EVE-8:9 Visualization Platform Public Index", () => {
  it("creates exactly two Public Index files and twelve public exports", () => {
    const actual = readdirSync(import.meta.dirname).filter((name) =>
      name.startsWith("visualizationPlatformPublicIndex"));
    assert.deepEqual(actual.sort(), [
      "visualizationPlatformPublicIndex.test.ts",
      "visualizationPlatformPublicIndex.ts",
    ]);
    assert.equal(Object.keys(PublicExports).length, 12);
    assert.deepEqual(Object.keys(PublicExports).sort(),
      [...VisualizationPlatformPublicFoundation.publicExports].sort());
  });

  it("publishes canonical identity, release state, and readiness", () => {
    assert.equal(VisualizationPlatformPublicIndexId,
      "EVE-8:9/VisualizationPlatformPublicIndex");
    assert.equal(VisualizationPlatformPublicIndexName,
      "Visualization Platform Public Index");
    assert.equal(VisualizationPlatformPublicIndexVersion, "1.0.0");
    assert.equal(VisualizationPlatformPublicIndexNamespace,
      "nexora.eve.visualization-platform.public-index");
    assert.equal(VisualizationPlatformPublicReleaseStatus, "Released");
    assert.equal(VisualizationPlatformPublicCertificationStatus, "Certified");
    assert.equal(VisualizationPlatformPublicFreezeStatus, "Frozen");
    const metadata = getVisualizationPlatformPublicReleaseMetadata();
    assert.equal(metadata.stability, "Stable");
    assert.equal(metadata.readiness, "ReadyForConsumer");
    assert.equal(metadata.lockId, "EVE-8-VISUALIZATION-PLATFORM-LOCKED");
  });

  it("publishes exactly nine ordered namespace sections", () => {
    const namespace = VisualizationPlatformPublicFoundation.namespace;
    assert.deepEqual(namespace.map(({ name }) => name), [
      "Foundation", "Registry", "Model", "Validation", "Manifest", "Platform",
      "Certification", "Freeze", "Public Index",
    ]);
    assert.ok(namespace.every((entry, index) => Object.isFrozen(entry)
      && entry.preservedByReference && entry.deterministicOrder === index + 1));
    assert.equal(namespace[7]!.canonicalSource,
      VisualizationPlatformPublicFoundation.frozenArchitecture);
    assert.equal(namespace[8]!.canonicalReference,
      VisualizationPlatformPublicIndexId);
  });

  it("publishes immutable unique deterministic per-export API records", () => {
    const entries = VisualizationPlatformPublicApiRegistry.entries;
    assert.ok(Object.isFrozen(VisualizationPlatformPublicApiRegistry));
    assert.ok(Object.isFrozen(entries));
    assert.ok(entries.every((entry) => Object.isFrozen(entry)
      && Object.isFrozen(entry.deterministicOrdinal)
      && !entry.executableBehavior));
    assert.equal(new Set(entries.map(({ id }) => id)).size, entries.length);
    assert.equal(new Set(entries.map(({ owningPhase, exportName }) =>
      `${owningPhase}/${exportName}`)).size, entries.length);
    assert.deepEqual(entries.map(({ deterministicOrdinal }) =>
      deterministicOrdinal), [...entries].sort((a, b) =>
      a.phaseOrder - b.phaseOrder || a.exportOrder - b.exportOrder)
      .map(({ deterministicOrdinal }) => deterministicOrdinal));
    assert.equal(entries.filter(({ owningPhase }) =>
      owningPhase === "Public Index").length, Object.keys(PublicExports).length);
  });

  it("derives all API and namespace counts dynamically", () => {
    const registry = VisualizationPlatformPublicApiRegistry;
    assert.equal(registry.apiCount, registry.entries.length);
    assert.equal(getVisualizationPlatformPublicApiCount(),
      registry.entries.length);
    assert.equal(registry.namespaceSectionCount,
      VisualizationPlatformPublicFoundation.namespace.length);
    assert.equal(registry.canonicalInventoryRule.hardcodedApiTotals, false);
    assert.equal(registry.canonicalInventoryRule.hardcodedUpstreamPhaseCounts,
      false);
    assert.equal(registry.canonicalInventoryRule.reconstructsUpstreamCollections,
      false);
  });

  it("preserves Freeze collections and the complete canonical chain", () => {
    const publicIndex = VisualizationPlatformPublicFoundation;
    const freeze = publicIndex.frozenArchitecture;
    assert.equal(publicIndex.freezeCollections, freeze.inventory);
    assert.equal(publicIndex.publicApiRegistry.frozenInventory,
      freeze.inventory);
    assert.equal(freeze.metadata.lockId,
      "EVE-8-VISUALIZATION-PLATFORM-LOCKED");
    assert.equal(freeze.certification.platform.manifest.validation.model.registry
      .foundation.metadata.id,
    "EVE-8:1/VisualizationPlatformFoundation");
  });

  it("declares exactly one supported consumer entry point", () => {
    const metadata = getVisualizationPlatformPublicReleaseMetadata();
    assert.equal(metadata.soleConsumerEntryPoint,
      "visualizationPlatformPublicIndex.ts");
    assert.deepEqual(metadata.supportedConsumerEntries,
      ["visualizationPlatformPublicIndex.ts"]);
  });

  it("uses Freeze as its only phase dependency", () => {
    const metadata = getVisualizationPlatformPublicReleaseMetadata();
    assert.equal(metadata.dependency.visualizationPlatformFreezeOnly, true);
    const source = readFileSync(new URL(
      "visualizationPlatformPublicIndex.ts", import.meta.url), "utf8");
    assert.doesNotMatch(source,
      /from ["']\.\/visualizationPlatformCertification/);
    assert.doesNotMatch(source,
      /from ["']\.\/visualizationPlatformPlatform/);
    assert.doesNotMatch(source,
      /from ["']\.\/visualizationPlatformManifest/);
    assert.doesNotMatch(source,
      /from ["']\.\/visualizationPlatformValidation/);
    assert.doesNotMatch(source,
      /from ["']\.\/visualizationPlatformModel/);
    assert.doesNotMatch(source,
      /from ["']\.\/visualizationPlatformRegistry/);
    assert.doesNotMatch(source,
      /from ["']\.\/visualizationPlatformFoundation/);
    assert.doesNotMatch(source,
      /from ["']\.\/(?:visualization(?!Platform)|graph|timeline|dashboard|animationEffects)/);
  });

  it("contains immutable metadata and no prohibited runtime facilities", () => {
    const publicIndex = VisualizationPlatformPublicFoundation;
    const metadata = publicIndex.metadata;
    assert.ok(Object.isFrozen(publicIndex));
    assert.ok(Object.isFrozen(metadata));
    assert.equal(metadata.rendering, false);
    assert.equal(metadata.visualizationExecution, false);
    assert.equal(metadata.graphExecution, false);
    assert.equal(metadata.timelineExecution, false);
    assert.equal(metadata.dashboardExecution, false);
    assert.equal(metadata.animationExecution, false);
    assert.equal(metadata.gpuProcessing, false);
    assert.equal(metadata.orchestration, false);
    assert.equal(metadata.networking, false);
    assert.equal(metadata.persistence, false);
    assert.equal(metadata.services, false);
    assert.equal(metadata.factories, false);
  });

  it("provides stable summary and release accessors", () => {
    const summary = getVisualizationPlatformPublicSummary();
    assert.equal(summary.release, "Released");
    assert.equal(summary.certification, "Certified");
    assert.equal(summary.freeze, "Frozen");
    assert.equal(summary.readiness, "ReadyForConsumer");
    assert.equal(summary.publicApiCount,
      getVisualizationPlatformPublicApiCount());
    assert.equal(getVisualizationPlatformPublicReleaseMetadata().freezeReference,
      "EVE-8:8/VisualizationPlatformFreeze");
  });
});
