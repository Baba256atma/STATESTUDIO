"use client";

import React from "react";

import type { NexoraHudThemeMode } from "../../lib/scene/nexoraHudTheme";
import {
  resolveSceneThemeTokens,
  sceneHudControlButtonStyle,
  sceneHudShellStyle,
} from "../../lib/theme/sceneThemeTokens";
import { useSceneHudTheme, useSceneThemeOptional } from "../../lib/theme/useSceneTheme";
import type { PropagationPath, PropagationPathCreateRequest } from "../../lib/propagation/propagationAuthoringRuntime";

export type PropagationPathBuilderCandidate = {
  id: string;
  label: string;
};

export type PropagationPathBuilderProps = {
  open: boolean;
  sourceId: string | null;
  sourceLabel?: string | null;
  candidates: PropagationPathBuilderCandidate[];
  themeMode?: NexoraHudThemeMode;
  errors?: string[];
  onCancel: () => void;
  onConfirm: (payload: PropagationPathCreateRequest) => void;
};

const PROPAGATION_TYPES: Array<{ id: PropagationPath["propagationType"]; label: string; icon: string }> = [
  { id: "risk", label: "Risk", icon: "!" },
  { id: "operational", label: "Operational", icon: ">" },
  { id: "resource", label: "Resource", icon: "+" },
  { id: "financial", label: "Financial", icon: "$" },
  { id: "dependency", label: "Dependency", icon: "->" },
  { id: "custom", label: "Custom", icon: "*" },
];

