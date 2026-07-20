/**
 * NEA-8:1 — Executive Gateway Suite Contracts.
 *
 * Immutable suite foundation contracts. Declarations only.
 *
 * Ownership: owned exclusively by NEA-8:1.
 */

import type { ExecutiveGatewaySuiteContractDeclaration } from "./executiveGatewaySuiteFoundationTypes.ts";

const contract = (
  key: string,
  contractName: string,
  description: string,
  fields: readonly string[],
  order: number,
): ExecutiveGatewaySuiteContractDeclaration =>
  Object.freeze({
    contractId: `NEA-8:1/Contract/${key}`,
    contractName,
    description,
    fields: Object.freeze([...fields]),
    metadataOnly: true as const,
    immutable: true as const,
    runtimeBehavior: "None" as const,
    deterministicOrder: order,
  });

/** Suite foundation contracts — exactly twelve. */
export const ExecutiveGatewaySuiteContracts: readonly ExecutiveGatewaySuiteContractDeclaration[] =
  Object.freeze([
    contract(
      "SuiteIdentity",
      "Suite Identity",
      "Canonical identity for the Executive Gateway Suite.",
      Object.freeze([
        "foundationId",
        "foundationVersion",
        "foundationNamespace",
        "suiteName",
        "status",
        "readiness",
      ]),
      1,
    ),
    contract(
      "SuiteComponent",
      "Suite Component",
      "Referenced NEA Public Index component identity and ownership.",
      Object.freeze([
        "componentId",
        "publicIndexId",
        "publicIndexVersion",
        "ownership",
      ]),
      2,
    ),
    contract(
      "SuiteComposition",
      "Suite Composition",
      "Ordered composition of NEA-1 through NEA-7 Public Indexes.",
      Object.freeze([
        "components",
        "componentCount",
        "deterministicOrder",
        "preservesCanonicalReferences",
      ]),
      3,
    ),
    contract(
      "SuiteDependency",
      "Suite Dependency",
      "Public-Index-only dependency declarations for NEA-1 through NEA-7.",
      Object.freeze([
        "publicIndexModule",
        "componentId",
        "publicIndexOnly",
        "canonicalPath",
      ]),
      4,
    ),
    contract(
      "SuiteCapability",
      "Suite Capability",
      "Architectural suite capability declarations without runtime execution.",
      Object.freeze([
        "capabilityId",
        "capabilityName",
        "description",
        "executesRuntime",
      ]),
      5,
    ),
    contract(
      "SuiteOwnership",
      "Suite Ownership",
      "Ownership and non-ownership declarations for suite composition.",
      Object.freeze(["owns", "doesNotOwn", "owner"]),
      6,
    ),
    contract(
      "SuiteBoundary",
      "Suite Boundary",
      "Explicit boundaries separating suite composition from runtime surfaces.",
      Object.freeze([
        "prohibitedSurfaces",
        "consumes",
        "provides",
        "runtimeEnforcement",
      ]),
      7,
    ),
    contract(
      "SuiteLifecycle",
      "Suite Lifecycle",
      "Declarative suite lifecycle states and transitions.",
      Object.freeze(["states", "transitions", "currentState"]),
      8,
    ),
    contract(
      "SuiteMetadata",
      "Suite Metadata",
      "Immutable suite metadata envelope for Foundation publication.",
      Object.freeze([
        "foundationId",
        "architectureVersion",
        "compositionMode",
        "inventorySummary",
      ]),
      9,
    ),
    contract(
      "SuiteVersion",
      "Suite Version",
      "Canonical suite and Foundation version declarations.",
      Object.freeze(["foundationVersion", "architectureVersion"]),
      10,
    ),
    contract(
      "SuiteReadiness",
      "Suite Readiness",
      "Foundation readiness for NEA-8:2 Registry.",
      Object.freeze(["status", "readiness", "nextPhase"]),
      11,
    ),
    contract(
      "SuiteSummary",
      "Suite Summary",
      "Deterministic suite Foundation summary derived from canonical collections.",
      Object.freeze([
        "componentCount",
        "capabilityCount",
        "contractCount",
        "publicApiInventoryTotal",
      ]),
      12,
    ),
  ]);

/** Canonical immutable suite contract catalog. */
export const ExecutiveGatewaySuiteContractCatalog = Object.freeze({
  catalogId: "NEA-8:1/SuiteContractCatalog",
  sourcePhase: "NEA-8:1" as const,
  contracts: ExecutiveGatewaySuiteContracts,
  contractCount: ExecutiveGatewaySuiteContracts.length,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
