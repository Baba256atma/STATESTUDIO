import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const shell = readFileSync(join(here, "../NexoraExecutiveShell.tsx"), "utf8");
const explorer = readFileSync(join(here, "NexoraExecutiveDataExplorer.tsx"), "utf8");
const object = readFileSync(join(here, "../stage/NexoraStageDataObject.tsx"), "utf8");
const inspection = readFileSync(join(here, "../stage/NexoraStageDataObjectInspection.tsx"), "utf8");
const projection = readFileSync(join(here, "../../../lib/decision-theatre/nexoraDecisionTheatreDataObjectStageProjection.ts"), "utf8");

test("DATA-UX:4 Stage Data Objects remain a read-only Director projection", () => {
  assert.match(shell, /projectNexoraDecisionTheatreDataObjectsToStage/);
  assert.match(shell, /sceneIntentKind: theatreProjection.sceneIntent.intentKind/);
  assert.match(shell, /setSelectedDataObjectId\(null\)/);
  assert.match(shell, /onSelectStageDataObject/);
  assert.doesNotMatch(shell, /StageCsvObject|createCsvStore|setFocusedSubject\(dataObject/);
});

test("Show on Stage and Remove from Stage are presentation actions", () => {
  assert.match(explorer, /nexora-data-object-show-on-stage/);
  assert.match(inspection, /Remove from Stage/);
  assert.match(inspection, /data-remove-from-stage-deletes-source="false"/);
  assert.doesNotMatch(inspection, /removeCsvRealDataImport/);
});

test("native R3F Data Object is engineered geometry, not a DOM card body", () => {
  assert.match(object, /cylinderGeometry args=\{\[0.42, 0.42, 0.22, 6\]\}/);
  assert.doesNotMatch(object, /RoundedBox/);
  assert.match(projection, /linePattern: "dashed"/);
  assert.match(projection, /directorOwnsPlacement: true/);
});
