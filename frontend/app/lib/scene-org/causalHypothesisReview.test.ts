import assert from "node:assert/strict";
import test from "node:test";
import {
  commitPreparedCsvRealDataImport,
  exportCsvRealDataImportState,
  hydrateCsvRealDataImportState,
  resetCsvRealDataImportStoreForTests,
  type CsvRealDataImportExportedState,
} from "../data-reality/csvRealDataImportStore.ts";
import {
  parseCsvDeterministically,
  prepareCsvRealDataImport,
  suggestCsvColumnMappings,
  updateCsvColumnMapping,
} from "../data-reality/csvRealDataVerticalSlice.ts";
import { assignManagerDatasetReference, removeManagerDatasetReference } from "../deck/nexoraDeckDatasetReferenceAuthority.ts";
import { setDeckDatasetReferenceStorageForTests } from "../deck/nexoraDeckDatasetReferenceRegistry.ts";
import { createDeck, resetDeckRegistryForTests, setDeckRegistryStorageForTests } from "../deck/nexoraDeckRegistry.ts";
import { NEXORA_EXECUTIVE_DECK_ID } from "../deck/nexoraDeckIdentityContract.ts";
import { createManagerWorkspaceFromEntry } from "../workspace/managerWorkspaceEntry.ts";
import { BUSINESS_DEMO_WORKSPACE_ID, DEMO_WORKSPACE_ID } from "../workspace/workspaceRegistryContract.ts";
import { deleteWorkspace, resetWorkspaceRegistryForTests } from "../workspace/workspaceRegistryStore.ts";
import {
  assessCausalHypothesisReadiness,
  reviewCausalHypothesis,
} from "./causalHypothesisReview.ts";
import {
  CANONICAL_CAUSAL_INVESTIGATION_STORAGE_KEY,
  canonicalCausalInvestigationIdentity,
  createCausalHypothesis,
  createCausalInvestigation,
  createCausalObservation,
  getCausalHypothesis,
  getCausalInvestigation,
  listCausalHypothesisReviews,
  resetCausalInvestigationDomainForTests,
  transitionCausalHypothesis,
  transitionCausalInvestigation,
  transitionCausalObservation,
  updateCausalHypothesis,
} from "./canonicalCausalInvestigationDomain.ts";
import { listCanonicalMutations, resetCanonicalMutationJournalForTests } from "./canonicalMutationJournal.ts";
import { readCommittedDatasetSnapshot } from "./canonicalDatasetEntityPipeline.ts";
import {
  listDecisionGoals,
  listDecisionScenarios,
  listExecutionPlans,
  resetDecisionDomainForTests,
} from "./canonicalDecisionDomain.ts";
import {
  CANONICAL_OBJECT_STORAGE_KEY,
  canonicalObjectRegistryIdentity,
  canonicalObjectRevision,
  createCanonicalObject,
  getCanonicalObject,
  removeCanonicalObjectFromDeck,
  resetCanonicalObjectsForTests,
} from "./canonicalObjectRegistry.ts";
import { listCanonicalRelationships, resetCanonicalRelationshipsForTests } from "./canonicalRelationshipGraph.ts";

const T0 = "2026-11-09T20:00:00.000Z";

function memory(): Storage {
  const values = new Map<string, string>();
  return {
    get length() { return values.size; },
    clear() { values.clear(); },
    getItem(key: string) { return values.get(key) ?? null; },
    key(index: number) { return [...values.keys()][index] ?? null; },
    removeItem(key: string) { values.delete(key); },
    setItem(key: string, value: string) { values.set(key, value); },
  };
}

function setup() {
  const store = memory();
  resetCanonicalObjectsForTests(store);
  resetCanonicalRelationshipsForTests(store);
  resetDecisionDomainForTests(store);
  resetCanonicalMutationJournalForTests(store);
  resetCausalInvestigationDomainForTests(store);
  return store;
}

function commitCsv(workspaceId: string, fileName: string, csv: string, importId: string, sourceContextId?: string) {
  const parse = parseCsvDeterministically(csv);
  let mapping = suggestCsvColumnMappings(parse.columns, importId);
  for (const column of mapping.mappings) {
    if (!column.confirmed) mapping = updateCsvColumnMapping(mapping, column.columnIndex, null);
  }
  const prepared = prepareCsvRealDataImport({
    workspaceId,
    fileName,
    fileSize: csv.length,
    csvText: csv,
    importId,
    importedAt: T0,
    sourceContextId,
  }, mapping);
  assert.equal(prepared.ready, true, prepared.errors.join("; "));
  const result = commitPreparedCsvRealDataImport({
    prepared,
    expectedWorkspaceId: workspaceId,
    mode: sourceContextId ? "replace" : "new",
    committedAt: T0,
  });
  assert.equal(result.committed, true, result.reason);
  return result.current!;
}

