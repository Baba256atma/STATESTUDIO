"use client";

import { useEffect, useMemo, useRef } from "react";
import { dedupeNexoraDevLog } from "../debug/panelConsoleTraceDedupe";

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
  return Array.isArray(ids) ? Array.from(new Set(ids.map(String).filter((id) => availableIds.has(id)))) : [];
}

function getIdsSignature(ids: string[]) {
  return ids.join("|");
}

export function useNarrativeSceneBinding(args: UseNarrativeSceneBindingArgs): NarrativeSceneBinding {
  const { step, sceneJson } = args;
  const previousBindingSignatureRef = useRef<string>("");
  const previousBindingRef = useRef<NarrativeSceneBinding | null>(null);
  const lastObservedInputKeyRef = useRef<string>("");
  const lastLoggedBindingSignatureRef = useRef<string>("");

  const sceneObjectIdSet = useMemo(() => resolveSceneObjectIdSet(sceneJson), [sceneJson]);
  const sceneObjectIdSignature = useMemo(() => Array.from(sceneObjectIdSet).sort().join("|"), [sceneObjectIdSet]);
  const actionSignature = useMemo(() => JSON.stringify(step?.scene_action ?? null), [step?.scene_action]);

  const binding = useMemo(() => {
    const availableIds = sceneObjectIdSet;
    const action = step?.scene_action ?? null;
    const highlightIds = resolveIds(action?.highlight_ids, availableIds);
    const dimIds = resolveIds(action?.dim_ids, availableIds).filter((id) => !highlightIds.includes(id));
    const requestedFocusId =
      action?.focus_id != null && String(action.focus_id).trim().length > 0 ? String(action.focus_id).trim() : null;
    const focusId = requestedFocusId && availableIds.has(requestedFocusId) ? requestedFocusId : null;
    const clear = action?.clear === true;
    const isActive = !!step && (!!action || clear);
    const hasMeaningfulSelection = highlightIds.length > 0 || dimIds.length > 0 || !!focusId;
    const objectSelection =
      isActive && hasMeaningfulSelection
        ? {
            highlighted_objects: highlightIds,
            risk_sources: focusId ? [focusId] : [],
            risk_targets: highlightIds.filter((id) => id !== focusId).slice(0, 3),
            dim_unrelated_objects: false,
          }
        : null;

    const nextBinding = {
      stepId: step?.step_id ?? null,
      action,
      highlightIds,
      dimIds,
      focusId,
      clear,
      isActive,
      objectSelection,
    };
    const bindingSignature = JSON.stringify({
      stepId: nextBinding.stepId,
      clear: nextBinding.clear,
      isActive: nextBinding.isActive,
      focusId: nextBinding.focusId,
      highlightIds: getIdsSignature(nextBinding.highlightIds),
      dimIds: getIdsSignature(nextBinding.dimIds),
      hasObjectSelection: Boolean(nextBinding.objectSelection),
    });

    if (previousBindingSignatureRef.current === bindingSignature && previousBindingRef.current) {
      return previousBindingRef.current;
    }

    previousBindingSignatureRef.current = bindingSignature;
    previousBindingRef.current = nextBinding;
    return nextBinding;
  }, [sceneObjectIdSet, step]);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;

    const action = step?.scene_action ?? null;
    const requestedFocusId =
      action?.focus_id != null && String(action.focus_id).trim().length > 0 ? String(action.focus_id).trim() : null;
    const invalidFocusTarget = requestedFocusId && !sceneObjectIdSet.has(requestedFocusId) ? requestedFocusId : null;
    const bindingSignature = JSON.stringify({
      stepId: binding.stepId,
      clear: binding.clear,
      isActive: binding.isActive,
      focusId: binding.focusId,
      highlightIds: getIdsSignature(binding.highlightIds),
      dimIds: getIdsSignature(binding.dimIds),
      hasObjectSelection: Boolean(binding.objectSelection),
    });
    const inputKey = `${binding.stepId ?? "none"}|${actionSignature}|${sceneObjectIdSignature}`;
    const traceDetail = {
      stepId: binding.stepId,
      focusId: binding.focusId,
      highlightCount: binding.highlightIds.length,
      dimCount: binding.dimIds.length,
      isActive: binding.isActive,
    };

    if (invalidFocusTarget) {
      const invalidSig = JSON.stringify({
        stepId: binding.stepId ?? null,
        invalidFocusTarget,
        sceneObjectIdSignature,
      });
      dedupeNexoraDevLog("[Nexora][NarrativeBinding] invalid_target_blocked", invalidSig, {
        ...traceDetail,
        nextTargetId: invalidFocusTarget,
      });
    }

    if (lastObservedInputKeyRef.current === inputKey) {
      return;
    }

    if (lastLoggedBindingSignatureRef.current !== bindingSignature) {
      dedupeNexoraDevLog("[Nexora][NarrativeBinding] emitted", bindingSignature, traceDetail);
      lastLoggedBindingSignatureRef.current = bindingSignature;
    }

    lastObservedInputKeyRef.current = inputKey;
  }, [actionSignature, binding, sceneObjectIdSet, sceneObjectIdSignature]);

  return binding;
}

export function useNarrativeSceneBindingDebug(binding: NarrativeSceneBinding) {
  useEffect(() => {
    if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_NEXORA_PRODUCT_MODE === "pilot") return;
    if (!binding.stepId) return;
    console.log("[Nexora][Narrative→Scene]", {
      step: binding.stepId,
      action: binding.action,
    });
  }, [binding.action, binding.stepId]);
}
