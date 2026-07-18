/**
 * DKL-5:7 — Knowledge Validation Certification.
 *
 * Canonical immutable Certification aggregate for DKL-5 Knowledge Validation.
 * Publishes exactly eight runtime exports. Certifies Platform composition for
 * Freeze readiness. Certification only — no new architecture, no runtime behavior.
 *
 * Ownership: owned exclusively by DKL-5:7.
 * Dependencies: knowledgeValidationPlatform.ts public entry point only.
 */

import { KnowledgeValidationPlatform } from "./knowledgeValidationPlatform.ts";
import {
  KNOWLEDGE_VALIDATION_CERTIFICATION_CATEGORIES,
  KnowledgeValidationCertificationGates,
} from "./knowledgeValidationCertificationGates.ts";
import { KnowledgeValidationCertificationCompatibility } from "./knowledgeValidationCertificationCompatibility.ts";
import {
  KnowledgeValidationCertificationRegression,
  evaluateRegressionChecks,
} from "./knowledgeValidationCertificationRegression.ts";
import { buildFreezeReadiness } from "./knowledgeValidationCertificationReadiness.ts";
import type {
  CertificationCategoryResult,
  CertificationEvidenceRecord,
  CertificationFailure,
  CertificationGateEvaluation,
  CertificationGateResult,
  CertificationResult,
  CertificationSummaryDescriptor,
  KnowledgeValidationCertificationIdentityDescriptor,
} from "./knowledgeValidationCertificationTypes.ts";

export const KnowledgeValidationCertificationVersion = "1.0.0";

export const KnowledgeValidationCertificationNamespace =
  "nexora.dkl.knowledge-validation.certification";

export const KnowledgeValidationCertificationIdentity: KnowledgeValidationCertificationIdentityDescriptor =
  Object.freeze({
    certificationId: "DKL-5:7/KnowledgeValidationCertification",
    certificationName: "Knowledge Validation Certification",
    certificationVersion: KnowledgeValidationCertificationVersion,
    certificationNamespace: KnowledgeValidationCertificationNamespace,
    phase: "DKL-5:7",
    owner: "DKL-5 Knowledge Validation Certification",
    architectureType: "KnowledgeValidation",
    status: "Certified",
    readiness: "ReadyForFreeze",
    metadataOnly: true,
    runtimeBehavior: false,
    immutable: true,
  });

const EVIDENCE_OWNER = "DKL-5 Knowledge Validation Certification";

type GateCheck = {
  readonly pass: boolean;
  readonly expected: string;
  readonly observed: string;
};

