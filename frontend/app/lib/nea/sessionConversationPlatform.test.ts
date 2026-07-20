/**
 * NEA-3:6 — Session & Conversation Platform Tests.
 *
 * Deterministic coverage for the immutable Session & Conversation Platform.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  SessionConversationManifestId,
  SessionConversationManifestPlatform,
} from "./sessionConversationManifest.ts";
import * as PlatformModule from "./sessionConversationPlatform.ts";
import {
  SessionConversationPlatform,
  SessionConversationPlatformId,
  SessionConversationPlatformName,
  SessionConversationPlatformNamespace,
  SessionConversationPlatformReadiness,
  SessionConversationPlatformStatus,
  SessionConversationPlatformVersion,
  getSessionConversationPlatformSummary,
} from "./sessionConversationPlatform.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA36_FILES = Object.freeze([
  "sessionConversationPlatformTypes.ts",
  "sessionConversationPlatformNamespace.ts",
  "sessionConversationPlatformMetadata.ts",
  "sessionConversationPlatformOwnership.ts",
  "sessionConversationPlatformReadiness.ts",
  "sessionConversationPlatformSummary.ts",
  "sessionConversationPlatform.ts",
  "sessionConversationPlatform.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "SessionConversationPlatformId",
  "SessionConversationPlatformVersion",
  "SessionConversationPlatformName",
  "SessionConversationPlatformNamespace",
  "SessionConversationPlatformStatus",
  "SessionConversationPlatformReadiness",
  "SessionConversationPlatform",
  "getSessionConversationPlatformSummary",
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

describe("NEA-3:6 Session & Conversation Platform", () => {
  it("creates exactly eight Platform files and eight public exports", () => {
    assert.equal(NEA36_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA36_FILES) {
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
      SessionConversationPlatformId,
      "NEA-3:6/SessionConversationPlatform",
    );
    assert.equal(SessionConversationPlatformVersion, "1.0.0");
    assert.equal(
      SessionConversationPlatformName,
      "Session & Conversation Platform",
    );
    assert.equal(
      SessionConversationPlatformNamespace,
      "nexora.nea.session-conversation.platform",
    );
    assert.equal(SessionConversationPlatformStatus, "Platform");
    assert.equal(
      SessionConversationPlatformReadiness,
      "ReadyForCertification",
    );
    assert.equal(SessionConversationPlatform.identity.phase, "NEA-3:6");
    assert.equal(
      SessionConversationPlatform.identity.manifestId,
      SessionConversationManifestId,
    );
    assert.equal(
      SessionConversationPlatform.nextPhase,
      "NEA-3:7 — Session & Conversation Certification",
    );
  });

  it("consumes only NEA-3:5 Manifest and preserves the canonical phase chain", () => {
    const dependency = SessionConversationPlatform.dependency;
    assert.equal(dependency.manifestOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "sessionConversationManifest.ts",
    );
    assert.equal(dependency.manifestId, SessionConversationManifestId);
    assert.equal(dependency.validationDirectImport, false);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.duplicatesUpstreamArchitecture, false);
    assert.equal(dependency.redefinesPriorPhases, false);
    assert.equal(
      SessionConversationPlatform.manifestPlatform,
      SessionConversationManifestPlatform,
    );

    const ns = SessionConversationPlatform.namespace;
    assert.equal(ns.foundation, ns.registry.foundationPlatform);
    assert.equal(ns.registry, ns.model.registryPlatform);
    assert.equal(ns.model, ns.validation.modelPlatform);
    assert.equal(ns.validation, ns.manifest.validationPlatform);
    assert.equal(ns.manifest, SessionConversationManifestPlatform);
  });

  it("exposes a six-section namespace with complete phase composition", () => {
    const ns = SessionConversationPlatform.namespace;
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
    assert.equal(ns.composition[5]?.module, "sessionConversationPlatform.ts");
    assert.equal(ns.composition[5]?.phaseId, SessionConversationPlatformId);
  });

  it("declares ownership, consumer surface, and forbidden boundaries", () => {
    const { ownership, boundaries, consumer } = SessionConversationPlatform;
    assert.ok(ownership.owns.includes("Platform Composition"));
    assert.ok(ownership.owns.includes("Platform Namespace"));
    assert.ok(ownership.owns.includes("Consumer Readiness"));
    assert.ok(ownership.doesNotOwn.includes("Foundation Contracts"));
    assert.ok(ownership.doesNotOwn.includes("Manifest Inventory"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Sessions"));
    assert.equal(ownership.ownsManifestInventory, false);
    assert.equal(ownership.ownsRuntimeSessions, false);
    assert.equal(ownership.ownsRuntimeConversations, false);

    assert.equal(
      consumer.soleSupportedEntryPoint,
      "sessionConversationPlatform.ts",
    );
    assert.ok(
      boundaries.consumerAccessRule.includes("SessionConversationPlatform"),
    );
    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime Sessions"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Message Processing"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Connector Execution"));
    assert.equal(boundaries.managesRuntimeSessions, false);
    assert.equal(boundaries.processesMessages, false);
    assert.equal(boundaries.duplicatesUpstreamArchitecture, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = SessionConversationPlatform;
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
    const summaryA = getSessionConversationPlatformSummary();
    const summaryB = getSessionConversationPlatformSummary();
    const manifest = SessionConversationManifestPlatform;
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.platformId, SessionConversationPlatformId);
    assert.equal(summaryA.status, "Platform");
    assert.equal(summaryA.readiness, "ReadyForCertification");
    assert.equal(summaryA.manifestId, SessionConversationManifestId);
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
      "NEA-3:7 — Session & Conversation Certification",
    );
    assert.equal(
      SessionConversationPlatform.metadata.compatibility.compositionMode,
      "CanonicalReferenceOnly",
    );
    assert.equal(SessionConversationPlatform.metadata.countsHardcoded, false);
    assert.equal(
      SessionConversationPlatform.metadata.duplicatesUpstreamArchitecture,
      false,
    );
    assert.equal(SessionConversationPlatform.readiness.consumerReady, true);
    assert.equal(SessionConversationPlatform.runtimeBehavior, false);
    assert.equal(SessionConversationPlatform.managesRuntimeSessions, false);
    assert.equal(SessionConversationPlatform.processesMessages, false);
    assert.equal(SessionConversationPlatform.validationExecution, false);
    assert.equal(SessionConversationPlatform.executesConnectors, false);
  });
});
