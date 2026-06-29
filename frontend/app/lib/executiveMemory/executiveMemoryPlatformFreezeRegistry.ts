/**
 * APP-4:14 — Executive Memory Platform Freeze registries.
 * Immutable platform, public API, contract, compatibility, and extension registries.
 */

import { EXECUTIVE_MEMORY_PLATFORM_CERTIFICATION_CONTRACT_VERSION } from "./executiveMemoryPlatformCertificationConstants.ts";
import { EXECUTIVE_MEMORY_PLATFORM_PHASE_REGISTRY } from "./executiveMemoryPlatformCertificationConstants.ts";
import type {
  ExecutiveMemoryPlatformCompatibilityGuarantee,
  ExecutiveMemoryPlatformContractRegistryEntry,
  ExecutiveMemoryPlatformExtensionPoint,
  ExecutiveMemoryPlatformPublicApiEntry,
  ExecutiveMemoryPlatformRegistryEntry,
} from "./executiveMemoryPlatformFreezeTypes.ts";

export function buildExecutiveMemoryPlatformRegistry(): readonly ExecutiveMemoryPlatformRegistryEntry[] {
  const phases = [
    ...EXECUTIVE_MEMORY_PLATFORM_PHASE_REGISTRY,
    Object.freeze({
      phaseId: "APP-4/13",
      title: "Executive Memory Platform Certification",
      contractVersion: EXECUTIVE_MEMORY_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
    }),
  ];

  return Object.freeze(
    phases.map((phase) =>
      Object.freeze({
        phaseId: phase.phaseId,
        title: phase.title,
        contractVersion: phase.contractVersion,
        immutable: true as const,
        readOnly: true as const,
      })
    )
  );
}

export function buildExecutiveMemoryPlatformPublicApiRegistry(): readonly ExecutiveMemoryPlatformPublicApiEntry[] {
  const entries: ExecutiveMemoryPlatformPublicApiEntry[] = [
    Object.freeze({ apiId: "ExecutiveMemoryContract", category: "foundation", phaseId: "APP-4/1", readOnly: true as const }),
    Object.freeze({ apiId: "ExecutiveMemoryPlatform", category: "foundation", phaseId: "APP-4/1", readOnly: true as const }),
    Object.freeze({ apiId: "ExecutiveMemoryRegistry", category: "foundation", phaseId: "APP-4/1", readOnly: true as const }),
    Object.freeze({ apiId: "ExecutiveMemoryRecordContracts", category: "contracts", phaseId: "APP-4/2", readOnly: true as const }),
    Object.freeze({ apiId: "ExecutiveMemoryStorageEngine", category: "engine", phaseId: "APP-4/3", readOnly: true as const }),
    Object.freeze({ apiId: "ExecutiveMemoryStorageContracts", category: "contracts", phaseId: "APP-4/3", readOnly: true as const }),
    Object.freeze({ apiId: "ExecutiveMemoryRetrievalEngine", category: "engine", phaseId: "APP-4/4", readOnly: true as const }),
    Object.freeze({ apiId: "ExecutiveMemoryRetrievalContracts", category: "contracts", phaseId: "APP-4/4", readOnly: true as const }),
    Object.freeze({ apiId: "ExecutiveIntentMemoryLinkEngine", category: "engine", phaseId: "APP-4/5", readOnly: true as const }),
    Object.freeze({ apiId: "ExecutiveIntentMemoryLinkContracts", category: "contracts", phaseId: "APP-4/5", readOnly: true as const }),
    Object.freeze({ apiId: "ExecutiveScenarioMemoryEngine", category: "engine", phaseId: "APP-4/6", readOnly: true as const }),
    Object.freeze({ apiId: "ExecutiveScenarioMemoryContracts", category: "contracts", phaseId: "APP-4/6", readOnly: true as const }),
    Object.freeze({ apiId: "ExecutiveDecisionMemoryEngine", category: "engine", phaseId: "APP-4/7", readOnly: true as const }),
    Object.freeze({ apiId: "ExecutiveDecisionMemoryContracts", category: "contracts", phaseId: "APP-4/7", readOnly: true as const }),
    Object.freeze({ apiId: "ExecutiveContextMemoryEngine", category: "engine", phaseId: "APP-4/8", readOnly: true as const }),
    Object.freeze({ apiId: "ExecutiveContextMemoryContracts", category: "contracts", phaseId: "APP-4/8", readOnly: true as const }),
    Object.freeze({ apiId: "ExecutiveMemorySearchEngine", category: "engine", phaseId: "APP-4/9", readOnly: true as const }),
    Object.freeze({ apiId: "ExecutiveMemorySearchRankingContracts", category: "contracts", phaseId: "APP-4/9", readOnly: true as const }),
    Object.freeze({ apiId: "ExecutiveMemoryLifecycleEngine", category: "engine", phaseId: "APP-4/10", readOnly: true as const }),
    Object.freeze({ apiId: "ExecutiveMemoryLifecycleContracts", category: "contracts", phaseId: "APP-4/10", readOnly: true as const }),
    Object.freeze({ apiId: "ExecutiveAssistantMemoryIntegrationEngine", category: "engine", phaseId: "APP-4/11", readOnly: true as const }),
    Object.freeze({ apiId: "ExecutiveAssistantMemoryIntegrationContracts", category: "contracts", phaseId: "APP-4/11", readOnly: true as const }),
    Object.freeze({ apiId: "retrieveAssistantMemory", category: "assistant-api", phaseId: "APP-4/11", readOnly: true as const }),
    Object.freeze({ apiId: "ExecutiveMemoryDashboardEngine", category: "engine", phaseId: "APP-4/12", readOnly: true as const }),
    Object.freeze({ apiId: "ExecutiveMemoryDashboardContracts", category: "contracts", phaseId: "APP-4/12", readOnly: true as const }),
    Object.freeze({ apiId: "getExecutiveMemoryDashboard", category: "dashboard-api", phaseId: "APP-4/12", readOnly: true as const }),
    Object.freeze({ apiId: "ExecutiveMemoryPlatformCertificationRunner", category: "certification", phaseId: "APP-4/13", readOnly: true as const }),
    Object.freeze({ apiId: "runExecutiveMemoryPlatformRegression", category: "certification", phaseId: "APP-4/13", readOnly: true as const }),
  ];

  return Object.freeze(entries.sort((left, right) => left.apiId.localeCompare(right.apiId)));
}

