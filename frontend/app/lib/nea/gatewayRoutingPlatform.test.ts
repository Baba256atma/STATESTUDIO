/**
 * NEA-5:6 — Gateway Routing Platform Tests.
 *
 * Deterministic coverage for the immutable Gateway Routing Platform.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  GatewayRoutingManifestId,
  GatewayRoutingManifestPlatform,
} from "./gatewayRoutingManifest.ts";
import * as PlatformModule from "./gatewayRoutingPlatform.ts";
import {
  GatewayRoutingPlatform,
  GatewayRoutingPlatformId,
  GatewayRoutingPlatformName,
  GatewayRoutingPlatformNamespace,
  GatewayRoutingPlatformReadiness,
  GatewayRoutingPlatformStatus,
  GatewayRoutingPlatformVersion,
  getGatewayRoutingPlatformSummary,
} from "./gatewayRoutingPlatform.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA56_FILES = Object.freeze([
  "gatewayRoutingPlatformTypes.ts",
  "gatewayRoutingPlatformNamespace.ts",
  "gatewayRoutingPlatformMetadata.ts",
  "gatewayRoutingPlatformOwnership.ts",
  "gatewayRoutingPlatformReadiness.ts",
  "gatewayRoutingPlatformSummary.ts",
  "gatewayRoutingPlatform.ts",
  "gatewayRoutingPlatform.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "GatewayRoutingPlatformId",
  "GatewayRoutingPlatformVersion",
  "GatewayRoutingPlatformName",
  "GatewayRoutingPlatformNamespace",
  "GatewayRoutingPlatformStatus",
  "GatewayRoutingPlatformReadiness",
  "GatewayRoutingPlatform",
  "getGatewayRoutingPlatformSummary",
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

describe("NEA-5:6 Gateway Routing Platform", () => {
  it("creates exactly eight Platform files and eight public exports", () => {
    assert.equal(NEA56_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA56_FILES) {
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
      GatewayRoutingPlatformId,
      "NEA-5:6/GatewayRoutingPlatform",
    );
    assert.equal(GatewayRoutingPlatformVersion, "1.0.0");
    assert.equal(
      GatewayRoutingPlatformName,
      "Gateway Routing Platform",
    );
    assert.equal(
      GatewayRoutingPlatformNamespace,
      "nexora.nea.gateway-routing.platform",
    );
    assert.equal(GatewayRoutingPlatformStatus, "Platform");
    assert.equal(
      GatewayRoutingPlatformReadiness,
      "ReadyForCertification",
    );
    assert.equal(GatewayRoutingPlatform.identity.phase, "NEA-5:6");
    assert.equal(
      GatewayRoutingPlatform.identity.manifestId,
      GatewayRoutingManifestId,
    );
    assert.equal(
      GatewayRoutingPlatform.nextPhase,
      "NEA-5:7 — Gateway Routing Certification",
    );
  });

  it("consumes only NEA-5:5 Manifest and preserves the canonical phase chain", () => {
    const dependency = GatewayRoutingPlatform.dependency;
    assert.equal(dependency.manifestOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "gatewayRoutingManifest.ts",
    );
    assert.equal(dependency.manifestId, GatewayRoutingManifestId);
    assert.equal(dependency.validationDirectImport, false);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.duplicatesUpstreamArchitecture, false);
    assert.equal(dependency.redefinesPriorPhases, false);
    assert.equal(
      GatewayRoutingPlatform.manifestPlatform,
      GatewayRoutingManifestPlatform,
    );

    const ns = GatewayRoutingPlatform.namespace;
    assert.equal(ns.foundation, ns.registry.foundationPlatform);
    assert.equal(ns.registry, ns.model.registryPlatform);
    assert.equal(ns.model, ns.validation.modelPlatform);
    assert.equal(ns.validation, ns.manifest.validationPlatform);
    assert.equal(ns.manifest, GatewayRoutingManifestPlatform);
  });

  it("exposes a six-section namespace with complete phase composition", () => {
    const ns = GatewayRoutingPlatform.namespace;
    assert.deepEqual([...ns.sectionOrder], [...EXPECTED_NAMESPACE_SECTIONS]);
    assert.equal(ns.sectionCount, 6);
    assert.equal(ns.composedPhaseCount, 6);
    assert.equal(ns.composition.length, 6);
    assert.equal(ns.reconstructsUpstream, false);
    assert.equal(ns.duplicatesArchitecture, false);

    assert.deepEqual(
      ns.composition.map((item) => item.section),
      [...EXPECTED_NAMESPACE_SECTIONS],
    );
    assert.ok(ns.composition.every((item) => item.ownership === "Referenced"));
    assert.ok(
      ns.composition.every((item) => item.reconstructsPhase === false),
    );
    assert.ok(
      ns.composition.every((item) => item.duplicatesArchitecture === false),
    );
    assert.equal(ns.composition[5]?.module, "gatewayRoutingPlatform.ts");
    assert.equal(ns.composition[5]?.phaseId, GatewayRoutingPlatformId);
  });

  it("declares ownership, consumer surface, and forbidden boundaries", () => {
    const { ownership, boundaries, consumer } = GatewayRoutingPlatform;
    assert.ok(ownership.owns.includes("Platform Namespace"));
    assert.ok(ownership.owns.includes("Platform Metadata"));
    assert.ok(ownership.owns.includes("Consumer Composition"));
    assert.ok(ownership.owns.includes("Platform Readiness"));
    assert.ok(ownership.doesNotOwn.includes("Foundation Contracts"));
    assert.ok(ownership.doesNotOwn.includes("Manifest Inventory"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Routing"));
    assert.ok(ownership.doesNotOwn.includes("Routing Algorithms"));
    assert.equal(ownership.ownsManifestInventory, false);
    assert.equal(ownership.ownsRuntimeRouting, false);

    assert.equal(
      consumer.soleSupportedEntryPoint,
      "gatewayRoutingPlatform.ts",
    );
    assert.ok(
      boundaries.consumerAccessRule.includes("GatewayRoutingPlatform"),
    );
    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime Routing"));
    assert.ok(boundaries.prohibitedSurfaces.includes("HTTP"));
    assert.ok(boundaries.prohibitedSurfaces.includes("DKL invocation"));
    assert.equal(boundaries.implementsRuntimeRouting, false);
    assert.equal(boundaries.executesStrategies, false);
    assert.equal(boundaries.duplicatesUpstreamArchitecture, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = GatewayRoutingPlatform;
    const keys = Object.keys(platform);
    assert.deepEqual(keys.slice(0, 9), [...PLATFORM_SECTIONS]);
    assert.equal(platform.sectionCount, 9);
    assert.deepEqual([...platform.sectionOrder], [...PLATFORM_SECTIONS]);
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(platform.namespace), true);
    assert.equal(Object.isFrozen(platform.namespace.composition), true);
    assert.equal(Object.isFrozen(platform.metadata), true);
    assert.equal(Object.isFrozen(platform.ownership), true);
    assert.equal(Object.isFrozen(platform.boundaries), true);
    assert.equal(Object.isFrozen(platform.readiness), true);
    assert.equal(Object.isFrozen(platform.summary), true);
    assert.equal(Object.isFrozen(platform.consumer), true);
  });

  it("derives deterministic summary from canonical Manifest collections", () => {
    const summaryA = getGatewayRoutingPlatformSummary();
    const summaryB = getGatewayRoutingPlatformSummary();
    const manifest = GatewayRoutingManifestPlatform;
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.platformId, GatewayRoutingPlatformId);
    assert.equal(summaryA.status, "Platform");
    assert.equal(summaryA.readiness, "ReadyForCertification");
    assert.equal(summaryA.manifestId, GatewayRoutingManifestId);
    assert.equal(summaryA.composedPhaseCount, 6);
    assert.equal(summaryA.namespaceSectionCount, 6);
    assert.equal(
      summaryA.phaseReferenceCount,
      manifest.inventory.phaseReferenceCount,
    );
    assert.equal(
      summaryA.inventoryEntryCount,
      manifest.inventory.inventoryEntryCount,
    );
    assert.equal(
      summaryA.totalArchitectureCount,
      manifest.inventory.totalArchitectureCount,
    );
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 9);
    assert.equal(summaryA.architectureStatus, "PlatformComposed");
    assert.equal(
      summaryA.nextPhase,
      "NEA-5:7 — Gateway Routing Certification",
    );
    assert.equal(GatewayRoutingPlatform.metadata.countsHardcoded, false);
    assert.equal(
      GatewayRoutingPlatform.metadata.compositionMode,
      "CanonicalReferenceOnly",
    );
    assert.equal(
      GatewayRoutingPlatform.metadata.architectureVersion,
      "NEA-5.0.0",
    );
    assert.equal(
      GatewayRoutingPlatform.metadata.consumerEntryPoint,
      "gatewayRoutingPlatform.ts",
    );
  });

  it("declares ReadyForCertification only and no forbidden runtime implementation", () => {
    assert.equal(
      GatewayRoutingPlatform.readiness.readiness,
      "ReadyForCertification",
    );
    assert.equal(GatewayRoutingPlatform.readiness.consumerReady, true);
    assert.equal(
      GatewayRoutingPlatform.readiness.claimsReadyForFreeze,
      false,
    );
    assert.equal(
      GatewayRoutingPlatform.readiness.claimsRuntimeReady,
      false,
    );
    assert.equal(GatewayRoutingPlatform.runtimeBehavior, false);
    assert.equal(GatewayRoutingPlatform.validationExecution, false);
    assert.equal(GatewayRoutingPlatform.implementsRuntimeRouting, false);
    assert.equal(GatewayRoutingPlatform.implementsRoutingAlgorithms, false);
    assert.equal(GatewayRoutingPlatform.executesStrategies, false);
    assert.equal(GatewayRoutingPlatform.aiReasoning, false);
  });
});
