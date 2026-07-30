# Vendor and Independent-Assurance Request Pack

## Screening/PEP provider

Request:

- licensed sanctions, PEP, RCA, and optional adverse-media coverage;
- Arabic/Latin transliteration and fuzzy matching;
- dataset provenance, list version, refresh SLA, and stale-data alerting;
- sandbox and production APIs;
- candidate evidence and explainability fields;
- jurisdiction, residency, subprocessors, retention, and deletion;
- availability, latency, support, incident, and change SLAs;
- validation assistance and false-positive tuning;
- pricing by record/transaction and minimum commitments;
- contract rights for audit evidence and regulator inspection.

Acceptance requires successful contract tests defined in `SCREENING_PROVIDER_ADAPTER.md`.

## Identity/KYB provider

Request:

- Jordan-supported identity and business verification;
- document authenticity, liveness where applicable, and digital-identity options;
- beneficial-owner and license verification coverage;
- Arabic/English interfaces and evidence;
- consent/notices, lawful processing, retention, deletion, and residency;
- manual fallback and inconclusive outcomes;
- sandbox fixtures and production credentials;
- fraud, availability, latency, support, and incident SLAs;
- per-check pricing and minimum commitments.

## Payment/safeguarding partner

Request:

- regulated entity and permitted cross-border activity;
- safeguarded/prefunding account structure;
- participant eligibility and exposure limits;
- supported currencies/corridors and settlement windows;
- payment initiation and status APIs;
- reconciliation files, finality, returns, disputes, and exceptions;
- value/volume limits, liquidity, fees, FX, and cutoffs;
- operational resilience and incident contacts;
- customer protection, complaints, and regulatory reporting ownership.

## Independent penetration-test statement of work

### Scope

- authenticated English/Arabic web application;
- all API routes and role boundaries;
- authorization bypass and privilege escalation;
- input validation and injection;
- session, identity-header, CSRF, CORS, and browser security;
- sensitive-data exposure, exports, logs, and errors;
- business logic for cases, roles, filings, brokers, and settlements;
- dependency/configuration review;
- rate limiting and abuse paths;
- cloud/runtime configuration where access is supplied.

### Deliverables

- executive and technical reports;
- CVSS/severity, evidence, reproduction, impact, and remediation;
- immediate notification of critical findings;
- retest and closure letter;
- tester independence and qualifications;
- secure evidence handling and deletion.

### Acceptance

No unresolved critical or high finding before controlled live use; medium findings require named owners, dates, and risk acceptance.

