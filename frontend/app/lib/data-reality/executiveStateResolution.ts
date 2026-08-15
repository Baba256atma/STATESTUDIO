/**
 * P0:4 — Executive State Resolution.
 *
 * KPI Results → business executive meaning (normal | attention | critical).
 *
 * No Runtime/REX/DRI mapping. No Stage/Three.js/React. No Advisor prose.
 */

import type {
  NexoraExecutiveState,
  NexoraExecutiveStateReason,
  NexoraExecutiveStateRule,
  NexoraKPIResult,
  NexoraKPIThresholdBand,
  NexoraObjectExecutiveState,
} from "./dataRealityContracts.ts";
import { NEXORA_EXECUTIVE_STATES } from "./dataRealityContracts.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveStateResolutionIdentity =
  "P0:4/NexoraExecutiveStateResolution" as const;

export const executiveStateResolutionVersion = "1.0.0" as const;

export const executiveStateResolutionNamespace =
  "nexora.data-reality.executive-state-resolution" as const;

export const executiveStateResolutionPhase =
  "ExecutiveStateResolution" as const;

export const executiveStateResolutionArchitecturalRole =
  "DeterministicKPIToBusinessExecutiveMeaning" as const;

export const EXECUTIVE_STATE_RESOLUTION_BOUNDARY = Object.freeze({
  architecturalRole: executiveStateResolutionArchitecturalRole,
  ownsRuntimeMapping: false as const,
  ownsRexAttentionMapping: false as const,
  ownsDriAttentionMapping: false as const,
  ownsNolStatusProjection: false as const,
  ownsStageMutation: false as const,
  ownsThreeJs: false as const,
  ownsReactState: false as const,
  ownsAdvisorNarrative: false as const,
  fabricatesStateWithoutKpi: false as const,
});

export type NexoraExecutiveStateResolutionIdentity = {
  readonly id: typeof executiveStateResolutionIdentity;
  readonly version: typeof executiveStateResolutionVersion;
  readonly namespace: typeof executiveStateResolutionNamespace;
  readonly phase: typeof executiveStateResolutionPhase;
  readonly architecturalRole: typeof executiveStateResolutionArchitecturalRole;
};

const IDENTITY: NexoraExecutiveStateResolutionIdentity = Object.freeze({
  id: executiveStateResolutionIdentity,
  version: executiveStateResolutionVersion,
  namespace: executiveStateResolutionNamespace,
  phase: executiveStateResolutionPhase,
  architecturalRole: executiveStateResolutionArchitecturalRole,
});

export function getExecutiveStateResolutionIdentity(): NexoraExecutiveStateResolutionIdentity {
  return IDENTITY;
}

// ─── Severity / issues / results ────────────────────────────────────────────

export const NEXORA_EXECUTIVE_STATE_SEVERITY = Object.freeze({
  normal: 1,
  attention: 2,
  critical: 3,
} as const satisfies Record<NexoraExecutiveState, number>);

export const NEXORA_EXECUTIVE_STATE_ISSUE_CODES = Object.freeze([
  "UNKNOWN_STATE_RULE",
  "INVALID_STATE_RULE",
  "KPI_RULE_MISMATCH",
  "NON_FINITE_KPI_VALUE",
  "UNRESOLVED_OBJECT_STATE",
  "AMBIGUOUS_STATE_RULE",
] as const);

export type NexoraExecutiveStateIssueCode =
  (typeof NEXORA_EXECUTIVE_STATE_ISSUE_CODES)[number];

export type NexoraExecutiveStateIssue = {
  readonly code: NexoraExecutiveStateIssueCode;
  readonly message: string;
  readonly kpiId?: string;
  readonly objectKey?: string;
  readonly ruleId?: string;
};

export type NexoraExecutiveStateResolutionResult = {
  readonly status: "resolved" | "partial" | "invalid";
  readonly objectStates: readonly NexoraObjectExecutiveState[];
  readonly issues: readonly NexoraExecutiveStateIssue[];
};

