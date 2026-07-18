import assert from "node:assert/strict";
import test from "node:test";

import * as freezeApi from "./dataKnowledgeFoundationFreezeIndex.ts";
import {
  DataKnowledgeFoundationFreeze,
  DataKnowledgeFoundationFreezeCompatibility,
  DataKnowledgeFoundationFreezeLocks,
  DataKnowledgeFoundationFreezeManifest,
  DataKnowledgeFoundationFreezeRegistry,
  getDataKnowledgeFoundationFreeze,
  getDataKnowledgeFoundationFreezeLockById,
  getDataKnowledgeFoundationFreezeSummary,
} from "./dataKnowledgeFoundationFreezeIndex.ts";
import { isDeeplyFrozen } from "./dataKnowledgeFoundationFreezeTypes.ts";
import { DataKnowledgeFoundationCertification } from "./dataKnowledgeFoundationCertificationIndex.ts";
import { DataKnowledgeFoundationManifest } from "./dataKnowledgeFoundationManifestIndex.ts";
import { DataKnowledgeFoundationPlatform } from "./dataKnowledgeFoundationPlatformIndex.ts";

const EXPECTED_PUBLIC_API = [
  "DataKnowledgeFoundationFreeze",
  "DataKnowledgeFoundationFreezeRegistry",
  "DataKnowledgeFoundationFreezeCompatibility",
  "DataKnowledgeFoundationFreezeLocks",
  "DataKnowledgeFoundationFreezeManifest",
  "getDataKnowledgeFoundationFreeze",
  "getDataKnowledgeFoundationFreezeSummary",
  "getDataKnowledgeFoundationFreezeLockById",
];

const REQUIRED_GUARANTEES = [
  "metadataOnly",
  "runtimeFree",
  "deepFrozen",
  "deterministic",
  "publicApiStable",
  "ownershipProtected",
  "dependencyProtected",
  "canonicalReferencesPreserved",
  "regressionProtected",
  "readyForPublicIndex",
];

test("index exposes exactly eight public APIs", () => {
  assert.equal(Object.keys(freezeApi).length, 8);
  assert.deepEqual(Object.keys(freezeApi).sort(), [...EXPECTED_PUBLIC_API].sort());
});

test("1. freeze platform exists", () => {
  assert.ok(DataKnowledgeFoundationFreeze);
  assert.equal(getDataKnowledgeFoundationFreeze(), DataKnowledgeFoundationFreeze);
});

test("2. freeze registry exists", () => {
  assert.ok(DataKnowledgeFoundationFreezeRegistry);
  assert.equal(DataKnowledgeFoundationFreeze.registry, DataKnowledgeFoundationFreezeRegistry);
});

test("3. compatibility exists", () => {
  assert.ok(DataKnowledgeFoundationFreezeCompatibility);
  assert.equal(
    DataKnowledgeFoundationFreeze.compatibility,
    DataKnowledgeFoundationFreezeCompatibility
  );
});

test("4. locks exist", () => {
  assert.ok(DataKnowledgeFoundationFreezeLocks);
  assert.equal(DataKnowledgeFoundationFreezeLocks.length, 9);
});

test("5. manifest exists", () => {
  assert.ok(DataKnowledgeFoundationFreezeManifest);
  assert.equal(DataKnowledgeFoundationFreeze.manifest, DataKnowledgeFoundationFreezeManifest);
});

test("6. registry reports 7 frozen phases", () => {
  assert.equal(DataKnowledgeFoundationFreezeRegistry.frozenPhaseCount, 7);
  assert.equal(DataKnowledgeFoundationFreezeRegistry.frozenPhases.length, 7);
});

test("7. registry reports 55 frozen public APIs", () => {
  assert.equal(DataKnowledgeFoundationFreezeRegistry.frozenPublicApiCount, 55);
  assert.equal(DataKnowledgeFoundationFreezeRegistry.frozenPublicApis.total, 55);
});

