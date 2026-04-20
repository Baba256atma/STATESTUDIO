"use client";

import React, { useEffect, useMemo, useState } from "react";

import {
  buildCurrentDomainRuntimeState,
  buildDomainRolloutViewRows,
  emitDomainRolloutViewReadyDevOnce,
  getEffectiveDomainLabel,
  type NexoraDomainRolloutViewRow,
} from "../../lib/domain/nexoraDomainRolloutView.ts";
import {
  buildDomainAdoptionReviews,
  describeDomainAdoptionHealth,
  emitDomainAdoptionReviewReadyDevOnce,
  syncNexoraDebugDomainAdoptionReview,
  type NexoraDomainAdoptionReview,
} from "../../lib/domain/nexoraDomainAdoptionReview.ts";
import {
  adoptionStatusHint,
  buildDomainUsageAdoptionRows,
  buildDomainUsageSummary,
  describeDomainAdoption,
  loadDomainUsage,
  NEXORA_DOMAIN_USAGE_CHANGED_EVENT,
  syncNexoraDebugDomainUsage,
} from "../../lib/domain/nexoraDomainUsage.ts";
import {
  buildDomainActionHeadline,
  emitDomainActionHeadlineReadyDevOnce,
  syncDomainActionHeadlineDebug,
} from "../../lib/domain/nexoraDomainActionHeadline.ts";
import {
  extractDomainActionItems,
  formatDomainActionsAsTickets,
  logDomainActionsGeneratedDev,
  syncDomainActionsDebug,
} from "../../lib/domain/nexoraDomainActionExtraction.ts";
import {
  buildFocusHandoffContext,
  formatFocusForStandup,
  logFocusCopiedDev,
  syncDomainFocusHandoffDebug,
} from "../../lib/domain/nexoraDomainFocusHandoff.ts";
import {
  buildDomainAdoptionExportBundle,
  copyAdoptionExportText,
  formatDomainAdoptionReviewForHandoff,
  logDomainAdoptionExportCopiedDev,
  serializeDomainAdoptionExportBundle,
  syncDomainAdoptionExportDebug,
} from "../../lib/domain/nexoraDomainAdoptionExport.ts";
import { getNexoraLocalePack, resolveNexoraLocaleDomainId } from "../../lib/domain/nexoraDomainPackRegistry.ts";
import { NEXORA_EXECUTION_OUTCOME_RECORDED } from "../../lib/execution/nexoraExecutionOutcome.ts";
import { buildNexoraFeedbackSummary, loadNexoraFeedback, NEXORA_FEEDBACK_CHANGED_EVENT } from "../../lib/feedback/nexoraFeedback.ts";
import { readNexoraPilotReviewQualityFromDebug } from "../../lib/review/nexoraPilotReview.ts";
import {
  buildSessionSummary,
  emitSessionSummaryGeneratedDev,
  formatSessionSummary,
  syncSessionSummaryDebug,
} from "../../lib/session/nexoraSessionSummary.ts";
import {
  buildNexoraWorkflowClosureInputFromBrowser,
  emitWorkflowClosureEvaluatedDev,
  evaluateWorkflowClosure,
  formatWorkflowClosure,
  NEXORA_WORKFLOW_DEBUG_UPDATED,
  syncWorkflowClosureDebug,
  type NexoraWorkflowClosureStatus,
} from "../../lib/session/nexoraWorkflowClosure.ts";

export type NexoraDomainRolloutPanelProps = {
  /** Workspace / experience domain id (same source as `__NEXORA_DEBUG__.activePilotDomainId` in dev). */
  requestedDomainId?: string | null;
};

function rolloutAccent(status: NexoraDomainRolloutViewRow["rolloutStatus"]): string {
  if (status === "product_ready") return "#86efac";
  if (status === "pilot_ready") return "#fde047";
  return "#94a3b8";
}

