import assert from "node:assert/strict";
import test from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { freezeConversationalSubjectRecord } from "../conversational-control/conversationalSubjectRegistry.ts";
import {
  createEmptyNexoraExecutiveContextSnapshot,
  freezeExecutiveContextReference,
} from "../conversational-control/executiveContextSnapshot.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { interpretCanonicalManagerMeaning } from "./canonicalManagerMeaningInterpreter.ts";
import { resolveContextualManagerMeaning } from "./conversationContinuityResolver.ts";
import { createEmptyConversationContinuity } from "./conversationContinuitySnapshot.ts";
import { projectManagerObjectConversationalSubjects } from "./managerObjectCatalog.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);

type Turn = ReturnType<typeof executeNexoraConversationalExperience>;

function run(utterance: string, previous?: Turn): Turn {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext,
    executiveContext: previous?.nextExecutiveContext,
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
    messageIdSeed: `named-return-${utterance}`,
  });
}

test("current deictic follows the active subject", () => {
  const focused = run("Show Capacity.");
  const explain = run("Explain this.", focused);
  assert.equal(explain.nextExecutiveContext.currentSubject?.subjectId, "obj-capacity");
  assert.equal(explain.nextRuntimeState.focusedSubject?.id, "obj-capacity");
});

test("explicit named return restores a prior Capacity subject", () => {
  const capacity = run("Show Capacity.");
  const delivery = run("What about delivery?", capacity);
  const customer = run("What about the customer impact?", delivery);
  assert.equal(customer.nextRuntimeState.focusedSubject?.id, "obj-customer");
  const returned = run("Go back to the capacity problem.", customer);
  const restoredId = returned.nextExecutiveContext.currentSubject?.subjectId ?? null;
  assert.ok(restoredId === "obj-capacity" || restoredId === "ctx-problem-capacity", String(restoredId));
  assert.equal(returned.nextRuntimeState.focusedSubject?.id, restoredId);
  const deictic = run("How does this affect operations?", returned);
  assert.equal(deictic.nextExecutiveContext.currentSubject?.subjectId, restoredId);
  assert.equal(deictic.nextRuntimeState.focusedSubject?.id, restoredId);
});

test("long-session named return with temporal filler restores Capacity", () => {
  const capacity = run("Show Capacity.");
  const delivery = run("What about delivery?", capacity);
  const customer = run("What about the customer impact?", delivery);
  const inventory = run("What about inventory?", customer);
  const returned = run("Return to the capacity pressure we started with.", inventory);
  const restoredId = returned.nextExecutiveContext.currentSubject?.subjectId ?? null;
  assert.ok(restoredId === "obj-capacity" || restoredId === "ctx-problem-capacity", String(restoredId));
  assert.notEqual(returned.status, "clarification-required");
  assert.doesNotMatch(returned.response, /Which one do you want me to show/i);
});

test("prior typed Object return restores delivery", () => {
  const delivery = run("Show Delivery.");
  const customer = run("What about the customer impact?", delivery);
  const returned = run("Return to the delivery risk.", customer);
  assert.equal(returned.nextExecutiveContext.currentSubject?.subjectId, "obj-delivery");
  assert.equal(returned.nextRuntimeState.focusedSubject?.id, "obj-delivery");
});

test("named return to a visited capacity issue restores Capacity, not Delivery", () => {
  const capacity = run("Show Capacity.");
  const customer = run("What about customer?", capacity);
  const material = run("This issue — how material is it?", customer);
  const delivery = run("What about delivery?", material);
  const returned = run("Go back to the capacity issue.", delivery);
  assert.equal(returned.nextExecutiveContext.currentSubject?.subjectId, "obj-capacity");
  assert.equal(returned.nxaAdvisorContract?.referentId, "obj-capacity");
  assert.notEqual(returned.status, "clarification-required");
  assert.doesNotMatch(returned.response, /Which one do you want me to show/i);
  const deictic = run("That one.", returned);
  assert.equal(deictic.nextExecutiveContext.currentSubject?.subjectId, "obj-capacity");
  assert.equal(deictic.nxaAdvisorContract?.referentId, "obj-capacity");
});

test("unknown historical target does not invent a supplier object", () => {
  const customer = run("Show Customer.");
  const unknown = run("Go back to the supplier problem.", customer);
  assert.notEqual(unknown.contextualManagerMeaning.objectReference?.subjectId, "obj-supplier");
  assert.notEqual(
    unknown.contextualManagerMeaning.objectReference?.subjectId,
    "ctx-problem-margin",
  );
  assert.notEqual(unknown.nextRuntimeState.focusedSubject?.id, "ctx-problem-margin");
  assert.equal(
    unknown.contextualManagerMeaning.objectReference?.subjectId === "obj-customer" ||
      unknown.contextualManagerMeaning.provenance === "UNRESOLVED" ||
      unknown.clarificationTurn.action === "clarify" ||
      unknown.status === "clarification-required",
    true,
  );
  assert.doesNotMatch(unknown.response, /Supplier Delay has been added/i);
});

