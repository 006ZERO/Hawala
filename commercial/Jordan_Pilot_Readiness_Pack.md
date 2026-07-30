# HAWALA Compliance OS — Jordan Pilot Readiness Pack

Status: confidential working draft for buyer discovery.  
Market: Jordan-first.  
Languages: English and Arabic.  
Important: this pack is not legal advice, regulatory approval, a production security certification, or permission to move funds.

## 1. Recommended first buyer

The preferred first buyer is a Central Bank of Jordan-supervised exchange company, electronic-payment/money-transfer provider, or sponsoring bank with:

- an accountable executive sponsor;
- an existing compliance function;
- authority to select 5–10 participating brokers or agents;
- one approved remittance corridor;
- access to baseline operational and compliance metrics; and
- willingness to run a bounded shadow pilot before any controlled live activity.

HAWALA Compliance OS should be sold as a compliance and operating layer. It must not be presented as a licensed remittance provider, a bank replacement, or a mechanism that independently moves fiat funds.

## 2. Current Jordan regulatory assumptions

These assumptions require confirmation by qualified Jordanian counsel and the accountable buyer:

1. The Central Bank of Jordan supervises licensed money-exchange companies and assesses compliance with the Money Exchange Business Law, related instructions, and applicable AML/CFT requirements.
2. The JoRegBox framework expressly includes electronic payment and money-transfer services, RegTech, SupTech, RiskTech, and third-party digital services supporting regulated financial activity.
3. JoRegBox offers supervised testing; it does not itself prove that this product is admitted or approved.
4. Live customer testing, any regulatory relief, scope, caps, reporting, and exit conditions require the applicable written CBJ pathway.
5. Jordan’s Personal Data Protection Law No. 24 of 2023 requires a buyer-approved data analysis covering purpose, lawful basis, consent where applicable, minimization, security, retention, rights, processors, and transfers.
6. A licensed or otherwise authorized institution must own funds safeguarding, payment-rail connectivity, customer terms, complaints, and financial reconciliation accountability.
7. AML alerts are decision support. Accountable human staff remain responsible for investigation, override, escalation, and filing approval.

Primary sources:

