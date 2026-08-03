/**
 * EXS-1 — First Executive Experience types.
 * Mock-only MVP. No runtime, AI, or multi-model.
 */

export type Exs1WorkspaceId =
  | "Goal"
  | "Problem"
  | "Analysis"
  | "Scenario"
  | "Decision"
  | "Execution"
  | "Monitoring"
  | "War Room";

export type Exs1TimelineLens = "day" | "week" | "month" | "year";

export type Exs1NavId =
  | "Home"
  | "Model"
  | "Objects"
  | "Data"
  | "Journal"
  | "Search"
  | "Settings";

export type Exs1ObjectId =
  | "supplier"
  | "factory"
  | "inventory"
  | "customer"
  | "revenue"
  | "decision";

export type Exs1ObjectKind =
  | "source"
  | "operation"
  | "asset"
  | "market"
  | "outcome"
  | "action";

export type Exs1Object = {
  readonly id: Exs1ObjectId;
  readonly label: string;
  readonly kind: Exs1ObjectKind;
  readonly symbol: string;
  readonly x: number;
  readonly y: number;
  readonly relatedPackId: string;
  readonly summary: string;
  readonly guidance: string;
};

export type Exs1Connection = {
  readonly from: Exs1ObjectId;
  readonly to: Exs1ObjectId;
};

export type Exs1Pack = {
  readonly id: string;
  readonly title: string;
  readonly workspace: Exs1WorkspaceId;
  readonly risk: "warning" | "risk" | "success";
  readonly timelineLens: Exs1TimelineLens;
  readonly story: string;
  readonly guidance: string;
  readonly relatedObjectIds: readonly Exs1ObjectId[];
};

export type Exs1Context = {
  readonly company: string;
  readonly model: string;
  readonly pack: string;
  readonly workspace: Exs1WorkspaceId;
  readonly lens: Exs1TimelineLens;
  readonly dataStatus: "Live Mock" | "Stale" | "Offline";
};

export type Exs1AdvisorMessage = {
  readonly title: string;
  readonly body: string;
  readonly guidance: string;
};

export type Exs1Selection =
  | { readonly kind: "welcome" }
  | { readonly kind: "object"; readonly objectId: Exs1ObjectId }
  | { readonly kind: "pack"; readonly packId: string }
  | { readonly kind: "timeline"; readonly lens: Exs1TimelineLens }
  | { readonly kind: "mode"; readonly mode: Exs1WorkspaceId };
