/**
 * DKL-5:2 — Knowledge Validation Registry Catalog.
 *
 * Immutable registrations for statuses, outcomes, severities, evidence, trust,
 * lifecycle, scopes, criteria, rule categories, limitations, consumer readiness,
 * ownership, boundaries, compatibility, extension, dependencies, and foundation APIs.
 *
 * Ownership: owned exclusively by DKL-5:2.
 */

import { KnowledgeValidationFoundation } from "./knowledgeValidationFoundation.ts";
import type {
  KnowledgeValidationRegistryEntry,
  OutcomeRegistryEntry,
  SeverityRegistryEntry,
  TrustLevelRegistryEntry,
} from "./knowledgeValidationRegistryTypes.ts";

const OWNER = "DKL-5 Knowledge Validation Registry";
const PHASE = "DKL-5:2";

const base = (
  category: KnowledgeValidationRegistryEntry["category"],
  order: number,
  name: string,
  description: string,
  namespaceSuffix: string,
  tags: readonly string[],
  extensionStatus: KnowledgeValidationRegistryEntry["extensionStatus"] = "AdditiveAllowed",
  compatibilityStatus: KnowledgeValidationRegistryEntry["compatibilityStatus"] = "Compatible",
): KnowledgeValidationRegistryEntry =>
  Object.freeze({
    id: `kv-reg-${namespaceSuffix}-${name.toLowerCase()}`,
    name,
    namespace: `nexora.dkl.knowledge-validation.registry.${namespaceSuffix}.${name.toLowerCase()}`,
    description,
    category,
    owner: OWNER,
    sourcePhase: PHASE,
    lifecycleStatus: "Registered" as const,
    stabilityStatus: "Stable" as const,
    compatibilityStatus,
    extensionStatus,
    publicVisibility: "Public" as const,
    deterministicOrder: order,
    tags: Object.freeze([...tags]),
  });

/** Status registry — outcome statuses as stable status vocabulary. */
export const KnowledgeValidationStatusRegistry: readonly KnowledgeValidationRegistryEntry[] =
  Object.freeze(
    KnowledgeValidationFoundation.contracts.outcomeStatuses.map((name, index) =>
      base(
        "ValidationStatus",
        index + 1,
        name,
        `Registered validation status ${name}.`,
        "status",
        ["status", "outcome-aligned"],
        "Closed",
      ),
    ),
  );

/** Outcome registry with usability metadata from Foundation. */
export const KnowledgeValidationOutcomeRegistry: readonly OutcomeRegistryEntry[] =
  Object.freeze(
    KnowledgeValidationFoundation.contracts.outcomes.map((outcome, index) =>
      Object.freeze({
        id: `kv-reg-outcome-${outcome.status.toLowerCase()}`,
        name: outcome.status,
        namespace: `nexora.dkl.knowledge-validation.registry.outcome.${outcome.status.toLowerCase()}`,
        description: outcome.meaning,
        category: "ValidationOutcome" as const,
        owner: OWNER,
        sourcePhase: PHASE,
        lifecycleStatus: "Registered" as const,
        stabilityStatus: "Stable" as const,
        compatibilityStatus: "Compatible" as const,
        extensionStatus: "Closed" as const,
        publicVisibility: "Public" as const,
        deterministicOrder: index + 1,
        tags: Object.freeze(["outcome", "status"]),
        meaning: outcome.meaning,
        consumerUsability: outcome.mayRemainUsable,
        blockingBehaviorDeclaration: outcome.blocksConclusions,
        clarificationRelevance: outcome.clarificationRequired,
        executiveUseSuitability: outcome.allowedUsage,
        allowedLimitationHandling: outcome.mayRemainUsable
          ? "May remain usable with declared limitations."
          : "Must not be treated as usable without remediation path.",
      }),
    ),
  );

