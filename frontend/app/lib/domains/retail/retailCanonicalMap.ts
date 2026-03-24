export type RetailCanonicalObjectEntry = {
  objectId: string;
  keywords: string[];
};

export function getCanonicalRetailObjectKeywordMap(): RetailCanonicalObjectEntry[] {
  return [
    {
      objectId: "obj_delivery_1",
      keywords: ["delivery", "late delivery", "delivery delay", "delayed delivery", "shipping"],
    },
    {
      objectId: "obj_inventory_1",
      keywords: ["inventory", "stock", "stock level", "buffer stock"],
    },
    {
      objectId: "obj_supplier_1",
      keywords: ["supplier", "vendor", "supply"],
    },
    {
      objectId: "obj_warehouse_1",
      keywords: ["warehouse", "storage", "fulfillment center"],
    },
    {
      objectId: "obj_order_flow_1",
      keywords: ["order", "orders", "order flow", "fulfillment flow"],
    },
    {
      objectId: "obj_customer_satisfaction_1",
      keywords: ["customer", "customer satisfaction", "customer experience"],
    },
    {
      objectId: "obj_cash_pressure_1",
      keywords: ["cash", "cash flow", "liquidity"],
    },
    {
      objectId: "obj_price_1",
      keywords: ["price", "pricing", "cost pressure"],
    },
    {
      objectId: "obj_demand_1",
      keywords: ["demand", "sales demand", "market demand"],
    },
    {
      objectId: "obj_delay_1",
      keywords: ["delay", "lateness", "slowdown"],
    },
  ];
}
