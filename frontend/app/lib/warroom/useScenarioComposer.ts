"use client";

import { useCallback, useMemo, useState } from "react";

import { buildScenarioActionIntent, normalizeScenarioActionContract } from "../simulation/scenarioActionContract";
import type { ScenarioActionContract, ScenarioRequestedOutput } from "../simulation/scenarioActionTypes";
import { getWarRoomActionTemplate } from "./warRoomActionTemplates";
import type { WarRoomActionKind, WarRoomDraftState, WarRoomOutputMode } from "./warRoomTypes";

function normalizeId(value: string | null | undefined): string | null {
  const next = String(value ?? "").trim();
  return next.length > 0 ? next : null;
}

function normalizeDraftTargets(value: string[] | null | undefined): string[] {
  return Array.isArray(value)
    ? Array.from(new Set(value.map((item) => String(item ?? "").trim()).filter(Boolean)))
    : [];
}

function resolveRequestedOutputs(outputMode: WarRoomOutputMode): ScenarioRequestedOutput[] {
  switch (outputMode) {
    case "decision_path":
      return ["decision_path"];
    case "mixed":
      return ["propagation", "decision_path"];
    case "propagation":
    default:
      return ["propagation"];
  }
}

function resolveScenarioMode(outputMode: WarRoomOutputMode): "what_if" | "decision_path" | "compare" | "preview" {
  if (outputMode === "decision_path") return "decision_path";
  if (outputMode === "mixed") return "what_if";
  return "preview";
}

function mapWarRoomActionKind(nextKind: WarRoomActionKind, outputMode: WarRoomOutputMode) {
  if (outputMode === "decision_path") return "decision_path_request" as const;
  if (outputMode === "mixed") return "strategy_apply" as const;
  switch (nextKind) {
    case "stress":
      return "stress_increase" as const;
    case "stabilize":
      return "stress_reduce" as const;
    case "redistribute":
      return "strategy_apply" as const;
    case "optimize":
    default:
      return "propagation_request" as const;
  }
}

function createEmptyDraft(selectedObjectId: string | null = null): WarRoomDraftState {
  return {
    selectedObjectId,
    actionKind: null,
    targetObjectIds: [],
    label: "",
    description: "",
    outputMode: "propagation",
    parameters: {},
    isDirty: false,
  };
}

export function useScenarioComposer(initialSelectedObjectId: string | null = null) {
  const [draft, setDraft] = useState<WarRoomDraftState>(() => createEmptyDraft(initialSelectedObjectId));

  const updateDraft = useCallback((patch: Partial<WarRoomDraftState>) => {
    setDraft((current) => ({
      ...current,
      ...patch,
      targetObjectIds:
        patch.targetObjectIds !== undefined ? normalizeDraftTargets(patch.targetObjectIds) : current.targetObjectIds,
      parameters:
        patch.parameters !== undefined && patch.parameters && typeof patch.parameters === "object"
          ? patch.parameters
          : current.parameters,
      isDirty: patch.isDirty ?? true,
    }));
  }, []);

  const setSelectedObject = useCallback((nextId: string | null) => {
    setDraft((current) => ({
      ...current,
      selectedObjectId: normalizeId(nextId),
      isDirty: current.isDirty || !!normalizeId(nextId),
    }));
  }, []);

  const setActionKind = useCallback((nextKind: WarRoomActionKind | null) => {
    const template = getWarRoomActionTemplate(nextKind);
    setDraft((current) => ({
      ...current,
      actionKind: nextKind,
      label: current.label || template?.label || "",
      description: current.description || template?.description || "",
      outputMode: template?.outputMode ?? current.outputMode,
      parameters: {
        ...(template?.defaultParameters ?? {}),
        ...(current.parameters ?? {}),
      },
      isDirty: true,
    }));
  }, []);

  const setOutputMode = useCallback((nextMode: WarRoomOutputMode) => {
    setDraft((current) => ({
      ...current,
      outputMode: nextMode,
      isDirty: true,
    }));
  }, []);

  const setTargets = useCallback((targetIds: string[]) => {
    setDraft((current) => ({
      ...current,
      targetObjectIds: normalizeDraftTargets(targetIds),
      isDirty: true,
    }));
  }, []);

  const clearDraft = useCallback((nextSelectedObjectId?: string | null) => {
    setDraft(createEmptyDraft(normalizeId(nextSelectedObjectId) ?? null));
  }, []);

  const canRun = useMemo(
    () => !!normalizeId(draft.selectedObjectId) && !!draft.actionKind,
    [draft.actionKind, draft.selectedObjectId]
  );

  const buildIntent = useCallback(() => {
    if (!canRun || !draft.actionKind) return null;
    return buildScenarioActionIntent({
      action_kind: mapWarRoomActionKind(draft.actionKind, draft.outputMode),
      source_object_id: draft.selectedObjectId,
      target_object_ids: draft.targetObjectIds,
      label: draft.label || undefined,
      description: draft.description || undefined,
      parameters: draft.parameters,
      mode: resolveScenarioMode(draft.outputMode),
      requested_outputs: resolveRequestedOutputs(draft.outputMode),
      created_at: Date.now(),
      priority: 700,
    });
  }, [canRun, draft.actionKind, draft.description, draft.label, draft.outputMode, draft.parameters, draft.selectedObjectId, draft.targetObjectIds]);

  const buildContract = useCallback((): ScenarioActionContract | null => {
    const intent = buildIntent();
    if (!intent) return null;
    return normalizeScenarioActionContract({
      intent,
      route_policy: {
        reuse_payload_if_available: true,
        request_backend: true,
        allow_preview_fallback: intent.requested_outputs?.includes("propagation") ?? false,
      },
      visualization_hints: {
        preferred_focus_object_id: intent.source_object_id,
        preserve_existing_scene: true,
        emphasis_mode:
          draft.outputMode === "mixed"
            ? "mixed"
            : draft.outputMode === "decision_path"
            ? "decision_path"
            : "propagation",
      },
      metadata: {
        origin: "war_room",
        version: "scenario_action_v1",
      },
    });
  }, [buildIntent, draft.outputMode]);

  return {
    draft,
    updateDraft,
    setSelectedObject,
    setActionKind,
    setOutputMode,
    setTargets,
    buildIntent,
    buildContract,
    clearDraft,
    canRun,
  };
}
