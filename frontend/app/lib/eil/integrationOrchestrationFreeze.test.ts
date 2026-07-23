/**
 * EIL-4:8 — Integration Orchestration Freeze Tests.
 *
 * Deterministic coverage for the immutable Integration Orchestration Freeze phase.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  IntegrationOrchestrationCertificationIdentity,
  IntegrationOrchestrationCertificationPlatform,
} from "./integrationOrchestrationCertification.ts";
import * as FreezeModule from "./integrationOrchestrationFreeze.ts";
import {
  IntegrationOrchestrationFreezeBaselines,
  IntegrationOrchestrationFreezeCollections,
  IntegrationOrchestrationFreezeCompatibility,
  IntegrationOrchestrationFreezeExtensions,
  IntegrationOrchestrationFreezeIdentity,
  IntegrationOrchestrationFreezeLocks,
  IntegrationOrchestrationFreezePlatform,
  IntegrationOrchestrationFreezeSummary,
} from "./integrationOrchestrationFreeze.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../..");

const EIL48_FILES = Object.freeze([
  "integrationOrchestrationFreezeTypes.ts",
  "integrationOrchestrationFreezeIdentity.ts",
  "integrationOrchestrationFreezeLocks.ts",
  "integrationOrchestrationFreezeBaselines.ts",
  "integrationOrchestrationFreezeCompatibility.ts",
  "integrationOrchestrationFreezeExtensions.ts",
  "integrationOrchestrationFreeze.ts",
  "integrationOrchestrationFreeze.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationOrchestrationFreezeIdentity",
  "IntegrationOrchestrationFreezeLocks",
  "IntegrationOrchestrationFreezeBaselines",
  "IntegrationOrchestrationFreezeCompatibility",
  "IntegrationOrchestrationFreezeExtensions",
  "IntegrationOrchestrationFreezeCollections",
  "IntegrationOrchestrationFreezeSummary",
  "IntegrationOrchestrationFreezePlatform",
] as const);

const EXPECTED_BASELINES = Object.freeze([
  "EIL-4:1",
  "EIL-4:2",
  "EIL-4:3",
  "EIL-4:4",
  "EIL-4:5",
  "EIL-4:6",
  "EIL-4:7",
  "EIL-4:8",
] as const);

const EXPECTED_ARCHITECTURAL_LOCKS = Object.freeze([
  "Identity",
  "Namespace",
  "Version",
  "Dependency",
  "Inventory",
  "Compatibility",
  "Platform",
  "Certification",
  "Metadata",
  "PublicSurface",
  "DeterministicOrdering",
  "Readiness",
] as const);

const EXPECTED_COMPATIBILITY = Object.freeze([
  "Foundation",
  "Registry",
  "Model",
  "Validation",
  "Manifest",
  "Platform",
  "Certification",
  "Forward",
  "Namespace",
  "Version",
] as const);

const EXPECTED_EXTENSIONS = Object.freeze([
  "PublicIndexExtensionOnly",
  "NoFrozenMetadataMutation",
  "AdditiveEvolutionOnly",
  "BackwardCompatibilityPreservation",
  "CanonicalIdentityPreservation",
  "NamespacePreservation",
  "DependencyPreservation",
  "InventoryPreservation",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\/integrationOrchestrationCertification(?!\.ts["'])/,
  /from ["']\.\/integrationOrchestration(Certification|Platform|Manifest|Validation|Model|Registry|Foundation)(Types|Identity|Criteria|Gates|Readiness|Composition|Inventory|Guarantees|Compatibility|ArchitectureManifest|InventoryManifest|DependencyManifest|CompatibilityManifest|Rules|Categories|Findings|DomainModels|RelationshipModels|TopologyModels|LifecycleModels|CategoryRegistry|ContractRegistry|CapabilityRegistry|ResponsibilityRegistry|Contracts|Capabilities|Responsibilities|Lifecycle|ComplianceDeclarations)\.ts["']/,
  /from ["']\.\/integrationOrchestration(Platform|Manifest|Validation|Model|Registry|Foundation)\.ts["']/,
  /from ["']\.\/integration(?!Orchestration)/,
  /from ["']\.\/integrationConnector/,
  /from ["']\.\/integrationRouting/,
  /from ["']\.\/integrationOrchestrationPublicIndex/,
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

describe("EIL-4:8 Integration Orchestration Freeze", () => {
  it("creates exactly eight Freeze files and eight public exports", () => {
    assert.equal(EIL48_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL48_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(FreezeModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(FreezeModule).length, 8);
  });

  it("has canonical identity, namespace, version, Frozen status, and ReadyForPublicIndex", () => {
    assert.equal(IntegrationOrchestrationFreezeIdentity.phaseId, "EIL-4:8");
    assert.equal(
      IntegrationOrchestrationFreezeIdentity.canonicalId,
      "EIL-4:8/IntegrationOrchestrationFreeze",
    );
    assert.equal(
      IntegrationOrchestrationFreezeIdentity.name,
      "Integration Orchestration Freeze",
    );
    assert.equal(IntegrationOrchestrationFreezeIdentity.version, "1.0.0");
    assert.equal(
      IntegrationOrchestrationFreezeIdentity.namespace,
      "nexora.eil.integration-orchestration.freeze",
    );
    assert.equal(IntegrationOrchestrationFreezeIdentity.layer, "EIL");
    assert.equal(IntegrationOrchestrationFreezeIdentity.platform, "EIL-4");
    assert.equal(IntegrationOrchestrationFreezeIdentity.phaseType, "Freeze");
    assert.equal(IntegrationOrchestrationFreezeIdentity.status, "Frozen");
    assert.equal(
      IntegrationOrchestrationFreezeIdentity.readiness,
      "ReadyForPublicIndex",
    );
    assert.equal(IntegrationOrchestrationFreezePlatform.status, "Frozen");
    assert.equal(
      IntegrationOrchestrationFreezePlatform.readiness,
      "ReadyForPublicIndex",
    );
    assert.equal(
      IntegrationOrchestrationFreezePlatform.nextPhase,
      "EIL-4:9 — Integration Orchestration Public Index",
    );
  });

  it("declares Certification aggregate as the sole phase dependency", () => {
    const { dependency } = IntegrationOrchestrationFreezePlatform;
    assert.equal(dependency.phaseDependencyCount, 1);
    assert.equal(dependency.certificationOnly, true);
    assert.equal(
      dependency.certificationId,
      IntegrationOrchestrationCertificationIdentity.canonicalId,
    );
    assert.equal(
      dependency.directPreviousPhaseModule,
      "integrationOrchestrationCertification.ts",
    );
    assert.equal(
      IntegrationOrchestrationFreezeIdentity.certificationDependency,
      "EIL-4:7/IntegrationOrchestrationCertification",
    );
    assert.equal(
      IntegrationOrchestrationFreezeIdentity.certificationEntryPoint,
      "integrationOrchestrationCertification.ts",
    );
    assert.equal(dependency.certificationInternalImport, false);
    assert.equal(dependency.platformDirectImport, false);
    assert.equal(dependency.manifestDirectImport, false);
    assert.equal(dependency.validationDirectImport, false);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.previousEilPlatformDependency, false);
    assert.equal(dependency.laterEil4PhaseImport, false);
    assert.equal(
      IntegrationOrchestrationFreezePlatform.certificationPlatform,
      IntegrationOrchestrationCertificationPlatform,
    );
  });

  it("publishes exactly thirteen locks including the canonical platform lock", () => {
    assert.equal(IntegrationOrchestrationFreezeLocks.length, 13);
    assert.equal(
      IntegrationOrchestrationFreezeLocks[0]?.canonicalKey,
      "EIL-4-INTEGRATION-ORCHESTRATION-LOCKED",
    );
    assert.equal(
      IntegrationOrchestrationFreezeLocks[0]?.isCanonicalPlatformLock,
      true,
    );
    assert.deepEqual(
      IntegrationOrchestrationFreezeLocks.slice(1).map(
        (item) => item.canonicalKey,
      ),
      [...EXPECTED_ARCHITECTURAL_LOCKS],
    );
    assertUnique(
      IntegrationOrchestrationFreezeLocks.map((item) => item.lockId),
      "lock IDs",
    );
    assertAscending(
      IntegrationOrchestrationFreezeLocks.map((item) => item.ordinal),
      "lock",
    );
    assert.ok(
      IntegrationOrchestrationFreezeLocks.every(
        (item) => item.runtimeEnforced === false && item.metadataOnly === true,
      ),
    );
    assert.equal(
      IntegrationOrchestrationFreezePlatform.canonicalPlatformLock.canonicalKey,
      "EIL-4-INTEGRATION-ORCHESTRATION-LOCKED",
    );
    assert.equal(
      IntegrationOrchestrationFreezeSummary.canonicalPlatformLockKey,
      "EIL-4-INTEGRATION-ORCHESTRATION-LOCKED",
    );
  });

  it("publishes eight baselines, ten compatibility scopes, and eight extensions", () => {
    assert.equal(IntegrationOrchestrationFreezeBaselines.length, 8);
    assert.deepEqual(
      IntegrationOrchestrationFreezeBaselines.map((item) => item.sourcePhase),
      [...EXPECTED_BASELINES],
    );
    assertAscending(
      IntegrationOrchestrationFreezeBaselines.map((item) => item.ordinal),
      "baseline",
    );

    assert.equal(IntegrationOrchestrationFreezeCompatibility.length, 10);
    assert.deepEqual(
      IntegrationOrchestrationFreezeCompatibility.map((item) => item.scope),
      [...EXPECTED_COMPATIBILITY],
    );
    assertAscending(
      IntegrationOrchestrationFreezeCompatibility.map((item) => item.ordinal),
      "compatibility",
    );

    assert.equal(IntegrationOrchestrationFreezeExtensions.length, 8);
    assert.deepEqual(
      IntegrationOrchestrationFreezeExtensions.map((item) => item.canonicalKey),
      [...EXPECTED_EXTENSIONS],
    );
    assertAscending(
      IntegrationOrchestrationFreezeExtensions.map((item) => item.ordinal),
      "extension",
    );
  });

  it("derives inventory dynamically as 39 and freezes all collections", () => {
    const { collections, inventory } = IntegrationOrchestrationFreezePlatform;
    assert.equal(collections.lockCount, collections.locks.length);
    assert.equal(collections.baselineCount, collections.baselines.length);
    assert.equal(
      collections.compatibilityCount,
      collections.compatibility.length,
    );
    assert.equal(collections.extensionCount, collections.extensions.length);
    assert.equal(collections.lockCount, 13);
    assert.equal(collections.baselineCount, 8);
    assert.equal(collections.compatibilityCount, 10);
    assert.equal(collections.extensionCount, 8);
    assert.equal(collections.totalFreezeEntryCount, 39);

    assert.equal(inventory.lockCount, collections.lockCount);
    assert.equal(inventory.baselineCount, collections.baselineCount);
    assert.equal(inventory.compatibilityCount, collections.compatibilityCount);
    assert.equal(inventory.extensionCount, collections.extensionCount);
    assert.equal(inventory.canonicalPlatformLockCount, 1);
    assert.equal(inventory.totalFreezeEntryCount, 39);
    assert.equal(inventory.countsDerivedFromCollections, true);
    assert.equal(IntegrationOrchestrationFreezeCollections.lockCount, 13);

    assert.equal(IntegrationOrchestrationFreezeSummary.lockCount, 13);
    assert.equal(IntegrationOrchestrationFreezeSummary.baselineCount, 8);
    assert.equal(IntegrationOrchestrationFreezeSummary.compatibilityCount, 10);
    assert.equal(IntegrationOrchestrationFreezeSummary.extensionCount, 8);
    assert.equal(
      IntegrationOrchestrationFreezeSummary.totalFreezeEntryCount,
      39,
    );
    assert.equal(IntegrationOrchestrationFreezeSummary.status, "Frozen");
    assert.equal(
      IntegrationOrchestrationFreezeSummary.readiness,
      "ReadyForPublicIndex",
    );

    assert.equal(Object.isFrozen(IntegrationOrchestrationFreezeIdentity), true);
    assert.equal(Object.isFrozen(IntegrationOrchestrationFreezeLocks), true);
    assert.equal(
      Object.isFrozen(IntegrationOrchestrationFreezeBaselines),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationOrchestrationFreezeCompatibility),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationOrchestrationFreezeExtensions),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationOrchestrationFreezeCollections),
      true,
    );
    assert.equal(Object.isFrozen(IntegrationOrchestrationFreezeSummary), true);
    assert.equal(Object.isFrozen(IntegrationOrchestrationFreezePlatform), true);
  });

  it("is metadata-only with zero runtime freeze behavior", () => {
    const platform = IntegrationOrchestrationFreezePlatform;
    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.runtimeEnforcement, false);
    assert.equal(platform.runtimeFreeze, false);
    assert.equal(platform.lockEnforcement, false);
    assert.equal(platform.certificationExecution, false);
    assert.equal(platform.orchestrationEngine, false);
    assert.equal(platform.workflowExecution, false);
    assert.equal(platform.routingExecution, false);
    assert.equal(platform.schedulingBehavior, false);
    assert.equal(platform.networkingBehavior, false);
    assert.equal(platform.restBehavior, false);
    assert.equal(platform.graphqlBehavior, false);
    assert.equal(platform.websocketBehavior, false);
    assert.equal(platform.queueBehavior, false);
    assert.equal(platform.connectorExecution, false);
    assert.equal(platform.adapterBehavior, false);
    assert.equal(platform.sdkRuntime, false);
    assert.equal(platform.persistenceBehavior, false);
    assert.equal(platform.aiBehavior, false);
    assert.equal(platform.uiBehavior, false);
    assert.equal(platform.stateMutation, false);
    assert.equal(platform.importsLaterEil4Phases, false);
  });

  it("has zero prohibited imports across freeze sources", () => {
    const sources = EIL48_FILES.filter((name) => !name.endsWith(".test.ts"));
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

  it("passes strict TypeScript and ESLint for freeze sources", () => {
    const sources = EIL48_FILES.filter((name) => !name.endsWith(".test.ts")).map(
      (name) => join("app/lib/eil", name),
    );

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
        "app/lib/eil/integrationOrchestrationCertification.ts",
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