test("8. all lock IDs are unique", () => {
  const ids = DataKnowledgeFoundationFreezeLocks.map((lock) => lock.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(ids.length, 9);
});

test("9. every lock is deeply frozen", () => {
  for (const lock of DataKnowledgeFoundationFreezeLocks) {
    assert.ok(isDeeplyFrozen(lock), `lock ${lock.id} must be deeply frozen`);
    assert.equal(lock.status, "LOCKED");
    assert.ok(lock.protectionLevel === "STRICT" || lock.protectionLevel === "PERMANENT");
  }
});

test("10. every compatibility guarantee exists", () => {
  const guarantees = DataKnowledgeFoundationFreezeCompatibility.guarantees as Record<string, unknown>;
  for (const guarantee of REQUIRED_GUARANTEES) {
    assert.equal(guarantees[guarantee], true, `guarantee ${guarantee} must be true`);
  }
});

test("11. manifest is deeply frozen", () => {
  assert.ok(isDeeplyFrozen(DataKnowledgeFoundationFreezeManifest));
});

test("12. freeze status is FROZEN", () => {
  assert.equal(DataKnowledgeFoundationFreezeManifest.freezeStatus, "FROZEN");
});

test("13. readiness is ReadyForPublicIndex", () => {
  assert.equal(DataKnowledgeFoundationFreezeManifest.readiness, "ReadyForPublicIndex");
});

test("14. stability is STABLE", () => {
  assert.equal(DataKnowledgeFoundationFreezeManifest.stability, "STABLE");
});

test("15. known lock lookup returns canonical lock", () => {
  const lock = getDataKnowledgeFoundationFreezeLockById("dkl-freeze-lock-public-api");
  assert.equal(lock, DataKnowledgeFoundationFreezeLocks[0]);
});

test("16. unknown lock lookup returns undefined and never throws", () => {
  assert.equal(getDataKnowledgeFoundationFreezeLockById("dkl-freeze-lock-unknown"), undefined);
});

test("17. summary is deterministic", () => {
  const first = getDataKnowledgeFoundationFreezeSummary();
  const second = getDataKnowledgeFoundationFreezeSummary();
  assert.equal(first, second);
  assert.deepEqual(first, second);
  assert.equal(first.frozenPhases, 7);
  assert.equal(first.frozenApis, 55);
  assert.equal(first.lockCount, 9);
  assert.equal(first.compatibilityCount, 7);
  assert.equal(first.freezeStatus, "FROZEN");
  assert.equal(first.stability, "STABLE");
  assert.equal(first.readiness, "ReadyForPublicIndex");
});

test("18. canonical references are preserved", () => {
  assert.equal(
    DataKnowledgeFoundationFreezeManifest.compatibility,
    DataKnowledgeFoundationFreezeCompatibility
  );
  assert.equal(DataKnowledgeFoundationFreezeManifest.locks, DataKnowledgeFoundationFreezeLocks);
  assert.equal(
    DataKnowledgeFoundationFreezeRegistry.frozenBaselines,
    DataKnowledgeFoundationCertification.regression.baselines
  );
});

test("19. no duplicated metadata exists", () => {
  assert.equal(
    DataKnowledgeFoundationFreezeRegistry.frozenBaselines.totalPreCertificationApis,
    47
  );
  assert.equal(DataKnowledgeFoundationFreezeRegistry.frozenModelCount, 4);
  assert.equal(DataKnowledgeFoundationFreezeRegistry.frozenRegistryComponentCount, 5);
  assert.equal(DataKnowledgeFoundationFreezeRegistry.frozenValidationRuleCount, 48);
  assert.equal(DataKnowledgeFoundationFreezeRegistry.frozenManifestPhaseCount, 4);
  assert.equal(DataKnowledgeFoundationFreezeRegistry.frozenPlatformSectionCount, 5);
  assert.equal(DataKnowledgeFoundationFreezeRegistry.frozenCertificationGateCount, 16);
});

test("20. previous certification metadata remains unchanged", () => {
  assert.equal(DataKnowledgeFoundationCertification.metadata.certificationStatus, "CERTIFIED");
  assert.equal(DataKnowledgeFoundationCertification.gates.length, 16);
  assert.equal(DataKnowledgeFoundationCertification.regression.verified, true);
});

test("21. previous platform metadata remains unchanged", () => {
  assert.equal(DataKnowledgeFoundationPlatform.summary.readiness, "ReadyForCertification");
  assert.equal(DataKnowledgeFoundationPlatform.metadata.stability, "STABLE");
});

test("22. previous manifest metadata remains unchanged", () => {
  assert.equal(DataKnowledgeFoundationManifest.phases.phaseCount, 4);
  assert.equal(DataKnowledgeFoundationManifest.inventory.publicApis.total, 31);
});

test("23. no runtime behavior is exposed by public APIs", () => {
  const runtimeVerb = /fetch|save|persist|query|ingest|process|execute|orchestrat|async|await|http|network|render|delete|insert|update/i;
  for (const name of Object.keys(freezeApi)) {
    assert.ok(!runtimeVerb.test(name), `public API ${name} must not imply runtime behavior`);
  }
});

test("aggregate freeze platform is deeply frozen", () => {
  assert.ok(isDeeplyFrozen(DataKnowledgeFoundationFreeze));
});

test("final freeze is FROZEN, STABLE, and ReadyForPublicIndex", () => {
  const summary = getDataKnowledgeFoundationFreezeSummary();
  assert.equal(summary.freezeStatus, "FROZEN");
  assert.equal(summary.stability, "STABLE");
  assert.equal(summary.readiness, "ReadyForPublicIndex");
});
