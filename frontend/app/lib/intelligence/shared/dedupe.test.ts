import assert from "node:assert/strict";
import test from "node:test";
import {
  dedupeByStableKey,
  hasMaterialSignatureChange,
  stableSignalKey,
  stableSignature,
} from "./dedupe.ts";

test("shared dedupe utilities produce stable keys and signatures", () => {
  assert.equal(
    stableSignalKey({ type: "Alert", relatedObjectIds: ["b", "a"], sourceId: "S1" }),
    "alert|s1|a_b"
  );
  assert.equal(
    stableSignature({ b: 2, a: [1] }),
    stableSignature({ a: [1], b: 2 })
  );
  assert.equal(hasMaterialSignatureChange({ previousSignature: stableSignature({ a: 1 }), nextValue: { a: 2 } }), true);
});

test("shared dedupe keeps first stable occurrence", () => {
  const deduped = dedupeByStableKey([
    { id: "a", key: "same" },
    { id: "b", key: "same" },
    { id: "c", key: "next" },
  ], (item) => item.key);

  assert.deepEqual(deduped.map((item) => item.id), ["a", "c"]);
});
