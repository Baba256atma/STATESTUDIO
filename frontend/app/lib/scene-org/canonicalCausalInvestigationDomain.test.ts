import assert from "node:assert/strict";
import test from "node:test";
import {
  commitPreparedCsvRealDataImport,
  getCsvRealDataImport,
  resetCsvRealDataImportStoreForTests,
} from "../data-reality/csvRealDataImportStore.ts";
import {
  parseCsvDeterministically,
  prepareCsvRealDataImport,
  suggestCsvColumnMappings,
  updateCsvColumnMapping,
} from "../data-reality/csvRealDataVerticalSlice.ts";
import { assignManagerDatasetReference } from "../deck/nexoraDeckDatasetReferenceAuthority.ts";
import { setDeckDatasetReferenceStorageForTests } from "../deck/nexoraDeckDatasetReferenceRegistry.ts";
import { createDeck, resetDeckRegistryForTests, setDeckRegistryStorageForTests } from "../deck/nexoraDeckRegistry.ts";
import { NEXORA_EXECUTIVE_DECK_ID } from "../deck/nexoraDeckIdentityContract.ts";
import { createManagerWorkspaceFromEntry } from "../workspace/managerWorkspaceEntry.ts";
import { BUSINESS_DEMO_WORKSPACE_ID, DEMO_WORKSPACE_ID } from "../workspace/workspaceRegistryContract.ts";
import { deleteWorkspace, resetWorkspaceRegistryForTests } from "../workspace/workspaceRegistryStore.ts";
import {
  CANONICAL_CAUSAL_INVESTIGATION_STORAGE_KEY,
  CAUSAL_INVESTIGATION_BOUNDARY,
  canonicalCausalInvestigationAuthorityStatus,
  createCausalHypothesis,
  createCausalInvestigation,
  createCausalObservation,
  forgetWorkspaceCausalInvestigations,
  getCausalHypothesis,
  getCausalInvestigation,
  getCausalObservation,
  listCausalHypotheses,
  listCausalInvestigations,
  listCausalObservations,
  resetCausalInvestigationDomainForTests,
  resolveCausalObjectReference,
  transitionCausalHypothesis,
  transitionCausalInvestigation,
  transitionCausalObservation,
  updateCausalHypothesis,
  updateCausalInvestigation,
  updateCausalObservation,
} from "./canonicalCausalInvestigationDomain.ts";
import { listCanonicalMutations, resetCanonicalMutationJournalForTests } from "./canonicalMutationJournal.ts";
import {
  archiveCanonicalObject,
  createCanonicalObject,
  deleteCanonicalObject,
  getCanonicalObject,
  resetCanonicalObjectsForTests,
} from "./canonicalObjectRegistry.ts";
import { listDecisionGoals, resetDecisionDomainForTests } from "./canonicalDecisionDomain.ts";
import { listCanonicalRelationships, resetCanonicalRelationshipsForTests } from "./canonicalRelationshipGraph.ts";

const T0 = "2026-11-09T18:00:00.000Z";

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

function setup(store: Storage = memory()) {
  resetCanonicalObjectsForTests(store);
  resetCanonicalRelationshipsForTests(store);
  resetDecisionDomainForTests(store);
  resetCanonicalMutationJournalForTests(store);
  resetCausalInvestigationDomainForTests(store);
  return store;
}

