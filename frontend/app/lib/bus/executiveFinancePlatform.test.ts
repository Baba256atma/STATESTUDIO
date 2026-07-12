import assert from "node:assert/strict";
import test from "node:test";

import { ExecutiveFinancePlatformFoundation as ContractsFoundation } from "./financeIndex.ts";
import { ExecutiveFinanceRegistryFoundation } from "./financeRegistryIndex.ts";
import { ExecutiveFinanceManifestFoundation } from "./financeManifestIndex.ts";
import { ExecutiveFinanceModelFoundation } from "./financeModelIndex.ts";
import { ExecutiveFinanceValidationFoundation } from "./financeValidationIndex.ts";
import {
  ExecutiveFinancePlatform,
  ExecutiveFinancePlatformFoundation,
  ExecutiveFinancePlatformRegistry,
  buildExecutiveFinancePlatform,
  getExecutiveFinancePlatform,
  getExecutiveFinancePlatformManifest,
  runExecutiveFinancePlatform,
} from "./executiveFinancePlatformIndex.ts";

test("consumes previous phases only through public APIs", () => {
  assert.equal(ContractsFoundation.FinanceIdentity.platformId, "BUS-28");
  assert.equal(ExecutiveFinanceRegistryFoundation.FinanceObjectRegistry.objects.length, 16);
  assert.equal(ExecutiveFinanceModelFoundation.FinanceModelRegistry.entities.length, 16);
  assert.equal(typeof ExecutiveFinanceValidationFoundation.runFinanceValidation, "function");
  assert.equal(typeof ExecutiveFinanceManifestFoundation.getFinanceManifest, "function");
});

test("platform registry is immutable", () => {
  assert.equal(Object.isFrozen(ExecutiveFinancePlatformRegistry), true);
  assert.equal(ExecutiveFinancePlatformRegistry.platformCode, "EXEC_FIN");
  assert.equal(ExecutiveFinancePlatformRegistry.validationSummary.validationCount, 6);
});

test("platform runner is deterministic", () => {
  const first = runExecutiveFinancePlatform();
  const second = runExecutiveFinancePlatform();

  assert.deepEqual(first, second);
  assert.equal(first.metadataOnly, true);
  assert.equal(first.immutable, true);
});

test("manifest is complete", () => {
  const manifest = getExecutiveFinancePlatformManifest();

  assert.equal(manifest.platformIdentity.platformId, "BUS-28");
  assert.deepEqual([...manifest.supportedPhases], [
    "BUS-28:1",
    "BUS-28:2",
    "BUS-28:3",
    "BUS-28:4",
    "BUS-28:5",
    "BUS-28:6",
  ]);
  assert.equal(manifest.compatibilityStatus, "Compatible");
  assert.equal(manifest.validationStatus, "Ready");
  assert.equal(manifest.freezeReadiness, "Ready");
});

test("namespace exports are correct", () => {
  assert.equal(typeof ExecutiveFinancePlatform.buildExecutiveFinancePlatform, "function");
  assert.equal(typeof ExecutiveFinancePlatform.runExecutiveFinancePlatform, "function");
  assert.equal(typeof ExecutiveFinancePlatform.getExecutiveFinancePlatform, "function");
  assert.equal(typeof ExecutiveFinancePlatform.getExecutiveFinancePlatformManifest, "function");
  assert.equal(Object.isFrozen(ExecutiveFinancePlatformFoundation), true);
});

test("platform summary is correct", () => {
  const platform = getExecutiveFinancePlatform();

  assert.equal(platform.platform.registry.dependencySummary.dependencyCount, 4);
  assert.equal(platform.platform.registry.compatibilitySummary.compatibilityCount, 6);
  assert.equal(platform.platform.registry.validationSummary.passedCount, 6);
  assert.equal(platform.platform.registry.platformReleaseState, "Draft");
});

test("public APIs are exported", () => {
  assert.equal(typeof buildExecutiveFinancePlatform, "function");
  assert.equal(typeof runExecutiveFinancePlatform, "function");
  assert.equal(typeof getExecutiveFinancePlatform, "function");
  assert.equal(typeof getExecutiveFinancePlatformManifest, "function");
});

test("zero runtime side effects", () => {
  const platform = buildExecutiveFinancePlatform();

  assert.equal(platform.metadataOnly, true);
  assert.equal(platform.immutable, true);
  assert.equal(ExecutiveFinancePlatformFoundation.metadataOnly, true);
  assert.equal(ExecutiveFinancePlatformFoundation.immutable, true);
});
