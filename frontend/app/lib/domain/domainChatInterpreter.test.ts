import { test } from "node:test";
import * as assert from "node:assert/strict";

import { interpretDomainChatMessage } from "./domainChatInterpreter.ts";
import { summarizeDomainInterpretation } from "./domainInterpretationSummary.ts";

test("detects supply chain object creation from supplier delays", () => {
  const result = interpretDomainChatMessage({ text: "we have supplier delays" });

  assert.equal(result.detectedDomainId, "supply_chain");
  assert.equal(result.intent, "create_object");
  assert.equal(result.entities.some((entity) => entity.matchedTemplateId === "supply_chain_supplier"), true);
  assert.equal(result.suggestedActions.some((action) => action.type === "ADD_DOMAIN_OBJECT"), true);
});

test("detects PMO from budget timeline text", () => {
  const result = interpretDomainChatMessage({ text: "our budget timeline is collapsing" });

  assert.equal(result.detectedDomainId, "pmo");
  assert.equal(result.entities.some((entity) => entity.matchedTemplateId === "pmo_budget"), true);
  assert.equal(result.entities.some((entity) => entity.matchedTemplateId === "pmo_timeline"), true);
});

test("detects finance language", () => {
  const result = interpretDomainChatMessage({ text: "cash flow and revenue forecast are under pressure" });

  assert.equal(result.detectedDomainId, "finance");
});

test("detects security language", () => {
  const result = interpretDomainChatMessage({ text: "vulnerability in access path creates exposure" });

  assert.equal(result.detectedDomainId, "security");
});

test("detects connect object intent", () => {
  const result = interpretDomainChatMessage({ text: "connect supplier to inventory" });

  assert.equal(result.intent, "connect_objects");
  assert.equal(result.suggestedActions[0]?.type, "CONNECT_DOMAIN_OBJECTS");
});

test("confidence is clamped and deterministic", () => {
  const first = interpretDomainChatMessage({ text: "incident latency deployment" });
  const second = interpretDomainChatMessage({ text: "incident latency deployment" });

  assert.deepEqual(second, first);
  assert.ok(first.confidence >= 0 && first.confidence <= 1);
});

test("unknown text fallback is safe", () => {
  const result = interpretDomainChatMessage({ text: "hello" });

  assert.equal(result.intent, "unknown");
  assert.equal(result.detectedDomainId, "general");
  assert.deepEqual(result.suggestedActions, []);
});

test("summary is concise and deterministic", () => {
  const result = interpretDomainChatMessage({ text: "we have supplier delays" });

  assert.equal(
    summarizeDomainInterpretation(result),
    "Detected Supply Chain domain with references to Supplier and Delivery Risk."
  );
});
