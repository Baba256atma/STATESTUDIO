/** WS-2:3 — Immutable Executive Home Model metadata shapes. */
export interface ExecutiveHomeModelDescriptor {
  readonly id: string;
  readonly name: string;
  readonly source: unknown;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveHomeRelationshipDescriptor extends ExecutiveHomeModelDescriptor {
  readonly sourceKind: string;
  readonly relation: string;
  readonly targetKind: string;
}

export interface ExecutiveHomeCompositionDescriptor extends ExecutiveHomeModelDescriptor {
  readonly members: readonly string[];
  readonly rendering: false;
  readonly uiLayout: false;
}

