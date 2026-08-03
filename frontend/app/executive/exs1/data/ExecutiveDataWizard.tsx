"use client";

import type { CSSProperties } from "react";
import {
  SOURCE_TYPE_OPTIONS,
  type WizardStep,
} from "./ExecutiveDataConfig";
import { ExecutiveDataPreview } from "./ExecutiveDataPreview";
import { useExecutiveData } from "./hooks/useExecutiveData";
import { cockpit } from "../shell/executiveCockpitTheme";

type Props = {
  readonly onClose: () => void;
};

const STEPS: readonly WizardStep[] = [
  "type",
  "details",
  "preview",
  "mapping",
  "review",
  "finish",
];

const STEP_LABEL: Record<WizardStep, string> = {
  type: "Choose Source Type",
  details: "Connection Details",
  preview: "Preview",
  mapping: "Mapping",
  review: "Review",
  finish: "Finish",
};

/**
 * Add Data Wizard — ExecutiveFloatingPanel content. Mock only.
 */
export function ExecutiveDataWizard({ onClose }: Props) {
  const {
    wizardStep,
    setWizardStep,
    wizardCategory,
    setWizardCategory,
    wizardName,
    setWizardName,
    finishWizard,
    resetWizard,
  } = useExecutiveData();

  const index = STEPS.indexOf(wizardStep);
  const next = () => {
    if (wizardStep === "finish") {
      finishWizard();
      onClose();
      return;
    }
    setWizardStep(STEPS[index + 1] ?? "finish");
  };
  const back = () => {
    if (index <= 0) return;
    setWizardStep(STEPS[index - 1] ?? "type");
  };

  return (
    <div
      data-testid="executive-data-wizard"
      style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "0.62rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: cockpit.accent,
        }}
      >
        Step {index + 1} / {STEPS.length} · {STEP_LABEL[wizardStep]}
      </p>

      {wizardStep === "type" ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
          {SOURCE_TYPE_OPTIONS.map((item) => (
            <button
              key={item}
              type="button"
              data-testid={`data-wizard-type-${item.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => setWizardCategory(item)}
              style={{
                padding: "0.4rem 0.55rem",
                borderRadius: cockpit.radius.pill,
                border:
                  wizardCategory === item
                    ? `1px solid ${cockpit.accent}`
                    : `1px solid ${cockpit.border}`,
                background:
                  wizardCategory === item ? cockpit.accentSoft : "transparent",
                color: wizardCategory === item ? cockpit.accent : cockpit.muted,
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: "0.7rem",
              }}
            >
              {item}
            </button>
          ))}
        </div>
      ) : null}

      {wizardStep === "details" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
          <Field
            label="Source Name"
            testId="data-wizard-name"
            value={wizardName}
            onChange={setWizardName}
          />
          {wizardCategory === "CSV" || wizardCategory === "Excel" ? (
            <div
              data-testid="data-wizard-dropzone"
              style={{
                padding: "1.2rem",
                borderRadius: cockpit.radius.md,
                border: `1px dashed ${cockpit.borderStrong}`,
                background: cockpit.panelSoft,
                textAlign: "center",
                color: cockpit.muted,
                fontSize: "0.78rem",
              }}
            >
              Drag & Drop · Browse File
              <br />
              <span style={{ fontSize: "0.66rem" }}>Mock only — no parsing</span>
            </div>
          ) : (
            <p style={{ margin: 0, fontSize: "0.78rem", color: cockpit.textSoft }}>
              Connection details for {wizardCategory} are mock placeholders.
            </p>
          )}
        </div>
      ) : null}

      {wizardStep === "preview" ? <ExecutiveDataPreview /> : null}

      {wizardStep === "mapping" ? (
        <p style={{ margin: 0, fontSize: "0.8rem", color: cockpit.textSoft }}>
          Revenue → Revenue Object · Inventory Qty → Inventory Object · Supplier
          Rating → Create Object / Ignore (approve after finish).
        </p>
      ) : null}

      {wizardStep === "review" ? (
        <div style={{ fontSize: "0.8rem", color: cockpit.textSoft }}>
          <p style={{ margin: 0 }}>Name · {wizardName}</p>
          <p style={{ margin: "0.35rem 0 0" }}>Type · {wizardCategory}</p>
          <p style={{ margin: "0.35rem 0 0" }}>
            Preview · {wizardName} ready to connect (mock).
          </p>
        </div>
      ) : null}

      {wizardStep === "finish" ? (
        <p style={{ margin: 0, fontSize: "0.84rem", color: cockpit.accent }}>
          Finish to add {wizardName} to the Executive Data Catalog and create a
          Data Journal Pack.
        </p>
      ) : null}

      <div style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end" }}>
        <button
          type="button"
          data-testid="data-wizard-cancel"
          onClick={() => {
            resetWizard();
            onClose();
          }}
          style={ghostBtn}
        >
          Cancel
        </button>
        {index > 0 ? (
          <button type="button" data-testid="data-wizard-back" onClick={back} style={ghostBtn}>
            Back
          </button>
        ) : null}
        <button type="button" data-testid="data-wizard-next" onClick={next} style={primaryBtn}>
          {wizardStep === "finish" ? "Finish" : "Continue"}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  testId,
  value,
  onChange,
}: {
  readonly label: string;
  readonly testId: string;
  readonly value: string;
  readonly onChange: (v: string) => void;
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
      <input
        data-testid={testId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: "0.5rem 0.6rem",
          borderRadius: cockpit.radius.sm,
          border: `1px solid ${cockpit.border}`,
          background: cockpit.panelSoft,
          color: cockpit.text,
          fontFamily: "inherit",
        }}
      />
    </label>
  );
}

const ghostBtn: CSSProperties = {
  padding: "0.45rem 0.7rem",
  borderRadius: cockpit.radius.sm,
  border: `1px solid ${cockpit.border}`,
  background: "transparent",
  color: cockpit.muted,
  cursor: "pointer",
  fontFamily: "inherit",
};

const primaryBtn: CSSProperties = {
  padding: "0.45rem 0.75rem",
  borderRadius: cockpit.radius.sm,
  border: `1px solid ${cockpit.accent}`,
  background: cockpit.accentSoft,
  color: cockpit.accent,
  fontWeight: 550,
  cursor: "pointer",
  fontFamily: "inherit",
};
