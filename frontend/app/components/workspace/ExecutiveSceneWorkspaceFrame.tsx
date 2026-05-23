"use client";

import type React from "react";
import { useEffect } from "react";

import { logExecutiveSceneZoneReady } from "../../lib/ui/executiveWorkspaceInstrumentation";
import { executiveSceneHostStyle, executiveSceneCanvasShellStyle } from "../executive/executiveProductSurfaceStyles";

export type ExecutiveSceneWorkspaceFrameProps = {
  children: React.ReactNode;
  objectCount?: number;
  /** When set, constrains the Three.js canvas region (HomeScreen center workflow). */
  canvasBottomInset?: number | string;
};

/**
 * E2:2 executive scene zone — primary workspace surface inside `nexora-stage`.
 */
export function ExecutiveSceneWorkspaceFrame(props: ExecutiveSceneWorkspaceFrameProps): React.ReactElement {
  useEffect(() => {
    logExecutiveSceneZoneReady({
      objectCount: props.objectCount ?? 0,
      viewportWidth: typeof window !== "undefined" ? window.innerWidth : 0,
    });
  }, [props.objectCount]);

  return (
    <div
      className="nx-executive-scene-host nx-executive-scene-zone"
      data-nx-zone="scene"
      style={executiveSceneHostStyle}
    >
      {props.children}
    </div>
  );
}

export function ExecutiveSceneCanvasShell(props: {
  children: React.ReactNode;
  bottomInset?: number | string;
}): React.ReactElement {
  const bottom = props.bottomInset ?? 0;
  return (
    <div className="nx-executive-scene-canvas-shell" style={executiveSceneCanvasShellStyle(bottom)}>
      {props.children}
    </div>
  );
}
