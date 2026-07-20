/**
 * NEA-8:6 — Executive Gateway Suite Platform Tests.
 *
 * Deterministic coverage for the immutable Executive Gateway Suite Platform.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ExecutiveGatewaySuiteManifestId,
  ExecutiveGatewaySuiteManifestPlatform,
} from "./executiveGatewaySuiteManifest.ts";
import * as PlatformModule from "./executiveGatewaySuitePlatform.ts";
import {
  ExecutiveGatewaySuitePlatform,
  ExecutiveGatewaySuitePlatformId,
  ExecutiveGatewaySuitePlatformName,
  ExecutiveGatewaySuitePlatformNamespace,
  ExecutiveGatewaySuitePlatformReadiness,
  ExecutiveGatewaySuitePlatformStatus,
  ExecutiveGatewaySuitePlatformVersion,
  getExecutiveGatewaySuitePlatformSummary,
} from "./executiveGatewaySuitePlatform.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA86_FILES = Object.freeze([
  "executiveGatewaySuitePlatformTypes.ts",
  "executiveGatewaySuitePlatformNamespace.ts",
  "executiveGatewaySuitePlatformMetadata.ts",
  "executiveGatewaySuitePlatformOwnership.ts",
  "executiveGatewaySuitePlatformReadiness.ts",
  "executiveGatewaySuitePlatformSummary.ts",
  "executiveGatewaySuitePlatform.ts",
  "executiveGatewaySuitePlatform.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ExecutiveGatewaySuitePlatformId",
  "ExecutiveGatewaySuitePlatformVersion",
  "ExecutiveGatewaySuitePlatformName",
  "ExecutiveGatewaySuitePlatformNamespace",
  "ExecutiveGatewaySuitePlatformStatus",
  "ExecutiveGatewaySuitePlatformReadiness",
  "ExecutiveGatewaySuitePlatform",
  "getExecutiveGatewaySuitePlatformSummary",
] as const);

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "namespace",
  "metadata",
  "ownership",
  "boundaries",
  "readiness",
  "summary",
  "consumer",
] as const);

const EXPECTED_NAMESPACE_SECTIONS = Object.freeze([
  "foundation",
  "registry",
  "model",
  "validation",
  "manifest",
  "platform",
] as const);

const EXPECTED_COMPONENT_IDS = Object.freeze([
  "NEA-1",
  "NEA-2",
  "NEA-3",
  "NEA-4",
  "NEA-5",
  "NEA-6",
  "NEA-7",
] as const);

const EXPECTED_COMPONENT_NAMES = Object.freeze([
  "Executive Gateway",
  "Channel Connectors",
  "Session & Conversation",
  "Security Gateway",
  "Gateway Routing",
  "Message Normalization",
  "Intake Orchestration",
] as const);

describe("NEA-8:6 Executive Gateway Suite Platform", () => {
  it("creates exactly eight Platform files and eight public exports", () => {
    assert.equal(NEA86_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA86_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(PlatformModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(PlatformModule).length, 8);
  });

  it("has canonical platform identity, status Platform, and ReadyForCertification", () => {
    assert.equal(
      ExecutiveGatewaySuitePlatformId,
      "NEA-8:6/ExecutiveGatewaySuitePlatform",
    );
    assert.equal(ExecutiveGatewaySuitePlatformVersion, "1.0.0");
    assert.equal(
      ExecutiveGatewaySuitePlatformName,
      "Executive Gateway Suite Platform",
    );
    assert.equal(
      ExecutiveGatewaySuitePlatformNamespace,
      "nexora.nea.executive-gateway-suite.platform",
    );
    assert.equal(ExecutiveGatewaySuitePlatformStatus, "Platform");
    assert.equal(
      ExecutiveGatewaySuitePlatformReadiness,
      "ReadyForCertification",
    );
    assert.equal(ExecutiveGatewaySuitePlatform.identity.phase, "NEA-8:6");
    assert.equal(
      ExecutiveGatewaySuitePlatform.identity.manifestId,
      ExecutiveGatewaySuiteManifestId,
    );
    assert.equal(
      ExecutiveGatewaySuitePlatform.nextPhase,
      "NEA-8:7 — Executive Gateway Suite Certification",
    );
  });

  it("consumes only NEA-8:5 Manifest and preserves the canonical phase chain", () => {
    const dependency = ExecutiveGatewaySuitePlatform.dependency;
    assert.equal(dependency.manifestOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "executiveGatewaySuiteManifest.ts",
    );
    assert.equal(dependency.manifestId, ExecutiveGatewaySuiteManifestId);
    assert.equal(dependency.validationDirectImport, false);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.duplicatesUpstreamArchitecture, false);
    assert.equal(dependency.redefinesPriorPhases, false);
    assert.equal(
      ExecutiveGatewaySuitePlatform.manifestPlatform,
      ExecutiveGatewaySuiteManifestPlatform,
    );

    const ns = ExecutiveGatewaySuitePlatform.namespace;
    assert.equal(ns.sectionCount, 6);
    assert.deepEqual([...ns.sectionOrder], [...EXPECTED_NAMESPACE_SECTIONS]);
    assert.equal(ns.composedPhaseCount, 6);
    assert.equal(ns.foundation, ns.registry.foundationPlatform);
    assert.equal(ns.registry, ns.model.registryPlatform);
    assert.equal(ns.model, ns.validation.modelPlatform);
    assert.equal(ns.validation, ns.manifest.validationPlatform);
    assert.equal(ns.manifest, ExecutiveGatewaySuiteManifestPlatform);
    assert.ok(
      ns.composition.every((item) => item.ownership === "Referenced"),
    );
    assert.ok(
      ns.composition.every((item) => item.reconstructsPhase === false),
    );
    assert.deepEqual(
      ns.composition.map((item) => item.section),
      [...EXPECTED_NAMESPACE_SECTIONS],
    );
  });

  it("composes all seven suite components by canonical Manifest chain reference", () => {
    const ns = ExecutiveGatewaySuitePlatform.namespace;
    assert.equal(ns.suiteComponentCount, 7);
    assert.equal(
      ns.suiteComponentCount,
      ns.foundation.composition.componentCount,
    );
    assert.deepEqual(
      ns.suiteComponents.map((item) => item.componentId),
      [...EXPECTED_COMPONENT_IDS],
    );
    assert.deepEqual(
      ns.suiteComponents.map((item) => item.componentName),
      [...EXPECTED_COMPONENT_NAMES],
    );
    assert.ok(
      ns.suiteComponents.every((item) => item.ownership === "Referenced"),
    );
    assert.equal(
      ns.suiteComponents,
      ns.foundation.composition.components,
    );
    assert.equal(
      ns.suiteComponentCount,
      ExecutiveGatewaySuiteManifestPlatform.inventory.inventory.find(
        (item) => item.inventoryKey === "suiteComponents",
      )!.count,
    );
  });

  it("declares ownership and forbidden boundaries without runtime behavior", () => {
    const { ownership, boundaries } = ExecutiveGatewaySuitePlatform;
    assert.ok(ownership.owns.includes("Platform Identity"));
    assert.ok(ownership.owns.includes("Platform Namespace"));
    assert.ok(ownership.owns.includes("Platform Summary"));
    assert.ok(ownership.doesNotOwn.includes("Foundation"));
    assert.ok(ownership.doesNotOwn.includes("Registry"));
    assert.ok(ownership.doesNotOwn.includes("Model"));
    assert.ok(ownership.doesNotOwn.includes("Validation"));
    assert.ok(ownership.doesNotOwn.includes("Manifest"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Gateway"));
    assert.ok(ownership.doesNotOwn.includes("DKL"));
    assert.equal(ownership.ownsFoundation, false);
    assert.equal(ownership.ownsManifest, false);
    assert.equal(ownership.ownsRuntimeGateway, false);

    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime Gateway"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Validation Engine"));
    assert.ok(boundaries.prohibitedSurfaces.includes("DKL invocation"));
    assert.equal(boundaries.implementsRuntimeGateway, false);
    assert.equal(boundaries.validationEngine, false);
    assert.equal(boundaries.validationDirectImport, false);
    assert.equal(boundaries.foundationDirectImport, false);
    assert.equal(boundaries.duplicatesUpstreamArchitecture, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = ExecutiveGatewaySuitePlatform;
    const keys = Object.keys(platform);
    assert.deepEqual(keys.slice(0, 9), [...PLATFORM_SECTIONS]);
    assert.equal(platform.sectionCount, 9);
    assert.deepEqual([...platform.sectionOrder], [...PLATFORM_SECTIONS]);
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(platform.namespace), true);
    assert.equal(Object.isFrozen(platform.metadata), true);
    assert.equal(Object.isFrozen(platform.ownership), true);
    assert.equal(Object.isFrozen(platform.boundaries), true);
    assert.equal(Object.isFrozen(platform.readiness), true);
    assert.equal(Object.isFrozen(platform.summary), true);
    assert.equal(Object.isFrozen(platform.consumer), true);
  });

  it("derives deterministic summary with public API inventory of 532 from Manifest", () => {
    const summaryA = getExecutiveGatewaySuitePlatformSummary();
    const summaryB = getExecutiveGatewaySuitePlatformSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.platformId, ExecutiveGatewaySuitePlatformId);
    assert.equal(summaryA.status, "Platform");
    assert.equal(summaryA.readiness, "ReadyForCertification");
    assert.equal(summaryA.manifestId, ExecutiveGatewaySuiteManifestId);
    assert.equal(summaryA.compositionMode, "CanonicalReferenceOnly");
    assert.equal(summaryA.canonicalReferenceMode, "ManifestOnly");
    assert.equal(summaryA.architectureVersion, "NEA-8.0.0");
    assert.equal(summaryA.composedPhaseCount, 6);
    assert.equal(summaryA.namespaceSectionCount, 6);
    assert.equal(summaryA.suiteComponentCount, 7);
    assert.equal(summaryA.phaseReferenceCount, 4);
    assert.equal(summaryA.inventoryEntryCount, 20);
    assert.equal(
      summaryA.totalArchitectureCount,
      ExecutiveGatewaySuiteManifestPlatform.inventory.totalArchitectureCount,
    );
    assert.equal(summaryA.publicApiInventoryTotal, 532);
    assert.equal(
      summaryA.publicApiInventoryTotal,
      ExecutiveGatewaySuiteManifestPlatform.inventory.publicApiInventoryTotal,
    );
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 9);
    assert.equal(summaryA.architectureStatus, "PlatformComposed");
    assert.equal(
      summaryA.nextPhase,
      "NEA-8:7 — Executive Gateway Suite Certification",
    );
    assert.equal(
      ExecutiveGatewaySuitePlatform.metadata.countsHardcoded,
      false,
    );
    assert.equal(
      ExecutiveGatewaySuitePlatform.metadata.canonicalReferenceMode,
      "ManifestOnly",
    );
  });

  it("declares ReadyForCertification only and no forbidden runtime implementation", () => {
    assert.equal(
      ExecutiveGatewaySuitePlatform.readiness.readiness,
      "ReadyForCertification",
    );
    assert.equal(
      ExecutiveGatewaySuitePlatform.readiness.claimsRuntimeReady,
      false,
    );
    assert.equal(
      ExecutiveGatewaySuitePlatform.readiness.evaluatesRuntimeReadiness,
      false,
    );
    assert.equal(ExecutiveGatewaySuitePlatform.runtimeBehavior, false);
    assert.equal(ExecutiveGatewaySuitePlatform.validationExecution, false);
    assert.equal(
      ExecutiveGatewaySuitePlatform.implementsRuntimeGateway,
      false,
    );
    assert.equal(
      ExecutiveGatewaySuitePlatform.implementsRuntimeConnectors,
      false,
    );
    assert.equal(ExecutiveGatewaySuitePlatform.invokesDkl, false);
    assert.equal(
      ExecutiveGatewaySuitePlatform.invokesExecutiveEngine,
      false,
    );
    assert.equal(ExecutiveGatewaySuitePlatform.invokesAssistant, false);
    assert.equal(ExecutiveGatewaySuitePlatform.aiReasoning, false);
    assert.equal(ExecutiveGatewaySuitePlatform.businessLogic, false);
  });
});
