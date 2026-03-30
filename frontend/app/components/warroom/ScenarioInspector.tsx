"use client";

import React from "react";

import { nx, sectionTitleStyle, softCardStyle } from "../ui/nexoraTheme";
import type { WarRoomController } from "../../lib/warroom/warRoomTypes";
import { MemoryTimeline } from "./MemoryTimeline";
import { WarRoomIntelligenceSummary } from "./WarRoomIntelligenceSummary";
import { ComparePanel } from "./ComparePanel";
import { StrategyPanel } from "./StrategyPanel";
import { StrategyHistoryList } from "./StrategyHistoryList";
import { WarRoomLearningSummary } from "./WarRoomLearningSummary";
import { WarRoomComposer } from "./WarRoomComposer";
import { WarRoomSummary } from "./WarRoomSummary";

type ScenarioInspectorProps = {
  controller: WarRoomController;
  selectedObjectLabel: string | null;
  resolveObjectLabel?: ((id: string | null | undefined) => string | null) | null;
};

export function ScenarioInspector({ controller, selectedObjectLabel, resolveObjectLabel }: ScenarioInspectorProps) {
  const activeScenario = controller.state.activeScenarioId
    ? controller.state.scenarios[controller.state.activeScenarioId] ?? null
    : null;
  const focusTargetId = controller.state.focusTargetId ?? controller.session.draft.selectedObjectId ?? null;
  const focusTargetLabel = focusTargetId ? resolveObjectLabel?.(focusTargetId) ?? null : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <WarRoomComposer
        draft={controller.session.draft}
        selectedObjectLabel={selectedObjectLabel}
        onSelectedObjectChange={controller.setSelectedObject}
        onActionKindChange={controller.setActionKind}
        onOutputModeChange={controller.setOutputMode}
        onTargetsChange={controller.setTargets}
        onLabelChange={(label) => controller.updateDraft({ label })}
        onDescriptionChange={(description) => controller.updateDraft({ description })}
        onParameterChange={(key, value) =>
          controller.updateDraft({
            parameters: {
              ...(controller.session.draft.parameters ?? {}),
              [key]: value,
            },
          })
        }
      />

      <div style={sectionTitleStyle}>Decision Inspector</div>
      <div style={{ ...softCardStyle, padding: 10, gap: 8 }}>
        <div style={{ color: nx.text, fontSize: 13, fontWeight: 700 }}>
          {activeScenario?.title ?? "No active scenario"}
        </div>
        <div style={{ color: nx.muted, fontSize: 12 }}>
          Focus target {focusTargetId ? focusTargetLabel ?? "This target is outside the current scene context." : "none"}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
          <div style={{ padding: 8, borderRadius: 10, background: "rgba(2,6,23,0.35)" }}>
            <div style={{ color: nx.lowMuted, fontSize: 11 }}>Mode</div>
            <div style={{ color: nx.text, fontSize: 12, fontWeight: 700 }}>{controller.state.mode.toUpperCase()}</div>
          </div>
          <div style={{ padding: 8, borderRadius: 10, background: "rgba(2,6,23,0.35)" }}>
            <div style={{ color: nx.lowMuted, fontSize: 11 }}>Output</div>
            <div style={{ color: nx.text, fontSize: 12, fontWeight: 700 }}>
              {activeScenario?.outputMode?.toUpperCase() ?? "NONE"}
            </div>
          </div>
        </div>
      </div>

      <WarRoomSummary session={controller.session} summary={controller.overlaySummary} resolveObjectLabel={resolveObjectLabel} />
      <WarRoomIntelligenceSummary
        result={controller.intelligence}
        loading={controller.intelligenceLoading}
        error={controller.intelligenceError}
        resolveObjectLabel={resolveObjectLabel}
      />
      <StrategyPanel controller={controller} />
      <ComparePanel controller={controller} />
      <WarRoomLearningSummary
        evolutionState={controller.evolutionState}
        loading={controller.evolutionLoading}
        onRefresh={() => void controller.refreshEvolution()}
        onRunLearning={() => void controller.runEvolutionLearningPass()}
      />
      <MemoryTimeline
        items={controller.recentMemory.scenario_records}
        onOutcomeUpdate={(recordId, status) => {
          void controller.updateScenarioOutcome(recordId, status);
        }}
      />
      <StrategyHistoryList items={controller.recentMemory.strategy_records} />
    </div>
  );
}
