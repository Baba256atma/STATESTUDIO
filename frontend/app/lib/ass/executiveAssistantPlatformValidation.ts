/**
 * ASS-1 — Executive Assistant Platform validation.
 */

import {
  ASS_ARCHITECTURE_STACK,
  ASS_CAPABILITY_KEYS,
  ASS_CONVERSATION_SCOPE_KEYS,
  ASS_EXTENSION_POINT_KEYS,
  ASS_FUTURE_DEPENDENCY_RULES,
  ASS_INTEGRATION_KEYS,
  ASS_PLATFORM_CONTRACT_VERSION,
  ASS_PLATFORM_MUST_NOT_OWN,
  ASS_PLATFORM_MUST_OWN,
  ASS_PLATFORM_PRINCIPLES,
  ASS_UPSTREAM_PLATFORM_KEYS,
  ASS_VERSION_PATTERN,
} from "./executiveAssistantPlatformContracts.ts";
import {
  getExecutiveAssistantPlatformIdentity,
  getExecutiveAssistantPlatformRegistry,
  isExecutiveAssistantPlatformIdentityImmutable,
} from "./executiveAssistantPlatformRegistry.ts";
import type {
  ExecutiveAssistantPlatformBoundaries,
  ExecutiveAssistantPlatformManifest,
  ExecutiveAssistantPlatformValidationIssue,
  ExecutiveAssistantPlatformValidationReport,
} from "./executiveAssistantPlatformTypes.ts";

export const ASS_PLATFORM_BOUNDARIES: ExecutiveAssistantPlatformBoundaries = Object.freeze({
  owns: ASS_PLATFORM_MUST_OWN,
  doesNotOwn: ASS_PLATFORM_MUST_NOT_OWN,
  readOnly: true as const,
});

export function getExecutiveAssistantPlatformBoundaries(): ExecutiveAssistantPlatformBoundaries {
  return ASS_PLATFORM_BOUNDARIES;
}

export function getExecutiveAssistantPlatformPositionStatement() {
  return Object.freeze({
    assistantIsNot: Object.freeze([
      "an_intelligence_layer",
      "an_llm_orchestrator",
      "a_knowledge_generator",
      "a_mental_model_engine",
      "a_recommendation_engine",
      "a_governance_authority",
      "a_runtime_execution_layer",
    ]),
    assistantIs: Object.freeze([
      "orchestration_layer_over_certified_platforms",
      "conversation_architecture_publisher",
      "capability_and_integration_metadata_registry",
      "consumer_of_app_llm_smm_certified_outputs",
      "publisher_of_assistant_contracts_for_future_idn_and_lay",
    ]),
    readOnly: true as const,
  });
}

function issue(code: string, message: string): ExecutiveAssistantPlatformValidationIssue {
  return Object.freeze({ code, message, readOnly: true as const });
}

function report(issues: ExecutiveAssistantPlatformValidationIssue[]): ExecutiveAssistantPlatformValidationReport {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function validateExecutiveAssistantPlatformBoundaries(): readonly ExecutiveAssistantPlatformValidationIssue[] {
  const issues: ExecutiveAssistantPlatformValidationIssue[] = [];
  if (ASS_PLATFORM_BOUNDARIES.owns.length === 0) {
    issues.push(issue("empty_owns", "Platform must declare owned responsibilities."));
  }
  if (ASS_PLATFORM_BOUNDARIES.doesNotOwn.length === 0) {
    issues.push(issue("empty_does_not_own", "Platform must declare excluded responsibilities."));
  }
  const overlap = ASS_PLATFORM_BOUNDARIES.owns.filter((item) =>
    (ASS_PLATFORM_BOUNDARIES.doesNotOwn as readonly string[]).includes(item)
  );
  if (overlap.length > 0) {
    issues.push(issue("boundary_overlap", `Owns and does-not-own lists overlap: ${overlap.join(", ")}`));
  }
  return Object.freeze(issues);
}

export function validateExecutiveAssistantPlatformIdentity(): ExecutiveAssistantPlatformValidationReport {
  const issues: ExecutiveAssistantPlatformValidationIssue[] = [];
  const identity = getExecutiveAssistantPlatformIdentity();
  if (!isExecutiveAssistantPlatformIdentityImmutable()) {
    issues.push(issue("identity_mutable", "Platform identity must be immutable."));
  }
  if (identity.layerId !== "ASS") {
    issues.push(issue("invalid_layer_id", "Platform layer ID must be ASS."));
  }
  if (identity.version !== ASS_PLATFORM_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "Platform identity version must be ASS/1."));
  }
  return report(issues);
}

export function validateExecutiveAssistantRegistryCompleteness(
  initialized: boolean
): ExecutiveAssistantPlatformValidationReport {
  const issues: ExecutiveAssistantPlatformValidationIssue[] = [];
  if (!initialized) {
    issues.push(issue("not_initialized", "Platform foundation has not been initialized."));
    return report(issues);
  }
  const registry = getExecutiveAssistantPlatformRegistry();
  if (registry.capabilities.length !== ASS_CAPABILITY_KEYS.length) {
    issues.push(issue("capability_registry_incomplete", "Capability registry is incomplete."));
  }
  if (registry.integrations.length !== ASS_INTEGRATION_KEYS.length) {
    issues.push(issue("integration_registry_incomplete", "Integration registry is incomplete."));
  }
  if (registry.conversationScopes.length !== ASS_CONVERSATION_SCOPE_KEYS.length) {
    issues.push(issue("conversation_scope_registry_incomplete", "Conversation scope registry is incomplete."));
  }
  if (registry.extensions.length !== ASS_EXTENSION_POINT_KEYS.length) {
    issues.push(issue("extension_registry_incomplete", "Extension registry is incomplete."));
  }
  if (registry.manifests.length === 0) {
    issues.push(issue("manifest_registry_incomplete", "Manifest registry is incomplete."));
  }
  return report(issues);
}

