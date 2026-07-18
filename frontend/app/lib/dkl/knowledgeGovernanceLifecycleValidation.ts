/**
 * DKL-8:4 — Knowledge Governance Lifecycle Validation.
 *
 * Lifecycle, evidence, decision, exception, and boundary structural
 * validation rules. No transition execution or workflows.
 *
 * Ownership: owned exclusively by DKL-8:4.
 */

import { KnowledgeGovernanceModelPlatform } from "./knowledgeGovernanceModel.ts";
import type { KnowledgeGovernanceValidationRule } from "./knowledgeGovernanceValidationTypes.ts";

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

/** Lifecycle, evidence, decision, exception, and boundary rules. */
export const KnowledgeGovernanceLifecycleValidationRules: readonly KnowledgeGovernanceValidationRule[] =
  Object.freeze([
    rule(
      "KG-V-LFC-001",
      "Lifecycle States Registered",
      "Lifecycle state model must reference exactly eleven registered lifecycle states.",
      "Lifecycle",
      "Critical",
      Object.freeze(["GovernanceLifecycleState"]),
      "Eleven unique registered lifecycle state IDs.",
      "lifecycleStateCount=11; unique state IDs",
      `count=${model.lifecycle.lifecycleStateCount}; ids=${model.lifecycle.lifecycleStateIds.length}; unique=${unique(model.lifecycle.lifecycleStateIds)}`,
      "Unregistered states; runtime state mutation; current-time dependency",
      pass(
        model.lifecycle.lifecycleStateCount === 11 &&
          model.lifecycle.lifecycleStateIds.length === 11 &&
          unique(model.lifecycle.lifecycleStateIds),
      ),
      "Blocking",
      28,
    ),
    rule(
      "KG-V-LFC-002",
      "Lifecycle Transitions Non-Executing",
      "Lifecycle transitions must reference thirty-one registered transitions without execution.",
      "Lifecycle",
      "Critical",
      Object.freeze(["GovernanceLifecycleTransitionRecord"]),
      "Thirty-one unique transitions; no state machine; no execution.",
      "transitionCount=31; runtimeStateMachine=false; executesTransitions=false",
      `count=${model.lifecycle.lifecycleTransitionCount}; machine=${model.lifecycle.runtimeStateMachine}; exec=${model.lifecycle.executesTransitions}; unique=${unique(model.lifecycle.lifecycleTransitionIds)}`,
      "Transition execution; workflow events; system timestamps",
      pass(
        model.lifecycle.lifecycleTransitionCount === 31 &&
          model.lifecycle.lifecycleTransitionIds.length === 31 &&
          unique(model.lifecycle.lifecycleTransitionIds) &&
          model.lifecycle.runtimeStateMachine === false &&
          model.lifecycle.executesTransitions === false,
      ),
      "Blocking",
      29,
    ),
    rule(
      "KG-V-EVD-001",
      "Evidence Reference Only",
      "Evidence model must reference registered evidence kinds without embedding documents.",
      "Evidence",
      "Error",
      Object.freeze(["GovernanceEvidenceReference"]),
      "Registered evidence kinds; reference-only; no embedded documents.",
      "embedsDocuments=false; evidence kinds registered",
      `embed=${model.evidence.embedsDocuments}; count=${model.evidence.evidenceKindIds.length}; unique=${unique(model.evidence.evidenceKindIds)}`,
      "Embedded policy documents; audit reports; repository records; evidence persistence",
      pass(
        model.evidence.embedsDocuments === false &&
          model.evidence.evidenceKindIds.length > 0 &&
          unique(model.evidence.evidenceKindIds),
      ),
      "Blocking",
      30,
    ),
    rule(
      "KG-V-DEC-001",
      "Decision Reference Non-Executing",
      "Decision references must not reconstruct Executive Engine decisions or approve actions.",
      "DecisionReference",
      "Error",
      Object.freeze(["GovernanceDecisionReference"]),
      "Registered decision kinds; no Engine reconstruction; no decisions made.",
      "reconstructsEngineDecisions=false; makesDecisions=false",
      `engine=${model.decisions.reconstructsEngineDecisions}; makes=${model.decisions.makesDecisions}; count=${model.decisions.decisionReferenceKindIds.length}`,
      "Engine decision reconstruction; approvals; orchestration behavior",
      pass(
        model.decisions.reconstructsEngineDecisions === false &&
          model.decisions.makesDecisions === false &&
          model.decisions.decisionReferenceKindIds.length > 0 &&
          unique(model.decisions.decisionReferenceKindIds),
      ),
      "Blocking",
      31,
    ),
    rule(
      "KG-V-EXC-001",
      "Exception Non-Workflow",
      "Exception model must use registered categories without submission, approval, or expiration workflows.",
      "Exception",
      "Critical",
      Object.freeze(["GovernanceException"]),
      "Registered exception categories; no workflow methods.",
      "submits=false; approves=false; workflowMethods=false",
      `submit=${model.exceptions.submitsExceptions}; approve=${model.exceptions.approvesExceptions}; workflow=${model.exceptions.workflowMethods}; count=${model.exceptions.exceptionCategoryIds.length}`,
      "Submission; approval; rejection; expiration schedulers; notifications",
      pass(
        model.exceptions.submitsExceptions === false &&
          model.exceptions.approvesExceptions === false &&
          model.exceptions.workflowMethods === false &&
          model.exceptions.exceptionCategoryIds.length > 0 &&
          unique(model.exceptions.exceptionCategoryIds),
      ),
      "Blocking",
      32,
    ),
    rule(
      "KG-V-BND-001",
      "Boundary References Registered",
      "Boundary references must correspond to registered boundaries without creating external dependencies.",
      "Boundary",
      "Error",
      Object.freeze(["GovernanceBoundaryReference"]),
      "Registered boundary IDs; no external dependency creation.",
      "createsExternalDependencies=false; boundary IDs unique",
      `external=${model.boundaries.createsExternalDependencies}; count=${model.boundaries.boundaryIds.length}; unique=${unique(model.boundaries.boundaryIds)}`,
      "External dependency introduction solely for boundary metadata",
      pass(
        model.boundaries.createsExternalDependencies === false &&
          model.boundaries.boundaryIds.length > 0 &&
          unique(model.boundaries.boundaryIds),
      ),
      "Blocking",
      33,
    ),
    rule(
      "KG-V-BND-002",
      "Boundary Ownership Non-Claims",
      "DKL-8 must not claim runtime security, repository, Engine, NEA, UI, Advisor, Director, or Scene ownership.",
      "Boundary",
      "Critical",
      Object.freeze(["GovernanceBoundaryReference"]),
      "Model platform denies cross-layer ownership behaviors.",
      "All prohibited ownership behavior flags false",
      `auth=${model.authenticationBehavior}; repo=${model.repositoryAccess}; engine=${model.engineReasoning}; nea=${model.transportBehavior}; ui=${model.uiBehavior}; advisor=${model.advisorBehavior}; director=${model.directorBehavior}; scene=${model.sceneBehavior}`,
      "Security/runtime/repository/Engine/NEA/UI/Advisor/Director/Scene ownership claims",
      pass(
        model.authenticationBehavior === false &&
          model.authorizationBehavior === false &&
          model.repositoryAccess === false &&
          model.engineReasoning === false &&
          model.transportBehavior === false &&
          model.uiBehavior === false &&
          model.advisorBehavior === false &&
          model.directorBehavior === false &&
          model.sceneBehavior === false,
      ),
      "Blocking",
      34,
    ),
  ]);

export const KnowledgeGovernanceLifecycleValidationAnchors = Object.freeze({
  ruleCount: KnowledgeGovernanceLifecycleValidationRules.length,
  allPass: KnowledgeGovernanceLifecycleValidationRules.every(
    (item) => item.outcome === "Pass",
  ),
  executesTransitions: false as const,
  submitsExceptions: false as const,
  metadataOnly: true as const,
});
