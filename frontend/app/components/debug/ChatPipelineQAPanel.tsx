"use client";

import React from "react";
import {
  CHAT_QA_SCENARIOS,
  getChatPipelineDebugState,
  runChatQAScenario,
  type ChatQAFixtureControls,
  type ChatQARunResult,
} from "../../lib/debug/chatPipelineQAHarness";

type ChatPipelineQAPanelProps = {
  runChatInput: (input: string) => Promise<any>;
};

export function ChatPipelineQAPanel(props: ChatPipelineQAPanelProps) {
  const [runningId, setRunningId] = React.useState<string | null>(null);
  const [results, setResults] = React.useState<Record<string, ChatQARunResult>>({});

  const runScenario = React.useCallback(
    async (scenarioId: string) => {
      const scenario = CHAT_QA_SCENARIOS.find((s) => s.id === scenarioId);
      if (!scenario) return;
      setRunningId(scenarioId);
      try {
        const fixtures =
          typeof window !== "undefined"
            ? ((window as Window & { __NEXORA_QA_FIXTURES__?: ChatQAFixtureControls }).__NEXORA_QA_FIXTURES__ ?? {})
            : {};
        const result = await runChatQAScenario(
          scenario,
          props.runChatInput,
          () => getChatPipelineDebugState(),
          fixtures
        );
        setResults((prev) => ({ ...prev, [scenarioId]: result }));
      } finally {
        setRunningId(null);
      }
    },
    [props.runChatInput]
  );

  const runAll = React.useCallback(async () => {
    setRunningId("ALL");
    try {
      const fixtures =
        typeof window !== "undefined"
          ? ((window as Window & { __NEXORA_QA_FIXTURES__?: ChatQAFixtureControls }).__NEXORA_QA_FIXTURES__ ?? {})
          : {};
      for (const scenario of CHAT_QA_SCENARIOS) {
        const result = await runChatQAScenario(
          scenario,
          props.runChatInput,
          () => getChatPipelineDebugState(),
          fixtures
        );
        setResults((prev) => ({ ...prev, [scenario.id]: result }));
      }
    } finally {
      setRunningId(null);
    }
  }, [props.runChatInput]);

  return (
    <div
      style={{
        position: "absolute",
        top: 12,
        right: 12,
        zIndex: 30,
        width: 460,
        maxHeight: "70vh",
        overflow: "auto",
        borderRadius: 12,
        border: "1px solid rgba(148,163,184,0.35)",
        background: "rgba(2,6,23,0.94)",
        color: "#e2e8f0",
        padding: 12,
        fontSize: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <strong>Chat Pipeline QA</strong>
        <button onClick={runAll} disabled={runningId !== null}>
          Run All
        </button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", paddingBottom: 6 }}>Scenario</th>
            <th style={{ textAlign: "left", paddingBottom: 6 }}>Status</th>
            <th style={{ textAlign: "left", paddingBottom: 6 }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {CHAT_QA_SCENARIOS.map((scenario) => {
            const result = results[scenario.id];
            const status = result ? (result.pass ? "PASS" : "FAIL") : "—";
            const color = status === "PASS" ? "#22c55e" : status === "FAIL" ? "#ef4444" : "#94a3b8";
            return (
              <tr key={scenario.id}>
                <td style={{ verticalAlign: "top", padding: "6px 0" }}>
                  <div style={{ fontWeight: 600 }}>{scenario.id}</div>
                  <div style={{ color: "#94a3b8" }}>{scenario.description}</div>
                </td>
                <td style={{ color, verticalAlign: "top", padding: "6px 0", fontWeight: 700 }}>{status}</td>
                <td style={{ verticalAlign: "top", padding: "6px 0" }}>
                  <button onClick={() => runScenario(scenario.id)} disabled={runningId !== null}>
                    Run
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
        {CHAT_QA_SCENARIOS.map((scenario) => {
          const result = results[scenario.id];
          if (!result) return null;
          return (
            <div
              key={`${scenario.id}-details`}
              style={{
                border: "1px solid rgba(148,163,184,0.25)",
                borderRadius: 8,
                padding: 8,
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: 4 }}>
                {scenario.id}: {result.pass ? "PASS" : "FAIL"}
              </div>
              <div style={{ color: "#cbd5e1" }}>{result.details.join(" | ")}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

