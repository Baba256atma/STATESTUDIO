/**
 * NEA-6:6 — Message Normalization Platform Tests.
 *
 * Deterministic coverage for the immutable Message Normalization Platform.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  MessageNormalizationManifestId,
  MessageNormalizationManifestPlatform,
} from "./messageNormalizationManifest.ts";
import * as PlatformModule from "./messageNormalizationPlatform.ts";
import {
  MessageNormalizationPlatform,
  MessageNormalizationPlatformId,
  MessageNormalizationPlatformName,
  MessageNormalizationPlatformNamespace,
  MessageNormalizationPlatformReadiness,
  MessageNormalizationPlatformStatus,
  MessageNormalizationPlatformVersion,
  getMessageNormalizationPlatformSummary,
} from "./messageNormalizationPlatform.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA66_FILES = Object.freeze([
  "messageNormalizationPlatformTypes.ts",
  "messageNormalizationPlatformNamespace.ts",
  "messageNormalizationPlatformMetadata.ts",
  "messageNormalizationPlatformOwnership.ts",
  "messageNormalizationPlatformReadiness.ts",
  "messageNormalizationPlatformSummary.ts",
  "messageNormalizationPlatform.ts",
  "messageNormalizationPlatform.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "MessageNormalizationPlatformId",
  "MessageNormalizationPlatformVersion",
  "MessageNormalizationPlatformName",
  "MessageNormalizationPlatformNamespace",
  "MessageNormalizationPlatformStatus",
  "MessageNormalizationPlatformReadiness",
  "MessageNormalizationPlatform",
  "getMessageNormalizationPlatformSummary",
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

describe("NEA-6:6 Message Normalization Platform", () => {
  it("creates exactly eight Platform files and eight public exports", () => {
    assert.equal(NEA66_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA66_FILES) {
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
      MessageNormalizationPlatformId,
      "NEA-6:6/MessageNormalizationPlatform",
    );
    assert.equal(MessageNormalizationPlatformVersion, "1.0.0");
    assert.equal(
      MessageNormalizationPlatformName,
      "Message Normalization Platform",
    );
    assert.equal(
      MessageNormalizationPlatformNamespace,
      "nexora.nea.message-normalization.platform",
    );
    assert.equal(MessageNormalizationPlatformStatus, "Platform");
    assert.equal(
      MessageNormalizationPlatformReadiness,
      "ReadyForCertification",
    );
    assert.equal(MessageNormalizationPlatform.identity.phase, "NEA-6:6");
    assert.equal(
      MessageNormalizationPlatform.identity.manifestId,
      MessageNormalizationManifestId,
    );
    assert.equal(
      MessageNormalizationPlatform.nextPhase,
      "NEA-6:7 — Message Normalization Certification",
    );
  });

  it("consumes only NEA-6:5 Manifest and preserves the canonical phase chain", () => {
    const dependency = MessageNormalizationPlatform.dependency;
    assert.equal(dependency.manifestOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "messageNormalizationManifest.ts",
    );
    assert.equal(dependency.manifestId, MessageNormalizationManifestId);
    assert.equal(dependency.validationDirectImport, false);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.duplicatesUpstreamArchitecture, false);
    assert.equal(dependency.redefinesPriorPhases, false);
    assert.equal(
      MessageNormalizationPlatform.manifestPlatform,
      MessageNormalizationManifestPlatform,
    );

    const ns = MessageNormalizationPlatform.namespace;
    assert.equal(ns.foundation, ns.registry.foundationPlatform);
    assert.equal(ns.registry, ns.model.registryPlatform);
    assert.equal(ns.model, ns.validation.modelPlatform);
    assert.equal(ns.validation, ns.manifest.validationPlatform);
    assert.equal(ns.manifest, MessageNormalizationManifestPlatform);
  });

  it("exposes a six-section namespace with complete phase composition", () => {
    const ns = MessageNormalizationPlatform.namespace;
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
    assert.equal(
      ns.composition[5]?.module,
      "messageNormalizationPlatform.ts",
    );
    assert.equal(ns.composition[5]?.phaseId, MessageNormalizationPlatformId);
  });

  it("declares ownership, consumer surface, and forbidden boundaries", () => {
    const { ownership, boundaries, consumer } = MessageNormalizationPlatform;
    assert.ok(ownership.owns.includes("Platform Namespace"));
    assert.ok(ownership.owns.includes("Platform Metadata"));
    assert.ok(ownership.owns.includes("Consumer Composition"));
    assert.ok(ownership.owns.includes("Platform Readiness"));
    assert.ok(ownership.doesNotOwn.includes("Foundation Contracts"));
    assert.ok(ownership.doesNotOwn.includes("Manifest Inventories"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Normalization"));
    assert.ok(ownership.doesNotOwn.includes("Parsing"));
    assert.equal(ownership.ownsManifestInventories, false);
    assert.equal(ownership.ownsRuntimeNormalization, false);

    assert.equal(
      consumer.soleSupportedEntryPoint,
      "messageNormalizationPlatform.ts",
    );
    assert.ok(
      boundaries.consumerAccessRule.includes("MessageNormalizationPlatform"),
    );
    assert.ok(
      boundaries.prohibitedSurfaces.includes("Runtime Normalization"),
    );
    assert.ok(boundaries.prohibitedSurfaces.includes("HTTP"));
    assert.ok(boundaries.prohibitedSurfaces.includes("DKL invocation"));
    assert.equal(boundaries.implementsRuntimeNormalization, false);
    assert.equal(boundaries.parsesPayloads, false);
    assert.equal(boundaries.duplicatesUpstreamArchitecture, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = MessageNormalizationPlatform;
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
    const summaryA = getMessageNormalizationPlatformSummary();
    const summaryB = getMessageNormalizationPlatformSummary();
    const manifest = MessageNormalizationManifestPlatform;
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.platformId, MessageNormalizationPlatformId);
    assert.equal(summaryA.status, "Platform");
    assert.equal(summaryA.readiness, "ReadyForCertification");
    assert.equal(summaryA.manifestId, MessageNormalizationManifestId);
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
      "NEA-6:7 — Message Normalization Certification",
    );
    assert.equal(MessageNormalizationPlatform.metadata.countsHardcoded, false);
    assert.equal(
      MessageNormalizationPlatform.metadata.compositionMode,
      "CanonicalReferenceOnly",
    );
    assert.equal(
      MessageNormalizationPlatform.metadata.architectureVersion,
      "NEA-6.0.0",
    );
    assert.equal(
      MessageNormalizationPlatform.metadata.namespaceVersion,
      "1.0.0",
    );
    assert.equal(
      MessageNormalizationPlatform.metadata.consumerEntryPoint,
      "messageNormalizationPlatform.ts",
    );
  });

  it("declares ReadyForCertification only and no forbidden runtime implementation", () => {
    assert.equal(
      MessageNormalizationPlatform.readiness.readiness,
      "ReadyForCertification",
    );
    assert.equal(MessageNormalizationPlatform.readiness.consumerReady, true);
    assert.equal(
      MessageNormalizationPlatform.readiness.claimsReadyForFreeze,
      false,
    );
    assert.equal(
      MessageNormalizationPlatform.readiness.claimsRuntimeReady,
      false,
    );
    assert.equal(MessageNormalizationPlatform.runtimeBehavior, false);
    assert.equal(MessageNormalizationPlatform.validationExecution, false);
    assert.equal(
      MessageNormalizationPlatform.implementsRuntimeNormalization,
      false,
    );
    assert.equal(MessageNormalizationPlatform.parsesPayloads, false);
    assert.equal(MessageNormalizationPlatform.processesMessages, false);
    assert.equal(MessageNormalizationPlatform.aiReasoning, false);
  });
});
