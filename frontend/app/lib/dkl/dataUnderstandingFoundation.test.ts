/**
 * DKL-3:1 — Data Understanding Foundation Tests.
 *
 * Deterministic coverage for the Data Understanding architectural foundation.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import * as foundationApi from "./dataUnderstandingFoundation.ts";
import {
  DataUnderstandingFoundation,
  DataUnderstandingContracts,
  DataUnderstandingOwnership,
  DataUnderstandingBoundaries,
  DataUnderstandingLifecycle,
  DataUnderstandingEvidenceCatalog,
  DataUnderstandingFoundationVersion,
  validateDataUnderstandingFoundationInput,
} from "./dataUnderstandingFoundation.ts";
import {
  DATA_UNDERSTANDING_PROCESSING_POLICIES,
} from "./dataUnderstandingContracts.ts";
import type {
  DataUnderstandingFoundationInput,
  PipelineIntakePackageView,
} from "./dataUnderstandingFoundationTypes.ts";
import { DATA_UNDERSTANDING_DEFINITION } from "./dataUnderstandingFoundationTypes.ts";
import { PipelineUnderstandingPlatform } from "../pipeline/pipelineUnderstandingPlatform.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL31_FILES = [
  "dataUnderstandingFoundationTypes.ts",
  "dataUnderstandingContracts.ts",
  "dataUnderstandingOwnership.ts",
  "dataUnderstandingBoundaries.ts",
  "dataUnderstandingLifecycle.ts",
  "dataUnderstandingEvidence.ts",
  "dataUnderstandingFoundation.ts",
  "dataUnderstandingFoundation.test.ts",
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

const basePackage = (
  overrides: Partial<{
    tenantId: string;
    workspaceId: string;
    sessionId: string;
    datasetId: string;
    confirmed: boolean;
    reviewConfirmed: boolean;
    contractValid: boolean;
    readyForDKL3Intake: boolean;
    sourceReferencesValid: boolean;
    dataScope: string;
    previewOnly: boolean;
    selectedColumnKeys: readonly string[];
    columns: readonly { key: string; index: number }[];
    hasBlockingIssues: boolean;
    blockingCount: number;
    blockingIssueCount: number;
    sourceRegistryId: string;
  }> = {},
): PipelineIntakePackageView => {
  const columns = overrides.columns ?? Object.freeze([
    Object.freeze({ key: "customer_name", index: 0 }),
    Object.freeze({ key: "revenue", index: 1 }),
  ]);
  const selectedColumnKeys =
    overrides.selectedColumnKeys ?? Object.freeze(columns.map((c) => c.key));
  return Object.freeze({
    identity: Object.freeze({
      intakeId: "intake:session-dkl3:dataset-dkl3:handoff:session-dkl3:dataset-dkl3",
      contractVersion: "1.0.0",
      tenantId: overrides.tenantId ?? "tenant-dkl3",
      workspaceId: overrides.workspaceId ?? "workspace-dkl3",
      sessionId: overrides.sessionId ?? "session-dkl3",
      datasetId: overrides.datasetId ?? "dataset-dkl3",
      handoffId: "handoff:session-dkl3:dataset-dkl3",
      sourcePhase: "UI-PIPE-1:3",
      targetPhase: "DKL-3",
    }),
    source: Object.freeze({
      sourceMode: "CsvText",
      sourceName: "sales.csv",
      sourceRegistryId: overrides.sourceRegistryId ?? "dsk-datasource-csv",
      connectorRegistryId: "dsk-connector-type-file-upload",
      contentTypeRegistryId: "dsk-content-type-tabular",
      dklRegistryVersion: "1.0.0",
    }),
    dataset: Object.freeze({
      datasetName: "sales.csv",
      dataScope: overrides.dataScope ?? "PreviewOnly",
      columnCount: columns.length,
      selectedColumnCount: selectedColumnKeys.length,
      parseStatus: "Parsed",
    }),
    columns,
    diagnostics: Object.freeze({
      hasBlockingIssues: overrides.hasBlockingIssues ?? false,
      diagnosticCounts: Object.freeze({
        blocking: overrides.blockingCount ?? 0,
        total: overrides.blockingCount ?? 0,
      }),
    }),
    review: Object.freeze({
      confirmed: overrides.confirmed ?? true,
      selectedColumnKeys,
      readyForUnderstanding: overrides.confirmed ?? true,
    }),
    boundaries: Object.freeze({
      previewOnly: overrides.previewOnly ?? true,
    }),
    readiness: Object.freeze({
      contractValid: overrides.contractValid ?? true,
      readyForDKL3Intake: overrides.readyForDKL3Intake ?? true,
      reviewConfirmed: overrides.reviewConfirmed ?? true,
      sourceReferencesValid: overrides.sourceReferencesValid ?? true,
      blockingIssueCount: overrides.blockingIssueCount ?? overrides.blockingCount ?? 0,
    }),
  });
};

const baseInput = (
  packageOverrides?: Parameters<typeof basePackage>[0],
  inputOverrides: Partial<DataUnderstandingFoundationInput> = {},
): DataUnderstandingFoundationInput =>
  Object.freeze({
    intakePackage: basePackage(packageOverrides),
    requestedUnderstandingScope: "DatasetAndSelectedColumns",
    requestedSubjectIds: Object.freeze(["dataset-dkl3", "customer_name"]),
    consumerContext: Object.freeze({
      consumerId: "dkl-3:1-test",
      consumerPhase: "DKL-3:1",
      tenantId: "tenant-dkl3",
      workspaceId: "workspace-dkl3",
      sessionId: "session-dkl3",
    }),
    processingPolicy: DATA_UNDERSTANDING_PROCESSING_POLICIES,
    ...inputOverrides,
  });

test("1. exactly eight DKL-3:1 files exist", () => {
  assert.equal(DKL31_FILES.length, 8);
  for (const file of DKL31_FILES) {
    assert.ok(readdirSync(HERE).includes(file), `missing ${file}`);
  }
});

test("2. foundation module has exactly eight runtime exports", () => {
  assert.deepEqual(Object.keys(foundationApi).sort(), [
    "DataUnderstandingBoundaries",
    "DataUnderstandingContracts",
    "DataUnderstandingEvidenceCatalog",
    "DataUnderstandingFoundation",
    "DataUnderstandingFoundationVersion",
    "DataUnderstandingLifecycle",
    "DataUnderstandingOwnership",
    "validateDataUnderstandingFoundationInput",
  ]);
});

test("3. DKL-2 is consumed only through its Public Index", () => {
  for (const file of DKL31_FILES.filter((f) => !f.endsWith(".test.ts"))) {
    const text = readFileSync(join(HERE, file), "utf8");
    const dklImports = [...text.matchAll(/from\s+["']([^"']*dkl[^"']*)["']/g)].map((m) => m[1]!);
    for (const spec of dklImports) {
      if (spec.includes("dataUnderstanding")) {
        continue;
      }
      assert.match(spec, /dataSourceKnowledgeRegistryPublicIndex\.ts$/);
    }
  }
});

test("4. Pipeline intake is consumed only through its canonical platform", () => {
  for (const file of DKL31_FILES.filter((f) => !f.endsWith(".test.ts"))) {
    const text = readFileSync(join(HERE, file), "utf8");
    const pipelineImports = [...text.matchAll(/from\s+["']([^"']*pipeline[^"']*)["']/g)].map(
      (m) => m[1]!,
    );
    for (const spec of pipelineImports) {
      assert.match(spec, /pipelineUnderstandingPlatform\.ts$/);
    }
  }
  assert.equal(PipelineUnderstandingPlatform.readiness.ReadyForDKL3Intake, true);
});

test("5. foundation identity is stable", () => {
  assert.equal(DataUnderstandingFoundation.identity.sourcePhase, "DKL-3:1");
  assert.equal(DataUnderstandingFoundation.identity.status, "FoundationComplete");
  assert.equal(DataUnderstandingFoundation.identity.readiness, "ReadyForRegistry");
  assert.equal(DataUnderstandingFoundationVersion, "1.0.0");
  assert.equal(
    DataUnderstandingFoundation.identity.foundationId,
    "DKL-3:1/DataUnderstandingFoundation",
  );
});

test("6-7. ownership declarations complete and do not overlap", () => {
  assert.ok(DataUnderstandingOwnership.owns.length >= 11);
  assert.ok(DataUnderstandingOwnership.doesNotOwn.length >= 15);
  const owns = new Set(DataUnderstandingOwnership.owns.map((s) => s.toLowerCase()));
  for (const forbidden of DataUnderstandingOwnership.doesNotOwn) {
    assert.equal(owns.has(forbidden.toLowerCase()), false, forbidden);
  }
});

test("8. exactly seven understanding subject kinds exist", () => {
  assert.equal(DataUnderstandingContracts.subjectKinds.length, 7);
  assert.deepEqual(DataUnderstandingContracts.subjectKinds, [
    "Dataset",
    "Column",
    "ValuePattern",
    "RowStructure",
    "RelationshipHint",
    "SourceContext",
    "DiagnosticContext",
  ]);
});

test("9-10. candidate statuses and types are defined", () => {
  assert.deepEqual(DataUnderstandingContracts.candidateStatuses, [
    "Proposed",
    "Supported",
    "Ambiguous",
    "Rejected",
    "Confirmed",
  ]);
  assert.ok(DataUnderstandingContracts.candidateTypes.includes("ColumnRole"));
  assert.ok(DataUnderstandingContracts.candidateTypes.includes("DatasetPurpose"));
  assert.ok(DataUnderstandingContracts.candidateTypes.includes("UnknownMeaning"));
  assert.equal(DataUnderstandingContracts.notes.candidatesAreNotBusinessObjects, true);
});

test("11-13. confidence, ambiguity, clarification models", () => {
  assert.equal(DataUnderstandingContracts.confidenceLevels.length, 5);
  assert.equal(DataUnderstandingContracts.ambiguityLevels.length, 5);
  assert.deepEqual(DataUnderstandingContracts.clarificationStatuses, [
    "Pending",
    "Answered",
    "Dismissed",
    "Resolved",
  ]);
  assert.equal(DataUnderstandingContracts.notes.floatingPointConfidenceForbidden, true);
});

test("14-15. evidence categories complete and require limitations", () => {
  assert.equal(DataUnderstandingEvidenceCatalog.categories.length, 15);
  assert.equal(DataUnderstandingEvidenceCatalog.limitationsRequired, true);
  assert.equal(
    DataUnderstandingEvidenceCatalog.entries.every((e) => e.limitationsRequired === true),
    true,
  );
  assert.ok(
    DataUnderstandingEvidenceCatalog.entries.some((e) =>
      e.exampleLimitation.includes("revenue"),
    ),
  );
});

test("16-17. input scopes and result statuses are correct", () => {
  assert.deepEqual(DataUnderstandingContracts.understandingScopes, [
    "DatasetOnly",
    "SelectedColumns",
    "DatasetAndSelectedColumns",
    "RelationshipHints",
  ]);
  assert.deepEqual(DataUnderstandingContracts.resultStatuses, [
    "NotStarted",
    "UnderstandingInProgress",
    "UnderstandingComplete",
    "UnderstandingWithAmbiguities",
    "Blocked",
    "Failed",
  ]);
});

test("18-20. eleven lifecycle states; valid succeed; invalid fail without throwing", () => {
  assert.equal(DataUnderstandingLifecycle.states.length, 11);
  for (const example of DataUnderstandingLifecycle.requiredExamples) {
    const result = DataUnderstandingLifecycle.transitionUnderstandingLifecycle(
      example.from,
      example.to,
    );
    assert.equal(result.ok, true, `${example.from} -> ${example.to}`);
  }
  assert.doesNotThrow(() => {
    const bad = DataUnderstandingLifecycle.transitionUnderstandingLifecycle(
      "Received",
      "Completed",
    );
    assert.equal(bad.ok, false);
    assert.equal(bad.failure?.code, "INVALID_LIFECYCLE_TRANSITION");
  });
});

test("21-25. policies forbid BO/persistence/AI/engine; preview-only required", () => {
  assert.equal(DATA_UNDERSTANDING_PROCESSING_POLICIES.previewOnlyInputRequired, true);
  assert.equal(DATA_UNDERSTANDING_PROCESSING_POLICIES.allowCanonicalBusinessObjects, false);
  assert.equal(DATA_UNDERSTANDING_PROCESSING_POLICIES.allowPersistence, false);
  assert.equal(DATA_UNDERSTANDING_PROCESSING_POLICIES.allowAiProviderCalls, false);
  assert.equal(DATA_UNDERSTANDING_PROCESSING_POLICIES.allowExecutiveReasoning, false);
  assert.equal(DataUnderstandingBoundaries.createsBusinessObjects, false);
  assert.equal(DataUnderstandingBoundaries.persistsDataset, false);
  assert.equal(DataUnderstandingBoundaries.executesAiModels, false);
  assert.equal(DataUnderstandingBoundaries.executesEngineReasoning, false);
});

test("26. valid intake passes foundation validation", () => {
  const result = validateDataUnderstandingFoundationInput(baseInput());
  assert.equal(result.valid, true);
  assert.equal(result.status, "Valid");
  assert.equal(result.readiness, "ReadyForRegistry");
  assert.equal(result.blockingIssueCount, 0);
});

test("27. missing intake fails validation", () => {
  const result = validateDataUnderstandingFoundationInput(
    baseInput(undefined, { intakePackage: null }),
  );
  assert.equal(result.valid, false);
  assert.ok(result.issues.some((i) => i.code === "MISSING_INTAKE"));
});

test("28. unconfirmed intake fails validation", () => {
  const result = validateDataUnderstandingFoundationInput(
    baseInput({ confirmed: false, reviewConfirmed: false, readyForDKL3Intake: false }),
  );
  assert.equal(result.valid, false);
  assert.ok(result.issues.some((i) => i.code === "INTAKE_UNCONFIRMED"));
});

test("29. blocking diagnostics fail validation", () => {
  const result = validateDataUnderstandingFoundationInput(
    baseInput({
      hasBlockingIssues: true,
      blockingCount: 1,
      blockingIssueCount: 1,
      readyForDKL3Intake: false,
    }),
  );
  assert.equal(result.valid, false);
  assert.ok(result.issues.some((i) => i.code === "BLOCKING_DIAGNOSTICS"));
});

test("30. zero selected columns fail validation", () => {
  const result = validateDataUnderstandingFoundationInput(
    baseInput({
      selectedColumnKeys: Object.freeze([]),
      columns: Object.freeze([]),
      readyForDKL3Intake: false,
    }),
  );
  assert.equal(result.valid, false);
  assert.ok(result.issues.some((i) => i.code === "ZERO_SELECTED_COLUMNS"));
});

test("31-34. tenant/workspace/session/dataset identity required", () => {
  assert.ok(
    validateDataUnderstandingFoundationInput(baseInput({ tenantId: "" })).issues.some(
      (i) => i.code === "MISSING_TENANT",
    ),
  );
  assert.ok(
    validateDataUnderstandingFoundationInput(baseInput({ workspaceId: "" })).issues.some(
      (i) => i.code === "MISSING_WORKSPACE",
    ),
  );
  assert.ok(
    validateDataUnderstandingFoundationInput(baseInput({ sessionId: "" })).issues.some(
      (i) => i.code === "MISSING_SESSION",
    ),
  );
  assert.ok(
    validateDataUnderstandingFoundationInput(baseInput({ datasetId: "" })).issues.some(
      (i) => i.code === "MISSING_DATASET",
    ),
  );
});

test("35. unrecognized scope fails validation", () => {
  const result = validateDataUnderstandingFoundationInput(
    baseInput(undefined, { requestedUnderstandingScope: "EverythingEverywhere" }),
  );
  assert.equal(result.valid, false);
  assert.ok(result.issues.some((i) => i.code === "UNRECOGNIZED_SCOPE"));
});

test("36. unknown requested subject fails validation", () => {
  const result = validateDataUnderstandingFoundationInput(
    baseInput(undefined, {
      requestedSubjectIds: Object.freeze(["not-a-real-subject"]),
    }),
  );
  assert.equal(result.valid, false);
  assert.ok(result.issues.some((i) => i.code === "UNKNOWN_SUBJECT"));
});

test("37. source references must remain resolved", () => {
  const result = validateDataUnderstandingFoundationInput(
    baseInput({
      sourceRegistryId: "dsk-datasource-does-not-exist",
      sourceReferencesValid: false,
    }),
  );
  assert.equal(result.valid, false);
  assert.ok(result.issues.some((i) => i.code === "SOURCE_REFERENCES_UNRESOLVED"));
});

test("38-40. validation does not mutate; frozen; deterministic", () => {
  const input = baseInput();
  const before = JSON.stringify(input);
  const a = validateDataUnderstandingFoundationInput(input);
  const b = validateDataUnderstandingFoundationInput(input);
  assert.equal(JSON.stringify(input), before);
  assert.equal(isDeeplyFrozen(a), true);
  assert.deepEqual(a, b);
  assert.doesNotThrow(() => validateDataUnderstandingFoundationInput(null));
});

test("41. no semantic candidates are generated", () => {
  const result = validateDataUnderstandingFoundationInput(baseInput());
  assert.equal(result.valid, true);
  assert.equal("datasetCandidates" in result, false);
  assert.equal(DataUnderstandingContracts.notes.noRealCandidateGeneration, true);
  assert.match(DATA_UNDERSTANDING_DEFINITION, /without creating canonical Business Objects/);
});

test("42-45. no DKL-4, persistence, AI, or Engine imports/behavior", () => {
  for (const file of DKL31_FILES.filter((f) => !f.endsWith(".test.ts"))) {
    const text = readFileSync(join(HERE, file), "utf8");
    assert.equal(/from\s+["'][^"']*dkl-4/i.test(text), false, file);
    assert.equal(/from\s+["'][^"']*\/persistence/i.test(text), false, file);
    assert.equal(/from\s+["'][^"']*(openai|anthropic|llm)[^"']*["']/i.test(text), false, file);
    assert.equal(/from\s+["'][^"']*\/engine\//i.test(text), false, file);
    assert.equal(/\basync\s+function\b/.test(text), false, file);
    assert.equal(/\bclass\s+\w+/.test(text), false, file);
    assert.equal(/Math\.random|Date\.now|process\.env/.test(text), false, file);
    assert.equal(/\bembedding\b/i.test(text), false, file);
  }
  assert.equal(DataUnderstandingFoundation.readiness.AIFree, true);
  assert.equal(DataUnderstandingFoundation.readiness.EngineFree, true);
});

test("51-52. readiness ReadyForRegistry; next phase DKL-3:2", () => {
  assert.equal(DataUnderstandingFoundation.identity.readiness, "ReadyForRegistry");
  assert.equal(DataUnderstandingFoundation.readiness.ReadyForRegistry, true);
  assert.equal(
    DataUnderstandingFoundation.nextPhase,
    "DKL-3:2 — Data Understanding Registry",
  );
  assert.ok(
    DataUnderstandingFoundation.completionStatus.includes("SemanticCandidateContractsDefined"),
  );
  assert.ok(DataUnderstandingFoundation.completionStatus.includes("FoundationComplete"));
});

test("definition and aggregate are deeply frozen", () => {
  assert.equal(isDeeplyFrozen(DataUnderstandingFoundation), true);
  assert.equal(isDeeplyFrozen(DataUnderstandingContracts), true);
  assert.equal(isDeeplyFrozen(DataUnderstandingOwnership), true);
  assert.equal(isDeeplyFrozen(DataUnderstandingBoundaries), true);
  assert.equal(isDeeplyFrozen(DataUnderstandingLifecycle.transitions), true);
  assert.equal(isDeeplyFrozen(DataUnderstandingEvidenceCatalog), true);
});
