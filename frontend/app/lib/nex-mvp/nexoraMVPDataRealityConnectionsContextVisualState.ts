/**
 * NEX-MVP consumer of P2:8.4 Connections & Context Visual Validation.
 *
 * Applies restrained connection/context presentation on top of P2:7 reveal.
 * Does not invent edges, expand reveal depth, or rewrite severity/focus.
 */

import type { DataRealityAwareConnectionsContextResult } from "@/app/lib/data-reality/dataRealityAwareConnectionsContext";
import {
  extractObservedConnectionsContextVisualEvidence,
  resolveDataRealityConnectionVisualState,
  resolveDataRealityConnectionVisualStatesFromContext,
  resolveDataRealityContextVisualStatesFromContext,
  validateConnectionsContextVisual,
  type ConnectionsContextVisualValidationResult,
  type DataRealityConnectionVisualState,
} from "@/app/lib/data-reality/dataRealityConnectionsContextVisualValidation";
import type {
  NexoraMVPStageConnectionPresentation,
  NexoraMVPStageConnectionVisualRole,
} from "@/app/lib/nex-mvp/nexora3DExecutiveStage";
import type { NexoraMVPStageInteractionPresentation } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction";

export const nexoraMVPDataRealityConnectionsContextVisualStateIdentity =
  "NEX-MVP/P2:8.4/DataRealityConnectionsContextVisualValidationConsumer" as const;

export const NEXORA_MVP_DATA_REALITY_CONNECTIONS_CONTEXT_VISUAL_STATE_BOUNDARY =
  Object.freeze({
    consumesP27ConnectionsContext: true as const,
    consumesP284ConnectionsContextVisualValidation: true as const,
    inventsRelationships: false as const,
    infersCausality: false as const,
    expandsRevealDepth: false as const,
    redesignsStageAesthetics: false as const,
    lowLevelMeshesMayImport: false as const,
  });

function applyConnectionVisual(
  connection: NexoraMVPStageConnectionPresentation,
  visual: DataRealityConnectionVisualState,
): NexoraMVPStageConnectionPresentation {
  return Object.freeze({
    ...connection,
    sourceId: visual.sourceId,
    targetId: visual.targetId,
    // Context connectors are locally relevant but not Stage-object incident edges.
    emphasized:
      visual.emphasis === "foreground" || visual.role === "context",
    opacity: visual.opacity,
    relation: visual.relation,
    visualRole: visual.role as NexoraMVPStageConnectionVisualRole,
    directionCue: visual.directionCue,
    lineWidth: visual.width,
    impliesCausality: false as const,
  });
}

/**
 * Apply P2:8.4 connection/context visual validation onto Stage presentation.
 * Preserves connection identity set; never invents edges.
 */
