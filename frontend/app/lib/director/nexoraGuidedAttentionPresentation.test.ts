import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  NEXORA_GUIDED_ATTENTION_BOUNDARY,
  NEXORA_GUIDED_ATTENTION_DURATION_MS,
  applyNexoraGuidedAttentionRuntime,
  composeNexoraGuidedAttentionCopy,
  emptyNexoraGuidedAttentionRuntime,
  expireNexoraGuidedAttention,
  requestNexoraGuidedAttention,
  resolveNexoraGuidedAttentionCue,
  verifyNexoraGuidedAttention,
} from "./nexoraGuidedAttentionPresentation.ts";

const MOUNTED = Object.freeze(["DATA_ENTRY", "STAGE"] as const);

describe("DIR:GA Guided Attention presentation", () => {
  it("identity is reusable and not ENT-owned", () => {
    assert.equal(verifyNexoraGuidedAttention().ok, true);
    assert.equal(NEXORA_GUIDED_ATTENTION_BOUNDARY.requiresNexEnt, false);
    assert.equal(NEXORA_GUIDED_ATTENTION_BOUNDARY.advisorOwnsDom, false);
    assert.equal(NEXORA_GUIDED_ATTENTION_BOUNDARY.equalsFocus, false);
    assert.equal(NEXORA_GUIDED_ATTENTION_BOUNDARY.equalsSelection, false);
    assert.equal(NEXORA_GUIDED_ATTENTION_BOUNDARY.equalsPriority, false);
  });

  it("unknown target fails safely without claiming a highlight", () => {
    const presentation = requestNexoraGuidedAttention({
      target: "NOT_A_TARGET",
      mountedTargets: MOUNTED,
      nowMs: 0,
    });
    assert.equal(presentation.availability, "UNAVAILABLE");
    assert.equal(presentation.cue, null);
    assert.match(composeNexoraGuidedAttentionCopy(presentation), /isn.t available/i);
  });

  it("missing mounted target is unavailable and does not fake success", () => {
    const presentation = requestNexoraGuidedAttention({
      target: "BACK_CONTROL",
      mountedTargets: MOUNTED,
      nowMs: 10,
    });
    assert.equal(presentation.availability, "UNAVAILABLE");
    assert.equal(presentation.cue, null);
    assert.match(composeNexoraGuidedAttentionCopy(presentation), /back isn.t available/i);
  });

  it("Data entry uses a presentation cue that is not focus or priority", () => {
    const presentation = requestNexoraGuidedAttention({
      target: "DATA_ENTRY",
      mountedTargets: ["DATA_ENTRY"],
      nowMs: 100,
    });
    assert.equal(presentation.availability, "AVAILABLE");
    assert.equal(presentation.cue, "SOFT_HALO");
    assert.equal(presentation.mutatesFocus, false);
    assert.equal(presentation.mutatesSelection, false);
    assert.match(composeNexoraGuidedAttentionCopy(presentation), /use data/i);
  });

  it("reduced motion resolves to static emphasis", () => {
    assert.equal(resolveNexoraGuidedAttentionCue({ reducedMotion: true }), "EMPHASIS");
    const presentation = requestNexoraGuidedAttention({
      target: "STAGE",
      mountedTargets: ["STAGE"],
      nowMs: 0,
      reducedMotion: true,
    });
    assert.equal(presentation.cue, "EMPHASIS");
  });

  it("expiry is deterministic without a live timer", () => {
    const presentation = requestNexoraGuidedAttention({
      target: "DATA_ENTRY",
      mountedTargets: ["DATA_ENTRY"],
      nowMs: 1000,
    });
    assert.equal(
      expireNexoraGuidedAttention(presentation, 1000 + NEXORA_GUIDED_ATTENTION_DURATION_MS - 1)?.cue,
      "SOFT_HALO",
    );
    assert.equal(
      expireNexoraGuidedAttention(presentation, 1000 + NEXORA_GUIDED_ATTENTION_DURATION_MS),
      null,
    );
  });

  it("newest request replaces previous without stacking", () => {
    const first = requestNexoraGuidedAttention({
      target: "DATA_ENTRY",
      mountedTargets: ["DATA_ENTRY", "STAGE"],
      nowMs: 0,
    });
    const second = requestNexoraGuidedAttention({
      target: "STAGE",
      mountedTargets: ["DATA_ENTRY", "STAGE"],
      nowMs: 400,
      previous: first,
    });
    const runtime = applyNexoraGuidedAttentionRuntime({
      previous: { presentation: first, pendingOfferTarget: null },
      request: second,
      nowMs: 400,
    });
    assert.equal(runtime.presentation?.target, "STAGE");
    assert.equal(runtime.presentation?.requestId, second.requestId);
  });

  it("repeat uses a new request id and does not keep the prior cue", () => {
    const first = requestNexoraGuidedAttention({
      target: "DATA_ENTRY",
      mountedTargets: ["DATA_ENTRY"],
      nowMs: 0,
      requestId: "a",
    });
    const replay = requestNexoraGuidedAttention({
      target: "DATA_ENTRY",
      mountedTargets: ["DATA_ENTRY"],
      nowMs: 500,
      previous: first,
      requestId: "b",
    });
    assert.notEqual(replay.requestId, first.requestId);
  });

  it("clear removes presentation and pending offer", () => {
    const runtime = applyNexoraGuidedAttentionRuntime({
      previous: {
        presentation: requestNexoraGuidedAttention({
          target: "DATA_ENTRY",
          mountedTargets: ["DATA_ENTRY"],
          nowMs: 0,
        }),
        pendingOfferTarget: "DATA_ENTRY",
      },
      clear: true,
      nowMs: 10,
    });
    assert.deepEqual(runtime, emptyNexoraGuidedAttentionRuntime());
  });
});
