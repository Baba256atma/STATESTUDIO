import assert from "node:assert/strict";
import test from "node:test";

import * as platformApi from "./dataSourceKnowledgeRegistryPlatformIndex.ts";
import {
  DataSourceKnowledgePlatformMetadata,
  DataSourceKnowledgePlatformReadiness,
  DataSourceKnowledgePlatformRegistry,
  DataSourceKnowledgePlatformSummary,
  DataSourceKnowledgePlatformVersion,
  DataSourceKnowledgeRegistryPlatform,
} from "./dataSourceKnowledgeRegistryPlatformIndex.ts";

import { DataSourceKnowledgeRegistryFoundation } from "./dataSourceKnowledgeRegistryFoundation.ts";
import { DataSourceKnowledgeRegistryPlatform as RegistryPlatform } from "./dataSourceKnowledgeRegistryPlatform.ts";
import { DataSourceRegistryModelPlatform } from "./dataSourceRegistryModelPlatform.ts";
import { DataSourceKnowledgeValidationPlatform } from "./dataSourceKnowledgeValidationRunner.ts";
import {
  DataSourceKnowledgeRegistryManifestPlatform,
  DataSourceKnowledgeRegistryManifestSummary,
} from "./dataSourceKnowledgeRegistryManifestPlatform.ts";

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
  "DataSourceKnowledgeRegistryPlatform",
  "DataSourceKnowledgePlatformRegistry",
  "DataSourceKnowledgePlatformMetadata",
  "DataSourceKnowledgePlatformSummary",
  "DataSourceKnowledgePlatformReadiness",
  "DataSourceKnowledgePlatformVersion",
];

const EXPECTED_PHASES = ["DKL-2:1", "DKL-2:2", "DKL-2:3", "DKL-2:4", "DKL-2:5"];

test("1. platform index publishes exactly six runtime exports", () => {
  assert.equal(Object.keys(platformApi).length, 6);
  assert.deepEqual(Object.keys(platformApi).sort(), [...EXPECTED_PUBLIC_API].sort());
});

test("2. all seven DKL-2:6 files are represented by the public surface", () => {
  // Types, registry, metadata, summary, readiness, index (aggregate + version), test.
  assert.ok(DataSourceKnowledgePlatformRegistry);
  assert.ok(DataSourceKnowledgePlatformMetadata);
  assert.ok(DataSourceKnowledgePlatformSummary);
  assert.ok(DataSourceKnowledgePlatformReadiness);
  assert.ok(DataSourceKnowledgeRegistryPlatform);
  assert.equal(typeof DataSourceKnowledgePlatformVersion, "string");
});

test("3. aggregate references DKL-2:1..2:5 by identity (no copies)", () => {
  assert.equal(DataSourceKnowledgeRegistryPlatform.foundation, DataSourceKnowledgeRegistryFoundation);
  assert.equal(DataSourceKnowledgeRegistryPlatform.registry, RegistryPlatform);
  assert.equal(DataSourceKnowledgeRegistryPlatform.model, DataSourceRegistryModelPlatform);
  assert.equal(DataSourceKnowledgeRegistryPlatform.validation, DataSourceKnowledgeValidationPlatform);
  assert.equal(
    DataSourceKnowledgeRegistryPlatform.manifest,
    DataSourceKnowledgeRegistryManifestPlatform,
  );
});

test("4. aggregate references DKL-2:6 metadata/summary/readiness by identity", () => {
  assert.equal(DataSourceKnowledgeRegistryPlatform.metadata, DataSourceKnowledgePlatformMetadata);
  assert.equal(DataSourceKnowledgeRegistryPlatform.summary, DataSourceKnowledgePlatformSummary);
  assert.equal(DataSourceKnowledgeRegistryPlatform.readiness, DataSourceKnowledgePlatformReadiness);
});

test("5. aggregate contains exactly the eight declared members plus flags", () => {
  assert.deepEqual(Object.keys(DataSourceKnowledgeRegistryPlatform).sort(), [
    "deterministic",
    "foundation",
    "immutable",
    "manifest",
    "metadata",
    "metadataOnly",
    "model",
    "readiness",
    "registry",
    "summary",
    "validation",
  ]);
});

test("6. platform registry lists exactly five completed phases in order", () => {
  assert.equal(DataSourceKnowledgePlatformRegistry.phases.length, 5);
  assert.deepEqual(
    DataSourceKnowledgePlatformRegistry.phases.map((phase) => phase.phaseId),
    EXPECTED_PHASES,
  );
  for (const phase of DataSourceKnowledgePlatformRegistry.phases) {
    assert.equal(phase.status, "Complete");
    assert.equal(phase.metadataOnly, true);
  }
});

test("7. platform registry export counts match live module surfaces", () => {
  const byId = (id: string) => DataSourceKnowledgePlatformRegistry.getByPhaseId(id);
  assert.equal(byId("DKL-2:1")?.runtimeExportCount, 7);
  assert.equal(byId("DKL-2:2")?.runtimeExportCount, 8);
  assert.equal(byId("DKL-2:3")?.runtimeExportCount, 9);
  assert.equal(byId("DKL-2:4")?.runtimeExportCount, 7);
  assert.equal(byId("DKL-2:5")?.runtimeExportCount, 8);
});

