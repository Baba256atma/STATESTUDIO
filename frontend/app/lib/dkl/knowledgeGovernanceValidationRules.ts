/**
 * DKL-8:4 — Knowledge Governance Validation Rules.
 *
 * Canonical 48-rule registry aggregating architecture and domain rules.
 * Outcomes are deterministic metadata checks against the Model platform.
 *
 * Ownership: owned exclusively by DKL-8:4.
 */

import {
  KnowledgeGovernanceModelId,
  KnowledgeGovernanceModelNamespace,
  KnowledgeGovernanceModelPlatform,
  KnowledgeGovernanceModelReadiness,
  KnowledgeGovernanceModelStatus,
  KnowledgeGovernanceModelVersion,
} from "./knowledgeGovernanceModel.ts";
import { KnowledgeGovernanceAssignmentValidationRules } from "./knowledgeGovernanceAssignmentValidation.ts";
import { KnowledgeGovernanceCompositeValidationRules } from "./knowledgeGovernanceCompositeValidation.ts";
import { KnowledgeGovernanceLifecycleValidationRules } from "./knowledgeGovernanceLifecycleValidation.ts";
import { KnowledgeGovernancePolicyValidationRules } from "./knowledgeGovernancePolicyValidation.ts";
import type {
  KnowledgeGovernanceValidationCategory,
  KnowledgeGovernanceValidationCategoryDescriptor,
  KnowledgeGovernanceValidationOutcomeDescriptor,
  KnowledgeGovernanceValidationRule,
  KnowledgeGovernanceValidationSeverityDescriptor,
} from "./knowledgeGovernanceValidationTypes.ts";

const model = KnowledgeGovernanceModelPlatform;

const pass = (
  condition: boolean,
): KnowledgeGovernanceValidationRule["outcome"] =>
  condition ? "Pass" : "Fail";

const rule = (
  id: string,
  name: string,
  description: string,
  category: KnowledgeGovernanceValidationRule["category"],
  severity: KnowledgeGovernanceValidationRule["severity"],
  targetModelKinds: readonly string[],
  requirement: string,
  expected: string,
  actual: string,
  prohibited: string,
  outcome: KnowledgeGovernanceValidationRule["outcome"],
  readinessImpact: KnowledgeGovernanceValidationRule["readinessImpact"],
  deterministicOrder: number,
): KnowledgeGovernanceValidationRule =>
  Object.freeze({
    id,
    name,
    description,
    category,
    severity,
    targetModelKinds: Object.freeze([...targetModelKinds]),
    sourcePhase: "DKL-8:4" as const,
    deterministic: true as const,
    runtimeBehavior: "None" as const,
    status: "Active" as const,
    outcome,
    requirement,
    expected,
    actual,
    prohibited,
    readinessImpact,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder,
  });

const unique = (values: readonly string[]): boolean =>
  new Set(values).size === values.length;

const CATEGORY_ORDER: readonly KnowledgeGovernanceValidationCategory[] =
  Object.freeze([
    "Identity",
    "Dependency",
    "RegistryReference",
    "Subject",
    "Scope",
    "ActorRole",
    "Ownership",
    "Stewardship",
    "Classification",
    "Sensitivity",
    "Access",
    "Usage",
    "Retention",
    "Disposition",
    "Audit",
    "Compliance",
    "PolicyApplicability",
    "Lifecycle",
    "Evidence",
    "DecisionReference",
    "Exception",
    "Boundary",
    "Profile",
    "Snapshot",
    "Record",
    "Relationship",
    "Finding",
    "Issue",
    "Conflict",
    "Ambiguity",
    "Result",
    "Immutability",
    "Determinism",
    "RuntimeProhibition",
    "Readiness",
  ]);

