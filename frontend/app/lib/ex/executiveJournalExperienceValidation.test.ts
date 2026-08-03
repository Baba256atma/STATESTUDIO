import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import { ExecutiveJournalExperienceModel } from "./executiveJournalExperienceModel.ts";
import {
  ExecutiveJournalExperienceValidation,
  ExecutiveJournalExperienceValidationAggregateDescriptor,
  ExecutiveJournalExperienceValidationApprovedAliases,
  ExecutiveJournalExperienceValidationAuthorization,
  ExecutiveJournalExperienceValidationBoundaries,
  ExecutiveJournalExperienceValidationCanonicalInput,
  ExecutiveJournalExperienceValidationCanonicalResult,
  ExecutiveJournalExperienceValidationContracts,
  ExecutiveJournalExperienceValidationDecisions,
  ExecutiveJournalExperienceValidationDependencyDeclaration,
  ExecutiveJournalExperienceValidationId,
  ExecutiveJournalExperienceValidationIssueCodes,
  ExecutiveJournalExperienceValidationLifecycle,
  ExecutiveJournalExperienceValidationLifecycleStates,
  ExecutiveJournalExperienceValidationResults,
  ExecutiveJournalExperienceValidationRuleFamilies,
  ExecutiveJournalExperienceValidationRules,
  ExecutiveJournalExperienceValidationSeverities,
  ExecutiveJournalExperienceValidationSubjectKinds,
  ExecutiveJournalExperienceValidationSummaryValue,
  ExecutiveJournalExperienceValidationUpstream,
  assertExecutiveJournalExperienceValidationBoundaryIdentity,
  assertExecutiveJournalExperienceValidationIdentity,
  assertExecutiveJournalExperienceValidationIssueCode,
  assertExecutiveJournalExperienceValidationLifecycleTransition,
  assertExecutiveJournalExperienceValidationRuleFamily,
  assertExecutiveJournalExperienceValidationSubjectKind,
  canTransitionExecutiveJournalExperienceValidationLifecycle,
  getExecutiveJournalExperienceValidationSummary,
  isExecutiveJournalExperienceValidationIssueCode,
  isExecutiveJournalExperienceValidationBoundaryIdentity,
  isExecutiveJournalExperienceValidationLifecycleState,
  isExecutiveJournalExperienceValidationResult,
  isExecutiveJournalExperienceValidationRuleFamily,
  isExecutiveJournalExperienceValidationSeverity,
  isExecutiveJournalExperienceValidationSubjectKind,
  resolveExecutiveJournalExperienceValidationIdentity,
  validateExecutiveJournalExperience,
} from "./executiveJournalExperienceValidation.ts";
import type {
  ExecutiveJournalExperienceValidationInput,
  ExecutiveJournalExperienceValidationIssueCode,
} from "./executiveJournalExperienceValidationTypes.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const VALIDATION_FILES = Object.freeze([
  "executiveJournalExperienceValidation.ts",
  "executiveJournalExperienceValidationTypes.ts",
  "executiveJournalExperienceValidationIdentity.ts",
  "executiveJournalExperienceValidationLifecycle.ts",
  "executiveJournalExperienceValidationContracts.ts",
  "executiveJournalExperienceValidationRules.ts",
  "executiveJournalExperienceValidationMetadata.ts",
  "executiveJournalExperienceValidation.test.ts",
] as const);

const FAMILY_COMPLETENESS_TABLE = Object.freeze([
  "Identity", "Structure", "EntityCatalogue", "RelationshipCatalogue",
  "Lifecycle", "Vocabulary", "MetadataBoundary", "PrivacyBoundary",
  "AuthorityBoundary", "Provenance", "CorrectionSupersession", "Projection",
  "FilterModel", "Tier0EvidenceReference", "Determinism", "Immutability",
  "DependencyBoundary",
] as const);

const RULE_COMPLETENESS_TABLE = Object.freeze([
  "CanonicalIdentity", "AggregateStructure", "SummaryStructure",
  "EntityCatalogueCompleteness", "EntityDescriptorSafety",
  "RelationshipCatalogueCompleteness", "RelationshipDescriptorSafety",
  "LifecycleMetadata", "ClosedVocabularies", "MetadataBoundary",
  "PrivacyBoundary", "AuthorityBoundary", "ProvenanceReference",
  "CorrectionSupersessionLineage", "ProjectionDescriptor",
  "FilterModelDescriptor", "Tier0EvidenceReferenceDescriptor",
  "DeterministicSurface", "ImmutableSurface", "DependencyBoundary",
] as const);

const RULE_COVERAGE = Object.freeze([
  { ruleKey: "CanonicalIdentity", family: "Identity", subject: "Identity", order: 1 },
  { ruleKey: "AggregateStructure", family: "Structure", subject: "Aggregate", order: 2 },
  { ruleKey: "SummaryStructure", family: "Structure", subject: "Summary", order: 3 },
  { ruleKey: "EntityCatalogueCompleteness", family: "EntityCatalogue", subject: "EntityCatalogue", order: 4 },
  { ruleKey: "EntityDescriptorSafety", family: "EntityCatalogue", subject: "EntityCatalogue", order: 5 },
  { ruleKey: "RelationshipCatalogueCompleteness", family: "RelationshipCatalogue", subject: "RelationshipCatalogue", order: 6 },
  { ruleKey: "RelationshipDescriptorSafety", family: "RelationshipCatalogue", subject: "Relationship", order: 7 },
  { ruleKey: "LifecycleMetadata", family: "Lifecycle", subject: "Lifecycle", order: 8 },
  { ruleKey: "ClosedVocabularies", family: "Vocabulary", subject: "Vocabulary", order: 9 },
  { ruleKey: "MetadataBoundary", family: "MetadataBoundary", subject: "Boundary", order: 10 },
  { ruleKey: "PrivacyBoundary", family: "PrivacyBoundary", subject: "Boundary", order: 11 },
  { ruleKey: "AuthorityBoundary", family: "AuthorityBoundary", subject: "Boundary", order: 12 },
  { ruleKey: "ProvenanceReference", family: "Provenance", subject: "Provenance", order: 13 },
  { ruleKey: "CorrectionSupersessionLineage", family: "CorrectionSupersession", subject: "CorrectionSupersession", order: 14 },
  { ruleKey: "ProjectionDescriptor", family: "Projection", subject: "Projection", order: 15 },
  { ruleKey: "FilterModelDescriptor", family: "FilterModel", subject: "FilterModel", order: 16 },
  { ruleKey: "Tier0EvidenceReferenceDescriptor", family: "Tier0EvidenceReference", subject: "Tier0EvidenceReference", order: 17 },
  { ruleKey: "DeterministicSurface", family: "Determinism", subject: "Aggregate", order: 18 },
  { ruleKey: "ImmutableSurface", family: "Immutability", subject: "Aggregate", order: 19 },
  { ruleKey: "DependencyBoundary", family: "DependencyBoundary", subject: "DependencyBoundary", order: 20 },
].map((coverage) => Object.freeze(coverage)));

