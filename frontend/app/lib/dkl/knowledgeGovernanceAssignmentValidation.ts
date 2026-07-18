/**
 * DKL-8:4 — Knowledge Governance Assignment Validation.
 *
 * Subject, scope, actor-role, ownership, stewardship, classification, and
 * sensitivity structural validation rules. Pure metadata checks against Model.
 *
 * Ownership: owned exclusively by DKL-8:4.
 */

import {
  KnowledgeGovernanceModelId,
  KnowledgeGovernanceModelPlatform,
} from "./knowledgeGovernanceModel.ts";
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

/** Assignment-domain validation rules (subject through sensitivity). */
export const KnowledgeGovernanceAssignmentValidationRules: readonly KnowledgeGovernanceValidationRule[] =
  Object.freeze([
    rule(
      "KG-V-SUB-001",
      "Subject Reference Structural Safety",
      "Governance subject references must not embed upstream objects or reconstruct DKL-4/6/7.",
      "Subject",
      "Critical",
      Object.freeze(["GovernanceSubjectReference"]),
      "Subject references remain references only.",
      "embedsUpstreamObjects=false; reconstructsDkl4/6/7=false",
      `embeds=${model.subjects.embedsUpstreamObjects}; dkl4=${model.subjects.reconstructsDkl4}; dkl6=${model.subjects.reconstructsDkl6}; dkl7=${model.subjects.reconstructsDkl7}`,
      "Upstream object embedding; repository record embedding; retrieval behavior",
      pass(
        model.subjects.embedsUpstreamObjects === false &&
          model.subjects.reconstructsDkl4 === false &&
          model.subjects.reconstructsDkl6 === false &&
          model.subjects.reconstructsDkl7 === false,
      ),
      "Blocking",
      10,
    ),
    rule(
      "KG-V-SUB-002",
      "Subject Registry Identifiers Present",
      "Subject validation must use registered subject IDs exposed through the Model.",
      "Subject",
      "Error",
      Object.freeze(["GovernanceSubjectReference"]),
      "Registered subject ID collection is non-empty and unique.",
      "Non-empty unique registrySubjectIds",
      `count=${model.subjects.registrySubjectIds.length}; unique=${unique(model.subjects.registrySubjectIds)}`,
      "Unregistered subject types; mutable nested subject collections",
      pass(
        model.subjects.registrySubjectIds.length > 0 &&
          unique(model.subjects.registrySubjectIds),
      ),
      "Blocking",
      11,
    ),
    rule(
      "KG-V-SCP-001",
      "Scope Declarative Only",
      "Governance scope must remain declarative without inheritance resolution.",
      "Scope",
      "Critical",
      Object.freeze(["GovernanceScope"]),
      "Scope is declarative and does not resolve inheritance.",
      "declarativeOnly=true; resolvesInheritance=false; 15 scope types",
      `declarative=${model.scopes.declarativeOnly}; resolves=${model.scopes.resolvesInheritance}; types=${model.scopes.scopeTypes.length}`,
      "Scope-resolution callbacks; runtime resolvers; inherited-scope calculation",
      pass(
        model.scopes.declarativeOnly === true &&
          model.scopes.resolvesInheritance === false &&
          model.scopes.scopeTypes.length === 15,
      ),
      "Blocking",
      12,
    ),
    rule(
      "KG-V-ACT-001",
      "Actor-Role Reference Safety",
      "Actor-role references must use registered roles without authentication or identity resolution.",
      "ActorRole",
      "Error",
      Object.freeze(["GovernanceActorRoleReference"]),
      "Registered roles; no authentication; no identity resolution.",
      "resolvesIdentity=false; authenticates=false; roles present",
      `roles=${model.actors.registryRoleIds.length}; resolves=${model.actors.resolvesIdentity}; auth=${model.actors.authenticates}`,
      "Credentials; identity provider integration; authentication behavior",
      pass(
        model.actors.registryRoleIds.length > 0 &&
          unique(model.actors.registryRoleIds) &&
          model.actors.resolvesIdentity === false &&
          model.actors.authenticates === false,
      ),
      "Blocking",
      13,
    ),
    rule(
      "KG-V-OWN-001",
      "Ownership Assignment Non-Enforcing",
      "Ownership assignments must be descriptive without automatic assignment or enforcement.",
      "Ownership",
      "Critical",
      Object.freeze(["OwnershipAssignment"]),
      "Owner role registered; no auto-assignment; no enforcement.",
      "Owner role present; assignsUsersAutomatically=false; enforcesOwnership=false",
      `owner=${model.ownership.ownerRoleId}; auto=${model.ownership.assignsUsersAutomatically}; enforce=${model.ownership.enforcesOwnership}`,
      "Automatic user assignment; ownership workflows; notifications; enforcement",
      pass(
        model.ownership.ownerRoleId === "DKL-8:2/Role/Owner" &&
          model.ownership.assignsUsersAutomatically === false &&
          model.ownership.enforcesOwnership === false,
      ),
      "Blocking",
      14,
    ),
    rule(
      "KG-V-OWN-002",
      "Ownership Distinct From Stewardship",
      "Ownership and stewardship model kinds must remain distinct.",
      "Ownership",
      "Error",
      Object.freeze(["OwnershipAssignment", "StewardshipAssignment"]),
      "Ownership and stewardship are separate model kinds.",
      "Distinct modelKindId values",
      `own=${model.ownership.definition.modelKind}; stew=${model.stewardship.definition.modelKind}`,
      "Merged Owner/Steward model; ownership represented as stewardship",
      pass(
        model.ownership.definition.modelKind === "OwnershipAssignment" &&
          model.stewardship.definition.modelKind === "StewardshipAssignment" &&
          model.ownership.definition.modelKindId !==
            model.stewardship.definition.modelKindId,
      ),
      "Blocking",
      15,
    ),
    rule(
      "KG-V-STE-001",
      "Stewardship Independent And Non-Scheduling",
      "Stewardship must use Steward role, remain unmerged with ownership, and avoid review schedulers.",
      "Stewardship",
      "Error",
      Object.freeze(["StewardshipAssignment"]),
      "Steward role; not merged with ownership; declarative review only.",
      "Steward role; mergedWithOwnership=false",
      `steward=${model.stewardship.stewardRoleId}; merged=${model.stewardship.mergedWithOwnership}`,
      "Review scheduler; stewardship workflow; automatic assignment",
      pass(
        model.stewardship.stewardRoleId === "DKL-8:2/Role/Steward" &&
          model.stewardship.mergedWithOwnership === false,
      ),
      "Blocking",
      16,
    ),
    rule(
      "KG-V-CLS-001",
      "Classification Exactly One Registered",
      "Classification assignment must reference exactly one registered classification.",
      "Classification",
      "Critical",
      Object.freeze(["ClassificationAssignment"]),
      "Cardinality ExactlyOne with non-empty registered classification IDs.",
      "cardinality=ExactlyOne; classificationIds unique and non-empty",
      `cardinality=${model.classification.cardinality}; count=${model.classification.classificationIds.length}; unique=${unique(model.classification.classificationIds)}`,
      "Multiple classifications per assignment; unregistered classification IDs",
      pass(
        model.classification.cardinality === "ExactlyOne" &&
          model.classification.classificationIds.length > 0 &&
          unique(model.classification.classificationIds),
      ),
      "Blocking",
      17,
    ),
    rule(
      "KG-V-CLS-002",
      "Classification Separation Guarantees",
      "Classification must remain separate from sensitivity, authorization, trust, quality, and executive importance.",
      "Classification",
      "Error",
      Object.freeze(["ClassificationAssignment"]),
      "Classification is not authorization, sensitivity, trust, quality, or priority.",
      "All separation flags true; calculatesAutomatically=false",
      `sens=${model.classification.separateFromSensitivity}; auth=${model.classification.separateFromAuthorization}; trust=${model.classification.separateFromTrust}; auto=${model.classification.calculatesAutomatically}`,
      "Classification as authorization; classification inference",
      pass(
        model.classification.separateFromSensitivity === true &&
          model.classification.separateFromAuthorization === true &&
          model.classification.separateFromTrust === true &&
          model.classification.separateFromQuality === true &&
          model.classification.separateFromExecutiveImportance === true &&
          model.classification.calculatesAutomatically === false,
      ),
      "Blocking",
      18,
    ),
    rule(
      "KG-V-SEN-001",
      "Sensitivity Unique Multi-Dimension",
      "Sensitivity assignment must support multiple unique registered dimensions with stable ordering.",
      "Sensitivity",
      "Error",
      Object.freeze(["SensitivityAssignment"]),
      "ZeroOrMoreUnique; unique IDs; stable ordering; no duplicates allowed.",
      "cardinality=ZeroOrMoreUnique; unique IDs; stableOrdering=true",
      `cardinality=${model.sensitivity.cardinality}; count=${model.sensitivity.sensitivityIds.length}; unique=${unique(model.sensitivity.sensitivityIds)}; stable=${model.sensitivity.stableOrdering}`,
      "Duplicate sensitivity IDs; unstable ordering",
      pass(
        model.sensitivity.cardinality === "ZeroOrMoreUnique" &&
          model.sensitivity.sensitivityIds.length > 0 &&
          unique(model.sensitivity.sensitivityIds) &&
          model.sensitivity.duplicateSensitivityIdsAllowed === false &&
          model.sensitivity.stableOrdering === true,
      ),
      "Blocking",
      19,
    ),
    rule(
      "KG-V-SEN-002",
      "Sensitivity Separation And Non-Evaluation",
      "Sensitivity must remain separate from classification and must not calculate risk or enforce access.",
      "Sensitivity",
      "Error",
      Object.freeze(["SensitivityAssignment"]),
      "Separate from classification; no risk score; no access enforcement.",
      "separateFromClassification=true; calculatesRiskScore=false; enforcesAccess=false",
      `sep=${model.sensitivity.separateFromClassification}; risk=${model.sensitivity.calculatesRiskScore}; enforce=${model.sensitivity.enforcesAccess}`,
      "Legal conclusions; privacy-law outcomes; risk scores; access enforcement",
      pass(
        model.sensitivity.separateFromClassification === true &&
          model.sensitivity.calculatesRiskScore === false &&
          model.sensitivity.enforcesAccess === false,
      ),
      "Blocking",
      20,
    ),
  ]);

/** Assignment validation observations for platform helpers. */
export const KnowledgeGovernanceAssignmentValidationAnchors = Object.freeze({
  targetModelId: KnowledgeGovernanceModelId,
  ruleCount: KnowledgeGovernanceAssignmentValidationRules.length,
  allPass: KnowledgeGovernanceAssignmentValidationRules.every(
    (item) => item.outcome === "Pass",
  ),
  retrievesSubjectData: false as const,
  decidesOwnership: false as const,
  metadataOnly: true as const,
});
