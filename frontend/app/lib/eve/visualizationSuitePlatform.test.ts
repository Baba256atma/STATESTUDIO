import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PlatformExports from "./visualizationSuitePlatform.ts";
import {
  VisualizationSuitePlatform,
  VisualizationSuitePlatformIdentityMetadata,
  VisualizationSuitePlatformInventoryMetadata,
  VisualizationSuitePlatformMetadata,
  VisualizationSuitePlatformReadinessMetadata,
  getVisualizationSuitePlatformCount,
  getVisualizationSuitePlatformReleaseMetadata,
  getVisualizationSuitePlatformSummary,
} from "./visualizationSuitePlatform.ts";

const files = Object.freeze([
  "visualizationSuitePlatform.test.ts", "visualizationSuitePlatform.ts",
  "visualizationSuitePlatformCapabilities.ts",
  "visualizationSuitePlatformCompatibility.ts",
  "visualizationSuitePlatformGuarantees.ts",
  "visualizationSuitePlatformInventory.ts",
  "visualizationSuitePlatformMetadata.ts", "visualizationSuitePlatformTypes.ts",
]);
const sources = files.filter((name) => !name.endsWith(".test.ts"))
  .map((name) => readFileSync(new URL(name, import.meta.url), "utf8"));

describe("EVE-9:6 Visualization Suite Platform", () => {
  it("creates exactly eight Platform files and eight public exports", () => {
    const actual = readdirSync(import.meta.dirname).filter((name) =>
      files.includes(name));
    assert.deepEqual(actual.sort(), [...files].sort());
    assert.deepEqual(Object.keys(PlatformExports).sort(), [
      "VisualizationSuitePlatform", "VisualizationSuitePlatformIdentityMetadata",
      "VisualizationSuitePlatformInventoryMetadata",
      "VisualizationSuitePlatformMetadata",
      "VisualizationSuitePlatformReadinessMetadata",
      "getVisualizationSuitePlatformCount",
      "getVisualizationSuitePlatformReleaseMetadata",
      "getVisualizationSuitePlatformSummary",
    ].sort());
  });

  it("publishes canonical identity and Certification readiness", () => {
    assert.equal(VisualizationSuitePlatformIdentityMetadata.id,
      "EVE-9:6/VisualizationSuitePlatform");
    assert.equal(VisualizationSuitePlatformIdentityMetadata.namespace,
      "nexora.eve.visualization-suite.platform");
    assert.equal(VisualizationSuitePlatformReadinessMetadata.status,
      "ReadyForCertification");
  });

  it("publishes canonical six-phase composition through Manifest", () => {
    const { composition, manifest } = VisualizationSuitePlatform;
    assert.equal(composition.length, 6);
    assert.deepEqual(composition.map(({ phase }) => phase), [
      "Foundation", "Registry", "Model", "Validation", "Manifest", "Platform",
    ]);
    manifest.composition.forEach((entry, index) =>
      assert.equal(composition[index], entry));
    assert.equal(composition[5]!.canonicalReference,
      "EVE-9:6/VisualizationSuitePlatform");
    assert.ok(composition.every((entry, index) => Object.isFrozen(entry)
      && entry.preservedByReference && entry.deterministicOrder === index + 1));
  });

  it("publishes exact immutable capabilities, guarantees, and compatibility", () => {
    const { capabilities, guarantees, compatibility } =
      VisualizationSuitePlatform;
    assert.equal(capabilities.length, 10);
    assert.equal(guarantees.length, 12);
    assert.equal(compatibility.length, 8);
    for (const collection of [capabilities, guarantees, compatibility]) {
      assert.ok(Object.isFrozen(collection));
      assert.ok(collection.every((entry, index) => Object.isFrozen(entry)
        && entry.immutable && entry.metadataOnly
        && entry.deterministicOrder === index + 1));
    }
    assert.ok(capabilities.every(({ implementationProvided }) =>
      !implementationProvided));
    assert.ok(guarantees.every(({ guaranteed }) => guaranteed));
    assert.ok(compatibility.every(({ compatible, runtimeVerification }) =>
      compatible && !runtimeVerification));
  });

  it("preserves every Manifest collection by canonical reference", () => {
    const { manifest, inventory } = VisualizationSuitePlatform;
    assert.equal(inventory.manifestInventory, manifest.inventory);
    assert.equal(inventory.manifestComposition, manifest.composition);
    assert.equal(inventory.manifestGuarantees, manifest.guarantees);
    assert.equal(inventory.manifestCompatibility, manifest.compatibility);
    assert.equal(inventory.manifestReadiness, manifest.readiness);
    assert.equal(inventory.manifestReadinessDeclarations,
      manifest.readinessDeclarations);
    assert.equal(inventory.manifestMetadata, manifest.metadata);
    assert.equal(inventory.validationInventory,
      manifest.inventory.validationInventory);
  });

  it("derives all Platform inventory counts dynamically", () => {
    const inventory = VisualizationSuitePlatformInventoryMetadata;
    assert.equal(inventory.counts.phaseCount, inventory.phaseComposition.length);
    assert.equal(inventory.counts.capabilityCount, inventory.capabilities.length);
    assert.equal(inventory.counts.guaranteeCount, inventory.guarantees.length);
    assert.equal(inventory.counts.compatibilityCount,
      inventory.compatibility.length);
    assert.equal(inventory.counts.publicSurfaceCount,
      inventory.publicPlatformSurface.length);
    assert.equal(getVisualizationSuitePlatformCount(),
      inventory.phaseComposition.length);
    assert.equal(inventory.hardcodedAggregateTotals, false);
    assert.equal(inventory.reconstructsUpstreamCollections, false);
  });

  it("uses Manifest as its only upstream phase dependency", () => {
    assert.equal(VisualizationSuitePlatformMetadata.dependency
      .visualizationSuiteManifestOnly, true);
    const combined = sources.join("\n");
    assert.doesNotMatch(combined, /from ["']\.\/visualizationSuiteValidation/);
    assert.doesNotMatch(combined, /from ["']\.\/visualizationSuiteModel/);
    assert.doesNotMatch(combined, /from ["']\.\/visualizationSuiteRegistry/);
    assert.doesNotMatch(combined, /from ["']\.\/visualizationSuiteFoundation/);
    assert.doesNotMatch(combined, /PublicIndex\.ts["']/);
    assert.doesNotMatch(combined, /from ["']\.\.\//);
  });

  it("contains no platform, visualization, or prohibited runtime", () => {
    const metadata = VisualizationSuitePlatformMetadata;
    assert.ok(Object.isFrozen(VisualizationSuitePlatform));
    assert.equal(metadata.platformExecution, false);
    assert.equal(metadata.rendering, false);
    assert.equal(metadata.visualizationExecution, false);
    assert.equal(metadata.orchestration, false);
    assert.equal(metadata.validationExecution, false);
    assert.equal(metadata.runtimeComposition, false);
    assert.equal(metadata.networking, false);
    assert.equal(metadata.persistence, false);
    assert.equal(metadata.services, false);
    assert.equal(metadata.factories, false);
  });

  it("provides stable summary and release metadata", () => {
    assert.equal(getVisualizationSuitePlatformSummary().status,
      "ReadyForCertification");
    const release = getVisualizationSuitePlatformReleaseMetadata();
    assert.equal(release.status, "ReadyForCertification");
    assert.equal(release.manifestReference,
      "EVE-9:5/VisualizationSuiteManifest");
  });
});
