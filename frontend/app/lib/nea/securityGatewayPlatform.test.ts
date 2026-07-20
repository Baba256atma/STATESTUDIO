/**
 * NEA-4:6 — Security Gateway Platform Tests.
 *
 * Deterministic coverage for the immutable Security Gateway Platform.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  SecurityGatewayManifestId,
  SecurityGatewayManifestPlatform,
} from "./securityGatewayManifest.ts";
import * as PlatformModule from "./securityGatewayPlatform.ts";
import {
  SecurityGatewayPlatform,
  SecurityGatewayPlatformId,
  SecurityGatewayPlatformName,
  SecurityGatewayPlatformNamespace,
  SecurityGatewayPlatformReadiness,
  SecurityGatewayPlatformStatus,
  SecurityGatewayPlatformVersion,
  getSecurityGatewayPlatformSummary,
} from "./securityGatewayPlatform.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA46_FILES = Object.freeze([
  "securityGatewayPlatformTypes.ts",
  "securityGatewayPlatformNamespace.ts",
  "securityGatewayPlatformMetadata.ts",
  "securityGatewayPlatformOwnership.ts",
  "securityGatewayPlatformReadiness.ts",
  "securityGatewayPlatformSummary.ts",
  "securityGatewayPlatform.ts",
  "securityGatewayPlatform.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "SecurityGatewayPlatformId",
  "SecurityGatewayPlatformVersion",
  "SecurityGatewayPlatformName",
  "SecurityGatewayPlatformNamespace",
  "SecurityGatewayPlatformStatus",
  "SecurityGatewayPlatformReadiness",
  "SecurityGatewayPlatform",
  "getSecurityGatewayPlatformSummary",
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

describe("NEA-4:6 Security Gateway Platform", () => {
  it("creates exactly eight Platform files and eight public exports", () => {
    assert.equal(NEA46_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA46_FILES) {
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
      SecurityGatewayPlatformId,
      "NEA-4:6/SecurityGatewayPlatform",
    );
    assert.equal(SecurityGatewayPlatformVersion, "1.0.0");
    assert.equal(
      SecurityGatewayPlatformName,
      "Security Gateway Platform",
    );
    assert.equal(
      SecurityGatewayPlatformNamespace,
      "nexora.nea.security-gateway.platform",
    );
    assert.equal(SecurityGatewayPlatformStatus, "Platform");
    assert.equal(
      SecurityGatewayPlatformReadiness,
      "ReadyForCertification",
    );
    assert.equal(SecurityGatewayPlatform.identity.phase, "NEA-4:6");
    assert.equal(
      SecurityGatewayPlatform.identity.manifestId,
      SecurityGatewayManifestId,
    );
    assert.equal(
      SecurityGatewayPlatform.nextPhase,
      "NEA-4:7 — Security Gateway Certification",
    );
  });

  it("consumes only NEA-4:5 Manifest and preserves the canonical phase chain", () => {
    const dependency = SecurityGatewayPlatform.dependency;
    assert.equal(dependency.manifestOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "securityGatewayManifest.ts",
    );
    assert.equal(dependency.manifestId, SecurityGatewayManifestId);
    assert.equal(dependency.validationDirectImport, false);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.duplicatesUpstreamArchitecture, false);
    assert.equal(dependency.redefinesPriorPhases, false);
    assert.equal(
      SecurityGatewayPlatform.manifestPlatform,
      SecurityGatewayManifestPlatform,
    );

    const ns = SecurityGatewayPlatform.namespace;
    assert.equal(ns.foundation, ns.registry.foundationPlatform);
    assert.equal(ns.registry, ns.model.registryPlatform);
    assert.equal(ns.model, ns.validation.modelPlatform);
    assert.equal(ns.validation, ns.manifest.validationPlatform);
    assert.equal(ns.manifest, SecurityGatewayManifestPlatform);
  });

  it("exposes a six-section namespace with complete phase composition", () => {
    const ns = SecurityGatewayPlatform.namespace;
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
    assert.equal(ns.composition[5]?.module, "securityGatewayPlatform.ts");
    assert.equal(ns.composition[5]?.phaseId, SecurityGatewayPlatformId);
  });

  it("declares ownership, consumer surface, and forbidden boundaries", () => {
    const { ownership, boundaries, consumer } = SecurityGatewayPlatform;
    assert.ok(ownership.owns.includes("Platform Namespace"));
    assert.ok(ownership.owns.includes("Platform Metadata"));
    assert.ok(ownership.owns.includes("Consumer Composition"));
    assert.ok(ownership.owns.includes("Platform Readiness"));
    assert.ok(ownership.doesNotOwn.includes("Foundation Contracts"));
    assert.ok(ownership.doesNotOwn.includes("Manifest Inventory"));
    assert.ok(ownership.doesNotOwn.includes("Authentication"));
    assert.ok(ownership.doesNotOwn.includes("Encryption"));
    assert.equal(ownership.ownsManifestInventory, false);
    assert.equal(ownership.ownsRuntimeSecurity, false);

    assert.equal(
      consumer.soleSupportedEntryPoint,
      "securityGatewayPlatform.ts",
    );
    assert.ok(
      boundaries.consumerAccessRule.includes("SecurityGatewayPlatform"),
    );
    assert.ok(boundaries.prohibitedSurfaces.includes("Authentication"));
    assert.ok(boundaries.prohibitedSurfaces.includes("OAuth"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Encryption"));
    assert.equal(boundaries.executesAuthentication, false);
    assert.equal(boundaries.implementsEncryption, false);
    assert.equal(boundaries.duplicatesUpstreamArchitecture, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = SecurityGatewayPlatform;
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
    const summaryA = getSecurityGatewayPlatformSummary();
    const summaryB = getSecurityGatewayPlatformSummary();
    const manifest = SecurityGatewayManifestPlatform;
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.platformId, SecurityGatewayPlatformId);
    assert.equal(summaryA.status, "Platform");
    assert.equal(summaryA.readiness, "ReadyForCertification");
    assert.equal(summaryA.manifestId, SecurityGatewayManifestId);
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
      "NEA-4:7 — Security Gateway Certification",
    );
    assert.equal(
      SecurityGatewayPlatform.metadata.compositionMode,
      "CanonicalReferenceOnly",
    );
    assert.equal(
      SecurityGatewayPlatform.metadata.compatibility.compositionMode,
      "CanonicalReferenceOnly",
    );
    assert.equal(SecurityGatewayPlatform.metadata.architectureVersion, "NEA-4.0.0");
    assert.equal(SecurityGatewayPlatform.metadata.countsHardcoded, false);
    assert.equal(
      SecurityGatewayPlatform.metadata.duplicatesUpstreamArchitecture,
      false,
    );
    assert.equal(SecurityGatewayPlatform.readiness.consumerReady, true);
    assert.equal(SecurityGatewayPlatform.runtimeBehavior, false);
    assert.equal(SecurityGatewayPlatform.executesAuthentication, false);
    assert.equal(SecurityGatewayPlatform.implementsEncryption, false);
    assert.equal(SecurityGatewayPlatform.validationExecution, false);
    assert.equal(SecurityGatewayPlatform.runtimeSecurity, false);
  });
});
