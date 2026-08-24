# Manager observation contract

`ManagerProvidedObservation` is conversational evidence. Source is always `MANAGER`. NCA-POST:2 does not write RDI.

Status:

- REPORTED
- CONFLICTS_WITH_AUTHORITATIVE_DATA
- CONSISTENT_WITH_AUTHORITATIVE_DATA
- UNVERIFIED

Qualitative language (`okay`, `tight`, `high`) is allowed without a number. Confidence is HIGH for a stated numeric, LOW for seems/feels/looks, otherwise MEDIUM.

Preference (`I'm okay with 91%`) is not a status observation. It may inform Goal/trade-off reading only through existing Goal authority.

Correction (`No, Delivery is 94%`) preserves conversational meaning. Only existing data authorities may change authoritative truth.

Conflict copy acknowledges both views and does not accuse the manager. Consistency does not challenge. Unknown data stays UNVERIFIED.

NCA:3 may recompute when an assertion also answers a pending information gap. NCA:4 may revise recommendation if existing authorities accept the fact. NCA-POST:2 does not rescore. NCA:5 must not dump unrelated initiative on the assertion turn.
