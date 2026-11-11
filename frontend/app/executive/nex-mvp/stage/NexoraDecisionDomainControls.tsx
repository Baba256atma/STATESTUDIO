"use client";

import { useSyncExternalStore, useState } from "react";
import {
  approveManagerDecision,
  createDecisionGoal,
  createDecisionScenario,
  createExecutionPlan,
  createManagerDecision,
  decisionDomainRevision,
  listDecisionGoals,
  listDecisionScenarios,
  listExecutionPlans,
  listManagerDecisions,
  rejectManagerDecision,
  subscribeDecisionDomain,
} from "@/app/lib/scene-org/canonicalDecisionDomain";
import { listDeckCanonicalObjects, subscribeCanonicalObjects, canonicalObjectRevision } from "@/app/lib/scene-org/canonicalObjectRegistry";
import { assessScenarioEvidenceCurrency } from "@/app/lib/scene-org/causalScenarioHandoff";
import { subscribeCausalInvestigations, causalInvestigationRevision } from "@/app/lib/scene-org/canonicalCausalInvestigationDomain";
import { subscribeCsvRealDataImports, getCsvRealDataImportVersion } from "@/app/lib/data-reality/csvRealDataImportStore";
import { subscribeDeckDatasetReferences, getDeckDatasetReferenceSnapshot } from "@/app/lib/deck/nexoraDeckDatasetReferenceRegistry";
import { coordinateWorkspaceMutation, WORKSPACE_UNAVAILABLE_MESSAGE } from "@/app/lib/workspace/workspaceAuthorityFence";

type Props = Readonly<{
  workspaceId: string;
  deckId: string;
  onInspect: (id: string) => void;
}>;

export type DecisionSelectionDraft = {
  boundary: string;
  selectedId: string;
  message: string;
};

/** Workspace and Deck together own the local selection. */
export function decisionSelectionBoundary(workspaceId: string, deckId: string): string {
  return `${workspaceId}\0${deckId}`;
}

export function emptyDecisionSelection(boundary: string): DecisionSelectionDraft {
  return { boundary, selectedId: "", message: "" };
}

/** Keeps the selected record while the Workspace and Deck stay the same. */
export function decisionSelectionForBoundary(selection: DecisionSelectionDraft, boundary: string): DecisionSelectionDraft {
  return selection.boundary === boundary ? selection : emptyDecisionSelection(boundary);
}

