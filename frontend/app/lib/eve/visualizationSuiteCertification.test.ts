import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as CertificationExports from "./visualizationSuiteCertification.ts";
import {
  VisualizationSuiteCertificationIdentityMetadata,
  VisualizationSuiteCertificationInventoryMetadata,
  VisualizationSuiteCertificationMetadata,
  VisualizationSuiteCertificationPlatform,
  VisualizationSuiteCertificationReadinessMetadata,
  getVisualizationSuiteCertificationCount,
  getVisualizationSuiteCertificationReleaseMetadata,
  getVisualizationSuiteCertificationSummary,
} from "./visualizationSuiteCertification.ts";

const files = Object.freeze([
  "visualizationSuiteCertification.test.ts",
  "visualizationSuiteCertification.ts",
  "visualizationSuiteCertificationCompatibility.ts",
  "visualizationSuiteCertificationCriteria.ts",
  "visualizationSuiteCertificationGates.ts",
  "visualizationSuiteCertificationInventory.ts",
  "visualizationSuiteCertificationMetadata.ts",
  "visualizationSuiteCertificationTypes.ts",
]);
const sources = files.filter((name) => !name.endsWith(".test.ts"))
  .map((name) => readFileSync(new URL(name, import.meta.url), "utf8"));

describe("EVE-9:7 Visualization Suite Certification", () => {
  it("creates exactly eight Certification files and eight public exports", () => {
    const actual = readdirSync(import.meta.dirname).filter((name) =>
      files.includes(name));
    assert.deepEqual(actual.sort(), [...files].sort());
    assert.deepEqual(Object.keys(CertificationExports).sort(), [
      "VisualizationSuiteCertificationIdentityMetadata",
      "VisualizationSuiteCertificationInventoryMetadata",
      "VisualizationSuiteCertificationMetadata",
      "VisualizationSuiteCertificationPlatform",
      "VisualizationSuiteCertificationReadinessMetadata",
      "getVisualizationSuiteCertificationCount",
      "getVisualizationSuiteCertificationReleaseMetadata",
      "getVisualizationSuiteCertificationSummary",
    ].sort());
  });

  it("publishes canonical certified identity and Freeze readiness", () => {
    assert.equal(VisualizationSuiteCertificationIdentityMetadata.id,
      "EVE-9:7/VisualizationSuiteCertification");
    assert.equal(VisualizationSuiteCertificationIdentityMetadata.namespace,
      "nexora.eve.visualization-suite.certification");
    assert.equal(VisualizationSuiteCertificationIdentityMetadata.status,
      "Certified");
    assert.equal(VisualizationSuiteCertificationReadinessMetadata.readiness,
      "ReadyForFreeze");
  });

  it("publishes sixteen immutable certification criteria", () => {
    const { criteria, platform } = VisualizationSuiteCertificationPlatform;
    assert.equal(criteria.length, 16);
    assert.ok(criteria.every((criterion, index) => Object.isFrozen(criterion)
      && criterion.status === "Certified"
      && criterion.verification === "DeclarativeOnly"
      && criterion.platformReference === platform.metadata.id
      && criterion.deterministicOrder === index + 1));
  });

  it("publishes twelve passed gates and eight compatibility records", () => {
    const { gates, compatibility } = VisualizationSuiteCertificationPlatform;
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
    const results = VisualizationSuiteCertificationMetadata.results;
    assert.ok(Object.isFrozen(results));
    assert.equal(results.outcome, "Passed");
    assert.equal(results.status, "Certified");
    assert.equal(results.readiness, "ReadyForFreeze");
    assert.equal(results.verificationComplete, true);
  });

  it("preserves every Platform collection by canonical reference", () => {
    const { platform, inventory } = VisualizationSuiteCertificationPlatform;
    assert.equal(inventory.platformInventory, platform.inventory);
    assert.equal(inventory.platformCapabilities, platform.capabilities);
    assert.equal(inventory.platformGuarantees, platform.guarantees);
    assert.equal(inventory.platformCompatibility, platform.compatibility);
    assert.equal(inventory.platformComposition, platform.composition);
    assert.equal(inventory.platformMetadata, platform.metadata);
    assert.equal(inventory.platformReadiness, platform.readiness);
  });

  it("derives all Certification inventory counts dynamically", () => {
    const inventory = VisualizationSuiteCertificationInventoryMetadata;
    assert.equal(inventory.counts.criteriaCount, inventory.criteria.length);
    assert.equal(inventory.counts.gateCount, inventory.gates.length);
    assert.equal(inventory.counts.compatibilityVerificationCount,
      inventory.compatibilityVerification.length);
    assert.equal(inventory.counts.publicSurfaceCount,
      inventory.publicCertificationSurface.length);
    assert.equal(getVisualizationSuiteCertificationCount(),
      inventory.criteria.length);
    assert.equal(inventory.hardcodedAggregateTotals, false);
    assert.equal(inventory.reconstructsUpstreamCollections, false);
  });

  it("uses Platform as its only upstream phase dependency", () => {
    assert.equal(VisualizationSuiteCertificationMetadata.dependency
      .visualizationSuitePlatformOnly, true);
    const combined = sources.join("\n");
    assert.doesNotMatch(combined, /from ["']\.\/visualizationSuiteManifest/);
    assert.doesNotMatch(combined, /from ["']\.\/visualizationSuiteValidation/);
    assert.doesNotMatch(combined, /from ["']\.\/visualizationSuiteModel/);
    assert.doesNotMatch(combined, /from ["']\.\/visualizationSuiteRegistry/);
    assert.doesNotMatch(combined, /from ["']\.\/visualizationSuiteFoundation/);
    assert.doesNotMatch(combined, /PublicIndex\.ts["']/);
    assert.doesNotMatch(combined, /from ["']\.\.\//);
  });

  it("contains no certification, visualization, or prohibited runtime", () => {
    const metadata = VisualizationSuiteCertificationMetadata;
    assert.ok(Object.isFrozen(VisualizationSuiteCertificationPlatform));
    assert.equal(metadata.certificationEngine, false);
    assert.equal(metadata.runtimeCertification, false);
    assert.equal(metadata.validationEngine, false);
    assert.equal(metadata.rendering, false);
    assert.equal(metadata.visualizationExecution, false);
    assert.equal(metadata.orchestration, false);
    assert.equal(metadata.runtimeComposition, false);
    assert.equal(metadata.networking, false);
    assert.equal(metadata.persistence, false);
    assert.equal(metadata.services, false);
    assert.equal(metadata.factories, false);
  });

  it("provides stable summary and release metadata", () => {
    assert.equal(getVisualizationSuiteCertificationSummary().status,
      "Certified");
    const release = getVisualizationSuiteCertificationReleaseMetadata();
    assert.equal(release.status, "Certified");
    assert.equal(release.readiness, "ReadyForFreeze");
    assert.equal(release.platformReference,
      "EVE-9:6/VisualizationSuitePlatform");
  });
});