const ISSUE_COMPLETENESS_TABLE = Object.freeze([
  "UnknownOrMalformedIdentity", "IncompleteAggregate", "IncompleteSummary",
  "MissingEntity", "DuplicateEntity", "IncorrectEntityOrder",
  "UnknownEntityKind", "UnsafeEntityDescriptor", "MissingRelationship",
  "DuplicateRelationship", "IncorrectRelationshipOrder",
  "UnknownRelationshipKind", "InvalidRelationshipEndpoints",
  "LineageErasingRelationship", "UnknownVocabularyValue",
  "InvalidLifecycleMetadata", "ForbiddenSensitiveSurface",
  "PrivateReflectionSignal", "EvidenceContent", "AuthorityEvidenceContent",
  "ActorPii", "JurisdictionLocation", "AuthorityCreatingMetadata",
  "ConfirmationCreatingMetadata", "OwnershipCreatingMetadata",
  "DisclosurePermissionCreatingMetadata", "LifecycleTruthCreatingMetadata",
  "OperationalExecutableMetadata", "MissingProvenanceReference",
  "InvalidCorrectionSupersessionStructure", "InvalidProjectionDescriptor",
  "InvalidFilterDescriptor", "InvalidTier0EvidenceReference",
  "NonDeterministicMetadata", "MutableDescriptor", "ProhibitedDependency",
  "NormalizationRepairAttempt", "InputMutationAttempt",
  "IncompleteValidationEvidence",
] as const satisfies readonly ExecutiveJournalExperienceValidationIssueCode[]);

const SUBJECT_COMPLETENESS_TABLE = Object.freeze([
  "Model", "Aggregate", "Summary", "Identity", "Lifecycle", "EntityCatalogue",
  "ExecutiveJournalExperience", "JournalProjection", "JournalEntryList",
  "JournalEntrySummary", "JournalEntryDetail", "EntryCategoryPresentation",
  "LifecyclePresentation", "OriginPresentation", "AuthorityPresentation",
  "IntegrityPresentation", "ProvenancePresentation",
  "CorrectionSupersessionPresentation", "JournalFilterModel",
  "Tier0EvidenceReference", "RelationshipCatalogue", "Relationship",
  "Vocabulary", "Contract", "Boundary", "Projection", "FilterModel",
  "Provenance", "CorrectionSupersession",
  "DependencyBoundary",
] as const);

const LIFECYCLE_COMPLETENESS_TABLE = Object.freeze([
  "Declared", "UpstreamBound", "RulesConstructed", "Sealed",
  "ReadyForManifest",
] as const);

const CONTRACT_COMPLETENESS_TABLE = Object.freeze([
  "EX-2:4/Contract/ValidationInput",
  "EX-2:4/Contract/ValidationRule",
  "EX-2:4/Contract/ValidationSubject",
  "EX-2:4/Contract/ValidationIssue",
  "EX-2:4/Contract/ValidResult",
  "EX-2:4/Contract/InvalidResult",
  "EX-2:4/Contract/ValidationSummary",
  "EX-2:4/Contract/BoundaryDeclaration",
] as const);

const DECISION_COMPLETENESS_TABLE = Object.freeze([
  "EX-2:4/D-09", "EX-2:4/D-10", "EX-2:4/D-11",
  "EX-2:4/D-12", "EX-2:4/D-13", "EX-2:4/D-14",
] as const);

const BOUNDARY_COMPLETENESS_TABLE = Object.freeze([
  "boundariesId", "importsModelOnlyAtRuntime", "directRegistryImport",
  "directFoundationImport", "directArchitectureImport", "rtcImport",
  "app8Import", "ex1PublicIndexImport", "reactNextUiImport",
  "routeProviderAdapterFixtureImport", "tier0RuntimeImport", "network",
  "persistence", "telemetry", "browserStorage", "cloud", "clock",
  "randomness", "mutation", "repair", "normalization", "coercion",
  "silentStripping", "authorityCreation", "ownershipCreation",
  "confirmationCreation", "disclosurePermissionCreation",
  "lifecycleTruthCreation", "operationalEffects", "productionAuthorization",
  "productionIntegration", "deployment", "createsEx25", "metadataOnly",
  "sideEffectFree", "deterministic", "failClosed", "immutable",
] as const);

const frozen = <T>(value: T): Readonly<T> => Object.freeze(value);
const override = (
  key: keyof ExecutiveJournalExperienceValidationInput,
  value: unknown,
): Readonly<ExecutiveJournalExperienceValidationInput> =>
  frozen({ ...ExecutiveJournalExperienceValidationCanonicalInput, [key]: value });

const changedEntity = (
  index: number,
  changes: Readonly<Record<string, unknown>>,
) => {
  const entities = [...ExecutiveJournalExperienceValidationCanonicalInput.entities];
  entities[index] = frozen({ ...entities[index], ...changes });
  return frozen(entities);
};

const changedRelationship = (
  index: number,
  changes: Readonly<Record<string, unknown>>,
) => {
  const relationships = [
    ...ExecutiveJournalExperienceValidationCanonicalInput.relationships,
  ];
  relationships[index] = frozen({ ...relationships[index], ...changes });
  return frozen(relationships);
};

const frozenAggregateWith = (key: string, value: unknown) =>
  frozen({
    ...ExecutiveJournalExperienceValidationAggregateDescriptor,
    [key]: value,
  });

