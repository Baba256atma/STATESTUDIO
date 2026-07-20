/**
 * NEA-3:9 — Session & Conversation Public Index Tests.
 *
 * Deterministic coverage for the sole NEA-3 public release surface.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { SessionConversationCertificationPlatform } from "./sessionConversationCertification.ts";
import { SessionConversationFoundationPlatform } from "./sessionConversationFoundation.ts";
import { SessionConversationFreezePlatform } from "./sessionConversationFreeze.ts";
import { SessionConversationManifestPlatform } from "./sessionConversationManifest.ts";
import { SessionConversationModelPlatform } from "./sessionConversationModel.ts";
import { SessionConversationPlatform } from "./sessionConversationPlatform.ts";
import * as PublicIndexModule from "./sessionConversationPublicIndex.ts";
import {
  SessionConversationPlatformPublicFoundation,
  SessionConversationPublicApiRegistry,
  SessionConversationPublicCertificationStatus,
  SessionConversationPublicFreezeStatus,
  SessionConversationPublicIndexId,
  SessionConversationPublicIndexName,
  SessionConversationPublicIndexNamespace,
  SessionConversationPublicIndexVersion,
  SessionConversationPublicReleaseStatus,
  getSessionConversationPublicApiCount,
  getSessionConversationPublicReleaseMetadata,
  getSessionConversationPublicSummary,
} from "./sessionConversationPublicIndex.ts";
import { SessionConversationRegistryPlatform } from "./sessionConversationRegistry.ts";
import { SessionConversationValidationPlatform } from "./sessionConversationValidation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA39_FILES = Object.freeze([
  "sessionConversationPublicIndex.ts",
  "sessionConversationPublicIndex.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "SessionConversationPlatformPublicFoundation",
  "SessionConversationPublicApiRegistry",
  "SessionConversationPublicIndexId",
  "SessionConversationPublicIndexVersion",
  "SessionConversationPublicIndexName",
  "SessionConversationPublicIndexNamespace",
  "SessionConversationPublicReleaseStatus",
  "SessionConversationPublicCertificationStatus",
  "SessionConversationPublicFreezeStatus",
  "getSessionConversationPublicSummary",
  "getSessionConversationPublicApiCount",
  "getSessionConversationPublicReleaseMetadata",
] as const);

const NAMESPACE_SECTIONS = Object.freeze([
  "foundation",
  "registry",
  "model",
  "validation",
  "manifest",
  "platform",
  "certification",
  "freeze",
  "publicIndex",
] as const);

const PHASE_ORDER = Object.freeze([
  "NEA-3:1",
  "NEA-3:2",
  "NEA-3:3",
  "NEA-3:4",
  "NEA-3:5",
  "NEA-3:6",
  "NEA-3:7",
  "NEA-3:8",
  "NEA-3:9",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-3:9 Session & Conversation Public Index", () => {
  it("creates exactly two Public Index files and twelve public exports", () => {
    assert.equal(NEA39_FILES.length, 2);
    const present = readdirSync(HERE);
    for (const file of NEA39_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(PublicIndexModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(PublicIndexModule).length, 12);
  });

  it("has exact identity and Released/Certified/Frozen/Stable/ReadyForConsumer metadata", () => {
    assert.equal(
      SessionConversationPublicIndexId,
      "NEA-3:9/SessionConversationPublicIndex",
    );
    assert.equal(SessionConversationPublicIndexVersion, "1.0.0");
    assert.equal(
      SessionConversationPublicIndexName,
      "Session & Conversation Public Index",
    );
    assert.equal(
      SessionConversationPublicIndexNamespace,
      "nexora.nea.session-conversation.public-index",
    );
    assert.equal(SessionConversationPublicReleaseStatus, "Released");
    assert.equal(SessionConversationPublicCertificationStatus, "Certified");
    assert.equal(SessionConversationPublicFreezeStatus, "Frozen");

    const meta = SessionConversationPlatformPublicFoundation.publicIndex;
    assert.equal(meta.stabilityStatus, "Stable");
    assert.equal(meta.architectureStatus, "Complete");
    assert.equal(meta.architectureVersion, "NEA-3.0.0");
    assert.equal(meta.consumerReadiness, "ReadyForConsumer");
    assert.equal(meta.nextPhaseReadiness, "NEA-3 Complete");
    assert.equal(
      meta.solePublicEntryPoint,
      "sessionConversationPublicIndex.ts",
    );
  });

  it("consumes Freeze as sole dependency", () => {
    const deps =
      SessionConversationPlatformPublicFoundation.dependencyDeclarations;
    assert.equal(
      deps.directPreviousPhaseModule,
      "sessionConversationFreeze.ts",
    );
    assert.equal(deps.freezeOnly, true);
    assert.equal(deps.certificationDirectImport, false);
    assert.equal(deps.platformDirectImport, false);
    assert.equal(deps.manifestDirectImport, false);
    assert.equal(deps.validationDirectImport, false);
    assert.equal(deps.modelDirectImport, false);
    assert.equal(deps.registryDirectImport, false);
    assert.equal(deps.foundationDirectImport, false);
    assert.equal(deps.earlierNeaStageDirectImport, false);
    assert.equal(deps.duplicatesFreezeMetadata, false);
    assert.equal(deps.duplicatesCertificationMetadata, false);
    assert.equal(deps.reconstructsUpstream, false);
  });

  it("publishes a nine-section namespace with exact order and reference equality", () => {
    const publicNs = SessionConversationPlatformPublicFoundation;
    const keys = Object.keys(publicNs);
    assert.deepEqual(keys.slice(0, 9), [...NAMESPACE_SECTIONS]);
    assert.equal(NAMESPACE_SECTIONS.length, 9);

    assert.equal(publicNs.freeze, SessionConversationFreezePlatform);
    assert.equal(
      publicNs.certification,
      SessionConversationFreezePlatform.certification,
    );
    assert.equal(
      publicNs.platform,
      SessionConversationFreezePlatform.certification.platform,
    );
    assert.equal(
      publicNs.manifest,
      SessionConversationFreezePlatform.certification.platform.namespace
        .manifest,
    );
    assert.equal(
      publicNs.validation,
      SessionConversationFreezePlatform.certification.platform.namespace
        .validation,
    );
    assert.equal(
      publicNs.model,
      SessionConversationFreezePlatform.certification.platform.namespace.model,
    );
    assert.equal(
      publicNs.registry,
      SessionConversationFreezePlatform.certification.platform.namespace
        .registry,
    );
    assert.equal(
      publicNs.foundation,
      SessionConversationFreezePlatform.certification.platform.namespace
        .foundation,
    );

    assert.equal(
      publicNs.certification,
      SessionConversationCertificationPlatform,
    );
    assert.equal(publicNs.platform, SessionConversationPlatform);
    assert.equal(publicNs.manifest, SessionConversationManifestPlatform);
    assert.equal(publicNs.validation, SessionConversationValidationPlatform);
    assert.equal(publicNs.model, SessionConversationModelPlatform);
    assert.equal(publicNs.registry, SessionConversationRegistryPlatform);
    assert.equal(publicNs.foundation, SessionConversationFoundationPlatform);

    assert.equal(
      publicNs.publicIndex.publicIndexId,
      SessionConversationPublicIndexId,
    );
    assert.equal(Object.isFrozen(publicNs), true);
    assert.equal(Object.isFrozen(publicNs.publicIndex), true);
  });

  it("derives Public API Registry from Freeze-reachable registries without duplicates", () => {
    assert.equal(SessionConversationPublicApiRegistry.length, 76);
    assert.equal(getSessionConversationPublicApiCount(), 76);
    assertUnique(
      SessionConversationPublicApiRegistry.map((item) => item.id),
      "public api ids",
    );
    assertUnique(
      SessionConversationPublicApiRegistry.map(
        (item) => `${item.phase}:${item.exportName}`,
      ),
      "phase+export pairs",
    );

    const byPhase = Object.fromEntries(
      PHASE_ORDER.map((phase) => [
        phase,
        SessionConversationPublicApiRegistry.filter(
          (item) => item.phase === phase,
        ),
      ]),
    );
    assert.equal(byPhase["NEA-3:1"].length, 8);
    assert.equal(byPhase["NEA-3:2"].length, 8);
    assert.equal(byPhase["NEA-3:3"].length, 8);
    assert.equal(byPhase["NEA-3:4"].length, 8);
    assert.equal(byPhase["NEA-3:5"].length, 8);
    assert.equal(byPhase["NEA-3:6"].length, 8);
    assert.equal(byPhase["NEA-3:7"].length, 8);
    assert.equal(byPhase["NEA-3:8"].length, 8);
    assert.equal(byPhase["NEA-3:9"].length, 12);

    assert.ok(
      SessionConversationPublicApiRegistry.every(
        (item) => item.status === "Released",
      ),
    );
    assert.ok(
      SessionConversationPublicApiRegistry.every(
        (item) => item.certificationStatus === "Certified",
      ),
    );
    assert.ok(
      SessionConversationPublicApiRegistry.every(
        (item) => item.freezeStatus === "Frozen",
      ),
    );
  });

  it("preserves Freeze-reachable upstream apiRegistries and session/conversation identities", () => {
    const publicNs = SessionConversationPlatformPublicFoundation;
    assert.equal(
      publicNs.foundation.apiRegistry,
      SessionConversationFoundationPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.registry.apiRegistry,
      SessionConversationRegistryPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.model.apiRegistry,
      SessionConversationModelPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.validation.apiRegistry,
      SessionConversationValidationPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.manifest.apiRegistry,
      SessionConversationManifestPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.platform.apiRegistry,
      SessionConversationPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.certification.apiRegistry,
      SessionConversationCertificationPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.freeze.apiRegistry,
      SessionConversationFreezePlatform.apiRegistry,
    );
    assert.equal(publicNs.registry.collections.sessionIdentityCount, 8);
    assert.equal(publicNs.registry.collections.conversationIdentityCount, 8);
    assert.equal(
      publicNs.registry.collections.sessionIdentities,
      SessionConversationFreezePlatform.registry.sessionIdentities,
    );
    assert.equal(
      publicNs.registry.collections.conversationIdentities,
      SessionConversationFreezePlatform.registry.conversationIdentities,
    );
  });

  it("derives deterministic consumer summary from canonical Freeze references", () => {
    const summaryA = getSessionConversationPublicSummary();
    const summaryB = getSessionConversationPublicSummary();
    const freezeSummary = SessionConversationFreezePlatform.summary;
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.publicIndexId, SessionConversationPublicIndexId);
    assert.equal(summaryA.releaseStatus, "Released");
    assert.equal(summaryA.certificationStatus, "Certified");
    assert.equal(summaryA.freezeStatus, "Frozen");
    assert.equal(summaryA.consumerReadiness, "ReadyForConsumer");
    assert.equal(summaryA.publicNamespaceSectionCount, 9);
    assert.equal(summaryA.nea39ExportCount, 12);
    assert.equal(summaryA.publicApiRegistryCount, 76);
    assert.equal(summaryA.foundationApiCount, 8);
    assert.equal(summaryA.freezeApiCount, 8);
    assert.equal(summaryA.publicIndexApiCount, 12);
    assert.equal(summaryA.sessionIdentityCount, 8);
    assert.equal(summaryA.conversationIdentityCount, 8);
    assert.equal(
      summaryA.certificationOutcome,
      freezeSummary.certificationOutcome,
    );
    assert.equal(summaryA.lockCount, freezeSummary.lockCount);
    assert.equal(summaryA.frozenComponentCount, freezeSummary.componentCount);
    assert.equal(summaryA.releaseGuaranteeCount, 18);
  });

  it("exposes release metadata and forbids runtime behavior", () => {
    const meta = getSessionConversationPublicReleaseMetadata();
    assert.equal(Object.isFrozen(meta), true);
    assert.equal(meta.releaseStatus, "Released");
    assert.equal(meta.certificationStatus, "Certified");
    assert.equal(meta.freezeStatus, "Frozen");
    assert.equal(meta.stabilityStatus, "Stable");
    assert.equal(meta.consumerReadiness, "ReadyForConsumer");
    assert.equal(
      meta.canonicalEntryPoint,
      "sessionConversationPublicIndex.ts",
    );
    assert.equal(meta.directImportPolicy, "PublicIndexOnly");
    assert.equal(meta.publicApiCount, 76);
    assert.equal(meta.phaseCount, 9);
    assert.equal(meta.sessionIdentityCount, 8);
    assert.equal(meta.conversationIdentityCount, 8);

    const publicNs = SessionConversationPlatformPublicFoundation;
    assert.equal(publicNs.runtimeBehavior, false);
    assert.equal(publicNs.serviceExecution, false);
    assert.equal(publicNs.managesRuntimeSessions, false);
    assert.equal(publicNs.managesRuntimeConversations, false);
    assert.equal(publicNs.processesMessages, false);
    assert.equal(publicNs.executesConnectors, false);
    assert.equal(publicNs.networkingBehavior, false);
    assert.equal(publicNs.persistenceBehavior, false);
    assert.equal(publicNs.aiBehavior, false);
    assert.equal(publicNs.authenticationBehavior, false);
    assert.equal(publicNs.authorizationBehavior, false);
    assert.equal(publicNs.routingBehavior, false);
    assert.equal(publicNs.rebuildsInventories, false);
    assert.equal(publicNs.recertifies, false);
    assert.equal(publicNs.refreezes, false);
  });
});
