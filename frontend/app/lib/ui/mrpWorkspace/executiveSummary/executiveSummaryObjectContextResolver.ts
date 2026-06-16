/**
 * MRP:4:3 — Pure resolver for Executive Summary object context.
 */

import { DEFAULT_MRP_SELECTED_OBJECT } from "../../mrpContext/mrpContextStoreContract.ts";
import {
  DEFAULT_EXECUTIVE_SUMMARY_OBJECT_CONTEXT,
  EXECUTIVE_SUMMARY_KNOWN_OBJECT_FIXTURES,
  type ExecutiveSummaryObjectContext,
  type ExecutiveSummaryObjectContextInput,
} from "./executiveSummaryObjectContextContract.ts";

function normalizeText(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
}

function resolveObjectId(input: ExecutiveSummaryObjectContextInput): string | null {
  const id = input.selectedObjectId?.trim() || input.routeObjectId?.trim() || null;
  return id;
}

function resolveObjectLabel(input: ExecutiveSummaryObjectContextInput): string {
  const label =
    input.selectedObjectLabel ??
    input.routeObjectName ??
    input.selectedObjectId ??
    input.routeObjectId;
  return normalizeText(label, DEFAULT_MRP_SELECTED_OBJECT);
}

function hasMeaningfulSelection(
  objectId: string | null,
  selectedObject: string
): boolean {
  if (objectId) return true;
  return (
    selectedObject !== DEFAULT_MRP_SELECTED_OBJECT &&
    selectedObject.length > 0
  );
}

function resolveKnownObjectFixture(
  selectedObject: string
): (typeof EXECUTIVE_SUMMARY_KNOWN_OBJECT_FIXTURES)[string] | null {
  const key = selectedObject.trim().toLowerCase();
  return EXECUTIVE_SUMMARY_KNOWN_OBJECT_FIXTURES[key] ?? null;
}

export function resolveExecutiveSummaryObjectContext(
  input: ExecutiveSummaryObjectContextInput
): ExecutiveSummaryObjectContext {
  const selectedObjectId = resolveObjectId(input);
  const selectedObject = resolveObjectLabel(input);
  const hasSelection = hasMeaningfulSelection(selectedObjectId, selectedObject);

  if (!hasSelection) {
    return DEFAULT_EXECUTIVE_SUMMARY_OBJECT_CONTEXT;
  }

  const fixture = resolveKnownObjectFixture(selectedObject);
  const objectType = normalizeText(input.selectedObjectType, "");
  const objectStatusInput = normalizeText(input.selectedObjectStatus, "");

  return Object.freeze({
    selectedObjectId,
    selectedObject,
    objectStatus:
      objectStatusInput ||
      fixture?.objectStatus ||
      "Active",
    objectPriority:
      fixture?.objectPriority ||
      (objectType ? objectType : "Standard"),
    objectAttentionLevel: fixture?.objectAttentionLevel || "Normal",
    hasSelection: true,
  });
}

export function buildExecutiveSummaryObjectContextSignature(
  context: ExecutiveSummaryObjectContext
): string {
  return JSON.stringify({
    selectedObjectId: context.selectedObjectId,
    selectedObject: context.selectedObject,
    objectStatus: context.objectStatus,
    objectPriority: context.objectPriority,
    objectAttentionLevel: context.objectAttentionLevel,
    hasSelection: context.hasSelection,
  });
}
