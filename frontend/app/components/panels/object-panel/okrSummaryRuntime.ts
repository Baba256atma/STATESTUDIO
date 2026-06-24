import { getKpiObjectBindingsForObject } from "../../../lib/kpi/workspaceKpiObjectBinding.ts";
import { getOkrKpiBindingsForKpi } from "../../../lib/okr/workspaceOkrKpiBinding.ts";
import { getWorkspaceObjective } from "../../../lib/okr/workspaceOkrContract.ts";
import {
  getWorkspaceOkrHealthProfile,
  type WorkspaceOkrHealthProfile,
  type WorkspaceOkrHealthStatus,
} from "../../../lib/okr/workspaceOkrHealthEngine.ts";
import {
  getWorkspaceOkrProgressProfile,
  type WorkspaceOkrProgressProfile,
} from "../../../lib/okr/workspaceOkrProgressEngine.ts";

export const WORKSPACE_OKR_PANEL_TAGS = Object.freeze([
  "[DS55_OKR_PANEL]",
  "[OKR_VISIBLE_IN_OBJECT_PANEL]",
  "[OBJECT_PANEL_EXTENDED]",
  "[NO_NEW_PANEL_CREATED]",
  "[DS56_READY]",
  "[DS_5_5_COMPLETE]",
] as const);

export const NEXORA_OKR_PANEL_LOG_PREFIX = "[NexoraOkrPanel]" as const;

export type ObjectOkrSummaryItem = Readonly<{
  objectiveId: string;
  objectiveTitle: string;
  healthStatusLabel: string;
  progressLabel: string;
  healthAvailable: boolean;
  progressAvailable: boolean;
}>;

export type ObjectOkrSummaryState = Readonly<{
  items: readonly ObjectOkrSummaryItem[];
  emptyMessage: string | null;
  objectiveCount: number;
  healthProfileCount: number;
  visible: boolean;
}>;

export type ObjectOkrSummaryInput = Readonly<{
  workspaceId?: string | null;
  objectId?: string | null;
}>;

const EMPTY_OKR_SUMMARY: ObjectOkrSummaryState = Object.freeze({
  items: Object.freeze([]),
  emptyMessage: null,
  objectiveCount: 0,
  healthProfileCount: 0,
  visible: false,
});

function normalizeId(value: unknown): string {
  return String(value ?? "").trim();
}

function formatHealthStatusLabel(status: WorkspaceOkrHealthStatus): string {
  if (status === "unknown") return "Unknown";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatProgressLabel(progressPercent: number): string {
  if (!Number.isFinite(progressPercent)) return "--";
  return `${Math.round(progressPercent)}%`;
}

function formatObjectiveIdLabel(objectiveId: string): string {
  return objectiveId
    .replace(/^wobj_/, "")
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function objectiveTitleFromHealthReason(healthReason: string): string | null {
  const trimmed = healthReason.trim();
  const patterns = [
    /^(.+?) objective exceeded expected progress/,
    /^(.+?) objective reached \d+/,
    /^(.+?) objective requires attention/,
  ];
  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match?.[1]) return match[1].trim();
  }
  return null;
}

function objectiveTitleFromProgressReason(progressReason: string): string | null {
  const trimmed = progressReason.trim();
  const patterns = [
    /^(.+?) objective reached \d+/,
    /^(.+?) objective exceeded target/,
    /^(.+?) objective is below expected progress/,
    /^(.+?) objective has no key results yet/,
  ];
  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match?.[1]) return match[1].trim();
  }
  return null;
}

function objectiveTitleFromBindingReason(bindingReason: string): string | null {
  const trimmed = bindingReason.trim();
  const manualMatch = trimmed.match(/^Manually bound objective "(.+?)" to KPI/);
  if (manualMatch?.[1]) return manualMatch[1].trim();

  const relateMatch = trimmed.match(
    /(?:relates to|strongly matches) (.+?) (?:through|via)/
  );
  if (relateMatch?.[1]) return relateMatch[1].trim();

  return null;
}

