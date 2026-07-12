import assert from "node:assert/strict";
import test from "node:test";

import {
  EXECUTIVE_HIERARCHY_MODELS,
  EXECUTIVE_ORGANIZATION_MODEL,
  EXECUTIVE_ORGANIZATION_MODEL_DESCRIPTION,
  EXECUTIVE_ORGANIZATION_MODEL_ID,
  EXECUTIVE_ORGANIZATION_MODEL_METADATA,
  EXECUTIVE_ORGANIZATION_MODEL_NAMESPACE,
  EXECUTIVE_ORGANIZATION_MODEL_PUBLIC_APIS,
  EXECUTIVE_ORGANIZATION_MODEL_STATUS,
  EXECUTIVE_ORGANIZATION_MODEL_VERSION,
  EXECUTIVE_ORGANIZATION_PLATFORM_MODEL,
  EXECUTIVE_ORGANIZATION_UNIT_MODELS,
  EXECUTIVE_OWNERSHIP_MODELS,
  EXECUTIVE_POSITION_MODELS,
  EXECUTIVE_REPORTING_MODELS,
  EXECUTIVE_RESPONSIBILITY_MODELS,
  EXECUTIVE_ROLE_MODELS,
  ExecutiveOrganizationModelFoundation,
  ExecutiveOrganizationModelPublicFoundation,
} from "./executiveOrganizationModelIndex.ts";

test("publishes model exports", () => {
  assert.equal(EXECUTIVE_ORGANIZATION_MODEL_ID, "executive-organization-model-foundation");
  assert.equal(EXECUTIVE_ORGANIZATION_MODEL_VERSION, "1.0.0");
  assert.equal(EXECUTIVE_ORGANIZATION_MODEL_NAMESPACE, "nexora.bus.executive-organization.model");
  assert.equal(EXECUTIVE_ORGANIZATION_MODEL_STATUS, "Published");
  assert.equal(
    EXECUTIVE_ORGANIZATION_MODEL_DESCRIPTION,
    "Canonical metadata-only structural model for executive organization intelligence.",
  );
});

test("publishes aggregate model integrity", () => {
  assert.equal(ExecutiveOrganizationModelFoundation.organization, EXECUTIVE_ORGANIZATION_MODEL);
  assert.equal(ExecutiveOrganizationModelFoundation.units, EXECUTIVE_ORGANIZATION_UNIT_MODELS);
  assert.equal(ExecutiveOrganizationModelFoundation.roles, EXECUTIVE_ROLE_MODELS);
  assert.equal(ExecutiveOrganizationModelFoundation.positions, EXECUTIVE_POSITION_MODELS);
  assert.equal(ExecutiveOrganizationModelFoundation.reporting, EXECUTIVE_REPORTING_MODELS);
  assert.equal(ExecutiveOrganizationModelFoundation.ownership, EXECUTIVE_OWNERSHIP_MODELS);
  assert.equal(
    ExecutiveOrganizationModelFoundation.responsibilities,
    EXECUTIVE_RESPONSIBILITY_MODELS,
  );
  assert.equal(ExecutiveOrganizationModelFoundation.hierarchy, EXECUTIVE_HIERARCHY_MODELS);
});

test("publishes namespace consistency", () => {
  assert.equal(
    EXECUTIVE_ORGANIZATION_PLATFORM_MODEL.platformNamespace,
    "nexora.bus.executive-organization",
  );
  assert.equal(
    EXECUTIVE_ORGANIZATION_MODEL_METADATA.modelNamespace,
    "nexora.bus.executive-organization.model",
  );
});

test("publishes dependency metadata", () => {
  assert.equal(EXECUTIVE_ORGANIZATION_MODEL_METADATA.modelDependencies.length, 2);
  assert.equal(EXECUTIVE_ORGANIZATION_MODEL_METADATA.modelConsumers.length, 3);
  assert.equal(EXECUTIVE_ORGANIZATION_MODEL_METADATA.modelCompatibility.length >= 4, true);
});

test("publishes immutable foundation and deterministic public API", () => {
  assert.equal(EXECUTIVE_ORGANIZATION_MODEL_PUBLIC_APIS.length, 16);
  assert.equal(Object.isFrozen(ExecutiveOrganizationModelFoundation), true);
  assert.equal(Object.isFrozen(ExecutiveOrganizationModelPublicFoundation), true);
  assert.equal(ExecutiveOrganizationModelFoundation.metadata.metadataOnly, true);
});
