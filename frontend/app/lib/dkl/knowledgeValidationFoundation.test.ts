/**
 * DKL-5:1 — Knowledge Validation Foundation Tests.
 *
 * Deterministic coverage for the immutable Knowledge Validation Foundation.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import * as foundationApi from "./knowledgeValidationFoundation.ts";
import {
  KnowledgeValidationFoundation,
  KnowledgeValidationFoundationVersion,
  KnowledgeValidationFoundationIdentity,
  KnowledgeValidationContracts,
  KnowledgeValidationOwnership,
  KnowledgeValidationBoundaries,
  KnowledgeValidationLifecycle,
  KnowledgeValidationDependencies,
} from "./knowledgeValidationFoundation.ts";
import {
  KnowledgeModelingPublicIndexId,
  KnowledgeModelingPublicIndexVersion,
} from "./knowledgeModelingPublicIndex.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL51_FILES = [
  "knowledgeValidationFoundationTypes.ts",
  "knowledgeValidationContracts.ts",
  "knowledgeValidationOwnership.ts",
  "knowledgeValidationBoundaries.ts",
  "knowledgeValidationLifecycle.ts",
  "knowledgeValidationDependencies.ts",
  "knowledgeValidationFoundation.ts",
  "knowledgeValidationFoundation.test.ts",
];

const REQUIRED_TARGETS = [
  "KnowledgeModel",
  "KnowledgeObject",
  "BusinessObject",
  "Entity",
  "Relationship",
  "Identity",
  "Metadata",
  "Hierarchy",
  "Composition",
  "Reference",
  "SemanticStructure",
  "Provenance",
  "Context",
  "Snapshot",
  "ObjectSet",
  "RelationshipSet",
  "Boundary",
  "Version",
  "Summary",
] as const;

const REQUIRED_DIMENSIONS = [
  "Identity",
  "Completeness",
  "Consistency",
  "Integrity",
  "ReferentialIntegrity",
  "StructuralValidity",
  "SemanticAlignment",
  "Provenance",
  "Traceability",
  "Ownership",
  "Compatibility",
  "Classification",
  "RelationshipValidity",
  "HierarchyValidity",
  "CompositionValidity",
  "Ambiguity",
  "Conflict",
  "FreshnessDeclaration",
  "ConsumerReadiness",
  "ExecutiveUsability",
] as const;

const REQUIRED_SIGNALS = [
  "Complete",
  "MostlyComplete",
  "Partial",
  "Missing",
  "Consistent",
  "Conflicting",
  "Clear",
  "Ambiguous",
  "Traceable",
  "Untraceable",
  "Supported",
  "Unsupported",
  "Current",
  "PotentiallyStale",
  "Verified",
  "Unverified",
  "Reliable",
  "Limited",
  "Restricted",
  "Ready",
] as const;

const REQUIRED_OUTCOMES = [
  "NotEvaluated",
  "Valid",
  "ValidWithLimitations",
  "Invalid",
  "Incomplete",
  "Ambiguous",
  "Conflicting",
  "Unsupported",
  "Restricted",
  "ReadyForConsumer",
  "NotReadyForConsumer",
] as const;

const REQUIRED_SEVERITIES = [
  "Informational",
  "Low",
  "Medium",
  "High",
  "Critical",
  "Blocking",
] as const;

test("1. exactly eight DKL-5:1 files exist", () => {
  assert.equal(DKL51_FILES.length, 8);
  for (const file of DKL51_FILES) {
    assert.ok(readdirSync(HERE).includes(file), `missing ${file}`);
  }
});

test("2. foundation module has exactly eight runtime exports", () => {
  assert.deepEqual(Object.keys(foundationApi).sort(), [
    "KnowledgeValidationBoundaries",
    "KnowledgeValidationContracts",
    "KnowledgeValidationDependencies",
    "KnowledgeValidationFoundation",
    "KnowledgeValidationFoundationIdentity",
    "KnowledgeValidationFoundationVersion",
    "KnowledgeValidationLifecycle",
    "KnowledgeValidationOwnership",
  ]);
});

test("3. no helper functions among foundation public exports", () => {
  for (const [name, value] of Object.entries(foundationApi)) {
    assert.notEqual(typeof value, "function", `${name} must not be a function`);
  }
});

test("4. foundation identity, version, namespace, status, readiness", () => {
  assert.equal(
    KnowledgeValidationFoundationIdentity.foundationId,
    "DKL-5:1/KnowledgeValidationFoundation",
  );
  assert.equal(KnowledgeValidationFoundationIdentity.sourcePhase, "DKL-5:1");
  assert.equal(KnowledgeValidationFoundationIdentity.platformId, "DKL-5");
  assert.equal(KnowledgeValidationFoundationIdentity.status, "FoundationComplete");
  assert.equal(KnowledgeValidationFoundationIdentity.readiness, "ReadyForRegistry");
  assert.equal(KnowledgeValidationFoundationVersion, "1.0.0");
  assert.equal(
    KnowledgeValidationFoundationIdentity.foundationNamespace,
    "nexora.dkl.knowledge-validation.foundation",
  );
  assert.equal(KnowledgeValidationFoundation.version, "1.0.0");
  assert.equal(KnowledgeValidationFoundation.readiness.ReadyForRegistry, true);
});

test("5. dependency only on knowledgeModelingPublicIndex.ts", () => {
  for (const file of DKL51_FILES.filter((f) => !f.endsWith(".test.ts"))) {
    const text = readFileSync(join(HERE, file), "utf8");
    const imports = [...text.matchAll(/from\s+["']([^"']+)["']/g)].map((m) => m[1]!);
    for (const spec of imports) {
      if (spec.includes("knowledgeModeling") && !spec.includes("knowledgeValidation")) {
        assert.ok(
          /knowledgeModelingPublicIndex\.ts$/.test(spec),
          `${file} must import DKL-4 only via Public Index: ${spec}`,
        );
      }
      assert.equal(
        /dataUnderstanding|dataKnowledge|dataSource/.test(spec) &&
          !spec.includes("knowledgeValidation"),
        false,
        `${file} must not import DKL-1/2/3 directly: ${spec}`,
      );
    }
  }
  assert.equal(
    KnowledgeValidationFoundation.upstream.module,
    "knowledgeModelingPublicIndex.ts",
  );
  assert.equal(
    KnowledgeValidationFoundation.upstream.dkl4PublicIndexId,
    KnowledgeModelingPublicIndexId,
  );
  assert.equal(
    KnowledgeValidationFoundation.upstream.dkl4PublicIndexVersion,
    KnowledgeModelingPublicIndexVersion,
  );
  assert.equal(KnowledgeValidationDependencies.allowed.length, 1);
  assert.equal(
    KnowledgeValidationDependencies.allowed[0]?.module,
    "knowledgeModelingPublicIndex.ts",
  );
});

test("6. required validation contracts, targets, and dimensions exist", () => {
  assert.equal(KnowledgeValidationContracts.contractKinds.length, 20);
  assert.ok(
    KnowledgeValidationContracts.contractKinds.includes("KnowledgeValidation"),
  );
  assert.ok(
    KnowledgeValidationContracts.contractKinds.includes("KnowledgeQualitySignal"),
  );
  assert.ok(
    KnowledgeValidationContracts.contractKinds.includes("KnowledgeTrustDeclaration"),
  );
  assert.deepEqual(
    [...KnowledgeValidationContracts.targetCategories],
    [...REQUIRED_TARGETS],
  );
  assert.deepEqual(
    [...KnowledgeValidationContracts.dimensions],
    [...REQUIRED_DIMENSIONS],
  );
  assert.equal(KnowledgeValidationContracts.dkl4TargetMappingByReference, true);
  assert.equal(KnowledgeValidationContracts.noRuntimeTargetInstances, true);
  assert.equal(KnowledgeValidationContracts.noChecksExecuted, true);
});

test("7. quality signals and trust declaration exist", () => {
  assert.equal(KnowledgeValidationContracts.qualitySignals.length, 20);
  const ids = KnowledgeValidationContracts.qualitySignals.map((s) => s.id);
  assert.deepEqual([...ids], [...REQUIRED_SIGNALS]);
  for (const signal of KnowledgeValidationContracts.qualitySignals) {
    assert.equal(signal.sourcePhase, "DKL-5:1");
    assert.ok(signal.meaning.length > 0);
    assert.equal(Object.isFrozen(signal), true);
  }
  assert.equal(
    KnowledgeValidationContracts.trustDeclaration.contractId,
    "DKL-5:1/KnowledgeTrustDeclaration",
  );
  assert.ok(
    KnowledgeValidationContracts.trustDeclaration.fields.includes("trustLevel"),
  );
  assert.equal(
    KnowledgeValidationContracts.trustDeclaration.notes.noAiConfidence,
    true,
  );
  assert.equal(
    KnowledgeValidationContracts.trustDeclaration.notes.noAutomaticCalculation,
    true,
  );
  assert.equal(KnowledgeValidationContracts.noScoreCalculation, true);
  assert.equal(KnowledgeValidationContracts.noTrustCalculation, true);
});

test("8. outcomes and severity levels exist with correct meanings", () => {
  assert.deepEqual(
    [...KnowledgeValidationContracts.outcomeStatuses],
    [...REQUIRED_OUTCOMES],
  );
  const byStatus = Object.fromEntries(
    KnowledgeValidationContracts.outcomes.map((o) => [o.status, o]),
  );
  assert.equal(byStatus.ValidWithLimitations?.mayRemainUsable, true);
  assert.equal(byStatus.Ambiguous?.clarificationRequired, true);
  assert.equal(byStatus.Conflicting?.blocksConclusions, true);
  assert.equal(byStatus.Incomplete?.mayRemainUsable, true);
  assert.equal(byStatus.Invalid?.mayRemainUsable, false);
  assert.deepEqual(
    KnowledgeValidationContracts.severities.map((s) => s.severity),
    [...REQUIRED_SEVERITIES],
  );
});

test("9. evidence, findings, ambiguity, and conflict contracts exist", () => {
  const ef = KnowledgeValidationContracts.evidenceAndFindings;
  assert.ok(ef.validationEvidence.includes("evidenceId"));
  assert.ok(ef.validationFinding.includes("findingId"));
  assert.equal(ef.notes.recommendationsAreDeclarationsOnly, true);
  assert.equal(ef.notes.noDynamicRecommendationGeneration, true);
  const ac = KnowledgeValidationContracts.ambiguityAndConflict;
  assert.ok(ac.ambiguousKnowledge.includes("ambiguityId"));
  assert.ok(ac.knowledgeConflict.includes("conflictId"));
  assert.equal(ac.notes.noEntityResolution, true);
  assert.equal(ac.notes.noSemanticChoice, true);
  assert.equal(ac.notes.noUserContact, true);
  assert.equal(ac.notes.noSourceModification, true);
});

test("10. lifecycle states exist and transitions are metadata-only", () => {
  assert.equal(KnowledgeValidationLifecycle.stateCount, 11);
  assert.deepEqual([...KnowledgeValidationLifecycle.states], [
    "Declared",
    "AwaitingEvaluation",
    "Evaluating",
    "EvidenceCollected",
    "FindingsProduced",
    "ResultDetermined",
    "Limited",
    "Blocked",
    "ReadyForConsumer",
    "Superseded",
    "Archived",
  ]);
  assert.equal(
    KnowledgeValidationLifecycle.notes.transitionExecutionForbidden,
    true,
  );
  assert.equal(
    KnowledgeValidationLifecycle.notes.validationExecutionForbidden,
    true,
  );
  assert.ok(KnowledgeValidationLifecycle.transitions.Declared.includes("AwaitingEvaluation"));
  assert.equal(Object.isFrozen(KnowledgeValidationLifecycle.transitions), true);
});

test("11. ownership and boundaries exclude cleansing, AI, Engine, persistence", () => {
  assert.ok(
    KnowledgeValidationOwnership.owns.includes("Validation contracts"),
  );
  assert.ok(
    KnowledgeValidationOwnership.doesNotOwn.includes("data cleansing"),
  );
  assert.ok(
    KnowledgeValidationOwnership.doesNotOwn.includes("AI confidence generation"),
  );
  assert.ok(
    KnowledgeValidationOwnership.doesNotOwn.includes("executive reasoning"),
  );
  assert.ok(KnowledgeValidationOwnership.doesNotOwn.includes("persistence"));
  assert.equal(
    KnowledgeValidationOwnership.noDuplicateKnowledgeModelingOwnership,
    true,
  );
  assert.equal(KnowledgeValidationBoundaries.performsDataCleansing, false);
  assert.equal(KnowledgeValidationBoundaries.executesValidationRules, false);
  assert.equal(KnowledgeValidationBoundaries.generatesAiConfidence, false);
  assert.equal(KnowledgeValidationBoundaries.executesEngineReasoning, false);
  assert.equal(KnowledgeValidationBoundaries.persistsResults, false);
  assert.equal(KnowledgeValidationBoundaries.dataCleansingExcluded, true);
  assert.equal(KnowledgeValidationBoundaries.runtimeValidationExecutionExcluded, true);
  assert.equal(KnowledgeValidationBoundaries.aiConfidenceGenerationExcluded, true);
  assert.equal(KnowledgeValidationBoundaries.engineReasoningExcluded, true);
  assert.equal(KnowledgeValidationBoundaries.persistenceExcluded, true);
});

test("12. foundation metadata is frozen and deterministic", () => {
  assert.equal(Object.isFrozen(KnowledgeValidationFoundation), true);
  assert.equal(Object.isFrozen(KnowledgeValidationFoundationIdentity), true);
  assert.equal(Object.isFrozen(KnowledgeValidationContracts), true);
  assert.equal(Object.isFrozen(KnowledgeValidationContracts.qualitySignals), true);
  assert.equal(Object.isFrozen(KnowledgeValidationOwnership), true);
  assert.equal(Object.isFrozen(KnowledgeValidationBoundaries), true);
  assert.equal(Object.isFrozen(KnowledgeValidationLifecycle), true);
  assert.equal(Object.isFrozen(KnowledgeValidationDependencies), true);
  assert.equal(KnowledgeValidationFoundation.metadataOnly, true);
  assert.equal(KnowledgeValidationFoundation.immutable, true);
  assert.equal(KnowledgeValidationFoundation.deterministic, true);
  assert.equal(KnowledgeValidationFoundation.guarantees.noAi, true);
  assert.equal(
    KnowledgeValidationFoundation.guarantees.noHeavyDataCleaningResponsibility,
    true,
  );
  assert.equal(
    KnowledgeValidationFoundation.nextPhase,
    "DKL-5:2 — Knowledge Validation Registry",
  );
});
