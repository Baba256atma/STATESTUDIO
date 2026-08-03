# Connector Guide

Unified Enterprise Connector lifecycle:

```
connect → validate → discoverSchema → preview → map → approve → publish
```

## Phase C / Beta

- **CSV** is the reference end-to-end implementation  
- Excel, REST, Database, ERP (and others) are shells  

## Publish

Publishing creates Runtime `DataUpdated` (published payload), Intelligence signal, and Journal `[Connector]` pack.  
Advisor explains — does not approve publish.
