import assert from "node:assert/strict";
import test from "node:test";

type Writable<T> =
  T extends readonly (infer Item)[] ? Writable<Item>[] :
  T extends object ? { -readonly [Key in keyof T]: Writable<T[Key]> } :
  T;
import {
  commitPreparedCsvRealDataImport,
  exportCsvRealDataImportState,
  getCsvRealDataImport,
  hydrateCsvRealDataImportState,
  removeCsvRealDataImport,
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
import { resolveCausalInvestigationEvidence } from "./causalInvestigationEvidenceResolver.ts";
import {
  CANONICAL_CAUSAL_INVESTIGATION_STORAGE_KEY,
  canonicalCausalInvestigationAuthorityStatus,
  canonicalCausalInvestigationIdentity,
  createCausalHypothesis,
  createCausalInvestigation,
  getCausalHypothesis,
  createCausalObservation,
  resetCausalInvestigationDomainForTests,
  transitionCausalHypothesis,
  transitionCausalObservation,
} from "./canonicalCausalInvestigationDomain.ts";
import { listCanonicalMutations, resetCanonicalMutationJournalForTests } from "./canonicalMutationJournal.ts";
import { readCommittedDatasetSnapshot } from "./canonicalDatasetEntityPipeline.ts";
import { listDecisionGoals, resetDecisionDomainForTests } from "./canonicalDecisionDomain.ts";
import {
  CANONICAL_OBJECT_STORAGE_KEY,
  canonicalObjectRegistryIdentity,
  canonicalObjectRevision,
  createCanonicalObject,
  deleteCanonicalObject,
  getCanonicalObject,
  removeCanonicalObjectFromDeck,
  resetCanonicalObjectsForTests,
} from "./canonicalObjectRegistry.ts";
import { listCanonicalRelationships, resetCanonicalRelationshipsForTests } from "./canonicalRelationshipGraph.ts";

const T0 = "2026-11-09T19:00:00.000Z";

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

function mutateImport(sourceContextId: string, mutate: (entry: Writable<CsvRealDataImportExportedState["committed"][number]>) => void) {
  const state = JSON.parse(JSON.stringify(exportCsvRealDataImportState())) as Writable<CsvRealDataImportExportedState>;
  const entry = state.committed.find((candidate) => candidate.sourceContextId === sourceContextId);
  assert.ok(entry);
  if (!entry) return;
  mutate(entry);
  hydrateCsvRealDataImportState(state);
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

test("current evidence keeps provenance, manager role, and refuses causal certainty", () => {
  resetWorkspaceRegistryForTests();
  resetDeckRegistryForTests();
  resetCsvRealDataImportStoreForTests();
  const store = memory();
  setDeckRegistryStorageForTests(store);
  setDeckDatasetReferenceStorageForTests(store);
  setup();
  const company = createManagerWorkspaceFromEntry({ name: "NPA Evidence", kind: "BUSINESS" });
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
      now: T0,
    });
    assert.equal(machine.ok, true);
    if (!machine.ok) return;
    const productionCsv = "machine_id,machine_name,capacity,Production Used Capacity,Production Total Capacity\nCNC-A,CNC Machine A,120,120,120\n";
    const maintenanceCsv = "machine_id,machine_name,capacity,Production Used Capacity,Production Total Capacity\nCNC-A,CNC Machine A,90,90,120\n";
    const productionData = commitCsv(company.workspaceId, "production_capacity.csv", productionCsv, "import-cause-1");
    const maintenanceData = commitCsv(company.workspaceId, "maintenance_capacity.csv", maintenanceCsv, "import-cause-2");
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
    const reported = createCausalObservation({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      statement: "The manager reports lower effective output.",
      canonicalObjectId: machine.value.canonicalObjectId,
      now: T0,
    });
    const current = createCausalObservation({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      statement: "Production capacity evidence.",
      canonicalObjectId: machine.value.canonicalObjectId,
      datasetReference: { datasetId: productionData.sourceContextId, importId: "import-cause-1", sourceKey: "CNC-A", fieldName: "capacity" },
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
      datasetReference: { datasetId: maintenanceData.sourceContextId, importId: "import-cause-2", sourceKey: "CNC-A", fieldName: "capacity" },
      unit: "units/hour",
      periodLabel: "current",
      now: T0,
    });
    const otherPeriod = createCausalObservation({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      statement: "A prior period uses the same field.",
      canonicalObjectId: machine.value.canonicalObjectId,
      datasetReference: { datasetId: productionData.sourceContextId, importId: "import-cause-1", sourceKey: "CNC-A", fieldName: "capacity" },
      unit: "units/hour",
      periodLabel: "previous",
      now: T0,
    });
    const otherUnit = createCausalObservation({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      statement: "A different unit is not the same measurement context.",
      canonicalObjectId: machine.value.canonicalObjectId,
      datasetReference: { datasetId: maintenanceData.sourceContextId, importId: "import-cause-2", sourceKey: "CNC-A", fieldName: "capacity" },
      unit: "hours",
      periodLabel: "current",
      now: T0,
    });
    assert.equal(reported.ok && current.ok && conflict.ok && otherPeriod.ok && otherUnit.ok, true);
    if (!reported.ok || !current.ok || !conflict.ok || !otherPeriod.ok || !otherUnit.ok) return;
    const hypothesis = createCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      statement: "Unexpected maintenance downtime contributed to lower output.",
      observationIds: [reported.value.observationId, current.value.observationId, conflict.value.observationId, otherPeriod.value.observationId, otherUnit.value.observationId],
      canonicalObjectIds: [machine.value.canonicalObjectId],
      evidenceRoles: [
        { observationId: reported.value.observationId, role: "NEUTRAL" },
        { observationId: current.value.observationId, role: "SUPPORTING" },
        { observationId: conflict.value.observationId, role: "CONFLICTING" },
      ],
      now: T0,
    });
    assert.equal(hypothesis.ok, true);
    if (!hypothesis.ok) return;
    const beforeObject = JSON.stringify(getCanonicalObject(company.workspaceId, machine.value.canonicalObjectId));
    const beforeRevision = canonicalObjectRevision();
    const beforeJournal = listCanonicalMutations().length;
    const beforeRelationships = listCanonicalRelationships(company.workspaceId).length;
    const beforeGoals = listDecisionGoals(company.workspaceId, production.value.deckId).length;
    const beforeSnapshot = JSON.stringify(readCommittedDatasetSnapshot(company.workspaceId, maintenanceData.sourceContextId));
    const reading = resolveCausalInvestigationEvidence({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
    });
    const again = resolveCausalInvestigationEvidence({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
    });
    assert.equal(reading.status, "ready");
    assert.deepEqual(reading, again);
    if (reading.status !== "ready") return;
    const byId = new Map(reading.report.items.map((item) => [item.observationId, item]));
    const reportedItem = byId.get(reported.value.observationId);
    const currentItem = byId.get(current.value.observationId);
    const conflictItem = byId.get(conflict.value.observationId);
    assert.equal(reportedItem?.availability, "MANAGER_REPORTED");
    assert.equal(reportedItem?.managerRole, "NEUTRAL");
    assert.equal(reportedItem?.resolvedValue, null);
    assert.equal(currentItem?.availability, "CONFLICTING");
    assert.equal(currentItem?.managerRole, "SUPPORTING");
    assert.equal(currentItem?.resolvedValue, "120");
    assert.equal(currentItem?.datasetId, productionData.sourceContextId);
    assert.equal(currentItem?.storedImportId, "import-cause-1");
    assert.equal(currentItem?.currentImportId, "import-cause-1");
    assert.equal(currentItem?.sourceKey, "CNC-A");
    assert.equal(currentItem?.measurementId, "capacityPerHour");
    assert.equal(currentItem?.canonicalValue, "120");
    assert.equal(conflictItem?.managerRole, "CONFLICTING");
    assert.equal(conflictItem?.resolvedValue, "90");
    assert.equal(conflictItem?.canonicalValue, "120");
    assert.equal(conflictItem?.comparisonStatus, "CONFLICTING");
    assert.equal(conflictItem?.currentImportId, "import-cause-2");
    assert.equal(byId.get(otherPeriod.value.observationId)?.comparisonStatus, "INSUFFICIENT_COMPARABILITY");
    assert.equal(byId.get(otherUnit.value.observationId)?.comparisonStatus, "INSUFFICIENT_COMPARABILITY");
    assert.equal(byId.get(otherPeriod.value.observationId)?.availability, "CURRENT");
    assert.equal(reading.report.evidenceSupportedCausal, false);
    assert.notEqual(reading.report.causalLadder, "EVIDENCE_SUPPORTED_CAUSAL");
    assert.equal(JSON.stringify(getCanonicalObject(company.workspaceId, machine.value.canonicalObjectId)), beforeObject);
    assert.equal(canonicalObjectRevision(), beforeRevision);
    assert.equal(listCanonicalMutations().length, beforeJournal);
    assert.equal(listCanonicalRelationships(company.workspaceId).length, beforeRelationships);
    assert.equal(listDecisionGoals(company.workspaceId, production.value.deckId).length, beforeGoals);
    assert.equal(JSON.stringify(readCommittedDatasetSnapshot(company.workspaceId, maintenanceData.sourceContextId)), beforeSnapshot);
    assert.equal(hypothesis.value.status, "PROPOSED");
    const hidden = resolveCausalInvestigationEvidence({
      workspaceId: company.workspaceId,
      deckId: finance.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
    });
    assert.equal(hidden.status, "blocked");
    if (hidden.status !== "blocked") return;
    assert.equal(hidden.reason, "wrong-deck");
    const executive = resolveCausalInvestigationEvidence({
      workspaceId: company.workspaceId,
      deckId: NEXORA_EXECUTIVE_DECK_ID,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
    });
    assert.equal(executive.status, "blocked");
    assert.equal(resolveCausalInvestigationEvidence({
      workspaceId: "company-b",
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
    }).status, "blocked");
    const replaced = commitCsv(company.workspaceId, "maintenance_capacity.csv", maintenanceCsv.replace(",90,", ",110,"), "import-cause-3", maintenanceData.sourceContextId);
    assert.equal(replaced.importId, "import-cause-3");
    const stale = resolveCausalInvestigationEvidence({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
    });
    assert.equal(stale.status, "ready");
    if (stale.status !== "ready") return;
    const staleItem = stale.report.items.find((item) => item.observationId === conflict.value.observationId);
    assert.equal(staleItem?.availability, "STALE_IMPORT");
    assert.equal(staleItem?.storedImportId, "import-cause-2");
    assert.equal(staleItem?.currentImportId, "import-cause-3");
    assert.equal(staleItem?.resolvedValue, null);
    assert.equal(staleItem?.managerRole, "CONFLICTING");
    assert.equal(getCausalHypothesis(company.workspaceId, hypothesis.value.hypothesisId)?.status, "PROPOSED");
    assert.equal(removeManagerDatasetReference({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      datasetId: productionData.sourceContextId,
    }).ok, true);
    const detached = resolveCausalInvestigationEvidence({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
    });
    assert.equal(detached.status, "ready");
    if (detached.status !== "ready") return;
    const detachedItem = detached.report.items.find((item) => item.observationId === current.value.observationId);
    assert.equal(detachedItem?.availability, "DETACHED");
    assert.equal(detachedItem?.resolvedValue, null);
    assert.equal(removeCanonicalObjectFromDeck({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      canonicalObjectId: machine.value.canonicalObjectId,
    }).ok, true);
    const hiddenObject = resolveCausalInvestigationEvidence({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
    });
    assert.equal(hiddenObject.status, "ready");
    if (hiddenObject.status !== "ready") return;
    assert.equal(hiddenObject.report.items.every((item) => item.objectName == null), true);
    assert.equal(hiddenObject.report.items.every((item) => item.canonicalValue == null), true);
  } finally {
    deleteWorkspace(company.workspaceId);
    resetWorkspaceRegistryForTests();
    resetDeckRegistryForTests();
    resetCsvRealDataImportStoreForTests();
    setDeckRegistryStorageForTests(null);
    setDeckDatasetReferenceStorageForTests(null);
  }
});

