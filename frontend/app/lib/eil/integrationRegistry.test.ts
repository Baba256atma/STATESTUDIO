/**
 * EIL-1:2 — Integration Registry Tests.
 *
 * Deterministic coverage for the immutable Integration Registry.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  IntegrationFoundationId,
  IntegrationFoundationPlatform,
} from "./integrationFoundation.ts";
import * as RegistryModule from "./integrationRegistry.ts";
import {
  IntegrationCapabilityRegistry,
  IntegrationContractRegistry,
  IntegrationRegistryCollections,
  IntegrationRegistryIdentity,
  IntegrationRegistryPlatform,
  IntegrationRegistrySummary,
  IntegrationResponsibilityRegistry,
  IntegrationTypeRegistry,
} from "./integrationRegistry.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const EIL12_FILES = Object.freeze([
  "integrationRegistryTypes.ts",
  "integrationRegistryIdentity.ts",
  "integrationTypeRegistry.ts",
  "integrationContractRegistry.ts",
  "integrationCapabilityRegistry.ts",
  "integrationResponsibilityRegistry.ts",
  "integrationRegistry.ts",
  "integrationRegistry.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationRegistryIdentity",
  "IntegrationTypeRegistry",
  "IntegrationContractRegistry",
  "IntegrationCapabilityRegistry",
  "IntegrationResponsibilityRegistry",
  "IntegrationRegistryCollections",
  "IntegrationRegistrySummary",
  "IntegrationRegistryPlatform",
] as const);

const EXPECTED_CONTRACTS = Object.freeze([
  "IntegrationContract",
  "PlatformContract",
  "ConsumerContract",
  "ProducerContract",
  "EventContract",
  "RequestContract",
  "ResponseContract",
  "CoordinationContract",
  "RoutingContract",
  "CompatibilityContract",
] as const);

const EXPECTED_CAPABILITIES = Object.freeze([
  "PlatformIntegration",
  "RoutingCoordination",
  "DependencyAwareness",
  "Interoperability",
  "CompatibilityValidation",
  "ServiceDiscovery",
  "ContractPreservation",
  "OrchestrationSupport",
  "IntegrationLifecycleAwareness",
  "ExecutiveCoordination",
] as const);

const EXPECTED_RESPONSIBILITIES = Object.freeze([
  "PreservePlatformBoundaries",
  "CoordinateIntegrations",
  "ExposeCanonicalMetadata",
  "MaintainInteroperability",
  "PreventIllegalCoupling",
  "PreserveDependencyDirection",
  "MaintainArchitecturalConsistency",
  "SupportFutureRuntimeLayers",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\/integrationFoundation(?!\.ts["'])/,
  /from ["']\.\/integrationFoundation(Types|Contracts|Capabilities|Responsibilities|Lifecycle|Identity)\.ts["']/,
  /from ["']\.\.\/(bus|ops|engine|dkl|nea|eve|director|advisor|core)\//,
  /from ["']react["']/,
  /from ["']next\//,
]);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

const assertNoFunctions = (
  value: unknown,
  path: string,
): void => {
  assert.notEqual(typeof value, "function", `${path} must not be a function`);
  if (value !== null && typeof value === "object") {
    for (const [key, nested] of Object.entries(value)) {
      assertNoFunctions(nested, `${path}.${key}`);
    }
  }
};

describe("EIL-1:2 Integration Registry", () => {
  it("creates exactly eight Registry files and eight public exports", () => {
    assert.equal(EIL12_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL12_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(RegistryModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(RegistryModule).length, 8);
  });

  it("has canonical identity, namespace, version, Registry status, and ReadyForModel", () => {
    assert.equal(IntegrationRegistryIdentity.phaseId, "EIL-1:2");
    assert.equal(
      IntegrationRegistryIdentity.canonicalId,
      "EIL-1:2/IntegrationRegistry",
    );
    assert.equal(IntegrationRegistryIdentity.name, "Integration Registry");
    assert.equal(IntegrationRegistryIdentity.version, "1.0.0");
    assert.equal(
      IntegrationRegistryIdentity.namespace,
      "nexora.eil.integration.registry",
    );
    assert.equal(IntegrationRegistryIdentity.layer, "EIL");
    assert.equal(IntegrationRegistryIdentity.platform, "EIL-1");
    assert.equal(IntegrationRegistryIdentity.phaseType, "Registry");
    assert.equal(IntegrationRegistryIdentity.status, "Registry");
    assert.equal(IntegrationRegistryIdentity.readiness, "ReadyForModel");
    assert.equal(IntegrationRegistryPlatform.status, "Registry");
    assert.equal(IntegrationRegistryPlatform.readiness, "ReadyForModel");
    assert.equal(
      IntegrationRegistryPlatform.nextPhase,
      "EIL-1:3 — Integration Model",
    );
  });

  it("declares Foundation as the sole phase dependency via aggregate entry point", () => {
    const { dependency } = IntegrationRegistryPlatform;
    assert.equal(dependency.phaseDependencyCount, 1);
    assert.equal(dependency.foundationOnly, true);
    assert.equal(dependency.foundationId, IntegrationFoundationId);
    assert.equal(
      dependency.foundationId,
      "EIL-1:1/IntegrationFoundation",
    );
    assert.equal(dependency.directPreviousPhaseModule, "integrationFoundation.ts");
    assert.equal(
      IntegrationRegistryIdentity.foundationDependency,
      "EIL-1:1/IntegrationFoundation",
    );
    assert.equal(
      IntegrationRegistryIdentity.foundationEntryPoint,
      "integrationFoundation.ts",
    );
    assert.equal(dependency.laterEilPhaseImport, false);
    assert.equal(dependency.foundationPublicSurfaceOnly, true);
  });

  it("freezes all exported collections and registry entries", () => {
    assert.equal(Object.isFrozen(IntegrationRegistryIdentity), true);
    assert.equal(Object.isFrozen(IntegrationTypeRegistry), true);
    assert.equal(Object.isFrozen(IntegrationContractRegistry), true);
    assert.equal(Object.isFrozen(IntegrationCapabilityRegistry), true);
    assert.equal(Object.isFrozen(IntegrationResponsibilityRegistry), true);
    assert.equal(Object.isFrozen(IntegrationRegistryCollections), true);
    assert.equal(Object.isFrozen(IntegrationRegistrySummary), true);
    assert.equal(Object.isFrozen(IntegrationRegistryPlatform), true);

    for (const entry of [
      ...IntegrationTypeRegistry,
      ...IntegrationContractRegistry,
      ...IntegrationCapabilityRegistry,
      ...IntegrationResponsibilityRegistry,
    ]) {
      assert.equal(Object.isFrozen(entry), true);
      assert.equal(Object.isFrozen(entry.tags), true);
      assert.equal(Object.isFrozen(entry.aliases), true);
    }
  });

  it("enforces unique IDs, keys, and ordinals with deterministic ordering", () => {
    const collections = [
      ["types", IntegrationTypeRegistry],
      ["contracts", IntegrationContractRegistry],
      ["capabilities", IntegrationCapabilityRegistry],
      ["responsibilities", IntegrationResponsibilityRegistry],
    ] as const;

    for (const [label, collection] of collections) {
      assertUnique(
        collection.map((entry) => entry.id),
        `${label} IDs`,
      );
      assertUnique(
        collection.map((entry) => entry.key),
        `${label} keys`,
      );
      assertUnique(
        collection.map((entry) => String(entry.ordinal)),
        `${label} ordinals`,
      );
      const ordinals = collection.map((entry) => entry.ordinal);
      assert.deepEqual(
        ordinals,
        [...ordinals].sort((a, b) => a - b),
        `${label} ordinals must be ascending`,
      );
    }
  });

  it("registers all Foundation contracts, capabilities, and responsibilities", () => {
    assert.equal(IntegrationContractRegistry.length, 10);
    assert.deepEqual(
      IntegrationContractRegistry.map((entry) => entry.contractKey),
      [...EXPECTED_CONTRACTS],
    );
    assert.deepEqual(
      IntegrationContractRegistry.map((entry) => entry.key),
      IntegrationFoundationPlatform.contracts.map((item) => item.contractName),
    );

    assert.equal(IntegrationCapabilityRegistry.length, 10);
    assert.deepEqual(
      IntegrationCapabilityRegistry.map((entry) => entry.capabilityKey),
      [...EXPECTED_CAPABILITIES],
    );

    assert.equal(IntegrationResponsibilityRegistry.length, 8);
    assert.deepEqual(
      IntegrationResponsibilityRegistry.map((entry) => entry.responsibilityKey),
      [...EXPECTED_RESPONSIBILITIES],
    );
  });

  it("represents all Foundation lifecycle states in the type registry", () => {
    const lifecycleEntries = IntegrationTypeRegistry.filter(
      (entry) => entry.category === "Lifecycle",
    );
    assert.equal(
      lifecycleEntries.length,
      IntegrationFoundationPlatform.lifecycle.states.length,
    );
    assert.deepEqual(
      lifecycleEntries.map((entry) => entry.canonicalName),
      [...IntegrationFoundationPlatform.lifecycle.states],
    );
    assert.equal(
      IntegrationRegistryPlatform.lifecycleCoverage.length,
      IntegrationFoundationPlatform.lifecycle.stateCount,
    );
    assert.ok(
      IntegrationRegistryPlatform.lifecycleCoverage.every(
        (item) => item.registered === true,
      ),
    );
  });

  it("derives aggregate counts dynamically from canonical collections", () => {
    assert.equal(
      IntegrationRegistryCollections.typeCount,
      IntegrationTypeRegistry.length,
    );
    assert.equal(
      IntegrationRegistryCollections.contractCount,
      IntegrationContractRegistry.length,
    );
    assert.equal(
      IntegrationRegistryCollections.capabilityCount,
      IntegrationCapabilityRegistry.length,
    );
    assert.equal(
      IntegrationRegistryCollections.responsibilityCount,
      IntegrationResponsibilityRegistry.length,
    );
    assert.equal(
      IntegrationRegistryCollections.totalRegistryEntryCount,
      IntegrationTypeRegistry.length +
        IntegrationContractRegistry.length +
        IntegrationCapabilityRegistry.length +
        IntegrationResponsibilityRegistry.length,
    );
    assert.equal(
      IntegrationRegistrySummary.typeCount,
      IntegrationRegistryCollections.typeCount,
    );
    assert.equal(
      IntegrationRegistrySummary.contractCount,
      IntegrationRegistryCollections.contractCount,
    );
    assert.equal(
      IntegrationRegistrySummary.capabilityCount,
      IntegrationRegistryCollections.capabilityCount,
    );
    assert.equal(
      IntegrationRegistrySummary.responsibilityCount,
      IntegrationRegistryCollections.responsibilityCount,
    );
    assert.equal(
      IntegrationRegistrySummary.totalRegistryEntryCount,
      IntegrationRegistryCollections.totalRegistryEntryCount,
    );
    assert.equal(
      IntegrationRegistryPlatform.counts.totalRegistryEntryCount,
      IntegrationRegistryCollections.totalRegistryEntryCount,
    );
  });

  it("contains no executable functions or runtime behavior in registry entries", () => {
    assertNoFunctions(IntegrationRegistryIdentity, "identity");
    assertNoFunctions(IntegrationTypeRegistry, "types");
    assertNoFunctions(IntegrationContractRegistry, "contracts");
    assertNoFunctions(IntegrationCapabilityRegistry, "capabilities");
    assertNoFunctions(IntegrationResponsibilityRegistry, "responsibilities");
    assertNoFunctions(IntegrationRegistryCollections, "collections");
    assertNoFunctions(IntegrationRegistrySummary, "summary");

    const platform = IntegrationRegistryPlatform;
    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.runtimeIntegration, false);
    assert.equal(platform.serviceDiscoveryExecution, false);
    assert.equal(platform.routingEngine, false);
    assert.equal(platform.orchestrationEngine, false);
    assert.equal(platform.eventBus, false);
    assert.equal(platform.networkingBehavior, false);
    assert.equal(platform.persistenceBehavior, false);
    assert.equal(platform.connectorBehavior, false);
    assert.equal(platform.adapterBehavior, false);
    assert.equal(platform.serviceBehavior, false);
    assert.equal(platform.factoryBehavior, false);
    assert.equal(platform.dependencyInjection, false);
    assert.equal(platform.aiBehavior, false);
    assert.equal(platform.llmBehavior, false);
    assert.equal(platform.uiBehavior, false);
    assert.equal(platform.stateMutation, false);
    assert.equal(platform.importsLaterEilPhases, false);
    assert.equal(platform.validation.executableEntries, false);
    assert.equal(platform.validation.runtimeBehavior, false);
  });

  it("has zero prohibited imports and no later EIL phase dependencies", () => {
    const sources = EIL12_FILES.filter((name) => !name.endsWith(".test.ts"));
    for (const file of sources) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      for (const pattern of PROHIBITED_IMPORT_PATTERNS) {
        assert.doesNotMatch(
          source,
          pattern,
          `${file} must not match ${pattern}`,
        );
      }
      assert.doesNotMatch(
        source,
        /from ["'][^"']*integrationModel[^"']*["']/,
      );
      assert.doesNotMatch(
        source,
        /from ["'][^"']*EIL-1:[3-9][^"']*["']/,
      );
      assert.doesNotMatch(source, /from ["']node:(net|http|https|dgram)["']/);
      assert.doesNotMatch(source, /\b(fetch|axios)\b/);
      assert.doesNotMatch(source, /\bclass\b/);
      assert.doesNotMatch(source, /\basync\s+function\b/);
    }

    const aggregate = readFileSync(
      new URL("integrationRegistry.ts", import.meta.url),
      "utf8",
    );
    assert.match(aggregate, /from ["']\.\/integrationFoundation\.ts["']/);
    assert.equal(
      IntegrationRegistryPlatform.dependency.laterEilPhaseImport,
      false,
    );
  });

  it("is ready for the Model phase with stable summary", () => {
    assert.equal(IntegrationRegistrySummary.readiness, "ReadyForModel");
    assert.equal(IntegrationRegistrySummary.status, "Registry");
    assert.equal(
      IntegrationRegistrySummary.nextPhase,
      "EIL-1:3 — Integration Model",
    );
    assert.equal(
      IntegrationRegistrySummary.foundationId,
      "EIL-1:1/IntegrationFoundation",
    );
    assert.equal(Object.isFrozen(IntegrationRegistrySummary), true);
    assert.equal(IntegrationRegistrySummary.contractCount, 10);
    assert.equal(IntegrationRegistrySummary.capabilityCount, 10);
    assert.equal(IntegrationRegistrySummary.responsibilityCount, 8);
    assert.equal(IntegrationRegistrySummary.lifecycleStateCount, 8);
    assert.ok(IntegrationRegistrySummary.typeCount > 0);
    assert.ok(IntegrationRegistrySummary.totalRegistryEntryCount > 30);
  });
});
