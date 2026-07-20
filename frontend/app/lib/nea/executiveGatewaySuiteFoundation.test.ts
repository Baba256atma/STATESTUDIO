/**
 * NEA-8:1 — Executive Gateway Suite Foundation Tests.
 *
 * Deterministic coverage for the immutable Executive Gateway Suite Foundation.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { ChannelConnectorPlatformPublicFoundation } from "./channelConnectorPublicIndex.ts";
import { ExecutiveGatewayPlatformPublicFoundation } from "./executiveGatewayPublicIndex.ts";
import * as FoundationModule from "./executiveGatewaySuiteFoundation.ts";
import {
  ExecutiveGatewaySuiteFoundationId,
  ExecutiveGatewaySuiteFoundationName,
  ExecutiveGatewaySuiteFoundationNamespace,
  ExecutiveGatewaySuiteFoundationPlatform,
  ExecutiveGatewaySuiteFoundationReadiness,
  ExecutiveGatewaySuiteFoundationStatus,
  ExecutiveGatewaySuiteFoundationVersion,
  getExecutiveGatewaySuiteFoundationSummary,
} from "./executiveGatewaySuiteFoundation.ts";
import { GatewayRoutingPlatformPublicFoundation } from "./gatewayRoutingPublicIndex.ts";
import { IntakeOrchestrationPlatformPublicFoundation } from "./intakeOrchestrationPublicIndex.ts";
import { MessageNormalizationPlatformPublicFoundation } from "./messageNormalizationPublicIndex.ts";
import { SecurityGatewayPlatformPublicFoundation } from "./securityGatewayPublicIndex.ts";
import { SessionConversationPlatformPublicFoundation } from "./sessionConversationPublicIndex.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA81_FILES = Object.freeze([
  "executiveGatewaySuiteFoundationTypes.ts",
  "executiveGatewaySuiteContracts.ts",
  "executiveGatewaySuiteCapabilities.ts",
  "executiveGatewaySuiteLifecycle.ts",
  "executiveGatewaySuiteOwnership.ts",
  "executiveGatewaySuiteBoundaries.ts",
  "executiveGatewaySuiteFoundation.ts",
  "executiveGatewaySuiteFoundation.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ExecutiveGatewaySuiteFoundationId",
  "ExecutiveGatewaySuiteFoundationVersion",
  "ExecutiveGatewaySuiteFoundationName",
  "ExecutiveGatewaySuiteFoundationNamespace",
  "ExecutiveGatewaySuiteFoundationStatus",
  "ExecutiveGatewaySuiteFoundationReadiness",
  "ExecutiveGatewaySuiteFoundationPlatform",
  "getExecutiveGatewaySuiteFoundationSummary",
] as const);

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "composition",
  "contracts",
  "capabilities",
  "lifecycle",
  "ownership",
  "boundaries",
  "inventory",
  "readiness",
] as const);

const EXPECTED_COMPONENTS = Object.freeze([
  "NEA-1",
  "NEA-2",
  "NEA-3",
  "NEA-4",
  "NEA-5",
  "NEA-6",
  "NEA-7",
] as const);

const EXPECTED_CAPABILITIES = Object.freeze([
  "GatewaySuiteComposition",
  "CanonicalReferenceAggregation",
  "PublicPlatformAggregation",
  "ExecutiveGatewayExposure",
  "ConsumerPlatformComposition",
  "InventoryAggregation",
  "ArchitecturePublication",
  "SuiteSummaryDeclaration",
] as const);

const EXPECTED_CONTRACTS = Object.freeze([
  "Suite Identity",
  "Suite Component",
  "Suite Composition",
  "Suite Dependency",
  "Suite Capability",
  "Suite Ownership",
  "Suite Boundary",
  "Suite Lifecycle",
  "Suite Metadata",
  "Suite Version",
  "Suite Readiness",
  "Suite Summary",
] as const);

describe("NEA-8:1 Executive Gateway Suite Foundation", () => {
  it("creates exactly eight Foundation files and eight public exports", () => {
    assert.equal(NEA81_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA81_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(FoundationModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(FoundationModule).length, 8);
  });

  it("has canonical identity, Foundation status, and ReadyForRegistry", () => {
    assert.equal(
      ExecutiveGatewaySuiteFoundationId,
      "NEA-8:1/ExecutiveGatewaySuiteFoundation",
    );
    assert.equal(ExecutiveGatewaySuiteFoundationVersion, "1.0.0");
    assert.equal(
      ExecutiveGatewaySuiteFoundationName,
      "Executive Gateway Suite Foundation",
    );
    assert.equal(
      ExecutiveGatewaySuiteFoundationNamespace,
      "nexora.nea.executive-gateway-suite.foundation",
    );
    assert.equal(ExecutiveGatewaySuiteFoundationStatus, "Foundation");
    assert.equal(
      ExecutiveGatewaySuiteFoundationReadiness,
      "ReadyForRegistry",
    );
    assert.equal(
      ExecutiveGatewaySuiteFoundationPlatform.identity.phase,
      "NEA-8:1",
    );
    assert.equal(
      ExecutiveGatewaySuiteFoundationPlatform.identity.suiteName,
      "Executive Gateway Suite",
    );
    assert.equal(
      ExecutiveGatewaySuiteFoundationPlatform.nextPhase,
      "NEA-8:2 — Executive Gateway Suite Registry",
    );
  });

  it("consumes only NEA-1 through NEA-7 Public Indexes", () => {
    const dependency = ExecutiveGatewaySuiteFoundationPlatform.dependency;
    assert.equal(dependency.publicIndexOnly, true);
    assert.deepEqual([...dependency.directPreviousPhaseModules], [
      "executiveGatewayPublicIndex.ts",
      "channelConnectorPublicIndex.ts",
      "sessionConversationPublicIndex.ts",
      "securityGatewayPublicIndex.ts",
      "gatewayRoutingPublicIndex.ts",
      "messageNormalizationPublicIndex.ts",
      "intakeOrchestrationPublicIndex.ts",
    ]);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.validationDirectImport, false);
    assert.equal(dependency.manifestDirectImport, false);
    assert.equal(dependency.platformDirectImport, false);
    assert.equal(dependency.certificationDirectImport, false);
    assert.equal(dependency.freezeDirectImport, false);
    assert.equal(dependency.reconstructsUpstream, false);
    assert.equal(dependency.duplicatesUpstreamMetadata, false);
    assert.equal(dependency.introducesNewGatewayFunctionality, false);
  });

  it("composes seven Public Index platforms by reference without duplication", () => {
    const { composition, inventory } = ExecutiveGatewaySuiteFoundationPlatform;
    assert.equal(composition.componentCount, 7);
    assert.deepEqual(
      composition.components.map((item) => item.componentId),
      [...EXPECTED_COMPONENTS],
    );
    assert.ok(
      composition.components.every((item) => item.ownership === "Referenced"),
    );
    assert.ok(
      composition.components.every(
        (item) => item.reconstructsUpstream === false,
      ),
    );
    assert.equal(
      composition.components[0]?.publicPlatform,
      ExecutiveGatewayPlatformPublicFoundation,
    );
    assert.equal(
      composition.components[1]?.publicPlatform,
      ChannelConnectorPlatformPublicFoundation,
    );
    assert.equal(
      composition.components[2]?.publicPlatform,
      SessionConversationPlatformPublicFoundation,
    );
    assert.equal(
      composition.components[3]?.publicPlatform,
      SecurityGatewayPlatformPublicFoundation,
    );
    assert.equal(
      composition.components[4]?.publicPlatform,
      GatewayRoutingPlatformPublicFoundation,
    );
    assert.equal(
      composition.components[5]?.publicPlatform,
      MessageNormalizationPlatformPublicFoundation,
    );
    assert.equal(
      composition.components[6]?.publicPlatform,
      IntakeOrchestrationPlatformPublicFoundation,
    );

    const derivedTotal = composition.components.reduce(
      (total, item) => total + item.publicApiCount,
      0,
    );
    assert.equal(inventory.publicApiInventoryTotal, derivedTotal);
    assert.equal(inventory.publicApiInventoryTotal, 532);
    assert.equal(inventory.sourcedThroughPublicIndexes, true);
    assert.equal(inventory.hardcoded, false);
    assert.equal(inventory.reconstructed, false);
  });

  it("declares twelve contracts and eight architectural capabilities", () => {
    const { contracts, capabilities } = ExecutiveGatewaySuiteFoundationPlatform;
    assert.equal(contracts.contractCount, 12);
    assert.deepEqual(
      contracts.contracts.map((item) => item.contractName),
      [...EXPECTED_CONTRACTS],
    );
    assert.ok(
      contracts.contracts.every((item) => item.runtimeBehavior === "None"),
    );

    assert.equal(capabilities.capabilityCount, 8);
    assert.deepEqual(
      capabilities.capabilities.map((item) => item.capabilityId),
      [...EXPECTED_CAPABILITIES],
    );
    assert.ok(
      capabilities.capabilities.every((item) => item.executesRuntime === false),
    );
  });

  it("declares ownership, lifecycle, and forbidden boundaries", () => {
    const { ownership, lifecycle, boundaries } =
      ExecutiveGatewaySuiteFoundationPlatform;
    assert.ok(ownership.owns.includes("Suite Identity"));
    assert.ok(ownership.owns.includes("Suite Composition"));
    assert.ok(ownership.owns.includes("Suite Contracts"));
    assert.ok(ownership.doesNotOwn.includes("Executive Gateway"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Connectors"));
    assert.ok(ownership.doesNotOwn.includes("DKL"));
    assert.equal(ownership.ownsExecutiveGateway, false);
    assert.equal(ownership.ownsRuntimeRouting, false);

    assert.equal(lifecycle.stateCount, 9);
    assert.equal(lifecycle.initialState, "Foundation");
    assert.equal(lifecycle.currentState, "ReadyForRegistry");
    assert.equal(lifecycle.terminalState, "ReadyForPublicIndex");
    assert.equal(lifecycle.executesRuntime, false);

    assert.ok(boundaries.consumes.includes("NEA-1 Executive Gateway Public Index"));
    assert.ok(
      boundaries.consumes.includes("NEA-7 Intake Orchestration Public Index"),
    );
    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime Gateway"));
    assert.ok(boundaries.prohibitedSurfaces.includes("DKL invocation"));
    assert.equal(boundaries.ownsRuntimeExecution, false);
    assert.equal(boundaries.duplicatesUpstreamMetadata, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = ExecutiveGatewaySuiteFoundationPlatform;
    const keys = Object.keys(platform);
    assert.deepEqual(keys.slice(0, 10), [...PLATFORM_SECTIONS]);
    assert.equal(platform.sectionCount, 10);
    assert.deepEqual([...platform.sectionOrder], [...PLATFORM_SECTIONS]);
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(platform.composition), true);
    assert.equal(Object.isFrozen(platform.contracts), true);
    assert.equal(Object.isFrozen(platform.capabilities), true);
    assert.equal(Object.isFrozen(platform.lifecycle), true);
    assert.equal(Object.isFrozen(platform.ownership), true);
    assert.equal(Object.isFrozen(platform.boundaries), true);
    assert.equal(Object.isFrozen(platform.inventory), true);
    assert.equal(Object.isFrozen(platform.readiness), true);
  });

  it("derives deterministic summary and forbids runtime behavior", () => {
    const summaryA = getExecutiveGatewaySuiteFoundationSummary();
    const summaryB = getExecutiveGatewaySuiteFoundationSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.foundationId, ExecutiveGatewaySuiteFoundationId);
    assert.equal(summaryA.status, "Foundation");
    assert.equal(summaryA.readiness, "ReadyForRegistry");
    assert.equal(summaryA.componentCount, 7);
    assert.equal(summaryA.capabilityCount, 8);
    assert.equal(summaryA.contractCount, 12);
    assert.equal(summaryA.lifecycleStateCount, 9);
    assert.equal(summaryA.publicApiInventoryTotal, 532);
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 10);
    assert.equal(
      summaryA.nextPhase,
      "NEA-8:2 — Executive Gateway Suite Registry",
    );

    const platform = ExecutiveGatewaySuiteFoundationPlatform;
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.implementsRuntimeGateway, false);
    assert.equal(platform.implementsRuntimeConnectors, false);
    assert.equal(platform.implementsRuntimeSessions, false);
    assert.equal(platform.implementsRuntimeSecurity, false);
    assert.equal(platform.implementsRuntimeRouting, false);
    assert.equal(platform.implementsHttp, false);
    assert.equal(platform.aiReasoning, false);
    assert.equal(platform.invokesDkl, false);
    assert.equal(platform.invokesEngine, false);
    assert.equal(platform.invokesAssistant, false);
  });
});
