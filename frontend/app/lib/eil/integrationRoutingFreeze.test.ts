/**
 * EIL-3:8 — Integration Routing Freeze Tests.
 *
 * Deterministic coverage for the immutable Integration Routing Freeze phase.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  IntegrationRoutingCertificationIdentity,
  IntegrationRoutingCertificationPlatform,
} from "./integrationRoutingCertification.ts";
import * as FreezeModule from "./integrationRoutingFreeze.ts";
import {
  IntegrationRoutingFreezeBaselines,
  IntegrationRoutingFreezeCollections,
  IntegrationRoutingFreezeCompatibility,
  IntegrationRoutingFreezeExtensions,
  IntegrationRoutingFreezeIdentity,
  IntegrationRoutingFreezeLocks,
  IntegrationRoutingFreezePlatform,
  IntegrationRoutingFreezeSummary,
} from "./integrationRoutingFreeze.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../..");

const EIL38_FILES = Object.freeze([
  "integrationRoutingFreezeTypes.ts",
  "integrationRoutingFreezeIdentity.ts",
  "integrationRoutingFreezeLocks.ts",
  "integrationRoutingFreezeBaselines.ts",
  "integrationRoutingFreezeCompatibility.ts",
  "integrationRoutingFreezeExtensions.ts",
  "integrationRoutingFreeze.ts",
  "integrationRoutingFreeze.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationRoutingFreezeIdentity",
  "IntegrationRoutingFreezeLocks",
  "IntegrationRoutingFreezeBaselines",
  "IntegrationRoutingFreezeCompatibility",
  "IntegrationRoutingFreezeExtensions",
  "IntegrationRoutingFreezeCollections",
  "IntegrationRoutingFreezeSummary",
  "IntegrationRoutingFreezePlatform",
] as const);

const EXPECTED_BASELINES = Object.freeze([
  "EIL-3:1",
  "EIL-3:2",
  "EIL-3:3",
  "EIL-3:4",
  "EIL-3:5",
  "EIL-3:6",
  "EIL-3:7",
  "EIL-3:8",
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
  /from ["']\.\/integrationRoutingCertification(?!\.ts["'])/,
  /from ["']\.\/integrationRouting(Certification|Platform|Manifest|Validation|Model|Registry|Foundation)(Types|Identity|Criteria|Gates|Readiness|Composition|Inventory|Guarantees|Compatibility|ArchitectureManifest|InventoryManifest|DependencyManifest|CompatibilityManifest|Rules|Categories|Findings|DomainModels|RelationshipModels|TopologyModels|LifecycleModels|CategoryRegistry|ContractRegistry|CapabilityRegistry|ResponsibilityRegistry|Contracts|Capabilities|Responsibilities|Lifecycle|ComplianceDeclarations)\.ts["']/,
  /from ["']\.\/integrationRouting(Platform|Manifest|Validation|Model|Registry|Foundation)\.ts["']/,
  /from ["']\.\/integration(?!Routing)/,
  /from ["']\.\/integrationConnector/,
  /from ["']\.\/integrationRoutingPublicIndex/,
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

describe("EIL-3:8 Integration Routing Freeze", () => {
  it("creates exactly eight Freeze files and eight public exports", () => {
    assert.equal(EIL38_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL38_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(FreezeModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(FreezeModule).length, 8);
  });

  it("has canonical identity, namespace, version, Frozen status, and ReadyForPublicIndex", () => {
    assert.equal(IntegrationRoutingFreezeIdentity.phaseId, "EIL-3:8");
    assert.equal(
      IntegrationRoutingFreezeIdentity.canonicalId,
      "EIL-3:8/IntegrationRoutingFreeze",
    );
    assert.equal(
      IntegrationRoutingFreezeIdentity.name,
      "Integration Routing Freeze",
    );
    assert.equal(IntegrationRoutingFreezeIdentity.version, "1.0.0");
    assert.equal(
      IntegrationRoutingFreezeIdentity.namespace,
      "nexora.eil.integration-routing.freeze",
    );
    assert.equal(IntegrationRoutingFreezeIdentity.layer, "EIL");
    assert.equal(IntegrationRoutingFreezeIdentity.platform, "EIL-3");
    assert.equal(IntegrationRoutingFreezeIdentity.phaseType, "Freeze");
    assert.equal(IntegrationRoutingFreezeIdentity.status, "Frozen");
    assert.equal(
      IntegrationRoutingFreezeIdentity.readiness,
      "ReadyForPublicIndex",
    );
    assert.equal(IntegrationRoutingFreezePlatform.status, "Frozen");
    assert.equal(
      IntegrationRoutingFreezePlatform.readiness,
      "ReadyForPublicIndex",
    );
    assert.equal(
      IntegrationRoutingFreezePlatform.nextPhase,
      "EIL-3:9 — Integration Routing Public Index",
    );
  });

  it("declares Certification aggregate as the sole phase dependency", () => {
    const { dependency } = IntegrationRoutingFreezePlatform;
    assert.equal(dependency.phaseDependencyCount, 1);
    assert.equal(dependency.certificationOnly, true);
    assert.equal(
      dependency.certificationId,
      IntegrationRoutingCertificationIdentity.canonicalId,
    );
    assert.equal(
      dependency.directPreviousPhaseModule,
      "integrationRoutingCertification.ts",
    );
    assert.equal(
      IntegrationRoutingFreezeIdentity.certificationDependency,
      "EIL-3:7/IntegrationRoutingCertification",
    );
    assert.equal(
      IntegrationRoutingFreezeIdentity.certificationEntryPoint,
      "integrationRoutingCertification.ts",
    );
    assert.equal(dependency.certificationInternalImport, false);
    assert.equal(dependency.platformDirectImport, false);
    assert.equal(dependency.manifestDirectImport, false);
    assert.equal(dependency.validationDirectImport, false);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.previousEilPlatformDependency, false);
    assert.equal(dependency.laterEil3PhaseImport, false);
    assert.equal(
      IntegrationRoutingFreezePlatform.certificationPlatform,
      IntegrationRoutingCertificationPlatform,
    );
  });

  it("publishes exactly thirteen locks including the canonical platform lock", () => {
    assert.equal(IntegrationRoutingFreezeLocks.length, 13);
    assert.equal(
      IntegrationRoutingFreezeLocks[0]?.canonicalKey,
      "EIL-3-INTEGRATION-ROUTING-LOCKED",
    );
    assert.equal(IntegrationRoutingFreezeLocks[0]?.isCanonicalPlatformLock, true);
    assert.deepEqual(
      IntegrationRoutingFreezeLocks.slice(1).map((item) => item.canonicalKey),
      [...EXPECTED_ARCHITECTURAL_LOCKS],
    );
    assertUnique(
      IntegrationRoutingFreezeLocks.map((item) => item.lockId),
      "lock IDs",
    );
    assertAscending(
      IntegrationRoutingFreezeLocks.map((item) => item.ordinal),
      "lock",
    );
    assert.ok(
      IntegrationRoutingFreezeLocks.every(
        (item) => item.runtimeEnforced === false && item.metadataOnly === true,
      ),
    );
    assert.equal(
      IntegrationRoutingFreezePlatform.canonicalPlatformLock.canonicalKey,
      "EIL-3-INTEGRATION-ROUTING-LOCKED",
    );
    assert.equal(
      IntegrationRoutingFreezeSummary.canonicalPlatformLockKey,
      "EIL-3-INTEGRATION-ROUTING-LOCKED",
    );
  });

  it("publishes eight baselines, ten compatibility scopes, and eight extensions", () => {
    assert.equal(IntegrationRoutingFreezeBaselines.length, 8);
    assert.deepEqual(
      IntegrationRoutingFreezeBaselines.map((item) => item.sourcePhase),
      [...EXPECTED_BASELINES],
    );
    assertAscending(
      IntegrationRoutingFreezeBaselines.map((item) => item.ordinal),
      "baseline",
    );

    assert.equal(IntegrationRoutingFreezeCompatibility.length, 10);
    assert.deepEqual(
      IntegrationRoutingFreezeCompatibility.map((item) => item.scope),
      [...EXPECTED_COMPATIBILITY],
    );
    assertAscending(
      IntegrationRoutingFreezeCompatibility.map((item) => item.ordinal),
      "compatibility",
    );

    assert.equal(IntegrationRoutingFreezeExtensions.length, 8);
    assert.deepEqual(
      IntegrationRoutingFreezeExtensions.map((item) => item.canonicalKey),
      [...EXPECTED_EXTENSIONS],
    );
    assertAscending(
      IntegrationRoutingFreezeExtensions.map((item) => item.ordinal),
      "extension",
    );
  });

  it("derives inventory dynamically and freezes all collections", () => {
    const { collections, inventory } = IntegrationRoutingFreezePlatform;
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
    assert.equal(inventory.countsDerivedFromCollections, true);
    assert.equal(IntegrationRoutingFreezeCollections.lockCount, 13);

    assert.equal(IntegrationRoutingFreezeSummary.lockCount, 13);
    assert.equal(IntegrationRoutingFreezeSummary.baselineCount, 8);
    assert.equal(IntegrationRoutingFreezeSummary.compatibilityCount, 10);
    assert.equal(IntegrationRoutingFreezeSummary.extensionCount, 8);
    assert.equal(IntegrationRoutingFreezeSummary.status, "Frozen");
    assert.equal(
      IntegrationRoutingFreezeSummary.readiness,
      "ReadyForPublicIndex",
    );

    assert.equal(Object.isFrozen(IntegrationRoutingFreezeIdentity), true);
    assert.equal(Object.isFrozen(IntegrationRoutingFreezeLocks), true);
    assert.equal(Object.isFrozen(IntegrationRoutingFreezeBaselines), true);
    assert.equal(Object.isFrozen(IntegrationRoutingFreezeCompatibility), true);
    assert.equal(Object.isFrozen(IntegrationRoutingFreezeExtensions), true);
    assert.equal(Object.isFrozen(IntegrationRoutingFreezeCollections), true);
    assert.equal(Object.isFrozen(IntegrationRoutingFreezeSummary), true);
    assert.equal(Object.isFrozen(IntegrationRoutingFreezePlatform), true);
  });

  it("is metadata-only with zero runtime freeze behavior", () => {
    const platform = IntegrationRoutingFreezePlatform;
    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.runtimeEnforcement, false);
    assert.equal(platform.runtimeFreeze, false);
    assert.equal(platform.lockEnforcement, false);
    assert.equal(platform.certificationExecution, false);
    assert.equal(platform.routingEngine, false);
    assert.equal(platform.messageExecution, false);
    assert.equal(platform.orchestrationBehavior, false);
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
    assert.equal(platform.importsLaterEil3Phases, false);
  });

  it("has zero prohibited imports across freeze sources", () => {
    const sources = EIL38_FILES.filter((name) => !name.endsWith(".test.ts"));
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
    const sources = EIL38_FILES.filter((name) => !name.endsWith(".test.ts")).map(
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
        "app/lib/eil/integrationRoutingCertification.ts",
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