test("manager review records readiness, history, and refuses causal or decision side effects", () => {
  resetWorkspaceRegistryForTests();
  resetDeckRegistryForTests();
  resetCsvRealDataImportStoreForTests();
  const store = setup();
  setDeckRegistryStorageForTests(store);
  setDeckDatasetReferenceStorageForTests(store);
  const company = createManagerWorkspaceFromEntry({ name: "NPA Review", kind: "BUSINESS" });
  assert.ok(company);
  if (!company) return;
  try {
    const production = createDeck({ workspaceId: company.workspaceId, name: "Production", kind: "DEPARTMENT" });
    const finance = createDeck({ workspaceId: company.workspaceId, name: "Finance", kind: "DEPARTMENT" });
    assert.equal(production.ok && finance.ok, true);
    if (!production.ok || !finance.ok) return;
    const machine = createCanonicalObject({
      workspaceId: company.workspaceId,
      objectType: "MACHINE",
      displayName: "CNC Machine A",
      deckId: production.value.deckId,
      attributes: { capacityPerHour: 120 },
    });
    assert.equal(machine.ok, true);
    if (!machine.ok) return;
    const productionData = commitCsv(company.workspaceId, "production_capacity.csv", "machine_id,capacity,Production Used Capacity,Production Total Capacity\nCNC-A,120,120,120\n", "import-a");
    const maintenanceData = commitCsv(company.workspaceId, "maintenance_capacity.csv", "machine_id,capacity,Production Used Capacity,Production Total Capacity\nCNC-A,90,90,120\n", "import-b");
    assert.equal(assignManagerDatasetReference({ workspaceId: company.workspaceId, deckId: production.value.deckId, datasetId: productionData.sourceContextId }).ok, true);
    assert.equal(assignManagerDatasetReference({ workspaceId: company.workspaceId, deckId: production.value.deckId, datasetId: maintenanceData.sourceContextId }).ok, true);
    const investigation = createCausalInvestigation({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      title: "Why did production efficiency decline?",
      problemStatement: "Effective output fell.",
      now: T0,
    });
    assert.equal(investigation.ok, true);
    if (!investigation.ok) return;
    const supporting = createCausalObservation({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      statement: "Production capacity evidence.",
      canonicalObjectId: machine.value.canonicalObjectId,
      datasetReference: { datasetId: productionData.sourceContextId, importId: "import-a", sourceKey: "CNC-A", fieldName: "capacity" },
      unit: "units/hour",
      periodLabel: "current",
      now: T0,
    });
    const conflict = createCausalObservation({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      statement: "Maintenance capacity evidence.",
      canonicalObjectId: machine.value.canonicalObjectId,
      datasetReference: { datasetId: maintenanceData.sourceContextId, importId: "import-b", sourceKey: "CNC-A", fieldName: "capacity" },
      unit: "units/hour",
      periodLabel: "current",
      now: T0,
    });
    const narrative = createCausalObservation({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      statement: "The manager reports lower effective output.",
      canonicalObjectId: machine.value.canonicalObjectId,
      now: T0,
    });
    assert.equal(supporting.ok && conflict.ok && narrative.ok, true);
    if (!supporting.ok || !conflict.ok || !narrative.ok) return;
    const hypothesis = createCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      statement: "Unexpected maintenance downtime contributed to lower output.",
      observationIds: [supporting.value.observationId, conflict.value.observationId, narrative.value.observationId],
      canonicalObjectIds: [machine.value.canonicalObjectId],
      evidenceRoles: [
        { observationId: supporting.value.observationId, role: "SUPPORTING" },
        { observationId: conflict.value.observationId, role: "CONFLICTING" },
        { observationId: narrative.value.observationId, role: "NEUTRAL" },
      ],
      assumptions: ["The cited period is the period under review."],
      limitations: ["Maintenance and production may describe different operating conditions."],
      now: T0,
    });
    const other = createCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      statement: "A second explanation remains proposed.",
      observationIds: [narrative.value.observationId],
      now: T0,
    });
    assert.equal(hypothesis.ok && other.ok, true);
    if (!hypothesis.ok || !other.ok) return;
    const readiness = assessCausalHypothesisReadiness({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
    });
    const again = assessCausalHypothesisReadiness({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
    });
    assert.equal(readiness.ok, true);
    assert.deepEqual(readiness, again);
    if (!readiness.ok) return;
    assert.equal(readiness.value.classification, "REVIEW_WITH_LIMITATIONS");
    assert.equal(readiness.value.conflictingEvidenceCount, 2);
    assert.equal(readiness.value.managerReportedCount, 1);
    assert.equal(readiness.value.supportingEvidenceCount, 0);
    assert.equal(readiness.value.evidenceSupportedCausal, false);
    assert.notEqual(readiness.value.causalLadder, "EVIDENCE_SUPPORTED_CAUSAL");
    const skipped = reviewCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
      action: "ACCEPT_FOR_SCENARIO",
      managerNote: "Accept before review.",
      operationId: "accept-too-soon",
      acknowledgeLimitations: true,
      evidenceFingerprint: readiness.value.evidenceFingerprint,
      now: T0,
    });
    assert.equal(skipped.ok, false);
    if (skipped.ok) return;
    assert.equal(skipped.reason, "invalid-status");
    const beforeObject = JSON.stringify(getCanonicalObject(company.workspaceId, machine.value.canonicalObjectId));
    const beforeRevision = canonicalObjectRevision();
    const beforeJournal = listCanonicalMutations().length;
    const beforeRelationships = listCanonicalRelationships(company.workspaceId).length;
    const beforeGoals = listDecisionGoals(company.workspaceId, production.value.deckId).length;
    const beforeScenarios = listDecisionScenarios(company.workspaceId, production.value.deckId).length;
    const beforePlans = listExecutionPlans(company.workspaceId, production.value.deckId).length;
    const beforeSnapshot = JSON.stringify(readCommittedDatasetSnapshot(company.workspaceId, maintenanceData.sourceContextId));
    const requested = reviewCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
      action: "REQUEST_EVIDENCE",
      managerNote: "The conflicting capacity readings need a manager decision.",
      operationId: "request-1",
      now: T0,
    });
    assert.equal(requested.ok, true);
    if (!requested.ok) return;
    assert.equal(requested.value.hypothesis.status, "NEEDS_EVIDENCE");
    assert.equal(requested.value.review.previousStatus, "PROPOSED");
    assert.equal(requested.value.review.newStatus, "NEEDS_EVIDENCE");
    assert.equal(requested.value.investigationStatus, "DRAFT");
    const started = reviewCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
      action: "START_REVIEW",
      managerNote: "Review the current committed evidence.",
      operationId: "start-1",
      now: T0,
    });
    assert.equal(started.ok, true);
    if (!started.ok) return;
    assert.equal(started.value.hypothesis.status, "UNDER_REVIEW");
    assert.equal(started.value.readiness.classification, "REVIEW_WITH_LIMITATIONS");
    const unacknowledged = reviewCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
      action: "ACCEPT_FOR_SCENARIO",
      managerNote: "Accept without acknowledging limitations.",
      operationId: "accept-unacknowledged",
      evidenceFingerprint: started.value.readiness.evidenceFingerprint,
      now: T0,
    });
    assert.equal(unacknowledged.ok, false);
    if (unacknowledged.ok) return;
    assert.equal(unacknowledged.reason, "acknowledgment-required");
    const rejected = reviewCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
      action: "REJECT",
      managerNote: "The explanation is not the one to carry forward.",
      operationId: "reject-1",
      now: T0,
    });
    assert.equal(rejected.ok, true);
    if (!rejected.ok) return;
    assert.equal(rejected.value.hypothesis.status, "REJECTED");
    const directAccept = reviewCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
      action: "ACCEPT_FOR_SCENARIO",
      managerNote: "A rejected explanation cannot skip review.",
      operationId: "accept-rejected",
      acknowledgeLimitations: true,
      evidenceFingerprint: rejected.value.readiness.evidenceFingerprint,
      now: T0,
    });
    assert.equal(directAccept.ok, false);
    const returned = reviewCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
      action: "RETURN_TO_INVESTIGATION",
      managerNote: "Return the explanation for another evidence pass.",
      operationId: "return-1",
      now: T0,
    });
    assert.equal(returned.ok, true);
    if (!returned.ok) return;
    assert.equal(returned.value.hypothesis.status, "NEEDS_EVIDENCE");
    const restarted = reviewCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
      action: "START_REVIEW",
      managerNote: "Review again after the return.",
      operationId: "start-2",
      now: T0,
    });
    assert.equal(restarted.ok, true);
    if (!restarted.ok) return;
    const stale = reviewCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
      action: "ACCEPT_FOR_SCENARIO",
      managerNote: "Accept an older evidence reading.",
      operationId: "accept-stale",
      acknowledgeLimitations: true,
      evidenceFingerprint: "evidence:outdated",
      now: T0,
    });
    assert.equal(stale.ok, false);
    if (stale.ok) return;
    assert.equal(stale.reason, "stale-evidence");
    assert.equal(getCausalHypothesis(company.workspaceId, hypothesis.value.hypothesisId)?.status, "UNDER_REVIEW");
    const accepted = reviewCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
      action: "ACCEPT_FOR_SCENARIO",
      managerNote: "Accept for scenario exploration with the conflict still visible.",
      operationId: "accept-1",
      acknowledgeLimitations: true,
      evidenceFingerprint: restarted.value.readiness.evidenceFingerprint,
      now: T0,
    });
    assert.equal(accepted.ok, true);
    if (!accepted.ok) return;
    assert.equal(accepted.value.hypothesis.status, "ACCEPTED_FOR_SCENARIO");
    assert.equal(accepted.value.hypothesis.evidenceSupportedCausal, false);
    assert.equal(accepted.value.readiness.classification, "REVIEW_WITH_LIMITATIONS");
    assert.equal(accepted.value.review.limitationsAcknowledged, true);
    assert.equal(accepted.value.review.evidenceFingerprint, restarted.value.readiness.evidenceFingerprint);
    assert.equal(accepted.value.review.reviewId, `review:${encodeURIComponent(company.workspaceId)}:6`);
    assert.equal(accepted.value.investigationStatus, "DRAFT");
    assert.equal(getCausalInvestigation(company.workspaceId, investigation.value.investigationId)?.lifecycleStatus, "DRAFT");
    assert.equal(getCausalHypothesis(company.workspaceId, other.value.hypothesisId)?.status, "PROPOSED");
    assert.notEqual(accepted.value.readiness.causalLadder, "EVIDENCE_SUPPORTED_CAUSAL");
    const replay = reviewCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
      action: "ACCEPT_FOR_SCENARIO",
      managerNote: "Accept for scenario exploration with the conflict still visible.",
      operationId: "accept-1",
      acknowledgeLimitations: true,
      evidenceFingerprint: accepted.value.review.evidenceFingerprint,
      now: T0,
    });
    assert.equal(replay.ok && replay.value.replayed, true);
    assert.equal(replay.ok && replay.value.review.reviewId, accepted.value.review.reviewId);
    assert.equal(listCausalHypothesisReviews(company.workspaceId, hypothesis.value.hypothesisId).length, 6);
    const changed = reviewCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
      action: "ACCEPT_FOR_SCENARIO",
      managerNote: "A different note for the same operation.",
      operationId: "accept-1",
      acknowledgeLimitations: true,
      evidenceFingerprint: accepted.value.review.evidenceFingerprint,
      now: T0,
    });
    assert.equal(changed.ok, false);
    if (changed.ok) return;
    assert.equal(changed.reason, "duplicate");
    assert.equal(listCausalHypothesisReviews(company.workspaceId, hypothesis.value.hypothesisId).at(-1)?.managerNote, accepted.value.review.managerNote);
    resetCausalInvestigationDomainForTests(store);
    const restored = listCausalHypothesisReviews(company.workspaceId, hypothesis.value.hypothesisId);
    assert.equal(restored.length, 6);
    assert.equal(restored.at(-1)?.reviewId, accepted.value.review.reviewId);
    assert.equal(getCausalHypothesis(company.workspaceId, hypothesis.value.hypothesisId)?.status, "ACCEPTED_FOR_SCENARIO");
    const originalSet = store.setItem.bind(store);
    store.setItem = () => { throw new Error("injected"); };
    const failed = reviewCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
      action: "RETURN_TO_INVESTIGATION",
      managerNote: "This write must not partially return the hypothesis.",
      operationId: "return-failed",
      now: T0,
    });
    assert.equal(failed.ok, false);
    if (failed.ok) return;
    assert.equal(failed.reason, "storage-failed");
    store.setItem = originalSet;
    assert.equal(getCausalHypothesis(company.workspaceId, hypothesis.value.hypothesisId)?.status, "ACCEPTED_FOR_SCENARIO");
    assert.equal(listCausalHypothesisReviews(company.workspaceId, hypothesis.value.hypothesisId).length, 6);
    assert.equal(JSON.stringify(getCanonicalObject(company.workspaceId, machine.value.canonicalObjectId)), beforeObject);
    assert.equal(canonicalObjectRevision(), beforeRevision);
    assert.equal(listCanonicalMutations().length, beforeJournal);
    assert.equal(listCanonicalRelationships(company.workspaceId).length, beforeRelationships);
    assert.equal(listDecisionGoals(company.workspaceId, production.value.deckId).length, beforeGoals);
    assert.equal(listDecisionScenarios(company.workspaceId, production.value.deckId).length, beforeScenarios);
    assert.equal(listExecutionPlans(company.workspaceId, production.value.deckId).length, beforePlans);
    assert.equal(JSON.stringify(readCommittedDatasetSnapshot(company.workspaceId, maintenanceData.sourceContextId)), beforeSnapshot);
    assert.equal(reviewCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: finance.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
      action: "RETURN_TO_INVESTIGATION",
      managerNote: "Finance cannot review production.",
      operationId: "finance-cross",
    }).ok, false);
    assert.equal(reviewCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: NEXORA_EXECUTIVE_DECK_ID,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
      action: "RETURN_TO_INVESTIGATION",
      managerNote: "Executive cannot review this production hypothesis.",
      operationId: "executive-cross",
    }).ok, false);
    assert.equal(removeManagerDatasetReference({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      datasetId: maintenanceData.sourceContextId,
    }).ok, true);
    const detached = assessCausalHypothesisReadiness({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
    });
    assert.equal(detached.ok, true);
    if (!detached.ok) return;
    const detachedItem = detached.value.items.find((item) => item.observationId === conflict.value.observationId);
    assert.equal(detachedItem?.availability, "DETACHED");
    assert.equal(detachedItem?.resolvedValue, null);
    assert.equal(detached.value.unauthorizedEvidenceCount > 0, true);
    assert.equal(removeCanonicalObjectFromDeck({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      canonicalObjectId: machine.value.canonicalObjectId,
    }).ok, true);
    const hidden = assessCausalHypothesisReadiness({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
    });
    assert.equal(hidden.ok, true);
    if (!hidden.ok) return;
    assert.equal(hidden.value.items.every((item) => item.objectName == null && item.canonicalValue == null), true);
  } finally {
    deleteWorkspace(company.workspaceId);
    resetWorkspaceRegistryForTests();
    resetDeckRegistryForTests();
    resetCsvRealDataImportStoreForTests();
    setDeckRegistryStorageForTests(null);
    setDeckDatasetReferenceStorageForTests(null);
  }
});

