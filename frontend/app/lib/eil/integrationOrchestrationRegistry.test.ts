/**
 * EIL-4:2 — Integration Orchestration Registry Tests.
 *
 * Deterministic coverage for the immutable Integration Orchestration Registry.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { IntegrationOrchestrationFoundationPlatform } from "./integrationOrchestrationFoundation.ts";
import * as RegistryModule from "./integrationOrchestrationRegistry.ts";
import {
  IntegrationOrchestrationCapabilityRegistry,
  IntegrationOrchestrationCategoryRegistry,
  IntegrationOrchestrationContractRegistry,
  IntegrationOrchestrationRegistryCollections,
  IntegrationOrchestrationRegistryIdentity,
  IntegrationOrchestrationRegistryPlatform,
  IntegrationOrchestrationRegistrySummary,
  IntegrationOrchestrationResponsibilityRegistry,
} from "./integrationOrchestrationRegistry.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../..");

const EIL42_FILES = Object.freeze([
  "integrationOrchestrationRegistryTypes.ts",
  "integrationOrchestrationRegistryIdentity.ts",
  "integrationOrchestrationCategoryRegistry.ts",
  "integrationOrchestrationContractRegistry.ts",
  "integrationOrchestrationCapabilityRegistry.ts",
  "integrationOrchestrationResponsibilityRegistry.ts",
  "integrationOrchestrationRegistry.ts",
  "integrationOrchestrationRegistry.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationOrchestrationRegistryIdentity",
  "IntegrationOrchestrationCategoryRegistry",
  "IntegrationOrchestrationContractRegistry",
  "IntegrationOrchestrationCapabilityRegistry",
  "IntegrationOrchestrationResponsibilityRegistry",
  "IntegrationOrchestrationRegistryCollections",
  "IntegrationOrchestrationRegistrySummary",
  "IntegrationOrchestrationRegistryPlatform",
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
  /from ["']\.\/integrationOrchestrationFoundation(?!\.ts["'])/,
  /from ["']\.\/integrationOrchestrationFoundation(Types|Contracts|Capabilities|Responsibilities|Lifecycle|Identity)\.ts["']/,
  /from ["']\.\/integration(?!Orchestration)/,
  /from ["']\.\/integrationConnector/,
  /from ["']\.\/integrationRouting/,
  /from ["']\.\/integrationPublicIndex/,
  /from ["']\.\/integrationOrchestration(Model|Validation|Manifest|Platform|Certification|Freeze|PublicIndex)/,
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

const assertNoExecutableValues = (value: unknown, path: string): void => {
  assert.notEqual(typeof value, "function", `${path} must not be a function`);
  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      assertNoExecutableValues(value[index], `${path}[${index}]`);
    }
    return;
  }
  if (value !== null && typeof value === "object") {
    for (const [key, nested] of Object.entries(value)) {
      assertNoExecutableValues(nested, `${path}.${key}`);
    }
  }
};

describe("EIL-4:2 Integration Orchestration Registry", () => {
  it("creates exactly eight Registry files and eight public exports", () => {
    assert.equal(EIL42_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL42_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(RegistryModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(RegistryModule).length, 8);
  });

  it("has canonical identity, namespace, version, Registry status, and ReadyForModel", () => {
    assert.equal(IntegrationOrchestrationRegistryIdentity.phaseId, "EIL-4:2");
    assert.equal(
      IntegrationOrchestrationRegistryIdentity.canonicalId,
      "EIL-4:2/IntegrationOrchestrationRegistry",
    );
    assert.equal(
      IntegrationOrchestrationRegistryIdentity.name,
      "Integration Orchestration Registry",
    );
    assert.equal(IntegrationOrchestrationRegistryIdentity.version, "1.0.0");
    assert.equal(
      IntegrationOrchestrationRegistryIdentity.namespace,
      "nexora.eil.integration-orchestration.registry",
    );
    assert.equal(IntegrationOrchestrationRegistryIdentity.layer, "EIL");
    assert.equal(IntegrationOrchestrationRegistryIdentity.platform, "EIL-4");
    assert.equal(
      IntegrationOrchestrationRegistryIdentity.phaseType,
      "Registry",
    );
    assert.equal(IntegrationOrchestrationRegistryIdentity.status, "Registry");
    assert.equal(
      IntegrationOrchestrationRegistryIdentity.readiness,
      "ReadyForModel",
    );
    assert.equal(IntegrationOrchestrationRegistryPlatform.status, "Registry");
    assert.equal(
      IntegrationOrchestrationRegistryPlatform.readiness,
      "ReadyForModel",
    );
    assert.equal(
      IntegrationOrchestrationRegistryPlatform.nextPhase,
      "EIL-4:3 — Integration Orchestration Model",
    );
  });

  it("declares Foundation aggregate as the sole phase dependency", () => {
    const { dependency } = IntegrationOrchestrationRegistryPlatform;
    assert.equal(dependency.phaseDependencyCount, 1);
    assert.equal(dependency.foundationOnly, true);
    assert.equal(
      dependency.foundationId,
      "EIL-4:1/IntegrationOrchestrationFoundation",
    );
    assert.equal(
      dependency.directPreviousPhaseModule,
      "integrationOrchestrationFoundation.ts",
    );
    assert.equal(
      IntegrationOrchestrationRegistryIdentity.foundationDependency,
      "EIL-4:1/IntegrationOrchestrationFoundation",
    );
    assert.equal(
      IntegrationOrchestrationRegistryIdentity.foundationEntryPoint,
      "integrationOrchestrationFoundation.ts",
    );
    assert.equal(dependency.foundationInternalImport, false);
    assert.equal(dependency.previousEilPlatformDependency, false);
    assert.equal(dependency.laterEil4PhaseImport, false);
    assert.equal(dependency.reconstructsFoundation, false);
    assert.equal(dependency.duplicatesFoundationInventory, false);
    assert.equal(
      IntegrationOrchestrationRegistryPlatform.foundationPlatform,
      IntegrationOrchestrationFoundationPlatform,
    );
  });

  it("registers Foundation categories, contracts, capabilities, and responsibilities", () => {
    assert.equal(IntegrationOrchestrationCategoryRegistry.length, 10);
    assert.deepEqual(
      IntegrationOrchestrationCategoryRegistry.map((item) => item.canonicalKey),
      [...EXPECTED_CATEGORIES],
    );
    assert.deepEqual(
      IntegrationOrchestrationCategoryRegistry.map((item) => item.name),
      [...EXPECTED_CATEGORY_NAMES],
    );
    assertAscending(
      IntegrationOrchestrationCategoryRegistry.map((item) => item.ordinal),
      "category",
    );
    assertUnique(
      IntegrationOrchestrationCategoryRegistry.map((item) => item.registryId),
      "category registry IDs",
    );
    assertUnique(
      IntegrationOrchestrationCategoryRegistry.map((item) => item.canonicalKey),
      "category keys",
    );

    assert.equal(IntegrationOrchestrationContractRegistry.length, 10);
    assert.deepEqual(
      IntegrationOrchestrationContractRegistry.map((item) => item.canonicalKey),
      [...EXPECTED_CONTRACTS],
    );
    assertAscending(
      IntegrationOrchestrationContractRegistry.map((item) => item.ordinal),
      "contract",
    );
    assertUnique(
      IntegrationOrchestrationContractRegistry.map((item) => item.registryId),
      "contract registry IDs",
    );

    assert.equal(IntegrationOrchestrationCapabilityRegistry.length, 10);
    assert.deepEqual(
      IntegrationOrchestrationCapabilityRegistry.map(
        (item) => item.canonicalKey,
      ),
      [...EXPECTED_CAPABILITIES],
    );
    assertAscending(
      IntegrationOrchestrationCapabilityRegistry.map((item) => item.ordinal),
      "capability",
    );
    assertUnique(
      IntegrationOrchestrationCapabilityRegistry.map((item) => item.registryId),
      "capability registry IDs",
    );

    assert.equal(IntegrationOrchestrationResponsibilityRegistry.length, 8);
    assert.deepEqual(
      IntegrationOrchestrationResponsibilityRegistry.map(
        (item) => item.canonicalKey,
      ),
      [...EXPECTED_RESPONSIBILITIES],
    );
    assertAscending(
      IntegrationOrchestrationResponsibilityRegistry.map(
        (item) => item.ordinal,
      ),
      "responsibility",
    );
    assertUnique(
      IntegrationOrchestrationResponsibilityRegistry.map(
        (item) => item.registryId,
      ),
      "responsibility registry IDs",
    );
  });

  it("preserves Foundation lifecycle references without reconstruction", () => {
    const { lifecycleCoverage, foundationPlatform } =
      IntegrationOrchestrationRegistryPlatform;
    assert.equal(lifecycleCoverage.length, 8);
    assert.deepEqual(
      [...foundationPlatform.lifecycle.states],
      [...EXPECTED_LIFECYCLE],
    );
    assert.equal(
      IntegrationOrchestrationRegistryCollections.lifecycleStateCount,
      foundationPlatform.inventory.lifecycleStateCount,
    );
    assert.equal(
      IntegrationOrchestrationRegistryCollections.lifecycleStateCount,
      8,
    );
    assert.ok(
      lifecycleCoverage.every(
        (item) =>
          item.registered === true &&
          item.sourcePhase ===
            "EIL-4:1/IntegrationOrchestrationFoundation" &&
          Object.isFrozen(item),
      ),
    );
  });

  it("derives inventory dynamically with total registry entry count of 38", () => {
    const { collections, inventory } = IntegrationOrchestrationRegistryPlatform;
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
    assert.equal(collections.totalRegistryEntryCount, 38);
    assert.equal(inventory.totalRegistryEntryCount, 38);
    assert.equal(inventory.countsDerivedFromCollections, true);
    assert.equal(
      IntegrationOrchestrationRegistrySummary.totalRegistryEntryCount,
      38,
    );
    assert.equal(
      IntegrationOrchestrationRegistryCollections.totalRegistryEntryCount,
      38,
    );
  });

  it("freezes all registry collections, tags, and source references", () => {
    assert.equal(Object.isFrozen(IntegrationOrchestrationCategoryRegistry), true);
    assert.equal(Object.isFrozen(IntegrationOrchestrationContractRegistry), true);
    assert.equal(
      Object.isFrozen(IntegrationOrchestrationCapabilityRegistry),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationOrchestrationResponsibilityRegistry),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationOrchestrationRegistryCollections),
      true,
    );
    assert.equal(Object.isFrozen(IntegrationOrchestrationRegistrySummary), true);
    assert.equal(Object.isFrozen(IntegrationOrchestrationRegistryPlatform), true);

    for (const entry of IntegrationOrchestrationCategoryRegistry) {
      assert.equal(Object.isFrozen(entry), true);
      assert.equal(Object.isFrozen(entry.tags), true);
      assert.equal(typeof entry.sourceReference, "string");
      assert.equal(entry.executesRuntime, false);
      assert.equal(entry.metadataOnly, true);
    }
    for (const entry of IntegrationOrchestrationContractRegistry) {
      assert.equal(Object.isFrozen(entry), true);
      assert.equal(Object.isFrozen(entry.tags), true);
    }
    for (const entry of IntegrationOrchestrationCapabilityRegistry) {
      assert.equal(Object.isFrozen(entry), true);
      assert.equal(Object.isFrozen(entry.tags), true);
    }
    for (const entry of IntegrationOrchestrationResponsibilityRegistry) {
      assert.equal(Object.isFrozen(entry), true);
      assert.equal(Object.isFrozen(entry.tags), true);
    }
  });

  it("is metadata-only with zero executable registry behavior", () => {
    const platform = IntegrationOrchestrationRegistryPlatform;
    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.runtimeEnforcement, false);
    assert.equal(platform.orchestrationEngine, false);
    assert.equal(platform.workflowExecution, false);
    assert.equal(platform.routingExecution, false);
    assert.equal(platform.schedulingBehavior, false);
    assert.equal(platform.triggerProcessing, false);
    assert.equal(platform.networkingBehavior, false);
    assert.equal(platform.restBehavior, false);
    assert.equal(platform.graphqlBehavior, false);
    assert.equal(platform.websocketBehavior, false);
    assert.equal(platform.queueBehavior, false);
    assert.equal(platform.connectorExecution, false);
    assert.equal(platform.adapterBehavior, false);
    assert.equal(platform.sdkRuntime, false);
    assert.equal(platform.persistenceBehavior, false);
    assert.equal(platform.aiBehavior, false);
    assert.equal(platform.uiBehavior, false);
    assert.equal(platform.stateMutation, false);
    assert.equal(platform.previousEilPlatformDependency, false);
    assert.equal(platform.importsLaterEil4Phases, false);

    assertNoExecutableValues(
      IntegrationOrchestrationCategoryRegistry,
      "categories",
    );
    assertNoExecutableValues(
      IntegrationOrchestrationContractRegistry,
      "contracts",
    );
    assertNoExecutableValues(
      IntegrationOrchestrationCapabilityRegistry,
      "capabilities",
    );
    assertNoExecutableValues(
      IntegrationOrchestrationResponsibilityRegistry,
      "responsibilities",
    );
  });

  it("has zero prohibited imports across registry sources", () => {
    const sources = EIL42_FILES.filter((name) => !name.endsWith(".test.ts"));
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
    const sources = EIL42_FILES.filter((name) => !name.endsWith(".test.ts")).map(
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
        "app/lib/eil/integrationOrchestrationFoundation.ts",
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
