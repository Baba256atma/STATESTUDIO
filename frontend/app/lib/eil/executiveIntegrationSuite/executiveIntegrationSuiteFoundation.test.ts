/**
 * EIL-8:1 — Executive Integration Suite Foundation Tests.
 *
 * Deterministic architectural coverage for the immutable Suite Foundation.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import * as PackageModule from "./index.ts";
import {
  ExecutiveIntegrationSuiteCapabilities,
  ExecutiveIntegrationSuiteComposition,
  ExecutiveIntegrationSuiteContracts,
  ExecutiveIntegrationSuiteDomains,
  ExecutiveIntegrationSuiteFoundation,
  ExecutiveIntegrationSuiteFoundationIdentity,
  ExecutiveIntegrationSuiteFoundationInventory,
  ExecutiveIntegrationSuiteFoundationReadinessValue,
  ExecutiveIntegrationSuiteLifecycleStages,
  ExecutiveIntegrationSuiteModules,
} from "./index.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../../..");

const EIL81_FILES = Object.freeze([
  "executiveIntegrationSuiteFoundation.ts",
  "executiveIntegrationSuiteContracts.ts",
  "executiveIntegrationSuiteCapabilities.ts",
  "executiveIntegrationSuiteDomains.ts",
  "executiveIntegrationSuiteLifecycle.ts",
  "executiveIntegrationSuiteModules.ts",
  "executiveIntegrationSuiteComposition.ts",
  "index.ts",
]);

const EXPECTED_CONTRACT_KEYS = Object.freeze([
  "SuiteContract",
  "ModuleCompositionContract",
  "PublicIndexContract",
  "DependencyContract",
  "CompatibilityContract",
  "SuiteIdentityContract",
  "SuiteLifecycleContract",
  "SuitePublicationContract",
] as const);

const EXPECTED_CAPABILITY_KEYS = Object.freeze([
  "SuiteComposition",
  "ModuleDiscovery",
  "PublicIndexAggregation",
  "DependencyPublication",
  "CompatibilityPublication",
  "SuiteIdentity",
  "SuiteMetadataPublication",
  "SuiteReadiness",
] as const);

const EXPECTED_DOMAIN_KEYS = Object.freeze([
  "Foundation",
  "Composition",
  "Modules",
  "Dependencies",
  "Compatibility",
  "Publication",
  "Metadata",
  "Suite",
] as const);

const EXPECTED_LIFECYCLE_KEYS = Object.freeze([
  "Declared",
  "Registered",
  "Modeled",
  "Validated",
  "Manifested",
  "Platform",
  "Certified",
  "Frozen",
  "PublicIndex",
] as const);

const EXPECTED_MODULE_KEYS = Object.freeze([
  "EIL-1",
  "EIL-2",
  "EIL-3",
  "EIL-4",
  "EIL-5",
  "EIL-6",
  "EIL-7",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\/executiveIntegrationSuite(Registry|Model|Validation|Manifest|Platform|Certification|Freeze|PublicIndex)/,
  /from ["']\.\.\/integration(?!PublicIndex\.ts|ConnectorPublicIndex\.ts|RoutingPublicIndex\.ts|OrchestrationPublicIndex\.ts|PolicyGovernancePublicIndex\.ts|Observability\/integrationObservabilityPublicIndex\.ts|Governance\/integrationGovernancePublicIndex\.ts)/,
  /from ["']react["']/,
  /from ["']next\//,
]);

describe("EIL-8:1 Executive Integration Suite Foundation", () => {
  it("creates exactly eight Foundation package files", () => {
    assert.equal(EIL81_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL81_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
  });

  it("has canonical identity, namespace, version, Foundation status, and ReadyForRegistry", () => {
    assert.equal(
      ExecutiveIntegrationSuiteFoundationIdentity.phaseId,
      "EIL-8:1",
    );
    assert.equal(
      ExecutiveIntegrationSuiteFoundationIdentity.canonicalId,
      "EIL-8:1/ExecutiveIntegrationSuiteFoundation",
    );
    assert.equal(
      ExecutiveIntegrationSuiteFoundationIdentity.name,
      "Executive Integration Suite Foundation",
    );
    assert.equal(
      ExecutiveIntegrationSuiteFoundationIdentity.version,
      "1.0.0",
    );
    assert.equal(
      ExecutiveIntegrationSuiteFoundationIdentity.namespace,
      "nexora.eil.executive-integration-suite.foundation",
    );
    assert.equal(
      ExecutiveIntegrationSuiteFoundationIdentity.status,
      "Foundation",
    );
    assert.equal(
      ExecutiveIntegrationSuiteFoundationIdentity.readiness,
      "ReadyForRegistry",
    );
    assert.equal(
      ExecutiveIntegrationSuiteFoundationReadinessValue,
      "ReadyForRegistry",
    );
    assert.equal(
      ExecutiveIntegrationSuiteFoundation.readiness,
      "ReadyForRegistry",
    );
  });

  it("publishes exactly 8 contracts, 8 capabilities, 8 domains, 9 lifecycle stages, and 7 modules", () => {
    assert.equal(ExecutiveIntegrationSuiteContracts.length, 8);
    assert.equal(ExecutiveIntegrationSuiteCapabilities.length, 8);
    assert.equal(ExecutiveIntegrationSuiteDomains.length, 8);
    assert.equal(ExecutiveIntegrationSuiteLifecycleStages.length, 9);
    assert.equal(ExecutiveIntegrationSuiteModules.length, 7);

    assert.deepEqual(
      ExecutiveIntegrationSuiteContracts.map((item) => item.contractKey),
      [...EXPECTED_CONTRACT_KEYS],
    );
    assert.deepEqual(
      ExecutiveIntegrationSuiteCapabilities.map((item) => item.capabilityKey),
      [...EXPECTED_CAPABILITY_KEYS],
    );
    assert.deepEqual(
      ExecutiveIntegrationSuiteDomains.map((item) => item.domainKey),
      [...EXPECTED_DOMAIN_KEYS],
    );
    assert.deepEqual(
      ExecutiveIntegrationSuiteLifecycleStages.map((item) => item.stageKey),
      [...EXPECTED_LIFECYCLE_KEYS],
    );
    assert.deepEqual(
      ExecutiveIntegrationSuiteModules.map((item) => item.moduleKey),
      [...EXPECTED_MODULE_KEYS],
    );
  });

  it("derives inventory dynamically and totals exactly 40", () => {
    const inventory = ExecutiveIntegrationSuiteFoundationInventory;
    const derived =
      ExecutiveIntegrationSuiteContracts.length +
      ExecutiveIntegrationSuiteCapabilities.length +
      ExecutiveIntegrationSuiteDomains.length +
      ExecutiveIntegrationSuiteLifecycleStages.length +
      ExecutiveIntegrationSuiteModules.length;

    assert.equal(inventory.countsDerivedFromCollections, true);
    assert.equal(inventory.hardcodedTotals, false);
    assert.equal(inventory.contractCount, 8);
    assert.equal(inventory.capabilityCount, 8);
    assert.equal(inventory.domainCount, 8);
    assert.equal(inventory.lifecycleStageCount, 9);
    assert.equal(inventory.suiteModuleCount, 7);
    assert.equal(inventory.totalFoundationEntryCount, derived);
    assert.equal(inventory.totalFoundationEntryCount, 40);
  });

  it("references Public Indexes only for all suite modules", () => {
    assert.equal(
      ExecutiveIntegrationSuiteFoundation.dependency.publicIndexOnly,
      true,
    );
    assert.equal(
      ExecutiveIntegrationSuiteComposition.dependencyDirection.publicIndexOnly,
      true,
    );
    assert.ok(
      ExecutiveIntegrationSuiteModules.every(
        (item) =>
          item.referencesPublicIndexOnly === true &&
          item.bypassesPublicIndex === false &&
          item.publicIndexId.includes("PublicIndex") &&
          item.publicIndexModule.endsWith("PublicIndex.ts"),
      ),
    );
    assert.deepEqual(
      ExecutiveIntegrationSuiteComposition.canonicalComposition.publicIndexIds,
      [
        "EIL-1:9/IntegrationPublicIndex",
        "EIL-2:9/IntegrationConnectorPublicIndex",
        "EIL-3:9/IntegrationRoutingPublicIndex",
        "EIL-4:9/IntegrationOrchestrationPublicIndex",
        "EIL-5:9/IntegrationPolicyGovernancePublicIndex",
        "EIL-6:9/IntegrationObservabilityPublicIndex",
        "EIL-7:9/IntegrationGovernancePublicIndex",
      ],
    );
  });

  it("exposes immutable aggregate Foundation and package surface", () => {
    assert.equal(Object.isFrozen(ExecutiveIntegrationSuiteFoundation), true);
    assert.equal(
      Object.isFrozen(ExecutiveIntegrationSuiteFoundationIdentity),
      true,
    );
    assert.equal(Object.isFrozen(ExecutiveIntegrationSuiteContracts), true);
    assert.equal(Object.isFrozen(ExecutiveIntegrationSuiteCapabilities), true);
    assert.equal(Object.isFrozen(ExecutiveIntegrationSuiteDomains), true);
    assert.equal(Object.isFrozen(ExecutiveIntegrationSuiteLifecycleStages), true);
    assert.equal(Object.isFrozen(ExecutiveIntegrationSuiteModules), true);
    assert.equal(Object.isFrozen(ExecutiveIntegrationSuiteComposition), true);

    assert.ok("ExecutiveIntegrationSuiteFoundation" in PackageModule);
    assert.ok("ExecutiveIntegrationSuiteModules" in PackageModule);
    assert.ok("ExecutiveIntegrationSuiteComposition" in PackageModule);
  });

  it("is metadata-only with zero runtime integration behavior", () => {
    const foundation = ExecutiveIntegrationSuiteFoundation;
    assert.equal(foundation.metadataOnly, true);
    assert.equal(foundation.compositionOnly, true);
    assert.equal(foundation.runtimeBehavior, false);
    assert.equal(foundation.integrationRuntime, false);
    assert.equal(foundation.orchestration, false);
    assert.equal(foundation.routing, false);
    assert.equal(foundation.governance, false);
    assert.equal(foundation.observability, false);
    assert.equal(foundation.networkingBehavior, false);
    assert.equal(foundation.persistenceBehavior, false);
    assert.equal(foundation.apiBehavior, false);
    assert.equal(foundation.reactBehavior, false);
    assert.equal(foundation.importsLaterEil8Phases, false);
  });

  it("has zero prohibited imports across foundation sources", () => {
    const sources = EIL81_FILES.filter((name) => name !== "index.ts");
    for (const file of sources) {
      const source = readFileSync(join(HERE, file), "utf8");
      for (const pattern of PROHIBITED_IMPORT_PATTERNS) {
        assert.doesNotMatch(
          source,
          pattern,
          `${file} must not match ${pattern}`,
        );
      }
      assert.doesNotMatch(source, /\b(fetch|axios|http\.request)\b/);
      assert.doesNotMatch(source, /\b(setTimeout|setInterval)\b/);
      assert.doesNotMatch(source, /\bclass\b/);
      assert.doesNotMatch(source, /\basync\s+function\b/);
    }

    const modulesSource = readFileSync(
      join(HERE, "executiveIntegrationSuiteModules.ts"),
      "utf8",
    );
    assert.match(modulesSource, /PublicIndex/);
    assert.doesNotMatch(
      modulesSource,
      /from ["']\.\.\/integrationFoundation\.ts["']/,
    );
  });

  it("passes strict TypeScript and ESLint for foundation sources", () => {
    const sources = EIL81_FILES.map((name) =>
      join("app/lib/eil/executiveIntegrationSuite", name),
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
        "ES2021",
        "--esModuleInterop",
        "--skipLibCheck",
        "--types",
        "node",
        ...sources,
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
      sources,
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
