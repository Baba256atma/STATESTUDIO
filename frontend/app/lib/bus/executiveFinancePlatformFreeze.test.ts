import assert from "node:assert/strict";
import test from "node:test";

import { ExecutiveFinancePlatformFoundation as ContractsFoundation } from "./financeIndex.ts";
import { ExecutiveFinanceRegistryFoundation } from "./financeRegistryIndex.ts";
import { ExecutiveFinanceModelFoundation } from "./financeModelIndex.ts";
import { ExecutiveFinanceValidationFoundation } from "./financeValidationIndex.ts";
import { ExecutiveFinanceManifestFoundation } from "./financeManifestIndex.ts";
import { ExecutiveFinancePlatformFoundation } from "./executiveFinancePlatformIndex.ts";
import { ExecutiveFinancePlatformCertificationFoundation } from "./executiveFinancePlatformCertificationIndex.ts";
import {
  ExecutiveFinancePlatformCompatibility,
  ExecutiveFinancePlatformFreeze,
  ExecutiveFinancePlatformFreezeFoundation,
  ExecutiveFinancePlatformFreezeRegistry,
  ExecutiveFinancePlatformRegression,
  buildExecutiveFinancePlatformFreeze,
  getExecutiveFinancePlatformFreeze,
  getExecutiveFinancePlatformFreezeManifest,
  runExecutiveFinancePlatformFreeze,
} from "./executiveFinancePlatformFreezeIndex.ts";

test("previous phases consumed only through public APIs", () => {
  assert.equal(ContractsFoundation.FinanceIdentity.platformId, "BUS-28");
  assert.equal(ExecutiveFinanceRegistryFoundation.FinanceObjectRegistry.objects.length, 16);
  assert.equal(ExecutiveFinanceModelFoundation.FinanceModelRegistry.entities.length, 16);
  assert.equal(typeof ExecutiveFinanceValidationFoundation.runFinanceValidation, "function");
  assert.equal(typeof ExecutiveFinanceManifestFoundation.getFinanceManifest, "function");
  assert.equal(typeof ExecutiveFinancePlatformFoundation.getExecutiveFinancePlatform, "function");
  assert.equal(typeof ExecutiveFinancePlatformCertificationFoundation.runner.runExecutiveFinancePlatformCertification, "function");
});

test("freeze registry immutable", () => {
  assert.equal(Object.isFrozen(ExecutiveFinancePlatformFreezeRegistry), true);
  assert.equal(ExecutiveFinancePlatformFreezeRegistry.releaseStatus, "Frozen");
  assert.equal(ExecutiveFinancePlatformFreezeRegistry.certificationStatus, "Certified");
});

test("compatibility matrix complete", () => {
  assert.equal(ExecutiveFinancePlatformCompatibility.entries.length, 8);
  assert.equal(
    ExecutiveFinancePlatformCompatibility.entries.every((entry) => entry.compatibilityStatus === "Compatible"),
    true,
  );
});

test("manifest complete", () => {
  const manifest = getExecutiveFinancePlatformFreezeManifest();

  assert.equal(manifest.certifiedPhases.length, 7);
  assert.equal(manifest.frozenPhases.length, 8);
  assert.equal(manifest.publicApiRegistry.length, 6);
  assert.equal(manifest.freezeReadiness, "Ready");
  assert.equal(manifest.releaseReadiness, "Ready");
});

test("regression summary complete", () => {
  assert.equal(ExecutiveFinancePlatformRegression.contractIntegrity, "Preserved");
  assert.equal(ExecutiveFinancePlatformRegression.publicApiIntegrity, "Preserved");
  assert.equal(Object.isFrozen(ExecutiveFinancePlatformRegression), true);
});

test("freeze runner deterministic", () => {
  const first = runExecutiveFinancePlatformFreeze();
  const second = runExecutiveFinancePlatformFreeze();

  assert.deepEqual(first, second);
  assert.equal(first.frozen, true);
});

test("namespace exported", () => {
  assert.equal(typeof ExecutiveFinancePlatformFreezeFoundation.runner.runExecutiveFinancePlatformFreeze, "function");
  assert.equal(typeof ExecutiveFinancePlatformFreezeFoundation.runner.buildExecutiveFinancePlatformFreeze, "function");
  assert.equal(typeof ExecutiveFinancePlatformFreezeFoundation.manifest.getExecutiveFinancePlatformFreezeManifest, "function");
  assert.equal(Object.isFrozen(ExecutiveFinancePlatformFreezeFoundation), true);
});

test("public APIs exported", () => {
  assert.equal(typeof ExecutiveFinancePlatformFreeze.getExecutiveFinancePlatformFreezeManifest, "function");
  assert.equal(typeof ExecutiveFinancePlatformFreeze.buildExecutiveFinancePlatformFreeze, "function");
  assert.equal(typeof ExecutiveFinancePlatformFreeze.runExecutiveFinancePlatformFreeze, "function");
  assert.equal(typeof ExecutiveFinancePlatformFreeze.getExecutiveFinancePlatformFreeze, "function");
});

test("release metadata complete", () => {
  const freeze = buildExecutiveFinancePlatformFreeze();

  assert.equal(freeze.registry.releaseVersion, "1.0.0");
  assert.equal(freeze.registry.freezeVersion, "1.0.0");
  assert.equal(freeze.manifest.releaseIdentity.releaseStage, "Release");
  assert.equal(freeze.manifest.releaseIdentity.releaseStatus, "Frozen");
});

test("zero runtime side effects", () => {
  const freeze = getExecutiveFinancePlatformFreeze();

  assert.equal(freeze.metadataOnly, true);
  assert.equal(freeze.immutable, true);
  assert.equal(ExecutiveFinancePlatformFreezeFoundation.metadataOnly, true);
  assert.equal(ExecutiveFinancePlatformFreezeFoundation.immutable, true);
});