test("named what-about without a catalog subject does not keep pretending the current subject matched", () => {
  const delivery = run("Show Delivery.");
  const resources = run("What about resources?", delivery);
  assert.equal(resources.nextRuntimeState.focusedSubject?.id, "obj-delivery");
  assert.equal(resources.contextualManagerMeaning.provenance, "UNRESOLVED");
  assert.equal(
    resources.clarificationTurn.action === "clarify" ||
      resources.status === "clarification-required",
    true,
  );
  const schedule = run("What about the schedule?", delivery);
  assert.equal(schedule.nextRuntimeState.focusedSubject?.id, "obj-delivery");
  assert.equal(schedule.contextualManagerMeaning.provenance, "UNRESOLVED");
  assert.equal(
    schedule.clarificationTurn.action === "clarify" ||
      schedule.status === "clarification-required",
    true,
  );
});

test("deictic what-about this keeps the current subject", () => {
  const delivery = run("Show Delivery.");
  const deictic = run("What about this?", delivery);
  assert.equal(deictic.nextExecutiveContext.currentSubject?.subjectId, "obj-delivery");
  assert.equal(deictic.nextRuntimeState.focusedSubject?.id, "obj-delivery");
});

test("ambiguous historical capacity problems stay unresolved", () => {
  const extra = freezeConversationalSubjectRecord({
    subjectId: "ctx-problem-capacity-alt",
    subjectKind: "problem",
    canonicalName: "Capacity Shortage",
    aliases: Object.freeze(["capacity shortage"]),
    businessKey: "ctx-problem-capacity-alt",
  });
  const meaning = interpretCanonicalManagerMeaning({
    utterance: "Go back to the capacity problem.",
    subjects: [...subjects, extra],
  });
  const resolved = resolveContextualManagerMeaning({
    turnMeaning: meaning,
    subjects: [...subjects, extra],
    previousContinuity: createEmptyConversationContinuity(),
    executiveContext: createEmptyNexoraExecutiveContextSnapshot({
      currentSubject: freezeExecutiveContextReference({
        subjectId: "obj-customer",
        subjectKind: "object",
        canonicalName: "Customer",
        source: "explicit",
        turnIndex: 3,
      }),
      previousSubjects: Object.freeze([
        freezeExecutiveContextReference({
          subjectId: "ctx-problem-capacity",
          subjectKind: "problem",
          canonicalName: "Capacity Gap",
          source: "conversation",
          turnIndex: 1,
        }),
        freezeExecutiveContextReference({
          subjectId: "ctx-problem-capacity-alt",
          subjectKind: "problem",
          canonicalName: "Capacity Shortage",
          source: "conversation",
          turnIndex: 2,
        }),
      ]),
      turnIndex: 3,
    }),
  });
  assert.equal(resolved.objectReference, null);
  assert.equal(resolved.ambiguity.unresolved, true);
  assert.equal(resolved.ambiguity.reason, "multiple-objects");
});

test("capacity problem does not resolve a capacity KPI when a problem exists", () => {
  const kpi = freezeConversationalSubjectRecord({
    subjectId: "obj-capacity-kpi",
    subjectKind: "object",
    canonicalName: "Capacity KPI",
    aliases: Object.freeze(["capacity kpi"]),
    businessKey: "obj-capacity-kpi",
  });
  const meaning = interpretCanonicalManagerMeaning({
    utterance: "Go back to the capacity problem.",
    subjects: [...subjects, kpi],
  });
  const resolved = resolveContextualManagerMeaning({
    turnMeaning: meaning,
    subjects: [...subjects, kpi],
    previousContinuity: createEmptyConversationContinuity(),
    executiveContext: createEmptyNexoraExecutiveContextSnapshot({
      currentSubject: freezeExecutiveContextReference({
        subjectId: "obj-customer",
        subjectKind: "object",
        canonicalName: "Customer",
        source: "explicit",
        turnIndex: 3,
      }),
      previousSubjects: Object.freeze([
        freezeExecutiveContextReference({
          subjectId: "obj-capacity-kpi",
          subjectKind: "object",
          canonicalName: "Capacity KPI",
          source: "conversation",
          turnIndex: 1,
        }),
        freezeExecutiveContextReference({
          subjectId: "ctx-problem-capacity",
          subjectKind: "problem",
          canonicalName: "Capacity Gap",
          source: "conversation",
          turnIndex: 2,
        }),
      ]),
      turnIndex: 3,
    }),
  });
  assert.equal(resolved.objectReference?.subjectId, "ctx-problem-capacity");
});
