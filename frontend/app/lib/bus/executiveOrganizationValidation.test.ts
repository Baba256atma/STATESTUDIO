import assert from "node:assert/strict";
import test from "node:test";

import {
  EXECUTIVE_ORGANIZATION_PLATFORM_VALIDATION,
  EXECUTIVE_ORGANIZATION_VALIDATION_COMPATIBILITY,
  EXECUTIVE_ORGANIZATION_VALIDATION_FOUNDATION_COMPATIBILITY,
  EXECUTIVE_ORGANIZATION_VALIDATION_GROUPS,
  EXECUTIVE_ORGANIZATION_VALIDATION_METADATA,
  EXECUTIVE_ORGANIZATION_VALIDATION_NAMESPACE,
  EXECUTIVE_ORGANIZATION_VALIDATION_PUBLIC_APIS,
  EXECUTIVE_ORGANIZATION_VALIDATION_RESULT,
  EXECUTIVE_ORGANIZATION_VALIDATION_RULES,
  EXECUTIVE_ORGANIZATION_VALIDATION_SUMMARY,
  EXECUTIVE_ORGANIZATION_VALIDATION_VERSION,
  ExecutiveOrganizationValidationFoundation,
  ExecutiveOrganizationValidationPublicFoundation,
} from "./executiveOrganizationValidationIndex.ts";

test("publishes immutable validation exports", () => {
  assert.equal(EXECUTIVE_ORGANIZATION_VALIDATION_NAMESPACE, "nexora.bus.executive-organization.validation");
  assert.equal(EXECUTIVE_ORGANIZATION_VALIDATION_VERSION, "1.0.0");
  assert.equal(EXECUTIVE_ORGANIZATION_PLATFORM_VALIDATION.validationStatus, "PASS");
  assert.equal(Object.isFrozen(ExecutiveOrganizationValidationFoundation), true);
});

test("publishes rule metadata integrity", () => {
  assert.equal(EXECUTIVE_ORGANIZATION_VALIDATION_RULES.length, 12);
  assert.equal(
    EXECUTIVE_ORGANIZATION_VALIDATION_RULES.every((rule) => rule.metadataOnly && rule.immutable),
    true,
  );
  assert.equal(
    EXECUTIVE_ORGANIZATION_VALIDATION_RULES.some((rule) => rule.category === "Platform"),
    true,
  );
});

test("publishes validation group integrity", () => {
  assert.equal(EXECUTIVE_ORGANIZATION_VALIDATION_GROUPS.length, 12);
  assert.equal(
    EXECUTIVE_ORGANIZATION_VALIDATION_GROUPS.every((group) => group.rules.length > 0),
    true,
  );
});

test("publishes summary and compatibility integrity", () => {
  assert.equal(EXECUTIVE_ORGANIZATION_VALIDATION_SUMMARY.ruleCount, 12);
  assert.equal(EXECUTIVE_ORGANIZATION_VALIDATION_SUMMARY.groupCount, 12);
  assert.equal(EXECUTIVE_ORGANIZATION_VALIDATION_COMPATIBILITY.compatibilityStatus, "Compatible");
  assert.equal(EXECUTIVE_ORGANIZATION_VALIDATION_RESULT.validationStatus, "PASS");
});

test("publishes namespace consistency and deterministic public API", () => {
  assert.equal(
    EXECUTIVE_ORGANIZATION_VALIDATION_METADATA.validationNamespace,
    EXECUTIVE_ORGANIZATION_VALIDATION_NAMESPACE,
  );
  assert.equal(EXECUTIVE_ORGANIZATION_VALIDATION_PUBLIC_APIS.length, 11);
  assert.equal(
    EXECUTIVE_ORGANIZATION_VALIDATION_FOUNDATION_COMPATIBILITY.publicApiCount > 0,
    true,
  );
  assert.equal(Object.isFrozen(ExecutiveOrganizationValidationPublicFoundation), true);
});
