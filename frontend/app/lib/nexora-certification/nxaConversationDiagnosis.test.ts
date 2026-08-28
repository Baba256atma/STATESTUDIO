import assert from "node:assert/strict";
import test from "node:test";
import {
  createConversationDiagnosis,
  mayBeginConversationalFix,
} from "./nxaConversationDiagnosis.ts";

test("diagnosis never authorizes a Fix on the record itself", () => {
  const record = createConversationDiagnosis({
    defectId: "NXA-PREP-D1",
    utteranceSequence: ["show problems"],
    setup: "focus then restore subject",
    currentFocus: "ctx-problem-margin",
    activeCollection: null,
    journeyOrDialogue: "SCENARIO",
    refreshOrRestoration: "restored subject",
    expected: "Problems collection on Stage",
    actual: "single focused Problem",
    firstDivergentLayer: "CC:4 mapRevealCollection",
    authoritativeOwner: "DIR:1 presentNexoraMVPExecutiveQueueCollection",
    neighboringBehaviors: ["Queue click already correct"],
    focusedReproductionCommand: "./node_modules/.bin/tsx --test app/lib/nexora-certification/nxaConversationHarness.test.ts",
    failureClass: "deterministic",
    evidenceRequiredBeforeFix: ["Stage snapshot", "Advisor reply"],
    verdict: "REPRODUCED",
  });
  assert.equal(record.fixAuthorized, false);
  assert.equal(mayBeginConversationalFix(record), true);
});

test("insufficient evidence cannot begin a Fix", () => {
  const record = createConversationDiagnosis({
    defectId: "NXA-PREP-D2",
    utteranceSequence: ["show problems"],
    setup: "unknown",
    currentFocus: null,
    activeCollection: null,
    journeyOrDialogue: null,
    refreshOrRestoration: null,
    expected: "unknown",
    actual: "unknown",
    firstDivergentLayer: null,
    authoritativeOwner: null,
    neighboringBehaviors: [],
    focusedReproductionCommand: "",
    failureClass: "not_reproduced",
    evidenceRequiredBeforeFix: ["live reproduction"],
    verdict: "INSUFFICIENT_EVIDENCE",
  });
  assert.equal(mayBeginConversationalFix(record), false);
});
