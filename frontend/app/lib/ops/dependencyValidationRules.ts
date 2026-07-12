import type {
  DependencyValidationGroup,
  DependencyValidationRule,
} from "./dependencyValidationTypes.ts";

const FoundationValidationRules = Object.freeze([
  Object.freeze({
    id: "dependency-foundation-contracts-present",
    name: "Contracts Present",
    description: "Validates dependency foundation contracts are available through the public API.",
    category: "Foundation",
    status: "PASS",
    metadataOnly: true,
  } as const satisfies DependencyValidationRule),
  Object.freeze({
    id: "dependency-foundation-registry-present",
    name: "Registry Present",
    description: "Validates dependency foundation registry is available through the public API.",
    category: "Foundation",
    status: "PASS",
    metadataOnly: true,
  } as const satisfies DependencyValidationRule),
  Object.freeze({
    id: "dependency-foundation-metadata-present",
    name: "Metadata Present",
    description: "Validates dependency foundation metadata is available through the public API.",
    category: "Foundation",
    status: "PASS",
    metadataOnly: true,
  } as const satisfies DependencyValidationRule),
] as const);

const RegistryValidationRules = Object.freeze([
  Object.freeze({
    id: "dependency-registry-entity-complete",
    name: "Entity Registry Complete",
    description: "Validates the entity registry catalog is structurally complete.",
    category: "Registry",
    status: "PASS",
    metadataOnly: true,
  } as const satisfies DependencyValidationRule),
  Object.freeze({
    id: "dependency-registry-relationship-complete",
    name: "Relationship Registry Complete",
    description: "Validates the relationship registry catalog is structurally complete.",
    category: "Registry",
    status: "PASS",
    metadataOnly: true,
  } as const satisfies DependencyValidationRule),
  Object.freeze({
    id: "dependency-registry-lifecycle-complete",
    name: "Lifecycle Registry Complete",
    description: "Validates the lifecycle registry catalog is structurally complete.",
    category: "Registry",
    status: "PASS",
    metadataOnly: true,
  } as const satisfies DependencyValidationRule),
] as const);

const ModelValidationRules = Object.freeze([
  Object.freeze({
    id: "dependency-model-node-complete",
    name: "Node Model Complete",
    description: "Validates the dependency node model is structurally complete.",
    category: "Model",
    status: "PASS",
    metadataOnly: true,
  } as const satisfies DependencyValidationRule),
  Object.freeze({
    id: "dependency-model-edge-complete",
    name: "Edge Model Complete",
    description: "Validates the dependency edge model is structurally complete.",
    category: "Model",
    status: "PASS",
    metadataOnly: true,
  } as const satisfies DependencyValidationRule),
  Object.freeze({
    id: "dependency-model-graph-complete",
    name: "Graph Model Complete",
    description: "Validates the dependency graph model is structurally complete.",
    category: "Model",
    status: "PASS",
    metadataOnly: true,
  } as const satisfies DependencyValidationRule),
  Object.freeze({
    id: "dependency-model-impact-complete",
    name: "Impact Model Complete",
    description: "Validates the dependency impact model is structurally complete.",
    category: "Model",
    status: "PASS",
    metadataOnly: true,
  } as const satisfies DependencyValidationRule),
] as const);

const PlatformValidationRules = Object.freeze([
  Object.freeze({
    id: "dependency-platform-immutable-exports",
    name: "Immutable Exports",
    description: "Validates immutable dependency platform exports.",
    category: "Platform",
    status: "PASS",
    metadataOnly: true,
  } as const satisfies DependencyValidationRule),
  Object.freeze({
    id: "dependency-platform-deterministic-metadata",
    name: "Deterministic Metadata",
    description: "Validates deterministic dependency platform metadata outputs.",
    category: "Platform",
    status: "PASS",
    metadataOnly: true,
  } as const satisfies DependencyValidationRule),
  Object.freeze({
    id: "dependency-platform-readonly-structures",
    name: "Readonly Structures",
    description: "Validates readonly dependency platform structures.",
    category: "Platform",
    status: "PASS",
    metadataOnly: true,
  } as const satisfies DependencyValidationRule),
  Object.freeze({
    id: "dependency-platform-public-api-integrity",
    name: "Public API Integrity",
    description: "Validates dependency platform public API integrity.",
    category: "Platform",
    status: "PASS",
    metadataOnly: true,
  } as const satisfies DependencyValidationRule),
  Object.freeze({
    id: "dependency-platform-metadata-only-compliance",
    name: "Metadata-only Compliance",
    description: "Validates metadata-only compliance across the dependency platform.",
    category: "Platform",
    status: "PASS",
    metadataOnly: true,
  } as const satisfies DependencyValidationRule),
] as const);

export const DependencyValidationGroups = Object.freeze([
  Object.freeze({
    id: "dependency-validation-foundation",
    name: "Foundation Validation Group",
    category: "Foundation",
    rules: FoundationValidationRules,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const satisfies DependencyValidationGroup),
  Object.freeze({
    id: "dependency-validation-registry",
    name: "Registry Validation Group",
    category: "Registry",
    rules: RegistryValidationRules,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const satisfies DependencyValidationGroup),
  Object.freeze({
    id: "dependency-validation-model",
    name: "Model Validation Group",
    category: "Model",
    rules: ModelValidationRules,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const satisfies DependencyValidationGroup),
  Object.freeze({
    id: "dependency-validation-platform",
    name: "Platform Validation Group",
    category: "Platform",
    rules: PlatformValidationRules,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const satisfies DependencyValidationGroup),
] as const);

export const DependencyValidationRuleCatalog = Object.freeze([
  ...FoundationValidationRules,
  ...RegistryValidationRules,
  ...ModelValidationRules,
  ...PlatformValidationRules,
] as const satisfies readonly DependencyValidationRule[]);
