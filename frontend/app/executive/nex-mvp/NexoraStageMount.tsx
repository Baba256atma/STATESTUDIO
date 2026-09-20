"use client";

import type { NexoraMVPPresentationState } from "@/app/lib/nex-mvp/nexoraMVPApplicationFoundation";
import type {
  NexoraMVPAdvisorContextBridge,
  NexoraMVPStageInteractionPresentation,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction";
import type {
  NexoraMVPPresentationAvailableAction,
  NexoraMVPPresentationViewModel,
} from "@/app/lib/nex-mvp/nexoraMVPPresentationState";
import type { NexoraMVPSceneEnvironmentVisualState } from "@/app/lib/nex-mvp/nexoraMVPWorkspacePresentation";
import type { ExecutiveQueueCategory } from "@/app/lib/spatial-presentation/executiveStageProductivityContract";
import type { NexoraDecisionTheatreIconicObject } from "@/app/lib/decision-theatre/nexoraDecisionTheatreIconicProjection.ts";
import type { NexoraDecisionTheatreParticipantVisualPresentation } from "@/app/lib/decision-theatre/nexoraDecisionTheatreVisualProjection.ts";
import type { NexoraDecisionTheatreAtmosphereProjection } from "@/app/lib/decision-theatre/nexoraDecisionTheatreAtmosphere.ts";
import type { NexoraDecisionTheatreDataObjectStageProjection } from "@/app/lib/decision-theatre/nexoraDecisionTheatreDataObjectStageProjection.ts";
import type { NexoraDecisionTheatreObjectInvestigation } from "@/app/lib/decision-theatre/nexoraDecisionTheatreObjectInvestigation.ts";
import type { NexoraDecisionTheatreInvestigationLevel } from "@/app/lib/decision-theatre/nexoraDecisionTheatreObjectInvestigation.ts";
import type { NexoraDecisionTheatreDecisionComparison } from "@/app/lib/decision-theatre/nexoraDecisionTheatreDecisionComparison.ts";
import type { NexoraDecisionTheatreComparisonLevel } from "@/app/lib/decision-theatre/nexoraDecisionTheatreDecisionComparison.ts";
import { resolveNexoraDecisionTheatreAtmosphereSwatch } from "@/app/lib/decision-theatre/nexoraDecisionTheatreAtmosphereRendererTokens.ts";
import { Nexora3DExecutiveStage } from "./stage/Nexora3DExecutiveStage";
import type { ManagementMap } from "@/app/lib/nmi/nmiManagementMapContract.ts";
import type { NexoraExecutiveQueueOverlayMapNode } from "./stage/NexoraExecutiveQueueOverlay";
import { NexoraDecisionTheatreInvestigationSurface } from "./stage/NexoraDecisionTheatreInvestigationSurface";
import { NexoraDecisionTheatreComparisonSurface } from "./stage/NexoraDecisionTheatreComparisonSurface";
import { NexoraDecisionTheatreCommitmentSurface } from "./stage/NexoraDecisionTheatreCommitmentSurface";
import type { NexoraDecisionTheatreDecisionCommitment } from "@/app/lib/decision-theatre/nexoraDecisionTheatreDecisionCommitment.ts";
import type { NexoraDecisionTheatreFoundation } from "@/app/lib/decision-theatre/nexoraDecisionTheatreContract.ts";
import type { NexoraVisualView } from "@/app/lib/director/nexoraVisualIntelligence.ts";
import type { NexoraDecisionTheatreExecutionReadiness } from "@/app/lib/decision-theatre/nexoraDecisionTheatreExecutionReadiness.ts";
import { NexoraDecisionTheatreExecutionReadinessSurface } from "./stage/NexoraDecisionTheatreExecutionReadinessSurface";
import type { NexoraDecisionTheatreLiveExecution } from "@/app/lib/decision-theatre/nexoraDecisionTheatreLiveExecution.ts";
import { NexoraDecisionTheatreLiveExecutionSurface } from "./stage/NexoraDecisionTheatreLiveExecutionSurface";
import type { NexoraDecisionTheatreOutcomeObservation } from "@/app/lib/decision-theatre/nexoraDecisionTheatreOutcomeObservation.ts";
import { NexoraDecisionTheatreOutcomeObservationSurface } from "./stage/NexoraDecisionTheatreOutcomeObservationSurface";
import type { NexoraDecisionTheatreLearningReassessment } from "@/app/lib/decision-theatre/nexoraDecisionTheatreLearningReassessment.ts";
import { NexoraDecisionTheatreLearningReassessmentSurface } from "./stage/NexoraDecisionTheatreLearningReassessmentSurface";
import { NexoraStageDataObjectInspection } from "./stage/NexoraStageDataObjectInspection";
import {
  projectStageProdDirectorComposition,
  projectStageProdLiveFoundation,
  projectStageProdInteractiveDisclosure,
  type StageProdLiveFoundationProjection,
} from "@/app/lib/stage-prod/stageProdPublicIndex";

type Props = {
  readonly liveFoundation?: StageProdLiveFoundationProjection | null;
  readonly workspaceLabel: string;
  readonly interaction: NexoraMVPStageInteractionPresentation;
  readonly environment: NexoraMVPSceneEnvironmentVisualState;
  readonly presentationViewModel: NexoraMVPPresentationViewModel;
  readonly advisorBridge: NexoraMVPAdvisorContextBridge;
  readonly onSelectSubject: (subjectId: string | null) => void;
  readonly onSelectQueueCategory?: (
    category: ExecutiveQueueCategory | "changes-since-visit",
  ) => void;
  readonly onStepBack: () => void;
  readonly onStepForward?: () => void;
  readonly onNavigateTrailIndex?: (index: number) => void;
  readonly onOverview: () => void;
  readonly onPresentationStateChange: (
    state: NexoraMVPPresentationState,
  ) => void;
  readonly onPresentationAction: (
    action: NexoraMVPPresentationAvailableAction,
  ) => void;
  readonly iconicObjects?: readonly NexoraDecisionTheatreIconicObject[];
  readonly visualPresentations?: Readonly<
    Record<string, NexoraDecisionTheatreParticipantVisualPresentation>
  >;
  readonly visualGrammarVersion?: string;
  readonly visualClaimCount?: number;
  readonly warRoomAtmosphere?: NexoraDecisionTheatreAtmosphereProjection | null;
  readonly sceneIntentKind?: string | null;
  readonly sceneScriptId?: string | null;
  readonly theatreComposition?: NexoraDecisionTheatreFoundation | null;
  readonly requestedVisual?: NexoraVisualView | null;
  readonly onDismissVisual?: () => void;
  readonly objectInvestigation?: NexoraDecisionTheatreObjectInvestigation | null;
  readonly investigationVisible?: boolean;
  readonly onInvestigationLevelChange?: (level: NexoraDecisionTheatreInvestigationLevel) => void;
  readonly onCloseInvestigation?: () => void;
  readonly onAskInvestigationQuestion?: (question: string) => void;
  readonly decisionComparison?: NexoraDecisionTheatreDecisionComparison | null;
  readonly onComparisonLevelChange?: (level: NexoraDecisionTheatreComparisonLevel) => void;
  readonly onReviewDecision?: () => void;
  readonly decisionCommitment?: NexoraDecisionTheatreDecisionCommitment | null;
  readonly onCancelDecisionReview?: () => void;
  readonly onChangeDecisionCandidate?: (candidateId: string) => void;
  readonly onCommitDecision?: () => void;
  readonly executionReadiness?: NexoraDecisionTheatreExecutionReadiness | null;
  readonly liveExecution?: NexoraDecisionTheatreLiveExecution | null;
  readonly outcomeObservation?: NexoraDecisionTheatreOutcomeObservation | null;
  readonly learningReassessment?: NexoraDecisionTheatreLearningReassessment | null;
  readonly onRequestStartExecution?: () => void;
  readonly onShowDecisionHistory?: () => void;
  readonly dataObjectStage: NexoraDecisionTheatreDataObjectStageProjection;
  readonly onSelectDataObject: (dataObjectId: string) => void;
  readonly onRemoveDataObjectFromStage: (dataObjectId: string) => void;
  readonly onOpenDataRail: () => void;
  readonly onAskDataObject: (question: string) => void;
  readonly backGuidedAttentionCue?: "SOFT_HALO" | "EMPHASIS" | null;
  readonly nmiManagementMap?: ManagementMap | null;
  readonly nmiMapNodes?: readonly NexoraExecutiveQueueOverlayMapNode[];
};

/**
 * Stage mount boundary — hosts Stage + interaction + presentation depth.
 */
export function NexoraStageMount({
  liveFoundation = null,
  workspaceLabel,
  interaction,
  environment,
  presentationViewModel,
  advisorBridge,
  onSelectSubject,
  onSelectQueueCategory,
  onStepBack,
  onStepForward,
  onNavigateTrailIndex,
  onOverview,
  onPresentationStateChange,
  onPresentationAction,
  iconicObjects = [],
  visualPresentations = {},
  visualGrammarVersion = "1.0.0",
  visualClaimCount = 0,
  warRoomAtmosphere = null,
  sceneIntentKind = null,
  sceneScriptId = null,
  theatreComposition = null,
  requestedVisual = null,
  onDismissVisual,
  objectInvestigation = null,
  investigationVisible = true,
  onInvestigationLevelChange,
  onCloseInvestigation,
  onAskInvestigationQuestion,
  decisionComparison = null,
  onComparisonLevelChange,
  onReviewDecision,
  decisionCommitment = null,
  onCancelDecisionReview,
  onChangeDecisionCandidate,
  onCommitDecision,
  executionReadiness = null,
  liveExecution = null,
  outcomeObservation = null,
  learningReassessment = null,
  onRequestStartExecution,
  onShowDecisionHistory,
  dataObjectStage,
  onSelectDataObject,
  onRemoveDataObjectFromStage,
  onOpenDataRail,
  onAskDataObject,
  backGuidedAttentionCue = null,
  nmiManagementMap = null,
  nmiMapNodes = [],
}: Props) {
  const foundation =
    liveFoundation ??
    projectStageProdLiveFoundation({
      focusedCanonicalObjectId: interaction.focusedSubjectId ?? null,
      conversationalReferentId: advisorBridge.advisorSubjectId ?? null,
    });
  const atmosphereMode = warRoomAtmosphere?.mode ?? "none";
  const atmosphereIntensity = warRoomAtmosphere?.intensity ?? "none";
  const atmosphereTransition = warRoomAtmosphere?.transitionToken ?? "atmosphere-hold";
  const swatch = resolveNexoraDecisionTheatreAtmosphereSwatch(atmosphereMode);
  const selectedCanonicalObjectId =
    interaction.selectedSubjectId ?? interaction.focusedSubjectId ?? null;
  const disclosureComposition = projectStageProdDirectorComposition({
    presentation: interaction,
    theatre: theatreComposition,
  });
  const disclosure = projectStageProdInteractiveDisclosure({
    selectedCanonicalObjectId,
    visibleCanonicalObjectIds: disclosureComposition.canonicalObjectIds,
    investigation: objectInvestigation,
    disclosureVisible: investigationVisible,
  });
  const disclosedInvestigation = disclosure.investigation;
  return (
    <div
      data-testid="nexora-stage-mount"
      data-stage-prod-live={foundation.identity}
      data-stage-prod-status={foundation.status}
      data-stage-prod-host={foundation.host}
      data-stage-prod-degraded={foundation.degraded ? "true" : "false"}
      data-stage-prod-object-id={
        foundation.identities.focusedCanonicalObjectId ?? "none"
      }
      data-stage-prod-scene-intent={
        foundation.identities.theatreSceneIntentKind ?? "none"
      }
      data-stage-prod-director-intent={
        foundation.identities.directorIntent ?? "none"
      }
      data-stage-prod-referent-id={
        foundation.identities.conversationalReferentId ?? "none"
      }
      data-stage-prod-writes="false"
      data-stage-prod-disclosure={disclosure.identity}
      data-stage-prod-disclosure-status={disclosure.status}
      data-stage-prod-disclosed-object-id={
        disclosure.canonicalObjectId ?? "none"
      }
      data-stage-prod-disclosure-writes="false"
      data-stage-prod-disclosure-label-lookup="false"
      data-mvp-surface="stage"
      data-environment-intent={interaction.scene.environmentIntent}
      data-environment-treatment={environment.objectSurfaceTreatment}
      data-presentation-state={interaction.scene.presentationState}
      data-selected-object={interaction.selectedSubjectId ?? "none"}
      data-focused-object={interaction.focusedSubjectId ?? "none"}
      data-interaction-mode={interaction.mode}
      data-theatre-visual-language="executive-and-iconic"
      data-theatre-iconic-count={String(iconicObjects.length)}
      data-nexograph-grammar-version={visualGrammarVersion}
      data-nexograph-supported="true"
      data-nexograph-claim-count={String(visualClaimCount)}
      data-nexograph-atmosphere={atmosphereMode}
      data-nexograph-atmosphere-intensity={atmosphereIntensity}
      data-nexograph-atmosphere-transition={atmosphereTransition}
      data-nexograph-atmosphere-token={swatch.token}
      data-nexograph-legend-visible="false"
      data-theatre-scene-intent={sceneIntentKind ?? "none"}
      data-theatre-scene-script-id={sceneScriptId ?? "none"}
      data-stage-prod-composition-source={
        theatreComposition?.sceneScript.identity ?? "none"
      }
      data-stage-data-object-count={String(dataObjectStage.participants.length)}
      data-stage-data-object-ids={dataObjectStage.diagnostics.dataObjectIds.join(",") || "none"}
      data-stage-data-object-selected={dataObjectStage.diagnostics.selectedDataObjectId ?? "none"}
      data-stage-data-object-director={dataObjectStage.identity}
      data-stage-data-object-relationship-ids={dataObjectStage.diagnostics.relationshipIds.join(",") || "none"}
      data-stage-data-object-business-focus={dataObjectStage.diagnostics.businessFocusId ?? "none"}
      data-stage-data-object-projection-only="true"
      data-theatre-investigation-object-id={objectInvestigation?.objectId ?? "none"}
      data-theatre-investigation-object-type={objectInvestigation?.canonicalObjectType ?? "none"}
      data-theatre-investigation-level={
        objectInvestigation == null
          ? "none"
          : investigationVisible
            ? objectInvestigation.level
            : "closed"
      }
      data-nex-stage-card-role={objectInvestigation?.presentationRole ?? "none"}
      data-nex-stage-card-provenance={objectInvestigation?.catalogProvenance ?? "none"}
      data-nex-stage-card-status-source={objectInvestigation?.statusSource ?? "none"}
      data-nex-stage-card-evidence={objectInvestigation?.evidenceApplicability ?? "none"}
      data-nex-stage-card-relationships={objectInvestigation?.relationshipApplicability ?? "none"}
      data-theatre-comparison-id={decisionComparison?.comparisonId ?? "none"}
      data-theatre-comparison-candidate-count={String(decisionComparison?.candidateIds.length ?? 0)}
      data-theatre-comparison-level={decisionComparison?.level ?? "none"}
      data-theatre-comparison-active-candidate={decisionComparison?.activeCandidateId ?? "none"}
      data-theatre-decision-commitment-id={decisionCommitment?.commitmentId ?? "none"}
      data-theatre-decision-candidate-id={decisionCommitment?.candidateId ?? "none"}
      data-theatre-decision-state={decisionCommitment?.state ?? "none"}
      data-theatre-decision-authoritative-id={decisionCommitment?.authoritativeDecisionId ?? "none"}
      data-theatre-execution-readiness={executionReadiness?.readiness ?? "none"}
      data-theatre-execution-readiness-id={executionReadiness?.readinessId ?? "none"}
      data-theatre-execution-decision-id={
        liveExecution?.decisionId ?? executionReadiness?.decisionId ?? "none"
      }
      data-theatre-execution-id={liveExecution?.executionId ?? executionReadiness?.executionId ?? "none"}
      data-theatre-live-execution-state={liveExecution?.state ?? "none"}
      data-theatre-live-execution-id={liveExecution?.liveExecutionId ?? "none"}
      data-theatre-live-execution-canonical={liveExecution?.canonicalStatus ?? "none"}
      data-theatre-outcome-observation-state={outcomeObservation?.state ?? "none"}
      data-theatre-outcome-observation-id={outcomeObservation?.outcomeObservationId ?? "none"}
      data-theatre-outcome-id={outcomeObservation?.outcomeId ?? "none"}
      data-theatre-outcome-execution-id={outcomeObservation?.executionId ?? "none"}
      data-theatre-learning-state={learningReassessment?.state ?? "none"}
      data-theatre-learning-id={learningReassessment?.learningReassessmentId ?? "none"}
      data-theatre-reassessment-state={learningReassessment?.reassessmentState ?? "none"}
      data-theatre-learning-durable={learningReassessment == null ? "none" : "false"}
      role="region"
      aria-label="Executive Stage"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        minWidth: 0,
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      <Nexora3DExecutiveStage
        workspaceLabel={workspaceLabel}
        interaction={interaction}
        environment={environment}
        presentationViewModel={presentationViewModel}
        advisorBridge={advisorBridge}
        onSelectSubject={onSelectSubject}
        onSelectQueueCategory={onSelectQueueCategory}
        onStepBack={onStepBack}
        onStepForward={onStepForward}
        onNavigateTrailIndex={onNavigateTrailIndex}
        onOverview={onOverview}
        onPresentationStateChange={onPresentationStateChange}
        onPresentationAction={onPresentationAction}
        iconicObjects={iconicObjects}
        visualPresentations={visualPresentations}
        atmosphereMode={atmosphereMode}
        warRoomAtmosphere={warRoomAtmosphere}
        theatreComposition={theatreComposition}
        requestedVisual={requestedVisual}
        onDismissVisual={onDismissVisual}
        dataObjectStage={dataObjectStage}
        onSelectDataObject={onSelectDataObject}
        backGuidedAttentionCue={backGuidedAttentionCue}
        nmiManagementMap={nmiManagementMap}
        nmiMapNodes={nmiMapNodes}
      />
      {dataObjectStage.participants.find((entry) => entry.dataObject.id === dataObjectStage.diagnostics.selectedDataObjectId) ? (
        <NexoraStageDataObjectInspection
          dataObject={dataObjectStage.participants.find((entry) => entry.dataObject.id === dataObjectStage.diagnostics.selectedDataObjectId)!.dataObject}
          onRemoveFromStage={onRemoveDataObjectFromStage}
          onOpenDataRail={onOpenDataRail}
          onAskNexora={onAskDataObject}
        />
      ) : null}
      {decisionComparison != null && decisionCommitment == null ? (
        <NexoraDecisionTheatreComparisonSurface
          comparison={decisionComparison}
          onLevelChange={onComparisonLevelChange ?? (() => undefined)}
          onAsk={onAskInvestigationQuestion ?? (() => undefined)}
          onReviewDecision={onReviewDecision}
        />
      ) : null}
      {disclosedInvestigation != null ? (
        <NexoraDecisionTheatreInvestigationSurface
          investigation={disclosedInvestigation}
          onLevelChange={onInvestigationLevelChange ?? (() => undefined)}
          onClose={onCloseInvestigation ?? (() => undefined)}
          onAsk={onAskInvestigationQuestion ?? (() => undefined)}
        />
      ) : null}
      {decisionCommitment != null &&
      executionReadiness == null &&
      disclosedInvestigation == null ? (
        <NexoraDecisionTheatreCommitmentSurface
          commitment={decisionCommitment}
          onCancel={onCancelDecisionReview ?? (() => undefined)}
          onChangeCandidate={onChangeDecisionCandidate ?? (() => undefined)}
          onCommit={onCommitDecision ?? (() => undefined)}
          onAsk={onAskInvestigationQuestion ?? (() => undefined)}
          onInvestigate={() => {
            const id = decisionCommitment.candidateId;
            if (id) onSelectSubject(id);
          }}
        />
      ) : null}
      {executionReadiness != null &&
      liveExecution == null &&
      disclosedInvestigation == null ? (
        <NexoraDecisionTheatreExecutionReadinessSurface
          readiness={executionReadiness}
          onAsk={onAskInvestigationQuestion ?? (() => undefined)}
          onInspectDecision={() => {
            const id = decisionCommitment?.candidateId;
            if (id) onSelectSubject(id);
          }}
          onRequestStart={onRequestStartExecution ?? (() => undefined)}
          onShowHistory={onShowDecisionHistory ?? (() => undefined)}
        />
      ) : null}
      {liveExecution != null &&
      outcomeObservation == null &&
      disclosedInvestigation == null ? (
        <NexoraDecisionTheatreLiveExecutionSurface
          liveExecution={liveExecution}
          onAsk={onAskInvestigationQuestion ?? (() => undefined)}
          onInspectDecision={() => {
            const id = decisionCommitment?.candidateId;
            if (id) onSelectSubject(id);
          }}
          onShowHistory={onShowDecisionHistory ?? (() => undefined)}
        />
      ) : null}
      {outcomeObservation != null &&
      (learningReassessment == null || learningReassessment.evidenceQuality === "insufficient") &&
      disclosedInvestigation == null ? (
        <NexoraDecisionTheatreOutcomeObservationSurface
          observation={outcomeObservation}
          onAsk={onAskInvestigationQuestion ?? (() => undefined)}
          onInspectDecision={() => {
            const id = decisionCommitment?.candidateId;
            if (id) onSelectSubject(id);
          }}
          onShowHistory={onShowDecisionHistory ?? (() => undefined)}
        />
      ) : null}
      {learningReassessment != null &&
      learningReassessment.evidenceQuality !== "insufficient" &&
      disclosedInvestigation == null ? (
        <NexoraDecisionTheatreLearningReassessmentSurface
          learning={learningReassessment}
          onAsk={onAskInvestigationQuestion ?? (() => undefined)}
          onInspectDecision={() => {
            const id = decisionCommitment?.candidateId;
            if (id) onSelectSubject(id);
          }}
          onShowHistory={onShowDecisionHistory ?? (() => undefined)}
        />
      ) : null}
    </div>
  );
}
