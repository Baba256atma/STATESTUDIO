import assert from "node:assert/strict";
import test from "node:test";

import { validateDomainFoundation } from "./domainFoundationIndex.ts";
import { DomainVocabularyPlatformFreeze } from "./domainVocabularyPlatformFreezeIndex.ts";
import { DomainOntologyPlatformFreeze } from "./domainOntologyPlatformFreezeIndex.ts";
import { DomainKpiPlatformFreeze } from "./domainKpiPlatformFreezeIndex.ts";
import { DomainRegulationCertificationLayer } from "./domainRegulationCertificationIndex.ts";
import { DomainReasoningPlatformFreeze } from "./domainReasoningPlatformFreezeIndex.ts";
import { createDomainRecommendationRegistry, registerDomainRecommendationPackage, validateDomainRecommendationFoundation, type DomainRecommendationPackage } from "./domainRecommendationIndex.ts";
import {
  DomainRecommendationQueryLayer,
  buildDomainRecommendationReferenceLookup,
  buildDomainRecommendationSnapshot,
  compareDomainRecommendationSnapshots,
  diffDomainRecommendationSnapshots,
  filterDomainRecommendationPackages,
  findDomainRecommendationContract,
  findRecommendationAssumptions,
  findRecommendationConfidenceMetadata,
  findRecommendationConstraints,
  findRecommendationInputs,
  findRecommendationOutputs,
  findRecommendationPackageContainingContract,
  findRecommendationPackagesByDomain,
  findRecommendationPackagesByScope,
  findRecommendationPackagesByStatus,
  findRecommendationRationale,
  findRecommendationTraceMetadata,
  findRecommendationUncertaintyMetadata,
  findRecommendationsReferencingKpi,
  findRecommendationsReferencingOntologyAttribute,
  findRecommendationsReferencingOntologyEntity,
  findRecommendationsReferencingReasoning,
  findRecommendationsReferencingRegulation,
  findRecommendationsReferencingVocabularyTerm,
  queryDomainRecommendationPackages,
  sortDomainRecommendationPackages,
  validateDomainRecommendationSnapshot,
} from "./domainRecommendationQueryIndex.ts";

function recommendationPackage(
  id: string,
  contractId: string,
  domainId = "domain.recommendation-query",
  description = "Neutral recommendation query metadata."
): DomainRecommendationPackage {
  return Object.freeze({
    contractVersion: "DOM-7:1",
    recommendationPackageId: id,
    domainId,
    name: `Recommendation Package ${id}`,
    description,
    version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
    scope: id.endsWith("secondary") ? "module" : "domain",
    status: id.endsWith("secondary") ? "draft" : "active",
    contracts: Object.freeze([
      Object.freeze({
        contractId,
        label: "Recommendation Contract",
        description: "Metadata-only recommendation contract.",
        scope: "domain",
        status: "active",
        inputs: Object.freeze([
          Object.freeze({
            inputId: `input.${contractId}`,
            label: "Input",
            description: "Input metadata.",
            required: true,
            reference: Object.freeze({
              domainId,
              vocabularyId: "vocabulary.recommendation-query.core",
              termId: "term.recommendation-query.input",
              ontologyId: "ontology.recommendation-query.core",
              entityTypeId: "entity.recommendation-query.source",
              attributeId: "attribute.recommendation-query.value",
              reasoningPackageId: "reasoning-package.recommendation-query.core",
              reasoningContractId: "reasoning-contract.recommendation-query.primary",
            }),
          }),
        ]),
        outputs: Object.freeze([
          Object.freeze({
            outputId: `output.${contractId}`,
            label: "Output",
            description: "Output metadata.",
            reference: Object.freeze({ domainId, kpiPackageId: "kpi-package.recommendation-query.core", kpiId: "kpi.recommendation-query.primary" }),
          }),
        ]),
        rationale: Object.freeze({
          required: true,
          rationaleInputs: Object.freeze([`input.${contractId}`]),
          rationaleAssumptions: Object.freeze([`assumption.${contractId}`]),
          explanation: "Rationale metadata is required.",
        }),
        constraints: Object.freeze([
          Object.freeze({
            constraintId: `constraint.${contractId}`,
            label: "Constraint",
            description: "Constraint metadata.",
            required: true,
            severity: "warning",
            reference: Object.freeze({ domainId, regulationPackageId: "regulation-package.recommendation-query.core", regulationId: "regulation.recommendation-query.primary" }),
          }),
        ]),
        assumptions: Object.freeze([
          Object.freeze({
            assumptionId: `assumption.${contractId}`,
            label: "Assumption",
            description: "Assumption metadata.",
            required: true,
            uncertaintyImpact: "medium",
            reference: Object.freeze({ domainId, termId: "term.recommendation-query.input" }),
          }),
        ]),
        confidence: Object.freeze({ required: true, evidenceCoverageRequired: true, rationaleCoverageRequired: true, explanation: "Confidence metadata is required." }),
        uncertainty: Object.freeze({ required: true, sources: Object.freeze(["assumption", "constraint"]), explanation: "Uncertainty metadata is required." }),
        trace: Object.freeze({
          required: true,
          traceInputIds: Object.freeze([`input.${contractId}`]),
          traceOutputIds: Object.freeze([`output.${contractId}`]),
          traceConstraintIds: Object.freeze([`constraint.${contractId}`]),
          traceAssumptionIds: Object.freeze([`assumption.${contractId}`]),
        }),
      }),
    ]),
  });
}

