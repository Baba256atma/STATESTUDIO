/**
 * NEA-4:9 — Security Gateway Public Index Tests.
 *
 * Deterministic coverage for the sole NEA-4 public release surface.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { SecurityGatewayCertificationPlatform } from "./securityGatewayCertification.ts";
import { SecurityGatewayFoundationPlatform } from "./securityGatewayFoundation.ts";
import { SecurityGatewayFreezePlatform } from "./securityGatewayFreeze.ts";
import { SecurityGatewayManifestPlatform } from "./securityGatewayManifest.ts";
import { SecurityGatewayModelPlatform } from "./securityGatewayModel.ts";
import { SecurityGatewayPlatform } from "./securityGatewayPlatform.ts";
import * as PublicIndexModule from "./securityGatewayPublicIndex.ts";
import {
  SecurityGatewayPlatformPublicFoundation,
  SecurityGatewayPublicApiRegistry,
  SecurityGatewayPublicCertificationStatus,
  SecurityGatewayPublicFreezeStatus,
  SecurityGatewayPublicIndexId,
  SecurityGatewayPublicIndexName,
  SecurityGatewayPublicIndexNamespace,
  SecurityGatewayPublicIndexVersion,
  SecurityGatewayPublicReleaseStatus,
  getSecurityGatewayPublicApiCount,
  getSecurityGatewayPublicReleaseMetadata,
  getSecurityGatewayPublicSummary,
} from "./securityGatewayPublicIndex.ts";
import { SecurityGatewayRegistryPlatform } from "./securityGatewayRegistry.ts";
import { SecurityGatewayValidationPlatform } from "./securityGatewayValidation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA49_FILES = Object.freeze([
  "securityGatewayPublicIndex.ts",
  "securityGatewayPublicIndex.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "SecurityGatewayPlatformPublicFoundation",
  "SecurityGatewayPublicApiRegistry",
  "SecurityGatewayPublicIndexId",
  "SecurityGatewayPublicIndexVersion",
  "SecurityGatewayPublicIndexName",
  "SecurityGatewayPublicIndexNamespace",
  "SecurityGatewayPublicReleaseStatus",
  "SecurityGatewayPublicCertificationStatus",
  "SecurityGatewayPublicFreezeStatus",
  "getSecurityGatewayPublicSummary",
  "getSecurityGatewayPublicApiCount",
  "getSecurityGatewayPublicReleaseMetadata",
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
  "NEA-4:1",
  "NEA-4:2",
  "NEA-4:3",
  "NEA-4:4",
  "NEA-4:5",
  "NEA-4:6",
  "NEA-4:7",
  "NEA-4:8",
  "NEA-4:9",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-4:9 Security Gateway Public Index", () => {
  it("creates exactly two Public Index files and twelve public exports", () => {
    assert.equal(NEA49_FILES.length, 2);
    const present = readdirSync(HERE);
    for (const file of NEA49_FILES) {
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
      SecurityGatewayPublicIndexId,
      "NEA-4:9/SecurityGatewayPublicIndex",
    );
    assert.equal(SecurityGatewayPublicIndexVersion, "1.0.0");
    assert.equal(
      SecurityGatewayPublicIndexName,
      "Security Gateway Public Index",
    );
    assert.equal(
      SecurityGatewayPublicIndexNamespace,
      "nexora.nea.security-gateway.public-index",
    );
    assert.equal(SecurityGatewayPublicReleaseStatus, "Released");
    assert.equal(SecurityGatewayPublicCertificationStatus, "Certified");
    assert.equal(SecurityGatewayPublicFreezeStatus, "Frozen");

    const meta = SecurityGatewayPlatformPublicFoundation.publicIndex;
    assert.equal(meta.stabilityStatus, "Stable");
    assert.equal(meta.architectureStatus, "Complete");
    assert.equal(meta.architectureVersion, "NEA-4.0.0");
    assert.equal(meta.consumerReadiness, "ReadyForConsumer");
    assert.equal(meta.nextPhaseReadiness, "NEA-4 Complete");
    assert.equal(meta.solePublicEntryPoint, "securityGatewayPublicIndex.ts");
  });

  it("consumes Freeze as sole dependency", () => {
    const deps =
      SecurityGatewayPlatformPublicFoundation.dependencyDeclarations;
    assert.equal(deps.directPreviousPhaseModule, "securityGatewayFreeze.ts");
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
    const publicNs = SecurityGatewayPlatformPublicFoundation;
    const keys = Object.keys(publicNs);
    assert.deepEqual(keys.slice(0, 9), [...NAMESPACE_SECTIONS]);
    assert.equal(NAMESPACE_SECTIONS.length, 9);

    assert.equal(publicNs.freeze, SecurityGatewayFreezePlatform);
    assert.equal(
      publicNs.certification,
      SecurityGatewayFreezePlatform.certification,
    );
    assert.equal(
      publicNs.platform,
      SecurityGatewayFreezePlatform.certification.platform,
    );
    assert.equal(
      publicNs.manifest,
      SecurityGatewayFreezePlatform.certification.platform.namespace.manifest,
    );
    assert.equal(
      publicNs.validation,
      SecurityGatewayFreezePlatform.certification.platform.namespace
        .validation,
    );
    assert.equal(
      publicNs.model,
      SecurityGatewayFreezePlatform.certification.platform.namespace.model,
    );
    assert.equal(
      publicNs.registry,
      SecurityGatewayFreezePlatform.certification.platform.namespace.registry,
    );
    assert.equal(
      publicNs.foundation,
      SecurityGatewayFreezePlatform.certification.platform.namespace
        .foundation,
    );

    assert.equal(publicNs.certification, SecurityGatewayCertificationPlatform);
    assert.equal(publicNs.platform, SecurityGatewayPlatform);
    assert.equal(publicNs.manifest, SecurityGatewayManifestPlatform);
    assert.equal(publicNs.validation, SecurityGatewayValidationPlatform);
    assert.equal(publicNs.model, SecurityGatewayModelPlatform);
    assert.equal(publicNs.registry, SecurityGatewayRegistryPlatform);
    assert.equal(publicNs.foundation, SecurityGatewayFoundationPlatform);

    assert.equal(
      publicNs.publicIndex.publicIndexId,
      SecurityGatewayPublicIndexId,
    );
    assert.equal(Object.isFrozen(publicNs), true);
    assert.equal(Object.isFrozen(publicNs.publicIndex), true);
  });

  it("derives Public API Registry from Freeze-reachable registries without duplicates", () => {
    assert.equal(SecurityGatewayPublicApiRegistry.length, 76);
    assert.equal(getSecurityGatewayPublicApiCount(), 76);
    assertUnique(
      SecurityGatewayPublicApiRegistry.map((item) => item.id),
      "public api ids",
    );
    assertUnique(
      SecurityGatewayPublicApiRegistry.map(
        (item) => `${item.phase}:${item.exportName}`,
      ),
      "phase+export pairs",
    );

    const byPhase = Object.fromEntries(
      PHASE_ORDER.map((phase) => [
        phase,
        SecurityGatewayPublicApiRegistry.filter((item) => item.phase === phase),
      ]),
    );
    assert.equal(byPhase["NEA-4:1"].length, 8);
    assert.equal(byPhase["NEA-4:2"].length, 8);
    assert.equal(byPhase["NEA-4:3"].length, 8);
    assert.equal(byPhase["NEA-4:4"].length, 8);
    assert.equal(byPhase["NEA-4:5"].length, 8);
    assert.equal(byPhase["NEA-4:6"].length, 8);
    assert.equal(byPhase["NEA-4:7"].length, 8);
    assert.equal(byPhase["NEA-4:8"].length, 8);
    assert.equal(byPhase["NEA-4:9"].length, 12);

    assert.ok(
      SecurityGatewayPublicApiRegistry.every(
        (item) => item.status === "Released",
      ),
    );
    assert.ok(
      SecurityGatewayPublicApiRegistry.every(
        (item) => item.certificationStatus === "Certified",
      ),
    );
    assert.ok(
      SecurityGatewayPublicApiRegistry.every(
        (item) => item.freezeStatus === "Frozen",
      ),
    );
  });

  it("preserves Freeze-reachable upstream apiRegistries and security registries", () => {
    const publicNs = SecurityGatewayPlatformPublicFoundation;
    assert.equal(
      publicNs.foundation.apiRegistry,
      SecurityGatewayFoundationPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.registry.apiRegistry,
      SecurityGatewayRegistryPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.model.apiRegistry,
      SecurityGatewayModelPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.validation.apiRegistry,
      SecurityGatewayValidationPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.manifest.apiRegistry,
      SecurityGatewayManifestPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.platform.apiRegistry,
      SecurityGatewayPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.certification.apiRegistry,
      SecurityGatewayCertificationPlatform.apiRegistry,
    );
    assert.equal(
      publicNs.freeze.apiRegistry,
      SecurityGatewayFreezePlatform.apiRegistry,
    );
    assert.equal(publicNs.registry.collections.securityIdentityCount, 8);
    assert.equal(publicNs.registry.collections.securityPolicyCount, 6);
    assert.equal(publicNs.registry.collections.permissionCount, 8);
    assert.equal(
      publicNs.registry.collections.securityIdentities,
      SecurityGatewayFreezePlatform.registry.securityIdentities,
    );
    assert.equal(
      publicNs.registry.collections.securityPolicies,
      SecurityGatewayFreezePlatform.registry.securityPolicies,
    );
    assert.equal(
      publicNs.registry.collections.permissions,
      SecurityGatewayFreezePlatform.registry.permissions,
    );
  });

  it("derives deterministic consumer summary from canonical Freeze references", () => {
    const summaryA = getSecurityGatewayPublicSummary();
    const summaryB = getSecurityGatewayPublicSummary();
    const freezeSummary = SecurityGatewayFreezePlatform.summary;
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.publicIndexId, SecurityGatewayPublicIndexId);
    assert.equal(summaryA.releaseStatus, "Released");
    assert.equal(summaryA.certificationStatus, "Certified");
    assert.equal(summaryA.freezeStatus, "Frozen");
    assert.equal(summaryA.consumerReadiness, "ReadyForConsumer");
    assert.equal(summaryA.publicNamespaceSectionCount, 9);
    assert.equal(summaryA.nea49ExportCount, 12);
    assert.equal(summaryA.publicApiRegistryCount, 76);
    assert.equal(summaryA.foundationApiCount, 8);
    assert.equal(summaryA.freezeApiCount, 8);
    assert.equal(summaryA.publicIndexApiCount, 12);
    assert.equal(summaryA.securityIdentityCount, 8);
    assert.equal(summaryA.securityPolicyCount, 6);
    assert.equal(summaryA.permissionCount, 8);
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
    const meta = getSecurityGatewayPublicReleaseMetadata();
    assert.equal(Object.isFrozen(meta), true);
    assert.equal(meta.releaseStatus, "Released");
    assert.equal(meta.certificationStatus, "Certified");
    assert.equal(meta.freezeStatus, "Frozen");
    assert.equal(meta.stabilityStatus, "Stable");
    assert.equal(meta.consumerReadiness, "ReadyForConsumer");
    assert.equal(meta.canonicalEntryPoint, "securityGatewayPublicIndex.ts");
    assert.equal(meta.directImportPolicy, "PublicIndexOnly");
    assert.equal(meta.publicApiCount, 76);
    assert.equal(meta.phaseCount, 9);
    assert.equal(meta.securityIdentityCount, 8);
    assert.equal(meta.guaranteeCount, 17);

    const publicNs = SecurityGatewayPlatformPublicFoundation;
    assert.equal(publicNs.runtimeBehavior, false);
    assert.equal(publicNs.serviceExecution, false);
    assert.equal(publicNs.executesAuthentication, false);
    assert.equal(publicNs.executesAuthorization, false);
    assert.equal(publicNs.implementsEncryption, false);
    assert.equal(publicNs.runtimeSecurity, false);
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
