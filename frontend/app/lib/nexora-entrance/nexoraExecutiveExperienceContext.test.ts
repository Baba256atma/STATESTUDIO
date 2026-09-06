/**
 * NEX-ENT-FIX3 — Entrance Stage background / Overview isolation.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { projectManagerObjectConversationalSubjects } from "../manager-object/managerObjectCatalog.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  getDefaultNexoraMVPObjectInteractionCatalog,
  resetNexoraMVPObjectInteractionOverview,
  selectNexoraMVPInteractionSubject,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  applyEntranceCenterSubject,
  createNexoraEntranceSession,
  isNexoraEntranceRestrained,
  NEXORA_ENTRANCE_OBJECT_ID,
  projectNexoraEntranceCatalog,
} from "./nexoraEntranceExperience.ts";
import {
  NEXORA_EXECUTIVE_EXPERIENCE_CONTEXT_BOUNDARY,
  resetNexoraExperienceAwareStageOverview,
  resolveExecutiveExperienceContext,
  resolveExperienceAwareAdvisorSubject,
} from "./nexoraExecutiveExperienceContext.ts";
import {
  beginNexoraGuidedEntranceIntroduction,
  withActiveNexoraGuidedEntrance,
} from "./nexoraGuidedEntranceExperience.ts";
import { personalDemoHandoffOf } from "./nexoraPersonalDemoHandoffExperience.ts";
import {
  applyManagerIdentityUtterance,
  emptyManagerIdentityContext,
} from "./nexoraEntranceIdentity.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

function initialState() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function guidedSession() {
  return withActiveNexoraGuidedEntrance(
    createNexoraEntranceSession({ workspaceResolution: "first-time" }),
  );
}

function started() {
  return beginNexoraGuidedEntranceIntroduction(guidedSession(), initialState());
}

function focusedEntrance() {
  const intro = started();
  return {
    session: intro.session,
    state: applyEntranceCenterSubject(initialState(), intro.session),
    catalog: projectNexoraEntranceCatalog(intro.session),
  };
}

function visibleObjectIds(
  state: ReturnType<typeof initialState>,
  catalog: ReturnType<typeof projectNexoraEntranceCatalog>,
  occupancy?: "current-catalog",
) {
  const presentation = deriveNexoraMVPStageInteractionPresentation(
    state,
    catalog,
    {
      consultExecutiveChangeSessionStore: false,
      ...(occupancy ? { overviewOccupancy: occupancy } : {}),
    },
  );
  return presentation.scene.objects
    .filter((object) => object.disclosureState !== "hidden")
    .map((object) => object.id);
}

function run(
  utterance: string,
  previous?: ReturnType<typeof executeNexoraConversationalExperience>,
) {
  const session = previous?.nextEntranceSession ?? guidedSession();
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
    messageIdSeed: `nex-ent-fix3-${utterance}`,
  });
}

describe("NEX-ENT-FIX3 Entrance Stage Overview isolation", () => {
  it("derives GUIDED_ENTRANCE vs EXECUTIVE_WORKSPACE without a writable mode store", () => {
    assert.equal(NEXORA_EXECUTIVE_EXPERIENCE_CONTEXT_BOUNDARY.writableStore, false);
    assert.equal(NEXORA_EXECUTIVE_EXPERIENCE_CONTEXT_BOUNDARY.ownsExperienceState, false);
    assert.equal(NEXORA_EXECUTIVE_EXPERIENCE_CONTEXT_BOUNDARY.conflatesBca, false);
    assert.equal(NEXORA_EXECUTIVE_EXPERIENCE_CONTEXT_BOUNDARY.conflatesFocusOverview, false);
    assert.equal(resolveExecutiveExperienceContext(guidedSession()), "GUIDED_ENTRANCE");
    assert.equal(
      resolveExecutiveExperienceContext(
        createNexoraEntranceSession({ workspaceResolution: "existing-workspace" }),
      ),
      "EXECUTIVE_WORKSPACE",
    );
  });

  it("ENT:1 start catalog is one NEXORA actor", () => {
    const { catalog, state } = focusedEntrance();
    assert.equal(catalog.objects.length, 1);
    assert.equal(catalog.objects[0]?.id, NEXORA_ENTRANCE_OBJECT_ID);
    assert.equal(catalog.objects[0]?.label, "NEXORA");
    assert.equal(state.focusedSubject?.id, NEXORA_ENTRANCE_OBJECT_ID);
    assert.equal(
      catalog.objects.some((entry) => /Capacity Gap|Risk/i.test(entry.label)),
      false,
    );
  });

  it("naive Executive Overview reset hides NEXORA and is the defect chain", () => {
    const { catalog, state } = focusedEntrance();
    const leaked = resetNexoraMVPObjectInteractionOverview(state);
    assert.equal(leaked.mode, "overview");
    assert.equal(leaked.focusedSubject, null);
    const visible = visibleObjectIds(leaked, catalog);
    assert.equal(visible.includes(NEXORA_ENTRANCE_OBJECT_ID), false);
  });

  it("background/Overview during Entrance restores the educational scene", () => {
    const { session, catalog, state } = focusedEntrance();
    const next = resetNexoraExperienceAwareStageOverview({ state, session });
    assert.equal(resolveExecutiveExperienceContext(session), "GUIDED_ENTRANCE");
    assert.equal(next.focusedSubject?.id, NEXORA_ENTRANCE_OBJECT_ID);
    assert.equal(catalog.objects.length, 1);
    assert.equal(
      catalog.objects.some((entry) => entry.label === "Capacity Gap"),
      false,
    );
    assert.equal(
      catalog.objects.some((entry) => entry.label === "Risk"),
      false,
    );
  });

  it("repeated overview resets do not swap catalogs or duplicate actors", () => {
    const { session, state } = focusedEntrance();
    let current = state;
    for (let index = 0; index < 3; index += 1) {
      current = resetNexoraExperienceAwareStageOverview({ state: current, session });
    }
    const catalog = projectNexoraEntranceCatalog(session);
    assert.equal(catalog.objects.length, 1);
    assert.equal(current.focusedSubject?.id, NEXORA_ENTRANCE_OBJECT_ID);
    assert.equal(resolveExecutiveExperienceContext(session), "GUIDED_ENTRANCE");
  });

  it("object select then overview returns to Entrance, not default catalog", () => {
    const { session, catalog, state } = focusedEntrance();
    const selected = selectNexoraMVPInteractionSubject(
      state,
      NEXORA_ENTRANCE_OBJECT_ID,
      catalog,
    );
    const after = resetNexoraExperienceAwareStageOverview({
      state: selected,
      session,
    });
    assert.equal(after.focusedSubject?.id, NEXORA_ENTRANCE_OBJECT_ID);
    assert.equal(projectNexoraEntranceCatalog(session).objects.length, 1);
  });

  it("GUIDED_ENTRANCE overview occupancy keeps the educational actor visible", () => {
    const { catalog, state } = focusedEntrance();
    const leaked = resetNexoraMVPObjectInteractionOverview(state);
    const visible = visibleObjectIds(leaked, catalog, "current-catalog");
    assert.deepEqual(visible, [NEXORA_ENTRANCE_OBJECT_ID]);
  });

  it("Advisor subject during Entrance overview stays educational", () => {
    const center = Object.freeze({
      id: NEXORA_ENTRANCE_OBJECT_ID,
      kind: "object" as const,
      label: "NEXORA",
    });
    const subject = resolveExperienceAwareAdvisorSubject({
      experience: "GUIDED_ENTRANCE",
      focused: null,
      selected: null,
      educationalCenter: center,
    });
    assert.equal(subject?.id, NEXORA_ENTRANCE_OBJECT_ID);
    assert.equal(
      resolveExperienceAwareAdvisorSubject({
        experience: "EXECUTIVE_WORKSPACE",
        focused: null,
        selected: null,
        educationalCenter: center,
      }),
      null,
    );
  });

  it("Focus demonstration then overview does not become Business Overview", () => {
    const shown = run("Show me how focus works", run("Show me"));
    const session = shown.nextEntranceSession!;
    const next = resetNexoraExperienceAwareStageOverview({
      state: shown.nextRuntimeState,
      session,
    });
    assert.equal(resolveExecutiveExperienceContext(session), "GUIDED_ENTRANCE");
    assert.equal(next.focusedSubject?.id, NEXORA_ENTRANCE_OBJECT_ID);
    const catalog = projectNexoraEntranceCatalog(session);
    assert.equal(
      catalog.objects.some((entry) => /Capacity Gap/i.test(entry.label)),
      false,
    );
  });

  it("FIX1/FIX2 continuity still reports the educational Stage", () => {
    let current = run("Show me");
    current = run("What appears here?", current);
    current = run("What appears here?", current);
    const afterOverview = resetNexoraExperienceAwareStageOverview({
      state: current.nextRuntimeState,
      session: current.nextEntranceSession!,
    });
    const asked = executeNexoraConversationalExperience({
      utterance: "What is on the Stage right now?",
      conversationContext: current.nextConversationContext,
      executiveContext: current.nextExecutiveContext,
      executiveSubjects: projectManagerObjectConversationalSubjects(
        projectNexoraEntranceCatalog(current.nextEntranceSession!),
      ),
      runtimeState: afterOverview,
      catalog: projectNexoraEntranceCatalog(current.nextEntranceSession!),
      previousManagerObjectSession: current.managerObjectTurn.session,
      previousEntranceSession: current.nextEntranceSession,
      messageIdSeed: "nex-ent-fix3-stage-now",
    });
    assert.match(asked.nexoraMessage.text, /NEXORA/i);
    assert.doesNotMatch(asked.nexoraMessage.text, /Capacity Gap/);
    assert.doesNotMatch(asked.nexoraMessage.text, /\bRisk\b/);
  });

  it("Skip introduction ends Entrance scene isolation", () => {
    const skipped = run("Skip introduction");
    assert.equal(
      resolveExecutiveExperienceContext(skipped.nextEntranceSession),
      "EXECUTIVE_WORKSPACE",
    );
    const next = resetNexoraExperienceAwareStageOverview({
      state: skipped.nextRuntimeState,
      session: skipped.nextEntranceSession!,
    });
    assert.equal(next.focusedSubject, null);
    assert.equal(next.mode, "overview");
    assert.equal(isNexoraEntranceRestrained(skipped.nextEntranceSession), false);
  });

  it("ENT:10 finished handoff makes Executive workspace authoritative", () => {
    const intro = started();
    const finished = Object.freeze({
      ...intro.session,
      guidedIntroduction: Object.freeze({
        ...intro.session.guidedIntroduction!,
        personalDemoHandoff: Object.freeze({
          ...personalDemoHandoffOf(intro.session),
          state: "COMPLETED" as const,
        }),
      }),
    });
    assert.equal(resolveExecutiveExperienceContext(finished), "EXECUTIVE_WORKSPACE");
    const next = resetNexoraExperienceAwareStageOverview({
      state: applyEntranceCenterSubject(initialState(), intro.session),
      session: finished,
    });
    assert.equal(next.mode, "overview");
    assert.equal(next.focusedSubject, null);
  });

  it("reset re-enters education without deleting stored identity", () => {
    const identity = applyManagerIdentityUtterance(
      emptyManagerIdentityContext(),
      "I'm Dana. I run operations for a logistics company.",
    );
    const reentered = withActiveNexoraGuidedEntrance(
      createNexoraEntranceSession({
        workspaceResolution: "first-time",
        identity,
        educationalReentry: true,
      }),
    );
    assert.equal(resolveExecutiveExperienceContext(reentered), "GUIDED_ENTRANCE");
    assert.ok(reentered.identity.managerName);
    const catalog = projectNexoraEntranceCatalog(reentered);
    assert.equal(
      catalog.objects.some((entry) => /Capacity Gap|Risk/i.test(entry.label)),
      false,
    );
    resetNexoraExperienceAwareStageOverview({
      state: initialState(),
      session: reentered,
    });
    assert.equal(reentered.identity.managerName, identity.managerName);
  });

  it("explicit business request is not stolen by isolation (skip still canonical)", () => {
    const skipped = run("Skip introduction");
    const asked = run("Show my current Goals", skipped);
    assert.equal(
      resolveExecutiveExperienceContext(asked.nextEntranceSession),
      "EXECUTIVE_WORKSPACE",
    );
  });

  it("default catalog still contains MVP fixtures for normal workspace Overview", () => {
    const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
    assert.ok(catalog.objects.some((entry) => entry.label === "Risk"));
    assert.ok(
      catalog.contextSubjects.some((entry) => entry.label === "Capacity Gap"),
    );
    const state = resetNexoraMVPObjectInteractionOverview(initialState());
    assert.equal(state.mode, "overview");
    assert.equal(state.focusedSubject, null);
  });

  it("does not add a second Stage, Director, Advisor, or mode store", () => {
    const source = readFileSync(
      join(HERE, "nexoraExecutiveExperienceContext.ts"),
      "utf8",
    );
    assert.equal(/setExperienceMode|experienceModeStore|nexoraModeStore/.test(source), false);
    assert.equal(/EntranceStage|EducationStage|DemoStage/.test(source), false);
    const shell = readFileSync(
      join(HERE, "../../executive/nex-mvp/NexoraExecutiveShell.tsx"),
      "utf8",
    );
    assert.match(shell, /resetNexoraExperienceAwareStageOverview/);
    assert.match(shell, /data-executive-experience-context/);
    assert.doesNotMatch(shell, /location\.search\.includes\("entrance=1"\)/);
    assert.doesNotMatch(shell, /querySelector\("\[data-nex-ent\]"\)/);
  });
});
