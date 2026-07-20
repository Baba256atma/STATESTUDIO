/**
 * NEA-1:9 — Executive Gateway Public Index Tests.
 *
 * Deterministic coverage for the sole NEA-1 public release surface.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { ExecutiveGatewayCertificationPlatform } from "./executiveGatewayCertification.ts";
import { ExecutiveGatewayFoundationPlatform } from "./executiveGatewayFoundation.ts";
import { ExecutiveGatewayFreezePlatform } from "./executiveGatewayFreeze.ts";
import { ExecutiveGatewayManifestPlatform } from "./executiveGatewayManifest.ts";
import { ExecutiveGatewayModelPlatform } from "./executiveGatewayModel.ts";
import { ExecutiveGatewayPlatform } from "./executiveGatewayPlatform.ts";
import * as PublicIndexModule from "./executiveGatewayPublicIndex.ts";
import {
  ExecutiveGatewayPlatformPublicFoundation,
  ExecutiveGatewayPublicApiRegistry,
  ExecutiveGatewayPublicCertificationStatus,
  ExecutiveGatewayPublicFreezeStatus,
  ExecutiveGatewayPublicIndexId,
  ExecutiveGatewayPublicIndexName,
  ExecutiveGatewayPublicIndexNamespace,
  ExecutiveGatewayPublicIndexVersion,
  ExecutiveGatewayPublicReleaseStatus,
  getExecutiveGatewayPublicApiCount,
  getExecutiveGatewayPublicReleaseMetadata,
  getExecutiveGatewayPublicSummary,
} from "./executiveGatewayPublicIndex.ts";
import { ExecutiveGatewayRegistryPlatform } from "./executiveGatewayRegistry.ts";
import { ExecutiveGatewayValidationPlatform } from "./executiveGatewayValidation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA19_FILES = Object.freeze([
  "executiveGatewayPublicIndex.ts",
  "executiveGatewayPublicIndex.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ExecutiveGatewayPlatformPublicFoundation",
  "ExecutiveGatewayPublicApiRegistry",
  "ExecutiveGatewayPublicIndexId",
  "ExecutiveGatewayPublicIndexVersion",
  "ExecutiveGatewayPublicIndexName",
  "ExecutiveGatewayPublicIndexNamespace",
  "ExecutiveGatewayPublicReleaseStatus",
  "ExecutiveGatewayPublicCertificationStatus",
  "ExecutiveGatewayPublicFreezeStatus",
  "getExecutiveGatewayPublicSummary",
  "getExecutiveGatewayPublicApiCount",
  "getExecutiveGatewayPublicReleaseMetadata",
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
  "NEA-1:1",
  "NEA-1:2",
  "NEA-1:3",
  "NEA-1:4",
  "NEA-1:5",
  "NEA-1:6",
  "NEA-1:7",
  "NEA-1:8",
  "NEA-1:9",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-1:9 Executive Gateway Public Index", () => {
  it("creates exactly two Public Index files and twelve public exports", () => {
    assert.equal(NEA19_FILES.length, 2);
    const present = readdirSync(HERE);
    for (const file of NEA19_FILES) {
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
      ExecutiveGatewayPublicIndexId,
      "NEA-1:9/ExecutiveGatewayPublicIndex",
    );
    assert.equal(ExecutiveGatewayPublicIndexVersion, "1.0.0");
    assert.equal(
      ExecutiveGatewayPublicIndexName,
      "Executive Gateway Public Index",
    );
    assert.equal(
      ExecutiveGatewayPublicIndexNamespace,
      "nexora.nea.executive-gateway.public-index",
    );
    assert.equal(ExecutiveGatewayPublicReleaseStatus, "Released");
    assert.equal(ExecutiveGatewayPublicCertificationStatus, "Certified");
    assert.equal(ExecutiveGatewayPublicFreezeStatus, "Frozen");

    const meta = ExecutiveGatewayPlatformPublicFoundation.publicIndex;
    assert.equal(meta.stabilityStatus, "Stable");
    assert.equal(meta.architectureStatus, "Complete");
    assert.equal(meta.architectureVersion, "NEA-1.0.0");
    assert.equal(meta.consumerReadiness, "ReadyForConsumer");
    assert.equal(meta.nextPhaseReadiness, "NEA-1 Complete");
    assert.equal(
      meta.solePublicEntryPoint,
      "executiveGatewayPublicIndex.ts",
    );
  });

  it("consumes Freeze as sole dependency", () => {
    const deps =
      ExecutiveGatewayPlatformPublicFoundation.dependencyDeclarations;
    assert.equal(
      deps.directPreviousPhaseModule,
      "executiveGatewayFreeze.ts",
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
    const publicNs = ExecutiveGatewayPlatformPublicFoundation;
    const keys = Object.keys(publicNs);
    assert.deepEqual(keys.slice(0, 9), [...NAMESPACE_SECTIONS]);
    assert.equal(NAMESPACE_SECTIONS.length, 9);

    assert.equal(publicNs.freeze, ExecutiveGatewayFreezePlatform);
    assert.equal(
      publicNs.certification,
      ExecutiveGatewayFreezePlatform.certification,
    );
    assert.equal(
      publicNs.platform,
      ExecutiveGatewayFreezePlatform.certification.platform,
    );
    assert.equal(
      publicNs.manifest,
      ExecutiveGatewayFreezePlatform.certification.platform.namespace.manifest,
    );
    assert.equal(
      publicNs.validation,
      ExecutiveGatewayFreezePlatform.certification.platform.namespace
        .validation,
    );
    assert.equal(
      publicNs.model,
      ExecutiveGatewayFreezePlatform.certification.platform.namespace.model,
    );
    assert.equal(
      publicNs.registry,
      ExecutiveGatewayFreezePlatform.certification.platform.namespace.registry,
    );
    assert.equal(
      publicNs.foundation,
      ExecutiveGatewayFreezePlatform.certification.platform.namespace
        .foundation,
    );

    assert.equal(publicNs.certification, ExecutiveGatewayCertificationPlatform);
    assert.equal(publicNs.platform, ExecutiveGatewayPlatform);
    assert.equal(publicNs.manifest, ExecutiveGatewayManifestPlatform);
    assert.equal(publicNs.validation, ExecutiveGatewayValidationPlatform);
    assert.equal(publicNs.model, ExecutiveGatewayModelPlatform);
    assert.equal(publicNs.registry, ExecutiveGatewayRegistryPlatform);
    assert.equal(publicNs.foundation, ExecutiveGatewayFoundationPlatform);

    assert.equal(
      publicNs.publicIndex.publicIndexId,
      ExecutiveGatewayPublicIndexId,
    );
    assert.equal(Object.isFrozen(publicNs), true);
    assert.equal(Object.isFrozen(publicNs.publicIndex), true);
  });

  it("derives Public API Registry from Freeze-reachable registries without duplicates", () => {
    assert.equal(ExecutiveGatewayPublicApiRegistry.length, 76);
    assert.equal(getExecutiveGatewayPublicApiCount(), 76);
    assertUnique(
      ExecutiveGatewayPublicApiRegistry.map((item) => item.id),
      "public api ids",
    );
    assertUnique(
      ExecutiveGatewayPublicApiRegistry.map(
        (item) => `${item.phase}:${item.exportName}`,
      ),
      "phase+export pairs",
    );

    const byPhase = Object.fromEntries(
      PHASE_ORDER.map((phase) => [
        phase,
        ExecutiveGatewayPublicApiRegistry.filter(
          (item) => item.phase === phase,
        ),
      ]),
    );
    assert.equal(byPhase["NEA-1:1"].length, 8);
    assert.equal(byPhase["NEA-1:2"].length, 8);
    assert.equal(byPhase["NEA-1:3"].length, 8);
    assert.equal(byPhase["NEA-1:4"].length, 8);
    assert.equal(byPhase["NEA-1:5"].length, 8);
    assert.equal(byPhase["NEA-1:6"].length, 8);
    assert.equal(byPhase["NEA-1:7"].length, 8);
    assert.equal(byPhase["NEA-1:8"].length, 8);
    assert.equal(byPhase["NEA-1:9"].length, 12);

    assert.ok(
      ExecutiveGatewayPublicApiRegistry.every(
        (item) => item.status === "Released",
      ),
    );
    assert.ok(
      ExecutiveGatewayPublicApiRegistry.every(
        (item) => item.certificationStatus === "Certified",
      ),
    );
    assert.ok(
      ExecutiveGatewayPublicApiRegistry.every(
        (item) => item.freezeStatus === "Frozen",
      ),
    );
  });

  it("preserves Freeze-reachable upstream apiRegistries by reference", () => {
    const publicNs = ExecutiveGatewayPlatformPublicFoundation;
    assert.equal(
      publicNs.foundation.apiRegistry,
      ExecutiveGatewayFoundationPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.registry.apiRegistry,
      ExecutiveGatewayRegistryPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.model.apiRegistry,
      ExecutiveGatewayModelPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.validation.apiRegistry,
      ExecutiveGatewayValidationPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.manifest.apiRegistry,
      ExecutiveGatewayManifestPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.platform.apiRegistry,
      ExecutiveGatewayPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.certification.apiRegistry,
      ExecutiveGatewayCertificationPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.freeze.apiRegistry,
      ExecutiveGatewayFreezePlatform.apiRegistry,
    );
  });

  it("derives deterministic consumer summary from canonical Freeze references", () => {
    const summaryA = getExecutiveGatewayPublicSummary();
    const summaryB = getExecutiveGatewayPublicSummary();
    const freezeSummary = ExecutiveGatewayFreezePlatform.summary;
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.publicIndexId, ExecutiveGatewayPublicIndexId);
    assert.equal(summaryA.releaseStatus, "Released");
    assert.equal(summaryA.certificationStatus, "Certified");
    assert.equal(summaryA.freezeStatus, "Frozen");
    assert.equal(summaryA.consumerReadiness, "ReadyForConsumer");
    assert.equal(summaryA.publicNamespaceSectionCount, 9);
    assert.equal(summaryA.nea19ExportCount, 12);
    assert.equal(summaryA.publicApiRegistryCount, 76);
    assert.equal(summaryA.foundationApiCount, 8);
    assert.equal(summaryA.freezeApiCount, 8);
    assert.equal(summaryA.publicIndexApiCount, 12);
    assert.equal(
      summaryA.certificationOutcome,
      freezeSummary.certificationOutcome,
    );
    assert.equal(summaryA.lockCount, freezeSummary.lockCount);
    assert.equal(summaryA.frozenComponentCount, freezeSummary.componentCount);
    assert.equal(summaryA.releaseGuaranteeCount, 16);
  });

  it("exposes release metadata and forbids runtime behavior", () => {
    const meta = getExecutiveGatewayPublicReleaseMetadata();
    assert.equal(Object.isFrozen(meta), true);
    assert.equal(meta.releaseStatus, "Released");
    assert.equal(meta.certificationStatus, "Certified");
    assert.equal(meta.freezeStatus, "Frozen");
    assert.equal(meta.stabilityStatus, "Stable");
    assert.equal(meta.consumerReadiness, "ReadyForConsumer");
    assert.equal(meta.canonicalEntryPoint, "executiveGatewayPublicIndex.ts");
    assert.equal(meta.directImportPolicy, "PublicIndexOnly");
    assert.equal(meta.publicApiCount, 76);
    assert.equal(meta.phaseCount, 9);

    const publicNs = ExecutiveGatewayPlatformPublicFoundation;
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
