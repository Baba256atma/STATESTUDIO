/**
 * NPA-T OVS-FORM-LANGUAGE:1 — semantic form grammar.
 *
 * Decides when two management objects should look physically different.
 * Consumes Manager Object / Stage kind tokens. Does not invent a business
 * ontology, assign shapes from names, or replace OVS:1 primitive mapping.
 */

import { MANAGER_OBJECT_KINDS } from "../manager-object/managerObjectInteractionFoundation.ts";
import { projectExecutiveOvsObjectKindHandoff } from "./projectExecutiveOvsObjectKindHandoff.ts";
import {
  EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE,
  EXECUTIVE_OVS_KIND_TOKEN_TO_FAMILY,
  resolveExecutiveOvsObjectFamily,
  resolveExecutiveOvsPrimitive,
  type ExecutiveOvsObjectFamily,
  type ExecutiveOvsPrimitive,
} from "./executiveOvsObjectVisualLanguage.ts";

export const executiveOvsSemanticFormGrammarIdentity =
  "NPA-T OVS-FORM-LANGUAGE:1/SemanticFormGrammar" as const;

export const EXECUTIVE_OVS_SEMANTIC_FORM_GRAMMAR_BOUNDARY = Object.freeze({
  inventsParallelOntology: false as const,
  infersFamilyFromDisplayName: false as const,
  infersFamilyFromCanonicalId: false as const,
  infersFamilyFromManagementState: false as const,
  infersFamilyFromTheme: false as const,
  infersFamilyFromManagementLevel: false as const,
  usesDthAsSemanticAuthority: false as const,
  oneShapePerObject: false as const,
  activatesOutcomeRingAsLivePrimary: false as const,
  certifiesProblemPrismAsDistinct: true as const,
  primitiveMapOwner: "EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE" as const,
});

export const EXECUTIVE_OVS_FORM_CHANNEL_RULE = Object.freeze({
  identityForm: "what the management object IS",
  stateMaterial: "what condition the object is IN",
  hierarchyPlacement: "where it belongs in the current management context",
  relationship: "how it relates to other objects",
  theme: "Day/Night presentation of the same identity",
});

export const EXECUTIVE_OVS_SEMANTIC_FORM_STATUS = Object.freeze({
  LIVE: "LIVE",
  APPROVED_GEOMETRY_DEFERRED: "APPROVED / GEOMETRY DEFERRED",
  GENERIC_OPERATIONAL: "GENERIC / OPERATIONAL",
  DEFERRED_SEMANTICS_MISSING: "DEFERRED — SEMANTICS MISSING",
  NOT_ADMITTED: "NOT ADMITTED",
  GEOMETRY_EXISTS_ACTIVATION_NOT_APPROVED:
    "GEOMETRY EXISTS — SEMANTIC ACTIVATION NOT APPROVED",
} as const);

export type ExecutiveOvsSemanticFormStatus =
  (typeof EXECUTIVE_OVS_SEMANTIC_FORM_STATUS)[keyof typeof EXECUTIVE_OVS_SEMANTIC_FORM_STATUS];

export type ExecutiveOvsSemanticFormMatrixRow = {
  readonly concept: string;
  readonly canonicalAuthority: string;
  readonly stableIdentity: boolean;
  readonly managementValue: string;
  readonly formFamily: ExecutiveOvsObjectFamily | "none";
  readonly primitive: ExecutiveOvsPrimitive | "none";
  readonly status: ExecutiveOvsSemanticFormStatus;
};

/**
 * Certified live primary Stage vocabulary. Other OVS families may still
 * resolve when their kind token is present; they are not used to split
 * generic business objects.
 */
export const EXECUTIVE_OVS_LIVE_PRIMARY_FORM_FAMILIES = Object.freeze([
  "operational",
  "risk",
  "problem",
] as const);

