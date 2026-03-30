
import React, { useMemo } from "react";

export type ObjectPanelProps = {
  selected: {
    id: string;
    label?: string;
    type?: string;
    tags?: string[];
    summary?: string;
    one_liner?: string;
    shape?: string;
    base_color?: string;
    opacity?: number;
    scale?: number;
    resolved?: boolean;
    currentStatusSummary?: string | null;
  } | null;
  recentActions?: any[];
  resolveObjectLabel?: (id: string) => string;
  resolveTypeLabel?: (type: string) => string;
  onHoverStart?: (id: string) => void;
  onHoverEnd?: (id: string) => void;
  selectionLocked?: boolean;
  onToggleSelectionLock?: () => void;
};

const hasText = (v?: string) => typeof v === "string" && v.trim().length > 0;

const getActionTargetId = (action: any): string | null => {
  return (
    action?.object ??
    action?.id ??
    action?.target_id ??
    action?.targetId ??
    action?.value?.id ??
    action?.value?.target_id ??
    action?.value?.targetId ??
    null
  );
};

const formatNumber = (v?: number) =>
  typeof v === "number" && Number.isFinite(v)
    ? v % 1 === 0
      ? String(v)
      : v.toFixed(2)
    : "—";

export default function ObjectPanel({
  selected,
  recentActions = [],
  resolveObjectLabel,
  resolveTypeLabel,
  onHoverStart,
  onHoverEnd,
  selectionLocked,
  onToggleSelectionLock,
}: ObjectPanelProps) {
  if (!selected) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            flex: 1,
            minHeight: 0,
            minWidth: 0,
            overflow: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div style={{ padding: 12, fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
            No object selected. Click an object in the scene.
          </div>
        </div>
      </div>
    );
  }

  const safeLabel =
    (selected.label && selected.label.trim()) ||
    (resolveObjectLabel ? resolveObjectLabel(selected.id) : "") ||
    selected.id;

  const typeLabel =
    selected.type && resolveTypeLabel
      ? resolveTypeLabel(selected.type)
      : selected.type;

  const tags = Array.isArray(selected.tags) ? selected.tags : [];

  const activeId = selected.id;

  const relatedActions = useMemo(() => {
    if (!activeId || !Array.isArray(recentActions)) return [];
    return recentActions.filter(
      (action) => getActionTargetId(action) === activeId
    );
  }, [recentActions, activeId]);

  const recentForObject = relatedActions.slice(-5).reverse();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        minWidth: 0,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          flex: 1,
          minHeight: 0,
          minWidth: 0,
          overflow: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div
          style={{
            padding: 12,
            display: "grid",
            gap: 12,
          }}
        >
      {/* Header */}
      <div
        style={{ display: "flex", alignItems: "center", gap: 8 }}
        onMouseEnter={() => onHoverStart?.(selected.id)}
        onMouseLeave={() => onHoverEnd?.(selected.id)}
      >
        <div style={{ fontSize: 14, fontWeight: 700 }}>{safeLabel}</div>
        <span
          style={{
            fontSize: 10,
            padding: "2px 6px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.2)",
            opacity: 0.7,
          }}
        >
          {selected.id}
        </span>
        {onToggleSelectionLock ? (
          <button
            type="button"
            onClick={onToggleSelectionLock}
            onPointerDown={(e) => e.stopPropagation()}
            title={selectionLocked ? "Unpin selection" : "Pin selection"}
            style={{
              marginLeft: "auto",
              padding: "4px 8px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.18)",
              background: selectionLocked ? "rgba(255,180,0,0.18)" : "rgba(255,255,255,0.06)",
              color: selectionLocked ? "#ffb400" : "rgba(255,255,255,0.8)",
              fontSize: 11,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {selectionLocked ? "📌 Pinned" : "📌 Pin"}
          </button>
        ) : null}
      </div>

      {/* Basics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 8,
          fontSize: 12,
        }}
      >
        <div>
          <div style={{ opacity: 0.6 }}>Type</div>
          <div>{typeLabel || "—"}</div>
        </div>
        <div>
          <div style={{ opacity: 0.6 }}>Shape</div>
          <div>{selected.shape || "—"}</div>
        </div>
        <div>
          <div style={{ opacity: 0.6 }}>Base color</div>
          {selected.base_color ? (
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: selected.base_color,
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              />
              <span>{selected.base_color}</span>
            </div>
          ) : (
            <div>—</div>
          )}
        </div>
        <div>
          <div style={{ opacity: 0.6 }}>Opacity</div>
          <div>{formatNumber(selected.opacity)}</div>
        </div>
        <div>
          <div style={{ opacity: 0.6 }}>Scale</div>
          <div>{formatNumber(selected.scale)}</div>
        </div>
      </div>

      {/* Summary */}
      {hasText(selected.one_liner) || hasText(selected.summary) ? (
        <div style={{ fontSize: 12, opacity: 0.85 }}>
          {selected.one_liner || selected.summary}
        </div>
      ) : selected.resolved === false ? (
        <div style={{ fontSize: 12, opacity: 0.6 }}>
          {selected.currentStatusSummary || "Object not available in current scene."}
        </div>
      ) : tags.length === 0 ? (
        <div style={{ fontSize: 12, opacity: 0.6 }}>
          No additional scene context available for this object.
        </div>
      ) : null}

      {/* Tags */}
      {tags.length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: 11,
                padding: "4px 8px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.06)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Timeline */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.1)",
          paddingTop: 8,
          fontSize: 12,
        }}
      >
        <div style={{ opacity: 0.6, marginBottom: 6 }}>Recent Actions</div>

        {recentForObject.length === 0 ? (
          <div style={{ opacity: 0.6 }}>
            No recent actions for this object.
          </div>
        ) : (
          <div style={{ display: "grid", gap: 6 }}>
            {recentForObject.map((action, idx) => (
              <div key={idx} style={{ display: "grid", gap: 2 }}>
                <div style={{ fontSize: 12 }}>
                  {action?.type || action?.verb || "action"}
                </div>
                <div style={{ fontSize: 11, opacity: 0.65 }}>
                  {action?.color
                    ? `color: ${action.color}`
                    : action?.scale
                    ? `scale: ${formatNumber(action.scale)}`
                    : action?.position
                    ? `position`
                    : "—"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
        </div>
      </div>
    </div>
  );
}
