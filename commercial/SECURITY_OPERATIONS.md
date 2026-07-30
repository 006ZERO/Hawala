# Security Operations Baseline

This file is a production-readiness checklist, not a certification.

## Access

- Platform identity: buyer-managed SSO.
- MFA: mandatory under buyer policy.
- Roles: Administrator, Compliance Officer, Operator, Auditor.
- Provisioning: approved ticket plus named owner.
- Deprovisioning: immediate on termination or role change.
- Review: quarterly and before each pilot phase.

## Data

- Maintain a field-level inventory with purpose and lawful basis.
- Minimize identity and license data.
- Separate synthetic, masked, and live environments.
- Configure retention by record class and jurisdiction.
- Support legal hold, deletion, export, and data-subject workflows.
- Document every processor, region, and transfer mechanism.

## Engineering

- Store secrets in a managed secrets service.
- Rotate credentials and keys on schedule and after incidents.
- Require encrypted transport and at-rest storage.
- Scan dependencies and images; patch against severity SLAs.
- Require reviewed changes and rollback plans.
- Centralize audit and security logs with restricted access.

## Resilience

- Define RTO/RPO with the buyer.
- Maintain encrypted backups in an approved region.
- Test restoration before live use and at least annually.
- Exercise incident response and business continuity.
- Preserve evidence and follow the buyer’s notification matrix.

## Pre-live evidence

- Architecture and data-flow review.
- Threat model.
- Independent penetration test.
- Backup restoration result.
- Incident tabletop result.
- Access-review record.
- Provider security assessments.
- Approved privacy/data schedule.
- Residual-risk acceptance signed by accountable executives.

