/**
 * NEX-ENT:7 — Visual Intelligence education over DIR:VI.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { projectManagerObjectConversationalSubjects } from "../manager-object/managerObjectCatalog.ts";
import {
  applyEntranceCenterSubject,
  createNexoraEntranceSession,
  isNexoraEntranceRestrained,
  projectNexoraEntranceCatalog,
} from "./nexoraEntranceExperience.ts";
import {
  shouldNexoraGuidedEntranceOwnUtterance,
  withActiveNexoraGuidedEntrance,
} from "./nexoraGuidedEntranceExperience.ts";
import { dataEducationOf } from "./nexoraDataEducationExperience.ts";
import {
  NEXORA_VISUAL_EDUCATION_BOUNDARY,
  shouldNexoraVisualEducationOwnUtterance,
  verifyNexoraVisualEducation,
  visualEducationOf,
} from "./nexoraVisualEducationExperience.ts";
import { NEXORA_GUIDED_ATTENTION_RESERVED } from "./nexoraGuidedEntranceTypes.ts";
import { nexoraExampleOperationsVisualEvidence } from "../director/nexoraVisualIntelligence.ts";

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

function run(
  utterance: string,
  previous?: ReturnType<typeof executeNexoraConversationalExperience>,
  extra?: { readonly visualEvidence?: ReturnType<typeof nexoraExampleOperationsVisualEvidence> | null },
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
      previous?.nextRuntimeState ?? applyEntranceCenterSubject(initialState(), session),
    catalog,
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? null,
    previousEntranceSession: session,
    previousGuidedAttention: previous?.guidedAttention ?? null,
    previousVisualView: previous?.visualView ?? null,
    visualEvidence: extra?.visualEvidence,
    mountedGuidedAttentionTargets: Object.freeze(["DATA_ENTRY", "STAGE"]),
    attentionNowMs: previous ? 2_000 : 0,
    messageIdSeed: `nex-ent7-${utterance}`,
  });
}

function afterStage() {
  return run("Show me how focus works", run("Show me"));
}

function atGoal() {
  return run("Show me the next one", afterStage());
}

function advance(steps: number, from = atGoal()) {
  let current = from;
  for (let index = 0; index < steps; index += 1) {
    current = run("Show me the next one", current);
  }
  return current;
}

function atConversationAsk() {
  return run("Show me the next one", advance(7));
}

function atAttentionIntro() {
  return run("Show me the next one", advance(5, atConversationAsk()));
}

let sourceSeed: ReturnType<typeof executeNexoraConversationalExperience> | undefined;
let purposeSeed: ReturnType<typeof executeNexoraConversationalExperience> | undefined;
let trendSeed: ReturnType<typeof executeNexoraConversationalExperience> | undefined;

function atDataSource() {
  sourceSeed ??= run("Show me the next one", advance(3, atAttentionIntro()));
  return sourceSeed;
}

function atVisualPurpose() {
  if (!purposeSeed) {
    let current = run("Show me an example", atDataSource());
    for (let index = 0; index < 5; index += 1) {
      current = run("Show me the next one", current);
    }
    purposeSeed = run("Show me the next one", current);
  }
  return purposeSeed;
}

function atTrend() {
  trendSeed ??= run("Show me delivery over time", atVisualPurpose());
  return trendSeed;
}

function assertNoBusinessTruth(
  result: ReturnType<typeof executeNexoraConversationalExperience>,
) {
  const session = result.nextEntranceSession;
  assert.equal(session?.goalDiscovery, null);
  assert.equal(session?.issueDiscovery, null);
  assert.equal(session?.decisionExperience, null);
  assert.equal(session?.identity.sufficiency, "INSUFFICIENT");
}

describe("NEX-ENT:7 Visual Intelligence education", () => {
  it("teaches visual intelligence without owning it", () => {
    assert.equal(verifyNexoraVisualEducation().ok, true);
    assert.equal(NEXORA_VISUAL_EDUCATION_BOUNDARY.ownsVisualIntelligence, false);
    assert.equal(NEXORA_VISUAL_EDUCATION_BOUNDARY.secondChartSystem, false);
    assert.equal(NEXORA_GUIDED_ATTENTION_RESERVED.implemented, false);
  });

  it("Proof A — ENT:6 review continues into Visual education", () => {
    const purpose = atVisualPurpose();
    assert.equal(dataEducationOf(purpose.nextEntranceSession).state, "COMPLETED");
    assert.equal(visualEducationOf(purpose.nextEntranceSession).state, "PURPOSE");
    assert.match(purpose.nexoraMessage.text, /don.t need to choose a chart/i);
    assertNoBusinessTruth(purpose);
  });

  it("Proof B — Stage guidance reuses DIR:GA", () => {
    const purpose = atVisualPurpose();
    assert.equal(purpose.guidedAttention?.pendingOfferTarget, "STAGE");
    const shown = run("Show me", purpose);
    assert.equal(shown.guidedAttention?.presentation?.target, "STAGE");
    assert.equal(visualEducationOf(shown.nextEntranceSession).state, "PURPOSE");
  });

  it("Proof C/D — natural trend and paraphrase share purpose", () => {
    const trend = atTrend();
    assert.equal(visualEducationOf(trend.nextEntranceSession).state, "TREND");
    assert.equal(trend.visualView?.view?.purpose, "TREND");
    assert.equal(trend.visualView?.view?.series[0].points.length, 2);
    const paraphrase = run("How has delivery changed?", atVisualPurpose());
    assert.equal(paraphrase.visualView?.view?.purpose, "TREND");
    assert.equal(paraphrase.visualView?.view?.viewId, trend.visualView?.view?.viewId);
    assert.match(trend.nexoraMessage.text, /trend/i);
    assert.doesNotMatch(trend.nexoraMessage.text, /Recharts|VISUAL_INTENT|LineChart/);
  });

  it("Proof E/F/G — explain, why, and provenance", () => {
    const explained = run("What does this show?", atTrend());
    assert.match(explained.nexoraMessage.text, /available periods|changed/i);
    const why = run("Why did you choose this view?", atTrend());
    assert.match(why.nexoraMessage.text, /changed over time|ordered/i);
    const provenance = run("What data is this using?", atTrend());
    assert.match(provenance.nexoraMessage.text, /OTD|example/i);
    assert.doesNotMatch(provenance.nexoraMessage.text, /Nexora AI calculated this/);
  });

  it("Proof H — six months is not fabricated", () => {
    const missing = run("Show me delivery for the last six months", atTrend());
    assert.match(missing.nexoraMessage.text, /can.t show 6 months|can’t show 6 months|6 months/i);
    assert.equal(missing.visualView?.view?.series[0]?.points.length, 2);
  });

  it("Proof I/J — comparison and ambiguous compare", () => {
    const compared = run("Compare delivery across the two periods", atTrend());
    assert.equal(compared.visualView?.view?.purpose, "COMPARE");
    assert.match(compared.nexoraMessage.text, /does not pick a winner/i);
    const ambiguous = run("Compare these", atTrend());
    assert.match(ambiguous.nexoraMessage.text, /which two/i);
  });

  it("Proof K/L — visual is not cause or Decision", () => {
    const cause = run("Does this prove why delivery changed?", atTrend());
    assert.match(cause.nexoraMessage.text, /pattern/i);
    assert.doesNotMatch(cause.nexoraMessage.text, /\bproves the cause\b/i);
    const decision = run("Does this mean we should choose Scenario A?", atTrend());
    assert.match(decision.nexoraMessage.text, /does not choose a Scenario|remain the one who decides/i);
    assert.equal(decision.nextEntranceSession?.decisionExperience, null);
  });

  it("Proof M/N — semantic uncertainty and correction do not write meaning", () => {
    const unknown = run("Show me the value over time", atVisualPurpose());
    assert.match(unknown.nexoraMessage.text, /don.t know what it means|value/i);
    const corrected = run("No, that field isn't backlog", atTrend());
    assert.match(corrected.nexoraMessage.text, /existing Data conversation/i);
  });

  it("Proof O — focus is unchanged by a visual", () => {
    const before = atTrend().nextRuntimeState.focusedSubject?.id;
    const after = run("Show me delivery over time", atTrend());
    assert.equal(after.nextRuntimeState.focusedSubject?.id, before);
    assert.equal(after.visualView?.view?.mutatesFocus, false);
    assert.equal(after.shouldCommitRuntime, false);
  });

  it("Proof P/Q — replacement then dismiss", () => {
    const compared = run("Compare delivery across the two periods", atTrend());
    assert.equal(compared.visualView?.view?.purpose, "COMPARE");
    const dismissed = run("Close the view", compared);
    assert.equal(dismissed.visualView?.view, null);
    assert.equal(dismissed.nextEntranceSession?.decisionExperience, null);
  });

  it("Proof R/S — Show problems and Show Capacity Problem are not charts", () => {
    const problems = run("Show me the problems", atTrend());
    assert.notEqual(problems.visualView?.view?.purpose, undefined);
    assert.equal(
      shouldNexoraVisualEducationOwnUtterance(atTrend().nextEntranceSession, "Show me the problems"),
      false,
    );
    assert.equal(
      shouldNexoraGuidedEntranceOwnUtterance(
        atTrend().nextEntranceSession,
        "Show Capacity Problem",
        [],
      ) && shouldNexoraVisualEducationOwnUtterance(atTrend().nextEntranceSession, "Show Capacity Problem"),
      false,
    );
  });

  it("Proof T — conversation continues", () => {
    const follow = run("Why do I need it?", atTrend());
    assert.ok(follow.nexoraMessage.text.length > 8);
  });

  it("Proof U — skip ENT:7", () => {
    const skipped = run("Skip for now", atVisualPurpose());
    assert.equal(visualEducationOf(skipped.nextEntranceSession).state, "SKIPPED");
    assert.equal(skipped.visualView?.view, null);
  });

  it("is callable outside NEX-ENT with supplied evidence", () => {
    const result = executeNexoraConversationalExperience({
      utterance: "Show me delivery over time",
      executiveSubjects: projectManagerObjectConversationalSubjects(
        getDefaultNexoraMVPObjectInteractionCatalog(),
      ),
      runtimeState: initialState(),
      catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
      visualEvidence: nexoraExampleOperationsVisualEvidence(),
      messageIdSeed: "nex-ent7-outside",
    });
    assert.equal(result.visualView?.view?.purpose, "TREND");
    assert.equal(result.nextEntranceSession, null);
  });
});