function resolveObjectiveTitle(input: {
  workspaceId: string;
  objectiveId: string;
  bindingReasons: readonly string[];
  healthProfile: WorkspaceOkrHealthProfile | null;
  progressProfile: WorkspaceOkrProgressProfile | null;
}): string {
  const objective = getWorkspaceObjective(input.workspaceId, input.objectiveId);
  if (objective?.title.trim()) return objective.title.trim();

  if (input.healthProfile) {
    const fromHealth = objectiveTitleFromHealthReason(input.healthProfile.healthReason);
    if (fromHealth) return fromHealth;
  }

  if (input.progressProfile) {
    const fromProgress = objectiveTitleFromProgressReason(input.progressProfile.reason);
    if (fromProgress) return fromProgress;
  }

  for (const bindingReason of input.bindingReasons) {
    const fromBinding = objectiveTitleFromBindingReason(bindingReason);
    if (fromBinding) return fromBinding;
  }

  return formatObjectiveIdLabel(input.objectiveId);
}

function buildOkrSummaryItem(input: {
  workspaceId: string;
  objectiveId: string;
  bindingReasons: readonly string[];
  healthProfile: WorkspaceOkrHealthProfile | null;
  progressProfile: WorkspaceOkrProgressProfile | null;
}): ObjectOkrSummaryItem {
  const healthAvailable = Boolean(input.healthProfile);
  const progressAvailable = Boolean(input.progressProfile);

  return Object.freeze({
    objectiveId: input.objectiveId,
    objectiveTitle: resolveObjectiveTitle(input),
    healthStatusLabel: healthAvailable
      ? formatHealthStatusLabel(input.healthProfile!.healthStatus)
      : "Unavailable",
    progressLabel: progressAvailable
      ? formatProgressLabel(input.progressProfile!.progressPercent)
      : "--",
    healthAvailable,
    progressAvailable,
  });
}

export function resolveObjectOkrSummaryState(
  input: ObjectOkrSummaryInput
): ObjectOkrSummaryState {
  const workspaceId = normalizeId(input.workspaceId);
  const objectId = normalizeId(input.objectId);

  if (!workspaceId || !objectId) {
    return EMPTY_OKR_SUMMARY;
  }

  const kpiBindings = getKpiObjectBindingsForObject(workspaceId, objectId);
  const objectiveBindingReasons = new Map<string, string[]>();
  const objectiveOrder: string[] = [];

  for (const kpiBinding of kpiBindings) {
    const okrBindings = getOkrKpiBindingsForKpi(workspaceId, kpiBinding.kpiId);
    for (const okrBinding of okrBindings) {
      const reasons = objectiveBindingReasons.get(okrBinding.objectiveId) ?? [];
      reasons.push(okrBinding.bindingReason);
      objectiveBindingReasons.set(okrBinding.objectiveId, reasons);
      if (!objectiveOrder.includes(okrBinding.objectiveId)) {
        objectiveOrder.push(okrBinding.objectiveId);
      }
    }
  }

  if (objectiveOrder.length === 0) {
    return Object.freeze({
      items: Object.freeze([]),
      emptyMessage: "No OKRs linked to this object.",
      objectiveCount: 0,
      healthProfileCount: 0,
      visible: true,
    });
  }

  const items = Object.freeze(
    objectiveOrder.map((objectiveId) => {
      const healthProfile = getWorkspaceOkrHealthProfile(workspaceId, objectiveId);
      const progressProfile = getWorkspaceOkrProgressProfile(workspaceId, objectiveId);
      return buildOkrSummaryItem({
        workspaceId,
        objectiveId,
        bindingReasons: objectiveBindingReasons.get(objectiveId) ?? [],
        healthProfile,
        progressProfile,
      });
    })
  );

  const healthProfileCount = items.filter((item) => item.healthAvailable).length;

  return Object.freeze({
    items,
    emptyMessage: null,
    objectiveCount: items.length,
    healthProfileCount,
    visible: true,
  });
}
