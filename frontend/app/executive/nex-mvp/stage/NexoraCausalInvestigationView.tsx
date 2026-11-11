"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { listManagerDeckDatasetIds } from "@/app/lib/deck/nexoraDeckDatasetReferenceAuthority";
import {
  getDeckDatasetReferenceSnapshot,
  subscribeDeckDatasetReferences,
} from "@/app/lib/deck/nexoraDeckDatasetReferenceRegistry";
import { NEXORA_EXECUTIVE_DECK_ID } from "@/app/lib/deck/nexoraDeckIdentityContract";
import { listWorkspaceDecks } from "@/app/lib/deck/nexoraDeckRegistry";
import {
  getCsvRealDataImportVersion,
  listCsvRealDataImports,
  subscribeCsvRealDataImports,
} from "@/app/lib/data-reality/csvRealDataImportStore";
import { readCommittedDatasetSnapshot } from "@/app/lib/scene-org/canonicalDatasetEntityPipeline";
import {
  canonicalObjectRevision,
  getCanonicalObject,
  listDeckCanonicalObjects,
  subscribeCanonicalObjects,
} from "@/app/lib/scene-org/canonicalObjectRegistry";
import {
  CAUSAL_ACCEPTANCE_MEANING,
  CAUSAL_EVIDENCE_ROLES,
  causalInvestigationRevision,
  createCausalHypothesis,
  createCausalInvestigation,
  createCausalObservation,
  listCausalHypothesisReviews,
  listCausalHypotheses,
  listCausalInvestigations,
  listCausalObservations,
  resolveCausalObjectReference,
  subscribeCausalInvestigations,
  transitionCausalInvestigation,
  updateCausalHypothesis,
  updateCausalInvestigation,
  type CausalEvidenceRole,
  type CausalHypothesis,
  type CausalHypothesisReviewAction,
  type CausalInvestigation,
} from "@/app/lib/scene-org/canonicalCausalInvestigationDomain";
import {
  assessCausalHypothesisReadiness,
  CAUSAL_REVIEW_ACCEPTANCE_MEANING,
  reviewCausalHypothesis,
  type CausalHypothesisReviewReceipt,
} from "@/app/lib/scene-org/causalHypothesisReview";
import {
  commitCausalScenarioHandoff,
  prepareCausalScenarioHandoff,
  type CausalScenarioHandoffProposal,
  type CausalScenarioHandoffReceipt,
} from "@/app/lib/scene-org/causalScenarioHandoff";
import {
  decisionDomainRevision,
  listDecisionGoals,
  subscribeDecisionDomain,
} from "@/app/lib/scene-org/canonicalDecisionDomain";
import {
  CAUSAL_INVESTIGATION_DEMO_NOTICE,
  CAUSAL_INVESTIGATION_EMPTY,
  CAUSAL_INVESTIGATION_EXECUTIVE_NOTICE,
  CAUSAL_INVESTIGATION_REFERENCE_NOTICE,
  CAUSAL_REVIEW_ACTION_LABELS,
  causalEvidenceStatusText,
  causalReviewActionsForStatus,
} from "@/app/lib/scene-org/causalInvestigationStageContract";
import {
  getCausalInvestigationUiSelectionServerSnapshot,
  getCausalInvestigationUiSelectionSnapshot,
  publishCausalInvestigationUiSelection,
  readCausalInvestigationUiSelection,
  subscribeCausalInvestigationUiSelection,
} from "@/app/lib/scene-org/causalInvestigationUiSession";
import { isProtectedDemoWorkspaceId } from "@/app/lib/workspace/workspaceRegistryContract";
import { coordinateWorkspaceMutation } from "@/app/lib/workspace/workspaceAuthorityFence";
import { cockpit } from "../../exs1/shell/executiveCockpitTheme";

type Props = Readonly<{
  workspaceId: string;
  deckId: string | null;
  onInspectObject?: (canonicalObjectId: string) => void;
  onOpenDecision?: () => void;
}>;

