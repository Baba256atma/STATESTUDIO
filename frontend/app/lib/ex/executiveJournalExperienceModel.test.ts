import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import {
  ExecutiveJournalExperienceModel,
  ExecutiveJournalExperienceModelId,
  ExecutiveJournalExperienceModelIdentity,
  ExecutiveJournalExperienceModelNamespace,
  ExecutiveJournalExperienceModelReadiness,
  ExecutiveJournalExperienceModelStatus,
  ExecutiveJournalExperienceModelUpstream,
  assertExecutiveJournalExperienceModelIdentity,
  getExecutiveJournalExperienceModelSummary,
  resolveExecutiveJournalExperienceModelIdentity,
} from "./executiveJournalExperienceModel.ts";
import {
  ExecutiveJournalExperienceModelContracts,
  ExecutiveJournalExperienceModelRelationships,
  ExecutiveJournalExperienceModelVocabularies,
  assertExecutiveJournalExperienceModelVocabularyValue,
  getExecutiveJournalExperienceModelRelationship,
  isExecutiveJournalExperienceModelVocabularyValue,
} from "./executiveJournalExperienceModelContracts.ts";
import {
  ExecutiveJournalExperienceModelEntities,
  ExecutiveJournalExperienceModelEntityKinds,
  getExecutiveJournalExperienceModelEntity,
} from "./executiveJournalExperienceModelEntities.ts";
import {
  ExecutiveJournalExperienceModelApprovedAliases,
  ExecutiveJournalExperienceModelNextPhaseMetadata,
  ExecutiveJournalExperienceModelPhase,
  ExecutiveJournalExperienceModelPreviousPhase,
  ExecutiveJournalExperienceModelRoot,
} from "./executiveJournalExperienceModelIdentity.ts";
import {
  ExecutiveJournalExperienceModelLifecycle,
  ExecutiveJournalExperienceModelLifecycleStates,
  assertExecutiveJournalExperienceModelLifecycleTransition,
  canTransitionExecutiveJournalExperienceModelLifecycle,
} from "./executiveJournalExperienceModelLifecycle.ts";
import {
  ExecutiveJournalExperienceModelAuthorization,
  ExecutiveJournalExperienceModelBoundaries,
  ExecutiveJournalExperienceModelDecisions,
  ExecutiveJournalExperienceModelMetadata,
} from "./executiveJournalExperienceModelMetadata.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const MODEL_FILES = Object.freeze([
  "executiveJournalExperienceModel.ts",
  "executiveJournalExperienceModelTypes.ts",
  "executiveJournalExperienceModelIdentity.ts",
  "executiveJournalExperienceModelLifecycle.ts",
  "executiveJournalExperienceModelContracts.ts",
  "executiveJournalExperienceModelEntities.ts",
  "executiveJournalExperienceModelMetadata.ts",
  "executiveJournalExperienceModel.test.ts",
] as const);

const ENTITY_COMPLETENESS_TABLE = Object.freeze([
  Object.freeze({ kind: "ExecutiveJournalExperience", order: 1 }),
  Object.freeze({ kind: "JournalProjection", order: 2 }),
  Object.freeze({ kind: "JournalEntryList", order: 3 }),
  Object.freeze({ kind: "JournalEntrySummary", order: 4 }),
  Object.freeze({ kind: "JournalEntryDetail", order: 5 }),
  Object.freeze({ kind: "EntryCategoryPresentation", order: 6 }),
  Object.freeze({ kind: "LifecyclePresentation", order: 7 }),
  Object.freeze({ kind: "OriginPresentation", order: 8 }),
  Object.freeze({ kind: "AuthorityPresentation", order: 9 }),
  Object.freeze({ kind: "IntegrityPresentation", order: 10 }),
  Object.freeze({ kind: "ProvenancePresentation", order: 11 }),
  Object.freeze({ kind: "CorrectionSupersessionPresentation", order: 12 }),
  Object.freeze({ kind: "JournalFilterModel", order: 13 }),
  Object.freeze({ kind: "Tier0EvidenceReference", order: 14 }),
] as const);

const ENTITY_KINDS = Object.freeze(
  ENTITY_COMPLETENESS_TABLE.map((item) => item.kind),
);