function registry() {
  const first = registerDomainRecommendationPackage(
    createDomainRecommendationRegistry(),
    recommendationPackage("recommendation-package.query.primary", "recommendation-contract.query.primary")
  ).registry;
  return registerDomainRecommendationPackage(
    first,
    recommendationPackage("recommendation-package.query.secondary", "recommendation-contract.query.secondary", "domain.recommendation-query-two")
  ).registry;
}

test("queries recommendation packages by domain", () => {
  assert.equal(findRecommendationPackagesByDomain(registry(), "domain.recommendation-query").length, 1);
});

test("filters recommendation packages by scope and status", () => {
  const found = filterDomainRecommendationPackages(registry(), Object.freeze({ scope: "module", status: "draft" }));
  assert.equal(found[0].package.recommendationPackageId, "recommendation-package.query.secondary");
});

test("sorts recommendation packages deterministically", () => {
  const sorted = sortDomainRecommendationPackages(registry().packages, "recommendationPackageId", "desc");
  assert.equal(sorted[0].package.recommendationPackageId, "recommendation-package.query.secondary");
});

test("queries recommendation packages with contract filter", () => {
  assert.equal(queryDomainRecommendationPackages(registry(), { filter: Object.freeze({ contractId: "recommendation-contract.query.primary" }) }).length, 1);
});

test("finds recommendation packages by scope and status", () => {
  assert.equal(findRecommendationPackagesByScope(registry(), "domain").length, 1);
  assert.equal(findRecommendationPackagesByStatus(registry(), "active").length, 1);
});

test("finds package containing contract", () => {
  assert.equal(findRecommendationPackageContainingContract(registry(), "recommendation-contract.query.primary")?.package.recommendationPackageId, "recommendation-package.query.primary");
});

test("looks up recommendation contract and sections", () => {
  const current = registry();
  assert.equal(findDomainRecommendationContract(current, "recommendation-contract.query.primary").found, true);
  assert.equal(findRecommendationInputs(current, "recommendation-contract.query.primary").inputs.length, 1);
  assert.equal(findRecommendationOutputs(current, "recommendation-contract.query.primary").outputs.length, 1);
  assert.equal(findRecommendationRationale(current, "recommendation-contract.query.primary").rationale?.required, true);
  assert.equal(findRecommendationConstraints(current, "recommendation-contract.query.primary").constraints.length, 1);
  assert.equal(findRecommendationAssumptions(current, "recommendation-contract.query.primary").assumptions.length, 1);
});

test("looks up recommendation confidence uncertainty and trace metadata", () => {
  const current = registry();
  assert.equal(findRecommendationConfidenceMetadata(current, "recommendation-contract.query.primary").confidence?.required, true);
  assert.equal(findRecommendationUncertaintyMetadata(current, "recommendation-contract.query.primary").uncertainty?.required, true);
  assert.equal(findRecommendationTraceMetadata(current, "recommendation-contract.query.primary").trace?.required, true);
});

