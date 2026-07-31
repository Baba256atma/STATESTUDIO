/**
 * EX-2:4 — pure, deterministic, fail-closed validation rules.
 */

import {
  ExecutiveJournalExperienceValidationIssueCodes,
} from "./executiveJournalExperienceValidationContracts.ts";
import {
  ExecutiveJournalExperienceValidationId,
  resolveExecutiveJournalExperienceValidationIdentity,
} from "./executiveJournalExperienceValidationIdentity.ts";
import type {
  ExecutiveJournalExperienceValidationInput,
  ExecutiveJournalExperienceValidationIssueCode,
  ExecutiveJournalExperienceValidationIssueDescriptor,
  ExecutiveJournalExperienceValidationResult,
  ExecutiveJournalExperienceValidationRuleDescriptor,
  ExecutiveJournalExperienceValidationRuleFamily,
} from "./executiveJournalExperienceValidationTypes.ts";

export const ExecutiveJournalExperienceValidationRuleFamilies = Object.freeze([
  "Identity",
  "Structure",
  "EntityCatalogue",
  "RelationshipCatalogue",
  "Lifecycle",
  "Vocabulary",
  "MetadataBoundary",
  "PrivacyBoundary",
  "AuthorityBoundary",
  "Provenance",
  "CorrectionSupersession",
  "Projection",
  "FilterModel",
  "Tier0EvidenceReference",
  "Determinism",
  "Immutability",
  "DependencyBoundary",
] as const satisfies readonly ExecutiveJournalExperienceValidationRuleFamily[]);

export const isExecutiveJournalExperienceValidationRuleFamily = (
  value: unknown,
): value is ExecutiveJournalExperienceValidationRuleFamily =>
  typeof value === "string"
  && ExecutiveJournalExperienceValidationRuleFamilies.some(
    (family) => family === value,
  );

export const assertExecutiveJournalExperienceValidationRuleFamily = (
  value: unknown,
): ExecutiveJournalExperienceValidationRuleFamily => {
  if (!isExecutiveJournalExperienceValidationRuleFamily(value)) {
    throw new Error("Unknown EX-2:4 validation rule family.");
  }
  return value;
};

const rule = (
  ruleKey: ExecutiveJournalExperienceValidationRuleDescriptor["ruleKey"],
  family: ExecutiveJournalExperienceValidationRuleFamily,
  subject: ExecutiveJournalExperienceValidationRuleDescriptor["subject"],
  order: number,
  statement: string,
): ExecutiveJournalExperienceValidationRuleDescriptor =>
  Object.freeze({
    ruleId: `EX-2:4/Rule/${ruleKey}`,
    ruleKey,
    family,
    subject,
    order,
    statement,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  });

