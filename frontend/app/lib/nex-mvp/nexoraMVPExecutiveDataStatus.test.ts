import assert from "node:assert/strict";
import test from "node:test";

import { projectNexoraExecutiveDataStatus } from "./nexoraMVPExecutiveDataStatus.ts";

test("default /executive demo data is Local, not Live", () => {
  const status = projectNexoraExecutiveDataStatus({
    usesActiveDataSource: false,
    liveObservationActive: false,
    csvImportActive: false,
    hasUnresolvedReality: true,
  });
  assert.equal(status.kind, "local");
  assert.equal(status.label, "Local");
});

test("validated CSV import is Imported", () => {
  const status = projectNexoraExecutiveDataStatus({
    usesActiveDataSource: true,
    datasetSource: "csv",
    liveObservationActive: false,
    csvImportActive: true,
    hasUnresolvedReality: false,
  });
  assert.equal(status.kind, "imported");
  assert.equal(status.label, "Imported");
});

test("live connected observation is Live", () => {
  const status = projectNexoraExecutiveDataStatus({
    usesActiveDataSource: true,
    datasetSource: "api",
    liveObservationActive: true,
    csvImportActive: false,
    hasUnresolvedReality: false,
  });
  assert.equal(status.kind, "live");
  assert.equal(status.label, "Live");
});

test("stale active source is Stale", () => {
  const status = projectNexoraExecutiveDataStatus({
    usesActiveDataSource: true,
    datasetSource: "api",
    liveObservationActive: true,
    csvImportActive: false,
    hasUnresolvedReality: false,
    stale: true,
  });
  assert.equal(status.kind, "stale");
  assert.equal(status.label, "Stale");
});

test("unresolved live source is Limited", () => {
  const status = projectNexoraExecutiveDataStatus({
    usesActiveDataSource: true,
    datasetSource: "api",
    liveObservationActive: true,
    csvImportActive: false,
    hasUnresolvedReality: true,
  });
  assert.equal(status.kind, "limited");
  assert.equal(status.label, "Limited");
});
