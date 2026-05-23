"use client";

import React from "react";
import { Html } from "@react-three/drei";

import type { RelationshipVisualTokens } from "../../../lib/relationships/relationshipTheme";

export type RelationshipLabelProps = {
  position: [number, number, number];
  text: string;
  tokens: RelationshipVisualTokens;
};

export function RelationshipLabel(props: RelationshipLabelProps): React.ReactElement {
  return (
    <Html position={props.position} center transform={false} style={{ pointerEvents: "none" }}>
      <span
        style={{
          display: "inline-block",
          padding: "2px 6px",
          borderRadius: 999,
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: props.tokens.labelColor,
          background: "color-mix(in srgb, var(--nx-bg-deep) 72%, transparent)",
          border: `1px solid color-mix(in srgb, ${props.tokens.lineColor} 28%, transparent)`,
          whiteSpace: "nowrap",
          opacity: 0.92,
        }}
      >
        {props.text}
      </span>
    </Html>
  );
}

export default RelationshipLabel;
