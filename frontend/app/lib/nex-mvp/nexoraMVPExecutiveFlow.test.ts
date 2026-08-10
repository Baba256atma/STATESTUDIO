/**
 * NEX-MVP:8 — pure executive flow integration tests.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  applyNexoraMVPFlowDomainAction,
  beginNexoraMVPFlowPendingAction,
  createInitialNexoraMVPFlowDomainState,
  deriveNexoraMVPExecutiveFlowChain,
  deriveNexoraMVPExecutiveFlowContext,
  getNexoraMVPExecutiveFlowIntegrationIdentity,
  mapNexoraMVPJournalEntries,
  mapNexoraMVPTimelinePacks,
  NEXORA_MVP_FLOW_BOUNDARY,
  recommendNexoraMVPWorkspaceForSubjectKind,
  resolveNexoraMVPFlowPresentationActions,
  resolveNexoraMVPFlowPresentationFallback,
  resolveNexoraMVPTimelinePackSubjectId,
  verifyNexoraMVPExecutiveFlowIntegration,
} from "./nexoraMVPExecutiveFlow.ts";
import type { NexoraMVPPresentationAvailableAction } from "./nexoraMVPPresentationState.ts";

describe("NEX-MVP:8 Executive Flow Integration", () => {
  it("1. executive flow-chain derivation", () => {
    const chain = deriveNexoraMVPExecutiveFlowChain({
      focusedSubjectId: "ctx-decision-reprice",
    });
    assert.equal(chain.object?.id, "obj-revenue");
    assert.equal(chain.problem?.id, "ctx-problem-margin");
    assert.equal(chain.scenario?.id, "ctx-scenario-pricing");
    assert.equal(chain.decision?.id, "ctx-decision-reprice");
    assert.equal(chain.execution?.id, "ctx-execution-rollout");
    assert.match(chain.summaryLine, /Revenue/);
  });

  it("2. Object → Problem context", () => {
    const context = deriveNexoraMVPExecutiveFlowContext({
      workspace: "overview",
      presentationState: "report",
      focusedSubject: Object.freeze({
        id: "obj-capacity",
        kind: "object",
        label: "Capacity",
      }),
      selectedSubject: Object.freeze({
        id: "obj-capacity",
        kind: "object",
        label: "Capacity",
      }),
    });
    assert.equal(context.sourceObject?.id, "obj-capacity");
    assert.equal(context.problem?.id, "ctx-problem-capacity");
  });

  it("3. Problem → Scenario context", () => {
    const context = deriveNexoraMVPExecutiveFlowContext({
      workspace: "problem",
      presentationState: "report",
      focusedSubject: Object.freeze({
        id: "ctx-problem-capacity",
        kind: "problem",
        label: "Capacity Gap",
      }),
      selectedSubject: Object.freeze({
        id: "ctx-problem-capacity",
        kind: "problem",
        label: "Capacity Gap",
      }),
    });
    assert.ok(
      context.linkedScenarios.some(
        (entry) => entry.id === "ctx-scenario-capacity",
      ),
    );
  });

  it("4. Scenario → Decision context", () => {
    const chain = deriveNexoraMVPExecutiveFlowChain({
      focusedSubjectId: "ctx-scenario-pricing",
    });
    assert.equal(chain.decision?.id, "ctx-decision-reprice");
  });

  it("5. Decision → Execution context", () => {
    const chain = deriveNexoraMVPExecutiveFlowChain({
      focusedSubjectId: "ctx-decision-reprice",
    });
    assert.equal(chain.execution?.id, "ctx-execution-rollout");
  });

  it("6. incomplete chains", () => {
    const chain = deriveNexoraMVPExecutiveFlowChain({
      focusedSubjectId: "obj-inventory",
    });
    assert.equal(chain.object?.id, "obj-inventory");
    assert.equal(chain.problem, null);
    assert.equal(chain.scenario, null);
  });

  it("7. multiple linked scenarios", () => {
    const context = deriveNexoraMVPExecutiveFlowContext({
      workspace: "scenario",
      presentationState: "report",
      focusedSubject: Object.freeze({
        id: "ctx-problem-margin",
        kind: "problem",
        label: "Margin Pressure",
      }),
      selectedSubject: Object.freeze({
        id: "ctx-problem-margin",
        kind: "problem",
        label: "Margin Pressure",
      }),
    });
    assert.ok(context.linkedScenarios.length >= 2);
  });

  it("8. multiple linked decisions/executions where supported", () => {
    const context = deriveNexoraMVPExecutiveFlowContext({
      workspace: "decision",
      presentationState: "operation",
      focusedSubject: Object.freeze({
        id: "ctx-scenario-pricing",
        kind: "scenario",
        label: "Pricing Response",
      }),
      selectedSubject: Object.freeze({
        id: "ctx-scenario-pricing",
        kind: "scenario",
        label: "Pricing Response",
      }),
    });
    assert.ok(
      context.linkedDecisions.some(
        (entry) => entry.id === "ctx-decision-reprice",
      ),
    );
  });

  it("9. workspace preservation / recommendation is advisory", () => {
    assert.equal(
      recommendNexoraMVPWorkspaceForSubjectKind("scenario"),
      "scenario",
    );
    assert.equal(recommendNexoraMVPWorkspaceForSubjectKind("object"), null);
    const context = deriveNexoraMVPExecutiveFlowContext({
      workspace: "overview",
      presentationState: "minimum",
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
    assert.equal(context.workspace, "overview");
  });

  it("10. presentation-state preservation", () => {
    const context = deriveNexoraMVPExecutiveFlowContext({
      workspace: "problem",
      presentationState: "report",
      focusedSubject: Object.freeze({
        id: "ctx-scenario-capacity",
        kind: "scenario",
        label: "Capacity Expansion Plan",
      }),
      selectedSubject: Object.freeze({
        id: "ctx-scenario-capacity",
        kind: "scenario",
        label: "Capacity Expansion Plan",
      }),
    });
    assert.equal(context.presentationState, "report");
  });

  it("11. fallback from unsupported Operation", () => {
    assert.equal(
      resolveNexoraMVPFlowPresentationFallback({
        requested: "operation",
        supportsReport: true,
        supportsOperation: false,
      }),
      "report",
    );
    assert.equal(
      resolveNexoraMVPFlowPresentationFallback({
        requested: "operation",
        supportsReport: false,
        supportsOperation: false,
      }),
      "minimum",
    );
  });

  it("12. back-chain derivation", () => {
    const chain = deriveNexoraMVPExecutiveFlowChain({
      focusedSubjectId: "ctx-execution-rollout",
    });
    assert.equal(chain.decision?.id, "ctx-decision-reprice");
    assert.equal(chain.problem?.id, "ctx-problem-margin");
    assert.equal(chain.object?.id, "obj-revenue");
  });

  it("13. invalid/stale relation handling", () => {
    const chain = deriveNexoraMVPExecutiveFlowChain({
      focusedSubjectId: "ctx-missing-subject",
    });
    assert.equal(chain.links.length, 0);
    const state = createInitialNexoraMVPFlowDomainState();
    const result = applyNexoraMVPFlowDomainAction(state, {
      actionId: "act-decision-approve",
      subjectId: "ctx-missing",
      kind: "approve-decision",
    });
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.reason, "invalid-subject");
    }
  });

  it("14. deterministic entity ordering", () => {
    const a = deriveNexoraMVPExecutiveFlowChain({
      focusedSubjectId: "ctx-decision-reprice",
    });
    const b = deriveNexoraMVPExecutiveFlowChain({
      focusedSubjectId: "ctx-decision-reprice",
    });
    assert.deepEqual(a, b);
  });

  it("15. Timeline event mapping", () => {
    const state = createInitialNexoraMVPFlowDomainState();
    const packs = mapNexoraMVPTimelinePacks(state);
    assert.ok(packs.length >= 3);
    assert.ok(packs.every((pack) => pack.subjectId && pack.title));
  });

  it("16. Journal Pack mapping", () => {
    const state = createInitialNexoraMVPFlowDomainState();
    const entries = mapNexoraMVPJournalEntries(state);
    assert.ok(entries.some((entry) => entry.packKind === "decision"));
  });

  it("17. no duplicate domain-state creation on failed action", () => {
    const state = createInitialNexoraMVPFlowDomainState();
    const before = state.timelineEvents.length;
    const failed = applyNexoraMVPFlowDomainAction(state, {
      actionId: "act-decision-approve",
      subjectId: "ctx-decision-reprice",
      kind: "approve-decision",
    });
    assert.equal(failed.ok, true);
    if (!failed.ok) return;
    const duplicate = applyNexoraMVPFlowDomainAction(failed.state, {
      actionId: "act-decision-approve",
      subjectId: "ctx-decision-reprice",
      kind: "approve-decision",
    });
    assert.equal(duplicate.ok, false);
    assert.equal(failed.state.timelineEvents.length, before + 1);
    if (!duplicate.ok) {
      assert.equal(duplicate.state.timelineEvents.length, before + 1);
    }
  });

  it("action: approve / disabled / pending / success", () => {
    const initial = createInitialNexoraMVPFlowDomainState();
    const actions: readonly NexoraMVPPresentationAvailableAction[] =
      Object.freeze([
        Object.freeze({
          id: "act-decision-approve",
          label: "Approve",
          kind: "review" as const,
          available: true,
        }),
      ]);
    const underReview = resolveNexoraMVPFlowPresentationActions(
      actions,
      initial,
      "ctx-decision-reprice",
    );
    assert.equal(underReview[0]?.available, true);

    const pending = beginNexoraMVPFlowPendingAction(
      initial,
      "other-action",
    );
    const blocked = applyNexoraMVPFlowDomainAction(pending, {
      actionId: "act-decision-approve",
      subjectId: "ctx-decision-reprice",
      kind: "approve-decision",
    });
    assert.equal(blocked.ok, false);
    if (!blocked.ok) assert.equal(blocked.reason, "pending");

    const approved = applyNexoraMVPFlowDomainAction(initial, {
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
    assert.ok(
      approved.state.timelineEvents.some(
        (event) => event.kind === "decision-approved",
      ),
    );
    assert.ok(
      approved.state.journalPacks.some((pack) =>
        pack.id.includes("approved"),
      ),
    );

    const after = resolveNexoraMVPFlowPresentationActions(
      actions,
      approved.state,
      "ctx-decision-reprice",
    );
    assert.equal(after[0]?.available, false);
  });

  it("failed action does not fabricate successful history", () => {
    const state = createInitialNexoraMVPFlowDomainState();
    const beforeEvents = state.timelineEvents.length;
    const beforePacks = state.journalPacks.length;
    const result = applyNexoraMVPFlowDomainAction(state, {
      actionId: "act-exec-cap-start-exec",
      subjectId: "ctx-execution-capacity",
      kind: "start-execution",
    });
    assert.equal(result.ok, false);
    assert.equal(result.state.timelineEvents.length, beforeEvents);
    assert.equal(result.state.journalPacks.length, beforePacks);
  });

  it("timeline pack resolves subject", () => {
    const state = createInitialNexoraMVPFlowDomainState();
    const subjectId = resolveNexoraMVPTimelinePackSubjectId(
      state,
      "tl-margin-identified",
    );
    assert.equal(subjectId, "ctx-problem-margin");
  });

  it("capacity chain derives end-to-end", () => {
    const chain = deriveNexoraMVPExecutiveFlowChain({
      focusedSubjectId: "ctx-execution-capacity",
    });
    assert.equal(chain.object?.id, "obj-capacity");
    assert.equal(chain.problem?.id, "ctx-problem-capacity");
    assert.equal(chain.scenario?.id, "ctx-scenario-capacity");
    assert.equal(chain.decision?.id, "ctx-decision-capacity");
    assert.equal(chain.execution?.id, "ctx-execution-capacity");
  });

  it("identity and boundary", () => {
    const identity = getNexoraMVPExecutiveFlowIntegrationIdentity();
    assert.equal(identity.id, "NEX-MVP:8/NexoraExecutiveFlowIntegration");
    assert.equal(identity.version, "1.8.0");
    assert.equal(
      identity.namespace,
      "nexora.mvp.executive-flow-integration",
    );
    assert.equal(NEXORA_MVP_FLOW_BOUNDARY.ownsWorkflowEngine, false);
    assert.equal(verifyNexoraMVPExecutiveFlowIntegration().ok, true);
  });
});
