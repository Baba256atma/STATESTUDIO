"use client";

import { useState, type CSSProperties } from "react";
import type { TaskStatus } from "./ExecutionConfig";
import { useExecutiveExecution } from "./hooks/useExecutiveExecution";
import { cockpit } from "../shell/executiveCockpitTheme";

type CloseProps = {
  readonly onClose: () => void;
};

const STATUSES: readonly TaskStatus[] = [
  "Not Started",
  "Ready",
  "In Progress",
  "Blocked",
  "Waiting",
  "Completed",
  "Cancelled",
];

export function ExecutionNewTaskPanel({ onClose }: CloseProps) {
  const { addTask } = useExecutiveExecution();
  const [name, setName] = useState("New Execution Task");
  const [owner, setOwner] = useState("Operations");

  return (
    <div data-testid="execution-new-task-panel" style={stack}>
      <Field label="Task Name" testId="execution-new-task-name" value={name} onChange={setName} />
      <Field label="Owner" testId="execution-new-task-owner" value={owner} onChange={setOwner} />
      <button
        type="button"
        data-testid="execution-new-task-create"
        onClick={() => {
          addTask(name, owner);
          onClose();
        }}
        style={primaryBtn}
      >
        Create Task
      </button>
    </div>
  );
}

export function ExecutionAssignOwnerPanel({ onClose }: CloseProps) {
  const { selectedTask, assignOwner } = useExecutiveExecution();
  const [owner, setOwner] = useState(selectedTask?.owner ?? "Operations");

  return (
    <div data-testid="execution-assign-owner-panel" style={stack}>
      <p style={{ margin: 0, fontSize: "0.78rem", color: cockpit.textSoft }}>
        Task · {selectedTask?.name ?? "Select a task first"}
      </p>
      <Field
        label="Owner"
        testId="execution-assign-owner-input"
        value={owner}
        onChange={setOwner}
      />
      <button
        type="button"
        data-testid="execution-assign-owner-save"
        disabled={!selectedTask}
        onClick={() => {
          if (!selectedTask) return;
          assignOwner(selectedTask.id, owner);
          onClose();
        }}
        style={primaryBtn}
      >
        Assign Owner
      </button>
    </div>
  );
}

export function ExecutionChangeStatusPanel({ onClose }: CloseProps) {
  const { selectedTask, setTaskStatus } = useExecutiveExecution();
  const [status, setStatus] = useState<TaskStatus>(
    selectedTask?.status ?? "Ready",
  );

  return (
    <div data-testid="execution-change-status-panel" style={stack}>
      <p style={{ margin: 0, fontSize: "0.78rem", color: cockpit.textSoft }}>
        Task · {selectedTask?.name ?? "Select a task first"}
      </p>
      <label style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
        <span style={labelStyle}>Status</span>
        <select
          data-testid="execution-change-status-select"
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskStatus)}
          style={inputStyle}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <button
        type="button"
        data-testid="execution-change-status-save"
        disabled={!selectedTask}
        onClick={() => {
          if (!selectedTask) return;
          setTaskStatus(selectedTask.id, status);
          onClose();
        }}
        style={primaryBtn}
      >
        Change Status
      </button>
    </div>
  );
}

export function ExecutionNotesPanel({ onClose }: CloseProps) {
  const { notes, setNotes } = useExecutiveExecution();
  const [draft, setDraft] = useState(notes);

  return (
    <div data-testid="execution-notes-panel" style={stack}>
      <label style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
        <span style={labelStyle}>Execution Notes</span>
        <textarea
          data-testid="execution-notes-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={5}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </label>
      <button
        type="button"
        data-testid="execution-notes-save"
        onClick={() => {
          setNotes(draft);
          onClose();
        }}
        style={primaryBtn}
      >
        Save Notes
      </button>
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
  readonly onChange: (value: string) => void;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
      <span style={labelStyle}>{label}</span>
      <input
        data-testid={testId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
      />
    </label>
  );
}

const stack: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
};

const labelStyle: CSSProperties = {
  fontSize: "0.62rem",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: cockpit.lowMuted,
};

const inputStyle: CSSProperties = {
  padding: "0.5rem 0.6rem",
  borderRadius: "0.4rem",
  border: `1px solid ${cockpit.border}`,
  background: cockpit.panelSoft,
  color: cockpit.text,
  fontFamily: "inherit",
  fontSize: "0.84rem",
};

const primaryBtn: CSSProperties = {
  padding: "0.55rem 0.8rem",
  borderRadius: "0.4rem",
  border: "1px solid #12B76A",
  background: "rgba(18,183,106,0.18)",
  color: cockpit.text,
  fontWeight: 550,
  cursor: "pointer",
  fontFamily: "inherit",
};
