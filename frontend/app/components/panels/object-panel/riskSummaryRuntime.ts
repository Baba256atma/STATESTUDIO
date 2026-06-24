import { getRiskObjectBindingsForObject } from "../../../lib/risk/workspaceRiskObjectBinding.ts";
import { getDetectedWorkspaceRisks } from "../../../lib/risk/workspaceRiskDetectionEngine.ts";
import {
  getWorkspaceRiskSeverityProfiles,
  type WorkspaceRiskPriorityLevel,
  type WorkspaceRiskSeverityLevel,
  type WorkspaceRiskSeverityProfile,
} from "../../../lib/risk/workspaceRiskSeverityEngine.ts";

export const WORKSPACE_RISK_PANEL_TAGS = Object.freeze([
  "[DS65_RISK_PANEL]",
  "[RISK_VISIBLE_IN_OBJECT_PANEL]",
  "[OBJECT_PANEL_EXTENDED]",
  "[NO_NEW_PANEL_CREATED]",
  "[DS66_READY]",
  "[DS_6_5_COMPLETE]",
] as const);

export const NEXORA_RISK_PANEL_LOG_PREFIX = "[NexoraRiskPanel]" as const;

export type ObjectRiskSummaryItem = Readonly<{
  riskId: string;
  detectionId: string;
  riskTitle: string;
  severityLevelLabel: string;
  priorityLabel: string;
  severityScoreLabel: string;
  severityAvailable: boolean;
}>;

export type ObjectRiskSummaryState = Readonly<{
  items: readonly ObjectRiskSummaryItem[];
  emptyMessage: string | null;
  bindingCount: number;
  severityProfileCount: number;
  visible: boolean;
}>;

export type ObjectRiskSummaryInput = Readonly<{
  workspaceId?: string | null;
  objectId?: string | null;
}>;

const EMPTY_RISK_SUMMARY: ObjectRiskSummaryState = Object.freeze({
  items: Object.freeze([]),
  emptyMessage: null,
  bindingCount: 0,
  severityProfileCount: 0,
  visible: false,
});

function normalizeId(value: unknown): string {
  return String(value ?? "").trim();
}

function formatSeverityLevelLabel(level: WorkspaceRiskSeverityLevel): string {
  return level.charAt(0).toUpperCase() + level.slice(1);
}

function formatPriorityLabel(priority: WorkspaceRiskPriorityLevel): string {
  return priority.toUpperCase();
}

function formatSeverityScoreLabel(score: number): string {
  if (!Number.isFinite(score)) return "--";
  return String(Math.round(score));
}

function formatRiskIdLabel(riskId: string): string {
  return riskId
    .replace(/^wrisk_detect_/, "")
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function riskTitleFromBindingReason(bindingReason: string): string | null {
  const trimmed = bindingReason.trim();
  const manualMatch = trimmed.match(/^Manually bound (.+?) to object/);
  if (manualMatch?.[1]) return manualMatch[1].trim();

  const suggestMatch = trimmed.match(
    /^(.+?) (?:exactly matches|strongly matches|relates to|has a weak keyword overlap with)/
  );
  if (suggestMatch?.[1]) return suggestMatch[1].trim();

  return null;
}

function resolveRiskTitle(input: {
  riskId: string;
  bindingReason: string;
  detectedTitle: string | null;
}): string {
  if (input.detectedTitle?.trim()) return input.detectedTitle.trim();

  const fromBinding = riskTitleFromBindingReason(input.bindingReason);
  if (fromBinding) return fromBinding;

  return formatRiskIdLabel(input.riskId);
}

function buildRiskSummaryItem(input: {
  riskId: string;
  detectionId: string;
  bindingReason: string;
  detectedTitle: string | null;
  severityProfile: WorkspaceRiskSeverityProfile | null;
}): ObjectRiskSummaryItem {
  const severityAvailable = Boolean(input.severityProfile);
  return Object.freeze({
    riskId: input.riskId,
    detectionId: input.detectionId,
    riskTitle: resolveRiskTitle({
      riskId: input.riskId,
      bindingReason: input.bindingReason,
      detectedTitle: input.detectedTitle,
    }),
    severityLevelLabel: severityAvailable
      ? formatSeverityLevelLabel(input.severityProfile!.severityLevel)
      : "Unavailable",
    priorityLabel: severityAvailable
      ? formatPriorityLabel(input.severityProfile!.priority)
      : "--",
    severityScoreLabel: severityAvailable
      ? formatSeverityScoreLabel(input.severityProfile!.severityScore)
      : "--",
    severityAvailable,
  });
}

export function resolveObjectRiskSummaryState(
  input: ObjectRiskSummaryInput
): ObjectRiskSummaryState {
  const workspaceId = normalizeId(input.workspaceId);
  const objectId = normalizeId(input.objectId);

  if (!workspaceId || !objectId) {
    return EMPTY_RISK_SUMMARY;
  }

  const bindings = getRiskObjectBindingsForObject(workspaceId, objectId);
  if (bindings.length === 0) {
    return Object.freeze({
      items: Object.freeze([]),
      emptyMessage: "No risks linked to this object.",
      bindingCount: 0,
      severityProfileCount: 0,
      visible: true,
    });
  }

  const detectedRisks = getDetectedWorkspaceRisks(workspaceId);
  const detectedByRiskId = new Map(detectedRisks.map((risk) => [risk.riskId, risk]));
  const severityProfiles = getWorkspaceRiskSeverityProfiles(workspaceId);
  const severityByRiskId = new Map(severityProfiles.map((profile) => [profile.riskId, profile]));

  const items = Object.freeze(
    bindings.map((binding) => {
      const detected = detectedByRiskId.get(binding.riskId) ?? null;
      return buildRiskSummaryItem({
        riskId: binding.riskId,
        detectionId: detected?.detectionId ?? "",
        bindingReason: binding.bindingReason,
        detectedTitle: detected?.title ?? null,
        severityProfile: severityByRiskId.get(binding.riskId) ?? null,
      });
    })
  );

  const severityProfileCount = items.filter((item) => item.severityAvailable).length;

  return Object.freeze({
    items,
    emptyMessage: null,
    bindingCount: bindings.length,
    severityProfileCount,
    visible: true,
  });
}
