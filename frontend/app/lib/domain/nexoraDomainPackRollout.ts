/**
 * B.39 — Domain pack rollout gate (dev_only / pilot_ready / product_ready).
 * Sits on top of B.38 QA; does not import back into `nexoraDomainPackQA.ts` (avoid cycles).
 */

import { getB13TrustEvidenceBias } from "./domainVocabularyRegistry.ts";
import type { NexoraLocaleDomainId, NexoraLocaleDomainPack } from "./nexoraDomainPack.ts";
import {
  evaluateDomainPackCoverage,
  toSafeLocaleDomainIdForPack,
  type NexoraDomainPackQAReport,
} from "./nexoraDomainPackQA.ts";
import {
  getNexoraLocalePack,
  listNexoraLocaleDomainPacks,
  resolveNexoraLocaleDomainId,
  validateLocalePackRegistry,
} from "./nexoraDomainPackRegistry.ts";
import { getNexoraProductMode } from "../product/nexoraProductMode.ts";

export type NexoraDomainPackRolloutStatus = "dev_only" | "pilot_ready" | "product_ready";

export type NexoraDomainPackRolloutReport = {
  domainId: string;
  status: NexoraDomainPackRolloutStatus;
  summary: string;
  reasons: string[];
};

function normalizeAliasKey(s: string): string {
  return String(s).trim().toLowerCase().replace(/[\s-]+/g, "_");
}

/** Unrecognized workspace id that collapses to generic → treat as dev-only (no curated pack). */
export function isAmbiguousGenericDomainResolution(rawInput: string, resolved: NexoraLocaleDomainId): boolean {
  const raw = String(rawInput).trim();
  if (!raw) return false;
  if (resolved !== "generic") return false;
  const n = normalizeAliasKey(raw);
  const explicitGeneric = new Set(["generic", "default", "business", "devops", "strategy", "general", ""]);
  return !explicitGeneric.has(n);
}

function classifyRollout(
  pack: NexoraLocaleDomainPack,
  qa: NexoraDomainPackQAReport,
  opts?: { unknownAmbiguous?: boolean },
): NexoraDomainPackRolloutReport {
  const reasons: string[] = [];
  const ro = pack.rollout;

  if (opts?.unknownAmbiguous) {
    reasons.push("Unknown domain resolved to generic; rollout stays dev-only.");
    return {
      domainId: pack.id,
      status: "dev_only",
      summary: "Unknown domain — dev-only rollout.",
      reasons,
    };
  }

  if (ro?.allowPilot === false) {
    reasons.push("Pack explicitly disables pilot exposure.");
    return { domainId: pack.id, status: "dev_only", summary: "Pilot disabled for this pack.", reasons };
  }

  if (qa.status === "invalid") {
    reasons.push("Pack failed QA validation.");
    return { domainId: pack.id, status: "dev_only", summary: "Pack failed QA validation.", reasons };
  }

  if (qa.status === "partial") {
    reasons.push("QA status is partial — not cleared for pilot.");
    return {
      domainId: pack.id,
      status: "dev_only",
      summary: "Pack falls back to dev-only due to incomplete coverage.",
      reasons,
    };
  }

  if (qa.score < 0.75) {
    reasons.push(`QA score ${qa.score} is below pilot threshold (0.75).`);
    return {
      domainId: pack.id,
      status: "dev_only",
      summary: "QA score too low for pilot rollout.",
      reasons,
    };
  }

  const productEligible =
    qa.status === "ready" && qa.score >= 0.9 && ro?.allowProduct === true;

  if (productEligible) {
    reasons.push("QA ready with high score and explicit product approval.");
    return {
      domainId: pack.id,
      status: "product_ready",
      summary: "Pack is approved for product rollout.",
      reasons,
    };
  }

  const pilotEligible = qa.status === "ready" && qa.score >= 0.75 && ro?.allowPilot !== false;

  if (pilotEligible) {
    if (!ro?.allowProduct) {
      reasons.push("Pack lacks product rollout approval.");
    } else {
      reasons.push("Pack is structurally ready for pilot; product needs higher score or explicit flag.");
    }
    return {
      domainId: pack.id,
      status: "pilot_ready",
      summary: "Pack is structurally ready for pilot.",
      reasons,
    };
  }

  reasons.push("Pack did not meet pilot readiness rules.");
  return {
    domainId: pack.id,
    status: "dev_only",
    summary: "Pack falls back to dev-only.",
    reasons,
  };
}

