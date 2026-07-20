/**
 * NEA-5:9 — Gateway Routing Public Index Tests.
 *
 * Deterministic coverage for the sole NEA-5 public release surface.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { GatewayRoutingCertificationPlatform } from "./gatewayRoutingCertification.ts";
import { GatewayRoutingFoundationPlatform } from "./gatewayRoutingFoundation.ts";
import { GatewayRoutingFreezePlatform } from "./gatewayRoutingFreeze.ts";
import { GatewayRoutingManifestPlatform } from "./gatewayRoutingManifest.ts";
import { GatewayRoutingModelPlatform } from "./gatewayRoutingModel.ts";
import { GatewayRoutingPlatform } from "./gatewayRoutingPlatform.ts";
import * as PublicIndexModule from "./gatewayRoutingPublicIndex.ts";
import {
  GatewayRoutingPlatformPublicFoundation,
  GatewayRoutingPublicApiRegistry,
  GatewayRoutingPublicCertificationStatus,
  GatewayRoutingPublicFreezeStatus,
  GatewayRoutingPublicIndexId,
  GatewayRoutingPublicIndexName,
  GatewayRoutingPublicIndexNamespace,
  GatewayRoutingPublicIndexVersion,
  GatewayRoutingPublicReleaseStatus,
  getGatewayRoutingPublicApiCount,
  getGatewayRoutingPublicReleaseMetadata,
  getGatewayRoutingPublicSummary,
} from "./gatewayRoutingPublicIndex.ts";
import { GatewayRoutingRegistryPlatform } from "./gatewayRoutingRegistry.ts";
import { GatewayRoutingValidationPlatform } from "./gatewayRoutingValidation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA59_FILES = Object.freeze([
  "gatewayRoutingPublicIndex.ts",
  "gatewayRoutingPublicIndex.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "GatewayRoutingPlatformPublicFoundation",
  "GatewayRoutingPublicApiRegistry",
  "GatewayRoutingPublicIndexId",
  "GatewayRoutingPublicIndexVersion",
  "GatewayRoutingPublicIndexName",
  "GatewayRoutingPublicIndexNamespace",
  "GatewayRoutingPublicReleaseStatus",
  "GatewayRoutingPublicCertificationStatus",
  "GatewayRoutingPublicFreezeStatus",
  "getGatewayRoutingPublicSummary",
  "getGatewayRoutingPublicApiCount",
  "getGatewayRoutingPublicReleaseMetadata",
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
  "NEA-5:1",
  "NEA-5:2",
  "NEA-5:3",
  "NEA-5:4",
  "NEA-5:5",
  "NEA-5:6",
  "NEA-5:7",
  "NEA-5:8",
  "NEA-5:9",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-5:9 Gateway Routing Public Index", () => {
  it("creates exactly two Public Index files and twelve public exports", () => {
    assert.equal(NEA59_FILES.length, 2);
    const present = readdirSync(HERE);
    for (const file of NEA59_FILES) {
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
      GatewayRoutingPublicIndexId,
      "NEA-5:9/GatewayRoutingPublicIndex",
    );
    assert.equal(GatewayRoutingPublicIndexVersion, "1.0.0");
    assert.equal(
      GatewayRoutingPublicIndexName,
      "Gateway Routing Public Index",
    );
    assert.equal(
      GatewayRoutingPublicIndexNamespace,
      "nexora.nea.gateway-routing.public-index",
    );
    assert.equal(GatewayRoutingPublicReleaseStatus, "Released");
    assert.equal(GatewayRoutingPublicCertificationStatus, "Certified");
    assert.equal(GatewayRoutingPublicFreezeStatus, "Frozen");

    const meta = GatewayRoutingPlatformPublicFoundation.publicIndex;
    assert.equal(meta.stabilityStatus, "Stable");
    assert.equal(meta.architectureStatus, "Complete");
    assert.equal(meta.architectureVersion, "NEA-5.0.0");
    assert.equal(meta.consumerReadiness, "ReadyForConsumer");
    assert.equal(meta.nextPhaseReadiness, "NEA-5 Complete");
    assert.equal(meta.solePublicEntryPoint, "gatewayRoutingPublicIndex.ts");
  });

  it("consumes Freeze as sole dependency", () => {
    const deps =
      GatewayRoutingPlatformPublicFoundation.dependencyDeclarations;
    assert.equal(deps.directPreviousPhaseModule, "gatewayRoutingFreeze.ts");
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
    const publicNs = GatewayRoutingPlatformPublicFoundation;
    const keys = Object.keys(publicNs);
    assert.deepEqual(keys.slice(0, 9), [...NAMESPACE_SECTIONS]);
    assert.equal(NAMESPACE_SECTIONS.length, 9);

    assert.equal(publicNs.freeze, GatewayRoutingFreezePlatform);
    assert.equal(
      publicNs.certification,
      GatewayRoutingFreezePlatform.certification,
    );
    assert.equal(
      publicNs.platform,
      GatewayRoutingFreezePlatform.certification.platform,
    );
    assert.equal(
      publicNs.manifest,
      GatewayRoutingFreezePlatform.certification.platform.namespace.manifest,
    );
    assert.equal(
      publicNs.validation,
      GatewayRoutingFreezePlatform.certification.platform.namespace.validation,
    );
    assert.equal(
      publicNs.model,
      GatewayRoutingFreezePlatform.certification.platform.namespace.model,
    );
    assert.equal(
      publicNs.registry,
      GatewayRoutingFreezePlatform.certification.platform.namespace.registry,
    );
    assert.equal(
      publicNs.foundation,
      GatewayRoutingFreezePlatform.certification.platform.namespace.foundation,
    );

    assert.equal(publicNs.certification, GatewayRoutingCertificationPlatform);
    assert.equal(publicNs.platform, GatewayRoutingPlatform);
    assert.equal(publicNs.manifest, GatewayRoutingManifestPlatform);
    assert.equal(publicNs.validation, GatewayRoutingValidationPlatform);
    assert.equal(publicNs.model, GatewayRoutingModelPlatform);
    assert.equal(publicNs.registry, GatewayRoutingRegistryPlatform);
    assert.equal(publicNs.foundation, GatewayRoutingFoundationPlatform);

    assert.equal(
      publicNs.publicIndex.publicIndexId,
      GatewayRoutingPublicIndexId,
    );
    assert.equal(Object.isFrozen(publicNs), true);
    assert.equal(Object.isFrozen(publicNs.publicIndex), true);
  });

  it("derives Public API Registry from Freeze-reachable registries without duplicates", () => {
    assert.equal(GatewayRoutingPublicApiRegistry.length, 76);
    assert.equal(getGatewayRoutingPublicApiCount(), 76);
    assertUnique(
      GatewayRoutingPublicApiRegistry.map((item) => item.id),
      "public api ids",
    );
    assertUnique(
      GatewayRoutingPublicApiRegistry.map(
        (item) => `${item.phase}:${item.exportName}`,
      ),
      "phase+export pairs",
    );

    const byPhase = Object.fromEntries(
      PHASE_ORDER.map((phase) => [
        phase,
        GatewayRoutingPublicApiRegistry.filter((item) => item.phase === phase),
      ]),
    );
    assert.equal(byPhase["NEA-5:1"].length, 8);
    assert.equal(byPhase["NEA-5:2"].length, 8);
    assert.equal(byPhase["NEA-5:3"].length, 8);
    assert.equal(byPhase["NEA-5:4"].length, 8);
    assert.equal(byPhase["NEA-5:5"].length, 8);
    assert.equal(byPhase["NEA-5:6"].length, 8);
    assert.equal(byPhase["NEA-5:7"].length, 8);
    assert.equal(byPhase["NEA-5:8"].length, 8);
    assert.equal(byPhase["NEA-5:9"].length, 12);

    assert.ok(
      GatewayRoutingPublicApiRegistry.every(
        (item) => item.status === "Released",
      ),
    );
    assert.ok(
      GatewayRoutingPublicApiRegistry.every(
        (item) => item.certificationStatus === "Certified",
      ),
    );
    assert.ok(
      GatewayRoutingPublicApiRegistry.every(
        (item) => item.freezeStatus === "Frozen",
      ),
    );
  });

  it("preserves Freeze-reachable upstream apiRegistries and route identities", () => {
    const publicNs = GatewayRoutingPlatformPublicFoundation;
    assert.equal(
      publicNs.foundation.apiRegistry,
      GatewayRoutingFoundationPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.registry.apiRegistry,
      GatewayRoutingRegistryPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.model.apiRegistry,
      GatewayRoutingModelPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.validation.apiRegistry,
      GatewayRoutingValidationPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.manifest.apiRegistry,
      GatewayRoutingManifestPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.platform.apiRegistry,
      GatewayRoutingPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.certification.apiRegistry,
      GatewayRoutingCertificationPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.freeze.apiRegistry,
      GatewayRoutingFreezePlatform.apiRegistry,
    );
    assert.equal(publicNs.registry.collections.routeIdentityCount, 10);
    assert.equal(publicNs.model.domainModels.modelCount, 20);
    assert.equal(
      publicNs.registry.collections.routeIdentities,
      GatewayRoutingFreezePlatform.registry.routeIdentities,
    );
    assert.equal(
      publicNs.model.domainModels.models,
      GatewayRoutingFreezePlatform.registry.domainModels,
    );
    assert.ok(
      publicNs.model.domainModels.models.some(
        (item) => item.modelKind === "RouteDefinition",
      ),
    );
  });

  it("derives deterministic consumer summary from canonical Freeze references", () => {
    const summaryA = getGatewayRoutingPublicSummary();
    const summaryB = getGatewayRoutingPublicSummary();
    const freezeSummary = GatewayRoutingFreezePlatform.summary;
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.publicIndexId, GatewayRoutingPublicIndexId);
    assert.equal(summaryA.releaseStatus, "Released");
    assert.equal(summaryA.certificationStatus, "Certified");
    assert.equal(summaryA.freezeStatus, "Frozen");
    assert.equal(summaryA.consumerReadiness, "ReadyForConsumer");
    assert.equal(summaryA.publicNamespaceSectionCount, 9);
    assert.equal(summaryA.nea59ExportCount, 12);
    assert.equal(summaryA.publicApiRegistryCount, 76);
    assert.equal(summaryA.foundationApiCount, 8);
    assert.equal(summaryA.freezeApiCount, 8);
    assert.equal(summaryA.publicIndexApiCount, 12);
    assert.equal(summaryA.routeIdentityCount, 10);
    assert.equal(summaryA.domainModelCount, 20);
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
    const meta = getGatewayRoutingPublicReleaseMetadata();
    assert.equal(Object.isFrozen(meta), true);
    assert.equal(meta.releaseStatus, "Released");
    assert.equal(meta.certificationStatus, "Certified");
    assert.equal(meta.freezeStatus, "Frozen");
    assert.equal(meta.stabilityStatus, "Stable");
    assert.equal(meta.consumerReadiness, "ReadyForConsumer");
    assert.equal(meta.canonicalEntryPoint, "gatewayRoutingPublicIndex.ts");
    assert.equal(meta.directImportPolicy, "PublicIndexOnly");
    assert.equal(meta.publicApiCount, 76);
    assert.equal(meta.phaseCount, 9);
    assert.equal(meta.routeIdentityCount, 10);
    assert.equal(meta.guaranteeCount, 17);

    const publicNs = GatewayRoutingPlatformPublicFoundation;
    assert.equal(publicNs.runtimeBehavior, false);
    assert.equal(publicNs.serviceExecution, false);
    assert.equal(publicNs.implementsRuntimeRouting, false);
    assert.equal(publicNs.implementsRoutingAlgorithms, false);
    assert.equal(publicNs.executesStrategies, false);
    assert.equal(publicNs.implementsConsumerSelection, false);
    assert.equal(publicNs.networkingBehavior, false);
    assert.equal(publicNs.persistenceBehavior, false);
    assert.equal(publicNs.aiBehavior, false);
    assert.equal(publicNs.routingBehavior, false);
    assert.equal(publicNs.rebuildsInventories, false);
    assert.equal(publicNs.recertifies, false);
    assert.equal(publicNs.refreezes, false);
  });
});
