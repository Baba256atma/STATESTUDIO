/**
 * P0:1 — Lightweight Data Reality foundation validation.
 *
 * Detects malformed datasets, facts, bindings, and KPI definitions.
 * Not a full validation platform.
 */

import {
  NEXORA_DATASET_SCENARIOS,
  NEXORA_DATASET_SOURCES,
  NEXORA_EXECUTIVE_STATES,
  NEXORA_KPI_COMPUTATION_KINDS,
  type NexoraBusinessFact,
  type NexoraDataset,
  type NexoraDatasetRecord,
  type NexoraKPIDefinition,
  type NexoraObjectDataBinding,
} from "./dataRealityContracts.ts";

export type NexoraDataRealityValidationCode =
  | "MISSING_DATASET_ID"
  | "INVALID_DATASET_VERSION"
  | "MISSING_DATASET_NAME"
  | "INVALID_DATASET_SOURCE"
  | "INVALID_DATASET_SCENARIO"
  | "MISSING_DATASET_FAMILY"
  | "MISSING_OBJECT_KEY"
  | "MISSING_METRIC_KEY"
  | "NON_FINITE_VALUE"
  | "DUPLICATE_RECORD_IDENTITY"
  | "MALFORMED_KPI_DEFINITION"
  | "UNKNOWN_BINDING_OBJECT_KEY"
  | "EMPTY_BINDING_METRICS";

export type NexoraDataRealityValidationIssue = {
  readonly code: NexoraDataRealityValidationCode;
  readonly message: string;
  readonly path?: string;
};

export type NexoraDataRealityValidationResult = {
  readonly ok: boolean;
  readonly issues: readonly NexoraDataRealityValidationIssue[];
};

function issue(
  code: NexoraDataRealityValidationCode,
  message: string,
  path?: string,
): NexoraDataRealityValidationResult["issues"][number] {
  return path === undefined
    ? Object.freeze({ code, message })
    : Object.freeze({ code, message, path });
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidVersion(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[0-9]+\.[0-9]+(\.[0-9]+)?([-.][A-Za-z0-9.]+)?$/.test(value.trim())
  );
}

function recordIdentity(record: NexoraDatasetRecord): string {
  return `${record.objectKey}\u0000${record.metricKey}`;
}

function validateRecord(
  record: NexoraDatasetRecord,
  path: string,
  issues: NexoraDataRealityValidationIssue[],
): void {
  if (!isNonEmptyString(record.objectKey)) {
    issues.push(
      issue("MISSING_OBJECT_KEY", "Dataset record is missing objectKey.", path),
    );
  }
  if (!isNonEmptyString(record.metricKey)) {
    issues.push(
      issue("MISSING_METRIC_KEY", "Dataset record is missing metricKey.", path),
    );
  }
  if (typeof record.value !== "number" || !Number.isFinite(record.value)) {
    issues.push(
      issue(
        "NON_FINITE_VALUE",
        "Dataset record value must be a finite number.",
        `${path}.value`,
      ),
    );
  }
}

export function validateNexoraDataset(
  dataset: NexoraDataset,
): NexoraDataRealityValidationResult {
  const issues: NexoraDataRealityValidationIssue[] = [];

  if (!isNonEmptyString(dataset.id)) {
    issues.push(
      issue("MISSING_DATASET_ID", "Dataset is missing a non-empty id."),
    );
  }
  if (!isNonEmptyString(dataset.name)) {
    issues.push(
      issue("MISSING_DATASET_NAME", "Dataset is missing a non-empty name."),
    );
  }
  if (!isValidVersion(dataset.version)) {
    issues.push(
      issue(
        "INVALID_DATASET_VERSION",
        "Dataset version must be a non-empty semver-like string.",
        "version",
      ),
    );
  }
  if (
    !(NEXORA_DATASET_SOURCES as readonly string[]).includes(dataset.source)
  ) {
    issues.push(
      issue(
        "INVALID_DATASET_SOURCE",
        `Dataset source "${String(dataset.source)}" is not supported.`,
        "source",
      ),
    );
  }
  if (
    !(NEXORA_DATASET_SCENARIOS as readonly string[]).includes(dataset.scenario)
  ) {
    issues.push(
      issue(
        "INVALID_DATASET_SCENARIO",
        `Dataset scenario "${String(dataset.scenario)}" is not supported.`,
        "scenario",
      ),
    );
  }
  if (!isNonEmptyString(dataset.familyId)) {
    issues.push(
      issue(
        "MISSING_DATASET_FAMILY",
        "Dataset is missing familyId for A/B scenario comparison.",
        "familyId",
      ),
    );
  }

  const seen = new Set<string>();
  for (let i = 0; i < dataset.records.length; i += 1) {
    const record = dataset.records[i]!;
    const path = `records[${i}]`;
    validateRecord(record, path, issues);
    if (
      isNonEmptyString(record.objectKey) &&
      isNonEmptyString(record.metricKey)
    ) {
      const identity = recordIdentity(record);
      if (seen.has(identity)) {
        issues.push(
          issue(
            "DUPLICATE_RECORD_IDENTITY",
            `Duplicate record identity ${record.objectKey}.${record.metricKey}.`,
            path,
          ),
        );
      } else {
        seen.add(identity);
      }
    }
  }

  return Object.freeze({
    ok: issues.length === 0,
    issues: Object.freeze(issues),
  });
}

