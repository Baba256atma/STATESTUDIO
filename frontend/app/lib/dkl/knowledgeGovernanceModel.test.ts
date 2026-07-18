/**
 * DKL-8:3 — Knowledge Governance Model Tests.
 *
 * Deterministic coverage for the immutable Knowledge Governance Model.
 * No mocks. No randomness. No network. No databases. No source inspection.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { KnowledgeGovernanceFoundationPlatform } from "./knowledgeGovernanceFoundation.ts";
import {
  KnowledgeGovernanceRegistryId,
  KnowledgeGovernanceRegistryPlatform,
} from "./knowledgeGovernanceRegistry.ts";
import * as ModelModule from "./knowledgeGovernanceModel.ts";
import {
  getKnowledgeGovernanceModelSummary,
  KnowledgeGovernanceModelId,
  KnowledgeGovernanceModelName,
  KnowledgeGovernanceModelNamespace,
  KnowledgeGovernanceModelPlatform,
  KnowledgeGovernanceModelReadiness,
  KnowledgeGovernanceModelStatus,
  KnowledgeGovernanceModelVersion,
} from "./knowledgeGovernanceModel.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL83_FILES = Object.freeze([
  "knowledgeGovernanceModelTypes.ts",
  "knowledgeGovernanceAssignmentModels.ts",
  "knowledgeGovernancePolicyModels.ts",
  "knowledgeGovernanceLifecycleModels.ts",
  "knowledgeGovernanceEvidenceModels.ts",
  "knowledgeGovernanceCompositeModels.ts",
  "knowledgeGovernanceModel.ts",
  "knowledgeGovernanceModel.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "KnowledgeGovernanceModelId",
  "KnowledgeGovernanceModelVersion",
  "KnowledgeGovernanceModelName",
  "KnowledgeGovernanceModelNamespace",
  "KnowledgeGovernanceModelStatus",
  "KnowledgeGovernanceModelReadiness",
  "KnowledgeGovernanceModelPlatform",
  "getKnowledgeGovernanceModelSummary",
] as const);

const REQUIRED_MODEL_KINDS = Object.freeze([
  "GovernanceIdentity",
  "GovernanceSubjectReference",
  "GovernanceScope",
  "GovernanceActorRoleReference",
  "OwnershipAssignment",
  "StewardshipAssignment",
  "ClassificationAssignment",
  "SensitivityAssignment",
  "AccessIntentAssignment",
  "UsagePolicyAssignment",
  "RetentionIntentAssignment",
  "DispositionIntentAssignment",
  "AuditIntentAssignment",
  "ComplianceIntentAssignment",
  "PolicyApplicability",
  "GovernanceLifecycleState",
  "GovernanceLifecycleTransitionRecord",
  "GovernanceEvidenceReference",
  "GovernanceDecisionReference",
  "GovernanceException",
  "GovernanceBoundaryReference",
  "GovernanceProfile",
  "GovernanceSnapshot",
  "GovernanceRecord",
  "GovernanceRelationship",
  "GovernanceFinding",
  "GovernanceIssue",
  "GovernanceConflict",
  "GovernanceAmbiguity",
  "GovernanceModelResult",
  "GovernanceModelReferences",
] as const);

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "modelKinds",
  "subjects",
  "scopes",
  "actors",
  "ownership",
  "stewardship",
  "classification",
  "sensitivity",
  "access",
  "usage",
  "retention",
  "disposition",
  "audit",
  "compliance",
  "policyApplicability",
  "lifecycle",
  "evidence",
  "decisions",
  "exceptions",
  "boundaries",
  "profiles",
  "snapshots",
  "records",
  "relationships",
  "findings",
  "issues",
  "conflicts",
  "ambiguities",
  "results",
  "references",
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

describe("DKL-8:3 Knowledge Governance Model", () => {
  it("creates exactly eight Model files and eight public exports", () => {
    assert.equal(DKL83_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of DKL83_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(ModelModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(ModelModule).length, 8);
  });

  it("has canonical identity, ModelDefined status, and ReadyForValidation", () => {
    assert.equal(
      KnowledgeGovernanceModelId,
      "DKL-8:3/KnowledgeGovernanceModel",
    );
    assert.equal(KnowledgeGovernanceModelVersion, "1.0.0");
    assert.equal(KnowledgeGovernanceModelName, "Knowledge Governance Model");
    assert.equal(
      KnowledgeGovernanceModelNamespace,
      "nexora.dkl.knowledge-governance.model",
    );
    assert.equal(KnowledgeGovernanceModelStatus, "ModelDefined");
    assert.equal(KnowledgeGovernanceModelReadiness, "ReadyForValidation");
    assert.equal(
      KnowledgeGovernanceModelPlatform.nextPhase,
      "DKL-8:4 — Knowledge Governance Validation",
    );
  });

  it("consumes only DKL-8:2 Registry and not Foundation or DKL-7 directly", () => {
    const dependency = KnowledgeGovernanceModelPlatform.dependency;
    assert.equal(
      dependency.directPreviousPhaseModule,
      "knowledgeGovernanceRegistry.ts",
    );
    assert.equal(dependency.registryOnly, true);
    assert.equal(dependency.registryId, KnowledgeGovernanceRegistryId);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.dkl7DirectImport, false);
    assert.equal(dependency.reconstructsFoundation, false);
    assert.equal(dependency.reconstructsRegistry, false);
    assert.equal(
      KnowledgeGovernanceModelPlatform.registry,
      KnowledgeGovernanceRegistryPlatform,
    );
  });

  it("defines all required model kinds with unique IDs", () => {
    const kinds = KnowledgeGovernanceModelPlatform.modelKinds;
    assert.equal(kinds.length, REQUIRED_MODEL_KINDS.length);
    assert.equal(KnowledgeGovernanceModelPlatform.modelKindCount, 31);
    for (const required of REQUIRED_MODEL_KINDS) {
      assert.ok(
        kinds.some((item) => item.modelKind === required),
        `missing model kind ${required}`,
      );
    }
    assertUnique(
      kinds.map((item) => item.modelKindId),
      "modelKindId",
    );
    assertUnique(
      kinds.map((item) => item.modelKind),
      "modelKind",
    );
    assertFrozenCollection(kinds, "modelKinds");
  });

  it("uses Registry-derived identifiers and preserves registry reference", () => {
    const platform = KnowledgeGovernanceModelPlatform;
    assert.deepEqual(
      [...platform.subjects.registrySubjectIds],
      KnowledgeGovernanceRegistryPlatform.subjects.map((item) => item.id),
    );
    assert.deepEqual(
      [...platform.classification.classificationIds],
      KnowledgeGovernanceRegistryPlatform.classifications.map(
        (item) => item.id,
      ),
    );
    assert.deepEqual(
      [...platform.sensitivity.sensitivityIds],
      KnowledgeGovernanceRegistryPlatform.sensitivities.map((item) => item.id),
    );
    assert.deepEqual(
      [...platform.lifecycle.lifecycleStateIds],
      KnowledgeGovernanceRegistryPlatform.lifecycleStates.map(
        (item) => item.id,
      ),
    );
    assert.deepEqual(
      [...platform.lifecycle.lifecycleTransitionIds],
      KnowledgeGovernanceRegistryPlatform.lifecycleTransitions.map(
        (item) => item.id,
      ),
    );
    assert.equal(platform.lifecycle.lifecycleStateCount, 11);
    assert.equal(platform.lifecycle.lifecycleTransitionCount, 31);
  });

  it("keeps subject, scope, owner, and steward models declarative and distinct", () => {
    const platform = KnowledgeGovernanceModelPlatform;
    assert.equal(platform.subjects.embedsUpstreamObjects, false);
    assert.equal(platform.subjects.reconstructsDkl4, false);
    assert.equal(platform.subjects.reconstructsDkl6, false);
    assert.equal(platform.subjects.reconstructsDkl7, false);
    assert.equal(platform.scopes.declarativeOnly, true);
    assert.equal(platform.scopes.resolvesInheritance, false);
    assert.equal(platform.ownership.definition.modelKind, "OwnershipAssignment");
    assert.equal(
      platform.stewardship.definition.modelKind,
      "StewardshipAssignment",
    );
    assert.notEqual(
      platform.ownership.definition.modelKindId,
      platform.stewardship.definition.modelKindId,
    );
    assert.equal(platform.stewardship.mergedWithOwnership, false);
    assert.equal(platform.ownership.assignsUsersAutomatically, false);
    assert.equal(platform.actors.resolvesIdentity, false);
    assert.equal(platform.actors.authenticates, false);
  });

  it("keeps classification and sensitivity separate with correct cardinalities", () => {
    const platform = KnowledgeGovernanceModelPlatform;
    assert.equal(platform.classification.cardinality, "ExactlyOne");
    assert.equal(platform.sensitivity.cardinality, "ZeroOrMoreUnique");
    assert.equal(platform.classification.separateFromSensitivity, true);
    assert.equal(platform.sensitivity.separateFromClassification, true);
    assert.equal(platform.classification.separateFromAuthorization, true);
    assert.equal(platform.classification.calculatesAutomatically, false);
    assert.equal(platform.sensitivity.duplicateSensitivityIdsAllowed, false);
    assert.equal(platform.sensitivity.stableOrdering, true);
    assert.equal(platform.sensitivity.calculatesRiskScore, false);
    assert.equal(platform.sensitivity.enforcesAccess, false);
  });

  it("keeps policy and intent models descriptive without runtime behavior", () => {
    const platform = KnowledgeGovernanceModelPlatform;
    assert.equal(platform.access.returnsAuthorizationOutcomes, false);
    assert.equal(platform.access.producesAllowedDenied, false);
    assert.equal(platform.usage.executesPolicyRules, false);
    assert.equal(platform.usage.evaluatesConflicts, false);
    assert.equal(platform.retention.schedulesRetention, false);
    assert.equal(platform.retention.usesCron, false);
    assert.equal(platform.retention.deletesRecords, false);
    assert.equal(platform.disposition.executesDisposition, false);
    assert.equal(platform.audit.implementsAuditLogging, false);
    assert.equal(platform.audit.storesEvents, false);
    assert.equal(platform.compliance.evaluatesCompliance, false);
    assert.equal(platform.compliance.legalInterpretation, false);
    assert.equal(platform.policyApplicability.resolvesPrecedence, false);
    assert.equal(platform.policyApplicability.calculatesInheritedSets, false);
    assert.equal(platform.policyApplicability.executesOverrides, false);
  });

  it("keeps lifecycle, evidence, exception, and boundary models structural only", () => {
    const platform = KnowledgeGovernanceModelPlatform;
    assert.equal(platform.lifecycle.runtimeStateMachine, false);
    assert.equal(platform.lifecycle.executesTransitions, false);
    assert.equal(platform.evidence.embedsDocuments, false);
    assert.equal(platform.decisions.reconstructsEngineDecisions, false);
    assert.equal(platform.decisions.makesDecisions, false);
    assert.equal(platform.exceptions.submitsExceptions, false);
    assert.equal(platform.exceptions.approvesExceptions, false);
    assert.equal(platform.exceptions.workflowMethods, false);
    assert.equal(platform.boundaries.createsExternalDependencies, false);
  });

  it("defines composite profile, snapshot, record, and relationship structures", () => {
    const platform = KnowledgeGovernanceModelPlatform;
    assert.equal(platform.profiles.composesByReference, true);
    assert.equal(platform.profiles.evaluatesCompleteness, false);
    assert.ok(
      platform.profiles.definition.fields.includes("ownership"),
    );
    assert.ok(
      platform.profiles.definition.fields.includes("classification"),
    );
    assert.equal(platform.snapshots.usesSystemTime, false);
    assert.equal(platform.snapshots.persists, false);
    assert.equal(platform.records.isPersistenceEntity, false);
    assert.equal(platform.records.isOrmModel, false);
    assert.equal(platform.relationships.relationshipKindCount, 19);
    assertUnique(
      platform.relationships.kinds.map((item) => item.relationshipKindId),
      "relationshipKindId",
    );
    assertUnique(
      platform.relationships.kinds.map((item) => item.relationshipKind),
      "relationshipKind",
    );
    assert.equal(platform.relationships.traversalEngine, false);
  });

  it("defines finding, issue, conflict, ambiguity, and result as structural only", () => {
    const platform = KnowledgeGovernanceModelPlatform;
    assert.equal(platform.findings.generatesFindings, false);
    assert.equal(platform.issues.detectsIssues, false);
    assert.equal(platform.conflicts.resolvesConflicts, false);
    assert.equal(platform.conflicts.conflictTypes.length, 10);
    assert.equal(platform.ambiguities.asksUserQuestions, false);
    assert.equal(platform.ambiguities.ambiguityTypes.length, 12);
    assert.equal(platform.results.runsValidation, false);
    assert.equal(platform.results.calculatesReadinessDynamically, false);
  });

  it("exposes immutable platform sections and deterministic summary", () => {
    const platform = KnowledgeGovernanceModelPlatform;
    assert.deepEqual([...platform.sectionOrder], [...PLATFORM_SECTIONS]);
    assert.equal(platform.sectionCount, PLATFORM_SECTIONS.length);
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(platform.modelKinds), true);
    assert.equal(Object.isFrozen(platform.relationships.kinds), true);
    assert.equal(Object.isFrozen(platform.references.subjectReferences), true);
    assert.equal(platform.runtimeEnforcement, false);
    assert.equal(platform.validatesGovernance, false);
    assert.equal(platform.enforcesGovernance, false);
    assert.equal(platform.uiBehavior, false);
    assert.equal(platform.engineReasoning, false);
    assert.equal(platform.advisorBehavior, false);
    assert.equal(platform.directorBehavior, false);
    assert.equal(platform.sceneBehavior, false);

    const summary = getKnowledgeGovernanceModelSummary();
    const summaryAgain = getKnowledgeGovernanceModelSummary();
    assert.deepEqual(summary, summaryAgain);
    assert.equal(summary.id, KnowledgeGovernanceModelId);
    assert.equal(summary.version, KnowledgeGovernanceModelVersion);
    assert.equal(summary.namespace, KnowledgeGovernanceModelNamespace);
    assert.equal(summary.status, "ModelDefined");
    assert.equal(summary.readiness, "ReadyForValidation");
    assert.equal(summary.upstreamDependency, KnowledgeGovernanceRegistryId);
    assert.equal(summary.modelKindCount, 31);
    assert.equal(summary.relationshipKindCount, 19);
    assert.equal(summary.assignmentModelCount, 8);
    assert.equal(summary.policyModelCount, 7);
    assert.equal(summary.lifecycleModelCount, 2);
    assert.equal(summary.evidenceModelCount, 4);
    assert.equal(summary.compositeModelCount, 10);
    assert.equal(summary.runtimeBehavior, "None");
    assert.equal(
      summary.nextPhase,
      "DKL-8:4 — Knowledge Governance Validation",
    );
    assert.equal(Object.isFrozen(summary), true);
  });

  it("is ready for DKL-8:4 with no runtime enforcement surface", () => {
    const platform = KnowledgeGovernanceModelPlatform;
    assert.equal(platform.readiness, "ReadyForValidation");
    assert.equal(platform.status, "ModelDefined");
    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.immutable, true);
    assert.equal(platform.deterministic, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.policyExecution, false);
    assert.equal(platform.authenticationBehavior, false);
    assert.equal(platform.authorizationBehavior, false);
    assert.equal(platform.repositoryAccess, false);
    assert.equal(platform.aiBehavior, false);
    for (const kind of platform.modelKinds) {
      assert.equal(kind.runtimeBehavior, "None");
      assert.equal(kind.generatesFindings, false);
      assert.equal(kind.evaluatesGovernance, false);
      assert.equal(Object.isFrozen(kind), true);
      assert.equal(Object.isFrozen(kind.fields), true);
    }
  });

  it("publishes an additive immutable eight-entry apiRegistry", () => {
    const platform = KnowledgeGovernanceModelPlatform;
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
      platform.registry.apiRegistry,
      KnowledgeGovernanceRegistryPlatform.apiRegistry,
    );
    assert.equal(
      platform.registry.foundation.apiRegistry,
      KnowledgeGovernanceFoundationPlatform.apiRegistry,
    );
  });
});
