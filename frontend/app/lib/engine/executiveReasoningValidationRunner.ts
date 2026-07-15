import { ExecutiveReasoningFoundationValidation } from "./executiveReasoningFoundationValidation.ts";
import { ExecutiveReasoningModelValidation } from "./executiveReasoningModelValidation.ts";
import { ExecutiveReasoningRegistryValidation } from "./executiveReasoningRegistryValidation.ts";
import {
  ExecutiveReasoningValidationDomains,
  ExecutiveReasoningValidationManifest,
} from "./executiveReasoningValidationManifest.ts";
import type {
  ExecutiveReasoningValidationDomainName,
  ExecutiveReasoningValidationRule,
  ExecutiveReasoningValidationStatus,
} from "./executiveReasoningValidationTypes.ts";

const allRules = Object.freeze([
  ...ExecutiveReasoningFoundationValidation.rules,
  ...ExecutiveReasoningRegistryValidation.rules,
  ...ExecutiveReasoningModelValidation.rules,
] as const);

const domainGroups = Object.freeze([
  ExecutiveReasoningFoundationValidation,
  ExecutiveReasoningRegistryValidation,
  ExecutiveReasoningModelValidation,
] as const);

/**
 * Deterministic metadata-only validation runner.
 * Aggregates declared rule statuses — never executes runtime validation.
 */
export const ExecutiveReasoningValidationRunner = Object.freeze({
  id: "eng-6-validation-runner",
  name: "Executive Reasoning Validation Runner",
  description:
    "Deterministic metadata aggregator reporting PASS, WARNING, or FAIL from declared validation rule statuses only.",
  rules: allRules,
  domainGroups,
  domains: ExecutiveReasoningValidationDomains,
  run: (): Readonly<{
    status: ExecutiveReasoningValidationStatus;
    passCount: number;
    warningCount: number;
    failCount: number;
    totalRuleCount: number;
    domainCount: number;
    metadataOnly: true;
    immutable: true;
    deterministic: true;
  }> => {
    // Statuses are declared metadata; widen for aggregation without runtime validation.
    const statuses = allRules.map(
      ({ status }) => status as ExecutiveReasoningValidationStatus,
    );
    const passCount = statuses.filter((status) => status === "PASS").length;
    const warningCount = statuses.filter((status) => status === "WARNING").length;
    const failCount = statuses.filter((status) => status === "FAIL").length;
    const status: ExecutiveReasoningValidationStatus =
      failCount > 0 ? "FAIL" : warningCount > 0 ? "WARNING" : "PASS";
    return Object.freeze({
      status,
      passCount,
      warningCount,
      failCount,
      totalRuleCount: allRules.length,
      domainCount: ExecutiveReasoningValidationDomains.length,
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    } as const);
  },
  getRulesByDomain: (
    domain: ExecutiveReasoningValidationDomainName,
  ): readonly ExecutiveReasoningValidationRule[] =>
    Object.freeze(allRules.filter((rule) => rule.domain === domain)),
  getRuleById: (
    id: string,
  ): ExecutiveReasoningValidationRule | undefined =>
    allRules.find((rule) => rule.id === id),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  aiFree: true,
  manifest: ExecutiveReasoningValidationManifest,
} as const);

export const ExecutiveReasoningValidationRegistry = Object.freeze({
  id: "eng-6-validation-registry",
  name: "Executive Reasoning Validation Registry",
  domains: ExecutiveReasoningValidationDomains,
  domainGroups,
  rules: allRules,
  foundation: ExecutiveReasoningFoundationValidation,
  registry: ExecutiveReasoningRegistryValidation,
  model: ExecutiveReasoningModelValidation,
  ruleCount: allRules.length,
  domainCount: ExecutiveReasoningValidationDomains.length,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  aiFree: true,
} as const);
