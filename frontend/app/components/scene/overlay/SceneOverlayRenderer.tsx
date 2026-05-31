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

export type SceneOverlayRendererProps = {
  sceneJson: any;
  objects: any[];
  themeId: SceneThemeId;
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

  return (
    <>
      <SceneRenderer
        {...props.sceneRendererProps}
        sceneJson={stableSceneJson}
        objectSelection={props.objectSelection}
        propagationOverlay={visiblePropagation}
        decisionPathOverlay={props.visibility.scenario ? decisionPathRenderState : null}
      />
      <PropagationOverlay
        objects={props.objects}
        overlay={props.propagationOverlay}
        visible={props.visibility.propagation}
        themeTokens={themeTokens}
      />
      <AuthoredPropagationOverlay
        sceneJson={props.sceneJson}
        objects={props.objects}
        visible={props.visibility.propagation}
        themeTokens={themeTokens}
        selectedPathId={props.selectedPropagationPathId}
        onPropagationPathSelect={props.onPropagationPathSelect}
      />
      <RiskFlowOverlay
        objects={props.objects}
        visible={props.visibility.risk_flow}
        themeTokens={themeTokens}
        riskSources={props.objectSelection?.risk_sources}
        riskTargets={props.objectSelection?.risk_targets}
        propagation={props.propagationOverlay}
      />
      <ScenarioOverlay
        objects={props.objects}
        overlay={props.decisionPathOverlay}
        visible={props.visibility.scenario}
        themeTokens={themeTokens}
      />
      <DependencyOverlay
        objects={props.objects}
        sceneJson={props.sceneJson}
        visible={props.visibility.dependency}
        themeTokens={themeTokens}
      />
      <RelationshipRenderer
        sceneJson={props.sceneJson}
        objects={props.objects}
        themeId={props.themeId}
        selectedObjectId={props.selectedObjectId}
        selectedRelationshipId={props.selectedRelationshipId}
        onRelationshipSelect={props.onRelationshipSelect}
      />
    </>
  );
}

export const SceneOverlayRenderer = React.memo(SceneOverlayRendererComponent);

export default SceneOverlayRenderer;
