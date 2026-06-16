"use client";

import React from "react";

import type { GeneratedScenarioId } from "../../../../lib/ui/mrpWorkspace/scenario/scenarioGenerationContract.ts";
import type { ScenarioHandoffSurface } from "../../../../lib/ui/mrpWorkspace/scenario/scenarioHandoffContract.ts";
import type { ScenarioGenerationSurface } from "../../../../lib/ui/mrpWorkspace/scenario/scenarioGenerationContract.ts";
import {
  commitScenarioToWarRoom,
  selectScenarioForHandoff,
} from "../../../../lib/ui/mrpWorkspace/scenario/scenarioHandoffRuntime.ts";
import {
  scenarioCardDetailStyle,
  scenarioGenerationGridStyle,
  scenarioHandoffCommitButtonStyle,
  scenarioHandoffPanelShellStyle,
  scenarioHandoffScenarioOptionStyle,
  scenarioSectionLabelStyle,
  scenarioVisualSpacing,
} from "../../../../lib/ui/mrpWorkspace/scenario/scenarioVisualContract.ts";

export type ScenarioHandoffPanelProps = Readonly<{
  handoff: ScenarioHandoffSurface;
  generation: ScenarioGenerationSurface;
  selectedObjectId?: string | null;
  phase: "loading" | "ready" | "empty";
}>;

function resolveSelectedScenarioId(
  handoff: ScenarioHandoffSurface,
  scenarios: ScenarioGenerationSurface["scenarios"]
): GeneratedScenarioId | null {
  if (handoff.selectedScenarioId) return handoff.selectedScenarioId;
  if (handoff.activeScenarioId) return handoff.activeScenarioId;
  return scenarios.find((row) => row.id === "expected_case")?.id ?? scenarios[0]?.id ?? null;
}

export function ScenarioHandoffPanel(props: ScenarioHandoffPanelProps): React.ReactElement {
  const loading = props.phase === "loading";
  const scenarios = props.generation.scenarios;
  const selectedScenarioId = resolveSelectedScenarioId(props.handoff, scenarios);
  const canCommit = !loading && scenarios.length > 0 && selectedScenarioId !== null;
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (selectedScenarioId) {
      selectScenarioForHandoff(selectedScenarioId);
    }
  }, [selectedScenarioId]);

  const handleCommit = React.useCallback(() => {
    if (!selectedScenarioId) return;
    const result = commitScenarioToWarRoom({
      scenarioId: selectedScenarioId,
      selectedObjectId: props.selectedObjectId ?? null,
    });
    setStatusMessage(
      result.ok
        ? `${result.commitPackage?.title ?? "Scenario"} prepared for War Room — no execution occurred.`
        : result.reason ?? "Handoff blocked by Rule #11 boundary."
    );
  }, [props.selectedObjectId, selectedScenarioId]);

  return (
    <section
      data-nx="scenario-handoff-panel"
      data-scenario-dashboard-context={props.handoff.dashboardContext}
      data-scenario-handoff="true"
      aria-label="Scenario to War Room handoff"
      style={scenarioHandoffPanelShellStyle()}
    >
      <div style={scenarioSectionLabelStyle()}>Scenario → War Room Handoff</div>
      <p style={scenarioCardDetailStyle()}>{props.handoff.question}</p>

      {loading || scenarios.length === 0 ? (
        <p style={scenarioCardDetailStyle()}>
          {loading
            ? "Loading scenarios for handoff…"
            : "Generate executive scenarios before preparing a War Room handoff."}
        </p>
      ) : (
        <>
          <div style={scenarioGenerationGridStyle()}>
            {scenarios.map((scenario) => {
              const selected = scenario.id === selectedScenarioId;
              return (
                <button
                  key={scenario.id}
                  type="button"
                  data-scenario-handoff-option={scenario.id}
                  aria-pressed={selected}
                  onClick={() => selectScenarioForHandoff(scenario.id)}
                  style={{
                    ...scenarioHandoffScenarioOptionStyle(selected),
                    textAlign: "left",
                  }}
                >
                  <div style={scenarioSectionLabelStyle()}>{scenario.title}</div>
                  <p style={scenarioCardDetailStyle()}>
                    {scenario.probability} · {scenario.impact} · {scenario.confidence}
                  </p>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            data-nx="scenario-commit-to-action"
            disabled={!canCommit}
            onClick={handleCommit}
            style={scenarioHandoffCommitButtonStyle(!canCommit)}
          >
            Commit To Action
          </button>

          {props.handoff.handoffReady && props.handoff.pendingCommitPackage ? (
            <p style={scenarioCardDetailStyle()}>
              Active scenario: {props.handoff.pendingCommitPackage.title} — transferred to War
              Room runtime for preparation only.
            </p>
          ) : null}

          {statusMessage ? <p style={scenarioCardDetailStyle()}>{statusMessage}</p> : null}
        </>
      )}

      <p style={{ ...scenarioCardDetailStyle(), marginTop: scenarioVisualSpacing.fieldGap }}>
        Controlled handoff only — Scenario generates futures; War Room executes decisions. No
        automatic execution or War Room auto-open.
      </p>
    </section>
  );
}

export default ScenarioHandoffPanel;