export function PropagationPathBuilder(props: PropagationPathBuilderProps): React.ReactElement | null {
  const sceneTheme = useSceneThemeOptional();
  const hudTheme = useSceneHudTheme(props.themeMode ?? "night");
  const tokens = sceneTheme?.tokens ?? resolveSceneThemeTokens(props.themeMode ?? "night");

  const [targetId, setTargetId] = React.useState("");
  const [propagationType, setPropagationType] = React.useState<PropagationPath["propagationType"]>("risk");
  const [strength, setStrength] = React.useState(50);
  const [delayHours, setDelayHours] = React.useState(0);
  const [notes, setNotes] = React.useState("");

  React.useEffect(() => {
    if (!props.open) {
      setTargetId("");
      setPropagationType("risk");
      setStrength(50);
      setDelayHours(0);
      setNotes("");
    }
  }, [props.open]);

  if (!props.open) return null;

  const sourceId = props.sourceId?.trim() || "";
  const sourceLabel =
    props.sourceLabel?.trim() ||
    props.candidates.find((candidate) => candidate.id === sourceId)?.label ||
    sourceId;
  const targets = props.candidates.filter((candidate) => candidate.id !== sourceId);
  const canCreate = Boolean(sourceId && targetId);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Propagation Path Builder"
      data-nx="propagation-path-builder"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 435,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "color-mix(in srgb, var(--nx-bg-app) 35%, rgba(0,0,0,0.45))",
        backdropFilter: "blur(8px)",
      }}
      onPointerDown={props.onCancel}
    >
      <div
        style={{
          ...sceneHudShellStyle(tokens),
          width: "min(660px, 96vw)",
          maxHeight: "min(82vh, 660px)",
          display: "grid",
          gridTemplateRows: "auto 1fr auto",
          gap: 12,
          padding: 14,
          overflow: "hidden",
        }}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: hudTheme.label }}>
              Propagation Authoring
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: hudTheme.textPrimary, marginTop: 2 }}>
              Create Impact Path
            </div>
            <div style={{ fontSize: 11, color: tokens.textSecondary, marginTop: 4 }}>
              Select source object → select target object → choose impact type.
            </div>
          </div>
          <button
            type="button"
            aria-label="Close impact path builder"
            onClick={props.onCancel}
            style={{ ...sceneHudControlButtonStyle(tokens), width: 30, height: 30, padding: 0 }}
          >
            ×
          </button>
        </header>

        <div style={{ display: "grid", gap: 12, overflow: "auto", minHeight: 0 }}>
          {!sourceId ? (
            <div style={{ fontSize: 12, color: tokens.textSecondary }}>
              Select an object before creating an impact path.
            </div>
          ) : (
            <>
              <section>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: tokens.label, marginBottom: 6 }}>
                  Source
                </div>
                <div style={{ borderRadius: 10, border: `1px solid ${tokens.controlBorder}`, background: tokens.panelBackground, padding: "8px 10px", color: tokens.textPrimary, fontSize: 12, fontWeight: 700 }}>
                  {sourceLabel}
                </div>
              </section>
              <section>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: tokens.label, marginBottom: 6 }}>
                  Target
                </div>
                <select
                  aria-label="Impact path target object"
                  value={targetId}
                  onChange={(event) => setTargetId(event.target.value)}
                  style={{ width: "100%", borderRadius: 10, border: `1px solid ${tokens.controlBorder}`, background: tokens.inputSurface, color: tokens.textPrimary, fontSize: 12, fontWeight: 600, padding: "8px 10px" }}
                >
                  <option value="">Choose target object…</option>
                  {targets.map((candidate) => (
                    <option key={candidate.id} value={candidate.id}>
                      {candidate.label}
                    </option>
                  ))}
                </select>
              </section>
              <section>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: tokens.label, marginBottom: 6 }}>
                  Type
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 7 }}>
                  {PROPAGATION_TYPES.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      aria-pressed={propagationType === type.id}
                      onClick={() => setPropagationType(type.id)}
                      style={{
                        ...sceneHudControlButtonStyle(tokens),
                        borderColor: propagationType === type.id ? tokens.accent : tokens.controlBorder,
                        color: propagationType === type.id ? tokens.textPrimary : tokens.textSecondary,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 5,
                      }}
                    >
                      <span aria-hidden>{type.icon}</span>
                      {type.label}
                    </button>
                  ))}
                </div>
              </section>
              <section>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: tokens.label }}>
                    Strength
                  </div>
                  <div style={{ color: tokens.textPrimary, fontSize: 11, fontWeight: 800 }}>{strength}</div>
                </div>
                <input
                  aria-label="Impact strength"
                  type="range"
                  min={0}
                  max={100}
                  value={strength}
                  onChange={(event) => setStrength(Number(event.target.value))}
                  style={{ width: "100%", accentColor: tokens.accent }}
                />
              </section>
              <section style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 8 }}>
                <label>
                  <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: tokens.label, marginBottom: 6 }}>
                    Delay Hours
                  </div>
                  <input
                    aria-label="Delay hours"
                    type="number"
                    min={0}
                    value={delayHours}
                    onChange={(event) => setDelayHours(Number(event.target.value))}
                    style={{ width: "100%", borderRadius: 10, border: `1px solid ${tokens.controlBorder}`, background: tokens.inputSurface, color: tokens.textPrimary, fontSize: 12, padding: "8px 10px" }}
                  />
                </label>
                <label>
                  <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: tokens.label, marginBottom: 6 }}>
                    Notes
                  </div>
                  <input
                    aria-label="Impact path notes"
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    style={{ width: "100%", borderRadius: 10, border: `1px solid ${tokens.controlBorder}`, background: tokens.inputSurface, color: tokens.textPrimary, fontSize: 12, padding: "8px 10px" }}
                  />
                </label>
              </section>
              {props.errors?.length ? (
                <div style={{ color: tokens.danger, fontSize: 11, fontWeight: 700 }}>
                  {props.errors.join(", ")}
                </div>
              ) : null}
            </>
          )}
        </div>

        <footer style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button type="button" onClick={props.onCancel} style={sceneHudControlButtonStyle(tokens)}>
            Cancel
          </button>
          <button
            type="button"
            disabled={!canCreate}
            onClick={() =>
              props.onConfirm({
                sourceObjectId: sourceId,
                targetObjectId: targetId,
                propagationType,
                strength,
                delayHours,
                notes,
              })
            }
            style={{
              ...sceneHudControlButtonStyle(tokens),
              opacity: canCreate ? 1 : 0.5,
              cursor: canCreate ? "pointer" : "not-allowed",
              borderColor: tokens.accent,
              background: tokens.chipBackground,
            }}
          >
            Save Impact Path
          </button>
        </footer>
      </div>
    </div>
  );
}

export default PropagationPathBuilder;
