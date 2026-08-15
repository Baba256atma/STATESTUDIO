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
import { Nexora3DExecutiveStage } from "./stage/Nexora3DExecutiveStage";

type Props = {
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
};

/**
 * Stage mount boundary — hosts Stage + interaction + presentation depth.
 */
export function NexoraStageMount({
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
}: Props) {
  return (
    <div
      data-testid="nexora-stage-mount"
      data-mvp-surface="stage"
      data-environment-intent={interaction.scene.environmentIntent}
      data-environment-treatment={environment.objectSurfaceTreatment}
      data-presentation-state={interaction.scene.presentationState}
      data-selected-object={interaction.selectedSubjectId ?? "none"}
      data-focused-object={interaction.focusedSubjectId ?? "none"}
      data-interaction-mode={interaction.mode}
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
      />
    </div>
  );
}
