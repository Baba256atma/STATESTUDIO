/**
 * NPA-T VAI:1 — read-only Variable resolver.
 *
 * Consumes existing semantic / data / evidence / KPI / object references.
 * Does not mutate canonical state or invent causality or missing meaning.
 */

import type { CsvSemanticConfirmationSource, CsvSemanticState } from "@/app/lib/data-reality/csvRealDataVerticalSlice.ts";
import { vaiFoundationIdentity } from "./vaiIdentity.ts";
import {
  VAI_CONTEXTUAL_ROLES,
  VAI_FOUNDATION_CONTRACT,
  type VaiConfidence,
  type VaiContextualRole,
  type VaiDirection,
  type VaiKnownOrUnknown,
  type VaiSemanticStatus,
  type VaiSourceKind,
  type VaiVariable,
} from "./vaiContract.ts";

export type VaiAnalysisContext = {
  readonly analysisContextId: string;
};

export type VaiTrustedObservationSource = {
  readonly kind: "TRUSTED_OBSERVATION";
  readonly variableId: string;
  readonly displayName: string;
  readonly sourceKind: VaiSourceKind;
  readonly authority: string;
  readonly sourceRef: string;
  readonly semanticStatus: Extract<VaiSemanticStatus, "MANAGER_CONFIRMED" | "CONFIRMED" | "BOUNDED">;
  readonly semanticMeaning: string | null;
  readonly value?: number | string | null;
  readonly unit?: string | null;
  readonly direction?: VaiDirection | null;
  readonly confidence?: VaiConfidence | null;
  readonly relatedObjectIds?: readonly string[];
  readonly requestedDisplayName?: string | null;
};

export type VaiCsvFieldSource = {
  readonly kind: "CSV_FIELD";
  readonly variableId: string;
  readonly sourceColumn: string;
  readonly fieldId: string;
  readonly proposedMeaning: string | null;
  readonly confirmedMeaning: string | null;
  readonly confirmationSource: CsvSemanticConfirmationSource;
  readonly semanticState: CsvSemanticState;
  readonly sourceRef: string;
  readonly value?: number | string | null;
  readonly unit?: string | null;
  readonly direction?: VaiDirection | null;
  readonly relatedObjectIds?: readonly string[];
  readonly requestedDisplayName?: string | null;
};

export type VaiSourceInput = VaiTrustedObservationSource | VaiCsvFieldSource;

export type VaiVariableApplication = {
  readonly source: VaiSourceInput;
  readonly role: VaiContextualRole;
};

export type VaiResolveInput = {
  readonly analysisContext: VaiAnalysisContext;
  readonly applications: readonly VaiVariableApplication[];
};

export type VaiResolveResult = {
  readonly identity: typeof vaiFoundationIdentity;
  readonly analysisContextId: string;
  readonly variables: readonly VaiVariable[];
  readonly causalAssertion: false;
  readonly canonicalMutation: false;
  readonly objectsCreated: false;
};

export function resolveVaiVariables(input: VaiResolveInput): VaiResolveResult {
  if (!input.analysisContext.analysisContextId.trim()) {
    throw new Error("VAI:1 analysisContextId is required");
  }
  const variables = Object.freeze(
    input.applications.map((application) => resolveOne(input.analysisContext.analysisContextId, application)),
  );
  return Object.freeze({
    identity: vaiFoundationIdentity,
    analysisContextId: input.analysisContext.analysisContextId,
    variables,
    causalAssertion: false,
    canonicalMutation: false,
    objectsCreated: false,
  });
}

function resolveOne(analysisContextId: string, application: VaiVariableApplication): VaiVariable {
  if (!VAI_CONTEXTUAL_ROLES.includes(application.role)) {
    throw new Error("VAI:1 supports exactly six contextual roles");
  }
  const projected = projectSource(application.source);
  return Object.freeze({
    identity: vaiFoundationIdentity,
    variableId: projected.variableId,
    displayName: projected.displayName,
    analysisContextId,
    role: application.role,
    roleIsContextual: true,
    roleIsPermanentClassification: false,
    isExecutiveObject: false,
    objectKind: null,
    value: projected.value,
    unit: projected.unit,
    direction: projected.direction,
    confidence: projected.confidence,
    semanticStatus: projected.semanticStatus,
    semanticMeaning: projected.semanticMeaning,
    provenance: Object.freeze({
      sourceKind: projected.sourceKind,
      authority: projected.authority,
      sourceRef: projected.sourceRef,
    }),
    relatedObjectIds: Object.freeze([...(application.source.relatedObjectIds ?? [])]),
    causalAssertion: false,
    causalClaim: null,
    canonicalMutation: false,
  });
}