function adoptionReviewBadgeColor(status: NexoraDomainAdoptionReview["status"]): string {
  if (status === "healthy") return "#86efac";
  if (status === "underused") return "#fde047";
  if (status === "fallback_heavy") return "#fb923c";
  if (status === "unstable") return "#f87171";
  return "#94a3b8";
}

function workflowClosureStatusColor(status: NexoraWorkflowClosureStatus): string {
  if (status === "completed") return "#86efac";
  if (status === "needs_follow_up") return "#fde047";
  return "#fca5a5";
}

function workflowClosureStatusLabel(status: NexoraWorkflowClosureStatus): string {
  if (status === "completed") return "COMPLETED";
  if (status === "needs_follow_up") return "NEEDS FOLLOW-UP";
  return "INCOMPLETE";
}

export function NexoraDomainRolloutPanel({ requestedDomainId }: NexoraDomainRolloutPanelProps): React.ReactElement {
  const rows = useMemo(() => buildDomainRolloutViewRows(), []);
  const runtime = useMemo(() => buildCurrentDomainRuntimeState(requestedDomainId), [requestedDomainId]);
  const resolvedLabel = useMemo(() => getEffectiveDomainLabel(resolveNexoraLocaleDomainId(requestedDomainId)), [requestedDomainId]);

  const [usageEpoch, setUsageEpoch] = useState(0);
  const [b43CopyHint, setB43CopyHint] = useState<string | null>(null);
  const [b44CopyHint, setB44CopyHint] = useState<string | null>(null);
  const [b46CopyHint, setB46CopyHint] = useState<string | null>(null);
  const [b48CopyHint, setB48CopyHint] = useState<string | null>(null);
  const [b49CopyHint, setB49CopyHint] = useState<string | null>(null);
  const [workflowEpoch, setWorkflowEpoch] = useState(0);
  useEffect(() => {
    syncNexoraDebugDomainUsage();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const bump = () => setUsageEpoch((n) => n + 1);
    window.addEventListener(NEXORA_DOMAIN_USAGE_CHANGED_EVENT, bump);
    return () => window.removeEventListener(NEXORA_DOMAIN_USAGE_CHANGED_EVENT, bump);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const bump = () => setWorkflowEpoch((n) => n + 1);
    window.addEventListener(NEXORA_EXECUTION_OUTCOME_RECORDED, bump);
    window.addEventListener(NEXORA_FEEDBACK_CHANGED_EVENT, bump);
    window.addEventListener(NEXORA_WORKFLOW_DEBUG_UPDATED, bump);
    return () => {
      window.removeEventListener(NEXORA_EXECUTION_OUTCOME_RECORDED, bump);
      window.removeEventListener(NEXORA_FEEDBACK_CHANGED_EVENT, bump);
      window.removeEventListener(NEXORA_WORKFLOW_DEBUG_UPDATED, bump);
    };
  }, []);

  const usageRecords = useMemo(() => loadDomainUsage(), [usageEpoch]);
  const adoptionRows = useMemo(() => buildDomainUsageAdoptionRows(usageRecords), [usageRecords]);
  const adoptionInsight = useMemo(
    () => describeDomainAdoption(buildDomainUsageSummary(usageRecords)),
    [usageRecords],
  );

  const adoptionReviews = useMemo(() => buildDomainAdoptionReviews(), [usageEpoch]);
  const adoptionHealthReviewLine = useMemo(
    () => describeDomainAdoptionHealth(adoptionReviews),
    [adoptionReviews],
  );

  const domainActionItems = useMemo(() => extractDomainActionItems(adoptionReviews), [adoptionReviews]);
  const actionHeadline = useMemo(() => buildDomainActionHeadline(domainActionItems), [domainActionItems]);

  const workflowClosure = useMemo(() => {
    void workflowEpoch;
    void usageEpoch;
    const input = buildNexoraWorkflowClosureInputFromBrowser({ domainActionItems });
    return evaluateWorkflowClosure(input);
  }, [workflowEpoch, usageEpoch, domainActionItems]);

  useEffect(() => {
    if (typeof window === "undefined" || process.env.NODE_ENV === "production") return;
    syncWorkflowClosureDebug(workflowClosure);
    emitWorkflowClosureEvaluatedDev(workflowClosure);
  }, [workflowClosure]);

  useEffect(() => {
    syncDomainActionHeadlineDebug(actionHeadline);
    emitDomainActionHeadlineReadyDevOnce(actionHeadline);
  }, [actionHeadline]);

  useEffect(() => {
    syncNexoraDebugDomainAdoptionReview(adoptionReviews);
    emitDomainAdoptionReviewReadyDevOnce(adoptionReviews);
  }, [adoptionReviews]);

  useEffect(() => {
    emitDomainRolloutViewReadyDevOnce(rows, runtime);
  }, [rows, runtime]);

  return (
    <div style={{ fontSize: 10, lineHeight: 1.4, color: "#e2e8f0" }}>
      <div
        style={{
          marginBottom: 10,
          padding: 8,
          borderRadius: 8,
          border: "1px solid rgba(148,163,184,0.35)",
          background: "rgba(30,41,59,0.6)",
        }}
      >
        <div style={{ fontWeight: 800, color: "#fde68a", marginBottom: 6 }}>Runtime (B.37 → B.38 → B.39)</div>
        <div>
          <span style={{ color: "#94a3b8" }}>Requested domain: </span>
          <strong>{runtime.requestedDomainId ?? "—"}</strong>
        </div>
        <div>
          <span style={{ color: "#94a3b8" }}>Resolved (registry): </span>
          <strong>{resolvedLabel}</strong>
        </div>
        <div>
          <span style={{ color: "#94a3b8" }}>Effective domain: </span>
          <strong>{getEffectiveDomainLabel(runtime.effectiveDomainId)}</strong>
        </div>
        <div>
          <span style={{ color: "#94a3b8" }}>Fallback active: </span>
          <strong style={{ color: runtime.fallbackActive ? "#fca5a5" : "#86efac" }}>{runtime.fallbackActive ? "Yes" : "No"}</strong>
        </div>
        {runtime.fallbackActive && runtime.effectiveDomainId === "generic" ? (
          <div style={{ marginTop: 6, color: "#cbd5e1", fontSize: 9 }}>
            Generic pack is in use because of QA or pilot rollout rules, or an unrecognized domain id.
          </div>
        ) : null}
      </div>

      <div style={{ fontWeight: 800, color: "#fde68a", marginBottom: 6 }}>Usage / Adoption (B.41)</div>
      <div
        style={{
          marginBottom: 12,
          padding: 8,
          borderRadius: 8,
          border: "1px solid rgba(125,211,252,0.25)",
          background: "rgba(30,41,59,0.45)",
        }}
      >
        <div style={{ fontSize: 9, color: "#cbd5e1", marginBottom: 8, lineHeight: 1.35 }}>{adoptionInsight}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {adoptionRows.map((u) => {
            const hint = adoptionStatusHint(u);
            const hintColor =
              hint === "High fallback" ? "#fca5a5" : hint === "Low usage" ? "#fde047" : "#86efac";
            return (
              <div
                key={u.domainId}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  gap: 6,
                  padding: "4px 6px",
                  borderRadius: 6,
                  background: "rgba(15,23,42,0.45)",
                }}
              >
                <span style={{ fontWeight: 700, color: "#f1f5f9" }}>{u.label}</span>
                <span style={{ color: "#94a3b8", fontSize: 9 }}>
                  {u.totalRequests} req · fallback {(u.fallbackRate * 100).toFixed(0)}% ·{" "}
                  <span style={{ color: hintColor, fontWeight: 700 }}>{hint}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ fontWeight: 800, color: "#fde68a", marginBottom: 6 }}>Domain Review (B.42)</div>
      <div
        style={{
          marginBottom: 12,
          padding: 8,
          borderRadius: 8,
          border: "1px solid rgba(196,181,253,0.28)",
          background: "rgba(30,41,59,0.45)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <span style={{ fontSize: 9, color: "#c4b5fd", fontWeight: 700 }}>Export (B.43)</span>
          <button
            type="button"
            onClick={() => {
              const bundle = buildDomainAdoptionExportBundle();
              const text = serializeDomainAdoptionExportBundle(bundle);
              void copyAdoptionExportText(text).then((ok) => {
                if (ok) {
                  syncDomainAdoptionExportDebug(bundle);
                  logDomainAdoptionExportCopiedDev("json");
                }
                setB43CopyHint(ok ? "Copied JSON." : "Copy failed.");
                window.setTimeout(() => setB43CopyHint(null), 2200);
              });
            }}
            style={{
              cursor: "pointer",
              fontSize: 9,
              fontWeight: 700,
              padding: "3px 8px",
              borderRadius: 6,
              border: "1px solid rgba(196,181,253,0.45)",
              background: "rgba(15,23,42,0.65)",
              color: "#e9d5ff",
            }}
          >
            Copy review JSON
          </button>
          <button
            type="button"
            onClick={() => {
              const bundle = buildDomainAdoptionExportBundle();
              const text = formatDomainAdoptionReviewForHandoff(bundle.reviews);
              void copyAdoptionExportText(text).then((ok) => {
                if (ok) {
                  syncDomainAdoptionExportDebug(bundle);
                  logDomainAdoptionExportCopiedDev("text");
                }
                setB43CopyHint(ok ? "Copied handoff text." : "Copy failed.");
                window.setTimeout(() => setB43CopyHint(null), 2200);
              });
            }}
            style={{
              cursor: "pointer",
              fontSize: 9,
              fontWeight: 700,
              padding: "3px 8px",
              borderRadius: 6,
              border: "1px solid rgba(148,163,184,0.45)",
              background: "rgba(15,23,42,0.65)",
              color: "#e2e8f0",
            }}
          >
            Copy handoff text
          </button>
          {b43CopyHint ? (
            <span style={{ fontSize: 9, color: b43CopyHint.includes("failed") ? "#fca5a5" : "#86efac" }}>
              {b43CopyHint}
            </span>
          ) : null}
        </div>
        <div
          style={{
            marginBottom: 10,
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <div style={{ flex: "1 1 180px", minWidth: 0, lineHeight: 1.45 }}>
            <div style={{ fontSize: 9, color: "#94a3b8", fontWeight: 600, letterSpacing: "0.01em" }}>
              {(() => {
                const id = domainActionItems[0]?.domainId;
                if (id && actionHeadline.headline.includes(id)) {
                  const i = actionHeadline.headline.indexOf(id);
                  return (
                    <>
                      {actionHeadline.headline.slice(0, i)}
                      <span style={{ color: "#fde68a", fontWeight: 800 }}>{id}</span>
                      {actionHeadline.headline.slice(i + id.length)}
                    </>
                  );
                }
                return actionHeadline.headline;
              })()}
            </div>
            {actionHeadline.hint ? (
              <div style={{ fontSize: 8, color: "#64748b", marginTop: 4 }}>{actionHeadline.hint}</div>
            ) : null}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
            <button
              type="button"
              onClick={() => {
                const handoffCtx = buildFocusHandoffContext({
                  date: new Date(),
                  domainId: domainActionItems[0]?.domainId ?? null,
                  priority: domainActionItems[0]?.priority ?? null,
                });
                const text = formatFocusForStandup(actionHeadline, handoffCtx);
                void copyAdoptionExportText(text).then((ok) => {
                  if (ok) {
                    syncDomainFocusHandoffDebug(text);
                    logFocusCopiedDev();
                  }
                  setB46CopyHint(ok ? "Copied focus." : "Copy failed.");
                  window.setTimeout(() => setB46CopyHint(null), 2200);
                });
              }}
              style={{
                cursor: "pointer",
                fontSize: 9,
                fontWeight: 700,
                padding: "3px 8px",
                borderRadius: 6,
                border: "1px solid rgba(253,230,138,0.45)",
                background: "rgba(15,23,42,0.65)",
                color: "#fef9c3",
              }}
            >
              Copy focus
            </button>
            {b46CopyHint ? (
              <span style={{ fontSize: 9, color: b46CopyHint.includes("failed") ? "#fca5a5" : "#86efac" }}>
                {b46CopyHint}
              </span>
            ) : null}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <span style={{ fontSize: 9, color: "#a5b4fc", fontWeight: 700 }}>Actions (B.44)</span>
          <button
            type="button"
            onClick={() => {
              const actions = domainActionItems;
              const text = formatDomainActionsAsTickets(actions);
              void copyAdoptionExportText(text).then((ok) => {
                if (ok) {
                  syncDomainActionsDebug(actions);
                  logDomainActionsGeneratedDev(actions);
                }
                setB44CopyHint(ok ? "Copied actions." : "Copy failed.");
                window.setTimeout(() => setB44CopyHint(null), 2200);
              });
            }}
            style={{
              cursor: "pointer",
              fontSize: 9,
              fontWeight: 700,
              padding: "3px 8px",
              borderRadius: 6,
              border: "1px solid rgba(165,180,252,0.45)",
              background: "rgba(15,23,42,0.65)",
              color: "#e0e7ff",
            }}
          >
            Copy action items
          </button>
          {b44CopyHint ? (
            <span style={{ fontSize: 9, color: b44CopyHint.includes("failed") ? "#fca5a5" : "#86efac" }}>
              {b44CopyHint}
            </span>
          ) : null}
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <span style={{ fontSize: 9, color: "#86efac", fontWeight: 700 }}>Session (B.48)</span>
          <button
            type="button"
            onClick={() => {
              const fb = buildNexoraFeedbackSummary(loadNexoraFeedback());
              const feedbackSummary =
                fb.total > 0 ? { helpfulRate: fb.helpfulRate, confusionRate: fb.confusionRate } : null;
              const qRaw = readNexoraPilotReviewQualityFromDebug();
              const quality = qRaw ? { tier: qRaw.qualityTier, trend: qRaw.trend } : null;
              const summary = buildSessionSummary({
                headline: actionHeadline,
                actions: domainActionItems,
                feedbackSummary,
                quality,
              });
              const text = formatSessionSummary(summary);
              void copyAdoptionExportText(text).then((ok) => {
                if (ok) {
                  syncSessionSummaryDebug(summary);
                  emitSessionSummaryGeneratedDev(summary);
                }
                setB48CopyHint(ok ? "Copied summary." : "Copy failed.");
                window.setTimeout(() => setB48CopyHint(null), 2200);
              });
            }}
            style={{
              cursor: "pointer",
              fontSize: 9,
              fontWeight: 700,
              padding: "3px 8px",
              borderRadius: 6,
              border: "1px solid rgba(134,239,172,0.45)",
              background: "rgba(15,23,42,0.65)",
              color: "#bbf7d0",
            }}
          >
            Copy session summary
          </button>
          {b48CopyHint ? (
            <span style={{ fontSize: 9, color: b48CopyHint.includes("failed") ? "#fca5a5" : "#86efac" }}>
              {b48CopyHint}
            </span>
          ) : null}
        </div>
        <div
          style={{
            marginBottom: 8,
            padding: "6px 8px",
            borderRadius: 6,
            border: "1px solid rgba(148,163,184,0.28)",
            background: "rgba(15,23,42,0.42)",
          }}
        >
          <div style={{ fontSize: 9, color: "#7dd3fc", fontWeight: 700 }}>Workflow (B.49)</div>
          <div style={{ fontSize: 9, color: "#e2e8f0", marginTop: 4 }}>
            <span style={{ color: "#94a3b8" }}>Status: </span>
            <strong style={{ color: workflowClosureStatusColor(workflowClosure.status), letterSpacing: "0.02em" }}>
              {workflowClosureStatusLabel(workflowClosure.status)}
            </strong>
          </div>
          <div style={{ fontSize: 9, color: "#cbd5e1", marginTop: 4, lineHeight: 1.35 }}>{workflowClosure.summary}</div>
          {workflowClosure.missingSteps.length ? (
            <div
              style={{
                fontSize: 8,
                marginTop: 4,
                color:
                  workflowClosure.status === "completed" && workflowClosure.missingSteps.every((s) => s === "feedback")
                    ? "#fde047"
                    : "#fca5a5",
              }}
            >
              Missing: {workflowClosure.missingSteps.join(", ")}
            </div>
          ) : null}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", marginTop: 6 }}>
            <button
              type="button"
              onClick={() => {
                const text = formatWorkflowClosure(workflowClosure);
                void copyAdoptionExportText(text).then((ok) => {
                  setB49CopyHint(ok ? "Copied workflow status." : "Copy failed.");
                  window.setTimeout(() => setB49CopyHint(null), 2200);
                });
              }}
              style={{
                cursor: "pointer",
                fontSize: 9,
                fontWeight: 700,
                padding: "3px 8px",
                borderRadius: 6,
                border: "1px solid rgba(125,211,252,0.4)",
                background: "rgba(15,23,42,0.65)",
                color: "#bae6fd",
              }}
            >
              Copy workflow status
            </button>
            {b49CopyHint ? (
              <span style={{ fontSize: 9, color: b49CopyHint.includes("failed") ? "#fca5a5" : "#86efac" }}>
                {b49CopyHint}
              </span>
            ) : null}
          </div>
        </div>
        <div style={{ fontSize: 9, color: "#cbd5e1", marginBottom: 8, lineHeight: 1.35 }}>
          {adoptionHealthReviewLine}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {adoptionReviews.map((rev) => (
            <div
              key={rev.domainId}
              style={{
                padding: "6px 8px",
                borderRadius: 8,
                border: `1px solid ${adoptionReviewBadgeColor(rev.status)}55`,
                background: "rgba(15,23,42,0.5)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <span style={{ fontWeight: 700, color: "#f8fafc" }}>{getNexoraLocalePack(rev.domainId).label}</span>
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 800,
                    color: adoptionReviewBadgeColor(rev.status),
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  {rev.status.replace(/_/g, " ")}
                </span>
              </div>
              <div style={{ fontSize: 9, color: "#cbd5e1", marginTop: 4, lineHeight: 1.35 }}>{rev.summary}</div>
              {rev.issues.length ? (
                <div style={{ fontSize: 9, color: "#fca5a5", marginTop: 4 }}>
                  {rev.issues.slice(0, 2).join(" · ")}
                </div>
              ) : null}
              {rev.recommendations[0] ? (
                <div style={{ fontSize: 9, color: "#93c5fd", marginTop: 4 }}>→ {rev.recommendations[0]}</div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div style={{ fontWeight: 800, color: "#fde68a", marginBottom: 6 }}>Domain packs</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {rows.map((row) => (
          <div
            key={row.domainId}
            style={{
              padding: "6px 8px",
              borderRadius: 8,
              border: `1px solid ${rolloutAccent(row.rolloutStatus)}55`,
              background: "rgba(15,23,42,0.55)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontWeight: 700, color: "#f8fafc" }}>{row.label}</span>
              <span style={{ fontSize: 9, color: rolloutAccent(row.rolloutStatus), fontWeight: 700 }}>
                {row.rolloutStatus.replace(/_/g, " ")}
              </span>
            </div>
            <div style={{ fontSize: 9, color: "#94a3b8", marginTop: 2 }}>
              QA: <span style={{ color: "#e2e8f0" }}>{row.qaStatus}</span> · score{" "}
              <span style={{ color: "#e2e8f0" }}>{row.qaScore}</span>
            </div>
            <div style={{ fontSize: 9, color: "#cbd5e1", marginTop: 4 }}>{row.summary}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
