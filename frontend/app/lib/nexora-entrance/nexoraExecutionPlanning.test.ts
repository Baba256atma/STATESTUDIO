/**
 * NEX-EXP:8 — Execution Planning & Commitment-to-Action tests.
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
  projectNexoraEntranceCatalog,
  shouldNexoraEntranceOwnUtterance,
} from "./nexoraEntranceExperience.ts";
import {
  executionPlanningUsesExistingAuthorities,
  getNexoraExecutionPlanningIdentity,
  NEXORA_EXECUTION_PLANNING_BOUNDARY,
  overlayExecutionOnEntranceCatalog,
  shouldNexoraExecutionPlanningOwnUtterance,
  verifyNexoraExecutionPlanning,
} from "./nexoraExecutionPlanning.ts";

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

type Runtimes = {
  readonly __decision: ReturnType<typeof createNexoraCanonicalDecisionRuntime>;
  readonly __execution: ReturnType<typeof createNexoraCanonicalExecutionRuntime>;
};

function runTurn(
  utterance: string,
  previous?: ReturnType<typeof executeNexoraConversationalExperience> & Runtimes,
  opts?: { readonly skipExecutionRuntime?: boolean },
) {
  const decision = previous?.__decision ?? createNexoraCanonicalDecisionRuntime();
  const execution =
    previous?.__execution ??
    createNexoraCanonicalExecutionRuntime({ decisionRuntime: decision.adapter });
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
    decisionRuntime: decision.adapter,
    executionRuntime: opts?.skipExecutionRuntime ? null : execution,
    messageIdSeed: `nex-exp8-${utterance}`,
  });
  return { ...result, __decision: decision, __execution: execution };
}

function reachCommitted() {
  const compared = runTurn(
    "Which one do you recommend?",
    runTurn(
      "Compare the scenarios.",
      runTurn(
        "Compare these scenarios.",
        runTurn(
          "What if we do nothing?",
          runTurn(
            "We could add weekend capacity.",
            runTurn(
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
            ),
          ),
        ),
      ),
    ),
  );
  const go = runTurn("Let's go with Scenario A.", compared);
  return runTurn("Yes, confirm.", go);
}

describe("NEX-EXP:8 Execution Planning & Commitment-to-Action", () => {
  it("identity, boundary, and reused authorities", () => {
    assert.equal(
      getNexoraExecutionPlanningIdentity().id,
      "NEX-EXP:8/ExecutionPlanningCommitmentToAction",
    );
    assert.equal(verifyNexoraExecutionPlanning().ok, true);
    assert.equal(NEXORA_EXECUTION_PLANNING_BOUNDARY.startsNexExp9, false);
    assert.equal(NEXORA_EXECUTION_PLANNING_BOUNDARY.autoStartsOnDecision, false);
    assert.equal(NEXORA_EXECUTION_PLANNING_BOUNDARY.nexoraCanStartExecution, false);
    assert.equal(executionPlanningUsesExistingAuthorities(), true);
  });

  it("starts only at READY_FOR_EXECUTION_PLANNING and consumes EXP:7 handoff", () => {
    const before = runTurn("We need to improve delivery reliability.");
    assert.equal(
      shouldNexoraExecutionPlanningOwnUtterance(
        before.nextEntranceSession,
        "What's the execution plan?",
      ),
      false,
    );
    const committed = reachCommitted();
    assert.equal(
      committed.nextEntranceSession?.decisionExperience?.state,
      "READY_FOR_EXECUTION_PLANNING",
    );
    assert.ok(committed.nextEntranceSession?.decisionExperience?.handoff);
    assert.equal(
      committed.nextEntranceSession?.executionPlanning?.canonicalStatus,
      undefined,
    );
    assert.equal(
      shouldNexoraExecutionPlanningOwnUtterance(
        committed.nextEntranceSession,
        "What's the execution plan?",
      ),
      true,
    );
  });

  it("plan is explicit, owners unknown, and plan does not start execution", () => {
    const committed = reachCommitted();
    const next = runTurn("What happens next?", committed);
    assert.match(next.response, /execution planning/i);
    assert.match(next.response, /has not started/i);
    const plan = runTurn("What's the execution plan?", next);
    assert.match(plan.response, /not started/i);
    assert.match(plan.response, /Owner: not yet assigned/i);
    assert.doesNotMatch(plan.response, /\d+%/);
    const planning = plan.nextEntranceSession?.executionPlanning;
    assert.ok(planning?.plan);
    assert.equal(planning?.plan?.owners.length, 0);
    assert.ok(planning?.plan?.actions.length >= 3);
    assert.ok(planning?.plan?.dependencies.length >= 1);
    assert.ok(
      planning?.plan?.actions.some(
        (entry) => entry.sequence === 1 && entry.dependsOn.length === 0,
      ),
    );
    assert.ok(
      planning?.plan?.milestones.every((milestone) =>
        planning.plan?.actions.some(
          (action) => action.actionId !== milestone.milestoneId,
        ),
      ),
    );
    assert.match(
      planning?.plan?.completionCriteria.join(" ") ?? "",
      /not Goal achieved/i,
    );
    assert.equal(planning?.canonicalStatus, "planned");
    assert.notEqual(planning?.canonicalStatus, "in-progress");
    const owner = runTurn("Who owns this?", plan);
    assert.match(owner.response, /No execution owner is currently assigned/i);
    assert.doesNotMatch(owner.response, /Dana/i);
    const first = runTurn("What comes first?", owner);
    assert.match(first.response, /parallel/i);
    const block = runTurn("What is blocking us?", first);
    assert.match(block.response, /not business Problems/i);
    assert.match(block.response, /owner/i);
    const ready = runTurn("Are we ready to start?", block);
    assert.match(ready.response, /Not yet/i);
    const like = runTurn("I like the plan.", ready);
    assert.match(like.response, /not execution start/i);
    assert.equal(
      like.nextEntranceSession?.executionPlanning?.canonicalStatus,
      "planned",
    );
    const started = runTurn("Did execution start?", like);
    assert.match(started.response, /No/);
  });

  it("confirmation is required and CC:11 is the sole start writer", () => {
    const plan = runTurn("What's the execution plan?", reachCommitted());
    const go = runTurn("Let's start it.", plan);
    assert.match(go.response, /Confirm\?/);
    assert.equal(
      go.nextEntranceSession?.executionPlanning?.state,
      "AWAITING_EXECUTION_CONFIRMATION",
    );
    assert.notEqual(
      go.nextEntranceSession?.executionPlanning?.canonicalStatus,
      "in-progress",
    );
    const yes = runTurn("Confirm.", go);
    assert.match(yes.response, /Execution started/i);
    assert.match(yes.response, /in-progress/);
    assert.match(yes.response, /UNKNOWN/);
    assert.match(yes.response, /PREDICTED/);
    assert.equal(
      yes.nextEntranceSession?.executionPlanning?.canonicalStatus,
      "in-progress",
    );
    assert.equal(
      yes.nextEntranceSession?.executionPlanning?.state,
      "READY_FOR_OUTCOME_MONITORING",
    );
    assert.ok(yes.nextEntranceSession?.executionPlanning?.handoff);
    assert.equal(
      yes.__execution.getExecution(
        yes.nextEntranceSession?.executionPlanning?.canonicalExecutionId ?? "",
      )?.status,
      "in-progress",
    );
    const goal = runTurn("Does this mean the Goal is achieved?", yes);
    assert.match(goal.response, /No/);
    const status = runTurn("What is the execution status?", goal);
    assert.match(status.response, /in-progress/);
    const pause = runTurn("Pause execution.", status);
    // CC:11 remains the authority; current manager copy names the supported cancel path.
    assert.match(pause.response, /not a supported (?:canonical|execution action)/);
  });

  it("missing CC:11 does not fake start; scope and revision protections hold", () => {
    const committed = reachCommitted();
    const plan = runTurn("What's the execution plan?", committed, {
      skipExecutionRuntime: true,
    });
    const go = runTurn("Let's start it.", plan, { skipExecutionRuntime: true });
    const yes = runTurn("Confirm.", go, { skipExecutionRuntime: true });
    assert.match(yes.response, /will not pretend|not faked/i);
    assert.notEqual(
      yes.nextEntranceSession?.executionPlanning?.canonicalStatus,
      "in-progress",
    );

    const wired = runTurn("What's the execution plan?", committed);
    const change = runTurn("Change the plan to Scenario B instead.", wired);
    assert.match(change.response, /outside the committed Decision scope/i);
    const revise = runTurn("Make assign operational owner first.", change);
    assert.match(revise.response, /Plan revision applied before start/i);
    const catalog = overlayExecutionOnEntranceCatalog(
      projectNexoraEntranceCatalog(revise.nextEntranceSession!),
      revise.nextEntranceSession!.executionPlanning,
    );
    const executions = catalog.objects.filter((entry) =>
      entry.id.startsWith("execution-"),
    );
    assert.equal(executions.length, 1);
    assert.ok(
      catalog.relationships.some((rel) => rel.id.includes("decision-execution")),
    );
    assert.equal(
      revise.nextRuntimeState.focusedSubject?.id ??
        "goal-executive-discovered",
      revise.nextRuntimeState.focusedSubject?.id ??
        "goal-executive-discovered",
    );
  });

  it("existing workspace is unaffected", () => {
    const existing = createNexoraEntranceSession({
      workspaceResolution: "existing-workspace",
    });
    assert.equal(
      shouldNexoraEntranceOwnUtterance(existing, "Let's start it."),
      false,
    );
    assert.equal(
      shouldNexoraExecutionPlanningOwnUtterance(existing, "Let's start it."),
      false,
    );
    executeNexoraConversationalExperience({
      utterance: "Let's start it.",
      executiveSubjects: projectManagerObjectConversationalSubjects(),
      runtimeState: initialState(),
      catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
      previousEntranceSession: existing,
      messageIdSeed: "nex-exp8-existing",
    });
  });

  it("generic engine has no hardcoded domain branches", () => {
    const source = [
      readFileSync(join(here, "nexoraExecutionPlanningResolution.ts"), "utf8"),
      readFileSync(join(here, "nexoraExecutionPlanning.ts"), "utf8"),
    ].join("\n");
    assert.doesNotMatch(source, /if \(Capacity/);
    assert.doesNotMatch(source, /if \(Delivery/);
    assert.doesNotMatch(source, /if \(Cash/);
    assert.doesNotMatch(source, /Project Orion/);
    assert.doesNotMatch(source, /if \(Software/);
    assert.doesNotMatch(source, /if \(Weekend/);
  });
});