/** Severity registry. */
export const KnowledgeValidationSeverityRegistry: readonly SeverityRegistryEntry[] =
  Object.freeze(
    KnowledgeValidationFoundation.contracts.severities.map((sev, index) =>
      Object.freeze({
        id: `kv-reg-severity-${sev.severity.toLowerCase()}`,
        name: sev.severity,
        namespace: `nexora.dkl.knowledge-validation.registry.severity.${sev.severity.toLowerCase()}`,
        description: sev.meaning,
        category: "ValidationSeverity" as const,
        owner: OWNER,
        sourcePhase: PHASE,
        lifecycleStatus: "Registered" as const,
        stabilityStatus: "Stable" as const,
        compatibilityStatus: "Compatible" as const,
        extensionStatus: "Closed" as const,
        publicVisibility: "Public" as const,
        deterministicOrder: index + 1,
        tags: Object.freeze(["severity"]),
        rank: index + 1,
        architecturalMeaning: sev.architecturalImpact,
        consumerImpact: sev.meaning,
        blockingDeclaration: sev.severity === "Blocking" || sev.severity === "Critical",
        escalationOwnershipDeclaration:
          "Escalation ownership is declarative only; no notifications or workflows.",
        notificationImplemented: false as const,
      }),
    ),
  );

const CORE_EVIDENCE = KnowledgeValidationFoundation.contracts.evidenceKinds;
const EXTRA_EVIDENCE = [
  "IdentityEvidence",
  "StructuralEvidence",
  "RelationshipEvidence",
  "ClassificationEvidence",
  "OwnershipEvidence",
  "CompatibilityEvidence",
  "FreshnessEvidence",
  "ConsumerReadinessEvidence",
] as const;

/** Evidence type registry. */
export const KnowledgeValidationEvidenceTypeRegistry: readonly KnowledgeValidationRegistryEntry[] =
  Object.freeze(
    [...CORE_EVIDENCE, ...EXTRA_EVIDENCE].map((name, index) =>
      base(
        "EvidenceType",
        index + 1,
        name,
        `Registered evidence type ${name}.`,
        "evidence",
        ["evidence", "metadata-only"],
      ),
    ),
  );

const TRUST_META: Record<
  string,
  {
    meaning: string;
    evidence: string;
    limitations: boolean;
    consumer: string;
    executive: string;
    blocking: boolean;
  }
> = {
  Undeclared: {
    meaning: "Trust has not been declared.",
    evidence: "No trust evidence expected yet.",
    limitations: true,
    consumer: "Not suitable until declared.",
    executive: "Not suitable for executive use.",
    blocking: true,
  },
  Unsupported: {
    meaning: "Required supporting evidence is not declared.",
    evidence: "Missing supporting evidence.",
    limitations: true,
    consumer: "Unsupported conclusions forbidden.",
    executive: "Not suitable.",
    blocking: true,
  },
  Limited: {
    meaning: "Trust is limited by declared findings.",
    evidence: "Partial supporting evidence with limitations.",
    limitations: true,
    consumer: "Usable with limitations.",
    executive: "Usable with explicit limitations.",
    blocking: false,
  },
  Conditional: {
    meaning: "Trust is conditional on declared constraints.",
    evidence: "Supporting evidence with conditions.",
    limitations: true,
    consumer: "Conditional suitability.",
    executive: "Conditional executive use.",
    blocking: false,
  },
  Supported: {
    meaning: "Supporting evidence is declared.",
    evidence: "Supporting evidence present.",
    limitations: true,
    consumer: "Suitable within scope.",
    executive: "Suitable within scope.",
    blocking: false,
  },
  Verified: {
    meaning: "Verification status is declared verified.",
    evidence: "Verification evidence present.",
    limitations: false,
    consumer: "Suitable for verified use.",
    executive: "Suitable for verified executive use.",
    blocking: false,
  },
  Restricted: {
    meaning: "Trust is restricted by policy declaration.",
    evidence: "Restriction evidence/policy present.",
    limitations: true,
    consumer: "Restricted consumers only.",
    executive: "Restricted executive use.",
    blocking: false,
  },
};

