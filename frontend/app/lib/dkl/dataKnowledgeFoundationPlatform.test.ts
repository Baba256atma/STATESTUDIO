import assert from "node:assert/strict";
import test from "node:test";

import { DataKnowledgeFoundation } from "./dataKnowledgeFoundation.ts";
import { DataKnowledgeFoundationManifest } from "./dataKnowledgeFoundationManifestIndex.ts";
import { getDataKnowledgeFoundationManifestSummary } from "./dataKnowledgeFoundationManifestIndex.ts";
import { DataKnowledgeFoundationModel } from "./dataKnowledgeFoundationModel.ts";
import * as platformApi from "./dataKnowledgeFoundationPlatformIndex.ts";
import {
  DataKnowledgeFoundationPlatform,
  DataKnowledgeFoundationPlatformMetadata,
  DataKnowledgeFoundationPlatformRegistry,
  DataKnowledgeFoundationPlatformSummary,
  getDataKnowledgeFoundationPlatform,
  getDataKnowledgeFoundationPlatformMetadata,
  getDataKnowledgeFoundationPlatformRegistry,
  getDataKnowledgeFoundationPlatformSummary,
} from "./dataKnowledgeFoundationPlatformIndex.ts";
import { DataKnowledgeFoundationRegistry } from "./dataKnowledgeFoundationRegistryIndex.ts";
import { DataKnowledgeFoundationValidation } from "./dataKnowledgeFoundationValidation.ts";
import { isDeeplyFrozen } from "./dataKnowledgeFoundationValidationTypes.ts";

const EXPECTED_PUBLIC_API = [
  "DataKnowledgeFoundationPlatform",
  "DataKnowledgeFoundationPlatformMetadata",
  "DataKnowledgeFoundationPlatformRegistry",
  "DataKnowledgeFoundationPlatformSummary",
  "getDataKnowledgeFoundationPlatform",
  "getDataKnowledgeFoundationPlatformSummary",
  "getDataKnowledgeFoundationPlatformMetadata",
  "getDataKnowledgeFoundationPlatformRegistry",
];

test("platform exists and exports exactly eight public APIs", () => {
  assert.ok(DataKnowledgeFoundationPlatform);
  assert.equal(Object.keys(platformApi).length, 8);
  assert.deepEqual(Object.keys(platformApi).sort(), [...EXPECTED_PUBLIC_API].sort());
});

test("platform, metadata, registry, and summary are deeply frozen", () => {
  assert.equal(isDeeplyFrozen(DataKnowledgeFoundationPlatform), true);
  assert.equal(isDeeplyFrozen(DataKnowledgeFoundationPlatformMetadata), true);
  assert.equal(isDeeplyFrozen(DataKnowledgeFoundationPlatformRegistry), true);
  assert.equal(isDeeplyFrozen(DataKnowledgeFoundationPlatformSummary), true);
});

test("metadata, registry, and summary sections exist on the platform", () => {
  assert.ok(DataKnowledgeFoundationPlatform.metadata);
  assert.ok(DataKnowledgeFoundationPlatform.registry);
  assert.ok(DataKnowledgeFoundationPlatform.summary);
});

test("platform references the canonical Foundation object", () => {
  assert.equal(DataKnowledgeFoundationPlatform.foundation, DataKnowledgeFoundation);
});

test("platform references the canonical Registry object", () => {
  assert.equal(DataKnowledgeFoundationPlatform.registrySection, DataKnowledgeFoundationRegistry);
});

test("platform references the canonical Model object", () => {
  assert.equal(DataKnowledgeFoundationPlatform.model, DataKnowledgeFoundationModel);
});

test("platform references the canonical Validation object", () => {
  assert.equal(DataKnowledgeFoundationPlatform.validation, DataKnowledgeFoundationValidation);
});

test("platform references the canonical Manifest object", () => {
  assert.equal(DataKnowledgeFoundationPlatform.manifest, DataKnowledgeFoundationManifest);
});

test("registry counts match Manifest", () => {
  const manifestSummary = getDataKnowledgeFoundationManifestSummary();
  assert.equal(DataKnowledgeFoundationPlatformRegistry.registeredPhases, manifestSummary.totalPhases);
  assert.equal(DataKnowledgeFoundationPlatformRegistry.registeredSections, manifestSummary.totalPhases + 1);
  assert.equal(DataKnowledgeFoundationPlatformRegistry.totalPublicApis, manifestSummary.totalPublicApis);
  assert.equal(DataKnowledgeFoundationPlatformRegistry.totalValidationRules, manifestSummary.totalValidationRules);
  assert.equal(DataKnowledgeFoundationPlatformRegistry.totalModels, manifestSummary.totalModels);
  assert.equal(DataKnowledgeFoundationPlatformRegistry.totalComponents, manifestSummary.totalRegistryComponents);
});

test("summary matches Manifest", () => {
  const manifestSummary = getDataKnowledgeFoundationManifestSummary();
  assert.equal(DataKnowledgeFoundationPlatformSummary.phaseCount, manifestSummary.totalPhases);
  assert.equal(DataKnowledgeFoundationPlatformSummary.sectionCount, manifestSummary.totalPhases + 1);
  assert.equal(DataKnowledgeFoundationPlatformSummary.publicApiCount, manifestSummary.totalPublicApis);
  assert.equal(DataKnowledgeFoundationPlatformSummary.validationRuleCount, manifestSummary.totalValidationRules);
  assert.equal(DataKnowledgeFoundationPlatformSummary.modelCount, manifestSummary.totalModels);
});

