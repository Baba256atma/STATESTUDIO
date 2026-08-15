/**
 * NEX-MVP consumer of P2:8.1 Visual Stage Audit.
 *
 * Wires certified fixtures through the existing P2:2→P2:7 chain, derives Stage
 * presentation evidence, and runs the Visual Reality Audit.
 *
 * Shell may import this module. Low-level meshes must not resolve the audit.
 */

import {
  auditDataRealityVisualStage,
  extractObservedStageEvidenceFromPresentation,
  type DataRealityVisualStageAuditResult,
} from "@/app/lib/data-reality/dataRealityVisualStageAudit";
import { resolveDataRealityAwareFocusAttentionExperience } from "@/app/lib/data-reality/dataRealityAwareFocusAttentionExperience";
import { resolveDataRealityAwareSceneChoreography } from "@/app/lib/data-reality/dataRealityAwareSceneChoreography";
import { resolveDataRealityAwareConnectionsContext } from "@/app/lib/data-reality/dataRealityAwareConnectionsContext";
import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  resetNexoraMVPObjectInteractionOverview,
  selectNexoraMVPInteractionSubject,
  type NexoraMVPStageInteractionPresentation,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction";
import { resolveNexoraMVPDataRealityAwareStageExperience } from "@/app/lib/nex-mvp/nexoraMVPDataRealityAwareStageExperience";
import { applyDataRealityAwareSceneChoreographyToStagePresentation } from "@/app/lib/nex-mvp/nexoraMVPDataRealityAwareSceneChoreography";
import { applyDataRealityAwareConnectionsContextToStagePresentation } from "@/app/lib/nex-mvp/nexoraMVPDataRealityAwareConnectionsContext";
import { applyDataRealityObjectVisualStateToStagePresentationWithRetention } from "@/app/lib/nex-mvp/nexoraMVPDataRealityObjectVisualState";
import { applyDataRealityFocusSceneChoreographyToStagePresentation } from "@/app/lib/nex-mvp/nexoraMVPDataRealityFocusSceneChoreography";
import { applyDataRealityConnectionsContextVisualStateToStagePresentation } from "@/app/lib/nex-mvp/nexoraMVPDataRealityConnectionsContextVisualState";
import { applyDataRealityExecutiveReadabilityToStagePresentation } from "@/app/lib/nex-mvp/nexoraMVPDataRealityExecutiveReadability";
import { applyExecutiveFocusVisualGrammarToStagePresentation } from "@/app/lib/nex-mvp/nexoraMVPExecutiveFocusVisualGrammar";
import { applyExecutiveNetworkTopologyToStagePresentation } from "@/app/lib/nex-mvp/nexoraMVPExecutiveNetworkTopology";
import { applyExecutivePresentationPlaneToStagePresentation } from "@/app/lib/nex-mvp/nexoraMVPExecutivePresentationPlane";
import type { NexoraMVPDataRealityDatasetScenario } from "@/app/lib/nex-mvp/nexoraMVPDataRealityStageBridge";

export const nexoraMVPDataRealityVisualStageAuditIdentity =
  "NEX-MVP/P2:8.1/DataRealityVisualStageAuditConsumer" as const;

export const NEXORA_MVP_DATA_REALITY_VISUAL_STAGE_AUDIT_BOUNDARY =
  Object.freeze({
    consumesP23StageBinding: true as const,
    consumesP25FocusAttention: true as const,
    consumesP26Choreography: true as const,
    consumesP27ConnectionsContext: true as const,
    consumesP281VisualStageAudit: true as const,
    inventsRelationships: false as const,
    redesignsStageVisuals: false as const,
    certifiesHumanVisualPerception: false as const,
    lowLevelMeshesMayImport: false as const,
  });

export type ResolveNexoraMVPDataRealityVisualStageAuditInput = {
  readonly datasetScenario?: NexoraMVPDataRealityDatasetScenario;
  readonly focusedObjectId?: string | null;
  readonly selectedObjectId?: string | null;
  readonly presentationState?: "minimum" | "report" | "operation";
};

export type NexoraMVPDataRealityVisualStageAuditBundle = {
  readonly scenario: NexoraMVPDataRealityDatasetScenario;
  readonly presentation: NexoraMVPStageInteractionPresentation;
  readonly audit: DataRealityVisualStageAuditResult;
};

