import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";

import {
  ExecutiveFinancePlatformPublicFoundation,
  ExecutiveFinancePlatformPublicIndex,
  getExecutiveFinancePlatformPublicFoundation,
  getExecutiveFinancePlatformPublicIndex,
} from "./executiveFinancePlatformPublicIndex.ts";

test("public index imports only public index and facade files", () => {
  const source = fs.readFileSync(
    new URL("./executiveFinancePlatformPublicIndex.ts", import.meta.url),
    "utf8",
  );

  const requiredImports = [
    "./financeIndex.ts",
    "./financeRegistryIndex.ts",
    "./financeModelIndex.ts",
    "./financeValidationIndex.ts",
    "./financeManifestIndex.ts",
    "./executiveFinancePlatformIndex.ts",
    "./executiveFinancePlatformCertificationIndex.ts",
    "./executiveFinancePlatformFreezeIndex.ts",
  ];

  requiredImports.forEach((importPath) => {
    assert.equal(source.includes(importPath), true);
  });

  const forbiddenImports = [
    "./financeContracts.ts",
    "./financeObjectRegistry.ts",
    "./financeModelRegistry.ts",
    "./financeValidationRunner.ts",
    "./financeManifest.ts",
    "./executiveFinancePlatformRunner.ts",
    "./executiveFinancePlatformCertificationRunner.ts",
    "./executiveFinancePlatformFreezeRunner.ts",
  ];

  forbiddenImports.forEach((importPath) => {
    assert.equal(source.includes(importPath), false);
  });
});

test("all BUS-28 public phases are exported through namespace", () => {
  assert.ok(ExecutiveFinancePlatformPublicFoundation.contracts);
  assert.ok(ExecutiveFinancePlatformPublicFoundation.registry);
  assert.ok(ExecutiveFinancePlatformPublicFoundation.model);
  assert.ok(ExecutiveFinancePlatformPublicFoundation.validation);
  assert.ok(ExecutiveFinancePlatformPublicFoundation.manifest);
  assert.ok(ExecutiveFinancePlatformPublicFoundation.platform);
  assert.ok(ExecutiveFinancePlatformPublicFoundation.certification);
  assert.ok(ExecutiveFinancePlatformPublicFoundation.freeze);
  assert.ok(ExecutiveFinancePlatformPublicFoundation.publicIndex);
});

test("public namespace is frozen", () => {
  assert.equal(Object.isFrozen(ExecutiveFinancePlatformPublicFoundation), true);
  assert.equal(ExecutiveFinancePlatformPublicFoundation.metadataOnly, true);
  assert.equal(ExecutiveFinancePlatformPublicFoundation.immutable, true);
});

test("public index metadata is frozen", () => {
  assert.equal(Object.isFrozen(ExecutiveFinancePlatformPublicIndex), true);
  assert.equal(Object.isFrozen(ExecutiveFinancePlatformPublicIndex.boundaryPolicy), true);
  assert.equal(ExecutiveFinancePlatformPublicIndex.metadataOnly, true);
  assert.equal(ExecutiveFinancePlatformPublicIndex.immutable, true);
});

test("getter APIs are deterministic", () => {
  assert.equal(getExecutiveFinancePlatformPublicIndex(), ExecutiveFinancePlatformPublicIndex);
  assert.equal(getExecutiveFinancePlatformPublicFoundation(), ExecutiveFinancePlatformPublicFoundation);
});

test("certification status is certified", () => {
  assert.equal(ExecutiveFinancePlatformPublicIndex.certificationStatus, "Certified");
});

test("freeze status is frozen", () => {
  assert.equal(ExecutiveFinancePlatformPublicIndex.freezeStatus, "Frozen");
});

test("release status is released", () => {
  assert.equal(ExecutiveFinancePlatformPublicIndex.releaseStatus, "Released");
});

test("public index metadata is complete", () => {
  assert.equal(ExecutiveFinancePlatformPublicIndex.publicIndexId, "executive-finance-platform-public-index");
  assert.equal(ExecutiveFinancePlatformPublicIndex.platformCode, "EXEC_FIN");
  assert.equal(ExecutiveFinancePlatformPublicIndex.exportedPhaseCount, 8);
  assert.equal(ExecutiveFinancePlatformPublicIndex.exportedApiCount, 47);
  assert.deepEqual([...ExecutiveFinancePlatformPublicIndex.consumedPublicIndexes], [
    "financeIndex.ts",
    "financeRegistryIndex.ts",
    "financeModelIndex.ts",
    "financeValidationIndex.ts",
    "financeManifestIndex.ts",
    "executiveFinancePlatformIndex.ts",
    "executiveFinancePlatformCertificationIndex.ts",
    "executiveFinancePlatformFreezeIndex.ts",
  ]);
});

test("no runtime behavior exists", () => {
  assert.equal(ExecutiveFinancePlatformPublicIndex.boundaryPolicy.runtimeExecutionAllowed, false);
});
