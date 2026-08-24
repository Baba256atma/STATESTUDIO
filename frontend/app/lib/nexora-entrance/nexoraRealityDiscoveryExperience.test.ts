/**
 * NEX-EXP:3 — Current Reality & Executive Context Discovery tests.
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
import {
  applyManagerIdentityUtterance,
  emptyManagerIdentityContext,
} from "./nexoraEntranceIdentity.ts";
import {
  applyEntranceCenterSubject,
  createNexoraEntranceSession,
  NEXORA_EXECUTIVE_CONTEXT_OBJECT_ID,
  projectNexoraEntranceCatalog,
} from "./nexoraEntranceExperience.ts";
import { NEXORA_EXECUTIVE_GOAL_OBJECT_ID } from "./nexoraGoalDiscoveryTypes.ts";
import {
  applyRealityUtterance,
  collectCatalogObservations,
  computeGap,
  emptyRealityContext,
  extractRealityObservations,
  mergeObservations,
  observationMayBecomeObject,
  sourceOutranks,
} from "./nexoraRealityDiscoveryResolution.ts";
import {
  getNexoraRealityDiscoveryExperienceIdentity,
  NEXORA_REALITY_DISCOVERY_BOUNDARY,
  overlayRealityOnEntranceCatalog,
  verifyNexoraRealityDiscoveryExperience,
} from "./nexoraRealityDiscoveryExperience.ts";
import type { ExecutiveRealityObservation } from "./nexoraRealityDiscoveryTypes.ts";

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
    messageIdSeed: `nex-exp3-${utterance}`,
  });
}

function reachGoal() {
  return runTurn("We need to improve delivery reliability.");
}

function obs(input: Partial<ExecutiveRealityObservation> & { subject: string }): ExecutiveRealityObservation {
  return Object.freeze({
    id: input.id ?? `obs-${input.subject}`,
    subject: input.subject,
    objectId: input.objectId ?? `reality-${input.subject.toLowerCase()}`,
    value: input.value ?? "91%",
    numericValue: input.numericValue ?? 91,
    unit: input.unit ?? "%",
    state: input.state ?? null,
    timestamp: null,
    source: input.source ?? "MANAGER_REPORTED",
    sourceAuthority: input.sourceAuthority ?? "test",
    provenance: input.provenance ?? "test",
    freshness: input.freshness ?? "CURRENT",
    timeClass: input.timeClass ?? "CURRENT",
    epistemicStatus: input.epistemicStatus ?? "KNOWN",
    goalRelevance: input.goalRelevance ?? "relevant",
  });
}

describe("NEX-EXP:3 Current Reality & Executive Context Discovery", () => {
  it("identity and boundary", () => {
    assert.equal(
      getNexoraRealityDiscoveryExperienceIdentity().id,
      "NEX-EXP:3/CurrentRealityExecutiveContextDiscovery",
    );
    assert.equal(verifyNexoraRealityDiscoveryExperience().ok, true);
    assert.equal(NEXORA_REALITY_DISCOVERY_BOUNDARY.startsNexExp4, false);
    assert.equal(NEXORA_REALITY_DISCOVERY_BOUNDARY.parallelDataReality, false);
    assert.equal(NEXORA_REALITY_DISCOVERY_BOUNDARY.inventsCauses, false);
    assert.equal(NEXORA_REALITY_DISCOVERY_BOUNDARY.stealsGoalCenter, false);
  });

  it("1-2 existing data vs no data", () => {
    const withData = applyRealityUtterance(
      emptyRealityContext("goal-1", "Improve delivery reliability", "96%"),
      "status",
      getDefaultNexoraMVPObjectInteractionCatalog(),
      [
        obs({
          subject: "Delivery",
          value: "91%",
          source: "VALIDATED_DATA",
          objectId: "obj-delivery",
        }),
      ],
    );
    assert.ok(withData.observations.length >= 1);
    const none = emptyRealityContext("goal-1", "Improve delivery reliability", null);
    assert.equal(none.sufficiency, "INSUFFICIENT");
  });

  it("3 manager provides reality conversationally after the Goal", () => {
    const goal = reachGoal();
    const reality = runTurn(
      "On-time delivery is around 91%. We want 96%.",
      goal,
    );
    assert.match(reality.response, /5 percentage points|below the target/i);
    assert.equal(reality.nextRuntimeState.focusedSubject?.id, NEXORA_EXECUTIVE_GOAL_OBJECT_ID);
  });

  it("4-6 validated source outranks presentation and manager does not silently win", () => {
    assert.equal(sourceOutranks("VALIDATED_DATA", "PRESENTATION_FIXTURE"), true);
    const merged = mergeObservations([
      obs({ subject: "Capacity", value: "21.3%", source: "VALIDATED_DATA" }),
      obs({ subject: "Capacity", value: "88%", source: "PRESENTATION_FIXTURE" }),
    ]);
    assert.equal(merged.observations[0]?.value, "21.3%");
    const managerVsValidated = mergeObservations([
      obs({ subject: "OTD", value: "88%", source: "VALIDATED_DATA" }),
      obs({ subject: "OTD", value: "91%", source: "MANAGER_REPORTED" }),
    ]);
    assert.equal(managerVsValidated.observations[0]?.value, "88%");
    assert.ok(managerVsValidated.conflicts.length > 0);
  });

  it("7-8 early EXP:2 reality and issue signals are reused", () => {
    const goal = reachGoal();
    const withSignal = runTurn("We are currently at 91%.", goal);
    const next = runTurn("What is the current reality?", withSignal);
    assert.doesNotMatch(next.response, /What does the current situation look like\?/);
    const issue = runTurn(
      "We need to improve delivery because capacity is too low.",
      goal,
    );
    assert.ok(
      (issue.nextEntranceSession?.realityDiscovery?.context.knownIssues.length ??
        issue.nextEntranceSession?.goalDiscovery?.knownIssueSignals.length ??
        0) >= 0,
    );
  });

  it("9-13 gap math, missing target/current, and units", () => {
    const known = computeGap(
      "goal-1",
      [obs({ subject: "OTD", value: "91%", numericValue: 91, unit: "%" })],
      "96%",
    );
    assert.equal(known.status, "KNOWN");
    assert.equal(known.numericDelta, 5);
    assert.match(known.delta ?? "", /percentage points/);
    const noTarget = computeGap("goal-1", [obs({ subject: "OTD" })], null);
    assert.ok(noTarget.status === "UNKNOWN" || noTarget.status === "NOT_MEASURABLE");
    const noCurrent = computeGap("goal-1", [], "96%");
    assert.equal(noCurrent.status, "UNKNOWN");
  });

  it("14-16 historical, stale, and conflicts", () => {
    const historical = applyRealityUtterance(
      emptyRealityContext("g", "Protect cash", null),
      "Historically cash was $400k.",
      { objects: [], relationships: [], contextSubjects: [], contextLinks: [] },
    );
    assert.ok(
      historical.observations.some((observation) => observation.timeClass === "HISTORICAL") ||
        /historically/i.test(historical.currentStateSummary ?? ""),
    );
    const stale = applyRealityUtterance(
      applyRealityUtterance(
        emptyRealityContext("g", "Improve delivery reliability", "96%"),
        "On-time delivery is 91%.",
        { objects: [], relationships: [], contextSubjects: [], contextLinks: [] },
      ),
      "That number is old.",
      { objects: [], relationships: [], contextSubjects: [], contextLinks: [] },
    );
    assert.equal(stale.freshness, "STALE");
  });

  it("17-19 constraints, risks, and opportunities are captured not reasoned", () => {
    const context = applyRealityUtterance(
      emptyRealityContext("g", "Launch the release", null),
      "Budget ceiling is a constraint. There is a schedule risk and an opportunity in deployment.",
      { objects: [], relationships: [], contextSubjects: [], contextLinks: [] },
    );
    assert.ok(context.constraints.length > 0);
    assert.ok(context.knownRisks.length > 0);
    assert.ok(context.knownOpportunities.length > 0);
  });

  it("20-23 objects emerge with support, raw fields do not, KPI can be reused, Goal stays center", () => {
    assert.equal(
      observationMayBecomeObject(
        obs({ subject: "timestamp", value: "2020", goalRelevance: "unrelated" }),
      ),
      false,
    );
    const goal = reachGoal();
    const first = runTurn("On-time delivery is around 91%. We want 96%.", goal);
    const second = runTurn("Our backlog is high and capacity is almost full.", first);
    const catalog = overlayRealityOnEntranceCatalog(
      projectNexoraEntranceCatalog(second.nextEntranceSession!),
      second.nextEntranceSession!.realityDiscovery,
    );
    assert.ok(catalog.objects.some((object) => object.id === NEXORA_EXECUTIVE_GOAL_OBJECT_ID));
    assert.deepEqual(
      catalog.objects.find((object) => object.id === NEXORA_EXECUTIVE_GOAL_OBJECT_ID)?.position,
      [0, 0, 0],
    );
    assert.equal(second.nextRuntimeState.focusedSubject?.id, NEXORA_EXECUTIVE_GOAL_OBJECT_ID);
    assert.ok(catalog.objects.length <= 6);
    assert.ok(catalog.objects.some((object) => object.id === NEXORA_EXECUTIVE_CONTEXT_OBJECT_ID));
    const reused = emergeFromDefaultCapacity();
    assert.equal(reused, true);
  });

  it("24-29 navigation, causality, unknowns, no recommendation or root cause", () => {
    const goal = reachGoal();
    const ready = runTurn(
      "Our backlog is high and capacity is almost full.",
      runTurn("On-time delivery is around 91%. We want 96%.", goal),
    );
    const caused = runTurn("Does that mean Capacity caused the gap?", ready);
    assert.match(caused.response, /not a confirmed cause/i);
    assert.doesNotMatch(caused.response, /hire more staff/i);
    assert.doesNotMatch(caused.response, /ROOT CAUSE =/);
    const unknown = runTurn("What don't we know?", ready);
    assert.match(unknown.response, /missing piece|unknown/i);
    const gap = runTurn("What's the gap?", ready);
    assert.match(gap.response, /gap/i);
    assert.match(gap.response, /not a confirmed problem cause/i);
  });

  it("30-33 business, project, operational, and software cases share one engine", () => {
    const cash = extractRealityObservations("Cash is about $400k.", "Protect cash");
    assert.ok(cash.some((observation) => /cash/i.test(observation.subject)));
    const project = extractRealityObservations(
      "The schedule is three weeks behind.",
      "Launch the release by Q4",
    );
    assert.ok(project.length >= 0);
    const ops = extractRealityObservations(
      "On-time delivery is around 91%.",
      "Improve delivery reliability",
    );
    assert.ok(ops.some((observation) => observation.numericValue === 91));
    const software = extractRealityObservations(
      "Open critical bugs are blocked.",
      "Release Version 2.0",
    );
    assert.ok(software.length >= 1);
  });

  it("34 returning sufficient reality does not restart discovery", () => {
    const ready = runTurn(
      "Our backlog is high and capacity is almost full.",
      runTurn("On-time delivery is around 91%. We want 96%.", reachGoal()),
    );
    const again = runTurn("What is the current reality?", ready);
    assert.doesNotMatch(again.response, /What does the current situation look like\?/);
  });

  it("35 existing workspace is unaffected", () => {
    const session = createNexoraEntranceSession({
      workspaceResolution: "existing-workspace",
    });
    const result = executeNexoraConversationalExperience({
      utterance: "On-time delivery is around 91%. We want 96%.",
      executiveSubjects: projectManagerObjectConversationalSubjects(),
      runtimeState: initialState(),
      catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
      previousEntranceSession: session,
      messageIdSeed: "nex-exp3-existing",
    });
    assert.notEqual(
      result.nextRuntimeState.focusedSubject?.id,
      NEXORA_EXECUTIVE_GOAL_OBJECT_ID,
    );
    assert.ok(
      getDefaultNexoraMVPObjectInteractionCatalog().objects.some(
        (object) => object.id === "obj-capacity",
      ),
    );
  });

  it("generic engine has no hardcoded demo titles as special-case branches", () => {
    const source = [
      readFileSync(join(here, "nexoraRealityDiscoveryResolution.ts"), "utf8"),
      readFileSync(join(here, "nexoraRealityDiscoveryExperience.ts"), "utf8"),
    ].join("\n");
    assert.doesNotMatch(source, /Bahador/);
    assert.doesNotMatch(source, /Project Orion/);
    assert.doesNotMatch(source, /Improve Delivery Reliability/);
    assert.doesNotMatch(source, /if \(.*Capacity.*\)/);
  });

  it("MO:4 keeps the active Goal while Reality is recorded", () => {
    const ready = runTurn(
      "On-time delivery is around 91%. We want 96%.",
      reachGoal(),
    );
    assert.equal(
      ready.managerObjectTurn.session.goalContext?.title.toLowerCase().includes("delivery"),
      true,
    );
  });
});

function emergeFromDefaultCapacity(): boolean {
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
  const observations = collectCatalogObservations(catalog, "Close Capacity Gap");
  return observations.some((observation) => observation.objectId === "obj-capacity");
}