/**
 * Resolve the live P2 chain for a certified fixture scenario and audit Stage
 * structural presentation evidence.
 */
export function resolveNexoraMVPDataRealityVisualStageAudit(
  input: ResolveNexoraMVPDataRealityVisualStageAuditInput = {},
): NexoraMVPDataRealityVisualStageAuditBundle {
  const scenario = input.datasetScenario ?? "baseline";
  const presentationState = input.presentationState ?? "report";
  const selectedObjectId = input.selectedObjectId ?? null;
  const focusedObjectId =
    input.focusedObjectId === undefined
      ? selectedObjectId
      : input.focusedObjectId;

  const experience = resolveNexoraMVPDataRealityAwareStageExperience({
    datasetScenario: scenario,
    ...(focusedObjectId ? { focusedObjectId } : {}),
    ...(selectedObjectId ? { selectedObjectId } : {}),
    presentationState,
    requestedIntent: "investigate",
  });

  const focusAttention = resolveDataRealityAwareFocusAttentionExperience({
    runtimeState: experience.runtimeState,
    ...(focusedObjectId ? { focusedObjectId } : {}),
    ...(selectedObjectId ? { selectedObjectId } : {}),
    presentationState,
  });

  const stageObjects = experience.catalog.objects.map((entry) =>
    Object.freeze({ objectId: entry.id }),
  );
  const relationships = experience.catalog.relationships.map((entry) =>
    Object.freeze({
      id: entry.id,
      sourceId: entry.sourceId,
      targetId: entry.targetId,
    }),
  );
  const contextLinks = experience.catalog.contextLinks.map((entry) =>
    Object.freeze({
      id: entry.id,
      objectId: entry.objectId,
      contextId: entry.contextId,
      relation: entry.relation,
    }),
  );
  const contextSubjects = experience.catalog.contextSubjects.map((entry) =>
    Object.freeze({
      id: entry.id,
      kind: entry.kind,
      label: entry.label,
    }),
  );

  const choreography = resolveDataRealityAwareSceneChoreography({
    focusAttention,
    stageObjects,
    relationships,
    presentationState,
  });

  const connectionsContext = resolveDataRealityAwareConnectionsContext({
    choreography,
    relationships,
    contextLinks,
    contextSubjects,
    presentationState,
  });

  let interaction = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState,
    environmentIntent: "neutral",
  });
  if (selectedObjectId) {
    interaction = selectNexoraMVPInteractionSubject(
      interaction,
      selectedObjectId,
      experience.catalog,
    );
  } else {
    interaction = resetNexoraMVPObjectInteractionOverview(interaction);
  }

  const basePresentation = deriveNexoraMVPStageInteractionPresentation(
    interaction,
    experience.catalog,
  );
  const withChoreography =
    applyDataRealityAwareSceneChoreographyToStagePresentation(
      basePresentation,
      choreography,
    );
  const withConnections =
    applyDataRealityAwareConnectionsContextToStagePresentation(
      withChoreography,
      connectionsContext,
    );
  const withObjectVisual =
    applyDataRealityObjectVisualStateToStagePresentationWithRetention(
      withConnections,
      choreography.attentionRetention.objectIds,
    );
  const presentationWithFocus =
    applyDataRealityFocusSceneChoreographyToStagePresentation(
      withObjectVisual,
      choreography,
    );
  const presentationWithConnections =
    applyDataRealityConnectionsContextVisualStateToStagePresentation(
      presentationWithFocus,
      connectionsContext,
    );
  const presentationWithReadability =
    applyDataRealityExecutiveReadabilityToStagePresentation(
      presentationWithConnections,
    );
  const presentation = applyExecutiveFocusVisualGrammarToStagePresentation(
    presentationWithReadability,
  );
  const withNetwork =
    applyExecutiveNetworkTopologyToStagePresentation(presentation);
  const withPlane =
    applyExecutivePresentationPlaneToStagePresentation(withNetwork);

  const observed = extractObservedStageEvidenceFromPresentation(withPlane);
  const audit = auditDataRealityVisualStage({
    scenario,
    interactionMode: presentation.scene.mode,
    stageBinding: experience.stageBinding,
    focusAttention,
    choreography,
    connectionsContext,
    observed,
    canonicalRelationships: relationships,
  });

  return Object.freeze({
    scenario,
    presentation,
    audit,
  });
}
