import assert from "node:assert/strict";
import test from "node:test";

import { validateDomainFoundation } from "./domainFoundationIndex.ts";
import { DomainVocabularyPlatformFreeze } from "./domainVocabularyPlatformFreezeIndex.ts";
import { DomainOntologyPlatformFreeze } from "./domainOntologyPlatformFreezeIndex.ts";
import { DomainKpiPlatformFreeze } from "./domainKpiPlatformFreezeIndex.ts";
import { DomainRegulationCertificationLayer } from "./domainRegulationCertificationIndex.ts";
import {
  createDomainReasoningRegistry,
  registerDomainReasoningPackage,
  validateDomainReasoningFoundation,
  type DomainReasoningPackage,
} from "./domainReasoningIndex.ts";
import { DomainReasoningPlatformFreeze } from "./domainReasoningPlatformFreezeIndex.ts";
import {
  DOMAIN_RECOMMENDATION_PUBLIC_APIS,
  DomainRecommendationFoundation,
  buildDomainRecommendationManifest,
  createDomainRecommendationRegistry,
  freezeDomainRecommendationRegistry,
  getDomainRecommendationPackage,
  hasDomainRecommendationPackage,
  listDomainRecommendationPackages,
  listRecommendationPackagesByDomain,
  registerDomainRecommendationPackage,
  unregisterDomainRecommendationPackage,
  validateDomainRecommendationPackage,
  validateDomainRecommendationRegistry,
  type DomainRecommendationPackage,
} from "./domainRecommendationIndex.ts";

const DOMAIN_ID = "domain.recommendation-test";

function reasoningPackage(): DomainReasoningPackage {
  return Object.freeze({
    contractVersion: "DOM-6:1",
    reasoningPackageId: "reasoning-package.recommendation-test.core",
    domainId: DOMAIN_ID,
    name: "Recommendation Test Reasoning Package",
    description: "Neutral reasoning metadata.",
    version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
    scope: "domain",
    status: "active",
    contracts: Object.freeze([
      Object.freeze({
        contractId: "reasoning-contract.recommendation-test.primary",
        label: "Reasoning Contract",
        description: "Neutral reasoning contract metadata.",
        scope: "domain",
        status: "active",
        inputs: Object.freeze([Object.freeze({ inputId: "input.reasoning.primary", label: "Input", description: "Input.", required: true })]),
        outputs: Object.freeze([Object.freeze({ outputId: "output.reasoning.primary", label: "Output", description: "Output." })]),
        evidenceRequirements: Object.freeze([Object.freeze({ evidenceRequirementId: "evidence.reasoning.primary", label: "Evidence", description: "Evidence.", required: true })]),
        assumptions: Object.freeze([Object.freeze({ assumptionId: "assumption.reasoning.primary", label: "Assumption", description: "Assumption.", required: true, uncertaintyImpact: "medium" })]),
        confidence: Object.freeze({ required: true, evidenceCoverageRequired: true, assumptionCoverageRequired: true, explanation: "Confidence." }),
        uncertainty: Object.freeze({ required: true, sources: Object.freeze(["assumption"]), explanation: "Uncertainty." }),
        trace: Object.freeze({
          required: true,
          traceInputIds: Object.freeze(["input.reasoning.primary"]),
          traceOutputIds: Object.freeze(["output.reasoning.primary"]),
          traceEvidenceRequirementIds: Object.freeze(["evidence.reasoning.primary"]),
          traceAssumptionIds: Object.freeze(["assumption.reasoning.primary"]),
        }),
      }),
    ]),
  });
}

function reasoningRegistry() {
  return registerDomainReasoningPackage(createDomainReasoningRegistry(), reasoningPackage()).registry;
}

