"use client";

import React from "react";

import type { ObjectInfoHudModel } from "../../lib/scene/objectInfoHudTypes";
import type { EditableObjectPatch } from "../../lib/modeling/objectEditingRuntime";
import type { PropagationPathPatch } from "../../lib/propagation/propagationAuthoringRuntime";
import {
  nexoraHudSectionLabelStyle,
  nexoraHudShellStyle,
  type NexoraHudThemeMode,
  type NexoraHudThemeTokens,
} from "../../lib/scene/nexoraHudTheme";
import { useSceneHudTheme } from "../../lib/theme/useSceneTheme";
import { DEFAULT_OBJECT_INFO_STATE } from "../../lib/scene/sceneInfoInitialState";
import {
  hydrateObjectInfoCollapseState,
  persistObjectInfoCollapsePreference,
} from "../../lib/scene/sceneInfoPreferenceRuntime";
import { useViewportWidthListener } from "../../lib/dom/useDomListener";
import { resolveExecutiveWorkspaceBreakpoint } from "../../lib/ui/executiveWorkspaceLayout";
import type { PanelSizeMode } from "../../lib/ui/workspaceLayoutTypes";
import {
  buildExecutiveObjectInfoLayout,
  logExecutiveObjectInfoReadability,
  type ExecutiveObjectInfoLayout,
} from "../../lib/objectInfo/executiveObjectInfoLayout";
import {
  DEFAULT_OBJECT_INFO_DISCLOSURE_VIEW,
  logProgressiveDisclosure,
  type ObjectInfoDisclosureView,
} from "../../lib/objectInfo/objectInfoProgressiveDisclosure";
import { nx } from "../ui/nexoraTheme";
import {
  registerGovernedPanel,
} from "../../lib/workspace/panelGovernanceRuntime";
import { resolveExecutiveEmptyState } from "../../lib/workspace/minimalism";
import { logObjectActionMoved } from "../../lib/scene/navigation/sceneToolbarActionRegistry";

