import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { createInitialNexoraMVPObjectInteractionState, getDefaultNexoraMVPObjectInteractionCatalog } from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { projectManagerObjectConversationalSubjects } from "./managerObjectCatalog.ts";
import { createEmptyManagerObjectSession } from "./managerObjectActive.ts";
import { NEXORA_NXA3_BOUNDARY, verifyNexoraNxa3 } from "./nexoraNxa3ExecutiveSituation.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);
function run(utterance: string, previous?: ReturnType<typeof executeNexoraConversationalExperience>) {
  return executeNexoraConversationalExperience({
    utterance,
    executiveContext: previous?.nextExecutiveContext,
    conversationContext: previous?.nextConversationContext,
    executiveSubjects: subjects,
    runtimeState: previous?.nextRuntimeState ?? createInitialNexoraMVPObjectInteractionState({ workspace: "overview", presentationState: "minimum", environmentIntent: "neutral" }),
    catalog,
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? createEmptyManagerObjectSession(),
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    previousUtterance: previous?.managerMessage.text ?? null,
    messageIdSeed: `nxa3-${utterance}`,
  });
}

describe("NXA:3 Executive Situation", () => {
  it("is a derived read model with no shadow authority", () => {
    assert.equal(NEXORA_NXA3_BOUNDARY.readModelOnly, true);
    assert.equal(NEXORA_NXA3_BOUNDARY.createsMemoryStore, false);
    assert.equal(NEXORA_NXA3_BOUNDARY.createsDecisionStore, false);
    assert.equal(NEXORA_NXA3_BOUNDARY.writesStage, false);
    assert.equal(verifyNexoraNxa3().ok, true);
  });

  it("A preserves Goal awareness and causal uncertainty", () => {
    const goal = run("My goal is to improve delivery reliability.");
    const capacity = run("Show Capacity.", goal);
    const result = run("Why does Capacity matter?", capacity);
    assert.match(result.executiveSituation?.goal?.title ?? "", /delivery/i);
    assert.match(result.response, /delivery|goal/i);
    assert.notEqual(result.executiveSituation?.investigation.causalStatus, "CONFIRMED");
  });

  it("B maintains one cross-turn investigation situation", () => {
    let turn = run("Show Delivery.");
    turn = run("Show the problems.", turn);
    turn = run("Explain Capacity Gap.", turn);
    turn = run("Is it causing Delivery?", turn);
    turn = run("What should I check?", turn);
    assert.ok([
      turn.executiveSituation?.focus.label,
      ...(turn.executiveSituation?.focus.relatedSubjects ?? []),
    ].some((item) => /delivery/i.test(item ?? "")));
    assert.match(turn.executiveSituation?.focus.label ?? "", /Capacity Gap|Delivery/i);
    assert.equal(turn.executiveSituation?.investigation.causalStatus, "UNCONFIRMED");
    assert.match(turn.response, /Capacity|evidence|backlog|investigat/i);
  });

  it("C uses known current and target values", () => {
    const shown = run("Show Delivery.");
    const result = run("How far are we from the Goal?", shown);
    assert.doesNotMatch(result.response, /what is (?:the |your )?target/i);
    assert.match(result.response, /91|96|5%|5 points|target/i);
  });

  it("D invalidates advice when later manager evidence weakens its premise", () => {
    const advised = run("What should I do about Capacity Gap?");
    const evidence = run("Capacity is normal and is not the cause.", advised);
    const reassessed = run("What should I do now?", evidence);
    assert.equal(reassessed.executiveSituation?.advisory.status, "INVALIDATED");
    assert.match(reassessed.response, /would not repeat|reassess|weakens/i);
  });

  it("E manager override becomes current direction and recovery", () => {
    const advised = run("What should I do about Capacity Gap?");
    const override = run("No. Focus on Margin Pressure.", advised);
    const recovered = run("Where were we?", override);
    assert.match(recovered.executiveSituation?.focus.label ?? "", /Margin Pressure/i);
    assert.match(recovered.response, /Margin Pressure/i);
    assert.doesNotMatch(recovered.response, /focused on Capacity Gap/i);
  });

  it("I preserves manager assertion separately from validated evidence", () => {
    const shown = run("Show Delivery.");
    const asserted = run("Our latest number is 94% for Delivery.", shown);
    const kinds = asserted.executiveSituation?.investigation.claims.map((claim) => claim.kind) ?? [];
    assert.ok(kinds.includes("FACT"));
    assert.ok(kinds.includes("MANAGER_ASSERTION"));
    assert.equal(asserted.executiveSituation?.conversation.latestManagerAssertion != null, true);
  });

  it("J explicit topic shift invalidates old active focus", () => {
    const capacity = run("Show Capacity Gap.");
    const margin = run("Forget Capacity for now. Show Margin Pressure.", capacity);
    const next = run("What should I investigate?", margin);
    assert.match(next.executiveSituation?.focus.label ?? "", /Margin Pressure/i);
    assert.doesNotMatch(next.response, /^Investigate Capacity Gap/i);
  });

  it("K context recovery is compressed rather than a transcript dump", () => {
    let turn = run("Show Delivery.");
    turn = run("Why is it below target?", turn);
    turn = run("Where were we?", turn);
    assert.match(turn.response, /focused|Goal:|unresolved|causal/i);
    assert.ok(turn.response.length < 600);
  });

  it("L composes the same situation model across categories", () => {
    for (const name of ["Delivery", "Capacity Gap", "Risk", "Capacity Expansion Plan", "Expand Capacity", "Capacity Expansion"]) {
      const result = run(`Explain ${name}.`);
      assert.equal(result.executiveSituation?.identity, "NXA:3/ExecutiveContextSituationalAwareness");
    }
  });
});
