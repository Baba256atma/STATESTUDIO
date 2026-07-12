import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveBusinessHealthCanonicalModel,
  ExecutiveBusinessHealthModelDescription,
  ExecutiveBusinessHealthModelFoundation,
  ExecutiveBusinessHealthModelId,
  ExecutiveBusinessHealthModelMetadata,
  ExecutiveBusinessHealthModelName,
  ExecutiveBusinessHealthModelVersion,
  buildExecutiveBusinessHealthModel,
  getExecutiveBusinessHealthModelCapabilities,
  getExecutiveBusinessHealthModelDimensions,
  getExecutiveBusinessHealthModelDomains,
  getExecutiveBusinessHealthModelIndicators,
  getExecutiveBusinessHealthModelSummary,
} from "./executiveBusinessHealthModelIndex.ts";

test("canonical model builds successfully", () => {
  const built = buildExecutiveBusinessHealthModel();
  assert.equal(ExecutiveBusinessHealthModelId, "BUS-32:3");
  assert.equal(ExecutiveBusinessHealthModelVersion, "1.0.0");
  assert.equal(
    ExecutiveBusinessHealthModelName,
    "Executive Business Health Intelligence Model",
  );
  assert.equal(
    ExecutiveBusinessHealthModelDescription,
    "Canonical metadata-only model layer for executive business health intelligence.",
  );
  assert.equal(built.profile.id, "executive-business-health-profile-canonical");
  assert.equal(Object.isFrozen(built), true);
});

test("registry metadata is assembled and all domains exist", () => {
  assert.equal(
    ExecutiveBusinessHealthModelMetadata.registryMetadata.registryId,
    "BUS-32:2",
  );
  assert.equal(getExecutiveBusinessHealthModelDomains().length, 13);
  assert.equal(getExecutiveBusinessHealthModelDomains()[0].id, "Executive");
  assert.equal(getExecutiveBusinessHealthModelDomains()[12].id, "Governance");
});

test("every dimension references valid capabilities and every capability references valid indicators", () => {
  const capabilityIds = new Set(
    getExecutiveBusinessHealthModelCapabilities().map((capability) => capability.id),
  );
  const indicatorIds = new Set(
    getExecutiveBusinessHealthModelIndicators().map((indicator) => indicator.id),
  );

  for (const dimension of getExecutiveBusinessHealthModelDimensions()) {
    for (const capability of dimension.capabilities) {
      assert.equal(capabilityIds.has(capability.id), true);
    }
  }

  for (const capability of getExecutiveBusinessHealthModelCapabilities()) {
    for (const indicator of capability.indicators) {
      assert.equal(indicatorIds.has(indicator.id), true);
    }
  }
});

test("every indicator belongs to a valid domain and ordering is deterministic", () => {
  const domainIds = new Set(getExecutiveBusinessHealthModelDomains().map((domain) => domain.id));
  for (const indicator of getExecutiveBusinessHealthModelIndicators()) {
    assert.equal(domainIds.has(indicator.domain), true);
  }
  assert.equal(
    getExecutiveBusinessHealthModelIndicators()[0].id,
    "executive-business-health-indicator-strategic-clarity",
  );
  assert.equal(
    getExecutiveBusinessHealthModelIndicators()[11].id,
    "executive-business-health-indicator-governance-discipline",
  );
});

test("helper APIs return readonly metadata and public foundation is immutable", () => {
  assert.equal(getExecutiveBusinessHealthModelSummary(), ExecutiveBusinessHealthCanonicalModel.summary);
  assert.equal(getExecutiveBusinessHealthModelDomains(), ExecutiveBusinessHealthCanonicalModel.domains);
  assert.equal(
    getExecutiveBusinessHealthModelDimensions(),
    ExecutiveBusinessHealthCanonicalModel.dimensions,
  );
  assert.equal(
    getExecutiveBusinessHealthModelCapabilities(),
    ExecutiveBusinessHealthCanonicalModel.capabilities,
  );
  assert.equal(
    getExecutiveBusinessHealthModelIndicators(),
    ExecutiveBusinessHealthCanonicalModel.indicators,
  );
  assert.equal(ExecutiveBusinessHealthModelFoundation.metadataOnly, true);
  assert.equal(Object.isFrozen(ExecutiveBusinessHealthModelFoundation), true);
});
