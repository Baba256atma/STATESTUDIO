/**
 * NEA-2:5 — Channel Connectors Manifest Tests.
 *
 * Deterministic coverage for the immutable Channel Connectors Manifest.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import * as ManifestModule from "./channelConnectorManifest.ts";
import {
  ChannelConnectorManifestId,
  ChannelConnectorManifestName,
  ChannelConnectorManifestNamespace,
  ChannelConnectorManifestPlatform,
  ChannelConnectorManifestReadiness,
  ChannelConnectorManifestStatus,
  ChannelConnectorManifestVersion,
  getChannelConnectorManifestSummary,
} from "./channelConnectorManifest.ts";
import {
  ChannelConnectorValidationId,
  ChannelConnectorValidationPlatform,
} from "./channelConnectorValidation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA25_FILES = Object.freeze([
  "channelConnectorManifestTypes.ts",
  "channelConnectorManifestInventory.ts",
  "channelConnectorManifestMetadata.ts",
  "channelConnectorManifestOwnership.ts",
  "channelConnectorManifestReadiness.ts",
  "channelConnectorManifestSummary.ts",
  "channelConnectorManifest.ts",
  "channelConnectorManifest.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ChannelConnectorManifestId",
  "ChannelConnectorManifestVersion",
  "ChannelConnectorManifestName",
  "ChannelConnectorManifestNamespace",
  "ChannelConnectorManifestStatus",
  "ChannelConnectorManifestReadiness",
  "ChannelConnectorManifestPlatform",
  "getChannelConnectorManifestSummary",
] as const);

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "phaseReferences",
  "inventory",
  "metadata",
  "ownership",
  "boundaries",
  "readiness",
  "summary",
] as const);

const EXPECTED_INVENTORY_KEYS = Object.freeze([
  "connectorFamilies",
  "connectorTypes",
  "connectorIdentities",
  "connectorProtocols",
  "connectorDirections",
  "authenticationMethods",
  "connectorCapabilities",
  "connectorLifecycleStates",
  "connectorHealthStates",
  "connectorStatuses",
  "connectorEventTypes",
  "connectorPayloadTypes",
  "connectorPolicies",
  "domainModels",
  "modelRelationships",
  "validationCategories",
  "validationRules",
  "ownership",
  "publicExports",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-2:5 Channel Connectors Manifest", () => {
  it("creates exactly eight Manifest files and eight public exports", () => {
    assert.equal(NEA25_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA25_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(ManifestModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(ManifestModule).length, 8);
  });

  it("has canonical manifest identity, status Manifest, and ReadyForPlatform", () => {
    assert.equal(
      ChannelConnectorManifestId,
      "NEA-2:5/ChannelConnectorManifest",
    );
    assert.equal(ChannelConnectorManifestVersion, "1.0.0");
    assert.equal(
      ChannelConnectorManifestName,
      "Channel Connectors Manifest",
    );
    assert.equal(
      ChannelConnectorManifestNamespace,
      "nexora.nea.channel-connectors.manifest",
    );
    assert.equal(ChannelConnectorManifestStatus, "Manifest");
    assert.equal(ChannelConnectorManifestReadiness, "ReadyForPlatform");
    assert.equal(ChannelConnectorManifestPlatform.identity.phase, "NEA-2:5");
    assert.equal(
      ChannelConnectorManifestPlatform.identity.validationId,
      ChannelConnectorValidationId,
    );
    assert.equal(
      ChannelConnectorManifestPlatform.nextPhase,
      "NEA-2:6 — Channel Connectors Platform",
    );
  });

  it("consumes only NEA-2:4 Validation and preserves the canonical phase chain", () => {
    const dependency = ChannelConnectorManifestPlatform.dependency;
    assert.equal(dependency.validationOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "channelConnectorValidation.ts",
    );
    assert.equal(dependency.validationId, ChannelConnectorValidationId);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.duplicatesUpstreamCollections, false);
    assert.equal(dependency.redefinesPriorPhases, false);
    assert.equal(
      ChannelConnectorManifestPlatform.validationPlatform,
      ChannelConnectorValidationPlatform,
    );

    const phases = ChannelConnectorManifestPlatform.phaseReferences;
    assert.equal(phases.length, 4);
    assert.equal(phases[0]?.module, "channelConnectorFoundation.ts");
    assert.equal(phases[1]?.module, "channelConnectorRegistry.ts");
    assert.equal(phases[2]?.module, "channelConnectorModel.ts");
    assert.equal(phases[3]?.module, "channelConnectorValidation.ts");
    assert.ok(phases.every((item) => item.ownership === "Referenced"));
    assert.ok(phases.every((item) => item.reconstructsPhase === false));
  });

  it("derives all inventory counts from canonical upstream collections", () => {
    const inventory = ChannelConnectorManifestPlatform.inventory;
    const validation = ChannelConnectorValidationPlatform;
    const model = validation.modelPlatform;
    const registry = model.registryPlatform;
    const foundation = registry.foundationPlatform;

    assert.equal(inventory.inventoryEntryCount, 19);
    assert.deepEqual(
      inventory.inventory.map((item) => item.inventoryKey),
      [...EXPECTED_INVENTORY_KEYS],
    );
    assertUnique(
      inventory.inventory.map((item) => item.inventoryKey),
      "inventory keys",
    );
    assert.ok(inventory.inventory.every((item) => item.hardcoded === false));
    assert.ok(inventory.inventory.every((item) => item.reconstructed === false));
    assert.equal(inventory.hardcoded, false);
    assert.equal(inventory.duplicatesUpstreamCollections, false);

    const byKey = Object.fromEntries(
      inventory.inventory.map((item) => [item.inventoryKey, item.count]),
    );
    assert.equal(byKey.connectorFamilies, registry.collections.familyCount);
    assert.equal(byKey.connectorTypes, registry.collections.typeCount);
    assert.equal(byKey.connectorIdentities, registry.collections.identityCount);
    assert.equal(byKey.connectorProtocols, registry.collections.protocolCount);
    assert.equal(byKey.connectorDirections, registry.collections.directionCount);
    assert.equal(
      byKey.authenticationMethods,
      registry.collections.authenticationMethodCount,
    );
    assert.equal(
      byKey.connectorCapabilities,
      registry.capabilities.capabilityCount,
    );
    assert.equal(
      byKey.connectorLifecycleStates,
      registry.collections.lifecycleStateCount,
    );
    assert.equal(
      byKey.connectorHealthStates,
      registry.collections.healthStateCount,
    );
    assert.equal(byKey.connectorStatuses, registry.collections.statusCount);
    assert.equal(byKey.connectorEventTypes, registry.collections.eventTypeCount);
    assert.equal(
      byKey.connectorPayloadTypes,
      registry.collections.payloadTypeCount,
    );
    assert.equal(byKey.connectorPolicies, registry.policies.policyCount);
    assert.equal(byKey.domainModels, model.domainModels.modelCount);
    assert.equal(
      byKey.modelRelationships,
      model.relationships.relationshipCount,
    );
    assert.equal(byKey.validationCategories, validation.categories.length);
    assert.equal(byKey.validationRules, validation.rules.ruleCount);
    assert.equal(
      byKey.ownership,
      foundation.ownership.ownsCount +
        registry.ownership.ownsCount +
        model.ownership.ownsCount +
        validation.ownership.ownsCount,
    );
    assert.equal(
      byKey.publicExports,
      foundation.apiRegistry.length +
        registry.apiRegistry.length +
        model.apiRegistry.length +
        validation.apiRegistry.length,
    );
    assert.equal(
      inventory.totalArchitectureCount,
      inventory.inventory.reduce((sum, item) => sum + item.count, 0),
    );
  });

  it("declares ownership and forbidden boundaries without connector runtime", () => {
    const { ownership, boundaries } = ChannelConnectorManifestPlatform;
    assert.ok(ownership.owns.includes("Manifest Metadata"));
    assert.ok(ownership.owns.includes("Inventory Aggregation"));
    assert.ok(ownership.owns.includes("Phase References"));
    assert.ok(ownership.doesNotOwn.includes("Foundation Contracts"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Connectors"));
    assert.ok(ownership.doesNotOwn.includes("Validation Rules"));
    assert.equal(ownership.ownsRuntimeConnectors, false);
    assert.equal(ownership.ownsValidationRules, false);

    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime connectors"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Telegram Bot"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Validation Engine"));
    assert.equal(boundaries.implementsConnectors, false);
    assert.equal(boundaries.duplicatesUpstreamCollections, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = ChannelConnectorManifestPlatform;
    const keys = Object.keys(platform);
    assert.deepEqual(keys.slice(0, 9), [...PLATFORM_SECTIONS]);
    assert.equal(platform.sectionCount, 9);
    assert.deepEqual([...platform.sectionOrder], [...PLATFORM_SECTIONS]);
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(platform.phaseReferences), true);
    assert.equal(Object.isFrozen(platform.inventory), true);
    assert.equal(Object.isFrozen(platform.inventory.inventory), true);
    assert.equal(Object.isFrozen(platform.metadata), true);
    assert.equal(Object.isFrozen(platform.ownership), true);
    assert.equal(Object.isFrozen(platform.boundaries), true);
    assert.equal(Object.isFrozen(platform.readiness), true);
    assert.equal(Object.isFrozen(platform.summary), true);
  });

  it("derives deterministic summary and declares ReadyForPlatform only", () => {
    const summaryA = getChannelConnectorManifestSummary();
    const summaryB = getChannelConnectorManifestSummary();
    const inventory = ChannelConnectorManifestPlatform.inventory;
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.manifestId, ChannelConnectorManifestId);
    assert.equal(summaryA.status, "Manifest");
    assert.equal(summaryA.readiness, "ReadyForPlatform");
    assert.equal(summaryA.validationId, ChannelConnectorValidationId);
    assert.equal(summaryA.phaseReferenceCount, 4);
    assert.equal(summaryA.inventoryEntryCount, 19);
    assert.equal(
      summaryA.totalArchitectureCount,
      inventory.totalArchitectureCount,
    );
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 9);
    assert.equal(
      summaryA.nextPhase,
      "NEA-2:6 — Channel Connectors Platform",
    );
    assert.equal(
      ChannelConnectorManifestPlatform.metadata.countsHardcoded,
      false,
    );
    assert.equal(
      ChannelConnectorManifestPlatform.metadata.architectureVersion,
      "NEA-2.0.0",
    );
    assert.equal(
      ChannelConnectorManifestPlatform.readiness.claimsRuntimeReady,
      false,
    );
    assert.equal(ChannelConnectorManifestPlatform.runtimeBehavior, false);
    assert.equal(ChannelConnectorManifestPlatform.implementsConnectors, false);
    assert.equal(ChannelConnectorManifestPlatform.validationExecution, false);
    assert.equal(ChannelConnectorManifestPlatform.oauthFlow, false);
  });
});
