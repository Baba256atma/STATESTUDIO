"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { dedupeNexoraDevLog } from "../debug/panelConsoleTraceDedupe";

import type { NarrativeSceneAction } from "./narrativeSceneTypes";
import type { DemoScriptStep } from "./demoScript";

import type { SceneJson } from "../sceneTypes";

type UseNarrativeSceneBindingArgs = {
  step: DemoScriptStep | null;
  sceneJson: SceneJson | null;
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

function resolveSceneObjectIdSet(sceneJson: SceneJson | null) {
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

function getNarrativeBindingSignature(binding: NarrativeSceneBinding) {
  return JSON.stringify({
    stepId: binding.stepId,
    clear: binding.clear,
    isActive: binding.isActive,
    focusId: binding.focusId,
    highlightIds: getIdsSignature(binding.highlightIds),
    dimIds: getIdsSignature(binding.dimIds),
    hasObjectSelection: Boolean(binding.objectSelection),
  });
}

/** AD-FE-HOOKS-01: signature-stable hold via state (not render-time refs). */
function useSignatureStableNarrativeBinding(value: NarrativeSceneBinding): NarrativeSceneBinding {
  const [held, setHeld] = useState(() => ({
    signature: getNarrativeBindingSignature(value),
    value,
  }));
  const signature = getNarrativeBindingSignature(value);
  if (signature !== held.signature) {
    setHeld({ signature, value });
    return value;
  }
  return held.value;
}

export function useNarrativeSceneBinding(args: UseNarrativeSceneBindingArgs): NarrativeSceneBinding {
  const { step, sceneJson } = args;
  // Diagnostic dedupe only — effect-owned (AD-FE-HOOKS-01).
  const lastObservedInputKeyRef = useRef<string>("");
  const lastLoggedBindingSignatureRef = useRef<string>("");

  const sceneObjectIdSet = useMemo(() => resolveSceneObjectIdSet(sceneJson), [sceneJson]);
  const sceneObjectIdSignature = useMemo(() => Array.from(sceneObjectIdSet).sort().join("|"), [sceneObjectIdSet]);
  const actionSignature = useMemo(() => JSON.stringify(step?.scene_action ?? null), [step?.scene_action]);

  const nextBinding = useMemo(() => {
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
  }, [sceneObjectIdSet, step]);

  const binding = useSignatureStableNarrativeBinding(nextBinding);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;

    const action = step?.scene_action ?? null;
    const requestedFocusId =
      action?.focus_id != null && String(action.focus_id).trim().length > 0 ? String(action.focus_id).trim() : null;
    const invalidFocusTarget = requestedFocusId && !sceneObjectIdSet.has(requestedFocusId) ? requestedFocusId : null;
    const bindingSignature = getNarrativeBindingSignature(binding);
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
