import type { DecisionPathNodeVisualHints } from "../../components/overlays/DecisionPathOverlayLayer";
import type { AnimatableObjectProps } from "../../components/scene/AnimatableObject";
import { resolveStableObjectId } from "./objectRegistryRuntime";

function visualHintsEqual(
  a: DecisionPathNodeVisualHints | undefined,
  b: DecisionPathNodeVisualHints | undefined
): boolean {
  if (a === b) return true;
  if (!a || !b) return !a && !b;
  return (
    a.isCriticalPath === b.isCriticalPath &&
    a.isLeveragePoint === b.isLeveragePoint &&
    a.isBottleneck === b.isBottleneck &&
    a.isProtected === b.isProtected
  );
}

function sceneObjectVisualEqual(
  prev: AnimatableObjectProps["obj"],
  next: AnimatableObjectProps["obj"],
  prevIndex: number,
  nextIndex: number
): boolean {
  if (prev === next) return true;
  const prevId = resolveStableObjectId(prev, prevIndex);
  const nextId = resolveStableObjectId(next, nextIndex);
  const transformSignature = (object: AnimatableObjectProps["obj"]) =>
    JSON.stringify({
      position: (object as any)?.position ?? null,
      pos: (object as any)?.pos ?? null,
      transform: (object as any)?.transform ?? null,
      scale: (object as any)?.scale ?? null,
    });
  const materialSignature = (object: AnimatableObjectProps["obj"]) =>
    JSON.stringify({
      color: (object as any)?.color ?? null,
      material: (object as any)?.material ?? null,
      emphasis: (object as any)?.emphasis ?? null,
    });
  return (
    prevId === nextId &&
    prev?.type === next?.type &&
    transformSignature(prev) === transformSignature(next) &&
    materialSignature(prev) === materialSignature(next) &&
    JSON.stringify(prev?.tags ?? null) === JSON.stringify(next?.tags ?? null) &&
    (prev as any)?.scanner_highlighted === (next as any)?.scanner_highlighted &&
    (prev as any)?.scanner_severity === (next as any)?.scanner_severity &&
    (prev as any)?.scanner_emphasis === (next as any)?.scanner_emphasis &&
    (prev as any)?.scanner_focus === (next as any)?.scanner_focus
  );
}

function arrayEqual(a: readonly string[], b: readonly string[]): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

/** Meaningful prop equality — ignores callback/reference churn on stable data. */
export function areAnimatableObjectPropsEqual(
  prev: AnimatableObjectProps,
  next: AnimatableObjectProps
): boolean {
  if (prev.renderId !== next.renderId) return false;
  if (!sceneObjectVisualEqual(prev.obj, next.obj, prev.index, next.index)) return false;
  if (prev.index !== next.index) return false;

  const prevId = resolveStableObjectId(prev.obj, prev.index);
  const nextId = resolveStableObjectId(next.obj, next.index);
  if (prevId !== nextId) return false;

  if (prev.focusedId !== next.focusedId) return false;
  if (prev.focusMode !== next.focusMode) return false;
  if (prev.hasValidFocusedTarget !== next.hasValidFocusedTarget) return false;
  if (prev.theme !== next.theme) return false;
  if (prev.modeId !== next.modeId) return false;
  if (prev.globalScale !== next.globalScale) return false;
  if (prev.sceneScale !== next.sceneScale) return false;
  if (prev.sceneObjectCount !== next.sceneObjectCount) return false;
  if (prev.shadowsEnabled !== next.shadowsEnabled) return false;
  if (prev.motionCalm !== next.motionCalm) return false;
  if (prev.hoveredId !== next.hoveredId) return false;
  if (prev.hoveredInteractionRole !== next.hoveredInteractionRole) return false;
  if (prev.scannerSceneActive !== next.scannerSceneActive) return false;
  if (prev.scannerFragilityScore !== next.scannerFragilityScore) return false;
  if (prev.scannerPrimaryTargetId !== next.scannerPrimaryTargetId) return false;
  if (prev.resolvedPrimaryRenderId !== next.resolvedPrimaryRenderId) return false;
  if (prev.labelOwnerId !== next.labelOwnerId) return false;
  if (prev.scannerPrimaryRole !== next.scannerPrimaryRole) return false;
  if (prev.scannerPrimaryLabelTitle !== next.scannerPrimaryLabelTitle) return false;
  if (prev.scannerPrimaryLabelBody !== next.scannerPrimaryLabelBody) return false;
  if (prev.narrativeFocusStrength !== next.narrativeFocusStrength) return false;
  if (prev.narrativeFocusRole !== next.narrativeFocusRole) return false;
  if (prev.simulationStrength !== next.simulationStrength) return false;
  if (prev.isSimulationSource !== next.isSimulationSource) return false;
  if (prev.decisionPathStrength !== next.decisionPathStrength) return false;
  if (prev.decisionPathRole !== next.decisionPathRole) return false;
  if (prev.isDecisionPathSource !== next.isDecisionPathSource) return false;
  if (prev.attentionMemoryStrength !== next.attentionMemoryStrength) return false;
  if (!visualHintsEqual(prev.decisionPathVisualHints, next.decisionPathVisualHints)) return false;
  if (!arrayEqual(prev.neighborIds ?? [], next.neighborIds ?? [])) return false;
  if (!arrayEqual(prev.scannerTargetIds ?? [], next.scannerTargetIds ?? [])) return false;
  if (!arrayEqual(prev.affectedTargetIds ?? [], next.affectedTargetIds ?? [])) return false;
  if (!arrayEqual(prev.contextTargetIds ?? [], next.contextTargetIds ?? [])) return false;
  if (!arrayEqual(prev.riskSourceIds ?? [], next.riskSourceIds ?? [])) return false;
  if (!arrayEqual(prev.riskTargetIds ?? [], next.riskTargetIds ?? [])) return false;

  const prevReveal = prev.scannerStoryReveal;
  const nextReveal = next.scannerStoryReveal;
  if (
    prevReveal?.primary !== nextReveal?.primary ||
    prevReveal?.edge !== nextReveal?.edge ||
    prevReveal?.affected !== nextReveal?.affected ||
    prevReveal?.context !== nextReveal?.context
  ) {
    return false;
  }

  if (JSON.stringify(prev.decisionCenter ?? null) !== JSON.stringify(next.decisionCenter ?? null)) {
    return false;
  }

  if (prev.anim !== next.anim) return false;
  return true;
}
