import type { DashboardContext } from "../ui/mainRightPanelContract";

export type NexoraSourceType =
  | "csv"
  | "excel"
  | "pdf"
  | "json"
  | "api"
  | "database"
  | "erp"
  | "telemetry";

export type SourceStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "warning"
  | "error";

export type SourceRoutePolicy =
  | "dashboard_context_only"
  | "no_direct_scene_mutation"
  | "assistant_discussion_only";

export interface NexoraSource {
  id: string;
  name: string;
  type: NexoraSourceType;
  status: SourceStatus;
  description?: string;
  lastSyncAt?: string;
  createdAt?: string;
  metadata?: Record<string, unknown>;
}

export interface NexoraSourceHealthVisibility {
  status: SourceStatus;
  lastSyncAt?: string;
  sourceType: NexoraSourceType;
  sourceName: string;
  recordsCount?: number;
  refreshInterval?: string;
  errorMessage?: string;
}

export interface SourceDashboardContextContract {
  context: Extract<DashboardContext, "sources">;
  defaultPanelTarget: "dashboard";
  routePolicy: readonly SourceRoutePolicy[];
  mayShow: readonly [
    "source_list",
    "source_details",
    "connection_status",
    "health_overview",
  ];
  mustNotOwn: readonly [
    "scenario_generation",
    "risk_analysis",
    "simulation",
    "war_room_decisions",
    "ai_assistant_chat",
    "direct_scene_mutation",
  ];
}

export const SOURCE_MANAGEMENT_DASHBOARD_CONTEXT: SourceDashboardContextContract = Object.freeze({
  context: "sources",
  defaultPanelTarget: "dashboard",
  routePolicy: [
    "dashboard_context_only",
    "no_direct_scene_mutation",
    "assistant_discussion_only",
  ] as const,
  mayShow: [
    "source_list",
    "source_details",
    "connection_status",
    "health_overview",
  ] as const,
  mustNotOwn: [
    "scenario_generation",
    "risk_analysis",
    "simulation",
    "war_room_decisions",
    "ai_assistant_chat",
    "direct_scene_mutation",
  ] as const,
});

export const CANONICAL_NEXORA_SOURCE_TYPES: readonly NexoraSourceType[] = Object.freeze([
  "csv",
  "excel",
  "pdf",
  "json",
  "api",
  "database",
  "erp",
  "telemetry",
]);

export const CANONICAL_SOURCE_STATUSES: readonly SourceStatus[] = Object.freeze([
  "disconnected",
  "connecting",
  "connected",
  "warning",
  "error",
]);

export const SOURCE_TO_SCENE_FLOW = Object.freeze([
  "source",
  "operational_model",
  "scene",
] as const);

export function isNexoraSourceType(value: unknown): value is NexoraSourceType {
  return (
    typeof value === "string" &&
    (CANONICAL_NEXORA_SOURCE_TYPES as readonly string[]).includes(value.trim().toLowerCase())
  );
}

export function isSourceStatus(value: unknown): value is SourceStatus {
  return (
    typeof value === "string" &&
    (CANONICAL_SOURCE_STATUSES as readonly string[]).includes(value.trim().toLowerCase())
  );
}

export function normalizeNexoraSourceType(value: unknown, options?: { warn?: boolean }): NexoraSourceType {
  if (isNexoraSourceType(value)) return value.trim().toLowerCase() as NexoraSourceType;

  if (options?.warn !== false) {
    console.warn("[SourceManagement][Brake] Unknown source type detected.", {
      sourceType: value ?? null,
      fallbackType: "json",
    });
  }
  return "json";
}

export function normalizeSourceStatus(value: unknown, options?: { warn?: boolean }): SourceStatus {
  if (isSourceStatus(value)) return value.trim().toLowerCase() as SourceStatus;

  if (options?.warn !== false) {
    console.warn("[SourceManagement][Brake] Invalid source status detected.", {
      sourceStatus: value ?? null,
      fallbackStatus: "error",
    });
  }
  return "error";
}

export function normalizeDashboardContext(value: unknown, options?: { warn?: boolean }): DashboardContext {
  const raw = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (
    raw === "sources" ||
    raw === "overview" ||
    raw === "scenario" ||
    raw === "risk" ||
    raw === "war_room" ||
    raw === "timeline" ||
    raw === "settings"
  ) {
    return raw;
  }

  if (options?.warn !== false) {
    console.warn("[SourceManagement][Brake] Source context routing failed.", {
      dashboardContext: value ?? null,
      fallbackContext: "overview",
    });
  }
  return "overview";
}

export function normalizeNexoraSource(input: {
  id?: unknown;
  name?: unknown;
  type?: unknown;
  status?: unknown;
  description?: unknown;
  lastSyncAt?: unknown;
  createdAt?: unknown;
  metadata?: unknown;
}): NexoraSource {
  const id = String(input.id ?? "").trim() || "source:unregistered";
  const name = String(input.name ?? "").trim() || "Unnamed source";
  const metadata =
    input.metadata && typeof input.metadata === "object" && !Array.isArray(input.metadata)
      ? (input.metadata as Record<string, unknown>)
      : undefined;

  return {
    id,
    name,
    type: normalizeNexoraSourceType(input.type),
    status: normalizeSourceStatus(input.status),
    description: typeof input.description === "string" ? input.description : undefined,
    lastSyncAt: typeof input.lastSyncAt === "string" ? input.lastSyncAt : undefined,
    createdAt: typeof input.createdAt === "string" ? input.createdAt : undefined,
    metadata,
  };
}

export function buildSourceHealthVisibility(source: NexoraSource): NexoraSourceHealthVisibility {
  return {
    status: source.status,
    lastSyncAt: source.lastSyncAt,
    sourceType: source.type,
    sourceName: source.name,
    recordsCount:
      typeof source.metadata?.recordsCount === "number" ? source.metadata.recordsCount : undefined,
    refreshInterval:
      typeof source.metadata?.refreshInterval === "string" ? source.metadata.refreshInterval : undefined,
    errorMessage:
      typeof source.metadata?.errorMessage === "string" ? source.metadata.errorMessage : undefined,
  };
}
