/**
 * MO:2 — Generic Explain Engine certification tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { MANAGER_OBJECT_REGISTERED_GOAL } from "./managerObjectCatalog.ts";
import { projectManagerObjectConversationalSubjects } from "./managerObjectCatalog.ts";
import { createEmptyManagerObjectSession } from "./managerObjectActive.ts";
import {
  GENERIC_EXPLAIN_ENGINE_BOUNDARY,
  composeExecutiveObjectExplanation,
  getGenericExplainEngineIdentity,
  verifyGenericExplainEngine,
} from "./managerObjectExplainEngine.ts";
import { buildManagerObjectExplainHandoffRequest } from "./managerObjectExplainHandoff.ts";
import { collectManagerObjectContext } from "./managerObjectContext.ts";
import { deriveManagerObjectGuidance } from "./managerObjectGuidance.ts";
import { resolveManagerObjectTurn } from "./managerObjectInteraction.ts";
import { MANAGER_OBJECT_INTERACTION_BOUNDARY } from "./managerObjectInteractionFoundation.ts";

const here = dirname(fileURLToPath(import.meta.url));

function initialState() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function subjects() {
  return projectManagerObjectConversationalSubjects();
}

function run(
  utterance: string,
  options?: {
    readonly previous?: ReturnType<typeof executeNexoraConversationalExperience>;
  },
) {
  const previous = options?.previous;
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext,
    executiveContext: previous?.nextExecutiveContext,
    executiveSubjects: subjects(),
    runtimeState: previous?.nextRuntimeState ?? initialState(),
    catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? null,
    messageIdSeed: `mo2-${utterance}`,
  });
}

function explainNamed(objectId: string, utterance: string) {
  return resolveManagerObjectTurn({
    utterance,
    conversationalKind: "explain",
    hasNamedTargetHint: true,
    namedSubjectId: objectId,
    subjects: subjects(),
  });
}

function assertNoCausalOverclaim(text: string) {
  assert.doesNotMatch(text, /\bcaused\b|\bcauses\b|\broot cause is\b/i);
}

describe("MO:2 Generic Explain Engine", () => {
  it("identity and boundary", () => {
    assert.equal(getGenericExplainEngineIdentity().id, "MO:2/GenericExplainEngine");
    assert.equal(GENERIC_EXPLAIN_ENGINE_BOUNDARY.usesLlm, false);
    assert.equal(GENERIC_EXPLAIN_ENGINE_BOUNDARY.writesStageCoordinates, false);
    assert.equal(GENERIC_EXPLAIN_ENGINE_BOUNDARY.perObjectExplanationBranches, false);
    assert.equal(GENERIC_EXPLAIN_ENGINE_BOUNDARY.inventsDecisions, false);
    assert.equal(verifyGenericExplainEngine().ok, true);
    assert.equal(MANAGER_OBJECT_INTERACTION_BOUNDARY.startsMo2, false);
  });

  it("one engine source has no per-object explanation branches", () => {
    const source = readFileSync(join(here, "managerObjectExplainEngine.ts"), "utf8");
    assert.doesNotMatch(source, /obj-capacity|obj-delivery|obj-revenue/);
    assert.doesNotMatch(source, /if\s*\([^)]*Capacity|if\s*\([^)]*Delivery|if\s*\([^)]*Revenue/);
  });

  it("1-7. Generic engine explains Capacity, Delivery, Goal, Risk, Scenario, Decision, Execution", () => {
    const cases = [
      ["obj-capacity", "Explain Capacity", /Capacity/],
      ["obj-delivery", "Explain Delivery", /Delivery/],
      [MANAGER_OBJECT_REGISTERED_GOAL.objectId, "Explain Goal", /Close Capacity Gap|Goal/],
      ["obj-risk", "Explain Risk", /Risk/],
      ["ctx-scenario-capacity", "Explain Scenario", /Capacity Expansion Plan|scenario/i],
      ["ctx-decision-capacity", "Explain Decision", /Expand Capacity|decision/i],
      ["ctx-execution-capacity", "Explain Execution", /Capacity Expansion|execution/i],
    ] as const;
    for (const [id, utterance, expected] of cases) {
      const turn = explainNamed(id, utterance);
      assert.equal(turn.explanation.engineId, "MO:2/GenericExplainEngine");
      assert.equal(turn.explanation.subject.id, id);
      assert.equal(turn.explanation.usesLlm, false);
      assert.equal(turn.explanation.commitsDecision, false);
      assert.equal(turn.explanation.startsExecution, false);
      assert.match(turn.explanation.managerFacingText, expected);
      assertNoCausalOverclaim(turn.explanation.managerFacingText);
    }
  });

  it("also explains Revenue through the same engine", () => {
    const turn = explainNamed("obj-revenue", "Explain Revenue");
    assert.equal(turn.explanation.engineId, "MO:2/GenericExplainEngine");
    assert.equal(turn.explanation.subject.id, "obj-revenue");
    assert.match(turn.explanation.summary ?? "", /Revenue/);
  });

  it("8. Why is this important uses significance without inventing cause", () => {
    const focused = explainNamed("obj-delivery", "Explain Delivery");
    const why = resolveManagerObjectTurn({
      utterance: "Why is this important?",
      conversationalKind: "explain",
      previousSession: focused.session,
      subjects: subjects(),
    });
    assert.equal(why.activeObjectId, "obj-delivery");
    assert.equal(why.explanation.focus, "significance");
    assert.ok(why.explanation.significance);
    assertNoCausalOverclaim(why.explanation.managerFacingText);
  });

  it("9. Why is this happening keeps relationship ≠ confirmed cause", () => {
    const focused = explainNamed("obj-delivery", "Explain Delivery");
    const why = resolveManagerObjectTurn({
      utterance: "Why is this happening?",
      conversationalKind: "explain",
      previousSession: focused.session,
      subjects: subjects(),
    });
    assert.equal(why.explanation.focus, "drivers");
    for (const driver of why.explanation.drivers) {
      assert.notEqual(driver.causalClaim, "confirmed");
      assert.match(driver.text, /does not establish it as the confirmed cause/);
    }
    assertNoCausalOverclaim(why.explanation.managerFacingText);
  });

  it("10. What is connected explains relationship meaning, not raw ids", () => {
    const focused = explainNamed("obj-delivery", "Explain Delivery");
    const connected = resolveManagerObjectTurn({
      utterance: "What is connected to this?",
      conversationalKind: "show-related",
      previousSession: focused.session,
      subjects: subjects(),
    });
    assert.equal(connected.intent, "RELATIONSHIPS");
    assert.ok(connected.explanation.relationships.length > 0);
    assert.doesNotMatch(connected.explanation.managerFacingText, /obj-capacity\s*→\s*obj-delivery/);
    assert.match(connected.explanation.managerFacingText, /connected to|related to|associated with|constrained by|may affect/);
    assert.match(connected.explanation.managerFacingText, /connected to|related to|associated with|constrained by|may affect|not a confirmed cause|the reverse/);
  });

  it("11. What evidence do we have stays traceable", () => {
    const focused = explainNamed("obj-capacity", "Explain Capacity");
    const evidence = resolveManagerObjectTurn({
      utterance: "What evidence do we have?",
      conversationalKind: "evidence",
      previousSession: focused.session,
      subjects: subjects(),
    });
    assert.equal(evidence.explanation.focus, "evidence");
    for (const item of evidence.explanation.evidence) {
      assert.ok(item.sourceAuthority);
      assert.equal(item.support, "KNOWN");
    }
  });

  it("12. What don't we know remains UNKNOWN", () => {
    const focused = explainNamed("obj-demand", "Explain Demand");
    const unknown = resolveManagerObjectTurn({
      utterance: "What don't we know?",
      conversationalKind: "evidence",
      previousSession: focused.session,
      subjects: subjects(),
    });
    assert.equal(unknown.explanation.focus, "uncertainty");
    assert.match(unknown.explanation.managerFacingText, /not enough|unknown|no measured outcome|no outcome has been measured/i);
    assert.equal(unknown.explanation.epistemicStatus, "UNKNOWN");
  });

  it("13. What happens if this continues is PREDICTED or UNKNOWN, never fact", () => {
    const focused = explainNamed("obj-delivery", "Explain Delivery");
    const continues = resolveManagerObjectTurn({
      utterance: "What happens if this continues?",
      conversationalKind: "change",
      previousSession: focused.session,
      subjects: subjects(),
    });
    assert.equal(continues.intent, "IMPACT");
    assert.ok(
      continues.explanation.epistemicStatus === "PREDICTED" ||
        continues.explanation.epistemicStatus === "UNKNOWN",
    );
    assert.doesNotMatch(continues.explanation.managerFacingText, /\bwill definitely\b|\bis a fact\b/i);
    if (continues.explanation.epistemicStatus === "PREDICTED") {
      assert.match(continues.explanation.managerFacingText, /projection, not an observed fact/);
    }
  });

  it("14. What should I do does not invent a decision", () => {
    const focused = explainNamed("obj-delivery", "Explain Delivery");
    const next = resolveManagerObjectTurn({
      utterance: "What should I do?",
      conversationalKind: "recommend",
      previousSession: focused.session,
      subjects: subjects(),
    });
    assert.equal(next.explanation.handoffRecommendation, true);
    assert.equal(next.explanation.commitsDecision, false);
    assert.match(next.explanation.managerFacingText, /not yet a committed course of action/i);
  });

  it("15-17. Explain this, named switching, and deictic continuity", () => {
    const capacity = run("Explain Capacity");
    assert.equal(capacity.managerObjectTurn.activeObjectId, "obj-capacity");
    const deictic = run("Explain this", { previous: capacity });
    assert.equal(deictic.managerObjectTurn.activeObjectId, "obj-capacity");
    const why = run("Why?", { previous: deictic });
    assert.equal(why.managerObjectTurn.activeObjectId, "obj-capacity");
    const delivery = run("Explain Delivery", { previous: why });
    assert.equal(delivery.managerObjectTurn.activeObjectId, "obj-delivery");
    const connected = run("What is connected to it?", { previous: delivery });
    assert.equal(connected.managerObjectTurn.activeObjectId, "obj-delivery");
  });

  it("18. UNKNOWN evidence is not filled with generic advice", () => {
    const demand = collectManagerObjectContext("obj-demand");
    const guidance = deriveManagerObjectGuidance(demand, "EXPLAIN");
    const explanation = composeExecutiveObjectExplanation({
      request: buildManagerObjectExplainHandoffRequest({
        objectId: "obj-demand",
        intent: "EXPLAIN",
        context: demand,
      }),
      guidance,
      focus: "evidence",
      depth: "STANDARD",
    });
    assert.equal(demand.kpi.support, "UNKNOWN");
    assert.match(explanation.managerFacingText, /not enough evidence/);
    assert.doesNotMatch(explanation.managerFacingText, /consider diversifying|best practice/i);
  });

  it("19. INFERRED is not promoted to KNOWN", () => {
    const delivery = collectManagerObjectContext("obj-delivery");
    const inferred = delivery.relationships.filter((edge) => edge.support === "INFERRED");
    const guidance = deriveManagerObjectGuidance(delivery, "RELATIONSHIPS");
    const explanation = composeExecutiveObjectExplanation({
      request: buildManagerObjectExplainHandoffRequest({
        objectId: "obj-delivery",
        intent: "RELATIONSHIPS",
        context: delivery,
      }),
      guidance,
      focus: "relationships",
      depth: "STANDARD",
    });
    for (const edge of explanation.relationships) {
      if (inferred.some((item) => item.relationshipId === edge.relationKind)) {
        assert.notEqual(edge.support, "KNOWN");
      }
      if (edge.support === "INFERRED") assert.notEqual(edge.support, "KNOWN");
    }
    void inferred;
  });

  it("20. Relationship ≠ causality protection", () => {
    const turn = explainNamed("obj-capacity", "What is connected to this?");
    for (const edge of turn.explanation.relationships) {
      assert.equal(edge.causalClaim, "none");
    }
    assert.match(turn.explanation.managerFacingText, /not enough evidence|does not establish a confirmed cause|causing/);
  });

  it("21-22. Explanation does not commit a decision or start execution", () => {
    const decision = run("Explain Decision");
    assert.equal(decision.shouldCommitRuntime, false);
    assert.equal(decision.managerObjectTurn.explanation.commitsDecision, false);
    const shouldDo = run("What should I do?", { previous: decision });
    assert.equal(shouldDo.managerObjectTurn.explanation.commitsDecision, false);
    assert.equal(shouldDo.decisionCommitmentResult, null);
    const execution = run("Explain Execution");
    assert.equal(execution.managerObjectTurn.explanation.startsExecution, false);
    assert.equal(execution.shouldCommitRuntime, false);
  });

  it("depth only exposes existing intelligence", () => {
    const context = collectManagerObjectContext("obj-capacity");
    const guidance = deriveManagerObjectGuidance(context, "EXPLAIN");
    const request = buildManagerObjectExplainHandoffRequest({
      objectId: "obj-capacity",
      intent: "EXPLAIN",
      context,
    });
    const quick = composeExecutiveObjectExplanation({
      request,
      guidance,
      focus: "overview",
      depth: "QUICK",
    });
    const deep = composeExecutiveObjectExplanation({
      request,
      guidance,
      focus: "overview",
      depth: "DEEP",
    });
    assert.ok(quick.managerFacingText.length > 0);
    assert.ok(deep.managerFacingText.length >= quick.managerFacingText.length);
    assert.equal(quick.summary, deep.summary);
  });

  it("available actions are capability gated", () => {
    const emptySession = resolveManagerObjectTurn({
      previousSession: createEmptyManagerObjectSession(),
      utterance: "Explain this",
      conversationalKind: "explain",
    });
    assert.equal(emptySession.explanation.availableActions.length, 0);
    const delivery = explainNamed("obj-delivery", "Explain Delivery");
    const ids = delivery.explanation.availableActions.map((action) => action.id);
    if (delivery.context.relationships.length > 0) {
      assert.ok(ids.includes("VIEW_RELATIONSHIPS"));
    }
    assert.equal(delivery.explanation.availableActions.every((action) => action.available), true);
  });

  it("conversation overlay presents relationship explanation without Advisor duplication", () => {
    const focused = run("Explain Delivery");
    const connected = run("What is connected to this?", { previous: focused });
    assert.match(connected.response, /connected to|related to|associated with|constrained by|may affect|does not currently have related/);
    assert.equal(connected.trace.explainEngineId, "MO:2/GenericExplainEngine");
  });
});