test("missing, deleted, and archived evidence stay explicit", () => {
  resetWorkspaceRegistryForTests();
  resetDeckRegistryForTests();
  resetCsvRealDataImportStoreForTests();
  const store = memory();
  setDeckRegistryStorageForTests(store);
  setDeckDatasetReferenceStorageForTests(store);
  setup();
  const company = createManagerWorkspaceFromEntry({ name: "NPA Evidence Missing", kind: "BUSINESS" });
  assert.ok(company);
  if (!company) return;
  try {
    const production = createDeck({ workspaceId: company.workspaceId, name: "Production", kind: "DEPARTMENT" });
    assert.equal(production.ok, true);
    if (!production.ok) return;
    const machine = createCanonicalObject({
      workspaceId: company.workspaceId,
      objectType: "MACHINE",
      displayName: "CNC Machine A",
      deckId: production.value.deckId,
    });
    assert.equal(machine.ok, true);
    if (!machine.ok) return;
    const rowCsv = "machine_id,machine_name,capacity,Production Used Capacity,Production Total Capacity\nCNC-A,CNC Machine A,120,120,120\n";
    const fieldCsv = "machine_id,overtimeHours,Production Used Capacity,Production Total Capacity\nCNC-A,4,120,120\n";
    const goneCsv = "machine_id,materialCost,Production Used Capacity,Production Total Capacity\nMAT-1,40,1,1\n";
    const brokenCsv = "machine_id,capacity,Production Used Capacity,Production Total Capacity\nCNC-A,120,120,120\n";
    const foreignCsv = "machine_id,capacity,Production Used Capacity,Production Total Capacity\nCNC-A,80,80,120\n";
    const unmappedCsv = "machine_id,capacityHours,outputRate,Production Used Capacity,Production Total Capacity\nCNC-A,10,20,120,120\n";
    const dataset = commitCsv(company.workspaceId, "production_capacity.csv", rowCsv, "import-cause-1");
    const fieldDataset = commitCsv(company.workspaceId, "overtime.csv", fieldCsv, "import-field");
    const missingDatasetSource = commitCsv(company.workspaceId, "purchasing.csv", goneCsv, "import-missing");
    const corruptDataset = commitCsv(company.workspaceId, "corrupt_capacity.csv", brokenCsv, "import-corrupt");
    const unsupportedDataset = commitCsv(company.workspaceId, "unsupported_capacity.csv", foreignCsv, "import-unsupported");
    const unmappedDataset = commitCsv(company.workspaceId, "unmapped_measures.csv", unmappedCsv, "import-unmapped");
    for (const source of [dataset, fieldDataset, missingDatasetSource, corruptDataset, unsupportedDataset, unmappedDataset]) {
      assert.equal(assignManagerDatasetReference({ workspaceId: company.workspaceId, deckId: production.value.deckId, datasetId: source.sourceContextId }).ok, true);
    }
    const investigation = createCausalInvestigation({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      title: "Missing evidence",
      problemStatement: "Some citations cannot be read.",
    });
    assert.equal(investigation.ok, true);
    if (!investigation.ok) return;
    const missingRow = createCausalObservation({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      statement: "The source key is absent.",
      canonicalObjectId: machine.value.canonicalObjectId,
      datasetReference: { datasetId: dataset.sourceContextId, importId: "import-cause-1", sourceKey: "CNC-A", fieldName: "capacity" },
    });
    const missingField = createCausalObservation({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      statement: "The field is absent.",
      canonicalObjectId: machine.value.canonicalObjectId,
      datasetReference: { datasetId: fieldDataset.sourceContextId, importId: "import-field", sourceKey: "CNC-A", fieldName: "overtimeHours" },
    });
    const missingDataset = createCausalObservation({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      statement: "No purchasing dataset is committed.",
      datasetReference: { datasetId: missingDatasetSource.sourceContextId, importId: "import-missing", sourceKey: "MAT-1", fieldName: "materialCost" },
    });
    const removedObservation = createCausalObservation({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      statement: "A deleted observation is not current evidence.",
      canonicalObjectId: machine.value.canonicalObjectId,
    });
    const archived = createCausalObservation({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      statement: "An archived observation keeps its identity.",
      canonicalObjectId: machine.value.canonicalObjectId,
      datasetReference: { datasetId: dataset.sourceContextId, importId: "import-cause-1", sourceKey: "CNC-A", fieldName: "capacity" },
    });
    const corruptObservation = createCausalObservation({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      statement: "The snapshot cannot be read.",
      datasetReference: { datasetId: corruptDataset.sourceContextId, importId: "import-corrupt", sourceKey: "CNC-A", fieldName: "capacity" },
    });
    const unsupportedObservation = createCausalObservation({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      statement: "The dataset schema is not the committed version.",
      datasetReference: { datasetId: unsupportedDataset.sourceContextId, importId: "import-unsupported", sourceKey: "CNC-A", fieldName: "capacity" },
    });
    const similar = createCausalObservation({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      statement: "A similarly named field is not the approved measurement.",
      canonicalObjectId: machine.value.canonicalObjectId,
      datasetReference: { datasetId: unmappedDataset.sourceContextId, importId: "import-unmapped", sourceKey: "CNC-A", fieldName: "capacityHours" },
      unit: "hours",
      periodLabel: "current",
    });
    const otherMeasure = createCausalObservation({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      statement: "A second unmapped field stays separate.",
      canonicalObjectId: machine.value.canonicalObjectId,
      datasetReference: { datasetId: unmappedDataset.sourceContextId, importId: "import-unmapped", sourceKey: "CNC-A", fieldName: "outputRate" },
      unit: "hours",
      periodLabel: "current",
    });
    assert.equal(missingRow.ok && missingField.ok && missingDataset.ok && archived.ok && corruptObservation.ok && unsupportedObservation.ok && similar.ok && otherMeasure.ok && removedObservation.ok, true);
    if (!missingRow.ok || !missingField.ok || !missingDataset.ok || !archived.ok || !corruptObservation.ok || !unsupportedObservation.ok || !similar.ok || !otherMeasure.ok || !removedObservation.ok) return;
    const hypothesis = createCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      statement: "A proposed explanation still lacks several inputs.",
      observationIds: [missingRow.value.observationId, missingField.value.observationId, missingDataset.value.observationId, archived.value.observationId, removedObservation.value.observationId, corruptObservation.value.observationId, unsupportedObservation.value.observationId, similar.value.observationId, otherMeasure.value.observationId],
      canonicalObjectIds: [machine.value.canonicalObjectId],
    });
    assert.equal(hypothesis.ok, true);
    if (!hypothesis.ok) return;
    assert.equal(transitionCausalObservation({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      observationId: archived.value.observationId,
      lifecycleStatus: "ARCHIVED",
    }).ok, true);
    assert.equal(transitionCausalObservation({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      observationId: removedObservation.value.observationId,
      lifecycleStatus: "DELETED",
    }).ok, true);
    mutateImport(dataset.sourceContextId, (entry) => { entry.prepared.parse.records = []; });
    mutateImport(fieldDataset.sourceContextId, (entry) => {
      const column = entry.prepared.parse.columns.find((item) => item.name === "overtimeHours");
      assert.ok(column);
      if (column) column.name = "retiredHours";
    });
    const exported = JSON.parse(JSON.stringify(exportCsvRealDataImportState())) as CsvRealDataImportExportedState;
    hydrateCsvRealDataImportState({
      ...exported,
      committed: exported.committed.filter((entry) => entry.sourceContextId !== missingDatasetSource.sourceContextId),
    });
    mutateImport(corruptDataset.sourceContextId, (entry) => { entry.prepared.parse.valid = false; });
    mutateImport(unsupportedDataset.sourceContextId, (entry) => {
      if (entry.prepared.snapshot) entry.prepared.snapshot.source.identity.schemaVersion = "rdi2.csv.v9";
    });
    const reading = resolveCausalInvestigationEvidence({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
    });
    assert.equal(reading.status, "ready");
    if (reading.status !== "ready") return;
    const byId = new Map(reading.report.items.map((item) => [item.observationId, item]));
    assert.equal(byId.get(missingRow.value.observationId)?.availability, "MISSING_SOURCE");
    assert.equal(byId.get(missingField.value.observationId)?.availability, "MISSING_FIELD");
    assert.equal(byId.get(missingDataset.value.observationId)?.availability, "MISSING");
    assert.equal(byId.get(missingDataset.value.observationId)?.resolvedValue, null);
    assert.equal(byId.get(archived.value.observationId)?.availability, "ARCHIVED");
    assert.equal(byId.get(archived.value.observationId)?.resolvedValue, null);
    assert.equal(byId.get(removedObservation.value.observationId)?.availability, "DELETED");
    assert.equal(byId.get(removedObservation.value.observationId)?.resolvedValue, null);
    assert.equal(byId.get(corruptObservation.value.observationId)?.availability, "CORRUPT");
    assert.equal(byId.get(corruptObservation.value.observationId)?.resolvedValue, null);
    assert.equal(byId.get(unsupportedObservation.value.observationId)?.availability, "UNSUPPORTED_VERSION");
    assert.equal(byId.get(unsupportedObservation.value.observationId)?.resolvedValue, null);
    assert.equal(byId.get(similar.value.observationId)?.availability, "CURRENT");
    assert.equal(byId.get(similar.value.observationId)?.measurementId, "capacityHours");
    assert.equal(byId.get(similar.value.observationId)?.resolvedValue, "10");
    assert.equal(byId.get(otherMeasure.value.observationId)?.availability, "CURRENT");
    assert.equal(byId.get(otherMeasure.value.observationId)?.resolvedValue, "20");
    assert.notEqual(byId.get(similar.value.observationId)?.comparisonStatus, "CONFLICTING");
    assert.notEqual(byId.get(otherMeasure.value.observationId)?.comparisonStatus, "CONFLICTING");
    const removed = removeCsvRealDataImport({
      workspaceId: company.workspaceId,
      sourceContextId: dataset.sourceContextId,
      activeSourceContextId: null,
      removedAt: T0,
    });
    assert.equal(removed.removed, true, removed.reason);
    const deleted = resolveCausalInvestigationEvidence({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
    });
    assert.equal(deleted.status, "ready");
    if (deleted.status !== "ready") return;
    assert.equal(deleted.report.items.find((item) => item.observationId === missingRow.value.observationId)?.availability, "DELETED");
    assert.equal(deleted.report.items.find((item) => item.observationId === missingRow.value.observationId)?.resolvedValue, null);
    assert.equal(deleteCanonicalObject({ workspaceId: company.workspaceId, canonicalObjectId: machine.value.canonicalObjectId }).ok, true);
    const gone = resolveCausalInvestigationEvidence({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
    });
    assert.equal(gone.status, "ready");
    if (gone.status !== "ready") return;
    assert.equal(gone.report.items.every((item) => item.canonicalObjectId == null || item.objectState === "deleted"), true);
    assert.equal(gone.report.items.every((item) => item.objectName == null), true);
    assert.equal(getCsvRealDataImport(company.workspaceId, dataset.sourceContextId), null);
  } finally {
    deleteWorkspace(company.workspaceId);
    resetWorkspaceRegistryForTests();
    resetDeckRegistryForTests();
    resetCsvRealDataImportStoreForTests();
    setDeckRegistryStorageForTests(null);
    setDeckDatasetReferenceStorageForTests(null);
  }
});

