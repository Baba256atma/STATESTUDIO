import type { DomainExecutiveInsight } from "./domainExecutiveIntelligence.ts";
import type { DomainRiskSignalResult } from "./domainRiskSignals.ts";
import type { DomainScenario } from "./domainScenarioTypes.ts";

export type DomainValidationResult = {
  valid: boolean;
  warnings: string[];
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function isNonEmptyString(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function isClampedNumber(value: unknown, max = 1): boolean {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= max;
}

function result(warnings: string[]): DomainValidationResult {
  return { valid: warnings.length === 0, warnings };
}

export function validateDomainObject(value: unknown): DomainValidationResult {
  const record = asRecord(value);
  const warnings: string[] = [];
  if (!isNonEmptyString(record.id)) warnings.push("object_missing_id");
  if (!isNonEmptyString(record.label) && !isNonEmptyString(record.name)) warnings.push("object_missing_label");
  if (!isNonEmptyString(record.role) && !isNonEmptyString(asRecord(record.semantic).role) && !isNonEmptyString(asRecord(record.meta).semanticRole)) {
    warnings.push("object_missing_role");
  }
  return result(warnings);
}

export function validateDomainEdge(value: unknown): DomainValidationResult {
  const record = asRecord(value);
  const warnings: string[] = [];
  if (!isNonEmptyString(record.from)) warnings.push("edge_missing_from");
  if (!isNonEmptyString(record.to)) warnings.push("edge_missing_to");
  if (!isNonEmptyString(record.kind) && !isNonEmptyString(asRecord(record.metadata).relationshipType)) warnings.push("edge_missing_relationship_type");
  return result(warnings);
}

export function validateDomainRiskSignal(value: unknown): DomainValidationResult {
  const signal = asRecord(value) as Partial<DomainRiskSignalResult>;
  const warnings: string[] = [];
  if (!isNonEmptyString(signal.id)) warnings.push("signal_missing_id");
  if (!isNonEmptyString(signal.domainId)) warnings.push("signal_missing_domain");
  if (!isNonEmptyString(signal.label)) warnings.push("signal_missing_label");
  if (!isClampedNumber(signal.confidence)) warnings.push("signal_confidence_out_of_range");
  if (!Array.isArray(signal.relatedObjectIds)) warnings.push("signal_missing_related_objects");
  return result(warnings);
}

export function validateDomainScenario(value: unknown): DomainValidationResult {
  const scenario = asRecord(value) as Partial<DomainScenario>;
  const warnings: string[] = [];
  if (!isNonEmptyString(scenario.id)) warnings.push("scenario_missing_id");
  if (!isNonEmptyString(scenario.domainId)) warnings.push("scenario_missing_domain");
  if (!isNonEmptyString(scenario.title)) warnings.push("scenario_missing_title");
  if (!isClampedNumber(scenario.confidence)) warnings.push("scenario_confidence_out_of_range");
  if (!Array.isArray(scenario.relatedObjectIds)) warnings.push("scenario_missing_related_objects");
  if (!Array.isArray(scenario.impacts)) warnings.push("scenario_missing_impacts");
  return result(warnings);
}

export function validateDomainExecutiveInsight(value: unknown): DomainValidationResult {
  const insight = asRecord(value) as Partial<DomainExecutiveInsight>;
  const warnings: string[] = [];
  if (!isNonEmptyString(insight.id)) warnings.push("insight_missing_id");
  if (!isNonEmptyString(insight.domainId)) warnings.push("insight_missing_domain");
  if (!isNonEmptyString(insight.title)) warnings.push("insight_missing_title");
  if (!isClampedNumber(insight.confidence)) warnings.push("insight_confidence_out_of_range");
  if (!Array.isArray(insight.relatedObjectIds)) warnings.push("insight_missing_related_objects");
  if (!Array.isArray(insight.recommendedActions)) warnings.push("insight_missing_recommended_actions");
  return result(warnings);
}
