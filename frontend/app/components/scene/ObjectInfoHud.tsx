"use client";

import React from "react";

import {
  OBJECT_INFO_QUICK_ACTIONS,
  type ObjectInfoHudModel,
} from "../../lib/scene/objectInfoHudTypes";
import {
  getExecutiveObjectCategories,
  type EditableObjectPatch,
} from "../../lib/modeling/objectEditingRuntime";
import type { PropagationPathPatch } from "../../lib/propagation/propagationAuthoringRuntime";
import {
  nexoraHudSectionLabelStyle,
  nexoraHudShellStyle,
  type NexoraHudThemeMode,
  type NexoraHudThemeTokens,
} from "../../lib/scene/nexoraHudTheme";
import { useSceneHudTheme } from "../../lib/theme/useSceneTheme";
import { useViewportWidthListener } from "../../lib/dom/useDomListener";
import { resolveExecutiveWorkspaceBreakpoint } from "../../lib/ui/executiveWorkspaceLayout";
import type { PanelSizeMode } from "../../lib/ui/workspaceLayoutTypes";
import { nx } from "../ui/nexoraTheme";

export type ObjectInfoHudProps = ObjectInfoHudModel & {
  themeMode?: NexoraHudThemeMode;
  panelSizeMode?: PanelSizeMode;
  onCreateRelationship?: () => void;
  onDeleteRelationship?: (relationshipId: string) => void;
  onCreateImpactPath?: (sourceObjectId?: string | null) => void;
  onEditPropagationPath?: (pathId: string, patch: PropagationPathPatch) => void;
  onDeletePropagationPath?: (pathId: string) => void;
  onEditObject?: (objectId: string, patch: EditableObjectPatch) => void;
  onDuplicateObject?: (objectId: string) => void;
  onDeleteObject?: (objectId: string) => void;
};

const sectionLabelStyle = (theme: NexoraHudThemeTokens): React.CSSProperties => ({
  ...nexoraHudSectionLabelStyle(theme),
  marginBottom: 6,
});

const statusToneColor = (tone: ObjectInfoHudModel["statusTone"]): string => {
  if (tone === "critical" || tone === "high") return nx.risk;
  if (tone === "elevated") return nx.warning;
  if (tone === "stable") return nx.accentInk;
  return nx.muted;
};

const actionButtonStyle: React.CSSProperties = {
  flex: "1 1 45%",
  minWidth: 0,
  padding: "5px 6px",
  borderRadius: 8,
  border: `1px solid ${nx.borderSoft}`,
  background: "color-mix(in srgb, var(--nx-bg-control) 70%, transparent)",
  color: nx.lowMuted,
  fontSize: 9,
  fontWeight: 700,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  cursor: "not-allowed",
  opacity: 0.72,
};

const cardStyle = (theme: NexoraHudThemeTokens): React.CSSProperties => ({
  borderRadius: 9,
  border: `1px solid ${theme.controlBorder}`,
  background: theme.controlBackground,
  padding: "7px 8px",
});

const fieldStyle = (theme: NexoraHudThemeTokens): React.CSSProperties => ({
  width: "100%",
  minWidth: 0,
  borderRadius: 7,
  border: `1px solid ${theme.controlBorder}`,
  background: theme.controlBackground,
  color: theme.textPrimary,
  fontSize: 11,
  fontWeight: 650,
  padding: "6px 7px",
  outline: "none",
});

const fieldLabelStyle = (theme: NexoraHudThemeTokens): React.CSSProperties => ({
  color: theme.label,
  fontSize: 9,
  fontWeight: 800,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  marginBottom: 4,
});

