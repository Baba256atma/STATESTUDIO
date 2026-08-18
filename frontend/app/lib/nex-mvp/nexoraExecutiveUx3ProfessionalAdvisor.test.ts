/**
 * UX:3 — Professional Advisor invariants A–J.
 *
 * Presentation composition only. Does not create a new intelligence engine
 * and does not implement conversational chat.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { NexoraAdvisorInsightRegion } from "../../executive/nex-mvp/NexoraAdvisorInsightRegion.tsx";
import { NexoraAdvisorView } from "../../executive/nex-mvp/intelligence/NexoraAdvisorView.tsx";
import { NexoraExecutiveShell } from "../../executive/nex-mvp/NexoraExecutiveShell.tsx";
import { applyDataRealityAwareAdvisorBindingToAdvisorViewModel } from "./nexoraMVPDataRealityAwareAdvisorExperience.ts";
import { resolveNexoraMVPDataRealityAwareAdvisorExperience } from "./nexoraMVPDataRealityAwareAdvisorExperience.ts";
import { resolveNexoraMVPDataRealityAwareStageExperience } from "./nexoraMVPDataRealityAwareStageExperience.ts";
import {
  deriveNexoraMVPExecutiveIntelligenceContext,
  resolveNexoraMVPExecutiveIntelligence,
} from "./nexoraMVPExecutiveIntelligence.ts";
import {
  composeNexoraProfessionalAdvisorPresentation,
  NEXORA_MVP_PROFESSIONAL_ADVISOR_BOUNDARY,
  professionalAdvisorHasDuplicateRecommendation,
  translateExecutiveEvidenceState,
} from "./nexoraMVPProfessionalAdvisorPresentation.ts";
import {
  buildNexoraMVPAdvisorContextBridge,
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  selectNexoraMVPInteractionSubject,
  syncNexoraMVPObjectInteractionShellContext,
  type NexoraMVPObjectInteractionState,
} from "./nexoraMVPObjectInteraction.ts";
import { deriveNexoraMVPPresentationViewModel } from "./nexoraMVPPresentationState.ts";
import {
  EXECUTIVE_STAGE_2D_CENTER,
} from "../spatial-presentation/executiveStage2DFixedCamera.ts";
import { applyExecutiveFocusVisualGrammarToStagePresentation } from "./nexoraMVPExecutiveFocusVisualGrammar.ts";
import { applyExecutiveNetworkTopologyToStagePresentation } from "./nexoraMVPExecutiveNetworkTopology.ts";
import { applyExecutivePresentationPlaneToStagePresentation } from "./nexoraMVPExecutivePresentationPlane.ts";
import { applyExecutiveStage2DTopologyPlaneToStagePresentation } from "./nexoraMVPExecutiveStage2DTopologyPlane.ts";
import { applyExecutiveStage2DTopologyRecompositionToStagePresentation } from "./nexoraMVPExecutiveStage2DTopologyRecomposition.ts";
import { applyExecutiveStageFixedCameraToStagePresentation } from "./nexoraMVPExecutiveStage2DFixedCamera.ts";

const here = dirname(fileURLToPath(import.meta.url));

function selectSubject(
  state: NexoraMVPObjectInteractionState,
  subjectId: string | null,
): NexoraMVPObjectInteractionState {
  const next = selectNexoraMVPInteractionSubject(state, subjectId);
  return syncNexoraMVPObjectInteractionShellContext(next, {
    workspace: next.workspace,
    presentationState: "minimum",
    environmentIntent: next.environmentIntent,
  });
}

function pipeline(subjectId: string | null) {
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  if (subjectId != null) {
    state = selectSubject(state, subjectId);
  }
  const base = deriveNexoraMVPStageInteractionPresentation(state);
  const withGrammar = applyExecutiveFocusVisualGrammarToStagePresentation(base, {
    presentationDepth: "minimum",
  });
  const withNetwork =
    applyExecutiveNetworkTopologyToStagePresentation(withGrammar);
  const withPlane =
    applyExecutivePresentationPlaneToStagePresentation(withNetwork);
  const withFlat =
    applyExecutiveStage2DTopologyPlaneToStagePresentation(withPlane);
  const withRecomposition =
    applyExecutiveStage2DTopologyRecompositionToStagePresentation(withFlat);
  const presentation =
    applyExecutiveStageFixedCameraToStagePresentation(withRecomposition);
  const advisorBridge = buildNexoraMVPAdvisorContextBridge(state, presentation);
  const presentationViewModel = deriveNexoraMVPPresentationViewModel({
    presentationState: state.presentationState,
    workspace: state.workspace,
    environmentIntent: state.environmentIntent,
    subjectId: state.focusedSubject?.id ?? null,
    subjectKind: state.focusedSubject?.kind ?? null,
    subjectLabel: state.focusedSubject?.label ?? null,
  });
  const intelligenceContext = deriveNexoraMVPExecutiveIntelligenceContext({
    advisorBridge,
    presentationViewModel,
    focusedSubject: state.focusedSubject,
    selectedSubject: state.selectedSubject,
    breadcrumb: advisorBridge.breadcrumb,
  });
  const resolution = resolveNexoraMVPExecutiveIntelligence(intelligenceContext);
  const narrative = composeNexoraProfessionalAdvisorPresentation({
    advisor: resolution.advisor,
    insight: resolution.insight,
    intelligence: intelligenceContext,
    advisorBridge,
    nextBestAction: advisorBridge.nextBestAction,
    decisionBrief: advisorBridge.decisionBrief,
    decisionMemory: advisorBridge.decisionMemory,
  });
  return {
    state,
    presentation,
    advisorBridge,
    presentationViewModel,
    intelligenceContext,
    resolution,
    narrative,
  };
}

function renderAdvisor(subjectId: string | null) {
  const pack = pipeline(subjectId);
  const html = renderToStaticMarkup(
    React.createElement(NexoraAdvisorInsightRegion, {
      tab: "Assist",
      onTabChange: () => undefined,
      advisorBridge: pack.advisorBridge,
      presentationViewModel: pack.presentationViewModel,
      focusedSubject: pack.state.focusedSubject,
      selectedSubject: pack.state.selectedSubject,
      onIntelligenceAction: () => undefined,
    }),
  );
  return { ...pack, html };
}

test("UX:3 boundary does not own intelligence or chat", () => {
  assert.equal(NEXORA_MVP_PROFESSIONAL_ADVISOR_BOUNDARY.ownsAdvisorReasoning, false);
  assert.equal(NEXORA_MVP_PROFESSIONAL_ADVISOR_BOUNDARY.inventsRecommendations, false);
  assert.equal(
    NEXORA_MVP_PROFESSIONAL_ADVISOR_BOUNDARY.introducesConversationalReplies,
    false,
  );
  assert.equal(NEXORA_MVP_PROFESSIONAL_ADVISOR_BOUNDARY.changesStageFocus, false);
});

test("A — explicit Stage subject === Advisor subject", () => {
  for (const id of [
    "obj-customer",
    "obj-capacity",
    "obj-revenue",
    "obj-risk",
    "ctx-problem-capacity",
    "ctx-scenario-capacity",
    "ctx-decision-capacity",
    "ctx-execution-capacity",
  ]) {
    const { state, advisorBridge, narrative } = pipeline(id);
    assert.equal(state.focusedSubject?.id, id);
    assert.equal(advisorBridge.advisorSubjectId, id);
    assert.equal(narrative.currentSubjectId, id);
  }
});

test("B — Overview is not presented as the attention subject", () => {
  const { state, advisorBridge, narrative, html } = renderAdvisor(null);
  assert.equal(state.focusedSubject, null);
  assert.equal(advisorBridge.advisorSubjectId, null);
  assert.equal(narrative.isOverview, true);
  assert.equal(narrative.currentSubjectId, null);
  assert.notEqual(
    narrative.currentSubjectId,
    narrative.attentionSubjectId ?? "sentinel",
  );
  assert.match(html, /Executive Overview/);
  assert.match(html, /data-advisor-current-subject="none"/);
  if (narrative.attentionSubjectLabel) {
    assert.match(html, /Needs Attention/);
    assert.doesNotMatch(
      html,
      /data-testid="nexora-advisor-view-subject"[^>]*>\s*Capacity/,
    );
  }

  const experience = resolveNexoraMVPDataRealityAwareStageExperience({
    datasetScenario: "operational-pressure",
    presentationState: "minimum",
    currentWorkspace: "overview",
  });
  const { advisorBinding } = resolveNexoraMVPDataRealityAwareAdvisorExperience({
    runtimeState: experience.runtimeState,
    presentationState: "minimum",
    workspace: "overview",
  });
  const overlaid = applyDataRealityAwareAdvisorBindingToAdvisorViewModel(
    pipeline(null).resolution.advisor,
    advisorBinding,
  );
  assert.equal(overlaid.subjectId, null);
  assert.equal(overlaid.subjectLabel, null);
});

test("C — displayed recommendation originates from existing authority", () => {
  const { narrative, advisorBridge } = pipeline("obj-capacity");
  if (narrative.recommendation != null) {
    assert.notEqual(narrative.recommendationAuthority, "none");
    assert.ok(
      ["nba", "decision-brief", "data-reality", "advisor-intelligence"].includes(
        narrative.recommendationAuthority,
      ),
    );
    if (narrative.recommendationAuthority === "nba") {
      assert.ok(advisorBridge.nextBestAction?.recommendedAction);
    }
  }
});

test("D — missing recommendation produces a professional empty state", () => {
  const { html, narrative } = renderAdvisor("obj-customer");
  if (narrative.recommendation == null) {
    assert.match(html, /No recommendation yet|Evidence limited|No recommended action/);
    assert.doesNotMatch(html, /Nexora recommends you immediately/);
    assert.doesNotMatch(html, /fabricated/i);
  }
});

test("E — at most one action is visually designated primary", () => {
  const { html } = renderAdvisor("obj-capacity");
  const primary = html.match(/data-advisor-action-priority="primary"/g) ?? [];
  assert.ok(primary.length <= 1);
});

test("F — evidence presentation derives from existing validation state", () => {
  const limited = translateExecutiveEvidenceState({
    warning:
      "Certified data is currently insufficient to establish an executive performance state for Cost.",
  });
  assert.equal(limited.state, "limited");
  assert.match(limited.summary ?? "", /Evidence limited/);
  assert.doesNotMatch(limited.summary ?? "", /Certified data is currently insufficient/);

  const strong = translateExecutiveEvidenceState({
    hasData: true,
    hasKpi: true,
  });
  assert.equal(strong.state, "strong");

  const { narrative } = pipeline("obj-capacity");
  assert.ok(
    ["strong", "limited", "incomplete", "stale", "none"].includes(
      narrative.evidenceState,
    ),
  );
});

test("G — the same canonical recommendation is not rendered as competing sections", () => {
  const { html, narrative } = renderAdvisor("obj-capacity");
  const recommendationBlocks =
    html.match(/data-testid="nexora-advisor-recommendation"/g) ?? [];
  assert.ok(recommendationBlocks.length <= 1);
  assert.doesNotMatch(html, /data-testid="nexora-executive-nba"/);
  assert.equal(professionalAdvisorHasDuplicateRecommendation(narrative), false);
});

test("H — subject-kind grammar renders valid contextual Advisor structures", () => {
  const cases: ReadonlyArray<readonly [string, string]> = [
    ["obj-capacity", "object"],
    ["ctx-problem-capacity", "problem"],
    ["ctx-scenario-capacity", "scenario"],
    ["ctx-decision-capacity", "decision"],
    ["ctx-execution-capacity", "execution"],
    ["obj-risk", "risk"],
  ];
  for (const [id, grammar] of cases) {
    const { narrative, html } = renderAdvisor(id);
    assert.equal(narrative.grammarKind, grammar);
    assert.match(html, /data-advisor-grammar="/);
    assert.ok(narrative.situation);
    assert.match(html, /data-testid="nexora-advisor-situation"/);
  }
  const overview = pipeline(null).narrative;
  assert.equal(overview.grammarKind, "overview");
});

test("I — UX:2 center / fixed-camera / z=0 invariants remain intact", () => {
  const { presentation } = pipeline("obj-capacity");
  const anchor = presentation.scene.objects.find((object) => object.focused);
  assert.ok(anchor);
  assert.equal(anchor!.targetPosition[0], EXECUTIVE_STAGE_2D_CENTER.x);
  assert.equal(anchor!.targetPosition[1], EXECUTIVE_STAGE_2D_CENTER.y);
  assert.equal(anchor!.targetPosition[2], 0);
  assert.ok(
    presentation.scene.objects.every((object) => object.targetPosition[2] === 0),
  );
});

test("J — UX:3 does not introduce fake conversational responses", () => {
  const files = [
    "nexoraMVPProfessionalAdvisorPresentation.ts",
    join(here, "../../executive/nex-mvp/intelligence/NexoraAdvisorView.tsx"),
    join(here, "../../executive/nex-mvp/NexoraAdvisorInsightRegion.tsx"),
  ];
  for (const file of files) {
    const source = readFileSync(
      file.startsWith("/") ? file : join(here, file),
      "utf8",
    );
    assert.doesNotMatch(source, /Hello,? I am Nexora/i);
    assert.doesNotMatch(source, /fake (llm|chat|response)/i);
    assert.doesNotMatch(source, /onSubmitUtterance\([^)]*["']Hi["']/);
  }
  const html = renderToStaticMarkup(React.createElement(NexoraExecutiveShell));
  assert.match(html, /data-testid="nexora-conversational-input"/);
  assert.doesNotMatch(html, /data-message-status="assistant-fabricated"/);
});

test("UX:3 Advisor view keeps Stage subject copy in the subject header", () => {
  const html = renderToStaticMarkup(
    React.createElement(NexoraAdvisorView, {
      viewModel: pipeline("obj-capacity").resolution.advisor,
      narrative: pipeline("obj-capacity").narrative,
      onAction: () => undefined,
    }),
  );
  assert.match(html, /data-testid="nexora-advisor-view-subject"/);
  assert.match(html, /Capacity/);
  assert.match(html, /data-ux3="professional-advisor"/);
});