/** Trust level registry from Foundation vocabulary. */
export const KnowledgeValidationTrustLevelRegistry: readonly TrustLevelRegistryEntry[] =
  Object.freeze(
    KnowledgeValidationFoundation.contracts.trustLevels.map((name, index) => {
      const meta = TRUST_META[name]!;
      return Object.freeze({
        id: `kv-reg-trust-${name.toLowerCase()}`,
        name,
        namespace: `nexora.dkl.knowledge-validation.registry.trust.${name.toLowerCase()}`,
        description: meta.meaning,
        category: "TrustLevel" as const,
        owner: OWNER,
        sourcePhase: PHASE,
        lifecycleStatus: "Registered" as const,
        stabilityStatus: "Stable" as const,
        compatibilityStatus: "Compatible" as const,
        extensionStatus: "Closed" as const,
        publicVisibility: "Public" as const,
        deterministicOrder: index + 1,
        tags: Object.freeze(["trust-level", "no-score"]),
        meaning: meta.meaning,
        evidenceExpectation: meta.evidence,
        limitationsAllowed: meta.limitations,
        consumerSuitability: meta.consumer,
        executiveUseSuitability: meta.executive,
        blockingStatus: meta.blocking,
        trustCalculated: false as const,
      });
    }),
  );

/** Lifecycle state registry from Foundation. */
export const KnowledgeValidationLifecycleStateRegistry: readonly KnowledgeValidationRegistryEntry[] =
  Object.freeze(
    KnowledgeValidationFoundation.lifecycle.states.map((name, index) =>
      base(
        "ValidationLifecycleState",
        index + 1,
        name,
        `Registered validation lifecycle state ${name}.`,
        "lifecycle",
        ["lifecycle", "metadata-only"],
        "Closed",
      ),
    ),
  );

/** Consumer readiness states. */
export const KnowledgeValidationConsumerReadinessRegistry: readonly KnowledgeValidationRegistryEntry[] =
  Object.freeze([
    base("ConsumerReadinessState", 1, "NotReadyForConsumer", "Not ready for approved consumers.", "consumer-readiness", ["consumer-readiness"], "Closed"),
    base("ConsumerReadinessState", 2, "ReadyForConsumer", "Ready for approved consumers.", "consumer-readiness", ["consumer-readiness"], "Closed"),
    base("ConsumerReadinessState", 3, "RestrictedConsumer", "Restricted approved consumers only.", "consumer-readiness", ["consumer-readiness"], "Closed"),
    base("ConsumerReadinessState", 4, "ReadyWithLimitations", "Ready with declared limitations.", "consumer-readiness", ["consumer-readiness"], "Closed"),
  ]);

/** Limitation types. */
export const KnowledgeValidationLimitationTypeRegistry: readonly KnowledgeValidationRegistryEntry[] =
  Object.freeze([
    base("LimitationType", 1, "CompletenessLimitation", "Usability limited by incompleteness.", "limitation", ["limitation"]),
    base("LimitationType", 2, "AmbiguityLimitation", "Usability limited by ambiguity.", "limitation", ["limitation"]),
    base("LimitationType", 3, "ConflictLimitation", "Usability limited by conflict scope.", "limitation", ["limitation"]),
    base("LimitationType", 4, "ProvenanceLimitation", "Usability limited by provenance gaps.", "limitation", ["limitation"]),
    base("LimitationType", 5, "FreshnessLimitation", "Usability limited by freshness declaration.", "limitation", ["limitation"]),
    base("LimitationType", 6, "ConsumerPolicyLimitation", "Usability limited by consumer policy.", "limitation", ["limitation"]),
    base("LimitationType", 7, "ExecutiveUseLimitation", "Executive use limited by declaration.", "limitation", ["limitation"]),
  ]);

