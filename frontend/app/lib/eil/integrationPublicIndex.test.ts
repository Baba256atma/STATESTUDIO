/**
 * EIL-1:9 — Integration Public Index Tests.
 *
 * Deterministic coverage for the immutable Integration Public Index phase.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  IntegrationFreezeIdentity,
  IntegrationFreezePlatform,
} from "./integrationFreeze.ts";
import * as PublicIndexModule from "./integrationPublicIndex.ts";
import {
  IntegrationConsumerEntry,
  IntegrationPublicApiCount,
  IntegrationPublicApiRegistry,
  IntegrationPublicExports,
  IntegrationPublicIndexIdentity,
  IntegrationPublicIndexPlatform,
  IntegrationPublicInventory,
  IntegrationPublicMetadata,
  IntegrationPublicNamespace,
  IntegrationPublicReadiness,
  IntegrationPublicRelease,
  IntegrationPublicSummary,
} from "./integrationPublicIndex.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const EIL19_FILES = Object.freeze([
  "integrationPublicIndex.ts",
  "integrationPublicIndex.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationPublicIndexIdentity",
  "IntegrationPublicNamespace",
  "IntegrationPublicApiRegistry",
  "IntegrationPublicApiCount",
  "IntegrationPublicInventory",
  "IntegrationPublicRelease",
  "IntegrationPublicReadiness",
  "IntegrationPublicSummary",
  "IntegrationConsumerEntry",
  "IntegrationPublicIndexPlatform",
  "IntegrationPublicExports",
  "IntegrationPublicMetadata",
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
  /from ["']\.\/integrationFreeze(?!\.ts["'])/,
  /from ["']\.\/integration(Freeze|Certification|Platform|Manifest|Validation|Model|Registry|Foundation)(Types|Identity|Locks|Baselines|Compatibility|Extensions|Criteria|Gates|Readiness|Composition|Inventory|Guarantees|ArchitectureManifest|InventoryManifest|DependencyManifest|CompatibilityManifest|Rules|Categories|Findings|DomainModels|RelationshipModels|TopologyModels|LifecycleModels|Contracts|Capabilities|Responsibilities|Lifecycle|TypeRegistry|ContractRegistry|CapabilityRegistry|ResponsibilityRegistry|ComplianceDeclarations)\.ts["']/,
  /from ["']\.\/integration(Certification|Platform|Manifest|Validation|Model|Registry|Foundation)\.ts["']/,
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

describe("EIL-1:9 Integration Public Index", () => {
  it("creates exactly two Public Index files and twelve public exports", () => {
    assert.equal(EIL19_FILES.length, 2);
    const present = readdirSync(HERE);
    for (const file of EIL19_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(PublicIndexModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(PublicIndexModule).length, 12);
    assert.deepEqual(
      [...IntegrationPublicExports],
      [...REQUIRED_PUBLIC_EXPORTS],
    );
    assert.equal(IntegrationPublicExports.length, 12);
  });

  it("has canonical identity, namespace, version, and release states", () => {
    assert.equal(IntegrationPublicIndexIdentity.phaseId, "EIL-1:9");
    assert.equal(
      IntegrationPublicIndexIdentity.canonicalId,
      "EIL-1:9/IntegrationPublicIndex",
    );
    assert.equal(
      IntegrationPublicIndexIdentity.name,
      "Integration Public Index",
    );
    assert.equal(IntegrationPublicIndexIdentity.version, "1.0.0");
    assert.equal(
      IntegrationPublicIndexIdentity.namespace,
      "nexora.eil.integration.public-index",
    );
    assert.equal(IntegrationPublicIndexIdentity.layer, "EIL");
    assert.equal(IntegrationPublicIndexIdentity.platform, "EIL-1");
    assert.equal(IntegrationPublicIndexIdentity.phaseType, "PublicIndex");
    assert.equal(IntegrationPublicIndexIdentity.release, "Released");
    assert.equal(IntegrationPublicIndexIdentity.certification, "Certified");
    assert.equal(IntegrationPublicIndexIdentity.freeze, "Frozen");
    assert.equal(IntegrationPublicIndexIdentity.stability, "Stable");
    assert.equal(
      IntegrationPublicIndexIdentity.readiness,
      "ReadyForConsumer",
    );
    assert.equal(IntegrationPublicReadiness, "ReadyForConsumer");
    assert.equal(IntegrationPublicRelease.release, "Released");
    assert.equal(IntegrationPublicRelease.certification, "Certified");
    assert.equal(IntegrationPublicRelease.freeze, "Frozen");
    assert.equal(IntegrationPublicRelease.stability, "Stable");
    assert.equal(IntegrationPublicRelease.readiness, "ReadyForConsumer");
    assert.equal(IntegrationPublicRelease.releaseDate, "EIL-1.0.0");
  });

  it("declares Freeze aggregate as the sole phase dependency", () => {
    const { dependency } = IntegrationPublicIndexPlatform;
    assert.equal(dependency.freezeOnly, true);
    assert.equal(
      dependency.freezeId,
      IntegrationFreezeIdentity.canonicalId,
    );
    assert.equal(
      dependency.directPreviousPhaseModule,
      "integrationFreeze.ts",
    );
    assert.equal(
      IntegrationPublicIndexIdentity.freezeDependency,
      "EIL-1:8/IntegrationFreeze",
    );
    assert.equal(
      IntegrationPublicIndexIdentity.freezeEntryPoint,
      "integrationFreeze.ts",
    );
    assert.equal(dependency.freezeInternalImport, false);
    assert.equal(dependency.certificationDirectImport, false);
    assert.equal(dependency.platformDirectImport, false);
    assert.equal(dependency.laterEilPhaseImport, false);
    assert.equal(
      IntegrationPublicIndexPlatform.freezePlatform,
      IntegrationFreezePlatform,
    );
  });

  it("publishes exactly nine namespace sections in deterministic order", () => {
    assert.equal(IntegrationPublicNamespace.length, 9);
    assert.deepEqual(
      IntegrationPublicNamespace.map((item) => item.section),
      [...EXPECTED_NAMESPACE_SECTIONS],
    );
    assertAscending(
      IntegrationPublicNamespace.map((item) => item.ordinal),
      "namespace",
    );
    assertUnique(
      IntegrationPublicNamespace.map((item) => item.sectionId),
      "namespace section IDs",
    );
    assert.equal(
      IntegrationPublicNamespace[8]!.namespace,
      "nexora.eil.integration.public-index",
    );
  });

  it("publishes an immutable Public API Registry with derived count", () => {
    assert.equal(Object.isFrozen(IntegrationPublicApiRegistry), true);
    assert.ok(IntegrationPublicApiRegistry.length > 0);
    assert.equal(
      IntegrationPublicApiCount,
      IntegrationPublicApiRegistry.length,
    );
    assert.equal(
      IntegrationPublicInventory.publicApiCount,
      IntegrationPublicApiRegistry.length,
    );
    assert.equal(
      IntegrationPublicSummary.publicApiCount,
      IntegrationPublicApiRegistry.length,
    );
    assert.equal(
      IntegrationPublicMetadata.publicApiCount,
      IntegrationPublicApiRegistry.length,
    );

    for (const entry of IntegrationPublicApiRegistry) {
      assert.equal(Object.isFrozen(entry), true);
      assert.equal(entry.status, "Released");
      assert.equal(entry.stability, "Stable");
      assert.equal(entry.certificationStatus, "Certified");
      assert.equal(entry.freezeStatus, "Frozen");
      assert.equal(entry.derivedFromFreeze, true);
      assert.equal(entry.metadataOnly, true);
    }

    assertAscending(
      IntegrationPublicApiRegistry.map((item) => item.deterministicOrder),
      "api registry",
    );
    assertUnique(
      IntegrationPublicApiRegistry.map((item) => item.id),
      "api IDs",
    );

    const publicIndexApis = IntegrationPublicApiRegistry.filter(
      (item) => item.phase === "EIL-1:9",
    );
    assert.equal(publicIndexApis.length, 12);
    assert.deepEqual(
      publicIndexApis.map((item) => item.exportName),
      [...REQUIRED_PUBLIC_EXPORTS],
    );
  });

  it("derives inventory from Freeze and Public Index collections", () => {
    assert.equal(
      IntegrationPublicInventory.namespaceCount,
      IntegrationPublicNamespace.length,
    );
    assert.equal(
      IntegrationPublicInventory.publicExportCount,
      IntegrationPublicExports.length,
    );
    assert.equal(IntegrationPublicInventory.publicExportCount, 12);
    assert.equal(
      IntegrationPublicInventory.freezeLockCount,
      IntegrationFreezePlatform.inventory.lockCount,
    );
    assert.equal(
      IntegrationPublicInventory.freezeBaselineCount,
      IntegrationFreezePlatform.inventory.baselineCount,
    );
    assert.equal(
      IntegrationPublicInventory.freezeTotalEntryCount,
      IntegrationFreezePlatform.inventory.totalFreezeEntryCount,
    );
    assert.equal(IntegrationPublicInventory.countsDerivedFromFreeze, true);
    assert.equal(
      IntegrationPublicInventory.countsDerivedFromCollections,
      true,
    );
  });

  it("declares integrationPublicIndex.ts as the sole consumer entry", () => {
    assert.equal(
      IntegrationConsumerEntry.entryPoint,
      "integrationPublicIndex.ts",
    );
    assert.equal(IntegrationConsumerEntry.soleSupportedEntry, true);
    assert.equal(
      IntegrationConsumerEntry.directImportPolicy,
      "PublicIndexOnly",
    );
    assert.equal(
      IntegrationPublicMetadata.solePublicEntryPoint,
      "integrationPublicIndex.ts",
    );
    assert.equal(
      IntegrationPublicSummary.consumerEntry,
      "integrationPublicIndex.ts",
    );
    assert.equal(IntegrationConsumerEntry.prohibitedDirectImports.length, 8);
  });

  it("is metadata-only with zero runtime public-index behavior", () => {
    const platform = IntegrationPublicIndexPlatform;
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(IntegrationPublicIndexIdentity), true);
    assert.equal(Object.isFrozen(IntegrationPublicNamespace), true);
    assert.equal(Object.isFrozen(IntegrationPublicRelease), true);
    assert.equal(Object.isFrozen(IntegrationPublicInventory), true);
    assert.equal(Object.isFrozen(IntegrationPublicSummary), true);
    assert.equal(Object.isFrozen(IntegrationConsumerEntry), true);
    assert.equal(Object.isFrozen(IntegrationPublicExports), true);
    assert.equal(Object.isFrozen(IntegrationPublicMetadata), true);

    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.runtimePlatform, false);
    assert.equal(platform.routingEngine, false);
    assert.equal(platform.orchestrationEngine, false);
    assert.equal(platform.validationEngine, false);
    assert.equal(platform.certificationEngine, false);
    assert.equal(platform.freezeEnforcement, false);
    assert.equal(platform.restBehavior, false);
    assert.equal(platform.graphqlBehavior, false);
    assert.equal(platform.websocketBehavior, false);
    assert.equal(platform.queueBehavior, false);
    assert.equal(platform.connectorBehavior, false);
    assert.equal(platform.adapterBehavior, false);
    assert.equal(platform.dependencyInjection, false);
    assert.equal(platform.persistenceBehavior, false);
    assert.equal(platform.storageBehavior, false);
    assert.equal(platform.cacheBehavior, false);
    assert.equal(platform.filesystemBehavior, false);
    assert.equal(platform.aiBehavior, false);
    assert.equal(platform.llmBehavior, false);
    assert.equal(platform.uiBehavior, false);
    assert.equal(platform.visualizationBehavior, false);
    assert.equal(platform.sdkRuntime, false);
    assert.equal(platform.apiBehavior, false);
    assert.equal(platform.stateMutation, false);
    assert.equal(platform.importsLaterEilPhases, false);
  });

  it("has zero prohibited imports and Freeze as sole module dependency", () => {
    const source = readFileSync(
      new URL("integrationPublicIndex.ts", import.meta.url),
      "utf8",
    );
    for (const pattern of PROHIBITED_IMPORT_PATTERNS) {
      assert.doesNotMatch(
        source,
        pattern,
        `integrationPublicIndex.ts must not match ${pattern}`,
      );
    }
    assert.match(source, /from ["']\.\/integrationFreeze\.ts["']/);
    assert.doesNotMatch(
      source,
      /from ["'][^"']*EIL-1:1[0-9][^"']*["']/,
    );
    assert.doesNotMatch(source, /from ["']node:(net|http|https|dgram)["']/);
    assert.doesNotMatch(source, /\b(fetch|axios)\b/);
    assert.doesNotMatch(source, /\bclass\b/);
    assert.doesNotMatch(source, /\basync\s+function\b/);
    assert.equal(
      IntegrationPublicIndexPlatform.dependency.laterEilPhaseImport,
      false,
    );
  });

  it("is ReadyForConsumer with stable released summary", () => {
    assert.equal(IntegrationPublicSummary.readiness, "ReadyForConsumer");
    assert.equal(IntegrationPublicSummary.release, "Released");
    assert.equal(IntegrationPublicSummary.certification, "Certified");
    assert.equal(IntegrationPublicSummary.freeze, "Frozen");
    assert.equal(IntegrationPublicSummary.stability, "Stable");
    assert.equal(IntegrationPublicSummary.namespaceCount, 9);
    assert.equal(IntegrationPublicSummary.publicExportCount, 12);
    assert.equal(
      IntegrationPublicSummary.freezeId,
      "EIL-1:8/IntegrationFreeze",
    );
    assert.equal(
      IntegrationPublicSummary.nextPhase,
      "EIL-1 Complete — ReadyForConsumer",
    );
    assert.equal(IntegrationPublicIndexPlatform.status, "Released");
    assert.equal(
      IntegrationPublicIndexPlatform.readiness,
      "ReadyForConsumer",
    );
  });
});
