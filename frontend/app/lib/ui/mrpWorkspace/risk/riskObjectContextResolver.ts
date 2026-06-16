/**
 * MRP:4C:3 — Pure resolver for Risk workspace object context.
 */

import type { SceneJson } from "../../../sceneTypes.ts";
import { DEFAULT_MRP_SELECTED_OBJECT } from "../../mrpContext/mrpContextStoreContract.ts";
import {
  DEFAULT_RISK_OBJECT_CONTEXT,
  RISK_KNOWN_OBJECT_FIXTURES,
  RISK_NO_OBJECT_SELECTED_LABEL,
  type RiskObjectContext,
  type RiskObjectContextInput,
} from "./riskObjectContextContract.ts";

function normalizeText(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function resolveObjectId(input: RiskObjectContextInput): string | null {
  return input.selectedObjectId?.trim() || input.routeObjectId?.trim() || null;
}

function resolveObjectLabel(input: RiskObjectContextInput): string {
  const label =
    input.selectedObjectLabel ??
    input.routeObjectName ??
    input.selectedObjectId ??
    input.routeObjectId;
  return normalizeText(label, RISK_NO_OBJECT_SELECTED_LABEL);
}

function isNoSelectionLabel(label: string): boolean {
  const normalized = label.trim().toLowerCase();
  return (
    normalized === RISK_NO_OBJECT_SELECTED_LABEL.toLowerCase() ||
    normalized === DEFAULT_MRP_SELECTED_OBJECT.toLowerCase()
  );
}

function hasMeaningfulSelection(objectId: string | null, selectedObject: string): boolean {
  if (objectId) return true;
  if (isNoSelectionLabel(selectedObject)) return false;
  return selectedObject.length > 0;
}

function findSceneObject(sceneJson: SceneJson | null | undefined, objectId: string | null): unknown {
  if (!objectId) return null;
  const objects = sceneJson?.scene?.objects;
  if (!Array.isArray(objects)) return null;
  return (
    objects.find((obj) => {
      const record = asRecord(obj);
      return record && String(record.id ?? "") === objectId;
    }) ?? null
  );
}

function readSceneObjectField(obj: unknown, keys: readonly string[]): string {
  const record = asRecord(obj);
  if (!record) return "";
  const semantic = asRecord(record.semantic);
  const meta = asRecord(record.meta);
  for (const key of keys) {
    for (const source of [record, semantic, meta]) {
      if (!source) continue;
      const raw = source[key];
      if (typeof raw === "number" && Number.isFinite(raw)) {
        return String(raw);
      }
      const text = normalizeText(raw, "");
      if (text) return text;
    }
  }
  return "";
}

function formatConfidence(value: string): string {
  const numeric = Number(value);
  if (!value || !Number.isFinite(numeric)) return value;
  if (numeric >= 0 && numeric <= 1) {
    return `${Math.round(numeric * 100)}%`;
  }
  if (numeric >= 0 && numeric <= 100) {
    return `${Math.round(numeric)}%`;
  }
  return value;
}

function resolveRiskStatusFromScene(obj: unknown, statusInput: string): string {
  if (statusInput) return statusInput;
  const severity = readSceneObjectField(obj, ["severity", "scanner_severity", "risk_status"]);
  if (severity) return severity;
  const state = readSceneObjectField(obj, ["state", "status"]);
  if (state) return state;
  return "";
}

function resolveImpactFromScene(obj: unknown): string {
  return readSceneObjectField(obj, ["impact", "risk_impact", "downstream_impact"]);
}

function resolveConfidenceFromScene(obj: unknown): string {
  const raw = readSceneObjectField(obj, [
    "confidence",
    "scanner_confidence",
    "risk_confidence",
    "signal_confidence",
  ]);
  return formatConfidence(raw);
}

function resolveKnownObjectFixture(
  selectedObject: string
): (typeof RISK_KNOWN_OBJECT_FIXTURES)[string] | null {
  const key = selectedObject.trim().toLowerCase();
  return RISK_KNOWN_OBJECT_FIXTURES[key] ?? null;
}

export function resolveRiskObjectContext(input: RiskObjectContextInput): RiskObjectContext {
  const selectedObjectId = resolveObjectId(input);
  const selectedObject = resolveObjectLabel(input);
  const hasSelection = hasMeaningfulSelection(selectedObjectId, selectedObject);

  if (!hasSelection) {
    return DEFAULT_RISK_OBJECT_CONTEXT;
  }

  const sceneObject = findSceneObject(input.sceneJson, selectedObjectId);
  const fixture = resolveKnownObjectFixture(selectedObject);
  const statusInput = normalizeText(input.selectedObjectStatus, "");

  return Object.freeze({
    selectedObjectId,
    selectedObject,
    riskStatus:
      resolveRiskStatusFromScene(sceneObject, statusInput) ||
      fixture?.riskStatus ||
      "Stable",
    impact: resolveImpactFromScene(sceneObject) || fixture?.impact || "Local scope",
    confidence:
      resolveConfidenceFromScene(sceneObject) || fixture?.confidence || "Medium",
    hasSelection: true,
  });
}

export function buildRiskObjectContextSignature(context: RiskObjectContext): string {
  return JSON.stringify({
    selectedObjectId: context.selectedObjectId,
    selectedObject: context.selectedObject,
    riskStatus: context.riskStatus,
    impact: context.impact,
    confidence: context.confidence,
    hasSelection: context.hasSelection,
  });
}
