# Fragility Scanner Demo Scenarios

This document is the human-readable companion to `data/demo/fragility_scenarios.json`.

It is designed for:
- live founder demos
- customer demos
- onboarding walkthroughs
- product videos
- UI example buttons
- internal testing

## Scenario 1 — Supplier Concentration Risk

Category:
- Supplier concentration risk

Industry:
- Manufacturing

Complexity:
- Simple

Demo priority:
- Yes

Context:
- Manufacturing network dependent on one upstream supplier for a critical component.

Example Input:
- Our main upstream supplier now covers most of the critical component volume for the network. Their recent delays are pushing more orders off schedule, and the team has very limited backup capacity if the issue continues through the next production cycle.

Expected Fragility Pattern:
- Supplier dependency
- Single point of failure

Expected Objects To Highlight:
- `obj_supplier`
- `obj_risk_zone`
- `obj_buffer`

Management Takeaway:
- The operating system is exposed because too much critical load depends on one unstable supplier path.

## Scenario 2 — Inventory Buffer Erosion

Category:
- Inventory erosion

Industry:
- Consumer goods

Complexity:
- Simple

Demo priority:
- Yes

Context:
- Consumer goods network running with thin stock coverage ahead of a busy period.

Example Input:
- Inventory coverage has fallen below our normal safety threshold in several nodes. Teams are still meeting shipments today, but there is very little buffer left if inbound supply slips again this week.

Expected Fragility Pattern:
- Inventory shortage
- Recovery weakness

Expected Objects To Highlight:
- `obj_inventory`
- `obj_buffer`
- `obj_risk_zone`

Management Takeaway:
- The network still looks operational, but resilience is thinning because low buffers leave little room for the next disruption.

## Scenario 3 — Cascading Delivery Delays

Category:
- Delivery delays

Industry:
- Retail supply chain

Complexity:
- Moderate

Demo priority:
- Yes

Context:
- Retail distribution network seeing repeated late deliveries and store-level pressure.

Example Input:
- Delivery reliability has dropped for the third straight week across two regional lanes. Expedite requests are rising, stores are escalating more often, and planners are now spending more time on exceptions than on normal replenishment flow.

Expected Fragility Pattern:
- Delay risk
- Bottleneck
- Volatility

Expected Objects To Highlight:
- `obj_delivery`
- `obj_bottleneck`
- `obj_risk_zone`

Management Takeaway:
- Delivery pressure is no longer isolated. It is turning into a broader operating bottleneck that will keep amplifying unless the main lane constraint is addressed.

## Scenario 4 — Quality Drift Under Load

Category:
- Quality instability

Industry:
- Technology hardware

Complexity:
- Moderate

Demo priority:
- No

Context:
- Technology hardware assembly line facing rising defects under volume pressure.

Example Input:
- Quality performance has become inconsistent on the highest-volume line over the last ten days. Rework is increasing, defect-related escalations are rising, and throughput is getting harder to maintain because teams are correcting output instead of protecting flow.

Expected Fragility Pattern:
- Quality instability
- Bottleneck

Expected Objects To Highlight:
- `obj_bottleneck`
- `obj_risk_zone`
- `obj_delivery`

Management Takeaway:
- Quality weakness is now affecting operating flow, so the issue should be treated as a system fragility problem rather than a narrow quality event.

## Scenario 5 — Recovery Capacity Weakening

Category:
- Recovery weakness after disruption

Industry:
- Logistics

Complexity:
- Moderate

Demo priority:
- No

Context:
- Logistics network that contained a disruption but recovered too slowly to restore resilience.

Example Input:
- The last disruption was contained, but recovery took much longer than planned and the network is still catching up. Managers are worried that another shock in the next two weeks would hit a system that has not rebuilt enough spare capacity.

Expected Fragility Pattern:
- Recovery weakness
- Volatility

Expected Objects To Highlight:
- `obj_buffer`
- `obj_delivery`
- `obj_risk_zone`

Management Takeaway:
- The main risk is reduced recovery capacity. The system may absorb one event, but it is not ready for another one soon after.

## Scenario 6 — Operational Bottleneck Formation

Category:
- Operational bottlenecks

Industry:
- E-commerce

Complexity:
- Simple

Demo priority:
- No

Context:
- E-commerce fulfillment operation with one constrained node slowing the rest of the network.

Example Input:
- One fulfillment node is now handling more exception work than normal, and throughput is starting to slow across the shift. Teams are rerouting around the problem, but that is increasing congestion elsewhere and creating a visible bottleneck in outbound flow.

Expected Fragility Pattern:
- Bottleneck
- Delay risk

Expected Objects To Highlight:
- `obj_bottleneck`
- `obj_delivery`
- `obj_risk_zone`

Management Takeaway:
- The system is becoming fragile because one constrained node is starting to shape the pace of the wider operating flow.

## Scenario 7 — Demand Volatility Pressure

Category:
- Demand volatility pressure

Industry:
- Retail supply chain

Complexity:
- Moderate

Demo priority:
- No

Context:
- Retail network struggling to absorb fast swings in demand across the same supply base.

Example Input:
- Demand has become less predictable over the last three cycles, with sharper peaks followed by sudden drop-offs. The planning team is reacting faster than before, but inventory placement and supplier commitments are now moving out of sync with actual demand.

Expected Fragility Pattern:
- Volatility
- Inventory shortage
- Supplier dependency

Expected Objects To Highlight:
- `obj_inventory`
- `obj_supplier`
- `obj_risk_zone`

