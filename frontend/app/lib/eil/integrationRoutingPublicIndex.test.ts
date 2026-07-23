/**
 * EIL-3:9 — Integration Routing Public Index Tests.
 *
 * Deterministic coverage for the immutable Integration Routing Public Index.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  IntegrationRoutingFreezeIdentity,
  IntegrationRoutingFreezePlatform,
} from "./integrationRoutingFreeze.ts";
import * as PublicIndexModule from "./integrationRoutingPublicIndex.ts";
import {
  IntegrationRoutingConsumerEntry,
  IntegrationRoutingPublicApiCount,
  IntegrationRoutingPublicApiRegistry,
  IntegrationRoutingPublicExports,
  IntegrationRoutingPublicIndexIdentity,
  IntegrationRoutingPublicIndexPlatform,
  IntegrationRoutingPublicInventory,
  IntegrationRoutingPublicMetadata,
  IntegrationRoutingPublicNamespace,
  IntegrationRoutingPublicReadiness,
  IntegrationRoutingPublicRelease,
  IntegrationRoutingPublicSummary,
} from "./integrationRoutingPublicIndex.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../..");

const EIL39_FILES = Object.freeze([
  "integrationRoutingPublicIndex.ts",
  "integrationRoutingPublicIndex.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationRoutingPublicIndexIdentity",
  "IntegrationRoutingPublicNamespace",
  "IntegrationRoutingPublicApiRegistry",
  "IntegrationRoutingPublicApiCount",
  "IntegrationRoutingPublicInventory",
  "IntegrationRoutingPublicRelease",
  "IntegrationRoutingPublicReadiness",
  "IntegrationRoutingPublicSummary",
  "IntegrationRoutingConsumerEntry",
  "IntegrationRoutingPublicIndexPlatform",
  "IntegrationRoutingPublicExports",
  "IntegrationRoutingPublicMetadata",
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
  /from ["']\.\/integrationRoutingFreeze(?!\.ts["'])/,
  /from ["']\.\/integrationRouting(Freeze|Certification|Platform|Manifest|Validation|Model|Registry|Foundation)(Types|Identity|Locks|Baselines|Compatibility|Extensions|Criteria|Gates|Readiness|Composition|Inventory|Guarantees|ArchitectureManifest|InventoryManifest|DependencyManifest|CompatibilityManifest|Rules|Categories|Findings|DomainModels|RelationshipModels|TopologyModels|LifecycleModels|CategoryRegistry|ContractRegistry|CapabilityRegistry|ResponsibilityRegistry|Contracts|Capabilities|Responsibilities|Lifecycle|ComplianceDeclarations)\.ts["']/,
  /from ["']\.\/integrationRouting(Certification|Platform|Manifest|Validation|Model|Registry|Foundation)\.ts["']/,
  /from ["']\.\/integration(?!Routing)/,
  /from ["']\.\/integrationConnector/,
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

describe("EIL-3:9 Integration Routing Public Index", () => {
  it("creates exactly two Public Index files and twelve public exports", () => {
    assert.equal(EIL39_FILES.length, 2);
    const present = readdirSync(HERE);
    for (const file of EIL39_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(PublicIndexModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(PublicIndexModule).length, 12);
    assert.deepEqual(
      [...IntegrationRoutingPublicExports],
      [...REQUIRED_PUBLIC_EXPORTS],
    );
    assert.equal(IntegrationRoutingPublicExports.length, 12);
  });

  it("has canonical identity, namespace, version, and release states", () => {
    assert.equal(IntegrationRoutingPublicIndexIdentity.phaseId, "EIL-3:9");
    assert.equal(
      IntegrationRoutingPublicIndexIdentity.canonicalId,
      "EIL-3:9/IntegrationRoutingPublicIndex",
    );
    assert.equal(
      IntegrationRoutingPublicIndexIdentity.name,
      "Integration Routing Public Index",
    );
    assert.equal(IntegrationRoutingPublicIndexIdentity.version, "1.0.0");
    assert.equal(
      IntegrationRoutingPublicIndexIdentity.namespace,
      "nexora.eil.integration-routing.public-index",
    );
    assert.equal(IntegrationRoutingPublicIndexIdentity.layer, "EIL");
    assert.equal(IntegrationRoutingPublicIndexIdentity.platform, "EIL-3");
    assert.equal(
      IntegrationRoutingPublicIndexIdentity.phaseType,
      "PublicIndex",
    );
    assert.equal(IntegrationRoutingPublicIndexIdentity.release, "Released");
    assert.equal(
      IntegrationRoutingPublicIndexIdentity.certification,
      "Certified",
    );
    assert.equal(IntegrationRoutingPublicIndexIdentity.freeze, "Frozen");
    assert.equal(IntegrationRoutingPublicIndexIdentity.stability, "Stable");
    assert.equal(
      IntegrationRoutingPublicIndexIdentity.readiness,
      "ReadyForConsumer",
    );
    assert.equal(IntegrationRoutingPublicReadiness, "ReadyForConsumer");
    assert.equal(IntegrationRoutingPublicRelease.release, "Released");
    assert.equal(IntegrationRoutingPublicRelease.certification, "Certified");
    assert.equal(IntegrationRoutingPublicRelease.freeze, "Frozen");
    assert.equal(IntegrationRoutingPublicRelease.stability, "Stable");
    assert.equal(
      IntegrationRoutingPublicRelease.readiness,
      "ReadyForConsumer",
    );
    assert.equal(IntegrationRoutingPublicRelease.releaseDate, "EIL-3.0.0");
  });

  it("declares Freeze aggregate as the sole phase dependency", () => {
    const { dependency } = IntegrationRoutingPublicIndexPlatform;
    assert.equal(dependency.freezeOnly, true);
    assert.equal(
      dependency.freezeId,
      IntegrationRoutingFreezeIdentity.canonicalId,
    );
    assert.equal(
      dependency.directPreviousPhaseModule,
      "integrationRoutingFreeze.ts",
    );
    assert.equal(
      IntegrationRoutingPublicIndexIdentity.freezeDependency,
      "EIL-3:8/IntegrationRoutingFreeze",
    );
    assert.equal(
      IntegrationRoutingPublicIndexIdentity.freezeEntryPoint,
      "integrationRoutingFreeze.ts",
    );
    assert.equal(dependency.freezeInternalImport, false);
    assert.equal(dependency.certificationDirectImport, false);
    assert.equal(dependency.platformDirectImport, false);
    assert.equal(dependency.previousEilPlatformDependency, false);
    assert.equal(dependency.laterEil3PhaseImport, false);
    assert.equal(
      IntegrationRoutingPublicIndexPlatform.freezePlatform,
      IntegrationRoutingFreezePlatform,
    );
  });

  it("publishes exactly nine namespace sections in deterministic order", () => {
    assert.equal(IntegrationRoutingPublicNamespace.sections.length, 9);
    assert.equal(
      IntegrationRoutingPublicNamespace.sectionCount,
      IntegrationRoutingPublicNamespace.sections.length,
    );
    assert.deepEqual(
      IntegrationRoutingPublicNamespace.sections.map((item) => item.section),
      [...EXPECTED_NAMESPACE_SECTIONS],
    );
    assertAscending(
      IntegrationRoutingPublicNamespace.sections.map((item) => item.ordinal),
      "namespace",
    );
    assertUnique(
      IntegrationRoutingPublicNamespace.sections.map((item) => item.sectionId),
      "namespace section IDs",
    );
    assert.equal(
      IntegrationRoutingPublicNamespace.sections[8]!.namespace,
      "nexora.eil.integration-routing.public-index",
    );
  });

  it("publishes an immutable Public API Registry with exactly 76 entries", () => {
    assert.equal(Object.isFrozen(IntegrationRoutingPublicApiRegistry), true);
    assert.equal(IntegrationRoutingPublicApiRegistry.length, 76);
    assert.equal(
      IntegrationRoutingPublicApiCount,
      IntegrationRoutingPublicApiRegistry.length,
    );
    assert.equal(
      IntegrationRoutingPublicInventory.publicApiCount,
      IntegrationRoutingPublicApiRegistry.length,
    );
    assert.equal(
      IntegrationRoutingPublicSummary.publicApiCount,
      IntegrationRoutingPublicApiRegistry.length,
    );
    assert.equal(
      IntegrationRoutingPublicMetadata.publicApiCount,
      IntegrationRoutingPublicApiRegistry.length,
    );

    for (const entry of IntegrationRoutingPublicApiRegistry) {
      assert.equal(Object.isFrozen(entry), true);
      assert.ok(typeof entry.apiId === "string" && entry.apiId.length > 0);
      assert.ok(
        typeof entry.canonicalKey === "string" && entry.canonicalKey.length > 0,
      );
      assert.ok(
        typeof entry.publicName === "string" && entry.publicName.length > 0,
      );
      assert.ok(typeof entry.namespace === "string" && entry.namespace.length > 0);
      assert.ok(
        typeof entry.sourcePhase === "string" && entry.sourcePhase.length > 0,
      );
      assert.ok(typeof entry.ordinal === "number");
      assert.ok(Array.isArray(entry.tags));
      assert.equal(entry.status, "Released");
      assert.equal(entry.stability, "Stable");
      assert.equal(entry.certificationStatus, "Certified");
      assert.equal(entry.freezeStatus, "Frozen");
      assert.equal(entry.derivedFromFreeze, true);
      assert.equal(entry.metadataOnly, true);
    }

    assertAscending(
      IntegrationRoutingPublicApiRegistry.map((item) => item.ordinal),
      "api registry",
    );
    assertUnique(
      IntegrationRoutingPublicApiRegistry.map((item) => item.apiId),
      "api IDs",
    );
    assertUnique(
      IntegrationRoutingPublicApiRegistry.map(
        (item) => `${item.sourcePhase}:${item.canonicalKey}`,
      ),
      "api keys",
    );

    const foundationApis = IntegrationRoutingPublicApiRegistry.filter(
      (item) => item.sourcePhase === "EIL-3:1",
    );
    assert.equal(foundationApis.length, 8);

    const publicIndexApis = IntegrationRoutingPublicApiRegistry.filter(
      (item) => item.sourcePhase === "EIL-3:9",
    );
    assert.equal(publicIndexApis.length, 12);
    assert.deepEqual(
      publicIndexApis.map((item) => item.exportName),
      [...REQUIRED_PUBLIC_EXPORTS],
    );
  });

  it("derives inventory from Freeze and Public Index collections", () => {
    assert.equal(
      IntegrationRoutingPublicInventory.namespaceSectionCount,
      IntegrationRoutingPublicNamespace.sections.length,
    );
    assert.equal(IntegrationRoutingPublicInventory.namespaceSectionCount, 9);
    assert.equal(
      IntegrationRoutingPublicInventory.publicExportCount,
      IntegrationRoutingPublicExports.length,
    );
    assert.equal(IntegrationRoutingPublicInventory.publicExportCount, 12);
    assert.equal(IntegrationRoutingPublicInventory.freezeInventoryTotal, 39);
    assert.equal(
      IntegrationRoutingPublicInventory.freezeTotalEntryCount,
      IntegrationRoutingFreezePlatform.inventory.totalFreezeEntryCount,
    );
    assert.equal(
      IntegrationRoutingPublicInventory.freezeLockCount,
      IntegrationRoutingFreezePlatform.inventory.lockCount,
    );
    assert.equal(
      IntegrationRoutingPublicInventory.freezeBaselineCount,
      IntegrationRoutingFreezePlatform.inventory.baselineCount,
    );
    assert.equal(
      IntegrationRoutingPublicInventory.countsDerivedFromFreeze,
      true,
    );
    assert.equal(
      IntegrationRoutingPublicInventory.countsDerivedFromCollections,
      true,
    );
  });

  it("declares integrationRoutingPublicIndex.ts as the sole consumer entry", () => {
    assert.equal(
      IntegrationRoutingConsumerEntry.entryPoint,
      "integrationRoutingPublicIndex.ts",
    );
    assert.equal(IntegrationRoutingConsumerEntry.soleSupportedEntry, true);
    assert.equal(
      IntegrationRoutingConsumerEntry.directImportPolicy,
      "PublicIndexOnly",
    );
    assert.equal(
      IntegrationRoutingPublicMetadata.solePublicEntryPoint,
      "integrationRoutingPublicIndex.ts",
    );
    assert.equal(
      IntegrationRoutingPublicSummary.consumerEntry,
      "integrationRoutingPublicIndex.ts",
    );
    assert.equal(
      IntegrationRoutingConsumerEntry.prohibitedDirectImports.length,
      8,
    );
  });

  it("is metadata-only with immutable public collections and zero runtime behavior", () => {
    const platform = IntegrationRoutingPublicIndexPlatform;
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(IntegrationRoutingPublicIndexIdentity), true);
    assert.equal(Object.isFrozen(IntegrationRoutingPublicNamespace), true);
    assert.equal(
      Object.isFrozen(IntegrationRoutingPublicNamespace.sections),
      true,
    );
    assert.equal(Object.isFrozen(IntegrationRoutingPublicRelease), true);
    assert.equal(Object.isFrozen(IntegrationRoutingPublicInventory), true);
    assert.equal(Object.isFrozen(IntegrationRoutingPublicSummary), true);
    assert.equal(Object.isFrozen(IntegrationRoutingConsumerEntry), true);
    assert.equal(Object.isFrozen(IntegrationRoutingPublicExports), true);
    assert.equal(Object.isFrozen(IntegrationRoutingPublicMetadata), true);

    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.runtimePlatform, false);
    assert.equal(platform.routingEngine, false);
    assert.equal(platform.messageExecution, false);
    assert.equal(platform.orchestrationBehavior, false);
    assert.equal(platform.schedulingBehavior, false);
    assert.equal(platform.certificationEngine, false);
    assert.equal(platform.freezeEnforcement, false);
    assert.equal(platform.restBehavior, false);
    assert.equal(platform.graphqlBehavior, false);
    assert.equal(platform.websocketBehavior, false);
    assert.equal(platform.queueBehavior, false);
    assert.equal(platform.connectorExecution, false);
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
    assert.equal(platform.previousEilPlatformDependency, false);
    assert.equal(platform.importsLaterEil3Phases, false);
  });

  it("has zero prohibited imports and Freeze as sole module dependency", () => {
    const source = readFileSync(
      new URL("integrationRoutingPublicIndex.ts", import.meta.url),
      "utf8",
    );
    for (const pattern of PROHIBITED_IMPORT_PATTERNS) {
      assert.doesNotMatch(
        source,
        pattern,
        `integrationRoutingPublicIndex.ts must not match ${pattern}`,
      );
    }
    assert.match(source, /from ["']\.\/integrationRoutingFreeze\.ts["']/);
    assert.doesNotMatch(source, /from ["']node:(net|http|https|dgram)["']/);
    assert.doesNotMatch(source, /\b(fetch|axios)\b/);
    assert.doesNotMatch(source, /\bclass\b/);
    assert.doesNotMatch(source, /\basync\s+function\b/);
    assert.equal(
      IntegrationRoutingPublicIndexPlatform.dependency.laterEil3PhaseImport,
      false,
    );
  });

  it("is ReadyForConsumer with stable released summary", () => {
    assert.equal(
      IntegrationRoutingPublicSummary.readiness,
      "ReadyForConsumer",
    );
    assert.equal(IntegrationRoutingPublicSummary.release, "Released");
    assert.equal(IntegrationRoutingPublicSummary.certification, "Certified");
    assert.equal(IntegrationRoutingPublicSummary.freeze, "Frozen");
    assert.equal(IntegrationRoutingPublicSummary.stability, "Stable");
    assert.equal(IntegrationRoutingPublicSummary.namespaceSectionCount, 9);
    assert.equal(IntegrationRoutingPublicSummary.publicExportCount, 12);
    assert.equal(IntegrationRoutingPublicSummary.freezeInventoryTotal, 39);
    assert.equal(
      IntegrationRoutingPublicSummary.freezeId,
      "EIL-3:8/IntegrationRoutingFreeze",
    );
    assert.equal(
      IntegrationRoutingPublicSummary.nextPhase,
      "EIL-3 Complete — ReadyForConsumer",
    );
    assert.equal(IntegrationRoutingPublicIndexPlatform.status, "Released");
    assert.equal(
      IntegrationRoutingPublicIndexPlatform.readiness,
      "ReadyForConsumer",
    );
  });

  it("passes strict TypeScript and ESLint for public index sources", () => {
    const sources = ["app/lib/eil/integrationRoutingPublicIndex.ts"];

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
        "app/lib/eil/integrationRoutingFreeze.ts",
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