- Central Bank of Jordan, [JoRegBox overview](https://www.cbj.gov.jo/EN/Pages/Regulatory_laboratory)
- Central Bank of Jordan, [2025 Regulatory Sandbox Framework](https://www.cbj.gov.jo/EBV4.0/Root_Storage/AR/FinTech/regulatory_sandbox_framework_1.pdf)
- Central Bank of Jordan, [Money Exchange Sector Supervision](https://www.cbj.gov.jo/En/Pages/Money_Exchange_Sector_Supervision)
- Central Bank of Jordan, [Payment Systems Legislation register](https://www.cbj.gov.jo/EN/List/Payment_Systems_Legislations)
- Ministry of Digital Economy and Entrepreneurship, [Personal Data Protection Law No. 24 of 2023](https://www.modee.gov.jo/EBV4.0/Root_Storage/EN/1/PDP_Law_-_English_Version-_officail_translation.pdf)

## 3. Proposed pilot scope

### Phase 0 — discovery (2 weeks)

- Identify the regulated sponsor and accountable executive.
- Confirm the legal perimeter and CBJ pathway.
- Select one origin/destination corridor.
- Approve a 5–10 broker cohort.
- Map data, systems, providers, retention, and residency.
- Establish baseline metrics and exit gates.

Exit: signed scope, assumptions register, data schedule, responsibility matrix, and pilot success plan.

### Phase 1 — configuration (3–4 weeks)

- Provision isolated sandbox access and explicit roles.
- Configure sponsor-approved policies and thresholds.
- Connect only test environments for approved providers.
- Import synthetic or masked records.
- Train operations, compliance, audit, and administrator users.
- Exercise backup, restoration, incident, and rollback procedures.

Exit: security review, user acceptance readiness, and no unresolved critical control gaps.

### Phase 2 — shadow pilot (4–6 weeks)

- Record transactions in parallel with the system of record.
- Compare screening results without autonomous decisions.
- Measure case handling, broker onboarding, reconciliation, and data completeness.
- Prepare filing drafts without external transmission.
- Do not move funds through the platform.

Exit: agreed accuracy, operating evidence, reconciled results, and signed exception plan.

### Phase 3 — controlled live pilot (6–8 weeks)

Allowed only after written legal, sponsor, security, provider, safeguarding, and authority approvals. Apply cohort, corridor, value, volume, and time caps with continuous monitoring and a tested rollback.

## 4. Pilot success scorecard

| Metric | Proposed target | Evidence |
|---|---:|---|
| Required record completeness | ≥95% | Mandatory-field report |
| Attributed compliance decisions | 100% | Audit-event export |
| Reconciliation exceptions assigned | ≤1 business day | Exception register |
| Screening precision/recall | Buyer-approved baseline | Labeled comparison set |
| False-positive rate | Measured, not pre-claimed | Review outcomes |
| Median broker onboarding time | Baseline and improvement | Onboarding timestamps |
| Cost per recorded transfer | Measured fully loaded cost | Sponsor cost model |
| Filing drafts with human approval | 100% | Filing/audit records |
| External transmissions during shadow phase | 0 | Connector and audit evidence |

No promise of a sub-2% customer fee should be made until a real corridor cost model includes FX, safeguarding, screening, identity, payment rails, operations, losses, taxes, and support.

## 5. Ten-minute buyer demonstration

1. **Truth banner (45 seconds):** explain synthetic data, simulated integrations, private access, and what is actually persisted.
2. **Jordan Pilot (75 seconds):** show cohort, corridor, caps, production gates, integration truth table, and success scorecard.
3. **Customer onboarding (60 seconds):** create a minimized customer record and explain the production identity dependency.
4. **Transfer screening (75 seconds):** record a transfer and show explainable rule outcomes.
5. **Human decision (90 seconds):** review provenance, evidence, note, and override rationale.
6. **Broker operations (75 seconds):** onboard a broker, inspect prefunding/net position, and settle or dispute a cycle.
7. **Regulatory evidence (75 seconds):** prepare a human-approved STR draft and state that nothing is transmitted.
8. **Supervisory view (45 seconds):** show aggregate corridor and licensed-entity information without customer PII.
9. **Commercial close (60 seconds):** propose a two-week discovery followed by a shadow pilot with explicit exit gates.

## 6. Screening-provider adapter contract

The product is provider-neutral. A production adapter must implement:

- sanctions and PEP name screening;
- provider request/reference identifiers;
- list or dataset version and timestamp;
- match candidates, scores, features, and disposition;
- response latency and error class;
- retry, circuit-breaker, and manual fallback behavior;
- update-frequency and stale-data indicators;
- jurisdiction and data-transfer constraints;
- test fixtures and reconciliation against provider reports; and
- complete audit attribution without storing prohibited provider content.

Before activation, require a signed provider contract, licensed data rights, sandbox and production credentials, security assessment, SLA, outage procedure, validation set, acceptance thresholds, and change-control owner.

## 7. Production security acceptance

Required evidence before controlled live use:

- Buyer SSO, MFA, joiner/mover/leaver provisioning, and quarterly access review.
- Explicit Administrator, Compliance Officer, Operator, and Auditor assignments.
- Separation of duties for configuration, case approval, settlement, and filing.
- Managed secrets, rotation, TLS, encryption-at-rest evidence, and key ownership.
- Approved hosting region, subprocessors, data-flow map, and cross-border transfer basis.
- Field inventory, minimization, retention, deletion, legal hold, and subject-rights workflow.
- Centralized security logs, alert ownership, clock synchronization, and tamper controls.
- Independent penetration test and remediation of critical/high findings.
- Backup schedule, encrypted copies, restoration test, and approved RTO/RPO.
- Incident-response plan, notification matrix, forensic preservation, and tabletop exercise.
- Vulnerability, dependency, patch, secure-development, and change-management processes.
- Business continuity, vendor exit, data export, and verified deletion procedures.

## 8. Settlement operating design

The platform records obligations; it does not safeguard or transfer fiat by itself.

- Sponsor owns safeguarded accounts and payment-rail contracts.
- Brokers operate within approved prefunding and exposure limits.
- Gross obligations are netted only under approved rules.
- Every cycle requires reconciliation, named approval, and an immutable audit record.
- Exceptions and disputes stop affected settlement positions until resolved.
- Optional distributed-ledger proof may be added only when multi-party governance justifies it.

## 9. Commercial and legal checklist

Before sharing non-public material or starting a pilot:

- Mutual NDA.
- Pilot statement of work with deliverables, milestones, acceptance criteria, fees, and termination.
- Data-processing agreement and pilot data schedule.
- Information-security schedule and incident obligations.
- IP ownership and customer-data ownership clauses.
- Third-party provider and pass-through fee schedule.
- Regulatory responsibility matrix.
- No-reliance language for simulated results.
- Restrictions on production use during shadow testing.
- Liability, confidentiality, audit, subcontracting, and exit terms reviewed by counsel.

## 10. Commercial identity actions

Use **HAWALA Compliance OS** as a working product name only. Before public outreach:

- commission a trademark and company-name clearance;
- choose a legal entity and ownership structure;
- acquire a professional domain and role-based email;
- create a bilingual wordmark and short product descriptor;
- define confidential-demo access and expiry;
- prepare an Arabic/English one-page buyer brief; and
- record founder, employee, and contractor IP assignments.

No trademark availability, company registration, domain availability, or regulator endorsement is claimed in this pack.

