import assert from "node:assert/strict";
import test from "node:test";

import { toNexoraConversationContextSnapshot } from "../conversational-control/executiveContextProjection.ts";
import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { interpretCanonicalManagerMeaning } from "../manager-object/canonicalManagerMeaningInterpreter.ts";
import { projectManagerObjectConversationalSubjects } from "../manager-object/managerObjectCatalog.ts";
import { resolveRegisteredReference } from "../manager-object/nexoraRegisteredReferenceRecovery.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);

type Turn = ReturnType<typeof executeNexoraConversationalExperience>;

function run(utterance: string, previous?: Turn): Turn {
  const executiveContext = previous?.nextExecutiveContext;
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: executiveContext
      ? toNexoraConversationContextSnapshot(executiveContext)
      : previous?.nextConversationContext,
    executiveContext,
    executiveSubjects: subjects,
    runtimeState:
      previous?.nextRuntimeState ??
      createInitialNexoraMVPObjectInteractionState({
        workspace: "overview",
        presentationState: "minimum",
        environmentIntent: "neutral",
      }),
    catalog,
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? null,
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    allowActiveStageContext: false,
    lastAppliedCommandId: previous?.commandResult?.command?.commandId ?? null,
    attentionNowMs: 1_725_000_000_000,
    messageIdSeed: `fix18-${utterance}`,
  });
}

function chain(...utterances: readonly string[]): Turn {
  let turn: Turn | undefined;
  for (const utterance of utterances) turn = run(utterance, turn);
  assert.ok(turn);
  return turn;
}

function scenarioOperation(turn: Turn): string | null {
  return turn.intentResult.intent.scenarioPayload?.operation ?? null;
}

function continuityId(turn: Turn): string | null {
  return turn.managerObjectTurn.session.conversationContinuity?.activeSubjectId ?? null;
}

// Cluster A — Scenario deictic routing (FIX14-R4 regression)