/** Exactly thirty-five closed validation categories. */
export const KnowledgeGovernanceValidationCategories: readonly KnowledgeGovernanceValidationCategoryDescriptor[] =
  Object.freeze(
    CATEGORY_ORDER.map((category, index) =>
      Object.freeze({
        categoryId: `DKL-8:4/Category/${category}`,
        category,
        description: `Validation category for ${category} guarantees.`,
        deterministicOrder: index + 1,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );

/** Exactly four validation severities. */
export const KnowledgeGovernanceValidationSeverities: readonly KnowledgeGovernanceValidationSeverityDescriptor[] =
  Object.freeze([
    Object.freeze({
      severityId: "DKL-8:4/Severity/Info",
      severity: "Info" as const,
      description: "Informational validation importance only.",
      triggersNotification: false as const,
      enforcesPermissions: false as const,
      startsWorkflows: false as const,
      deterministicOrder: 1,
    }),
    Object.freeze({
      severityId: "DKL-8:4/Severity/Warning",
      severity: "Warning" as const,
      description: "Warning-level structural concern.",
      triggersNotification: false as const,
      enforcesPermissions: false as const,
      startsWorkflows: false as const,
      deterministicOrder: 2,
    }),
    Object.freeze({
      severityId: "DKL-8:4/Severity/Error",
      severity: "Error" as const,
      description: "Error-level structural defect.",
      triggersNotification: false as const,
      enforcesPermissions: false as const,
      startsWorkflows: false as const,
      deterministicOrder: 3,
    }),
    Object.freeze({
      severityId: "DKL-8:4/Severity/Critical",
      severity: "Critical" as const,
      description: "Critical structural defect blocking readiness.",
      triggersNotification: false as const,
      enforcesPermissions: false as const,
      startsWorkflows: false as const,
      deterministicOrder: 4,
    }),
  ]);

/** Exactly four validation outcomes. */
export const KnowledgeGovernanceValidationOutcomes: readonly KnowledgeGovernanceValidationOutcomeDescriptor[] =
  Object.freeze([
    Object.freeze({
      outcomeId: "DKL-8:4/Outcome/Pass",
      outcome: "Pass" as const,
      description: "Rule satisfied.",
      isAuthorizationOutcome: false as const,
      deterministicOrder: 1,
    }),
    Object.freeze({
      outcomeId: "DKL-8:4/Outcome/Fail",
      outcome: "Fail" as const,
      description: "Rule not satisfied.",
      isAuthorizationOutcome: false as const,
      deterministicOrder: 2,
    }),
    Object.freeze({
      outcomeId: "DKL-8:4/Outcome/NotApplicable",
      outcome: "NotApplicable" as const,
      description: "Rule not applicable to target.",
      isAuthorizationOutcome: false as const,
      deterministicOrder: 3,
    }),
    Object.freeze({
      outcomeId: "DKL-8:4/Outcome/NotEvaluated",
      outcome: "NotEvaluated" as const,
      description: "Rule not evaluated.",
      isAuthorizationOutcome: false as const,
      deterministicOrder: 4,
    }),
  ]);

const architectureRules: readonly KnowledgeGovernanceValidationRule[] =
  Object.freeze([
    rule(
      "KG-V-ID-001",
      "Canonical Model Phase Identity",
      "Validated model must use the canonical DKL-8:3 identity.",
      "Identity",
      "Critical",
      Object.freeze(["GovernanceIdentity"]),
      "Canonical model ID and source phase.",
      "DKL-8:3/KnowledgeGovernanceModel",
      model.identity.modelId,
      "Empty IDs; runtime-generated IDs; arbitrary identities",
      pass(model.identity.modelId === KnowledgeGovernanceModelId),
      "Blocking",
      1,
    ),
    rule(
      "KG-V-ID-002",
      "Model Version And Namespace",
      "Model version and namespace must match canonical values.",
      "Identity",
      "Critical",
      Object.freeze(["GovernanceIdentity"]),
      "Version 1.0.0 and governance model namespace.",
      "1.0.0; nexora.dkl.knowledge-governance.model",
      `${model.identity.modelVersion}; ${model.identity.modelNamespace}`,
      "Arbitrary namespaces; unsupported version formats",
      pass(
        model.identity.modelVersion === KnowledgeGovernanceModelVersion &&
          model.identity.modelNamespace === KnowledgeGovernanceModelNamespace,
      ),
      "Blocking",
      2,
    ),
    rule(
      "KG-V-ID-003",
      "Model Status And Readiness",
      "Model status and readiness must be ModelDefined and ReadyForValidation.",
      "Identity",
      "Critical",
      Object.freeze(["GovernanceIdentity"]),
      "Status ModelDefined; readiness ReadyForValidation.",
      "ModelDefined; ReadyForValidation",
      `${model.identity.status}; ${model.identity.readiness}`,
      "Unsupported statuses; runtime-generated timestamps",
      pass(
        model.identity.status === KnowledgeGovernanceModelStatus &&
          model.identity.readiness === KnowledgeGovernanceModelReadiness &&
          model.identity.generatesTimestamps === false &&
          model.identity.generatesRandomIds === false,
      ),
      "Blocking",
      3,
    ),
    rule(
      "KG-V-DEP-001",
      "Validation Depends Only On Model",
      "DKL-8:4 consumes only the canonical DKL-8:3 Model identity as upstream.",
      "Dependency",
      "Critical",
      Object.freeze(["GovernanceIdentity"]),
      "Upstream model identity is DKL-8:3/KnowledgeGovernanceModel.",
      "DKL-8:3/KnowledgeGovernanceModel; sourcePhase=DKL-8:3",
      `${model.identity.modelId}; ${model.identity.sourcePhase}`,
      "Direct Registry/Foundation/DKL-7 imports; circular dependencies",
      pass(
        model.identity.modelId === "DKL-8:3/KnowledgeGovernanceModel" &&
          model.identity.sourcePhase === "DKL-8:3",
      ),
      "Blocking",
      4,
    ),
    rule(
      "KG-V-DEP-002",
      "Model Preserved By Canonical Reference",
      "Model platform must be preserved by reference without reconstruction.",
      "Dependency",
      "Critical",
      Object.freeze(["GovernanceIdentity"]),
      "Model platform reference identity preserved.",
      "Same KnowledgeGovernanceModelPlatform reference",
      `modelId=${model.identity.modelId}; immutable=${model.immutable}`,
      "Reconstructed model descriptors; future-phase dependency",
      pass(
        model === KnowledgeGovernanceModelPlatform &&
          model.immutable === true &&
          model.dependency.reconstructsRegistry === false &&
          model.dependency.reconstructsFoundation === false,
      ),
      "Blocking",
      5,
    ),
    rule(
      "KG-V-DEP-003",
      "No Upstream Direct Imports In Model Chain",
      "Model dependency metadata must deny Foundation and DKL-7 direct imports.",
      "Dependency",
      "Critical",
      Object.freeze(["GovernanceIdentity"]),
      "No Foundation or DKL-7 direct import through Model dependency.",
      "foundationDirectImport=false; dkl7DirectImport=false",
      `foundation=${model.dependency.foundationDirectImport}; dkl7=${model.dependency.dkl7DirectImport}`,
      "Direct DKL-8:2/8:1/DKL-7 imports from Validation",
      pass(
        model.dependency.foundationDirectImport === false &&
          model.dependency.dkl7DirectImport === false &&
          model.dependency.dkl6DirectImport === false,
      ),
      "Blocking",
      6,
    ),
    rule(
      "KG-V-REG-001",
      "Registry Identifiers Via Model Surface",
      "Registered concept IDs must be reachable only through Model platform sections.",
      "RegistryReference",
      "Critical",
      Object.freeze(["GovernanceIdentity", "GovernanceSubjectReference"]),
      "Subject/role/classification/sensitivity/lifecycle IDs exposed by Model.",
      "Non-empty unique ID collections on Model sections",
      `subjects=${model.subjects.registrySubjectIds.length}; roles=${model.actors.registryRoleIds.length}; classifications=${model.classification.classificationIds.length}; sensitivities=${model.sensitivity.sensitivityIds.length}; states=${model.lifecycle.lifecycleStateIds.length}`,
      "Direct Registry access; incompatible duplicate vocabularies",
      pass(
        model.subjects.registrySubjectIds.length > 0 &&
          model.actors.registryRoleIds.length > 0 &&
          model.classification.classificationIds.length > 0 &&
          model.sensitivity.sensitivityIds.length > 0 &&
          model.lifecycle.lifecycleStateIds.length === 11 &&
          model.lifecycle.lifecycleTransitionIds.length === 31 &&
          model.evidence.evidenceKindIds.length > 0 &&
          model.exceptions.exceptionCategoryIds.length > 0 &&
          model.boundaries.boundaryIds.length > 0,
      ),
      "Blocking",
      7,
    ),
    rule(
      "KG-V-REG-002",
      "Model Kind Inventory Stable",
      "Model must expose exactly thirty-one unique model kinds and nineteen relationship kinds.",
      "RegistryReference",
      "Critical",
      Object.freeze(["GovernanceIdentity"]),
      "31 model kinds; 19 relationship kinds; unique IDs.",
      "modelKindCount=31; relationshipKindCount=19",
      `kinds=${model.modelKindCount}; relationships=${model.relationshipKindCount}; uniqueKinds=${unique(model.modelKinds.map((item) => item.modelKindId))}`,
      "Reconstructed registries; duplicate model-kind IDs",
      pass(
        model.modelKindCount === 31 &&
          model.modelKinds.length === 31 &&
          unique(model.modelKinds.map((item) => item.modelKindId)) &&
          model.relationshipKindCount === 19,
      ),
      "Blocking",
      8,
    ),
    rule(
      "KG-V-IMM-001",
      "Model Immutability Guarantees",
      "Model platform and model-kind descriptors must be immutable.",
      "Immutability",
      "Critical",
      Object.freeze(["GovernanceIdentity"]),
      "Frozen platform and frozen model-kind field collections.",
      "immutable=true; Object.isFrozen(platform/modelKinds)",
      `immutable=${model.immutable}; platformFrozen=${Object.isFrozen(model)}; kindsFrozen=${Object.isFrozen(model.modelKinds)}`,
      "Mutable exported arrays; mutable nested descriptors",
      pass(
        model.immutable === true &&
          Object.isFrozen(model) &&
          Object.isFrozen(model.modelKinds) &&
          model.modelKinds.every(
            (item) => Object.isFrozen(item) && Object.isFrozen(item.fields),
          ),
      ),
      "Blocking",
      9,
    ),
    rule(
      "KG-V-DET-001",
      "Model Determinism Guarantees",
      "Model must be deterministic without environment-derived values.",
      "Determinism",
      "Error",
      Object.freeze(["GovernanceIdentity"]),
      "deterministic=true; no environment-derived values.",
      "deterministic=true; environmentDerivedValues=false",
      `deterministic=${model.deterministic}; env=${model.identity.environmentDerivedValues}`,
      "Environment-derived values; non-deterministic ordering",
      pass(
        model.deterministic === true &&
          model.identity.environmentDerivedValues === false,
      ),
      "Blocking",
      45,
    ),
    rule(
      "KG-V-RUN-001",
      "Runtime Enforcement Absent",
      "Model must not validate, enforce, execute policy, or authorize.",
      "RuntimeProhibition",
      "Critical",
      Object.freeze(["GovernanceIdentity"]),
      "No runtime enforcement or policy execution surfaces.",
      "All runtime/enforcement flags false",
      `runtime=${model.runtimeBehavior}; enforce=${model.runtimeEnforcement}; policy=${model.policyExecution}; validate=${model.validatesGovernance}; authz=${model.authorizationBehavior}`,
      "authorize(); enforce(); executePolicy(); transitionLifecycle()",
      pass(
        model.runtimeBehavior === false &&
          model.runtimeEnforcement === false &&
          model.policyExecution === false &&
          model.validatesGovernance === false &&
          model.enforcesGovernance === false &&
          model.authorizationBehavior === false &&
          model.authenticationBehavior === false,
      ),
      "Blocking",
      46,
    ),
    rule(
      "KG-V-RUN-002",
      "Cross-Layer Runtime Surfaces Absent",
      "Model must not expose repository, search, graph, AI, UI, Engine, Advisor, Director, or Scene behavior.",
      "RuntimeProhibition",
      "Critical",
      Object.freeze(["GovernanceIdentity"]),
      "All prohibited cross-layer runtime flags false.",
      "repository/search/graph/ai/ui/engine/advisor/director/scene=false",
      `repo=${model.repositoryAccess}; search=${model.searchExecution}; graph=${model.graphTraversal}; ai=${model.aiBehavior}; ui=${model.uiBehavior}`,
      "Repository access; graph traversal; AI inference; UI/Scene behavior",
      pass(
        model.repositoryAccess === false &&
          model.searchExecution === false &&
          model.graphTraversal === false &&
          model.aiBehavior === false &&
          model.uiBehavior === false &&
          model.engineReasoning === false &&
          model.advisorBehavior === false &&
          model.directorBehavior === false &&
          model.sceneBehavior === false,
      ),
      "Blocking",
      47,
    ),
    rule(
      "KG-V-RDY-001",
      "Model Ready For Validation Phase",
      "Model readiness must be ReadyForValidation with ModelDefined status.",
      "Readiness",
      "Critical",
      Object.freeze(["GovernanceIdentity"]),
      "ModelDefined status and ReadyForValidation readiness.",
      "status=ModelDefined; readiness=ReadyForValidation",
      `${model.status}; ${model.readiness}`,
      "Premature Manifest readiness; failed structural readiness",
      pass(
        model.status === "ModelDefined" &&
          model.readiness === "ReadyForValidation" &&
          model.metadataOnly === true,
      ),
      "Blocking",
      48,
    ),
  ]);

/**
 * Exactly forty-eight canonical Knowledge Governance validation rules.
 * Ordered by deterministicOrder.
 */
export const KnowledgeGovernanceValidationRules: readonly KnowledgeGovernanceValidationRule[] =
  Object.freeze(
    [
      ...architectureRules,
      ...KnowledgeGovernanceAssignmentValidationRules,
      ...KnowledgeGovernancePolicyValidationRules,
      ...KnowledgeGovernanceLifecycleValidationRules,
      ...KnowledgeGovernanceCompositeValidationRules,
    ].sort((left, right) => left.deterministicOrder - right.deterministicOrder),
  );

export const KNOWLEDGE_GOVERNANCE_VALIDATION_RULE_COUNT =
  KnowledgeGovernanceValidationRules.length;

export const KnowledgeGovernanceValidationRuleIdSet = Object.freeze(
  KnowledgeGovernanceValidationRules.map((item) => item.id),
);