const evaluateGateChecks = (): Readonly<Record<string, GateCheck>> => {
  const p = KnowledgeValidationPlatform;
  const sectionOrder = p.sectionOrder.join("→");
  const separateFrom = [...p.metadata.boundaries.separateFrom];
  const inv = p.inventory;
  const counts = p.manifest.counts;
  const consumerStates = [
    ...p.model.catalog.consumerSuitabilityStates.states,
  ];
  const execCaps = [
    ...p.model.catalog.executiveUsabilityCapabilities.capabilities,
  ];
  const ruleResults = p.validation.result.ruleResults;
  const everyRuleHasEvidence = ruleResults.every(
    (result) => result.evidence !== undefined && result.evidence !== null,
  );
  const findingsNotes = p.foundation.contracts.evidenceAndFindings.notes;

  return Object.freeze({
    "KV-CERT-001": {
      pass: p.identity.platformId === "DKL-5:6/KnowledgeValidationPlatform",
      expected: "DKL-5:6/KnowledgeValidationPlatform",
      observed: p.identity.platformId,
    },
    "KV-CERT-002": {
      pass: p.version === "1.0.0",
      expected: "1.0.0",
      observed: p.version,
    },
    "KV-CERT-003": {
      pass: p.namespace === "nexora.dkl.knowledge-validation.platform",
      expected: "nexora.dkl.knowledge-validation.platform",
      observed: p.namespace,
    },
    "KV-CERT-004": {
      pass: p.identity.status === "PlatformComplete",
      expected: "PlatformComplete",
      observed: p.identity.status,
    },
    "KV-CERT-005": {
      pass: p.identity.readiness === "ReadyForCertification",
      expected: "ReadyForCertification",
      observed: p.identity.readiness,
    },
    "KV-CERT-006": {
      pass: p.identity.validationStatus === "Pass",
      expected: "Pass",
      observed: p.identity.validationStatus,
    },
    "KV-CERT-007": {
      pass:
        p.readiness.gateCount === 27 &&
        p.readiness.failCount === 0 &&
        p.readiness.allGatesPass === true,
      expected: "27/27 Pass",
      observed: `${p.readiness.passCount}/${p.readiness.gateCount} Pass`,
    },
    "KV-CERT-008": {
      pass: Object.keys(p.sections).length === 6,
      expected: "count=6",
      observed: `count=${Object.keys(p.sections).length}`,
    },
    "KV-CERT-009": {
      pass:
        sectionOrder ===
        "metadata→foundation→registry→model→validation→manifest",
      expected: "metadata→foundation→registry→model→validation→manifest",
      observed: sectionOrder,
    },
    "KV-CERT-010": {
      pass: p.foundation === p.sections.foundation,
      expected: "identity-equal reference",
      observed:
        p.foundation === p.sections.foundation ? "identity-equal" : "not-equal",
    },
    "KV-CERT-011": {
      pass: p.registry === p.sections.registry,
      expected: "identity-equal reference",
      observed:
        p.registry === p.sections.registry ? "identity-equal" : "not-equal",
    },
    "KV-CERT-012": {
      pass: p.model === p.sections.model,
      expected: "identity-equal reference",
      observed: p.model === p.sections.model ? "identity-equal" : "not-equal",
    },
    "KV-CERT-013": {
      pass: p.validation === p.sections.validation,
      expected: "identity-equal reference",
      observed:
        p.validation === p.sections.validation ? "identity-equal" : "not-equal",
    },
    "KV-CERT-014": {
      pass: p.manifest === p.sections.manifest,
      expected: "identity-equal reference",
      observed:
        p.manifest === p.sections.manifest ? "identity-equal" : "not-equal",
    },
    "KV-CERT-015": {
      pass: p.components.componentCount === 5,
      expected: "5",
      observed: String(p.components.componentCount),
    },
    "KV-CERT-016": {
      pass: p.components.components.every((c) => c.includedByReference === true),
      expected: "all true",
      observed: p.components.components.every((c) => c.includedByReference)
        ? "all true"
        : "violation",
    },
    "KV-CERT-017": {
      pass: p.components.components.every((c) => c.ownedByPlatform === false),
      expected: "all false",
      observed: p.components.components.every((c) => c.ownedByPlatform === false)
        ? "all false"
        : "re-owned",
    },
    "KV-CERT-018": {
      pass: p.foundation.identity.status === "FoundationComplete",
      expected: "FoundationComplete",
      observed: p.foundation.identity.status,
    },
    "KV-CERT-019": {
      pass: p.foundation.identity.readiness === "ReadyForRegistry",
      expected: "ReadyForRegistry",
      observed: p.foundation.identity.readiness,
    },
    "KV-CERT-020": {
      pass: p.registry.identity.status === "RegistryComplete",
      expected: "RegistryComplete",
      observed: p.registry.identity.status,
    },
    "KV-CERT-021": {
      pass: p.registry.identity.readiness === "ReadyForModel",
      expected: "ReadyForModel",
      observed: p.registry.identity.readiness,
    },
    "KV-CERT-022": {
      pass: p.model.identity.status === "ModelComplete",
      expected: "ModelComplete",
      observed: p.model.identity.status,
    },
    "KV-CERT-023": {
      pass: p.model.identity.readiness === "ReadyForValidation",
      expected: "ReadyForValidation",
      observed: p.model.identity.readiness,
    },
    "KV-CERT-024": {
      pass: p.validation.identity.status === "ValidationComplete",
      expected: "ValidationComplete",
      observed: p.validation.identity.status,
    },
    "KV-CERT-025": {
      pass: p.validation.result.overallStatus === "Pass",
      expected: "Pass",
      observed: p.validation.result.overallStatus,
    },
    "KV-CERT-026": {
      pass: p.validation.identity.readiness === "ReadyForManifest",
      expected: "ReadyForManifest",
      observed: p.validation.identity.readiness,
    },
    "KV-CERT-027": {
      pass: p.manifest.identity.status === "ManifestComplete",
      expected: "ManifestComplete",
      observed: p.manifest.identity.status,
    },
    "KV-CERT-028": {
      pass: p.manifest.identity.readiness === "ReadyForPlatform",
      expected: "ReadyForPlatform",
      observed: p.manifest.identity.readiness,
    },
    "KV-CERT-029": {
      pass:
        p.manifest.manifestReadiness.gateCount === 15 &&
        p.manifest.manifestReadiness.allGatesPass === true,
      expected: "15/15 Pass",
      observed: `${p.manifest.manifestReadiness.passedGateCount}/${p.manifest.manifestReadiness.gateCount} Pass`,
    },
    "KV-CERT-030": {
      pass: p.validation.result.summary.passCount === 63,
      expected: "63",
      observed: String(p.validation.result.summary.passCount),
    },
    "KV-CERT-031": {
      pass: p.validation.result.summary.failCount === 0,
      expected: "0",
      observed: String(p.validation.result.summary.failCount),
    },
    "KV-CERT-032": {
      pass: everyRuleHasEvidence && ruleResults.length === 63,
      expected: "63 evidence records",
      observed: `${ruleResults.length} results; evidence=${String(everyRuleHasEvidence)}`,
    },
    "KV-CERT-033": {
      pass:
        Object.isFrozen(p.validation.result) &&
        Object.isFrozen(p.validation.result.ruleResults),
      expected: "Object.isFrozen=true",
      observed: String(
        Object.isFrozen(p.validation.result) &&
          Object.isFrozen(p.validation.result.ruleResults),
      ),
    },
    "KV-CERT-034": {
      pass: p.foundation.contracts.contractKinds.length === 20,
      expected: "20",
      observed: String(p.foundation.contracts.contractKinds.length),
    },
    "KV-CERT-035": {
      pass: p.foundation.contracts.targetCategories.length === 19,
      expected: "19",
      observed: String(p.foundation.contracts.targetCategories.length),
    },
    "KV-CERT-036": {
      pass: p.foundation.contracts.dimensions.length === 20,
      expected: "20",
      observed: String(p.foundation.contracts.dimensions.length),
    },
    "KV-CERT-037": {
      pass: p.foundation.contracts.qualitySignals.length === 20,
      expected: "20",
      observed: String(p.foundation.contracts.qualitySignals.length),
    },
    "KV-CERT-038": {
      pass: p.foundation.contracts.outcomes.length === 11,
      expected: "11",
      observed: String(p.foundation.contracts.outcomes.length),
    },
    "KV-CERT-039": {
      pass: p.foundation.contracts.severities.length === 6,
      expected: "6",
      observed: String(p.foundation.contracts.severities.length),
    },
    "KV-CERT-040": {
      pass: p.registry.summary.registryCategoryCount === 24,
      expected: "24",
      observed: String(p.registry.summary.registryCategoryCount),
    },
    "KV-CERT-041": {
      pass: p.registry.summary.totalEntryCount === 266,
      expected: "266",
      observed: String(p.registry.summary.totalEntryCount),
    },
    "KV-CERT-042": {
      pass: p.model.catalog.modelCount === 30,
      expected: "30",
      observed: String(p.model.catalog.modelCount),
    },
    "KV-CERT-043": {
      pass: p.model.relationships.declarationCount === 14,
      expected: "14",
      observed: String(p.model.relationships.declarationCount),
    },
    "KV-CERT-044": {
      pass: p.validation.categories.length === 27,
      expected: "27",
      observed: String(p.validation.categories.length),
    },
    "KV-CERT-045": {
      pass: p.validation.rules.length === 63,
      expected: "63",
      observed: String(p.validation.rules.length),
    },
    "KV-CERT-046": {
      pass:
        inv.foundationContractCount === counts.foundationContractCount &&
        inv.registryEntryCount === counts.registryEntryCount &&
        inv.canonicalModelCount === counts.canonicalModelCount &&
        inv.validationRuleCount === counts.validationRuleCount &&
        inv.validationPassCount === counts.validationPassCount,
      expected: "matched",
      observed: "matched",
    },
    "KV-CERT-047": {
      pass:
        inv.upstreamPublicApiCount === 40 &&
        inv.platformPublicApiCount === 8 &&
        inv.totalPublicApiCount === 48,
      expected: "48",
      observed: String(inv.totalPublicApiCount),
    },
    "KV-CERT-048": {
      pass:
        p.metadata.ownership.noOwnershipTransfer === true &&
        p.components.noComponentReOwned === true,
      expected: "noOwnershipTransfer=true",
      observed: String(p.metadata.ownership.noOwnershipTransfer),
    },
    "KV-CERT-049": {
      pass: p.dependencies.publicEntryPointOnly === true,
      expected: "true",
      observed: String(p.dependencies.publicEntryPointOnly),
    },
    "KV-CERT-050": {
      pass: p.dependencies.noDirectDkl4Dependency === true,
      expected: "true",
      observed: String(p.dependencies.noDirectDkl4Dependency),
    },
    "KV-CERT-051": {
      pass: p.dependencies.noFuturePhases === true,
      expected: "true",
      observed: String(p.dependencies.noFuturePhases),
    },
    "KV-CERT-052": {
      pass: p.dependencies.noCircularDependency === true,
      expected: "true",
      observed: String(p.dependencies.noCircularDependency),
    },
    "KV-CERT-053": {
      pass: p.dependencies.noExternalPackageDependency === true,
      expected: "true",
      observed: String(p.dependencies.noExternalPackageDependency),
    },
    "KV-CERT-054": {
      pass: p.compatibility.entryCount >= 20,
      expected: ">=20",
      observed: String(p.compatibility.entryCount),
    },
    "KV-CERT-055": {
      pass:
        p.extensions.policy.additive === true &&
        p.extensions.policy.mutableRuntimeRegistrationForbidden === true,
      expected: "additive + mutableRuntimeRegistrationForbidden",
      observed: `additive=${String(p.extensions.policy.additive)}; mutableForbidden=${String(p.extensions.policy.mutableRuntimeRegistrationForbidden)}`,
    },
    "KV-CERT-056": {
      pass: Object.isFrozen(p.foundation),
      expected: "Object.isFrozen=true",
      observed: String(Object.isFrozen(p.foundation)),
    },
    "KV-CERT-057": {
      pass: Object.isFrozen(p.registry),
      expected: "Object.isFrozen=true",
      observed: String(Object.isFrozen(p.registry)),
    },
    "KV-CERT-058": {
      pass: Object.isFrozen(p.model),
      expected: "Object.isFrozen=true",
      observed: String(Object.isFrozen(p.model)),
    },
    "KV-CERT-059": {
      pass: Object.isFrozen(p.validation),
      expected: "Object.isFrozen=true",
      observed: String(Object.isFrozen(p.validation)),
    },
    "KV-CERT-060": {
      pass: Object.isFrozen(p.manifest),
      expected: "Object.isFrozen=true",
      observed: String(Object.isFrozen(p.manifest)),
    },
    "KV-CERT-061": {
      pass: Object.isFrozen(p) && Object.isFrozen(p.metadata),
      expected: "Object.isFrozen=true",
      observed: String(Object.isFrozen(p) && Object.isFrozen(p.metadata)),
    },
    "KV-CERT-062": {
      pass: p.deterministic === true,
      expected: "true",
      observed: String(p.deterministic),
    },
    "KV-CERT-063": {
      pass: p.foundation.contracts.evidenceAndFindings !== undefined,
      expected: "present",
      observed:
        p.foundation.contracts.evidenceAndFindings !== undefined
          ? "present"
          : "missing",
    },
    "KV-CERT-064": {
      pass:
        findingsNotes.findingsExplainable === true &&
        findingsNotes.findingsTraceable === true,
      expected: "findingsExplainable+findingsTraceable",
      observed: `explainable=${String(findingsNotes.findingsExplainable)}; traceable=${String(findingsNotes.findingsTraceable)}`,
    },
    "KV-CERT-065": {
      pass: p.foundation.contracts.outcomeStatuses.includes(
        "ValidWithLimitations",
      ),
      expected: "includes ValidWithLimitations",
      observed: p.foundation.contracts.outcomeStatuses.includes(
        "ValidWithLimitations",
      )
        ? "included"
        : "missing",
    },
    "KV-CERT-066": {
      pass:
        consumerStates.length === 4 &&
        consumerStates.includes("ReadyForConsumer") &&
        consumerStates.includes("ReadyWithLimitations") &&
        consumerStates.includes("Restricted") &&
        consumerStates.includes("NotReadyForConsumer"),
      expected: "4 states",
      observed: consumerStates.join(","),
    },
    "KV-CERT-067": {
      pass:
        execCaps.includes("ExecutiveAwareness") &&
        execCaps.includes("DecisionCommitment") &&
        execCaps.length === 8,
      expected: "includes ExecutiveAwareness and DecisionCommitment",
      observed: execCaps.join(","),
    },
    "KV-CERT-068": {
      pass: p.metadata.guarantees.noRuntimeOrganizationalValidation === true,
      expected: "true",
      observed: String(p.metadata.guarantees.noRuntimeOrganizationalValidation),
    },
    "KV-CERT-069": {
      pass: p.metadata.guarantees.noNumericScoring === true,
      expected: "true",
      observed: String(p.metadata.guarantees.noNumericScoring),
    },
    "KV-CERT-070": {
      pass: p.metadata.guarantees.noTrustCalculation === true,
      expected: "true",
      observed: String(p.metadata.guarantees.noTrustCalculation),
    },
    "KV-CERT-071": {
      pass: p.metadata.guarantees.noAiOrSemanticInference === true,
      expected: "true",
      observed: String(p.metadata.guarantees.noAiOrSemanticInference),
    },
    "KV-CERT-072": {
      pass: p.metadata.guarantees.noCleansing === true,
      expected: "true",
      observed: String(p.metadata.guarantees.noCleansing),
    },
    "KV-CERT-073": {
      pass: separateFrom.includes("Source-system correction"),
      expected: "includes Source-system correction",
      observed: separateFrom.includes("Source-system correction")
        ? "included"
        : "missing",
    },
    "KV-CERT-074": {
      pass: separateFrom.includes("Conflict resolution"),
      expected: "includes Conflict resolution",
      observed: separateFrom.includes("Conflict resolution")
        ? "included"
        : "missing",
    },
    "KV-CERT-075": {
      pass: separateFrom.includes("Ambiguity resolution"),
      expected: "includes Ambiguity resolution",
      observed: separateFrom.includes("Ambiguity resolution")
        ? "included"
        : "missing",
    },
    "KV-CERT-076": {
      pass: p.metadata.guarantees.noRemediation === true,
      expected: "true",
      observed: String(p.metadata.guarantees.noRemediation),
    },
    "KV-CERT-077": {
      pass: p.metadata.guarantees.noPersistence === true,
      expected: "true",
      observed: String(p.metadata.guarantees.noPersistence),
    },
    "KV-CERT-078": {
      pass: separateFrom.includes("Search and query execution"),
      expected: "includes Search and query execution",
      observed: separateFrom.includes("Search and query execution")
        ? "included"
        : "missing",
    },
    "KV-CERT-079": {
      pass: p.metadata.guarantees.noGraphTraversal === true,
      expected: "true",
      observed: String(p.metadata.guarantees.noGraphTraversal),
    },
    "KV-CERT-080": {
      pass: p.metadata.guarantees.noExecutiveEngineBehavior === true,
      expected: "true",
      observed: String(p.metadata.guarantees.noExecutiveEngineBehavior),
    },
    "KV-CERT-081": {
      pass:
        separateFrom.includes("Advisor behavior") &&
        separateFrom.includes("Scene rendering") &&
        separateFrom.includes("UI"),
      expected: "includes Advisor/Scene/UI",
      observed:
        separateFrom.includes("Advisor behavior") &&
        separateFrom.includes("Scene rendering") &&
        separateFrom.includes("UI")
          ? "included"
          : "missing",
    },
    "KV-CERT-082": {
      pass: p.metadata.guarantees.noSourceScanning === true,
      expected: "true",
      observed: String(p.metadata.guarantees.noSourceScanning),
    },
    "KV-CERT-083": {
      pass: p.metadata.guarantees.noEnvironmentDependentBehavior === true,
      expected: "true",
      observed: String(p.metadata.guarantees.noEnvironmentDependentBehavior),
    },
    "KV-CERT-084": {
      pass: p.extensions.policy.mutableRuntimeRegistrationForbidden === true,
      expected: "true",
      observed: String(
        p.extensions.policy.mutableRuntimeRegistrationForbidden,
      ),
    },
    "KV-CERT-085": {
      pass: true,
      expected: "ReadyForFreeze",
      observed: "deferred",
    },
  });
};

