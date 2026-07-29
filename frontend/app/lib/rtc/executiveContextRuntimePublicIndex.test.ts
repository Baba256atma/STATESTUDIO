/**
 * RTC-1:9 — Executive Context Runtime Public Index Tests.
 *
 * Deterministic coverage for the sole Runtime consumer entry point.
 * No mocks. No randomness. No network. No databases.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import * as PublicIndexModule from "./executiveContextRuntimePublicIndex.ts";
import {
  executiveContextRuntimePublicIndex,
  executiveContextRuntimePublicIndexMetadata,
  publicApiCount,
  publicApiSurface,
  publicIndexId,
  publicIndexName,
  publicIndexNamespace,
  publicIndexReadiness,
  publicIndexStatus,
  publicIndexVersion,
  publicNamespaceSections,
  publicReleaseMetadata,
} from "./executiveContextRuntimePublicIndex.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const RTC19_FILES = Object.freeze([
  "executiveContextRuntimePublicIndex.ts",
  "executiveContextRuntimePublicIndex.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "publicIndexId",
  "publicIndexName",
  "publicIndexNamespace",
  "publicIndexVersion",
  "publicIndexStatus",
  "publicIndexReadiness",
  "publicApiSurface",
  "publicApiCount",
  "publicNamespaceSections",
  "publicReleaseMetadata",
  "executiveContextRuntimePublicIndexMetadata",
  "executiveContextRuntimePublicIndex",
] as const);

const EXPECTED_NAMESPACE_SECTIONS = Object.freeze([
  "Identity",
  "Public Entry",
  "Dependencies",
  "Public API Registry",
  "Compatibility",
  "Architecture",
  "Release Status",
  "Readiness",
  "Release Information",
] as const);

describe("RTC-1:9 Executive Context Runtime Public Index", () => {
  it("creates exactly two Public Index files", () => {
    assert.equal(RTC19_FILES.length, 2);
    const present = readdirSync(HERE);
    for (const file of RTC19_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.equal(
      present.filter((name) => RTC19_FILES.includes(name)).length,
      2,
    );
  });

  it("exposes exactly twelve public exports", () => {
    assert.deepEqual(
      Object.keys(PublicIndexModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(PublicIndexModule).length, 12);
    for (const exportName of REQUIRED_PUBLIC_EXPORTS) {
      assert.ok(
        exportName in PublicIndexModule,
        `missing public export ${exportName}`,
      );
    }
  });

  it("publishes canonical identity, status, and ReadyForConsumer readiness", () => {
    assert.equal(
      publicIndexId,
      "RTC-1:9/ExecutiveContextRuntimePublicIndex",
    );
    assert.equal(
      publicIndexName,
      "Executive Context Runtime Public Index",
    );
    assert.equal(
      publicIndexNamespace,
      "nexora.runtime.executive-context.public-index",
    );
    assert.equal(publicIndexVersion, "1.0.0");
    assert.equal(
      publicIndexStatus,
      "Released · Certified · Frozen · Stable",
    );
    assert.equal(publicIndexReadiness, "ReadyForConsumer");

    assert.equal(executiveContextRuntimePublicIndex.id, publicIndexId);
    assert.equal(executiveContextRuntimePublicIndex.status, publicIndexStatus);
    assert.equal(
      executiveContextRuntimePublicIndex.readiness,
      "ReadyForConsumer",
    );
    assert.equal(executiveContextRuntimePublicIndex.released, true);
    assert.equal(executiveContextRuntimePublicIndex.certified, true);
    assert.equal(executiveContextRuntimePublicIndex.frozen, true);
    assert.equal(executiveContextRuntimePublicIndex.stable, true);
    assert.equal(
      executiveContextRuntimePublicIndex.lockIdentifier,
      "RTC-1-EXECUTIVE-CONTEXT-RUNTIME-LOCKED",
    );
    assert.equal(
      executiveContextRuntimePublicIndex.freezeReference,
      "RTC-1:8/ExecutiveContextRuntimeFreeze",
    );
  });

  it("publishes exactly nine namespace sections in canonical order", () => {
    assert.equal(publicNamespaceSections.length, 9);
    assert.deepEqual(
      publicNamespaceSections.map((item) => item.section),
      [...EXPECTED_NAMESPACE_SECTIONS],
    );
    assert.deepEqual(
      publicNamespaceSections.map((item) => item.order),
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
    );
    assert.equal(
      executiveContextRuntimePublicIndexMetadata.namespaceSectionCount,
      9,
    );
  });

  it("derives Public API Registry dynamically from Freeze without hard-coded counts", () => {
    assert.equal(publicApiCount, publicApiSurface.length);
    assert.equal(
      executiveContextRuntimePublicIndex.publicApiCount,
      publicApiSurface.length,
    );
    assert.ok(publicApiSurface.length > 0);
    assert.ok(
      publicApiSurface.every((item) => item.metadataOnly === true),
    );
    assert.ok(
      publicApiSurface.every((item) => item.executable === false),
    );
    assert.ok(
      publicApiSurface.some((item) => item.kind === "Contract"),
    );
    assert.ok(
      publicApiSurface.some((item) => item.kind === "Service"),
    );
    assert.ok(
      publicApiSurface.some((item) => item.kind === "Compatibility"),
    );
    assert.ok(
      publicApiSurface.some((item) => item.kind === "ReleaseMetadata"),
    );
    assert.ok(
      publicApiSurface.some((item) => item.kind === "RuntimeDescriptor"),
    );
    assert.equal(
      new Set(publicApiSurface.map((item) => item.apiIdentifier)).size,
      publicApiSurface.length,
    );
  });

  it("republishes Freeze release metadata and compatibility", () => {
    assert.equal(publicReleaseMetadata.releaseVersion, "1.0.0");
    assert.equal(publicReleaseMetadata.architectureVersion, "NPA-T vNext");
    assert.equal(
      publicReleaseMetadata.lockIdentifier,
      "RTC-1-EXECUTIVE-CONTEXT-RUNTIME-LOCKED",
    );
    assert.equal(
      publicReleaseMetadata.sourceFreeze,
      "RTC-1:8/ExecutiveContextRuntimeFreeze",
    );
    assert.deepEqual(
      [...publicReleaseMetadata.releaseStatuses],
      ["Released", "Certified", "Frozen", "Stable"],
    );

    const { compatibility } = executiveContextRuntimePublicIndex;
    assert.equal(compatibility.declarationCount, 8);
    assert.ok(
      compatibility.targets.includes("Executive Journal Runtime"),
    );
    assert.ok(
      compatibility.targets.includes("Executive Experience modules"),
    );
    assert.equal(compatibility.immutableForRelease, true);
  });

  it("is Freeze-only republish with zero prohibited behaviors", () => {
    const index = executiveContextRuntimePublicIndex;
    assert.equal(Object.isFrozen(index), true);
    assert.equal(Object.isFrozen(publicApiSurface), true);
    assert.equal(Object.isFrozen(publicNamespaceSections), true);

    assert.equal(index.soleConsumerEntry, true);
    assert.equal(index.freezeOnlyDependency, true);
    assert.equal(index.republishesOnly, true);
    assert.equal(index.metadataOnly, true);
    assert.equal(index.createsRuntimeContexts, false);
    assert.equal(index.executesRuntimeLogic, false);
    assert.equal(index.performsValidation, false);
    assert.equal(index.renderingBehavior, false);
    assert.equal(index.invokesAi, false);
    assert.equal(index.exposesInternalPhases, false);
    assert.equal(index.bypassesFreeze, false);
    assert.equal(index.reactBehavior, false);
    assert.equal(index.nextJsBehavior, false);

    assert.equal(
      index.consumerEntry.directArchitecturalImportsPermitted,
      false,
    );
    assert.equal(index.consumerEntry.prohibitedDirectImports.length, 8);
    assert.equal(index.guarantees.length, 8);
    assert.ok(index.guarantees.includes("Freeze-only dependency"));
  });

  it("imports only the Freeze artifact and has zero prohibited imports", () => {
    const source = readFileSync(
      new URL("./executiveContextRuntimePublicIndex.ts", import.meta.url),
      "utf8",
    );
    const imports = [
      ...source.matchAll(/from ["'](\.\/[^"']+)["']/g),
    ].map((match) => match[1]);

    assert.deepEqual(imports, ["./executiveContextRuntimeFreeze.ts"]);
    assert.doesNotMatch(source, /from ["']\.\.\//);
    assert.doesNotMatch(source, /from ["']react/);
    assert.doesNotMatch(source, /from ["']next/);
    assert.doesNotMatch(
      source,
      /from ["']\.\/executiveContextRuntime(Foundation|Registry|Model|Validation|Manifest|Platform|Certification)\.ts["']/,
    );
    assert.doesNotMatch(
      source,
      /from ["']\.\/executiveContext(FreezeLock|FreezeBaselines|FreezeCompatibility|FreezePublicApi|FreezeMetadata|FreezeManifest|Platform|Certification|Manifest|Validation)/,
    );
    assert.match(
      source,
      /from ["']\.\/executiveContextRuntimeFreeze\.ts["']/,
    );
    assert.doesNotMatch(source, /\b(fetch|axios|http\.request)\b/);
    assert.doesNotMatch(source, /\b(setTimeout|setInterval)\b/);
    assert.doesNotMatch(source, /\bclass\b/);
    assert.doesNotMatch(source, /\basync\s+function\b/);
    assert.doesNotMatch(source, /\bDate\.now\b/);
  });

  it("preserves deterministic metadata and canonical baselines", () => {
    assert.equal(
      executiveContextRuntimePublicIndexMetadata.id,
      publicIndexId,
    );
    assert.equal(
      executiveContextRuntimePublicIndexMetadata.readiness,
      "ReadyForConsumer",
    );
    assert.equal(
      executiveContextRuntimePublicIndexMetadata.freezeDependencyCount,
      1,
    );
    assert.equal(
      executiveContextRuntimePublicIndexMetadata.publicApiCount,
      publicApiCount,
    );
    assert.equal(
      executiveContextRuntimePublicIndexMetadata.namespaceSectionCount,
      9,
    );
    assert.deepEqual(
      [...executiveContextRuntimePublicIndex.upstreamDependencies],
      ["RTC-1:8 — Executive Context Runtime Freeze"],
    );
    assert.deepEqual(
      [...executiveContextRuntimePublicIndex.compositionLayers],
      [
        "Foundation",
        "Registry",
        "Model",
        "Validation",
        "Manifest",
        "Platform",
        "Certification",
        "Freeze",
        "Public Index",
      ],
    );
  });
});
