/**
 * NEX-EXP:5 — Scenario & Option Discovery tests.
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
  selectNexoraMVPInteractionSubject,
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
  constraintBlocksOption,
  findCanonicalScenarioId,
  inventsNumericOutcomes,
  isDecisionOrExecutionCommand,
  mergeOption,
  optionFromUtterance,
} from "./nexoraScenarioDiscoveryResolution.ts";
import {
  getNexoraScenarioDiscoveryExperienceIdentity,
  NEXORA_SCENARIO_DISCOVERY_BOUNDARY,
  overlayScenariosOnEntranceCatalog,
  shouldNexoraScenarioDiscoveryOwnUtterance,
  verifyNexoraScenarioDiscoveryExperience,
} from "./nexoraScenarioDiscoveryExperience.ts";
import { SCENARIO_PRIORITY_TRADEOFF_BOUNDARY } from "../executive-intelligence/scenarioPriorityTradeoffIntelligence.ts";

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
  previous?: ReturnType<typeof executeNexoraConversationalExperience>,
) {
  const session = previous?.nextEntranceSession ?? readyEntrance();
  const catalog = projectNexoraEntranceCatalog(session);
  return executeNexoraConversationalExperience({
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
    messageIdSeed: `nex-exp5-${utterance}`,
  });
}

function reachIssueReady() {
  const reality = runTurn(
    "Our backlog is high and capacity is almost full.",
    runTurn(
      "On-time delivery is around 91%. We want 96%.",
      runTurn("We need to improve delivery reliability."),
    ),
  );
  const problem = runTurn("Capacity is our biggest problem.", reality);
  return runTurn("Are we ready to explore scenarios?", problem);
}

describe("NEX-EXP:5 Scenario & Option Discovery", () => {
  it("identity and boundary", () => {
    assert.equal(
      getNexoraScenarioDiscoveryExperienceIdentity().id,
      "NEX-EXP:5/ScenarioOptionDiscovery",
    );
    assert.equal(verifyNexoraScenarioDiscoveryExperience().ok, true);
    assert.equal(NEXORA_SCENARIO_DISCOVERY_BOUNDARY.startsNexExp6, false);
    assert.equal(NEXORA_SCENARIO_DISCOVERY_BOUNDARY.commitsDecision, false);
    assert.equal(NEXORA_SCENARIO_DISCOVERY_BOUNDARY.writesDataReality, false);
    assert.equal(SCENARIO_PRIORITY_TRADEOFF_BOUNDARY.commitsDecisions, false);
    assert.equal(inventsNumericOutcomes(), false);
  });

  it("1-2 manager proposes one and multiple Options", () => {
    const ready = reachIssueReady();
    const one = runTurn("We could add weekend capacity.", ready);
    assert.ok(
      (one.nextEntranceSession?.scenarioDiscovery?.options.length ?? 0) >= 1,
    );
    const two = runTurn("What if we outsource part of it?", one);
    assert.ok(
      (two.nextEntranceSession?.scenarioDiscovery?.options.length ?? 0) >= 2,
    );
  });

  it("3-4 canonical reuse and duplicate protection", () => {
    const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
    assert.equal(
      findCanonicalScenarioId(catalog, "Capacity Expansion Plan"),
      "ctx-scenario-capacity",
    );
    const first = optionFromUtterance({
      utterance: "We could add weekend capacity.",
      catalog: projectNexoraEntranceCatalog(readyEntrance()),
      goalId: "g",
      issueIds: [],
      realityIds: [],
      constraints: [],
    });
    const merged = mergeOption(
      first ? [first] : [],
      optionFromUtterance({
        utterance: "We could add weekend capacity again.",
        catalog: projectNexoraEntranceCatalog(readyEntrance()),
        goalId: "g",
        issueIds: [],
        realityIds: [],
        constraints: [],
      }) ?? first!,
    );
    assert.equal(merged.length, 1);
  });

  it("5-12 option/scenario are not recommendation, decision, prediction, or execution", () => {
    const ready = reachIssueReady();
    const option = runTurn("We could add weekend capacity.", ready);
    assert.match(option.response, /not a Decision|possible path|Option candidate/i);
    assert.equal(
      option.nextEntranceSession?.scenarioDiscovery?.options[0]?.createsDecision,
      false,
    );
    assert.equal(
      option.nextEntranceSession?.scenarioDiscovery?.options[0]?.startsExecution,
      false,
    );
    const rec = runTurn("Does this mean you recommend Scenario A?", option);
    assert.match(rec.response, /not a recommendation/i);
    const pred = runTurn("Is that a prediction or a scenario?", option);
    assert.match(pred.response, /not a prediction/i);
    const choose = runTurn("Which Scenario did I choose?", option);
    assert.match(choose.response, /None is selected/i);
    assert.equal(
      option.nextEntranceSession?.scenarioDiscovery?.scenarios[0]?.approved,
      false,
    );
  });

  it("13-14 invalid and constrained Options", () => {
    assert.equal(
      constraintBlocksOption("Purchase New Line", ["No capital expenditure this quarter"]),
      true,
    );
    const ready = reachIssueReady();
    const option = runTurn("What if we outsource part of it?", ready);
    const removed = runTurn("External production is not possible. Remove that option.", option);
    assert.ok(
      removed.nextEntranceSession?.scenarioDiscovery?.options.some(
        (entry) => entry.feasibility === "UNAVAILABLE" || !entry.active,
      ) || /unavailable/i.test(removed.response),
    );
  });

  it("15-21 assumptions, unknowns, no invented numbers", () => {
    const ready = reachIssueReady();
    const option = runTurn("We could add weekend capacity.", ready);
    const assume = runTurn("What does Scenario A assume?", option);
    assert.match(assume.response, /assum|not a validated fact/i);
    const unknown = runTurn("What don't we know?", option);
    assert.match(unknown.response, /unknown/i);
    assert.doesNotMatch(option.response, /\$120k|ROI = 34|18%/);
  });

  it("22-26 do-nothing, evidence-gathering, no forced ABC, draft vs stage", () => {
    const ready = reachIssueReady();
    const none = runTurn("What options do we have?", ready);
    assert.match(none.response, /will not invent|No manager-stated/i);
    const evidence = runTurn("We could collect more evidence.", ready);
    assert.ok(
      evidence.nextEntranceSession?.scenarioDiscovery?.options.some((entry) =>
        /evidence/i.test(entry.title),
      ),
    );
    const baseline = runTurn("What if we do nothing?", evidence);
    assert.ok(
      baseline.nextEntranceSession?.scenarioDiscovery?.scenarios.some((entry) =>
        /current plan/i.test(entry.title),
      ),
    );
  });

  it("27-32 center, click, Goal, Reality immutability", () => {
    const ready = reachIssueReady();
    const option = runTurn("We could add weekend capacity.", ready);
    assert.equal(
      option.nextRuntimeState.focusedSubject?.id,
      NEXORA_EXECUTIVE_GOAL_OBJECT_ID,
    );
    const catalog = projectNexoraEntranceCatalog(option.nextEntranceSession!);
    const scenario = catalog.objects.find((entry) =>
      entry.id.startsWith("issue-scenario-"),
    );
    assert.ok(scenario);
    const centered = selectNexoraMVPInteractionSubject(
      option.nextRuntimeState,
      scenario!.id,
      catalog,
    );
    assert.equal(centered.focusedSubject?.id, scenario!.id);
    const affect = runTurn("How does this affect my Goal?", option);
    assert.equal(
      affect.managerObjectTurn.session.goalContext?.title
        .toLowerCase()
        .includes("delivery"),
      true,
    );
    const before = option.nextEntranceSession?.realityDiscovery?.context.observations[0]?.value;
    const after = runTurn("What would happen if we increased capacity?", option);
    assert.equal(
      after.nextEntranceSession?.realityDiscovery?.context.observations[0]?.value,
      before,
    );
    assert.equal(after.nextEntranceSession?.scenarioDiscovery?.lastMutatedReality, null);
  });

  it("33-35 correction, variant, removal/addition", () => {
    const ready = reachIssueReady();
    const option = runTurn("We could add weekend capacity.", ready);
    const corrected = runTurn(
      "Actually, make the weekend Scenario six weeks.",
      option,
    );
    assert.ok(
      corrected.nextEntranceSession?.scenarioDiscovery?.scenarios.some(
        (entry) => entry.timeHorizon === "6 weeks",
      ),
    );
    const variant = runTurn(
      "I want to compare six weeks versus eight weeks.",
      corrected,
    );
    assert.ok(
      (variant.nextEntranceSession?.scenarioDiscovery?.scenarios.length ?? 0) >= 2,
    );
    const added = runTurn("Add a no-action option.", option);
    assert.ok(
      added.nextEntranceSession?.scenarioDiscovery?.options.some(
        (entry) => entry.source === "BASELINE",
      ),
    );
  });

  it("36-42 scope, conflict, constraint, comparison threshold", () => {
    const ready = reachIssueReady();
    const option = runTurn("We could add weekend capacity.", ready);
    const conflict = runTurn(
      "This Scenario may conflict with Protect Cash.",
      option,
    );
    assert.match(conflict.response, /will not decide which Goal wins/i);
    const compareEarly = runTurn("Compare these scenarios.", option);
    assert.match(compareEarly.response, /Not yet|will not invent extra/i);
    const withBaseline = runTurn("What if we do nothing?", option);
    const compare = runTurn("Compare these scenarios.", withBaseline);
    assert.equal(
      compare.nextEntranceSession?.scenarioDiscovery?.state,
      "READY_FOR_SCENARIO_COMPARISON",
    );
    assert.equal(
      compare.nextEntranceSession?.scenarioDiscovery?.handoff?.comparisonStarted,
      false,
    );
  });

  it("43-46 generic cases", () => {
    const catalog = projectNexoraEntranceCatalog(readyEntrance());
    const business = optionFromUtterance({
      utterance: "We could intensify collections.",
      catalog,
      goalId: "g",
      issueIds: ["slow"],
      realityIds: [],
      constraints: [],
    });
    assert.ok(business);
    const project = optionFromUtterance({
      utterance: "We could reduce launch scope.",
      catalog,
      goalId: "g",
      issueIds: ["delay"],
      realityIds: [],
      constraints: [],
    });
    assert.ok(project);
    const ops = optionFromUtterance({
      utterance: "We could add weekend capacity.",
      catalog,
      goalId: "g",
      issueIds: ["cap"],
      realityIds: [],
      constraints: [],
    });
    assert.ok(ops);
    const software = optionFromUtterance({
      utterance: "We could move the release window.",
      catalog,
      goalId: "g",
      issueIds: ["bugs"],
      realityIds: [],
      constraints: [],
    });
    assert.ok(software);
  });

  it("47-48 decision and execution commands are not owned", () => {
    const ready = reachIssueReady();
    assert.equal(
      isDecisionOrExecutionCommand("approve scenario a"),
      true,
    );
    assert.equal(
      shouldNexoraScenarioDiscoveryOwnUtterance(
        ready.nextEntranceSession,
        "Approve Scenario A.",
      ),
      false,
    );
    assert.equal(
      shouldNexoraScenarioDiscoveryOwnUtterance(
        ready.nextEntranceSession,
        "Start Scenario B.",
      ),
      false,
    );
  });

  it("49 existing workspace unaffected", () => {
    const session = createNexoraEntranceSession({
      workspaceResolution: "existing-workspace",
    });
    const result = executeNexoraConversationalExperience({
      utterance: "We could add weekend capacity.",
      executiveSubjects: projectManagerObjectConversationalSubjects(),
      runtimeState: initialState(),
      catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
      previousEntranceSession: session,
      messageIdSeed: "nex-exp5-existing",
    });
    assert.ok(!result.nextEntranceSession?.scenarioDiscovery);
    assert.equal(shouldNexoraEntranceOwnUtterance(session, "We could add weekend capacity."), false);
  });

  it("overlay keeps Goal at origin and scenario z = 0", () => {
    const option = runTurn("We could add weekend capacity.", reachIssueReady());
    const catalog = overlayScenariosOnEntranceCatalog(
      projectNexoraEntranceCatalog(option.nextEntranceSession!),
      option.nextEntranceSession?.scenarioDiscovery ?? null,
    );
    const goal = catalog.objects.find((entry) => entry.id.startsWith("goal-"));
    assert.deepEqual(goal?.position, [0, 0, 0]);
    for (const object of catalog.objects) {
      assert.equal(object.position[2], 0);
    }
  });

  it("generic engine has no hardcoded domain branches", () => {
    const source = [
      readFileSync(join(here, "nexoraScenarioDiscoveryResolution.ts"), "utf8"),
      readFileSync(join(here, "nexoraScenarioDiscoveryExperience.ts"), "utf8"),
    ].join("\n");
    assert.doesNotMatch(source, /if \(Capacity/);
    assert.doesNotMatch(source, /if \(Delivery/);
    assert.doesNotMatch(source, /if \(Cash/);
    assert.doesNotMatch(source, /Project Orion/);
    assert.doesNotMatch(source, /if \(Software/);
    assert.doesNotMatch(source, /if \(Weekend Shift/);
  });
});
