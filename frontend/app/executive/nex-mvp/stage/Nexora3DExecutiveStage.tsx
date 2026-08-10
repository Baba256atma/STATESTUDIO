"use client";

import {
  Component,
  useCallback,
  useState,
  type ErrorInfo,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";
import { getNexora3DExecutiveStageIdentity } from "@/app/lib/nex-mvp/nexora3DExecutiveStage";
import type {
  NexoraMVPAdvisorContextBridge,
  NexoraMVPStageInteractionPresentation,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction";
import type {
  NexoraMVPPresentationAvailableAction,
  NexoraMVPPresentationViewModel,
} from "@/app/lib/nex-mvp/nexoraMVPPresentationState";
import type { NexoraMVPPresentationState } from "@/app/lib/nex-mvp/nexoraMVPApplicationFoundation";
import type { NexoraMVPSceneEnvironmentVisualState } from "@/app/lib/nex-mvp/nexoraMVPWorkspacePresentation";
import { cockpit } from "../../exs1/shell/executiveCockpitTheme";
import { NexoraPresentationStateSelector } from "../presentation/NexoraPresentationStateSelector";
import { NexoraSubjectOperation } from "../presentation/NexoraSubjectOperation";
import { NexoraSubjectReport } from "../presentation/NexoraSubjectReport";
import { NexoraStageInteractionBreadcrumb } from "./NexoraStageInteractionBreadcrumb";

const NexoraStageCanvas = dynamic(
  () =>
    import("./NexoraStageCanvas").then((module) => module.NexoraStageCanvas),
  {
    ssr: false,
    loading: () => <StageLoadingState />,
  },
);

export type Nexora3DExecutiveStageProps = {
  readonly workspaceLabel: string;
  readonly interaction: NexoraMVPStageInteractionPresentation;
  readonly environment: NexoraMVPSceneEnvironmentVisualState;
  readonly presentationViewModel: NexoraMVPPresentationViewModel;
  readonly advisorBridge: NexoraMVPAdvisorContextBridge;
  readonly onSelectSubject: (subjectId: string | null) => void;
  readonly onStepBack: () => void;
  readonly onOverview: () => void;
  readonly onPresentationStateChange: (
    state: NexoraMVPPresentationState,
  ) => void;
  readonly onPresentationAction: (
    action: NexoraMVPPresentationAvailableAction,
  ) => void;
};

type FallbackProps = {
  readonly message: string;
  readonly workspaceLabel: string;
  readonly presentationState: string;
  readonly environmentIntent: string;
};

function StageLoadingState() {
  return (
    <div
      data-testid="nexora-stage-loading"
      style={{
        width: "100%",
        height: "100%",
        display: "grid",
        placeItems: "center",
        color: cockpit.muted,
        fontSize: "0.68rem",
        letterSpacing: "0.16em",
        textTransform: "uppercase",
      }}
    >
      Preparing Stage
    </div>
  );
}

function StageFallback({
  message,
  workspaceLabel,
  presentationState,
  environmentIntent,
}: FallbackProps) {
  return (
    <div
      data-testid="nexora-stage-fallback"
      role="status"
      aria-live="polite"
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.45rem",
        padding: "1.5rem",
        background: cockpit.stageBg,
        color: cockpit.textSoft,
        textAlign: "center",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "0.68rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: cockpit.lowMuted,
        }}
      >
        Spatial Stage Unavailable
      </p>
      <p style={{ margin: 0, fontSize: "0.9rem", color: cockpit.text }}>
        {workspaceLabel}
      </p>
      <p style={{ margin: 0, fontSize: "0.75rem", maxWidth: "22rem" }}>
        {message}
      </p>
      <p
        style={{
          margin: "0.35rem 0 0",
          fontSize: "0.62rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: cockpit.muted,
        }}
      >
        {presentationState} · {environmentIntent}
      </p>
    </div>
  );
}

