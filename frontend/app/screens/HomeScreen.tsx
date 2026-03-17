"use client";

import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { createPortal } from "react-dom";
// Removed unused R3F/Three imports
import { fetchObjectProfile } from "../lib/api";
import { chatToBackend } from "../lib/api/chatApi";
import type { KPIState } from "../lib/api";
import { analyzeFull } from "../lib/api/analyzeApi";
// Removed unused SceneRenderer import
import { SceneCanvas } from "../components/SceneCanvas";
import type { HUDTabKey } from "../components/HUDShell";
import { diffSnapshots } from "../lib/decision/decisionDiff";
import type { DecisionSnapshot } from "../lib/decision/decisionTypes";
import { useSetViewMode } from "../components/SceneContext";
import { clamp, parseSizeCommand, parseSelectedSizeCommand } from "../lib/sizeCommands";
import {
  useOverrides,
  useSetOverride,
  useClearAllOverrides,
  usePruneOverridesTo,
  useSelectedId,
} from "../components/SceneContext";
import { getRecentEvents } from "../lib/api/events";
import { delay } from "../lib/delay";
import type { SceneJson, SceneLoop, LoopType } from "../lib/sceneTypes";
import {
  appendSnapshot,
  clearSnapshots,
  loadSnapshots,
} from "../lib/decision/decisionStore";
import { normalizeLoops } from "../lib/loops/loopContract";
import { resolveLoopPlaceholders } from "../lib/loops/loopResolver";
import { makeLoopFromTemplate } from "../lib/loops/loopTemplates";
import { setCompanyId } from "../lib/apiBase";
import { useCompanyConfig } from "../hooks/useCompanyConfig";
import { useActiveLoopId, useFocusActions, useFocusMode, usePinnedId } from "../lib/focus/focusStore";
import { applyDecisionActions } from "../lib/decision/applyDecisionActions";
import {
  createEmptyProjectState,
  DEFAULT_PROJECT_ID,
  DEFAULT_WORKSPACE_ID,
  inferProjectMetaFromScene,
  type WorkspaceProjectState,
} from "../lib/workspace/workspaceModel";
import {
  loadWorkspaceSnapshot,
  saveProjectSnapshot,
  saveWorkspaceSnapshot,
} from "../lib/workspace/workspacePersistence";
import { applyScannerResultToWorkspace, type ScannerResult } from "../lib/workspace/scannerContract";
import { scanSystemToScannerResult, type ScannerInput } from "../lib/scanner/systemFragilityScanner";
import {
  applyExternalIntegrationToWorkspace,
  type ExternalIntegrationResult,
} from "../lib/integration/externalIntegrationContract";
import {
  exportProjectFile,
  importProjectFileToWorkspace,
  parseImportedProjectFile,
} from "../lib/workspace/projectTransfer";
import {
  getObjectDependencies,
  getObjectDisplayLabel,
  getObjectSemanticMeta,
  getObjectSemanticTags,
  getSceneObjectsFromPayload,
  matchObjectsFromPrompt,
  tokenizeSemanticText,
} from "../lib/objectSemantics";
import type { UICommand } from "../lib/ui/uiCommands";
import { RestorePreviewModal } from "../components/RestorePreviewModal";
import { StrategicAlertOverlay } from "../components/StrategicAlertOverlay";
import { TimelinePanel } from "../components/panels/TimelinePanel";
import ConflictMapPanel from "../components/panels/ConflictMapPanel";
import ObjectSelectionPanel from "../components/panels/ObjectSelectionPanel";
import MemoryInsightsPanel from "../components/panels/MemoryInsightsPanel";
import RiskPropagationPanel from "../components/panels/RiskPropagationPanel";
import DecisionReplayPanel from "../components/panels/DecisionReplayPanel";
import StrategicAdvicePanel from "../components/panels/StrategicAdvicePanel";
import OpponentMovesPanel from "../components/panels/OpponentMovesPanel";
import StrategicPatternsPanel from "../components/panels/StrategicPatternsPanel";
import ExecutiveDashboardPanel from "../components/panels/ExecutiveDashboardPanel";
import CollaborationPanel from "../components/panels/CollaborationPanel";
import ProductWorkspacePanel from "../components/panels/ProductWorkspacePanel";
import { useEmotionalFxEngine } from "../lib/fx/useEmotionalFxEngine";
import { useStrategicRadar } from "../lib/strategy/useStrategicRadar";
import { computeRiskLevel } from "../lib/risk/riskEscalationEngine";
import { appendRiskEvent } from "../lib/risk/riskEventStore";
import { routeChatInput } from "../lib/decision/decisionRouter";
import {
  buildSimulationResult,
  createSimulationInputFromPrompt,
} from "../lib/decision/simulationContract";
import {
  buildReplaySequence,
  compareScenarioSnapshots,
  createScenarioSnapshot,
} from "../lib/decision/scenarioComparisonReplayContract";
import { buildExecutiveInsightFromSimulation } from "../lib/decision/executiveExplainabilityContract";
import {
  buildStrategyAwareExecutiveNotes,
  buildStrategyKpiContext,
} from "../lib/strategy/strategyKpiContract";
import { buildDecisionCockpitState } from "../lib/cockpit/decisionCockpitContract";
import { buildActiveModeContext, getProductMode, type ActiveModeContext } from "../lib/modes/productModesContract";
import { buildReasoningOutput, createReasoningInput } from "../lib/reasoning/aiReasoningContract";
import { orchestrateMultiAgentDecision } from "../lib/reasoning/multiAgentDecisionEngineContract";
import {
  appendAuditEvents,
  appendTrustProvenance,
  buildProjectGovernanceContext,
  createAuditEvent,
  createTrustProvenance,
} from "../lib/governance/governanceTrustAuditContract";
import {
  buildEnvironmentConfig,
  isFeatureEnabled,
  resolveNexoraEnvironment,
  type EnvironmentConfig,
} from "../lib/ops/environmentDeploymentContract";
import { buildPlatformAssemblyState } from "../lib/platform/platformAssemblyContract";
import { runAutonomousScenarioExploration } from "../lib/exploration/autonomousScenarioExplorer";
import { createInitialMemoryState, deriveVisualPatch, updateMemory } from "../lib/memory/decisionMemory";
import type { MemoryStateV1 } from "../lib/memory/memoryTypes";
import type { RiskAlert, StrategicState, EmotionalFx, ScenePatch, SceneObjectPatch } from "../lib/contracts";
import {
  Msg,
  ScenePrefs,
  PersistedProject,
  BackupV1,
  HISTORY_KEY,
  SESSION_KEY,
  PREFS_KEY,
  AUTO_BACKUP_KEY,
  MEMORY_KEY,
  defaultPrefs,
  makeMsg,
  normalizeMessages,
  appendMessages,
  normalizeSceneJson,
  saveProject,
  loadProject,
  loadHistory,
  pushHistory,
  saveBackup,
  loadBackup,
  stableStringify,
} from "./homeScreenUtils";
import { buildBackup as buildBackupController, buildRestorePreviewLines } from "./backupController";
import { applyFragilityScenePayload } from "../lib/scanner/applyFragilityScenePayload";
import {
  resolveDomainExperience,
  type NexoraResolvedDomainExperience,
} from "../lib/domain/domainExperienceRegistry";
import { resolveDomainDemo } from "../lib/demo/domainDemoRegistry";
import type { FragilityScanResponse } from "../types/fragilityScanner";
import { isLaunchDomain } from "../lib/product/mvpShippingPlan";

type FullRegistrarProps = {
  selectedIdRefLocal: React.MutableRefObject<string | null>;
  overridesRefLocal: React.MutableRefObject<Record<string, any>>;
  setOverrideRefLocal: React.MutableRefObject<(id: string, patch: any) => void>;
  onSelectedChange: (id: string | null) => void;
  bumpOverridesVersion: React.Dispatch<React.SetStateAction<number>>;
  clearAllOverridesRef: React.MutableRefObject<() => void>;
  pruneOverridesRef: React.MutableRefObject<(ids: string[]) => void>;
};

function FullRegistrar({
  selectedIdRefLocal,
  overridesRefLocal,
  setOverrideRefLocal,
  onSelectedChange,
  bumpOverridesVersion,
  clearAllOverridesRef,
  pruneOverridesRef,
}: FullRegistrarProps) {
  const selectedId = useSelectedId();
  const overrides = useOverrides();
  const setOverride = useSetOverride();
  const clearAll = useClearAllOverrides();
  const pruneTo = usePruneOverridesTo();

  const prevSelectedIdRef = useRef<string | null>(null);
  const lastOverridesKeyRef = useRef<string>("");

  useEffect(() => {
    if (prevSelectedIdRef.current === selectedId) return;
    prevSelectedIdRef.current = selectedId;
    onSelectedChange(selectedId);
    selectedIdRefLocal.current = selectedId;
  }, [selectedId, onSelectedChange, selectedIdRefLocal]);

  useEffect(() => {
    const obj = overrides && typeof overrides === "object" ? (overrides as any) : {};
    const ids = Object.keys(obj).sort();
    const nextKey = ids.map((id) => `${id}:${stableStringify(obj[id])}`).join("|");

    if (lastOverridesKeyRef.current === nextKey) return;

    lastOverridesKeyRef.current = nextKey;
    overridesRefLocal.current = overrides;
    if (typeof bumpOverridesVersion === "function") {
      bumpOverridesVersion((v) => v + 1);
    }
  }, [overrides, stableStringify, overridesRefLocal, bumpOverridesVersion]);

  useEffect(() => {
    setOverrideRefLocal.current = (id: string, patch: any) => setOverride(id, patch);
  }, [setOverride, setOverrideRefLocal]);

  useEffect(() => {
    clearAllOverridesRef.current = clearAll;
  }, [clearAll, clearAllOverridesRef]);

  useEffect(() => {
    pruneOverridesRef.current = pruneTo;
  }, [pruneTo, pruneOverridesRef]);

  return null;
}
const BACKEND_BASE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_BACKEND_URL) || "http://127.0.0.1:8000";

type BackendChatResponse = {
  ok?: boolean;
  reply?: string;
  active_mode?: string;
  source?: string | null;
  scene_json?: unknown;
  actions?: unknown;
  analysis_summary?: string | null;
  error?: { message?: string } | null;
  [key: string]: any;
};

function loadPrefsFromStorage(): ScenePrefs | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PREFS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      !parsed ||
      !(
        (parsed.theme === "day" || parsed.theme === "night" || parsed.theme === "stars") &&
        typeof parsed.starDensity === "number" &&
        typeof parsed.showGrid === "boolean" &&
        typeof parsed.showAxes === "boolean" &&
        (parsed.orbitMode === "auto" || parsed.orbitMode === "manual")
      )
    ) {
      return null;
    }
    const globalScale =
      typeof parsed.globalScale === "number" && Number.isFinite(parsed.globalScale)
        ? clamp(parsed.globalScale, 0.2, 2)
        : defaultPrefs.globalScale;
    const overridePolicy =
      parsed.overridePolicy === "keep" || parsed.overridePolicy === "clear" ? parsed.overridePolicy : "match";
    const shadowsEnabled =
      typeof parsed.shadowsEnabled === "boolean" ? parsed.shadowsEnabled : defaultPrefs.shadowsEnabled;
    return { ...(parsed as ScenePrefs), globalScale, overridePolicy, shadowsEnabled };
  } catch {
    return null;
  }
}

type RetailTriggerConfig = {
  id:
    | "supplier_delay"
    | "inventory_drop"
    | "demand_spike"
    | "price_increase"
    | "delivery_disruption"
    | "cash_pressure"
    | "customer_trust_drop"
    | "operational_bottleneck";
  tests: RegExp[];
  targets: string[];
  riskEdges: Array<{ from: string; to: string; base: number; delta: number }>;
  driverDelta: Partial<Record<"inventory_pressure" | "time_pressure" | "quality_risk", number>>;
  kpiRiskDelta: number;
  riskSummary: string;
  timelineSteps: [string, string, string];
  adviceAction: string;
  adviceImpact: string;
  adviceWhy: string;
};

const RETAIL_DEMO_ID = "retail_supply_chain_fragility";

const RETAIL_TRIGGER_CONFIGS: RetailTriggerConfig[] = [
  {
    id: "supplier_delay",
    tests: [/\bsupplier\b.*\bdelay\b/i, /\bdelay\b.*\bsupplier\b/i],
    targets: ["obj_supplier_1", "obj_delivery_1", "obj_delay_1", "obj_inventory_1"],
    riskEdges: [
      { from: "obj_supplier_1", to: "obj_delivery_1", base: 0.68, delta: 0.18 },
      { from: "obj_delay_1", to: "obj_delivery_1", base: 0.64, delta: 0.14 },
      { from: "obj_delivery_1", to: "obj_inventory_1", base: 0.58, delta: 0.12 },
      { from: "obj_inventory_1", to: "obj_customer_satisfaction_1", base: 0.48, delta: 0.08 },
    ],
    driverDelta: { inventory_pressure: 0.1, time_pressure: 0.16, quality_risk: 0.06 },
    kpiRiskDelta: 0.08,
    riskSummary: "Supplier delay is increasing operational risk and is now propagating into capacity and customer impact.",
    timelineSteps: [
      "Immediate: operational flow weakens.",
      "Near-term: capacity buffers tighten.",
      "Follow-up: customer commitments become harder to protect.",
    ],
    adviceAction: "Protect critical capacity and activate backup supply options.",
    adviceImpact: "Stabilizes core flow while reducing downstream customer and service risk.",
    adviceWhy: "Supplier latency is now the dominant source of business-system fragility.",
  },
  {
    id: "inventory_drop",
    tests: [/\binventory\b.*\bdrop\b/i, /\bdrop\b.*\binventory\b/i, /\binventory\b.*\bdecrease\b/i],
    targets: ["obj_inventory_1", "obj_warehouse_1", "obj_order_flow_1", "obj_customer_satisfaction_1"],
    riskEdges: [
      { from: "obj_inventory_1", to: "obj_order_flow_1", base: 0.6, delta: 0.14 },
      { from: "obj_inventory_1", to: "obj_customer_satisfaction_1", base: 0.56, delta: 0.12 },
      { from: "obj_order_flow_1", to: "obj_cash_pressure_1", base: 0.5, delta: 0.09 },
      { from: "obj_warehouse_1", to: "obj_order_flow_1", base: 0.47, delta: 0.07 },
    ],
    driverDelta: { inventory_pressure: 0.17, time_pressure: 0.08, quality_risk: 0.07 },
    kpiRiskDelta: 0.09,
    riskSummary: "Capacity pressure increased and is now stressing fulfillment flow, cash exposure, and customer outcomes.",
    timelineSteps: [
      "Immediate: capacity coverage declines.",
      "Near-term: fulfillment pressure increases.",
      "Follow-up: customer trust may weaken.",
    ],
    adviceAction: "Rebalance capacity and prioritize critical commitments.",
    adviceImpact: "Protects fulfillment reliability while containing customer-impact risk.",
    adviceWhy: "Capacity depletion is the most immediate bottleneck in the current business state.",
  },
  {
    id: "demand_spike",
    tests: [/\bdemand\b.*\bspike\b/i, /\bspike\b.*\bdemand\b/i],
    targets: ["obj_demand_1", "obj_order_flow_1", "obj_inventory_1", "obj_warehouse_1"],
    riskEdges: [
      { from: "obj_demand_1", to: "obj_order_flow_1", base: 0.63, delta: 0.16 },
      { from: "obj_order_flow_1", to: "obj_inventory_1", base: 0.58, delta: 0.12 },
      { from: "obj_inventory_1", to: "obj_warehouse_1", base: 0.54, delta: 0.09 },
      { from: "obj_order_flow_1", to: "obj_cash_pressure_1", base: 0.49, delta: 0.08 },
    ],
    driverDelta: { inventory_pressure: 0.14, time_pressure: 0.12, quality_risk: 0.05 },
    kpiRiskDelta: 0.07,
    riskSummary: "Demand volatility increased and is accelerating pressure across flow, capacity, and operations.",
    timelineSteps: [
      "Immediate: incoming demand rises.",
      "Near-term: capacity burns down faster.",
      "Follow-up: operational strain spreads across the system.",
    ],
    adviceAction: "Increase short-term capacity and monitor buffer burn.",
    adviceImpact: "Reduces service-level degradation during demand surges.",
    adviceWhy: "Demand shock is propagating through every core business flow node.",
  },
  {
    id: "price_increase",
    tests: [/\bprice\b.*\bincrease\b/i, /\bincrease\b.*\bprice\b/i, /\bprice\b.*\brise\b/i, /\bprice\b.*\bpressure\b/i, /\bpressure\b.*\bprice\b/i],
    targets: ["obj_price_1", "obj_demand_1", "obj_cash_pressure_1", "obj_customer_satisfaction_1"],
    riskEdges: [
      { from: "obj_price_1", to: "obj_demand_1", base: 0.62, delta: 0.13 },
      { from: "obj_price_1", to: "obj_cash_pressure_1", base: 0.6, delta: 0.15 },
      { from: "obj_demand_1", to: "obj_customer_satisfaction_1", base: 0.52, delta: 0.08 },
      { from: "obj_cash_pressure_1", to: "obj_customer_satisfaction_1", base: 0.44, delta: 0.07 },
    ],
    driverDelta: { inventory_pressure: 0.06, time_pressure: 0.05, quality_risk: 0.09 },
    kpiRiskDelta: 0.08,
    riskSummary: "Pricing pressure increased and is raising demand sensitivity, cash pressure, and customer-retention risk.",
    timelineSteps: [
      "Immediate: pricing pressure rises.",
      "Near-term: demand sensitivity changes.",
      "Follow-up: margin and cash pressure become visible.",
    ],
    adviceAction: "Assess margin exposure and prepare pricing and communication scenarios.",
    adviceImpact: "Protects revenue stability while reducing customer churn risk.",
    adviceWhy: "Price shock is now a cross-functional risk driver for business performance.",
  },
  {
    id: "delivery_disruption",
    tests: [/\bdelivery\b.*\bdisruption\b/i, /\bdisruption\b.*\bdelivery\b/i, /\bdelivery\b.*\bbreakdown\b/i],
    targets: ["obj_delivery_1", "obj_delay_1", "obj_inventory_1", "obj_order_flow_1"],
    riskEdges: [
      { from: "obj_delivery_1", to: "obj_inventory_1", base: 0.64, delta: 0.16 },
      { from: "obj_delay_1", to: "obj_delivery_1", base: 0.66, delta: 0.16 },
      { from: "obj_inventory_1", to: "obj_order_flow_1", base: 0.58, delta: 0.11 },
      { from: "obj_order_flow_1", to: "obj_customer_satisfaction_1", base: 0.5, delta: 0.1 },
    ],
    driverDelta: { inventory_pressure: 0.12, time_pressure: 0.18, quality_risk: 0.06 },
    kpiRiskDelta: 0.09,
    riskSummary: "Operational flow disruption increased execution risk and is now propagating into capacity and fulfillment reliability.",
    timelineSteps: [
      "Immediate: execution flow weakens.",
      "Near-term: operations and capacity coordination suffer.",
      "Follow-up: customer-facing delays become visible.",
    ],
    adviceAction: "Stabilize execution flow and reroute critical work.",
    adviceImpact: "Contains disruption propagation and protects high-priority commitments.",
    adviceWhy: "Operational flow is the most exposed control point in the current business system.",
  },
  {
    id: "cash_pressure",
    tests: [/\bcash\b.*\bpressure\b/i, /\bpressure\b.*\bcash\b/i],
    targets: ["obj_cash_pressure_1", "obj_order_flow_1", "obj_price_1", "obj_customer_satisfaction_1"],
    riskEdges: [
      { from: "obj_cash_pressure_1", to: "obj_order_flow_1", base: 0.52, delta: 0.12 },
      { from: "obj_price_1", to: "obj_cash_pressure_1", base: 0.58, delta: 0.11 },
      { from: "obj_order_flow_1", to: "obj_customer_satisfaction_1", base: 0.46, delta: 0.08 },
    ],
    driverDelta: { inventory_pressure: 0.05, time_pressure: 0.08, quality_risk: 0.12 },
    kpiRiskDelta: 0.08,
    riskSummary: "Cash pressure is tightening decision room and is now threatening service continuity and customer confidence.",
    timelineSteps: [
      "Immediate: financial flexibility narrows.",
      "Near-term: operational trade-offs become harder.",
      "Follow-up: customer trust and growth options weaken.",
    ],
    adviceAction: "Protect liquidity, prioritize critical commitments, and reduce non-essential load.",
    adviceImpact: "Preserves operating stability while containing avoidable downstream risk.",
    adviceWhy: "Cash pressure is turning operational strain into a strategic constraint.",
  },
  {
    id: "customer_trust_drop",
    tests: [/\bcustomer\b.*\btrust\b.*\bdrop\b/i, /\btrust\b.*\bdrop\b/i, /\bcustomer\b.*\btrust\b/i],
    targets: ["obj_customer_satisfaction_1", "obj_order_flow_1", "obj_delivery_1", "obj_cash_pressure_1"],
    riskEdges: [
      { from: "obj_order_flow_1", to: "obj_customer_satisfaction_1", base: 0.5, delta: 0.11 },
      { from: "obj_delivery_1", to: "obj_customer_satisfaction_1", base: 0.52, delta: 0.1 },
      { from: "obj_customer_satisfaction_1", to: "obj_cash_pressure_1", base: 0.42, delta: 0.08 },
    ],
    driverDelta: { inventory_pressure: 0.04, time_pressure: 0.07, quality_risk: 0.13 },
    kpiRiskDelta: 0.08,
    riskSummary: "Customer trust is weakening and is now feeding back into revenue pressure, execution risk, and strategic resilience.",
    timelineSteps: [
      "Immediate: customer confidence slips.",
      "Near-term: service and retention pressure rise together.",
      "Follow-up: commercial and strategic options narrow.",
    ],
    adviceAction: "Protect key customer commitments and address the root service failure quickly.",
    adviceImpact: "Limits trust erosion while protecting revenue and operating credibility.",
    adviceWhy: "Customer trust is a lagging outcome that quickly becomes a strategic risk multiplier.",
  },
  {
    id: "operational_bottleneck",
    tests: [/\boperational\b.*\bbottleneck\b/i, /\bbottleneck\b/i],
    targets: ["obj_delivery_1", "obj_warehouse_1", "obj_order_flow_1", "obj_inventory_1"],
    riskEdges: [
      { from: "obj_delivery_1", to: "obj_order_flow_1", base: 0.54, delta: 0.12 },
      { from: "obj_warehouse_1", to: "obj_order_flow_1", base: 0.51, delta: 0.11 },
      { from: "obj_order_flow_1", to: "obj_inventory_1", base: 0.49, delta: 0.08 },
    ],
    driverDelta: { inventory_pressure: 0.09, time_pressure: 0.14, quality_risk: 0.07 },
    kpiRiskDelta: 0.08,
    riskSummary: "An operational bottleneck is constraining throughput and is now increasing pressure across flow, capacity, and customer outcomes.",
    timelineSteps: [
      "Immediate: throughput slows.",
      "Near-term: backlogs build across dependent work.",
      "Follow-up: customer and financial pressure become harder to contain.",
    ],
    adviceAction: "Relieve the bottleneck, re-sequence critical work, and protect downstream commitments.",
    adviceImpact: "Restores flow control while preventing broader business disruption.",
    adviceWhy: "A constrained operating node can quickly become the system's dominant risk source.",
  },
];

function normalizeTextForRetail(text: string): string {
  return String(text || "").toLowerCase().trim();
}

function detectRetailTriggerConfig(text: string): RetailTriggerConfig | null {
  const t = normalizeTextForRetail(text);
  for (const cfg of RETAIL_TRIGGER_CONFIGS) {
    if (cfg.tests.some((rx) => rx.test(t))) return cfg;
  }
  return null;
}

function isRetailScenePayload(payload: any, fallbackScene: SceneJson | null): boolean {
  const metaDemoId =
    String(payload?.scene_json?.meta?.demo_id ?? payload?.meta?.demo_id ?? fallbackScene?.meta?.demo_id ?? "")
      .toLowerCase()
      .trim();
  if (metaDemoId === RETAIL_DEMO_ID) return true;
  const objs =
    (Array.isArray(payload?.scene_json?.scene?.objects) ? payload.scene_json.scene.objects : null) ??
    (Array.isArray(fallbackScene?.scene?.objects) ? fallbackScene?.scene?.objects : null) ??
    [];
  const ids = new Set(
    (objs as any[])
      .map((o) => String(o?.id ?? ""))
      .filter(Boolean)
  );
  return ids.has("obj_supplier_1") && ids.has("obj_inventory_1") && ids.has("obj_delivery_1");
}

function upsertRiskEdge(
  edges: any[],
  from: string,
  to: string,
  base: number,
  delta: number
): any[] {
  const next = Array.isArray(edges) ? edges.map((e) => ({ ...e })) : [];
  const idx = next.findIndex((e) => String(e?.from ?? "") === from && String(e?.to ?? "") === to);
  const prev = idx >= 0 ? Number(next[idx]?.weight ?? base) : base;
  const weight = clamp(prev + delta, 0, 0.95);
  if (idx >= 0) {
    next[idx] = { ...next[idx], from, to, weight };
  } else {
    next.push({ from, to, weight });
  }
  return next;
}