function recommendationPackage(
  packageId = "recommendation-package.recommendation-test.core",
  contractId = "recommendation-contract.recommendation-test.primary"
): DomainRecommendationPackage {
  return Object.freeze({
    contractVersion: "DOM-7:1",
    recommendationPackageId: packageId,
    domainId: DOMAIN_ID,
    name: "Recommendation Test Package",
    description: "Neutral recommendation contract metadata.",
    version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
    scope: "domain",
    status: "active",
    contracts: Object.freeze([
      Object.freeze({
        contractId,
        label: "Recommendation Contract",
        description: "Describes recommendation metadata only.",
        scope: "domain",
        status: "active",
        inputs: Object.freeze([
          Object.freeze({
            inputId: "input.recommendation.primary",
            label: "Input",
            description: "Input metadata.",
            required: true,
            reference: Object.freeze({
              domainId: DOMAIN_ID,
              reasoningPackageId: "reasoning-package.recommendation-test.core",
              reasoningContractId: "reasoning-contract.recommendation-test.primary",
            }),
          }),
        ]),
        outputs: Object.freeze([Object.freeze({ outputId: "output.recommendation.primary", label: "Output", description: "Output metadata." })]),
        rationale: Object.freeze({
          required: true,
          rationaleInputs: Object.freeze(["input.recommendation.primary"]),
          rationaleAssumptions: Object.freeze(["assumption.recommendation.primary"]),
          explanation: "Rationale metadata is required for downstream consumers.",
        }),
        constraints: Object.freeze([
          Object.freeze({
            constraintId: "constraint.recommendation.primary",
            label: "Constraint",
            description: "Constraint metadata.",
            required: true,
            severity: "warning",
          }),
        ]),
        assumptions: Object.freeze([
          Object.freeze({
            assumptionId: "assumption.recommendation.primary",
            label: "Assumption",
            description: "Assumption metadata.",
            required: true,
            uncertaintyImpact: "medium",
          }),
        ]),
        confidence: Object.freeze({
          required: true,
          evidenceCoverageRequired: true,
          rationaleCoverageRequired: true,
          explanation: "Confidence metadata is required.",
        }),
        uncertainty: Object.freeze({
          required: true,
          sources: Object.freeze(["assumption", "constraint"]),
          explanation: "Uncertainty metadata is required.",
        }),
        trace: Object.freeze({
          required: true,
          traceInputIds: Object.freeze(["input.recommendation.primary"]),
          traceOutputIds: Object.freeze(["output.recommendation.primary"]),
          traceConstraintIds: Object.freeze(["constraint.recommendation.primary"]),
          traceAssumptionIds: Object.freeze(["assumption.recommendation.primary"]),
        }),
      }),
    ]),
  });
}

test("creates recommendation registry", () => {
  const registry = createDomainRecommendationRegistry();
  assert.equal(registry.contractVersion, "DOM-7:1");
  assert.equal(registry.packages.length, 0);
});

test("registers recommendation package", () => {
  const result = registerDomainRecommendationPackage(createDomainRecommendationRegistry(), recommendationPackage(), undefined, undefined, undefined, undefined, undefined, reasoningRegistry());
  assert.equal(result.success, true);
  assert.equal(result.registry.packages.length, 1);
});

test("rejects duplicate recommendation package ids", () => {
  const first = registerDomainRecommendationPackage(createDomainRecommendationRegistry(), recommendationPackage()).registry;
  const duplicate = registerDomainRecommendationPackage(first, recommendationPackage());
  assert.equal(duplicate.success, false);
  assert.equal(duplicate.validation.issues.some((entry) => entry.code === "duplicate_recommendation_package_id"), true);
});

test("rejects duplicate recommendation contract ids", () => {
  const first = registerDomainRecommendationPackage(createDomainRecommendationRegistry(), recommendationPackage()).registry;
  const duplicate = registerDomainRecommendationPackage(first, recommendationPackage("recommendation-package.recommendation-test.secondary"));
  assert.equal(duplicate.success, false);
  assert.equal(duplicate.validation.issues.some((entry) => entry.code === "duplicate_recommendation_contract_id"), true);
});

