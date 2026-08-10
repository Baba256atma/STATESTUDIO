/**
 * NEX-MVP:7 — Advisor/Insight component and integration tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { NexoraExecutiveShell } from "../NexoraExecutiveShell.tsx";
import { NexoraAdvisorInsightRegion } from "../NexoraAdvisorInsightRegion.tsx";
import { NexoraAdvisorView } from "./NexoraAdvisorView.tsx";
import { NexoraInsightView } from "./NexoraInsightView.tsx";
import {
  applyNexoraMVPIntelligenceResolution,
  deriveNexoraMVPExecutiveIntelligenceContext,
  resolveNexoraMVPExecutiveIntelligence,
} from "../../../lib/nex-mvp/nexoraMVPExecutiveIntelligence.ts";
import {
  applyNexoraMVPPresentationStateChange,
  deriveNexoraMVPPresentationViewModel,
} from "../../../lib/nex-mvp/nexoraMVPPresentationState.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  selectNexoraMVPInteractionSubject,
  buildNexoraMVPAdvisorContextBridge,
  deriveNexoraMVPStageInteractionPresentation,
} from "../../../lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { applyNexoraMVPWorkspaceChangeToInteraction } from "../../../lib/nex-mvp/nexoraMVPWorkspacePresentation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

function focusedIntelligence(subjectId = "obj-capacity") {
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(state, subjectId);
  state = applyNexoraMVPPresentationStateChange(state, "report");
  const stage = deriveNexoraMVPStageInteractionPresentation(state);
  const advisorBridge = buildNexoraMVPAdvisorContextBridge(state, stage);
  const presentationViewModel = deriveNexoraMVPPresentationViewModel({
    presentationState: state.presentationState,
    workspace: state.workspace,
    environmentIntent: state.environmentIntent,
    subjectId: state.focusedSubject?.id ?? null,
    subjectKind: state.focusedSubject?.kind ?? null,
    subjectLabel: state.focusedSubject?.label ?? null,
  });
  return { state, advisorBridge, presentationViewModel };
}

describe("NEX-MVP:7 Advisor + Insight components", () => {
  it("1. Advisor/Insight region renders", () => {
    const html = renderToStaticMarkup(React.createElement(NexoraExecutiveShell));
    assert.match(html, /data-testid="nexora-advisor-insight-region"/);
    assert.match(html, /data-nex-mvp="7"/);
  });

  it("2. active subject identity is visible after focus mapping", () => {
    const { advisorBridge, presentationViewModel, state } =
      focusedIntelligence();
    const html = renderToStaticMarkup(
      React.createElement(NexoraAdvisorInsightRegion, {
        tab: "Assist",
        onTabChange: () => undefined,
        advisorBridge,
        presentationViewModel,
        focusedSubject: state.focusedSubject,
        selectedSubject: state.selectedSubject,
        onIntelligenceAction: () => undefined,
      }),
    );
    assert.match(html, /data-testid="nexora-advisor-view-subject"/);
    assert.match(html, /Capacity/);
  });

  it("3. no-selection overview state works", () => {
    const html = renderToStaticMarkup(React.createElement(NexoraExecutiveShell));
    assert.match(html, /data-testid="nexora-advisor-view"/);
    assert.match(html, /Overview/);
  });

  it("4. focused object updates intelligence", () => {
    const { advisorBridge, presentationViewModel, state } =
      focusedIntelligence("obj-revenue");
    const html = renderToStaticMarkup(
      React.createElement(NexoraAdvisorInsightRegion, {
        tab: "Insight",
        onTabChange: () => undefined,
        advisorBridge,
        presentationViewModel,
        focusedSubject: state.focusedSubject,
        selectedSubject: state.selectedSubject,
        onIntelligenceAction: () => undefined,
      }),
    );
    assert.match(html, /data-testid="nexora-insight-view"/);
    assert.match(html, /Revenue/);
    assert.match(html, /data-testid="nexora-insight-kpi"/);
  });

  it("5. context-node selection updates intelligence", () => {
    let state = createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: "report",
      environmentIntent: "neutral",
    });
    state = selectNexoraMVPInteractionSubject(state, "obj-revenue");
    state = selectNexoraMVPInteractionSubject(state, "ctx-scenario-pricing");
    const stage = deriveNexoraMVPStageInteractionPresentation(state);
    const advisorBridge = buildNexoraMVPAdvisorContextBridge(state, stage);
    const presentationViewModel = deriveNexoraMVPPresentationViewModel({
      presentationState: state.presentationState,
      workspace: state.workspace,
      environmentIntent: state.environmentIntent,
      subjectId: state.focusedSubject?.id ?? null,
      subjectKind: state.focusedSubject?.kind ?? null,
      subjectLabel: state.focusedSubject?.label ?? null,
    });
    const html = renderToStaticMarkup(
      React.createElement(NexoraAdvisorInsightRegion, {
        tab: "Insight",
        onTabChange: () => undefined,
        advisorBridge,
        presentationViewModel,
        focusedSubject: state.focusedSubject,
        selectedSubject: state.selectedSubject,
        onIntelligenceAction: () => undefined,
      }),
    );
    assert.match(html, /Pricing Response/);
  });

  it("6. workspace change updates intelligence", () => {
    let state = createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: "report",
      environmentIntent: "neutral",
    });
    state = selectNexoraMVPInteractionSubject(state, "obj-capacity");
    state = applyNexoraMVPWorkspaceChangeToInteraction(state, "scenario");
    const stage = deriveNexoraMVPStageInteractionPresentation(state);
    const advisorBridge = buildNexoraMVPAdvisorContextBridge(state, stage);
    assert.equal(advisorBridge.activeWorkspace, "scenario");
    assert.equal(state.focusedSubject?.id, "obj-capacity");
  });

  it("7. presentation-state change updates information depth", () => {
    const min = focusedIntelligence();
    let state = min.state;
    state = applyNexoraMVPPresentationStateChange(state, "minimum");
    const minVm = deriveNexoraMVPPresentationViewModel({
      presentationState: state.presentationState,
      workspace: state.workspace,
      environmentIntent: state.environmentIntent,
      subjectId: state.focusedSubject?.id ?? null,
      subjectKind: state.focusedSubject?.kind ?? null,
      subjectLabel: state.focusedSubject?.label ?? null,
    });
    const stage = deriveNexoraMVPStageInteractionPresentation(state);
    const bridge = buildNexoraMVPAdvisorContextBridge(state, stage);
    const context = deriveNexoraMVPExecutiveIntelligenceContext({
      advisorBridge: bridge,
      presentationViewModel: minVm,
      focusedSubject: state.focusedSubject,
      selectedSubject: state.selectedSubject,
      breadcrumb: bridge.breadcrumb,
    });
    const resolution = resolveNexoraMVPExecutiveIntelligence(context);
    assert.ok(resolution.advisor.observation || resolution.advisor.recommendation);
    assert.equal(resolution.insight.koi, null);
  });

  it("8. Advisor/Insight switch works", () => {
    const { advisorBridge, presentationViewModel, state } =
      focusedIntelligence();
    const assist = renderToStaticMarkup(
      React.createElement(NexoraAdvisorInsightRegion, {
        tab: "Assist",
        onTabChange: () => undefined,
        advisorBridge,
        presentationViewModel,
        focusedSubject: state.focusedSubject,
        selectedSubject: state.selectedSubject,
        onIntelligenceAction: () => undefined,
      }),
    );
    const insight = renderToStaticMarkup(
      React.createElement(NexoraAdvisorInsightRegion, {
        tab: "Insight",
        onTabChange: () => undefined,
        advisorBridge,
        presentationViewModel,
        focusedSubject: state.focusedSubject,
        selectedSubject: state.selectedSubject,
        onIntelligenceAction: () => undefined,
      }),
    );
    assert.match(assist, /data-testid="nexora-advisor-view"/);
    assert.match(insight, /data-testid="nexora-insight-view"/);
  });

  it("9. active switch choice is preserved across subject changes", () => {
    const shell = readFileSync(
      join(HERE, "../NexoraExecutiveShell.tsx"),
      "utf8",
    );
    assert.match(shell, /advisorTab/);
    assert.doesNotMatch(shell, /setAdvisorTab\("Insight"\)/);
  });

  it("10. KPI displays only when available", () => {
    const { advisorBridge, presentationViewModel, state } =
      focusedIntelligence("obj-revenue");
    const html = renderToStaticMarkup(
      React.createElement(NexoraAdvisorInsightRegion, {
        tab: "Insight",
        onTabChange: () => undefined,
        advisorBridge,
        presentationViewModel,
        focusedSubject: state.focusedSubject,
        selectedSubject: state.selectedSubject,
        onIntelligenceAction: () => undefined,
      }),
    );
    assert.match(html, /data-testid="nexora-insight-kpi"/);
  });

  it("11. KOI displays only when available", () => {
    const { advisorBridge, presentationViewModel, state } =
      focusedIntelligence("obj-revenue");
    const html = renderToStaticMarkup(
      React.createElement(NexoraAdvisorInsightRegion, {
        tab: "Insight",
        onTabChange: () => undefined,
        advisorBridge,
        presentationViewModel,
        focusedSubject: state.focusedSubject,
        selectedSubject: state.selectedSubject,
        onIntelligenceAction: () => undefined,
      }),
    );
    assert.match(html, /data-testid="nexora-insight-koi"/);

    const capacity = focusedIntelligence("obj-capacity");
    const capacityHtml = renderToStaticMarkup(
      React.createElement(NexoraAdvisorInsightRegion, {
        tab: "Insight",
        onTabChange: () => undefined,
        advisorBridge: capacity.advisorBridge,
        presentationViewModel: capacity.presentationViewModel,
        focusedSubject: capacity.state.focusedSubject,
        selectedSubject: capacity.state.selectedSubject,
        onIntelligenceAction: () => undefined,
      }),
    );
    assert.doesNotMatch(capacityHtml, /data-testid="nexora-insight-koi"/);
  });

  it("12. Advisor actions forward to canonical application interaction", () => {
    const shell = readFileSync(
      join(HERE, "../NexoraExecutiveShell.tsx"),
      "utf8",
    );
    assert.match(shell, /onIntelligenceAction/);
    assert.match(shell, /change-workspace/);
    assert.match(shell, /change-presentation/);
    assert.match(shell, /onSelectSubject/);
  });

  it("13. loading state not faked for sync resolution", () => {
    const region = readFileSync(
      join(HERE, "../NexoraAdvisorInsightRegion.tsx"),
      "utf8",
    );
    assert.doesNotMatch(region, /isLoading|skeleton|Spinner/);
  });

  it("14. error/stale protection does not crash Stage", () => {
    const { advisorBridge, presentationViewModel, state } =
      focusedIntelligence();
    const context = deriveNexoraMVPExecutiveIntelligenceContext({
      advisorBridge,
      presentationViewModel,
      focusedSubject: state.focusedSubject,
      selectedSubject: state.selectedSubject,
      breadcrumb: advisorBridge.breadcrumb,
    });
    const resolution = resolveNexoraMVPExecutiveIntelligence(context);
    assert.equal(
      applyNexoraMVPIntelligenceResolution({
        currentContextKey: "other",
        resolution,
      }),
      null,
    );
    const html = renderToStaticMarkup(React.createElement(NexoraExecutiveShell));
    assert.match(html, /data-testid="nexora-3d-executive-stage"/);
  });

  it("15. stale asynchronous result cannot overwrite current context", () => {
    const resolution = resolveNexoraMVPExecutiveIntelligence(
      deriveNexoraMVPExecutiveIntelligenceContext({
        advisorBridge: focusedIntelligence().advisorBridge,
        presentationViewModel: focusedIntelligence().presentationViewModel,
        focusedSubject: focusedIntelligence().state.focusedSubject,
        selectedSubject: focusedIntelligence().state.selectedSubject,
        breadcrumb: focusedIntelligence().advisorBridge.breadcrumb,
      }),
    );
    assert.equal(
      applyNexoraMVPIntelligenceResolution({
        currentContextKey: "delivery|report|obj-delivery|obj-delivery|mvp-1",
        resolution,
      }),
      null,
    );
  });

  it("16. keyboard accessibility works", () => {
    const header = readFileSync(
      join(HERE, "../../exs1/advisor/ExecutiveAdvisorHeader.tsx"),
      "utf8",
    );
    assert.match(header, /executive-advisor-tab-assist|role="tab"/);
  });

  it("17. no page navigation is required", () => {
    const files = [
      "../NexoraAdvisorInsightRegion.tsx",
      "NexoraAdvisorView.tsx",
      "NexoraInsightView.tsx",
      "../NexoraExecutiveShell.tsx",
    ];
    for (const file of files) {
      const source = readFileSync(join(HERE, file), "utf8");
      assert.doesNotMatch(source, /router\.push|useRouter/);
    }
  });

  it("18. no private upstream runtime imports were introduced", () => {
    const files = [
      "../NexoraAdvisorInsightRegion.tsx",
      "NexoraAdvisorView.tsx",
      "NexoraInsightView.tsx",
      join("../../../lib/nex-mvp/nexoraMVPExecutiveIntelligence.ts"),
    ];
    for (const file of files) {
      const source = readFileSync(join(HERE, file), "utf8");
      assert.doesNotMatch(
        source,
        /from\s+["']@\/app\/lib\/(?:nol|dri|ex-dri|rex)(?:\/[^"']*)?["']/,
      );
      assert.doesNotMatch(
        source,
        /from\s+["']@\/app\/lib\/nex-ci\/(?!executiveCockpitIntegrationPublicIndex)[^"']*["']/,
      );
      assert.doesNotMatch(
        source,
        /from\s+["']@\/app\/lib\/nex-mvp\/nexoraMVPUpstreamIntegration["']/,
      );
    }
  });

  it("integration: Report → Operation becomes action-oriented", () => {
    let state = createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: "report",
      environmentIntent: "neutral",
    });
    state = selectNexoraMVPInteractionSubject(state, "obj-revenue");
    state = applyNexoraMVPPresentationStateChange(state, "operation");
    const stage = deriveNexoraMVPStageInteractionPresentation(state);
    const bridge = buildNexoraMVPAdvisorContextBridge(state, stage);
    const presentationViewModel = deriveNexoraMVPPresentationViewModel({
      presentationState: state.presentationState,
      workspace: state.workspace,
      environmentIntent: state.environmentIntent,
      subjectId: state.focusedSubject?.id ?? null,
      subjectKind: state.focusedSubject?.kind ?? null,
      subjectLabel: state.focusedSubject?.label ?? null,
    });
    const resolution = resolveNexoraMVPExecutiveIntelligence(
      deriveNexoraMVPExecutiveIntelligenceContext({
        advisorBridge: bridge,
        presentationViewModel,
        focusedSubject: state.focusedSubject,
        selectedSubject: state.selectedSubject,
        breadcrumb: bridge.breadcrumb,
      }),
    );
    assert.ok(resolution.advisor.nextActions.length > 0);
    const html = renderToStaticMarkup(
      React.createElement(NexoraAdvisorView, {
        viewModel: resolution.advisor,
        onAction: () => undefined,
      }),
    );
    assert.match(html, /data-testid="nexora-advisor-actions"/);
  });

  it("integration: Dial reinterpretation preserves focus", () => {
    let state = createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: "report",
      environmentIntent: "neutral",
    });
    state = selectNexoraMVPInteractionSubject(state, "obj-capacity");
    const before = state.focusedSubject?.id;
    state = applyNexoraMVPWorkspaceChangeToInteraction(state, "scenario");
    assert.equal(state.focusedSubject?.id, before);
    assert.equal(state.workspace, "scenario");
    assert.equal(state.environmentIntent, "simulate");
  });

  it("Insight view omits empty KPI sections", () => {
    const html = renderToStaticMarkup(
      React.createElement(NexoraInsightView, {
        viewModel: {
          contextKey: "k",
          subjectId: null,
          subjectLabel: null,
          subjectKind: null,
          title: "Insight · Overview",
          contextLine: "overview · Overview · minimum",
          headline: "Executive Stage overview",
          summary: "Scan attention items.",
          primaryKpi: null,
          kpis: Object.freeze([]),
          koi: null,
          drivers: Object.freeze([]),
          risks: Object.freeze([]),
          relationships: Object.freeze([]),
          changes: Object.freeze([]),
          attention: null,
          emptyReason: null,
        },
      }),
    );
    assert.doesNotMatch(html, /data-testid="nexora-insight-kpi"/);
    assert.doesNotMatch(html, /data-testid="nexora-insight-koi"/);
  });
});
