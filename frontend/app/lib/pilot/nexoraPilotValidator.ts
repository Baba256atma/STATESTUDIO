/**
 * B.25 — Deterministic pilot validation (signals, fragility tier, optional driver keywords).
 */

import type { NexoraPilotScenario } from "./nexoraPilotScenarios";

export type NexoraPilotFragilityTier = "low" | "medium" | "high" | "critical" | null;

/** Mirrors `normalizeFragilityLevelForUi` (B.3) so this module stays testable under plain `node --test`. */
export function normalizePilotFragilityLevel(raw: string | null | undefined): NexoraPilotFragilityTier {
  const L = String(raw ?? "").trim().toLowerCase();
  if (!L) return null;
  if (L === "critical") return "critical";
  if (L === "high") return "high";
  if (L === "medium" || L === "moderate") return "medium";
  if (L === "low") return "low";
  return null;
}

export type NexoraPilotPipelineSnapshot = {
  signalsCount: number;
  fragilityLevel: NexoraPilotFragilityTier;
  driverLabels: string[];
};

export type NexoraPilotResult = {
  scenarioId: string;
  passed: boolean;
  checks: {
    signalsOk: boolean;
    fragilityOk: boolean;
    driversOk?: boolean;
  };
};

/** Normalize HomeScreen pipeline objects, raw scan summaries, or explicit snapshots. */
export function normalizePilotPipelineSnapshot(raw: unknown): NexoraPilotPipelineSnapshot {
  if (raw && typeof raw === "object" && "signalsCount" in (raw as object) && "driverLabels" in (raw as object)) {
    const o = raw as NexoraPilotPipelineSnapshot;
    return {
      signalsCount: Math.max(0, Math.floor(Number(o.signalsCount) || 0)),
      fragilityLevel: o.fragilityLevel ?? null,
      driverLabels: Array.isArray(o.driverLabels) ? o.driverLabels.map(String) : [],
    };
  }

  const r = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const sc =
    typeof r.signalsCount === "number"
      ? r.signalsCount
      : typeof r.signal_count === "number"
        ? r.signal_count
        : Number(r.signalsCount ?? r.signal_count ?? 0) || 0;

  const rawFrag =
    (typeof r.fragilityLevel === "string" ? r.fragilityLevel : null) ??
    (typeof r.fragility_level === "string" ? r.fragility_level : null);
  const fragilityLevel = normalizePilotFragilityLevel(rawFrag);

  const driversRaw = r.drivers ?? r.fragilityDrivers;
  const driverLabels: string[] = [];
  if (Array.isArray(driversRaw)) {
    for (const d of driversRaw) {
      if (typeof d === "string" && d.trim()) driverLabels.push(d.trim());
      else if (d && typeof d === "object" && "label" in d) {
        const L = (d as { label?: unknown }).label;
        if (typeof L === "string" && L.trim()) driverLabels.push(L.trim());
      }
    }
  }

  return {
    signalsCount: Math.max(0, Math.floor(sc)),
    fragilityLevel,
    driverLabels,
  };
}

function driverKeywordsSatisfied(driverLabels: readonly string[], keywords: readonly string[]): boolean {
  const blob = driverLabels.join(" ").toLowerCase();
  return keywords.every((kw) => blob.includes(String(kw).trim().toLowerCase()));
}

export function validatePilotScenario(scenario: NexoraPilotScenario, pipelineResult: unknown): NexoraPilotResult {
  const snap = normalizePilotPipelineSnapshot(pipelineResult);
  const signalsOk = snap.signalsCount >= scenario.expected.minSignals;
  const fragilityOk =
    snap.fragilityLevel != null && scenario.expected.expectedFragility.includes(snap.fragilityLevel);

  const needDrivers = (scenario.expected.mustHaveDrivers?.length ?? 0) > 0;
  const driversOk = needDrivers
    ? driverKeywordsSatisfied(snap.driverLabels, scenario.expected.mustHaveDrivers!)
    : undefined;

  const passed = signalsOk && fragilityOk && (driversOk === undefined || driversOk === true);

  const checks: NexoraPilotResult["checks"] = {
    signalsOk,
    fragilityOk,
    ...(needDrivers ? { driversOk } : {}),
  };

  return { scenarioId: scenario.id, passed, checks };
}
