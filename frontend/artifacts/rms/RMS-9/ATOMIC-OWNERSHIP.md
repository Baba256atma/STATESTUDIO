# Atomic ownership

Exactly one of MANAGER_AGENT or HUMAN_MANAGER may submit manager turns. HANDOFF_PENDING blocks both new Agent and Human turns until the in-flight turn ends, then ownership flips.
