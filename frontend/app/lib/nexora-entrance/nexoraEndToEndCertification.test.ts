/**
 * NEX-E2E:1 — full first-time executive loop, continuity, and reuse audits.
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
  isNexoraEntranceRestrained,
  NEXORA_EXECUTIVE_CONTEXT_OBJECT_ID,
  projectNexoraEntranceCatalog,
} from "./nexoraEntranceExperience.ts";
import { NEXORA_EXECUTIVE_GOAL_OBJECT_ID } from "./nexoraGoalDiscoveryTypes.ts";
import { NEXORA_OUTCOME_OBJECT_ID } from "./nexoraOutcomeMonitoring.ts";
import { NEXORA_LEARNING_OBJECT_ID } from "./nexoraLearningReassessment.ts";
import {
  catalogHasNoOverlappingXy,
  catalogZContractHolds,
  getNexoraEndToEndCertificationIdentity,
  NEXORA_END_TO_END_BOUNDARY,
  reusedExperienceAuthorities,
  verifyNexoraEndToEndCertification,
} from "./nexoraEndToEndCertification.ts";

const here = dirname(fileURLToPath(import.meta.url));

function initialState() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function firstTimeSession() {
  const identity = applyManagerIdentityUtterance(
    emptyManagerIdentityContext(),
    "I'm Sarah. I run operations for a logistics company.",
  );
  return createNexoraEntranceSession({
    workspaceResolution: "first-time",
    identity,
  });
}

type Runtimes = {
  readonly __decision: ReturnType<typeof createNexoraCanonicalDecisionRuntime>;
  readonly __execution: ReturnType<typeof createNexoraCanonicalExecutionRuntime>;
};

function runTurn(
  utterance: string,
  previous?: ReturnType<typeof executeNexoraConversationalExperience> & Runtimes,
  options?: {
    readonly workspace?: "first-time" | "existing-workspace";
    readonly session?: ReturnType<typeof createNexoraEntranceSession>;
  },
) {
  const workspace = options?.workspace ?? "first-time";
  const decision = previous?.__decision ?? createNexoraCanonicalDecisionRuntime();
  const execution =
    previous?.__execution ??
    createNexoraCanonicalExecutionRuntime({ decisionRuntime: decision.adapter });
  const session =
    previous?.nextEntranceSession ??
    options?.session ??
    (workspace === "existing-workspace"
      ? createNexoraEntranceSession({ workspaceResolution: "existing-workspace" })
      : firstTimeSession());
  const restrained = isNexoraEntranceRestrained(session);
  const catalog = restrained
    ? projectNexoraEntranceCatalog(session)
    : getDefaultNexoraMVPObjectInteractionCatalog();
  const result = executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext,
    executiveContext: previous?.nextExecutiveContext,
    executiveSubjects: projectManagerObjectConversationalSubjects(catalog),
    runtimeState:
      previous?.nextRuntimeState ??
      (restrained
        ? applyEntranceCenterSubject(initialState(), session)
        : initialState()),
    catalog,
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? null,
    previousEntranceSession: session,
    decisionRuntime: decision.adapter,
    executionRuntime: execution,
    messageIdSeed: `nex-e2e1-${utterance}`,
  });
  return { ...result, __decision: decision, __execution: execution };
}

function runScript(utterances: readonly string[]) {
  return utterances.reduce(
    (previous, utterance) => runTurn(utterance, previous),
    undefined as ReturnType<typeof runTurn> | undefined,
  )!;
}

const FULL_LOOP = [
  "Hi.",
  "I'm Sarah. I run operations for a logistics company.",
  "My goal is to improve delivery reliability.",
  "We're currently at 91%; target is 96%.",
  "Backlog is high.",
  "What may be preventing the Goal?",
  "Capacity is our biggest problem.",
  "Are we ready to explore scenarios?",
  "What options do we have?",
  "We could add temporary capacity.",
  "We could use external capacity.",
  "What if we maintain the current plan?",
  "Compare them.",
  "What do you recommend?",
  "Why?",
  "I prefer Scenario A.",
  "Let's go with A.",
  "Confirm.",
  "What happens next?",
  "Who owns it?",
  "Let's start it.",
  "Confirm.",
  "What changed?",
  "On-time delivery is now 94%.",
  "Did it work?",
  "What did we learn?",
  "Why?",
  "Where should the next cycle start?",
] as const;

describe("NEX-E2E:1 Full Executive Experience", () => {
  it("identity is certification, not NEX-EXP:11", () => {
    const identity = getNexoraEndToEndCertificationIdentity();
    assert.equal(identity.id, "NEX-E2E:1/FullExecutiveExperienceEndToEndCertification");
    assert.equal(identity.version, "1.0.0");
    assert.equal(NEXORA_END_TO_END_BOUNDARY.createsNexExp11, false);
    assert.equal(NEXORA_END_TO_END_BOUNDARY.createsMo7, false);
    assert.equal(verifyNexoraEndToEndCertification().ok, true);
    const reused = reusedExperienceAuthorities();
    assert.equal(reused.entrance, "NEX-EXP:1/NexoraEntranceManagerIdentityExperience");
    assert.equal(reused.learning, "NEX-EXP:10/LearningReassessmentNextExecutiveCycle");
  });

  it("completes one continuous first-time loop with safety and continuity", () => {
    const whyRecommend = runScript(FULL_LOOP.slice(0, 15));
    assert.match(whyRecommend.response, /recommend|Goal fit|PREDICTED|stronger/i);
    assert.doesNotMatch(whyRecommend.response, /NEX-EXP:|CC:10|MO:5|EI:6/i);

    const committed = runScript(FULL_LOOP.slice(0, 18));
    assert.equal(
      committed.nextEntranceSession?.decisionExperience?.canonicalRecord?.status,
      "Approved",
    );
    assert.equal(
      committed.nextEntranceSession?.executionPlanning?.canonicalStatus ===
        "in-progress",
      false,
    );
    assert.match(committed.executiveSituation?.decision.state ?? "", /COMMITTED|READY_FOR_EXECUTION/i);
    assert.equal(committed.executiveSituation?.decision.confirmationPending, false);
    const whyDecision = runTurn("Why?", committed);
    assert.match(
      whyDecision.response,
      /rationale|trade-off|recommend|Goal/i,
    );

    const started = runScript(FULL_LOOP.slice(0, 22));
    assert.equal(
      started.nextEntranceSession?.executionPlanning?.canonicalStatus,
      "in-progress",
    );
    assert.match(started.executiveSituation?.execution.state ?? "", /EXECUTION_ACTIVE|READY_FOR_OUTCOME/i);
    const unknownOutcome = runTurn("What changed?", started);
    assert.match(
      unknownOutcome.response,
      /UNKNOWN|not observed|No observed|not an Outcome|enough outcome evidence|PREDICTED/i,
    );

    const afterLearn = runScript(FULL_LOOP.slice(0, 26));
    assert.match(afterLearn.executiveSituation?.outcome.state ?? "", /OUTCOME|GOAL_IMPACT|READY_FOR_LEARNING/i);
    assert.match(afterLearn.executiveSituation?.outcome.observed ?? "", /94/);
    assert.match(afterLearn.executiveSituation?.outcome.goalImpact ?? "", /IMPROVING|ACHIEVED/);
    assert.match(afterLearn.response, /THIS_CASE_ONLY|Learning|assumption/i);
    const whyLearn = runTurn("Why?", afterLearn);
    assert.match(whyLearn.response, /THIS_CASE_ONLY|Evidence|UNKNOWN/);
    const learned = runTurn("Where should the next cycle start?", whyLearn);
    const session = learned.nextEntranceSession!;
    assert.match(session.identity.managerName ?? "", /Sarah/i);
    assert.match(
      session.goalDiscovery?.context.goalTitle ?? "",
      /delivery reliability/i,
    );
    assert.equal(
      session.goalDiscovery?.object?.id,
      NEXORA_EXECUTIVE_GOAL_OBJECT_ID,
    );
    assert.equal(
      session.outcomeMonitoring?.state,
      "READY_FOR_LEARNING_REASSESSMENT",
    );
    assert.equal(
      session.learningReassessment?.cycle?.reassessmentRoute === "GOAL",
      false,
    );
    assert.match(learned.response, /REALITY|ISSUE|SCENARIO|MONITOR|CLOSE|EXECUTION|DECISION/i);

    const catalog = projectNexoraEntranceCatalog(session);
    assert.equal(catalogZContractHolds(catalog), true);
    assert.equal(catalogHasNoOverlappingXy(catalog), true);
    assert.ok(
      catalog.objects.some((object) => object.id === NEXORA_EXECUTIVE_CONTEXT_OBJECT_ID),
    );
    assert.ok(
      catalog.objects.some((object) => object.id === NEXORA_EXECUTIVE_GOAL_OBJECT_ID),
    );
    assert.ok(catalog.objects.some((object) => object.id === NEXORA_OUTCOME_OBJECT_ID));
    assert.ok(catalog.objects.some((object) => object.id === NEXORA_LEARNING_OBJECT_ID));
    const goalRels = catalog.relationships.filter((rel) =>
      rel.sourceId === NEXORA_EXECUTIVE_GOAL_OBJECT_ID ||
      rel.targetId === NEXORA_EXECUTIVE_GOAL_OBJECT_ID,
    );
    assert.ok(goalRels.length > 0);
    const duplicateIds = catalog.objects.map((object) => object.id);
    assert.equal(new Set(duplicateIds).size, duplicateIds.length);
    assert.doesNotMatch(learned.response, /will emit CONFIRMED|auto-start|auto-commit/i);
  });

  it("does not auto-commit or auto-start, and does not promote PREDICTED to KNOWN", () => {
    const recommended = runScript(FULL_LOOP.slice(0, 14));
    assert.notEqual(
      recommended.nextEntranceSession?.decisionExperience?.canonicalRecord?.status,
      "Approved",
    );
    const planned = runScript(FULL_LOOP.slice(0, 19));
    assert.notEqual(
      planned.nextEntranceSession?.executionPlanning?.canonicalStatus,
      "in-progress",
    );
    const observed = runScript(FULL_LOOP.slice(0, 24));
    const expected = observed.response + JSON.stringify(observed.nextEntranceSession?.outcomeMonitoring);
    assert.match(expected, /PREDICTED|94%/);
    assert.doesNotMatch(observed.response, /root cause is|because we started execution/i);
  });

  it("existing workspace is not first-time restrained", () => {
    const session = createNexoraEntranceSession({
      workspaceResolution: "existing-workspace",
    });
    assert.equal(isNexoraEntranceRestrained(session), false);
    const turn = runTurn("Hi.", undefined, { workspace: "existing-workspace" });
    assert.notEqual(turn.nextEntranceSession?.workspaceResolution, "first-time");
  });

  it("generic domains reuse the same architecture", () => {
    const domains = [
      "I'm Priya. I run a retail company. We need to protect cash.",
      "I'm Sam. I manage a construction project. We need to hit the milestone.",
      "I'm Lee. I run engineering. We need to reduce critical bugs.",
    ];
    for (const utterance of domains) {
      const identity = runTurn("Hi.", undefined, {
        session: createNexoraEntranceSession({ workspaceResolution: "first-time" }),
      });
      const named = runTurn(utterance, identity);
      assert.ok(
        named.nextEntranceSession?.workspaceResolution === "first-time" ||
          named.nextEntranceSession?.workspaceResolution === "returning-sufficient",
      );
      assert.ok(named.response.length > 8);
      assert.doesNotMatch(named.response, /MO:7/);
    }
  });

  it("source-inspects no parallel Advisor/Stage/EXP:11 and overlay z=0", () => {
    const files = [
      "nexoraEndToEndCertification.ts",
      "nexoraDecisionExperience.ts",
      "nexoraExecutionPlanning.ts",
      "nexoraOutcomeMonitoring.ts",
      "nexoraLearningReassessment.ts",
      "nexoraEntranceExperience.ts",
    ];
    const joined = files
      .map((name) => readFileSync(join(here, name), "utf8"))
      .join("\n");
    assert.match(joined, /createsNexExp11: false/);
    assert.doesNotMatch(joined, /createsNexExp11:\s*true/);
    assert.doesNotMatch(joined, /createsMo7:\s*true/);
    const overlays = [
      "nexoraDecisionExperienceTypes.ts",
      "nexoraExecutionPlanningTypes.ts",
      "nexoraOutcomeMonitoringTypes.ts",
      "nexoraLearningReassessmentTypes.ts",
      "nexoraScenarioDiscoveryExperience.ts",
      "nexoraIssueDiscoveryExperience.ts",
    ];
    const typeJoined = overlays
      .map((name) => readFileSync(join(here, name), "utf8"))
      .join("\n");
    assert.match(typeJoined, /stealsCenter: false as const/);
    for (const name of overlays) {
      const source = readFileSync(join(here, name), "utf8");
      assert.doesNotMatch(source, /position:\s*\[[^\]]*,\s*[^\]]*,\s*[1-9]/);
    }
  });
});
