/**
 * Deterministic decision intelligence: severity, confidence, narrative, actions.
 */

import type {
  DecisionAction,
  DecisionInsightConfidenceLevel,
  DecisionInsightOutput,
  DecisionInsightSeverity,
  DecisionIntelligenceInput,
  DecisionIntelligenceSignal,
} from "./decisionIntelligenceTypes.ts";
import { subscribeDecisionEvent, type DecisionEvent } from "./decisionEventBus.ts";
import { resetDecisionExecutionGuard, setDecision } from "./decisionStore.ts";

const DEV = typeof process !== "undefined" && process.env.NODE_ENV !== "production";
const NEXORA_DECISION_FREEZE = false;
const decisionTraceSignatures = new Map<string, string>();
const decisionOutputCache = new Map<string, DecisionInsightOutput>();
const DECISION_OUTPUT_CACHE_LIMIT = 16;
const lastDecisionSignatureRef = { current: null as string | null };
let lastStableDecisionResult: DecisionInsightOutput | null = null;

function stableTraceSignature(payload?: Record<string, unknown>): string {
  if (!payload) return "";
  try {
    return JSON.stringify(payload);
  } catch {
    return String(payload);
  }
}

function devTrace(tag: string, payload?: Record<string, unknown>) {
  if (!DEV) return;
  const signature = stableTraceSignature(payload);
  if (decisionTraceSignatures.get(tag) === signature) return;
  decisionTraceSignatures.set(tag, signature);
  if (payload) globalThis.console?.debug?.(`[Nexora][Decision] ${tag}`, payload);
  else globalThis.console?.debug?.(`[Nexora][Decision] ${tag}`);
}

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

