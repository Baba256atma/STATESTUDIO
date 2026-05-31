"use client";

import React from "react";
import { Html } from "@react-three/drei";

import type { RelationshipVisualTokens } from "../../../lib/relationships/relationshipTheme";

export type RelationshipLabelProps = {
  position: [number, number, number];
  text: string;
  tokens: RelationshipVisualTokens;
  compact?: boolean;
  billboard?: boolean;
};

export function RelationshipLabel(props: RelationshipLabelProps): React.ReactElement {
  return (
    <Html position={props.position} center transform={props.billboard ?? false} style={{ pointerEvents: "none" }}>
      <span
        style={{
          display: "inline-block",
          padding: props.compact ? "1px 4px" : "2px 6px",
          borderRadius: 999,
          fontSize: props.compact ? 8 : 9,
          fontWeight: 700,
          letterSpacing: "0.04em",
          textTransform: "none",
          color: props.tokens.labelColor,
          background: "color-mix(in srgb, var(--nx-bg-deep) 62%, transparent)",
          border: `1px solid color-mix(in srgb, ${props.tokens.lineColor} 22%, transparent)`,
          whiteSpace: "nowrap",
          opacity: props.compact ? 0.72 : 0.88,
        }}
      >
        {props.text}
      </span>
    </Html>
  );
}

export default RelationshipLabel;
