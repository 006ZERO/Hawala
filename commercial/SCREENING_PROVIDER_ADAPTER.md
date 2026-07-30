# Screening Provider Adapter

Status: interface specification only. No provider is connected.

## Required request

- tenant and policy identifiers;
- subject type and normalized names;
- aliases and transliterations;
- date/place of birth or incorporation when lawfully available;
- nationality or jurisdiction;
- request timestamp and idempotency key.

## Required response

- provider request/reference ID;
- dataset/list version and freshness timestamp;
- sanctions, PEP, RCA, and adverse-media categories as licensed;
- candidate identifiers, match score, matched attributes, and confidence;
- provider disposition and reasons;
- processing latency, warnings, and errors.

## Platform behavior

- Store provenance and decision-relevant evidence.
- Never treat a provider score as a legal conclusion.
- Route candidates to accountable human review.
- Show stale-data and provider-outage states.
- Apply retries, circuit breaker, manual fallback, and reconciliation.
- Prevent production activation without credentials, validation, SLA, and security approval.

## Acceptance tests

- exact and fuzzy matches;
- Arabic/Latin transliteration;
- false-positive controls;
- stale dataset;
- timeout and partial response;
- duplicate/idempotent request;
- provider outage and recovery;
- audit completeness;
- data-minimization and retention behavior.

