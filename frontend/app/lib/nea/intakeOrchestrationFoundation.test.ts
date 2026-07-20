/**
 * NEA-7:1 — Intake Orchestration Foundation Tests.
 *
 * Deterministic coverage for the immutable Intake Orchestration Foundation.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import * as FoundationModule from "./intakeOrchestrationFoundation.ts";
import {
  IntakeOrchestrationFoundationId,
  IntakeOrchestrationFoundationName,
  IntakeOrchestrationFoundationNamespace,
  IntakeOrchestrationFoundationPlatform,
  IntakeOrchestrationFoundationReadiness,
  IntakeOrchestrationFoundationStatus,
  IntakeOrchestrationFoundationVersion,
  getIntakeOrchestrationFoundationSummary,
} from "./intakeOrchestrationFoundation.ts";
import { MessageNormalizationPublicIndexId } from "./messageNormalizationPublicIndex.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA71_FILES = Object.freeze([
  "intakeOrchestrationFoundationTypes.ts",
  "intakeOrchestrationContracts.ts",
  "intakeOrchestrationCapabilities.ts",
  "intakeOrchestrationLifecycle.ts",
  "intakeOrchestrationOwnership.ts",
  "intakeOrchestrationBoundaries.ts",
  "intakeOrchestrationFoundation.ts",
  "intakeOrchestrationFoundation.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntakeOrchestrationFoundationId",
  "IntakeOrchestrationFoundationVersion",
  "IntakeOrchestrationFoundationName",
  "IntakeOrchestrationFoundationNamespace",
  "IntakeOrchestrationFoundationStatus",
  "IntakeOrchestrationFoundationReadiness",
  "IntakeOrchestrationFoundationPlatform",
  "getIntakeOrchestrationFoundationSummary",
] as const);

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "contracts",
  "references",
  "attachments",
  "results",
  "capabilities",
  "lifecycle",
  "ownership",
  "boundaries",
  "metadata",
  "summary",
  "readiness",
] as const);

const EXPECTED_CONTRACTS = Object.freeze([
  "ExecutiveIntakePackage",
  "IntakeIdentity",
  "IntakeMetadata",
  "IntakeContext",
  "IntakeSource",
  "MessageReference",
  "SessionReference",
  "ConversationReference",
  "AuthenticationReference",
  "RoutingReference",
  "ConnectorReference",
  "WorkspaceReference",
  "TenantReference",
  "CorrelationReference",
  "TraceReference",
  "AttachmentReferences",
  "IntakeResult",
  "Lifecycle",
  "Ownership",
  "Boundaries",
] as const);

const EXPECTED_REFERENCE_GROUPS = Object.freeze([
  "MessageReference",
  "SessionReference",
  "ConversationReference",
  "AuthenticationReference",
  "RoutingReference",
  "ConnectorReference",
  "WorkspaceReference",
  "TenantReference",
  "CorrelationReference",
  "TraceReference",
] as const);

const EXPECTED_ATTACHMENT_KINDS = Object.freeze([
  "File",
  "Image",
  "Document",
  "Link",
] as const);

const EXPECTED_RESULTS = Object.freeze([
  "Complete",
  "Incomplete",
  "Failed",
] as const);

const EXPECTED_CAPABILITIES = Object.freeze([
  "IntakeAssemblyDeclaration",
  "IntakeReferenceAggregation",
  "IntakeCompletenessDeclaration",
  "IntakeMetadataDeclaration",
  "IntakeCorrelationDeclaration",
  "IntakePublicationDeclaration",
  "IntakeSummaryDeclaration",
  "IntakeBoundaryDeclaration",
] as const);

const EXPECTED_LIFECYCLE = Object.freeze([
  "Collected",
  "Referenced",
  "Assembled",
  "Verified",
  "ReadyForDKL",
  "Published",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-7:1 Intake Orchestration Foundation", () => {
  it("creates exactly eight Foundation files and eight public exports", () => {
    assert.equal(NEA71_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA71_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(FoundationModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(FoundationModule).length, 8);
  });

  it("has canonical foundation identity, status Foundation, and ReadyForRegistry", () => {
    assert.equal(
      IntakeOrchestrationFoundationId,
      "NEA-7:1/IntakeOrchestrationFoundation",
    );
    assert.equal(IntakeOrchestrationFoundationVersion, "1.0.0");
    assert.equal(
      IntakeOrchestrationFoundationName,
      "Intake Orchestration Foundation",
    );
    assert.equal(
      IntakeOrchestrationFoundationNamespace,
      "nexora.nea.intake-orchestration.foundation",
    );
    assert.equal(IntakeOrchestrationFoundationStatus, "Foundation");
    assert.equal(IntakeOrchestrationFoundationReadiness, "ReadyForRegistry");
    assert.equal(
      IntakeOrchestrationFoundationPlatform.identity.phase,
      "NEA-7:1",
    );
    assert.equal(IntakeOrchestrationFoundationPlatform.identity.layer, "NEA");
    assert.equal(
      IntakeOrchestrationFoundationPlatform.identity.publicIndexId,
      MessageNormalizationPublicIndexId,
    );
    assert.equal(
      MessageNormalizationPublicIndexId,
      "NEA-6:9/MessageNormalizationPublicIndex",
    );
    assert.equal(
      IntakeOrchestrationFoundationPlatform.nextPhase,
      "NEA-7:2 — Intake Orchestration Registry",
    );
  });

  it("consumes only NEA-6 Message Normalization Public Index", () => {
    const dependency = IntakeOrchestrationFoundationPlatform.dependency;
    assert.equal(dependency.publicIndexOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "messageNormalizationPublicIndex.ts",
    );
    assert.equal(dependency.publicIndexId, MessageNormalizationPublicIndexId);
    assert.equal(dependency.freezeDirectImport, false);
    assert.equal(dependency.certificationDirectImport, false);
    assert.equal(dependency.platformDirectImport, false);
    assert.equal(dependency.laterNeaPhaseImport, false);
    assert.equal(dependency.circularDependency, false);
  });

  it("declares twenty contracts with exactly one canonical Executive Intake Package", () => {
    const { contracts } = IntakeOrchestrationFoundationPlatform;
    assert.equal(contracts.contractCount, 20);
    assert.deepEqual(
      contracts.contracts.map((item) => item.contractId.split("/").at(-1)),
      [...EXPECTED_CONTRACTS],
    );
    assertUnique(
      contracts.contracts.map((item) => item.contractId),
      "contract ids",
    );
    assert.equal(contracts.canonicalExecutiveIntakePackageCount, 1);
    assert.equal(
      contracts.canonicalExecutiveIntakePackageContracts.length,
      1,
    );
    assert.equal(
      contracts.canonicalExecutiveIntakePackageContracts[0]?.contractId,
      "NEA-7:1/Contract/ExecutiveIntakePackage",
    );
    assert.equal(
      contracts.contracts.filter(
        (item) => item.isCanonicalExecutiveIntakePackage,
      ).length,
      1,
    );
    assert.ok(
      contracts.contracts.every((item) => item.runtimeBehavior === "None"),
    );
    assert.ok(contracts.contracts.every((item) => item.metadataOnly === true));
  });

  it("declares ten reference groups, four attachment kinds, and three results", () => {
    const { references, attachments, results } =
      IntakeOrchestrationFoundationPlatform;

    assert.equal(references.referenceGroupCount, 10);
    assert.deepEqual(
      references.referenceGroups.map((item) => item.referenceGroupId),
      [...EXPECTED_REFERENCE_GROUPS],
    );
    assert.ok(
      references.referenceGroups.every(
        (item) => item.resolvesAtRuntime === false,
      ),
    );
    assert.ok(
      references.referenceGroups.every(
        (item) => item.duplicatesUpstreamContent === false,
      ),
    );
    assert.equal(references.resolvesAtRuntime, false);
    assert.equal(references.duplicatesUpstreamContent, false);

    assert.equal(attachments.attachmentKindCount, 4);
    assert.deepEqual(
      attachments.attachmentKinds.map((item) => item.attachmentKindId),
      [...EXPECTED_ATTACHMENT_KINDS],
    );
    assert.ok(
      attachments.attachmentKinds.every((item) => item.storesFiles === false),
    );
    assert.equal(attachments.storesFiles, false);

    assert.equal(results.resultCount, 3);
    assert.deepEqual(
      results.results.map((item) => item.resultId),
      [...EXPECTED_RESULTS],
    );
    assert.ok(
      results.results.every((item) => item.processesAtRuntime === false),
    );
    assert.equal(results.processesAtRuntime, false);
  });

  it("declares eight capabilities and six lifecycle states", () => {
    const { capabilities, lifecycle } = IntakeOrchestrationFoundationPlatform;
    assert.equal(capabilities.capabilityCount, 8);
    assert.deepEqual(
      capabilities.capabilities.map((item) => item.capabilityId),
      [...EXPECTED_CAPABILITIES],
    );
    assert.ok(
      capabilities.capabilities.every((item) => item.executesRuntime === false),
    );

    assert.deepEqual([...lifecycle.states], [...EXPECTED_LIFECYCLE]);
    assert.equal(lifecycle.stateCount, 6);
    assert.equal(lifecycle.initialState, "Collected");
    assert.equal(lifecycle.terminalState, "Published");
    assert.equal(lifecycle.executesRuntime, false);
    assert.equal(lifecycle.stateMachine, false);
  });

  it("declares ownership and forbidden boundaries without runtime behavior", () => {
    const { ownership, boundaries } = IntakeOrchestrationFoundationPlatform;
    assert.equal(ownership.ownsCount, 8);
    assert.equal(ownership.doesNotOwnCount, 30);
    assert.ok(ownership.owns.includes("Executive Intake Package Contract"));
    assert.ok(ownership.owns.includes("Intake Reference Contracts"));
    assert.ok(ownership.owns.includes("Intake Lifecycle"));
    assert.ok(ownership.doesNotOwn.includes("Connectors"));
    assert.ok(ownership.doesNotOwn.includes("DKL"));
    assert.ok(ownership.doesNotOwn.includes("Executive Engine"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Orchestration"));
    assert.equal(ownership.ownsRuntimeOrchestration, false);
    assert.equal(ownership.ownsDkl, false);
    assert.equal(ownership.ownsExecutiveEngine, false);
    assert.equal(ownership.ownsAi, false);

    assert.equal(boundaries.prohibitedSurfaceCount, 24);
    assert.ok(
      boundaries.prohibitedSurfaces.includes("Runtime Orchestration"),
    );
    assert.ok(boundaries.prohibitedSurfaces.includes("DKL invocation"));
    assert.ok(
      boundaries.prohibitedSurfaces.includes("Executive Engine invocation"),
    );
    assert.equal(boundaries.executesOrchestration, false);
    assert.equal(boundaries.executesRouting, false);
    assert.equal(boundaries.executesNormalization, false);
    assert.equal(boundaries.buildsBusinessObjects, false);
    assert.equal(boundaries.interpretsBusinessMeaning, false);
    assert.equal(boundaries.invokesDkl, false);
    assert.equal(boundaries.runtimeEnforcement, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = IntakeOrchestrationFoundationPlatform;
    const keys = Object.keys(platform);
    assert.deepEqual(keys.slice(0, 13), [...PLATFORM_SECTIONS]);
    assert.equal(platform.sectionCount, 13);
    assert.deepEqual([...platform.sectionOrder], [...PLATFORM_SECTIONS]);
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(platform.contracts), true);
    assert.equal(Object.isFrozen(platform.contracts.contracts), true);
    assert.equal(Object.isFrozen(platform.references), true);
    assert.equal(Object.isFrozen(platform.attachments), true);
    assert.equal(Object.isFrozen(platform.results), true);
    assert.equal(Object.isFrozen(platform.capabilities), true);
    assert.equal(Object.isFrozen(platform.lifecycle), true);
    assert.equal(Object.isFrozen(platform.ownership), true);
    assert.equal(Object.isFrozen(platform.boundaries), true);
    assert.equal(Object.isFrozen(platform.metadata), true);
    assert.equal(Object.isFrozen(platform.summary), true);
    assert.equal(Object.isFrozen(platform.readiness), true);
  });

  it("derives deterministic summary from canonical foundation collections", () => {
    const summaryA = getIntakeOrchestrationFoundationSummary();
    const summaryB = getIntakeOrchestrationFoundationSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.foundationId, IntakeOrchestrationFoundationId);
    assert.equal(summaryA.status, "Foundation");
    assert.equal(summaryA.readiness, "ReadyForRegistry");
    assert.equal(summaryA.publicIndexId, MessageNormalizationPublicIndexId);
    assert.equal(summaryA.contractCount, 20);
    assert.equal(summaryA.canonicalExecutiveIntakePackageCount, 1);
    assert.equal(summaryA.referenceGroupCount, 10);
    assert.equal(summaryA.attachmentKindCount, 4);
    assert.equal(summaryA.resultCount, 3);
    assert.equal(summaryA.capabilityCount, 8);
    assert.equal(summaryA.lifecycleStateCount, 6);
    assert.equal(summaryA.ownershipCount, 8);
    assert.equal(summaryA.nonOwnershipCount, 30);
    assert.equal(summaryA.prohibitedSurfaceCount, 24);
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 13);
    assert.equal(
      summaryA.nextPhase,
      "NEA-7:2 — Intake Orchestration Registry",
    );
    assert.equal(
      IntakeOrchestrationFoundationPlatform.metadata.countsHardcoded,
      false,
    );
    assert.equal(
      IntakeOrchestrationFoundationPlatform.metadata.architectureVersion,
      "NEA-7.0.0",
    );
  });

  it("declares ReadyForRegistry only and no forbidden runtime implementation", () => {
    assert.equal(
      IntakeOrchestrationFoundationPlatform.readiness.readiness,
      "ReadyForRegistry",
    );
    assert.equal(
      IntakeOrchestrationFoundationPlatform.readiness.claimsReadyForRegistry,
      true,
    );
    assert.equal(
      IntakeOrchestrationFoundationPlatform.readiness.claimsReadyForRuntime,
      false,
    );
    assert.equal(
      IntakeOrchestrationFoundationPlatform.readiness
        .claimsRuntimeOrchestrationImplemented,
      false,
    );
    assert.equal(
      IntakeOrchestrationFoundationPlatform.readiness.claimsDklInvoked,
      false,
    );
    assert.equal(IntakeOrchestrationFoundationPlatform.runtimeBehavior, false);
    assert.equal(
      IntakeOrchestrationFoundationPlatform.executesOrchestration,
      false,
    );
    assert.equal(IntakeOrchestrationFoundationPlatform.executesRouting, false);
    assert.equal(
      IntakeOrchestrationFoundationPlatform.executesNormalization,
      false,
    );
    assert.equal(
      IntakeOrchestrationFoundationPlatform.buildsBusinessObjects,
      false,
    );
    assert.equal(
      IntakeOrchestrationFoundationPlatform.interpretsBusinessMeaning,
      false,
    );
    assert.equal(IntakeOrchestrationFoundationPlatform.implementsHttp, false);
    assert.equal(IntakeOrchestrationFoundationPlatform.implementsRest, false);
    assert.equal(IntakeOrchestrationFoundationPlatform.aiReasoning, false);
    assert.equal(IntakeOrchestrationFoundationPlatform.invokesDkl, false);
    assert.equal(
      IntakeOrchestrationFoundationPlatform.invokesExecutiveEngine,
      false,
    );
  });
});
