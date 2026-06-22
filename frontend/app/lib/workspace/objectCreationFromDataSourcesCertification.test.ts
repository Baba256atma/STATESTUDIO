import assert from "node:assert/strict";
import test from "node:test";

import {
  DS17_CERTIFICATION_TAG,
  OBJECT_CREATION_FROM_DATA_SOURCES_CERTIFICATION_TAGS,
  OBJECT_CREATION_FROM_DATA_SOURCES_COMPLETE_DIAGNOSTIC,
} from "./objectCreationFromDataSourcesCertificationContract.ts";
import { runObjectCreationFromDataSourcesCertification } from "./objectCreationFromDataSourcesCertification.ts";

test("legacy facade re-exports DS-1:7 certification tags", () => {
  assert.equal(DS17_CERTIFICATION_TAG, "[DS17_CERTIFIED]");
  assert.deepEqual(OBJECT_CREATION_FROM_DATA_SOURCES_CERTIFICATION_TAGS, [
    "[DS17_CERTIFIED]",
    "[DATA_SOURCE_PIPELINE_CERTIFIED]",
    "[WORKSPACE_DATA_INTELLIGENCE_READY]",
    "[DS2_READY]",
    "[DS_1_COMPLETE]",
  ]);
});

test("legacy facade delegates certification runner", async () => {
  const result = await runObjectCreationFromDataSourcesCertification({
    buildPassed: true,
    testsPassed: true,
  });

  assert.equal(result.certified, true);
  assert.equal(result.gates.length, 24);
  assert.equal(result.diagnostics.includes(OBJECT_CREATION_FROM_DATA_SOURCES_COMPLETE_DIAGNOSTIC), true);
});