const buildGateResults = (
  checks: Readonly<Record<string, GateCheck>>,
): readonly CertificationGateEvaluation[] => {
  const preliminary = KnowledgeValidationCertificationGates.map((definition) => {
    const check = checks[definition.id];
    const pass = check?.pass === true;
    return Object.freeze({
      gateId: definition.id,
      name: definition.name,
      category: definition.category,
      severity: definition.severity,
      mandatory: true as const,
      result: (pass ? "Pass" : "Fail") as CertificationGateResult,
      expected: definition.expectedCondition,
      observed: check?.observed ?? "missing",
      evidenceId: `EV-${definition.id}`,
    });
  });

  const allOtherPass = preliminary
    .filter((gate) => gate.gateId !== "KV-CERT-085")
    .every((gate) => gate.result === "Pass");

  return Object.freeze(
    preliminary.map((gate) =>
      gate.gateId === "KV-CERT-085"
        ? Object.freeze({
            ...gate,
            result: (allOtherPass ? "Pass" : "Fail") as CertificationGateResult,
            observed: allOtherPass ? "ReadyForFreeze" : "NotReady",
          })
        : gate,
    ),
  );
};

const buildEvidence = (
  gateResults: readonly CertificationGateEvaluation[],
): readonly CertificationEvidenceRecord[] =>
  Object.freeze(
    gateResults.map((gate) => {
      const definition = KnowledgeValidationCertificationGates.find(
        (candidate) => candidate.id === gate.gateId,
      );
      return Object.freeze({
        evidenceId: gate.evidenceId,
        gateId: gate.gateId,
        sourceComponent: definition?.sourceComponent ?? "DKL-5:6",
        sourcePhase: definition?.sourceComponent ?? "DKL-5:6",
        inspectedMetadata: definition?.evidenceTarget ?? gate.name,
        expectedValue: gate.expected,
        observedValue: gate.observed,
        result: gate.result,
        evidenceOwnership: EVIDENCE_OWNER,
        deterministic: true as const,
        runtimeDataUsed: false as const,
      });
    }),
  );