test("financial citations report available rows and missing material cost without a causal conclusion", () => {
  resetWorkspaceRegistryForTests();
  resetDeckRegistryForTests();
  resetCsvRealDataImportStoreForTests();
  const store = memory();
  setDeckRegistryStorageForTests(store);
  setDeckDatasetReferenceStorageForTests(store);
  setup();
  const company = createManagerWorkspaceFromEntry({ name: "NPA Profit Evidence", kind: "BUSINESS" });
  assert.ok(company);
  if (!company) return;
  try {
    const finance = createDeck({ workspaceId: company.workspaceId, name: "Finance", kind: "DEPARTMENT" });
    assert.equal(finance.ok, true);
    if (!finance.ok) return;
    const revenue = commitCsv(company.workspaceId, "revenue.csv", "period,revenue,Production Used Capacity,Production Total Capacity\nprevious,1000000,1,1\ncurrent,1200000,1,1\n", "import-revenue");
    const profit = commitCsv(company.workspaceId, "operating_profit.csv", "period,operatingProfit,Production Used Capacity,Production Total Capacity\nprevious,150000,1,1\ncurrent,108000,1,1\n", "import-profit");
    assert.equal(assignManagerDatasetReference({ workspaceId: company.workspaceId, deckId: finance.value.deckId, datasetId: revenue.sourceContextId }).ok, true);
    assert.equal(assignManagerDatasetReference({ workspaceId: company.workspaceId, deckId: finance.value.deckId, datasetId: profit.sourceContextId }).ok, true);
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
    const purchasing = commitCsv(company.workspaceId, "purchasing.csv", "period,materialCost,Production Used Capacity,Production Total Capacity\ncurrent,400000,1,1\n", "import-material");
    assert.equal(assignManagerDatasetReference({ workspaceId: company.workspaceId, deckId: finance.value.deckId, datasetId: purchasing.sourceContextId }).ok, true);
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
      statement: "Higher material costs contributed to declining operating margin.",
      observationIds: [previousRevenue.value.observationId, currentRevenue.value.observationId, currentProfit.value.observationId, material.value.observationId, narrative.value.observationId],
      evidenceRoles: [{ observationId: narrative.value.observationId, role: "SUPPORTING" }],
    });
    assert.equal(hypothesis.ok, true);
    if (!hypothesis.ok) return;
    const accepted = transitionCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: finance.value.deckId,
      hypothesisId: hypothesis.value.hypothesisId,
      status: "NEEDS_EVIDENCE",
    });
    assert.equal(accepted.ok, true);
    const withoutPurchasing = JSON.parse(JSON.stringify(exportCsvRealDataImportState())) as CsvRealDataImportExportedState;
    hydrateCsvRealDataImportState({
      ...withoutPurchasing,
      committed: withoutPurchasing.committed.filter((entry) => entry.sourceContextId !== purchasing.sourceContextId),
    });
    const reading = resolveCausalInvestigationEvidence({
      workspaceId: company.workspaceId,
      deckId: finance.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
    });
    assert.equal(reading.status, "ready");
    if (reading.status !== "ready") return;
    const values = new Map(reading.report.items.map((item) => [item.statement, item]));
    assert.equal(values.get("Previous revenue.")?.resolvedValue, "1000000");
    assert.equal(values.get("Current revenue.")?.resolvedValue, "1200000");
    assert.equal(values.get("Current operating profit.")?.resolvedValue, "108000");
    assert.equal(values.get("Material cost is not yet committed.")?.availability, "MISSING");
    assert.equal(values.get("A manager reports that material prices may have risen.")?.availability, "MANAGER_REPORTED");
    assert.equal(values.get("A manager reports that material prices may have risen.")?.managerRole, "SUPPORTING");
    assert.equal(reading.report.evidenceSupportedCausal, false);
    assert.notEqual(reading.report.causalLadder, "EVIDENCE_SUPPORTED_CAUSAL");
    assert.equal(reading.report.hypothesisStatus, "NEEDS_EVIDENCE");
  } finally {
    deleteWorkspace(company.workspaceId);
    resetWorkspaceRegistryForTests();
    resetDeckRegistryForTests();
    resetCsvRealDataImportStoreForTests();
    setDeckRegistryStorageForTests(null);
    setDeckDatasetReferenceStorageForTests(null);
  }
});

