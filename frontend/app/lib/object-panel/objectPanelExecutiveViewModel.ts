/**
 * MRP:12:1 — Presentation-only view model for executive Object Panel layout.
 * Maps existing runtime data to visual hierarchy; no new business logic.
 */

import type { ExecutiveObjectPanelData } from "../panels/executiveObjectPanelData.ts";
import type { ExecutiveActionPanelModel } from "./executiveActionPanelContract.ts";

export type ObjectPanelExecutiveViewModel = Readonly<{
  objectId: string;
  objectName: string;
  objectType: string;
  operationalState: string;
  statusLabel: string;
  executiveSummary: string;
  signals: Readonly<{
    status: string;
    impact: string;
    confidence: string;
    riskLevel: string;
  }>;
  insights: readonly string[];
  relationships: Readonly<{
    connectedObjects: number;
    dependencies: number;
    influenceCount: number;
  }>;
}>;

function impactLabelFromRisk(riskLevel: string | undefined): string {
  const normalized = String(riskLevel ?? "").trim().toLowerCase();
  if (normalized.includes("critical")) return "Critical";
  if (normalized.includes("high")) return "High";
  if (normalized.includes("medium") || normalized.includes("moderate")) return "Moderate";
  if (normalized.includes("low")) return "Low";
  return "Monitoring";
}

function formatConfidence(score: number | null | undefined): string {
  if (typeof score !== "number" || !Number.isFinite(score)) return "Pending";
  return `${Math.round(Math.max(0, Math.min(1, score)) * 100)}%`;
}

function formatRiskLabel(riskLevel: string | undefined): string {
  const normalized = String(riskLevel ?? "unknown").trim();
  if (!normalized || normalized === "unknown") return "Unknown";
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function uniqueInsights(values: Array<string | null | undefined>): readonly string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of values) {
    const text = String(raw ?? "").replace(/\s+/g, " ").trim();
    if (!text || seen.has(text)) continue;
    seen.add(text);
    out.push(text);
    if (out.length >= 3) break;
  }
  return Object.freeze(out);
}

export function buildObjectPanelExecutiveViewModel(input: {
  data?: ExecutiveObjectPanelData | null;
  model: ExecutiveActionPanelModel;
  executiveSummary?: string | null;
  extraInsights?: readonly string[];
}): ObjectPanelExecutiveViewModel {
  const data = input.data;
  const model = input.model;
  const riskLevel = data?.riskLevel ?? model.riskLevel;
  const confidence = data?.confidence ?? null;
  const status = data?.status ?? model.status ?? "Active";
  const summary =
    input.executiveSummary?.trim() ||
    data?.insight?.trim() ||
    "This object is currently operating within acceptable thresholds but presents elevated dependency risk.";

  return Object.freeze({
    objectId: model.objectId,
    objectName: model.objectName,
    objectType: data?.objectType ?? model.objectType ?? "Object",
    operationalState: status,
    statusLabel: status,
    executiveSummary: summary,
    signals: Object.freeze({
      status: status,
      impact: impactLabelFromRisk(riskLevel),
      confidence: formatConfidence(confidence),
      riskLevel: formatRiskLabel(riskLevel),
    }),
    insights: uniqueInsights([
      data?.insight,
      data?.recommendedAction,
      ...(input.extraInsights ?? []),
      model.dependencies > 0
        ? `${model.dependencies} dependent object${model.dependencies === 1 ? "" : "s"} in scope.`
        : null,
    ]),
    relationships: Object.freeze({
      connectedObjects: data?.connectionCount ?? model.connections ?? 0,
      dependencies: data?.dependencyCount ?? model.dependencies ?? 0,
      influenceCount: Math.max(
        data?.connectionCount ?? model.connections ?? 0,
        data?.affectedObjects?.length ?? 0
      ),
    }),
  });
}
