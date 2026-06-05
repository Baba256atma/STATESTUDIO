import test from "node:test";
import assert from "node:assert/strict";

import {
  buildHudPayloadSignature,
  buildPayloadContentSignature,
  buildPropagationPayloadSignature,
  stabilizePayloadReference,
} from "./payloadStabilityAudit.ts";

test("stabilizePayloadReference reuses previous value when semantic signature is unchanged", () => {
  const firstValue = { model: { actions: [{ id: "analyze", disabled: false }] } };
  const first = stabilizePayloadReference(null, firstValue, buildHudPayloadSignature(firstValue));
  const nextValue = { model: { actions: [{ id: "analyze", disabled: false }] } };
  const next = stabilizePayloadReference(first, nextValue, buildHudPayloadSignature(nextValue));

  assert.equal(next, first);
  assert.equal(next.value, firstValue);
});

test("stabilizePayloadReference replaces value when semantic signature changes", () => {
  const firstValue = { paths: [{ id: "p1", score: 0.8 }] };
  const first = stabilizePayloadReference(null, firstValue, buildPayloadContentSignature(firstValue));
  const nextValue = { paths: [{ id: "p1", score: 0.9 }] };
  const next = stabilizePayloadReference(first, nextValue, buildPayloadContentSignature(nextValue));

  assert.notEqual(next, first);
  assert.equal(next.value, nextValue);
});

test("propagation payload signature ignores volatile response metadata", () => {
  const firstValue = {
    canonical_recommendation: { created_at: 100, primary: { title: "A" } },
    decision_trace: [{ ts: 100 }],
    decision_simulation: {
      impacted_nodes: ["obj-a"],
      propagation: [{ source: "obj-a", target: "obj-b", weight: 0.5 }],
    },
  };
  const first = stabilizePayloadReference(null, firstValue, buildPropagationPayloadSignature(firstValue));
  const nextValue = {
    canonical_recommendation: { created_at: 200, primary: { title: "B" } },
    decision_trace: [{ ts: 200 }],
    decision_simulation: {
      impacted_nodes: ["obj-a"],
      propagation: [{ source: "obj-a", target: "obj-b", weight: 0.5 }],
    },
  };
  const next = stabilizePayloadReference(first, nextValue, buildPropagationPayloadSignature(nextValue));

  assert.equal(next, first);
  assert.equal(next.value, firstValue);
});
