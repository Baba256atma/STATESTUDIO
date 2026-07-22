import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicCertification from "./directorCertification.ts";
import {
  DirectorCertification, DirectorCertificationCompatibility,
  DirectorCertificationCriteria, DirectorCertificationGates,
  DirectorCertificationMetadata, getDirectorCertificationReadiness,
  getDirectorCertificationStatus, getDirectorCertificationSummary,
} from "./directorCertification.ts";

const FILES = Object.freeze([
  "directorCertificationTypes.ts", "directorCertificationCriteria.ts",
  "directorCertificationGates.ts", "directorCertificationCompatibility.ts",
  "directorCertificationMetadata.ts", "directorCertification.ts",
  "directorCertificationExports.ts", "directorCertification.test.ts",
]);

describe("DIRECTOR-1:7 Director Certification", () => {
  it("has canonical certification identity, status, and readiness", () => {
    assert.equal(DirectorCertificationMetadata.certificationId, "DIRECTOR-1:7/DirectorCertification");
    assert.equal(DirectorCertificationMetadata.certificationVersion, "1.0.0");
    assert.equal(DirectorCertificationMetadata.certificationNamespace, "nexora.director.certification");
    assert.equal(DirectorCertificationMetadata.layer, "Director");
    assert.equal(getDirectorCertificationStatus(), "Certified");
    assert.equal(getDirectorCertificationReadiness(), "ReadyForFreeze");
  });

  it("adds exactly eight Certification files and stable public exports", () => {
    const present = readdirSync(import.meta.dirname);
    assert.ok(FILES.every((file) => present.includes(file)));
    assert.deepEqual(Object.keys(PublicCertification).sort(), [...DirectorCertification.publicExports].sort());
  });

  it("publishes complete deterministic immutable criteria", () => {
    assert.equal(DirectorCertificationCriteria.length, 18);
    assert.equal(DirectorCertificationMetadata.criteriaCount, DirectorCertificationCriteria.length);
    assert.ok(DirectorCertificationCriteria.every((entry, index) => entry.deterministicOrder === index + 1));
    assert.ok(DirectorCertificationCriteria.every(Object.isFrozen));
  });

  it("publishes passed deterministic immutable gates", () => {
    assert.equal(DirectorCertificationGates.length, 16);
    assert.equal(DirectorCertificationMetadata.gateCount, DirectorCertificationGates.length);
    assert.ok(DirectorCertificationGates.every((entry, index) => entry.deterministicOrder === index + 1));
    assert.ok(DirectorCertificationGates.every(({ status, result, executes }) => status === "Certified" && result === "Passed" && !executes));
  });

  it("derives compatibility and inventories only from Platform", () => {
    assert.deepEqual(DirectorCertificationCompatibility.map(({ name }) => name), [
      "FoundationCompatibility", "RegistryCompatibility", "ModelCompatibility",
      "ValidationCompatibility", "ManifestCompatibility", "PlatformCompatibility",
      "ForwardCompatibility",
    ]);
    assert.equal(DirectorCertificationMetadata.compatibilityCount, DirectorCertificationCompatibility.length);
    assert.ok(DirectorCertificationCompatibility.every(({ derivedFromPlatform }) => derivedFromPlatform));
    assert.equal(DirectorCertificationMetadata.certifiedInventory.derivedFromManifest, true);
    assert.equal(DirectorCertificationMetadata.canonicalInventoryRuleCompliant, true);
  });

  it("certifies the canonical architecture chain", () => {
    assert.deepEqual(DirectorCertificationMetadata.architectureChain.map(({ phase }) => phase), [
      "Platform", "Manifest", "Validation", "Model", "Registry", "Foundation",
    ]);
    assert.equal(getDirectorCertificationSummary().criteriaCount, DirectorCertificationCriteria.length);
  });

  it("consumes only Platform and imports no prohibited modules", () => {
    assert.equal(DirectorCertificationMetadata.dependency.platformOnly, true);
    for (const file of FILES.filter((name) => !name.endsWith(".test.ts"))) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      assert.doesNotMatch(source, /from ["']\.\/director(?:Foundation|Registry|Model|Validation|Manifest)/);
      assert.doesNotMatch(source, /from ["'](?:react|three|@react|babylon|eve)/i);
    }
  });

  it("is immutable and has no runtime certification facilities", () => {
    assert.ok(Object.isFrozen(DirectorCertification));
    assert.ok(Object.isFrozen(DirectorCertificationMetadata));
    assert.ok(Object.isFrozen(DirectorCertificationCriteria));
    assert.ok(Object.isFrozen(DirectorCertificationGates));
    assert.equal(DirectorCertification.services, false);
    assert.equal(DirectorCertification.factories, false);
    assert.equal(DirectorCertification.certificationEngine, false);
    assert.equal(DirectorCertification.execution, false);
    assert.equal(DirectorCertification.rendering, false);
  });
});
