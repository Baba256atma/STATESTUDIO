/**
 * NEX-EXP:2 — Goal Discovery & Goal Object Emergence tests.
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
import { projectManagerObjectConversationalSubjects } from "../manager-object/managerObjectCatalog.ts";
import { applyManagerIdentityUtterance, emptyManagerIdentityContext } from "./nexoraEntranceIdentity.ts";
import {
  applyEntranceCenterSubject,
  createNexoraEntranceSession,
  NEXORA_EXECUTIVE_CONTEXT_OBJECT_ID,
  projectNexoraEntranceCatalog,
} from "./nexoraEntranceExperience.ts";
import {
  applyGoalUtterance,
  classifyGoalClarity,
  emptyGoalDiscoveryContext,
  extractCausalHypotheses,
  extractCurrentState,
  extractIssueSignals,
  extractTargetState,
  extractTimeHorizon,
  goalSufficiencyOf,
  isDuplicateGoalTitle,
  matchExistingCanonicalGoal,
  normalizeGoalTitle,
} from "./nexoraGoalDiscoveryResolution.ts";
import {
  createNexoraGoalDiscoverySession,
  getNexoraGoalDiscoveryExperienceIdentity,
  NEXORA_EXECUTIVE_GOAL_OBJECT_ID,
  NEXORA_GOAL_DISCOVERY_BOUNDARY,
  overlayGoalOnEntranceCatalog,
  resolveNexoraGoalDiscoveryTurn,
  verifyNexoraGoalDiscoveryExperience,
} from "./nexoraGoalDiscoveryExperience.ts";
import type { NexoraEntranceSession } from "./nexoraEntranceTypes.ts";

const here = dirname(fileURLToPath(import.meta.url));

function initialState() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function readyEntrance(): NexoraEntranceSession {
  const identity = applyManagerIdentityUtterance(
    emptyManagerIdentityContext(),
    "I'm Dana. I run operations for a logistics company.",
  );
  return createNexoraEntranceSession({
    workspaceResolution: "first-time",
    identity,
  });
}

function runGoal(utterance: string, previous?: ReturnType<typeof executeNexoraConversationalExperience>) {
  const session = previous?.nextEntranceSession ?? readyEntrance();
  const catalog = projectNexoraEntranceCatalog(session);
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext,
    executiveContext: previous?.nextExecutiveContext,
    executiveSubjects: projectManagerObjectConversationalSubjects(catalog),
    runtimeState:
      previous?.nextRuntimeState ?? applyEntranceCenterSubject(initialState(), session),
    catalog,
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? null,
    previousEntranceSession: session,
    messageIdSeed: `nex-exp2-${utterance}`,
  });
}

describe("NEX-EXP:2 Goal Discovery & Goal Object Emergence", () => {
  it("identity and boundary", () => {
    assert.equal(
      getNexoraGoalDiscoveryExperienceIdentity().id,
      "NEX-EXP:2/GoalDiscoveryGoalObjectEmergence",
    );
    assert.equal(verifyNexoraGoalDiscoveryExperience().ok, true);
    assert.equal(NEXORA_GOAL_DISCOVERY_BOUNDARY.createsMo7, false);
    assert.equal(NEXORA_GOAL_DISCOVERY_BOUNDARY.startsNexExp3, false);
    assert.equal(NEXORA_GOAL_DISCOVERY_BOUNDARY.parallelGoalSystem, false);
    assert.equal(NEXORA_GOAL_DISCOVERY_BOUNDARY.usesLlm, false);
  });

  it("1 clear explicit goal becomes the Stage center", () => {
    const result = runGoal("We need to improve delivery reliability.");
    assert.equal(result.nextEntranceSession?.goalDiscovery?.context.sufficiency, "SUFFICIENT");
    assert.equal(result.nextRuntimeState.focusedSubject?.id, NEXORA_EXECUTIVE_GOAL_OBJECT_ID);
    assert.match(result.response, /Goal:/);
    assert.match(result.response, /success look like|current reality/i);
  });

  it("2-3 ambiguous and broad goals do not emerge", () => {
    assert.equal(classifyGoalClarity("improve things"), "TOO_BROAD");
    assert.equal(
      goalSufficiencyOf({
        title: "Improve things",
        clarity: "TOO_BROAD",
        relatedExecutiveContext: "Ops",
        scope: "Ops",
      }),
      "INSUFFICIENT",
    );
    const broad = runGoal("I want things to run better.");
    assert.notEqual(
      broad.nextRuntimeState.focusedSubject?.id,
      NEXORA_EXECUTIVE_GOAL_OBJECT_ID,
    );
    assert.match(broad.response, /which outcome/i);
  });

  it("4-7 target and deadline remain unknown unless stated", () => {
    const bare = applyGoalUtterance(
      emptyGoalDiscoveryContext("Ops"),
      "Increase revenue.",
      "Ops",
    ).context;
    assert.equal(bare.targetState, null);
    assert.equal(bare.timeHorizon, null);
    assert.equal(extractTargetState("Reduce late deliveries below 5%."), "below 5%");
    assert.ok(extractTimeHorizon("We need this by Q4"));
    assert.equal(extractCurrentState("we're currently around 91%"), "91%");
    const withTarget = applyGoalUtterance(
      applyGoalUtterance(emptyGoalDiscoveryContext("Ops"), "Increase revenue.", "Ops")
        .context,
      "Reduce late deliveries below 5%.",
      "Ops",
    ).context;
    assert.equal(withTarget.targetState, "below 5%");
  });

  it("8 reuses NEX-EXP:1 goal signals", () => {
    const identity = applyManagerIdentityUtterance(
      emptyManagerIdentityContext(),
      "I'm Dana. I run operations for a logistics company and we're trying to reduce delivery delays.",
    );
    const session = createNexoraEntranceSession({
      workspaceResolution: "first-time",
      identity,
    });
    const seeded = createNexoraGoalDiscoverySession({
      relatedExecutiveContext: session.identityObject?.displayName ?? null,
      knownGoalSignals: session.knownGoalSignals.length
        ? session.knownGoalSignals
        : ["reduce delivery delays"],
    });
    assert.ok(seeded.context.goalTitle);
    const turn = resolveNexoraGoalDiscoveryTurn({
      utterance: "Hi.",
      entrance: { ...session, goalDiscovery: seeded },
      runtimeState: initialState(),
      catalog: projectNexoraEntranceCatalog(session),
    });
    assert.match(turn.response, /reduce delivery delays|delivery/i);
    assert.doesNotMatch(turn.response, /What outcome are you trying to achieve right now\?/);
  });

  it("9-10 inferred wording requires confirmation", () => {
    const inferred = normalizeGoalTitle("fewer late deliveries");
    assert.equal(inferred.materialChange, true);
    const result = runGoal("We need fewer late deliveries.");
    assert.match(result.response, /Is that right/i);
    assert.equal(result.nextEntranceSession?.goalDiscovery?.context.needsConfirmation, true);
    const confirmed = runGoal("Yes.", result);
    assert.equal(confirmed.nextEntranceSession?.goalDiscovery?.context.managerConfirmed, true);
  });

  it("11-13 correction, refinement, and change", () => {
    const first = runGoal("We need to improve delivery reliability.");
    const changed = runGoal("Actually, protect cash flow.", first);
    assert.match(changed.response, /protect cash|cash flow/i);
    const refined = runGoal(
      "No, refine the goal — reduce delivery cost without hurting service.",
      first,
    );
    assert.match(refined.response, /refine|cost/i);
  });

  it("14-15 two goals and conflict stay unmerged", () => {
    const result = runGoal("We need to improve delivery and protect cash.");
    assert.match(result.response, /which matters more/i);
    assert.doesNotMatch(result.response, /Improve operational performance/);
    assert.ok(
      result.nextEntranceSession?.goalDiscovery?.context.priority === "UNKNOWN_PRIORITY" ||
        result.nextEntranceSession?.goalDiscovery?.context.clarity === "CONFLICTING" ||
        result.nextEntranceSession?.goalDiscovery?.candidates.length,
    );
  });

  it("16-17 existing canonical match and duplicate titles", () => {
    const matched = matchExistingCanonicalGoal("Close Capacity Gap");
    assert.equal(matched?.objectId, "goal-capacity-availability");
    assert.equal(
      isDuplicateGoalTitle("Improve Delivery Reliability", "Delivery Reliability Improvement"),
      true,
    );
  });

  it("18-20 goal object activates, context remains related, no explosion", () => {
    const result = runGoal("We need to improve delivery reliability.");
    const catalog = overlayGoalOnEntranceCatalog(
      projectNexoraEntranceCatalog(result.nextEntranceSession!),
      result.nextEntranceSession!.goalDiscovery,
    );
    assert.equal(catalog.objects.length, 2);
    assert.ok(catalog.objects.some((object) => object.id === NEXORA_EXECUTIVE_CONTEXT_OBJECT_ID));
    assert.ok(catalog.relationships.some((rel) => rel.targetId === NEXORA_EXECUTIVE_GOAL_OBJECT_ID));
    assert.ok(!catalog.objects.some((object) => object.id === "obj-capacity"));
    assert.equal(catalog.objects.find((object) => object.id === NEXORA_EXECUTIVE_GOAL_OBJECT_ID)?.position[2], 0);
  });

  it("21-23 missing KPI/target/deadline do not block a sufficient goal", () => {
    const result = runGoal("Successfully launch Project Orion.");
    assert.equal(result.nextEntranceSession?.goalDiscovery?.context.sufficiency, "SUFFICIENT");
    assert.equal(result.nextEntranceSession?.goalDiscovery?.context.targetState, null);
    assert.ok(result.nextEntranceSession?.goalDiscovery?.context.unknowns.includes("time horizon"));
  });

  it("24-26 early reality, issue, and causal hypothesis stay epistemic", () => {
    assert.equal(extractCurrentState("We want 96% on-time; we're currently around 91%."), "91%");
    assert.deepEqual([...extractIssueSignals("because capacity is too low")], ["capacity is too low"]);
    const causal = extractCausalHypotheses(
      "Delivery is late because we don't have enough capacity.",
    );
    assert.ok(causal.length > 0);
    const result = runGoal(
      "We need to improve delivery because capacity is too low.",
    );
    assert.ok(
      (result.nextEntranceSession?.goalDiscovery?.knownIssueSignals.length ?? 0) > 0,
    );
    assert.doesNotMatch(result.response, /confirmed root cause/i);
  });

  it("27 returning active goal skips rediscovery", () => {
    const first = runGoal("We need to improve delivery reliability.");
    const again = runGoal("Hi.", first);
    assert.doesNotMatch(again.response, /What outcome are you trying to achieve right now\?/);
  });

  it("28 existing workspace is unaffected", () => {
    const session = createNexoraEntranceSession({
      workspaceResolution: "existing-workspace",
    });
    const result = executeNexoraConversationalExperience({
      utterance: "We need to improve delivery reliability.",
      executiveSubjects: projectManagerObjectConversationalSubjects(),
      runtimeState: initialState(),
      catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
      previousEntranceSession: session,
      messageIdSeed: "nex-exp2-existing",
    });
    assert.notEqual(result.nextRuntimeState.focusedSubject?.id, NEXORA_EXECUTIVE_GOAL_OBJECT_ID);
    assert.ok(
      getDefaultNexoraMVPObjectInteractionCatalog().objects.some(
        (object) => object.id === "obj-capacity",
      ),
    );
  });

  it("generic engine has no hardcoded company or demo goal titles as special cases", () => {
    const source = [
      readFileSync(join(here, "nexoraGoalDiscoveryResolution.ts"), "utf8"),
      readFileSync(join(here, "nexoraGoalDiscoveryExperience.ts"), "utf8"),
    ].join("\n");
    assert.doesNotMatch(source, /Bahador/);
    assert.doesNotMatch(source, /Acme Logistics/);
    assert.doesNotMatch(source, /Protect Cash Flow/);
  });

  it("MO:4 can see the confirmed session goal", () => {
    const result = runGoal("We need to improve delivery reliability.");
    assert.equal(result.managerObjectTurn.session.goalContext?.managerConfirmed, true);
    assert.equal(result.managerObjectTurn.session.goalContext?.persisted, false);
  });
});