test("financial review accepts exploration with missing material cost and does not establish causation", () => {
  resetWorkspaceRegistryForTests();
  resetDeckRegistryForTests();
  resetCsvRealDataImportStoreForTests();
  const store = setup();
  setDeckRegistryStorageForTests(store);
  setDeckDatasetReferenceStorageForTests(store);
  const company = createManagerWorkspaceFromEntry({ name: "NPA Profit Review", kind: "BUSINESS" });
  assert.ok(company);
  if (!company) return;
  try {
    const finance = createDeck({ workspaceId: company.workspaceId, name: "Finance", kind: "DEPARTMENT" });
    assert.equal(finance.ok, true);
    if (!finance.ok) return;
    const revenue = commitCsv(company.workspaceId, "revenue.csv", "period,revenue,Production Used Capacity,Production Total Capacity\nprevious,1000000,1,1\ncurrent,1200000,1,1\n", "import-revenue");
    const profit = commitCsv(company.workspaceId, "operating_profit.csv", "period,operatingProfit,Production Used Capacity,Production Total Capacity\ncurrent,108000,1,1\n", "import-profit");
    const purchasing = commitCsv(company.workspaceId, "purchasing.csv", "period,materialCost,Production Used Capacity,Production Total Capacity\ncurrent,400000,1,1\n", "import-material");
    for (const source of [revenue, profit, purchasing]) {
      assert.equal(assignManagerDatasetReference({ workspaceId: company.workspaceId, deckId: finance.value.deckId, datasetId: source.sourceContextId }).ok, true);
    }
    const investigation = createCausalInvestigation({
      workspaceId: company.workspaceId,
      deckId: finance.value.deckId,
      title: "Why did operating profit decline despite revenue growth?",
      problemStatement: "Revenue rose while operating profit fell.",
    });
    assert.equal(investigation.ok, true);
    if (!investigation.ok) return;
    const previousRevenue = createCausalObservation({
      workspaceId: company.workspaceId,
      deckId: finance.value.deckId,
      investigationId: investigation.value.investigationId,
      statement: "Previous revenue.",
      datasetReference: { datasetId: revenue.sourceContextId, importId: "import-revenue", sourceKey: "previous", fieldName: "revenue" },
      periodLabel: "previous",
      unit: "currency",
    });
    const currentRevenue = createCausalObservation({
      workspaceId: company.workspaceId,
      deckId: finance.value.deckId,
      investigationId: investigation.value.investigationId,
      statement: "Current revenue.",
      datasetReference: { datasetId: revenue.sourceContextId, importId: "import-revenue", sourceKey: "current", fieldName: "revenue" },
      periodLabel: "current",
      unit: "currency",
    });
    const currentProfit = createCausalObservation({
      workspaceId: company.workspaceId,
      deckId: finance.value.deckId,
      investigationId: investigation.value.investigationId,
      statement: "Current operating profit.",
      datasetReference: { datasetId: profit.sourceContextId, importId: "import-profit", sourceKey: "current", fieldName: "operatingProfit" },
      periodLabel: "current",
      unit: "currency",
    });
    const material = createCausalObservation({
      workspaceId: company.workspaceId,
      deckId: finance.value.deckId,
      investigationId: investigation.value.investigationId,
      statement: "Material cost is not yet committed.",
      datasetReference: { datasetId: purchasing.sourceContextId, importId: "import-material", sourceKey: "current", fieldName: "materialCost" },
    });
    const narrative = createCausalObservation({
      workspaceId: company.workspaceId,
      deckId: finance.value.deckId,
      investigationId: investigation.value.investigationId,
      statement: "A manager reports that material prices may have risen.",
    });
    assert.equal(previousRevenue.ok && currentRevenue.ok && currentProfit.ok && material.ok && narrative.ok, true);
    if (!previousRevenue.ok || !currentRevenue.ok || !currentProfit.ok || !material.ok || !narrative.ok) return;
    const hypothesis = createCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: finance.value.deckId,
      investigationId: investigation.value.investigationId,
      statement: "Higher material costs contributed to declining operating profit.",
      observationIds: [previousRevenue.value.observationId, currentRevenue.value.observationId, currentProfit.value.observationId, material.value.observationId, narrative.value.observationId],
      evidenceRoles: [{ observationId: narrative.value.observationId, role: "SUPPORTING" }],
      limitations: ["Material cost is not yet committed."],
    });
    assert.equal(hypothesis.ok, true);
    if (!hypothesis.ok) return;
    const withoutPurchasing = JSON.parse(JSON.stringify(exportCsvRealDataImportState())) as CsvRealDataImportExportedState;
    hydrateCsvRealDataImportState({
      ...withoutPurchasing,
      committed: withoutPurchasing.committed.filter((entry) => entry.sourceContextId !== purchasing.sourceContextId),
    });
    const open = assessCausalHypothesisReadiness({
      workspaceId: company.workspaceId,
      deckId: finance.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
    });
    assert.equal(open.ok, true);
    if (!open.ok) return;
    assert.equal(open.value.items.find((item) => item.statement === "Previous revenue.")?.resolvedValue, "1000000");
    assert.equal(open.value.items.find((item) => item.statement === "Current revenue.")?.resolvedValue, "1200000");
    assert.equal(open.value.items.find((item) => item.statement === "Current operating profit.")?.resolvedValue, "108000");
    assert.equal(open.value.items.find((item) => item.statement === "Material cost is not yet committed.")?.availability, "MISSING");
    assert.equal(open.value.items.find((item) => item.statement === "Material cost is not yet committed.")?.resolvedValue, null);
    assert.equal(open.value.classification, "REVIEW_WITH_LIMITATIONS");
    assert.equal(open.value.managerReportedCount, 1);
    assert.equal(open.value.supportingEvidenceCount, 0);
    const requested = reviewCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: finance.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
      action: "REQUEST_EVIDENCE",
      managerNote: "Material cost is still missing.",
      operationId: "finance-request",
      evidenceFingerprint: open.value.evidenceFingerprint,
    });
    assert.equal(requested.ok && requested.value.hypothesis.status, "NEEDS_EVIDENCE");
    const started = reviewCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: finance.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
      action: "START_REVIEW",
      managerNote: "Review with the material-cost gap visible.",
      operationId: "finance-start",
    });
    assert.equal(started.ok, true);
    if (!started.ok) return;
    const accepted = reviewCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: finance.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
      action: "ACCEPT_FOR_SCENARIO",
      managerNote: "Explore this explanation in a scenario. Causation is not established.",
      operationId: "finance-accept",
      acknowledgeLimitations: true,
      evidenceFingerprint: started.value.readiness.evidenceFingerprint,
    });
    assert.equal(accepted.ok, true);
    if (!accepted.ok) return;
    assert.equal(accepted.value.hypothesis.status, "ACCEPTED_FOR_SCENARIO");
    assert.equal(accepted.value.readiness.classification, "REVIEW_WITH_LIMITATIONS");
    assert.equal(accepted.value.evidenceSupportedCausal, false);
    assert.notEqual(accepted.value.readiness.causalLadder, "EVIDENCE_SUPPORTED_CAUSAL");
    assert.equal(accepted.value.review.warnings.some((warning) => warning.includes("missing")), true);
    assert.equal(listDecisionGoals(company.workspaceId, finance.value.deckId).length, 0);
    assert.equal(listExecutionPlans(company.workspaceId, finance.value.deckId).length, 0);
    assert.equal(store.getItem(CANONICAL_CAUSAL_INVESTIGATION_STORAGE_KEY)?.includes(accepted.value.review.reviewId), true);
    assert.equal(canonicalCausalInvestigationIdentity.length > 0, true);
  } finally {
    deleteWorkspace(company.workspaceId);
    resetWorkspaceRegistryForTests();
    resetDeckRegistryForTests();
    resetCsvRealDataImportStoreForTests();
    setDeckRegistryStorageForTests(null);
    setDeckDatasetReferenceStorageForTests(null);
  }
});

