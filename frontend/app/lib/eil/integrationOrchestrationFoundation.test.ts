/**
 * EIL-4:1 — Integration Orchestration Foundation Tests.
 *
 * Deterministic coverage for the immutable Integration Orchestration Foundation.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import * as FoundationModule from "./integrationOrchestrationFoundation.ts";
import {
  IntegrationOrchestrationFoundationCapabilities,
  IntegrationOrchestrationFoundationCollections,
  IntegrationOrchestrationFoundationContracts,
  IntegrationOrchestrationFoundationIdentity,
  IntegrationOrchestrationFoundationLifecycle,
  IntegrationOrchestrationFoundationPlatform,
  IntegrationOrchestrationFoundationResponsibilities,
  IntegrationOrchestrationFoundationSummary,
} from "./integrationOrchestrationFoundation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../..");

const EIL41_FILES = Object.freeze([
  "integrationOrchestrationFoundationTypes.ts",
  "integrationOrchestrationFoundationIdentity.ts",
  "integrationOrchestrationFoundationContracts.ts",
  "integrationOrchestrationFoundationCapabilities.ts",
  "integrationOrchestrationFoundationResponsibilities.ts",
  "integrationOrchestrationFoundationLifecycle.ts",
  "integrationOrchestrationFoundation.ts",
  "integrationOrchestrationFoundation.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationOrchestrationFoundationIdentity",
  "IntegrationOrchestrationFoundationContracts",
  "IntegrationOrchestrationFoundationCapabilities",
  "IntegrationOrchestrationFoundationResponsibilities",
  "IntegrationOrchestrationFoundationLifecycle",
  "IntegrationOrchestrationFoundationCollections",
  "IntegrationOrchestrationFoundationSummary",
  "IntegrationOrchestrationFoundationPlatform",
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
  "SequentialFlow",
  "ParallelFlow",
  "ConditionalFlow",
  "EventDrivenFlow",
  "ScheduledFlow",
  "ApprovalFlow",
  "RecoveryFlow",
  "CompensationFlow",
  "CompositeFlow",
  "ExecutiveFlow",
] as const);

const EXPECTED_CATEGORY_NAMES = Object.freeze([
  "Sequential Flow",
  "Parallel Flow",
  "Conditional Flow",
  "Event-driven Flow",
  "Scheduled Flow",
  "Approval Flow",
  "Recovery Flow",
  "Compensation Flow",
  "Composite Flow",
  "Executive Flow",
] as const);

const EXPECTED_CONTRACTS = Object.freeze([
  "OrchestrationContract",
  "FlowContract",
  "StepContract",
  "TransitionContract",
  "TriggerContract",
  "DependencyContract",
  "CompletionContract",
  "FailureContract",
  "StateContract",
  "MetadataContract",
] as const);

const EXPECTED_CAPABILITIES = Object.freeze([
  "FlowDescription",
  "StepDescription",
  "DependencyDeclaration",
  "TransitionDescription",
  "StateDescription",
  "TriggerDeclaration",
  "CompletionDeclaration",
  "FailureDeclaration",
  "InventorySupport",
  "OrchestrationReadiness",
] as const);

const EXPECTED_RESPONSIBILITIES = Object.freeze([
  "PreserveOrchestrationIdentity",
  "PreserveArchitecturalBoundaries",
  "PublishOrchestrationMetadata",
  "PreserveDependencyDirection",
  "PreserveCompatibility",
  "PreserveDeterministicInventories",
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
  /from ["']\.\/integration(?!OrchestrationFoundation)/,
  /from ["']\.\/integrationConnector/,
  /from ["']\.\/integrationRouting/,
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

describe("EIL-4:1 Integration Orchestration Foundation", () => {
  it("creates exactly eight Foundation files and eight public exports", () => {
    assert.equal(EIL41_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL41_FILES) {
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
      IntegrationOrchestrationFoundationIdentity.foundationId,
      "EIL-4:1/IntegrationOrchestrationFoundation",
    );
    assert.equal(
      IntegrationOrchestrationFoundationIdentity.foundationVersion,
      "1.0.0",
    );
    assert.equal(
      IntegrationOrchestrationFoundationIdentity.foundationName,
      "Integration Orchestration Foundation",
    );
    assert.equal(
      IntegrationOrchestrationFoundationIdentity.foundationNamespace,
      "nexora.eil.integration-orchestration.foundation",
    );
    assert.equal(
      IntegrationOrchestrationFoundationIdentity.status,
      "Foundation",
    );
    assert.equal(
      IntegrationOrchestrationFoundationIdentity.readiness,
      "ReadyForRegistry",
    );
    assert.equal(IntegrationOrchestrationFoundationIdentity.platform, "EIL-4");
    assert.equal(IntegrationOrchestrationFoundationIdentity.phaseId, "EIL-4:1");
    assert.equal(
      IntegrationOrchestrationFoundationIdentity.phaseType,
      "Foundation",
    );
    assert.equal(
      IntegrationOrchestrationFoundationPlatform.identity.foundationNamespace,
      "nexora.eil.integration-orchestration.foundation",
    );
    assert.equal(
      IntegrationOrchestrationFoundationPlatform.readiness,
      "ReadyForRegistry",
    );
    assert.equal(
      IntegrationOrchestrationFoundationPlatform.nextPhase,
      "EIL-4:2 — Integration Orchestration Registry",
    );
  });

  it("publishes immutable exports and frozen aggregates", () => {
    const platform = IntegrationOrchestrationFoundationPlatform;
    assert.equal(
      Object.isFrozen(IntegrationOrchestrationFoundationIdentity),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationOrchestrationFoundationContracts),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationOrchestrationFoundationCapabilities),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationOrchestrationFoundationResponsibilities),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationOrchestrationFoundationLifecycle),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationOrchestrationFoundationCollections),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationOrchestrationFoundationSummary),
      true,
    );
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
        Object.isFrozen(item),
      ),
    );
  });

  it("publishes exactly ten orchestration categories in deterministic order", () => {
    const { categories } = IntegrationOrchestrationFoundationPlatform;
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
      IntegrationOrchestrationFoundationCollections.orchestrationCategoryCount,
      categories.length,
    );
  });

  it("publishes exactly ten contracts in deterministic order", () => {
    const { contracts, contractNames } =
      IntegrationOrchestrationFoundationPlatform;
    assert.equal(contracts.length, 10);
    assert.equal(IntegrationOrchestrationFoundationContracts.length, 10);
    assert.deepEqual([...contractNames], [...EXPECTED_CONTRACTS]);
    assert.deepEqual(
      contracts.map((item) => item.contractId),
      EXPECTED_CONTRACTS.map((name) => `EIL-4:1/Contract/${name}`),
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
      IntegrationOrchestrationFoundationCollections.contractCount,
      contracts.length,
    );
  });

  it("publishes exactly eight unique lifecycle states", () => {
    const { lifecycle } = IntegrationOrchestrationFoundationPlatform;
    assert.deepEqual([...lifecycle.states], [...EXPECTED_LIFECYCLE]);
    assert.equal(lifecycle.stateCount, 8);
    assert.equal(IntegrationOrchestrationFoundationLifecycle.stateCount, 8);
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
    } = IntegrationOrchestrationFoundationPlatform;

    assert.equal(capabilityDeclarations.length, 10);
    assert.equal(IntegrationOrchestrationFoundationCapabilities.length, 10);
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
    assert.equal(IntegrationOrchestrationFoundationResponsibilities.length, 8);
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
      IntegrationOrchestrationFoundationPlatform;
    const collections = IntegrationOrchestrationFoundationCollections;

    assert.equal(inventory.orchestrationCategoryCount, 10);
    assert.equal(inventory.contractCount, 10);
    assert.equal(inventory.capabilityCount, 10);
    assert.equal(inventory.responsibilityCount, 8);
    assert.equal(inventory.lifecycleStateCount, 8);
    assert.equal(inventory.totalFoundationEntryCount, 46);
    assert.equal(inventory.countsDerivedFromCollections, true);

    assert.equal(
      collections.orchestrationCategoryCount,
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

    assert.ok(ownership.owns.includes("Orchestration metadata"));
    assert.ok(ownership.owns.includes("Orchestration terminology"));
    assert.ok(ownership.owns.includes("Orchestration lifecycle"));
    assert.ok(ownership.doesNotOwn.includes("Orchestration engine"));
    assert.ok(ownership.doesNotOwn.includes("AI"));
    assert.ok(ownership.doesNotOwn.includes("Networking"));
    assert.equal(ownership.ownsOrchestrationEngine, false);
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
    const platform = IntegrationOrchestrationFoundationPlatform;
    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.runtimeEnforcement, false);
    assert.equal(platform.orchestrationEngine, false);
    assert.equal(platform.workflowExecution, false);
    assert.equal(platform.routingExecution, false);
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
    assert.equal(platform.importsLaterEil4Phases, false);
    assert.equal(platform.dependency.previousEilPlatformDependency, false);
    assert.equal(platform.dependency.laterEil4PhaseImport, false);
    assert.equal(platform.dependency.upstreamDependencies.length, 0);
    assert.equal(platform.dependency.downstreamDependencies.length, 0);
  });

  it("has zero prohibited imports across foundation sources", () => {
    const sources = EIL41_FILES.filter((name) => !name.endsWith(".test.ts"));
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
    const platform = IntegrationOrchestrationFoundationPlatform;
    const keys = Object.keys(platform);
    assert.deepEqual(keys.slice(0, 12), [...PLATFORM_SECTIONS]);
    assert.equal(platform.sectionCount, 12);
    assert.deepEqual([...platform.sectionOrder], [...PLATFORM_SECTIONS]);

    const summary = IntegrationOrchestrationFoundationSummary;
    assert.equal(Object.isFrozen(summary), true);
    assert.equal(
      summary.foundationId,
      "EIL-4:1/IntegrationOrchestrationFoundation",
    );
    assert.equal(
      summary.namespace,
      "nexora.eil.integration-orchestration.foundation",
    );
    assert.equal(summary.version, "1.0.0");
    assert.equal(summary.status, "Foundation");
    assert.equal(summary.readiness, "ReadyForRegistry");
    assert.equal(summary.orchestrationCategoryCount, 10);
    assert.equal(summary.contractCount, 10);
    assert.equal(summary.capabilityCount, 10);
    assert.equal(summary.responsibilityCount, 8);
    assert.equal(summary.lifecycleStateCount, 8);
    assert.equal(summary.sectionCount, 12);
    assert.equal(summary.metadataOnly, true);
    assert.equal(
      summary.nextPhase,
      "EIL-4:2 — Integration Orchestration Registry",
    );
  });

  it("passes strict TypeScript and ESLint for foundation sources", () => {
    const sources = EIL41_FILES.filter((name) => !name.endsWith(".test.ts")).map(
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
