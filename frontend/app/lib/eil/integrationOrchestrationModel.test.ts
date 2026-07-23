/**
 * EIL-4:3 — Integration Orchestration Model Tests.
 *
 * Deterministic coverage for the immutable Integration Orchestration Model.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  IntegrationOrchestrationRegistryIdentity,
  IntegrationOrchestrationRegistryPlatform,
} from "./integrationOrchestrationRegistry.ts";
import * as ModelModule from "./integrationOrchestrationModel.ts";
import {
  IntegrationOrchestrationDomainModels,
  IntegrationOrchestrationLifecycleModels,
  IntegrationOrchestrationModelCollections,
  IntegrationOrchestrationModelIdentity,
  IntegrationOrchestrationModelPlatform,
  IntegrationOrchestrationModelSummary,
  IntegrationOrchestrationRelationshipModels,
  IntegrationOrchestrationTopologyModels,
} from "./integrationOrchestrationModel.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../..");

const EIL43_FILES = Object.freeze([
  "integrationOrchestrationModelTypes.ts",
  "integrationOrchestrationModelIdentity.ts",
  "integrationOrchestrationDomainModels.ts",
  "integrationOrchestrationRelationshipModels.ts",
  "integrationOrchestrationTopologyModels.ts",
  "integrationOrchestrationLifecycleModels.ts",
  "integrationOrchestrationModel.ts",
  "integrationOrchestrationModel.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationOrchestrationModelIdentity",
  "IntegrationOrchestrationDomainModels",
  "IntegrationOrchestrationRelationshipModels",
  "IntegrationOrchestrationTopologyModels",
  "IntegrationOrchestrationLifecycleModels",
  "IntegrationOrchestrationModelCollections",
  "IntegrationOrchestrationModelSummary",
  "IntegrationOrchestrationModelPlatform",
] as const);

const EXPECTED_DOMAINS = Object.freeze([
  "Orchestration",
  "Flow",
  "FlowStep",
  "Transition",
  "Trigger",
  "Dependency",
  "State",
  "Completion",
  "Failure",
  "Recovery",
  "Compensation",
  "Approval",
  "RouteReference",
  "ConnectorReference",
  "ExecutionContext",
  "OrchestrationBoundary",
] as const);

const EXPECTED_RELATIONSHIPS = Object.freeze([
  "owns",
  "references",
  "dependsOn",
  "compatibleWith",
  "mappedTo",
  "composedOf",
  "belongsTo",
  "transitionsTo",
  "triggeredBy",
  "coordinates",
  "recoversFrom",
  "extends",
] as const);

const EXPECTED_TOPOLOGIES = Object.freeze([
  "Linear",
  "Sequential",
  "Parallel",
  "Tree",
  "Mesh",
  "Hub",
  "Composite",
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
  /from ["']\.\/integrationOrchestrationRegistry(?!\.ts["'])/,
  /from ["']\.\/integrationOrchestration(Registry|Foundation)(Types|Identity|CategoryRegistry|ContractRegistry|CapabilityRegistry|ResponsibilityRegistry|Contracts|Capabilities|Responsibilities|Lifecycle)\.ts["']/,
  /from ["']\.\/integrationOrchestrationFoundation\.ts["']/,
  /from ["']\.\/integration(?!Orchestration)/,
  /from ["']\.\/integrationConnector/,
  /from ["']\.\/integrationRouting/,
  /from ["']\.\/integrationPublicIndex/,
  /from ["']\.\/integrationOrchestration(Validation|Manifest|Platform|Certification|Freeze|PublicIndex)/,
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

describe("EIL-4:3 Integration Orchestration Model", () => {
  it("creates exactly eight Model files and eight public exports", () => {
    assert.equal(EIL43_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL43_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(ModelModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(ModelModule).length, 8);
  });

  it("has canonical identity, namespace, version, Model status, and ReadyForValidation", () => {
    assert.equal(IntegrationOrchestrationModelIdentity.phaseId, "EIL-4:3");
    assert.equal(
      IntegrationOrchestrationModelIdentity.canonicalId,
      "EIL-4:3/IntegrationOrchestrationModel",
    );
    assert.equal(
      IntegrationOrchestrationModelIdentity.name,
      "Integration Orchestration Model",
    );
    assert.equal(IntegrationOrchestrationModelIdentity.version, "1.0.0");
    assert.equal(
      IntegrationOrchestrationModelIdentity.namespace,
      "nexora.eil.integration-orchestration.model",
    );
    assert.equal(IntegrationOrchestrationModelIdentity.layer, "EIL");
    assert.equal(IntegrationOrchestrationModelIdentity.platform, "EIL-4");
    assert.equal(IntegrationOrchestrationModelIdentity.phaseType, "Model");
    assert.equal(IntegrationOrchestrationModelIdentity.status, "Model");
    assert.equal(
      IntegrationOrchestrationModelIdentity.readiness,
      "ReadyForValidation",
    );
    assert.equal(IntegrationOrchestrationModelPlatform.status, "Model");
    assert.equal(
      IntegrationOrchestrationModelPlatform.readiness,
      "ReadyForValidation",
    );
    assert.equal(
      IntegrationOrchestrationModelPlatform.nextPhase,
      "EIL-4:4 — Integration Orchestration Validation",
    );
  });

  it("declares Registry aggregate as the sole phase dependency", () => {
    const { dependency } = IntegrationOrchestrationModelPlatform;
    assert.equal(dependency.phaseDependencyCount, 1);
    assert.equal(dependency.registryOnly, true);
    assert.equal(
      dependency.registryId,
      IntegrationOrchestrationRegistryIdentity.canonicalId,
    );
    assert.equal(
      dependency.directPreviousPhaseModule,
      "integrationOrchestrationRegistry.ts",
    );
    assert.equal(
      IntegrationOrchestrationModelIdentity.registryDependency,
      "EIL-4:2/IntegrationOrchestrationRegistry",
    );
    assert.equal(
      IntegrationOrchestrationModelIdentity.registryEntryPoint,
      "integrationOrchestrationRegistry.ts",
    );
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.registryInternalImport, false);
    assert.equal(dependency.previousEilPlatformDependency, false);
    assert.equal(dependency.laterEil4PhaseImport, false);
    assert.equal(dependency.reconstructsRegistry, false);
    assert.equal(dependency.duplicatesRegistryValues, false);
    assert.equal(
      IntegrationOrchestrationModelPlatform.registryPlatform,
      IntegrationOrchestrationRegistryPlatform,
    );
  });

  it("publishes sixteen domain, twelve relationship, eight topology, and eight lifecycle models", () => {
    assert.equal(IntegrationOrchestrationDomainModels.length, 16);
    assert.deepEqual(
      IntegrationOrchestrationDomainModels.map((item) => item.canonicalKey),
      [...EXPECTED_DOMAINS],
    );
    assertAscending(
      IntegrationOrchestrationDomainModels.map((item) => item.ordinal),
      "domain",
    );
    assertUnique(
      IntegrationOrchestrationDomainModels.map((item) => item.modelId),
      "domain model IDs",
    );

    assert.equal(IntegrationOrchestrationRelationshipModels.length, 12);
    assert.deepEqual(
      IntegrationOrchestrationRelationshipModels.map(
        (item) => item.relationshipType,
      ),
      [...EXPECTED_RELATIONSHIPS],
    );
    assertAscending(
      IntegrationOrchestrationRelationshipModels.map((item) => item.ordinal),
      "relationship",
    );
    assertUnique(
      IntegrationOrchestrationRelationshipModels.map(
        (item) => item.relationshipId,
      ),
      "relationship IDs",
    );

    assert.equal(IntegrationOrchestrationTopologyModels.length, 8);
    assert.deepEqual(
      IntegrationOrchestrationTopologyModels.map((item) => item.canonicalKey),
      [...EXPECTED_TOPOLOGIES],
    );
    assertAscending(
      IntegrationOrchestrationTopologyModels.map((item) => item.ordinal),
      "topology",
    );

    assert.equal(IntegrationOrchestrationLifecycleModels.length, 8);
    assert.deepEqual(
      IntegrationOrchestrationLifecycleModels.map((item) => item.canonicalKey),
      [...EXPECTED_LIFECYCLE],
    );
    assertAscending(
      IntegrationOrchestrationLifecycleModels.map((item) => item.ordinal),
      "lifecycle",
    );
    assert.equal(
      IntegrationOrchestrationLifecycleModels.length,
      IntegrationOrchestrationRegistryPlatform.lifecycleCoverage.length,
    );
  });

  it("derives inventory dynamically with total model entry count of 44", () => {
    const { collections, inventory } = IntegrationOrchestrationModelPlatform;
    assert.equal(collections.domainModelCount, collections.domains.length);
    assert.equal(
      collections.relationshipCount,
      collections.relationships.length,
    );
    assert.equal(collections.topologyCount, collections.topologies.length);
    assert.equal(collections.lifecycleCount, collections.lifecycles.length);
    assert.equal(collections.domainModelCount, 16);
    assert.equal(collections.relationshipCount, 12);
    assert.equal(collections.topologyCount, 8);
    assert.equal(collections.lifecycleCount, 8);
    assert.equal(collections.totalModelEntryCount, 44);
    assert.equal(inventory.totalModelEntryCount, 44);
    assert.equal(inventory.countsDerivedFromCollections, true);
    assert.equal(IntegrationOrchestrationModelSummary.totalModelEntryCount, 44);
    assert.equal(
      IntegrationOrchestrationModelCollections.totalModelEntryCount,
      44,
    );
  });

  it("freezes all model collections and preserves metadata-only architecture", () => {
    assert.equal(Object.isFrozen(IntegrationOrchestrationModelIdentity), true);
    assert.equal(Object.isFrozen(IntegrationOrchestrationDomainModels), true);
    assert.equal(
      Object.isFrozen(IntegrationOrchestrationRelationshipModels),
      true,
    );
    assert.equal(Object.isFrozen(IntegrationOrchestrationTopologyModels), true);
    assert.equal(Object.isFrozen(IntegrationOrchestrationLifecycleModels), true);
    assert.equal(
      Object.isFrozen(IntegrationOrchestrationModelCollections),
      true,
    );
    assert.equal(Object.isFrozen(IntegrationOrchestrationModelSummary), true);
    assert.equal(Object.isFrozen(IntegrationOrchestrationModelPlatform), true);

    const platform = IntegrationOrchestrationModelPlatform;
    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.orchestrationEngine, false);
    assert.equal(platform.workflowExecution, false);
    assert.equal(platform.routingExecution, false);
    assert.equal(platform.schedulingBehavior, false);
    assert.equal(platform.triggerProcessing, false);
    assert.equal(platform.networkingBehavior, false);
    assert.equal(platform.persistenceBehavior, false);
    assert.equal(platform.aiBehavior, false);
    assert.equal(platform.uiBehavior, false);
    assert.equal(platform.stateMutation, false);
    assert.equal(platform.previousEilPlatformDependency, false);
    assert.equal(platform.importsLaterEil4Phases, false);
    assert.ok(
      platform.domains.every(
        (item) => item.executesRuntime === false && Object.isFrozen(item.tags),
      ),
    );
    assert.ok(
      platform.relationships.every((item) => item.resolvesRuntime === false),
    );
    assert.ok(
      platform.topologies.every(
        (item) =>
          item.graphEngine === false && item.orchestrationEngine === false,
      ),
    );
    assert.ok(
      platform.lifecycles.every(
        (item) =>
          item.executesTransitions === false &&
          item.runtimeStateMachine === false,
      ),
    );
  });

  it("has zero prohibited imports across model sources", () => {
    const sources = EIL43_FILES.filter((name) => !name.endsWith(".test.ts"));
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
    const sources = EIL43_FILES.filter((name) => !name.endsWith(".test.ts")).map(
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
        "app/lib/eil/integrationOrchestrationRegistry.ts",
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