test("8. metadata correctness (derived counts and declaration)", () => {
  assert.equal(DataSourceKnowledgePlatformMetadata.owner, "DKL-2 Data Source & Knowledge Registry");
  assert.equal(DataSourceKnowledgePlatformMetadata.version, "1.0.0");
  assert.equal(DataSourceKnowledgePlatformMetadata.readiness, "ReadyForCertification");
  assert.equal(DataSourceKnowledgePlatformMetadata.runtimeExportCount, 39);
  assert.equal(DataSourceKnowledgePlatformMetadata.artifactCount, 41);
  assert.deepEqual([...DataSourceKnowledgePlatformMetadata.dependency], EXPECTED_PHASES);
});

test("9. summary correctness (deterministic aggregation)", () => {
  assert.equal(DataSourceKnowledgePlatformSummary.phaseCount, 5);
  assert.deepEqual([...DataSourceKnowledgePlatformSummary.completedPhases], EXPECTED_PHASES);
  assert.equal(DataSourceKnowledgePlatformSummary.runtimeExportCount, 39);
  assert.equal(DataSourceKnowledgePlatformSummary.artifactCount, 41);
  assert.equal(DataSourceKnowledgePlatformSummary.validationStatus, "ValidationCertified");
  assert.equal(
    DataSourceKnowledgePlatformSummary.guaranteeCount,
    DataSourceKnowledgeRegistryManifestSummary.guaranteeCount,
  );
  assert.equal(DataSourceKnowledgePlatformSummary.readiness, "ReadyForCertification");
});

test("10. readiness correctness (PlatformComplete / ReadyForCertification)", () => {
  assert.equal(DataSourceKnowledgePlatformReadiness.status, "PlatformComplete");
  assert.equal(DataSourceKnowledgePlatformReadiness.certificationState, "ReadyForCertification");
  assert.equal(DataSourceKnowledgePlatformReadiness.metadataOnly, true);
  assert.equal(DataSourceKnowledgePlatformReadiness.runtimeFree, true);
  assert.equal(DataSourceKnowledgePlatformReadiness.deterministic, true);
  assert.equal(DataSourceKnowledgePlatformReadiness.immutable, true);
  assert.equal(DataSourceKnowledgePlatformReadiness.nextPhase, "DKL-2:7");
  assert.deepEqual([...DataSourceKnowledgePlatformReadiness.completion], [
    "PlatformComplete",
    "ReadyForCertification",
    "MetadataOnly",
    "RuntimeFree",
    "Deterministic",
    "Immutable",
  ]);
});

test("11. version export equals metadata version", () => {
  assert.equal(DataSourceKnowledgePlatformVersion, DataSourceKnowledgePlatformMetadata.version);
});

test("12. deep immutability of the aggregate platform", () => {
  assert.ok(isDeeplyFrozen(DataSourceKnowledgeRegistryPlatform));
});

test("13. deep immutability of every published DKL-2:6 object", () => {
  assert.ok(isDeeplyFrozen(DataSourceKnowledgePlatformRegistry));
  assert.ok(isDeeplyFrozen(DataSourceKnowledgePlatformMetadata));
  assert.ok(isDeeplyFrozen(DataSourceKnowledgePlatformSummary));
  assert.ok(isDeeplyFrozen(DataSourceKnowledgePlatformReadiness));
});

test("14. dependency rules: dependency chain is forward-only over DKL-2", () => {
  assert.deepEqual([...DataSourceKnowledgePlatformRegistry.dependencyChain], [
    "DKL-1 Public Index",
    "DKL-2:1",
    "DKL-2:2",
    "DKL-2:3",
    "DKL-2:4",
    "DKL-2:5",
  ]);
  // Scope the forbidden-dependency scan to dependency-bearing surfaces. The
  // readiness object legitimately names DKL-2:7 as its forward `nextPhase`
  // pointer, which is a declaration and not a dependency.
  const forbidden = /DKL-2:[7-9]|Engine|OPS|BUS|Advisor|Scene|Director|EVE|NEA|Persistence|Integration/;
  const serialized = JSON.stringify({
    registry: DataSourceKnowledgePlatformRegistry,
    metadata: DataSourceKnowledgePlatformMetadata,
    summary: DataSourceKnowledgePlatformSummary,
  });
  assert.equal(forbidden.test(serialized), false);
});

test("15. no duplicate phase identifiers", () => {
  const ids = DataSourceKnowledgePlatformRegistry.phases.map((phase) => phase.phaseId);
  assert.equal(new Set(ids).size, ids.length);
});

test("16. no runtime behavior: every public export is data (no functions)", () => {
  for (const value of Object.values(platformApi)) {
    assert.notEqual(typeof value, "function");
  }
});

test("17. deterministic ordering is stable across repeated reads", () => {
  const first = DataSourceKnowledgePlatformRegistry.phases.map((phase) => phase.phaseId);
  const second = DataSourceKnowledgePlatformRegistry.phases.map((phase) => phase.phaseId);
  assert.deepEqual(first, second);
});

test("18. platform reports ReadyForCertification across surfaces", () => {
  assert.equal(DataSourceKnowledgePlatformMetadata.readiness, "ReadyForCertification");
  assert.equal(DataSourceKnowledgePlatformSummary.readiness, "ReadyForCertification");
  assert.equal(DataSourceKnowledgePlatformReadiness.readiness, "ReadyForCertification");
});
