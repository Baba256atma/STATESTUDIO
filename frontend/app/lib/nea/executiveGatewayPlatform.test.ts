/**
 * NEA-1:6 — Executive Gateway Platform Tests.
 *
 * Deterministic coverage for the immutable Executive Gateway Platform.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ExecutiveGatewayManifestId,
  ExecutiveGatewayManifestPlatform,
} from "./executiveGatewayManifest.ts";
import * as PlatformModule from "./executiveGatewayPlatform.ts";
import {
  ExecutiveGatewayPlatform,
  ExecutiveGatewayPlatformId,
  ExecutiveGatewayPlatformName,
  ExecutiveGatewayPlatformNamespace,
  ExecutiveGatewayPlatformReadiness,
  ExecutiveGatewayPlatformStatus,
  ExecutiveGatewayPlatformVersion,
  getExecutiveGatewayPlatformSummary,
} from "./executiveGatewayPlatform.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA16_FILES = Object.freeze([
  "executiveGatewayPlatformTypes.ts",
  "executiveGatewayPlatformNamespace.ts",
  "executiveGatewayPlatformMetadata.ts",
  "executiveGatewayPlatformOwnership.ts",
  "executiveGatewayPlatformReadiness.ts",
  "executiveGatewayPlatformSummary.ts",
  "executiveGatewayPlatform.ts",
  "executiveGatewayPlatform.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ExecutiveGatewayPlatformId",
  "ExecutiveGatewayPlatformVersion",
  "ExecutiveGatewayPlatformName",
  "ExecutiveGatewayPlatformNamespace",
  "ExecutiveGatewayPlatformStatus",
  "ExecutiveGatewayPlatformReadiness",
  "ExecutiveGatewayPlatform",
  "getExecutiveGatewayPlatformSummary",
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

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-1:6 Executive Gateway Platform", () => {
  it("creates exactly eight Platform files and eight public exports", () => {
    assert.equal(NEA16_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA16_FILES) {
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
      ExecutiveGatewayPlatformId,
      "NEA-1:6/ExecutiveGatewayPlatform",
    );
    assert.equal(ExecutiveGatewayPlatformVersion, "1.0.0");
    assert.equal(ExecutiveGatewayPlatformName, "Executive Gateway Platform");
    assert.equal(
      ExecutiveGatewayPlatformNamespace,
      "nexora.nea.executive-gateway.platform",
    );
    assert.equal(ExecutiveGatewayPlatformStatus, "Platform");
    assert.equal(ExecutiveGatewayPlatformReadiness, "ReadyForCertification");
    assert.equal(ExecutiveGatewayPlatform.identity.phase, "NEA-1:6");
    assert.equal(ExecutiveGatewayPlatform.identity.layer, "NEA");
    assert.equal(
      ExecutiveGatewayPlatform.identity.manifestId,
      ExecutiveGatewayManifestId,
    );
    assert.equal(
      ExecutiveGatewayPlatform.readiness.readiness,
      "ReadyForCertification",
    );
    assert.equal(
      ExecutiveGatewayPlatform.nextPhase,
      "NEA-1:7 — Executive Gateway Certification",
    );
  });

  it("consumes only NEA-1:5 Manifest and preserves canonical phase chain", () => {
    const dependency = ExecutiveGatewayPlatform.dependency;
    assert.equal(dependency.manifestOnly, true);
    assert.equal(dependency.manifestPublicSurfaceOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "executiveGatewayManifest.ts",
    );
    assert.equal(dependency.manifestId, ExecutiveGatewayManifestId);
    assert.equal(dependency.validationDirectImport, false);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.duplicatesUpstreamArchitecture, false);
    assert.equal(dependency.redefinesPriorPhases, false);
    assert.equal(
      ExecutiveGatewayPlatform.manifestPlatform,
      ExecutiveGatewayManifestPlatform,
    );

    const ns = ExecutiveGatewayPlatform.namespace;
    assert.equal(ns.manifest, ExecutiveGatewayManifestPlatform);
    assert.equal(
      ns.validation,
      ExecutiveGatewayManifestPlatform.validationPlatform,
    );
    assert.equal(
      ns.model,
      ExecutiveGatewayManifestPlatform.validationPlatform.modelPlatform,
    );
    assert.equal(
      ns.registry,
      ExecutiveGatewayManifestPlatform.validationPlatform.modelPlatform
        .registryPlatform,
    );
    assert.equal(
      ns.foundation,
      ExecutiveGatewayManifestPlatform.validationPlatform.modelPlatform
        .registryPlatform.foundationPlatform,
    );
  });

  it("exposes complete platform namespace by reference only", () => {
    const ns = ExecutiveGatewayPlatform.namespace;
    assert.deepEqual([...ns.sectionOrder], [...EXPECTED_NAMESPACE_SECTIONS]);
    assert.equal(ns.sectionCount, 6);
    assert.equal(ns.composedPhaseCount, 6);
    assert.equal(ns.reconstructsUpstream, false);
    assert.equal(ns.duplicatesArchitecture, false);
    assert.deepEqual(
      ns.composition.map((item) => item.section),
      [...EXPECTED_NAMESPACE_SECTIONS],
    );
    assertUnique(
      ns.composition.map((item) => item.phaseId),
      "phase ids",
    );
    assert.ok(ns.composition.every((item) => item.ownership === "Referenced"));
    assert.ok(
      ns.composition.every((item) => item.reconstructsPhase === false),
    );
    assert.ok(
      ns.composition.every((item) => item.duplicatesArchitecture === false),
    );
    assert.equal(Object.isFrozen(ns), true);
    assert.equal(Object.isFrozen(ns.foundation), true);
    assert.equal(Object.isFrozen(ns.registry), true);
    assert.equal(Object.isFrozen(ns.model), true);
    assert.equal(Object.isFrozen(ns.validation), true);
    assert.equal(Object.isFrozen(ns.manifest), true);
  });

  it("declares ownership and forbidden boundaries without runtime behavior", () => {
    const { ownership, boundaries } = ExecutiveGatewayPlatform;
    assert.ok(ownership.owns.includes("Platform Composition"));
    assert.ok(ownership.owns.includes("Platform Namespace"));
    assert.ok(ownership.owns.includes("Consumer Readiness"));
    assert.ok(ownership.doesNotOwn.includes("Foundation Contracts"));
    assert.ok(ownership.doesNotOwn.includes("Registry Collections"));
    assert.ok(ownership.doesNotOwn.includes("Domain Models"));
    assert.ok(ownership.doesNotOwn.includes("Validation Rules"));
    assert.ok(ownership.doesNotOwn.includes("Manifest Inventory"));
    assert.ok(ownership.doesNotOwn.includes("DKL"));
    assert.equal(ownership.ownsFoundationContracts, false);
    assert.equal(ownership.ownsManifestInventory, false);

    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime processing"));
    assert.ok(boundaries.prohibitedSurfaces.includes("HTTP"));
    assert.ok(boundaries.prohibitedSurfaces.includes("DKL invocation"));
    assert.equal(boundaries.executesValidation, false);
    assert.equal(boundaries.executesRouting, false);
    assert.equal(boundaries.invokesDkl, false);
    assert.equal(boundaries.duplicatesUpstreamArchitecture, false);
    assert.equal(boundaries.redefinesPriorPhases, false);
    assert.ok(
      boundaries.consumerAccessRule.includes("ExecutiveGatewayPlatform"),
    );
  });

  it("preserves ordered platform sections and immutable consumer surface", () => {
    const platform = ExecutiveGatewayPlatform;
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
    assert.equal(
      platform.consumer.soleSupportedEntryPoint,
      "executiveGatewayPlatform.ts",
    );
  });

  it("derives deterministic summary from canonical upstream collections", () => {
    const summaryA = getExecutiveGatewayPlatformSummary();
    const summaryB = getExecutiveGatewayPlatformSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.platformId, ExecutiveGatewayPlatformId);
    assert.equal(summaryA.status, "Platform");
    assert.equal(summaryA.readiness, "ReadyForCertification");
    assert.equal(summaryA.manifestId, ExecutiveGatewayManifestId);
    assert.equal(summaryA.composedPhaseCount, 6);
    assert.equal(summaryA.namespaceSectionCount, 6);
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 9);
    assert.equal(summaryA.architectureStatus, "PlatformComposed");
    assert.equal(
      summaryA.inventoryEntryCount,
      ExecutiveGatewayManifestPlatform.inventory.inventoryEntryCount,
    );
    assert.equal(
      summaryA.totalArchitectureCount,
      ExecutiveGatewayManifestPlatform.inventory.totalArchitectureCount,
    );
    assert.equal(
      summaryA.nextPhase,
      "NEA-1:7 — Executive Gateway Certification",
    );
    assert.equal(ExecutiveGatewayPlatform.metadata.countsHardcoded, false);
    assert.equal(
      ExecutiveGatewayPlatform.metadata.duplicatesUpstreamArchitecture,
      false,
    );
  });

  it("declares ReadyForCertification only and no forbidden runtime implementation", () => {
    assert.equal(
      ExecutiveGatewayPlatform.readiness.readiness,
      "ReadyForCertification",
    );
    assert.equal(ExecutiveGatewayPlatform.readiness.consumerReady, true);
    assert.equal(
      ExecutiveGatewayPlatform.readiness.claimsReadyForFreeze,
      false,
    );
    assert.equal(
      ExecutiveGatewayPlatform.readiness.claimsRuntimeReady,
      false,
    );
    assert.equal(ExecutiveGatewayPlatform.runtimeBehavior, false);
    assert.equal(ExecutiveGatewayPlatform.validationExecution, false);
    assert.equal(ExecutiveGatewayPlatform.routingExecution, false);
    assert.equal(ExecutiveGatewayPlatform.authenticationExecution, false);
    assert.equal(ExecutiveGatewayPlatform.authorizationExecution, false);
    assert.equal(ExecutiveGatewayPlatform.aiReasoning, false);
    assert.equal(ExecutiveGatewayPlatform.persistenceBehavior, false);
  });
});