test("investigation, observation, and hypothesis identities stay stable and are not reused", () => {
  const store = setup();
  const machine = createCanonicalObject({
    workspaceId: "company a",
    objectType: "MACHINE",
    displayName: "CNC Machine A",
    deckId: "production",
    now: T0,
  });
  assert.equal(machine.ok, true);
  if (!machine.ok) return;
  const investigation = createCausalInvestigation({
    workspaceId: "company a",
    deckId: "production",
    title: "Why did production efficiency decline?",
    problemStatement: "Effective output fell while the machine remained assigned.",
    now: T0,
  });
  assert.equal(investigation.ok, true);
  if (!investigation.ok) return;
  assert.equal(investigation.value.investigationId, "cause:company%20a:1");
  assert.equal(investigation.value.provenance, "MANAGER_DECLARED");
  assert.equal(investigation.value.lifecycleStatus, "DRAFT");
  const renamed = updateCausalInvestigation({
    workspaceId: "company a",
    deckId: "production",
    investigationId: investigation.value.investigationId,
    title: "Efficiency decline",
    now: T0,
  });
  assert.equal(renamed.ok && renamed.value.investigationId, investigation.value.investigationId);
  const observation = createCausalObservation({
    workspaceId: "company a",
    deckId: "production",
    investigationId: investigation.value.investigationId,
    statement: "CNC Machine A experienced reduced effective output.",
    canonicalObjectId: machine.value.canonicalObjectId,
    now: T0,
  });
  assert.equal(observation.ok, true);
  if (!observation.ok) return;
  assert.equal(observation.value.observationId, "observation:company%20a:1");
  assert.equal(observation.value.canonicalObjectId, machine.value.canonicalObjectId);
  assert.equal(observation.value.datasetReference, null);
  const hypothesis = createCausalHypothesis({
    workspaceId: "company a",
    deckId: "production",
    investigationId: investigation.value.investigationId,
    statement: "Unexpected maintenance downtime contributed to lower output.",
    observationIds: [observation.value.observationId],
    canonicalObjectIds: [machine.value.canonicalObjectId],
    assumptions: ["The output change is the condition under investigation."],
    limitations: ["Downtime hours are not yet cited from a committed Dataset."],
    evidenceRoles: [{ observationId: observation.value.observationId, role: "SUPPORTING" }],
    now: T0,
  });
  assert.equal(hypothesis.ok, true);
  if (!hypothesis.ok) return;
  assert.equal(hypothesis.value.hypothesisId, "hypothesis:company%20a:1");
  assert.equal(hypothesis.value.status, "PROPOSED");
  assert.equal(hypothesis.value.evidenceSupportedCausal, false);
  assert.equal(hypothesis.value.evidenceRoles[0]?.role, "SUPPORTING");
  const archived = transitionCausalInvestigation({
    workspaceId: "company a",
    deckId: "production",
    investigationId: investigation.value.investigationId,
    lifecycleStatus: "ARCHIVED",
    now: T0,
  });
  assert.equal(archived.ok, true);
  const next = createCausalInvestigation({
    workspaceId: "company a",
    deckId: "production",
    title: "Second question",
    problemStatement: "A later investigation uses the next identity.",
    now: T0,
  });
  assert.equal(next.ok && next.value.investigationId, "cause:company%20a:2");
  assert.equal(getCausalInvestigation("company a", "cause:company%20a:1")?.lifecycleStatus, "ARCHIVED");
  resetCausalInvestigationDomainForTests(store);
  assert.equal(getCausalHypothesis("company a", hypothesis.value.hypothesisId)?.statement, hypothesis.value.statement);
  assert.equal(getCausalObservation("company a", observation.value.observationId)?.statement, observation.value.statement);
});

