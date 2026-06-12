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
import {
  HUD_PANEL_BODY_PADDING_STYLE,
  HUD_PANEL_HEADER_PADDING_STYLE,
  HUD_PANEL_SAFE_TEXT_STYLE,
  HUD_PANEL_SCROLL_BODY_STYLE,
  HUD_PANEL_STICKY_DETAIL_HEADER_STYLE,
  HUD_PANEL_STICKY_HEADER_STYLE,
  HUD_PANEL_STICKY_SHELL_STYLE,
  HUD_PANEL_TRUNCATE_TEXT_STYLE,
  OBJECT_PANEL_EXPANDED_WIDTH,
  OBJECT_PANEL_WIDTH,
  traceHudPanelStickyHeader,
} from "../../lib/hud/hudPanelDesignContract";
import { formatObjectPanelTitle, traceObjectPanelTitleIdentity } from "../../lib/object-panel/objectPanelTitleContract";
import { buildObjectPanelExecutiveViewModel } from "../../lib/object-panel/objectPanelExecutiveViewModel";
import ExecutiveActionPanel from "../panels/ExecutiveActionPanel";
import type { ExecutiveActionPanelModel } from "../../lib/object-panel/executiveActionPanelContract";
import {
  getExecutiveFocusModeServerSnapshot,
  getExecutiveFocusModeSnapshot,
  subscribeExecutiveFocusMode,
} from "../../lib/workspace/executiveFocusModeRuntime";
import { SceneActionDock } from "./SceneActionDock";
import { HudPanelToggleButton } from "../hud/HudPanelToggleButton";

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
        ? 324
        : 364
      : panelSizeMode === "compact"
        ? compact
          ? 264
          : 304
        : compact
          ? 304
          : OBJECT_PANEL_EXPANDED_WIDTH;

  useViewportWidthListener(setViewportWidth, "ObjectInfoHud");

  const shellStyle = nexoraHudShellStyle(
    hudTheme,
    {
      ...HUD_PANEL_STICKY_SHELL_STYLE,
      width: "100%",
      maxWidth: "100%",
      fontSize: 11,
      lineHeight: 1.45,
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
  const focusModeActive = React.useSyncExternalStore(
    subscribeExecutiveFocusMode,
    () => getExecutiveFocusModeSnapshot().enabled,
    () => getExecutiveFocusModeServerSnapshot().enabled
  );

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

  const previousCollapsedRef = React.useRef<boolean | null>(null);

  React.useEffect(() => {
    if (previousCollapsedRef.current === collapsed) return;
    previousCollapsedRef.current = collapsed;
    persistObjectInfoCollapsePreference(collapsed);
  }, [collapsed]);

  React.useEffect(() => {
    if (collapsed) return;
    if (!props.selectedObjectId && !props.relationshipDetails && !props.propagationDetails) return;
    traceHudPanelStickyHeader({ panel: "object" });
  }, [collapsed, props.propagationDetails, props.relationshipDetails, props.selectedObjectId]);

  const toggleCollapsed = React.useCallback(() => {
    setCollapsed((value) => !value);
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
            ...HUD_PANEL_STICKY_DETAIL_HEADER_STYLE,
            ...HUD_PANEL_HEADER_PADDING_STYLE,
            borderBottom: `1px solid ${nx.borderSoft}`,
            background: hudTheme.panelBackground,
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
        <div data-nx="object-panel-scroll-body" style={HUD_PANEL_SCROLL_BODY_STYLE}>
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
            ...HUD_PANEL_STICKY_DETAIL_HEADER_STYLE,
            ...HUD_PANEL_HEADER_PADDING_STYLE,
            borderBottom: `1px solid ${nx.borderSoft}`,
            background: hudTheme.panelBackground,
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
        <div data-nx="object-panel-scroll-body" style={HUD_PANEL_SCROLL_BODY_STYLE}>
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
            width: panelSizeMode === "expanded" ? (compact ? OBJECT_PANEL_WIDTH : OBJECT_PANEL_EXPANDED_WIDTH) : panelSizeMode === "compact" ? (compact ? 192 : 208) : compact ? 220 : OBJECT_PANEL_WIDTH,
            ...HUD_PANEL_BODY_PADDING_STYLE,
          },
          { surface: "objectInfoHud" }
        )}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <div style={{ ...sectionLabelStyle(hudTheme), marginBottom: 4 }}>{formatObjectPanelTitle(null)}</div>
        <div style={{ color: nx.muted, fontSize: 11 }}>{resolveExecutiveEmptyState("no_selection")}</div>
      </div>
    );
  }

  if (!layout) {
    return <></>;
  }

  if (collapsed) {
    return (
      <SceneActionDock
        objectId={props.selectedObjectId}
        objectName={layout.header.name}
        theme={hudTheme}
        focusModeActive={focusModeActive}
        onExpandPanel={toggleCollapsed}
      />
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
        selectedObjectId={props.selectedObjectId}
        onCreateImpactPath={props.onCreateImpactPath}
        onCollapse={toggleCollapsed}
      />
    </div>
  );
}

