import assert from "node:assert/strict";
import test from "node:test";
import { detectTypeCIntent } from "./typeCIntent.ts";

test("detectTypeCIntent detects supply chain model from natural text", () => {
  assert.deepEqual(detectTypeCIntent("we have delay in supply chain"), {
    type: "model_system",
    labels: ["Supplier", "Inventory", "Delivery"],
    reason: "supply_chain_pattern",
  });
});

test("detectTypeCIntent detects supply chain model from keyword cluster", () => {
  assert.deepEqual(detectTypeCIntent("supplier inventory delivery delay"), {
    type: "model_system",
    labels: ["Supplier", "Inventory", "Delivery"],
    reason: "supply_chain_pattern",
  });
});

test("detectTypeCIntent detects sales model", () => {
  assert.deepEqual(detectTypeCIntent("we have customer demand issue"), {
    type: "model_system",
    labels: ["Customer", "Demand", "Sales"],
    reason: "sales_pattern",
  });
});

test("detectTypeCIntent keeps direct add object command single-object", () => {
  assert.deepEqual(detectTypeCIntent("add supplier"), {
    type: "add_object",
    label: "Supplier",
  });
});

test("detectTypeCIntent detects scenario draft command", () => {
  assert.deepEqual(detectTypeCIntent("create scenario"), { type: "create_scenario" });
  assert.deepEqual(detectTypeCIntent("build scenario"), { type: "create_scenario" });
});

test("detectTypeCIntent detects scenario selection command", () => {
  assert.deepEqual(detectTypeCIntent("select scenario"), { type: "select_scenario" });
  assert.deepEqual(detectTypeCIntent("choose scenario"), { type: "select_scenario" });
});

test("detectTypeCIntent detects scenario ignore command", () => {
  assert.deepEqual(detectTypeCIntent("ignore scenario"), { type: "ignore_scenario" });
  assert.deepEqual(detectTypeCIntent("discard scenario"), { type: "ignore_scenario" });
});

test("detectTypeCIntent detects ready for decision command", () => {
  assert.deepEqual(detectTypeCIntent("ready for decision"), { type: "ready_for_decision" });
  assert.deepEqual(detectTypeCIntent("mark ready"), { type: "ready_for_decision" });
});

test("detectTypeCIntent detects decision readiness check command", () => {
  assert.deepEqual(detectTypeCIntent("check decision readiness"), { type: "check_decision_readiness" });
});

test("detectTypeCIntent detects decision draft commands", () => {
  assert.deepEqual(detectTypeCIntent("create decision draft"), { type: "create_decision_draft" });
  assert.deepEqual(detectTypeCIntent("draft decision"), { type: "create_decision_draft" });
  assert.deepEqual(detectTypeCIntent("recommend next"), { type: "create_decision_draft" });
  assert.deepEqual(detectTypeCIntent("what should we do"), { type: "create_decision_draft" });
});

test("detectTypeCIntent detects executive summary commands", () => {
  assert.deepEqual(detectTypeCIntent("executive summary"), { type: "create_executive_summary" });
  assert.deepEqual(detectTypeCIntent("summarize decision"), { type: "create_executive_summary" });
  assert.deepEqual(detectTypeCIntent("manager summary"), { type: "create_executive_summary" });
  assert.deepEqual(detectTypeCIntent("show recommendation"), { type: "create_executive_summary" });
});

test("detectTypeCIntent ignores general chat", () => {
  assert.deepEqual(detectTypeCIntent("hello"), { type: "none" });
});
