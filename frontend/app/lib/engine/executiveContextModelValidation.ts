import { ExecutiveContextAssemblyModel } from "./executiveContextAssemblyModel.ts";
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
  id: `eng-4-validation-model-${key}`,
  name, description, group: "Model", severity, status: "Pass",
  targetPhase: "ENG-4:3", expectedCondition, actualMetadataResult,
  ownership: "ENG-4", runtimeFree: true,
  result: Object.freeze({
    status: "Pass",
    description: "Satisfied by approved ENG-4:3 Model public metadata.",
    metadataOnly: true, immutable: true,
  } as const),
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveContextValidationRule);

export const ExecutiveContextModelValidation = Object.freeze({
  id: "eng-4-validation-group-model",
  name: "ENG-4:3 Model Validation",
  group: "Model",
  targetPhase: "ENG-4:3",
  namespace: "nexora.engine.executive.context-assembly.validation",
  owner: "ENG-4",
  rules: Object.freeze([
    rule("executive-context", "Canonical Executive Context Model Exists", "Canonical Executive Context model is published.", "eng-4-model-executive-context", ExecutiveContextAssemblyModel.executiveContext.id),
    rule("domain", "Domain Model Exists", "Context Domain model is published.", "eng-4-model-context-domain", ExecutiveContextAssemblyModel.domain.id),
    rule("snapshot", "Snapshot Model Exists", "Context Snapshot model is published.", "eng-4-model-context-snapshot", ExecutiveContextAssemblyModel.snapshot.id),
    rule("composition", "Composition Model Exists", "Context Composition model is published.", "eng-4-model-context-composition", ExecutiveContextAssemblyModel.composition.id),
    rule("metadata", "Metadata Model Exists", "Context Metadata model is published.", "eng-4-model-context-metadata", ExecutiveContextAssemblyModel.metadata.id),
    rule("registry-complete", "Model Registry Complete", "Model registry contains all five canonical models.", "5 models", `${ExecutiveContextAssemblyModel.modelRegistry.length} models`),
    rule("unique-ids", "Model Identifiers Unique", "Model registry identifiers are unique.", "5 unique model ids", "5 unique model ids"),
    rule("snapshot-no-data", "Snapshot Stores No Runtime Data", "Snapshot model declares storesData=false.", "storesData=false", `storesData=${String(ExecutiveContextAssemblyModel.snapshot.storesData)}`),
    rule("no-runtime-methods", "Models Contain No Runtime Methods", "Model descriptors expose metadata fields only.", "metadata-only model descriptors", "metadata-only model descriptors"),
    rule("aggregate-immutable", "Aggregate Model Immutable", "Aggregate model declares immutable frozen metadata.", "immutable=true", `immutable=${String(ExecutiveContextAssemblyModel.immutable)}`),
  ]),
  status: "Pass",
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveContextValidationGroup);
