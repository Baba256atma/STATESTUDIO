import { cockpit } from "../../exs1/shell/executiveCockpitTheme.ts";

export function NexoraStageDataControl({ open, attention, guidedAttentionCue = null, onToggle }: Readonly<{
  open: boolean;
  attention: boolean;
  guidedAttentionCue?: "SOFT_HALO" | "EMPHASIS" | null;
  onToggle: () => void;
}>): React.ReactElement {
  const guided = guidedAttentionCue != null;
  return <button
    type="button"
    data-testid="nexora-stage-data-control"
    data-data-rail-open={open ? "true" : "false"}
    data-guided-attention-target="DATA_ENTRY"
    data-guided-attention-cue={guidedAttentionCue ?? "none"}
    data-guided-attention-active={guided ? "true" : "false"}
    aria-label={open ? "Close Data" : "Open Data"}
    aria-pressed={open}
    onClick={onToggle}
    style={{
      position: "absolute", left: "0.75rem", bottom: "0.75rem", zIndex: 8,
      minWidth: "4.7rem", minHeight: "2.15rem", padding: "0.42rem 0.68rem",
      display: "flex", alignItems: "center", justifyContent: "center", gap: "0.42rem",
      border: `1px solid ${guided ? cockpit.accent : open ? cockpit.borderStrong : cockpit.border}`,
      borderRadius: cockpit.radius.pill,
      background: open ? "rgba(12,25,42,0.96)" : "rgba(8,14,24,0.78)",
      color: open ? cockpit.accent : cockpit.textSoft,
      boxShadow: guidedAttentionCue === "SOFT_HALO"
        ? `0 0 0 1px ${cockpit.accent}, 0 0 18px rgba(56,189,248,0.28)`
        : open ? cockpit.elevation.focus : cockpit.elevation.raised,
      backdropFilter: "blur(12px)", cursor: "pointer", fontFamily: "inherit",
      fontSize: "0.6rem", fontWeight: 650, letterSpacing: "0.12em", textTransform: "uppercase",
      transition: cockpit.transition,
      outline: guidedAttentionCue === "EMPHASIS" ? `2px solid ${cockpit.accent}` : "none",
      outlineOffset: guidedAttentionCue === "EMPHASIS" ? 2 : 0,
    }}
  ><span aria-hidden style={{ color: attention ? cockpit.warning : cockpit.accent }}>◇</span>Data{attention ? <span aria-label="Data needs attention" style={{ width: 6, height: 6, borderRadius: 999, background: cockpit.warning }} /> : null}</button>;
}