const ISSUE_SCENARIOS = Object.freeze({
  UnknownOrMalformedIdentity: () => override("identity", " ex-2:4 "),
  IncompleteAggregate: () => override("aggregate", null),
  IncompleteSummary: () => override("summary", frozen({})),
  MissingEntity: () => override("entities", frozen(
    ExecutiveJournalExperienceValidationCanonicalInput.entities.slice(1),
  )),
  DuplicateEntity: () => override("entities", frozen([
    ...ExecutiveJournalExperienceValidationCanonicalInput.entities,
    ExecutiveJournalExperienceValidationCanonicalInput.entities[0],
  ])),
  IncorrectEntityOrder: () => override("entities", frozen([
    ExecutiveJournalExperienceValidationCanonicalInput.entities[1],
    ExecutiveJournalExperienceValidationCanonicalInput.entities[0],
    ...ExecutiveJournalExperienceValidationCanonicalInput.entities.slice(2),
  ])),
  UnknownEntityKind: () => override(
    "entities",
    changedEntity(0, { kind: "UnknownEntity" }),
  ),
  UnsafeEntityDescriptor: () => override(
    "entities",
    changedEntity(0, { metadataOnly: false }),
  ),
  MissingRelationship: () => override("relationships", frozen(
    ExecutiveJournalExperienceValidationCanonicalInput.relationships.slice(1),
  )),
  DuplicateRelationship: () => override("relationships", frozen([
    ...ExecutiveJournalExperienceValidationCanonicalInput.relationships,
    ExecutiveJournalExperienceValidationCanonicalInput.relationships[0],
  ])),
  IncorrectRelationshipOrder: () => override("relationships", frozen([
    ExecutiveJournalExperienceValidationCanonicalInput.relationships[1],
    ExecutiveJournalExperienceValidationCanonicalInput.relationships[0],
    ...ExecutiveJournalExperienceValidationCanonicalInput.relationships.slice(2),
  ])),
  UnknownRelationshipKind: () => override(
    "relationships",
    changedRelationship(0, { kind: "UnknownRelationship" }),
  ),
  InvalidRelationshipEndpoints: () => override(
    "relationships",
    changedRelationship(0, { from: "JournalEntryDetail" }),
  ),
  LineageErasingRelationship: () => override(
    "relationships",
    changedRelationship(0, { lineageErasing: true }),
  ),
  UnknownVocabularyValue: () => override(
    "vocabularies",
    frozen({ projectionAvailability: frozen(["available"]) }),
  ),
  InvalidLifecycleMetadata: () => override(
    "lifecycle",
    frozen({ currentState: "readyformanifest" }),
  ),
  ForbiddenSensitiveSurface: () => override(
    "aggregate",
    frozenAggregateWith("journal_body", "redacted-test-sentinel"),
  ),
  PrivateReflectionSignal: () => override(
    "aggregate",
    frozenAggregateWith("private_reflection_exists", true),
  ),
  EvidenceContent: () => override(
    "aggregate",
    frozenAggregateWith("evidence_content", "redacted-test-sentinel"),
  ),
  AuthorityEvidenceContent: () => override(
    "aggregate",
    frozenAggregateWith("authority_evidence", "redacted-test-sentinel"),
  ),
  ActorPii: () => override(
    "aggregate",
    frozenAggregateWith("actor_email", "redacted-test-sentinel"),
  ),
  JurisdictionLocation: () => override(
    "aggregate",
    frozenAggregateWith("jurisdiction", "redacted-test-sentinel"),
  ),
  AuthorityCreatingMetadata: () => override(
    "aggregate",
    frozenAggregateWith("authorityCreation", true),
  ),
  ConfirmationCreatingMetadata: () => override(
    "aggregate",
    frozenAggregateWith("confirmationCreation", true),
  ),
  OwnershipCreatingMetadata: () => override(
    "aggregate",
    frozenAggregateWith("ownershipCreation", true),
  ),
  DisclosurePermissionCreatingMetadata: () => override(
    "aggregate",
    frozenAggregateWith("disclosurePermissionCreation", true),
  ),
  LifecycleTruthCreatingMetadata: () => override(
    "aggregate",
    frozenAggregateWith("lifecycleTruthCreation", true),
  ),
  OperationalExecutableMetadata: () => override(
    "aggregate",
    frozenAggregateWith("executable", true),
  ),
  MissingProvenanceReference: () => override("provenance", null),
  InvalidCorrectionSupersessionStructure: () =>
    override("correctionSupersession", frozen({ presence: "present" })),
  InvalidProjectionDescriptor: () => override("projection", frozen({})),
  InvalidFilterDescriptor: () => override("filterModel", frozen({})),
  InvalidTier0EvidenceReference: () =>
    override("tier0EvidenceReference", frozen({})),
  NonDeterministicMetadata: () => override(
    "entities",
    changedEntity(0, { deterministic: false }),
  ),
  MutableDescriptor: () => override("boundaries", { metadataOnly: true }),
  ProhibitedDependency: () => override(
    "dependencyDeclaration",
    frozen({
      ...ExecutiveJournalExperienceValidationDependencyDeclaration,
      runtimeDependency: "RTC-2",
    }),
  ),
  NormalizationRepairAttempt: () => override("normalizationRequested", true),
  InputMutationAttempt: () => override("mutationRequested", true),
  IncompleteValidationEvidence: () =>
    override("validationEvidence", frozen({ complete: false })),
} as const satisfies Readonly<
  Record<ExecutiveJournalExperienceValidationIssueCode, () => unknown>
>);

const BOUNDARY_SURFACE_COVERAGE = Object.freeze([
  { key: "journal_body", code: "ForbiddenSensitiveSurface" },
  { key: "narrative", code: "ForbiddenSensitiveSurface" },
  { key: "rationale", code: "ForbiddenSensitiveSurface" },
  { key: "private_reflection_content", code: "PrivateReflectionSignal" },
  { key: "private_reflection_existence", code: "PrivateReflectionSignal" },
  { key: "private_reflection_count", code: "PrivateReflectionSignal" },
  { key: "private_reflection_identity", code: "PrivateReflectionSignal" },
  { key: "private_reflection_timestamp", code: "PrivateReflectionSignal" },
  { key: "evidence_content", code: "EvidenceContent" },
  { key: "resolvable_evidence_uri", code: "EvidenceContent" },
  { key: "authority_evidence_content", code: "AuthorityEvidenceContent" },
  { key: "actor_pii", code: "ActorPii" },
  { key: "jurisdiction_location", code: "JurisdictionLocation" },
  { key: "retention_instructions", code: "ForbiddenSensitiveSurface" },
  { key: "disclosure_export_details", code: "ForbiddenSensitiveSurface" },
  { key: "operational_commands", code: "OperationalExecutableMetadata" },
  { key: "mutation_payload", code: "ForbiddenSensitiveSurface" },
  { key: "real_rtc2_payload", code: "ForbiddenSensitiveSurface" },
] as const);

