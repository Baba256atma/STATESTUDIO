/**
 * DKL-8:4 — Knowledge Governance Validation Tests.
 *
 * Deterministic coverage for the immutable Knowledge Governance Validation.
 * No mocks. No randomness. No network. No databases. No source inspection.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { KnowledgeGovernanceFoundationPlatform } from "./knowledgeGovernanceFoundation.ts";
import {
  KnowledgeGovernanceModelId,
  KnowledgeGovernanceModelPlatform,
} from "./knowledgeGovernanceModel.ts";
import { KnowledgeGovernanceRegistryPlatform } from "./knowledgeGovernanceRegistry.ts";
import * as ValidationModule from "./knowledgeGovernanceValidation.ts";
import {
  getKnowledgeGovernanceValidationSummary,
  KnowledgeGovernanceValidationId,
  KnowledgeGovernanceValidationName,
  KnowledgeGovernanceValidationNamespace,
  KnowledgeGovernanceValidationPlatform,
  KnowledgeGovernanceValidationReadiness,
  KnowledgeGovernanceValidationStatus,
  KnowledgeGovernanceValidationVersion,
} from "./knowledgeGovernanceValidation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL84_FILES = Object.freeze([
  "knowledgeGovernanceValidationTypes.ts",
  "knowledgeGovernanceValidationRules.ts",
  "knowledgeGovernanceAssignmentValidation.ts",
  "knowledgeGovernancePolicyValidation.ts",
  "knowledgeGovernanceLifecycleValidation.ts",
  "knowledgeGovernanceCompositeValidation.ts",
  "knowledgeGovernanceValidation.ts",
  "knowledgeGovernanceValidation.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "KnowledgeGovernanceValidationId",
  "KnowledgeGovernanceValidationVersion",
  "KnowledgeGovernanceValidationName",
  "KnowledgeGovernanceValidationNamespace",
  "KnowledgeGovernanceValidationStatus",
  "KnowledgeGovernanceValidationReadiness",
  "KnowledgeGovernanceValidationPlatform",
  "getKnowledgeGovernanceValidationSummary",
] as const);

const REQUIRED_CATEGORIES = Object.freeze([
  "Identity",
  "Dependency",
  "RegistryReference",
  "Subject",
  "Scope",
  "ActorRole",
  "Ownership",
  "Stewardship",
  "Classification",
  "Sensitivity",
  "Access",
  "Usage",
  "Retention",
  "Disposition",
  "Audit",
  "Compliance",
  "PolicyApplicability",
  "Lifecycle",
  "Evidence",
  "DecisionReference",
  "Exception",
  "Boundary",
  "Profile",
  "Snapshot",
  "Record",
  "Relationship",
  "Finding",
  "Issue",
  "Conflict",
  "Ambiguity",
  "Result",
  "Immutability",
  "Determinism",
  "RuntimeProhibition",
  "Readiness",
] as const);

const REQUIRED_GATE_NAMES = Object.freeze([
  "IdentityValid",
  "DependencyValid",
  "RegistryReferencesValid",
  "SubjectsValid",
  "AssignmentsValid",
  "PoliciesValid",
  "LifecycleValid",
  "EvidenceValid",
  "ExceptionsValid",
  "BoundariesValid",
  "ProfilesValid",
  "CompositeModelsValid",
  "RelationshipsValid",
  "ImmutabilityValid",
  "DeterminismValid",
  "RuntimeProhibitionsValid",
  "ReadyForManifest",
] as const);

const assertUnique = (
  values: readonly (string | number)[],
  label: string,
): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("DKL-8:4 Knowledge Governance Validation", () => {
  it("creates exactly eight Validation files and eight public exports", () => {
    assert.equal(DKL84_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of DKL84_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(ValidationModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(ValidationModule).length, 8);
  });

  it("has canonical identity, ValidationDefined status, Pass result, ReadyForManifest", () => {
    assert.equal(
      KnowledgeGovernanceValidationId,
      "DKL-8:4/KnowledgeGovernanceValidation",
    );
    assert.equal(KnowledgeGovernanceValidationVersion, "1.0.0");
    assert.equal(
      KnowledgeGovernanceValidationName,
      "Knowledge Governance Validation",
    );
    assert.equal(
      KnowledgeGovernanceValidationNamespace,
      "nexora.dkl.knowledge-governance.validation",
    );
    assert.equal(KnowledgeGovernanceValidationStatus, "ValidationDefined");
    assert.equal(KnowledgeGovernanceValidationReadiness, "ReadyForManifest");
    assert.equal(
      KnowledgeGovernanceValidationPlatform.validationOutcome,
      "Pass",
    );
    assert.equal(
      KnowledgeGovernanceValidationPlatform.nextPhase,
      "DKL-8:5 — Knowledge Governance Manifest",
    );
  });

  it("consumes only DKL-8:3 Model and not Registry, Foundation, or DKL-7 directly", () => {
    const dependency = KnowledgeGovernanceValidationPlatform.dependency;
    assert.equal(
      dependency.directPreviousPhaseModule,
      "knowledgeGovernanceModel.ts",
    );
    assert.equal(dependency.modelOnly, true);
    assert.equal(dependency.modelId, KnowledgeGovernanceModelId);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.dkl7DirectImport, false);
    assert.equal(dependency.futurePhaseDependency, false);
    assert.equal(dependency.circularDependency, false);
    assert.equal(dependency.reconstructsModel, false);
    assert.equal(
      KnowledgeGovernanceValidationPlatform.model,
      KnowledgeGovernanceModelPlatform,
    );
  });

  it("defines exactly 48 unique deterministic rules across 35 categories", () => {
    const platform = KnowledgeGovernanceValidationPlatform;
    assert.equal(platform.ruleCount, 48);
    assert.equal(platform.rules.length, 48);
    assert.equal(platform.categoryCount, 35);
    assert.equal(platform.categories.length, 35);
    assert.equal(platform.severityCount, 4);
    assert.equal(platform.outcomeCount, 4);
    assertUnique(
      platform.rules.map((rule) => rule.id),
      "ruleId",
    );
    assertUnique(
      platform.rules.map((rule) => rule.name),
      "ruleName",
    );
    assertUnique(
      platform.categories.map((item) => item.category),
      "category",
    );
    for (const category of REQUIRED_CATEGORIES) {
      assert.ok(
        platform.categories.some((item) => item.category === category),
        `missing category ${category}`,
      );
    }
    for (const rule of platform.rules) {
      assert.equal(rule.deterministic, true);
      assert.equal(rule.runtimeBehavior, "None");
      assert.equal(rule.metadataOnly, true);
      assert.equal(rule.sourcePhase, "DKL-8:4");
      assert.equal(rule.status, "Active");
      assert.ok(
        platform.categories.some((item) => item.category === rule.category),
      );
      assert.ok(
        platform.severities.some((item) => item.severity === rule.severity),
      );
      assert.ok(
        platform.outcomes.some((item) => item.outcome === rule.outcome),
      );
      assert.equal(Object.isFrozen(rule), true);
      assert.equal(Object.isFrozen(rule.targetModelKinds), true);
    }
  });

  it("covers assignment, policy, lifecycle, and composite validation domains", () => {
    const byCategory = KnowledgeGovernanceValidationPlatform.rulesByCategory;
    assert.ok(byCategory.Subject.length >= 1);
    assert.ok(byCategory.Scope.length >= 1);
    assert.ok(byCategory.ActorRole.length >= 1);
    assert.ok(byCategory.Ownership.length >= 1);
    assert.ok(byCategory.Stewardship.length >= 1);
    assert.ok(byCategory.Classification.length >= 1);
    assert.ok(byCategory.Sensitivity.length >= 1);
    assert.ok(byCategory.Access.length >= 1);
    assert.ok(byCategory.Usage.length >= 1);
    assert.ok(byCategory.Retention.length >= 1);
    assert.ok(byCategory.Disposition.length >= 1);
    assert.ok(byCategory.Audit.length >= 1);
    assert.ok(byCategory.Compliance.length >= 1);
    assert.ok(byCategory.PolicyApplicability.length >= 1);
    assert.ok(byCategory.Lifecycle.length >= 1);
    assert.ok(byCategory.Evidence.length >= 1);
    assert.ok(byCategory.DecisionReference.length >= 1);
    assert.ok(byCategory.Exception.length >= 1);
    assert.ok(byCategory.Boundary.length >= 1);
    assert.ok(byCategory.Profile.length >= 1);
    assert.ok(byCategory.Snapshot.length >= 1);
    assert.ok(byCategory.Record.length >= 1);
    assert.ok(byCategory.Relationship.length >= 1);
    assert.ok(byCategory.Finding.length >= 1);
    assert.ok(byCategory.Issue.length >= 1);
    assert.ok(byCategory.Conflict.length >= 1);
    assert.ok(byCategory.Ambiguity.length >= 1);
    assert.ok(byCategory.Result.length >= 1);
  });

  it("defines exactly 17 readiness gates and all pass including ReadyForManifest", () => {
    const platform = KnowledgeGovernanceValidationPlatform;
    assert.equal(platform.gateCount, 17);
    assert.equal(platform.gates.length, 17);
    assertUnique(
      platform.gates.map((gate) => gate.id),
      "gateId",
    );
    assertUnique(
      platform.gates.map((gate) => gate.name),
      "gateName",
    );
    for (const name of REQUIRED_GATE_NAMES) {
      const gate = platform.gates.find((item) => item.name === name);
      assert.ok(gate, `missing gate ${name}`);
      assert.equal(gate.outcome, "Pass");
      assert.equal(gate.executesExternalBehavior, false);
    }
    const ready = platform.gates.find(
      (item) => item.name === "ReadyForManifest",
    );
    assert.equal(ready?.outcome, "Pass");
    assert.equal(platform.validationResult.readyForManifest, true);
    assert.equal(platform.validationResult.outcome, "Pass");
    assert.equal(platform.validationResult.failedRuleCount, 0);
    assert.equal(platform.validationResult.passedRuleCount, 48);
  });

  it("exposes deterministic helpers and immutable platform sections", () => {
    const helpers = KnowledgeGovernanceValidationPlatform.helpers;
    assert.equal(helpers.getKnowledgeGovernanceValidationRuleCount(), 48);
    assert.equal(
      helpers.getKnowledgeGovernanceValidationRuleById("KG-V-ID-001")?.name,
      "Canonical Model Phase Identity",
    );
    assert.equal(
      helpers.getKnowledgeGovernanceValidationRuleById("unknown-rule"),
      undefined,
    );
    const identityRules =
      helpers.getKnowledgeGovernanceValidationRulesByCategory("Identity");
    const identityRulesAgain =
      helpers.getKnowledgeGovernanceValidationRulesByCategory("Identity");
    assert.deepEqual(identityRules, identityRulesAgain);
    assert.equal(Object.isFrozen(identityRules), true);
    assert.ok(identityRules.length >= 3);
    assert.equal(
      helpers.getKnowledgeGovernanceValidationGateById("IdentityValid")?.name,
      "IdentityValid",
    );

    const report = helpers.validateKnowledgeGovernanceModelDescriptor({
      modelId: KnowledgeGovernanceModelId,
      modelVersion: "1.0.0",
      modelNamespace: "nexora.dkl.knowledge-governance.model",
      status: "ModelDefined",
      readiness: "ReadyForValidation",
      modelKindCount: 31,
      relationshipKindCount: 19,
      metadataOnly: true,
      runtimeEnforcement: false,
      validatesGovernance: false,
      enforcesGovernance: false,
    });
    assert.equal(report.outcome, "Pass");
    assert.equal(report.failedRuleCount, 0);
    assert.equal(Object.isFrozen(report), true);

    const failReport = helpers.validateKnowledgeGovernanceModelDescriptor({
      modelId: "wrong",
      modelVersion: "0.0.0",
      modelNamespace: "wrong",
      status: "Invalid",
      readiness: "Invalid",
      modelKindCount: 0,
      relationshipKindCount: 0,
      metadataOnly: false,
      runtimeEnforcement: true,
    });
    assert.equal(failReport.outcome, "Fail");
    assert.ok(failReport.failedRuleCount > 0);

    const platform = KnowledgeGovernanceValidationPlatform;
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(platform.rules), true);
    assert.equal(Object.isFrozen(platform.gates), true);
    assert.equal(Object.isFrozen(platform.findings), true);
    assert.equal(Object.isFrozen(platform.categories), true);
    assert.deepEqual(
      [...platform.sectionOrder],
      [
        "identity",
        "dependency",
        "categories",
        "severities",
        "outcomes",
        "rules",
        "rulesByCategory",
        "findings",
        "reports",
        "gates",
        "validationResult",
        "boundaries",
        "readiness",
      ],
    );
  });

  it("has no runtime enforcement, persistence, or cross-layer behavior", () => {
    const platform = KnowledgeGovernanceValidationPlatform;
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.runtimeEnforcement, false);
    assert.equal(platform.policyExecution, false);
    assert.equal(platform.authenticationBehavior, false);
    assert.equal(platform.authorizationBehavior, false);
    assert.equal(platform.repositoryAccess, false);
    assert.equal(platform.lifecycleExecution, false);
    assert.equal(platform.exceptionWorkflow, false);
    assert.equal(platform.legalEvaluation, false);
    assert.equal(platform.auditLogging, false);
    assert.equal(platform.persistenceBehavior, false);
    assert.equal(platform.uiBehavior, false);
    assert.equal(platform.engineReasoning, false);
    assert.equal(platform.advisorBehavior, false);
    assert.equal(platform.directorBehavior, false);
    assert.equal(platform.sceneBehavior, false);
    assert.equal(platform.boundaries.enforcesPolicies, false);
    assert.equal(platform.boundaries.authorizesAccess, false);
    assert.equal(platform.boundaries.persistsResults, false);
    assert.equal(platform.boundaries.performsRuntimeGovernance, false);
  });

  it("produces a deterministic summary ready for DKL-8:5", () => {
    const summary = getKnowledgeGovernanceValidationSummary();
    const summaryAgain = getKnowledgeGovernanceValidationSummary();
    assert.deepEqual(summary, summaryAgain);
    assert.equal(summary.id, KnowledgeGovernanceValidationId);
    assert.equal(summary.version, KnowledgeGovernanceValidationVersion);
    assert.equal(summary.namespace, KnowledgeGovernanceValidationNamespace);
    assert.equal(summary.status, "ValidationDefined");
    assert.equal(summary.validationOutcome, "Pass");
    assert.equal(summary.readiness, "ReadyForManifest");
    assert.equal(summary.ruleCount, 48);
    assert.equal(summary.categoryCount, 35);
    assert.equal(summary.gateCount, 17);
    assert.equal(summary.failedRuleCount, 0);
    assert.equal(summary.runtimeBehavior, "None");
    assert.equal(
      summary.nextPhase,
      "DKL-8:5 — Knowledge Governance Manifest",
    );
    assert.equal(Object.isFrozen(summary), true);
  });

  it("publishes an additive immutable eight-entry apiRegistry", () => {
    const platform = KnowledgeGovernanceValidationPlatform;
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
    assert.equal(platform.sectionCount, platform.sectionOrder.length);
    assert.equal(
      platform.model.apiRegistry,
      KnowledgeGovernanceModelPlatform.apiRegistry,
    );
    assert.equal(
      platform.model.registry.apiRegistry,
      KnowledgeGovernanceRegistryPlatform.apiRegistry,
    );
    assert.equal(
      platform.model.registry.foundation.apiRegistry,
      KnowledgeGovernanceFoundationPlatform.apiRegistry,
    );
  });
});