test("FIX18 A1: a targeted investigation of the resolved Scenario describes that Scenario", () => {
  for (const [name, id] of [
    ["Demand Surge", "ctx-scenario-demand"],
    ["Capacity Expansion Plan", "ctx-scenario-capacity"],
  ] as const) {
    const focused = run(name);
    for (const utterance of ["investigate it", "look deeper into it", "what else do we know about it?"]) {
      const turn = run(utterance, focused);
      assert.equal(turn.intentResult.intent.kind, "explain-scenario", `${name} / ${utterance}`);
      assert.equal(scenarioOperation(turn), "describe", `${name} / ${utterance}`);
      assert.equal(continuityId(turn), id, `${name} / ${utterance}`);
      assert.match(turn.response, new RegExp(name, "i"), `${name} / ${utterance}`);
      assert.doesNotMatch(turn.response, /There isn't a current Scenario impact assessment/i);
    }
  }
});

test("FIX18 A2: Scenario Why? keeps the R4 impact-why operation", () => {
  for (const name of ["Demand Surge", "Capacity Expansion Plan"]) {
    const why = run("Why?", run(name));
    assert.equal(why.intentResult.intent.kind, "explain-scenario", name);
    assert.equal(scenarioOperation(why), "impact-why", name);
  }
  const afterInvestigation = run("Why?", run("investigate it", run("Demand Surge")));
  assert.equal(scenarioOperation(afterInvestigation), "impact-why");
});

test("FIX18 A3: explicit Scenario explain keeps the existing describe behavior", () => {
  const focused = run("Demand Surge");
  for (const utterance of ["explain it", "tell me more about it"]) {
    const turn = run(utterance, focused);
    assert.equal(scenarioOperation(turn), "describe", utterance);
    assert.match(turn.response, /Demand Surge/i, utterance);
  }
});

test("FIX18 A4: an investigation whose referent is not the Scenario is not captured by an older Scenario", () => {
  for (const turn of [
    chain("Demand Surge", "Capacity Gap", "investigate it"),
    chain("show me scenarios", "Capacity Gap", "investigate it"),
  ]) {
    assert.notEqual(turn.intentResult.intent.kind, "explain-scenario");
    assert.equal(continuityId(turn), "ctx-problem-capacity");
    assert.match(turn.response, /Capacity Gap/i);
    assert.doesNotMatch(turn.response, /Demand Surge is a scenario/i);
  }
});

test("FIX18 A5: an investigation without a resolvable referent still clarifies", () => {
  const turn = chain("What needs my attention first?", "investigate it");
  assert.notEqual(turn.intentResult.intent.kind, "explain-scenario");
  assert.equal(continuityId(turn), null);
  assert.match(turn.response, /Which one/i);
});

test("FIX18 A6: Scenario investigation stays read-only, exactly like the existing describe path", () => {
  const focused = run("Demand Surge");
  const decisionCount = (turn: Turn) => turn.decisionRuntime?.listDecisions().length ?? 0;
  const provenanceCount = (turn: Turn) =>
    Object.keys(turn.nextDecisionSession?.provenanceByDecisionId ?? {}).length;
  const described = run("explain it", focused);
  for (const utterance of ["investigate it", "look deeper into it", "what else do we know about it?"]) {
    const turn = run(utterance, focused);
    assert.equal(turn.shouldCommitRuntime, false, utterance);
    assert.equal(turn.directorPlan?.mutationRequired ?? false, false, utterance);
    assert.equal(turn.decisionCommitmentResult ?? null, null, utterance);
    assert.equal(decisionCount(turn), decisionCount(focused), utterance);
    assert.equal(provenanceCount(turn), provenanceCount(focused), utterance);
    assert.deepEqual(
      turn.nextScenarioSession?.candidateScenarioIds ?? [],
      described.nextScenarioSession?.candidateScenarioIds ?? [],
      utterance,
    );
  }
});

// Cluster B — compound/fuzzy referent (FIX10 / R9 regression)

function objectName(turn: Turn): string | null {
  return turn.contextualManagerMeaning.objectReference?.canonicalName ?? null;
}

const REGISTRY = [
  { subjectId: "x-harbor", canonicalName: "Harbor", keys: ["harbor"] },
  { subjectId: "x-harbor-delay", canonicalName: "Harbor Delay", keys: ["harbor delay"] },
  { subjectId: "x-crane", canonicalName: "Crane", keys: ["crane", "shipping crane"] },
] as const;

test("FIX18 B1: a misspelled shared word resolves to the entity of the active listing", () => {
  const problem = chain("What are the main problems?", "look at capcity");
  assert.equal(objectName(problem), "Capacity Gap");
  assert.match(problem.response, /Capacity Gap/);
  const scenario = chain("show me scenarios", "look at demnd");
  assert.equal(objectName(scenario), "Demand Surge");
  assert.match(scenario.response, /Demand Surge/);
});

test("FIX18 B2: a unique head noun keeps the R9 resolution", () => {
  assert.equal(
    interpretCanonicalManagerMeaning({ utterance: "What pressure deserves my attention?", subjects }).objectReference
      ?.subjectId,
    "ctx-problem-margin",
  );
  assert.equal(objectName(run("show me pressure")), "Margin Pressure");
});

test("FIX18 B3: a misspelled shared word without context stays ambiguous at the registry", () => {
  const resolution = resolveRegisteredReference({ raw: "look at harbr", catalog: REGISTRY });
  assert.equal(resolution.confidence, "AMBIGUOUS");
  assert.equal(resolution.selected, null);
  assert.deepEqual(
    resolution.matches.map((match) => match.canonicalName).sort(),
    ["Harbor", "Harbor Delay"],
  );
  const cold = run("look at capcity");
  assert.match(cold.response, /more than one/i);
});

test("FIX18 B4/B5: explicit names select exactly, in and out of a listing", () => {
  assert.equal(objectName(chain("show me problems", "look at Capacity")), "Capacity");
  assert.equal(objectName(chain("show me problems", "look at Capacity Gap")), "Capacity Gap");
  assert.equal(resolveRegisteredReference({ raw: "harbor", catalog: REGISTRY }).selected?.canonicalName, "Harbor");
  assert.equal(
    resolveRegisteredReference({ raw: "harbor delay", catalog: REGISTRY }).selected?.canonicalName,
    "Harbor Delay",
  );
});

test("FIX18 B6: a fuzzy mention of another entity is not captured by the active subject", () => {
  assert.equal(objectName(chain("Capacity Gap", "look at delivry")), "Delivery");
  assert.equal(objectName(chain("Capacity Gap", "look at inventry")), "Inventory");
  assert.match(chain("Delivery", "look at capcity").response, /more than one/i);
});

test("FIX18 B7: isolated interpretation keeps every candidate of a shared word", () => {
  const meaning = interpretCanonicalManagerMeaning({ utterance: "look at capcity", subjects });
  const names = meaning.ambiguity.candidates.map((candidate) => candidate.canonicalName);
  assert.equal(meaning.ambiguity.reason, "multiple-objects");
  assert.ok(names.includes("Capacity") && names.includes("Capacity Gap"), names.join(", "));
});

test("FIX18 B8: an uncovered word of a compound key never selects on its own (FIX10)", () => {
  const resolution = resolveRegisteredReference({ raw: "shiping", catalog: REGISTRY });
  assert.equal(resolution.selected, null);
  assert.equal(resolution.matches.length, 0);
  assert.notEqual(
    interpretCanonicalManagerMeaning({ utterance: "What does the production data show?", subjects }).objectReference
      ?.subjectId,
    "obj-capacity",
  );
});

// Cluster C — contrastive "other" (NCA:2 regression)

const ORDERED_LIST_CLARIFICATION = /I don't have a current ordered list/i;

test("FIX18 C1: contrastive other binds the uniquely determined sibling Problem", () => {
  for (const [active, sibling] of [
    ["Capacity Gap", "Margin Pressure"],
    ["Margin Pressure", "Capacity Gap"],
  ] as const) {
    const turn = chain(active, "why", "and the other one?");
    assert.equal(objectName(turn), sibling, active);
    assert.match(turn.response, new RegExp(sibling), active);
    assert.doesNotMatch(turn.response, ORDERED_LIST_CLARIFICATION, active);
    assert.doesNotMatch(turn.response, /which business outcome/i, active);
  }
  const contrast = chain("Capacity Gap", "Margin Pressure", "the other one");
  assert.equal(objectName(contrast), "Capacity Gap");
});

test("FIX18 C2: several plausible siblings are not guessed", () => {
  const scenario = chain("Demand Surge", "why", "and the other one?");
  assert.equal(scenario.contextualManagerMeaning.provenance, "UNRESOLVED");
  assert.equal(objectName(scenario), null);
  const listed = chain("show me scenarios", "Demand Surge", "the other one");
  assert.equal(objectName(listed), null);
  assert.equal(listed.clarificationTurn.action, "clarify");
});

test("FIX18 C3: a real ordinal without an ordered collection still clarifies", () => {
  for (const turn of [
    chain("Capacity Gap", "the second one"),
    chain("Capacity Gap", "why", "explain the second problem"),
  ]) {
    assert.match(turn.response, ORDERED_LIST_CLARIFICATION);
  }
});

test("FIX18 C4: a valid ordered collection keeps ordinal selection", () => {
  const second = chain("show me problems", "explain the second problem");
  assert.equal(objectName(second), "Margin Pressure");
  assert.match(second.response, /Margin Pressure/);
  const other = chain("show me problems", "the other one");
  assert.match(other.response, /Margin Pressure/);
  assert.doesNotMatch(other.response, ORDERED_LIST_CLARIFICATION);
});

test("FIX18 C5: contrastive other does not bind a recently mentioned subject of another kind", () => {
  for (const [previous, active, sibling] of [
    ["Capacity", "Capacity Gap", "Margin Pressure"],
    ["Delivery", "Margin Pressure", "Capacity Gap"],
    ["Demand Surge", "Capacity Gap", "Margin Pressure"],
  ] as const) {
    const turn = chain(previous, active, "and the other one?");
    assert.equal(objectName(turn), sibling, `${previous} → ${active}`);
  }
  assert.match(chain("Capacity", "Capacity Gap", "and the other one?").response, /Margin Pressure/);
  const crossKind = chain("Capacity Gap", "Demand Surge", "and the other one?");
  assert.notEqual(objectName(crossKind), "Capacity Gap");
});