export function ObjectInfoHud(props: ObjectInfoHudProps): React.ReactElement {
  const hudTheme = useSceneHudTheme(props.themeMode ?? "night");
  const [viewportWidth, setViewportWidth] = React.useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1440
  );
  const breakpoint = resolveExecutiveWorkspaceBreakpoint(viewportWidth);
  const compact = breakpoint === "mobile" || breakpoint === "tablet";
  const panelSizeMode = props.panelSizeMode ?? "normal";
  const width =
    panelSizeMode === "expanded"
      ? compact
        ? 252
        : 280
      : panelSizeMode === "compact"
        ? compact
          ? 180
          : 200
        : compact
          ? 220
          : 248;

  useViewportWidthListener(setViewportWidth, "ObjectInfoHud");

  const shellStyle = nexoraHudShellStyle(hudTheme, {
    width,
    maxWidth: "min(92vw, 260px)",
    fontSize: 11,
    lineHeight: 1.45,
    overflow: "hidden",
  });

  if (!props.selectedObjectId && props.relationshipDetails) {
    return (
      <div
        data-nx="object-info-hud"
        data-hud="object-info"
        data-nx-state="relationship"
        data-nx-relationship-id={props.relationshipDetails.id}
        data-nx-theme={hudTheme.mode}
        style={shellStyle}
        onPointerDown={(event) => event.stopPropagation()}
        onWheel={(event) => event.stopPropagation()}
      >
        <header
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 8,
            padding: "10px 10px 8px",
            borderBottom: `1px solid ${nx.borderSoft}`,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ ...sectionLabelStyle(hudTheme), marginBottom: 4 }}>Relationship Detail</div>
            <div style={{ color: nx.text, fontSize: 13, fontWeight: 800, lineHeight: 1.2 }}>
              {props.relationshipDetails.relationshipType}
            </div>
            <div style={{ color: nx.muted, fontSize: 10, marginTop: 3 }}>
              {props.relationshipDetails.sourceObject} → {props.relationshipDetails.targetObject}
            </div>
          </div>
        </header>
        <div style={{ padding: "9px 10px 10px", display: "flex", flexDirection: "column", gap: 9 }}>
          <section>
            <div style={sectionLabelStyle(hudTheme)}>Connection</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {[
                ["Type", props.relationshipDetails.relationshipType],
                ["Strength", props.relationshipDetails.strength.toFixed(2)],
                ["Source", props.relationshipDetails.sourceObject],
                ["Target", props.relationshipDetails.targetObject],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    borderRadius: 8,
                    border: `1px solid ${nx.borderSoft}`,
                    background: "color-mix(in srgb, var(--nx-bg-control) 55%, transparent)",
                    padding: "5px 7px",
                    minWidth: 0,
                  }}
                >
                  <div style={{ color: nx.lowMuted, fontSize: 9, fontWeight: 700, letterSpacing: "0.06em" }}>{label}</div>
                  <div style={{ color: nx.text, fontSize: 11, fontWeight: 700, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</div>
                </div>
              ))}
            </div>
          </section>
          <section>
            <div style={sectionLabelStyle(hudTheme)}>Description</div>
            <div
              style={{
                borderRadius: 9,
                border: `1px solid ${nx.borderSoft}`,
                background: "color-mix(in srgb, var(--nx-bg-control) 50%, transparent)",
                padding: "7px 8px",
                color: nx.textSoft,
                fontSize: 11,
                lineHeight: 1.45,
              }}
            >
              {props.relationshipDetails.description}
            </div>
          </section>
          <button
            type="button"
            aria-label="Create Impact Path"
            title="Create impact path from this connection"
            onClick={() => props.onCreateImpactPath?.(props.relationshipDetails?.sourceObjectId ?? null)}
            style={{
              ...actionButtonStyle,
              width: "100%",
              opacity: props.onCreateImpactPath ? 1 : 0.5,
              cursor: props.onCreateImpactPath ? "pointer" : "not-allowed",
              color: nx.textSoft,
            }}
          >
            Create Impact Path
          </button>
          <button
            type="button"
            aria-label="Delete Relationship"
            title="Delete this relationship"
            onClick={() => props.onDeleteRelationship?.(props.relationshipDetails!.id)}
            style={{
              ...actionButtonStyle,
              width: "100%",
              opacity: props.onDeleteRelationship ? 1 : 0.5,
              cursor: props.onDeleteRelationship ? "pointer" : "not-allowed",
              color: nx.risk,
            }}
          >
            Delete Relationship
          </button>
        </div>
      </div>
    );
  }

  if (!props.selectedObjectId && props.propagationDetails) {
    const details = props.propagationDetails;
    const updatePath = (patch: PropagationPathPatch) => props.onEditPropagationPath?.(details.id, patch);
    return (
      <div
        data-nx="object-info-hud"
        data-hud="object-info"
        data-nx-state="propagation"
        data-nx-propagation-path-id={details.id}
        data-nx-theme={hudTheme.mode}
        style={shellStyle}
        onPointerDown={(event) => event.stopPropagation()}
        onWheel={(event) => event.stopPropagation()}
      >
        <header
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 8,
            padding: "10px 10px 8px",
            borderBottom: `1px solid ${nx.borderSoft}`,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ ...sectionLabelStyle(hudTheme), marginBottom: 4 }}>Propagation Details</div>
            <div style={{ color: nx.text, fontSize: 13, fontWeight: 800, lineHeight: 1.2 }}>
              {details.sourceObject} → {details.targetObject}
            </div>
            <div style={{ color: nx.muted, fontSize: 10, marginTop: 3, textTransform: "capitalize" }}>
              {details.propagationType} impact path
            </div>
          </div>
        </header>
        <div style={{ padding: "9px 10px 10px", display: "flex", flexDirection: "column", gap: 9 }}>
          <section>
            <div style={sectionLabelStyle(hudTheme)}>Impact Path</div>
            <div style={{ ...cardStyle(hudTheme), display: "grid", gap: 7 }}>
              <label>
                <div style={fieldLabelStyle(hudTheme)}>Type</div>
                <select
                  aria-label="Propagation type"
                  value={details.propagationType}
                  onChange={(event) => updatePath({ propagationType: event.target.value as any })}
                  style={fieldStyle(hudTheme)}
                >
                  {["risk", "operational", "resource", "financial", "dependency", "custom"].map((type) => (
                    <option key={type} value={type}>
                      {type[0].toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </label>
              <RangeField
                label="Strength"
                value={details.strength}
                theme={hudTheme}
                onChange={(value) => updatePath({ strength: value })}
              />
              <label>
                <div style={fieldLabelStyle(hudTheme)}>Delay Hours</div>
                <input
                  aria-label="Propagation delay hours"
                  type="number"
                  min={0}
                  value={details.delayHours ?? 0}
                  onChange={(event) => updatePath({ delayHours: Number(event.target.value) })}
                  style={fieldStyle(hudTheme)}
                />
              </label>
              <label>
                <div style={fieldLabelStyle(hudTheme)}>Notes</div>
                <textarea
                  aria-label="Propagation notes"
                  value={details.notes ?? ""}
                  rows={3}
                  onChange={(event) => updatePath({ notes: event.target.value })}
                  style={{ ...fieldStyle(hudTheme), resize: "vertical", lineHeight: 1.35 }}
                />
              </label>
            </div>
          </section>
          <button
            type="button"
            aria-label="Delete Impact Path"
            title="Delete this impact path"
            onClick={() => {
              if (!props.onDeletePropagationPath) return;
              if (window.confirm("Delete this impact path?")) props.onDeletePropagationPath(details.id);
            }}
            style={{
              ...actionButtonStyle,
              width: "100%",
              opacity: props.onDeletePropagationPath ? 1 : 0.5,
              cursor: props.onDeletePropagationPath ? "pointer" : "not-allowed",
              color: nx.risk,
            }}
          >
            Delete Impact Path
          </button>
        </div>
      </div>
    );
  }

  if (!props.selectedObjectId) {
    return (
      <div
        data-nx="object-info-hud"
        data-hud="object-info"
        data-nx-state="placeholder"
        data-nx-theme={hudTheme.mode}
        style={{
          ...shellStyle,
          width: panelSizeMode === "expanded" ? (compact ? 220 : 248) : panelSizeMode === "compact" ? (compact ? 168 : 184) : compact ? 196 : 220,
          padding: "10px 12px",
        }}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <div style={{ ...sectionLabelStyle(hudTheme), marginBottom: 4 }}>Object Info</div>
        <div style={{ color: nx.muted, fontSize: 11 }}>Select an object to inspect.</div>
      </div>
    );
  }

  const statusColor = statusToneColor(props.statusTone);
  const editable = props.editableObject;
  const categories = getExecutiveObjectCategories();
  const editSelectedObject = (patch: EditableObjectPatch) => {
    if (!props.selectedObjectId) return;
    props.onEditObject?.(props.selectedObjectId, patch);
  };
  const tagsText = editable?.tags?.join(", ") ?? "";
  const metadataEntries = Object.entries(editable?.metadata ?? {})
    .filter(([, value]) => value != null && typeof value !== "object")
    .slice(0, 5);

  return (
    <div
      data-nx="object-info-hud"
      data-hud="object-info"
      data-nx-state="active"
      data-nx-object-id={props.selectedObjectId}
      data-nx-theme={hudTheme.mode}
      style={shellStyle}
      onPointerDown={(event) => event.stopPropagation()}
      onWheel={(event) => event.stopPropagation()}
    >
      <header
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 8,
          padding: "10px 10px 8px",
          borderBottom: `1px solid ${nx.borderSoft}`,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ ...sectionLabelStyle(hudTheme), marginBottom: 4 }}>Object Info</div>
          <div style={{ color: nx.text, fontSize: 13, fontWeight: 800, lineHeight: 1.2 }}>
            {props.objectName ?? props.selectedObjectId}
          </div>
          <div style={{ color: nx.muted, fontSize: 10, marginTop: 3 }}>
            {props.objectType ?? "Object"}
          </div>
        </div>
        <span
          style={{
            flexShrink: 0,
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: statusColor,
            border: `1px solid color-mix(in srgb, ${statusColor} 35%, transparent)`,
            background: `color-mix(in srgb, ${statusColor} 12%, transparent)`,
            borderRadius: 999,
            padding: "3px 7px",
          }}
        >
          {editable?.status ?? props.statusLabel ?? "Monitoring"}
        </span>
      </header>

      <div style={{ padding: "9px 10px 10px", display: "flex", flexDirection: "column", gap: 9 }}>
        <section data-nx-section="overview">
          <div style={sectionLabelStyle(hudTheme)}>Overview</div>
          <div style={{ ...cardStyle(hudTheme), display: "grid", gap: 7 }}>
            <label>
              <div style={fieldLabelStyle(hudTheme)}>Name</div>
              <input
                aria-label="Object name"
                value={editable?.name ?? props.objectName ?? props.selectedObjectId}
                onChange={(event) => editSelectedObject({ name: event.target.value })}
                style={fieldStyle(hudTheme)}
              />
            </label>
            <label>
              <div style={fieldLabelStyle(hudTheme)}>Description</div>
              <textarea
                aria-label="Object description"
                value={editable?.description ?? props.executiveSummary ?? ""}
                onChange={(event) => editSelectedObject({ description: event.target.value })}
                rows={3}
                style={{
                  ...fieldStyle(hudTheme),
                  resize: "vertical",
                  lineHeight: 1.35,
                  fontWeight: 600,
                }}
              />
            </label>
          </div>
        </section>

        <section data-nx-section="properties">
          <div style={sectionLabelStyle(hudTheme)}>Properties</div>
          <div style={{ ...cardStyle(hudTheme), display: "grid", gap: 7 }}>
            <label>
              <div style={fieldLabelStyle(hudTheme)}>Category</div>
              <select
                aria-label="Object category"
                value={editable?.category ?? props.objectType ?? "Custom"}
                onChange={(event) => editSelectedObject({ category: event.target.value })}
                style={fieldStyle(hudTheme)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <div style={fieldLabelStyle(hudTheme)}>Status</div>
              <select
                aria-label="Object status"
                value={editable?.status ?? "Pending"}
                onChange={(event) => editSelectedObject({ status: event.target.value })}
                style={fieldStyle(hudTheme)}
              >
                {["Healthy", "Warning", "Critical", "Pending", "Offline"].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <div style={fieldLabelStyle(hudTheme)}>Tags</div>
              <input
                aria-label="Object tags"
                value={tagsText}
                onChange={(event) => editSelectedObject({ tags: event.target.value.split(",") })}
                placeholder="Critical, Finance, Supplier"
                style={fieldStyle(hudTheme)}
              />
            </label>
          </div>
        </section>

        <section data-nx-section="risk">
          <div style={sectionLabelStyle(hudTheme)}>Risk</div>
          <div style={{ ...cardStyle(hudTheme), display: "grid", gap: 8 }}>
            <RangeField
              label="Importance"
              value={editable?.importance ?? (props.frsiScore != null ? Math.round(props.frsiScore * 100) : 50)}
              theme={hudTheme}
              onChange={(value) => editSelectedObject({ importance: value })}
            />
            <RangeField
              label="Risk Level"
              value={editable?.riskLevel ?? 0}
              theme={hudTheme}
              onChange={(value) => editSelectedObject({ riskLevel: value })}
            />
          </div>
        </section>

        <section data-nx-section="intelligence">
          <div style={sectionLabelStyle(hudTheme)}>Telemetry</div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: compact ? "1fr 1fr" : "1fr 1fr",
              gap: 6,
            }}
          >
            {[
              ["FRSI Score", props.frsiScore != null ? props.frsiScore.toFixed(2) : "—"],
              ["Risk Level", editable?.riskLevel != null ? String(editable.riskLevel) : props.riskLevel ?? "unknown"],
              ["Health", props.healthLabel ?? "Unknown"],
              ["Reliability", props.reliabilityLabel ?? "Pending"],
              ["Confidence", props.confidence != null ? props.confidence.toFixed(2) : "—"],
              [
                "Position",
                props.position
                  ? `${props.position.x.toFixed(1)}, ${props.position.y.toFixed(1)}, ${props.position.z.toFixed(1)}`
                  : "—",
              ],
              ["Relationships", String(props.relationshipCount ?? 0)],
            ].map(([label, value]) => (
              <div
                key={label}
                style={cardStyle(hudTheme)}
              >
                <div style={{ color: nx.lowMuted, fontSize: 9, fontWeight: 700, letterSpacing: "0.06em" }}>
                  {label}
                </div>
                <div style={{ color: nx.text, fontSize: 11, fontWeight: 700, marginTop: 2, textTransform: "capitalize" }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </section>

        {props.executiveSummary ? (
          <section data-nx-section="summary">
            <div style={sectionLabelStyle(hudTheme)}>Executive Summary</div>
            <div
              style={{
                borderRadius: 9,
                border: `1px solid ${nx.borderSoft}`,
                background: "color-mix(in srgb, var(--nx-bg-control) 50%, transparent)",
                padding: "7px 8px",
                color: nx.textSoft,
                fontSize: 11,
                lineHeight: 1.45,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {props.executiveSummary}
            </div>
          </section>
        ) : null}

        <section data-nx-section="signals">
          <div style={sectionLabelStyle(hudTheme)}>Signals</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {(props.signals?.length ? props.signals : ["No active signals"]).slice(0, 4).map((signal) => (
              <span
                key={signal}
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: nx.textSoft,
                  borderRadius: 999,
                  border: `1px solid ${nx.borderSoft}`,
                  padding: "3px 8px",
                  background: "color-mix(in srgb, var(--nx-bg-control) 45%, transparent)",
                }}
              >
                {signal}
              </span>
            ))}
          </div>
        </section>

        {(props.relationshipCount ?? 0) > 0 || props.onCreateRelationship ? (
          <section data-nx-section="relationships">
            <div style={sectionLabelStyle(hudTheme)}>Relationships</div>
            <div
              style={{
                ...cardStyle(hudTheme),
                display: "grid",
                gap: 6,
              }}
            >
              <div style={{ fontSize: 10, color: nx.muted }}>
                Count: <span style={{ color: nx.text, fontWeight: 700 }}>{props.relationshipCount ?? 0}</span>
              </div>
              {(props.outgoingRelationships?.length ?? 0) > 0 ? (
                <RelationshipList label="Outgoing" items={props.outgoingRelationships ?? []} />
              ) : null}
              {(props.incomingRelationships?.length ?? 0) > 0 ? (
                <RelationshipList label="Incoming" items={props.incomingRelationships ?? []} />
              ) : null}
              {(props.relationshipCount ?? 0) === 0 ? (
                <div style={{ fontSize: 10, color: nx.muted }}>No relationships yet.</div>
              ) : null}
            </div>
          </section>
        ) : null}

        <section data-nx-section="metadata">
          <div style={sectionLabelStyle(hudTheme)}>Metadata</div>
          <div style={{ ...cardStyle(hudTheme), display: "grid", gap: 4 }}>
            <div style={{ color: nx.muted, fontSize: 10 }}>
              ID: <span style={{ color: nx.text, fontWeight: 700 }}>{props.selectedObjectId}</span>
            </div>
            {metadataEntries.length ? (
              metadataEntries.map(([key, value]) => (
                <div key={key} style={{ color: nx.muted, fontSize: 10 }}>
                  {key}: <span style={{ color: nx.textSoft }}>{String(value)}</span>
                </div>
              ))
            ) : (
              <div style={{ color: nx.muted, fontSize: 10 }}>No extended metadata.</div>
            )}
          </div>
        </section>

        <section data-nx-section="quick-actions">
          <div style={sectionLabelStyle(hudTheme)}>Quick Actions</div>
          {props.onCreateRelationship ? (
            <button
              type="button"
              aria-label="Create Relationship"
              title="Connect this object to another object"
              onClick={props.onCreateRelationship}
              style={{
                ...actionButtonStyle,
                width: "100%",
                marginBottom: 6,
                opacity: 1,
                cursor: "pointer",
                color: nx.textSoft,
              }}
            >
              Create Relationship
            </button>
          ) : null}
          {props.onCreateImpactPath ? (
            <button
              type="button"
              aria-label="Create Impact Path"
              title="Create impact path from this object"
              onClick={() => props.onCreateImpactPath?.(props.selectedObjectId)}
              style={{
                ...actionButtonStyle,
                width: "100%",
                marginBottom: 6,
                opacity: 1,
                cursor: "pointer",
                color: nx.textSoft,
              }}
            >
              Create Impact Path
            </button>
          ) : null}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, marginBottom: 6 }}>
            <button
              type="button"
              aria-label="Duplicate Object"
              title="Duplicate this object"
              onClick={() => props.selectedObjectId && props.onDuplicateObject?.(props.selectedObjectId)}
              style={{
                ...actionButtonStyle,
                opacity: props.onDuplicateObject ? 1 : 0.5,
                cursor: props.onDuplicateObject ? "pointer" : "not-allowed",
                color: nx.textSoft,
              }}
            >
              Duplicate
            </button>
            <button
              type="button"
              aria-label="Delete Object"
              title="Delete this object"
              onClick={() => {
                if (!props.selectedObjectId || !props.onDeleteObject) return;
                if (window.confirm("Delete this object and its relationships?")) {
                  props.onDeleteObject(props.selectedObjectId);
                }
              }}
              style={{
                ...actionButtonStyle,
                opacity: props.onDeleteObject ? 1 : 0.5,
                cursor: props.onDeleteObject ? "pointer" : "not-allowed",
                color: nx.risk,
              }}
            >
              Delete
            </button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {OBJECT_INFO_QUICK_ACTIONS.map((action) => (
              <button
                key={action.id}
                type="button"
                disabled
                title={`${action.label} — reserved for E2:10`}
                style={actionButtonStyle}
              >
                {action.label}
              </button>
            ))}
          </div>
          {/* E2:10 object actions wiring */}
          {/* D3 live object telemetry */}
          {/* D4 intelligence overlays */}
          {/* simulation object outcomes */}
          {/* scenario comparison overlays */}
        </section>
      </div>
    </div>
  );
}

export default ObjectInfoHud;

function RangeField(props: {
  label: string;
  value: number;
  theme: NexoraHudThemeTokens;
  onChange: (value: number) => void;
}): React.ReactElement {
  const value = Math.max(0, Math.min(100, Math.round(props.value)));
  return (
    <label>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
        <span style={fieldLabelStyle(props.theme)}>{props.label}</span>
        <span style={{ color: props.theme.textPrimary, fontSize: 10, fontWeight: 800 }}>{value}</span>
      </div>
      <input
        aria-label={props.label}
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(event) => props.onChange(Number(event.target.value))}
        style={{ width: "100%", accentColor: props.theme.accent }}
      />
    </label>
  );
}

function RelationshipList(props: { label: string; items: string[] }): React.ReactElement {
  return (
    <div>
      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", color: nx.lowMuted, marginBottom: 4 }}>
        {props.label}
      </div>
      <div style={{ display: "grid", gap: 4 }}>
        {props.items.map((item) => (
          <div key={item} style={{ fontSize: 10, color: nx.textSoft, lineHeight: 1.35 }}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
