import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicIndex from "./directorPublicIndex.ts";
import {
  DirectorPlatformPublicFoundation, DirectorPublicApiRegistry,
  DirectorPublicCertificationStatus, DirectorPublicFreezeStatus,
  DirectorPublicIndexId, DirectorPublicIndexNamespace,
  DirectorPublicIndexVersion, DirectorPublicReleaseStatus,
  getDirectorPublicApiCount, getDirectorPublicReleaseMetadata,
  getDirectorPublicSummary,
} from "./directorPublicIndex.ts";

describe("DIRECTOR-1:9 Director Public Index", () => {
  it("adds exactly the two requested Public Index files", () => {
    const files = readdirSync(import.meta.dirname).filter((name) =>
      name.startsWith("directorPublicIndex"));
    assert.deepEqual(files.sort(), [
      "directorPublicIndex.test.ts", "directorPublicIndex.ts",
    ]);
  });

  it("has canonical released, certified, frozen identity", () => {
    assert.equal(DirectorPublicIndexId, "DIRECTOR-1:9/DirectorPublicIndex");
    assert.equal(DirectorPublicIndexVersion, "1.0.0");
    assert.equal(DirectorPublicIndexNamespace, "nexora.director.public-index");
    assert.equal(DirectorPublicReleaseStatus, "Released");
    assert.equal(DirectorPublicCertificationStatus, "Certified");
    assert.equal(DirectorPublicFreezeStatus, "Frozen");
    assert.equal(getDirectorPublicSummary().stability, "Stable");
    assert.equal(getDirectorPublicSummary().readiness, "ReadyForConsumer");
  });

  it("exports exactly twelve stable public symbols", () => {
    assert.equal(Object.keys(PublicIndex).length, 12);
    assert.deepEqual(
      Object.keys(PublicIndex).sort(),
      [...DirectorPlatformPublicFoundation.publicExports].sort(),
    );
  });

  it("publishes exactly nine ordered namespace sections", () => {
    assert.deepEqual(
      DirectorPlatformPublicFoundation.namespace.map(({ name }) => name),
      ["foundation", "registry", "model", "validation", "manifest",
        "platform", "certification", "freeze", "publicIndex"],
    );
    assert.ok(DirectorPlatformPublicFoundation.namespace.every(
      (entry, index) => entry.deterministicOrder === index + 1,
    ));
  });

  it("derives the canonical public API registry and count", () => {
    assert.equal(DirectorPublicApiRegistry.entries.length, 9);
    assert.equal(
      DirectorPublicApiRegistry.apiCount,
      DirectorPublicApiRegistry.entries.reduce(
        (total, entry) => total + entry.apiReferences.length, 0,
      ),
    );
    assert.equal(getDirectorPublicApiCount(), DirectorPublicApiRegistry.apiCount);
    assert.equal(DirectorPublicApiRegistry.canonicalInventoryRule.hardcodedTotals, false);
    assert.ok(DirectorPublicApiRegistry.entries.every(({ derivedFromFreeze }) => derivedFromFreeze));
  });

  it("consumes only Freeze with no prohibited imports", () => {
    const metadata = getDirectorPublicReleaseMetadata();
    assert.equal(metadata.dependency.freezeOnly, true);
    assert.equal(metadata.dependency.downstreamDirectorDependencies, false);
    const source = readFileSync(new URL("directorPublicIndex.ts", import.meta.url), "utf8");
    assert.doesNotMatch(source, /from ["']\.\/director(?:Foundation|Registry|Model|Validation|Manifest|Platform|Certification)/);
    assert.doesNotMatch(source, /from ["'](?:react|three|@react|babylon|eve)/i);
  });

  it("is immutable and exposes no runtime facilities", () => {
    const metadata = getDirectorPublicReleaseMetadata();
    assert.ok(Object.isFrozen(DirectorPlatformPublicFoundation));
    assert.ok(Object.isFrozen(DirectorPublicApiRegistry));
    assert.ok(Object.isFrozen(DirectorPublicApiRegistry.entries));
    assert.ok(Object.isFrozen(metadata));
    assert.equal(metadata.services, false);
    assert.equal(metadata.factories, false);
    assert.equal(metadata.execution, false);
    assert.equal(metadata.orchestration, false);
    assert.equal(metadata.rendering, false);
  });
});
