/**
 * P0:3 — Deterministic KPI Computation.
 *
 * Bound business facts → KPI definitions → KPI results.
 *
 * No executive-state thresholds. No Runtime/Stage/Three.js/React.
 * Numeric results only — presentation formatting is downstream.
 */

import type {
  NexoraBoundBusinessFact,
  NexoraKPIDefinition,
  NexoraKPIResult,
} from "./dataRealityContracts.ts";
import { NEXORA_KPI_COMPUTATION_KINDS } from "./dataRealityContracts.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const kpiComputationIdentity = "P0:3/NexoraKPIComputation" as const;

export const kpiComputationVersion = "1.0.0" as const;

export const kpiComputationNamespace =
  "nexora.data-reality.kpi-computation" as const;

export const kpiComputationPhase = "KPIComputation" as const;

export const kpiComputationArchitecturalRole =
  "DeterministicBoundFactKPIComputation" as const;

export const KPI_COMPUTATION_BOUNDARY = Object.freeze({
  architecturalRole: kpiComputationArchitecturalRole,
  ownsExecutiveStateResolution: false as const,
  ownsStageMutation: false as const,
  ownsThreeJs: false as const,
  ownsReactState: false as const,
  ownsThresholdRules: false as const,
  consumesBoundFactsOnly: true as const,
  fabricatesCostKpi: false as const,
});

export type NexoraKPIComputationIdentity = {
  readonly id: typeof kpiComputationIdentity;
  readonly version: typeof kpiComputationVersion;
  readonly namespace: typeof kpiComputationNamespace;
  readonly phase: typeof kpiComputationPhase;
  readonly architecturalRole: typeof kpiComputationArchitecturalRole;
};

const IDENTITY: NexoraKPIComputationIdentity = Object.freeze({
  id: kpiComputationIdentity,
  version: kpiComputationVersion,
  namespace: kpiComputationNamespace,
  phase: kpiComputationPhase,
  architecturalRole: kpiComputationArchitecturalRole,
});

export function getKpiComputationIdentity(): NexoraKPIComputationIdentity {
  return IDENTITY;
}

// ─── Context / issues / results ─────────────────────────────────────────────

/** Caller-provided calculation context — no Date.now() inside business logic. */
export type NexoraKPIComputationContext = {
  readonly calculatedAt: string;
};

export const NEXORA_KPI_COMPUTATION_ISSUE_CODES = Object.freeze([
  "UNKNOWN_KPI_DEFINITION",
  "MISSING_REQUIRED_METRIC",
  "AMBIGUOUS_METRIC_FACT",
  "OBJECT_BINDING_MISMATCH",
  "ZERO_DENOMINATOR",
  "NON_FINITE_METRIC_VALUE",
  "INVALID_KPI_DEFINITION",
] as const);

export type NexoraKPIComputationIssueCode =
  (typeof NEXORA_KPI_COMPUTATION_ISSUE_CODES)[number];

export type NexoraKPIComputationIssue = {
  readonly code: NexoraKPIComputationIssueCode;
  readonly message: string;
  readonly kpiId?: string;
  readonly objectKey?: string;
  readonly metricKey?: string;
  readonly nexoraObjectId?: string;
};

export type NexoraKPIComputationResult = {
  readonly status: "computed" | "partial" | "invalid";
  readonly kpis: readonly NexoraKPIResult[];
  readonly issues: readonly NexoraKPIComputationIssue[];
};