export const ExecutiveJournalExperienceValidationRules = Object.freeze([
  rule("CanonicalIdentity", "Identity", "Identity", 1, "Identity is canonical or an approved exact alias."),
  rule("AggregateStructure", "Structure", "Aggregate", 2, "Aggregate preserves the complete canonical validation surface."),
  rule("SummaryStructure", "Structure", "Summary", 3, "Summary is complete, safe, and canonical."),
  rule("EntityCatalogueCompleteness", "EntityCatalogue", "EntityCatalogue", 4, "All fourteen canonical entities occur once in order."),
  rule("EntityDescriptorSafety", "EntityCatalogue", "EntityCatalogue", 5, "Entity descriptors remain safe metadata-only declarations."),
  rule("RelationshipCatalogueCompleteness", "RelationshipCatalogue", "RelationshipCatalogue", 6, "All thirteen canonical relationships occur once in order."),
  rule("RelationshipDescriptorSafety", "RelationshipCatalogue", "Relationship", 7, "Relationship endpoints and lineage controls remain canonical."),
  rule("LifecycleMetadata", "Lifecycle", "Lifecycle", 8, "Lifecycle metadata is exact and immediate-forward-only."),
  rule("ClosedVocabularies", "Vocabulary", "Vocabulary", 9, "All vocabulary values remain exact members of closed catalogues."),
  rule("MetadataBoundary", "MetadataBoundary", "Boundary", 10, "Metadata contains no payload, operation, normalization, repair, coercion, or stripping."),
  rule("PrivacyBoundary", "PrivacyBoundary", "Boundary", 11, "Metadata contains no private, evidence-content, actor, jurisdiction, or location surface."),
  rule("AuthorityBoundary", "AuthorityBoundary", "Boundary", 12, "Metadata creates no authority, confirmation, ownership, disclosure permission, or lifecycle truth."),
  rule("ProvenanceReference", "Provenance", "Provenance", 13, "Provenance remains a required opaque canonical reference descriptor."),
  rule("CorrectionSupersessionLineage", "CorrectionSupersession", "CorrectionSupersession", 14, "Correction and supersession preserve opaque predecessor lineage."),
  rule("ProjectionDescriptor", "Projection", "Projection", 15, "Projection descriptor is canonical and non-authoritative."),
  rule("FilterModelDescriptor", "FilterModel", "FilterModel", 16, "Filter descriptor is canonical and allowlisted."),
  rule("Tier0EvidenceReferenceDescriptor", "Tier0EvidenceReference", "Tier0EvidenceReference", 17, "Tier-0 evidence is an opaque supporting reference only."),
  rule("DeterministicSurface", "Determinism", "Aggregate", 18, "All validation metadata is deterministic."),
  rule("ImmutableSurface", "Immutability", "Aggregate", 19, "All canonical validation descriptors are deeply frozen."),
  rule("DependencyBoundary", "DependencyBoundary", "DependencyBoundary", 20, "Runtime dependency is exactly the EX-2:3 Model."),
] as const);

type ValidationContext = Readonly<{
  model: unknown;
  aggregate: unknown;
  summary: unknown;
  lifecycle: unknown;
  entities: readonly unknown[];
  entityKinds: readonly string[];
  relationships: readonly unknown[];
  relationshipKinds: readonly string[];
  vocabularies: unknown;
  projection: unknown;
  filterModel: unknown;
  tier0EvidenceReference: unknown;
  provenance: unknown;
  correctionSupersession: unknown;
}>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const isDeeplyFrozen = (
  value: unknown,
  visited = new WeakSet<object>(),
): boolean => {
  if (value === null || typeof value !== "object") {
    return true;
  }
  if (visited.has(value)) {
    return true;
  }
  visited.add(value);
  if (!Object.isFrozen(value)) {
    return false;
  }
  return Object.values(value).every((child) => isDeeplyFrozen(child, visited));
};

const hasDuplicate = (values: readonly string[]): boolean =>
  new Set(values).size !== values.length;

const exactOrdered = (
  actual: readonly string[],
  expected: readonly string[],
): boolean =>
  actual.length === expected.length
  && actual.every((value, index) => value === expected[index]);

const descriptorKinds = (
  value: unknown,
): readonly string[] | null => {
  if (!Array.isArray(value)) {
    return null;
  }
  const kinds: string[] = [];
  for (const item of value) {
    if (!isRecord(item) || typeof item.kind !== "string") {
      return null;
    }
    kinds.push(item.kind);
  }
  return kinds;
};

const issueDefinition = (
  code: ExecutiveJournalExperienceValidationIssueCode,
) => {
  const definition = ExecutiveJournalExperienceValidationIssueCodes.find(
    (candidate) => candidate.code === code,
  );
  if (definition === undefined) {
    throw new Error("Closed EX-2:4 issue catalogue is internally incomplete.");
  }
  return definition;
};

const ruleFor = (
  key: ExecutiveJournalExperienceValidationRuleDescriptor["ruleKey"],
) => {
  const descriptor = ExecutiveJournalExperienceValidationRules.find(
    (candidate) => candidate.ruleKey === key,
  );
  if (descriptor === undefined) {
    throw new Error("Closed EX-2:4 rule catalogue is internally incomplete.");
  }
  return descriptor;
};

