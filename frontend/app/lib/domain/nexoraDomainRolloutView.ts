import { evaluateAllDomainPacksQA } from "./nexoraDomainPackQA.ts";
import {
  evaluateAllDomainPackRollouts,
  isAmbiguousGenericDomainResolution,
  toSafeLocaleDomainIdForRollout,
} from "./nexoraDomainPackRollout.ts";
import {
  getNexoraLocalePack,
  listNexoraLocaleDomainPacks,
  resolveNexoraLocaleDomainId,
} from "./nexoraDomainPackRegistry.ts";

export type NexoraDomainRolloutViewRow = {
  domainId: string;
  label: string;
  rolloutStatus: "dev_only" | "pilot_ready" | "product_ready";
  qaStatus: "ready" | "partial" | "invalid";
  qaScore: number;
  summary: string;
};

export type NexoraCurrentDomainRuntimeState = {
  requestedDomainId: string | null;
  effectiveDomainId: string;
  fallbackActive: boolean;
};

const B40_LOG_TAG = "[Nexora][B40] domain_rollout_view_ready";

let lastB40Signature: string | null = null;

function rolloutSignature(rows: readonly NexoraDomainRolloutViewRow[], runtime: NexoraCurrentDomainRuntimeState): string {
  const rowPart = rows
    .map((r) => `${r.domainId}:${r.rolloutStatus}:${r.qaStatus}:${r.qaScore}`)
    .join("|");
  return `${rowPart}#${runtime.requestedDomainId ?? ""}:${runtime.effectiveDomainId}:${runtime.fallbackActive ? "1" : "0"}`;
}

export function emitDomainRolloutViewReadyDevOnce(rows: NexoraDomainRolloutViewRow[], runtime: NexoraCurrentDomainRuntimeState): void {
  if (process.env.NODE_ENV === "production") return;
  if (typeof window === "undefined" || typeof console === "undefined" || typeof console.debug !== "function") return;
  const sig = rolloutSignature(rows, runtime);
  if (sig === lastB40Signature) return;
  lastB40Signature = sig;
  console.debug(B40_LOG_TAG, { domainCount: rows.length, runtime });
}

export function buildCurrentDomainRuntimeState(requestedDomainId: string | null | undefined): NexoraCurrentDomainRuntimeState {
  const raw = requestedDomainId == null ? "" : String(requestedDomainId).trim();
  const requestedDomainIdNorm = raw.length === 0 ? null : raw;
  const resolved = resolveNexoraLocaleDomainId(requestedDomainIdNorm);
  const effectiveDomainId = toSafeLocaleDomainIdForRollout(requestedDomainIdNorm);
  const ambiguous =
    requestedDomainIdNorm != null && isAmbiguousGenericDomainResolution(requestedDomainIdNorm, resolved);
  const fallbackActive = effectiveDomainId !== resolved || ambiguous;

  return {
    requestedDomainId: requestedDomainIdNorm,
    effectiveDomainId,
    fallbackActive,
  };
}

function qaSummary(status: NexoraDomainRolloutViewRow["qaStatus"], score: number): string {
  if (status === "ready") return `QA ready (${score}).`;
  if (status === "partial") return `QA partial (${score}); coverage gaps.`;
  return `QA invalid (${score}); blocked for safe use.`;
}

function rolloutSummary(rollout: "dev_only" | "pilot_ready" | "product_ready", qaLine: string): string {
  if (rollout === "product_ready") return `Product rollout: cleared. ${qaLine}`;
  if (rollout === "pilot_ready") return `Pilot rollout: allowed in pilot mode. ${qaLine}`;
  return `Dev-only: not cleared for pilot/product. ${qaLine}`;
}

/**
 * B.40 — operator-facing rows: merges B.37 registry, B.38 QA, and B.39 rollout (no duplicate classifier).
 */
export function buildDomainRolloutViewRows(): NexoraDomainRolloutViewRow[] {
  const packs = listNexoraLocaleDomainPacks();
  const qa = evaluateAllDomainPacksQA();
  const rollout = evaluateAllDomainPackRollouts();

  const qaById = new Map(qa.map((r) => [r.domainId, r] as const));
  const rolloutById = new Map(rollout.map((r) => [r.domainId, r] as const));

  const rows: NexoraDomainRolloutViewRow[] = packs.map((pack) => {
    const qr = qaById.get(pack.id);
    const rr = rolloutById.get(pack.id);
    const qaStatus = qr?.status ?? "invalid";
    const qaScore = qr?.score ?? 0;
    const rolloutStatus = rr?.status ?? "dev_only";
    const qaLine = qaSummary(qaStatus, qaScore);
    return {
      domainId: pack.id,
      label: pack.label,
      rolloutStatus,
      qaStatus,
      qaScore,
      summary: rolloutSummary(rolloutStatus, qaLine),
    };
  });

  rows.sort((a, b) => {
    if (a.domainId === "generic" && b.domainId !== "generic") return -1;
    if (b.domainId === "generic" && a.domainId !== "generic") return 1;
    return a.domainId.localeCompare(b.domainId);
  });

  return rows;
}

export function getEffectiveDomainLabel(effectiveDomainId: string): string {
  return getNexoraLocalePack(effectiveDomainId).label;
}