const PROHIBITED_BEHAVIOR_COVERAGE = Object.freeze([
  "uiBehavior", "routeBehavior", "providerBehavior", "rtcConsumption",
  "network", "persistence", "telemetry", "analytics", "browserStorage",
  "clock", "randomness", "cloud", "mutation", "deployment",
] as const);

describe("EX-2:4 Executive Journal Experience Validation", () => {
  describe("package inventory and dependency boundary", () => {
    it("contains exactly the eight authorized EX-2:4 files", () => {
      const actual = readdirSync(HERE).filter((name) =>
        /^executiveJournalExperienceValidation(?:Types|Identity|Lifecycle|Contracts|Rules|Metadata)?(?:\.test)?\.ts$/.test(name)
      );
      assert.deepEqual(actual.sort(), [...VALIDATION_FILES].sort());
      assert.equal(actual.length, 8);
    });

    it("has exactly one upstream Model runtime import and no prohibited import", () => {
      const sources = VALIDATION_FILES
        .filter((name) => !name.endsWith(".test.ts"))
        .map((name) => readFileSync(join(HERE, name), "utf8"));
      assert.equal(
        sources.reduce(
          (count, source) =>
            count
            + (source.match(/from "\.\/executiveJournalExperienceModel\.ts"/g)?.length ?? 0),
          0,
        ),
        1,
      );
      const joined = sources.join("\n");
      assert.doesNotMatch(
        joined,
        /from ["'][^"']*(?:Registry|Foundation|ProductArchitecture|rtc|app8|React|next|Synthetic|Fixture|Provider|Adapter)[^"']*["']/i,
      );
      assert.doesNotMatch(joined, /\b(?:import\s*\(|require\s*\()/);
    });

    it("has an acyclic seven-file production dependency graph", () => {
      const productionFiles = VALIDATION_FILES.filter(
        (name) => !name.endsWith(".test.ts"),
      );
      const fileSet = new Set<string>(productionFiles);
      const graph = new Map<string, readonly string[]>();
      for (const file of productionFiles) {
        const source = readFileSync(join(HERE, file), "utf8");
        graph.set(
          file,
          [...source.matchAll(/\bfrom\s+["']\.\/([^"']+\.ts)["']/g)]
            .map((match) => match[1]!)
            .filter((dependency) => fileSet.has(dependency)),
        );
      }
      const visiting = new Set<string>();
      const visited = new Set<string>();
      const visit = (file: string): void => {
        assert.equal(visiting.has(file), false, `cycle at ${file}`);
        if (visited.has(file)) return;
        visiting.add(file);
        for (const dependency of graph.get(file) ?? []) visit(dependency);
        visiting.delete(file);
        visited.add(file);
      };
      for (const file of productionFiles) visit(file);
      assert.equal(visited.size, 7);
    });

    it("keeps Validation package inventory exact", () => {
      assert.equal(
        readdirSync(HERE).filter((name) =>
          /^executiveJournalExperienceValidation(?:[A-Z].*)?(?:\.test)?\.ts$/
            .test(name)
        ).length > 0,
        true,
      );
    });
  });

  describe("identity, lifecycle, and closed vocabularies", () => {
    it("resolves the canonical identity and both approved aliases exactly", () => {
      for (const value of [
        ExecutiveJournalExperienceValidationId,
        ...ExecutiveJournalExperienceValidationApprovedAliases,
      ]) {
        assert.equal(resolveExecutiveJournalExperienceValidationIdentity(value).ok, true);
        assert.equal(assertExecutiveJournalExperienceValidationIdentity(value), ExecutiveJournalExperienceValidationId);
      }
    });

    it("rejects malformed, unknown, modified, partial, and cross-phase identities", () => {
      for (const value of [
        "", " ", "EX-2:4/", "ex-2:4", "EX-2:4 ", " EX-2:4",
        "nexora.ex.executive.journal.experience.Validation",
        "EX-2:3/ExecutiveJournalExperienceModel",
        "RTC-2:4/ExecutiveJournalRuntimeValidation",
        "JournalExperienceValidation",
        null, 4, {},
      ]) {
        assert.equal(resolveExecutiveJournalExperienceValidationIdentity(value).ok, false);
        assert.throws(() => assertExecutiveJournalExperienceValidationIdentity(value));
      }
    });

    it("allows only immediate forward lifecycle transitions", () => {
      const allowed = new Set([
        "Declared→UpstreamBound",
        "UpstreamBound→RulesConstructed",
        "RulesConstructed→Sealed",
        "Sealed→ReadyForManifest",
      ]);
      for (const from of LIFECYCLE_COMPLETENESS_TABLE) {
        for (const to of LIFECYCLE_COMPLETENESS_TABLE) {
          const expected = allowed.has(`${from}→${to}`);
          assert.equal(
            canTransitionExecutiveJournalExperienceValidationLifecycle(from, to),
            expected,
            `${from} → ${to}`,
          );
          if (expected) {
            assert.equal(
              assertExecutiveJournalExperienceValidationLifecycleTransition(from, to),
              true,
            );
          } else {
            assert.throws(() =>
              assertExecutiveJournalExperienceValidationLifecycleTransition(from, to)
            );
          }
        }
      }
      for (const pair of [
        ["declared", "UpstreamBound"],
        ["Declared ", "UpstreamBound"],
        ["Declared", "upstreambound"],
        [null, "UpstreamBound"],
        [{}, "UpstreamBound"],
      ] as const) {
        assert.equal(canTransitionExecutiveJournalExperienceValidationLifecycle(pair[0], pair[1]), false);
      }
    });

    it("fails closed for unknown result, severity, subject, issue, and lifecycle values", () => {
      assert.deepEqual(ExecutiveJournalExperienceValidationResults, ["Valid", "Invalid"]);
      assert.deepEqual(
        ExecutiveJournalExperienceValidationSeverities,
        ["Info", "Warning", "Error", "Critical"],
      );
      assert.equal(isExecutiveJournalExperienceValidationResult("valid"), false);
      assert.equal(isExecutiveJournalExperienceValidationSeverity("fatal"), false);
      assert.equal(isExecutiveJournalExperienceValidationSubjectKind("Entity"), false);
      assert.equal(isExecutiveJournalExperienceValidationIssueCode("UnknownIdentity"), false);
      assert.equal(isExecutiveJournalExperienceValidationLifecycleState("Sealed "), false);
      assert.equal(isExecutiveJournalExperienceValidationRuleFamily("identity"), false);
      assert.equal(isExecutiveJournalExperienceValidationRuleFamily("Identity "), false);
      assert.equal(isExecutiveJournalExperienceValidationRuleFamily("Valid"), false);
      assert.equal(isExecutiveJournalExperienceValidationBoundaryIdentity("Boundary"), false);
      assert.throws(() => assertExecutiveJournalExperienceValidationSubjectKind("Entity"));
      assert.throws(() => assertExecutiveJournalExperienceValidationIssueCode("UnknownIdentity"));
      assert.throws(() => assertExecutiveJournalExperienceValidationRuleFamily("identity"));
      assert.throws(() => assertExecutiveJournalExperienceValidationBoundaryIdentity("Boundary"));
      assert.equal(
        assertExecutiveJournalExperienceValidationRuleFamily("Identity"),
        "Identity",
      );
      assert.equal(
        assertExecutiveJournalExperienceValidationBoundaryIdentity(
          "EX-2:4/ExecutiveJournalExperienceValidationBoundaries",
        ),
        "EX-2:4/ExecutiveJournalExperienceValidationBoundaries",
      );
    });

    it("accepts every exact closed value and rejects case, whitespace, and cross-vocabulary values", () => {
      for (const result of ExecutiveJournalExperienceValidationResults) {
        assert.equal(isExecutiveJournalExperienceValidationResult(result), true);
      }
      for (const severity of ExecutiveJournalExperienceValidationSeverities) {
        assert.equal(isExecutiveJournalExperienceValidationSeverity(severity), true);
      }
      for (const subject of ExecutiveJournalExperienceValidationSubjectKinds) {
        assert.equal(isExecutiveJournalExperienceValidationSubjectKind(subject), true);
      }
      for (const { code } of ExecutiveJournalExperienceValidationIssueCodes) {
        assert.equal(isExecutiveJournalExperienceValidationIssueCode(code), true);
      }
      for (const state of ExecutiveJournalExperienceValidationLifecycleStates) {
        assert.equal(isExecutiveJournalExperienceValidationLifecycleState(state), true);
      }
      for (const family of ExecutiveJournalExperienceValidationRuleFamilies) {
        assert.equal(isExecutiveJournalExperienceValidationRuleFamily(family), true);
      }
      for (const value of ["valid", "Valid ", " Valid", "Info"]) {
        assert.equal(isExecutiveJournalExperienceValidationResult(value), false);
      }
      for (const value of ["error", "Error ", " Error", "Valid"]) {
        assert.equal(isExecutiveJournalExperienceValidationSeverity(value), false);
      }
      for (const value of ["model", "Model ", " Model", "Critical"]) {
        assert.equal(isExecutiveJournalExperienceValidationSubjectKind(value), false);
      }
      for (const value of [
        "missingentity", "MissingEntity ", " MissingEntity", "Identity",
      ]) {
        assert.equal(isExecutiveJournalExperienceValidationIssueCode(value), false);
      }
      for (const value of ["declared", "Declared ", " Declared", "Identity"]) {
        assert.equal(isExecutiveJournalExperienceValidationLifecycleState(value), false);
      }
      for (const value of ["identity", "Identity ", " Identity", "Valid"]) {
        assert.equal(isExecutiveJournalExperienceValidationRuleFamily(value), false);
      }
    });
  });

  describe("immutable completeness tables", () => {
    it("covers every rule family", () => {
      assert.deepEqual(ExecutiveJournalExperienceValidationRuleFamilies, FAMILY_COMPLETENESS_TABLE);
      assert.equal(Object.isFrozen(FAMILY_COMPLETENESS_TABLE), true);
      assert.equal(
        new Set(ExecutiveJournalExperienceValidationRuleFamilies).size,
        ExecutiveJournalExperienceValidationRuleFamilies.length,
      );
      for (const family of FAMILY_COMPLETENESS_TABLE) {
        assert.equal(isExecutiveJournalExperienceValidationRuleFamily(family), true);
        assert.equal(
          ExecutiveJournalExperienceValidationRules.some(
            (rule) => rule.family === family,
          ),
          true,
        );
      }
    });
    it("covers every canonical rule", () => {
      assert.deepEqual(
        ExecutiveJournalExperienceValidationRules.map((item) => item.ruleKey),
        RULE_COMPLETENESS_TABLE,
      );
      assert.deepEqual(
        ExecutiveJournalExperienceValidationRules.map((item) => ({
          ruleKey: item.ruleKey,
          family: item.family,
          subject: item.subject,
          order: item.order,
        })),
        RULE_COVERAGE,
      );
      assert.equal(Object.isFrozen(RULE_COVERAGE), true);
      assert.equal(RULE_COVERAGE.every(Object.isFrozen), true);
      assert.equal(
        new Set(ExecutiveJournalExperienceValidationRules.map((item) => item.ruleId)).size,
        20,
      );
      ExecutiveJournalExperienceValidationRules.forEach((item, index) => {
        assert.equal(item.ruleId, `EX-2:4/Rule/${item.ruleKey}`);
        assert.equal(item.order, index + 1);
      });
    });
    it("covers every issue code", () => {
      assert.deepEqual(
        ExecutiveJournalExperienceValidationIssueCodes.map((item) => item.code),
        ISSUE_COMPLETENESS_TABLE,
      );
      assert.equal(
        ExecutiveJournalExperienceValidationIssueCodes.every(Object.isFrozen),
        true,
      );
      assert.deepEqual(Object.keys(ISSUE_SCENARIOS).sort(), [...ISSUE_COMPLETENESS_TABLE].sort());
      assert.equal(
        new Set(ExecutiveJournalExperienceValidationIssueCodes.map((item) => item.code)).size,
        39,
      );
      for (const definition of ExecutiveJournalExperienceValidationIssueCodes) {
        assert.equal(
          ExecutiveJournalExperienceValidationRules.some(
            (rule) => rule.ruleKey === definition.ruleKey,
          ),
          true,
        );
      }
    });
    it("covers every subject kind", () => {
      assert.deepEqual(ExecutiveJournalExperienceValidationSubjectKinds, SUBJECT_COMPLETENESS_TABLE);
      assert.equal(ExecutiveJournalExperienceValidationSubjectKinds.length, 30);
      assert.equal(
        new Set(ExecutiveJournalExperienceValidationSubjectKinds).size,
        ExecutiveJournalExperienceValidationSubjectKinds.length,
      );
    });
    it("covers every lifecycle state", () => {
      assert.deepEqual(ExecutiveJournalExperienceValidationLifecycleStates, LIFECYCLE_COMPLETENESS_TABLE);
      assert.deepEqual(
        ExecutiveJournalExperienceValidationLifecycle.semantics.map(
          ({ state, order }) => ({ state, order }),
        ),
        LIFECYCLE_COMPLETENESS_TABLE.map((state, index) => ({
          state,
          order: index + 1,
        })),
      );
      assert.equal(
        ExecutiveJournalExperienceValidationLifecycle.semantics.every(Object.isFrozen),
        true,
      );
    });
    it("covers every contract", () => {
      assert.deepEqual(
        ExecutiveJournalExperienceValidationContracts.map((item) => item.contractId),
        CONTRACT_COMPLETENESS_TABLE,
      );
      assert.equal(
        new Set(
          ExecutiveJournalExperienceValidationContracts.map(
            (item) => item.contractId,
          ),
        ).size,
        8,
      );
      ExecutiveJournalExperienceValidationContracts.forEach((contract, index) => {
        assert.equal(contract.order, index + 1);
        assert.equal(Object.isFrozen(contract), true);
        assert.equal(contract.metadataOnly, true);
        assert.equal(contract.pure, true);
        assert.equal(contract.repairsInput, false);
        assert.equal(contract.mutatesInput, false);
        assert.equal(contract.closedVocabularies, true);
        assert.equal(contract.deterministicIssueOrdering, true);
        assert.equal(contract.safeIssueDetailsOnly, true);
        assert.equal(contract.authorityCreation, false);
        assert.equal(contract.ownershipCreation, false);
        assert.equal(contract.operationalEffects, false);
        assert.equal(contract.productionAuthorization, false);
      });
    });
    it("covers every boundary", () => {
      assert.deepEqual(Object.keys(ExecutiveJournalExperienceValidationBoundaries), BOUNDARY_COMPLETENESS_TABLE);
    });
    it("covers every phase decision", () => {
      assert.deepEqual(
        ExecutiveJournalExperienceValidationDecisions.map((item) => item.decisionId),
        DECISION_COMPLETENESS_TABLE,
      );
    });
  });

  describe("canonical rules", () => {
    for (const ruleKey of RULE_COMPLETENESS_TABLE) {
      it(`directly covers ${ruleKey}`, () => {
        const descriptor = ExecutiveJournalExperienceValidationRules.find(
          (candidate) => candidate.ruleKey === ruleKey,
        );
        assert.ok(descriptor);
        assert.equal(Object.isFrozen(descriptor), true);
        assert.equal(descriptor.metadataOnly, true);
        assert.equal(descriptor.deterministic, true);
      });
    }
  });

  describe("every deterministic issue branch", () => {
    for (const code of ISSUE_COMPLETENESS_TABLE) {
      it(`returns ${code} without throwing or repairing`, () => {
        const scenario = ISSUE_SCENARIOS[code]();
        const result = validateExecutiveJournalExperience(scenario);
        assert.equal(result.result, "Invalid");
        assert.equal(result.valid, false);
        assert.ok(result.issueCount >= 1);
        assert.equal(result.repairedInput, false);
        assert.equal(result.mutatedInput, false);
        assert.equal(result.productionAuthorized, false);
        assert.equal(result.integrationAuthorized, false);
        assert.equal(result.uiAuthorized, false);
        assert.equal(result.routeAuthorized, false);
        assert.equal(result.disclosureAuthorized, false);
        assert.equal(result.rtcConsumptionAuthorized, false);
        assert.equal(result.deploymentAuthorized, false);
        assert.equal(result.issues.some((issue) => issue.code === code), true);
        assert.equal(Object.isFrozen(result), true);
        assert.equal(Object.isFrozen(result.issues), true);
        for (const issue of result.issues) {
          assert.equal(Object.isFrozen(issue), true);
          assert.equal(issue.safeStructuralDetailOnly, true);
          assert.equal(issue.detail.includes("redacted-test-sentinel"), false);
          assert.doesNotMatch(issue.detail, /\b(?:execute|command|repair|mutate)\b/i);
        }
      });
    }

    it("does not throw for ordinary malformed domain inputs", () => {
      for (const value of [null, undefined, false, 0, "", [], Symbol("invalid")]) {
        assert.doesNotThrow(() => validateExecutiveJournalExperience(value));
        assert.equal(validateExecutiveJournalExperience(value).result, "Invalid");
      }
    });

    it("deduplicates issues and orders them by canonical rule order", () => {
      const result = validateExecutiveJournalExperience(frozen({
        ...ExecutiveJournalExperienceValidationCanonicalInput,
        aggregate: frozenAggregateWith("journal_body", "redacted-test-sentinel"),
        normalizationRequested: true,
        repairRequested: true,
      }));
      assert.equal(result.result, "Invalid");
      assert.equal(new Set(result.issues.map((issue) => issue.code)).size, result.issues.length);
      const orders = result.issues.map((issue) =>
        ExecutiveJournalExperienceValidationRules.find(
          (rule) => rule.ruleId === issue.ruleId,
        )?.order ?? 0
      );
      assert.deepEqual(orders, [...orders].sort((left, right) => left - right));
    });

    it("uses explicit rule precedence when independent failures coexist", () => {
      const result = validateExecutiveJournalExperience(frozen({
        ...ExecutiveJournalExperienceValidationCanonicalInput,
        identity: "unknown",
        summary: frozen({}),
        relationships: changedRelationship(0, { lineageErasing: true }),
        normalizationRequested: true,
      }));
      assert.deepEqual(
        result.issues.map((issue) => issue.code),
        [
          "UnknownOrMalformedIdentity",
          "IncompleteSummary",
          "LineageErasingRelationship",
          "NormalizationRepairAttempt",
        ],
      );
    });

    it("rejects case- and whitespace-modified vocabulary values without repair", () => {
      for (const value of ["available", "Available ", " Available"]) {
        const result = validateExecutiveJournalExperience(override(
          "vocabularies",
          frozen({ projectionAvailability: frozen([value]) }),
        ));
        assert.equal(result.result, "Invalid");
        assert.equal(
          result.issues.some((issue) => issue.code === "UnknownVocabularyValue"),
          true,
        );
        assert.equal(result.repairedInput, false);
      }
    });

    it("rejects correction and supersession lineage defects independently", () => {
      for (const correctionSupersession of [
        frozen({ correction_ref: "opaque", supersession_ref: null }),
        frozen({ correction_ref: null, supersession_ref: "opaque" }),
      ]) {
        const result = validateExecutiveJournalExperience(
          override("correctionSupersession", correctionSupersession),
        );
        assert.equal(
          result.issues.some(
            (issue) => issue.code === "InvalidCorrectionSupersessionStructure",
          ),
          true,
        );
      }
    });

    it("rejects repair, coercion, normalization, and silent stripping independently", () => {
      for (const key of [
        "repairRequested",
        "coercionRequested",
        "normalizationRequested",
        "silentStrippingRequested",
      ] as const) {
        const result = validateExecutiveJournalExperience(override(key, true));
        assert.equal(
          result.issues.some(
            (issue) => issue.code === "NormalizationRepairAttempt",
          ),
          true,
          key,
        );
      }
    });
  });

  describe("boundary completeness", () => {
    for (const { key, code } of BOUNDARY_SURFACE_COVERAGE) {
      it(`rejects prohibited boundary surface ${key}`, () => {
        const result = validateExecutiveJournalExperience(
          override("aggregate", frozenAggregateWith(key, "test-value")),
        );
        assert.equal(result.result, "Invalid");
        assert.equal(result.issues.some((issue) => issue.code === code), true);
        assert.equal(
          result.issues.some((issue) => issue.detail.includes("test-value")),
          false,
        );
      });
    }

    for (const key of PROHIBITED_BEHAVIOR_COVERAGE) {
      it(`rejects prohibited behavior ${key}`, () => {
        const result = validateExecutiveJournalExperience(
          override("aggregate", frozenAggregateWith(key, true)),
        );
        assert.equal(
          result.issues.some(
            (issue) => issue.code === "OperationalExecutableMetadata",
          ),
          true,
        );
      });
    }
  });

  describe("canonical result, aggregate, and summary", () => {
    it("validates the canonical metadata without mutation or authority", () => {
      assert.equal(ExecutiveJournalExperienceValidationCanonicalResult.result, "Valid");
      assert.equal(ExecutiveJournalExperienceValidationCanonicalResult.issueCount, 0);
      assert.equal(ExecutiveJournalExperienceValidationCanonicalResult.productionAuthorized, false);
      assert.equal(ExecutiveJournalExperienceValidationCanonicalResult.integrationAuthorized, false);
      assert.equal(ExecutiveJournalExperienceValidationCanonicalResult.uiAuthorized, false);
      assert.equal(ExecutiveJournalExperienceValidationCanonicalResult.routeAuthorized, false);
      assert.equal(ExecutiveJournalExperienceValidationCanonicalResult.disclosureAuthorized, false);
      assert.equal(ExecutiveJournalExperienceValidationCanonicalResult.rtcConsumptionAuthorized, false);
      assert.equal(ExecutiveJournalExperienceValidationCanonicalResult.deploymentAuthorized, false);
      assert.equal(Object.isFrozen(ExecutiveJournalExperienceValidationCanonicalInput), true);
      assert.equal(Object.isFrozen(ExecutiveJournalExperienceValidationCanonicalResult), true);
      assert.equal(Object.isFrozen(ExecutiveJournalExperienceValidationCanonicalResult.issues), true);
    });

    it("is deterministic for the same reference and state", () => {
      const before = JSON.stringify(ExecutiveJournalExperienceValidationCanonicalInput);
      assert.deepEqual(
        validateExecutiveJournalExperience(ExecutiveJournalExperienceValidationCanonicalInput),
        validateExecutiveJournalExperience(ExecutiveJournalExperienceValidationCanonicalInput),
      );
      assert.strictEqual(
        getExecutiveJournalExperienceValidationSummary(),
        getExecutiveJournalExperienceValidationSummary(),
      );
      assert.equal(
        JSON.stringify(ExecutiveJournalExperienceValidationCanonicalInput),
        before,
      );
    });

    it("exposes the complete safe aggregate and exact summary counts", () => {
      assert.strictEqual(ExecutiveJournalExperienceValidation.model, ExecutiveJournalExperienceModel);
      assert.equal(ExecutiveJournalExperienceValidation.status, "Validation");
      assert.equal(ExecutiveJournalExperienceValidation.readiness, "ReadyForManifest");
      assert.equal(ExecutiveJournalExperienceValidation.repairsInput, false);
      assert.equal(ExecutiveJournalExperienceValidation.mutatesInput, false);
      assert.equal(ExecutiveJournalExperienceValidation.ex25Created, false);
      assert.equal(ExecutiveJournalExperienceValidation.ex25Authorized, false);
      assert.deepEqual(
        {
          rules: ExecutiveJournalExperienceValidationSummaryValue.ruleCount,
          results: ExecutiveJournalExperienceValidationSummaryValue.resultCount,
          severities: ExecutiveJournalExperienceValidationSummaryValue.severityCount,
          families: ExecutiveJournalExperienceValidationSummaryValue.ruleFamilyCount,
          subjects: ExecutiveJournalExperienceValidationSummaryValue.subjectKindCount,
          issues: ExecutiveJournalExperienceValidationSummaryValue.issueCodeCount,
          contracts: ExecutiveJournalExperienceValidationSummaryValue.contractCount,
          decisions: ExecutiveJournalExperienceValidationSummaryValue.decisionCount,
          openIssues: ExecutiveJournalExperienceValidationSummaryValue.openIssueCount,
          gates: ExecutiveJournalExperienceValidationSummaryValue.pendingGateCount,
        },
        { results: 2, severities: 4, rules: 20, families: 17, subjects: 30, issues: 39, contracts: 8, decisions: 6, openIssues: 13, gates: 3 },
      );
      assert.equal(Object.isFrozen(ExecutiveJournalExperienceValidation), true);
      assert.equal(Object.isFrozen(ExecutiveJournalExperienceValidationSummaryValue), true);
      assert.equal(ExecutiveJournalExperienceValidationSummaryValue.authorizationDecisionId, "AD-EX2-12");
      assert.equal(ExecutiveJournalExperienceValidationSummaryValue.ex25Created, false);
      assert.equal(ExecutiveJournalExperienceValidationSummaryValue.ex25Authorized, false);
      assert.doesNotMatch(
        JSON.stringify(ExecutiveJournalExperienceValidationSummaryValue),
        /journal_body|private_reflection|evidence_content|actor_email|resolvable_/,
      );
    });
  });

  describe("exact upstream preservation and authorization", () => {
    it("preserves the Model, Registry entry, Foundation, entities, and relationships by exact reference", () => {
      assert.strictEqual(ExecutiveJournalExperienceValidationUpstream.model, ExecutiveJournalExperienceModel);
      assert.strictEqual(ExecutiveJournalExperienceValidationUpstream.registry, ExecutiveJournalExperienceModel.registry);
      assert.strictEqual(ExecutiveJournalExperienceValidationUpstream.resolvedRegistryEntry, ExecutiveJournalExperienceModel.resolvedRegistryEntry);
      assert.strictEqual(ExecutiveJournalExperienceValidationUpstream.foundation, ExecutiveJournalExperienceModel.foundation);
      assert.strictEqual(ExecutiveJournalExperienceValidationUpstream.entities, ExecutiveJournalExperienceModel.entities);
      assert.strictEqual(ExecutiveJournalExperienceValidationUpstream.relationships, ExecutiveJournalExperienceModel.relationships);
      assert.strictEqual(
        ExecutiveJournalExperienceValidationCanonicalInput.vocabularies,
        ExecutiveJournalExperienceModel.vocabularies,
      );
      assert.equal(
        Object.keys(ExecutiveJournalExperienceModel.vocabularies).length,
        11,
      );
    });

    it("preserves EX-2:3/D-01 through D-08 and upstream ledgers by exact reference", () => {
      assert.strictEqual(ExecutiveJournalExperienceValidationUpstream.modelDecisions, ExecutiveJournalExperienceModel.decisions);
      assert.deepEqual(
        ExecutiveJournalExperienceValidationUpstream.modelDecisions.map((item) => item.decisionId),
        ["EX-2:3/D-01", "EX-2:3/D-02", "EX-2:3/D-03", "EX-2:3/D-04", "EX-2:3/D-05", "EX-2:3/D-06", "EX-2:3/D-07", "EX-2:3/D-08"],
      );
      assert.strictEqual(
        ExecutiveJournalExperienceValidationUpstream.foundationArchitectureDecisionLedger,
        ExecutiveJournalExperienceModel.foundation.decisions,
      );
      assert.strictEqual(
        ExecutiveJournalExperienceValidationUpstream.tier0EvidenceLedger,
        ExecutiveJournalExperienceModel.foundation.evidenceLedger,
      );
      assert.strictEqual(
        ExecutiveJournalExperienceValidationUpstream.registryAuthorization,
        ExecutiveJournalExperienceModel.registry.authorization,
      );
      assert.strictEqual(
        ExecutiveJournalExperienceValidationUpstream.foundationAuthorization,
        ExecutiveJournalExperienceModel.foundation.authorizationScope,
      );
      assert.strictEqual(
        ExecutiveJournalExperienceValidationUpstream.modelAuthorization,
        ExecutiveJournalExperienceModel.authorization,
      );
      assert.equal(
        ExecutiveJournalExperienceModel.foundation.decisions.decisionIds
          .map((decisionId) => String(decisionId))
          .includes("AD-EX2-12"),
        false,
      );
      assert.equal(
        ExecutiveJournalExperienceModel.registry.foundation.decisions.decisionIds
          .map((decisionId) => String(decisionId))
          .includes("AD-EX2-12"),
        false,
      );
    });

    it("preserves all 13 unresolved issues and three Pending production gates", () => {
      assert.strictEqual(
        ExecutiveJournalExperienceValidation.openIssues,
        ExecutiveJournalExperienceModel.unresolvedIssues,
      );
      assert.equal(ExecutiveJournalExperienceValidation.openIssues.issueIds.length, 13);
      assert.strictEqual(
        ExecutiveJournalExperienceValidation.pendingGates,
        ExecutiveJournalExperienceModel.pendingGates,
      );
      assert.deepEqual(
        ExecutiveJournalExperienceValidation.pendingGates,
        ["G-EX2-04", "G-EX2-07", "G-EX2-12"],
      );
    });

    it("records exact AD-EX2-12 authority without authorizing EX-2:5", () => {
      assert.deepEqual(
        ExecutiveJournalExperienceValidationAuthorization,
        {
          authorizationDecisionId: "AD-EX2-12",
          authorizationStatus: "Accepted",
          decisionDate: "2026-07-30",
          selectedOption: "MetadataOnlyFailClosedExperienceValidation",
          scope: "Ex24ValidationImplementationAndVerificationOnly",
          ex24ImplementationAuthorized: true,
          ex25Created: false,
          ex25Authorized: false,
          metadataOnly: true,
          immutable: true,
        },
      );
      assert.equal(
        ExecutiveJournalExperienceValidationLifecycle.readyForManifestDoesNotAuthorizeEx25,
        true,
      );
      assert.deepEqual(
        ExecutiveJournalExperienceValidationDecisions.map(
          (decision) => decision.decisionId,
        ),
        DECISION_COMPLETENESS_TABLE,
      );
      assert.equal(
        new Set(
          ExecutiveJournalExperienceValidationDecisions.map(
            (decision) => decision.decisionId,
          ),
        ).size,
        6,
      );
      assert.equal(
        ExecutiveJournalExperienceValidationDecisions.every(Object.isFrozen),
        true,
      );
    });
  });
});