test("corrupt and protected investigation authorities do not become empty success", () => {
  const store = setup();
  store.setItem(CANONICAL_CAUSAL_INVESTIGATION_STORAGE_KEY, "{");
  resetCausalInvestigationDomainForTests(store);
  assert.equal(canonicalCausalInvestigationAuthorityStatus(), "corrupt");
  const corrupt = resolveCausalInvestigationEvidence({
    workspaceId: "company-a",
    deckId: "production",
    investigationId: "cause:company-a:1",
    hypothesisId: "hypothesis:company-a:1",
  });
  assert.deepEqual(corrupt, { status: "blocked", reason: "corrupt" });
  assert.equal(store.getItem(CANONICAL_CAUSAL_INVESTIGATION_STORAGE_KEY), "{");
  const versioned = memory();
  versioned.setItem(CANONICAL_CAUSAL_INVESTIGATION_STORAGE_KEY, JSON.stringify({
    identity: "NPA-T NEXOCAUSE-DOMAIN-FOUNDATION:1/CanonicalCausalInvestigationDomain",
    schemaVersion: 2,
    workspaces: {},
  }));
  resetCausalInvestigationDomainForTests(versioned);
  assert.equal(resolveCausalInvestigationEvidence({
    workspaceId: "company-a",
    deckId: "production",
    investigationId: "cause:company-a:1",
    hypothesisId: "hypothesis:company-a:1",
  }).status, "blocked");
  setup();
  assert.equal(resolveCausalInvestigationEvidence({
    workspaceId: DEMO_WORKSPACE_ID,
    deckId: "production",
    investigationId: "cause:demo_workspace:1",
    hypothesisId: "hypothesis:demo_workspace:1",
  }).status, "blocked");
  assert.equal(resolveCausalInvestigationEvidence({
    workspaceId: BUSINESS_DEMO_WORKSPACE_ID,
    deckId: "production",
    investigationId: "cause:business_demo_workspace:1",
    hypothesisId: "hypothesis:business_demo_workspace:1",
  }).status, "blocked");
  const objects = memory();
  objects.setItem(CANONICAL_OBJECT_STORAGE_KEY, "{");
  resetCanonicalObjectsForTests(objects);
  setup();
  resetCanonicalObjectsForTests(objects);
  assert.deepEqual(resolveCausalInvestigationEvidence({
    workspaceId: "company-a",
    deckId: "production",
    investigationId: "cause:company-a:1",
    hypothesisId: "hypothesis:company-a:1",
  }), { status: "blocked", reason: "corrupt" });
  const unsupportedObjects = memory();
  unsupportedObjects.setItem(CANONICAL_OBJECT_STORAGE_KEY, JSON.stringify({
    identity: canonicalObjectRegistryIdentity,
    schemaVersion: 2,
    workspaces: {},
  }));
  setup();
  resetCanonicalObjectsForTests(unsupportedObjects);
  assert.deepEqual(resolveCausalInvestigationEvidence({
    workspaceId: "company-a",
    deckId: "production",
    investigationId: "cause:company-a:1",
    hypothesisId: "hypothesis:company-a:1",
  }), { status: "blocked", reason: "unsupported-version" });
});

