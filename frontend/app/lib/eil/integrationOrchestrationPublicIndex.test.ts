/**
 * EIL-4:9 — Integration Orchestration Public Index Tests.
 *
 * Deterministic coverage for the immutable Integration Orchestration Public Index.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  IntegrationOrchestrationFreezeIdentity,
  IntegrationOrchestrationFreezePlatform,
} from "./integrationOrchestrationFreeze.ts";
import * as PublicIndexModule from "./integrationOrchestrationPublicIndex.ts";
import {
  IntegrationOrchestrationConsumerEntry,
  IntegrationOrchestrationPublicApiCount,
  IntegrationOrchestrationPublicApiRegistry,
  IntegrationOrchestrationPublicExports,
  IntegrationOrchestrationPublicIndexIdentity,
  IntegrationOrchestrationPublicIndexPlatform,
  IntegrationOrchestrationPublicInventory,
  IntegrationOrchestrationPublicMetadata,
  IntegrationOrchestrationPublicNamespace,
  IntegrationOrchestrationPublicReadiness,
  IntegrationOrchestrationPublicRelease,
  IntegrationOrchestrationPublicSummary,
} from "./integrationOrchestrationPublicIndex.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../..");

const EIL49_FILES = Object.freeze([
  "integrationOrchestrationPublicIndex.ts",
  "integrationOrchestrationPublicIndex.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationOrchestrationPublicIndexIdentity",
  "IntegrationOrchestrationPublicNamespace",
  "IntegrationOrchestrationPublicApiRegistry",
  "IntegrationOrchestrationPublicApiCount",
  "IntegrationOrchestrationPublicInventory",
  "IntegrationOrchestrationPublicRelease",
  "IntegrationOrchestrationPublicReadiness",
  "IntegrationOrchestrationPublicSummary",
  "IntegrationOrchestrationConsumerEntry",
  "IntegrationOrchestrationPublicIndexPlatform",
  "IntegrationOrchestrationPublicExports",
  "IntegrationOrchestrationPublicMetadata",
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
  /from ["']\.\/integrationOrchestrationFreeze(?!\.ts["'])/,
  /from ["']\.\/integrationOrchestration(Freeze|Certification|Platform|Manifest|Validation|Model|Registry|Foundation)(Types|Identity|Locks|Baselines|Compatibility|Extensions|Criteria|Gates|Readiness|Composition|Inventory|Guarantees|ArchitectureManifest|InventoryManifest|DependencyManifest|CompatibilityManifest|Rules|Categories|Findings|DomainModels|RelationshipModels|TopologyModels|LifecycleModels|CategoryRegistry|ContractRegistry|CapabilityRegistry|ResponsibilityRegistry|Contracts|Capabilities|Responsibilities|Lifecycle|ComplianceDeclarations)\.ts["']/,
  /from ["']\.\/integrationOrchestration(Certification|Platform|Manifest|Validation|Model|Registry|Foundation)\.ts["']/,
  /from ["']\.\/integration(?!Orchestration)/,
  /from ["']\.\/integrationConnector/,
  /from ["']\.\/integrationRouting/,
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

describe("EIL-4:9 Integration Orchestration Public Index", () => {
  it("creates exactly two Public Index files and twelve public exports", () => {
    assert.equal(EIL49_FILES.length, 2);
    const present = readdirSync(HERE);
    for (const file of EIL49_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(PublicIndexModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(PublicIndexModule).length, 12);
    assert.deepEqual(
      [...IntegrationOrchestrationPublicExports],
      [...REQUIRED_PUBLIC_EXPORTS],
    );
    assert.equal(IntegrationOrchestrationPublicExports.length, 12);
  });

  it("has canonical identity, namespace, version, and release states", () => {
    assert.equal(
      IntegrationOrchestrationPublicIndexIdentity.phaseId,
      "EIL-4:9",
    );
    assert.equal(
      IntegrationOrchestrationPublicIndexIdentity.canonicalId,
      "EIL-4:9/IntegrationOrchestrationPublicIndex",
    );
    assert.equal(
      IntegrationOrchestrationPublicIndexIdentity.name,
      "Integration Orchestration Public Index",
    );
    assert.equal(IntegrationOrchestrationPublicIndexIdentity.version, "1.0.0");
    assert.equal(
      IntegrationOrchestrationPublicIndexIdentity.namespace,
      "nexora.eil.integration-orchestration.public-index",
    );
    assert.equal(IntegrationOrchestrationPublicIndexIdentity.layer, "EIL");
    assert.equal(IntegrationOrchestrationPublicIndexIdentity.platform, "EIL-4");
    assert.equal(
      IntegrationOrchestrationPublicIndexIdentity.phaseType,
      "Public Index",
    );
    assert.equal(
      IntegrationOrchestrationPublicIndexIdentity.release,
      "Released",
    );
    assert.equal(
      IntegrationOrchestrationPublicIndexIdentity.certification,
      "Certified",
    );
    assert.equal(IntegrationOrchestrationPublicIndexIdentity.freeze, "Frozen");
    assert.equal(
      IntegrationOrchestrationPublicIndexIdentity.stability,
      "Stable",
    );
    assert.equal(
      IntegrationOrchestrationPublicIndexIdentity.readiness,
      "ReadyForConsumer",
    );
    assert.equal(
      IntegrationOrchestrationPublicReadiness,
      "ReadyForConsumer",
    );
    assert.equal(IntegrationOrchestrationPublicRelease.release, "Released");
    assert.equal(
      IntegrationOrchestrationPublicRelease.certification,
      "Certified",
    );
    assert.equal(IntegrationOrchestrationPublicRelease.freeze, "Frozen");
    assert.equal(IntegrationOrchestrationPublicRelease.stability, "Stable");
    assert.equal(
      IntegrationOrchestrationPublicRelease.readiness,
      "ReadyForConsumer",
    );
    assert.equal(IntegrationOrchestrationPublicRelease.releaseDate, "EIL-4.0.0");
  });

  it("declares Freeze aggregate as the sole phase dependency", () => {
    const { dependency } = IntegrationOrchestrationPublicIndexPlatform;
    assert.equal(dependency.freezeOnly, true);
    assert.equal(
      dependency.freezeId,
      IntegrationOrchestrationFreezeIdentity.canonicalId,
    );
    assert.equal(
      dependency.directPreviousPhaseModule,
      "integrationOrchestrationFreeze.ts",
    );
    assert.equal(
      IntegrationOrchestrationPublicIndexIdentity.freezeDependency,
      "EIL-4:8/IntegrationOrchestrationFreeze",
    );
    assert.equal(
      IntegrationOrchestrationPublicIndexIdentity.freezeEntryPoint,
      "integrationOrchestrationFreeze.ts",
    );
    assert.equal(dependency.freezeInternalImport, false);
    assert.equal(dependency.certificationDirectImport, false);
    assert.equal(dependency.platformDirectImport, false);
    assert.equal(dependency.previousEilPlatformDependency, false);
    assert.equal(dependency.laterEil4PhaseImport, false);
    assert.equal(
      IntegrationOrchestrationPublicIndexPlatform.freezePlatform,
      IntegrationOrchestrationFreezePlatform,
    );
  });

  it("publishes exactly nine namespace sections in deterministic order", () => {
    assert.equal(IntegrationOrchestrationPublicNamespace.sections.length, 9);
    assert.equal(
      IntegrationOrchestrationPublicNamespace.sectionCount,
      IntegrationOrchestrationPublicNamespace.sections.length,
    );
    assert.deepEqual(
      IntegrationOrchestrationPublicNamespace.sections.map(
        (item) => item.section,
      ),
      [...EXPECTED_NAMESPACE_SECTIONS],
    );
    assertAscending(
      IntegrationOrchestrationPublicNamespace.sections.map(
        (item) => item.ordinal,
      ),
      "namespace",
    );
    assertUnique(
      IntegrationOrchestrationPublicNamespace.sections.map(
        (item) => item.sectionId,
      ),
      "namespace section IDs",
    );
    assert.equal(
      IntegrationOrchestrationPublicNamespace.sections[8]!.namespace,
      "nexora.eil.integration-orchestration.public-index",
    );
  });

  it("publishes an immutable Public API Registry with exactly 76 entries", () => {
    assert.equal(
      Object.isFrozen(IntegrationOrchestrationPublicApiRegistry),
      true,
    );
    assert.equal(IntegrationOrchestrationPublicApiRegistry.length, 76);
    assert.equal(
      IntegrationOrchestrationPublicApiCount,
      IntegrationOrchestrationPublicApiRegistry.length,
    );
    assert.equal(
      IntegrationOrchestrationPublicInventory.publicApiCount,
      IntegrationOrchestrationPublicApiRegistry.length,
    );
    assert.equal(
      IntegrationOrchestrationPublicSummary.publicApiCount,
      IntegrationOrchestrationPublicApiRegistry.length,
    );
    assert.equal(
      IntegrationOrchestrationPublicMetadata.publicApiCount,
      IntegrationOrchestrationPublicApiRegistry.length,
    );

    for (const entry of IntegrationOrchestrationPublicApiRegistry) {
      assert.equal(Object.isFrozen(entry), true);
      assert.ok(typeof entry.apiId === "string" && entry.apiId.length > 0);
      assert.ok(
        typeof entry.canonicalKey === "string" &&
          entry.canonicalKey.length > 0,
      );
      assert.ok(
        typeof entry.publicName === "string" && entry.publicName.length > 0,
      );
      assert.ok(
        typeof entry.namespace === "string" && entry.namespace.length > 0,
      );
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
      IntegrationOrchestrationPublicApiRegistry.map((item) => item.ordinal),
      "api registry",
    );
    assertUnique(
      IntegrationOrchestrationPublicApiRegistry.map((item) => item.apiId),
      "api IDs",
    );
    assertUnique(
      IntegrationOrchestrationPublicApiRegistry.map(
        (item) => `${item.sourcePhase}:${item.canonicalKey}`,
      ),
      "api keys",
    );

    const foundationApis = IntegrationOrchestrationPublicApiRegistry.filter(
      (item) => item.sourcePhase === "EIL-4:1",
    );
    assert.equal(foundationApis.length, 8);

    const publicIndexApis = IntegrationOrchestrationPublicApiRegistry.filter(
      (item) => item.sourcePhase === "EIL-4:9",
    );
    assert.equal(publicIndexApis.length, 12);
    assert.deepEqual(
      publicIndexApis.map((item) => item.exportName),
      [...REQUIRED_PUBLIC_EXPORTS],
    );
  });

  it("derives inventory from Freeze and Public Index collections", () => {
    assert.equal(
      IntegrationOrchestrationPublicInventory.namespaceSectionCount,
      IntegrationOrchestrationPublicNamespace.sections.length,
    );
    assert.equal(
      IntegrationOrchestrationPublicInventory.namespaceSectionCount,
      9,
    );
    assert.equal(
      IntegrationOrchestrationPublicInventory.publicExportCount,
      IntegrationOrchestrationPublicExports.length,
    );
    assert.equal(IntegrationOrchestrationPublicInventory.publicExportCount, 12);
    assert.equal(
      IntegrationOrchestrationPublicInventory.freezeInventoryTotal,
      39,
    );
    assert.equal(
      IntegrationOrchestrationPublicInventory.freezeTotalEntryCount,
      IntegrationOrchestrationFreezePlatform.inventory.totalFreezeEntryCount,
    );
    assert.equal(
      IntegrationOrchestrationPublicInventory.freezeLockCount,
      IntegrationOrchestrationFreezePlatform.inventory.lockCount,
    );
    assert.equal(
      IntegrationOrchestrationPublicInventory.freezeBaselineCount,
      IntegrationOrchestrationFreezePlatform.inventory.baselineCount,
    );
    assert.equal(
      IntegrationOrchestrationPublicInventory.countsDerivedFromFreeze,
      true,
    );
    assert.equal(
      IntegrationOrchestrationPublicInventory.countsDerivedFromCollections,
      true,
    );
  });

  it("declares integrationOrchestrationPublicIndex.ts as the sole consumer entry", () => {
    assert.equal(
      IntegrationOrchestrationConsumerEntry.entryPoint,
      "integrationOrchestrationPublicIndex.ts",
    );
    assert.equal(
      IntegrationOrchestrationConsumerEntry.soleSupportedEntry,
      true,
    );
    assert.equal(
      IntegrationOrchestrationConsumerEntry.directImportPolicy,
      "PublicIndexOnly",
    );
    assert.equal(
      IntegrationOrchestrationPublicMetadata.solePublicEntryPoint,
      "integrationOrchestrationPublicIndex.ts",
    );
    assert.equal(
      IntegrationOrchestrationPublicSummary.consumerEntry,
      "integrationOrchestrationPublicIndex.ts",
    );
    assert.equal(
      IntegrationOrchestrationConsumerEntry.prohibitedDirectImports.length,
      8,
    );
  });

  it("is metadata-only with immutable public collections and zero runtime behavior", () => {
    const platform = IntegrationOrchestrationPublicIndexPlatform;
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(
      Object.isFrozen(IntegrationOrchestrationPublicIndexIdentity),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationOrchestrationPublicNamespace),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationOrchestrationPublicNamespace.sections),
      true,
    );
    assert.equal(Object.isFrozen(IntegrationOrchestrationPublicRelease), true);
    assert.equal(
      Object.isFrozen(IntegrationOrchestrationPublicInventory),
      true,
    );
    assert.equal(Object.isFrozen(IntegrationOrchestrationPublicSummary), true);
    assert.equal(
      Object.isFrozen(IntegrationOrchestrationConsumerEntry),
      true,
    );
    assert.equal(Object.isFrozen(IntegrationOrchestrationPublicExports), true);
    assert.equal(
      Object.isFrozen(IntegrationOrchestrationPublicMetadata),
      true,
    );

    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.runtimePlatform, false);
    assert.equal(platform.orchestrationEngine, false);
    assert.equal(platform.workflowExecution, false);
    assert.equal(platform.routingExecution, false);
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
    assert.equal(platform.importsLaterEil4Phases, false);
  });

  it("has zero prohibited imports and Freeze as sole module dependency", () => {
    const source = readFileSync(
      new URL("integrationOrchestrationPublicIndex.ts", import.meta.url),
      "utf8",
    );
    for (const pattern of PROHIBITED_IMPORT_PATTERNS) {
      assert.doesNotMatch(
        source,
        pattern,
        `integrationOrchestrationPublicIndex.ts must not match ${pattern}`,
      );
    }
    assert.match(
      source,
      /from ["']\.\/integrationOrchestrationFreeze\.ts["']/,
    );
    assert.doesNotMatch(source, /from ["']node:(net|http|https|dgram)["']/);
    assert.doesNotMatch(source, /\b(fetch|axios)\b/);
    assert.doesNotMatch(source, /\bclass\b/);
    assert.doesNotMatch(source, /\basync\s+function\b/);
    assert.equal(
      IntegrationOrchestrationPublicIndexPlatform.dependency.laterEil4PhaseImport,
      false,
    );
  });

  it("is ReadyForConsumer with stable released summary", () => {
    assert.equal(
      IntegrationOrchestrationPublicSummary.readiness,
      "ReadyForConsumer",
    );
    assert.equal(IntegrationOrchestrationPublicSummary.release, "Released");
    assert.equal(
      IntegrationOrchestrationPublicSummary.certification,
      "Certified",
    );
    assert.equal(IntegrationOrchestrationPublicSummary.freeze, "Frozen");
    assert.equal(IntegrationOrchestrationPublicSummary.stability, "Stable");
    assert.equal(
      IntegrationOrchestrationPublicSummary.namespaceSectionCount,
      9,
    );
    assert.equal(IntegrationOrchestrationPublicSummary.publicExportCount, 12);
    assert.equal(
      IntegrationOrchestrationPublicSummary.freezeInventoryTotal,
      39,
    );
    assert.equal(
      IntegrationOrchestrationPublicSummary.freezeId,
      "EIL-4:8/IntegrationOrchestrationFreeze",
    );
    assert.equal(
      IntegrationOrchestrationPublicSummary.nextPhase,
      "EIL-4 Complete — ReadyForConsumer",
    );
    assert.equal(
      IntegrationOrchestrationPublicIndexPlatform.status,
      "Released",
    );
    assert.equal(
      IntegrationOrchestrationPublicIndexPlatform.readiness,
      "ReadyForConsumer",
    );
  });

  it("passes strict TypeScript and ESLint for public index sources", () => {
    const sources = ["app/lib/eil/integrationOrchestrationPublicIndex.ts"];

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
        "app/lib/eil/integrationOrchestrationFreeze.ts",
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