class StageErrorBoundary extends Component<
  {
    readonly children: ReactNode;
    readonly fallback: ReactNode;
  },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("Nexora Stage renderer failed", error, info);
  }

  render(): ReactNode {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

/**
 * NEX-MVP:3/4/5/6 — 3D Executive Stage host.
 * Consumes interaction + presentation view models; does not own authority.
 */
export function Nexora3DExecutiveStage({
  workspaceLabel,
  interaction,
  environment,
  presentationViewModel,
  advisorBridge,
  onSelectSubject,
  onStepBack,
  onOverview,
  onPresentationStateChange,
  onPresentationAction,
}: Nexora3DExecutiveStageProps) {
  const identity = getNexora3DExecutiveStageIdentity();
  const [webglSupported] = useState(() => {
    if (typeof document === "undefined") return true;
    try {
      const canvas = document.createElement("canvas");
      return Boolean(
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl"),
      );
    } catch {
      return false;
    }
  });

  const onClearSelection = useCallback(() => {
    onOverview();
  }, [onOverview]);

  const focusedLabel =
    interaction.breadcrumb[interaction.breadcrumb.length - 1]?.label ?? null;

  const fallback = (
    <StageFallback
      message="Spatial rendering is unavailable in this environment. The Executive Shell remains operable."
      workspaceLabel={workspaceLabel}
      presentationState={interaction.scene.presentationState}
      environmentIntent={interaction.scene.environmentIntent}
    />
  );

  return (
    <div
      data-testid="nexora-3d-executive-stage"
      data-nex-mvp="3"
      data-nex-mvp-interaction="4"
      data-nex-mvp-workspace="5"
      data-nex-mvp-presentation="6"
      data-stage-identity={identity.id}
      data-stage-version={identity.version}
      data-presentation-state={interaction.scene.presentationState}
      data-environment-intent={interaction.scene.environmentIntent}
      data-environment-treatment={environment.objectSurfaceTreatment}
      data-selected-object={interaction.selectedSubjectId ?? "none"}
      data-focused-object={interaction.focusedSubjectId ?? "none"}
      data-stage-mode={interaction.scene.mode}
      data-interaction-mode={interaction.mode}
      data-advisor-subject={advisorBridge.focusedSubject?.id ?? "none"}
      data-advisor-kind={advisorBridge.subjectKind ?? "none"}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        minWidth: 0,
        minHeight: 0,
        overflow: "hidden",
        background: cockpit.stageBg,
      }}
    >
      <div
        data-testid="nexora-stage-a11y"
        aria-live="polite"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          overflow: "hidden",
          clip: "rect(0 0 0 0)",
        }}
      >
        {focusedLabel
          ? `Focused subject: ${focusedLabel}. Presentation: ${presentationViewModel.state}`
          : `Overview · ${workspaceLabel}. Presentation: ${presentationViewModel.state}`}
      </div>

      <NexoraStageInteractionBreadcrumb
        breadcrumb={interaction.breadcrumb}
        canStepBack={interaction.canStepBack}
        onStepBack={onStepBack}
        onOverview={onOverview}
      />

      <NexoraPresentationStateSelector
        activePresentationState={presentationViewModel.state}
        capability={presentationViewModel.capability}
        onPresentationStateChange={onPresentationStateChange}
      />

      <div
        data-testid="nexora-stage-object-list"
        style={{
          position: "absolute",
          left: "0.75rem",
          top: "0.75rem",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
          maxWidth: "9.5rem",
          maxHeight: "calc(100% - 5rem)",
          overflow: "auto",
          pointerEvents: "auto",
        }}
      >
        {interaction.scene.objects.map((object) => {
          const showKpi =
            object.focused &&
            presentationViewModel.state === "minimum" &&
            presentationViewModel.primaryKpi &&
            presentationViewModel.subjectId === object.id;
          return (
            <button
              key={object.id}
              type="button"
              data-testid={`nexora-stage-object-control-${object.id}`}
              data-role={object.role}
              aria-pressed={object.focused}
              onClick={() => onSelectSubject(object.id)}
              style={{
                border: object.focused
                  ? `1px solid ${cockpit.accent}`
                  : `1px solid ${cockpit.border}`,
                background: object.focused
                  ? "rgba(56, 120, 180, 0.28)"
                  : "rgba(8, 14, 24, 0.55)",
                color:
                  object.role === "unrelated"
                    ? cockpit.lowMuted
                    : cockpit.textSoft,
                fontSize: "0.62rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                textAlign: "left",
                padding: "0.28rem 0.4rem",
                borderRadius: "0.3rem",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {object.label}
              {showKpi ? (
                <span
                  data-testid={`nexora-stage-object-kpi-${object.id}`}
                  style={{
                    display: "block",
                    marginTop: "0.12rem",
                    fontSize: "0.58rem",
                    letterSpacing: "0.04em",
                    textTransform: "none",
                    color: cockpit.accent,
                  }}
                >
                  {presentationViewModel.primaryKpi?.value}
                  {presentationViewModel.primaryKpi?.delta
                    ? ` ${presentationViewModel.primaryKpi.delta}`
                    : ""}
                </span>
              ) : null}
            </button>
          );
        })}

        {interaction.contextNodes
          .filter((node) => node.role !== "source-anchor")
          .map((node) => (
            <button
              key={node.id}
              type="button"
              data-testid={`nexora-stage-context-control-${node.subjectId}`}
              data-role={node.role}
              data-kind={node.kind}
              aria-pressed={node.focused}
              onClick={() => onSelectSubject(node.subjectId)}
              style={{
                border: node.focused
                  ? `1px solid ${cockpit.accent}`
                  : `1px solid ${cockpit.border}`,
                background: "rgba(8, 14, 24, 0.45)",
                color: cockpit.textSoft,
                fontSize: "0.58rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                textAlign: "left",
                padding: "0.28rem 0.4rem",
                borderRadius: "0.3rem",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {node.kind}: {node.label}
            </button>
          ))}

        <button
          type="button"
          data-testid="nexora-stage-reset"
          onClick={onOverview}
          style={{
            marginTop: "0.2rem",
            border: "none",
            background: "transparent",
            color: cockpit.accent,
            fontSize: "0.58rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            cursor: "pointer",
            textAlign: "left",
            fontFamily: "inherit",
          }}
        >
          Overview
        </button>
      </div>

      <NexoraSubjectReport viewModel={presentationViewModel} />
      <NexoraSubjectOperation
        viewModel={presentationViewModel}
        onAction={onPresentationAction}
      />

      {!webglSupported ? (
        fallback
      ) : (
        <StageErrorBoundary fallback={fallback}>
          <div
            data-testid="nexora-stage-canvas-host"
            style={{ width: "100%", height: "100%" }}
          >
            <NexoraStageCanvas
              presentation={interaction}
              environment={environment}
              onSelectSubject={(id) => onSelectSubject(id)}
              onClearSelection={onClearSelection}
            />
          </div>
        </StageErrorBoundary>
      )}
    </div>
  );
}
