# HAWALA Compliance OS

A bilingual compliance and operations demo for licensed remittance and broker-led transfer networks.

![HAWALA Compliance OS preview](public/og.png)

## What this is

HAWALA Compliance OS is a public demonstration of how a regulated remittance workflow can be digitized without losing the speed and human trust that informal networks depend on.

It is designed for:

- licensed remittance operators
- exchange companies
- banks
- supervised pilot programs

The demo shows customer onboarding, broker oversight, transaction recording, AML review, case management, reconciliation, and regulator-ready audit trails using synthetic data.

## Why it exists

Many corridor-based remittance flows still move through brokers, chat apps, spreadsheets, and paper records. That keeps the service fast, but it makes compliance, audit, and supervision much harder than they should be.

This project explores a more formal operating model: one where the institution keeps control of the workflow, the compliance team gets better visibility, and the end experience stays usable for real operators.

## Demo scope

This repository is intentionally honest about what is simulated and what would need external approvals in production.

| Capability | Shown in the demo | Needed for production |
|---|---|---|
| Customer and broker workflows | Yes | Real identities, business onboarding, and access controls |
| Transaction monitoring | Yes | Licensed sanctions, PEP, and screening providers |
| Case management | Yes | Operational procedures and approved escalation paths |
| Regulatory reporting | Simulated | Authority-approved schema, channel, and legal process |
| Settlement and prefunding records | Yes | Licensed sponsor, safeguarded accounts, and payment rail |
| Security controls | Basic application controls | Independent penetration test and production infrastructure evidence |

Nothing in this repository claims live regulatory approval, live sanctions connectivity, or real funds movement.

## Screenshots and preview

- Preview image: [public/og.png](</C:/Users/gthsl/Documents/hawala%202.0/public/og.png>)
- Repository demo: the app runs from this codebase; use the preview image above for sharing

If you want to present it publicly, use the screenshot above or a hosted preview rather than a `localhost` link.

## Privacy and compliance

This project is not legal advice and is not a licensed remittance service.

- all sample data is synthetic or illustrative
- no private workspace metadata is meant for public distribution
- no live screening vendor, identity provider, payment rail, or central-bank integration is claimed here
- production use would require legal review, contractual controls, security review, and an approved operating model

## Technology

- Next.js
- TypeScript
- React
- Cloudflare Workers and D1
- Drizzle ORM
- English and Arabic UI support

## Local development

```bash
pnpm install
pnpm dev
```

Build the production bundle:

```bash
pnpm build
```

Run the safety checks:

```bash
pnpm test
```

## Repository layout

```text
app/         UI, authorization, and API routes
db/          Database schema and access helpers
drizzle/     Database migrations
public/      Static assets and preview image
tests/       Safety-boundary checks
```

## Security

Please report vulnerabilities privately as described in [`SECURITY.md`](SECURITY.md).

## License

This repository is public for evaluation and portfolio visibility, but no open-source license is granted. Copyright remains with the repository owner; copying, redistribution, modification, deployment, or commercial use requires written permission.
