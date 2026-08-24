/**
 * NCA-POST:3 — semantic scope, multi-entity, collections, workspace.
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
  classifyNexoraSemanticScope,
  composeNexoraSemanticTurn,
  extractManagerReferenceSet,
  interpretRelationshipQuery,
  nexoraNcaPost3Identity,
  resolveCanonicalCollectionMembership,
  verifyNexoraNcaPost3,
} from "./nexoraNcaPost3SemanticScopeMultiEntityCanonicalCollectionWorkspaceIntelligence.ts";

function catalog() {
  return getDefaultNexoraMVPObjectInteractionCatalog();
}

function subjects() {
  return Object.freeze([
    ...projectManagerObjectConversationalSubjects(catalog()),
    freezeConversationalSubjectRecord({
      subjectId: "obj-quality-post3",
      subjectKind: "object",
      canonicalName: "Quality",
      aliases: Object.freeze(["Quality"]),
      businessKey: "obj-quality-post3",
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
    messageIdSeed: `nca-post3-${utterance}`,
  });
}

describe("NCA-POST:3 Semantic scope, multi-entity, collections, workspace", () => {
  it("owns identity without creating NCA:8", () => {
    assert.match(nexoraNcaPost3Identity, /^NCA-POST:3\//);
    assert.equal(verifyNexoraNcaPost3().ok, true);
  });

  it("classifies semantic scopes", () => {
    assert.equal(classifyNexoraSemanticScope("Why is Delivery late?"), "BUSINESS");
    assert.equal(classifyNexoraSemanticScope("What is Nexora?"), "NEXORA_PRODUCT");
    assert.equal(classifyNexoraSemanticScope("What is the Stage?"), "NEXORA_PRODUCT");
    assert.equal(classifyNexoraSemanticScope("What is on Stage now?"), "CURRENT_WORKSPACE");
    assert.equal(classifyNexoraSemanticScope("Can you add an object?"), "PRODUCT_ACTION");
    assert.equal(classifyNexoraSemanticScope("How do I use the Stage?"), "HELP_TEACH");
    assert.equal(
      classifyNexoraSemanticScope("Explain the Stage. What is on Stage now?"),
      "MIXED",
    );
  });

  it("keeps both relationship references", () => {
    const refs = extractManagerReferenceSet("explain risk and delivery relation", catalog());
    assert.equal(refs.references.length >= 2, true);
    assert.ok(refs.references.some((item) => /risk/i.test(item.name)));
    assert.ok(refs.references.some((item) => /delivery/i.test(item.name)));
    const rel = interpretRelationshipQuery({
      utterance: "explain risk and delivery relation",
      catalog: catalog(),
    });
    assert.equal(rel.intent, true);
    assert.equal(rel.truth, "DIRECT_RELATIONSHIP");
    const turn = run("explain risk and delivery relation");
    assert.match(turn.response, /Risk/i);
    assert.match(turn.response, /Delivery/i);
    assert.doesNotMatch(turn.response, /Margin Pressure/i);
    assert.doesNotMatch(turn.response, /causes/i);
  });

  it("does not ask for a business outcome on product and workspace turns", () => {
    for (const utterance of [
      "What is the Stage?",
      "What is on Stage now?",
      "Can you add an object?",
      "How do I use Nexora?",
      "What does Advisor do?",
    ]) {
      const turn = run(utterance);
      assert.doesNotMatch(turn.response, /which business outcome/i, utterance);
    }
  });

  it("evaluates conditionals from existing context", () => {
    const turn = run("if delivery be late, is it ok?");
    assert.doesNotMatch(turn.response, /which business outcome/i);
    assert.match(turn.response, /Delivery|objective|risk/i);
  });

  it("treats multi-entity classification as assertion, not navigation", () => {
    const turn = run("capacity gap and margin pressure are problems");
    assert.doesNotMatch(turn.response, /Focused on/i);
    assert.doesNotMatch(turn.response, /temporary capacity/i);
    assert.match(turn.response, /Understood|Problems|classification/i);
  });

  it("returns canonical Problems membership for unfiltered collection queries", () => {
    const members = resolveCanonicalCollectionMembership("problem", catalog());
    assert.equal(members.length, 2);
    const labels = members.map((item) => item.label).sort();
    assert.deepEqual(labels, ["Capacity Gap", "Margin Pressure"].sort());
    const shown = run("show problems");
    assert.match(shown.response, /Capacity Gap/i);
    assert.match(shown.response, /Margin Pressure/i);
    assert.doesNotMatch(shown.response, /Showing problems for/i);
    const all = run("show me all problems");
    assert.match(all.response, /Capacity Gap/i);
    assert.match(all.response, /Margin Pressure/i);
  });

  it("keeps ALL unfiltered when a conversational subject is active", () => {
    const focused = run("show Delivery");
    const all = run("show me all problems", focused);
    assert.match(all.response, /Capacity Gap/i);
    assert.match(all.response, /Margin Pressure/i);
    assert.doesNotMatch(all.response, /Showing problems for/i);
  });

  it("filters only when related-to is explicit", () => {
    const turn = run("show problems related to Margin Pressure");
    assert.match(turn.response, /Margin Pressure|related to/i);
  });

  it("explains collection change without investigation collision", () => {
    const previous = run("show problems");
    const semantic = composeNexoraSemanticTurn({
      utterance: "why did Capacity Gap disappear?",
      previousCollection: [
        { id: "ctx-problem-capacity", label: "Capacity Gap" },
        { id: "ctx-problem-margin", label: "Margin Pressure" },
      ],
      catalog: catalog(),
    });
    assert.equal(semantic.owner, "COLLECTION_CHANGE_EXPLANATION");
    assert.match(semantic.reply ?? "", /Capacity Gap/i);
    assert.doesNotMatch(semantic.reply ?? "", /temporary capacity|Has backlog/i);
    const live = run("why did Capacity Gap remove?", previous);
    assert.doesNotMatch(live.response, /which business outcome/i);
    assert.doesNotMatch(live.response, /My recommendation remains/i);
  });

  it("answers product capability honestly", () => {
    const ask = run("can you add object?");
    assert.match(ask.response, /can't add a new production object/i);
    assert.doesNotMatch(ask.response, /which business outcome/i);
    const act = run("Add a Risk object.");
    assert.match(act.response, /won't pretend|can't create/i);
  });

  it("explains Stage and reads workspace state", () => {
    const turn = run("explain the stage. what is on stage now?");
    assert.match(turn.response, /visual workspace/i);
    assert.match(
      turn.response,
      /Right now the Stage contains|does not currently show/i,
    );
    assert.doesNotMatch(turn.response, /which business outcome/i);
  });

  it("does not invent a missing relationship or claim causality", () => {
    const none = interpretRelationshipQuery({
      utterance: "How are Inventory and Demand related?",
      catalog: catalog(),
    });
    assert.equal(none.intent, true);
    assert.equal(none.truth, "NO_REGISTERED_RELATIONSHIP");
    const live = run("How are Inventory and Demand related?");
    assert.match(live.response, /do not have a registered direct relationship/i);
    assert.doesNotMatch(live.response, /causes/i);
  });

  it("uses the same canonical queue membership for Risks as objects labeled Risk", () => {
    const risks = resolveCanonicalCollectionMembership("risk", catalog());
    assert.ok(risks.some((item) => /risk/i.test(item.label)));
  });

  it("preserves business thread across a product question", () => {
    let turn = run("Why is Delivery late?");
    turn = run("What is the Stage?", turn);
    turn = run("Go back to Delivery.", turn);
    assert.match(turn.response, /Delivery/i);
  });
});
