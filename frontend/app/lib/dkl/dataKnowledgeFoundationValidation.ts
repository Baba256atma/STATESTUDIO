/**
 * DKL-1:4 — Data Knowledge Foundation Validation.
 *
 * Canonical, immutable, metadata-only validation platform for DKL-1:1 through
 * DKL-1:3. Aggregates the five validation domains, the frozen rule registry,
 * and the validation manifest into a single deep-frozen structure and publishes
 * exactly eight metadata-only public APIs.
 *
 * All evidence is derived from approved public metadata of earlier phases.
 * Zero runtime behavior: no I/O, no network, no filesystem, no database,
 * no parsing, no reflection, no dynamic import, no async, no side effects.
 */

import { DataKnowledgeFoundationFoundationValidation } from "./dataKnowledgeFoundationFoundationValidation.ts";
import { DataKnowledgeFoundationModelValidation } from "./dataKnowledgeFoundationModelValidation.ts";
import { DataKnowledgeFoundationOwnershipValidation } from "./dataKnowledgeFoundationOwnershipValidation.ts";
import { DataKnowledgeFoundationPublicApiValidation } from "./dataKnowledgeFoundationPublicApiValidation.ts";
import { DataKnowledgeFoundationRegistryValidation } from "./dataKnowledgeFoundationRegistryValidation.ts";
import {
  DataKnowledgeFoundationValidationManifest,
  DataKnowledgeFoundationValidationRules,
} from "./dataKnowledgeFoundationValidationManifest.ts";
import type {
  DataKnowledgeFoundationValidationDescriptor,
  DataKnowledgeFoundationValidationSummary,
  ValidationRuleDescriptor,
  ValidationRunnerResult,
} from "./dataKnowledgeFoundationValidationTypes.ts";

export { DataKnowledgeFoundationValidationRules, DataKnowledgeFoundationValidationManifest };

export const DataKnowledgeFoundationValidation = Object.freeze({
  foundation: DataKnowledgeFoundationFoundationValidation,
  registry: DataKnowledgeFoundationRegistryValidation,
  model: DataKnowledgeFoundationModelValidation,
  ownership: DataKnowledgeFoundationOwnershipValidation,
  publicApi: DataKnowledgeFoundationPublicApiValidation,
  rules: DataKnowledgeFoundationValidationRules,
  manifest: DataKnowledgeFoundationValidationManifest,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies DataKnowledgeFoundationValidationDescriptor);

const passedRules = DataKnowledgeFoundationValidationRules.filter((rule) => rule.result === "PASS").length;
const failedRules = DataKnowledgeFoundationValidationRules.length - passedRules;
const errorCount = DataKnowledgeFoundationValidationRules.filter(
  (rule) => rule.severity === "ERROR" && rule.result === "FAIL"
).length;
const warningCount = DataKnowledgeFoundationValidationRules.filter(
  (rule) => rule.severity === "WARNING" && rule.result === "FAIL"
).length;
const status: ValidationRunnerResult["status"] = failedRules === 0 ? "VALIDATED" : "FAILED";
const readiness: ValidationRunnerResult["readiness"] =
  status === "VALIDATED" ? "ReadyForManifest" : "NotReady";

const RUNNER_RESULT: ValidationRunnerResult = Object.freeze({
  totalRules: DataKnowledgeFoundationValidationRules.length,
  passedRules,
  failedRules,
  warningCount,
  errorCount,
  status,
  readiness,
  metadataOnly: true,
  immutable: true,
});

const VALIDATION_SUMMARY: DataKnowledgeFoundationValidationSummary = Object.freeze({
  validationId: "DKL-1:4",
  version: "1.0.0",
  domainCount: DataKnowledgeFoundationValidationManifest.validationDomains.length,
  ruleCount: DataKnowledgeFoundationValidationRules.length,
  passedRules,
  failedRules,
  status,
  readiness,
  metadataOnly: true,
  immutable: true,
});

export const runDataKnowledgeFoundationValidation = (): ValidationRunnerResult => RUNNER_RESULT;

export const getDataKnowledgeFoundationValidation = (): DataKnowledgeFoundationValidationDescriptor =>
  DataKnowledgeFoundationValidation;

export const getDataKnowledgeFoundationValidationSummary = (): DataKnowledgeFoundationValidationSummary =>
  VALIDATION_SUMMARY;

export const getDataKnowledgeFoundationValidationRuleById = (
  id: string
): ValidationRuleDescriptor | undefined =>
  DataKnowledgeFoundationValidationRules.find((rule) => rule.id === id);

export const getDataKnowledgeFoundationValidationRulesByDomain = (
  domain: string
): readonly ValidationRuleDescriptor[] =>
  Object.freeze(DataKnowledgeFoundationValidationRules.filter((rule) => rule.domain === domain));