const RELATIONSHIP_COMPLETENESS_TABLE = Object.freeze([
  Object.freeze({ kind: "ExperienceContainsProjection", from: "ExecutiveJournalExperience", to: "JournalProjection", order: 1 }),
  Object.freeze({ kind: "ProjectionContainsEntryList", from: "JournalProjection", to: "JournalEntryList", order: 2 }),
  Object.freeze({ kind: "EntryListContainsSummaries", from: "JournalEntryList", to: "JournalEntrySummary", order: 3 }),
  Object.freeze({ kind: "SelectedSummaryPresentsDetail", from: "JournalEntrySummary", to: "JournalEntryDetail", order: 4 }),
  Object.freeze({ kind: "DetailPresentsCategory", from: "JournalEntryDetail", to: "EntryCategoryPresentation", order: 5 }),
  Object.freeze({ kind: "DetailPresentsLifecycle", from: "JournalEntryDetail", to: "LifecyclePresentation", order: 6 }),
  Object.freeze({ kind: "DetailPresentsOrigin", from: "JournalEntryDetail", to: "OriginPresentation", order: 7 }),
  Object.freeze({ kind: "DetailPresentsAuthority", from: "JournalEntryDetail", to: "AuthorityPresentation", order: 8 }),
  Object.freeze({ kind: "DetailPresentsIntegrity", from: "JournalEntryDetail", to: "IntegrityPresentation", order: 9 }),
  Object.freeze({ kind: "DetailPresentsProvenance", from: "JournalEntryDetail", to: "ProvenancePresentation", order: 10 }),
  Object.freeze({ kind: "DetailPresentsCorrectionSupersession", from: "JournalEntryDetail", to: "CorrectionSupersessionPresentation", order: 11 }),
  Object.freeze({ kind: "FilterConstrainsEntryList", from: "JournalFilterModel", to: "JournalEntryList", order: 12 }),
  Object.freeze({ kind: "Tier0EvidenceSupportsModelProvenance", from: "Tier0EvidenceReference", to: "ExecutiveJournalExperience", order: 13 }),
] as const);

const VOCABULARY_COMPLETENESS_TABLE = Object.freeze({
  projectionAvailability: Object.freeze(["Available", "Empty", "Denied", "Unavailable", "Stale", "Invalid"] as const),
  presentationState: Object.freeze(["Loading", "Ready", "Empty", "NotFound", "PrivacyRejected", "UnsupportedVersion", "IntegrityUnavailable", "ProviderUnavailable", "Failure"] as const),
  entryCategory: Object.freeze(["Commitment", "Risk", "Exception", "Outcome", "Control", "General"] as const),
  lifecycle: Object.freeze(["Proposed", "Accepted", "Disputed", "Superseded", "Closed", "Disposed"] as const),
  origin: Object.freeze(["HumanOrigin", "AiProposed", "SystemDerived"] as const),
  authority: Object.freeze(["Present", "Absent", "Unavailable"] as const),
  integrity: Object.freeze(["Verified", "Failed", "Unavailable"] as const),
  referencePresence: Object.freeze(["Present", "Absent"] as const),
  filterState: Object.freeze(["All", "Filtered", "NoMatches"] as const),
  sourceClassification: Object.freeze(["SyntheticSourceOnly", "ProductionSourceNotIntegrated"] as const),
  tier0EvidenceClassification: Object.freeze(["SyntheticTier0SupportingEvidenceOnly"] as const),
});

const CONTRACT_COMPLETENESS_TABLE = Object.freeze([
  "EX-2:3/Contract/MetadataOnlyProjection",
  "EX-2:3/Contract/ReadOnlyPresentation",
  "EX-2:3/Contract/OpaqueReferences",
  "EX-2:3/Contract/DescriptiveAuthority",
  "EX-2:3/Contract/PrivacyExclusion",
  "EX-2:3/Contract/LineagePreservation",
  "EX-2:3/Contract/AllowlistedFilters",
  "EX-2:3/Contract/Tier0EvidenceReferenceOnly",
] as const);

const DECISION_COMPLETENESS_TABLE = Object.freeze([
  "EX-2:3/D-01",
  "EX-2:3/D-02",
  "EX-2:3/D-03",
  "EX-2:3/D-04",
  "EX-2:3/D-05",
  "EX-2:3/D-06",
  "EX-2:3/D-07",
  "EX-2:3/D-08",
] as const);

const FALSE_BOUNDARY_KEYS = Object.freeze([
  "directFoundationImport",
  "directArchitectureImport",
  "rtcRuntimeImport",
  "app8Import",
  "reactNextUiImport",
  "routeImport",
  "tier0UiHarnessProviderFixtureImport",
  "network",
  "persistence",
  "telemetry",
  "cloud",
  "clock",
  "randomness",
  "mutation",
  "authorityCreation",
  "productionIntegration",
  "deployment",
  "createsEx24",
  "narrativePayload",
  "rationaleOrPrivateReflection",
  "privateReflectionSignals",
  "evidenceContent",
  "resolvableEvidenceUri",
  "authorityEvidence",
  "actorPii",
  "jurisdictionOrLocation",
  "retentionDisclosureExportInstructions",
  "operationalCommands",
] as const);

const BOUNDARY_COMPLETENESS_TABLE = Object.freeze([
  Object.freeze({
    key: "boundariesId",
    expected: "EX-2:3/ExecutiveJournalExperienceModelBoundaries",
  }),
  Object.freeze({ key: "importsRegistryOnlyAtRuntime", expected: true }),
  ...FALSE_BOUNDARY_KEYS.map((key) =>
    Object.freeze({ key, expected: false as const })
  ),
  Object.freeze({ key: "metadataOnly", expected: true }),
  Object.freeze({ key: "immutable", expected: true }),
] as const);