function normalizePromptText(text: string): string {
  return String(text || "").toLowerCase().trim();
}

function tokenizePrompt(text: string): string[] {
  return tokenizeSemanticText(normalizePromptText(text)).filter((t) => t.length >= 3);
}

function summarizePropagationPath(labels: string[]): string {
  if (!labels.length) return "the relevant dependency chain";
  if (labels.length === 1) return labels[0];
  return labels.slice(0, 3).join(" -> ");
}

function getSemanticRole(obj: any): string {
  return String(getObjectSemanticMeta(obj)?.role ?? obj?.role ?? "").trim();
}

function roleStage(role: string): number {
  if (role === "risk_source") return 0;
  if (role === "core_system_node") return 1;
  if (role === "flow_node" || role === "operational_node" || role === "support_node") return 2;
  if (role === "buffer_node") return 3;
  if (role === "strategic_node" || role === "kpi_sensitive_node") return 4;
  if (role === "downstream_impact_node" || role === "customer_or_outcome_node") return 5;
  return 6;
}

function orderObjectsForPropagation(objects: any[]): any[] {
  return [...objects].sort((a, b) => {
    const stageDelta = roleStage(getSemanticRole(a)) - roleStage(getSemanticRole(b));
    if (stageDelta !== 0) return stageDelta;
    return getObjectDisplayLabel(a).localeCompare(getObjectDisplayLabel(b));
  });
}

function buildGenericRiskSummary(args: { primaryRole: string; matchedNames: string[]; matchedDependencies: string[] }): string {
  const primary = args.matchedNames[0] ?? "the primary node";
  const secondary = args.matchedNames[1] ?? args.matchedDependencies[0] ?? "connected operations";
  if (args.primaryRole === "risk_source") {
    return `${primary} is the leading source of system stress, and pressure is now moving into ${secondary}.`;
  }
  if (args.primaryRole === "buffer_node") {
    return `${primary} is losing protective capacity, making ${secondary} more fragile.`;
  }
  if (args.primaryRole === "flow_node" || args.primaryRole === "operational_node") {
    return `${primary} is becoming a flow constraint, and stress is spreading into ${secondary}.`;
  }
  if (args.primaryRole === "strategic_node" || args.primaryRole === "kpi_sensitive_node") {
    return `${primary} is becoming a strategic pressure point, with likely spillover into ${secondary}.`;
  }
  if (args.primaryRole === "customer_or_outcome_node" || args.primaryRole === "downstream_impact_node") {
    return `${primary} is already showing downstream impact, signalling broader fragility in ${secondary}.`;
  }
  return `${primary} is the main pressure point, and stress is beginning to spread into ${secondary}.`;
}

function buildGenericTimelineSteps(args: { primaryRole: string; matchedNames: string[]; matchedDependencies: string[] }): [string, string, string] {
  const primary = args.matchedNames[0] ?? "the primary node";
  const secondary = args.matchedNames[1] ?? args.matchedDependencies[0] ?? "connected operations";
  const tertiary =
    args.matchedNames[2] ?? args.matchedDependencies[1] ?? args.matchedNames[1] ?? "downstream outcomes";
  if (args.primaryRole === "risk_source") {
    return [
      `Immediate: disruption starts at ${primary}.`,
      `Near-term: operational stress spreads into ${secondary}.`,
      `Follow-up: ${tertiary} becomes harder to protect.`,
    ];
  }
  if (args.primaryRole === "buffer_node") {
    return [
      `Immediate: resilience weakens at ${primary}.`,
      `Near-term: pressure reaches ${secondary}.`,
      `Follow-up: ${tertiary} loses stability.`,
    ];
  }
  if (args.primaryRole === "customer_or_outcome_node" || args.primaryRole === "downstream_impact_node") {
    return [
      `Immediate: ${primary} shows visible strain.`,
      `Near-term: ${secondary} requires containment.`,
      `Follow-up: ${tertiary} becomes a broader business concern.`,
    ];
  }
  return [
    `Immediate: pressure appears at ${primary}.`,
    `Near-term: impact spreads into ${secondary}.`,
    `Follow-up: ${tertiary} becomes harder to stabilize.`,
  ];
}

function buildGenericAdvice(args: { primaryRole: string; matchedNames: string[]; matchedSemanticTags: string[] }) {
  const primary = args.matchedNames[0] ?? "the exposed node";
  const secondary = args.matchedNames[1] ?? "the connected flow";
  const hasRiskTag = args.matchedSemanticTags.some((tag) => /risk|pressure|fragility/i.test(tag));
  if (args.primaryRole === "risk_source") {
    return {
      action: `Contain ${primary} and protect ${secondary}.`,
      impact: "Reduces the chance that upstream disruption spreads across the system.",
      why: `${primary} is the clearest source of current fragility.`,
    };
  }
  if (args.primaryRole === "buffer_node") {
    return {
      action: `Protect ${primary} and rebuild resilience around ${secondary}.`,
      impact: "Restores shock absorption before downstream performance degrades further.",
      why: `${primary} is the system's main protective buffer in this scenario.`,
    };
  }
  if (args.primaryRole === "customer_or_outcome_node" || args.primaryRole === "downstream_impact_node") {
    return {
      action: `Protect ${primary} and address the upstream driver in ${secondary}.`,
      impact: "Contains visible impact while reducing the source of recurring damage.",
      why: `${primary} signals that the system is already leaking value to the customer side.`,
    };
  }
  if (args.primaryRole === "strategic_node" || args.primaryRole === "kpi_sensitive_node") {
    return {
      action: `Stabilize ${primary} and reduce pressure on ${secondary}.`,
      impact: "Prevents operational strain from turning into a larger business constraint.",
      why: `${primary} is now a business-level pressure node, not just an operational signal.`,
    };
  }
  return {
    action: `Protect ${primary} and stabilize ${secondary}.`,
    impact: hasRiskTag
      ? "Contains current pressure before it spreads across the system."
      : "Reduces propagation risk while preserving system continuity.",
    why: `${primary} is currently the clearest leverage point for limiting downstream disruption.`,
  };
}

