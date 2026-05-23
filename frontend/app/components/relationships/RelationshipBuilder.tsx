"use client";

import React from "react";

import { getRelationshipTypeDefinition } from "../../lib/relationships/relationshipRegistry";
import {
  buildRelationshipPreviewModel,
  buildSceneObjectLabelMap,
} from "../../lib/relationships/relationshipRuntime";
import type { NexoraRelationshipDirection, NexoraRelationshipType } from "../../lib/relationships/relationshipTypes";
import { logRelationshipSelected } from "../../lib/relationships/relationshipInstrumentation";
import type { NexoraHudThemeMode } from "../../lib/scene/nexoraHudTheme";
import {
  resolveSceneThemeTokens,
  sceneHudControlButtonStyle,
  sceneHudShellStyle,
} from "../../lib/theme/sceneThemeTokens";
import { useSceneHudTheme, useSceneThemeOptional } from "../../lib/theme/useSceneTheme";
import { RelationshipPreview } from "./RelationshipPreview";
import { RelationshipTypePicker } from "./RelationshipTypePicker";

export type RelationshipBuilderCandidate = {
  id: string;
  label: string;
};

export type RelationshipBuilderProps = {
  open: boolean;
  sourceId: string | null;
  sourceLabel?: string | null;
  sceneJson: unknown;
  candidates: RelationshipBuilderCandidate[];
  themeMode?: NexoraHudThemeMode;
  onCancel: () => void;
  onConfirm: (payload: {
    sourceId: string;
    targetId: string;
    type: NexoraRelationshipType;
    direction: NexoraRelationshipDirection;
  }) => void;
};

export function RelationshipBuilder(props: RelationshipBuilderProps): React.ReactElement | null {
  const sceneTheme = useSceneThemeOptional();
  const hudTheme = useSceneHudTheme(props.themeMode ?? "night");
  const tokens = sceneTheme?.tokens ?? resolveSceneThemeTokens(props.themeMode ?? "night");
  const labels = React.useMemo(() => buildSceneObjectLabelMap(props.sceneJson), [props.sceneJson]);

  const [targetId, setTargetId] = React.useState("");
  const [type, setType] = React.useState<NexoraRelationshipType>("dependency");
  const [direction, setDirection] = React.useState<NexoraRelationshipDirection>("uni");

  React.useEffect(() => {
    if (!props.open) {
      setTargetId("");
      setType("dependency");
      setDirection("uni");
    }
  }, [props.open]);

  React.useEffect(() => {
    const typeDef = getRelationshipTypeDefinition(type);
    if (typeDef) setDirection(typeDef.defaultDirection);
  }, [type]);

  const sourceId = props.sourceId?.trim() || "";
  const sourceLabel = props.sourceLabel?.trim() || labels.get(sourceId) || sourceId;
  const preview = React.useMemo(() => {
    if (!sourceId || !targetId) return null;
    return buildRelationshipPreviewModel({ sourceId, targetId, type, direction, labels });
  }, [direction, labels, sourceId, targetId, type]);

  const availableTargets = props.candidates.filter((candidate) => candidate.id !== sourceId);

  const handleConfirm = React.useCallback(() => {
    if (!sourceId || !targetId) return;
    props.onConfirm({ sourceId, targetId, type, direction });
  }, [direction, props, sourceId, targetId, type]);

  if (!props.open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Relationship Builder"
      data-nx="relationship-builder"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 430,
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
          width: "min(720px, 96vw)",
          maxHeight: "min(82vh, 680px)",
          display: "grid",
          gridTemplateRows: "auto auto 1fr auto",
          gap: 12,
          padding: 14,
          overflow: "hidden",
        }}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: hudTheme.label }}>
              Executive Connection
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: hudTheme.textPrimary, marginTop: 2 }}>
              Create Relationship
            </div>
            <div style={{ fontSize: 11, color: tokens.textSecondary, marginTop: 4 }}>
              Select source object → select target object → choose connection type.
            </div>
          </div>
          <button
            type="button"
            aria-label="Close relationship builder"
            onClick={props.onCancel}
            style={{ ...sceneHudControlButtonStyle(tokens), width: 30, height: 30, padding: 0 }}
          >
            ×
          </button>
        </header>

        {!sourceId ? (
          <div style={{ fontSize: 12, color: tokens.textSecondary }}>
            Select an object in the scene before creating a relationship.
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12, minHeight: 0, overflow: "auto" }}>
            <section>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: tokens.label, marginBottom: 6 }}>
                Source Object
              </div>
              <div
                style={{
                  borderRadius: 10,
                  border: `1px solid ${tokens.controlBorder}`,
                  background: tokens.panelBackground,
                  padding: "8px 10px",
                  color: tokens.textPrimary,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {sourceLabel}
              </div>
            </section>

            <section>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: tokens.label, marginBottom: 6 }}>
                Target Object
              </div>
              <select
                aria-label="Relationship target object"
                value={targetId}
                onChange={(event) => {
                  setTargetId(event.target.value);
                  logRelationshipSelected({
                    sourceId,
                    targetId: event.target.value,
                    source: "relationship_builder_target",
                  });
                }}
                style={{
                  width: "100%",
                  borderRadius: 10,
                  border: `1px solid ${tokens.controlBorder}`,
                  background: tokens.inputSurface,
                  color: tokens.textPrimary,
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "8px 10px",
                  outline: "none",
                }}
              >
                <option value="">Choose target object…</option>
                {availableTargets.map((candidate) => (
                  <option key={candidate.id} value={candidate.id}>
                    {candidate.label}
                  </option>
                ))}
              </select>
            </section>

            <section>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: tokens.label, marginBottom: 6 }}>
                Relationship Type
              </div>
              <RelationshipTypePicker
                value={type}
                tokens={tokens}
                onChange={(nextType) => {
                  setType(nextType);
                  logRelationshipSelected({
                    sourceId,
                    targetId: targetId || undefined,
                    type: nextType,
                    source: "relationship_builder_type",
                  });
                }}
              />
            </section>

            <section>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: tokens.label, marginBottom: 6 }}>
                Direction
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {(["uni", "bi"] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={direction === value}
                    onClick={() => setDirection(value)}
                    style={{
                      ...sceneHudControlButtonStyle(tokens),
                      opacity: direction === value ? 1 : 0.72,
                      fontWeight: 700,
                    }}
                  >
                    {value === "bi" ? "A ↔ B" : "A → B"}
                  </button>
                ))}
              </div>
            </section>

            <RelationshipPreview preview={preview} tokens={tokens} />
          </div>
        )}

        <footer style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button type="button" onClick={props.onCancel} style={sceneHudControlButtonStyle(tokens)}>
            Cancel
          </button>
          <button
            type="button"
            disabled={!sourceId || !targetId}
            onClick={handleConfirm}
            style={{
              ...sceneHudControlButtonStyle(tokens),
              opacity: sourceId && targetId ? 1 : 0.5,
              cursor: sourceId && targetId ? "pointer" : "not-allowed",
              borderColor: tokens.accent,
              background: tokens.chipBackground,
            }}
          >
            Create Connection
          </button>
        </footer>
      </div>
    </div>
  );
}

export default RelationshipBuilder;