export function applyDataRealityConnectionsContextVisualStateToStagePresentation(
  presentation: NexoraMVPStageInteractionPresentation,
  connectionsContext: DataRealityAwareConnectionsContextResult,
): NexoraMVPStageInteractionPresentation {
  const connectionVisuals = resolveDataRealityConnectionVisualStatesFromContext(
    connectionsContext,
  );
  const byId = new Map(
    connectionVisuals.map((entry) => [entry.connectionId, entry]),
  );
  const contextVisuals = resolveDataRealityContextVisualStatesFromContext(
    connectionsContext,
  );
  const contextById = new Map(
    contextVisuals.map((entry) => [entry.contextId, entry]),
  );
  const revealedContextIds = new Set(
    contextVisuals
      .filter((entry) => entry.revealRole === "direct-context")
      .map((entry) => entry.contextId),
  );
  const hiddenContextIds = new Set(
    contextVisuals
      .filter((entry) => entry.revealRole === "hidden")
      .map((entry) => entry.contextId),
  );

  const connections = Object.freeze(
    presentation.scene.connections.map((connection) => {
      const visual = byId.get(connection.id);
      if (!visual) {
        // Unknown edge stays subdued; never invents foreground styling.
        return Object.freeze({
          ...connection,
          emphasized: false,
          opacity: Math.min(connection.opacity, 0.22),
          visualRole: "background" as const,
          directionCue: "none" as const,
          lineWidth: 1,
          impliesCausality: false as const,
          relation: connection.relation ?? "related",
        });
      }
      return applyConnectionVisual(connection, visual);
    }),
  );

  const contextConnections = Object.freeze(
    presentation.contextConnections.map((connection) => {
      const involvesRevealed =
        revealedContextIds.has(connection.sourceId) ||
        revealedContextIds.has(connection.targetId);
      const involvesHidden =
        hiddenContextIds.has(connection.sourceId) ||
        hiddenContextIds.has(connection.targetId);
      const visual = resolveDataRealityConnectionVisualState({
        connectionId: connection.id,
        sourceId: connection.sourceId,
        targetId: connection.targetId,
        relation: connection.relation ?? "related",
        isContextConnector: true,
        isRevealed: involvesRevealed && !involvesHidden,
        anchorObjectId: connectionsContext.anchorObjectId,
      });
      return applyConnectionVisual(connection, visual);
    }),
  );

  const contextNodes = Object.freeze(
    presentation.contextNodes.map((node) => {
      if (connectionsContext.anchorObjectId === undefined) {
        return node;
      }
      const visual =
        contextById.get(node.id) ??
        contextById.get(node.subjectId);
      if (visual?.revealRole === "direct-context") {
        return Object.freeze({
          ...node,
          // Subordinate to peer Stage objects — avoid peer confusion.
          opacity: Math.max(visual.opacity, 0.88),
          scale: Math.min(Math.max(visual.scale, 0.66), 0.72),
        });
      }
      if (visual?.revealRole === "hidden" || hiddenContextIds.has(node.id)) {
        return Object.freeze({
          ...node,
          opacity: Math.min(node.opacity, 0.1),
          scale: Math.min(node.scale, 0.62),
        });
      }
      return Object.freeze({
        ...node,
        opacity: Math.min(node.opacity, 0.18),
        scale: Math.min(node.scale, 0.7),
      });
    }),
  );

  return Object.freeze({
    ...presentation,
    scene: Object.freeze({
      ...presentation.scene,
      connections,
    }),
    contextConnections,
    contextNodes,
    emphasizedRelationshipIds: Object.freeze(
      connections
        .filter((entry) => entry.emphasized)
        .map((entry) => entry.id),
    ),
  });
}

export type ResolveNexoraMVPConnectionsContextVisualValidationInput = {
  readonly scenario: string;
  readonly presentation: NexoraMVPStageInteractionPresentation;
  readonly connectionsContext: DataRealityAwareConnectionsContextResult;
};

export type NexoraMVPConnectionsContextVisualValidationBundle = {
  readonly presentation: NexoraMVPStageInteractionPresentation;
  readonly validation: ConnectionsContextVisualValidationResult;
};

export function resolveNexoraMVPConnectionsContextVisualValidation(
  input: ResolveNexoraMVPConnectionsContextVisualValidationInput,
): NexoraMVPConnectionsContextVisualValidationBundle {
  const presentation =
    applyDataRealityConnectionsContextVisualStateToStagePresentation(
      input.presentation,
      input.connectionsContext,
    );
  const connectionVisualStates =
    resolveDataRealityConnectionVisualStatesFromContext(
      input.connectionsContext,
    );
  const contextVisualStates = resolveDataRealityContextVisualStatesFromContext(
    input.connectionsContext,
  );
  const observed =
    extractObservedConnectionsContextVisualEvidence(presentation);
  const validation = validateConnectionsContextVisual({
    scenario: input.scenario,
    connectionsContext: input.connectionsContext,
    connectionVisualStates,
    contextVisualStates,
    observed,
  });
  return Object.freeze({ presentation, validation });
}