/**
 * Evaluate rollout for a resolved locale pack + QA snapshot (for tests / tooling).
 */
export function evaluateDomainPackRolloutFromPack(
  pack: NexoraLocaleDomainPack,
  qa: NexoraDomainPackQAReport,
  opts?: { unknownAmbiguous?: boolean },
): NexoraDomainPackRolloutReport {
  return classifyRollout(pack, qa, opts);
}

export function evaluateDomainPackRollout(domainId: string): NexoraDomainPackRolloutReport {
  const resolved = resolveNexoraLocaleDomainId(domainId);
  const pack = getNexoraLocalePack(resolved);
  const reg = validateLocalePackRegistry();
  const qa = evaluateDomainPackCoverage(pack, { registryIssues: reg });
  const unknown = isAmbiguousGenericDomainResolution(domainId, resolved);
  return classifyRollout(pack, qa, { unknownAmbiguous: unknown });
}

export function evaluateAllDomainPackRollouts(): NexoraDomainPackRolloutReport[] {
  const reg = validateLocalePackRegistry();
  return listNexoraLocaleDomainPacks().map((pack) => {
    const qa = evaluateDomainPackCoverage(pack, { registryIssues: reg });
    return classifyRollout(pack, qa);
  });
}

export function isDomainPackAllowedForPilot(domainId: string): boolean {
  const r = evaluateDomainPackRollout(domainId);
  return r.status === "pilot_ready" || r.status === "product_ready";
}

export function isDomainPackAllowedForProduct(domainId: string): boolean {
  return evaluateDomainPackRollout(domainId).status === "product_ready";
}

/**
 * B.38 QA safety + B.39 pilot gate: in pilot mode, domains not cleared for pilot map to generic.
 */
export function toSafeLocaleDomainIdForRollout(domainId?: string | null): NexoraLocaleDomainId {
  const qaId = toSafeLocaleDomainIdForPack(domainId);
  if (getNexoraProductMode() !== "pilot") return qaId;
  if (qaId === "generic") return "generic";
  if (!isDomainPackAllowedForPilot(qaId)) return "generic";
  return qaId;
}

/** B.13 trust delta with pack `trustBias`, using rollout-safe locale id in pilot mode. */
export function getB13TrustEvidenceBiasMerged(
  domainId?: string | null,
  mergedSignalCount: number,
  successfulSources: number,
): number {
  let delta = getB13TrustEvidenceBias(domainId, mergedSignalCount, successfulSources);
  const safeId = toSafeLocaleDomainIdForRollout(domainId);
  const b = getNexoraLocalePack(safeId).trustBias;
  if (typeof b === "number") delta += b;
  return Math.max(-0.1, Math.min(0.1, delta));
}

let lastB39LogKey = "";

function emitDomainPackRolloutEvaluatedDevOnce(payload: { count: number; signature: string }): void {
  if (process.env.NODE_ENV === "production") return;
  if (payload.signature === lastB39LogKey) return;
  lastB39LogKey = payload.signature;
  globalThis.console?.debug?.("[Nexora][B39] domain_pack_rollout_evaluated", payload);
}

export function runDomainPackRolloutAndLogDev(): NexoraDomainPackRolloutReport[] {
  const reports = evaluateAllDomainPackRollouts();
  const signature = reports.map((r) => `${r.domainId}:${r.status}`).join("|");
  emitDomainPackRolloutEvaluatedDevOnce({ count: reports.length, signature });
  return reports;
}
