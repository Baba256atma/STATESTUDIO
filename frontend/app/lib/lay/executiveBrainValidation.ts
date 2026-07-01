import { getExecutiveBrainConfiguration } from "./executiveBrainConfiguration.ts";
import { EXECUTIVE_BRAIN_CONTRACTS } from "./executiveBrainContracts.ts";
import { EXECUTIVE_BRAIN_PUBLIC_APIS, buildExecutiveBrainManifest } from "./executiveBrainManifest.ts";
import { getExecutiveBrainRegistry } from "./executiveBrainRegistry.ts";
import type { ExecutiveBrainValidationIssue, ExecutiveBrainValidationResult } from "./executiveBrainTypes.ts";

function validationIssue(code: string, field: string, message: string): ExecutiveBrainValidationIssue {
  return Object.freeze({ code, field, message, severity: "error" as const });
}

function validationResult(issues: readonly ExecutiveBrainValidationIssue[]): ExecutiveBrainValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze([...issues]) });
}

function hasUniqueValues(values: readonly string[]): boolean {
  return new Set(values).size === values.length;
}

function phasesAreOrdered(orders: readonly number[]): boolean {
  return orders.every((order, index) => order === index + 1);
}

export function validateExecutiveBrainFoundation(): ExecutiveBrainValidationResult {
  const issues: ExecutiveBrainValidationIssue[] = [];
  const registry = getExecutiveBrainRegistry();
  const configuration = getExecutiveBrainConfiguration();
  const manifest = buildExecutiveBrainManifest();

  if (registry.platform.layerIdentity !== "LAY" || registry.platform.version !== "LAY-1") {
    issues.push(validationIssue("invalid_platform", "platform", "Executive Brain platform metadata is invalid."));
  }
  if (registry.phases.length !== 12 || !hasUniqueValues(registry.phases.map((phase) => phase.id))) {
    issues.push(validationIssue("invalid_phase_registry", "phases", "Phase registry must contain unique LAY-1 through LAY-12 entries."));
  }
  if (!phasesAreOrdered(registry.phases.map((phase) => phase.order))) {
    issues.push(validationIssue("invalid_phase_order", "phases.order", "Phase registry order must be deterministic."));
  }
  if (registry.capabilities.length !== 10 || !hasUniqueValues(registry.capabilities.map((capability) => capability.id))) {
    issues.push(validationIssue("invalid_capability_registry", "capabilities", "Capability registry must contain unique future capabilities."));
  }
  if (!hasUniqueValues(registry.engines.map((engine) => engine.id)) || registry.engines.some((engine) => engine.implemented)) {
    issues.push(validationIssue("invalid_engine_registry", "engines", "Engine registry must contain names only and no implementations."));
  }
  if (registry.extensions.some((extension) => extension.enabled)) {
    issues.push(validationIssue("invalid_extension_registry", "extensions", "LAY-1 extensions must be disabled metadata only."));
  }
  if (!configuration.enabled || !configuration.strictMode || !configuration.validation || configuration.runtimeIntelligence) {
    issues.push(validationIssue("invalid_configuration", "configuration", "Configuration must be strict metadata-only foundation mode."));
  }
  if (!manifest.metadataOnly || manifest.runtimeIntelligence || manifest.publicApis.length !== EXECUTIVE_BRAIN_PUBLIC_APIS.length) {
    issues.push(validationIssue("invalid_manifest", "manifest", "Manifest must be complete and metadata-only."));
  }
  if (EXECUTIVE_BRAIN_CONTRACTS.some((contract) => !contract.immutable || contract.runtimeIntelligence)) {
    issues.push(validationIssue("invalid_contracts", "contracts", "Contracts must be immutable and contain no runtime intelligence."));
  }

  return validationResult(issues);
}
