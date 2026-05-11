"use client";

import type { ReactElement } from "react";
import { useMemo } from "react";

import {
  getAddObjectMenuItemsForDomain,
  type AddObjectMenuItem,
} from "../../lib/domain/domainAddObjectAdapter.ts";

export type DomainObjectCatalogPanelProps = {
  domainId: unknown;
  onSelectObject?: (item: AddObjectMenuItem) => void;
};

const panelStyle = {
  width: 360,
  maxWidth: "100%",
  borderRadius: 12,
  border: "1px solid rgba(148, 163, 184, 0.16)",
  background: "rgba(15, 23, 42, 0.82)",
  color: "rgba(241, 245, 249, 0.94)",
  padding: 14,
} as const;

const rowStyle = {
  display: "grid",
  gridTemplateColumns: "1fr auto",
  gap: 10,
  padding: "10px 0",
  borderTop: "1px solid rgba(148, 163, 184, 0.12)",
} as const;

const tagStyle = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: 20,
  borderRadius: 999,
  border: "1px solid rgba(148, 163, 184, 0.14)",
  background: "rgba(2, 6, 23, 0.34)",
  color: "rgba(203, 213, 225, 0.9)",
  padding: "0 7px",
  fontSize: 10,
  fontWeight: 750,
  textTransform: "uppercase",
  letterSpacing: 0.4,
} as const;

const buttonStyle = {
  alignSelf: "center",
  borderRadius: 8,
  border: "1px solid rgba(125, 211, 252, 0.22)",
  background: "rgba(14, 165, 233, 0.12)",
  color: "rgba(224, 242, 254, 0.94)",
  cursor: "pointer",
  fontSize: 11,
  fontWeight: 800,
  padding: "6px 10px",
} as const;

const disabledButtonStyle = {
  ...buttonStyle,
  cursor: "not-allowed",
  opacity: 0.52,
} as const;

export function DomainObjectCatalogPanel({
  domainId,
  onSelectObject,
}: DomainObjectCatalogPanelProps): ReactElement {
  const items = useMemo(() => getAddObjectMenuItemsForDomain(domainId), [domainId]);

  return (
    <section data-nx="domain-object-catalog-panel" aria-label="Domain object catalog" style={panelStyle}>
      <div style={{ color: "#7dd3fc", fontSize: 11, fontWeight: 850, letterSpacing: 0.8, textTransform: "uppercase" }}>
        Object Catalog
      </div>
      <h2 style={{ margin: "6px 0 4px", fontSize: 16, lineHeight: 1.2 }}>Domain Objects</h2>
      <p style={{ margin: "0 0 10px", color: "rgba(203, 213, 225, 0.82)", fontSize: 12, lineHeight: 1.45 }}>
        Choose a domain template. Selection is passive unless an add handler is provided.
      </p>

      {items.map((item) => (
        <div key={item.id} style={rowStyle}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800 }}>{item.label}</div>
            <div style={{ marginTop: 4, color: "rgba(203, 213, 225, 0.82)", fontSize: 11, lineHeight: 1.4 }}>
              {item.description}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 7 }}>
              <span style={tagStyle}>{item.role}</span>
              <span style={tagStyle}>{item.iconHint}</span>
              <span style={tagStyle}>{item.colorHint}</span>
            </div>
          </div>
          <button
            type="button"
            disabled={!onSelectObject}
            onClick={() => onSelectObject?.(item)}
            style={onSelectObject ? buttonStyle : disabledButtonStyle}
          >
            Add
          </button>
        </div>
      ))}
    </section>
  );
}

export default DomainObjectCatalogPanel;
