import assert from "node:assert/strict";
import test from "node:test";

import { validateDomainFoundation } from "./domainFoundationIndex.ts";
import { validateDomainVocabularyFoundation } from "./domainVocabularyIndex.ts";
import { validateDomainOntologyFoundation } from "./domainOntologyIndex.ts";
import { validateDomainKpiFoundation } from "./domainKpiIndex.ts";
import { validateDomainRegulationFoundation } from "./domainRegulationIndex.ts";
import { validateDomainReasoningFoundation, createDomainReasoningRegistry, registerDomainReasoningPackage, type DomainReasoningPackage } from "./domainReasoningIndex.ts";
import {
  DomainReasoningQueryLayer,
  buildDomainReasoningReferenceLookup,
  buildDomainReasoningSnapshot,
  compareDomainReasoningSnapshots,
  diffDomainReasoningSnapshots,
  filterDomainReasoningPackages,
  findDomainReasoningContract,
  findReasoningAssumptions,
  findReasoningConfidenceMetadata,
  findReasoningEvidenceRequirements,
  findReasoningInputs,
  findReasoningOutputs,
  findReasoningPackageContainingContract,
  findReasoningPackagesByDomain,
  findReasoningPackagesByScope,
  findReasoningPackagesByStatus,
  findReasoningReferencingKpi,
  findReasoningReferencingOntologyAttribute,
  findReasoningReferencingOntologyEntity,
  findReasoningReferencingRegulation,
  findReasoningReferencingVocabularyTerm,
  findReasoningTraceMetadata,
  findReasoningUncertaintyMetadata,
  queryDomainReasoningPackages,
  sortDomainReasoningPackages,
  validateDomainReasoningSnapshot,
} from "./domainReasoningQueryIndex.ts";

function reasoningPackage(
  id: string,
  contractId: string,
  domainId = "domain.reasoning-query",
  description = "Neutral reasoning query metadata."
): DomainReasoningPackage {
  return Object.freeze({
    contractVersion: "DOM-6:1",
    reasoningPackageId: id,
    domainId,
    name: `Reasoning Package ${id}`,
    description,
    version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
    scope: id.endsWith("secondary") ? "module" : "domain",
    status: id.endsWith("secondary") ? "draft" : "active",
    contracts: Object.freeze([
      Object.freeze({
        contractId,
        label: "Reasoning Contract",
        description: "Metadata-only reasoning contract.",
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
              vocabularyId: "vocabulary.reasoning-query.core",
              termId: "term.reasoning-query.input",
              ontologyId: "ontology.reasoning-query.core",
              entityTypeId: "entity.reasoning-query.source",
              attributeId: "attribute.reasoning-query.value",
            }),
          }),
        ]),
        outputs: Object.freeze([
          Object.freeze({
            outputId: `output.${contractId}`,
            label: "Output",
            description: "Output metadata.",
            reference: Object.freeze({
              domainId,
              kpiPackageId: "kpi-package.reasoning-query.core",
              kpiId: "kpi.reasoning-query.primary",
            }),
          }),
        ]),
        evidenceRequirements: Object.freeze([
          Object.freeze({
            evidenceRequirementId: `evidence.${contractId}`,
            label: "Evidence",
            description: "Evidence metadata.",
            required: true,
            reference: Object.freeze({
              domainId,
              regulationPackageId: "regulation-package.reasoning-query.core",
              regulationId: "regulation.reasoning-query.primary",
            }),
          }),
        ]),
        assumptions: Object.freeze([
          Object.freeze({
            assumptionId: `assumption.${contractId}`,
            label: "Assumption",
            description: "Assumption metadata.",
            required: true,
            uncertaintyImpact: "medium",
            reference: Object.freeze({ domainId, termId: "term.reasoning-query.input" }),
          }),
        ]),
        confidence: Object.freeze({
          required: true,
          evidenceCoverageRequired: true,
          assumptionCoverageRequired: true,
          explanation: "Confidence metadata is required.",
        }),
        uncertainty: Object.freeze({
          required: true,
          sources: Object.freeze(["assumption", "evidence"]),
          explanation: "Uncertainty metadata is required.",
        }),
        trace: Object.freeze({
          required: true,
          traceInputIds: Object.freeze([`input.${contractId}`]),
          traceOutputIds: Object.freeze([`output.${contractId}`]),
          traceEvidenceRequirementIds: Object.freeze([`evidence.${contractId}`]),
          traceAssumptionIds: Object.freeze([`assumption.${contractId}`]),
        }),
      }),
    ]),
  });
}

function registry() {
  const first = registerDomainReasoningPackage(
    createDomainReasoningRegistry(),
    reasoningPackage("reasoning-package.query.primary", "reasoning-contract.query.primary")
  ).registry;
  return registerDomainReasoningPackage(
    first,
    reasoningPackage("reasoning-package.query.secondary", "reasoning-contract.query.secondary", "domain.reasoning-query-two")
  ).registry;
}

test("queries reasoning packages by domain", () => {
  assert.equal(findReasoningPackagesByDomain(registry(), "domain.reasoning-query").length, 1);
});

test("filters reasoning packages by scope and status", () => {
  const found = filterDomainReasoningPackages(registry(), Object.freeze({ scope: "module", status: "draft" }));
  assert.equal(found[0].package.reasoningPackageId, "reasoning-package.query.secondary");
});

test("sorts reasoning packages deterministically", () => {
  const sorted = sortDomainReasoningPackages(registry().packages, "reasoningPackageId", "desc");
  assert.equal(sorted[0].package.reasoningPackageId, "reasoning-package.query.secondary");
});

