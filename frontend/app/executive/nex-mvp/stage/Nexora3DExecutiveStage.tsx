"use client";

import {
  Component,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ErrorInfo,
  type ReactNode,
  type CSSProperties,
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
import type { ExecutiveQueueCategory } from "@/app/lib/spatial-presentation/executiveStageProductivityContract";
import type { NexoraDecisionTheatreIconicObject } from "@/app/lib/decision-theatre/nexoraDecisionTheatreIconicProjection.ts";
import type { NexoraDecisionTheatreParticipantVisualPresentation } from "@/app/lib/decision-theatre/nexoraDecisionTheatreVisualProjection.ts";
import { NexoraDecisionTheatreIconicSatellite } from "./NexoraDecisionTheatreIconicSatellites";
import type { NexoraDecisionTheatreAtmosphereMode } from "@/app/lib/decision-theatre/nexoraDecisionTheatreAtmosphere.ts";
import { NEXORA_DECISION_THEATRE_ATMOSPHERE_MODES } from "@/app/lib/decision-theatre/nexoraDecisionTheatreAtmosphere.ts";
import type { NexoraDecisionTheatreAtmosphereProjection } from "@/app/lib/decision-theatre/nexoraDecisionTheatreAtmosphere.ts";
import {
  projectNexoraDecisionTheatreDataObjectsToStage,
  type NexoraDecisionTheatreDataObjectStageProjection,
} from "@/app/lib/decision-theatre/nexoraDecisionTheatreDataObjectStageProjection.ts";
import { resolveNexoraDecisionTheatreAtmosphereSwatch } from "@/app/lib/decision-theatre/nexoraDecisionTheatreAtmosphereRendererTokens.ts";
import {
  applyExecutiveStageFixedCameraToStagePresentation,
  getNexoraMVPExecutiveStage2DFixedCameraObservability,
} from "@/app/lib/nex-mvp/nexoraMVPExecutiveStage2DFixedCamera";
import {
  applyExecutiveStage2DTopologyPlaneToStagePresentation,
  getNexoraMVPExecutiveStage2DTopologyPlaneObservability,
} from "@/app/lib/nex-mvp/nexoraMVPExecutiveStage2DTopologyPlane";
import {
  applyExecutiveStage2DTopologyRecompositionToStagePresentation,
} from "@/app/lib/nex-mvp/nexoraMVPExecutiveStage2DTopologyRecomposition";
import { applyExecutiveStageObjectLabelTerritoryToStagePresentation } from "@/app/lib/nex-mvp/nexoraMVPExecutiveStageObjectLabelTerritory";
import {
  getNexoraMVPExecutiveStage2DReadabilityObservability,
} from "@/app/lib/nex-mvp/nexoraMVPExecutiveStage2DTopologyReadability";
import { getExecutiveStage2DNavigationTrailObservability } from "@/app/lib/spatial-presentation/executiveStage2DNavigationTrail";
import {
  getExecutiveStage2DNavigationContextObservability,
  resolveExecutiveStage2DNavigationBreadcrumbWindow,
  createEmptyExecutiveStage2DScopedNavigationTrail,
} from "@/app/lib/spatial-presentation/executiveStage2DNavigationContext";
import {
  certifyExecutiveStage2DAnchorScreenCenter,
  getExecutiveStage2DVisualCertificationObservability,
} from "@/app/lib/spatial-presentation/executiveStage2DVisualCertification";
import {
  getExecutiveStageDeepZVisualEnvironmentObservability,
  isExecutiveStageDeepZEnvironmentEnabled,
} from "@/app/lib/spatial-presentation/executiveStageDeepZVisualEnvironment";
import {
  getExecutiveObject3DGeometryObservability,
  isExecutiveObject3DGeometryEnabled,
} from "@/app/lib/spatial-presentation/executiveObject3DGeometry";
import {
  getExecutive3DObjectVisualObservability,
  isExecutive3DObjectVisualEnabled,
} from "@/app/lib/spatial-presentation/executive3DObjectVisualProfile";
import {
  getExecutive3DObjectFaceSymbologyObservability,
  isExecutive3DObjectSurfaceEnabled,
} from "@/app/lib/spatial-presentation/executive3DObjectFaceSymbology";
import {
  getExecutive3DObjectPremiumFormObservability,
  isExecutive3DObjectFormOnlyMode,
  isExecutive3DObjectPremiumFormEnabled,
  isExecutive3DObjectSymbolVisible,
  isExecutive3DObjectTerritoryVisible,
  bumpExecutive3DObjectFormRuntime,
} from "@/app/lib/spatial-presentation/executive3DObjectPremiumForm";
import {
  EXECUTIVE_STAGE_MOTION,
  getExecutiveStageMotionIdentity,
} from "@/app/lib/spatial-presentation/executiveStageMotion";
import {
  getExecutiveObjectPresenceIdentity,
  getExecutiveObjectPresenceObservability,
  isExecutiveObjectPresenceV2Enabled,
  syncExecutiveObjectPresenceV2FromEnvironment,
} from "@/app/lib/spatial-presentation/executiveObjectPresenceIdentity";
import {
  getExecutiveObjectLabelRelationshipGrammarIdentity,
  getExecutiveObjectLabelRelationshipObservability,
} from "@/app/lib/spatial-presentation/executiveObjectLabelRelationshipGrammar";
import {
  getExecutiveStageVisualBalanceIdentity,
  getExecutiveStageVisualBalanceObservability,
  mapNeighborhoodClassToVisualRole,
  resolveExecutiveStageVisualBalance,
} from "@/app/lib/spatial-presentation/executiveStageVisualBalance";
import {
  getExecutiveStageReservedRegionContainmentIdentity,
  getExecutiveStageReservedRegionContainmentObservability,
} from "@/app/lib/spatial-presentation/executiveStageReservedRegionContainment";
import {
  buildExecutiveStageProductivityObservability,
  EXECUTIVE_STAGE_PRODUCTIVITY_REGIONS,
  getExecutiveStageProductivityContractIdentity,
  resolveExecutiveStageDisclosure,
} from "@/app/lib/spatial-presentation/executiveStageProductivityContract";
import {
  getExecutiveThreadExpansionIdentity,
  getExecutiveThreadExpansionObservability,
  getExecutiveThreadGatewayDiscoverabilityIdentity,
  measureExecutiveThreadGatewayContainment,
  measureExecutiveThreadGatewayObjectOverlap,
  EXECUTIVE_THREAD_GATEWAY_FOOTPRINT,
} from "@/app/lib/spatial-presentation/executiveThreadExpansion";
import {
  getExecutiveStageObjectLabelTerritoryIdentity,
  getExecutiveStageObjectLabelObservability,
} from "@/app/lib/spatial-presentation/executiveStageObjectLabelTerritory";
import { EXECUTIVE_STAGE_2D_VISUAL_FOOTPRINT } from "@/app/lib/spatial-presentation/executiveStage2DHardSeparation";
import { captureExecutiveFocusLayoutAuthoritySnapshot } from "@/app/lib/spatial-presentation/executiveFocusLayoutAuthorityTrace";
import {
  createExecutive2DPosition,
  mapExecutive2DPositionToRenderWorld,
} from "@/app/lib/spatial-presentation/executivePresentationPlaneFoundation";
import { cockpit } from "../../exs1/shell/executiveCockpitTheme";
import { NexoraPresentationStateSelector } from "../presentation/NexoraPresentationStateSelector";
import { NexoraSubjectOperation } from "../presentation/NexoraSubjectOperation";
import { NexoraSubjectReport } from "../presentation/NexoraSubjectReport";
import { NexoraStageInteractionBreadcrumb } from "./NexoraStageInteractionBreadcrumb";
import { NexoraExecutiveQueueOverlay } from "./NexoraExecutiveQueueOverlay";
import { NexoraStageRenderedBoundsTruthOverlay } from "./NexoraStageRenderedBoundsTruthOverlay";

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
  readonly atmosphereMode?: string;
  readonly warRoomAtmosphere?: NexoraDecisionTheatreAtmosphereProjection | null;
  readonly dataObjectStage?: NexoraDecisionTheatreDataObjectStageProjection;
  readonly onSelectDataObject?: (dataObjectId: string) => void;
};