/** Manager authoring for the decision domain. Selection does not write records. */
export function NexoraDecisionDomainControls({ workspaceId, deckId, onInspect }: Props) {
  useSyncExternalStore(subscribeDecisionDomain, decisionDomainRevision, () => 0);
  useSyncExternalStore(subscribeCanonicalObjects, canonicalObjectRevision, () => 0);
  useSyncExternalStore(subscribeCausalInvestigations, causalInvestigationRevision, () => 0);
  useSyncExternalStore(subscribeCsvRealDataImports, getCsvRealDataImportVersion, () => 0);
  useSyncExternalStore(subscribeDeckDatasetReferences, () => getDeckDatasetReferenceSnapshot().references.length, () => 0);
  const boundary = decisionSelectionBoundary(workspaceId, deckId);
  const [selection, setSelection] = useState(() => emptyDecisionSelection(boundary));
  const activeSelection = decisionSelectionForBoundary(selection, boundary);
  if (activeSelection !== selection) setSelection(activeSelection);
  const { selectedId, message } = activeSelection;
  const setMessage = (next: string) => {
    setSelection((current) => ({ ...decisionSelectionForBoundary(current, boundary), message: next }));
  };
  const setSelectedId = (next: string) => {
    setSelection((current) => ({ ...decisionSelectionForBoundary(current, boundary), selectedId: next }));
  };
  const goals = listDecisionGoals(workspaceId, deckId);
  const scenarios = listDecisionScenarios(workspaceId, deckId);
  const decisions = listManagerDecisions(workspaceId, deckId);
  const plans = listExecutionPlans(workspaceId, deckId);
  const objects = listDeckCanonicalObjects(workspaceId, deckId);
  const report = (result: { ok: boolean; reason?: string }, success: string) => {
    setMessage(result.ok ? success : result.reason ?? "failed");
  };
  const write = (action: () => void) => {
    void coordinateWorkspaceMutation({ workspaceId }, action).catch(() => setMessage(WORKSPACE_UNAVAILABLE_MESSAGE));
  };
  return (
    <section data-testid="nexora-decision-panel" style={{ display: "grid", gap: "0.35rem", maxWidth: "18rem" }}>
      <strong>Decision records</strong>
      <span data-testid="nexora-decision-message">{message}</span>
      <div key={boundary}>
      <form onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        write(() => {
          const result = createDecisionGoal({
            workspaceId,
            deckId,
            name: String(data.get("goal") ?? ""),
            description: String(data.get("description") ?? ""),
            targetValue: String(data.get("target") ?? ""),
            timeHorizon: String(data.get("horizon") ?? ""),
          });
          report(result, "Goal recorded");
          if (result.ok) onInspect(result.value.goalId);
        });
      }}>
        <input name="goal" data-testid="nexora-decision-goal-name" placeholder="Goal name" />
        <input name="description" data-testid="nexora-decision-goal-description" placeholder="Description" />
        <input name="target" data-testid="nexora-decision-goal-target" placeholder="Target" />
        <input name="horizon" data-testid="nexora-decision-goal-horizon" placeholder="Time horizon" />
        <button type="submit" data-testid="nexora-decision-goal-create">Create goal</button>
      </form>
      <form onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        write(() => {
          const result = createDecisionScenario({
            workspaceId,
            deckId,
            name: String(data.get("scenario") ?? ""),
            goalId: String(data.get("goalId") ?? ""),
          });
          report(result, "Scenario recorded");
        });
      }}>
        <input name="scenario" data-testid="nexora-decision-scenario-name" placeholder="Scenario name" />
        <select name="goalId" data-testid="nexora-decision-scenario-goal" defaultValue="">
          <option value="">Select goal</option>
          {goals.filter((goal) => goal.lifecycleStatus === "ACTIVE").map((goal) => (
            <option key={goal.goalId} value={goal.goalId}>{goal.name}</option>
          ))}
        </select>
        <button type="submit" data-testid="nexora-decision-scenario-create">Create scenario</button>
      </form>
      <form onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const result = createManagerDecision({
          workspaceId,
          deckId,
          name: String(data.get("decision") ?? ""),
          scenarioId: String(data.get("scenarioId") ?? ""),
        });
        report(result, "Decision proposed");
      }}>
        <input name="decision" data-testid="nexora-decision-name" placeholder="Decision name" />
        <select name="scenarioId" data-testid="nexora-decision-scenario" defaultValue="">
          <option value="">Select scenario</option>
          {scenarios.filter((scenario) => scenario.lifecycleStatus === "PROPOSED" || scenario.lifecycleStatus === "APPROVED").map((scenario) => (
            <option key={scenario.scenarioId} value={scenario.scenarioId}>{scenario.name}</option>
          ))}
        </select>
        <button type="submit" data-testid="nexora-decision-create">Propose decision</button>
      </form>
      <form onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const decisionId = String(data.get("decisionId") ?? "");
        const reject = event.nativeEvent instanceof SubmitEvent && (event.nativeEvent.submitter as HTMLButtonElement | null)?.dataset.action === "reject";
        write(() => {
          const result = reject
            ? rejectManagerDecision({ workspaceId, deckId, decisionId })
            : approveManagerDecision({ workspaceId, deckId, decisionId });
          report(result, result.ok && result.value.lifecycleStatus === "APPROVED" ? "Decision approved" : "Decision rejected");
        });
      }}>
        <select name="decisionId" data-testid="nexora-decision-approval-target" defaultValue="">
          <option value="">Select proposed decision</option>
          {decisions.filter((decision) => decision.lifecycleStatus === "PROPOSED").map((decision) => (
            <option key={decision.decisionId} value={decision.decisionId}>{decision.name}</option>
          ))}
        </select>
        <button type="submit" data-testid="nexora-decision-approve" data-action="approve">Approve decision</button>
        <button type="submit" data-testid="nexora-decision-reject" data-action="reject">Reject decision</button>
      </form>
      <form onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        write(() => {
          const result = createExecutionPlan({
            workspaceId,
            deckId,
            name: String(data.get("plan") ?? ""),
            decisionId: String(data.get("decisionId") ?? ""),
            organizationalObjectId: String(data.get("objectId") ?? ""),
          });
          report(result, "Execution plan recorded");
        });
      }}>
        <input name="plan" data-testid="nexora-decision-plan-name" placeholder="Execution plan" />
        <select name="decisionId" data-testid="nexora-decision-plan-decision" defaultValue="">
          <option value="">Select approved decision</option>
          {decisions.filter((decision) => decision.lifecycleStatus === "APPROVED").map((decision) => (
            <option key={decision.decisionId} value={decision.decisionId}>{decision.name}</option>
          ))}
        </select>
        <select name="objectId" data-testid="nexora-decision-plan-object" defaultValue="">
          <option value="">Select organizational object</option>
          {objects.map((object) => (
            <option key={object.canonicalObjectId} value={object.canonicalObjectId}>{object.displayName}</option>
          ))}
        </select>
        <button type="submit" data-testid="nexora-decision-plan-create">Create execution plan</button>
      </form>
      </div>
      <ul>
        {[...goals, ...scenarios, ...decisions, ...plans].map((record) => {
          const id = "goalId" in record ? record.goalId : "scenarioId" in record ? record.scenarioId : "decisionId" in record ? record.decisionId : record.planId;
          return (
            <li key={id}>
              <button type="button" data-testid={`nexora-decision-record-${id}`} data-lifecycle={record.lifecycleStatus} onClick={() => { setSelectedId(id); onInspect(id); }}>
                {record.name} · {record.lifecycleStatus}
              </button>
            </li>
          );
        })}
      </ul>
      {(() => {
        const scenario = scenarios.find((entry) => entry.scenarioId === selectedId);
        if (!scenario) return null;
        const origin = scenario.causalOrigin;
        const currency = assessScenarioEvidenceCurrency({ workspaceId, deckId, scenarioId: scenario.scenarioId });
        return (
          <article data-testid="nexora-decision-scenario-detail">
            <p>{scenario.name} · {scenario.lifecycleStatus}</p>
            <p>{scenario.description}</p>
            <p>This Scenario is a proposal. Its status does not approve a Decision.</p>
            {origin ? (
              <div data-testid="nexora-decision-scenario-provenance">
                <p>Origin NexoCause</p>
                <p>Investigation {origin.investigationId}</p>
                <p>Hypothesis {origin.hypothesisId}</p>
                <p>Review {origin.reviewId}</p>
                <p>Evidence at handoff {origin.evidenceFingerprint}</p>
                <p data-testid="nexora-decision-current-evidence">Current evidence {currency.currentFingerprint ?? currency.referenceStatus}. Availability {currency.currentAvailability.join(", ") || "none"}.</p>
                <p data-testid="nexora-decision-evidence-changed">{currency.changedSinceHandoff ? "Evidence changed since handoff." : "No resolved change since handoff."}</p>
                <p>Reference {currency.referenceStatus}</p>
                <p>Observations {origin.observationIds.join(", ") || "none"}</p>
                <p>Assumptions {origin.assumptions.join("; ") || "none"}</p>
                <p>Limitations {currency.limitations.join("; ")}</p>
                <p data-causal-proof="false">Causal proof {String(origin.causalProof)}</p>
              </div>
            ) : <p data-testid="nexora-decision-scenario-provenance">No NexoCause provenance.</p>}
          </article>
        );
      })()}
    </section>
  );
}
