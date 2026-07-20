/**
 * NEA-7:6 — Intake Orchestration Platform Tests.
 *
 * Deterministic coverage for the immutable Intake Orchestration Platform.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  IntakeOrchestrationManifestId,
  IntakeOrchestrationManifestPlatform,
} from "./intakeOrchestrationManifest.ts";
import * as PlatformModule from "./intakeOrchestrationPlatform.ts";
import {
  IntakeOrchestrationPlatform,
  IntakeOrchestrationPlatformId,
  IntakeOrchestrationPlatformName,
  IntakeOrchestrationPlatformNamespace,
  IntakeOrchestrationPlatformReadiness,
  IntakeOrchestrationPlatformStatus,
  IntakeOrchestrationPlatformVersion,
  getIntakeOrchestrationPlatformSummary,
} from "./intakeOrchestrationPlatform.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA76_FILES = Object.freeze([
  "intakeOrchestrationPlatformTypes.ts",
  "intakeOrchestrationPlatformNamespace.ts",
  "intakeOrchestrationPlatformMetadata.ts",
  "intakeOrchestrationPlatformOwnership.ts",
  "intakeOrchestrationPlatformReadiness.ts",
  "intakeOrchestrationPlatformSummary.ts",
  "intakeOrchestrationPlatform.ts",
  "intakeOrchestrationPlatform.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntakeOrchestrationPlatformId",
  "IntakeOrchestrationPlatformVersion",
  "IntakeOrchestrationPlatformName",
  "IntakeOrchestrationPlatformNamespace",
  "IntakeOrchestrationPlatformStatus",
  "IntakeOrchestrationPlatformReadiness",
  "IntakeOrchestrationPlatform",
  "getIntakeOrchestrationPlatformSummary",
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

describe("NEA-7:6 Intake Orchestration Platform", () => {
  it("creates exactly eight Platform files and eight public exports", () => {
    assert.equal(NEA76_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA76_FILES) {
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
      IntakeOrchestrationPlatformId,
      "NEA-7:6/IntakeOrchestrationPlatform",
    );
    assert.equal(IntakeOrchestrationPlatformVersion, "1.0.0");
    assert.equal(
      IntakeOrchestrationPlatformName,
      "Intake Orchestration Platform",
    );
    assert.equal(
      IntakeOrchestrationPlatformNamespace,
      "nexora.nea.intake-orchestration.platform",
    );
    assert.equal(IntakeOrchestrationPlatformStatus, "Platform");
    assert.equal(
      IntakeOrchestrationPlatformReadiness,
      "ReadyForCertification",
    );
    assert.equal(IntakeOrchestrationPlatform.identity.phase, "NEA-7:6");
    assert.equal(
      IntakeOrchestrationPlatform.identity.manifestId,
      IntakeOrchestrationManifestId,
    );
    assert.equal(
      IntakeOrchestrationPlatform.nextPhase,
      "NEA-7:7 — Intake Orchestration Certification",
    );
  });

  it("consumes only NEA-7:5 Manifest and preserves the canonical phase chain", () => {
    const dependency = IntakeOrchestrationPlatform.dependency;
    assert.equal(dependency.manifestOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "intakeOrchestrationManifest.ts",
    );
    assert.equal(dependency.manifestId, IntakeOrchestrationManifestId);
    assert.equal(dependency.validationDirectImport, false);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.duplicatesUpstreamArchitecture, false);
    assert.equal(dependency.redefinesPriorPhases, false);
    assert.equal(
      IntakeOrchestrationPlatform.manifestPlatform,
      IntakeOrchestrationManifestPlatform,
    );

    const ns = IntakeOrchestrationPlatform.namespace;
    assert.equal(ns.foundation, ns.registry.foundationPlatform);
    assert.equal(ns.registry, ns.model.registryPlatform);
    assert.equal(ns.model, ns.validation.modelPlatform);
    assert.equal(ns.validation, ns.manifest.validationPlatform);
    assert.equal(ns.manifest, IntakeOrchestrationManifestPlatform);
  });

  it("exposes a six-section namespace with complete phase composition", () => {
    const ns = IntakeOrchestrationPlatform.namespace;
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
      "intakeOrchestrationPlatform.ts",
    );
    assert.equal(ns.composition[5]?.phaseId, IntakeOrchestrationPlatformId);
  });

  it("declares ownership, consumer surface, and forbidden boundaries", () => {
    const { ownership, boundaries, consumer } = IntakeOrchestrationPlatform;
    assert.ok(ownership.owns.includes("Canonical Namespace Composition"));
    assert.ok(ownership.owns.includes("Platform Metadata"));
    assert.ok(ownership.owns.includes("Consumer Access Declaration"));
    assert.ok(ownership.owns.includes("Platform Readiness"));
    assert.ok(ownership.doesNotOwn.includes("Foundation Contracts"));
    assert.ok(ownership.doesNotOwn.includes("Manifest Inventories"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Orchestration"));
    assert.ok(ownership.doesNotOwn.includes("Message Normalization"));
    assert.equal(ownership.ownsManifestInventories, false);
    assert.equal(ownership.ownsRuntimeOrchestration, false);

    assert.equal(
      consumer.soleSupportedEntryPoint,
      "intakeOrchestrationPlatform.ts",
    );
    assert.ok(
      boundaries.consumerAccessRule.includes("IntakeOrchestrationPlatform"),
    );
    assert.ok(
      boundaries.prohibitedSurfaces.includes("Runtime Orchestration"),
    );
    assert.ok(boundaries.prohibitedSurfaces.includes("HTTP"));
    assert.ok(boundaries.prohibitedSurfaces.includes("DKL Invocation"));
    assert.equal(boundaries.implementsRuntimeOrchestration, false);
    assert.equal(boundaries.assemblesRuntimePackage, false);
    assert.equal(boundaries.duplicatesUpstreamArchitecture, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = IntakeOrchestrationPlatform;
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
    const summaryA = getIntakeOrchestrationPlatformSummary();
    const summaryB = getIntakeOrchestrationPlatformSummary();
    const manifest = IntakeOrchestrationManifestPlatform;
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.platformId, IntakeOrchestrationPlatformId);
    assert.equal(summaryA.status, "Platform");
    assert.equal(summaryA.readiness, "ReadyForCertification");
    assert.equal(summaryA.manifestId, IntakeOrchestrationManifestId);
    assert.equal(summaryA.architectureVersion, "NEA-7.0.0");
    assert.equal(summaryA.compositionMode, "CanonicalReferenceOnly");
    assert.equal(summaryA.runtimeBehavior, false);
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
    assert.equal(summaryA.totalArchitectureCount, 323);
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 9);
    assert.equal(summaryA.architectureStatus, "PlatformComposed");
    assert.equal(
      summaryA.nextPhase,
      "NEA-7:7 — Intake Orchestration Certification",
    );
    assert.equal(IntakeOrchestrationPlatform.metadata.countsHardcoded, false);
    assert.equal(
      IntakeOrchestrationPlatform.metadata.compositionMode,
      "CanonicalReferenceOnly",
    );
    assert.equal(
      IntakeOrchestrationPlatform.metadata.architectureVersion,
      "NEA-7.0.0",
    );
    assert.equal(
      IntakeOrchestrationPlatform.metadata.runtimeBehavior,
      false,
    );
    assert.equal(
      IntakeOrchestrationPlatform.metadata.runtimeOrchestration,
      false,
    );
    assert.equal(
      IntakeOrchestrationPlatform.metadata.assemblesRuntimePackage,
      false,
    );
    assert.equal(IntakeOrchestrationPlatform.metadata.invokesDKL, false);
    assert.equal(
      IntakeOrchestrationPlatform.metadata.consumerEntryPoint,
      "intakeOrchestrationPlatform.ts",
    );
  });

  it("declares ReadyForCertification only and no forbidden runtime implementation", () => {
    assert.equal(
      IntakeOrchestrationPlatform.readiness.readiness,
      "ReadyForCertification",
    );
    assert.equal(IntakeOrchestrationPlatform.readiness.consumerReady, true);
    assert.equal(
      IntakeOrchestrationPlatform.readiness.claimsReadyForFreeze,
      false,
    );
    assert.equal(
      IntakeOrchestrationPlatform.readiness.claimsRuntimeReady,
      false,
    );
    assert.equal(IntakeOrchestrationPlatform.runtimeBehavior, false);
    assert.equal(IntakeOrchestrationPlatform.validationExecution, false);
    assert.equal(
      IntakeOrchestrationPlatform.implementsRuntimeOrchestration,
      false,
    );
    assert.equal(
      IntakeOrchestrationPlatform.assemblesRuntimePackage,
      false,
    );
    assert.equal(IntakeOrchestrationPlatform.normalizesMessages, false);
    assert.equal(IntakeOrchestrationPlatform.parsesMessages, false);
    assert.equal(IntakeOrchestrationPlatform.aiReasoning, false);
    assert.equal(IntakeOrchestrationPlatform.invokesDkl, false);
  });
});
