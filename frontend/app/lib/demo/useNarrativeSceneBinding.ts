"use client";

import { useEffect, useMemo } from "react";

import type { NarrativeSceneAction } from "./narrativeSceneTypes";
import type { DemoScriptStep } from "./demoScript";

type UseNarrativeSceneBindingArgs = {
  step: DemoScriptStep | null;
  sceneJson: any | null;
};

type NarrativeSceneBinding = {
  stepId: string | null;
  action: NarrativeSceneAction | null;
  highlightIds: string[];
  dimIds: string[];
  focusId: string | null;
  clear: boolean;
  isActive: boolean;
  objectSelection: {
    highlighted_objects?: string[];
    risk_sources?: string[];
    risk_targets?: string[];
    dim_unrelated_objects?: boolean;
  } | null;
};

function resolveSceneObjectIdSet(sceneJson: any | null) {
  const objects = Array.isArray(sceneJson?.scene?.objects) ? sceneJson.scene.objects : [];
  return new Set<string>(
    objects
      .map((item: Record<string, unknown>, index: number) => String(item?.id ?? item?.name ?? `obj:${index}`).trim())
      .filter(Boolean)
  );
}

function resolveIds(ids: string[] | undefined, availableIds: Set<string>) {
  return Array.isArray(ids) ? ids.map(String).filter((id) => availableIds.has(id)) : [];
}

export function useNarrativeSceneBinding(args: UseNarrativeSceneBindingArgs): NarrativeSceneBinding {
  const { step, sceneJson } = args;

  return useMemo(() => {
    const availableIds = resolveSceneObjectIdSet(sceneJson);
    const action = step?.scene_action ?? null;
    const highlightIds = resolveIds(action?.highlight_ids, availableIds);
    const dimIds = resolveIds(action?.dim_ids, availableIds).filter((id) => !highlightIds.includes(id));
    const focusId =
      action?.focus_id && availableIds.has(String(action.focus_id)) ? String(action.focus_id) : highlightIds[0] ?? null;
    const clear = action?.clear === true;
    const isActive = !!step && (!!action || clear);
    const objectSelection =
      isActive
        ? {
            highlighted_objects: highlightIds,
            risk_sources: focusId ? [focusId] : [],
            risk_targets: highlightIds.filter((id) => id !== focusId).slice(0, 3),
            dim_unrelated_objects: false,
          }
        : null;

    return {
      stepId: step?.step_id ?? null,
      action,
      highlightIds,
      dimIds,
      focusId,
      clear,
      isActive,
      objectSelection,
    };
  }, [sceneJson, step]);
}

export function useNarrativeSceneBindingDebug(binding: NarrativeSceneBinding) {
  useEffect(() => {
    if (!binding.stepId) return;
    console.log("[Nexora][Narrative→Scene]", {
      step: binding.stepId,
      action: binding.action,
    });
  }, [binding.action, binding.stepId]);
}
