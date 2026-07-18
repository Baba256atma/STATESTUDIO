/**
 * DKL-9:3 — Data Knowledge Suite Relationship Models.
 *
 * Suite-only relationship kinds and model guarantees.
 * No runtime traversal or evaluation.
 *
 * Ownership: owned exclusively by DKL-9:3.
 */

import type {
  DataKnowledgeSuiteGuarantee,
  DataKnowledgeSuiteRelationshipKind,
  DataKnowledgeSuiteRelationshipKindDescriptor,
} from "./dataKnowledgeSuiteModelTypes.ts";

const relationship = (
  relationshipKind: DataKnowledgeSuiteRelationshipKind,
  description: string,
  order: number,
): DataKnowledgeSuiteRelationshipKindDescriptor =>
  Object.freeze({
    relationshipKindId: `DKL-9:3/RelationshipKind/${relationshipKind}`,
    relationshipKind,
    description,
    direction: "Directed" as const,
    runtimeBehavior: "None" as const,
    traversableAtRuntime: false as const,
    deterministicOrder: order,
  });

/** Suite composition relationship kinds. */
export const DataKnowledgeSuiteRelationshipKinds: readonly DataKnowledgeSuiteRelationshipKindDescriptor[] =
  Object.freeze([
    relationship(
      "ContainsCapability",
      "Suite contains an ordered capability composition member.",
      1,
    ),
    relationship(
      "DependsOnCapability",
      "Capability depends on the prior suite capability in canonical order.",
      2,
    ),
    relationship(
      "ReferencesPlatform",
      "Capability references its Public Platform through Registry.",
      3,
    ),
    relationship(
      "ReferencesApiRegistry",
      "Capability references Public API registry access metadata through Registry.",
      4,
    ),
    relationship(
      "UsesContract",
      "Suite uses a Foundation suite contract registered by Registry.",
      5,
    ),
    relationship(
      "UsesIntegrationContract",
      "Suite uses an integration contract registered by Registry.",
      6,
    ),
    relationship(
      "UsesBoundary",
      "Suite uses boundary declarations registered by Registry.",
      7,
    ),
    relationship(
      "UsesOwnership",
      "Suite uses ownership declarations registered by Registry.",
      8,
    ),
    relationship(
      "SupersedesRelease",
      "A later declarative suite release supersedes a prior release model.",
      9,
    ),
    relationship(
      "ProducesSnapshot",
      "A suite release model produces a structural suite snapshot.",
      10,
    ),
  ]);

const guarantee = (
  order: number,
  statement: string,
): DataKnowledgeSuiteGuarantee =>
  Object.freeze({
    guaranteeId: `DKL-9:3/Guarantee/${String(order).padStart(2, "0")}`,
    statement,
    status: "Guaranteed" as const,
    runtimeBehavior: "None" as const,
    deterministicOrder: order,
  });

/** Model guarantees. */
export const DataKnowledgeSuiteModelGuarantees: readonly DataKnowledgeSuiteGuarantee[] =
  Object.freeze([
    guarantee(1, "Immutable Metadata for all suite model kinds and instances."),
    guarantee(2, "Canonical References preserved through Registry."),
    guarantee(3, "Deterministic Results for all model inventories and counts."),
    guarantee(4, "No Runtime behavior in the Suite Model."),
    guarantee(5, "No Reconstruction of DKL-1 through DKL-8 models."),
    guarantee(6, "No Duplicate Models of upstream capability models."),
  ]);
