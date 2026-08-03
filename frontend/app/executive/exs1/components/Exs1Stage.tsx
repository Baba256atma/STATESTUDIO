"use client";

import { useContext } from "react";
import type { Exs1Connection, Exs1Object, Exs1ObjectId } from "../exs1Types";
import { ExecutiveModeBadge } from "../mode/ExecutiveModeBadge";
import { ExecutiveModeTransition } from "../mode/ExecutiveModeTransition";
import { useExecutiveMode } from "../mode/hooks/useExecutiveMode";
import { useExecutiveDecision } from "../decision/hooks/useExecutiveDecision";
import { useExecutiveExecution } from "../execution/hooks/useExecutiveExecution";
import { HEALTH_COLOR } from "../monitoring/ExecutiveMonitoringConfig";
import { useExecutiveMonitoring } from "../monitoring/hooks/useExecutiveMonitoring";
import { useExecutiveMetadata } from "../metadata";
import { ExecutiveRuntimeIntelligenceContext } from "../intelligence";
import { ScenarioBadge } from "../scenario/ScenarioBadge";
import { useScenarioExperience } from "../scenario/hooks/useScenarioExperience";
import { exs1 } from "../exs1Theme";

type Props = {
  readonly objects: readonly Exs1Object[];
  readonly connections: readonly Exs1Connection[];
  readonly selectedObjectId: Exs1ObjectId | null;
  readonly onSelectObject: (id: Exs1ObjectId) => void;
};

function objectById(
  objects: readonly Exs1Object[],
  id: Exs1ObjectId,
): Exs1Object | undefined {
  return objects.find((o) => o.id === id);
}

/**
 * Director Stage — presentation reacts to Executive Mode + Scenario Engineering.
 * Does not own Timeline, Pack selection, or page navigation.
 */
