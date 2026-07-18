/**
 * DKL-7:4 — Knowledge Services Validation Groups.
 *
 * Exactly fifteen ordered validation groups. Metadata only.
 *
 * Ownership: owned exclusively by DKL-7:4.
 */

import type { KnowledgeServicesValidationGroup } from "./knowledgeServicesValidationTypes.ts";

const group = (
  groupId: KnowledgeServicesValidationGroup["groupId"],
  name: string,
  description: string,
  ruleCount: number,
  deterministicOrder: number,
): KnowledgeServicesValidationGroup =>
  Object.freeze({
    groupId,
    name,
    description,
    ruleCount,
    deterministicOrder,
    metadataOnly: true as const,
  });

/** Exactly fifteen canonical validation groups in fixed order. */
export const KnowledgeServicesValidationGroups: readonly KnowledgeServicesValidationGroup[] =
  Object.freeze([
    group(
      "Identity",
      "Identity",
      "Validation, Model, Registry, and Foundation identity reachability.",
      4,
      1,
    ),
    group(
      "Dependency",
      "Dependency",
      "Canonical dependency path and prohibited direct imports.",
      4,
      2,
    ),
    group(
      "Foundation",
      "Foundation",
      "Foundation ownership and boundary inventory preservation.",
      2,
      3,
    ),
    group(
      "Registry",
      "Registry",
      "Registry service, capability, contract, category, and access-mode inventories.",
      5,
      4,
    ),
    group(
      "ModelStructure",
      "Model Structure",
      "Canonical Model section order, inventory total, counting rule, and guarantees.",
      4,
      5,
    ),
    group(
      "RequestModels",
      "Request Models",
      "Request model count, Registry alignment, and mutation prohibition.",
      5,
      6,
    ),
    group(
      "ResponseModels",
      "Response Models",
      "Response model count, category alignment, outcomes, and transport neutrality.",
      4,
      7,
    ),
    group(
      "ResultModels",
      "Result Models",
      "Result model count, uniqueness, static graph/timeline, AI prohibition, envelope safety.",
      5,
      8,
    ),
    group(
      "ContextAndReferenceModels",
      "Context and Reference Models",
      "Context, reference, and graph supporting model inventories.",
      3,
      9,
    ),
    group(
      "Relationships",
      "Relationships",
      "Model relationship count, request traces, and structural bindings.",
      3,
      10,
    ),
    group(
      "Ownership",
      "Ownership",
      "DKL-7 ownership and non-ownership preservation.",
      2,
      11,
    ),
    group(
      "Boundaries",
      "Boundaries",
      "Prohibited surface preservation and leakage prevention.",
      2,
      12,
    ),
    group(
      "Immutability",
      "Immutability",
      "Canonical collection immutability and previous-phase reference preservation.",
      2,
      13,
    ),
    group(
      "RuntimeProhibitions",
      "Runtime Prohibitions",
      "Absence of service runtime and infrastructure runtime behavior.",
      2,
      14,
    ),
    group(
      "Readiness",
      "Readiness",
      "Ready-for-Manifest gate over all validation results.",
      1,
      15,
    ),
  ]);

export const KNOWLEDGE_SERVICES_VALIDATION_GROUP_COUNT =
  KnowledgeServicesValidationGroups.length;