export function validateExecutiveAssistantManifestConsistency(
  manifest: ExecutiveAssistantPlatformManifest
): ExecutiveAssistantPlatformValidationReport {
  const issues: ExecutiveAssistantPlatformValidationIssue[] = [];
  if (manifest.version !== ASS_PLATFORM_CONTRACT_VERSION) {
    issues.push(issue("manifest_version_mismatch", "Manifest version must be ASS/1."));
  }
  if (manifest.capabilityKeys.length !== ASS_CAPABILITY_KEYS.length) {
    issues.push(issue("manifest_capability_mismatch", "Manifest capability keys are incomplete."));
  }
  if (manifest.integrationKeys.length !== ASS_INTEGRATION_KEYS.length) {
    issues.push(issue("manifest_integration_mismatch", "Manifest integration keys are incomplete."));
  }
  if (!manifest.upstreamPlatforms.includes("SMM")) {
    issues.push(issue("manifest_upstream_missing", "Manifest must declare SMM upstream consumption."));
  }
  return report(issues);
}

export function validateExecutiveAssistantExtensionCompatibility(): ExecutiveAssistantPlatformValidationReport {
  const issues: ExecutiveAssistantPlatformValidationIssue[] = [];
  const registry = getExecutiveAssistantPlatformRegistry();
  for (const extension of registry.extensions) {
    if (!(ASS_EXTENSION_POINT_KEYS as readonly string[]).includes(extension.extensionKey)) {
      issues.push(issue("invalid_extension", `Unknown extension key: ${extension.extensionKey}`));
    }
  }
  const upstreamIntegrations = registry.integrations.filter((entry) => !entry.futureReady);
  for (const platform of ASS_UPSTREAM_PLATFORM_KEYS) {
    if (platform === "CORE" || platform === "KNL") {
      continue;
    }
    if (!upstreamIntegrations.some((entry) => entry.integrationKey === platform)) {
      issues.push(issue("integration_missing", `Missing integration for ${platform}.`));
    }
  }
  return report(issues);
}

export function validateExecutiveAssistantDependencyIntegrity(): ExecutiveAssistantPlatformValidationReport {
  const issues: ExecutiveAssistantPlatformValidationIssue[] = [];
  const assIndex = ASS_ARCHITECTURE_STACK.indexOf("ASS");
  const smmIndex = ASS_ARCHITECTURE_STACK.indexOf("SMM");
  const llmIndex = ASS_ARCHITECTURE_STACK.indexOf("LLM");
  const idnIndex = ASS_ARCHITECTURE_STACK.indexOf("IDN");
  if (assIndex <= smmIndex || assIndex >= idnIndex) {
    issues.push(issue("dependency_chain_invalid", "ASS must sit after SMM and before IDN in architecture stack."));
  }
  if (llmIndex >= assIndex) {
    issues.push(issue("dependency_chain_invalid", "LLM must precede ASS in architecture stack."));
  }
  const enforcedRules = ASS_FUTURE_DEPENDENCY_RULES.filter((rule) => rule.enforced);
  if (enforcedRules.length < 6) {
    issues.push(issue("dependency_rules_incomplete", "Future dependency rules are incomplete."));
  }
  return report(issues);
}

export function validateExecutiveAssistantVersionMetadata(): ExecutiveAssistantPlatformValidationReport {
  const issues: ExecutiveAssistantPlatformValidationIssue[] = [];
  if (!ASS_VERSION_PATTERN.test(ASS_PLATFORM_CONTRACT_VERSION)) {
    issues.push(issue("invalid_version_format", "Contract version must match ASS/N pattern."));
  }
  if (!ASS_PLATFORM_PRINCIPLES.includes("orchestration_layer_not_intelligence_layer")) {
    issues.push(issue("principles_incomplete", "Orchestration principle is missing."));
  }
  return report(issues);
}

export function validateExecutiveAssistantPlatformContracts(
  initialized: boolean,
  manifest: ExecutiveAssistantPlatformManifest
): ExecutiveAssistantPlatformValidationReport {
  const issues: ExecutiveAssistantPlatformValidationIssue[] = [
    ...validateExecutiveAssistantPlatformBoundaries(),
    ...validateExecutiveAssistantPlatformIdentity().issues,
    ...validateExecutiveAssistantRegistryCompleteness(initialized).issues,
    ...validateExecutiveAssistantManifestConsistency(manifest).issues,
    ...validateExecutiveAssistantExtensionCompatibility().issues,
    ...validateExecutiveAssistantDependencyIntegrity().issues,
    ...validateExecutiveAssistantVersionMetadata().issues,
  ];
  return report(issues);
}