test("looks up recommendation package", () => {
  const registry = registerDomainRecommendationPackage(createDomainRecommendationRegistry(), recommendationPackage()).registry;
  assert.equal(getDomainRecommendationPackage(registry, "recommendation-package.recommendation-test.core")?.package.name, "Recommendation Test Package");
  assert.equal(hasDomainRecommendationPackage(registry, "recommendation-package.recommendation-test.core"), true);
});

test("lists recommendation packages by domain", () => {
  const registry = registerDomainRecommendationPackage(createDomainRecommendationRegistry(), recommendationPackage()).registry;
  assert.equal(listDomainRecommendationPackages(registry).length, 1);
  assert.equal(listRecommendationPackagesByDomain(registry, DOMAIN_ID).length, 1);
});

test("unregisters recommendation package", () => {
  const registry = registerDomainRecommendationPackage(createDomainRecommendationRegistry(), recommendationPackage()).registry;
  assert.equal(unregisterDomainRecommendationPackage(registry, "recommendation-package.recommendation-test.core").registry.packages.length, 0);
});

test("freezes recommendation registry and blocks mutation", () => {
  const result = registerDomainRecommendationPackage(freezeDomainRecommendationRegistry(createDomainRecommendationRegistry()), recommendationPackage());
  assert.equal(result.success, false);
  assert.equal(result.validation.issues.some((entry) => entry.code === "registry_frozen"), true);
});

test("builds recommendation manifest", () => {
  const manifest = buildDomainRecommendationManifest();
  assert.equal(manifest.contractVersion, "DOM-7:1");
  assert.equal(manifest.metadataOnly, true);
  assert.equal(manifest.recommendationEngine, false);
});

test("validates recommendation package", () => {
  assert.equal(validateDomainRecommendationPackage(recommendationPackage(), undefined, undefined, undefined, undefined, undefined, reasoningRegistry()).valid, true);
});

test("validates recommendation registry", () => {
  const registry = registerDomainRecommendationPackage(createDomainRecommendationRegistry(), recommendationPackage()).registry;
  assert.equal(validateDomainRecommendationRegistry(registry).valid, true);
});

test("validates reasoning compatibility", () => {
  assert.equal(validateDomainRecommendationPackage(recommendationPackage(), undefined, undefined, undefined, undefined, undefined, reasoningRegistry()).valid, true);
});

test("exports public recommendation APIs", () => {
  assert.equal(typeof DomainRecommendationFoundation.createDomainRecommendationRegistry, "function");
  assert.equal(Object.isFrozen(DomainRecommendationFoundation), true);
  assert.equal(DOMAIN_RECOMMENDATION_PUBLIC_APIS.includes("DomainRecommendationFoundation"), true);
});

test("keeps DOM-1 compatibility", () => {
  assert.equal(validateDomainFoundation().valid, true);
});

test("keeps DOM-2 compatibility", () => {
  assert.equal(DomainVocabularyPlatformFreeze.runDomainVocabularyPlatformFreeze().status, "PASS");
});

test("keeps DOM-3 compatibility", () => {
  assert.equal(DomainOntologyPlatformFreeze.runDomainOntologyPlatformFreeze().status, "PASS");
});

test("keeps DOM-4 compatibility", () => {
  assert.equal(DomainKpiPlatformFreeze.runDomainKpiPlatformFreeze().status, "PASS");
});

test("keeps DOM-5 compatibility", () => {
  assert.equal(DomainRegulationCertificationLayer.runDomainRegulationRegression().failed, 0);
});

test("keeps DOM-6 compatibility", () => {
  assert.equal(validateDomainReasoningFoundation().valid, true);
  assert.equal(DomainReasoningPlatformFreeze.runDomainReasoningPlatformFreeze().status, "PASS");
});

test("does not expose recommendation generation behavior", () => {
  const apiNames = DOMAIN_RECOMMENDATION_PUBLIC_APIS.join(" ");
  assert.equal(apiNames.includes("generate"), false);
  assert.equal(apiNames.includes("execute"), false);
  assert.equal(apiNames.includes("score"), false);
  assert.equal(apiNames.includes("rank"), false);
});
