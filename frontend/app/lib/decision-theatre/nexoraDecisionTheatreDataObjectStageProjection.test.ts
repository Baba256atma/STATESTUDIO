import assert from "node:assert/strict";
import test from "node:test";

import {
  commitPreparedCsvRealDataImport,
  getCsvRealDataImport,
  resetCsvRealDataImportStoreForTests,
} from "../data-reality/csvRealDataImportStore.ts";
import { prepareCsvRealDataImport } from "../data-reality/csvRealDataVerticalSlice.ts";
import type { NexoraMVPStageObjectPresentation } from "../nex-mvp/nexora3DExecutiveStage.ts";
import { answerNexoraDecisionTheatreDataObjectInquiry } from "./nexoraDecisionTheatreDataObjectAdvisor.ts";
import { projectCsvImportAsDecisionTheatreDataObject } from "./nexoraDecisionTheatreDataObjectProjection.ts";
import { projectNexoraDecisionTheatreDataObjectsToStage } from "./nexoraDecisionTheatreDataObjectStageProjection.ts";

function commit(input: Readonly<{
  fileName: string;
  csvText: string;
  importId: string;
  sourceContextId?: string;
  mode?: "new" | "replace";
}>) {
  const prepared = prepareCsvRealDataImport({
    workspaceId: "overview",
    fileName: input.fileName,
    fileSize: input.csvText.length,
    csvText: input.csvText,
    importId: input.importId,
    importedAt: "2026-08-31T12:00:00.000Z",
    ...(input.sourceContextId ? { sourceContextId: input.sourceContextId } : {}),
  });
  assert.equal(prepared.ready, true, prepared.errors.join("; "));
  const result = commitPreparedCsvRealDataImport({
    prepared,
    expectedWorkspaceId: "overview",
    mode: input.mode ?? "new",
    committedAt: "2026-08-31T12:00:01.000Z",
  });
  assert.equal(result.committed, true);
  assert.ok(result.current);
  return result.current;
}

function businessObject(id: string, label: string, x = 0, y = 0): NexoraMVPStageObjectPresentation {
  return Object.freeze({
    id,
    label,
    kind: "object",
    role: "normal",
    overviewPosition: Object.freeze([x, y, 0] as const),
    targetPosition: Object.freeze([x, y, 0] as const),
    scale: 1,
    opacity: 1,
    emissiveIntensity: 0,
    labelProminence: "full",
    selected: false,
    focused: false,
    attention: "normal",
    status: "normal",
  });
}

test("zero-object CSV becomes one native Director-placed participant without fabricated relationships", () => {
  resetCsvRealDataImportStoreForTests();
  const committed = commit({ fileName: "raw-delivery.csv", csvText: "date\n2026-08-31", importId: "zero" });
  const dataObject = projectCsvImportAsDecisionTheatreDataObject(committed);
  assert.equal(dataObject.relationships.length, 0);
  assert.equal(dataObject.stageCompatibility.rendererRequired, true);

  const projected = projectNexoraDecisionTheatreDataObjectsToStage({
    dataObjects: [dataObject],
    visibleDataObjectIds: [dataObject.id, dataObject.id],
    selectedDataObjectId: dataObject.id,
    businessFocusId: "obj-risk",
    stageObjects: [businessObject("obj-risk", "Risk")],
  });
  assert.equal(projected.participants.length, 1);
  assert.equal(projected.connections.length, 0);
  assert.equal(projected.diagnostics.duplicateCount, 1);
  assert.equal(projected.diagnostics.businessFocusId, "obj-risk");
  assert.equal(projected.diagnostics.mutatesBusinessFocus, false);
  assert.equal(projected.diagnostics.directorOwnsPlacement, true);
  assert.equal(projected.participants[0]?.presentation.focused, false);
});

test("authoritative mapped source renders only a provenance-safe non-causal relationship", () => {
  resetCsvRealDataImportStoreForTests();
  const committed = commit({
    fileName: "finance.csv",
    csvText: "currentRevenue,previousRevenue\n120,100",
    importId: "related",
  });
  const dataObject = projectCsvImportAsDecisionTheatreDataObject(committed);
  assert.deepEqual(dataObject.relationships.map((entry) => entry.targetId), ["obj-revenue"]);
  assert.equal(dataObject.relationships[0]?.semanticRelation, "supplies-data-to");
  assert.equal(dataObject.relationships[0]?.impliesCausality, false);
  assert.equal(dataObject.relationships[0]?.visual.causalLanguageAllowed, false);

  const projected = projectNexoraDecisionTheatreDataObjectsToStage({
    dataObjects: [dataObject],
    visibleDataObjectIds: [dataObject.id],
    selectedDataObjectId: dataObject.id,
    businessFocusId: null,
    stageObjects: [businessObject("obj-revenue", "Revenue")],
  });
  assert.equal(projected.connections.length, 1);
  assert.equal(projected.connections[0]?.relation, "supplies-data-to");
  assert.equal(projected.connections[0]?.impliesCausality, false);
});