Management Takeaway:
- Demand swings are putting stress on both inventory and supply commitments, which raises the risk of overreaction and service instability.

## Scenario 8 — Multi-Node Dependency Risk

Category:
- Multi-node dependency risk

Industry:
- Technology hardware

Complexity:
- Complex

Demo priority:
- No

Context:
- Hardware network dependent on several tightly linked nodes with limited fallback paths.

Example Input:
- Three linked production nodes are now operating with tighter handoff windows and less tolerance for delay. A minor issue at one node is quickly forcing rescheduling across the other two, and the teams do not have enough slack to isolate the problem without affecting the wider build plan.

Expected Fragility Pattern:
- Supplier dependency
- Bottleneck
- Recovery weakness

Expected Objects To Highlight:
- `obj_supplier`
- `obj_bottleneck`
- `obj_risk_zone`

Management Takeaway:
- The network has become tightly coupled, so a small local disruption is now able to destabilize a much larger operating path.

## Scenario 9 — Single Point Of Failure Path

Category:
- Single point of failure

Industry:
- Manufacturing

Complexity:
- Simple

Demo priority:
- No

Context:
- Critical production path relying on one asset and one supplier combination.

Example Input:
- We have identified one production path that still depends on a single qualified supplier and one constrained internal line. If either one slips, there is no meaningful fallback in the current operating plan.

Expected Fragility Pattern:
- Single point of failure
- Supplier dependency

Expected Objects To Highlight:
- `obj_supplier`
- `obj_bottleneck`
- `obj_risk_zone`

Management Takeaway:
- This path should be treated as an immediate resilience concern because one failure can stop a critical portion of the system.

## Scenario 10 — Logistics Network Congestion

Category:
- Logistics congestion

Industry:
- Logistics

Complexity:
- Moderate

Demo priority:
- Yes

Context:
- Regional logistics network dealing with congestion, slower turns, and delivery risk.

Example Input:
- Inbound volume has started to stack up at two major transfer points, and trailer turns are running behind plan. Teams are still moving freight, but congestion is spreading and late departures are becoming more common across the network.

Expected Fragility Pattern:
- Delay risk
- Bottleneck
- Volatility

Expected Objects To Highlight:
- `obj_delivery`
- `obj_bottleneck`
- `obj_risk_zone`

Management Takeaway:
- The network is becoming fragile because congestion is spreading faster than recovery actions can contain it.

## Scenario 11 — Inventory Replenishment Mismatch

Category:
- Inventory erosion

Industry:
- Consumer goods

Complexity:
- Moderate

Demo priority:
- No

Context:
- Consumer goods network with replenishment timing drifting away from actual usage.

Example Input:
- Replenishment timing has slipped behind actual consumption in several fast-moving categories. The network is not out of stock yet, but buffer health is deteriorating and planners are starting to escalate because recovery options are narrowing.

Expected Fragility Pattern:
- Inventory shortage
- Recovery weakness

Expected Objects To Highlight:
- `obj_inventory`
- `obj_buffer`
- `obj_risk_zone`

Management Takeaway:
- The system is still running, but inventory resilience is weakening and the margin for error is shrinking.

## Scenario 12 — Compound Operational Stress

Category:
- Compound operational stress

Industry:
- E-commerce

Complexity:
- Complex

Demo priority:
- Yes

Context:
- E-commerce operating network under simultaneous supply, delivery, and buffer pressure.

Example Input:
- Deliveries are slipping because one supplier is overloaded, inventory buffers are low, and recovery time has increased across the network. Teams are placing rush orders to protect customer commitments, but exception work is now rising faster than the system can absorb.

Expected Fragility Pattern:
- Supplier dependency
- Delay risk
- Inventory shortage
- Recovery weakness

Expected Objects To Highlight:
- `obj_supplier`
- `obj_delivery`
- `obj_inventory`
- `obj_buffer`
- `obj_bottleneck`
- `obj_risk_zone`

Management Takeaway:
- This is a system-level stress pattern, not a single issue. Multiple weak points are now reinforcing each other and increasing operational fragility.

## Scenario 13 — Supply Chain Risk Briefing

Category:
- Supply chain fragility

Industry:
- Manufacturing

Complexity:
- Complex

Demo priority:
- No

Context:
- Management briefing summarizing deteriorating supply conditions across a production network.

Example Input:
- Over the last two weeks, supplier reliability has weakened on the most critical inbound path, inventory buffers have been drawn down faster than planned, and recovery time from schedule slips is increasing. The network remains operational, but the team is relying more heavily on manual intervention and expedited moves to protect customer delivery dates.

Expected Fragility Pattern:
- Supplier dependency
- Inventory shortage
- Delay risk
- Recovery weakness

Expected Objects To Highlight:
- `obj_supplier`
- `obj_inventory`
- `obj_delivery`
- `obj_risk_zone`

Management Takeaway:
- The system is increasingly fragile because supply weakness is now affecting buffers, recovery speed, and the cost of keeping delivery commitments intact.

## UI Example Inputs

### Example 1 — Supplier Delay

Input:
- Our main supplier is running late again, and backup capacity is limited if the delay continues.

Expected Highlight:
- `obj_supplier`
- `obj_risk_zone`

### Example 2 — Delivery Pressure

Input:
- Delivery reliability has slipped for the third straight week and exception handling is now rising across the network.

Expected Highlight:
- `obj_delivery`
- `obj_bottleneck`

### Example 3 — Low Buffer

Input:
- Inventory coverage is now too thin to absorb another supply disruption this week.

Expected Highlight:
- `obj_inventory`
- `obj_buffer`

