/** WS-1:3 — Immutable Workspace Model metadata shapes. */
export interface WorkspaceModelDescriptor {
  readonly id: string; readonly name: string; readonly source: unknown;
  readonly metadataOnly: true; readonly immutable: true;
}
export interface WorkspaceRelationshipDescriptor extends WorkspaceModelDescriptor {
  readonly sourceKind: string; readonly relation: string; readonly targetKind: string;
}
export interface WorkspaceCompositionDescriptor extends WorkspaceModelDescriptor {
  readonly members: readonly string[]; readonly rendering: false;
}

