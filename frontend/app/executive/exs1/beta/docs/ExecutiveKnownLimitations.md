# Known Limitations — EXS-7 · Beta

## Connectors

- Only **CSV** completes the full intake lifecycle  
- Excel, REST, Database, SAP/Dynamics, SharePoint, Sheets, Manual are **shells**  
- No continuous synchronization, scheduling, or secrets vault  

## Simulation

- Deterministic rule tables only — no Monte Carlo, ML, or optimization  
- Confidence is **static** configuration  
- Does not auto-approve Decisions  

## Platform

- Single mock enterprise tenant (no multi-tenancy / billing / SSO)  
- Desktop-first; tablet landscape supported; no native mobile app  
- Runtime Inspector is development / Developer Mode oriented  
- Demo datasets are illustrative executive stories, not live ERP extracts  

## Advisor

- Template + rule driven explanations  
- Never executes Runtime changes without Manager Approval  
