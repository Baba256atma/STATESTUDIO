import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicPlatform from "./directorPlatform.ts";
import {
  DirectorPlatform, DirectorPlatformCompatibility,
  DirectorPlatformComposition, DirectorPlatformMetadata,
  DirectorPlatformRegistry, getDirectorPlatformInventory,
  getDirectorPlatformReadiness, getDirectorPlatformSummary,
} from "./directorPlatform.ts";

const FILES = Object.freeze([
  "directorPlatformTypes.ts", "directorPlatformComposition.ts",
  "directorPlatformCompatibility.ts", "directorPlatformMetadata.ts",
  "directorPlatformRegistry.ts", "directorPlatform.ts",
  "directorPlatformExports.ts", "directorPlatform.test.ts",
]);

describe("DIRECTOR-1:6 Director Platform", () => {
  it("has canonical platform identity and readiness", () => {
    const identity = DirectorPlatformMetadata.identity;
    assert.equal(identity.platformId, "DIRECTOR-1:6/DirectorPlatform");
    assert.equal(identity.platformVersion, "1.0.0");
    assert.equal(identity.namespace, "nexora.director.platform");
    assert.equal(identity.layer, "Director");
    assert.equal(identity.status, "Platform");
    assert.equal(identity.readiness, "ReadyForCertification");
  });

  it("adds exactly eight Platform files and stable public exports", () => {
    const present = readdirSync(import.meta.dirname);
    assert.ok(FILES.every((file) => present.includes(file)));
    assert.deepEqual(Object.keys(PublicPlatform).sort(), [...DirectorPlatform.publicExports].sort());
  });

  it("publishes the canonical architecture chain", () => {
    assert.deepEqual(DirectorPlatformComposition.architectureChain.map(({ phase }) => phase), [
      "Platform", "Manifest", "Validation", "Model", "Registry", "Foundation",
    ]);
    assert.ok(DirectorPlatformComposition.architectureChain.every(
      (entry, index) => entry.deterministicOrder === index + 1,
    ));
  });

  it("derives all inventory values through Manifest", () => {
    assert.equal(DirectorPlatformComposition.inventories, DirectorPlatformComposition.manifest.inventories);
    assert.equal(DirectorPlatformComposition.manifestInventory.derived, true);
    assert.equal(DirectorPlatformComposition.aggregateInventory.derivedFromManifest, true);
    assert.equal(getDirectorPlatformInventory(), DirectorPlatformComposition.aggregateInventory);
  });

  it("maintains registry, compatibility, and readiness integrity", () => {
    assert.deepEqual(DirectorPlatformRegistry.entries.map(({ architectureLayer }) => architectureLayer), [
      "Foundation", "Registry", "Model", "Validation", "Manifest",
    ]);
    assert.ok(DirectorPlatformRegistry.entries.every((entry, index) => entry.deterministicOrder === index + 1));
    assert.ok(DirectorPlatformCompatibility.every((entry, index) => entry.compatible && entry.deterministicOrder === index + 1));
    assert.deepEqual(getDirectorPlatformReadiness().map(({ name }) => name), [
      "ReadyForCertification", "ReadyForPlatform", "ValidationComplete",
      "RegistryComplete", "FoundationComplete", "ModelComplete",
    ]);
  });

  it("consumes only Manifest and imports no prohibited modules", () => {
    assert.equal(DirectorPlatformComposition.dependency.manifestOnly, true);
    for (const file of FILES.filter((name) => !name.endsWith(".test.ts"))) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      assert.doesNotMatch(source, /from ["']\.\/director(?:Foundation|Registry|Model|Validation)/);
      assert.doesNotMatch(source, /from ["'](?:react|three|@react|babylon|eve)/i);
    }
  });

  it("is immutable, deterministic, and runtime-free", () => {
    assert.ok(Object.isFrozen(DirectorPlatform));
    assert.ok(Object.isFrozen(DirectorPlatformComposition));
    assert.ok(Object.isFrozen(DirectorPlatformMetadata));
    assert.ok(Object.isFrozen(DirectorPlatformRegistry));
    assert.ok(Object.isFrozen(getDirectorPlatformSummary()));
    assert.equal(DirectorPlatform.services, false);
    assert.equal(DirectorPlatform.factories, false);
    assert.equal(DirectorPlatform.execution, false);
    assert.equal(DirectorPlatform.orchestrationEngine, false);
    assert.equal(DirectorPlatform.rendering, false);
  });
});