function buildReadableDemoReply(args: {
  riskSummary: string;
  timelineSteps: string[];
  action: string;
  matchedNames?: string[];
}): string {
  const matched = Array.isArray(args.matchedNames) ? args.matchedNames.filter(Boolean) : [];
  const focusText =
    matched.length >= 2
      ? `Focus areas: ${matched.slice(0, 2).join(" and ")}. `
      : matched.length === 1
      ? `Focus area: ${matched[0]}. `
      : "";
  const [immediate, nearTerm, followUp] = Array.isArray(args.timelineSteps) ? args.timelineSteps : [];
  return [
    `${focusText}Risk: ${args.riskSummary}`,
    `Timeline: ${immediate ?? ""} ${nearTerm ?? ""} ${followUp ?? ""}`.trim(),
    `Recommended action: ${args.action}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function buildExecutiveSummarySurface(args: {
  matchedNames?: string[];
  primaryRole?: string;
  riskSummary?: string;
  timelineSteps?: string[];
  adviceAction?: string;
  adviceWhy?: string;
  domainLabel?: string;
  framingStyle?: "systemic" | "operational" | "financial" | "resilience" | "strategic";
}): { happened: string; why_it_matters: string; what_to_do: string; summary: string } {
  const matched = Array.isArray(args.matchedNames) ? args.matchedNames.filter(Boolean) : [];
  const primary = matched[0] ?? "The primary node";
  const secondary = matched[1] ?? "connected operations";
  const followUp = Array.isArray(args.timelineSteps) ? String(args.timelineSteps[2] ?? "").trim() : "";
  const adviceAction = String(args.adviceAction ?? "Protect the exposed node and stabilize the system.").trim();
  const riskSummary = String(args.riskSummary ?? "").trim() || `${primary} is now under pressure.`;
  const framingStyle = String(args.framingStyle ?? "systemic").trim();
  const domainLabel = String(args.domainLabel ?? "system").trim() || "system";

  let happened = riskSummary;
  let whyItMatters =
    followUp || `${primary} is connected to dependent operations, so the disruption is becoming systemic.`;

  if (args.primaryRole === "risk_source") {
    happened = `${primary} is now stressing ${secondary}.`;
    whyItMatters = followUp || "The disruption is no longer isolated; it is spreading into core operations.";
  } else if (args.primaryRole === "buffer_node") {
    happened = `${primary} is weakening and can no longer absorb pressure cleanly.`;
    whyItMatters = followUp || "If buffer capacity erodes further, downstream service and customer risk will rise.";
  } else if (args.primaryRole === "strategic_node" || args.primaryRole === "kpi_sensitive_node") {
    happened = `${primary} is becoming a broader business constraint.`;
    whyItMatters = followUp || "This matters because financial and operating pressure are now reinforcing each other.";
  } else if (args.primaryRole === "customer_or_outcome_node" || args.primaryRole === "downstream_impact_node") {
    happened = `${primary} is already showing visible downstream impact.`;
    whyItMatters = followUp || "This matters because customer-facing impact usually signals a wider system failure.";
  }

  if (framingStyle === "financial") {
    happened = `${primary} is increasing financial exposure across the ${domainLabel.toLowerCase()} system.`;
    whyItMatters = followUp || "This matters because liquidity, downside risk, and concentration can reinforce each other quickly.";
  } else if (framingStyle === "resilience") {
    happened = `${primary} is weakening service resilience across connected dependencies.`;
    whyItMatters = followUp || "This matters because localized failures can propagate into broader reliability loss.";
  } else if (framingStyle === "strategic") {
    happened = `${primary} is shifting the strategic position and response space.`;
    whyItMatters = followUp || "This matters because pressure is now shaping competitive choices, not just local execution.";
  } else if (framingStyle === "operational") {
    happened = `${primary} is pressuring core operations in the ${domainLabel.toLowerCase()} system.`;
    whyItMatters = followUp || "This matters because operational pressure is moving from one node into wider business continuity risk.";
  }

  const actionLead =
    framingStyle === "strategic"
      ? "Recommended strategic response"
      : framingStyle === "financial"
      ? "Recommended financial action"
      : framingStyle === "resilience"
      ? "Recommended resilience action"
      : "Recommended action";
  const whatToDo = `${actionLead}: ${adviceAction}`;
  const summary = `${happened} ${whyItMatters} ${whatToDo}`.trim();
  return {
    happened,
    why_it_matters: whyItMatters,
    what_to_do: whatToDo,
    summary,
  };
}

function applyGenericPromptFeedbackEnhancement(
  rawPayload: any,
  userText: string,
  fallbackScene: SceneJson | null,
  modeContext?: ActiveModeContext | null,
  reasoningHints?: {
    workspaceId?: string;
    selectedObjectId?: string | null;
    memoryState?: any;
    environmentConfig?: EnvironmentConfig | null;
  }
): any {
  if (!rawPayload || typeof rawPayload !== "object") return rawPayload;

  const objects = getSceneObjectsFromPayload(rawPayload, fallbackScene);
  const matched = matchObjectsFromPrompt(userText, objects, 3);
  const matchedIds = matched.map((m) => m.id);
  if (!matchedIds.length) return rawPayload;

  const next: any = { ...rawPayload };
  const matchedObjects = matchedIds
    .map((id) => objects.find((o: any) => String(o?.id ?? o?.name ?? "") === id))
    .filter(Boolean);
  const orderedMatchedObjects = orderObjectsForPropagation(matchedObjects);
  const matchedNames = orderedMatchedObjects.map((o: any) => getObjectDisplayLabel(o));
  const matchedTopics = tokenizePrompt(userText).slice(0, 5);
  const matchedSemanticTags = Array.from(
    new Set(
      orderedMatchedObjects
        .flatMap((o: any) => getObjectSemanticTags(o))
        .map((x: any) => String(x || "").trim())
        .filter(Boolean)
    )
  ).slice(0, 5);
  const matchedDependencies = Array.from(
    new Set(orderedMatchedObjects.flatMap((o: any) => getObjectDependencies(o)))
  ).slice(0, 5);
  const primaryRole = getSemanticRole(orderedMatchedObjects[0]);
  const propagationPath = summarizePropagationPath([...matchedNames, ...matchedDependencies]);

  const baseSelection =
    (next?.object_selection && typeof next.object_selection === "object" ? next.object_selection : null) ??
    (next?.scene_json?.object_selection && typeof next.scene_json.object_selection === "object"
      ? next.scene_json.object_selection
      : null) ??
    {};
  const priorHighlights = Array.isArray(baseSelection?.highlighted_objects) ? baseSelection.highlighted_objects : [];
  const orderedMatchedIds = orderedMatchedObjects.map((o: any) => String(o?.id ?? o?.name ?? ""));
  const highlighted = Array.from(new Set([...orderedMatchedIds, ...priorHighlights])).slice(0, 4);
  next.object_selection = {
    ...baseSelection,
    highlighted_objects: highlighted,
    ranked_objects: matched.map((item) => ({ id: item.id, score: Number((item.score / 10).toFixed(2)) })),
  };

  const baseRisk =
    (next?.risk_propagation && typeof next.risk_propagation === "object" ? next.risk_propagation : null) ??
    (next?.scene_json?.risk_propagation && typeof next.scene_json.risk_propagation === "object"
      ? next.scene_json.risk_propagation
      : null) ??
    (next?.scene_json?.scene?.risk_propagation && typeof next.scene_json.scene.risk_propagation === "object"
      ? next.scene_json.scene.risk_propagation
      : null) ??
    {};
  const priorSources = Array.isArray(baseRisk?.sources) ? baseRisk.sources : [];
  const riskSources = Array.from(new Set([...priorSources, ...orderedMatchedIds]));
  const riskSummary = buildGenericRiskSummary({ primaryRole, matchedNames, matchedDependencies });
  next.risk_propagation = {
    ...baseRisk,
    sources: riskSources.slice(0, 3),
    path: propagationPath,
    summary:
      typeof baseRisk?.summary === "string" && baseRisk.summary.trim().length > 20
        ? baseRisk.summary
        : riskSummary,
  };

  const timelineSteps = buildGenericTimelineSteps({ primaryRole, matchedNames, matchedDependencies });
  next.timeline_impact = {
    trigger: "generic_prompt_feedback",
    immediate: timelineSteps[0],
    near_term: timelineSteps[1],
    follow_up: timelineSteps[2],
    steps: timelineSteps,
    path: propagationPath,
  };

  const baseAdvice =
    (next?.strategic_advice && typeof next.strategic_advice === "object" ? next.strategic_advice : null) ??
    (next?.scene_json?.strategic_advice && typeof next.scene_json.strategic_advice === "object"
      ? next.scene_json.strategic_advice
      : null) ??
    {};
  const genericAdvice = buildGenericAdvice({ primaryRole, matchedNames, matchedSemanticTags });
  const genericAction = {
    id: `generic_${matchedIds[0] ?? "node"}`,
    type: "generic_response",
    action: genericAdvice.action,
    targets: orderedMatchedIds,
    impact: genericAdvice.impact,
    priority: 1,
  };
  const existingActions = Array.isArray(baseAdvice?.recommended_actions) ? baseAdvice.recommended_actions : [];
  next.strategic_advice = {
    ...baseAdvice,
    primary_recommendation: genericAction,
    recommended_actions: [genericAction, ...existingActions.filter((action: any) => action?.action !== genericAction.action)].slice(0, 3),
    why: genericAdvice.why,
    summary: `Recommended action: ${genericAction.action}`,
    confidence: Number.isFinite(Number(baseAdvice?.confidence)) ? Number(baseAdvice.confidence) : 0.72,
  };

  next.reply = buildReadableDemoReply({
    riskSummary: next.risk_propagation?.summary ?? riskSummary,
    timelineSteps,
    action: next.strategic_advice?.primary_recommendation?.action ?? genericAction.action,
    matchedNames,
  });
  const executiveSummarySurface = buildExecutiveSummarySurface({
    matchedNames,
    primaryRole,
    riskSummary: next.risk_propagation?.summary ?? riskSummary,
    timelineSteps,
    adviceAction: next.strategic_advice?.primary_recommendation?.action ?? genericAction.action,
    adviceWhy: next.strategic_advice?.why ?? genericAdvice.why,
    domainLabel: modeContext?.project_domain ?? "system",
    framingStyle: "systemic",
  });
  next.executive_summary_surface = executiveSummarySurface;
  next.analysis_summary = executiveSummarySurface.summary;

  const projectId = String(
    next?.scene_json?.meta?.project_id ??
      next?.scene_json?.meta?.demo_id ??
      fallbackScene?.meta?.project_id ??
      fallbackScene?.meta?.demo_id ??
      "default"
  );
  const relationList = Array.isArray(next?.scene_json?.scene?.relations)
    ? next.scene_json.scene.relations
    : [];
  const simInput = createSimulationInputFromPrompt({
    text: userText,
    matchedObjectIds: matchedIds,
    topics: matchedTopics,
    kind: "decision",
    magnitude: 0.62,
    metadata: { source: "prompt_feedback_generic" },
  });
  const decisionSimulation = buildSimulationResult({
    projectId,
    scenarioName: `Prompt Scenario: ${userText}`,
    input: simInput,
    objects: objects as any[],
    relations: relationList as any[],
    riskSummary: next.risk_propagation?.summary ?? riskSummary,
    timelineSteps,
    recommendation: next.strategic_advice?.primary_recommendation?.action ?? genericAction.action,
    confidence: Number(next?.strategic_advice?.confidence ?? 0.72),
    affectedDimensions: ["dependency_stability", "operational_pressure", ...matchedSemanticTags].slice(0, 4),
  });
  next.decision_simulation = decisionSimulation;
  const scenarioSnapshot = createScenarioSnapshot({
    projectId,
    simulation: decisionSimulation,
    sceneJson: (next?.scene_json as SceneJson | undefined) ?? fallbackScene ?? null,
    semanticObjectMeta: orderedMatchedObjects.reduce((acc: Record<string, any>, o: any) => {
      const oid = String(o?.id ?? o?.name ?? "").trim();
      if (!oid) return acc;
      acc[oid] = o?.semantic ?? {
        category: o?.category,
        role: o?.role,
        domain: o?.domain,
        tags: Array.isArray(o?.tags) ? o.tags : undefined,
      };
      return acc;
    }, {}),
    baselineRef: decisionSimulation?.comparisonReady?.baseline?.scenarioId
      ? {
          projectId,
          scenarioId: String(decisionSimulation.comparisonReady.baseline.scenarioId),
          timestamp: Date.now(),
          name: "Baseline",
        }
      : null,
  });
  const replaySequence = buildReplaySequence(scenarioSnapshot);
  const scenarioComparison = compareScenarioSnapshots({
    baseline: null,
    current: scenarioSnapshot,
    mode: "baseline_vs_impacted",
  });
  const semanticMetaById = orderedMatchedObjects.reduce(
    (acc: Record<string, { role?: string; category?: string; domain?: string }>, o: any) => {
      const id = String(o?.id ?? o?.name ?? "").trim();
      if (!id) return acc;
      acc[id] = {
        role: String(o?.semantic?.role ?? o?.role ?? "").trim() || undefined,
        category: String(o?.semantic?.category ?? o?.category ?? "").trim() || undefined,
        domain: String(o?.semantic?.domain ?? o?.domain ?? "").trim() || undefined,
      };
      return acc;
    },
    {}
  );
  const executiveInsight = buildExecutiveInsightFromSimulation({
    simulation: decisionSimulation,
    comparison: scenarioComparison,
    semanticMetaById,
  });
  const strategyKpiContext = buildStrategyKpiContext({
    simulation: decisionSimulation,
    comparison: scenarioComparison,
    objects: objects as any[],
    semanticObjectMeta: orderedMatchedObjects.reduce((acc: Record<string, any>, o: any) => {
      const oid = String(o?.id ?? o?.name ?? "").trim();
      if (!oid) return acc;
      acc[oid] = o?.semantic ?? {};
      return acc;
    }, {}),
    domain: String((next?.scene_json as any)?.meta?.domain ?? (fallbackScene as any)?.meta?.domain ?? "").trim() || undefined,
  });
  const executiveInsightWithStrategy = {
    ...executiveInsight,
    summary: executiveSummarySurface.summary,
    explanation_notes: Array.from(
      new Set([
        executiveSummarySurface.happened,
        executiveSummarySurface.why_it_matters,
        ...(Array.isArray(executiveInsight?.explanation_notes) ? executiveInsight.explanation_notes : []),
        ...buildStrategyAwareExecutiveNotes({
          strategy: strategyKpiContext.strategy,
          summary: strategyKpiContext.summary,
        }),
      ])
    ),
    comparison_insights: Array.from(
      new Set([
        ...(Array.isArray(executiveInsight?.comparison_insights) ? executiveInsight.comparison_insights : []),
        ...(strategyKpiContext.comparison?.notes ?? []),
      ])
    ),
  };
  next.decision_scenario_snapshot = scenarioSnapshot;
  next.decision_replay = replaySequence;
  next.decision_comparison = scenarioComparison;
  next.executive_insight = executiveInsightWithStrategy;
  next.strategy_kpi = {
    ...strategyKpiContext,
    generated_from: "generic_prompt_feedback",
  };
  const decisionCockpit = buildDecisionCockpitState({
    workspaceId: "default_workspace",
    projectId,
    projectName: String((next?.scene_json as any)?.meta?.project_name ?? "").trim() || undefined,
    projectDomain: String((next?.scene_json as any)?.meta?.domain ?? "").trim() || undefined,
    sceneJson: ((next?.scene_json as SceneJson | undefined) ?? fallbackScene ?? null) as SceneJson | null,
    payload: next,
    selectedObjectId: null,
    selectedObjectLabel: null,
    focusMode: "all",
    focusPinned: false,
    activeLoopId: String((next?.scene_json as any)?.scene?.active_loop ?? "").trim() || null,
    memoryState: null,
    modeContext: modeContext ?? undefined,
  });
  next.decision_cockpit = decisionCockpit;
  next.decision_cockpit = {
    ...decisionCockpit,
    executive: {
      ...decisionCockpit.executive,
      summary: executiveSummarySurface.summary,
      happened: executiveSummarySurface.happened,
      why_it_matters: executiveSummarySurface.why_it_matters,
      what_to_do: executiveSummarySurface.what_to_do,
    },
  };
  if (modeContext) {
    next.product_mode = modeContext;
  }
  const memoryObjects = reasoningHints?.memoryState?.objects ?? {};
  const volatileNodes = Object.entries(memoryObjects)
    .filter(([, value]: any) => Number(value?.volatility ?? 0) >= 0.35)
    .map(([id]) => id)
    .slice(0, 5);
  const recurringPatterns = Object.keys(reasoningHints?.memoryState?.loops ?? {}).slice(0, 5);
  const reasoningInput = createReasoningInput({
    prompt: userText,
    context: {
      workspace_id: reasoningHints?.workspaceId,
      project_id: projectId,
      project_domain:
        String((next?.scene_json as any)?.meta?.domain ?? (fallbackScene as any)?.meta?.domain ?? "").trim() || undefined,
      selected_object_id: reasoningHints?.selectedObjectId ?? null,
      active_mode: modeContext ?? null,
      memory_signals: {
        volatile_nodes: volatileNodes,
        recurring_patterns: recurringPatterns,
      },
      scanner_context:
        next?.scanner && typeof next.scanner === "object"
          ? {
              source_type: String(next?.scanner?.lastSource?.type ?? "").trim() || undefined,
              source_id: String(next?.scanner?.lastSource?.id ?? "").trim() || undefined,
              confidence: Number.isFinite(Number(next?.scanner?.confidence))
                ? Number(next?.scanner?.confidence)
                : undefined,
            }
          : undefined,
    },
    semanticObjects: objects as any[],
    simulationContext: {
      baseline_available: !!scenarioComparison?.baselineReady?.baselineAvailable,
      active_scenario_id: String(decisionSimulation?.scenario?.id ?? "").trim() || undefined,
    },
    strategyContext: {
      at_risk_kpis: strategyKpiContext?.summary?.at_risk_kpis ?? [],
      threatened_objectives: strategyKpiContext?.summary?.threatened_objectives ?? [],
    },
  });
  const aiReasoning = buildReasoningOutput(reasoningInput);
  next.ai_reasoning = aiReasoning;
  const multiAgentEnabled = isFeatureEnabled(reasoningHints?.environmentConfig, "multi_agent");
  const multiAgentDecision = multiAgentEnabled
    ? orchestrateMultiAgentDecision({
        context: {
          workspace_id: reasoningHints?.workspaceId,
          project_id: projectId,
          project_domain:
            String((next?.scene_json as any)?.meta?.domain ?? (fallbackScene as any)?.meta?.domain ?? "").trim() ||
            undefined,
          prompt: userText,
          selected_object_id: reasoningHints?.selectedObjectId ?? null,
          mode_context: modeContext ?? null,
          matched_object_ids: matchedIds,
          semantic_signals: {
            tags: matchedSemanticTags,
            dependencies: matchedDependencies,
          },
          reasoning: aiReasoning,
          simulation: decisionSimulation,
          comparison: scenarioComparison,
          strategy: strategyKpiContext?.strategy ?? null,
          memory: {
            volatile_nodes: volatileNodes,
            recurring_patterns: recurringPatterns,
          },
          scanner:
            next?.scanner && typeof next.scanner === "object"
              ? {
                  source_type: String(next?.scanner?.lastSource?.type ?? "").trim() || undefined,
                  confidence: Number.isFinite(Number(next?.scanner?.confidence))
                    ? Number(next?.scanner?.confidence)
                    : undefined,
                  unresolved_items: Array.isArray(next?.scanner?.unresolvedItems) ? next.scanner.unresolvedItems : [],
                }
              : null,
          exploration:
            next?.autonomous_exploration && typeof next.autonomous_exploration === "object"
              ? {
                  fragile_object_ids: Array.isArray(next?.autonomous_exploration?.summary?.fragile_object_ids)
                    ? next.autonomous_exploration.summary.fragile_object_ids
                    : [],
                  highest_severity: Number.isFinite(Number(next?.autonomous_exploration?.summary?.highest_severity))
                    ? Number(next.autonomous_exploration.summary.highest_severity)
                    : undefined,
                  mitigation_ideas: Array.isArray(next?.autonomous_exploration?.summary?.top_mitigation_ideas)
                    ? next.autonomous_exploration.summary.top_mitigation_ideas
                    : [],
                }
              : null,
        },
      })
    : {
        plan: {
          mode: "single_path",
          selected_agents: [],
          reason: "Multi-agent disabled by environment capability flags.",
        },
        contributions: [],
        merged: {
          findings: [],
          matched_objects: matchedIds.slice(0, 6),
          scenario_suggestions: [],
          recommendations: [],
          explanation_notes: [],
        },
        conflicts: [],
        consensus: {
          agreement_topics: [],
          disagreement_topics: [],
          unresolved_ambiguities: ["Multi-agent path disabled in current environment."],
          merged_confidence: aiReasoning?.confidence?.score ?? 0.5,
        },
        trace: {
          invoked_count: 0,
          agent_order: [],
        },
      };
  next.multi_agent_decision = multiAgentDecision;
  const platformAssembly = buildPlatformAssemblyState({
    workspaceId: reasoningHints?.workspaceId ?? "default_workspace",
    projectId,
    projectName: String((next?.scene_json as any)?.meta?.project_name ?? "").trim() || undefined,
    projectDomain:
      String((next?.scene_json as any)?.meta?.domain ?? (fallbackScene as any)?.meta?.domain ?? "").trim() || undefined,
    selectedObjectId: reasoningHints?.selectedObjectId ?? null,
    focusMode: (modeContext?.detail_profile?.object_detail === "minimal" ? "all" : "selected") as "all" | "selected",
    modeContext: modeContext ?? null,
    reasoning: aiReasoning,
    simulation: decisionSimulation,
    comparison: scenarioComparison,
    replay: replaySequence,
    executive: executiveInsightWithStrategy,
    strategy: strategyKpiContext?.strategy ?? null,
    cockpit: decisionCockpit,
    memory: {
      volatile_nodes: volatileNodes,
      recurring_patterns: recurringPatterns,
    },
    theme: String((next?.scene_json as any)?.meta?.theme ?? "night"),
    environmentConfig: reasoningHints?.environmentConfig ?? null,
  });
  next.platform_assembly = platformAssembly;
  const governanceContext = buildProjectGovernanceContext({
    workspace_id: reasoningHints?.workspaceId ?? "default_workspace",
    project_id: projectId,
    project_status: modeContext?.mode_id === "demo" ? "experimental" : "draft",
    scenario_status: "draft",
    recommendation_status: "review",
    governance: {
      trusted_source_classification:
        next?.scanner || next?.external_integration ? "mixed" : "trusted",
      role_intent_hints: [String(modeContext?.mode_id ?? "manager")],
    },
  });
  const reasoningProv = createTrustProvenance({
    kind: "prompt_interpretation",
    source: {
      source_id: "prompt_input",
      source_label: "User Prompt",
      source_type: "prompt",
      subsystem: "ai_reasoning",
      version: "a19",
    },
    transformation_path: ["prompt", "semantic_match", "reasoning_path_selection"],
    confidence: aiReasoning?.confidence?.score,
    uncertainty_notes: aiReasoning?.ambiguity_notes,
  });
  const simulationProv = createTrustProvenance({
    kind: "simulation_output",
    source: {
      source_id: String(decisionSimulation?.scenario?.id ?? "simulation"),
      source_label: String(decisionSimulation?.scenario?.name ?? "Scenario"),
      source_type: "simulation",
      subsystem: "simulation_engine",
      version: "a10",
    },
    transformation_path: ["scenario_input", "propagation", "timeline", "impact_summary"],
    confidence: decisionSimulation?.confidence,
    uncertainty_notes: decisionSimulation?.impact?.uncertainty ? [decisionSimulation.impact.uncertainty] : undefined,
  });
  const recommendationProv = createTrustProvenance({
    kind: "recommendation_output",
    source: {
      source_id: "strategic_advice",
      source_label: "Strategic Advice",
      source_type: "advice",
      subsystem: "explainability_strategy",
      version: "a12-a13",
    },
    transformation_path: ["risk_summary", "strategy_kpi", "advice_generation"],
    confidence: Number(next?.strategic_advice?.confidence ?? aiReasoning?.confidence?.score ?? 0.72),
  });
  const multiAgentProv = createTrustProvenance({
    kind: "multi_agent_output",
    source: {
      source_id: "multi_agent_decision",
      source_label: "Multi-Agent",
      source_type: "agent_orchestration",
      subsystem: "multi_agent_engine",
      version: "a23",
    },
    transformation_path: ["agent_selection", "agent_contributions", "consensus_merge"],
    confidence: multiAgentDecision?.consensus?.merged_confidence,
    uncertainty_notes: multiAgentDecision?.consensus?.unresolved_ambiguities,
  });
  next.governance_context = governanceContext;
  next.trust_provenance = appendTrustProvenance(next?.trust_provenance, [
    reasoningProv,
    simulationProv,
    recommendationProv,
    multiAgentProv,
  ]);
  next.audit_events = appendAuditEvents(next?.audit_events, [
    createAuditEvent({
      event_type: "prompt_submitted",
      category: "prompt_reasoning",
      workspace_id: reasoningHints?.workspaceId ?? "default_workspace",
      project_id: projectId,
      origin_type: "user",
      actor_hint: "prompt",
      affected_entity: "prompt",
      provenance_ref_id: reasoningProv.id,
    }),
    createAuditEvent({
      event_type: "reasoning_generated",
      category: "prompt_reasoning",
      workspace_id: reasoningHints?.workspaceId ?? "default_workspace",
      project_id: projectId,
      origin_type: "agent",
      actor_hint: "ai_reasoning",
      affected_entity: aiReasoning.path,
      provenance_ref_id: reasoningProv.id,
      explanation_notes: aiReasoning?.ambiguity_notes,
    }),
    createAuditEvent({
      event_type: "simulation_run",
      category: "simulation_scenario",
      workspace_id: reasoningHints?.workspaceId ?? "default_workspace",
      project_id: projectId,
      origin_type: "system",
      actor_hint: "simulation_engine",
      affected_entity: String(decisionSimulation?.scenario?.id ?? "scenario"),
      provenance_ref_id: simulationProv.id,
    }),
    createAuditEvent({
      event_type: "recommendation_generated",
      category: "recommendation_explainability",
      workspace_id: reasoningHints?.workspaceId ?? "default_workspace",
      project_id: projectId,
      origin_type: "agent",
      actor_hint: "recommendation_agent",
      affected_entity: "strategic_advice",
      provenance_ref_id: recommendationProv.id,
    }),
  ]);

  next.prompt_feedback = {
    matched_objects: matchedIds,
    matched_topics: matchedTopics,
    scene_feedback: {
      highlighted_objects: highlighted,
      emphasis_updates: matchedIds.map((id, i) => ({ id, emphasis: Number((0.86 - i * 0.1).toFixed(2)) })),
    },
    risk_feedback: {
      summary: next.risk_propagation?.summary ?? riskSummary,
      affected_dimensions: ["dependency_stability", "operational_pressure", ...matchedSemanticTags].slice(0, 4),
      changed_drivers: matchedTopics.slice(0, 3),
    },
    timeline_feedback: {
      steps: timelineSteps,
      dependency_hints: matchedDependencies,
    },
    advice_feedback: {
      summary: next.strategic_advice?.summary,
      recommendation: next.strategic_advice?.primary_recommendation?.action ?? genericAction.action,
    },
    strategy_kpi: {
      summary: strategyKpiContext.summary,
      kpi_impacts: strategyKpiContext.kpi_impacts,
      objective_impacts: strategyKpiContext.objective_impacts,
      comparison_notes: strategyKpiContext.comparison?.notes ?? [],
    },
    decision_cockpit: {
      scene: decisionCockpit.scene,
      risk: decisionCockpit.risk,
      strategy: decisionCockpit.strategy,
      comparison: decisionCockpit.comparison,
      advice: decisionCockpit.advice,
      executive: decisionCockpit.executive,
    },
    reasoning: {
      intent: aiReasoning.intent,
      path: aiReasoning.path,
      confidence: aiReasoning.confidence,
      matched_concepts: aiReasoning.matched_concepts,
      trace: aiReasoning.trace,
      ambiguity_notes: aiReasoning.ambiguity_notes,
    },
    multi_agent: {
      plan: multiAgentDecision.plan,
      consensus: multiAgentDecision.consensus,
      conflicts: multiAgentDecision.conflicts,
      merged: multiAgentDecision.merged,
      trace: multiAgentDecision.trace,
    },
    governance: {
      project_status: governanceContext.project_status,
      scenario_status: governanceContext.scenario_status,
      recommendation_status: governanceContext.recommendation_status,
      trust_classification: governanceContext.governance.trusted_source_classification,
      environment: reasoningHints?.environmentConfig?.deployment?.environment,
    },
    trust_provenance: {
      latest_ids: [reasoningProv.id, simulationProv.id, recommendationProv.id, multiAgentProv.id],
      latest_kinds: [
        reasoningProv.kind,
        simulationProv.kind,
        recommendationProv.kind,
        multiAgentProv.kind,
      ],
    },
    audit: {
      latest_event_types: ["prompt_submitted", "reasoning_generated", "simulation_run", "recommendation_generated"],
      total_events: Array.isArray(next.audit_events) ? next.audit_events.length : 0,
    },
    deployment_ops: {
      environment: reasoningHints?.environmentConfig?.deployment?.environment,
      logging_mode: reasoningHints?.environmentConfig?.logging_mode,
      safe_mode: reasoningHints?.environmentConfig?.runtime_safety?.safe_mode,
      restricted_mode: reasoningHints?.environmentConfig?.runtime_safety?.restricted_mode,
      enabled_features: reasoningHints?.environmentConfig
        ? Object.entries(reasoningHints.environmentConfig.features)
            .filter(([, enabled]) => !!enabled)
            .map(([feature]) => feature)
        : [],
    },
    platform_assembly: {
      lifecycle: platformAssembly.lifecycle,
      active_project: platformAssembly.activeProject,
      active_mode: platformAssembly.activeMode
        ? { mode_id: platformAssembly.activeMode.mode_id, mode_label: platformAssembly.activeMode.mode_label }
        : null,
      reasoning_context: platformAssembly.reasoningContext,
      simulation_context: platformAssembly.simulationContext,
      cockpit_context: platformAssembly.cockpitContext,
      extension_points: platformAssembly.extension_points,
      environment_context: platformAssembly.environment_context,
    },
    simulation: decisionSimulation,
    scenario_snapshot: scenarioSnapshot,
    replay: replaySequence,
    comparison: scenarioComparison,
    executive_insight: executiveInsightWithStrategy,
  };

  const baseReply = typeof next.reply === "string" && next.reply.trim().length ? `${next.reply.trim()} ` : "";
  if (!baseReply.toLowerCase().includes("recommended action")) {
    next.reply = `${baseReply}${next.risk_propagation.summary} Timeline: ${timelineSteps.join(" ")} Recommended action: ${genericAction.action}`;
  }
  if (typeof next.analysis_summary !== "string" || next.analysis_summary.trim().length < 12) {
    next.analysis_summary = `${next.risk_propagation.summary} ${timelineSteps[1]}`;
  }

  return next;
}

type HomeScreenProps = {
  domainExperience?: NexoraResolvedDomainExperience;
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ domainExperience }) => {
  const activeDomainExperience = useMemo(
    () => domainExperience ?? resolveDomainExperience("general"),
    [domainExperience]
  );
  const activeDomainDemo = useMemo(
    () => resolveDomainDemo(activeDomainExperience.experience.domainId),
    [activeDomainExperience]
  );
  const [activeCompanyId, setActiveCompanyIdState] = useState<string>(
    process.env.NEXT_PUBLIC_COMPANY_ID || "default"
  );
  const { config, loading: configLoading, error: configError, refresh } = useCompanyConfig(activeCompanyId);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [memory, setMemory] = useState<MemoryStateV1>(() => createInitialMemoryState());
  const messagesRef = useRef<Msg[]>([]);
  const isSendingRef = useRef(false);
  const [sceneJson, setSceneJson] = useState<SceneJson | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<string>(activeDomainExperience.experience.preferredProductMode);
  const [activeTemplateId, setActiveTemplateId] = useState<string>("quality_protection");
  const [autoBackupEnabled, setAutoBackupEnabled] = useState<boolean>(
    process.env.NODE_ENV !== "production"
  );
  const [restorePreview, setRestorePreview] = useState<null | { backup: BackupV1; lines: string[] }>(null);
  const [alert, setAlert] = useState<{ level: any; score: number; reasons: string[] } | null>(null);
  const dismissAlert = useCallback(() => setAlert(null), []);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const toggleInspector = useCallback(() => {
    setInspectorOpen((prev) => !prev);
  }, []);
  const [rightPanelTab, setRightPanelTab] = useState<
    "chat" | "object" | "loops" | "kpi" | "decisions" | "scene" | "montecarlo" | "timeline" | "conflict" | "object_focus" | "memory_insights" | "risk_flow" | "replay" | "strategic_advice" | "opponent_moves" | "strategic_patterns" | "executive_dashboard" | "collaboration" | "workspace"
  >(activeDomainExperience.experience.preferredRightPanelTab);
  const [isClientMounted, setIsClientMounted] = useState(false);
  const [inspectorPortalHost, setInspectorPortalHost] = useState<HTMLElement | null>(null);
  const openRightPanel = useCallback(
    (tab: "chat" | "object" | "loops" | "kpi" | "decisions" | "scene" | "montecarlo" | "timeline" | "conflict" | "object_focus" | "memory_insights" | "risk_flow" | "replay" | "strategic_advice" | "opponent_moves" | "strategic_patterns" | "executive_dashboard" | "collaboration" | "workspace") => {
      setRightPanelTab(tab);
      setInspectorOpen(true);
    },
    []
  );

  useEffect(() => {
    const onOpenRightPanel = (event: Event) => {
      const detail = (event as CustomEvent<{ tab?: string }>).detail;
      if (detail?.tab === "scene" || detail?.tab === "object" || detail?.tab === "timeline" || detail?.tab === "conflict" || detail?.tab === "object_focus" || detail?.tab === "memory_insights" || detail?.tab === "risk_flow" || detail?.tab === "replay" || detail?.tab === "strategic_advice" || detail?.tab === "opponent_moves" || detail?.tab === "strategic_patterns" || detail?.tab === "executive_dashboard" || detail?.tab === "collaboration" || detail?.tab === "workspace") {
        openRightPanel(detail.tab);
      }
    };

    window.addEventListener("nexora:open-right-panel", onOpenRightPanel as EventListener);
    return () => {
      window.removeEventListener("nexora:open-right-panel", onOpenRightPanel as EventListener);
    };
  }, [openRightPanel]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("nexora:right-panel-tab-changed", {
        detail: { tab: rightPanelTab },
      })
    );
  }, [rightPanelTab]);

  useEffect(() => {
    setIsClientMounted(true);
  }, []);

  useEffect(() => {
    try {
      const storedCompanyId = window.localStorage.getItem("nexora.company_id");
      if (storedCompanyId && storedCompanyId !== activeCompanyId) {
        setActiveCompanyIdState(storedCompanyId);
      }

      const rawAutoBackup = window.localStorage.getItem(AUTO_BACKUP_KEY);
      if (rawAutoBackup === "true") {
        setAutoBackupEnabled(true);
      } else if (rawAutoBackup === "false") {
        setAutoBackupEnabled(false);
      }
    } catch {
      // ignore hydration sync errors
    }
  }, [activeCompanyId]);
  const [sourceLabel, setSourceLabel] = useState<string | null>(null);
  const [lastActions, setLastActions] = useState<any[]>([]);
  const [replaying, setReplaying] = useState(false);
  const [replayError, setReplayError] = useState<string | null>(null);
  const [healthInfo, setHealthInfo] = useState<string | null>(null);
  const [lastAnalysisSummary, setLastAnalysisSummary] = useState<string | null>(null);
  const [sceneWarn, setSceneWarn] = useState<string | null>(null);
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [objectSelection, setObjectSelection] = useState<any | null>(null);
  const [memoryInsights, setMemoryInsights] = useState<any | null>(null);
  const [riskPropagation, setRiskPropagation] = useState<any | null>(null);
  const [strategicAdvice, setStrategicAdvice] = useState<any | null>(null);
  useEffect(() => {
    setActiveMode(activeDomainExperience.experience.preferredProductMode);
    setRightPanelTab(activeDomainExperience.experience.preferredRightPanelTab);
    setProductModeId(activeDomainExperience.experience.preferredWorkspaceModeId);
  }, [activeDomainExperience]);
  const [strategyKpi, setStrategyKpi] = useState<any | null>(null);
  const [decisionCockpit, setDecisionCockpit] = useState<any | null>(null);
  const [productModeId, setProductModeId] = useState<string>(
    activeDomainExperience.experience.preferredWorkspaceModeId
  );
  const [productModeContext, setProductModeContext] = useState<any | null>(null);
  const [aiReasoning, setAiReasoning] = useState<any | null>(null);
  const [platformAssembly, setPlatformAssembly] = useState<any | null>(null);
  const [autonomousExploration, setAutonomousExploration] = useState<any | null>(null);
  const [opponentModel, setOpponentModel] = useState<any | null>(null);
  const [strategicPatterns, setStrategicPatterns] = useState<any | null>(null);
  const [responseData, setResponseData] = useState<any | null>(null);
  const [noSceneUpdate, setNoSceneUpdate] = useState(false);
  const [focusPinned, setFocusPinned] = useState(false);
  const [focusMode, setFocusMode] = useState<"all" | "selected">("all");
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const focusModeStore = useFocusMode();
  const pinnedId = usePinnedId();
  const activeLoopIdStore = useActiveLoopId();
  const focusActions = useFocusActions() as any;
  const applyFocusModeToStore = useCallback(
    (nextMode: "all" | "selected" | "pinned") => {
      if (typeof focusActions?.setFocusMode === "function") {
        focusActions.setFocusMode(nextMode);
      }
    },
    [focusActions]
  );
  const applyPinToStore = useCallback(
    (nextPinned: boolean, id: string | null) => {
      if (nextPinned && id && typeof focusActions?.pin === "function") {
        focusActions.pin(id);
        return;
      }
      if (typeof focusActions?.unpin === "function") {
        focusActions.unpin();
      }
    },
    [focusActions]
  );
  const setPinnedSafe = useCallback(
    (nextPinned: boolean, id: string | null) => {
      setFocusPinned(nextPinned);
      applyPinToStore(nextPinned, id);
    },
    [applyPinToStore]
  );
  const setFocusPinnedFromPanels = useCallback(
    (fn: (v: boolean) => boolean) => {
      setFocusPinned((prev) => {
        const next = fn(prev);
        applyPinToStore(next, focusedId ?? null);
        return next;
      });
    },
    [applyPinToStore, focusedId]
  );
  const [showAxes, setShowAxes] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [showCameraHelper, setShowCameraHelper] = useState(false);
  const [objectProfiles, setObjectProfiles] = useState<
    Record<
      string,
      {
        id: string;
        label: string;
        summary: string;
        tags: string[];
        one_liner?: string;
        synonyms?: string[];
        domain_hints?: Record<string, string[]>;
        ux?: { shape?: string; base_color?: string };
      }
    >
  >({});
  const [objectUxById, setObjectUxById] = useState<Record<string, { opacity?: number; scale?: number }>>({});
  const [selectedObjectInfo, setSelectedObjectInfo] = useState<{
    id: string;
    label: string;
    type?: string;
    tags?: string[];
    color?: any;
    scale?: any;
    override?: any;
    base_color?: string;
    shape?: string;
    opacity?: number;
    summary?: string;
    one_liner?: string;
  } | null>(null);
  const [selectionLocked, setSelectionLocked] = useState(false);
  const [selectedObjectIdState, setSelectedObjectIdState] = useState<string | null>(null);
  const handleDragStart = useCallback(() => {}, []);
  const handleDragEnd = useCallback(() => {}, []);
  const [prefs, setPrefs] = useState<ScenePrefs>(() => loadPrefsFromStorage() ?? defaultPrefs);
  const [isOrbiting, setIsOrbiting] = useState(false);
  const [cameraLockedByUser, setCameraLockedByUser] = useState(false);
  const [episodeId, setEpisodeId] = useState<string | null>(null);
  const [simRunning, setSimRunning] = useState(false);
  const [simSpeed, setSimSpeed] = useState(1);
  const [simLastError, setSimLastError] = useState<string | null>(null);
  const [kpi, setKpi] = useState<KPIState | null>(null);
  // --- Monte Carlo (HUD panel) ---
  const [mcLoading, setMcLoading] = useState(false);
  const [mcError, setMcError] = useState<string | null>(null);
  const [mcReport, setMcReport] = useState<any | null>(null);
  const [mcResult, setMcResult] = useState<any | null>(null);

  useEffect(() => {
    // Inspector PANEL is disabled; keep rail only. Do not auto-open.
  }, [selectedObjectIdState]);
  useEffect(() => {
    const fire = () => window.dispatchEvent(new Event("resize"));
    fire();
    requestAnimationFrame(fire);
  }, [inspectorOpen]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>(DEFAULT_WORKSPACE_ID);
  const [activeProjectId, setActiveProjectId] = useState<string>(DEFAULT_PROJECT_ID);
  const [workspaceProjects, setWorkspaceProjects] = useState<Record<string, WorkspaceProjectState>>({
    [DEFAULT_PROJECT_ID]: createEmptyProjectState(DEFAULT_PROJECT_ID, "Default Project"),
  });
  const [workspaceHydrated, setWorkspaceHydrated] = useState(false);
  const didAutoLoadDomainDemoRef = useRef(false);
  const environmentConfig = useMemo(() => {
    const env = resolveNexoraEnvironment({
      requested:
        (typeof process !== "undefined" && process.env.NEXT_PUBLIC_NEXORA_ENV) ||
        (typeof process !== "undefined" ? process.env.NODE_ENV : ""),
      mode_id: productModeId,
      node_env: typeof process !== "undefined" ? process.env.NODE_ENV : "",
    });
    return buildEnvironmentConfig({
      environment: env,
      mode_id: productModeId,
      company_id: activeCompanyId,
      node_env: typeof process !== "undefined" ? process.env.NODE_ENV : "",
    });
  }, [activeCompanyId, productModeId]);
  const projectHydratingRef = useRef<boolean>(false);
  const autonomousExploreSignatureRef = useRef<Record<string, string>>({});
  const buildExplorationSceneSignature = useCallback((nextScene: SceneJson | null): string => {
    const objects = Array.isArray(nextScene?.scene?.objects) ? nextScene.scene.objects : [];
    if (!objects.length) return "";
    const relations = Array.isArray((nextScene as any)?.scene?.relations) ? (nextScene as any).scene.relations : [];
    const loops = Array.isArray((nextScene as any)?.scene?.loops) ? (nextScene as any).scene.loops : [];
    const objectIds = objects
      .map((obj: any) => String(obj?.id ?? obj?.label ?? "").trim())
      .filter(Boolean)
      .sort();
    return JSON.stringify({
      object_ids: objectIds,
      relation_count: relations.length,
      loop_count: loops.length,
    });
  }, []);
  const projectId = activeProjectId;
  // =====================
  // LOOPS ENGINE (7.1)
  // Source of truth: loops + activeLoopId + selectedLoopId
  // Derived: effectiveActiveLoopId, visibleLoops
  // =====================
  const [loops, setLoops] = useState<SceneLoop[]>([]);
  const [showLoops, setShowLoops] = useState(true);
  const [showLoopLabels, setShowLoopLabels] = useState(false);
  const extractConflicts = useCallback((payload: any): any[] => {
    if (Array.isArray(payload?.conflicts)) return payload.conflicts;
    if (Array.isArray(payload?.scene_json?.scene?.conflicts)) return payload.scene_json.scene.conflicts;
    if (Array.isArray(payload?.scene?.conflicts)) return payload.scene.conflicts;
    return [];
  }, []);
  const extractObjectSelection = useCallback((payload: any): any | null => {
    if (payload?.object_selection && typeof payload.object_selection === "object") return payload.object_selection;
    if (payload?.context?.object_selection && typeof payload.context.object_selection === "object") return payload.context.object_selection;
    if (payload?.scene_json?.object_selection && typeof payload.scene_json.object_selection === "object") return payload.scene_json.object_selection;
    return null;
  }, []);
  const extractMemoryV2 = useCallback((payload: any): any | null => {
    if (payload?.memory_v2 && typeof payload.memory_v2 === "object") return payload.memory_v2;
    if (payload?.context?.memory_v2 && typeof payload.context.memory_v2 === "object") return payload.context.memory_v2;
    if (payload?.scene_json?.memory_v2 && typeof payload.scene_json.memory_v2 === "object") return payload.scene_json.memory_v2;
    return null;
  }, []);
  const extractRiskPropagation = useCallback((payload: any): any | null => {
    if (payload?.risk_propagation && typeof payload.risk_propagation === "object") return payload.risk_propagation;
    if (payload?.context?.risk_propagation && typeof payload.context.risk_propagation === "object") return payload.context.risk_propagation;
    if (payload?.scene_json?.risk_propagation && typeof payload.scene_json.risk_propagation === "object") return payload.scene_json.risk_propagation;
    if (payload?.scene_json?.scene?.risk_propagation && typeof payload.scene_json.scene.risk_propagation === "object") return payload.scene_json.scene.risk_propagation;
    return null;
  }, []);
  const extractStrategicAdvice = useCallback((payload: any): any | null => {
    if (payload?.strategic_advice && typeof payload.strategic_advice === "object") return payload.strategic_advice;
    if (payload?.context?.strategic_advice && typeof payload.context.strategic_advice === "object") return payload.context.strategic_advice;
    if (payload?.scene_json?.strategic_advice && typeof payload.scene_json.strategic_advice === "object") return payload.scene_json.strategic_advice;
    if (payload?.scene_json?.scene?.strategic_advice && typeof payload.scene_json.scene.strategic_advice === "object") return payload.scene_json.scene.strategic_advice;
    return null;
  }, []);
  const extractStrategyKpi = useCallback((payload: any): any | null => {
    if (payload?.strategy_kpi && typeof payload.strategy_kpi === "object") return payload.strategy_kpi;
    if (payload?.context?.strategy_kpi && typeof payload.context.strategy_kpi === "object") return payload.context.strategy_kpi;
    if (payload?.prompt_feedback?.strategy_kpi && typeof payload.prompt_feedback.strategy_kpi === "object") {
      return payload.prompt_feedback.strategy_kpi;
    }
    if (payload?.scene_json?.strategy_kpi && typeof payload.scene_json.strategy_kpi === "object") return payload.scene_json.strategy_kpi;
    return null;
  }, []);
  const extractDecisionCockpit = useCallback((payload: any): any | null => {
    if (payload?.decision_cockpit && typeof payload.decision_cockpit === "object") return payload.decision_cockpit;
    if (payload?.context?.decision_cockpit && typeof payload.context.decision_cockpit === "object") {
      return payload.context.decision_cockpit;
    }
    if (payload?.prompt_feedback?.decision_cockpit && typeof payload.prompt_feedback.decision_cockpit === "object") {
      return payload.prompt_feedback.decision_cockpit;
    }
    if (payload?.scene_json?.decision_cockpit && typeof payload.scene_json.decision_cockpit === "object") {
      return payload.scene_json.decision_cockpit;
    }
    return null;
  }, []);
  const extractProductModeContext = useCallback((payload: any): any | null => {
    if (payload?.product_mode && typeof payload.product_mode === "object") return payload.product_mode;
    if (payload?.context?.product_mode && typeof payload.context.product_mode === "object") return payload.context.product_mode;
    if (payload?.decision_cockpit?.mode && typeof payload.decision_cockpit.mode === "object") return payload.decision_cockpit.mode;
    return null;
  }, []);
  const extractAiReasoning = useCallback((payload: any): any | null => {
    if (payload?.ai_reasoning && typeof payload.ai_reasoning === "object") return payload.ai_reasoning;
    if (payload?.context?.ai_reasoning && typeof payload.context.ai_reasoning === "object") return payload.context.ai_reasoning;
    if (payload?.prompt_feedback?.reasoning && typeof payload.prompt_feedback.reasoning === "object") {
      return payload.prompt_feedback.reasoning;
    }
    return null;
  }, []);
  const extractPlatformAssembly = useCallback((payload: any): any | null => {
    if (payload?.platform_assembly && typeof payload.platform_assembly === "object") return payload.platform_assembly;
    if (payload?.context?.platform_assembly && typeof payload.context.platform_assembly === "object") {
      return payload.context.platform_assembly;
    }
    if (payload?.prompt_feedback?.platform_assembly && typeof payload.prompt_feedback.platform_assembly === "object") {
      return payload.prompt_feedback.platform_assembly;
    }
    return null;
  }, []);
  const extractAutonomousExploration = useCallback((payload: any): any | null => {
    if (payload?.autonomous_exploration && typeof payload.autonomous_exploration === "object") {
      return payload.autonomous_exploration;
    }
    if (payload?.context?.autonomous_exploration && typeof payload.context.autonomous_exploration === "object") {
      return payload.context.autonomous_exploration;
    }
    if (
      payload?.prompt_feedback?.autonomous_exploration &&
      typeof payload.prompt_feedback.autonomous_exploration === "object"
    ) {
      return payload.prompt_feedback.autonomous_exploration;
    }
    return null;
  }, []);
  const extractOpponentModel = useCallback((payload: any): any | null => {
    if (payload?.opponent_model && typeof payload.opponent_model === "object") return payload.opponent_model;
    if (payload?.context?.opponent_model && typeof payload.context.opponent_model === "object") return payload.context.opponent_model;
    if (payload?.scene_json?.opponent_model && typeof payload.scene_json.opponent_model === "object") return payload.scene_json.opponent_model;
    if (payload?.scene_json?.scene?.opponent_model && typeof payload.scene_json.scene.opponent_model === "object") return payload.scene_json.scene.opponent_model;
    return null;
  }, []);
  const extractStrategicPatterns = useCallback((payload: any): any | null => {
    if (payload?.strategic_patterns && typeof payload.strategic_patterns === "object") return payload.strategic_patterns;
    if (payload?.context?.strategic_patterns && typeof payload.context.strategic_patterns === "object") return payload.context.strategic_patterns;
    if (payload?.scene_json?.strategic_patterns && typeof payload.scene_json.strategic_patterns === "object") return payload.scene_json.strategic_patterns;
    if (payload?.scene_json?.scene?.strategic_patterns && typeof payload.scene_json.scene.strategic_patterns === "object") return payload.scene_json.scene.strategic_patterns;
    return null;
  }, []);
  const ensureBackendUserId = useCallback((): string => {
    let userId: string | null = null;
    try {
      userId = window.localStorage.getItem(SESSION_KEY);
    } catch {
      userId = null;
    }
    if (!userId && process.env.NODE_ENV !== "production") {
      const newUserId = `dev-${Math.random().toString(36).slice(2, 10)}`;
      userId = newUserId;
      try {
        window.localStorage.setItem(SESSION_KEY, newUserId);
      } catch {
        // ignore
      }
    }
    return userId ?? `anon-${Math.random().toString(36).slice(2, 10)}`;
  }, []);
  const buildChatRequestPayload = useCallback(
    (text: string): Record<string, any> => {
      const payload: Record<string, any> = {
        text,
        user_id: ensureBackendUserId(),
        mode: activeMode,
        episode_id: episodeId,
      };
      if (focusMode === "selected" && focusedId) {
        payload.allowed_objects = [String(focusedId)];
      }
      return payload;
    },
    [activeMode, ensureBackendUserId, episodeId, focusMode, focusedId]
  );
  const deriveProductFlowViewModel = useCallback(
    (payload: BackendChatResponse, fallbackScene: SceneJson | null) => {
      const nextSceneJson: SceneJson | null = payload.scene_json
        ? normalizeSceneJson(payload.scene_json as any)
        : fallbackScene;
      const nextKpi = (payload as any)?.scene_json?.scene?.kpi ?? null;
      const baseLoops = normalizeLoops((payload as any)?.scene_json?.scene?.loops);
      const sceneObjects: any[] =
        nextSceneJson && Array.isArray((nextSceneJson as any)?.scene?.objects)
          ? ((nextSceneJson as any).scene.objects as any[])
          : [];
      const nextLoops = resolveLoopPlaceholders(baseLoops, sceneObjects);
      return {
        nextSceneJson,
        nextKpi,
        nextLoops,
        nextActiveLoop: (payload as any)?.scene_json?.scene?.active_loop ?? null,
        nextLoopSuggestions: Array.isArray((payload as any)?.scene_json?.scene?.loops_suggestions)
          ? ((payload as any)?.scene_json?.scene?.loops_suggestions as string[])
          : [],
        nextConflicts: extractConflicts(payload),
        nextObjectSelection: extractObjectSelection(payload),
        nextMemoryInsights: extractMemoryV2(payload),
        nextRiskPropagation: extractRiskPropagation(payload),
        nextStrategicAdvice: extractStrategicAdvice(payload),
        nextStrategyKpi: extractStrategyKpi(payload),
        nextDecisionCockpit: extractDecisionCockpit(payload),
        nextProductModeContext: extractProductModeContext(payload),
        nextAiReasoning: extractAiReasoning(payload),
        nextPlatformAssembly: extractPlatformAssembly(payload),
        nextAutonomousExploration: extractAutonomousExploration(payload),
        nextOpponentModel: extractOpponentModel(payload),
        nextStrategicPatterns: extractStrategicPatterns(payload),
      };
    },
    [
      extractAiReasoning,
      extractAutonomousExploration,
      extractConflicts,
      extractDecisionCockpit,
      extractMemoryV2,
      extractObjectSelection,
      extractOpponentModel,
      extractPlatformAssembly,
      extractProductModeContext,
      extractRiskPropagation,
      extractStrategicAdvice,
      extractStrategicPatterns,
      extractStrategyKpi,
    ]
  );
  const applyActions = useCallback(
    (actions: any[] | undefined | null) => {
      const list = Array.isArray(actions) ? actions : [];
      setLastActions(list);
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.debug("[actions]", list.length);
      }
      if (!list.length) return;

      const applyObjectPatch = (id: string, patch: Record<string, any>) => {
        if (!id || typeof id !== "string") return;
        const safePatch: Record<string, any> = {};
        if (patch.color && typeof patch.color === "string") safePatch.color = patch.color;
        if (typeof patch.visible === "boolean") safePatch.visible = patch.visible;
        if (Array.isArray(patch.position) && patch.position.length === 3) {
          const nums = patch.position.map((n: any) => Number(n));
          if (nums.every((n) => Number.isFinite(n))) safePatch.position = [nums[0], nums[1], nums[2]];
        }
        if (Number.isFinite(patch.scale)) safePatch.scale = clamp(Number(patch.scale), 0.2, 2.0);
        if (Number.isFinite(patch.intensity)) {
          const intensity = clamp(Number(patch.intensity), 0, 1);
          safePatch.scale = 0.5 + intensity;
        }
        if (Object.keys(safePatch).length > 0) {
          setOverrideRef.current?.(id, safePatch);
        }
      };

      list.forEach((action) => {
        try {
          if (!action || typeof action !== "object") return;
          // Replay wrapper (backend stores: { object: "obj_123", type:"applyObject", value: {...} })
          if (action.type === "applyObject") {
            const objUpdate = action.value ?? action.object ?? null;
            const id = action.object ?? objUpdate?.id ?? objUpdate?.target_id ?? objUpdate?.targetId;
            if (id) applyObjectPatch(String(id), objUpdate ?? {});
            return;
          }
          // Backend scene_actions object updates
          if (
            action.id &&
            (action.color || action.position || action.visible !== undefined || action.scale !== undefined || action.intensity !== undefined)
          ) {
            applyObjectPatch(String(action.id), action);
            return;
          }
          // Legacy
          const target = action?.object ?? action?.target_id ?? action?.targetId;
          if (!target) return;
          const type = (action?.type || action?.verb || "").toLowerCase();
          if (type === "setcolor" && action.color) {
            applyObjectPatch(String(target), { color: action.color });
          } else if (type === "hide") {
            applyObjectPatch(String(target), { visible: false });
          } else if (type === "reveal") {
            applyObjectPatch(String(target), { visible: true });
          } else if (type === "setposition" && Array.isArray(action.position) && action.position.length === 3) {
            applyObjectPatch(String(target), { position: action.position });
          } else if (type === "setintensity") {
            applyObjectPatch(String(target), { intensity: action.intensity });
          } else if (type === "pulse") {
            const intensity = clamp(Number(action.intensity ?? 0.4), 0, 1);
            applyObjectPatch(String(target), { scale: 1 + intensity * 0.4 });
          } else if (type === "highlight") {
            const color = typeof action.color === "string" ? action.color : "#ffd166";
            applyObjectPatch(String(target), { color, scale: 1.1 });
          }
        } catch {
          // skip malformed action
        }
      });
    },
    []
  );
  const applyProductFlowViewModel = useCallback(
    (
      payload: BackendChatResponse,
      viewModel: ReturnType<typeof deriveProductFlowViewModel>,
      options?: { applyActionsToScene?: boolean; syncSceneState?: boolean }
    ) => {
      setKpi(viewModel.nextKpi);
      setConflicts(viewModel.nextConflicts);
      setObjectSelection(viewModel.nextObjectSelection);
      setMemoryInsights(viewModel.nextMemoryInsights);
      setRiskPropagation(viewModel.nextRiskPropagation);
      setStrategicAdvice(viewModel.nextStrategicAdvice);
      setStrategyKpi(viewModel.nextStrategyKpi);
      setDecisionCockpit(viewModel.nextDecisionCockpit);
      setProductModeContext(viewModel.nextProductModeContext);
      if (viewModel.nextProductModeContext?.mode_id) {
        setProductModeId(String(viewModel.nextProductModeContext.mode_id));
      }
      setAiReasoning(viewModel.nextAiReasoning);
      setPlatformAssembly(viewModel.nextPlatformAssembly);
      setAutonomousExploration(viewModel.nextAutonomousExploration);
      setOpponentModel(viewModel.nextOpponentModel);
      setStrategicPatterns(viewModel.nextStrategicPatterns);
      setLoops(viewModel.nextLoops);
      setActiveLoopId(viewModel.nextActiveLoop ?? null);
      setLoopSuggestions(viewModel.nextLoopSuggestions);
      if (options?.syncSceneState !== false && viewModel.nextSceneJson) {
        setSceneJson(viewModel.nextSceneJson);
        setNoSceneUpdate(false);
      } else if (options?.syncSceneState !== false) {
        setNoSceneUpdate(true);
      }
      setSourceLabel((payload as any)?.source ?? null);
      setLastAnalysisSummary((payload as any)?.analysis_summary ?? null);
      if (options?.applyActionsToScene !== false) {
        try {
          applyActions((payload as any)?.actions);
          setSceneWarn(null);
        } catch {
          setSceneWarn("⚠️ Could not apply scene actions (dev).");
        }
      }
    },
    [applyActions]
  );
  const instanceLabelMap = useMemo(() => {
    const list = Array.isArray(config?.instances) ? config?.instances : [];
    const map: Record<string, string> = {};
    list.forEach((inst: any) => {
      if (inst && typeof inst.id === "string" && typeof inst.label === "string") {
        map[inst.id] = inst.label;
      }
    });
    return map;
  }, [config]);
  const typeLabelMap = useMemo(() => {
    const types = config?.types && typeof config.types === "object" ? config.types : {};
    const map: Record<string, string> = {};
    Object.entries(types).forEach(([key, entry]) => {
      if (entry && typeof (entry as any).label === "string") {
        map[key] = (entry as any).label;
      }
    });
    return map;
  }, [config]);
  const resolveObjectLabel = useCallback(
    (id: string) => instanceLabelMap[id] ?? id,
    [instanceLabelMap]
  );
  const resolveTypeLabel = useCallback(
    (id: string) => typeLabelMap[id] ?? id,
    [typeLabelMap]
  );
  const highlightedObjectIdSet = useMemo(() => {
    const ids = Array.isArray(objectSelection?.highlighted_objects) ? objectSelection.highlighted_objects : [];
    return new Set((ids as any[]).filter((x) => typeof x === "string") as string[]);
  }, [objectSelection]);
  const riskSourceObjectIdSet = useMemo(() => {
    const ids = Array.isArray(riskPropagation?.sources) ? riskPropagation.sources : [];
    return new Set((ids as any[]).filter((x) => typeof x === "string") as string[]);
  }, [riskPropagation]);
  const getUxForObject = useCallback(
    (id: string) => {
      const profileUx = objectProfiles[id]?.ux;
      const localUx = objectUxById[id];
      if (!profileUx && !localUx) return null;
      const merged: any = { ...(profileUx ?? {}), ...(localUx ?? {}) };
      if (highlightedObjectIdSet.has(id)) {
        const baseScale = typeof merged.scale === "number" ? merged.scale : 1;
        merged.scale = clamp(baseScale + 0.25, 0.2, 2.0);
      }
      if (riskSourceObjectIdSet.has(id)) {
        const baseScale = typeof merged.scale === "number" ? merged.scale : 1;
        merged.scale = clamp(baseScale + 0.15, 0.2, 2.0);
      }
      return merged;
    },
    [highlightedObjectIdSet, objectProfiles, objectUxById, riskSourceObjectIdSet]
  );
  const updateSelectedObjectInfo = useCallback(
    (id: string | null) => {
      if (!id) {
        setSelectedObjectInfo(null);
        return;
      }
      const objs: any[] = Array.isArray(sceneJson?.scene?.objects) ? (sceneJson as any).scene.objects : [];
      const found = objs.find((o: any) => {
        const oid = o?.id ?? o?.name;
        return oid === id;
      });
      const label =
        (found?.name as string) ??
        (found?.label as string) ??
        resolveObjectLabel(id) ??
        id;
      const tags = Array.isArray(found?.tags)
        ? (found.tags as any[]).filter((t) => typeof t === "string")
        : undefined;
      const ux = getUxForObject(id) ?? undefined;
      setSelectedObjectInfo({
        id,
        label,
        type: found?.type,
        tags,
        color: found?.color,
        scale: typeof ux?.scale === "number" ? ux?.scale : found?.scale,
        override: overridesRef.current[id],
        base_color: ux?.base_color,
        shape: ux?.shape,
        opacity: ux?.opacity,
      });
    },
    [getUxForObject, sceneJson, resolveObjectLabel]
  );
  const syncFocusedObjectFromResponse = useCallback(
    (payload: BackendChatResponse) => {
      const ctxInfo = (payload as any)?.context?.object_info;
      if (ctxInfo && typeof ctxInfo === "object" && ctxInfo.id) {
        setSelectedObjectInfo((prev) => {
          return {
            ...(prev ?? {}),
            id: ctxInfo.id,
            label: ctxInfo.label ?? ctxInfo.id,
            summary: ctxInfo.summary ?? (prev?.summary ?? null),
            tags: Array.isArray(ctxInfo.tags) ? ctxInfo.tags : prev?.tags ?? [],
          };
        });
        if (!focusPinned) {
          setFocusedId(ctxInfo.id);
          setFocusMode("selected");
        }
      }

      const ctxAllowed = (payload as any)?.context?.allowed_objects;
      if (!focusPinned && focusMode === "all" && Array.isArray(ctxAllowed) && ctxAllowed.length > 0) {
        const first = ctxAllowed[0] as string;
        setFocusedId(first);
        setFocusMode("selected");
        updateSelectedObjectInfo(first);
        if (process.env.NODE_ENV !== "production") {
          setSceneWarn("Auto focus by text");
        }
      }
    },
    [focusMode, focusPinned, setFocusMode, setFocusedId, updateSelectedObjectInfo]
  );
  const applyRetailTriggerEnhancement = useCallback(
    (rawPayload: any, userText: string, fallbackScene: SceneJson | null) => {
      if (!rawPayload || typeof rawPayload !== "object") return rawPayload;
      const modeContext = buildActiveModeContext({
        modeId: productModeId,
        projectDomain:
          String((fallbackScene as any)?.meta?.domain ?? (rawPayload as any)?.scene_json?.meta?.domain ?? "").trim() ||
          undefined,
      });
      const genericEnhanced = applyGenericPromptFeedbackEnhancement(rawPayload, userText, fallbackScene, modeContext, {
        workspaceId: activeWorkspaceId,
        selectedObjectId: selectedObjectIdState,
        memoryState: memory,
        environmentConfig,
      });
      if (!isRetailScenePayload(genericEnhanced, fallbackScene)) return genericEnhanced;

      const cfg = detectRetailTriggerConfig(userText);
      if (!cfg) return genericEnhanced;

      const next: any = { ...genericEnhanced };

      const baseRisk = extractRiskPropagation(next) ?? {};
      let nextEdges = Array.isArray(baseRisk?.edges) ? baseRisk.edges : [];
      cfg.riskEdges.forEach((edge) => {
        nextEdges = upsertRiskEdge(nextEdges, edge.from, edge.to, edge.base, edge.delta);
      });
      const nextSources = Array.from(
        new Set(nextEdges.map((e: any) => String(e?.from ?? "")).filter(Boolean))
      );
      next.risk_propagation = {
        ...baseRisk,
        edges: nextEdges,
        sources: nextSources,
        summary: cfg.riskSummary,
      };

      const baseAdvice = extractStrategicAdvice(next) ?? {};
      const primaryAdvice = {
        id: `retail_${cfg.id}`,
        type: "retail_response",
        action: cfg.adviceAction,
        targets: cfg.targets,
        impact: cfg.adviceImpact,
        priority: 1,
      };
      const existingActions = Array.isArray(baseAdvice?.recommended_actions)
        ? baseAdvice.recommended_actions.filter((a: any) => a && a.action !== cfg.adviceAction).slice(0, 2)
        : [];
      next.strategic_advice = {
        ...baseAdvice,
        recommended_actions: [primaryAdvice, ...existingActions],
        primary_recommendation: primaryAdvice,
        why: cfg.adviceWhy,
        confidence: Math.max(0.72, Number(baseAdvice?.confidence ?? 0.72)),
        summary: `Recommended action: ${cfg.adviceAction}`,
      };

      const baseSelection = extractObjectSelection(next) ?? {};
      const priorHighlights = Array.isArray(baseSelection?.highlighted_objects)
        ? baseSelection.highlighted_objects
        : [];
      next.object_selection = {
        ...baseSelection,
        highlighted_objects: Array.from(new Set([...cfg.targets, ...priorHighlights])),
      };

      const baseConflicts = extractConflicts(next);
      const conflictSeeds = cfg.targets.slice(0, 3);
      const seededConflicts =
        conflictSeeds.length >= 2
          ? [{ pair: [conflictSeeds[0], conflictSeeds[1]], score: 0.65 }]
          : [];
      next.conflicts = seededConflicts.concat(Array.isArray(baseConflicts) ? baseConflicts : []).slice(0, 4);

      const baseScene = next?.scene_json && typeof next.scene_json === "object" ? next.scene_json : null;
      if (baseScene?.scene) {
        const prevFragility = baseScene.scene?.fragility ?? {};
        const prevDrivers = prevFragility?.drivers ?? {};
        const dInv = clamp(Number(prevDrivers.inventory_pressure ?? 0.45) + Number(cfg.driverDelta.inventory_pressure ?? 0), 0, 1);
        const dTime = clamp(Number(prevDrivers.time_pressure ?? 0.45) + Number(cfg.driverDelta.time_pressure ?? 0), 0, 1);
        const dQuality = clamp(Number(prevDrivers.quality_risk ?? 0.42) + Number(cfg.driverDelta.quality_risk ?? 0), 0, 1);
        const prevRisk = Number(baseScene?.scene?.kpi?.risk ?? 0.52);
        const nextRisk = clamp(prevRisk + cfg.kpiRiskDelta, 0, 1);
        const nextScore = clamp(Number(prevFragility?.score ?? 0.5) + cfg.kpiRiskDelta * 0.8, 0, 1);

        baseScene.scene.fragility = {
          ...prevFragility,
          score: nextScore,
          level: nextScore >= 0.7 ? "high" : nextScore >= 0.45 ? "medium" : "low",
          drivers: {
            ...prevDrivers,
            inventory_pressure: dInv,
            time_pressure: dTime,
            quality_risk: dQuality,
          },
        };
        baseScene.scene.kpi = {
          ...(baseScene.scene.kpi ?? {}),
          risk: nextRisk,
        };
        next.scene_json = baseScene;
      }

      const timelineImpact = {
        trigger: cfg.id,
        immediate: cfg.timelineSteps[0],
        near_term: cfg.timelineSteps[1],
        follow_up: cfg.timelineSteps[2],
        steps: cfg.timelineSteps,
      };
      next.timeline_impact = timelineImpact;
      next.reply = buildReadableDemoReply({
        riskSummary: cfg.riskSummary,
        timelineSteps: cfg.timelineSteps,
        action: cfg.adviceAction,
        matchedNames: cfg.targets
          .map((id) => {
            const obj = baseScene?.scene?.objects?.find((candidate: any) => String(candidate?.id ?? "") === id);
            return obj ? getObjectDisplayLabel(obj) : "";
          })
          .filter(Boolean),
      });
      const executiveSummarySurface = buildExecutiveSummarySurface({
        matchedNames: cfg.targets
          .map((id) => {
            const obj = baseScene?.scene?.objects?.find((candidate: any) => String(candidate?.id ?? "") === id);
            return obj ? getObjectDisplayLabel(obj) : "";
          })
          .filter(Boolean),
        riskSummary: cfg.riskSummary,
        timelineSteps: cfg.timelineSteps,
        adviceAction: cfg.adviceAction,
        adviceWhy: cfg.adviceWhy,
        domainLabel: activeDomainExperience.experience.label,
        framingStyle: activeDomainExperience.experience.executiveFramingStyle,
      });
      next.executive_summary_surface = executiveSummarySurface;
      next.analysis_summary = executiveSummarySurface.summary;
      if (next.executive_insight && typeof next.executive_insight === "object") {
        next.executive_insight = {
          ...next.executive_insight,
          summary: executiveSummarySurface.summary,
          explanation_notes: Array.from(
            new Set([
              executiveSummarySurface.happened,
              executiveSummarySurface.why_it_matters,
              ...(Array.isArray(next.executive_insight?.explanation_notes) ? next.executive_insight.explanation_notes : []),
            ])
          ),
        };
      }
      if (next.decision_cockpit && typeof next.decision_cockpit === "object") {
        next.decision_cockpit = {
          ...next.decision_cockpit,
          executive: {
            ...(next.decision_cockpit.executive ?? {}),
            summary: executiveSummarySurface.summary,
            happened: executiveSummarySurface.happened,
            why_it_matters: executiveSummarySurface.why_it_matters,
            what_to_do: executiveSummarySurface.what_to_do,
          },
        };
      }

      return next;
    },
    [
      extractConflicts,
      extractObjectSelection,
      extractRiskPropagation,
      extractStrategicAdvice,
      productModeId,
      activeWorkspaceId,
      selectedObjectIdState,
      memory,
      environmentConfig,
    ]
  );
  const [activeLoopId, setActiveLoopId] = useState<string | null>(null);
  const [selectedLoopId, setSelectedLoopId] = useState<string | null>(null);
  const [loopSuggestions, setLoopSuggestions] = useState<string[]>([]);
  const isDev = process.env.NODE_ENV !== "production";
  const [snapshots, setSnapshots] = useState<DecisionSnapshot[]>([]);
  const [compareAId, setCompareAId] = useState<string | null>(null);
  const [compareBId, setCompareBId] = useState<string | null>(null);
  const [diffState, setDiffState] = useState<ReturnType<typeof diffSnapshots> | null>(null);
  const [activeSidePanel, setActiveSidePanel] = useState<HUDTabKey>("decisions");
  // --- panelContent block is moved below ---
  const handleApplySnapshot = useCallback(
    (snapshotKey: string) => {
      const key = String(snapshotKey || "").trim();
      if (!key) return;

      const parseKey = (k: string) => {
        const parts = k.split(":");
        if (parts.length === 2) {
          const id = parts[0];
          const ts = Number(parts[1]);
          return { id, ts: Number.isFinite(ts) ? ts : null };
        }
        return { id: k, ts: null as number | null };
      };

      const { id, ts } = parseKey(key);

      const pickFromList = (list: DecisionSnapshot[]) => {
        const candidates = list.filter((s) => {
          if (!s) return false;
          if (ts !== null) return s.id === id && s.timestamp === ts;
          return s.id === id;
        });
        if (candidates.length === 0) return null;
        // If multiple snapshots share an id, pick the newest
        return candidates.reduce((best, cur) => (cur.timestamp > best.timestamp ? cur : best));
      };

      // 1) Try in-memory first (fast)
      let snap: DecisionSnapshot | null = pickFromList(Array.isArray(snapshots) ? snapshots : []);

      // 2) If not found, try persisted snapshots
      if (!snap) {
        const persisted = loadSnapshots(projectId);
        snap = pickFromList(persisted);
        // Keep in-memory state in sync if we found one
        if (snap) {
          setSnapshots(persisted);
        }
      }

      if (!snap) {
        if (process.env.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.warn("[decision] snapshot not found", { snapshotKey: key, id, ts });
        }
        return;
      }

      // Restore decision state
      setLoops(Array.isArray(snap.loops) ? snap.loops : []);
      setActiveLoopId(snap.activeLoopId ?? null);
      setSelectedLoopId(snap.activeLoopId ?? null);

      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.debug("[decision] applied snapshot", snap.id, snap.timestamp);
      }
    },
    [snapshots, projectId]
  );

  useEffect(() => {
    if (snapshots.length === 0) return;
    if (!compareAId) {
      const aDefault = snapshots[Math.max(0, snapshots.length - 2)] ?? snapshots[0];
      setCompareAId(aDefault ? `${aDefault.id}:${aDefault.timestamp}` : null);
    }
    if (!compareBId && snapshots.length > 1) {
      const bDefault = snapshots[snapshots.length - 1];
      setCompareBId(bDefault ? `${bDefault.id}:${bDefault.timestamp}` : null);
    }
  }, [snapshots, compareAId, compareBId]);

  useEffect(() => {
    const parseKey = (k: string) => {
      const parts = k.split(":");
      if (parts.length === 2) {
        const id = parts[0];
        const ts = Number(parts[1]);
        return { id, ts: Number.isFinite(ts) ? ts : null };
      }
      return { id: k, ts: null as number | null };
    };

    const snapA = compareAId
      ? (() => {
          const { id, ts } = parseKey(compareAId);
          return snapshots.find((s) => (ts !== null ? s.id === id && s.timestamp === ts : s.id === id)) ?? null;
        })()
      : null;

    const snapB = compareBId
      ? (() => {
          const { id, ts } = parseKey(compareBId);
          return snapshots.find((s) => (ts !== null ? s.id === id && s.timestamp === ts : s.id === id)) ?? null;
        })()
      : null;

    if (snapA && snapB) {
      setDiffState(diffSnapshots(snapA, snapB));
    } else {
      setDiffState(null);
    }
  }, [snapshots, compareAId, compareBId]);
  const lastSnapshotRef = useRef<string | null>(null);
  const effectiveActiveLoopId = selectedLoopId ?? activeLoopId;
  const selectLoop = useCallback((id: string | null) => {
    setSelectedLoopId(id);
    if (id) setActiveLoopId(id);
  }, []);
  const lastAutoAssistantId = useRef<string | null>(null);
  const selectedObjectInfoRef = useRef<typeof selectedObjectInfo>(null);
  const inflightProfileRef = useRef<Record<string, Promise<any> | null>>({});
  const pendingVisualPatchesRef = useRef<null | { memory: MemoryStateV1; targets: string[] }>(null);
  const selectedSetterRef = useRef<(id: string | null) => void>(() => {});
  const handleSelectedChangeRef = useRef<(id: string | null) => void>(() => {});
  const selectedIdRef = useRef<string | null>(null);
  const overridesRef = useRef<Record<string, any>>({});
  const setOverrideRef = useRef<(id: string, patch: any) => void>(() => {});
  const setViewMode = useSetViewMode();
  const buildActiveProjectState = useCallback(
    (projectIdForState: string): WorkspaceProjectState => {
      const inferred = inferProjectMetaFromScene(sceneJson);
      const nextId = projectIdForState || inferred.projectId || DEFAULT_PROJECT_ID;
      return {
        id: nextId,
        name: inferred.name || nextId,
        domain: inferred.domain,
        semanticObjectMeta: objectProfiles ?? {},
        chat: {
          messages: normalizeMessages(messages),
          activeMode,
          episodeId,
        },
        scene: {
          sceneJson,
          selectedObjectId: selectedObjectIdState ?? null,
          focusedId: focusedId ?? null,
          focusMode,
          focusPinned,
          loops: Array.isArray(loops) ? loops : [],
          activeLoopId: activeLoopId ?? null,
          selectedLoopId: selectedLoopId ?? null,
          objectUxById: objectUxById ?? {},
          overrides: overridesRef.current ?? {},
        },
        intelligence: {
          kpi,
          conflicts: Array.isArray(conflicts) ? conflicts : [],
          objectSelection,
          memoryInsights,
          riskPropagation,
          strategicAdvice,
          strategyKpi,
          decisionCockpit,
          productModeContext,
          aiReasoning,
          platformAssembly,
          autonomousExploration,
          opponentModel,
          strategicPatterns,
          responseData,
          sourceLabel,
          lastAnalysisSummary,
        },
      };
    },
    [
      activeMode,
      activeLoopId,
      conflicts,
      episodeId,
      focusedId,
      focusMode,
      focusPinned,
      kpi,
      lastAnalysisSummary,
      loops,
      memoryInsights,
      messages,
      objectProfiles,
      objectSelection,
      objectUxById,
      opponentModel,
      responseData,
      riskPropagation,
      sceneJson,
      selectedLoopId,
      selectedObjectIdState,
      sourceLabel,
      strategicAdvice,
      strategyKpi,
      decisionCockpit,
      productModeContext,
      aiReasoning,
      platformAssembly,
      autonomousExploration,
      strategicPatterns,
    ]
  );

  const applyWorkspaceProjectState = useCallback(
    (project: WorkspaceProjectState) => {
      projectHydratingRef.current = true;
      try {
        setActiveMode(project?.chat?.activeMode ?? "business");
        setEpisodeId(project?.chat?.episodeId ?? null);
        setMessages(normalizeMessages(project?.chat?.messages ?? []));

        const nextScene = project?.scene?.sceneJson ? normalizeSceneJson(project.scene.sceneJson) : null;
        setSceneJson(nextScene);
        setSelectedObjectIdState(project?.scene?.selectedObjectId ?? null);
        setFocusedId(project?.scene?.focusedId ?? null);
        setFocusMode(project?.scene?.focusMode ?? "all");
        setPinnedSafe(!!project?.scene?.focusPinned, project?.scene?.focusedId ?? null);
        setLoops(Array.isArray(project?.scene?.loops) ? project.scene.loops : []);
        setActiveLoopId(project?.scene?.activeLoopId ?? null);
        setSelectedLoopId(project?.scene?.selectedLoopId ?? null);
        setObjectUxById(project?.scene?.objectUxById ?? {});

        clearAllOverridesRef.current?.();
        const nextOverrides = project?.scene?.overrides ?? {};
        Object.entries(nextOverrides).forEach(([id, patch]) => {
          setOverrideRef.current?.(id, patch);
        });

        setKpi(project?.intelligence?.kpi ?? null);
        setConflicts(Array.isArray(project?.intelligence?.conflicts) ? project.intelligence.conflicts : []);
        setObjectSelection(project?.intelligence?.objectSelection ?? null);
        setMemoryInsights(project?.intelligence?.memoryInsights ?? null);
        setRiskPropagation(project?.intelligence?.riskPropagation ?? null);
        setStrategicAdvice(project?.intelligence?.strategicAdvice ?? null);
        setStrategyKpi(project?.intelligence?.strategyKpi ?? null);
        setDecisionCockpit(project?.intelligence?.decisionCockpit ?? null);
        setProductModeContext(project?.intelligence?.productModeContext ?? null);
        setProductModeId(String(project?.intelligence?.productModeContext?.mode_id ?? "manager"));
        setAiReasoning(project?.intelligence?.aiReasoning ?? null);
        setPlatformAssembly(project?.intelligence?.platformAssembly ?? null);
        setAutonomousExploration(project?.intelligence?.autonomousExploration ?? null);
        setOpponentModel(project?.intelligence?.opponentModel ?? null);
        setStrategicPatterns(project?.intelligence?.strategicPatterns ?? null);
        setResponseData(project?.intelligence?.responseData ?? null);
        setSourceLabel(project?.intelligence?.sourceLabel ?? null);
        setLastAnalysisSummary(project?.intelligence?.lastAnalysisSummary ?? null);

        const selectedId = project?.scene?.selectedObjectId ?? null;
        selectedSetterRef.current?.(selectedId);
      } finally {
        window.setTimeout(() => {
          projectHydratingRef.current = false;
        }, 0);
      }
    },
    [setFocusedId, setFocusMode, setPinnedSafe]
  );

  const activateProject = useCallback(
    (nextProjectIdRaw: string) => {
      const nextProjectId = String(nextProjectIdRaw || "").trim().toLowerCase() || DEFAULT_PROJECT_ID;
      if (nextProjectId === activeProjectId) return;

      setWorkspaceProjects((prev) => {
        const currentState = buildActiveProjectState(activeProjectId);
        const withCurrent = { ...prev, [activeProjectId]: currentState };
        const nextProject = withCurrent[nextProjectId] ?? createEmptyProjectState(nextProjectId, nextProjectId);
        window.setTimeout(() => applyWorkspaceProjectState(nextProject), 0);
        return { ...withCurrent, [nextProjectId]: nextProject };
      });
      setActiveProjectId(nextProjectId);
    },
    [activeProjectId, applyWorkspaceProjectState, buildActiveProjectState]
  );

  useEffect(() => {
    const onActivateProject = (event: Event) => {
      const detail = (event as CustomEvent<{ projectId?: string }>).detail;
      const id = String(detail?.projectId ?? "").trim();
      if (!id) return;
      activateProject(id);
    };
    window.addEventListener("nexora:activate-project", onActivateProject as EventListener);
    return () =>
      window.removeEventListener("nexora:activate-project", onActivateProject as EventListener);
  }, [activateProject]);

  useEffect(() => {
    const next = buildActiveModeContext({
      modeId: productModeId,
      projectDomain: String((sceneJson as any)?.meta?.domain ?? "").trim() || undefined,
      workspaceId: activeWorkspaceId,
      projectId: activeProjectId,
    });
    setProductModeContext(next);
  }, [productModeId, sceneJson, activeWorkspaceId, activeProjectId]);

  useEffect(() => {
    const onSetProductMode = (event: Event) => {
      const detail = (event as CustomEvent<{ modeId?: string }>).detail;
      const candidate = String(detail?.modeId ?? "").trim().toLowerCase();
      if (!candidate) return;
      setProductModeId(getProductMode(candidate).id);
    };
    window.addEventListener("nexora:set-product-mode", onSetProductMode as EventListener);
    return () =>
      window.removeEventListener("nexora:set-product-mode", onSetProductMode as EventListener);
  }, []);

  useEffect(() => {
    const onScannerResult = (event: Event) => {
      const detail = (event as CustomEvent<{ result?: ScannerResult }>).detail;
      const result = detail?.result;
      if (!result) return;

      const currentActive = buildActiveProjectState(activeProjectId);
      const currentWorkspace = {
        id: activeWorkspaceId,
        activeProjectId,
        projects: {
          ...workspaceProjects,
          [activeProjectId]: currentActive,
        },
      };
      const applied = applyScannerResultToWorkspace(currentWorkspace, result);

      setActiveWorkspaceId(applied.workspace.id || DEFAULT_WORKSPACE_ID);
      setWorkspaceProjects(applied.workspace.projects);
      setActiveProjectId(applied.activeProjectId);
      applyWorkspaceProjectState(applied.project);

      const msg = applied.created
        ? `Scanner created project: ${applied.project.name}.`
        : `Scanner enriched project: ${applied.project.name}.`;
      const warn = applied.warnings.length ? ` Warnings: ${applied.warnings.join(" ")}` : "";
      setMessages((m) => appendMessages(m, [makeMsg("assistant", `${msg}${warn}`)]));
    };

    window.addEventListener("nexora:scanner-result", onScannerResult as EventListener);
    return () =>
      window.removeEventListener("nexora:scanner-result", onScannerResult as EventListener);
  }, [
    activeProjectId,
    activeWorkspaceId,
    applyWorkspaceProjectState,
    buildActiveProjectState,
    workspaceProjects,
  ]);

  useEffect(() => {
    const onScannerSource = (event: Event) => {
      if (!isFeatureEnabled(environmentConfig, "scanner_create") && !isFeatureEnabled(environmentConfig, "scanner_enrich")) {
        setMessages((m) =>
          appendMessages(m, [makeMsg("assistant", "Scanner source ingestion is disabled in this environment.")])
        );
        return;
      }
      const detail = (event as CustomEvent<{ input?: ScannerInput }>).detail;
      const input = detail?.input;
      if (!input || typeof input !== "object") return;
      const result = scanSystemToScannerResult(input);

      const currentActive = buildActiveProjectState(activeProjectId);
      const currentWorkspace = {
        id: activeWorkspaceId,
        activeProjectId,
        projects: {
          ...workspaceProjects,
          [activeProjectId]: currentActive,
        },
      };
      const applied = applyScannerResultToWorkspace(currentWorkspace, result);

      setActiveWorkspaceId(applied.workspace.id || DEFAULT_WORKSPACE_ID);
      setWorkspaceProjects(applied.workspace.projects);
      setActiveProjectId(applied.activeProjectId);
      applyWorkspaceProjectState(applied.project);

      const msg = applied.created
        ? `Scanner generated project: ${applied.project.name}.`
        : `Scanner enriched project: ${applied.project.name}.`;
      const warn = applied.warnings.length ? ` Warnings: ${applied.warnings.join(" ")}` : "";
      setMessages((m) => appendMessages(m, [makeMsg("assistant", `${msg}${warn}`)]));
    };

    window.addEventListener("nexora:scanner-source", onScannerSource as EventListener);
    return () => window.removeEventListener("nexora:scanner-source", onScannerSource as EventListener);
  }, [
    activeProjectId,
    activeWorkspaceId,
    applyWorkspaceProjectState,
    buildActiveProjectState,
    environmentConfig,
    workspaceProjects,
  ]);

  useEffect(() => {
    const onExternalIntegrationResult = (event: Event) => {
      if (
        !isFeatureEnabled(environmentConfig, "enterprise_integrations") ||
        !environmentConfig.integration_policy.allow_external_integrations
      ) {
        setMessages((m) =>
          appendMessages(m, [makeMsg("assistant", "External integrations are disabled in this environment.")])
        );
        return;
      }
      const detail = (event as CustomEvent<{ result?: ExternalIntegrationResult }>).detail;
      const result = detail?.result;
      if (!result || typeof result !== "object") return;

      const currentActive = buildActiveProjectState(activeProjectId);
      const currentWorkspace = {
        id: activeWorkspaceId,
        activeProjectId,
        projects: {
          ...workspaceProjects,
          [activeProjectId]: currentActive,
        },
      };
      const applied = applyExternalIntegrationToWorkspace(currentWorkspace, result);

      setActiveWorkspaceId(applied.workspace.id || DEFAULT_WORKSPACE_ID);
      setWorkspaceProjects(applied.workspace.projects);
      setActiveProjectId(applied.activeProjectId);
      applyWorkspaceProjectState(applied.project);

      const modeLabel = String(result.mode ?? "enrich");
      const sourceLabel = String(result.source?.label ?? result.source?.id ?? "external source");
      const warn = applied.warnings.length ? ` Warnings: ${applied.warnings.join(" ")}` : "";
      const mappingStatus = String(applied.integration.mapping?.status ?? "mapped");
      setMessages((m) =>
        appendMessages(
          m,
          [
            makeMsg(
              "assistant",
              `External integration (${modeLabel}) applied from ${sourceLabel}. Mapping status: ${mappingStatus}.${warn}`
            ),
          ]
        )
      );
    };

    window.addEventListener("nexora:external-integration-result", onExternalIntegrationResult as EventListener);
    return () =>
      window.removeEventListener("nexora:external-integration-result", onExternalIntegrationResult as EventListener);
  }, [
    activeProjectId,
    activeWorkspaceId,
    applyWorkspaceProjectState,
    buildActiveProjectState,
    environmentConfig,
    workspaceProjects,
  ]);
  const pickSceneLabel = useCallback(
    (id: string) => {
      const objs: any[] = Array.isArray(sceneJson?.scene?.objects) ? (sceneJson as any).scene.objects : [];
      const found = objs.find((o) => (o?.id ?? o?.name) === id);
      return (found?.label as string) ?? (found?.name as string) ?? id;
    },
    [sceneJson?.scene?.objects]
  );
  const postAssistantHint = useCallback(
    (id: string, info?: { label?: string; summary?: string; one_liner?: string }) => {
      if (lastAutoAssistantId.current === id) return;
      lastAutoAssistantId.current = id;
      const label = info?.label ?? pickSceneLabel(id);
      const summary = info?.summary ?? "";
      const oneLiner = info?.one_liner ?? "";
      const line =
        summary && summary.trim().length > 0
          ? `${label} — ${summary}`
          : oneLiner && oneLiner.trim().length > 0
          ? `${label} — ${oneLiner}`
          : `Selected: ${label}.`;
      setMessages((m) => appendMessages(m, [makeMsg("assistant", `${line} What would you like to adjust?`)]));
    },
    [pickSceneLabel]
  );
  const tempHighlightRef = useRef<Record<string, { prevScale?: number }>>({});
  const selectFlashTimersRef = useRef<Record<string, number>>({});
  const flashSelectHighlight = useCallback((id: string) => {
    if (!id || !setOverrideRef.current) return;
    const prev = overridesRef.current[id] ?? {};
    const prevScale = typeof prev.scale === "number" ? prev.scale : undefined;
    const prevColor = typeof prev.color === "string" ? prev.color : undefined;
    const nextScale = Math.min(2, (prevScale ?? 1) * 1.12);
    const patch: { scale: number; color?: string } = { scale: nextScale };
    if (prevColor) patch.color = "#ffd166";

    const existingTimer = selectFlashTimersRef.current[id];
    if (existingTimer) window.clearTimeout(existingTimer);

    setOverrideRef.current(id, patch);
    selectFlashTimersRef.current[id] = window.setTimeout(() => {
      const restore: { scale: number; color?: string } = {
        scale: typeof prevScale === "number" ? prevScale : 1,
      };
      if (prevColor) restore.color = prevColor;
      setOverrideRef.current?.(id, restore);
      delete selectFlashTimersRef.current[id];
    }, 200);
  }, []);

  const handleSelectedChange = useCallback(
    (id: string | null) => {
      // Prevent infinite loops: ignore repeated updates for the same selection.
      // IMPORTANT: compare against state, not the mutable ref (some callers update the ref before calling us).
      if (id && selectedObjectIdState === id) {
        return;
      }
      if (selectionLocked && selectedObjectIdState) {
        if (!id || selectedObjectIdState !== id) return;
      }
      if (!id) {
        setSelectedObjectIdState(null);
        setSelectedObjectInfo(null);
        return;
      }

      // Selection should not force camera focus mode; keep object anchored under pointer.
      setSelectedObjectIdState(id);
      flashSelectHighlight(id);
      setViewMode("input");

      // Pin = lock focus. When pinned, clicking other objects does NOT change focusedId.
      if (focusPinned) {
        applyPinToStore(true, id);
      }
      if (focusPinned || focusMode !== "all") {
        setFocusedId((prev) => {
          if (focusPinned && prev) return prev;
          return id;
        });
      }
      updateSelectedObjectInfo(id);

      const existingProfile = objectProfiles[id];
      const sceneLabel = pickSceneLabel(id);
      const prevInfo = selectedObjectInfoRef.current;
      const label = existingProfile?.label ?? sceneLabel ?? id;
      const ux = getUxForObject(id) ?? undefined;
      const baseInfo = {
        id,
        label: resolveObjectLabel(id) ?? label,
        tags: existingProfile?.tags ?? prevInfo?.tags ?? [],
        summary: existingProfile?.summary ?? prevInfo?.summary ?? "",
        one_liner: existingProfile?.one_liner ?? prevInfo?.one_liner,
        type: prevInfo?.type,
        color: prevInfo?.color,
        scale: typeof ux?.scale === "number" ? ux?.scale : prevInfo?.scale,
        override: prevInfo?.override,
        base_color: ux?.base_color,
        shape: ux?.shape,
        opacity: ux?.opacity,
      };

      if (existingProfile) {
        setSelectedObjectInfo(baseInfo);
        postAssistantHint(id, baseInfo);
        return;
      }

      if (!inflightProfileRef.current[id]) {
        inflightProfileRef.current[id] = fetchObjectProfile(id).finally(() => {
          inflightProfileRef.current[id] = null;
        });
      }

      inflightProfileRef.current[id]
        ?.then((profile: any) => {
          if (!profile) return;
          const merged = {
            ...baseInfo,
            label: profile.label ?? baseInfo.label,
            summary: profile.summary ?? baseInfo.summary,
            tags: Array.isArray(profile.tags) ? profile.tags : baseInfo.tags,
            one_liner: profile.one_liner ?? baseInfo.one_liner,
            ux: profile.ux,
          };
          setObjectProfiles((prev) => ({
            ...prev,
            [id]: {
              id,
              label: merged.label ?? id,
              summary: merged.summary ?? "",
              tags: Array.isArray(merged.tags) ? (merged.tags as string[]) : [],
              one_liner: merged.one_liner,
              ux: merged.ux,
            },
          }));
          setSelectedObjectInfo({
            ...merged,
            base_color: merged.ux?.base_color ?? baseInfo.base_color,
            shape: merged.ux?.shape ?? baseInfo.shape,
            opacity: baseInfo.opacity,
            scale: baseInfo.scale,
          });
          postAssistantHint(id, merged);
        })
        .catch(() => {
          setSelectedObjectInfo(baseInfo);
          postAssistantHint(id, baseInfo);
        });
    },
    [
      focusPinned,
      focusMode,
      flashSelectHighlight,
      applyPinToStore,
      getUxForObject,
      objectProfiles,
      pickSceneLabel,
      postAssistantHint,
      resolveObjectLabel,
      selectionLocked,
      updateSelectedObjectInfo,
      setFocusedId,
      setViewMode,
      selectedObjectIdState,
    ]
  );
  useEffect(() => {
    const onSetFocusObject = (event: Event) => {
      const detail = (event as CustomEvent<{ id?: string }>).detail;
      const id = typeof detail?.id === "string" ? detail.id.trim() : "";
      if (!id) return;
      selectedSetterRef.current(id);
      setFocusedId(id);
      setFocusMode("selected");
      updateSelectedObjectInfo(id);
      setViewMode("input");
    };
    window.addEventListener("nexora:set-focus-object", onSetFocusObject as EventListener);
    return () => window.removeEventListener("nexora:set-focus-object", onSetFocusObject as EventListener);
  }, [setFocusMode, setViewMode, updateSelectedObjectInfo]);
  useEffect(() => {
    const onApplyFragilityScan = (event: Event) => {
      const detail = (event as CustomEvent<{ result?: FragilityScanResponse | null }>).detail;
      const result = detail?.result;
      if (!result?.ok) return;

      setResponseData((prev: Record<string, unknown> | null) => ({
        ...(prev ?? {}),
        fragility_scan: result,
        fragility: {
          score: result.fragility_score,
          level: result.fragility_level,
          summary: result.summary,
          drivers: Object.fromEntries(
            (result.drivers ?? []).map((driver) => [driver.id, driver.score])
          ),
        },
      }));

      setSceneJson((prev) => normalizeSceneJson(applyFragilityScenePayload(result.scene_payload, prev)));

      const nextFocusId =
        result.scene_payload?.suggested_focus?.[0] ??
        result.suggested_objects?.[0] ??
        null;

      if (!nextFocusId) return;
      selectedSetterRef.current(nextFocusId);
      setSelectedObjectIdState(nextFocusId);
      setFocusedId(nextFocusId);
      setFocusMode("selected");
      updateSelectedObjectInfo(nextFocusId);
      setViewMode("input");
    };

    window.addEventListener("nexora:apply-fragility-scan", onApplyFragilityScan as EventListener);
    return () =>
      window.removeEventListener("nexora:apply-fragility-scan", onApplyFragilityScan as EventListener);
  }, [setFocusMode, setViewMode, updateSelectedObjectInfo]);
  const isRestoringRef = useRef(false);
  const [overridesVersion, setOverridesVersion] = useState(0);
  const autoBackupTimerRef = useRef<number | null>(null);
  const clearAllOverridesRef = useRef<() => void>(() => {});
  const pruneOverridesRef = useRef<(ids: string[]) => void>(() => {});
  const handleCompanyChange = useCallback((next: string) => {
    setCompanyId(next);
    setActiveCompanyIdState(next);
  }, []);
  const toggleSelectionLock = useCallback(() => {
    setSelectionLocked((v) => !v);
  }, []);
  const handleObjectHoverStart = useCallback((id: string) => {
    if (!id) return;
    if (tempHighlightRef.current[id]) return;
    const prevScale = overridesRef.current[id]?.scale;
    tempHighlightRef.current[id] = { prevScale };
    const baseScale = typeof prevScale === "number" ? prevScale : 1;
    const nextScale = Math.min(2, baseScale * 1.08);
    setOverrideRef.current?.(id, { scale: nextScale });
  }, []);
  const handleObjectHoverEnd = useCallback((id: string) => {
    if (!id) return;
    const prev = tempHighlightRef.current[id];
    if (!prev) return;
    const restoreScale = typeof prev.prevScale === "number" ? prev.prevScale : 1;
    setOverrideRef.current?.(id, { scale: restoreScale });
    delete tempHighlightRef.current[id];
  }, []);
  const preset = config?.scene_preset ?? null;
  const camPos =
    sceneJson?.scene?.camera?.pos ?? ([0, 3, 8] as [number, number, number]);

  // =====================
  // Nexora MVP Graph (backend mapping → DecisionGraph3D)
  // Source: scene_json.scene.nexora_mvp (added by backend/main.py)
  // We keep this strictly additive and non-breaking.
  // =====================
  const nexoraMvp = (sceneJson as any)?.scene?.nexora_mvp ?? null;

  // Map Nexora MVP objects to the existing SceneCanvas object ids.
  // Goal: make reactions happen on your real cubes/objects (professional), not a separate overlay.
  const mapNexoraIdToSceneId = useCallback((id: string) => {
    const key = String(id || "").trim();
    if (!key) return null;
    // Backend mapping emits: obj_time, obj_inventory, obj_quality
    // Your existing business baseline objects typically include: obj_inventory, obj_delivery, obj_risk_zone
    if (key === "obj_inventory") return "obj_inventory";
    if (key === "obj_time") return "obj_delivery"; // time pressure visualized on delivery object
    if (key === "obj_quality") return "obj_risk_zone"; // quality risk visualized on risk zone (MVP)
    return key;
  }, []);

  const nexoraGraphObjects = useMemo(() => {
    const list: any[] = Array.isArray(nexoraMvp?.objects) ? nexoraMvp.objects : [];
    return list
      .map((o: any) => {
        const id = String(o?.id ?? "").trim();
        if (!id) return null;
        const label = typeof o?.label === "string" && o.label.trim().length ? o.label : id;
        // Backend mapping uses `pos`; accept `position` (array or {x,y,z}) too for safety.
        const p = Array.isArray(o?.pos)
          ? o.pos
          : Array.isArray(o?.position)
          ? o.position
          : o?.position && typeof o.position === "object"
          ? [o.position.x, o.position.y, o.position.z]
          : [0, 0, 0];
        const pos: [number, number, number] = [Number(p[0] ?? 0), Number(p[1] ?? 0), Number(p[2] ?? 0)];
        const intensity = clamp(Number(o?.intensity ?? 0), 0, 1);
        const state = (o?.state === "stable" || o?.state === "warning" || o?.state === "critical") ? o.state : "stable";
        const opacity = Number.isFinite(o?.opacity) ? clamp(Number(o.opacity), 0, 1) : undefined;
        const visible = typeof o?.visible === "boolean" ? o.visible : true;
        return { id, label, pos, intensity, state, opacity, visible };
      })
      .filter(Boolean) as any[];
  }, [nexoraMvp]);

  const nexoraGraphLoops = useMemo(() => {
    const list: any[] = Array.isArray(nexoraMvp?.loops) ? nexoraMvp.loops : [];
    return list
      .map((l: any) => {
        const id = String(l?.id ?? "").trim();
        if (!id) return null;
        const label = typeof l?.label === "string" ? l.label : undefined;
        const path = Array.isArray(l?.path) ? l.path.map((x: any) => String(x)) : [];
        if (path.length < 2) return null;
        const intensity = clamp(Number(l?.intensity ?? 0), 0, 1);
        const pulseSpeed = Number.isFinite(l?.pulseSpeed) ? Number(l.pulseSpeed) : undefined;
        const active = typeof l?.active === "boolean" ? l.active : true;
        return { id, label, path, intensity, pulseSpeed, active };
      })
      .filter(Boolean) as any[];
  }, [nexoraMvp]);
  const applyOverridePatch = useCallback(
    (id: string, patch: { scale?: number; opacity?: number }) => {
      setOverrideRef.current?.(id, patch);
    },
    []
  );

  useEmotionalFxEngine({
    sceneReady: !!sceneJson,
    mapNexoraIdToSceneId,
    nexoraMvp,
    effectiveActiveLoopId,
    loops,
    kpi,
    setOverride: applyOverridePatch,
  });

  // Derived: which loops are currently visible based on focus + showLoops
  const visibleLoops = useMemo(() => {
    if (!showLoops) return [];
    if (!Array.isArray(loops)) return [];
    const effectiveFocusId = focusMode === "selected" && focusedId ? focusedId : null;
    if (!effectiveFocusId) return loops;
    return loops.filter(
      (loop) =>
        loop &&
        Array.isArray((loop as any).edges) &&
        (loop as any).edges.some((edge: any) => edge && (edge.from === effectiveFocusId || edge.to === effectiveFocusId))
    );
  }, [loops, focusMode, focusedId, showLoops]);
  const strategicState = useStrategicRadar({
    loops,
    kpi,
    memory,
    activeLoopId: effectiveActiveLoopId,
  });
  const lastRiskLevelRef = useRef<string | null>(null);
  const riskResult = useMemo(() => {
    return computeRiskLevel({
      strategicState,
      loops: visibleLoops,
      kpis: kpi ? [kpi] : [],
    });
  }, [strategicState, visibleLoops, kpi]);

  const rankRiskLevel = useCallback((l: string | null) => {
    if (l === "critical") return 3;
    if (l === "high") return 2;
    if (l === "medium") return 1;
    return 0;
  }, []);

  // Persist risk events only when risk level escalates.
  useEffect(() => {
    const prev = lastRiskLevelRef.current;
    if (
      riskResult.level !== prev &&
      rankRiskLevel(riskResult.level) > rankRiskLevel(prev)
    ) {
      appendRiskEvent({ ts: Date.now(), ...riskResult });
    }
    lastRiskLevelRef.current = riskResult.level;
  }, [riskResult, rankRiskLevel]);

  // UI alert state (only show for high/critical and prefer stronger signals)
  useEffect(() => {
    setAlert((prev) => {
      if (riskResult.level !== "high" && riskResult.level !== "critical") {
        return null;
      }
      if (!prev) return riskResult;
      const prevRank = rankRiskLevel(prev.level);
      const nextRank = rankRiskLevel(riskResult.level);
      if (nextRank > prevRank) return riskResult;
      if (nextRank === prevRank && riskResult.score > prev.score + 5) return riskResult;
      return prev;
    });
  }, [riskResult, rankRiskLevel]);
  const starCount = Math.round(800 + (6000 - 800) * Math.max(0, Math.min(1, prefs.starDensity)));
  const backgroundMode = prefs.theme;
  const cameraMode = prefs.orbitMode === "manual" ? "fixed" : "orbit";
  const starCountControl = Math.round(Math.max(0, Math.min(2000, prefs.starDensity * 2000)));
  const setBackgroundMode = useCallback((mode: "day" | "night" | "stars") => {
    setPrefs((prev) => ({ ...prev, theme: mode }));
  }, [setPrefs]);
  const setCameraMode = useCallback((mode: "orbit" | "fixed") => {
    const next = mode === "fixed" ? "manual" : "auto";
    setPrefs((prev) => ({ ...prev, orbitMode: next }));
  }, [setPrefs]);
  const setStarCount = useCallback((value: number) => {
    const next = clamp(Number(value) / 2000, 0, 1);
    setPrefs((prev) => ({ ...prev, starDensity: next }));
  }, [setPrefs]);
  const lastCompanyRef = useRef<string | null>(null);
  useEffect(() => {
    const cid = config?.company_id || null;
    if (!cid) return;
    if (lastCompanyRef.current === cid) return;
    lastCompanyRef.current = cid;
    if (!preset) return;
    if (preset.backgroundMode) setBackgroundMode(preset.backgroundMode);
    if (typeof preset.starCount === "number") setStarCount(preset.starCount);
    if (preset.cameraMode) setCameraMode(preset.cameraMode);
    if (typeof preset.showAxes === "boolean") setShowAxes(preset.showAxes);
    if (typeof preset.showGrid === "boolean") setShowGrid(preset.showGrid);
    if (typeof preset.showCameraHelper === "boolean") setShowCameraHelper(preset.showCameraHelper);
  }, [
    config?.company_id,
    preset?.backgroundMode,
    preset?.starCount,
    preset?.cameraMode,
    preset?.showAxes,
    preset?.showGrid,
    preset?.showCameraHelper,
  ]);
  const updateObjectUx = useCallback(
    (id: string, patch: { opacity?: number; scale?: number }) => {
      if (!id) return;
      setObjectUxById((prev) => ({
        ...prev,
        [id]: { ...(prev[id] ?? {}), ...patch },
      }));
      setSelectedObjectInfo((prev) => {
        if (!prev || prev.id !== id) return prev;
        return { ...prev, ...patch };
      });
    },
    []
  );

  const applyUICommands = useCallback(
    (commands: UICommand[]) => {
      if (!Array.isArray(commands)) return;
      for (const cmd of commands) {
        if (!cmd || typeof cmd !== "object") continue;
        if (cmd.type === "select") {
          const id = cmd.id ?? null;
          selectedSetterRef.current?.(id);
          // Use the real selection policy handler to keep all derived UI state consistent.
          handleSelectedChange(id);
          continue;
        }
        if (cmd.type === "pin") {
          if (typeof cmd.id === "string") focusActions?.pin?.(cmd.id);
          continue;
        }
        if (cmd.type === "unpin") {
          focusActions?.unpin?.();
          continue;
        }
        if (cmd.type === "setObjectUx") {
          if (typeof cmd.id === "string" && cmd.patch && typeof cmd.patch === "object") {
            updateObjectUx(cmd.id, cmd.patch);
          }
          continue;
        }
        if (cmd.type === "toast") {
          if (typeof cmd.message === "string" && cmd.message.trim()) {
            setMessages((m) => appendMessages(m, [makeMsg("assistant", cmd.message)]));
          }
          continue;
        }
      }
    },
    [focusActions, handleSelectedChange, updateObjectUx]
  );

  const runMonteCarloOnce = useCallback(async () => {
    if (mcLoading) return;
    if (!episodeId) {
      setMcError("No episode_id yet. Send one chat message first to create an episode.");
      return;
    }

    setMcLoading(true);
    setMcError(null);

    try {
      const res = await fetch(`${BACKEND_BASE}/montecarlo/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ episode_id: episodeId, n: 200, sigma: 0.08, seed: 7 }),
      });

      const j = await res.json().catch(() => null);
      const data = (j && typeof j === "object" ? ((j as any).data ?? j) : null) as any;

      if (!res.ok || !data || data?.ok === false || data?.error || data?.detail?.error) {
        const msg =
          data?.detail?.error?.message ||
          data?.error?.message ||
          (typeof data?.detail === "string" ? data.detail : null) ||
          `Monte Carlo failed (HTTP ${res.status})`;
        setMcError(String(msg));
        return;
      }

      setMcResult(data?.result ?? null);
      setMcReport(data?.manager_report ?? null);
    } catch (e: any) {
      setMcError(e?.message ?? "Monte Carlo request failed");
    } finally {
      setMcLoading(false);
    }
  }, [episodeId, mcLoading]);

  const simulateStep = useCallback(async () => {
    if (loading) return;
    // Focus requirement
    if (focusMode === "selected") {
      const focusCandidate = focusedId;
      if (!focusCandidate) {
        setMessages((m) => appendMessages(m, [makeMsg("assistant", "No focused object. Click an object first.")]));
        setLastActions([]);
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    setSimLastError(null);
    try {
      const payload = buildChatRequestPayload("__tick__");
      const raw = await chatToBackend(payload);
      const data = raw as BackendChatResponse;
      setResponseData(data);
      if (!data || (data as any).ok === false || (data as any).error) {
        setSimLastError(((data as any)?.error?.message as string | undefined) ?? "Simulation tick failed");
        setLoading(false);
        return;
      }
      const viewModel = deriveProductFlowViewModel(data, sceneJson);
      const nextActions = Array.isArray(data.actions) ? (data.actions as any[]) : [];
      setLastActions(nextActions);
      applyProductFlowViewModel(data, viewModel, { applyActionsToScene: true, syncSceneState: false });
      if (typeof data.reply === "string" && data.reply.trim().length > 0) {
        setMessages((m) => appendMessages(m, [makeMsg("assistant", data.reply ?? "")]));
      }
    } catch (err: any) {
      setSimLastError(err?.message ?? "Simulation tick failed");
    } finally {
      setLoading(false);
    }
  }, [
    activeMode,
    applyProductFlowViewModel,
    buildChatRequestPayload,
    deriveProductFlowViewModel,
    focusMode,
    focusedId,
    loading,
    sceneJson,
  ]);

  useEffect(() => {
    if (!simRunning) return;
    const intervalMs = Math.max(200, 1200 / Math.max(0.1, simSpeed));
    const id = window.setInterval(() => {
      simulateStep();
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [simRunning, simSpeed, simulateStep]);

  const handleAddInventoryInstance = useCallback(() => {
    const createdId = `obj_inventory_${Date.now()}`;
    setSceneJson((prev) => {
      if (!prev) return prev;
      const next = { ...prev, scene: { ...prev.scene } };
      const objs = Array.isArray(next.scene.objects) ? [...next.scene.objects] : [];
      const idx = objs.filter((o: any) => (o.type === "type_inventory" || o.id?.startsWith("obj_inventory"))).length + 1;
      const ux = getUxForObject(createdId) ?? { shape: "cube", base_color: "#3498db" };
      objs.push({
        id: createdId,
        type: "box",
        color: ux.base_color,
        scale: 1,
        emphasis: 0,
        position: [objs.length * 1.6, 0, 0],
      });
      next.scene.objects = objs;
      return next;
    });
    selectedSetterRef.current(createdId);
    setFocusedId((prev) => prev ?? createdId);
    setFocusMode("selected");
  }, [getUxForObject, setFocusedId, setFocusMode]);

  const handleAddLoopFromTemplate = useCallback(
    (type: LoopType) => {
      const loop = makeLoopFromTemplate(type);
      setLoops((prev) => {
        const next = Array.isArray(prev) ? [...prev] : [];
        next.push(loop);
        return next;
      });
      selectLoop(loop.id);
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.debug("[templates] added loop", loop.type, loop.id);
      }
    },
    [selectLoop]
  );
  const toggleFocusMode = useCallback(() => {
    setFocusMode((m) => {
      const next = m === "all" ? "selected" : "all";
      applyFocusModeToStore(next);
      if (next === "all" && !focusPinned) {
        setFocusedId(null);
      }
      return next;
    });
  }, [applyFocusModeToStore, focusPinned, setFocusedId]);

  useEffect(() => {
    handleSelectedChangeRef.current = handleSelectedChange;
  }, [handleSelectedChange]);

  useEffect(() => {
    const workspace = loadWorkspaceSnapshot();
    if (workspace?.projects && typeof workspace.projects === "object") {
      const workspaceId = String(workspace.id || DEFAULT_WORKSPACE_ID);
      const nextActiveProjectId = String(workspace.activeProjectId || DEFAULT_PROJECT_ID);
      setActiveWorkspaceId(workspaceId);
      setWorkspaceProjects(workspace.projects);
      setActiveProjectId(nextActiveProjectId);
      const restored =
        workspace.projects[nextActiveProjectId] ??
        workspace.projects[Object.keys(workspace.projects)[0] ?? DEFAULT_PROJECT_ID] ??
        null;
      if (restored) {
        applyWorkspaceProjectState(restored);
      }
    }

    const loaded = loadProject();
    if (loaded) {
      const loadedScene = loaded.sceneJson ? normalizeSceneJson(loaded.sceneJson) : null;
      const inferred = inferProjectMetaFromScene(loadedScene);
      const loadedProjectId = inferred.projectId || DEFAULT_PROJECT_ID;
      const loadedState: WorkspaceProjectState = {
        ...createEmptyProjectState(loadedProjectId, inferred.name || loadedProjectId),
        id: loadedProjectId,
        name: inferred.name || loadedProjectId,
        domain: inferred.domain,
        chat: {
          messages: normalizeMessages(loaded.messages),
          activeMode: loaded.activeMode ?? "business",
          episodeId: null,
        },
        scene: {
          ...createEmptyProjectState(loadedProjectId, inferred.name || loadedProjectId).scene,
          sceneJson: loadedScene,
        },
      };
      setActiveProjectId(loadedProjectId);
      setWorkspaceProjects((prev) => ({ ...prev, [loadedProjectId]: loadedState }));
      applyWorkspaceProjectState(loadedState);
      if (loaded.sessionId) {
        try {
          window.localStorage.setItem(SESSION_KEY, loaded.sessionId);
        } catch {
          // ignore
        }
      }
    }
    try {
      const storedPrefs = loadPrefsFromStorage();
      if (storedPrefs) {
        setPrefs(storedPrefs);
      }
      const memRaw = window.localStorage.getItem(MEMORY_KEY);
      if (memRaw) {
        const parsedMem = JSON.parse(memRaw);
        if (parsedMem?.version === "1") {
          setMemory(parsedMem as MemoryStateV1);
        }
      }
      const autoRaw = window.localStorage.getItem(AUTO_BACKUP_KEY);
      if (autoRaw === "true") setAutoBackupEnabled(true);
      else if (autoRaw === "false") setAutoBackupEnabled(false);
    } catch {
      // ignore
    }
    // Health check is handled via the HUD ping button; avoid extra imports here.
    setWorkspaceHydrated(true);
  }, [applyWorkspaceProjectState]);

  useEffect(() => {
    if (isRestoringRef.current) return;
    try {
      window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    } catch {
      // ignore
    }
  }, [prefs]);

  useEffect(() => {
    if (isRestoringRef.current || projectHydratingRef.current) return;
    const next = buildActiveProjectState(activeProjectId);
    setWorkspaceProjects((prev) => ({ ...prev, [activeProjectId]: next }));
  }, [
    activeProjectId,
    buildActiveProjectState,
    sceneJson,
    messages,
    activeMode,
    episodeId,
    selectedObjectIdState,
    focusedId,
    focusMode,
    focusPinned,
    loops,
    activeLoopId,
    selectedLoopId,
    objectUxById,
    conflicts,
    objectSelection,
    memoryInsights,
    riskPropagation,
    strategicAdvice,
    strategyKpi,
    decisionCockpit,
    productModeContext,
    aiReasoning,
    platformAssembly,
    autonomousExploration,
    opponentModel,
    strategicPatterns,
    responseData,
    kpi,
    sourceLabel,
    lastAnalysisSummary,
  ]);

  useEffect(() => {
    if (projectHydratingRef.current) return;
    if (!isFeatureEnabled(environmentConfig, "autonomous_exploration")) return;
    const sceneSignature = buildExplorationSceneSignature(sceneJson);
    if (!sceneSignature) return;
    const currentProjectId = activeProjectId || DEFAULT_PROJECT_ID;
    if (autonomousExploreSignatureRef.current[currentProjectId] === sceneSignature) return;

    if (String((autonomousExploration as any)?.scene_signature ?? "") === sceneSignature) {
      autonomousExploreSignatureRef.current[currentProjectId] = sceneSignature;
      return;
    }

    const result = runAutonomousScenarioExploration({
      projectId: currentProjectId,
      sceneJson,
      semanticObjectMeta: objectProfiles,
      modeContext: productModeContext,
      strategyContext: {
        at_risk_kpis: Array.isArray((strategyKpi as any)?.summary?.at_risk_kpis)
          ? (strategyKpi as any).summary.at_risk_kpis
          : [],
        threatened_objectives: Array.isArray((strategyKpi as any)?.summary?.threatened_objectives)
          ? (strategyKpi as any).summary.threatened_objectives
          : [],
      },
      maxScenarios: environmentConfig.runtime_safety.max_scenarios_per_run,
      timeBudgetMs: environmentConfig.runtime_safety.max_exploration_time_ms,
      importanceThreshold: 0.42,
    });
    autonomousExploreSignatureRef.current[currentProjectId] = sceneSignature;
    if (!result) return;

    const explorationPayload = {
      ...result,
      source: "autonomous_scenario_explorer",
      scene_signature: sceneSignature,
    };
    setAutonomousExploration(explorationPayload);
    setMemoryInsights((prev: any) => {
      const base = prev && typeof prev === "object" ? prev : {};
      const prevSig = String(base?.autonomous_exploration?.scene_signature ?? "");
      if (prevSig === sceneSignature) return base;
      return {
        ...base,
        autonomous_exploration: {
          scene_signature: sceneSignature,
          generated_at: explorationPayload.generated_at,
          summary: explorationPayload.summary,
          top_mitigation_ideas: explorationPayload.summary?.top_mitigation_ideas ?? [],
        },
      };
    });
    setResponseData((prev: any) => {
      if (!prev || typeof prev !== "object") return prev;
      const prevSig =
        String(prev?.autonomous_exploration?.scene_signature ?? "") ||
        String(prev?.context?.autonomous_exploration?.scene_signature ?? "");
      if (prevSig === sceneSignature) return prev;
      const prevContext = prev?.context && typeof prev.context === "object" ? prev.context : {};
      return {
        ...prev,
        autonomous_exploration: explorationPayload,
        context: {
          ...prevContext,
          autonomous_exploration: explorationPayload,
        },
      };
    });
  }, [
    activeProjectId,
    autonomousExploration,
    buildExplorationSceneSignature,
    environmentConfig,
    objectProfiles,
    productModeContext,
    sceneJson,
    strategyKpi,
  ]);

  useEffect(() => {
    saveWorkspaceSnapshot({
      id: activeWorkspaceId,
      activeProjectId,
      projects: workspaceProjects,
    });
    const activeProject = workspaceProjects[activeProjectId];
    if (activeProject) {
      saveProjectSnapshot(activeProject);
    }
  }, [activeWorkspaceId, activeProjectId, workspaceProjects]);

  useEffect(() => {
    try {
      window.localStorage.setItem(AUTO_BACKUP_KEY, String(autoBackupEnabled));
    } catch {
      // ignore
    }
  }, [autoBackupEnabled]);

  useEffect(() => {
    if (prefs.orbitMode === "auto") setCameraLockedByUser(false);
  }, [prefs.orbitMode]);

  useEffect(() => {
    let cancelled = false;
    fetch(`${BACKEND_BASE}/objects`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const list: any[] = Array.isArray(data?.objects)
          ? data.objects
          : Array.isArray(data)
          ? data
          : [];
        const map: Record<
          string,
          {
            id: string;
            label: string;
            summary: string;
            tags: string[];
            one_liner?: string;
            synonyms?: string[];
            domain_hints?: Record<string, string[]>;
            ux?: { shape?: string; base_color?: string };
          }
        > = {};
        list.forEach((entry) => {
          if (!entry || typeof entry !== "object") return;
          const id = entry.id;
          if (!id || typeof id !== "string") return;
          map[id] = {
            id,
            label: entry.label ?? id,
            summary: entry.summary ?? "",
            tags: Array.isArray(entry.tags) ? entry.tags : [],
            one_liner: typeof entry.one_liner === "string" ? entry.one_liner : undefined,
            synonyms: Array.isArray(entry.synonyms) ? entry.synonyms : undefined,
            domain_hints:
              typeof entry.domain_hints === "object" && entry.domain_hints
                ? (entry.domain_hints as Record<string, string[]>)
                : undefined,
            ux: typeof entry.ux === "object" && entry.ux ? entry.ux : undefined,
          };
        });
        setObjectProfiles(map);
      })
      .catch(() => {
        // ignore fetch errors; profile fetching per-object will still work
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const id = selectedIdRef.current;
    if (id) {
      updateSelectedObjectInfo(id);
    }
  }, [sceneJson, updateSelectedObjectInfo]);

  useEffect(() => {
    const baseLoops = normalizeLoops(sceneJson?.scene?.loops ?? []);
    const objs = Array.isArray(sceneJson?.scene?.objects) ? sceneJson.scene.objects : [];
    const resolvedLoops = resolveLoopPlaceholders(baseLoops, objs);
    if (process.env.NODE_ENV !== "production") {
      // Dev visibility: how many loops survive placeholder resolution
      console.debug("[loops] resolved", { before: baseLoops.length, after: resolvedLoops.length });
    }
    setLoops(resolvedLoops);

    const nextActive = sceneJson?.scene?.active_loop ?? null;
    setActiveLoopId(nextActive ?? null);

    const nextSuggestions = sceneJson?.scene?.loops_suggestions;
    if (Array.isArray(nextSuggestions)) setLoopSuggestions(nextSuggestions);
  }, [sceneJson]);

  useEffect(() => {
    if (isRestoringRef.current) return;
    if (!Array.isArray(loops) || loops.length === 0) return;

    let signature = "";
    try {
      signature = JSON.stringify({ loops, activeLoopId: activeLoopId ?? null });
    } catch {
      signature = "";
    }

    if (signature && signature === lastSnapshotRef.current) return;

    const timer = window.setTimeout(() => {
      try {
        const snapshot: DecisionSnapshot = {
          id: `ds_${Date.now()}`,
          timestamp: Date.now(),
          projectId,
          loops,
          activeLoopId: activeLoopId ?? null,
        };
        const next = appendSnapshot(projectId, snapshot);
        setSnapshots(next);
        lastSnapshotRef.current = signature;
        if (process.env.NODE_ENV !== "production") {
          console.debug("[decision] saved snapshot", snapshot.id);
        }
      } catch {
        // ignore persistence errors
      }
    }, 800);

    return () => window.clearTimeout(timer);
  }, [loops, activeLoopId, projectId]);

  useEffect(() => {
    selectedObjectInfoRef.current = selectedObjectInfo;
  }, [selectedObjectInfo]);

  const emitChatResult = useCallback((reply: string, ok: boolean, requestId?: string) => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
      new CustomEvent("nexora:chat-result", {
        detail: { reply, ok, requestId },
      })
    );
  }, []);

  const pulseObjectByText = useCallback((text: string) => {
    const t = String(text || "").toLowerCase();
    const isRetailDemo = String((sceneJson as any)?.meta?.demo_id ?? "").toLowerCase() === "retail_supply_chain_fragility";

    const pulseTargets = (ids: string[]) => {
      if (!Array.isArray(ids) || !ids.length) return;
      const focusId = ids[0];
      selectedSetterRef.current(focusId);
      setFocusedId(focusId);
      setFocusMode("selected");
      setViewMode("input");
      ids.forEach((id, idx) => {
        const prevScale = overridesRef.current[id]?.scale;
        const nextScale = clamp(typeof prevScale === "number" ? prevScale + 0.14 : 1.14, 0.2, 2);
        setOverrideRef.current?.(id, { scale: nextScale, opacity: 1 });
        window.setTimeout(() => {
          const restoreScale = typeof prevScale === "number" ? prevScale : 1;
          setOverrideRef.current?.(id, { scale: restoreScale });
        }, 520 + idx * 40);
      });
    };

    if (isRetailDemo) {
      if (/\bsupplier\b.*\bdelay\b|\bdelay\b.*\bsupplier\b/.test(t)) {
        pulseTargets(["obj_supplier_1", "obj_delivery_1", "obj_delay_1", "obj_inventory_1"]);
        return;
      }
      if (/\binventory\b.*\bdrop\b|\bdrop\b.*\binventory\b/.test(t)) {
        pulseTargets(["obj_inventory_1", "obj_warehouse_1", "obj_order_flow_1", "obj_customer_satisfaction_1"]);
        return;
      }
      if (/\bdemand\b.*\bspike\b|\bspike\b.*\bdemand\b/.test(t)) {
        pulseTargets(["obj_demand_1", "obj_order_flow_1", "obj_inventory_1", "obj_warehouse_1"]);
        return;
      }
      if (/\bprice\b.*\bincrease\b|\bincrease\b.*\bprice\b/.test(t)) {
        pulseTargets(["obj_price_1", "obj_demand_1", "obj_cash_pressure_1", "obj_customer_satisfaction_1"]);
        return;
      }
      if (/\bdelivery\b.*\bdisruption\b|\bdisruption\b.*\bdelivery\b/.test(t)) {
        pulseTargets(["obj_delivery_1", "obj_delay_1", "obj_inventory_1", "obj_order_flow_1"]);
        return;
      }
      if (/\bcash\b.*\bpressure\b|\bpressure\b.*\bcash\b/.test(t)) {
        pulseTargets(["obj_cash_pressure_1", "obj_order_flow_1", "obj_price_1", "obj_customer_satisfaction_1"]);
        return;
      }
      if (/\bcustomer\b.*\btrust\b|\btrust\b.*\bdrop\b/.test(t)) {
        pulseTargets(["obj_customer_satisfaction_1", "obj_order_flow_1", "obj_delivery_1", "obj_cash_pressure_1"]);
        return;
      }
      if (/\boperational\b.*\bbottleneck\b|\bbottleneck\b/.test(t)) {
        pulseTargets(["obj_delivery_1", "obj_warehouse_1", "obj_order_flow_1", "obj_inventory_1"]);
        return;
      }
    }

    const map: Array<{ test: RegExp; ids: string[] }> = [
      { test: /\binventory\b|\bstock\b/, ids: ["obj_inventory"] },
      { test: /\bsupplier\b/, ids: ["obj_supplier"] },
      { test: /\bdelivery\b|\bdisruption\b|\bdelay\b/, ids: ["obj_delivery"] },
      { test: /\bdemand\b|\bspike\b/, ids: ["obj_demand"] },
      { test: /\bprice\b|\bincrease\b/, ids: ["obj_price"] },
    ];
    const hit = map.find((m) => m.test.test(t));
    if (!hit) return;
    pulseTargets(hit.ids);
  }, [sceneJson, setFocusedId, setFocusMode, setViewMode]);

  useEffect(() => {
    const loaded = loadSnapshots(projectId);
    setSnapshots(loaded);
    if (loaded.length) {
      const last = loaded[loaded.length - 1];
      try {
        lastSnapshotRef.current = JSON.stringify({
          loops: last.loops,
          activeLoopId: last.activeLoopId ?? null,
        });
      } catch {
        lastSnapshotRef.current = null;
      }
    } else {
      lastSnapshotRef.current = null;
    }
  }, [projectId]);

  const sendText = useCallback(async (textRaw: string, requestId?: string) => {
    const text = textRaw.trim();
    if (!text || loading || isSendingRef.current) return;
    isSendingRef.current = true;
    pulseObjectByText(text);

    if (/\bfocus\b/i.test(text)) {
      const candidateId = selectedIdRef.current ?? selectedObjectIdState ?? null;
      const cmds: UICommand[] = [];
      if (candidateId) cmds.push({ type: "select", id: candidateId });
      cmds.push({ type: "toast", message: "Focus applied" });
      applyUICommands(cmds);
    }

    // Handle selected-object size commands first (no backend call)
    try {
      const hasSelectedKeyword = /\bselected\b/i.test(text);
      const selectedId = selectedIdRef.current;
      if (hasSelectedKeyword) {
        if (!selectedId) {
          const reply = "⚠️ No object selected. Click an object first.";
          const userMsg = makeMsg("user", text);
          const assistantMsg = makeMsg("assistant", reply);
          const nextMessages = appendMessages(messagesRef.current, [userMsg, assistantMsg]);
          setMessages(nextMessages);
          emitChatResult(reply, true, requestId);
          setNoSceneUpdate(false);
          setSourceLabel(null);
          const sessionId = (() => {
            try {
              return window.localStorage.getItem(SESSION_KEY);
            } catch {
              return null;
            }
          })();
          const snapshot: PersistedProject = {
            version: "1",
            savedAt: new Date().toISOString(),
            sessionId,
            activeMode,
            sceneJson,
            messages: nextMessages,
          };
          saveProject(snapshot);
          pushHistory(snapshot);
          setInput("");
          isSendingRef.current = false;
          return;
        }

        const cur = overridesRef.current[selectedId]?.scale ?? 1;
        const sel = parseSelectedSizeCommand(text, cur);
        if (sel.handled) {
          const userMsg = makeMsg("user", text);
          const assistantMsg = makeMsg("assistant", sel.reply);
          const nextMessages = appendMessages(messagesRef.current, [userMsg, assistantMsg]);
          setMessages(nextMessages);
          emitChatResult(sel.reply, true, requestId);
          // apply override
          setOverrideRef.current(selectedId, { scale: sel.nextScale });
          setNoSceneUpdate(false);
          setSourceLabel(null);
          const sessionId = (() => {
            try {
              return window.localStorage.getItem(SESSION_KEY);
            } catch {
              return null;
            }
          })();
          const snapshot: PersistedProject = {
            version: "1",
            savedAt: new Date().toISOString(),
            sessionId,
            activeMode,
            sceneJson,
            messages: nextMessages,
          };
          saveProject(snapshot);
          pushHistory(snapshot);
          setInput("");
          isSendingRef.current = false;
          return;
        }
      }
    } catch (err) {
      // fall through to normal flow on any error
    }

    // Global size commands handled next
    const sizeResult = parseSizeCommand(text, prefs.globalScale);
    if (sizeResult.handled) {
      const userMsg = makeMsg("user", text);
      const assistantMsg = makeMsg("assistant", sizeResult.reply);
      const nextMessages = appendMessages(messagesRef.current, [userMsg, assistantMsg]);
      setMessages(nextMessages);
      emitChatResult(sizeResult.reply, true, requestId);
      setPrefs((prev) => ({ ...prev, globalScale: sizeResult.nextScale }));
      setNoSceneUpdate(false);
      setSourceLabel(null);
      const sessionId = (() => {
        try {
          return window.localStorage.getItem(SESSION_KEY);
        } catch {
          return null;
        }
      })();
      const snapshot: PersistedProject = {
        version: "1",
        savedAt: new Date().toISOString(),
        sessionId,
        activeMode,
        sceneJson,
        messages: nextMessages,
      };
      saveProject(snapshot);
      pushHistory(snapshot);
      setInput("");
      isSendingRef.current = false;
      return;
    }

    // Decision router (deterministic, local)
    // IMPORTANT: Only handle locally when there are actual deterministic actions to apply.
    // Otherwise, fall through to the backend so the chat remains useful.
    const focusedObjectId: string | undefined =
      focusModeStore === "pinned" ? (pinnedId ?? undefined) : (focusedId ?? undefined);

    const routerResult = routeChatInput(text, {
      focusedObjectId,
      activeLoopId: activeLoopIdStore ?? undefined,
      focusMode: focusModeStore,
      pinnedLabel: selectedObjectInfo?.label ?? undefined,
    });

    const hasLocalActions = Array.isArray(routerResult?.actions) && routerResult.actions.length > 0;

    if (hasLocalActions) {
      const userMsg = makeMsg("user", text);
      const assistantMsg = makeMsg("assistant", routerResult.assistantReply);
      const routedMessages = appendMessages(messagesRef.current, [userMsg, assistantMsg]);
      setMessages(routedMessages);
      emitChatResult(routerResult.assistantReply, true, requestId);

      applyDecisionActions(routerResult.actions, {
        setOverride: setOverrideRef.current,
        updateObjectUx,
      });

      // Update memory (pure) and persist. Any visual side-effects must be scheduled
      // AFTER React finishes the current update to avoid cross-component updates during render.
      setMemory((prev) => {
        const next = updateMemory(prev, {
          now: Date.now(),
          focusedObjectId,
          activeLoopId: activeLoopIdStore ?? undefined,
          actions: routerResult.actions,
          text,
          mode: activeMode,
        });

        try {
          window.localStorage.setItem(MEMORY_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }

        const targets = routerResult.actions
          .map((a) => (a && typeof (a as any).target === "string" ? (a as any).target : null))
          .filter((t): t is string => !!t);

        // Defer visual patches; applying overrides touches SceneStateProvider.
        pendingVisualPatchesRef.current = { memory: next, targets };

        return next;
      });

      // Apply derived visual patches on the next tick to avoid React warning:
      // "Cannot update a component while rendering a different component".
      window.setTimeout(() => {
        const pending = pendingVisualPatchesRef.current;
        if (!pending) return;
        pendingVisualPatchesRef.current = null;

        for (const targetId of pending.targets) {
          const patch = deriveVisualPatch(pending.memory, targetId);
          if (patch && (patch.scale !== undefined || patch.opacity !== undefined)) {
            setOverrideRef.current?.(targetId, patch);
          }
        }
      }, 0);

      setInput("");
      isSendingRef.current = false;
      return;
    }

    // No deterministic actions to apply locally → use backend for assistant reply.

    // Default: send to backend
    const userBackendMsg = makeMsg("user", text);
    const baseMessages = appendMessages(messagesRef.current, [userBackendMsg]);
    setMessages(baseMessages);
    setLoading(true);
    setNoSceneUpdate(false);
    setSourceLabel(null);
    setCameraLockedByUser(false);

    try {
      const payload = buildChatRequestPayload(text);

      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.debug("chat payload", payload);
      }

      const raw = await chatToBackend(payload);
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.debug("chat response", raw);
      }

      const data = applyRetailTriggerEnhancement(raw, text, sceneJson) as BackendChatResponse;
      setResponseData(data);
      if (typeof data?.episode_id === "string" && data.episode_id.trim()) {
        setEpisodeId(data.episode_id);
      }
      if (!data || (data as any).ok === false || (data as any).error) {
        const msg =
          ((data as any)?.error?.message as string | undefined) ??
          "Request failed; no changes applied.";
        setMessages((m) => appendMessages(m, [makeMsg("assistant", msg)]));
        emitChatResult(msg, false, requestId);
        setLastActions([]);
        setLoading(false);
        isSendingRef.current = false;
        return;
      }
      const nextActiveMode: string =
        typeof (data as any)?.active_mode === "string" && (data as any).active_mode.trim().length
          ? (data as any).active_mode
          : activeMode;
      setActiveMode(nextActiveMode);
      const viewModel = deriveProductFlowViewModel(data, sceneJson);
      if (viewModel.nextSceneJson) {
        setSceneJson(viewModel.nextSceneJson);

        // apply override policy
        try {
          const policy = prefs.overridePolicy ?? "match";
          if (policy === "clear") {
            clearAllOverridesRef.current?.();
          } else if (policy === "match") {
            const objsForPolicy: any[] = Array.isArray(viewModel.nextSceneJson?.scene?.objects)
              ? (viewModel.nextSceneJson as any).scene.objects
              : [];
            const validIds = objsForPolicy.map((o: any, idx: number) => o.id ?? o.name ?? `${o.type ?? "obj"}:${idx}`);
            pruneOverridesRef.current?.(validIds);
          }
        } catch (e) {
          // ignore policy errors
        }
      }
      const assistantMsg = makeMsg("assistant", data.reply || "I’m here to help.");
      const finalMessages = appendMessages(baseMessages, [assistantMsg]);
      setMessages(finalMessages);
      emitChatResult(assistantMsg.text, true, requestId);
      const nextActions = Array.isArray((data as any)?.actions) ? ((data as any).actions as any[]) : [];
      setLastActions(nextActions);
      applyProductFlowViewModel(data, viewModel, { applyActionsToScene: true });
      syncFocusedObjectFromResponse(data);

      const sessionId = (() => {
        try {
          return window.localStorage.getItem(SESSION_KEY);
        } catch {
          return null;
        }
      })();

      const snapshot: PersistedProject = {
        version: "1",
        savedAt: new Date().toISOString(),
        sessionId,
        activeMode: nextActiveMode,
        sceneJson: viewModel.nextSceneJson,
        messages: finalMessages,
      };
      saveProject(snapshot);
      pushHistory(snapshot);

      try {
        const replay = await analyzeFull({ episodeId, text });
        if (replay?.episode_id) setEpisodeId(replay.episode_id);
      } catch {
        // ignore replay errors to keep chat responsive
      }
    } catch (e: any) {
      const msg =
        e?.name === "AbortError"
          ? "Request timed out. Please try again."
          : e?.message ?? "Sorry, I couldn't reach the server.";
      setMessages((m) => appendMessages(m, [makeMsg("assistant", msg)]));
      emitChatResult(msg, false, requestId);
    } finally {
      setLoading(false);
      setInput("");
      isSendingRef.current = false;
    }
  }, [
    activeMode,
    episodeId,
    focusMode,
    focusModeStore,
    focusedId,
    focusPinned,
    pinnedId,
    activeLoopIdStore,
    loading,
    prefs.globalScale,
    prefs.overridePolicy,
    applyProductFlowViewModel,
    applyUICommands,
    buildChatRequestPayload,
    deriveProductFlowViewModel,
    sceneJson,
    emitChatResult,
    applyRetailTriggerEnhancement,
    pulseObjectByText,
    syncFocusedObjectFromResponse,
    updateSelectedObjectInfo,
    updateObjectUx,
  ]);

  useEffect(() => {
    const onSubmitChat = (event: Event) => {
      const detail = (event as CustomEvent<{ text?: string; requestId?: string }>).detail;
      const text = typeof detail?.text === "string" ? detail.text : "";
      const requestId = typeof detail?.requestId === "string" ? detail.requestId : undefined;
      if (!text.trim()) return;
      void sendText(text, requestId);
    };
    window.addEventListener("nexora:submit-chat", onSubmitChat as EventListener);
    return () => window.removeEventListener("nexora:submit-chat", onSubmitChat as EventListener);
  }, [sendText]);

  const send = useCallback(() => {
    void sendText(input);
  }, [input, sendText]);

  const handleUndo = useCallback(() => {
    const history = loadHistory();
    if (history.length < 2) return;
    history.pop(); // remove current
    const prev = history[history.length - 1];
    if (!prev) return;

    setActiveMode(prev.activeMode ?? "business");
    setSceneJson(prev.sceneJson ? normalizeSceneJson(prev.sceneJson) : null);
    setMessages(normalizeMessages(prev.messages));
    try {
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
      if (prev.sessionId) window.localStorage.setItem(SESSION_KEY, prev.sessionId);
    } catch {
      // ignore
    }
    saveProject({
      ...prev,
      savedAt: new Date().toISOString(),
    });
  }, []);

  const handleExport = useCallback(() => {
    const currentProject =
      workspaceProjects[activeProjectId] ?? buildActiveProjectState(activeProjectId);
    const exported = exportProjectFile(currentProject);
    const blob = new Blob([JSON.stringify(exported.file, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentProject.id || "nexora"}-project.nexora.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [activeProjectId, buildActiveProjectState, workspaceProjects]);

  const handleImport = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        const normalized = parseImportedProjectFile(parsed);
        if (!normalized.file) {
          throw new Error(normalized.errors[0] ?? "Invalid project file");
        }

        const currentWorkspace = {
          id: activeWorkspaceId,
          activeProjectId,
          projects: {
            ...workspaceProjects,
            [activeProjectId]: buildActiveProjectState(activeProjectId),
          },
        };
        const imported = importProjectFileToWorkspace(currentWorkspace, normalized.file, {
          activate: true,
          collision: "rename",
        });
        if (!imported.ok) {
          throw new Error(imported.errors[0] ?? "Import failed");
        }

        setActiveWorkspaceId(imported.workspace.id || DEFAULT_WORKSPACE_ID);
        setWorkspaceProjects(imported.workspace.projects);
        setActiveProjectId(imported.activeProjectId);
        applyWorkspaceProjectState(imported.project);
        const warnings = [...normalized.warnings, ...imported.warnings].filter(Boolean);
        if (warnings.length) {
          setMessages((m) =>
            appendMessages(m, [makeMsg("assistant", `Project imported with notes: ${warnings.join(" ")}`)])
          );
        }
      } catch (err: any) {
        setMessages((m) => appendMessages(m, [makeMsg("assistant", err?.message ?? "Import failed")]));
      }
    };
    reader.readAsText(file);
  }, [
    activeProjectId,
    activeWorkspaceId,
    applyWorkspaceProjectState,
    buildActiveProjectState,
    workspaceProjects,
  ]);

  const buildBackup = useCallback((): BackupV1 => {
    const sessionId = (() => {
      try { return window.localStorage.getItem(SESSION_KEY); } catch { return null; }
    })();

    return buildBackupController({
      activeCompanyId,
      activeMode,
      activeTemplateId,
      hudTab: activeSidePanel,
      prefs,
      sceneJson,
      messages,
      loops,
      activeLoopId,
      selectedLoopId,
      focusedId,
      focusMode,
      focusPinned,
      selectedObjectId: selectedObjectIdState,
      overrides: overridesRef.current ?? {},
      objectUxById: objectUxById ?? {},
      sessionId,
    });
  }, [
    activeCompanyId,
    activeMode,
    activeTemplateId,
    activeSidePanel,
    prefs,
    sceneJson,
    messages,
    loops,
    activeLoopId,
    selectedLoopId,
    focusedId,
    focusMode,
    focusPinned,
    selectedObjectIdState,
    objectUxById,
  ]);

  const handleSaveBackup = useCallback(() => {
    const backup = buildBackup();
    saveBackup(backup);
    setMessages((m) => appendMessages(m, [makeMsg("assistant", "✅ Backup saved (local).")]));
  }, [buildBackup]);

  const applyBackupRestore = useCallback((b: BackupV1) => {
    isRestoringRef.current = true;

    try {
      if (b.sessionId) {
        try { window.localStorage.setItem(SESSION_KEY, b.sessionId); } catch {}
      }

      // company
      setActiveCompanyIdState(b.activeCompanyId ?? "default");
      setCompanyId(b.activeCompanyId ?? "default");

      // core state
      setActiveMode(b.activeMode ?? "business");
      setActiveTemplateId(b.activeTemplateId ?? "quality_protection");
      setActiveSidePanel(
        b.hudTab &&
        b.hudTab !== "chat" &&
        b.hudTab !== "object" &&
        b.hudTab !== "scene" &&
        b.hudTab !== "loops" &&
        b.hudTab !== "kpi" &&
        b.hudTab !== "decisions"
          ? b.hudTab
          : "decisions"
      );
      setPrefs(b.prefs ?? defaultPrefs);

      // scene + chat
      setSceneJson(b.sceneJson ? normalizeSceneJson(b.sceneJson) : null);
      setMessages(normalizeMessages(b.messages));

      // loops
      setLoops(Array.isArray(b.loops) ? b.loops : []);
      setActiveLoopId(b.activeLoopId ?? null);
      setSelectedLoopId(b.selectedLoopId ?? null);

      // focus/selection
      setFocusedId(b.focusedId ?? null);
      setFocusMode(b.focusMode ?? "all");
      setPinnedSafe(!!b.focusPinned, b.focusedId ?? null);

      setSelectedObjectIdState(b.selectedObjectId ?? null);
      if (b.selectedObjectId) selectedSetterRef.current?.(b.selectedObjectId);
      else selectedSetterRef.current?.(null);

      // overrides refs + ux
      overridesRef.current = b.overrides ?? {};
      setObjectUxById(b.objectUxById ?? {});

      if (b.selectedObjectId) {
        window.setTimeout(() => updateSelectedObjectInfo(b.selectedObjectId), 0);
      }

      setMessages((m) => appendMessages(m, [makeMsg("assistant", "✅ Backup restored.")]));
    } finally {
      window.setTimeout(() => { isRestoringRef.current = false; }, 0);
    }
  }, [setPinnedSafe, updateSelectedObjectInfo]);

  const handleRestoreBackup = useCallback(() => {
    const b = loadBackup();
    if (!b) {
      setMessages((m) => appendMessages(m, [makeMsg("assistant", "⚠️ No backup found.")]));
      return;
    }
    const lines = buildRestorePreviewLines({
      activeCompanyId,
      activeMode,
      activeTemplateId,
      hudTab: activeSidePanel,
      loops,
      activeLoopId,
      selectedLoopId,
      focusedId,
      focusMode,
      focusPinned,
      selectedObjectId: selectedObjectIdState,
      messagesLen: messages.length,
      overridesKeysCount: Object.keys(overridesRef.current ?? {}).length,
      backup: b,
    });
    setRestorePreview({ backup: b, lines });
  }, [
    activeCompanyId,
    activeMode,
    activeTemplateId,
    activeSidePanel,
    loops,
    activeLoopId,
    selectedLoopId,
    focusedId,
    focusMode,
    focusPinned,
    selectedObjectIdState,
    messages.length,
  ]);

  useEffect(() => {
    if (isRestoringRef.current) return;
    if (!autoBackupEnabled) return;
    if (autoBackupTimerRef.current) {
      window.clearTimeout(autoBackupTimerRef.current);
    }
    autoBackupTimerRef.current = window.setTimeout(() => {
      if (isRestoringRef.current) return;
      if (!autoBackupEnabled) return;
      const backup = buildBackup();
      saveBackup(backup);
    }, 1500);
    return () => {
      if (autoBackupTimerRef.current) {
        window.clearTimeout(autoBackupTimerRef.current);
        autoBackupTimerRef.current = null;
      }
    };
  }, [autoBackupEnabled, buildBackup, overridesVersion]);


  const handlePrefsChange = useCallback((next: ScenePrefs) => {
    setPrefs(next);
  }, []);

  const clearFocus = useCallback(() => {
    applyPinToStore(false, null);
    setFocusedId(null);
    selectedSetterRef.current(null);
  }, [applyPinToStore, setFocusedId]);
  const handleAskAboutSelected = useCallback(() => {
    const id = selectedIdRef.current;
    if (!id) return;
    setFocusedId(id);
    updateSelectedObjectInfo(id);
    setFocusMode("selected");
    sendText("tell me about the selected object");
  }, [sendText, updateSelectedObjectInfo]);

  const askAboutSelectedAndSend = useCallback(() => {
    const id = selectedIdRef.current;
    if (!id) return;
    setFocusedId(id);
    updateSelectedObjectInfo(id);
    setFocusMode("selected");
    const q = "Tell me about the selected object.";
    setInput(q);
    setTimeout(() => {
      send();
    }, 0);
  }, [send, updateSelectedObjectInfo]);

  const handleFocusFromLoop = useCallback(
    (id: string) => {
      if (!id) return;
      selectedSetterRef.current(id);
      setFocusedId(id);
      setFocusMode("selected");
      setViewMode("input");
    },
    [setFocusMode, setViewMode]
  );


  const handleReplayEvents = useCallback(async () => {
    if (process.env.NODE_ENV === "production") return;
    setReplayError(null);
    setReplaying(true);
    let userId: string | null = null;
    try {
      userId = window.localStorage.getItem(SESSION_KEY);
    } catch {
      userId = null;
    }
    if (!userId) {
      try {
        userId = window.localStorage.getItem("dev_replay_user_id");
        if (!userId) {
          userId = `dev-${Math.random().toString(36).slice(2, 10)}`;
          window.localStorage.setItem("dev_replay_user_id", userId);
        }
      } catch {
        userId = "dev-anon";
      }
    }
    try {
      const events = await getRecentEvents(userId, 10);
      for (const evt of events) {
        applyActions(evt.actions);
        setMessages((m) => appendMessages(m, [makeMsg("assistant", `(Replayed) ${evt.reply}`)]));
        await delay(250);
      }
    } catch (e: any) {
      setReplayError("Replay failed");
    } finally {
      setReplaying(false);
    }
  }, [applyActions, setMessages]);

 
  const hudPanels = null as any;

  const handleSceneUpdateFromTimeline = useCallback((payload: any) => {
    setResponseData(payload ?? null);
    const nextScene = payload?.scene_json;
    if (nextScene && typeof nextScene === "object") {
      setSceneJson(normalizeSceneJson(nextScene));
    }

    const nextFragility =
      payload?.fragility ??
      payload?.context?.fragility ??
      payload?.scene_json?.scene?.fragility ??
      null;

    const nextKpi =
      payload?.kpi ??
      payload?.context?.kpi ??
      payload?.scene_json?.scene?.kpi ??
      null;

    if (nextKpi) setKpi(nextKpi as any);
    setConflicts(extractConflicts(payload));
    setObjectSelection(extractObjectSelection(payload));
    setMemoryInsights(extractMemoryV2(payload));
    setRiskPropagation(extractRiskPropagation(payload));
    setStrategicAdvice(extractStrategicAdvice(payload));
    setStrategyKpi(extractStrategyKpi(payload));
    setDecisionCockpit(extractDecisionCockpit(payload));
    const nextProductModeContextC = extractProductModeContext(payload);
    setProductModeContext(nextProductModeContextC);
    if (nextProductModeContextC?.mode_id) setProductModeId(String(nextProductModeContextC.mode_id));
    setAiReasoning(extractAiReasoning(payload));
    setPlatformAssembly(extractPlatformAssembly(payload));
    setAutonomousExploration(extractAutonomousExploration(payload));
    setOpponentModel(extractOpponentModel(payload));
    setStrategicPatterns(extractStrategicPatterns(payload));
    if (nextFragility) {
      // optional: if HomeScreen stores fragility separately, update it
    }
  }, [
    extractConflicts,
    extractMemoryV2,
    extractObjectSelection,
    extractRiskPropagation,
    extractStrategicAdvice,
    extractStrategyKpi,
    extractDecisionCockpit,
    extractProductModeContext,
    extractAiReasoning,
    extractPlatformAssembly,
    extractAutonomousExploration,
    extractOpponentModel,
    extractStrategicPatterns,
  ]);

  const loadDomainDemoScenario = useCallback((requestedDomainId?: string | null) => {
    const demoDefinition = resolveDomainDemo(requestedDomainId ?? activeDomainExperience.experience.domainId);
    const payload = demoDefinition.analysis as any;
    const nextScene = normalizeSceneJson(demoDefinition.scene as any);
    const nextLoops = normalizeLoops((nextScene as any)?.scene?.loops);
    const nextActiveLoop = String((nextScene as any)?.scene?.active_loop ?? "").trim() || null;
    const nextLoopSuggestions = Array.isArray((nextScene as any)?.scene?.loops_suggestions)
      ? (((nextScene as any).scene.loops_suggestions as string[]) ?? [])
      : [];
    const inferred = inferProjectMetaFromScene(nextScene);
    const nextProjectId = inferred.projectId || DEFAULT_PROJECT_ID;
    const demoModeContext = buildActiveModeContext({
      modeId: activeDomainExperience.experience.preferredWorkspaceModeId,
      projectDomain: inferred.domain ?? activeDomainExperience.experience.domainId,
      workspaceId: activeWorkspaceId,
      projectId: nextProjectId,
    });
    setProductModeId(activeDomainExperience.experience.preferredWorkspaceModeId);
    setProductModeContext(demoModeContext);
    setActiveProjectId(nextProjectId);
    setWorkspaceProjects((prev) => ({
      ...prev,
      [nextProjectId]: prev[nextProjectId] ?? createEmptyProjectState(nextProjectId, inferred.name || nextProjectId),
    }));
    setResponseData(payload);
    setSceneJson(nextScene);
    clearAllOverridesRef.current?.();
    setLoops(nextLoops);
    setActiveLoopId(nextActiveLoop);
    setSelectedLoopId(null);
    setLoopSuggestions(nextLoopSuggestions);
    setKpi((payload?.scene_json?.scene?.kpi as KPIState) ?? null);
    setConflicts(extractConflicts(payload));
    setObjectSelection(extractObjectSelection(payload));
    setRiskPropagation(extractRiskPropagation(payload));
    setStrategicAdvice(extractStrategicAdvice(payload));
    setStrategyKpi(extractStrategyKpi(payload));
    setDecisionCockpit(extractDecisionCockpit(payload));
    const nextProductModeContextD = extractProductModeContext(payload);
    setProductModeContext(nextProductModeContextD);
    if (nextProductModeContextD?.mode_id) setProductModeId(String(nextProductModeContextD.mode_id));
    setAiReasoning(extractAiReasoning(payload));
    setPlatformAssembly(extractPlatformAssembly(payload));
    setAutonomousExploration(extractAutonomousExploration(payload));
    setOpponentModel(extractOpponentModel(payload));
    setStrategicPatterns(extractStrategicPatterns(payload));
    setCameraLockedByUser(false);
    setIsOrbiting(false);
    // Keep startup framing/focus lightweight and deterministic across domain experiences.
    const starterFocusIds =
      Array.isArray(demoDefinition.starterFocusObjectIds) && demoDefinition.starterFocusObjectIds.length > 0
        ? demoDefinition.starterFocusObjectIds
        : [];
    const primaryFocusId = starterFocusIds[0] ?? null;
    setFocusMode("all");
    setFocusedId(primaryFocusId);
    selectedSetterRef.current(primaryFocusId);
    if (primaryFocusId) {
      window.setTimeout(() => {
        updateSelectedObjectInfo(primaryFocusId);
      }, 0);
    }
    starterFocusIds.forEach((id, index) => {
      const scale = index === 0 ? 1.08 : index === 1 ? 1.05 : 1.04;
      setOverrideRef.current?.(id, { scale, opacity: 1 });
    });
    setNoSceneUpdate(false);
    setSourceLabel("demo");
    setLastAnalysisSummary(`Loaded demo scenario: ${demoDefinition.label}`);
    setMessages((m) =>
      appendMessages(m, [
        makeMsg(
          "assistant",
          demoDefinition.starterText
        ),
      ])
    );
  }, [
    activeDomainExperience,
    extractConflicts,
    extractObjectSelection,
    extractRiskPropagation,
    extractStrategicAdvice,
    extractStrategyKpi,
    extractDecisionCockpit,
    extractProductModeContext,
    extractAiReasoning,
    extractPlatformAssembly,
    extractAutonomousExploration,
    extractOpponentModel,
    extractStrategicPatterns,
    activeWorkspaceId,
    setFocusMode,
    setFocusedId,
    updateSelectedObjectInfo,
  ]);

  useEffect(() => {
    const onLoadDemo = (event: Event) => {
      const detail = (event as CustomEvent<{ domainId?: string | null }>).detail;
      loadDomainDemoScenario(detail?.domainId ?? activeDomainExperience.experience.domainId);
    };
    window.addEventListener("nexora:load-demo-scenario", onLoadDemo as EventListener);
    return () => window.removeEventListener("nexora:load-demo-scenario", onLoadDemo as EventListener);
  }, [activeDomainExperience, loadDomainDemoScenario]);

  useEffect(() => {
    const currentSceneDomainId = String((sceneJson as any)?.meta?.domain ?? "").trim().toLowerCase();
    if (!workspaceHydrated || didAutoLoadDomainDemoRef.current) return;
    if (sceneJson && currentSceneDomainId === activeDomainExperience.experience.domainId) return;
    didAutoLoadDomainDemoRef.current = true;
    loadDomainDemoScenario(activeDomainExperience.experience.domainId);
  }, [activeDomainExperience, loadDomainDemoScenario, sceneJson, workspaceHydrated]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("nexora:inspector-context", {
        detail: {
          sceneJson,
          responseData,
          kpi,
          activeMode,
          activeLoopId,
          focusedId,
          focusMode,
          focusPinned,
          selectedObjectId: selectedObjectIdState,
          selectedObjectInfo,
          objectSelection,
          strategicAdvice,
          strategyKpi,
          decisionCockpit,
          productModeContext,
          aiReasoning,
          platformAssembly,
          autonomousExploration,
          domainExperience: {
            domainId: activeDomainExperience.experience.domainId,
            label: activeDomainExperience.experience.label,
            description: activeDomainExperience.experience.description,
            domainPackId: activeDomainExperience.experience.activeDomainPackId,
            defaultDemoId: activeDomainExperience.experience.defaultDemoId,
            defaultProductMode: activeDomainExperience.experience.preferredProductMode,
            preferredWorkspaceModeId: activeDomainExperience.experience.preferredWorkspaceModeId,
            preferredCockpitLayoutMode: activeDomainExperience.experience.preferredCockpitLayoutMode,
            preferredRightPanelTab: activeDomainExperience.experience.preferredRightPanelTab,
            promptExamples: activeDomainExperience.experience.promptExamples,
            helperTitle: activeDomainExperience.experience.helperTitle,
            helperBody: activeDomainExperience.experience.helperBody,
            promptGuideTitle: activeDomainExperience.experience.promptGuideTitle,
            promptGuideBody: activeDomainExperience.experience.promptGuideBody,
            panelIds: activeDomainExperience.experience.preferredPanels,
            visibleNavGroups: activeDomainExperience.experience.visibleNavGroups,
            visibleSections: activeDomainExperience.experience.visibleSections,
            adviceFramingHints: activeDomainExperience.experience.adviceFramingHints,
            executiveFramingStyle: activeDomainExperience.experience.executiveFramingStyle,
            sharedCoreEngineId: activeDomainExperience.sharedCore.id,
          },
          sharedCoreEngine: activeDomainExperience.sharedCore,
        },
      })
    );
  }, [
    activeDomainExperience,
    sceneJson,
    responseData,
    kpi,
    activeMode,
    activeLoopId,
    focusedId,
    focusMode,
    focusPinned,
    selectedObjectIdState,
    selectedObjectInfo,
    objectSelection,
    strategicAdvice,
    strategyKpi,
    decisionCockpit,
    productModeContext,
    aiReasoning,
    platformAssembly,
    autonomousExploration,
  ]);

  const panelContent =
    rightPanelTab === "timeline" ? (
      <TimelinePanel
        backendBase={BACKEND_BASE}
        episodeId={episodeId}
        onSceneUpdate={handleSceneUpdateFromTimeline}
      />
    ) : rightPanelTab === "conflict" ? (
      <ConflictMapPanel conflicts={conflicts} />
    ) : rightPanelTab === "object_focus" ? (
      <ObjectSelectionPanel selection={objectSelection ?? (sceneJson as any)?.object_selection ?? null} />
    ) : rightPanelTab === "memory_insights" ? (
      <MemoryInsightsPanel memory={memoryInsights ?? (sceneJson as any)?.memory_v2 ?? null} />
    ) : rightPanelTab === "risk_flow" ? (
      <RiskPropagationPanel risk={riskPropagation ?? (sceneJson as any)?.risk_propagation ?? (sceneJson as any)?.scene?.risk_propagation ?? null} />
    ) : rightPanelTab === "replay" ? (
      <DecisionReplayPanel
        backendBase={BACKEND_BASE}
        episodeId={episodeId}
        onSceneUpdate={handleSceneUpdateFromTimeline}
      />
    ) : rightPanelTab === "strategic_advice" ? (
      <StrategicAdvicePanel advice={strategicAdvice ?? (sceneJson as any)?.strategic_advice ?? null} />
    ) : rightPanelTab === "opponent_moves" ? (
      <OpponentMovesPanel model={opponentModel ?? (sceneJson as any)?.opponent_model ?? null} />
    ) : rightPanelTab === "strategic_patterns" ? (
      <StrategicPatternsPanel patterns={strategicPatterns ?? (sceneJson as any)?.strategic_patterns ?? null} />
    ) : rightPanelTab === "executive_dashboard" ? (
      <ExecutiveDashboardPanel sceneJson={sceneJson ?? undefined} responseData={responseData ?? undefined} />
    ) : rightPanelTab === "collaboration" ? (
      <CollaborationPanel backendBase={BACKEND_BASE} episodeId={episodeId} />
    ) : rightPanelTab === "workspace" ? (
      <ProductWorkspacePanel
        backendBase={BACKEND_BASE}
        episodeId={episodeId}
        responseData={responseData ?? undefined}
        currentScenarioInputs={[]}
      />
    ) : null;
  const getInspectorHostId = useCallback((tab: typeof rightPanelTab) => {
    return tab === "conflict"
      ? "nexora-inspector-conflict-host"
      : tab === "object_focus"
      ? "nexora-inspector-focus-host"
      : tab === "memory_insights"
      ? "nexora-inspector-memory-host"
      : tab === "risk_flow"
      ? "nexora-inspector-riskflow-host"
      : tab === "replay"
      ? "nexora-inspector-replay-host"
      : tab === "strategic_advice"
      ? "nexora-inspector-advice-host"
      : tab === "opponent_moves"
      ? "nexora-inspector-opponent-host"
      : tab === "strategic_patterns"
      ? "nexora-inspector-patterns-host"
      : tab === "executive_dashboard"
      ? "nexora-inspector-exec-host"
      : tab === "collaboration"
      ? "nexora-inspector-collab-host"
      : tab === "workspace"
      ? "nexora-inspector-workspace-host"
      : "nexora-inspector-timeline-host";
  }, []);

  useEffect(() => {
    if (!isClientMounted) {
      setInspectorPortalHost(null);
      return;
    }

    const isInspectorTab =
      rightPanelTab === "timeline" ||
      rightPanelTab === "conflict" ||
      rightPanelTab === "object_focus" ||
      rightPanelTab === "memory_insights" ||
      rightPanelTab === "risk_flow" ||
      rightPanelTab === "replay" ||
      rightPanelTab === "strategic_advice" ||
      rightPanelTab === "opponent_moves" ||
      rightPanelTab === "strategic_patterns" ||
      rightPanelTab === "executive_dashboard" ||
      rightPanelTab === "collaboration" ||
      rightPanelTab === "workspace";

    if (!isInspectorTab) {
      setInspectorPortalHost(null);
      return;
    }

    const hostId = getInspectorHostId(rightPanelTab);
    const host = document.getElementById(hostId);
    setInspectorPortalHost(host instanceof HTMLElement ? host : null);
  }, [getInspectorHostId, isClientMounted, rightPanelTab]);

  const timelineInspectorNode =
    isClientMounted && inspectorPortalHost && panelContent
      ? createPortal(panelContent, inspectorPortalHost)
      : null;
  const alertOverlayNode = alert ? (
    <StrategicAlertOverlay
      level={alert.level as any}
      score={alert.score}
      reasons={alert.reasons}
      onDismiss={dismissAlert}
    />
  ) : null;

  const isDomainDemoActive =
    String((sceneJson as any)?.meta?.demo_id ?? "").toLowerCase() ===
    String(activeDomainDemo.id).toLowerCase();
  const hasUserPrompt = messages.some(
    (m) => m.role === "user" && typeof m.text === "string" && m.text.trim().length > 0
  );
  const showDomainPromptGuide = !!sceneJson && isDomainDemoActive && !hasUserPrompt;
  const domainPromptSuggestions = activeDomainExperience.experience.promptExamples;
  const launchDomainActive = isLaunchDomain(activeDomainExperience.experience.domainId);
  const domainPanelEmphasisLabels = useMemo(
    () =>
      activeDomainExperience.experience.preferredPanels
        .slice(0, 4)
        .map((panelId) =>
          String(panelId)
            .replace(/_panel$/i, "")
            .replace(/_/g, " ")
            .replace(/\b\w/g, (match) => match.toUpperCase())
        ),
    [activeDomainExperience]
  );

  const sceneNode = (
    <div style={{ position: "relative", width: "100%", height: "100%", background: "transparent", zIndex: 0 }}>
      {/* Three.js (Canvas always mounted for stable hooks) */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <SceneCanvas
          prefs={prefs}
          camPos={camPos}
          starCount={starCount}
          isDraggingHUD={false}
          showAxes={showAxes}
          showGrid={showGrid}
          showCameraHelper={showCameraHelper}
          focusPinned={focusPinned}
          focusMode={focusMode}
          focusedId={focusedId}
          effectiveActiveLoopId={effectiveActiveLoopId}
          cameraLockedByUser={cameraLockedByUser}
          isOrbiting={isOrbiting}
          sceneJson={sceneJson}
          getUxForObject={getUxForObject}
          objectUxById={objectUxById}
          loops={visibleLoops}
          showLoops={showLoops}
          showLoopLabels={showLoopLabels}
          selectedSetterRef={selectedSetterRef}
          selectedIdRef={selectedIdRef}
          overridesRef={overridesRef}
          setOverrideRef={setOverrideRef}
          clearAllOverridesRef={clearAllOverridesRef}
          pruneOverridesRef={pruneOverridesRef}
          onPointerMissed={() => {
            if (!focusPinned) {
              selectedSetterRef.current(null);
              setFocusedId(null);
            }
            setViewMode("hidden");
          }}
          onOrbitStart={() => {
            setIsOrbiting(true);
            if (prefs.orbitMode === "manual") setCameraLockedByUser(true);
          }}
          onOrbitEnd={() => setIsOrbiting(false)}
          onSelectedChange={handleSelectedChange}
        />
      </div>

      {!sceneJson && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#cbd5e1",
            fontSize: 14,
            pointerEvents: "auto",
            background: "rgba(0,0,0,0.2)",
          }}
        >
          <div
            style={{
              textAlign: "left",
              lineHeight: 1.5,
              maxWidth: 520,
              padding: 14,
              borderRadius: 12,
              border: "1px solid rgba(148,163,184,0.18)",
              background: "rgba(15,23,42,0.78)",
              boxShadow: "0 10px 32px rgba(2,6,23,0.32)",
            }}
          >
            <div style={{ color: "#e2e8f0", fontSize: 18, fontWeight: 800 }}>
              {activeDomainExperience.experience.helperTitle}
            </div>
            <div style={{ color: "#cbd5e1", fontSize: 12, marginTop: 8 }}>
              {activeDomainExperience.experience.helperBody}
            </div>
            <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 6 }}>
              {`The shared Nexora core stays the same; this domain pack changes the starter demo, prompt examples, panel emphasis, and cockpit framing.`}
            </div>
            {!launchDomainActive ? (
              <div style={{ color: "#fbbf24", fontSize: 11, marginTop: 6 }}>
                Preview domain: the shipping MVP centers Business, DevOps, and Finance. This workspace still runs on the same shared core engine.
              </div>
            ) : null}
            <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                `1. Load the ${activeDomainExperience.experience.label.toLowerCase()} demo`,
                "2. Enter a pressure prompt",
                "3. Read the executive brief",
              ].map((step) => (
                <div
                  key={step}
                  style={{
                    height: 28,
                    padding: "0 10px",
                    borderRadius: 999,
                    border: "1px solid rgba(148,163,184,0.18)",
                    background: "rgba(2,6,23,0.45)",
                    color: "#cbd5e1",
                    display: "inline-flex",
                    alignItems: "center",
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  {step}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10, color: "#94a3b8", fontSize: 11 }}>
              {`Panel emphasis: ${domainPanelEmphasisLabels.join(", ") || "Executive Dashboard"}`}
            </div>
            <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("nexora:load-demo-scenario", {
                      detail: {
                        demo: activeDomainExperience.experience.defaultDemoId,
                        domainId: activeDomainExperience.experience.domainId,
                      },
                    })
                  )
                }
                style={{
                  height: 30,
                  padding: "0 10px",
                  borderRadius: 999,
                  border: "1px solid rgba(96,165,250,0.35)",
                  background: "rgba(59,130,246,0.16)",
                  color: "#dbeafe",
                  display: "inline-flex",
                  alignItems: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {`Start ${activeDomainExperience.experience.label} Demo`}
              </button>
              <div style={{ color: "#64748b", fontSize: 11 }}>
                {`Use a prompt like ${activeDomainExperience.experience.promptExamples.slice(0, 3).join(", ")} to see the full decision story.`}
              </div>
            </div>
          </div>
        </div>
      )}

      {showDomainPromptGuide ? (
        <div
          style={{
            position: "absolute",
            left: 16,
            top: 16,
            maxWidth: 560,
            zIndex: 11,
            padding: 10,
            borderRadius: 12,
            border: "1px solid rgba(148,163,184,0.18)",
            background: "rgba(15,23,42,0.82)",
            boxShadow: "0 8px 24px rgba(2,6,23,0.3)",
          }}
        >
          <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 700 }}>
            {activeDomainExperience.experience.promptGuideTitle}
          </div>
          <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 4 }}>
            {activeDomainExperience.experience.promptGuideBody}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
            {domainPromptSuggestions.map((prompt) => (
              <button
                key={prompt}
                type="button"
                disabled={loading}
                onClick={() => void sendText(prompt)}
                style={{
                  height: 28,
                  padding: "0 10px",
                  borderRadius: 999,
                  border: "1px solid rgba(148,163,184,0.2)",
                  background: "rgba(2,6,23,0.45)",
                  color: "#cbd5e1",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontSize: 11,
                  opacity: loading ? 0.65 : 1,
                }}
              >
                {prompt}
              </button>
            ))}
          </div>
          <div style={{ color: "#64748b", fontSize: 11, marginTop: 8 }}>
            {launchDomainActive
              ? "Watch the key nodes react, then read the executive brief for what happened, why it matters, and what to do next."
              : "Preview domain: use the shared demo flow, then read the executive brief to see how this domain evolves on the same core engine."}
          </div>
        </div>
      ) : null}

      {/* Small loading badge */}
      {loading ? (
        <div
          style={{
            position: "absolute",
            right: 16,
            bottom: 16,
            padding: "6px 10px",
            borderRadius: 10,
            background: "rgba(0,0,0,0.55)",
            color: "white",
            fontSize: 12,
            border: "1px solid rgba(255,255,255,0.12)",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          Working…
        </div>
      ) : null}
    </div>
  );

  // --- Render ---
  return (
    <div
      id="nexora-home"
      style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}
    >
      {sceneNode}
      {timelineInspectorNode}
      {alertOverlayNode}
    </div>
  );
};

export default HomeScreen;
