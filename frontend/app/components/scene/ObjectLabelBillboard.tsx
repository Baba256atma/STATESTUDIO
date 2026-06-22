"use client";

import React, { useEffect } from "react";
import { Billboard } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

import type { WorkspaceViewMode } from "../../lib/workspace/workspaceViewModeTypes";
import {
  emitBillboardLabelActive,
  emitBillboardLabelCameraFacingEnabled,
  emitBillboardLabelMounted,
  resolveObjectCaptionBillboardState,
  trackBillboardLabelOrientationUpdated,
} from "../../lib/scene/objectCaptionBillboardRuntime";

export type ObjectLabelBillboardProps = {
  objectId: string;
  viewMode: WorkspaceViewMode;
  position: [number, number, number];
  children: React.ReactNode;
};

export function ObjectLabelBillboard({
  objectId,
  viewMode,
  position,
  children,
}: ObjectLabelBillboardProps): React.ReactElement {
  const { billboardEnabled } = resolveObjectCaptionBillboardState(viewMode);

  useEffect(() => {
    emitBillboardLabelMounted(objectId, viewMode);
    if (!billboardEnabled) return;
    emitBillboardLabelCameraFacingEnabled(objectId, viewMode);
    emitBillboardLabelActive(objectId, viewMode);
  }, [billboardEnabled, objectId, viewMode]);

  useFrame(({ camera }) => {
    if (process.env.NODE_ENV === "production" || !billboardEnabled) return;
    trackBillboardLabelOrientationUpdated(camera, objectId);
  });

  if (!billboardEnabled) {
    return <group position={position}>{children}</group>;
  }

  return (
    <group position={position}>
      <Billboard follow>{children}</Billboard>
    </group>
  );
}

export default ObjectLabelBillboard;
