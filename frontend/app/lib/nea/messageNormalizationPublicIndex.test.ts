/**
 * NEA-6:9 — Message Normalization Public Index Tests.
 *
 * Deterministic coverage for the sole NEA-6 public release surface.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { MessageNormalizationCertificationPlatform } from "./messageNormalizationCertification.ts";
import { MessageNormalizationFoundationPlatform } from "./messageNormalizationFoundation.ts";
import { MessageNormalizationFreezePlatform } from "./messageNormalizationFreeze.ts";
import { MessageNormalizationManifestPlatform } from "./messageNormalizationManifest.ts";
import { MessageNormalizationModelPlatform } from "./messageNormalizationModel.ts";
import { MessageNormalizationPlatform } from "./messageNormalizationPlatform.ts";
import * as PublicIndexModule from "./messageNormalizationPublicIndex.ts";
import {
  MessageNormalizationPlatformPublicFoundation,
  MessageNormalizationPublicApiRegistry,
  MessageNormalizationPublicCertificationStatus,
  MessageNormalizationPublicFreezeStatus,
  MessageNormalizationPublicIndexId,
  MessageNormalizationPublicIndexName,
  MessageNormalizationPublicIndexNamespace,
  MessageNormalizationPublicIndexVersion,
  MessageNormalizationPublicReleaseStatus,
  getMessageNormalizationPublicApiCount,
  getMessageNormalizationPublicReleaseMetadata,
  getMessageNormalizationPublicSummary,
} from "./messageNormalizationPublicIndex.ts";
import { MessageNormalizationRegistryPlatform } from "./messageNormalizationRegistry.ts";
import { MessageNormalizationValidationPlatform } from "./messageNormalizationValidation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA69_FILES = Object.freeze([
  "messageNormalizationPublicIndex.ts",
  "messageNormalizationPublicIndex.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "MessageNormalizationPlatformPublicFoundation",
  "MessageNormalizationPublicApiRegistry",
  "MessageNormalizationPublicIndexId",
  "MessageNormalizationPublicIndexVersion",
  "MessageNormalizationPublicIndexName",
  "MessageNormalizationPublicIndexNamespace",
  "MessageNormalizationPublicReleaseStatus",
  "MessageNormalizationPublicCertificationStatus",
  "MessageNormalizationPublicFreezeStatus",
  "getMessageNormalizationPublicSummary",
  "getMessageNormalizationPublicApiCount",
  "getMessageNormalizationPublicReleaseMetadata",
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
  "NEA-6:1",
  "NEA-6:2",
  "NEA-6:3",
  "NEA-6:4",
  "NEA-6:5",
  "NEA-6:6",
  "NEA-6:7",
  "NEA-6:8",
  "NEA-6:9",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-6:9 Message Normalization Public Index", () => {
  it("creates exactly two Public Index files and twelve public exports", () => {
    assert.equal(NEA69_FILES.length, 2);
    const present = readdirSync(HERE);
    for (const file of NEA69_FILES) {
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
      MessageNormalizationPublicIndexId,
      "NEA-6:9/MessageNormalizationPublicIndex",
    );
    assert.equal(MessageNormalizationPublicIndexVersion, "1.0.0");
    assert.equal(
      MessageNormalizationPublicIndexName,
      "Message Normalization Public Index",
    );
    assert.equal(
      MessageNormalizationPublicIndexNamespace,
      "nexora.nea.message-normalization.public-index",
    );
    assert.equal(MessageNormalizationPublicReleaseStatus, "Released");
    assert.equal(MessageNormalizationPublicCertificationStatus, "Certified");
    assert.equal(MessageNormalizationPublicFreezeStatus, "Frozen");

    const meta = MessageNormalizationPlatformPublicFoundation.publicIndex;
    assert.equal(meta.stabilityStatus, "Stable");
    assert.equal(meta.architectureStatus, "Complete");
    assert.equal(meta.architectureVersion, "NEA-6.0.0");
    assert.equal(meta.consumerReadiness, "ReadyForConsumer");
    assert.equal(meta.nextPhaseReadiness, "NEA-6 Complete");
    assert.equal(
      meta.solePublicEntryPoint,
      "messageNormalizationPublicIndex.ts",
    );
  });

  it("consumes Freeze as sole dependency", () => {
    const deps =
      MessageNormalizationPlatformPublicFoundation.dependencyDeclarations;
    assert.equal(
      deps.directPreviousPhaseModule,
      "messageNormalizationFreeze.ts",
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
    const publicNs = MessageNormalizationPlatformPublicFoundation;
    const keys = Object.keys(publicNs);
    assert.deepEqual(keys.slice(0, 9), [...NAMESPACE_SECTIONS]);
    assert.equal(NAMESPACE_SECTIONS.length, 9);

    assert.equal(publicNs.freeze, MessageNormalizationFreezePlatform);
    assert.equal(
      publicNs.certification,
      MessageNormalizationFreezePlatform.certification,
    );
    assert.equal(
      publicNs.platform,
      MessageNormalizationFreezePlatform.certification.platform,
    );
    assert.equal(
      publicNs.manifest,
      MessageNormalizationFreezePlatform.certification.platform.namespace
        .manifest,
    );
    assert.equal(
      publicNs.validation,
      MessageNormalizationFreezePlatform.certification.platform.namespace
        .validation,
    );
    assert.equal(
      publicNs.model,
      MessageNormalizationFreezePlatform.certification.platform.namespace.model,
    );
    assert.equal(
      publicNs.registry,
      MessageNormalizationFreezePlatform.certification.platform.namespace
        .registry,
    );
    assert.equal(
      publicNs.foundation,
      MessageNormalizationFreezePlatform.certification.platform.namespace
        .foundation,
    );

    assert.equal(
      publicNs.certification,
      MessageNormalizationCertificationPlatform,
    );
    assert.equal(publicNs.platform, MessageNormalizationPlatform);
    assert.equal(publicNs.manifest, MessageNormalizationManifestPlatform);
    assert.equal(publicNs.validation, MessageNormalizationValidationPlatform);
    assert.equal(publicNs.model, MessageNormalizationModelPlatform);
    assert.equal(publicNs.registry, MessageNormalizationRegistryPlatform);
    assert.equal(publicNs.foundation, MessageNormalizationFoundationPlatform);

    assert.equal(
      publicNs.publicIndex.publicIndexId,
      MessageNormalizationPublicIndexId,
    );
    assert.equal(Object.isFrozen(publicNs), true);
    assert.equal(Object.isFrozen(publicNs.publicIndex), true);
  });

  it("derives Public API Registry from Freeze-reachable registries without duplicates", () => {
    assert.equal(MessageNormalizationPublicApiRegistry.length, 76);
    assert.equal(getMessageNormalizationPublicApiCount(), 76);
    assertUnique(
      MessageNormalizationPublicApiRegistry.map((item) => item.id),
      "public api ids",
    );
    assertUnique(
      MessageNormalizationPublicApiRegistry.map(
        (item) => `${item.phase}:${item.exportName}`,
      ),
      "phase+export pairs",
    );

    const byPhase = Object.fromEntries(
      PHASE_ORDER.map((phase) => [
        phase,
        MessageNormalizationPublicApiRegistry.filter(
          (item) => item.phase === phase,
        ),
      ]),
    );
    assert.equal(byPhase["NEA-6:1"].length, 8);
    assert.equal(byPhase["NEA-6:2"].length, 8);
    assert.equal(byPhase["NEA-6:3"].length, 8);
    assert.equal(byPhase["NEA-6:4"].length, 8);
    assert.equal(byPhase["NEA-6:5"].length, 8);
    assert.equal(byPhase["NEA-6:6"].length, 8);
    assert.equal(byPhase["NEA-6:7"].length, 8);
    assert.equal(byPhase["NEA-6:8"].length, 8);
    assert.equal(byPhase["NEA-6:9"].length, 12);

    assert.ok(
      MessageNormalizationPublicApiRegistry.every(
        (item) => item.status === "Released",
      ),
    );
    assert.ok(
      MessageNormalizationPublicApiRegistry.every(
        (item) => item.certificationStatus === "Certified",
      ),
    );
    assert.ok(
      MessageNormalizationPublicApiRegistry.every(
        (item) => item.freezeStatus === "Frozen",
      ),
    );
  });

  it("preserves Freeze-reachable upstream apiRegistries and domain collections", () => {
    const publicNs = MessageNormalizationPlatformPublicFoundation;
    assert.equal(
      publicNs.foundation.apiRegistry,
      MessageNormalizationFoundationPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.registry.apiRegistry,
      MessageNormalizationRegistryPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.model.apiRegistry,
      MessageNormalizationModelPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.validation.apiRegistry,
      MessageNormalizationValidationPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.manifest.apiRegistry,
      MessageNormalizationManifestPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.platform.apiRegistry,
      MessageNormalizationPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.certification.apiRegistry,
      MessageNormalizationCertificationPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.freeze.apiRegistry,
      MessageNormalizationFreezePlatform.apiRegistry,
    );
    assert.equal(publicNs.registry.collections.messageIdentityCount, 8);
    assert.equal(publicNs.registry.collections.payloadCount, 8);
    assert.equal(publicNs.model.domainModels.modelCount, 20);
    assert.equal(
      publicNs.foundation.contracts.canonicalExecutiveMessageCount,
      1,
    );
    assert.equal(
      publicNs.registry.collections.messageIdentities,
      MessageNormalizationFreezePlatform.registry.messageIdentities,
    );
    assert.equal(
      publicNs.registry.collections.payloads,
      MessageNormalizationFreezePlatform.registry.payloads,
    );
    assert.ok(
      publicNs.model.domainModels.models.some(
        (item) => item.modelKind === "MessageIdentity",
      ),
    );
    assert.ok(
      publicNs.model.domainModels.models.some(
        (item) => item.modelKind === "ExecutiveMessage",
      ),
    );
  });

  it("derives deterministic consumer summary from canonical Freeze references", () => {
    const summaryA = getMessageNormalizationPublicSummary();
    const summaryB = getMessageNormalizationPublicSummary();
    const freezeSummary = MessageNormalizationFreezePlatform.summary;
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.publicIndexId, MessageNormalizationPublicIndexId);
    assert.equal(summaryA.releaseStatus, "Released");
    assert.equal(summaryA.certificationStatus, "Certified");
    assert.equal(summaryA.freezeStatus, "Frozen");
    assert.equal(summaryA.consumerReadiness, "ReadyForConsumer");
    assert.equal(summaryA.publicNamespaceSectionCount, 9);
    assert.equal(summaryA.nea69ExportCount, 12);
    assert.equal(summaryA.publicApiRegistryCount, 76);
    assert.equal(summaryA.foundationApiCount, 8);
    assert.equal(summaryA.freezeApiCount, 8);
    assert.equal(summaryA.publicIndexApiCount, 12);
    assert.equal(summaryA.messageIdentityCount, 8);
    assert.equal(summaryA.payloadCount, 8);
    assert.equal(summaryA.domainModelCount, 20);
    assert.equal(summaryA.canonicalExecutiveMessageCount, 1);
    assert.equal(
      summaryA.certificationOutcome,
      freezeSummary.certificationOutcome,
    );
    assert.equal(summaryA.lockCount, freezeSummary.lockCount);
    assert.equal(summaryA.compatibilityCount, freezeSummary.compatibilityCount);
    assert.equal(summaryA.frozenComponentCount, freezeSummary.componentCount);
    assert.equal(summaryA.releaseGuaranteeCount, 17);
  });

  it("exposes release metadata and forbids runtime behavior", () => {
    const meta = getMessageNormalizationPublicReleaseMetadata();
    assert.equal(Object.isFrozen(meta), true);
    assert.equal(meta.releaseStatus, "Released");
    assert.equal(meta.certificationStatus, "Certified");
    assert.equal(meta.freezeStatus, "Frozen");
    assert.equal(meta.stabilityStatus, "Stable");
    assert.equal(meta.consumerReadiness, "ReadyForConsumer");
    assert.equal(
      meta.canonicalEntryPoint,
      "messageNormalizationPublicIndex.ts",
    );
    assert.equal(meta.directImportPolicy, "PublicIndexOnly");
    assert.equal(meta.publicApiCount, 76);
    assert.equal(meta.phaseCount, 9);
    assert.equal(meta.messageIdentityCount, 8);
    assert.equal(meta.payloadCount, 8);
    assert.equal(meta.guaranteeCount, 17);

    const publicNs = MessageNormalizationPlatformPublicFoundation;
    assert.equal(publicNs.runtimeBehavior, false);
    assert.equal(publicNs.serviceExecution, false);
    assert.equal(publicNs.implementsRuntimeNormalization, false);
    assert.equal(publicNs.implementsMessageParsing, false);
    assert.equal(publicNs.parsesPayloads, false);
    assert.equal(publicNs.processesMessages, false);
    assert.equal(publicNs.interpretsBusinessMeaning, false);
    assert.equal(publicNs.implementsRouting, false);
    assert.equal(publicNs.networkingBehavior, false);
    assert.equal(publicNs.persistenceBehavior, false);
    assert.equal(publicNs.aiBehavior, false);
    assert.equal(publicNs.routingBehavior, false);
    assert.equal(publicNs.rebuildsInventories, false);
    assert.equal(publicNs.recertifies, false);
    assert.equal(publicNs.refreezes, false);
  });
});
