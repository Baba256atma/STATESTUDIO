const emitted = new Set<string>();

function emit(tag: string, payload: unknown): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${tag}:${JSON.stringify(payload)}`;
  if (emitted.has(key)) return;
  emitted.add(key);
  console.info(tag, payload);
}

export function logExecutiveUxAudit(event: string, payload: unknown): void {
  emit("[Nexora][UXAudit]", { event, ...(payload as object) });
}

export function logExecutiveVocabulary(event: string, payload: unknown): void {
  emit("[Nexora][Vocabulary]", { event, ...(payload as object) });
}

export function logExecutiveInteractionStandard(event: string, payload: unknown): void {
  emit("[Nexora][InteractionStandard]", { event, ...(payload as object) });
}

export function logExecutivePanelGovernance(event: string, payload: unknown): void {
  emit("[Nexora][PanelGovernance]", { event, ...(payload as object) });
}

export function logExecutiveTypographyGovernance(event: string, payload: unknown): void {
  emit("[Nexora][Typography]", { event, ...(payload as object) });
}

export function logExecutiveIconRegistry(event: string, payload: unknown): void {
  emit("[Nexora][IconRegistry]", { event, ...(payload as object) });
}

export function logExecutiveStatusGovernance(event: string, payload: unknown): void {
  emit("[Nexora][StatusGovernance]", { event, ...(payload as object) });
}

export function logExecutiveMotionGovernance(event: string, payload: unknown): void {
  emit("[Nexora][MotionGovernance]", { event, ...(payload as object) });
}

export function logExecutiveWorkspaceIdentity(event: string, payload: unknown): void {
  emit("[Nexora][WorkspaceIdentity]", { event, ...(payload as object) });
}

export function resetExecutiveHarmonizationInstrumentationForTests(): void {
  emitted.clear();
}
