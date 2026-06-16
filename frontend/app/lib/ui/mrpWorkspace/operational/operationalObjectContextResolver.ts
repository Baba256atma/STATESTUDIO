/**
 * MRP:4:9 — Pure resolver for Operational workspace object context.
 */

import { DEFAULT_MRP_SELECTED_OBJECT } from "../../mrpContext/mrpContextStoreContract.ts";
import {
  DEFAULT_OPERATIONAL_OBJECT_CONTEXT,
  OPERATIONAL_KNOWN_OBJECT_FIXTURES,
  type OperationalObjectContext,
  type OperationalObjectContextInput,
} from "./operationalObjectContextContract.ts";

function normalizeText(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
}

function resolveObjectId(input: OperationalObjectContextInput): string | null {
  return input.selectedObjectId?.trim() || input.routeObjectId?.trim() || null;
}

function resolveObjectLabel(input: OperationalObjectContextInput): string {
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
): (typeof OPERATIONAL_KNOWN_OBJECT_FIXTURES)[string] | null {
  const key = selectedObject.trim().toLowerCase();
  return OPERATIONAL_KNOWN_OBJECT_FIXTURES[key] ?? null;
}

export function resolveOperationalObjectContext(
  input: OperationalObjectContextInput
): OperationalObjectContext {
  const selectedObjectId = resolveObjectId(input);
  const selectedObject = resolveObjectLabel(input);
  const hasSelection = hasMeaningfulSelection(selectedObjectId, selectedObject);

  if (!hasSelection) {
    return DEFAULT_OPERATIONAL_OBJECT_CONTEXT;
  }

  const fixture = resolveKnownObjectFixture(selectedObject);
  const objectStatusInput = normalizeText(input.selectedObjectStatus, "");

  return Object.freeze({
    selectedObjectId,
    selectedObject,
    objectOperationalStatus:
      objectStatusInput || fixture?.objectOperationalStatus || "Active",
    objectActivityLevel: fixture?.objectActivityLevel || "Normal",
    objectAttentionPriority: fixture?.objectAttentionPriority || "Standard",
    hasSelection: true,
  });
}

export function buildOperationalObjectContextSignature(
  context: OperationalObjectContext
): string {
  return JSON.stringify({
    selectedObjectId: context.selectedObjectId,
    selectedObject: context.selectedObject,
    objectOperationalStatus: context.objectOperationalStatus,
    objectActivityLevel: context.objectActivityLevel,
    objectAttentionPriority: context.objectAttentionPriority,
    hasSelection: context.hasSelection,
  });
}
