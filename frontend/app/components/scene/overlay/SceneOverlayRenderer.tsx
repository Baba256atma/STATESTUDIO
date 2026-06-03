"use client";

import React, { useMemo } from "react";

import {
  buildDecisionPathOverlaySignature,
  buildDecisionPathRendererState,
} from "../../overlays/DecisionPathOverlayLayer";
import { SceneRenderer } from "../../SceneRenderer";
import type { PropagationOverlayState } from "../../../lib/simulation/propagationTypes";
import type { DecisionPathOverlayState } from "../../../lib/simulation/decisionPathOverlayTypes";
import type { OverlayRuntimeVisibility } from "../../../lib/overlay/overlayContracts";
import { resolveOverlayThemeTokens } from "../../../lib/overlay/overlayTheme";
import type { SceneThemeId } from "../../../lib/theme/sceneThemeTypes";
import { DependencyOverlay } from "./DependencyOverlay";
import { PropagationOverlay } from "./PropagationOverlay";
import { RiskFlowOverlay } from "./RiskFlowOverlay";
import { ScenarioOverlay } from "./ScenarioOverlay";
import { RelationshipRenderer } from "../relationships/RelationshipRenderer";
import type { NexoraRelationship } from "../../../lib/relationships/relationshipTypes";
import { AuthoredPropagationOverlay } from "./AuthoredPropagationOverlay";
import type { PropagationPath } from "../../../lib/propagation/propagationAuthoringRuntime";
import { TimelineEventOverlayLayer } from "./TimelineEventOverlayLayer";
import type { SpatialTimeIntelligenceState } from "../../../lib/scene/timeline/spatialTimeIntelligenceTypes";
import { ScenarioPlaybackPropagationLayer } from "./ScenarioPlaybackPropagationLayer";
import type { ExecutiveScenarioPropagationView } from "../../../lib/scene/scenario/executiveScenarioPlaybackTypes";
import { MultiScenarioUniverseOverlayLayer } from "./MultiScenarioUniverseOverlayLayer";
import type { ExecutiveScenarioUniverseLayer, ScenarioUniverseLayoutMode } from "../../../lib/scene/scenario/executiveMultiScenarioUniverseTypes";
import { CognitiveTwinLivingStateOverlayLayer } from "./CognitiveTwinLivingStateOverlayLayer";
import type { CognitiveTwinTwinEntity } from "../../../lib/scene/twin/executiveCognitiveTwinTypes";
import type { RuntimeObjectPositionContext } from "../sceneRenderUtils";

export type SceneOverlayRendererProps = {
  sceneJson: any;
  objects: any[];
  themeId: SceneThemeId;
  runtimeObjectPositionContext?: RuntimeObjectPositionContext;
  visibility: OverlayRuntimeVisibility;
  propagationOverlay: PropagationOverlayState | null;
  decisionPathOverlay: DecisionPathOverlayState | null;
  decisionPathRenderInput: DecisionPathOverlayState | null;
  objectSelection: {
    highlighted_objects?: string[];
    risk_sources?: string[];
    risk_targets?: string[];
    dim_unrelated_objects?: boolean;
  } | null;
  selectedObjectId?: string | null;
  selectedRelationshipId?: string | null;
  selectedPropagationPathId?: string | null;
  onRelationshipSelect?: (relationship: NexoraRelationship) => void;
  onPropagationPathSelect?: (path: PropagationPath) => void;
  timelineSpatialState?: SpatialTimeIntelligenceState | null;
  scenarioPropagationView?: ExecutiveScenarioPropagationView | null;
  ghostScenarioLayers?: readonly ExecutiveScenarioUniverseLayer[];
  activeComparisonScenarioId?: string | null;
  comparisonLayoutMode?: ScenarioUniverseLayoutMode;
  twinLivingEntities?: readonly CognitiveTwinTwinEntity[];
  twinStressedRelationshipIds?: readonly string[];
  viewMode?: "2D" | "3D" | string | null;
  sceneRendererProps: Omit<
    React.ComponentProps<typeof SceneRenderer>,
    "sceneJson" | "objectSelection" | "propagationOverlay" | "decisionPathOverlay"
  >;
};

/**
 * E2:23 / E2:68 — Scene objects render outside overlay render-props to keep AnimatableObject mounted.
 */