function operationIdentity(): string {
  const random = globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}${Math.random().toString(16).slice(2)}`;
  return `review-${random}`.replace(/[^A-Za-z0-9:._-]/g, "").slice(0, 80);
}

function failureText(reason: string): string {
  if (reason === "stale-evidence") {
    return "The evidence changed before this review was saved. The current reading is shown. Acknowledge it again.";
  }
  if (reason === "acknowledgment-required") {
    return "Acceptance needs an explicit acknowledgment of the unresolved limitations.";
  }
  if (reason === "blocked-evidence") return "Acceptance is blocked until the evidence can be read.";
  if (reason === "stale-handoff") return "The evidence changed after this handoff was prepared. Inspect the current reading before continuing.";
  if (reason === "reassessment-required") return "The historical acceptance remains. Current evidence differs, so this handoff was not created. Reassess the current evidence before another Scenario.";
  if (reason === "claim-unrecorded") return "This historical review does not record the hypothesis claim. Reassess the current claim before creating a Scenario.";
  if (reason === "revision-conflict") return "This record changed in another tab. Review the current version before trying again.";
  if (reason === "unchanged-evidence") return "Current evidence still matches the historical review. Another acknowledgment was not recorded.";
  if (reason === "ineligible-status") return "Only a hypothesis accepted for scenario exploration can start a Scenario.";
  if (reason === "limitations-required") return "Record the limitations that this Scenario does not prove.";
  if (reason === "operation-conflict") return "This submission does not match the Scenario already created for that operation.";
  if (reason === "invalid-goal") return "Select an active Goal in this Deck.";
  if (reason === "storage-failed") return "The review was not saved.";
  if (reason === "protected-workspace") return "This Demo workspace does not accept NexoCause changes.";
  return `The action was not saved (${reason}).`;
}

function lines(value: string): string[] {
  return value.split("\n").map((entry) => entry.trim()).filter((entry) => entry.length > 0);
}

export type CausalHandoffDraft = {
  boundary: string;
  proposal: CausalScenarioHandoffProposal | null;
  receipt: CausalScenarioHandoffReceipt | null;
  failure: string;
  operationId: string;
  scenarioName: string;
  intervention: string;
  assumptions: string;
  limitations: string;
  goalId: string;
  acknowledged: boolean;
};

/** Workspace and Deck together own one Scenario draft. */
export function causalHandoffBoundary(workspaceId: string, deckId: string | null): string {
  return `${workspaceId}\0${deckId ?? ""}`;
}

export function emptyCausalHandoffDraft(boundary: string): CausalHandoffDraft {
  return {
    boundary,
    proposal: null,
    receipt: null,
    failure: "",
    operationId: "",
    scenarioName: "",
    intervention: "",
    assumptions: "",
    limitations: "",
    goalId: "",
    acknowledged: false,
  };
}

/** Preserves an in-progress draft inside its boundary and starts empty after a Workspace or Deck change. */
export function causalHandoffDraftForBoundary(draft: CausalHandoffDraft, boundary: string): CausalHandoffDraft {
  return draft.boundary === boundary ? draft : emptyCausalHandoffDraft(boundary);
}

export function NexoraCausalInvestigationView({ workspaceId, deckId, onInspectObject, onOpenDecision }: Props) {
  const investigationRevision = useSyncExternalStore(subscribeCausalInvestigations, causalInvestigationRevision, () => 0);
  const objectRevision = useSyncExternalStore(subscribeCanonicalObjects, canonicalObjectRevision, () => 0);
  const datasetVersion = useSyncExternalStore(subscribeCsvRealDataImports, getCsvRealDataImportVersion, () => 0);
  const referenceVersion = useSyncExternalStore(
    subscribeDeckDatasetReferences,
    () => getDeckDatasetReferenceSnapshot().references.length,
    () => 0,
  );
  const selectionMap = useSyncExternalStore(
    subscribeCausalInvestigationUiSelection,
    getCausalInvestigationUiSelectionSnapshot,
    getCausalInvestigationUiSelectionServerSnapshot,
  );
  void investigationRevision;
  void objectRevision;
  void datasetVersion;
  void referenceVersion;
  void selectionMap;

  const protectedDemo = isProtectedDemoWorkspaceId(workspaceId);
  const executiveDeck = deckId === NEXORA_EXECUTIVE_DECK_ID;
  const blocked = protectedDemo || deckId == null || executiveDeck;
  const investigations = !blocked && deckId ? listCausalInvestigations(workspaceId, deckId) : [];
  const stored = deckId ? readCausalInvestigationUiSelection(workspaceId, deckId) : null;
  const investigation = stored
    ? investigations.find((entry) => entry.investigationId === stored.investigationId) ?? null
    : null;
  const observations = investigation ? listCausalObservations(workspaceId, investigation.investigationId) : [];
  const hypotheses = investigation ? listCausalHypotheses(workspaceId, investigation.investigationId) : [];
  const hypothesis = stored?.hypothesisId
    ? hypotheses.find((entry) => entry.hypothesisId === stored.hypothesisId) ?? null
    : null;
  const readiness = investigation && hypothesis && deckId
    ? assessCausalHypothesisReadiness({
      workspaceId,
      deckId,
      investigationId: investigation.investigationId,
      hypothesisId: hypothesis.hypothesisId,
    })
    : null;
  const reviews = hypothesis ? listCausalHypothesisReviews(workspaceId, hypothesis.hypothesisId) : [];
  const objects = !blocked && deckId ? listDeckCanonicalObjects(workspaceId, deckId) : [];
  const deck = deckId ? listWorkspaceDecks(workspaceId).find((entry) => entry.deckId === deckId) ?? null : null;
  const datasets = !blocked && deckId
    ? listCsvRealDataImports(workspaceId).filter((dataset) => listManagerDeckDatasetIds(workspaceId, deckId).includes(dataset.sourceContextId))
    : [];
  const editable = investigation != null && investigation.lifecycleStatus !== "ARCHIVED" && investigation.lifecycleStatus !== "DELETED";
  const [note, setNote] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [failure, setFailure] = useState("");
  const [receipt, setReceipt] = useState<CausalHypothesisReviewReceipt | null>(null);
  const [reviewHypothesisId, setReviewHypothesisId] = useState("");
  const decisionRevision = useSyncExternalStore(subscribeDecisionDomain, decisionDomainRevision, () => 0);
  void decisionRevision;
  const handoffBoundary = causalHandoffBoundary(workspaceId, deckId);
  const [handoff, setHandoff] = useState(() => emptyCausalHandoffDraft(handoffBoundary));
  const activeHandoff = causalHandoffDraftForBoundary(handoff, handoffBoundary);
  if (activeHandoff !== handoff) setHandoff(activeHandoff);

  if (reviewHypothesisId !== (hypothesis?.hypothesisId ?? "")) {
    setReviewHypothesisId(hypothesis?.hypothesisId ?? "");
    setAcknowledged(false);
    setFailure("");
    setReceipt(null);
  }

  useEffect(() => {
    if (!deckId || blocked) return;
    if (stored && !investigation) publishCausalInvestigationUiSelection(workspaceId, deckId, null);
    else if (stored?.hypothesisId && !hypothesis) {
      publishCausalInvestigationUiSelection(workspaceId, deckId, {
        investigationId: stored.investigationId,
        hypothesisId: null,
        canonicalObjectId: stored.canonicalObjectId,
      });
    }
  }, [blocked, deckId, hypothesis, investigation, stored, workspaceId]);

  const selectInvestigation = (investigationId: string) => {
    if (!deckId) return;
    publishCausalInvestigationUiSelection(workspaceId, deckId, {
      investigationId,
      hypothesisId: null,
      canonicalObjectId: null,
    });
  };

  const selectHypothesis = (entry: CausalHypothesis) => {
    if (!deckId || !investigation) return;
    publishCausalInvestigationUiSelection(workspaceId, deckId, {
      investigationId: investigation.investigationId,
      hypothesisId: entry.hypothesisId,
      canonicalObjectId: stored?.canonicalObjectId ?? null,
    });
  };

  const selectObject = (canonicalObjectId: string) => {
    if (!deckId || !investigation) return;
    const resolved = resolveCausalObjectReference({ workspaceId, deckId, canonicalObjectId });
    publishCausalInvestigationUiSelection(workspaceId, deckId, {
      investigationId: investigation.investigationId,
      hypothesisId: hypothesis?.hypothesisId ?? null,
      canonicalObjectId,
    });
    if (resolved.state === "active") onInspectObject?.(canonicalObjectId);
  };

  const submitReview = (action: CausalHypothesisReviewAction) => {
    if (!deckId || !investigation || !hypothesis || !readiness?.ok) return;
    void coordinateWorkspaceMutation({ workspaceId }, () => {
    const result = reviewCausalHypothesis({
      workspaceId,
      deckId,
      investigationId: investigation.investigationId,
      hypothesisId: hypothesis.hypothesisId,
      action,
      managerNote: note,
      operationId: operationIdentity(),
      acknowledgeLimitations: action === "ACCEPT_FOR_SCENARIO" || action === "REASSESS_EVIDENCE" ? acknowledged : false,
      evidenceFingerprint: readiness.value.evidenceFingerprint,
      hypothesisStatement: hypothesis.statement,
    });
    if (!result.ok) {
      setReceipt(null);
      setFailure(failureText(result.reason));
      if (result.reason === "stale-evidence") setAcknowledged(false);
      return;
    }
    setFailure("");
    setReceipt(result.value);
    setAcknowledged(false);
    }).catch((error: unknown) => {
      setReceipt(null);
      setFailure(error instanceof Error ? error.message : "Workspace is no longer available. Refresh or select another Workspace.");
    });
  };

  const board = (
    <section data-testid="nexora-causal-stage" data-causal-proof="false" style={{ minWidth: 0, overflow: "auto", padding: "0.75rem", color: cockpit.text }}>
      <style>{`
        .nexora-causal-board { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 0.75rem; }
        @media (max-width: 900px) { .nexora-causal-board { grid-template-columns: minmax(0, 1fr); } }
        [data-testid="nexora-causal-stage"] button:focus-visible,
        [data-testid="nexora-causal-inspection"] button:focus-visible,
        [data-testid="nexora-causal-inspection"] input:focus-visible,
        [data-testid="nexora-causal-inspection"] textarea:focus-visible,
        [data-testid="nexora-causal-inspection"] select:focus-visible {
          outline: 2px solid ${cockpit.accent};
          outline-offset: 2px;
        }
      `}</style>
      <p style={{ margin: 0, letterSpacing: "0.16em", fontSize: "0.72rem" }}>NEXOCAUSE</p>
      <h2 style={{ margin: "0.2rem 0 0.35rem", fontSize: "1.05rem" }}>Investigation View</h2>
      <p data-testid="nexora-causal-reference-notice" style={{ margin: "0 0 0.75rem", fontSize: "0.78rem", color: cockpit.textSoft }}>
        {CAUSAL_INVESTIGATION_REFERENCE_NOTICE}
      </p>
      {blocked ? (
        <p role="status" data-testid="nexora-causal-unavailable">
          {protectedDemo || deckId == null ? CAUSAL_INVESTIGATION_DEMO_NOTICE : CAUSAL_INVESTIGATION_EXECUTIVE_NOTICE}
        </p>
      ) : investigation == null ? (
        <p role="status" data-testid="nexora-causal-empty">{investigations.length === 0 ? CAUSAL_INVESTIGATION_EMPTY : "Select an investigation."}</p>
      ) : (
        <>
          <article data-testid="nexora-causal-problem" style={{ border: `1px solid ${cockpit.border}`, borderRadius: 8, padding: "0.75rem", marginBottom: "0.75rem" }}>
            <p style={{ margin: 0, fontSize: "0.68rem", letterSpacing: "0.12em" }}>PROBLEM</p>
            <h3 style={{ margin: "0.25rem 0" }}>{investigation.title}</h3>
            <p style={{ margin: 0 }}>{investigation.problemStatement}</p>
            <p style={{ margin: "0.45rem 0 0", fontSize: "0.75rem" }}>Status {investigation.lifecycleStatus}</p>
          </article>
          <div className="nexora-causal-board">
            <article data-testid="nexora-causal-observations" style={{ border: `1px solid ${cockpit.border}`, borderRadius: 8, padding: "0.7rem" }}>
              <p style={{ margin: 0, fontSize: "0.68rem", letterSpacing: "0.12em" }}>OBSERVATIONS</p>
              {observations.length === 0 ? <p>No observations recorded.</p> : observations.map((observation) => {
                const object = resolveCausalObjectReference({ workspaceId, deckId: deckId!, canonicalObjectId: observation.canonicalObjectId });
                return (
                  <p key={observation.observationId} data-testid={`nexora-causal-observation-${observation.observationId}`}>
                    <span>Observation. </span>{observation.statement}
                    {observation.canonicalObjectId ? (
                      <>
                        {" "}
                        <button type="button" onClick={() => selectObject(observation.canonicalObjectId!)}>
                          {object.state === "active" || object.state === "archived" ? object.displayName : "Unavailable reference"}
                        </button>
                        <span> {object.state}</span>
                      </>
                    ) : null}
                  </p>
                );
              })}
              <p style={{ fontSize: "0.68rem", letterSpacing: "0.12em" }}>EVIDENCE</p>
              <p>{readiness?.ok ? `${readiness.value.items.length} current readings` : "Select a hypothesis to read evidence."}</p>
            </article>
            <article data-testid="nexora-causal-hypotheses" style={{ border: `1px solid ${cockpit.border}`, borderRadius: 8, padding: "0.7rem" }}>
              <p style={{ margin: 0, fontSize: "0.68rem", letterSpacing: "0.12em" }}>HYPOTHESES</p>
              {hypotheses.length === 0 ? <p>No hypotheses recorded.</p> : hypotheses.map((entry) => (
                <p key={entry.hypothesisId}>
                  <button type="button" aria-pressed={entry.hypothesisId === hypothesis?.hypothesisId} data-testid={`nexora-causal-hypothesis-${entry.hypothesisId}`} onClick={() => selectHypothesis(entry)}>
                    {entry.statement}
                  </button>
                  <span> {entry.status === "ACCEPTED_FOR_SCENARIO" ? "Accepted for scenario" : entry.status}</span>
                </p>
              ))}
              <p style={{ fontSize: "0.68rem", letterSpacing: "0.12em" }}>REVIEW STATUS</p>
              <p data-testid="nexora-causal-review-status">
                {hypothesis == null ? "No hypothesis selected." : readiness?.ok ? readiness.value.classification : readiness?.reason ?? "Unread"}
              </p>
            </article>
          </div>
          <p data-testid="nexora-causal-manager-join" style={{ marginTop: "0.75rem", fontSize: "0.78rem" }}>
            MANAGER REVIEW — acceptance permits scenario evaluation. {CAUSAL_ACCEPTANCE_MEANING}
          </p>
        </>
      )}
    </section>
  );

  const inspection = (
    <section data-testid="nexora-causal-inspection" style={{ display: "grid", gap: "0.75rem", padding: "0.75rem", color: cockpit.text, maxHeight: "70vh", overflow: "auto" }}>
      <h2 style={{ margin: 0, fontSize: "0.95rem" }}>NexoCause</h2>
      {blocked ? (
        <p role="status">{protectedDemo || deckId == null ? CAUSAL_INVESTIGATION_DEMO_NOTICE : CAUSAL_INVESTIGATION_EXECUTIVE_NOTICE}</p>
      ) : (
        <Inspection
          workspaceId={workspaceId}
          deckId={deckId!}
          deckName={deck?.name ?? deckId!}
          investigations={investigations}
          investigation={investigation}
          observations={observations}
          hypotheses={hypotheses}
          hypothesis={hypothesis}
          objects={objects.map((object) => ({ id: object.canonicalObjectId, name: object.displayName, type: object.objectType }))}
          datasets={datasets.map((dataset) => {
            const snapshot = readCommittedDatasetSnapshot(workspaceId, dataset.sourceContextId);
            return {
              datasetId: dataset.sourceContextId,
              fileName: dataset.prepared.fileName,
              importId: snapshot.ok ? snapshot.value.importId : "",
            };
          })}
          selectedObjectId={stored?.canonicalObjectId ?? null}
          editable={editable}
          note={note}
          acknowledged={acknowledged}
          failure={failure}
          receipt={receipt}
          readiness={readiness}
          reviews={reviews.map((review) => ({
            reviewId: review.reviewId,
            action: review.action,
            previousStatus: review.previousStatus,
            newStatus: review.newStatus,
            managerNote: review.managerNote,
            limitationsAcknowledged: review.limitationsAcknowledged,
            operationId: review.operationId,
            evidenceFingerprint: review.evidenceFingerprint,
          }))}
          onNote={setNote}
          onAcknowledge={setAcknowledged}
          onSelectInvestigation={selectInvestigation}
          onSelectHypothesis={selectHypothesis}
          onSelectObject={selectObject}
          onSubmitReview={submitReview}
          onMessage={(message) => {
            setFailure(message);
            if (message) setReceipt(null);
          }}
        />
      )}
      {hypothesis && deckId && hypothesis.status === "ACCEPTED_FOR_SCENARIO" ? (
        <ScenarioHandoffPanel
          proposal={activeHandoff.proposal}
          receipt={activeHandoff.receipt}
          failure={activeHandoff.failure}
          scenarioName={activeHandoff.scenarioName}
          intervention={activeHandoff.intervention}
          assumptions={activeHandoff.assumptions}
          limitations={activeHandoff.limitations}
          goalId={activeHandoff.goalId}
          acknowledged={activeHandoff.acknowledged}
          goals={listDecisionGoals(workspaceId, deckId).filter((goal) => goal.lifecycleStatus === "ACTIVE")}
          onExplore={() => {
            const prepared = prepareCausalScenarioHandoff({
              workspaceId,
              deckId,
              investigationId: hypothesis.investigationId,
              hypothesisId: hypothesis.hypothesisId,
            });
            if (!prepared.ok) {
              setHandoff((current) => ({
                ...causalHandoffDraftForBoundary(current, handoffBoundary),
                proposal: null,
                failure: failureText(prepared.reason),
              }));
              return;
            }
            setHandoff((current) => {
              const base = causalHandoffDraftForBoundary(current, handoffBoundary);
              return {
                ...base,
                failure: "",
                proposal: prepared.value,
                operationId: base.operationId || operationIdentity().replace("review-", "handoff-"),
                assumptions: prepared.value.assumptions.join("\n"),
                limitations: prepared.value.limitations.join("\n") || "This Scenario does not prove the hypothesis.",
              };
            });
          }}
          onScenarioName={(scenarioName) => setHandoff((current) => ({ ...causalHandoffDraftForBoundary(current, handoffBoundary), scenarioName }))}
          onIntervention={(intervention) => setHandoff((current) => ({ ...causalHandoffDraftForBoundary(current, handoffBoundary), intervention }))}
          onAssumptions={(assumptions) => setHandoff((current) => ({ ...causalHandoffDraftForBoundary(current, handoffBoundary), assumptions }))}
          onLimitations={(limitations) => setHandoff((current) => ({ ...causalHandoffDraftForBoundary(current, handoffBoundary), limitations }))}
          onGoal={(goalId) => setHandoff((current) => ({ ...causalHandoffDraftForBoundary(current, handoffBoundary), goalId }))}
          onAcknowledge={(acknowledged) => setHandoff((current) => ({ ...causalHandoffDraftForBoundary(current, handoffBoundary), acknowledged }))}
          onConfirm={() => {
            if (!activeHandoff.proposal) return;
            const proposal = activeHandoff.proposal;
            void coordinateWorkspaceMutation({ workspaceId }, () => {
            const committed = commitCausalScenarioHandoff({
              workspaceId,
              deckId,
              investigationId: hypothesis.investigationId,
              hypothesisId: hypothesis.hypothesisId,
              targetGoalId: activeHandoff.goalId,
              scenarioName: activeHandoff.scenarioName,
              intervention: activeHandoff.intervention,
              assumptions: activeHandoff.assumptions.split("\n"),
              limitations: activeHandoff.limitations.split("\n"),
              operationId: activeHandoff.operationId,
              evidenceFingerprint: proposal.evidenceFingerprint,
              acknowledgeLimitations: activeHandoff.acknowledged,
            });
            if (!committed.ok) {
              const stale = committed.reason === "stale-handoff" || committed.reason === "reassessment-required";
              setHandoff((current) => {
                const base = causalHandoffDraftForBoundary(current, handoffBoundary);
                return {
                  ...base,
                  receipt: null,
                  failure: failureText(committed.reason),
                  proposal: stale ? null : base.proposal,
                  acknowledged: stale ? false : base.acknowledged,
                };
              });
              return;
            }
            setHandoff((current) => ({
              ...causalHandoffDraftForBoundary(current, handoffBoundary),
              failure: "",
              receipt: committed.value,
            }));
            }).catch((error: unknown) => {
              setHandoff((current) => ({
                ...causalHandoffDraftForBoundary(current, handoffBoundary),
                receipt: null,
                failure: error instanceof Error ? error.message : "Workspace is no longer available. Refresh or select another Workspace.",
              }));
            });
          }}
          onOpenDecision={onOpenDecision}
        />
      ) : null}
    </section>
  );

  const slot = typeof document === "undefined" ? null : document.getElementById("nexora-causal-inspection-slot");
  return (
    <>
      {board}
      {slot ? createPortal(inspection, slot) : inspection}
    </>
  );
}

function Inspection(props: {
  workspaceId: string;
  deckId: string;
  deckName: string;
  investigations: readonly CausalInvestigation[];
  investigation: CausalInvestigation | null;
  observations: ReturnType<typeof listCausalObservations>;
  hypotheses: readonly CausalHypothesis[];
  hypothesis: CausalHypothesis | null;
  objects: readonly { id: string; name: string; type: string }[];
  datasets: readonly { datasetId: string; fileName: string; importId: string }[];
  selectedObjectId: string | null;
  editable: boolean;
  note: string;
  acknowledged: boolean;
  failure: string;
  receipt: CausalHypothesisReviewReceipt | null;
  readiness: ReturnType<typeof assessCausalHypothesisReadiness> | null;
  reviews: readonly {
    reviewId: string;
    action: string;
    previousStatus: string;
    newStatus: string;
    managerNote: string;
    limitationsAcknowledged: boolean;
    operationId: string;
    evidenceFingerprint: string;
  }[];
  onNote: (value: string) => void;
  onAcknowledge: (value: boolean) => void;
  onSelectInvestigation: (investigationId: string) => void;
  onSelectHypothesis: (hypothesis: CausalHypothesis) => void;
  onSelectObject: (canonicalObjectId: string) => void;
  onSubmitReview: (action: CausalHypothesisReviewAction) => void;
  onMessage: (message: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [problem, setProblem] = useState("");
  const [statement, setStatement] = useState("");
  const [objectId, setObjectId] = useState("");
  const [datasetId, setDatasetId] = useState("");
  const [sourceKey, setSourceKey] = useState("");
  const [fieldName, setFieldName] = useState("");
  const [period, setPeriod] = useState("");
  const [measure, setMeasure] = useState("");
  const [unit, setUnit] = useState("");
  const [hypothesisText, setHypothesisText] = useState("");
  const [assumptionText, setAssumptionText] = useState("");
  const [limitationText, setLimitationText] = useState("");
  const [linkedObservations, setLinkedObservations] = useState<string[]>([]);
  const [linkedObjects, setLinkedObjects] = useState<string[]>([]);
  const [roles, setRoles] = useState<Record<string, CausalEvidenceRole>>({});
  const active = props.investigations.filter((entry) => entry.lifecycleStatus !== "ARCHIVED" && entry.lifecycleStatus !== "DELETED");
  const archived = props.investigations.filter((entry) => entry.lifecycleStatus === "ARCHIVED" || entry.lifecycleStatus === "DELETED");
  const selectedObject = props.selectedObjectId
    ? resolveCausalObjectReference({ workspaceId: props.workspaceId, deckId: props.deckId, canonicalObjectId: props.selectedObjectId })
    : null;
  const selectedRecord = selectedObject?.state === "active" || selectedObject?.state === "archived"
    ? getCanonicalObject(props.workspaceId, props.selectedObjectId ?? "")
    : null;
  const actions = props.hypothesis ? causalReviewActionsForStatus(props.hypothesis.status) : [];
  const evidence = props.readiness?.ok ? props.readiness.value : null;
  const authorization = [...props.reviews].reverse().find((review) => (
    review.action === "ACCEPT_FOR_SCENARIO" || review.action === "REASSESS_EVIDENCE"
  ) && review.newStatus === "ACCEPTED_FOR_SCENARIO");
  const evidenceChanged = Boolean(authorization && evidence && authorization.evidenceFingerprint !== evidence.evidenceFingerprint);

  return (
    <>
      <section data-testid="nexora-causal-details">
        <h3>Investigation Details</h3>
        <p>Workspace {props.workspaceId}</p>
        <p>Deck {props.deckName}</p>
        <form onSubmit={(event) => {
          event.preventDefault();
          void coordinateWorkspaceMutation({ workspaceId: props.workspaceId }, () => {
            const created = createCausalInvestigation({ workspaceId: props.workspaceId, deckId: props.deckId, title, problemStatement: problem });
            props.onMessage(created.ok ? "" : failureText(created.reason));
            if (created.ok) {
              setTitle("");
              setProblem("");
              props.onSelectInvestigation(created.value.investigationId);
            }
          });
        }}>
          <label>Title <input data-testid="nexora-causal-title" value={title} onChange={(event) => setTitle(event.target.value)} /></label>
          <label>Problem statement <textarea data-testid="nexora-causal-problem-input" value={problem} onChange={(event) => setProblem(event.target.value)} /></label>
          <button type="submit" data-testid="nexora-causal-create">Create investigation</button>
        </form>
        {props.investigations.length === 0 ? <p data-testid="nexora-causal-empty-list">{CAUSAL_INVESTIGATION_EMPTY}</p> : null}
        <ul>
          {active.map((entry) => (
            <li key={entry.investigationId}>
              <button type="button" aria-pressed={entry.investigationId === props.investigation?.investigationId} data-testid={`nexora-causal-open-${entry.investigationId}`} onClick={() => props.onSelectInvestigation(entry.investigationId)}>
                {entry.title}
              </button>
              <span> {entry.lifecycleStatus}</span>
            </li>
          ))}
        </ul>
        {archived.length > 0 ? (
          <ul data-testid="nexora-causal-archived">
            {archived.map((entry) => (
              <li key={entry.investigationId} data-investigation-state={entry.lifecycleStatus}>
                <button type="button" onClick={() => props.onSelectInvestigation(entry.investigationId)}>{entry.title}</button>
                <span> {entry.lifecycleStatus}</span>
              </li>
            ))}
          </ul>
        ) : null}
        {props.investigation ? (
          <form key={props.investigation.investigationId} onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            void coordinateWorkspaceMutation({ workspaceId: props.workspaceId }, () => {
              const updated = updateCausalInvestigation({
                workspaceId: props.workspaceId,
                deckId: props.deckId,
                investigationId: props.investigation!.investigationId,
                title: String(form.get("title") ?? ""),
                problemStatement: String(form.get("problem") ?? ""),
              });
              props.onMessage(updated.ok ? "" : failureText(updated.reason));
            });
          }}>
            <p>Status {props.investigation.lifecycleStatus}</p>
            <label>Title <input name="title" data-testid="nexora-causal-edit-title" defaultValue={props.investigation.title} disabled={!props.editable} /></label>
            <label>Problem statement <textarea name="problem" data-testid="nexora-causal-edit-problem" defaultValue={props.investigation.problemStatement} disabled={!props.editable} /></label>
            <button type="submit" data-testid="nexora-causal-save" disabled={!props.editable}>Save investigation</button>
            <button type="button" data-testid="nexora-causal-archive" disabled={!props.editable} onClick={() => {
              const archivedInvestigation = transitionCausalInvestigation({
                workspaceId: props.workspaceId,
                deckId: props.deckId,
                investigationId: props.investigation!.investigationId,
                lifecycleStatus: "ARCHIVED",
              });
              props.onMessage(archivedInvestigation.ok ? "" : failureText(archivedInvestigation.reason));
            }}>Archive investigation</button>
            {!props.editable ? <p>Archived and deleted investigations cannot be edited.</p> : null}
          </form>
        ) : null}
      </section>

      {props.investigation ? (
        <section data-testid="nexora-causal-observation-author">
          <h3>Observations</h3>
          {props.observations.map((observation) => {
            const availability = evidence?.items.find((item) => item.observationId === observation.observationId)?.availability;
            const object = resolveCausalObjectReference({ workspaceId: props.workspaceId, deckId: props.deckId, canonicalObjectId: observation.canonicalObjectId });
            return (
              <article key={observation.observationId}>
                <p>{observation.statement}</p>
                <p>
                  Object {observation.canonicalObjectId
                    ? `${object.state === "active" || object.state === "archived" ? object.displayName : "Unavailable reference"} · ${object.state}`
                    : "none"}
                </p>
                <p>Dataset {observation.datasetReference?.datasetId ?? "none"}</p>
                <p>Period {observation.periodLabel ?? "none"} · Unit {observation.unit ?? "none"}</p>
                <p>Evidence availability {availability ? causalEvidenceStatusText(availability) : "unread"}</p>
              </article>
            );
          })}
          <form onSubmit={(event) => {
            event.preventDefault();
            const dataset = props.datasets.find((entry) => entry.datasetId === datasetId);
            void coordinateWorkspaceMutation({ workspaceId: props.workspaceId }, () => {
            const created = createCausalObservation({
              workspaceId: props.workspaceId,
              deckId: props.deckId,
              investigationId: props.investigation!.investigationId,
              statement,
              canonicalObjectId: objectId || null,
              datasetReference: dataset ? {
                datasetId: dataset.datasetId,
                importId: dataset.importId || null,
                sourceKey: sourceKey || null,
                fieldName: fieldName || null,
              } : null,
              periodLabel: period || null,
              measureName: measure || null,
              unit: unit || null,
            });
            props.onMessage(created.ok ? "" : failureText(created.reason));
            if (created.ok) {
              setStatement("");
              setSourceKey("");
              setFieldName("");
            }
            });
          }}>
            <label>Observation <textarea data-testid="nexora-causal-observation-input" value={statement} onChange={(event) => setStatement(event.target.value)} disabled={!props.editable} /></label>
            <label>Canonical object
              <select data-testid="nexora-causal-observation-object" value={objectId} onChange={(event) => setObjectId(event.target.value)} disabled={!props.editable}>
                <option value="">None</option>
                {props.objects.map((object) => <option key={object.id} value={object.id}>{object.name} · {object.type}</option>)}
              </select>
            </label>
            <label>Committed dataset
              <select data-testid="nexora-causal-observation-dataset" value={datasetId} onChange={(event) => setDatasetId(event.target.value)} disabled={!props.editable}>
                <option value="">None</option>
                {props.datasets.map((dataset) => <option key={dataset.datasetId} value={dataset.datasetId}>{dataset.fileName}</option>)}
              </select>
            </label>
            <label>Source identity <input data-testid="nexora-causal-source-key" value={sourceKey} onChange={(event) => setSourceKey(event.target.value)} disabled={!props.editable} /></label>
            <label>Measurement field <input data-testid="nexora-causal-field" value={fieldName} onChange={(event) => setFieldName(event.target.value)} disabled={!props.editable} /></label>
            <label>Period <input data-testid="nexora-causal-period" value={period} onChange={(event) => setPeriod(event.target.value)} disabled={!props.editable} /></label>
            <label>Measure <input data-testid="nexora-causal-measure" value={measure} onChange={(event) => setMeasure(event.target.value)} disabled={!props.editable} /></label>
            <label>Unit <input data-testid="nexora-causal-unit" value={unit} onChange={(event) => setUnit(event.target.value)} disabled={!props.editable} /></label>
            <button type="submit" data-testid="nexora-causal-add-observation" disabled={!props.editable}>Add observation</button>
          </form>
        </section>
      ) : null}

      {props.investigation ? (
        <section data-testid="nexora-causal-hypothesis-author">
          <h3>Hypotheses</h3>
          {props.hypotheses.map((entry) => (
            <p key={entry.hypothesisId}>
              <button type="button" aria-pressed={entry.hypothesisId === props.hypothesis?.hypothesisId} onClick={() => props.onSelectHypothesis(entry)}>{entry.statement}</button>
              <span> {entry.status}</span>
            </p>
          ))}
          <form onSubmit={(event) => {
            event.preventDefault();
            const evidenceRoles = linkedObservations
              .filter((observationId) => roles[observationId])
              .map((observationId) => ({ observationId, role: roles[observationId]! }));
            void coordinateWorkspaceMutation({ workspaceId: props.workspaceId }, () => {
            const created = createCausalHypothesis({
              workspaceId: props.workspaceId,
              deckId: props.deckId,
              investigationId: props.investigation!.investigationId,
              statement: hypothesisText,
              observationIds: linkedObservations,
              canonicalObjectIds: linkedObjects,
              assumptions: lines(assumptionText),
              limitations: lines(limitationText),
              evidenceRoles,
            });
            props.onMessage(created.ok ? "" : failureText(created.reason));
            if (created.ok) {
              setHypothesisText("");
              props.onSelectHypothesis(created.value);
            }
            });
          }}>
            <label>Hypothesis <textarea data-testid="nexora-causal-hypothesis-input" value={hypothesisText} onChange={(event) => setHypothesisText(event.target.value)} disabled={!props.editable} /></label>
            <fieldset>
              <legend>Associate observations</legend>
              {props.observations.filter((observation) => observation.lifecycleStatus === "ACTIVE").map((observation) => (
                <label key={observation.observationId}>
                  <input type="checkbox" checked={linkedObservations.includes(observation.observationId)} disabled={!props.editable} onChange={(event) => {
                    setLinkedObservations((current) => event.target.checked
                      ? [...current, observation.observationId]
                      : current.filter((id) => id !== observation.observationId));
                  }} />
                  {observation.statement}
                  <select aria-label={`Evidence role for ${observation.statement}`} value={roles[observation.observationId] ?? ""} disabled={!props.editable} onChange={(event) => setRoles((current) => ({ ...current, [observation.observationId]: event.target.value as CausalEvidenceRole }))}>
                    <option value="">Role</option>
                    {CAUSAL_EVIDENCE_ROLES.map((role) => <option key={role} value={role}>{role}</option>)}
                  </select>
                </label>
              ))}
            </fieldset>
            <fieldset>
              <legend>Referenced objects</legend>
              {props.objects.map((object) => (
                <label key={object.id}>
                  <input type="checkbox" checked={linkedObjects.includes(object.id)} disabled={!props.editable} onChange={(event) => {
                    setLinkedObjects((current) => event.target.checked ? [...current, object.id] : current.filter((id) => id !== object.id));
                  }} />
                  {object.name}
                </label>
              ))}
            </fieldset>
            <label>Assumptions <textarea data-testid="nexora-causal-assumptions" value={assumptionText} onChange={(event) => setAssumptionText(event.target.value)} disabled={!props.editable} /></label>
            <label>Limitations <textarea data-testid="nexora-causal-limitations" value={limitationText} onChange={(event) => setLimitationText(event.target.value)} disabled={!props.editable} /></label>
            <button type="submit" data-testid="nexora-causal-add-hypothesis" disabled={!props.editable}>Create hypothesis</button>
          </form>
          {props.hypothesis && props.hypothesis.status !== "ARCHIVED" ? (
            <form key={props.hypothesis.hypothesisId} onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              void coordinateWorkspaceMutation({ workspaceId: props.workspaceId }, () => {
              const updated = updateCausalHypothesis({
                workspaceId: props.workspaceId,
                deckId: props.deckId,
                hypothesisId: props.hypothesis!.hypothesisId,
                statement: String(form.get("statement") ?? ""),
                assumptions: lines(String(form.get("assumptions") ?? "")),
                limitations: lines(String(form.get("limitations") ?? "")),
              });
              props.onMessage(updated.ok ? "" : failureText(updated.reason));
              });
            }}>
              <label>Hypothesis statement <textarea name="statement" defaultValue={props.hypothesis.statement} disabled={!props.editable} /></label>
              <label>Assumptions <textarea name="assumptions" defaultValue={props.hypothesis.assumptions.join("\n")} disabled={!props.editable} /></label>
              <label>Limitations <textarea name="limitations" defaultValue={props.hypothesis.limitations.join("\n")} disabled={!props.editable} /></label>
              <button type="submit" data-testid="nexora-causal-save-hypothesis" disabled={!props.editable}>Save hypothesis</button>
            </form>
          ) : null}
        </section>
      ) : null}

      {props.hypothesis ? (
        <section data-testid="nexora-causal-evidence">
          <h3>Evidence</h3>
          <p>Manager role is the classification recorded with the hypothesis. Availability is the current reading.</p>
          {selectedObject ? (
            <p data-testid="nexora-causal-object-inspection">
              {selectedObject.state === "active" || selectedObject.state === "archived"
                ? `${selectedRecord?.displayName ?? selectedObject.displayName} · ${selectedRecord?.objectType ?? "object"} · ${selectedObject.state}`
                : `Unavailable reference · ${selectedObject.state}`}
            </p>
          ) : null}
          {evidence ? (
            <>
              <p data-testid="nexora-causal-readiness">Readiness {evidence.classification}. Causation is not established.</p>
              <ul>
                {evidence.warnings.map((warning) => <li key={warning} data-testid="nexora-causal-warning">{warning}</li>)}
              </ul>
              <table>
                <thead>
                  <tr>
                    <th>Source</th><th>Dataset</th><th>Import</th><th>Measurement</th><th>Value</th><th>Unit</th><th>Period</th><th>Availability</th><th>Manager role</th>
                  </tr>
                </thead>
                <tbody>
                  {evidence.items.map((item) => (
                    <tr key={item.observationId} data-testid={`nexora-causal-evidence-${item.observationId}`} data-availability={item.availability}>
                      <td>{item.statement}</td>
                      <td>{item.datasetId ?? "none"}</td>
                      <td>{item.storedImportId ?? "none"}{item.availability === "STALE_IMPORT" ? ` · current import ${item.currentImportId ?? "none"} is not substituted` : ""}</td>
                      <td>{item.measurementId ?? item.fieldName ?? "none"}{item.fieldName && item.measurementId && item.fieldName !== item.measurementId ? ` · field ${item.fieldName}` : ""}</td>
                      <td>{item.resolvedValue ?? (item.availability === "STALE_IMPORT" || item.availability === "UNAUTHORIZED" || item.availability === "DETACHED" ? "withheld" : "—")}</td>
                      <td>{item.unit ?? "none"}</td>
                      <td>{item.periodLabel ?? "none"}</td>
                      <td>{causalEvidenceStatusText(item.availability)}</td>
                      <td>{item.managerRole}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : <p role="alert">{props.readiness && !props.readiness.ok ? failureText(props.readiness.reason) : "Evidence is not available."}</p>}
        </section>
      ) : null}

      {props.hypothesis ? (
        <section data-testid="nexora-causal-review" aria-live="polite">
          <h3>Manager Review</h3>
          <p>{CAUSAL_REVIEW_ACCEPTANCE_MEANING}</p>
          {authorization && evidence ? (
            <div data-testid="nexora-causal-evidence-integrity">
              <p>Historical review {authorization.reviewId}. Fingerprint {authorization.evidenceFingerprint}.</p>
              <p>Current evidence. Fingerprint {evidence.evidenceFingerprint}.</p>
              <p data-testid="nexora-causal-evidence-changed">{evidenceChanged ? "Evidence changed. Reassessment required." : "Current evidence matches the historical review."}</p>
            </div>
          ) : null}
          {evidenceChanged ? (
            <>
              <label>
                <input data-testid="nexora-causal-reassess-acknowledge" type="checkbox" checked={props.acknowledged} onChange={(event) => props.onAcknowledge(event.target.checked)} />
                I acknowledge the current evidence and its limitations. This does not change the earlier review.
              </label>
              <button type="button" data-testid="nexora-causal-action-REASSESS_EVIDENCE" disabled={!props.acknowledged || props.note.trim().length === 0 || evidence?.classification === "BLOCKED"} onClick={() => props.onSubmitReview("REASSESS_EVIDENCE")}>
                Reassess current evidence
              </button>
            </>
          ) : null}
          {props.hypothesis.limitations.length > 0 ? (
            <ul>{props.hypothesis.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}</ul>
          ) : <p>No limitations recorded.</p>}
          <label>Manager note <textarea data-testid="nexora-causal-review-note" value={props.note} onChange={(event) => props.onNote(event.target.value)} /></label>
          {actions.filter((action) => action !== "ACCEPT_FOR_SCENARIO").map((action) => (
            <button key={action} type="button" data-testid={`nexora-causal-action-${action}`} disabled={props.note.trim().length === 0 || !evidence} onClick={() => props.onSubmitReview(action)}>
              {CAUSAL_REVIEW_ACTION_LABELS[action]}
            </button>
          ))}
          {actions.includes("ACCEPT_FOR_SCENARIO") ? (
            <>
              <label>
                <input data-testid="nexora-causal-acknowledge" type="checkbox" checked={props.acknowledged} onChange={(event) => props.onAcknowledge(event.target.checked)} />
                I acknowledge the unresolved limitations. Acceptance is not causal proof.
              </label>
              <button type="button" data-testid="nexora-causal-action-ACCEPT_FOR_SCENARIO" disabled={!props.acknowledged || props.note.trim().length === 0 || evidence?.classification === "BLOCKED"} onClick={() => props.onSubmitReview("ACCEPT_FOR_SCENARIO")}>
                Accept for Scenario
              </button>
            </>
          ) : null}
          {props.failure ? <p role="alert" data-testid="nexora-causal-review-failure">{props.failure}</p> : null}
          {props.receipt ? (
            <p data-testid="nexora-causal-review-receipt">
              Saved {props.receipt.review.reviewId}. Status {props.receipt.hypothesis.status}. Operation {props.receipt.review.operationId}. {props.receipt.acceptanceMeaning}
            </p>
          ) : null}
          <h4>Review history</h4>
          {props.reviews.length === 0 ? <p>No review history.</p> : (
            <ol data-testid="nexora-causal-review-history">
              {props.reviews.map((review) => (
                <li key={review.reviewId}>{review.action} {review.previousStatus} to {review.newStatus}. {review.managerNote}. Operation {review.operationId}. Fingerprint {review.evidenceFingerprint}.{review.limitationsAcknowledged ? " Limitations acknowledged." : ""}</li>
              ))}
            </ol>
          )}
        </section>
      ) : null}
    </>
  );
}

function ScenarioHandoffPanel(props: {
  proposal: CausalScenarioHandoffProposal | null;
  receipt: CausalScenarioHandoffReceipt | null;
  failure: string;
  scenarioName: string;
  intervention: string;
  assumptions: string;
  limitations: string;
  goalId: string;
  acknowledged: boolean;
  goals: readonly { goalId: string; name: string }[];
  onExplore: () => void;
  onScenarioName: (value: string) => void;
  onIntervention: (value: string) => void;
  onAssumptions: (value: string) => void;
  onLimitations: (value: string) => void;
  onGoal: (value: string) => void;
  onAcknowledge: (value: boolean) => void;
  onConfirm: () => void;
  onOpenDecision?: () => void;
}) {
  return (
    <section data-testid="nexora-causal-handoff">
      <h3>Explore in Scenario</h3>
      <p>A Scenario is a proposal to evaluate. It does not establish causation or approve a Decision.</p>
      <button type="button" data-testid="nexora-causal-explore-scenario" onClick={props.onExplore}>Explore in Scenario</button>
      {props.proposal ? (
        <div data-testid="nexora-causal-handoff-proposal">
          <p data-testid="nexora-causal-handoff-fingerprint">Evidence fingerprint {props.proposal.evidenceFingerprint}</p>
          <p>{props.proposal.problemStatement}</p>
          <p>{props.proposal.hypothesisStatement}</p>
          <p>Review {props.proposal.reviewId}. Supporting {props.proposal.supportingObservationIds.length}. Conflicting {props.proposal.conflictingObservationIds.length}.</p>
          {props.proposal.evidence.warnings.length > 0 ? (
            <ul data-testid="nexora-causal-handoff-warnings">
              {props.proposal.evidence.warnings.map((warning) => <li key={warning}>{warning}</li>)}
            </ul>
          ) : null}
          {props.goals.length === 0 ? (
            <p data-testid="nexora-causal-handoff-goal-required">Create an active Goal in this Deck before confirming a Scenario.</p>
          ) : (
            <label>Goal
              <select data-testid="nexora-causal-handoff-goal" value={props.goalId} onChange={(event) => props.onGoal(event.target.value)}>
                <option value="">Select goal</option>
                {props.goals.map((goal) => <option key={goal.goalId} value={goal.goalId}>{goal.name}</option>)}
              </select>
            </label>
          )}
          <label>Scenario name <input data-testid="nexora-causal-handoff-name" value={props.scenarioName} onChange={(event) => props.onScenarioName(event.target.value)} /></label>
          <label>Proposed intervention <textarea data-testid="nexora-causal-handoff-intervention" value={props.intervention} onChange={(event) => props.onIntervention(event.target.value)} /></label>
          <label>Assumptions <textarea data-testid="nexora-causal-handoff-assumptions" value={props.assumptions} onChange={(event) => props.onAssumptions(event.target.value)} /></label>
          <label>Limitations <textarea data-testid="nexora-causal-handoff-limitations" value={props.limitations} onChange={(event) => props.onLimitations(event.target.value)} /></label>
          <label>
            <input data-testid="nexora-causal-handoff-acknowledge" type="checkbox" checked={props.acknowledged} onChange={(event) => props.onAcknowledge(event.target.checked)} />
            I acknowledge these limitations. This Scenario is not causal proof.
          </label>
          <button type="button" data-testid="nexora-causal-handoff-confirm" disabled={!props.acknowledged || props.goalId.length === 0} onClick={props.onConfirm}>Confirm handoff</button>
        </div>
      ) : null}
      {props.failure ? <p role="alert" data-testid="nexora-causal-handoff-failure">{props.failure}</p> : null}
      {props.receipt ? (
        <p data-testid="nexora-causal-handoff-receipt">
          Scenario {props.receipt.scenario.scenarioId} is {props.receipt.scenario.lifecycleStatus}. Decisions {props.receipt.decisionCount}. Plans {props.receipt.planCount}.{props.receipt.replayed ? " Existing operation." : ""}
          <button type="button" data-testid="nexora-causal-handoff-open-decision" onClick={props.onOpenDecision}>Open Decision Solar</button>
        </p>
      ) : null}
    </section>
  );
}