export function Exs1Stage({
  objects,
  connections,
  selectedObjectId,
  onSelectObject,
}: Props) {
  const { activeMode, config } = useExecutiveMode();
  const {
    isActive: scenarioActive,
    activeObjectIds,
    currentScenario,
    compareIds,
    scenarios,
  } = useScenarioExperience();
  const { isActive: decisionActive, currentDecision } = useExecutiveDecision();
  const { isActive: executionActive, plan: executionPlan } =
    useExecutiveExecution();
  const {
    isActive: monitoringActive,
    executiveHealth,
    healthAccent,
    healthByObjectId,
    attentionObjects,
  } = useExecutiveMonitoring();
  const { resolveObjectName, resolveObjectBadge, resolveObjectTooltip } =
    useExecutiveMetadata();
  const intelligence = useContext(ExecutiveRuntimeIntelligenceContext);
  const signalAttentionIds = intelligence?.attentionObjectIds ?? [];
  const signalAttentionSet = new Set(signalAttentionIds);
  const selectedSignal = intelligence?.selectedSignal ?? null;

  const compareScenarios = scenarios.filter((s) => compareIds.includes(s.id));
  const multiCompare = scenarioActive && compareScenarios.length >= 2;
  const decisionApproved =
    decisionActive && currentDecision?.status === "Approved";
  const attentionSet = new Set(attentionObjects.map((o) => o.objectId));

  const focusSet = new Set(
    scenarioActive
      ? activeObjectIds
      : monitoringActive
        ? attentionObjects.map((o) => o.objectId)
        : config.focusObjectIds,
  );
  const warRoom = config.emphasis === "war-room";
  const accent = monitoringActive
    ? healthAccent
    : executionActive
      ? "#12B76A"
      : decisionActive
        ? currentDecision?.status === "Approved"
          ? "#12B76A"
          : "#1570EF"
        : scenarioActive
          ? (currentScenario?.color ?? config.accent)
          : config.accent;

  function colorForObject(objectId: Exs1ObjectId): string | null {
    if (!multiCompare) return null;
    for (const scenario of compareScenarios) {
      if (scenario.objectIds.includes(objectId)) return scenario.color;
    }
    return null;
  }

  return (
    <ExecutiveModeTransition>
      <section
        data-testid="exs1-stage"
        data-mode={activeMode}
        data-scenario={scenarioActive ? currentScenario?.id ?? "none" : "off"}
        data-decision={decisionActive ? currentDecision?.id ?? "none" : "off"}
        data-execution={executionActive ? executionPlan.id : "off"}
        data-monitoring={monitoringActive ? executiveHealth : "off"}
        aria-label="Executive Stage"
        style={{
          width: "100%",
          height: "100%",
          minWidth: 0,
          minHeight: 0,
          position: "relative",
          background: warRoom
            ? "radial-gradient(120% 100% at 50% 40%, #1a1012 0%, #0a0e14 60%, #050608 100%)"
            : "transparent",
          overflow: "hidden",
          transition: "background 250ms ease",
          filter:
            monitoringActive || executionActive || decisionApproved
              ? "saturate(0.92)"
              : "none",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `radial-gradient(${accent}14 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
            opacity: warRoom ? 0.35 : 0.55,
            pointerEvents: "none",
            transition: "opacity 250ms ease",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "1rem",
            left: "1.15rem",
            zIndex: 2,
            maxWidth: "16rem",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "0.62rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: exs1.lowMuted,
            }}
          >
            Director
          </p>
          <p
            data-testid="executive-director-caption"
            style={{
              margin: "0.3rem 0 0",
              fontSize: "0.84rem",
              fontWeight: 550,
              letterSpacing: "0.01em",
              color: accent,
              transition: "color 250ms ease",
              textShadow: `0 0 18px ${accent}33`,
            }}
          >
            {monitoringActive
              ? `Monitoring · Executive Health ${executiveHealth}`
              : executionActive
                ? `Execution · ${executionPlan.name} · ${executionPlan.status}`
                : decisionActive
                  ? currentDecision
                    ? `Decision · ${currentDecision.name} · ${currentDecision.status}`
                    : "Decision Workspace"
                  : scenarioActive
                    ? multiCompare
                      ? "Scenario comparison · dual visual language"
                      : `${currentScenario?.name ?? "Scenario"} · nodes, badges, links`
                    : selectedSignal
                      ? `Attention · ${selectedSignal.summary}`
                      : config.directorCaption}
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.3rem",
              marginTop: "0.45rem",
            }}
          >
            {scenarioActive && currentScenario ? (
              <ScenarioBadge
                label={currentScenario.name}
                color={currentScenario.color}
                selected
              />
            ) : (
              config.badgeLabels.map((label) => (
                <ExecutiveModeBadge
                  key={label}
                  label={label}
                  accent={config.accent}
                  compact
                />
              ))
            )}
            {multiCompare
              ? compareScenarios.map((s) => (
                  <ScenarioBadge key={s.id} label={s.name} color={s.color} />
                ))
              : null}
            {selectedSignal ? (
              <ExecutiveModeBadge
                label={`${selectedSignal.type} · ${selectedSignal.severity}`}
                accent={accent}
                compact
              />
            ) : null}
          </div>
        </div>

        <svg
          data-testid="exs1-stage-connections"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          {connections.map((c) => {
            const from = objectById(objects, c.from);
            const to = objectById(objects, c.to);
            if (!from || !to) return null;
            const active =
              focusSet.has(c.from) ||
              focusSet.has(c.to) ||
              selectedObjectId === c.from ||
              selectedObjectId === c.to;
            const muted = (warRoom || scenarioActive) && !active;
            const stroke =
              colorForObject(c.from) ??
              colorForObject(c.to) ??
              (active
                ? scenarioActive
                  ? accent
                  : config.connectionColor
                : muted
                  ? "rgba(148, 163, 184, 0.08)"
                  : "rgba(148, 163, 184, 0.22)");
            const mx = (from.x + to.x) / 2;
            const my = (from.y + to.y) / 2 - (active ? 2.2 : 1.2);
            return (
              <g key={`${c.from}-${c.to}`}>
                <path
                  d={`M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={active ? 0.55 : 0.3}
                  strokeLinecap="round"
                  style={{
                    transition:
                      "stroke 250ms ease, stroke-width 250ms ease, opacity 250ms ease",
                    opacity: muted ? 0.3 : active ? 0.95 : 0.72,
                    filter: active
                      ? `drop-shadow(0 0 1.2px ${stroke})`
                      : "none",
                  }}
                />
                {active ? (
                  <circle
                    cx={(from.x + to.x) / 2}
                    cy={(from.y + to.y) / 2 - 0.6}
                    r={0.55}
                    fill={stroke}
                    opacity={0.85}
                  />
                ) : null}
              </g>
            );
          })}
        </svg>

        {objects.map((obj) => {
          const selected = selectedObjectId === obj.id;
          const focused = focusSet.has(obj.id);
          const signalAttention = signalAttentionSet.has(obj.id);
          const emphasis = selected || focused || signalAttention;
          const dimmed =
            ((warRoom || scenarioActive) && !emphasis) ||
            (decisionApproved && !focused) ||
            (executionActive && !focused) ||
            (monitoringActive && !attentionSet.has(obj.id) && !selected);
          const objectHealth = healthByObjectId.get(obj.id);
          const monitoringColor = objectHealth
            ? HEALTH_COLOR[objectHealth.health]
            : null;
          const objectColor =
            colorForObject(obj.id) ?? monitoringColor ?? accent;
          const metaLabel = resolveObjectName(obj.id, obj.label);
          const metaBadge = resolveObjectBadge(obj.id);
          const metaTooltip = resolveObjectTooltip(obj.id, obj.summary);

          return (
            <button
              key={obj.id}
              type="button"
              data-testid={`exs1-object-${obj.id}`}
              data-highlighted={emphasis ? "true" : "false"}
              data-mode-focus={focused ? "true" : "false"}
              data-scenario-focus={
                scenarioActive && focused ? "true" : "false"
              }
              data-intelligence-attention={signalAttention ? "true" : "false"}
              data-monitoring-health={objectHealth?.health ?? ""}
              data-meta-label={metaLabel}
              aria-pressed={selected}
              aria-label={metaLabel}
              title={metaTooltip}
              onClick={() => onSelectObject(obj.id)}
              style={{
                position: "absolute",
                left: `${obj.x}%`,
                top: `${obj.y}%`,
                transform: `translate(-50%, -50%) scale(${selected ? 1.07 : focused ? 1.035 : 1})`,
                width: "6.75rem",
                padding: "0.78rem 0.6rem 0.7rem",
                borderRadius: exs1.radius.lg,
                border: emphasis || monitoringActive
                  ? `1.25px solid ${objectColor}`
                  : `1px solid ${exs1.border}`,
                background: emphasis || (monitoringActive && attentionSet.has(obj.id))
                  ? `linear-gradient(155deg, ${objectColor}36 0%, ${exs1.graphite} 55%, ${exs1.charcoal} 100%)`
                  : `linear-gradient(155deg, rgba(30,36,48,0.95) 0%, ${exs1.charcoal} 100%)`,
                boxShadow: monitoringActive && objectHealth
                  ? `0 0 0 1px ${objectColor}55, 0 0 24px ${objectColor}30, ${exs1.elevation.asset}`
                  : emphasis
                    ? `0 0 0 1px ${objectColor}55, 0 14px 32px rgba(0, 0, 0, 0.4), 0 0 28px ${objectColor}33`
                    : exs1.elevation.asset,
                color: exs1.text,
                cursor: "pointer",
                zIndex: selected ? 4 : focused ? 3 : 2,
                opacity: dimmed ? 0.26 : 1,
                filter: dimmed ? "grayscale(0.4) saturate(0.7)" : "none",
                transition: exs1.transition,
                fontFamily: "inherit",
                textAlign: "center",
                outline: selected
                  ? `2px solid ${objectColor}66`
                  : "2px solid transparent",
                outlineOffset: "3px",
              }}
            >
              <span
                aria-hidden
                style={{
                  display: "grid",
                  placeItems: "center",
                  width: "1.85rem",
                  height: "1.85rem",
                  margin: "0 auto 0.4rem",
                  borderRadius: "0.45rem",
                  border: `1px solid ${emphasis ? objectColor : exs1.border}`,
                  background: emphasis
                    ? `${objectColor}22`
                    : "rgba(255,255,255,0.03)",
                  fontSize: "1.05rem",
                  color: emphasis ? objectColor : exs1.muted,
                  lineHeight: 1,
                  boxShadow: emphasis
                    ? `0 0 12px ${objectColor}44`
                    : "inset 0 1px 0 rgba(255,255,255,0.04)",
                  transition: "color 250ms ease, border-color 250ms ease, box-shadow 250ms ease",
                }}
              >
                {obj.symbol}
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  letterSpacing: "0.03em",
                }}
              >
                {metaLabel}
              </span>
              <span
                style={{
                  display: "block",
                  marginTop: "0.2rem",
                  fontSize: "0.55rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: exs1.lowMuted,
                }}
              >
                {metaBadge ?? obj.kind}
              </span>
              {scenarioActive && focused && currentScenario ? (
                <span style={{ display: "block", marginTop: "0.35rem" }}>
                  <ScenarioBadge
                    label={
                      multiCompare
                        ? (colorForObject(obj.id) === compareScenarios[1]?.color
                            ? compareScenarios[1]?.name ?? "B"
                            : compareScenarios[0]?.name ?? "A")
                        : "Node"
                    }
                    color={objectColor}
                    compact
                  />
                </span>
              ) : null}
            </button>
          );
        })}
      </section>
    </ExecutiveModeTransition>
  );
}