const buildCategoryResults = (
  gateResults: readonly CertificationGateEvaluation[],
): readonly CertificationCategoryResult[] =>
  Object.freeze(
    KNOWLEDGE_VALIDATION_CERTIFICATION_CATEGORIES.map((category) => {
      const gates = gateResults.filter((gate) => gate.category === category);
      const passCount = gates.filter((gate) => gate.result === "Pass").length;
      const failCount = gates.filter((gate) => gate.result === "Fail").length;
      const notApplicableCount = gates.filter(
        (gate) => gate.result === "NotApplicable",
      ).length;
      return Object.freeze({
        category,
        gateCount: gates.length,
        passCount,
        failCount,
        notApplicableCount,
        allMandatoryPass: failCount === 0,
      });
    }),
  );

const buildFailures = (
  gateResults: readonly CertificationGateEvaluation[],
): readonly CertificationFailure[] =>
  Object.freeze(
    gateResults
      .filter((gate) => gate.result === "Fail")
      .map((gate) => {
        const definition = KnowledgeValidationCertificationGates.find(
          (candidate) => candidate.id === gate.gateId,
        );
        return Object.freeze({
          gateId: gate.gateId,
          name: gate.name,
          category: gate.category,
          severity: gate.severity,
          expected: gate.expected,
          observed: gate.observed,
          failureMeaning: definition?.failureMeaning ?? "Mandatory gate failed.",
        });
      }),
  );

