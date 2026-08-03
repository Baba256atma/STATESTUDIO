"use client";

import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { SCENARIO_COLORS } from "./ScenarioConfig";
import { useScenarioExperience } from "./hooks/useScenarioExperience";
import { cockpit } from "../shell/executiveCockpitTheme";

type Props = {
  readonly onClose: () => void;
};

/**
 * ScenarioFloatingWizard — mock create flow for ExecutiveFloatingPanel.
 */
export function ScenarioFloatingWizard({ onClose }: Props) {
  const { scenarios, addScenario } = useScenarioExperience();
  const [name, setName] = useState(
    `Scenario ${String.fromCharCode(65 + scenarios.length)}`,
  );
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(
    SCENARIO_COLORS[scenarios.length % SCENARIO_COLORS.length]!,
  );
  const [cloneFromId, setCloneFromId] = useState<string>("");

  const cloneOptions = useMemo(
    () => scenarios.filter((s) => !s.combinedFrom),
    [scenarios],
  );

  function handleCreate() {
    const trimmed = name.trim();
    if (!trimmed) return;
    addScenario({
      name: trimmed,
      description: description.trim(),
      color,
      cloneFromId: cloneFromId || null,
    });
    onClose();
  }

  return (
    <div
      data-testid="scenario-floating-wizard"
      style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
    >
      <Field label="Scenario Name">
        <input
          data-testid="scenario-wizard-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />
      </Field>
      <Field label="Description">
        <textarea
          data-testid="scenario-wizard-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </Field>
      <Field label="Color">
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {SCENARIO_COLORS.map((swatch) => {
            const active = swatch === color;
            return (
              <button
                key={swatch}
                type="button"
                data-testid={`scenario-wizard-color-${swatch.slice(1)}`}
                aria-label={`Color ${swatch}`}
                onClick={() => setColor(swatch)}
                style={{
                  width: "1.4rem",
                  height: "1.4rem",
                  borderRadius: "999px",
                  border: active
                    ? `2px solid ${cockpit.text}`
                    : `1px solid ${cockpit.border}`,
                  background: swatch,
                  cursor: "pointer",
                }}
              />
            );
          })}
        </div>
      </Field>
      <Field label="Clone Existing?">
        <select
          data-testid="scenario-wizard-clone"
          value={cloneFromId}
          onChange={(e) => setCloneFromId(e.target.value)}
          style={inputStyle}
        >
          <option value="">No — blank mock</option>
          {cloneOptions.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </Field>
      <button
        type="button"
        data-testid="scenario-wizard-create"
        onClick={handleCreate}
        style={{
          marginTop: "0.25rem",
          padding: "0.55rem 0.8rem",
          borderRadius: "0.4rem",
          border: `1px solid ${color}`,
          background: `${color}22`,
          color: cockpit.text,
          fontWeight: 550,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        Create
      </button>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  readonly label: string;
  readonly children: ReactNode;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
      <span
        style={{
          fontSize: "0.62rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: cockpit.lowMuted,
        }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "0.45rem 0.55rem",
  borderRadius: "0.35rem",
  border: `1px solid ${cockpit.border}`,
  background: cockpit.charcoal,
  color: cockpit.text,
  fontFamily: "inherit",
  fontSize: "0.84rem",
};
