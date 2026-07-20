/**
 * NEA-2:9 — Channel Connectors Public Index Tests.
 *
 * Deterministic coverage for the sole NEA-2 public release surface.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { ChannelConnectorCertificationPlatform } from "./channelConnectorCertification.ts";
import { ChannelConnectorFoundationPlatform } from "./channelConnectorFoundation.ts";
import { ChannelConnectorFreezePlatform } from "./channelConnectorFreeze.ts";
import { ChannelConnectorManifestPlatform } from "./channelConnectorManifest.ts";
import { ChannelConnectorModelPlatform } from "./channelConnectorModel.ts";
import { ChannelConnectorPlatform } from "./channelConnectorPlatform.ts";
import * as PublicIndexModule from "./channelConnectorPublicIndex.ts";
import {
  ChannelConnectorPlatformPublicFoundation,
  ChannelConnectorPublicApiRegistry,
  ChannelConnectorPublicCertificationStatus,
  ChannelConnectorPublicFreezeStatus,
  ChannelConnectorPublicIndexId,
  ChannelConnectorPublicIndexName,
  ChannelConnectorPublicIndexNamespace,
  ChannelConnectorPublicIndexVersion,
  ChannelConnectorPublicReleaseStatus,
  getChannelConnectorPublicApiCount,
  getChannelConnectorPublicReleaseMetadata,
  getChannelConnectorPublicSummary,
} from "./channelConnectorPublicIndex.ts";
import { ChannelConnectorRegistryPlatform } from "./channelConnectorRegistry.ts";
import { ChannelConnectorValidationPlatform } from "./channelConnectorValidation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA29_FILES = Object.freeze([
  "channelConnectorPublicIndex.ts",
  "channelConnectorPublicIndex.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ChannelConnectorPlatformPublicFoundation",
  "ChannelConnectorPublicApiRegistry",
  "ChannelConnectorPublicIndexId",
  "ChannelConnectorPublicIndexVersion",
  "ChannelConnectorPublicIndexName",
  "ChannelConnectorPublicIndexNamespace",
  "ChannelConnectorPublicReleaseStatus",
  "ChannelConnectorPublicCertificationStatus",
  "ChannelConnectorPublicFreezeStatus",
  "getChannelConnectorPublicSummary",
  "getChannelConnectorPublicApiCount",
  "getChannelConnectorPublicReleaseMetadata",
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
  "NEA-2:1",
  "NEA-2:2",
  "NEA-2:3",
  "NEA-2:4",
  "NEA-2:5",
  "NEA-2:6",
  "NEA-2:7",
  "NEA-2:8",
  "NEA-2:9",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-2:9 Channel Connectors Public Index", () => {
  it("creates exactly two Public Index files and twelve public exports", () => {
    assert.equal(NEA29_FILES.length, 2);
    const present = readdirSync(HERE);
    for (const file of NEA29_FILES) {
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
      ChannelConnectorPublicIndexId,
      "NEA-2:9/ChannelConnectorPublicIndex",
    );
    assert.equal(ChannelConnectorPublicIndexVersion, "1.0.0");
    assert.equal(
      ChannelConnectorPublicIndexName,
      "Channel Connectors Public Index",
    );
    assert.equal(
      ChannelConnectorPublicIndexNamespace,
      "nexora.nea.channel-connectors.public-index",
    );
    assert.equal(ChannelConnectorPublicReleaseStatus, "Released");
    assert.equal(ChannelConnectorPublicCertificationStatus, "Certified");
    assert.equal(ChannelConnectorPublicFreezeStatus, "Frozen");

    const meta = ChannelConnectorPlatformPublicFoundation.publicIndex;
    assert.equal(meta.stabilityStatus, "Stable");
    assert.equal(meta.architectureStatus, "Complete");
    assert.equal(meta.architectureVersion, "NEA-2.0.0");
    assert.equal(meta.consumerReadiness, "ReadyForConsumer");
    assert.equal(meta.nextPhaseReadiness, "NEA-2 Complete");
    assert.equal(
      meta.solePublicEntryPoint,
      "channelConnectorPublicIndex.ts",
    );
  });

  it("consumes Freeze as sole dependency", () => {
    const deps =
      ChannelConnectorPlatformPublicFoundation.dependencyDeclarations;
    assert.equal(
      deps.directPreviousPhaseModule,
      "channelConnectorFreeze.ts",
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
    const publicNs = ChannelConnectorPlatformPublicFoundation;
    const keys = Object.keys(publicNs);
    assert.deepEqual(keys.slice(0, 9), [...NAMESPACE_SECTIONS]);
    assert.equal(NAMESPACE_SECTIONS.length, 9);

    assert.equal(publicNs.freeze, ChannelConnectorFreezePlatform);
    assert.equal(
      publicNs.certification,
      ChannelConnectorFreezePlatform.certification,
    );
    assert.equal(
      publicNs.platform,
      ChannelConnectorFreezePlatform.certification.platform,
    );
    assert.equal(
      publicNs.manifest,
      ChannelConnectorFreezePlatform.certification.platform.namespace.manifest,
    );
    assert.equal(
      publicNs.validation,
      ChannelConnectorFreezePlatform.certification.platform.namespace
        .validation,
    );
    assert.equal(
      publicNs.model,
      ChannelConnectorFreezePlatform.certification.platform.namespace.model,
    );
    assert.equal(
      publicNs.registry,
      ChannelConnectorFreezePlatform.certification.platform.namespace.registry,
    );
    assert.equal(
      publicNs.foundation,
      ChannelConnectorFreezePlatform.certification.platform.namespace
        .foundation,
    );

    assert.equal(publicNs.certification, ChannelConnectorCertificationPlatform);
    assert.equal(publicNs.platform, ChannelConnectorPlatform);
    assert.equal(publicNs.manifest, ChannelConnectorManifestPlatform);
    assert.equal(publicNs.validation, ChannelConnectorValidationPlatform);
    assert.equal(publicNs.model, ChannelConnectorModelPlatform);
    assert.equal(publicNs.registry, ChannelConnectorRegistryPlatform);
    assert.equal(publicNs.foundation, ChannelConnectorFoundationPlatform);

    assert.equal(
      publicNs.publicIndex.publicIndexId,
      ChannelConnectorPublicIndexId,
    );
    assert.equal(Object.isFrozen(publicNs), true);
    assert.equal(Object.isFrozen(publicNs.publicIndex), true);
  });

  it("derives Public API Registry from Freeze-reachable registries without duplicates", () => {
    assert.equal(ChannelConnectorPublicApiRegistry.length, 76);
    assert.equal(getChannelConnectorPublicApiCount(), 76);
    assertUnique(
      ChannelConnectorPublicApiRegistry.map((item) => item.id),
      "public api ids",
    );
    assertUnique(
      ChannelConnectorPublicApiRegistry.map(
        (item) => `${item.phase}:${item.exportName}`,
      ),
      "phase+export pairs",
    );

    const byPhase = Object.fromEntries(
      PHASE_ORDER.map((phase) => [
        phase,
        ChannelConnectorPublicApiRegistry.filter(
          (item) => item.phase === phase,
        ),
      ]),
    );
    assert.equal(byPhase["NEA-2:1"].length, 8);
    assert.equal(byPhase["NEA-2:2"].length, 8);
    assert.equal(byPhase["NEA-2:3"].length, 8);
    assert.equal(byPhase["NEA-2:4"].length, 8);
    assert.equal(byPhase["NEA-2:5"].length, 8);
    assert.equal(byPhase["NEA-2:6"].length, 8);
    assert.equal(byPhase["NEA-2:7"].length, 8);
    assert.equal(byPhase["NEA-2:8"].length, 8);
    assert.equal(byPhase["NEA-2:9"].length, 12);

    assert.ok(
      ChannelConnectorPublicApiRegistry.every(
        (item) => item.status === "Released",
      ),
    );
    assert.ok(
      ChannelConnectorPublicApiRegistry.every(
        (item) => item.certificationStatus === "Certified",
      ),
    );
    assert.ok(
      ChannelConnectorPublicApiRegistry.every(
        (item) => item.freezeStatus === "Frozen",
      ),
    );
  });

  it("preserves Freeze-reachable upstream apiRegistries and connector identities", () => {
    const publicNs = ChannelConnectorPlatformPublicFoundation;
    assert.equal(
      publicNs.foundation.apiRegistry,
      ChannelConnectorFoundationPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.registry.apiRegistry,
      ChannelConnectorRegistryPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.model.apiRegistry,
      ChannelConnectorModelPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.validation.apiRegistry,
      ChannelConnectorValidationPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.manifest.apiRegistry,
      ChannelConnectorManifestPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.platform.apiRegistry,
      ChannelConnectorPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.certification.apiRegistry,
      ChannelConnectorCertificationPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.freeze.apiRegistry,
      ChannelConnectorFreezePlatform.apiRegistry,
    );
    assert.equal(publicNs.registry.collections.identityCount, 12);
    assert.equal(
      publicNs.registry.collections.identities,
      ChannelConnectorFreezePlatform.registry.connectorIdentities,
    );
  });

  it("derives deterministic consumer summary from canonical Freeze references", () => {
    const summaryA = getChannelConnectorPublicSummary();
    const summaryB = getChannelConnectorPublicSummary();
    const freezeSummary = ChannelConnectorFreezePlatform.summary;
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.publicIndexId, ChannelConnectorPublicIndexId);
    assert.equal(summaryA.releaseStatus, "Released");
    assert.equal(summaryA.certificationStatus, "Certified");
    assert.equal(summaryA.freezeStatus, "Frozen");
    assert.equal(summaryA.consumerReadiness, "ReadyForConsumer");
    assert.equal(summaryA.publicNamespaceSectionCount, 9);
    assert.equal(summaryA.nea29ExportCount, 12);
    assert.equal(summaryA.publicApiRegistryCount, 76);
    assert.equal(summaryA.foundationApiCount, 8);
    assert.equal(summaryA.freezeApiCount, 8);
    assert.equal(summaryA.publicIndexApiCount, 12);
    assert.equal(summaryA.connectorIdentityCount, 12);
    assert.equal(
      summaryA.certificationOutcome,
      freezeSummary.certificationOutcome,
    );
    assert.equal(summaryA.lockCount, freezeSummary.lockCount);
    assert.equal(summaryA.frozenComponentCount, freezeSummary.componentCount);
    assert.equal(summaryA.releaseGuaranteeCount, 17);
  });

  it("exposes release metadata and forbids runtime behavior", () => {
    const meta = getChannelConnectorPublicReleaseMetadata();
    assert.equal(Object.isFrozen(meta), true);
    assert.equal(meta.releaseStatus, "Released");
    assert.equal(meta.certificationStatus, "Certified");
    assert.equal(meta.freezeStatus, "Frozen");
    assert.equal(meta.stabilityStatus, "Stable");
    assert.equal(meta.consumerReadiness, "ReadyForConsumer");
    assert.equal(meta.canonicalEntryPoint, "channelConnectorPublicIndex.ts");
    assert.equal(meta.directImportPolicy, "PublicIndexOnly");
    assert.equal(meta.publicApiCount, 76);
    assert.equal(meta.phaseCount, 9);
    assert.equal(meta.connectorIdentityCount, 12);

    const publicNs = ChannelConnectorPlatformPublicFoundation;
    assert.equal(publicNs.runtimeBehavior, false);
    assert.equal(publicNs.serviceExecution, false);
    assert.equal(publicNs.connectorImplementation, false);
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
