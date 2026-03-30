"use client";

import React from "react";

import { buildDecisionExecutionIntent } from "../../lib/execution/buildDecisionExecutionIntent";
import { buildCollaborationState } from "../../lib/collaboration/buildCollaborationState";
import {
  appendCollaborationInput,
  loadCollaborationEnvelope,
  persistCollaborationState,
} from "../../lib/collaboration/collaborationStore";
import type {
  CollaborationInput,
  CollaborationInputKind,
  CollaboratorRole,
} from "../../lib/collaboration/collaborationTypes";
import type { CanonicalRecommendation } from "../../lib/decision/recommendation/recommendationTypes";
import type { DecisionMemoryEntry } from "../../lib/decision/memory/decisionMemoryTypes";
import { nx, panelSurfaceStyle, secondaryButtonStyle, softCardStyle } from "../ui/nexoraTheme";

type CollaborationIntelligencePanelProps = {
  workspaceId?: string | null;
  projectId?: string | null;
  responseData?: any;
  canonicalRecommendation?: CanonicalRecommendation | null;
  decisionResult?: any;
  memoryEntries?: DecisionMemoryEntry[];
  onOpenTeamDecision?: (() => void) | null;
  onOpenDecisionGovernance?: (() => void) | null;
  onOpenExecutiveApproval?: (() => void) | null;
};

function pretty(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (match) => match.toUpperCase());
}