test("lifecycle transitions reject skips, archived edits, and rejected acceptance", () => {
  setup();
  const machine = createCanonicalObject({
    workspaceId: "company-a",
    objectType: "MACHINE",
    displayName: "CNC Machine A",
    deckId: "production",
  });
  assert.equal(machine.ok, true);
  if (!machine.ok) return;
  const investigation = createCausalInvestigation({
    workspaceId: "company-a",
    deckId: "production",
    title: "Efficiency",
    problemStatement: "Output declined.",
  });
  assert.equal(investigation.ok, true);
  if (!investigation.ok) return;
  const skipped = transitionCausalInvestigation({
    workspaceId: "company-a",
    deckId: "production",
    investigationId: investigation.value.investigationId,
    lifecycleStatus: "ACCEPTED_FOR_SCENARIO",
  });
  assert.equal(skipped.ok, false);
  if (skipped.ok) return;
  assert.equal(skipped.reason, "invalid-status");
  const review = transitionCausalInvestigation({
    workspaceId: "company-a",
    deckId: "production",
    investigationId: investigation.value.investigationId,
    lifecycleStatus: "UNDER_REVIEW",
  });
  assert.equal(review.ok, true);
  const accepted = transitionCausalInvestigation({
    workspaceId: "company-a",
    deckId: "production",
    investigationId: investigation.value.investigationId,
    lifecycleStatus: "ACCEPTED_FOR_SCENARIO",
  });
  assert.equal(accepted.ok && accepted.value.lifecycleStatus, "ACCEPTED_FOR_SCENARIO");
  assert.equal(CAUSAL_INVESTIGATION_BOUNDARY.evidenceSupportedCausal, false);
  const observation = createCausalObservation({
    workspaceId: "company-a",
    deckId: "production",
    investigationId: investigation.value.investigationId,
    statement: "Output was lower in the current period.",
    canonicalObjectId: machine.value.canonicalObjectId,
  });
  assert.equal(observation.ok, true);
  if (!observation.ok) return;
  const hypothesis = createCausalHypothesis({
    workspaceId: "company-a",
    deckId: "production",
    investigationId: investigation.value.investigationId,
    statement: "Downtime contributed to lower output.",
    observationIds: [observation.value.observationId],
    canonicalObjectIds: [machine.value.canonicalObjectId],
  });
  assert.equal(hypothesis.ok, true);
  if (!hypothesis.ok) return;
  assert.equal(transitionCausalHypothesis({
    workspaceId: "company-a",
    deckId: "production",
    hypothesisId: hypothesis.value.hypothesisId,
    status: "ACCEPTED_FOR_SCENARIO",
  }).ok, false);
  assert.equal(transitionCausalHypothesis({
    workspaceId: "company-a",
    deckId: "production",
    hypothesisId: hypothesis.value.hypothesisId,
    status: "NEEDS_EVIDENCE",
  }).ok, true);
  assert.equal(transitionCausalHypothesis({
    workspaceId: "company-a",
    deckId: "production",
    hypothesisId: hypothesis.value.hypothesisId,
    status: "UNDER_REVIEW",
  }).ok, true);
  const rejected = transitionCausalHypothesis({
    workspaceId: "company-a",
    deckId: "production",
    hypothesisId: hypothesis.value.hypothesisId,
    status: "REJECTED",
  });
  assert.equal(rejected.ok, true);
  assert.equal(transitionCausalHypothesis({
    workspaceId: "company-a",
    deckId: "production",
    hypothesisId: hypothesis.value.hypothesisId,
    status: "ACCEPTED_FOR_SCENARIO",
  }).ok, false);
  const returned = transitionCausalHypothesis({
    workspaceId: "company-a",
    deckId: "production",
    hypothesisId: hypothesis.value.hypothesisId,
    status: "NEEDS_EVIDENCE",
  });
  assert.equal(returned.ok && returned.value.status, "NEEDS_EVIDENCE");
  assert.equal(returned.ok && returned.value.evidenceSupportedCausal, false);
  assert.equal(transitionCausalHypothesis({
    workspaceId: "company-a",
    deckId: "production",
    hypothesisId: hypothesis.value.hypothesisId,
    status: "ARCHIVED",
  }).ok, true);
  const edited = updateCausalHypothesis({
    workspaceId: "company-a",
    deckId: "production",
    hypothesisId: hypothesis.value.hypothesisId,
    statement: "Changed after archive.",
  });
  assert.equal(edited.ok, false);
  if (edited.ok) return;
  assert.equal(edited.reason, "archived");
  const archivedObservation = transitionCausalObservation({
    workspaceId: "company-a",
    deckId: "production",
    observationId: observation.value.observationId,
    lifecycleStatus: "ARCHIVED",
  });
  assert.equal(archivedObservation.ok, true);
  assert.equal(updateCausalObservation({
    workspaceId: "company-a",
    deckId: "production",
    observationId: observation.value.observationId,
    statement: "Changed after archive.",
  }).ok, false);
});

