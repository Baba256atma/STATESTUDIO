/**
 * NEX-MVP-FINAL:6.5 — Guidance & Self-Knowledge tests.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { freezeConversationalSubjectRecord } from "../conversational-control/conversationalSubjectRegistry.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { NEXORA_MANAGER_ARCHITECTURE_LEAK } from "../nexora-entrance/nexoraMvpFinalCertification.ts";
import { projectManagerObjectConversationalSubjects } from "./managerObjectCatalog.ts";
import { createEmptyManagerObjectSession } from "./managerObjectActive.ts";
import {
  GUIDANCE_CERTIFICATION_DIALOGUES,
  PROACTIVE_SHOULD_NOT,
  countGuidanceTurns,
} from "./nexoraMvpFinal65GuidanceCorpus.ts";
import {
  NEXORA_MVP_FINAL65_GUIDANCE_BOUNDARY,
  classifyGuidanceIntent,
  getNexoraMvpFinal65GuidanceIdentity,
  projectNexoraCapabilities,
  verifyNexoraMvpFinal65Guidance,
} from "./nexoraMvpFinal65Guidance.ts";
import { interpretCanonicalManagerMeaning } from "./canonicalManagerMeaningInterpreter.ts";

function catalog() {
  return getDefaultNexoraMVPObjectInteractionCatalog();
}

function syntheticSubjects() {
  return Object.freeze([
    ...projectManagerObjectConversationalSubjects(catalog()),
    freezeConversationalSubjectRecord({
      subjectId: "obj-profit-synth",
      subjectKind: "object",
      canonicalName: "Profit",
      aliases: Object.freeze(["Profit"]),
      businessKey: "obj-profit-synth",
    }),
    freezeConversationalSubjectRecord({
      subjectId: "obj-cash-synth",
      subjectKind: "object",
      canonicalName: "Cash Flow",
      aliases: Object.freeze(["cash flow"]),
      businessKey: "obj-cash-synth",
    }),
    freezeConversationalSubjectRecord({
      subjectId: "obj-loan-synth",
      subjectKind: "object",
      canonicalName: "Loan Exposure",
      aliases: Object.freeze(["loan exposure"]),
      businessKey: "obj-loan-synth",
    }),
    freezeConversationalSubjectRecord({
      subjectId: "obj-quality-synth",
      subjectKind: "object",
      canonicalName: "Quality",
      aliases: Object.freeze(["Quality"]),
      businessKey: "obj-quality-synth",
    }),
  ]);
}

function run(
  utterance: string,
  previous?: ReturnType<typeof executeNexoraConversationalExperience>,
) {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext,
    executiveContext: previous?.nextExecutiveContext,
    executiveSubjects: syntheticSubjects(),
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
    messageIdSeed: `nex-mvp-final65-${utterance}`,
  });
}

const COMMIT = /decision is approved|I(?:'ll| will) decide|automatically approve/i;
const EXECUTE = /execution has started|I(?:'ve| have) started execution/i;
const INTERNAL = /READY_FOR_[A-Z_]+|\bMO:\d|\bEI:\d|\bCC:\d|FINAL:6\.5|DECISION_REQUIRED/;

describe("NEX-MVP-FINAL:6.5 Guidance & Self-Knowledge", () => {
  it("has FINAL:6.5 identity and does not create competing engines", () => {
    assert.equal(
      getNexoraMvpFinal65GuidanceIdentity().id,
      "NEX-MVP-FINAL:6.5/GuidanceSelfKnowledge",
    );
    assert.equal(NEXORA_MVP_FINAL65_GUIDANCE_BOUNDARY.createsSecondCapabilityRegistry, false);
    assert.equal(NEXORA_MVP_FINAL65_GUIDANCE_BOUNDARY.createsSecondJourneyEngine, false);
    assert.equal(NEXORA_MVP_FINAL65_GUIDANCE_BOUNDARY.createsSecondAdvisor, false);
    assert.equal(verifyNexoraMvpFinal65Guidance().ok, true);
  });

  it("meets corpus size", () => {
    assert.ok(GUIDANCE_CERTIFICATION_DIALOGUES.length >= 70);
    assert.ok(countGuidanceTurns() >= 220);
  });

  it("projects capabilities from existing authorities", () => {
    const first = run("Hi.");
    const projected = projectNexoraCapabilities(first.managerObjectTurn, ["Profit"]);
    assert.ok(projected.some((item) => item.id === "COMPARE_SCENARIOS"));
    assert.ok(projected.some((item) => item.id === "INSPECT_PROFIT"));
    assert.equal(
      projected.find((item) => item.id === "COMPARE_SCENARIOS")?.authority,
      "CC:9/EI:4",
    );
  });

  it("classifies unseen capability language without phrase tables for each sentence", () => {
    const meaning = interpretCanonicalManagerMeaning({
      utterance: "What are you useful for?",
      subjects: syntheticSubjects(),
    });
    assert.equal(classifyGuidanceIntent(meaning, "What are you useful for?"), "CAPABILITY");
  });

  it("does not hijack object knowledge into help", () => {
    let previous = run("Show Delivery.");
    previous = run("What do you know about Delivery?", previous);
    assert.doesNotMatch(previous.response, /Start with the outcome you want to improve/i);
    assert.match(previous.response, /Delivery/i);
  });

  it("answers product fiction without fabricating integrations", () => {
    const result = run("Can you update our ERP?");
    assert.match(result.response, /can(?:'|’)t|cannot|can not/i);
    assert.doesNotMatch(result.response, /I'll update the ERP/i);
    assert.equal(result.guidanceTurn.availability, "NOT_SUPPORTED");
    assert.equal(result.guidanceTurn.commitsDecision, false);
    assert.equal(result.guidanceTurn.startsExecution, false);
  });

  it("explains missing scenario comparison prerequisites", () => {
    const result = run("What options do we have?");
    assert.match(result.response, /option|scenario/i);
    assert.doesNotMatch(result.response, /Unknown intent/i);
    if (result.guidanceTurn.intent === "OPTIONS") {
      assert.ok(
        result.guidanceTurn.availability === "BLOCKED_BY_PREREQUISITE" ||
          result.guidanceTurn.availability === "AVAILABLE_NOW" ||
          result.guidanceTurn.action === "keep",
      );
    }
  });

  it("does not start execution from Start without an approved decision", () => {
    const result = run("Start.");
    assert.doesNotMatch(result.response, EXECUTE);
    assert.equal(result.guidanceTurn.startsExecution, false);
  });

  it("changes what-can-you-do with context", () => {
    const entrance = run("What can you do?");
    let later = run("Show Delivery.");
    later = run("What can you do?", later);
    assert.notEqual(entrance.response, later.response);
  });

  it("handles synthetic registered subjects through the projection", () => {
    const result = run("Can you help me understand Profit?");
    assert.match(result.response, /Profit/i);
    assert.doesNotMatch(result.response, /I can't help with Profit/i);
  });

  it("runs the guidance corpus without architecture leaks or unsafe commitments", () => {
    for (const dialogue of GUIDANCE_CERTIFICATION_DIALOGUES) {
      let previous: ReturnType<typeof run> | undefined;
      for (const turn of dialogue.turns) {
        previous = run(turn.utterance, previous);
        assert.doesNotMatch(previous.response, NEXORA_MANAGER_ARCHITECTURE_LEAK);
        assert.doesNotMatch(previous.response, INTERNAL);
        if (turn.require) {
          for (const needle of turn.require) {
            assert.match(
              previous.response,
              new RegExp(needle, "i"),
              `${dialogue.id}: ${turn.utterance}`,
            );
          }
        }
        if (turn.forbid) {
          for (const needle of turn.forbid) {
            assert.doesNotMatch(
              previous.response,
              new RegExp(needle, "i"),
              `${dialogue.id}: ${turn.utterance}`,
            );
          }
        }
        if (turn.mustNotCommit) assert.doesNotMatch(previous.response, COMMIT);
        if (turn.mustNotExecute) assert.doesNotMatch(previous.response, EXECUTE);
        if (turn.noInternalState) assert.doesNotMatch(previous.response, /READY_FOR/);
      }
    }
  });

  it("keeps proactive guidance rare on narrow requests", () => {
    let falsePositives = 0;
    for (const dialogue of PROACTIVE_SHOULD_NOT) {
      let previous: ReturnType<typeof run> | undefined;
      for (const turn of dialogue.turns) {
        previous = run(turn.utterance, previous);
        if (previous.guidanceTurn.proactiveEligible && previous.guidanceTurn.action !== "keep") {
          falsePositives += 1;
        }
      }
    }
    assert.equal(falsePositives, 0);
  });

  it("can suggest a next step on open now-what", () => {
    let previous = run("Show Delivery.");
    previous = run("Now what?", previous);
    assert.ok(previous.response.length > 0);
    assert.doesNotMatch(previous.response, /Step 1 complete/i);
  });

  it("proactive yes cases stay non-wizard", () => {
    for (const dialogue of GUIDANCE_CERTIFICATION_DIALOGUES.filter((item) =>
      item.category.includes("stuck"),
    )) {
      let previous: ReturnType<typeof run> | undefined;
      for (const turn of dialogue.turns) {
        previous = run(turn.utterance, previous);
        assert.doesNotMatch(previous.response, /Step 1 complete/i);
      }
    }
  });
});
