import assert from "node:assert/strict";
import test from "node:test";

import { DataKnowledgeFoundation } from "./dataKnowledgeFoundation.ts";
import { DataKnowledgeFoundationCertification } from "./dataKnowledgeFoundationCertificationIndex.ts";
import { DataKnowledgeFoundationFreeze } from "./dataKnowledgeFoundationFreezeIndex.ts";
import { DataKnowledgeFoundationManifest } from "./dataKnowledgeFoundationManifestIndex.ts";
import { DataKnowledgeFoundationModel } from "./dataKnowledgeFoundationModel.ts";
import { DataKnowledgeFoundationPlatform } from "./dataKnowledgeFoundationPlatformIndex.ts";
import * as publicIndexApi from "./dataKnowledgeFoundationPublicIndex.ts";
import {
  DataKnowledgeFoundationPublicApiRegistry,
  DataKnowledgeFoundationPublicIndexId,
  DataKnowledgeFoundationPublicIndexName,
  DataKnowledgeFoundationPublicIndexNamespace,
  DataKnowledgeFoundationPublicIndexStatus,
  DataKnowledgeFoundationPublicIndexVersion,
  DataKnowledgeFoundationPublicPlatform,
  getDataKnowledgeFoundationPublicApiRegistry,
  getDataKnowledgeFoundationPublicPlatform,
  getDataKnowledgeFoundationPublicSection,
  getDataKnowledgeFoundationPublicSummary,
  getDataKnowledgeFoundationReleaseMetadata,
} from "./dataKnowledgeFoundationPublicIndex.ts";
import { DataKnowledgeFoundationRegistry } from "./dataKnowledgeFoundationRegistryIndex.ts";
import { DataKnowledgeFoundationValidation } from "./dataKnowledgeFoundationValidation.ts";

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

const EXPECTED_PUBLIC_API = [
  "DataKnowledgeFoundationPublicPlatform",
  "DataKnowledgeFoundationPublicApiRegistry",
  "DataKnowledgeFoundationPublicIndexId",
  "DataKnowledgeFoundationPublicIndexVersion",
  "DataKnowledgeFoundationPublicIndexName",
  "DataKnowledgeFoundationPublicIndexNamespace",
  "DataKnowledgeFoundationPublicIndexStatus",
  "getDataKnowledgeFoundationPublicPlatform",
  "getDataKnowledgeFoundationPublicSummary",
  "getDataKnowledgeFoundationPublicApiRegistry",
  "getDataKnowledgeFoundationReleaseMetadata",
  "getDataKnowledgeFoundationPublicSection",
];

const CANONICAL_SECTION_ORDER = [
  "foundation",
  "registry",
  "model",
  "validation",
  "manifest",
  "platform",
  "certification",
  "freeze",
  "publicIndex",
];

test("index exposes exactly twelve public exports", () => {
  assert.equal(Object.keys(publicIndexApi).length, 12);
  assert.deepEqual(Object.keys(publicIndexApi).sort(), [...EXPECTED_PUBLIC_API].sort());
});

test("1. public platform exists", () => {
  assert.ok(DataKnowledgeFoundationPublicPlatform);
  assert.equal(getDataKnowledgeFoundationPublicPlatform(), DataKnowledgeFoundationPublicPlatform);
});

test("2. public platform is deeply frozen", () => {
  assert.ok(isDeeplyFrozen(DataKnowledgeFoundationPublicPlatform));
});

test("3. exactly nine ordered sections exist", () => {
  assert.equal(Object.keys(DataKnowledgeFoundationPublicPlatform).length, 9);
});

test("4. section order is canonical", () => {
  assert.deepEqual(Object.keys(DataKnowledgeFoundationPublicPlatform), CANONICAL_SECTION_ORDER);
});

test("5. every section references the canonical public artifact", () => {
  assert.equal(DataKnowledgeFoundationPublicPlatform.foundation, DataKnowledgeFoundation);
  assert.equal(DataKnowledgeFoundationPublicPlatform.registry, DataKnowledgeFoundationRegistry);
  assert.equal(DataKnowledgeFoundationPublicPlatform.model, DataKnowledgeFoundationModel);
  assert.equal(DataKnowledgeFoundationPublicPlatform.validation, DataKnowledgeFoundationValidation);
  assert.equal(DataKnowledgeFoundationPublicPlatform.manifest, DataKnowledgeFoundationManifest);
  assert.equal(DataKnowledgeFoundationPublicPlatform.platform, DataKnowledgeFoundationPlatform);
  assert.equal(
    DataKnowledgeFoundationPublicPlatform.certification,
    DataKnowledgeFoundationCertification
  );
  assert.equal(DataKnowledgeFoundationPublicPlatform.freeze, DataKnowledgeFoundationFreeze);
  assert.equal(
    DataKnowledgeFoundationPublicPlatform.publicIndex,
    DataKnowledgeFoundationPublicIndexStatus
  );
});

test("6. public registry exists", () => {
  assert.ok(DataKnowledgeFoundationPublicApiRegistry);
  assert.equal(
    getDataKnowledgeFoundationPublicApiRegistry(),
    DataKnowledgeFoundationPublicApiRegistry
  );
});

test("7. released phase count equals nine", () => {
  assert.equal(DataKnowledgeFoundationPublicApiRegistry.releasedPhases, 9);
  assert.equal(DataKnowledgeFoundationPublicApiRegistry.releasedSections, 9);
});

test("8. released API count equals sixty-seven", () => {
  assert.equal(DataKnowledgeFoundationPublicApiRegistry.releasedPublicApis, 67);
});

