import {
  AutomationContracts,
  AutomationMetadataCatalog,
  ExecutiveAutomationFoundation,
} from "./automationIndex.ts";
import {
  ExecutiveAutomationRegistry,
} from "./automationRegistryIndex.ts";
import {
  ExecutiveAutomationModel,
} from "./automationModelIndex.ts";
import type {
  AutomationValidationResult,
  AutomationValidationRule,
  AutomationValidationSummary,
} from "./automationValidationTypes.ts";

const buildResult = (checks: readonly AutomationValidationRule[]) => {
  const passedChecks = checks.filter((check) => check.status === "PASS").length;
  const failedChecks = checks.length - passedChecks;

  return Object.freeze({
    totalChecks: checks.length,
    passedChecks,
    failedChecks,
    status: failedChecks === 0 ? "PASS" : "FAIL",
    checks,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const satisfies AutomationValidationResult);
};

export const validateAutomationFoundation = () =>
  buildResult(
    Object.freeze([
      Object.freeze({
        id: "automation-foundation-contracts-present",
        name: "Contracts Present",
        description: "Validates automation foundation contracts are available.",
        category: "Foundation",
        status: AutomationContracts.all.length === 5 ? "PASS" : "FAIL",
        metadataOnly: true,
      } as const),
      Object.freeze({
        id: "automation-foundation-registry-present",
        name: "Registry Present",
        description: "Validates automation foundation registry is available.",
        category: "Foundation",
        status:
          ExecutiveAutomationFoundation.registry.platformId === "OPS-8:1"
            ? "PASS"
            : "FAIL",
        metadataOnly: true,
      } as const),
      Object.freeze({
        id: "automation-foundation-metadata-present",
        name: "Metadata Present",
        description: "Validates automation foundation metadata is available.",
        category: "Foundation",
        status:
          AutomationMetadataCatalog.supportedEventCategories.length === 9
            ? "PASS"
            : "FAIL",
        metadataOnly: true,
      } as const),
    ] as const),
  );

export const validateAutomationRegistry = () =>
  buildResult(
    Object.freeze([
      Object.freeze({
        id: "automation-registry-events-complete",
        name: "Event Registry Complete",
        description: "Validates automation event registry completeness.",
        category: "Registry",
        status: ExecutiveAutomationRegistry.events.length === 9 ? "PASS" : "FAIL",
        metadataOnly: true,
      } as const),
      Object.freeze({
        id: "automation-registry-triggers-complete",
        name: "Trigger Registry Complete",
        description: "Validates automation trigger registry completeness.",
        category: "Registry",
        status: ExecutiveAutomationRegistry.triggers.length === 6 ? "PASS" : "FAIL",
        metadataOnly: true,
      } as const),
      Object.freeze({
        id: "automation-registry-conditions-complete",
        name: "Condition Registry Complete",
        description: "Validates automation condition registry completeness.",
        category: "Registry",
        status: ExecutiveAutomationRegistry.conditions.length === 7 ? "PASS" : "FAIL",
        metadataOnly: true,
      } as const),
      Object.freeze({
        id: "automation-registry-actions-complete",
        name: "Action Registry Complete",
        description: "Validates automation action registry completeness.",
        category: "Registry",
        status: ExecutiveAutomationRegistry.actions.length === 9 ? "PASS" : "FAIL",
        metadataOnly: true,
      } as const),
      Object.freeze({
        id: "automation-registry-rules-complete",
        name: "Rule Registry Complete",
        description: "Validates automation rule registry completeness.",
        category: "Registry",
        status: ExecutiveAutomationRegistry.rules.length === 6 ? "PASS" : "FAIL",
        metadataOnly: true,
      } as const),
      Object.freeze({
        id: "automation-registry-policies-complete",
        name: "Policy Registry Complete",
        description: "Validates automation policy registry completeness.",
        category: "Registry",
        status: ExecutiveAutomationRegistry.policies.length === 5 ? "PASS" : "FAIL",
        metadataOnly: true,
      } as const),
      Object.freeze({
        id: "automation-registry-lifecycle-complete",
        name: "Lifecycle Registry Complete",
        description: "Validates automation lifecycle registry completeness.",
        category: "Registry",
        status: ExecutiveAutomationRegistry.lifecycle.length === 6 ? "PASS" : "FAIL",
        metadataOnly: true,
      } as const),
    ] as const),
  );

export const validateAutomationModel = () =>
  buildResult(
    Object.freeze([
      Object.freeze({
        id: "automation-model-events-complete",
        name: "Event Model Complete",
        description: "Validates automation event model completeness.",
        category: "Model",
        status: ExecutiveAutomationModel.events.length === 9 ? "PASS" : "FAIL",
        metadataOnly: true,
      } as const),
      Object.freeze({
        id: "automation-model-triggers-complete",
        name: "Trigger Model Complete",
        description: "Validates automation trigger model completeness.",
        category: "Model",
        status: ExecutiveAutomationModel.triggers.length === 6 ? "PASS" : "FAIL",
        metadataOnly: true,
      } as const),
      Object.freeze({
        id: "automation-model-conditions-complete",
        name: "Condition Model Complete",
        description: "Validates automation condition model completeness.",
        category: "Model",
        status: ExecutiveAutomationModel.conditions.length === 7 ? "PASS" : "FAIL",
        metadataOnly: true,
      } as const),
      Object.freeze({
        id: "automation-model-actions-complete",
        name: "Action Model Complete",
        description: "Validates automation action model completeness.",
        category: "Model",
        status: ExecutiveAutomationModel.actions.length === 9 ? "PASS" : "FAIL",
        metadataOnly: true,
      } as const),
      Object.freeze({
        id: "automation-model-rules-complete",
        name: "Rule Model Complete",
        description: "Validates automation rule model completeness.",
        category: "Model",
        status: ExecutiveAutomationModel.rules.length === 6 ? "PASS" : "FAIL",
        metadataOnly: true,
      } as const),
      Object.freeze({
        id: "automation-model-policies-complete",
        name: "Policy Model Complete",
        description: "Validates automation policy model completeness.",
        category: "Model",
        status: ExecutiveAutomationModel.policies.length === 5 ? "PASS" : "FAIL",
        metadataOnly: true,
      } as const),
      Object.freeze({
        id: "automation-model-executions-complete",
        name: "Execution Model Complete",
        description: "Validates automation execution model completeness.",
        category: "Model",
        status: ExecutiveAutomationModel.executions.length === 5 ? "PASS" : "FAIL",
        metadataOnly: true,
      } as const),
    ] as const),
  );

export const validateAutomationPlatform = () =>
  buildResult(
    Object.freeze([
      Object.freeze({
        id: "automation-platform-immutable-exports",
        name: "Immutable Exports",
        description: "Validates immutable automation exports.",
        category: "Platform",
        status:
          Object.isFrozen(ExecutiveAutomationFoundation) &&
          Object.isFrozen(ExecutiveAutomationRegistry) &&
          Object.isFrozen(ExecutiveAutomationModel)
            ? "PASS"
            : "FAIL",
        metadataOnly: true,
      } as const),
      Object.freeze({
        id: "automation-platform-deterministic-metadata",
        name: "Deterministic Metadata",
        description: "Validates deterministic metadata outputs.",
        category: "Platform",
        status:
          ExecutiveAutomationFoundation.deterministic &&
          ExecutiveAutomationRegistry.deterministic &&
          ExecutiveAutomationModel.deterministic
            ? "PASS"
            : "FAIL",
        metadataOnly: true,
      } as const),
      Object.freeze({
        id: "automation-platform-readonly-structures",
        name: "Readonly Structures",
        description: "Validates readonly automation structures.",
        category: "Platform",
        status:
          ExecutiveAutomationRegistry.metadata.readonlyStatus === "Readonly" &&
          ExecutiveAutomationModel.metadata.readonlyStatus === "Readonly"
            ? "PASS"
            : "FAIL",
        metadataOnly: true,
      } as const),
      Object.freeze({
        id: "automation-platform-public-api-integrity",
        name: "Public API Integrity",
        description: "Validates public API integrity across automation layers.",
        category: "Platform",
        status:
          ExecutiveAutomationFoundation.contracts.all.length === 5 &&
          ExecutiveAutomationRegistry.metadata.supportedRuleCount === 6 &&
          ExecutiveAutomationModel.summary.ruleModelCount === 6
            ? "PASS"
            : "FAIL",
        metadataOnly: true,
      } as const),
      Object.freeze({
        id: "automation-platform-metadata-only-compliance",
        name: "Metadata-only Compliance",
        description: "Validates metadata-only compliance across automation layers.",
        category: "Platform",
        status:
          ExecutiveAutomationFoundation.metadataOnly &&
          ExecutiveAutomationRegistry.metadataOnly &&
          ExecutiveAutomationModel.metadataOnly
            ? "PASS"
            : "FAIL",
        metadataOnly: true,
      } as const),
    ] as const),
  );

export const validateExecutiveAutomationPlatform = () => {
  const checks = Object.freeze([
    ...validateAutomationFoundation().checks,
    ...validateAutomationRegistry().checks,
    ...validateAutomationModel().checks,
    ...validateAutomationPlatform().checks,
  ] as const);

  return buildResult(checks);
};

export const getAutomationValidationSummary = () =>
  Object.freeze({
    totalChecks: validateExecutiveAutomationPlatform().totalChecks,
    passedChecks: validateExecutiveAutomationPlatform().passedChecks,
    failedChecks: validateExecutiveAutomationPlatform().failedChecks,
    status: validateExecutiveAutomationPlatform().status,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const satisfies AutomationValidationSummary);