function SceneOverlayRendererComponent(props: SceneOverlayRendererProps): React.ReactElement {
  const themeTokens = useMemo(() => resolveOverlayThemeTokens(props.themeId), [props.themeId]);
  const visiblePropagation = props.visibility.propagation ? props.propagationOverlay : null;
  const stableSceneJson = useMemo(
    () => ({
      ...props.sceneJson,
      scene: {
        ...(props.sceneJson?.scene ?? {}),
        objects: props.objects,
      },
    }),
    [props.objects, props.sceneJson]
  );
  const decisionPathSignature = useMemo(
    () => buildDecisionPathOverlaySignature(props.decisionPathRenderInput),
    [props.decisionPathRenderInput]
  );
  const decisionPathRenderState = useMemo(
    () => buildDecisionPathRendererState(props.decisionPathRenderInput),
    [decisionPathSignature]
  );
  const runtimeObjectPositionContext = props.runtimeObjectPositionContext;

  return (
    <>
      <SceneRenderer
        {...props.sceneRendererProps}
        sceneJson={stableSceneJson}
        objectSelection={props.objectSelection}
        propagationOverlay={visiblePropagation}
        decisionPathOverlay={props.visibility.scenario ? decisionPathRenderState : null}
        runtimeObjectPositionContext={runtimeObjectPositionContext}
      />
      <PropagationOverlay
        objects={props.objects}
        overlay={props.propagationOverlay}
        visible={props.visibility.propagation}
        themeTokens={themeTokens}
        runtimeObjectPositionContext={runtimeObjectPositionContext}
      />
      <AuthoredPropagationOverlay
        sceneJson={props.sceneJson}
        objects={props.objects}
        visible={props.visibility.propagation}
        themeTokens={themeTokens}
        selectedPathId={props.selectedPropagationPathId}
        onPropagationPathSelect={props.onPropagationPathSelect}
        runtimeObjectPositionContext={runtimeObjectPositionContext}
      />
      <RiskFlowOverlay
        objects={props.objects}
        visible={props.visibility.risk_flow}
        themeTokens={themeTokens}
        riskSources={props.objectSelection?.risk_sources}
        riskTargets={props.objectSelection?.risk_targets}
        propagation={props.propagationOverlay}
        runtimeObjectPositionContext={runtimeObjectPositionContext}
      />
      <ScenarioOverlay
        objects={props.objects}
        overlay={props.decisionPathOverlay}
        visible={props.visibility.scenario}
        themeTokens={themeTokens}
        runtimeObjectPositionContext={runtimeObjectPositionContext}
      />
      <DependencyOverlay
        objects={props.objects}
        sceneJson={props.sceneJson}
        visible={props.visibility.dependency}
        themeTokens={themeTokens}
        runtimeObjectPositionContext={runtimeObjectPositionContext}
      />
      <RelationshipRenderer
        sceneJson={props.sceneJson}
        objects={props.objects}
        themeId={props.themeId}
        selectedObjectId={props.selectedObjectId}
        selectedRelationshipId={props.selectedRelationshipId}
        emphasizedRelationshipIds={props.twinStressedRelationshipIds}
        onRelationshipSelect={props.onRelationshipSelect}
        runtimeObjectPositionContext={runtimeObjectPositionContext}
      />
      <TimelineEventOverlayLayer
        objects={props.objects}
        anchors={props.timelineSpatialState?.anchors ?? []}
        visibleAnchorIds={props.timelineSpatialState?.visibleAnchorIds ?? []}
        selectedEventId={props.timelineSpatialState?.selectedEventId}
        hoveredEventId={props.timelineSpatialState?.hoveredEventId}
        viewMode={props.viewMode}
        visible={Boolean(props.timelineSpatialState)}
      />
      <ScenarioPlaybackPropagationLayer
        objects={props.objects}
        view={props.scenarioPropagationView ?? null}
        visible={Boolean(props.scenarioPropagationView)}
        themeTokens={themeTokens}
        runtimeObjectPositionContext={runtimeObjectPositionContext}
      />
      <MultiScenarioUniverseOverlayLayer
        objects={props.objects}
        ghostLayers={props.ghostScenarioLayers ?? []}
        activeScenarioId={props.activeComparisonScenarioId ?? null}
        layoutMode={props.comparisonLayoutMode ?? "ghost"}
        visible={(props.ghostScenarioLayers?.length ?? 0) > 0}
      />
      <CognitiveTwinLivingStateOverlayLayer
        objects={props.objects}
        livingEntities={props.twinLivingEntities ?? []}
        visible={(props.twinLivingEntities?.length ?? 0) > 0}
      />
    </>
  );
}

export const SceneOverlayRenderer = React.memo(SceneOverlayRendererComponent);

export default SceneOverlayRenderer;
