/**
 * DKL-8:2 — Knowledge Governance Subject and Contract Registries.
 *
 * Registers all 19 foundation subjects and 18 foundation contract areas.
 * Preserves Foundation by canonical reference. Metadata only.
 *
 * Ownership: owned exclusively by DKL-8:2.
 */

import {
  KnowledgeGovernanceFoundationPlatform,
} from "./knowledgeGovernanceFoundation.ts";
import type {
  KnowledgeGovernanceContractRegistration,
  KnowledgeGovernanceSubjectRegistration,
} from "./knowledgeGovernanceRegistryTypes.ts";

const foundation = KnowledgeGovernanceFoundationPlatform;

const subject = (
  foundationSubject: (typeof foundation.subjects)[number],
): KnowledgeGovernanceSubjectRegistration =>
  Object.freeze({
    id: `DKL-8:2/Subject/${foundationSubject.subjectType}`,
    name: foundationSubject.subjectType,
    description: foundationSubject.description,
    category: "subject" as const,
    status: "Registered" as const,
    owner: "DKL-8" as const,
    sourcePhase: "DKL-8:1" as const,
    version: "1.0.0" as const,
    stability: "FoundationAligned" as const,
    public: true as const,
    deprecated: false as const,
    runtimeBehavior: "None" as const,
    metadataOnly: true as const,
    deterministicOrder: foundationSubject.deterministicOrder,
    subjectType: foundationSubject.subjectType,
    foundationSubjectId: foundationSubject.subjectTypeId,
  });

/** Exactly 19 governance subject registrations. */
export const KnowledgeGovernanceSubjectRegistry: readonly KnowledgeGovernanceSubjectRegistration[] =
  Object.freeze(foundation.subjects.map(subject));

const CONTRACT_CATEGORIES = Object.freeze([
  "Ownership",
  "Stewardship",
  "Classification",
  "Sensitivity",
  "Access",
  "Usage",
  "Retention",
  "Disposition",
  "Lineage",
  "VersionGovernance",
  "Audit",
  "Compliance",
  "Lifecycle",
  "PolicyApplicability",
  "Exceptions",
  "Evidence",
  "GovernanceDecisionReferences",
  "Boundaries",
] as const);

const contract = (
  foundationContract: (typeof foundation.contracts)[number],
  contractCategory: string,
): KnowledgeGovernanceContractRegistration =>
  Object.freeze({
    id: `DKL-8:2/Contract/${contractCategory}`,
    name: foundationContract.contractName,
    description: foundationContract.description,
    category: "contract" as const,
    status: "Registered" as const,
    owner: "DKL-8" as const,
    sourcePhase: "DKL-8:1" as const,
    version: "1.0.0" as const,
    stability: "FoundationAligned" as const,
    public: true as const,
    deprecated: false as const,
    runtimeBehavior: "None" as const,
    metadataOnly: true as const,
    deterministicOrder: foundationContract.deterministicOrder,
    contractCategory,
    foundationContractId: foundationContract.contractId,
    purpose: foundationContract.description,
    availability: "FoundationDeclared" as const,
  });

/** Exactly 18 foundation contract area registrations. */
export const KnowledgeGovernanceContractRegistry: readonly KnowledgeGovernanceContractRegistration[] =
  Object.freeze(
    foundation.contracts.map((item, index) =>
      contract(item, CONTRACT_CATEGORIES[index]!),
    ),
  );
