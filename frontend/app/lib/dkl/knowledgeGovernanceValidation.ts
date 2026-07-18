/**
 * DKL-8:4 — Knowledge Governance Validation.
 *
 * Canonical immutable deterministic validation architecture for Knowledge
 * Governance models. Consumes only the DKL-8:3 Model public surface.
 * May judge structure; must not enforce, execute, persist, or operationalize.
 *
 * Ownership: owned exclusively by DKL-8:4.
 *
 * Public exports (exactly 8):
 *   KnowledgeGovernanceValidationId
 *   KnowledgeGovernanceValidationVersion
 *   KnowledgeGovernanceValidationName
 *   KnowledgeGovernanceValidationNamespace
 *   KnowledgeGovernanceValidationStatus
 *   KnowledgeGovernanceValidationReadiness
 *   KnowledgeGovernanceValidationPlatform
 *   getKnowledgeGovernanceValidationSummary()
 */

import {
  KnowledgeGovernanceModelId,
  KnowledgeGovernanceModelPlatform,
  KnowledgeGovernanceModelVersion,
} from "./knowledgeGovernanceModel.ts";
import {
  KNOWLEDGE_GOVERNANCE_VALIDATION_RULE_COUNT,
  KnowledgeGovernanceValidationCategories,
  KnowledgeGovernanceValidationOutcomes,
  KnowledgeGovernanceValidationRules,
  KnowledgeGovernanceValidationSeverities,
} from "./knowledgeGovernanceValidationRules.ts";
import type {
  KnowledgeGovernanceModelDescriptorInput,
  KnowledgeGovernanceValidationFinding,
  KnowledgeGovernanceValidationGate,
  KnowledgeGovernanceValidationGateName,
  KnowledgeGovernanceValidationOutcome,
  KnowledgeGovernanceValidationReport,
  KnowledgeGovernanceValidationRule,
  KnowledgeGovernanceValidationSummary,
} from "./knowledgeGovernanceValidationTypes.ts";

export const KnowledgeGovernanceValidationId =
  "DKL-8:4/KnowledgeGovernanceValidation" as const;

export const KnowledgeGovernanceValidationName =
  "Knowledge Governance Validation" as const;

export const KnowledgeGovernanceValidationVersion = "1.0.0" as const;

export const KnowledgeGovernanceValidationNamespace =
  "nexora.dkl.knowledge-governance.validation" as const;

export const KnowledgeGovernanceValidationStatus =
  "ValidationDefined" as const;

export const KnowledgeGovernanceValidationReadiness =
  "ReadyForManifest" as const;

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "categories",
  "severities",
  "outcomes",
  "rules",
  "rulesByCategory",
  "findings",
  "reports",
  "gates",
  "validationResult",
  "boundaries",
  "readiness",
] as const);

const identity = Object.freeze({
  validationId: KnowledgeGovernanceValidationId,
  validationName: KnowledgeGovernanceValidationName,
  validationVersion: KnowledgeGovernanceValidationVersion,
  validationNamespace: KnowledgeGovernanceValidationNamespace,
  layer: "Data Knowledge Layer" as const,
  phase: "DKL-8" as const,
  stage: "Validation" as const,
  sourcePhase: "DKL-8:4" as const,
  owner: "DKL-8 Knowledge Governance",
  status: KnowledgeGovernanceValidationStatus,
  validationOutcome: "Pass" as const,
  readiness: KnowledgeGovernanceValidationReadiness,
  modelId: KnowledgeGovernanceModelId,
  modelVersion: KnowledgeGovernanceModelVersion,
  metadataOnly: true as const,
  immutable: true as const,
  generatesTimestamps: false as const,
  generatesRandomIds: false as const,
});

