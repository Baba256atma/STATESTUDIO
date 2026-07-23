/**
 * EIL-3:1 — Integration Routing Foundation Tests.
 *
 * Deterministic coverage for the immutable Integration Routing Foundation.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import * as FoundationModule from "./integrationRoutingFoundation.ts";
import {
  IntegrationRoutingFoundationCapabilities,
  IntegrationRoutingFoundationCollections,
  IntegrationRoutingFoundationContracts,
  IntegrationRoutingFoundationIdentity,
  IntegrationRoutingFoundationLifecycle,
  IntegrationRoutingFoundationPlatform,
  IntegrationRoutingFoundationResponsibilities,
  IntegrationRoutingFoundationSummary,
} from "./integrationRoutingFoundation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../..");

const EIL31_FILES = Object.freeze([
  "integrationRoutingFoundationTypes.ts",
  "integrationRoutingFoundationIdentity.ts",
  "integrationRoutingFoundationContracts.ts",
  "integrationRoutingFoundationCapabilities.ts",
  "integrationRoutingFoundationResponsibilities.ts",
  "integrationRoutingFoundationLifecycle.ts",
  "integrationRoutingFoundation.ts",
  "integrationRoutingFoundation.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationRoutingFoundationIdentity",
  "IntegrationRoutingFoundationContracts",
  "IntegrationRoutingFoundationCapabilities",
  "IntegrationRoutingFoundationResponsibilities",
  "IntegrationRoutingFoundationLifecycle",
  "IntegrationRoutingFoundationCollections",
  "IntegrationRoutingFoundationSummary",
  "IntegrationRoutingFoundationPlatform",
] as const);

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "categories",
  "contracts",
  "capabilities",
  "responsibilities",
  "lifecycle",
  "ownership",
  "boundaries",
  "compatibility",
  "terminology",
  "readiness",
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
  /from ["']\.\.\//,
  /from ["'][^"']*\/(bus|ops|engine|dkl|nea|eve|director|advisor|core)\//,
  /from ["']\.\/integration(?!RoutingFoundation)/,
  /from ["']\.\/integrationConnector/,
  /from ["']\.\/integrationPublicIndex/,
  /from ["']node:net["']/,
  /from ["']node:http["']/,
  /from ["']node:fs\/promises["']/,
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

describe("EIL-3:1 Integration Routing Foundation", () => {
  it("creates exactly eight Foundation files and eight public exports", () => {
    assert.equal(EIL31_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL31_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(FoundationModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(FoundationModule).length, 8);
  });

  it("has canonical identity, namespace, version, and Foundation status", () => {
    assert.equal(
      IntegrationRoutingFoundationIdentity.foundationId,
      "EIL-3:1/IntegrationRoutingFoundation",
    );
    assert.equal(IntegrationRoutingFoundationIdentity.foundationVersion, "1.0.0");
    assert.equal(
      IntegrationRoutingFoundationIdentity.foundationName,
      "Integration Routing Foundation",
    );
    assert.equal(
      IntegrationRoutingFoundationIdentity.foundationNamespace,
      "nexora.eil.integration-routing.foundation",
    );
    assert.equal(IntegrationRoutingFoundationIdentity.status, "Foundation");
    assert.equal(
      IntegrationRoutingFoundationIdentity.readiness,
      "ReadyForRegistry",
    );
    assert.equal(IntegrationRoutingFoundationIdentity.platform, "EIL-3");
    assert.equal(IntegrationRoutingFoundationIdentity.phaseId, "EIL-3:1");
    assert.equal(IntegrationRoutingFoundationIdentity.phaseType, "Foundation");
    assert.equal(
      IntegrationRoutingFoundationPlatform.identity.foundationNamespace,
      "nexora.eil.integration-routing.foundation",
    );
    assert.equal(
      IntegrationRoutingFoundationPlatform.readiness,
      "ReadyForRegistry",
    );
    assert.equal(
      IntegrationRoutingFoundationPlatform.nextPhase,
      "EIL-3:2 — Integration Routing Registry",
    );
  });

  it("publishes immutable exports and frozen aggregates", () => {
    const platform = IntegrationRoutingFoundationPlatform;
    assert.equal(Object.isFrozen(IntegrationRoutingFoundationIdentity), true);
    assert.equal(Object.isFrozen(IntegrationRoutingFoundationContracts), true);
    assert.equal(
      Object.isFrozen(IntegrationRoutingFoundationCapabilities),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationRoutingFoundationResponsibilities),
      true,
    );
    assert.equal(Object.isFrozen(IntegrationRoutingFoundationLifecycle), true);
    assert.equal(
      Object.isFrozen(IntegrationRoutingFoundationCollections),
      true,
    );
    assert.equal(Object.isFrozen(IntegrationRoutingFoundationSummary), true);
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(platform.identity), true);
    assert.equal(Object.isFrozen(platform.categories), true);
    assert.equal(Object.isFrozen(platform.contracts), true);
    assert.equal(Object.isFrozen(platform.capabilities), true);
    assert.equal(Object.isFrozen(platform.responsibilities), true);
    assert.equal(Object.isFrozen(platform.lifecycle), true);
    assert.equal(Object.isFrozen(platform.ownership), true);
    assert.equal(Object.isFrozen(platform.boundaries), true);
    assert.equal(Object.isFrozen(platform.compatibility), true);
    assert.equal(Object.isFrozen(platform.terminology), true);
    assert.equal(Object.isFrozen(platform.inventory), true);
    assert.ok(platform.categories.every((item) => Object.isFrozen(item)));
    assert.ok(platform.contracts.every((item) => Object.isFrozen(item)));
    assert.ok(
      platform.capabilityDeclarations.every((item) => Object.isFrozen(item)),
    );
    assert.ok(
      platform.responsibilityDeclarations.every((item) =>
        Object.isFrozen(item)
      ),
    );
  });

  it("publishes exactly ten routing categories in deterministic order", () => {
    const { categories } = IntegrationRoutingFoundationPlatform;
    assert.equal(categories.length, 10);
    assert.deepEqual(
      categories.map((item) => item.categoryKey),
      [...EXPECTED_CATEGORIES],
    );
    assert.deepEqual(
      categories.map((item) => item.canonicalName),
      [...EXPECTED_CATEGORY_NAMES],
    );
    assertUnique(
      categories.map((item) => item.categoryId),
      "category IDs",
    );
    assertAscending(
      categories.map((item) => item.deterministicOrder),
      "category",
    );
    assert.ok(categories.every((item) => item.runtimeImplemented === false));
    assert.ok(categories.every((item) => item.metadataOnly === true));
    assert.equal(
      IntegrationRoutingFoundationCollections.routingCategoryCount,
      categories.length,
    );
  });

  it("publishes exactly ten contracts in deterministic order", () => {
    const { contracts, contractNames } = IntegrationRoutingFoundationPlatform;
    assert.equal(contracts.length, 10);
    assert.equal(IntegrationRoutingFoundationContracts.length, 10);
    assert.deepEqual([...contractNames], [...EXPECTED_CONTRACTS]);
    assert.deepEqual(
      contracts.map((item) => item.contractId),
      EXPECTED_CONTRACTS.map((name) => `EIL-3:1/Contract/${name}`),
    );
    assertUnique(
      contracts.map((item) => item.contractId),
      "contract IDs",
    );
    assertAscending(
      contracts.map((item) => item.deterministicOrder),
      "contract",
    );
    assert.ok(contracts.every((item) => item.runtimeBehavior === "None"));
    assert.ok(contracts.every((item) => item.metadataOnly === true));
    assert.equal(
      IntegrationRoutingFoundationCollections.contractCount,
      contracts.length,
    );
  });

  it("publishes exactly eight unique lifecycle states", () => {
    const { lifecycle } = IntegrationRoutingFoundationPlatform;
    assert.deepEqual([...lifecycle.states], [...EXPECTED_LIFECYCLE]);
    assert.equal(lifecycle.stateCount, 8);
    assert.equal(IntegrationRoutingFoundationLifecycle.stateCount, 8);
    assert.equal(lifecycle.currentState, "Verified");
    assert.equal(lifecycle.foundationReadiness, "ReadyForRegistry");
    assert.equal(lifecycle.executesTransitions, false);
    assert.equal(lifecycle.runtimeStateMachine, false);
    assertUnique([...lifecycle.states], "lifecycle states");
  });

  it("publishes exactly ten capabilities and eight responsibilities", () => {
    const {
      capabilityDeclarations,
      responsibilityDeclarations,
      capabilities,
      responsibilities,
    } = IntegrationRoutingFoundationPlatform;

    assert.equal(capabilityDeclarations.length, 10);
    assert.equal(IntegrationRoutingFoundationCapabilities.length, 10);
    assert.deepEqual(
      capabilityDeclarations.map((item) => item.capabilityKey),
      [...EXPECTED_CAPABILITIES],
    );
    assertUnique(
      capabilityDeclarations.map((item) => item.capabilityId),
      "capability IDs",
    );
    assertAscending(
      capabilityDeclarations.map((item) => item.deterministicOrder),
      "capability",
    );
    assert.equal(capabilities.capabilityCount, 10);
    assert.equal(capabilities.executesRuntime, false);

    assert.equal(responsibilityDeclarations.length, 8);
    assert.equal(IntegrationRoutingFoundationResponsibilities.length, 8);
    assert.deepEqual(
      responsibilityDeclarations.map((item) => item.responsibilityId),
      [...EXPECTED_RESPONSIBILITIES],
    );
    assertUnique(
      responsibilityDeclarations.map((item) => item.responsibilityId),
      "responsibility IDs",
    );
    assertAscending(
      responsibilityDeclarations.map((item) => item.deterministicOrder),
      "responsibility",
    );
    assert.equal(responsibilities.responsibilityCount, 8);
    assert.equal(responsibilities.executesRuntime, false);
    assert.equal(responsibilities.performsBusinessLogic, false);
  });

  it("derives inventory dynamically and preserves ownership boundaries", () => {
    const { inventory, ownership, boundaries, compatibility, terminology } =
      IntegrationRoutingFoundationPlatform;
    const collections = IntegrationRoutingFoundationCollections;

    assert.equal(inventory.routingCategoryCount, 10);
    assert.equal(inventory.contractCount, 10);
    assert.equal(inventory.capabilityCount, 10);
    assert.equal(inventory.responsibilityCount, 8);
    assert.equal(inventory.lifecycleStateCount, 8);
    assert.equal(inventory.totalFoundationEntryCount, 46);
    assert.equal(inventory.countsDerivedFromCollections, true);

    assert.equal(
      collections.routingCategoryCount,
      collections.categories.length,
    );
    assert.equal(collections.contractCount, collections.contracts.length);
    assert.equal(collections.capabilityCount, collections.capabilities.length);
    assert.equal(
      collections.responsibilityCount,
      collections.responsibilities.length,
    );
    assert.equal(
      collections.lifecycleStateCount,
      collections.lifecycleStates.length,
    );

    assert.ok(ownership.owns.includes("Routing metadata"));
    assert.ok(ownership.owns.includes("Routing terminology"));
    assert.ok(ownership.owns.includes("Routing lifecycle"));
    assert.ok(ownership.doesNotOwn.includes("Routing engine"));
    assert.ok(ownership.doesNotOwn.includes("AI"));
    assert.ok(ownership.doesNotOwn.includes("Networking"));
    assert.equal(ownership.ownsRoutingEngine, false);
    assert.equal(ownership.consumesPreviousEilPlatforms, false);

    assert.ok(boundaries.dependencyRules.includes("ApprovedNpaStandardsOnly"));
    assert.ok(
      boundaries.dependencyRules.includes("NoPreviousEilPlatformDependency"),
    );
    assert.ok(boundaries.prohibitedSurfaces.includes("REST"));
    assert.equal(boundaries.runtimeEnforcement, false);
    assert.equal(
      boundaries.layerSeparation.previousEilPlatformsUnconsumed,
      true,
    );

    assert.equal(compatibility.runtimeValidation, false);
    assert.ok(compatibility.declarations.length >= 4);
    assert.equal(terminology.terms.length, 6);
  });

  it("is metadata-only with zero prohibited runtime behavior", () => {
    const platform = IntegrationRoutingFoundationPlatform;
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
    assert.equal(platform.consumesPreviousEilPlatforms, false);
    assert.equal(platform.importsLaterEil3Phases, false);
    assert.equal(platform.dependency.previousEilPlatformDependency, false);
    assert.equal(platform.dependency.laterEil3PhaseImport, false);
    assert.equal(platform.dependency.upstreamDependencies.length, 0);
    assert.equal(platform.dependency.downstreamDependencies.length, 0);
  });

  it("has zero prohibited imports across foundation sources", () => {
    const sources = EIL31_FILES.filter((name) => !name.endsWith(".test.ts"));
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

  it("preserves ordered platform sections and deterministic summary", () => {
    const platform = IntegrationRoutingFoundationPlatform;
    const keys = Object.keys(platform);
    assert.deepEqual(keys.slice(0, 12), [...PLATFORM_SECTIONS]);
    assert.equal(platform.sectionCount, 12);
    assert.deepEqual([...platform.sectionOrder], [...PLATFORM_SECTIONS]);

    const summary = IntegrationRoutingFoundationSummary;
    assert.equal(Object.isFrozen(summary), true);
    assert.equal(
      summary.foundationId,
      "EIL-3:1/IntegrationRoutingFoundation",
    );
    assert.equal(
      summary.namespace,
      "nexora.eil.integration-routing.foundation",
    );
    assert.equal(summary.version, "1.0.0");
    assert.equal(summary.status, "Foundation");
    assert.equal(summary.readiness, "ReadyForRegistry");
    assert.equal(summary.routingCategoryCount, 10);
    assert.equal(summary.contractCount, 10);
    assert.equal(summary.capabilityCount, 10);
    assert.equal(summary.responsibilityCount, 8);
    assert.equal(summary.lifecycleStateCount, 8);
    assert.equal(summary.sectionCount, 12);
    assert.equal(summary.metadataOnly, true);
    assert.equal(
      summary.nextPhase,
      "EIL-3:2 — Integration Routing Registry",
    );
  });

  it("passes strict TypeScript and ESLint for foundation sources", () => {
    const sources = EIL31_FILES.filter((name) => !name.endsWith(".test.ts")).map(
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
