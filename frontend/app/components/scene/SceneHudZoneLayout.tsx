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
    ]
  );

  React.useEffect(() => {
    logSceneHudZoneContract(contract);
  }, [contract]);

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