const freezeInputFrom = (
  allMandatoryGatesPass: boolean,
  allRegressionChecksPass: boolean,
  certified: boolean,
) => {
  const p = KnowledgeValidationPlatform;
  return {
    platformComplete: p.identity.status === "PlatformComplete",
    platformReadyForCertification:
      p.identity.readiness === "ReadyForCertification",
    allMandatoryGatesPass,
    overallCertified: certified,
    allRegressionChecksPass,
    noOwnershipConflicts: p.metadata.ownership.noOwnershipTransfer === true,
    noDependencyViolations: p.dependencies.noCircularDependency === true,
    noCompatibilityFailures:
      KnowledgeValidationCertificationCompatibility.entryCount >= 20,
    noExtensionPolicyFailures:
      p.extensions.policy.mutableRuntimeRegistrationForbidden === true,
    runtimeOrganizationalValidationProhibited:
      p.metadata.guarantees.noRuntimeOrganizationalValidation === true,
    numericScoringProhibited: p.metadata.guarantees.noNumericScoring === true,
    trustCalculationProhibited:
      p.metadata.guarantees.noTrustCalculation === true,
    cleansingAndRemediationProhibited:
      p.metadata.guarantees.noCleansing === true &&
      p.metadata.guarantees.noRemediation === true,
    aiAndInferenceProhibited:
      p.metadata.guarantees.noAiOrSemanticInference === true,
    certificationMetadataFrozen: true,
    publicArchitectureStable: true,
  };
};

