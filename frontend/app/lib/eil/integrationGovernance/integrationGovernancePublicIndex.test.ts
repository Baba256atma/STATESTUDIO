/**
 * EIL-7:9 — Integration Governance Public Index Tests.
 *
 * Deterministic coverage for the immutable Integration Governance Public Index.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  IntegrationGovernanceFreeze,
  IntegrationGovernanceFreezeIdentity,
  IntegrationGovernanceFreezeLockId,
} from "./integrationGovernanceFreeze.ts";
import * as PublicIndexModule from "./integrationGovernancePublicIndex.ts";
import {
  IntegrationGovernanceConsumerEntry,
  IntegrationGovernancePublicApiCount,
  IntegrationGovernancePublicApiRegistry,
  IntegrationGovernancePublicExports,
  IntegrationGovernancePublicIndex,
  IntegrationGovernancePublicIndexIdentity,
  IntegrationGovernancePublicInventory,
  IntegrationGovernancePublicMetadata,
  IntegrationGovernancePublicNamespace,
  IntegrationGovernancePublicReadiness,
  IntegrationGovernancePublicRelease,
  IntegrationGovernancePublicSummary,
} from "./integrationGovernancePublicIndex.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../../..");

const EIL79_FILES = Object.freeze([
  "integrationGovernancePublicIndex.ts",
  "integrationGovernancePublicIndex.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationGovernancePublicIndexIdentity",
  "IntegrationGovernancePublicNamespace",
  "IntegrationGovernancePublicApiRegistry",
  "IntegrationGovernancePublicApiCount",
  "IntegrationGovernancePublicInventory",
  "IntegrationGovernancePublicRelease",
  "IntegrationGovernancePublicReadiness",
  "IntegrationGovernancePublicSummary",
  "IntegrationGovernanceConsumerEntry",
  "IntegrationGovernancePublicIndex",
  "IntegrationGovernancePublicExports",
  "IntegrationGovernancePublicMetadata",
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
  /from ["']\.\/integrationGovernanceFreeze(?!\.ts["'])/,
  /from ["']\.\/integrationGovernance(Freeze|Certification|Platform|Manifest|Validation|Model|Registry|Foundation)(Identity|Locks|Baselines|Compatibility|Extensions|Architecture|Criteria|Gates|Results|Dependencies|Readiness|Composition|Capabilities|Guarantees|Exports|Rules|Categories|Inventory|Report|DomainModels|ContractModels|CapabilityModels|PolicyModels|ComplianceModels|LifecycleModels|DomainRegistry|ContractRegistry|CapabilityRegistry|PolicyRegistry|ComplianceRegistry|LifecycleRegistry|Capabilities|Contracts|Domains|Lifecycle|PolicyCategories|ComplianceCategories)\.ts["']/,
  /from ["']\.\/integrationGovernance(Certification|Platform|Manifest|Validation|Model|Registry|Foundation)\.ts["']/,
  /from ["']\.\.\/integration(?!Governance)/,
  /from ["']\.\.\/integrationObservability/,
  /from ["']\.\.\/integrationPolicyGovernance/,
  /from ["']react["']/,
  /from ["']next\//,
]);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("EIL-7:9 Integration Governance Public Index", () => {
  it("creates exactly two Public Index files and twelve public exports", () => {
    assert.equal(EIL79_FILES.length, 2);
    const present = readdirSync(HERE);
    for (const file of EIL79_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(PublicIndexModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(PublicIndexModule).length, 12);
    assert.deepEqual(
      [...IntegrationGovernancePublicExports],
      [...REQUIRED_PUBLIC_EXPORTS],
    );
    assert.equal(IntegrationGovernancePublicExports.length, 12);
  });

  it("has canonical identity, namespace, version, release states, and ReadyForConsumer", () => {
    assert.equal(IntegrationGovernancePublicIndexIdentity.phaseId, "EIL-7:9");
    assert.equal(
      IntegrationGovernancePublicIndexIdentity.canonicalId,
      "EIL-7:9/IntegrationGovernancePublicIndex",
    );
    assert.equal(
      IntegrationGovernancePublicIndexIdentity.name,
      "Integration Governance Public Index",
    );
    assert.equal(IntegrationGovernancePublicIndexIdentity.version, "1.0.0");
    assert.equal(
      IntegrationGovernancePublicIndexIdentity.namespace,
      "nexora.eil.integration-governance.public-index",
    );
    assert.equal(IntegrationGovernancePublicIndexIdentity.status, "Released");
    assert.equal(IntegrationGovernancePublicIndexIdentity.release, "Released");
    assert.equal(
      IntegrationGovernancePublicIndexIdentity.certification,
      "Certified",
    );
    assert.equal(IntegrationGovernancePublicIndexIdentity.freeze, "Frozen");
    assert.equal(IntegrationGovernancePublicIndexIdentity.stability, "Stable");
    assert.equal(
      IntegrationGovernancePublicIndexIdentity.readiness,
      "ReadyForConsumer",
    );
    assert.equal(IntegrationGovernancePublicReadiness, "ReadyForConsumer");
    assert.equal(
      IntegrationGovernancePublicIndexIdentity.lockId,
      IntegrationGovernanceFreezeLockId,
    );
    assert.equal(
      IntegrationGovernanceFreezeLockId,
      "EIL-7-INTEGRATION-GOVERNANCE-LOCKED",
    );
  });

  it("consumes Freeze aggregate as the sole upstream dependency", () => {
    assert.equal(IntegrationGovernancePublicIndex.dependency.freezeOnly, true);
    assert.equal(
      IntegrationGovernancePublicIndex.dependency.bypassesFreeze,
      false,
    );
    assert.equal(
      IntegrationGovernancePublicIndex.dependency.upstreamCanonicalId,
      IntegrationGovernanceFreezeIdentity.canonicalId,
    );
    assert.equal(
      IntegrationGovernancePublicIndex.freezeReference.aggregate,
      IntegrationGovernanceFreeze,
    );
    assert.equal(
      IntegrationGovernancePublicIndexIdentity.freezeDependency,
      IntegrationGovernanceFreezeIdentity.canonicalId,
    );
  });

  it("publishes exactly nine namespace sections and one consumer entry", () => {
    assert.equal(IntegrationGovernancePublicNamespace.sections.length, 9);
    assert.equal(IntegrationGovernancePublicNamespace.sectionCount, 9);
    assert.deepEqual(
      IntegrationGovernancePublicNamespace.sections.map((item) => item.section),
      [...EXPECTED_NAMESPACE_SECTIONS],
    );
    assert.deepEqual(
      IntegrationGovernancePublicNamespace.sections.map((item) => item.ordinal),
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
    );
    assert.equal(
      IntegrationGovernanceConsumerEntry.entryPoint,
      "integrationGovernancePublicIndex.ts",
    );
    assert.equal(IntegrationGovernanceConsumerEntry.soleSupportedEntry, true);
    assert.equal(
      IntegrationGovernanceConsumerEntry.mustImportPublicIndexOnly,
      true,
    );
    assert.equal(
      IntegrationGovernanceConsumerEntry.mayImportFreezeDirectly,
      false,
    );
  });

  it("derives a dynamic Public API Registry with unique IDs and deterministic order", () => {
    assert.equal(
      IntegrationGovernancePublicApiCount,
      IntegrationGovernancePublicApiRegistry.length,
    );
    assert.ok(IntegrationGovernancePublicApiRegistry.length > 12);
    assertUnique(
      IntegrationGovernancePublicApiRegistry.map((item) => item.apiId),
      "API IDs",
    );
    assertUnique(
      IntegrationGovernancePublicApiRegistry.map((item) => item.exportName),
      "API export names",
    );
    assert.deepEqual(
      IntegrationGovernancePublicApiRegistry.map((item) => item.ordinal),
      Array.from(
        { length: IntegrationGovernancePublicApiRegistry.length },
        (_, index) => index + 1,
      ),
    );
    assert.ok(
      IntegrationGovernancePublicApiRegistry.every(
        (item) =>
          item.status === "Released" &&
          item.exported === true &&
          item.derivedFromFreeze === true &&
          item.metadataOnly === true,
      ),
    );
    assert.ok(
      IntegrationGovernancePublicExports.every((exportName) =>
        IntegrationGovernancePublicApiRegistry.some(
          (api) =>
            api.exportName === exportName && api.sourcePhase === "EIL-7:9",
        ),
      ),
    );
  });

  it("derives inventory from Freeze and preserves release declaration", () => {
    const inventory = IntegrationGovernancePublicInventory;
    assert.equal(inventory.countsDerivedFromFreeze, true);
    assert.equal(inventory.independentInventory, false);
    assert.equal(inventory.hardcodedTotals, false);
    assert.equal(
      inventory.certificationDerivedInventory,
      IntegrationGovernanceFreeze.certificationDerivedInventory,
    );
    assert.equal(
      inventory.freezeLockCount,
      IntegrationGovernanceFreeze.architecturalLocks.length,
    );
    assert.equal(
      inventory.freezeBaselineCount,
      IntegrationGovernanceFreeze.frozenBaselines.length,
    );
    assert.equal(
      inventory.publicApiCount,
      IntegrationGovernancePublicApiRegistry.length,
    );

    assert.equal(IntegrationGovernancePublicRelease.release, "Released");
    assert.equal(IntegrationGovernancePublicRelease.certification, "Certified");
    assert.equal(IntegrationGovernancePublicRelease.freeze, "Frozen");
    assert.equal(IntegrationGovernancePublicRelease.stability, "Stable");
    assert.equal(
      IntegrationGovernancePublicRelease.readiness,
      "ReadyForConsumer",
    );
    assert.equal(
      IntegrationGovernancePublicRelease.lockId,
      IntegrationGovernanceFreezeLockId,
    );
    assert.equal(IntegrationGovernancePublicSummary.release, "Released");
    assert.equal(IntegrationGovernancePublicIndex.status, "Released");
    assert.equal(IntegrationGovernancePublicIndex.certification, "Certified");
    assert.equal(IntegrationGovernancePublicIndex.freeze, "Frozen");
    assert.equal(IntegrationGovernancePublicIndex.stability, "Stable");
  });

  it("exposes immutable aggregate Public Index metadata", () => {
    assert.equal(Object.isFrozen(IntegrationGovernancePublicIndex), true);
    assert.equal(
      Object.isFrozen(IntegrationGovernancePublicIndexIdentity),
      true,
    );
    assert.equal(Object.isFrozen(IntegrationGovernancePublicNamespace), true);
    assert.equal(
      Object.isFrozen(IntegrationGovernancePublicApiRegistry),
      true,
    );
    assert.equal(Object.isFrozen(IntegrationGovernancePublicExports), true);
    assert.equal(Object.isFrozen(IntegrationGovernancePublicInventory), true);
    assert.equal(Object.isFrozen(IntegrationGovernancePublicRelease), true);
    assert.equal(Object.isFrozen(IntegrationGovernancePublicSummary), true);
    assert.equal(Object.isFrozen(IntegrationGovernanceConsumerEntry), true);
    assert.equal(Object.isFrozen(IntegrationGovernancePublicMetadata), true);

    assert.equal(
      IntegrationGovernancePublicIndex.identity,
      IntegrationGovernancePublicIndexIdentity,
    );
    assert.equal(
      IntegrationGovernancePublicIndex.apiRegistry,
      IntegrationGovernancePublicApiRegistry,
    );
    assert.equal(
      IntegrationGovernancePublicIndex.lockId,
      IntegrationGovernanceFreezeLockId,
    );
  });

  it("is metadata-only with zero runtime governance behavior", () => {
    const publicIndex = IntegrationGovernancePublicIndex;
    assert.equal(publicIndex.metadataOnly, true);
    assert.equal(publicIndex.runtimeBehavior, false);
    assert.equal(publicIndex.governanceEngine, false);
    assert.equal(publicIndex.policyEngine, false);
    assert.equal(publicIndex.complianceEngine, false);
    assert.equal(publicIndex.certificationEngine, false);
    assert.equal(publicIndex.monitoringEngine, false);
    assert.equal(publicIndex.runtimeValidation, false);
    assert.equal(publicIndex.dashboard, false);
    assert.equal(publicIndex.networkingBehavior, false);
    assert.equal(publicIndex.persistenceBehavior, false);
    assert.equal(publicIndex.reactBehavior, false);
    assert.equal(publicIndex.stateMutation, false);
  });

  it("has zero prohibited imports across public index source", () => {
    const source = readFileSync(
      join(HERE, "integrationGovernancePublicIndex.ts"),
      "utf8",
    );
    for (const pattern of PROHIBITED_IMPORT_PATTERNS) {
      assert.doesNotMatch(
        source,
        pattern,
        `public index must not match ${pattern}`,
      );
    }
    assert.match(
      source,
      /from ["']\.\/integrationGovernanceFreeze\.ts["']/,
    );
    assert.doesNotMatch(source, /\b(fetch|axios|http\.request)\b/);
    assert.doesNotMatch(source, /\b(setTimeout|setInterval|Promise)\b/);
    assert.doesNotMatch(source, /\bclass\b/);
    assert.doesNotMatch(source, /\basync\s+function\b/);
  });

  it("passes strict TypeScript and ESLint for public index source", () => {
    const source = join(
      "app/lib/eil/integrationGovernance",
      "integrationGovernancePublicIndex.ts",
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
        source,
        "app/lib/eil/integrationGovernance/integrationGovernanceFreeze.ts",
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
      [source],
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
