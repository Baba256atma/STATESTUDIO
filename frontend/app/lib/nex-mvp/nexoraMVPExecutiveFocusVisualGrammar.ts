/**
 * SP:4.1C shell bridge — apply final rendered separation after choreography.
 *
 * Downstream Data Reality choreography may overwrite topology/scale targets.
 * This pass re-resolves SP:4.1C visual grammar so calibrated positions and
 * scales are the last authority before Three.js.
 */

import { resolveExecutiveFocusVisualGrammar } from "@/app/lib/spatial-presentation/executiveFocusVisualGrammar";
import type { ExecutiveFocusPresentationDepth } from "@/app/lib/spatial-presentation/executiveFocusSceneDisclosure";

import type { NexoraMVPStageObjectPresentation } from "./nexora3DExecutiveStage";
import type {
  NexoraMVPContextNodePresentation,
  NexoraMVPStageInteractionPresentation,
} from "./nexoraMVPObjectInteraction";

function mapObjectToGrammarSubject(object: NexoraMVPStageObjectPresentation) {
  const isThreadWork =
    object.kind === "problem" ||
    object.kind === "scenario" ||
    object.kind === "decision" ||
    object.kind === "execution";
  return Object.freeze({
    subjectId: object.id,
    label: object.label,
    family: isThreadWork
      ? ("executive-work" as const)
      : ("business-object" as const),
    objectKind: object.kind,
    workKind: isThreadWork ? object.kind : undefined,
    disclosureState: object.disclosureState,
    roleHint: object.role,
    attention: object.attention,
    status: object.status,
    position: object.targetPosition,
    scale: object.scale,
  });
}

function mapContextToGrammarSubject(node: NexoraMVPContextNodePresentation) {
  return Object.freeze({
    subjectId: node.id,
    label: node.label,
    family:
      node.role === "collapsed-thread"
        ? ("collapsed-thread" as const)
        : node.kind === "object"
          ? ("business-object" as const)
          : ("executive-work" as const),
    objectKind:
      node.kind === "executive-thread"
        ? "insight"
        : node.kind === "object"
          ? "object"
          : node.kind,
    workKind:
      node.kind === "problem" ||
      node.kind === "scenario" ||
      node.kind === "decision" ||
      node.kind === "execution"
        ? node.kind
        : node.kind === "executive-thread"
          ? ("executive-thread" as const)
          : undefined,
    disclosureState: node.disclosureState,
    roleHint: node.role,
    attention: node.attention,
    status: node.status,
    position: node.targetPosition,
    scale: node.scale,
  });
}

/**
 * Final SP:4.1C pass: rewrite object + context targetPosition/scale from
 * effective rendered-separation grammar. Labels follow final positions.
 * Connections and hit targets read targetPosition at render time.
 */
export function applyExecutiveFocusVisualGrammarToStagePresentation(
  presentation: NexoraMVPStageInteractionPresentation,
  options?: {
    readonly presentationDepth?: ExecutiveFocusPresentationDepth;
  },
): NexoraMVPStageInteractionPresentation {
  const visibleObjects = presentation.scene.objects.filter(
    (object) => object.disclosureState !== "hidden",
  );
  const grammarSubjects = [
    ...visibleObjects.map(mapObjectToGrammarSubject),
    ...presentation.contextNodes.map(mapContextToGrammarSubject),
  ];

  if (grammarSubjects.length === 0) {
    return presentation;
  }

  const focusedSubjectId =
    presentation.scene.focusedObjectId ??
    presentation.focusedSubjectId ??
    null;

  const grammar = resolveExecutiveFocusVisualGrammar({
    mode: presentation.scene.mode === "overview" ? "overview" : "focus",
    presentationDepth: options?.presentationDepth ?? "minimum",
    focusedSubjectId,
    cameraPosition: Object.freeze({
      x: presentation.scene.camera.position[0],
      y: presentation.scene.camera.position[1],
      z: presentation.scene.camera.position[2],
    }),
    cameraTarget: Object.freeze({
      x: presentation.scene.camera.target[0],
      y: presentation.scene.camera.target[1],
      z: presentation.scene.camera.target[2],
    }),
    cameraFov: presentation.scene.camera.fov,
    subjects: grammarSubjects,
  });

  const objects = Object.freeze(
    presentation.scene.objects.map((object) => {
      const entry = grammar.byId.get(object.id);
      if (entry == null || object.disclosureState === "hidden") {
        return object;
      }
      return Object.freeze({
        ...object,
        targetPosition: entry.targetPosition,
        scale: entry.scale,
        labelProminence: entry.label.prominence,
        visualGrammarRole: entry.visualRole,
        labelPrimaryLine: entry.label.primaryLine,
        labelSecondaryLine: entry.label.secondaryLine,
        labelAnchorBoost: entry.labelAnchorBoost,
      });
    }),
  );

  const contextNodes = Object.freeze(
    presentation.contextNodes.map((node) => {
      const entry = grammar.byId.get(node.id);
      if (entry == null) return node;
      // STAGE-THREAD:1-FIX — preserve gateway label + placement authority.
      if (node.role === "collapsed-thread" && node.gatewayMode != null) {
        return Object.freeze({
          ...node,
          targetPosition: node.targetPosition,
          scale: Math.max(node.scale, entry.scale, 1),
          label: node.label,
        });
      }
      return Object.freeze({
        ...node,
        targetPosition: entry.targetPosition,
        scale: entry.scale,
        label:
          node.role === "collapsed-thread"
            ? node.label
            : entry.label.secondaryLine != null &&
                !String(entry.label.primaryLine)
                  .toLowerCase()
                  .includes(
                    String(entry.label.secondaryLine).toLowerCase(),
                  )
              ? `${entry.label.primaryLine} · ${entry.label.secondaryLine}`
              : entry.label.primaryLine,
      });
    }),
  );

  return Object.freeze({
    ...presentation,
    contextNodes,
    scene: Object.freeze({
      ...presentation.scene,
      objects,
    }),
  });
}