function normalizeKey(raw: string): string {
  return String(raw ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}

function driverBlob(input: DecisionIntelligenceInput): string {
  const fromScan = input.scannerSummary?.drivers ?? [];
  const fromDom = (input.panelContext?.dominantDriverKey as string | undefined) ?? "";
  return [...fromScan, fromDom].map(normalizeKey).join(" ");
}

function severityRank(s: DecisionInsightSeverity): number {
  if (s === "critical") return 2;
  if (s === "warning") return 1;
  return 0;
}

function maxSeverity(a: DecisionInsightSeverity, b: DecisionInsightSeverity): DecisionInsightSeverity {
  return severityRank(a) >= severityRank(b) ? a : b;
}

function normalizeNumber(value: unknown): number {
  const next = Number(value);
  if (!Number.isFinite(next)) return 0;
  return Math.round(next * 1000) / 1000;
}

export function buildDecisionIntelligenceInputSignature(input: DecisionIntelligenceInput): string {
  const sceneObjects = (input.sceneObjects ?? [])
    .map((object) => ({
      id: normalizeKey(object.id),
      name: object.name ? String(object.name) : "",
      role: object.role ? String(object.role) : "",
      severity: object.severity ? normalizeKey(object.severity) : "",
    }))
    .sort((a, b) => a.id.localeCompare(b.id) || a.name.localeCompare(b.name));
  const latestSignals = (input.latestSignals ?? [])
    .map((signal) => ({
      id: String(signal.id ?? ""),
      type: normalizeKey(String(signal.type ?? "")),
      label: String(signal.label ?? ""),
      strength: normalizeNumber(signal.strength),
      severity: normalizeKey(String(signal.severity ?? "")),
      objectIds: [...(signal.objectIds ?? [])].map(normalizeKey).sort(),
    }))
    .sort((a, b) => a.id.localeCompare(b.id) || a.type.localeCompare(b.type));
  const panelContext = input.panelContext ?? {};
  return JSON.stringify({
    domainId: normalizeKey(input.domainId ?? ""),
    sceneObjects,
    latestSignals,
    scannerSummary: {
      fragilityScore: normalizeNumber(input.scannerSummary?.fragilityScore),
      fragilityLevel: normalizeKey(input.scannerSummary?.fragilityLevel ?? ""),
      drivers: (input.scannerSummary?.drivers ?? []).map(normalizeKey),
      summary: String(input.scannerSummary?.summary ?? "").trim(),
    },
    panelContext: {
      conflictCount: normalizeNumber(panelContext.conflictCount),
      dominantDriverKey: normalizeKey(String(panelContext.dominantDriverKey ?? "")),
      driverKeys: Array.isArray(panelContext.driverKeys)
        ? panelContext.driverKeys.map((key) => normalizeKey(String(key)))
        : [],
      volatility: normalizeNumber(panelContext.volatility),
      hasRiskPropagation: Boolean(panelContext.hasRiskPropagation),
    },
    mode: input.mode ?? "live",
  });
}

export function buildDecisionIntelligenceOutputSignature(output: DecisionInsightOutput): string {
  return JSON.stringify({
    title: output.title,
    summary: output.summary,
    severity: output.severity,
    confidence: {
      score: normalizeNumber(output.confidence.score),
      level: output.confidence.level,
    },
    impact: output.impact ?? "",
    timeHorizon: output.timeHorizon ?? "",
    keyDrivers: output.keyDrivers ?? [],
    actions: output.actions.map((action) => ({
      id: action.id,
      label: action.label,
      intent: action.intent,
      targetPanel: action.targetPanel ?? "",
      targetObjectId: action.targetObjectId ?? "",
      reason: action.reason ?? "",
    })),
  });
}

function readCachedDecisionOutput(signature: string): DecisionInsightOutput | null {
  return decisionOutputCache.get(signature) ?? null;
}

function writeCachedDecisionOutput(signature: string, output: DecisionInsightOutput): DecisionInsightOutput {
  if (decisionOutputCache.size >= DECISION_OUTPUT_CACHE_LIMIT) {
    const oldestKey = decisionOutputCache.keys().next().value;
    if (oldestKey) decisionOutputCache.delete(oldestKey);
  }
  decisionOutputCache.set(signature, output);
  return output;
}

export function resolveDecisionSeverity(input: DecisionIntelligenceInput): DecisionInsightSeverity {
  const scan = input.scannerSummary;
  const score = clamp01(Number(scan?.fragilityScore ?? 0));
  const level = String(scan?.fragilityLevel ?? "").toLowerCase();
  const conflictCount = Number(input.panelContext?.conflictCount ?? 0) || 0;

  let explicit: DecisionInsightSeverity = "stable";
  if (level.includes("critical") || level.includes("severe")) explicit = "critical";
  else if (level.includes("high")) explicit = score >= 0.55 ? "critical" : "warning";
  else if (level.includes("medium") || level.includes("moderate") || level.includes("warning")) explicit = "warning";

  let scoreTier: DecisionInsightSeverity = "stable";
  if (score >= 0.8) scoreTier = "critical";
  else if (score >= 0.45) scoreTier = "warning";

  const strongSignals = (input.latestSignals ?? []).filter((s) => {
    const sev = String(s.severity ?? "").toLowerCase();
    if (sev.includes("critical") || sev.includes("high")) return true;
    return clamp01(Number(s.strength ?? 0)) >= 0.45;
  });
  let signalTier: DecisionInsightSeverity = "stable";
  if (strongSignals.length >= 2) signalTier = "warning";
  else if (strongSignals.length === 1 && score >= 0.35) signalTier = "warning";

  let conflictTier: DecisionInsightSeverity = "stable";
  if (conflictCount >= 3 && score >= 0.3) conflictTier = "warning";
  else if (conflictCount >= 2 && score >= 0.25) conflictTier = "warning";

  const scenePressure = (input.sceneObjects ?? []).some((o) => {
    const sev = String(o.severity ?? "").toLowerCase();
    return sev.includes("high") || sev.includes("critical");
  });
  const objectTier: DecisionInsightSeverity = scenePressure ? "warning" : "stable";

  const merged = [explicit, scoreTier, signalTier, conflictTier, objectTier].reduce(maxSeverity, "stable");
  return merged;
}

export function resolveDecisionConfidence(input: DecisionIntelligenceInput): {
  score: number;
  level: DecisionInsightConfidenceLevel;
} {
  let score = 0.2;
  const scan = input.scannerSummary;
  if (scan?.summary && String(scan.summary).trim().length > 0) score += 0.2;
  const drivers = scan?.drivers?.filter(Boolean) ?? [];
  if (drivers.length > 0) score += 0.2;

  const driverSet = new Set(drivers.map(normalizeKey));
  const highlighted = (input.sceneObjects ?? []).filter((o) => o.highlighted);
  const alignedHighlight = highlighted.some((o) => driverSet.has(normalizeKey(o.id)) || driverSet.has(normalizeKey(o.name ?? "")));
  if (alignedHighlight) score += 0.2;

  const types = new Set((input.latestSignals ?? []).map((s) => String(s.type ?? "unknown")));
  if (types.size >= 2) score += 0.2;

  const selected = input.selectedObjectId;
  if (selected && driverSet.has(normalizeKey(selected))) score += 0.08;

  score = clamp01(score);
  let level: DecisionInsightConfidenceLevel = "low";
  if (score >= 0.75) level = "high";
  else if (score >= 0.4) level = "medium";

  return { score, level };
}

function executiveTitle(severity: DecisionInsightSeverity, drivers: string[]): string {
  if (severity === "stable") return "System Stable";
  const blob = drivers.map(normalizeKey).join(" ");
  if (/(delivery|supplier|fulfill|logistics|delay|shipment)/.test(blob)) return "Delivery Risk";
  if (/(inventory|stock|warehouse|sku)/.test(blob)) return "Inventory Pressure";
  if (/(cash|liquidity|credit|margin|exposure)/.test(blob)) return "Cash Exposure";
  if (drivers[0]) {
    const raw = String(drivers[0]).replace(/_/g, " ").trim();
    if (raw.length <= 28) return raw.charAt(0).toUpperCase() + raw.slice(1);
    return `${raw.slice(0, 25)}…`;
  }
  return "Operating Pressure";
}

function buildSummary(input: DecisionIntelligenceInput, severity: DecisionInsightSeverity, drivers: string[]): string {
  const scanSum = String(input.scannerSummary?.summary ?? "").trim();
  if (scanSum && scanSum.length <= 220) {
    const sentences = scanSum.split(/(?<=[.!?])\s+/).slice(0, 2).join(" ");
    if (sentences.length > 0) return sentences;
  }
  if (severity === "stable") {
    return "No urgent pressure pattern is dominating the operating model.";
  }
  const top = drivers[0];
  if (top) {
    return `${top.replace(/_/g, " ")} is elevating propagation risk across the active system.`;
  }
  return "Fragility and signal data indicate an active decision window.";
}

function buildImpact(input: DecisionIntelligenceInput, severity: DecisionInsightSeverity): string | undefined {
  if (severity === "stable") return "No immediate escalation required";
  const score = clamp01(Number(input.scannerSummary?.fragilityScore ?? 0));
  if (score >= 0.65) return "Service levels and downstream commitments are at elevated breach risk";
  if (score >= 0.45) return "Cross-functional tradeoffs need attention before conditions harden";
  return "Early-stage pressure — window to intervene before compounding effects";
}

function buildTimeHorizon(input: DecisionIntelligenceInput, severity: DecisionInsightSeverity): string {
  if (severity === "stable") return "Now";
  const v = Number(input.panelContext?.volatility ?? 0);
  if (v >= 0.65) return "Hours to days";
  if (v >= 0.35) return "1–3 days";
  return "Near term";
}

export function buildDecisionInsight(
  input: DecisionIntelligenceInput,
  severity: DecisionInsightSeverity
): Pick<DecisionInsightOutput, "title" | "summary" | "impact" | "timeHorizon" | "keyDrivers"> {
  const drivers =
    input.scannerSummary?.drivers?.map((d) => String(d)) ??
    (input.panelContext?.driverKeys as string[] | undefined) ??
    [];
  const title = executiveTitle(severity, drivers);
  const summary = buildSummary(input, severity, drivers);
  const impact = buildImpact(input, severity);
  const timeHorizon = buildTimeHorizon(input, severity);
  const keyDrivers = drivers.map(normalizeKey).filter(Boolean).slice(0, 8);
  return { title, summary, impact, timeHorizon, keyDrivers };
}

function supplyChainish(input: DecisionIntelligenceInput): boolean {
  const domain = normalizeKey(input.domainId ?? "");
  const blob = driverBlob(input);
  return (
    /(supplier|inventory|delivery|fulfill|warehouse|sku|logistics)/.test(blob) ||
    domain.includes("supply") ||
    domain.includes("retail") ||
    domain.includes("fulfill")
  );
}

export function buildDecisionActions(
  input: DecisionIntelligenceInput,
  insightTitle: string,
  severity: DecisionInsightSeverity
): DecisionAction[] {
  const selectedId = input.selectedObjectId ?? undefined;
  const selectedName = input.selectedObjectName ?? undefined;
  const actions: DecisionAction[] = [];
  const push = (a: DecisionAction) => {
    if (actions.length >= 3) return;
    actions.push(a);
  };

  const elevated = severity === "warning" || severity === "critical";

  if (elevated) {
    if (selectedId) {
      push({
        id: "focus_pressure_object",
        label: selectedName ? `Focus ${selectedName}` : "Focus selection",
        intent: "focus_object",
        targetObjectId: selectedId,
        reason: "Anchor analysis on the object tied to current pressure signals.",
      });
    }
    push({
      id: "simulate_mitigation",
      label: "Simulate mitigation",
      intent: "simulate",
      targetPanel: "simulation",
      reason: "Test whether load balancing or policy shifts reduce downstream delay.",
    });
    if (!selectedId) {
      if (supplyChainish(input)) {
        push({
          id: "compare_suppliers",
          label: "Compare suppliers",
          intent: "compare",
          targetPanel: "war_room",
          reason: "Evaluate alternatives before service levels degrade.",
        });
      } else {
        push({
          id: "compare_options",
          label: "Compare options",
          intent: "compare",
          targetPanel: "simulation",
          reason: "Contrast scenarios before locking a move.",
        });
      }
    }
    push({
      id: "inspect_propagation",
      label: "Inspect propagation",
      intent: "timeline",
      targetPanel: "timeline",
      reason: "See how the issue spreads across the system.",
    });
  } else {
    push({
      id: "inspect_objects",
      label: "Inspect objects",
      intent: "inspect",
      targetPanel: "object",
      reason: "Review entities currently shaping the scene.",
    });
    push({
      id: "review_baseline",
      label: insightTitle === "System Stable" ? "Review baseline" : "Executive review",
      intent: "reassess",
      targetPanel: "executive",
      reason: "Confirm posture against the executive dashboard.",
    });
    push({
      id: "explore_timeline",
      label: "Explore timeline",
      intent: "timeline",
      targetPanel: "timeline",
      reason: "Walk forward effects for the current operating picture.",
    });
  }

  return actions.slice(0, 3);
}

export function buildDecisionIntelligence(input: DecisionIntelligenceInput): DecisionInsightOutput {
  const inputSignature = buildDecisionIntelligenceInputSignature(input);
  if (NEXORA_DECISION_FREEZE && lastStableDecisionResult) {
    return lastStableDecisionResult;
  }
  if (lastDecisionSignatureRef.current === inputSignature && lastStableDecisionResult) {
    return lastStableDecisionResult;
  }
  const cached = readCachedDecisionOutput(inputSignature);
  if (cached) {
    lastDecisionSignatureRef.current = inputSignature;
    lastStableDecisionResult = cached;
    return cached;
  }
  const severity = resolveDecisionSeverity(input);
  const confidence = resolveDecisionConfidence(input);
  const partial = buildDecisionInsight(input, severity);
  const actions = buildDecisionActions(input, partial.title, severity);
  const out: DecisionInsightOutput = {
    ...partial,
    severity,
    confidence,
    actions,
  };
  const outputSignature = buildDecisionIntelligenceOutputSignature(out);
  if (decisionTraceSignatures.get("semantic_output") !== outputSignature) {
    decisionTraceSignatures.set("semantic_output", outputSignature);
    devTrace("severity_resolved", {
      outputSignature,
      severity,
      score: input.scannerSummary?.fragilityScore ?? 0,
      level: input.scannerSummary?.fragilityLevel ?? "",
      conflictCount: input.panelContext?.conflictCount ?? 0,
    });
    devTrace("confidence_resolved", { outputSignature, ...confidence });
    devTrace("actions_generated", {
      outputSignature,
      count: actions.length,
      severity,
      actions: actions.map((action) => ({
        id: action.id,
        intent: action.intent,
        targetPanel: action.targetPanel ?? null,
        targetObjectId: action.targetObjectId ?? null,
      })),
    });
    devTrace("intelligence_built", {
      inputSignature,
      outputSignature,
      title: out.title,
      severity: out.severity,
      actions: out.actions.length,
    });
  }
  lastDecisionSignatureRef.current = inputSignature;
  lastStableDecisionResult = writeCachedDecisionOutput(inputSignature, out);
  return lastStableDecisionResult;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function pickRecord(source: Record<string, unknown> | null, keys: string[]): Record<string, unknown> | null {
  if (!source) return null;
  for (const key of keys) {
    const value = asRecord(source[key]);
    if (value) return value;
  }
  return null;
}

function pickArray(source: Record<string, unknown> | null, keys: string[]): unknown[] {
  if (!source) return [];
  for (const key of keys) {
    const value = source[key];
    if (Array.isArray(value)) return value;
  }
  return [];
}

function buildDecisionInputFromEvent(event: DecisionEvent): DecisionIntelligenceInput {
  const payload = asRecord(event.payload) ?? {};
  const response = asRecord(payload.responseData) ?? asRecord(payload.response_data) ?? payload;
  const sceneJson = asRecord(response.scene_json) ?? asRecord(payload.sceneJson) ?? response;
  const scene = asRecord(sceneJson.scene) ?? sceneJson;
  const fragilityScan =
    pickRecord(response, ["fragility_scan", "scanner_result", "scannerResult"]) ??
    pickRecord(payload, ["fragility_scan", "scanner_result", "scannerResult", "result"]);
  const fragility = asRecord(scene.fragility) ?? asRecord(response.fragility) ?? null;
  const driverRows = pickArray(fragilityScan, ["drivers"]);
  const driversObject = asRecord(fragility?.drivers) ?? null;
  const driverEntries =
    driverRows.length > 0
      ? driverRows.map((driver) => {
          const record = asRecord(driver) ?? {};
          return {
            key: String(record.label ?? record.id ?? "").trim(),
            value: Number(record.score ?? record.value ?? 0),
            severity: String(record.severity ?? ""),
          };
        })
      : driversObject
      ? Object.entries(driversObject).map(([key, value]) => ({
          key,
          value: Number(value ?? 0),
          severity: "",
        }))
      : [];
  const dominantDriver = driverEntries
    .filter((entry) => entry.key)
    .sort((a, b) => b.value - a.value)[0] ?? null;
  const fragilityScore =
    Number(fragilityScan?.fragility_score ?? fragilityScan?.score ?? fragility?.score ?? 0) || 0;
  const fragilityLevel = String(
    fragilityScan?.fragility_level ?? fragilityScan?.level ?? fragility?.level ?? ""
  );
  const sceneObjects = pickArray(scene, ["objects"]).filter(
    (object): object is Record<string, unknown> => Boolean(asRecord(object))
  );
  const conflicts = pickArray(response, ["conflicts"]);
  const strategicAdvice =
    pickRecord(response, ["strategic_advice", "strategicAdvice"]) ??
    pickRecord(payload, ["strategic_advice", "strategicAdvice"]);
  const riskPropagation =
    response.risk_propagation ?? response.riskPropagation ?? payload.risk_propagation ?? payload.riskPropagation ?? null;

  return buildDecisionIntelligenceInput({
    domainId: String(payload.domainId ?? response.domainId ?? response.domain_id ?? ""),
    activeSection: null,
    selectedObjectId: null,
    selectedObjectName: null,
    sceneObjects,
    fragilityScore,
    fragilityLevel,
    fragilityScanSummary: String(fragilityScan?.summary ?? payload.text ?? "").trim() || null,
    dominantDriver,
    fragilityScanResult: fragilityScan as BuildDecisionIntelligenceInputArgs["fragilityScanResult"],
    conflicts,
    strategicAdvice: strategicAdvice as BuildDecisionIntelligenceInputArgs["strategicAdvice"],
    riskPropagation,
    volatility: Number(response.volatility ?? payload.volatility ?? 0) || 0,
    mode: event.type === "CHAT_SUBMITTED" ? "live" : "demo",
  });
}

let isDecisionBusInitialized = false;

function handleDecisionEvent(event: DecisionEvent): void {
  resetDecisionExecutionGuard();
  const input = buildDecisionInputFromEvent(event);
  const signature = buildDecisionIntelligenceInputSignature(input);
  const result = buildDecisionIntelligence(input);
  setDecision(result, signature);
}

export function initDecisionBus(): void {
  if (isDecisionBusInitialized) return;
  isDecisionBusInitialized = true;
  subscribeDecisionEvent(handleDecisionEvent);
}

export function traceDecisionLoopAudit(
  tag: "input_signature" | "output_signature",
  payload: Record<string, unknown>
): void {
  if (!DEV) return;
  const signature = stableTraceSignature(payload);
  const key = `loop_audit_console_${tag}`;
  if (decisionTraceSignatures.get(key) === signature) return;
  decisionTraceSignatures.set(key, signature);
  globalThis.console?.debug?.(`[Nexora][DecisionLoopAudit] ${tag}`, payload);
}

/** Stable default for refs declared before the first intelligence build. */
export function createInitialDecisionOutput(): DecisionInsightOutput {
  return {
    title: "System Stable",
    summary: "No decision event has updated the operating picture yet.",
    severity: "stable",
    confidence: { score: 0, level: "low" },
    impact: "No immediate escalation required",
    timeHorizon: "Now",
    keyDrivers: [],
    actions: [],
  };
}

export type BuildDecisionIntelligenceInputArgs = {
  domainId?: string | null;
  activeSection?: string | null;
  selectedObjectId?: string | null;
  selectedObjectName?: string | null;
  sceneObjects: Array<Record<string, unknown>>;
  fragilityScore: number;
  fragilityLevel: string;
  fragilityScanSummary?: string | null;
  dominantDriver: { key: string; value: number } | null;
  fragilityScanResult: {
    summary?: string;
    drivers?: Array<{ id?: string; label?: string; score?: number; severity?: string }>;
    suggested_objects?: string[];
    scene_payload?: { highlighted_object_ids?: string[] };
  } | null;
  conflicts: unknown[];
  strategicAdvice: { recommended_actions?: unknown[] } | null;
  riskPropagation: unknown;
  volatility?: number;
  mode?: "demo" | "live";
};

export function buildDecisionIntelligenceInput(args: BuildDecisionIntelligenceInputArgs): DecisionIntelligenceInput {
  const driverKeys: string[] = [];
  if (args.dominantDriver?.key) driverKeys.push(String(args.dominantDriver.key));
  const scanDrivers = args.fragilityScanResult?.drivers ?? [];
  for (const d of scanDrivers) {
    const label = String(d.label ?? d.id ?? "").trim();
    if (label) driverKeys.push(label);
  }

  const sceneObjects = (args.sceneObjects ?? []).map((raw) => {
    const id = String(raw.id ?? "").trim();
    const highlightedIds = args.fragilityScanResult?.scene_payload?.highlighted_object_ids ?? [];
    const highlighted = highlightedIds.includes(id) || Boolean(raw.highlighted ?? raw.emphasis);
    return {
      id,
      name: raw.name != null ? String(raw.name) : undefined,
      role: raw.role != null ? String(raw.role) : undefined,
      severity: raw.severity != null ? String(raw.severity) : undefined,
      highlighted,
      dimmed: Boolean(raw.dimmed),
    };
  });

  const latestSignals: DecisionIntelligenceSignal[] = [];
  if (args.dominantDriver) {
    latestSignals.push({
      id: "signal-dominant-driver",
      type: "pressure",
      label: String(args.dominantDriver.key),
      strength: clamp01(Number(args.dominantDriver.value)),
      severity: args.fragilityLevel,
    });
  }
  const conflicts = Array.isArray(args.conflicts) ? args.conflicts : [];
  conflicts.slice(0, 6).forEach((c: any, i) => {
    latestSignals.push({
      id: `signal-conflict-${i}`,
      type: "conflict",
      label: String(c?.title ?? c?.summary ?? c?.id ?? "conflict"),
      strength: 0.55,
      severity: "warning",
    });
  });
  const rawAdvice = args.strategicAdvice?.recommended_actions?.[0] as Record<string, unknown> | undefined;
  if (rawAdvice) {
    latestSignals.push({
      id: "signal-strategic-advice",
      type: "advice",
      label: String(rawAdvice.summary ?? rawAdvice.title ?? rawAdvice.label ?? "advice"),
      strength: 0.5,
      severity: "info",
    });
  }
  if (args.riskPropagation && typeof args.riskPropagation === "object") {
    latestSignals.push({
      id: "signal-risk-propagation",
      type: "propagation",
      label: "risk_propagation",
      strength: 0.42,
      severity: "warning",
    });
  }

  const scannerSummary = {
    fragilityScore: clamp01(Number(args.fragilityScore)),
    fragilityLevel: String(args.fragilityLevel ?? ""),
    drivers: driverKeys.map((k) => normalizeKey(k)),
    summary: String(args.fragilityScanResult?.summary ?? args.fragilityScanSummary ?? "").trim() || undefined,
  };

  return {
    domainId: args.domainId ?? undefined,
    activePanel: args.activeSection ?? undefined,
    selectedObjectId: args.selectedObjectId,
    selectedObjectName: args.selectedObjectName,
    sceneObjects,
    latestSignals,
    scannerSummary,
    panelContext: {
      conflictCount: conflicts.length,
      dominantDriverKey: args.dominantDriver?.key ?? null,
      driverKeys,
      volatility: args.volatility ?? 0,
      hasRiskPropagation: Boolean(args.riskPropagation),
    },
    mode: args.mode,
  };
}

export function formatPostCommandDecisionFeedback(output: DecisionInsightOutput): string {
  if (output.severity === "stable") {
    return `${output.title}. No immediate escalation.`;
  }
  if (output.actions.some((a) => a.intent === "simulate" || a.intent === "mitigate")) {
    return `${output.title} updated. Simulation path ready — see Executive / Timeline.`;
  }
  return `${output.title} updated. See Executive view.`;
}

export function formatCommandSubmittedDecisionAck(output: DecisionInsightOutput): string {
  return `${output.title} — ${output.confidence.level} confidence. Watch the executive rail for the live readout.`;
}