test("inspects references by vocabulary ontology KPI regulation and reasoning", () => {
  const current = registry();
  assert.equal(findRecommendationsReferencingVocabularyTerm(current, "term.recommendation-query.input").length, 2);
  assert.equal(findRecommendationsReferencingOntologyEntity(current, "entity.recommendation-query.source").length, 2);
  assert.equal(findRecommendationsReferencingOntologyAttribute(current, "attribute.recommendation-query.value").length, 2);
  assert.equal(findRecommendationsReferencingKpi(current, "kpi.recommendation-query.primary").length, 2);
  assert.equal(findRecommendationsReferencingRegulation(current, "regulation.recommendation-query.primary").length, 2);
  assert.equal(findRecommendationsReferencingReasoning(current, "reasoning-contract.recommendation-query.primary").length, 2);
});

test("builds recommendation reference lookup", () => {
  assert.equal(buildDomainRecommendationReferenceLookup(registry(), "reasoning-contract.recommendation-query.primary").matches.length, 2);
});

test("builds and validates recommendation snapshot", () => {
  const snapshot = buildDomainRecommendationSnapshot(registry());
  assert.equal(snapshot.packageCount, 2);
  assert.equal(validateDomainRecommendationSnapshot(snapshot).valid, true);
});

test("compares recommendation snapshots", () => {
  assert.equal(compareDomainRecommendationSnapshots(buildDomainRecommendationSnapshot(registry()), buildDomainRecommendationSnapshot(registry())), true);
});

test("diffs modified recommendation snapshots", () => {
  const left = buildDomainRecommendationSnapshot(registry());
  const changedRegistry = registerDomainRecommendationPackage(
    createDomainRecommendationRegistry(),
    recommendationPackage("recommendation-package.query.primary", "recommendation-contract.query.primary", "domain.recommendation-query", "Modified metadata.")
  ).registry;
  const right = buildDomainRecommendationSnapshot(changedRegistry);
  assert.equal(diffDomainRecommendationSnapshots(left, right).entries.some((entry) => entry.type === "modified"), true);
});

test("exports public recommendation query APIs", () => {
  assert.equal(typeof DomainRecommendationQueryLayer.queryDomainRecommendationPackages, "function");
  assert.equal(typeof DomainRecommendationQueryLayer.buildDomainRecommendationSnapshot, "function");
  assert.equal(Object.isFrozen(DomainRecommendationQueryLayer), true);
});

test("keeps DOM-7:1 compatibility", () => {
  assert.equal(validateDomainRecommendationFoundation().valid, true);
});

test("keeps DOM-6 compatibility", () => {
  assert.equal(DomainReasoningPlatformFreeze.runDomainReasoningPlatformFreeze().status, "PASS");
});

test("keeps DOM-5 compatibility", () => {
  assert.equal(DomainRegulationCertificationLayer.runDomainRegulationRegression().failed, 0);
});

test("keeps DOM-4 compatibility", () => {
  assert.equal(DomainKpiPlatformFreeze.runDomainKpiPlatformFreeze().status, "PASS");
});

test("keeps DOM-3 compatibility", () => {
  assert.equal(DomainOntologyPlatformFreeze.runDomainOntologyPlatformFreeze().status, "PASS");
});

test("keeps DOM-2 compatibility", () => {
  assert.equal(DomainVocabularyPlatformFreeze.runDomainVocabularyPlatformFreeze().status, "PASS");
});

test("keeps DOM-1 compatibility", () => {
  assert.equal(validateDomainFoundation().valid, true);
});

test("does not expose recommendation generation behavior", () => {
  const apiNames = Object.keys(DomainRecommendationQueryLayer).join(" ");
  assert.equal(apiNames.includes("generate"), false);
  assert.equal(apiNames.includes("execute"), false);
  assert.equal(apiNames.includes("score"), false);
  assert.equal(apiNames.includes("rank"), false);
});
