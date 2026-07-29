import assert from "node:assert/strict";
import test from "node:test";

import { ExecutiveFinancePlatformFoundation as ContractsFoundation } from "./financeIndex.ts";
import { ExecutiveFinanceRegistryFoundation } from "./financeRegistryIndex.ts";
import { ExecutiveFinanceManifestFoundation } from "./financeManifestIndex.ts";
import { ExecutiveFinanceModelFoundation } from "./financeModelIndex.ts";
import { ExecutiveFinanceValidationFoundation } from "./financeValidationIndex.ts";
import {
  ExecutiveFinancePlatformFoundation,
  getExecutiveFinancePlatform,
} from "./executiveFinancePlatformIndex.ts";
import { ExecutiveFinancePlatformCertification, ExecutiveFinancePlatformCertificationFoundation, buildExecutiveFinancePlatformCertification, getExecutiveFinancePlatformCertification, runExecutiveFinancePlatformCertification } from "./executiveFinancePlatformCertificationIndex.ts";

test("consumes previous phases only through public APIs", () => {
  assert.equal(ContractsFoundation.FinanceIdentity.platformId, "BUS-28");
  assert.equal(ExecutiveFinanceRegistryFoundation.FinanceObjectRegistry.objects.length, 16);
  assert.equal(ExecutiveFinanceModelFoundation.FinanceModelRegistry.entities.length, 16);
  assert.equal(typeof ExecutiveFinanceValidationFoundation.runFinanceValidation, "function");
  assert.equal(typeof ExecutiveFinanceManifestFoundation.getFinanceManifest, "function");
  assert.equal(typeof ExecutiveFinancePlatformFoundation.getExecutiveFinancePlatform, "function");
});

test("certification registry is immutable", () => {
  const certification = getExecutiveFinancePlatformCertification();

  assert.equal(Object.isFrozen(certification), true);
  assert.equal(Object.isFrozen(certification.registry), true);
  assert.equal(Object.isFrozen(certification.registry.entries), true);
});

test("certification runner is deterministic", () => {
  const first = runExecutiveFinancePlatformCertification();
  const second = runExecutiveFinancePlatformCertification();

  assert.deepEqual(first, second);
  assert.equal(first.certified, true);
});

test("certification manifest is complete", () => {
  const certification = getExecutiveFinancePlatformCertification();

  assert.deepEqual([...certification.manifest.certifiedPhases], [
    "BUS-28:1",
    "BUS-28:2",
    "BUS-28:3",
    "BUS-28:4",
    "BUS-28:5",
    "BUS-28:6",
  ]);
  assert.equal(certification.manifest.certificationState, "Certified");
  assert.equal(certification.manifest.readinessForFreeze, "Ready");
});

test("summary counts are correct", () => {
  const certification = buildExecutiveFinancePlatformCertification();

  assert.equal(certification.summary.totalChecks, 8);
  assert.equal(certification.summary.passed, 8);
  assert.equal(certification.summary.warnings, 0);
  assert.equal(certification.summary.failed, 0);
  assert.equal(certification.summary.readiness, "Ready");
});

test("namespace exported", () => {
  assert.equal(typeof ExecutiveFinancePlatformCertificationFoundation.runner.runExecutiveFinancePlatformCertification, "function");
  assert.equal(typeof ExecutiveFinancePlatformCertificationFoundation.runner.getExecutiveFinancePlatformCertification, "function");
  assert.equal(typeof ExecutiveFinancePlatformCertificationFoundation.runner.buildExecutiveFinancePlatformCertification, "function");
  assert.equal(Object.isFrozen(ExecutiveFinancePlatformCertificationFoundation), true);
});

test("public APIs are exported", () => {
  assert.equal(typeof ExecutiveFinancePlatformCertification.buildExecutiveFinancePlatformCertification, "function");
  assert.equal(typeof ExecutiveFinancePlatformCertification.runExecutiveFinancePlatformCertification, "function");
  assert.equal(typeof ExecutiveFinancePlatformCertification.getExecutiveFinancePlatformCertification, "function");
  assert.equal(typeof ExecutiveFinancePlatformCertification.getExecutiveFinancePlatformCertificationManifest, "function");
});

test("zero runtime side effects", () => {
  const certification = runExecutiveFinancePlatformCertification();
  const platform = getExecutiveFinancePlatform();

  assert.equal(certification.metadataOnly, true);
  assert.equal(certification.immutable, true);
  assert.equal(platform.metadataOnly, true);
  assert.equal(ExecutiveFinancePlatformCertificationFoundation.metadataOnly, true);
});
