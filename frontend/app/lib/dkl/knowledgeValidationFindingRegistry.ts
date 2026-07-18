/**
 * DKL-5:2 — Knowledge Validation Finding and Issue Registries.
 *
 * Stable finding/issue categories. Remediation is declared ownership only —
 * never implemented.
 *
 * Ownership: owned exclusively by DKL-5:2.
 */

import type { FindingIssueRegistryEntry } from "./knowledgeValidationRegistryTypes.ts";

const OWNER = "DKL-5 Knowledge Validation Registry";
const PHASE = "DKL-5:2";
const NS_FINDING = "nexora.dkl.knowledge-validation.registry.finding";
const NS_ISSUE = "nexora.dkl.knowledge-validation.registry.issue";

const finding = (
  order: number,
  name: string,
  description: string,
  dimensions: readonly string[],
  typicalSeverity: string,
  blockingPotential: boolean,
  clarificationRelevance: boolean,
): FindingIssueRegistryEntry =>
  Object.freeze({
    id: `kv-reg-finding-${name.toLowerCase()}`,
    name,
    namespace: `${NS_FINDING}.${name.toLowerCase()}`,
    description,
    category: "FindingCategory" as const,
    owner: OWNER,
    sourcePhase: PHASE,
    lifecycleStatus: "Registered" as const,
    stabilityStatus: "Stable" as const,
    compatibilityStatus: "Compatible" as const,
    extensionStatus: "AdditiveAllowed" as const,
    publicVisibility: "Public" as const,
    deterministicOrder: order,
    tags: Object.freeze(["finding", ...dimensions]),
    applicableDimensions: Object.freeze([...dimensions]),
    typicalSeverity,
    blockingPotential,
    clarificationRelevance,
    remediationOwnershipDeclaration: "Owning phase declares remediation; DKL-5:2 does not remediate.",
    runtimeRemediationImplemented: false as const,
  });

const issue = (
  order: number,
  name: string,
  description: string,
  dimensions: readonly string[],
  typicalSeverity: string,
  blockingPotential: boolean,
  clarificationRelevance: boolean,
): FindingIssueRegistryEntry =>
  Object.freeze({
    id: `kv-reg-issue-${name.toLowerCase()}`,
    name,
    namespace: `${NS_ISSUE}.${name.toLowerCase()}`,
    description,
    category: "IssueCategory" as const,
    owner: OWNER,
    sourcePhase: PHASE,
    lifecycleStatus: "Registered" as const,
    stabilityStatus: "Stable" as const,
    compatibilityStatus: "Compatible" as const,
    extensionStatus: "AdditiveAllowed" as const,
    publicVisibility: "Public" as const,
    deterministicOrder: order,
    tags: Object.freeze(["issue", ...dimensions]),
    applicableDimensions: Object.freeze([...dimensions]),
    typicalSeverity,
    blockingPotential,
    clarificationRelevance,
    remediationOwnershipDeclaration: "Owning phase declares remediation; DKL-5:2 does not remediate.",
    runtimeRemediationImplemented: false as const,
  });

