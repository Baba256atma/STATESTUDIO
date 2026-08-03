"use client";

import type { CSSProperties } from "react";
import { EXECUTIVE_DOMAINS } from "./ExecutiveDomainRegistry";
import { EXECUTIVE_UNITS } from "./ExecutiveObjectMetadata";
import { useExecutiveMetadata } from "./hooks/useExecutiveMetadata";
import { cockpit } from "../shell/executiveCockpitTheme";

/**
 * Metadata editor for Mapping Wizard / Knowledge — display name, meaning, domain, unit.
 */
export function ExecutiveMetadataEditor() {
  const {
    selectedFieldId,
    getField,
    updateField,
  } = useExecutiveMetadata();
  const field = selectedFieldId ? getField(selectedFieldId) : null;

  if (!field) {
    return (
      <div
        data-testid="executive-metadata-editor-empty"
        style={{ color: cockpit.muted, fontSize: "0.74rem" }}
      >
        Select a field to enrich metadata.
      </div>
    );
  }

  return (
    <div
      data-testid="executive-metadata-editor"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.45rem",
        padding: "0.65rem 0.7rem",
        borderRadius: cockpit.radius.md,
        border: `1px solid ${cockpit.border}`,
        background: cockpit.panelSoft,
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "0.58rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: cockpit.lowMuted,
        }}
      >
        Field Metadata · {field.technicalName}
      </p>
      <Field
        label="Display Name"
        testId="metadata-edit-display-name"
        value={field.displayName}
        onChange={(displayName) =>
          updateField(field.fieldId, { displayName })
        }
      />
      <Field
        label="Description"
        testId="metadata-edit-description"
        value={field.businessMeaning}
        onChange={(businessMeaning) =>
          updateField(field.fieldId, { businessMeaning })
        }
      />
      <label style={labelStyle}>
        Domain
        <select
          data-testid="metadata-edit-domain"
          value={field.domainId ?? ""}
          onChange={(e) =>
            updateField(field.fieldId, {
              domainId: (e.target.value || null) as typeof field.domainId,
            })
          }
          style={inputStyle}
        >
          <option value="">—</option>
          {EXECUTIVE_DOMAINS.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </label>
      <label style={labelStyle}>
        Unit
        <select
          data-testid="metadata-edit-unit"
          value={field.unitId ?? ""}
          onChange={(e) =>
            updateField(field.fieldId, {
              unitId: (e.target.value || null) as typeof field.unitId,
            })
          }
          style={inputStyle}
        >
          <option value="">—</option>
          {Object.values(EXECUTIVE_UNITS).map((u) => (
            <option key={u.id} value={u.id}>
              {u.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  testId,
}: {
  readonly label: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly testId: string;
}) {
  return (
    <label style={labelStyle}>
      {label}
      <input
        data-testid={testId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
      />
    </label>
  );
}

const labelStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.2rem",
  fontSize: "0.62rem",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: cockpit.muted,
};

const inputStyle: CSSProperties = {
  padding: "0.4rem 0.5rem",
  borderRadius: cockpit.radius.sm,
  border: `1px solid ${cockpit.border}`,
  background: cockpit.navy,
  color: cockpit.text,
  fontSize: "0.78rem",
  fontFamily: "inherit",
};
