import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as CertificationExports from "./visualizationPlatformCertification.ts";
import {
  VisualizationPlatformCertificationIdentityMetadata,
  VisualizationPlatformCertificationInventoryMetadata,
  VisualizationPlatformCertificationMetadata,
  VisualizationPlatformCertificationPlatform,
  VisualizationPlatformCertificationReadinessMetadata,
  getVisualizationPlatformCertificationCount,
  getVisualizationPlatformCertificationReleaseMetadata,
  getVisualizationPlatformCertificationSummary,
} from "./visualizationPlatformCertification.ts";

const files = Object.freeze([
  "visualizationPlatformCertification.test.ts",
  "visualizationPlatformCertification.ts",
  "visualizationPlatformCertificationCompatibility.ts",
  "visualizationPlatformCertificationCriteria.ts",
  "visualizationPlatformCertificationGates.ts",
  "visualizationPlatformCertificationInventory.ts",
  "visualizationPlatformCertificationMetadata.ts",
  "visualizationPlatformCertificationTypes.ts",
]);
const sources = files.filter((name) => !name.endsWith(".test.ts"))
  .map((name) => readFileSync(new URL(name, import.meta.url), "utf8"));

describe("EVE-8:7 Visualization Platform Certification", () => {
  it("creates exactly eight Certification files and eight public exports", () => {
    const actual = readdirSync(import.meta.dirname).filter((name) =>
      files.includes(name));
    assert.deepEqual(actual.sort(), [...files].sort());
    assert.deepEqual(Object.keys(CertificationExports).sort(), [
      "VisualizationPlatformCertificationIdentityMetadata",
      "VisualizationPlatformCertificationInventoryMetadata",
      "VisualizationPlatformCertificationMetadata",
      "VisualizationPlatformCertificationPlatform",
      "VisualizationPlatformCertificationReadinessMetadata",
      "getVisualizationPlatformCertificationCount",
      "getVisualizationPlatformCertificationReleaseMetadata",
      "getVisualizationPlatformCertificationSummary",
    ].sort());
  });

  it("publishes canonical certified identity and Freeze readiness", () => {
    assert.equal(VisualizationPlatformCertificationIdentityMetadata.id,
      "EVE-8:7/VisualizationPlatformCertification");
    assert.equal(VisualizationPlatformCertificationIdentityMetadata.namespace,
      "nexora.eve.visualization-platform.certification");
    assert.equal(VisualizationPlatformCertificationIdentityMetadata.status,
      "Certified");
    assert.equal(VisualizationPlatformCertificationReadinessMetadata.readiness,
      "ReadyForFreeze");
  });

  it("publishes sixteen immutable certification criteria", () => {
    const { criteria, platform } = VisualizationPlatformCertificationPlatform;
    assert.equal(criteria.length, 16);
    assert.ok(criteria.every((criterion, index) => Object.isFrozen(criterion)
      && criterion.status === "Certified"
      && criterion.verification === "DeclarativeOnly"
      && criterion.platformReference === platform.metadata.id
      && criterion.deterministicOrder === index + 1));
  });

  it("publishes twelve passed gates and eight compatibility records", () => {
    const { gates, compatibility } = VisualizationPlatformCertificationPlatform;
    assert.equal(gates.length, 12);
    assert.equal(compatibility.length, 8);
    for (const collection of [gates, compatibility]) {
      assert.ok(Object.isFrozen(collection));
      assert.ok(collection.every((entry, index) => Object.isFrozen(entry)
        && entry.immutable && entry.metadataOnly
        && entry.deterministicOrder === index + 1));
    }
    assert.ok(gates.every(({ outcome, executes }) =>
      outcome === "Passed" && !executes));
    assert.ok(compatibility.every(({ verified, runtimeVerification }) =>
      verified && !runtimeVerification));
  });

  it("publishes complete immutable certification results", () => {
    const results = VisualizationPlatformCertificationMetadata.results;
    assert.ok(Object.isFrozen(results));
    assert.equal(results.outcome, "Passed");
    assert.equal(results.status, "Certified");
    assert.equal(results.readiness, "ReadyForFreeze");
    assert.equal(results.verificationComplete, true);
  });

  it("preserves every Platform collection by canonical reference", () => {
    const { platform, inventory } = VisualizationPlatformCertificationPlatform;
    assert.equal(inventory.platformInventory, platform.inventory);
    assert.equal(inventory.platformCapabilities, platform.capabilities);
    assert.equal(inventory.platformGuarantees, platform.guarantees);
    assert.equal(inventory.platformCompatibility, platform.compatibility);
    assert.equal(inventory.platformComposition, platform.composition);
    assert.equal(inventory.platformMetadata, platform.metadata);
    assert.equal(inventory.platformReadiness, platform.readiness);
  });

  it("derives all Certification inventory counts dynamically", () => {
    const inventory = VisualizationPlatformCertificationInventoryMetadata;
    assert.equal(inventory.counts.criteriaCount, inventory.criteria.length);
    assert.equal(inventory.counts.gateCount, inventory.gates.length);
    assert.equal(inventory.counts.compatibilityVerificationCount,
      inventory.compatibilityVerification.length);
    assert.equal(inventory.counts.publicSurfaceCount,
      inventory.publicCertificationSurface.length);
    assert.equal(getVisualizationPlatformCertificationCount(),
      inventory.criteria.length);
    assert.equal(inventory.hardcodedAggregateTotals, false);
    assert.equal(inventory.reconstructsUpstreamCollections, false);
  });

  it("uses Platform as its only upstream phase dependency", () => {
    assert.equal(VisualizationPlatformCertificationMetadata.dependency
      .visualizationPlatformPlatformOnly, true);
    const combined = sources.join("\n");
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

  it("contains no certification, visualization, or prohibited runtime", () => {
    const metadata = VisualizationPlatformCertificationMetadata;
    assert.ok(Object.isFrozen(VisualizationPlatformCertificationPlatform));
    assert.equal(metadata.certificationEngine, false);
    assert.equal(metadata.runtimeCertification, false);
    assert.equal(metadata.validationEngine, false);
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
    assert.equal(getVisualizationPlatformCertificationSummary().status,
      "Certified");
    const release = getVisualizationPlatformCertificationReleaseMetadata();
    assert.equal(release.status, "Certified");
    assert.equal(release.readiness, "ReadyForFreeze");
    assert.equal(release.platformReference,
      "EVE-8:6/VisualizationPlatformPlatform");
  });
});
