/**
 * MRP:4C:3 — Risk workspace object context contract.
 *
 * Read-only structural integration — no selection authority, scene writes, or panel opens.
 */

import type { SceneJson } from "../../../sceneTypes.ts";

export const MRP_RISK_OBJECT_CONTEXT_TAG = "[MRP_RISK_OBJECT_CONTEXT]" as const;

export const RISK_OBJECT_CONTEXT_VERSION = "4C.3.0";

export const RISK_NO_OBJECT_SELECTED_LABEL = "No object selected." as const;

export type RiskObjectContext = Readonly<{
  selectedObjectId: string | null;
  selectedObject: string;
  riskStatus: string;
  impact: string;
  confidence: string;
  hasSelection: boolean;
}>;

export type RiskObjectContextInput = Readonly<{
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  selectedObjectType?: string | null;
  selectedObjectStatus?: string | null;
  routeObjectId?: string | null;
  routeObjectName?: string | null;
  sceneJson?: SceneJson | null;
}>;

export const DEFAULT_RISK_OBJECT_CONTEXT: RiskObjectContext = Object.freeze({
  selectedObjectId: null,
  selectedObject: RISK_NO_OBJECT_SELECTED_LABEL,
  riskStatus: "None",
  impact: "None",
  confidence: "None",
  hasSelection: false,
});

export const RISK_OBJECT_CONTEXT_FIELD_LABELS = Object.freeze({
  selectedObject: "Selected Object",
  riskStatus: "Risk Status",
  impact: "Impact",
  confidence: "Confidence",
});

/** Structural fixtures for known demo object labels — not business intelligence. */
export const RISK_KNOWN_OBJECT_FIXTURES: Readonly<
  Record<
    string,
    Readonly<{
      riskStatus: string;
      impact: string;
      confidence: string;
    }>
  >
> = Object.freeze({
  "factory a": Object.freeze({
    riskStatus: "Elevated",
    impact: "Production throughput",
    confidence: "Medium",
  }),
  "supplier network": Object.freeze({
    riskStatus: "Watch",
    impact: "Supply continuity",
    confidence: "High",
  }),
  "production line": Object.freeze({
    riskStatus: "Active",
    impact: "Line stability",
    confidence: "Medium",
  }),
  "project alpha": Object.freeze({
    riskStatus: "Priority",
    impact: "Delivery schedule",
    confidence: "Low",
  }),
});
