import type { ExecutionMonitoringValidationCategory, ExecutionMonitoringValidationGroup, ExecutionMonitoringValidationRule } from "./executionMonitoringValidationTypes.ts";

const definitions = Object.freeze({
  Foundation: Object.freeze(["Contracts Present", "Registry Present", "Metadata Present"]),
  Registry: Object.freeze(["Target Registry Complete", "State Registry Complete", "Health Registry Complete", "Alert Registry Complete", "Metric Registry Complete", "Lifecycle Registry Complete", "Severity Registry Complete"]),
  Model: Object.freeze(["Target Model Complete", "State Model Complete", "Health Model Complete", "Alert Model Complete", "Metric Model Complete", "Snapshot Model Complete", "Policy Model Complete"]),
  Platform: Object.freeze(["Immutable Exports", "Deterministic Metadata", "Readonly Structures", "Public API Integrity", "Metadata-only Compliance"]),
} as const);

const slug = (value: string) => value.toLowerCase().replace(/[^a-z]+/g, "-").replace(/(^-|-$)/g, "");
const makeRules = (category: ExecutionMonitoringValidationCategory, names: readonly string[]) => Object.freeze(
  names.map((name) => Object.freeze({
    id: `execution-monitoring-${category.toLowerCase()}-${slug(name)}`,
    name,
    description: `Validates ${name.toLowerCase()} for the executive execution monitoring architecture.`,
    category,
    status: "PASS",
    metadataOnly: true,
  } as const satisfies ExecutionMonitoringValidationRule)),
);

const foundationRules = makeRules("Foundation", definitions.Foundation);
const registryRules = makeRules("Registry", definitions.Registry);
const modelRules = makeRules("Model", definitions.Model);
const platformRules = makeRules("Platform", definitions.Platform);

const makeGroup = (category: ExecutionMonitoringValidationCategory, rules: readonly ExecutionMonitoringValidationRule[]) => Object.freeze({
  id: `execution-monitoring-validation-${String(category).toLowerCase()}`,
  name: `${category} Validation Group`, category, rules,
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutionMonitoringValidationGroup);

export const ExecutionMonitoringValidationGroups = Object.freeze([
  makeGroup("Foundation", foundationRules), makeGroup("Registry", registryRules),
  makeGroup("Model", modelRules), makeGroup("Platform", platformRules),
]);

export const ExecutionMonitoringValidationRuleCatalog = Object.freeze([
  ...foundationRules, ...registryRules, ...modelRules, ...platformRules,
] as const);