test("references stay inside one investigation, deck, and workspace", () => {
  setup();
  const production = createCanonicalObject({
    workspaceId: "company-a",
    objectType: "MACHINE",
    displayName: "CNC Machine A",
    deckId: "production",
  });
  const other = createCanonicalObject({
    workspaceId: "company-b",
    objectType: "MACHINE",
    displayName: "CNC Machine A",
    deckId: "production",
  });
  assert.equal(production.ok && other.ok, true);
  if (!production.ok || !other.ok) return;
  const first = createCausalInvestigation({
    workspaceId: "company-a",
    deckId: "production",
    title: "Production question",
    problemStatement: "Output declined in production.",
  });
  const second = createCausalInvestigation({
    workspaceId: "company-a",
    deckId: "production",
    title: "Another question",
    problemStatement: "A separate investigation.",
  });
  const finance = createCausalInvestigation({
    workspaceId: "company-a",
    deckId: "finance",
    title: "Finance question",
    problemStatement: "Finance has its own investigation.",
  });
  assert.equal(first.ok && second.ok && finance.ok, true);
  if (!first.ok || !second.ok || !finance.ok) return;
  const observation = createCausalObservation({
    workspaceId: "company-a",
    deckId: "production",
    investigationId: first.value.investigationId,
    statement: "CNC Machine A experienced reduced effective output.",
    canonicalObjectId: production.value.canonicalObjectId,
  });
  assert.equal(observation.ok, true);
  if (!observation.ok) return;
  const foreignObject = createCausalObservation({
    workspaceId: "company-a",
    deckId: "production",
    investigationId: first.value.investigationId,
    statement: "A machine from another company.",
    canonicalObjectId: other.value.canonicalObjectId,
  });
  assert.equal(foreignObject.ok, false);
  if (foreignObject.ok) return;
  assert.equal(foreignObject.reason, "cross-workspace");
  const hidden = createCausalObservation({
    workspaceId: "company-a",
    deckId: "finance",
    investigationId: finance.value.investigationId,
    statement: "Finance cites a production-only machine.",
    canonicalObjectId: production.value.canonicalObjectId,
  });
  assert.equal(hidden.ok, false);
  if (hidden.ok) return;
  assert.equal(hidden.reason, "unauthorized");
  const hypothesis = createCausalHypothesis({
    workspaceId: "company-a",
    deckId: "production",
    investigationId: second.value.investigationId,
    statement: "This hypothesis borrows another investigation's observation.",
    observationIds: [observation.value.observationId],
  });
  assert.equal(hypothesis.ok, false);
  if (hypothesis.ok) return;
  assert.equal(hypothesis.reason, "invalid-reference");
  const financeEdit = updateCausalInvestigation({
    workspaceId: "company-a",
    deckId: "finance",
    investigationId: first.value.investigationId,
    title: "Moved",
  });
  assert.equal(financeEdit.ok, false);
  if (financeEdit.ok) return;
  assert.equal(financeEdit.reason, "wrong-deck");
  assert.equal(listCausalInvestigations("company-b", "production").length, 0);
  assert.equal(listCausalInvestigations("company-a", "finance").length, 1);
  assert.equal(listCausalObservations("company-a", first.value.investigationId).length, 1);
  assert.equal(createCausalInvestigation({
    workspaceId: DEMO_WORKSPACE_ID,
    deckId: "production",
    title: "Demo",
    problemStatement: "Protected manufacturing demo.",
  }).ok, false);
  assert.equal(createCausalInvestigation({
    workspaceId: BUSINESS_DEMO_WORKSPACE_ID,
    deckId: "production",
    title: "Demo",
    problemStatement: "Protected business demo.",
  }).ok, false);
});

