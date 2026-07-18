import assert from "node:assert/strict";
import test from "node:test";

import { DataSourceKnowledgeRegistryMetadata } from "./dataSourceKnowledgeRegistryFoundation.ts";
import { DataSourceKnowledgeRegistryPlatform } from "./dataSourceKnowledgeRegistryPlatform.ts";
import { DataSourceRegistryModelPlatform } from "./dataSourceRegistryModelPlatform.ts";
import { DataSourceKnowledgeValidationPlatform } from "./dataSourceKnowledgeValidationRunner.ts";
import * as manifestApi from "./dataSourceKnowledgeRegistryManifestPlatform.ts";
import {
  DataSourceKnowledgeCompatibilityManifest,
  DataSourceKnowledgeDependencyManifest,
  DataSourceKnowledgeGuaranteeManifest,
  DataSourceKnowledgeInventoryManifest,
  DataSourceKnowledgePhaseManifest,
  DataSourceKnowledgeRegistryManifestPlatform,
  DataSourceKnowledgeRegistryManifestSummary,
  DataSourceKnowledgeReleaseReadiness,
} from "./dataSourceKnowledgeRegistryManifestPlatform.ts";
import { CANONICAL_MANIFEST_SECTIONS } from "./dataSourceKnowledgeManifestTypes.ts";

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
  "DataSourceKnowledgeRegistryManifestPlatform",
  "DataSourceKnowledgePhaseManifest",
  "DataSourceKnowledgeInventoryManifest",
  "DataSourceKnowledgeDependencyManifest",
  "DataSourceKnowledgeCompatibilityManifest",
  "DataSourceKnowledgeGuaranteeManifest",
  "DataSourceKnowledgeReleaseReadiness",
  "DataSourceKnowledgeRegistryManifestSummary",
];

test("2. canonical manifest module has exactly eight runtime exports", () => {
  assert.equal(Object.keys(manifestApi).length, 8);
  assert.deepEqual(Object.keys(manifestApi).sort(), [...EXPECTED_PUBLIC_API].sort());
});

test("3. exactly nine ordered manifest sections exist", () => {
  assert.equal(CANONICAL_MANIFEST_SECTIONS.length, 9);
  assert.deepEqual(
    [...DataSourceKnowledgeRegistryManifestPlatform.identity.sections],
    [
      "foundation",
      "registry",
      "model",
      "validation",
      "phaseInventory",
      "dependencyMap",
      "compatibility",
      "guarantees",
      "releaseReadiness",
    ]
  );
});

test("4, 5. exactly four phase entries in DKL-2:1..2:4 order", () => {
  assert.equal(DataSourceKnowledgePhaseManifest.entries.length, 4);
  assert.deepEqual(
    DataSourceKnowledgePhaseManifest.entries.map((entry) => entry.phaseId),
    ["DKL-2:1", "DKL-2:2", "DKL-2:3", "DKL-2:4"]
  );
});

test("6. phase file (artifact) counts are 7, 8, 9, 9", () => {
  assert.deepEqual(
    DataSourceKnowledgePhaseManifest.entries.map((entry) => entry.artifactCount),
    [7, 8, 9, 9]
  );
});

test("7. phase runtime export counts are 7, 8, 9, 7", () => {
  assert.deepEqual(
    DataSourceKnowledgePhaseManifest.entries.map((entry) => entry.runtimeExportCount),
    [7, 8, 9, 7]
  );
});

test("8. total artifact count is 33", () => {
  const total = DataSourceKnowledgePhaseManifest.entries.reduce((sum, e) => sum + e.artifactCount, 0);
  assert.equal(total, 33);
  assert.equal(DataSourceKnowledgeRegistryManifestSummary.artifactCount, 33);
});

test("9. total prior runtime export count is 31", () => {
  assert.equal(DataSourceKnowledgeInventoryManifest.publicSurface.totalPriorExports, 31);
  assert.equal(DataSourceKnowledgeRegistryManifestSummary.priorRuntimeExportCount, 31);
});

