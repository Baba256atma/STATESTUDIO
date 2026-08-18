import type {
  ExecutiveContextSnapshot,
  ExecutiveThemeMode,
} from "./executiveCockpitTypes";
import { cockpit } from "./executiveCockpitTheme";

type Props = {
  readonly context: ExecutiveContextSnapshot;
  readonly onThemeChange: (theme: ExecutiveThemeMode) => void;
  /** UX:1 — manager-first labels and secondary Display disclosure. */
  readonly compact?: boolean;
  readonly onHelp?: () => void;
};

function Chip({
  label,
  value,
  accent,
}: {
  readonly label: string;
  readonly value: string;
  readonly accent?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: "0.4rem",
        minWidth: 0,
      }}
    >
      <span
        style={{
          fontSize: "0.62rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: cockpit.lowMuted,
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: "0.78rem",
          fontWeight: 500,
          letterSpacing: "0.02em",
          color: accent ? cockpit.accent : cockpit.text,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {value}
      </span>
    </div>
  );
}

const THEMES: readonly ExecutiveThemeMode[] = ["night", "day", "auto"];

/**
 * Executive Context Bar — always visible executive context only.
 * No workspace controls.
 */
export function ExecutiveContextBar({
  context,
  onThemeChange,
  compact = false,
  onHelp,
}: Props) {
  return (
    <header
      data-testid="executive-context-bar"
      data-exs1-compat="exs1-context-bar"
      data-ux1-region={compact ? "executive-context" : undefined}
      aria-label="Executive Context"
      style={{
        display: "flex",
        alignItems: "center",
        gap: compact ? "1rem" : "1.25rem",
        height: compact ? cockpit.contextCompactHeight : cockpit.contextHeight,
        padding: "0 1rem 0 0.75rem",
        background: compact
          ? cockpit.charcoal
          : `linear-gradient(180deg, ${cockpit.graphite} 0%, ${cockpit.charcoal} 100%)`,
        borderBottom: `1px solid ${cockpit.border}`,
        flexShrink: 0,
        zIndex: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.55rem",
          paddingRight: "1rem",
          borderRight: `1px solid ${cockpit.border}`,
          flexShrink: 0,
        }}
      >
        <div
          aria-hidden
          style={{
            width: "1.35rem",
            height: "1.35rem",
            borderRadius: "0.3rem",
            border: `1px solid ${cockpit.borderStrong}`,
            background: `linear-gradient(135deg, ${cockpit.accentSoft}, ${cockpit.navy})`,
            boxShadow: `0 0 12px ${cockpit.accentGlow}`,
          }}
        />
        <span
          style={{
            fontSize: "0.82rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            color: cockpit.text,
          }}
        >
          Nexora
        </span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1.35rem",
          flex: 1,
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        <Chip label="Company" value={context.company} />
        <Chip
          label={compact ? "Workspace" : "Model"}
          value={compact ? context.pack : context.model}
        />
        {compact ? null : <Chip label="Pack" value={context.pack} accent />}
        <Chip
          label={compact ? "Period" : "Lens"}
          value={context.lens}
          accent={compact}
        />
      </div>

      {compact ? (
        <details
          data-testid="executive-context-display"
          style={{
            position: "relative",
            flexShrink: 0,
          }}
        >
          <summary
            style={{
              listStyle: "none",
              cursor: "pointer",
              fontSize: "0.58rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: cockpit.lowMuted,
              padding: "0.22rem 0.4rem",
              border: `1px solid ${cockpit.border}`,
              borderRadius: "0.3rem",
              fontFamily: "inherit",
            }}
          >
            Display
          </summary>
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "calc(100% + 0.35rem)",
              zIndex: 30,
              minWidth: "11rem",
              padding: "0.55rem 0.6rem",
              borderRadius: cockpit.radius.md,
              border: `1px solid ${cockpit.border}`,
              background: cockpit.charcoal,
              boxShadow: cockpit.elevation.panel,
              display: "flex",
              flexDirection: "column",
              gap: "0.45rem",
            }}
          >
            <Chip label="Model" value={context.model} />
            <ThemeControls context={context} onThemeChange={onThemeChange} />
            {onHelp ? (
              <button
                type="button"
                data-testid="executive-context-help"
                onClick={onHelp}
                style={{
                  border: "none",
                  background: "transparent",
                  color: cockpit.accent,
                  fontSize: "0.62rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  textAlign: "left",
                  padding: 0,
                }}
              >
                Help
              </button>
            ) : null}
          </div>
        </details>
      ) : (
        <ThemeControls context={context} onThemeChange={onThemeChange} />
      )}

      <div
        data-testid="executive-live-status"
        data-exs1-compat="exs1-data-status"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.45rem",
          flexShrink: 0,
        }}
      >
        <span
          aria-hidden
          style={{
            width: "0.45rem",
            height: "0.45rem",
            borderRadius: "999px",
            background: cockpit.success,
            boxShadow: `0 0 8px ${cockpit.success}`,
          }}
        />
        <span
          style={{
            fontSize: "0.68rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: cockpit.muted,
          }}
        >
          {compact ? "Data" : null}
          {compact ? " · " : null}
          {context.liveStatus}
        </span>
      </div>
    </header>
  );
}

function ThemeControls({
  context,
  onThemeChange,
}: {
  readonly context: ExecutiveContextSnapshot;
  readonly onThemeChange: (theme: ExecutiveThemeMode) => void;
}) {
  return (
    <div
      data-testid="executive-theme-control"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.25rem",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontSize: "0.58rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: cockpit.lowMuted,
          marginRight: "0.25rem",
        }}
      >
        Theme
      </span>
      {THEMES.map((theme) => {
        const active = context.theme === theme;
        return (
          <button
            key={theme}
            type="button"
            data-testid={`executive-theme-${theme}`}
            aria-pressed={active}
            onClick={() => onThemeChange(theme)}
            style={{
              padding: "0.22rem 0.45rem",
              borderRadius: "0.3rem",
              border: active
                ? `1px solid ${cockpit.borderStrong}`
                : `1px solid ${cockpit.border}`,
              background: active ? cockpit.accentSoft : "transparent",
              color: active ? cockpit.accent : cockpit.muted,
              fontSize: "0.62rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: cockpit.transition,
            }}
          >
            {theme}
          </button>
        );
      })}
    </div>
  );
}