const PROHIBITED_FIELD_NAMES = Object.freeze([
  "body",
  "narrative",
  "rationale",
  "private_reflection",
  "private_reflection_exists",
  "private_reflection_count",
  "private_reflection_timestamp",
  "evidence_content",
  "evidence_uri",
  "actor_name",
  "actor_email",
  "jurisdiction",
  "location",
  "retention_instruction",
  "disclosure_instruction",
  "export_instruction",
  "command",
] as const);

const isDeeplyFrozen = (value: unknown): boolean => {
  if (value === null || typeof value !== "object") {
    return true;
  }
  if (!Object.isFrozen(value)) {
    return false;
  }
  return Object.values(value as Record<string, unknown>).every(isDeeplyFrozen);
};

describe("EX-2:3 Executive Journal Experience Model", () => {
  describe("package inventory", () => {
    it("contains exactly the eight authorized Model files and no EX-2:7+", () => {
      const present = readdirSync(HERE);
      const modelFiles = present.filter((name) =>
        /^executiveJournalExperienceModel(?:Types|Identity|Lifecycle|Contracts|Entities|Metadata)?(?:\.test)?\.ts$/.test(
          name,
        )
      );
      assert.deepEqual(modelFiles.sort(), [...MODEL_FILES].sort());
      assert.equal(modelFiles.length, 8);
      assert.equal(
        present.some((name) =>
          /^executiveJournalExperience(?:Certification|Freeze|PublicIndex)/.test(
            name,
          )
        ),
        false,
      );
    });

    it("has an acyclic internal production dependency graph", () => {
      const productionFiles = MODEL_FILES.filter((name) => !name.endsWith(".test.ts"));
      const productionFileSet = new Set<string>(productionFiles);
      const graph = new Map<string, readonly string[]>();
      for (const file of productionFiles) {
        const source = readFileSync(join(HERE, file), "utf8");
        const dependencies = [...source.matchAll(/\bfrom\s+["']\.\/([^"']+\.ts)["']/g)]
          .map((match) => match[1]!)
          .filter((dependency) => productionFileSet.has(dependency));
        graph.set(file, Object.freeze(dependencies));
      }
      const visiting = new Set<string>();
      const visited = new Set<string>();
      const visit = (file: string): void => {
        assert.equal(visiting.has(file), false, `circular dependency at ${file}`);
        if (visited.has(file)) {
          return;
        }
        visiting.add(file);
        for (const dependency of graph.get(file) ?? []) {
          visit(dependency);
        }
        visiting.delete(file);
        visited.add(file);
      };
      for (const file of productionFiles) {
        visit(file);
      }
      assert.equal(visited.size, productionFiles.length);
    });
  });

  describe("identity", () => {
    it("publishes the exact identity, namespace, status, readiness and phases", () => {
      assert.equal(ExecutiveJournalExperienceModelId, "EX-2:3/ExecutiveJournalExperienceModel");
      assert.equal(ExecutiveJournalExperienceModelNamespace, "nexora.ex.executive.journal.experience.model");
      assert.equal(ExecutiveJournalExperienceModelStatus, "Model");
      assert.equal(ExecutiveJournalExperienceModelReadiness, "ReadyForValidation");
      assert.equal(ExecutiveJournalExperienceModelPhase, "EX-2:3");
      assert.equal(ExecutiveJournalExperienceModelPreviousPhase, "EX-2:2 — Executive Journal Experience Registry");
      assert.equal(ExecutiveJournalExperienceModelNextPhaseMetadata, "EX-2:4 — Executive Journal Experience Validation");
      assert.equal(ExecutiveJournalExperienceModelRoot, "ExecutiveJournalExperience");
      assert.equal(ExecutiveJournalExperienceModelIdentity.metadataOnly, true);
      assert.equal(ExecutiveJournalExperienceModelIdentity.sideEffectFree, true);
      assert.equal(isDeeplyFrozen(ExecutiveJournalExperienceModelIdentity), true);
    });

    it("accepts only exact canonical identities and approved aliases", () => {
      for (const value of [
        ExecutiveJournalExperienceModelId,
        ExecutiveJournalExperienceModelNamespace,
        ...ExecutiveJournalExperienceModelApprovedAliases,
      ]) {
        assert.equal(resolveExecutiveJournalExperienceModelIdentity(value).ok, true);
        assert.equal(assertExecutiveJournalExperienceModelIdentity(value), ExecutiveJournalExperienceModelId);
      }
      for (const value of [
        "ExecutiveJournalExperience",
        "EX-2:3/ExecutiveJournalExperience",
        "ex-2:3/ExecutiveJournalExperienceModel",
        "EX-2:3/ExecutiveJournalExperienceModeI",
        "nexora.ex.executive.journal.experience.modeI",
        "ExecutiveJournalModel",
        "EX-2:2/ExecutiveJournalExperienceRegistry",
        "EX-1:3/ExecutiveStageModel",
        "RTC-2:3/Model",
        " EX-2:3/ExecutiveJournalExperienceModel",
        "EX-2:3/ExecutiveJournalExperienceModel ",
        "",
        null,
        undefined,
      ]) {
        assert.equal(resolveExecutiveJournalExperienceModelIdentity(value).ok, false);
        assert.throws(() => assertExecutiveJournalExperienceModelIdentity(value));
      }
    });

    it("does not treat ReadyForValidation as EX-2:4 authorization", () => {
      assert.equal(ExecutiveJournalExperienceModel.readiness, "ReadyForValidation");
      assert.equal(ExecutiveJournalExperienceModel.ex24Created, false);
      assert.equal(ExecutiveJournalExperienceModel.ex24Authorized, false);
      assert.equal(ExecutiveJournalExperienceModelMetadata.readyForValidationDoesNotAuthorizeEx24, true);
    });
  });

  describe("upstream dependency chain", () => {
    it("preserves exact Registry, entry, and Foundation references", () => {
      const upstream = ExecutiveJournalExperienceModelUpstream;
      assert.equal(upstream.registry.identity.id, "EX-2:2/ExecutiveJournalExperienceRegistry");
      assert.equal(upstream.registry.status, "Registry");
      assert.equal(upstream.registry.readiness, "ReadyForModel");
      assert.equal(upstream.registry.sealed, true);
      assert.equal(upstream.registry.entries.length, 1);
      assert.equal(upstream.registryEntry, upstream.registry.canonicalEntry);
      assert.equal(upstream.registryEntry.controlId, "EX-2:1/ExecutiveJournalExperienceFoundation");
      assert.equal(upstream.foundation, upstream.registryEntry.foundation);
      assert.equal(upstream.foundation, upstream.registry.foundation);
      assert.equal(upstream.foundation.readiness, "ReadyForRegistry");
      assert.equal(upstream.foundationBoundaries, upstream.foundation.boundaries);
      assert.equal(upstream.foundationPrinciples, upstream.foundation.principles);
      assert.equal(upstream.foundationArchitectureDecisionLedger, upstream.foundation.decisions);
      assert.equal(upstream.tier0SupportingEvidenceLedger, upstream.foundation.evidenceLedger);
      assert.equal(upstream.openIssues, upstream.foundation.openIssues);
      assert.equal(upstream.pendingGates, upstream.foundation.pendingGates);
    });

    it("keeps AD-EX2-09 and AD-EX2-10 outside the Foundation ledger", () => {
      const ids =
        ExecutiveJournalExperienceModelUpstream.foundation.decisions.decisionIds;
      assert.deepEqual(ids, [
        "AD-EX2-00",
        "AD-EX2-01",
        "AD-EX2-02",
        "AD-EX2-03",
        "AD-EX2-04",
        "AD-EX2-05",
        "AD-EX2-06",
        "AD-EX2-07",
        "AD-EX2-08",
      ]);
      assert.equal(ids.includes("AD-EX2-09"), false);
      assert.equal(ids.includes("AD-EX2-10"), false);
      assert.equal(ExecutiveJournalExperienceModelUpstream.registryAuthorization.authorizationId, "AD-EX2-09");
      assert.equal(ExecutiveJournalExperienceModelUpstream.modelAuthorizationDecisionId, "AD-EX2-10");
      assert.equal(ExecutiveJournalExperienceModelUpstream.adEx209InjectedIntoFoundationLedger, false);
      assert.equal(ExecutiveJournalExperienceModelUpstream.adEx210InjectedIntoFoundationLedger, false);
    });
  });

  describe("entity catalogue", () => {
    it("defines the exact ordered fourteen-entity catalogue and root", () => {
      assert.equal(ExecutiveJournalExperienceModelEntities.length, 14);
      assert.deepEqual(ExecutiveJournalExperienceModelEntityKinds, ENTITY_KINDS);
      assert.deepEqual(
        ExecutiveJournalExperienceModelEntities.map(({ kind, order }) => ({ kind, order })),
        ENTITY_COMPLETENESS_TABLE,
      );
      assert.equal(isDeeplyFrozen(ENTITY_COMPLETENESS_TABLE), true);
      assert.equal(ExecutiveJournalExperienceModelEntities[0], ExecutiveJournalExperienceModel.root);
      assert.equal(ExecutiveJournalExperienceModel.root.kind, "ExecutiveJournalExperience");
      assert.equal(ExecutiveJournalExperienceModelEntities.filter((entity) => entity.root).length, 1);
      assert.equal(new Set(ExecutiveJournalExperienceModelEntityKinds).size, 14);
    });

    for (const kind of ENTITY_KINDS) {
      it(`defines immutable safe entity ${kind}`, () => {
        const descriptor = getExecutiveJournalExperienceModelEntity(kind);
        assert.ok(descriptor);
        assert.equal(descriptor?.entityId, `EX-2:3/Entity/${kind}`);
        assert.equal(descriptor?.metadataOnly, true);
        assert.equal(descriptor?.owner, "EX");
        assert.equal(descriptor?.ownership, "PresentationConsumer");
        assert.equal(descriptor?.narrativePayloadAllowed, false);
        assert.equal(descriptor?.authorityCreationAllowed, false);
        assert.equal(descriptor?.mutationCommandsAllowed, false);
        assert.equal(descriptor?.executable, false);
        assert.equal(descriptor?.fieldCount, descriptor?.fields.length);
        assert.equal(isDeeplyFrozen(descriptor), true);
        for (const field of descriptor?.fields ?? []) {
          assert.equal(field.allowlistedPresentationMetadataOnly, true);
          assert.equal(field.mutable, false);
          assert.equal(PROHIBITED_FIELD_NAMES.includes(field.fieldName as never), false);
        }
      });
    }

    it("fails closed for unknown, normalized, and partial entity kinds", () => {
      for (const value of ["Unknown", "JournalEntry", "journalprojection", " JournalProjection", "JournalProjection "]) {
        assert.equal(getExecutiveJournalExperienceModelEntity(value), null);
      }
    });
  });

  describe("closed vocabularies", () => {
    it("keeps every vocabulary exact, unique, and immutable", () => {
      assert.deepEqual(
        ExecutiveJournalExperienceModelVocabularies,
        VOCABULARY_COMPLETENESS_TABLE,
      );
      assert.equal(isDeeplyFrozen(VOCABULARY_COMPLETENESS_TABLE), true);
      assert.equal(isDeeplyFrozen(ExecutiveJournalExperienceModelVocabularies), true);
      for (const [name, values] of Object.entries(VOCABULARY_COMPLETENESS_TABLE)) {
        assert.equal(new Set(values).size, values.length);
        for (const value of values) {
          assert.equal(isExecutiveJournalExperienceModelVocabularyValue(name, value), true);
          assert.equal(assertExecutiveJournalExperienceModelVocabularyValue(name, value), value);
          assert.equal(
            isExecutiveJournalExperienceModelVocabularyValue(name, value.toLowerCase()),
            false,
          );
          assert.equal(isExecutiveJournalExperienceModelVocabularyValue(name, ` ${value}`), false);
          assert.equal(isExecutiveJournalExperienceModelVocabularyValue(name, `${value} `), false);
        }
        const crossVocabularyValue = name === "entryCategory" ? "Verified" : "Commitment";
        assert.equal(
          isExecutiveJournalExperienceModelVocabularyValue(name, crossVocabularyValue),
          false,
        );
      }
    });

    it("rejects unknown, case, whitespace, repair, and cross-vocabulary values", () => {
      for (const [name, value] of [
        ["entryCategory", "commitment"],
        ["entryCategory", " Commitment"],
        ["entryCategory", "Commitment "],
        ["entryCategory", "Accepted"],
        ["sourceClassification", "RealRtc2"],
        ["tier0EvidenceClassification", "ProductionEvidence"],
        ["unknown", "Available"],
      ]) {
        assert.equal(isExecutiveJournalExperienceModelVocabularyValue(name, value), false);
        assert.throws(() => assertExecutiveJournalExperienceModelVocabularyValue(name, value));
      }
    });
  });

  describe("relationship catalogue", () => {
    it("defines the exact closed valid graph", () => {
      assert.equal(ExecutiveJournalExperienceModelRelationships.length, 13);
      assert.deepEqual(
        ExecutiveJournalExperienceModelRelationships.map(
          ({ kind, from, to, order }) => ({ kind, from, to, order }),
        ),
        RELATIONSHIP_COMPLETENESS_TABLE,
      );
      assert.equal(isDeeplyFrozen(RELATIONSHIP_COMPLETENESS_TABLE), true);
      assert.equal(
        new Set(RELATIONSHIP_COMPLETENESS_TABLE.map((item) => item.kind)).size,
        RELATIONSHIP_COMPLETENESS_TABLE.length,
      );
      for (const relationship of ExecutiveJournalExperienceModelRelationships) {
        assert.ok(getExecutiveJournalExperienceModelEntity(relationship.from));
        assert.ok(getExecutiveJournalExperienceModelEntity(relationship.to));
        assert.equal(relationship.authorityCreating, false);
        assert.equal(relationship.ownershipCreating, false);
        assert.equal(relationship.confirmationCreating, false);
        assert.equal(relationship.disclosurePermissionCreating, false);
        assert.equal(relationship.lifecycleTruthCreating, false);
        assert.equal(relationship.lineageErasing, false);
        assert.equal(relationship.executable, false);
        assert.equal(relationship.metadataOnly, true);
        assert.equal(isDeeplyFrozen(relationship), true);
      }
    });

    it("rejects unknown and normalized relationship identities", () => {
      assert.equal(getExecutiveJournalExperienceModelRelationship("CreatesAuthority"), null);
      assert.equal(getExecutiveJournalExperienceModelRelationship("ExperienceContains"), null);
      assert.equal(getExecutiveJournalExperienceModelRelationship(" experiencecontainsprojection"), null);
      assert.equal(getExecutiveJournalExperienceModelRelationship("ExperienceContainsProjection "), null);
    });
  });

  describe("model lifecycle", () => {
    it("is ordered, forward-only, deterministic, sealed, and ReadyForValidation", () => {
      assert.deepEqual(ExecutiveJournalExperienceModelLifecycleStates, [
        "Declared",
        "UpstreamBound",
        "EntityModelConstructed",
        "Sealed",
        "ReadyForValidation",
      ]);
      for (let index = 0; index < ExecutiveJournalExperienceModelLifecycleStates.length - 1; index += 1) {
        const from: (typeof ExecutiveJournalExperienceModelLifecycleStates)[number] =
          ExecutiveJournalExperienceModelLifecycleStates[index]!;
        const to: (typeof ExecutiveJournalExperienceModelLifecycleStates)[number] =
          ExecutiveJournalExperienceModelLifecycleStates[index + 1]!;
        assert.equal(canTransitionExecutiveJournalExperienceModelLifecycle(from, to), true);
        assert.equal(assertExecutiveJournalExperienceModelLifecycleTransition(from, to), true);
        assert.equal(canTransitionExecutiveJournalExperienceModelLifecycle(to, from), false);
      }
      assert.equal(ExecutiveJournalExperienceModelLifecycle.currentState, "ReadyForValidation");
      assert.equal(ExecutiveJournalExperienceModelLifecycle.journalRuntimeLifecycle, false);
      assert.equal(ExecutiveJournalExperienceModelLifecycle.executesTransitions, false);
      assert.equal(ExecutiveJournalExperienceModelLifecycle.metadataOnly, true);
      assert.equal(ExecutiveJournalExperienceModelLifecycle.immutable, true);
      assert.equal(ExecutiveJournalExperienceModelLifecycle.deterministic, true);
      assert.equal(isDeeplyFrozen(ExecutiveJournalExperienceModelLifecycle), true);
      for (
        let fromIndex = 0;
        fromIndex < ExecutiveJournalExperienceModelLifecycleStates.length;
        fromIndex += 1
      ) {
        for (
          let toIndex = 0;
          toIndex < ExecutiveJournalExperienceModelLifecycleStates.length;
          toIndex += 1
        ) {
          const from: (typeof ExecutiveJournalExperienceModelLifecycleStates)[number] =
            ExecutiveJournalExperienceModelLifecycleStates[fromIndex]!;
          const to: (typeof ExecutiveJournalExperienceModelLifecycleStates)[number] =
            ExecutiveJournalExperienceModelLifecycleStates[toIndex]!;
          const expected = toIndex === fromIndex + 1;
          assert.equal(
            canTransitionExecutiveJournalExperienceModelLifecycle(from, to),
            expected,
            `${from} → ${to}`,
          );
          if (!expected) {
            assert.throws(() =>
              assertExecutiveJournalExperienceModelLifecycleTransition(from, to)
            );
          }
        }
      }
      for (const unknown of ["", "declared", " Declared", "Declared ", "EX-2:4", null, undefined]) {
        assert.equal(
          canTransitionExecutiveJournalExperienceModelLifecycle(unknown, "Declared"),
          false,
        );
        assert.equal(
          canTransitionExecutiveJournalExperienceModelLifecycle("Declared", unknown),
          false,
        );
      }
    });
  });

  describe("contracts, metadata, and boundaries", () => {
    it("publishes immutable non-executable contracts and model decisions", () => {
      assert.equal(ExecutiveJournalExperienceModelContracts.length, 8);
      assert.equal(ExecutiveJournalExperienceModelDecisions.length, 8);
      assert.deepEqual(
        ExecutiveJournalExperienceModelContracts.map((contract) => contract.contractId),
        CONTRACT_COMPLETENESS_TABLE,
      );
      assert.deepEqual(
        ExecutiveJournalExperienceModelDecisions.map((decision) => decision.decisionId),
        DECISION_COMPLETENESS_TABLE,
      );
      assert.equal(new Set(ExecutiveJournalExperienceModelDecisions.map((decision) => decision.decisionId)).size, 8);
      assert.equal(ExecutiveJournalExperienceModelDecisions.every((decision) => decision.decisionId.startsWith("EX-2:3/D-")), true);
      assert.equal(isDeeplyFrozen(CONTRACT_COMPLETENESS_TABLE), true);
      assert.equal(isDeeplyFrozen(DECISION_COMPLETENESS_TABLE), true);
      assert.equal(isDeeplyFrozen(ExecutiveJournalExperienceModelContracts), true);
      assert.equal(isDeeplyFrozen(ExecutiveJournalExperienceModelDecisions), true);
    });

    for (const [index, contractId] of CONTRACT_COMPLETENESS_TABLE.entries()) {
      it(`directly verifies model contract ${contractId}`, () => {
        const contract = ExecutiveJournalExperienceModelContracts[index]!;
        assert.equal(contract.contractId, contractId);
        assert.equal(contract.order, index + 1);
        assert.match(contract.statement, /\S/);
        assert.equal(contract.executable, false);
        assert.equal(contract.metadataOnly, true);
        assert.equal(contract.immutable, true);
        assert.equal(isDeeplyFrozen(contract), true);
      });
    }

    for (const [index, decisionId] of DECISION_COMPLETENESS_TABLE.entries()) {
      it(`directly verifies model decision ${decisionId}`, () => {
        const decision = ExecutiveJournalExperienceModelDecisions[index]!;
        assert.equal(decision.decisionId, decisionId);
        assert.equal(decision.order, index + 1);
        assert.match(decision.name, /\S/);
        assert.match(decision.statement, /\S/);
        assert.equal(isDeeplyFrozen(decision), true);
      });
    }

    it("records exact authorization without EX-2:4 authority", () => {
      assert.equal(ExecutiveJournalExperienceModelAuthorization.authorizationDecisionId, "AD-EX2-10");
      assert.equal(ExecutiveJournalExperienceModelAuthorization.authorizationStatus, "Accepted");
      assert.equal(ExecutiveJournalExperienceModelAuthorization.authority, "Bahadoor / Nexora Product and Architecture Authority");
      assert.equal(ExecutiveJournalExperienceModelAuthorization.selectedOption, "MetadataOnlyCanonicalExperienceModel");
      assert.equal(ExecutiveJournalExperienceModelAuthorization.scope, "Ex23ModelImplementationAndVerificationOnly");
      assert.equal(ExecutiveJournalExperienceModelAuthorization.ex23MetadataOnlyModelAuthorized, true);
      assert.equal(ExecutiveJournalExperienceModelAuthorization.ex23ImplementationAuthorized, true);
      assert.equal(ExecutiveJournalExperienceModelAuthorization.ex24Authorized, false);
    });

    it("declares every prohibited dependency and side effect false", () => {
      assert.deepEqual(
        Object.keys(ExecutiveJournalExperienceModelBoundaries),
        BOUNDARY_COMPLETENESS_TABLE.map((control) => control.key),
      );
      for (const control of BOUNDARY_COMPLETENESS_TABLE) {
        assert.equal(
          ExecutiveJournalExperienceModelBoundaries[control.key],
          control.expected,
          control.key,
        );
      }
      assert.equal(isDeeplyFrozen(BOUNDARY_COMPLETENESS_TABLE), true);
      assert.equal(isDeeplyFrozen(ExecutiveJournalExperienceModelBoundaries), true);
    });
  });

  describe("preservation and summary", () => {
    it("preserves unresolved issues, owners, carried phase, and pending gates exactly", () => {
      const upstream = ExecutiveJournalExperienceModelUpstream;
      assert.equal(upstream.openIssues, upstream.foundation.openIssues);
      assert.equal(upstream.pendingGates, upstream.foundation.pendingGates);
      assert.deepEqual(upstream.pendingGates, ["G-EX2-04", "G-EX2-07", "G-EX2-12"]);
      assert.equal(upstream.openIssues.issueIds.length, 13);
      assert.equal(upstream.openIssues.issues.length, 13);
      assert.equal(
        upstream.openIssues.issues.every(
          (issue) => issue.status === "Unresolved" && issue.carriedByPhase === "EX-2:1",
        ),
        true,
      );
      assert.equal(
        upstream.openIssues.issues.every(
          (issue) =>
            issue.owner.length > 0
            && issue.description.length > 0
            && upstream.openIssues.getIssue(issue.issueId) === issue,
        ),
        true,
      );
      assert.deepEqual(
        upstream.openIssues.pendingGates.map((gate) => ({
          id: gate.gateId,
          result: gate.result,
          carriedByPhase: gate.carriedByPhase,
        })),
        [
          { id: "G-EX2-04", result: "Pending", carriedByPhase: "EX-2:1" },
          { id: "G-EX2-07", result: "Pending", carriedByPhase: "EX-2:1" },
          { id: "G-EX2-12", result: "Pending", carriedByPhase: "EX-2:1" },
        ],
      );
      assert.equal(upstream.openIssues.anyIssueResolvedByAssumption, false);
      assert.equal(upstream.tier0SupportingEvidenceLedger.every((item) => item.satisfiesFormalEx2PhaseAutomatically === false), true);
    });

    it("returns deterministic immutable payload-safe summaries", () => {
      const first = getExecutiveJournalExperienceModelSummary();
      const second = getExecutiveJournalExperienceModelSummary();
      assert.deepEqual(first, second);
      assert.notEqual(first, second);
      assert.equal(Object.isFrozen(first), true);
      assert.equal(Object.isFrozen(first.upstreamIdentityChain), true);
      assert.equal(first.identity, "EX-2:3/ExecutiveJournalExperienceModel");
      assert.equal(first.namespace, "nexora.ex.executive.journal.experience.model");
      assert.equal(first.status, "Model");
      assert.equal(first.readiness, "ReadyForValidation");
      assert.equal(first.entityCount, 14);
      assert.equal(first.relationshipCount, 13);
      assert.equal(first.decisionCount, 8);
      assert.equal(first.openIssueCount, 13);
      assert.equal(first.pendingGateCount, 3);
      assert.equal(first.authorizationDecisionId, "AD-EX2-10");
      assert.equal(first.nextPhase, "EX-2:4 — Executive Journal Experience Validation");
      assert.equal(first.ex24Created, false);
      assert.equal(first.ex24Authorized, false);
      assert.doesNotMatch(
        JSON.stringify(first),
        /syn-entry|journal_body|private_reflection|evidence_content|evidence_uri|actor_email|@/,
      );
      assert.equal(ExecutiveJournalExperienceModel.identity, ExecutiveJournalExperienceModelIdentity);
      assert.equal(ExecutiveJournalExperienceModel.entities, ExecutiveJournalExperienceModelEntities);
      assert.equal(ExecutiveJournalExperienceModel.relationships, ExecutiveJournalExperienceModelRelationships);
      assert.equal(ExecutiveJournalExperienceModel.contracts, ExecutiveJournalExperienceModelContracts);
      assert.equal(ExecutiveJournalExperienceModel.boundaries, ExecutiveJournalExperienceModelBoundaries);
      assert.equal(ExecutiveJournalExperienceModel.upstream, ExecutiveJournalExperienceModelUpstream);
      assert.equal(ExecutiveJournalExperienceModel.statistics.openIssueCount, 13);
      assert.equal(ExecutiveJournalExperienceModel.statistics.decisionCount, 8);
      assert.equal(Object.isFrozen(ExecutiveJournalExperienceModel), true);
      assert.equal(isDeeplyFrozen(ExecutiveJournalExperienceModel.statistics), true);
    });
  });

  describe("dependency and source isolation", () => {
    it("imports only the EX-2:2 Registry aggregate at runtime upstream", () => {
      const productionSources = MODEL_FILES.filter((name) => !name.endsWith(".test.ts"));
      let registryImportCount = 0;
      for (const file of productionSources) {
        const source = readFileSync(join(HERE, file), "utf8");
        const registryImports = source.match(
          /\bimport\s+\{[^}]*ExecutiveJournalExperienceRegistry[^}]*\}\s+from\s+["']\.\/executiveJournalExperienceRegistry\.ts["']/g,
        ) ?? [];
        registryImportCount += registryImports.length;
        assert.doesNotMatch(source, /\bfrom\s+["']\.\/executiveJournalExperienceFoundation\.ts["']/);
        assert.doesNotMatch(source, /\bfrom\s+["'][^"']*executiveJournalProductArchitecture/);
        assert.doesNotMatch(source, /\bfrom\s+["'][^"']*\/rtc\//);
        assert.doesNotMatch(source, /\bfrom\s+["'][^"']*(?:ExecutiveJournalSynthetic|executiveJournalSynthetic)/);
        assert.doesNotMatch(source, /\bfrom\s+["'][^"']*(?:react|next\/)/);
        assert.doesNotMatch(source, /\bfetch\s*\(|XMLHttpRequest|WebSocket|localStorage|sessionStorage|indexedDB|sendBeacon/);
        assert.doesNotMatch(source, /\bDate\.now\b|\bMath\.random\b|\bcrypto\.randomUUID\b/);
      }
      assert.equal(registryImportCount, 1);
    });

    it("keeps route, UI, provider, adapter, fixtures, RTC, APP-8, and EX-2:5 absent", () => {
      const source = MODEL_FILES.filter((name) => !name.endsWith(".test.ts"))
        .map((file) => readFileSync(join(HERE, file), "utf8"))
        .join("\n");
      assert.doesNotMatch(source, /\bfrom\s+["'][^"']*(?:route|provider|adapter|fixture|PublicIndex)/i);
      assert.doesNotMatch(source, /\bfrom\s+["'][^"']*(?:RTC-|APP-8)/i);
      assert.equal(ExecutiveJournalExperienceModel.routeBehavior, false);
      assert.equal(ExecutiveJournalExperienceModel.providerBehavior, false);
      assert.equal(ExecutiveJournalExperienceModel.realRtc2Consumption, false);
      assert.equal(ExecutiveJournalExperienceModel.ex24Created, false);
      assert.equal(ExecutiveJournalExperienceModel.ex24Authorized, false);
    });
  });
});