export const EXECUTIVE_OVS_SEMANTIC_FORM_MATRIX = Object.freeze([
  Object.freeze({
    concept: "generic business / project object",
    canonicalAuthority: "ManagerObjectKind object | Stage kind object",
    stableIdentity: true,
    managementValue: "contained manageable entity",
    formFamily: "operational",
    primitive: "rounded-block",
    status: EXECUTIVE_OVS_SEMANTIC_FORM_STATUS.LIVE,
  }),
  Object.freeze({
    concept: "risk",
    canonicalAuthority: "ManagerObjectKind risk",
    stableIdentity: true,
    managementValue: "uncertainty / exposure identity",
    formFamily: "risk",
    primitive: "diamond",
    status: EXECUTIVE_OVS_SEMANTIC_FORM_STATUS.LIVE,
  }),
  Object.freeze({
    concept: "goal",
    canonicalAuthority: "ManagerObjectKind goal",
    stableIdentity: true,
    managementValue: "target the manager is trying to achieve",
    formFamily: "goal",
    primitive: "orb",
    status: EXECUTIVE_OVS_SEMANTIC_FORM_STATUS.APPROVED_GEOMETRY_DEFERRED,
  }),
  Object.freeze({
    concept: "problem",
    canonicalAuthority: "ManagerObjectKind problem | Stage context kind problem",
    stableIdentity: true,
    managementValue: "constraint / issue identity, not severity",
    formFamily: "problem",
    primitive: "prism",
    status: EXECUTIVE_OVS_SEMANTIC_FORM_STATUS.LIVE,
  }),
  Object.freeze({
    concept: "scenario",
    canonicalAuthority: "ManagerObjectKind scenario | Stage kind scenario",
    stableIdentity: true,
    managementValue: "possible course, not a business resource",
    formFamily: "scenario",
    primitive: "rounded-block",
    status: EXECUTIVE_OVS_SEMANTIC_FORM_STATUS.APPROVED_GEOMETRY_DEFERRED,
  }),
  Object.freeze({
    concept: "decision",
    canonicalAuthority: "ManagerObjectKind decision | Stage kind decision",
    stableIdentity: true,
    managementValue: "committed choice identity",
    formFamily: "decision",
    primitive: "hex-prism",
    status: EXECUTIVE_OVS_SEMANTIC_FORM_STATUS.APPROVED_GEOMETRY_DEFERRED,
  }),
  Object.freeze({
    concept: "execution",
    canonicalAuthority: "ManagerObjectKind execution | Stage kind execution",
    stableIdentity: true,
    managementValue: "action-in-motion identity",
    formFamily: "execution",
    primitive: "rounded-block",
    status: EXECUTIVE_OVS_SEMANTIC_FORM_STATUS.APPROVED_GEOMETRY_DEFERRED,
  }),
  Object.freeze({
    concept: "opportunity",
    canonicalAuthority: "ManagerObjectKind opportunity",
    stableIdentity: true,
    managementValue: "upside identity distinct from risk and problem",
    formFamily: "operational",
    primitive: "rounded-block",
    status: EXECUTIVE_OVS_SEMANTIC_FORM_STATUS.APPROVED_GEOMETRY_DEFERRED,
  }),
  Object.freeze({
    concept: "outcome",
    canonicalAuthority: "ManagerObjectKind outcome",
    stableIdentity: true,
    managementValue: "observed result identity",
    formFamily: "outcome",
    primitive: "ring",
    status:
      EXECUTIVE_OVS_SEMANTIC_FORM_STATUS.GEOMETRY_EXISTS_ACTIVATION_NOT_APPROVED,
  }),
  Object.freeze({
    concept: "kpi",
    canonicalAuthority: "DTH resolveCanonicalExecutiveObjectType / NMI node KPI",
    stableIdentity: false,
    managementValue: "theatre/composition measure, not object identity",
    formFamily: "kpi",
    primitive: "cylinder",
    status:
      EXECUTIVE_OVS_SEMANTIC_FORM_STATUS.GEOMETRY_EXISTS_ACTIVATION_NOT_APPROVED,
  }),
  Object.freeze({
    concept: "context / insight / guidance",
    canonicalAuthority: "Stage presentation / DTH context cues",
    stableIdentity: false,
    managementValue: "supporting Stage context, not a management body",
    formFamily: "context",
    primitive: "orb",
    status: EXECUTIVE_OVS_SEMANTIC_FORM_STATUS.NOT_ADMITTED,
  }),
  Object.freeze({
    concept: "learning",
    canonicalAuthority: "NMI LEARNING node; catalog currently subjectKind object",
    stableIdentity: false,
    managementValue: "knowledge capture; not a distinct ManagerObjectKind",
    formFamily: "none",
    primitive: "none",
    status: EXECUTIVE_OVS_SEMANTIC_FORM_STATUS.DEFERRED_SEMANTICS_MISSING,
  }),
  Object.freeze({
    concept: "process / activity",
    canonicalAuthority: "NMI PROCESS node only; not ManagerObjectKind",
    stableIdentity: false,
    managementValue: "work process; no object identity on live bodies",
    formFamily: "none",
    primitive: "none",
    status: EXECUTIVE_OVS_SEMANTIC_FORM_STATUS.DEFERRED_SEMANTICS_MISSING,
  }),
  Object.freeze({
    concept: "resource / capacity",
    canonicalAuthority: "none on live bodies (labels only)",
    stableIdentity: false,
    managementValue: "would help recognition if canonically typed",
    formFamily: "operational",
    primitive: "rounded-block",
    status: EXECUTIVE_OVS_SEMANTIC_FORM_STATUS.DEFERRED_SEMANTICS_MISSING,
  }),
  Object.freeze({
    concept: "flow / demand / throughput",
    canonicalAuthority: "none on live bodies (labels only)",
    stableIdentity: false,
    managementValue: "would help recognition if canonically typed",
    formFamily: "operational",
    primitive: "rounded-block",
    status: EXECUTIVE_OVS_SEMANTIC_FORM_STATUS.DEFERRED_SEMANTICS_MISSING,
  }),
  Object.freeze({
    concept: "value / financial",
    canonicalAuthority: "none on live bodies (labels only)",
    stableIdentity: false,
    managementValue: "would help recognition if canonically typed",
    formFamily: "operational",
    primitive: "rounded-block",
    status: EXECUTIVE_OVS_SEMANTIC_FORM_STATUS.DEFERRED_SEMANTICS_MISSING,
  }),
  Object.freeze({
    concept: "actor / customer / stakeholder",
    canonicalAuthority: "none on live bodies (labels only)",
    stableIdentity: false,
    managementValue: "would help recognition if canonically typed",
    formFamily: "operational",
    primitive: "rounded-block",
    status: EXECUTIVE_OVS_SEMANTIC_FORM_STATUS.DEFERRED_SEMANTICS_MISSING,
  }),
  Object.freeze({
    concept: "constraint",
    canonicalAuthority: "DTH context kind only; not ManagerObjectKind",
    stableIdentity: false,
    managementValue: "must not collapse into problem or risk by severity",
    formFamily: "none",
    primitive: "none",
    status: EXECUTIVE_OVS_SEMANTIC_FORM_STATUS.DEFERRED_SEMANTICS_MISSING,
  }),
] as const satisfies readonly ExecutiveOvsSemanticFormMatrixRow[]);

