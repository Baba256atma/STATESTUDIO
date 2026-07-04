import assert from "node:assert/strict";
import test from "node:test";

import { getExecutiveKpiDefinitionPlatform } from "./executiveKpiDefinitionPlatform.ts";
import { getExecutiveKpiPlatform } from "./executiveKpiPlatform.ts";
import { getExecutiveKpiSourceMappingPlatform } from "./executiveKpiSourceMappingPlatform.ts";
import { getExecutiveKpiTargetPlatform } from "./executiveKpiTargetPlatform.ts";
import {
  EXECUTIVE_KPI_GOVERNANCE_REGISTRY,
  ExecutiveKpiGovernancePlatform,
  getExecutiveKpiGovernanceManifest,
  getExecutiveKpiGovernancePlatform,
  listExecutiveChangeControlPolicies,
  listExecutiveComplianceLevels,
  listExecutiveCriticalityLevels,
  listExecutiveGovernanceCategories,
  listExecutiveGovernanceLifecycleStates,
  listExecutiveKpiGovernance,
  listExecutiveReviewPolicies,
  validateExecutiveKpiGovernance,
} from "./executiveKpiGovernancePlatform.ts";
import type { ExecutiveKpiGovernanceCategory, ExecutiveKpiGovernanceRegistry } from "./executiveKpiGovernanceTypes.ts";

test("consumes prior BUS public APIs", () => {
  const foundation = getExecutiveKpiPlatform();
  const definitions = getExecutiveKpiDefinitionPlatform();
  const sourceMappings = getExecutiveKpiSourceMappingPlatform();
  const targets = getExecutiveKpiTargetPlatform();
  const manifest = getExecutiveKpiGovernanceManifest();

  assert.equal(foundation.validation.valid, true);
  assert.equal(definitions.validation.valid, true);
  assert.equal(sourceMappings.validation.valid, true);
  assert.equal(targets.validation.valid, true);
  assert.equal(manifest.foundationAvailable, true);
  assert.equal(manifest.definitionsAvailable, true);
  assert.equal(manifest.sourceMappingsAvailable, true);
  assert.equal(manifest.targetsAvailable, true);
});

test("publishes governance registry integrity", () => {
  const registry = EXECUTIVE_KPI_GOVERNANCE_REGISTRY;

  assert.equal(registry.platformId, "BUS-5");
  assert.equal(registry.foundationPlatformId, "BUS-1");
  assert.equal(registry.definitionPlatformId, "BUS-2");
  assert.equal(registry.sourceMappingPlatformId, "BUS-3");
  assert.equal(registry.targetPlatformId, "BUS-4");
  assert.equal(registry.governance.length, 2);
  assert.equal(Object.isFrozen(registry), true);
});

test("publishes governance registry", () => {
  const governance = listExecutiveKpiGovernance();

  assert.equal(governance.length, 2);
  assert.equal(governance.every((entry) => entry.metadataOnly && entry.immutable), true);
});

test("publishes review policy registry", () => {
  assert.deepEqual(listExecutiveReviewPolicies(), ["Continuous", "Monthly", "Quarterly", "Semiannual", "Annual", "On Demand"]);
});

test("publishes criticality registry", () => {
  assert.deepEqual(listExecutiveCriticalityLevels(), ["Critical", "High", "Medium", "Low", "Informational"]);
});

test("publishes compliance registry", () => {
  assert.deepEqual(listExecutiveComplianceLevels(), ["Mandatory", "Regulated", "Internal", "Recommended", "Optional"]);
});

test("publishes change-control registry", () => {
  assert.deepEqual(listExecutiveChangeControlPolicies(), ["Strict", "Controlled", "Managed", "Flexible", "Experimental"]);
});

test("publishes category and lifecycle registries", () => {
  assert.equal(listExecutiveGovernanceCategories().length, 10);
  assert.deepEqual(listExecutiveGovernanceLifecycleStates(), ["Draft", "Candidate", "Approved", "Active", "Deprecated", "Archived"]);
});

