/**
 * DKL-8:4 — Knowledge Governance Policy Validation.
 *
 * Access, usage, retention, disposition, audit, compliance, and policy
 * applicability structural validation rules. Metadata only.
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

/** Policy and intent validation rules. */
export const KnowledgeGovernancePolicyValidationRules: readonly KnowledgeGovernanceValidationRule[] =
  Object.freeze([
    rule(
      "KG-V-ACC-001",
      "Access Intent Non-Authorization",
      "Access intent assignments must not emit Allowed/Denied or authorization outcomes.",
      "Access",
      "Critical",
      Object.freeze(["AccessIntentAssignment"]),
      "Registered access intents without authorization outcomes.",
      "returnsAuthorizationOutcomes=false; producesAllowedDenied=false; intents registered",
      `authOut=${model.access.returnsAuthorizationOutcomes}; allowedDenied=${model.access.producesAllowedDenied}; count=${model.access.accessIntentIds.length}`,
      "Allowed/Denied outcomes; RBAC/ABAC engines; authentication/authorization logic",
      pass(
        model.access.returnsAuthorizationOutcomes === false &&
          model.access.producesAllowedDenied === false &&
          model.access.accessIntentIds.length > 0 &&
          unique(model.access.accessIntentIds),
      ),
      "Blocking",
      21,
    ),
    rule(
      "KG-V-USG-001",
      "Usage Policy Non-Executing",
      "Usage policy assignments must not execute policy rules or resolve conflicts.",
      "Usage",
      "Error",
      Object.freeze(["UsagePolicyAssignment"]),
      "Registered usage policies without execution or conflict resolution.",
      "executesPolicyRules=false; evaluatesConflicts=false",
      `exec=${model.usage.executesPolicyRules}; conflicts=${model.usage.evaluatesConflicts}; count=${model.usage.usagePolicyIds.length}`,
      "Policy language runtime; policy execution; precedence resolution; conflict resolution",
      pass(
        model.usage.executesPolicyRules === false &&
          model.usage.evaluatesConflicts === false &&
          model.usage.usagePolicyIds.length > 0 &&
          unique(model.usage.usagePolicyIds),
      ),
      "Blocking",
      22,
    ),
    rule(
      "KG-V-RET-001",
      "Retention Intent Non-Scheduling",
      "Retention assignments must be declarative without timers, cron, or deletion.",
      "Retention",
      "Critical",
      Object.freeze(["RetentionIntentAssignment"]),
      "Registered retention intents without scheduling or mutation.",
      "schedulesRetention=false; usesCron=false; deletesRecords=false",
      `sched=${model.retention.schedulesRetention}; cron=${model.retention.usesCron}; delete=${model.retention.deletesRecords}; count=${model.retention.retentionIntentIds.length}`,
      "Timers; schedulers; cron expressions; deletion deadlines; repository mutation",
      pass(
        model.retention.schedulesRetention === false &&
          model.retention.usesCron === false &&
          model.retention.deletesRecords === false &&
          model.retention.retentionIntentIds.length > 0 &&
          unique(model.retention.retentionIntentIds),
      ),
      "Blocking",
      23,
    ),
    rule(
      "KG-V-DIS-001",
      "Disposition Intent Non-Executing",
      "Disposition assignments must not archive, delete, anonymize, transfer, or mutate repositories.",
      "Disposition",
      "Critical",
      Object.freeze(["DispositionIntentAssignment"]),
      "Registered disposition intents without execution.",
      "executesDisposition=false; intents registered",
      `exec=${model.disposition.executesDisposition}; count=${model.disposition.dispositionIntentIds.length}`,
      "Archive/delete/anonymize/transfer operations; repository mutation",
      pass(
        model.disposition.executesDisposition === false &&
          model.disposition.dispositionIntentIds.length > 0 &&
          unique(model.disposition.dispositionIntentIds),
      ),
      "Blocking",
      24,
    ),
    rule(
      "KG-V-AUD-001",
      "Audit Intent Non-Logging",
      "Audit assignments must not implement logging, event storage, or review schedulers.",
      "Audit",
      "Error",
      Object.freeze(["AuditIntentAssignment"]),
      "Registered audit intents without logging or storage.",
      "implementsAuditLogging=false; storesEvents=false",
      `log=${model.audit.implementsAuditLogging}; store=${model.audit.storesEvents}; count=${model.audit.auditIntentIds.length}`,
      "Loggers; event listeners; event storage; review schedulers; auditor notifications",
      pass(
        model.audit.implementsAuditLogging === false &&
          model.audit.storesEvents === false &&
          model.audit.auditIntentIds.length > 0 &&
          unique(model.audit.auditIntentIds),
      ),
      "Blocking",
      25,
    ),
    rule(
      "KG-V-CMP-001",
      "Compliance Intent Non-Legal",
      "Compliance assignments must not produce legal conclusions, scores, or control execution.",
      "Compliance",
      "Error",
      Object.freeze(["ComplianceIntentAssignment"]),
      "Registered compliance intents without legal evaluation.",
      "evaluatesCompliance=false; legalInterpretation=false",
      `eval=${model.compliance.evaluatesCompliance}; legal=${model.compliance.legalInterpretation}; count=${model.compliance.complianceIntentIds.length}`,
      "Legal conclusions; compliance scores; control execution; monitoring agents",
      pass(
        model.compliance.evaluatesCompliance === false &&
          model.compliance.legalInterpretation === false &&
          model.compliance.complianceIntentIds.length > 0 &&
          unique(model.compliance.complianceIntentIds),
      ),
      "Blocking",
      26,
    ),
    rule(
      "KG-V-PAP-001",
      "Policy Applicability Non-Precedence",
      "Policy applicability must remain declarative without precedence or inheritance evaluation.",
      "PolicyApplicability",
      "Error",
      Object.freeze(["PolicyApplicability"]),
      "Canonical policy references without precedence resolution.",
      "resolvesPrecedence=false; calculatesInheritedSets=false; executesOverrides=false",
      `prec=${model.policyApplicability.resolvesPrecedence}; inherit=${model.policyApplicability.calculatesInheritedSets}; override=${model.policyApplicability.executesOverrides}; kinds=${model.policyApplicability.policyReferenceKindIds.length}`,
      "Precedence resolvers; inheritance evaluators; policy execution",
      pass(
        model.policyApplicability.resolvesPrecedence === false &&
          model.policyApplicability.calculatesInheritedSets === false &&
          model.policyApplicability.executesOverrides === false &&
          model.policyApplicability.policyReferenceKindIds.length > 0 &&
          unique(model.policyApplicability.policyReferenceKindIds),
      ),
      "Blocking",
      27,
    ),
  ]);

export const KnowledgeGovernancePolicyValidationAnchors = Object.freeze({
  ruleCount: KnowledgeGovernancePolicyValidationRules.length,
  allPass: KnowledgeGovernancePolicyValidationRules.every(
    (item) => item.outcome === "Pass",
  ),
  executesPolicies: false as const,
  authorizesAccess: false as const,
  metadataOnly: true as const,
});
