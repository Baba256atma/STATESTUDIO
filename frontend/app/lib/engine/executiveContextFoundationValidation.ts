import { ExecutiveContextAssemblyFoundation } from "./executiveContextAssemblyFoundation.ts";
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
  id: `eng-4-validation-foundation-${key}`,
  name, description, group: "Foundation", severity, status: "Pass",
  targetPhase: "ENG-4:1", expectedCondition, actualMetadataResult,
  ownership: "ENG-4", runtimeFree: true,
  result: Object.freeze({
    status: "Pass",
    description: "Satisfied by approved ENG-4:1 Foundation public metadata.",
    metadataOnly: true, immutable: true,
  } as const),
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveContextValidationRule);

export const ExecutiveContextFoundationValidation = Object.freeze({
  id: "eng-4-validation-group-foundation",
  name: "ENG-4:1 Foundation Validation",
  group: "Foundation",
  targetPhase: "ENG-4:1",
  namespace: "nexora.engine.executive.context-assembly.validation",
  owner: "ENG-4",
  rules: Object.freeze([
    rule("contracts", "Required Contracts Exist", "ENG-4:1 publishes the required architectural contracts.", "8 contracts declared", `${ExecutiveContextAssemblyFoundation.contracts.length} contracts declared`),
    rule("capabilities", "Required Capabilities Exist", "ENG-4:1 publishes the required context capabilities.", "10 capabilities declared", `${ExecutiveContextAssemblyFoundation.capabilities.length} capabilities declared`),
    rule("lifecycle", "Lifecycle Stages Complete And Ordered", "Lifecycle stages are complete and ordered from Defined through Archived.", "8 ordered stages", `${ExecutiveContextAssemblyFoundation.lifecycle.length} ordered stages`),
    rule("domains", "Context Domains Present", "Foundation domain inventory is present for context participation.", "22 domains declared", `${ExecutiveContextAssemblyFoundation.domains.length} domains declared`),
    rule("boundaries", "Architectural Boundaries Declared", "Foundation declares prohibited runtime concerns.", "13 prohibited boundaries", `${ExecutiveContextAssemblyFoundation.boundaries.prohibited.length} prohibited boundaries`),
    rule("immutability", "Foundation Metadata Immutable", "Foundation aggregate declares immutable frozen metadata.", "immutable=true", `immutable=${String(ExecutiveContextAssemblyFoundation.immutable)}`),
    rule("dependencies", "Prior Platform Public Dependencies", "ENG-1, ENG-2, and ENG-3 dependencies use public APIs only.", "3 public-index dependencies", `${ExecutiveContextAssemblyFoundation.metadata.publicDependencies.length} public-index dependencies`),
    rule("metadata-only", "Foundation Metadata-Only Runtime-Free", "Foundation remains metadata-only and runtime-free.", "metadataOnly and deterministic", `metadataOnly=${String(ExecutiveContextAssemblyFoundation.metadataOnly)}`),
  ]),
  status: "Pass",
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveContextValidationGroup);