export default ObjectInfoHud;

function ExecutiveObjectInfoCard(props: {
  layout: ExecutiveObjectInfoLayout;
  theme: NexoraHudThemeTokens;
  selectedObjectId: string;
  onCreateImpactPath?: (sourceObjectId?: string | null) => void;
  onCollapse: () => void;
}): React.ReactElement {
  const { layout } = props;
  const focusModeActive = React.useSyncExternalStore(
    subscribeExecutiveFocusMode,
    () => getExecutiveFocusModeSnapshot().enabled,
    () => getExecutiveFocusModeServerSnapshot().enabled
  );
  const panelModel: ExecutiveActionPanelModel = {
    objectId: layout.header.objectId,
    objectName: layout.header.name,
    objectType: layout.header.type,
    status: layout.primary.health,
    riskLevel: layout.primary.riskLevel,
    connections: layout.context.connected,
    dependencies: layout.context.criticalLinks,
    scenarios: layout.secondary.signals.length,
    lastUpdated: "Runtime",
  };

  React.useEffect(() => {
    traceObjectPanelTitleIdentity(layout.header.name);
  }, [layout.header.name]);

  return (
    <>
      <header
        style={{
          ...HUD_PANEL_STICKY_HEADER_STYLE,
          ...HUD_PANEL_HEADER_PADDING_STYLE,
          borderBottom: `1px solid color-mix(in srgb, ${props.theme.panelBorder} 55%, transparent)`,
          background: props.theme.panelBackground,
        }}
      >
        <div
          style={{
            ...sectionLabelStyle(props.theme),
            ...HUD_PANEL_SAFE_TEXT_STYLE,
            ...HUD_PANEL_TRUNCATE_TEXT_STYLE,
            marginBottom: 0,
            flex: 1,
          }}
        >
          {formatObjectPanelTitle(layout.header.name)}
        </div>
        <HudPanelToggleButton panelId="object" expanded onClick={props.onCollapse} />
      </header>
      <div data-nx="object-panel-scroll-body" style={HUD_PANEL_SCROLL_BODY_STYLE}>
        <ExecutiveActionPanel
          model={panelModel}
          focusModeActive={focusModeActive}
          view={buildObjectPanelExecutiveViewModel({
            model: panelModel,
            executiveSummary: layout.secondary.summary,
            extraInsights: layout.secondary.signals,
          })}
        />
        {props.onCreateImpactPath ? (
          <div style={{ marginTop: 8 }}>
            <button
              type="button"
              aria-label="Create Impact Path"
              title="Create impact path from selected object"
              onClick={() => props.onCreateImpactPath?.(props.selectedObjectId ?? null)}
              style={{
                width: "100%",
                minHeight: 30,
                borderRadius: 8,
                border: `1px solid ${props.theme.buttonBorder}`,
                background: props.theme.buttonBackground,
                color: props.theme.buttonText,
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Create Impact Path
            </button>
          </div>
        ) : null}
      </div>
    </>
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
