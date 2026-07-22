import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicExports from "./visualizationSuitePublicIndex.ts";
import {
  VisualizationSuitePublicApiRegistry,
  VisualizationSuitePublicCertificationStatus,
  VisualizationSuitePublicFoundation,
  VisualizationSuitePublicFreezeStatus,
  VisualizationSuitePublicIndexId,
  VisualizationSuitePublicIndexName,
  VisualizationSuitePublicIndexNamespace,
  VisualizationSuitePublicIndexVersion,
  VisualizationSuitePublicReleaseStatus,
  getVisualizationSuitePublicApiCount,
  getVisualizationSuitePublicReleaseMetadata,
  getVisualizationSuitePublicSummary,
} from "./visualizationSuitePublicIndex.ts";

describe("EVE-9:9 Visualization Suite Public Index", () => {
  it("creates exactly two Public Index files and twelve public exports", () => {
    const actual = readdirSync(import.meta.dirname).filter((name) =>
      name.startsWith("visualizationSuitePublicIndex"));
    assert.deepEqual(actual.sort(), [
      "visualizationSuitePublicIndex.test.ts",
      "visualizationSuitePublicIndex.ts",
    ]);
    assert.equal(Object.keys(PublicExports).length, 12);
    assert.deepEqual(Object.keys(PublicExports).sort(),
      [...VisualizationSuitePublicFoundation.publicExports].sort());
  });

  it("publishes canonical identity, release state, and readiness", () => {
    assert.equal(VisualizationSuitePublicIndexId,
      "EVE-9:9/VisualizationSuitePublicIndex");
    assert.equal(VisualizationSuitePublicIndexName,
      "Visualization Suite Public Index");
    assert.equal(VisualizationSuitePublicIndexVersion, "1.0.0");
    assert.equal(VisualizationSuitePublicIndexNamespace,
      "nexora.eve.visualization-suite.public-index");
    assert.equal(VisualizationSuitePublicReleaseStatus, "Released");
    assert.equal(VisualizationSuitePublicCertificationStatus, "Certified");
    assert.equal(VisualizationSuitePublicFreezeStatus, "Frozen");
    const metadata = getVisualizationSuitePublicReleaseMetadata();
    assert.equal(metadata.stability, "Stable");
    assert.equal(metadata.readiness, "ReadyForConsumer");
    assert.equal(metadata.lockId, "EVE-9-VISUALIZATION-SUITE-LOCKED");
  });

  it("publishes exactly nine ordered namespace sections", () => {
    const namespace = VisualizationSuitePublicFoundation.namespace;
    assert.deepEqual(namespace.map(({ name }) => name), [
      "Foundation", "Registry", "Model", "Validation", "Manifest", "Platform",
      "Certification", "Freeze", "Public Index",
    ]);
    assert.ok(namespace.every((entry, index) => Object.isFrozen(entry)
      && entry.preservedByReference && entry.deterministicOrder === index + 1));
    assert.equal(namespace[7]!.canonicalSource,
      VisualizationSuitePublicFoundation.frozenArchitecture);
    assert.equal(namespace[8]!.canonicalReference,
      VisualizationSuitePublicIndexId);
  });

  it("publishes immutable unique deterministic per-export API records", () => {
    const entries = VisualizationSuitePublicApiRegistry.entries;
    assert.ok(Object.isFrozen(VisualizationSuitePublicApiRegistry));
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
    const registry = VisualizationSuitePublicApiRegistry;
    assert.equal(registry.apiCount, registry.entries.length);
    assert.equal(getVisualizationSuitePublicApiCount(), registry.entries.length);
    assert.equal(registry.namespaceSectionCount,
      VisualizationSuitePublicFoundation.namespace.length);
    assert.equal(registry.canonicalInventoryRule.hardcodedApiTotals, false);
    assert.equal(registry.canonicalInventoryRule.hardcodedUpstreamPhaseCounts,
      false);
    assert.equal(registry.canonicalInventoryRule.reconstructsUpstreamCollections,
      false);
  });

  it("preserves Freeze collections and the complete canonical chain", () => {
    const publicIndex = VisualizationSuitePublicFoundation;
    const freeze = publicIndex.frozenArchitecture;
    assert.equal(publicIndex.freezeCollections, freeze.inventory);
    assert.equal(publicIndex.publicApiRegistry.frozenInventory, freeze.inventory);
    assert.equal(freeze.metadata.lockId,
      "EVE-9-VISUALIZATION-SUITE-LOCKED");
    assert.equal(freeze.certification.platform.manifest.validation.model.registry
      .foundation.metadata.id, "EVE-9:1/VisualizationSuiteFoundation");
  });

  it("declares exactly one supported consumer entry point", () => {
    const metadata = getVisualizationSuitePublicReleaseMetadata();
    assert.equal(metadata.soleConsumerEntryPoint,
      "visualizationSuitePublicIndex.ts");
    assert.deepEqual(metadata.supportedConsumerEntries,
      ["visualizationSuitePublicIndex.ts"]);
  });

  it("uses Freeze as its only phase dependency", () => {
    const metadata = getVisualizationSuitePublicReleaseMetadata();
    assert.equal(metadata.dependency.visualizationSuiteFreezeOnly, true);
    const source = readFileSync(new URL(
      "visualizationSuitePublicIndex.ts", import.meta.url), "utf8");
    assert.doesNotMatch(source, /from ["']\.\/visualizationSuiteCertification/);
    assert.doesNotMatch(source, /from ["']\.\/visualizationSuitePlatform/);
    assert.doesNotMatch(source, /from ["']\.\/visualizationSuiteManifest/);
    assert.doesNotMatch(source, /from ["']\.\/visualizationSuiteValidation/);
    assert.doesNotMatch(source, /from ["']\.\/visualizationSuiteModel/);
    assert.doesNotMatch(source, /from ["']\.\/visualizationSuiteRegistry/);
    assert.doesNotMatch(source, /from ["']\.\/visualizationSuiteFoundation/);
    assert.doesNotMatch(source,
      /from ["']\.\/(?:visualization(?!Suite)|graph|timeline|dashboard|animationEffects)/);
  });

  it("contains immutable metadata and no prohibited runtime facilities", () => {
    const publicIndex = VisualizationSuitePublicFoundation;
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
    const summary = getVisualizationSuitePublicSummary();
    assert.equal(summary.release, "Released");
    assert.equal(summary.certification, "Certified");
    assert.equal(summary.freeze, "Frozen");
    assert.equal(summary.readiness, "ReadyForConsumer");
    assert.equal(summary.publicApiCount, getVisualizationSuitePublicApiCount());
    assert.equal(getVisualizationSuitePublicReleaseMetadata().freezeReference,
      "EVE-9:8/VisualizationSuiteFreeze");
  });
});
