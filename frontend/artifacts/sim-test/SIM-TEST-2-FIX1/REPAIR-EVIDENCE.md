# Repair evidence

The repair adds optional read-only expectation context to the existing Observer input:

- `expectedObservationFields` limits A→B checks to the scenario's enabled observation policy.
- `publicationEligibleFields` limits B→C checks to fields whose source participates in the selected CSV contract.

RMS Scenario Runner and SIM-TEST pass those scopes from existing authorities. SIM-TEST derives publication eligibility from the actual projected file source types and AVAILABLE Operator records; it does not create a semantic or business-data authority.

The causal-language classifier now recognizes explicit negative forms including:

- `not a confirmed cause`;
- `not confirmed as a cause`;
- `not enough evidence`.

Protection evidence:

- A scoped but missing expected field still produces `m:ab:orders_received`.
- An eligible but unpublished `CAP_AV` still produces `m:bc:CAP_AV`.
- The original affirmative fixture “definitely caused” still produces `CAUSAL_OVERCLAIM`.
- Observer remains `writeAttempted: false` and `repaired: false`; “repaired” describes code maintenance, never runtime intervention.

The exact post-repair INGESTION signatures are:

- Manufacturing: `fnv1a32:e70af6aa`.
- Project: `fnv1a32:28d59f86`.
- Logistics: `fnv1a32:1391c13e`.
- Service: `fnv1a32:0a3539d4`.

Each run has product PASS, harness PASS, S0 0, and S1 0.
