/**
 * DKL-3:3 — Data Understanding Model Tests.
 *
 * Deterministic coverage for the immutable model layer.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import * as modelApi from "./dataUnderstandingModel.ts";
import {
  DataUnderstandingModel,
  DataUnderstandingCandidateModel,
  DataUnderstandingEvidenceModel,
  DataUnderstandingRelationshipModel,
  DataUnderstandingSnapshotModel,
  DataUnderstandingModelManifest,
  DataUnderstandingModelVersion,
  DataUnderstandingModelIdentity,
} from "./dataUnderstandingModel.ts";
import {
  DataUnderstandingContracts,
  DataUnderstandingEvidenceCatalog,
  DataUnderstandingLifecycle,
} from "./dataUnderstandingFoundation.ts";
import {
  DataUnderstandingCandidateRegistry,
  DataUnderstandingEvidenceRegistry,
  DataUnderstandingRegistry,
  DataUnderstandingSubjectRegistry,
} from "./dataUnderstandingRegistry.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL33_FILES = [
  "dataUnderstandingModelTypes.ts",
  "dataUnderstandingCandidateModel.ts",
  "dataUnderstandingEvidenceModel.ts",
  "dataUnderstandingRelationshipModel.ts",
  "dataUnderstandingSnapshotModel.ts",
  "dataUnderstandingModelManifest.ts",
  "dataUnderstandingModel.ts",
  "dataUnderstandingModel.test.ts",
];

const isDeeplyFrozen = (value: unknown): boolean => {
  if (value === null || typeof value !== "object") {
    return true;
  }
  if (!Object.isFrozen(value)) {
    return false;
  }
  for (const nested of Object.values(value as Record<string, unknown>)) {
    if (!isDeeplyFrozen(nested)) {
      return false;
    }
  }
  return true;
};

test("1. exactly eight DKL-3:3 files exist", () => {
  assert.equal(DKL33_FILES.length, 8);
  for (const file of DKL33_FILES) {
    assert.ok(readdirSync(HERE).includes(file), `missing ${file}`);
  }
});

test("2. model module has exactly eight runtime exports", () => {
  assert.deepEqual(Object.keys(modelApi).sort(), [
    "DataUnderstandingCandidateModel",
    "DataUnderstandingEvidenceModel",
    "DataUnderstandingModel",
    "DataUnderstandingModelIdentity",
    "DataUnderstandingModelManifest",
    "DataUnderstandingModelVersion",
    "DataUnderstandingRelationshipModel",
    "DataUnderstandingSnapshotModel",
  ]);
});

test("3. no exported functions; public API is immutable models only", () => {
  for (const [name, value] of Object.entries(modelApi)) {
    assert.notEqual(typeof value, "function", `${name} must not be a function`);
  }
});

test("4. model identity is stable", () => {
  assert.equal(DataUnderstandingModelIdentity.modelId, "DKL-3:3/DataUnderstandingModel");
  assert.equal(DataUnderstandingModelIdentity.sourcePhase, "DKL-3:3");
  assert.equal(DataUnderstandingModelIdentity.status, "ModelComplete");
  assert.equal(DataUnderstandingModelIdentity.readiness, "ReadyForValidation");
  assert.equal(DataUnderstandingModelVersion, "1.0.0");
  assert.equal(
    DataUnderstandingModelIdentity.modelNamespace,
    "nexora.dkl.data-understanding.model",
  );
});

test("5. all required model kinds are present", () => {
  assert.equal(DataUnderstandingModel.modelKindCount, 17);
  for (const kind of [
    "UnderstandingSubject",
    "UnderstandingCandidate",
    "UnderstandingEvidence",
    "UnderstandingRelationship",
    "UnderstandingSnapshot",
    "UnderstandingContext",
    "UnderstandingAmbiguity",
    "UnderstandingClarification",
    "UnderstandingConfidence",
    "UnderstandingScope",
    "UnderstandingLifecycle",
    "UnderstandingProcessingPolicy",
    "UnderstandingResult",
    "ValidationSummaryReference",
    "PipelineReference",
    "RegistryReference",
    "FoundationReference",
  ]) {
    assert.ok(DataUnderstandingModel.modelKinds.includes(kind), kind);
  }
});

test("6. candidate model is complete and forbids Business Objects", () => {
  assert.equal(DataUnderstandingCandidateModel.modelKind, "UnderstandingCandidate");
  assert.ok(DataUnderstandingCandidateModel.fieldCount >= 15);
  assert.deepEqual(DataUnderstandingCandidateModel.allowedCandidateTypes, [
    ...DataUnderstandingContracts.candidateTypes,
  ]);
  assert.deepEqual(DataUnderstandingCandidateModel.allowedCandidateStatuses, [
    ...DataUnderstandingContracts.candidateStatuses,
  ]);
  assert.equal(
    DataUnderstandingCandidateModel.registry.candidateTypeCount,
    DataUnderstandingCandidateRegistry.candidateTypeCount,
  );
  assert.ok(DataUnderstandingCandidateModel.forbiddenContents.includes("BusinessObject"));
  assert.ok(DataUnderstandingCandidateModel.forbiddenContents.includes("KnowledgeNode"));
  assert.ok(DataUnderstandingCandidateModel.forbiddenContents.includes("AIResult"));
  assert.equal(DataUnderstandingCandidateModel.boundaries.businessObjectForbidden, true);
});

test("7. evidence model requires limitations and forbids runtime calculation", () => {
  assert.equal(DataUnderstandingEvidenceModel.limitationsRequired, true);
  assert.equal(DataUnderstandingEvidenceModel.runtimeCalculationForbidden, true);
  assert.deepEqual(DataUnderstandingEvidenceModel.allowedCategories, [
    ...DataUnderstandingEvidenceCatalog.categories,
  ]);
  assert.equal(
    DataUnderstandingEvidenceModel.registry.evidenceCategoryCount,
    DataUnderstandingEvidenceRegistry.entryCount,
  );
  assert.deepEqual(DataUnderstandingEvidenceModel.allowedPriorityTiers, [
    ...DataUnderstandingEvidenceRegistry.priorityTiers,
  ]);
});

test("8. relationship model kinds are provisional only", () => {
  assert.deepEqual(DataUnderstandingRelationshipModel.relationshipKinds, [
    "supports",
    "suggests",
    "belongsToSubject",
    "derivedFrom",
    "references",
    "requiresClarification",
  ]);
  assert.equal(DataUnderstandingRelationshipModel.relationshipKindCount, 6);
  assert.ok(
    DataUnderstandingRelationshipModel.forbiddenMeanings.includes("KnowledgeGraphEdges"),
  );
  assert.ok(
    DataUnderstandingRelationshipModel.forbiddenMeanings.includes("BusinessRelationships"),
  );
});

test("9. snapshot and result models contain required sections only", () => {
  assert.ok(DataUnderstandingSnapshotModel.snapshotSectionCount >= 16);
  assert.ok(DataUnderstandingSnapshotModel.resultFieldCount >= 12);
  assert.deepEqual(DataUnderstandingSnapshotModel.allowedScopes, [
    ...DataUnderstandingContracts.understandingScopes,
  ]);
  assert.deepEqual(DataUnderstandingSnapshotModel.allowedResultStatuses, [
    ...DataUnderstandingContracts.resultStatuses,
  ]);
  assert.ok(DataUnderstandingSnapshotModel.forbiddenOutputs.includes("BusinessObjects"));
  assert.ok(DataUnderstandingSnapshotModel.forbiddenOutputs.includes("KnowledgeGraph"));
  assert.equal(DataUnderstandingModel.result.readiness, "ReadyForValidation");
});

test("10. subject/ambiguity/clarification/confidence/scope/lifecycle consistent with foundation and registry", () => {
  assert.deepEqual(DataUnderstandingModel.subject.allowedSubjectKinds, [
    ...DataUnderstandingContracts.subjectKinds,
  ]);
  assert.equal(
    DataUnderstandingModel.subject.registrySubjectCount,
    DataUnderstandingSubjectRegistry.entryCount,
  );
  assert.deepEqual(DataUnderstandingModel.ambiguity.allowedAmbiguityLevels, [
    ...DataUnderstandingContracts.ambiguityLevels,
  ]);
  assert.deepEqual(DataUnderstandingModel.clarification.allowedStatuses, [
    ...DataUnderstandingContracts.clarificationStatuses,
  ]);
  assert.deepEqual(DataUnderstandingModel.confidence.allowedConfidenceLevels, [
    ...DataUnderstandingContracts.confidenceLevels,
  ]);
  assert.equal(DataUnderstandingModel.confidence.floatingPointForbidden, true);
  assert.deepEqual(DataUnderstandingModel.scope.allowedScopes, [
    ...DataUnderstandingContracts.understandingScopes,
  ]);
  assert.deepEqual(DataUnderstandingModel.lifecycle.allowedStates, [
    ...DataUnderstandingLifecycle.states,
  ]);
  assert.equal(
    DataUnderstandingModel.processingPolicy.policies,
    DataUnderstandingContracts.processingPolicies,
  );
});

test("11. foundation, registry, and pipeline references are consistent", () => {
  assert.equal(DataUnderstandingModel.foundationReference.sourcePhase, "DKL-3:1");
  assert.equal(DataUnderstandingModel.foundationReference.readiness, "ReadyForRegistry");
  assert.equal(DataUnderstandingModel.registryReference.sourcePhase, "DKL-3:2");
  assert.equal(DataUnderstandingModel.registryReference.readiness, "ReadyForModel");
  assert.equal(DataUnderstandingModel.pipelineReference.targetPlatform, "DKL-3");
  assert.equal(DataUnderstandingModel.pipelineReference.readiness, "ReadyForDKL3Intake");
  assert.equal(DataUnderstandingModel.pipelineReference.previewOnlyRequired, true);
  assert.equal(
    DataUnderstandingModel.validationSummaryReference.validationPhase,
    "DKL-3:4",
  );
  assert.equal(
    DataUnderstandingModel.validationSummaryReference.readyForBusinessObjects,
    false,
  );
});

test("12. manifest counts match model schemas", () => {
  const m = DataUnderstandingModelManifest;
  assert.equal(m.modelKindCount, DataUnderstandingModel.modelKindCount);
  assert.equal(
    m.relationshipKindCount,
    DataUnderstandingRelationshipModel.relationshipKindCount,
  );
  assert.equal(m.candidateFieldCount, DataUnderstandingCandidateModel.fieldCount);
  assert.equal(m.evidenceFieldCount, DataUnderstandingEvidenceModel.fieldCount);
  assert.equal(m.snapshotSectionCount, DataUnderstandingSnapshotModel.snapshotSectionCount);
  assert.equal(m.resultFieldCount, DataUnderstandingSnapshotModel.resultFieldCount);
  assert.equal(m.readiness, "ReadyForValidation");
  assert.equal(m.nextPhase, "DKL-3:4");
});

test("13. ownership and boundaries are correct", () => {
  assert.ok(DataUnderstandingModel.ownership.owns.length >= 11);
  assert.ok(DataUnderstandingModel.ownership.doesNotOwn.length >= 15);
  assert.equal(DataUnderstandingModel.boundaries.createsBusinessObjects, false);
  assert.equal(DataUnderstandingModel.boundaries.createsKnowledgeGraph, false);
  assert.equal(DataUnderstandingModel.boundaries.persistsDataset, false);
  assert.equal(DataUnderstandingModel.boundaries.executesAiModels, false);
  assert.equal(DataUnderstandingModel.boundaries.executesEngineReasoning, false);
  assert.equal(DataUnderstandingCandidateModel.ownership.sourcePhase, "DKL-3:3");
  assert.equal(DataUnderstandingEvidenceModel.boundaries.persistenceForbidden, true);
});

test("14. dependencies limited to DKL-2 Public Index, DKL-3:1, DKL-3:2, Pipeline platform", () => {
  for (const file of DKL33_FILES.filter((f) => !f.endsWith(".test.ts"))) {
    const text = readFileSync(join(HERE, file), "utf8");
    const imports = [...text.matchAll(/from\s+["']([^"']+)["']/g)].map((m) => m[1]!);
    for (const spec of imports) {
      const allowed =
        spec.includes("dataUnderstanding") ||
        /dataSourceKnowledgeRegistryPublicIndex\.ts$/.test(spec) ||
        /pipelineUnderstandingPlatform\.ts$/.test(spec);
      assert.ok(allowed, `${file} imports forbidden module: ${spec}`);
    }
    assert.equal(/from\s+["'][^"']*dkl-4/i.test(text), false, file);
    assert.equal(/from\s+["'][^"']*\/engine\//i.test(text), false, file);
    assert.equal(/from\s+["'][^"']*\/scene\//i.test(text), false, file);
    assert.equal(/from\s+["'][^"']*\/persistence/i.test(text), false, file);
  }
  assert.equal(DataUnderstandingModel.dependencies.dkl31Foundation.readyForRegistry, true);
  assert.equal(DataUnderstandingModel.dependencies.dkl32Registry.readyForModel, true);
  assert.equal(
    DataUnderstandingModel.dependencies.pipelineUnderstandingPlatform.readyForDKL3Intake,
    true,
  );
  assert.equal(DataUnderstandingRegistry.readiness.ReadyForModel, true);
});

test("15. all models are deeply frozen", () => {
  assert.equal(isDeeplyFrozen(DataUnderstandingModel), true);
  assert.equal(isDeeplyFrozen(DataUnderstandingCandidateModel), true);
  assert.equal(isDeeplyFrozen(DataUnderstandingEvidenceModel), true);
  assert.equal(isDeeplyFrozen(DataUnderstandingRelationshipModel), true);
  assert.equal(isDeeplyFrozen(DataUnderstandingSnapshotModel), true);
  assert.equal(isDeeplyFrozen(DataUnderstandingModelManifest), true);
  assert.equal(isDeeplyFrozen(DataUnderstandingModelIdentity), true);
});

test("16. no runtime behavior: no classes, async, promises, randomness, clock, env, uuid", () => {
  for (const file of DKL33_FILES.filter((f) => !f.endsWith(".test.ts"))) {
    const text = readFileSync(join(HERE, file), "utf8");
    assert.equal(/\bclass\s+\w+/.test(text), false, file);
    assert.equal(/\basync\s+function\b/.test(text), false, file);
    assert.equal(/\bnew\s+Promise\b/.test(text), false, file);
    assert.equal(/Math\.random|Date\.now|new Date\(|process\.env/.test(text), false, file);
    assert.equal(/\buuid\b|randomUUID/i.test(text), false, file);
  }
});

test("17. metadata-only declarations forbid semantic inference, BO, KG, persistence, AI, Engine", () => {
  const m = DataUnderstandingModelManifest;
  assert.equal(m.metadataOnly, true);
  assert.equal(m.modelOnly, true);
  assert.equal(m.semanticInferencePerformed, false);
  assert.equal(m.businessObjectsCreated, false);
  assert.equal(m.knowledgeGraphCreated, false);
  assert.equal(m.persistencePerformed, false);
  assert.equal(m.aiExecuted, false);
  assert.equal(m.engineReasoningPerformed, false);
  assert.equal(DataUnderstandingModel.readiness.SemanticInferenceForbidden, true);
  assert.equal(DataUnderstandingModel.readiness.BusinessObjectCreationForbidden, true);
  assert.equal(DataUnderstandingModel.readiness.KnowledgeGraphForbidden, true);
  assert.equal(DataUnderstandingModel.readiness.PersistenceForbidden, true);
  assert.equal(DataUnderstandingModel.readiness.AIFree, true);
  assert.equal(DataUnderstandingModel.readiness.EngineFree, true);
});

test("18. registry and foundation consistency for nested model references", () => {
  assert.equal(
    DataUnderstandingModel.candidate,
    DataUnderstandingCandidateModel,
  );
  assert.equal(DataUnderstandingModel.evidence, DataUnderstandingEvidenceModel);
  assert.equal(DataUnderstandingModel.relationship, DataUnderstandingRelationshipModel);
  assert.equal(DataUnderstandingModel.snapshot, DataUnderstandingSnapshotModel);
  assert.equal(DataUnderstandingModel.manifest, DataUnderstandingModelManifest);
  assert.equal(
    DataUnderstandingCandidateModel.registry.candidatesAreNotBusinessObjects,
    true,
  );
  assert.equal(
    DataUnderstandingEvidenceModel.registry.evidenceNeverCalculatedHere,
    true,
  );
});

test("19. repeated model access is deterministic", () => {
  const a = JSON.stringify(DataUnderstandingModelManifest);
  const b = JSON.stringify(DataUnderstandingModelManifest);
  assert.equal(a, b);
  assert.equal(
    DataUnderstandingModel.identity,
    DataUnderstandingModelIdentity,
  );
});

test("20. readiness reports ReadyForValidation and next phase DKL-3:4", () => {
  assert.equal(DataUnderstandingModel.readiness.ReadyForValidation, true);
  assert.equal(DataUnderstandingModel.readiness.ModelComplete, true);
  assert.equal(
    DataUnderstandingModel.nextPhase,
    "DKL-3:4 — Data Understanding Validation",
  );
});
