/**
 * SP:4.2 Stage bridge — attach presentation-plane composition to Stage
 * presentation under the executive-2_5d composition mode.
 *
 * Compatibility migration (SP:4.3B true-2D authority):
 *   SP:4.3 Executive2DPosition {x,y} is authoritative when present
 *     → constant render-plane Z → remapped targetPosition
 *   Legacy XYZ is only used to seed presentation when SP:4.3 has not authored it.
 *   depthRole must not move objects.
 *
 * Does not implement SP:4.4 focus choreography.
 * SP:4.1C grammar remains the upstream scale/separation pass for now.
 */

import {
  EXECUTIVE_STAGE_COMPOSITION_MODE_DEFAULT,
  EXECUTIVE_STAGE_COMPOSITION_MODE_LEGACY,
  clampExecutivePresentationPositionToRegion,
  createExecutivePresentationPlane,
  createExecutivePresentationPosition,
  executivePresentationTerritoriesIntersect,
  mapExecutive2DPositionToRenderWorld,
  mapExecutiveWorldPositionToPresentation,
  mapVisualGrammarRoleToPresentationDepthRole,
  mapVisualGrammarRoleToPresentationRegion,
  resolveExecutivePresentationCompositionContract,
  resolveExecutivePresentationEffectiveRenderedScale,
  resolveExecutivePresentationFocusCenter,
  resolveExecutivePresentationRegionCenter,
  resolveExecutivePresentationRegions,
  worldTupleFromPresentationWorld,
  type ExecutivePresentationCompositionContract,
  type ExecutivePresentationDepthRole,
  type ExecutivePresentationPosition,
  type ExecutivePresentationRegionId,
  type ExecutiveStageCompositionMode,
} from "@/app/lib/spatial-presentation/executivePresentationPlaneFoundation";

import type { NexoraMVPStageObjectPresentation } from "./nexora3DExecutiveStage";
import type {
  NexoraMVPContextNodePresentation,
  NexoraMVPStageInteractionPresentation,
} from "./nexoraMVPObjectInteraction";

export type NexoraMVPPresentationPlaneFields = {
  readonly compositionMode: ExecutiveStageCompositionMode;
  readonly presentationPosition: ExecutivePresentationPosition;
  readonly depthRole: ExecutivePresentationDepthRole;
  readonly presentationRegion: ExecutivePresentationRegionId;
  readonly presentationComposition?: ExecutivePresentationCompositionContract;
};

function resolveMode(
  mode?: ExecutiveStageCompositionMode,
): ExecutiveStageCompositionMode {
  return mode ?? EXECUTIVE_STAGE_COMPOSITION_MODE_DEFAULT;
}

function layoutRoleFromGrammar(
  role: string | undefined,
  focused: boolean,
): ExecutivePresentationCompositionContract["layoutRole"] {
  if (focused || role === "primary" || role === "focused") return "focus";
  if (
    role === "executive-thread" ||
    role === "collapsed-thread" ||
    role === "thread"
  ) {
    return "thread";
  }
  if (role === "background") return "background";
  return "related";
}

function prominenceFromGrammar(
  role: string | undefined,
  gatewayMode?: "discoverable-collapsed" | "quiet-collapse",
): ExecutivePresentationCompositionContract["prominence"] {
  if (role === "primary") return "primary";
  if (role === "elevated") return "elevated";
  // STAGE-THREAD:1-FIX — discoverable gateway stays readable at Minimum.
  if (gatewayMode === "discoverable-collapsed") return "standard";
  if (role === "background" || role === "collapsed-thread") return "reduced";
  return "standard";
}

function isExecutiveThreadContext(
  node: NexoraMVPContextNodePresentation,
): boolean {
  return (
    node.kind === "executive-thread" || node.role === "collapsed-thread"
  );
}

function enrichObject(
  object: NexoraMVPStageObjectPresentation,
  plane = createExecutivePresentationPlane(),
): NexoraMVPStageObjectPresentation {
  // SP:4.3 may already author presentationPosition — do not re-derive from XYZ.
  const presentationPosition =
    object.presentationPosition != null
      ? object.presentationPosition
      : mapExecutiveWorldPositionToPresentation({
          world: object.targetPosition,
        });
  const depthRole =
    object.depthRole ??
    mapVisualGrammarRoleToPresentationDepthRole(
      object.visualGrammarRole ?? (object.focused ? "primary" : "related"),
    );
  const region = mapVisualGrammarRoleToPresentationRegion(
    object.visualGrammarRole,
  );
  const composition = resolveExecutivePresentationCompositionContract({
    objectId: object.id,
    presentationPosition,
    compositionScale: object.scale,
    objectKind: object.kind,
    layoutRole: layoutRoleFromGrammar(object.visualGrammarRole, object.focused),
    visibility: object.disclosureState === "hidden" ? "hidden" : "visible",
    prominence: prominenceFromGrammar(object.visualGrammarRole),
    depthRole,
    region,
    plane,
  });
  const world = mapExecutive2DPositionToRenderWorld({
    position: composition.presentationPosition,
    plane,
  });
  const renderedScale = resolveExecutivePresentationEffectiveRenderedScale(
    object.scale,
    { focused: object.focused },
  );
  return Object.freeze({
    ...object,
    targetPosition: worldTupleFromPresentationWorld(world),
    // Keep overviewPosition aligned — never leave a competing pre-2D seed.
    overviewPosition: worldTupleFromPresentationWorld(world),
    scale: renderedScale,
    compositionMode: EXECUTIVE_STAGE_COMPOSITION_MODE_DEFAULT,
    presentationPosition: composition.presentationPosition,
    depthRole: composition.depthRole,
    presentationRegion: composition.region,
    presentationComposition: composition,
  });
}

