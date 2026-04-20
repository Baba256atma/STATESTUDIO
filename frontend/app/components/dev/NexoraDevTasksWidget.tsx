"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { newDevTaskId, normalizeDevTask, sortDevTasks, type NexoraDevTask } from "../../lib/devtasks/nexoraDevTaskContract.ts";
import {
  appendDevTask,
  clearDevTasks,
  deleteDevTask,
  loadDevTasks,
  updateDevTask,
} from "../../lib/devtasks/nexoraDevTaskStore.ts";
import { flattenPhasesForDisplay, normalizeRoadmapPhase, type NexoraRoadmapPhase } from "../../lib/devtasks/nexoraRoadmapContract.ts";
import {
  buildPhaseTaskSummary,
  getTasksForPhase,
  phaseHealthLabel,
} from "../../lib/devtasks/nexoraRoadmapSelectors.ts";
import {
  clearRoadmapPhases,
  deleteRoadmapPhase,
  loadRoadmapPhases,
  seedDefaultRoadmapPhasesIfEmpty,
  upsertRoadmapPhase,
} from "../../lib/devtasks/nexoraRoadmapStore.ts";
import {
  clearNexoraBiasGovernanceOverride,
  getNexoraBiasGovernanceConfig,
  saveNexoraBiasGovernanceFull,
  saveNexoraBiasGovernanceOverride,
} from "../../lib/quality/nexoraBiasGovernance.ts";
import { DEFAULT_NEXORA_BIAS_GOVERNANCE } from "../../lib/quality/nexoraBiasGovernanceContract.ts";
import { getNexoraProductMode } from "../../lib/product/nexoraProductMode.ts";
import { runPilotValidation, type NexoraPilotValidationSummary } from "../../lib/pilot/nexoraPilotRunner";
import { NEXORA_PILOT_SCENARIOS } from "../../lib/pilot/nexoraPilotScenarios";
import {
  buildNexoraFeedbackSummary,
  loadNexoraFeedback,
  NEXORA_FEEDBACK_CHANGED_EVENT,
  STORAGE_KEY,
} from "../../lib/feedback/nexoraFeedback.ts";
import {
  buildNexoraMetricsSummary,
  clearNexoraMetricsStorage,
  describeBiggestMetricsDropoff,
  formatMetricPercent,
  loadNexoraMetricRecords,
} from "../../lib/metrics/nexoraMetrics.ts";
import {
  buildNexoraPilotReview,
  buildNexoraPilotReviewInputSignature,
  emitPilotReviewGeneratedDevOnce,
  readNexoraPilotReviewQualityFromDebug,
  type NexoraPilotReview,
} from "../../lib/review/nexoraPilotReview.ts";
import {
  buildNexoraReadinessInputSignature,
  buildNexoraReadinessReport,
  emitReadinessEvaluatedDevOnce,
  readNexoraReadinessQualityFromDebug,
  type NexoraReadinessReport,
} from "../../lib/review/nexoraReadiness.ts";
import {
  buildNexoraPilotSynthesis,
  buildNexoraPilotSynthesisInputSignature,
  collectNexoraPilotSynthesisInputFromBrowser,
  emitPilotSynthesisGeneratedDevOnce,
  type NexoraPilotSynthesis,
} from "../../lib/review/nexoraPilotSynthesis.ts";
import { NexoraDomainRolloutPanel } from "../domain/NexoraDomainRolloutPanel.tsx";

function shouldShowDevTasks(): boolean {
  if (getNexoraProductMode() === "pilot") return false;
  return process.env.NODE_ENV !== "production";
}

/** B.36 — mirror HomeScreen domain for dev Review/Synthesis panels (when debug bridge is active). */
function readActivePilotDomainIdFromDebug(): string | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & { __NEXORA_DEBUG__?: { activePilotDomainId?: unknown } };
  const v = w.__NEXORA_DEBUG__?.activePilotDomainId;
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

type TabKey =
  | "tasks"
  | "roadmap"
  | "bias"
  | "pilot"
  | "metrics"
  | "review"
  | "readiness"
  | "feedback"
  | "synthesis"
  | "domains";

let lastRoadmapUiLogSig = "";

function logRoadmapUiOnce(sig: string, payload: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  if (sig === lastRoadmapUiLogSig) return;
  lastRoadmapUiLogSig = sig;
  globalThis.console?.debug?.("[Nexora][Roadmap] updated", payload);
}

function phaseDepth(phase: NexoraRoadmapPhase, byId: Map<string, NexoraRoadmapPhase>): number {
  let d = 0;
  let cur: NexoraRoadmapPhase | undefined = phase;
  const guard = new Set<string>();
  while (cur?.parentId?.trim()) {
    if (guard.has(cur.id)) break;
    guard.add(cur.id);
    cur = byId.get(cur.parentId.trim());
    d += 1;
    if (d > 24) break;
  }
  return d;
}

export type NexoraDevTasksWidgetProps = {
  /** Launch workspace domain (page-level); dev debug may override via `__NEXORA_DEBUG__.activePilotDomainId`. */
  workspaceDomainId?: string | null;
};

