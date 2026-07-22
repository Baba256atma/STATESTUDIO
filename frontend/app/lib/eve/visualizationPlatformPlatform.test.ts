import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PlatformExports from "./visualizationPlatformPlatform.ts";
import {
  VisualizationPlatformPlatform,
  VisualizationPlatformPlatformIdentityMetadata,
  VisualizationPlatformPlatformInventoryMetadata,
  VisualizationPlatformPlatformMetadata,
  VisualizationPlatformPlatformReadinessMetadata,
  getVisualizationPlatformPlatformCount,
  getVisualizationPlatformPlatformReleaseMetadata,
  getVisualizationPlatformPlatformSummary,
} from "./visualizationPlatformPlatform.ts";

const files = Object.freeze([
  "visualizationPlatformPlatform.test.ts", "visualizationPlatformPlatform.ts",
  "visualizationPlatformPlatformCapabilities.ts",
  "visualizationPlatformPlatformCompatibility.ts",
  "visualizationPlatformPlatformGuarantees.ts",
  "visualizationPlatformPlatformInventory.ts",
  "visualizationPlatformPlatformMetadata.ts",
  "visualizationPlatformPlatformTypes.ts",
]);
const sources = files.filter((name) => !name.endsWith(".test.ts"))
  .map((name) => readFileSync(new URL(name, import.meta.url), "utf8"));

describe("EVE-8:6 Visualization Platform Platform", () => {
  it("creates exactly eight Platform files and eight public exports", () => {
    const actual = readdirSync(import.meta.dirname).filter((name) =>
      files.includes(name));
    assert.deepEqual(actual.sort(), [...files].sort());
    assert.deepEqual(Object.keys(PlatformExports).sort(), [
      "VisualizationPlatformPlatform",
      "VisualizationPlatformPlatformIdentityMetadata",
      "VisualizationPlatformPlatformInventoryMetadata",
      "VisualizationPlatformPlatformMetadata",
      "VisualizationPlatformPlatformReadinessMetadata",
      "getVisualizationPlatformPlatformCount",
      "getVisualizationPlatformPlatformReleaseMetadata",
      "getVisualizationPlatformPlatformSummary",
    ].sort());
  });

  it("publishes canonical identity and Certification readiness", () => {
    assert.equal(VisualizationPlatformPlatformIdentityMetadata.id,
      "EVE-8:6/VisualizationPlatformPlatform");
    assert.equal(VisualizationPlatformPlatformIdentityMetadata.namespace,
      "nexora.eve.visualization-platform.platform");
    assert.equal(VisualizationPlatformPlatformReadinessMetadata.status,
      "ReadyForCertification");
  });

  it("publishes canonical six-phase composition through Manifest", () => {
    const { composition, manifest } = VisualizationPlatformPlatform;
    assert.equal(composition.length, 6);
    assert.deepEqual(composition.map(({ phase }) => phase), [
      "Foundation", "Registry", "Model", "Validation", "Manifest", "Platform",
    ]);
    manifest.composition.forEach((entry, index) =>
      assert.equal(composition[index], entry));
    assert.equal(composition[5]!.canonicalReference,
      "EVE-8:6/VisualizationPlatformPlatform");
    assert.ok(composition.every((entry, index) => Object.isFrozen(entry)
      && entry.preservedByReference && entry.deterministicOrder === index + 1));
  });

  it("publishes exact immutable capabilities, guarantees, and compatibility", () => {
    const { capabilities, guarantees, compatibility } =
      VisualizationPlatformPlatform;
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
    const { manifest, inventory } = VisualizationPlatformPlatform;
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
    const inventory = VisualizationPlatformPlatformInventoryMetadata;
    assert.equal(inventory.counts.phaseCount, inventory.phaseComposition.length);
    assert.equal(inventory.counts.capabilityCount, inventory.capabilities.length);
    assert.equal(inventory.counts.guaranteeCount, inventory.guarantees.length);
    assert.equal(inventory.counts.compatibilityCount,
      inventory.compatibility.length);
    assert.equal(inventory.counts.publicSurfaceCount,
      inventory.publicPlatformSurface.length);
    assert.equal(getVisualizationPlatformPlatformCount(),
      inventory.phaseComposition.length);
    assert.equal(inventory.hardcodedAggregateTotals, false);
    assert.equal(inventory.reconstructsUpstreamCollections, false);
  });

  it("uses Manifest as its only upstream phase dependency", () => {
    assert.equal(VisualizationPlatformPlatformMetadata.dependency
      .visualizationPlatformManifestOnly, true);
    const combined = sources.join("\n");
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

  it("contains no platform, visualization, rendering, or prohibited runtime", () => {
    const metadata = VisualizationPlatformPlatformMetadata;
    assert.ok(Object.isFrozen(VisualizationPlatformPlatform));
    assert.equal(metadata.platformExecution, false);
    assert.equal(metadata.rendering, false);
    assert.equal(metadata.visualizationExecution, false);
    assert.equal(metadata.orchestration, false);
    assert.equal(metadata.validationExecution, false);
    assert.equal(metadata.networking, false);
    assert.equal(metadata.persistence, false);
    assert.equal(metadata.services, false);
    assert.equal(metadata.factories, false);
    const combined = sources.join("\n");
    assert.doesNotMatch(combined,
      /from ["'](?:react|next|three|babylon|pixi|d3|chart\.js)/i);
    assert.doesNotMatch(combined,
      /\b(?:fetch|XMLHttpRequest|WebSocket|document|window)\s*[.(]/);
  });

  it("provides stable summary and release metadata", () => {
    assert.equal(getVisualizationPlatformPlatformSummary().status,
      "ReadyForCertification");
    const release = getVisualizationPlatformPlatformReleaseMetadata();
    assert.equal(release.status, "ReadyForCertification");
    assert.equal(release.manifestReference,
      "EVE-8:5/VisualizationPlatformManifest");
  });
});
