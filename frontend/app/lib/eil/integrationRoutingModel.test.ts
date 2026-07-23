/**
 * EIL-3:3 — Integration Routing Model Tests.
 *
 * Deterministic coverage for the immutable Integration Routing Model.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  IntegrationRoutingRegistryIdentity,
  IntegrationRoutingRegistryPlatform,
} from "./integrationRoutingRegistry.ts";
import * as ModelModule from "./integrationRoutingModel.ts";
import {
  IntegrationRoutingDomainModels,
  IntegrationRoutingLifecycleModels,
  IntegrationRoutingModelCollections,
  IntegrationRoutingModelIdentity,
  IntegrationRoutingModelPlatform,
  IntegrationRoutingModelSummary,
  IntegrationRoutingRelationshipModels,
  IntegrationRoutingTopologyModels,
} from "./integrationRoutingModel.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../..");

const EIL33_FILES = Object.freeze([
  "integrationRoutingModelTypes.ts",
  "integrationRoutingModelIdentity.ts",
  "integrationRoutingDomainModels.ts",
  "integrationRoutingRelationshipModels.ts",
  "integrationRoutingTopologyModels.ts",
  "integrationRoutingLifecycleModels.ts",
  "integrationRoutingModel.ts",
  "integrationRoutingModel.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationRoutingModelIdentity",
  "IntegrationRoutingDomainModels",
  "IntegrationRoutingRelationshipModels",
  "IntegrationRoutingTopologyModels",
  "IntegrationRoutingLifecycleModels",
  "IntegrationRoutingModelCollections",
  "IntegrationRoutingModelSummary",
  "IntegrationRoutingModelPlatform",
] as const);

const EXPECTED_DOMAINS = Object.freeze([
  "Route",
  "RoutePath",
  "RouteNode",
  "RouteSegment",
  "RouteCondition",
  "RoutePolicy",
  "RoutePriority",
  "RouteMetadata",
  "RouteCategory",
  "RouteLifecycle",
  "RouteDependency",
  "RouteCompatibility",
  "RouteBoundary",
  "RouteContext",
  "RouteTopology",
  "RouteConfiguration",
] as const);

const EXPECTED_RELATIONSHIP_TYPES = Object.freeze([
  "owns",
  "references",
  "dependsOn",
  "compatibleWith",
  "mappedTo",
  "connectedTo",
  "belongsTo",
  "composedOf",
  "extends",
  "routesThrough",
  "governedBy",
  "classifiedAs",
] as const);

const EXPECTED_TOPOLOGIES = Object.freeze([
  "Linear",
  "Tree",
  "Mesh",
  "Star",
  "Ring",
  "Hub",
  "Gateway",
  "Composite",
] as const);

const EXPECTED_LIFECYCLES = Object.freeze([
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
  /from ["']\.\/integrationRoutingRegistry(?!\.ts["'])/,
  /from ["']\.\/integrationRouting(Registry|Foundation)(Types|Identity|CategoryRegistry|ContractRegistry|CapabilityRegistry|ResponsibilityRegistry|Contracts|Capabilities|Responsibilities|Lifecycle)\.ts["']/,
  /from ["']\.\/integrationRoutingFoundation\.ts["']/,
  /from ["']\.\/integration(?!Routing)/,
  /from ["']\.\/integrationConnector/,
  /from ["']\.\/integrationRouting(Validation|Manifest|Platform|Certification|Freeze|PublicIndex)/,
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

describe("EIL-3:3 Integration Routing Model", () => {
  it("creates exactly eight Model files and eight public exports", () => {
    assert.equal(EIL33_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL33_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(ModelModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(ModelModule).length, 8);
  });

  it("has canonical identity, namespace, version, Model status, and ReadyForValidation", () => {
    assert.equal(IntegrationRoutingModelIdentity.phaseId, "EIL-3:3");
    assert.equal(
      IntegrationRoutingModelIdentity.canonicalId,
      "EIL-3:3/IntegrationRoutingModel",
    );
    assert.equal(
      IntegrationRoutingModelIdentity.name,
      "Integration Routing Model",
    );
    assert.equal(IntegrationRoutingModelIdentity.version, "1.0.0");
    assert.equal(
      IntegrationRoutingModelIdentity.namespace,
      "nexora.eil.integration-routing.model",
    );
    assert.equal(IntegrationRoutingModelIdentity.layer, "EIL");
    assert.equal(IntegrationRoutingModelIdentity.platform, "EIL-3");
    assert.equal(IntegrationRoutingModelIdentity.phaseType, "Model");
    assert.equal(IntegrationRoutingModelIdentity.status, "Model");
    assert.equal(
      IntegrationRoutingModelIdentity.readiness,
      "ReadyForValidation",
    );
    assert.equal(IntegrationRoutingModelPlatform.status, "Model");
    assert.equal(
      IntegrationRoutingModelPlatform.readiness,
      "ReadyForValidation",
    );
    assert.equal(
      IntegrationRoutingModelPlatform.nextPhase,
      "EIL-3:4 — Integration Routing Validation",
    );
  });

  it("declares Registry aggregate as the sole phase dependency", () => {
    const { dependency } = IntegrationRoutingModelPlatform;
    assert.equal(dependency.phaseDependencyCount, 1);
    assert.equal(dependency.registryOnly, true);
    assert.equal(
      dependency.registryId,
      IntegrationRoutingRegistryIdentity.canonicalId,
    );
    assert.equal(
      dependency.directPreviousPhaseModule,
      "integrationRoutingRegistry.ts",
    );
    assert.equal(
      IntegrationRoutingModelIdentity.registryDependency,
      "EIL-3:2/IntegrationRoutingRegistry",
    );
    assert.equal(
      IntegrationRoutingModelIdentity.registryEntryPoint,
      "integrationRoutingRegistry.ts",
    );
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.registryInternalImport, false);
    assert.equal(dependency.previousEilPlatformDependency, false);
    assert.equal(dependency.laterEil3PhaseImport, false);
    assert.equal(
      IntegrationRoutingModelPlatform.registryPlatform,
      IntegrationRoutingRegistryPlatform,
    );
  });

  it("publishes exactly sixteen domain models in deterministic order", () => {
    assert.equal(IntegrationRoutingDomainModels.length, 16);
    assert.deepEqual(
      IntegrationRoutingDomainModels.map((item) => item.canonicalKey),
      [...EXPECTED_DOMAINS],
    );
    assertUnique(
      IntegrationRoutingDomainModels.map((item) => item.modelId),
      "domain model IDs",
    );
    assertAscending(
      IntegrationRoutingDomainModels.map((item) => item.ordinal),
      "domain",
    );
    assert.ok(
      IntegrationRoutingDomainModels.every(
        (item) => item.executesRuntime === false && item.metadataOnly === true,
      ),
    );
  });

  it("publishes exactly twelve relationship models covering all types", () => {
    assert.equal(IntegrationRoutingRelationshipModels.length, 12);
    assert.deepEqual(
      IntegrationRoutingRelationshipModels.map((item) => item.relationshipType),
      [...EXPECTED_RELATIONSHIP_TYPES],
    );
    assertUnique(
      IntegrationRoutingRelationshipModels.map((item) => item.relationshipId),
      "relationship IDs",
    );
    assertAscending(
      IntegrationRoutingRelationshipModels.map((item) => item.ordinal),
      "relationship",
    );
    assert.ok(
      IntegrationRoutingRelationshipModels.every(
        (item) => item.resolvesRuntime === false,
      ),
    );
  });

  it("publishes exactly eight topology models and eight lifecycle models", () => {
    assert.equal(IntegrationRoutingTopologyModels.length, 8);
    assert.deepEqual(
      IntegrationRoutingTopologyModels.map((item) => item.canonicalKey),
      [...EXPECTED_TOPOLOGIES],
    );
    assertAscending(
      IntegrationRoutingTopologyModels.map((item) => item.ordinal),
      "topology",
    );
    assert.ok(
      IntegrationRoutingTopologyModels.every(
        (item) =>
          item.graphEngine === false &&
          item.routingEngine === false &&
          item.visualization === false,
      ),
    );

    assert.equal(IntegrationRoutingLifecycleModels.length, 8);
    assert.deepEqual(
      IntegrationRoutingLifecycleModels.map((item) => item.canonicalKey),
      [...EXPECTED_LIFECYCLES],
    );
    assertAscending(
      IntegrationRoutingLifecycleModels.map((item) => item.ordinal),
      "lifecycle",
    );
    assert.ok(
      IntegrationRoutingLifecycleModels.every(
        (item) =>
          item.executesTransitions === false &&
          item.runtimeStateMachine === false,
      ),
    );
  });

  it("derives inventory dynamically from model collections", () => {
    const { collections, inventory } = IntegrationRoutingModelPlatform;
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

    assert.equal(inventory.domainModelCount, collections.domainModelCount);
    assert.equal(inventory.relationshipCount, collections.relationshipCount);
    assert.equal(inventory.topologyCount, collections.topologyCount);
    assert.equal(inventory.lifecycleCount, collections.lifecycleCount);
    assert.equal(inventory.countsDerivedFromCollections, true);
    assert.equal(IntegrationRoutingModelCollections.domainModelCount, 16);

    assert.equal(IntegrationRoutingModelSummary.domainModelCount, 16);
    assert.equal(IntegrationRoutingModelSummary.relationshipCount, 12);
    assert.equal(IntegrationRoutingModelSummary.topologyCount, 8);
    assert.equal(IntegrationRoutingModelSummary.lifecycleCount, 8);
    assert.equal(IntegrationRoutingModelSummary.status, "Model");
    assert.equal(
      IntegrationRoutingModelSummary.readiness,
      "ReadyForValidation",
    );
  });

  it("publishes immutable collections and zero runtime behavior", () => {
    const platform = IntegrationRoutingModelPlatform;
    assert.equal(Object.isFrozen(IntegrationRoutingModelIdentity), true);
    assert.equal(Object.isFrozen(IntegrationRoutingDomainModels), true);
    assert.equal(Object.isFrozen(IntegrationRoutingRelationshipModels), true);
    assert.equal(Object.isFrozen(IntegrationRoutingTopologyModels), true);
    assert.equal(Object.isFrozen(IntegrationRoutingLifecycleModels), true);
    assert.equal(Object.isFrozen(IntegrationRoutingModelCollections), true);
    assert.equal(Object.isFrozen(IntegrationRoutingModelSummary), true);
    assert.equal(Object.isFrozen(platform), true);
    assert.ok(platform.domains.every((item) => Object.isFrozen(item)));
    assert.ok(platform.relationships.every((item) => Object.isFrozen(item)));
    assert.ok(platform.topologies.every((item) => Object.isFrozen(item)));
    assert.ok(platform.lifecycles.every((item) => Object.isFrozen(item)));

    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.routingEngine, false);
    assert.equal(platform.messageExecution, false);
    assert.equal(platform.orchestrationBehavior, false);
    assert.equal(platform.schedulingBehavior, false);
    assert.equal(platform.networkingBehavior, false);
    assert.equal(platform.validationEngine, false);
    assert.equal(platform.aiBehavior, false);
    assert.equal(platform.uiBehavior, false);
    assert.equal(platform.stateMutation, false);
    assert.equal(platform.importsLaterEil3Phases, false);
  });

  it("has zero prohibited imports across model sources", () => {
    const sources = EIL33_FILES.filter((name) => !name.endsWith(".test.ts"));
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
    const sources = EIL33_FILES.filter((name) => !name.endsWith(".test.ts")).map(
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
        "app/lib/eil/integrationRoutingRegistry.ts",
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
