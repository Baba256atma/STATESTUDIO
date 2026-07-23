/**
 * EIL-5:9 — Integration Policy & Governance Public Index Tests.
 *
 * Deterministic coverage for the immutable Integration Policy & Governance Public Index.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  IntegrationPolicyGovernanceFreezeIdentity,
  IntegrationPolicyGovernanceFreezePlatform,
} from "./integrationPolicyGovernanceFreeze.ts";
import * as PublicIndexModule from "./integrationPolicyGovernancePublicIndex.ts";
import {
  IntegrationPolicyGovernanceConsumerEntry,
  IntegrationPolicyGovernancePublicApiCount,
  IntegrationPolicyGovernancePublicApiRegistry,
  IntegrationPolicyGovernancePublicExports,
  IntegrationPolicyGovernancePublicIndexIdentity,
  IntegrationPolicyGovernancePublicIndexPlatform,
  IntegrationPolicyGovernancePublicInventory,
  IntegrationPolicyGovernancePublicMetadata,
  IntegrationPolicyGovernancePublicNamespace,
  IntegrationPolicyGovernancePublicReadiness,
  IntegrationPolicyGovernancePublicRelease,
  IntegrationPolicyGovernancePublicSummary,
} from "./integrationPolicyGovernancePublicIndex.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../..");

const EIL59_FILES = Object.freeze([
  "integrationPolicyGovernancePublicIndex.ts",
  "integrationPolicyGovernancePublicIndex.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationPolicyGovernancePublicIndexIdentity",
  "IntegrationPolicyGovernancePublicNamespace",
  "IntegrationPolicyGovernancePublicApiRegistry",
  "IntegrationPolicyGovernancePublicApiCount",
  "IntegrationPolicyGovernancePublicInventory",
  "IntegrationPolicyGovernancePublicRelease",
  "IntegrationPolicyGovernancePublicReadiness",
  "IntegrationPolicyGovernancePublicSummary",
  "IntegrationPolicyGovernanceConsumerEntry",
  "IntegrationPolicyGovernancePublicIndexPlatform",
  "IntegrationPolicyGovernancePublicExports",
  "IntegrationPolicyGovernancePublicMetadata",
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
  /from ["']\.\/integrationPolicyGovernanceFreeze(?!\.ts["'])/,
  /from ["']\.\/integrationPolicyGovernance(Freeze|Certification|Platform|Manifest|Validation|Model|Registry|Foundation)(Types|Identity|Locks|Baselines|Compatibility|Extensions|Criteria|Gates|Readiness|Composition|Inventory|Guarantees|ArchitectureManifest|InventoryManifest|DependencyManifest|CompatibilityManifest|Rules|Categories|Findings|DomainModels|RelationshipModels|TopologyModels|LifecycleModels|CategoryRegistry|ContractRegistry|CapabilityRegistry|ResponsibilityRegistry|Contracts|Capabilities|Responsibilities|Lifecycle|ComplianceDeclarations)\.ts["']/,
  /from ["']\.\/integrationPolicyGovernance(Certification|Platform|Manifest|Validation|Model|Registry|Foundation)\.ts["']/,
  /from ["']\.\/integration(?!PolicyGovernance)/,
  /from ["']\.\/integrationConnector/,
  /from ["']\.\/integrationRouting/,
  /from ["']\.\/integrationOrchestration/,
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

describe("EIL-5:9 Integration Policy & Governance Public Index", () => {
  it("creates exactly two Public Index files and twelve public exports", () => {
    assert.equal(EIL59_FILES.length, 2);
    const present = readdirSync(HERE);
    for (const file of EIL59_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(PublicIndexModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(PublicIndexModule).length, 12);
    assert.deepEqual(
      [...IntegrationPolicyGovernancePublicExports],
      [...REQUIRED_PUBLIC_EXPORTS],
    );
    assert.equal(IntegrationPolicyGovernancePublicExports.length, 12);
  });

  it("has canonical identity, namespace, version, and release states", () => {
    assert.equal(
      IntegrationPolicyGovernancePublicIndexIdentity.phaseId,
      "EIL-5:9",
    );
    assert.equal(
      IntegrationPolicyGovernancePublicIndexIdentity.canonicalId,
      "EIL-5:9/IntegrationPolicyGovernancePublicIndex",
    );
    assert.equal(
      IntegrationPolicyGovernancePublicIndexIdentity.name,
      "Integration Policy & Governance Public Index",
    );
    assert.equal(
      IntegrationPolicyGovernancePublicIndexIdentity.version,
      "1.0.0",
    );
    assert.equal(
      IntegrationPolicyGovernancePublicIndexIdentity.namespace,
      "nexora.eil.integration-policy-governance.public-index",
    );
    assert.equal(
      IntegrationPolicyGovernancePublicIndexIdentity.layer,
      "EIL",
    );
    assert.equal(
      IntegrationPolicyGovernancePublicIndexIdentity.platform,
      "EIL-5",
    );
    assert.equal(
      IntegrationPolicyGovernancePublicIndexIdentity.phaseType,
      "Public Index",
    );
    assert.equal(
      IntegrationPolicyGovernancePublicIndexIdentity.release,
      "Released",
    );
    assert.equal(
      IntegrationPolicyGovernancePublicIndexIdentity.certification,
      "Certified",
    );
    assert.equal(
      IntegrationPolicyGovernancePublicIndexIdentity.freeze,
      "Frozen",
    );
    assert.equal(
      IntegrationPolicyGovernancePublicIndexIdentity.stability,
      "Stable",
    );
    assert.equal(
      IntegrationPolicyGovernancePublicIndexIdentity.readiness,
      "ReadyForConsumer",
    );
    assert.equal(
      IntegrationPolicyGovernancePublicReadiness,
      "ReadyForConsumer",
    );
    assert.equal(
      IntegrationPolicyGovernancePublicRelease.release,
      "Released",
    );
    assert.equal(
      IntegrationPolicyGovernancePublicRelease.certification,
      "Certified",
    );
    assert.equal(IntegrationPolicyGovernancePublicRelease.freeze, "Frozen");
    assert.equal(
      IntegrationPolicyGovernancePublicRelease.stability,
      "Stable",
    );
    assert.equal(
      IntegrationPolicyGovernancePublicRelease.readiness,
      "ReadyForConsumer",
    );
    assert.equal(
      IntegrationPolicyGovernancePublicRelease.releaseDate,
      "EIL-5.0.0",
    );
  });

  it("declares Freeze aggregate as the sole phase dependency", () => {
    const { dependency } = IntegrationPolicyGovernancePublicIndexPlatform;
    assert.equal(dependency.freezeOnly, true);
    assert.equal(
      dependency.freezeId,
      IntegrationPolicyGovernanceFreezeIdentity.canonicalId,
    );
    assert.equal(
      dependency.directPreviousPhaseModule,
      "integrationPolicyGovernanceFreeze.ts",
    );
    assert.equal(
      IntegrationPolicyGovernancePublicIndexIdentity.freezeDependency,
      "EIL-5:8/IntegrationPolicyGovernanceFreeze",
    );
    assert.equal(
      IntegrationPolicyGovernancePublicIndexIdentity.freezeEntryPoint,
      "integrationPolicyGovernanceFreeze.ts",
    );
    assert.equal(dependency.freezeInternalImport, false);
    assert.equal(dependency.certificationDirectImport, false);
    assert.equal(dependency.platformDirectImport, false);
    assert.equal(dependency.previousEilPlatformDependency, false);
    assert.equal(dependency.laterEil5PhaseImport, false);
    assert.equal(
      IntegrationPolicyGovernancePublicIndexPlatform.freezePlatform,
      IntegrationPolicyGovernanceFreezePlatform,
    );
  });

  it("publishes exactly nine namespace sections in deterministic order", () => {
    assert.equal(
      IntegrationPolicyGovernancePublicNamespace.sections.length,
      9,
    );
    assert.equal(
      IntegrationPolicyGovernancePublicNamespace.sectionCount,
      IntegrationPolicyGovernancePublicNamespace.sections.length,
    );
    assert.deepEqual(
      IntegrationPolicyGovernancePublicNamespace.sections.map(
        (item) => item.section,
      ),
      [...EXPECTED_NAMESPACE_SECTIONS],
    );
    assertAscending(
      IntegrationPolicyGovernancePublicNamespace.sections.map(
        (item) => item.ordinal,
      ),
      "namespace",
    );
    assertUnique(
      IntegrationPolicyGovernancePublicNamespace.sections.map(
        (item) => item.sectionId,
      ),
      "namespace section IDs",
    );
    assert.equal(
      IntegrationPolicyGovernancePublicNamespace.sections[8]!.namespace,
      "nexora.eil.integration-policy-governance.public-index",
    );
  });

  it("publishes an immutable Public API Registry with exactly 76 entries", () => {
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernancePublicApiRegistry),
      true,
    );
    assert.equal(IntegrationPolicyGovernancePublicApiRegistry.length, 76);
    assert.equal(
      IntegrationPolicyGovernancePublicApiCount,
      IntegrationPolicyGovernancePublicApiRegistry.length,
    );
    assert.equal(
      IntegrationPolicyGovernancePublicInventory.publicApiCount,
      IntegrationPolicyGovernancePublicApiRegistry.length,
    );
    assert.equal(
      IntegrationPolicyGovernancePublicSummary.publicApiCount,
      IntegrationPolicyGovernancePublicApiRegistry.length,
    );
    assert.equal(
      IntegrationPolicyGovernancePublicMetadata.publicApiCount,
      IntegrationPolicyGovernancePublicApiRegistry.length,
    );

    for (const entry of IntegrationPolicyGovernancePublicApiRegistry) {
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
      IntegrationPolicyGovernancePublicApiRegistry.map(
        (item) => item.ordinal,
      ),
      "api registry",
    );
    assertUnique(
      IntegrationPolicyGovernancePublicApiRegistry.map((item) => item.apiId),
      "api IDs",
    );
    assertUnique(
      IntegrationPolicyGovernancePublicApiRegistry.map(
        (item) => `${item.sourcePhase}:${item.canonicalKey}`,
      ),
      "api keys",
    );

    const foundationApis = IntegrationPolicyGovernancePublicApiRegistry.filter(
      (item) => item.sourcePhase === "EIL-5:1",
    );
    assert.equal(foundationApis.length, 8);

    const publicIndexApis =
      IntegrationPolicyGovernancePublicApiRegistry.filter(
        (item) => item.sourcePhase === "EIL-5:9",
      );
    assert.equal(publicIndexApis.length, 12);
    assert.deepEqual(
      publicIndexApis.map((item) => item.exportName),
      [...REQUIRED_PUBLIC_EXPORTS],
    );
  });

  it("derives inventory from Freeze and Public Index collections", () => {
    assert.equal(
      IntegrationPolicyGovernancePublicInventory.namespaceSectionCount,
      IntegrationPolicyGovernancePublicNamespace.sections.length,
    );
    assert.equal(
      IntegrationPolicyGovernancePublicInventory.namespaceSectionCount,
      9,
    );
    assert.equal(
      IntegrationPolicyGovernancePublicInventory.publicExportCount,
      IntegrationPolicyGovernancePublicExports.length,
    );
    assert.equal(
      IntegrationPolicyGovernancePublicInventory.publicExportCount,
      12,
    );
    assert.equal(
      IntegrationPolicyGovernancePublicInventory.freezeInventoryTotal,
      39,
    );
    assert.equal(
      IntegrationPolicyGovernancePublicInventory.freezeTotalEntryCount,
      IntegrationPolicyGovernanceFreezePlatform.inventory
        .totalFreezeEntryCount,
    );
    assert.equal(
      IntegrationPolicyGovernancePublicInventory.freezeLockCount,
      IntegrationPolicyGovernanceFreezePlatform.inventory.lockCount,
    );
    assert.equal(
      IntegrationPolicyGovernancePublicInventory.freezeBaselineCount,
      IntegrationPolicyGovernanceFreezePlatform.inventory.baselineCount,
    );
    assert.equal(
      IntegrationPolicyGovernancePublicInventory.countsDerivedFromFreeze,
      true,
    );
    assert.equal(
      IntegrationPolicyGovernancePublicInventory.countsDerivedFromCollections,
      true,
    );
  });

  it("declares integrationPolicyGovernancePublicIndex.ts as the sole consumer entry", () => {
    assert.equal(
      IntegrationPolicyGovernanceConsumerEntry.entryPoint,
      "integrationPolicyGovernancePublicIndex.ts",
    );
    assert.equal(
      IntegrationPolicyGovernanceConsumerEntry.soleSupportedEntry,
      true,
    );
    assert.equal(
      IntegrationPolicyGovernanceConsumerEntry.directImportPolicy,
      "PublicIndexOnly",
    );
    assert.equal(
      IntegrationPolicyGovernancePublicMetadata.solePublicEntryPoint,
      "integrationPolicyGovernancePublicIndex.ts",
    );
    assert.equal(
      IntegrationPolicyGovernancePublicSummary.consumerEntry,
      "integrationPolicyGovernancePublicIndex.ts",
    );
    assert.equal(
      IntegrationPolicyGovernanceConsumerEntry.prohibitedDirectImports.length,
      8,
    );
  });

  it("is metadata-only with immutable public collections and zero runtime behavior", () => {
    const platform = IntegrationPolicyGovernancePublicIndexPlatform;
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernancePublicIndexIdentity),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernancePublicNamespace),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernancePublicNamespace.sections),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernancePublicRelease),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernancePublicInventory),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernancePublicSummary),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceConsumerEntry),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernancePublicExports),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernancePublicMetadata),
      true,
    );

    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.runtimePlatform, false);
    assert.equal(platform.governanceEngine, false);
    assert.equal(platform.policyEnforcement, false);
    assert.equal(platform.authorizationEngine, false);
    assert.equal(platform.complianceEngine, false);
    assert.equal(platform.orchestrationRuntime, false);
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
    assert.equal(platform.importsLaterEil5Phases, false);
  });

  it("has zero prohibited imports and Freeze as sole module dependency", () => {
    const source = readFileSync(
      new URL("integrationPolicyGovernancePublicIndex.ts", import.meta.url),
      "utf8",
    );
    for (const pattern of PROHIBITED_IMPORT_PATTERNS) {
      assert.doesNotMatch(
        source,
        pattern,
        `integrationPolicyGovernancePublicIndex.ts must not match ${pattern}`,
      );
    }
    assert.match(
      source,
      /from ["']\.\/integrationPolicyGovernanceFreeze\.ts["']/,
    );
    assert.doesNotMatch(source, /from ["']node:(net|http|https|dgram)["']/);
    assert.doesNotMatch(source, /\b(fetch|axios)\b/);
    assert.doesNotMatch(source, /\bclass\b/);
    assert.doesNotMatch(source, /\basync\s+function\b/);
    assert.equal(
      IntegrationPolicyGovernancePublicIndexPlatform.dependency
        .laterEil5PhaseImport,
      false,
    );
  });

  it("is ReadyForConsumer with stable released summary", () => {
    assert.equal(
      IntegrationPolicyGovernancePublicSummary.readiness,
      "ReadyForConsumer",
    );
    assert.equal(
      IntegrationPolicyGovernancePublicSummary.release,
      "Released",
    );
    assert.equal(
      IntegrationPolicyGovernancePublicSummary.certification,
      "Certified",
    );
    assert.equal(IntegrationPolicyGovernancePublicSummary.freeze, "Frozen");
    assert.equal(
      IntegrationPolicyGovernancePublicSummary.stability,
      "Stable",
    );
    assert.equal(
      IntegrationPolicyGovernancePublicSummary.namespaceSectionCount,
      9,
    );
    assert.equal(
      IntegrationPolicyGovernancePublicSummary.publicExportCount,
      12,
    );
    assert.equal(
      IntegrationPolicyGovernancePublicSummary.freezeInventoryTotal,
      39,
    );
    assert.equal(
      IntegrationPolicyGovernancePublicSummary.freezeId,
      "EIL-5:8/IntegrationPolicyGovernanceFreeze",
    );
    assert.equal(
      IntegrationPolicyGovernancePublicSummary.nextPhase,
      "EIL-5 Complete — ReadyForConsumer",
    );
    assert.equal(
      IntegrationPolicyGovernancePublicIndexPlatform.status,
      "Released",
    );
    assert.equal(
      IntegrationPolicyGovernancePublicIndexPlatform.readiness,
      "ReadyForConsumer",
    );
  });

  it("passes strict TypeScript and ESLint for public index sources", () => {
    const sources = ["app/lib/eil/integrationPolicyGovernancePublicIndex.ts"];

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
        "app/lib/eil/integrationPolicyGovernanceFreeze.ts",
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