function enrichContext(
  node: NexoraMVPContextNodePresentation,
  plane = createExecutivePresentationPlane(),
): NexoraMVPContextNodePresentation {
  const roleHint =
    node.role === "collapsed-thread"
      ? "collapsed-thread"
      : node.kind === "executive-thread"
        ? "executive-thread"
        : node.role;
  const depthRole = mapVisualGrammarRoleToPresentationDepthRole(roleHint);
  const isGateway =
    node.role === "collapsed-thread" && node.gatewayMode != null;
  // STAGE-THREAD:1-FIX — gateway uses authoritative NE-preferred world seed;
  // clamp to full presentation plane (not legacy bottom thread band).
  const region = isGateway
    ? ("background-context" as const)
    : mapVisualGrammarRoleToPresentationRegion(roleHint);
  const regions = resolveExecutivePresentationRegions(plane);
  const threadRegion = regions.find((entry) => entry.id === "executive-thread");
  const presentationPosition =
    isGateway
      ? mapExecutiveWorldPositionToPresentation({
          world: node.targetPosition,
        })
      : region === "executive-thread" && threadRegion != null
        ? resolveExecutivePresentationRegionCenter(threadRegion)
        : mapExecutiveWorldPositionToPresentation({
            world: node.targetPosition,
          });
  const composition = resolveExecutivePresentationCompositionContract({
    objectId: node.id,
    presentationPosition,
    compositionScale: node.scale,
    objectKind: node.kind === "executive-thread" ? "insight" : node.kind,
    layoutRole: layoutRoleFromGrammar(roleHint, false),
    visibility: node.disclosureState === "hidden" ? "hidden" : "visible",
    prominence: prominenceFromGrammar(roleHint, node.gatewayMode),
    depthRole,
    region,
    plane,
  });
  const world = mapExecutive2DPositionToRenderWorld({
    position: composition.presentationPosition,
    plane,
  });
  return Object.freeze({
    ...node,
    // Preserve semantic z = 0 for gateway; world map may carry appearance z.
    targetPosition: isGateway
      ? Object.freeze([world.x, world.y, 0] as const)
      : worldTupleFromPresentationWorld(world),
    compositionMode: EXECUTIVE_STAGE_COMPOSITION_MODE_DEFAULT,
    presentationPosition: composition.presentationPosition,
    depthRole: composition.depthRole,
    presentationRegion: composition.region,
    presentationComposition: composition,
  });
}

/**
 * Keep Executive Thread territory outside Business Network / focus center.
 * 2D region correction only — never Z.
 */
