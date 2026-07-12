import type {
  PublicApiMetadata,
  ResourceCapability,
  ResourceMetadata,
} from "./resourceIntelligenceTypes.ts";
import { ResourceIntelligenceIdentity } from "./resourceIntelligenceIdentity.ts";

const resourceMetadata = Object.freeze({
  platformId: ResourceIntelligenceIdentity.platformId,
  platformVersion: ResourceIntelligenceIdentity.platformVersion,
  releaseStage: "Draft",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  sourceDependencies: Object.freeze([
    "OPS-1:9",
    "OPS-2:9",
    "OPS-3:9",
    "OPS-4:9",
  ]),
  tags: Object.freeze(["ops", "resource-intelligence", "metadata-only"]),
} as const satisfies ResourceMetadata);

export const HumanResourceContract = Object.freeze({
  id: "resource-human",
  name: "Human Resource",
  description: "Canonical metadata contract for individual human resource descriptors.",
  category: "Human",
  status: "Defined",
  metadata: resourceMetadata,
} as const satisfies ResourceCapability);

export const AIResourceContract = Object.freeze({
  id: "resource-ai",
  name: "AI Resource",
  description: "Canonical metadata contract for AI agent and autonomous support descriptors.",
  category: "AIAgent",
  status: "Defined",
  metadata: resourceMetadata,
} as const satisfies ResourceCapability);

export const SoftwareResourceContract = Object.freeze({
  id: "resource-software",
  name: "Software Resource",
  description: "Canonical metadata contract for software resource descriptors.",
  category: "Software",
  status: "Defined",
  metadata: resourceMetadata,
} as const satisfies ResourceCapability);

export const InfrastructureResourceContract = Object.freeze({
  id: "resource-infrastructure",
  name: "Infrastructure Resource",
  description: "Canonical metadata contract for infrastructure and platform resource descriptors.",
  category: "CloudResource",
  status: "Defined",
  metadata: resourceMetadata,
} as const satisfies ResourceCapability);

export const FinancialResourceContract = Object.freeze({
  id: "resource-financial",
  name: "Financial Resource",
  description: "Canonical metadata contract for budgetary and financial resource descriptors.",
  category: "Budget",
  status: "Defined",
  metadata: resourceMetadata,
} as const satisfies ResourceCapability);

export const PhysicalResourceContract = Object.freeze({
  id: "resource-physical",
  name: "Physical Resource",
  description: "Canonical metadata contract for physical equipment and facility resource descriptors.",
  category: "Equipment",
  status: "Defined",
  metadata: resourceMetadata,
} as const satisfies ResourceCapability);

export const DigitalResourceContract = Object.freeze({
  id: "resource-digital",
  name: "Digital Resource",
  description: "Canonical metadata contract for digital systems, APIs, and database resources.",
  category: "API",
  status: "Defined",
  metadata: resourceMetadata,
} as const satisfies ResourceCapability);

export const ExternalResourceContract = Object.freeze({
  id: "resource-external",
  name: "External Resource",
  description: "Canonical metadata contract for vendor, service, and partner-provided resource descriptors.",
  category: "Vendor",
  status: "Defined",
  metadata: resourceMetadata,
} as const satisfies ResourceCapability);

export const SharedResourceContract = Object.freeze({
  id: "resource-shared",
  name: "Shared Resource",
  description: "Canonical metadata contract for resources shared across multiple work contexts.",
  category: "Team",
  status: "Cataloged",
  metadata: resourceMetadata,
} as const satisfies ResourceCapability);

export const DedicatedResourceContract = Object.freeze({
  id: "resource-dedicated",
  name: "Dedicated Resource",
  description: "Canonical metadata contract for resources dedicated to a single execution scope.",
  category: "Workspace",
  status: "Cataloged",
  metadata: resourceMetadata,
} as const satisfies ResourceCapability);

export const CriticalResourceContract = Object.freeze({
  id: "resource-critical",
  name: "Critical Resource",
  description: "Canonical metadata contract for critical-path resource descriptors.",
  category: "Time",
  status: "Cataloged",
  metadata: resourceMetadata,
} as const satisfies ResourceCapability);

export const OptionalResourceContract = Object.freeze({
  id: "resource-optional",
  name: "Optional Resource",
  description: "Canonical metadata contract for optional or contingency resource descriptors.",
  category: "Inventory",
  status: "Cataloged",
  metadata: resourceMetadata,
} as const satisfies ResourceCapability);

export const ResourceIntelligenceContracts = Object.freeze({
  human: HumanResourceContract,
  ai: AIResourceContract,
  software: SoftwareResourceContract,
  infrastructure: InfrastructureResourceContract,
  financial: FinancialResourceContract,
  physical: PhysicalResourceContract,
  digital: DigitalResourceContract,
  external: ExternalResourceContract,
  shared: SharedResourceContract,
  dedicated: DedicatedResourceContract,
  critical: CriticalResourceContract,
  optional: OptionalResourceContract,
  all: Object.freeze([
    HumanResourceContract,
    AIResourceContract,
    SoftwareResourceContract,
    InfrastructureResourceContract,
    FinancialResourceContract,
    PhysicalResourceContract,
    DigitalResourceContract,
    ExternalResourceContract,
    SharedResourceContract,
    DedicatedResourceContract,
    CriticalResourceContract,
    OptionalResourceContract,
  ]),
} as const);

export const ResourceIntelligencePublicApis = Object.freeze([
  Object.freeze({
    name: "ExecutiveResourceIntelligenceFoundation",
    exportPath: "./resourceIntelligenceIndex.ts",
    kind: "Object",
    stability: "Stable",
    description: "Immutable namespace for resource intelligence foundation.",
  } as const satisfies PublicApiMetadata),
  Object.freeze({
    name: "buildResourceIntelligenceManifest",
    exportPath: "./resourceIntelligenceIndex.ts",
    kind: "Function",
    stability: "Stable",
    description: "Deterministic manifest builder for resource intelligence metadata.",
  } as const satisfies PublicApiMetadata),
  Object.freeze({
    name: "validateResourceIntelligenceFoundation",
    exportPath: "./resourceIntelligenceIndex.ts",
    kind: "Function",
    stability: "Stable",
    description: "Architectural integrity validator for resource intelligence metadata.",
  } as const satisfies PublicApiMetadata),
] as const);

