import assert from "node:assert/strict";
import test from "node:test";

import {
  commitPreparedCsvRealDataImport,
  resetCsvRealDataImportStoreForTests,
} from "../data-reality/csvRealDataImportStore.ts";
import { prepareCsvRealDataImport } from "../data-reality/csvRealDataVerticalSlice.ts";
import {
  deriveNexoraDecisionTheatreDataObjectId,
  projectCsvImportAsDecisionTheatreDataObject,
} from "./nexoraDecisionTheatreDataObjectProjection.ts";
import { classifyNexoraDecisionTheatreVisualFamily } from "./nexoraDecisionTheatreVisualFamily.ts";

const csv = [
  "currentRevenue,previousRevenue,usedCapacity,totalCapacity",
  "120,100,80,100",
].join("\n");

function committedSource() {
  resetCsvRealDataImportStoreForTests();
  const prepared = prepareCsvRealDataImport({
    workspaceId: "workspace-a",
    fileName: "delivery.csv",
    fileSize: csv.length,
    csvText: csv,
    importId: "import-1",
    importedAt: "2026-08-30T12:00:00.000Z",
  });
  const result = commitPreparedCsvRealDataImport({
    prepared,
    expectedWorkspaceId: "workspace-a",
    mode: "new",
    committedAt: "2026-08-30T12:00:01.000Z",
  });
  assert.equal(result.committed, true);
  assert.ok(result.current);
  return result.current;
}

test("projects one stable read-only Data Object from canonical RDI identity", () => {
  const committed = committedSource();
  const first = projectCsvImportAsDecisionTheatreDataObject(committed);
  const second = projectCsvImportAsDecisionTheatreDataObject(committed);

  assert.deepEqual(first, second);
  assert.equal(first.id, deriveNexoraDecisionTheatreDataObjectId(committed.workspaceId, committed.sourceContextId));
  assert.equal(first.sourceId, committed.prepared.snapshot?.source.identity.sourceId);
  assert.equal(first.sourceSnapshotRef, committed.prepared.handoff?.sourceSnapshotId);
  assert.equal(first.dataRealityRef, committed.prepared.handoff?.dataset.id);
  assert.equal(first.visualFamily, "DATA_OBJECT");
  assert.equal(classifyNexoraDecisionTheatreVisualFamily(first), "DATA_OBJECT");
  assert.equal(Object.isFrozen(first), true);
});

test("is Director/Stage compatible without becoming Evidence, causality, or a writer", () => {
  const projected = projectCsvImportAsDecisionTheatreDataObject(committedSource());

  assert.deepEqual(projected.directorCompatibility, {
    id: projected.id,
    label: "delivery.csv",
    kind: "data-source",
  });
  assert.equal(projected.stageCompatibility.participantId, projected.id);
  assert.equal(projected.stageCompatibility.rendererRequired, true);
  assert.equal(projected.stageCompatibility.inspectionEligible, true);
  assert.equal(projected.relationships.length, 2);
  assert.equal(projected.relationships.every((entry) => entry.impliesCausality === false), true);
  assert.equal(projected.relationships.every((entry) => entry.visual.causalLanguageAllowed === false), true);
  assert.deepEqual(projected.semanticSafety, {
    isEvidence: false,
    impliesCausality: false,
    createsBusinessTruth: false,
    ambiguityRequiresClarification: true,
  });
  assert.equal(Object.values(projected.writes).every((allowed) => allowed === false), true);
});

test("rejects a source whose workspace/source identity diverges from RDI truth", () => {
  const committed = committedSource();
  const mismatched = Object.freeze({ ...committed, sourceContextId: "csv:workspace-a:other" });
  assert.throws(
    () => projectCsvImportAsDecisionTheatreDataObject(mismatched),
    /not aligned with its canonical RDI source/,
  );
});