function projectSource(source: VaiSourceInput): {
  readonly variableId: string;
  readonly displayName: string;
  readonly sourceKind: VaiSourceKind;
  readonly authority: string;
  readonly sourceRef: string;
  readonly semanticStatus: VaiSemanticStatus;
  readonly semanticMeaning: string | null;
  readonly value: VaiKnownOrUnknown<number | string>;
  readonly unit: VaiKnownOrUnknown<string>;
  readonly direction: VaiDirection;
  readonly confidence: VaiConfidence;
} {
  if (source.kind === "CSV_FIELD") {
    const meaningConfirmed =
      (source.confirmationSource === "manager" || source.confirmationSource === "authoritative-mapping") &&
      Boolean(source.confirmedMeaning?.trim());
    const semanticStatus = meaningConfirmed
      ? source.confirmationSource === "manager"
        ? "MANAGER_CONFIRMED"
        : "CONFIRMED"
      : mapCsvSemanticState(source.semanticState);
    const semanticMeaning = meaningConfirmed ? source.confirmedMeaning : null;
    const displayName = meaningConfirmed
      ? source.confirmedMeaning!.trim()
      : source.sourceColumn;
    void source.requestedDisplayName;
    return {
      variableId: source.variableId,
      displayName,
      sourceKind: meaningConfirmed && source.confirmationSource === "manager" ? "MANAGER_CONFIRMED_SEMANTICS" : "DATA_REALITY",
      authority: meaningConfirmed && source.confirmationSource === "manager" ? "DATA-ADV / manager confirmation" : "Data Reality / RDI",
      sourceRef: source.sourceRef,
      semanticStatus,
      semanticMeaning,
      value: knownOrUnknownValue(source.value),
      unit: knownOrUnknownUnit(source.unit ?? null),
      direction: source.direction ?? "UNKNOWN",
      confidence: meaningConfirmed ? (source.value == null ? "MEDIUM" : "HIGH") : semanticStatus === "AMBIGUOUS" ? "LOW" : "UNKNOWN",
    };
  }

  const displayName = source.displayName;
  void source.requestedDisplayName;
  return {
    variableId: source.variableId,
    displayName,
    sourceKind: source.sourceKind,
    authority: source.authority,
    sourceRef: source.sourceRef,
    semanticStatus: source.semanticStatus,
    semanticMeaning: source.semanticMeaning,
    value: knownOrUnknownValue(source.value ?? null),
    unit: knownOrUnknownUnit(source.unit ?? null),
    direction: source.direction ?? "UNKNOWN",
    confidence: source.confidence ?? ((source.semanticStatus === "MANAGER_CONFIRMED" || source.semanticStatus === "CONFIRMED") && source.value != null ? "HIGH" : source.semanticStatus === "BOUNDED" ? "LOW" : "MEDIUM"),
  };
}

function mapCsvSemanticState(state: CsvSemanticState): VaiSemanticStatus {
  if (state === "UNDERSTOOD") return "BOUNDED";
  if (state === "LIKELY") return "BOUNDED";
  if (state === "AMBIGUOUS" || state === "CONFLICTING") return "AMBIGUOUS";
  return "UNKNOWN";
}

function knownOrUnknownValue(value: number | string | null | undefined): VaiKnownOrUnknown<number | string> {
  if (value === null || value === undefined || value === "") {
    return Object.freeze({ kind: "UNKNOWN" });
  }
  return Object.freeze({ kind: "KNOWN", value });
}

function knownOrUnknownUnit(value: string | null | undefined): VaiKnownOrUnknown<string> {
  if (value === null || value === undefined || value === "") {
    return Object.freeze({ kind: "UNKNOWN" });
  }
  return Object.freeze({ kind: "KNOWN", value });
}

export function vaiDoesNotCreateObjects(): false {
  return VAI_FOUNDATION_CONTRACT.createsObjects;
}
