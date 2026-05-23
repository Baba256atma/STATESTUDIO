"use client";

import React from "react";

import { getAllRelationshipTypeDefinitions } from "../../lib/relationships/relationshipRegistry";
import type { NexoraRelationshipType } from "../../lib/relationships/relationshipTypes";
import type { SceneThemeTokens } from "../../lib/theme/sceneThemeTypes";
import { sceneHudChipStyle } from "../../lib/theme/sceneThemeTokens";

export type RelationshipTypePickerProps = {
  value: NexoraRelationshipType;
  tokens: SceneThemeTokens;
  onChange: (type: NexoraRelationshipType) => void;
};

export function RelationshipTypePicker(props: RelationshipTypePickerProps): React.ReactElement {
  const types = getAllRelationshipTypeDefinitions();

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {types.map((type) => (
        <button
          key={type.id}
          type="button"
          aria-pressed={props.value === type.id}
          title={type.description}
          onClick={() => props.onChange(type.id)}
          style={{
            ...sceneHudChipStyle(props.tokens, props.value === type.id),
            padding: "6px 10px",
            cursor: "pointer",
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          {type.label}
        </button>
      ))}
    </div>
  );
}

export default RelationshipTypePicker;
