"use client";

import { resolveSceneObjectById } from "./resolveSceneObjectById";

type CachedObjectProfile = {
  label?: string;
  summary?: string;
  tags?: string[];
  one_liner?: string;
};

type ObjectUx = {
  shape?: string;
  base_color?: string;
  opacity?: number;
  scale?: number;
};

export type ResolvedObjectDetails = {
  id: string;
  title: string;
  label: string;
  type?: string;
  tags?: string[];
  color?: unknown;
  scale?: number;
  override?: unknown;
  base_color?: string;
  shape?: string;
  opacity?: number;
  summary?: string;
  one_liner?: string;
  scanner_reason?: string;
  scanner_severity?: string;
  scanner_focus?: boolean;
  emphasis?: number | null;
  metadata?: Record<string, unknown> | null;
  raw?: unknown;
  reasoning?: string | null;
  currentRole?: string | null;
  currentStatusSummary?: string | null;
  relatedSignals?: string[];
  suggestedActions?: string[];
  resolved: boolean;
};

type ComposeResolvedObjectDetailsInput = {
  objectId: string;
  scene: Parameters<typeof resolveSceneObjectById>[0];
  cachedProfile?: CachedObjectProfile | null;
  ux?: ObjectUx | null;
  override?: unknown;
  fallbackLabel?: string | null;
};

function readText(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function readTags(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const tags = value.map((entry) => (typeof entry === "string" ? entry.trim() : "")).filter(Boolean);
  return tags.length ? tags : undefined;
}

export function composeResolvedObjectDetails(input: ComposeResolvedObjectDetailsInput): ResolvedObjectDetails {
  const resolved = resolveSceneObjectById(input.scene, input.objectId);
  const raw = (resolved?.raw ?? null) as Record<string, unknown> | null;
  const ux = input.ux ?? null;

  const scannerReason = readText(raw?.scanner_reason);
  const businessMeaning =
    readText((raw?.semantic as Record<string, unknown> | null)?.business_meaning) ?? readText(raw?.business_meaning);
  const scannerOverlaySummary = readText(raw?.scanner_overlay_summary);
  const cachedSummary = readText(input.cachedProfile?.summary);
  const cachedOneLiner = readText(input.cachedProfile?.one_liner);
  const currentRole = readText((raw?.semantic as Record<string, unknown> | null)?.role) ?? readText(raw?.role);
  const label = resolved?.label ?? input.fallbackLabel ?? input.cachedProfile?.label ?? input.objectId;
  const tags = readTags(raw?.tags) ?? readTags(input.cachedProfile?.tags) ?? [];

  if (!resolved) {
    return {
      id: input.objectId,
      title: label,
      label,
      tags,
      scale: ux?.scale,
      override: input.override,
      base_color: ux?.base_color,
      shape: ux?.shape,
      opacity: ux?.opacity,
      summary: "Object not available in current scene.",
      currentStatusSummary: "Object not available in current scene.",
      relatedSignals: [],
      suggestedActions: [],
      resolved: false,
    };
  }

  const summary = scannerReason ? `Fragility scanner: ${scannerReason}` : scannerOverlaySummary ?? businessMeaning ?? cachedSummary;
  const oneLiner = scannerReason ? businessMeaning ?? scannerOverlaySummary ?? cachedOneLiner : cachedOneLiner;

  return {
    id: input.objectId,
    title: label,
    label,
    type: resolved.type ?? undefined,
    tags,
    color: raw?.color,
    scale: typeof ux?.scale === "number" ? ux.scale : typeof raw?.scale === "number" ? raw.scale : undefined,
    override: input.override,
    base_color: ux?.base_color,
    shape: ux?.shape,
    opacity: typeof ux?.opacity === "number" ? ux.opacity : undefined,
    summary,
    one_liner: oneLiner,
    scanner_reason: scannerReason,
    scanner_severity: readText(raw?.scanner_severity),
    scanner_focus: raw?.scanner_focus === true,
    emphasis: resolved.emphasis ?? null,
    metadata: resolved.metadata ?? null,
    raw: resolved.raw,
    reasoning: scannerReason ?? businessMeaning ?? null,
    currentRole,
    currentStatusSummary: summary ?? oneLiner ?? "Object available in current scene.",
    relatedSignals: [],
    suggestedActions: [],
    resolved: true,
  };
}