test("evidence resolution is bounded and ignores duplicate observation citations", () => {
  resetWorkspaceRegistryForTests();
  resetDeckRegistryForTests();
  const store = setup();
  setDeckRegistryStorageForTests(store);
  setDeckDatasetReferenceStorageForTests(store);
  const company = createManagerWorkspaceFromEntry({ name: "NPA Evidence Bounds", kind: "BUSINESS" });
  assert.ok(company);
  if (!company) return;
  try {
    const production = createDeck({ workspaceId: company.workspaceId, name: "Production", kind: "DEPARTMENT" });
    assert.equal(production.ok, true);
    if (!production.ok) return;
    const investigation = createCausalInvestigation({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      title: "Bounded evidence",
      problemStatement: "The reading stays inside its limit.",
    });
    assert.equal(investigation.ok, true);
    if (!investigation.ok) return;
    const ids: string[] = [];
    for (let index = 0; index < 101; index += 1) {
      const observation = createCausalObservation({
        workspaceId: company.workspaceId,
        deckId: production.value.deckId,
        investigationId: investigation.value.investigationId,
        statement: `Manager note ${index}`,
      });
      assert.equal(observation.ok, true);
      if (!observation.ok) return;
      ids.push(observation.value.observationId);
    }
    const hypothesis = createCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      statement: "The notes do not establish a cause.",
      observationIds: ids,
    });
    assert.equal(hypothesis.ok, true);
    if (!hypothesis.ok) return;
    const raw = JSON.parse(store.getItem(CANONICAL_CAUSAL_INVESTIGATION_STORAGE_KEY) ?? "{}") as {
      workspaces: Record<string, { hypotheses: { observationIds: string[] }[] }>;
    };
    raw.workspaces[company.workspaceId]!.hypotheses[0]!.observationIds.push(ids[0]!);
    store.setItem(CANONICAL_CAUSAL_INVESTIGATION_STORAGE_KEY, JSON.stringify(raw));
    resetCausalInvestigationDomainForTests(store);
    const reading = resolveCausalInvestigationEvidence({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      hypothesisId: hypothesis.value.hypothesisId,
    });
    assert.equal(reading.status, "ready");
    if (reading.status !== "ready") return;
    assert.equal(reading.report.items.length, 100);
    assert.equal(reading.report.truncated, true);
    assert.equal(reading.report.omittedObservations, 1);
    assert.equal(reading.report.duplicateReferences, 1);
    assert.equal(reading.report.evidenceSupportedCausal, false);
    assert.equal(reading.report.causalLadder, "INSUFFICIENT");
    assert.equal(canonicalCausalInvestigationIdentity.length > 0, true);
  } finally {
    deleteWorkspace(company.workspaceId);
    resetWorkspaceRegistryForTests();
    resetDeckRegistryForTests();
    setDeckRegistryStorageForTests(null);
    setDeckDatasetReferenceStorageForTests(null);
  }
});
