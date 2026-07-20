/**
 * EIL-1:1 — Executive Integration Foundation Tests.
 *
 * Deterministic coverage for the immutable Executive Integration Foundation.
 * No mocks. No randomness. No network. No databases.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { ExecutiveBusinessIntelligencePublicIndexId } from "../bus/executiveBusinessIntelligencePublicIndex.ts";
import { DataKnowledgeSuitePublicIndexId } from "../dkl/dataKnowledgeSuitePublicIndex.ts";
import { ExecutiveOrchestrationPublicIndexId } from "../engine/executiveOrchestrationPublicIndex.ts";
import { ExecutiveOperationsSuitePublicIndexId } from "../ops/executiveOperationsSuitePublicIndex.ts";
import * as FoundationModule from "./executiveIntegrationFoundation.ts";
import {
  ExecutiveIntegrationFoundationId,
  ExecutiveIntegrationFoundationName,
  ExecutiveIntegrationFoundationNamespace,
  ExecutiveIntegrationFoundationPlatform,
  ExecutiveIntegrationFoundationReadiness,
  ExecutiveIntegrationFoundationStatus,
  ExecutiveIntegrationFoundationVersion,
  getExecutiveIntegrationFoundationSummary,
} from "./executiveIntegrationFoundation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const EIL11_FILES = Object.freeze([
  "executiveIntegrationFoundationTypes.ts",
  "executiveIntegrationContracts.ts",
  "executiveIntegrationOwnership.ts",
  "executiveIntegrationBoundaries.ts",
  "executiveIntegrationLifecycle.ts",
  "executiveIntegrationResponsibilities.ts",
  "executiveIntegrationFoundation.ts",
  "executiveIntegrationFoundation.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ExecutiveIntegrationFoundationId",
  "ExecutiveIntegrationFoundationVersion",
  "ExecutiveIntegrationFoundationName",
  "ExecutiveIntegrationFoundationNamespace",
  "ExecutiveIntegrationFoundationStatus",
  "ExecutiveIntegrationFoundationReadiness",
  "ExecutiveIntegrationFoundationPlatform",
  "getExecutiveIntegrationFoundationSummary",
] as const);

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "contracts",
  "platforms",
  "nodes",
  "routes",
  "ownership",
  "responsibilities",
  "lifecycle",
  "boundaries",
  "metadata",
  "readiness",
] as const);

const EXPECTED_CONTRACTS = Object.freeze([
  "ExecutiveIntegrationPlatform",
  "IntegrationNode",
  "IntegrationRoute",
  "IntegrationRequest",
  "IntegrationResponse",
  "IntegrationCapability",
  "IntegrationIdentity",
  "IntegrationMetadata",
] as const);

const EXPECTED_RESPONSIBILITIES = Object.freeze([
  "PlatformCoordination",
  "CrossPlatformRouting",
  "IntegrationContracts",
  "ServiceDiscovery",
  "PlatformInteroperability",
  "WorkflowCoordination",
  "DependencyOrchestration",
  "EventCoordination",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("EIL-1:1 Executive Integration Foundation", () => {
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
    assert.equal(
      ExecutiveIntegrationFoundationId,
      "EIL-1:1/ExecutiveIntegrationFoundation",
    );
    assert.equal(ExecutiveIntegrationFoundationVersion, "1.0.0");
    assert.equal(
      ExecutiveIntegrationFoundationName,
      "Executive Integration Foundation",
    );
    assert.equal(
      ExecutiveIntegrationFoundationNamespace,
      "nexora.eil.foundation",
    );
    assert.equal(ExecutiveIntegrationFoundationStatus, "Foundation");
    assert.equal(
      ExecutiveIntegrationFoundationReadiness,
      "ReadyForRegistry",
    );
    assert.equal(
      ExecutiveIntegrationFoundationPlatform.identity.status,
      "Foundation",
    );
    assert.equal(
      ExecutiveIntegrationFoundationPlatform.identity.foundationNamespace,
      "nexora.eil.foundation",
    );
    assert.equal(
      ExecutiveIntegrationFoundationPlatform.readiness,
      "ReadyForRegistry",
    );
    assert.equal(
      ExecutiveIntegrationFoundationPlatform.nextPhase,
      "EIL-1:2 — Executive Integration Registry",
    );
  });

  it("consumes only released Public Indexes with no internal phase imports", () => {
    const dependency = ExecutiveIntegrationFoundationPlatform.dependency;
    assert.equal(dependency.publicIndexOnly, true);
    assert.equal(dependency.certifiedPlatformsOnly, true);
    assert.equal(dependency.directPublicIndexModules.length, 4);
    assert.deepEqual(
      [...dependency.directPublicIndexModules],
      [
        "executiveBusinessIntelligencePublicIndex.ts",
        "executiveOperationsSuitePublicIndex.ts",
        "executiveOrchestrationPublicIndex.ts",
        "dataKnowledgeSuitePublicIndex.ts",
      ],
    );
    assert.equal(dependency.busPublicIndex, true);
    assert.equal(dependency.opsPublicIndex, true);
    assert.equal(dependency.engPublicIndex, true);
    assert.equal(dependency.dklPublicIndex, true);
    assert.equal(dependency.internalPhaseImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.validationDirectImport, false);
    assert.equal(dependency.manifestDirectImport, false);
    assert.equal(dependency.platformDirectImport, false);
    assert.equal(dependency.certificationDirectImport, false);
    assert.equal(dependency.freezeDirectImport, false);
    assert.equal(dependency.reconstructsUpstream, false);
    assert.equal(dependency.reconstructsPreviousLayers, false);

    const platforms = ExecutiveIntegrationFoundationPlatform.platforms;
    assert.equal(platforms.length, 4);
    assert.ok(
      platforms.every((item) => item.integrationMode === "PublicIndexOnly"),
    );
    assert.ok(
      platforms.every((item) => item.certificationRequired === true),
    );
    assert.equal(
      platforms[0]!.publicIndexId,
      ExecutiveBusinessIntelligencePublicIndexId,
    );
    assert.equal(
      platforms[1]!.publicIndexId,
      ExecutiveOperationsSuitePublicIndexId,
    );
    assert.equal(
      platforms[2]!.publicIndexId,
      ExecutiveOrchestrationPublicIndexId,
    );
    assert.equal(platforms[3]!.publicIndexId, DataKnowledgeSuitePublicIndexId);
  });

  it("declares ownership without owning prohibited domains", () => {
    const { ownership } = ExecutiveIntegrationFoundationPlatform;
    assert.ok(ownership.owns.includes("Platform identity"));
    assert.ok(ownership.owns.includes("Integration contracts"));
    assert.ok(ownership.owns.includes("Architecture boundaries"));
    assert.ok(ownership.owns.includes("Dependency rules"));
    assert.ok(ownership.owns.includes("Extension policy"));
    assert.ok(ownership.doesNotOwn.includes("AI"));
    assert.ok(ownership.doesNotOwn.includes("Reasoning"));
    assert.ok(ownership.doesNotOwn.includes("Executive Decision"));
    assert.ok(ownership.doesNotOwn.includes("Persistence"));
    assert.ok(ownership.doesNotOwn.includes("Transport protocols"));
    assert.ok(ownership.doesNotOwn.includes("UI"));
    assert.ok(ownership.doesNotOwn.includes("Runtime orchestration"));
    assert.equal(ownership.assignsUsers, false);
    assert.equal(ownership.ownsPlatformInternals, false);
    assert.equal(ownership.ownsTransport, false);
    assert.equal(ownership.ownsBusinessReasoning, false);
    assert.equal(ownership.runtimeBehavior, "None");
  });

  it("publishes exactly eight public contracts in deterministic order", () => {
    const { contracts, contractNames } =
      ExecutiveIntegrationFoundationPlatform;
    assert.equal(contracts.length, 8);
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

  it("declares lifecycle and responsibilities without executing them", () => {
    const { lifecycle, responsibilityDeclarations, responsibilities } =
      ExecutiveIntegrationFoundationPlatform;
    assert.equal(lifecycle.currentState, "ReadyForRegistry");
    assert.equal(lifecycle.executesTransitions, false);
    assert.equal(lifecycle.runtimeStateMachine, false);
    assert.ok(lifecycle.stateCount >= 8);
    assertUnique([...lifecycle.states], "lifecycle states");

    assert.equal(responsibilityDeclarations.length, 8);
    assert.deepEqual(
      responsibilityDeclarations.map((item) => item.responsibilityId),
      [...EXPECTED_RESPONSIBILITIES],
    );
    assert.equal(responsibilities.responsibilityCount, 8);
    assert.equal(responsibilities.capabilityCount, 8);
    assert.equal(responsibilities.executesRuntime, false);
    assert.equal(responsibilities.performsBusinessReasoning, false);
    assertUnique(
      responsibilityDeclarations.map((item) => item.responsibilityId),
      "responsibility IDs",
    );
  });

  it("enforces architecture boundaries and prohibited surfaces", () => {
    const { boundaries } = ExecutiveIntegrationFoundationPlatform;
    assert.equal(boundaries.consumes.length, 4);
    assert.equal(boundaries.runtimeEnforcement, false);
    assert.equal(boundaries.performsAi, false);
    assert.equal(boundaries.performsReasoning, false);
    assert.equal(boundaries.performsExecutiveDecision, false);
    assert.equal(boundaries.implementsTransport, false);
    assert.equal(boundaries.persists, false);
    assert.equal(boundaries.uiBehavior, false);
    assert.equal(boundaries.executionLogic, false);
    assert.equal(boundaries.runtimeOrchestration, false);
    assert.equal(boundaries.importsInternalPhases, false);
    assert.ok(boundaries.prohibitedSurfaceCount >= 40);
    assert.ok(boundaries.prohibitedSurfaces.includes("AI"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime orchestration"));
    assert.ok(boundaries.prohibitedSurfaces.includes("HTTP"));
    assert.ok(boundaries.dependencyRules.includes("PublicIndexOnly"));
    assert.ok(
      boundaries.extensionPolicy.includes("AdditivePublicIndexOnly"),
    );
    assert.equal(
      boundaries.layerSeparation.eilOwnsCoordinationMetadataOnly,
      true,
    );
  });

  it("preserves ordered platform sections and immutable public surface", () => {
    const platform = ExecutiveIntegrationFoundationPlatform;
    const keys = Object.keys(platform);
    assert.deepEqual(keys.slice(0, 12), [...PLATFORM_SECTIONS]);
    assert.equal(platform.sectionCount, 12);
    assert.deepEqual([...platform.sectionOrder], [...PLATFORM_SECTIONS]);
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(platform.contracts), true);
    assert.equal(Object.isFrozen(platform.platforms), true);
    assert.equal(Object.isFrozen(platform.ownership), true);
    assert.equal(Object.isFrozen(platform.boundaries), true);
    assert.equal(Object.isFrozen(platform.lifecycle), true);
    assert.equal(Object.isFrozen(platform.responsibilities), true);
    assert.equal(Object.isFrozen(platform.nodes), true);
    assert.equal(Object.isFrozen(platform.routes), true);
    assert.ok(platform.routes.every((item) => item.transportImplemented === false));
    assert.ok(platform.nodes.every((item) => item.executesRuntime === false));
  });

  it("returns a deterministic summary ready for EIL-1:2", () => {
    const summaryA = getExecutiveIntegrationFoundationSummary();
    const summaryB = getExecutiveIntegrationFoundationSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.foundationId, ExecutiveIntegrationFoundationId);
    assert.equal(summaryA.namespace, "nexora.eil.foundation");
    assert.equal(summaryA.version, "1.0.0");
    assert.equal(summaryA.status, "Foundation");
    assert.equal(summaryA.readiness, "ReadyForRegistry");
    assert.equal(summaryA.platformCount, 4);
    assert.equal(summaryA.contractCount, 8);
    assert.equal(summaryA.responsibilityCount, 8);
    assert.equal(summaryA.sectionCount, 12);
    assert.equal(summaryA.metadataOnly, true);
    assert.equal(
      summaryA.nextPhase,
      "EIL-1:2 — Executive Integration Registry",
    );
    assert.equal(
      ExecutiveIntegrationFoundationPlatform.runtimeBehavior,
      false,
    );
    assert.equal(
      ExecutiveIntegrationFoundationPlatform.runtimeEnforcement,
      false,
    );
    assert.equal(ExecutiveIntegrationFoundationPlatform.aiBehavior, false);
    assert.equal(
      ExecutiveIntegrationFoundationPlatform.reasoningBehavior,
      false,
    );
    assert.equal(ExecutiveIntegrationFoundationPlatform.uiBehavior, false);
    assert.equal(
      ExecutiveIntegrationFoundationPlatform.importsInternalPhases,
      false,
    );
  });
});
