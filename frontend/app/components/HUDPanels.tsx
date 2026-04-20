"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ChatHUD } from "./ChatHUD";
import { LoopOverlayHUD } from "./LoopOverlayHUD";
import { DecisionCompareHUD } from "./DecisionCompareHUD";
import { StrategicDashboardHUD } from "./StrategicDashboardHUD";
import { hasFeature } from "../lib/config/planConfig";
import { fetchDecisions, saveDecision } from "../lib/persistence/persistenceClient";
import { InspectorHUD } from "./InspectorHUD";
import { pingHealth } from "../lib/api/health";
import ObjectPanel from "./ObjectPanel";
import type { ObjectPanelProps } from "./ObjectPanel";
import type { KPIState } from "../lib/api";
import type { SceneJson, SceneLoop, LoopType } from "../lib/sceneTypes";
import type { DecisionSnapshot } from "../lib/decision/decisionTypes";
import type { DecisionDiff as SnapshotDecisionDiff } from "../lib/decision/decisionDiff";
import type { CompanyConfigPayload } from "../lib/companyConfigTypes";
import { buildDecisionReport } from "../lib/decision/decisionReport";

import { appendSnapshot, loadSnapshots, clearSnapshots, replaceSnapshots } from "../lib/decision/decisionStore";
import { DECISION_TEMPLATES } from "../lib/decision/decisionTemplates";

import { KPIBoard } from "./KPIBoard";
import type { KPIBoardItem } from "./KPIBoard";
import { computeKpis } from "../lib/kpi/kpiEngine";
import { KPI_REGISTRY } from "../lib/kpi/kpiRegistry";
import type { LayoutMode, HUDTabKey, StrategicState } from "../lib/contracts";
import { toShellLayoutMode } from "../lib/ui/layoutAdapter";

const PANEL_WRAP_STYLE: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  flex: "1 1 0%",
  minHeight: 0,
  minWidth: 0,
  height: "100%",
  maxHeight: "100%",
  boxSizing: "border-box",
  alignSelf: "stretch",
  overflow: "hidden",
};

const PANEL_BODY_STYLE: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  flex: "1 1 0%",
  minHeight: 0,
  minWidth: 0,
  height: "100%",
  maxHeight: "100%",
};

const CHAT_WRAP_STYLE: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  flex: "1 1 0%",
  minHeight: 0,
  minWidth: 0,
  height: "100%",
  overflow: "hidden",
  position: "relative",
  pointerEvents: "auto",
  zIndex: 50,
};

type Msg = { role: "user" | "assistant"; text: string };

type ScenePrefs = {
  theme: "day" | "night" | "stars";
  starDensity: number;
  showGrid: boolean;
  showAxes: boolean;
  orbitMode: "auto" | "manual";
  globalScale: number;
  shadowsEnabled?: boolean;
  overridePolicy?: "keep" | "match" | "clear";
};

