import type { ObjectInfoHudModel } from "../scene/objectInfoHudTypes";
import { logObjectInfoHierarchy } from "./executiveObjectInformationHierarchy";
import { buildExecutiveObjectSummary } from "./executiveObjectSummaryRuntime";
import type { ObjectInfoDisclosureView } from "./objectInfoProgressiveDisclosure";
import { DEFAULT_OBJECT_INFO_DISCLOSURE_VIEW } from "./objectInfoProgressiveDisclosure";

export interface ExecutiveObjectInfoLayout {
  header: {
    objectId: string;
    name: string;
    type: string;
  };
  primary: {
    health: string;
    riskLevel: string;
    frsi: string;
    readiness: string;
  };
  secondary: {
    summary: string;
    criticalLinks: number;
    signals: string[];
    signalOverflow: number;
  };
  context: {
    connected: number;
    criticalLinks: number;
    type: string;
  };
  advanced: {
    mostInfluentialConnection: string | null;
    mostCriticalDependency: string | null;
    highestRiskRelationship: string | null;
  };
  actions: Array<{
    id: "analyze" | "simulate" | "focus" | "compare" | "create_impact";
    label: string;
    enabled: boolean;
  }>;
  disclosureView: ObjectInfoDisclosureView;
}

const MAX_VISIBLE_SIGNALS = 4;

function normalizeText(value: string | null | undefined, fallback: string): string {
  const text = String(value ?? "").replace(/\s+/g, " ").trim();
  return text || fallback;
}

function formatFrsi(value: number | null | undefined): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  return String(Math.round(Math.max(0, Math.min(1, value)) * 100));
}

export function buildExecutiveObjectInfoLayout(
  model: ObjectInfoHudModel,
  disclosureView: ObjectInfoDisclosureView = DEFAULT_OBJECT_INFO_DISCLOSURE_VIEW
): ExecutiveObjectInfoLayout | null {
  const objectId = model.selectedObjectId?.trim();
  if (!objectId) return null;

  const relationshipCount = model.relationshipCount ?? 0;
  const criticalLinks =
    model.statusTone === "critical" || model.statusTone === "high"
      ? Math.min(relationshipCount, Math.max(1, Math.ceil(relationshipCount / 2)))
      : 0;

  const allSignals = (model.signals?.length ? model.signals : [model.objectType ?? "Object"])
    .map((signal) => normalizeText(signal, "Signal"))
    .filter(Boolean);
  const visibleSignals = allSignals.slice(0, MAX_VISIBLE_SIGNALS);
  const signalOverflow = Math.max(0, allSignals.length - visibleSignals.length);

  const layout: ExecutiveObjectInfoLayout = {
    header: {
      objectId,
      name: normalizeText(model.objectName, objectId),
      type: normalizeText(model.objectType, "Object"),
    },
    primary: {
      health: normalizeText(model.healthLabel, "Monitoring"),
      riskLevel: normalizeText(
        model.editableObject?.riskLevel != null ? String(model.editableObject.riskLevel) : model.riskLevel,
        "Pending"
      ),
      frsi: formatFrsi(model.frsiScore),
      readiness: normalizeText(model.reliabilityLabel, "Pending"),
    },
    secondary: {
      summary: buildExecutiveObjectSummary(model),
      criticalLinks,
      signals: visibleSignals,
      signalOverflow,
    },
    context: {
      connected: relationshipCount,
      criticalLinks,
      type: normalizeText(model.objectType, "Object"),
    },
    advanced: {
      mostInfluentialConnection: model.relationshipContext?.mostInfluentialConnection
        ? `${model.relationshipContext.mostInfluentialConnection.executiveLabel} · ${model.relationshipContext.mostInfluentialConnection.connectedObjectLabel}`
        : null,
      mostCriticalDependency: model.relationshipContext?.mostCriticalDependency
        ? `${model.relationshipContext.mostCriticalDependency.executiveLabel} · ${model.relationshipContext.mostCriticalDependency.connectedObjectLabel}`
        : null,
      highestRiskRelationship: model.relationshipContext?.highestRiskRelationship
        ? `${model.relationshipContext.highestRiskRelationship.executiveLabel} · ${model.relationshipContext.highestRiskRelationship.connectedObjectLabel}`
        : null,
    },
    actions: [
      { id: "analyze", label: "Analyze", enabled: false },
      { id: "simulate", label: "Simulate", enabled: false },
      { id: "compare", label: "Compare", enabled: false },
      { id: "focus", label: "Focus", enabled: false },
      { id: "create_impact", label: "Impact", enabled: false },
    ],
    disclosureView,
  };

  logObjectInfoHierarchy({
    objectId,
    disclosureView,
    primaryFields: Object.keys(layout.primary).length,
    secondarySignals: visibleSignals.length,
    signalOverflow,
  });

  return layout;
}

const objectInfoLayoutLogKeys = new Set<string>();

function devLog(label: string, payload: Record<string, unknown>, key: string): void {
  if (process.env.NODE_ENV === "production") return;
  const logKey = `${label}:${key}`;
  if (objectInfoLayoutLogKeys.has(logKey)) return;
  objectInfoLayoutLogKeys.add(logKey);
  globalThis.console?.debug?.(label, payload);
}

export function logExecutiveObjectInfoReadability(layout: ExecutiveObjectInfoLayout): void {
  const payload = {
    objectId: layout.header.objectId,
    disclosureView: layout.disclosureView,
    signalCount: layout.secondary.signals.length,
    signalOverflow: layout.secondary.signalOverflow,
    actionCount: layout.actions.length,
    estimatedSections: layout.disclosureView === "detailed" ? 5 : layout.disclosureView === "standard" ? 4 : 2,
  };
  const signature = `${payload.objectId}:${payload.disclosureView}:${payload.signalCount}`;
  devLog("[Nexora][ObjectInfoAudit]", payload, signature);
  devLog("[Nexora][ObjectInfoCompacted]", payload, signature);
}

export function resetExecutiveObjectInfoLayoutLogsForTests(): void {
  objectInfoLayoutLogKeys.clear();
}
