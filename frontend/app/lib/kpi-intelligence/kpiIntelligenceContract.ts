/**
 * DS:5:1 — KPI Intelligence Foundation contract.
 *
 * Immutable KPI-level intelligence metadata. No visual rendering, scene
 * mutation, or MRP routing authority.
 */

export const KPI_INTELLIGENCE_RUNTIME_DIAGNOSTIC =
  "[KPI_INTELLIGENCE_RUNTIME]" as const;

export const KPI_INTELLIGENCE_READY_DIAGNOSTIC = "[KPI_INTELLIGENCE_READY]" as const;

export const KPI_INTELLIGENCE_RUNTIME_VERSION = "5.1.0" as const;

export type KpiIntelligenceCategory =
  | "Revenue"
  | "Cost"
  | "Margin"
  | "Schedule"
  | "Quality"
  | "Capacity"
  | "Delivery"
  | "Risk Exposure";

export type KpiIntelligenceDirection = "up" | "down" | "neutral";

export type KpiIntelligenceSource = "scene" | "data_source" | "runtime";

export type KpiIntelligenceProfile = Readonly<{
  kpiId: string;
  label: string;
  category: KpiIntelligenceCategory;
  value: number;
  target: number;
  intelligenceScore: number;
  confidence: number;
  direction: KpiIntelligenceDirection;
  source: KpiIntelligenceSource;
}>;

export type KpiIntelligenceRegistry = Readonly<{
  version: typeof KPI_INTELLIGENCE_RUNTIME_VERSION;
  profiles: readonly KpiIntelligenceProfile[];
  profileByKpiId: Readonly<Record<string, KpiIntelligenceProfile>>;
  kpiCount: number;
  supportedCategories: readonly KpiIntelligenceCategory[];
  visualRendering: false;
  sceneMutation: false;
  mrpMutation: false;
  diagnostics: readonly [
    typeof KPI_INTELLIGENCE_RUNTIME_DIAGNOSTIC,
    typeof KPI_INTELLIGENCE_READY_DIAGNOSTIC,
  ];
}>;

export type KpiIntelligenceBuildInput = Readonly<{
  sceneJson?: unknown;
  kpis?: readonly unknown[];
  dataSourceKpis?: readonly unknown[];
}>;

export const KPI_INTELLIGENCE_SUPPORTED_CATEGORIES = Object.freeze([
  "Revenue",
  "Cost",
  "Margin",
  "Schedule",
  "Quality",
  "Capacity",
  "Delivery",
  "Risk Exposure",
] as const);

export const KPI_INTELLIGENCE_DIAGNOSTICS = Object.freeze([
  KPI_INTELLIGENCE_RUNTIME_DIAGNOSTIC,
  KPI_INTELLIGENCE_READY_DIAGNOSTIC,
] as const);

export const EMPTY_KPI_INTELLIGENCE_REGISTRY: KpiIntelligenceRegistry = Object.freeze({
  version: KPI_INTELLIGENCE_RUNTIME_VERSION,
  profiles: Object.freeze([]),
  profileByKpiId: Object.freeze({}),
  kpiCount: 0,
  supportedCategories: KPI_INTELLIGENCE_SUPPORTED_CATEGORIES,
  visualRendering: false,
  sceneMutation: false,
  mrpMutation: false,
  diagnostics: KPI_INTELLIGENCE_DIAGNOSTICS,
});
