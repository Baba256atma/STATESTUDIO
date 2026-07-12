import assert from "node:assert/strict";
import test from "node:test";

import { ExecutiveFinancePlatformFoundation } from "./financeIndex.ts";
import { ExecutiveFinanceRegistryFoundation, FinanceObjectRegistry } from "./financeRegistryIndex.ts";
import { ExecutiveFinanceModelFoundation } from "./financeModelIndex.ts";
import {
  ExecutiveFinanceValidationFoundation,
  FINANCE_VALIDATION_RULES,
  buildFinanceValidationRegistry,
  createFinanceValidationEntry,
  getFinanceValidation,
  getFinanceValidationManifest,
  hasDuplicateFinanceValidationIds,
  runFinanceValidation,
} from "./financeValidationIndex.ts";

test("consumes previous phases only through public APIs", () => {
  assert.equal(ExecutiveFinancePlatformFoundation.FinanceIdentity.platformId, "BUS-28");
  assert.equal(ExecutiveFinanceRegistryFoundation.FinanceObjectRegistry.objects.length, 16);
  assert.equal(ExecutiveFinanceModelFoundation.FinanceModelRegistry.entities.length, 16);
});

test("validation registry is immutable", () => {
  const validation = getFinanceValidation();

  assert.equal(Object.isFrozen(validation), true);
  assert.equal(Object.isFrozen(validation.registry), true);
  assert.equal(Object.isFrozen(validation.registry.validations), true);
});

test("all validation groups exist", () => {
  const validationTypes = FINANCE_VALIDATION_RULES.map((rule) => rule.validationType);

  assert.equal(validationTypes.includes("ContractValidation"), true);
  assert.equal(validationTypes.includes("RegistryValidation"), true);
  assert.equal(validationTypes.includes("ModelValidation"), true);
  assert.equal(validationTypes.includes("DependencyValidation"), true);
  assert.equal(validationTypes.includes("StructuralValidation"), true);
  assert.equal(validationTypes.includes("PublicApiValidation"), true);
});

test("runner produces deterministic results", () => {
  const first = runFinanceValidation();
  const second = runFinanceValidation();

  assert.deepEqual(first, second);
  assert.equal(first.valid, true);
  assert.equal(first.summary.failedCount, 0);
});

test("manifest counts are correct", () => {
  const manifest = getFinanceValidationManifest();

  assert.equal(manifest.phaseId, "BUS-28:4");
  assert.equal(manifest.validationCount, 6);
  assert.equal(manifest.passedCount, 6);
  assert.equal(manifest.warningCount, 0);
  assert.equal(manifest.failedCount, 0);
  assert.equal(manifest.publicApiCount, 15);
  assert.equal(manifest.certificationReadiness, "Ready");
});

test("public APIs are exported", () => {
  assert.equal(typeof ExecutiveFinanceValidationFoundation.runFinanceValidation, "function");
  assert.equal(typeof ExecutiveFinanceValidationFoundation.getFinanceValidation, "function");
  assert.equal(typeof ExecutiveFinanceValidationFoundation.getFinanceValidationManifest, "function");
  assert.equal(Object.isFrozen(ExecutiveFinanceValidationFoundation), true);
});

test("duplicate detection works", () => {
  const duplicateEntries = Object.freeze([
    createFinanceValidationEntry(FINANCE_VALIDATION_RULES[0], "Passed"),
    createFinanceValidationEntry(FINANCE_VALIDATION_RULES[0], "Passed"),
  ]);

  assert.equal(hasDuplicateFinanceValidationIds(duplicateEntries), true);
  const registry = buildFinanceValidationRegistry(duplicateEntries);
  assert.equal(registry.validations.length, 2);
});

test("readonly guarantees are preserved", () => {
  const validation = getFinanceValidation();

  assert.equal(validation.registry.validations.every((entry) => entry.metadataOnly && entry.immutable), true);
  assert.equal(FinanceObjectRegistry.objects.every((entry) => entry.metadataOnly && entry.immutable), true);
});

test("zero runtime side effects", () => {
  const validation = runFinanceValidation();

  assert.equal(validation.metadataOnly, true);
  assert.equal(validation.immutable, true);
  assert.equal(ExecutiveFinanceValidationFoundation.metadataOnly, true);
  assert.equal(ExecutiveFinanceValidationFoundation.immutable, true);
});