test("10. foundation inventory counts match public metadata", () => {
  const foundation = DataSourceKnowledgeInventoryManifest.foundation;
  assert.equal(foundation.dataSourceCategories, DataSourceKnowledgeRegistryMetadata.dataSourceCategories.length);
  assert.equal(foundation.knowledgeCategories, DataSourceKnowledgeRegistryMetadata.knowledgeCategories.length);
  assert.equal(foundation.connectorCategories, DataSourceKnowledgeRegistryMetadata.connectorTypes.length);
  assert.equal(foundation.contentCategories, DataSourceKnowledgeRegistryMetadata.contentTypes.length);
  assert.equal(foundation.metadataCategories, DataSourceKnowledgeRegistryMetadata.metadataTypes.length);
  assert.equal(foundation.sourceGroups, DataSourceKnowledgeRegistryMetadata.sourceCategories.length);
});

test("11. registry inventory count is exactly 95", () => {
  const registry = DataSourceKnowledgeInventoryManifest.registry;
  const total =
    registry.dataSourceEntries +
    registry.knowledgeEntries +
    registry.connectorEntries +
    registry.contentEntries +
    registry.sourceGroupEntries +
    registry.compatibilityRelationships;
  assert.equal(total, 95);
  assert.equal(DataSourceKnowledgeRegistryManifestSummary.registryEntryCount, 95);
});

test("12. model count is exactly 86", () => {
  assert.equal(DataSourceKnowledgeInventoryManifest.model.totalModels, 86);
  assert.equal(DataSourceKnowledgeRegistryManifestSummary.modelCount, 86);
});

test("13. validation inventory reports 40/40 PASS", () => {
  const validation = DataSourceKnowledgeInventoryManifest.validation;
  assert.equal(validation.categories, 10);
  assert.equal(validation.rules, 40);
  assert.equal(validation.pass, 40);
  assert.equal(validation.fail, 0);
  assert.equal(validation.warning, 0);
  assert.equal(validation.notApplicable, 0);
  assert.equal(validation.status, "ValidationCertified");
});

test("14, 15, 16. dependency graph is forward-only, cycle-free, public-API-only", () => {
  assert.equal(DataSourceKnowledgeDependencyManifest.forwardOnly, true);
  assert.equal(DataSourceKnowledgeDependencyManifest.cycleFree, true);
  assert.equal(DataSourceKnowledgeDependencyManifest.publicApiOnly, true);
  assert.deepEqual(
    DataSourceKnowledgeDependencyManifest.entries.map((entry) => entry.phaseId),
    ["DKL-2:1", "DKL-2:2", "DKL-2:3", "DKL-2:4", "DKL-2:5"]
  );
  const dkl25 = DataSourceKnowledgeDependencyManifest.entries.find((e) => e.phaseId === "DKL-2:5");
  assert.deepEqual([...(dkl25?.directDependencies ?? [])], ["DKL-2:1", "DKL-2:2", "DKL-2:3", "DKL-2:4"]);
});

test("17. compatibility count is exactly 24", () => {
  assert.equal(DataSourceKnowledgeCompatibilityManifest.totalRelationships, 24);
  assert.ok(DataSourceKnowledgeCompatibilityManifest.nonGuarantee.length > 0);
});

test("18, 19. exactly 12 guarantees all reporting Guaranteed", () => {
  assert.equal(DataSourceKnowledgeGuaranteeManifest.guarantees.length, 12);
  assert.equal(DataSourceKnowledgeRegistryManifestSummary.guaranteeCount, 12);
  assert.ok(DataSourceKnowledgeGuaranteeManifest.guarantees.every((g) => g.status === "Guaranteed"));
});

test("20. identifiers are globally unique within their manifest domains", () => {
  const phaseIds = DataSourceKnowledgePhaseManifest.entries.map((e) => e.phaseId);
  const guaranteeIds = DataSourceKnowledgeGuaranteeManifest.guarantees.map((g) => g.guaranteeId);
  assert.equal(new Set(phaseIds).size, phaseIds.length);
  assert.equal(new Set(guaranteeIds).size, guaranteeIds.length);
});

