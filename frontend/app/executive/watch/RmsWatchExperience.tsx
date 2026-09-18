"use client";

/**
 * NPA-T RMS:8 — customer WATCH workspace.
 * Composes Scenario playback over real Nexora conversation/Stage references.
 */

import { useMemo, useState, type CSSProperties } from "react";
import { listRmsWatchScenarioCards } from "@/app/lib/rms/rmsWatchCatalog.ts";
import {
  pauseRmsWatch,
  playRmsWatch,
  restartRmsWatch,
  resumeRmsWatch,
  setRmsWatchSpeed,
  startRmsWatchSession,
  stepRmsWatch,
} from "@/app/lib/rms/rmsWatchSession.ts";
import {
  requestRmsTakeControl,
  restoreRmsTakeControl,
  speakAsRmsHumanManager,
  pauseRmsTakeControlSimulation,
  resumeRmsTakeControlSimulation,
  stepRmsTakeControlSimulation,
} from "@/app/lib/rms/rmsHandoffRuntime.ts";
import {
  compareRmsExperiment,
  createRmsExperimentBranch,
  restoreRmsExperiment,
  selectRmsExperimentBranch,
  speakOnRmsExperimentBranch,
  startRmsExperiment,
  stepRmsExperimentBranch,
} from "@/app/lib/rms/rmsExperimentRuntime.ts";
import type { RmsWatchScenarioCard, RmsWatchSession, RmsWatchSpeed } from "@/app/lib/rms/rmsWatchContract.ts";
import type { RmsTakeControlView } from "@/app/lib/rms/rmsHandoffContract.ts";
import type { RmsExperimentView } from "@/app/lib/rms/rmsExperimentContract.ts";

const chrome = {
  bg: "#0a0e14",
  panel: "#121821",
  line: "rgba(255,255,255,0.08)",
  text: "#e8eef6",
  muted: "rgba(232,238,246,0.62)",
  accent: "#7eb0ff",
  manager: "#d7c4a3",
};

