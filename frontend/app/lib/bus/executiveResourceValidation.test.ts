import assert from "node:assert/strict";
import test from "node:test";

import {
  EXECUTIVE_RESOURCE_PLATFORM_VALIDATION,
  EXECUTIVE_RESOURCE_VALIDATION_COMPATIBILITY,
  EXECUTIVE_RESOURCE_VALIDATION_FOUNDATION_COMPATIBILITY,
  EXECUTIVE_RESOURCE_VALIDATION_GROUPS,
  EXECUTIVE_RESOURCE_VALIDATION_METADATA,
  EXECUTIVE_RESOURCE_VALIDATION_NAMESPACE,
  EXECUTIVE_RESOURCE_VALIDATION_PUBLIC_APIS,
  EXECUTIVE_RESOURCE_VALIDATION_RESULT,
  EXECUTIVE_RESOURCE_VALIDATION_RULES,
  EXECUTIVE_RESOURCE_VALIDATION_SUMMARY,
  EXECUTIVE_RESOURCE_VALIDATION_VERSION,
  ExecutiveResourceValidationFoundation,
  ExecutiveResourceValidationPublicFoundation,
} from "./executiveResourceValidationIndex.ts";

test("publishes immutable validation exports", () => {
  assert.equal(EXECUTIVE_RESOURCE_VALIDATION_NAMESPACE, "nexora.bus.executive-resource.validation");
  assert.equal(EXECUTIVE_RESOURCE_VALIDATION_VERSION, "1.0.0");
  assert.equal(EXECUTIVE_RESOURCE_PLATFORM_VALIDATION.validationStatus, "PASS");
  assert.equal(Object.isFrozen(ExecutiveResourceValidationFoundation), true);
});

test("publishes rule metadata integrity", () => {
  assert.equal(EXECUTIVE_RESOURCE_VALIDATION_RULES.length, 15);
  assert.equal(
    EXECUTIVE_RESOURCE_VALIDATION_RULES.every((rule) => rule.metadataOnly && rule.immutable),
    true,
  );
  assert.equal(
    EXECUTIVE_RESOURCE_VALIDATION_RULES.some((rule) => rule.category === "Platform"),
    true,
  );
  assert.equal(
    EXECUTIVE_RESOURCE_VALIDATION_RULES.some((rule) => rule.category === "PublicAPI"),
    true,
  );
});

test("publishes validation group integrity", () => {
  assert.equal(EXECUTIVE_RESOURCE_VALIDATION_GROUPS.length, 15);
  assert.equal(
    EXECUTIVE_RESOURCE_VALIDATION_GROUPS.every((group) => group.rules.length > 0),
    true,
  );
});

test("publishes summary and compatibility integrity", () => {
  assert.equal(EXECUTIVE_RESOURCE_VALIDATION_SUMMARY.ruleCount, 15);
  assert.equal(EXECUTIVE_RESOURCE_VALIDATION_SUMMARY.groupCount, 15);
  assert.equal(EXECUTIVE_RESOURCE_VALIDATION_COMPATIBILITY.compatibilityStatus, "Compatible");
  assert.equal(EXECUTIVE_RESOURCE_VALIDATION_RESULT.validationStatus, "PASS");
});

test("publishes aggregate foundation integrity and deterministic public API", () => {
  assert.equal(
    EXECUTIVE_RESOURCE_VALIDATION_METADATA.validationNamespace,
    EXECUTIVE_RESOURCE_VALIDATION_NAMESPACE,
  );
  assert.equal(EXECUTIVE_RESOURCE_VALIDATION_PUBLIC_APIS.length, 11);
  assert.equal(
    EXECUTIVE_RESOURCE_VALIDATION_FOUNDATION_COMPATIBILITY.modelPublicApiCount > 0,
    true,
  );
  assert.equal(Object.isFrozen(ExecutiveResourceValidationPublicFoundation), true);
});