test("generates deterministic manifest", () => {
  const first = getExecutiveKpiGovernanceManifest();
  const second = getExecutiveKpiGovernanceManifest();

  assert.equal(first.platformId, "BUS-5");
  assert.equal(first.governanceCount, 2);
  assert.equal(first.certificationStatus, "Governance Foundation Certified");
  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
});

test("validates successfully", () => {
  const validation = validateExecutiveKpiGovernance();

  assert.equal(validation.valid, true);
  assert.equal(validation.errors.length, 0);
});

test("detects duplicate governance ids", () => {
  const duplicateRegistry: ExecutiveKpiGovernanceRegistry = Object.freeze({
    ...EXECUTIVE_KPI_GOVERNANCE_REGISTRY,
    governance: Object.freeze([
      EXECUTIVE_KPI_GOVERNANCE_REGISTRY.governance[0],
      EXECUTIVE_KPI_GOVERNANCE_REGISTRY.governance[0],
    ]),
  });
  const validation = validateExecutiveKpiGovernance(duplicateRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("duplicate-governance-id:financial-health-governance"), true);
});

test("detects invalid KPI reference", () => {
  const invalidRegistry: ExecutiveKpiGovernanceRegistry = Object.freeze({
    ...EXECUTIVE_KPI_GOVERNANCE_REGISTRY,
    governance: Object.freeze([
      Object.freeze({
        ...EXECUTIVE_KPI_GOVERNANCE_REGISTRY.governance[0],
        kpiId: "missing-kpi",
      }),
    ]),
  });
  const validation = validateExecutiveKpiGovernance(invalidRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("invalid-kpi-reference:financial-health-governance"), true);
});

test("detects invalid governance category", () => {
  const invalidRegistry: ExecutiveKpiGovernanceRegistry = Object.freeze({
    ...EXECUTIVE_KPI_GOVERNANCE_REGISTRY,
    governance: Object.freeze([
      Object.freeze({
        ...EXECUTIVE_KPI_GOVERNANCE_REGISTRY.governance[0],
        governanceCategory: "Invalid" as ExecutiveKpiGovernanceCategory,
      }),
    ]),
  });
  const validation = validateExecutiveKpiGovernance(invalidRegistry);

  assert.equal(validation.valid, false);
  assert.equal(validation.errors.includes("invalid-governance-category:financial-health-governance"), true);
});

test("exports public APIs and immutable facade", () => {
  const platform = getExecutiveKpiGovernancePlatform();

  assert.equal(platform.validation.valid, true);
  assert.equal(typeof ExecutiveKpiGovernancePlatform.getExecutiveKpiGovernancePlatform, "function");
  assert.equal(typeof ExecutiveKpiGovernancePlatform.getExecutiveKpiGovernanceManifest, "function");
  assert.equal(typeof ExecutiveKpiGovernancePlatform.validateExecutiveKpiGovernance, "function");
  assert.equal(typeof ExecutiveKpiGovernancePlatform.listExecutiveKpiGovernance, "function");
  assert.equal(typeof ExecutiveKpiGovernancePlatform.listExecutiveGovernanceCategories, "function");
  assert.equal(typeof ExecutiveKpiGovernancePlatform.listExecutiveComplianceLevels, "function");
  assert.equal(typeof ExecutiveKpiGovernancePlatform.listExecutiveCriticalityLevels, "function");
  assert.equal(typeof ExecutiveKpiGovernancePlatform.listExecutiveReviewPolicies, "function");
  assert.equal(typeof ExecutiveKpiGovernancePlatform.listExecutiveChangeControlPolicies, "function");
  assert.equal(typeof ExecutiveKpiGovernancePlatform.listExecutiveGovernanceLifecycleStates, "function");
  assert.equal(Object.isFrozen(ExecutiveKpiGovernancePlatform), true);
});
