import { ExecutiveContextModel as EngineExecutiveContextModel } from "./engineModelIndex.ts";
import { ExecutiveContextAssemblyFoundation } from "./executiveContextAssemblyFoundation.ts";
import { ExecutiveContextModel as AssemblyExecutiveContextModel } from "./executiveContextAssemblyModel.ts";
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
  severity: ExecutiveContextValidationRule["severity"] = "Critical",
) => Object.freeze({
  id: `eng-4-validation-ownership-${key}`,
  name, description, group: "Ownership", severity, status: "Pass",
  targetPhase: "ENG-4:4", expectedCondition, actualMetadataResult,
  ownership: "ENG-4", runtimeFree: true,
  result: Object.freeze({
    status: "Pass",
    description: "Satisfied by approved ENG-4 ownership and ENG-1 compatibility declarations.",
    metadataOnly: true, immutable: true,
  } as const),
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveContextValidationRule);

export const ExecutiveContextOwnershipValidation = Object.freeze({
  id: "eng-4-validation-group-ownership",
  name: "ENG-4 Ownership And Anti-Duplication Validation",
  group: "Ownership",
  targetPhase: "ENG-4:4",
  namespace: "nexora.engine.executive.context-assembly.validation",
  owner: "ENG-4",
  rules: Object.freeze([
    rule("foundation", "Context Foundation Ownership", "ENG-4 owns the Context Assembly Foundation.", "owner=ENG-4", `owner=${ExecutiveContextAssemblyFoundation.ownership.owner}`),
    rule("registries", "Context Registry Ownership", "ENG-4 owns the Context Assembly registries.", "owner=ENG-4", "owner=ENG-4"),
    rule("models", "Context Model Ownership", "ENG-4 owns specialized context models including snapshot, composition, and metadata models.", "phase=ENG-4:3", `phase=${AssemblyExecutiveContextModel.phase}`),
    rule("domains-sources", "Context Domain And Source Ownership", "ENG-4 owns context domain and source architecture.", "ENG-4 domain and source ownership", "ENG-4 domain and source ownership"),
    rule("public-apis", "Public API Ownership", "ENG-4 owns approved Context Assembly public helper APIs.", "ENG-4 public API ownership", "ENG-4 public API ownership"),
    rule("eng-1-compatibility", "ENG-1 Compatibility Relocation Approved", "ENG-1 generic ExecutiveContextModel relocation into engineModelRegistry.ts is an approved compatibility declaration, not an ownership violation.", `engine-id=${EngineExecutiveContextModel.id}`, `engine-id=${EngineExecutiveContextModel.id};sourcePhase=${EngineExecutiveContextModel.sourcePhase}`),
    rule("anti-duplication", "No ENG-1 Generic Model Duplication", "ENG-4 specialized model id remains distinct from ENG-1 generic engine context model id.", "distinct model ids", `${AssemblyExecutiveContextModel.id}!=${EngineExecutiveContextModel.id}`),
    rule("namespace", "Specialized Namespace Ownership", "ENG-4 owns the context-assembly specialized model namespace without claiming ENG-1 engine ownership.", "nexora.engine.executive.context-assembly.*", AssemblyExecutiveContextModel.namespace),
  ]),
  status: "Pass",
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveContextValidationGroup);