function resolveExecutiveThreadTerritoryOwnership(
  objects: readonly NexoraMVPStageObjectPresentation[],
  contextNodes: readonly NexoraMVPContextNodePresentation[],
  plane = createExecutivePresentationPlane(),
): readonly NexoraMVPContextNodePresentation[] {
  const regions = resolveExecutivePresentationRegions(plane);
  const threadRegion = regions.find((entry) => entry.id === "executive-thread");
  if (threadRegion == null) return contextNodes;

  const focusCenter = resolveExecutivePresentationFocusCenter(plane);
  const focusClear = resolveExecutivePresentationCompositionContract({
    objectId: "__focus-clear-zone__",
    presentationPosition: focusCenter,
    compositionScale: 1.15,
    objectKind: "object",
    layoutRole: "focus",
    region: "business-network",
    plane,
  }).territory;

  const businessTerritories = objects
    .filter((object) => object.disclosureState !== "hidden")
    .map((object) => object.presentationComposition?.territory)
    .filter((territory): territory is NonNullable<typeof territory> =>
      territory != null,
    );

  return Object.freeze(
    contextNodes.map((node) => {
      if (!isExecutiveThreadContext(node)) return node;
      // STAGE-THREAD:1-FIX — gateway placement is authoritative (NE sectors);
      // do not pull it into the legacy bottom thread band.
      if (node.gatewayMode != null) return node;
      const composition = node.presentationComposition;
      if (composition == null) return node;

      let next = resolveExecutivePresentationCompositionContract({
        objectId: node.id,
        presentationPosition: composition.presentationPosition,
        compositionScale: node.scale,
        objectKind: node.kind === "executive-thread" ? "insight" : node.kind,
        layoutRole: "thread",
        prominence: prominenceFromGrammar(
          node.role === "collapsed-thread"
            ? "collapsed-thread"
            : "executive-thread",
          node.gatewayMode,
        ),
        depthRole: composition.depthRole,
        region: "executive-thread",
        plane,
      });

      const conflicts = () =>
        executivePresentationTerritoriesIntersect(next.territory, focusClear) ||
        businessTerritories.some((territory) =>
          executivePresentationTerritoriesIntersect(next.territory, territory),
        );

      // Prefer region center, then step downward within the thread band.
      if (conflicts()) {
        const candidates = [
          resolveExecutivePresentationRegionCenter(threadRegion),
          createExecutivePresentationPosition(
            threadRegion.minX + (threadRegion.maxX - threadRegion.minX) * 0.5,
            threadRegion.minY + 0.08,
          ),
          createExecutivePresentationPosition(
            threadRegion.minX + (threadRegion.maxX - threadRegion.minX) * 0.28,
            threadRegion.minY + 0.08,
          ),
          createExecutivePresentationPosition(
            threadRegion.minX + (threadRegion.maxX - threadRegion.minX) * 0.72,
            threadRegion.minY + 0.08,
          ),
        ];
        for (const candidate of candidates) {
          const clamped = clampExecutivePresentationPositionToRegion(
            candidate,
            threadRegion,
          );
          const attempt = resolveExecutivePresentationCompositionContract({
            objectId: node.id,
            presentationPosition: clamped,
            compositionScale: node.scale,
            objectKind:
              node.kind === "executive-thread" ? "insight" : node.kind,
            layoutRole: "thread",
            prominence: prominenceFromGrammar(
              node.role === "collapsed-thread"
                ? "collapsed-thread"
                : "executive-thread",
            ),
            depthRole: composition.depthRole,
            region: "executive-thread",
            plane,
          });
          next = attempt;
          if (!conflicts()) break;
        }
      }

      // Final hard clamp into thread region (never leave via Z).
      const center = clampExecutivePresentationPositionToRegion(
        next.presentationPosition,
        threadRegion,
      );
      next = resolveExecutivePresentationCompositionContract({
        objectId: node.id,
        presentationPosition: center,
        compositionScale: node.scale,
        objectKind: node.kind === "executive-thread" ? "insight" : node.kind,
        layoutRole: "thread",
        prominence: prominenceFromGrammar(
          node.role === "collapsed-thread"
            ? "collapsed-thread"
            : "executive-thread",
        ),
        depthRole: composition.depthRole,
        region: "executive-thread",
        plane,
      });

      const world = mapExecutive2DPositionToRenderWorld({
        position: next.presentationPosition,
        plane,
      });
      return Object.freeze({
        ...node,
        targetPosition: worldTupleFromPresentationWorld(world),
        presentationPosition: next.presentationPosition,
        depthRole: next.depthRole,
        presentationRegion: next.region,
        presentationComposition: next,
      });
    }),
  );
}

/**
 * Apply SP:4.2 presentation-plane authority after SP:4.1C grammar.
 * Under spatial-3d mode this is a no-op (compatibility).
 */
export function applyExecutivePresentationPlaneToStagePresentation(
  presentation: NexoraMVPStageInteractionPresentation,
  options?: {
    readonly compositionMode?: ExecutiveStageCompositionMode;
  },
): NexoraMVPStageInteractionPresentation {
  const mode = resolveMode(options?.compositionMode);
  if (mode === EXECUTIVE_STAGE_COMPOSITION_MODE_LEGACY) {
    return presentation;
  }

  const plane = createExecutivePresentationPlane();
  const objects = Object.freeze(
    presentation.scene.objects.map((object) => enrichObject(object, plane)),
  );
  const enrichedContext = Object.freeze(
    presentation.contextNodes.map((node) => enrichContext(node, plane)),
  );
  const contextNodes = resolveExecutiveThreadTerritoryOwnership(
    objects,
    enrichedContext,
    plane,
  );

  // Connection IDs preserved; endpoints continue to read mapped targetPosition
  // at render time from objects/context — no invented relationships.
  return Object.freeze({
    ...presentation,
    contextNodes,
    scene: Object.freeze({
      ...presentation.scene,
      objects,
      compositionMode: mode,
    }),
  });
}

export function getExecutiveStageCompositionMode(
  presentation: NexoraMVPStageInteractionPresentation,
): ExecutiveStageCompositionMode {
  const sceneMode = (
    presentation.scene as {
      readonly compositionMode?: ExecutiveStageCompositionMode;
    }
  ).compositionMode;
  return sceneMode ?? EXECUTIVE_STAGE_COMPOSITION_MODE_DEFAULT;
}
