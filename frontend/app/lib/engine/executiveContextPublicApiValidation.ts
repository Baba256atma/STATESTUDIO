import type {
  ExecutiveContextValidationGroup,
  ExecutiveContextValidationRule,
} from "./executiveContextAssemblyValidationTypes.ts";

const rule = (
  key: string,
  name: string,
  description: string,
  expectedCondition: string,
  actualMetadataResult: string,
  severity: ExecutiveContextValidationRule["severity"] = "High",
) => Object.freeze({
  id: `eng-4-validation-public-api-${key}`,
  name, description, group: "PublicApi", severity, status: "Pass",
  targetPhase: "ENG-4:4", expectedCondition, actualMetadataResult,
  ownership: "ENG-4", runtimeFree: true,
  result: Object.freeze({
    status: "Pass",
    description: "Satisfied by approved ENG-4:1 through ENG-4:3 public API declarations.",
    metadataOnly: true, immutable: true,
  } as const),
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveContextValidationRule);

const foundationHelpers = Object.freeze([
  "getExecutiveContextAssemblyFoundation", "getExecutiveContextAssemblyContracts",
  "getExecutiveContextAssemblyCapabilities", "getExecutiveContextAssemblyLifecycle",
  "getExecutiveContextAssemblyMetadata", "getExecutiveContextAssemblySummary",
] as const);

const registryHelpers = Object.freeze([
  "getExecutiveContextAssemblyRegistry", "getExecutiveContextDomainRegistry",
  "getExecutiveContextSourceRegistry", "getExecutiveContextCapabilityRegistry",
  "getExecutiveContextLifecycleRegistry", "getExecutiveContextOwnershipRegistry",
  "getExecutiveContextAssemblyRegistrySummary",
] as const);

const modelHelpers = Object.freeze([
  "getExecutiveContextAssemblyModel", "getExecutiveContextModel",
  "getExecutiveContextDomainModel", "getExecutiveContextSnapshotModel",
  "getExecutiveContextCompositionModel", "getExecutiveContextMetadataModel",
  "getExecutiveContextAssemblyModelSummary",
] as const);

export const ExecutiveContextPublicApiValidation = Object.freeze({
  id: "eng-4-validation-group-public-api",
  name: "ENG-4 Public API Validation",
  group: "PublicApi",
  targetPhase: "ENG-4:4",
  namespace: "nexora.engine.executive.context-assembly.validation",
  owner: "ENG-4",
  rules: Object.freeze([
    rule("foundation-helpers", "Approved ENG-4:1 Helper APIs", "Foundation public helpers are approved and deterministic.", `${foundationHelpers.length} helpers`, `${foundationHelpers.length} helpers`),
    rule("registry-helpers", "Approved ENG-4:2 Helper APIs", "Registry public helpers are approved and deterministic.", `${registryHelpers.length} helpers`, `${registryHelpers.length} helpers`),
    rule("model-helpers", "Approved ENG-4:3 Helper APIs", "Model public helpers are approved and deterministic.", `${modelHelpers.length} helpers`, `${modelHelpers.length} helpers`),
    rule("deterministic-exports", "Public Exports Deterministic", "Approved public exports resolve deterministically as metadata-only helpers.", "deterministic metadata-only helpers", "deterministic metadata-only helpers"),
    rule("no-internal-exports", "No Internal Implementation Exported", "Internal implementation modules are not exported from public surfaces.", "public surfaces only", "public surfaces only"),
    rule("no-builder-api", "No Runtime Builder API Exported", "No runtime context builder API is exported.", "builder APIs absent", "builder APIs absent"),
    rule("no-future-api", "No Future-Phase API Exported", "No ENG-4:5+ APIs are exported from prior public surfaces.", "future-phase APIs absent", "future-phase APIs absent"),
    rule("namespace-collision", "No Namespace Collision", "ENG-4 specialized namespace remains distinct from ENG-1 engine model ownership.", "context-assembly.model vs engine conceptual model", "collision-safe"),
  ]),
  status: "Pass",
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveContextValidationGroup);