export function NexoraDevTasksWidget({ workspaceDomainId }: NexoraDevTasksWidgetProps = {}): React.ReactElement | null {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<TabKey>("tasks");
  const [tasks, setTasks] = useState<NexoraDevTask[]>([]);
  const [phases, setPhases] = useState<NexoraRoadmapPhase[]>([]);
  const [focusPhaseId, setFocusPhaseId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [priority, setPriority] = useState<NexoraDevTask["priority"]>("medium");
  const [phase, setPhase] = useState("");
  const [tag, setTag] = useState("");
  const [dependsOn, setDependsOn] = useState("");

  const [newPhaseId, setNewPhaseId] = useState("");
  const [newPhaseTitle, setNewPhaseTitle] = useState("");
  const [newPhaseParent, setNewPhaseParent] = useState("");
  const [newPhaseOrder, setNewPhaseOrder] = useState("");
  const [biasUiTick, setBiasUiTick] = useState(0);
  const [pilotSummary, setPilotSummary] = useState<NexoraPilotValidationSummary | null>(null);
  const [pilotBusy, setPilotBusy] = useState(false);
  const [pilotShowDetails, setPilotShowDetails] = useState(true);

  const refreshTasks = useCallback(() => setTasks(loadDevTasks()), []);
  const refreshPhases = useCallback(() => {
    seedDefaultRoadmapPhasesIfEmpty();
    setPhases(loadRoadmapPhases());
  }, []);

  const refreshAll = useCallback(() => {
    refreshTasks();
    refreshPhases();
  }, [refreshTasks, refreshPhases]);

  useEffect(() => {
    if (!shouldShowDevTasks()) return;
    refreshAll();
  }, [refreshAll]);

  const sortedTasks = useMemo(() => sortDevTasks(tasks), [tasks]);
  const displayTasks = useMemo(() => {
    if (!focusPhaseId?.trim()) return sortedTasks;
    const pid = focusPhaseId.trim();
    const linked = new Set(getTasksForPhase(sortedTasks, pid).map((t) => t.id));
    return sortedTasks.filter((t) => linked.has(t.id));
  }, [sortedTasks, focusPhaseId]);

  const phaseById = useMemo(() => new Map(phases.map((p) => [p.id, p])), [phases]);
  const flatPhases = useMemo(() => flattenPhasesForDisplay(phases), [phases]);

  const setFocusPhase = useCallback((id: string | null) => {
    setFocusPhaseId(id);
    if (id?.trim()) {
      logRoadmapUiOnce(`focus:${id.trim()}`, { focusPhase: id.trim() });
    } else {
      logRoadmapUiOnce("focus:clear", { focusPhase: null });
    }
  }, []);

  const addTask = useCallback(() => {
    const t = trimStr(title);
    if (!t) return;
    const deps = dependsOn
      .split(/[,;]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const task = normalizeDevTask({
      id: newDevTaskId(),
      title: t,
      detail: trimStr(detail) || undefined,
      priority,
      phase: trimStr(phase) || undefined,
      tag: trimStr(tag) || undefined,
      dependsOn: deps.length ? deps : undefined,
      status: "open",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    appendDevTask(task);
    refreshTasks();
    setTitle("");
    setDetail("");
    setDependsOn("");
  }, [title, detail, priority, phase, tag, dependsOn, refreshTasks]);

  const addPhase = useCallback(() => {
    const id = trimStr(newPhaseId);
    const ttl = trimStr(newPhaseTitle);
    if (!id || !ttl) return;
    const order = Number.parseInt(trimStr(newPhaseOrder), 10);
    upsertRoadmapPhase(
      normalizeRoadmapPhase({
        id,
        title: ttl,
        status: "planned",
        parentId: trimStr(newPhaseParent) || null,
        order: Number.isFinite(order) ? order : phases.length + 100,
      })
    );
    refreshPhases();
    setNewPhaseId("");
    setNewPhaseTitle("");
    setNewPhaseParent("");
    setNewPhaseOrder("");
  }, [newPhaseId, newPhaseTitle, newPhaseParent, newPhaseOrder, phases.length, refreshPhases]);

  const presetB20Example = useCallback(() => {
    setTitle("Outcome lookup should be runId-specific");
    setTag("B20-FIX-1");
    setPhase("B.20");
    setPriority("high");
    setDependsOn("");
    setTab("tasks");
  }, []);

  const presetPhaseFollowUp = useCallback(() => {
    setPhase("B.20");
    setTag("");
    setTitle((prev) => (trimStr(prev) ? prev : "Follow-up for current phase"));
    setTab("tasks");
  }, []);

  if (!shouldShowDevTasks()) return null;

  return (
    <>
      <button
        type="button"
        title="Nexora dev tasks & roadmap (local)"
        onClick={() => setOpen((v) => !v)}
        style={{
          position: "fixed",
          left: 12,
          bottom: 12,
          zIndex: 99990,
          height: 32,
          padding: "0 12px",
          borderRadius: 8,
          border: "1px solid rgba(251,191,36,0.4)",
          background: "rgba(15,23,42,0.92)",
          color: "#fde68a",
          fontSize: 11,
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Dev / Roadmap {open ? "▼" : "▶"}
      </button>
      {open ? (
        <div
          style={{
            position: "fixed",
            left: 12,
            bottom: 52,
            zIndex: 99990,
            width:
              tab === "pilot"
                ? 420
                : tab === "metrics" || tab === "feedback"
                  ? 380
                  : tab === "review" || tab === "readiness" || tab === "synthesis" || tab === "domains"
                    ? 400
                    : 360,
            maxHeight: "48vh",
            overflow: "auto",
            borderRadius: 10,
            border: "1px solid rgba(251,191,36,0.28)",
            background: "rgba(15,23,42,0.96)",
            color: "#e2e8f0",
            fontSize: 11,
            padding: 10,
            boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontWeight: 800, color: "#fde68a" }}>Engineering (local)</span>
            <button type="button" onClick={() => setOpen(false)} style={miniBtnStyle}>
              Close
            </button>
          </div>

          <div style={{ display: "flex", gap: 4, marginBottom: 8, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setTab("tasks")}
              style={{ ...tabBtnStyle, ...(tab === "tasks" ? tabActiveStyle : {}) }}
            >
              Tasks
            </button>
            <button
              type="button"
              onClick={() => setTab("roadmap")}
              style={{ ...tabBtnStyle, ...(tab === "roadmap" ? tabActiveStyle : {}) }}
            >
              Roadmap
            </button>
            <button
              type="button"
              onClick={() => setTab("bias")}
              style={{ ...tabBtnStyle, ...(tab === "bias" ? tabActiveStyle : {}) }}
              title="B.23 bias governance (local)"
            >
              Bias
            </button>
            <button
              type="button"
              onClick={() => setTab("pilot")}
              style={{ ...tabBtnStyle, ...(tab === "pilot" ? tabActiveStyle : {}) }}
              title="B.25 pilot scenario validation"
            >
              Pilot
            </button>
            <button
              type="button"
              onClick={() => setTab("metrics")}
              style={{ ...tabBtnStyle, ...(tab === "metrics" ? tabActiveStyle : {}) }}
              title="B.28 pilot usage metrics (local)"
            >
              Metrics
            </button>
            <button
              type="button"
              onClick={() => setTab("review")}
              style={{ ...tabBtnStyle, ...(tab === "review" ? tabActiveStyle : {}) }}
              title="B.29 pilot review (deterministic)"
            >
              Review
            </button>
            <button
              type="button"
              onClick={() => setTab("readiness")}
              style={{ ...tabBtnStyle, ...(tab === "readiness" ? tabActiveStyle : {}) }}
              title="B.30 go-to-pilot readiness gate"
            >
              Readiness
            </button>
            <button
              type="button"
              onClick={() => setTab("feedback")}
              style={{ ...tabBtnStyle, ...(tab === "feedback" ? tabActiveStyle : {}) }}
              title="B.32 operator feedback (local)"
            >
              Feedback
            </button>
            <button
              type="button"
              onClick={() => setTab("synthesis")}
              style={{ ...tabBtnStyle, ...(tab === "synthesis" ? tabActiveStyle : {}) }}
              title="B.33 pilot synthesis (all signals)"
            >
              Synthesis
            </button>
            <button
              type="button"
              onClick={() => setTab("domains")}
              style={{ ...tabBtnStyle, ...(tab === "domains" ? tabActiveStyle : {}) }}
              title="B.40 domain rollout / runtime fallback (dev)"
            >
              Domains
            </button>
          </div>

          {focusPhaseId ? (
            <div style={{ fontSize: 10, color: "#93c5fd", marginBottom: 6 }}>
              Focus phase: <strong>{focusPhaseId}</strong>{" "}
              <button type="button" style={miniBtnStyle} onClick={() => setFocusPhase(null)}>
                Clear
              </button>
            </div>
          ) : null}

          {tab === "domains" ? (
            <NexoraDomainRolloutPanel
              requestedDomainId={readActivePilotDomainIdFromDebug() ?? workspaceDomainId ?? null}
            />
          ) : tab === "synthesis" ? (
            <SynthesisDevPanel pilotSummary={pilotSummary} />
          ) : tab === "readiness" ? (
            <ReadinessDevPanel pilotSummary={pilotSummary} />
          ) : tab === "review" ? (
            <ReviewDevPanel pilotSummary={pilotSummary} />
          ) : tab === "feedback" ? (
            <FeedbackDevPanel />
          ) : tab === "metrics" ? (
            <MetricsDevPanel />
          ) : tab === "pilot" ? (
            <PilotDevPanel
              busy={pilotBusy}
              summary={pilotSummary}
              showDetails={pilotShowDetails}
              onToggleDetails={() => setPilotShowDetails((v) => !v)}
              onRunAll={async () => {
                setPilotBusy(true);
                try {
                  const s = await runPilotValidation({ scenarios: NEXORA_PILOT_SCENARIOS });
                  setPilotSummary(s);
                  setPilotShowDetails(true);
                } finally {
                  setPilotBusy(false);
                }
              }}
            />
          ) : tab === "bias" ? (
            <BiasGovernanceDevPanel
              tick={biasUiTick}
              bump={() => setBiasUiTick((t) => t + 1)}
            />
          ) : tab === "tasks" ? (
            <TasksPanel
              sorted={displayTasks}
              allCount={sortedTasks.length}
              filtered={Boolean(focusPhaseId)}
              title={title}
              setTitle={setTitle}
              detail={detail}
              setDetail={setDetail}
              priority={priority}
              setPriority={setPriority}
              phase={phase}
              setPhase={setPhase}
              tag={tag}
              setTag={setTag}
              dependsOn={dependsOn}
              setDependsOn={setDependsOn}
              addTask={addTask}
              presetB20Example={presetB20Example}
              presetPhaseFollowUp={presetPhaseFollowUp}
              refreshTasks={refreshTasks}
              clearAll={() => {
                if (window.confirm("Clear all dev tasks?")) {
                  clearDevTasks();
                  refreshTasks();
                }
              }}
            />
          ) : (
            <RoadmapPanel
              flatPhases={flatPhases}
              phaseById={phaseById}
              phases={phases}
              tasks={sortedTasks}
              refreshPhases={refreshPhases}
              setFocusPhase={setFocusPhase}
              focusPhaseId={focusPhaseId}
              newPhaseId={newPhaseId}
              setNewPhaseId={setNewPhaseId}
              newPhaseTitle={newPhaseTitle}
              setNewPhaseTitle={setNewPhaseTitle}
              newPhaseParent={newPhaseParent}
              setNewPhaseParent={setNewPhaseParent}
              newPhaseOrder={newPhaseOrder}
              setNewPhaseOrder={setNewPhaseOrder}
              addPhase={addPhase}
              clearRoadmap={() => {
                if (window.confirm("Clear roadmap phases? Tasks are not removed.")) {
                  clearRoadmapPhases();
                  refreshPhases();
                }
              }}
            />
          )}
        </div>
      ) : null}
    </>
  );
}

function TasksPanel(props: {
  sorted: NexoraDevTask[];
  allCount: number;
  filtered: boolean;
  title: string;
  setTitle: (s: string) => void;
  detail: string;
  setDetail: (s: string) => void;
  priority: NexoraDevTask["priority"];
  setPriority: (p: NexoraDevTask["priority"]) => void;
  phase: string;
  setPhase: (s: string) => void;
  tag: string;
  setTag: (s: string) => void;
  dependsOn: string;
  setDependsOn: (s: string) => void;
  addTask: () => void;
  presetB20Example: () => void;
  presetPhaseFollowUp: () => void;
  refreshTasks: () => void;
  clearAll: () => void;
}) {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 6 }}>
        <button type="button" onClick={props.clearAll} style={{ ...miniBtnStyle, fontSize: 10 }}>
          Clear all tasks
        </button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
        <button type="button" onClick={props.presetB20Example} style={chipBtnStyle}>
          Example: B20-FIX-1
        </button>
        <button type="button" onClick={props.presetPhaseFollowUp} style={chipBtnStyle}>
          Phase follow-up (B.20)
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
        <input value={props.title} onChange={(e) => props.setTitle(e.target.value)} placeholder="Title *" style={inputStyle} />
        <input value={props.detail} onChange={(e) => props.setDetail(e.target.value)} placeholder="Detail (optional)" style={inputStyle} />
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <select
            value={props.priority}
            onChange={(e) => props.setPriority(e.target.value as NexoraDevTask["priority"])}
            style={inputStyle}
          >
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
          <input
            value={props.phase}
            onChange={(e) => props.setPhase(e.target.value)}
            placeholder="Phase e.g. B.20"
            style={{ ...inputStyle, flex: 1, minWidth: 100 }}
          />
          <input
            value={props.tag}
            onChange={(e) => props.setTag(e.target.value)}
            placeholder="Tag e.g. B20-FIX-1"
            style={{ ...inputStyle, flex: 1, minWidth: 100 }}
          />
        </div>
        <input
          value={props.dependsOn}
          onChange={(e) => props.setDependsOn(e.target.value)}
          placeholder="Depends on (comma-separated tags / ids / phases)"
          style={inputStyle}
        />
        <button type="button" onClick={props.addTask} style={primaryBtnStyle}>
          Add task
        </button>
      </div>
      <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 6 }}>
        {props.filtered ? `Showing ${props.sorted.length} of ${props.allCount} tasks` : "Open first, then priority & recency."}
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
        {props.sorted.map((t) => (
          <li
            key={t.id}
            style={{
              borderRadius: 8,
              border: "1px solid rgba(148,163,184,0.2)",
              padding: "6px 8px",
              background: "rgba(30,41,59,0.45)",
            }}
          >
            <div style={{ fontWeight: 800, color: "#f8fafc", lineHeight: 1.35 }}>{t.title}</div>
            <div style={{ fontSize: 10, opacity: 0.85, marginTop: 4 }}>
              <span style={{ color: "#fcd34d" }}>{t.status}</span>
              {" · "}
              <span>{t.priority}</span>
              {t.phase ? (
                <>
                  {" · "}
                  <span style={{ color: "#93c5fd" }}>{t.phase}</span>
                </>
              ) : null}
              {t.tag ? (
                <>
                  {" · "}
                  <span style={{ color: "#86efac" }}>{t.tag}</span>
                </>
              ) : null}
            </div>
            {t.detail ? <div style={{ fontSize: 10, opacity: 0.8, marginTop: 4 }}>{t.detail}</div> : null}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
              <button type="button" onClick={() => { updateDevTask(t.id, { status: "done" }); props.refreshTasks(); }} style={miniBtnStyle}>
                Done
              </button>
              <button type="button" onClick={() => { updateDevTask(t.id, { status: "deferred" }); props.refreshTasks(); }} style={miniBtnStyle}>
                Deferred
              </button>
              <button type="button" onClick={() => { updateDevTask(t.id, { status: "in_progress" }); props.refreshTasks(); }} style={miniBtnStyle}>
                In progress
              </button>
              <button type="button" onClick={() => { deleteDevTask(t.id); props.refreshTasks(); }} style={miniBtnStyle}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      {props.sorted.length === 0 ? <div style={{ fontSize: 10, opacity: 0.7 }}>No tasks in this view.</div> : null}
    </>
  );
}

function RoadmapPanel(props: {
  flatPhases: NexoraRoadmapPhase[];
  phaseById: Map<string, NexoraRoadmapPhase>;
  phases: NexoraRoadmapPhase[];
  tasks: NexoraDevTask[];
  refreshPhases: () => void;
  setFocusPhase: (id: string | null) => void;
  focusPhaseId: string | null;
  newPhaseId: string;
  setNewPhaseId: (s: string) => void;
  newPhaseTitle: string;
  setNewPhaseTitle: (s: string) => void;
  newPhaseParent: string;
  setNewPhaseParent: (s: string) => void;
  newPhaseOrder: string;
  setNewPhaseOrder: (s: string) => void;
  addPhase: () => void;
  clearRoadmap: () => void;
}) {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, marginBottom: 8 }}>
        <button type="button" onClick={props.clearRoadmap} style={{ ...miniBtnStyle, fontSize: 10 }}>
          Clear roadmap
        </button>
      </div>
      <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 6 }}>
        Click <strong>Focus</strong> to filter tasks by phase / deps. Nested rows show parent chain.
      </div>
      <ul style={{ margin: "0 0 10px 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
        {props.flatPhases.map((ph) => {
          const depth = phaseDepth(ph, props.phaseById);
          const summary = buildPhaseTaskSummary(props.tasks, ph, props.phases);
          const health = phaseHealthLabel(ph, summary);
          const openN = summary.open + summary.inProgress + summary.deferred;
          const blocked = health === "blocked" || summary.blockedBy.length > 0;
          return (
            <li
              key={ph.id}
              style={{
                marginLeft: depth * 10,
                borderRadius: 8,
                border: `1px solid ${blocked ? "rgba(248,113,113,0.35)" : "rgba(148,163,184,0.2)"}`,
                padding: "6px 8px",
                background: blocked ? "rgba(127,29,29,0.2)" : "rgba(30,41,59,0.45)",
              }}
            >
              <div style={{ fontWeight: 800, color: "#f8fafc" }}>
                <span style={{ color: "#93c5fd" }}>{ph.id}</span> · {ph.title}
              </div>
              <div style={{ fontSize: 10, opacity: 0.88, marginTop: 4 }}>
                <span style={{ color: "#fcd34d" }}>{ph.status}</span>
                {" · "}
                <span>open tasks: {openN}</span>
                {summary.total ? (
                  <>
                    {" · "}
                    <span>
                      Σ {summary.total} (✓{summary.done})
                    </span>
                  </>
                ) : null}
                {blocked ? <span style={{ color: "#fca5a5" }}> · blocked</span> : null}
              </div>
              {summary.blockedBy.length ? (
                <div style={{ fontSize: 9, color: "#fecaca", marginTop: 4 }}>Blocked by: {summary.blockedBy.join(", ")}</div>
              ) : null}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
                <button type="button" style={miniBtnStyle} onClick={() => props.setFocusPhase(ph.id)}>
                  Focus
                </button>
                <button
                  type="button"
                  style={miniBtnStyle}
                  onClick={() => {
                    upsertRoadmapPhase(normalizeRoadmapPhase({ ...ph, status: "done" }));
                    props.refreshPhases();
                  }}
                >
                  Mark done
                </button>
                <button
                  type="button"
                  style={miniBtnStyle}
                  onClick={() => {
                    upsertRoadmapPhase(normalizeRoadmapPhase({ ...ph, status: "active" }));
                    props.refreshPhases();
                  }}
                >
                  Active
                </button>
                <button
                  type="button"
                  style={miniBtnStyle}
                  onClick={() => {
                    upsertRoadmapPhase(normalizeRoadmapPhase({ ...ph, status: "blocked" }));
                    props.refreshPhases();
                  }}
                >
                  Blocked
                </button>
                <button
                  type="button"
                  style={miniBtnStyle}
                  onClick={() => {
                    upsertRoadmapPhase(normalizeRoadmapPhase({ ...ph, status: "planned" }));
                    props.refreshPhases();
                  }}
                >
                  Planned
                </button>
                <button
                  type="button"
                  style={miniBtnStyle}
                  onClick={() => {
                    if (window.confirm(`Delete phase ${ph.id}?`)) {
                      deleteRoadmapPhase(ph.id);
                      props.refreshPhases();
                      if (props.focusPhaseId === ph.id) props.setFocusPhase(null);
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <div style={{ fontSize: 10, fontWeight: 700, color: "#a5b4fc", marginBottom: 4 }}>Add phase</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <input value={props.newPhaseId} onChange={(e) => props.setNewPhaseId(e.target.value)} placeholder="id e.g. B.20" style={inputStyle} />
        <input value={props.newPhaseTitle} onChange={(e) => props.setNewPhaseTitle(e.target.value)} placeholder="title" style={inputStyle} />
        <input
          value={props.newPhaseParent}
          onChange={(e) => props.setNewPhaseParent(e.target.value)}
          placeholder="parent id (optional)"
          style={inputStyle}
        />
        <input value={props.newPhaseOrder} onChange={(e) => props.setNewPhaseOrder(e.target.value)} placeholder="order (optional number)" style={inputStyle} />
        <button type="button" onClick={props.addPhase} style={primaryBtnStyle}>
          Upsert phase
        </button>
      </div>
    </>
  );
}

function PilotDevPanel(props: {
  busy: boolean;
  summary: NexoraPilotValidationSummary | null;
  showDetails: boolean;
  onToggleDetails: () => void;
  onRunAll: () => void | Promise<void>;
}): React.ReactElement {
  const pct = props.summary ? Math.round(props.summary.passRate * 100) : null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 10 }}>
      <div style={{ color: "#93c5fd", lineHeight: 1.4 }}>
        B.25 — Structured scenarios vs live <code style={{ color: "#fde68a" }}>ingestion</code> +{" "}
        <code style={{ color: "#fde68a" }}>fragility</code>. Requires backend; web connector cases may flake offline.
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <button type="button" style={primaryBtnStyle} disabled={props.busy} onClick={() => void props.onRunAll()}>
          {props.busy ? "Running…" : "Run all scenarios"}
        </button>
        <button type="button" style={miniBtnStyle} onClick={props.onToggleDetails} disabled={!props.summary}>
          {props.showDetails ? "Hide details" : "Show results"}
        </button>
      </div>
      {props.summary ? (
        <>
          <div style={{ fontWeight: 800, color: "#e2e8f0" }}>
            Summary: {props.summary.passed}/{props.summary.total} passed → {pct}%
          </div>
          {props.showDetails ? (
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
              {props.summary.results.map((res) => {
                const sc = NEXORA_PILOT_SCENARIOS.find((s) => s.id === res.scenarioId);
                return (
                  <li
                    key={res.scenarioId}
                    style={{
                      border: "1px solid rgba(148,163,184,0.2)",
                      borderRadius: 6,
                      padding: 6,
                      background: "rgba(30,41,59,0.35)",
                    }}
                  >
                    <div>
                      {res.passed ? "✅" : "❌"} <strong>{sc?.name ?? res.scenarioId}</strong>
                    </div>
                    <div style={{ color: "#94a3b8", marginTop: 4, fontSize: 9 }}>
                      signals {res.checks.signalsOk ? "✓" : "✗"} · fragility {res.checks.fragilityOk ? "✓" : "✗"}
                      {typeof res.checks.driversOk === "boolean" ? ` · drivers ${res.checks.driversOk ? "✓" : "✗"}` : ""}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : null}
          <div style={{ color: "#a5b4fc", fontSize: 9, lineHeight: 1.35 }}>
            {
              "Pilot-ready bar: ≥75% pass; avoid 0-signal runs; fragility must fall in each scenario's expected band."
            }
          </div>
        </>
      ) : (
        <div style={{ color: "#64748b" }}>No run yet. Use &quot;Run all scenarios&quot;.</div>
      )}
    </div>
  );
}

function trimStr(s: string): string {
  return s.trim();
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  fontSize: 11,
  padding: "5px 8px",
  borderRadius: 6,
  border: "1px solid rgba(148,163,184,0.25)",
  background: "rgba(15,23,42,0.6)",
  color: "#e2e8f0",
};

const primaryBtnStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: "pointer",
  fontWeight: 700,
  background: "rgba(217,119,6,0.35)",
  borderColor: "rgba(251,191,36,0.45)",
  color: "#fffbeb",
};

const miniBtnStyle: React.CSSProperties = {
  fontSize: 9,
  fontWeight: 700,
  padding: "2px 6px",
  borderRadius: 4,
  border: "1px solid rgba(148,163,184,0.3)",
  background: "rgba(30,41,59,0.85)",
  color: "#cbd5e1",
  cursor: "pointer",
};

function synthesisStatusLabel(s: NexoraPilotSynthesis["overallStatus"]): string {
  if (s === "strong") return "STRONG";
  if (s === "moderate") return "MODERATE";
  return "WEAK";
}

function synthesisStatusColor(s: NexoraPilotSynthesis["overallStatus"]): string {
  if (s === "strong") return "#4ade80";
  if (s === "moderate") return "#fde047";
  return "#f87171";
}

function SynthesisDevPanel(props: { pilotSummary: NexoraPilotValidationSummary | null }): React.ReactElement {
  const [synthesis, setSynthesis] = useState<NexoraPilotSynthesis | null>(null);
  const cacheRef = useRef<{ sig: string; result: NexoraPilotSynthesis } | null>(null);

  const onGenerate = useCallback(() => {
    const validation = props.pilotSummary ? { passRate: props.pilotSummary.passRate } : null;
    const domainId = readActivePilotDomainIdFromDebug();
    const input = collectNexoraPilotSynthesisInputFromBrowser(validation, domainId);

    const sig = buildNexoraPilotSynthesisInputSignature(input, domainId);
    if (cacheRef.current?.sig === sig) {
      setSynthesis(cacheRef.current.result);
      return;
    }

    const result = buildNexoraPilotSynthesis(input, domainId);
    cacheRef.current = { sig, result };
    setSynthesis(result);
    emitPilotSynthesisGeneratedDevOnce(sig);
  }, [props.pilotSummary]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 11 }}>
      <div style={{ color: "#94a3b8", lineHeight: 1.45 }}>
        B.33 — Single diagnosis from B.28 metrics, B.21 quality (readiness debug shape), B.25 validation, B.30 readiness, B.32
        feedback, and B.29 review (rebuilt deterministically here). No persistence; click to generate.
      </div>
      <button type="button" style={primaryBtnStyle} onClick={onGenerate}>
        Generate synthesis
      </button>
      {synthesis ? (
        <>
          <div style={{ marginTop: 4, fontWeight: 800, color: synthesisStatusColor(synthesis.overallStatus) }}>
            Status: {synthesisStatusLabel(synthesis.overallStatus)}
          </div>
          <div style={{ marginTop: 6 }}>
            <div style={{ fontWeight: 800, color: "#fde68a", marginBottom: 4 }}>Summary:</div>
            <div style={{ color: "#e2e8f0", lineHeight: 1.5 }}>{synthesis.summary}</div>
          </div>
          <div style={{ marginTop: 6 }}>
            <div style={{ fontWeight: 800, color: "#fde68a", marginBottom: 4 }}>Key findings:</div>
            {synthesis.keyFindings.length === 0 ? (
              <div style={{ color: "#64748b", fontSize: 10 }}>—</div>
            ) : (
              <ul style={{ margin: 0, paddingLeft: 16, color: "#e2e8f0", lineHeight: 1.45, fontSize: 10 }}>
                {synthesis.keyFindings.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            )}
          </div>
          <div style={{ marginTop: 6 }}>
            <div style={{ fontWeight: 800, color: "#fde68a", marginBottom: 4 }}>Top priorities:</div>
            {synthesis.priorities.length === 0 ? (
              <div style={{ color: "#64748b", fontSize: 10 }}>—</div>
            ) : (
              <ol style={{ margin: 0, paddingLeft: 20, color: "#e2e8f0", lineHeight: 1.45, fontSize: 10 }}>
                {synthesis.priorities.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ol>
            )}
          </div>
        </>
      ) : (
        <div style={{ color: "#64748b", fontSize: 10 }}>Click &quot;Generate synthesis&quot; to combine current pilot signals.</div>
      )}
    </div>
  );
}

function FeedbackDevPanel(): React.ReactElement {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const onChange = () => setTick((t) => t + 1);
    window.addEventListener(NEXORA_FEEDBACK_CHANGED_EVENT, onChange);
    return () => window.removeEventListener(NEXORA_FEEDBACK_CHANGED_EVENT, onChange);
  }, []);
  const records = useMemo(() => loadNexoraFeedback(), [tick]);
  const summary = useMemo(() => buildNexoraFeedbackSummary(records), [records]);
  const pct = (n: number) => `${Math.round(n * 100)}%`;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 11 }}>
      <div style={{ color: "#94a3b8", lineHeight: 1.45 }}>
        B.32 — Operator feedback from <code style={{ color: "#fde68a" }}>{STORAGE_KEY}</code> (this browser only). One row per run per
        feedback type.
      </div>
      <div style={{ color: "#e2e8f0", fontFamily: "ui-monospace, monospace", lineHeight: 1.65 }}>
        <div>Total feedback: {summary.total}</div>
        <div>Helpful: {summary.helpful}</div>
        <div>Not helpful: {summary.notHelpful}</div>
        <div>Confusing: {summary.confusing}</div>
        {summary.incorrect > 0 ? <div>Incorrect: {summary.incorrect}</div> : null}
        <div>Helpful rate: {pct(summary.helpfulRate)}</div>
        <div>Negative rate: {pct(summary.negativeRate)}</div>
        <div>Confusion rate: {pct(summary.confusionRate)}</div>
      </div>
      {summary.lastNotes.length > 0 ? (
        <div style={{ marginTop: 4 }}>
          <div style={{ fontWeight: 800, color: "#fde68a", marginBottom: 4 }}>Recent notes</div>
          <ul style={{ margin: 0, paddingLeft: 16, color: "#cbd5e1", lineHeight: 1.45, fontSize: 10 }}>
            {summary.lastNotes.map((n, i) => (
              <li key={`${i}-${n.slice(0, 24)}`}>{n.length > 160 ? `${n.slice(0, 160)}…` : n}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <button type="button" style={miniBtnStyle} onClick={() => setTick((t) => t + 1)}>
          Refresh
        </button>
      </div>
    </div>
  );
}

function MetricsDevPanel(): React.ReactElement {
  const [tick, setTick] = useState(0);
  const records = useMemo(() => loadNexoraMetricRecords(), [tick]);
  const summary = useMemo(() => buildNexoraMetricsSummary(records), [records]);
  const dropoffLine = useMemo(() => describeBiggestMetricsDropoff(records), [records]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 11 }}>
      <div style={{ color: "#94a3b8", lineHeight: 1.45 }}>
        B.28 — Pilot funnel from <code style={{ color: "#fde68a" }}>nexora.metrics.v1</code> (this browser only).
      </div>
      <div style={{ color: "#e2e8f0", fontFamily: "ui-monospace, monospace", lineHeight: 1.65 }}>
        <div>Runs: {summary.totalRuns}</div>
        <div>Compare: {formatMetricPercent(summary.compareRate)}</div>
        <div>Decision: {formatMetricPercent(summary.decisionRate)}</div>
        <div>Outcome: {formatMetricPercent(summary.outcomeRate)}</div>
        <div>Errors: {formatMetricPercent(summary.errorRate)}</div>
      </div>
      <div style={{ color: "#fde68a", fontWeight: 700, lineHeight: 1.4 }}>{dropoffLine}</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <button type="button" style={miniBtnStyle} onClick={() => setTick((t) => t + 1)}>
          Refresh
        </button>
        <button
          type="button"
          style={{ ...miniBtnStyle, color: "#fca5a5", borderColor: "rgba(248,113,113,0.45)" }}
          onClick={() => {
            if (window.confirm("Clear all stored pilot metrics?")) {
              clearNexoraMetricsStorage();
              setTick((t) => t + 1);
            }
          }}
        >
          Clear metrics
        </button>
      </div>
    </div>
  );
}

function ReviewDevPanel(props: { pilotSummary: NexoraPilotValidationSummary | null }): React.ReactElement {
  const [review, setReview] = useState<NexoraPilotReview | null>(null);

  const onGenerate = useCallback(() => {
    const records = loadNexoraMetricRecords();
    const metrics = buildNexoraMetricsSummary(records);
    const quality = readNexoraPilotReviewQualityFromDebug();
    const validation = props.pilotSummary ? { passRate: props.pilotSummary.passRate } : null;
    const input = { metrics, quality, validation };
    const sig = buildNexoraPilotReviewInputSignature(input);
    const domainId = readActivePilotDomainIdFromDebug();
    setReview(buildNexoraPilotReview(input, domainId));
    emitPilotReviewGeneratedDevOnce(sig);
  }, [props.pilotSummary]);

  const bulletBlock = (title: string, items: string[]) => (
    <div style={{ marginTop: 8 }}>
      <div style={{ fontWeight: 800, color: "#fde68a", marginBottom: 4 }}>{title}</div>
      {items.length === 0 ? (
        <div style={{ color: "#64748b", fontSize: 10 }}>—</div>
      ) : (
        <ul style={{ margin: 0, paddingLeft: 16, color: "#e2e8f0", lineHeight: 1.45, fontSize: 10 }}>
          {items.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 11 }}>
      <div style={{ color: "#94a3b8", lineHeight: 1.45 }}>
        B.29 — Pulls B.28 metrics, B.21 quality from <code style={{ color: "#fde68a" }}>__NEXORA_DEBUG__</code> when the main screen has computed it, and the last B.25 &quot;Run all scenarios&quot; result from the Pilot tab (if any).
      </div>
      <button type="button" style={primaryBtnStyle} onClick={onGenerate}>
        Generate review
      </button>
      {review ? (
        <>
          <div style={{ marginTop: 4 }}>
            <div style={{ fontWeight: 800, color: "#fde68a", marginBottom: 4 }}>Summary:</div>
            <div style={{ color: "#e2e8f0", lineHeight: 1.5, fontSize: 11 }}>{review.summary}</div>
          </div>
          {bulletBlock("Strengths:", review.strengths)}
          {bulletBlock("Weaknesses:", review.weaknesses)}
          {bulletBlock("Recommendations:", review.recommendations)}
        </>
      ) : (
        <div style={{ color: "#64748b", fontSize: 10 }}>Click &quot;Generate review&quot; to build from current signals (no auto-refresh).</div>
      )}
    </div>
  );
}

function readinessStatusColor(st: NexoraReadinessReport["status"]): string {
  if (st === "ready") return "#4ade80";
  if (st === "borderline") return "#fde047";
  return "#f87171";
}

function readinessStatusLabel(st: NexoraReadinessReport["status"]): string {
  if (st === "ready") return "READY";
  if (st === "borderline") return "BORDERLINE";
  return "NOT READY";
}

function ReadinessDevPanel(props: { pilotSummary: NexoraPilotValidationSummary | null }): React.ReactElement {
  const [report, setReport] = useState<NexoraReadinessReport | null>(null);

  const onCheck = useCallback(() => {
    const records = loadNexoraMetricRecords();
    const metrics = buildNexoraMetricsSummary(records);
    const quality = readNexoraReadinessQualityFromDebug();
    const validation = props.pilotSummary ? { passRate: props.pilotSummary.passRate } : null;
    const input = { metrics, quality, validation };
    const sig = buildNexoraReadinessInputSignature(input);
    setReport(buildNexoraReadinessReport(input));
    emitReadinessEvaluatedDevOnce(sig);
  }, [props.pilotSummary]);

  const signals = report?.signals;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 11 }}>
      <div style={{ color: "#94a3b8", lineHeight: 1.45 }}>
        B.30 — Single go / no-go gate from B.28 metrics, B.21 quality (debug), and B.25 pilot pass rate when available.
      </div>
      <button type="button" style={primaryBtnStyle} onClick={onCheck}>
        Check readiness
      </button>
      {report ? (
        <>
          <div style={{ marginTop: 4, fontWeight: 800, color: readinessStatusColor(report.status) }}>
            Status: {readinessStatusLabel(report.status)}
          </div>
          <div style={{ color: "#e2e8f0", fontFamily: "ui-monospace, monospace" }}>Score: {report.score.toFixed(2)}</div>
          <div style={{ marginTop: 6 }}>
            <div style={{ fontWeight: 800, color: "#fde68a", marginBottom: 4 }}>Summary:</div>
            <div style={{ color: "#e2e8f0", lineHeight: 1.5 }}>{report.summary}</div>
          </div>
          <div style={{ marginTop: 6 }}>
            <div style={{ fontWeight: 800, color: "#fde68a", marginBottom: 4 }}>Blockers:</div>
            {report.blockers.length === 0 ? (
              <div style={{ color: "#64748b", fontSize: 10 }}>—</div>
            ) : (
              <ul style={{ margin: 0, paddingLeft: 16, color: "#e2e8f0", lineHeight: 1.45, fontSize: 10 }}>
                {report.blockers.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
          </div>
          <div style={{ marginTop: 6 }}>
            <div style={{ fontWeight: 800, color: "#fde68a", marginBottom: 4 }}>Signals:</div>
            <div style={{ color: "#cbd5e1", fontFamily: "ui-monospace, monospace", fontSize: 10, lineHeight: 1.55 }}>
              <div>Validation: {signals?.validationPassRate != null ? signals.validationPassRate.toFixed(2) : "—"}</div>
              <div>Compare: {signals?.compareRate != null ? signals.compareRate.toFixed(2) : "—"}</div>
              <div>Decision: {signals?.decisionRate != null ? signals.decisionRate.toFixed(2) : "—"}</div>
              <div>Outcome: {signals?.outcomeRate != null ? signals.outcomeRate.toFixed(2) : "—"}</div>
              <div>Errors: {signals?.errorRate != null ? signals.errorRate.toFixed(2) : "—"}</div>
              <div>Quality: {signals?.qualityTier ?? "—"}</div>
            </div>
          </div>
        </>
      ) : (
        <div style={{ color: "#64748b", fontSize: 10 }}>Click &quot;Check readiness&quot; to evaluate (no auto-refresh).</div>
      )}
    </div>
  );
}

const chipBtnStyle: React.CSSProperties = {
  ...miniBtnStyle,
  borderColor: "rgba(251,191,36,0.35)",
  color: "#fde68a",
};

const tabBtnStyle: React.CSSProperties = {
  fontWeight: 700,
  borderRadius: 4,
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "rgba(148,163,184,0.3)",
  background: "rgba(30,41,59,0.85)",
  color: "#cbd5e1",
  cursor: "pointer",
  flex: 1,
  padding: "6px 8px",
  fontSize: 10,
};

const tabActiveStyle: React.CSSProperties = {
  background: "rgba(251,191,36,0.2)",
  borderColor: "rgba(251,191,36,0.5)",
  color: "#fffbeb",
};

function BiasGovernanceDevPanel(props: { tick: number; bump: () => void }) {
  const cfg = React.useMemo(() => getNexoraBiasGovernanceConfig(), [props.tick]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 10 }}>
      <div style={{ color: "#93c5fd", lineHeight: 1.35 }}>
        B.23 — Adaptive bias governance (saved to <code style={{ color: "#fde68a" }}>localStorage</code>). Dispatch updates the main screen.
      </div>
      <div style={{ color: "#94a3b8", lineHeight: 1.4 }}>
        B.24 — Bias on/off is controlled by <strong style={{ color: "#e2e8f0" }}>Adaptive / Pure</strong> in the command bar (not this panel).
      </div>
      <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ color: "#94a3b8" }}>Strength (0–1)</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={cfg.strength}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (!Number.isFinite(v)) return;
            saveNexoraBiasGovernanceOverride({ strength: v });
            props.bump();
          }}
          style={{ width: "100%" }}
        />
        <span style={{ color: "#e2e8f0" }}>{cfg.strength.toFixed(2)}</span>
      </label>
      <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ color: "#94a3b8" }}>Min rated runs</span>
        <input
          type="number"
          min={0}
          max={99}
          value={cfg.minRatedRuns}
          onChange={(e) => {
            const v = Math.floor(Number(e.target.value));
            if (!Number.isFinite(v)) return;
            saveNexoraBiasGovernanceOverride({ minRatedRuns: v });
            props.bump();
          }}
          style={{ ...inputStyle, width: "100%" }}
        />
      </label>
      <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={cfg.allowPreferredOptionBias}
          onChange={(e) => {
            saveNexoraBiasGovernanceOverride({ allowPreferredOptionBias: e.target.checked });
            props.bump();
          }}
        />
        <span>Allow preferred-option nudge</span>
      </label>
      <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={cfg.allowDiscouragedOptionBias}
          onChange={(e) => {
            saveNexoraBiasGovernanceOverride({ allowDiscouragedOptionBias: e.target.checked });
            props.bump();
          }}
        />
        <span>Allow discouraged-option nudge</span>
      </label>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <button
          type="button"
          style={miniBtnStyle}
          onClick={() => {
            if (window.confirm("Reset bias governance to defaults and clear localStorage override?")) {
              clearNexoraBiasGovernanceOverride();
              props.bump();
            }
          }}
        >
          Reset defaults
        </button>
        <button
          type="button"
          style={miniBtnStyle}
          onClick={() => {
            saveNexoraBiasGovernanceFull(DEFAULT_NEXORA_BIAS_GOVERNANCE);
            props.bump();
          }}
        >
          Re-apply defaults
        </button>
      </div>
    </div>
  );
}
