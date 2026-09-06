/** BCA:8 deterministic CSV fixtures. Not a source of executive truth. */

export const BCA8_BUSINESS_CSV = `date,on_time_delivery_pct,backlog_units,CAP_AV,throughput_units,late_shipments,avg_delay_days,gross_margin_pct
2026-08-01,92.4,1180,86,940,38,2.1,31.2
2026-08-08,91.8,1260,83,925,44,2.4,30.8
2026-08-15,90.9,1395,80,901,53,2.8,30.1
2026-08-22,89.7,1510,78,884,61,3.2,29.6
`;

export const BCA8_PROJECT_CSV = `milestone,planned_finish,forecast_finish,schedule_variance_days,budget_cost,forecast_cost,resource_availability_pct,risk_count
Design Complete,2026-08-10,2026-08-13,3,120000,124500,91,2
Equipment Install,2026-09-15,2026-09-23,8,480000,512000,82,5
Commissioning,2026-10-10,2026-10-21,11,210000,229000,76,6
`;

export const BCA8_SOURCE_A_BKL_CSV = `date,BKL,on_time_delivery_pct
2026-08-22,1510,89.7
`;

export const BCA8_SOURCE_B_BKL_CSV = `date,BKL
2026-08-22,12
`;

export const BCA8_PROJECT_B_CSV = `milestone,planned_finish,forecast_finish,schedule_variance_days,resource_availability_pct
Kickoff,2026-07-01,2026-07-01,0,88
`;

export const BCA8_MANAGER = Object.freeze({
  name: "Alex",
  role: "Operations Manager",
  business: "Manufacturing",
  goal: "Improve on-time delivery from 91% to 96%",
});
