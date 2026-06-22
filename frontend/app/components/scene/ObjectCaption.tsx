"use client";

import React from "react";
import { Html } from "@react-three/drei";

import type { WorkspaceViewMode } from "../../lib/workspace/workspaceViewModeTypes";
import { resolveObjectCaptionBillboardState } from "../../lib/scene/objectCaptionBillboardRuntime";
import type { getThemeTokens } from "../../lib/design/designTokens";
import { ObjectLabelBillboard } from "./ObjectLabelBillboard";

export type ObjectCaptionProps = {
  objectId: string;
  viewMode: WorkspaceViewMode;
  position: [number, number, number];
  captionText: string;
  fontSizePx: number;
  opacity: number;
  tokens: ReturnType<typeof getThemeTokens>;
};

export function ObjectCaption({
  objectId,
  viewMode,
  position,
  captionText,
  fontSizePx,
  opacity,
  tokens,
}: ObjectCaptionProps): React.ReactElement {
  const { billboardEnabled } = resolveObjectCaptionBillboardState(viewMode);

  return (
    <ObjectLabelBillboard objectId={objectId} viewMode={viewMode} position={position}>
      <Html
        center
        transform={billboardEnabled}
        style={{ pointerEvents: "none" }}
      >
        <div
          style={{
            fontSize: fontSizePx || tokens.design.typography.sm,
            opacity,
            padding: `${tokens.design.spacing.xs}px ${tokens.design.spacing.sm}px`,
            background: tokens.theme === "day" ? "rgba(15,23,42,0.68)" : "rgba(0,0,0,0.55)",
            color: tokens.design.colors.textPrimary,
            borderRadius: tokens.design.radius.sm,
            whiteSpace: "nowrap",
          }}
        >
          {captionText}
        </div>
      </Html>
    </ObjectLabelBillboard>
  );
}

export default ObjectCaption;