test("9. metadata values are correct", () => {
  assert.equal(DataKnowledgeFoundationPublicIndexId, "DKL-1:9");
  assert.equal(DataKnowledgeFoundationPublicIndexVersion, "1.0.0");
  assert.equal(DataKnowledgeFoundationPublicIndexName, "Data Knowledge Foundation Public Index");
  assert.equal(DataKnowledgeFoundationPublicIndexNamespace, "nexora.dkl.foundation.public-index");
  assert.equal(DataKnowledgeFoundationPublicApiRegistry.namespace, "nexora.dkl.foundation.public-index");
  assert.equal(DataKnowledgeFoundationPublicApiRegistry.frozenApis, 55);
  assert.equal(DataKnowledgeFoundationPublicApiRegistry.certifiedApis, 47);
});

test("10. release status is RELEASED", () => {
  assert.equal(DataKnowledgeFoundationPublicIndexStatus.releaseStatus, "RELEASED");
  assert.equal(getDataKnowledgeFoundationReleaseMetadata().release, "RELEASED");
});

test("11. certification is CERTIFIED", () => {
  assert.equal(DataKnowledgeFoundationPublicIndexStatus.certificationStatus, "CERTIFIED");
  assert.equal(getDataKnowledgeFoundationReleaseMetadata().certification, "CERTIFIED");
});

test("12. freeze status is FROZEN", () => {
  assert.equal(DataKnowledgeFoundationPublicIndexStatus.freezeStatus, "FROZEN");
  assert.equal(getDataKnowledgeFoundationReleaseMetadata().freeze, "FROZEN");
});

test("13. stability is STABLE", () => {
  assert.equal(DataKnowledgeFoundationPublicIndexStatus.stability, "STABLE");
  assert.equal(getDataKnowledgeFoundationReleaseMetadata().stability, "STABLE");
});

test("14. readiness is ReadyForConsumer", () => {
  assert.equal(DataKnowledgeFoundationPublicIndexStatus.readiness, "ReadyForConsumer");
  assert.equal(getDataKnowledgeFoundationReleaseMetadata().readiness, "ReadyForConsumer");
});

test("15. summary is deterministic", () => {
  const first = getDataKnowledgeFoundationPublicSummary();
  const second = getDataKnowledgeFoundationPublicSummary();
  assert.equal(first, second);
  assert.deepEqual(first, second);
  assert.equal(first.totalPhases, 9);
  assert.equal(first.totalSections, 9);
  assert.equal(first.totalReleasedApis, 67);
  assert.equal(first.certification, "CERTIFIED");
  assert.equal(first.stability, "STABLE");
  assert.equal(first.readiness, "ReadyForConsumer");
});

test("16. registry accessor returns canonical reference", () => {
  assert.equal(
    getDataKnowledgeFoundationPublicApiRegistry(),
    DataKnowledgeFoundationPublicApiRegistry
  );
});

test("17. platform accessor returns canonical reference", () => {
  assert.equal(getDataKnowledgeFoundationPublicPlatform(), DataKnowledgeFoundationPublicPlatform);
});

test("18. known section lookup succeeds", () => {
  assert.equal(getDataKnowledgeFoundationPublicSection("foundation"), DataKnowledgeFoundation);
  assert.equal(getDataKnowledgeFoundationPublicSection("freeze"), DataKnowledgeFoundationFreeze);
  assert.equal(
    getDataKnowledgeFoundationPublicSection("publicIndex"),
    DataKnowledgeFoundationPublicIndexStatus
  );
});

test("19. unknown section lookup returns undefined and never throws", () => {
  assert.equal(getDataKnowledgeFoundationPublicSection("unknown"), undefined);
  assert.equal(getDataKnowledgeFoundationPublicSection(""), undefined);
});

test("20. no duplicated metadata exists (references, not copies)", () => {
  assert.equal(
    DataKnowledgeFoundationPublicApiRegistry.frozenApis,
    DataKnowledgeFoundationFreeze.summary.frozenApis
  );
  assert.equal(
    DataKnowledgeFoundationPublicApiRegistry.certifiedApis,
    DataKnowledgeFoundationFreeze.registry.frozenBaselines.totalPreCertificationApis
  );
});

test("21. canonical identity references are preserved", () => {
  assert.equal(DataKnowledgeFoundationPublicPlatform.foundation.identity.layerId, "DKL");
  assert.equal(
    DataKnowledgeFoundationPublicPlatform.certification.metadata.certificationStatus,
    "CERTIFIED"
  );
  assert.equal(DataKnowledgeFoundationPublicPlatform.freeze.manifest.freezeStatus, "FROZEN");
});

test("22. no runtime behavior is exposed by public APIs", () => {
  const runtimeVerb = /fetch|save|persist|query|ingest|process|execute|orchestrat|async|await|http|network|render|delete|insert|update/i;
  for (const name of Object.keys(publicIndexApi)) {
    assert.ok(!runtimeVerb.test(name), `public API ${name} must not imply runtime behavior`);
  }
});

test("23. previous phase metadata remains unchanged", () => {
  assert.equal(DataKnowledgeFoundationModel.businessModel.types.length, 8);
  assert.equal(DataKnowledgeFoundationValidation.rules.length, 48);
  assert.equal(DataKnowledgeFoundationManifest.phases.phaseCount, 4);
  assert.equal(DataKnowledgeFoundationPlatform.summary.readiness, "ReadyForCertification");
  assert.equal(DataKnowledgeFoundationCertification.gates.length, 16);
  assert.equal(DataKnowledgeFoundationFreeze.registry.frozenPhaseCount, 7);
  assert.equal(DataKnowledgeFoundationFreeze.registry.frozenPublicApiCount, 55);
});