test("metadata values are correct", () => {
  assert.equal(DataKnowledgeFoundationPlatformMetadata.platformId, "DKL-1:6");
  assert.equal(DataKnowledgeFoundationPlatformMetadata.name, "Data Knowledge Foundation Platform");
  assert.equal(DataKnowledgeFoundationPlatformMetadata.namespace, "nexora.dkl.foundation.platform");
  assert.equal(DataKnowledgeFoundationPlatformMetadata.version, "1.0.0");
  assert.equal(DataKnowledgeFoundationPlatformMetadata.stability, "STABLE");
  assert.equal(DataKnowledgeFoundationPlatformMetadata.certification, "CERTIFIED");
  assert.equal(DataKnowledgeFoundationPlatformMetadata.buildStatus, "CERTIFIED");
  assert.equal(DataKnowledgeFoundationPlatformMetadata.readiness, "ReadyForCertification");
});

test("platform guarantees are complete", () => {
  const guarantees = DataKnowledgeFoundationPlatformMetadata.guarantees;
  assert.equal(guarantees.metadataOnly, true);
  assert.equal(guarantees.runtimeFree, true);
  assert.equal(guarantees.deepFrozen, true);
  assert.equal(guarantees.deterministic, true);
  assert.equal(guarantees.publicApiStable, true);
  assert.equal(guarantees.manifestDriven, true);
  assert.equal(guarantees.ownershipProtected, true);
  assert.equal(guarantees.dependencyProtected, true);
});

test("no duplicated metadata: sections are referenced, not copied", () => {
  assert.equal(DataKnowledgeFoundationPlatform.metadata, DataKnowledgeFoundationPlatformMetadata);
  assert.equal(DataKnowledgeFoundationPlatform.registry, DataKnowledgeFoundationPlatformRegistry);
  assert.equal(DataKnowledgeFoundationPlatform.summary, DataKnowledgeFoundationPlatformSummary);
  assert.equal(DataKnowledgeFoundationPlatform.foundation, DataKnowledgeFoundation);
  assert.equal(DataKnowledgeFoundationPlatform.manifest, DataKnowledgeFoundationManifest);
});

test("canonical references are preserved with identity equality", () => {
  assert.equal(DataKnowledgeFoundationPlatform.foundation, DataKnowledgeFoundation);
  assert.equal(DataKnowledgeFoundationPlatform.registrySection, DataKnowledgeFoundationRegistry);
  assert.equal(DataKnowledgeFoundationPlatform.model, DataKnowledgeFoundationModel);
  assert.equal(DataKnowledgeFoundationPlatform.validation, DataKnowledgeFoundationValidation);
  assert.equal(DataKnowledgeFoundationPlatform.manifest, DataKnowledgeFoundationManifest);
});

test("accessor APIs return canonical references", () => {
  assert.equal(getDataKnowledgeFoundationPlatform(), DataKnowledgeFoundationPlatform);
  assert.equal(getDataKnowledgeFoundationPlatformMetadata(), DataKnowledgeFoundationPlatformMetadata);
  assert.equal(getDataKnowledgeFoundationPlatformRegistry(), DataKnowledgeFoundationPlatformRegistry);
  assert.equal(getDataKnowledgeFoundationPlatformSummary(), DataKnowledgeFoundationPlatformSummary);
});

test("repeated summary calls are deterministic", () => {
  assert.equal(getDataKnowledgeFoundationPlatformSummary(), getDataKnowledgeFoundationPlatformSummary());
  assert.deepEqual(getDataKnowledgeFoundationPlatformSummary(), getDataKnowledgeFoundationPlatformSummary());
  assert.equal(DataKnowledgeFoundationPlatformSummary.readiness, "ReadyForCertification");
  assert.equal(DataKnowledgeFoundationPlatformSummary.certification, "CERTIFIED");
});

test("aggregate platform remains immutable", () => {
  assert.throws(() => {
    // @ts-expect-error runtime immutability guard
    DataKnowledgeFoundationPlatform.metadataOnly = false;
  }, TypeError);
});

test("earlier phase metadata remains unchanged", () => {
  assert.equal(DataKnowledgeFoundation.identity.version, "1.0.0");
  assert.equal(DataKnowledgeFoundationRegistry.manifest.registryId, "DKL-1:2");
  assert.equal(DataKnowledgeFoundationModel.manifest.modelId, "DKL-1:3");
  assert.equal(DataKnowledgeFoundationValidation.manifest.validationId, "DKL-1:4");
  assert.equal(DataKnowledgeFoundationManifest.release.manifestId, "DKL-1:5");
});

test("no runtime behavior exists in the public API surface", () => {
  const runtimeLike = Object.keys(platformApi).some((key) =>
    /parse|store|query|fetch|render|ingest|connect|infer|scan|network|database|filesystem|async/i.test(key)
  );
  assert.equal(runtimeLike, false);

  const functionExports = Object.entries(platformApi).filter(([, value]) => typeof value === "function");
  assert.deepEqual(
    functionExports.map(([key]) => key).sort(),
    [
      "getDataKnowledgeFoundationPlatform",
      "getDataKnowledgeFoundationPlatformMetadata",
      "getDataKnowledgeFoundationPlatformRegistry",
      "getDataKnowledgeFoundationPlatformSummary",
    ]
  );
});
