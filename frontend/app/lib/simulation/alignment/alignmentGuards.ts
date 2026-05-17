/**
 * D7:3:7 — Ethical organizational alignment drift governance guard rails.
 */

import type { OrganizationalAlignmentSignal } from "./alignmentDriftTypes.ts";
import { logAlignmentDev } from "./alignmentDevLog.ts";

export type AlignmentGuardCode =
  | "empty_alignment_context"
  | "too_many_alignment_signals"
  | "invalid_alignment_intensity"
  | "invalid_alignment_region"
  | "duplicate_alignment_build"
  | "prohibited_behavioral_inference"
  | "invasive_alignment_analysis"
  | "corrupted_alignment_state";

export type AlignmentGuardResult =
  | { ok: true }
  | { ok: false; code: AlignmentGuardCode; message: string };

export const DEFAULT_MAX_ALIGNMENT_SIGNALS = 96;
export const PROHIBITED_ALIGNMENT_TEXT = [
  "personality",
  "emotion",
  "emotional",
  "psychological",
  "psychology",
  "ideology",
  "political",
  "belief",
  "intention",
  "manipulation",
  "surveillance",
  "coercion",
] as const;

function reject(code: AlignmentGuardCode, message: string): AlignmentGuardResult {
  const result = { ok: false as const, code, message };
  logAlignmentDev("AlignmentGuard", { code, message });
  return result;
}

export function buildAlignmentContentFingerprint(input: {
  topologyFingerprint: string;
  coordinationFingerprint?: string;
  frictionFingerprint?: string;
  influenceFingerprint?: string;
  trustFingerprint?: string;
  leadershipFingerprint?: string;
  actorFingerprint?: string;
  tick: number;
}): string {
  return JSON.stringify({
    topology: input.topologyFingerprint,
    coordination: input.coordinationFingerprint ?? null,
    friction: input.frictionFingerprint ?? null,
    influence: input.influenceFingerprint ?? null,
    trust: input.trustFingerprint ?? null,
    leadership: input.leadershipFingerprint ?? null,
    actors: input.actorFingerprint ?? null,
    tick: input.tick,
  });
}

export function containsProhibitedAlignmentText(text: string): boolean {
  const lower = text.toLowerCase();
  return PROHIBITED_ALIGNMENT_TEXT.some((term) => lower.includes(term));
}

export function guardEvaluateOrganizationalAlignment(input: {
  topologyId: string;
  regionIds: readonly string[];
  signals: readonly OrganizationalAlignmentSignal[];
  priorAlignmentFingerprints?: readonly string[];
  pendingFingerprint?: string;
}): AlignmentGuardResult {
  if (!input.topologyId) {
    return reject(
      "empty_alignment_context",
      "Topology context is required to evaluate organizational alignment"
    );
  }

  const regionSet = new Set(input.regionIds);

  if (input.signals.length > DEFAULT_MAX_ALIGNMENT_SIGNALS) {
    return reject(
      "too_many_alignment_signals",
      `Alignment signal count ${input.signals.length} exceeds max ${DEFAULT_MAX_ALIGNMENT_SIGNALS}`
    );
  }

  for (const signal of input.signals) {
    if (signal.intensity < 0 || signal.intensity > 1) {
      return reject(
        "invalid_alignment_intensity",
        `Alignment signal ${signal.signalId} intensity must be between 0 and 1`
      );
    }
    for (const regionId of signal.affectedRegionIds) {
      if (!regionSet.has(regionId)) {
        return reject(
          "invalid_alignment_region",
          `Alignment signal ${signal.signalId} references unknown region ${regionId}`
        );
      }
    }
    const label = String(signal.executiveLabel ?? "");
    if (containsProhibitedAlignmentText(label)) {
      return reject(
        "invasive_alignment_analysis",
        `Alignment signal ${signal.signalId} contains prohibited behavioral inference text`
      );
    }
    for (const driver of signal.dominantAlignmentDrivers ?? []) {
      if (containsProhibitedAlignmentText(driver)) {
        return reject(
          "prohibited_behavioral_inference",
          `Alignment signal ${signal.signalId} contains prohibited driver text`
        );
      }
    }
  }

  const pending = String(input.pendingFingerprint ?? "").trim();
  if (pending && (input.priorAlignmentFingerprints ?? []).includes(pending)) {
    return reject(
      "duplicate_alignment_build",
      "Identical organizational alignment evaluation was already executed"
    );
  }

  return { ok: true };
}
