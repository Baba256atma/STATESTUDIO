const emitted = new Set<string>();

function emit(tag: string, payload: unknown): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${tag}:${JSON.stringify(payload)}`;
  if (emitted.has(key)) return;
  emitted.add(key);
  console.info(tag, payload);
}

export function logE2WorkspaceAudit(event: string, payload: unknown): void {
  emit("[Nexora][E2Audit]", { event, ...(payload as object) });
}

export function logWorkspaceValidation(event: string, payload: unknown): void {
  emit("[Nexora][WorkspaceValidation]", { event, ...(payload as object) });
}

export function logExecutiveFlowValidation(event: string, payload: unknown): void {
  emit("[Nexora][ExecutiveFlow]", { event, ...(payload as object) });
}

export function logScalabilityAudit(event: string, payload: unknown): void {
  emit("[Nexora][Scalability]", { event, ...(payload as object) });
}

export function logTypeCReferenceAudit(event: string, payload: unknown): void {
  emit("[Nexora][ReferenceAudit]", { event, ...(payload as object) });
}

export function logE3ReadinessGate(event: string, payload: unknown): void {
  emit("[Nexora][ReadinessGate]", { event, ...(payload as object) });
}

export function resetE2ReadinessInstrumentationForTests(): void {
  emitted.clear();
}