function relativeTime(timestamp: number) {
  const delta = Math.max(0, Date.now() - timestamp);
  const minutes = Math.round(delta / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export function CollaborationIntelligencePanel(props: CollaborationIntelligencePanelProps) {
  const intent = React.useMemo(
    () =>
      buildDecisionExecutionIntent({
        source: "recommendation",
        canonicalRecommendation: props.canonicalRecommendation ?? null,
        responseData: props.responseData ?? null,
        decisionResult: props.decisionResult ?? null,
      }),
    [props.canonicalRecommendation, props.responseData, props.decisionResult]
  );
  const decisionId = intent?.id ?? props.canonicalRecommendation?.id ?? null;
  const [version, setVersion] = React.useState(0);
  const [userLabel, setUserLabel] = React.useState("Executive reviewer");
  const [role, setRole] = React.useState<CollaboratorRole>("executive");
  const [kind, setKind] = React.useState<CollaborationInputKind>("concern");
  const [summary, setSummary] = React.useState("");

  const envelope = React.useMemo(
    () =>
      loadCollaborationEnvelope(
        props.workspaceId ?? null,
        props.projectId ?? null,
        decisionId
      ),
    [props.workspaceId, props.projectId, decisionId, version]
  );

  const state = React.useMemo(
    () =>
      buildCollaborationState({
        canonicalRecommendation: props.canonicalRecommendation ?? null,
        decisionExecutionIntent: intent,
        responseData: props.responseData ?? null,
        decisionResult: props.decisionResult ?? null,
        memoryEntries: props.memoryEntries ?? [],
        collaborationInputs: envelope?.inputs ?? [],
      }),
    [props.canonicalRecommendation, intent, props.responseData, props.decisionResult, props.memoryEntries, envelope]
  );

  React.useEffect(() => {
    if (!decisionId) return;
    persistCollaborationState({
      workspaceId: props.workspaceId ?? null,
      projectId: props.projectId ?? null,
      decisionId,
      state,
    });
  }, [decisionId, props.projectId, props.workspaceId, version]);

  const addInput = React.useCallback(() => {
    const trimmed = summary.trim();
    if (!trimmed || !decisionId) return;
    const input: CollaborationInput = {
      id: `collab_${Date.now().toString(36)}`,
      timestamp: Date.now(),
      user_id: userLabel.toLowerCase().replace(/[^a-z0-9]+/g, "_"),
      user_label: userLabel.trim(),
      role,
      kind,
      summary: trimmed,
      related_to: state.decision_id ?? null,
    };
    appendCollaborationInput({
      workspaceId: props.workspaceId ?? null,
      projectId: props.projectId ?? null,
      decisionId,
      input,
      state,
    });
    setSummary("");
    setVersion((current) => current + 1);
  }, [decisionId, kind, props.projectId, props.workspaceId, role, state, summary, userLabel]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, minHeight: 0, overflow: "auto", padding: 2 }}>
      <div style={{ ...panelSurfaceStyle, padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ color: nx.text, fontSize: 16, fontWeight: 800 }}>Collaboration Intelligence</div>
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>
          Track how multiple contributors shape, challenge, and align around the current decision.
        </div>
      </div>

      <Section label="Shared Decision" title={state.shared_recommendation} summary="Anchor collaboration around one current recommendation before reviewing contributor input.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
          <StatCard label="Contributors" value={String(state.contributors.length)} />
          <StatCard label="Alignment" value={pretty(state.alignment.alignment_level)} />
          <StatCard label="Next move" value={state.next_steps[0] ?? "Await input"} />
        </div>
      </Section>

      <Section label="Contributors" title="Who has shaped this decision" summary="Each card shows what a collaborator prioritizes, what concerns them, and what they want to do next.">
        {state.contributors.length ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
            {state.contributors.map((contributor) => (
              <div key={`${contributor.user_id}:${contributor.role}`} style={{ ...softCardStyle, padding: 12, gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <div>
                    <div style={{ color: "#f8fafc", fontSize: 13, fontWeight: 800 }}>{contributor.user_label}</div>
                    <div style={{ color: nx.lowMuted, fontSize: 11 }}>{pretty(contributor.role)}</div>
                  </div>
                </div>
                <MiniList label="Priority points" items={contributor.priority_points} empty="No structured priorities yet." />
                <MiniList label="Concerns" items={contributor.concerns} empty="No structured concerns yet." />
                <MiniList
                  label="Preferred next action"
                  items={contributor.preferred_next_action ? [contributor.preferred_next_action] : []}
                  empty="No preferred next action yet."
                />
              </div>
            ))}
          </div>
        ) : (
          <EmptyBlock text="Collaboration intelligence is not active yet. Add structured team input to see alignment, disagreement, and decision changes." />
        )}
      </Section>

      <Section label="Alignment" title={`Alignment is ${pretty(state.alignment.alignment_level)}`} summary="Use this to understand where contributors agree, where they diverge, and what still needs resolution.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 }}>
          <MiniList label="Agreement" items={state.alignment.agreement_points} empty="No strong agreement is visible yet." />
          <MiniList label="Disagreement" items={state.alignment.disagreement_points} empty="No material disagreement is visible yet." />
          <MiniList label="Unresolved" items={state.alignment.unresolved_questions} empty="No unresolved question is visible yet." />
        </div>
      </Section>

      <Section label="Decision Delta" title={state.decision_delta.changed ? "Collaboration changed the posture" : "Collaboration reinforced the current posture"} summary={state.decision_delta.summary}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <MiniList label="Before" items={state.decision_delta.before_summary ? [state.decision_delta.before_summary] : []} empty="No prior baseline is available." />
          <MiniList label="After" items={state.decision_delta.after_summary ? [state.decision_delta.after_summary] : []} empty="No updated collaboration posture is visible yet." />
        </div>
      </Section>

      <Section label="Recent Inputs" title="What contributors added most recently" summary="Keep collaboration structured and auditable instead of turning it into a freeform thread.">
        {state.inputs.length ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
            {state.inputs.slice(0, 6).map((input) => (
              <div key={input.id} style={{ ...softCardStyle, padding: 12, gap: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <div style={{ color: "#f8fafc", fontSize: 13, fontWeight: 800 }}>
                    {input.user_label} · {pretty(input.role)} · {pretty(input.kind)}
                  </div>
                  <div style={{ color: nx.lowMuted, fontSize: 11 }}>{relativeTime(input.timestamp)}</div>
                </div>
                <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>{input.summary}</div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyBlock text="No structured collaboration input has been added yet." />
        )}
      </Section>

      <Section label="Add Input" title="Capture one structured contribution" summary="Use lightweight structured input so collaboration remains auditable and decision-centered.">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          <InputField label="User label">
            <input value={userLabel} onChange={(event) => setUserLabel(event.target.value)} style={inputStyle} />
          </InputField>
          <InputField label="Role">
            <select value={role} onChange={(event) => setRole(event.target.value as CollaboratorRole)} style={inputStyle}>
              {["executive", "manager", "analyst", "operator", "investor", "observer"].map((value) => (
                <option key={value} value={value}>
                  {pretty(value)}
                </option>
              ))}
            </select>
          </InputField>
          <InputField label="Input type">
            <select value={kind} onChange={(event) => setKind(event.target.value as CollaborationInputKind)} style={inputStyle}>
              {["perspective", "concern", "support", "challenge", "approval_note", "escalation_note", "evidence_request"].map((value) => (
                <option key={value} value={value}>
                  {pretty(value)}
                </option>
              ))}
            </select>
          </InputField>
        </div>
        <InputField label="Summary">
          <textarea
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
            placeholder="Add a structured collaboration input"
            style={{ ...inputStyle, minHeight: 92, resize: "vertical" }}
          />
        </InputField>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button type="button" onClick={addInput} style={secondaryButtonStyle}>
            Add Input
          </button>
          {props.onOpenTeamDecision ? (
            <button type="button" onClick={props.onOpenTeamDecision} style={secondaryButtonStyle}>
              Open Team Decision
            </button>
          ) : null}
          {props.onOpenDecisionGovernance ? (
            <button type="button" onClick={props.onOpenDecisionGovernance} style={secondaryButtonStyle}>
              Open Governance
            </button>
          ) : null}
          {props.onOpenExecutiveApproval ? (
            <button type="button" onClick={props.onOpenExecutiveApproval} style={secondaryButtonStyle}>
              Open Approval
            </button>
          ) : null}
        </div>
      </Section>

      <Section label="Next Steps" title="What the team should do next" summary="Collaboration should improve the next move, not just accumulate comments.">
        <MiniList label={null} items={state.next_steps} empty="No collaboration next step is visible yet." />
      </Section>
    </div>
  );
}

function Section(props: { label: string; title: string; summary: string; children: React.ReactNode }) {
  return (
    <div style={{ ...panelSurfaceStyle, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ color: "#cbd5f5", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          {props.label}
        </div>
        <div style={{ color: "#f8fafc", fontSize: 15, fontWeight: 800 }}>{props.title}</div>
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>{props.summary}</div>
      </div>
      {props.children}
    </div>
  );
}

function StatCard(props: { label: string; value: string }) {
  return (
    <div style={{ ...softCardStyle, padding: 10, gap: 4 }}>
      <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {props.label}
      </div>
      <div style={{ color: "#f8fafc", fontSize: 12, fontWeight: 800 }}>{props.value}</div>
    </div>
  );
}

function MiniList(props: { label: string | null; items: string[]; empty: string }) {
  return (
    <div style={{ ...softCardStyle, padding: 12, gap: 6 }}>
      {props.label ? (
        <div style={{ color: "#cbd5f5", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>
          {props.label}
        </div>
      ) : null}
      {(props.items.length ? props.items : [props.empty]).map((item) => (
        <div key={item} style={{ color: nx.text, fontSize: 12, lineHeight: 1.45 }}>
          {item}
        </div>
      ))}
    </div>
  );
}

function InputField(props: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ color: "#cbd5f5", fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        {props.label}
      </div>
      {props.children}
    </div>
  );
}

function EmptyBlock(props: { text: string }) {
  return (
    <div style={{ ...softCardStyle, padding: 12 }}>
      <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>{props.text}</div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  borderRadius: 10,
  border: `1px solid ${nx.border}`,
  background: "rgba(15,23,42,0.72)",
  color: nx.text,
  padding: "10px 12px",
  fontSize: 12,
};
