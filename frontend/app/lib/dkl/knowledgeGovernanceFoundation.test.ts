/**
 * DKL-8:1 — Knowledge Governance Foundation Tests.
 *
 * Deterministic coverage for the immutable Knowledge Governance Foundation.
 * No mocks. No randomness. No network. No databases. No source inspection.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import * as FoundationModule from "./knowledgeGovernanceFoundation.ts";
import {
  getKnowledgeGovernanceFoundationSummary,
  KnowledgeGovernanceFoundationId,
  KnowledgeGovernanceFoundationName,
  KnowledgeGovernanceFoundationNamespace,
  KnowledgeGovernanceFoundationPlatform,
  KnowledgeGovernanceFoundationReadiness,
  KnowledgeGovernanceFoundationStatus,
  KnowledgeGovernanceFoundationVersion,
} from "./knowledgeGovernanceFoundation.ts";
import { KnowledgeServicesPublicIndexId } from "./knowledgeServicesPublicIndex.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL81_FILES = Object.freeze([
  "knowledgeGovernanceFoundationTypes.ts",
  "knowledgeGovernanceContracts.ts",
  "knowledgeGovernanceOwnership.ts",
  "knowledgeGovernanceClassification.ts",
  "knowledgeGovernanceLifecycle.ts",
  "knowledgeGovernanceBoundaries.ts",
  "knowledgeGovernanceFoundation.ts",
  "knowledgeGovernanceFoundation.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "KnowledgeGovernanceFoundationId",
  "KnowledgeGovernanceFoundationVersion",
  "KnowledgeGovernanceFoundationName",
  "KnowledgeGovernanceFoundationNamespace",
  "KnowledgeGovernanceFoundationStatus",
  "KnowledgeGovernanceFoundationReadiness",
  "KnowledgeGovernanceFoundationPlatform",
  "getKnowledgeGovernanceFoundationSummary",
] as const);

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "contracts",
  "subjects",
  "roles",
  "classification",
  "sensitivity",
  "accessIntent",
  "retention",
  "disposition",
  "audit",
  "compliance",
  "lifecycle",
  "evidence",
  "exceptions",
  "boundaries",
  "readiness",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("DKL-8:1 Knowledge Governance Foundation", () => {
  it("creates exactly eight Foundation files and eight public exports", () => {
    assert.equal(DKL81_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of DKL81_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(FoundationModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(FoundationModule).length, 8);
  });

  it("has canonical identity, FoundationDefined status, and ReadyForRegistry", () => {
    assert.equal(
      KnowledgeGovernanceFoundationId,
      "DKL-8:1/KnowledgeGovernanceFoundation",
    );
    assert.equal(KnowledgeGovernanceFoundationVersion, "1.0.0");
    assert.equal(
      KnowledgeGovernanceFoundationName,
      "Knowledge Governance Foundation",
    );
    assert.equal(
      KnowledgeGovernanceFoundationNamespace,
      "nexora.dkl.knowledge-governance.foundation",
    );
    assert.equal(KnowledgeGovernanceFoundationStatus, "FoundationDefined");
    assert.equal(KnowledgeGovernanceFoundationReadiness, "ReadyForRegistry");
    assert.equal(
      KnowledgeGovernanceFoundationPlatform.identity.status,
      "FoundationDefined",
    );
    assert.equal(
      KnowledgeGovernanceFoundationPlatform.readiness,
      "ReadyForRegistry",
    );
    assert.equal(
      KnowledgeGovernanceFoundationPlatform.nextPhase,
      "DKL-8:2 — Knowledge Governance Registry",
    );
  });

  it("consumes only the DKL-7 Public Index", () => {
    const dependency = KnowledgeGovernanceFoundationPlatform.dependency;
    assert.equal(
      dependency.directPreviousPhaseModule,
      "knowledgeServicesPublicIndex.ts",
    );
    assert.equal(dependency.dkl7PublicIndexOnly, true);
    assert.equal(dependency.publicIndexId, KnowledgeServicesPublicIndexId);
    assert.equal(dependency.dkl7InternalImport, false);
    assert.equal(dependency.dkl6DirectImport, false);
    assert.equal(dependency.dkl5DirectImport, false);
    assert.equal(dependency.dkl4DirectImport, false);
    assert.equal(dependency.dkl3DirectImport, false);
    assert.equal(dependency.dkl2DirectImport, false);
    assert.equal(dependency.dkl1DirectImport, false);
    assert.equal(dependency.reconstructsUpstream, false);
    assert.equal(
      KnowledgeGovernanceFoundationPlatform.identity.dkl7PublicIndexId,
      KnowledgeServicesPublicIndexId,
    );
  });

  it("declares required contracts, subjects, and distinct roles", () => {
    const platform = KnowledgeGovernanceFoundationPlatform;
    assert.equal(platform.contracts.length, 18);
    assertUnique(
      platform.contracts.map((item) => item.contractId),
      "contract IDs",
    );
    assert.equal(platform.subjects.length, 19);
    assertUnique(
      platform.subjects.map((item) => item.subjectTypeId),
      "subject IDs",
    );
    assert.equal(platform.roles.length, 8);
    assertUnique(
      platform.roles.map((item) => item.roleId),
      "role IDs",
    );
    assert.deepEqual(
      platform.roles.map((item) => item.roleKind),
      [
        "Owner",
        "Steward",
        "Custodian",
        "Producer",
        "Consumer",
        "Approver",
        "Auditor",
        "PolicyAuthority",
      ],
    );
    for (const role of platform.roles) {
      assert.equal(role.assignsUsers, false);
      assert.equal(role.assignsOrganizations, false);
    }
  });

  it("keeps classification separate from sensitivity and access declarative", () => {
    const platform = KnowledgeGovernanceFoundationPlatform;
    assert.equal(platform.classification.length, 5);
    assert.deepEqual(
      platform.classification.map((item) => item.level),
      [
        "Public",
        "Internal",
        "Confidential",
        "Restricted",
        "HighlyRestricted",
      ],
    );
    for (const item of platform.classification) {
      assert.equal(item.separateFromAccessPermission, true);
      assert.equal(item.separateFromTrustLevel, true);
      assert.equal(item.separateFromValidationResult, true);
      assert.equal(item.separateFromDataQuality, true);
    }

    assert.equal(platform.sensitivity.length, 13);
    for (const item of platform.sensitivity) {
      assert.equal(item.independentFromClassification, true);
      assert.equal(item.implementsPrivacyLaw, false);
    }

    assert.equal(platform.accessIntent.length, 12);
    for (const item of platform.accessIntent) {
      assert.equal(item.declarativeOnly, true);
      assert.equal(item.authenticates, false);
      assert.equal(item.authorizes, false);
      assert.equal(item.enforcesPermissions, false);
      assert.equal(item.runtimeBehavior, "None");
    }

    assert.equal(platform.retention.length, 9);
    assert.equal(platform.disposition.length, 8);
    for (const item of platform.retention) {
      assert.equal(item.schedulesDeletion, false);
      assert.equal(item.mutatesRepository, false);
    }
    for (const item of platform.disposition) {
      assert.equal(item.executesDisposition, false);
      assert.equal(item.mutatesRepository, false);
    }
  });

  it("declares ordered unique lifecycle states and transition declarations", () => {
    const lifecycle = KnowledgeGovernanceFoundationPlatform.lifecycle;
    assert.equal(lifecycle.stateCount, 11);
    assert.deepEqual(
      [...lifecycle.states],
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
    assertUnique([...lifecycle.states], "lifecycle states");
    assert.equal(lifecycle.declarativeOnly, true);
    assert.equal(lifecycle.runtimeStateMachine, false);
    assert.equal(lifecycle.executesTransitions, false);
    assert.equal(lifecycle.transitions.Retired.length, 0);
    assert.ok(lifecycle.transitions.Active.includes("Archived"));
  });

  it("declares audit, compliance, evidence, and exception contracts without runtime", () => {
    const platform = KnowledgeGovernanceFoundationPlatform;
    assert.equal(platform.audit.length, 5);
    assert.equal(platform.compliance.length, 4);
    assert.equal(platform.evidence.length, 12);
    assert.equal(platform.exceptions.length, 1);
    for (const item of platform.audit) {
      assert.equal(item.implementsLogging, false);
      assert.equal(item.storesAuditEvents, false);
    }
    for (const item of platform.compliance) {
      assert.equal(item.interpretsLaw, false);
      assert.equal(item.executesControls, false);
    }
    for (const item of platform.evidence) {
      assert.equal(item.referenceOnly, true);
      assert.equal(item.embedsUpstreamObject, false);
    }
    const exception = platform.exceptions[0]!;
    assert.equal(exception.grantsAutomatically, false);
    assert.equal(exception.implementsWorkflow, false);
    assert.equal(exception.createsTasks, false);
    assert.equal(exception.sendsNotifications, false);
  });

  it("declares ownership, boundaries, and prohibits runtime enforcement", () => {
    const platform = KnowledgeGovernanceFoundationPlatform;
    assert.equal(platform.ownership.ownsCount, 15);
    assert.equal(platform.ownership.doesNotOwnCount, 26);
    assert.equal(platform.boundaries.runtimeEnforcement, false);
    assert.equal(platform.boundaries.authenticates, false);
    assert.equal(platform.boundaries.authorizes, false);
    assert.equal(platform.boundaries.executesPolicy, false);
    assert.equal(platform.boundaries.retrievesKnowledge, false);
    assert.equal(platform.boundaries.makesExecutiveDecisions, false);
    assert.equal(platform.boundaries.rendersUi, false);
    assert.equal(platform.boundaries.rendersScene, false);
    assert.equal(platform.boundaries.connectsNeaChannels, false);
    assert.ok(platform.boundaries.prohibitedSurfaceCount >= 40);
    assert.equal(platform.runtimeEnforcement, false);
    assert.equal(platform.policyExecution, false);
    assert.equal(platform.engineReasoning, false);
    assert.equal(platform.uiBehavior, false);
  });

  it("preserves ordered platform sections and immutable public surface", () => {
    const keys = Object.keys(KnowledgeGovernanceFoundationPlatform);
    assert.deepEqual(keys.slice(0, 17), [...PLATFORM_SECTIONS]);
    assert.equal(Object.isFrozen(KnowledgeGovernanceFoundationPlatform), true);
    assert.equal(
      Object.isFrozen(KnowledgeGovernanceFoundationPlatform.contracts),
      true,
    );
    assert.equal(
      Object.isFrozen(KnowledgeGovernanceFoundationPlatform.subjects),
      true,
    );
    assert.equal(
      Object.isFrozen(KnowledgeGovernanceFoundationPlatform.roles),
      true,
    );
    assert.equal(
      Object.isFrozen(KnowledgeGovernanceFoundationPlatform.lifecycle),
      true,
    );
  });

  it("publishes an additive immutable eight-entry apiRegistry", () => {
    const { apiRegistry } = KnowledgeGovernanceFoundationPlatform;
    assert.equal(apiRegistry.length, 8);
    assert.equal(Object.isFrozen(apiRegistry), true);
    assert.deepEqual(
      apiRegistry.map((item) => item.exportName),
      [...REQUIRED_PUBLIC_EXPORTS],
    );
    assert.equal(
      new Set(apiRegistry.map((item) => item.id)).size,
      apiRegistry.length,
    );
    assert.equal(
      new Set(apiRegistry.map((item) => item.exportName)).size,
      apiRegistry.length,
    );
    assert.equal(KnowledgeGovernanceFoundationPlatform.sectionCount, 17);
    assert.equal(Object.keys(FoundationModule).length, 8);
  });

  it("returns a deterministic summary and is ready for DKL-8:2", () => {
    const summaryA = getKnowledgeGovernanceFoundationSummary();
    const summaryB = getKnowledgeGovernanceFoundationSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.foundationId, KnowledgeGovernanceFoundationId);
    assert.equal(summaryA.status, "FoundationDefined");
    assert.equal(summaryA.readiness, "ReadyForRegistry");
    assert.equal(summaryA.dkl7PublicIndexId, KnowledgeServicesPublicIndexId);
    assert.equal(summaryA.contractCount, 18);
    assert.equal(summaryA.subjectTypeCount, 19);
    assert.equal(summaryA.roleCount, 8);
    assert.equal(summaryA.classificationCount, 5);
    assert.equal(summaryA.sensitivityCount, 13);
    assert.equal(summaryA.accessIntentCount, 12);
    assert.equal(summaryA.retentionCount, 9);
    assert.equal(summaryA.dispositionCount, 8);
    assert.equal(summaryA.lifecycleStateCount, 11);
    assert.equal(summaryA.sectionCount, 17);
    assert.equal(summaryA.metadataOnly, true);
    assert.equal(
      KnowledgeGovernanceFoundationPlatform.nextPhase,
      "DKL-8:2 — Knowledge Governance Registry",
    );
  });
});
