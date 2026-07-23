/**
 * EIL-2:1 — Integration Connector Foundation Tests.
 *
 * Deterministic coverage for the immutable Integration Connector Foundation.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import * as FoundationModule from "./integrationConnectorFoundation.ts";
import {
  getIntegrationConnectorFoundationSummary,
  IntegrationConnectorFoundationId,
  IntegrationConnectorFoundationName,
  IntegrationConnectorFoundationNamespace,
  IntegrationConnectorFoundationPlatform,
  IntegrationConnectorFoundationReadiness,
  IntegrationConnectorFoundationStatus,
  IntegrationConnectorFoundationVersion,
} from "./integrationConnectorFoundation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const EIL21_FILES = Object.freeze([
  "integrationConnectorFoundationTypes.ts",
  "integrationConnectorFoundationIdentity.ts",
  "integrationConnectorFoundationContracts.ts",
  "integrationConnectorFoundationCapabilities.ts",
  "integrationConnectorFoundationResponsibilities.ts",
  "integrationConnectorFoundationLifecycle.ts",
  "integrationConnectorFoundation.ts",
  "integrationConnectorFoundation.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationConnectorFoundationId",
  "IntegrationConnectorFoundationVersion",
  "IntegrationConnectorFoundationName",
  "IntegrationConnectorFoundationNamespace",
  "IntegrationConnectorFoundationStatus",
  "IntegrationConnectorFoundationReadiness",
  "IntegrationConnectorFoundationPlatform",
  "getIntegrationConnectorFoundationSummary",
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
  /from ["']\.\/integration(?!ConnectorFoundation)/,
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

describe("EIL-2:1 Integration Connector Foundation", () => {
  it("creates exactly eight Foundation files and eight public exports", () => {
    assert.equal(EIL21_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL21_FILES) {
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
      IntegrationConnectorFoundationId,
      "EIL-2:1/IntegrationConnectorFoundation",
    );
    assert.equal(IntegrationConnectorFoundationVersion, "1.0.0");
    assert.equal(
      IntegrationConnectorFoundationName,
      "Integration Connector Foundation",
    );
    assert.equal(
      IntegrationConnectorFoundationNamespace,
      "nexora.eil.integration-connector.foundation",
    );
    assert.equal(IntegrationConnectorFoundationStatus, "Foundation");
    assert.equal(
      IntegrationConnectorFoundationReadiness,
      "ReadyForRegistry",
    );
    assert.equal(
      IntegrationConnectorFoundationPlatform.identity.foundationNamespace,
      "nexora.eil.integration-connector.foundation",
    );
    assert.equal(
      IntegrationConnectorFoundationPlatform.identity.platform,
      "EIL-2",
    );
    assert.equal(
      IntegrationConnectorFoundationPlatform.identity.status,
      "Foundation",
    );
    assert.equal(
      IntegrationConnectorFoundationPlatform.readiness,
      "ReadyForRegistry",
    );
    assert.equal(
      IntegrationConnectorFoundationPlatform.nextPhase,
      "EIL-2:2 — Integration Connector Registry",
    );
  });

  it("publishes immutable exports and frozen aggregates", () => {
    const platform = IntegrationConnectorFoundationPlatform;
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

  it("publishes complete connector categories in deterministic order", () => {
    const { categories } = IntegrationConnectorFoundationPlatform;
    assert.equal(categories.length, 10);
    assert.deepEqual(
      categories.map((item) => item.categoryKey),
      [...EXPECTED_CATEGORIES],
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
  });

  it("publishes complete contracts in deterministic order", () => {
    const { contracts, contractNames } = IntegrationConnectorFoundationPlatform;
    assert.equal(contracts.length, 10);
    assert.deepEqual([...contractNames], [...EXPECTED_CONTRACTS]);
    assert.deepEqual(
      contracts.map((item) => item.contractId),
      EXPECTED_CONTRACTS.map((name) => `EIL-2:1/Contract/${name}`),
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
  });

  it("publishes complete unique lifecycle states", () => {
    const { lifecycle } = IntegrationConnectorFoundationPlatform;
    assert.deepEqual([...lifecycle.states], [...EXPECTED_LIFECYCLE]);
    assert.equal(lifecycle.stateCount, 8);
    assert.equal(lifecycle.currentState, "Verified");
    assert.equal(lifecycle.foundationReadiness, "ReadyForRegistry");
    assert.equal(lifecycle.executesTransitions, false);
    assert.equal(lifecycle.runtimeStateMachine, false);
    assertUnique([...lifecycle.states], "lifecycle states");
  });

  it("publishes unique capabilities and responsibilities", () => {
    const {
      capabilityDeclarations,
      responsibilityDeclarations,
      capabilities,
      responsibilities,
    } = IntegrationConnectorFoundationPlatform;

    assert.equal(capabilityDeclarations.length, 10);
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
      IntegrationConnectorFoundationPlatform;

    assert.equal(inventory.categoryCount, 10);
    assert.equal(inventory.contractCount, 10);
    assert.equal(inventory.capabilityCount, 10);
    assert.equal(inventory.responsibilityCount, 8);
    assert.equal(inventory.lifecycleStateCount, 8);
    assert.equal(inventory.totalFoundationEntryCount, 46);
    assert.equal(inventory.countsDerivedFromCollections, true);

    assert.ok(ownership.owns.includes("Connector identity"));
    assert.ok(ownership.owns.includes("Connector categories"));
    assert.ok(ownership.owns.includes("Terminology"));
    assert.ok(ownership.doesNotOwn.includes("Connector runtime"));
    assert.ok(ownership.doesNotOwn.includes("AI"));
    assert.ok(ownership.doesNotOwn.includes("Networking"));
    assert.equal(ownership.ownsConnectorRuntime, false);
    assert.equal(ownership.modifiesEil1, false);

    assert.ok(boundaries.dependencyRules.includes("ApprovedNpaStandardsOnly"));
    assert.ok(boundaries.dependencyRules.includes("NoEil1Dependency"));
    assert.ok(boundaries.prohibitedSurfaces.includes("REST"));
    assert.equal(boundaries.runtimeEnforcement, false);
    assert.equal(boundaries.layerSeparation.eil1RemainsUnmodified, true);

    assert.equal(compatibility.runtimeValidation, false);
    assert.ok(compatibility.declarations.length >= 4);
    assert.equal(terminology.terms.length, 6);
  });

  it("is metadata-only with zero runtime connector behavior", () => {
    const platform = IntegrationConnectorFoundationPlatform;
    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.runtimeEnforcement, false);
    assert.equal(platform.connectorRuntime, false);
    assert.equal(platform.networkingBehavior, false);
    assert.equal(platform.restBehavior, false);
    assert.equal(platform.graphqlBehavior, false);
    assert.equal(platform.websocketBehavior, false);
    assert.equal(platform.grpcBehavior, false);
    assert.equal(platform.httpClientBehavior, false);
    assert.equal(platform.sdkRuntime, false);
    assert.equal(platform.queueBehavior, false);
    assert.equal(platform.messageBrokerBehavior, false);
    assert.equal(platform.authenticationLogic, false);
    assert.equal(platform.authorizationLogic, false);
    assert.equal(platform.encryptionBehavior, false);
    assert.equal(platform.persistenceBehavior, false);
    assert.equal(platform.databaseBehavior, false);
    assert.equal(platform.cacheBehavior, false);
    assert.equal(platform.filesystemBehavior, false);
    assert.equal(platform.adapterBehavior, false);
    assert.equal(platform.serviceBehavior, false);
    assert.equal(platform.dependencyInjection, false);
    assert.equal(platform.aiBehavior, false);
    assert.equal(platform.llmBehavior, false);
    assert.equal(platform.uiBehavior, false);
    assert.equal(platform.reactBehavior, false);
    assert.equal(platform.businessLogicBehavior, false);
    assert.equal(platform.stateMutation, false);
    assert.equal(platform.modifiesEil1, false);
    assert.equal(platform.importsLaterEil2Phases, false);
    assert.equal(platform.dependency.eil1Dependency, false);
    assert.equal(platform.dependency.laterEil2PhaseImport, false);
    assert.equal(platform.dependency.upstreamDependencies.length, 0);
    assert.equal(platform.dependency.downstreamDependencies.length, 0);
  });

  it("has zero prohibited imports across foundation sources", () => {
    const sources = EIL21_FILES.filter((name) => !name.endsWith(".test.ts"));
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
    const platform = IntegrationConnectorFoundationPlatform;
    const keys = Object.keys(platform);
    assert.deepEqual(keys.slice(0, 12), [...PLATFORM_SECTIONS]);
    assert.equal(platform.sectionCount, 12);
    assert.deepEqual([...platform.sectionOrder], [...PLATFORM_SECTIONS]);

    const summaryA = getIntegrationConnectorFoundationSummary();
    const summaryB = getIntegrationConnectorFoundationSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.foundationId, IntegrationConnectorFoundationId);
    assert.equal(
      summaryA.namespace,
      "nexora.eil.integration-connector.foundation",
    );
    assert.equal(summaryA.version, "1.0.0");
    assert.equal(summaryA.status, "Foundation");
    assert.equal(summaryA.readiness, "ReadyForRegistry");
    assert.equal(summaryA.categoryCount, 10);
    assert.equal(summaryA.contractCount, 10);
    assert.equal(summaryA.capabilityCount, 10);
    assert.equal(summaryA.responsibilityCount, 8);
    assert.equal(summaryA.lifecycleStateCount, 8);
    assert.equal(summaryA.sectionCount, 12);
    assert.equal(summaryA.metadataOnly, true);
    assert.equal(
      summaryA.nextPhase,
      "EIL-2:2 — Integration Connector Registry",
    );
  });
});
