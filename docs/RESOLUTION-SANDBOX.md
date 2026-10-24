# Resolution sandbox

Open Support journey in this branch. The new sandbox is separate from the active merchant interview. It uses synthetic fixtures and browser-local mock cases only.

Three separate incidents demonstrate missing Soundbox audio with a matching payment, a customer screenshot with no matching merchant record, and improvement requiring follow-up. Inspect prior history, transaction and device fixtures; choose a deterministic diagnostic; inspect and approve the exact case context; create a local mock case; retry; refresh; and check fixture follow-up. Export provides the synthetic action receipts and mock cases as JSON.

Source labels remain visible. A successful merchant receipt fixture does not verify bank settlement. A missing record does not establish financial loss. No repeat restart is recommended after the fixture already records an unsuccessful restart. The diagnostic never claims a proven root cause. Unresolved follow-up cannot close a case.

Case identity uses the synthetic incident as its idempotency key. A retry reuses the existing case, including after schema-validated reload from localStorage. A changed context or wrong-incident approval fails before creation. Storage failures preserve the last committed UI state. This is single-browser sequential demonstration behaviour, not a transactional distributed service: simultaneous tabs, deleted storage, device changes and malicious clients are outside its guarantees. Production requires authenticated server-side state, atomic uniqueness, scoped adapters and signed action receipts.

The sandbox does not import real merchant information or join its receipts to the interview's evidence/export graph. Its case review and export are separate. It makes no network requests to support, payment or device systems. No real ticket, financial operation, human connection or real merchant resolution occurs.

A separate fix filters critic-rejected observations out of claim-dependent tool results before planning. A regression test inspects the planner input to prevent reintroducing rejected claims through the coverage/evidence tools.

Validation on 24 October 2026: 74 automated tests pass, including seven new regressions. TypeScript and production build pass. Browser QA created DEMO-1, retried, refreshed and retried again: one mock case remained. Voice, physical mobile-camera accuracy, real support integration and a merchant pilot remain unvalidated for this extension.

This work is on merchantlens-resolution-sandbox. It does not replace the submitted Amazon deployment or amend any competition submission. No 9.9 rating, measured ROI or production readiness is claimed.
