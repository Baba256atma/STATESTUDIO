import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { TypeCPipelineEvent } from "../../typec/typeCPipelineTracker.ts";
import { deriveOperationalMonitoringSnapshot } from "../deriveMonitoringSnapshot.ts";
import {
  toMonitoringSnapshotInput,
  type OperationalPipelineStatusBrief,
} from "../monitoringInputAdapter.ts";

describe("monitoringInputAdapter", () => {
  it("returns empty records for empty / null input", () => {
    assert.deepEqual(toMonitoringSnapshotInput(null).records, []);
    assert.deepEqual(toMonitoringSnapshotInput(undefined).records, []);
    assert.deepEqual(toMonitoringSnapshotInput({}).records, []);
  });

  it("ignores invalid pipeline events safely", () => {
    const bad = [
      null,
      {},
      { id: "" },
      { id: "   " },
    ] as unknown as TypeCPipelineEvent[];
    assert.equal(toMonitoringSnapshotInput({ pipelineEvents: bad }).records.length, 0);
  });

  it("maps valid events preserving objectIds as objectHints and message-relevant fields in payload", () => {
    const ev: TypeCPipelineEvent = {
      id: "evt-1",
      timestamp: "2020-01-01T00:00:00.000Z",
      step: "scenario_draft_created",
      intentType: "test_intent",
      scenarioId: "sc-1",
      objectIds: ["obj-a", "obj-b"],
      input: "hello",
    };
    const { records } = toMonitoringSnapshotInput({ pipelineEvents: [ev] });
    assert.equal(records.length, 1);
    const r = records[0]!;
    assert.equal(r.id, "evt-1");
    assert.equal(r.sourceConnectorId, "typec_pipeline");
    const snap = deriveOperationalMonitoringSnapshot(toMonitoringSnapshotInput({ pipelineEvents: [ev] }));
    assert.equal(snap.signals[0]?.sourceId, "typec_pipeline");
    assert.equal(snap.signals[0]?.objectId, "obj-a");
    assert.deepEqual(r.objectHints, ["obj-a", "obj-b"]);
    assert.ok(r.signalType.includes("scenario_draft_created"));
    assert.equal((r.payload as { input?: string }).input, "hello");
    assert.equal(r.timestamp, Date.parse("2020-01-01T00:00:00.000Z"));
  });

  it("uses stable timestamp fallback when event timestamp is invalid", () => {
    const ev: TypeCPipelineEvent = {
      id: "evt-bad-ts",
      timestamp: "not-a-date",
      step: "skipped",
      objectIds: [],
    };
    const { records } = toMonitoringSnapshotInput({ pipelineEvents: [ev] });
    assert.equal(records.length, 1);
    assert.ok(typeof records[0]!.timestamp === "number" && records[0]!.timestamp > 0);
  });

  it("does not emit pipeline status signal when fully idle with no counts or text", () => {
    const idle: OperationalPipelineStatusBrief = {
      status: "idle",
      source: null,
      signalsCount: 0,
      mappedObjectsCount: 0,
      fragilityLevel: null,
      summary: null,
      insightLine: null,
      errorMessage: null,
      updatedAt: 123,
    };
    assert.equal(toMonitoringSnapshotInput({ pipelineStatus: idle }).records.length, 0);
  });

  it("emits pipeline status when processing", () => {
    const st: OperationalPipelineStatusBrief = {
      status: "processing",
      source: "ingestion",
      signalsCount: 0,
      mappedObjectsCount: 0,
      fragilityLevel: null,
      summary: null,
      insightLine: null,
      errorMessage: null,
      updatedAt: 999,
    };
    const { records } = toMonitoringSnapshotInput({ pipelineStatus: st });
    assert.equal(records.length, 1);
    assert.equal(records[0]!.sourceConnectorId, "pipeline:ingestion");
  });
});

describe("monitoringInputAdapter + deriveOperationalMonitoringSnapshot", () => {
  it("idle snapshot when no operational data", () => {
    const snap = deriveOperationalMonitoringSnapshot(toMonitoringSnapshotInput({}));
    assert.equal(snap.status, "idle");
    assert.equal(snap.signals.length, 0);
  });

  it("high severity pipeline error yields degraded or critical snapshot and includes object hints", () => {
    const ev: TypeCPipelineEvent = {
      id: "evt-fail",
      timestamp: "2020-06-01T12:00:00.000Z",
      step: "scenario_draft_created",
      intentType: "x",
      objectIds: ["z-1"],
      reason: "pipeline failure",
    };
    const snap = deriveOperationalMonitoringSnapshot(
      toMonitoringSnapshotInput({ pipelineEvents: [ev] })
    );
    assert.ok(snap.status === "critical" || snap.status === "degraded");
    const ids = new Set(snap.affectedObjectIds);
    assert.ok(ids.has("z-1"));
  });
});
