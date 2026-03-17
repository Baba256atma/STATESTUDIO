# Fragility Scanner Sample Scenarios

This library is designed for live demos, self-serve examples, internal testing, and early customer conversations.

## 1. Scenario: Supplier Dependency

### Business context

A business relies heavily on one upstream supplier for a critical material.

### Sample input text

One supplier now covers most of our critical component demand. Their recent delays are increasing schedule risk, and the team has limited backup capacity if the issue continues.

### Expected fragility pattern

Dependency concentration with resilience weakness.

### Likely top drivers

- supplier dependency
- concentration risk
- recovery weakness

### Likely level

High

### Likely recommended actions

- diversify the supply base
- create backup sourcing options
- protect critical inventory for high-priority demand

### Recommended scene emphasis

- `obj_supplier`
- `obj_risk_zone`
- `obj_buffer`

### Output framing

Emphasize concentration risk, weak fallback options, and the fact that a single upstream issue can destabilize a broader operating path.

## 2. Scenario: Delivery Delay Escalation

### Business context

Recurring delivery delays are creating service risk and internal escalation.

### Sample input text

Deliveries have slipped for the third straight week. Expedite requests are rising, fulfillment teams are escalating more often, and customer commitments are getting harder to protect.

### Expected fragility pattern

Delivery pressure turning into a bottleneck.

### Likely top drivers

- delay risk
- bottleneck
- volatility

### Likely level

High

### Likely recommended actions

- isolate the main delivery bottleneck
- re-sequence critical orders
- protect customer-critical flows first

### Recommended scene emphasis

- `obj_delivery`
- `obj_bottleneck`
- `obj_risk_zone`

### Output framing

Emphasize time pressure, service risk, and the operational cost of repeated escalation.

## 3. Scenario: Inventory Buffer Erosion

### Business context

Inventory buffers have fallen below a safe working level.

### Sample input text

Inventory coverage has declined across the network, and several teams are operating with minimal buffer. A small disruption now creates immediate risk to schedule and service continuity.

### Expected fragility pattern

Buffer weakness with near-term exposure.

### Likely top drivers

- inventory shortage
- recovery weakness
- volatility

### Likely level

Medium to high

### Likely recommended actions

- rebuild critical buffers
- prioritize scarce inventory by value and service risk
- increase near-term monitoring on low-coverage items

### Recommended scene emphasis

- `obj_inventory`
- `obj_buffer`
- `obj_risk_zone`

### Output framing

Emphasize how low buffers reduce resilience and compress managerial response time.

## 4. Scenario: Quality Instability

### Business context

Output quality is becoming inconsistent and driving rework pressure.

### Sample input text

Quality performance is unstable across recent runs. Rework is increasing, defect-related escalations are rising, and teams are spending more time correcting output than maintaining flow.

### Expected fragility pattern

Operational instability with compounding quality risk.

### Likely top drivers

- quality instability
- bottleneck
- volatility

### Likely level

Medium to high

### Likely recommended actions

- stabilize the highest-defect process first
- reduce rework loops
- protect throughput while quality recovers

### Recommended scene emphasis

- `obj_bottleneck`
- `obj_risk_zone`
- `obj_delivery`

### Output framing

Emphasize that quality weakness is not isolated. It becomes flow weakness and capacity loss.

## 5. Scenario: Recovery Weakness After Disruption

### Business context

The business can absorb a disruption once, but recovery is too slow to stay resilient.

### Sample input text

The last disruption was contained, but recovery took longer than planned. Teams are still catching up, and the network remains exposed if another disruption happens soon.

### Expected fragility pattern

Resilience weakness and low recovery capacity.

### Likely top drivers

- recovery weakness
- volatility
- delay risk

### Likely level

Medium to high

### Likely recommended actions

- improve recovery playbooks
- restore buffer capacity
- reduce dependency on the most unstable path

### Recommended scene emphasis

- `obj_buffer`
- `obj_delivery`
- `obj_risk_zone`

### Output framing

Emphasize that the danger is not the past event. It is the reduced ability to absorb the next one.

## 6. Scenario: Multi-Factor Operational Stress

### Business context

Multiple pressure signals are appearing at the same time.

### Sample input text

Deliveries are slipping because one supplier is overloaded, inventory buffers are low, and recovery time has increased across the network. Teams are placing rush orders to protect customer commitments.

### Expected fragility pattern

Compound fragility across dependency, delivery, inventory, and resilience.

### Likely top drivers

- supplier dependency
- delay risk
- inventory shortage
- recovery weakness

### Likely level

Critical

### Likely recommended actions

- reduce single-supplier exposure
- protect scarce inventory
- stop panic-order amplification
- rebuild short-term recovery capacity

### Recommended scene emphasis

- `obj_supplier`
- `obj_delivery`
- `obj_inventory`
- `obj_buffer`
- `obj_bottleneck`
- `obj_risk_zone`

### Output framing

Emphasize that the system is not suffering from one problem. It is under reinforcing pressure from multiple weak points.

## 7. Sample Input Library

### Short examples

#### Short 1

Deliveries are slipping and inventory coverage is now too thin to absorb another delay.

#### Short 2

One supplier is becoming a single point of failure for our highest-volume product line.

#### Short 3

Recovery after the last disruption was slower than expected and teams are still operating with weak buffers.

### Medium examples

#### Medium 1

Recent supplier delays are increasing schedule pressure, and the operations team has started placing rush orders because inventory buffers are already low. If the issue continues, customer commitments will become harder to protect.

#### Medium 2

Fulfillment performance is becoming unstable. Delivery delays are now recurring, internal escalation is rising, and teams are spending more time managing exceptions than maintaining steady flow.

#### Medium 3

Quality performance has weakened across recent runs. Rework is growing, defect-related pressure is slowing output, and the team is losing recovery capacity each week.

### Complex executive-style update examples

#### Executive 1

Over the last two weeks, the operating network has become more exposed. One supplier now carries too much of the critical load, inventory coverage is below target in several nodes, and recovery time from disruptions is longer than planned. Teams are compensating with rush orders, but that is increasing pressure instead of restoring stability.

#### Executive 2

Service reliability remains under strain. Delivery performance is inconsistent, exception handling has increased, and managers are escalating more often because buffers no longer provide enough protection. The immediate issue is not only delay, but the loss of resilience across the system.

#### Executive 3

The business appears stable on headline metrics, but underlying fragility is rising. Supplier concentration has increased, inventory flexibility has narrowed, and quality instability is creating more rework than planned. Without intervention, a moderate disruption could create outsized operational impact.

