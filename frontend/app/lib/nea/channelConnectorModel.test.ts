/**
 * NEA-2:3 — Channel Connectors Model Tests.
 *
 * Deterministic coverage for the immutable Channel Connectors Model.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import * as ModelModule from "./channelConnectorModel.ts";
import {
  ChannelConnectorModelId,
  ChannelConnectorModelName,
  ChannelConnectorModelNamespace,
  ChannelConnectorModelPlatform,
  ChannelConnectorModelReadiness,
  ChannelConnectorModelStatus,
  ChannelConnectorModelVersion,
  getChannelConnectorModelSummary,
} from "./channelConnectorModel.ts";
import {
  ChannelConnectorRegistryId,
  ChannelConnectorRegistryPlatform,
} from "./channelConnectorRegistry.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA23_FILES = Object.freeze([
  "channelConnectorModelTypes.ts",
  "channelConnectorModels.ts",
  "channelConnectorRelationships.ts",
  "channelConnectorModelMetadata.ts",
  "channelConnectorModelOwnership.ts",
  "channelConnectorModelLifecycle.ts",
  "channelConnectorModel.ts",
  "channelConnectorModel.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ChannelConnectorModelId",
  "ChannelConnectorModelVersion",
  "ChannelConnectorModelName",
  "ChannelConnectorModelNamespace",
  "ChannelConnectorModelStatus",
  "ChannelConnectorModelReadiness",
  "ChannelConnectorModelPlatform",
  "getChannelConnectorModelSummary",
] as const);

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "domainModels",
  "relationships",
  "lifecycle",
  "metadata",
  "ownership",
  "boundaries",
  "readiness",
] as const);

const EXPECTED_MODEL_KINDS = Object.freeze([
  "ConnectorIdentity",
  "ConnectorDefinition",
  "ConnectorFamily",
  "ConnectorType",
  "ConnectorProtocol",
  "ConnectorDirection",
  "ConnectorCapability",
  "ConnectorAuthentication",
  "ConnectorHealth",
  "ConnectorStatus",
  "ConnectorEvent",
  "ConnectorPayload",
  "ConnectorPolicy",
  "ConnectorEndpoint",
  "ConnectorSession",
  "ConnectorMetadata",
  "ConnectorConfiguration",
  "ConnectorDiagnostics",
  "ConnectorResult",
  "ConnectorSummary",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-2:3 Channel Connectors Model", () => {
  it("creates exactly eight Model files and eight public exports", () => {
    assert.equal(NEA23_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA23_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(ModelModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(ModelModule).length, 8);
  });

  it("has canonical model identity, status Model, and ReadyForValidation", () => {
    assert.equal(ChannelConnectorModelId, "NEA-2:3/ChannelConnectorModel");
    assert.equal(ChannelConnectorModelVersion, "1.0.0");
    assert.equal(ChannelConnectorModelName, "Channel Connectors Model");
    assert.equal(
      ChannelConnectorModelNamespace,
      "nexora.nea.channel-connectors.model",
    );
    assert.equal(ChannelConnectorModelStatus, "Model");
    assert.equal(ChannelConnectorModelReadiness, "ReadyForValidation");
    assert.equal(ChannelConnectorModelPlatform.identity.phase, "NEA-2:3");
    assert.equal(
      ChannelConnectorModelPlatform.identity.registryId,
      ChannelConnectorRegistryId,
    );
    assert.equal(
      ChannelConnectorModelPlatform.nextPhase,
      "NEA-2:4 — Channel Connectors Validation",
    );
  });

  it("consumes only NEA-2:2 Registry without duplicating Registry values", () => {
    const dependency = ChannelConnectorModelPlatform.dependency;
    assert.equal(dependency.registryOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "channelConnectorRegistry.ts",
    );
    assert.equal(dependency.registryId, ChannelConnectorRegistryId);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.reconstructsRegistry, false);
    assert.equal(dependency.duplicatesRegistryValues, false);
    assert.equal(
      ChannelConnectorModelPlatform.registryPlatform,
      ChannelConnectorRegistryPlatform,
    );
    assert.equal(
      ChannelConnectorModelPlatform.domainModels.registryAnchors
        .duplicatesRegistryValues,
      false,
    );
    assert.equal(
      ChannelConnectorModelPlatform.domainModels.registryAnchors.identityCount,
      ChannelConnectorRegistryPlatform.collections.identityCount,
    );
  });

  it("declares twenty domain model kinds and twelve unique identity models", () => {
    const domainModels = ChannelConnectorModelPlatform.domainModels;
    assert.equal(domainModels.modelCount, 20);
    assert.deepEqual(
      domainModels.models.map((item) => item.modelKind),
      [...EXPECTED_MODEL_KINDS],
    );
    assertUnique(
      domainModels.models.map((item) => item.modelKind),
      "model kinds",
    );
    assert.ok(
      domainModels.models.every((item) => item.executesRuntime === false),
    );

    assert.equal(domainModels.identityModelCount, 12);
    assertUnique(
      domainModels.identityModels.map((item) => item.connectorId),
      "connector identity ids",
    );
    assert.ok(
      domainModels.identityModels.every(
        (item) => item.implementsConnector === false,
      ),
    );
    assert.equal(
      domainModels.identityModelCount,
      ChannelConnectorRegistryPlatform.collections.identityCount,
    );
  });

  it("declares complete model relationships with valid model kinds", () => {
    const relationships = ChannelConnectorModelPlatform.relationships;
    assert.equal(relationships.relationshipCount, 20);
    assertUnique(
      relationships.relationships.map((item) => item.relationshipId),
      "relationship ids",
    );
    const kinds = new Set(EXPECTED_MODEL_KINDS);
    for (const rel of relationships.relationships) {
      assert.ok(kinds.has(rel.sourceModelKind), rel.sourceModelKind);
      assert.ok(kinds.has(rel.targetModelKind), rel.targetModelKind);
      assert.equal(rel.metadataOnly, true);
    }
    assert.ok(
      relationships.relationships.some(
        (item) => item.relationshipName === "Definition has Identity",
      ),
    );
    assert.ok(
      relationships.relationships.some(
        (item) => item.relationshipName === "Summary has Definition",
      ),
    );
  });

  it("declares model lifecycle ReadyForValidation without a runtime state machine", () => {
    const lifecycle = ChannelConnectorModelPlatform.lifecycle;
    assert.equal(lifecycle.stateCount, 6);
    assert.equal(lifecycle.currentState, "ReadyForValidation");
    assert.equal(lifecycle.executesTransitions, false);
    assert.equal(lifecycle.runtimeStateMachine, false);
    assert.deepEqual(
      [...lifecycle.states],
      [
        "Declared",
        "Typed",
        "Composed",
        "Related",
        "Boundaried",
        "ReadyForValidation",
      ],
    );
  });

  it("declares ownership and forbidden boundaries without connector implementation", () => {
    const { ownership, boundaries } = ChannelConnectorModelPlatform;
    assert.ok(ownership.owns.includes("Domain Models"));
    assert.ok(ownership.owns.includes("Model Relationships"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Connectors"));
    assert.ok(ownership.doesNotOwn.includes("OAuth Flows"));
    assert.ok(ownership.doesNotOwn.includes("Connector Validation"));
    assert.equal(ownership.ownsRuntimeConnectors, false);

    assert.ok(boundaries.prohibitedSurfaces.includes("Telegram Bot"));
    assert.ok(boundaries.prohibitedSurfaces.includes("OAuth Flow"));
    assert.ok(
      boundaries.prohibitedSurfaces.includes("Connector Validation Engine"),
    );
    assert.equal(boundaries.implementsConnectors, false);
    assert.equal(boundaries.validationEngine, false);
    assert.equal(boundaries.duplicatesRegistryValues, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = ChannelConnectorModelPlatform;
    const keys = Object.keys(platform);
    assert.deepEqual(keys.slice(0, 9), [...PLATFORM_SECTIONS]);
    assert.equal(platform.sectionCount, 9);
    assert.deepEqual([...platform.sectionOrder], [...PLATFORM_SECTIONS]);
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(platform.domainModels), true);
    assert.equal(Object.isFrozen(platform.domainModels.models), true);
    assert.equal(Object.isFrozen(platform.domainModels.identityModels), true);
    assert.equal(Object.isFrozen(platform.relationships), true);
    assert.equal(Object.isFrozen(platform.lifecycle), true);
    assert.equal(Object.isFrozen(platform.metadata), true);
    assert.equal(Object.isFrozen(platform.ownership), true);
    assert.equal(Object.isFrozen(platform.boundaries), true);
  });

  it("derives deterministic summary from canonical collections", () => {
    const summaryA = getChannelConnectorModelSummary();
    const summaryB = getChannelConnectorModelSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.modelId, ChannelConnectorModelId);
    assert.equal(summaryA.status, "Model");
    assert.equal(summaryA.readiness, "ReadyForValidation");
    assert.equal(summaryA.registryId, ChannelConnectorRegistryId);
    assert.equal(summaryA.domainModelCount, 20);
    assert.equal(summaryA.identityModelCount, 12);
    assert.equal(summaryA.relationshipCount, 20);
    assert.equal(summaryA.lifecycleStateCount, 6);
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 9);
    assert.equal(
      summaryA.nextPhase,
      "NEA-2:4 — Channel Connectors Validation",
    );
    assert.equal(
      ChannelConnectorModelPlatform.metadata.countsHardcoded,
      false,
    );
    assert.equal(
      ChannelConnectorModelPlatform.metadata.duplicatesRegistryValues,
      false,
    );
    assert.equal(
      ChannelConnectorModelPlatform.readiness.claimsReadyForValidation,
      true,
    );
    assert.equal(ChannelConnectorModelPlatform.runtimeBehavior, false);
    assert.equal(ChannelConnectorModelPlatform.implementsConnectors, false);
    assert.equal(ChannelConnectorModelPlatform.validationEngine, false);
    assert.equal(ChannelConnectorModelPlatform.oauthFlow, false);
    assert.equal(ChannelConnectorModelPlatform.messageProcessing, false);
  });
});
