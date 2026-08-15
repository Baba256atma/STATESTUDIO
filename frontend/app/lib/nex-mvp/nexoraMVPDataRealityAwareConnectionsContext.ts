/**
 * NEX-MVP consumer of P2:7 Connections & Context Reveal.
 *
 * Applies semantic connection/context reveal onto existing Stage presentation
 * connection emphasized/opacity fields. Does not invent edges, move camera,
 * or reposition geometry.
 *
 * Shell may import this module. Low-level Stage meshes must not resolve P2:7.
 */

import {
  resolveDataRealityAwareConnectionsContext,
  type DataRealityAwareConnectionsContextResult,
  type DataRealityAwareContextLinkDescriptor,
  type DataRealityAwareContextSubjectDescriptor,
  type DataRealityAwareRelationshipDescriptor,
} from "@/app/lib/data-reality/dataRealityAwareConnectionsContext";
import type { DataRealityAwareSceneChoreographyResult } from "@/app/lib/data-reality/dataRealityAwareSceneChoreography";
import type { NexoraMVPStageConnectionPresentation } from "@/app/lib/nex-mvp/nexora3DExecutiveStage";
import type { NexoraMVPStageInteractionPresentation } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction";

export const nexoraMVPDataRealityAwareConnectionsContextIdentity =
  "NEX-MVP/P2:7/DataRealityAwareConnectionsContextConsumer" as const;

export const NEXORA_MVP_DATA_REALITY_AWARE_CONNECTIONS_CONTEXT_BOUNDARY =
  Object.freeze({
    consumesP26Choreography: true as const,
    consumesP27ConnectionsContext: true as const,
    inventsRelationships: false as const,
    infersCausality: false as const,
    ownsCameraChoreography: false as const,
    repositionsGeometry: false as const,
    exposesThreeJsObjects: false as const,
  });

export type ResolveNexoraMVPDataRealityAwareConnectionsContextInput = {
  readonly choreography: DataRealityAwareSceneChoreographyResult;
  readonly relationships: readonly DataRealityAwareRelationshipDescriptor[];
  readonly contextLinks?: readonly DataRealityAwareContextLinkDescriptor[];
  readonly contextSubjects?: readonly DataRealityAwareContextSubjectDescriptor[];
  readonly presentationState?: string;
  readonly workspace?: string;
  readonly mode?: string;
};

export type NexoraMVPDataRealityAwareConnectionsContextResult = {
  readonly connectionsContext: DataRealityAwareConnectionsContextResult;
};

/**
 * Resolve P2:7 from pre-resolved P2:6 choreography + canonical graph.
 */
export function resolveNexoraMVPDataRealityAwareConnectionsContext(
  input: ResolveNexoraMVPDataRealityAwareConnectionsContextInput,
): NexoraMVPDataRealityAwareConnectionsContextResult {
  const connectionsContext = resolveDataRealityAwareConnectionsContext({
    choreography: input.choreography,
    relationships: input.relationships,
    ...(input.contextLinks !== undefined
      ? { contextLinks: input.contextLinks }
      : {}),
    ...(input.contextSubjects !== undefined
      ? { contextSubjects: input.contextSubjects }
      : {}),
    ...(input.presentationState !== undefined
      ? { presentationState: input.presentationState }
      : {}),
    ...(input.workspace !== undefined ? { workspace: input.workspace } : {}),
    ...(input.mode !== undefined ? { mode: input.mode } : {}),
  });
  return Object.freeze({ connectionsContext });
}