function kpiIssue(
  code: NexoraKPIComputationIssueCode,
  message: string,
  extras?: Omit<NexoraKPIComputationIssue, "code" | "message">,
): NexoraKPIComputationIssue {
  return Object.freeze({ code, message, ...extras });
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isKnownComputationKind(value: unknown): boolean {
  return (NEXORA_KPI_COMPUTATION_KINDS as readonly unknown[]).includes(value);
}

type MetricLookup =
  | { readonly ok: true; readonly fact: NexoraBoundBusinessFact }
  | { readonly ok: false; readonly issue: NexoraKPIComputationIssue };

function lookupOwnedMetric(
  boundFacts: readonly NexoraBoundBusinessFact[],
  definition: NexoraKPIDefinition,
  metricKey: string,
): MetricLookup {
  const matches = boundFacts.filter(
    (fact) =>
      fact.objectKey === definition.objectKey && fact.metricKey === metricKey,
  );

  if (matches.length === 0) {
    return {
      ok: false,
      issue: kpiIssue(
        "MISSING_REQUIRED_METRIC",
        `KPI "${definition.id}" is missing required metric "${definition.objectKey}.${metricKey}".`,
        {
          kpiId: definition.id,
          objectKey: definition.objectKey,
          metricKey,
        },
      ),
    };
  }

  if (matches.length > 1) {
    return {
      ok: false,
      issue: kpiIssue(
        "AMBIGUOUS_METRIC_FACT",
        `KPI "${definition.id}" found multiple facts for "${definition.objectKey}.${metricKey}".`,
        {
          kpiId: definition.id,
          objectKey: definition.objectKey,
          metricKey,
        },
      ),
    };
  }

  const fact = matches[0]!;
  if (typeof fact.value !== "number" || !Number.isFinite(fact.value)) {
    return {
      ok: false,
      issue: kpiIssue(
        "NON_FINITE_METRIC_VALUE",
        `KPI "${definition.id}" received a non-finite value for "${definition.objectKey}.${metricKey}".`,
        {
          kpiId: definition.id,
          objectKey: definition.objectKey,
          metricKey,
          nexoraObjectId: fact.nexoraObjectId,
        },
      ),
    };
  }

  return { ok: true, fact };
}

function validateDefinition(
  definition: NexoraKPIDefinition,
): NexoraKPIComputationIssue | null {
  if (!isNonEmptyString(definition.id)) {
    return kpiIssue(
      "INVALID_KPI_DEFINITION",
      "KPI definition is missing id.",
    );
  }
  if (!isNonEmptyString(definition.objectKey)) {
    return kpiIssue(
      "INVALID_KPI_DEFINITION",
      `KPI "${definition.id}" is missing objectKey.`,
      { kpiId: definition.id },
    );
  }
  if (!isNonEmptyString(definition.unit)) {
    return kpiIssue(
      "INVALID_KPI_DEFINITION",
      `KPI "${definition.id}" is missing unit.`,
      { kpiId: definition.id, objectKey: definition.objectKey },
    );
  }
  if (!isKnownComputationKind(definition.computationKind)) {
    return kpiIssue(
      "INVALID_KPI_DEFINITION",
      `KPI "${definition.id}" has unsupported computationKind.`,
      { kpiId: definition.id, objectKey: definition.objectKey },
    );
  }
  if (
    !Array.isArray(definition.requiredMetrics) ||
    definition.requiredMetrics.length < 2
  ) {
    return kpiIssue(
      "INVALID_KPI_DEFINITION",
      `KPI "${definition.id}" requires at least two metrics for computation.`,
      { kpiId: definition.id, objectKey: definition.objectKey },
    );
  }
  return null;
}

function computeValue(
  definition: NexoraKPIDefinition,
  left: number,
  right: number,
): { readonly ok: true; readonly value: number } | {
  readonly ok: false;
  readonly issue: NexoraKPIComputationIssue;
} {
  if (right === 0) {
    return {
      ok: false,
      issue: kpiIssue(
        "ZERO_DENOMINATOR",
        `KPI "${definition.id}" cannot divide by zero (${definition.requiredMetrics[1]}).`,
        {
          kpiId: definition.id,
          objectKey: definition.objectKey,
          metricKey: definition.requiredMetrics[1],
        },
      ),
    };
  }

  let value: number;
  switch (definition.computationKind) {
    case "growth-rate":
      value = ((left - right) / right) * 100;
      break;
    case "ratio-percent":
    case "score-percent":
      value = (left / right) * 100;
      break;
    default:
      return {
        ok: false,
        issue: kpiIssue(
          "INVALID_KPI_DEFINITION",
          `KPI "${definition.id}" has unsupported computationKind.`,
          {
            kpiId: definition.id,
            objectKey: definition.objectKey,
          },
        ),
      };
  }

  if (!Number.isFinite(value)) {
    return {
      ok: false,
      issue: kpiIssue(
        "NON_FINITE_METRIC_VALUE",
        `KPI "${definition.id}" produced a non-finite result.`,
        {
          kpiId: definition.id,
          objectKey: definition.objectKey,
        },
      ),
    };
  }

  return { ok: true, value };
}

/**
 * Compute a single KPI from bound facts.
 * Metric lookup is scoped by definition.objectKey — shared metric names
 * on other objects never satisfy this KPI.
 */
export function computeNexoraKPI(
  definition: NexoraKPIDefinition,
  boundFacts: readonly NexoraBoundBusinessFact[],
  context: NexoraKPIComputationContext,
): NexoraKPIComputationResult {
  return computeNexoraKPIs([definition], boundFacts, context);
}

export function computeNexoraKPIs(
  definitions: readonly NexoraKPIDefinition[],
  boundFacts: readonly NexoraBoundBusinessFact[],
  context: NexoraKPIComputationContext,
): NexoraKPIComputationResult {
  const issues: NexoraKPIComputationIssue[] = [];
  const kpis: NexoraKPIResult[] = [];

  if (!isNonEmptyString(context.calculatedAt)) {
    issues.push(
      kpiIssue(
        "INVALID_KPI_DEFINITION",
        "KPI computation context requires a non-empty calculatedAt.",
      ),
    );
    return Object.freeze({
      status: "invalid",
      kpis: Object.freeze([]),
      issues: Object.freeze(issues),
    });
  }

  if (!Array.isArray(definitions) || definitions.length === 0) {
    issues.push(
      kpiIssue(
        "UNKNOWN_KPI_DEFINITION",
        "No KPI definitions were provided for computation.",
      ),
    );
    return Object.freeze({
      status: "invalid",
      kpis: Object.freeze([]),
      issues: Object.freeze(issues),
    });
  }

  for (const definition of definitions) {
    const definitionIssue = validateDefinition(definition);
    if (definitionIssue) {
      issues.push(definitionIssue);
      continue;
    }

    const metricFacts: NexoraBoundBusinessFact[] = [];
    let failed = false;

    for (const metricKey of definition.requiredMetrics) {
      const lookup = lookupOwnedMetric(boundFacts, definition, metricKey);
      if (!lookup.ok) {
        issues.push(lookup.issue);
        failed = true;
        break;
      }
      metricFacts.push(lookup.fact);
    }

    if (failed) continue;

    const nexoraObjectIds = new Set(
      metricFacts.map((fact) => fact.nexoraObjectId),
    );
    if (nexoraObjectIds.size !== 1) {
      issues.push(
        kpiIssue(
          "OBJECT_BINDING_MISMATCH",
          `KPI "${definition.id}" required metrics resolve to inconsistent nexoraObjectId values.`,
          {
            kpiId: definition.id,
            objectKey: definition.objectKey,
          },
        ),
      );
      continue;
    }

    const nexoraObjectId = metricFacts[0]!.nexoraObjectId;
    const foreign = metricFacts.find(
      (fact) => fact.objectKey !== definition.objectKey,
    );
    if (foreign) {
      issues.push(
        kpiIssue(
          "OBJECT_BINDING_MISMATCH",
          `KPI "${definition.id}" cannot consume fact from objectKey "${foreign.objectKey}".`,
          {
            kpiId: definition.id,
            objectKey: definition.objectKey,
            metricKey: foreign.metricKey,
            nexoraObjectId: foreign.nexoraObjectId,
          },
        ),
      );
      continue;
    }

    const left = metricFacts[0]!.value;
    const right = metricFacts[1]!.value;
    const computed = computeValue(definition, left, right);
    if (!computed.ok) {
      issues.push({
        ...computed.issue,
        nexoraObjectId,
      });
      continue;
    }

    kpis.push(
      Object.freeze({
        kpiId: definition.id,
        objectKey: definition.objectKey,
        nexoraObjectId,
        value: computed.value,
        unit: definition.unit,
        calculatedAt: context.calculatedAt,
      }),
    );
  }

  const status =
    kpis.length === 0
      ? "invalid"
      : issues.length === 0
        ? "computed"
        : "partial";

  return Object.freeze({
    status,
    kpis: Object.freeze(kpis),
    issues: Object.freeze(issues),
  });
}
