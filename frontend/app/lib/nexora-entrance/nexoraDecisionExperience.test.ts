/**
 * NEX-EXP:7 — Manager Decision & Commitment Experience tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { createNexoraCanonicalDecisionRuntime } from "../conversational-control/executiveDecisionRuntimeAdapter.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { projectManagerObjectConversationalSubjects } from "../manager-object/managerObjectCatalog.ts";
import {
  applyManagerIdentityUtterance,
  emptyManagerIdentityContext,
} from "./nexoraEntranceIdentity.ts";
import {
  applyEntranceCenterSubject,
  createNexoraEntranceSession,
  projectNexoraEntranceCatalog,
  shouldNexoraEntranceOwnUtterance,
} from "./nexoraEntranceExperience.ts";
import { NEXORA_EXECUTIVE_GOAL_OBJECT_ID } from "./nexoraGoalDiscoveryTypes.ts";
import {
  decisionExperienceUsesExistingAuthorities,
  getNexoraDecisionExperienceIdentity,
  NEXORA_DECISION_EXPERIENCE_BOUNDARY,
  overlayDecisionOnEntranceCatalog,
  shouldNexoraDecisionExperienceOwnUtterance,
  verifyNexoraDecisionExperience,
} from "./nexoraDecisionExperience.ts";
import { shouldNexoraScenarioComparisonOwnUtterance } from "./nexoraScenarioComparisonExperience.ts";
import { EXECUTIVE_DECISION_INTELLIGENCE_BOUNDARY } from "../executive-intelligence/executiveDecisionIntelligence.ts";

const here = dirname(fileURLToPath(import.meta.url));

function initialState() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function readyEntrance() {
  const identity = applyManagerIdentityUtterance(
    emptyManagerIdentityContext(),
    "I'm Dana. I run operations for a logistics company.",
  );
  return createNexoraEntranceSession({
    workspaceResolution: "first-time",
    identity,
  });
}

function runTurn(
  utterance: string,
  previous?: ReturnType<typeof executeNexoraConversationalExperience> & {
    readonly __rt?: ReturnType<typeof createNexoraCanonicalDecisionRuntime>;
  },
) {
  const runtime = previous?.__rt ?? createNexoraCanonicalDecisionRuntime();
  const session = previous?.nextEntranceSession ?? readyEntrance();
  const catalog = projectNexoraEntranceCatalog(session);
  const result = executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext,
    executiveContext: previous?.nextExecutiveContext,
    executiveSubjects: projectManagerObjectConversationalSubjects(catalog),
    runtimeState:
      previous?.nextRuntimeState ??
      applyEntranceCenterSubject(initialState(), session),
    catalog,
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? null,
    previousEntranceSession: session,
    decisionRuntime: runtime.adapter,
    messageIdSeed: `nex-exp7-${utterance}`,
  });
  return { ...result, __rt: runtime };
}

function reachDecisionReady() {
  const reality = runTurn(
    "Our backlog is high and capacity is almost full.",
    runTurn(
      "On-time delivery is around 91%. We want 96%.",
      runTurn("We need to improve delivery reliability."),
    ),
  );
  const problem = runTurn("Capacity is our biggest problem.", reality);
  const explore = runTurn("Are we ready to explore scenarios?", problem);
  const weekend = runTurn("We could add weekend capacity.", explore);
  const baseline = runTurn("What if we do nothing?", weekend);
  const closed = runTurn("Compare these scenarios.", baseline);
  const compared = runTurn("Compare the scenarios.", closed);
  return runTurn("Which one do you recommend?", compared);
}

describe("NEX-EXP:7 Manager Decision & Commitment Experience", () => {
  it("identity, boundary, and reused authorities", () => {
    assert.equal(
      getNexoraDecisionExperienceIdentity().id,
      "NEX-EXP:7/ManagerDecisionCommitmentExperience",
    );
    assert.equal(verifyNexoraDecisionExperience().ok, true);
    assert.equal(NEXORA_DECISION_EXPERIENCE_BOUNDARY.startsNexExp8, false);
    assert.equal(NEXORA_DECISION_EXPERIENCE_BOUNDARY.nexoraCanCommitDecision, false);
    assert.equal(NEXORA_DECISION_EXPERIENCE_BOUNDARY.startsExecution, false);
    assert.equal(NEXORA_DECISION_EXPERIENCE_BOUNDARY.managerConfirmationRequired, true);
    assert.equal(decisionExperienceUsesExistingAuthorities(), true);
    assert.equal(EXECUTIVE_DECISION_INTELLIGENCE_BOUNDARY.ownsDecisionState, false);
  });

  it("starts only at READY_FOR_DECISION and consumes EXP:6 handoff", () => {
    const before = runTurn("We could add weekend capacity.", runTurn(
      "Are we ready to explore scenarios?",
      runTurn(
        "Capacity is our biggest problem.",
        runTurn(
          "Our backlog is high and capacity is almost full.",
          runTurn(
            "On-time delivery is around 91%. We want 96%.",
            runTurn("We need to improve delivery reliability."),
          ),
        ),
      ),
    ));
    assert.equal(
      shouldNexoraDecisionExperienceOwnUtterance(
        before.nextEntranceSession,
        "What exactly am I deciding?",
      ),
      false,
    );
    const ready = reachDecisionReady();
    assert.equal(
      ready.nextEntranceSession?.scenarioComparison?.state,
      "READY_FOR_DECISION",
    );
    assert.ok(ready.nextEntranceSession?.scenarioComparison?.handoff);
    assert.equal(
      shouldNexoraDecisionExperienceOwnUtterance(
        ready.nextEntranceSession,
        "What exactly am I deciding?",
      ),
      true,
    );
  });

  it("recommendation and preference do not commit; confirmation is required", () => {
    const ready = reachDecisionReady();
    assert.match(ready.response, /recommend|tied|withhold/i);
    const question = runTurn("What exactly am I deciding?", ready);
    assert.match(question.response, /Should we proceed with /);
    const prefer = runTurn("I prefer Scenario A.", question);
    assert.match(prefer.response, /has not been approved/i);
    assert.equal(
      prefer.nextEntranceSession?.decisionExperience?.canonicalRecord,
      null,
    );
    const decided = runTurn("Have I decided?", prefer);
    assert.match(decided.response, /No/);
    const go = runTurn("Let's go with Scenario A.", decided);
    assert.match(go.response, /Confirm\?/);
    assert.equal(
      go.nextEntranceSession?.decisionExperience?.state,
      "AWAITING_CONFIRMATION",
    );
    const still = runTurn("Have I decided now?", go);
    assert.match(still.response, /No/);
    const yes = runTurn("Yes, confirm.", still);
    assert.match(yes.response, /Decision committed/i);
    assert.match(yes.response, /Execution has not started/i);
    assert.equal(
      yes.nextEntranceSession?.decisionExperience?.canonicalRecord?.status,
      "Approved",
    );
    assert.equal(
      yes.nextEntranceSession?.decisionExperience?.view?.startsExecution,
      false,
    );
    assert.equal(
      yes.nextEntranceSession?.decisionExperience?.state,
      "READY_FOR_EXECUTION_PLANNING",
    );
    assert.ok(
      yes.nextEntranceSession?.decisionExperience?.canonicalRecord?.decisionId.startsWith(
        "cc10:decision:",
      ),
    );
  });

  it("ambiguous confirmation, rejection, deferral, and non-recommended choice", () => {
    const ready = reachDecisionReady();
    const ambiguous = runTurn("Yes.", ready);
    assert.match(ambiguous.response, /will not guess/i);
    const reject = runTurn("No, don't approve it.", ready);
    assert.match(reject.response, /Confirm\?|reject/i);
    const cancel = runTurn("Not yet.", ready);
    assert.match(cancel.response, /Deferred|uncommitted/i);
    const chooseB = runTurn("I choose Scenario B instead.", ready);
    assert.match(chooseB.response, /not been approved/i);
    assert.doesNotMatch(chooseB.response, /prioritizing cash/i);
  });

  it("stale confirmation after priority change; Stage overlay; existing workspace", () => {
    const ready = reachDecisionReady();
    const go = runTurn("Let's go with Scenario A.", ready);
    const shifted = runTurn(
      "What if cost becomes more important than speed?",
      go,
    );
    const confirm = runTurn("Yes, confirm.", shifted);
    assert.match(confirm.response, /paused|no longer valid|Confirm\?/i);
    const committed = runTurn(
      "Yes, confirm.",
      runTurn("Let's go with Scenario A.", ready),
    );
    const catalog = overlayDecisionOnEntranceCatalog(
      projectNexoraEntranceCatalog(committed.nextEntranceSession!),
      committed.nextEntranceSession?.decisionExperience ?? null,
    );
    const goal = catalog.objects.find(
      (entry) => entry.id === NEXORA_EXECUTIVE_GOAL_OBJECT_ID,
    );
    assert.deepEqual(goal?.position, [0, 0, 0]);
    const decision = catalog.objects.find((entry) =>
      entry.id.startsWith("cc10:decision:"),
    );
    assert.ok(decision);
    assert.equal(decision?.position[2], 0);
    assert.equal(committed.shouldCommitRuntime, false);
    const existing = createNexoraEntranceSession({
      workspaceResolution: "existing-workspace",
    });
    assert.equal(
      shouldNexoraEntranceOwnUtterance(existing, "Approve Scenario A."),
      false,
    );
    assert.equal(
      shouldNexoraDecisionExperienceOwnUtterance(
        existing,
        "Approve Scenario A.",
      ),
      false,
    );
    void shouldNexoraScenarioComparisonOwnUtterance;
    executeNexoraConversationalExperience({
      utterance: "Approve Scenario A.",
      executiveSubjects: projectManagerObjectConversationalSubjects(),
      runtimeState: initialState(),
      catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
      previousEntranceSession: existing,
      messageIdSeed: "nex-exp7-existing",
    });
  });

  it("generic engine has no hardcoded domain branches", () => {
    const source = [
      readFileSync(join(here, "nexoraDecisionExperienceResolution.ts"), "utf8"),
      readFileSync(join(here, "nexoraDecisionExperience.ts"), "utf8"),
    ].join("\n");
    assert.doesNotMatch(source, /if \(Capacity/);
    assert.doesNotMatch(source, /if \(Delivery/);
    assert.doesNotMatch(source, /if \(Cash/);
    assert.doesNotMatch(source, /Project Orion/);
    assert.doesNotMatch(source, /if \(Software/);
    assert.doesNotMatch(source, /if \(Weekend/);
  });
});
