import { ExecutiveContextAssemblyBoundaries } from "./executiveContextAssemblyBoundaries.ts";
import { ExecutiveContextAssemblyCapabilities } from "./executiveContextAssemblyCapabilities.ts";
import { ExecutiveContextAssemblyContracts } from "./executiveContextAssemblyContracts.ts";
import { ExecutiveContextAssemblyLifecycle } from "./executiveContextAssemblyLifecycle.ts";
import { ExecutiveContextAssemblyMetadata } from "./executiveContextAssemblyMetadata.ts";

const domain = (id: string, name: string, description: string) => Object.freeze({
  id, name, description, status: "Defined", metadataOnly: true, immutable: true,
} as const);

export const ExecutiveContextAssemblyDomains = Object.freeze([
  domain("eng-4-domain-workspace", "Workspace", "Workspace participation metadata eligible for executive context."),
  domain("eng-4-domain-organization", "Organization", "Organization participation metadata eligible for executive context."),
  domain("eng-4-domain-user", "User", "User participation metadata eligible for executive context."),
  domain("eng-4-domain-role", "Role", "Role participation metadata eligible for executive context."),
  domain("eng-4-domain-business", "Business", "Business participation metadata eligible for executive context."),
  domain("eng-4-domain-strategy", "Strategy", "Strategy participation metadata eligible for executive context."),
  domain("eng-4-domain-kpi", "KPI", "KPI participation metadata eligible for executive context."),
  domain("eng-4-domain-okr", "OKR", "OKR participation metadata eligible for executive context."),
  domain("eng-4-domain-revenue", "Revenue", "Revenue participation metadata eligible for executive context."),
  domain("eng-4-domain-finance", "Finance", "Finance participation metadata eligible for executive context."),
  domain("eng-4-domain-resource", "Resource", "Resource participation metadata eligible for executive context."),
  domain("eng-4-domain-project", "Project", "Project participation metadata eligible for executive context."),
  domain("eng-4-domain-workflow", "Workflow", "Workflow participation metadata eligible for executive context."),
  domain("eng-4-domain-task", "Task", "Task participation metadata eligible for executive context."),
  domain("eng-4-domain-schedule", "Schedule", "Schedule participation metadata eligible for executive context."),
  domain("eng-4-domain-dependency", "Dependency", "Dependency participation metadata eligible for executive context."),
  domain("eng-4-domain-risk", "Risk", "Risk participation metadata eligible for executive context."),
  domain("eng-4-domain-dataset", "Dataset", "Dataset participation metadata eligible for executive context."),
  domain("eng-4-domain-external-source", "External Source", "External source participation metadata eligible for executive context."),
  domain("eng-4-domain-time", "Time", "Time participation metadata eligible for executive context."),
  domain("eng-4-domain-filter", "Filter", "Filter participation metadata eligible for executive context."),
  domain("eng-4-domain-scenario", "Scenario", "Scenario participation metadata eligible for executive context."),
] as const);

export const ExecutiveContextAssemblyOwnership = Object.freeze({
  owner: "ENG-4",
  platform: "Executive Context Assembly Platform",
  foundationPhase: "ENG-4:1",
  consumes: Object.freeze(["ENG-1", "ENG-2", "ENG-3"] as const),
  owns: Object.freeze([
    "Context contracts", "Context domains", "Context ownership", "Context lifecycle",
    "Context capabilities", "Context boundaries", "Context metadata", "Public architectural APIs",
  ] as const),
  receives: "Already-resolved executive intent from ENG-3",
  produces: "Architectural foundation for Executive Context Assembly",
  metadataOnly: true, immutable: true, deterministic: true,
} as const);

export const ExecutiveContextAssemblyFoundation = Object.freeze({
  contracts: ExecutiveContextAssemblyContracts,
  domains: ExecutiveContextAssemblyDomains,
  ownership: ExecutiveContextAssemblyOwnership,
  capabilities: ExecutiveContextAssemblyCapabilities,
  lifecycle: ExecutiveContextAssemblyLifecycle,
  boundaries: ExecutiveContextAssemblyBoundaries,
  metadata: ExecutiveContextAssemblyMetadata,
  metadataOnly: true, immutable: true, deterministic: true,
} as const);

const foundationSummary = Object.freeze({
  platformId: ExecutiveContextAssemblyMetadata.platformId,
  name: ExecutiveContextAssemblyMetadata.name,
  version: ExecutiveContextAssemblyMetadata.version,
  phase: ExecutiveContextAssemblyMetadata.phase,
  namespace: ExecutiveContextAssemblyMetadata.namespace,
  owner: ExecutiveContextAssemblyMetadata.owner,
  status: ExecutiveContextAssemblyMetadata.status,
  contractCount: ExecutiveContextAssemblyContracts.length,
  domainCount: ExecutiveContextAssemblyDomains.length,
  capabilityCount: ExecutiveContextAssemblyCapabilities.length,
  lifecycleStageCount: ExecutiveContextAssemblyLifecycle.length,
  boundaryCount: ExecutiveContextAssemblyBoundaries.prohibited.length,
  dependencyCount: ExecutiveContextAssemblyMetadata.publicDependencies.length,
  nextPhase: ExecutiveContextAssemblyMetadata.nextPhase,
  registryReady: true,
  metadataOnly: true, immutable: true, deterministic: true,
} as const);

export { ExecutiveContextAssemblyBoundaries } from "./executiveContextAssemblyBoundaries.ts";
export { ExecutiveContextAssemblyCapabilities } from "./executiveContextAssemblyCapabilities.ts";
export { ExecutiveContextAssemblyContracts } from "./executiveContextAssemblyContracts.ts";
export { ExecutiveContextAssemblyLifecycle } from "./executiveContextAssemblyLifecycle.ts";
export { ExecutiveContextAssemblyMetadata } from "./executiveContextAssemblyMetadata.ts";

export const getExecutiveContextAssemblyFoundation = () => ExecutiveContextAssemblyFoundation;
export const getExecutiveContextAssemblyContracts = () => ExecutiveContextAssemblyContracts;
export const getExecutiveContextAssemblyCapabilities = () => ExecutiveContextAssemblyCapabilities;
export const getExecutiveContextAssemblyLifecycle = () => ExecutiveContextAssemblyLifecycle;
export const getExecutiveContextAssemblyMetadata = () => ExecutiveContextAssemblyMetadata;
export const getExecutiveContextAssemblySummary = () => foundationSummary;
