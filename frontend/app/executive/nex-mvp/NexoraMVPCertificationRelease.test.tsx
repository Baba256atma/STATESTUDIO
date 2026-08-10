/**
 * NEX-MVP:9 — product integration certification tests.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  applyNexoraMVPFlowDomainAction,
  createInitialNexoraMVPFlowDomainState,
  deriveNexoraMVPExecutiveFlowChain,
  mapNexoraMVPJournalEntries,
  mapNexoraMVPTimelinePacks,
} from "../../lib/nex-mvp/nexoraMVPExecutiveFlow.ts";
import {
  applyNexoraMVPIntelligenceResolution,
  buildNexoraMVPIntelligenceContextKey,
  deriveNexoraMVPExecutiveIntelligenceContext,
  mapNexoraMVPAdvisorViewModel,
  mapNexoraMVPInsightViewModel,
  resolveNexoraMVPExecutiveIntelligence,
} from "../../lib/nex-mvp/nexoraMVPExecutiveIntelligence.ts";
import {
  applyNexoraMVPPresentationStateChange,
  deriveNexoraMVPPresentationViewModel,
} from "../../lib/nex-mvp/nexoraMVPPresentationState.ts";
import {
  buildNexoraMVPAdvisorContextBridge,
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  resetNexoraMVPObjectInteractionOverview,
  selectNexoraMVPInteractionSubject,
  stepBackNexoraMVPObjectInteraction,
} from "../../lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { applyNexoraMVPWorkspaceChangeToInteraction } from "../../lib/nex-mvp/nexoraMVPWorkspacePresentation.ts";
import { NexoraExecutiveShell } from "./NexoraExecutiveShell.tsx";

function focus(subjectId: string) {
  return selectNexoraMVPInteractionSubject(
    createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: "report",
      environmentIntent: "neutral",
    }),
    subjectId,
  );
}

describe("NEX-MVP:9 product integration certification", () => {
  it("E2E1: /executive Stage → select → focus → overview", () => {
    const html = renderToStaticMarkup(React.createElement(NexoraExecutiveShell));
    assert.match(html, /data-testid="nexora-executive-shell"/);
    assert.match(html, /data-testid="nexora-stage-mount"/);
    assert.match(html, /data-nex-mvp="8"/);
    const selected = focus("obj-capacity");
    assert.equal(selected.focusedSubject?.id, "obj-capacity");
    const overview = resetNexoraMVPObjectInteractionOverview(selected);
    assert.equal(overview.mode, "overview");
    assert.equal(overview.focusedSubject, null);
  });

  it("E2E2: Dial workspace hops preserve focus; no route change", () => {
    let state = focus("obj-capacity");
    for (const workspace of [
      "problem",
      "scenario",
      "decision",
      "execution",
    ] as const) {
      state = applyNexoraMVPWorkspaceChangeToInteraction(state, workspace);
      assert.equal(state.workspace, workspace);
      assert.equal(state.focusedSubject?.id, "obj-capacity");
      assert.notEqual(state.environmentIntent, undefined);
    }
    const html = renderToStaticMarkup(React.createElement(NexoraExecutiveShell));
    assert.doesNotMatch(html, /href="\/executive\//);
    assert.match(html, /data-testid="nexora-stage-mount"/);
  });

  it("E2E3: Minimum → Report → Operation → Minimum preserves subject", () => {
    let state = focus("obj-capacity");
    state = applyNexoraMVPPresentationStateChange(state, "minimum");
    assert.equal(state.presentationState, "minimum");
    assert.equal(state.focusedSubject?.id, "obj-capacity");
    state = applyNexoraMVPPresentationStateChange(state, "report");
    assert.equal(state.presentationState, "report");
    state = applyNexoraMVPPresentationStateChange(state, "operation");
    assert.equal(state.presentationState, "operation");
    state = applyNexoraMVPPresentationStateChange(state, "minimum");
    assert.equal(state.presentationState, "minimum");
    assert.equal(state.focusedSubject?.id, "obj-capacity");
    assert.equal(state.workspace, "overview");
  });

  it("E2E4: Advisor/Insight follow subject, workspace, presentation", () => {
    const capacity = focus("obj-capacity");
    const report = applyNexoraMVPPresentationStateChange(capacity, "report");
    const presentation = deriveNexoraMVPPresentationViewModel({
      presentationState: report.presentationState,
      workspace: report.workspace,
      environmentIntent: report.environmentIntent,
      subjectId: report.focusedSubject?.id ?? null,
      subjectKind: report.focusedSubject?.kind ?? null,
      subjectLabel: report.focusedSubject?.label ?? null,
    });
    const bridge = buildNexoraMVPAdvisorContextBridge(
      report,
      deriveNexoraMVPStageInteractionPresentation(report),
    );
    const context = deriveNexoraMVPExecutiveIntelligenceContext({
      advisorBridge: bridge,
      presentationViewModel: presentation,
      focusedSubject: report.focusedSubject,
      selectedSubject: report.selectedSubject,
      breadcrumb: bridge.breadcrumb,
    });
    const advisor = mapNexoraMVPAdvisorViewModel(context);
    const insight = mapNexoraMVPInsightViewModel(context);
    assert.equal(advisor.subjectId, "obj-capacity");
    assert.equal(insight.subjectId, "obj-capacity");
    assert.notEqual(advisor.recommendation, insight.headline);

    const scenario = applyNexoraMVPWorkspaceChangeToInteraction(
      report,
      "scenario",
    );
    const scenarioBridge = buildNexoraMVPAdvisorContextBridge(
      scenario,
      deriveNexoraMVPStageInteractionPresentation(scenario),
    );
    const scenarioContext = deriveNexoraMVPExecutiveIntelligenceContext({
      advisorBridge: scenarioBridge,
      presentationViewModel: deriveNexoraMVPPresentationViewModel({
        presentationState: scenario.presentationState,
        workspace: scenario.workspace,
        environmentIntent: scenario.environmentIntent,
        subjectId: scenario.focusedSubject?.id ?? null,
        subjectKind: scenario.focusedSubject?.kind ?? null,
        subjectLabel: scenario.focusedSubject?.label ?? null,
      }),
      focusedSubject: scenario.focusedSubject,
      selectedSubject: scenario.selectedSubject,
      breadcrumb: scenarioBridge.breadcrumb,
    });
    assert.match(
      mapNexoraMVPAdvisorViewModel(scenarioContext).contextLine,
      /scenario/,
    );
  });

  it("E2E5: Object → Problem → Scenario → Decision → Execution → Timeline/Journal", () => {
    let state = focus("obj-capacity");
    state = selectNexoraMVPInteractionSubject(state, "ctx-problem-capacity");
    state = selectNexoraMVPInteractionSubject(state, "ctx-scenario-capacity");
    state = selectNexoraMVPInteractionSubject(state, "ctx-decision-capacity");
    state = selectNexoraMVPInteractionSubject(state, "ctx-execution-capacity");
    assert.equal(state.focusedSubject?.id, "ctx-execution-capacity");
    const chain = deriveNexoraMVPExecutiveFlowChain({
      focusedSubjectId: state.focusedSubject?.id ?? null,
    });
    assert.equal(chain.object?.id, "obj-capacity");
    assert.equal(chain.problem?.id, "ctx-problem-capacity");
    assert.equal(chain.scenario?.id, "ctx-scenario-capacity");
    assert.equal(chain.decision?.id, "ctx-decision-capacity");
    assert.equal(chain.execution?.id, "ctx-execution-capacity");

    const flow = createInitialNexoraMVPFlowDomainState();
    assert.ok(mapNexoraMVPTimelinePacks(flow).length > 0);
    assert.ok(mapNexoraMVPJournalEntries(flow).length > 0);
    const html = renderToStaticMarkup(React.createElement(NexoraExecutiveShell));
    assert.match(html, /executive-timeline-dock/);
    assert.match(html, /nexora-flow-chain/);
  });

  it("E2E6: non-linear back + sideways navigation", () => {
    let state = focus("obj-revenue");
    state = selectNexoraMVPInteractionSubject(state, "ctx-problem-margin");
    state = selectNexoraMVPInteractionSubject(state, "ctx-scenario-pricing");
    state = selectNexoraMVPInteractionSubject(state, "ctx-decision-reprice");
    const backObject = stepBackNexoraMVPObjectInteraction(state);
    assert.equal(backObject.focusedSubject?.id, "obj-revenue");
    const sideways = selectNexoraMVPInteractionSubject(
      backObject,
      "ctx-scenario-pricing",
    );
    assert.equal(sideways.focusedSubject?.id, "ctx-scenario-pricing");
    const overview = resetNexoraMVPObjectInteractionOverview(sideways);
    assert.equal(overview.mode, "overview");
  });

  it("failure recovery: failed Decision/Execution action keeps Stage usable", () => {
    const flow = createInitialNexoraMVPFlowDomainState();
    const failed = applyNexoraMVPFlowDomainAction(flow, {
      actionId: "act-exec-cap-start-exec",
      subjectId: "ctx-execution-capacity",
      kind: "start-execution",
    });
    assert.equal(failed.ok, false);
    const html = renderToStaticMarkup(React.createElement(NexoraExecutiveShell));
    assert.match(html, /nexora-executive-shell/);
    assert.match(html, /nexora-stage-mount/);
  });

  it("stale async intelligence cannot overwrite current subject", () => {
    const capacity = focus("obj-capacity");
    const presentation = deriveNexoraMVPPresentationViewModel({
      presentationState: "report",
      workspace: "overview",
      environmentIntent: "neutral",
      subjectId: "obj-capacity",
      subjectKind: "object",
      subjectLabel: "Capacity",
    });
    const bridge = buildNexoraMVPAdvisorContextBridge(
      capacity,
      deriveNexoraMVPStageInteractionPresentation(capacity),
    );
    const context = deriveNexoraMVPExecutiveIntelligenceContext({
      advisorBridge: bridge,
      presentationViewModel: presentation,
      focusedSubject: capacity.focusedSubject,
      selectedSubject: capacity.selectedSubject,
      breadcrumb: bridge.breadcrumb,
    });
    const resolution = resolveNexoraMVPExecutiveIntelligence(context);
    const currentKey = buildNexoraMVPIntelligenceContextKey({
      workspace: "overview",
      presentationState: "report",
      focusedSubjectId: "obj-revenue",
      selectedSubjectId: "obj-revenue",
    });
    const applied = applyNexoraMVPIntelligenceResolution({
      currentContextKey: currentKey,
      resolution,
    });
    assert.equal(applied, null);
  });

  it("shell mounts Timeline packs and flow indicator for demo readiness", () => {
    const html = renderToStaticMarkup(React.createElement(NexoraExecutiveShell));
    assert.match(html, /Margin Pressure identified|Capacity Gap identified/);
    assert.match(html, /data-flow-identity="NEX-MVP:8\/NexoraExecutiveFlowIntegration"/);
    assert.match(html, /Advisor|Insight|Assist/i);
  });
});
