/**
 * EIL-2:2 — Integration Connector Registry Tests.
 *
 * Deterministic coverage for the immutable Integration Connector Registry.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  IntegrationConnectorFoundationId,
  IntegrationConnectorFoundationPlatform,
} from "./integrationConnectorFoundation.ts";
import * as RegistryModule from "./integrationConnectorRegistry.ts";
import {
  IntegrationConnectorCapabilityRegistry,
  IntegrationConnectorCategoryRegistry,
  IntegrationConnectorContractRegistry,
  IntegrationConnectorRegistryCollections,
  IntegrationConnectorRegistryIdentity,
  IntegrationConnectorRegistryPlatform,
  IntegrationConnectorRegistrySummary,
  IntegrationConnectorResponsibilityRegistry,
} from "./integrationConnectorRegistry.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const EIL22_FILES = Object.freeze([
  "integrationConnectorRegistryTypes.ts",
  "integrationConnectorRegistryIdentity.ts",
  "integrationConnectorCategoryRegistry.ts",
  "integrationConnectorContractRegistry.ts",
  "integrationConnectorCapabilityRegistry.ts",
  "integrationConnectorResponsibilityRegistry.ts",
  "integrationConnectorRegistry.ts",
  "integrationConnectorRegistry.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationConnectorRegistryIdentity",
  "IntegrationConnectorCategoryRegistry",
  "IntegrationConnectorContractRegistry",
  "IntegrationConnectorCapabilityRegistry",
  "IntegrationConnectorResponsibilityRegistry",
  "IntegrationConnectorRegistryCollections",
  "IntegrationConnectorRegistrySummary",
  "IntegrationConnectorRegistryPlatform",
] as const);

const EXPECTED_CATEGORIES = Object.freeze([
  "InternalPlatformConnector",
  "ExternalPlatformConnector",
  "ApiConnector",
  "EventConnector",
  "MessageConnector",
  "FileConnector",
  "DatabaseConnector",
  "ServiceConnector",
  "IntegrationGatewayConnector",
  "CustomConnector",
] as const);

const EXPECTED_CONTRACTS = Object.freeze([
  "ConnectorContract",
  "EndpointContract",
  "ProtocolContract",
  "AuthenticationContract",
  "AuthorizationContract",
  "PayloadContract",
  "MappingContract",
  "CompatibilityContract",
  "ConfigurationContract",
  "LifecycleContract",
] as const);

const EXPECTED_CAPABILITIES = Object.freeze([
  "ConnectorRegistration",
  "ConnectorDiscoveryMetadata",
  "EndpointDescription",
  "ProtocolDeclaration",
  "CompatibilityDeclaration",
  "LifecycleAwareness",
  "DependencyAwareness",
  "ConfigurationMetadata",
  "ConnectorClassification",
  "IntegrationReadiness",
] as const);

const EXPECTED_RESPONSIBILITIES = Object.freeze([
  "PreserveConnectorIdentity",
  "PreservePlatformBoundaries",
  "ExposeConnectorMetadata",
  "MaintainCompatibility",
  "MaintainDeterministicInventories",
  "PreserveDependencyDirection",
  "SupportFutureRuntimePlatforms",
  "MaintainArchitecturalConsistency",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\/integrationConnectorFoundation(?!\.ts["'])/,
  /from ["']\.\/integrationConnectorFoundation(Types|Contracts|Capabilities|Responsibilities|Lifecycle|Identity)\.ts["']/,
  /from ["']\.\/integration(?!Connector)/,
  /from ["']\.\/integrationPublicIndex/,
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

describe("EIL-2:2 Integration Connector Registry", () => {
  it("creates exactly eight Registry files and eight public exports", () => {
    assert.equal(EIL22_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL22_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(RegistryModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(RegistryModule).length, 8);
  });

  it("has canonical identity, namespace, version, Registry status, and ReadyForModel", () => {
    assert.equal(IntegrationConnectorRegistryIdentity.phaseId, "EIL-2:2");
    assert.equal(
      IntegrationConnectorRegistryIdentity.canonicalId,
      "EIL-2:2/IntegrationConnectorRegistry",
    );
    assert.equal(
      IntegrationConnectorRegistryIdentity.name,
      "Integration Connector Registry",
    );
    assert.equal(IntegrationConnectorRegistryIdentity.version, "1.0.0");
    assert.equal(
      IntegrationConnectorRegistryIdentity.namespace,
      "nexora.eil.integration-connector.registry",
    );
    assert.equal(IntegrationConnectorRegistryIdentity.layer, "EIL");
    assert.equal(IntegrationConnectorRegistryIdentity.platform, "EIL-2");
    assert.equal(IntegrationConnectorRegistryIdentity.phaseType, "Registry");
    assert.equal(IntegrationConnectorRegistryIdentity.status, "Registry");
    assert.equal(
      IntegrationConnectorRegistryIdentity.readiness,
      "ReadyForModel",
    );
    assert.equal(IntegrationConnectorRegistryPlatform.status, "Registry");
    assert.equal(
      IntegrationConnectorRegistryPlatform.readiness,
      "ReadyForModel",
    );
    assert.equal(
      IntegrationConnectorRegistryPlatform.nextPhase,
      "EIL-2:3 — Integration Connector Model",
    );
  });

  it("declares Foundation as the sole phase dependency via aggregate entry point", () => {
    const { dependency } = IntegrationConnectorRegistryPlatform;
    assert.equal(dependency.phaseDependencyCount, 1);
    assert.equal(dependency.foundationOnly, true);
    assert.equal(dependency.foundationId, IntegrationConnectorFoundationId);
    assert.equal(
      dependency.foundationId,
      "EIL-2:1/IntegrationConnectorFoundation",
    );
    assert.equal(
      dependency.directPreviousPhaseModule,
      "integrationConnectorFoundation.ts",
    );
    assert.equal(
      IntegrationConnectorRegistryIdentity.foundationDependency,
      "EIL-2:1/IntegrationConnectorFoundation",
    );
    assert.equal(
      IntegrationConnectorRegistryIdentity.foundationEntryPoint,
      "integrationConnectorFoundation.ts",
    );
    assert.equal(dependency.foundationInternalImport, false);
    assert.equal(dependency.eil1Dependency, false);
    assert.equal(dependency.laterEil2PhaseImport, false);
    assert.equal(dependency.foundationPublicSurfaceOnly, true);
    assert.equal(
      IntegrationConnectorRegistryPlatform.foundationPlatform,
      IntegrationConnectorFoundationPlatform,
    );
  });

  it("freezes all exported collections and registry entries", () => {
    assert.equal(Object.isFrozen(IntegrationConnectorRegistryIdentity), true);
    assert.equal(Object.isFrozen(IntegrationConnectorCategoryRegistry), true);
    assert.equal(Object.isFrozen(IntegrationConnectorContractRegistry), true);
    assert.equal(
      Object.isFrozen(IntegrationConnectorCapabilityRegistry),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationConnectorResponsibilityRegistry),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationConnectorRegistryCollections),
      true,
    );
    assert.equal(Object.isFrozen(IntegrationConnectorRegistrySummary), true);
    assert.equal(Object.isFrozen(IntegrationConnectorRegistryPlatform), true);

    for (const entry of [
      ...IntegrationConnectorCategoryRegistry,
      ...IntegrationConnectorContractRegistry,
      ...IntegrationConnectorCapabilityRegistry,
      ...IntegrationConnectorResponsibilityRegistry,
    ]) {
      assert.equal(Object.isFrozen(entry), true);
      assert.equal(Object.isFrozen(entry.tags), true);
      assert.equal(entry.executesRuntime, false);
      assert.equal(entry.metadataOnly, true);
    }
  });

  it("registers exactly ten categories, ten contracts, ten capabilities, and eight responsibilities", () => {
    assert.equal(IntegrationConnectorCategoryRegistry.length, 10);
    assert.deepEqual(
      IntegrationConnectorCategoryRegistry.map((item) => item.categoryKey),
      [...EXPECTED_CATEGORIES],
    );

    assert.equal(IntegrationConnectorContractRegistry.length, 10);
    assert.deepEqual(
      IntegrationConnectorContractRegistry.map((item) => item.contractKey),
      [...EXPECTED_CONTRACTS],
    );

    assert.equal(IntegrationConnectorCapabilityRegistry.length, 10);
    assert.deepEqual(
      IntegrationConnectorCapabilityRegistry.map((item) => item.capabilityKey),
      [...EXPECTED_CAPABILITIES],
    );

    assert.equal(IntegrationConnectorResponsibilityRegistry.length, 8);
    assert.deepEqual(
      IntegrationConnectorResponsibilityRegistry.map(
        (item) => item.responsibilityKey,
      ),
      [...EXPECTED_RESPONSIBILITIES],
    );
  });

  it("enforces unique IDs, keys, and deterministic ordinals", () => {
    const collections = [
      ["categories", IntegrationConnectorCategoryRegistry],
      ["contracts", IntegrationConnectorContractRegistry],
      ["capabilities", IntegrationConnectorCapabilityRegistry],
      ["responsibilities", IntegrationConnectorResponsibilityRegistry],
    ] as const;

    for (const [label, entries] of collections) {
      assertUnique(
        entries.map((item) => item.id),
        `${label} IDs`,
      );
      assertUnique(
        entries.map((item) => item.key),
        `${label} keys`,
      );
      assertAscending(
        entries.map((item) => item.ordinal),
        label,
      );
    }
  });

  it("derives inventory counts dynamically from canonical collections", () => {
    assert.equal(
      IntegrationConnectorRegistryCollections.categoryCount,
      IntegrationConnectorCategoryRegistry.length,
    );
    assert.equal(
      IntegrationConnectorRegistryCollections.contractCount,
      IntegrationConnectorContractRegistry.length,
    );
    assert.equal(
      IntegrationConnectorRegistryCollections.capabilityCount,
      IntegrationConnectorCapabilityRegistry.length,
    );
    assert.equal(
      IntegrationConnectorRegistryCollections.responsibilityCount,
      IntegrationConnectorResponsibilityRegistry.length,
    );
    assert.equal(
      IntegrationConnectorRegistryCollections.lifecycleStateCount,
      IntegrationConnectorFoundationPlatform.lifecycle.stateCount,
    );
    assert.equal(
      IntegrationConnectorRegistryCollections.totalRegistryEntryCount,
      IntegrationConnectorCategoryRegistry.length +
        IntegrationConnectorContractRegistry.length +
        IntegrationConnectorCapabilityRegistry.length +
        IntegrationConnectorResponsibilityRegistry.length,
    );
    assert.equal(
      IntegrationConnectorRegistrySummary.categoryCount,
      IntegrationConnectorRegistryCollections.categoryCount,
    );
    assert.equal(
      IntegrationConnectorRegistrySummary.totalRegistryEntryCount,
      38,
    );
    assert.equal(
      IntegrationConnectorRegistryPlatform.inventory.countsDerivedFromCollections,
      true,
    );
  });

  it("is metadata-only with zero runtime connector behavior", () => {
    const platform = IntegrationConnectorRegistryPlatform;
    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.runtimeEnforcement, false);
    assert.equal(platform.connectorRuntime, false);
    assert.equal(platform.protocolExecution, false);
    assert.equal(platform.restBehavior, false);
    assert.equal(platform.graphqlBehavior, false);
    assert.equal(platform.websocketBehavior, false);
    assert.equal(platform.httpClientBehavior, false);
    assert.equal(platform.messageBrokerBehavior, false);
    assert.equal(platform.eventBus, false);
    assert.equal(platform.serviceDiscoveryRuntime, false);
    assert.equal(platform.authenticationLogic, false);
    assert.equal(platform.authorizationLogic, false);
    assert.equal(platform.encryptionBehavior, false);
    assert.equal(platform.adapterBehavior, false);
    assert.equal(platform.dependencyInjection, false);
    assert.equal(platform.persistenceBehavior, false);
    assert.equal(platform.storageBehavior, false);
    assert.equal(platform.cacheBehavior, false);
    assert.equal(platform.filesystemBehavior, false);
    assert.equal(platform.networkingBehavior, false);
    assert.equal(platform.aiBehavior, false);
    assert.equal(platform.llmBehavior, false);
    assert.equal(platform.uiBehavior, false);
    assert.equal(platform.reactBehavior, false);
    assert.equal(platform.stateMutation, false);
    assert.equal(platform.eil1Dependency, false);
    assert.equal(platform.importsLaterEil2Phases, false);
  });

  it("has zero prohibited imports and no later EIL-2 or EIL-1 dependencies", () => {
    const sources = EIL22_FILES.filter((name) => !name.endsWith(".test.ts"));
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
        /from ["'][^"']*integrationConnectorModel[^"']*["']/,
      );
      assert.doesNotMatch(source, /from ["']node:(net|http|https|dgram)["']/);
      assert.doesNotMatch(source, /\b(fetch|axios)\b/);
      assert.doesNotMatch(source, /\bclass\b/);
      assert.doesNotMatch(source, /\basync\s+function\b/);
    }

    const aggregate = readFileSync(
      new URL("integrationConnectorRegistry.ts", import.meta.url),
      "utf8",
    );
    assert.match(
      aggregate,
      /from ["']\.\/integrationConnectorFoundation\.ts["']/,
    );
    assert.equal(
      IntegrationConnectorRegistryPlatform.dependency.laterEil2PhaseImport,
      false,
    );
  });

  it("is ready for Model with stable summary", () => {
    assert.equal(
      IntegrationConnectorRegistrySummary.readiness,
      "ReadyForModel",
    );
    assert.equal(IntegrationConnectorRegistrySummary.status, "Registry");
    assert.equal(
      IntegrationConnectorRegistrySummary.nextPhase,
      "EIL-2:3 — Integration Connector Model",
    );
    assert.equal(
      IntegrationConnectorRegistrySummary.foundationId,
      "EIL-2:1/IntegrationConnectorFoundation",
    );
    assert.equal(Object.isFrozen(IntegrationConnectorRegistrySummary), true);
    assert.equal(IntegrationConnectorRegistrySummary.categoryCount, 10);
    assert.equal(IntegrationConnectorRegistrySummary.contractCount, 10);
    assert.equal(IntegrationConnectorRegistrySummary.capabilityCount, 10);
    assert.equal(IntegrationConnectorRegistrySummary.responsibilityCount, 8);
    assert.equal(IntegrationConnectorRegistrySummary.lifecycleStateCount, 8);
    assert.equal(
      IntegrationConnectorRegistrySummary.totalRegistryEntryCount,
      38,
    );
  });
});
