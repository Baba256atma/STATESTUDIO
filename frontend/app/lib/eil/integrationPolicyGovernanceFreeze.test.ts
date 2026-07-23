/**
 * EIL-5:8 — Integration Policy & Governance Freeze Tests.
 *
 * Deterministic coverage for the immutable Integration Policy & Governance Freeze phase.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  IntegrationPolicyGovernanceCertificationIdentity,
  IntegrationPolicyGovernanceCertificationPlatform,
} from "./integrationPolicyGovernanceCertification.ts";
import * as FreezeModule from "./integrationPolicyGovernanceFreeze.ts";
import {
  IntegrationPolicyGovernanceFreezeBaselines,
  IntegrationPolicyGovernanceFreezeCollections,
  IntegrationPolicyGovernanceFreezeCompatibility,
  IntegrationPolicyGovernanceFreezeExtensions,
  IntegrationPolicyGovernanceFreezeIdentity,
  IntegrationPolicyGovernanceFreezeLocks,
  IntegrationPolicyGovernanceFreezePlatform,
  IntegrationPolicyGovernanceFreezeSummary,
} from "./integrationPolicyGovernanceFreeze.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../..");

const EIL58_FILES = Object.freeze([
  "integrationPolicyGovernanceFreezeTypes.ts",
  "integrationPolicyGovernanceFreezeIdentity.ts",
  "integrationPolicyGovernanceFreezeLocks.ts",
  "integrationPolicyGovernanceFreezeBaselines.ts",
  "integrationPolicyGovernanceFreezeCompatibility.ts",
  "integrationPolicyGovernanceFreezeExtensions.ts",
  "integrationPolicyGovernanceFreeze.ts",
  "integrationPolicyGovernanceFreeze.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationPolicyGovernanceFreezeIdentity",
  "IntegrationPolicyGovernanceFreezeLocks",
  "IntegrationPolicyGovernanceFreezeBaselines",
  "IntegrationPolicyGovernanceFreezeCompatibility",
  "IntegrationPolicyGovernanceFreezeExtensions",
  "IntegrationPolicyGovernanceFreezeCollections",
  "IntegrationPolicyGovernanceFreezeSummary",
  "IntegrationPolicyGovernanceFreezePlatform",
] as const);

const EXPECTED_BASELINES = Object.freeze([
  "EIL-5:1",
  "EIL-5:2",
  "EIL-5:3",
  "EIL-5:4",
  "EIL-5:5",
  "EIL-5:6",
  "EIL-5:7",
  "EIL-5:8",
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
  /from ["']\.\/integrationPolicyGovernanceCertification(?!\.ts["'])/,
  /from ["']\.\/integrationPolicyGovernance(Certification|Platform|Manifest|Validation|Model|Registry|Foundation)(Types|Identity|Criteria|Gates|Readiness|Composition|Inventory|Guarantees|Compatibility|ArchitectureManifest|InventoryManifest|DependencyManifest|CompatibilityManifest|Rules|Categories|Findings|DomainModels|RelationshipModels|TopologyModels|LifecycleModels|CategoryRegistry|ContractRegistry|CapabilityRegistry|ResponsibilityRegistry|Contracts|Capabilities|Responsibilities|Lifecycle|ComplianceDeclarations)\.ts["']/,
  /from ["']\.\/integrationPolicyGovernance(Platform|Manifest|Validation|Model|Registry|Foundation)\.ts["']/,
  /from ["']\.\/integration(?!PolicyGovernance)/,
  /from ["']\.\/integrationConnector/,
  /from ["']\.\/integrationRouting/,
  /from ["']\.\/integrationOrchestration/,
  /from ["']\.\/integrationPolicyGovernancePublicIndex/,
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

describe("EIL-5:8 Integration Policy & Governance Freeze", () => {
  it("creates exactly eight Freeze files and eight public exports", () => {
    assert.equal(EIL58_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL58_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(FreezeModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(FreezeModule).length, 8);
  });

  it("has canonical identity, namespace, version, Frozen status, and ReadyForPublicIndex", () => {
    assert.equal(
      IntegrationPolicyGovernanceFreezeIdentity.phaseId,
      "EIL-5:8",
    );
    assert.equal(
      IntegrationPolicyGovernanceFreezeIdentity.canonicalId,
      "EIL-5:8/IntegrationPolicyGovernanceFreeze",
    );
    assert.equal(
      IntegrationPolicyGovernanceFreezeIdentity.name,
      "Integration Policy & Governance Freeze",
    );
    assert.equal(
      IntegrationPolicyGovernanceFreezeIdentity.version,
      "1.0.0",
    );
    assert.equal(
      IntegrationPolicyGovernanceFreezeIdentity.namespace,
      "nexora.eil.integration-policy-governance.freeze",
    );
    assert.equal(IntegrationPolicyGovernanceFreezeIdentity.layer, "EIL");
    assert.equal(
      IntegrationPolicyGovernanceFreezeIdentity.platform,
      "EIL-5",
    );
    assert.equal(
      IntegrationPolicyGovernanceFreezeIdentity.phaseType,
      "Freeze",
    );
    assert.equal(
      IntegrationPolicyGovernanceFreezeIdentity.status,
      "Frozen",
    );
    assert.equal(
      IntegrationPolicyGovernanceFreezeIdentity.readiness,
      "ReadyForPublicIndex",
    );
    assert.equal(IntegrationPolicyGovernanceFreezePlatform.status, "Frozen");
    assert.equal(
      IntegrationPolicyGovernanceFreezePlatform.readiness,
      "ReadyForPublicIndex",
    );
    assert.equal(
      IntegrationPolicyGovernanceFreezePlatform.nextPhase,
      "EIL-5:9 — Integration Policy & Governance Public Index",
    );
  });

  it("declares Certification aggregate as the sole phase dependency", () => {
    const { dependency } = IntegrationPolicyGovernanceFreezePlatform;
    assert.equal(dependency.phaseDependencyCount, 1);
    assert.equal(dependency.certificationOnly, true);
    assert.equal(
      dependency.certificationId,
      IntegrationPolicyGovernanceCertificationIdentity.canonicalId,
    );
    assert.equal(
      dependency.directPreviousPhaseModule,
      "integrationPolicyGovernanceCertification.ts",
    );
    assert.equal(
      IntegrationPolicyGovernanceFreezeIdentity.certificationDependency,
      "EIL-5:7/IntegrationPolicyGovernanceCertification",
    );
    assert.equal(
      IntegrationPolicyGovernanceFreezeIdentity.certificationEntryPoint,
      "integrationPolicyGovernanceCertification.ts",
    );
    assert.equal(dependency.certificationInternalImport, false);
    assert.equal(dependency.platformDirectImport, false);
    assert.equal(dependency.manifestDirectImport, false);
    assert.equal(dependency.validationDirectImport, false);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.previousEilPlatformDependency, false);
    assert.equal(dependency.laterEil5PhaseImport, false);
    assert.equal(
      IntegrationPolicyGovernanceFreezePlatform.certificationPlatform,
      IntegrationPolicyGovernanceCertificationPlatform,
    );
  });

  it("publishes exactly thirteen locks including the canonical platform lock", () => {
    assert.equal(IntegrationPolicyGovernanceFreezeLocks.length, 13);
    assert.equal(
      IntegrationPolicyGovernanceFreezeLocks[0]?.canonicalKey,
      "EIL-5-INTEGRATION-POLICY-GOVERNANCE-LOCKED",
    );
    assert.equal(
      IntegrationPolicyGovernanceFreezeLocks[0]?.isCanonicalPlatformLock,
      true,
    );
    assert.deepEqual(
      IntegrationPolicyGovernanceFreezeLocks.slice(1).map(
        (item) => item.canonicalKey,
      ),
      [...EXPECTED_ARCHITECTURAL_LOCKS],
    );
    assertUnique(
      IntegrationPolicyGovernanceFreezeLocks.map((item) => item.lockId),
      "lock IDs",
    );
    assertAscending(
      IntegrationPolicyGovernanceFreezeLocks.map((item) => item.ordinal),
      "lock",
    );
    assert.ok(
      IntegrationPolicyGovernanceFreezeLocks.every(
        (item) => item.runtimeEnforced === false && item.metadataOnly === true,
      ),
    );
    assert.equal(
      IntegrationPolicyGovernanceFreezePlatform.canonicalPlatformLock
        .canonicalKey,
      "EIL-5-INTEGRATION-POLICY-GOVERNANCE-LOCKED",
    );
    assert.equal(
      IntegrationPolicyGovernanceFreezeSummary.canonicalPlatformLockKey,
      "EIL-5-INTEGRATION-POLICY-GOVERNANCE-LOCKED",
    );
  });

  it("publishes eight baselines, ten compatibility scopes, and eight extensions", () => {
    assert.equal(IntegrationPolicyGovernanceFreezeBaselines.length, 8);
    assert.deepEqual(
      IntegrationPolicyGovernanceFreezeBaselines.map(
        (item) => item.sourcePhase,
      ),
      [...EXPECTED_BASELINES],
    );
    assertAscending(
      IntegrationPolicyGovernanceFreezeBaselines.map((item) => item.ordinal),
      "baseline",
    );

    assert.equal(
      IntegrationPolicyGovernanceFreezeCompatibility.length,
      10,
    );
    assert.deepEqual(
      IntegrationPolicyGovernanceFreezeCompatibility.map(
        (item) => item.scope,
      ),
      [...EXPECTED_COMPATIBILITY],
    );
    assertAscending(
      IntegrationPolicyGovernanceFreezeCompatibility.map(
        (item) => item.ordinal,
      ),
      "compatibility",
    );

    assert.equal(IntegrationPolicyGovernanceFreezeExtensions.length, 8);
    assert.deepEqual(
      IntegrationPolicyGovernanceFreezeExtensions.map(
        (item) => item.canonicalKey,
      ),
      [...EXPECTED_EXTENSIONS],
    );
    assertAscending(
      IntegrationPolicyGovernanceFreezeExtensions.map(
        (item) => item.ordinal,
      ),
      "extension",
    );
  });

  it("derives inventory dynamically as 39 and freezes all collections", () => {
    const { collections, inventory } =
      IntegrationPolicyGovernanceFreezePlatform;
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
    assert.equal(IntegrationPolicyGovernanceFreezeCollections.lockCount, 13);

    assert.equal(IntegrationPolicyGovernanceFreezeSummary.lockCount, 13);
    assert.equal(IntegrationPolicyGovernanceFreezeSummary.baselineCount, 8);
    assert.equal(
      IntegrationPolicyGovernanceFreezeSummary.compatibilityCount,
      10,
    );
    assert.equal(IntegrationPolicyGovernanceFreezeSummary.extensionCount, 8);
    assert.equal(
      IntegrationPolicyGovernanceFreezeSummary.totalFreezeEntryCount,
      39,
    );
    assert.equal(IntegrationPolicyGovernanceFreezeSummary.status, "Frozen");
    assert.equal(
      IntegrationPolicyGovernanceFreezeSummary.readiness,
      "ReadyForPublicIndex",
    );

    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceFreezeIdentity),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceFreezeLocks),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceFreezeBaselines),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceFreezeCompatibility),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceFreezeExtensions),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceFreezeCollections),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceFreezeSummary),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceFreezePlatform),
      true,
    );
  });

  it("is metadata-only with zero runtime freeze behavior", () => {
    const platform = IntegrationPolicyGovernanceFreezePlatform;
    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.runtimeEnforcement, false);
    assert.equal(platform.runtimeFreeze, false);
    assert.equal(platform.lockEnforcement, false);
    assert.equal(platform.certificationExecution, false);
    assert.equal(platform.governanceEngine, false);
    assert.equal(platform.policyEnforcement, false);
    assert.equal(platform.authorizationEngine, false);
    assert.equal(platform.complianceEngine, false);
    assert.equal(platform.orchestrationRuntime, false);
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
    assert.equal(platform.importsLaterEil5Phases, false);
  });

  it("has zero prohibited imports across freeze sources", () => {
    const sources = EIL58_FILES.filter((name) => !name.endsWith(".test.ts"));
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
    const sources = EIL58_FILES.filter((name) => !name.endsWith(".test.ts")).map(
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
        "app/lib/eil/integrationPolicyGovernanceCertification.ts",
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