/** Canonical immutable finding category registry. */
export const KnowledgeValidationFindingRegistry: readonly FindingIssueRegistryEntry[] =
  Object.freeze([
    finding(1, "MissingIdentity", "Required identity is absent.", ["Identity"], "High", true, false),
    finding(2, "MissingRequiredField", "Required structural field is absent.", ["Completeness"], "Medium", false, false),
    finding(3, "MissingReference", "Required reference is absent.", ["ReferentialIntegrity"], "High", true, false),
    finding(4, "BrokenReference", "Declared reference does not resolve within contracts.", ["ReferentialIntegrity"], "High", true, false),
    finding(5, "DuplicateIdentity", "Duplicate identity declaration detected.", ["Identity", "Consistency"], "High", true, false),
    finding(6, "InconsistentMetadata", "Metadata declarations contradict each other.", ["Consistency", "Integrity"], "Medium", false, false),
    finding(7, "OwnershipMissing", "Ownership declaration is missing.", ["Ownership"], "Medium", false, false),
    finding(8, "ProvenanceMissing", "Required provenance is missing.", ["Provenance", "Traceability"], "High", false, false),
    finding(9, "UnsupportedClassification", "Classification is unsupported by declaration.", ["Classification", "SemanticAlignment"], "Medium", false, true),
    finding(10, "RelationshipMismatch", "Relationship does not match approved contracts.", ["RelationshipValidity"], "High", true, false),
    finding(11, "HierarchyMismatch", "Hierarchy structure mismatches approved contracts.", ["HierarchyValidity"], "Medium", false, false),
    finding(12, "CompositionMismatch", "Composition structure mismatches approved contracts.", ["CompositionValidity"], "Medium", false, false),
    finding(13, "AmbiguousMeaning", "Material ambiguity affects meaning.", ["Ambiguity"], "Medium", false, true),
    finding(14, "ConflictingEvidence", "Evidence declarations conflict.", ["Conflict", "Consistency"], "High", true, true),
    finding(15, "PotentiallyStale", "Freshness is declared potentially stale.", ["FreshnessDeclaration"], "Medium", false, false),
    finding(16, "ConsumerRestriction", "Consumer use is restricted by declaration.", ["ConsumerReadiness"], "High", false, false),
    finding(17, "ExecutiveUseLimitation", "Executive use is limited by declaration.", ["ExecutiveUsability"], "Medium", false, false),
  ]);

/** Canonical immutable issue category registry (same vocabulary; issue framing). */
export const KnowledgeValidationIssueRegistry: readonly FindingIssueRegistryEntry[] =
  Object.freeze([
    issue(1, "MissingIdentity", "Issue framing for missing identity.", ["Identity"], "High", true, false),
    issue(2, "MissingRequiredField", "Issue framing for missing required field.", ["Completeness"], "Medium", false, false),
    issue(3, "MissingReference", "Issue framing for missing reference.", ["ReferentialIntegrity"], "High", true, false),
    issue(4, "BrokenReference", "Issue framing for broken reference.", ["ReferentialIntegrity"], "High", true, false),
    issue(5, "DuplicateIdentity", "Issue framing for duplicate identity.", ["Identity"], "High", true, false),
    issue(6, "InconsistentMetadata", "Issue framing for inconsistent metadata.", ["Consistency"], "Medium", false, false),
    issue(7, "OwnershipMissing", "Issue framing for missing ownership.", ["Ownership"], "Medium", false, false),
    issue(8, "ProvenanceMissing", "Issue framing for missing provenance.", ["Provenance"], "High", false, false),
    issue(9, "UnsupportedClassification", "Issue framing for unsupported classification.", ["Classification"], "Medium", false, true),
    issue(10, "RelationshipMismatch", "Issue framing for relationship mismatch.", ["RelationshipValidity"], "High", true, false),
    issue(11, "HierarchyMismatch", "Issue framing for hierarchy mismatch.", ["HierarchyValidity"], "Medium", false, false),
    issue(12, "CompositionMismatch", "Issue framing for composition mismatch.", ["CompositionValidity"], "Medium", false, false),
    issue(13, "AmbiguousMeaning", "Issue framing for ambiguous meaning.", ["Ambiguity"], "Medium", false, true),
    issue(14, "ConflictingEvidence", "Issue framing for conflicting evidence.", ["Conflict"], "High", true, true),
    issue(15, "PotentiallyStale", "Issue framing for potentially stale knowledge.", ["FreshnessDeclaration"], "Medium", false, false),
    issue(16, "ConsumerRestriction", "Issue framing for consumer restriction.", ["ConsumerReadiness"], "High", false, false),
    issue(17, "ExecutiveUseLimitation", "Issue framing for executive-use limitation.", ["ExecutiveUsability"], "Medium", false, false),
  ]);