/** Scope types. */
export const KnowledgeValidationScopeTypeRegistry: readonly KnowledgeValidationRegistryEntry[] =
  Object.freeze([
    base("ValidationScopeType", 1, "TargetScope", "Scope limited to a single validation target.", "scope", ["scope"]),
    base("ValidationScopeType", 2, "DimensionScope", "Scope limited to selected dimensions.", "scope", ["scope"]),
    base("ValidationScopeType", 3, "ModelScope", "Scope across a knowledge model.", "scope", ["scope"]),
    base("ValidationScopeType", 4, "ObjectSetScope", "Scope across an object set.", "scope", ["scope"]),
    base("ValidationScopeType", 5, "RelationshipSetScope", "Scope across a relationship set.", "scope", ["scope"]),
    base("ValidationScopeType", 6, "ConsumerScope", "Scope for a consumer readiness evaluation.", "scope", ["scope"]),
  ]);

/** Criterion types. */
export const KnowledgeValidationCriterionTypeRegistry: readonly KnowledgeValidationRegistryEntry[] =
  Object.freeze([
    base("ValidationCriterionType", 1, "PresenceCriterion", "Required presence of a declared element.", "criterion", ["criterion"]),
    base("ValidationCriterionType", 2, "ConsistencyCriterion", "Required consistency among declarations.", "criterion", ["criterion"]),
    base("ValidationCriterionType", 3, "ReferenceCriterion", "Required reference integrity.", "criterion", ["criterion"]),
    base("ValidationCriterionType", 4, "OwnershipCriterion", "Required ownership declaration.", "criterion", ["criterion"]),
    base("ValidationCriterionType", 5, "ProvenanceCriterion", "Required provenance declaration.", "criterion", ["criterion"]),
    base("ValidationCriterionType", 6, "CompatibilityCriterion", "Required compatibility declaration.", "criterion", ["criterion"]),
    base("ValidationCriterionType", 7, "ReadinessCriterion", "Required consumer-readiness declaration.", "criterion", ["criterion"]),
  ]);

/** Rule categories (architectural — no execution). */
export const KnowledgeValidationRuleCategoryRegistry: readonly KnowledgeValidationRegistryEntry[] =
  Object.freeze([
    base("ValidationRuleCategory", 1, "IdentityRules", "Rules concerning identity validity.", "rule-category", ["rule-category"]),
    base("ValidationRuleCategory", 2, "CompletenessRules", "Rules concerning completeness.", "rule-category", ["rule-category"]),
    base("ValidationRuleCategory", 3, "ConsistencyRules", "Rules concerning consistency.", "rule-category", ["rule-category"]),
    base("ValidationRuleCategory", 4, "ReferentialRules", "Rules concerning referential integrity.", "rule-category", ["rule-category"]),
    base("ValidationRuleCategory", 5, "ProvenanceRules", "Rules concerning provenance and traceability.", "rule-category", ["rule-category"]),
    base("ValidationRuleCategory", 6, "AmbiguityRules", "Rules concerning ambiguity detection.", "rule-category", ["rule-category"]),
    base("ValidationRuleCategory", 7, "ConflictRules", "Rules concerning conflict detection.", "rule-category", ["rule-category"]),
    base("ValidationRuleCategory", 8, "ReadinessRules", "Rules concerning consumer readiness.", "rule-category", ["rule-category"]),
  ]);

/** Ownership declarations from Foundation ownership. */
export const KnowledgeValidationOwnershipDeclarationRegistry: readonly KnowledgeValidationRegistryEntry[] =
  Object.freeze([
    ...KnowledgeValidationFoundation.ownership.owns.map((name, index) =>
      base(
        "OwnershipDeclaration",
        index + 1,
        `Owns:${name.replace(/\s+/g, "")}`,
        `Registry ownership declaration: owns ${name}.`,
        "ownership",
        ["ownership", "owns"],
        "Closed",
      ),
    ),
    ...KnowledgeValidationFoundation.ownership.doesNotOwn.map((name, index) =>
      base(
        "OwnershipDeclaration",
        KnowledgeValidationFoundation.ownership.owns.length + index + 1,
        `DoesNotOwn:${name.replace(/\s+/g, "")}`,
        `Registry ownership declaration: does not own ${name}.`,
        "ownership",
        ["ownership", "does-not-own"],
        "Closed",
      ),
    ),
  ]);

