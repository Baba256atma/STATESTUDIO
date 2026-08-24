/**
 * NEX-MVP-FINAL:3 — natural object reference + executive explanation quality.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import {
  buildNexoraConversationalSubjectMatchIndex,
  findCanonicalSubjectMatchesForHint,
  freezeConversationalSubjectRecord,
} from "../conversational-control/conversationalSubjectRegistry.ts";
import { classifyNexoraExiUtterance } from "../nex-mvp/nexoraExecutiveIntelligenceExperience.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { projectManagerObjectConversationalSubjects } from "./managerObjectCatalog.ts";
import { NEXORA_MANAGER_ARCHITECTURE_LEAK } from "../nexora-entrance/nexoraMvpFinalCertification.ts";

const here = dirname(fileURLToPath(import.meta.url));

const DATABASE_STYLE =
  /tracked business object|current executive context|recorded status|recorded relationship|Evidence:|Recommended next:|\bNext: |Nexora knows /i;

function catalog() {
  return getDefaultNexoraMVPObjectInteractionCatalog();
}

function subjects() {
  return projectManagerObjectConversationalSubjects(catalog());
}

function initialState() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function run(
  utterance: string,
  previous?: ReturnType<typeof executeNexoraConversationalExperience>,
) {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext,
    executiveContext: previous?.nextExecutiveContext,
    executiveSubjects: subjects(),
    runtimeState: previous?.nextRuntimeState ?? initialState(),
    catalog: catalog(),
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? null,
    messageIdSeed: `nex-mvp-final3-${utterance}`,
  });
}

function focusedId(
  result: ReturnType<typeof executeNexoraConversationalExperience>,
) {
  return (
    result.nextRuntimeState.focusedSubject?.id ??
    result.managerObjectTurn.activeObjectId ??
    result.contextResult.context.primarySubject?.subjectId ??
    result.managerObjectTurn.session.activeObjectId ??
    null
  );
}

function leakCount(text: string): number {
  const architecture = text.match(new RegExp(NEXORA_MANAGER_ARCHITECTURE_LEAK, "gi")) ?? [];
  const database = text.match(new RegExp(DATABASE_STYLE, "gi")) ?? [];
  return architecture.length + database.length;
}

describe("NEX-MVP-FINAL:3 Natural Object Reference & Executive Explanation", () => {
  it("exact-first matching preserves a real name that contains object", () => {
    const index = buildNexoraConversationalSubjectMatchIndex([
      freezeConversationalSubjectRecord({
        subjectId: "obj-risk",
        subjectKind: "object",
        canonicalName: "Risk",
        aliases: Object.freeze(["Risk"]),
        businessKey: "obj-risk",
      }),
      freezeConversationalSubjectRecord({
        subjectId: "obj-risk-object",
        subjectKind: "object",
        canonicalName: "Risk Object",
        aliases: Object.freeze(["Risk Object"]),
        businessKey: "obj-risk-object",
      }),
    ]);
    const exact = findCanonicalSubjectMatchesForHint("risk object", index);
    assert.equal(exact.length, 1);
    assert.equal(exact[0]?.subjectId, "obj-risk-object");
    const onlyRisk = findCanonicalSubjectMatchesForHint(
      "risk object",
      buildNexoraConversationalSubjectMatchIndex([
        freezeConversationalSubjectRecord({
          subjectId: "obj-risk",
          subjectKind: "object",
          canonicalName: "Risk",
          aliases: Object.freeze(["Risk"]),
          businessKey: "obj-risk",
        }),
      ]),
    );
    assert.equal(onlyRisk[0]?.subjectId, "obj-risk");
  });

  it("natural phrase variations resolve to the same Risk subject", () => {
    const phrases = [
      "show risk",
      "show me risk",
      "show me the risk",
      "show the risk object",
      "show me risk object",
      "open risk",
      "open the risk object",
      "focus on risk",
      "take me to risk",
    ];
    for (const phrase of phrases) {
      const result = run(phrase);
      assert.equal(focusedId(result), "obj-risk", phrase);
      assert.doesNotMatch(result.response, /couldn.t find/i);
    }
  });

  it("delivery object phrases resolve to canonical Delivery", () => {
    const phrases = [
      "show delivery",
      "show me delivery",
      "show delivery object",
      "show me the delivery object",
      "open the delivery object",
      "focus on delivery object",
    ];
    for (const phrase of phrases) {
      const result = run(phrase);
      assert.equal(focusedId(result), "obj-delivery", phrase);
    }
  });

  it("deliver object uses controlled er→ery manager language, not a Delivery branch", () => {
    const shown = run("show me deliver object");
    assert.equal(focusedId(shown), "obj-delivery");
    const source = readFileSync(
      join(here, "../conversational-control/conversationalSubjectRegistry.ts"),
      "utf8",
    );
    assert.doesNotMatch(source, /if \(.*deliver.*\)/);
    assert.doesNotMatch(source, /["']deliver["']\s*=>/);
  });

  it("explain variants stay on Risk after natural focus", () => {
    const focused = run("show me the risk object");
    for (const phrase of [
      "explain risk",
      "explain the risk",
      "explain this risk",
      "explain this object",
      "explain it",
    ]) {
      const explained = run(phrase, focused);
      assert.equal(focusedId(explained), "obj-risk", phrase);
      assert.match(explained.response, /Risk/i);
    }
  });

  it("representative types resolve through object filler when unambiguous", () => {
    const explainCases = [
      ["show me risk object", "obj-risk", /Risk/],
      ["show me the Capacity object", "obj-capacity", /Capacity/],
      ["show inventory object", "obj-inventory", /Inventory/],
      ["show the Margin Pressure object", "ctx-problem-margin", /Margin Pressure/],
    ] as const;
    for (const [utterance, id, expected] of explainCases) {
      const shown = run(utterance);
      assert.equal(focusedId(shown), id, utterance);
      const explained = run("explain it", shown);
      assert.equal(focusedId(explained), id, `explain after ${utterance}`);
      assert.match(explained.response, expected);
      assert.equal(leakCount(explained.response), 0, explained.response);
      assert.doesNotMatch(explained.response, DATABASE_STYLE);
    }

    const focusCases = [
      ["show the Pricing Response object", "ctx-scenario-pricing"],
      ["show the Expand Capacity object", "ctx-decision-capacity"],
      ["show the Pricing Rollout object", "ctx-execution-rollout"],
    ] as const;
    for (const [utterance, id] of focusCases) {
      const shown = run(utterance);
      assert.equal(focusedId(shown), id, utterance);
      assert.doesNotMatch(shown.response, /couldn.t find/i);
    }
  });

  it("Goal natural-reference resolves the registered Goal when unambiguous", () => {
    const shown = run("show me the Goal object");
    assert.equal(
      shown.contextResult.context.primarySubject?.subjectId,
      "goal-capacity-availability",
    );
    const explained = run("Explain Goal.");
    assert.match(explained.response, /Goal|Capacity Gap/i);
    assert.equal(leakCount(explained.response), 0);
  });

  it("does not fabricate a unique Scenario from show the Scenario object", () => {
    const result = run("show the Scenario object");
    assert.notEqual(focusedId(result), "obj-risk");
    if (focusedId(result) != null) {
      assert.match(result.nextRuntimeState.focusedSubject?.label ?? "", /./);
    } else {
      assert.match(result.response, /couldn.t find|more than one|which/i);
    }
  });

  it("keeps deictic continuity across Inventory then Capacity", () => {
    const inventory = run("show inventory object");
    assert.equal(focusedId(inventory), "obj-inventory");
    const capacity = run("show capacity object", inventory);
    assert.equal(focusedId(capacity), "obj-capacity");
    const explained = run("explain it", capacity);
    assert.equal(focusedId(explained), "obj-capacity");
    assert.match(explained.response, /Capacity/i);
    assert.doesNotMatch(explained.response, /Inventory currently/i);
  });

  it("Stage click and Chat natural reference share the same Risk subject", () => {
    const clicked = selectNexoraMVPInteractionSubject(initialState(), "obj-risk");
    const spoken = run("show me the risk object");
    assert.equal(clicked.focusedSubject?.id, "obj-risk");
    assert.equal(focusedId(spoken), clicked.focusedSubject?.id);
  });

  it("Explain vs Change remains separated", () => {
    assert.equal(classifyNexoraExiUtterance("Explain Risk."), null);
    assert.equal(classifyNexoraExiUtterance("explain it"), null);
    assert.equal(classifyNexoraExiUtterance("What is this?"), null);
    assert.equal(classifyNexoraExiUtterance("What changed?"), "change");
    assert.equal(classifyNexoraExiUtterance("Has Risk changed?"), "change");
    const focused = run("show me risk object");
    const explained = run("explain it", focused);
    assert.doesNotMatch(explained.response, /prior-state comparison/i);
    const changed = run("What changed?", explained);
    assert.equal(changed.intentResult.intent.kind, "change");
    assert.doesNotMatch(explained.response, /prior-state comparison/i);
  });

  it("Risk explain is concise, executive, and evidence-honest", () => {
    const focused = run("show me risk object");
    const explained = run("explain it", focused);
    assert.match(explained.response, /Risk/i);
    assert.match(explained.response, /unresolved|attention/i);
    assert.match(explained.response, /Margin Pressure/i);
    assert.match(explained.response, /associated with|not enough evidence|the reverse|not .*(cause|causing)/i);
    assert.doesNotMatch(explained.response, DATABASE_STYLE);
    assert.ok(explained.response.length < 900, explained.response);
    assert.equal(leakCount(explained.response), 0);
  });

  it("progressive follow-up keeps Risk and deepens without dumping", () => {
    let turn = run("show me risk object");
    turn = run("explain it", turn);
    const explain = turn.response;
    turn = run("why?", turn);
    assert.equal(focusedId(turn), "obj-risk");
    assert.match(turn.response, /Risk|Margin Pressure|cause|evidence/i);
    assert.doesNotMatch(turn.response, /Margin Pressure is causing the Risk/i);
    turn = run("what does it affect?", turn);
    assert.equal(focusedId(turn), "obj-risk");
    assert.match(turn.response, /associated|connected|affect|Margin Pressure/i);
    turn = run("what should I do?", turn);
    assert.equal(focusedId(turn), "obj-risk");
    assert.match(turn.response, /recommend|investigate|Margin Pressure/i);
    assert.equal(leakCount(explain + turn.response), 0);
  });

  it("show risk problem stays ambiguous", () => {
    const result = run("show risk problem");
    assert.notEqual(focusedId(result), "obj-risk");
    assert.notEqual(focusedId(result), "ctx-problem-margin");
    assert.match(
      result.response,
      /more than one|which one|which item|Which|KPI or the problem/i,
    );
  });

  it("contains no object-specific canned explanation branches", () => {
    const engine = readFileSync(join(here, "managerObjectExplainEngine.ts"), "utf8");
    const composer = readFileSync(
      join(here, "managerObjectExperienceComposer.ts"),
      "utf8",
    );
    for (const source of [engine, composer]) {
      assert.doesNotMatch(source, /if\s*\([^)]*(?:label|identity)[^)]*=== [^)]*Risk/);
      assert.doesNotMatch(source, /if \(label === ["']Inventory["']\)/);
      assert.doesNotMatch(source, /if \(label === ["']Capacity["']\)/);
    }
  });
});
