import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveBusinessHealthValidationDescription,
  ExecutiveBusinessHealthValidationId,
  ExecutiveBusinessHealthValidationName,
  ExecutiveBusinessHealthValidationVersion,
  buildExecutiveBusinessHealthValidationSummary,
  getExecutiveBusinessHealthValidationChecks,
  getExecutiveBusinessHealthValidationMetadata,
  validateExecutiveBusinessHealthModel,
} from "./executiveBusinessHealthValidationIndex.ts";

test("all validation metadata builds correctly", () => {
  const result = validateExecutiveBusinessHealthModel();
  assert.equal(ExecutiveBusinessHealthValidationId, "BUS-32:4");
  assert.equal(ExecutiveBusinessHealthValidationVersion, "1.0.0");
  assert.equal(
    ExecutiveBusinessHealthValidationName,
    "Executive Business Health Intelligence Validation",
  );
  assert.equal(
    ExecutiveBusinessHealthValidationDescription,
    "Canonical metadata-only validation layer for executive business health intelligence.",
  );
  assert.equal(result.validationId, "BUS-32:4");
  assert.equal(Object.isFrozen(result), true);
});

test("duplicate detection and completeness metadata exist", () => {
  const checks = getExecutiveBusinessHealthValidationChecks();
  assert.equal(
    checks.some((check) => check.name === "Domain Uniqueness"),
    true,
  );
  assert.equal(
    checks.some((check) => check.name === "Dimension Uniqueness"),
    true,
  );
  assert.equal(
    checks.some((check) => check.name === "Canonical Model Completeness"),
    true,
  );
  assert.equal(
    checks.some((check) => check.name === "Registry Immutability"),
    true,
  );
});

test("helper APIs are deterministic and metadata-only", () => {
  const result = validateExecutiveBusinessHealthModel();
  const summary = buildExecutiveBusinessHealthValidationSummary();
  const metadata = getExecutiveBusinessHealthValidationMetadata();
  assert.equal(summary.totalChecks, result.checks.length);
  assert.equal(summary.failedChecks, 0);
  assert.equal(metadata.metadataOnly, true);
  assert.equal(metadata.immutable, true);
});

test("public exports are correct and no runtime execution exists", () => {
  const checks = getExecutiveBusinessHealthValidationChecks();
  assert.equal(Array.isArray(checks), true);
  assert.equal(checks.every((check) => check.metadataOnly && check.immutable), true);
  assert.equal(
    checks.some((check) => check.category === "Public API"),
    false,
  );
  assert.equal(
    getExecutiveBusinessHealthValidationMetadata().categories.includes("Public API"),
    true,
  );
});

test("validation metadata is immutable", () => {
  assert.equal(Object.isFrozen(getExecutiveBusinessHealthValidationChecks()), true);
  assert.equal(Object.isFrozen(buildExecutiveBusinessHealthValidationSummary()), true);
  assert.equal(Object.isFrozen(getExecutiveBusinessHealthValidationMetadata()), true);
});