test("21. all public manifest objects are deeply frozen", () => {
  assert.ok(isDeeplyFrozen(DataSourceKnowledgeRegistryManifestPlatform));
  assert.ok(isDeeplyFrozen(DataSourceKnowledgePhaseManifest));
  assert.ok(isDeeplyFrozen(DataSourceKnowledgeInventoryManifest));
  assert.ok(isDeeplyFrozen(DataSourceKnowledgeDependencyManifest));
  assert.ok(isDeeplyFrozen(DataSourceKnowledgeCompatibilityManifest));
  assert.ok(isDeeplyFrozen(DataSourceKnowledgeGuaranteeManifest));
  assert.ok(isDeeplyFrozen(DataSourceKnowledgeReleaseReadiness));
  assert.ok(isDeeplyFrozen(DataSourceKnowledgeRegistryManifestSummary));
});

test("22. prior-phase platform objects are preserved by reference", () => {
  assert.equal(DataSourceKnowledgeRegistryManifestPlatform.registry, DataSourceKnowledgeRegistryPlatform);
  assert.equal(DataSourceKnowledgeRegistryManifestPlatform.model, DataSourceRegistryModelPlatform);
  assert.equal(DataSourceKnowledgeRegistryManifestPlatform.validation, DataSourceKnowledgeValidationPlatform);
  assert.equal(DataSourceKnowledgeRegistryManifestPlatform.phaseInventory, DataSourceKnowledgePhaseManifest);
});

test("23, 24. unknown phase and guarantee ids return undefined", () => {
  assert.equal(DataSourceKnowledgeRegistryManifestPlatform.getPhaseById("DKL-9:9"), undefined);
  assert.equal(DataSourceKnowledgeRegistryManifestPlatform.getGuaranteeById("dsk-guarantee-missing"), undefined);
  assert.equal(DataSourceKnowledgePhaseManifest.getByPhaseId("nope"), undefined);
  assert.equal(DataSourceKnowledgeGuaranteeManifest.getByGuaranteeId("nope"), undefined);
});

test("known lookups resolve to canonical entries", () => {
  assert.equal(DataSourceKnowledgeRegistryManifestPlatform.getPhaseById("DKL-2:1")?.phaseKind, "Foundation");
  assert.equal(
    DataSourceKnowledgeRegistryManifestPlatform.getGuaranteeById("dsk-guarantee-validation-certified")?.status,
    "Guaranteed"
  );
});

test("25. repeated summary access is deterministic", () => {
  assert.equal(
    DataSourceKnowledgeRegistryManifestPlatform.summary,
    DataSourceKnowledgeRegistryManifestPlatform.summary
  );
  assert.equal(
    DataSourceKnowledgeRegistryManifestPlatform.getInventorySummary(),
    DataSourceKnowledgeRegistryManifestPlatform.getInventorySummary()
  );
  assert.deepEqual(
    { ...DataSourceKnowledgeRegistryManifestSummary },
    { ...DataSourceKnowledgeRegistryManifestSummary }
  );
});

test("26. no forbidden runtime behavior is exposed by public APIs", () => {
  const forbidden = /discover|ingest|parse|crawl|synchron|persist|fetch|embedding|extract|async|await/i;
  for (const name of Object.keys(manifestApi)) {
    assert.ok(!forbidden.test(name), `public API ${name} must not imply runtime behavior`);
  }
});

test("27, 28, 29. manifest status, readiness, and next phase are canonical", () => {
  assert.equal(DataSourceKnowledgeRegistryManifestSummary.status, "ManifestComplete");
  assert.equal(DataSourceKnowledgeRegistryManifestSummary.readiness, "ReadyForPlatform");
  assert.equal(DataSourceKnowledgeRegistryManifestSummary.nextPhase, "DKL-2:6");
  assert.equal(DataSourceKnowledgeReleaseReadiness.manifestStatus, "ManifestComplete");
  assert.equal(DataSourceKnowledgeReleaseReadiness.certificationState, "ReadyForPlatform");
  assert.equal(DataSourceKnowledgeReleaseReadiness.validationStatus, "ValidationCertified");
  assert.equal(DataSourceKnowledgeReleaseReadiness.blockingIssueCount, 0);
  assert.equal(DataSourceKnowledgeRegistryManifestPlatform.identity.status, "ManifestComplete");
});
