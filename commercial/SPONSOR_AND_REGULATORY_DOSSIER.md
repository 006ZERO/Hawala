# HAWALA Compliance OS — Sponsor and Regulatory Dossier

Confidential working draft. Not legal advice, an application, regulatory approval, or an offer of regulated services.

## Executive proposition

HAWALA Compliance OS is a compliance and operations layer for a licensed institution that wants to onboard, monitor, reconcile, and supervise a controlled broker-led remittance network. The platform does not hold customer funds, move fiat, issue money, make autonomous legal decisions, or transmit statutory reports without an approved external connector and accountable human approval.

## Proposed sponsor

A Central Bank of Jordan-supervised exchange company, electronic-payment/money-transfer provider, or bank that owns:

- the regulated customer relationship;
- broker/agent eligibility and contracting;
- KYC/AML policy and accountable decisions;
- safeguarding and payment-rail arrangements;
- customer terms, complaints, and disclosures;
- regulatory communications and reporting; and
- final risk acceptance.

## Sponsor qualification

| Requirement | Evidence requested | Status |
|---|---|---|
| CBJ-supervised legal entity | License and permitted-activity summary | Buyer to provide |
| Executive sponsor | Named accountable executive | Buyer to provide |
| Compliance owner | MLRO/compliance officer and escalation chain | Buyer to provide |
| Pilot corridor | Origin, destination, currencies, volume | Joint decision |
| Broker cohort | 5–10 approved participants | Buyer to select |
| Safeguarding | Account structure and ownership | Buyer to provide |
| Payment rail | Approved rail and settlement operator | Buyer to provide |
| Data authority | Lawful basis, notices, processors, residency | Joint legal review |
| Screening/KYB | Licensed vendors and contracts | Buyer/vendor |
| Security acceptance | IAM, test, incident, resilience evidence | Joint approval |

## Two-week discovery statement of work

### Deliverables

1. Regulatory and responsibility map.
2. Target operating model and data flow.
3. Pilot corridor/cohort/cap definition.
4. Data inventory and privacy schedule.
5. Screening, identity, payment, and reporting integration plan.
6. Security gap assessment and evidence plan.
7. Baseline KPI design.
8. Shadow-pilot implementation plan, price, and exit gates.

### Acceptance

- Named owners accept every responsibility.
- No unresolved ambiguity about funds, licensing, filing, or customer ownership.
- Data and security boundaries are approved for the next phase.
- All simulated and external capabilities are correctly labeled.

## Responsibility matrix

| Activity | Product company | Licensed sponsor | Vendor | Counsel/authority |
|---|---|---|---|---|
| Platform configuration | R | A | C | I |
| Broker eligibility | C | A/R | C | I |
| Customer KYC decision | C | A/R | C | I |
| Screening data | C | A | R | I |
| AML case decision | C | A/R | C | I |
| STR approval/submission | I | A/R | C | C/I |
| Funds safeguarding | I | A/R | C | I |
| Payment execution | I | A | R | I |
| Reconciliation tooling | R | A | C | I |
| Privacy/legal basis | C | A | C | R/C |
| Security acceptance | R | A | C | I |
| Regulatory engagement | C | A/R | I | C/R |

A = Accountable, R = Responsible, C = Consulted, I = Informed.

## Counsel briefing questions

1. Which licensed activity and sponsor structure is required for the proposed corridor?
2. May software-only onboarding and compliance processing be supplied as outsourced technology?
3. What approvals, notices, outsourcing requirements, or JoRegBox pathway apply?
4. What rules govern brokers/agents, beneficial ownership, location, prefunding, and oversight?
5. Which KYC fields, verification methods, thresholds, enhanced due diligence, and record periods apply?
6. What STR preparation, approval, confidentiality, and transmission requirements apply?
7. What customer disclosures, fee/FX transparency, complaints, and safeguarding rules apply?
8. What lawful bases, notices, consent, DPIA, DPO, residency, processor, transfer, rights, and breach duties apply?
9. Are automated risk scores subject to explainability, human review, or model-governance obligations?
10. Which Arabic legal texts control when translations conflict?

## Draft JoRegBox application content

### Applicant

To be completed by the applying entity. HAWALA Compliance OS does not claim to be the licensed applicant.

### Innovation

A bilingual RegTech/operations platform that creates accountable records for broker-led remittance onboarding, transaction risk screening, case investigation, prefunding/net-position reconciliation, and human-approved regulatory evidence.

### Problem

Fragmented paper, messaging, and spreadsheet processes make transaction evidence, AML review, broker oversight, and reconciliation slow and difficult to supervise.

### Test hypothesis

A bounded digital workflow can improve record completeness, decision attribution, exception handling, and supervisory visibility without autonomous legal decisions or bypassing licensed funds movement.

### Proposed test

- 5–10 sponsor-approved brokers;
- one sponsor-approved corridor;
- synthetic/masked configuration phase;
- 4–6 week shadow pilot;
- controlled-live phase only if separately authorized;
- sponsor-approved value/volume/time caps;
- human approval for cases and filings;
- no direct customer funds held by the platform;
- continuous monitoring and tested rollback.

### Risks and mitigations

| Risk | Mitigation |
|---|---|
| Unlicensed activity | Licensed sponsor owns regulated services; explicit responsibility matrix |
| Incorrect screening | Licensed data, validation, human review, outage fallback |
| Privacy harm | Minimization, purpose limitation, access control, retention, approved processors |
| Cyber incident | IAM/MFA, encryption, testing, logging, incident and recovery exercises |
| Consumer harm | Caps, disclosures, complaints, rollback, sponsor ownership |
| Reconciliation failure | Prefunding limits, approvals, exception/dispute workflow |
| Regulatory-reporting error | Draft-only workflow until approved connector; human certification |

### Success measures

Use the scorecard in `pilot/kpi_scorecard.csv`. Targets require sponsor and authority approval.

### Exit

At completion, produce results, exceptions, consumer/security incidents, KPI evidence, residual risks, data disposition confirmation, and a joint stop/iterate/scale recommendation.

## Outreach message template

Subject: Controlled pilot proposal — broker-led remittance compliance and reconciliation

We have developed a private bilingual compliance and operations demonstration for regulated institutions that manage broker-led remittance activity. It records customer and broker due diligence, provides explainable AML case workflows, supports prefunding/net-position reconciliation, and prepares human-approved regulatory evidence. No live screening, funds movement, or authority connection is claimed.

We propose a two-week confidential discovery to assess one corridor and a small sponsor-approved broker cohort, followed only by a synthetic or shadow pilot if the legal, security, data, and operating boundaries are accepted. We would welcome a 45-minute product and operating-model review with your compliance, operations, technology, and innovation representatives.

## Sources to confirm with counsel

- CBJ JoRegBox framework and application guidance.
- CBJ money-exchange supervision and applicable Money Exchange Business Law/instructions.
- CBJ framework for electronic cross-border remittance.
- Applicable AML/CFT law and sector instructions.
- Personal Data Protection Law No. 24 of 2023 and implementing guidance.