const dependency = Object.freeze({
  dependencyId: "DKL-8:4/Dependency/DKL83Model",
  directPreviousPhaseModule: "knowledgeGovernanceModel.ts" as const,
  modelOnly: true as const,
  modelId: KnowledgeGovernanceModelId,
  modelVersion: KnowledgeGovernanceModelVersion,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  dkl7DirectImport: false as const,
  dkl6DirectImport: false as const,
  dkl5DirectImport: false as const,
  dkl4DirectImport: false as const,
  dkl3DirectImport: false as const,
  dkl2DirectImport: false as const,
  dkl1DirectImport: false as const,
  dkl9DirectImport: false as const,
  futurePhaseDependency: false as const,
  circularDependency: false as const,
  reconstructsModel: false as const,
  reconstructsRegistry: false as const,
  reconstructsFoundation: false as const,
  canonicalPath:
    "DKL-8:4 → DKL-8:3 Model → DKL-8:2 Registry → DKL-8:1 Foundation → DKL-7 Public Index",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const rulesByCategory = Object.freeze(
  Object.fromEntries(
    KnowledgeGovernanceValidationCategories.map((category) => [
      category.category,
      Object.freeze(
        KnowledgeGovernanceValidationRules.filter(
          (rule) => rule.category === category.category,
        ),
      ),
    ]),
  ) as Readonly<
    Record<string, readonly KnowledgeGovernanceValidationRule[]>
  >,
);

const findingFromRule = (
  rule: KnowledgeGovernanceValidationRule,
): KnowledgeGovernanceValidationFinding =>
  Object.freeze({
    findingId: `DKL-8:4/Finding/${rule.id}`,
    ruleId: rule.id,
    category: rule.category,
    severity: rule.severity,
    outcome: rule.outcome,
    targetKind: rule.targetModelKinds[0] ?? "GovernanceIdentity",
    targetReference: KnowledgeGovernanceModelId,
    message: rule.description,
    expected: rule.expected,
    actual: rule.actual,
    evidenceReferences: Object.freeze([rule.id]),
    readinessImpact: rule.readinessImpact,
    remediationCallback: false as const,
    notificationBehavior: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

const findings: readonly KnowledgeGovernanceValidationFinding[] = Object.freeze(
  KnowledgeGovernanceValidationRules.map(findingFromRule),
);

const passedRuleCount = KnowledgeGovernanceValidationRules.filter(
  (rule) => rule.outcome === "Pass",
).length;
const failedRuleCount = KnowledgeGovernanceValidationRules.filter(
  (rule) => rule.outcome === "Fail",
).length;
const notApplicableRuleCount = KnowledgeGovernanceValidationRules.filter(
  (rule) => rule.outcome === "NotApplicable",
).length;
const notEvaluatedRuleCount = KnowledgeGovernanceValidationRules.filter(
  (rule) => rule.outcome === "NotEvaluated",
).length;

const canonicalOutcome: KnowledgeGovernanceValidationOutcome =
  failedRuleCount === 0 &&
  passedRuleCount === KNOWLEDGE_GOVERNANCE_VALIDATION_RULE_COUNT
    ? "Pass"
    : "Fail";

const canonicalReport: KnowledgeGovernanceValidationReport = Object.freeze({
  reportId: "DKL-8:4/Report/CanonicalModelArchitecture",
  validationId: KnowledgeGovernanceValidationId,
  targetReference: KnowledgeGovernanceModelId,
  ruleCount: KNOWLEDGE_GOVERNANCE_VALIDATION_RULE_COUNT,
  evaluatedRuleCount: KNOWLEDGE_GOVERNANCE_VALIDATION_RULE_COUNT,
  passedRuleCount,
  failedRuleCount,
  notApplicableRuleCount,
  notEvaluatedRuleCount,
  findings,
  outcome: canonicalOutcome,
  readiness: KnowledgeGovernanceValidationReadiness,
  generatesTimestamps: false as const,
  persists: false as const,
  sendsExternally: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

const gate = (
  name: KnowledgeGovernanceValidationGateName,
  requiredRuleIds: readonly string[],
  deterministicOrder: number,
  blocking = true,
): KnowledgeGovernanceValidationGate => {
  const required = Object.freeze([...requiredRuleIds]);
  const allPass = required.every((ruleId) => {
    const found = KnowledgeGovernanceValidationRules.find(
      (rule) => rule.id === ruleId,
    );
    return found?.outcome === "Pass";
  });
  return Object.freeze({
    id: `DKL-8:4/Gate/${name}`,
    name,
    requiredRuleIds: required,
    status: "Active" as const,
    outcome: (allPass ? "Pass" : "Fail") as KnowledgeGovernanceValidationOutcome,
    blocking,
    sourcePhase: "DKL-8:4" as const,
    executesExternalBehavior: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder,
  });
};

/** Exactly seventeen readiness gates. */
const gates: readonly KnowledgeGovernanceValidationGate[] = Object.freeze([
  gate("IdentityValid", Object.freeze(["KG-V-ID-001", "KG-V-ID-002", "KG-V-ID-003"]), 1),
  gate("DependencyValid", Object.freeze(["KG-V-DEP-001", "KG-V-DEP-002", "KG-V-DEP-003"]), 2),
  gate("RegistryReferencesValid", Object.freeze(["KG-V-REG-001", "KG-V-REG-002"]), 3),
  gate("SubjectsValid", Object.freeze(["KG-V-SUB-001", "KG-V-SUB-002", "KG-V-SCP-001"]), 4),
  gate(
    "AssignmentsValid",
    Object.freeze([
      "KG-V-ACT-001",
      "KG-V-OWN-001",
      "KG-V-OWN-002",
      "KG-V-STE-001",
      "KG-V-CLS-001",
      "KG-V-CLS-002",
      "KG-V-SEN-001",
      "KG-V-SEN-002",
    ]),
    5,
  ),
  gate(
    "PoliciesValid",
    Object.freeze([
      "KG-V-ACC-001",
      "KG-V-USG-001",
      "KG-V-RET-001",
      "KG-V-DIS-001",
      "KG-V-AUD-001",
      "KG-V-CMP-001",
      "KG-V-PAP-001",
    ]),
    6,
  ),
  gate("LifecycleValid", Object.freeze(["KG-V-LFC-001", "KG-V-LFC-002"]), 7),
  gate("EvidenceValid", Object.freeze(["KG-V-EVD-001", "KG-V-DEC-001"]), 8),
  gate("ExceptionsValid", Object.freeze(["KG-V-EXC-001"]), 9),
  gate("BoundariesValid", Object.freeze(["KG-V-BND-001", "KG-V-BND-002"]), 10),
  gate("ProfilesValid", Object.freeze(["KG-V-PRF-001"]), 11),
  gate(
    "CompositeModelsValid",
    Object.freeze([
      "KG-V-SNP-001",
      "KG-V-REC-001",
      "KG-V-FND-001",
      "KG-V-ISS-001",
      "KG-V-CNF-001",
      "KG-V-AMB-001",
      "KG-V-RES-001",
    ]),
    12,
  ),
  gate("RelationshipsValid", Object.freeze(["KG-V-REL-001", "KG-V-REL-002"]), 13),
  gate("ImmutabilityValid", Object.freeze(["KG-V-IMM-001"]), 14),
  gate("DeterminismValid", Object.freeze(["KG-V-DET-001"]), 15),
  gate("RuntimeProhibitionsValid", Object.freeze(["KG-V-RUN-001", "KG-V-RUN-002"]), 16),
  gate(
    "ReadyForManifest",
    Object.freeze([
      "KG-V-ID-001",
      "KG-V-DEP-001",
      "KG-V-REG-001",
      "KG-V-IMM-001",
      "KG-V-RUN-001",
      "KG-V-RDY-001",
    ]),
    17,
  ),
]);

const allGatesPass = gates.every((item) => item.outcome === "Pass");

const helpers = Object.freeze({
  getKnowledgeGovernanceValidationRuleCount: () =>
    KNOWLEDGE_GOVERNANCE_VALIDATION_RULE_COUNT,
  getKnowledgeGovernanceValidationRuleById: (ruleId: string) =>
    KnowledgeGovernanceValidationRules.find((rule) => rule.id === ruleId),
  getKnowledgeGovernanceValidationRulesByCategory: (category: string) =>
    Object.freeze([...(rulesByCategory[category] ?? [])]),
  getKnowledgeGovernanceValidationGateById: (gateId: string) =>
    gates.find((item) => item.id === gateId || item.name === gateId),
  validateKnowledgeGovernanceModelDescriptor: (
    input: KnowledgeGovernanceModelDescriptorInput,
  ): KnowledgeGovernanceValidationReport => {
    const findingsLocal: KnowledgeGovernanceValidationFinding[] = [];
    const check = (
      ruleId: string,
      condition: boolean,
      message: string,
      expected: string,
      actual: string,
    ): void => {
      const rule = KnowledgeGovernanceValidationRules.find(
        (item) => item.id === ruleId,
      );
      findingsLocal.push(
        Object.freeze({
          findingId: `DKL-8:4/Finding/Descriptor/${ruleId}`,
          ruleId,
          category: rule?.category ?? "Identity",
          severity: rule?.severity ?? "Error",
          outcome: condition ? "Pass" : "Fail",
          targetKind: "GovernanceIdentity",
          targetReference: input.modelId ?? "unknown",
          message,
          expected,
          actual,
          evidenceReferences: Object.freeze([ruleId]),
          readinessImpact: condition ? "None" : "Blocking",
          remediationCallback: false as const,
          notificationBehavior: false as const,
          metadataOnly: true as const,
          immutable: true as const,
        }),
      );
    };

    check(
      "KG-V-ID-001",
      input.modelId === KnowledgeGovernanceModelId,
      "Descriptor model ID must match canonical Model.",
      KnowledgeGovernanceModelId,
      input.modelId ?? "",
    );
    check(
      "KG-V-ID-002",
      input.modelVersion === KnowledgeGovernanceModelVersion &&
        input.modelNamespace ===
          "nexora.dkl.knowledge-governance.model",
      "Descriptor version and namespace must match canonical Model.",
      "1.0.0; nexora.dkl.knowledge-governance.model",
      `${input.modelVersion ?? ""}; ${input.modelNamespace ?? ""}`,
    );
    check(
      "KG-V-ID-003",
      input.status === "ModelDefined" &&
        input.readiness === "ReadyForValidation",
      "Descriptor status and readiness must match ModelDefined/ReadyForValidation.",
      "ModelDefined; ReadyForValidation",
      `${input.status ?? ""}; ${input.readiness ?? ""}`,
    );
    check(
      "KG-V-REG-002",
      input.modelKindCount === 31 && input.relationshipKindCount === 19,
      "Descriptor inventories must match Model counts.",
      "31; 19",
      `${input.modelKindCount ?? 0}; ${input.relationshipKindCount ?? 0}`,
    );
    check(
      "KG-V-RUN-001",
      input.metadataOnly === true &&
        input.runtimeEnforcement !== true &&
        input.enforcesGovernance !== true &&
        input.validatesGovernance !== true,
      "Descriptor must remain metadata-only without enforcement.",
      "metadataOnly=true; no enforcement",
      `metadataOnly=${String(input.metadataOnly)}; runtimeEnforcement=${String(input.runtimeEnforcement)}`,
    );

    const failed = findingsLocal.filter((item) => item.outcome === "Fail").length;
    const passed = findingsLocal.filter((item) => item.outcome === "Pass").length;
    return Object.freeze({
      reportId: "DKL-8:4/Report/ModelDescriptor",
      validationId: KnowledgeGovernanceValidationId,
      targetReference: input.modelId ?? "unknown",
      ruleCount: findingsLocal.length,
      evaluatedRuleCount: findingsLocal.length,
      passedRuleCount: passed,
      failedRuleCount: failed,
      notApplicableRuleCount: 0,
      notEvaluatedRuleCount: 0,
      findings: Object.freeze(findingsLocal),
      outcome: failed === 0 ? "Pass" : "Fail",
      readiness: KnowledgeGovernanceValidationReadiness,
      generatesTimestamps: false as const,
      persists: false as const,
      sendsExternally: false as const,
      metadataOnly: true as const,
      immutable: true as const,
    });
  },
});

const validationApi = (
  exportName: string,
  kind:
    | "Aggregate"
    | "IdentityConstant"
    | "MetadataConstant"
    | "Helper",
) =>
  Object.freeze({
    id: `DKL-8:4/PublicApi/${exportName}`,
    exportName,
    phase: "DKL-8:4" as const,
    section: "Validation" as const,
    kind,
    version: KnowledgeGovernanceValidationVersion,
    status: KnowledgeGovernanceValidationStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "knowledgeGovernanceValidation.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const KnowledgeGovernanceValidationApiRegistry = Object.freeze([
  validationApi("KnowledgeGovernanceValidationId", "IdentityConstant"),
  validationApi("KnowledgeGovernanceValidationVersion", "IdentityConstant"),
  validationApi("KnowledgeGovernanceValidationName", "IdentityConstant"),
  validationApi("KnowledgeGovernanceValidationNamespace", "IdentityConstant"),
  validationApi("KnowledgeGovernanceValidationStatus", "MetadataConstant"),
  validationApi("KnowledgeGovernanceValidationReadiness", "MetadataConstant"),
  validationApi("KnowledgeGovernanceValidationPlatform", "Aggregate"),
  validationApi("getKnowledgeGovernanceValidationSummary", "Helper"),
]);

/**
 * Canonical immutable Knowledge Governance Validation platform.
 */
export const KnowledgeGovernanceValidationPlatform = Object.freeze({
  identity,
  dependency,
  categories: KnowledgeGovernanceValidationCategories,
  severities: KnowledgeGovernanceValidationSeverities,
  outcomes: KnowledgeGovernanceValidationOutcomes,
  rules: KnowledgeGovernanceValidationRules,
  rulesByCategory,
  findings,
  reports: Object.freeze([canonicalReport]),
  gates,
  validationResult: Object.freeze({
    resultId: "DKL-8:4/Result/Canonical",
    outcome: canonicalOutcome,
    ruleCount: KNOWLEDGE_GOVERNANCE_VALIDATION_RULE_COUNT,
    passedRuleCount,
    failedRuleCount,
    gateCount: gates.length,
    gatesPassed: gates.filter((item) => item.outcome === "Pass").length,
    readyForManifest: allGatesPass && canonicalOutcome === "Pass",
    reportReference: canonicalReport.reportId,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  boundaries: Object.freeze({
    enforcesPolicies: false as const,
    authorizesAccess: false as const,
    executesLifecycle: false as const,
    modifiesRecords: false as const,
    resolvesConflicts: false as const,
    approvesExceptions: false as const,
    persistsResults: false as const,
    performsRuntimeGovernance: false as const,
    evaluatesLaws: false as const,
    writesAuditLogs: false as const,
  }),
  readiness: KnowledgeGovernanceValidationReadiness,
  apiRegistry: KnowledgeGovernanceValidationApiRegistry,
  model: KnowledgeGovernanceModelPlatform,
  helpers,
  categoryCount: KnowledgeGovernanceValidationCategories.length,
  severityCount: KnowledgeGovernanceValidationSeverities.length,
  outcomeCount: KnowledgeGovernanceValidationOutcomes.length,
  ruleCount: KNOWLEDGE_GOVERNANCE_VALIDATION_RULE_COUNT,
  gateCount: gates.length,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: KnowledgeGovernanceValidationStatus,
  validationOutcome: canonicalOutcome,
  nextPhase: "DKL-8:5 — Knowledge Governance Manifest",
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  policyExecution: false as const,
  authenticationBehavior: false as const,
  authorizationBehavior: false as const,
  repositoryAccess: false as const,
  searchExecution: false as const,
  graphTraversal: false as const,
  aiBehavior: false as const,
  transportBehavior: false as const,
  engineReasoning: false as const,
  advisorBehavior: false as const,
  directorBehavior: false as const,
  sceneBehavior: false as const,
  uiBehavior: false as const,
  lifecycleExecution: false as const,
  exceptionWorkflow: false as const,
  legalEvaluation: false as const,
  auditLogging: false as const,
  persistenceBehavior: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Deterministic frozen Knowledge Governance Validation summary. */
export function getKnowledgeGovernanceValidationSummary(): KnowledgeGovernanceValidationSummary {
  return Object.freeze({
    id: KnowledgeGovernanceValidationId,
    version: KnowledgeGovernanceValidationVersion,
    namespace: KnowledgeGovernanceValidationNamespace,
    status: KnowledgeGovernanceValidationStatus,
    validationOutcome: KnowledgeGovernanceValidationPlatform.validationOutcome,
    readiness: KnowledgeGovernanceValidationReadiness,
    ruleCount: KnowledgeGovernanceValidationPlatform.ruleCount,
    categoryCount: KnowledgeGovernanceValidationPlatform.categoryCount,
    gateCount: KnowledgeGovernanceValidationPlatform.gateCount,
    failedRuleCount:
      KnowledgeGovernanceValidationPlatform.validationResult.failedRuleCount,
    runtimeBehavior: "None",
    nextPhase: "DKL-8:5 — Knowledge Governance Manifest",
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  });
}
