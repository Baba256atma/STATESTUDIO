/**
 * EIL-3:2 — Integration Routing Registry Tests.
 *
 * Deterministic coverage for the immutable Integration Routing Registry.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { IntegrationRoutingFoundationPlatform } from "./integrationRoutingFoundation.ts";
import * as RegistryModule from "./integrationRoutingRegistry.ts";
import {
  IntegrationRoutingCapabilityRegistry,
  IntegrationRoutingCategoryRegistry,
  IntegrationRoutingContractRegistry,
  IntegrationRoutingRegistryCollections,
  IntegrationRoutingRegistryIdentity,
  IntegrationRoutingRegistryPlatform,
  IntegrationRoutingRegistrySummary,
  IntegrationRoutingResponsibilityRegistry,
} from "./integrationRoutingRegistry.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../..");

const EIL32_FILES = Object.freeze([
  "integrationRoutingRegistryTypes.ts",
  "integrationRoutingRegistryIdentity.ts",
  "integrationRoutingCategoryRegistry.ts",
  "integrationRoutingContractRegistry.ts",
  "integrationRoutingCapabilityRegistry.ts",
  "integrationRoutingResponsibilityRegistry.ts",
  "integrationRoutingRegistry.ts",
  "integrationRoutingRegistry.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationRoutingRegistryIdentity",
  "IntegrationRoutingCategoryRegistry",
  "IntegrationRoutingContractRegistry",
  "IntegrationRoutingCapabilityRegistry",
  "IntegrationRoutingResponsibilityRegistry",
  "IntegrationRoutingRegistryCollections",
  "IntegrationRoutingRegistrySummary",
  "IntegrationRoutingRegistryPlatform",
] as const);

const EXPECTED_CATEGORIES = Object.freeze([
  "DirectRoute",
  "ConditionalRoute",
  "SequentialRoute",
  "ParallelRoute",
  "EventRoute",
  "RequestRoute",
  "ResponseRoute",
  "ScheduledRoute",
  "GatewayRoute",
  "CompositeRoute",
] as const);

const EXPECTED_CATEGORY_NAMES = Object.freeze([
  "Direct Route",
  "Conditional Route",
  "Sequential Route",
  "Parallel Route",
  "Event Route",
  "Request Route",
  "Response Route",
  "Scheduled Route",
  "Gateway Route",
  "Composite Route",
] as const);

const EXPECTED_CONTRACTS = Object.freeze([
  "RouteContract",
  "RouteIdentityContract",
  "RoutePathContract",
  "RoutePolicyContract",
  "RouteConditionContract",
  "RoutePriorityContract",
  "RouteCompatibilityContract",
  "RouteConfigurationContract",
  "RouteLifecycleContract",
  "RouteMetadataContract",
] as const);

const EXPECTED_CAPABILITIES = Object.freeze([
  "RouteClassification",
  "RouteDescription",
  "RouteMetadata",
  "RouteDependencyDeclaration",
  "RouteCompatibilityDeclaration",
  "RouteLifecycleAwareness",
  "RoutePolicyDescription",
  "RouteConfigurationMetadata",
  "RouteInventorySupport",
  "RouteReadinessDeclaration",
] as const);

const EXPECTED_RESPONSIBILITIES = Object.freeze([
  "PreserveRouteIdentity",
  "PreserveArchitecturalBoundaries",
  "PublishRouteMetadata",
  "PreserveCompatibility",
  "PreserveDeterministicInventories",
  "PreserveDependencyDirection",
  "SupportFutureRuntimePlatforms",
  "PreserveArchitecturalConsistency",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\/integrationRoutingFoundation(?!\.ts["'])/,
  /from ["']\.\/integrationRoutingFoundation(Types|Contracts|Capabilities|Responsibilities|Lifecycle|Identity)\.ts["']/,
  /from ["']\.\/integration(?!Routing)/,
  /from ["']\.\/integrationConnector/,
  /from ["']\.\/integrationPublicIndex/,
  /from ["']\.\/integrationRouting(Model|Validation|Manifest|Platform|Certification|Freeze|PublicIndex)/,
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

describe("EIL-3:2 Integration Routing Registry", () => {
  it("creates exactly eight Registry files and eight public exports", () => {
    assert.equal(EIL32_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL32_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(RegistryModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(RegistryModule).length, 8);
  });

  it("has canonical identity, namespace, version, Registry status, and ReadyForModel", () => {
    assert.equal(IntegrationRoutingRegistryIdentity.phaseId, "EIL-3:2");
    assert.equal(
      IntegrationRoutingRegistryIdentity.canonicalId,
      "EIL-3:2/IntegrationRoutingRegistry",
    );
    assert.equal(
      IntegrationRoutingRegistryIdentity.name,
      "Integration Routing Registry",
    );
    assert.equal(IntegrationRoutingRegistryIdentity.version, "1.0.0");
    assert.equal(
      IntegrationRoutingRegistryIdentity.namespace,
      "nexora.eil.integration-routing.registry",
    );
    assert.equal(IntegrationRoutingRegistryIdentity.layer, "EIL");
    assert.equal(IntegrationRoutingRegistryIdentity.platform, "EIL-3");
    assert.equal(IntegrationRoutingRegistryIdentity.phaseType, "Registry");
    assert.equal(IntegrationRoutingRegistryIdentity.status, "Registry");
    assert.equal(
      IntegrationRoutingRegistryIdentity.readiness,
      "ReadyForModel",
    );
    assert.equal(IntegrationRoutingRegistryPlatform.status, "Registry");
    assert.equal(
      IntegrationRoutingRegistryPlatform.readiness,
      "ReadyForModel",
    );
    assert.equal(
      IntegrationRoutingRegistryPlatform.nextPhase,
      "EIL-3:3 — Integration Routing Model",
    );
  });

  it("declares Foundation aggregate as the sole phase dependency", () => {
    const { dependency } = IntegrationRoutingRegistryPlatform;
    assert.equal(dependency.phaseDependencyCount, 1);
    assert.equal(dependency.foundationOnly, true);
    assert.equal(
      dependency.foundationId,
      "EIL-3:1/IntegrationRoutingFoundation",
    );
    assert.equal(
      dependency.directPreviousPhaseModule,
      "integrationRoutingFoundation.ts",
    );
    assert.equal(
      IntegrationRoutingRegistryIdentity.foundationDependency,
      "EIL-3:1/IntegrationRoutingFoundation",
    );
    assert.equal(
      IntegrationRoutingRegistryIdentity.foundationEntryPoint,
      "integrationRoutingFoundation.ts",
    );
    assert.equal(dependency.foundationInternalImport, false);
    assert.equal(dependency.previousEilPlatformDependency, false);
    assert.equal(dependency.laterEil3PhaseImport, false);
    assert.equal(dependency.foundationPublicSurfaceOnly, true);
    assert.equal(
      IntegrationRoutingRegistryPlatform.foundationPlatform,
      IntegrationRoutingFoundationPlatform,
    );
  });

  it("registers exactly ten routing categories with unique IDs and ordinals", () => {
    assert.equal(IntegrationRoutingCategoryRegistry.length, 10);
    assert.deepEqual(
      IntegrationRoutingCategoryRegistry.map((item) => item.categoryKey),
      [...EXPECTED_CATEGORIES],
    );
    assert.deepEqual(
      IntegrationRoutingCategoryRegistry.map((item) => item.canonicalName),
      [...EXPECTED_CATEGORY_NAMES],
    );
    assertUnique(
      IntegrationRoutingCategoryRegistry.map((item) => item.id),
      "category registry IDs",
    );
    assertAscending(
      IntegrationRoutingCategoryRegistry.map((item) => item.ordinal),
      "category",
    );
    assert.ok(
      IntegrationRoutingCategoryRegistry.every(
        (item) => item.executesRuntime === false && item.metadataOnly === true,
      ),
    );
  });

  it("registers exactly ten routing contracts with unique IDs and ordinals", () => {
    assert.equal(IntegrationRoutingContractRegistry.length, 10);
    assert.deepEqual(
      IntegrationRoutingContractRegistry.map((item) => item.contractKey),
      [...EXPECTED_CONTRACTS],
    );
    assertUnique(
      IntegrationRoutingContractRegistry.map((item) => item.id),
      "contract registry IDs",
    );
    assertAscending(
      IntegrationRoutingContractRegistry.map((item) => item.ordinal),
      "contract",
    );
    assert.ok(
      IntegrationRoutingContractRegistry.every(
        (item) =>
          typeof item.contractType === "string" &&
          typeof item.compatibilityClassification === "string",
      ),
    );
  });

  it("registers exactly ten capabilities and eight responsibilities", () => {
    assert.equal(IntegrationRoutingCapabilityRegistry.length, 10);
    assert.deepEqual(
      IntegrationRoutingCapabilityRegistry.map((item) => item.capabilityKey),
      [...EXPECTED_CAPABILITIES],
    );
    assertUnique(
      IntegrationRoutingCapabilityRegistry.map((item) => item.id),
      "capability registry IDs",
    );
    assertAscending(
      IntegrationRoutingCapabilityRegistry.map((item) => item.ordinal),
      "capability",
    );

    assert.equal(IntegrationRoutingResponsibilityRegistry.length, 8);
    assert.deepEqual(
      IntegrationRoutingResponsibilityRegistry.map(
        (item) => item.responsibilityKey,
      ),
      [...EXPECTED_RESPONSIBILITIES],
    );
    assertUnique(
      IntegrationRoutingResponsibilityRegistry.map((item) => item.id),
      "responsibility registry IDs",
    );
    assertAscending(
      IntegrationRoutingResponsibilityRegistry.map((item) => item.ordinal),
      "responsibility",
    );
    assert.ok(
      IntegrationRoutingResponsibilityRegistry.every(
        (item) => item.architecturalOwner === "EIL-3",
      ),
    );
  });

  it("derives inventory dynamically from registry collections", () => {
    const { collections, inventory } = IntegrationRoutingRegistryPlatform;
    assert.equal(collections.categoryCount, collections.categories.length);
    assert.equal(collections.contractCount, collections.contracts.length);
    assert.equal(collections.capabilityCount, collections.capabilities.length);
    assert.equal(
      collections.responsibilityCount,
      collections.responsibilities.length,
    );
    assert.equal(collections.categoryCount, 10);
    assert.equal(collections.contractCount, 10);
    assert.equal(collections.capabilityCount, 10);
    assert.equal(collections.responsibilityCount, 8);
    assert.equal(collections.lifecycleStateCount, 8);
    assert.equal(collections.totalRegistryEntryCount, 38);

    assert.equal(inventory.categoryCount, collections.categoryCount);
    assert.equal(inventory.contractCount, collections.contractCount);
    assert.equal(inventory.capabilityCount, collections.capabilityCount);
    assert.equal(
      inventory.responsibilityCount,
      collections.responsibilityCount,
    );
    assert.equal(inventory.countsDerivedFromCollections, true);
    assert.equal(IntegrationRoutingRegistryCollections.categoryCount, 10);

    assert.equal(IntegrationRoutingRegistrySummary.categoryCount, 10);
    assert.equal(IntegrationRoutingRegistrySummary.contractCount, 10);
    assert.equal(IntegrationRoutingRegistrySummary.capabilityCount, 10);
    assert.equal(IntegrationRoutingRegistrySummary.responsibilityCount, 8);
    assert.equal(IntegrationRoutingRegistrySummary.status, "Registry");
    assert.equal(IntegrationRoutingRegistrySummary.readiness, "ReadyForModel");
  });

  it("publishes immutable registry collections and platform aggregates", () => {
    const platform = IntegrationRoutingRegistryPlatform;
    assert.equal(Object.isFrozen(IntegrationRoutingRegistryIdentity), true);
    assert.equal(Object.isFrozen(IntegrationRoutingCategoryRegistry), true);
    assert.equal(Object.isFrozen(IntegrationRoutingContractRegistry), true);
    assert.equal(Object.isFrozen(IntegrationRoutingCapabilityRegistry), true);
    assert.equal(
      Object.isFrozen(IntegrationRoutingResponsibilityRegistry),
      true,
    );
    assert.equal(Object.isFrozen(IntegrationRoutingRegistryCollections), true);
    assert.equal(Object.isFrozen(IntegrationRoutingRegistrySummary), true);
    assert.equal(Object.isFrozen(platform), true);
    assert.ok(platform.categories.every((item) => Object.isFrozen(item)));
    assert.ok(platform.contracts.every((item) => Object.isFrozen(item)));
    assert.ok(platform.capabilities.every((item) => Object.isFrozen(item)));
    assert.ok(platform.responsibilities.every((item) => Object.isFrozen(item)));
  });

  it("is metadata-only with zero runtime routing behavior", () => {
    const platform = IntegrationRoutingRegistryPlatform;
    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.runtimeEnforcement, false);
    assert.equal(platform.routingEngine, false);
    assert.equal(platform.messageExecution, false);
    assert.equal(platform.orchestrationBehavior, false);
    assert.equal(platform.schedulingBehavior, false);
    assert.equal(platform.networkingBehavior, false);
    assert.equal(platform.restBehavior, false);
    assert.equal(platform.graphqlBehavior, false);
    assert.equal(platform.websocketBehavior, false);
    assert.equal(platform.queueBehavior, false);
    assert.equal(platform.connectorExecution, false);
    assert.equal(platform.adapterBehavior, false);
    assert.equal(platform.sdkRuntime, false);
    assert.equal(platform.persistenceBehavior, false);
    assert.equal(platform.storageBehavior, false);
    assert.equal(platform.cacheBehavior, false);
    assert.equal(platform.filesystemBehavior, false);
    assert.equal(platform.serviceBehavior, false);
    assert.equal(platform.dependencyInjection, false);
    assert.equal(platform.loggingBehavior, false);
    assert.equal(platform.monitoringBehavior, false);
    assert.equal(platform.telemetryBehavior, false);
    assert.equal(platform.aiBehavior, false);
    assert.equal(platform.llmBehavior, false);
    assert.equal(platform.uiBehavior, false);
    assert.equal(platform.reactBehavior, false);
    assert.equal(platform.businessLogicBehavior, false);
    assert.equal(platform.stateMutation, false);
    assert.equal(platform.previousEilPlatformDependency, false);
    assert.equal(platform.importsLaterEil3Phases, false);
  });

  it("has zero prohibited imports across registry sources", () => {
    const sources = EIL32_FILES.filter((name) => !name.endsWith(".test.ts"));
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

  it("passes strict TypeScript and ESLint for registry sources", () => {
    const sources = EIL32_FILES.filter((name) => !name.endsWith(".test.ts")).map(
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
        "app/lib/eil/integrationRoutingFoundation.ts",
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
