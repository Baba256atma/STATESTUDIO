/**
 * EIL-2:9 — Integration Connector Public Index Tests.
 *
 * Deterministic coverage for the immutable Integration Connector Public Index.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  IntegrationConnectorFreezeIdentity,
  IntegrationConnectorFreezePlatform,
} from "./integrationConnectorFreeze.ts";
import * as PublicIndexModule from "./integrationConnectorPublicIndex.ts";
import {
  IntegrationConnectorConsumerEntry,
  IntegrationConnectorPublicApiCount,
  IntegrationConnectorPublicApiRegistry,
  IntegrationConnectorPublicExports,
  IntegrationConnectorPublicIndexIdentity,
  IntegrationConnectorPublicIndexPlatform,
  IntegrationConnectorPublicInventory,
  IntegrationConnectorPublicMetadata,
  IntegrationConnectorPublicNamespace,
  IntegrationConnectorPublicReadiness,
  IntegrationConnectorPublicRelease,
  IntegrationConnectorPublicSummary,
} from "./integrationConnectorPublicIndex.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const EIL29_FILES = Object.freeze([
  "integrationConnectorPublicIndex.ts",
  "integrationConnectorPublicIndex.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationConnectorPublicIndexIdentity",
  "IntegrationConnectorPublicNamespace",
  "IntegrationConnectorPublicApiRegistry",
  "IntegrationConnectorPublicApiCount",
  "IntegrationConnectorPublicInventory",
  "IntegrationConnectorPublicRelease",
  "IntegrationConnectorPublicReadiness",
  "IntegrationConnectorPublicSummary",
  "IntegrationConnectorConsumerEntry",
  "IntegrationConnectorPublicIndexPlatform",
  "IntegrationConnectorPublicExports",
  "IntegrationConnectorPublicMetadata",
] as const);

const EXPECTED_NAMESPACE_SECTIONS = Object.freeze([
  "Foundation",
  "Registry",
  "Model",
  "Validation",
  "Manifest",
  "Platform",
  "Certification",
  "Freeze",
  "Public Index",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\/integrationConnectorFreeze(?!\.ts["'])/,
  /from ["']\.\/integrationConnector(Freeze|Certification|Platform|Manifest|Validation|Model|Registry|Foundation)(Types|Identity|Locks|Baselines|Compatibility|Extensions|Criteria|Gates|Readiness|Composition|Inventory|Guarantees|ArchitectureManifest|InventoryManifest|DependencyManifest|CompatibilityManifest|Rules|Categories|Findings|DomainModels|RelationshipModels|EndpointModels|ProtocolModels|CategoryRegistry|ContractRegistry|CapabilityRegistry|ResponsibilityRegistry|Contracts|Capabilities|Responsibilities|Lifecycle|ComplianceDeclarations)\.ts["']/,
  /from ["']\.\/integrationConnector(Certification|Platform|Manifest|Validation|Model|Registry|Foundation)\.ts["']/,
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

describe("EIL-2:9 Integration Connector Public Index", () => {
  it("creates exactly two Public Index files and twelve public exports", () => {
    assert.equal(EIL29_FILES.length, 2);
    const present = readdirSync(HERE);
    for (const file of EIL29_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(PublicIndexModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(PublicIndexModule).length, 12);
    assert.deepEqual(
      [...IntegrationConnectorPublicExports],
      [...REQUIRED_PUBLIC_EXPORTS],
    );
    assert.equal(IntegrationConnectorPublicExports.length, 12);
  });

  it("has canonical identity, namespace, version, and release states", () => {
    assert.equal(IntegrationConnectorPublicIndexIdentity.phaseId, "EIL-2:9");
    assert.equal(
      IntegrationConnectorPublicIndexIdentity.canonicalId,
      "EIL-2:9/IntegrationConnectorPublicIndex",
    );
    assert.equal(
      IntegrationConnectorPublicIndexIdentity.name,
      "Integration Connector Public Index",
    );
    assert.equal(IntegrationConnectorPublicIndexIdentity.version, "1.0.0");
    assert.equal(
      IntegrationConnectorPublicIndexIdentity.namespace,
      "nexora.eil.integration-connector.public-index",
    );
    assert.equal(IntegrationConnectorPublicIndexIdentity.layer, "EIL");
    assert.equal(IntegrationConnectorPublicIndexIdentity.platform, "EIL-2");
    assert.equal(
      IntegrationConnectorPublicIndexIdentity.phaseType,
      "PublicIndex",
    );
    assert.equal(IntegrationConnectorPublicIndexIdentity.release, "Released");
    assert.equal(
      IntegrationConnectorPublicIndexIdentity.certification,
      "Certified",
    );
    assert.equal(IntegrationConnectorPublicIndexIdentity.freeze, "Frozen");
    assert.equal(IntegrationConnectorPublicIndexIdentity.stability, "Stable");
    assert.equal(
      IntegrationConnectorPublicIndexIdentity.readiness,
      "ReadyForConsumer",
    );
    assert.equal(IntegrationConnectorPublicReadiness, "ReadyForConsumer");
    assert.equal(IntegrationConnectorPublicRelease.release, "Released");
    assert.equal(IntegrationConnectorPublicRelease.certification, "Certified");
    assert.equal(IntegrationConnectorPublicRelease.freeze, "Frozen");
    assert.equal(IntegrationConnectorPublicRelease.stability, "Stable");
    assert.equal(
      IntegrationConnectorPublicRelease.readiness,
      "ReadyForConsumer",
    );
    assert.equal(IntegrationConnectorPublicRelease.releaseDate, "EIL-2.0.0");
  });

  it("declares Freeze aggregate as the sole phase dependency", () => {
    const { dependency } = IntegrationConnectorPublicIndexPlatform;
    assert.equal(dependency.freezeOnly, true);
    assert.equal(
      dependency.freezeId,
      IntegrationConnectorFreezeIdentity.canonicalId,
    );
    assert.equal(
      dependency.directPreviousPhaseModule,
      "integrationConnectorFreeze.ts",
    );
    assert.equal(
      IntegrationConnectorPublicIndexIdentity.freezeDependency,
      "EIL-2:8/IntegrationConnectorFreeze",
    );
    assert.equal(
      IntegrationConnectorPublicIndexIdentity.freezeEntryPoint,
      "integrationConnectorFreeze.ts",
    );
    assert.equal(dependency.freezeInternalImport, false);
    assert.equal(dependency.certificationDirectImport, false);
    assert.equal(dependency.platformDirectImport, false);
    assert.equal(dependency.eil1Dependency, false);
    assert.equal(dependency.laterEil2PhaseImport, false);
    assert.equal(
      IntegrationConnectorPublicIndexPlatform.freezePlatform,
      IntegrationConnectorFreezePlatform,
    );
  });

  it("publishes exactly nine namespace sections in deterministic order", () => {
    assert.equal(IntegrationConnectorPublicNamespace.length, 9);
    assert.deepEqual(
      IntegrationConnectorPublicNamespace.map((item) => item.section),
      [...EXPECTED_NAMESPACE_SECTIONS],
    );
    assertAscending(
      IntegrationConnectorPublicNamespace.map((item) => item.ordinal),
      "namespace",
    );
    assertUnique(
      IntegrationConnectorPublicNamespace.map((item) => item.sectionId),
      "namespace section IDs",
    );
    assert.equal(
      IntegrationConnectorPublicNamespace[8]!.namespace,
      "nexora.eil.integration-connector.public-index",
    );
  });

  it("publishes an immutable Public API Registry with derived count", () => {
    assert.equal(Object.isFrozen(IntegrationConnectorPublicApiRegistry), true);
    assert.ok(IntegrationConnectorPublicApiRegistry.length > 0);
    assert.equal(
      IntegrationConnectorPublicApiCount,
      IntegrationConnectorPublicApiRegistry.length,
    );
    assert.equal(
      IntegrationConnectorPublicInventory.publicApiCount,
      IntegrationConnectorPublicApiRegistry.length,
    );
    assert.equal(
      IntegrationConnectorPublicSummary.publicApiCount,
      IntegrationConnectorPublicApiRegistry.length,
    );
    assert.equal(
      IntegrationConnectorPublicMetadata.publicApiCount,
      IntegrationConnectorPublicApiRegistry.length,
    );
    assert.equal(IntegrationConnectorPublicApiCount, 76);

    for (const entry of IntegrationConnectorPublicApiRegistry) {
      assert.equal(Object.isFrozen(entry), true);
      assert.equal(entry.status, "Released");
      assert.equal(entry.stability, "Stable");
      assert.equal(entry.certificationStatus, "Certified");
      assert.equal(entry.freezeStatus, "Frozen");
      assert.equal(entry.derivedFromFreeze, true);
      assert.equal(entry.metadataOnly, true);
    }

    assertAscending(
      IntegrationConnectorPublicApiRegistry.map(
        (item) => item.deterministicOrder,
      ),
      "api registry",
    );
    assertUnique(
      IntegrationConnectorPublicApiRegistry.map((item) => item.id),
      "api IDs",
    );

    const publicIndexApis = IntegrationConnectorPublicApiRegistry.filter(
      (item) => item.phase === "EIL-2:9",
    );
    assert.equal(publicIndexApis.length, 12);
    assert.deepEqual(
      publicIndexApis.map((item) => item.exportName),
      [...REQUIRED_PUBLIC_EXPORTS],
    );
  });

  it("derives inventory from Freeze and Public Index collections", () => {
    assert.equal(
      IntegrationConnectorPublicInventory.namespaceCount,
      IntegrationConnectorPublicNamespace.length,
    );
    assert.equal(
      IntegrationConnectorPublicInventory.publicExportCount,
      IntegrationConnectorPublicExports.length,
    );
    assert.equal(IntegrationConnectorPublicInventory.publicExportCount, 12);
    assert.equal(
      IntegrationConnectorPublicInventory.freezeLockCount,
      IntegrationConnectorFreezePlatform.inventory.lockCount,
    );
    assert.equal(
      IntegrationConnectorPublicInventory.freezeBaselineCount,
      IntegrationConnectorFreezePlatform.inventory.baselineCount,
    );
    assert.equal(
      IntegrationConnectorPublicInventory.freezeTotalEntryCount,
      IntegrationConnectorFreezePlatform.inventory.totalFreezeEntryCount,
    );
    assert.equal(
      IntegrationConnectorPublicInventory.countsDerivedFromFreeze,
      true,
    );
    assert.equal(
      IntegrationConnectorPublicInventory.countsDerivedFromCollections,
      true,
    );
  });

  it("declares integrationConnectorPublicIndex.ts as the sole consumer entry", () => {
    assert.equal(
      IntegrationConnectorConsumerEntry.entryPoint,
      "integrationConnectorPublicIndex.ts",
    );
    assert.equal(IntegrationConnectorConsumerEntry.soleSupportedEntry, true);
    assert.equal(
      IntegrationConnectorConsumerEntry.directImportPolicy,
      "PublicIndexOnly",
    );
    assert.equal(
      IntegrationConnectorPublicMetadata.solePublicEntryPoint,
      "integrationConnectorPublicIndex.ts",
    );
    assert.equal(
      IntegrationConnectorPublicSummary.consumerEntry,
      "integrationConnectorPublicIndex.ts",
    );
    assert.equal(
      IntegrationConnectorConsumerEntry.prohibitedDirectImports.length,
      8,
    );
  });

  it("is metadata-only with zero runtime public-index behavior", () => {
    const platform = IntegrationConnectorPublicIndexPlatform;
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(
      Object.isFrozen(IntegrationConnectorPublicIndexIdentity),
      true,
    );
    assert.equal(Object.isFrozen(IntegrationConnectorPublicNamespace), true);
    assert.equal(Object.isFrozen(IntegrationConnectorPublicRelease), true);
    assert.equal(Object.isFrozen(IntegrationConnectorPublicInventory), true);
    assert.equal(Object.isFrozen(IntegrationConnectorPublicSummary), true);
    assert.equal(Object.isFrozen(IntegrationConnectorConsumerEntry), true);
    assert.equal(Object.isFrozen(IntegrationConnectorPublicExports), true);
    assert.equal(Object.isFrozen(IntegrationConnectorPublicMetadata), true);

    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.runtimePlatform, false);
    assert.equal(platform.connectorRuntime, false);
    assert.equal(platform.endpointExecution, false);
    assert.equal(platform.protocolExecution, false);
    assert.equal(platform.certificationEngine, false);
    assert.equal(platform.freezeEnforcement, false);
    assert.equal(platform.restBehavior, false);
    assert.equal(platform.graphqlBehavior, false);
    assert.equal(platform.websocketBehavior, false);
    assert.equal(platform.httpClientBehavior, false);
    assert.equal(platform.messageBrokerBehavior, false);
    assert.equal(platform.eventBus, false);
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
    assert.equal(platform.sdkRuntime, false);
    assert.equal(platform.apiBehavior, false);
    assert.equal(platform.stateMutation, false);
    assert.equal(platform.eil1Dependency, false);
    assert.equal(platform.importsLaterEil2Phases, false);
  });

  it("has zero prohibited imports and Freeze as sole module dependency", () => {
    const source = readFileSync(
      new URL("integrationConnectorPublicIndex.ts", import.meta.url),
      "utf8",
    );
    for (const pattern of PROHIBITED_IMPORT_PATTERNS) {
      assert.doesNotMatch(
        source,
        pattern,
        `integrationConnectorPublicIndex.ts must not match ${pattern}`,
      );
    }
    assert.match(
      source,
      /from ["']\.\/integrationConnectorFreeze\.ts["']/,
    );
    assert.doesNotMatch(source, /from ["']node:(net|http|https|dgram)["']/);
    assert.doesNotMatch(source, /\b(fetch|axios)\b/);
    assert.doesNotMatch(source, /\bclass\b/);
    assert.doesNotMatch(source, /\basync\s+function\b/);
    assert.equal(
      IntegrationConnectorPublicIndexPlatform.dependency.laterEil2PhaseImport,
      false,
    );
  });

  it("is ReadyForConsumer with stable released summary", () => {
    assert.equal(
      IntegrationConnectorPublicSummary.readiness,
      "ReadyForConsumer",
    );
    assert.equal(IntegrationConnectorPublicSummary.release, "Released");
    assert.equal(IntegrationConnectorPublicSummary.certification, "Certified");
    assert.equal(IntegrationConnectorPublicSummary.freeze, "Frozen");
    assert.equal(IntegrationConnectorPublicSummary.stability, "Stable");
    assert.equal(IntegrationConnectorPublicSummary.namespaceCount, 9);
    assert.equal(IntegrationConnectorPublicSummary.publicExportCount, 12);
    assert.equal(
      IntegrationConnectorPublicSummary.freezeId,
      "EIL-2:8/IntegrationConnectorFreeze",
    );
    assert.equal(
      IntegrationConnectorPublicSummary.nextPhase,
      "EIL-2 Complete — ReadyForConsumer",
    );
    assert.equal(IntegrationConnectorPublicIndexPlatform.status, "Released");
    assert.equal(
      IntegrationConnectorPublicIndexPlatform.readiness,
      "ReadyForConsumer",
    );
  });
});
