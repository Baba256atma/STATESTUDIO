/**
 * DKL-8:2 — Knowledge Governance Registry Tests.
 *
 * Deterministic coverage for the immutable Knowledge Governance Registry.
 * No mocks. No randomness. No network. No databases. No source inspection.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  KnowledgeGovernanceFoundationId,
  KnowledgeGovernanceFoundationPlatform,
} from "./knowledgeGovernanceFoundation.ts";
import * as RegistryModule from "./knowledgeGovernanceRegistry.ts";
import {
  getKnowledgeGovernanceRegistrySummary,
  KnowledgeGovernanceRegistryId,
  KnowledgeGovernanceRegistryName,
  KnowledgeGovernanceRegistryNamespace,
  KnowledgeGovernanceRegistryPlatform,
  KnowledgeGovernanceRegistryReadiness,
  KnowledgeGovernanceRegistryStatus,
  KnowledgeGovernanceRegistryVersion,
} from "./knowledgeGovernanceRegistry.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL82_FILES = Object.freeze([
  "knowledgeGovernanceRegistryTypes.ts",
  "knowledgeGovernanceSubjectRegistry.ts",
  "knowledgeGovernanceRoleRegistry.ts",
  "knowledgeGovernancePolicyRegistry.ts",
  "knowledgeGovernanceLifecycleRegistry.ts",
  "knowledgeGovernanceRegistryCatalog.ts",
  "knowledgeGovernanceRegistry.ts",
  "knowledgeGovernanceRegistry.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "KnowledgeGovernanceRegistryId",
  "KnowledgeGovernanceRegistryVersion",
  "KnowledgeGovernanceRegistryName",
  "KnowledgeGovernanceRegistryNamespace",
  "KnowledgeGovernanceRegistryStatus",
  "KnowledgeGovernanceRegistryReadiness",
  "KnowledgeGovernanceRegistryPlatform",
  "getKnowledgeGovernanceRegistrySummary",
] as const);

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "subjects",
  "contracts",
  "roles",
  "capabilities",
  "classifications",
  "sensitivities",
  "accessIntents",
  "usagePolicies",
  "retentionIntents",
  "dispositionIntents",
  "auditIntents",
  "complianceIntents",
  "lifecycleStates",
  "lifecycleTransitions",
  "evidenceKinds",
  "exceptionCategories",
  "policyReferenceKinds",
  "decisionReferenceKinds",
  "ownership",
  "boundaries",
  "readiness",
] as const);

const assertUnique = (
  values: readonly (string | number)[],
  label: string,
): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

const assertFrozenCollection = (
  collection: readonly unknown[],
  label: string,
): void => {
  assert.equal(Object.isFrozen(collection), true, `${label} must be frozen`);
};

describe("DKL-8:2 Knowledge Governance Registry", () => {
  it("creates exactly eight Registry files and eight public exports", () => {
    assert.equal(DKL82_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of DKL82_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(RegistryModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(RegistryModule).length, 8);
  });

  it("has canonical identity, RegistryDefined status, and ReadyForModel", () => {
    assert.equal(
      KnowledgeGovernanceRegistryId,
      "DKL-8:2/KnowledgeGovernanceRegistry",
    );
    assert.equal(KnowledgeGovernanceRegistryVersion, "1.0.0");
    assert.equal(
      KnowledgeGovernanceRegistryName,
      "Knowledge Governance Registry",
    );
    assert.equal(
      KnowledgeGovernanceRegistryNamespace,
      "nexora.dkl.knowledge-governance.registry",
    );
    assert.equal(KnowledgeGovernanceRegistryStatus, "RegistryDefined");
    assert.equal(KnowledgeGovernanceRegistryReadiness, "ReadyForModel");
    assert.equal(
      KnowledgeGovernanceRegistryPlatform.nextPhase,
      "DKL-8:3 — Knowledge Governance Model",
    );
  });

  it("consumes only DKL-8:1 Foundation and not DKL-7 directly", () => {
    const dependency = KnowledgeGovernanceRegistryPlatform.dependency;
    assert.equal(
      dependency.directPreviousPhaseModule,
      "knowledgeGovernanceFoundation.ts",
    );
    assert.equal(dependency.foundationOnly, true);
    assert.equal(dependency.foundationId, KnowledgeGovernanceFoundationId);
    assert.equal(dependency.dkl7DirectImport, false);
    assert.equal(dependency.dkl6DirectImport, false);
    assert.equal(dependency.reconstructsFoundation, false);
    assert.equal(
      KnowledgeGovernanceRegistryPlatform.foundation,
      KnowledgeGovernanceFoundationPlatform,
    );
  });

  it("registers all foundation vocabularies with confirmed counts", () => {
    const platform = KnowledgeGovernanceRegistryPlatform;
    assert.equal(platform.subjects.length, 19);
    assert.equal(platform.contracts.length, 18);
    assert.equal(platform.roles.length, 8);
    assert.equal(platform.capabilities.length, 18);
    assert.equal(platform.classifications.length, 5);
    assert.equal(platform.sensitivities.length, 13);
    assert.equal(platform.accessIntents.length, 12);
    assert.equal(platform.usagePolicies.length, 1);
    assert.equal(platform.retentionIntents.length, 9);
    assert.equal(platform.dispositionIntents.length, 8);
    assert.equal(platform.auditIntents.length, 5);
    assert.equal(platform.complianceIntents.length, 4);
    assert.equal(platform.lifecycleStates.length, 11);
    assert.equal(platform.evidenceKinds.length, 12);
    assert.equal(platform.exceptionCategories.length, 8);
    assert.equal(platform.policyReferenceKinds.length, 1);
    assert.equal(platform.decisionReferenceKinds.length, 1);
    assert.ok(platform.lifecycleTransitions.length > 0);
  });

  it("preserves classification order and keeps sensitivity distinct", () => {
    const platform = KnowledgeGovernanceRegistryPlatform;
    assert.deepEqual(
      platform.classifications.map((item) => item.level),
      [
        "Public",
        "Internal",
        "Confidential",
        "Restricted",
        "HighlyRestricted",
      ],
    );
    assertUnique(
      platform.classifications.map((item) => item.ordinal),
      "classification ordinals",
    );
    for (const item of platform.classifications) {
      assert.equal(item.impliesPermissions, false);
    }
    for (const item of platform.sensitivities) {
      assert.equal(item.independentFromClassification, true);
      assert.equal(item.implementsPrivacyLaw, false);
    }
  });

  it("registers declarative access, retention, and disposition intents only", () => {
    const platform = KnowledgeGovernanceRegistryPlatform;
    for (const item of platform.accessIntents) {
      assert.equal(item.runtimeEnforcementStatus, "Unavailable");
      assert.equal(item.runtimeBehavior, "None");
    }
    for (const item of platform.retentionIntents) {
      assert.equal(item.schedulesDeletion, false);
    }
    for (const item of platform.dispositionIntents) {
      assert.equal(item.representsIntentOnly, true);
      assert.equal(item.executesDisposition, false);
    }
    for (const item of platform.auditIntents) {
      assert.equal(item.implementsLogging, false);
    }
    for (const item of platform.complianceIntents) {
      assert.equal(item.interpretsLaw, false);
      assert.equal(item.executesControls, false);
    }
  });

  it("registers ordered lifecycle states and declarative transitions", () => {
    const platform = KnowledgeGovernanceRegistryPlatform;
    assert.deepEqual(
      platform.lifecycleStates.map((item) => item.state),
      [
        "Declared",
        "Classified",
        "Assigned",
        "Reviewed",
        "Approved",
        "Active",
        "Restricted",
        "ExceptionGranted",
        "Superseded",
        "Archived",
        "Retired",
      ],
    );
    assertUnique(
      platform.lifecycleStates.map((item) => item.ordinal),
      "lifecycle ordinals",
    );
    assert.equal(platform.lifecycleStates[0]!.isInitial, true);
    assert.equal(platform.lifecycleStates[10]!.isTerminal, true);
    for (const item of platform.lifecycleTransitions) {
      assert.equal(item.executable, false);
    }
    assert.equal(platform.lifecycle.runtimeStateMachine, false);
  });

  it("registers roles, capabilities, exceptions, and boundaries without runtime", () => {
    const platform = KnowledgeGovernanceRegistryPlatform;
    for (const role of platform.roles) {
      assert.equal(role.assignmentStatus, "Unassigned");
      assert.equal(role.assignsUsers, false);
      assert.equal(role.assignsOrganizations, false);
    }
    for (const capability of platform.capabilities) {
      assert.equal(capability.declarativeOnly, true);
      assert.equal(capability.enforcesPolicy, false);
      assert.equal(capability.authorizesUsers, false);
    }
    assert.ok(
      !platform.capabilities.some((item) =>
        /Enforce|Authorize|Block|Delete|Execute|Approve|Run|Write|Authenticate/i.test(
          item.capabilityKey,
        ),
      ),
    );
    for (const item of platform.exceptionCategories) {
      assert.equal(item.grantsAutomatically, false);
      assert.equal(item.implementsWorkflow, false);
    }
    assert.equal(platform.boundaries.runtimeEnforcement, false);
    assert.equal(platform.runtimeEnforcement, false);
    assert.equal(platform.policyExecution, false);
    assert.equal(platform.engineReasoning, false);
    assert.equal(platform.uiBehavior, false);
  });

  it("enforces unique IDs and immutable collections", () => {
    const platform = KnowledgeGovernanceRegistryPlatform;
    const collections = [
      platform.subjects,
      platform.contracts,
      platform.roles,
      platform.capabilities,
      platform.classifications,
      platform.sensitivities,
      platform.accessIntents,
      platform.retentionIntents,
      platform.dispositionIntents,
      platform.auditIntents,
      platform.complianceIntents,
      platform.lifecycleStates,
      platform.lifecycleTransitions,
      platform.evidenceKinds,
      platform.exceptionCategories,
    ] as const;

    for (const collection of collections) {
      assertUnique(
        collection.map((item) => item.id),
        "registry IDs",
      );
      assertUnique(
        collection.map((item) => item.name),
        "registry names",
      );
      assertFrozenCollection(collection, "registry collection");
    }

    assert.equal(Object.isFrozen(platform), true);
    assert.deepEqual(
      Object.keys(platform).slice(0, 23),
      [...PLATFORM_SECTIONS],
    );
  });

  it("publishes an additive immutable eight-entry apiRegistry", () => {
    const platform = KnowledgeGovernanceRegistryPlatform;
    assert.equal(platform.apiRegistry.length, 8);
    assert.equal(Object.isFrozen(platform.apiRegistry), true);
    assert.deepEqual(
      platform.apiRegistry.map((item) => item.exportName),
      [...REQUIRED_PUBLIC_EXPORTS],
    );
    assert.equal(
      new Set(platform.apiRegistry.map((item) => item.id)).size,
      8,
    );
    assert.equal(platform.sectionCount, PLATFORM_SECTIONS.length);
    assert.equal(
      platform.foundation.apiRegistry,
      KnowledgeGovernanceFoundationPlatform.apiRegistry,
    );
  });

  it("provides deterministic lookups, summary, and Model readiness", () => {
    const platform = KnowledgeGovernanceRegistryPlatform;
    const lookups = platform.lookups;

    const subject = lookups.getKnowledgeGovernanceSubjectById(
      "DKL-8:2/Subject/KnowledgeObject",
    );
    assert.ok(subject);
    assert.equal(subject, platform.subjects[0]);

    const role = lookups.getKnowledgeGovernanceRoleById("DKL-8:2/Role/Owner");
    assert.ok(role);
    assert.equal(role, platform.roles[0]);

    assert.equal(
      lookups.getKnowledgeGovernanceSubjectById("DKL-8:2/Subject/Missing"),
      undefined,
    );
    assert.equal(
      lookups.getKnowledgeClassificationById("DKL-8:2/Classification/Public"),
      platform.classifications[0],
    );
    assert.equal(
      lookups.getKnowledgeGovernanceLifecycleStateById(
        "DKL-8:2/LifecycleState/Declared",
      ),
      platform.lifecycleStates[0],
    );

    const summaryA = getKnowledgeGovernanceRegistrySummary();
    const summaryB = getKnowledgeGovernanceRegistrySummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.subjectCount, 19);
    assert.equal(summaryA.contractCount, 18);
    assert.equal(summaryA.roleCount, 8);
    assert.equal(summaryA.capabilityCount, 18);
    assert.equal(summaryA.classificationCount, 5);
    assert.equal(summaryA.sensitivityCount, 13);
    assert.equal(summaryA.accessIntentCount, 12);
    assert.equal(summaryA.retentionCount, 9);
    assert.equal(summaryA.dispositionCount, 8);
    assert.equal(summaryA.auditIntentCount, 5);
    assert.equal(summaryA.complianceIntentCount, 4);
    assert.equal(summaryA.lifecycleStateCount, 11);
    assert.equal(summaryA.evidenceKindCount, 12);
    assert.equal(summaryA.exceptionCategoryCount, 8);
    assert.equal(summaryA.status, "RegistryDefined");
    assert.equal(summaryA.readiness, "ReadyForModel");
    assert.equal(
      lookups.getKnowledgeGovernanceRegistryEntryCount(),
      summaryA.totalEntryCount,
    );
    assert.equal(summaryA.totalEntryCount, platform.totalEntryCount);
  });
});