test("review fails closed for protected, corrupt, archived, and deleted authorities", () => {
  const store = setup();
  const investigation = createCausalInvestigation({
    workspaceId: "company-a",
    deckId: "production",
    title: "Closed review",
    problemStatement: "Some reviews cannot proceed.",
  });
  assert.equal(investigation.ok, true);
  if (!investigation.ok) return;
  const observation = createCausalObservation({
    workspaceId: "company-a",
    deckId: "production",
    investigationId: investigation.value.investigationId,
    statement: "A manager note without a dataset.",
  });
  assert.equal(observation.ok, true);
  if (!observation.ok) return;
  const hypothesis = createCausalHypothesis({
    workspaceId: "company-a",
    deckId: "production",
    investigationId: investigation.value.investigationId,
    statement: "An explanation that still needs evidence.",
    observationIds: [observation.value.observationId],
  });
  assert.equal(hypothesis.ok, true);
  if (!hypothesis.ok) return;
  assert.equal(transitionCausalObservation({
    workspaceId: "company-a",
    deckId: "production",
    observationId: observation.value.observationId,
    lifecycleStatus: "ARCHIVED",
  }).ok, true);
  const onlyNarrative = assessCausalHypothesisReadiness({
    workspaceId: "company-a",
    deckId: "production",
    investigationId: investigation.value.investigationId,
    hypothesisId: hypothesis.value.hypothesisId,
  });
  assert.equal(onlyNarrative.ok && onlyNarrative.value.classification, "NEEDS_EVIDENCE");
  assert.equal(onlyNarrative.ok && onlyNarrative.value.items[0]?.availability, "ARCHIVED");
  assert.equal(onlyNarrative.ok && onlyNarrative.value.warnings.some((warning) => warning.includes("archived")), true);
  assert.equal(transitionCausalHypothesis({
    workspaceId: "company-a",
    deckId: "production",
    hypothesisId: hypothesis.value.hypothesisId,
    status: "ARCHIVED",
  }).ok, true);
  const archived = reviewCausalHypothesis({
    workspaceId: "company-a",
    deckId: "production",
    investigationId: investigation.value.investigationId,
    hypothesisId: hypothesis.value.hypothesisId,
    action: "START_REVIEW",
    managerNote: "Archived hypotheses stay closed.",
    operationId: "archived-review",
  });
  assert.equal(archived.ok, false);
  if (archived.ok) return;
  assert.equal(archived.reason, "invalid-status");
  assert.equal(transitionCausalInvestigation({
    workspaceId: "company-a",
    deckId: "production",
    investigationId: investigation.value.investigationId,
    lifecycleStatus: "DELETED",
  }).ok, true);
  const deleted = reviewCausalHypothesis({
    workspaceId: "company-a",
    deckId: "production",
    investigationId: investigation.value.investigationId,
    hypothesisId: hypothesis.value.hypothesisId,
    action: "REQUEST_EVIDENCE",
    managerNote: "A deleted investigation cannot be reviewed.",
    operationId: "deleted-review",
  });
  assert.equal(deleted.ok, false);
  if (deleted.ok) return;
  assert.equal(deleted.reason, "deleted");
  assert.equal(assessCausalHypothesisReadiness({
    workspaceId: DEMO_WORKSPACE_ID,
    deckId: "production",
    investigationId: "cause:demo_workspace:1",
    hypothesisId: "hypothesis:demo_workspace:1",
  }).ok, false);
  assert.equal(reviewCausalHypothesis({
    workspaceId: BUSINESS_DEMO_WORKSPACE_ID,
    deckId: "production",
    investigationId: "cause:business_demo_workspace:1",
    hypothesisId: "hypothesis:business_demo_workspace:1",
    action: "START_REVIEW",
    managerNote: "Protected demos reject review writes.",
    operationId: "demo-review",
  }).ok, false);
  assert.equal(reviewCausalHypothesis({
    workspaceId: "company-b",
    deckId: "production",
    investigationId: investigation.value.investigationId,
    hypothesisId: hypothesis.value.hypothesisId,
    action: "START_REVIEW",
    managerNote: "Another company cannot review this hypothesis.",
    operationId: "company-b",
  }).ok, false);
  store.setItem(CANONICAL_CAUSAL_INVESTIGATION_STORAGE_KEY, "{");
  resetCausalInvestigationDomainForTests(store);
  assert.deepEqual(assessCausalHypothesisReadiness({
    workspaceId: "company-a",
    deckId: "production",
    investigationId: "cause:company-a:1",
    hypothesisId: "hypothesis:company-a:1",
  }), { ok: false, reason: "corrupt" });
  const versioned = memory();
  versioned.setItem(CANONICAL_CAUSAL_INVESTIGATION_STORAGE_KEY, JSON.stringify({
    identity: canonicalCausalInvestigationIdentity,
    schemaVersion: 2,
    workspaces: {},
  }));
  resetCausalInvestigationDomainForTests(versioned);
  assert.equal(reviewCausalHypothesis({
    workspaceId: "company-a",
    deckId: "production",
    investigationId: "cause:company-a:1",
    hypothesisId: "hypothesis:company-a:1",
    action: "START_REVIEW",
    managerNote: "Unsupported history cannot be reviewed.",
    operationId: "unsupported-review",
  }).ok, false);
  const objects = memory();
  objects.setItem(CANONICAL_OBJECT_STORAGE_KEY, JSON.stringify({
    identity: canonicalObjectRegistryIdentity,
    schemaVersion: 2,
    workspaces: {},
  }));
  setup();
  resetCanonicalObjectsForTests(objects);
  assert.deepEqual(assessCausalHypothesisReadiness({
    workspaceId: "company-a",
    deckId: "production",
    investigationId: "cause:company-a:1",
    hypothesisId: "hypothesis:company-a:1",
  }), { ok: false, reason: "unsupported-version" });
});

