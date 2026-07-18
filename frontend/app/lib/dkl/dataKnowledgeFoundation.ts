/**
 * DKL-1:1 — Data Knowledge Layer Foundation.
 *
 * Canonical, immutable, metadata-only foundation for the Nexora Data Knowledge
 * Layer (DKL). DKL sits between the Executive Gateway (NEA) and the Executive
 * Engine, transforming normalized organizational information into structured
 * organizational knowledge.
 *
 * This module publishes exactly seven public APIs and contains zero runtime
 * behavior: no I/O, no network, no database access, no parsing, no AI, no
 * async, and no side effects.
 */

import { DataKnowledgeFoundationContracts } from "./dataKnowledgeFoundationContract.ts";
import { DataKnowledgeFoundationDependencies } from "./dataKnowledgeFoundationDependencies.ts";
import { DataKnowledgeFoundationIdentity } from "./dataKnowledgeFoundationIdentity.ts";
import { DataKnowledgeFoundationOwnership } from "./dataKnowledgeFoundationOwnership.ts";
import type {
  DataKnowledgeFoundationDescriptor,
  DataKnowledgeFoundationSummary,
} from "./dataKnowledgeFoundationTypes.ts";

export {
  DataKnowledgeFoundationContracts,
  DataKnowledgeFoundationDependencies,
  DataKnowledgeFoundationIdentity,
  DataKnowledgeFoundationOwnership,
};

export const DataKnowledgeFoundation = Object.freeze({
  identity: DataKnowledgeFoundationIdentity,
  ownership: DataKnowledgeFoundationOwnership,
  dependencies: DataKnowledgeFoundationDependencies,
  contracts: DataKnowledgeFoundationContracts,
  boundaries: DataKnowledgeFoundationContracts.boundaries,
  metadata: Object.freeze({
    purpose:
      "Canonical metadata-only foundation that transforms normalized organizational information into structured organizational knowledge.",
    architecturalRole: "OrganizationalKnowledgePlatform",
    position: Object.freeze({ upstream: "NEA", downstream: "Executive Engine" }),
    publicApiSurface: Object.freeze([
      "DataKnowledgeFoundation",
      "DataKnowledgeFoundationContracts",
      "DataKnowledgeFoundationOwnership",
      "DataKnowledgeFoundationDependencies",
      "DataKnowledgeFoundationIdentity",
      "getDataKnowledgeFoundation",
      "getDataKnowledgeFoundationSummary",
    ]),
    foundationStatus: "Certified",
    releaseMetadata: Object.freeze({ phase: "DKL-1:1", stage: "Stable", nextPhase: "DKL-1:2" }),
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  }),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies DataKnowledgeFoundationDescriptor);

export const getDataKnowledgeFoundation = (): DataKnowledgeFoundationDescriptor =>
  DataKnowledgeFoundation;

export const getDataKnowledgeFoundationSummary = (): DataKnowledgeFoundationSummary =>
  Object.freeze({
    platformName: DataKnowledgeFoundationIdentity.platformName,
    layerId: DataKnowledgeFoundationIdentity.layerId,
    phaseId: DataKnowledgeFoundationIdentity.phaseId,
    version: DataKnowledgeFoundationIdentity.version,
    stability: DataKnowledgeFoundationIdentity.stability,
    releaseStatus: DataKnowledgeFoundationIdentity.releaseStatus,
    ownedResponsibilityCount: DataKnowledgeFoundationOwnership.owns.length,
    allowedDependencyCount: DataKnowledgeFoundationDependencies.allowed.length,
    forbiddenDependencyCount: DataKnowledgeFoundationDependencies.forbidden.length,
    contractCount: DataKnowledgeFoundationContracts.contracts.length,
    metadataOnly: true,
    immutable: true,
  } as const satisfies DataKnowledgeFoundationSummary);
