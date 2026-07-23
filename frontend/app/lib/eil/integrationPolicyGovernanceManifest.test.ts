/**
 * EIL-5:5 — Integration Policy & Governance Manifest Tests.
 *
 * Deterministic coverage for the immutable Integration Policy & Governance Manifest.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  IntegrationPolicyGovernanceValidationIdentity,
  IntegrationPolicyGovernanceValidationPlatform,
} from "./integrationPolicyGovernanceValidation.ts";
import * as ManifestModule from "./integrationPolicyGovernanceManifest.ts";
import {
  IntegrationPolicyGovernanceArchitectureManifest,
  IntegrationPolicyGovernanceCompatibilityManifest,
  IntegrationPolicyGovernanceDependencyManifest,
  IntegrationPolicyGovernanceInventoryManifest,
  IntegrationPolicyGovernanceManifestCollections,
  IntegrationPolicyGovernanceManifestIdentity,
  IntegrationPolicyGovernanceManifestPlatform,
  IntegrationPolicyGovernanceManifestSummary,
} from "./integrationPolicyGovernanceManifest.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../..");

const EIL55_FILES = Object.freeze([
  "integrationPolicyGovernanceManifestTypes.ts",
  "integrationPolicyGovernanceManifestIdentity.ts",
  "integrationPolicyGovernanceArchitectureManifest.ts",
  "integrationPolicyGovernanceInventoryManifest.ts",
  "integrationPolicyGovernanceDependencyManifest.ts",
  "integrationPolicyGovernanceCompatibilityManifest.ts",
  "integrationPolicyGovernanceManifest.ts",
  "integrationPolicyGovernanceManifest.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationPolicyGovernanceManifestIdentity",
  "IntegrationPolicyGovernanceArchitectureManifest",
  "IntegrationPolicyGovernanceInventoryManifest",
  "IntegrationPolicyGovernanceDependencyManifest",
  "IntegrationPolicyGovernanceCompatibilityManifest",
  "IntegrationPolicyGovernanceManifestCollections",
  "IntegrationPolicyGovernanceManifestSummary",
  "IntegrationPolicyGovernanceManifestPlatform",
] as const);

const EXPECTED_COMPATIBILITY_SCOPES = Object.freeze([
  "Foundation",
  "Registry",
  "Model",
  "Validation",
  "Forward",
  "Version",
  "Namespace",
  "Architecture",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\/integrationPolicyGovernanceValidation(?!\.ts["'])/,
  /from ["']\.\/integrationPolicyGovernance(Validation|Model|Registry|Foundation)(Types|Identity|Rules|Categories|Findings|Readiness|DomainModels|RelationshipModels|TopologyModels|LifecycleModels|CategoryRegistry|ContractRegistry|CapabilityRegistry|ResponsibilityRegistry|Contracts|Capabilities|Responsibilities|Lifecycle)\.ts["']/,
  /from ["']\.\/integrationPolicyGovernance(Model|Registry|Foundation)\.ts["']/,
  /from ["']\.\/integration(?!PolicyGovernance)/,
  /from ["']\.\/integrationConnector/,
  /from ["']\.\/integrationRouting/,
  /from ["']\.\/integrationOrchestration/,
  /from ["']\.\/integrationPublicIndex/,
  /from ["']\.\/integrationPolicyGovernance(Platform|Certification|Freeze|PublicIndex)/,
  /from ["']\.\.\/(bus|ops|engine|dkl|nea|eve|director|advisor|core)\//,
  /from ["']react["']/,
  /from ["']next\//,
]);

const assertAscending = (ordinals: readonly number[], label: string): void => {
  assert.deepEqual(
    ordinals,
    [...ordinals].sort((a, b) => a - b),
    `${label} ordinals must be ascending`,
  );
};

describe("EIL-5:5 Integration Policy & Governance Manifest", () => {
  it("creates exactly eight Manifest files and eight public exports", () => {
    assert.equal(EIL55_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL55_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(ManifestModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(ManifestModule).length, 8);
  });

  it("has canonical identity, namespace, version, Manifest status, and ReadyForPlatform", () => {
    assert.equal(
      IntegrationPolicyGovernanceManifestIdentity.phaseId,
      "EIL-5:5",
    );
    assert.equal(
      IntegrationPolicyGovernanceManifestIdentity.canonicalId,
      "EIL-5:5/IntegrationPolicyGovernanceManifest",
    );
    assert.equal(
      IntegrationPolicyGovernanceManifestIdentity.name,
      "Integration Policy & Governance Manifest",
    );
    assert.equal(
      IntegrationPolicyGovernanceManifestIdentity.version,
      "1.0.0",
    );
    assert.equal(
      IntegrationPolicyGovernanceManifestIdentity.namespace,
      "nexora.eil.integration-policy-governance.manifest",
    );
    assert.equal(IntegrationPolicyGovernanceManifestIdentity.layer, "EIL");
    assert.equal(
      IntegrationPolicyGovernanceManifestIdentity.platform,
      "EIL-5",
    );
    assert.equal(
      IntegrationPolicyGovernanceManifestIdentity.phaseType,
      "Manifest",
    );
    assert.equal(
      IntegrationPolicyGovernanceManifestIdentity.status,
      "Manifest",
    );
    assert.equal(
      IntegrationPolicyGovernanceManifestIdentity.readiness,
      "ReadyForPlatform",
    );
    assert.equal(
      IntegrationPolicyGovernanceManifestPlatform.status,
      "Manifest",
    );
    assert.equal(
      IntegrationPolicyGovernanceManifestPlatform.readiness.readiness,
      "ReadyForPlatform",
    );
    assert.equal(
      IntegrationPolicyGovernanceManifestPlatform.nextPhase,
      "EIL-5:6 — Integration Policy & Governance Platform",
    );
  });

  it("declares Validation aggregate as the sole phase dependency", () => {
    const { dependency } = IntegrationPolicyGovernanceManifestPlatform;
    assert.equal(dependency.phaseDependencyCount, 1);
    assert.equal(dependency.validationOnly, true);
    assert.equal(
      dependency.validationId,
      IntegrationPolicyGovernanceValidationIdentity.canonicalId,
    );
    assert.equal(
      dependency.directPreviousPhaseModule,
      "integrationPolicyGovernanceValidation.ts",
    );
    assert.equal(
      IntegrationPolicyGovernanceManifestIdentity.validationDependency,
      "EIL-5:4/IntegrationPolicyGovernanceValidation",
    );
    assert.equal(
      IntegrationPolicyGovernanceManifestIdentity.validationEntryPoint,
      "integrationPolicyGovernanceValidation.ts",
    );
    assert.equal(dependency.validationInternalImport, false);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.previousEilPlatformDependency, false);
    assert.equal(dependency.laterEil5PhaseImport, false);
    assert.equal(
      IntegrationPolicyGovernanceManifestPlatform.validationPlatform,
      IntegrationPolicyGovernanceValidationPlatform,
    );
  });

  it("publishes immutable architecture, inventory, dependency, and compatibility manifests", () => {
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceArchitectureManifest),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceInventoryManifest),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceDependencyManifest),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceCompatibilityManifest),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceManifestCollections),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceManifestSummary),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceManifestPlatform),
      true,
    );

    assert.equal(
      IntegrationPolicyGovernanceArchitectureManifest.status,
      "Manifest",
    );
    assert.equal(
      IntegrationPolicyGovernanceArchitectureManifest.readiness,
      "ReadyForPlatform",
    );
    assert.equal(
      IntegrationPolicyGovernanceDependencyManifest.aggregateEntryPoint,
      "integrationPolicyGovernanceValidation.ts",
    );
    assert.equal(
      IntegrationPolicyGovernanceCompatibilityManifest.declarationCount,
      8,
    );
    assert.deepEqual(
      IntegrationPolicyGovernanceCompatibilityManifest.declarations.map(
        (item) => item.scope,
      ),
      [...EXPECTED_COMPATIBILITY_SCOPES],
    );
    assertAscending(
      IntegrationPolicyGovernanceCompatibilityManifest.declarations.map(
        (item) => item.ordinal,
      ),
      "compatibility",
    );
  });

  it("derives inventory dynamically as 207 from Validation → Model → Registry → Foundation", () => {
    const inventory = IntegrationPolicyGovernanceInventoryManifest;
    assert.equal(inventory.foundationCategoryCount, 10);
    assert.equal(inventory.foundationContractCount, 10);
    assert.equal(inventory.foundationCapabilityCount, 10);
    assert.equal(inventory.foundationResponsibilityCount, 8);
    assert.equal(inventory.lifecycleStateCount, 8);
    assert.equal(inventory.registryEntryCount, 38);
    assert.equal(inventory.domainModelCount, 16);
    assert.equal(inventory.relationshipModelCount, 12);
    assert.equal(inventory.topologyModelCount, 8);
    assert.equal(inventory.lifecycleModelCount, 8);
    assert.equal(inventory.validationRuleCount, 26);
    assert.equal(inventory.validationCategoryCount, 16);
    assert.equal(inventory.validationFindingCount, 5);
    assert.equal(inventory.publicExportCount, 32);
    assert.equal(inventory.totalInventoryCount, 207);
    assert.equal(inventory.countsDerivedFromUpstream, true);
    assert.equal(inventory.hardcodedCounts, false);
    assert.equal(inventory.duplicatesUpstreamCollections, false);
    assert.equal(
      IntegrationPolicyGovernanceManifestCollections.totalInventoryCount,
      207,
    );
    assert.equal(
      IntegrationPolicyGovernanceManifestSummary.totalInventoryCount,
      207,
    );
  });

  it("is metadata-only with zero runtime manifest behavior", () => {
    const platform = IntegrationPolicyGovernanceManifestPlatform;
    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.runtimeEnforcement, false);
    assert.equal(platform.runtimePlatform, false);
    assert.equal(platform.governanceEngine, false);
    assert.equal(platform.policyEnforcement, false);
    assert.equal(platform.authorizationEngine, false);
    assert.equal(platform.complianceEngine, false);
    assert.equal(platform.orchestrationRuntime, false);
    assert.equal(platform.validationEngine, false);
    assert.equal(platform.networkingBehavior, false);
    assert.equal(platform.restBehavior, false);
    assert.equal(platform.graphqlBehavior, false);
    assert.equal(platform.websocketBehavior, false);
    assert.equal(platform.queueBehavior, false);
    assert.equal(platform.connectorExecution, false);
    assert.equal(platform.persistenceBehavior, false);
    assert.equal(platform.aiBehavior, false);
    assert.equal(platform.uiBehavior, false);
    assert.equal(platform.stateMutation, false);
    assert.equal(platform.previousEilPlatformDependency, false);
    assert.equal(platform.importsLaterEil5Phases, false);
  });

  it("has zero prohibited imports across manifest sources", () => {
    const sources = EIL55_FILES.filter((name) => !name.endsWith(".test.ts"));
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

  it("passes strict TypeScript and ESLint for manifest sources", () => {
    const sources = EIL55_FILES.filter((name) => !name.endsWith(".test.ts")).map(
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
        "app/lib/eil/integrationPolicyGovernanceValidation.ts",
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
