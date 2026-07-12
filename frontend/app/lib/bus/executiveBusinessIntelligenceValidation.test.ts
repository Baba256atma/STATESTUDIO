import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveBusinessIntelligenceValidationDescription,
  ExecutiveBusinessIntelligenceValidationId,
  ExecutiveBusinessIntelligenceValidationName,
  ExecutiveBusinessIntelligenceValidationVersion,
  buildExecutiveBusinessIntelligenceValidationSummary,
  getExecutiveBusinessIntelligenceValidationChecks,
  getExecutiveBusinessIntelligenceValidationMetadata,
  validateExecutiveBusinessIntelligenceModel,
} from "./executiveBusinessIntelligenceValidationIndex.ts";

test("validation metadata builds correctly", () => {
  const result = validateExecutiveBusinessIntelligenceModel();
  assert.equal(ExecutiveBusinessIntelligenceValidationId, "BUS-34:4");
  assert.equal(ExecutiveBusinessIntelligenceValidationVersion, "1.0.0");
  assert.equal(
    ExecutiveBusinessIntelligenceValidationName,
    "Executive Business Intelligence Validation",
  );
  assert.equal(
    ExecutiveBusinessIntelligenceValidationDescription,
    "Canonical metadata-only validation layer for executive business intelligence.",
  );
  assert.equal(result.validationId, "BUS-34:4");
  assert.equal(Object.isFrozen(result), true);
});

test("all validation categories exist", () => {
  const metadata = getExecutiveBusinessIntelligenceValidationMetadata();
  assert.equal(metadata.categories.includes("Contracts"), true);
  assert.equal(metadata.categories.includes("Registry"), true);
  assert.equal(metadata.categories.includes("Model"), true);
  assert.equal(metadata.categories.includes("Relationships"), true);
  assert.equal(metadata.categories.includes("Public API"), true);
  assert.equal(metadata.categories.includes("Determinism"), true);
});

test("registry, model, relationship, and dependency integrity validation exist", () => {
  const checks = getExecutiveBusinessIntelligenceValidationChecks();
  assert.equal(
    checks.some((check) => check.name === "Platform Metadata Completeness"),
    true,
  );
  assert.equal(
    checks.some((check) => check.name === "Canonical Model Completeness"),
    true,
  );
  assert.equal(
    checks.some((check) => check.name === "Domain Capability Relationships"),
    true,
  );
  assert.equal(
    checks.some((check) => check.name === "Dependency Platform Mapping"),
    true,
  );
});

test("helper APIs are deterministic and validation metadata is immutable", () => {
  const result = validateExecutiveBusinessIntelligenceModel();
  const summary = buildExecutiveBusinessIntelligenceValidationSummary();
  const metadata = getExecutiveBusinessIntelligenceValidationMetadata();
  assert.equal(summary.totalChecks, result.checks.length);
  assert.equal(summary.failedChecks, 0);
  assert.equal(Object.isFrozen(getExecutiveBusinessIntelligenceValidationChecks()), true);
  assert.equal(Object.isFrozen(summary), true);
  assert.equal(Object.isFrozen(metadata), true);
});

test("public exports are correct and no runtime behavior exists", () => {
  const checks = getExecutiveBusinessIntelligenceValidationChecks();
  assert.equal(Array.isArray(checks), true);
  assert.equal(checks.every((check) => check.metadataOnly && check.immutable), true);
  assert.equal(
    checks.some((check) => check.category === "Public API"),
    true,
  );
  assert.equal(
    getExecutiveBusinessIntelligenceValidationMetadata().metadataOnly,
    true,
  );
});
