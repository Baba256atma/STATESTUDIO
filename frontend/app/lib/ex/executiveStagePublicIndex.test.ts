/**
 * EX-1:9 — Executive Stage Public Index Tests.
 *
 * Deterministic coverage for the sole Executive Stage consumer entry point.
 * No mocks. No randomness. No network. No databases. No React.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import * as PublicIndexModule from "./executiveStagePublicIndex.ts";
import executiveStagePublicIndexDefault, {
  consumerDeclaration,
  executiveStagePublicIndex,
  publicApiCount,
  publicApiSurface,
  publicIndexId,
  publicIndexName,
  publicIndexNamespace,
  publicIndexStatus,
  publicIndexVersion,
  publicRegistry,
  releaseInformation,
} from "./executiveStagePublicIndex.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const EX19_FILES = Object.freeze([
  "executiveStagePublicIndex.ts",
  "executiveStagePublicIndex.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "publicIndexId",
  "publicIndexName",
  "publicIndexVersion",
  "publicIndexNamespace",
  "publicIndexStatus",
  "publicApiSurface",
  "publicApiCount",
  "releaseInformation",
  "consumerDeclaration",
  "publicRegistry",
  "executiveStagePublicIndex",
  "default",
] as const);

const EXPECTED_NAMESPACE_SECTIONS = Object.freeze([
  "Identity",
  "Public API",
  "Registry",
  "Platform",
  "Compatibility",
  "Consumer",
  "Metrics",
  "Release Information",
  "Metadata",
] as const);

describe("EX-1:9 Executive Stage Public Index", () => {
  it("creates exactly two Public Index files", () => {
    assert.equal(EX19_FILES.length, 2);
    const present = readdirSync(HERE);
    for (const file of EX19_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.equal(
      present.filter((name) => EX19_FILES.includes(name)).length,
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
    assert.equal(publicIndexId, "EX-1:9/ExecutiveStagePublicIndex");
    assert.equal(publicIndexName, "Executive Stage Public Index");
    assert.equal(
      publicIndexNamespace,
      "nexora.executive-experience.executive-stage.public-index",
    );
    assert.equal(publicIndexVersion, "1.0.0");
    assert.equal(
      publicIndexStatus,
      "Released · Certified · Frozen · Stable",
    );

    assert.equal(executiveStagePublicIndex.id, publicIndexId);
    assert.equal(executiveStagePublicIndex.status, publicIndexStatus);
    assert.equal(executiveStagePublicIndex.readiness, "ReadyForConsumer");
    assert.equal(executiveStagePublicIndex.released, true);
    assert.equal(executiveStagePublicIndex.certified, true);
    assert.equal(executiveStagePublicIndex.frozen, true);
    assert.equal(executiveStagePublicIndex.stable, true);
    assert.equal(
      executiveStagePublicIndex.lockIdentifier,
      "EX-1-EXECUTIVE-STAGE-LOCKED",
    );
    assert.equal(
      executiveStagePublicIndex.freezeReference,
      "EX-1:8/ExecutiveStageFreeze",
    );
    assert.equal(executiveStagePublicIndexDefault, executiveStagePublicIndex);
  });

  it("publishes exactly nine namespace sections in canonical order", () => {
    assert.equal(executiveStagePublicIndex.namespaceSections.length, 9);
    assert.deepEqual(
      executiveStagePublicIndex.namespaceSections.map((item) => item.section),
      [...EXPECTED_NAMESPACE_SECTIONS],
    );
    assert.deepEqual(
      executiveStagePublicIndex.namespaceSections.map((item) => item.order),
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
    );
    assert.equal(publicRegistry.namespaceSections.length, 9);
  });

  it("derives Public API Registry dynamically from Freeze without hard-coded counts", () => {
    assert.equal(publicApiCount, publicApiSurface.length);
    assert.equal(
      executiveStagePublicIndex.publicApiCount,
      publicApiSurface.length,
    );
    assert.equal(publicRegistry.publicApiCount, publicApiSurface.length);
    assert.ok(publicApiSurface.length > 0);
    assert.ok(publicApiSurface.every((item) => item.metadataOnly === true));
    assert.ok(publicApiSurface.every((item) => item.executable === false));
    assert.ok(publicApiSurface.some((item) => item.kind === "Contract"));
    assert.ok(publicApiSurface.some((item) => item.kind === "Service"));
    assert.ok(publicApiSurface.some((item) => item.kind === "Compatibility"));
    assert.ok(publicApiSurface.some((item) => item.kind === "Metadata"));
    assert.ok(publicApiSurface.some((item) => item.kind === "Identity"));
    assert.equal(
      new Set(publicApiSurface.map((item) => item.apiIdentifier)).size,
      publicApiSurface.length,
    );
    assert.equal(publicRegistry.derivedFromFreezeOnly, true);
    assert.equal(publicRegistry.readOnly, true);
  });

  it("declares itself as the sole consumer entry point", () => {
    assert.equal(consumerDeclaration.declaration, "Sole Consumer Entry Point");
    assert.equal(consumerDeclaration.isSoleConsumerEntryPoint, true);
    assert.equal(
      consumerDeclaration.dependency,
      "executiveStageFreeze.ts",
    );
    assert.equal(
      consumerDeclaration.directArchitecturalImportsPermitted,
      false,
    );
    assert.equal(consumerDeclaration.prohibitedDirectImports.length, 8);
    assert.equal(executiveStagePublicIndex.soleConsumerEntry, true);
    assert.ok(consumerDeclaration.consumers.includes("Manager"));
    assert.ok(consumerDeclaration.consumers.includes("Executive Journal"));
  });

  it("republishes Freeze release information and remains non-executable", () => {
    assert.equal(releaseInformation.releaseStatus, publicIndexStatus);
    assert.equal(releaseInformation.readiness, "ReadyForConsumer");
    assert.equal(
      releaseInformation.lockIdentifier,
      "EX-1-EXECUTIVE-STAGE-LOCKED",
    );
    assert.equal(
      releaseInformation.sourceFreeze,
      "EX-1:8/ExecutiveStageFreeze",
    );
    assert.deepEqual(
      [...releaseInformation.releaseStatuses],
      ["Released", "Certified", "Frozen", "Stable"],
    );

    const index = executiveStagePublicIndex;
    assert.equal(Object.isFrozen(index), true);
    assert.equal(Object.isFrozen(publicApiSurface), true);
    assert.equal(index.freezeOnlyDependency, true);
    assert.equal(index.republishesOnly, true);
    assert.equal(index.implementsRendering, false);
    assert.equal(index.executesRuntimeLogic, false);
    assert.equal(index.performsValidation, false);
    assert.equal(index.modifiesPlatformState, false);
    assert.equal(index.invokesAi, false);
    assert.equal(index.exposesInternalModules, false);
    assert.equal(index.bypassesFreeze, false);
    assert.equal(index.guarantees.length, 8);
  });

  it("imports only the Freeze artifact and has zero prohibited imports", () => {
    const source = readFileSync(
      `${HERE}/executiveStagePublicIndex.ts`,
      "utf8",
    );
    const imports = [
      ...source.matchAll(/from ["'](\.\/[^"']+)["']/g),
    ].map((match) => match[1]);

    assert.deepEqual(imports, ["./executiveStageFreeze.ts"]);
    assert.doesNotMatch(source, /from ["']\.\.\//);
    assert.doesNotMatch(source, /from ["']react/);
    assert.doesNotMatch(source, /from ["']next/);
    assert.doesNotMatch(
      source,
      /from ["']\.\/executiveStage(Types|Registry|Model|Validation|Manifest|Platform|Certification)\.ts["']/,
    );
    assert.doesNotMatch(
      source,
      /from ["']\.\/executiveStage(ArchitecturalLocks|FrozenBaselines|Compatibility|Extensions|ReleaseMetadata|FreezeRegistry)\.ts["']/,
    );
    assert.match(source, /from ["']\.\/executiveStageFreeze\.ts["']/);
    assert.doesNotMatch(source, /\b(fetch|axios|http\.request)\b/);
    assert.doesNotMatch(source, /\b(setTimeout|setInterval)\b/);
    assert.doesNotMatch(source, /\bclass\b/);
    assert.doesNotMatch(source, /\basync\s+function\b/);
    assert.doesNotMatch(source, /\bDate\.now\b/);
  });

  it("preserves deterministic metadata and canonical baselines", () => {
    assert.deepEqual(
      [...executiveStagePublicIndex.upstreamDependencies],
      ["EX-1:8 — Executive Stage Freeze"],
    );
    assert.deepEqual(
      [...executiveStagePublicIndex.compositionLayers],
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
    assert.equal(
      executiveStagePublicIndex.namespaceSections.find(
        (item) => item.section === "Metrics",
      )?.value.upstreamDependencyCount,
      1,
    );
    assert.equal(
      executiveStagePublicIndex.namespaceSections.find(
        (item) => item.section === "Metrics",
      )?.value.consumerEntryPointCount,
      1,
    );
  });
});