test("queries reasoning packages with contract filter", () => {
  const found = queryDomainReasoningPackages(registry(), {
    filter: Object.freeze({ contractId: "reasoning-contract.query.primary" }),
  });
  assert.equal(found.length, 1);
});

test("finds reasoning packages by scope", () => {
  assert.equal(findReasoningPackagesByScope(registry(), "domain").length, 1);
});

test("finds reasoning packages by status", () => {
  assert.equal(findReasoningPackagesByStatus(registry(), "active").length, 1);
});

test("finds package containing contract", () => {
  assert.equal(
    findReasoningPackageContainingContract(registry(), "reasoning-contract.query.primary")?.package.reasoningPackageId,
    "reasoning-package.query.primary"
  );
});

test("looks up reasoning contract", () => {
  assert.equal(findDomainReasoningContract(registry(), "reasoning-contract.query.primary").found, true);
});

test("looks up reasoning inputs outputs assumptions and evidence requirements", () => {
  const current = registry();
  assert.equal(findReasoningInputs(current, "reasoning-contract.query.primary").inputs.length, 1);
  assert.equal(findReasoningOutputs(current, "reasoning-contract.query.primary").outputs.length, 1);
  assert.equal(findReasoningAssumptions(current, "reasoning-contract.query.primary").assumptions.length, 1);
  assert.equal(findReasoningEvidenceRequirements(current, "reasoning-contract.query.primary").evidenceRequirements.length, 1);
});

test("looks up reasoning confidence uncertainty and trace metadata", () => {
  const current = registry();
  assert.equal(findReasoningConfidenceMetadata(current, "reasoning-contract.query.primary").confidence?.required, true);
  assert.equal(findReasoningUncertaintyMetadata(current, "reasoning-contract.query.primary").uncertainty?.required, true);
  assert.equal(findReasoningTraceMetadata(current, "reasoning-contract.query.primary").trace?.required, true);
});

test("inspects references by vocabulary term", () => {
  assert.equal(findReasoningReferencingVocabularyTerm(registry(), "term.reasoning-query.input").length, 2);
});

test("inspects references by ontology entity", () => {
  assert.equal(findReasoningReferencingOntologyEntity(registry(), "entity.reasoning-query.source").length, 2);
});

test("inspects references by ontology attribute", () => {
  assert.equal(findReasoningReferencingOntologyAttribute(registry(), "attribute.reasoning-query.value").length, 2);
});

test("inspects references by KPI", () => {
  assert.equal(findReasoningReferencingKpi(registry(), "kpi.reasoning-query.primary").length, 2);
});

test("inspects references by regulation", () => {
  assert.equal(findReasoningReferencingRegulation(registry(), "regulation.reasoning-query.primary").length, 2);
});

test("builds reasoning reference lookup", () => {
  assert.equal(buildDomainReasoningReferenceLookup(registry(), "term.reasoning-query.input").matches.length, 2);
});

test("builds reasoning snapshot", () => {
  const snapshot = buildDomainReasoningSnapshot(registry());
  assert.equal(snapshot.packageCount, 2);
  assert.equal(snapshot.entries.length, 2);
});

test("validates reasoning snapshot", () => {
  assert.equal(validateDomainReasoningSnapshot(buildDomainReasoningSnapshot(registry())).valid, true);
});

test("compares reasoning snapshots", () => {
  assert.equal(compareDomainReasoningSnapshots(buildDomainReasoningSnapshot(registry()), buildDomainReasoningSnapshot(registry())), true);
});

test("diffs modified reasoning snapshots", () => {
  const left = buildDomainReasoningSnapshot(registry());
  const changedRegistry = registerDomainReasoningPackage(
    createDomainReasoningRegistry(),
    reasoningPackage("reasoning-package.query.primary", "reasoning-contract.query.primary", "domain.reasoning-query", "Modified metadata.")
  ).registry;
  const right = buildDomainReasoningSnapshot(changedRegistry);
  assert.equal(diffDomainReasoningSnapshots(left, right).entries.some((entry) => entry.type === "modified"), true);
});

test("exports public reasoning query APIs", () => {
  assert.equal(typeof DomainReasoningQueryLayer.queryDomainReasoningPackages, "function");
  assert.equal(typeof DomainReasoningQueryLayer.buildDomainReasoningSnapshot, "function");
  assert.equal(Object.isFrozen(DomainReasoningQueryLayer), true);
});

test("keeps DOM-6:1 compatibility", () => {
  assert.equal(validateDomainReasoningFoundation().valid, true);
});

test("keeps DOM-5 compatibility", () => {
  assert.equal(validateDomainRegulationFoundation().valid, true);
});

test("keeps DOM-4 compatibility", () => {
  assert.equal(validateDomainKpiFoundation().valid, true);
});

test("keeps DOM-3 compatibility", () => {
  assert.equal(validateDomainOntologyFoundation().valid, true);
});

test("keeps DOM-2 compatibility", () => {
  assert.equal(validateDomainVocabularyFoundation().valid, true);
});

test("keeps DOM-1 compatibility", () => {
  assert.equal(validateDomainFoundation().valid, true);
});

test("does not expose reasoning execution behavior", () => {
  const apiNames = Object.keys(DomainReasoningQueryLayer).join(" ");
  assert.equal(apiNames.includes("execute"), false);
  assert.equal(apiNames.includes("infer"), false);
  assert.equal(apiNames.includes("score"), false);
  assert.equal(apiNames.includes("rank"), false);
});