/**
 * DEPRECATED ARCHITECTURE MIRROR:
 * ObjectInfoHud can display scene-native object/relationship details, but the
 * canonical MVP Object Panel contract lives in ObjectPanelShell and
 * docs/nexora-object-panel-architecture.md. This HUD must not become a second
 * selected-object authority or a Main Right Panel surface.
 */
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
  marginBottom: 4,
});

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
  const [viewportWidth, setViewportWidth] = React.useState(DEFAULT_OBJECT_INFO_STATE.viewportWidth);
  const breakpoint = resolveExecutiveWorkspaceBreakpoint(viewportWidth);
  const compact = breakpoint === "mobile" || breakpoint === "tablet";
  const panelSizeMode = props.panelSizeMode ?? "normal";
  const width =
    panelSizeMode === "expanded"
      ? compact
        ? 300
        : 340
      : panelSizeMode === "compact"
        ? compact
          ? 240
          : 280
        : compact
          ? 280
          : 320;

  useViewportWidthListener(setViewportWidth, "ObjectInfoHud");

  const shellStyle = nexoraHudShellStyle(
    hudTheme,
    {
      width,
      maxWidth: breakpoint === "mobile" ? "calc(100vw - 24px)" : "min(34vw, 340px)",
      fontSize: 11,
      lineHeight: 1.45,
      overflow: "hidden",
    },
    { surface: "objectInfoHud", edgeAnchor: "TOP_RIGHT" }
  );
  const [disclosureView, setDisclosureView] = React.useState<ObjectInfoDisclosureView>(
    DEFAULT_OBJECT_INFO_DISCLOSURE_VIEW
  );
  const layout = React.useMemo(
    () => buildExecutiveObjectInfoLayout(props, disclosureView),
    [props, disclosureView]
  );
  const [collapsed, setCollapsed] = React.useState(DEFAULT_OBJECT_INFO_STATE.collapsed);

  React.useEffect(() => {
    setCollapsed(hydrateObjectInfoCollapseState());
  }, []);

  React.useEffect(() => {
    if (!layout) return;
    logExecutiveObjectInfoReadability(layout);
    logProgressiveDisclosure({ objectId: layout.header.objectId, view: disclosureView });
  }, [disclosureView, layout]);

  React.useEffect(() => {
    registerGovernedPanel({
      panelId: "objectInfoHud",
      visible: Boolean(props.selectedObjectId || props.relationshipDetails || props.propagationDetails),
      collapsed,
      anchorZone: "top-right",
      priority: 20,
      title: "Object Info",
    });
  }, [collapsed, props.propagationDetails, props.relationshipDetails, props.selectedObjectId]);

  const toggleCollapsed = React.useCallback(() => {
    setCollapsed((value) => {
      const next = !value;
      persistObjectInfoCollapsePreference(next);
      return next;
    });
  }, []);

  React.useEffect(() => {
    if (!props.selectedObjectId || !props.onCreateImpactPath) return;
    logObjectActionMoved("create_impact", "objectInfoHud");
  }, [props.onCreateImpactPath, props.selectedObjectId]);

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
        style={nexoraHudShellStyle(
          hudTheme,
          {
            width: panelSizeMode === "expanded" ? (compact ? 220 : 248) : panelSizeMode === "compact" ? (compact ? 168 : 184) : compact ? 196 : 220,
            padding: "10px 12px",
          },
          { surface: "objectInfoHud" }
        )}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <div style={{ ...sectionLabelStyle(hudTheme), marginBottom: 4 }}>Object Info</div>
        <div style={{ color: nx.muted, fontSize: 11 }}>{resolveExecutiveEmptyState("no_selection")}</div>
      </div>
    );
  }

  if (!layout) {
    return <></>;
  }

  if (collapsed) {
    return (
      <div
        data-nx="object-info-hud"
        data-hud="object-info"
        data-nx-state="collapsed"
        data-nx-object-id={props.selectedObjectId}
        data-nx-theme={hudTheme.mode}
        style={nexoraHudShellStyle(
          hudTheme,
          {
            width: 44,
            maxWidth: 44,
            padding: "8px 6px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            fontSize: 11,
            lineHeight: 1.4,
            overflow: "hidden",
          },
          { surface: "objectInfoHud", collapsed: true }
        )}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Expand object info"
          title="Expand object info"
          onClick={toggleCollapsed}
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            border: `1px solid ${hudTheme.buttonBorder}`,
            background: hudTheme.buttonBackground,
            color: hudTheme.buttonText,
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 800,
          }}
        >
          ◀
        </button>
        <span
          aria-hidden
          style={{
            writingMode: "vertical-rl",
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: hudTheme.label,
          }}
        >
          Object
        </span>
      </div>
    );
  }

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
      <ExecutiveObjectInfoCard
        layout={layout}
        theme={hudTheme}
        disclosureView={disclosureView}
        selectedObjectId={props.selectedObjectId}
        onCreateImpactPath={props.onCreateImpactPath}
        onCollapse={toggleCollapsed}
        onDisclosureViewChange={setDisclosureView}
      />
    </div>
  );
}

export default ObjectInfoHud;