function DecisionReportCard({ report }: { report: ReturnType<typeof buildDecisionReport> }) {
  return (
    <div
      style={{
        padding: 12,
        borderRadius: 14,
        backdropFilter: "blur(10px)",
        background: "rgba(10,12,18,0.75)",
        border: "1px solid rgba(255,255,255,0.10)",
        color: "rgba(255,255,255,0.92)",
        boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
        <div style={{ fontWeight: 800 }}>{report.summary.title}</div>
        <div style={{ fontSize: 12, opacity: 0.75 }}>{report.risk.level.toUpperCase()}</div>
      </div>

      <div style={{ marginTop: 8, display: "grid", gap: 6 }}>
        {report.summary.bullets.slice(0, 4).map((b, i) => (
          <div key={i} style={{ fontSize: 12, opacity: 0.85 }}>
            • {b}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 10, fontSize: 12, opacity: 0.8, fontWeight: 700 }}>Next actions</div>
      <div style={{ marginTop: 6, display: "grid", gap: 6 }}>
        {report.nextActions.slice(0, 4).map((a) => (
          <div
            key={a.id}
            style={{
              padding: "8px 10px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700 }}>{a.title}</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>{a.priority}</div>
            </div>
            {a.detail ? (
              <div style={{ marginTop: 4, fontSize: 12, opacity: 0.75 }}>{a.detail}</div>
            ) : null}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 10, fontSize: 12, opacity: 0.75 }}>
        Risk reasons: {report.risk.reasons.slice(0, 2).join(" • ")}
      </div>
    </div>
  );
}

function applyTemplateToReport(
  report: ReturnType<typeof buildDecisionReport>,
  templateId: string,
  templateTitle?: string,
  templateTagline?: string
) {
  const mode = templateId;
  const prefix = templateTitle ? `${templateTitle}: ` : "";
  const bullets = [...(report.summary?.bullets ?? [])];

  const modeBullet =
    mode === "quality_protection"
      ? "Mode focus: protect quality and reduce rework risk."
      : mode === "cost_compression"
        ? "Mode focus: compress cost while keeping service acceptable."
        : mode === "delivery_customer"
          ? "Mode focus: improve delivery reliability and customer experience."
          : mode === "risk_reduction"
            ? "Mode focus: reduce exposure and increase operational safety."
            : templateTagline
              ? `Mode focus: ${templateTagline}`
              : "Mode focus: balance trade-offs.";

  const nextActions = (report.nextActions ?? []).map((a) => ({ ...a }));

  // Light re-prioritization by mode
  for (const a of nextActions) {
    const t = `${a.title ?? ""} ${a.detail ?? ""}`.toLowerCase();

    if (mode === "quality_protection" && /(test|qa|defect|rework|stabil|quality)/.test(t)) {
      a.priority = "high" as any;
    }
    if (mode === "cost_compression" && /(cost|budget|spend|waste|efficien|utiliz|optimi)/.test(t)) {
      a.priority = "high" as any;
    }
    if (mode === "delivery_customer" && /(delivery|sla|customer|support|response|lead time|cycle)/.test(t)) {
      a.priority = "high" as any;
    }
    if (mode === "risk_reduction" && /(risk|mitigat|control|audit|safety|incident|rollback)/.test(t)) {
      a.priority = "high" as any;
    }
  }

  return {
    ...report,
    summary: {
      ...report.summary,
      title: prefix + (report.summary?.title ?? "Decision"),
      bullets: [modeBullet, ...bullets].filter(Boolean),
    },
    nextActions,
  };
}

export type HUDPanelsArgs = {
  // CHAT
  messages: Msg[];
  input: string;
  setInput: (v: string) => void;
  send: () => void;
  handleAddLoopFromTemplate: (t: LoopType) => void;

  // KPI / Loops
  kpi: KPIState | null;
  visibleLoops: SceneLoop[];
  showLoops: boolean;
  setShowLoops: (fn: (v: boolean) => boolean) => void;
  showLoopLabels: boolean;
  setShowLoopLabels: (fn: (v: boolean) => boolean) => void;
  effectiveActiveLoopId: string | null;
  selectLoop: (id: string | null) => void;
  loopSuggestions: string[];
  handleFocusFromLoop: (id: string) => void;

  // MODE / PREFS
  activeMode: string;
  activeTemplateId?: string;
  setActiveTemplateId?: (v: string) => void;
  prefs: ScenePrefs;
  handlePrefsChange: (next: ScenePrefs) => void;
  backgroundMode: "day" | "night" | "stars";
  setBackgroundMode?: (v: ScenePrefs["theme"]) => void;
  starCount?: number;
  setStarCount?: (v: number) => void;
  cameraMode?: "orbit" | "fixed";
  setCameraMode?: (v: "orbit" | "fixed") => void;
  showAxes?: boolean;
  setShowAxes?: (v: boolean) => void;
  showGrid?: boolean;
  setShowGrid?: (v: boolean) => void;
  showCameraHelper?: boolean;
  setShowCameraHelper?: (v: boolean) => void;

  // PROJECT / SCENE
  sceneJson: SceneJson | null;
  selectedObjectInfo: any;
  selectedObjectId?: string | null;
  getUxForObject?: (id: string) => { shape?: string; base_color?: string; opacity?: number; scale?: number } | null;
  companyConfig?: CompanyConfigPayload | null;
  resolveObjectLabel?: (id: string) => string;
  resolveTypeLabel?: (id: string) => string;
  handleAskAboutSelected: () => void;
  updateObjectUx?: (id: string, patch: { opacity?: number; scale?: number }) => void;
  onObjectHoverStart?: (id: string) => void;
  onObjectHoverEnd?: (id: string) => void;
  selectionLocked: boolean;
  onToggleSelectionLock: () => void;
  layoutMode?: LayoutMode;

  // HISTORY / IO
  handleUndo?: () => void;
  handleExport?: () => void;
  handleImport?: (file: File) => void;
  handleSaveBackup?: () => void;
  handleRestoreBackup?: () => void;
  autoBackupEnabled?: boolean;
  setAutoBackupEnabled?: (v: boolean) => void;

  // STATUS
  loading: boolean;
  sourceLabel: string | null;
  noSceneUpdate: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;

  // DEV / HEALTH
  healthInfo: string | null;
  setHealthInfo: (v: string | null) => void;
  lastAnalysisSummary: string | null;
  sceneWarn: string | null;

  // FOCUS
  focusPinned: boolean;
  setFocusPinned: (fn: (v: boolean) => boolean) => void;
  clearFocus: () => void;
  focusMode: "all" | "selected";
  toggleFocusMode: () => void;
  focusedId: string | null;

  // ACTIONS
  lastActionsCount: number;
  recentActions?: Array<{ ts?: number; type?: string; object?: string; id?: string; value?: any; label?: string }>;
  handleReplayEvents: () => void;
  replaying: boolean;
  replayError: string | null;

  // SIM
  handleAddInventoryInstance: () => void;
  simRunning: boolean;
  simSpeed: number;
  setSimRunning: (fn: (v: boolean) => boolean) => void;
  simulateStep: () => void;
  setSimSpeed: (v: number) => void;
  simLastError: string | null;

  // DECISIONS
  snapshots: DecisionSnapshot[];
  compareAId: string | null;
  compareBId: string | null;
  setCompareAId: (v: string | null) => void;
  setCompareBId: (v: string | null) => void;
  diffState: SnapshotDecisionDiff | null;
  handleApplySnapshot: (snapshotId: string) => void;
  strategicState?: StrategicState;
};

type HUDObjectOption = {
  id: string;
  label: string;
  type?: string;
};

type HUDDerivedData = {
  projectId: string;
  layoutMode: LayoutMode;
  objects: HUDObjectOption[];
  computedKpis: ReturnType<typeof computeKpis>;
  template: (typeof DECISION_TEMPLATES)[number] | undefined;
  kpiValues: KPIBoardItem[];
  reportForUI: ReturnType<typeof buildDecisionReport>;
  objectInfo: ObjectPanelProps["selected"];
};

type HUDActions = {
  saveSnapshot: () => void;
  clearHistory: () => void;
  handlePingBackend: () => void;
  handleApplyMode: () => void;
  toggleDecisionCompare: (event?: React.SyntheticEvent) => void;
  handleImportFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  clearFocusSelection: () => void;
  toggleLoops: () => void;
  toggleLoopLabels: () => void;
  toggleSimRunning: () => void;
};

function useHUDDerivedData(args: HUDPanelsArgs, activeTemplateId: string): HUDDerivedData {
  const projectId = (args.sceneJson?.scene as any)?.project_id || "default";
  const layoutMode = (args.layoutMode ?? ("floating" as LayoutMode)) as LayoutMode;

  const objects = useMemo(() => {
    const list = Array.isArray(args.sceneJson?.scene?.objects) ? args.sceneJson?.scene?.objects : [];
    return list.map((o: any, idx: number) => {
      const id = o.id ?? (o.name as string) ?? `${o.type ?? "obj"}:${idx}`;
      const label = args.resolveObjectLabel ? args.resolveObjectLabel(id) : (o.name as string) ?? id;
      return { id, label, type: o.type };
    });
  }, [args.sceneJson, args.resolveObjectLabel]);

  const computedKpis = useMemo(() => {
    return computeKpis({
      sceneJson: args.sceneJson,
      loops: args.visibleLoops,
      stateVector: args.sceneJson?.state_vector,
      lastKpis: undefined,
    });
  }, [args.sceneJson, args.visibleLoops]);

  const template = useMemo(() => {
    return DECISION_TEMPLATES.find((t) => t.id === activeTemplateId);
  }, [activeTemplateId]);

  const kpiValues = useMemo(() => {
    const rawKpis = args.companyConfig?.kpis;
    const configKpiList = Array.isArray(rawKpis)
      ? rawKpis
      : rawKpis && Array.isArray((rawKpis as any).kpis)
        ? (rawKpis as any).kpis
        : [];

    const configKpiMap = new Map(
      configKpiList
        .filter((k: any) => k && typeof k.id === "string")
        .map((k: any) => [k.id, k])
    );

    const rows = (computedKpis ?? []).map((k: any) => {
      const def = configKpiMap.get(k.id) ?? (KPI_REGISTRY as Record<string, any>)[k.id];
      const weight = template?.kpiWeights?.[k.id] ?? template?.kpiWeights?.default ?? 1;
      return {
        id: k.id,
        label: def?.label ?? k.label ?? k.id,
        value: k.value,
        target:
          typeof k.target === "number"
            ? k.target
            : typeof def?.target === "number"
              ? def.target
              : k.value,
        direction: (k.direction === "down" ? "down" : "up") as "up" | "down",
        trend: undefined,
        score: typeof k.score === "number" ? k.score : 0,
        note: k.note,
        weight,
      };
    });

    rows.sort((a, b) => (b.weight ?? 1) - (a.weight ?? 1));
    return rows;
  }, [args.companyConfig, computedKpis, template]);

  const reportForUI = useMemo(() => {
    const selectedObjectId = (args.selectedObjectInfo?.id as string) ?? null;
    const report = buildDecisionReport({
      sceneJson: args.sceneJson,
      loops: args.visibleLoops,
      kpis: computedKpis,
      lastKpis: undefined,
      selectedObjectId,
    });

    return template
      ? applyTemplateToReport(report, template.id, template.title, template.tagline)
      : report;
  }, [args.sceneJson, args.visibleLoops, args.selectedObjectInfo, computedKpis, template]);

  const objectInfo = useMemo(() => {
    const selectedId: string | null =
      (typeof args.selectedObjectId === "string" && args.selectedObjectId.length > 0
        ? args.selectedObjectId
        : null) ??
      (typeof (args.selectedObjectInfo as any)?.id === "string" ? (args.selectedObjectInfo as any).id : null);

    const sceneObjects = Array.isArray((args.sceneJson as any)?.scene?.objects)
      ? ((args.sceneJson as any).scene.objects as any[])
      : [];

    const selectedSceneObject = selectedId
      ? sceneObjects.find((o: any) => (o?.id ?? o?.name) === selectedId)
      : null;

    const ux = selectedId && args.getUxForObject ? args.getUxForObject(selectedId) : null;

    return selectedId
      ? {
          id: selectedId,
          label: args.resolveObjectLabel ? args.resolveObjectLabel(selectedId) : selectedId,
          type:
            (typeof selectedSceneObject?.type === "string" ? selectedSceneObject.type : undefined) ??
            (typeof (args.selectedObjectInfo as any)?.type === "string" ? (args.selectedObjectInfo as any).type : undefined),
          tags: Array.isArray((args.selectedObjectInfo as any)?.tags) ? (args.selectedObjectInfo as any).tags : undefined,
          summary:
            typeof (args.selectedObjectInfo as any)?.summary === "string" ? (args.selectedObjectInfo as any).summary : undefined,
          one_liner:
            typeof (args.selectedObjectInfo as any)?.one_liner === "string" ? (args.selectedObjectInfo as any).one_liner : undefined,
          resolved:
            typeof (args.selectedObjectInfo as any)?.resolved === "boolean"
              ? (args.selectedObjectInfo as any).resolved
              : selectedSceneObject != null,
          currentStatusSummary:
            typeof (args.selectedObjectInfo as any)?.currentStatusSummary === "string"
              ? (args.selectedObjectInfo as any).currentStatusSummary
              : undefined,
          shape: ux?.shape,
          base_color: ux?.base_color,
          opacity:
            typeof ux?.opacity === "number"
              ? ux.opacity
              : typeof selectedSceneObject?.opacity === "number"
                ? selectedSceneObject.opacity
                : typeof selectedSceneObject?.alpha === "number"
                  ? selectedSceneObject.alpha
                  : undefined,
          scale:
            typeof ux?.scale === "number"
              ? ux.scale
              : typeof selectedSceneObject?.scale === "number"
                ? selectedSceneObject.scale
                : undefined,
        }
      : null;
  }, [
    args.getUxForObject,
    args.resolveObjectLabel,
    args.sceneJson,
    args.selectedObjectId,
    args.selectedObjectInfo,
  ]);

  return {
    projectId,
    layoutMode,
    objects,
    computedKpis,
    template,
    kpiValues,
    reportForUI,
    objectInfo,
  };
}

function useHUDActions(args: HUDPanelsArgs, derived: HUDDerivedData, setStoredSnapshots: React.Dispatch<React.SetStateAction<DecisionSnapshot[]>>, showDecisionCompare: boolean, setShowDecisionCompare: React.Dispatch<React.SetStateAction<boolean>>): HUDActions {
  const saveSnapshot = useCallback(() => {
    const ts = Date.parse(derived.reportForUI.createdAt) || Date.now();
    const currentKpis = derived.computedKpis;
    const intensity = Math.max(0, Math.min(1, Number(args.sceneJson?.state_vector?.intensity ?? 0)));
    const volatility = Math.max(0, Math.min(1, Number(args.sceneJson?.state_vector?.volatility ?? 0)));
    const chaosScore = Math.round((volatility * 0.7 + intensity * 0.3) * 100);
    const riskMatchers = /(risk|ignore|delay|rework)/i;
    const safetyMatchers = /(quality|protect|stabil)/i;
    let riskScore = 40;
    for (const loop of args.visibleLoops ?? []) {
      const label = `${(loop as any)?.id ?? ""} ${(loop as any)?.label ?? ""} ${(loop as any)?.type ?? ""}`;
      if (riskMatchers.test(label)) riskScore += 10;
      if (safetyMatchers.test(label)) riskScore -= 5;
    }
    riskScore = Math.max(0, Math.min(100, riskScore));
    const localSnapshot = {
      id: `${derived.reportForUI.id}_${Math.random().toString(36).slice(2, 8)}`,
      timestamp: ts,
      loops: derived.reportForUI.context?.activeLoops || [],
      activeLoopId: null,
      kpis: currentKpis,
      meta: {
        chaosScore,
        riskScore,
      },
    } as any;
    appendSnapshot(derived.projectId, localSnapshot);
    setStoredSnapshots(loadSnapshots(derived.projectId));
    const payload = {
      id: localSnapshot.id,
      timestamp: localSnapshot.timestamp,
      activeLoopId: localSnapshot.activeLoopId,
      loops: localSnapshot.loops,
      stateVector: args.sceneJson?.state_vector ?? {},
      kpis: localSnapshot.kpis ?? [],
    };
    saveDecision(derived.projectId, payload).then((res) => {
      if (!res.ok) {
        console.warn("[decision] failed to persist snapshot", localSnapshot.id);
      }
    });
  }, [args.sceneJson, args.visibleLoops, derived.computedKpis, derived.projectId, derived.reportForUI, setStoredSnapshots]);

  const clearHistory = useCallback(() => {
    clearSnapshots(derived.projectId);
    setStoredSnapshots([]);
  }, [derived.projectId, setStoredSnapshots]);

  const handlePingBackend = useCallback(() => {
    if (process.env.NODE_ENV === "production") return;
    pingHealth().then((res) => {
      if (res?.ok) args.setHealthInfo(`Backend OK (${res.version ?? "dev"})`);
      else args.setHealthInfo("Backend unreachable");
    });
  }, [args]);

  const handleApplyMode = useCallback(() => {
    const template = DECISION_TEMPLATES.find((t) => t.id === (args.activeTemplateId ?? ""));
    const selectedTemplate = template ?? derived.template;
    if (!selectedTemplate) return;
    selectedTemplate.suggestedLoops.forEach((loopType) => {
      args.handleAddLoopFromTemplate(loopType);
    });
    if (selectedTemplate.ui?.showLoops) {
      args.setShowLoops(() => true);
    }
  }, [args, derived.template]);

  const toggleDecisionCompare = useCallback((event?: React.SyntheticEvent) => {
    event?.preventDefault();
    event?.stopPropagation();
    setShowDecisionCompare((v) => !v);
  }, [setShowDecisionCompare]);

  const handleImportFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) args.handleImport?.(file);
    event.currentTarget.value = "";
  }, [args.handleImport]);

  const clearFocusSelection = useCallback(() => {
    args.setFocusPinned(() => false);
    args.clearFocus();
  }, [args.clearFocus, args.setFocusPinned]);

  const toggleLoops = useCallback(() => {
    args.setShowLoops((v) => !v);
  }, [args.setShowLoops]);

  const toggleLoopLabels = useCallback(() => {
    args.setShowLoopLabels((v) => !v);
  }, [args.setShowLoopLabels]);

  const toggleSimRunning = useCallback(() => {
    args.setSimRunning((v) => !v);
  }, [args.setSimRunning]);

  return {
    saveSnapshot,
    clearHistory,
    handlePingBackend,
    handleApplyMode,
    toggleDecisionCompare,
    handleImportFileChange,
    clearFocusSelection,
    toggleLoops,
    toggleLoopLabels,
    toggleSimRunning,
  };
}

export function useHUDPanels(args: HUDPanelsArgs) {
  const initialProjectId = (args.sceneJson?.scene as any)?.project_id || "default";
  const [storedSnapshots, setStoredSnapshots] = useState<DecisionSnapshot[]>(() => loadSnapshots(initialProjectId));
  const [showDecisionCompare, setShowDecisionCompare] = useState(false);
  const [localTemplateId, setLocalTemplateId] = useState<string>("quality_protection");
  const activeTemplateId = args.activeTemplateId ?? localTemplateId;
  const setActiveTemplateId = args.setActiveTemplateId ?? setLocalTemplateId;
  const derived = useHUDDerivedData(args, activeTemplateId);
  const actions = useHUDActions(args, derived, setStoredSnapshots, showDecisionCompare, setShowDecisionCompare);
  useEffect(() => {
    setStoredSnapshots(loadSnapshots(derived.projectId));
    let active = true;
    (async () => {
      const result = await fetchDecisions(derived.projectId, 50);
      if (!active || !result.ok || !Array.isArray(result.data)) return;
      const normalized = result.data
        .map((raw: any) => {
          if (!raw || typeof raw !== "object") return null;
          const id = typeof raw.id === "string" ? raw.id : null;
          const timestamp = typeof raw.timestamp === "number" ? raw.timestamp : Number(raw.timestamp);
          if (!id || !Number.isFinite(timestamp)) return null;
          return {
            id,
            timestamp,
            loops: Array.isArray(raw.loops) ? raw.loops : [],
            activeLoopId: typeof raw.activeLoopId === "string" ? raw.activeLoopId : null,
            projectId: derived.projectId,
            note: typeof raw.note === "string" ? raw.note : undefined,
            meta: raw.meta && typeof raw.meta === "object" ? raw.meta : undefined,
            kpis: raw.kpis,
          } as any;
        })
        .filter(Boolean) as DecisionSnapshot[];
      setStoredSnapshots(replaceSnapshots(derived.projectId, normalized));
    })();
    return () => {
      active = false;
    };
  }, [derived.projectId]);

  return useMemo(() => {
    const wrapPanel = (node: React.ReactNode, opts?: { scroll?: boolean }) => {
      const scroll = opts?.scroll !== false;
      return (
        <div style={PANEL_WRAP_STYLE}>
          <div
            style={{
              ...PANEL_BODY_STYLE,
              overflow: scroll ? "auto" : "hidden",
              WebkitOverflowScrolling: scroll ? ("touch" as any) : undefined,
              overscrollBehavior: scroll ? ("contain" as any) : undefined,
            }}
          >
            {node}
          </div>
        </div>
      );
    };
    const wrapChatPanel = (node: React.ReactNode) => {
      return <div style={CHAT_WRAP_STYLE}>{node}</div>;
    };
    const kpiPanel = <KPIBoard kpis={derived.kpiValues} />;
    const decisionReportPanel = <DecisionReportCard report={derived.reportForUI} />;

    const historyPanel = (
      <div style={{ display: "grid", gap: 8 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            onClick={actions.saveSnapshot}
            style={{
              padding: "8px 10px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.92)",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            Save decision
          </button>
          <button
            onClick={actions.clearHistory}
            style={{
              padding: "8px 10px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(255,255,255,0.03)",
              color: "rgba(255,255,255,0.85)",
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            Clear history
          </button>
        </div>

        <div style={{ fontSize: 12, opacity: 0.8, fontWeight: 800 }}>
          Decision history ({storedSnapshots.length})
        </div>

        <div style={{ display: "grid", gap: 6, maxHeight: 260, overflow: "auto" }}>
          {Array.from(
            new Map(
              storedSnapshots
                .slice()
                .reverse()
                .map((s) => [`${s.id}:${s.timestamp}`, s] as const)
            ).values()
          )
            .slice(0, 10)
            .map((s) => (
              <button
                key={`${s.id}:${s.timestamp}`}
                onClick={() => args.handleApplySnapshot(`${s.id}:${s.timestamp}`)}
                style={{
                  textAlign: "left",
                  padding: "8px 10px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.03)",
                  color: "rgba(255,255,255,0.92)",
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{s.id}</div>
                  <div style={{ fontSize: 12, opacity: 0.7 }}>{new Date(s.timestamp).toLocaleString()}</div>
                </div>
                <div style={{ marginTop: 4, fontSize: 12, opacity: 0.75 }}>
                  Loops: {(s.loops || []).slice(0, 3).join(", ")}{(s.loops || []).length > 3 ? "…" : ""}
                </div>
              </button>
            ))}
        </div>

        <div style={{ fontSize: 12, opacity: 0.65 }}>
          Tip: click a saved decision to apply that snapshot.
        </div>
      </div>
    );

    const chatPanel = (
      <ChatHUD
        resolveObjectLabel={args.resolveObjectLabel}
        embedded
        layoutMode={toShellLayoutMode(args.layoutMode)}
        messages={args.messages}
        input={args.input}
        onInputChange={args.setInput}
        onSend={args.send}
        onAddLoopFromTemplate={args.handleAddLoopFromTemplate}
        kpi={args.kpi}
        loopsCount={args.visibleLoops.length}
        showLoops={args.showLoops}
        onToggleLoops={actions.toggleLoops}
        showLoopLabels={args.showLoopLabels}
        onToggleLoopLabels={actions.toggleLoopLabels}
        loopState={args.visibleLoops}
        activeMode={args.activeMode}
        onUndo={args.handleUndo ?? (() => {})}
        onExport={args.handleExport ?? (() => {})}
        onImport={args.handleImport ?? (() => {})}
        loading={args.loading}
        sourceLabel={args.sourceLabel}
        noSceneUpdate={args.noSceneUpdate}
        prefs={args.prefs}
        onPrefsChange={args.handlePrefsChange}
        objects={derived.objects}
        selectedObjectInfo={args.selectedObjectInfo}
        onAskAboutSelected={args.handleAskAboutSelected}
        lastActionsCount={args.lastActionsCount}
        onReplayEvents={args.handleReplayEvents}
        replaying={args.replaying}
        replayError={args.replayError}
        onPingBackend={actions.handlePingBackend}
        healthInfo={args.healthInfo}
        analysisSummary={args.lastAnalysisSummary}
        sceneWarn={args.sceneWarn}
        focusPinned={args.selectionLocked}
        onTogglePinFocus={args.onToggleSelectionLock}
        onClearFocus={actions.clearFocusSelection}
        focusMode={args.focusMode}
        onToggleFocusMode={args.toggleFocusMode}
        focusedId={args.focusedId}
        onAddInventoryInstance={args.handleAddInventoryInstance}
        simRunning={args.simRunning}
        simSpeed={args.simSpeed}
        onToggleSimRunning={actions.toggleSimRunning}
        onSimStep={args.simulateStep}
        onSetSimSpeed={args.setSimSpeed}
        simLastError={args.simLastError}
      />
    );

    const buildDecisionsPanel = () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 800, opacity: 0.85 }}>Decisions</div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
              justifyContent: "flex-end",
              maxWidth: "100%",
            }}
          >
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, opacity: 0.8 }}>
              Mode
              <select
                value={activeTemplateId}
                onChange={(e) => setActiveTemplateId(e.target.value)}
                style={{
                  background: "rgba(0,0,0,0.4)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.14)",
                  borderRadius: 10,
                  padding: "4px 6px",
                  fontSize: 11,
                  maxWidth: 220,
                  boxSizing: "border-box",
                }}
              >
                {DECISION_TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={actions.handleApplyMode}
              style={{
                padding: "6px 10px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(255,255,255,0.03)",
                color: "rgba(255,255,255,0.88)",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 700,
                position: "relative",
                zIndex: 2,
                whiteSpace: "nowrap",
              }}
            >
              Apply Mode
            </button>
            <button
              type="button"
              onClick={actions.toggleDecisionCompare}
              style={{
                padding: "6px 10px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.10)",
                background: showDecisionCompare ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
                color: "rgba(255,255,255,0.88)",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 700,
                position: "relative",
                zIndex: 2,
                whiteSpace: "nowrap",
              }}
            >
              {showDecisionCompare ? "Hide Advanced" : "Advanced"}
            </button>
          </div>
        </div>

        {derived.template ? (
          <div
            style={{
              padding: "8px 10px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(255,255,255,0.03)",
              fontSize: 12,
              color: "rgba(255,255,255,0.90)",
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
              alignItems: "center",
            }}
          >
            <div style={{ fontWeight: 800 }}>MODE: {derived.template.title}</div>
            <div style={{ opacity: 0.8 }}>{derived.template.tagline}</div>
          </div>
        ) : null}

        {showDecisionCompare ? (
          <div
            style={{
              padding: 10,
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(255,255,255,0.03)",
              position: "relative",
              zIndex: 1,
              maxWidth: "100%",
              boxSizing: "border-box",
              overflow: "hidden",
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 800, opacity: 0.85, marginBottom: 8 }}>
              Advanced: Compare snapshots (available: {storedSnapshots.length})
            </div>
            {hasFeature("decision_compare") ? (
              <div style={{ maxHeight: 320, overflow: "auto", paddingRight: 4 }}>
                <DecisionCompareHUD
                  snapshots={storedSnapshots}
                  selectedAId={args.compareAId}
                  selectedBId={args.compareBId}
                  onSelectA={args.setCompareAId}
                  onSelectB={args.setCompareBId}
                  diff={args.diffState}
                  onApplySnapshot={args.handleApplySnapshot}
                />
              </div>
            ) : (
              <div style={{ fontSize: 12, opacity: 0.75, display: "grid", gap: 6 }}>
                <div style={{ fontWeight: 700 }}>Advanced Compare is a Pro feature.</div>
                <div style={{ fontSize: 11, opacity: 0.7 }}>
                  Set NEXT_PUBLIC_PLAN=pro (MVP) to unlock.
                </div>
              </div>
            )}
          </div>
        ) : null}

        <StrategicDashboardHUD
          strategicState={args.strategicState}
          layoutMode={toShellLayoutMode(args.layoutMode)}
        />
        {decisionReportPanel}
        <div
          style={{
            padding: "8px 10px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.10)",
            background: "rgba(255,255,255,0.03)",
            display: "grid",
            gap: 8,
            fontSize: 12,
          }}
        >
          <div style={{ fontWeight: 800, opacity: 0.85 }}>Backup & Project</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => args.handleSaveBackup?.()}
              disabled={!args.handleSaveBackup}
              style={{
                padding: "6px 10px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.9)",
                cursor: args.handleSaveBackup ? "pointer" : "not-allowed",
                opacity: args.handleSaveBackup ? 1 : 0.6,
              }}
            >
              Save Backup
            </button>
            <button
              type="button"
              onClick={() => args.handleRestoreBackup?.()}
              disabled={!args.handleRestoreBackup}
              style={{
                padding: "6px 10px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.9)",
                cursor: args.handleRestoreBackup ? "pointer" : "not-allowed",
                opacity: args.handleRestoreBackup ? 1 : 0.6,
              }}
            >
              Restore Backup
            </button>
            <button
              type="button"
              onClick={() => args.handleExport?.()}
              disabled={!args.handleExport}
              style={{
                padding: "6px 10px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.9)",
                cursor: args.handleExport ? "pointer" : "not-allowed",
                opacity: args.handleExport ? 1 : 0.6,
              }}
            >
              Export
            </button>
            <label
              style={{
                padding: "6px 10px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.9)",
                cursor: args.handleImport ? "pointer" : "not-allowed",
                opacity: args.handleImport ? 1 : 0.6,
              }}
            >
              Import
              <input
                type="file"
                accept="application/json"
                hidden
                onChange={actions.handleImportFileChange}
              />
            </label>
            <label
              style={{
                padding: "6px 10px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.9)",
                cursor: args.setAutoBackupEnabled ? "pointer" : "not-allowed",
                opacity: args.setAutoBackupEnabled ? 1 : 0.6,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <input
                type="checkbox"
                checked={!!args.autoBackupEnabled}
                onChange={(e) => args.setAutoBackupEnabled?.(e.target.checked)}
                disabled={!args.setAutoBackupEnabled}
                style={{ margin: 0 }}
              />
              <span>Auto Backup</span>
            </label>
          </div>
          <div style={{ opacity: 0.7 }}>
            Backup key: <span style={{ fontFamily: "monospace" }}>statestudio.backup.v1</span>
          </div>
        </div>
        {historyPanel}
        <InspectorHUD inline data={args.sceneJson?.state_vector} />
      </div>
    );

    const buildScenePanel = () => (
      <div style={{ display: "grid", gap: 10 }}>
        <h3
          style={{
            margin: "0 0 8px 0",
            color: "#ffffff",
            fontWeight: 800,
            fontSize: 14,
            letterSpacing: 0.2,
            textShadow: "none",
            filter: "none",
            opacity: 1,
          }}
        >
          Scene
        </h3>
        <label
          style={{
            display: "grid",
            gap: 6,
            color: "rgba(255,255,255,0.9)",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          Background mode
          <select
            value={args.prefs?.theme ?? "day"}
            onChange={(e) =>
              args.handlePrefsChange({ ...args.prefs, theme: e.target.value as ScenePrefs["theme"] })
            }
            style={{
              padding: "6px 8px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(0,0,0,0.25)",
              color: "white",
              fontSize: 12,
            }}
          >
            <option value="day">day</option>
            <option value="night">night</option>
            <option value="stars">stars</option>
          </select>
        </label>

        <label
          style={{
            display: "grid",
            gap: 6,
            color: "rgba(255,255,255,0.9)",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          Star count
          <input
            type="range"
            min={0}
            max={2000}
            step={50}
            value={args.starCount ?? Math.round((args.prefs?.starDensity ?? 0) * 2000)}
            onChange={(e) => {
              const next = Math.max(0, Math.min(2000, Number(e.target.value)));
              if (args.setStarCount) {
                args.setStarCount(next);
              } else {
                args.handlePrefsChange({ ...args.prefs, starDensity: next / 2000 });
              }
            }}
          />
        </label>

        <label
          style={{
            display: "grid",
            gap: 6,
            color: "rgba(255,255,255,0.9)",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          Camera mode
          <select
            value={args.cameraMode ?? (args.prefs?.orbitMode === "manual" ? "fixed" : "orbit")}
            onChange={(e) => {
              const next = e.target.value === "fixed" ? "fixed" : "orbit";
              if (args.setCameraMode) {
                args.setCameraMode(next);
              } else {
                const mode = next === "fixed" ? "manual" : "auto";
                args.handlePrefsChange({ ...args.prefs, orbitMode: mode });
              }
            }}
            style={{
              padding: "6px 8px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(0,0,0,0.25)",
              color: "white",
              fontSize: 12,
            }}
          >
            <option value="orbit">orbit</option>
            <option value="fixed">fixed</option>
          </select>
        </label>
        <div style={{ display: "grid", gap: 6 }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "rgba(255,255,255,0.9)",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <input
              type="checkbox"
              checked={args.showAxes ?? true}
              onChange={(e) => args.setShowAxes?.(e.target.checked)}
            />
            Axes
          </label>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "rgba(255,255,255,0.9)",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <input
              type="checkbox"
              checked={args.showGrid ?? false}
              onChange={(e) => args.setShowGrid?.(e.target.checked)}
            />
            Grid
          </label>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "rgba(255,255,255,0.9)",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <input
              type="checkbox"
              checked={args.showCameraHelper ?? false}
              onChange={(e) => args.setShowCameraHelper?.(e.target.checked)}
            />
            Camera helper
          </label>
        </div>
      </div>
    );

    const buildObjectPanel = () => (
      <ObjectPanel
        selected={derived.objectInfo}
        recentActions={args.recentActions}
        resolveObjectLabel={args.resolveObjectLabel}
        resolveTypeLabel={args.resolveTypeLabel}
        onHoverStart={args.onObjectHoverStart}
        onHoverEnd={args.onObjectHoverEnd}
        selectionLocked={args.selectionLocked}
        onToggleSelectionLock={args.onToggleSelectionLock}
      />
    );

    const buildLoopsPanel = () => (
      <LoopOverlayHUD
        embedded
        loops={args.visibleLoops}
        activeLoopId={args.effectiveActiveLoopId}
        onSelectLoop={(id) => args.selectLoop(id)}
        showLoopLabels={args.showLoopLabels}
        onToggleLoopLabels={actions.toggleLoopLabels}
        loopSuggestions={args.loopSuggestions}
        onFocusObject={args.handleFocusFromLoop}
      />
    );
    const strategicPanel = <StrategicDashboardHUD strategicState={args.strategicState} layoutMode={toShellLayoutMode(args.layoutMode)} />;

    return {
      chat: wrapChatPanel(chatPanel),
      kpi: wrapPanel(kpiPanel),
      decisions: wrapPanel(buildDecisionsPanel()),
      scene: wrapPanel(buildScenePanel()),
      object: wrapPanel(buildObjectPanel()),
      loops: wrapPanel(buildLoopsPanel()),
      strategic: wrapPanel(strategicPanel),
    } as const;
  }, [
    derived.layoutMode,
    derived.objects,
    derived.kpiValues,
    derived.reportForUI,
    derived.template,
    derived.objectInfo,
    storedSnapshots,
    showDecisionCompare,
    activeTemplateId,

    // inputs referenced directly in JSX
    args.messages,
    args.input,
    args.setInput,
    args.send,
    args.handleAddLoopFromTemplate,
    args.kpi,
    args.visibleLoops,
    args.showLoops,
    args.setShowLoops,
    args.showLoopLabels,
    args.setShowLoopLabels,
    args.effectiveActiveLoopId,
    args.selectLoop,
    args.loopSuggestions,
    args.handleFocusFromLoop,
    args.activeMode,
    args.handleUndo,
    args.handleExport,
    args.handleImport,
    args.loading,
    args.sourceLabel,
    args.noSceneUpdate,
    args.prefs,
    args.handlePrefsChange,
    args.selectedObjectInfo,
    args.handleAskAboutSelected,
    args.lastActionsCount,
    args.handleReplayEvents,
    args.replaying,
    args.replayError,
    args.setHealthInfo,
    args.healthInfo,
    args.lastAnalysisSummary,
    args.sceneWarn,
    args.selectionLocked,
    args.onToggleSelectionLock,
    args.clearFocus,
    args.focusMode,
    args.toggleFocusMode,
    args.focusedId,
    args.handleAddInventoryInstance,
    args.simRunning,
    args.simSpeed,
    args.setSimRunning,
    args.simulateStep,
    args.setSimSpeed,
    args.simLastError,
    args.compareAId,
    args.compareBId,
    args.setCompareAId,
    args.setCompareBId,
    args.diffState,
    args.handleApplySnapshot,
    args.strategicState,
    args.sceneJson,
    args.resolveObjectLabel,
    args.resolveTypeLabel,
    args.onObjectHoverStart,
    args.onObjectHoverEnd,
    actions.saveSnapshot,
    actions.clearHistory,
    actions.handlePingBackend,
    actions.handleApplyMode,
    actions.toggleDecisionCompare,
    actions.handleImportFileChange,
    actions.clearFocusSelection,
    actions.toggleLoops,
    actions.toggleLoopLabels,
    actions.toggleSimRunning,
  ]);
}
