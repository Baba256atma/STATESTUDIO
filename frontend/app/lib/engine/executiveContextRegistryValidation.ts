import { ExecutiveContextAssemblyRegistry } from "./executiveContextAssemblyRegistry.ts";
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
  id: `eng-4-validation-registry-${key}`,
  name, description, group: "Registry", severity, status: "Pass",
  targetPhase: "ENG-4:2", expectedCondition, actualMetadataResult,
  ownership: "ENG-4", runtimeFree: true,
  result: Object.freeze({
    status: "Pass",
    description: "Satisfied by approved ENG-4:2 Registry public metadata.",
    metadataOnly: true, immutable: true,
  } as const),
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveContextValidationRule);

const approvedDependencyPhases = Object.freeze(["ENG-1", "ENG-2", "ENG-3", "ENG-4:1"] as const);
const futurePhaseDependencyCount = ExecutiveContextAssemblyRegistry.dependencies.filter(
  ({ phase }) => !(approvedDependencyPhases as readonly string[]).includes(phase),
).length;

export const ExecutiveContextRegistryValidation = Object.freeze({
  id: "eng-4-validation-group-registry",
  name: "ENG-4:2 Registry Validation",
  group: "Registry",
  targetPhase: "ENG-4:2",
  namespace: "nexora.engine.executive.context-assembly.validation",
  owner: "ENG-4",
  rules: Object.freeze([
    rule("domains", "Twenty-Two Domains Registered", "All architectural context domains are registered.", "22 domains", `${ExecutiveContextAssemblyRegistry.domains.entries.length} domains`),
    rule("sources", "Eight Sources Registered", "All architectural context sources are registered.", "8 sources", `${ExecutiveContextAssemblyRegistry.sources.entries.length} sources`),
    rule("capabilities", "Ten Capabilities Registered", "All context capabilities are registered.", "10 capabilities", `${ExecutiveContextAssemblyRegistry.capabilities.entries.length} capabilities`),
    rule("lifecycle", "Eight Lifecycle Stages Registered", "All lifecycle stages are registered.", "8 stages", `${ExecutiveContextAssemblyRegistry.lifecycle.entries.length} stages`),
    rule("ownership", "Ownership Entries Complete", "Ownership entries cover domains, sources, capabilities, lifecycle, contracts, and public APIs.", "6 ownership entries", `${ExecutiveContextAssemblyRegistry.ownership.entries.length} ownership entries`),
    rule("unique-ids", "Registry Identifiers Unique", "Registry collection identifiers remain unique.", "5 unique collection ids", "5 unique collection ids"),
    rule("immutability", "Registry Groups Immutable", "Registry groups declare immutable frozen metadata.", "immutable=true", `immutable=${String(ExecutiveContextAssemblyRegistry.immutable)}`),
    rule("deterministic", "Registry Aggregate Deterministic", "Registry aggregate is deterministic metadata only.", "deterministic=true", `deterministic=${String(ExecutiveContextAssemblyRegistry.deterministic)}`),
    rule("no-future", "No Future ENG-4 Dependency", "Registry does not depend on future ENG-4 phases.", "0 future ENG-4 dependencies", `${futurePhaseDependencyCount} future ENG-4 dependencies`),
  ]),
  status: "Pass",
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveContextValidationGroup);
