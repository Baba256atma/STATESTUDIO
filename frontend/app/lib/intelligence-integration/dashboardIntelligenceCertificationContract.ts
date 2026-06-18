/**
 * INT:2 — Dashboard Intelligence integration certification contract.
 */

export const INT2_DASHBOARD_INTEGRATION_CERTIFICATION_TAG =
  "[INT2_DASHBOARD_INTEGRATION_CERTIFICATION]" as const;

export const INT2_CERTIFIED_TAG = "[INT2_CERTIFIED]" as const;

export const DASHBOARD_INTELLIGENCE_COMPLETE_TAG = "[DASHBOARD_INTELLIGENCE_COMPLETE]" as const;

export const INT2_CERTIFICATION_COMPLETE_DIAGNOSTIC = "[INT2_CERTIFICATION_COMPLETE]" as const;

export const INT2_CERTIFICATION_FREEZE_TAGS = Object.freeze([
  INT2_CERTIFIED_TAG,
  DASHBOARD_INTELLIGENCE_COMPLETE_TAG,
] as const);

export type DashboardIntelligenceCertificationGateId =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M";

export type DashboardIntelligenceCertificationGate = Readonly<{
  id: DashboardIntelligenceCertificationGateId;
  name: string;
  status: "PASS" | "FAIL";
  detail: string;
}>;

export type DashboardIntelligenceCertificationResult = Readonly<{
  tag: typeof INT2_DASHBOARD_INTEGRATION_CERTIFICATION_TAG;
  version: "2.6.0";
  certified: boolean;
  diagnostics: readonly [typeof INT2_CERTIFICATION_COMPLETE_DIAGNOSTIC];
  gates: readonly DashboardIntelligenceCertificationGate[];
  freezeTags: typeof INT2_CERTIFICATION_FREEZE_TAGS;
}>;
