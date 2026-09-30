# Manufacturing exact rerun

Journey: `real-manager-manufacturing-primary@1.0`  
Mode: INGESTION  
Profile: DATA_DRIVEN_MANAGER  
Turns: 21  
Ticks: 21  
Stop: JOURNEY_COMPLETE  
Harness: PASS  
Findings: S0=0 S1=0 S2=0 S3=0  

Original signature: `fnv1a32:b817801d`  
Successor signature: `fnv1a32:b8d64026` (corrected Stage/referent state changes the stable checkpoint hash)

## Turns 10–18

| Turn | Utterance | Referent / exec | Stage | L1 | Advisor | Data | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 10 | What about delivery? | obj-delivery | obj-delivery | obj-delivery | Delivery | Production v2 | PASS |
| 11 | Tell me more about it. | obj-delivery | obj-delivery | obj-delivery | Delivery | v2 | PASS |
| 12 | Does that affect delivery? | obj-delivery | obj-delivery | obj-delivery | Delivery | v2 | PASS |
| 13 | What about the customer impact? | obj-customer | obj-customer | obj-customer | Customer | v2 | PASS |
| 14 | Tell me more about it. | obj-customer | obj-customer | obj-customer | Customer | v2 | PASS |
| 15 | Compare them. | obj-customer | obj-customer | obj-customer | PROBLEM | v2 | PASS |
| 16 | Go back to the capacity problem. | obj-capacity | obj-capacity | obj-capacity | Capacity | Production v3 | PASS |
| 17 | Has anything changed? | obj-capacity | obj-capacity | obj-capacity | PROBLEM | v3 | PASS |
| 18 | How does this affect operations? | obj-capacity | obj-capacity | obj-capacity | Capacity | v3 | PASS |

Transition proof: Capacity → Delivery → Customer → Capacity on executive, referent, Stage, MLEVEL L1, and Advisor/context.
