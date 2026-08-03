/**
 * Phase A — Executive Glossary (searchable business definitions).
 */

export type ExecutiveGlossaryEntry = {
  readonly termId: string;
  readonly term: string;
  readonly definition: string;
  readonly relatedObjectIds: readonly string[];
  readonly relatedFieldIds: readonly string[];
};

export const INITIAL_GLOSSARY: readonly ExecutiveGlossaryEntry[] = Object.freeze([
  {
    termId: "term-lead-time",
    term: "Lead Time",
    definition: "Time between order and delivery.",
    relatedObjectIds: ["supplier", "factory"],
    relatedFieldIds: ["field-supplier-rating"],
  },
  {
    termId: "term-available-inventory",
    term: "Available Inventory",
    definition: "Stock currently free to allocate to production or fulfillment.",
    relatedObjectIds: ["inventory"],
    relatedFieldIds: ["field-mat-qty"],
  },
  {
    termId: "term-safety-stock",
    term: "Safety Stock",
    definition: "Buffer inventory held to absorb inbound and demand variance.",
    relatedObjectIds: ["inventory", "decision"],
    relatedFieldIds: ["field-mat-qty"],
  },
  {
    termId: "term-cover-days",
    term: "Cover Days",
    definition: "Days of demand the current inventory position can support.",
    relatedObjectIds: ["inventory", "customer"],
    relatedFieldIds: ["field-mat-qty"],
  },
]);
