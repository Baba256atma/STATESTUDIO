import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicCertification from "./graphVisualizationCertification.ts";
import {
  getGraphVisualizationCertificationCount,
  getGraphVisualizationCertificationReleaseMetadata,
  getGraphVisualizationCertificationSummary,
  GraphVisualizationCertification,
  GraphVisualizationCertificationIdentity,
  GraphVisualizationCertificationInventory,
  GraphVisualizationCertificationMetadata,
  GraphVisualizationCertificationReadiness,
} from "./graphVisualizationCertification.ts";

const FILES = Object.freeze([
  "graphVisualizationCertificationTypes.ts", "graphVisualizationCertificationCriteria.ts",
  "graphVisualizationCertificationGates.ts", "graphVisualizationCertificationCompatibility.ts",
  "graphVisualizationCertificationInventory.ts", "graphVisualizationCertificationMetadata.ts",
  "graphVisualizationCertification.ts", "graphVisualizationCertification.test.ts",
]);

describe("EVE-3:7 Graph Visualization Certification", () => {
  it("adds exactly eight Certification files and eight public exports", () => {
    assert.ok(FILES.every((file) => readdirSync(import.meta.dirname).includes(file)));
    assert.equal(Object.keys(PublicCertification).length, 8);
  });

  it("publishes the canonical identity and readiness", () => {
    assert.equal(GraphVisualizationCertificationIdentity.id,
      "EVE-3:7/GraphVisualizationCertification");
    assert.equal(GraphVisualizationCertificationIdentity.version, "1.0.0");
    assert.equal(GraphVisualizationCertificationIdentity.namespace,
      "nexora.eve.graph-visualization.certification");
    assert.equal(GraphVisualizationCertificationMetadata.status, "Certified");
    assert.equal(GraphVisualizationCertificationReadiness.readiness, "ReadyForFreeze");
    assert.equal(GraphVisualizationCertificationMetadata.platformReference,
      "EVE-3:6/GraphVisualizationPlatform");
  });

  it("publishes exact immutable certification collections", () => {
    assert.equal(GraphVisualizationCertification.criteria.length, 16);
    assert.equal(GraphVisualizationCertification.gates.length, 12);
    assert.equal(GraphVisualizationCertification.compatibility.length, 8);
    for (const collection of [GraphVisualizationCertification.criteria,
      GraphVisualizationCertification.gates, GraphVisualizationCertification.compatibility]) {
      assert.ok(Object.isFrozen(collection));
      assert.ok(collection.every((entry, index) =>
        Object.isFrozen(entry) && entry.deterministicOrder === index + 1));
    }
    assert.ok(GraphVisualizationCertification.gates.every(({ status }) => status === "Passed"));
  });

  it("preserves Platform collections by canonical reference", () => {
    const { inventory, platform } = GraphVisualizationCertification;
    assert.equal(inventory.platformInventory, platform.inventory);
    assert.equal(inventory.platformCapabilities, platform.capabilities);
    assert.equal(inventory.platformGuarantees, platform.guarantees);
    assert.equal(inventory.platformCompatibility, platform.compatibility);
    assert.equal(inventory.platformComposition, platform.metadata.composition);
    assert.equal(inventory.dependencyMetadata, platform.metadata.dependency);
  });

  it("derives all inventory counts dynamically", () => {
    const { counts } = GraphVisualizationCertificationInventory;
    assert.equal(counts.criteriaCount, GraphVisualizationCertification.criteria.length);
    assert.equal(counts.gateCount, GraphVisualizationCertification.gates.length);
    assert.equal(counts.compatibilityVerificationCount,
      GraphVisualizationCertification.compatibility.length);
    assert.equal(counts.platformPhaseCount,
      GraphVisualizationCertification.platform.metadata.composition.length);
    assert.equal(getGraphVisualizationCertificationCount(),
      GraphVisualizationCertification.criteria.length);
    assert.equal(GraphVisualizationCertificationInventory.hardcodesAggregateTotals, false);
    assert.equal(GraphVisualizationCertificationInventory.reconstructsUpstreamCollections, false);
  });

  it("consumes only Graph Visualization Platform", () => {
    assert.equal(GraphVisualizationCertificationMetadata.dependency
      .graphVisualizationPlatformOnly, true);
    for (const file of FILES.filter((name) => !name.endsWith(".test.ts"))) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      assert.doesNotMatch(source,
        /from ["']\.\/graphVisualization(?:Manifest|Validation|Model|Registry|Foundation)/);
      assert.doesNotMatch(source, /from ["']\.\/sceneRendering/);
      assert.doesNotMatch(source, /from ["']\.\/visualization/);
      assert.equal([...source.matchAll(/from ["'](\.\.\/[^"']+)["']/g)].length, 0);
    }
  });

  it("is immutable metadata with no certification or graph runtime", () => {
    assert.ok(Object.isFrozen(GraphVisualizationCertification));
    assert.ok(Object.isFrozen(GraphVisualizationCertificationMetadata));
    assert.ok(Object.isFrozen(GraphVisualizationCertificationInventory));
    assert.equal(GraphVisualizationCertification.certificationEngine, false);
    assert.equal(GraphVisualizationCertification.runtimeCertification, false);
    assert.equal(GraphVisualizationCertification.validationExecution, false);
    assert.equal(GraphVisualizationCertification.execution, false);
    assert.equal(GraphVisualizationCertification.rendering, false);
    assert.equal(GraphVisualizationCertification.services, false);
    assert.equal(GraphVisualizationCertification.factories, false);
  });

  it("provides stable summary and release metadata", () => {
    assert.equal(getGraphVisualizationCertificationSummary(),
      GraphVisualizationCertificationMetadata);
    const release = getGraphVisualizationCertificationReleaseMetadata();
    assert.equal(release.status, "Certified");
    assert.equal(release.readiness, GraphVisualizationCertificationReadiness);
    assert.equal(release.platformReference, "EVE-3:6/GraphVisualizationPlatform");
  });
});
