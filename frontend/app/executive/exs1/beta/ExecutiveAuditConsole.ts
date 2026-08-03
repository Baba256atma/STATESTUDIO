/**
 * Phase E — Audit Console (executive actions with timestamp, user, pack, objects).
 */

export type AuditEventKind =
  | "Connector Published"
  | "Metadata Updated"
  | "Scenario Created"
  | "Simulation Executed"
  | "Decision Approved"
  | "Execution Started"
  | "Monitoring Snapshot";

export type AuditEvent = {
  readonly id: string;
  readonly kind: AuditEventKind;
  readonly timestamp: string;
  readonly user: string;
  readonly pack: string;
  readonly objects: readonly string[];
  readonly summary: string;
};

export type ExecutiveAuditConsole = {
  readonly list: () => readonly AuditEvent[];
  record: (
    kind: AuditEventKind,
    input: {
      readonly pack?: string;
      readonly objects?: readonly string[];
      readonly summary?: string;
      readonly user?: string;
    },
  ) => AuditEvent;
  seedMinimumTrail: () => readonly AuditEvent[];
};

export function createAuditConsole(): ExecutiveAuditConsole {
  let events: AuditEvent[] = [];

  function record(
    kind: AuditEventKind,
    input: {
      readonly pack?: string;
      readonly objects?: readonly string[];
      readonly summary?: string;
      readonly user?: string;
    },
  ): AuditEvent {
    const event: AuditEvent = {
      id: `audit-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`,
      kind,
      timestamp: new Date().toISOString(),
      user: input.user ?? "Executive Manager",
      pack: input.pack ?? "Production Delay",
      objects: input.objects ?? ["Inventory"],
      summary: input.summary ?? kind,
    };
    events = [event, ...events].slice(0, 48);
    return event;
  }

  return {
    list: () => events,
    record,
    seedMinimumTrail() {
      record("Connector Published", {
        objects: ["Inventory", "Supplier"],
        summary: "inventory.csv published",
      });
      record("Metadata Updated", {
        objects: ["Inventory"],
        summary: "MAT_QTY → Available Inventory",
      });
      record("Scenario Created", {
        objects: ["Factory", "Inventory"],
        summary: "Scenario alternative selected",
      });
      record("Simulation Executed", {
        objects: ["Inventory", "Revenue", "Customer"],
        summary: "Inventory Shortage · Increase Safety Stock",
      });
      record("Decision Approved", {
        objects: ["Decision", "Inventory"],
        summary: "Safety stock decision approved",
      });
      record("Execution Started", {
        objects: ["Factory", "Inventory"],
        summary: "Execution plan started",
      });
      record("Monitoring Snapshot", {
        objects: ["Inventory", "Customer"],
        summary: "Executive health snapshot",
      });
      return events;
    },
  };
}