export function buildExecutiveMemoryPlatformContractRegistry(): readonly ExecutiveMemoryPlatformContractRegistryEntry[] {
  const registry = buildExecutiveMemoryPlatformRegistry();
  return Object.freeze(
    registry.map((phase) =>
      Object.freeze({
        contractId: `${phase.phaseId.replace("/", "-").toLowerCase()}-contracts`,
        contractVersion: phase.contractVersion,
        phaseId: phase.phaseId,
        readOnly: true as const,
      })
    )
  );
}

export function buildExecutiveMemoryPlatformCompatibilityRegistry(): readonly ExecutiveMemoryPlatformCompatibilityGuarantee[] {
  return Object.freeze([
    Object.freeze({
      guaranteeId: "backward-compatibility",
      description: "Public interfaces extend only; breaking changes forbidden.",
      enforced: true as const,
      readOnly: true as const,
    }),
    Object.freeze({
      guaranteeId: "deterministic-behavior",
      description: "All platform operations produce deterministic, reproducible results.",
      enforced: true as const,
      readOnly: true as const,
    }),
    Object.freeze({
      guaranteeId: "metadata-compatibility",
      description: "Executive memory metadata schema remains compatible across releases.",
      enforced: true as const,
      readOnly: true as const,
    }),
    Object.freeze({
      guaranteeId: "schema-compatibility",
      description: "Record schema version APP-4/2 remains the canonical memory schema.",
      enforced: true as const,
      readOnly: true as const,
    }),
    Object.freeze({
      guaranteeId: "extension-compatibility",
      description: "Future extensions must register through approved extension points.",
      enforced: true as const,
      readOnly: true as const,
    }),
    Object.freeze({
      guaranteeId: "read-path-integrity",
      description: "Assistant reads flow APP-4:9 → APP-4:4 → APP-4:3 without direct storage access.",
      enforced: true as const,
      readOnly: true as const,
    }),
    Object.freeze({
      guaranteeId: "dashboard-read-only",
      description: "Dashboard layer remains read-only with no memory mutation.",
      enforced: true as const,
      readOnly: true as const,
    }),
  ]);
}

export function buildExecutiveMemoryPlatformExtensionRegistry(): readonly ExecutiveMemoryPlatformExtensionPoint[] {
  return Object.freeze([
    Object.freeze({
      extensionId: "executive-learning",
      label: "Executive Learning",
      description: "Future learning layer above frozen platform — registered only.",
      status: "registered" as const,
      readOnly: true as const,
    }),
    Object.freeze({
      extensionId: "recommendation-engine",
      label: "Recommendation Engine",
      description: "Future recommendation layer consuming frozen memory APIs.",
      status: "registered" as const,
      readOnly: true as const,
    }),
    Object.freeze({
      extensionId: "explainability-platform",
      label: "Explainability Platform",
      description: "Future explainability layer extending dashboard and assistant outputs.",
      status: "registered" as const,
      readOnly: true as const,
    }),
    Object.freeze({
      extensionId: "semantic-retrieval",
      label: "Semantic Retrieval",
      description: "Future semantic retrieval extension — not part of frozen APP-4:9.",
      status: "registered" as const,
      readOnly: true as const,
    }),
    Object.freeze({
      extensionId: "vector-memory",
      label: "Vector Memory",
      description: "Future vector memory extension — registered for future APP phases.",
      status: "registered" as const,
      readOnly: true as const,
    }),
    Object.freeze({
      extensionId: "executive-knowledge-graph",
      label: "Executive Knowledge Graph",
      description: "Future knowledge graph layer linking executive memory records.",
      status: "registered" as const,
      readOnly: true as const,
    }),
  ]);
}

export function buildExecutiveMemoryPlatformCertificationRegistry(): readonly string[] {
  return Object.freeze([
    "APP-4/13-platform-certification",
    "APP-4/13-regression-suite",
    "APP-4/13-compatibility-validation",
    "APP-4/14-platform-freeze",
    "APP-4/14-final-regression",
  ]);
}

export const ExecutiveMemoryPlatformFreezeRegistry = Object.freeze({
  buildExecutiveMemoryPlatformRegistry,
  buildExecutiveMemoryPlatformPublicApiRegistry,
  buildExecutiveMemoryPlatformContractRegistry,
  buildExecutiveMemoryPlatformCompatibilityRegistry,
  buildExecutiveMemoryPlatformExtensionRegistry,
  buildExecutiveMemoryPlatformCertificationRegistry,
});