test("archived and deleted objects remain marked and cannot receive new references", () => {
  setup();
  const machine = createCanonicalObject({
    workspaceId: "company-a",
    objectType: "MACHINE",
    displayName: "CNC Machine A",
    deckId: "production",
  });
  assert.equal(machine.ok, true);
  if (!machine.ok) return;
  const investigation = createCausalInvestigation({
    workspaceId: "company-a",
    deckId: "production",
    title: "Efficiency",
    problemStatement: "Output declined.",
  });
  assert.equal(investigation.ok, true);
  if (!investigation.ok) return;
  const observation = createCausalObservation({
    workspaceId: "company-a",
    deckId: "production",
    investigationId: investigation.value.investigationId,
    statement: "CNC Machine A experienced reduced effective output.",
    canonicalObjectId: machine.value.canonicalObjectId,
  });
  assert.equal(observation.ok, true);
  if (!observation.ok) return;
  assert.equal(archiveCanonicalObject({ workspaceId: "company-a", canonicalObjectId: machine.value.canonicalObjectId }).ok, true);
  const archived = resolveCausalObjectReference({
    workspaceId: "company-a",
    deckId: "production",
    canonicalObjectId: machine.value.canonicalObjectId,
  });
  assert.equal(archived.state, "archived");
  assert.equal(archived.displayName, "CNC Machine A");
  assert.equal(createCausalObservation({
    workspaceId: "company-a",
    deckId: "production",
    investigationId: investigation.value.investigationId,
    statement: "A new citation of the archived machine.",
    canonicalObjectId: machine.value.canonicalObjectId,
  }).ok, false);
  assert.equal(deleteCanonicalObject({ workspaceId: "company-a", canonicalObjectId: machine.value.canonicalObjectId }).ok, true);
  const deleted = resolveCausalObjectReference({
    workspaceId: "company-a",
    deckId: "production",
    canonicalObjectId: machine.value.canonicalObjectId,
  });
  assert.equal(deleted.state, "deleted");
  assert.equal(deleted.displayName, null);
  assert.equal(getCausalObservation("company-a", observation.value.observationId)?.canonicalObjectId, machine.value.canonicalObjectId);
});