const buildIssue = (
  code: ExecutiveJournalExperienceValidationIssueCode,
): ExecutiveJournalExperienceValidationIssueDescriptor => {
  const definition = issueDefinition(code);
  const descriptor = ruleFor(definition.ruleKey);
  return Object.freeze({
    issueId: `EX-2:4/Issue/${code}`,
    code,
    severity: definition.severity,
    ruleId: descriptor.ruleId,
    ruleFamily: descriptor.family,
    subject: descriptor.subject,
    detail: `Structural validation failed for ${descriptor.subject}.`,
    order: definition.order,
    safeStructuralDetailOnly: true,
    repairedInput: false,
    metadataOnly: true,
    immutable: true,
  });
};

const sensitiveKeyCodes = Object.freeze({
  body: "ForbiddenSensitiveSurface",
  journal_body: "ForbiddenSensitiveSurface",
  narrative: "ForbiddenSensitiveSurface",
  rationale: "ForbiddenSensitiveSurface",
  retention_instruction: "ForbiddenSensitiveSurface",
  disclosure_instruction: "ForbiddenSensitiveSurface",
  export_instruction: "ForbiddenSensitiveSurface",
  mutation_payload: "ForbiddenSensitiveSurface",
  private_reflection: "PrivateReflectionSignal",
  private_reflection_content: "PrivateReflectionSignal",
  private_reflection_exists: "PrivateReflectionSignal",
  private_reflection_existence: "PrivateReflectionSignal",
  private_reflection_count: "PrivateReflectionSignal",
  private_reflection_identity: "PrivateReflectionSignal",
  private_reflection_timestamp: "PrivateReflectionSignal",
  evidence_content: "EvidenceContent",
  evidence_uri: "EvidenceContent",
  resolvable_evidence_uri: "EvidenceContent",
  authority_evidence: "AuthorityEvidenceContent",
  authority_evidence_content: "AuthorityEvidenceContent",
  actor_name: "ActorPii",
  actor_email: "ActorPii",
  actor_id: "ActorPii",
  actor_pii: "ActorPii",
  jurisdiction: "JurisdictionLocation",
  location: "JurisdictionLocation",
  jurisdiction_location: "JurisdictionLocation",
  retention_instructions: "ForbiddenSensitiveSurface",
  disclosure_export_details: "ForbiddenSensitiveSurface",
  operational_commands: "OperationalExecutableMetadata",
  command: "OperationalExecutableMetadata",
  real_rtc2_payload: "ForbiddenSensitiveSurface",
} as const satisfies Readonly<Record<string, ExecutiveJournalExperienceValidationIssueCode>>);

const authorityKeyCodes = Object.freeze({
  authorityCreating: "AuthorityCreatingMetadata",
  authorityCreation: "AuthorityCreatingMetadata",
  confirmationCreating: "ConfirmationCreatingMetadata",
  confirmationCreation: "ConfirmationCreatingMetadata",
  ownershipCreating: "OwnershipCreatingMetadata",
  ownershipCreation: "OwnershipCreatingMetadata",
  disclosurePermissionCreating: "DisclosurePermissionCreatingMetadata",
  disclosurePermissionCreation: "DisclosurePermissionCreatingMetadata",
  lifecycleTruthCreating: "LifecycleTruthCreatingMetadata",
  lifecycleTruthCreation: "LifecycleTruthCreatingMetadata",
} as const satisfies Readonly<Record<string, ExecutiveJournalExperienceValidationIssueCode>>);

const prohibitedBehaviorKeys = Object.freeze([
  "executable",
  "operational",
  "runtimeBehavior",
  "uiBehavior",
  "routeBehavior",
  "providerBehavior",
  "rtcConsumption",
  "network",
  "persistence",
  "telemetry",
  "analytics",
  "browserStorage",
  "clock",
  "randomness",
  "cloud",
  "mutation",
  "deployment",
] as const);