export function validateNexoraBusinessFacts(
  facts: readonly NexoraBusinessFact[],
): NexoraDataRealityValidationResult {
  const issues: NexoraDataRealityValidationIssue[] = [];
  for (let i = 0; i < facts.length; i += 1) {
    const fact = facts[i]!;
    const path = `facts[${i}]`;
    if (!isNonEmptyString(fact.objectKey)) {
      issues.push(
        issue("MISSING_OBJECT_KEY", "Business fact is missing objectKey.", path),
      );
    }
    if (!isNonEmptyString(fact.metricKey)) {
      issues.push(
        issue("MISSING_METRIC_KEY", "Business fact is missing metricKey.", path),
      );
    }
    if (!isNonEmptyString(fact.sourceDatasetId)) {
      issues.push(
        issue(
          "MISSING_DATASET_ID",
          "Business fact is missing sourceDatasetId.",
          `${path}.sourceDatasetId`,
        ),
      );
    }
    if (typeof fact.value !== "number" || !Number.isFinite(fact.value)) {
      issues.push(
        issue(
          "NON_FINITE_VALUE",
          "Business fact value must be a finite number.",
          `${path}.value`,
        ),
      );
    }
  }
  return Object.freeze({
    ok: issues.length === 0,
    issues: Object.freeze(issues),
  });
}

export function validateNexoraKPIDefinitions(
  definitions: readonly NexoraKPIDefinition[],
): NexoraDataRealityValidationResult {
  const issues: NexoraDataRealityValidationIssue[] = [];
  const seenIds = new Set<string>();

  for (let i = 0; i < definitions.length; i += 1) {
    const def = definitions[i]!;
    const path = `kpis[${i}]`;
    if (!isNonEmptyString(def.id)) {
      issues.push(
        issue(
          "MALFORMED_KPI_DEFINITION",
          "KPI definition is missing id.",
          `${path}.id`,
        ),
      );
    } else if (seenIds.has(def.id)) {
      issues.push(
        issue(
          "MALFORMED_KPI_DEFINITION",
          `Duplicate KPI definition id "${def.id}".`,
          `${path}.id`,
        ),
      );
    } else {
      seenIds.add(def.id);
    }
    if (!isNonEmptyString(def.objectKey)) {
      issues.push(
        issue(
          "MISSING_OBJECT_KEY",
          "KPI definition is missing objectKey.",
          `${path}.objectKey`,
        ),
      );
    }
    if (!isNonEmptyString(def.name)) {
      issues.push(
        issue(
          "MALFORMED_KPI_DEFINITION",
          "KPI definition is missing name.",
          `${path}.name`,
        ),
      );
    }
    if (!isNonEmptyString(def.unit)) {
      issues.push(
        issue(
          "MALFORMED_KPI_DEFINITION",
          "KPI definition is missing unit.",
          `${path}.unit`,
        ),
      );
    }
    if (!Array.isArray(def.requiredMetrics) || def.requiredMetrics.length === 0) {
      issues.push(
        issue(
          "MALFORMED_KPI_DEFINITION",
          "KPI definition requires at least one metric.",
          `${path}.requiredMetrics`,
        ),
      );
    } else if (def.requiredMetrics.some((m) => !isNonEmptyString(m))) {
      issues.push(
        issue(
          "MALFORMED_KPI_DEFINITION",
          "KPI requiredMetrics must be non-empty strings.",
          `${path}.requiredMetrics`,
        ),
      );
    }
    if (
      !(NEXORA_KPI_COMPUTATION_KINDS as readonly string[]).includes(
        def.computationKind,
      )
    ) {
      issues.push(
        issue(
          "MALFORMED_KPI_DEFINITION",
          "KPI definition has invalid or missing computationKind.",
          `${path}.computationKind`,
        ),
      );
    }
  }

  return Object.freeze({
    ok: issues.length === 0,
    issues: Object.freeze(issues),
  });
}

export function validateNexoraObjectDataBindings(
  bindings: readonly NexoraObjectDataBinding[],
  allowedObjectKeys: readonly string[],
): NexoraDataRealityValidationResult {
  const issues: NexoraDataRealityValidationIssue[] = [];
  const allowed = new Set(allowedObjectKeys);

  for (let i = 0; i < bindings.length; i += 1) {
    const binding = bindings[i]!;
    const path = `bindings[${i}]`;
    if (!isNonEmptyString(binding.objectKey)) {
      issues.push(
        issue(
          "MISSING_OBJECT_KEY",
          "Object data binding is missing objectKey.",
          path,
        ),
      );
      continue;
    }
    if (!allowed.has(binding.objectKey)) {
      issues.push(
        issue(
          "UNKNOWN_BINDING_OBJECT_KEY",
          `Object data binding references unknown objectKey "${binding.objectKey}".`,
          path,
        ),
      );
    }
    if (!Array.isArray(binding.metricKeys) || binding.metricKeys.length === 0) {
      issues.push(
        issue(
          "EMPTY_BINDING_METRICS",
          "Object data binding requires at least one metricKey.",
          `${path}.metricKeys`,
        ),
      );
    }
  }

  return Object.freeze({
    ok: issues.length === 0,
    issues: Object.freeze(issues),
  });
}

export function isNexoraExecutiveState(value: unknown): boolean {
  return (NEXORA_EXECUTIVE_STATES as readonly unknown[]).includes(value);
}
