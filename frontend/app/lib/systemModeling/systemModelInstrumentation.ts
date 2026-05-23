const loggedKeys = new Set<string>();

function devLogOnce(key: string, event: string, payload?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  if (loggedKeys.has(key)) return;
  loggedKeys.add(key);
  globalThis.console?.info?.(event, payload ?? {});
}

function devLogEvent(event: string, payload?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.info?.(event, payload ?? {});
}

export function logTemplateOpened(source: string): void {
  devLogEvent("[Nexora][TemplateOpened]", { source });
}

export function logTemplateSelected(payload: { templateId: string; templateName: string }): void {
  devLogEvent("[Nexora][TemplateSelected]", payload);
}

export function logTemplatePreview(payload: {
  templateId: string;
  templateName: string;
  objectCount: number;
  relationshipCount: number;
}): void {
  devLogOnce(
    `template-preview-${payload.templateId}`,
    "[Nexora][TemplatePreview]",
    payload
  );
}

export function logSystemGenerated(payload: {
  templateId: string;
  templateName: string;
  objectCount: number;
  relationshipCount: number;
  generationDurationMs: number;
}): void {
  devLogEvent("[Nexora][SystemGenerated]", payload);
}

export function logBlueprintCreated(payload: {
  templateId: string;
  templateName: string;
  objectCount: number;
  relationshipCount: number;
}): void {
  devLogEvent("[Nexora][BlueprintCreated]", payload);
}

export function logTemplateValidated(payload: {
  templateId: string;
  valid: boolean;
  reason?: string;
}): void {
  devLogOnce(
    `template-validated-${payload.templateId}-${payload.valid}`,
    "[Nexora][TemplateValidated]",
    payload
  );
}

export function logWorkspaceGenerated(payload: {
  templateId: string;
  templateName: string;
  objectCount: number;
  relationshipCount: number;
  generationDurationMs: number;
}): void {
  devLogEvent("[Nexora][WorkspaceGenerated]", payload);
}

export function logTemplateWorkspaceClosed(source: string): void {
  devLogEvent("[Nexora][TemplateClosed]", { source });
}

export function resetSystemModelInstrumentationForTests(): void {
  loggedKeys.clear();
}