function ExecutiveObjectInfoCard(props: {
  layout: ExecutiveObjectInfoLayout;
  theme: NexoraHudThemeTokens;
  disclosureView: ObjectInfoDisclosureView;
  selectedObjectId: string;
  onCreateImpactPath?: (sourceObjectId?: string | null) => void;
  onCollapse: () => void;
  onDisclosureViewChange: (view: ObjectInfoDisclosureView) => void;
}): React.ReactElement {
  const { layout, theme, disclosureView } = props;
  const showSecondary = disclosureView !== "summary";
  const showContext = disclosureView === "detailed";
  const showAdvanced = disclosureView === "detailed";

  const cycleDisclosure = React.useCallback(() => {
    const next: ObjectInfoDisclosureView =
      disclosureView === "standard" ? "detailed" : disclosureView === "detailed" ? "summary" : "standard";
    props.onDisclosureViewChange(next);
  }, [disclosureView, props.onDisclosureViewChange]);

  return (
    <>
      <header
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 8,
          padding: "7px 8px",
          borderBottom: `1px solid color-mix(in srgb, ${theme.panelBorder} 55%, transparent)`,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ ...sectionLabelStyle(theme), marginBottom: 2 }}>Object Info</div>
          <div
            style={{
              color: theme.textPrimary,
              fontSize: 12,
              fontWeight: 800,
              lineHeight: 1.2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {layout.header.name}
          </div>
          <div style={{ color: theme.textSecondary, fontSize: 10, marginTop: 2 }}>{layout.header.type}</div>
        </div>
        <button
          type="button"
          aria-label="Collapse object info"
          title="Collapse object info"
          onClick={props.onCollapse}
          style={{
            width: 24,
            height: 24,
            borderRadius: 7,
            border: `1px solid ${theme.controlBorder}`,
            background: "transparent",
            color: theme.textSecondary,
            cursor: "pointer",
            fontSize: 11,
            fontWeight: 700,
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          ◀
        </button>
      </header>

      <div style={{ padding: "8px 8px 6px", display: "flex", flexDirection: "column", gap: 6 }}>
        <section data-nx-section="primary-metrics">
          <CompactMetricRow
            theme={theme}
            items={[
              { label: "Health", value: layout.primary.health },
              { label: "Risk", value: layout.primary.riskLevel },
              { label: "FRSI", value: layout.primary.frsi },
              { label: "Ready", value: layout.primary.readiness },
            ]}
          />
        </section>

        {showSecondary ? (
          <>
            <section data-nx-section="summary">
              <div style={sectionLabelStyle(theme)}>Summary</div>
              <div
                style={{
                  color: theme.textSecondary,
                  fontSize: 10,
                  lineHeight: 1.35,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {layout.secondary.summary}
              </div>
            </section>

            {layout.secondary.criticalLinks > 0 ? (
              <section data-nx-section="dependencies">
                <div style={sectionLabelStyle(theme)}>Dependencies</div>
                <div style={{ color: theme.textPrimary, fontSize: 10, fontWeight: 700 }}>
                  Critical Links: {layout.secondary.criticalLinks}
                </div>
              </section>
            ) : null}

            {layout.secondary.signals.length > 0 ? (
              <section data-nx-section="signals">
                <div style={sectionLabelStyle(theme)}>Signals</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {layout.secondary.signals.map((signal) => (
                    <span key={signal} style={compactTagStyle(theme)}>
                      {signal}
                    </span>
                  ))}
                  {layout.secondary.signalOverflow > 0 ? (
                    <span style={{ ...compactTagStyle(theme), color: theme.textSecondary }}>
                      +{layout.secondary.signalOverflow} more
                    </span>
                  ) : null}
                </div>
              </section>
            ) : null}
          </>
        ) : null}

        {showContext ? (
          <section data-nx-section="relationships">
            <div style={sectionLabelStyle(theme)}>Relationships</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
              <CompactStat label="Connected" value={String(layout.context.connected)} theme={theme} />
              <CompactStat label="Critical Links" value={String(layout.context.criticalLinks)} theme={theme} />
            </div>
          </section>
        ) : null}

        {showAdvanced ? (
          <section data-nx-section="advanced">
            <div style={sectionLabelStyle(theme)}>Extended Analysis</div>
            <div style={{ display: "grid", gap: 3 }}>
              {layout.advanced.mostCriticalDependency ? (
                <AdvancedLine label="Critical Dep." value={layout.advanced.mostCriticalDependency} theme={theme} />
              ) : null}
              {layout.advanced.mostInfluentialConnection ? (
                <AdvancedLine label="Influence" value={layout.advanced.mostInfluentialConnection} theme={theme} />
              ) : null}
              {layout.advanced.highestRiskRelationship ? (
                <AdvancedLine label="Risk Link" value={layout.advanced.highestRiskRelationship} theme={theme} />
              ) : null}
            </div>
          </section>
        ) : null}

        <section data-nx-section="actions">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
            <div style={sectionLabelStyle(theme)}>Controls</div>
            <button
              type="button"
              aria-label="Toggle detail level"
              title={`View: ${disclosureView}`}
              onClick={cycleDisclosure}
              style={{
                border: "none",
                background: "transparent",
                color: theme.textSecondary,
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                cursor: "pointer",
                padding: 0,
              }}
            >
              {disclosureView === "detailed" ? "Less" : "More"}
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 4 }}>
            {layout.actions.map((action) => {
              const isImpact = action.id === "create_impact";
              const enabled = isImpact ? Boolean(props.onCreateImpactPath) : action.enabled;
              return (
                <button
                  key={action.id}
                  type="button"
                  disabled={!enabled}
                  aria-label={isImpact ? "Create Impact Path" : action.label}
                  title={
                    isImpact
                      ? props.onCreateImpactPath
                        ? "Create impact path from selected object"
                        : "Select an object first"
                      : `${action.label} reserved for executive workflow`
                  }
                  onClick={
                    isImpact && enabled
                      ? () => props.onCreateImpactPath?.(props.selectedObjectId ?? null)
                      : undefined
                  }
                  style={compactControlButtonStyle(theme, enabled, isImpact)}
                >
                  {isImpact ? "Impact" : action.label}
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}

function compactTagStyle(theme: NexoraHudThemeTokens): React.CSSProperties {
  return {
    fontSize: 9,
    fontWeight: 700,
    lineHeight: 1.2,
    color: theme.textSecondary,
    borderRadius: 999,
    border: `1px solid color-mix(in srgb, ${theme.controlBorder} 65%, transparent)`,
    padding: "2px 6px",
    background: "color-mix(in srgb, var(--nx-bg-control) 42%, transparent)",
    maxWidth: 88,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };
}

function compactControlButtonStyle(
  theme: NexoraHudThemeTokens,
  enabled: boolean,
  primary = false
): React.CSSProperties {
  return {
    minWidth: 0,
    padding: "4px 4px",
    borderRadius: 7,
    border: `1px solid ${theme.buttonBorder}`,
    background: primary && enabled ? theme.buttonBackground : theme.controlBackground,
    color: enabled ? theme.buttonText : theme.textSecondary,
    fontSize: 9,
    fontWeight: 800,
    letterSpacing: "0.03em",
    textTransform: "uppercase",
    cursor: enabled ? "pointer" : "not-allowed",
    opacity: enabled ? 1 : 0.62,
  };
}

function CompactMetricRow(props: {
  theme: NexoraHudThemeTokens;
  items: Array<{ label: string; value: string }>;
}): React.ReactElement {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${props.items.length}, minmax(0, 1fr))`,
        gap: 4,
        borderRadius: 6,
        border: `1px solid color-mix(in srgb, ${props.theme.controlBorder} 65%, transparent)`,
        background: "color-mix(in srgb, var(--nx-bg-control) 42%, transparent)",
        padding: "4px 6px",
      }}
    >
      {props.items.map((item) => (
        <div key={item.label} style={{ minWidth: 0, textAlign: "center" }}>
          <div
            style={{
              color: props.theme.textSecondary,
              fontSize: 8,
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {item.label}
          </div>
          <div
            style={{
              color: props.theme.textPrimary,
              fontSize: 10,
              fontWeight: 800,
              marginTop: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              textTransform: "capitalize",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}

function CompactStat(props: { label: string; value: string; theme: NexoraHudThemeTokens }): React.ReactElement {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ color: props.theme.textSecondary, fontSize: 9, fontWeight: 700 }}>{props.label}</div>
      <div style={{ color: props.theme.textPrimary, fontSize: 10, fontWeight: 800, marginTop: 1 }}>{props.value}</div>
    </div>
  );
}

function AdvancedLine(props: { label: string; value: string; theme: NexoraHudThemeTokens }): React.ReactElement {
  return (
    <div style={{ minWidth: 0 }}>
      <div
        style={{
          color: props.theme.textSecondary,
          fontSize: 8,
          fontWeight: 700,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        {props.label}
      </div>
      <div
        style={{
          color: props.theme.textPrimary,
          fontSize: 10,
          lineHeight: 1.3,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {props.value}
      </div>
    </div>
  );
}

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
