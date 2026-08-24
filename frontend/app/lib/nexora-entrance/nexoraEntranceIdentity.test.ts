/**
 * NEX-EXP:1 — entrance identity, sufficiency, Stage center, and workspace gate.
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
  extractGoalSignals,
  identitySufficiencyOf,
} from "./nexoraEntranceIdentity.ts";
import {
  applyEntranceCenterSubject,
  createNexoraEntranceSession,
  getNexoraEntranceExperienceIdentity,
  isNexoraEntranceRestrained,
  NEXORA_ENTRANCE_BOUNDARY,
  NEXORA_ENTRANCE_OBJECT_ID,
  NEXORA_EXECUTIVE_CONTEXT_OBJECT_ID,
  projectNexoraEntranceCatalog,
  resolveNexoraEntranceTurn,
  verifyNexoraEntranceExperience,
} from "./nexoraEntranceExperience.ts";

const here = dirname(fileURLToPath(import.meta.url));

function initialState() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function firstTimeSession() {
  return createNexoraEntranceSession({ workspaceResolution: "first-time" });
}

function runEntrance(
  utterance: string,
  previous?: ReturnType<typeof executeNexoraConversationalExperience>,
) {
  const session =
    previous?.nextEntranceSession ?? firstTimeSession();
  const catalog = isNexoraEntranceRestrained(session)
    ? projectNexoraEntranceCatalog(session)
    : getDefaultNexoraMVPObjectInteractionCatalog();
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
    messageIdSeed: `nex-exp1-${utterance}`,
  });
}

describe("NEX-EXP:1 Nexora Entrance & Manager Identity", () => {
  it("identity and boundary", () => {
    assert.equal(
      getNexoraEntranceExperienceIdentity().id,
      "NEX-EXP:1/NexoraEntranceManagerIdentityExperience",
    );
    assert.equal(verifyNexoraEntranceExperience().ok, true);
    assert.equal(NEXORA_ENTRANCE_BOUNDARY.createsMo7, false);
    assert.equal(NEXORA_ENTRANCE_BOUNDARY.usesLlm, false);
    assert.equal(NEXORA_ENTRANCE_BOUNDARY.writesStageCoordinates, false);
    assert.equal(NEXORA_ENTRANCE_BOUNDARY.parallelConversationEngine, false);
  });

  it("1 completely new user starts with Nexora at center", () => {
    const session = firstTimeSession();
    const catalog = projectNexoraEntranceCatalog(session);
    const focused = applyEntranceCenterSubject(initialState(), session);
    assert.equal(catalog.objects.length, 1);
    assert.equal(catalog.objects[0]?.id, NEXORA_ENTRANCE_OBJECT_ID);
    assert.deepEqual(catalog.objects[0]?.position, [0, 0, 0]);
    assert.equal(focused.focusedSubject?.id, NEXORA_ENTRANCE_OBJECT_ID);
    assert.equal(catalog.contextSubjects.length, 0);
  });

  it("2 name only remains partial and asks useful work question", () => {
    const next = applyManagerIdentityUtterance(
      emptyManagerIdentityContext(),
      "I'm Maya.",
    );
    assert.equal(next.managerName, "Maya");
    assert.equal(next.sufficiency, "PARTIAL");
    const turn = resolveNexoraEntranceTurn({
      utterance: "I'm Maya.",
      session: firstTimeSession(),
      runtimeState: initialState(),
    });
    assert.match(turn.response, /manage or work on/i);
    assert.doesNotMatch(turn.response, /what is your name/i);
  });

  it("3 company only remains partial", () => {
    const next = applyManagerIdentityUtterance(
      emptyManagerIdentityContext(),
      "I work at Northwind Shipping.",
    );
    assert.equal(next.organizationName, "Northwind Shipping");
    assert.equal(next.sufficiency, "PARTIAL");
  });

  it("4 role plus domain is sufficient", () => {
    const next = applyManagerIdentityUtterance(
      emptyManagerIdentityContext(),
      "My role is operations director. We work in logistics.",
    );
    assert.equal(next.role, "operations director");
    assert.equal(next.domain, "logistics");
    assert.equal(next.domainEpistemic, "KNOWN");
    assert.equal(next.sufficiency, "SUFFICIENT");
  });

  it("5 one sentence can be sufficient", () => {
    const turn = resolveNexoraEntranceTurn({
      utterance: "I'm Sarah. I run operations for a logistics company.",
      session: firstTimeSession(),
      runtimeState: initialState(),
    });
    assert.equal(turn.session.identity.sufficiency, "SUFFICIENT");
    assert.equal(turn.session.identity.managerName, "Sarah");
    assert.equal(turn.centerTransferred, true);
    assert.equal(
      turn.nextRuntimeState.focusedSubject?.id,
      NEXORA_EXECUTIVE_CONTEXT_OBJECT_ID,
    );
    assert.match(turn.response, /trying to achieve/i);
  });

  it("6 identity can accumulate across turns", () => {
    const first = runEntrance("I'm Priya.");
    assert.equal(first.nextEntranceSession?.identity.sufficiency, "PARTIAL");
    const second = runEntrance("I mainly manage delivery and capacity planning.", first);
    const third = runEntrance("We work in manufacturing.", second);
    assert.equal(third.nextEntranceSession?.identity.sufficiency, "SUFFICIENT");
    assert.equal(third.nextEntranceSession?.identity.managerName, "Priya");
  });

  it("7 optional skills may be omitted", () => {
    const next = applyManagerIdentityUtterance(
      emptyManagerIdentityContext(),
      "I'm Sarah. I run operations for a logistics company.",
    );
    assert.equal(next.skills.length, 0);
    assert.equal(next.sufficiency, "SUFFICIENT");
    assert.ok(next.unknowns.includes("skills"));
  });

  it("8 inferred domain is not presented as a known fact", () => {
    const next = applyManagerIdentityUtterance(
      emptyManagerIdentityContext(),
      "I manage construction projects.",
    );
    assert.equal(next.workContext, "construction projects");
    assert.equal(next.domain, "construction");
    assert.equal(next.domainEpistemic, "INFERRED");
    const inferred = next.sourceFacts.find((fact) => fact.field === "domain");
    assert.equal(inferred?.epistemic, "INFERRED");
  });

  it("9 explicit correction outranks inferred domain", () => {
    const inferred = applyManagerIdentityUtterance(
      emptyManagerIdentityContext(),
      "I run operations for a logistics company.",
    );
    assert.equal(inferred.domainEpistemic, "INFERRED");
    const corrected = applyManagerIdentityUtterance(
      inferred,
      "Actually, we're a manufacturing company with our own delivery fleet.",
    );
    assert.equal(corrected.domain, "manufacturing");
    assert.equal(corrected.domainEpistemic, "KNOWN");
  });

  it("10-11 early goal signal is preserved for handoff and not persisted as a Goal", () => {
    const turn = resolveNexoraEntranceTurn({
      utterance:
        "I run operations at Harbor Freight for a logistics company and we're trying to reduce delivery delays.",
      session: firstTimeSession(),
      runtimeState: initialState(),
    });
    assert.ok(
      turn.session.knownGoalSignals.some((signal) =>
        /reduce delivery delays/i.test(signal),
      ),
    );
    assert.equal(
      turn.session.handoff?.knownGoalSignals[0]?.includes("reduce delivery delays"),
      true,
    );
    assert.equal(turn.session.identityObject?.id, NEXORA_EXECUTIVE_CONTEXT_OBJECT_ID);
    assert.doesNotMatch(turn.response, /Close Capacity Gap/);
  });

  it("12 returning sufficient context skips redundant introduction", () => {
    const identity = applyManagerIdentityUtterance(
      emptyManagerIdentityContext(),
      "I'm Sarah. I run operations for a logistics company.",
    );
    const session = createNexoraEntranceSession({
      workspaceResolution: "returning-sufficient",
      identity,
    });
    const turn = resolveNexoraEntranceTurn({
      utterance: "Hi.",
      session,
      runtimeState: initialState(),
    });
    assert.doesNotMatch(turn.response, /Before we work on decisions/i);
    assert.doesNotMatch(turn.response, /Welcome back, Operations Director/i);
    assert.match(turn.response, /enough executive context/i);
  });

  it("13 existing workspace is not replaced", () => {
    const session = createNexoraEntranceSession({
      workspaceResolution: "existing-workspace",
    });
    assert.equal(isNexoraEntranceRestrained(session), false);
    const result = executeNexoraConversationalExperience({
      utterance: "Hi.",
      executiveSubjects: projectManagerObjectConversationalSubjects(),
      runtimeState: initialState(),
      catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
      previousEntranceSession: session,
      messageIdSeed: "nex-exp1-existing-hi",
    });
    assert.match(result.response, /Hi\. I’m ready/);
    assert.equal(
      getDefaultNexoraMVPObjectInteractionCatalog().objects.some(
        (object) => object.id === "obj-capacity",
      ),
      true,
    );
  });

  it("14 unknown fields remain unknown and 15 no fake identity facts", () => {
    const next = applyManagerIdentityUtterance(
      emptyManagerIdentityContext(),
      "I'm Maya.",
    );
    assert.equal(next.organizationName, null);
    assert.equal(next.role, null);
    assert.equal(next.domain, null);
    assert.ok(next.unknowns.includes("role"));
    assert.doesNotMatch(JSON.stringify(next), /experienced finance leader/i);
  });

  it("16 does not collect unnecessary personal data", () => {
    const source = readFileSync(join(here, "nexoraEntranceExperience.ts"), "utf8");
    assert.doesNotMatch(source, /home address|date of birth|family information/i);
    const turn = resolveNexoraEntranceTurn({
      utterance: "My home address is 12 Main Street.",
      session: firstTimeSession(),
      runtimeState: initialState(),
    });
    assert.match(turn.response, /not personal details/i);
    assert.equal(turn.session.identity.managerName, null);
  });

  it("personal identity, executive context, and current work stay separate", () => {
    const next = applyManagerIdentityUtterance(
      emptyManagerIdentityContext(),
      "I'm Sarah. I run operations for a logistics company.",
    );
    assert.equal(next.personal.managerName, "Sarah");
    assert.equal(next.currentWork.workContext?.includes("operations"), true);
    assert.notEqual(
      `${next.personal.managerName}|${next.executive.displayName}|${next.currentWork.workContext}`,
      next.personal.managerName,
    );
  });

  it("does not re-ask known name after it is established", () => {
    const first = runEntrance("I'm Maya.");
    const second = runEntrance("I mainly manage delivery.", first);
    assert.doesNotMatch(second.response, /who am i working with/i);
    assert.doesNotMatch(second.response, /what is your name/i);
  });

  it("first-time greet uses entrance intro rather than Hi I'm ready", () => {
    const result = runEntrance("Hi.");
    assert.match(result.response, /I’m Nexora/);
    assert.doesNotMatch(result.response, /Hi\. I’m ready/);
  });

  it("goal extract helper is generic", () => {
    const signals = extractGoalSignals("We're trying to reduce overtime.");
    assert.deepEqual([...signals], ["reduce overtime"]);
  });

  it("generic engine has no hardcoded manager/company names", () => {
    const identity = readFileSync(join(here, "nexoraEntranceIdentity.ts"), "utf8");
    const experience = readFileSync(
      join(here, "nexoraEntranceExperience.ts"),
      "utf8",
    );
    for (const source of [identity, experience]) {
      assert.doesNotMatch(source, /Bahador/);
      assert.doesNotMatch(source, /Acme Logistics/);
      assert.doesNotMatch(source, /Operations Director/);
    }
  });

  it("Stage transition uses select authority and keeps z = 0 topology", () => {
    const session = firstTimeSession();
    const before = applyEntranceCenterSubject(initialState(), session);
    assert.equal(before.focusedSubject?.id, NEXORA_ENTRANCE_OBJECT_ID);
    const after = resolveNexoraEntranceTurn({
      utterance: "I'm Sarah. I run operations for a logistics company.",
      session,
      runtimeState: before,
    });
    assert.equal(after.centerTransferred, true);
    assert.equal(
      after.nextRuntimeState.focusedSubject?.id,
      NEXORA_EXECUTIVE_CONTEXT_OBJECT_ID,
    );
    const catalog = projectNexoraEntranceCatalog(after.session);
    assert.equal(catalog.objects.length, 1);
    assert.equal(catalog.objects[0]?.position[2], 0);
    assert.ok(!catalog.objects.some((object) => object.id === "obj-capacity"));
    assert.ok(!catalog.objects.some((object) => object.id === NEXORA_ENTRANCE_OBJECT_ID));
  });

  it("sufficiency helper matches WHO + work + domain", () => {
    assert.equal(
      identitySufficiencyOf({
        managerName: "Maya",
        organizationName: null,
        role: null,
        responsibilities: [],
        domain: null,
        workContext: null,
        contextKind: null,
      }),
      "PARTIAL",
    );
  });
});
