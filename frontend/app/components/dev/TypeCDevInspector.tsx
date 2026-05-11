"use client";

import type React from "react";

import type { TypeCAIExecutiveInsight } from "../../lib/typec/aiTypeCExecutiveInsight.ts";
import type { TypeCDecisionDraft } from "../../lib/typec/typeCDecisionDraft.ts";
import type { TypeCDecisionReadinessSnapshot } from "../../lib/typec/typeCDecisionReadiness.ts";
import type { TypeCExecutiveSummary } from "../../lib/typec/typeCExecutiveSummary.ts";
import type { TypeCMultiAgentInsight } from "../../lib/typec/typeCMultiAgentContracts.ts";
import type { TypeCPipelineEvent } from "../../lib/typec/typeCPipelineTracker.ts";
import type { TypeCScenarioState } from "../../lib/typec/typeCScenarioTypes.ts";

export type TypeCDevInspectorProps = {
  scenarioState: TypeCScenarioState;
  readiness: TypeCDecisionReadinessSnapshot | null;
  decisionDraft: TypeCDecisionDraft | null;
  executiveSummary: TypeCExecutiveSummary | null;
  aiExecutiveInsight?: TypeCAIExecutiveInsight | null;
  multiAgentInsight?: TypeCMultiAgentInsight | null;
  pipelineEvents: TypeCPipelineEvent[];
};

const panelStyle = {
  position: "fixed",
  right: 12,
  bottom: 12,
  zIndex: 9999,
  width: 320,
  maxHeight: 360,
  overflowY: "auto",
  padding: 12,
  border: "1px solid rgba(125, 211, 252, 0.22)",
  borderRadius: 10,
  background: "rgba(2, 6, 23, 0.84)",
  boxShadow: "0 18px 50px rgba(0, 0, 0, 0.35)",
  color: "rgba(226, 232, 240, 0.92)",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  fontSize: 11,
  lineHeight: 1.45,
  pointerEvents: "none",
} as const;

const sectionStyle = {
  marginTop: 10,
  paddingTop: 8,
  borderTop: "1px solid rgba(148, 163, 184, 0.16)",
} as const;

const labelStyle = {
  color: "rgba(125, 211, 252, 0.9)",
  fontWeight: 700,
  letterSpacing: 0,
} as const;

function short(value: string | null | undefined): string {
  if (!value) return "none";
  return value.length > 42 ? `${value.slice(0, 39)}...` : value;
}

function list(values: string[] | undefined): string {
  return values?.length ? values.join(", ") : "none";
}

export function TypeCDevInspector({
  scenarioState,
  readiness,
  decisionDraft,
  executiveSummary,
  aiExecutiveInsight = null,
  multiAgentInsight = null,
  pipelineEvents,
}: TypeCDevInspectorProps): React.ReactElement | null {
  if (process.env.NODE_ENV === "production") return null;

  const lastEvents = pipelineEvents.slice(-5).reverse();

  return (
    <aside data-nx="typec-dev-inspector" style={panelStyle} aria-label="Type-C dev inspector">
      <div style={{ ...labelStyle, fontSize: 12 }}>Type-C Inspector</div>

      <div style={sectionStyle}>
        <div style={labelStyle}>Scenario</div>
        <div>count: {scenarioState.scenarios.length}</div>
        <div>selected: {short(scenarioState.selectedScenarioId)}</div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle}>Readiness</div>
        <div>level: {readiness?.level ?? "none"}</div>
        <div>missing: {list(readiness?.missing)}</div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle}>Decision Draft</div>
        <div>posture: {decisionDraft?.posture ?? "none"}</div>
        <div>confidence: {decisionDraft ? decisionDraft.confidence.toFixed(2) : "none"}</div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle}>Executive Summary</div>
        <div>headline: {short(executiveSummary?.headline)}</div>
        <div>confidence: {executiveSummary?.confidence.label ?? "none"}</div>
        <div>ai: {short(aiExecutiveInsight?.headline)}</div>
        <div>multi-agent: {short(multiAgentInsight?.synthesis.executiveSummary)}</div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle}>Pipeline Events</div>
        {lastEvents.length ? (
          lastEvents.map((event) => (
            <div key={event.id} style={{ marginTop: 6 }}>
              <div>{event.step}</div>
              <div style={{ color: "rgba(148, 163, 184, 0.9)" }}>
                {short(event.intentType)} / {short(event.reason)}
              </div>
            </div>
          ))
        ) : (
          <div>none</div>
        )}
      </div>
    </aside>
  );
}

export default TypeCDevInspector;