function applyConnectionSemantics(
  connection: NexoraMVPStageConnectionPresentation,
  connectionsContext: DataRealityAwareConnectionsContextResult,
): NexoraMVPStageConnectionPresentation {
  const plan = connectionsContext.connections.find(
    (entry) => entry.connectionId === connection.id,
  );
  if (!plan) return connection;

  if (connectionsContext.anchorObjectId === undefined) {
    return Object.freeze({
      ...connection,
      emphasized: false,
      // SP:2.8A — overview edges stay subdued (not graph-complete).
      opacity: 0.14,
    });
  }

  switch (plan.emphasis) {
    case "foreground":
      return Object.freeze({
        ...connection,
        emphasized: true,
        opacity: 0.74,
      });
    case "retained-attention":
      return Object.freeze({
        ...connection,
        emphasized: false,
        opacity: Math.max(connection.opacity, 0.16),
      });
    case "background":
      return Object.freeze({
        ...connection,
        emphasized: false,
        opacity: 0.045,
      });
    default:
      return Object.freeze({
        ...connection,
        emphasized: false,
        opacity: 0.14,
      });
  }
}

/**
 * Apply P2:7 connection/context reveal onto Stage presentation.
 * Preserves connection IDs; does not invent edges or move geometry.
 */
export function applyDataRealityAwareConnectionsContextToStagePresentation(
  presentation: NexoraMVPStageInteractionPresentation,
  connectionsContext: DataRealityAwareConnectionsContextResult,
): NexoraMVPStageInteractionPresentation {
  const revealedContextIds = new Set(
    connectionsContext.contextItems
      .filter((entry) => entry.revealRole === "direct-context")
      .map((entry) => entry.contextId),
  );
  const hiddenContextIds = new Set(
    connectionsContext.contextItems
      .filter((entry) => entry.revealRole === "hidden")
      .map((entry) => entry.contextId),
  );

  const connections = Object.freeze(
    presentation.scene.connections.map((connection) =>
      applyConnectionSemantics(connection, connectionsContext),
    ),
  );

  const contextConnections = Object.freeze(
    presentation.contextConnections.map((connection) => {
      if (connectionsContext.anchorObjectId === undefined) {
        return Object.freeze({
          ...connection,
          emphasized: false,
          opacity: Math.min(connection.opacity, 0.14),
        });
      }
      // Context connections use synthetic or fixture ids; emphasize when the
      // context end is a revealed direct-context item for the anchor.
      const involvesRevealedContext =
        revealedContextIds.has(connection.sourceId) ||
        revealedContextIds.has(connection.targetId);
      const involvesHiddenContext =
        hiddenContextIds.has(connection.sourceId) ||
        hiddenContextIds.has(connection.targetId);
      if (involvesRevealedContext) {
        return Object.freeze({
          ...connection,
          emphasized: true,
          opacity: 0.55,
        });
      }
      if (involvesHiddenContext) {
        return Object.freeze({
          ...connection,
          emphasized: false,
          opacity: 0.04,
        });
      }
      return Object.freeze({
        ...connection,
        emphasized: false,
        opacity: 0.045,
      });
    }),
  );

  const contextNodes = Object.freeze(
    presentation.contextNodes.map((node) => {
      if (connectionsContext.anchorObjectId === undefined) {
        return node;
      }
      if (revealedContextIds.has(node.id)) {
        return Object.freeze({
          ...node,
          opacity: Math.max(node.opacity, 0.88),
          scale: Math.max(node.scale, 0.95),
        });
      }
      if (hiddenContextIds.has(node.id)) {
        return Object.freeze({
          ...node,
          opacity: Math.min(node.opacity, 0.12),
          scale: Math.min(node.scale, 0.7),
        });
      }
      // Context nodes not linked to current anchor stay subdued.
      return Object.freeze({
        ...node,
        opacity: Math.min(node.opacity, 0.2),
      });
    }),
  );

  const emphasizedRelationshipIds = Object.freeze(
    Array.from(
      new Set([
        ...connectionsContext.revealedConnectionIds,
        ...contextConnections
          .filter((entry) => entry.emphasized)
          .map((entry) => entry.id),
      ]),
    ),
  );

  return Object.freeze({
    ...presentation,
    scene: Object.freeze({
      ...presentation.scene,
      connections,
    }),
    contextConnections,
    contextNodes,
    emphasizedRelationshipIds,
  });
}
