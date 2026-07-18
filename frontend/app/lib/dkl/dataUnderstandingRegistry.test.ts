/**
 * DKL-3:2 — Data Understanding Registry Tests.
 *
 * Deterministic coverage for the immutable registry layer.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import * as registryApi from "./dataUnderstandingRegistry.ts";
import {
  DataUnderstandingRegistry,
  DataUnderstandingSubjectRegistry,
  DataUnderstandingCandidateRegistry,
  DataUnderstandingEvidenceRegistry,
  DataUnderstandingClarificationRegistry,
  DataUnderstandingRegistryManifest,
  DataUnderstandingRegistryVersion,
  DataUnderstandingRegistryIdentity,
} from "./dataUnderstandingRegistry.ts";
import {
  DataUnderstandingContracts,
  DataUnderstandingEvidenceCatalog,
  DataUnderstandingLifecycle,
} from "./dataUnderstandingFoundation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL32_FILES = [
  "dataUnderstandingRegistryTypes.ts",
  "dataUnderstandingSubjectRegistry.ts",
  "dataUnderstandingCandidateRegistry.ts",
  "dataUnderstandingEvidenceRegistry.ts",
  "dataUnderstandingClarificationRegistry.ts",
  "dataUnderstandingRegistryManifest.ts",
  "dataUnderstandingRegistry.ts",
  "dataUnderstandingRegistry.test.ts",
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

const collectEntryIds = (): string[] => {
  const ids: string[] = [];
  const push = (entries: readonly { identity: { registryEntryId: string } }[]) => {
    for (const entry of entries) {
      ids.push(entry.identity.registryEntryId);
    }
  };
  push(DataUnderstandingSubjectRegistry.entries);
  push(DataUnderstandingCandidateRegistry.candidateTypes);
  push(DataUnderstandingCandidateRegistry.candidateStatuses);
  push(DataUnderstandingCandidateRegistry.confidenceLevels);
  push(DataUnderstandingEvidenceRegistry.entries);
  push(DataUnderstandingClarificationRegistry.clarificationTypes);
  push(DataUnderstandingClarificationRegistry.clarificationStatuses);
  push(DataUnderstandingClarificationRegistry.resolutionStates);
  push(DataUnderstandingRegistry.ambiguityLevels.entries);
  push(DataUnderstandingRegistry.lifecycleStates.entries);
  push(DataUnderstandingRegistry.understandingScopes.entries);
  push(DataUnderstandingRegistry.resultStatuses.entries);
  push(DataUnderstandingRegistry.validationResultStatuses.entries);
  push(DataUnderstandingRegistry.processingPolicies.entries);
  push(DataUnderstandingRegistry.publicApis.entries);
  return ids;
};

test("1. exactly eight DKL-3:2 files exist", () => {
  assert.equal(DKL32_FILES.length, 8);
  for (const file of DKL32_FILES) {
    assert.ok(readdirSync(HERE).includes(file), `missing ${file}`);
  }
});

test("2. registry module has exactly eight runtime exports", () => {
  assert.deepEqual(Object.keys(registryApi).sort(), [
    "DataUnderstandingCandidateRegistry",
    "DataUnderstandingClarificationRegistry",
    "DataUnderstandingEvidenceRegistry",
    "DataUnderstandingRegistry",
    "DataUnderstandingRegistryIdentity",
    "DataUnderstandingRegistryManifest",
    "DataUnderstandingRegistryVersion",
    "DataUnderstandingSubjectRegistry",
  ]);
});

test("3. registry identity is stable", () => {
  assert.equal(DataUnderstandingRegistryIdentity.registryId, "DKL-3:2/DataUnderstandingRegistry");
  assert.equal(DataUnderstandingRegistryIdentity.sourcePhase, "DKL-3:2");
  assert.equal(DataUnderstandingRegistryIdentity.status, "RegistryComplete");
  assert.equal(DataUnderstandingRegistryIdentity.readiness, "ReadyForModel");
  assert.equal(DataUnderstandingRegistryVersion, "1.0.0");
  assert.equal(
    DataUnderstandingRegistryIdentity.registryNamespace,
    "nexora.dkl.data-understanding.registry",
  );
});

test("4. exactly seven subjects registered, matching DKL-3:1", () => {
  assert.equal(DataUnderstandingSubjectRegistry.entryCount, 7);
  assert.deepEqual(
    DataUnderstandingSubjectRegistry.entries.map((e) => e.subjectKind),
    [...DataUnderstandingContracts.subjectKinds],
  );
  for (const entry of DataUnderstandingSubjectRegistry.entries) {
    assert.match(entry.identity.registryEntryId, /^du-subject-/);
    assert.ok(entry.description.length > 0);
  }
});

test("5. every DKL-3:1 candidate type and status is registered", () => {
  assert.deepEqual(
    DataUnderstandingCandidateRegistry.candidateTypes.map((e) => e.candidateType),
    [...DataUnderstandingContracts.candidateTypes],
  );
  assert.deepEqual(
    DataUnderstandingCandidateRegistry.candidateStatuses.map((e) => e.candidateStatus),
    [...DataUnderstandingContracts.candidateStatuses],
  );
  for (const entry of DataUnderstandingCandidateRegistry.candidateTypes) {
    assert.equal(entry.provisional, true);
    assert.equal(entry.isBusinessObject, false);
  }
  assert.equal(DataUnderstandingCandidateRegistry.noInferencePerformed, true);
});

test("6. confidence levels registered with ordinals and no guaranteed truth", () => {
  assert.equal(DataUnderstandingCandidateRegistry.confidenceLevelCount, 5);
  DataUnderstandingCandidateRegistry.confidenceLevels.forEach((entry, index) => {
    assert.equal(entry.ordinal, index);
    assert.equal(entry.guaranteedTruth, false);
  });
});

test("7. all evidence categories registered with limitations and priority tiers", () => {
  assert.equal(
    DataUnderstandingEvidenceRegistry.entryCount,
    DataUnderstandingEvidenceCatalog.categories.length,
  );
  assert.equal(DataUnderstandingEvidenceRegistry.entryCount, 15);
  for (const entry of DataUnderstandingEvidenceRegistry.entries) {
    assert.equal(entry.limitationsRequired, true);
    assert.ok(entry.exampleLimitation.length > 0);
    assert.ok(["Primary", "Secondary", "Contextual"].includes(entry.priorityTier));
    assert.match(entry.identity.registryEntryId, /^du-evidence-/);
  }
  assert.equal(DataUnderstandingEvidenceRegistry.evidenceNeverCalculatedHere, true);
  assert.deepEqual(DataUnderstandingEvidenceRegistry.priorityTiers, [
    "Primary",
    "Secondary",
    "Contextual",
  ]);
});

test("8. clarification types, statuses, and resolution states registered", () => {
  assert.equal(DataUnderstandingClarificationRegistry.clarificationTypeCount, 6);
  assert.deepEqual(
    DataUnderstandingClarificationRegistry.clarificationStatuses.map(
      (e) => e.clarificationStatus,
    ),
    [...DataUnderstandingContracts.clarificationStatuses],
  );
  assert.equal(DataUnderstandingClarificationRegistry.resolutionStateCount, 4);
  const unresolved = DataUnderstandingClarificationRegistry.resolutionStates.find(
    (e) => e.resolutionState === "Unresolved",
  );
  assert.equal(unresolved?.terminal, false);
  assert.equal(
    DataUnderstandingClarificationRegistry.policies.clarificationEngineForbidden,
    true,
  );
  assert.equal(
    DataUnderstandingClarificationRegistry.policies.requireClarificationForBlockingAmbiguity,
    true,
  );
});

test("9. ambiguity, lifecycle, scope, result, validation, and policy registries are complete", () => {
  assert.equal(DataUnderstandingRegistry.ambiguityLevels.entryCount, 5);
  const blocking = DataUnderstandingRegistry.ambiguityLevels.entries.find(
    (e) => e.ambiguityLevel === "Blocking",
  );
  assert.equal(blocking?.blocking, true);

  assert.equal(DataUnderstandingRegistry.lifecycleStates.entryCount, 11);
  assert.deepEqual(
    DataUnderstandingRegistry.lifecycleStates.entries.map((e) => e.state),
    [...DataUnderstandingLifecycle.states],
  );

  assert.equal(DataUnderstandingRegistry.understandingScopes.entryCount, 4);
  assert.equal(DataUnderstandingRegistry.resultStatuses.entryCount, 6);
  assert.equal(DataUnderstandingRegistry.validationResultStatuses.entryCount, 3);
  assert.equal(
    DataUnderstandingRegistry.processingPolicies.entryCount,
    Object.keys(DataUnderstandingContracts.processingPolicies).length,
  );
});

test("10. public API registry lists exactly the eight exports", () => {
  assert.equal(DataUnderstandingRegistry.publicApis.entryCount, 8);
  assert.deepEqual(
    DataUnderstandingRegistry.publicApis.entries.map((e) => e.apiName).sort(),
    Object.keys(registryApi).sort(),
  );
});

test("11. manifest counts match actual registries", () => {
  const m = DataUnderstandingRegistryManifest;
  assert.equal(m.subjectCount, DataUnderstandingSubjectRegistry.entryCount);
  assert.equal(m.candidateTypeCount, DataUnderstandingCandidateRegistry.candidateTypeCount);
  assert.equal(m.candidateStatusCount, DataUnderstandingCandidateRegistry.candidateStatusCount);
  assert.equal(m.evidenceCategoryCount, DataUnderstandingEvidenceRegistry.entryCount);
  assert.equal(m.evidencePriorityTierCount, DataUnderstandingEvidenceRegistry.priorityTierCount);
  assert.equal(m.confidenceLevelCount, DataUnderstandingCandidateRegistry.confidenceLevelCount);
  assert.equal(m.ambiguityLevelCount, DataUnderstandingRegistry.ambiguityLevels.entryCount);
  assert.equal(
    m.clarificationTypeCount,
    DataUnderstandingClarificationRegistry.clarificationTypeCount,
  );
  assert.equal(
    m.clarificationStatusCount,
    DataUnderstandingClarificationRegistry.clarificationStatusCount,
  );
  assert.equal(
    m.clarificationResolutionStateCount,
    DataUnderstandingClarificationRegistry.resolutionStateCount,
  );
  assert.equal(m.processingPolicyCount, DataUnderstandingRegistry.processingPolicies.entryCount);
  assert.equal(m.lifecycleStateCount, DataUnderstandingRegistry.lifecycleStates.entryCount);
  assert.equal(m.understandingScopeCount, DataUnderstandingRegistry.understandingScopes.entryCount);
  assert.equal(m.resultStatusCount, DataUnderstandingRegistry.resultStatuses.entryCount);
  assert.equal(
    m.validationResultStatusCount,
    DataUnderstandingRegistry.validationResultStatuses.entryCount,
  );
  assert.equal(m.publicApiCount, DataUnderstandingRegistry.publicApis.entryCount);
  assert.equal(m.readiness, "ReadyForModel");
  assert.equal(m.nextPhase, "DKL-3:3");
});

test("12. no duplicate registry entry identifiers", () => {
  const ids = collectEntryIds();
  assert.equal(new Set(ids).size, ids.length);
  for (const id of ids) {
    assert.match(id, /^du-[a-z0-9-]+$/);
  }
});

test("13. all registries are deeply frozen", () => {
  assert.equal(isDeeplyFrozen(DataUnderstandingRegistry), true);
  assert.equal(isDeeplyFrozen(DataUnderstandingSubjectRegistry), true);
  assert.equal(isDeeplyFrozen(DataUnderstandingCandidateRegistry), true);
  assert.equal(isDeeplyFrozen(DataUnderstandingEvidenceRegistry), true);
  assert.equal(isDeeplyFrozen(DataUnderstandingClarificationRegistry), true);
  assert.equal(isDeeplyFrozen(DataUnderstandingRegistryManifest), true);
  assert.equal(isDeeplyFrozen(DataUnderstandingRegistryIdentity), true);
});

test("14. dependencies limited to DKL-2 Public Index, DKL-3:1, and Pipeline platform", () => {
  for (const file of DKL32_FILES.filter((f) => !f.endsWith(".test.ts"))) {
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
  assert.equal(DataUnderstandingRegistry.dependencies.dkl31Foundation.readyForRegistry, true);
  assert.equal(
    DataUnderstandingRegistry.dependencies.pipelineUnderstandingPlatform.readyForDKL3Intake,
    true,
  );
  assert.equal(DataUnderstandingRegistry.dependencies.dkl2PublicIndex.version, "1.0.0");
});

test("15. ownership and boundaries are registered from DKL-3:1", () => {
  assert.ok(DataUnderstandingRegistry.ownership.owns.length >= 11);
  assert.ok(DataUnderstandingRegistry.ownership.doesNotOwn.length >= 15);
  assert.equal(DataUnderstandingRegistry.boundaries.createsBusinessObjects, false);
  assert.equal(DataUnderstandingRegistry.boundaries.persistsDataset, false);
  assert.equal(DataUnderstandingRegistry.boundaries.executesAiModels, false);
  assert.equal(DataUnderstandingRegistry.boundaries.executesEngineReasoning, false);
  assert.equal(DataUnderstandingRegistry.boundaries.rendersUi, false);
});

test("16. registry declares metadata-only, registry-only, and forbidden processing", () => {
  const m = DataUnderstandingRegistryManifest;
  assert.equal(m.metadataOnly, true);
  assert.equal(m.registryOnly, true);
  assert.equal(m.deterministic, true);
  assert.equal(m.immutable, true);
  assert.equal(m.semanticUnderstandingPerformed, false);
  assert.equal(m.candidateGenerationPerformed, false);
  assert.equal(m.businessObjectsCreated, false);
  assert.equal(m.persistencePerformed, false);
  assert.equal(m.aiExecuted, false);
  assert.equal(m.engineReasoningPerformed, false);
});

test("17. no runtime behavior: no classes, async, promises, randomness, clock, env, uuid", () => {
  for (const file of DKL32_FILES.filter((f) => !f.endsWith(".test.ts"))) {
    const text = readFileSync(join(HERE, file), "utf8");
    assert.equal(/\bclass\s+\w+/.test(text), false, file);
    assert.equal(/\basync\s+function\b/.test(text), false, file);
    assert.equal(/\bnew\s+Promise\b/.test(text), false, file);
    assert.equal(/Math\.random|Date\.now|new Date\(|process\.env/.test(text), false, file);
    assert.equal(/\buuid\b|randomUUID/i.test(text), false, file);
  }
});

test("18. no helper functions exported from the registry module", () => {
  for (const [name, value] of Object.entries(registryApi)) {
    assert.notEqual(typeof value, "function", `${name} must not be a function`);
  }
});

test("19. registry access is deterministic across repeated reads", () => {
  const a = JSON.stringify(DataUnderstandingRegistryManifest);
  const b = JSON.stringify(DataUnderstandingRegistryManifest);
  assert.equal(a, b);
  assert.equal(DataUnderstandingRegistry.subjects, DataUnderstandingSubjectRegistry);
  assert.equal(DataUnderstandingRegistry.manifest, DataUnderstandingRegistryManifest);
});

test("20. readiness reports ReadyForModel and next phase DKL-3:3", () => {
  assert.equal(DataUnderstandingRegistry.readiness.ReadyForModel, true);
  assert.equal(DataUnderstandingRegistry.readiness.RegistryComplete, true);
  assert.equal(DataUnderstandingRegistry.readiness.AIFree, true);
  assert.equal(DataUnderstandingRegistry.readiness.EngineFree, true);
  assert.equal(DataUnderstandingRegistry.readiness.BusinessObjectCreationForbidden, true);
  assert.equal(DataUnderstandingRegistry.readiness.PersistenceForbidden, true);
  assert.equal(DataUnderstandingRegistry.nextPhase, "DKL-3:3 — Data Understanding Model");
});
