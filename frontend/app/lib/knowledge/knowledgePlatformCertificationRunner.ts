/**
 * KNL-14 — Knowledge Platform Certification runner.
 */

import { validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import {
  BEST_PRACTICE_SELF_MANIFEST,
  BEST_PRACTICE_PUBLIC_API_RULES,
  getBestPracticeManifest,
  validateBestPracticePlatform,
} from "./bestPracticeContracts.ts";
import { BEST_PRACTICE_PUBLIC_API_REGISTRY } from "./bestPracticeCatalog.ts";
import {
  BUSINESS_ONTOLOGY_SELF_MANIFEST,
  BUSINESS_ONTOLOGY_PUBLIC_API_RULES,
  getBusinessOntologyManifest,
  validateBusinessOntology,
} from "./businessOntologyContracts.ts";
import { BUSINESS_ONTOLOGY_PUBLIC_API_REGISTRY } from "./businessOntologyCatalog.ts";
import {
  BUSINESS_VOCABULARY_SELF_MANIFEST,
  BUSINESS_VOCABULARY_PUBLIC_API_RULES,
  getBusinessVocabularyManifest,
  validateBusinessVocabulary,
} from "./businessVocabularyContracts.ts";
import { BUSINESS_VOCABULARY_PUBLIC_API_REGISTRY } from "./businessVocabularyCatalog.ts";
import {
  FRAMEWORK_LIBRARY_SELF_MANIFEST,
  FRAMEWORK_LIBRARY_PUBLIC_API_RULES,
  getFrameworkLibraryManifest,
  validateFrameworkLibrary,
} from "./frameworkLibraryContracts.ts";
import { FRAMEWORK_LIBRARY_PUBLIC_API_REGISTRY } from "./frameworkLibraryCatalog.ts";
import {
  INDUSTRY_MODELS_SELF_MANIFEST,
  INDUSTRY_MODELS_PUBLIC_API_RULES,
  getIndustryModelsManifest,
  validateIndustryModels,
} from "./industryModelContracts.ts";
import { INDUSTRY_MODELS_PUBLIC_API_REGISTRY } from "./industryModelCatalog.ts";
import {
  KNOWLEDGE_GRAPH_SELF_MANIFEST,
  KNOWLEDGE_GRAPH_PUBLIC_API_RULES,
  getKnowledgeGraphManifest,
  validateKnowledgeGraph,
} from "./knowledgeGraphContracts.ts";
import { KNOWLEDGE_GRAPH_PUBLIC_API_REGISTRY } from "./knowledgeGraphCatalog.ts";
import {
  KNOWLEDGE_GOVERNANCE_SELF_MANIFEST,
  KNOWLEDGE_GOVERNANCE_PUBLIC_API_RULES,
  getKnowledgeGovernanceManifest,
  validateKnowledgeGovernancePlatform,
} from "./knowledgeGovernanceContracts.ts";
import { KNOWLEDGE_GOVERNANCE_PUBLIC_API_REGISTRY } from "./knowledgeGovernanceCatalog.ts";
import {
  KNOWLEDGE_LEARNING_BRIDGE_SELF_MANIFEST,
  KNOWLEDGE_LEARNING_BRIDGE_PUBLIC_API_RULES,
  getKnowledgeLearningBridgeManifest,
  validateKnowledgeLearningBridgePlatform,
} from "./knowledgeLearningBridgeContracts.ts";
import { KNOWLEDGE_LEARNING_BRIDGE_PUBLIC_API_REGISTRY } from "./knowledgeLearningBridgeCatalog.ts";
import {
  KNOWLEDGE_RETRIEVAL_SELF_MANIFEST,
  KNOWLEDGE_RETRIEVAL_PUBLIC_API_RULES,
  getKnowledgeRetrievalManifest,
  validateKnowledgeRetrievalEngine,
} from "./knowledgeRetrievalContracts.ts";
import { KNOWLEDGE_RETRIEVAL_PUBLIC_API_REGISTRY } from "./knowledgeRetrievalCatalog.ts";
import {
  KNOWLEDGE_VALIDATION_SELF_MANIFEST,
  KNOWLEDGE_VALIDATION_PUBLIC_API_RULES,
  getKnowledgeValidationManifest,
  validateKnowledgeValidationPlatform,
} from "./knowledgeValidationPlatformContracts.ts";
import { KNOWLEDGE_VALIDATION_PUBLIC_API_REGISTRY } from "./knowledgeValidationPlatformCatalog.ts";
import {
  KNOWLEDGE_VERSIONING_SELF_MANIFEST,
  KNOWLEDGE_VERSIONING_PUBLIC_API_RULES,
  getKnowledgeVersioningManifest,
  validateKnowledgeVersioningPlatform,
} from "./knowledgeVersioningContracts.ts";
import { KNOWLEDGE_VERSIONING_PUBLIC_API_REGISTRY } from "./knowledgeVersioningCatalog.ts";
import {
  KNOWLEDGE_PLATFORM_SELF_MANIFEST,
  KNOWLEDGE_PUBLIC_API_RULES,
  getKnowledgeManifest,
  validateKnowledgeFoundation,
} from "./knowledgeContracts.ts";
import { KNOWLEDGE_PUBLIC_API_REGISTRY } from "./knowledgeConstants.ts";
import {
  CERTIFICATION_GATE_KEY_BY_PHASE,
  CERTIFICATION_GATE_KEYS,
  CERTIFICATION_EXTENSION_POINT_KEYS,
  KNL_PHASE_CERTIFICATION_TARGETS,
  KNOWLEDGE_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  KNOWLEDGE_PLATFORM_CERTIFICATION_NAMESPACE,
  KNOWLEDGE_PLATFORM_CERTIFICATION_OWNER,
  KNOWLEDGE_PLATFORM_CERTIFICATION_VERSION_PATTERN,
} from "./knowledgePlatformCertificationCatalog.ts";
import type {
  CertificationCheck,
  CertificationEvidence,
  CertificationGate,
  CertificationProfile,
  CertificationResult,
  KnowledgePlatformCertificationIssue,
  KnowledgePlatformCertificationReport,
  KnowledgePlatformCertificationRunResult,
} from "./knowledgePlatformCertificationTypes.ts";
import {
  POLICY_RULE_BASE_SELF_MANIFEST,
  POLICY_RULE_BASE_PUBLIC_API_RULES,
  getPolicyRuleBaseManifest,
  validatePolicyRuleBase,
} from "./policyRuleContracts.ts";
import { POLICY_RULE_BASE_PUBLIC_API_REGISTRY } from "./policyRuleCatalog.ts";
import { buildKnowledgeGovernancePlatform } from "./knowledgeGovernancePlatform.ts";

export const KNOWLEDGE_PLATFORM_CERTIFICATION_RUNNER_VERSION = "KNL/14-RUNNER-1" as const;

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

type PhaseCertificationTarget = Readonly<{
  validate: (timestamp: string) => { valid: boolean; issues?: readonly { message: string }[] };
  getManifest: (timestamp: string) => {
    contractVersion: string;
    platformId?: string;
    publicApis: readonly string[];
    futurePhases?: readonly string[];
  };
  selfManifest: StageManifest;
  publicApiRegistry: readonly string[];
  publicApiRules: { metadataOnly: boolean };
}>;

const PHASE_CERTIFICATION_TARGETS: Readonly<Record<(typeof KNL_PHASE_CERTIFICATION_TARGETS)[number]["key"], PhaseCertificationTarget>> =
  Object.freeze({
    knl_foundation: Object.freeze({
      validate: validateKnowledgeFoundation,
      getManifest: getKnowledgeManifest,
      selfManifest: KNOWLEDGE_PLATFORM_SELF_MANIFEST,
      publicApiRegistry: KNOWLEDGE_PUBLIC_API_REGISTRY,
      publicApiRules: KNOWLEDGE_PUBLIC_API_RULES,
    }),
    knl_ontology: Object.freeze({
      validate: validateBusinessOntology,
      getManifest: getBusinessOntologyManifest,
      selfManifest: BUSINESS_ONTOLOGY_SELF_MANIFEST,
      publicApiRegistry: BUSINESS_ONTOLOGY_PUBLIC_API_REGISTRY,
      publicApiRules: BUSINESS_ONTOLOGY_PUBLIC_API_RULES,
    }),
    knl_vocabulary: Object.freeze({
      validate: validateBusinessVocabulary,
      getManifest: getBusinessVocabularyManifest,
      selfManifest: BUSINESS_VOCABULARY_SELF_MANIFEST,
      publicApiRegistry: BUSINESS_VOCABULARY_PUBLIC_API_REGISTRY,
      publicApiRules: BUSINESS_VOCABULARY_PUBLIC_API_RULES,
    }),
    knl_graph: Object.freeze({
      validate: validateKnowledgeGraph,
      getManifest: getKnowledgeGraphManifest,
      selfManifest: KNOWLEDGE_GRAPH_SELF_MANIFEST,
      publicApiRegistry: KNOWLEDGE_GRAPH_PUBLIC_API_REGISTRY,
      publicApiRules: KNOWLEDGE_GRAPH_PUBLIC_API_RULES,
    }),
    knl_industry: Object.freeze({
      validate: validateIndustryModels,
      getManifest: getIndustryModelsManifest,
      selfManifest: INDUSTRY_MODELS_SELF_MANIFEST,
      publicApiRegistry: INDUSTRY_MODELS_PUBLIC_API_REGISTRY,
      publicApiRules: INDUSTRY_MODELS_PUBLIC_API_RULES,
    }),
    knl_framework: Object.freeze({
      validate: validateFrameworkLibrary,
      getManifest: getFrameworkLibraryManifest,
      selfManifest: FRAMEWORK_LIBRARY_SELF_MANIFEST,
      publicApiRegistry: FRAMEWORK_LIBRARY_PUBLIC_API_REGISTRY,
      publicApiRules: FRAMEWORK_LIBRARY_PUBLIC_API_RULES,
    }),
    knl_policy: Object.freeze({
      validate: validatePolicyRuleBase,
      getManifest: getPolicyRuleBaseManifest,
      selfManifest: POLICY_RULE_BASE_SELF_MANIFEST,
      publicApiRegistry: POLICY_RULE_BASE_PUBLIC_API_REGISTRY,
      publicApiRules: POLICY_RULE_BASE_PUBLIC_API_RULES,
    }),
    knl_best_practice: Object.freeze({
      validate: validateBestPracticePlatform,
      getManifest: getBestPracticeManifest,
      selfManifest: BEST_PRACTICE_SELF_MANIFEST,
      publicApiRegistry: BEST_PRACTICE_PUBLIC_API_REGISTRY,
      publicApiRules: BEST_PRACTICE_PUBLIC_API_RULES,
    }),
    knl_retrieval: Object.freeze({
      validate: validateKnowledgeRetrievalEngine,
      getManifest: getKnowledgeRetrievalManifest,
      selfManifest: KNOWLEDGE_RETRIEVAL_SELF_MANIFEST,
      publicApiRegistry: KNOWLEDGE_RETRIEVAL_PUBLIC_API_REGISTRY,
      publicApiRules: KNOWLEDGE_RETRIEVAL_PUBLIC_API_RULES,
    }),
    knl_validation: Object.freeze({
      validate: validateKnowledgeValidationPlatform,
      getManifest: getKnowledgeValidationManifest,
      selfManifest: KNOWLEDGE_VALIDATION_SELF_MANIFEST,
      publicApiRegistry: KNOWLEDGE_VALIDATION_PUBLIC_API_REGISTRY,
      publicApiRules: KNOWLEDGE_VALIDATION_PUBLIC_API_RULES,
    }),
    knl_versioning: Object.freeze({
      validate: validateKnowledgeVersioningPlatform,
      getManifest: getKnowledgeVersioningManifest,
      selfManifest: KNOWLEDGE_VERSIONING_SELF_MANIFEST,
      publicApiRegistry: KNOWLEDGE_VERSIONING_PUBLIC_API_REGISTRY,
      publicApiRules: KNOWLEDGE_VERSIONING_PUBLIC_API_RULES,
    }),
    knl_learning_bridge: Object.freeze({
      validate: validateKnowledgeLearningBridgePlatform,
      getManifest: getKnowledgeLearningBridgeManifest,
      selfManifest: KNOWLEDGE_LEARNING_BRIDGE_SELF_MANIFEST,
      publicApiRegistry: KNOWLEDGE_LEARNING_BRIDGE_PUBLIC_API_REGISTRY,
      publicApiRules: KNOWLEDGE_LEARNING_BRIDGE_PUBLIC_API_RULES,
    }),
    knl_governance: Object.freeze({
      validate: validateKnowledgeGovernancePlatform,
      getManifest: getKnowledgeGovernanceManifest,
      selfManifest: KNOWLEDGE_GOVERNANCE_SELF_MANIFEST,
      publicApiRegistry: KNOWLEDGE_GOVERNANCE_PUBLIC_API_REGISTRY,
      publicApiRules: KNOWLEDGE_GOVERNANCE_PUBLIC_API_RULES,
    }),
  });

let lastReport: KnowledgePlatformCertificationReport | null = null;
let platformInitialized = false;

function createMetadata(metadataId: string, timestamp: string) {
  return Object.freeze({
    metadataId,
    metadataVersion: KNOWLEDGE_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
    namespace: KNOWLEDGE_PLATFORM_CERTIFICATION_NAMESPACE,
    owner: KNOWLEDGE_PLATFORM_CERTIFICATION_OWNER,
    extensions: Object.freeze({}),
    createdAt: timestamp,
    readOnly: true as const,
  });
}

function gate(
  gateKey: (typeof CERTIFICATION_GATE_KEYS)[number],
  title: string,
  passed: boolean,
  evidence: string
): CertificationGate {
  return Object.freeze({
    gateId: `certification-gate-${gateKey}`,
    gateKey,
    title,
    passed,
    evidence,
    readOnly: true as const,
  });
}

export function resetKnowledgePlatformCertificationForTests(): void {
  lastReport = null;
  platformInitialized = false;
}

export function isKnowledgePlatformCertificationInitialized(): boolean {
  return platformInitialized;
}

export function getKnowledgePlatformCertificationReport(): KnowledgePlatformCertificationReport | null {
  return lastReport;
}

export function runKnowledgePlatformCertification(
  timestamp: string = FIXED_TIME
): KnowledgePlatformCertificationRunResult {
  const init = buildKnowledgeGovernancePlatform(timestamp);
  if (!init.success) {
    const failedReport = Object.freeze({
      reportId: "knowledge-platform-certification-report-failed-init",
      contractVersion: KNOWLEDGE_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
      valid: false,
      passed: false,
      passedGates: 0,
      totalGates: CERTIFICATION_GATE_KEYS.length,
      passedPhases: 0,
      totalPhases: KNL_PHASE_CERTIFICATION_TARGETS.length,
      profiles: Object.freeze([]),
      gates: Object.freeze([]),
      checks: Object.freeze([]),
      results: Object.freeze([]),
      evidence: Object.freeze([]),
      issues: Object.freeze([
        Object.freeze({ code: "init_failed", message: init.reason, readOnly: true as const }),
      ]),
      generatedAt: timestamp,
      readOnly: true as const,
    });
    lastReport = failedReport;
    platformInitialized = false;
    return Object.freeze({
      success: false,
      reason: init.reason,
      passedGates: 0,
      totalGates: CERTIFICATION_GATE_KEYS.length,
      passedPhases: 0,
      totalPhases: KNL_PHASE_CERTIFICATION_TARGETS.length,
      readOnly: true as const,
    });
  }

  platformInitialized = true;
  const profiles: CertificationProfile[] = [];
  const checks: CertificationCheck[] = [];
  const results: CertificationResult[] = [];
  const evidence: CertificationEvidence[] = [];
  const issues: KnowledgePlatformCertificationIssue[] = [];
  const gates: CertificationGate[] = [];

  for (const target of KNL_PHASE_CERTIFICATION_TARGETS) {
    const runner = PHASE_CERTIFICATION_TARGETS[target.key];
    const validation = runner.validate(timestamp);
    const manifest = runner.getManifest(timestamp);
    const manifestValid = manifest.contractVersion === target.phaseId;
    const platformIdValid = !manifest.platformId || manifest.platformId === target.platformId;
    const publicApisValid = manifest.publicApis.length === runner.publicApiRegistry.length;
    const boundaryValid = runner.publicApiRules.metadataOnly === true;
    const stageManifestValid = validateStageManifest(runner.selfManifest).valid;
    const versionValid = KNOWLEDGE_PLATFORM_CERTIFICATION_VERSION_PATTERN.test(target.phaseId);
    const passed =
      validation.valid &&
      manifestValid &&
      platformIdValid &&
      publicApisValid &&
      boundaryValid &&
      stageManifestValid &&
      versionValid;

    profiles.push(
      Object.freeze({
        profileId: `certification-profile-${target.key}`,
        phaseKey: target.key,
        phaseId: target.phaseId,
        platformId: target.platformId,
        label: target.label,
        description: `Certification profile metadata for ${target.label}.`,
        status: passed ? "passed" : "failed",
        version: KNOWLEDGE_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
        metadata: createMetadata(`metadata-profile-${target.key}`, timestamp),
        readOnly: true as const,
      })
    );

    checks.push(
      Object.freeze({
        checkId: `certification-check-${target.key}-validation`,
        phaseKey: target.key,
        checkType: "phase_validation",
        passed: validation.valid,
        message: validation.valid ? `${target.label} validation passed.` : `${target.label} validation failed.`,
        readOnly: true as const,
      }),
      Object.freeze({
        checkId: `certification-check-${target.key}-manifest`,
        phaseKey: target.key,
        checkType: "manifest",
        passed: manifestValid,
        message: manifestValid
          ? `${target.label} manifest contract version matches ${target.phaseId}.`
          : `${target.label} manifest contract version mismatch.`,
        readOnly: true as const,
      }),
      Object.freeze({
        checkId: `certification-check-${target.key}-public-api`,
        phaseKey: target.key,
        checkType: "public_api",
        passed: publicApisValid,
        message: publicApisValid
          ? `${target.label} public APIs declared (${manifest.publicApis.length}).`
          : `${target.label} public API registry incomplete.`,
        readOnly: true as const,
      }),
      Object.freeze({
        checkId: `certification-check-${target.key}-boundary`,
        phaseKey: target.key,
        checkType: "boundary",
        passed: boundaryValid && stageManifestValid,
        message: boundaryValid && stageManifestValid
          ? `${target.label} boundary rules declared.`
          : `${target.label} boundary rules incomplete.`,
        readOnly: true as const,
      })
    );

    results.push(
      Object.freeze({
        resultId: `certification-result-${target.key}`,
        phaseKey: target.key,
        phaseId: target.phaseId,
        passed,
        summary: passed ? `${target.label} certified.` : `${target.label} certification failed.`,
        readOnly: true as const,
      })
    );

    evidence.push(
      Object.freeze({
        evidenceId: `certification-evidence-${target.key}`,
        phaseKey: target.key,
        label: target.label,
        value: `${target.phaseId}:${target.platformId}:${manifest.publicApis.length} apis`,
        readOnly: true as const,
      })
    );

    if (!validation.valid && validation.issues) {
      for (const entry of validation.issues) {
        issues.push(Object.freeze({ code: "phase_invalid", message: entry.message, readOnly: true as const }));
      }
    }

    gates.push(
      gate(
        CERTIFICATION_GATE_KEY_BY_PHASE[target.key],
        `${target.label} certification`,
        passed,
        passed ? target.phaseId : "failed"
      )
    );
  }

  const manifestCompleteness = profiles.length === KNL_PHASE_CERTIFICATION_TARGETS.length;
  const dependencyChain = KNL_PHASE_CERTIFICATION_TARGETS.every((target, index) => {
    if (index === 0) return true;
    const previous = KNL_PHASE_CERTIFICATION_TARGETS[index - 1];
    const runner = PHASE_CERTIFICATION_TARGETS[target.key];
    const manifest = runner.getManifest(timestamp);
    const prerequisites = runner.selfManifest.prerequisites ?? [];
    return (prerequisites as readonly string[]).includes(previous.phaseId);
  });
  const publicApiPresence = checks.filter((entry) => entry.checkType === "public_api").every((entry) => entry.passed);
  const boundaryRules = checks.filter((entry) => entry.checkType === "boundary").every((entry) => entry.passed);
  const platformIdConsistency = results.every((entry) => {
    const target = KNL_PHASE_CERTIFICATION_TARGETS.find((phase) => phase.key === entry.phaseKey);
    const runner = PHASE_CERTIFICATION_TARGETS[entry.phaseKey];
    const manifest = runner.getManifest(timestamp);
    return !manifest.platformId || manifest.platformId === target?.platformId;
  });
  const versionLabelValidity = KNL_PHASE_CERTIFICATION_TARGETS.every((target) =>
    KNOWLEDGE_PLATFORM_CERTIFICATION_VERSION_PATTERN.test(target.phaseId)
  );
  const extensionPointsReserved = CERTIFICATION_EXTENSION_POINT_KEYS.length >= 2;
  const additiveArchitecture = KNL_PHASE_CERTIFICATION_TARGETS.every((target) => {
    const runner = PHASE_CERTIFICATION_TARGETS[target.key];
    return runner.selfManifest.lifecycle === "build" && runner.selfManifest.runtimePath === "library-only";
  });
  const passedPhases = results.filter((entry) => entry.passed).length;
  const platformReadiness = passedPhases === KNL_PHASE_CERTIFICATION_TARGETS.length;

  gates.push(
    gate("N_manifest_completeness", "Manifest completeness", manifestCompleteness, String(profiles.length)),
    gate("O_dependency_chain", "Dependency chain", dependencyChain, dependencyChain ? "KNL/1→KNL/13 chain valid" : "dependency mismatch"),
    gate("P_public_api_presence", "Public API presence", publicApiPresence, publicApiPresence ? "All public APIs declared" : "missing apis"),
    gate("Q_boundary_rules", "Boundary rules", boundaryRules, boundaryRules ? "All boundary rules metadata-only" : "boundary failure"),
    gate("R_platform_id_consistency", "Platform ID consistency", platformIdConsistency, platformIdConsistency ? "Platform IDs consistent" : "platform id mismatch"),
    gate("S_version_label_validity", "Version label validity", versionLabelValidity, versionLabelValidity ? "All KNL/N labels valid" : "invalid labels"),
    gate("T_extension_points_reserved", "Extension points reserved", extensionPointsReserved, CERTIFICATION_EXTENSION_POINT_KEYS.join(", ")),
    gate("U_additive_architecture", "Additive architecture", additiveArchitecture, additiveArchitecture ? "All phases library-only build" : "architecture violation"),
    gate(
      "Z_platform_readiness",
      "Platform readiness",
      platformReadiness && manifestCompleteness && dependencyChain && publicApiPresence && boundaryRules,
      `${passedPhases}/${KNL_PHASE_CERTIFICATION_TARGETS.length} phases certified`
    )
  );

  const passedGates = gates.filter((entry) => entry.passed).length;
  const passed = passedGates === gates.length && issues.length === 0;

  const report = Object.freeze({
    reportId: "knowledge-platform-certification-report",
    contractVersion: KNOWLEDGE_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
    valid: passed,
    passed,
    passedGates,
    totalGates: gates.length,
    passedPhases,
    totalPhases: KNL_PHASE_CERTIFICATION_TARGETS.length,
    profiles: Object.freeze(profiles),
    gates: Object.freeze(gates),
    checks: Object.freeze(checks),
    results: Object.freeze(results),
    evidence: Object.freeze(evidence),
    issues: Object.freeze(issues),
    generatedAt: timestamp,
    readOnly: true as const,
  });

  lastReport = report;

  return Object.freeze({
    success: passed,
    reason: passed ? "Knowledge platform certification passed." : "Knowledge platform certification failed.",
    passedGates,
    totalGates: gates.length,
    passedPhases,
    totalPhases: KNL_PHASE_CERTIFICATION_TARGETS.length,
    readOnly: true as const,
  });
}

export const KnowledgePlatformCertificationRunner = Object.freeze({
  runKnowledgePlatformCertification,
  getKnowledgePlatformCertificationReport,
  resetKnowledgePlatformCertificationForTests,
  version: KNOWLEDGE_PLATFORM_CERTIFICATION_RUNNER_VERSION,
});
