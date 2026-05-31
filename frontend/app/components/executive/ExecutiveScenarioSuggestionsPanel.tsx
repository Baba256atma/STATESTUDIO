"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  nexoraHudSectionLabelStyle,
  type NexoraHudThemeMode,
} from "../../lib/scene/nexoraHudTheme";
import { useSceneHudTheme } from "../../lib/theme/useSceneTheme";
import {
  logExecutiveScenarioCompareRequested,
  logExecutiveScenarioPanelMounted,
  logExecutiveScenarioRendered,
  logExecutiveScenarioSelected,
  logExecutiveScenarioThemeResolved,
} from "../../lib/ui/executiveScenarioSuggestionsInstrumentation";
import type {
  ExecutiveScenarioSuggestionsModel,
  ScenarioSuggestion,
  ScenarioSuggestionStatus,
} from "../../lib/ui/scenarioSuggestionTypes";
import type {
  ExecutiveScenario,
  ExecutiveScenarioRecord,
  ScenarioCreateRequest,
} from "../../lib/scenario/scenarioAuthoringRuntime";
import { nx } from "../ui/nexoraTheme";

export type ScenarioWorkspacePanelModel = {
  activeScenarioId: string;
  comparisonTargets: string[];
  scenarios: ExecutiveScenarioRecord[];
};

export type ExecutiveScenarioSuggestionsPanelProps = {
  open: boolean;
  model: ExecutiveScenarioSuggestionsModel;
  selectedScenarioId?: string | null;
  scenarioWorkspace?: ScenarioWorkspacePanelModel | null;
  themeMode?: NexoraHudThemeMode;
  onSelectScenario?: (scenario: ScenarioSuggestion) => void;
  onCompareRequest?: (selectedScenarioIds: string[]) => void;
  onCreateAuthoredScenario?: (request: ScenarioCreateRequest) => void;
  onActivateAuthoredScenario?: (scenarioId: string) => void;
  onDuplicateAuthoredScenario?: (scenarioId: string) => void;
  onArchiveAuthoredScenario?: (scenarioId: string) => void;
  onCompareAuthoredScenarios?: (scenarioIds: string[]) => void;
};

const CONTEXT_TABS = [
  { id: "alternatives", label: "Alternatives", active: true },
  { id: "impact", label: "Impact", active: false },
  { id: "risk", label: "Risk", active: false },
] as const;

function resolveStatusLabel(status: ScenarioSuggestionStatus | undefined, isSelected: boolean): string | null {
  if (isSelected) return "Selected";
  if (status === "recommended") return "Recommended";
  if (status === "active") return "Active";
  return null;
}

function resolveStatusColor(
  status: ScenarioSuggestionStatus | undefined,
  isSelected: boolean,
  theme: ReturnType<typeof useSceneHudTheme>
): string {
  if (isSelected) return theme.accent;
  if (status === "recommended") return theme.success;
  if (status === "active") return theme.accent;
  return theme.textSecondary;
}

function formatImpact(value: number | undefined): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  return value > 0 ? `+${value}` : `${value}`;
}

function formatShortDate(value: string | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function scenarioTypeLabel(type: ExecutiveScenario["scenarioType"]): string {
  return type.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function ScenarioSuggestionCard(props: {
  scenario: ScenarioSuggestion;
  selected: boolean;
  theme: ReturnType<typeof useSceneHudTheme>;
  onSelect: () => void;
}): React.ReactElement {
  const { scenario, selected, theme, onSelect } = props;
  const statusLabel = resolveStatusLabel(scenario.status, selected);
  const statusColor = resolveStatusColor(scenario.status, selected, theme);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      style={{
        width: "100%",
        textAlign: "left",
        padding: "10px 11px",
        borderRadius: 12,
        border: selected
          ? `1px solid color-mix(in srgb, ${statusColor} 55%, ${theme.controlBorder})`
          : `1px solid ${theme.controlBorder}`,
        background: selected
          ? `color-mix(in srgb, ${statusColor} 12%, ${theme.controlBackground})`
          : theme.controlBackground,
        color: theme.text,
        cursor: "pointer",
        boxShadow: selected && theme.mode === "night" ? `0 0 18px ${statusColor}22` : undefined,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 800, lineHeight: 1.3, color: theme.text }}>{scenario.title}</div>
          {statusLabel ? (
            <div
              style={{
                marginTop: 4,
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                fontSize: 9,
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: statusColor,
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: statusColor,
                }}
              />
              {statusLabel}
            </div>
          ) : null}
        </div>
        {typeof scenario.confidence === "number" ? (
          <span
            style={{
              flexShrink: 0,
              borderRadius: 999,
              border: `1px solid ${theme.controlBorder}`,
              padding: "2px 7px",
              fontSize: 10,
              fontWeight: 800,
              color: scenario.confidence >= 70 ? theme.success : theme.textMuted,
              background: theme.buttonBackground,
            }}
          >
            {scenario.confidence}%
          </span>
        ) : null}
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginTop: 8,
          fontSize: 10,
          fontWeight: 600,
          color: theme.textMuted,
        }}
      >
        {typeof scenario.impact === "number" ? (
          <span>
            Expected FRSI Impact:{" "}
            <strong style={{ color: scenario.impact <= 0 ? theme.success : theme.warning }}>
              {formatImpact(scenario.impact)}
            </strong>
          </span>
        ) : null}
        {typeof scenario.riskReduction === "number" ? (
          <span>Risk reduction ~{scenario.riskReduction}%</span>
        ) : null}
      </div>

      {scenario.description ? (
        <div style={{ marginTop: 6, fontSize: 10, lineHeight: 1.4, color: theme.textMuted }}>{scenario.description}</div>
      ) : null}
    </button>
  );
}

