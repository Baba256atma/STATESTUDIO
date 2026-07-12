import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveReportingValidationDescription,
  ExecutiveReportingValidationId,
  ExecutiveReportingValidationName,
  ExecutiveReportingValidationVersion,
  buildExecutiveReportingValidationSummary,
  getExecutiveReportingValidationChecks,
  getExecutiveReportingValidationMetadata,
  validateExecutiveReportingModel,
} from "./executiveReportingValidationIndex.ts";

test("validation metadata builds correctly", () => {
  const result = validateExecutiveReportingModel();
  assert.equal(ExecutiveReportingValidationId, "BUS-33:4");
  assert.equal(ExecutiveReportingValidationVersion, "1.0.0");
  assert.equal(
    ExecutiveReportingValidationName,
    "Executive Reporting Intelligence Validation",
  );
  assert.equal(
    ExecutiveReportingValidationDescription,
    "Canonical metadata-only validation layer for executive reporting intelligence.",
  );
  assert.equal(result.validationId, "BUS-33:4");
  assert.equal(Object.isFrozen(result), true);
});

test("all validation categories exist", () => {
  const metadata = getExecutiveReportingValidationMetadata();
  assert.equal(metadata.categories.includes("Contracts"), true);
  assert.equal(metadata.categories.includes("Registry"), true);
  assert.equal(metadata.categories.includes("Model"), true);
  assert.equal(metadata.categories.includes("Relationships"), true);
  assert.equal(metadata.categories.includes("Public API"), true);
});

test("registry, model, and relationship integrity validation exist", () => {
  const checks = getExecutiveReportingValidationChecks();
  assert.equal(
    checks.some((check) => check.name === "Format Coverage"),
    true,
  );
  assert.equal(
    checks.some((check) => check.name === "Canonical Model Completeness"),
    true,
  );
  assert.equal(
    checks.some((check) => check.name === "Audience Template Relationships"),
    true,
  );
  assert.equal(
    checks.some((check) => check.name === "Category Report Relationships"),
    true,
  );
});

test("helper APIs are deterministic and validation metadata is immutable", () => {
  const result = validateExecutiveReportingModel();
  const summary = buildExecutiveReportingValidationSummary();
  const metadata = getExecutiveReportingValidationMetadata();
  assert.equal(summary.totalChecks, result.checks.length);
  assert.equal(summary.failedChecks, 0);
  assert.equal(Object.isFrozen(getExecutiveReportingValidationChecks()), true);
  assert.equal(Object.isFrozen(summary), true);
  assert.equal(Object.isFrozen(metadata), true);
});

test("public exports are correct and no runtime behavior exists", () => {
  const checks = getExecutiveReportingValidationChecks();
  assert.equal(Array.isArray(checks), true);
  assert.equal(checks.every((check) => check.metadataOnly && check.immutable), true);
  assert.equal(
    checks.some((check) => check.category === "Public API"),
    true,
  );
  assert.equal(
    getExecutiveReportingValidationMetadata().metadataOnly,
    true,
  );
});
