/**
 * EIL-2:3 — Integration Connector Model Tests.
 *
 * Deterministic coverage for the immutable Integration Connector Model.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  IntegrationConnectorRegistryIdentity,
  IntegrationConnectorRegistryPlatform,
} from "./integrationConnectorRegistry.ts";
import * as ModelModule from "./integrationConnectorModel.ts";
import {
  IntegrationConnectorDomainModels,
  IntegrationConnectorEndpointModels,
  IntegrationConnectorModelCollections,
  IntegrationConnectorModelIdentity,
  IntegrationConnectorModelPlatform,
  IntegrationConnectorModelSummary,
  IntegrationConnectorProtocolModels,
  IntegrationConnectorRelationshipModels,
} from "./integrationConnectorModel.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const EIL23_FILES = Object.freeze([
  "integrationConnectorModelTypes.ts",
  "integrationConnectorModelIdentity.ts",
  "integrationConnectorDomainModels.ts",
  "integrationConnectorRelationshipModels.ts",
  "integrationConnectorEndpointModels.ts",
  "integrationConnectorProtocolModels.ts",
  "integrationConnectorModel.ts",
  "integrationConnectorModel.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationConnectorModelIdentity",
  "IntegrationConnectorDomainModels",
  "IntegrationConnectorRelationshipModels",
  "IntegrationConnectorEndpointModels",
  "IntegrationConnectorProtocolModels",
  "IntegrationConnectorModelCollections",
  "IntegrationConnectorModelSummary",
  "IntegrationConnectorModelPlatform",
] as const);

const EXPECTED_DOMAINS = Object.freeze([
  "Connector",
  "ConnectorEndpoint",
  "ConnectorProtocol",
  "ConnectorConfiguration",
  "ConnectorAuthentication",
  "ConnectorAuthorization",
  "ConnectorPayload",
  "ConnectorMapping",
  "ConnectorCompatibility",
  "ConnectorLifecycle",
  "ConnectorCategory",
  "ConnectorOwnership",
  "ConnectorDependency",
  "ConnectorContext",
  "ConnectorRoute",
  "ConnectorTopology",
] as const);

const EXPECTED_RELATIONSHIP_TYPES = Object.freeze([
  "owns",
  "references",
  "dependsOn",
  "compatibleWith",
  "mappedTo",
  "connectedTo",
  "exposes",
  "belongsTo",
  "extends",
  "composedOf",
  "secures",
  "transports",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\/integrationConnectorRegistry(?!\.ts["'])/,
  /from ["']\.\/integrationConnector(Registry|Foundation)(Types|Identity|CategoryRegistry|ContractRegistry|CapabilityRegistry|ResponsibilityRegistry|Contracts|Capabilities|Responsibilities|Lifecycle)\.ts["']/,
  /from ["']\.\/integrationConnectorFoundation\.ts["']/,
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

describe("EIL-2:3 Integration Connector Model", () => {
  it("creates exactly eight Model files and eight public exports", () => {
    assert.equal(EIL23_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL23_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(ModelModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(ModelModule).length, 8);
  });

  it("has canonical identity, namespace, version, Model status, and ReadyForValidation", () => {
    assert.equal(IntegrationConnectorModelIdentity.phaseId, "EIL-2:3");
    assert.equal(
      IntegrationConnectorModelIdentity.canonicalId,
      "EIL-2:3/IntegrationConnectorModel",
    );
    assert.equal(
      IntegrationConnectorModelIdentity.name,
      "Integration Connector Model",
    );
    assert.equal(IntegrationConnectorModelIdentity.version, "1.0.0");
    assert.equal(
      IntegrationConnectorModelIdentity.namespace,
      "nexora.eil.integration-connector.model",
    );
    assert.equal(IntegrationConnectorModelIdentity.layer, "EIL");
    assert.equal(IntegrationConnectorModelIdentity.platform, "EIL-2");
    assert.equal(IntegrationConnectorModelIdentity.phaseType, "Model");
    assert.equal(IntegrationConnectorModelIdentity.status, "Model");
    assert.equal(
      IntegrationConnectorModelIdentity.readiness,
      "ReadyForValidation",
    );
    assert.equal(IntegrationConnectorModelPlatform.status, "Model");
    assert.equal(
      IntegrationConnectorModelPlatform.readiness,
      "ReadyForValidation",
    );
    assert.equal(
      IntegrationConnectorModelPlatform.nextPhase,
      "EIL-2:4 — Integration Connector Validation",
    );
  });

  it("declares Registry as the sole phase dependency via aggregate entry point", () => {
    const { dependency } = IntegrationConnectorModelPlatform;
    assert.equal(dependency.phaseDependencyCount, 1);
    assert.equal(dependency.registryOnly, true);
    assert.equal(
      dependency.registryId,
      IntegrationConnectorRegistryIdentity.canonicalId,
    );
    assert.equal(
      dependency.directPreviousPhaseModule,
      "integrationConnectorRegistry.ts",
    );
    assert.equal(
      IntegrationConnectorModelIdentity.registryDependency,
      "EIL-2:2/IntegrationConnectorRegistry",
    );
    assert.equal(
      IntegrationConnectorModelIdentity.registryEntryPoint,
      "integrationConnectorRegistry.ts",
    );
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.registryInternalImport, false);
    assert.equal(dependency.eil1Dependency, false);
    assert.equal(dependency.laterEil2PhaseImport, false);
    assert.equal(
      IntegrationConnectorModelPlatform.registryPlatform,
      IntegrationConnectorRegistryPlatform,
    );
  });

  it("freezes all exported collections and model entries", () => {
    assert.equal(Object.isFrozen(IntegrationConnectorModelIdentity), true);
    assert.equal(Object.isFrozen(IntegrationConnectorDomainModels), true);
    assert.equal(
      Object.isFrozen(IntegrationConnectorRelationshipModels),
      true,
    );
    assert.equal(Object.isFrozen(IntegrationConnectorEndpointModels), true);
    assert.equal(Object.isFrozen(IntegrationConnectorProtocolModels), true);
    assert.equal(Object.isFrozen(IntegrationConnectorModelCollections), true);
    assert.equal(Object.isFrozen(IntegrationConnectorModelSummary), true);
    assert.equal(Object.isFrozen(IntegrationConnectorModelPlatform), true);

    for (const entry of [
      ...IntegrationConnectorDomainModels,
      ...IntegrationConnectorRelationshipModels,
      ...IntegrationConnectorEndpointModels,
      ...IntegrationConnectorProtocolModels,
    ]) {
      assert.equal(Object.isFrozen(entry), true);
      assert.equal(Object.isFrozen(entry.tags), true);
      assert.equal(entry.metadataOnly, true);
    }
  });

  it("declares exactly sixteen domain models and twelve relationship types", () => {
    assert.equal(IntegrationConnectorDomainModels.length, 16);
    assert.deepEqual(
      IntegrationConnectorDomainModels.map((item) => item.canonicalKey),
      [...EXPECTED_DOMAINS],
    );

    assert.equal(IntegrationConnectorRelationshipModels.length, 12);
    assert.deepEqual(
      IntegrationConnectorRelationshipModels.map(
        (item) => item.relationshipType,
      ),
      [...EXPECTED_RELATIONSHIP_TYPES],
    );
    assert.deepEqual(
      [...IntegrationConnectorModelPlatform.relationshipTypes],
      [...EXPECTED_RELATIONSHIP_TYPES],
    );
  });

  it("declares endpoint and protocol models with unique IDs and deterministic ordinals", () => {
    assert.ok(IntegrationConnectorEndpointModels.length > 0);
    assert.ok(IntegrationConnectorProtocolModels.length > 0);
    assert.equal(IntegrationConnectorEndpointModels.length, 8);
    assert.equal(IntegrationConnectorProtocolModels.length, 8);

    assert.ok(
      IntegrationConnectorEndpointModels.every(
        (item) => item.communicates === false,
      ),
    );
    assert.ok(
      IntegrationConnectorProtocolModels.every(
        (item) => item.implementsProtocol === false,
      ),
    );

    assertUnique(
      IntegrationConnectorDomainModels.map((item) => item.modelId),
      "domain model IDs",
    );
    assertUnique(
      IntegrationConnectorRelationshipModels.map(
        (item) => item.relationshipId,
      ),
      "relationship IDs",
    );
    assertUnique(
      IntegrationConnectorEndpointModels.map((item) => item.endpointModelId),
      "endpoint model IDs",
    );
    assertUnique(
      IntegrationConnectorProtocolModels.map((item) => item.protocolModelId),
      "protocol model IDs",
    );

    assertAscending(
      IntegrationConnectorDomainModels.map((item) => item.ordinal),
      "domain",
    );
    assertAscending(
      IntegrationConnectorRelationshipModels.map((item) => item.ordinal),
      "relationship",
    );
    assertAscending(
      IntegrationConnectorEndpointModels.map((item) => item.ordinal),
      "endpoint",
    );
    assertAscending(
      IntegrationConnectorProtocolModels.map((item) => item.ordinal),
      "protocol",
    );
  });

  it("derives inventory counts dynamically from canonical collections", () => {
    assert.equal(
      IntegrationConnectorModelCollections.domainModelCount,
      IntegrationConnectorDomainModels.length,
    );
    assert.equal(
      IntegrationConnectorModelCollections.relationshipCount,
      IntegrationConnectorRelationshipModels.length,
    );
    assert.equal(
      IntegrationConnectorModelCollections.endpointModelCount,
      IntegrationConnectorEndpointModels.length,
    );
    assert.equal(
      IntegrationConnectorModelCollections.protocolModelCount,
      IntegrationConnectorProtocolModels.length,
    );
    assert.equal(
      IntegrationConnectorModelCollections.totalModelEntryCount,
      IntegrationConnectorDomainModels.length +
        IntegrationConnectorRelationshipModels.length +
        IntegrationConnectorEndpointModels.length +
        IntegrationConnectorProtocolModels.length,
    );
    assert.equal(
      IntegrationConnectorModelSummary.totalModelEntryCount,
      IntegrationConnectorModelCollections.totalModelEntryCount,
    );
    assert.equal(
      IntegrationConnectorModelPlatform.inventory.countsDerivedFromCollections,
      true,
    );
    assert.equal(
      IntegrationConnectorModelPlatform.inventory.relationshipTypeCount,
      12,
    );
    assert.equal(
      IntegrationConnectorModelPlatform.inventory.totalModelEntryCount,
      44,
    );
  });

  it("is metadata-only with zero runtime connector behavior", () => {
    const platform = IntegrationConnectorModelPlatform;
    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.connectorRuntime, false);
    assert.equal(platform.endpointCommunication, false);
    assert.equal(platform.httpClientBehavior, false);
    assert.equal(platform.restBehavior, false);
    assert.equal(platform.graphqlBehavior, false);
    assert.equal(platform.websocketBehavior, false);
    assert.equal(platform.grpcBehavior, false);
    assert.equal(platform.messageBrokerBehavior, false);
    assert.equal(platform.eventBus, false);
    assert.equal(platform.protocolExecution, false);
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
    assert.equal(platform.validationEngine, false);
    assert.equal(platform.eil1Dependency, false);
    assert.equal(platform.importsLaterEil2Phases, false);
    assert.equal(platform.topology.graphEngine, false);
    assert.equal(platform.topology.routingEngine, false);
  });

  it("has zero prohibited imports and Registry as sole module dependency", () => {
    const sources = EIL23_FILES.filter((name) => !name.endsWith(".test.ts"));
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
        /from ["'][^"']*integrationConnectorValidation[^"']*["']/,
      );
      assert.doesNotMatch(source, /from ["']node:(net|http|https|dgram)["']/);
      assert.doesNotMatch(source, /\b(fetch|axios)\b/);
      assert.doesNotMatch(source, /\bclass\b/);
      assert.doesNotMatch(source, /\basync\s+function\b/);
    }

    const aggregate = readFileSync(
      new URL("integrationConnectorModel.ts", import.meta.url),
      "utf8",
    );
    assert.match(
      aggregate,
      /from ["']\.\/integrationConnectorRegistry\.ts["']/,
    );
    assert.equal(
      IntegrationConnectorModelPlatform.dependency.laterEil2PhaseImport,
      false,
    );
  });

  it("is ready for Validation with stable summary", () => {
    assert.equal(
      IntegrationConnectorModelSummary.readiness,
      "ReadyForValidation",
    );
    assert.equal(IntegrationConnectorModelSummary.status, "Model");
    assert.equal(
      IntegrationConnectorModelSummary.nextPhase,
      "EIL-2:4 — Integration Connector Validation",
    );
    assert.equal(
      IntegrationConnectorModelSummary.registryId,
      "EIL-2:2/IntegrationConnectorRegistry",
    );
    assert.equal(Object.isFrozen(IntegrationConnectorModelSummary), true);
    assert.equal(IntegrationConnectorModelSummary.domainModelCount, 16);
    assert.equal(IntegrationConnectorModelSummary.relationshipCount, 12);
    assert.equal(IntegrationConnectorModelSummary.endpointModelCount, 8);
    assert.equal(IntegrationConnectorModelSummary.protocolModelCount, 8);
    assert.equal(IntegrationConnectorModelSummary.totalModelEntryCount, 44);
  });
});
