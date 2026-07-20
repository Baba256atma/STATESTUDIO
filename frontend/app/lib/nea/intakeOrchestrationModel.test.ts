/**
 * NEA-7:3 — Intake Orchestration Model Tests.
 *
 * Deterministic coverage for the immutable Intake Orchestration Model.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  IntakeOrchestrationRegistryId,
  IntakeOrchestrationRegistryPlatform,
} from "./intakeOrchestrationRegistry.ts";
import * as ModelModule from "./intakeOrchestrationModel.ts";
import {
  IntakeOrchestrationModelId,
  IntakeOrchestrationModelName,
  IntakeOrchestrationModelNamespace,
  IntakeOrchestrationModelPlatform,
  IntakeOrchestrationModelReadiness,
  IntakeOrchestrationModelStatus,
  IntakeOrchestrationModelVersion,
  getIntakeOrchestrationModelSummary,
} from "./intakeOrchestrationModel.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA73_FILES = Object.freeze([
  "intakeOrchestrationModelTypes.ts",
  "intakeOrchestrationModels.ts",
  "intakeOrchestrationRelationships.ts",
  "intakeOrchestrationModelMetadata.ts",
  "intakeOrchestrationModelOwnership.ts",
  "intakeOrchestrationModelLifecycle.ts",
  "intakeOrchestrationModel.ts",
  "intakeOrchestrationModel.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntakeOrchestrationModelId",
  "IntakeOrchestrationModelVersion",
  "IntakeOrchestrationModelName",
  "IntakeOrchestrationModelNamespace",
  "IntakeOrchestrationModelStatus",
  "IntakeOrchestrationModelReadiness",
  "IntakeOrchestrationModelPlatform",
  "getIntakeOrchestrationModelSummary",
] as const);

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "domainModels",
  "relationships",
  "lifecycle",
  "metadata",
  "ownership",
  "boundaries",
  "readiness",
] as const);

const EXPECTED_MODEL_KINDS = Object.freeze([
  "ExecutiveIntakePackage",
  "IntakeIdentity",
  "IntakeSource",
  "IntakeContext",
  "IntakeMetadata",
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
  "AttachmentReference",
  "IntakeConfiguration",
  "IntakeDiagnostics",
  "IntakeResult",
  "IntakeSummary",
] as const);

const EXPECTED_IDENTITY_KEYS = Object.freeze([
  "ExecutiveRequest",
  "ExecutiveCommand",
  "ExecutiveQuestion",
  "ExecutiveReport",
  "ExecutiveNotification",
  "ExecutiveEvent",
  "ExecutiveWorkflow",
  "ExecutiveSystem",
] as const);

const EXPECTED_RELATIONSHIPS = Object.freeze([
  "ExecutiveIntakePackage-IntakeIdentity",
  "ExecutiveIntakePackage-IntakeSource",
  "ExecutiveIntakePackage-IntakeContext",
  "ExecutiveIntakePackage-MessageReference",
  "ExecutiveIntakePackage-SessionReference",
  "ExecutiveIntakePackage-ConversationReference",
  "ExecutiveIntakePackage-AuthenticationReference",
  "ExecutiveIntakePackage-RoutingReference",
  "ExecutiveIntakePackage-ConnectorReference",
  "ExecutiveIntakePackage-WorkspaceReference",
  "ExecutiveIntakePackage-TenantReference",
  "ExecutiveIntakePackage-CorrelationReference",
  "ExecutiveIntakePackage-TraceReference",
  "ExecutiveIntakePackage-AttachmentReference",
  "ExecutiveIntakePackage-IntakeMetadata",
  "ExecutiveIntakePackage-IntakeConfiguration",
  "ExecutiveIntakePackage-IntakeDiagnostics",
  "ExecutiveIntakePackage-IntakeResult",
  "IntakeSummary-ExecutiveIntakePackage",
  "IntakeSummary-IntakeResult",
] as const);

const EXPECTED_LIFECYCLE = Object.freeze([
  "Declared",
  "Composed",
  "Verified",
  "Published",
  "Referenced",
  "Retired",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-7:3 Intake Orchestration Model", () => {
  it("creates exactly eight Model files and eight public exports", () => {
    assert.equal(NEA73_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA73_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(ModelModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(ModelModule).length, 8);
  });

  it("has canonical model identity, status Model, and ReadyForValidation", () => {
    assert.equal(IntakeOrchestrationModelId, "NEA-7:3/IntakeOrchestrationModel");
    assert.equal(IntakeOrchestrationModelVersion, "1.0.0");
    assert.equal(IntakeOrchestrationModelName, "Intake Orchestration Model");
    assert.equal(
      IntakeOrchestrationModelNamespace,
      "nexora.nea.intake-orchestration.model",
    );
    assert.equal(IntakeOrchestrationModelStatus, "Model");
    assert.equal(IntakeOrchestrationModelReadiness, "ReadyForValidation");
    assert.equal(IntakeOrchestrationModelPlatform.identity.phase, "NEA-7:3");
    assert.equal(IntakeOrchestrationModelPlatform.identity.layer, "NEA");
    assert.equal(
      IntakeOrchestrationModelPlatform.identity.registryId,
      IntakeOrchestrationRegistryId,
    );
    assert.equal(
      IntakeOrchestrationModelPlatform.nextPhase,
      "NEA-7:4 — Intake Orchestration Validation",
    );
  });

  it("consumes only Registry and preserves canonical references", () => {
    const dependency = IntakeOrchestrationModelPlatform.dependency;
    assert.equal(dependency.registryOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "intakeOrchestrationRegistry.ts",
    );
    assert.equal(dependency.registryId, IntakeOrchestrationRegistryId);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.reconstructsRegistry, false);
    assert.equal(dependency.duplicatesRegistryValues, false);
    assert.equal(
      IntakeOrchestrationModelPlatform.registryPlatform,
      IntakeOrchestrationRegistryPlatform,
    );

    const anchors =
      IntakeOrchestrationModelPlatform.domainModels.registryAnchors;
    assert.equal(
      anchors.intakeIdentityCount,
      IntakeOrchestrationRegistryPlatform.collections.intakeIdentityCount,
    );
    assert.equal(
      anchors.contractCount,
      IntakeOrchestrationRegistryPlatform.collections.contractCount,
    );
    assert.equal(
      anchors.capabilityCount,
      IntakeOrchestrationRegistryPlatform.capabilities.capabilityCount,
    );
    assert.equal(anchors.duplicatesRegistryValues, false);
    assert.equal(anchors.preservesCanonicalReferences, true);
  });

  it("declares twenty domain model kinds without runtime execution", () => {
    const { domainModels } = IntakeOrchestrationModelPlatform;
    assert.equal(domainModels.modelCount, 20);
    assert.deepEqual(
      domainModels.models.map((item) => item.modelKind),
      [...EXPECTED_MODEL_KINDS],
    );
    assertUnique(
      domainModels.models.map((item) => item.modelKind),
      "model kinds",
    );
    assert.ok(
      domainModels.models.every((item) => item.executesRuntime === false),
    );
    assert.ok(
      domainModels.models.some(
        (item) => item.modelKind === "ExecutiveIntakePackage",
      ),
    );
  });

  it("projects eight intake identity model instances from Registry", () => {
    const { domainModels } = IntakeOrchestrationModelPlatform;
    assert.equal(domainModels.intakeIdentityModelCount, 8);
    assert.deepEqual(
      domainModels.intakeIdentityModels.map((item) =>
        item.intakeId.split("/").at(-1),
      ),
      [...EXPECTED_IDENTITY_KEYS],
    );
    assertUnique(
      domainModels.intakeIdentityModels.map((item) => item.intakeId),
      "intake identity model ids",
    );
    assert.ok(
      domainModels.intakeIdentityModels.every(
        (item) => item.registryIdentityRef === item.intakeId,
      ),
    );
    assert.ok(
      domainModels.intakeIdentityModels.every(
        (item) => item.assemblesRuntimePackage === false,
      ),
    );
    assert.ok(
      domainModels.intakeIdentityModels.every(
        (item) => item.executesRuntime === false,
      ),
    );
    assert.ok(
      domainModels.intakeIdentityModels.every((item) => item.version === "1.0.0"),
    );
    assert.ok(
      domainModels.intakeIdentityModels.every((item) => Boolean(item.category)),
    );
    assert.ok(
      domainModels.intakeIdentityModels.every((item) => Boolean(item.priority)),
    );
    assert.ok(
      domainModels.intakeIdentityModels.every((item) => Boolean(item.status)),
    );
    assert.equal(
      domainModels.intakeIdentityModelCount,
      IntakeOrchestrationRegistryPlatform.collections.intakeIdentityCount,
    );
  });

  it("declares twenty relationships and Published lifecycle", () => {
    const { relationships, lifecycle } = IntakeOrchestrationModelPlatform;
    assert.equal(relationships.relationshipCount, 20);
    assert.deepEqual(
      relationships.relationships.map((item) =>
        item.relationshipId.split("/").at(-1),
      ),
      [...EXPECTED_RELATIONSHIPS],
    );
    assertUnique(
      relationships.relationships.map((item) => item.relationshipId),
      "relationship ids",
    );
    assert.equal(relationships.executesRuntime, false);

    assert.deepEqual([...lifecycle.states], [...EXPECTED_LIFECYCLE]);
    assert.equal(lifecycle.stateCount, 6);
    assert.equal(lifecycle.currentState, "Published");
    assert.equal(lifecycle.executesTransitions, false);
    assert.equal(lifecycle.runtimeStateMachine, false);
  });

  it("declares ownership and forbidden boundaries without runtime behavior", () => {
    const { ownership, boundaries } = IntakeOrchestrationModelPlatform;
    assert.equal(ownership.ownsCount, 8);
    assert.equal(ownership.doesNotOwnCount, 22);
    assert.ok(ownership.owns.includes("Domain Models"));
    assert.ok(ownership.owns.includes("Model Relationships"));
    assert.ok(ownership.owns.includes("Model Lifecycle"));
    assert.ok(ownership.owns.includes("Model Metadata"));
    assert.ok(ownership.doesNotOwn.includes("Registry Collections"));
    assert.ok(ownership.doesNotOwn.includes("DKL"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Orchestration"));
    assert.equal(ownership.ownsRegistryCollections, false);
    assert.equal(ownership.ownsDkl, false);
    assert.equal(ownership.ownsRuntimeOrchestration, false);

    assert.equal(boundaries.prohibitedSurfaceCount, 24);
    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime Orchestration"));
    assert.ok(boundaries.prohibitedSurfaces.includes("DKL invocation"));
    assert.equal(boundaries.executesOrchestration, false);
    assert.equal(boundaries.assemblesRuntimePackage, false);
    assert.equal(boundaries.invokesDkl, false);
    assert.equal(boundaries.duplicatesRegistryValues, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = IntakeOrchestrationModelPlatform;
    const keys = Object.keys(platform);
    assert.deepEqual(keys.slice(0, 9), [...PLATFORM_SECTIONS]);
    assert.equal(platform.sectionCount, 9);
    assert.deepEqual([...platform.sectionOrder], [...PLATFORM_SECTIONS]);
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(platform.domainModels), true);
    assert.equal(Object.isFrozen(platform.domainModels.models), true);
    assert.equal(Object.isFrozen(platform.relationships), true);
    assert.equal(Object.isFrozen(platform.lifecycle), true);
    assert.equal(Object.isFrozen(platform.metadata), true);
    assert.equal(Object.isFrozen(platform.ownership), true);
    assert.equal(Object.isFrozen(platform.boundaries), true);
    assert.equal(Object.isFrozen(platform.readiness), true);
  });

  it("derives deterministic summary from canonical model collections", () => {
    const summaryA = getIntakeOrchestrationModelSummary();
    const summaryB = getIntakeOrchestrationModelSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.modelId, IntakeOrchestrationModelId);
    assert.equal(summaryA.status, "Model");
    assert.equal(summaryA.readiness, "ReadyForValidation");
    assert.equal(summaryA.registryId, IntakeOrchestrationRegistryId);
    assert.equal(summaryA.domainModelCount, 20);
    assert.equal(summaryA.intakeIdentityModelCount, 8);
    assert.equal(summaryA.relationshipCount, 20);
    assert.equal(summaryA.lifecycleStateCount, 6);
    assert.equal(summaryA.ownershipCount, 8);
    assert.equal(summaryA.nonOwnershipCount, 22);
    assert.equal(summaryA.prohibitedSurfaceCount, 24);
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 9);
    assert.equal(
      summaryA.nextPhase,
      "NEA-7:4 — Intake Orchestration Validation",
    );
    assert.equal(
      IntakeOrchestrationModelPlatform.metadata.countsHardcoded,
      false,
    );
  });

  it("declares ReadyForValidation only and no forbidden runtime implementation", () => {
    assert.equal(
      IntakeOrchestrationModelPlatform.readiness.readiness,
      "ReadyForValidation",
    );
    assert.equal(
      IntakeOrchestrationModelPlatform.readiness.claimsReadyForValidation,
      true,
    );
    assert.equal(
      IntakeOrchestrationModelPlatform.readiness.claimsReadyForRuntime,
      false,
    );
    assert.equal(
      IntakeOrchestrationModelPlatform.readiness
        .claimsRuntimeOrchestrationImplemented,
      false,
    );
    assert.equal(
      IntakeOrchestrationModelPlatform.readiness
        .claimsRuntimeAssemblyImplemented,
      false,
    );
    assert.equal(IntakeOrchestrationModelPlatform.runtimeBehavior, false);
    assert.equal(IntakeOrchestrationModelPlatform.executesOrchestration, false);
    assert.equal(
      IntakeOrchestrationModelPlatform.assemblesRuntimePackage,
      false,
    );
    assert.equal(IntakeOrchestrationModelPlatform.invokesDkl, false);
    assert.equal(IntakeOrchestrationModelPlatform.aiReasoning, false);
    assert.equal(IntakeOrchestrationModelPlatform.implementsHttp, false);
  });
});
