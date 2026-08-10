/**
 * NEX-MVP:8 — flow UI / integration tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  applyNexoraMVPFlowDomainAction,
  createInitialNexoraMVPFlowDomainState,
  deriveNexoraMVPExecutiveFlowChain,
  deriveNexoraMVPExecutiveFlowContext,
  mapNexoraMVPJournalEntries,
  mapNexoraMVPTimelinePacks,
  resolveNexoraMVPFlowPresentationActions,
} from "../../../lib/nex-mvp/nexoraMVPExecutiveFlow.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  selectNexoraMVPInteractionSubject,
  stepBackNexoraMVPObjectInteraction,
} from "../../../lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { deriveNexoraMVPPresentationViewModel } from "../../../lib/nex-mvp/nexoraMVPPresentationState.ts";
import { applyNexoraMVPWorkspaceChangeToInteraction } from "../../../lib/nex-mvp/nexoraMVPWorkspacePresentation.ts";
import { NexoraExecutiveShell } from "../NexoraExecutiveShell.tsx";
import { NexoraExecutiveFlowContextIndicator } from "./NexoraExecutiveFlowContextIndicator.tsx";
import { NexoraFlowJournalExplorer } from "./NexoraFlowJournalExplorer.tsx";

const here = dirname(fileURLToPath(import.meta.url));

function walk(
  start: ReturnType<typeof createInitialNexoraMVPObjectInteractionState>,
  subjectIds: readonly string[],
) {
  return subjectIds.reduce(
    (state, id) => selectNexoraMVPInteractionSubject(state, id),
    start,
  );
}

describe("NEX-MVP:8 Executive Flow components", () => {
  it("1. object focus can open Problem", () => {
    const start = createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: "report",
      environmentIntent: "neutral",
    });
    const focused = walk(start, ["obj-capacity", "ctx-problem-capacity"]);
    assert.equal(focused.focusedSubject?.id, "ctx-problem-capacity");
    const chain = deriveNexoraMVPExecutiveFlowChain({
      focusedSubjectId: focused.focusedSubject?.id ?? null,
    });
    assert.equal(chain.object?.id, "obj-capacity");
  });

  it("2. Problem can open linked Scenario", () => {
    const start = createInitialNexoraMVPObjectInteractionState({
      workspace: "problem",
      presentationState: "report",
      environmentIntent: "investigate",
    });
    const focused = walk(start, [
      "obj-capacity",
      "ctx-problem-capacity",
      "ctx-scenario-capacity",
    ]);
    assert.equal(focused.focusedSubject?.id, "ctx-scenario-capacity");
  });

  it("3. Scenario can reach Decision", () => {
    const chain = deriveNexoraMVPExecutiveFlowChain({
      focusedSubjectId: "ctx-scenario-pricing",
    });
    assert.equal(chain.decision?.id, "ctx-decision-reprice");
  });

  it("4–7. Decision action uses authoritative flow domain", () => {
    const state = createInitialNexoraMVPFlowDomainState();
    const approved = applyNexoraMVPFlowDomainAction(state, {
      actionId: "act-decision-approve",
      subjectId: "ctx-decision-reprice",
      kind: "approve-decision",
    });
    assert.equal(approved.ok, true);
    if (!approved.ok) return;
    assert.equal(
      approved.state.decisions.find((entry) => entry.id === "ctx-decision-reprice")
        ?.status,
      "approved",
    );
    const vm = deriveNexoraMVPPresentationViewModel({
      presentationState: "operation",
      workspace: "decision",
      environmentIntent: "commit",
      subjectId: "ctx-decision-reprice",
      subjectKind: "decision",
      subjectLabel: "Approve Repricing",
    });
    const actions = resolveNexoraMVPFlowPresentationActions(
      vm.availableActions,
      approved.state,
      "ctx-decision-reprice",
    );
    const approve = actions.find((action) => action.id.includes("approve"));
    assert.equal(approve?.available, false);
  });

  it("6–7. Execution opens from Decision and shows state", () => {
    const chain = deriveNexoraMVPExecutiveFlowChain({
      focusedSubjectId: "ctx-decision-capacity",
    });
    assert.equal(chain.execution?.id, "ctx-execution-capacity");
    const state = createInitialNexoraMVPFlowDomainState();
    const execution = state.executions.find(
      (entry) => entry.id === "ctx-execution-capacity",
    );
    assert.equal(execution?.status, "planned");
  });

  it("8–9. Timeline and Journal reflect authoritative events", () => {
    const state = createInitialNexoraMVPFlowDomainState();
    const packs = mapNexoraMVPTimelinePacks(state);
    const journal = mapNexoraMVPJournalEntries(state);
    assert.ok(packs.length > 0);
    assert.ok(journal.length > 0);
    const approved = applyNexoraMVPFlowDomainAction(state, {
      actionId: "act-dec-cap-approve",
      subjectId: "ctx-decision-capacity",
      kind: "approve-decision",
    });
    assert.equal(approved.ok, true);
    if (!approved.ok) return;
    assert.ok(
      mapNexoraMVPTimelinePacks(approved.state).some((pack) =>
        pack.id.includes("approved"),
      ),
    );
    assert.ok(
      mapNexoraMVPJournalEntries(approved.state).some((entry) =>
        entry.id.includes("approved"),
      ),
    );
  });

  it("10. Back flow works", () => {
    const start = createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: "report",
      environmentIntent: "neutral",
    });
    const deep = walk(start, [
      "obj-revenue",
      "ctx-problem-margin",
      "ctx-scenario-pricing",
      "ctx-decision-reprice",
    ]);
    // Stage stack: context → source object → overview (NEX-MVP:4).
    const backToObject = stepBackNexoraMVPObjectInteraction(deep);
    assert.equal(backToObject.focusedSubject?.id, "obj-revenue");
    // Non-linear sideways navigation remains available through chain links.
    const sideways = selectNexoraMVPInteractionSubject(
      backToObject,
      "ctx-scenario-pricing",
    );
    assert.equal(sideways.focusedSubject?.id, "ctx-scenario-pricing");
    const backToOverview = stepBackNexoraMVPObjectInteraction(
      stepBackNexoraMVPObjectInteraction(sideways),
    );
    assert.equal(backToOverview.mode, "overview");
  });

  it("11–12. Workspace Dial and Presentation remain functional", () => {
    const start = createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: "report",
      environmentIntent: "neutral",
    });
    const focused = selectNexoraMVPInteractionSubject(start, "obj-capacity");
    const scenarioWs = applyNexoraMVPWorkspaceChangeToInteraction(
      focused,
      "scenario",
    );
    assert.equal(scenarioWs.workspace, "scenario");
    assert.equal(scenarioWs.focusedSubject?.id, "obj-capacity");
    assert.equal(scenarioWs.presentationState, "report");
  });

  it("13–14. Advisor/Insight follow flow step via context", () => {
    const context = deriveNexoraMVPExecutiveFlowContext({
      workspace: "decision",
      presentationState: "operation",
      focusedSubject: Object.freeze({
        id: "ctx-decision-reprice",
        kind: "decision",
        label: "Approve Repricing",
      }),
      selectedSubject: Object.freeze({
        id: "ctx-decision-reprice",
        kind: "decision",
        label: "Approve Repricing",
      }),
    });
    assert.equal(context.decision?.id, "ctx-decision-reprice");
    assert.equal(context.sourceObject?.id, "obj-revenue");
  });

  it("15–16. Stage shell remains mounted; no route transition markers", () => {
    const html = renderToStaticMarkup(React.createElement(NexoraExecutiveShell));
    assert.match(html, /data-testid="nexora-executive-shell"/);
    assert.match(html, /data-testid="nexora-stage-mount"/);
    assert.match(html, /data-testid="executive-timeline-dock"/);
    assert.match(html, /data-testid="nexora-flow-chain"/);
    assert.doesNotMatch(html, /href="\/executive\//);
    assert.match(html, /data-nex-mvp="8"/);
  });

  it("flow chain indicator renders links", () => {
    const chain = deriveNexoraMVPExecutiveFlowChain({
      focusedSubjectId: "ctx-decision-reprice",
    });
    const html = renderToStaticMarkup(
      React.createElement(NexoraExecutiveFlowContextIndicator, { chain }),
    );
    assert.match(html, /Approve Repricing/);
    assert.match(html, /nexora-flow-link-obj-revenue/);
  });

  it("journal explorer renders packs", () => {
    const entries = mapNexoraMVPJournalEntries(
      createInitialNexoraMVPFlowDomainState(),
    );
    const html = renderToStaticMarkup(
      React.createElement(NexoraFlowJournalExplorer, {
        entries,
        selectedId: null,
        onSelect: () => undefined,
      }),
    );
    assert.match(html, /nexora-flow-journal/);
    assert.match(html, /Margin Pressure/);
  });

  it("17. no private upstream runtime imports were introduced", () => {
    const files = [
      join(here, "../../../lib/nex-mvp/nexoraMVPExecutiveFlow.ts"),
      join(here, "NexoraExecutiveFlowContextIndicator.tsx"),
      join(here, "NexoraFlowJournalExplorer.tsx"),
      join(here, "NexoraFlowFloatingContent.tsx"),
      join(here, "../NexoraExecutiveShell.tsx"),
    ];
    for (const file of files) {
      const source = readFileSync(file, "utf8");
      assert.doesNotMatch(source, /executiveCockpitIntegrationPublicIndex/);
      assert.doesNotMatch(source, /nexoraMVPUpstreamIntegration/);
      assert.doesNotMatch(source, /CertificationFreeze/);
      assert.doesNotMatch(source, /from "node:fs"/);
    }
  });
});