test("a cited Dataset keeps identity only and rejects the wrong deck or import", () => {
  resetWorkspaceRegistryForTests();
  resetDeckRegistryForTests();
  resetCsvRealDataImportStoreForTests();
  const store = memory();
  setDeckRegistryStorageForTests(store);
  setDeckDatasetReferenceStorageForTests(store);
  setup(store);
  const company = createManagerWorkspaceFromEntry({ name: "NPA NexoCause Foundation", kind: "BUSINESS" });
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
      now: T0,
    });
    assert.equal(machine.ok, true);
    if (!machine.ok) return;
    const csv = "machine_id,machine_name,Production Used Capacity,Production Total Capacity\nCNC-A,CNC Machine A,90,120\n";
    const parse = parseCsvDeterministically(csv);
    let mapping = suggestCsvColumnMappings(parse.columns, "import-cause-1");
    for (const column of mapping.mappings) {
      if (!column.confirmed) mapping = updateCsvColumnMapping(mapping, column.columnIndex, null);
    }
    const prepared = prepareCsvRealDataImport({
      workspaceId: company.workspaceId,
      fileName: "maintenance_capacity.csv",
      fileSize: csv.length,
      csvText: csv,
      importId: "import-cause-1",
      importedAt: T0,
    }, mapping);
    assert.equal(prepared.ready, true, prepared.errors.join("; "));
    const committed = commitPreparedCsvRealDataImport({
      prepared,
      expectedWorkspaceId: company.workspaceId,
      mode: "new",
      committedAt: T0,
    });
    assert.equal(committed.committed, true);
    if (!committed.current) return;
    assert.equal(assignManagerDatasetReference({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      datasetId: committed.current.sourceContextId,
    }).ok, true);
    const beforeObject = JSON.stringify(getCanonicalObject(company.workspaceId, machine.value.canonicalObjectId));
    const beforeJournal = listCanonicalMutations().length;
    const beforeRelationships = listCanonicalRelationships(company.workspaceId).length;
    const investigation = createCausalInvestigation({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      title: "Why did production efficiency decline?",
      problemStatement: "Effective output fell.",
      now: T0,
    });
    assert.equal(investigation.ok, true);
    if (!investigation.ok) return;
    const observation = createCausalObservation({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      statement: "CNC Machine A experienced reduced effective output.",
      canonicalObjectId: machine.value.canonicalObjectId,
      datasetReference: {
        datasetId: committed.current.sourceContextId,
        importId: "import-cause-1",
        sourceKey: "CNC-A",
        fieldName: "machine_id",
      },
      now: T0,
    });
    assert.equal(observation.ok, true);
    if (!observation.ok) return;
    assert.deepEqual(observation.value.datasetReference, {
      datasetId: committed.current.sourceContextId,
      importId: "import-cause-1",
      sourceKey: "CNC-A",
      fieldName: "machine_id",
    });
    assert.equal(JSON.stringify(observation.value).includes("90"), false);
    const financeInvestigation = createCausalInvestigation({
      workspaceId: company.workspaceId,
      deckId: finance.value.deckId,
      title: "Finance question",
      problemStatement: "Finance cannot cite a Production Dataset.",
    });
    assert.equal(financeInvestigation.ok, true);
    if (!financeInvestigation.ok) return;
    const crossDeck = createCausalObservation({
      workspaceId: company.workspaceId,
      deckId: finance.value.deckId,
      investigationId: financeInvestigation.value.investigationId,
      statement: "A finance observation cites production evidence.",
      datasetReference: { datasetId: committed.current.sourceContextId, importId: "import-cause-1" },
    });
    assert.equal(crossDeck.ok, false);
    if (crossDeck.ok) return;
    assert.equal(crossDeck.reason, "unauthorized");
    const executive = createCausalInvestigation({
      workspaceId: company.workspaceId,
      deckId: NEXORA_EXECUTIVE_DECK_ID,
      title: "Executive question",
      problemStatement: "Executive has a separate investigation list.",
    });
    assert.equal(executive.ok, true);
    assert.equal(listCausalInvestigations(company.workspaceId, NEXORA_EXECUTIVE_DECK_ID).some((entry) => entry.investigationId === investigation.value.investigationId), false);
    const staleImport = createCausalObservation({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      statement: "The import identity does not match.",
      datasetReference: { datasetId: committed.current.sourceContextId, importId: "import-old" },
    });
    assert.equal(staleImport.ok, false);
    const missingKey = createCausalObservation({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      statement: "The source key is absent.",
      datasetReference: { datasetId: committed.current.sourceContextId, sourceKey: "CNC-MISSING" },
    });
    assert.equal(missingKey.ok, false);
    const hypothesis = createCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      statement: "Unexpected maintenance downtime contributed to lower output.",
      observationIds: [observation.value.observationId],
      canonicalObjectIds: [machine.value.canonicalObjectId],
      assumptions: ["Maintenance is a proposed explanation."],
      limitations: ["This acceptance is not causal proof."],
    });
    assert.equal(hypothesis.ok, true);
    if (!hypothesis.ok) return;
    assert.equal(transitionCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      hypothesisId: hypothesis.value.hypothesisId,
      status: "NEEDS_EVIDENCE",
    }).ok, true);
    assert.equal(transitionCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      hypothesisId: hypothesis.value.hypothesisId,
      status: "UNDER_REVIEW",
    }).ok, true);
    const accepted = transitionCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      hypothesisId: hypothesis.value.hypothesisId,
      status: "ACCEPTED_FOR_SCENARIO",
    });
    assert.equal(accepted.ok && accepted.value.status, "ACCEPTED_FOR_SCENARIO");
    assert.equal(accepted.ok && accepted.value.evidenceSupportedCausal, false);
    assert.equal(JSON.stringify(getCanonicalObject(company.workspaceId, machine.value.canonicalObjectId)), beforeObject);
    assert.equal(listCanonicalRelationships(company.workspaceId).length, beforeRelationships);
    assert.equal(listDecisionGoals(company.workspaceId, production.value.deckId).length, 0);
    assert.equal(listCanonicalMutations().length, beforeJournal);
    assert.equal(getCsvRealDataImport(company.workspaceId, committed.current.sourceContextId)?.importId, "import-cause-1");
    const removed = updateCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      hypothesisId: hypothesis.value.hypothesisId,
      assumptions: [],
      limitations: ["Acceptance remains a hypothesis."],
    });
    assert.equal(removed.ok && removed.value.assumptions.length, 0);
    assert.equal(listCausalHypotheses(company.workspaceId, investigation.value.investigationId).length, 1);
  } finally {
    deleteWorkspace(company.workspaceId);
    resetWorkspaceRegistryForTests();
    resetDeckRegistryForTests();
    resetCsvRealDataImportStoreForTests();
    setDeckRegistryStorageForTests(null);
    setDeckDatasetReferenceStorageForTests(null);
  }
});

