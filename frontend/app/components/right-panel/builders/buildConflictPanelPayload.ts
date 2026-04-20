type BuildConflictPanelPayloadArgs = {
  currentView: string | null | undefined;
  resolvedPanelData: unknown;
  canonicalConflict: unknown;
  responseConflict: unknown;
  responseConflicts: unknown;
  legacyConflicts: unknown;
};
import { resolveConflictPayloadPolicy } from "../panelPayloadPolicy";

type ConflictPayload =
  | {
      a?: string;
      b?: string;
      score?: number;
      reason?: string;
    }[]
  | Record<string, unknown>
  | null;

function asConflictPayload(value: unknown): ConflictPayload {
  if (Array.isArray(value)) {
    return value as ConflictPayload;
  }
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

export function buildConflictPanelPayload(args: BuildConflictPanelPayloadArgs): {
  payload: ConflictPayload;
  sourceFlags: {
    usedResolved: boolean;
    usedCanonical: boolean;
    usedResponseConflict: boolean;
    usedResponseConflicts: boolean;
    usedLegacy: boolean;
  };
} {
  const resolved = resolveConflictPayloadPolicy<unknown>({
    resolved: args.currentView === "conflict" ? args.resolvedPanelData : null,
    canonical: args.canonicalConflict ?? null,
    responseConflict: args.responseConflict ?? null,
    responseConflicts: args.responseConflicts ?? null,
    legacy: args.legacyConflicts ?? null,
  });

  return {
    payload: asConflictPayload(resolved.payload),
    sourceFlags: {
      usedResolved: resolved.sourceFlags.usedResolved,
      usedCanonical: resolved.sourceFlags.usedCanonical,
      usedResponseConflict: Boolean(resolved.sourceFlags.usedResponseConflict),
      usedResponseConflicts: Boolean(resolved.sourceFlags.usedResponseConflicts),
      usedLegacy: Boolean(resolved.sourceFlags.usedLegacy),
    },
  };
}