test("readiness keeps a visible bound when the evidence report is truncated", () => {
  setup();
  const investigation = createCausalInvestigation({
    workspaceId: "company-a",
    deckId: "production",
    title: "Bounded review",
    problemStatement: "The review must show that the evidence reading stopped.",
  });
  assert.equal(investigation.ok, true);
  if (!investigation.ok) return;
  const ids: string[] = [];
  for (let index = 0; index < 101; index += 1) {
    const observation = createCausalObservation({
      workspaceId: "company-a",
      deckId: "production",
      investigationId: investigation.value.investigationId,
      statement: `Manager note ${index}`,
    });
    assert.equal(observation.ok, true);
    if (!observation.ok) return;
    ids.push(observation.value.observationId);
  }
  const hypothesis = createCausalHypothesis({
    workspaceId: "company-a",
    deckId: "production",
    investigationId: investigation.value.investigationId,
    statement: "The notes do not establish a cause.",
    observationIds: ids,
  });
  assert.equal(hypothesis.ok, true);
  if (!hypothesis.ok) return;
  const readiness = assessCausalHypothesisReadiness({
    workspaceId: "company-a",
    deckId: "production",
    investigationId: investigation.value.investigationId,
    hypothesisId: hypothesis.value.hypothesisId,
  });
  assert.equal(readiness.ok, true);
  if (!readiness.ok) return;
  assert.equal(readiness.value.truncated, true);
  assert.equal(readiness.value.items.length, 100);
  assert.equal(readiness.value.classification, "NEEDS_EVIDENCE");
  assert.equal(readiness.value.warnings.some((warning) => warning.includes("truncated")), true);
  assert.equal(readiness.value.evidenceSupportedCausal, false);
});

