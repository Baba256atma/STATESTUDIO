import { getKpiObjectBindingsForObject } from "../../../lib/kpi/workspaceKpiObjectBinding.ts";
import {
  getWorkspaceKpiHealthProfiles,
  type WorkspaceKpiHealthProfile,
  type WorkspaceKpiHealthStatus,
} from "../../../lib/kpi/workspaceKpiHealthEngine.ts";

export const WORKSPACE_KPI_PANEL_TAGS = Object.freeze([
  "[DS45_KPI_PANEL]",
  "[KPI_VISIBLE_IN_OBJECT_PANEL]",
  "[OBJECT_PANEL_EXTENDED]",
  "[NO_NEW_PANEL_CREATED]",
  "[DS46_READY]",
  "[DS_4_5_COMPLETE]",
] as const);

export const NEXORA_KPI_PANEL_LOG_PREFIX = "[NexoraKpiPanel]" as const;

export type ObjectKpiSummaryItem = Readonly<{
  kpiId: string;
  kpiName: string;
  healthStatusLabel: string;
  progressLabel: string;
  healthAvailable: boolean;
}>;

export type ObjectKpiSummaryState = Readonly<{
  items: readonly ObjectKpiSummaryItem[];
  emptyMessage: string | null;
  bindingCount: number;
  healthProfileCount: number;
  visible: boolean;
}>;

export type ObjectKpiSummaryInput = Readonly<{
  workspaceId?: string | null;
  objectId?: string | null;
}>;

const EMPTY_KPI_SUMMARY: ObjectKpiSummaryState = Object.freeze({
  items: Object.freeze([]),
  emptyMessage: null,
  bindingCount: 0,
  healthProfileCount: 0,
  visible: false,
});

function normalizeId(value: unknown): string {
  return String(value ?? "").trim();
}

function formatHealthStatusLabel(status: WorkspaceKpiHealthStatus): string {
  if (status === "unknown") return "Unknown";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatProgressLabel(progressPercent: number): string {
  if (!Number.isFinite(progressPercent)) return "--";
  return `${Math.round(progressPercent)}%`;
}

function formatKpiIdLabel(kpiId: string): string {
  return kpiId
    .replace(/^wkpi_/, "")
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function kpiNameFromHealthReason(healthReason: string): string | null {
  const trimmed = healthReason.trim();
  const patterns = [
    /^(.+?) exceeded target/,
    /^(.+?) is at \d+/,
    /^(.+?) is below target/,
    /^(.+?) health is unknown/,
  ];
  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match?.[1]) return match[1].trim();
  }
  return null;
}

function kpiNameFromBindingReason(bindingReason: string): string | null {
  const trimmed = bindingReason.trim();
  const manualMatch = trimmed.match(/^Manually bound (.+?) to object/);
  if (manualMatch?.[1]) return manualMatch[1].trim();

  const suggestMatch = trimmed.match(
    /^(.+?) (?:exactly matches|strongly matches|relates to|has a weak keyword overlap with)/
  );
  if (suggestMatch?.[1]) return suggestMatch[1].trim();

  return null;
}

function resolveKpiName(input: {
  kpiId: string;
  bindingReason: string;
  healthProfile: WorkspaceKpiHealthProfile | null;
}): string {
  const fromHealth = input.healthProfile
    ? kpiNameFromHealthReason(input.healthProfile.healthReason)
    : null;
  if (fromHealth) return fromHealth;

  const fromBinding = kpiNameFromBindingReason(input.bindingReason);
  if (fromBinding) return fromBinding;

  return formatKpiIdLabel(input.kpiId);
}

function buildKpiSummaryItem(input: {
  kpiId: string;
  bindingReason: string;
  healthProfile: WorkspaceKpiHealthProfile | null;
}): ObjectKpiSummaryItem {
  const healthAvailable = Boolean(input.healthProfile);
  return Object.freeze({
    kpiId: input.kpiId,
    kpiName: resolveKpiName(input),
    healthStatusLabel: healthAvailable
      ? formatHealthStatusLabel(input.healthProfile!.healthStatus)
      : "Unavailable",
    progressLabel: healthAvailable
      ? formatProgressLabel(input.healthProfile!.progressPercent)
      : "--",
    healthAvailable,
  });
}

export function resolveObjectKpiSummaryState(
  input: ObjectKpiSummaryInput
): ObjectKpiSummaryState {
  const workspaceId = normalizeId(input.workspaceId);
  const objectId = normalizeId(input.objectId);

  if (!workspaceId || !objectId) {
    return EMPTY_KPI_SUMMARY;
  }

  const bindings = getKpiObjectBindingsForObject(workspaceId, objectId);
  if (bindings.length === 0) {
    return Object.freeze({
      items: Object.freeze([]),
      emptyMessage: "No KPIs linked to this object.",
      bindingCount: 0,
      healthProfileCount: 0,
      visible: true,
    });
  }

  const healthProfiles = getWorkspaceKpiHealthProfiles(workspaceId);
  const healthByKpiId = new Map(healthProfiles.map((profile) => [profile.kpiId, profile]));
  const boundHealthProfiles = bindings
    .map((binding) => healthByKpiId.get(binding.kpiId) ?? null)
    .filter((profile): profile is WorkspaceKpiHealthProfile => profile !== null);

  const items = Object.freeze(
    bindings.map((binding) =>
      buildKpiSummaryItem({
        kpiId: binding.kpiId,
        bindingReason: binding.bindingReason,
        healthProfile: healthByKpiId.get(binding.kpiId) ?? null,
      })
    )
  );

  return Object.freeze({
    items,
    emptyMessage: null,
    bindingCount: bindings.length,
    healthProfileCount: boundHealthProfiles.length,
    visible: true,
  });
}