/** Boundary declarations. */
export const KnowledgeValidationBoundaryDeclarationRegistry: readonly KnowledgeValidationRegistryEntry[] =
  Object.freeze([
    base("BoundaryDeclaration", 1, "DataCleansingExcluded", "Data cleansing is excluded from DKL-5.", "boundary", ["boundary"], "Closed"),
    base("BoundaryDeclaration", 2, "RuntimeValidationExcluded", "Runtime validation execution is excluded from Registry.", "boundary", ["boundary"], "Closed"),
    base("BoundaryDeclaration", 3, "AiConfidenceExcluded", "AI confidence generation is excluded.", "boundary", ["boundary"], "Closed"),
    base("BoundaryDeclaration", 4, "EngineReasoningExcluded", "Engine reasoning is excluded.", "boundary", ["boundary"], "Closed"),
    base("BoundaryDeclaration", 5, "PersistenceExcluded", "Persistence is excluded.", "boundary", ["boundary"], "Closed"),
    base("BoundaryDeclaration", 6, "RemediationExcluded", "Automatic remediation is excluded.", "boundary", ["boundary"], "Closed"),
    base("BoundaryDeclaration", 7, "ScoreCalculationExcluded", "Score calculation is excluded.", "boundary", ["boundary"], "Closed"),
    base("BoundaryDeclaration", 8, "TrustCalculationExcluded", "Trust calculation is excluded.", "boundary", ["boundary"], "Closed"),
  ]);

/** Compatibility policies from Foundation. */
export const KnowledgeValidationCompatibilityPolicyRegistry: readonly KnowledgeValidationRegistryEntry[] =
  Object.freeze(
    KnowledgeValidationFoundation.contracts.compatibilityPolicies.map((policy, index) =>
      base(
        "CompatibilityPolicy",
        index + 1,
        policy.policyId,
        policy.description,
        "compatibility",
        ["compatibility", policy.status],
        "Closed",
        policy.status === "Forbidden"
          ? "Forbidden"
          : policy.status === "Restricted"
            ? "Restricted"
            : policy.status === "ForwardCompatible"
              ? "ForwardCompatible"
              : "Compatible",
      ),
    ),
  );

/** Extension policies from Foundation. */
export const KnowledgeValidationExtensionPolicyRegistry: readonly KnowledgeValidationRegistryEntry[] =
  Object.freeze(
    KnowledgeValidationFoundation.contracts.extensionPolicies.map((policy, index) =>
      base(
        "ExtensionPolicy",
        index + 1,
        policy.policyId,
        policy.description,
        "extension",
        ["extension", policy.status],
        policy.status === "Forbidden" ? "Closed" : "AdditiveAllowed",
        policy.status === "Forbidden" ? "Forbidden" : "Compatible",
      ),
    ),
  );

/** Dependency declarations. */
export const KnowledgeValidationDependencyDeclarationRegistry: readonly KnowledgeValidationRegistryEntry[] =
  Object.freeze([
    base(
      "DependencyDeclaration",
      1,
      "DKL5FoundationPublicEntry",
      "Depends on knowledgeValidationFoundation.ts public entry only.",
      "dependency",
      ["dependency", "public-entry-point"],
      "Closed",
    ),
  ]);

/** Foundation public APIs. */
export const KnowledgeValidationPublicFoundationApiRegistry: readonly KnowledgeValidationRegistryEntry[] =
  Object.freeze(
    [
      "KnowledgeValidationFoundation",
      "KnowledgeValidationFoundationIdentity",
      "KnowledgeValidationFoundationVersion",
      "KnowledgeValidationContracts",
      "KnowledgeValidationOwnership",
      "KnowledgeValidationBoundaries",
      "KnowledgeValidationLifecycle",
      "KnowledgeValidationDependencies",
    ].map((name, index) =>
      base(
        "PublicFoundationApi",
        index + 1,
        name,
        `Registered DKL-5:1 public API ${name}.`,
        "foundation-api",
        ["public-api", "foundation"],
        "Closed",
      ),
    ),
  );