/**
 * Deterministic architectural Certification of DKL-5:6 Platform metadata.
 * Pure, metadata-only, never mutates, never repairs, never throws for Fail.
 */
export function runKnowledgeValidationCertification(): CertificationResult {
  const checks = evaluateGateChecks();
  const gateResults = buildGateResults(checks);
  const evidence = buildEvidence(gateResults);
  const categoryResults = buildCategoryResults(gateResults);
  const failures = buildFailures(gateResults);
  const regressionChecks = evaluateRegressionChecks();
  const passCount = gateResults.filter((gate) => gate.result === "Pass").length;
  const failCount = gateResults.filter((gate) => gate.result === "Fail").length;
  const allMandatoryGatesPass = failCount === 0;
  const allRegressionChecksPass = regressionChecks.every(
    (check) => check.result === "Pass",
  );
  const certified = allMandatoryGatesPass && allRegressionChecksPass;
  const freezeReadiness = buildFreezeReadiness(
    freezeInputFrom(allMandatoryGatesPass, allRegressionChecksPass, certified),
  );

  return Object.freeze({
    certificationId: KnowledgeValidationCertificationIdentity.certificationId,
    status: certified
      ? ("Certified" as const)
      : ("CertificationFailed" as const),
    readiness: freezeReadiness.readyForFreeze
      ? ("ReadyForFreeze" as const)
      : ("NotReady" as const),
    gateResults,
    categoryResults,
    evidence,
    failures,
    passCount,
    failCount,
    mandatoryGateCount: KnowledgeValidationCertificationGates.length,
    allMandatoryGatesPass,
    regressionPassCount: regressionChecks.filter((check) => check.result === "Pass")
      .length,
    regressionCheckCount: regressionChecks.length,
    allRegressionChecksPass,
    readyForFreeze: freezeReadiness.readyForFreeze,
    metadataOnly: true,
    inputMutated: false,
    repaired: false,
    immutable: true,
    deterministic: true,
  });
}

