/**
 * EIL-1:1 — Integration Foundation Tests.
 *
 * Deterministic coverage for the immutable Integration Foundation.
 * No mocks. No randomness. No network. No databases.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import * as FoundationModule from "./integrationFoundation.ts";
import {
  getIntegrationFoundationSummary,
  IntegrationFoundationId,
  IntegrationFoundationName,
  IntegrationFoundationNamespace,
  IntegrationFoundationPlatform,
  IntegrationFoundationReadiness,
  IntegrationFoundationStatus,
  IntegrationFoundationVersion,
} from "./integrationFoundation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const EIL11_FILES = Object.freeze([
  "integrationFoundation.ts",
  "integrationFoundationTypes.ts",
  "integrationFoundationContracts.ts",
  "integrationFoundationCapabilities.ts",
  "integrationFoundationResponsibilities.ts",
  "integrationFoundationLifecycle.ts",
  "integrationFoundationIdentity.ts",
  "integrationFoundation.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationFoundationId",
  "IntegrationFoundationVersion",
  "IntegrationFoundationName",
  "IntegrationFoundationNamespace",
  "IntegrationFoundationStatus",
  "IntegrationFoundationReadiness",
  "IntegrationFoundationPlatform",
  "getIntegrationFoundationSummary",
] as const);

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "platforms",
  "contracts",
  "capabilities",
  "responsibilities",
  "lifecycle",
  "ownership",
  "boundaries",
  "compatibility",
  "terminology",
  "readiness",
] as const);

const EXPECTED_CONTRACTS = Object.freeze([
  "IntegrationContract",
  "PlatformContract",
  "ConsumerContract",
  "ProducerContract",
  "EventContract",
  "RequestContract",
  "ResponseContract",
  "CoordinationContract",
  "RoutingContract",
  "CompatibilityContract",
] as const);

const EXPECTED_CAPABILITIES = Object.freeze([
  "PlatformIntegration",
  "RoutingCoordination",
  "DependencyAwareness",
  "Interoperability",
  "CompatibilityValidation",
  "ServiceDiscovery",
  "ContractPreservation",
  "OrchestrationSupport",
  "IntegrationLifecycleAwareness",
  "ExecutiveCoordination",
] as const);

const EXPECTED_RESPONSIBILITIES = Object.freeze([
  "PreservePlatformBoundaries",
  "CoordinateIntegrations",
  "ExposeCanonicalMetadata",
  "MaintainInteroperability",
  "PreventIllegalCoupling",
  "PreserveDependencyDirection",
  "MaintainArchitecturalConsistency",
  "SupportFutureRuntimeLayers",
] as const);

const EXPECTED_LIFECYCLE = Object.freeze([
  "Declared",
  "Designed",
  "Verified",
  "Certified",
  "Frozen",
  "Released",
  "Deprecated",
  "Retired",
] as const);

const EXPECTED_PLATFORMS = Object.freeze([
  "ENG",
  "DKL",
  "NEA",
  "Director",
  "Advisor",
  "EVE",
  "OPS",
  "BUS",
  "CORE",
  "CORE-TEN",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\.\//,
  /from ["'][^"']*\/(bus|ops|engine|dkl|nea|eve|director|advisor|core)\//,
  /from ["'][^"']*executiveIntegration/,
  /from ["']node:net["']/,
  /from ["']node:http["']/,
  /from ["']node:fs\/promises["']/,
]);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("EIL-1:1 Integration Foundation", () => {
  it("creates exactly eight Foundation files and eight public exports", () => {
    assert.equal(EIL11_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL11_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(FoundationModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(FoundationModule).length, 8);
  });

  it("has canonical identity, namespace, version, and Foundation status", () => {
    assert.equal(IntegrationFoundationId, "EIL-1:1/IntegrationFoundation");
    assert.equal(IntegrationFoundationVersion, "1.0.0");
    assert.equal(IntegrationFoundationName, "Integration Foundation");
    assert.equal(
      IntegrationFoundationNamespace,
      "nexora.eil.integration.foundation",
    );
    assert.equal(IntegrationFoundationStatus, "Foundation");
    assert.equal(IntegrationFoundationReadiness, "ReadyForRegistry");
    assert.equal(
      IntegrationFoundationPlatform.identity.foundationNamespace,
      "nexora.eil.integration.foundation",
    );
    assert.equal(IntegrationFoundationPlatform.identity.status, "Foundation");
    assert.equal(
      IntegrationFoundationPlatform.readiness,
      "ReadyForRegistry",
    );
    assert.equal(
      IntegrationFoundationPlatform.nextPhase,
      "EIL-1:2 — Integration Registry",
    );
  });

  it("publishes immutable exports and frozen aggregates", () => {
    const platform = IntegrationFoundationPlatform;
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(platform.identity), true);
    assert.equal(Object.isFrozen(platform.contracts), true);
    assert.equal(Object.isFrozen(platform.capabilities), true);
    assert.equal(Object.isFrozen(platform.responsibilities), true);
    assert.equal(Object.isFrozen(platform.lifecycle), true);
    assert.equal(Object.isFrozen(platform.ownership), true);
    assert.equal(Object.isFrozen(platform.boundaries), true);
    assert.equal(Object.isFrozen(platform.compatibility), true);
    assert.equal(Object.isFrozen(platform.terminology), true);
    assert.equal(Object.isFrozen(platform.platforms), true);
    assert.ok(platform.contracts.every((item) => Object.isFrozen(item)));
    assert.ok(
      platform.capabilityDeclarations.every((item) => Object.isFrozen(item)),
    );
    assert.ok(
      platform.responsibilityDeclarations.every((item) =>
        Object.isFrozen(item)
      ),
    );
  });

  it("publishes complete contracts in deterministic order", () => {
    const { contracts, contractNames } = IntegrationFoundationPlatform;
    assert.equal(contracts.length, 10);
    assert.deepEqual([...contractNames], [...EXPECTED_CONTRACTS]);
    assert.deepEqual(
      contracts.map((item) => item.contractId),
      EXPECTED_CONTRACTS.map((name) => `EIL-1:1/Contract/${name}`),
    );
    assertUnique(
      contracts.map((item) => item.contractId),
      "contract IDs",
    );
    assert.ok(contracts.every((item) => item.runtimeBehavior === "None"));
    assert.ok(contracts.every((item) => item.metadataOnly === true));
  });

  it("publishes complete unique lifecycle states", () => {
    const { lifecycle } = IntegrationFoundationPlatform;
    assert.deepEqual([...lifecycle.states], [...EXPECTED_LIFECYCLE]);
    assert.equal(lifecycle.stateCount, 8);
    assert.equal(lifecycle.currentState, "Verified");
    assert.equal(lifecycle.foundationReadiness, "ReadyForRegistry");
    assert.equal(lifecycle.executesTransitions, false);
    assert.equal(lifecycle.runtimeStateMachine, false);
    assertUnique([...lifecycle.states], "lifecycle states");
  });

  it("publishes unique capabilities and responsibilities", () => {
    const { capabilityDeclarations, responsibilityDeclarations, capabilities, responsibilities } =
      IntegrationFoundationPlatform;

    assert.equal(capabilityDeclarations.length, 10);
    assert.deepEqual(
      capabilityDeclarations.map((item) => item.capabilityKey),
      [...EXPECTED_CAPABILITIES],
    );
    assertUnique(
      capabilityDeclarations.map((item) => item.capabilityId),
      "capability IDs",
    );
    assert.equal(capabilities.capabilityCount, 10);
    assert.equal(capabilities.executesRuntime, false);

    assert.equal(responsibilityDeclarations.length, 8);
    assert.deepEqual(
      responsibilityDeclarations.map((item) => item.responsibilityId),
      [...EXPECTED_RESPONSIBILITIES],
    );
    assertUnique(
      responsibilityDeclarations.map((item) => item.responsibilityId),
      "responsibility IDs",
    );
    assert.equal(responsibilities.responsibilityCount, 8);
    assert.equal(responsibilities.executesRuntime, false);
    assert.equal(responsibilities.performsBusinessLogic, false);
  });

  it("declares coordinated platforms and ownership without runtime ownership", () => {
    const { platforms, ownership, boundaries, compatibility, terminology } =
      IntegrationFoundationPlatform;

    assert.deepEqual(
      platforms.map((item) => item.platformId),
      [...EXPECTED_PLATFORMS],
    );
    assert.ok(
      platforms.every((item) => item.integrationMode === "MetadataDeclarationOnly"),
    );
    assert.ok(platforms.every((item) => item.executesBusinessLogic === false));

    assert.ok(ownership.owns.includes("Platform identity"));
    assert.ok(ownership.owns.includes("Canonical contracts"));
    assert.ok(ownership.owns.includes("Terminology"));
    assert.ok(ownership.doesNotOwn.includes("Runtime"));
    assert.ok(ownership.doesNotOwn.includes("AI"));
    assert.ok(ownership.doesNotOwn.includes("Orchestration engine"));
    assert.equal(ownership.ownsRuntime, false);
    assert.equal(ownership.ownsBusinessLogic, false);

    assert.ok(boundaries.dependencyRules.includes("NoDownstreamDependencies"));
    assert.ok(boundaries.dependencyRules.includes("ApprovedNpaStandardsOnly"));
    assert.ok(boundaries.prohibitedSurfaces.includes("REST"));
    assert.equal(boundaries.runtimeEnforcement, false);

    assert.equal(compatibility.runtimeValidation, false);
    assert.ok(compatibility.declarations.length >= 4);
    assert.equal(terminology.terms.length, 6);
  });

  it("is metadata-only with zero runtime behavior flags", () => {
    const platform = IntegrationFoundationPlatform;
    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.runtimeEnforcement, false);
    assert.equal(platform.executionBehavior, false);
    assert.equal(platform.workflowBehavior, false);
    assert.equal(platform.orchestrationEngine, false);
    assert.equal(platform.schedulingBehavior, false);
    assert.equal(platform.networkingBehavior, false);
    assert.equal(platform.restBehavior, false);
    assert.equal(platform.apiCallBehavior, false);
    assert.equal(platform.persistenceBehavior, false);
    assert.equal(platform.storageBehavior, false);
    assert.equal(platform.cacheBehavior, false);
    assert.equal(platform.eventBehavior, false);
    assert.equal(platform.queueBehavior, false);
    assert.equal(platform.messagingBehavior, false);
    assert.equal(platform.dependencyInjection, false);
    assert.equal(platform.factoryBehavior, false);
    assert.equal(platform.serviceBehavior, false);
    assert.equal(platform.adapterBehavior, false);
    assert.equal(platform.connectorBehavior, false);
    assert.equal(platform.uiBehavior, false);
    assert.equal(platform.renderingBehavior, false);
    assert.equal(platform.visualizationBehavior, false);
    assert.equal(platform.businessLogicBehavior, false);
    assert.equal(platform.aiBehavior, false);
    assert.equal(platform.llmBehavior, false);
    assert.equal(platform.stateMutation, false);
    assert.equal(platform.importsLaterEilPhases, false);
    assert.equal(platform.dependency.laterEilPhaseImport, false);
    assert.equal(platform.dependency.downstreamDependencies.length, 0);
    assert.equal(platform.dependency.upstreamDependencies.length, 0);
  });

  it("has zero prohibited imports across foundation sources", () => {
    const sources = EIL11_FILES.filter((name) => !name.endsWith(".test.ts"));
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

  it("preserves ordered platform sections and deterministic summary", () => {
    const platform = IntegrationFoundationPlatform;
    const keys = Object.keys(platform);
    assert.deepEqual(keys.slice(0, 12), [...PLATFORM_SECTIONS]);
    assert.equal(platform.sectionCount, 12);
    assert.deepEqual([...platform.sectionOrder], [...PLATFORM_SECTIONS]);

    const summaryA = getIntegrationFoundationSummary();
    const summaryB = getIntegrationFoundationSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.foundationId, IntegrationFoundationId);
    assert.equal(summaryA.namespace, "nexora.eil.integration.foundation");
    assert.equal(summaryA.version, "1.0.0");
    assert.equal(summaryA.status, "Foundation");
    assert.equal(summaryA.readiness, "ReadyForRegistry");
    assert.equal(summaryA.platformCount, 10);
    assert.equal(summaryA.contractCount, 10);
    assert.equal(summaryA.capabilityCount, 10);
    assert.equal(summaryA.responsibilityCount, 8);
    assert.equal(summaryA.lifecycleStateCount, 8);
    assert.equal(summaryA.sectionCount, 12);
    assert.equal(summaryA.metadataOnly, true);
    assert.equal(summaryA.nextPhase, "EIL-1:2 — Integration Registry");
  });
});