function stateIssue(
  code: NexoraExecutiveStateIssueCode,
  message: string,
  extras?: Omit<NexoraExecutiveStateIssue, "code" | "message">,
): NexoraExecutiveStateIssue {
  return Object.freeze({ code, message, ...extras });
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function matchesExecutiveStateBand(
  value: number,
  band: NexoraKPIThresholdBand,
): boolean {
  if (band.minInclusive !== undefined && value < band.minInclusive) {
    return false;
  }
  if (band.maxExclusive !== undefined && value >= band.maxExclusive) {
    return false;
  }
  return true;
}

function validateRule(
  rule: NexoraExecutiveStateRule,
): NexoraExecutiveStateIssue | null {
  if (!isNonEmptyString(rule.id)) {
    return stateIssue("INVALID_STATE_RULE", "State rule is missing id.");
  }
  if (!isNonEmptyString(rule.kpiId) || !isNonEmptyString(rule.objectKey)) {
    return stateIssue(
      "INVALID_STATE_RULE",
      `State rule "${rule.id}" is missing kpiId or objectKey.`,
      { ruleId: rule.id },
    );
  }
  if (rule.worseWhen !== "higher" && rule.worseWhen !== "lower") {
    return stateIssue(
      "INVALID_STATE_RULE",
      `State rule "${rule.id}" has invalid worseWhen.`,
      { ruleId: rule.id, kpiId: rule.kpiId, objectKey: rule.objectKey },
    );
  }
  if (!Array.isArray(rule.bands) || rule.bands.length === 0) {
    return stateIssue(
      "INVALID_STATE_RULE",
      `State rule "${rule.id}" has no threshold bands.`,
      { ruleId: rule.id, kpiId: rule.kpiId, objectKey: rule.objectKey },
    );
  }
  const states = new Set<string>();
  for (const band of rule.bands) {
    if (!(NEXORA_EXECUTIVE_STATES as readonly string[]).includes(band.state)) {
      return stateIssue(
        "INVALID_STATE_RULE",
        `State rule "${rule.id}" has invalid band state.`,
        { ruleId: rule.id, kpiId: rule.kpiId, objectKey: rule.objectKey },
      );
    }
    states.add(band.state);
  }
  for (const required of NEXORA_EXECUTIVE_STATES) {
    if (!states.has(required)) {
      return stateIssue(
        "INVALID_STATE_RULE",
        `State rule "${rule.id}" is missing a "${required}" band.`,
        { ruleId: rule.id, kpiId: rule.kpiId, objectKey: rule.objectKey },
      );
    }
  }
  return null;
}

function resolveBandState(
  value: number,
  rule: NexoraExecutiveStateRule,
):
  | { readonly ok: true; readonly state: NexoraExecutiveState }
  | { readonly ok: false; readonly issue: NexoraExecutiveStateIssue } {
  const matches = rule.bands.filter((band) =>
    matchesExecutiveStateBand(value, band),
  );
  if (matches.length === 0) {
    return {
      ok: false,
      issue: stateIssue(
        "INVALID_STATE_RULE",
        `State rule "${rule.id}" does not cover value ${value}.`,
        {
          ruleId: rule.id,
          kpiId: rule.kpiId,
          objectKey: rule.objectKey,
        },
      ),
    };
  }
  if (matches.length > 1) {
    return {
      ok: false,
      issue: stateIssue(
        "AMBIGUOUS_STATE_RULE",
        `State rule "${rule.id}" matched multiple bands for value ${value}.`,
        {
          ruleId: rule.id,
          kpiId: rule.kpiId,
          objectKey: rule.objectKey,
        },
      ),
    };
  }
  return { ok: true, state: matches[0]!.state };
}

export type NexoraKPIExecutiveStateResolution = {
  readonly status: "resolved" | "invalid";
  readonly reason: NexoraExecutiveStateReason | null;
  readonly issues: readonly NexoraExecutiveStateIssue[];
};

/**
 * Resolve one KPI result against the matching state rule.
 * Rule must match both kpiId and objectKey exactly.
 */
export function resolveKPIExecutiveState(
  kpiResult: NexoraKPIResult,
  rules: readonly NexoraExecutiveStateRule[],
): NexoraKPIExecutiveStateResolution {
  if (typeof kpiResult.value !== "number" || !Number.isFinite(kpiResult.value)) {
    return Object.freeze({
      status: "invalid" as const,
      reason: null,
      issues: Object.freeze([
        stateIssue(
          "NON_FINITE_KPI_VALUE",
          `KPI "${kpiResult.kpiId}" has a non-finite value.`,
          {
            kpiId: kpiResult.kpiId,
            objectKey: kpiResult.objectKey,
          },
        ),
      ]),
    });
  }

  const candidates = rules.filter((rule) => rule.kpiId === kpiResult.kpiId);
  if (candidates.length === 0) {
    return Object.freeze({
      status: "invalid" as const,
      reason: null,
      issues: Object.freeze([
        stateIssue(
          "UNKNOWN_STATE_RULE",
          `No executive state rule configured for KPI "${kpiResult.kpiId}".`,
          {
            kpiId: kpiResult.kpiId,
            objectKey: kpiResult.objectKey,
          },
        ),
      ]),
    });
  }
  if (candidates.length > 1) {
    return Object.freeze({
      status: "invalid" as const,
      reason: null,
      issues: Object.freeze([
        stateIssue(
          "AMBIGUOUS_STATE_RULE",
          `Multiple executive state rules configured for KPI "${kpiResult.kpiId}".`,
          {
            kpiId: kpiResult.kpiId,
            objectKey: kpiResult.objectKey,
          },
        ),
      ]),
    });
  }

  const rule = candidates[0]!;
  const ruleIssue = validateRule(rule);
  if (ruleIssue) {
    return Object.freeze({
      status: "invalid" as const,
      reason: null,
      issues: Object.freeze([ruleIssue]),
    });
  }

  if (rule.objectKey !== kpiResult.objectKey) {
    return Object.freeze({
      status: "invalid" as const,
      reason: null,
      issues: Object.freeze([
        stateIssue(
          "KPI_RULE_MISMATCH",
          `Rule "${rule.id}" objectKey "${rule.objectKey}" does not match KPI objectKey "${kpiResult.objectKey}".`,
          {
            kpiId: kpiResult.kpiId,
            objectKey: kpiResult.objectKey,
            ruleId: rule.id,
          },
        ),
      ]),
    });
  }

  const band = resolveBandState(kpiResult.value, rule);
  if (!band.ok) {
    return Object.freeze({
      status: "invalid" as const,
      reason: null,
      issues: Object.freeze([band.issue]),
    });
  }

  return Object.freeze({
    status: "resolved" as const,
    reason: Object.freeze({
      kpiId: kpiResult.kpiId,
      kpiName: rule.kpiName,
      value: kpiResult.value,
      unit: kpiResult.unit,
      state: band.state,
      ruleId: rule.id,
    }),
    issues: Object.freeze([]),
  });
}

function aggregateState(
  reasons: readonly NexoraExecutiveStateReason[],
): NexoraExecutiveState {
  let best: NexoraExecutiveState = "normal";
  let bestRank: number = NEXORA_EXECUTIVE_STATE_SEVERITY.normal;
  for (const reason of reasons) {
    const rank = NEXORA_EXECUTIVE_STATE_SEVERITY[reason.state];
    if (rank > bestRank) {
      best = reason.state;
      bestRank = rank;
    }
  }
  return best;
}

/**
 * Resolve object-level executive states from KPI results.
 * critical dominates attention; attention dominates normal.
 * Objects without any resolvable KPI reason are omitted (not fabricated).
 */
export function resolveObjectExecutiveStates(
  kpiResults: readonly NexoraKPIResult[],
  rules: readonly NexoraExecutiveStateRule[],
): NexoraExecutiveStateResolutionResult {
  const issues: NexoraExecutiveStateIssue[] = [];
  const reasonsByObject = new Map<
    string,
    {
      objectKey: string;
      nexoraObjectId: string;
      reasons: NexoraExecutiveStateReason[];
    }
  >();

  for (const kpi of kpiResults) {
    const resolved = resolveKPIExecutiveState(kpi, rules);
    if (resolved.status !== "resolved" || !resolved.reason) {
      issues.push(...resolved.issues);
      continue;
    }

    const existing = reasonsByObject.get(kpi.objectKey);
    if (!existing) {
      reasonsByObject.set(kpi.objectKey, {
        objectKey: kpi.objectKey,
        nexoraObjectId: kpi.nexoraObjectId,
        reasons: [resolved.reason],
      });
      continue;
    }

    if (existing.nexoraObjectId !== kpi.nexoraObjectId) {
      issues.push(
        stateIssue(
          "KPI_RULE_MISMATCH",
          `Object "${kpi.objectKey}" has inconsistent nexoraObjectId across KPI results.`,
          { objectKey: kpi.objectKey, kpiId: kpi.kpiId },
        ),
      );
      continue;
    }
    existing.reasons.push(resolved.reason);
  }

  const objectStates: NexoraObjectExecutiveState[] = [];
  for (const entry of reasonsByObject.values()) {
    if (entry.reasons.length === 0) {
      issues.push(
        stateIssue(
          "UNRESOLVED_OBJECT_STATE",
          `Object "${entry.objectKey}" has no resolvable executive state.`,
          { objectKey: entry.objectKey },
        ),
      );
      continue;
    }
    objectStates.push(
      Object.freeze({
        objectKey: entry.objectKey,
        nexoraObjectId: entry.nexoraObjectId,
        state: aggregateState(entry.reasons),
        reasons: Object.freeze([...entry.reasons]),
      }),
    );
  }

  // Stable ordering by objectKey for determinism.
  objectStates.sort((a, b) => a.objectKey.localeCompare(b.objectKey));

  const status =
    objectStates.length === 0
      ? "invalid"
      : issues.length === 0
        ? "resolved"
        : "partial";

  return Object.freeze({
    status,
    objectStates: Object.freeze(objectStates),
    issues: Object.freeze(issues),
  });
}