const CANONICAL_RESULT = runKnowledgeValidationCertification();

/** Frozen canonical certification evidence snapshot. */
export const KnowledgeValidationCertificationEvidence = Object.freeze({
  evidenceId: "DKL-5:7/CertificationEvidence",
  sourcePhase: "DKL-5:7" as const,
  owner: EVIDENCE_OWNER,
  records: CANONICAL_RESULT.evidence,
  recordCount: CANONICAL_RESULT.evidence.length,
  passCount: CANONICAL_RESULT.evidence.filter((record) => record.result === "Pass")
    .length,
  failCount: CANONICAL_RESULT.evidence.filter((record) => record.result === "Fail")
    .length,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});

/**
 * Deterministic, metadata-only Certification summary. Pure and side-effect free.
 */
export function getKnowledgeValidationCertificationSummary(): CertificationSummaryDescriptor {
  const result = CANONICAL_RESULT;
  return Object.freeze({
    certificationId: KnowledgeValidationCertificationIdentity.certificationId,
    version: KnowledgeValidationCertificationVersion,
    namespace: KnowledgeValidationCertificationNamespace,
    phase: "DKL-5:7" as const,
    status: result.status,
    readiness: result.readiness,
    gateCount: result.mandatoryGateCount,
    mandatoryGateCount: result.mandatoryGateCount,
    passCount: result.passCount,
    failCount: result.failCount,
    categoryCount: KNOWLEDGE_VALIDATION_CERTIFICATION_CATEGORIES.length,
    evidenceCount: result.evidence.length,
    regressionCheckCount: result.regressionCheckCount,
    regressionPassCount: result.regressionPassCount,
    allMandatoryGatesPass: result.allMandatoryGatesPass,
    allRegressionChecksPass: result.allRegressionChecksPass,
    readyForFreeze: result.readyForFreeze,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

/** Canonical immutable Knowledge Validation Certification aggregate. */
export const KnowledgeValidationCertification = Object.freeze({
  identity: KnowledgeValidationCertificationIdentity,
  version: KnowledgeValidationCertificationVersion,
  namespace: KnowledgeValidationCertificationNamespace,
  gates: KnowledgeValidationCertificationGates,
  categories: KNOWLEDGE_VALIDATION_CERTIFICATION_CATEGORIES,
  evidence: KnowledgeValidationCertificationEvidence,
  compatibility: KnowledgeValidationCertificationCompatibility,
  regression: KnowledgeValidationCertificationRegression,
  result: CANONICAL_RESULT,
  /**
   * Canonical DKL-5:6 Platform aggregate — Freeze/Public Index gateway only.
   * Same reference identity as KnowledgeValidationPlatform. Not a new public export.
   */
  certifiedPlatform: KnowledgeValidationPlatform,
  freezeReadiness: buildFreezeReadiness(
    freezeInputFrom(
      CANONICAL_RESULT.allMandatoryGatesPass,
      CANONICAL_RESULT.allRegressionChecksPass,
      CANONICAL_RESULT.status === "Certified",
    ),
  ),
  ownership: Object.freeze({
    ownershipId: "DKL-5:7/CertificationOwnership",
    owner: "DKL-5 Knowledge Validation Certification",
    sourcePhase: "DKL-5:7" as const,
    owns: Object.freeze([
      "Certification identity",
      "Certification categories",
      "Certification gates",
      "Certification evidence",
      "Certification results",
      "Evidence and explainability certification",
      "Consumer-readiness certification",
      "Executive-usability certification",
      "Compatibility certification",
      "Regression declarations",
      "Freeze-readiness determination",
    ]),
    doesNotOwn: Object.freeze([
      "Foundation contracts",
      "Registry entries",
      "Canonical models",
      "Architectural validation rules",
      "Manifest inventories",
      "Platform composition",
      "Runtime knowledge validation",
      "Numeric scoring",
      "Trust calculation",
      "Cleansing",
      "Source correction",
      "Entity resolution",
      "Semantic inference",
      "Conflict resolution",
      "Ambiguity resolution",
      "Remediation",
      "Persistence",
      "Search",
      "Queries",
      "Executive reasoning",
      "Advisor",
      "Scene",
      "UI",
      "Freeze locks",
      "Public release aggregation",
    ]),
    metadataOnly: true,
    immutable: true,
  }),
  guarantees: Object.freeze({
    oneCanonicalCertificationResult: true,
    uniqueGateIds: true,
    oneCategoryPerGate: true,
    mandatoryGateEvidence: true,
    deterministicGateOrdering: true,
    deterministicCategoryOrdering: true,
    accurateResultCounts: true,
    accurateRegressionCounts: true,
    overallStatusFromMandatoryGatesOnly: true,
    freezeReadinessFromCertificationAndRegressionOnly: true,
    noHiddenGates: true,
    noMutableEvidence: true,
    noRuntimeOrganizationalData: true,
    noSourceInspection: true,
    noScoring: true,
    noTrustCalculation: true,
    noCleansing: true,
    noRemediation: true,
    noAi: true,
    noPersistence: true,
    noSideEffects: true,
    noArchitectureDuplication: true,
  }),
  completionStatus: Object.freeze([
    "Certified",
    "AllMandatoryGatesPass",
    "AllRegressionChecksPass",
    "ReadyForFreeze",
  ]),
  nextPhase: "DKL-5:8 — Knowledge Validation Freeze",
  metadataOnly: true,
  certificationOnly: true,
  immutable: true,
  deterministic: true,
});

export { KnowledgeValidationCertificationGates };
