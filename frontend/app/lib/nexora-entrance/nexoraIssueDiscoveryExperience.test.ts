/**
 * NEX-EXP:4 — Problem, Risk & Opportunity Discovery tests.
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
} from "./nexoraEntranceExperience.ts";
import { NEXORA_EXECUTIVE_GOAL_OBJECT_ID } from "./nexoraGoalDiscoveryTypes.ts";
import {
  candidateFromUtterance,
  ei3UnknownCauseRelationship,
  emergeIssueObjects,
  findCanonicalIssueId,
  mergeIssueCandidate,
  relationshipIsNotCause,
} from "./nexoraIssueDiscoveryResolution.ts";
import {
  getNexoraIssueDiscoveryExperienceIdentity,
  NEXORA_ISSUE_DISCOVERY_BOUNDARY,
  overlayIssuesOnEntranceCatalog,
  verifyNexoraIssueDiscoveryExperience,
} from "./nexoraIssueDiscoveryExperience.ts";
import { PROBLEM_RISK_OPPORTUNITY_BOUNDARY } from "../executive-intelligence/problemRiskOpportunityIntelligence.ts";

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
    messageIdSeed: `nex-exp4-${utterance}`,
  });
}

function reachReality() {
  return runTurn(
    "Our backlog is high and capacity is almost full.",
    runTurn(
      "On-time delivery is around 91%. We want 96%.",
      runTurn("We need to improve delivery reliability."),
    ),
  );
}

describe("NEX-EXP:4 Problem, Risk & Opportunity Discovery", () => {
  it("identity and boundary", () => {
    assert.equal(
      getNexoraIssueDiscoveryExperienceIdentity().id,
      "NEX-EXP:4/ProblemRiskOpportunityDiscovery",
    );
    assert.equal(verifyNexoraIssueDiscoveryExperience().ok, true);
    assert.equal(NEXORA_ISSUE_DISCOVERY_BOUNDARY.startsNexExp5, false);
    assert.equal(NEXORA_ISSUE_DISCOVERY_BOUNDARY.inventsRootCause, false);
    assert.equal(PROBLEM_RISK_OPPORTUNITY_BOUNDARY.infersCausality, false);
  });

  it("1 gap exists but no Problem identified", () => {
    const asked = runTurn("Do we have a Problem?", reachReality());
    assert.match(asked.response, /gap is an observed symptom|not yet have a supported Problem/i);
    assert.equal(asked.nextEntranceSession?.issueDiscovery?.objects.length ?? 0, 0);
  });

  it("2-5 current Problem, future Risk, Opportunity, Constraint", () => {
    const reality = reachReality();
    const problem = runTurn("Capacity is our biggest problem.", reality);
    assert.ok(
      problem.nextEntranceSession?.issueDiscovery?.objects.some(
        (entry) => entry.kind === "PROBLEM",
      ),
    );
    const risk = runTurn("Supplier delays are becoming risky.", problem);
    assert.ok(
      risk.nextEntranceSession?.issueDiscovery?.objects.some(
        (entry) => entry.kind === "RISK",
      ),
    );
    const opportunity = runTurn(
      "Weekend capacity is actually available now.",
      risk,
    );
    assert.ok(
      opportunity.nextEntranceSession?.issueDiscovery?.objects.some(
        (entry) => entry.kind === "OPPORTUNITY",
      ),
    );
    const constraint = runTurn("Budget is capped at $250k.", opportunity);
    assert.ok(
      constraint.nextEntranceSession?.issueDiscovery?.objects.some(
        (entry) => entry.kind === "CONSTRAINT",
      ),
    );
  });

  it("6-10 semantic distinctions hold", () => {
    const reality = reachReality();
    const vsConstraint = runTurn("Do we have a Problem?", reality);
    assert.match(vsConstraint.response, /not automatically a Problem|not yet have a supported Problem/i);
    const problem = runTurn("Capacity is our biggest problem.", reality);
    const cause = runTurn("Is Capacity the root cause?", problem);
    assert.match(cause.response, /unconfirmed causal hypothesis|not a confirmed root cause/i);
    const rec = runTurn("Is that an opportunity or a recommendation?", problem);
    assert.match(rec.response, /not a recommendation/i);
    const vsRisk = runTurn("Is this a Problem or a Risk?", problem);
    assert.match(vsRisk.response, /current undesirable|possible future/i);
  });

  it("11-15 manager-stated signals stay unvalidated", () => {
    const reality = reachReality();
    const problem = runTurn("Capacity is our biggest problem.", reality);
    const candidate = problem.nextEntranceSession?.issueDiscovery?.candidates.find(
      (entry) => entry.kind === "PROBLEM",
    );
    assert.equal(candidate?.validated, false);
    assert.equal(candidate?.managerStated, true);
    runTurn("Supplier delays are becoming risky.", problem);
    runTurn("We may be able to use weekend capacity.", problem);
    const tight = runTurn("Budget is tight.", problem);
    assert.match(tight.response, /defined spending limit|under pressure/i);
    const because = runTurn(
      "Delivery is late because capacity is too low.",
      problem,
    );
    assert.match(because.response, /HYPOTHESIZED|unconfirmed/i);
    assert.equal(
      because.nextEntranceSession?.issueDiscovery?.objects.find(
        (entry) => entry.kind === "PROBLEM",
      )?.causalStatus,
      "HYPOTHESIZED",
    );
  });

  it("16-18 canonical reuse and duplicate protection", () => {
    const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
    assert.equal(
      findCanonicalIssueId(catalog, "PROBLEM", "Capacity"),
      "ctx-problem-capacity",
    );
    const first = candidateFromUtterance({
      utterance: "Capacity is our biggest problem.",
      catalog,
      goalId: "goal-1",
      goalTitle: "Improve delivery reliability",
      realityNames: ["Capacity"],
      realityIds: ["reality-capacity"],
      stale: false,
    });
    const merged = mergeIssueCandidate(
      first ? [first] : [],
      candidateFromUtterance({
        utterance: "Capacity is our biggest problem again.",
        catalog,
        goalId: "goal-1",
        goalTitle: "Improve delivery reliability",
        realityNames: ["Capacity"],
        realityIds: ["reality-capacity"],
        stale: false,
      }) ?? first!,
    );
    assert.equal(merged.length, 1);
    assert.equal(first?.objectId, "ctx-problem-capacity");
  });

  it("19-20 weak candidates stay off Stage; material ones emerge", () => {
    const weak = candidateFromUtterance({
      utterance: "Maybe something is off.",
      catalog: projectNexoraEntranceCatalog(readyEntrance()),
      goalId: null,
      goalTitle: null,
      realityNames: [],
      realityIds: [],
      stale: false,
    });
    const objects = emergeIssueObjects(weak ? [weak] : [], projectNexoraEntranceCatalog(readyEntrance()), null);
    assert.equal(objects.length, 0);
    const ready = runTurn("Capacity is our biggest problem.", reachReality());
    assert.ok((ready.nextEntranceSession?.issueDiscovery?.objects.length ?? 0) >= 1);
  });

  it("21-23 Goal remains center; click uses MO:1; Goal context survives", () => {
    const ready = runTurn("Capacity is our biggest problem.", reachReality());
    assert.equal(
      ready.nextRuntimeState.focusedSubject?.id,
      NEXORA_EXECUTIVE_GOAL_OBJECT_ID,
    );
    const catalog = projectNexoraEntranceCatalog(ready.nextEntranceSession!);
    const problem = catalog.objects.find((entry) =>
      entry.id.startsWith("issue-problem-") || entry.id === "ctx-problem-capacity",
    );
    assert.ok(problem);
    const centered = selectNexoraMVPInteractionSubject(
      ready.nextRuntimeState,
      problem!.id,
      catalog,
    );
    assert.equal(centered.focusedSubject?.id, problem!.id);
    const explain = runTurn("How does this affect my Goal?", ready);
    assert.equal(
      explain.managerObjectTurn.session.goalContext?.title
        .toLowerCase()
        .includes("delivery"),
      true,
    );
  });

  it("24-30 relationship is not cause; stale; conflict; no invented scores", () => {
    assert.equal(relationshipIsNotCause(), "unknown-cause");
    const rel = ei3UnknownCauseRelationship({
      relationshipId: "rel-test",
      sourceEntityId: "a",
      targetEntityId: "b",
    });
    assert.equal(rel.causeEstablished, false);
    const stale = candidateFromUtterance({
      utterance: "Capacity is our biggest problem and that figure is stale.",
      catalog: projectNexoraEntranceCatalog(readyEntrance()),
      goalId: "goal-1",
      goalTitle: "Improve delivery",
      realityNames: ["Capacity"],
      realityIds: ["reality-capacity"],
      stale: true,
    });
    assert.equal(stale?.sufficiency, "PARTIAL");
    const problem = runTurn("Capacity is our biggest problem.", reachReality());
    const conflicted = runTurn("Capacity is the main constraint.", problem);
    assert.match(conflicted.response, /conflict|Constraint|Problem/i);
    assert.equal(
      problem.nextEntranceSession?.issueDiscovery?.candidates[0]?.probability,
      null,
    );
    assert.equal(
      problem.nextEntranceSession?.issueDiscovery?.candidates[0]?.valuePotential,
      null,
    );
    assert.doesNotMatch(problem.response, /root cause is confirmed|ROI of|probability is 80/i);
    assert.doesNotMatch(problem.response, /you should expand capacity/i);
  });

  it("31-34 multiple issues stay distinct; none are mandatory", () => {
    const stacked = runTurn(
      "Budget is capped at $250k.",
      runTurn(
        "Supplier delays are becoming risky.",
        runTurn("Capacity is our biggest problem.", reachReality()),
      ),
    );
    const kinds = new Set(
      stacked.nextEntranceSession?.issueDiscovery?.objects.map((entry) => entry.kind),
    );
    assert.ok(kinds.size >= 2);
    const none = runTurn("Do we have any opportunities?", reachReality());
    assert.match(none.response, /No supported Opportunity|will not invent/i);
    const noRisk = runTurn("What risks do we have?", reachReality());
    assert.match(noRisk.response, /No supported future Risk/i);
  });

  it("35-38 generic business, project, operational, and software cases", () => {
    const business = candidateFromUtterance({
      utterance: "Slow collections are our biggest problem.",
      catalog: projectNexoraEntranceCatalog(readyEntrance()),
      goalId: "g",
      goalTitle: "Protect Cash",
      realityNames: ["Cash"],
      realityIds: ["reality-cash"],
      stale: false,
    });
    assert.equal(business?.kind, "PROBLEM");
    const project = candidateFromUtterance({
      utterance: "Q4 launch slippage is becoming risky.",
      catalog: projectNexoraEntranceCatalog(readyEntrance()),
      goalId: "g",
      goalTitle: "Launch by Q4",
      realityNames: ["Schedule"],
      realityIds: ["reality-schedule"],
      stale: false,
    });
    assert.equal(project?.kind, "RISK");
    const ops = candidateFromUtterance({
      utterance: "Backlog pressure is our biggest problem.",
      catalog: projectNexoraEntranceCatalog(readyEntrance()),
      goalId: "g",
      goalTitle: "Improve delivery reliability",
      realityNames: ["Backlog"],
      realityIds: ["reality-backlog"],
      stale: false,
    });
    assert.equal(ops?.kind, "PROBLEM");
    const software = candidateFromUtterance({
      utterance: "The deployment window is the main constraint.",
      catalog: projectNexoraEntranceCatalog(readyEntrance()),
      goalId: "g",
      goalTitle: "Release Version 2.0",
      realityNames: ["Build"],
      realityIds: ["reality-build"],
      stale: false,
    });
    assert.equal(software?.kind, "CONSTRAINT");
  });

  it("39 returning issue context skips rediscovery", () => {
    const ready = runTurn("Capacity is our biggest problem.", reachReality());
    const closed = runTurn("Are we ready to explore scenarios?", ready);
    assert.equal(
      closed.nextEntranceSession?.issueDiscovery?.state,
      "READY_FOR_SCENARIO_DISCOVERY",
    );
    const again = runTurn("What may be preventing the Goal?", closed);
    assert.doesNotMatch(
      again.response,
      /Which current condition do you believe is most limiting/,
    );
    assert.ok(
      (again.nextEntranceSession?.issueDiscovery?.objects.length ?? 0) >= 1,
    );
  });

  it("40 default existing workspace is unaffected", () => {
    const session = createNexoraEntranceSession({
      workspaceResolution: "existing-workspace",
    });
    const result = executeNexoraConversationalExperience({
      utterance: "Capacity is our biggest problem.",
      executiveSubjects: projectManagerObjectConversationalSubjects(),
      runtimeState: initialState(),
      catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
      previousEntranceSession: session,
      messageIdSeed: "nex-exp4-existing",
    });
    assert.ok(!result.nextEntranceSession?.issueDiscovery);
    assert.ok(
      getDefaultNexoraMVPObjectInteractionCatalog().objects.some(
        (object) => object.id === "obj-capacity",
      ),
    );
  });

  it("overlay keeps Goal at origin and issue z = 0", () => {
    const ready = runTurn("Capacity is our biggest problem.", reachReality());
    const catalog = overlayIssuesOnEntranceCatalog(
      projectNexoraEntranceCatalog(ready.nextEntranceSession!),
      ready.nextEntranceSession?.issueDiscovery ?? null,
    );
    const goal = catalog.objects.find((entry) => entry.id.startsWith("goal-"));
    assert.deepEqual(goal?.position, [0, 0, 0]);
    for (const object of catalog.objects) {
      assert.equal(object.position[2], 0);
    }
  });

  it("generic engine has no hardcoded domain branches", () => {
    const source = [
      readFileSync(join(here, "nexoraIssueDiscoveryResolution.ts"), "utf8"),
      readFileSync(join(here, "nexoraIssueDiscoveryExperience.ts"), "utf8"),
    ].join("\n");
    assert.doesNotMatch(source, /if \(Delivery/);
    assert.doesNotMatch(source, /if \(Capacity/);
    assert.doesNotMatch(source, /if \(Cash/);
    assert.doesNotMatch(source, /Project Orion/);
    assert.doesNotMatch(source, /if \(Software/);
  });
});
