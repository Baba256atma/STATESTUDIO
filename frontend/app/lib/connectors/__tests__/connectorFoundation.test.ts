import assert from "node:assert/strict";
import test from "node:test";

import { getConnectorById, getConnectorCapabilities, getConnectorDefinitions, isKnownConnector } from "../connectorRegistry.ts";
import { runConnector } from "../connectorRunner.ts";
import {
  normalizeConnectorKind,
  normalizeConnectorStatus,
  validateConnectorDefinition,
  validateConnectorRunInput,
} from "../connectorValidation.ts";

test("registry returns default foundation connectors", () => {
  const definitions = getConnectorDefinitions();
  assert.equal(definitions.length, 5);
  const ids = new Set(definitions.map((d) => d.id));
  assert.equal(ids.has("manual_json_input"), true);
  assert.equal(ids.has("csv_upload"), true);
  assert.equal(ids.has("spreadsheet_upload"), true);
  assert.equal(ids.has("api_json_placeholder"), true);
  assert.equal(ids.has("webhook_placeholder"), true);
});

test("known connector lookup works", () => {
  const def = getConnectorById("manual_json_input");
  assert.equal(def?.kind, "manual");
  assert.equal(isKnownConnector("manual_json_input"), true);
  assert.deepEqual([...getConnectorCapabilities("csv_upload")], ["read", "upload", "transform"]);
});

test("unknown connector lookup fails safely", () => {
  assert.equal(getConnectorById("not_real"), null);
  assert.equal(isKnownConnector("not_real"), false);
  assert.deepEqual([...getConnectorCapabilities("not_real")], []);
});

test("validateConnectorDefinition accepts registry entries", () => {
  const def = getConnectorById("manual_json_input");
  assert.ok(def);
  const v = validateConnectorDefinition(def);
  assert.equal(v.ok, true);
  assert.equal(v.errors.length, 0);
});

test("validateConnectorDefinition rejects invalid shapes", () => {
  const v = validateConnectorDefinition(null);
  assert.equal(v.ok, false);
  assert.equal(v.errors.length > 0, true);
});

test("normalizeConnectorKind and status return safe fallbacks", () => {
  assert.equal(normalizeConnectorKind("api"), "api");
  assert.equal(normalizeConnectorKind("not-a-kind"), "unknown");
  assert.equal(normalizeConnectorStatus("failed"), "failed");
  assert.equal(normalizeConnectorStatus("nope"), "idle");
});

test("validation catches missing connectorId", () => {
  const result = validateConnectorRunInput({
    sourceType: "json",
    payload: {},
    requestedAt: "2026-01-01T00:00:00.000Z",
  });
  assert.equal(result.ok, false);
  assert.equal(result.errors.some((e) => e.includes("connectorId")), true);
});

test("runner returns failed result for unknown connector", async () => {
  const result = await runConnector({
    connectorId: "unknown_connector_id",
    sourceType: "json",
    payload: { a: 1 },
    requestedAt: "2026-01-01T00:00:00.000Z",
  });
  assert.equal(result.ok, false);
  assert.equal(result.status, "failed");
  assert.equal(result.message, "Unknown connector");
});

test("runner returns success placeholder for known connector", async () => {
  const result = await runConnector({
    connectorId: "manual_json_input",
    sourceType: "json",
    payload: { hello: "world" },
    requestedAt: "2026-01-01T00:00:00.000Z",
  });
  assert.equal(result.ok, true);
  assert.equal(result.status, "success");
  assert.equal(result.message, "Connector foundation run completed");
});