export function ExecutiveScenarioSuggestionsPanel(
  props: ExecutiveScenarioSuggestionsPanelProps
): React.ReactElement {
  const {
    open,
    model,
    selectedScenarioId = null,
    scenarioWorkspace = null,
    themeMode = "night",
    onSelectScenario,
    onCompareRequest,
    onCreateAuthoredScenario,
    onActivateAuthoredScenario,
    onDuplicateAuthoredScenario,
    onArchiveAuthoredScenario,
    onCompareAuthoredScenarios,
  } = props;

  const mountedRef = useRef(false);
  const theme = useSceneHudTheme(themeMode);
  const [createOpen, setCreateOpen] = useState(false);
  const [scenarioName, setScenarioName] = useState("");
  const [scenarioType, setScenarioType] = useState<ExecutiveScenario["scenarioType"]>("risk");
  const [scenarioDescription, setScenarioDescription] = useState("");
  const [compareDraftIds, setCompareDraftIds] = useState<string[]>([]);
  const selectedIds = useMemo(
    () => (selectedScenarioId ? [selectedScenarioId] : []),
    [selectedScenarioId]
  );
  const authoredScenarios = useMemo(
    () => scenarioWorkspace?.scenarios.filter((scenario) => scenario.status !== "archived") ?? [],
    [scenarioWorkspace?.scenarios]
  );
  const activeAuthoredScenario = useMemo(
    () =>
      authoredScenarios.find((scenario) => scenario.id === scenarioWorkspace?.activeScenarioId) ??
      authoredScenarios[0] ??
      null,
    [authoredScenarios, scenarioWorkspace?.activeScenarioId]
  );

  useEffect(() => {
    if (!scenarioWorkspace) return;
    const next = scenarioWorkspace.comparisonTargets.length
      ? scenarioWorkspace.comparisonTargets
      : authoredScenarios.slice(0, 2).map((scenario) => scenario.id);
    setCompareDraftIds(next.slice(0, 2));
  }, [authoredScenarios, scenarioWorkspace]);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    logExecutiveScenarioPanelMounted();
  }, []);

  useEffect(() => {
    logExecutiveScenarioThemeResolved(theme.mode);
  }, [theme.mode]);

  useEffect(() => {
    for (const scenario of model.scenarios) {
      logExecutiveScenarioRendered(scenario.id);
    }
  }, [model.scenarios]);

  const handleCompare = () => {
    const ids =
      selectedIds.length >= 2
        ? selectedIds
        : model.scenarios.slice(0, 2).map((scenario) => scenario.id);
    logExecutiveScenarioCompareRequested({ selectedScenarioIds: ids });
    onCompareRequest?.(ids);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("nexora:executive-scenario-compare-requested", {
          detail: { selectedScenarioIds: ids },
        })
      );
    }
  };

  const handleCreateAuthoredScenario = () => {
    const name = scenarioName.trim();
    if (!name) return;
    onCreateAuthoredScenario?.({
      name,
      scenarioType,
      description: scenarioDescription.trim() || undefined,
    });
    setScenarioName("");
    setScenarioDescription("");
    setScenarioType("risk");
    setCreateOpen(false);
  };

  const handleToggleCompareTarget = (scenarioId: string) => {
    setCompareDraftIds((current) => {
      if (current.includes(scenarioId)) return current.filter((id) => id !== scenarioId);
      return [...current, scenarioId].slice(-2);
    });
  };

  if (!open) {
    return <div aria-hidden style={{ display: "none" }} />;
  }

  return (
    <div
      data-hud="executive-scenario-suggestions-panel"
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        minWidth: 0,
        background: theme.shellBackground,
        backdropFilter: "blur(14px)",
        color: theme.text,
      }}
    >
      <header
        style={{
          flexShrink: 0,
          padding: "12px 14px 10px",
          borderBottom: `1px solid ${theme.shellBorder}`,
          background: theme.headerBackground,
        }}
      >
        <div style={{ ...nexoraHudSectionLabelStyle(theme), marginBottom: 4 }}>Scenario Suggestions</div>
        <div style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, lineHeight: 1.4 }}>
          Compare strategic alternatives before committing to a move.
        </div>
      </header>

      <div
        style={{
          flexShrink: 0,
          display: "flex",
          gap: 6,
          padding: "8px 12px 0",
          borderBottom: `1px solid ${theme.shellBorder}`,
        }}
      >
        {CONTEXT_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            disabled={!tab.active}
            title={tab.active ? tab.label : `${tab.label} (coming soon)`}
            style={{
              padding: "6px 10px",
              border: "none",
              borderBottom: tab.active ? `2px solid ${nx.accent}` : "2px solid transparent",
              background: "transparent",
              color: tab.active ? theme.text : theme.textMuted,
              fontSize: 10,
              fontWeight: tab.active ? 800 : 600,
              cursor: tab.active ? "default" : "not-allowed",
              opacity: tab.active ? 1 : 0.55,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {scenarioWorkspace && activeAuthoredScenario ? (
        <section
          aria-label="Scenario workspace"
          style={{
            flexShrink: 0,
            padding: "10px 12px",
            borderBottom: `1px solid ${theme.shellBorder}`,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            background: theme.shellBackground,
          }}
        >
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <select
              value={activeAuthoredScenario.id}
              onChange={(event) => onActivateAuthoredScenario?.(event.target.value)}
              aria-label="Active scenario"
              style={{
                flex: "1 1 auto",
                minWidth: 0,
                borderRadius: 10,
                border: `1px solid ${theme.controlBorder}`,
                background: theme.controlBackground,
                color: theme.text,
                padding: "8px 9px",
                fontSize: 11,
                fontWeight: 800,
              }}
            >
              {authoredScenarios.map((scenario) => (
                <option key={scenario.id} value={scenario.id}>
                  {scenario.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setCreateOpen((current) => !current)}
              style={{
                borderRadius: 10,
                border: `1px solid ${theme.controlBorder}`,
                background: nx.accentSoft,
                color: nx.accent,
                padding: "8px 10px",
                fontSize: 10,
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              Create
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 6,
              fontSize: 9,
              color: theme.textMuted,
            }}
          >
            <span>
              Type <strong style={{ color: theme.text }}>{scenarioTypeLabel(activeAuthoredScenario.scenarioType)}</strong>
            </span>
            <span>
              Objects <strong style={{ color: theme.text }}>{activeAuthoredScenario.snapshot.objects.length}</strong>
            </span>
            <span>
              Links <strong style={{ color: theme.text }}>{activeAuthoredScenario.snapshot.relationships.length}</strong>
            </span>
            <span>
              Impacts <strong style={{ color: theme.text }}>{activeAuthoredScenario.snapshot.propagationPaths.length}</strong>
            </span>
            <span>
              Created <strong style={{ color: theme.text }}>{formatShortDate(activeAuthoredScenario.createdAt)}</strong>
            </span>
            <span>
              Modified <strong style={{ color: theme.text }}>{formatShortDate(activeAuthoredScenario.updatedAt)}</strong>
            </span>
          </div>

          {createOpen ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              <input
                value={scenarioName}
                onChange={(event) => setScenarioName(event.target.value)}
                placeholder="Supplier Delay +20%"
                style={{
                  borderRadius: 10,
                  border: `1px solid ${theme.controlBorder}`,
                  background: theme.controlBackground,
                  color: theme.text,
                  padding: "8px 9px",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              />
              <select
                value={scenarioType}
                onChange={(event) => setScenarioType(event.target.value as ExecutiveScenario["scenarioType"])}
                style={{
                  borderRadius: 10,
                  border: `1px solid ${theme.controlBorder}`,
                  background: theme.controlBackground,
                  color: theme.text,
                  padding: "8px 9px",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {(["risk", "growth", "financial", "operational", "project", "custom"] as const).map((type) => (
                  <option key={type} value={type}>
                    {scenarioTypeLabel(type)}
                  </option>
                ))}
              </select>
              <textarea
                value={scenarioDescription}
                onChange={(event) => setScenarioDescription(event.target.value)}
                placeholder="Assumptions, risk, observation, or decision rationale"
                rows={3}
                style={{
                  resize: "vertical",
                  borderRadius: 10,
                  border: `1px solid ${theme.controlBorder}`,
                  background: theme.controlBackground,
                  color: theme.text,
                  padding: "8px 9px",
                  fontSize: 11,
                  lineHeight: 1.45,
                }}
              />
              <button
                type="button"
                disabled={!scenarioName.trim()}
                onClick={handleCreateAuthoredScenario}
                style={{
                  borderRadius: 10,
                  border: `1px solid ${theme.controlBorder}`,
                  background: scenarioName.trim() ? nx.accentSoft : theme.controlBackground,
                  color: scenarioName.trim() ? nx.accent : theme.textMuted,
                  padding: "8px 10px",
                  fontSize: 10,
                  fontWeight: 900,
                  cursor: scenarioName.trim() ? "pointer" : "not-allowed",
                }}
              >
                Create Scenario
              </button>
            </div>
          ) : null}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
            <button
              type="button"
              onClick={() => onDuplicateAuthoredScenario?.(activeAuthoredScenario.id)}
              style={{
                borderRadius: 10,
                border: `1px solid ${theme.controlBorder}`,
                background: theme.controlBackground,
                color: theme.text,
                padding: "8px 10px",
                fontSize: 10,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Duplicate Scenario
            </button>
            <button
              type="button"
              onClick={() => onArchiveAuthoredScenario?.(activeAuthoredScenario.id)}
              disabled={authoredScenarios.length <= 1}
              style={{
                borderRadius: 10,
                border: `1px solid ${theme.controlBorder}`,
                background: theme.controlBackground,
                color: authoredScenarios.length > 1 ? theme.warning : theme.textMuted,
                padding: "8px 10px",
                fontSize: 10,
                fontWeight: 800,
                cursor: authoredScenarios.length > 1 ? "pointer" : "not-allowed",
                opacity: authoredScenarios.length > 1 ? 1 : 0.6,
              }}
            >
              Archive Scenario
            </button>
          </div>

          {authoredScenarios.length >= 2 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ ...nexoraHudSectionLabelStyle(theme), fontSize: 9 }}>Compare Futures</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {authoredScenarios.map((scenario) => {
                  const selected = compareDraftIds.includes(scenario.id);
                  return (
                    <button
                      key={scenario.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => handleToggleCompareTarget(scenario.id)}
                      style={{
                        borderRadius: 999,
                        border: `1px solid ${selected ? nx.accent : theme.controlBorder}`,
                        background: selected ? nx.accentSoft : theme.controlBackground,
                        color: selected ? nx.accent : theme.textMuted,
                        padding: "5px 8px",
                        fontSize: 9,
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                    >
                      {scenario.name}
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                disabled={compareDraftIds.length < 2}
                onClick={() => onCompareAuthoredScenarios?.(compareDraftIds)}
                style={{
                  borderRadius: 10,
                  border: `1px solid ${theme.controlBorder}`,
                  background: compareDraftIds.length >= 2 ? nx.accentSoft : theme.controlBackground,
                  color: compareDraftIds.length >= 2 ? nx.accent : theme.textMuted,
                  padding: "8px 10px",
                  fontSize: 10,
                  fontWeight: 900,
                  cursor: compareDraftIds.length >= 2 ? "pointer" : "not-allowed",
                }}
              >
                Compare Selected Futures
              </button>
            </div>
          ) : null}
        </section>
      ) : null}

      <div
        style={{
          flex: "1 1 auto",
          minHeight: 0,
          overflowY: "auto",
          padding: "10px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {model.scenarios.map((scenario) => (
          <ScenarioSuggestionCard
            key={scenario.id}
            scenario={scenario}
            selected={selectedScenarioId === scenario.id}
            theme={theme}
            onSelect={() => {
              logExecutiveScenarioSelected({
                scenarioId: scenario.id,
                title: scenario.title,
                status: scenario.status,
              });
              onSelectScenario?.(scenario);
            }}
          />
        ))}
      </div>

      <div
        style={{
          flexShrink: 0,
          padding: "10px 12px 12px",
          borderTop: `1px solid ${theme.shellBorder}`,
          background: theme.headerBackground,
        }}
      >
        <button
          type="button"
          disabled={!model.compareReady}
          onClick={handleCompare}
          title="Compare selected or top scenarios"
          style={{
            width: "100%",
            padding: "9px 12px",
            borderRadius: 10,
            border: `1px solid ${theme.controlBorder}`,
            background: model.compareReady ? nx.accentSoft : theme.controlBackground,
            color: model.compareReady ? nx.accent : theme.textMuted,
            fontSize: 11,
            fontWeight: 800,
            cursor: model.compareReady ? "pointer" : "not-allowed",
            opacity: model.compareReady ? 1 : 0.6,
          }}
        >
          Compare Scenarios
        </button>
        <div style={{ marginTop: 6, fontSize: 9, color: theme.textMuted, lineHeight: 1.4 }}>
          Select scenarios to compare alternatives. No simulation or system changes are applied.
        </div>
      </div>
    </div>
  );
}
