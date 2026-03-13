import React from "react";

export type HUDHeaderFocusControlsProps = {
  focusMode: "all" | "selected";
  focusPinned: boolean;
  focusedId: string | null;
  selectedObjectId: string | null;
  loops: Array<{ id: string; label?: string; type?: string }>;
  activeLoopId: string | null;
  onSetFocusMode: (mode: "all" | "selected") => void;
  onTogglePin: () => void;
  onSetActiveLoop: (id: string | null) => void;
};

export function HUDHeaderFocusControls(props: HUDHeaderFocusControlsProps) {
  const {
    focusMode,
    focusPinned,
    focusedId,
    selectedObjectId,
    loops,
    activeLoopId,
    onSetFocusMode,
    onTogglePin,
    onSetActiveLoop,
  } = props;

  const canPin = !!(focusedId ?? selectedObjectId);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 8,
        padding: "8px 10px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        fontSize: 11,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        <span style={{ opacity: 0.7 }}>Focus</span>

        <button
          type="button"
          onClick={() => onSetFocusMode("all")}
          style={{
            padding: "4px 8px",
            borderRadius: 999,
            border: "1px solid rgba(255, 255, 255, 0.14)",
            background:
              focusMode === "all"
                ? "rgba(34, 211, 238, 0.18)"
                : "rgba(255, 255, 255, 0.06)",
            color: "rgba(255, 255, 255, 0.9)",
            cursor: "pointer",
          }}
        >
          All
        </button>

        <button
          type="button"
          onClick={() => onSetFocusMode("selected")}
          style={{
            padding: "4px 8px",
            borderRadius: 999,
            border: "1px solid rgba(255, 255, 255, 0.14)",
            background:
              focusMode === "selected"
                ? "rgba(34, 211, 238, 0.18)"
                : "rgba(255, 255, 255, 0.06)",
            color: "rgba(255, 255, 255, 0.9)",
            cursor: "pointer",
          }}
        >
          Selected
        </button>

        <button
          type="button"
          disabled={!focusPinned}
          style={{
            padding: "4px 8px",
            borderRadius: 999,
            border: "1px solid rgba(255, 255, 255, 0.14)",
            background: "rgba(255, 255, 255, 0.06)",
            color: "rgba(255, 255, 255, 0.9)",
            cursor: "not-allowed",
            opacity: focusPinned ? 1 : 0.5,
          }}
        >
          Pinned
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <button
          type="button"
          onClick={onTogglePin}
          disabled={!canPin}
          style={{
            padding: "4px 8px",
            borderRadius: 999,
            border: "1px solid rgba(255, 255, 255, 0.14)",
            background: "rgba(255, 255, 255, 0.06)",
            color: "rgba(255, 255, 255, 0.9)",
            cursor: canPin ? "pointer" : "not-allowed",
            opacity: canPin ? 1 : 0.5,
          }}
        >
          {focusPinned ? "Unpin" : "Pin"}
        </button>
      </div>

      <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ opacity: 0.7 }}>Active loop</span>
        <select
          value={activeLoopId ?? ""}
          onChange={(e) =>
            onSetActiveLoop(e.target.value ? e.target.value : null)
          }
          style={{
            background: "rgba(0, 0, 0, 0.4)",
            color: "white",
            border: "1px solid rgba(255, 255, 255, 0.14)",
            borderRadius: 10,
            padding: "4px 6px",
            fontSize: 11,
            maxWidth: 220,
          }}
        >
          <option value="">No active loop</option>
          {Array.isArray(loops)
            ? loops.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label ?? l.id}
                </option>
              ))
            : null}
        </select>
      </label>
    </div>
  );
}