test("workspace deletion removes that investigation bucket and leaves another workspace", () => {
  setup();
  const kept = createCausalInvestigation({
    workspaceId: "company-b",
    deckId: "production",
    title: "Kept",
    problemStatement: "Another company remains.",
  });
  const removed = createCausalInvestigation({
    workspaceId: "company-a",
    deckId: "production",
    title: "Removed",
    problemStatement: "This company is forgotten.",
  });
  assert.equal(kept.ok && removed.ok, true);
  assert.equal(forgetWorkspaceCausalInvestigations("company-a").ok, true);
  assert.equal(getCausalInvestigation("company-a", removed.ok ? removed.value.investigationId : ""), null);
  assert.equal(listCausalInvestigations("company-b", "production").length, 1);
  assert.equal(listCausalInvestigations(DEMO_WORKSPACE_ID, "production").length, 0);
  assert.equal(listCausalInvestigations(BUSINESS_DEMO_WORKSPACE_ID, "production").length, 0);
});

test("corrupt, unsupported, duplicate, and failed investigation writes preserve the previous snapshot", () => {
  const store = setup();
  const created = createCausalInvestigation({
    workspaceId: "company-a",
    deckId: "production",
    title: "Efficiency",
    problemStatement: "Output declined.",
  });
  assert.equal(created.ok, true);
  const saved = store.getItem(CANONICAL_CAUSAL_INVESTIGATION_STORAGE_KEY);
  const original = store.setItem.bind(store);
  store.setItem = () => { throw new Error("injected"); };
  const failed = createCausalInvestigation({
    workspaceId: "company-a",
    deckId: "production",
    title: "Second",
    problemStatement: "This write fails.",
  });
  assert.equal(failed.ok, false);
  if (failed.ok) return;
  assert.equal(failed.reason, "storage-failed");
  store.setItem = original;
  assert.equal(store.getItem(CANONICAL_CAUSAL_INVESTIGATION_STORAGE_KEY), saved);
  assert.equal(listCausalInvestigations("company-a", "production").length, 1);

  const corrupt = memory();
  corrupt.setItem(CANONICAL_CAUSAL_INVESTIGATION_STORAGE_KEY, "{");
  resetCausalInvestigationDomainForTests(corrupt);
  assert.equal(canonicalCausalInvestigationAuthorityStatus(), "corrupt");
  assert.equal(createCausalInvestigation({
    workspaceId: "company-a",
    deckId: "production",
    title: "Blocked",
    problemStatement: "Corrupt storage stays unchanged.",
  }).ok, false);
  assert.equal(corrupt.getItem(CANONICAL_CAUSAL_INVESTIGATION_STORAGE_KEY), "{");

  const versioned = memory();
  versioned.setItem(CANONICAL_CAUSAL_INVESTIGATION_STORAGE_KEY, JSON.stringify({
    identity: "NPA-T NEXOCAUSE-DOMAIN-FOUNDATION:1/CanonicalCausalInvestigationDomain",
    schemaVersion: 2,
    workspaces: {},
  }));
  resetCausalInvestigationDomainForTests(versioned);
  assert.equal(canonicalCausalInvestigationAuthorityStatus(), "unsupported-version");

  const duplicate = memory();
  duplicate.setItem(CANONICAL_CAUSAL_INVESTIGATION_STORAGE_KEY, JSON.stringify({
    identity: "NPA-T NEXOCAUSE-DOMAIN-FOUNDATION:1/CanonicalCausalInvestigationDomain",
    schemaVersion: 1,
    workspaces: {
      "company-a": {
        nextInvestigation: 2,
        nextObservation: 1,
        nextHypothesis: 1,
        investigations: [
          { investigationId: "cause:company-a:1", workspaceId: "company-a", deckId: "production", title: "One", problemStatement: "One", lifecycleStatus: "DRAFT", provenance: "MANAGER_DECLARED", createdAt: T0, updatedAt: T0 },
          { investigationId: "cause:company-a:1", workspaceId: "company-a", deckId: "production", title: "Two", problemStatement: "Two", lifecycleStatus: "DRAFT", provenance: "MANAGER_DECLARED", createdAt: T0, updatedAt: T0 },
        ],
        observations: [],
        hypotheses: [],
      },
    },
  }));
  resetCausalInvestigationDomainForTests(duplicate);
  assert.equal(canonicalCausalInvestigationAuthorityStatus(), "corrupt");

  const invalid = memory();
  invalid.setItem(CANONICAL_CAUSAL_INVESTIGATION_STORAGE_KEY, JSON.stringify({
    identity: "NPA-T NEXOCAUSE-DOMAIN-FOUNDATION:1/CanonicalCausalInvestigationDomain",
    schemaVersion: 1,
    workspaces: {
      "company-a": {
        nextInvestigation: 2,
        nextObservation: 1,
        nextHypothesis: 1,
        investigations: [
          { investigationId: "cause:company-a:1", workspaceId: "company-a", deckId: "production", title: "One", problemStatement: "One", lifecycleStatus: "PROVEN", provenance: "MANAGER_DECLARED", createdAt: T0, updatedAt: T0 },
        ],
        observations: [],
        hypotheses: [],
      },
    },
  }));
  resetCausalInvestigationDomainForTests(invalid);
  assert.equal(canonicalCausalInvestigationAuthorityStatus(), "corrupt");
  assert.equal(invalid.getItem(CANONICAL_CAUSAL_INVESTIGATION_STORAGE_KEY)?.includes("PROVEN"), true);

  resetCausalInvestigationDomainForTests(null);
  assert.equal(canonicalCausalInvestigationAuthorityStatus(), "empty");
  const unavailable = createCausalInvestigation({
    workspaceId: "company-a",
    deckId: "production",
    title: "Missing store",
    problemStatement: "No storage is available.",
  });
  assert.equal(unavailable.ok, false);
  if (unavailable.ok) return;
  assert.equal(unavailable.reason, "storage-unavailable");
});

test("deleting an investigation blocks new observations and a deleted record stays readable", () => {
  setup();
  const investigation = createCausalInvestigation({
    workspaceId: "company-a",
    deckId: "production",
    title: "Efficiency",
    problemStatement: "Output declined.",
  });
  assert.equal(investigation.ok, true);
  if (!investigation.ok) return;
  const deleted = transitionCausalInvestigation({
    workspaceId: "company-a",
    deckId: "production",
    investigationId: investigation.value.investigationId,
    lifecycleStatus: "DELETED",
  });
  assert.equal(deleted.ok, true);
  const observation = createCausalObservation({
    workspaceId: "company-a",
    deckId: "production",
    investigationId: investigation.value.investigationId,
    statement: "A deleted investigation cannot gain an observation.",
  });
  assert.equal(observation.ok, false);
  if (observation.ok) return;
  assert.equal(observation.reason, "deleted");
  assert.equal(transitionCausalInvestigation({
    workspaceId: "company-a",
    deckId: "production",
    investigationId: investigation.value.investigationId,
    lifecycleStatus: "DRAFT",
  }).ok, false);
  assert.equal(getCausalInvestigation("company-a", investigation.value.investigationId)?.lifecycleStatus, "DELETED");
});
