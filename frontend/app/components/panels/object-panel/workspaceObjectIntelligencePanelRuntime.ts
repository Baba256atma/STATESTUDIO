import { resolveObjectPanelIntegrationState } from "../../../lib/object-panel/objectPanelIntegrationRuntime.ts";
import {
  resolveObjectKpiSummaryState,
  WORKSPACE_KPI_PANEL_TAGS,
  type ObjectKpiSummaryState,
} from "./kpiSummaryRuntime.ts";
import {
  resolveObjectOkrSummaryState,
  WORKSPACE_OKR_PANEL_TAGS,
  type ObjectOkrSummaryState,
} from "./okrSummaryRuntime.ts";
import {
  resolveObjectRiskSummaryState,
  WORKSPACE_RISK_PANEL_TAGS,
  type ObjectRiskSummaryState,
} from "./riskSummaryRuntime.ts";

export const WORKSPACE_OBJECT_INTELLIGENCE_PANEL_TAGS = Object.freeze([
  "[DS35_OBJECT_INTELLIGENCE_PANEL]",
  "[OBJECT_INTELLIGENCE_VISIBLE]",
  "[IMPACT_DEPENDENCY_CONFIDENCE_VISIBLE]",
  "[OBJECT_PANEL_UPGRADED]",
  "[DS36_READY]",
  "[DS_3_5_COMPLETE]",
  ...WORKSPACE_KPI_PANEL_TAGS,
  ...WORKSPACE_OKR_PANEL_TAGS,
  ...WORKSPACE_RISK_PANEL_TAGS,
] as const);

export const NEXORA_OBJECT_INTELLIGENCE_PANEL_LOG_PREFIX =
  "[NexoraObjectIntelligencePanel]" as const;

export type WorkspaceObjectIntelligencePanelState = Readonly<{
  workspaceId: string;
  objectId: string;
  objectName: string;
  objectType: string;
  impact: Readonly<{
    score: string;
    level: string;
    available: boolean;
  }>;
  dependency: Readonly<{
    score: string;
    level: string;
    available: boolean;
  }>;
  confidence: Readonly<{
    score: string;
    level: string;
    available: boolean;
  }>;
  reasons: readonly string[];
  hasAnyIntelligence: boolean;
  kpiSummary: ObjectKpiSummaryState;
  okrSummary: ObjectOkrSummaryState;
  riskSummary: ObjectRiskSummaryState;
}>;

export type WorkspaceObjectIntelligencePanelStateInput = Readonly<{
  workspaceId?: string | null;
  objectId?: string | null;
  objectName?: string | null;
  objectType?: string | null;
}>;

function formatScore(value: number | undefined): string {
  return typeof value === "number" && Number.isFinite(value) ? String(Math.round(value)) : "--";
}

function splitReasons(...values: Array<string | null | undefined>): readonly string[] {
  const seen = new Set<string>();
  const reasons: string[] = [];
  for (const value of values) {
    const parts = String(value ?? "")
      .split(/[.;]/)
      .map((part) => part.replace(/\s+/g, " ").trim())
      .filter(Boolean);
    for (const part of parts) {
      if (seen.has(part)) continue;
      seen.add(part);
      reasons.push(part);
      if (reasons.length >= 6) return Object.freeze(reasons);
    }
  }
  return Object.freeze(reasons);
}

export function resolveWorkspaceObjectIntelligencePanelState(
  input: WorkspaceObjectIntelligencePanelStateInput
): WorkspaceObjectIntelligencePanelState {
  const integration = resolveObjectPanelIntegrationState(input);
  const intelligence = integration.intelligenceProfile;
  const impact = integration.impactProfile;
  const dependency = integration.dependencyProfile;
  const confidence = integration.confidenceProfile;
  const reasons = splitReasons(
    impact?.impactReason,
    dependency?.dependencyReason,
    confidence?.confidenceReason
  );

  const resolvedObjectId = integration.resolvedObjectId || integration.objectId;
  const kpiSummary = resolveObjectKpiSummaryState({
    workspaceId: integration.workspaceId,
    objectId: resolvedObjectId,
  });
  const okrSummary = resolveObjectOkrSummaryState({
    workspaceId: integration.workspaceId,
    objectId: resolvedObjectId,
  });
  const riskSummary = resolveObjectRiskSummaryState({
    workspaceId: integration.workspaceId,
    objectId: resolvedObjectId,
  });

  return Object.freeze({
    workspaceId: integration.workspaceId,
    objectId: resolvedObjectId,
    objectName: intelligence?.objectName ?? input.objectName ?? resolvedObjectId ?? integration.objectId,
    objectType: intelligence?.objectType ?? input.objectType ?? "Object",
    impact: Object.freeze({
      score: formatScore(impact?.impactScore),
      level: impact?.impactLevel ?? "Unavailable",
      available: Boolean(impact),
    }),
    dependency: Object.freeze({
      score: formatScore(dependency?.dependencyScore),
      level: dependency?.dependencyLevel ?? "Unavailable",
      available: Boolean(dependency),
    }),
    confidence: Object.freeze({
      score: formatScore(confidence?.confidenceScore),
      level: confidence?.confidenceLevel ?? "Unavailable",
      available: Boolean(confidence),
    }),
    reasons,
    hasAnyIntelligence: Boolean(intelligence || impact || dependency || confidence),
    kpiSummary,
    okrSummary,
    riskSummary,
  });
}
