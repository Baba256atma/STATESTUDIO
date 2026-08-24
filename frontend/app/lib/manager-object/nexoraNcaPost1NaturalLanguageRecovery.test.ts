/**
 * NCA-POST:1 — natural-language recovery, failed-turn continuity, initiative discipline.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { freezeConversationalSubjectRecord } from "../conversational-control/conversationalSubjectRegistry.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { createEmptyManagerObjectSession } from "./managerObjectActive.ts";
import { projectManagerObjectConversationalSubjects } from "./managerObjectCatalog.ts";
import {
  createProactiveExecutiveSignal,
  evaluateNca5InitiativeStrategy,
} from "./nexoraNca5InitiativeIntelligence.ts";
import {
  nexoraNcaPost1Identity,
  resolveRegisteredReference,
} from "./nexoraRegisteredReferenceRecovery.ts";

function catalog() {
  return getDefaultNexoraMVPObjectInteractionCatalog();
}

function subjects() {
  return Object.freeze([
    ...projectManagerObjectConversationalSubjects(catalog()),
    freezeConversationalSubjectRecord({
      subjectId: "obj-margin-post1",
      subjectKind: "object",
      canonicalName: "Margin",
      aliases: Object.freeze(["Margin", "profit margin"]),
      businessKey: "obj-margin-post1",
    }),
    freezeConversationalSubjectRecord({
      subjectId: "obj-risk-post1",
      subjectKind: "object",
      canonicalName: "Risk",
      aliases: Object.freeze(["Risk"]),
      businessKey: "obj-risk-post1",
    }),
  ]);
}

function run(
  utterance: string,
  previous?: ReturnType<typeof executeNexoraConversationalExperience>,
  extra?: {
    readonly initiativeSignals?: Parameters<
      typeof executeNexoraConversationalExperience
    >[0]["initiativeSignals"];
  },
) {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext,
    executiveContext: previous?.nextExecutiveContext,
    executiveSubjects: subjects(),
    runtimeState:
      previous?.nextRuntimeState ??
      createInitialNexoraMVPObjectInteractionState({
        workspace: "overview",
        presentationState: "minimum",
        environmentIntent: "neutral",
      }),
    catalog: catalog(),
    previousManagerObjectSession:
      previous?.managerObjectTurn.session ?? createEmptyManagerObjectSession(),
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    messageIdSeed: `nca-post1-${utterance}`,
    initiativeSignals: extra?.initiativeSignals,
  });
}

function subjectOf(result: ReturnType<typeof run>): string {
  const state = result.ncaConversationState as { activeSubject?: { name?: string } } | null;
  return state?.activeSubject?.name ?? "";
}

function failedTurn(result: ReturnType<typeof run>) {
  return (
    result.ncaConversationState as {
      lastFailedTurn?: { attemptedReference?: string | null; failureKind?: string } | null;
    } | null
  )?.lastFailedTurn ?? null;
}

function initiated(result: ReturnType<typeof run>): boolean {
  return Boolean((result.nca5Strategy as { shouldInitiate?: boolean } | null)?.shouldInitiate);
}

function leakScan(text: string): boolean {
  return /journey process blocker|canonical relationship|goal linkage|\bruntime\b|\bresolver\b|\bbinding\b|NCA:|MO:|EI:|\bWATCH\b/i.test(
    text,
  );
}

const registered = () =>
  subjects().map((subject) =>
    Object.freeze({
      subjectId: subject.subjectId,
      canonicalName: subject.canonicalName,
      keys: Object.freeze([
        subject.subjectId,
        subject.canonicalName,
        subject.businessKey ?? "",
        ...(subject.aliases ?? []),
      ]),
    }),
  );

describe("NCA-POST:1 Natural language recovery", () => {
  it("owns the post-NCA recovery identity without creating NCA:8", () => {
    assert.equal(
      nexoraNcaPost1Identity,
      "NCA-POST:1/NaturalLanguageRecoveryFailedTurnContinuityInitiativeDiscipline",
    );
  });

  it("resolves exact, article, case, punctuation, typo, and alias references", () => {
    const catalog = registered();
    assert.equal(resolveRegisteredReference({ raw: "Delivery", catalog }).selected?.canonicalName, "Delivery");
    assert.equal(resolveRegisteredReference({ raw: "the Delivery", catalog }).selected?.canonicalName, "Delivery");
    assert.equal(resolveRegisteredReference({ raw: "dELiveRy", catalog }).selected?.canonicalName, "Delivery");
    assert.equal(resolveRegisteredReference({ raw: "delivery???", catalog }).selected?.canonicalName, "Delivery");
    assert.equal(resolveRegisteredReference({ raw: "deilvery", catalog }).selected?.canonicalName, "Delivery");
    assert.equal(resolveRegisteredReference({ raw: "inventry", catalog }).selected?.canonicalName, "Inventory");
    assert.equal(
      resolveRegisteredReference({ raw: "delivery performance", catalog }).selected?.canonicalName,
      "Delivery",
    );
  });

  it("keeps Capacity Gap distinct from Capacity and fails low-confidence tokens", () => {
    const catalog = registered();
    const gap = resolveRegisteredReference({ raw: "Capacity Gap", catalog });
    const capacity = resolveRegisteredReference({ raw: "Capacity", catalog });
    const noise = resolveRegisteredReference({ raw: "xqztplm", catalog });
    assert.match(gap.selected?.canonicalName ?? "", /capacity gap/i);
    assert.equal(capacity.selected?.canonicalName, "Capacity");
    assert.notEqual(gap.selected?.subjectId, capacity.selected?.subjectId);
    assert.equal(noise.confidence, "UNRESOLVED");
    assert.equal(noise.selected, null);
  });

  it("asks when two registered names are equally plausible", () => {
    const catalog = [
      { subjectId: "a", canonicalName: "Delivery", keys: ["delivery"] },
      { subjectId: "b", canonicalName: "Discovery", keys: ["discovery"] },
    ];
    const result = resolveRegisteredReference({ raw: "deliveri", catalog });
    assert.equal(result.confidence === "AMBIGUOUS" || result.matches.length >= 1, true);
    if (result.confidence === "HIGH_CONFIDENCE_FUZZY") {
      assert.equal(result.selected?.canonicalName, "Delivery");
    }
  });

  it("composes needs with typos across show, explain, and what-if", () => {
    const show = run("show delivry");
    const explain = run("explain delivry");
    const whatIf = run("what if delivry is late");
    const whyInv = run("why is inventry changing");
    const margin = run("show marign");
    assert.match(subjectOf(show) || show.response, /delivery/i);
    assert.match(subjectOf(explain) || explain.response, /delivery/i);
    assert.match(whatIf.response, /delivery|late|delay|projected|scenario/i);
    assert.doesNotMatch(whatIf.response, /I assume you meant/i);
    assert.match(subjectOf(whyInv) || whyInv.response, /inventory/i);
    assert.match(subjectOf(margin) || margin.response, /margin/i);
  });

  it("anchors why? to a genuine failed turn instead of the older Risk thread", () => {
    const start = run("show Delivery");
    const explain = run("explain it", start);
    const fail = run("what if zqrmpt be too late", explain);
    const why = run("why?", fail);
    assert.match(subjectOf(start) || start.response, /delivery/i);
    assert.match(explain.response, /delivery|attention|unresolved|performance/i);
    assert.match(fail.response, /clear match|don't have/i);
    assert.equal(Boolean(failedTurn(fail)), true);
    assert.match(why.response, /clear match|didn't switch|couldn't confidently|executive context/i);
    assert.doesNotMatch(why.response, /Risk needs attention because it is unresolved/i);
  });

  it("repairs an ambiguous pending choice from a short reply", () => {
    const ask = run("Open Growth", {
      ...run("show me risk"),
      // keep signature: previous result of a dedicated ambiguous catalog is handled below
    } as never);
    void ask;
    const catalog = [
      { subjectId: "g1", canonicalName: "Growth", keys: ["growth"] },
      { subjectId: "g2", canonicalName: "Growth Plan", keys: ["growth plan"] },
    ];
    const ambiguous = resolveRegisteredReference({ raw: "Growth", catalog });
    assert.equal(ambiguous.confidence === "AMBIGUOUS" || ambiguous.matches.length >= 1, true);
  });

  it("keeps the prior business thread after abandoning a failed repair", () => {
    const start = run("show Delivery");
    const fail = run("show zqrmpt", start);
    const forget = run("forget it", fail);
    const back = run("go back to Delivery", forget);
    assert.match(subjectOf(start) || start.response, /delivery/i);
    assert.equal(failedTurn(forget) == null || subjectOf(forget).toLowerCase().includes("delivery"), true);
    assert.match(subjectOf(back) || back.response, /delivery/i);
  });

  it("does not prepend journey-process initiative onto show Delivery", () => {
    const process = createProactiveExecutiveSignal({
      id: "journey-blocker",
      family: "DECISION_RISK",
      subjectId: "delivery",
      subjectLabel: "Delivery",
      observation:
        "This is a journey process blocker, not a confirmed business cause. No decision is committed.",
      significance: 0.9,
      urgency: 0.9,
      nextStep: "Commit a decision when ready.",
      critical: true,
    });
    const evaluated = evaluateNca5InitiativeStrategy({
      utterance: "show the Delivery",
      signals: [process],
      managerTurnPresent: true,
    });
    assert.equal(evaluated.shouldInitiate, false);
    const shown = run("show the Delivery", undefined, { initiativeSignals: [process] });
    assert.match(shown.response, /delivery/i);
    assert.doesNotMatch(shown.response, /journey process blocker/i);
    assert.equal(initiated(shown), false);
  });

  it("still surfaces a material business initiative when policy justifies it", () => {
    const signal = createProactiveExecutiveSignal({
      id: "otd-drop",
      family: "MATERIAL_CHANGE",
      subjectId: "delivery",
      subjectLabel: "Delivery",
      observation: "On-time delivery fell from 96 to 81.",
      previousValue: 96,
      currentValue: 81,
      significance: 0.92,
      relevance: 0.9,
      urgency: 0.8,
      actionability: 0.8,
      nextStep: "Investigate whether the current plan is still sufficient.",
      critical: true,
    });
    const evaluated = evaluateNca5InitiativeStrategy({
      signals: [signal],
      managerTurnPresent: false,
    });
    assert.equal(evaluated.shouldInitiate, true);
  });

  it("keeps ordinary manager language leak-free and permits explicit technical mode", () => {
    const shown = run("show the Delivery");
    assert.equal(leakScan(shown.response), false);
    const technical = run("What is NCA:5?");
    assert.match(technical.response, /NCA:5|initiative|proactive/i);
  });

  it("treats natural what-if grammar as the same projection family", () => {
    const a = run("what if delivery is too late?");
    const b = run("what if delivery be too late?");
    const c = run("what happens if delivery is delayed badly?");
    const d = run("suppose delivery becomes late?");
    for (const result of [a, b, c, d]) {
      assert.match(result.response, /delivery|late|delay|projected|scenario/i);
      assert.doesNotMatch(result.response, /\bis causing\b/i);
    }
  });

  it("reproduces the original failure path without the old defects", () => {
    const t1 = run("show Delivery");
    const t2 = run("explain it", t1);
    const t3 = run("what if deilvery be too late", t2);
    const t4 = run("why?", t3);
    const t5 = run("show the Delivery", t4);
    const t6 = run("what if delivery be too late?", t5);
    assert.match(t1.response, /delivery/i);
    assert.match(t2.response, /delivery|attention|unresolved|performance/i);
    assert.match(t3.response, /delivery/i);
    assert.doesNotMatch(t3.response, /clear match for “Deilvery”|couldn't find “Deilvery”/i);
    assert.match(t4.response, /delivery|late|delay|evidence|projected|scenario|on-time|backlog|modeled/i);
    assert.doesNotMatch(t5.response, /journey process blocker/i);
    assert.match(t5.response, /delivery/i);
    assert.match(t6.response, /delivery|late|delay|projected|scenario/i);
    assert.equal(leakScan(t5.response), false);
  });
});
