/**
 * MRP:4:11 — Pure resolver for Operational scene awareness snapshot.
 */

import { DEFAULT_MRP_SELECTED_OBJECT } from "../../mrpContext/mrpContextStoreContract.ts";
import type { OperationalObjectContext } from "./operationalObjectContextContract.ts";
import {
  DEFAULT_OPERATIONAL_SCENE_AWARENESS,
  type OperationalSceneAwarenessInput,
  type OperationalSceneAwarenessSnapshot,
} from "./operationalSceneAwarenessContract.ts";

function normalizeText(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
}

function resolveObjectId(input: OperationalSceneAwarenessInput): string | null {
  return input.selectedObjectId?.trim() || input.routeObjectId?.trim() || null;
}

function resolveObjectLabel(input: OperationalSceneAwarenessInput): string {
  const label =
    input.selectedObjectLabel ??
    input.routeObjectName ??
    input.selectedObjectId ??
    input.routeObjectId;
  return normalizeText(label, DEFAULT_MRP_SELECTED_OBJECT);
}

function hasMeaningfulSelection(objectId: string | null, selectedObject: string): boolean {
  if (objectId) return true;
  return selectedObject !== DEFAULT_MRP_SELECTED_OBJECT && selectedObject.length > 0;
}

export function resolveOperationalSceneAwareness(
  input: OperationalSceneAwarenessInput,
  revision = 0
): OperationalSceneAwarenessSnapshot {
  const selectedObjectId = resolveObjectId(input);
  const selectedObject = resolveObjectLabel(input);
  const hasSelection = hasMeaningfulSelection(selectedObjectId, selectedObject);

  if (!hasSelection) {
    return Object.freeze({
      ...DEFAULT_OPERATIONAL_SCENE_AWARENESS,
      revision,
      signature: buildOperationalSceneAwarenessSignature(DEFAULT_OPERATIONAL_SCENE_AWARENESS),
    });
  }

  const snapshot = Object.freeze({
    selectedObjectId,
    selectedObject,
    objectStatus: normalizeText(input.selectedObjectStatus, "Active"),
    objectPriority: normalizeText(input.objectPriority, "Standard"),
    objectActivity: normalizeText(input.objectActivity, "Normal"),
    hasSelection: true,
    readOnly: true as const,
    revision,
    signature: "",
  });

  return Object.freeze({
    ...snapshot,
    signature: buildOperationalSceneAwarenessSignature(snapshot),
  });
}

export function mapOperationalObjectContextToSceneAwareness(
  objectContext: OperationalObjectContext,
  revision = 0
): OperationalSceneAwarenessSnapshot {
  if (!objectContext.hasSelection) {
    return Object.freeze({
      ...DEFAULT_OPERATIONAL_SCENE_AWARENESS,
      revision,
      signature: buildOperationalSceneAwarenessSignature(DEFAULT_OPERATIONAL_SCENE_AWARENESS),
    });
  }

  const snapshot = Object.freeze({
    selectedObjectId: objectContext.selectedObjectId,
    selectedObject: objectContext.selectedObject,
    objectStatus: objectContext.objectOperationalStatus,
    objectPriority: objectContext.objectAttentionPriority,
    objectActivity: objectContext.objectActivityLevel,
    hasSelection: true,
    readOnly: true as const,
    revision,
    signature: "",
  });

  return Object.freeze({
    ...snapshot,
    signature: buildOperationalSceneAwarenessSignature(snapshot),
  });
}

export function buildOperationalSceneAwarenessSignature(
  snapshot: Pick<
    OperationalSceneAwarenessSnapshot,
    | "selectedObjectId"
    | "selectedObject"
    | "objectStatus"
    | "objectPriority"
    | "objectActivity"
    | "hasSelection"
    | "readOnly"
  >
): string {
  return JSON.stringify({
    selectedObjectId: snapshot.selectedObjectId,
    selectedObject: snapshot.selectedObject,
    objectStatus: snapshot.objectStatus,
    objectPriority: snapshot.objectPriority,
    objectActivity: snapshot.objectActivity,
    hasSelection: snapshot.hasSelection,
    readOnly: snapshot.readOnly,
  });
}