const EMPTY_DATA_OBJECT_STAGE = projectNexoraDecisionTheatreDataObjectsToStage({
  dataObjects: Object.freeze([]),
  visibleDataObjectIds: Object.freeze([]),
  selectedDataObjectId: null,
  businessFocusId: null,
  stageObjects: Object.freeze([]),
});

type FallbackProps = {
  readonly message: string;
  readonly workspaceLabel: string;
  readonly presentationState: string;
  readonly environmentIntent: string;
};

function stageAtmosphereOverlayStyle(
  atmosphere: NexoraDecisionTheatreAtmosphereProjection | null,
  mode: string,
): CSSProperties {
  const candidate = atmosphere?.mode ?? mode;
  const resolvedMode: NexoraDecisionTheatreAtmosphereMode =
    (NEXORA_DECISION_THEATRE_ATMOSPHERE_MODES as readonly string[]).includes(candidate)
      ? (candidate as NexoraDecisionTheatreAtmosphereMode)
      : "none";
  const swatch = resolveNexoraDecisionTheatreAtmosphereSwatch(resolvedMode);
  const animate =
    atmosphere?.transitionToken === "atmosphere-crossfade" && atmosphere.reducedMotion !== true;
  return {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    zIndex: 1,
    opacity: Number(swatch.opacity),
    background: `radial-gradient(ellipse at 50% 42%, ${swatch.radial} 0%, ${swatch.background} 58%, ${swatch.vignette} 100%)`,
    boxShadow: `inset 0 0 0 1px ${swatch.edge}`,
    transition: animate ? "opacity 240ms ease, background 240ms ease" : "none",
  };
}

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
  onSelectQueueCategory,
  onStepBack,
  onStepForward,
  onNavigateTrailIndex,
  onOverview,
  onPresentationStateChange,
  onPresentationAction,
  iconicObjects = [],
  visualPresentations = {},
  atmosphereMode = "none",
  warRoomAtmosphere = null,
  dataObjectStage = EMPTY_DATA_OBJECT_STAGE,
  onSelectDataObject = () => undefined,
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

  const stage2dObservability = getNexoraMVPExecutiveStage2DFixedCameraObservability();
  const topologyPlaneObservability =
    getNexoraMVPExecutiveStage2DTopologyPlaneObservability();

  /**
   * STAGE-2D:1 — SP:1.3 orbit/tilt/zoom navigation is bypassed.
   * Camera is fixed at the canonical Stage pose; focus/selection cannot retarget it.
   * Focus layout snapshots remain for topology authority tracing only.
   */
  useEffect(() => {
    const focusedObjectId = interaction.scene.focusedObjectId;
    if (focusedObjectId == null) return;
    const focus = interaction.scene.objects.find(
      (entry) => entry.id === focusedObjectId,
    );
    if (!focus) return;
    const mapped = mapExecutive2DPositionToRenderWorld({
      position: createExecutive2DPosition(0, 0),
    });
    const topology = (
      interaction.scene as {
        readonly networkTopology?: {
          readonly anchorObjectId?: string | null;
          readonly positions?: Readonly<
            Record<string, Readonly<{ readonly x: number; readonly y: number }>>
          >;
        };
      }
    ).networkTopology;
    captureExecutiveFocusLayoutAuthoritySnapshot({
      objectId: focusedObjectId,
      clickedObjectId: interaction.scene.selectedObjectId,
      selectedObjectId: interaction.scene.selectedObjectId,
      focusedObjectId,
      focusSource:
        interaction.scene.selectedObjectId != null &&
        interaction.scene.selectedObjectId === focusedObjectId
          ? "user-selection"
          : "automatic-attention",
      automaticAttentionObjectId: null,
      anchorObjectId: topology?.anchorObjectId ?? null,
      disclosureState: focus.disclosureState ?? null,
      topologyPosition: topology?.positions?.[focusedObjectId] ?? null,
      presentationPosition: focus.presentationPosition ?? null,
      targetPosition: focus.targetPosition,
      mappedWorldPosition: [mapped.x, mapped.y, mapped.z],
      stageTargetPosition: focus.targetPosition,
      overviewPosition: focus.overviewPosition,
      overviewMatchesTarget:
        focus.overviewPosition[0] === focus.targetPosition[0] &&
        focus.overviewPosition[1] === focus.targetPosition[1] &&
        focus.overviewPosition[2] === focus.targetPosition[2],
    });
  }, [interaction.scene]);

  /** STAGE-2D:2 flatten → STAGE-2D:3/4 recomposition → STAGE-LABEL:1 → STAGE-2D:1 camera. */
  const fixedCameraInteraction = useMemo(() => {
    const flattened =
      applyExecutiveStage2DTopologyPlaneToStagePresentation(interaction);
    const recomposed =
      applyExecutiveStage2DTopologyRecompositionToStagePresentation(flattened);
    const withLabels =
      applyExecutiveStageObjectLabelTerritoryToStagePresentation(recomposed, {
        presentationLevel: presentationViewModel.state,
      });
    return applyExecutiveStageFixedCameraToStagePresentation(withLabels);
  }, [interaction, presentationViewModel.state]);

  const readabilityObservability =
    getNexoraMVPExecutiveStage2DReadabilityObservability(
      fixedCameraInteraction,
    );
  const navigationTrail =
    interaction.stage2dNavigationTrail ??
    createEmptyExecutiveStage2DScopedNavigationTrail({
      workspace: "overview",
    });
  const navigationWindow =
    resolveExecutiveStage2DNavigationBreadcrumbWindow(navigationTrail);
  const navigationTrailObservability =
    getExecutiveStage2DNavigationContextObservability({
      trail: navigationTrail,
      window: navigationWindow,
      scopeStatus: interaction.stage2dNavigationScopeStatus,
    });
  const visualCertification = certifyExecutiveStage2DAnchorScreenCenter();
  const visualObservability = getExecutiveStage2DVisualCertificationObservability({
    screenCentered: visualCertification.withinTolerance,
    overlapCount: 0,
    controlCollisionCount: 0,
  });
  const [deepZEnabled, setDeepZEnabled] = useState(
    isExecutiveStageDeepZEnvironmentEnabled(),
  );
  // Initialize toggles to stable defaults (no window.query) so SSR + first client
  // paint match. Query overrides apply only after mount via useEffect.
  const [object3dEnabled, setObject3dEnabled] = useState(true);
  const [object3dVisualEnabled, setObject3dVisualEnabled] = useState(true);
  const [object3dSurfaceEnabled, setObject3dSurfaceEnabled] = useState(true);
  const [object3dFormEnabled, setObject3dFormEnabled] = useState(true);
  const [object3dSymbolsVisible, setObject3dSymbolsVisible] = useState(true);
  const [object3dTerritoryVisible, setObject3dTerritoryVisible] =
    useState(true);
  const [object3dFormOnly, setObject3dFormOnly] = useState(false);
  const [objectPresenceEnabled, setObjectPresenceEnabled] = useState(true);
  const [objectPresenceQuery, setObjectPresenceQuery] = useState("default");
  useEffect(() => {
    const sync = () => {
      syncExecutiveObjectPresenceV2FromEnvironment();
      setDeepZEnabled(isExecutiveStageDeepZEnvironmentEnabled());
      setObject3dEnabled(isExecutiveObject3DGeometryEnabled());
      setObject3dVisualEnabled(isExecutive3DObjectVisualEnabled());
      setObject3dSurfaceEnabled(isExecutive3DObjectSurfaceEnabled());
      setObject3dFormEnabled(isExecutive3DObjectPremiumFormEnabled());
      setObject3dFormOnly(isExecutive3DObjectFormOnlyMode());
      setObject3dSymbolsVisible(isExecutive3DObjectSymbolVisible());
      setObject3dTerritoryVisible(isExecutive3DObjectTerritoryVisible());
      bumpExecutive3DObjectFormRuntime();
      const presenceOn = isExecutiveObjectPresenceV2Enabled();
      setObjectPresenceEnabled(presenceOn);
      try {
        setObjectPresenceQuery(
          new URLSearchParams(window.location.search).get("objPresence") ??
            "default",
        );
      } catch {
        setObjectPresenceQuery("default");
      }
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);
  const deepZObservability = getExecutiveStageDeepZVisualEnvironmentObservability({
    enabled: deepZEnabled,
  });
  const object3dObservability = getExecutiveObject3DGeometryObservability({
    enabled: object3dEnabled,
  });
  const focusedObject = fixedCameraInteraction.scene.objects.find(
    (entry) => entry.id === fixedCameraInteraction.scene.focusedObjectId,
  );
  const focusedKindCue = [
    focusedObject?.id,
    focusedObject?.label,
    focusedObject?.kind,
  ]
    .filter(Boolean)
    .join(" ") || "object";
  const presentationLevelForVisual = (presentationViewModel.state ===
  "report" ||
  presentationViewModel.state === "operation"
    ? presentationViewModel.state
    : "minimum") as "minimum" | "report" | "operation";
  const object3dVisualObservability = getExecutive3DObjectVisualObservability({
    enabled: object3dVisualEnabled,
    objectKind: focusedKindCue,
    presentationLevel: presentationLevelForVisual,
  });
  const object3dSurfaceObservability =
    getExecutive3DObjectFaceSymbologyObservability({
      enabled:
        object3dSurfaceEnabled &&
        object3dVisualEnabled &&
        object3dSymbolsVisible &&
        !object3dFormOnly,
      objectKind: focusedKindCue,
      presentationLevel: presentationLevelForVisual,
    });
  // When symbols are suppressed, force observability kind/scale to off.
  const object3dSurfaceObservabilityView =
    object3dSymbolsVisible && !object3dFormOnly
      ? object3dSurfaceObservability
      : {
          ...object3dSurfaceObservability,
          enabled: "false",
          symbolKind: "none",
          symbolScale: "0",
          faceReadability: "off",
        };
  const object3dFormObservability = getExecutive3DObjectPremiumFormObservability({
    enabled:
      object3dFormEnabled && object3dVisualEnabled && object3dEnabled,
    objectKind: focusedKindCue,
    presentationLevel: presentationLevelForVisual,
  });
  const motionIdentity = getExecutiveStageMotionIdentity();
  const presenceIdentity = getExecutiveObjectPresenceIdentity();
  const presenceObservability = getExecutiveObjectPresenceObservability({
    enabled: objectPresenceEnabled,
  });
  const labelGrammarIdentity =
    getExecutiveObjectLabelRelationshipGrammarIdentity();
  const labelGrammarObservability =
    getExecutiveObjectLabelRelationshipObservability({
      sectorCompression: Number(
        (
          fixedCameraInteraction.scene as {
            readonly stage2dReadability?: {
              readonly sectorCompression?: number;
            };
          }
        ).stage2dReadability?.sectorCompression ?? 0,
      ),
    });
  const readabilityScene = fixedCameraInteraction.scene as {
    readonly stage2dReadability?: {
      readonly classifications?: Readonly<Record<string, string>>;
      readonly positions?: Readonly<
        Record<string, { readonly x: number; readonly y: number }>
      >;
      readonly relatedObjectIds?: readonly string[];
      readonly peripheralObjectIds?: readonly string[];
      readonly backgroundObjectIds?: readonly string[];
      readonly secondaryObjectIds?: readonly string[];
      readonly hiddenObjectIds?: readonly string[];
      readonly layoutOverlapCount?: number;
      readonly layoutMinGap?: number;
      readonly sectorCompression?: number;
      readonly mode?: string;
      readonly anchorObjectId?: string | null;
      readonly containmentStatus?: "valid" | "degraded" | "failed";
      readonly boundaryViolationCount?: number;
      readonly reservedRegionCollisionCount?: number;
      readonly bottomBoundaryViolationCount?: number;
      readonly containedObjectCount?: number;
      readonly clippedObjectCount?: number;
    };
  };
  const stageReadability = readabilityScene.stage2dReadability;
  const containmentIdentity =
    getExecutiveStageReservedRegionContainmentIdentity();
  const containmentObservability =
    getExecutiveStageReservedRegionContainmentObservability({
      status: stageReadability?.containmentStatus ?? "valid",
      boundaryViolationCount: stageReadability?.boundaryViolationCount ?? 0,
      reservedRegionCollisionCount:
        stageReadability?.reservedRegionCollisionCount ?? 0,
      bottomBoundaryViolationCount:
        stageReadability?.bottomBoundaryViolationCount ?? 0,
      containedObjectCount: stageReadability?.containedObjectCount ?? 0,
      clippedObjectCount: stageReadability?.clippedObjectCount ?? 0,
    });
  const productivityIdentity = getExecutiveStageProductivityContractIdentity();
  const productivityDisclosure = resolveExecutiveStageDisclosure({
    subjects: fixedCameraInteraction.scene.objects.map((object) =>
      Object.freeze({
        subjectId: object.id,
        label: object.label,
        objectKind: object.kind,
        family: "business-object" as const,
        attention: object.attention,
        status: object.status,
      }),
    ),
    relationships: fixedCameraInteraction.scene.connections.map(
      (connection) =>
        Object.freeze({
          id: connection.id,
          sourceId: connection.sourceId,
          targetId: connection.targetId,
        }),
    ),
    presentationMode:
      fixedCameraInteraction.scene.mode === "overview"
        ? "overview"
        : "object-focus",
    presentationDepth: fixedCameraInteraction.scene.presentationState,
    primaryStageSubjectId:
      fixedCameraInteraction.scene.focusedObjectId ??
      fixedCameraInteraction.scene.selectedObjectId,
  });
  const productivityObservability = buildExecutiveStageProductivityObservability(
    productivityDisclosure,
    Object.fromEntries(
      fixedCameraInteraction.scene.objects.map((object) => [
        object.id,
        {
          x: object.presentationPosition?.x ?? object.targetPosition[0],
          y: object.presentationPosition?.y ?? object.targetPosition[1],
        },
      ]),
    ),
  );
  const threadExpansion = interaction.threadExpansion;
  const threadIdentity = getExecutiveThreadExpansionIdentity();
  const gatewayIdentity = getExecutiveThreadGatewayDiscoverabilityIdentity();
  const threadSubjects = (threadExpansion?.subjects ?? []).map((subject) =>
    Object.freeze({
      id: subject.id,
      label: subject.label,
      kind: subject.kind as "problem" | "scenario" | "decision" | "execution",
      status: "stable",
      attention: "elevated",
    }),
  );
  const gatewayNode = fixedCameraInteraction.contextNodes.find(
    (node) =>
      node.role === "collapsed-thread" &&
      node.gatewayMode === "discoverable-collapsed",
  );
  const collapseNode = fixedCameraInteraction.contextNodes.find(
    (node) =>
      node.role === "collapsed-thread" &&
      node.gatewayMode === "quiet-collapse",
  );
  const activeGateway = gatewayNode ?? collapseNode ?? null;
  const gatewayObjects = fixedCameraInteraction.scene.objects
    .filter(
      (object) =>
        object.disclosureState !== "hidden" &&
        object.opacity > 0.05 &&
        object.id !== activeGateway?.subjectId,
    )
    .map((object) => {
      const classification =
        stageReadability?.classifications?.[object.id] ??
        (object.role === "focused"
          ? "anchor"
          : object.role === "related"
            ? "related"
            : "peripheral");
      const half =
        classification === "anchor"
          ? EXECUTIVE_STAGE_2D_VISUAL_FOOTPRINT.minimum.anchor
          : classification === "related"
            ? EXECUTIVE_STAGE_2D_VISUAL_FOOTPRINT.minimum.related
            : EXECUTIVE_STAGE_2D_VISUAL_FOOTPRINT.minimum.secondary;
      return Object.freeze({
        x: object.targetPosition[0],
        y: object.targetPosition[1],
        halfExtent: half,
      });
    });
  const gatewayX = activeGateway?.targetPosition[0] ?? null;
  const gatewayY = activeGateway?.targetPosition[1] ?? null;
  const gatewayHalfWidth =
    activeGateway?.gatewayMode === "quiet-collapse"
      ? EXECUTIVE_THREAD_GATEWAY_FOOTPRINT.collapseHalfWidth
      : EXECUTIVE_THREAD_GATEWAY_FOOTPRINT.halfWidth;
  const gatewayHalfHeight =
    activeGateway?.gatewayMode === "quiet-collapse"
      ? EXECUTIVE_THREAD_GATEWAY_FOOTPRINT.collapseHalfHeight
      : EXECUTIVE_THREAD_GATEWAY_FOOTPRINT.halfHeight;
  const gatewayOverlapCount =
    gatewayX != null && gatewayY != null
      ? measureExecutiveThreadGatewayObjectOverlap({
          gatewayX,
          gatewayY,
          gatewayHalfWidth,
          gatewayHalfHeight,
          objects: gatewayObjects,
        })
      : 0;
  const gatewayContainment =
    gatewayX != null && gatewayY != null
      ? measureExecutiveThreadGatewayContainment({
          gatewayX,
          gatewayY,
          gatewayHalfWidth,
          gatewayHalfHeight,
        })
      : Object.freeze({ clipped: false, reservedCollisionCount: 0 });
  const threadObservability = getExecutiveThreadExpansionObservability({
    expanded: threadExpansion?.expanded === true,
    anchorObjectId: threadExpansion?.anchorObjectId ?? null,
    threadId: threadExpansion?.threadId ?? null,
    subjects: threadSubjects,
    selectedSubjectId: threadExpansion?.selectedSubjectId ?? null,
    orphanLabelCount: 0,
    clippedObjectCount: Number(containmentObservability.clippedObjectCount),
    overlapCount: stageReadability?.layoutOverlapCount ?? 0,
    gatewayVisible: gatewayNode != null,
    gatewayX,
    gatewayY,
    gatewayHitTarget: activeGateway?.interactive !== false,
    gatewayOverlapCount,
    gatewayClipped: gatewayContainment.clipped,
    gatewayReservedCollisionCount: gatewayContainment.reservedCollisionCount,
    gatewayCount:
      gatewayNode?.gatewayCount ??
      collapseNode?.gatewayCount ??
      threadSubjects.length,
  });
  const labelLayoutScene = fixedCameraInteraction.scene as {
    readonly stageLabelObservability?: ReturnType<
      typeof getExecutiveStageObjectLabelObservability
    >;
  };
  const labelIdentity = getExecutiveStageObjectLabelTerritoryIdentity();
  const labelObservability =
    labelLayoutScene.stageLabelObservability ??
    getExecutiveStageObjectLabelObservability();
  const visualRoles: Record<string, ReturnType<typeof mapNeighborhoodClassToVisualRole>> =
    {};
  for (const object of fixedCameraInteraction.scene.objects) {
    const classification =
      stageReadability?.classifications?.[object.id] ??
      (object.role === "focused"
        ? "anchor"
        : object.role === "related"
          ? "related"
          : object.role === "peripheral"
            ? "peripheral"
            : object.disclosureState === "hidden"
              ? "hidden"
              : "hidden");
    visualRoles[object.id] = mapNeighborhoodClassToVisualRole(classification);
  }
  const positionsForBalance: Record<string, { x: number; y: number }> = {};
  for (const object of fixedCameraInteraction.scene.objects) {
    if (object.disclosureState === "hidden" || object.opacity <= 0) continue;
    positionsForBalance[object.id] = {
      x: object.targetPosition[0],
      y: object.targetPosition[1],
    };
  }
  const balanceDiagnostic = resolveExecutiveStageVisualBalance({
    positions: positionsForBalance,
    visualRoles,
    labelVisibleCount: fixedCameraInteraction.scene.objects.filter(
      (object) => object.labelVisible !== false && object.opacity > 0.2,
    ).length,
    visibleObjectCount: Object.keys(positionsForBalance).length,
    primaryEdgeCount: fixedCameraInteraction.scene.connections.filter(
      (connection) => connection.visualRole === "anchor-incident",
    ).length,
    secondaryEdgeCount: fixedCameraInteraction.scene.connections.filter(
      (connection) => connection.visualRole === "context",
    ).length,
    unrelatedVisibleEdgeCount: fixedCameraInteraction.scene.connections.filter(
      (connection) => {
        if (
          connection.visualRole === "hidden" ||
          (connection.opacity ?? 0) <= 0
        ) {
          return false;
        }
        const sourceRole = visualRoles[connection.sourceId];
        const targetRole = visualRoles[connection.targetId];
        return (
          sourceRole === "peripheral" ||
          targetRole === "peripheral" ||
          sourceRole === "hidden" ||
          targetRole === "hidden"
        );
      },
    ).length,
    orphanLabelCount: fixedCameraInteraction.scene.objects.filter(
      (object) =>
        object.labelVisible !== false &&
        object.opacity > 0 &&
        object.opacity < 0.2,
    ).length,
  });
  const visualBalanceIdentity = getExecutiveStageVisualBalanceIdentity();
  const visualBalanceObservability = getExecutiveStageVisualBalanceObservability({
    anchorCount:
      stageReadability?.mode === "anchored" && stageReadability.anchorObjectId
        ? 1
        : 0,
    relatedCount: stageReadability?.relatedObjectIds?.length ?? 0,
    peripheralCount:
      stageReadability?.peripheralObjectIds?.length ??
      stageReadability?.backgroundObjectIds?.length ??
      0,
    contextCount: stageReadability?.secondaryObjectIds?.length ?? 0,
    hiddenCount: stageReadability?.hiddenObjectIds?.length ?? 0,
    orphanLabelCount: balanceDiagnostic.orphanLabelCount,
    hardOverlapCount: stageReadability?.layoutOverlapCount ?? 0,
    minGap: stageReadability?.layoutMinGap ?? 0,
    primaryEdgeCount: Number(labelGrammarObservability.primaryEdgeCount),
    secondaryEdgeCount: Number(labelGrammarObservability.secondaryEdgeCount),
    unrelatedVisibleEdgeCount: balanceDiagnostic.unrelatedVisibleEdgeCount,
    visualCentroidX: balanceDiagnostic.visualCentroidX,
    visualCentroidY: balanceDiagnostic.visualCentroidY,
    sectorCompression: stageReadability?.sectorCompression ?? 0,
    reservedRegionCollisionCount: 0,
  });

  // STAGE-MOTION:1 — live phase/progress attrs are written imperatively by the
  // Canvas motion controller so React commits cannot tear mid-transition.
  // STAGE-2D:5 contract retained for compatibility checks.
  void getExecutiveStage2DNavigationTrailObservability(navigationTrail);
  const onClearSelection = useCallback(() => {
    onOverview();
  }, [onOverview]);

  const focusedLabel =
    interaction.breadcrumb[interaction.breadcrumb.length - 1]?.label ?? null;

  const focusedTargetZ = (() => {
    if (interaction.focusedSubjectId == null) return "none";
    const focused = fixedCameraInteraction.scene.objects.find(
      (entry) => entry.id === interaction.focusedSubjectId,
    );
    return focused == null ? "none" : String(focused.targetPosition[2]);
  })();
  const collectionIntegrity = (
    fixedCameraInteraction.scene as typeof fixedCameraInteraction.scene & {
      readonly collectionIntegrity?: {
        readonly contract: string;
        readonly finalXyWriter: string;
        readonly memberIds: readonly string[];
        readonly watchContextIds: readonly string[];
        readonly duplicateObjectIds: readonly string[];
        readonly hiddenWatchIds: readonly string[];
        readonly overlapCount: number;
        readonly minObservedGap: number;
        readonly requiredGap: number;
        readonly layoutStatus: string;
        readonly snapshots: readonly unknown[];
      };
    }
  ).collectionIntegrity;

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
      data-nexograph-atmosphere={atmosphereMode}
      data-ux2="stage-interaction"
      data-ux2-center-law="click-object-center-recompose"
      data-mo1="stage-reader"
      data-mo2="stage-reader"
      data-mo3="stage-reader"
      data-mo4="stage-reader"
      data-mo5="stage-reader"
      data-mo6="stage-reader"
      data-mo-int1="stage-reader"
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
      data-stage-clicked-object-id={interaction.selectedSubjectId ?? "none"}
      data-stage-selected-object-id={
        interaction.scene.selectedObjectId ?? "none"
      }
      data-stage-focused-object-id={
        interaction.scene.focusedObjectId ?? "none"
      }
      data-stage-advisor-object-id={
        advisorBridge.advisorSubjectId ??
        advisorBridge.focusedSubject?.id ??
        "none"
      }
      data-stage-mode={interaction.scene.mode}
      data-interaction-mode={interaction.mode}
      data-advisor-subject={
        advisorBridge.advisorSubjectId ??
        advisorBridge.focusedSubject?.id ??
        "none"
      }
      data-advisor-kind={advisorBridge.subjectKind ?? "none"}
      data-stage-prod-contract={productivityIdentity.id}
      data-stage-prod-version={productivityIdentity.version}
      data-stage-presentation-mode={
        interaction.presentationMode ??
        productivityObservability.presentationMode
      }
      data-stage-active-queue-category={
        interaction.collectionContext?.category ?? "none"
      }
      data-stage-collection-total={String(
        interaction.collectionHeader?.totalCount ?? 0,
      )}
      data-stage-collection-visible={String(
        interaction.collectionHeader?.visibleCount ?? 0,
      )}
      data-advisor-presentation-context={
        advisorBridge.advisorPresentationContext ?? "none"
      }
      data-stage-primary-subject={
        productivityObservability.primaryStageSubjectId ??
        advisorBridge.primaryStageSubjectId ??
        "none"
      }
      data-stage-advisor-subject-id={
        productivityObservability.advisorSubjectId ??
        advisorBridge.advisorSubjectId ??
        "none"
      }
      data-stage-center-object={
        productivityObservability.centerObjectId ?? "none"
      }
      data-stage-related-ids={
        productivityObservability.relatedObjectIds.join("|") || "none"
      }
      data-stage-watch-ids={
        productivityObservability.watchObjectIds.join("|") || "none"
      }
      data-stage-prod-hidden-count={String(
        productivityObservability.hiddenObjectIds.length,
      )}
      data-stage-queue-region-reserved={
        productivityObservability.queueRegionReserved ? "1" : "0"
      }
      data-stage-watch-region-reserved={
        productivityObservability.watchRegionReserved ? "1" : "0"
      }
      data-stage-queue-region={EXECUTIVE_STAGE_PRODUCTIVITY_REGIONS.executiveQueue.id}
      data-stage-watch-region={EXECUTIVE_STAGE_PRODUCTIVITY_REGIONS.watchTerritory.id}
      data-stage-camera-contract-prod={productivityObservability.cameraContract}
      data-stage-topology-z-contract={String(
        productivityObservability.topologyZContract,
      )}
      data-visual-audit-namespace="nexora.visual-stage-audit"
      data-choreography-anchor={interaction.focusedSubjectId ?? "none"}
      data-connection-count={String(interaction.scene.connections.length)}
      data-revealed-connection-count={String(
        interaction.scene.connections.filter(
          (connection) => connection.emphasized || connection.opacity >= 0.5,
        ).length,
      )}
      data-context-node-count={String(interaction.contextNodes.length)}
      data-camera-navigation="stage-2d-1-disabled"
      data-stage-camera-mode={stage2dObservability.cameraMode}
      data-stage-camera-target={stage2dObservability.cameraTarget}
      data-stage-depth={stage2dObservability.stageDepth}
      data-stage-camera-contract={stage2dObservability.contract}
      data-stage-plane={topologyPlaneObservability.stagePlane}
      data-stage-position-mode={topologyPlaneObservability.positionMode}
      data-stage-topology-contract={topologyPlaneObservability.contract}
      data-stage-topology-mode={readabilityObservability.topologyMode}
      data-stage-anchor-object-id={readabilityObservability.anchorObjectId}
      data-stage-anchor-position={readabilityObservability.anchorPosition}
      data-stage-neighborhood-depth={
        readabilityObservability.topologyMode === "anchored"
          ? readabilityObservability.neighborhoodDepth
          : "none"
      }
      data-stage-related-visible={readabilityObservability.relatedVisible}
      data-stage-secondary-visible={readabilityObservability.secondaryVisible}
      data-stage-hidden-count={readabilityObservability.hiddenCount}
      data-stage-secondary-overflow={readabilityObservability.secondaryOverflow}
      data-stage-routing-mode={readabilityObservability.routingMode}
      data-stage-recomposition-contract="stage-2d-3"
      data-stage-readability-contract={readabilityObservability.contract}
      data-stage-navigation-mode={navigationTrailObservability.navigationMode}
      data-stage-navigation-scope={navigationTrailObservability.navigationScope}
      data-stage-navigation-scope-status={
        navigationTrailObservability.navigationScopeStatus
      }
      data-stage-navigation-depth={navigationTrailObservability.navigationDepth}
      data-stage-navigation-visible-count={
        navigationTrailObservability.visibleCount
      }
      data-stage-navigation-overflow-before={
        navigationTrailObservability.overflowBefore
      }
      data-stage-navigation-overflow-after={
        navigationTrailObservability.overflowAfter
      }
      data-stage-navigation-current-index={
        navigationTrailObservability.currentIndex
      }
      data-stage-navigation-current-object-id={
        navigationTrailObservability.currentObjectId
      }
      data-stage-navigation-subject-ids={navigationTrail.objectIds.join("|")}
      data-stage-navigation-entry-ids={navigationTrail.trailEntryIds.join("|")}
      data-stage-navigation-current-entry-id={
        navigationTrail.currentIndex >= 0
          ? navigationTrail.trailEntryIds[navigationTrail.currentIndex] ?? "none"
          : "none"
      }
      data-stage-navigation-can-back={navigationTrailObservability.canBack}
      data-stage-navigation-can-forward={
        navigationTrailObservability.canForward
      }
      data-stage-navigation-contract={navigationTrailObservability.contract}
      data-stage-visual-certification={visualObservability.visualCertification}
      data-stage-anchor-world-center={visualObservability.anchorWorldCenter}
      data-stage-anchor-screen-centered={
        visualObservability.anchorScreenCentered
      }
      data-stage-object-plane={visualObservability.objectPlane}
      data-stage-visual-overlap-count={visualObservability.visualOverlapCount}
      data-stage-control-collision-count={
        visualObservability.controlCollisionCount
      }
      data-stage-layout-overlap-count={
        readabilityObservability.layoutOverlapCount
      }
      data-stage-layout-min-gap={readabilityObservability.layoutMinGap}
      data-stage-layout-status={readabilityObservability.layoutStatus}
      data-stage-collection-integrity={
        collectionIntegrity?.contract ?? "inactive"
      }
      data-stage-collection-final-xy-writer={
        collectionIntegrity?.finalXyWriter ?? "none"
      }
      data-stage-collection-member-ids={
        collectionIntegrity?.memberIds.join("|") ?? "none"
      }
      data-stage-collection-watch-context-ids={
        collectionIntegrity?.watchContextIds.join("|") ?? "none"
      }
      data-stage-collection-duplicate-object-ids={
        collectionIntegrity?.duplicateObjectIds.join("|") ?? "none"
      }
      data-stage-collection-hidden-watch-ids={
        collectionIntegrity?.hiddenWatchIds.join("|") ?? "none"
      }
      data-stage-collection-overlap-count={
        collectionIntegrity?.overlapCount ?? "none"
      }
      data-stage-collection-min-gap={
        collectionIntegrity?.minObservedGap ?? "none"
      }
      data-stage-collection-required-gap={
        collectionIntegrity?.requiredGap ?? "none"
      }
      data-stage-collection-layout-status={
        collectionIntegrity?.layoutStatus ?? "none"
      }
      data-stage-collection-snapshots={
        collectionIntegrity == null
          ? "[]"
          : JSON.stringify(collectionIntegrity.snapshots)
      }
      data-stage-planar-body-count={String(
        fixedCameraInteraction.scene.objects.filter(
          (entry) => entry.disclosureState !== "hidden",
        ).length,
      )}
      data-stage-volumetric-body-count="0"
      data-stage-visual-certification-fix="stage-2d-6v-fix"
      data-stage-semantic-plane-z={deepZObservability.semanticPlaneZ}
      data-stage-depth-environment={deepZObservability.depthEnvironment}
      data-stage-depth-near={deepZObservability.depthNear}
      data-stage-depth-far={deepZObservability.depthFar}
      data-stage-depth-interactive={deepZObservability.depthInteractive}
      data-stage-depth-enabled={deepZObservability.enabled}
      data-stage-depth-contract={deepZObservability.contract}
      data-stage-camera-fixed={deepZObservability.cameraFixed}
      data-stage-object-geometry={object3dObservability.objectGeometry}
      data-stage-object-3d-enabled={object3dObservability.enabled}
      data-stage-object-3d-max-depth={object3dObservability.maxDepth}
      data-stage-object-3d-contract={object3dObservability.contract}
      data-stage-object-geometry-origin={object3dObservability.geometryOrigin}
      data-stage-3dobj-contract={object3dVisualObservability.contract}
      data-stage-3dobj-enabled={object3dVisualObservability.enabled}
      data-stage-3dobj-kind={object3dVisualObservability.kind}
      data-stage-3dobj-depth={object3dVisualObservability.depth}
      data-stage-3dobj-bevel={object3dVisualObservability.bevel}
      data-stage-3dobj-profile={object3dVisualObservability.profile}
      data-stage-3dobj-material-role={object3dVisualObservability.materialRole}
      data-stage-3dobj-front-z={object3dVisualObservability.frontZ}
      data-stage-3dobj-back-z={object3dVisualObservability.backZ}
      data-stage-3dobj-surface-contract={object3dSurfaceObservabilityView.contract}
      data-stage-3dobj-surface-enabled={object3dSurfaceObservabilityView.enabled}
      data-stage-3dobj-symbol-kind={object3dSurfaceObservabilityView.symbolKind}
      data-stage-3dobj-surface-role={object3dSurfaceObservabilityView.surfaceRole}
      data-stage-3dobj-symbol-depth={object3dSurfaceObservabilityView.symbolDepth}
      data-stage-3dobj-symbol-scale={object3dSurfaceObservabilityView.symbolScale}
      data-stage-3dobj-face-inset={object3dSurfaceObservabilityView.faceInset}
      data-stage-3dobj-face-readability={
        object3dSurfaceObservabilityView.faceReadability
      }
      data-stage-3dobj-symbol-body-ratio={
        object3dSurfaceObservabilityView.symbolBodyRatio
      }
      data-stage-3dobj-symbol-contrast={
        object3dSurfaceObservabilityView.symbolContrast
      }
      data-stage-3dobj-territory-dominance={
        object3dSurfaceObservabilityView.territoryDominance
      }
      data-stage-3dobj-face-calibration={
        object3dSurfaceObservabilityView.calibration
      }
      data-stage-3dobj-form-contract={object3dFormObservability.contract}
      data-stage-3dobj-form-profile={object3dFormObservability.formProfile}
      data-stage-3dobj-aspect-ratio={object3dFormObservability.aspectRatio}
      data-stage-3dobj-front-scale={object3dFormObservability.frontScale}
      data-stage-3dobj-taper={object3dFormObservability.taper}
      data-stage-3dobj-recess-profile={object3dFormObservability.recessProfile}
      data-stage-3dobj-edge-profile={object3dFormObservability.edgeProfile}
      data-stage-3dobj-form-enabled={object3dFormObservability.enabled}
      data-stage-3dobj-symbol-visible={
        object3dSymbolsVisible && !object3dFormOnly ? "true" : "false"
      }
      data-stage-3dobj-territory-visible={
        object3dTerritoryVisible && !object3dFormOnly ? "true" : "false"
      }
      data-stage-3dobj-form-only={object3dFormOnly ? "true" : "false"}
      data-stage-object-presence={objectPresenceEnabled ? "v2" : "v1"}
      data-stage-object-presence-enabled={
        objectPresenceEnabled ? "true" : "false"
      }
      data-stage-object-presence-contract={presenceObservability.contract}
      data-stage-object-presence-identity={presenceIdentity.id}
      data-stage-object-presence-version={presenceIdentity.version}
      data-stage-object-presence-query={objectPresenceQuery}
      data-stage-label-contract={labelGrammarObservability.contract}
      data-stage-label-identity={labelGrammarIdentity.id}
      data-stage-label-version={labelGrammarIdentity.version}
      data-stage-label-visible-count={
        labelGrammarObservability.labelVisibleCount
      }
      data-stage-label-hidden-count={labelGrammarObservability.labelHiddenCount}
      data-stage-label-collision-count={
        labelGrammarObservability.labelCollisionCount
      }
      data-stage-label-overflow-count={
        labelGrammarObservability.labelOverflowCount
      }
      data-stage-primary-edge-count={labelGrammarObservability.primaryEdgeCount}
      data-stage-secondary-edge-count={
        labelGrammarObservability.secondaryEdgeCount
      }
      data-stage-edge-label-collision-count={
        labelGrammarObservability.edgeLabelCollisionCount
      }
      data-stage-sector-compression={
        labelGrammarObservability.sectorCompression
      }
      data-stage-visual-balance-contract={visualBalanceObservability.contract}
      data-stage-visual-balance-identity={visualBalanceIdentity.id}
      data-stage-visual-balance-version={visualBalanceIdentity.version}
      data-stage-anchor-count={visualBalanceObservability.anchorCount}
      data-stage-related-count={visualBalanceObservability.relatedCount}
      data-stage-peripheral-count={visualBalanceObservability.peripheralCount}
      data-stage-context-count={visualBalanceObservability.contextCount}
      data-stage-orphan-label-count={
        visualBalanceObservability.orphanLabelCount
      }
      data-stage-hard-overlap-count={
        visualBalanceObservability.hardOverlapCount
      }
      data-stage-min-gap={visualBalanceObservability.minGap}
      data-stage-unrelated-visible-edge-count={
        visualBalanceObservability.unrelatedVisibleEdgeCount
      }
      data-stage-visual-centroid-x={visualBalanceObservability.visualCentroidX}
      data-stage-visual-centroid-y={visualBalanceObservability.visualCentroidY}
      data-stage-reserved-region-collision-count={
        containmentObservability.reservedRegionCollisionCount
      }
      data-stage-containment-contract={containmentObservability.contract}
      data-stage-containment-identity={containmentIdentity.id}
      data-stage-containment-version={containmentIdentity.version}
      data-stage-containment-status={
        containmentObservability.containmentStatus
      }
      data-stage-boundary-violation-count={
        containmentObservability.boundaryViolationCount
      }
      data-stage-bottom-boundary-violation-count={
        containmentObservability.bottomBoundaryViolationCount
      }
      data-stage-contained-object-count={
        containmentObservability.containedObjectCount
      }
      data-stage-clipped-object-count={
        containmentObservability.clippedObjectCount
      }
      data-stage-thread-contract={threadObservability.contract}
      data-stage-thread-identity={threadIdentity.id}
      data-stage-thread-version={threadIdentity.version}
      data-stage-thread-state={threadObservability.threadState}
      data-stage-thread-anchor={threadObservability.threadAnchor}
      data-stage-thread-id={threadObservability.threadId}
      data-stage-thread-subject-count={threadObservability.subjectCount}
      data-stage-thread-problem-count={threadObservability.problemCount}
      data-stage-thread-scenario-count={threadObservability.scenarioCount}
      data-stage-thread-decision-count={threadObservability.decisionCount}
      data-stage-thread-execution-count={threadObservability.executionCount}
      data-stage-thread-selected-subject={threadObservability.selectedSubjectId}
      data-stage-thread-orphan-label-count={
        threadObservability.orphanLabelCount
      }
      data-stage-thread-clipped-object-count={
        threadObservability.clippedObjectCount
      }
      data-stage-thread-overlap-count={threadObservability.overlapCount}
      data-stage-thread-gateway-contract={threadObservability.fixContract}
      data-stage-thread-gateway-identity={gatewayIdentity.id}
      data-stage-thread-gateway-state={threadObservability.gatewayState}
      data-stage-thread-gateway-count={threadObservability.gatewayCount}
      data-stage-thread-gateway-visible={threadObservability.gatewayVisible}
      data-stage-thread-gateway-x={threadObservability.gatewayX}
      data-stage-thread-gateway-y={threadObservability.gatewayY}
      data-stage-thread-gateway-hit-target={
        threadObservability.gatewayHitTarget
      }
      data-stage-thread-gateway-overlap-count={
        threadObservability.gatewayOverlapCount
      }
      data-stage-thread-gateway-clipped={threadObservability.gatewayClipped}
      data-stage-thread-gateway-reserved-collision-count={
        threadObservability.gatewayReservedCollisionCount
      }
      data-stage-label-territory-contract={labelObservability.contract}
      data-stage-label-territory-identity={labelIdentity.id}
      data-stage-label-territory-version={labelIdentity.version}
      data-stage-label-territory-visible-count={labelObservability.visibleCount}
      data-stage-label-territory-hidden-count={labelObservability.hiddenCount}
      data-stage-label-territory-collision-count={labelObservability.collisionCount}
      data-stage-label-territory-body-overlap-count={labelObservability.bodyOverlapCount}
      data-stage-label-territory-owner-violation-count={
        labelObservability.ownerViolationCount
      }
      data-stage-label-territory-reserved-collision-count={
        labelObservability.reservedCollisionCount
      }
      data-stage-label-territory-clipped-count={labelObservability.clippedCount}
      data-stage-motion-contract="stage-motion-1"
      data-stage-motion-authority="stage-motion-1"
      data-stage-motion-easing="easeOutCubic"
      data-stage-motion-duration-ms={String(
        EXECUTIVE_STAGE_MOTION.topologyDurationMs,
      )}
      data-stage-motion-identity={motionIdentity.id}
      data-stage-motion-version={motionIdentity.version}
      data-focused-target-z={focusedTargetZ}
      tabIndex={0}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        minWidth: 0,
        minHeight: 0,
        overflow: "hidden",
        background: cockpit.stageBg,
        outline: "none",
      }}
    >
      <div
        data-testid="nexora-stage-atmosphere-overlay"
        aria-hidden="true"
        data-atmosphere-channel="stage-environment"
        data-atmosphere-mode={warRoomAtmosphere?.mode ?? atmosphereMode}
        style={stageAtmosphereOverlayStyle(warRoomAtmosphere, atmosphereMode)}
      />
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
        {`${
          focusedLabel
            ? `Focused subject: ${focusedLabel}. Presentation: ${presentationViewModel.state}`
            : `Overview · ${workspaceLabel}. Presentation: ${presentationViewModel.state}`
        }${
          warRoomAtmosphere?.accessibilityDescription
            ? ` ${warRoomAtmosphere.accessibilityDescription}`
            : ""
        }`}
      </div>

      <NexoraStageInteractionBreadcrumb
        breadcrumb={interaction.breadcrumb}
        canStepBack={interaction.canStepBack}
        canStepForward={interaction.canStepForward === true}
        breadcrumbHasOverflow={interaction.breadcrumbHasOverflow === true}
        breadcrumbHasOverflowBefore={
          interaction.breadcrumbHasOverflowBefore === true
        }
        breadcrumbHasOverflowAfter={
          interaction.breadcrumbHasOverflowAfter === true
        }
        currentObjectId={
          interaction.stage2dNavigationTrail?.activeObjectId ??
          interaction.focusedSubjectId
        }
        currentTrailIndex={
          interaction.stage2dNavigationTrail?.currentIndex ?? -1
        }
        onStepBack={onStepBack}
        onStepForward={onStepForward}
        onNavigateTrailIndex={onNavigateTrailIndex}
        onOverview={onOverview}
      />

      <NexoraPresentationStateSelector
        activePresentationState={presentationViewModel.state}
        capability={presentationViewModel.capability}
        onPresentationStateChange={onPresentationStateChange}
      />

      <NexoraExecutiveQueueOverlay
        entries={interaction.queueEntries ?? []}
        collectionHeaderLabel={interaction.collectionHeader?.label ?? null}
        onSelectCategory={(category) => {
          onSelectQueueCategory?.(category);
        }}
      />

      <details
        data-testid="nexora-stage-object-list"
        data-ux1-disclosure="objects"
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
          padding: "0.28rem 0.4rem 0.4rem",
          borderRadius: cockpit.radius.md,
          border: `1px solid ${cockpit.border}`,
          background: "rgba(8, 14, 24, 0.42)",
          backdropFilter: "blur(8px)",
        }}
      >
        <summary
          style={{
            listStyle: "none",
            cursor: "pointer",
            fontSize: "0.58rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: cockpit.muted,
            fontWeight: 600,
            fontFamily: "inherit",
          }}
        >
          Objects · {interaction.scene.objects.length}
        </summary>
        {interaction.scene.objects.map((object) => {
          const showKpi =
            object.focused &&
            presentationViewModel.state === "minimum" &&
            presentationViewModel.primaryKpi &&
            presentationViewModel.subjectId === object.id;
          const visual = visualPresentations[object.id];
          return (
            <div key={object.id}>
            <button
              type="button"
              data-testid={`nexora-stage-object-control-${object.id}`}
              data-visual-family="executive-object"
              data-role={object.role}
              data-canonical-id={object.id}
              data-status={object.status}
              data-attention={object.attention}
              data-focused={object.focused ? "true" : "false"}
              data-selected={object.selected ? "true" : "false"}
              data-nexograph-form-token={visual?.formToken ?? `form-executive-${object.kind}`}
              data-nexograph-state-token={visual?.stateToken ?? "state-neutral"}
              data-nexograph-halo={visual?.haloToken ?? "halo-none"}
              data-nexograph-scale={visual?.scaleToken ?? "size-equal"}
              data-nexograph-opacity={visual?.opacityToken ?? "opacity-full"}
              data-nexograph-focus={object.focused ? "true" : "false"}
              data-nexograph-selection={object.selected ? "true" : "false"}
              aria-description={visual?.accessibilityDescription}
              data-opacity={String(object.opacity)}
              data-scale={String(object.scale)}
              data-label-prominence={object.labelProminence}
              data-executive-visual-state={
                object.executiveVisualState ?? "normal"
              }
              data-state-marker={object.stateMarker ?? "none"}
              data-rim-intensity={String(object.rimIntensity ?? 0)}
              data-visual-audit="stage-object"
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
            {iconicObjects
              .filter((item) => item.ownerExecutiveObjectId === object.id)
              .map((item) => (
                <NexoraDecisionTheatreIconicSatellite
                  key={item.presentationId}
                  iconic={item}
                />
              ))}
            </div>
          );
        })}

        {interaction.contextNodes
          .filter((node) => node.role !== "source-anchor")
          .map((node) => {
            const isGateway =
              node.role === "collapsed-thread" &&
              node.gatewayMode === "discoverable-collapsed";
            const isQuietCollapse =
              node.role === "collapsed-thread" &&
              node.gatewayMode === "quiet-collapse";
            const gatewayCount =
              node.gatewayCount ?? node.collapsedMemberIds?.length ?? 0;
            return (
              <div key={node.id}>
              <button
                type="button"
                data-testid={`nexora-stage-context-control-${node.subjectId}`}
                data-visual-family="executive-object"
                data-role={node.role}
                data-kind={node.kind}
                data-canonical-id={node.id}
                data-context-subject={node.subjectId}
                data-gateway-mode={node.gatewayMode ?? undefined}
                data-gateway-count={
                  node.role === "collapsed-thread"
                    ? String(gatewayCount)
                    : undefined
                }
                data-opacity={String(node.opacity)}
                data-scale={String(node.scale)}
                data-context-visibility={
                  node.opacity >= 0.5 ? "revealed" : "hidden-or-background"
                }
                data-visual-audit={
                  isGateway
                    ? "stage-thread-gateway"
                    : isQuietCollapse
                      ? "stage-thread-collapse"
                      : "stage-context"
                }
                aria-pressed={node.focused}
                aria-expanded={
                  node.role === "collapsed-thread"
                    ? isQuietCollapse
                      ? true
                      : false
                    : undefined
                }
                aria-label={
                  isQuietCollapse
                    ? "Collapse Executive Thread"
                    : isGateway
                      ? `Open Executive Thread with ${gatewayCount} items`
                      : undefined
                }
                onClick={(event) => {
                  event.stopPropagation();
                  onSelectSubject(node.subjectId);
                }}
                style={{
                  border: isGateway
                    ? `1px solid ${cockpit.accent}`
                    : node.focused
                      ? `1px solid ${cockpit.accent}`
                      : `1px solid ${cockpit.border}`,
                  background: isGateway
                    ? "rgba(12, 24, 40, 0.88)"
                    : isQuietCollapse
                      ? "rgba(10, 18, 30, 0.72)"
                      : "rgba(8, 14, 24, 0.45)",
                  color: cockpit.textSoft,
                  fontSize: isGateway
                    ? "0.68rem"
                    : isQuietCollapse
                      ? "0.58rem"
                      : "0.58rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  textAlign: "left",
                  padding: isGateway
                    ? "0.42rem 0.72rem"
                    : "0.28rem 0.4rem",
                  borderRadius: isGateway || isQuietCollapse ? "999px" : "0.3rem",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  minWidth: isGateway ? "10.5rem" : undefined,
                  opacity: isQuietCollapse ? 0.82 : 1,
                }}
              >
                {isGateway || isQuietCollapse
                  ? node.label
                  : `${node.kind}: ${node.label}`}
              </button>
              {iconicObjects
                .filter((item) => item.ownerExecutiveObjectId === node.subjectId || item.ownerExecutiveObjectId === node.id)
                .map((item) => (
                  <NexoraDecisionTheatreIconicSatellite
                    key={item.presentationId}
                    iconic={item}
                  />
                ))}
              </div>
            );
          })}

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
      </details>

      <NexoraSubjectReport viewModel={presentationViewModel} />
      <NexoraSubjectOperation
        viewModel={presentationViewModel}
        onAction={onPresentationAction}
      />

      {/* STAGE-2D:1 — SP:1.3 camera navigation controls intentionally unmounted. */}

      {!webglSupported ? (
        fallback
      ) : (
        <StageErrorBoundary fallback={fallback}>
          <div
            data-testid="nexora-stage-canvas-host"
            style={{ position: "relative", width: "100%", height: "100%" }}
          >
            <NexoraStageCanvas
              presentation={fixedCameraInteraction}
              environment={environment}
              dataObjectStage={dataObjectStage}
              onSelectSubject={(id) => onSelectSubject(id)}
              onSelectDataObject={onSelectDataObject}
              onClearSelection={onClearSelection}
            />
            <NexoraStageRenderedBoundsTruthOverlay
              presentation={fixedCameraInteraction}
            />
          </div>
        </StageErrorBoundary>
      )}
    </div>
  );
}
