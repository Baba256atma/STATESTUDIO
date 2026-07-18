/**
 * DKL-3:9 — Data Understanding Public Index Tests.
 *
 * Deterministic coverage for the immutable public release surface.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import * as publicIndexApi from "./dataUnderstandingPublicIndex.ts";
import {
  DataUnderstandingPlatformPublicFoundation,
  DataUnderstandingPublicApiRegistry,
  DataUnderstandingPublicIndexId,
  DataUnderstandingPublicIndexVersion,
  DataUnderstandingPublicIndexName,
  DataUnderstandingPublicIndexNamespace,
  DataUnderstandingPublicReleaseStatus,
  DataUnderstandingPublicCertificationStatus,
  DataUnderstandingPublicFreezeStatus,
  getDataUnderstandingPublicSummary,
  getDataUnderstandingPublicApiCount,
  getDataUnderstandingPublicReleaseMetadata,
} from "./dataUnderstandingPublicIndex.ts";
import {
  DataUnderstandingFreeze,
  DataUnderstandingFreezeIdentity,
  DataUnderstandingFreezeVersion,
} from "./dataUnderstandingFreeze.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL39_FILES = [
  "dataUnderstandingPublicIndex.ts",
  "dataUnderstandingPublicIndex.test.ts",
];

const SECTION_ORDER = [
  "foundation",
  "registry",
  "model",
  "validation",
  "manifest",
  "platform",
  "certification",
  "freeze",
  "publicIndex",
] as const;

const isDeeplyFrozen = (value: unknown): boolean => {
  if (value === null || typeof value !== "object") {
    return true;
  }
  if (!Object.isFrozen(value)) {
    return false;
  }
  for (const nested of Object.values(value as Record<string, unknown>)) {
    if (!isDeeplyFrozen(nested)) {
      return false;
    }
  }
  return true;
};

test("1. exactly two DKL-3:9 files exist", () => {
  assert.equal(DKL39_FILES.length, 2);
  for (const file of DKL39_FILES) {
    assert.ok(readdirSync(HERE).includes(file), `missing ${file}`);
  }
});

test("2. exactly twelve public exports", () => {
  assert.deepEqual(Object.keys(publicIndexApi).sort(), [
    "DataUnderstandingPlatformPublicFoundation",
    "DataUnderstandingPublicApiRegistry",
    "DataUnderstandingPublicCertificationStatus",
    "DataUnderstandingPublicFreezeStatus",
    "DataUnderstandingPublicIndexId",
    "DataUnderstandingPublicIndexName",
    "DataUnderstandingPublicIndexNamespace",
    "DataUnderstandingPublicIndexVersion",
    "DataUnderstandingPublicReleaseStatus",
    "getDataUnderstandingPublicApiCount",
    "getDataUnderstandingPublicReleaseMetadata",
    "getDataUnderstandingPublicSummary",
  ]);
});

test("3. public namespace has exactly nine ordered sections", () => {
  assert.deepEqual(
    Object.keys(DataUnderstandingPlatformPublicFoundation),
    [...SECTION_ORDER],
  );
  assert.equal(Object.keys(DataUnderstandingPlatformPublicFoundation).length, 9);
});

test("4. sections reference Freeze gateway surfaces only", () => {
  assert.equal(
    DataUnderstandingPlatformPublicFoundation.foundation,
    DataUnderstandingFreeze.certifiedPlatform.foundation,
  );
  assert.equal(
    DataUnderstandingPlatformPublicFoundation.registry,
    DataUnderstandingFreeze.certifiedPlatform.registry,
  );
  assert.equal(
    DataUnderstandingPlatformPublicFoundation.model,
    DataUnderstandingFreeze.certifiedPlatform.model,
  );
  assert.equal(
    DataUnderstandingPlatformPublicFoundation.validation,
    DataUnderstandingFreeze.certifiedPlatform.validation,
  );
  assert.equal(
    DataUnderstandingPlatformPublicFoundation.manifest,
    DataUnderstandingFreeze.certifiedPlatform.manifest,
  );
  assert.equal(
    DataUnderstandingPlatformPublicFoundation.platform,
    DataUnderstandingFreeze.certifiedPlatform,
  );
  assert.equal(
    DataUnderstandingPlatformPublicFoundation.certification,
    DataUnderstandingFreeze.certification,
  );
  assert.equal(
    DataUnderstandingPlatformPublicFoundation.freeze,
    DataUnderstandingFreeze,
  );
});

test("5. public API registry completeness", () => {
  assert.equal(DataUnderstandingPublicApiRegistry.entryCount, 76);
  assert.equal(DataUnderstandingPublicApiRegistry.releasedPublicApiCount, 76);
  assert.equal(DataUnderstandingPublicApiRegistry.releasedPhases, 9);
  for (const entry of DataUnderstandingPublicApiRegistry.entries) {
    assert.ok(typeof entry.identity === "string" && entry.identity.length > 0);
    assert.ok(typeof entry.name === "string" && entry.name.length > 0);
    assert.ok(typeof entry.sourcePhase === "string");
    assert.equal(entry.version, "1.0.0");
    assert.equal(entry.releaseStatus, "Released");
    assert.equal(entry.stability, "Stable");
    assert.ok(typeof entry.ownership === "string" && entry.ownership.length > 0);
  }
  const byPhase = new Map<string, number>();
  for (const entry of DataUnderstandingPublicApiRegistry.entries) {
    byPhase.set(entry.sourcePhase, (byPhase.get(entry.sourcePhase) ?? 0) + 1);
  }
  assert.equal(byPhase.get("DKL-3:1"), 8);
  assert.equal(byPhase.get("DKL-3:2"), 8);
  assert.equal(byPhase.get("DKL-3:3"), 8);
  assert.equal(byPhase.get("DKL-3:4"), 8);
  assert.equal(byPhase.get("DKL-3:5"), 8);
  assert.equal(byPhase.get("DKL-3:6"), 8);
  assert.equal(byPhase.get("DKL-3:7"), 8);
  assert.equal(byPhase.get("DKL-3:8"), 8);
  assert.equal(byPhase.get("DKL-3:9"), 12);
});

test("6. identity and version consistency", () => {
  assert.equal(
    DataUnderstandingPublicIndexId,
    "DKL-3:9/DataUnderstandingPublicIndex",
  );
  assert.equal(DataUnderstandingPublicIndexVersion, "1.0.0");
  assert.equal(
    DataUnderstandingPublicIndexName,
    "Data Understanding Public Index",
  );
  assert.equal(
    DataUnderstandingPublicIndexNamespace,
    "nexora.dkl.data-understanding.public",
  );
  assert.equal(
    DataUnderstandingPlatformPublicFoundation.publicIndex.identity.publicIndexId,
    DataUnderstandingPublicIndexId,
  );
  assert.equal(
    DataUnderstandingPlatformPublicFoundation.publicIndex.freezeIdentity,
    DataUnderstandingFreezeIdentity,
  );
  assert.equal(
    DataUnderstandingPlatformPublicFoundation.publicIndex.freezeVersion,
    DataUnderstandingFreezeVersion,
  );
});

test("7. release, certification, and freeze status", () => {
  assert.equal(DataUnderstandingPublicReleaseStatus, "Released");
  assert.equal(DataUnderstandingPublicCertificationStatus, "Certified");
  assert.equal(DataUnderstandingPublicFreezeStatus, "Frozen");
  const meta = getDataUnderstandingPublicReleaseMetadata();
  assert.equal(meta.Released, true);
  assert.equal(meta.Certified, true);
  assert.equal(meta.Frozen, true);
  assert.equal(meta.Stable, true);
  assert.equal(meta.ReadyForConsumer, true);
  assert.equal(meta.ReadyForDKL4, true);
  assert.equal(meta.releaseStatus, "Released");
  assert.equal(meta.certificationStatus, "Certified");
  assert.equal(meta.freezeStatus, "Frozen");
  assert.equal(meta.platformStatus, "PlatformComplete");
  assert.equal(meta.readiness, "ReadyForConsumer");
});

test("8. public API count helpers are deterministic", () => {
  assert.equal(getDataUnderstandingPublicApiCount(), 76);
  assert.equal(getDataUnderstandingPublicApiCount(), getDataUnderstandingPublicApiCount());
  const summary = getDataUnderstandingPublicSummary();
  assert.equal(summary.totalReleasedPublicApiCount, 76);
  assert.equal(summary.publicIndexPublicApiCount, 12);
  assert.equal(summary.freezePublicApiCount, 8);
  assert.equal(summary.frozenPublicApiCount, 56);
  assert.equal(summary.namespaceSectionCount, 9);
  assert.equal(summary.phaseCount, 9);
  assert.equal(getDataUnderstandingPublicSummary(), summary);
  assert.equal(
    getDataUnderstandingPublicReleaseMetadata(),
    getDataUnderstandingPublicReleaseMetadata(),
  );
});

test("9. release metadata consistency", () => {
  const meta = getDataUnderstandingPublicReleaseMetadata();
  assert.equal(meta.publicIndexId, DataUnderstandingPublicIndexId);
  assert.equal(meta.publicIndexVersion, DataUnderstandingPublicIndexVersion);
  assert.equal(meta.publicIndexName, DataUnderstandingPublicIndexName);
  assert.equal(meta.namespace, DataUnderstandingPublicIndexNamespace);
  assert.equal(meta.publicApiCount, 76);
  assert.equal(meta.freezeVersion, DataUnderstandingFreezeVersion);
  assert.equal(meta.metadataOnly, true);
  assert.equal(meta.immutable, true);
});

test("10. immutability guarantees", () => {
  assert.equal(Object.isFrozen(DataUnderstandingPlatformPublicFoundation), true);
  assert.equal(isDeeplyFrozen(DataUnderstandingPublicApiRegistry), true);
  assert.equal(
    isDeeplyFrozen(DataUnderstandingPlatformPublicFoundation.publicIndex),
    true,
  );
  assert.equal(isDeeplyFrozen(getDataUnderstandingPublicSummary()), true);
  assert.equal(isDeeplyFrozen(getDataUnderstandingPublicReleaseMetadata()), true);
});

test("11. no direct dependency on earlier DKL-3 phases — Freeze only", () => {
  const text = readFileSync(join(HERE, "dataUnderstandingPublicIndex.ts"), "utf8");
  const imports = [...text.matchAll(/from\s+["']([^"']+)["']/g)].map((m) => m[1]!);
  assert.equal(imports.length, 2);
  for (const spec of imports) {
    assert.ok(
      /dataUnderstandingFreeze\.ts$/.test(spec),
      `forbidden import: ${spec}`,
    );
  }
  assert.equal(/dataUnderstandingFoundation\.ts/.test(text), false);
  assert.equal(/dataUnderstandingRegistry\.ts/.test(text), false);
  assert.equal(/dataUnderstandingModel\.ts/.test(text), false);
  assert.equal(/dataUnderstandingValidation\.ts/.test(text), false);
  assert.equal(/dataUnderstandingManifest\.ts/.test(text), false);
  assert.equal(/dataUnderstandingPlatform\.ts/.test(text), false);
  assert.equal(/dataUnderstandingCertification\.ts/.test(text), false);
  assert.equal(/dkl-4/i.test(text), false);
  assert.equal(/\/engine\//i.test(text), false);
});

test("12. no runtime behavior — metadata only", () => {
  const text = readFileSync(join(HERE, "dataUnderstandingPublicIndex.ts"), "utf8");
  assert.equal(/\bclass\s+\w+/.test(text), false);
  assert.equal(/\basync\s+function\b/.test(text), false);
  assert.equal(/\bnew\s+Promise\b/.test(text), false);
  assert.equal(/Math\.random|Date\.now|new Date\(|process\.env/.test(text), false);
  assert.equal(/\buuid\b|randomUUID/i.test(text), false);
  assert.equal(typeof getDataUnderstandingPublicSummary, "function");
  assert.equal(typeof getDataUnderstandingPublicApiCount, "function");
  assert.equal(typeof getDataUnderstandingPublicReleaseMetadata, "function");
  for (const [name, value] of Object.entries(publicIndexApi)) {
    if (name.startsWith("get")) {
      assert.equal(typeof value, "function");
    } else {
      assert.notEqual(typeof value, "function", `${name} must not be a function`);
    }
  }
});

test("13. Freeze gateway certifiedPlatform is present for Public Index", () => {
  assert.ok(DataUnderstandingFreeze.certifiedPlatform);
  assert.ok(DataUnderstandingFreeze.certification);
  assert.equal(
    DataUnderstandingFreeze.certification,
    DataUnderstandingPlatformPublicFoundation.certification,
  );
  assert.equal(
    DataUnderstandingFreeze.certifiedPlatform.identity.platformId,
    "DKL-3",
  );
});
