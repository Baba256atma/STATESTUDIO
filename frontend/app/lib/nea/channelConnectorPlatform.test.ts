/**
 * NEA-2:6 — Channel Connectors Platform Tests.
 *
 * Deterministic coverage for the immutable Channel Connectors Platform.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ChannelConnectorManifestId,
  ChannelConnectorManifestPlatform,
} from "./channelConnectorManifest.ts";
import * as PlatformModule from "./channelConnectorPlatform.ts";
import {
  ChannelConnectorPlatform,
  ChannelConnectorPlatformId,
  ChannelConnectorPlatformName,
  ChannelConnectorPlatformNamespace,
  ChannelConnectorPlatformReadiness,
  ChannelConnectorPlatformStatus,
  ChannelConnectorPlatformVersion,
  getChannelConnectorPlatformSummary,
} from "./channelConnectorPlatform.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA26_FILES = Object.freeze([
  "channelConnectorPlatformTypes.ts",
  "channelConnectorPlatformNamespace.ts",
  "channelConnectorPlatformMetadata.ts",
  "channelConnectorPlatformOwnership.ts",
  "channelConnectorPlatformReadiness.ts",
  "channelConnectorPlatformSummary.ts",
  "channelConnectorPlatform.ts",
  "channelConnectorPlatform.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ChannelConnectorPlatformId",
  "ChannelConnectorPlatformVersion",
  "ChannelConnectorPlatformName",
  "ChannelConnectorPlatformNamespace",
  "ChannelConnectorPlatformStatus",
  "ChannelConnectorPlatformReadiness",
  "ChannelConnectorPlatform",
  "getChannelConnectorPlatformSummary",
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

describe("NEA-2:6 Channel Connectors Platform", () => {
  it("creates exactly eight Platform files and eight public exports", () => {
    assert.equal(NEA26_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA26_FILES) {
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
      ChannelConnectorPlatformId,
      "NEA-2:6/ChannelConnectorPlatform",
    );
    assert.equal(ChannelConnectorPlatformVersion, "1.0.0");
    assert.equal(
      ChannelConnectorPlatformName,
      "Channel Connectors Platform",
    );
    assert.equal(
      ChannelConnectorPlatformNamespace,
      "nexora.nea.channel-connectors.platform",
    );
    assert.equal(ChannelConnectorPlatformStatus, "Platform");
    assert.equal(ChannelConnectorPlatformReadiness, "ReadyForCertification");
    assert.equal(ChannelConnectorPlatform.identity.phase, "NEA-2:6");
    assert.equal(
      ChannelConnectorPlatform.identity.manifestId,
      ChannelConnectorManifestId,
    );
    assert.equal(
      ChannelConnectorPlatform.nextPhase,
      "NEA-2:7 — Channel Connectors Certification",
    );
  });

  it("consumes only NEA-2:5 Manifest and preserves the canonical phase chain", () => {
    const dependency = ChannelConnectorPlatform.dependency;
    assert.equal(dependency.manifestOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "channelConnectorManifest.ts",
    );
    assert.equal(dependency.manifestId, ChannelConnectorManifestId);
    assert.equal(dependency.validationDirectImport, false);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.duplicatesUpstreamArchitecture, false);
    assert.equal(dependency.redefinesPriorPhases, false);
    assert.equal(
      ChannelConnectorPlatform.manifestPlatform,
      ChannelConnectorManifestPlatform,
    );

    const ns = ChannelConnectorPlatform.namespace;
    assert.equal(ns.foundation, ns.registry.foundationPlatform);
    assert.equal(ns.registry, ns.model.registryPlatform);
    assert.equal(ns.model, ns.validation.modelPlatform);
    assert.equal(ns.validation, ns.manifest.validationPlatform);
    assert.equal(ns.manifest, ChannelConnectorManifestPlatform);
  });

  it("exposes a six-section namespace with complete phase composition", () => {
    const ns = ChannelConnectorPlatform.namespace;
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
    assert.equal(ns.composition[5]?.module, "channelConnectorPlatform.ts");
    assert.equal(ns.composition[5]?.phaseId, ChannelConnectorPlatformId);
  });

  it("declares ownership, consumer surface, and forbidden boundaries", () => {
    const { ownership, boundaries, consumer } = ChannelConnectorPlatform;
    assert.ok(ownership.owns.includes("Platform Composition"));
    assert.ok(ownership.owns.includes("Platform Namespace"));
    assert.ok(ownership.owns.includes("Consumer Readiness"));
    assert.ok(ownership.doesNotOwn.includes("Foundation Contracts"));
    assert.ok(ownership.doesNotOwn.includes("Manifest Inventory"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Connectors"));
    assert.equal(ownership.ownsManifestInventory, false);
    assert.equal(ownership.ownsRuntimeConnectors, false);

    assert.equal(
      consumer.soleSupportedEntryPoint,
      "channelConnectorPlatform.ts",
    );
    assert.ok(
      boundaries.consumerAccessRule.includes("ChannelConnectorPlatform"),
    );
    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime connectors"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Telegram Bot"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Validation Engine"));
    assert.equal(boundaries.implementsConnectors, false);
    assert.equal(boundaries.duplicatesUpstreamArchitecture, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = ChannelConnectorPlatform;
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

  it("derives deterministic summary from canonical upstream collections", () => {
    const summaryA = getChannelConnectorPlatformSummary();
    const summaryB = getChannelConnectorPlatformSummary();
    const manifest = ChannelConnectorManifestPlatform;
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.platformId, ChannelConnectorPlatformId);
    assert.equal(summaryA.status, "Platform");
    assert.equal(summaryA.readiness, "ReadyForCertification");
    assert.equal(summaryA.manifestId, ChannelConnectorManifestId);
    assert.equal(summaryA.composedPhaseCount, 6);
    assert.equal(summaryA.namespaceSectionCount, 6);
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
      "NEA-2:7 — Channel Connectors Certification",
    );
    assert.equal(
      ChannelConnectorPlatform.metadata.compatibility.compositionMode,
      "CanonicalReferenceOnly",
    );
    assert.equal(ChannelConnectorPlatform.metadata.countsHardcoded, false);
    assert.equal(
      ChannelConnectorPlatform.metadata.duplicatesUpstreamArchitecture,
      false,
    );
    assert.equal(ChannelConnectorPlatform.readiness.consumerReady, true);
    assert.equal(ChannelConnectorPlatform.runtimeBehavior, false);
    assert.equal(ChannelConnectorPlatform.implementsConnectors, false);
    assert.equal(ChannelConnectorPlatform.validationExecution, false);
    assert.equal(ChannelConnectorPlatform.oauthFlow, false);
  });
});