export type ExecutiveOvsSemanticFormGrammarInput = {
  readonly objectKind?: string | null;
  readonly kind?: string | null;
  readonly id?: string | null;
  readonly label?: string | null;
  readonly status?: string | null;
  readonly theme?: "day" | "night" | null;
  readonly managementLevel?: "L1" | "L2" | "L3" | null;
  readonly dthCanonicalType?: string | null;
};

export type ExecutiveOvsSemanticFormGrammarResult = {
  readonly cue: string;
  readonly family: ExecutiveOvsObjectFamily;
  readonly primitive: ExecutiveOvsPrimitive;
  readonly livePrimary: boolean;
};

export function resolveExecutiveOvsSemanticFormGrammar(
  input: ExecutiveOvsSemanticFormGrammarInput,
): ExecutiveOvsSemanticFormGrammarResult {
  void input.label;
  void input.status;
  void input.theme;
  void input.managementLevel;
  void input.dthCanonicalType;
  const cue = projectExecutiveOvsObjectKindHandoff({
    id: input.id,
    kind: input.kind,
    objectKind: input.objectKind,
  });
  const family = resolveExecutiveOvsObjectFamily(cue);
  const primitive = resolveExecutiveOvsPrimitive(family);
  return Object.freeze({
    cue,
    family,
    primitive,
    livePrimary: EXECUTIVE_OVS_LIVE_PRIMARY_FORM_FAMILIES.some(
      (entry) => entry === family,
    ),
  });
}

export function verifyExecutiveOvsSemanticFormGrammar(): true {
  if (
    EXECUTIVE_OVS_SEMANTIC_FORM_GRAMMAR_BOUNDARY.inventsParallelOntology ||
    EXECUTIVE_OVS_SEMANTIC_FORM_GRAMMAR_BOUNDARY.usesDthAsSemanticAuthority ||
    EXECUTIVE_OVS_SEMANTIC_FORM_GRAMMAR_BOUNDARY.oneShapePerObject
  ) {
    throw new Error("OVS-FORM-LANGUAGE:1 boundary violated");
  }
  if (EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.operational !== "rounded-block") {
    throw new Error("operational primitive drifted");
  }
  if (EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.risk !== "diamond") {
    throw new Error("risk primitive drifted");
  }
  if (!MANAGER_OBJECT_KINDS.includes("risk")) {
    throw new Error("risk identity missing from Manager Object");
  }
  if (EXECUTIVE_OVS_KIND_TOKEN_TO_FAMILY.risk !== "risk") {
    throw new Error("risk token mapping drifted");
  }
  return true;
}