export function RmsWatchExperience({ cards = listRmsWatchScenarioCards() }: { readonly cards?: readonly RmsWatchScenarioCard[] }) {
  const [selected, setSelected] = useState<RmsWatchScenarioCard | null>(null);
  const [session, setSession] = useState<RmsWatchSession | null>(null);
  const [control, setControl] = useState<RmsTakeControlView | null>(null);
  const [experiment, setExperiment] = useState<RmsExperimentView | null>(null);
  const [draft, setDraft] = useState("");
  const visibleConversation = useMemo(() => {
    if (!session) return [];
    if (control?.phase === "TAKE_CONTROL") return session.presentation.conversation;
    const allowed = new Set(
      session.visibleMoments.map((item) => item.conversationTurnIndex).filter((item): item is number => item != null),
    );
    if (allowed.size === 0) return [];
    return session.presentation.conversation.filter((item) => allowed.has(item.turnIndex));
  }, [session, control]);

  if (!selected) {
    return (
      <div data-testid="rms-watch-selection" style={{ padding: 32, color: chrome.text, background: chrome.bg, minHeight: "100%" }}>
        <p style={{ letterSpacing: "0.12em", textTransform: "uppercase", fontSize: 12, color: chrome.muted }}>Executive simulation playback</p>
        <h1 style={{ fontSize: 28, fontWeight: 560, margin: "8px 0 24px" }}>Choose a Business or Project</h1>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          {cards.map((card) => (
            <button
              key={card.scenarioId}
              type="button"
              data-testid={`rms-watch-card-${card.scenarioId}`}
              onClick={() => setSelected(card)}
              style={{
                textAlign: "left",
                background: chrome.panel,
                border: `1px solid ${chrome.line}`,
                color: chrome.text,
                padding: 20,
                borderRadius: 12,
                cursor: "pointer",
              }}
            >
              <div style={{ fontSize: 12, color: chrome.accent }}>{card.worldKindLabel}</div>
              <div style={{ fontSize: 18, margin: "8px 0" }}>{card.title}</div>
              <p style={{ color: chrome.muted, fontSize: 14, lineHeight: 1.45 }}>{card.shortDescription}</p>
              <div style={{ fontSize: 12, color: chrome.muted }}>{card.estimatedLength} · {card.dataAreas.join(" · ")}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div data-testid="rms-watch-start" style={{ padding: 32, color: chrome.text, background: chrome.bg, minHeight: "100%" }}>
        <p style={{ color: chrome.accent, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase" }}>{selected.worldKindLabel}</p>
        <h1 style={{ fontSize: 28, fontWeight: 560 }}>{selected.title}</h1>
        <p style={{ maxWidth: 640, color: chrome.muted, lineHeight: 1.5 }}>{selected.shortDescription}</p>
        <p style={{ marginTop: 24 }}>You will watch a Simulated Manager work with Nexora as the situation evolves.</p>
        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <button type="button" data-testid="rms-watch-begin" onClick={() => setSession(startRmsWatchSession({ scenarioId: selected.scenarioId, version: selected.version }))} style={primaryButton}>
            Start simulation
          </button>
          <button type="button" onClick={() => setSelected(null)} style={ghostButton}>
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="rms-watch-workspace" style={{ display: "grid", gridTemplateColumns: "minmax(280px, 1fr) minmax(360px, 1.2fr) minmax(280px, 1fr)", height: "100%", background: chrome.bg, color: chrome.text }}>
      <section style={panel}>
        <h2 style={h2}>Timeline</h2>
        <p data-testid="rms-watch-progress">{session.progress}</p>
        <ol data-testid="rms-watch-timeline" style={{ paddingLeft: 18, lineHeight: 1.6 }}>
          {session.visibleMoments.map((moment) => (
            <li key={moment.momentId}>{moment.label}</li>
          ))}
        </ol>
        <h3 style={h3}>What changed?</h3>
        <p data-testid="rms-watch-what-changed">{session.presentation.whatChanged}</p>
      </section>
      <section style={{ ...panel, borderLeft: `1px solid ${chrome.line}`, borderRight: `1px solid ${chrome.line}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, color: chrome.accent }}>{session.presentation.scenario.worldKindLabel}</div>
            <h2 style={{ ...h2, margin: "4px 0" }}>{session.presentation.organizationLabel}</h2>
            <p style={{ color: chrome.muted, fontSize: 13 }}>{session.presentation.managerObjective}</p>
          </div>
          <div style={{ fontSize: 12, color: chrome.muted }}>{session.currentTickLabel}</div>
        </div>
        <div data-testid="rms-watch-stage" style={{ margin: "16px 0", padding: 12, border: `1px solid ${chrome.line}`, borderRadius: 10 }}>
          <div style={{ fontSize: 12, color: chrome.muted }}>Nexora Stage</div>
          <div>{session.presentation.stage.focusedSubjectLabel ?? "Context is forming on the real Stage."}</div>
          <div style={{ fontSize: 12, color: chrome.muted }}>{session.presentation.stage.workspace ?? "overview"}</div>
        </div>
        <h3 style={h3}>Conversation</h3>
        <div data-testid="rms-watch-conversation">
          {visibleConversation.map((turn, index) => (
            <div key={`${turn.speaker}-${turn.turnIndex}-${index}`} data-speaker={turn.speaker} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: turn.speaker === "SIMULATED_MANAGER" ? chrome.manager : chrome.accent }}>
                {turn.speaker === "SIMULATED_MANAGER" ? turn.managerLabel : turn.nexoraLabel}
              </div>
              <div>{turn.text}</div>
            </div>
          ))}
          {control?.humanTurns.map((turn) => (
            <div key={`human-${turn.turnIndex}`} data-speaker="HUMAN_MANAGER" style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: chrome.text }}>You</div>
              <div>{turn.text}</div>
              <div style={{ fontSize: 12, color: chrome.accent, marginTop: 8 }}>Nexora</div>
              <div>{turn.nexoraResponse}</div>
            </div>
          ))}
        </div>
        {control?.phase === "TAKE_CONTROL" ? (
          <div data-testid="rms-take-control-active" style={{ marginTop: 16 }}>
            <p data-testid="rms-handoff-summary">{control.summary}</p>
            <textarea
              data-testid="rms-human-input"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              rows={3}
              style={{ width: "100%", marginTop: 8, background: chrome.panel, color: chrome.text, border: `1px solid ${chrome.line}`, borderRadius: 8, padding: 8 }}
            />
            <button
              type="button"
              data-testid="rms-human-send"
              onClick={() => {
                if (!draft.trim()) return;
                setControl(speakAsRmsHumanManager(session.watchSessionId, draft.trim()));
                setDraft("");
              }}
              style={{ ...primaryButton, marginTop: 8 }}
            >
              Send to Nexora
            </button>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button type="button" onClick={() => setControl(pauseRmsTakeControlSimulation(session.watchSessionId))} style={ghostButton}>Pause simulation</button>
              <button type="button" onClick={() => setControl(resumeRmsTakeControlSimulation(session.watchSessionId))} style={ghostButton}>Resume simulation</button>
              <button type="button" onClick={() => setControl(stepRmsTakeControlSimulation(session.watchSessionId))} style={ghostButton}>Advance</button>
            </div>
          </div>
        ) : null}
        {experiment ? (
          <div data-testid="rms-experiment-active" style={{ marginTop: 16, padding: 12, border: `1px solid ${chrome.line}`, borderRadius: 10 }}>
            <p>Simulation paused at this management moment.</p>
            <p data-testid="rms-experiment-notice" style={{ color: chrome.muted, fontSize: 13 }}>{experiment.customerNotice}</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
              {experiment.branches.map((branch) => (
                <button
                  key={branch.branchId}
                  type="button"
                  data-testid={`rms-experiment-branch-${branch.kind}`}
                  onClick={() => setExperiment(selectRmsExperimentBranch(experiment.experiment.experimentId, branch.branchId))}
                  style={experiment.experiment.selectedBranchId === branch.branchId ? primaryButton : ghostButton}
                >
                  {branch.label}
                </button>
              ))}
            </div>
            {experiment.branches.length < 3 ? (
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button type="button" onClick={() => setExperiment(createRmsExperimentBranch(experiment.experiment.experimentId, { label: "Temporary Capacity" }))} style={ghostButton}>Add Temporary Capacity path</button>
                <button type="button" onClick={() => setExperiment(createRmsExperimentBranch(experiment.experiment.experimentId, { label: "External Production" }))} style={ghostButton}>Add External Production path</button>
              </div>
            ) : null}
            <textarea
              data-testid="rms-experiment-input"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              rows={2}
              style={{ width: "100%", marginTop: 8, background: chrome.panel, color: chrome.text, border: `1px solid ${chrome.line}`, borderRadius: 8, padding: 8 }}
            />
            <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => {
                  if (!draft.trim()) return;
                  speakOnRmsExperimentBranch(experiment.experiment.experimentId, experiment.experiment.selectedBranchId, draft.trim());
                  setExperiment(selectRmsExperimentBranch(experiment.experiment.experimentId, experiment.experiment.selectedBranchId));
                  setDraft("");
                }}
                style={primaryButton}
              >
                Ask Nexora on this path
              </button>
              <button type="button" onClick={() => setExperiment(stepRmsExperimentBranch(experiment.experiment.experimentId, experiment.experiment.selectedBranchId))} style={ghostButton}>Advance path</button>
              <button type="button" data-testid="rms-experiment-compare" onClick={() => setExperiment(compareRmsExperiment(experiment.experiment.experimentId))} style={ghostButton}>Compare paths</button>
            </div>
            {experiment.comparison ? (
              <div data-testid="rms-experiment-comparison" style={{ marginTop: 12 }}>
                <p>{experiment.comparison.explanation[0]}</p>
                <ul>
                  {experiment.comparison.rows.map((row) => (
                    <li key={`${row.branchId}-${row.dimension}`}>{row.dimension}: {String(row.value ?? "—")}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}
        {control?.phase === "HANDOFF_FAILED" ? <p data-testid="rms-handoff-failed">{control.summary}</p> : null}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
          <button type="button" data-testid="rms-watch-play" onClick={() => setSession(playRmsWatch(session.watchSessionId))} style={primaryButton}>Play</button>
          <button type="button" data-testid="rms-watch-pause" onClick={() => setSession(pauseRmsWatch(session.watchSessionId))} style={ghostButton}>Pause</button>
          <button type="button" data-testid="rms-watch-resume" onClick={() => setSession(resumeRmsWatch(session.watchSessionId))} style={ghostButton}>Resume</button>
          <button type="button" data-testid="rms-watch-step" onClick={() => setSession(stepRmsWatch(session.watchSessionId))} style={ghostButton}>Next moment</button>
          <button type="button" data-testid="rms-watch-restart" onClick={() => { setControl(null); setExperiment(null); setSession(restartRmsWatch(session.watchSessionId)); }} style={ghostButton}>Restart</button>
          {([1, 2, 4] as const satisfies readonly RmsWatchSpeed[]).map((speed) => (
            <button key={speed} type="button" onClick={() => setSession(setRmsWatchSpeed(session.watchSessionId, speed))} style={ghostButton}>{speed}×</button>
          ))}
        </div>
        <button
          type="button"
          data-testid="rms-watch-take-control"
          onClick={() => {
            const next = restoreRmsTakeControl(session.watchSessionId);
            setControl(next?.phase === "TAKE_CONTROL" ? next : requestRmsTakeControl(session.watchSessionId));
          }}
          style={{ ...primaryButton, marginTop: 8 }}
        >
          Take Control
        </button>
        {control?.phase === "TAKE_CONTROL" ? (
          <button
            type="button"
            data-testid="rms-watch-experiment"
            onClick={() => setExperiment(restoreRmsExperiment(session.watchSessionId) ?? startRmsExperiment(session.watchSessionId))}
            style={{ ...primaryButton, marginTop: 8 }}
          >
            Experiment
          </button>
        ) : null}
      </section>
      <section style={panel}>
        <h2 style={h2}>Visible data</h2>
        <ul data-testid="rms-watch-data">
          {session.presentation.data.filter((item) => item.status === "AVAILABLE").map((item) => (
            <li key={item.field}>{item.field}: {String(item.value ?? "—")}</li>
          ))}
        </ul>
        <h3 style={h3}>Why did Nexora react?</h3>
        <p data-testid="rms-watch-why">{session.presentation.whyNexoraReacted}</p>
        <h3 style={h3}>Guidance</h3>
        {session.presentation.guidance.map((line) => (
          <p key={line} style={{ color: chrome.muted, fontSize: 13 }}>{line}</p>
        ))}
        <button
          type="button"
          data-testid="rms-watch-switch"
          onClick={() => {
            setSession(null);
            setSelected(null);
            setControl(null);
            setExperiment(null);
          }}
          style={{ ...ghostButton, marginTop: 16 }}
        >
          Choose another simulation
        </button>
      </section>
    </div>
  );
}

const panel: CSSProperties = { padding: 20, overflow: "auto" };
const h2: CSSProperties = { fontSize: 16, fontWeight: 600, margin: "0 0 8px" };
const h3: CSSProperties = { fontSize: 13, fontWeight: 600, margin: "16px 0 8px" };
const primaryButton: CSSProperties = {
  background: "#1d4ed8",
  color: "white",
  border: 0,
  borderRadius: 8,
  padding: "8px 12px",
  cursor: "pointer",
};
const ghostButton: CSSProperties = {
  background: "transparent",
  color: chrome.text,
  border: `1px solid ${chrome.line}`,
  borderRadius: 8,
  padding: "8px 12px",
  cursor: "pointer",
};
