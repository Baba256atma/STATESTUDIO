/**
 * B.17 — Import bundle validation (structural).
 */

import test from "node:test";
import assert from "node:assert/strict";

import { isNexoraExportBundleLike, parseNexoraImportBundle } from "./nexoraImportContract.ts";

const minimalAudit = {
  runId: "run-abc",
  timestamp: 1_700_000_000_000,
  sources: [{ connectorId: "csv", success: true }],
  merge: { sourceCount: 1, successfulSourceCount: 1, mergedSignalCount: 3 },
  signals: { count: 3, topTypes: ["delay"] },
  scanner: { fragilityLevel: "medium", drivers: ["d1"] },
  trust: { confidenceTier: "medium" as const, summary: "ok" },
};

const minimalReplay = {
  runId: "run-abc",
  timestamp: 1_700_000_000_000,
  scene: { focusedObjectId: "obj-a", highlightedObjectIds: ["obj-a"], fragilityLevel: "medium" },
  trust: { confidenceTier: "medium" as const, summary: "ok" },
  sources: { total: 1, successful: 1 },
};

test("parseNexoraImportBundle: rejects invalid JSON", () => {
  const r = parseNexoraImportBundle("{");
  assert.equal(r.ok, false);
  assert.match(r.error ?? "", /Invalid JSON/);
});

test("parseNexoraImportBundle: rejects non-bundle shape", () => {
  const r = parseNexoraImportBundle("{}");
  assert.equal(r.ok, false);
  assert.ok(r.error);
});

test("parseNexoraImportBundle: accepts version 1 with audit only (null replay)", () => {
  const raw = JSON.stringify({
    version: "1",
    exportedAt: 42,
    record: minimalAudit,
    replaySnapshot: null,
  });
  const r = parseNexoraImportBundle(raw);
  assert.equal(r.ok, true);
  assert.ok(r.bundle);
  assert.equal(r.bundle!.replaySnapshot, null);
  assert.equal(r.auditOnly, true);
});

test("parseNexoraImportBundle: accepts full bundle with replay", () => {
  const raw = JSON.stringify({
    version: "1",
    exportedAt: 99,
    record: minimalAudit,
    replaySnapshot: minimalReplay,
  });
  const r = parseNexoraImportBundle(raw);
  assert.equal(r.ok, true);
  assert.ok(r.bundle?.replaySnapshot);
  assert.equal(r.bundle!.replaySnapshot!.scene.highlightedObjectIds[0], "obj-a");
  assert.equal(r.auditOnly, false);
});

test("isNexoraExportBundleLike: true for minimal valid root", () => {
  assert.equal(
    isNexoraExportBundleLike({ version: "1", record: { runId: "x", timestamp: 1, merge: {}, signals: {} } }),
    true
  );
});

test("parseNexoraImportBundle: rejects bad replay scene", () => {
  const raw = JSON.stringify({
    version: "1",
    exportedAt: 1,
    record: minimalAudit,
    replaySnapshot: { runId: "run-abc", timestamp: 1 },
  });
  const r = parseNexoraImportBundle(raw);
  assert.equal(r.ok, false);
  assert.ok(r.error?.includes("scene"));
});