const collectBoundaryIssues = (
  value: unknown,
  add: (code: ExecutiveJournalExperienceValidationIssueCode) => void,
  visited = new WeakSet<object>(),
): void => {
  if (value === null || typeof value !== "object" || visited.has(value)) {
    return;
  }
  visited.add(value);
  for (const [key, child] of Object.entries(value)) {
    if (Object.prototype.hasOwnProperty.call(sensitiveKeyCodes, key)) {
      add(sensitiveKeyCodes[key as keyof typeof sensitiveKeyCodes]);
    }
    if (
      child === true
      && Object.prototype.hasOwnProperty.call(authorityKeyCodes, key)
    ) {
      add(authorityKeyCodes[key as keyof typeof authorityKeyCodes]);
    }
    if (
      child === true
      && prohibitedBehaviorKeys.some((candidate) => candidate === key)
    ) {
      add("OperationalExecutableMetadata");
    }
    collectBoundaryIssues(child, add, visited);
  }
};

const baseResult = Object.freeze({
  validationId: ExecutiveJournalExperienceValidationId,
  confirmsMetadataConformanceOnly: true as const,
  productionAuthorized: false as const,
  integrationAuthorized: false as const,
  uiAuthorized: false as const,
  routeAuthorized: false as const,
  disclosureAuthorized: false as const,
  rtcConsumptionAuthorized: false as const,
  deploymentAuthorized: false as const,
  repairedInput: false as const,
  mutatedInput: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

export const validateExecutiveJournalExperienceMetadata = (
  candidate: unknown,
  context: ValidationContext,
): ExecutiveJournalExperienceValidationResult => {
  const issueCodes = new Set<ExecutiveJournalExperienceValidationIssueCode>();
  const add = (code: ExecutiveJournalExperienceValidationIssueCode): void => {
    issueCodes.add(code);
  };

  try {
    if (!isRecord(candidate)) {
      add("IncompleteAggregate");
    } else {
      const input = candidate as Readonly<ExecutiveJournalExperienceValidationInput>;
      if (!resolveExecutiveJournalExperienceValidationIdentity(input.identity).ok) {
        add("UnknownOrMalformedIdentity");
      }
      if (input.aggregate !== context.aggregate || input.model !== context.model) {
        add("IncompleteAggregate");
      }
      if (input.summary !== context.summary) {
        add("IncompleteSummary");
      }

      const entityKinds = descriptorKinds(input.entities);
      if (entityKinds === null) {
        add("MissingEntity");
      } else {
        if (entityKinds.length < context.entityKinds.length) add("MissingEntity");
        if (hasDuplicate(entityKinds)) add("DuplicateEntity");
        if (entityKinds.some((kind) => !context.entityKinds.includes(kind))) add("UnknownEntityKind");
        if (
          entityKinds.length === context.entityKinds.length
          && !exactOrdered(entityKinds, context.entityKinds)
        ) add("IncorrectEntityOrder");
        if (
          !Array.isArray(input.entities)
          || input.entities.some((entity) =>
            !isRecord(entity)
            || entity.metadataOnly !== true
            || entity.immutable !== true
            || entity.executable !== false
            || entity.authorityCreationAllowed !== false
            || entity.mutationCommandsAllowed !== false)
        ) add("UnsafeEntityDescriptor");
      }

      const relationshipKinds = descriptorKinds(input.relationships);
      if (relationshipKinds === null) {
        add("MissingRelationship");
      } else {
        if (relationshipKinds.length < context.relationshipKinds.length) add("MissingRelationship");
        if (hasDuplicate(relationshipKinds)) add("DuplicateRelationship");
        if (relationshipKinds.some((kind) => !context.relationshipKinds.includes(kind))) add("UnknownRelationshipKind");
        if (
          relationshipKinds.length === context.relationshipKinds.length
          && !exactOrdered(relationshipKinds, context.relationshipKinds)
        ) add("IncorrectRelationshipOrder");
        if (
          Array.isArray(input.relationships)
          && input.relationships.some((relationship, index) => {
            const expected = context.relationships[index];
            return !isRecord(relationship)
              || !isRecord(expected)
              || relationship.from !== expected.from
              || relationship.to !== expected.to;
          })
        ) add("InvalidRelationshipEndpoints");
        if (
          Array.isArray(input.relationships)
          && input.relationships.some((relationship) =>
            isRecord(relationship) && relationship.lineageErasing === true)
        ) add("LineageErasingRelationship");
      }

      if (input.lifecycle !== context.lifecycle) add("InvalidLifecycleMetadata");
      if (input.vocabularies !== context.vocabularies) add("UnknownVocabularyValue");
      if (input.provenance !== context.provenance) add("MissingProvenanceReference");
      if (input.correctionSupersession !== context.correctionSupersession) {
        add("InvalidCorrectionSupersessionStructure");
      }
      if (input.projection !== context.projection) add("InvalidProjectionDescriptor");
      if (input.filterModel !== context.filterModel) add("InvalidFilterDescriptor");
      if (input.tier0EvidenceReference !== context.tier0EvidenceReference) {
        add("InvalidTier0EvidenceReference");
      }

      const scanTargets = [
        input.aggregate,
        input.summary,
        input.entities,
        input.relationships,
        input.projection,
        input.filterModel,
        input.tier0EvidenceReference,
        input.provenance,
        input.correctionSupersession,
      ];
      for (const target of scanTargets) collectBoundaryIssues(target, add);

      if (
        input.normalizationRequested === true
        || input.repairRequested === true
        || input.coercionRequested === true
        || input.silentStrippingRequested === true
      ) add("NormalizationRepairAttempt");
      if (input.mutationRequested === true) add("InputMutationAttempt");

      if (
        !isRecord(input.validationEvidence)
        || input.validationEvidence.complete !== true
        || !Array.isArray(input.validationEvidence.ruleIds)
        || input.validationEvidence.ruleIds.length !== ExecutiveJournalExperienceValidationRules.length
      ) add("IncompleteValidationEvidence");

      if (
        !isRecord(input.dependencyDeclaration)
        || input.dependencyDeclaration.runtimeDependency !== "EX-2:3/ExecutiveJournalExperienceModel"
        || input.dependencyDeclaration.modelOnly !== true
        || !Array.isArray(input.dependencyDeclaration.prohibitedDependencies)
        || input.dependencyDeclaration.prohibitedDependencies.length !== 0
      ) add("ProhibitedDependency");

      if (
        (isRecord(input.aggregate) && input.aggregate.deterministic !== true)
        || (Array.isArray(input.entities)
          && input.entities.some((entity) =>
            isRecord(entity) && entity.deterministic !== true))
      ) add("NonDeterministicMetadata");

      const immutableTargets = [
        input.aggregate,
        input.summary,
        input.lifecycle,
        input.entities,
        input.relationships,
        input.vocabularies,
        input.contracts,
        input.boundaries,
        input.projection,
        input.filterModel,
        input.tier0EvidenceReference,
        input.provenance,
        input.correctionSupersession,
        input.dependencyDeclaration,
        input.validationEvidence,
      ];
      if (
        !Object.isFrozen(candidate)
        || immutableTargets.some((target) => !isDeeplyFrozen(target))
      ) add("MutableDescriptor");
    }
  } catch {
    add("IncompleteValidationEvidence");
  }

  const issues = [...issueCodes]
    .map(buildIssue)
    .sort((left, right) => {
      const leftRule = ruleFor(
        issueDefinition(left.code).ruleKey,
      ).order;
      const rightRule = ruleFor(
        issueDefinition(right.code).ruleKey,
      ).order;
      return leftRule - rightRule || left.order - right.order;
    });
  const frozenIssues = Object.freeze(issues);
  if (frozenIssues.length === 0) {
    return Object.freeze({
      ...baseResult,
      result: "Valid" as const,
      valid: true as const,
      issueCount: 0 as const,
      issues: Object.freeze([]) as readonly [],
    });
  }
  return Object.freeze({
    ...baseResult,
    result: "Invalid" as const,
    valid: false as const,
    issueCount: frozenIssues.length,
    issues: frozenIssues,
  });
};
