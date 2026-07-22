import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicIndex from "./graphVisualizationPublicIndex.ts";
import {
  getGraphVisualizationPublicApiCount, getGraphVisualizationPublicReleaseMetadata,
  getGraphVisualizationPublicSummary, GraphVisualizationPlatformPublicFoundation,
  GraphVisualizationPublicApiRegistry, GraphVisualizationPublicCertificationStatus,
  GraphVisualizationPublicFreezeStatus, GraphVisualizationPublicIndexId,
  GraphVisualizationPublicIndexName, GraphVisualizationPublicIndexNamespace,
  GraphVisualizationPublicIndexVersion, GraphVisualizationPublicReleaseStatus,
} from "./graphVisualizationPublicIndex.ts";

describe("EVE-3:9 Graph Visualization Public Index", () => {
  it("adds exactly the two requested Public Index files", () => {
    const files = readdirSync(import.meta.dirname)
      .filter((name) => name.startsWith("graphVisualizationPublicIndex"));
    assert.deepEqual(files.sort(), [
      "graphVisualizationPublicIndex.test.ts", "graphVisualizationPublicIndex.ts",
    ]);
  });

  it("exports exactly twelve stable public symbols", () => {
    assert.equal(Object.keys(PublicIndex).length, 12);
    assert.deepEqual(Object.keys(PublicIndex).sort(),
      [...GraphVisualizationPlatformPublicFoundation.publicExports].sort());
  });

  it("publishes the canonical released identity and statuses", () => {
    assert.equal(GraphVisualizationPublicIndexId,
      "EVE-3:9/GraphVisualizationPublicIndex");
    assert.equal(GraphVisualizationPublicIndexName, "Graph Visualization Public Index");
    assert.equal(GraphVisualizationPublicIndexVersion, "1.0.0");
    assert.equal(GraphVisualizationPublicIndexNamespace,
      "nexora.eve.graph-visualization.public-index");
    assert.equal(GraphVisualizationPublicReleaseStatus, "Released");
    assert.equal(GraphVisualizationPublicCertificationStatus, "Certified");
    assert.equal(GraphVisualizationPublicFreezeStatus, "Frozen");
    assert.equal(getGraphVisualizationPublicSummary().stability, "Stable");
    assert.equal(getGraphVisualizationPublicSummary().readiness, "ReadyForConsumer");
    assert.equal(getGraphVisualizationPublicSummary().lockId,
      "EVE-3-GRAPH-VISUALIZATION-LOCKED");
  });

  it("publishes exactly nine ordered canonical namespace sections", () => {
    const namespace = GraphVisualizationPlatformPublicFoundation.namespace;
    assert.deepEqual(namespace.map(({ name }) => name), [
      "foundation", "registry", "model", "validation", "manifest",
      "platform", "certification", "freeze", "publicIndex",
    ]);
    assert.ok(namespace.every((entry, index) => Object.isFrozen(entry)
      && entry.deterministicOrder === index + 1 && entry.preservedByReference));
    assert.equal(namespace[7]!.canonicalSource,
      GraphVisualizationPlatformPublicFoundation.frozenArchitecture);
    assert.equal(namespace[8]!.canonicalReference, GraphVisualizationPublicIndexId);
  });

  it("publishes an immutable unique per-export API registry", () => {
    const entries = GraphVisualizationPublicApiRegistry.entries;
    assert.ok(Object.isFrozen(GraphVisualizationPublicApiRegistry));
    assert.ok(Object.isFrozen(entries));
    assert.ok(entries.every(Object.isFrozen));
    assert.equal(new Set(entries.map(({ id }) => id)).size, entries.length);
    assert.deepEqual(entries.map(({ deterministicOrdinal }) => deterministicOrdinal),
      [...entries].sort((a, b) => a.phaseOrder - b.phaseOrder || a.exportOrder - b.exportOrder)
        .map(({ deterministicOrdinal }) => deterministicOrdinal));
  });

  it("derives API counts and contributions canonically", () => {
    assert.equal(GraphVisualizationPublicApiRegistry.apiCount,
      GraphVisualizationPublicApiRegistry.entries.length);
    assert.equal(getGraphVisualizationPublicApiCount(),
      GraphVisualizationPublicApiRegistry.entries.length);
    assert.equal(GraphVisualizationPublicApiRegistry.namespaceSectionCount, 9);
    assert.equal(GraphVisualizationPublicApiRegistry.canonicalInventoryRule
      .hardcodedApiTotals, false);
    assert.equal(GraphVisualizationPublicApiRegistry.canonicalInventoryRule
      .hardcodedUpstreamPhaseTotals, false);
    assert.equal(GraphVisualizationPublicApiRegistry.canonicalInventoryRule
      .duplicatesUpstreamMetadata, false);
  });

  it("declares the sole consumer entry point and preserves frozen metadata", () => {
    const metadata = getGraphVisualizationPublicReleaseMetadata();
    assert.equal(GraphVisualizationPlatformPublicFoundation.soleConsumerEntryPoint,
      "frontend/app/lib/eve/graphVisualizationPublicIndex.ts");
    assert.equal(metadata.freezeReference, "EVE-3:8/GraphVisualizationFreeze");
    assert.equal(metadata.lockId, "EVE-3-GRAPH-VISUALIZATION-LOCKED");
    assert.equal(metadata.inventory,
      GraphVisualizationPlatformPublicFoundation.frozenArchitecture.inventory);
    assert.ok(Object.isFrozen(getGraphVisualizationPublicSummary()));
    assert.ok(Object.isFrozen(metadata));
  });

  it("consumes only Graph Visualization Freeze", () => {
    const metadata = getGraphVisualizationPublicReleaseMetadata();
    assert.equal(metadata.dependency.graphVisualizationFreezeOnly, true);
    const source = readFileSync(new URL("graphVisualizationPublicIndex.ts", import.meta.url),
      "utf8");
    assert.doesNotMatch(source,
      /from ["']\.\/graphVisualization(?:Certification|Platform|Manifest|Validation|Model|Registry|Foundation)/);
    assert.doesNotMatch(source, /from ["']\.\/sceneRendering/);
    assert.doesNotMatch(source, /from ["']\.\/visualization/);
  });

  it("is immutable and exposes no graph or runtime facilities", () => {
    const metadata = getGraphVisualizationPublicReleaseMetadata();
    assert.ok(Object.isFrozen(GraphVisualizationPlatformPublicFoundation));
    assert.equal(metadata.execution, false);
    assert.equal(metadata.graphProcessing, false);
    assert.equal(metadata.analytics, false);
    assert.equal(metadata.traversal, false);
    assert.equal(metadata.pathfinding, false);
    assert.equal(metadata.layoutExecution, false);
    assert.equal(metadata.rendering, false);
    assert.equal(metadata.networking, false);
    assert.equal(metadata.persistence, false);
    assert.equal(metadata.services, false);
    assert.equal(metadata.factories, false);
  });
});
