"use client";

import React from "react";

import {
  logSceneHudZoneContract,
  resolveSceneHudZoneContract,
  SCENE_HUD_ZONE_IDS,
  type SceneHudZoneContract,
  type SceneHudZoneContractContext,
  type SceneHudZoneId,
  zoneShellStyle,
} from "../../lib/scene/sceneHudZoneContract";
import { auditHudZoneContract } from "../../lib/hud/hudZoneAuditRuntime";
import { traceObjectPanelSafeZoneFromHudContract } from "../../lib/hud/objectPanelSafeZoneTrace";
import { traceTimelineZoneFromHudContract } from "../../lib/hud/timelineZoneLayoutBridge";
import {
  commitTimelineWidthSnapshot,
  readTimelineWidthSnapshot,
} from "../../lib/hud/timelineWidthContract";
import {
  traceTimelineResize,
  traceTimelineWidthContract,
} from "../../lib/hud/timeline131RuntimeDiagnostics";
import {
  runHudRuntimeFreezeValidation,
} from "../../lib/hud/hudRuntimeFreezeValidation";
import { traceHudRuntimeFreeze } from "../../lib/hud/hudRuntimeFreezeDiagnostics";
import { shouldUseVisibleMrpRightRailHost } from "../../lib/ui/mainRightPanelVisibleHostRuntime";
import {
  getPanelGovernanceSnapshot,
  subscribePanelGovernance,
} from "../../lib/workspace/panelGovernanceRuntime";

const SceneHudZoneContext = React.createContext<SceneHudZoneContract | null>(null);

export function useSceneHudZoneContract(): SceneHudZoneContract {
  const contract = React.useContext(SceneHudZoneContext);
  if (!contract) {
    throw new Error("useSceneHudZoneContract must be used within SceneHudZoneLayout");
  }
  return contract;
}

export type SceneHudZoneLayoutProps = {
  context: SceneHudZoneContractContext;
  children: React.ReactNode;
};

export function SceneHudZoneLayout(props: SceneHudZoneLayoutProps): React.ReactElement {
  const layoutRef = React.useRef<HTMLDivElement>(null);
  const [sceneBounds, setSceneBounds] = React.useState<{ width: number; height: number } | null>(null);
  const scenePanelCollapsed = React.useSyncExternalStore(
    subscribePanelGovernance,
    () =>
      getPanelGovernanceSnapshot().find((record) => record.panelId === "sceneInfoHud")?.collapsed ??
      false,
    () => false
  );

  React.useLayoutEffect(() => {
    const node = layoutRef.current;
    if (!node || typeof ResizeObserver === "undefined") return;

    const commitBounds = (width: number, height: number) => {
      const nextWidth = Math.max(0, Math.round(width));
      const nextHeight = Math.max(0, Math.round(height));
      setSceneBounds((previous) =>
        previous?.width === nextWidth && previous?.height === nextHeight
          ? previous
          : { width: nextWidth, height: nextHeight }
      );
    };

    commitBounds(node.clientWidth, node.clientHeight);
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      commitBounds(entry.contentRect.width, entry.contentRect.height);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const contract = React.useMemo(
    () =>
      resolveSceneHudZoneContract({
        ...props.context,
        scenePanelCollapsed,
        sceneWidth: sceneBounds?.width,
        sceneHeight: sceneBounds?.height,
      }),
    [
      props.context.mainRightPanelVisible,
      props.context.mainRightPanelWidth,
      props.context.objectPanelExpanded,
      props.context.scenePanelVisible,
      props.context.timelineHeightMode,
      props.context.timelineVisible,
      props.context.topBarVisible,
      props.context.viewportHeight,
      props.context.viewportWidth,
      sceneBounds?.height,
      sceneBounds?.width,
      scenePanelCollapsed,
    ]
  );

  React.useEffect(() => {
    logSceneHudZoneContract(contract);
    const previousSnapshot = readTimelineWidthSnapshot();
    const widthSnapshot = commitTimelineWidthSnapshot(contract.sceneWidth);
    if (widthSnapshot) {
      traceTimelineWidthContract(widthSnapshot);
      if (previousSnapshot.timelineTargetWidth > 0) {
        traceTimelineResize({
          previousWidth: previousSnapshot.timelineTargetWidth,
          nextWidth: widthSnapshot.timelineTargetWidth,
          sceneVisibleWidth: widthSnapshot.sceneVisibleWidth,
        });
      }
    }
    auditHudZoneContract({
      sceneHudContract: contract,
      useVisibleMrpHost: shouldUseVisibleMrpRightRailHost(),
    });
    traceObjectPanelSafeZoneFromHudContract(contract, {
      mainRightPanelWidth: props.context.mainRightPanelWidth,
      mainRightPanelVisible: props.context.mainRightPanelVisible,
      objectPanelExpanded: props.context.objectPanelExpanded,
      sceneWidth: sceneBounds?.width,
    });
    traceTimelineZoneFromHudContract(contract, {
      mainRightPanelWidth: props.context.mainRightPanelWidth,
      mainRightPanelVisible: props.context.mainRightPanelVisible,
      timelineHeightMode: props.context.timelineHeightMode,
      timelineVisible: props.context.timelineVisible,
      sceneWidth: sceneBounds?.width,
    });
    traceHudRuntimeFreeze(
      runHudRuntimeFreezeValidation({
        sceneHudContract: contract,
        context: {
          mainRightPanelWidth: props.context.mainRightPanelWidth,
          mainRightPanelVisible: props.context.mainRightPanelVisible,
          objectPanelExpanded: props.context.objectPanelExpanded,
          timelineHeightMode: props.context.timelineHeightMode,
          timelineVisible: props.context.timelineVisible,
          sceneWidth: sceneBounds?.width,
        },
        useVisibleMrpHost: shouldUseVisibleMrpRightRailHost(),
      })
    );
  }, [contract, props.context.mainRightPanelVisible, props.context.mainRightPanelWidth, props.context.objectPanelExpanded, props.context.timelineHeightMode, props.context.timelineVisible, sceneBounds?.width]);

  return (
    <SceneHudZoneContext.Provider value={contract}>
      <div
        ref={layoutRef}
        data-nx="scene-hud-zone-layout"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        {props.children}
      </div>
    </SceneHudZoneContext.Provider>
  );
}

export type SceneHudZoneProps = {
  zone: SceneHudZoneId;
  visible?: boolean;
  children?: React.ReactNode;
};

export function SceneHudZone(props: SceneHudZoneProps): React.ReactElement | null {
  const contract = useSceneHudZoneContract();
  if (props.visible === false) return null;

  return (
    <div data-nx-zone={props.zone} style={zoneShellStyle(contract, props.zone)}>
      {props.children}
    </div>
  );
}

export { SCENE_HUD_ZONE_IDS };

export default SceneHudZoneLayout;
