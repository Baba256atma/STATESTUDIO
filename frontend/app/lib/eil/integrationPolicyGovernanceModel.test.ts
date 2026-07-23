/**
 * EIL-5:3 — Integration Policy & Governance Model Tests.
 *
 * Deterministic coverage for the immutable Integration Policy & Governance Model.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  IntegrationPolicyGovernanceRegistryIdentity,
  IntegrationPolicyGovernanceRegistryPlatform,
} from "./integrationPolicyGovernanceRegistry.ts";
import * as ModelModule from "./integrationPolicyGovernanceModel.ts";
import {
  IntegrationPolicyGovernanceDomainModels,
  IntegrationPolicyGovernanceLifecycleModels,
  IntegrationPolicyGovernanceModelCollections,
  IntegrationPolicyGovernanceModelIdentity,
  IntegrationPolicyGovernanceModelPlatform,
  IntegrationPolicyGovernanceModelSummary,
  IntegrationPolicyGovernanceRelationshipModels,
  IntegrationPolicyGovernanceTopologyModels,
} from "./integrationPolicyGovernanceModel.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../..");

const EIL53_FILES = Object.freeze([
  "integrationPolicyGovernanceModelTypes.ts",
  "integrationPolicyGovernanceModelIdentity.ts",
  "integrationPolicyGovernanceDomainModels.ts",
  "integrationPolicyGovernanceRelationshipModels.ts",
  "integrationPolicyGovernanceTopologyModels.ts",
  "integrationPolicyGovernanceLifecycleModels.ts",
  "integrationPolicyGovernanceModel.ts",
  "integrationPolicyGovernanceModel.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationPolicyGovernanceModelIdentity",
  "IntegrationPolicyGovernanceDomainModels",
  "IntegrationPolicyGovernanceRelationshipModels",
  "IntegrationPolicyGovernanceTopologyModels",
  "IntegrationPolicyGovernanceLifecycleModels",
  "IntegrationPolicyGovernanceModelCollections",
  "IntegrationPolicyGovernanceModelSummary",
  "IntegrationPolicyGovernanceModelPlatform",
] as const);

const EXPECTED_DOMAINS = Object.freeze([
  "GovernancePolicy",
  "GovernanceRule",
  "GovernanceScope",
  "GovernanceBoundary",
  "ComplianceRequirement",
  "ComplianceDeclaration",
  "PolicyVersion",
  "PolicyLifecycle",
  "PolicyDependency",
  "PolicyCompatibility",
  "PolicyMetadata",
  "GovernanceOwner",
  "GovernanceContext",
  "GovernanceInventory",
  "GovernanceClassification",
  "ExecutiveGovernanceBoundary",
] as const);

const EXPECTED_RELATIONSHIPS = Object.freeze([
  "owns",
  "references",
  "dependsOn",
  "compatibleWith",
  "governedBy",
  "classifiedAs",
  "belongsTo",
  "composedOf",
  "extends",
  "validates",
  "constrains",
  "inherits",
] as const);

const EXPECTED_TOPOLOGIES = Object.freeze([
  "Linear",
  "Hierarchical",
  "Tree",
  "Mesh",
  "Hub",
  "Composite",
  "Layered",
  "Executive",
] as const);

const EXPECTED_LIFECYCLE = Object.freeze([
  "Declared",
  "Designed",
  "Verified",
  "Certified",
  "Frozen",
  "Released",
  "Deprecated",
  "Retired",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\/integrationPolicyGovernanceRegistry(?!\.ts["'])/,
  /from ["']\.\/integrationPolicyGovernance(Registry|Foundation)(Types|Identity|CategoryRegistry|ContractRegistry|CapabilityRegistry|ResponsibilityRegistry|Contracts|Capabilities|Responsibilities|Lifecycle)\.ts["']/,
  /from ["']\.\/integrationPolicyGovernanceFoundation\.ts["']/,
  /from ["']\.\/integration(?!PolicyGovernance)/,
  /from ["']\.\/integrationConnector/,
  /from ["']\.\/integrationRouting/,
  /from ["']\.\/integrationOrchestration/,
  /from ["']\.\/integrationPublicIndex/,
  /from ["']\.\/integrationPolicyGovernance(Validation|Manifest|Platform|Certification|Freeze|PublicIndex)/,
  /from ["']\.\.\/(bus|ops|engine|dkl|nea|eve|director|advisor|core)\//,
  /from ["']react["']/,
  /from ["']next\//,
]);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

const assertAscending = (ordinals: readonly number[], label: string): void => {
  assert.deepEqual(
    ordinals,
    [...ordinals].sort((a, b) => a - b),
    `${label} ordinals must be ascending`,
  );
};

describe("EIL-5:3 Integration Policy & Governance Model", () => {
  it("creates exactly eight Model files and eight public exports", () => {
    assert.equal(EIL53_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL53_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(ModelModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(ModelModule).length, 8);
  });

  it("has canonical identity, namespace, version, Model status, and ReadyForValidation", () => {
    assert.equal(IntegrationPolicyGovernanceModelIdentity.phaseId, "EIL-5:3");
    assert.equal(
      IntegrationPolicyGovernanceModelIdentity.canonicalId,
      "EIL-5:3/IntegrationPolicyGovernanceModel",
    );
    assert.equal(
      IntegrationPolicyGovernanceModelIdentity.name,
      "Integration Policy & Governance Model",
    );
    assert.equal(IntegrationPolicyGovernanceModelIdentity.version, "1.0.0");
    assert.equal(
      IntegrationPolicyGovernanceModelIdentity.namespace,
      "nexora.eil.integration-policy-governance.model",
    );
    assert.equal(IntegrationPolicyGovernanceModelIdentity.layer, "EIL");
    assert.equal(IntegrationPolicyGovernanceModelIdentity.platform, "EIL-5");
    assert.equal(IntegrationPolicyGovernanceModelIdentity.phaseType, "Model");
    assert.equal(IntegrationPolicyGovernanceModelIdentity.status, "Model");
    assert.equal(
      IntegrationPolicyGovernanceModelIdentity.readiness,
      "ReadyForValidation",
    );
    assert.equal(IntegrationPolicyGovernanceModelPlatform.status, "Model");
    assert.equal(
      IntegrationPolicyGovernanceModelPlatform.readiness,
      "ReadyForValidation",
    );
    assert.equal(
      IntegrationPolicyGovernanceModelPlatform.nextPhase,
      "EIL-5:4 — Integration Policy & Governance Validation",
    );
  });

  it("declares Registry aggregate as the sole phase dependency", () => {
    const { dependency } = IntegrationPolicyGovernanceModelPlatform;
    assert.equal(dependency.phaseDependencyCount, 1);
    assert.equal(dependency.registryOnly, true);
    assert.equal(
      dependency.registryId,
      IntegrationPolicyGovernanceRegistryIdentity.canonicalId,
    );
    assert.equal(
      dependency.directPreviousPhaseModule,
      "integrationPolicyGovernanceRegistry.ts",
    );
    assert.equal(
      IntegrationPolicyGovernanceModelIdentity.registryDependency,
      "EIL-5:2/IntegrationPolicyGovernanceRegistry",
    );
    assert.equal(
      IntegrationPolicyGovernanceModelIdentity.registryEntryPoint,
      "integrationPolicyGovernanceRegistry.ts",
    );
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.registryInternalImport, false);
    assert.equal(dependency.previousEilPlatformDependency, false);
    assert.equal(dependency.laterEil5PhaseImport, false);
    assert.equal(dependency.reconstructsRegistry, false);
    assert.equal(dependency.duplicatesRegistryValues, false);
    assert.equal(
      IntegrationPolicyGovernanceModelPlatform.registryPlatform,
      IntegrationPolicyGovernanceRegistryPlatform,
    );
  });

  it("publishes sixteen domain, twelve relationship, eight topology, and eight lifecycle models", () => {
    assert.equal(IntegrationPolicyGovernanceDomainModels.length, 16);
    assert.deepEqual(
      IntegrationPolicyGovernanceDomainModels.map((item) => item.canonicalKey),
      [...EXPECTED_DOMAINS],
    );
    assertAscending(
      IntegrationPolicyGovernanceDomainModels.map((item) => item.ordinal),
      "domain",
    );
    assertUnique(
      IntegrationPolicyGovernanceDomainModels.map((item) => item.modelId),
      "domain model IDs",
    );

    assert.equal(IntegrationPolicyGovernanceRelationshipModels.length, 12);
    assert.deepEqual(
      IntegrationPolicyGovernanceRelationshipModels.map(
        (item) => item.relationshipType,
      ),
      [...EXPECTED_RELATIONSHIPS],
    );
    assertAscending(
      IntegrationPolicyGovernanceRelationshipModels.map((item) => item.ordinal),
      "relationship",
    );
    assertUnique(
      IntegrationPolicyGovernanceRelationshipModels.map(
        (item) => item.relationshipId,
      ),
      "relationship IDs",
    );

    assert.equal(IntegrationPolicyGovernanceTopologyModels.length, 8);
    assert.deepEqual(
      IntegrationPolicyGovernanceTopologyModels.map((item) => item.canonicalKey),
      [...EXPECTED_TOPOLOGIES],
    );
    assertAscending(
      IntegrationPolicyGovernanceTopologyModels.map((item) => item.ordinal),
      "topology",
    );

    assert.equal(IntegrationPolicyGovernanceLifecycleModels.length, 8);
    assert.deepEqual(
      IntegrationPolicyGovernanceLifecycleModels.map((item) => item.canonicalKey),
      [...EXPECTED_LIFECYCLE],
    );
    assertAscending(
      IntegrationPolicyGovernanceLifecycleModels.map((item) => item.ordinal),
      "lifecycle",
    );
    assert.equal(
      IntegrationPolicyGovernanceLifecycleModels.length,
      IntegrationPolicyGovernanceRegistryPlatform.lifecycleCoverage.length,
    );
  });

  it("derives inventory dynamically with total model entry count of 44", () => {
    const { collections, inventory } = IntegrationPolicyGovernanceModelPlatform;
    assert.equal(collections.domainModelCount, collections.domains.length);
    assert.equal(
      collections.relationshipModelCount,
      collections.relationships.length,
    );
    assert.equal(collections.topologyModelCount, collections.topologies.length);
    assert.equal(collections.lifecycleModelCount, collections.lifecycles.length);
    assert.equal(collections.domainModelCount, 16);
    assert.equal(collections.relationshipModelCount, 12);
    assert.equal(collections.topologyModelCount, 8);
    assert.equal(collections.lifecycleModelCount, 8);
    assert.equal(collections.totalModelEntryCount, 44);
    assert.equal(inventory.totalModelEntryCount, 44);
    assert.equal(inventory.countsDerivedFromCollections, true);
    assert.equal(
      IntegrationPolicyGovernanceModelSummary.totalModelEntryCount,
      44,
    );
    assert.equal(
      IntegrationPolicyGovernanceModelCollections.totalModelEntryCount,
      44,
    );
  });

  it("freezes all model collections and preserves metadata-only architecture", () => {
    assert.equal(Object.isFrozen(IntegrationPolicyGovernanceDomainModels), true);
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceRelationshipModels),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceTopologyModels),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceLifecycleModels),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceModelCollections),
      true,
    );
    assert.equal(Object.isFrozen(IntegrationPolicyGovernanceModelSummary), true);
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceModelPlatform),
      true,
    );

    const platform = IntegrationPolicyGovernanceModelPlatform;
    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.runtimeEnforcement, false);
    assert.equal(platform.governanceEngine, false);
    assert.equal(platform.policyEnforcement, false);
    assert.equal(platform.authorizationEngine, false);
    assert.equal(platform.complianceEngine, false);
    assert.equal(platform.orchestrationRuntime, false);
    assert.equal(platform.networkingBehavior, false);
    assert.equal(platform.aiBehavior, false);
    assert.equal(platform.uiBehavior, false);
    assert.equal(platform.stateMutation, false);
    assert.equal(platform.previousEilPlatformDependency, false);
    assert.equal(platform.importsLaterEil5Phases, false);
  });

  it("has zero prohibited imports across model sources", () => {
    const sources = EIL53_FILES.filter((name) => !name.endsWith(".test.ts"));
    for (const file of sources) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      for (const pattern of PROHIBITED_IMPORT_PATTERNS) {
        assert.doesNotMatch(
          source,
          pattern,
          `${file} must not match ${pattern}`,
        );
      }
      assert.doesNotMatch(source, /\b(fetch|axios|http\.request)\b/);
      assert.doesNotMatch(source, /\b(setTimeout|setInterval|Promise)\b/);
      assert.doesNotMatch(source, /\bclass\b/);
      assert.doesNotMatch(source, /\basync\s+function\b/);
    }
  });

  it("passes strict TypeScript and ESLint for model sources", () => {
    const sources = EIL53_FILES.filter((name) => !name.endsWith(".test.ts")).map(
      (name) => join("app/lib/eil", name),
    );

    const tsc = spawnSync(
      join(FRONTEND_ROOT, "node_modules/.bin/tsc"),
      [
        "--strict",
        "--noEmit",
        "--pretty",
        "false",
        "--allowImportingTsExtensions",
        "--module",
        "esnext",
        "--moduleResolution",
        "bundler",
        "--target",
        "ES2017",
        "--esModuleInterop",
        "--skipLibCheck",
        "--types",
        "node",
        ...sources,
        "app/lib/eil/integrationPolicyGovernanceRegistry.ts",
      ],
      {
        cwd: FRONTEND_ROOT,
        encoding: "utf8",
      },
    );
    assert.equal(
      tsc.status,
      0,
      `TypeScript failed:\n${tsc.stdout}\n${tsc.stderr}`,
    );

    const eslint = spawnSync(
      join(FRONTEND_ROOT, "node_modules/.bin/eslint"),
      [...sources],
      {
        cwd: FRONTEND_ROOT,
        encoding: "utf8",
      },
    );
    assert.equal(
      eslint.status,
      0,
      `ESLint failed:\n${eslint.stdout}\n${eslint.stderr}`,
    );
  });
});
