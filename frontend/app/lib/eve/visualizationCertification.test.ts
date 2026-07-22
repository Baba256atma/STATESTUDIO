import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicCertification from "./visualizationCertification.ts";
import {
  VisualizationCertification, VisualizationCertificationId,
  VisualizationCertificationMetadata, VisualizationCertificationNamespace,
  VisualizationCertificationReadiness, VisualizationCertificationStatus,
  VisualizationCertificationVersion,
} from "./visualizationCertification.ts";

const FILES = Object.freeze([
  "visualizationCertificationTypes.ts", "visualizationCertificationCriteria.ts",
  "visualizationCertificationGates.ts", "visualizationCertificationMetadata.ts",
  "visualizationCertificationInventory.ts", "visualizationCertificationCompatibility.ts",
  "visualizationCertification.ts", "visualizationCertification.test.ts",
]);

describe("EVE-1:7 Visualization Certification", () => {
  it("adds exactly eight Certification files and eight public exports", () => {
    const present = readdirSync(import.meta.dirname);
    assert.ok(FILES.every((file) => present.includes(file)));
    assert.equal(Object.keys(PublicCertification).length, 8);
  });

  it("has canonical Certified identity and readiness", () => {
    assert.equal(VisualizationCertificationId, "EVE-1:7/VisualizationCertification");
    assert.equal(VisualizationCertificationVersion, "1.0.0");
    assert.equal(VisualizationCertificationNamespace, "nexora.eve.visualization.certification");
    assert.equal(VisualizationCertificationStatus, "Certified");
    assert.equal(VisualizationCertificationReadiness, "ReadyForFreeze");
  });

  it("publishes all certification criteria deterministically", () => {
    assert.equal(VisualizationCertification.criteria.length, 16);
    assert.ok(VisualizationCertification.criteria.every((entry, index) =>
      entry.deterministicOrder === index + 1 && entry.verification === "DeclarativeOnly"));
    assert.ok(VisualizationCertification.criteria.every(Object.isFrozen));
  });

  it("publishes passed deterministic certification gates", () => {
    assert.equal(VisualizationCertification.gates.length, 12);
    assert.ok(VisualizationCertification.gates.every((entry, index) =>
      entry.deterministicOrder === index + 1 && entry.status === "Passed"
      && entry.result === "Certified" && !entry.executes));
  });

  it("derives compatibility and inventory from Platform", () => {
    assert.equal(VisualizationCertification.compatibility.length, VisualizationCertification.platform.compatibility.length);
    assert.ok(VisualizationCertification.compatibility.every(({ certified, runtimeVerification }) => certified && !runtimeVerification));
    assert.equal(VisualizationCertification.inventory.platformInventory, VisualizationCertification.platform.inventory);
    assert.equal(VisualizationCertification.inventory.platformInventoryPreservedByReference, true);
    assert.equal(VisualizationCertification.inventory.recalculatesPlatformInventory, false);
    assert.equal(VisualizationCertification.inventory.hardcodesInventoryCounts, false);
  });

  it("consumes only Visualization Platform", () => {
    assert.equal(VisualizationCertificationMetadata.dependency.visualizationPlatformOnly, true);
    for (const file of FILES.filter((name) => !name.endsWith(".test.ts"))) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      assert.doesNotMatch(source, /from ["']\.\/visualization(?:Foundation|Registry|Model|Validation|Manifest)/);
      const parentImports = [...source.matchAll(/from ["'](\.\.\/[^"']+)["']/g)];
      assert.equal(parentImports.length, 0);
    }
  });

  it("is immutable and exposes no certification runtime", () => {
    assert.ok(Object.isFrozen(VisualizationCertification));
    assert.ok(Object.isFrozen(VisualizationCertificationMetadata));
    assert.ok(Object.isFrozen(VisualizationCertification.inventory));
    assert.equal(VisualizationCertification.certificationEngine, false);
    assert.equal(VisualizationCertification.automaticCertificationExecution, false);
    assert.equal(VisualizationCertification.execution, false);
    assert.equal(VisualizationCertification.rendering, false);
    assert.equal(VisualizationCertification.services, false);
    assert.equal(VisualizationCertification.factories, false);
  });
});