test("a changed hypothesis claim cannot be accepted from the statement the manager reviewed", () => {
  resetWorkspaceRegistryForTests();
  resetDeckRegistryForTests();
  const store = setup();
  setDeckRegistryStorageForTests(store);
  const company = createManagerWorkspaceFromEntry({ name: "Claim Company", kind: "BUSINESS" });
  assert.ok(company);
  if (!company) return;
  const production = createDeck({ workspaceId: company.workspaceId, name: "Production", kind: "DEPARTMENT" });
  assert.equal(production.ok, true);
  if (!production.ok) return;
  const investigation = createCausalInvestigation({
    workspaceId: company.workspaceId,
    deckId: production.value.deckId,
    title: "Capacity claim",
    problemStatement: "Output is short.",
    now: T0,
  });
  assert.equal(investigation.ok, true);
  if (!investigation.ok) return;
  const hypothesis = createCausalHypothesis({
    workspaceId: company.workspaceId,
    deckId: production.value.deckId,
    investigationId: investigation.value.investigationId,
    statement: "A second shift would close the gap.",
    assumptions: ["Demand stays level."],
    limitations: ["This does not prove the cause."],
    now: T0,
  });
  assert.equal(hypothesis.ok, true);
  if (!hypothesis.ok) return;
  const started = reviewCausalHypothesis({
    workspaceId: company.workspaceId,
    deckId: production.value.deckId,
    investigationId: investigation.value.investigationId,
    hypothesisId: hypothesis.value.hypothesisId,
    action: "START_REVIEW",
    managerNote: "Start from the original claim.",
    operationId: "start-claim",
    hypothesisStatement: hypothesis.value.statement,
    now: T0,
  });
  assert.equal(started.ok, true);
  if (!started.ok) return;
  const changed = updateCausalHypothesis({
    workspaceId: company.workspaceId,
    deckId: production.value.deckId,
    hypothesisId: hypothesis.value.hypothesisId,
    statement: "A third shift would close the gap.",
    now: T0,
  });
  assert.equal(changed.ok, true);
  const stale = reviewCausalHypothesis({
    workspaceId: company.workspaceId,
    deckId: production.value.deckId,
    investigationId: investigation.value.investigationId,
    hypothesisId: hypothesis.value.hypothesisId,
    action: "ACCEPT_FOR_SCENARIO",
    managerNote: "Accept the claim that was on screen.",
    operationId: "accept-claim",
    acknowledgeLimitations: true,
    evidenceFingerprint: started.value.readiness.evidenceFingerprint,
    hypothesisStatement: "A second shift would close the gap.",
    now: T0,
  });
  assert.equal(stale.ok, false);
  if (stale.ok) return;
  assert.equal(stale.reason, "stale-evidence");
  assert.equal(getCausalHypothesis(company.workspaceId, hypothesis.value.hypothesisId)?.status, "UNDER_REVIEW");
  assert.equal(listCausalHypothesisReviews(company.workspaceId, hypothesis.value.hypothesisId)
    .some((review) => review.action === "ACCEPT_FOR_SCENARIO"), false);
});
