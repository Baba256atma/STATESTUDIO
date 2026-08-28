/**
 * NEX-MVP-FINAL:1 — real-manager language, natural journey, and leak audit.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { createNexoraCanonicalDecisionRuntime } from "../conversational-control/executiveDecisionRuntimeAdapter.ts";
import { createNexoraCanonicalExecutionRuntime } from "../conversational-control/executiveExecutionRuntimeAdapter.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  selectNexoraMVPInteractionSubject,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { projectManagerObjectConversationalSubjects } from "../manager-object/managerObjectCatalog.ts";
import {
  applyEntranceCenterSubject,
  createNexoraEntranceSession,
  projectNexoraEntranceCatalog,
} from "./nexoraEntranceExperience.ts";
import { NEXORA_EXECUTIVE_GOAL_OBJECT_ID } from "./nexoraGoalDiscoveryTypes.ts";
import {
  getNexoraMvpFinalCertificationIdentity,
  NEXORA_MANAGER_ARCHITECTURE_LEAK,
  NEXORA_MVP_FINAL_BOUNDARY,
  verifyNexoraMvpFinalCertification,
} from "./nexoraMvpFinalCertification.ts";

const here = dirname(fileURLToPath(import.meta.url));

function initialState() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

type Runtimes = {
  readonly __decision: ReturnType<typeof createNexoraCanonicalDecisionRuntime>;
  readonly __execution: ReturnType<typeof createNexoraCanonicalExecutionRuntime>;
};

function runTurn(
  utterance: string,
  previous?: ReturnType<typeof executeNexoraConversationalExperience> & Runtimes,
) {
  const decision = previous?.__decision ?? createNexoraCanonicalDecisionRuntime();
  const execution =
    previous?.__execution ??
    createNexoraCanonicalExecutionRuntime({ decisionRuntime: decision.adapter });
  const session =
    previous?.nextEntranceSession ??
    createNexoraEntranceSession({ workspaceResolution: "first-time" });
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
    decisionRuntime: decision.adapter,
    executionRuntime: execution,
    messageIdSeed: `nex-mvp-final-${utterance}`,
  });
  return { ...result, __decision: decision, __execution: execution };
}

function assertManagerLanguage(text: string) {
  assert.doesNotMatch(text, NEXORA_MANAGER_ARCHITECTURE_LEAK);
}

const ALEX_LOOP = [
  "Hi",
  "What can you do for me?",
  "My name is Alex.",
  "I manage a manufacturing company.",
  "We have problems with delivery and capacity.",
  "I want to improve delivery performance.",
  "We're currently at 91%; target is 96%.",
  "Backlog is high.",
  "What may be preventing the Goal?",
  "Capacity is our biggest problem.",
  "Are we ready to explore scenarios?",
  "What are my options?",
  "We could add temporary capacity.",
  "Give me another scenario.",
  "We could use external capacity.",
  "What if we do nothing?",
  "Compare them.",
  "Which option is safer?",
  "Which option best supports my goal?",
  "What do you recommend?",
  "Why?",
  "Let's do that.",
  "Approve it.",
  "Confirm.",
  "What happens next?",
  "Let's start it.",
  "Confirm.",
  "What changed?",
  "On-time delivery is now 94%.",
  "Did it work?",
  "What did we learn?",
  "What should we do differently next time?",
] as const;

describe("NEX-MVP-FINAL:1 Real Manager MVP", () => {
  it("identity is certification, not a new engine", () => {
    assert.equal(
      getNexoraMvpFinalCertificationIdentity().id,
      "NEX-MVP-FINAL:1/RealManagerMvpCertification",
    );
    assert.equal(NEXORA_MVP_FINAL_BOUNDARY.createsNewEngine, false);
    assert.equal(verifyNexoraMvpFinalCertification().ok, true);
  });

  it("keeps first-time entrance session when 6.1 owns an executive ask", () => {
    const help = runTurn("What can you do for me?");
    assert.ok(help.nextEntranceSession);
    assert.equal(help.nextEntranceSession?.workspaceResolution, "first-time");
    const named = runTurn("My name is Alex.", help);
    assert.match(named.response, /Alex/i);
    assert.doesNotMatch(help.response, /^Understood\.?$/);
  });

  it("first contact uses product language and learns manager context", () => {
    const hi = runTurn("Hi");
    assertManagerLanguage(hi.response);
    const capability = runTurn("What can you do for me?", hi);
    assert.match(capability.response, /situation|decisions you control/i);
    assertManagerLanguage(capability.response);
    const named = runTurn("My name is Alex.", capability);
    const company = runTurn("I manage a manufacturing company.", named);
    const goal = runTurn("I want to improve delivery performance.", company);
    assert.match(
      company.nextEntranceSession?.identity.managerName ??
        named.nextEntranceSession?.identity.managerName ??
        "",
      /Alex/i,
    );
    assert.match(goal.response, /delivery|Goal|achieve/i);
    assertManagerLanguage(goal.response);
  });

  it("completes a natural manager loop without architecture leakage", () => {
    let previous: ReturnType<typeof runTurn> | undefined;
    const replies: string[] = [];
    for (const utterance of ALEX_LOOP) {
      previous = runTurn(utterance, previous);
      replies.push(previous.response);
      assertManagerLanguage(previous.response);
    }
    const session = previous!.nextEntranceSession!;
    assert.ok(session.goalDiscovery?.object?.id === NEXORA_EXECUTIVE_GOAL_OBJECT_ID);
    assert.equal(
      session.decisionExperience?.canonicalRecord?.status,
      "Approved",
    );
    assert.equal(
      session.executionPlanning?.canonicalStatus,
      "in-progress",
    );
    assert.match(replies.join("\n"), /safer|risk|Goal fit|recommend|Confirm|in-progress/i);
    assert.match(
      previous!.response,
      /THIS_CASE_ONLY|Learning|reassess|REALITY|next/i,
    );
  });

  it("click and Show me share Goal focus; Explain uses one engine", () => {
    let previous: ReturnType<typeof runTurn> | undefined;
    let catalog = projectNexoraEntranceCatalog(
      createNexoraEntranceSession({ workspaceResolution: "first-time" }),
    );
    for (const utterance of ALEX_LOOP) {
      previous = runTurn(utterance, previous);
      catalog = projectNexoraEntranceCatalog(previous.nextEntranceSession!);
      if (catalog.objects.some((object) => object.id.startsWith("goal-"))) break;
    }
    const goalId =
      catalog.objects.find((object) => object.id.startsWith("goal-"))?.id ??
      NEXORA_EXECUTIVE_GOAL_OBJECT_ID;
    const clicked = selectNexoraMVPInteractionSubject(
      previous!.nextRuntimeState,
      goalId,
      catalog,
    );
    const shown = runTurn("Show me the Goal.", previous);
    assert.equal(clicked.focusedSubject?.id, goalId);
    // NCA-POST canonical collection semantics preserve even a one-member Goal set.
    assert.ok(shown.ncaConversationState?.lastCollection?.memberIds?.includes(goalId));
    const explainSource = readFileSync(
      join(here, "../manager-object/managerObjectExplainEngine.ts"),
      "utf8",
    );
    assert.doesNotMatch(explainSource, /if \(label === ["']Capacity["']\)/);
    assert.doesNotMatch(explainSource, /if \(label === ["']Delivery["']\)/);
  });
});
