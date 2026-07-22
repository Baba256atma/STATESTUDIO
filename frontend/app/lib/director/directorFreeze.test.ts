import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicFreeze from "./directorFreeze.ts";
import {
  DirectorFreeze, DirectorFreezeCompatibility, DirectorFreezeLocks,
  DirectorFreezeMetadata, DirectorFreezeRegistry,
  getDirectorFreezeLockStatus, getDirectorFreezeReadiness,
  getDirectorFreezeSummary,
} from "./directorFreeze.ts";

const FILES = Object.freeze([
  "directorFreezeTypes.ts", "directorFreezeRegistry.ts",
  "directorFreezeLocks.ts", "directorFreezeCompatibility.ts",
  "directorFreezeMetadata.ts", "directorFreeze.ts",
  "directorFreezeExports.ts", "directorFreeze.test.ts",
]);

describe("DIRECTOR-1:8 Director Freeze", () => {
  it("has canonical freeze identity, status, and readiness", () => {
    assert.equal(DirectorFreezeMetadata.freezeId, "DIRECTOR-1:8/DirectorFreeze");
    assert.equal(DirectorFreezeMetadata.freezeVersion, "1.0.0");
    assert.equal(DirectorFreezeMetadata.freezeNamespace, "nexora.director.freeze");
    assert.equal(DirectorFreezeMetadata.layer, "Director");
    assert.equal(DirectorFreezeMetadata.freezeStatus, "Frozen");
    assert.equal(getDirectorFreezeReadiness(), "ReadyForPublicIndex");
  });

  it("adds exactly eight Freeze files and stable public exports", () => {
    const present = readdirSync(import.meta.dirname);
    assert.ok(FILES.every((file) => present.includes(file)));
    assert.deepEqual(Object.keys(PublicFreeze).sort(), [...DirectorFreeze.publicExports].sort());
  });

  it("publishes the immutable architectural lock", () => {
    assert.equal(DirectorFreezeLocks.length, 1);
    assert.equal(DirectorFreezeLocks[0]!.lockId, "DIRECTOR-1-LOCKED");
    assert.equal(getDirectorFreezeLockStatus(), "Locked");
    assert.equal(DirectorFreezeLocks[0]!.runtimeLocking, false);
    assert.ok(Object.isFrozen(DirectorFreezeLocks));
    assert.ok(Object.isFrozen(DirectorFreezeLocks[0]));
  });

  it("preserves the canonical architecture chain", () => {
    assert.deepEqual(DirectorFreezeRegistry.entries.map(({ architectureLayer }) => architectureLayer), [
      "Certification", "Platform", "Manifest", "Validation", "Model",
      "Registry", "Foundation",
    ]);
    assert.ok(DirectorFreezeRegistry.entries.every((entry, index) => entry.deterministicOrder === index + 1));
    assert.ok(DirectorFreezeRegistry.entries.every(({ copiesMetadata }) => !copiesMetadata));
    assert.equal(DirectorFreezeRegistry.inventoryPreservedByReference, true);
  });

  it("publishes Certification-derived compatibility", () => {
    assert.deepEqual(DirectorFreezeCompatibility.map(({ name }) => name), [
      "CertificationCompatibility", "PlatformCompatibility",
      "ManifestCompatibility", "ValidationCompatibility",
      "RegistryCompatibility", "FoundationCompatibility",
      "PublicIndexCompatibility", "ForwardCompatibility",
    ]);
    assert.ok(DirectorFreezeCompatibility.every((entry, index) => entry.deterministicOrder === index + 1));
    assert.ok(DirectorFreezeCompatibility.every(({ derivedFromCertification }) => derivedFromCertification));
  });

  it("consumes only Certification and imports no prohibited modules", () => {
    assert.equal(DirectorFreezeMetadata.dependency.certificationOnly, true);
    for (const file of FILES.filter((name) => !name.endsWith(".test.ts"))) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      assert.doesNotMatch(source, /from ["']\.\/director(?:Foundation|Registry|Model|Validation|Manifest|Platform)/);
      assert.doesNotMatch(source, /from ["'](?:react|three|@react|babylon|eve)/i);
    }
  });

  it("is immutable, deterministic, and runtime-free", () => {
    assert.ok(Object.isFrozen(DirectorFreeze));
    assert.ok(Object.isFrozen(DirectorFreezeMetadata));
    assert.ok(Object.isFrozen(DirectorFreezeRegistry));
    assert.ok(Object.isFrozen(DirectorFreezeCompatibility));
    assert.ok(Object.isFrozen(getDirectorFreezeSummary()));
    assert.equal(DirectorFreeze.services, false);
    assert.equal(DirectorFreeze.factories, false);
    assert.equal(DirectorFreeze.execution, false);
    assert.equal(DirectorFreeze.orchestration, false);
    assert.equal(DirectorFreeze.rendering, false);
  });
});
