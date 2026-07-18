/**
 * DKL-5:2 — Knowledge Validation Target Registry.
 *
 * Stable architectural categories for DKL-5:1 validation targets.
 * No runtime target instances.
 *
 * Ownership: owned exclusively by DKL-5:2.
 */

import { KnowledgeValidationFoundation } from "./knowledgeValidationFoundation.ts";
import type { ValidationTargetRegistryEntry } from "./knowledgeValidationRegistryTypes.ts";

const OWNER = "DKL-5 Knowledge Validation Registry";
const PHASE = "DKL-5:2";
const NS = "nexora.dkl.knowledge-validation.registry.target";

const target = (
  order: number,
  name: string,
  description: string,
  consumerImpact: string,
): ValidationTargetRegistryEntry =>
  Object.freeze({
    id: `kv-reg-target-${name.toLowerCase()}`,
    name,
    namespace: `${NS}.${name.toLowerCase()}`,
    description,
    category: "ValidationTargetType" as const,
    owner: OWNER,
    sourcePhase: PHASE,
    lifecycleStatus: "Registered" as const,
    stabilityStatus: "Stable" as const,
    compatibilityStatus: "Compatible" as const,
    extensionStatus: "AdditiveAllowed" as const,
    publicVisibility: "Public" as const,
    deterministicOrder: order,
    tags: Object.freeze(["validation-target", "dkl-4-mapped", "metadata-only"]),
    sourceModelingConcept: name,
    validationEligibility: true as const,
    consumerImpact,
    runtimeInstanceCreated: false as const,
  });

const IMPACT: Record<string, string> = {
  KnowledgeModel: "Affects whole-model consumer readiness.",
  KnowledgeObject: "Affects object-level usability.",
  BusinessObject: "Affects organizational object trust.",
  Entity: "Affects entity structural reliability.",
  Relationship: "Affects relationship integrity.",
  Identity: "Affects identity reliability and linking.",
  Metadata: "Affects descriptive and structural metadata trust.",
  Hierarchy: "Affects hierarchy validity.",
  Composition: "Affects composition validity.",
  Reference: "Affects reference integrity.",
  SemanticStructure: "Affects semantic alignment claims.",
  Provenance: "Affects evidence and traceability.",
  Context: "Affects contextual interpretation limits.",
  Snapshot: "Affects snapshot freshness and scope.",
  ObjectSet: "Affects set-level completeness.",
  RelationshipSet: "Affects relationship-set integrity.",
  Boundary: "Affects ownership and scope boundaries.",
  Version: "Affects version compatibility claims.",
  Summary: "Affects summary-level executive usability.",
};

/** Canonical immutable validation target type registry. */
export const KnowledgeValidationTargetRegistry: readonly ValidationTargetRegistryEntry[] =
  Object.freeze(
    KnowledgeValidationFoundation.contracts.targetCategories.map((name, index) =>
      target(
        index + 1,
        name,
        `Registered validation target for DKL-4 modeling concept ${name}.`,
        IMPACT[name] ?? "Affects declared consumer scope.",
      ),
    ),
  );
