/**
 * DKL-8:4 — Knowledge Governance Composite Validation.
 *
 * Profile, snapshot, record, relationship, finding, issue, conflict,
 * ambiguity, and result structural validation rules.
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

/** Composite model validation rules. */
export const KnowledgeGovernanceCompositeValidationRules: readonly KnowledgeGovernanceValidationRule[] =
  Object.freeze([
    rule(
      "KG-V-PRF-001",
      "Profile Composition By Reference",
      "Governance Profile must compose by reference without evaluating completeness or enforcing governance.",
      "Profile",
      "Critical",
      Object.freeze(["GovernanceProfile"]),
      "Compose by reference; no completeness calculation; no enforcement.",
      "composesByReference=true; evaluatesCompleteness=false",
      `compose=${model.profiles.composesByReference}; complete=${model.profiles.evaluatesCompleteness}; fields=${model.profiles.definition.fields.length}`,
      "Embedded registry entries; completeness calculation; governance enforcement",
      pass(
        model.profiles.composesByReference === true &&
          model.profiles.evaluatesCompleteness === false &&
          model.profiles.definition.fields.includes("ownership") &&
          model.profiles.definition.fields.includes("stewardship") &&
          model.profiles.definition.fields.includes("classification"),
      ),
      "Blocking",
      35,
    ),
    rule(
      "KG-V-SNP-001",
      "Snapshot Non-Temporal Non-Persistent",
      "Governance Snapshot must not use system time, persist, or duplicate DKL-6 snapshot behavior.",
      "Snapshot",
      "Error",
      Object.freeze(["GovernanceSnapshot"]),
      "No system time; no persistence.",
      "usesSystemTime=false; persists=false",
      `time=${model.snapshots.usesSystemTime}; persist=${model.snapshots.persists}`,
      "Current timestamps; persistence behavior; DKL-6 snapshot duplication",
      pass(
        model.snapshots.usesSystemTime === false &&
          model.snapshots.persists === false,
      ),
      "Blocking",
      36,
    ),
    rule(
      "KG-V-REC-001",
      "Record Non-Persistence Entity",
      "Governance Record must not be an ORM model or persistence entity.",
      "Record",
      "Error",
      Object.freeze(["GovernanceRecord"]),
      "Pure metadata structure; not ORM/database entity.",
      "isPersistenceEntity=false; isOrmModel=false",
      `persist=${model.records.isPersistenceEntity}; orm=${model.records.isOrmModel}`,
      "ORM annotations; database identity; persistence/repository methods",
      pass(
        model.records.isPersistenceEntity === false &&
          model.records.isOrmModel === false,
      ),
      "Blocking",
      37,
    ),
    rule(
      "KG-V-REL-001",
      "Relationship Kinds Closed And Unique",
      "Governance relationships must use exactly nineteen unique closed relationship kinds.",
      "Relationship",
      "Critical",
      Object.freeze(["GovernanceRelationship"]),
      "Nineteen unique relationship kinds; no traversal engine.",
      "relationshipKindCount=19; unique kinds; traversalEngine=false",
      `count=${model.relationships.relationshipKindCount}; kinds=${model.relationships.kinds.length}; unique=${unique(model.relationships.kinds.map((item) => item.relationshipKind))}; traverse=${model.relationships.traversalEngine}`,
      "Open relationship vocabulary; graph traversal; graph persistence",
      pass(
        model.relationships.relationshipKindCount === 19 &&
          model.relationships.kinds.length === 19 &&
          unique(
            model.relationships.kinds.map((item) => item.relationshipKind),
          ) &&
          unique(
            model.relationships.kinds.map((item) => item.relationshipKindId),
          ) &&
          model.relationships.traversalEngine === false,
      ),
      "Blocking",
      38,
    ),
    rule(
      "KG-V-REL-002",
      "Relationship Direction Metadata Only",
      "Relationship descriptors must declare direction without runtime traversal.",
      "Relationship",
      "Warning",
      Object.freeze(["GovernanceRelationship"]),
      "Every relationship kind has direction and traversableAtRuntime=false.",
      "All kinds Directed or Bidirectional; not traversable at runtime",
      `allNonTraversable=${model.relationships.kinds.every((item) => item.traversableAtRuntime === false)}; allHaveDirection=${model.relationships.kinds.every((item) => item.direction === "Directed" || item.direction === "Bidirectional")}`,
      "Invalid self-link engines; runtime graph walking",
      pass(
        model.relationships.kinds.every(
          (item) => item.traversableAtRuntime === false,
        ) &&
          model.relationships.kinds.every(
            (item) =>
              item.direction === "Directed" ||
              item.direction === "Bidirectional",
          ),
      ),
      "Blocking",
      39,
    ),
    rule(
      "KG-V-FND-001",
      "Finding Structural Only",
      "Governance Finding model must not generate findings or remediation actions.",
      "Finding",
      "Error",
      Object.freeze(["GovernanceFinding"]),
      "Finding structure only; no detection callbacks.",
      "generatesFindings=false",
      `generates=${model.findings.generatesFindings}`,
      "Detection callbacks; remediation actions",
      pass(model.findings.generatesFindings === false),
      "Blocking",
      40,
    ),
    rule(
      "KG-V-ISS-001",
      "Issue Structural Only",
      "Governance Issue model must not detect issues or trigger workflows.",
      "Issue",
      "Error",
      Object.freeze(["GovernanceIssue"]),
      "Issue structure only; no automatic remediation.",
      "detectsIssues=false",
      `detects=${model.issues.detectsIssues}`,
      "Automatic remediation; workflow triggers",
      pass(model.issues.detectsIssues === false),
      "Blocking",
      41,
    ),
    rule(
      "KG-V-CNF-001",
      "Conflict Non-Resolving",
      "Governance Conflict model must declare ten conflict types without resolution or precedence.",
      "Conflict",
      "Error",
      Object.freeze(["GovernanceConflict"]),
      "Ten conflict types; no resolver; no winner selection.",
      "conflictTypes=10; resolvesConflicts=false",
      `types=${model.conflicts.conflictTypes.length}; resolve=${model.conflicts.resolvesConflicts}`,
      "Conflict resolvers; precedence decisions; winning-side selection; model mutation",
      pass(
        model.conflicts.conflictTypes.length === 10 &&
          unique([...model.conflicts.conflictTypes]) &&
          model.conflicts.resolvesConflicts === false,
      ),
      "Blocking",
      42,
    ),
    rule(
      "KG-V-AMB-001",
      "Ambiguity Non-Interactive",
      "Governance Ambiguity model must declare twelve types without user questions or NEA/Advisor messages.",
      "Ambiguity",
      "Error",
      Object.freeze(["GovernanceAmbiguity"]),
      "Twelve ambiguity types; no user questioning; no NEA/Advisor generation.",
      "ambiguityTypes=12; asksUserQuestions=false",
      `types=${model.ambiguities.ambiguityTypes.length}; asks=${model.ambiguities.asksUserQuestions}`,
      "User questions; NEA messages; Advisor responses; automatic inference",
      pass(
        model.ambiguities.ambiguityTypes.length === 12 &&
          unique([...model.ambiguities.ambiguityTypes]) &&
          model.ambiguities.asksUserQuestions === false,
      ),
      "Blocking",
      43,
    ),
    rule(
      "KG-V-RES-001",
      "Result Envelope Non-Validating",
      "Governance Model Result must remain a structural envelope without running validation or dynamic readiness.",
      "Result",
      "Error",
      Object.freeze(["GovernanceModelResult"]),
      "Structural result only; no validation execution; no dynamic readiness.",
      "runsValidation=false; calculatesReadinessDynamically=false",
      `validate=${model.results.runsValidation}; readiness=${model.results.calculatesReadinessDynamically}`,
      "Dynamic readiness computation; enforcement outcomes",
      pass(
        model.results.runsValidation === false &&
          model.results.calculatesReadinessDynamically === false,
      ),
      "Blocking",
      44,
    ),
  ]);

export const KnowledgeGovernanceCompositeValidationAnchors = Object.freeze({
  ruleCount: KnowledgeGovernanceCompositeValidationRules.length,
  allPass: KnowledgeGovernanceCompositeValidationRules.every(
    (item) => item.outcome === "Pass",
  ),
  resolvesConflicts: false as const,
  asksUsers: false as const,
  metadataOnly: true as const,
});
