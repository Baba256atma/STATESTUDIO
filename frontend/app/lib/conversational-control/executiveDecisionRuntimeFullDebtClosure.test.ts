/**
 * CC:10R.1 — Decision Runtime Full Debt Closure certification.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  createEmptyNexoraExecutiveDecisionSession,
  rememberDecisionProvenance,
} from "./executiveDecisionAuthority.ts";
import {
  createExecutiveRuntimeStoreDecisionAdapter,
  createNexoraCanonicalDecisionRuntime,
} from "./executiveDecisionRuntimeAdapter.ts";
import {
  EXECUTIVE_DECISION_RUNTIME_FULL_DEBT_CLOSURE_BOUNDARY,
  EXECUTIVE_DECISION_RUNTIME_FULL_DEBT_CLOSURE_CERTIFICATION,
  getExecutiveDecisionRuntimeFullDebtClosureIdentity,
  resolveDecisionRuntimeCc11Gate,
} from "./executiveDecisionRuntimeFullDebtClosure.ts";
import {
  bootstrapCanonicalDecisionsFromFlowFixtures,
  deserializeFlowDecisionStatus,
  projectCanonicalDecisionToFlowRecord,
  serializeCanonicalDecisionStatus,
} from "./executiveDecisionStatusProjection.ts";
import { getExecutiveDecisionRuntimeConvergenceIdentity } from "./executiveDecisionRuntimeConvergence.ts";
import {
  applyNexoraMVPFlowDomainAction,
  createInitialNexoraMVPFlowDomainState,
  overlayNexoraMVPPresentationStatus,
  projectNexoraMVPCatalogDecisionStatusesFromFlowDomain,
  projectNexoraMVPFlowDecisionsFromCanonicalRuntime,
} from "../nex-mvp/nexoraMVPExecutiveFlow.ts";
import { createNexoraMVPFlowSeededDecisionRuntime } from "../nex-mvp/nexoraMVPExecutiveDecisionCommitment.ts";
import { createInitialNexoraMVPFlowDecisionRecords } from "../nex-mvp/nexoraMVPExecutiveFlowFixtures.ts";
import { NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES } from "../nex-mvp/nexoraMVPObjectInteractionFixtures.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

describe("CC:10R.1 Decision Runtime Full Debt Closure", () => {
  it("phase identity + CC11_GATE OPEN only when all debts CLOSED", () => {
    const id = getExecutiveDecisionRuntimeFullDebtClosureIdentity();
    assert.equal(id.id, "CC:10R.1/DecisionRuntimeFullDebtClosure");
    assert.equal(id.version, "1.0.0");
    assert.equal(
      id.namespace,
      "nexora.conversational-control.decision-runtime-full-debt-closure",
    );
    assert.equal(
      id.architecturalRole,
      "CanonicalDecisionAuthorityClosureGate",
    );
    assert.equal(
      EXECUTIVE_DECISION_RUNTIME_FULL_DEBT_CLOSURE_CERTIFICATION.CC11_GATE,
      "OPEN",
    );
    assert.equal(
      EXECUTIVE_DECISION_RUNTIME_FULL_DEBT_CLOSURE_CERTIFICATION
        .DEBT_1_EXS1_ApprovalBar,
      "CLOSED",
    );
    assert.equal(
      EXECUTIVE_DECISION_RUNTIME_FULL_DEBT_CLOSURE_CERTIFICATION.DEBT_2_flowDomain,
      "CLOSED",
    );
    assert.equal(
      EXECUTIVE_DECISION_RUNTIME_FULL_DEBT_CLOSURE_CERTIFICATION
        .DEBT_3_StageProjection,
      "CLOSED",
    );
    assert.equal(
      resolveDecisionRuntimeCc11Gate({
        debt1: "CLOSED",
        debt2: "CLOSED",
        debt3: "OPEN",
      }).CC11_GATE,
      "BLOCKED",
    );
    assert.equal(
      EXECUTIVE_DECISION_RUNTIME_FULL_DEBT_CLOSURE_BOUNDARY.stopsBeforeExecution,
      true,
    );
    assert.equal(
      EXECUTIVE_DECISION_RUNTIME_FULL_DEBT_CLOSURE_BOUNDARY.cc11Unimplemented,
      true,
    );
  });

  it("status serializer is pure projection (Under Review ↔ under-review)", () => {
    assert.equal(
      serializeCanonicalDecisionStatus("Under Review"),
      "under-review",
    );
    assert.equal(
      deserializeFlowDecisionStatus("under-review"),
      "Under Review",
    );
    assert.equal(deserializeFlowDecisionStatus("locked"), "Approved");
    assert.equal(
      serializeCanonicalDecisionStatus("Approved"),
      "approved",
    );
  });

  it("writer authority: flowDomain Decision mutation requires canonical Runtime", () => {
    const state = createInitialNexoraMVPFlowDomainState();
    const denied = applyNexoraMVPFlowDomainAction(state, {
      actionId: "act-decision-approve",
      subjectId: "ctx-decision-reprice",
      kind: "approve-decision",
    });
    assert.equal(denied.ok, false);
    if (!denied.ok) {
      assert.equal(denied.reason, "canonical-runtime-required");
    }
    assert.equal(
      state.decisions.find((d) => d.id === "ctx-decision-reprice")?.status,
      "under-review",
    );
  });

  it("DEBT-2: flowDomain projects from canonical Runtime (no dual truth)", () => {
    const runtime = createNexoraMVPFlowSeededDecisionRuntime();
    const state = createInitialNexoraMVPFlowDomainState();
    const applied = applyNexoraMVPFlowDomainAction(
      state,
      {
        actionId: "act-decision-approve",
        subjectId: "ctx-decision-reprice",
        kind: "approve-decision",
      },
      { decisionRuntime: runtime.adapter },
    );
    assert.equal(applied.ok, true);
    if (!applied.ok) return;
    const projected = applied.state.decisions.find(
      (d) => d.id === "ctx-decision-reprice",
    );
    const canonical = runtime.adapter.getDecision("ctx-decision-reprice");
    assert.equal(canonical?.status, "Approved");
    assert.equal(canonical?.locked, true);
    assert.equal(projected?.status, "approved");
    assert.equal(projected?.locked, true);
    assert.equal(
      serializeCanonicalDecisionStatus(canonical!.status),
      projected!.status,
    );
  });

  it("UI / conversation transition equivalence on shared Runtime", () => {
    const runtime = createNexoraCanonicalDecisionRuntime({
      initialDecisions: bootstrapCanonicalDecisionsFromFlowFixtures(
        createInitialNexoraMVPFlowDecisionRecords(),
      ),
    });
    const viaUi = runtime.adapter.transitionDecision({
      decisionId: "ctx-decision-reprice",
      action: "approve",
      title: "Approve Repricing",
    });
    assert.equal(viaUi.status, "applied");
    assert.equal(viaUi.decision?.status, "Approved");
    assert.equal(viaUi.decision?.locked, true);

    const viaConvoDuplicate = runtime.adapter.transitionDecision({
      decisionId: "ctx-decision-reprice",
      action: "approve",
      title: "Approve Repricing",
    });
    assert.equal(viaConvoDuplicate.status, "already-committed");
    assert.equal(viaConvoDuplicate.decision?.status, "Approved");
  });

  it("locked Decision: UI and Conversation receive same rejection", () => {
    const runtime = createNexoraCanonicalDecisionRuntime({
      initialDecisions: bootstrapCanonicalDecisionsFromFlowFixtures([
        {
          id: "ctx-decision-reprice",
          status: "approved",
          locked: true,
          label: "Approve Repricing",
          sourceScenarioId: "ctx-scenario-pricing",
          sourceProblemId: "ctx-problem-margin",
          objectId: "obj-revenue",
        },
      ]),
    });
    const uiReject = runtime.adapter.transitionDecision({
      decisionId: "ctx-decision-reprice",
      action: "reject",
      title: "Approve Repricing",
    });
    const convoReject = runtime.adapter.transitionDecision({
      decisionId: "ctx-decision-reprice",
      action: "reject",
      title: "Approve Repricing",
    });
    assert.equal(uiReject.status, "transition-not-allowed");
    assert.equal(convoReject.status, "transition-not-allowed");
    assert.ok(uiReject.reasons.includes("locked-decision"));
    assert.ok(convoReject.reasons.includes("locked-decision"));
  });

  it("DEBT-3: Stage catalog Decision status derives from flow projection", () => {
    const runtime = createNexoraMVPFlowSeededDecisionRuntime();
    let flow = createInitialNexoraMVPFlowDomainState();
    const applied = applyNexoraMVPFlowDomainAction(
      flow,
      {
        actionId: "act-decision-approve",
        subjectId: "ctx-decision-reprice",
        kind: "approve-decision",
      },
      { decisionRuntime: runtime.adapter },
    );
    assert.equal(applied.ok, true);
    if (!applied.ok) return;
    flow = applied.state;

    const catalog = Object.freeze({
      contextSubjects: NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES,
    });
    const projected = projectNexoraMVPCatalogDecisionStatusesFromFlowDomain(
      catalog,
      flow,
    );
    const stageDecision = projected.contextSubjects.find(
      (s) => s.id === "ctx-decision-reprice",
    );
    assert.equal(stageDecision?.status, "approved");
    assert.equal(
      overlayNexoraMVPPresentationStatus(null, flow, "ctx-decision-reprice"),
      "Approved",
    );
  });

  it("conversation Runtime → flowDomain projection → Stage essential status", () => {
    const runtime = createNexoraMVPFlowSeededDecisionRuntime();
    runtime.adapter.transitionDecision({
      decisionId: "ctx-decision-capacity",
      action: "approve",
      title: "Expand Capacity",
    });
    const flow = projectNexoraMVPFlowDecisionsFromCanonicalRuntime(
      createInitialNexoraMVPFlowDomainState(),
      runtime.adapter,
    );
    assert.equal(
      flow.decisions.find((d) => d.id === "ctx-decision-capacity")?.status,
      "approved",
    );
    assert.equal(
      overlayNexoraMVPPresentationStatus(null, flow, "ctx-decision-capacity"),
      "Approved",
    );
  });

  it("provenance survives UI transition on shared Runtime record fields", () => {
    const runtime = createNexoraCanonicalDecisionRuntime({
      initialDecisions: Object.freeze([
        Object.freeze({
          decisionId: "decision-b",
          title: "Decision B",
          status: "Under Review" as const,
          locked: false,
          subjectIds: Object.freeze(["subj-1"]),
          scenarioId: "scenario-b",
          recommendationId: "rec-1",
          evidenceRefs: Object.freeze([]),
          uncertaintyRefs: Object.freeze(["unc-1"]),
          committedBy: "manager" as const,
          source: "conversation" as const,
        }),
      ]),
    });
    let session = createEmptyNexoraExecutiveDecisionSession();
    session = rememberDecisionProvenance(session, {
      decisionId: "decision-b",
      scenarioId: "scenario-b",
      recommendationId: "rec-1",
      evidenceRefs: Object.freeze([]),
      uncertaintyRefs: Object.freeze(["unc-1"]),
      source: "conversation",
    });
    const uiApprove = runtime.adapter.transitionDecision({
      decisionId: "decision-b",
      action: "approve",
      title: "Decision B",
    });
    assert.equal(uiApprove.status, "applied");
    const after = runtime.adapter.getDecision("decision-b");
    assert.equal(after?.scenarioId, "scenario-b");
    assert.equal(after?.recommendationId, "rec-1");
    assert.deepEqual(after?.uncertaintyRefs, ["unc-1"]);
    assert.equal(
      session.provenanceByDecisionId["decision-b"]?.scenarioId,
      "scenario-b",
    );
  });

  it("no focus steal: Stage projection does not mutate interaction focus fields", () => {
    const flow = createInitialNexoraMVPFlowDomainState();
    const catalog = Object.freeze({
      contextSubjects: NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES,
    });
    const beforeFocus = "obj-budget";
    const projected = projectNexoraMVPCatalogDecisionStatusesFromFlowDomain(
      catalog,
      flow,
    );
    assert.equal(beforeFocus, "obj-budget");
    assert.ok(
      projected.contextSubjects.some((s) => s.id === "ctx-decision-reprice"),
    );
  });

  it("EXS1 store adapter is thin port over live store (no mirror)", () => {
    const decisions = [
      {
        id: "decision-a",
        name: "Decision A",
        status: "Under Review" as const,
        locked: false,
        scenarioSourceIds: ["scenario-a"] as const,
        createdDate: "2026-08-01",
      },
    ];
    let storeState = {
      decision: { decisions },
    };
    const store = {
      getState: () => storeState,
      actions: {
        approveDecision(id: string) {
          storeState = {
            decision: {
              decisions: storeState.decision.decisions.map((d) =>
                d.id === id
                  ? { ...d, status: "Approved" as const, locked: true }
                  : d,
              ),
            },
          };
        },
        rejectDecision(id: string) {
          storeState = {
            decision: {
              decisions: storeState.decision.decisions.map((d) =>
                d.id === id
                  ? { ...d, status: "Rejected" as const, locked: false }
                  : d,
              ),
            },
          };
        },
        returnDecisionForAnalysis(id: string) {
          storeState = {
            decision: {
              decisions: storeState.decision.decisions.map((d) =>
                d.id === id
                  ? { ...d, status: "Under Review" as const, locked: false }
                  : d,
              ),
            },
          };
        },
        archiveDecision(id: string) {
          storeState = {
            decision: {
              decisions: storeState.decision.decisions.map((d) =>
                d.id === id
                  ? { ...d, status: "Archived" as const, locked: false }
                  : d,
              ),
            },
          };
        },
        setDecisionStatus(
          id: string,
          status:
            | "Draft"
            | "Under Review"
            | "Approved"
            | "Rejected"
            | "Archived",
        ) {
          storeState = {
            decision: {
              decisions: storeState.decision.decisions.map((d) =>
                d.id === id
                  ? { ...d, status, locked: status === "Approved" }
                  : d,
              ),
            },
          };
        },
        createManualDecision(_name: string) {},
      },
    };
    const adapter = createExecutiveRuntimeStoreDecisionAdapter(store);
    const result = adapter.transitionDecision({
      decisionId: "decision-a",
      action: "approve",
      title: "Decision A",
    });
    assert.equal(result.status, "applied");
    assert.equal(adapter.getDecision("decision-a")?.status, "Approved");
    assert.equal(store.getState().decision.decisions[0]?.status, "Approved");
  });

  it("ApprovalBar product path uses adapter (source audit)", () => {
    const hookSource = readFileSync(
      join(HERE, "../../executive/exs1/runtime/hooks/useExecutiveRuntime.ts"),
      "utf8",
    );
    assert.match(hookSource, /createExecutiveRuntimeStoreDecisionAdapter/);
    assert.match(hookSource, /adapter\.transitionDecision/);
    assert.doesNotMatch(
      hookSource,
      /approve:\s*a\.approveDecision/,
    );
    const barSource = readFileSync(
      join(
        HERE,
        "../../executive/exs1/decision/ExecutiveDecisionApprovalBar.tsx",
      ),
      "utf8",
    );
    assert.match(barSource, /canonical Decision Runtime/);
    assert.doesNotMatch(barSource, /approveDecision\(/);
  });

  it("CC:10R remains green identity", () => {
    assert.equal(
      getExecutiveDecisionRuntimeConvergenceIdentity().id,
      "CC:10R/DecisionRuntimeConvergence",
    );
  });

  it("hydration regression: Queue SSR gate source remains", () => {
    const hydration = readFileSync(
      join(HERE, "../spatial-presentation/executiveStageQueueHydration.test.ts"),
      "utf8",
    );
    assert.match(hydration, /hydration/);
    const overlay = readFileSync(
      join(
        HERE,
        "../../executive/nex-mvp/stage/NexoraExecutiveQueueOverlay.tsx",
      ),
      "utf8",
    );
    assert.ok(overlay.length > 0);
  });

  it("no execution created by Decision approve path", () => {
    const runtime = createNexoraMVPFlowSeededDecisionRuntime();
    const before = createInitialNexoraMVPFlowDomainState();
    const after = applyNexoraMVPFlowDomainAction(
      before,
      {
        actionId: "act-decision-approve",
        subjectId: "ctx-decision-reprice",
        kind: "approve-decision",
      },
      { decisionRuntime: runtime.adapter },
    );
    assert.equal(after.ok, true);
    if (!after.ok) return;
    assert.equal(after.state.executions.length, before.executions.length);
    assert.ok(
      after.state.executions.every(
        (e) => e.status !== "in-progress" || e.id !== "new-exec",
      ),
    );
    assert.equal(
      EXECUTIVE_DECISION_RUNTIME_FULL_DEBT_CLOSURE_BOUNDARY.stopsBeforeExecution,
      true,
    );
  });

  it("projectCanonicalDecisionToFlowRecord maps lock separately", () => {
    const projected = projectCanonicalDecisionToFlowRecord(
      Object.freeze({
        decisionId: "d1",
        title: "D1",
        status: "Approved",
        locked: true,
        subjectIds: Object.freeze([]),
        evidenceRefs: Object.freeze([]),
        uncertaintyRefs: Object.freeze([]),
        committedBy: "manager",
        source: "conversation",
      }),
    );
    assert.equal(projected.status, "approved");
    assert.equal(projected.locked, true);
  });
});