test("source replacement updates the same logical Stage object without a ghost", () => {
  resetCsvRealDataImportStoreForTests();
  const original = commit({ fileName: "delivery-july.csv", csvText: "date\n2026-07-31", importId: "july" });
  const first = projectCsvImportAsDecisionTheatreDataObject(original);
  const replacement = commit({
    fileName: "delivery-august.csv",
    csvText: "date\n2026-08-31",
    importId: "august",
    sourceContextId: original.sourceContextId,
    mode: "replace",
  });
  const second = projectCsvImportAsDecisionTheatreDataObject(replacement);
  assert.equal(second.id, first.id);
  assert.equal(second.label, "delivery-august.csv");

  const projected = projectNexoraDecisionTheatreDataObjectsToStage({
    dataObjects: [second],
    visibleDataObjectIds: [first.id],
    selectedDataObjectId: first.id,
    businessFocusId: null,
    stageObjects: [],
  });
  assert.equal(projected.participants.length, 1);
  assert.equal(projected.participants[0]?.dataObject.label, "delivery-august.csv");
  assert.equal(getCsvRealDataImport("overview", original.sourceContextId)?.importId, "august");
});

test("multiple unrelated sources are distinct, deterministic, and removal is presentation-only", () => {
  resetCsvRealDataImportStoreForTests();
  const first = projectCsvImportAsDecisionTheatreDataObject(commit({ fileName: "delivery.csv", csvText: "date\n2026-08-30", importId: "a" }));
  const second = projectCsvImportAsDecisionTheatreDataObject(commit({ fileName: "production.csv", csvText: "date\n2026-08-31", importId: "b" }));
  const both = projectNexoraDecisionTheatreDataObjectsToStage({
    dataObjects: [first, second],
    visibleDataObjectIds: [first.id, second.id],
    selectedDataObjectId: null,
    businessFocusId: null,
    stageObjects: [],
  });
  assert.equal(both.participants.length, 2);
  assert.notDeepEqual(both.participants[0]?.presentation.targetPosition, both.participants[1]?.presentation.targetPosition);
  assert.equal(both.connections.length, 0);

  const removedFromStage = projectNexoraDecisionTheatreDataObjectsToStage({
    dataObjects: [first, second],
    visibleDataObjectIds: [second.id],
    selectedDataObjectId: null,
    businessFocusId: null,
    stageObjects: [],
  });
  assert.deepEqual(removedFromStage.diagnostics.dataObjectIds, [second.id]);
  assert.ok(getCsvRealDataImport("overview", first.sourceId));
});

test("Advisor resolves selected Data Object deictics without inventing support", () => {
  resetCsvRealDataImportStoreForTests();
  const committed = commit({ fileName: "raw.csv", csvText: "date\n2026-08-31", importId: "advisor" });
  const dataObject = projectCsvImportAsDecisionTheatreDataObject(committed);
  assert.match(answerNexoraDecisionTheatreDataObjectInquiry({ dataObject, review: committed.prepared.mapping, utterance: "Explain this." }) ?? "", /raw\.csv is a CSV Data Object/);
  assert.equal(
    answerNexoraDecisionTheatreDataObjectInquiry({ dataObject, review: committed.prepared.mapping, utterance: "What does it support?" }),
    "raw.csv has no supported executive-object relationship. Nexora will not invent one.",
  );
  assert.equal(
    answerNexoraDecisionTheatreDataObjectInquiry({ dataObject, review: committed.prepared.mapping, utterance: "Delete this CSV." }),
    null,
  );
});

test("comparison scenes omit Data Objects unless the manager is inspecting one", () => {
  resetCsvRealDataImportStoreForTests();
  const dataObject = projectCsvImportAsDecisionTheatreDataObject(commit({
    fileName: "raw.csv",
    csvText: "date\n2026-08-31",
    importId: "compare",
  }));
  const hidden = projectNexoraDecisionTheatreDataObjectsToStage({
    dataObjects: [dataObject],
    visibleDataObjectIds: [dataObject.id],
    selectedDataObjectId: null,
    businessFocusId: "obj-risk",
    stageObjects: [businessObject("obj-risk", "Risk")],
    sceneIntentKind: "COMPARE_CANDIDATES",
  });
  assert.equal(hidden.participants.length, 0);

  const inspecting = projectNexoraDecisionTheatreDataObjectsToStage({
    dataObjects: [dataObject],
    visibleDataObjectIds: [dataObject.id],
    selectedDataObjectId: dataObject.id,
    businessFocusId: "obj-risk",
    stageObjects: [businessObject("obj-risk", "Risk")],
    sceneIntentKind: "COMPARE_CANDIDATES",
  });
  assert.equal(inspecting.participants.length, 1);
  assert.equal(inspecting.participants[0]?.sceneIntent, "PRESERVE_SCENE");
  assert.equal(inspecting.participants[0]?.presentation.focused, false);
});

test("row count does not change Data Object size and unsupported targets do not render", () => {
  resetCsvRealDataImportStoreForTests();
  const small = projectCsvImportAsDecisionTheatreDataObject(commit({
    fileName: "small.csv",
    csvText: "date\n2026-08-31",
    importId: "small",
  }));
  const large = projectCsvImportAsDecisionTheatreDataObject(commit({
    fileName: "large.csv",
    csvText: "date\n2026-08-01\n2026-08-02\n2026-08-03",
    importId: "large",
  }));
  const projected = projectNexoraDecisionTheatreDataObjectsToStage({
    dataObjects: [small, large],
    visibleDataObjectIds: [small.id, large.id],
    selectedDataObjectId: null,
    businessFocusId: null,
    stageObjects: [businessObject("obj-missing", "Not on Stage")],
  });
  assert.equal(projected.participants[0]?.presentation.scale, projected.participants[1]?.presentation.scale);
  assert.equal(projected.connections.length, 0);
  assert.equal(projected.diagnostics.mutatesDataReality, false);
});

