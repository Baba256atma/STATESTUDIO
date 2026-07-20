/**
 * NEA-7:2 — Intake Orchestration Registry Tests.
 *
 * Deterministic coverage for the immutable Intake Orchestration Registry.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  IntakeOrchestrationFoundationId,
  IntakeOrchestrationFoundationPlatform,
} from "./intakeOrchestrationFoundation.ts";
import * as RegistryModule from "./intakeOrchestrationRegistry.ts";
import {
  IntakeOrchestrationRegistryId,
  IntakeOrchestrationRegistryName,
  IntakeOrchestrationRegistryNamespace,
  IntakeOrchestrationRegistryPlatform,
  IntakeOrchestrationRegistryReadiness,
  IntakeOrchestrationRegistryStatus,
  IntakeOrchestrationRegistryVersion,
  getIntakeOrchestrationRegistrySummary,
} from "./intakeOrchestrationRegistry.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA72_FILES = Object.freeze([
  "intakeOrchestrationRegistryTypes.ts",
  "intakeOrchestrationRegistryCollections.ts",
  "intakeOrchestrationRegistryPolicies.ts",
  "intakeOrchestrationRegistryCapabilities.ts",
  "intakeOrchestrationRegistryOwnership.ts",
  "intakeOrchestrationRegistryMetadata.ts",
  "intakeOrchestrationRegistry.ts",
  "intakeOrchestrationRegistry.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntakeOrchestrationRegistryId",
  "IntakeOrchestrationRegistryVersion",
  "IntakeOrchestrationRegistryName",
  "IntakeOrchestrationRegistryNamespace",
  "IntakeOrchestrationRegistryStatus",
  "IntakeOrchestrationRegistryReadiness",
  "IntakeOrchestrationRegistryPlatform",
  "getIntakeOrchestrationRegistrySummary",
] as const);

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "collections",
  "capabilities",
  "policies",
  "metadata",
  "ownership",
  "boundaries",
  "readiness",
] as const);

const EXPECTED_IDENTITIES = Object.freeze([
  "ExecutiveRequest",
  "ExecutiveCommand",
  "ExecutiveQuestion",
  "ExecutiveReport",
  "ExecutiveNotification",
  "ExecutiveEvent",
  "ExecutiveWorkflow",
  "ExecutiveSystem",
] as const);

const EXPECTED_CATEGORIES = Object.freeze([
  "Request",
  "Command",
  "Question",
  "Report",
  "Notification",
  "Event",
  "Workflow",
  "System",
] as const);

const EXPECTED_PRIORITIES = Object.freeze([
  "Critical",
  "High",
  "Normal",
  "Low",
  "Deferred",
] as const);

const EXPECTED_STATUSES = Object.freeze([
  "Registered",
  "Pending",
  "Ready",
  "Verified",
  "Published",
  "Archived",
] as const);

const EXPECTED_REFERENCE_TYPES = Object.freeze([
  "Message",
  "Session",
  "Conversation",
  "Authentication",
  "Routing",
  "Connector",
  "Workspace",
  "Tenant",
  "Correlation",
  "Trace",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-7:2 Intake Orchestration Registry", () => {
  it("creates exactly eight Registry files and eight public exports", () => {
    assert.equal(NEA72_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA72_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(RegistryModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(RegistryModule).length, 8);
  });

  it("has canonical registry identity, status Registry, and ReadyForModel", () => {
    assert.equal(
      IntakeOrchestrationRegistryId,
      "NEA-7:2/IntakeOrchestrationRegistry",
    );
    assert.equal(IntakeOrchestrationRegistryVersion, "1.0.0");
    assert.equal(
      IntakeOrchestrationRegistryName,
      "Intake Orchestration Registry",
    );
    assert.equal(
      IntakeOrchestrationRegistryNamespace,
      "nexora.nea.intake-orchestration.registry",
    );
    assert.equal(IntakeOrchestrationRegistryStatus, "Registry");
    assert.equal(IntakeOrchestrationRegistryReadiness, "ReadyForModel");
    assert.equal(IntakeOrchestrationRegistryPlatform.identity.phase, "NEA-7:2");
    assert.equal(IntakeOrchestrationRegistryPlatform.identity.layer, "NEA");
    assert.equal(
      IntakeOrchestrationRegistryPlatform.identity.foundationId,
      IntakeOrchestrationFoundationId,
    );
    assert.equal(
      IntakeOrchestrationRegistryPlatform.nextPhase,
      "NEA-7:3 — Intake Orchestration Model",
    );
  });

  it("consumes only Foundation and preserves canonical references", () => {
    const dependency = IntakeOrchestrationRegistryPlatform.dependency;
    assert.equal(dependency.foundationOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "intakeOrchestrationFoundation.ts",
    );
    assert.equal(dependency.foundationId, IntakeOrchestrationFoundationId);
    assert.equal(dependency.publicIndexDirectImport, false);
    assert.equal(dependency.reconstructsFoundation, false);
    assert.equal(dependency.duplicatesFoundationValues, false);
    assert.equal(
      IntakeOrchestrationRegistryPlatform.foundationPlatform,
      IntakeOrchestrationFoundationPlatform,
    );

    const { collections, capabilities } = IntakeOrchestrationRegistryPlatform;
    assert.equal(collections.contractCount, 20);
    assert.equal(capabilities.capabilityCount, 8);
    assert.equal(collections.lifecycleEntryCount, 6);
    assert.ok(
      collections.contracts.every(
        (item) =>
          item.sourcePhase === "NEA-7:1" && item.foundationReference !== null,
      ),
    );
    assert.ok(
      collections.lifecycleEntries.every(
        (item) =>
          item.sourcePhase === "NEA-7:1" && item.foundationReference !== null,
      ),
    );
    assert.ok(
      capabilities.capabilities.every(
        (item) =>
          item.sourcePhase === "NEA-7:1" && item.foundationReference !== null,
      ),
    );
    assert.equal(
      collections.contractCount,
      IntakeOrchestrationFoundationPlatform.contracts.contractCount,
    );
    assert.equal(
      capabilities.capabilityCount,
      IntakeOrchestrationFoundationPlatform.capabilities.capabilityCount,
    );
    assert.equal(
      collections.lifecycleEntryCount,
      IntakeOrchestrationFoundationPlatform.lifecycle.stateCount,
    );
    assert.equal(
      IntakeOrchestrationRegistryPlatform.foundationPlatform.ownership,
      IntakeOrchestrationFoundationPlatform.ownership,
    );
    assert.equal(
      IntakeOrchestrationRegistryPlatform.foundationPlatform.boundaries,
      IntakeOrchestrationFoundationPlatform.boundaries,
    );
  });

  it("declares eight intake identities with required fields and no runtime assembly", () => {
    const { collections } = IntakeOrchestrationRegistryPlatform;
    assert.equal(collections.intakeIdentityCount, 8);
    assert.deepEqual(
      collections.intakeIdentities.map((item) => item.intakeId.split("/").at(-1)),
      [...EXPECTED_IDENTITIES],
    );
    assertUnique(
      collections.intakeIdentities.map((item) => item.intakeId),
      "intake ids",
    );
    assert.ok(
      collections.intakeIdentities.every(
        (item) => item.assemblesRuntimePackage === false,
      ),
    );
    assert.ok(
      collections.intakeIdentities.every((item) => item.executesRuntime === false),
    );
    assert.ok(
      collections.intakeIdentities.every((item) => item.version === "1.0.0"),
    );
    assert.ok(collections.intakeIdentities.every((item) => item.category));
    assert.ok(collections.intakeIdentities.every((item) => item.status));
    assert.ok(collections.intakeIdentities.every((item) => item.priority));
  });

  it("declares registry-owned vocabularies without Foundation duplication", () => {
    const { collections } = IntakeOrchestrationRegistryPlatform;
    assert.equal(collections.categoryCount, 8);
    assert.deepEqual(
      collections.categories.map((item) => item.id),
      [...EXPECTED_CATEGORIES],
    );
    assert.equal(collections.priorityCount, 5);
    assert.deepEqual(
      collections.priorities.map((item) => item.id),
      [...EXPECTED_PRIORITIES],
    );
    assert.equal(collections.statusCount, 6);
    assert.deepEqual(
      collections.statuses.map((item) => item.id),
      [...EXPECTED_STATUSES],
    );
    assert.equal(collections.referenceTypeCount, 10);
    assert.deepEqual(
      collections.referenceTypes.map((item) => item.id),
      [...EXPECTED_REFERENCE_TYPES],
    );
    assert.equal(collections.metadataFieldCount, 10);
    assert.ok(
      collections.categories.every(
        (item) =>
          item.sourcePhase === "NEA-7:2" && item.foundationReference === null,
      ),
    );
    assert.ok(
      collections.referenceTypes.every(
        (item) =>
          item.sourcePhase === "NEA-7:2" && item.foundationReference === null,
      ),
    );
    assert.ok(
      collections.metadataFields.every(
        (item) =>
          item.sourcePhase === "NEA-7:2" && item.foundationReference === null,
      ),
    );
  });

  it("declares ownership, policies, and forbidden boundaries without runtime behavior", () => {
    const { ownership, boundaries, policies } =
      IntakeOrchestrationRegistryPlatform;
    assert.ok(ownership.owns.includes("Intake Identity Registry"));
    assert.ok(ownership.owns.includes("Category Registry"));
    assert.ok(ownership.owns.includes("Reference Type Registry"));
    assert.ok(ownership.owns.includes("Registry Policies"));
    assert.ok(ownership.doesNotOwn.includes("Foundation Contracts"));
    assert.ok(ownership.doesNotOwn.includes("DKL"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Orchestration"));
    assert.equal(ownership.ownsFoundationContracts, false);
    assert.equal(ownership.ownsRuntimeOrchestration, false);
    assert.equal(ownership.ownsDkl, false);

    assert.equal(policies.policyCount, 8);
    assert.equal(policies.executesPolicies, false);

    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime Orchestration"));
    assert.ok(boundaries.prohibitedSurfaces.includes("DKL invocation"));
    assert.equal(boundaries.executesOrchestration, false);
    assert.equal(boundaries.assemblesRuntimePackage, false);
    assert.equal(boundaries.invokesDkl, false);
    assert.equal(boundaries.duplicatesFoundationValues, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = IntakeOrchestrationRegistryPlatform;
    const keys = Object.keys(platform);
    assert.deepEqual(keys.slice(0, 9), [...PLATFORM_SECTIONS]);
    assert.equal(platform.sectionCount, 9);
    assert.deepEqual([...platform.sectionOrder], [...PLATFORM_SECTIONS]);
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(platform.collections), true);
    assert.equal(Object.isFrozen(platform.collections.intakeIdentities), true);
    assert.equal(Object.isFrozen(platform.capabilities), true);
    assert.equal(Object.isFrozen(platform.policies), true);
    assert.equal(Object.isFrozen(platform.metadata), true);
    assert.equal(Object.isFrozen(platform.ownership), true);
    assert.equal(Object.isFrozen(platform.boundaries), true);
    assert.equal(Object.isFrozen(platform.readiness), true);
  });

  it("derives deterministic summary with total registry entry count of 89", () => {
    const summaryA = getIntakeOrchestrationRegistrySummary();
    const summaryB = getIntakeOrchestrationRegistrySummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.registryId, IntakeOrchestrationRegistryId);
    assert.equal(summaryA.status, "Registry");
    assert.equal(summaryA.readiness, "ReadyForModel");
    assert.equal(summaryA.foundationId, IntakeOrchestrationFoundationId);
    assert.equal(summaryA.intakeIdentityCount, 8);
    assert.equal(summaryA.categoryCount, 8);
    assert.equal(summaryA.priorityCount, 5);
    assert.equal(summaryA.statusCount, 6);
    assert.equal(summaryA.referenceTypeCount, 10);
    assert.equal(summaryA.metadataFieldCount, 10);
    assert.equal(summaryA.registryPolicyCount, 8);
    assert.equal(summaryA.contractCount, 20);
    assert.equal(summaryA.capabilityCount, 8);
    assert.equal(summaryA.lifecycleEntryCount, 6);
    assert.equal(summaryA.totalRegistryEntryCount, 89);
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 9);
    assert.equal(
      summaryA.nextPhase,
      "NEA-7:3 — Intake Orchestration Model",
    );
    assert.equal(
      IntakeOrchestrationRegistryPlatform.metadata.countsHardcoded,
      false,
    );
    assert.equal(
      IntakeOrchestrationRegistryPlatform.metadata.inheritedEntryCount,
      34,
    );
    assert.equal(
      IntakeOrchestrationRegistryPlatform.metadata.createdEntryCount,
      55,
    );
  });

  it("declares ReadyForModel only and no forbidden runtime implementation", () => {
    assert.equal(
      IntakeOrchestrationRegistryPlatform.readiness.readiness,
      "ReadyForModel",
    );
    assert.equal(
      IntakeOrchestrationRegistryPlatform.readiness.claimsReadyForModel,
      true,
    );
    assert.equal(
      IntakeOrchestrationRegistryPlatform.readiness.claimsReadyForRuntime,
      false,
    );
    assert.equal(
      IntakeOrchestrationRegistryPlatform.readiness
        .claimsRuntimeOrchestrationImplemented,
      false,
    );
    assert.equal(
      IntakeOrchestrationRegistryPlatform.readiness
        .claimsRuntimeAssemblyImplemented,
      false,
    );
    assert.equal(IntakeOrchestrationRegistryPlatform.runtimeBehavior, false);
    assert.equal(
      IntakeOrchestrationRegistryPlatform.executesOrchestration,
      false,
    );
    assert.equal(
      IntakeOrchestrationRegistryPlatform.assemblesRuntimePackage,
      false,
    );
    assert.equal(IntakeOrchestrationRegistryPlatform.invokesDkl, false);
    assert.equal(IntakeOrchestrationRegistryPlatform.aiReasoning, false);
  });
});
